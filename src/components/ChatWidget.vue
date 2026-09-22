<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useChatWidgetStore } from '../stores/chatWidget'
import {
  PROFILE,
  ABOUT_HTML,
  EDUCATION_HTML,
  CONTACT_HTML,
  TOPICS_HTML,
  OFFTOPIC_HTML,
  PROJECTS,
  buildExperienceListHtml,
  matchFaqIntent,
  matchNameStatement,
  PEKERJAAN_CLARIFY_HISTORY_RX,
  PEKERJAAN_CLARIFY_OFFER_RX,
} from './chatKnowledge'

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

// Nyimpen status kalau bot baru aja nanya "mau link demo/repo-nya juga?"
// (dipicu dari answerFaq intent 'projects' pas wantsLink masih false).
// Selama true, pesan berikutnya dari user diartikan sebagai jawaban
// ya/tidak buat pertanyaan itu dulu, BUKAN dianggap email/nama/pesan,
// supaya nggak ketuker kaya bug "ya" dikira format email salah.
const pendingLinkOffer = ref(false)

// Sama kayak pendingLinkOffer di atas, tapi buat kasus pertanyaan ambigu
// "pekerjaan"/"kerjaan" (bisa berarti riwayat kerja Jose, atau user yang
// mau nawarin kerjaan ke Jose). Nilainya string nama topik yang lagi
// diklarifikasi (misal 'pekerjaan'), atau null kalau tidak ada yang
// sedang diklarifikasi. Selama ada nilainya, pesan berikutnya dari user
// diartikan dulu sebagai jawaban klarifikasi ini, BUKAN nama/email/pesan.
const pendingClarify = ref(null)

// --- Persist ke localStorage, khusus buat chat widget ini -----------------
// Key sengaja dibuat spesifik (bukan cuma "chat") supaya kalau nanti ada
// fitur lain yang juga pakai localStorage di situs ini, nggak ketimpa.
const STORAGE_KEY = 'jose-portfolio-chat-widget-v1'
// Dipakai supaya proses restore dari localStorage saat pertama buka widget
// tidak ikut ke-trigger sama watcher penyimpanan di bawah (biar nggak nyimpen
// ulang data yang baru aja dibaca).
let isRestoringState = false

function saveChatState() {
  if (isRestoringState) return
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step: step.value === 'submitting' ? 'message' : step.value,
        messages: messages.value,
        form: form.value,
        pendingLinkOffer: pendingLinkOffer.value,
        pendingClarify: pendingClarify.value,
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
    const raw = localStorage.getItem(STORAGE_KEY)
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
    localStorage.removeItem(STORAGE_KEY)
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

// Kasih jeda kecil + indikator "sedang mengetik" biar kerasa natural,
// bukan cuma teks yang muncul instan.
function botSay(text, delay = 600, type = 'text', items = null) {
  return new Promise((resolve) => {
    isBotTyping.value = true
    setTimeout(() => {
      isBotTyping.value = false
      pushMessage('bot', text, type, items)
      resolve()
    }, delay)
  })
}

// --- FAQ seputar Jose (siapa, about, kuliah, pengalaman, proyek, kontak) ---
// Dipanggil dari handleSend kalau pesan user cocok dengan salah satu intent
// dari matchFaqIntent(). Alur form kontak (nama/email/pesan) sama sekali
// tidak terganggu, cuma "dijeda" sebentar buat jawab pertanyaan ini.
// Semua teks di sini HTML siap render (dirender pakai v-html khusus
// pesan dari bot, lihat template di bawah).
async function answerFaq(intent) {
  if (intent.type === 'education') {
    await botSay(EDUCATION_HTML)
    return
  }

  if (intent.type === 'about') {
    await botSay(ABOUT_HTML)
    return
  }

  if (intent.type === 'experience') {
    await botSay('Ini beberapa pengalaman kerja Jose', 500)
    await botSay(buildExperienceListHtml(), 350)
    return false
  }

  if (intent.type === 'projects') {
    await botSay('Ini beberapa proyek yang pernah Jose kerjakan', 500)
    await botSay(
      '',
      350,
      'cards',
      PROJECTS.map((item) => ({
        title: item.title,
        desc: item.summary,
        image: item.image,
        tags: item.tags,
        links: intent.wantsLink
          ? [
              { label: 'Lihat Demo', url: item.demoHref },
              { label: 'Lihat Code', url: item.codeHref },
            ]
          : [],
      })),
    )
    if (!intent.wantsLink) {
      await botSay('Mau aku kasih link demo dan repo-nya juga? Tinggal bilang "link" ya', 500)
      pendingLinkOffer.value = true
      return true // suppress prompt lanjutan form (nama/email/pesan) di giliran ini
    }
    return false
  }

  if (intent.type === 'contact') {
    await botSay(CONTACT_HTML.replace('{email}', PROFILE.email))
    return false
  }

  // "pekerjaan"/"kerjaan" sendirian itu ambigu (riwayat kerja Jose, atau
  // user mau nawarin kerjaan ke Jose?), jadi nanya balik dulu daripada
  // asal nebak. Jawabannya ditangkep di handleSend lewat pendingClarify.
  if (intent.type === 'ambiguous_pekerjaan') {
    await botSay(
      'Maksudnya gimana nih, kamu mau tau riwayat/pengalaman kerja Jose, atau kamu yang mau nawarin kerjaan atau kolaborasi ke Jose?',
      500,
    )
    pendingClarify.value = 'pekerjaan'
    return true // suppress prompt lanjutan, tunggu jawaban klarifikasi dulu
  }

  // Pertanyaan yang jelas di luar topik seputar Jose (resep, cuaca, dst).
  if (intent.type === 'offtopic') {
    await botSay(OFFTOPIC_HTML)
    return false
  }
}

// Kalimat buat "kembali" ke pertanyaan form kontak setelah FAQ dijawab,
// supaya alur pengumpulan nama/email/pesan tetap jalan.
function stepPrompt() {
  if (step.value === 'name') return 'Btw, sebelum lanjut, boleh tau nama kamu dulu?'
  if (step.value === 'email') return 'Oke, lanjut ya, email kamu apa, biar aku bisa balas ke sana?'
  if (step.value === 'message') {
    return 'Balik lagi ke soal tadi, ada <em>project</em>, ide kolaborasi, atau pertanyaan apa yang mau kamu sampein ke Jose?'
  }
  return ''
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function startConversation() {
  messages.value = []
  form.value = { name: '', email: '', message: '' }
  submitError.value = ''
  pendingLinkOffer.value = false
  pendingClarify.value = null
  step.value = 'name'
  msgId = 0
  // Sapaan proaktif: tanya duluan lagi ngobrol sama siapa, baru kasih tau
  // topik-topik yang bisa dijawab (biar user tau batasannya dari awal,
  // dan bot bisa bilang "di luar topik" kalau ditanya hal lain).
  await botSay('Halo, aku asisten chat Jose. Lagi ngobrol sama siapa nih, boleh kenalan dulu?', 400)
  await botSay(TOPICS_HTML, 450)
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
  pendingLinkOffer.value = !!saved.pendingLinkOffer
  pendingClarify.value = saved.pendingClarify || null
  msgId = typeof saved.msgId === 'number' ? saved.msgId : saved.messages.reduce((max, m) => Math.max(max, m.id || 0), 0)
  nextTick(() => {
    scrollToBottom()
    isRestoringState = false
  })
}

// Tombol "hapus riwayat" di header: bersihin localStorage lalu mulai
// percakapan baru dari nol (khusus chat widget ini saja, tidak menyentuh
// data lain di localStorage situs).
function clearConversation() {
  const confirmed = window.confirm('Hapus semua riwayat chat ini? Percakapan akan dimulai dari awal lagi.')
  if (!confirmed) return
  clearChatState()
  startConversation()
}

// Kosong ('') artinya panggil /api/contact di domain yang sama (production di Vercel).
const API_URL = import.meta.env.VITE_API_URL || ''

async function submitForm() {
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Gagal mengirim pesan, coba lagi ya.')
    }

    step.value = 'done'
    await botSay('Pesan berhasil terkirim! Cek email kamu, sudah kukirim juga konfirmasinya ke sana. Makasih ya!')
  } catch (err) {
    submitError.value = err.message || 'Ada masalah pas ngirim pesan, coba lagi ya.'
    step.value = 'error'
    await botSay(`Waduh, ${submitError.value}`)
  }
}

async function retrySubmit() {
  step.value = 'submitting'
  await botSay('Oke, aku coba kirim ulang ya...', 350)
  await submitForm()
}

function resetConversation() {
  startConversation()
}

async function handleSend() {
  const text = inputValue.value.trim()
  if (!text || step.value === 'submitting' || step.value === 'done') return

  // Cek dulu apakah ini pertanyaan FAQ beneran (siapa Jose, kuliah,
  // pengalaman, proyek, kontak, dsb). Ini SENGAJA dicek paling duluan,
  // sebelum status "pending link offer" di bawah: kalau user nanya hal
  // baru (mis. "kerja dimana aja"), pertanyaan itu harus menang, bukan
  // malah ketangkep sebagai jawaban ya/tidak buat pertanyaan link
  // sebelumnya cuma gara-gara ada kata "mau" nyempil di kalimatnya.
  if (step.value !== 'error') {
    const intent = matchFaqIntent(text)
    if (intent) {
      pendingLinkOffer.value = false
      pendingClarify.value = null
      pushMessage('user', text)
      inputValue.value = ''
      const suppressPrompt = await answerFaq(intent)
      if (!suppressPrompt) {
        const prompt = stepPrompt()
        if (prompt) await botSay(prompt, 500)
      }
      return
    }
  }

  // Kalau bot baru aja nanya "mau link demo/repo-nya juga?" dan pesan ini
  // BUKAN pertanyaan FAQ baru (dicek di atas), baru di sini ditangkep
  // sebagai jawaban ya/tidak-nya. Dibatasi cuma buat balasan pendek
  // (maksimal 4 kata) supaya kata kayak "mau" di kalimat panjang lain
  // nggak ketangkep juga.
  if (pendingLinkOffer.value) {
    const wordCount = text.split(/\s+/).filter(Boolean).length
    const isShortReply = wordCount <= 4
    const wantsLink = isShortReply && /\b(ya|iya|iy|yap|yoi|boleh|mau|oke|ok|sip|siap|link|demo|repo|source ?code)\b/i.test(text)
    const declines = isShortReply && /\b(nggak|enggak|ga|gak|tidak|engga|no|skip|nanti|gausah|ga usah)\b/i.test(text)

    if (wantsLink || declines) {
      pendingLinkOffer.value = false
      pushMessage('user', text)
      inputValue.value = ''

      if (wantsLink) {
        await botSay(
          'Nih link demo dan repo-nya',
          400,
          'cards',
          PROJECTS.map((item) => ({
            title: item.title,
            desc: item.summary,
            image: item.image,
            tags: item.tags,
            links: [
              { label: 'Lihat Demo', url: item.demoHref },
              { label: 'Lihat Code', url: item.codeHref },
            ],
          })),
        )
      }

      const prompt = stepPrompt()
      if (prompt) await botSay(prompt, 500)
      return
    }

    // Bukan jawaban ya/tidak yang jelas (misal user malah lanjut jawab
    // pertanyaan form aslinya) -> lepas status pending, lanjutkan teks ini
    // ke alur form seperti biasa di bawah.
    pendingLinkOffer.value = false
  }

  // Kalau bot baru aja nanya klarifikasi "pekerjaan itu maksudnya riwayat
  // kerja atau nawarin kerjaan?" (dan pesan ini BUKAN pertanyaan FAQ baru,
  // sudah dicek di atas), tangkep jawabannya di sini dulu.
  if (pendingClarify.value === 'pekerjaan') {
    const wantsHistory = PEKERJAAN_CLARIFY_HISTORY_RX.test(text)
    const wantsOffer = PEKERJAAN_CLARIFY_OFFER_RX.test(text)

    if (wantsHistory || wantsOffer) {
      pendingClarify.value = null
      pushMessage('user', text)
      inputValue.value = ''
      await answerFaq({ type: wantsHistory ? 'experience' : 'contact' })
      const prompt = stepPrompt()
      if (prompt) await botSay(prompt, 500)
      return
    }

    // Jawaban tidak jelas condong ke arah mana -> lepas status pending,
    // lanjutkan teks ini ke alur form seperti biasa di bawah.
    pendingClarify.value = null
  }

  if (step.value === 'name') {
    // Kalau kalimatnya berbentuk pernyataan nama ("nama aku jose", dst),
    // ambil nama bersihnya dulu, jangan nyimpen kalimat mentahnya
    // (soalnya kalau tidak, "nama aku jose" kesimpen sebagai nama = "nama").
    const nameStatement = matchNameStatement(text)
    if (nameStatement) {
      form.value.name = nameStatement.name
      pushMessage('user', text)
      inputValue.value = ''
      await botSay(`Okee, ${nameStatement.name}! Email kamu apa, biar aku bisa balas ke sana?`)
      step.value = 'email'
      return
    }

    // Kalimat yang jelas-jelas berbentuk pertanyaan tapi tidak cocok sama
    // FAQ mana pun (sudah dicek di paling atas) kemungkinan besar bukan
    // nama, jadi jangan langsung ditelen sebagai nama, tanya balik dulu.
    if (/\?/.test(text)) {
      pushMessage('user', text)
      inputValue.value = ''
      await botSay('Hmm, aku belum nangkep maksudnya itu. Boleh diulang, atau ketik nama kamu dulu ya biar bisa lanjut ngobrol?')
      return
    }

    form.value.name = text
    pushMessage('user', text)
    inputValue.value = ''
    const firstName = text.split(' ')[0]
    await botSay(`Okee, ${firstName}! Email kamu apa, biar aku bisa balas ke sana?`)
    step.value = 'email'
    return
  }

  if (step.value === 'email') {
    // Sama kayak di step 'name': kalau user malah baru nyebutin/ngulang
    // namanya di sini ("nama aku jose"), jangan dianggap sebagai email
    // yang salah format, tapi tangkep sebagai nama lalu tetap tanya email.
    const nameStatement = matchNameStatement(text)
    if (nameStatement) {
      form.value.name = nameStatement.name
      pushMessage('user', text)
      inputValue.value = ''
      await botSay(`Okee, ${nameStatement.name}! Oke, lanjut ya, email kamu apa, biar aku bisa balas ke sana?`)
      return
    }

    pushMessage('user', text)
    inputValue.value = ''
    if (!isValidEmail(text)) {
      await botSay('Hmm, format emailnya kayaknya belum pas. Coba tulis ulang ya, contoh: nama@email.com')
      return
    }
    form.value.email = text
    await botSay('Sip! Terakhir, cerita dong ada project, ide kolaborasi, atau pertanyaan apa yang mau kamu sampein')
    step.value = 'message'
    return
  }

  if (step.value === 'message') {
    form.value.message = text
    pushMessage('user', text)
    inputValue.value = ''
    step.value = 'submitting'
    await botSay('Oke, aku kirimkan sekarang ya, tunggu sebentar...', 400)
    await submitForm()
    return
  }

  if (step.value === 'error') {
    // Di step error, user diarahkan pakai tombol "Coba Lagi", input diabaikan.
    inputValue.value = ''
  }
}

const placeholder = computed(() => {
  if (step.value === 'name') return 'Ketik nama kamu...'
  if (step.value === 'email') return 'Ketik email kamu...'
  if (step.value === 'message') return 'Tulis pesan kamu...'
  if (step.value === 'submitting') return 'Sedang mengirim...'
  return 'Chat selesai'
})

const isInputDisabled = computed(() => ['submitting', 'done', 'error'].includes(step.value))

function closeWidget() {
  chatStore.close()
}

function toggleWidget() {
  chatStore.toggle()
}

// Restore riwayat chat (kalau ada) atau mulai percakapan baru begitu widget
// dibuka pertama kali, dan fokuskan input supaya user bisa langsung ngetik.
watch(
  () => chatStore.isOpen,
  (open) => {
    if (!open) return
    if (messages.value.length === 0) restoreOrStartConversation()
    nextTick(() => chatInputEl.value?.focus())
  },
)

// Simpan otomatis ke localStorage setiap kali ada perubahan pada percakapan
// (pesan baru, ganti step, isi form, dsb), supaya kalau halaman di-refresh
// chat-nya tidak hilang.
watch([messages, step, form, pendingLinkOffer, pendingClarify], saveChatState, { deep: true })
</script>

<template>
  <div class="chat-widget">
    <Transition name="chat-panel">
      <div v-if="chatStore.isOpen" class="chat-widget__panel" role="dialog" aria-label="Chat kontak dengan Jose">
        <header class="chat-widget__header">
          <div class="chat-widget__header-info">
            <span class="chat-widget__avatar" aria-hidden="true">JP</span>
            <div>
              <p class="chat-widget__title">Chat dengan Jose</p>
              <p class="chat-widget__subtitle">
                <span class="chat-widget__status-dot" aria-hidden="true"></span>
                Biasanya balas dalam 1 hari
              </p>
            </div>
          </div>

          <div class="chat-widget__header-actions">
            <button
              type="button"
              class="chat-widget__icon-btn"
              aria-label="Hapus riwayat chat"
              title="Hapus riwayat chat"
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
              class="chat-widget__icon-btn"
              aria-label="Tutup chat"
              @click="closeWidget"
            >
              <svg viewBox="0 0 24 24" class="chat-widget__icon-svg" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
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
                      :alt="`Thumbnail proyek ${item.title}`"
                      class="chat-widget__card-thumb"
                      loading="lazy"
                      draggable="false"
                      @contextmenu.prevent
                    />
                  </div>
                  <p class="chat-widget__card-title" v-html="item.title"></p>
                  <p v-if="item.subtitle" class="chat-widget__card-subtitle" v-html="item.subtitle"></p>
                  <p class="chat-widget__card-desc" v-html="item.desc"></p>

                  <ul v-if="item.tags && item.tags.length" class="chat-widget__card-tags">
                    <li v-for="tag in item.tags" :key="tag" class="chat-widget__card-tag">{{ tag }}</li>
                  </ul>

                  <div v-if="item.links && item.links.length" class="chat-widget__card-links">
                    <a
                      v-for="link in item.links"
                      :key="link.label"
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="chat-widget__card-link"
                    >{{ link.label }}</a>
                  </div>
                </article>
              </div>
            </div>
          </TransitionGroup>

          <div v-if="isBotTyping" class="chat-widget__msg chat-widget__msg--bot chat-widget__typing">
            <span></span><span></span><span></span>
          </div>

          <div v-if="step === 'error'" class="chat-widget__actions">
            <button type="button" class="chat-widget__action-btn" @click="retrySubmit">
              Coba Lagi
            </button>
          </div>

          <div v-if="step === 'done'" class="chat-widget__actions">
            <button type="button" class="chat-widget__action-btn" @click="resetConversation">
              Kirim pesan lain
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
            aria-label="Kirim pesan"
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
      class="chat-widget__fab"
      :class="{ 'chat-widget__fab--open': chatStore.isOpen }"
      :aria-label="chatStore.isOpen ? 'Tutup chat' : 'Buka chat kontak'"
      @click="toggleWidget"
    >
      <svg v-if="!chatStore.isOpen" viewBox="0 0 24 24" class="chat-widget__fab-icon" aria-hidden="true">
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
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
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
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  box-shadow: 0 18px 40px -14px rgba(94, 82, 214, 0.55);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chat-widget__fab:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 44px -12px rgba(94, 82, 214, 0.6);
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
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.55);
}

.chat-widget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
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
  background: var(--color-accent, #4fd6c0);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
}

.chat-widget__header-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.chat-widget__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.chat-widget__icon-btn:hover {
  background: rgba(255, 255, 255, 0.26);
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
  border-radius: 14px;
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: normal;
  word-break: break-word;
  text-align: justify;
  text-align-last: left;
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
  box-shadow: 0 0 0 3px rgba(124, 111, 240, 0.18);
}

/* Garis vertikal penghubung antar nomor, kecuali di item terakhir */
.chat-widget__exp-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 11px;
  top: 26px;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    rgba(124, 111, 240, 0.45),
    rgba(124, 111, 240, 0.1)
  );
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
  text-align: justify;
  text-align-last: left;
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
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-bg);
  border: 1px solid rgba(124, 111, 240, 0.25);
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
  border-radius: 14px;
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
  text-align: justify;
  text-align-last: left;
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
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-bg);
  border: 1px solid rgba(124, 111, 240, 0.25);
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
  border: 1px solid rgba(124, 111, 240, 0.35);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.chat-widget__action-btn:hover {
  background: rgba(124, 111, 240, 0.24);
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
  transition: background 0.2s ease, transform 0.2s ease;
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
  transition: opacity 0.22s ease, transform 0.22s ease;
  transform-origin: bottom right;
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

/* --- Transisi tiap bubble chat muncul --- */
.chat-msg-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
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
    border-radius: 16px;
  }

  .chat-widget__fab {
    width: 44px;
    height: 44px;
  }
}
</style>
