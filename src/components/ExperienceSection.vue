<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { vReveal } from '@/directives/reveal'

const experiences = [
  {
    period: 'Oktober 2026 — Sekarang',
    role: 'Back End Developer',
    company: 'Kontrak — PT Sistem Pelayanan Kesehatan dan Data (SPKD)',
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
    desc: [
      'Mengelola anggaran proyek dari estimasi biaya hingga pencatatan pengeluaran, termasuk penyusunan invoice, penawaran, dan kuitansi.',
      'Melakukan pemodelan sistem (Flowchart, ERD, UML) sebagai dasar pengembangan platform marketplace UMKM yang didanai Kemendikbudristek.',
    ],
    tags: ['ERD', 'UML', 'Flowchart'],
  },
  {
    period: 'Oktober 2022 — Mei 2023',
    role: 'Deputy Human Capital and Governance',
    company: 'Himpunan Mahasiswa Bisnis Digital',
    desc: [
      'Membantu proses rekrutmen dan seleksi pengurus.',
      'Menyusun target, jadwal, dan anggaran organisasi.',
      'Mempersiapkan rapat umum sebagai Komite Pengarah.',
    ],
    tags: ['Organisasi', 'Rekrutmen'],
  },
]

/* ---------------------------------------------------------
   Scroll-driven "connecting line" animation
   - Setiap garis punya elemen `fill` yang di-scaleY() dari 0 -> 1
     mengikuti posisi scroll (bukan cuma on/off, tapi bertahap).
   - Dot menyala (glow) begitu garis di atasnya mulai tersambung.
   - Warna dasar TIDAK diubah sama sekali, cuma ditambah box-shadow
     (efek "menyala") di warna yang sama.
--------------------------------------------------------- */

const lineFillRefs = ref([])
const dotRefs = ref([])

function setLineFillRef(el, index) {
  if (el) lineFillRefs.value[index] = el
}

function setDotRef(el, index) {
  if (el) dotRefs.value[index] = el
}

let ticking = false

function updateTimelineProgress() {
  // Titik acuan di viewport tempat garis mulai "tersambung".
  // Semakin kecil angka pengalinya, semakin cepat garis terisi
  // saat item mulai muncul dari bawah layar.
  const triggerY = window.innerHeight * 0.75

  lineFillRefs.value.forEach((fillEl) => {
    if (!fillEl) return
    const track = fillEl.parentElement
    const rect = track.getBoundingClientRect()
    if (rect.height <= 0) return

    // progress = 0 saat garis belum menyentuh triggerY,
    // progress = 1 saat seluruh tinggi garis sudah melewati triggerY.
    let progress = (triggerY - rect.top) / rect.height
    progress = Math.min(1, Math.max(0, progress))

    fillEl.style.transform = `scaleY(${progress})`
  })

  dotRefs.value.forEach((dotEl) => {
    if (!dotEl) return
    const rect = dotEl.getBoundingClientRect()
    const isActive = rect.top < triggerY
    dotEl.classList.toggle('is-active', isActive)
  })

  ticking = false
}

function onScroll() {
  if (ticking) return
  ticking = true
  window.requestAnimationFrame(updateTimelineProgress)
}

onMounted(async () => {
  await nextTick()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  updateTimelineProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

/* ---------------------------------------------------------
   Poin panjang dilipat: tampil 3 dulu, sisanya lewat tombol
   "Lihat semua" supaya kartu tidak jadi tembok teks.
--------------------------------------------------------- */
const PREVIEW_COUNT = 3
const expanded = ref({})

function toggleExpanded(index) {
  expanded.value = { ...expanded.value, [index]: !expanded.value[index] }
  // Tinggi kartu berubah, hitung ulang progress garis
  nextTick(onScroll)
}

function visiblePoints(item, index) {
  return expanded.value[index] ? item.desc : item.desc.slice(0, PREVIEW_COUNT)
}

// "Solo Project — JEC Eye ..." dipecah jadi badge tipe + nama tempat
function splitCompany(company) {
  const [first, ...rest] = company.split(' — ')
  return rest.length ? { type: first, name: rest.join(' — ') } : { type: '', name: first }
}
</script>

<template>
  <section id="pengalaman" class="experience">
    <div class="container experience__grid">
      <header class="experience__header">
        <div class="experience__header-sticky">
          <span v-reveal class="section-label">
            <span class="section-label__num">02</span> Pengalaman
          </span>
          <h2 v-reveal="80" class="section-title">
            Perjalanan singkat <span class="serif-accent">sejauh</span> ini
          </h2>
          <p v-reveal="160" class="section-lead">
            Beberapa peran yang pernah saya jalani, dari pekerjaan profesional,
            proyek mandiri, sampai organisasi, yang membentuk cara saya bekerja.
          </p>

          <dl v-reveal="240" class="experience__summary">
            <div>
              <dt>Peran</dt>
              <dd>{{ experiences.length }}</dd>
            </div>
            <div>
              <dt>Rentang</dt>
              <dd>2022<span>–</span>{{ new Date().getFullYear() }}</dd>
            </div>
          </dl>
        </div>
      </header>

      <ol class="experience__timeline">
        <li
          v-for="(item, index) in experiences"
          :key="item.role + item.period"
          class="experience__item"
        >
          <div class="experience__marker">
            <span
              class="experience__dot"
              :ref="(el) => setDotRef(el, index)"
            ></span>
            <span class="experience__line">
              <span
                class="experience__line-fill"
                :ref="(el) => setLineFillRef(el, index)"
              ></span>
            </span>
          </div>

          <article v-reveal.left="index * 60" class="experience__card">
            <div class="experience__card-top">
              <span class="experience__period">
                <span v-if="item.current" class="experience__now" aria-hidden="true"></span>
                {{ item.period }}
              </span>
              <span v-if="splitCompany(item.company).type" class="experience__type">
                {{ splitCompany(item.company).type }}
              </span>
            </div>

            <h3 class="experience__role">{{ item.role }}</h3>
            <span class="experience__company">{{ splitCompany(item.company).name }}</span>

            <ul :id="`exp-points-${index}`" class="experience__points">
              <li
                v-for="(point, pIndex) in visiblePoints(item, index)"
                :key="pIndex"
                class="experience__point"
              >
                {{ point }}
              </li>
            </ul>

            <div class="experience__card-bottom">
              <ul class="experience__tags">
                <li v-for="tag in item.tags" :key="tag" class="experience__tag">
                  {{ tag }}
                </li>
              </ul>

              <button
                v-if="item.desc.length > PREVIEW_COUNT"
                type="button"
                class="experience__more"
                :aria-expanded="!!expanded[index]"
                :aria-controls="`exp-points-${index}`"
                @click="toggleExpanded(index)"
              >
                {{ expanded[index] ? 'Ringkas' : `Lihat semua (${item.desc.length})` }}
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"
                  :class="{ 'is-open': expanded[index] }">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.experience {
  padding: var(--section-y) 0;
  background: var(--color-bg);
}

.experience__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.4fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}

/* Judul ikut "nempel" saat timeline di kanan discroll (desktop) */
.experience__header-sticky {
  position: sticky;
  top: 110px;
}

.experience__summary {
  display: flex;
  gap: 2.5rem;
  margin: 2.2rem 0 0;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
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

/* ---- Timeline ---- */
.experience__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.experience__item {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: clamp(0.9rem, 2.5vw, 1.6rem);
}

.experience__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Dot tetap warna aslinya. Saat aktif cuma ditambah glow (box-shadow) */
.experience__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 3px solid var(--color-mint);
  flex-shrink: 0;
  margin-top: 1.7rem;
  box-shadow: 0 0 0 0 rgba(124, 111, 240, 0);
  transition: box-shadow 0.4s ease;
}

.experience__dot.is-active {
  box-shadow:
    0 0 0 5px rgba(124, 111, 240, 0.18),
    0 0 14px 4px rgba(124, 111, 240, 0.55);
}

/* Track dasar nyaris tak terlihat, fill yang "menyambung" saat discroll */
.experience__line {
  position: relative;
  flex: 1;
  width: 2px;
  margin: 0.5rem 0 0;
  background: rgba(124, 111, 240, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

.experience__line-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(var(--color-primary), var(--color-accent));
  border-radius: 2px;
  transform: scaleY(0);
  transform-origin: top center;
  transition: transform 0.12s ease-out;
}

.experience__item:last-child .experience__line {
  display: none;
}

/* ---- Kartu ---- */
.experience__card {
  margin-bottom: 1.25rem;
  padding: clamp(1.3rem, 3vw, 1.9rem);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  transition: border-color 0.3s ease;
}

.experience__item:last-child .experience__card {
  margin-bottom: 0;
}

.experience__card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
}

.experience__card-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
}

.experience__period {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  color: var(--color-accent);
}

/* Titik hijau berdenyut untuk pekerjaan yang masih berjalan */
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

@media (prefers-reduced-motion: reduce) {
  .experience__now {
    animation: none;
  }
}

.experience__type {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  line-height: 1.4;
}

.experience__role {
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 2.2vw, 1.55rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0.8rem 0 0.3rem;
}

.experience__company {
  display: block;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-text-soft);
}

.experience__points {
  list-style: none;
  margin: 1.2rem 0 0;
  padding: 1.2rem 0 0;
  border-top: 1px dashed var(--color-border);
  display: grid;
  gap: 0.7rem;
}

.experience__point {
  position: relative;
  padding-left: 1.3rem;
  font-size: 0.94rem;
  line-height: 1.7;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.experience__point::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.68em;
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: var(--color-primary);
  transform: rotate(45deg);
  opacity: 0.8;
}

.experience__card-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-top: 1.3rem;
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
  padding: 0.3rem 0.65rem;
  border-radius: 8px;
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

/* ---- Tablet & HP ---- */
@media (max-width: 960px) {
  .experience__grid {
    grid-template-columns: 1fr;
  }

  .experience__header-sticky {
    position: static;
  }

  .experience__summary {
    margin-top: 1.6rem;
  }
}

@media (max-width: 480px) {
  .experience__item {
    grid-template-columns: 14px minmax(0, 1fr);
  }

  .experience__dot {
    width: 12px;
    height: 12px;
  }

  .experience__point {
    font-size: 0.9rem;
    line-height: 1.65;
  }
}
</style>
