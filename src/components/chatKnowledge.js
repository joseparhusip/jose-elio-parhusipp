// chatKnowledge.js
//
// Basis pengetahuan (data diri, pendidikan, pengalaman, proyek) + pendeteksi
// maksud (intent) untuk chatbot di ChatWidget.vue.
//
// Catatan penulisan:
// - Tidak ada tanda "—" (em dash) sama sekali, diganti kata sambung Indonesia
//   ("dan", "di", "untuk", "sampai", dst) atau tanda titik dua/koma.
// - Istilah/frasa bahasa Inggris yang belum umum diserap ke Bahasa Indonesia
//   ditulis miring dengan tag <em>...</em> (mengikuti kaidah PUEBI).
// - Nama produk, merek, akronim (Flutter, React, ERD, SAP, dst) TIDAK di-
//   miringkan karena itu nama diri, bukan istilah asing biasa.
// - Field yang isinya HTML (boleh mengandung <em>/<strong>) dirender pakai
//   v-html di ChatWidget.vue, HANYA untuk pesan dari bot (bukan input user).
//
// Taruh file ini SATU FOLDER dengan ChatWidget.vue (diimport pakai `./chatKnowledge`).

// Thumbnail proyek, sumbernya sama persis dengan yang dipakai ProjectsSection.vue
// (satu folder yang sama), supaya card proyek di chat kelihatan sama seperti
// di bagian "Proyek" pada halaman utama.
import kolThumb from './img-proyek/img-bisnis-intelegence/img-savvy-1.png'
import mobileJecThumb from './img-proyek/img-jec/IMG-JEC-1.jpeg'
import dashboardJecThumb from './img-proyek/img-admin-jec/img-admin-jec-1.png'
import securaKostThumb from './img-proyek/img-securakost/img-secura-kost.png'
import tokoKelontongThumb from './img-proyek/img-toko-kelontong/img-toko-kelontong.png'
import kindleCoffeeThumb from './img-proyek/img-kindle-coffee/img-kindle-coffee.png'

export const PROFILE = {
  fullName: 'Jose Elio Parhusip, S.Bns.',
  shortName: 'Jose',
  email: 'joseparhusip7@gmail.com',
  emailHref: 'https://mail.google.com/mail/?view=cm&fs=1&to=joseparhusip7@gmail.com',
  github: 'https://github.com/joseparhusip',
}

// Jawaban siap pakai untuk intent "about" (siapa Jose / tentang Jose). HTML.
export const ABOUT_HTML = [
  '<p>Kenalin, ini <strong>Jose Elio Parhusip, S.Bns.</strong>!</p>',
  '<p><em>Fresh graduate</em> S1 Bisnis Digital (IPK 3,75/4,00) dari Universitas Logistik dan Bisnis Internasional (ULBI), Bandung.</p>',
  '<p>Punya minat besar di web, mobile, data, dan AI. Terbiasa membangun aplikasi <em>end-to-end</em> dengan React.js, Vue.js, Node.js, PHP, MySQL, dan PostgreSQL, mulai dari pemodelan sistem (UML, ERD, Flowchart), sistem <em>e-commerce</em> dengan integrasi Midtrans dan RajaOngkir, sampai visualisasi data dengan Python dan Streamlit. Di sisi mobile, mengembangkan aplikasi dengan Flutter dan Dart. Bersertifikasi SAP.</p>',
  '<ul class="chat-widget__highlight-list">',
  '<li><strong><em>Full-stack</em> dan mobile:</strong> terbiasa membangun aplikasi <em>end-to-end</em>, dari <em>frontend</em>, <em>backend</em>, sampai basis data, untuk web maupun mobile dengan Flutter.</li>',
  '<li><strong>Analitis dan terstruktur:</strong> berpengalaman sebagai <em>System Analyst</em>, merancang ERD, UML, dan flowchart, serta mengelola jadwal dan anggaran proyek.</li>',
  '<li><strong>Kolaboratif:</strong> aktif berorganisasi dan terbiasa bekerja lintas peran dalam tim untuk menghasilkan produk yang sesuai kebutuhan pengguna.</li>',
  '</ul>',
  '<p>Peralatan yang dikuasai: Flutter, Figma, Power BI, Python, React, Streamlit, Vue.js, Excel, Plotly, Google Colab, PostgreSQL, MySQL, Node.js, dan PHP.</p>',
].join('')

// Jawaban siap pakai untuk intent "education" (kuliah / pendidikan). HTML.
export const EDUCATION_HTML = [
  '<p><strong>Jose Elio Parhusip, S.Bns.</strong> adalah <em>fresh graduate</em> Program Studi S1 Bisnis Digital, Universitas Logistik dan Bisnis Internasional (ULBI), Bandung, dengan IPK 3,75 dari 4,00.</p>',
  '<p>Selama kuliah, Jose banyak belajar merancang sistem (UML, ERD, Flowchart) serta membangun aplikasi web maupun mobile, dan memegang sertifikasi SAP sebagai nilai tambah.</p>',
].join('')

// Jawaban siap pakai untuk intent "contact". HTML, {email} diganti saat dipakai.
export const CONTACT_HTML = [
  '<p>Mau kontak Jose langsung? Kirim email ke <strong>{email}</strong>, atau lanjut mengobrol di sini, nanti aku bantu teruskan pesannya ke Jose.</p>',
].join('')

// Daftar topik yang bisa dijawab bot, ditampilkan sebagai pesan kedua saat
// percakapan baru dimulai (lihat startConversation() di ChatWidget.vue).
// Tujuannya: user tau dari awal apa aja yang bisa ditanyain, dan kalau nanya
// di luar itu, bot bisa jelas bilang "di luar topik" alih-alih maksa jawab
// asal (lihat OFFTOPIC_HTML di bawah dan intent 'offtopic').
export const TOPICS_HTML = [
  '<p>Sebelum lanjut, biar jelas dulu ya, aku cuma bisa bantu jawab soal:</p>',
  '<ul class="chat-widget__highlight-list">',
  '<li>Profil dan cerita tentang Jose</li>',
  '<li>Latar belakang pendidikan</li>',
  '<li>Pengalaman kerja dan organisasi</li>',
  '<li>Proyek-proyek yang pernah dikerjakan</li>',
  '<li>Cara menghubungi Jose langsung</li>',
  '</ul>',
  '<p>Kalau nanya di luar itu, nanti aku kasih tau aja kalau itu di luar topik ya. Nah, nama kamu siapa?</p>',
].join('')

// Jawaban siap pakai untuk pertanyaan di luar topik (mis. minta resep,
// terjemahin, tanya cuaca, dsb). Dipakai lewat intent 'offtopic'.
export const OFFTOPIC_HTML =
  '<p>Hmm, itu di luar hal yang bisa aku bantu jawab di sini. Aku cuma bisa cerita soal Jose: profil, pendidikan, pengalaman kerja, proyek-proyek, atau cara menghubungi dia langsung. Coba tanya soal itu ya.</p>'

// Semua field role/company/summary di bawah ini berisi HTML (boleh ada <em>).
export const EXPERIENCES = [
  {
    period: 'Agustus 2025 sampai September 2025',
    role: '<em>Mobile Developer</em>',
    company: '<em>Solo Project</em> untuk JEC Eye Hospitals &amp; Clinics',
    summary:
      'Membangun aplikasi mobile Android (Flutter dan Dart) secara <em>end-to-end</em> untuk pasien baru non-JEC: riset kebutuhan, desain antarmuka di Figma, <em>backend</em> Node.js dan Express, fitur OCR, sampai pengujian <em>usability</em> (skor SUS 79, kategori <em>Acceptable/Good</em>).',
    tags: ['Flutter', 'Dart', 'Figma'],
  },
  {
    period: 'Juli 2024 sampai September 2024',
    role: '<em>Back End Developer</em>',
    company: '<em>Group Project</em> di Kantor Pusat PT Pos Indonesia',
    summary:
      'Mengembangkan <em>backend</em> aplikasi web IHSAN POS (Node.js, PostgreSQL) untuk pengelolaan data tenaga kerja profesional PT Pos Indonesia. Hasil proyek dipublikasikan di Jurnal JUISI (Sinta 5).',
    tags: ['Backend', 'REST API', 'Database'],
  },
  {
    period: 'Mei 2023 sampai April 2024',
    role: '<em>System Analyst</em>',
    company: 'Program Pembinaan Mahasiswa Wirausaha, Kampus Merdeka',
    summary:
      'Mengelola anggaran proyek dari estimasi biaya hingga pencatatan pengeluaran, serta melakukan pemodelan sistem (Flowchart, ERD, UML) sebagai dasar platform <em>marketplace</em> UMKM yang didanai Kemendikbudristek.',
    tags: ['ERD', 'UML', 'Flowchart'],
  },
  {
    period: 'Oktober 2022 sampai Mei 2023',
    role: '<em>Deputy Human Capital and Governance</em>',
    company: 'Himpunan Mahasiswa Bisnis Digital',
    summary:
      'Membantu proses rekrutmen dan seleksi pengurus, menyusun target, jadwal, dan anggaran organisasi, serta mempersiapkan rapat umum sebagai Komite Pengarah.',
    tags: ['Organisasi', 'Rekrutmen'],
  },
]

// Bangun jawaban intent "experience" sebagai list bernomor (1, 2, 3, ...),
// dirender lewat v-html di ChatWidget.vue. Tag ditampilkan sebagai badge
// teks polos saja, tanpa ikon/logo.
export function buildExperienceListHtml() {
  const items = EXPERIENCES.map((item) => {
    const tagsHtml = item.tags.map((tag) => `<span class="chat-widget__exp-tag">${tag}</span>`).join('')

    return [
      '<li class="chat-widget__exp-item">',
      '<div class="chat-widget__exp-content">',
      `<p class="chat-widget__exp-period">${item.period}</p>`,
      `<p class="chat-widget__exp-role">${item.role}</p>`,
      `<p class="chat-widget__exp-company">${item.company}</p>`,
      `<p class="chat-widget__exp-summary">${item.summary}</p>`,
      tagsHtml ? `<div class="chat-widget__exp-tags">${tagsHtml}</div>` : '',
      '</div>',
      '</li>',
    ].join('')
  }).join('')

  return `<ol class="chat-widget__exp-list">${items}</ol>`
}

// title tetap nama proyek asli (nama diri, tidak diterjemahkan). summary berisi HTML.
export const PROJECTS = [
  {
    title: 'Dashboard KOL',
    summary:
      'Dasbor BI interaktif 5 halaman (Streamlit dan Plotly) untuk memantau GMV dan performa kampanye TikTok Shop secara waktu nyata, dilengkapi wawasan otomatis berbasis AI dari Gemini API.',
    image: kolThumb,
    tags: ['Python', 'Streamlit', 'Excel'],
    demoHref: 'https://dashboard-savvy.streamlit.app/',
    codeHref: 'https://github.com/joseparhusip/dashboard-savvy',
  },
  {
    title: 'Mobile JEC',
    summary:
      'Aplikasi mobile untuk pasien JEC Eye Hospitals &amp; Clinics, dibangun dengan Flutter dan Dart serta <em>backend</em> Node.js/Express. Dilengkapi fitur OCR untuk membaca KTP secara otomatis dan fitur masuk memakai akun Google.',
    image: mobileJecThumb,
    tags: ['Flutter', 'Node.js', 'MySQL', 'Google Login'],
    demoHref: 'https://drive.google.com/file/d/1oze0Swrzc9JgRU-l0gX_ZiuBRP6WWuNV/view?usp=sharing',
    codeHref: 'https://github.com/joseparhusip/application_jec',
  },
  {
    title: 'Dashboard JEC',
    summary:
      'Dasbor admin (React JS dan Node.js/Express) untuk mengelola data pasien, jadwal, dan operasional klinik secara terpusat, terintegrasi satu basis data dengan Mobile JEC.',
    image: dashboardJecThumb,
    tags: ['React', 'Node.js', 'MySQL'],
    demoHref: 'https://administrator-jec.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/administrator-jec',
  },
  {
    title: 'Secura Kost',
    summary:
      'Prototipe <em>marketplace</em> kost (Vue.js dan Tailwind CSS) dengan tur virtual 360 derajat, autentikasi dua peran (penyewa dan pemilik), serta <em>landing page</em> dinamis.',
    image: securaKostThumb,
    tags: ['React', 'Tailwind CSS'],
    demoHref: 'https://secura-kost.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/secura-kost',
  },
  {
    title: 'Toko Kelontong Online',
    summary:
      'Prototipe <em>e-commerce</em> (Vue.js, Pinia, dan Tailwind CSS) dengan katalog produk dinamis, filter kategori, keranjang belanja reaktif, serta alur pemesanan lengkap.',
    image: tokoKelontongThumb,
    tags: ['React'],
    demoHref: 'https://toko-kelontong-online.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/toko-kelontong-online',
  },
  {
    title: 'Kindle Coffee',
    summary:
      'Prototipe <em>front-end</em> kedai kopi Kindle Coffee (Vue.js, Pinia, dan Tailwind CSS) dengan pemilihan meja/kursi interaktif, simulasi proses pembayaran Midtrans, serta cetak struk ke PDF.',
    image: kindleCoffeeThumb,
    tags: ['Vue.js', 'Tailwind CSS'],
    demoHref: 'https://kindle-coffeeid.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/kindle-coffee.id',
  },
]

// --- Intent detection --------------------------------------------------
// Deteksi maksud sederhana berbasis kata kunci (Bahasa Indonesia + gaul).
// Urutan pengecekan penting: yang lebih spesifik (pendidikan, proyek,
// pengalaman, kontak) dicek duluan sebelum fallback umum (siapa/tentang).

// Catatan: sengaja TIDAK pakai \b di ujung kata kunci (cuma di awal).
// Alasannya, Bahasa Indonesia gampang banget nempelin akhiran ke kata
// bahasa Inggris/serapan ("project**nya**", "portofolio**nya**",
// "kerja**annya**", "kontak**in**"), dan \b di ujung bikin kata-kata
// begini GAGAL match karena tidak ada batas kata di antara huruf terakhir
// keyword dan akhiran tadi. \b di awal tetap dipakai supaya tidak ikut
// ke-trigger oleh potongan kata lain (misal "berkarya" tetap ke-detect
// wajar sebagai "karya", tapi kita hindari match di tengah kata acak).
const RX = {
  education: /\b(kuliah|pendidikan|sekolah|universitas|kampus|jurusan|ulbi|almamater|s1|ipk)/i,
  projects: /\b(proyek|project|projek|portofolio|portfolio|karya)/i,
  experience: /\b(pengalaman|experience|karir|karier|riwayat\s*kerja|job)\b|\bkerja(?!in)/i,
  contact: /\b(kontak|contact|hubungi|nomor|whatsapp|\bwa\b|hire|hiring)/i,
  who: /\b(siapa|kenalan|kenalin|perkenalkan|who is)/i,
  about: /\b(tentang|about|profil|deskripsi diri|ceritain)/i,
  mentionsJose: /\bjose\b/i,
  question: /[?]|apa|gimana|bagaimana|dimana|di mana|kapan|berapa/i,
  link: /\b(link|url|tautan|demo|github|repo|source ?code)/i,

  // Kata "pekerjaan"/"kerjaan" sendirian itu ambigu: bisa maksudnya nanya
  // riwayat pekerjaan Jose (-> intent 'experience'), atau malah user yang
  // mau nawarin kerjaan/kolaborasi ke Jose (-> intent 'contact'). Kalau ada
  // kata lain yang menjelaskan salah satu arah itu, langsung dijawab tanpa
  // nanya balik. Kalau kata "pekerjaan"/"kerjaan"-nya berdiri sendiri tanpa
  // petunjuk lain, baru dilempar sebagai intent 'ambiguous_pekerjaan' biar
  // bot nanya balik ke user, bukan asal nebak.
  pekerjaanAmbiguous: /\b(pekerjaan|kerjaan)\b/i,
  pekerjaanHistoryHint: /\b(riwayat|pengalaman|history|karier|karir|dulu|sebelumnya)\b/i,
  pekerjaanOfferHint: /\b(nawarin|tawarin|loker|lowongan|hire|hiring|kerja ?sama|kolaborasi|freelance|proyekan|rekrut)\b/i,

  // Kata kunci umum buat pertanyaan yang jelas-jelas di luar topik seputar
  // Jose (resep masakan, cuaca, terjemahan, dsb). Ini daftar contoh, bukan
  // daftar lengkap, tapi cukup buat nangkep kasus-kasus umum biar bot tidak
  // asal nyangka itu nama/email/pesan pas lagi ngisi form kontak.
  offtopic:
    /\b(resep|masak(?:an|in)?|memasak|cuaca|ramalan cuaca|terjemahkan|translate|nyanyikan|lirik lagu|pr matematika|hitungkan|ramal(?:an)?|zodiak|jodoh)\b/i,
}

/**
 * Mendeteksi apakah sebuah pesan user adalah pertanyaan FAQ seputar Jose.
 * Return null kalau bukan (artinya biarkan alur form kontak yang jalan).
 */
export function matchFaqIntent(rawText) {
  const text = (rawText || '').toLowerCase()

  if (RX.education.test(text)) return { type: 'education' }
  if (RX.projects.test(text)) return { type: 'projects', wantsLink: RX.link.test(text) }
  if (RX.experience.test(text)) return { type: 'experience' }
  if (RX.contact.test(text)) return { type: 'contact' }
  if (RX.who.test(text) || RX.about.test(text)) return { type: 'about' }

  // Pertanyaan pribadi umum yang menyebut "jose" + berbentuk pertanyaan,
  // misalnya "jose orangnya kayak gimana?" -> jatuhkan ke jawaban "about".
  if (RX.mentionsJose.test(text) && RX.question.test(text)) {
    return { type: 'about' }
  }

  // "pekerjaan"/"kerjaan" tanpa konteks lain itu ambigu, lihat komentar di
  // RX.pekerjaanAmbiguous di atas.
  if (RX.pekerjaanAmbiguous.test(text)) {
    if (RX.pekerjaanHistoryHint.test(text)) return { type: 'experience' }
    if (RX.pekerjaanOfferHint.test(text)) return { type: 'contact' }
    return { type: 'ambiguous_pekerjaan' }
  }

  if (RX.offtopic.test(text)) return { type: 'offtopic' }

  return null
}

// Kata kunci yang dipakai user buat jawab pertanyaan klarifikasi
// "riwayat kerja atau nawarin kerjaan?" (dipicu dari intent
// 'ambiguous_pekerjaan'). Diekspor terpisah supaya ChatWidget.vue bisa
// pakai daftar kata kunci yang sama persis, tidak ada duplikasi aturan.
export const PEKERJAAN_CLARIFY_HISTORY_RX = RX.pekerjaanHistoryHint
export const PEKERJAAN_CLARIFY_OFFER_RX = /\b(nawarin|tawarin|loker|lowongan|hire|hiring|kerja ?sama|kolaborasi|freelance|proyekan|rekrut|kontak)\b/i

// Mendeteksi kalau user lagi menyebutkan namanya sendiri, misal "nama aku
// jose", "namaku jose", "nama saya itu jose". Dipakai supaya kalimat kayak
// gini tidak salah dianggap sebagai nama literal utuh (jadinya "nama aku
// jose" bukannya "jose") atau salah dianggap email pas lagi di step email.
// Return null kalau tidak cocok, atau { name } (huruf pertama besar) kalau
// cocok.
const NAME_STATEMENT_RX = /\bnama(?:ku|\s*(?:aku|saya|gue|gw))?\s*(?:itu|adalah|:)?\s+([a-zA-Z][a-zA-Z'.\- ]{0,40})/i

export function matchNameStatement(rawText) {
  const text = (rawText || '').trim()
  if (!text) return null

  const match = text.match(NAME_STATEMENT_RX)
  if (!match) return null

  const firstWord = match[1].trim().split(/\s+/)[0].replace(/[^a-zA-Z'-]/g, '')
  if (!firstWord) return null

  const name = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase()
  return { name }
}
