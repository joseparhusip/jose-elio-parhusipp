<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { vReveal } from '@/directives/reveal'
import { vType } from '@/directives/type'
import { lang, t } from '@/composables/useLang'
import spkdLogo from './icons-experience/spkd.svg'
import jecLogo from './icons-experience/jec.svg'
import posLogo from './icons-experience/pos.svg'
import p2mwLogo from './icons-experience/p2mw.svg'
import himabigLogo from './icons-experience/himabig.svg'

const experiences = [
  {
    period: { id: 'Oktober 2026 — Sekarang', en: 'Oct 2026 – Present' },
    role: 'Back End Developer',
    company: {
      id: 'Freelance — PT Sistem Pelayanan Kesehatan dan Data (SPKD)',
      en: 'Freelance — PT Sistem Pelayanan Kesehatan dan Data (SPKD)',
    },
    short: 'SPKD',
    logo: spkdLogo,
    current: true,
    desc: {
      id: [
        'Mengerjakan backend MedCredix, platform multi-rumah sakit untuk menilai kesiapan kredensial RS secara otomatis dari data operasional RS.',
        'Membangun 44 endpoint REST API dengan Go (Gin) dan GORM di atas PostgreSQL, lengkap dengan dokumentasi Swagger.',
        'Mengimplementasikan login JWT dan hak akses per peran (RBAC), sampai pengaturan tombol mana yang boleh dipakai tiap peran.',
        'Membangun mesin skoring kesiapan RS (rincian skor dan snapshot bulanan) yang menjadi dasar dashboard eksekutif, daftar risiko, peringatan dini, dan rencana tindak lanjut.',
        'Membangun alur kredensial tenaga medis: unggah dokumen PDF/DOC, verifikasi atau penolakan dokumen, persetujuan kredensial, dan pengelolaan prasyarat.',
        'Mengintegrasikan data SIMRS melalui uji koneksi 24 resource FHIR, serta modul klaim (deteksi anomali), data klinis, dan kepatuhan regulasi.',
        'Menyediakan data referensi: direktori RS dari registri Kemenkes, data wilayah Indonesia, dan validasi kode faskes BPJS saat menambah RS mitra.',
        'Membangun audit trail, pencarian global, dan laporan yang bisa dicetak atau diekspor; menguji API dengan Postman dan database dengan DBeaver.',
      ],
      en: [
        'Develop the backend for MedCredix, a multi-hospital platform that automatically assesses hospital credentialing readiness from hospital operational data.',
        'Build 44 REST API endpoints with Go (Gin) and GORM on PostgreSQL, fully documented with Swagger.',
        'Implement JWT authentication and role-based access control (RBAC), down to which buttons each role is allowed to use.',
        'Build the hospital readiness scoring engine (score breakdowns and monthly snapshots) that powers the executive dashboard, risk register, early warnings, and follow-up action plans.',
        'Build the medical staff credentialing workflow: PDF/DOC document uploads, document verification or rejection, credential approval, and prerequisite management.',
        'Integrate SIMRS data through connection tests for 24 FHIR resources, along with modules for claims (anomaly detection), clinical data, and regulatory compliance.',
        'Provide reference data: a hospital directory from the Ministry of Health (Kemenkes) registry, Indonesian region data, and BPJS facility code validation when adding partner hospitals.',
        'Build audit trails, global search, and printable or exportable reports; test APIs with Postman and databases with DBeaver.',
      ],
    },
    tags: ['Go', 'Gin', 'GORM', 'PostgreSQL', 'JWT', 'FHIR', 'Swagger'],
  },
  {
    period: { id: 'Agustus 2025 — September 2025', en: 'Aug 2025 – Sep 2025' },
    role: 'Mobile Developer',
    company: {
      id: 'Solo Project — JEC Eye Hospitals & Clinics',
      en: 'Solo Project — JEC Eye Hospitals & Clinics',
    },
    short: 'JEC',
    logo: jecLogo,
    desc: {
      id: [
        'Mengumpulkan data melalui kuesioner ke pengguna baru non-JEC sebagai dasar analisis kebutuhan aplikasi.',
        'Merancang UI aplikasi di Figma serta mendokumentasikan arsitektur sistem melalui Use Case, Activity, Class Diagram, dan ERD.',
        'Membangun backend menggunakan Node.js & Express.js untuk mendukung komunikasi data antara aplikasi dan server.',
        'Mengimplementasikan sistem autentikasi (auth) dan fitur keamanan aplikasi untuk melindungi data pengguna.',
        'Merancang database relasional menggunakan SQL dengan metode pengembangan sistem Waterfall yang diintegrasikan pendekatan User-Centered Design (UCD).',
        'Mengimplementasikan UI ke aplikasi Android menggunakan Flutter & Dart, termasuk fitur OCR.',
        'Melakukan Black Box Testing untuk memastikan fungsi aplikasi berjalan sesuai kebutuhan, serta evaluasi usability menggunakan System Usability Scale (SUS) melibatkan 120 responden pengguna baru, memperoleh skor rata-rata 79 (kategori Acceptable/Good).',
      ],
      en: [
        'Collected data through questionnaires sent to new non-JEC users as the basis for the app requirements analysis.',
        'Designed the app UI in Figma and documented the system architecture with Use Case, Activity, and Class Diagrams, and an ERD.',
        'Built the backend with Node.js & Express.js to support data communication between the app and the server.',
        'Implemented the authentication (auth) system and app security features to protect user data.',
        'Designed a relational SQL database using the Waterfall development method combined with a User-Centered Design (UCD) approach.',
        'Implemented the UI in an Android app using Flutter & Dart, including an OCR feature.',
        'Performed Black Box Testing to ensure the app functioned as required, and evaluated usability with the System Usability Scale (SUS) across 120 new-user respondents, achieving an average score of 79 (Acceptable/Good category).',
      ],
    },
    tags: ['Flutter', 'Dart', 'Figma'],
  },
  {
    period: { id: 'Juli 2024 — September 2024', en: 'Jul 2024 – Sep 2024' },
    role: 'Back End Developer',
    company: {
      id: 'Group Project — Kantor Pusat PT Pos Indonesia',
      en: 'Group Project — PT Pos Indonesia Head Office',
    },
    short: 'POS',
    logo: posLogo,
    desc: {
      id: [
        'Mengembangkan backend web application IHSAN POS untuk mendukung pengelolaan data tenaga kerja profesional PT Pos Indonesia, dari perancangan arsitektur sistem hingga implementasi API.',
        'Merancang ERD dan membangun database menggunakan PostgreSQL yang aman dan terstruktur, termasuk konfigurasi environment untuk keamanan dan fleksibilitas sistem.',
        'Menguji dan memvalidasi seluruh endpoint API menggunakan Postman untuk memastikan proses request/response dan integrasi backend-frontend berjalan sesuai kebutuhan.',
        'Berkoordinasi dengan tim pengembang, serta menyelesaikan pengembangan tepat waktu sesuai standar keamanan dan skalabilitas; hasil proyek dipublikasikan di Jurnal JUISI (Sinta 5).',
      ],
      en: [
        'Developed the backend of the IHSAN POS web application to support management of PT Pos Indonesia\'s professional workforce data, from system architecture design to API implementation.',
        'Designed the ERD and built a secure, well-structured PostgreSQL database, including environment configuration for system security and flexibility.',
        'Tested and validated all API endpoints with Postman to ensure request/response handling and backend-frontend integration met requirements.',
        'Coordinated with the development team and delivered on schedule in line with security and scalability standards; the project was published in the JUISI journal (Sinta 5).',
      ],
    },
    tags: ['Backend', 'REST API', 'Database'],
  },
  {
    period: { id: 'Mei 2023 — April 2024', en: 'May 2023 – Apr 2024' },
    role: 'System Analyst',
    company: {
      id: 'Program Pembinaan Mahasiswa Wirausaha — Kampus Merdeka',
      en: 'Student Entrepreneurship Development Program — Kampus Merdeka',
    },
    short: 'KM',
    logo: p2mwLogo,
    desc: {
      id: [
        'Mengelola anggaran proyek dari estimasi biaya hingga pencatatan pengeluaran, termasuk penyusunan invoice, penawaran, dan kuitansi.',
        'Melakukan pemodelan sistem (Flowchart, ERD, UML) sebagai dasar pengembangan platform marketplace UMKM yang didanai Kemendikbudristek.',
      ],
      en: [
        'Managed the project budget from cost estimation to expense tracking, including preparing invoices, quotations, and receipts.',
        'Performed system modeling (Flowchart, ERD, UML) as the foundation for an MSME marketplace platform funded by the Indonesian Ministry of Education (Kemendikbudristek).',
      ],
    },
    tags: ['ERD', 'UML', 'Flowchart'],
  },
  {
    period: { id: 'Oktober 2022 — Mei 2023', en: 'Oct 2022 – May 2023' },
    role: 'Deputy Human Capital and Governance',
    company: {
      id: 'Himpunan Mahasiswa Bisnis Digital (HIMABIG)',
      en: 'Digital Business Student Association (HIMABIG)',
    },
    short: 'HIMABIG',
    logo: himabigLogo,
    // Logo HIMABIG aslinya di atas latar navy (tulisannya putih)
    logoBg: '#152348',
    desc: {
      id: [
        'Membantu proses rekrutmen dan seleksi pengurus.',
        'Menyusun target, jadwal, dan anggaran organisasi.',
        'Mempersiapkan rapat umum sebagai Komite Pengarah.',
      ],
      en: [
        'Assisted in recruiting and selecting board members.',
        'Prepared organizational targets, schedules, and budgets.',
        'Prepared the general assembly as a member of the Steering Committee.',
      ],
    },
    tags: [
      { id: 'Organisasi', en: 'Organization' },
      { id: 'Rekrutmen', en: 'Recruitment' },
    ],
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
  const [startText, endText = ''] = period.id.split('—')
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
  const en = lang.value === 'en'
  const yearText = en ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : `${years} thn`
  const monthText = en ? `${months} ${months === 1 ? 'mo' : 'mos'}` : `${months} bln`
  return [years && yearText, months && monthText].filter(Boolean).join(' ')
}

function duration(period) {
  return formatMonths(monthsOf(period))
}

// Tahun mulai–selesai singkat untuk tab, mis. "2024" atau "2023–2024"
function yearRange(period) {
  const [startText, endText = ''] = period.id.split('—')
  const startYear = startText.trim().split(/\s+/).pop()
  const endYear = /sekarang/i.test(endText) ? t({ id: 'Kini', en: 'Now' }) : endText.trim().split(/\s+/).pop()
  return startYear === endYear ? startYear : `${startYear}–${endYear}`
}

// "Solo Project — JEC Eye ..." dipecah jadi badge tipe + nama tempat
function splitCompany(company) {
  const [first, ...rest] = company.split(' — ')
  return rest.length ? { type: first, name: rest.join(' — ') } : { type: '', name: first }
}

const totalMonths = experiences.reduce((sum, e) => sum + monthsOf(e.period), 0)
const firstYear = Math.min(...experiences.map((e) => Number(e.period.id.split('—')[0].trim().split(/\s+/).pop())))

/* ---------------------------------------------------------
   Tab: pilih satu peran, detailnya tampil di panel kanan
--------------------------------------------------------- */
const activeIndex = ref(0)
const active = computed(() => experiences[activeIndex.value])
const activeCompany = computed(() => splitCompany(t(active.value.company)))

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

// Tepi kanan baris tab memudar sebagai tanda masih bisa digeser, kecuali sudah di ujung
const tabsAtEnd = ref(false)

function onTabsScroll() {
  const list = tablistEl.value
  tabsAtEnd.value = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4
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
const visiblePoints = computed(() => {
  const points = t(active.value.desc)
  return expanded.value ? points : points.slice(0, PREVIEW_COUNT)
})

watch(activeIndex, () => {
  expanded.value = false
  nextTick(scrollActiveTabIntoView)
})

const logoStyle = (item) =>
  item.logoBg ? { background: item.logoBg, borderColor: 'transparent' } : null
</script>

<template>
  <section id="pengalaman" class="experience">
    <div class="container">
      <header class="section-head">
        <div class="section-head__meta">
          <span v-reveal class="section-label">
            <span class="section-label__num">02</span> {{ t({ id: 'Pengalaman', en: 'Experience' }) }}
          </span>

          <dl v-reveal.stagger="{ delay: 200, step: 90 }" class="experience__summary">
            <div>
              <dt>{{ t({ id: 'Peran', en: 'Roles' }) }}</dt>
              <dd>{{ String(experiences.length).padStart(2, '0') }}</dd>
            </div>
            <div>
              <dt>{{ t({ id: 'Rentang', en: 'Span' }) }}</dt>
              <dd>{{ firstYear }}–{{ new Date().getFullYear() }}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{{ formatMonths(totalMonths) }}</dd>
            </div>
          </dl>
        </div>

        <div class="section-head__main">
          <h2 :key="lang" v-type="'pengalaman'" class="section-title">
            <template v-if="lang === 'en'">
              A brief journey <span class="serif-accent">so far</span>
            </template>
            <template v-else>
              Perjalanan singkat <span class="serif-accent">sejauh</span> ini
            </template>
          </h2>
          <p v-reveal="160" class="section-lead">
            <template v-if="lang === 'en'">
              A selection of roles I have held, from professional work and independent projects
              to student organizations, that have shaped the way I work.
            </template>
            <template v-else>
              Beberapa peran yang pernah saya jalani, dari pekerjaan profesional, proyek mandiri,
              sampai organisasi, yang membentuk cara saya bekerja.
            </template>
          </p>
        </div>
      </header>

      <div class="experience__layout">
        <!-- Daftar peran (tab), disusun seperti buku besar -->
        <div v-reveal.left="120" class="experience__ledger">
          <div class="experience__ledger-head mono-meta" aria-hidden="true">
            <span>No.</span>
            <span>{{ t({ id: 'Peran', en: 'Role' }) }}</span>
            <span>{{ t({ id: 'Tahun', en: 'Year' }) }}</span>
          </div>

          <div
            ref="tablistEl"
            class="experience__tabs"
            :class="{ 'is-end': tabsAtEnd }"
            role="tablist"
            :aria-label="t({ id: 'Daftar pengalaman', en: 'Experience list' })"
            aria-orientation="vertical"
            @keydown="onTabKeydown"
            @scroll.passive="onTabsScroll"
          >
            <button
              v-for="(item, index) in experiences"
              :id="`exp-tab-${index}`"
              :key="item.role + item.period.id"
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
              <span class="experience__tab-num" aria-hidden="true">
                {{ String(index + 1).padStart(2, '0') }}
              </span>

              <span class="experience__tab-text">
                <span class="experience__tab-role">{{ item.role }}</span>
                <span class="experience__tab-company">{{ item.short }}</span>
              </span>

              <span class="experience__tab-year">
                <span v-if="item.current" class="experience__now" aria-hidden="true"></span>
                {{ yearRange(item.period) }}
              </span>
            </button>
          </div>
        </div>

        <!-- Detail peran aktif: lembar dokumen -->
        <div
          id="exp-panel"
          v-reveal.right="240"
          class="experience__panel"
          role="tabpanel"
          :aria-labelledby="`exp-tab-${activeIndex}`"
        >
          <Transition name="panel" mode="out-in">
            <article :key="active.role + active.period.id" class="experience__card">
              <div class="experience__card-top">
                <span class="experience__card-num" aria-hidden="true">
                  <span>No.</span>{{ String(activeIndex + 1).padStart(2, '0') }}
                </span>

                <span
                  class="experience__logo"
                  :style="logoStyle(active)"
                  @contextmenu.prevent
                >
                  <img
                    v-if="active.logo"
                    :src="active.logo"
                    :alt="t({ id: `Logo ${active.short}`, en: `${active.short} logo` })"
                    width="52"
                    height="36"
                    draggable="false"
                  />
                  <span v-else aria-hidden="true">{{ active.short }}</span>
                </span>
              </div>

              <div class="experience__head">
                <span v-if="activeCompany.type" class="experience__type mono-meta">
                  {{ activeCompany.type }}
                </span>
                <h3 class="experience__role">{{ active.role }}</h3>
                <span class="experience__company">{{ activeCompany.name }}</span>
              </div>

              <div class="experience__meta">
                <span class="experience__period">
                  <span v-if="active.current" class="experience__now" aria-hidden="true"></span>
                  {{ t(active.period) }}
                </span>
                <span v-if="duration(active.period)" class="experience__duration">
                  {{ duration(active.period) }}
                </span>
                <span v-if="active.current" class="experience__current">{{ t({ id: 'Sedang berjalan', en: 'Ongoing' }) }}</span>
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
                <ul class="experience__tags" :aria-label="t({ id: 'Teknologi', en: 'Technologies' })">
                  <li v-for="tag in active.tags" :key="t(tag)" class="experience__tag">{{ t(tag) }}</li>
                </ul>

                <button
                  v-if="active.desc.id.length > PREVIEW_COUNT"
                  type="button"
                  class="experience__more"
                  :aria-expanded="expanded"
                  @click="expanded = !expanded"
                >
                  {{
                    expanded
                      ? t({ id: 'Ringkas', en: 'Show less' })
                      : t({ id: `Lihat semua (${active.desc.id.length})`, en: `Show all (${active.desc.en.length})` })
                  }}
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
          <nav class="experience__pager" :aria-label="t({ id: 'Navigasi pengalaman', en: 'Experience navigation' })">
            <button
              type="button"
              class="btn btn--ghost experience__pager-btn"
              :disabled="activeIndex === 0"
              @click="select(activeIndex - 1)"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ t({ id: 'Lebih baru', en: 'Newer' }) }}
            </button>
            <span class="experience__pager-count">
              {{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(experiences.length).padStart(2, '0') }}
            </span>
            <button
              type="button"
              class="btn btn--ghost experience__pager-btn"
              :disabled="activeIndex === experiences.length - 1"
              @click="select(activeIndex + 1)"
            >
              {{ t({ id: 'Lebih lama', en: 'Older' }) }}
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

/* ---- Ringkasan: baris stat bergaris ---- */
.experience__summary {
  margin: 0.6rem 0 0;
  max-width: 15rem;
  border-top: 1px solid var(--color-rule);
}

.experience__summary > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--color-border);
}

.experience__summary dt,
.experience__summary dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.experience__summary dt {
  color: var(--color-text-soft);
}

.experience__summary dd {
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

/* ---- Layout buku besar + lembar ---- */
.experience__layout {
  display: grid;
  grid-template-columns: minmax(0, 4.2fr) minmax(0, 7.8fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}

.experience__ledger {
  position: sticky;
  top: 110px;
}

.experience__ledger-head {
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr) auto;
  gap: 0.75rem;
  padding: 0 0 0.6rem 0.9rem;
  border-bottom: 1px solid var(--color-rule);
  font-size: 0.66rem;
}

/* ---- Tab: baris buku besar ---- */
.experience__tabs {
  display: grid;
}

.experience__tab {
  position: relative;
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 0.25rem 1.05rem 0.9rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-family: var(--font-body);
  text-align: left;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: color 0.25s ease, background-color 0.25s ease;
}

/* Penanda baris aktif: garis warna teks di kiri */
.experience__tab::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.85rem;
  bottom: 0.85rem;
  width: 2px;
  background: var(--color-text);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.35s var(--ease-out);
}

.experience__tab:hover:not(.experience__tab--active) {
  color: var(--color-text);
  background: var(--color-surface);
}

.experience__tab:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.experience__tab--active {
  color: var(--color-text);
}

.experience__tab--active::before {
  transform: scaleY(1);
}

.experience__tab-num {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
}

.experience__tab--active .experience__tab-num {
  color: var(--color-text);
}

.experience__tab-text {
  display: grid;
  min-width: 0;
}

.experience__tab-role {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.3;
  text-wrap: balance;
}

.experience__tab-company {
  margin-top: 0.2rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.experience__tab-year {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-soft);
  white-space: nowrap;
}

/* ---- Logo ---- */
/* Pelat putih: logo instansi dibuat untuk latar putih */
.experience__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 64px;
  height: 46px;
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: white;
  box-sizing: border-box;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--color-text);
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

/* ---- Panel: lembar dokumen ---- */
.experience__panel {
  min-width: 0;
}

.experience__card {
  padding: clamp(1.4rem, 3vw, 2.25rem);
  border-radius: var(--radius);
  border: 1px solid var(--color-rule);
  background: var(--color-surface);
}

.experience__card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.1rem;
  border-bottom: 1px solid var(--color-border);
}

.experience__card-num {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(3rem, 6vw, 4.25rem);
  line-height: 0.85;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.experience__card-num span {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.experience__head {
  margin-top: 1.4rem;
}

.experience__type {
  display: block;
  margin-bottom: 0.55rem;
  font-size: 0.66rem;
}

.experience__role {
  font-family: var(--font-heading);
  font-size: clamp(1.45rem, 2.6vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.1;
  color: var(--color-text);
  margin: 0 0 0.4rem;
}

.experience__company {
  display: block;
  font-size: 0.95rem;
  color: var(--color-text-soft);
}

/* Baris meta mono: periode · durasi · status */
.experience__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0;
  margin-top: 1.1rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.experience__meta > span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.experience__meta > span + span::before {
  content: '·';
  margin: 0 0.6rem;
  color: var(--color-text-soft);
}

.experience__period {
  color: var(--color-text);
}

.experience__current {
  color: var(--color-accent);
}

/* Titik berdenyut untuk pekerjaan yang masih berjalan. Denyutnya lingkaran
   terpisah yang membesar & memudar (transform + opacity: ringan untuk GPU). */
.experience__now {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.experience__now::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.6;
  animation: experience-now 2s ease-out infinite;
}

@keyframes experience-now {
  to {
    transform: scale(3);
    opacity: 0;
  }
}

/* Poin bernomor, dipisah garis tipis */
.experience__points {
  list-style: none;
  counter-reset: exp-point;
  margin: 1.5rem 0 0;
  padding: 0;
  border-top: 1px solid var(--color-rule);
}

.experience__point {
  position: relative;
  padding: 0.85rem 0 0.85rem 2.6rem;
  border-bottom: 1px solid var(--color-border);
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
  top: 1.1rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-soft);
}

@keyframes exp-point-in {
  from {
    opacity: 0;
    transform: translateY(6px);
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
  gap: 0.9rem;
  margin-top: 1.4rem;
}

.experience__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.experience__tag {
  padding: 0.28rem 0.6rem;
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
}

.experience__more {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0;
  border: 0;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text);
  cursor: pointer;
}

.experience__more:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
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
  margin-top: 1rem;
}

.experience__pager-btn {
  gap: 0.4rem;
  min-height: 40px;
  padding: 0 0.9rem;
  font-size: 0.82rem;
}

.experience__pager-btn:disabled {
  opacity: 0.35;
  pointer-events: none;
}

.experience__pager-count {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
}

/* Transisi ganti panel */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.25s ease, transform 0.35s var(--ease-out);
}

.panel-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .experience__now::after,
  .experience__point {
    animation: none;
  }

  .experience__tab::before {
    transition: none;
  }
}

/* ---- Tablet & HP: buku besar jadi baris horizontal yang bisa digeser ---- */
@media (max-width: 760px) {
  .experience__summary {
    max-width: none;
  }
}

@media (max-width: 960px) {
  .experience__layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .experience__ledger {
    position: relative;
    top: auto;
    min-width: 0;
  }

  .experience__ledger-head {
    display: none;
  }

  .experience__tabs {
    display: flex;
    margin: 0 calc(var(--gutter, 1.25rem) * -1);
    padding: 0 var(--gutter, 1.25rem);
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    border-top: 1px solid var(--color-rule);
    border-bottom: 1px solid var(--color-rule);
  }

  .experience__tabs::-webkit-scrollbar {
    display: none;
  }

  .experience__tabs:not(.is-end) {
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 3.5rem), transparent);
    mask-image: linear-gradient(to right, #000 calc(100% - 3.5rem), transparent);
  }

  .experience__tab {
    flex: 0 0 auto;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    gap: 0.3rem 1rem;
    width: auto;
    min-width: 8.5rem;
    padding: 0.85rem 1rem 0.95rem;
    border-right: 1px solid var(--color-border);
    scroll-snap-align: start;
  }

  .experience__tab:first-child {
    border-left: 1px solid var(--color-border);
  }

  .experience__tab::before {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: 2px;
    transform: scaleX(0);
    transform-origin: left;
    z-index: 1;
  }

  .experience__tab--active::before {
    transform: scaleX(1);
  }

  .experience__tab-text {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .experience__tab-role {
    display: none;
  }

  .experience__tab-company {
    margin: 0;
    font-size: 0.74rem;
    color: inherit;
  }

  .experience__tab-num {
    grid-column: 1;
    grid-row: 1;
  }

  .experience__tab-year {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
    font-size: 0.64rem;
  }
}

@media (max-width: 480px) {
  /* Status turun ke baris sendiri, tanpa titik pemisah di awal baris */
  .experience__current {
    flex-basis: 100%;
    margin-top: 0.25rem;
  }

  .experience__meta > .experience__current::before {
    display: none;
  }

  .experience__logo {
    width: 56px;
    height: 40px;
  }

  .experience__point {
    padding-left: 2.2rem;
    font-size: 0.9rem;
    line-height: 1.65;
  }

  .experience__meta > span + span::before {
    margin: 0 0.45rem;
  }

  .experience__pager-btn {
    padding: 0 0.7rem;
    font-size: 0.76rem;
  }
}
</style>

