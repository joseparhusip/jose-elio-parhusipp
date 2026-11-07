<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useChatWidgetStore } from '../stores/chatWidget'
import { lang, t } from '@/composables/useLang'
import * as kbId from './chatKnowledge'
import * as kbEn from './chatKnowledge.en'

// Basis pengetahuan + pendeteksi maksud sesuai bahasa situs. Kedua modul
// mengekspor nama dan bentuk yang sama (lihat chatKnowledge.en.js), jadi
// semua logika di bawah cukup memanggil kb.value.<nama>.
const kb = computed(() => (lang.value === 'en' ? kbEn : kbId))

const chatStore = useChatWidgetStore()

// Alur percakapan sederhana: name -> email -> message -> submitting -> done/error
const step = ref('name')
const messages = ref([])
const inputValue = ref('')
const isBotTyping = ref(false)
const submitError = ref('')

const messagesEnd = ref(null)
const chatInputEl = ref(null)

const form = ref({ name: '', email: '', message: '' })

// Bot sedang menunggu klarifikasi untuk pertanyaan ambigu
// "pekerjaan"/"kerjaan" (bisa berarti riwayat kerja Jose, atau user yang
// mau nawarin kerjaan ke Jose). Nilainya string nama topik yang lagi
// diklarifikasi (misal 'pekerjaan'), atau null kalau tidak ada yang
// sedang diklarifikasi. Selama ada nilainya, pesan berikutnya dari user
// diartikan dulu sebagai jawaban klarifikasi ini, BUKAN nama/email/pesan.
const pendingClarify = ref(null)

// Tawaran lanjutan dari bot yang menunggu jawaban "iya/boleh" atau "nggak",
// misalnya setelah profil singkat: "mau aku ceritain lebih lengkap?".
// Bentuknya { type: 'aboutFull' | 'techProjects' | 'contact', ... } atau null.
const pendingOffer = ref(null)

// --- Persist ke localStorage, khusus buat chat widget ini -----------------
// Key sengaja dibuat spesifik (bukan cuma "chat") supaya kalau nanti ada
// fitur lain yang juga pakai localStorage di situs ini, nggak ketimpa.
// Riwayat disimpan per bahasa: key lama untuk Indonesia (riwayat yang sudah
// ada tetap terbaca), dan akhiran "-en" untuk percakapan bahasa Inggris.
const STORAGE_KEY = 'jose-portfolio-chat-widget-v1'
const storageKeyFor = (code) => (code === 'en' ? `${STORAGE_KEY}-en` : STORAGE_KEY)
// Dipakai supaya proses restore dari localStorage saat pertama buka widget
// tidak ikut ke-trigger sama watcher penyimpanan di bawah (biar nggak nyimpen
// ulang data yang baru aja dibaca).
let isRestoringState = false

function saveChatState(key = storageKeyFor(lang.value)) {
  if (isRestoringState) return
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        step: step.value === 'submitting' ? 'message' : step.value,
        messages: messages.value,
        form: form.value,
        pendingClarify: pendingClarify.value,
        pendingOffer: pendingOffer.value,
        msgId,
      }),
    )
  } catch (err) {
    // localStorage bisa gagal (mode private/incognito, kuota penuh, dst),
    // biarkan saja chat tetap jalan normal tanpa persist.
    console.warn('Gagal menyimpan riwayat chat:', err)
  }
}

function loadChatState() {
  try {
    const raw = localStorage.getItem(storageKeyFor(lang.value))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.messages) || parsed.messages.length === 0) return null
    return parsed
  } catch (err) {
    console.warn('Gagal membaca riwayat chat tersimpan:', err)
    return null
  }
}

function clearChatState() {
  try {
    localStorage.removeItem(storageKeyFor(lang.value))
  } catch (err) {
    console.warn('Gagal menghapus riwayat chat tersimpan:', err)
  }
}

let msgId = 0
// type: 'text' (default) atau 'cards' (dipakai buat jawaban FAQ experience/proyek).
// items: dipakai kalau type === 'cards', berisi array {title, subtitle, desc, tags, links}.
function pushMessage(from, text, type = 'text', items = null) {
  msgId += 1
  messages.value.push({ id: msgId, from, text, type, items })
  nextTick(scrollToBottom)
}

function scrollToBottom() {
  messagesEnd.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

// Nomor "generasi" percakapan. Naik setiap kali bahasa diganti, supaya
// balasan bot yang masih "mengetik" dari percakapan bahasa sebelumnya
// dibuang dan tidak nyasar ke percakapan bahasa yang baru.
let convGen = 0

// Kasih jeda kecil + indikator "sedang mengetik" biar kerasa natural,
// bukan cuma teks yang muncul instan.
function botSay(text, delay = 600, type = 'text', items = null) {
  const gen = convGen
  return new Promise((resolve) => {
    isBotTyping.value = true
    setTimeout(() => {
      // Percakapan sudah diganti (ganti bahasa): alur lama berhenti di sini.
      if (gen !== convGen) return
      isBotTyping.value = false
      pushMessage('bot', text, type, items)
      resolve()
    }, delay)
  })
}

// Teks dari pengunjung (mis. nama) WAJIB di-escape sebelum disisipkan ke
// pesan bot, karena pesan bot dirender pakai v-html. Tanpa ini, nama seperti
// <img src=x onerror=...> akan dieksekusi sebagai HTML (XSS) dan ikut
// tersimpan di localStorage.
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// --- Basa-basi: sapaan sesuai waktu, terima kasih, pamit, dsb. ---
// Mengembalikan true kalau pesan sudah dijawab sebagai basa-basi.
// Sapa balik dengan waktu yang disebut user ("selamat malam" -> "selamat
// malam juga"), kalau user cuma bilang "halo" pakai jam di perangkatnya.
function greetBack(text, name = '') {
  const said = kb.value.getUserTimeGreeting(text)
  if (lang.value === 'en') {
    return said ? `Good ${said} to you too${name}!` : `Hello${name}, and good ${kb.value.getTimeOfDay()}!`
  }
  return said ? `Selamat ${said} juga${name}!` : `Halo juga${name}, selamat ${kb.value.getTimeOfDay()}!`
}

async function answerSmallTalk(talk, text = '') {
  const time = kb.value.getUserTimeGreeting(text) || kb.value.getTimeOfDay()
  const name = form.value.name ? `, ${escapeHtml(form.value.name)}` : ''

  if (talk.type === 'greeting') {
    const extras = t({
      id: {
        pagi: 'Semoga harinya lancar ya.',
        siang: 'Jangan lupa makan siang ya.',
        sore: 'Gimana harinya sejauh ini?',
        malam: 'Makasih udah mampir malam-malam begini.',
      },
      en: {
        morning: 'I hope your day is off to a good start.',
        afternoon: 'I hope your day is going well.',
        evening: 'Thanks for stopping by this evening.',
      },
    })
    await botSay(`${greetBack(text, name)} ${extras[time]}`, 550)
  } else if (talk.type === 'howAreYou') {
    await botSay(
      pick('howAreYou', {
        id: [
          `Kabar baik dong${name}, makasih udah nanya! Kamu sendiri gimana?`,
          `Baik banget${name}, apalagi ada yang mampir ngobrol. Semoga kamu juga lagi baik ya.`,
          `Aku baik${name}! Makasih udah nanya, jarang-jarang ada yang nanyain kabar bot, hehe.`,
        ],
        en: [
          `I'm doing well${name}, thanks for asking! How about you?`,
          `Very well${name}, especially now that someone has stopped by to chat. I hope you're doing well too.`,
          `I'm good${name}! Thanks for asking, not many people ask a bot how it's doing.`,
        ],
      }),
      550,
    )
  } else if (talk.type === 'thanks') {
    await botSay(
      lang.value === 'en'
        ? kb.value.pickVariant('thanks', [
            `You're welcome${name}! Happy to help.`,
            `You're welcome${name}. If you have any other questions, I'm here.`,
            `My pleasure${name}!`,
          ])
        : kb.value.pickVariant('thanks', [
            `Sama-sama${name}! Senang bisa bantu.`,
            `Sama-sama${name}, santai aja. Kalau ada yang mau ditanyain lagi, aku di sini.`,
            `Dengan senang hati${name}!`,
          ]),
      450,
    )
  } else if (talk.type === 'bye') {
    await botSay(
      lang.value === 'en'
        ? kb.value.pickVariant('bye', [
            `Goodbye${name}! Have a good ${time}. Feel free to stop by again anytime.`,
            `Bye${name}! Thanks for visiting, and all the best.`,
            `Okay${name}, see you next time! This chat is always open.`,
          ])
        : kb.value.pickVariant('bye', [
            `Sampai jumpa${name}! Selamat ${time} dan semoga harinya menyenangkan. Kapan-kapan mampir lagi ya.`,
            `Dadah${name}! Makasih udah mampir, semoga lancar urusannya.`,
            `Oke${name}, sampai ketemu lagi! Pintu chat ini selalu terbuka kok.`,
          ]),
      500,
    )
    return true
  } else if (talk.type === 'aboutBot') {
    await botSay(
      lang.value === 'en'
        ? kb.value.pickVariant('aboutBot', [
            "I'm the automated chat assistant on Jose's portfolio. I'm not Jose himself, but I know his story well and can help pass your message on to his email.",
            "I'm Jose's assistant bot. My job is to chat with you about Jose and forward your message to him.",
          ])
        : kb.value.pickVariant('aboutBot', [
            'Aku asisten chat otomatis di portofolio Jose. Bukan Jose langsung ya, tapi aku hafal cerita soal dia dan bisa bantu nyampein pesan kamu ke email Jose.',
            'Aku bot asistennya Jose, hehe. Tugasku nemenin kamu ngobrol soal Jose dan nerusin pesan kamu ke dia.',
          ]),
      550,
    )
  } else if (talk.type === 'ack') {
    // "oke", "sip", dsb: tidak perlu dijawab panjang, cukup lanjut alurnya
  }

  // Pesan sudah selesai terkirim: tidak ada pertanyaan lanjutan
  if (step.value === 'done') {
    if (talk.type !== 'thanks' && talk.type !== 'greeting') {
      await botSay(
        t({
          id: 'Pesan kamu ke Jose sudah terkirim ya. Kalau mau kirim pesan lain, klik tombol "Kirim pesan lain".',
          en: 'Your message to Jose has been sent. If you want to send another one, click the "Send another message" button.',
        }),
        450,
      )
    }
    return true
  }

  const prompt = stepPrompt(talk.type)
  if (prompt) await botSay(prompt, 500)
  return true
}

// --- FAQ seputar Jose (siapa, about, kuliah, pengalaman, proyek, kontak) ---
// Dipanggil dari handleSend kalau pesan user cocok dengan salah satu intent
// dari matchFaqIntent(). Alur form kontak (nama/email/pesan) sama sekali
// tidak terganggu, cuma "dijeda" sebentar buat jawab pertanyaan ini.
// Semua teks di sini HTML siap render (dirender pakai v-html khusus
// pesan dari bot, lihat template di bawah).
function projectCards(list, withLinks) {
  return list.map((item) => ({
    title: item.title,
    desc: item.summary,
    image: item.image,
    tags: item.tags,
    // Proyek internal tidak punya demo/repo publik
    links: withLinks && !item.internal
      ? [
          { label: t({ id: 'Lihat Demo', en: 'View Demo' }), url: item.demoHref },
          { label: t({ id: 'Lihat Code', en: 'View Code' }), url: item.codeHref },
        ]
      : [],
  }))
}

// Pilih variasi kalimat sesuai bahasa aktif (kunci variasi sama untuk dua bahasa).
function pick(key, variants) {
  return kb.value.pickVariant(key, t(variants))
}

async function answerFaq(intent) {
  if (intent.type === 'education') {
    await botSay(
      pick('educationLead', {
        id: [
          'Boleh! Soal pendidikan, gini ceritanya:',
          'Oke, ini latar belakang kuliah Jose:',
          'Siap, aku ceritain soal kuliahnya ya.',
        ],
        en: [
          "Sure! Here's an overview of his education:",
          "Okay, here's Jose's academic background:",
          'Of course, let me tell you about his studies.',
        ],
      }),
      450,
    )
    await botSay(kb.value.EDUCATION_HTML, 400)
    return
  }

  // Profil: ringkas dulu, baru tawarkan versi lengkap (tidak langsung
  // menumpahkan teks panjang, seperti orang yang ditanya "Jose itu siapa?").
  if (intent.type === 'about') {
    await botSay(
      pick('aboutLead', {
        id: ['Boleh banget!', 'Oh, tentang Jose ya? Boleh!', 'Siap, aku kenalin.'],
        en: ['Sure!', 'About Jose? Of course!', 'Happy to introduce him.'],
      }),
      400,
    )
    await botSay(kb.value.ABOUT_SHORT_HTML, 500)
    await botSay(
      pick('aboutOffer', {
        id: [
          'Mau aku ceritain lebih lengkap? Misalnya keahlian dan tools yang dia kuasai.',
          'Kalau mau, aku bisa ceritain versi lengkapnya. Mau?',
        ],
        en: [
          'Would you like to hear more? For example, his skills and the tools he works with.',
          'If you like, I can share the full version. Would you like that?',
        ],
      }),
      450,
    )
    pendingOffer.value = { type: 'aboutFull' }
    return true
  }

  if (intent.type === 'experience') {
    await botSay(
      pick('experienceLead', {
        id: [
          'Boleh! Ini perjalanan kerja Jose sejauh ini:',
          'Siap, ini beberapa peran yang pernah Jose jalani, dari kerja profesional sampai organisasi:',
          'Oke, aku rangkum pengalaman Jose ya:',
        ],
        en: [
          "Sure! Here's Jose's career journey so far:",
          'Of course, here are the roles Jose has held, from professional work to student organizations:',
          "Okay, here's a summary of Jose's experience:",
        ],
      }),
      500,
    )
    await botSay(kb.value.buildExperienceListHtml(), 350)
    return false
  }

  if (intent.type === 'projects') {
    await botSay(
      pick('projectsLead', {
        id: [
          'Boleh! Ini beberapa proyek yang pernah Jose kerjakan:',
          'Siap, ini karya-karya Jose. Ada web, mobile, sampai dasbor data:',
          'Oke, nih proyek-proyeknya Jose:',
        ],
        en: [
          'Sure! Here are some of the projects Jose has worked on:',
          "Of course, here's Jose's work, from web and mobile apps to data dashboards:",
          "Okay, here are Jose's projects:",
        ],
      }),
      500,
    )
    await botSay('', 350, 'cards', projectCards(kb.value.PROJECTS, intent.wantsLink))
    if (!intent.wantsLink) {
      await botSay(
        t({
          id: 'Mau aku kasih link demo dan repo-nya juga?',
          en: 'Would you like the demo and repository links as well?',
        }),
        500,
      )
      pendingOffer.value = { type: 'projectLinks' }
      return true // suppress prompt lanjutan form (nama/email/pesan) di giliran ini
    }
    return false
  }

  if (intent.type === 'contact') {
    await botSay(kb.value.CONTACT_HTML.replace('{email}', kb.value.PROFILE.email))
    return false
  }

  // "pekerjaan"/"kerjaan" sendirian itu ambigu (riwayat kerja Jose, atau
  // user mau nawarin kerjaan ke Jose?), jadi nanya balik dulu daripada
  // asal nebak. Jawabannya ditangkep di processMessage lewat pendingClarify.
  if (intent.type === 'ambiguous_pekerjaan') {
    await botSay(
      t({
        id: 'Maksudnya gimana nih, kamu mau tau riwayat/pengalaman kerja Jose, atau kamu yang mau nawarin kerjaan atau kolaborasi ke Jose?',
        en: "Just to be sure, would you like to know about Jose's work history and experience, or would you like to offer him a job or a collaboration?",
      }),
      500,
    )
    pendingClarify.value = 'pekerjaan'
    return true // suppress prompt lanjutan, tunggu jawaban klarifikasi dulu
  }

  // Pertanyaan yang jelas di luar topik seputar Jose (resep, cuaca, dst).
  if (intent.type === 'offtopic') {
    await botSay(kb.value.OFFTOPIC_HTML)
    return false
  }
}

// --- Maksud percakapan yang lebih spesifik (lihat matchConversation) -------
// Return true kalau pertanyaan lanjutan form (nama/email/pesan) tidak perlu
// ditanyakan di giliran ini (mis. bot baru saja menawarkan sesuatu).
async function answerConversation(intent, body) {
  const name = form.value.name ? `, ${escapeHtml(form.value.name)}` : ''
  const en = lang.value === 'en'

  if (intent.type === 'meetBot') {
    // "aku mau kenalan sama kamu, namaku budi" -> langsung pakai namanya
    const stated = step.value === 'name' ? kb.value.matchNameStatement(body) : null
    if (stated) {
      form.value.name = stated.name
      step.value = form.value.email ? 'message' : 'email'
      await botSay(
        en
          ? `Nice to meet you, ${escapeHtml(stated.name)}! I'm the chat assistant on Jose's portfolio.`
          : `Boleh banget, salam kenal ${escapeHtml(stated.name)}! Aku asisten chat di portofolio Jose.`,
        500,
      )
      await botSay(
        form.value.email
          ? t({
              id: 'Ada yang mau kamu tanyain atau sampein ke Jose?',
              en: 'Is there anything you would like to ask or tell Jose?',
            })
          : t({
              id: 'Kalau nanti mau kirim pesan ke Jose, email kamu apa? Atau mau ngobrol soal Jose dulu juga boleh.',
              en: "If you'd like to send Jose a message later, what's your email? Or we can talk about Jose first, that's fine too.",
            }),
        450,
      )
      return true
    }
    if (form.value.name) {
      await botSay(
        en
          ? kb.value.pickVariant('meetAgain', [
              `We've already met${name}! I'm Jose's chat assistant. Is there anything you'd like to know about him?`,
              `We already know each other${name}. Go ahead, what would you like to know about Jose?`,
            ])
          : kb.value.pickVariant('meetAgain', [
              `Hehe, kita kan udah kenalan${name}! Aku asisten chat-nya Jose. Ada yang mau kamu tau soal dia?`,
              `Udah kenal dong kita${name}. Ngobrol aja, mau tanya soal Jose apa?`,
            ]),
        500,
      )
      return true
    }
    await botSay(
      pick('meetBot', {
        id: [
          'Boleh banget! Senang bisa kenalan sama kamu.',
          'Wah, boleh dong! Aku juga senang kenalan.',
          'Tentu boleh!',
        ],
        en: ['Of course! Nice to meet you.', "Sure! It's nice to meet you too.", 'Absolutely!'],
      }),
      450,
    )
    await botSay(
      t({
        id: 'Aku asisten chat di portofolio Jose. Tugasku nemenin kamu ngobrol soal Jose dan bantu nyampein pesan ke dia. Nah, gantian dong, nama kamu siapa?',
        en: "I'm the chat assistant on Jose's portfolio. I'm here to chat with you about Jose and help pass your message on to him. Now it's your turn, what's your name?",
      }),
      550,
    )
    return true
  }

  if (intent.type === 'aboutJose') return answerFaq({ type: 'about' })

  if (intent.type === 'askBotName') {
    await botSay(
      t({
        id: 'Aku belum punya nama resmi, hehe. Panggil aja "asisten Jose". Kalau kamu, namanya siapa?',
        en: 'I don\'t have an official name yet. You can call me "Jose\'s assistant". What\'s your name?',
      }),
      500,
    )
    return true
  }

  if (intent.type === 'botCapabilities') {
    await botSay(
      pick('capLead', {
        id: ['Banyak kok!', 'Boleh, ini yang bisa aku bantu:', 'Siap!'],
        en: ['Quite a few things!', "Sure, here's what I can help with:", 'Of course!'],
      }),
      350,
    )
    await botSay(kb.value.TOPICS_MENU_HTML, 400)
    return true
  }

  if (intent.type === 'askHuman') {
    await botSay(
      t({
        id: 'Ini aku, asisten chat-nya, bukan Jose langsung. Tapi pesan kamu bisa aku teruskan ke email Jose, dan dia biasanya balas dalam sehari. Mau aku bantu kirimin?',
        en: "This is his chat assistant, not Jose himself. But I can forward your message to Jose's email, and he usually replies within a day. Would you like me to help you send one?",
      }),
      550,
    )
    pendingOffer.value = { type: 'contact' }
    return true
  }

  if (intent.type === 'personal') {
    await botSay(
      pick('personal', {
        id: [
          'Hmm, itu info pribadi yang aku nggak pegang. Kalau memang perlu, kamu bisa tanya langsung ke Jose lewat pesan ya.',
          'Wah, yang itu aku nggak tahu, hehe. Aku cuma pegang info soal kerjaan, pendidikan, dan proyek Jose.',
        ],
        en: [
          "Hmm, that's personal information I don't have. If you really need it, you can ask Jose directly by sending him a message.",
          "I'm afraid I don't know that one. I only have information about Jose's work, education, and projects.",
        ],
      }),
      500,
    )
    return false
  }

  if (intent.type === 'gpa') {
    await botSay(
      t({
        id: 'Soal nilai kuliah aku nggak tampilkan di sini ya. Yang pasti Jose lulusan S1 Bisnis Digital ULBI Bandung. Kalau perlu detailnya, tanya langsung ke Jose lewat pesan.',
        en: "I don't share his grades here. What I can tell you is that Jose holds a Bachelor of Digital Business from ULBI Bandung. If you need the details, feel free to ask Jose directly by message.",
      }),
      500,
    )
    return false
  }

  if (intent.type === 'cert') {
    await botSay(
      t({
        id: 'Ada beberapa: <strong>SAP01 SAP Overview</strong> (EDUGATE, 2025), peserta <strong>P2MW 2023</strong> kategori Bisnis Digital, bootcamp karier IT dari <strong>SmartPath</strong> (2024), dan kursus <strong>CodeIgniter 3 &amp; API Raja Ongkir</strong> di Udemy (2023). Semuanya bisa dilihat di bagian <strong>Sertifikat</strong>.',
        en: 'He has several: <strong>SAP01 SAP Overview</strong> (EDUGATE, 2025), participant in <strong>P2MW 2023</strong> in the Digital Business category, an IT career bootcamp from <strong>SmartPath</strong> (2024), and the <strong>CodeIgniter 3 &amp; Raja Ongkir API</strong> course on Udemy (2023). You can see all of them in the <strong>Certificates</strong> section.',
      }),
      500,
    )
    return false
  }

  if (intent.type === 'cv') {
    await botSay(
      t({
        id: 'CV Jose bisa kamu unduh lewat tombol <strong>"Unduh CV"</strong> di bagian paling atas halaman ini. Formatnya PDF.',
        en: 'You can download Jose\'s CV with the <strong>"Download CV"</strong> button at the top of this page. It\'s a PDF.',
      }),
      500,
    )
    return false
  }

  if (intent.type === 'currentJob') {
    const now = kb.value.EXPERIENCES[0]
    await botSay(
      en
        ? `Jose currently works as a ${now.role} (contract) at PT Sistem Pelayanan Kesehatan dan Data (SPKD) in South Jakarta. There, he builds the MedCredix backend with Go, Gin, and PostgreSQL.`
        : `Sekarang Jose kerja sebagai ${now.role}, ${now.company.charAt(0).toLowerCase()}${now.company.slice(1)}. Di sana dia ngerjain <em>backend</em> MedCredix pakai Go, Gin, dan PostgreSQL.`,
      550,
    )
    return false
  }

  if (intent.type === 'location') {
    await botSay(
      t({
        id: 'Jose berbasis di Bekasi, Jawa Barat. Kerja kontraknya sekarang di Jakarta Selatan.',
        en: 'Jose is based in Bekasi, West Java. His current contract role is in South Jakarta.',
      }),
      500,
    )
    return false
  }

  if (intent.type === 'availability') {
    await botSay(
      en
        ? `Yes${name}, Jose is open to job opportunities, freelance work, and collaborations. Would you like me to help pass your message or offer on to him?`
        : `Iya${name}, Jose lagi terbuka buat peluang kerja, <em>freelance</em>, maupun kolaborasi. Mau aku bantu sampein pesan atau tawaran kamu ke dia?`,
      550,
    )
    pendingOffer.value = { type: 'contact' }
    return true
  }

  if (intent.type === 'social') {
    await botSay(
      [
        t({ id: '<p>Ini akun-akun Jose:</p>', en: "<p>Here are Jose's accounts:</p>" }),
        '<ul class="chat-widget__highlight-list">',
        '<li>GitHub: <a href="https://github.com/joseparhusip" target="_blank" rel="noopener noreferrer">github.com/joseparhusip</a></li>',
        '<li>LinkedIn: <a href="https://www.linkedin.com/in/joseparhusip/" target="_blank" rel="noopener noreferrer">linkedin.com/in/joseparhusip</a></li>',
        '<li>Instagram: <a href="https://www.instagram.com/joseparhusip_/" target="_blank" rel="noopener noreferrer">@joseparhusip_</a></li>',
        '</ul>',
      ].join(''),
      500,
    )
    return false
  }

  if (intent.type === 'skills') {
    await botSay(
      en
        ? `Jose works with ${kb.value.TOOLS_TEXT}. He is also experienced in system design with UML, ERD, and Flowchart, and he holds an SAP certificate.`
        : `Jose biasa pakai ${kb.value.TOOLS_TEXT}. Dia juga terbiasa merancang sistem pakai UML, ERD, dan Flowchart, plus punya sertifikasi SAP.`,
      550,
    )
    await botSay(
      t({
        id: 'Mau tanya soal satu tools tertentu? Misalnya "Jose bisa Flutter?"',
        en: 'Want to ask about a specific tool? For example, "Does Jose know Flutter?"',
      }),
      400,
    )
    return true
  }

  if (intent.type === 'techCheck') {
    const { projects, roles } = kb.value.findTechEvidence(intent.tech)
    const joinList = kb.value.joinList
    const places = en
      ? [
          ...(projects.length
            ? [`in the ${joinList(projects.map((p) => p.title))} ${projects.length === 1 ? 'project' : 'projects'}`]
            : []),
          // Peran yang sama (mis. dua kali Back End Developer) cukup disebut sekali
          ...[...new Set(roles.map((r) => r.role.replace(/<[^>]+>/g, '')))].map((role) => `in his work as ${/^[aeiou]/i.test(role) ? 'an' : 'a'} ${role}`),
        ]
      : [
          ...(projects.length ? [`proyek ${joinList(projects.map((p) => p.title))}`] : []),
          ...roles.map((r) => `waktu jadi ${r.role.replace(/<[^>]+>/g, '')}`),
        ]
    if (!places.length) {
      await botSay(
        en
          ? `Yes! ${intent.tech.name} is one of the tools Jose works with.`
          : `Bisa! ${intent.tech.name} termasuk tools yang Jose kuasai.`,
        500,
      )
      return false
    }
    await botSay(
      en
        ? `${kb.value.pickVariant('techYes', ['Yes, he does!', 'Yes!', 'Yes, definitely.'])} Jose has used ${intent.tech.name} ${joinList(places)}.`
        : `${kb.value.pickVariant('techYes', ['Bisa dong!', 'Bisa!', 'Iya, bisa.'])} Jose pernah pakai ${intent.tech.name} di ${joinList(places)}.`,
      500,
    )
    if (projects.length) {
      await botSay(
        en
          ? `Would you like to see the ${projects.length === 1 ? 'project' : 'projects'} that ${projects.length === 1 ? 'uses' : 'use'} ${intent.tech.name}?`
          : `Mau aku tunjukin proyek yang pakai ${intent.tech.name}?`,
        400,
      )
      pendingOffer.value = { type: 'techProjects', titles: projects.map((p) => p.title) }
      return true
    }
    return false
  }

  if (intent.type === 'techUnknown') {
    const tech = intent.tech.charAt(0).toUpperCase() + intent.tech.slice(1)
    await botSay(
      en
        ? `Hmm, ${escapeHtml(tech)} isn't on the list of Jose's tools that I know of. The tools he usually works with are ${kb.value.TOOLS_TEXT}. If it's important, feel free to ask Jose directly, he may know it too.`
        : `Hmm, ${escapeHtml(tech)} belum ada di daftar tools Jose yang aku tahu. Yang biasa dia pakai itu ${kb.value.TOOLS_TEXT}. Kalau penting, coba tanya langsung ke Jose ya, siapa tahu dia juga bisa.`,
      550,
    )
    return false
  }

  if (intent.type === 'projectDetail') {
    const one = intent.projects.length === 1
    await botSay(
      en
        ? one
          ? `Ah, ${intent.projects[0].title}! Here are the details:`
          : 'There are two matching projects:'
        : one
          ? `Oh, ${intent.projects[0].title}! Ini detailnya:`
          : 'Ada dua proyek yang cocok nih:',
      450,
    )
    await botSay('', 350, 'cards', projectCards(intent.projects, true))
    return false
  }

  if (intent.type === 'compliment') {
    await botSay(
      en
        ? kb.value.pickVariant('compliment', [
            `Thank you so much${name}! I'll pass that on to Jose, I'm sure he'll be glad to hear it.`,
            `Thanks${name}! Jose will be happy to hear that.`,
            `Thank you${name}! Is there anything you'd like to know more about his work?`,
          ])
        : kb.value.pickVariant('compliment', [
            `Makasih banyak${name}! Nanti aku sampein ke Jose, pasti dia senang.`,
            `Wah, makasih${name}! Jose bakal senang dengarnya.`,
            `Hehe, makasih ya${name}! Ada yang mau kamu tau lebih jauh soal karyanya?`,
          ]),
      450,
    )
    return false
  }

  if (intent.type === 'laugh') {
    await botSay(
      pick('laugh', { id: ['Hehe.', 'Wkwk, iya.', 'Haha, santai ya.'], en: ['Haha.', 'Haha, indeed.', 'Glad that made you smile.'] }),
      350,
    )
    return false
  }

  if (intent.type === 'projectInquiry') {
    await botSay(
      en
        ? `That's definitely something to discuss${name}! Jose is open to web, mobile, and data dashboard projects.`
        : `Bisa banget dibicarakan${name}! Jose terbuka untuk proyek web, mobile, maupun dasbor data.`,
      500,
    )
    await botSay(
      t({
        id: 'Soal detail kebutuhan, waktu, dan budget, paling pas langsung dibahas sama Jose. Mau aku bantu kirim pesan ke dia sekarang?',
        en: 'Details such as requirements, timeline, and budget are best discussed with Jose directly. Would you like me to help you send him a message now?',
      }),
      500,
    )
    pendingOffer.value = { type: 'contact' }
    return true
  }

  // --- Filter: permintaan yang memang tidak bisa / tidak pantas dilayani ---
  if (intent.type === 'money') {
    await botSay(
      pick('money', {
        id: [
          'Waduh, kalau soal uang aku nggak bisa bantu, hehe. Aku cuma asisten chat, nggak pegang dompet sama sekali.',
          'Hehe, maaf ya, aku nggak bisa kasih atau minjemin uang. Aku di sini cuma buat cerita soal Jose dan nyampein pesan ke dia.',
          'Aduh, dompetku kosong, aku kan cuma bot. Kalau soal Jose, aku siap bantu!',
        ],
        en: [
          "Sorry, I can't help with money matters. I'm just a chat assistant, so I don't handle any money at all.",
          "Sorry, I can't give or lend money. I'm only here to tell you about Jose and pass your message on to him.",
          "I'm afraid my wallet is empty, I'm just a bot. But if it's about Jose, I'm happy to help!",
        ],
      }),
      500,
    )
    return false
  }

  if (intent.type === 'inappropriate') {
    await botSay(
      t({
        id: 'Maaf, untuk hal seperti itu aku nggak bisa bantu. Aku cuma bisa ngobrol soal profil, pengalaman, proyek, dan kontak Jose ya.',
        en: "Sorry, I can't help with that. I can only talk about Jose's profile, experience, projects, and contact details.",
      }),
      500,
    )
    return false
  }

  if (intent.type === 'illegal') {
    await botSay(
      t({
        id: 'Maaf, aku nggak bisa bantu untuk hal yang merugikan orang lain atau melanggar aturan. Kalau mau ngobrol soal Jose atau proyeknya, aku siap.',
        en: "Sorry, I can't help with anything that could harm others or break the rules. If you'd like to talk about Jose or his projects, I'm here.",
      }),
      500,
    )
    return false
  }

  if (intent.type === 'flirt') {
    await botSay(
      pick('flirt', {
        id: [
          'Hehe, makasih, tapi aku cuma bot asistennya Jose. Hatiku isinya data proyek semua.',
          'Waduh, aku jadi salah tingkah, padahal aku cuma bot. Mending kita ngobrolin karya-karya Jose aja, yuk?',
        ],
        en: [
          "That's kind of you, but I'm just Jose's assistant bot. My heart is full of project data.",
          "You're making me blush, and I'm only a bot. How about we talk about Jose's work instead?",
        ],
      }),
      500,
    )
    return false
  }

  if (intent.type === 'homework') {
    await botSay(
      t({
        id: 'Aku nggak bisa ngerjain tugas atau kode kamu langsung di sini. Tapi kalau kamu butuh bantuan untuk proyek, Jose bisa diajak diskusi. Mau aku bantu sampein pesan ke dia?',
        en: "I can't do your assignment or write your code here. But if you need help with a project, Jose is open to a discussion. Would you like me to help pass a message on to him?",
      }),
      550,
    )
    pendingOffer.value = { type: 'contact' }
    return true
  }

  if (intent.type === 'offtopicTopic') {
    await botSay(
      en
        ? kb.value.pickVariant('offtopicTopic', [
            `Sorry, I can't help with questions about ${intent.topic}. I'm here to talk about Jose: his profile, experience, projects, and how to contact him.`,
            `Hmm, ${intent.topic} is outside what I know. But if you'd like to know about Jose, just ask.`,
            `Sorry, ${intent.topic} isn't my area. I'm only the assistant for Jose's portfolio.`,
          ])
        : kb.value.pickVariant('offtopicTopic', [
            `Wah, soal ${intent.topic} aku nggak bisa bantu jawab. Aku khusus ngobrolin Jose: profil, pengalaman, proyek, dan cara menghubungi dia.`,
            `Hmm, ${intent.topic} itu di luar yang aku tahu, hehe. Tapi kalau mau tahu soal Jose, tanya aja.`,
            `Maaf, untuk urusan ${intent.topic} aku bukan ahlinya. Aku cuma asisten portofolio Jose.`,
          ]),
      500,
    )
    return false
  }

  // --- Obrolan ringan ke bot ---
  if (intent.type === 'testMsg') {
    await botSay(
      pick('testMsg', {
        id: ['Masuk kok! Pesannya sampai.', 'Ada, aku di sini. Ada yang bisa aku bantu?'],
        en: ['Received! Your message came through.', "I'm here. How can I help?"],
      }),
      350,
    )
    return false
  }

  // Jam & tanggal diambil dari perangkat pengunjung (zona waktunya sendiri)
  if (intent.type === 'timeNow') {
    const time = new Intl.DateTimeFormat(en ? 'en-GB' : 'id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date())
    await botSay(
      en
        ? `It's <strong>${time}</strong> according to your device's clock. Good ${kb.value.getTimeOfDay()}${name}!`
        : `Sekarang jam <strong>${time}</strong> menurut jam di perangkat kamu. Selamat ${kb.value.getTimeOfDay()}${name}!`,
      400,
    )
    return false
  }

  if (intent.type === 'dateNow') {
    const date = new Intl.DateTimeFormat(en ? 'en-GB' : 'id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
    await botSay(en ? `Today is <strong>${date}</strong>.` : `Hari ini <strong>${date}</strong>.`, 400)
    return false
  }

  if (intent.type === 'botAge') {
    await botSay(
      t({
        id: 'Hehe, aku masih baru kok, umurku seumur portofolio ini. Kalau Jose, dia sudah lulus kuliah dan sekarang kerja.',
        en: "I'm still quite new, I'm as old as this portfolio. As for Jose, he has graduated from university and is now working.",
      }),
      450,
    )
    return false
  }

  if (intent.type === 'botLanguage') {
    await botSay(
      t({
        id: 'Aku paling lancar bahasa Indonesia, termasuk bahasa gaul. Bahasa Inggris aku ngerti sedikit, misalnya "education" atau "projects". Jawabanku tetap pakai bahasa Indonesia ya.',
        en: 'I can chat in English and Indonesian. I follow the language selected for the site, so switch the language in the navigation bar if you prefer Indonesian.',
      }),
      500,
    )
    return false
  }

  if (intent.type === 'botLikes') {
    await botSay(
      t({
        id: 'Aku paling suka kalau ada yang nanya soal proyek Jose, hehe. Mau aku tunjukin salah satunya?',
        en: "My favorite thing is when someone asks about Jose's projects. Would you like me to show you some?",
      }),
      450,
    )
    pendingOffer.value = { type: 'projectsAll' }
    return true
  }

  if (intent.type === 'apology') {
    await botSay(
      pick('apology', {
        id: ['Santai aja, nggak apa-apa kok!', 'Nggak masalah, tenang aja.'],
        en: ["No worries, it's all good!", 'No problem at all.'],
      }),
      350,
    )
    return false
  }

  if (intent.type === 'askPermission') {
    await botSay(
      pick('askPermission', {
        id: ['Boleh banget, tanya aja!', 'Tentu boleh, silakan!', 'Boleh dong, mau tanya soal apa?'],
        en: ['Of course, go ahead!', 'Sure, ask away!', 'Of course, what would you like to know?'],
      }),
      350,
    )
    return true
  }

  if (intent.type === 'goodnight') {
    await botSay(
      en
        ? `Good night${name}! Thanks for stopping by. If you have any questions about Jose tomorrow, I'll still be here.`
        : `Selamat istirahat${name}! Makasih udah mampir. Kalau besok ada yang mau ditanya soal Jose, aku masih di sini.`,
      450,
    )
    return true
  }

  if (intent.type === 'botMaker') {
    await botSay(
      t({
        id: 'Aku dibuat khusus untuk portofolio Jose, buat nemenin pengunjung ngobrol soal dia dan nyampein pesan ke emailnya.',
        en: "I was made specifically for Jose's portfolio, to chat with visitors about him and pass their messages on to his email.",
      }),
      500,
    )
    return false
  }

  if (intent.type === 'botGender') {
    await botSay(
      t({
        id: 'Hehe, aku bukan cewek atau cowok, aku cuma bot asistennya Jose.',
        en: "I'm neither, I'm just Jose's assistant bot.",
      }),
      400,
    )
    return false
  }

  if (intent.type === 'botHome') {
    await botSay(
      t({
        id: 'Aku "tinggal" di website ini, hehe. Kalau Jose sendiri, dia berbasis di Bekasi, Jawa Barat.',
        en: 'I "live" on this website. Jose himself is based in Bekasi, West Java.',
      }),
      450,
    )
    return false
  }

  if (intent.type === 'botEat') {
    await botSay(
      pick('botEat', {
        id: [
          'Bot nggak perlu makan, hehe. Tapi makasih udah perhatian! Kamu sendiri jangan lupa makan ya.',
          'Aku cukup "makan" listrik, hehe. Kamu udah?',
        ],
        en: [
          "Bots don't need to eat, but thanks for asking! Don't forget to have a meal yourself.",
          'Electricity is all I need. Have you eaten?',
        ],
      }),
      450,
    )
    return false
  }

  if (intent.type === 'botActivity') {
    await botSay(
      pick('botActivity', {
        id: [
          'Lagi nungguin ada yang ngajak ngobrol, eh kamu datang. Ada yang mau ditanya soal Jose?',
          'Lagi jagain portofolio Jose nih. Kamu lagi cari info soal dia?',
        ],
        en: [
          'Just waiting for someone to chat with, and here you are. Is there anything you want to know about Jose?',
          "Looking after Jose's portfolio. Are you looking for information about him?",
        ],
      }),
      450,
    )
    return true
  }

  if (intent.type === 'mood') {
    await botSay(
      en
        ? kb.value.pickVariant('mood', [
            `Hang in there${name}! If you're tired, it's okay to take a break.`,
            `I'm sorry to hear that${name}. I hope things get better soon. If you'd like a light chat about Jose, I'm here.`,
          ])
        : kb.value.pickVariant('mood', [
            `Semangat ya${name}! Kalau lagi capek, istirahat dulu juga gapapa.`,
            `Peluk jauh${name}. Semoga cepat membaik ya. Kalau mau ngobrol santai soal Jose, aku temenin.`,
          ]),
      450,
    )
    return true
  }

  if (intent.type === 'happy') {
    await botSay(
      en
        ? `Glad to hear that${name}! I hope the rest of your day is just as good.`
        : `Ikut senang dengarnya${name}! Semoga harinya terus menyenangkan.`,
      400,
    )
    return false
  }

  if (intent.type === 'rude') {
    await botSay(
      t({
        id: 'Waduh, santai dulu ya. Aku di sini buat bantu. Kalau ada yang kurang pas, bilang aja, nanti aku coba bantu sebisanya.',
        en: "Let's keep things friendly. I'm here to help. If something isn't right, just let me know and I'll do my best to help.",
      }),
      500,
    )
    return false
  }

  return false
}

// Jawab tawaran yang sedang menunggu (pendingOffer). Return true kalau
// pesan user memang jawaban ya/tidak untuk tawaran itu.
async function answerPendingOffer(text) {
  const offer = pendingOffer.value
  const norm = kb.value.normalizeChat(text)
  const yes = kb.value.YES_RX.test(norm)
  const no = !yes && kb.value.NO_RX.test(norm)
  if (!offer || (!yes && !no)) return false

  pendingOffer.value = null
  takeUserMessage(text)

  if (no) {
    await botSay(
      pick('offerNo', {
        id: [
          'Oke, gapapa! Ada lagi yang mau ditanyain soal Jose?',
          'Siap, nggak masalah. Kalau ada yang mau ditanya lagi, bilang aja ya.',
        ],
        en: [
          'Okay, no problem! Is there anything else you would like to know about Jose?',
          "Sure, that's fine. If you have any other questions, just let me know.",
        ],
      }),
      400,
    )
    return true
  }

  if (offer.type === 'aboutFull') {
    await botSay(kb.value.ABOUT_HTML, 550)
  } else if (offer.type === 'projectsAll') {
    await answerFaq({ type: 'projects', wantsLink: true })
    return true
  } else if (offer.type === 'projectLinks') {
    await botSay(
      t({ id: 'Nih link demo dan repo-nya:', en: 'Here are the demo and repository links:' }),
      400,
      'cards',
      projectCards(kb.value.PROJECTS.filter((p) => !p.internal), true),
    )
    await botSay(
      t({
        id: 'MedCredix dan SIMRS Dashboard itu proyek internal kantor, jadi demo dan kodenya nggak dipublikasikan.',
        en: 'MedCredix and SIMRS Dashboard are internal company projects, so their demos and code are not public.',
      }),
      450,
    )
  } else if (offer.type === 'techProjects') {
    await botSay(t({ id: 'Nih proyeknya:', en: 'Here you go:' }), 400)
    await botSay(
      '',
      350,
      'cards',
      projectCards(kb.value.PROJECTS.filter((p) => offer.titles.includes(p.title)), true),
    )
  } else if (offer.type === 'contact') {
    await resumeContact()
    return true
  }

  const prompt = stepPrompt()
  if (prompt) await botSay(prompt, 500)
  return true
}

// Kalimat buat "kembali" ke pertanyaan form kontak setelah FAQ dijawab,
// supaya alur pengumpulan nama/email/pesan tetap jalan.
// Seperti orang ngobrol: setelah ditanya, jangan ditagih lagi di setiap
// balasan. Pertanyaan yang sama baru diulang setelah beberapa giliran.
let userTurn = 0
let lastAskTurn = -10
const ASK_EVERY_TURNS = 3

function stepPrompt(after = 'faq') {
  // Mode ngobrol bebas: user belum mau kasih data, jangan ditagih terus
  if (step.value === 'chat' || !['name', 'email', 'message'].includes(step.value)) return ''
  if (after !== 'greeting' && userTurn - lastAskTurn < ASK_EVERY_TURNS) return ''
  lastAskTurn = userTurn

  if (step.value === 'name') {
    return after === 'greeting'
      ? t({
          id: 'Btw, aku asisten chat Jose. Boleh kenalan dulu, nama kamu siapa?',
          en: "By the way, I'm Jose's chat assistant. May I know your name?",
        })
      : pick('askName', {
          id: ['Oh iya, dari tadi belum kenalan. Nama kamu siapa?', 'Btw, boleh tau nama kamu?'],
          en: ["Oh, we haven't introduced ourselves yet. What's your name?", 'By the way, may I know your name?'],
        })
  }
  if (step.value === 'email') {
    return pick('askEmail', {
      id: [
        'Btw, kalau nanti mau kirim pesan ke Jose, email kamu apa? Santai, boleh nanti juga.',
        'Oh iya, biar Jose bisa balas, boleh minta email kamu? Kalau mau tanya-tanya dulu juga gapapa.',
      ],
      en: [
        "By the way, if you'd like to send Jose a message later, what's your email? No rush, you can share it later.",
        "By the way, may I have your email so Jose can reply to you? Feel free to ask a few questions first.",
      ],
    })
  }
  return pick('askMessage', {
    id: [
      'Ngomong-ngomong, ada <em>project</em>, ide kolaborasi, atau pertanyaan yang mau kamu sampein ke Jose?',
      'Kalau ada yang mau disampein langsung ke Jose, tulis aja di sini ya.',
    ],
    en: [
      'By the way, is there a project, a collaboration idea, or a question you would like to share with Jose?',
      'If there is anything you would like to tell Jose directly, just write it here.',
    ],
  })
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function startConversation() {
  messages.value = []
  form.value = { name: '', email: '', message: '' }
  submitError.value = ''
  pendingClarify.value = null
  pendingOffer.value = null
  step.value = 'name'
  msgId = 0
  // Sapaan sesuai waktu dulu, lalu topik yang bisa dijawab. Pertanyaan nama
  // cuma ada sekali, di akhir pesan topik.
  await botSay(
    lang.value === 'en'
      ? `Hi, good ${kb.value.getTimeOfDay()}! Thanks for visiting Jose's portfolio. I'm his chat assistant, here to help.`
      : `Halo, selamat ${kb.value.getTimeOfDay()}! Makasih udah mampir ke portofolio Jose. Aku asisten chat-nya, siap nemenin ngobrol.`,
    400,
  )
  await botSay(kb.value.TOPICS_HTML, 450)
}

// Restore riwayat chat dari localStorage kalau ada, atau mulai percakapan
// baru kalau belum pernah chat / riwayatnya sudah dihapus.
function restoreOrStartConversation() {
  const saved = loadChatState()
  if (!saved) {
    startConversation()
    return
  }

  isRestoringState = true
  messages.value = saved.messages
  form.value = saved.form || { name: '', email: '', message: '' }
  step.value = saved.step || 'message'
  pendingClarify.value = saved.pendingClarify || null
  pendingOffer.value = saved.pendingOffer || null
  msgId =
    typeof saved.msgId === 'number'
      ? saved.msgId
      : saved.messages.reduce((max, m) => Math.max(max, m.id || 0), 0)
  nextTick(() => {
    scrollToBottom()
    isRestoringState = false
  })
}

// Tombol "hapus riwayat" di header: bersihin localStorage lalu mulai
// percakapan baru dari nol (khusus chat widget ini saja, tidak menyentuh
// data lain di localStorage situs).
function clearConversation() {
  const confirmed = window.confirm(
    t({
      id: 'Hapus semua riwayat chat ini? Percakapan akan dimulai dari awal lagi.',
      en: 'Delete this entire chat history? The conversation will start over from the beginning.',
    }),
  )
  if (!confirmed) return
  clearChatState()
  startConversation()
}

// Kosong ('') artinya panggil /api/contact di domain yang sama (production di Vercel).
const API_URL = import.meta.env.VITE_API_URL || ''

async function submitForm() {
  const gen = convGen
  const en = lang.value === 'en'
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // lang dipakai server untuk memilih bahasa email konfirmasi ke pengunjung
      body: JSON.stringify({ ...form.value, lang: lang.value }),
    })

    const data = await res.json().catch(() => ({}))
    // Bahasa sudah diganti selagi menunggu: percakapan ini sudah ditutup.
    if (gen !== convGen) return

    if (!res.ok || !data.ok) {
      // Pesan error dari server berbahasa Indonesia, jadi di versi Inggris
      // diganti kalimat Inggris yang setara.
      if (en) {
        const enError = new Error(
          res.status === 429
            ? 'too many messages were sent in a short time. Please try again in a few minutes.'
            : "I couldn't send your message. Please try again.",
        )
        enError.userFacing = true
        throw enError
      }
      throw new Error(data.error || 'Gagal mengirim pesan, coba lagi ya.')
    }

    step.value = 'done'
    await botSay(
      t({
        id: 'Pesan berhasil terkirim! Cek email kamu, sudah kukirim juga konfirmasinya ke sana. Makasih ya!',
        en: "Your message has been sent! Please check your inbox, I've also sent you a confirmation email. Thank you!",
      }),
    )
  } catch (err) {
    if (gen !== convGen) return
    // Versi Inggris: error teknis browser (mis. "Failed to fetch") diganti
    // kalimat yang ramah, sama seperti error dari server.
    submitError.value = en
      ? err.userFacing
        ? err.message
        : 'something went wrong while sending your message. Please try again.'
      : err.message || 'Ada masalah pas ngirim pesan, coba lagi ya.'
    step.value = 'error'
    await botSay(en ? `Sorry, ${submitError.value}` : `Waduh, ${submitError.value}`)
  }
}

async function retrySubmit() {
  step.value = 'submitting'
  await botSay(t({ id: 'Oke, aku coba kirim ulang ya...', en: "Okay, I'll try sending it again..." }), 350)
  await submitForm()
}

function resetConversation() {
  startConversation()
}

// Selama bot masih "mengetik" balasan, pesan baru ditahan dulu supaya
// urutan percakapan tidak tumpang tindih (sebelumnya bisa kirim beruntun
// dan jawaban bot jadi acak urutannya).
const isBusy = ref(false)

async function handleSend() {
  const text = inputValue.value.trim()
  if (!text || isBusy.value || step.value === 'submitting') return
  isBusy.value = true
  try {
    await processMessage(text)
  } finally {
    isBusy.value = false
    nextTick(() => chatInputEl.value?.focus())
  }
}

function takeUserMessage(text) {
  userTurn += 1
  pushMessage('user', text)
  inputValue.value = ''
}

// User belum mau kasih nama/email: pindah ke mode ngobrol bebas, tawarin
// topik, dan jangan minta data lagi sampai user sendiri yang mau kirim pesan.
async function enterChatMode(hello = '') {
  step.value = 'chat'
  const name = form.value.name ? `, ${escapeHtml(form.value.name)}` : ''
  const en = lang.value === 'en'
  await botSay(
    form.value.name && form.value.email
      ? en
        ? `${hello}No problem at all${name}! I already have your details, so whenever you want to send a message, just let me know.`
        : `${hello}Gapapa, santai aja${name}! Data kamu udah aku catat, jadi kapan pun mau kirim pesan tinggal bilang aja.`
      : en
        ? `${hello}No problem at all${name}! Your name and email are only needed if you want to send Jose a message. Let's just chat for now.`
        : `${hello}Gapapa, santai aja${name}! Nama dan email cuma perlu kalau kamu mau kirim pesan ke Jose. Sekarang kita ngobrol dulu aja.`,
    450,
  )
  await botSay(kb.value.TOPICS_MENU_HTML, 400)
}

// Lanjut ke alur kirim pesan, mulai dari data yang belum ada.
async function resumeContact(email = '') {
  if (email && isValidEmail(email)) form.value.email = email
  if (!form.value.name) {
    step.value = 'name'
    await botSay(
      t({
        id: 'Siap! Biar Jose tau ini dari siapa, nama kamu siapa?',
        en: "Sure! So Jose knows who it's from, what's your name?",
      }),
    )
  } else if (!form.value.email) {
    step.value = 'email'
    await botSay(
      lang.value === 'en'
        ? `Sure, ${escapeHtml(form.value.name)}! What's your email, so Jose can reply to you there?`
        : `Siap, ${escapeHtml(form.value.name)}! Email kamu apa, biar Jose bisa balas ke sana?`,
    )
  } else {
    step.value = 'message'
    await botSay(
      t({
        id: 'Siap! Cerita dong, ada <em>project</em>, ide kolaborasi, atau pertanyaan apa yang mau kamu sampein ke Jose?',
        en: 'Sure! Tell me, is there a project, a collaboration idea, or a question you would like to share with Jose?',
      }),
    )
  }
}

// Maksud percakapan boleh dicek kalau pesannya bukan email dan, di langkah
// "pesan", bukan isi pesan untuk Jose (kalimat panjang / berisi tawaran).
function canMatchConversation(body) {
  if (step.value === 'error' || step.value === 'submitting' || kb.value.extractEmail(body)) return false
  const wordCount = body.split(/\s+/).filter(Boolean).length
  // Saat ditanya nama, jawaban satu kata yang masuk akal sebagai nama
  // ("Bagus", "Rina") diperlakukan sebagai nama, bukan pujian/maksud lain.
  if (step.value === 'name') return !(wordCount === 1 && kb.value.extractPlainName(body))
  if (step.value !== 'message') return true
  return !kb.value.looksLikeMessageToJose(body) && wordCount <= 8
}

async function processMessage(text) {
  const kbm = kb.value
  const en = lang.value === 'en'

  // 0) Jawaban "iya/boleh/nggak" untuk tawaran bot sebelumnya. Dicek paling
  //    awal supaya "iya" tidak tertelan sebagai basa-basi.
  if (pendingOffer.value) {
    if (await answerPendingOffer(text)) return
    pendingOffer.value = null
  }

  // "halo kak, aku budi" / "pagi, mau tanya proyeknya" -> sapa balik dulu,
  // lalu proses sisa kalimatnya.
  const greeted = kbm.hasGreetingPrefix(text)
  const body = greeted ? kbm.stripGreetingPrefix(text) || text : text

  // 1) Maksud percakapan spesifik: ajakan kenalan, pujian, fakta (kuliah, kerja
  //    di mana), cek skill ("bisa Flutter?"), proyek tertentu, dst.
  if (canMatchConversation(body)) {
    const convo = kbm.matchConversation(body)
    if (convo) {
      pendingClarify.value = null
      takeUserMessage(text)
      if (greeted) await botSay(greetBack(text), 400)
      const suppressPrompt = await answerConversation(convo, body)
      if (!suppressPrompt && step.value !== 'done') {
        const prompt = stepPrompt()
        if (prompt) await botSay(prompt, 500)
      }
      return
    }
  }

  // 2) Basa-basi murni ("halo", "selamat malam", "makasih", "apa kabar")
  //    dijawab dulu, TIDAK pernah dianggap nama/email/isi pesan.
  const talk = kbm.matchSmallTalk(text)
  if (talk) {
    pendingClarify.value = null
    takeUserMessage(text)
    await answerSmallTalk(talk, text)
    return
  }

  // Mode ngobrol bebas: kalau user ngetik email atau bilang mau kirim
  // pesan, lanjutkan alur kontak.
  if (step.value === 'chat') {
    const email = kbm.extractEmail(body)
    if (email || kbm.RESUME_CONTACT_RX.test(body)) {
      takeUserMessage(text)
      await resumeContact(email)
      return
    }
  }

  // Di langkah nama/email/pesan, user bilang belum mau kasih atau mau
  // bahas yang lain dulu -> jangan dibilang "format salah".
  // Di langkah pesan cuma kalimat pendek tanpa niat ("nanti aja", "ga jadi"),
  // supaya pesan beneran yang kebetulan ada kata "ga" tetap terkirim.
  const wordCount = body.split(/\s+/).filter(Boolean).length
  const isDecline =
    kbm.DECLINE_RX.test(body) &&
    !kbm.extractEmail(body) &&
    (step.value === 'message' ? wordCount <= 5 && !kbm.looksLikeMessageToJose(body) : wordCount <= 10)
  if (['name', 'email', 'message'].includes(step.value) && isDecline) {
    takeUserMessage(text)
    await enterChatMode(greeted ? `${greetBack(text)} ` : '')
    return
  }

  // 2) Pertanyaan FAQ seputar Jose. Di langkah "pesan", hanya dianggap FAQ
  //    kalau bentuknya pertanyaan, supaya isi pesan seperti "saya mau
  //    nawarin project" tetap terkirim sebagai pesan, bukan dijawab FAQ.
  if (
    step.value !== 'error' &&
    (step.value !== 'message' || (kbm.looksLikeQuestion(body) && !kbm.looksLikeMessageToJose(body)))
  ) {
    const intent = kbm.matchFaqIntent(kbm.normalizeChat(body))
    if (intent) {
      pendingClarify.value = null
      takeUserMessage(text)
      if (greeted) await botSay(greetBack(text), 400)
      const suppressPrompt = await answerFaq(intent)
      if (!suppressPrompt && step.value !== 'done') {
        const prompt = stepPrompt()
        if (prompt) await botSay(prompt, 500)
      }
      return
    }
  }

  // Setelah pesan terkirim, alur form sudah selesai
  if (step.value === 'done') {
    takeUserMessage(text)
    await botSay(
      t({
        id: 'Pesan kamu ke Jose sudah terkirim ya. Kalau mau kirim pesan lain, klik tombol "Kirim pesan lain". Kamu juga masih bisa tanya soal profil, pengalaman, atau proyek Jose di sini.',
        en: 'Your message to Jose has been sent. If you want to send another one, click the "Send another message" button. You can still ask about Jose\'s profile, experience, or projects here.',
      }),
      500,
    )
    return
  }

  // 4) Jawaban klarifikasi "pekerjaan" (riwayat kerja atau nawarin kerjaan)
  if (pendingClarify.value === 'pekerjaan') {
    const wantsHistory = kbm.PEKERJAAN_CLARIFY_HISTORY_RX.test(text)
    const wantsOffer = kbm.PEKERJAAN_CLARIFY_OFFER_RX.test(text)

    if (wantsHistory || wantsOffer) {
      pendingClarify.value = null
      takeUserMessage(text)
      await answerFaq({ type: wantsHistory ? 'experience' : 'contact' })
      const prompt = stepPrompt()
      if (prompt) await botSay(prompt, 500)
      return
    }
    pendingClarify.value = null
  }

  // Mode ngobrol bebas tapi pertanyaannya tidak dikenali
  if (step.value === 'chat') {
    takeUserMessage(text)
    // Hanya kalau user memang minta dipilihkan ("terserah", "bingung"), bukan
    // setiap kalimat yang kebetulan mengandung "ga"/"tidak".
    const pickAnyRx = en
      ? kbm.PICK_ANY_RX
      : /^(?:terserah|bebas|apa\s*(?:aja|saja)|bingung|yang\s*lain|lain\s*aja)\b/i
    await botSay(
      pickAnyRx.test(body.trim())
        ? t({ id: 'Boleh, pilih aja topiknya ya.', en: 'Sure, just pick a topic from the list below.' })
        : pick('unknown', {
            id: [
              'Hmm, yang itu aku belum bisa jawab. Aku paling nyambung kalau ditanya soal Jose.',
              'Maaf, aku belum nangkep maksudnya. Coba tanya dengan kalimat lain, atau pilih topik di bawah ya.',
              'Wah, itu di luar yang aku tahu. Tapi soal Jose, aku siap cerita!',
            ],
            en: [
              "Hmm, I can't answer that one yet. I'm most helpful with questions about Jose.",
              "Sorry, I didn't quite catch that. Try asking in a different way, or pick a topic below.",
              "That's outside what I know. But I'm happy to tell you about Jose!",
            ],
          }),
      400,
    )
    await botSay(kbm.TOPICS_MENU_HTML, 400)
    return
  }

  // 5) Alur form: nama -> email -> pesan
  if (step.value === 'name') {
    takeUserMessage(text)
    const hello = greeted ? `${greetBack(text)} ` : ''

    // Ada yang langsung ngetik email di langkah nama
    const emailInName = kbm.extractEmail(body)
    if (emailInName) {
      form.value.email = emailInName
      const statedName = kbm.matchNameStatement(body)
      if (statedName) {
        form.value.name = statedName.name
        step.value = 'message'
        await botSay(
          en
            ? `${hello}Nice to meet you, ${escapeHtml(statedName.name)}! I've noted your email. Now tell me, is there a project, a collaboration idea, or a question you would like to share with Jose?`
            : `${hello}Salam kenal, ${escapeHtml(statedName.name)}! Emailnya udah aku catat. Sekarang cerita dong, ada <em>project</em>, ide kolaborasi, atau pertanyaan apa yang mau kamu sampein ke Jose?`,
        )
        return
      }
      await botSay(
        en
          ? `${hello}I've noted your email. And what's your name?`
          : `${hello}Emailnya udah aku catat ya. Biar lebih akrab, nama kamu siapa?`,
      )
      return
    }

    const name = kbm.matchNameStatement(body)?.name || kbm.extractPlainName(body)
    if (!name) {
      await botSay(
        /\?/.test(body) || kbm.looksLikeQuestion(body)
          ? en
            ? `${hello}${kbm.pickVariant('unknownName', [
                "Hmm, I can't answer that one yet. I'm most helpful with questions about Jose's profile, experience, projects, or skills.",
                "Sorry, I didn't quite catch that. Try asking about Jose in a different way.",
              ])} By the way, may I know your name?`
            : `${hello}${kbm.pickVariant('unknownName', [
                'Hmm, yang itu aku belum bisa jawab. Aku paling nyambung kalau ditanya soal profil, pengalaman, proyek, atau skill Jose.',
                'Maaf, aku belum nangkep maksudnya. Coba tanya soal Jose dengan kalimat lain ya.',
              ])} Oh iya, boleh tau nama kamu siapa?`
          : en
            ? `${hello}Hmm, that doesn't look like a name. What should I call you? One word is enough, for example: Sarah.`
            : `${hello}Hmm, kayaknya itu bukan nama deh. Nama panggilan kamu siapa? Cukup satu kata aja, contoh: Budi.`,
      )
      return
    }

    form.value.name = name
    const safeName = escapeHtml(name)
    if (form.value.email) {
      step.value = 'message'
      await botSay(
        en
          ? `${hello}Nice to meet you, ${safeName}! Now tell me, is there a project, a collaboration idea, or a question you would like to share with Jose?`
          : `${hello}Salam kenal, ${safeName}! Sekarang cerita dong, ada <em>project</em>, ide kolaborasi, atau pertanyaan apa yang mau kamu sampein ke Jose?`,
      )
      return
    }
    step.value = 'email'
    lastAskTurn = userTurn
    await botSay(
      en
        ? `${hello}Nice to meet you, ${safeName}! What's your email, so Jose can reply to you there?`
        : `${hello}Salam kenal, ${safeName}! Email kamu apa, biar Jose bisa balas ke sana?`,
    )
    return
  }

  if (step.value === 'email') {
    takeUserMessage(text)
    const email = kbm.extractEmail(body)
    if (!email) {
      // Mungkin user baru menyebut/meralat namanya di sini
      const nameStatement = kbm.matchNameStatement(body)
      if (nameStatement) {
        form.value.name = nameStatement.name
        await botSay(
          en
            ? `Got it, I'll call you ${escapeHtml(nameStatement.name)}! Next, what's your email, so Jose can reply to you there?`
            : `Oke, aku panggil ${escapeHtml(nameStatement.name)} ya! Lanjut, email kamu apa, biar Jose bisa balas ke sana?`,
        )
        return
      }
      const looksLikeEmailAttempt =
        /@|\.(com|id|co|net|org)\b/i.test(body) || !/\s/.test(body.trim())
      await botSay(
        looksLikeEmailAttempt
          ? t({
              id: 'Hmm, format emailnya kayaknya belum pas. Coba tulis ulang ya, contoh: nama@email.com',
              en: "Hmm, that email format doesn't look quite right. Please try again, for example: name@email.com",
            })
          : t({
              id: 'Itu kayaknya bukan email ya. Kalau belum mau kasih email juga gapapa, bilang aja "nanti aja", nanti kita ngobrol soal Jose dulu. Kalau mau lanjut, tulis email kamu, contoh: nama@email.com',
              en: 'That doesn\'t look like an email address. If you\'d rather not share your email yet, that\'s fine, just say "maybe later" and we can talk about Jose first. To continue, type your email, for example: name@email.com',
            }),
      )
      return
    }
    if (!isValidEmail(email)) {
      await botSay(
        t({
          id: 'Hmm, format emailnya kayaknya belum pas. Coba tulis ulang ya, contoh: nama@email.com',
          en: "Hmm, that email format doesn't look quite right. Please try again, for example: name@email.com",
        }),
      )
      return
    }
    form.value.email = email
    step.value = 'message'
    await botSay(
      t({
        id: 'Sip! Terakhir, cerita dong ada <em>project</em>, ide kolaborasi, atau pertanyaan apa yang mau kamu sampein ke Jose?',
        en: 'Great! Lastly, tell me, is there a project, a collaboration idea, or a question you would like to share with Jose?',
      }),
    )
    return
  }

  if (step.value === 'message') {
    takeUserMessage(text)
    // Pesan kependekan (mis. "tes", "p") jangan langsung dikirim ke email Jose
    if (body.length < 10 || body.split(/\s+/).length < 2) {
      await botSay(
        t({
          id: 'Pesannya singkat banget nih. Ceritain sedikit lebih detail ya, biar Jose bisa langsung bantu.',
          en: 'That message is quite short. Could you add a bit more detail so Jose can help you right away?',
        }),
      )
      return
    }
    form.value.message = text
    step.value = 'submitting'
    await botSay(
      t({ id: 'Oke, aku kirimkan sekarang ya, tunggu sebentar...', en: "Okay, I'm sending it now, one moment..." }),
      400,
    )
    await submitForm()
    return
  }

  if (step.value === 'error') {
    // Di step error, user diarahkan pakai tombol "Coba Lagi", input diabaikan.
    inputValue.value = ''
  }
}

const placeholder = computed(() => {
  if (step.value === 'name') return t({ id: 'Ketik nama kamu...', en: 'Type your name...' })
  if (step.value === 'email') return t({ id: 'Ketik email kamu...', en: 'Type your email...' })
  if (step.value === 'message') return t({ id: 'Tulis pesan kamu...', en: 'Write your message...' })
  if (step.value === 'submitting') return t({ id: 'Sedang mengirim...', en: 'Sending...' })
  if (step.value === 'done') {
    return t({ id: 'Tanya soal Jose, atau klik "Kirim pesan lain"', en: 'Ask about Jose, or click "Send another message"' })
  }
  if (step.value === 'chat') return t({ id: 'Tanya soal Jose...', en: 'Ask about Jose...' })
  return t({ id: 'Klik "Coba Lagi" di atas', en: 'Click "Try Again" above' })
})

const isInputDisabled = computed(() => ['submitting', 'error'].includes(step.value))

function closeWidget() {
  chatStore.close()
}

function toggleWidget() {
  chatStore.toggle()
}

// Restore riwayat chat (kalau ada) atau mulai percakapan baru begitu widget
// dibuka pertama kali, dan fokuskan input supaya user bisa langsung ngetik.
// immediate: widget dimuat belakangan (App.vue), jadi bisa saja chat sudah
// diminta terbuka sebelum komponen ini sempat dipasang.
watch(
  () => chatStore.isOpen,
  (open) => {
    if (!open) return
    if (messages.value.length === 0) restoreOrStartConversation()
    nextTick(() => chatInputEl.value?.focus())
  },
  { immediate: true },
)

// Simpan otomatis ke localStorage setiap kali ada perubahan pada percakapan
// (pesan baru, ganti step, isi form, dsb), supaya kalau halaman di-refresh
// chat-nya tidak hilang.
watch([messages, step, form, pendingClarify, pendingOffer], saveChatState, {
  deep: true,
})

// Ganti bahasa: percakapan bahasa lama disimpan di key-nya sendiri, lalu
// widget memuat riwayat bahasa baru (atau memulai sapaan baru). Balasan bot
// yang masih tertunda dibuang lewat convGen, jadi tidak ada bahasa campur
// atau alur yang setengah jalan.
watch(lang, (next, prev) => {
  if (messages.value.length) saveChatState(storageKeyFor(prev))
  convGen += 1
  isBusy.value = false
  isBotTyping.value = false
  inputValue.value = ''
  // Kosongkan state tanpa memicu penyimpanan (supaya riwayat bahasa baru di
  // localStorage tidak tertimpa percakapan kosong).
  isRestoringState = true
  messages.value = []
  form.value = { name: '', email: '', message: '' }
  submitError.value = ''
  pendingClarify.value = null
  pendingOffer.value = null
  step.value = 'name'
  msgId = 0
  const gen = convGen
  nextTick(() => {
    // Bahasa diganti lagi sebelum sempat dimuat: biar giliran terakhir saja.
    if (gen !== convGen) return
    isRestoringState = false
    if (chatStore.isOpen) {
      restoreOrStartConversation()
      nextTick(() => chatInputEl.value?.focus())
    }
  })
})
</script>

<template>
  <div class="chat-widget">
    <Transition name="chat-panel">
      <div
        v-if="chatStore.isOpen"
        class="chat-widget__panel"
        role="dialog"
        :aria-label="t({ id: 'Chat kontak dengan Jose', en: 'Chat with Jose' })"
      >
        <header class="chat-widget__header">
          <div class="chat-widget__header-info">
            <span class="chat-widget__avatar" aria-hidden="true">JP</span>
            <div>
              <p class="chat-widget__title">{{ t({ id: 'Chat dengan Jose', en: 'Chat with Jose' }) }}</p>
              <p class="chat-widget__subtitle">
                <span class="chat-widget__status-dot" aria-hidden="true"></span>
                {{ t({ id: 'Biasanya balas dalam 1 hari', en: 'Usually replies within a day' }) }}
              </p>
            </div>
          </div>

          <div class="chat-widget__header-actions">
            <button
              type="button"
              class="btn-close btn-close--blue chat-widget__icon-btn"
              :aria-label="t({ id: 'Hapus riwayat chat', en: 'Clear chat history' })"
              :title="t({ id: 'Hapus riwayat chat', en: 'Clear chat history' })"
              @click="clearConversation"
            >
              <svg viewBox="0 0 24 24" class="chat-widget__icon-svg" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13M10 11v6m4-6v6"
                />
              </svg>
            </button>

            <button
              type="button"
              class="btn-close btn-close--blue chat-widget__icon-btn"
              :aria-label="t({ id: 'Tutup chat', en: 'Close chat' })"
              @click="closeWidget"
            >
              <svg viewBox="0 0 24 24" class="chat-widget__icon-svg" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  d="M6 6l12 12M18 6 6 18"
                />
              </svg>
            </button>
          </div>
        </header>

        <div class="chat-widget__body">
          <TransitionGroup name="chat-msg" tag="div" class="chat-widget__messages">
            <div v-for="msg in messages" :key="msg.id" class="chat-widget__msg-wrap">
              <div
                v-if="msg.type !== 'cards'"
                class="chat-widget__msg"
                :class="`chat-widget__msg--${msg.from}`"
              >
                <span v-if="msg.from === 'bot'" v-html="msg.text"></span>
                <span v-else>{{ msg.text }}</span>
              </div>

              <div v-else class="chat-widget__cards">
                <article
                  v-for="(item, idx) in msg.items"
                  :key="idx"
                  class="chat-widget__card"
                  :class="{ 'chat-widget__card--has-image': item.image }"
                >
                  <div v-if="item.image" class="chat-widget__card-thumb-wrap">
                    <img
                      :src="item.image"
                      :alt="t({ id: `Thumbnail proyek ${item.title}`, en: `${item.title} project thumbnail` })"
                      class="chat-widget__card-thumb"
                      loading="lazy"
                      draggable="false"
                      @contextmenu.prevent
                    />
                  </div>
                  <p class="chat-widget__card-title" v-html="item.title"></p>
                  <p
                    v-if="item.subtitle"
                    class="chat-widget__card-subtitle"
                    v-html="item.subtitle"
                  ></p>
                  <p class="chat-widget__card-desc" v-html="item.desc"></p>

                  <ul v-if="item.tags && item.tags.length" class="chat-widget__card-tags">
                    <li v-for="tag in item.tags" :key="tag" class="chat-widget__card-tag">
                      {{ tag }}
                    </li>
                  </ul>

                  <div v-if="item.links && item.links.length" class="chat-widget__card-links">
                    <a
                      v-for="link in item.links"
                      :key="link.label"
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="chat-widget__card-link"
                      >{{ link.label }}</a
                    >
                  </div>
                </article>
              </div>
            </div>
          </TransitionGroup>

          <div
            v-if="isBotTyping"
            class="chat-widget__msg chat-widget__msg--bot chat-widget__typing"
          >
            <span></span><span></span><span></span>
          </div>

          <div v-if="step === 'error'" class="chat-widget__actions">
            <button type="button" class="chat-widget__action-btn" @click="retrySubmit">
              {{ t({ id: 'Coba Lagi', en: 'Try Again' }) }}
            </button>
          </div>

          <div v-if="step === 'done'" class="chat-widget__actions">
            <button type="button" class="chat-widget__action-btn" @click="resetConversation">
              {{ t({ id: 'Kirim pesan lain', en: 'Send another message' }) }}
            </button>
          </div>

          <div ref="messagesEnd"></div>
        </div>

        <form class="chat-widget__footer" @submit.prevent="handleSend">
          <input
            ref="chatInputEl"
            v-model="inputValue"
            type="text"
            class="chat-widget__input"
            :placeholder="placeholder"
            :disabled="isInputDisabled"
            autocomplete="off"
          />
          <button
            type="submit"
            class="chat-widget__send"
            :disabled="isInputDisabled || !inputValue.trim()"
            :aria-label="t({ id: 'Kirim pesan', en: 'Send message' })"
          >
            <svg viewBox="0 0 24 24" class="chat-widget__send-icon" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4 12 16-8-6 16-2-7-8-1Z"
              />
            </svg>
          </button>
        </form>
      </div>
    </Transition>

    <button
      type="button"
      class="btn-close btn-close--solid chat-widget__fab"
      :class="{ 'chat-widget__fab--open': chatStore.isOpen }"
      :aria-label="chatStore.isOpen ? t({ id: 'Tutup chat', en: 'Close chat' }) : t({ id: 'Buka chat kontak', en: 'Open contact chat' })"
      @click="toggleWidget"
    >
      <svg
        v-if="!chatStore.isOpen"
        viewBox="0 0 24 24"
        class="chat-widget__fab-icon"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="chat-widget__fab-icon" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          d="M6 6l12 12M18 6 6 18"
        />
      </svg>
      <span v-if="!chatStore.isOpen" class="chat-widget__fab-pulse" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped>
.chat-widget {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  font-family: var(--font-body);
}

/* --- Tombol bulat mengambang --- */
.chat-widget__fab {
  --close-size: 48px;
  position: relative;
}

.chat-widget__fab-icon {
  width: 18px;
  height: 18px;
}

.chat-widget__fab-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  opacity: 0.55;
  animation: chat-widget-pulse 2.2s ease-out infinite;
  pointer-events: none;
}

@keyframes chat-widget-pulse {
  0% {
    transform: scale(0.85);
    opacity: 0.55;
  }
  70% {
    transform: scale(1.25);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-widget__fab-pulse {
    animation: none;
    display: none;
  }
}

/* --- Panel chat --- */
.chat-widget__panel {
  width: min(360px, calc(100vw - 2.5rem));
  height: min(520px, calc(100vh - 8rem));
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.55);
}

.chat-widget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  background: var(--color-primary);
  color: #fff;
  flex-shrink: 0;
}

.chat-widget__header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.chat-widget__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.chat-widget__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 600;
}

.chat-widget__subtitle {
  margin: 0.15rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
}

.chat-widget__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent, #8fb27a);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
}

.chat-widget__header-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

/* Tampilan tombol dari .btn-close--blue (main.css); header chat lebih rapat */
.chat-widget__icon-btn {
  --close-size: 32px;
  --close-depth: 2px;
}

.chat-widget__icon-btn:hover {
  --close-depth: 3px;
}

.chat-widget__icon-svg {
  width: 16px;
  height: 16px;
}

.chat-widget__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: var(--color-bg);
}

.chat-widget__messages {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.chat-widget__msg {
  max-width: 82%;
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius);
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: normal;
  word-break: break-word;
  text-align: left;
}

/* Paragraf & list di dalam jawaban FAQ (dirender via v-html) */
.chat-widget__msg p {
  margin: 0 0 0.55rem;
}

.chat-widget__msg p:last-child {
  margin-bottom: 0;
}

.chat-widget__msg strong {
  font-weight: 700;
}

.chat-widget__msg em {
  font-style: italic;
}

.chat-widget__highlight-list {
  list-style: none;
  margin: 0 0 0.55rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.chat-widget__highlight-list li {
  position: relative;
  padding-left: 1.25rem;
}

.chat-widget__highlight-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-primary);
  font-weight: 700;
}

/* --- List bernomor buat jawaban FAQ "pengalaman kerja" (bukan card lagi) --- */
.chat-widget__exp-list {
  list-style: none;
  counter-reset: chat-widget-exp-counter;
  margin: 0;
  padding: 0 0 0 0.15rem;
}

.chat-widget__exp-item {
  counter-increment: chat-widget-exp-counter;
  position: relative;
  display: flex;
  gap: 0.7rem;
  padding-bottom: 1.1rem;
  padding-left: 0.1rem;
}

/* Nomor urut (1, 2, 3, ...) dalam lingkaran, menggantikan titik timeline */
.chat-widget__exp-item::before {
  content: counter(chat-widget-exp-counter);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

/* Garis vertikal penghubung antar nomor, kecuali di item terakhir */
.chat-widget__exp-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 11px;
  top: 26px;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgba(31, 127, 224, 0.45), rgba(31, 127, 224, 0.1));
}

.chat-widget__exp-content {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}

.chat-widget__exp-period {
  margin: 0 0 0.2rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.chat-widget__exp-role {
  margin: 0 0 0.1rem;
  font-family: var(--font-heading);
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-text);
}

.chat-widget__exp-role em {
  font-style: italic;
}

.chat-widget__exp-company {
  margin: 0 0 0.4rem;
  font-size: 0.78rem;
  color: var(--color-text-soft);
}

.chat-widget__exp-company em {
  font-style: italic;
}

.chat-widget__exp-summary {
  margin: 0 0 0.55rem;
  font-size: 0.83rem;
  line-height: 1.6;
  color: var(--color-text-soft);
  text-align: left;
}

.chat-widget__exp-summary em {
  font-style: italic;
}

.chat-widget__exp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.chat-widget__exp-tag {
  font-size: 0.68rem;
  color: var(--color-primary-dark, #004c99);
  background: var(--color-bg);
  border: 1px solid rgba(31, 127, 224, 0.25);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.chat-widget__msg--bot {
  align-self: flex-start;
  background: var(--color-surface-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 4px;
}

.chat-widget__msg--user {
  align-self: flex-end;
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* --- Card jawaban FAQ (pengalaman & proyek) --- */
.chat-widget__msg-wrap {
  display: flex;
  flex-direction: column;
}

.chat-widget__cards {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.chat-widget__card {
  max-width: 92%;
  align-self: flex-start;
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius);
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 4px;
  overflow: hidden;
}

/* Card proyek (punya thumbnail): sedikit lebih lebar & tanpa padding atas,
   supaya gambar bisa menempel rapi di bagian atas card seperti di section Proyek. */
.chat-widget__card--has-image {
  max-width: 100%;
  padding-top: 0;
  box-shadow: 0 4px 14px rgba(20, 20, 30, 0.12);
}

.chat-widget__card-thumb-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% + 1.8rem);
  margin: 0 -0.9rem 0.7rem;
  height: 150px;
  padding: 14px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.chat-widget__card-thumb {
  display: block;
  width: 100%;
  height: 100%;
  /* contain, bukan cover: seluruh gambar/kolase kelihatan, tidak kepotong */
  object-fit: contain;
  object-position: center;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.chat-widget__card-title {
  margin: 0 0 0.15rem;
  font-family: var(--font-heading);
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-text);
}

.chat-widget__card-subtitle {
  margin: 0 0 0.4rem;
  font-size: 0.76rem;
  color: var(--color-text-soft);
}

.chat-widget__card-desc {
  margin: 0 0 0.55rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--color-text-soft);
  text-align: left;
}

.chat-widget__card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  list-style: none;
  margin: 0 0 0.5rem;
  padding: 0;
}

.chat-widget__card-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  color: var(--color-primary-dark, #004c99);
  background: var(--color-bg);
  border: 1px solid rgba(31, 127, 224, 0.25);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.chat-widget__card-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chat-widget__card-link {
  font-size: 0.76rem;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary);
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  text-decoration: none;
  transition: background 0.2s ease;
}

.chat-widget__card-link:hover {
  background: var(--color-primary-dark);
}

.chat-widget__typing {
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  padding: 0.75rem 0.9rem;
}

.chat-widget__typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-soft);
  animation: chat-widget-typing 1s infinite ease-in-out;
}

.chat-widget__typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.chat-widget__typing span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes chat-widget-typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.chat-widget__actions {
  display: flex;
  justify-content: flex-start;
}

.chat-widget__action-btn {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border: 1px solid rgba(31, 127, 224, 0.35);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.chat-widget__action-btn:hover {
  background: rgba(31, 127, 224, 0.24);
}

.chat-widget__footer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  flex-shrink: 0;
}

.chat-widget__input {
  flex: 1;
  min-width: 0;
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  padding: 0.6rem 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.chat-widget__input:focus {
  border-color: var(--color-primary);
}

.chat-widget__input:disabled {
  opacity: 0.6;
}

.chat-widget__send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.chat-widget__send:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.chat-widget__send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-widget__send-icon {
  width: 17px;
  height: 17px;
}

/* --- Transisi buka/tutup panel --- */
.chat-panel-enter-active,
.chat-panel-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
  transform-origin: bottom right;
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

/* --- Transisi tiap bubble chat muncul --- */
.chat-msg-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.chat-msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .chat-panel-enter-active,
  .chat-panel-leave-active,
  .chat-msg-enter-active {
    transition: none;
  }
}

@media (max-width: 480px) {
  .chat-widget {
    right: 1rem;
    bottom: 1rem;
  }

  .chat-widget__panel {
    width: calc(100vw - 2rem);
    height: min(72vh, 560px);
    border-radius: var(--radius-lg);
  }

  .chat-widget__fab {
    --close-size: 44px;
  }
}
</style>
