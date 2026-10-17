<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { vReveal } from '@/directives/reveal'
import spkdLogo from './icons-experience/spkd.svg'
import jecLogo from './icons-experience/jec.svg'
import posLogo from './icons-experience/pos.svg'
import p2mwLogo from './icons-experience/p2mw.svg'
import himabigLogo from './icons-experience/himabig.svg'

const experiences = [
  {
    period: 'Oktober 2026 — Sekarang',
    role: 'Back End Developer',
    company: 'Kontrak — PT Sistem Pelayanan Kesehatan dan Data (SPKD)',
    short: 'SPKD',
    logo: spkdLogo,
    current: true,
    desc: [
      'Mengerjakan backend MedCredix, platform multi-rumah sakit untuk menilai kesiapan kredensial RS secara otomatis dari data operasional RS.',
      'Membangun 44 endpoint REST API dengan Go (Gin) dan GORM di atas PostgreSQL, lengkap dengan dokumentasi Swagger.',
      'Mengimplementasikan login JWT dan hak akses per peran (RBAC), sampai pengaturan tombol mana yang boleh dipakai tiap peran.',
      'Membangun mesin skoring kesiapan RS (rincian skor dan snapshot bulanan) yang menjadi dasar dashboard eksekutif, daftar risiko, peringatan dini, dan rencana tindak lanjut.',
      'Membangun alur kredensial tenaga medis: unggah dokumen PDF/DOC, verifikasi atau penolakan dokumen, persetujuan kredensial, dan pengelolaan prasyarat.',
      'Mengintegrasikan data SIMRS melalui uji koneksi 24 resource FHIR, serta modul klaim (deteksi anomali), data klinis, dan kepatuhan regulasi.',
      'Menyediakan data referensi: direktori RS dari registri Kemenkes, data wilayah Indonesia, dan validasi kode faskes BPJS saat menambah RS mitra.',
      'Membangun audit trail, pencarian global, dan laporan yang bisa dicetak atau diekspor; menguji API dengan Postman dan database dengan DBeaver.',
    ],
    tags: ['Go', 'Gin', 'GORM', 'PostgreSQL', 'JWT', 'FHIR', 'Swagger'],
  },
  {
    period: 'Agustus 2025 — September 2025',
    role: 'Mobile Developer',
    company: 'Solo Project — JEC Eye Hospitals & Clinics',
    short: 'JEC',
    logo: jecLogo,
    desc: [
      'Mengumpulkan data melalui kuesioner ke pengguna baru non-JEC sebagai dasar analisis kebutuhan aplikasi.',
      'Merancang UI aplikasi di Figma serta mendokumentasikan arsitektur sistem melalui Use Case, Activity, Class Diagram, dan ERD.',
      'Membangun backend menggunakan Node.js & Express.js untuk mendukung komunikasi data antara aplikasi dan server.',
      'Mengimplementasikan sistem autentikasi (auth) dan fitur keamanan aplikasi untuk melindungi data pengguna.',
      'Merancang database relasional menggunakan SQL dengan metode pengembangan sistem Waterfall yang diintegrasikan pendekatan User-Centered Design (UCD).',
      'Mengimplementasikan UI ke aplikasi Android menggunakan Flutter & Dart, termasuk fitur OCR.',
      'Melakukan Black Box Testing untuk memastikan fungsi aplikasi berjalan sesuai kebutuhan, serta evaluasi usability menggunakan System Usability Scale (SUS) melibatkan 120 responden pengguna baru, memperoleh skor rata-rata 79 (kategori Acceptable/Good).',
    ],
    tags: ['Flutter', 'Dart', 'Figma'],
  },
  {
    period: 'Juli 2024 — September 2024',
    role: 'Back End Developer',
    company: 'Group Project — Kantor Pusat PT Pos Indonesia',
    short: 'POS',
    logo: posLogo,
    desc: [
      'Mengembangkan backend web application IHSAN POS untuk mendukung pengelolaan data tenaga kerja profesional PT Pos Indonesia, dari perancangan arsitektur sistem hingga implementasi API.',
      'Merancang ERD dan membangun database menggunakan PostgreSQL yang aman dan terstruktur, termasuk konfigurasi environment untuk keamanan dan fleksibilitas sistem.',
      'Menguji dan memvalidasi seluruh endpoint API menggunakan Postman untuk memastikan proses request/response dan integrasi backend-frontend berjalan sesuai kebutuhan.',
      'Berkoordinasi dengan tim pengembang, serta menyelesaikan pengembangan tepat waktu sesuai standar keamanan dan skalabilitas; hasil proyek dipublikasikan di Jurnal JUISI (Sinta 5).',
    ],
    tags: ['Backend', 'REST API', 'Database'],
  },
  {
    period: 'Mei 2023 — April 2024',
    role: 'System Analyst',
    company: 'Program Pembinaan Mahasiswa Wirausaha — Kampus Merdeka',
    short: 'KM',
    logo: p2mwLogo,
    desc: [
      'Mengelola anggaran proyek dari estimasi biaya hingga pencatatan pengeluaran, termasuk penyusunan invoice, penawaran, dan kuitansi.',
      'Melakukan pemodelan sistem (Flowchart, ERD, UML) sebagai dasar pengembangan platform marketplace UMKM yang didanai Kemendikbudristek.',
    ],
    tags: ['ERD', 'UML', 'Flowchart'],
  },
  {
    period: 'Oktober 2022 — Mei 2023',
    role: 'Deputy Human Capital and Governance',
    company: 'Himpunan Mahasiswa Bisnis Digital (HIMABIG)',
    short: 'HIMABIG',
    logo: himabigLogo,
    // Logo HIMABIG aslinya di atas latar navy (tulisannya putih)
    logoBg: '#152348',
    desc: [
      'Membantu proses rekrutmen dan seleksi pengurus.',
      'Menyusun target, jadwal, dan anggaran organisasi.',
      'Mempersiapkan rapat umum sebagai Komite Pengarah.',
    ],
    tags: ['Organisasi', 'Rekrutmen'],
  },
]

/* ---------------------------------------------------------
   Durasi otomatis dari teks periode, mis. "Juli 2024 — September 2024"
   menjadi "3 bln". "Sekarang" dihitung sampai bulan berjalan.
--------------------------------------------------------- */
const MONTHS = [
  'januari', 'februari', 'maret', 'april', 'mei', 'juni',
  'juli', 'agustus', 'september', 'oktober', 'november', 'desember',
]

function parseMonth(text) {
  const [month, year] = text.trim().toLowerCase().split(/\s+/)
  const m = MONTHS.indexOf(month)
  return m < 0 || !year ? null : Number(year) * 12 + m
}

function monthsOf(period) {
  const [startText, endText = ''] = period.split('—')
  const start = parseMonth(startText)
  const now = new Date()
  const end = /sekarang/i.test(endText)
    ? now.getFullYear() * 12 + now.getMonth()
    : parseMonth(endText)
  if (start === null || end === null) return 0
  return Math.max(1, end - start + 1)
}

function formatMonths(total) {
  if (!total) return ''
  const years = Math.floor(total / 12)
  const months = total % 12
  return [years && `${years} thn`, months && `${months} bln`].filter(Boolean).join(' ')
}

function duration(period) {
  return formatMonths(monthsOf(period))
}

// Tahun mulai–selesai singkat untuk tab, mis. "2024" atau "2023–2024"
function yearRange(period) {
  const [startText, endText = ''] = period.split('—')
  const startYear = startText.trim().split(/\s+/).pop()
  const endYear = /sekarang/i.test(endText) ? 'Kini' : endText.trim().split(/\s+/).pop()
  return startYear === endYear ? startYear : `${startYear}–${endYear}`
}

// "Solo Project — JEC Eye ..." dipecah jadi badge tipe + nama tempat
function splitCompany(company) {
  const [first, ...rest] = company.split(' — ')
  return rest.length ? { type: first, name: rest.join(' — ') } : { type: '', name: first }
}

// Panjang "bar durasi" di tiap tab, relatif terhadap peran terlama
const longest = Math.max(...experiences.map((e) => monthsOf(e.period)))
function tenureRatio(item) {
  return Math.max(0.08, monthsOf(item.period) / longest)
}

const totalMonths = experiences.reduce((sum, e) => sum + monthsOf(e.period), 0)
const firstYear = Math.min(...experiences.map((e) => Number(e.period.split('—')[0].trim().split(/\s+/).pop())))

/* ---------------------------------------------------------
   Tab: pilih satu peran, detailnya tampil di panel kanan
--------------------------------------------------------- */
const activeIndex = ref(0)
const active = computed(() => experiences[activeIndex.value])
const activeCompany = computed(() => splitCompany(active.value.company))

const tabRefs = ref([])
const tablistEl = ref(null)

function setTabRef(el, index) {
  if (el) tabRefs.value[index] = el
}

function select(index, focus = false) {
  activeIndex.value = (index + experiences.length) % experiences.length
  if (focus) nextTick(() => tabRefs.value[activeIndex.value]?.focus())
}

// Navigasi keyboard pola WAI-ARIA tabs: panah, Home, End
function onTabKeydown(event) {
  const keys = {
    ArrowDown: 1,
    ArrowRight: 1,
    ArrowUp: -1,
    ArrowLeft: -1,
  }
  if (event.key in keys) {
    event.preventDefault()
    select(activeIndex.value + keys[event.key], true)
  } else if (event.key === 'Home') {
    event.preventDefault()
    select(0, true)
  } else if (event.key === 'End') {
    event.preventDefault()
    select(experiences.length - 1, true)
  }
}

/* Indikator yang "meluncur" ke tab aktif (desktop: vertikal, HP: horizontal) */
const indicator = ref({ x: 0, y: 0, w: 0, h: 0 })

function updateIndicator() {
  const tab = tabRefs.value[activeIndex.value]
  if (!tab) return
  indicator.value = { x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight }
}

// Di HP tab berbentuk baris yang bisa digeser; tab aktif digeser ke tengah
function scrollActiveTabIntoView() {
  const list = tablistEl.value
  const tab = tabRefs.value[activeIndex.value]
  if (!list || !tab || list.scrollWidth <= list.clientWidth) return
  const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2
  list.scrollTo({ left, behavior: 'smooth' })
}

/* Poin panjang dilipat: tampil 4 dulu, sisanya lewat "Lihat semua" */
const PREVIEW_COUNT = 4
const expanded = ref(false)
const visiblePoints = computed(() =>
  expanded.value ? active.value.desc : active.value.desc.slice(0, PREVIEW_COUNT),
)

watch(activeIndex, () => {
  expanded.value = false
  nextTick(() => {
    updateIndicator()
    scrollActiveTabIntoView()
  })
})

let resizeObserver
onMounted(() => {
  nextTick(updateIndicator)
  // Ukuran tab berubah saat font selesai dimuat / layar diubah
  resizeObserver = new ResizeObserver(() => updateIndicator())
  if (tablistEl.value) resizeObserver.observe(tablistEl.value)
  window.addEventListener('resize', updateIndicator)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateIndicator)
})

const logoStyle = (item) =>
  item.logoBg ? { background: item.logoBg, borderColor: 'transparent' } : null
</script>

<template>
  <section id="pengalaman" class="experience">
    <div class="container">
      <header class="experience__header">
        <div>
          <span v-reveal class="section-label">
            <span class="section-label__num">02</span> Pengalaman
          </span>
          <h2 v-reveal="80" class="section-title">
            Perjalanan singkat <span class="serif-accent">sejauh</span> ini
          </h2>
          <p v-reveal="160" class="section-lead experience__lead">
            Beberapa peran yang pernah saya jalani, dari pekerjaan profesional, proyek mandiri,
            sampai organisasi, yang membentuk cara saya bekerja.
          </p>
        </div>

        <dl v-reveal="240" class="experience__summary">
          <div>
            <dt>Peran</dt>
            <dd>{{ experiences.length }}</dd>
          </div>
          <div>
            <dt>Rentang</dt>
            <dd>{{ firstYear }}<span>–</span>{{ new Date().getFullYear() }}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd class="experience__summary-small">{{ formatMonths(totalMonths) }}</dd>
          </div>
        </dl>
      </header>

      <div v-reveal="120" class="experience__layout">
        <!-- Daftar peran (tab) -->
        <div
          ref="tablistEl"
          class="experience__tabs"
          role="tablist"
          aria-label="Daftar pengalaman"
          aria-orientation="vertical"
          @keydown="onTabKeydown"
        >
          <span
            class="experience__indicator"
            aria-hidden="true"
            :style="{
              '--ix': `${indicator.x}px`,
              '--iy': `${indicator.y}px`,
              '--iw': `${indicator.w}px`,
              '--ih': `${indicator.h}px`,
            }"
          ></span>

          <button
            v-for="(item, index) in experiences"
            :id="`exp-tab-${index}`"
            :key="item.role + item.period"
            :ref="(el) => setTabRef(el, index)"
            type="button"
            role="tab"
            class="experience__tab"
            :class="{ 'experience__tab--active': index === activeIndex }"
            :aria-selected="index === activeIndex"
            aria-controls="exp-panel"
            :tabindex="index === activeIndex ? 0 : -1"
            @click="select(index)"
          >
            <span
              class="experience__logo experience__logo--sm"
              :style="logoStyle(item)"
              oncontextmenu="return false"
            >
              <img
                v-if="item.logo"
                :src="item.logo"
                alt=""
                width="40"
                height="28"
                loading="lazy"
                draggable="false"
              />
              <span v-else aria-hidden="true">{{ item.short }}</span>
            </span>

            <span class="experience__tab-text">
              <span class="experience__tab-role">{{ item.role }}</span>
              <span class="experience__tab-company">{{ item.short }}</span>
            </span>

            <span class="experience__tab-year">
              <span v-if="item.current" class="experience__now" aria-hidden="true"></span>
              {{ yearRange(item.period) }}
            </span>

            <!-- Bar durasi: makin panjang, makin lama perannya -->
            <span class="experience__tenure" aria-hidden="true">
              <span class="experience__tenure-fill" :style="{ '--ratio': tenureRatio(item) }"></span>
            </span>
          </button>
        </div>

        <!-- Detail peran aktif -->
        <div
          id="exp-panel"
          class="experience__panel"
          role="tabpanel"
          :aria-labelledby="`exp-tab-${activeIndex}`"
        >
          <Transition name="panel" mode="out-in">
            <article :key="active.role + active.period" class="experience__card">
              <span class="experience__card-num" aria-hidden="true">
                {{ String(activeIndex + 1).padStart(2, '0') }}
              </span>

              <div class="experience__head">
                <span
                  class="experience__logo"
                  :style="logoStyle(active)"
                  oncontextmenu="return false"
                >
                  <img
                    v-if="active.logo"
                    :src="active.logo"
                    :alt="`Logo ${active.short}`"
                    width="52"
                    height="36"
                    draggable="false"
                  />
                  <span v-else aria-hidden="true">{{ active.short }}</span>
                </span>

                <div class="experience__head-text">
                  <span v-if="activeCompany.type" class="experience__type">{{ activeCompany.type }}</span>
                  <h3 class="experience__role">{{ active.role }}</h3>
                  <span class="experience__company">{{ activeCompany.name }}</span>
                </div>
              </div>

              <div class="experience__meta">
                <span class="experience__period">
                  <span v-if="active.current" class="experience__now" aria-hidden="true"></span>
                  {{ active.period }}
                </span>
                <span v-if="duration(active.period)" class="experience__duration">
                  {{ duration(active.period) }}
                </span>
                <span v-if="active.current" class="experience__current">Sedang berjalan</span>
              </div>

              <ol class="experience__points">
                <li
                  v-for="(point, pIndex) in visiblePoints"
                  :key="pIndex"
                  class="experience__point"
                  :style="{ '--i': pIndex }"
                >
                  {{ point }}
                </li>
              </ol>

              <div class="experience__card-bottom">
                <ul class="experience__tags">
                  <li v-for="tag in active.tags" :key="tag" class="experience__tag">{{ tag }}</li>
                </ul>

                <button
                  v-if="active.desc.length > PREVIEW_COUNT"
                  type="button"
                  class="experience__more"
                  :aria-expanded="expanded"
                  @click="expanded = !expanded"
                >
                  {{ expanded ? 'Ringkas' : `Lihat semua (${active.desc.length})` }}
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    aria-hidden="true"
                    :class="{ 'is-open': expanded }"
                  >
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </article>
          </Transition>

          <!-- Pindah ke peran sebelum/berikutnya tanpa balik ke daftar -->
          <nav class="experience__pager" aria-label="Navigasi pengalaman">
            <button
              type="button"
              class="experience__pager-btn"
              :disabled="activeIndex === 0"
              @click="select(activeIndex - 1)"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Lebih baru
            </button>
            <span class="experience__pager-count">
              {{ activeIndex + 1 }} / {{ experiences.length }}
            </span>
            <button
              type="button"
              class="experience__pager-btn"
              :disabled="activeIndex === experiences.length - 1"
              @click="select(activeIndex + 1)"
            >
              Lebih lama
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience {
  padding: var(--section-y) 0;
  background: var(--color-bg);
}

/* ---- Header ---- */
.experience__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem 3rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
}

.experience__lead {
  max-width: 36rem;
}

.experience__summary {
  flex-shrink: 0;
  display: flex;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  margin: 0;
  padding-left: clamp(1.5rem, 3vw, 2.5rem);
  border-left: 1px solid var(--color-border);
}

.experience__summary dt {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.experience__summary dd {
  margin: 0.3rem 0 0;
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--color-text);
}

.experience__summary dd span {
  color: var(--color-primary);
  margin: 0 0.1em;
}

.experience__summary .experience__summary-small {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  line-height: 1.6;
}

/* ---- Layout tab + panel ---- */
.experience__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.5fr);
  gap: clamp(1.25rem, 3vw, 2rem);
  align-items: start;
}

/* ---- Tab ---- */
.experience__tabs {
  position: relative;
  display: grid;
  gap: 0.5rem;
  position: sticky;
  top: 110px;
}

/* Kotak sorot yang meluncur mengikuti tab aktif */
.experience__indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--iw);
  height: var(--ih);
  transform: translate(var(--ix), var(--iy));
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--color-primary) 45%, transparent);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  pointer-events: none;
  transition:
    transform 0.45s cubic-bezier(0.32, 0.72, 0, 1),
    width 0.45s cubic-bezier(0.32, 0.72, 0, 1),
    height 0.45s cubic-bezier(0.32, 0.72, 0, 1);
}

/* Garis aksen di sisi kiri kotak sorot */
.experience__tab {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 0.85rem 1rem 1.05rem;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: transparent;
  font-family: var(--font-body);
  text-align: left;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.experience__tab:hover:not(.experience__tab--active) {
  border-color: var(--color-border);
  color: var(--color-text);
}

.experience__tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.experience__tab--active {
  color: var(--color-text);
}

.experience__tab-text {
  display: grid;
  min-width: 0;
}

.experience__tab-role {
  font-family: var(--font-heading);
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.experience__tab-company {
  margin-top: 0.1rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.experience__tab--active .experience__tab-company {
  color: var(--color-accent);
}

.experience__tab-year {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-soft);
  white-space: nowrap;
}

/* Bar durasi tipis di bawah tiap tab */
.experience__tenure {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0.45rem;
  height: 2px;
  border-radius: 2px;
  background: var(--color-border);
  overflow: hidden;
}

.experience__tenure-fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--color-text-soft);
  opacity: 0.45;
  transform: scaleX(var(--ratio));
  transform-origin: left;
  transition: background 0.3s ease, opacity 0.3s ease;
}

.experience__tab--active .experience__tenure-fill {
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  opacity: 1;
}

/* ---- Logo ---- */
.experience__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 64px;
  height: 48px;
  padding: 6px 7px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: #fff;
  box-sizing: border-box;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--color-primary);
}

.experience__logo--sm {
  width: 46px;
  height: 34px;
  padding: 4px 5px;
  border-radius: 9px;
}

.experience__logo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  -webkit-user-drag: none;
  user-select: none;
  pointer-events: none;
}

/* ---- Panel detail ---- */
.experience__panel {
  min-width: 0;
}

.experience__card {
  position: relative;
  padding: clamp(1.4rem, 3vw, 2rem);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background:
    radial-gradient(
        circle,
        color-mix(in srgb, var(--color-text-soft) 22%, transparent) 1px,
        transparent 1.3px
      )
      0 0 / 18px 18px,
    var(--color-surface);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* Pola titik hanya terlihat di pojok kanan atas */
.experience__card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(200deg, transparent 0%, var(--color-surface) 40%);
  pointer-events: none;
}

/* Garis aksen di atas kartu */
.experience__card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 1.75rem;
  right: 1.75rem;
  height: 2px;
  border-radius: 0 0 2px 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
}

.experience__card > * {
  position: relative;
}

/* Nomor besar transparan di pojok kartu */
.experience__card-num {
  position: absolute;
  top: 0.4rem;
  right: 1.2rem;
  font-family: var(--font-heading);
  font-size: clamp(3.5rem, 7vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--color-text);
  opacity: 0.06;
  pointer-events: none;
}

.experience__head {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 3rem;
}

.experience__head-text {
  min-width: 0;
}

.experience__type {
  display: inline-block;
  margin-bottom: 0.45rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.4;
  color: var(--color-primary);
}

.experience__role {
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0 0 0.25rem;
}

.experience__company {
  display: block;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-text-soft);
}

.experience__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-top: 1.2rem;
}

.experience__period {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  letter-spacing: 0.02em;
  color: var(--color-accent);
}

.experience__duration,
.experience__current {
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-text-soft);
}

.experience__current {
  border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

/* Titik berdenyut untuk pekerjaan yang masih berjalan */
.experience__now {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: experience-now 2s ease-out infinite;
}

@keyframes experience-now {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 60%, transparent);
  }
  100% {
    box-shadow: 0 0 0 7px transparent;
  }
}

/* Poin bernomor 01, 02, ... */
.experience__points {
  list-style: none;
  counter-reset: exp-point;
  display: grid;
  gap: 0.8rem;
  margin: 1.3rem 0 0;
  padding: 1.3rem 0 0;
  border-top: 1px dashed var(--color-border);
}

.experience__point {
  position: relative;
  padding-left: 2.1rem;
  counter-increment: exp-point;
  font-size: 0.94rem;
  line-height: 1.7;
  color: var(--color-text-soft);
  text-wrap: pretty;
  animation: exp-point-in 0.45s var(--ease-out) backwards;
  animation-delay: calc(var(--i) * 0.05s + 0.1s);
}

.experience__point::before {
  content: counter(exp-point, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0.15em;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-primary);
}

@keyframes exp-point-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.experience__card-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-top: 1.4rem;
}

.experience__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.experience__tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.experience__more {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.2rem;
  border: 0;
  background: none;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
}

.experience__more:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.experience__more svg {
  transition: transform 0.3s var(--ease-out);
}

.experience__more svg.is-open {
  transform: rotate(180deg);
}

/* Navigasi sebelum/berikutnya */
.experience__pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.9rem;
  padding: 0 0.25rem;
}

.experience__pager-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease, opacity 0.25s ease;
}

.experience__pager-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.experience__pager-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.experience__pager-count {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-soft);
}

/* Transisi ganti panel */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.25s ease, transform 0.35s var(--ease-out);
}

.panel-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .experience__now,
  .experience__point {
    animation: none;
  }

  .experience__indicator {
    transition: none;
  }
}

/* ---- Tablet & HP: tab jadi baris horizontal yang bisa digeser ---- */
@media (max-width: 960px) {
  .experience__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .experience__summary {
    padding: 1.4rem 0 0;
    border-left: 0;
    border-top: 1px solid var(--color-border);
    width: 100%;
  }

  .experience__layout {
    grid-template-columns: 1fr;
  }

  .experience__tabs {
    position: relative;
    top: auto;
    display: flex;
    gap: 0.5rem;
    margin: 0 calc(var(--gutter, 1.25rem) * -1);
    padding: 0.25rem var(--gutter, 1.25rem) 0.5rem;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .experience__tabs::-webkit-scrollbar {
    display: none;
  }

  .experience__tab {
    flex: 0 0 auto;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    gap: 0.2rem 0.65rem;
    width: auto;
    min-width: 9.5rem;
    padding: 0.7rem 0.9rem 0.95rem;
    border-color: var(--color-border);
    scroll-snap-align: center;
  }

  .experience__tab .experience__logo--sm {
    grid-row: 1 / 3;
  }

  .experience__tab-role {
    display: none;
  }

  .experience__tab-company {
    margin: 0;
    font-size: 0.72rem;
    color: var(--color-text);
  }

  .experience__tab-year {
    font-size: 0.66rem;
  }
}

@media (max-width: 480px) {
  .experience__summary {
    gap: 1.25rem;
  }

  .experience__head {
    align-items: flex-start;
    padding-right: 2rem;
  }

  .experience__logo {
    width: 56px;
    height: 42px;
  }

  .experience__point {
    font-size: 0.9rem;
    line-height: 1.65;
  }

  .experience__pager-btn {
    padding: 0.45rem 0.7rem;
    font-size: 0.76rem;
  }
}
</style>
