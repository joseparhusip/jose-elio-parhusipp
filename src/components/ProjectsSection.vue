<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { vReveal } from '@/directives/reveal'
import GithubContributions from './GithubContributions.vue'

// Tech stack icons
import pythonIcon from './icons/icons-about/Python-logo-notext.svg'
import streamlitIcon from './icons/icons-about/Streamlit.svg'
import excelIcon from './icons/icons-about/excel-logo.svg'
import flutterIcon from './icons/icons-about/lockup_flutter_horizontal.svg'
import nodeIcon from './icons/icons-about/Node.js_logo.svg'
import mysqlIcon from './icons/icons-about/mysql-ar21.svg'
import googleIcon from './icons/icons-about/google-icon-logo-svgrepo-com.svg'
import reactIcon from './icons/icons-about/React-icon.svg'
import tailwindIcon from './icons/icons-about/Tailwind_CSS_Logo.svg'
import vueIcon from './icons/icons-about/Vue.js_Logo_2.svg'

// Thumbnail proyek
import kolThumb from './img-proyek/img-bisnis-intelegence/img-savvy-1.png'
import mobileJecThumb from './img-proyek/img-jec/IMG-JEC-1.jpeg'
import dashboardJecThumb from './img-proyek/img-admin-jec/img-admin-jec-1.png'
import securaKostThumb from './img-proyek/img-securakost/img-secura-kost.png'
import tokoKelontongThumb from './img-proyek/img-toko-kelontong/img-toko-kelontong.png'
import kindleCoffeeThumb from './img-proyek/img-kindle-coffee/img-kindle-coffee.png'
import medcredixThumb from './img-proyek/img-medcredix/img-medcredix-risk-radar.png'
import simrsThumb from './img-proyek/img-simrs/img-simrs-pasien.png'
import medcredixLogin from './img-proyek/img-medcredix/img-medcredix-login.png'
import medcredixPortalEnv from './img-proyek/img-medcredix/img-medcredix-portal-lingkungan.png'
import medcredixPortalApi from './img-proyek/img-medcredix/img-medcredix-portal-api.png'
import simrsSpriForm from './img-proyek/img-simrs/img-simrs-spri-form.png'
import simrsSpriPreview from './img-proyek/img-simrs/img-simrs-spri-preview.png'

// Link tombol "Lihat proyek lainnya" di kanan atas
const moreProjectsHref = 'https://github.com/joseparhusip?tab=repositories'

// Proyek internal (internal: true) tidak punya demo publik maupun repo,
// jadi tombol "Lihat demo" & GitHub-nya diganti keterangan "Proyek internal".
// shots (opsional): foto tambahan. Galeri tetap menampilkan thumb saja supaya
// layout semua proyek sama; foto lainnya dibuka lewat lightbox (geser kiri/kanan).
const projects = [
  {
    title: 'MedCredix',
    category: 'Backend · Kesehatan',
    internal: true,
    desc: [
      'Platform kesiapan kredensial rumah sakit (multi-RS, data terisolasi per RS). Saya membangun backend-nya: skema PostgreSQL 33 tabel dan REST API Go (Gin) + GORM, lengkap dengan dokumentasi Swagger.',
      'Membangun mesin skoring kesiapan RS (Health Score, BDCS, Trust) dengan rincian skor, snapshot bulanan, dan unit test. Hasilnya dipakai untuk dashboard eksekutif, daftar risiko, peringatan dini, dan rencana tindak lanjut.',
      'Mengimplementasikan keamanan berlapis: autentikasi JWT, RBAC per peran, password bcrypt, pembatas percobaan login, CAPTCHA, serta unggahan dokumen yang dienkripsi AES-256-GCM.',
      'Membangun alur kredensial tenaga medis (unggah, verifikasi atau penolakan, persetujuan, prasyarat) yang disertai audit trail, dan job otomatis untuk memperbarui status kredensial.',
      'Mengintegrasikan data SIMRS lewat klien FHIR untuk uji koneksi resource, dengan mode simulasi saat server FHIR belum tersedia.',
      'Men-deploy dengan Docker Compose (PostgreSQL, API, dan web Nginx) untuk lingkungan dev, sandbox, dan produksi di VPS. Caddy menjadi reverse proxy dengan HTTPS otomatis.',
    ],
    thumb: medcredixThumb,
    shots: [
      { src: medcredixThumb, caption: 'Hospital Risk Radar' },
      { src: medcredixLogin, caption: 'Halaman masuk dengan CAPTCHA' },
      { src: medcredixPortalEnv, caption: 'Developer Portal: Sandbox & Production' },
      { src: medcredixPortalApi, caption: 'Developer Portal: referensi API' },
    ],
    techStack: [{ name: 'Go (Gin)' }, { name: 'PostgreSQL' }, { name: 'Swagger' }, { name: 'Docker' }],
  },
  {
    title: 'SIMRS Dashboard',
    category: 'Frontend · Kesehatan',
    internal: true,
    desc: [
      'Dashboard SIMRS (sistem informasi rumah sakit) dengan Next.js 16, React 19, TypeScript, dan Tailwind CSS. Modulnya mencakup registrasi, rawat jalan, IGD, rawat inap, laboratorium, radiologi, farmasi, ruang bedah, dan kasir.',
      'Membangun alur pendaftaran rawat inap dari SPRI dokter: surat persetujuan atau penolakan pasien (tanda tangan digital atau unggah scan), pemilihan ruang dan tempat tidur, sampai cetak gelang pasien.',
      'Mengintegrasikan frontend dengan REST API backend Go (Gin) berdasarkan kontrak Swagger. Data divalidasi dengan Zod, dan hak akses dibatasi per peran pengguna.',
      'Mengemas aplikasi dengan Docker multi-stage dan Docker Compose untuk development dan production, dengan hardening container: tanpa root, filesystem read-only, batas resource, dan health check.',
      'Bekerja dalam tim dengan arsitektur backend PostgreSQL, Redis, MinIO (penyimpanan dokumen), dan Centrifugo (notifikasi realtime).',
      'Menerapkan standar kode dan privasi data medis: Husky, commitlint, dan Prettier untuk kode; NIK disamarkan dan data pasien tidak disimpan di browser.',
    ],
    thumb: simrsThumb,
    shots: [
      { src: simrsThumb, caption: 'Daftar pasien (NIK disamarkan)' },
      { src: simrsSpriForm, caption: 'Form SPRI dengan tanda tangan digital' },
      { src: simrsSpriPreview, caption: 'Preview surat SPRI' },
    ],
    techStack: [{ name: 'Next.js' }, { name: 'React' }, { name: 'TypeScript' }, { name: 'Tailwind CSS' }],
  },
  {
    title: 'Dashboard KOL',
    category: 'Data & BI',
    desc: [
      'Membangun pipeline ETL dengan Python (Pandas) untuk membersihkan dan mentransformasi data ekspor TikTok Shop.',
      'Mengidentifikasi dan memperbaiki bug double-counting pada metrik views dan likes yang menyebabkan data performa creator terhitung berulang.',
      'Merancang metrik turunan (GMV, Conversion Rate, GMV per View, Engagement Rate) serta sistem scoring creator berbasis percentile-rank yang tahan terhadap outlier.',
      'Membangun dan menghosting dashboard BI interaktif 5 halaman (Streamlit + Plotly) mencakup Overview, Campaign & Produk, Creator Intelligence, Risk & Anomali, dan AI Insights untuk monitoring GMV dan performa campaign secara real time.',
      'Mengintegrasikan Gemini AI API untuk menghasilkan analisis strategi dan rencana aksi 30 hari secara otomatis berdasarkan ringkasan performa bulanan.',
    ],
    thumb: kolThumb,
    techStack: [
      { name: 'Python', icon: pythonIcon },
      { name: 'Streamlit', icon: streamlitIcon },
      { name: 'Excel', icon: excelIcon },
    ],
    demoHref: 'https://dashboard-savvy.streamlit.app/',
    codeHref: 'https://github.com/joseparhusip/dashboard-savvy',
  },
  {
    title: 'Mobile JEC',
    category: 'Aplikasi Mobile',
    desc: [
      'Mengumpulkan data melalui kuesioner ke pengguna baru non-JEC sebagai dasar analisis kebutuhan aplikasi.',
      'Merancang UI aplikasi di Figma serta mendokumentasikan arsitektur sistem melalui Use Case, Activity, Class Diagram, dan ERD.',
      'Membangun backend menggunakan Node.js & Express.js untuk mendukung komunikasi data antara aplikasi dan server.',
      'Mengimplementasikan sistem autentikasi (auth) dan fitur keamanan aplikasi untuk melindungi data pengguna.',
      'Merancang database relasional menggunakan MySQL dengan metode pengembangan sistem Waterfall yang diintegrasikan pendekatan User-Centered Design (UCD).',
      'Mengimplementasikan UI ke aplikasi Android menggunakan Flutter & Dart, termasuk fitur OCR untuk membaca data KTP secara otomatis saat pendaftaran, serta login dengan akun Google.',
    ],
    thumb: mobileJecThumb,
    techStack: [
      { name: 'Flutter', icon: flutterIcon },
      { name: 'Node.js', icon: nodeIcon },
      { name: 'MySQL', icon: mysqlIcon },
      { name: 'Google Login', icon: googleIcon },
    ],
    demoHref: 'https://drive.google.com/file/d/1oze0Swrzc9JgRU-l0gX_ZiuBRP6WWuNV/view?usp=sharing',
    codeHref: 'https://github.com/joseparhusip/application_jec',
  },
  {
    title: 'Dashboard JEC',
    category: 'Web Admin',
    desc: [
      'Merancang dan mengembangkan antarmuka admin dashboard menggunakan React JS untuk mengelola data pasien, jadwal, dan operasional klinik secara terpusat.',
      'Membangun backend menggunakan Node.js & Express.js, satu ekosistem yang sama dengan backend Mobile JEC, untuk mendukung komunikasi data antara dashboard dan server.',
      'Mengimplementasikan sistem autentikasi (auth) dan fitur keamanan aplikasi untuk melindungi akses data admin.',
      'Menggunakan database relasional MySQL yang sama dan terintegrasi dengan aplikasi Mobile JEC, sehingga data pasien dan operasional tetap konsisten di kedua platform.',
      'Menyediakan tampilan ringkas berupa statistik, antrian pasien, dan manajemen data secara terpusat untuk mempermudah operasional klinik sehari-hari.',
    ],
    thumb: dashboardJecThumb,
    techStack: [
      { name: 'React', icon: reactIcon },
      { name: 'Node.js', icon: nodeIcon },
      { name: 'MySQL', icon: mysqlIcon },
    ],
    demoHref: 'https://administrator-jec.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/administrator-jec',
  },
  {
    title: 'Secura Kost',
    category: 'Web App',
    desc: [
      'Mengembangkan prototype platform marketplace kost secara end-to-end, mencakup perancangan UI/UX, arsitektur komponen, dan alur navigasi antar halaman.',
      'Membangun frontend menggunakan Vue.js dan Tailwind CSS.',
      'Membangun sistem autentikasi dua peran (penyewa & pemilik kost) dengan tab switching dinamis dan validasi form interaktif.',
      'Mengimplementasikan fitur Virtual Tour 360° pada detail kost untuk meningkatkan transparansi dan kepercayaan pengguna.',
      'Merancang landing page responsif dengan komponen dinamis: hero carousel, grid solusi, timeline cara kerja, dan segmentasi target audiens.',
      'Membangun modul profil tim dengan struktur visual (tree layout) menggunakan komponen reusable.',
    ],
    // Nama file gambarnya tertukar di folder: img-toko-kelontong.png berisi screenshot Secura Kost
    thumb: tokoKelontongThumb,
    // Disamakan dengan deskripsi (Vue.js + Tailwind CSS)
    techStack: [
      { name: 'Vue.js', icon: vueIcon },
      { name: 'Tailwind CSS', icon: tailwindIcon },
    ],
    demoHref: 'https://secura-kost.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/secura-kost',
  },
  {
    title: 'Toko Kelontong Online',
    category: 'E-commerce',
    desc: [
      'Mengembangkan prototype website e-commerce "Toko Kelontong Online" secara end-to-end, mencakup UI/UX, struktur komponen, dan alur navigasi halaman.',
      'Membangun frontend menggunakan Vue.js (Composition API) dan Tailwind CSS.',
      'Mengimplementasikan state management dengan Pinia untuk mengelola keranjang belanja dan filter kategori produk secara reaktif.',
      'Membangun katalog produk dinamis dengan filter kategori, fallback gambar error, dan format Rupiah otomatis.',
      'Merancang alur pemesanan lengkap dari katalog, detail pesanan, hingga riwayat pesanan pengguna.',
      'Membangun komponen reusable (navbar, footer, page header, promo banner, testimonial) untuk konsistensi desain.',
      'Menyusun halaman informasi pendukung (FAQ, cara pemesanan, kebijakan privasi, syarat & ketentuan, hubungi kami).',
    ],
    // Nama file gambarnya tertukar di folder: img-secura-kost.png berisi screenshot Toko Kelontong
    thumb: securaKostThumb,
    // Disamakan dengan deskripsi (Vue.js + Tailwind CSS)
    techStack: [
      { name: 'Vue.js', icon: vueIcon },
      { name: 'Tailwind CSS', icon: tailwindIcon },
    ],
    demoHref: 'https://toko-kelontong-online.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/toko-kelontong-online',
  },
  {
    title: 'Kindle Coffee',
    category: 'Landing Page',
    desc: [
      'Mengembangkan prototype front end website coffee shop "Kindle Coffee" secara end-to-end, mencakup UI/UX, struktur komponen, dan alur navigasi antar halaman (Home, Menu, Cart, History, About). Proyek ini murni prototype tampilan, belum terhubung ke backend/server sungguhan.',
      'Membangun frontend menggunakan Vue.js (Composition API, Vue Router) dan Tailwind CSS untuk seluruh tampilan.',
      'Mengimplementasikan state management dengan Pinia untuk mengelola keranjang belanja, pemilihan meja/kursi, dan riwayat pesanan secara reaktif.',
      'Membangun halaman Menu dengan filter kategori produk serta katalog dinamis menggunakan komponen ProductCard yang reusable.',
      'Merancang alur pemesanan pada halaman Cart, mencakup pemilihan nomor meja/kursi interaktif dan simulasi checkout (integrasi UI Midtrans Snap sebagai contoh alur pembayaran, tanpa backend nyata).',
      'Membangun halaman Riwayat Pesanan dengan filter rentang tanggal, status pesanan pending dengan countdown, serta fitur cetak struk/invoice ke PDF menggunakan jsPDF.',
      'Menyusun halaman Home dan About sebagai landing page dengan hero section, value proposition, dan testimoni untuk memperkuat identitas brand.',
    ],
    thumb: kindleCoffeeThumb,
    techStack: [
      { name: 'Vue.js', icon: vueIcon },
      { name: 'Tailwind CSS', icon: tailwindIcon },
    ],
    demoHref: 'https://kindle-coffeeid.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/kindle-coffee.id',
  },
]

const total = projects.length

// ---- Galeri (coverflow) ----
// Index proyek yang sedang di tengah
const activeIndex = ref(0)
const activeProject = computed(() => projects[activeIndex.value])

// Jarak tiap slide dari slide tengah, melingkar (proyek terakhir ada di kiri proyek pertama).
// Hasil: 0 = tengah, -1/1 = samping, -2/2 = paling luar, sisanya disembunyikan.
function offsetOf(index) {
  let d = (index - activeIndex.value + total) % total
  if (d > total / 2) d -= total
  return d
}

function goTo(index) {
  activeIndex.value = (index + total) % total
}

function next() {
  goTo(activeIndex.value + 1)
}

function prev() {
  goTo(activeIndex.value - 1)
}

// Klik gambar: kalau slide samping → geser ke tengah, kalau slide tengah → buka lightbox
function onSlideClick(index) {
  if (index === activeIndex.value) openLightbox(projects[index])
  else goTo(index)
}

// Geser dengan swipe (HP) atau drag mouse
let pointerStartX = null
let pointerMoved = false

function onPointerDown(event) {
  pointerStartX = event.clientX
  pointerMoved = false
}

function onPointerUp(event) {
  if (pointerStartX === null) return
  const dx = event.clientX - pointerStartX
  pointerStartX = null
  if (Math.abs(dx) < 45) return
  pointerMoved = true
  if (dx < 0) next()
  else prev()
}

// Klik yang terjadi tepat setelah swipe diabaikan supaya tidak ikut membuka lightbox
function onSlideClickGuarded(index) {
  if (pointerMoved) {
    pointerMoved = false
    return
  }
  onSlideClick(index)
}

// ---- Detail pengerjaan (daftar poin di bawah judul) ----
const detailOpen = ref(false)

function toggleDetail() {
  detailOpen.value = !detailOpen.value
}

// Tutup detail setiap pindah proyek supaya tampilan tetap ringkas
watch(activeIndex, () => {
  detailOpen.value = false
})

// ---- Lightbox: klik gambar tengah untuk melihat versi penuhnya ----
// Proyek dengan beberapa foto bisa digeser di dalam lightbox.
const lightboxProject = ref(null)
const lightboxIndex = ref(0)

function shotsOf(project) {
  return project.shots || [{ src: project.thumb, caption: '' }]
}

const lightboxShots = computed(() => (lightboxProject.value ? shotsOf(lightboxProject.value) : []))
const lightboxShot = computed(() => lightboxShots.value[lightboxIndex.value])

function openLightbox(project) {
  lightboxIndex.value = 0
  lightboxProject.value = project
}

function closeLightbox() {
  lightboxProject.value = null
}

function stepLightbox(dir) {
  const n = lightboxShots.value.length
  lightboxIndex.value = (lightboxIndex.value + dir + n) % n
}

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}

// Domain demo ditampilkan di "address bar" mockup browser
function hostLabel(project) {
  return project.internal ? 'Proyek internal' : demoHost(project.demoHref)
}

function demoHost(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'drive.google.com' ? 'APK · Google Drive' : host
  } catch {
    return ''
  }
}

// Keyboard: Esc menutup lightbox/detail, panah kiri/kanan menggeser galeri
const galleryEl = ref(null)

// Galeri mulai "tertumpuk" di tengah, lalu terbuka seperti kipas saat pertama terlihat
const galleryState = ref('folded') // folded -> opening -> open
let galleryOpenTimer = null

function openGallery() {
  galleryState.value = 'opening'
  galleryOpenTimer = setTimeout(() => (galleryState.value = 'open'), 1300)
}

onUnmounted(() => clearTimeout(galleryOpenTimer))

function onKeydown(event) {
  if (event.key === 'Escape') {
    if (lightboxProject.value) closeLightbox()
    else if (detailOpen.value) detailOpen.value = false
    return
  }
  if (lightboxProject.value) {
    if (lightboxShots.value.length > 1 && event.key === 'ArrowRight') stepLightbox(1)
    else if (lightboxShots.value.length > 1 && event.key === 'ArrowLeft') stepLightbox(-1)
    return
  }
  // Panah hanya aktif kalau fokus sedang ada di galeri, supaya tidak bentrok dengan scroll halaman
  if (!galleryEl.value || !galleryEl.value.contains(document.activeElement)) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <section id="proyek" class="projects">
    <div class="container">
      <header class="section-head">
        <div class="section-head__meta">
          <span v-reveal class="section-label">
            <span class="section-label__num">03</span> Proyek
          </span>
          <span v-reveal="80" class="section-head__note">
            {{ String(total).padStart(2, '0') }} proyek terpilih<br />Web · Mobile · Data
          </span>
        </div>
        <div class="section-head__main projects__head-main">
          <div>
            <h2 v-reveal.clip="80" class="section-title">
              Karya yang pernah saya <span class="serif-accent">bangun</span>
            </h2>
            <p v-reveal="160" class="section-lead projects__lead">
              Kumpulan proyek yang menunjukkan cara saya berpikir, mulai dari
              menyusun struktur sampai menyelesaikan detail kecil.
            </p>
          </div>
          <a
            v-reveal="200"
            :href="moreProjectsHref"
            class="btn btn--ghost projects__more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat proyek lainnya
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
            </svg>
          </a>
        </div>
      </header>

      <!-- Galeri coverflow -->
      <div
        ref="galleryEl"
        v-reveal.scale="{ delay: 120, onReveal: openGallery }"
        class="gallery"
        :class="{
          'gallery--folded': galleryState === 'folded',
          'gallery--opening': galleryState === 'opening',
        }"
        role="region"
        aria-roledescription="carousel"
        aria-label="Galeri proyek"
      >
        <div
          class="gallery__stage"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="pointerStartX = null"
        >
          <button
            v-for="(project, index) in projects"
            :key="project.title"
            type="button"
            class="gallery__slide"
            :class="{
              'gallery__slide--active': offsetOf(index) === 0,
              'gallery__slide--hidden': Math.abs(offsetOf(index)) > 2,
              'gallery__slide--far': Math.abs(offsetOf(index)) === 2,
            }"
            :style="{ '--d': offsetOf(index), '--abs': Math.abs(offsetOf(index)) }"
            :tabindex="Math.abs(offsetOf(index)) > 1 ? -1 : 0"
            :aria-hidden="Math.abs(offsetOf(index)) > 2"
            :aria-current="offsetOf(index) === 0 ? 'true' : undefined"
            :data-cursor="offsetOf(index) === 0 ? 'Lihat' : 'Pilih'"
            :aria-label="offsetOf(index) === 0
              ? `Perbesar gambar ${project.title}`
              : `Tampilkan proyek ${project.title}`"
            oncontextmenu="return false"
            @click="onSlideClickGuarded(index)"
            @contextmenu.prevent="preventImageAction"
          >
            <!-- Mockup jendela browser -->
            <span class="gallery__chrome" aria-hidden="true">
              <span class="gallery__no">No. {{ String(index + 1).padStart(2, '0') }}</span>
              <span class="gallery__url">{{ hostLabel(project) }}</span>
              <span v-if="project.shots?.length > 1" class="gallery__shots">
                {{ project.shots.length }} foto
              </span>
            </span>
            <span class="gallery__shot">
              <img
                :src="project.thumb"
                :alt="project.title"
                class="gallery__img"
                :loading="Math.abs(offsetOf(index)) <= 1 ? 'eager' : 'lazy'"
                draggable="false"
                oncontextmenu="return false"
                @contextmenu.prevent="preventImageAction"
                @dragstart.prevent="preventImageAction"
              />
              <span v-if="offsetOf(index) === 0" class="gallery__zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </span>
          </button>
        </div>

        <!-- Bar kontrol: nomor, penanda posisi, tombol geser -->
        <div class="gallery__controls">
          <span class="gallery__counter mono-meta">
            No. <strong>{{ String(activeIndex + 1).padStart(2, '0') }}</strong>
            / {{ String(total).padStart(2, '0') }}
          </span>

          <div class="gallery__dots-nav" role="tablist" aria-label="Pilih proyek">
            <button
              v-for="(project, index) in projects"
              :key="`dot-${project.title}`"
              type="button"
              role="tab"
              class="gallery__dot"
              :class="{ 'gallery__dot--active': index === activeIndex }"
              :aria-selected="index === activeIndex"
              :aria-label="`Proyek ${index + 1}: ${project.title}`"
              @click="goTo(index)"
            ></button>
          </div>

          <div class="gallery__arrows">
            <button type="button" class="gallery__arrow" aria-label="Proyek sebelumnya" @click="prev">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round" d="M19 12H5m6-6-6 6 6 6" />
              </svg>
            </button>
            <button type="button" class="gallery__arrow" aria-label="Proyek berikutnya" @click="next">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Info proyek aktif -->
        <Transition name="info" mode="out-in">
          <div :key="activeProject.title" class="gallery__info" aria-live="polite">
            <div class="gallery__meta">
              <span class="gallery__num" aria-hidden="true">
                {{ String(activeIndex + 1).padStart(2, '0') }}
              </span>
              <span class="gallery__category">{{ activeProject.category }}</span>
              <span v-if="!activeProject.internal" class="gallery__host">{{ demoHost(activeProject.demoHref) }}</span>
            </div>

            <div class="gallery__body">
              <h3 class="gallery__title">{{ activeProject.title }}</h3>
              <p class="gallery__summary">{{ activeProject.desc[0] }}</p>

              <!-- Teknologi: teks mono dipisah titik. Logo wordmark (Flutter,
                   Node.js, MySQL) tidak terbaca kalau dikecilkan jadi ikon. -->
              <ul class="gallery__stack" aria-label="Teknologi">
                <li v-for="tech in activeProject.techStack" :key="tech.name" class="gallery__chip">
                  {{ tech.name }}
                </li>
              </ul>

              <div class="gallery__actions">
                <button
                  type="button"
                  class="btn btn--ghost gallery__detail-btn"
                  :aria-expanded="detailOpen"
                  aria-controls="project-detail"
                  @click="toggleDetail"
                >
                  {{ detailOpen ? 'Tutup detail' : 'Detail pengerjaan' }}
                  <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    aria-hidden="true"
                    class="gallery__detail-icon"
                    :class="{ 'gallery__detail-icon--open': detailOpen }"
                  >
                    <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" d="M12 5v14M5 12h14" />
                  </svg>
                </button>

                <!-- Proyek internal: tanpa repo & demo publik -->
                <span v-if="activeProject.internal" class="gallery__private">
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                      stroke-linejoin="round" d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
                  </svg>
                  Proyek internal · tanpa demo &amp; kode publik
                </span>
                <a
                  v-if="!activeProject.internal"
                  :href="activeProject.codeHref"
                  class="gallery__icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`Kode sumber ${activeProject.title} di GitHub`"
                  title="Kode Sumber"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.78 10.77.57.1.78-.25.78-.55
                         0-.27-.01-1-.02-1.96-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66
                         -1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94
                         .1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04
                         -.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.16a10.9 10.9 0 0 1 5.74 0
                         c2.19-1.47 3.15-1.16 3.15-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04
                         0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1 0 1.51-.01 2.73-.01 3.1
                         0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z"
                    />
                  </svg>
                </a>
                <a
                  v-if="!activeProject.internal"
                  :href="activeProject.demoHref"
                  class="btn btn--primary gallery__demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`Lihat demo ${activeProject.title}`"
                >
                  Lihat demo
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                    <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </div>

              <!-- Detail pengerjaan -->
              <div
                id="project-detail"
                class="gallery__detail"
                :class="{ 'gallery__detail--open': detailOpen }"
                :aria-hidden="!detailOpen"
                :inert="!detailOpen"
              >
                <div class="gallery__detail-inner">
                  <span class="gallery__detail-eyebrow">Ringkasan pengerjaan</span>
                  <ol class="gallery__detail-list">
                    <li v-for="point in activeProject.desc" :key="point" class="gallery__detail-point">
                      {{ point }}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Grafik kontribusi GitHub -->
      <GithubContributions />
    </div>

    <!-- Lightbox: menampilkan gambar proyek secara penuh -->
    <Transition name="lightbox">
      <div
        v-if="lightboxProject"
        class="project-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="lightboxProject.title"
        oncontextmenu="return false"
        @click.self="closeLightbox"
        @contextmenu.prevent="preventImageAction"
      >
        <button
          type="button"
          class="project-lightbox__close"
          aria-label="Tutup gambar"
          @click="closeLightbox"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div class="project-lightbox__stage">
          <button
            v-if="lightboxShots.length > 1"
            type="button"
            class="project-lightbox__nav project-lightbox__nav--prev"
            aria-label="Foto sebelumnya"
            @click.stop="stepLightbox(-1)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" d="M19 12H5m6-6-6 6 6 6" />
            </svg>
          </button>

          <img
            :key="lightboxShot.src"
            :src="lightboxShot.src"
            :alt="lightboxShot.caption || lightboxProject.title"
            class="project-lightbox__img"
            draggable="false"
            oncontextmenu="return false"
            @contextmenu.prevent="preventImageAction"
            @dragstart.prevent="preventImageAction"
            @click.stop
          />

          <button
            v-if="lightboxShots.length > 1"
            type="button"
            class="project-lightbox__nav project-lightbox__nav--next"
            aria-label="Foto berikutnya"
            @click.stop="stepLightbox(1)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>

        <p class="project-lightbox__caption">
          <span>
            {{ lightboxProject.category }}
            <template v-if="lightboxShots.length > 1">
              · {{ lightboxIndex + 1 }} / {{ lightboxShots.length }}
            </template>
          </span>
          {{ lightboxProject.title }}
          <small v-if="lightboxShot.caption">{{ lightboxShot.caption }}</small>
        </p>

        <!-- Deretan thumbnail untuk lompat ke foto tertentu -->
        <div v-if="lightboxShots.length > 1" class="project-lightbox__thumbs">
          <button
            v-for="(shot, i) in lightboxShots"
            :key="shot.src"
            type="button"
            class="project-lightbox__thumb"
            :class="{ 'project-lightbox__thumb--active': i === lightboxIndex }"
            :aria-label="`Foto ${i + 1}: ${shot.caption}`"
            :aria-current="i === lightboxIndex ? 'true' : undefined"
            @click.stop="lightboxIndex = i"
          >
            <img :src="shot.src" alt="" draggable="false" />
          </button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.projects {
  padding: var(--section-y) 0;
  background: var(--color-surface);
  overflow: hidden; /* slide paling luar tidak bikin scroll horizontal */
}

.projects__head-main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem 3rem;
}

.projects__lead {
  margin: 1rem 0 0;
  max-width: 34rem;
}

.projects__more {
  flex-shrink: 0;
}

/* ---- Galeri ---- */
.gallery {
  --slide-w: min(460px, 46%);
  --slide-gap: 66%; /* jarak geser tiap slide, relatif terhadap lebar slide */
  position: relative;
}

.gallery__stage {
  position: relative;
  height: clamp(230px, 27vw, 330px);
  perspective: 1400px;
  touch-action: pan-y; /* scroll vertikal tetap jalan, swipe horizontal untuk galeri */
  user-select: none;
}

.gallery__slide {
  --scale: calc(1 - var(--abs) * 0.16);
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--slide-w);
  padding: 0;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  background: var(--color-bg);
  overflow: hidden;
  cursor: pointer;
  z-index: calc(10 - var(--abs));
  transform:
    translate(-50%, -50%)
    translateX(calc(var(--d) * var(--slide-gap)))
    scale(var(--scale));
  transition: transform 0.6s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.5s ease,
    border-color 0.3s ease;
}

/* Sebelum terlihat: semua slide menumpuk di tengah, lalu menyebar ke posisinya */
.gallery--folded .gallery__slide {
  transform: translate(-50%, -50%) scale(calc(var(--scale) * 0.92));
}

.gallery--folded .gallery__slide:not(.gallery__slide--active) {
  opacity: 0;
}

/* Saat membuka: slide yang lebih jauh menyusul sedikit belakangan */
.gallery--opening .gallery__slide {
  transition-duration: 0.95s, 0.7s, 0.3s;
  transition-delay: calc(var(--abs) * 90ms + 150ms);
}

/* Lapisan redup di slide samping supaya slide tengah menonjol */
.gallery__slide::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-surface);
  opacity: calc(var(--abs) * 0.35);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.gallery__slide--active {
  cursor: zoom-in;
  border-color: var(--color-text-soft);
}

.gallery__slide:not(.gallery__slide--active):hover {
  border-color: var(--color-text-soft);
}

.gallery__slide:not(.gallery__slide--active):hover::after {
  opacity: calc(var(--abs) * 0.2);
}

.gallery__slide--far {
  opacity: 0.7;
}

.gallery__slide--hidden {
  opacity: 0;
  pointer-events: none;
}

.gallery__slide:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

/* Bingkai atas: nomor arsip + alamat demo */
.gallery__chrome {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-rule);
  background: var(--color-surface);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.gallery__no {
  flex-shrink: 0;
  padding-right: 0.75rem;
  border-right: 1px solid var(--color-rule);
  color: var(--color-text);
}

.gallery__url {
  flex: 1;
  min-width: 0;
  text-align: left;
  text-transform: none;
  letter-spacing: 0.02em;
  color: var(--color-text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gallery__shots {
  flex-shrink: 0;
  padding-left: 0.75rem;
  border-left: 1px solid var(--color-rule);
  color: var(--color-text);
}

.gallery__shot {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
  transition: transform 0.7s var(--ease-out);
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.gallery__slide--active:hover .gallery__img {
  transform: scale(1.03);
}

.gallery__zoom {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: rgba(18, 17, 15, 0.78);
  color: #fff;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease, transform 0.3s var(--ease-out);
}

.gallery__slide--active:hover .gallery__zoom,
.gallery__slide--active:focus-visible .gallery__zoom {
  opacity: 1;
  transform: none;
}

/* ---- Bar kontrol: nomor | penanda posisi | tombol geser ---- */
.gallery__controls {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
  align-items: center;
  gap: 1rem clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(2rem, 4vw, 2.75rem);
  padding: 0.9rem 0;
  border-top: 1px solid var(--color-rule);
  border-bottom: 1px solid var(--color-rule);
}

.gallery__counter strong {
  font-weight: 500;
  color: var(--color-text);
}

.gallery__dots-nav {
  grid-row: 1;
  grid-column: 2;
  display: flex;
  gap: 0.35rem;
  margin-right: 6rem;
}

.gallery__dot {
  position: relative;
  flex: 1;
  max-width: 64px;
  height: 22px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.gallery__dot::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
  background: var(--color-rule);
  transition: background 0.25s ease;
}

.gallery__dot:hover::before {
  background: var(--color-text-soft);
}

.gallery__dot--active::before {
  background: var(--color-text);
}

.gallery__arrows {
  grid-row: 1;
  grid-column: 2;
  justify-self: end;
  display: flex;
  gap: 0.4rem;
}

.gallery__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.gallery__arrow:hover {
  border-color: var(--color-text);
  background: var(--color-bg);
}

/* ---- Info proyek aktif: nomor besar di kiri, isi di kanan ---- */
.gallery__info {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
  gap: 1rem clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(1.75rem, 3vw, 2.5rem);
}

.gallery__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.gallery__num {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(3rem, 6vw, 4.5rem);
  line-height: 0.9;
  letter-spacing: -0.02em;
  text-transform: none;
  color: var(--color-text);
}

.gallery__category {
  margin-top: 0.6rem;
  color: var(--color-text);
}

.gallery__host {
  max-width: 100%;
  text-transform: none;
  letter-spacing: 0.02em;
  color: var(--color-text-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gallery__body {
  max-width: 44rem;
}

.gallery__title {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--color-text);
  margin: 0 0 0.85rem;
}

.gallery__summary {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.gallery__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0;
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.gallery__chip {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.6;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text);
  white-space: nowrap;
}

.gallery__chip + .gallery__chip::before {
  content: '·';
  margin: 0 0.6rem;
  color: var(--color-text-soft);
}

.gallery__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.6rem;
}

.gallery__detail-btn[aria-expanded='true'] {
  border-color: var(--color-text);
}

.gallery__detail-icon {
  transition: transform 0.35s var(--ease-out);
}

.gallery__detail-icon--open {
  transform: rotate(45deg);
}

.gallery__icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  color: var(--color-text);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.gallery__icon-link:hover {
  border-color: var(--color-text);
  background: var(--color-bg);
}

.gallery__private {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.gallery__demo svg {
  transition: transform 0.25s var(--ease-out);
}

.gallery__demo:hover svg {
  transform: translate(2px, -2px);
}

/* Detail pengerjaan: buka-tutup dengan animasi tinggi (grid 0fr → 1fr) */
.gallery__detail {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.32, 0.72, 0, 1);
}

.gallery__detail--open {
  grid-template-rows: 1fr;
}

.gallery__detail-inner {
  min-height: 0;
  overflow: hidden;
}

.gallery__detail-eyebrow {
  display: block;
  margin-top: 1.75rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--color-rule);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.gallery__detail-list {
  list-style: none;
  counter-reset: detail-point;
  margin: 0.4rem 0 0.25rem;
  padding: 0;
}

.gallery__detail-point {
  position: relative;
  padding: 0.85rem 0 0.85rem 2.6rem;
  border-bottom: 1px solid var(--color-border);
  counter-increment: detail-point;
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.gallery__detail-point:last-child {
  border-bottom: 0;
}

.gallery__detail-point::before {
  content: counter(detail-point, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0.95rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-soft);
}

.gallery__detail--open .gallery__detail-point {
  animation: detail-point-in 0.45s var(--ease-out) backwards;
}

.gallery__detail-point:nth-child(1) { animation-delay: 0.08s; }
.gallery__detail-point:nth-child(2) { animation-delay: 0.13s; }
.gallery__detail-point:nth-child(3) { animation-delay: 0.18s; }
.gallery__detail-point:nth-child(4) { animation-delay: 0.23s; }
.gallery__detail-point:nth-child(5) { animation-delay: 0.28s; }
.gallery__detail-point:nth-child(n + 6) { animation-delay: 0.33s; }

@keyframes detail-point-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Transisi ganti info proyek */
.info-enter-active,
.info-leave-active {
  transition: opacity 0.25s ease, transform 0.3s var(--ease-out);
}

.info-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.info-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---- Lightbox ---- */
.project-lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  padding: 4.5rem 1.25rem 2rem;
  background: rgba(14, 12, 10, 0.92);
}

.project-lightbox__img {
  max-width: min(92vw, 1150px);
  max-height: 66vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.12);
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.project-lightbox__caption {
  display: grid;
  justify-items: center;
  gap: 0.25rem;
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
}

.project-lightbox__caption small {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

.project-lightbox__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}

.project-lightbox__nav {
  position: absolute;
  top: 50%;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-top: -22px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(14, 15, 17, 0.7);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.project-lightbox__nav:hover {
  background: rgba(255, 255, 255, 0.16);
}

.project-lightbox__nav--prev {
  left: -58px;
}

.project-lightbox__nav--next {
  right: -58px;
}

.project-lightbox__thumbs {
  display: flex;
  gap: 0.5rem;
  max-width: 100%;
  overflow-x: auto;
}

.project-lightbox__thumb {
  flex-shrink: 0;
  width: 84px;
  height: 52px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  background: none;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.project-lightbox__thumb:hover,
.project-lightbox__thumb--active {
  opacity: 1;
  border-color: #fff;
}

.project-lightbox__thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
  pointer-events: none;
}

/* Layar sempit: tombol panah masuk ke atas gambar */
@media (max-width: 1320px) {
  .project-lightbox__nav--prev {
    left: 8px;
  }

  .project-lightbox__nav--next {
    right: 8px;
  }
}

.project-lightbox__caption span {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.project-lightbox__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.project-lightbox__close:hover {
  background: rgba(255, 255, 255, 0.12);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-active .project-lightbox__img {
  transition: transform 0.4s var(--ease-out);
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-from .project-lightbox__img {
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .gallery__slide,
  .gallery__slide::after,
  .gallery__detail {
    transition: none;
  }

  .gallery__detail-point {
    animation: none !important;
  }
}

/* ---- Tablet ---- */
@media (max-width: 860px) {
  .projects__head-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .gallery {
    --slide-w: min(420px, 60%);
    --slide-gap: 62%;
  }
}

@media (max-width: 760px) {
  .gallery__controls {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .gallery__dots-nav {
    grid-column: 2;
    margin-right: 0;
  }

  .gallery__arrows {
    grid-column: 3;
  }

  .gallery__info {
    grid-template-columns: 1fr;
  }

  .gallery__meta {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4rem 0.9rem;
  }

  .gallery__num {
    font-size: 2.6rem;
  }

  .gallery__category {
    margin-top: 0;
  }
}

/* ---- HP ---- */
@media (max-width: 640px) {
  /* Slide samping dibuat mengintip di pinggir layar supaya tetap bisa diklik */
  .gallery {
    --slide-w: 84%;
    --slide-gap: 92%;
  }

  .gallery__stage {
    height: clamp(220px, 62vw, 300px);
  }

  /* Tombol: "Lihat demo" penuh di atas, detail + GitHub di bawahnya */
  .gallery__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 46px;
  }

  .gallery__demo,
  .gallery__private {
    grid-column: 1 / -1;
  }

  .gallery__demo {
    order: -1;
  }

  /* Proyek internal: tombol detail penuh, keterangan di bawahnya */
  .gallery__actions:has(.gallery__private) {
    grid-template-columns: minmax(0, 1fr);
  }

  .gallery__private {
    justify-content: center;
    text-align: center;
    line-height: 1.5;
  }

  /* Di HP cukup 3 slide yang kelihatan */
  .gallery__slide--far {
    opacity: 0;
    pointer-events: none;
  }

  .gallery__counter {
    font-size: 0.66rem;
  }

  .gallery__summary {
    font-size: 0.94rem;
  }

  .gallery__detail-point {
    padding-left: 2.1rem;
  }

  /* Di layar sentuh ikon zoom selalu terlihat sebagai petunjuk */
  .gallery__slide--active .gallery__zoom {
    opacity: 1;
    transform: none;
  }
}
</style>
