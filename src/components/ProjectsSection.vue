<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { vReveal } from '@/directives/reveal'

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

const projects = [
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
    thumb: tokoKelontongThumb,
    techStack: [
      { name: 'React', icon: reactIcon },
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
    thumb: securaKostThumb,
    techStack: [
      { name: 'React', icon: reactIcon },
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

// Bottom sheet: hanya satu kartu yang bisa terbuka dalam satu waktu
const activeIndex = ref(null)

function toggleSheet(index) {
  activeIndex.value = activeIndex.value === index ? null : index
}

function closeSheet() {
  activeIndex.value = null
}

// Lightbox: klik gambar project untuk melihat versi penuhnya
const lightboxProject = ref(null)

function openLightbox(project) {
  lightboxProject.value = project
}

function closeLightbox() {
  lightboxProject.value = null
}

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}

// Domain demo ditampilkan di "address bar" mockup browser
function demoHost(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'drive.google.com' ? 'APK · Google Drive' : host
  } catch {
    return ''
  }
}

// Tombol Esc menutup lightbox / deskripsi yang sedang terbuka
function onKeydown(event) {
  if (event.key !== 'Escape') return
  if (lightboxProject.value) closeLightbox()
  else if (activeIndex.value !== null) closeSheet()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <section id="proyek" class="projects">
    <div class="container">
      <header class="projects__header">
        <div>
          <span v-reveal class="section-label">
            <span class="section-label__num">03</span> Proyek
          </span>
          <h2 v-reveal="80" class="section-title">
            Karya yang pernah saya <span class="serif-accent">bangun</span>
          </h2>
        </div>
        <p v-reveal="160" class="section-lead projects__lead">
          Kumpulan proyek yang menunjukkan cara saya berpikir, mulai dari
          menyusun struktur sampai menyelesaikan detail kecil.
        </p>
      </header>

      <div class="projects__grid">
        <article
          v-for="(project, index) in projects"
          :key="project.title"
          v-reveal="(index % 3) * 90"
          class="project-card"
        >
          <!-- Mockup jendela browser berisi screenshot proyek -->
          <div class="project-card__frame">
            <div class="project-card__chrome" aria-hidden="true">
              <span class="project-card__dots"><i></i><i></i><i></i></span>
              <span class="project-card__url">{{ demoHost(project.demoHref) }}</span>
            </div>
            <button
              type="button"
              class="project-card__shot"
              :aria-label="`Perbesar gambar ${project.title}`"
              oncontextmenu="return false"
              @click="openLightbox(project)"
              @contextmenu.prevent="preventImageAction"
            >
              <img
                :src="project.thumb"
                :alt="project.title"
                class="project-card__shot-img"
                loading="lazy"
                draggable="false"
                oncontextmenu="return false"
                @contextmenu.prevent="preventImageAction"
                @dragstart.prevent="preventImageAction"
              />
              <span class="project-card__zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </button>
          </div>

          <div class="project-card__body">
            <div class="project-card__meta">
              <span class="project-card__num">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="project-card__category">{{ project.category }}</span>
            </div>

            <h3 class="project-card__title">{{ project.title }}</h3>
            <p class="project-card__summary">{{ project.desc[0] }}</p>

            <ul class="project-card__stack">
              <li
                v-for="tech in project.techStack"
                :key="tech.name"
                class="project-card__chip"
                oncontextmenu="return false"
                @contextmenu.prevent="preventImageAction"
              >
                <img
                  :src="tech.icon"
                  alt=""
                  class="project-card__chip-icon"
                  loading="lazy"
                  draggable="false"
                  @dragstart.prevent="preventImageAction"
                />
                {{ tech.name }}
              </li>
            </ul>

            <div class="project-card__footer">
              <button
                type="button"
                class="project-card__detail-btn"
                :aria-expanded="activeIndex === index"
                :aria-controls="`project-sheet-${index}`"
                @click="toggleSheet(index)"
              >
                Detail pengerjaan
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" d="M12 5v14M5 12h14" />
                </svg>
              </button>

              <div class="project-card__links">
                <a
                  :href="project.codeHref"
                  class="project-card__icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`Kode sumber ${project.title} di GitHub`"
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
                  :href="project.demoHref"
                  class="project-card__icon-link project-card__icon-link--primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`Lihat demo ${project.title}`"
                  title="Lihat Demo"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                    <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Panel deskripsi: naik dari bawah kartu -->
          <div
            :id="`project-sheet-${index}`"
            class="project-card__sheet"
            :class="{ 'project-card__sheet--open': activeIndex === index }"
            role="region"
            :aria-label="`Detail ${project.title}`"
            :aria-hidden="activeIndex !== index"
            :inert="activeIndex !== index"
          >
            <div class="project-card__sheet-head">
              <div>
                <span class="project-card__sheet-eyebrow">Ringkasan pengerjaan</span>
                <h4 class="project-card__sheet-title">{{ project.title }}</h4>
              </div>
              <button
                type="button"
                class="project-card__sheet-close"
                aria-label="Tutup deskripsi"
                @click="closeSheet"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <ol class="project-card__sheet-list">
              <li v-for="point in project.desc" :key="point" class="project-card__sheet-point">
                {{ point }}
              </li>
            </ol>
          </div>
        </article>
      </div>
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

        <img
          :src="lightboxProject.thumb"
          :alt="lightboxProject.title"
          class="project-lightbox__img"
          draggable="false"
          oncontextmenu="return false"
          @contextmenu.prevent="preventImageAction"
          @dragstart.prevent="preventImageAction"
          @click.stop
        />

        <p class="project-lightbox__caption">
          <span>{{ lightboxProject.category }}</span>
          {{ lightboxProject.title }}
        </p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.projects {
  padding: var(--section-y) 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.projects__header {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 1.5rem 3rem;
  align-items: end;
  margin-bottom: clamp(2.5rem, 5vw, 3.75rem);
}

.projects__lead {
  margin: 0;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

/* ---- Kartu ---- */
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  overflow: hidden;
  isolation: isolate;
  transition: border-color 0.3s ease, transform 0.4s var(--ease-out), box-shadow 0.4s ease;
}

.project-card.reveal-done:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
  box-shadow: 0 30px 60px -35px color-mix(in srgb, var(--color-primary) 70%, transparent);
}

/* Mockup browser */
.project-card__frame {
  margin: 0.75rem 0.75rem 0;
  border-radius: calc(var(--radius-lg) - 0.5rem);
  border: 1px solid var(--color-border);
  background:
    radial-gradient(120% 120% at 0% 0%, var(--color-primary-soft), transparent 55%),
    radial-gradient(120% 120% at 100% 100%, var(--color-accent-soft), transparent 55%),
    var(--color-surface);
  overflow: hidden;
}

.project-card__chrome {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid var(--color-border);
}

.project-card__dots {
  display: inline-flex;
  gap: 5px;
  flex-shrink: 0;
}

.project-card__dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-soft);
  opacity: 0.35;
}

.project-card__dots i:first-child {
  background: #ff6b6b;
  opacity: 0.9;
}

.project-card__dots i:nth-child(2) {
  background: #ffbd4a;
  opacity: 0.9;
}

.project-card__dots i:nth-child(3) {
  background: #3ecf8e;
  opacity: 0.9;
}

.project-card__url {
  flex: 1;
  min-width: 0;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  background: var(--color-bg);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--color-text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-card__shot {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  padding: 0;
  border: 0;
  background: none;
  overflow: hidden;
  cursor: zoom-in;
}

.project-card__shot-img {
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

.project-card__shot:hover .project-card__shot-img {
  transform: scale(1.05);
}

.project-card__zoom {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(11, 14, 23, 0.7);
  color: #fff;
  backdrop-filter: blur(6px);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease, transform 0.3s var(--ease-out);
}

.project-card__shot:hover .project-card__zoom,
.project-card__shot:focus-visible .project-card__zoom {
  opacity: 1;
  transform: none;
}

/* Isi kartu */
.project-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.3rem 1.4rem 1.4rem;
}

.project-card__meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.project-card__num {
  color: var(--color-text-soft);
}

.project-card__category {
  color: var(--color-accent);
}

.project-card__title {
  font-family: var(--font-heading);
  font-size: clamp(1.2rem, 1.8vw, 1.4rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0.55rem 0 0.5rem;
}

.project-card__summary {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--color-text-soft);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  margin: 1.1rem 0 0;
  padding: 0;
}

.project-card__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.28rem 0.6rem 0.28rem 0.32rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 0.74rem;
  font-weight: 500;
  color: var(--color-text);
}

.project-card__chip-icon {
  width: 20px;
  height: 20px;
  padding: 3px;
  border-radius: 50%;
  background: #fff;
  object-fit: contain;
  box-sizing: border-box;
  -webkit-user-drag: none;
  pointer-events: none;
}

.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.3rem;
}

.project-card__detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
}

.project-card__detail-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.project-card__links {
  display: flex;
  gap: 0.45rem;
}

.project-card__icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition: transform 0.25s var(--ease-out), background 0.25s ease, color 0.25s ease,
    border-color 0.25s ease;
}

.project-card__icon-link:hover {
  transform: translateY(-2px);
  border-color: var(--color-text-soft);
}

.project-card__icon-link--primary {
  border-color: transparent;
  background: var(--color-primary);
  color: #fff;
}

.project-card__icon-link--primary:hover {
  border-color: transparent;
  background: var(--color-primary-dark);
  transform: translateY(-2px) rotate(45deg);
}

/* ---- Panel deskripsi ---- */
.project-card__sheet {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  padding: 1.4rem 1.4rem 1.2rem;
  background: var(--color-surface);
  border-radius: inherit;
  transform: translateY(101%);
  visibility: hidden;
  transition: transform 0.45s cubic-bezier(0.32, 0.72, 0, 1), visibility 0s linear 0.45s;
}

.project-card__sheet--open {
  transform: translateY(0);
  visibility: visible;
  transition: transform 0.45s cubic-bezier(0.32, 0.72, 0, 1), visibility 0s;
}

.project-card__sheet-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--color-border);
}

.project-card__sheet-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.project-card__sheet-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin: 0.3rem 0 0;
}

.project-card__sheet-close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-soft);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.project-card__sheet-close:hover {
  background: var(--color-primary);
  color: #fff;
}

.project-card__sheet-list {
  list-style: none;
  counter-reset: sheet-point;
  margin: 0;
  padding: 1rem 0.2rem 0.5rem 0;
  overflow-y: auto;
  display: grid;
  gap: 0.8rem;
  align-content: start;
  scrollbar-width: thin;
}

.project-card__sheet-point {
  position: relative;
  padding-left: 2rem;
  counter-increment: sheet-point;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.project-card__sheet-point::before {
  content: counter(sheet-point, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0.1em;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-primary);
}

.project-card__sheet--open .project-card__sheet-point {
  animation: project-point-in 0.45s var(--ease-out) backwards;
}

.project-card__sheet-point:nth-child(1) { animation-delay: 0.1s; }
.project-card__sheet-point:nth-child(2) { animation-delay: 0.15s; }
.project-card__sheet-point:nth-child(3) { animation-delay: 0.2s; }
.project-card__sheet-point:nth-child(4) { animation-delay: 0.25s; }
.project-card__sheet-point:nth-child(5) { animation-delay: 0.3s; }
.project-card__sheet-point:nth-child(n + 6) { animation-delay: 0.35s; }

@keyframes project-point-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
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
  background: rgba(7, 9, 15, 0.9);
  backdrop-filter: blur(8px);
}

.project-lightbox__img {
  max-width: min(92vw, 1150px);
  max-height: 76vh;
  object-fit: contain;
  border-radius: 14px;
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.7);
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.project-lightbox__caption {
  display: grid;
  justify-items: center;
  gap: 0.2rem;
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
}

.project-lightbox__caption span {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4fd6c0;
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
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.project-lightbox__close:hover {
  background: rgba(255, 255, 255, 0.2);
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
  transform: scale(0.94);
}

@media (prefers-reduced-motion: reduce) {
  .project-card__sheet-point {
    animation: none !important;
  }
}

/* ---- Tablet ---- */
@media (max-width: 1080px) {
  .projects__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .projects__header {
    grid-template-columns: 1fr;
    align-items: start;
  }
}

/* ---- HP ---- */
@media (max-width: 640px) {
  .projects__grid {
    grid-template-columns: 1fr;
  }

  .project-card__body {
    padding: 1.15rem 1.15rem 1.2rem;
  }

  .project-card__sheet {
    padding: 1.15rem;
  }

  /* Di layar sentuh ikon zoom selalu terlihat sebagai petunjuk */
  .project-card__zoom {
    opacity: 1;
    transform: none;
  }
}
</style>
