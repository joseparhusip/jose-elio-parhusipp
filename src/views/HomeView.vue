<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { loaderDone } from '@/composables/useLoaderState'
import { vReveal } from '@/directives/reveal'
import AboutSection from '@/components/AboutSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import CertificatesSection from '@/components/CertificatesSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import linkedinIcon from '@/components/icons/icons-about/linkedin-svgrepo-com.svg'
import instagramIcon from '@/components/icons/icons-about/instagram-2016-logo-svgrepo-com.svg'

const edition = new Date().getFullYear()

const stats = [
  { value: '4+', label: 'Tahun belajar teknologi' },
  { value: '8', label: 'Proyek dibangun' },
  { value: '5', label: 'Peran kerja & organisasi' },
]

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------------------------------------------------------
   Teks peran yang diketik bergantian.
   Tetap jalan walau "kurangi animasi" aktif di OS: yang berubah
   hanya teksnya, tidak ada elemen yang bergerak. Kursor berkedip
   tetap dimatikan untuk mode itu (lihat CSS).
--------------------------------------------------------- */
const roles = ['Full Stack Developer', 'Flutter Developer', 'Data Analyst', 'Business Analyst']
const typedRole = ref('')
const roleFull = ref(roles[0]) // peran yang sedang diketik
const roleNo = ref(1) // nomor peran yang tampil (01 / 04)

// Huruf yang sudah diketik dibagi dua: bagian sebelum kata terakhir
// (warna teks) dan kata terakhir (biru)
const typedSplit = computed(() => {
  const full = roleFull.value
  const cut = full.lastIndexOf(' ') + 1
  const typed = typedRole.value
  return { head: typed.slice(0, cut), tail: typed.slice(cut) }
})

let roleIndex = 0
let charIndex = 0
let isDeleting = false
let timeoutId = null

const TYPING_SPEED = 90
const DELETING_SPEED = 45
const PAUSE_AFTER_TYPED = 1600
const PAUSE_AFTER_DELETED = 350

function tick() {
  const currentRole = roles[roleIndex]

  if (isDeleting) {
    charIndex -= 1
  } else {
    charIndex += 1
  }

  typedRole.value = currentRole.slice(0, charIndex)

  let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true
    delay = PAUSE_AFTER_TYPED
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    roleIndex = (roleIndex + 1) % roles.length
    roleFull.value = roles[roleIndex]
    roleNo.value = roleIndex + 1
    delay = PAUSE_AFTER_DELETED
  }

  timeoutId = setTimeout(tick, delay)
}

onMounted(() => {
  timeoutId = setTimeout(tick, TYPING_SPEED)
})

onUnmounted(() => {
  clearTimeout(timeoutId)
})

/* ---------------------------------------------------------
   Unduh CV
--------------------------------------------------------- */
const CV_PATH = '/CV - Jose Elio Parhusip.pdf'
const CV_FILENAME = 'CV - Jose Elio Parhusip.pdf'
const downloadState = ref('idle')
let resetTimeoutId = null

const downloadLabel = computed(() => {
  if (downloadState.value === 'loading') return 'Menyiapkan berkas...'
  if (downloadState.value === 'done') return 'Terunduh!'
  return 'Unduh CV'
})

async function handleDownloadCV(event) {
  event.preventDefault()

  if (downloadState.value !== 'idle') return

  downloadState.value = 'loading'

  const minDelay = new Promise((resolve) => setTimeout(resolve, 850))

  try {
    const [response] = await Promise.all([fetch(CV_PATH), minDelay])
    if (!response.ok) throw new Error('Gagal mengambil berkas')

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const tempLink = document.createElement('a')
    tempLink.href = blobUrl
    tempLink.download = CV_FILENAME
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    URL.revokeObjectURL(blobUrl)

    downloadState.value = 'done'
  } catch {
    window.open(CV_PATH, '_blank')
    downloadState.value = 'idle'
    return
  }

  resetTimeoutId = setTimeout(() => {
    downloadState.value = 'idle'
  }, 2400)
}

onUnmounted(() => {
  clearTimeout(resetTimeoutId)
})

function preventImageAction(event) {
  event.preventDefault()
  return false
}

/* ---------------------------------------------------------
   Angka statistik naik dari 0 saat terlihat di layar.
   Format desimal pakai koma (mis. 2,5) dan akhiran (+) dipertahankan.
--------------------------------------------------------- */
function parseStat(value) {
  const [int, dec = ''] = value.replace(/[^\d,]/g, '').split(',')
  return {
    target: Number(`${int}.${dec || 0}`),
    decimals: dec.length,
    suffix: value.replace(/[\d,]/g, ''),
  }
}

const parsedStats = stats.map((item) => parseStat(item.value))
const statDisplay = ref(stats.map((item, i) => (prefersReducedMotion ? item.value : formatStat(0, parsedStats[i]))))
const statsEl = ref(null)
const statsVisible = ref(false)
let statsObserver = null
let countFrame = 0

function formatStat(num, { decimals, suffix }) {
  return num.toFixed(decimals).replace('.', ',') + suffix
}

function runCountUp() {
  const DURATION = 1400
  const start = performance.now()

  const step = (now) => {
    const t = Math.min(1, (now - start) / DURATION)
    const eased = 1 - Math.pow(1 - t, 3)
    statDisplay.value = parsedStats.map((p) => formatStat(p.target * eased, p))
    if (t < 1) countFrame = requestAnimationFrame(step)
  }

  countFrame = requestAnimationFrame(step)
}

// Mulai hitung kalau statistik sudah terlihat DAN loader sudah selesai
watch(
  () => statsVisible.value && loaderDone.value,
  (ready) => {
    if (ready && !prefersReducedMotion) runCountUp()
  },
)

onMounted(() => {
  if (prefersReducedMotion || !statsEl.value) return
  statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        statsVisible.value = true
        statsObserver.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  statsObserver.observe(statsEl.value)
})

onUnmounted(() => {
  statsObserver?.disconnect()
  cancelAnimationFrame(countFrame)
})
</script>

<template>
  <main>
    <section id="beranda" class="hero">

      <div class="container">
        <!-- Strip metadata ala sampul jurnal -->
        <div class="hero__strip mono-meta" v-reveal.down>
          <span>Portofolio · Edisi {{ edition }}</span>
          <span class="hero__strip-status">
            <span class="hero__status-dot" aria-hidden="true"></span>
            Terbuka untuk kerja
          </span>
        </div>

        <!-- Tanpa foto: nama besar selebar halaman, lalu dua kolom di bawah garis -->
        <div class="hero__inner">
            <!-- Nama tersibak per baris, baris kedua menyusul -->
            <h1 class="hero__title">
              <span v-reveal.clip="90" class="hero__title-line">Jose Elio</span>
              <span v-reveal.clip="190" class="hero__title-line hero__title-line--accent"
                >Parhusip<span class="hero__title-dot">.</span></span
              >
            </h1>

            <div class="hero__bottom">
              <div class="hero__intro">
                <p class="hero__role" v-reveal="300">
                  <!-- Baris label: "Saya seorang" + nomor peran yang sedang tampil -->
                  <span class="hero__role-head" aria-hidden="true">
                    <span class="hero__role-prefix">Saya seorang</span>
                    <span class="hero__role-count">
                      {{ String(roleNo).padStart(2, '0') }} / {{ String(roles.length).padStart(2, '0') }}
                    </span>
                  </span>
                  <!-- Pembaca layar membaca daftar peran lengkap, bukan huruf yang sedang diketik -->
                  <span class="hero__sr">Saya seorang {{ roles.join(', ') }}</span>
                  <!-- Dua warna: kata depan warna teks, kata terakhir biru
                       (mis. "Full Stack" + "Developer") -->
                  <span class="hero__role-word" aria-hidden="true">
                    <span class="hero__role-typed">{{ typedSplit.head }}</span
                    ><span class="hero__role-typed hero__role-typed--accent">{{ typedSplit.tail }}</span
                    ><span class="hero__cursor"></span>
                  </span>
                </p>
                <p class="hero__lead" v-reveal="380">
                  Mengubah data, desain, dan kode jadi produk yang benar-benar dipakai.
                </p>
              </div>

              <div class="hero__cta">
                <div class="hero__actions" v-reveal.stagger="{ delay: 460, step: 90 }">
                  <a href="#proyek" class="btn btn--primary hero__btn">
                    Lihat Proyek
                    <svg viewBox="0 0 24 24" class="hero__btn-arrow" aria-hidden="true">
                      <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </a>
                  <a
                    href="/CV - Jose Elio Parhusip.pdf"
                    class="btn btn--ghost hero__btn hero__btn--download"
                    :class="{ 'is-loading': downloadState === 'loading', 'is-done': downloadState === 'done' }"
                    :aria-disabled="downloadState !== 'idle'"
                    download="CV - Jose Elio Parhusip.pdf"
                    @click="handleDownloadCV"
                  >
                    <span class="hero__btn-fill" aria-hidden="true"></span>

                    <span class="hero__btn-icon" aria-hidden="true">
                      <svg v-if="downloadState !== 'done'" viewBox="0 0 24 24" class="hero__btn-icon-svg hero__btn-icon-svg--arrow">
                        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3.5v11m0 0-3.5-3.5M12 14.5 15.5 11" />
                        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 18.5h14" />
                      </svg>
                      <svg v-else viewBox="0 0 24 24" class="hero__btn-icon-svg hero__btn-icon-svg--check">
                        <path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5 10 17.5 19 7" />
                      </svg>
                    </span>

                    <span class="hero__btn-label" aria-live="polite">{{ downloadLabel }}</span>
                  </a>
                </div>

                <div class="hero__meta" v-reveal="620">
                  <div class="hero__socials">
                    <a
                      href="https://github.com/joseparhusip"
                      class="hero__social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      title="GitHub"
                      @contextmenu.prevent="preventImageAction"
                    >
                      <svg viewBox="0 0 24 24" class="hero__social-icon" aria-hidden="true">
                        <path fill="currentColor" d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.78 10.77.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.16a10.9 10.9 0 0 1 5.74 0c2.19-1.47 3.15-1.16 3.15-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1 0 1.51-.01 2.73-.01 3.1 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
                      </svg>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/joseparhusip/"
                      class="hero__social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                      @contextmenu.prevent="preventImageAction"
                    >
                      <img
                        :src="linkedinIcon"
                        alt="LinkedIn"
                        class="hero__social-img"
                        draggable="false"
                        @contextmenu.prevent="preventImageAction"
                        @dragstart.prevent="preventImageAction"
                      />
                    </a>

                    <a
                      href="https://www.instagram.com/joseparhusip_/"
                      class="hero__social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      title="Instagram"
                      @contextmenu.prevent="preventImageAction"
                    >
                      <img
                        :src="instagramIcon"
                        alt="Instagram"
                        class="hero__social-img"
                        draggable="false"
                        @contextmenu.prevent="preventImageAction"
                        @dragstart.prevent="preventImageAction"
                      />
                    </a>
                  </div>

                </div>
              </div>
            </div>
        </div>

        <dl ref="statsEl" class="hero__stats" v-reveal.stagger="{ delay: 200, step: 110 }">
          <div v-for="(item, index) in stats" :key="item.label" class="hero__stat">
            <dt class="hero__stat-label mono-meta">
              <span class="hero__stat-num">0{{ index + 1 }}</span>
              {{ item.label }}
            </dt>
            <dd class="hero__stat-value">
              <span aria-hidden="true">{{ statDisplay[index] }}</span>
              <span class="hero__sr">{{ item.value }}</span>
            </dd>
          </div>
          <a href="#tentang" class="hero__scroll mono-meta">
            <span>Gulir</span>
            <span class="hero__scroll-line" aria-hidden="true"></span>
          </a>
        </dl>
      </div>
    </section>

    <AboutSection />
    <ExperienceSection />
    <ProjectsSection />
    <CertificatesSection />
    <ContactSection />
  </main>
</template>

<style scoped>
/* =========================================================
   HERO — gaya "Field Notes": sampul jurnal dengan garis tipis.
   Tanpa foto: nama sangat besar selebar halaman ("Parhusip." rata
   kanan), lalu peran + tagline di kiri dan tombol + sosial di kanan.
   ========================================================= */
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(1.25rem, 3vw, 2rem) 0 clamp(2.5rem, 5vw, 3.5rem);
}

/* Teks khusus pembaca layar */
.hero__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* ---- Strip metadata di atas ---- */
.hero__strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding: 0.85rem 0;
  border-top: 1px solid var(--color-rule);
  border-bottom: 1px solid var(--color-rule);
}

.hero__strip-status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--color-text);
}

.hero__status-dot {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
}

.hero__status-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  animation: hero-ping 2.4s var(--ease-out) infinite;
}

@keyframes hero-ping {
  from { transform: scale(0.6); opacity: 0.9; }
  to { transform: scale(1.8); opacity: 0; }
}

/* ---- Isi utama: nama selebar halaman, lalu dua kolom di bawah garis ---- */
.hero__inner {
  padding-top: clamp(2.5rem, 6vw, 4.5rem);
}

.hero__bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: end;
  margin-top: clamp(1.6rem, 3.5vw, 2.6rem);
  padding-top: clamp(1.4rem, 2.5vw, 1.8rem);
  border-top: 1px solid var(--color-rule);
}

.hero__intro {
  min-width: 0;
}

/* Tombol & sosial rata kanan, sejajar dengan ujung "Parhusip." */
.hero__cta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.25rem;
  min-width: 0;
}

/* Nama 3D "stempel timbul": sisi tebal dari tumpukan bayangan tajam ke
   kanan bawah. --name-depth dikali tiap lapis, jadi cukup ubah satu angka untuk
   menebalkan sisi (dipakai saat hover). Satuan em supaya ikut ukuran huruf. */
@property --name-depth {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}

.hero__title {
  --name-depth: 1;
  --side-1: #4B5059;
  --side-2: #2A2D33;
  --side-accent-1: #1660AD;
  --side-accent-2: #0D4580;
  --step: calc(var(--name-depth) * 0.004em);
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: clamp(3.6rem, 12.5vw, 11rem);
  line-height: 0.88;
  letter-spacing: -0.025em;
  color: var(--color-text);
  transition: --name-depth 0.35s var(--ease-out);
}

:root[data-theme='light'] .hero__title {
  --side-1: #8C9199;
  --side-2: #5E636B;
  --side-accent-1: #2A6FB8;
  --side-accent-2: #164E8A;
}

.hero__title-line {
  --s1: var(--side-1);
  --s2: var(--side-2);
  display: block;
  padding-bottom: 0.06em; /* ruang untuk ekor huruf saat clip reveal */
  transform: translate(calc((1 - var(--name-depth)) * 0.02em), calc((1 - var(--name-depth)) * 0.02em));
}

.hero__title-line,
.hero__title-dot {
  text-shadow:
    var(--step) var(--step) 0 var(--s1),
    calc(var(--step) * 2) calc(var(--step) * 2) 0 var(--s1),
    calc(var(--step) * 3) calc(var(--step) * 3) 0 var(--s1),
    calc(var(--step) * 4) calc(var(--step) * 4) 0 var(--s1),
    calc(var(--step) * 5) calc(var(--step) * 5) 0 var(--s2),
    calc(var(--step) * 6) calc(var(--step) * 6) 0 var(--s2),
    calc(var(--step) * 7) calc(var(--step) * 7) 0 var(--s2),
    calc(var(--step) * 8) calc(var(--step) * 8) 0 var(--s2),
    calc(var(--step) * 9) calc(var(--step) * 9) 0 var(--s2),
    calc(var(--step) * 12) calc(var(--step) * 15) 0.05em rgba(0, 0, 0, 0.3);
}

.hero__title-line--accent {
  --s1: var(--side-accent-1);
  --s2: var(--side-accent-2);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: var(--color-primary);
  padding-left: 0.04em;
  text-align: right;
}

.hero__title-dot {
  --s1: var(--side-1);
  --s2: var(--side-2);
  font-family: var(--font-heading);
  font-style: normal;
  font-weight: 700;
  color: var(--color-text);
}

/* Disorot: huruf "naik" sedikit dan sisinya menebal (hanya perangkat bermouse) */
@media (hover: hover) {
  .hero__title:hover {
    --name-depth: 1.6;
  }
}

/* ---- Peran yang diketik ---- */
.hero__role {
  display: grid;
  gap: 0.6rem;
  margin: 0;
  max-width: 40rem;
}

/* Label kecil + nomor peran, dipisah garis putus tipis */
.hero__role-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.hero__role-head::after {
  content: '';
  order: 1;
  flex: 1;
  height: 1px;
  background: var(--color-rule);
}

.hero__role-count {
  order: 2;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

/* Peran besar. min-height menjaga tinggi baris saat teks terhapus habis */
.hero__role-word {
  display: block;
  min-height: 1.05em;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.2vw, 3.3rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.hero__role-typed {
  color: var(--color-text);
}

.hero__role-typed--accent {
  color: var(--color-primary);
}

/* Kursor balok biru, setinggi huruf besar */
.hero__cursor {
  display: inline-block;
  width: 0.08em;
  height: 0.85em;
  margin-left: 0.06em;
  background: var(--color-primary);
  vertical-align: -0.06em;
  animation: hero-cursor-blink 0.85s steps(1) infinite;
}

@keyframes hero-cursor-blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

.hero__lead {
  max-width: 34rem;
  margin: 0.9rem 0 0;
  font-size: clamp(1rem, 1.3vw, 1.08rem);
  line-height: 1.75;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

/* ---- Tombol ---- */
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.hero__btn {
  position: relative;
  min-height: 50px;
  padding: 0 1.4rem;
}

.hero__btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.25s var(--ease-out);
}

.hero__btn:hover .hero__btn-arrow {
  transform: translateX(3px);
}

/* Tombol unduh: isian menyapu dari kiri saat berkas disiapkan */
.hero__btn--download {
  overflow: hidden;
  isolation: isolate;
}

.hero__btn--download.is-loading {
  cursor: progress;
  border-color: var(--color-primary);
}

.hero__btn--download.is-done {
  border-color: var(--color-accent);
}

.hero__btn-fill {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--color-primary-soft);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.85s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero__btn--download.is-done .hero__btn-fill {
  background: var(--color-accent-soft);
}

.hero__btn--download.is-loading .hero__btn-fill,
.hero__btn--download.is-done .hero__btn-fill {
  transform: scaleX(1);
}

.hero__btn-icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  width: 18px;
  height: 18px;
}

.hero__btn-icon-svg {
  width: 100%;
  height: 100%;
}

.hero__btn--download.is-loading .hero__btn-icon-svg--arrow {
  animation: hero-download-bounce 0.9s ease-in-out infinite;
}

.hero__btn-icon-svg--check {
  color: var(--color-accent);
  animation: hero-download-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero__btn-label {
  position: relative;
  z-index: 1;
}

@keyframes hero-download-bounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(3px); opacity: 0.55; }
}

@keyframes hero-download-pop {
  0% { transform: scale(0.4); opacity: 0; }
  70% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}

/* ---- Sosial + fokus ---- */
.hero__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
}

.hero__socials {
  display: flex;
}

.hero__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--color-rule);
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.hero__social-link + .hero__social-link {
  margin-left: -1px;
}

.hero__social-link:first-child {
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

.hero__social-link:last-child {
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.hero__social-link:hover {
  position: relative;
  border-color: var(--color-text);
  background: var(--color-surface);
}

.hero__social-icon {
  width: 19px;
  height: 19px;
}

.hero__social-img {
  width: 19px;
  height: 19px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

/* ---- Statistik: baris bergaris dengan angka besar ---- */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  align-items: stretch;
  margin: clamp(3rem, 6vw, 4.5rem) 0 0;
  border-top: 1px solid var(--color-rule);
  border-bottom: 1px solid var(--color-rule);
}

.hero__stat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  min-width: 0;
  padding: 1rem clamp(1rem, 2.5vw, 1.75rem) 1.1rem;
  border-left: 1px solid var(--color-rule);
}

.hero__stat:first-child {
  padding-left: 0;
  border-left: 0;
}

.hero__stat-label {
  display: flex;
  gap: 0.6rem;
  line-height: 1.5;
}

.hero__stat-num {
  color: var(--color-text-soft);
}

.hero__stat-value {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(2.8rem, 6vw, 4.6rem);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.hero__scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0 0 0 clamp(1rem, 2.5vw, 1.75rem);
  border-left: 1px solid var(--color-rule);
  text-decoration: none;
  writing-mode: vertical-rl;
  transition: color 0.2s ease;
}

.hero__scroll:hover {
  color: var(--color-text);
}

.hero__scroll-line {
  position: relative;
  width: 1px;
  height: 44px;
  overflow: hidden;
  background: var(--color-rule);
}

.hero__scroll-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-text);
  animation: hero-scroll 2.2s var(--ease-out) infinite;
}

@keyframes hero-scroll {
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
}

/* ---- Kurangi animasi ---- */
@media (prefers-reduced-motion: reduce) {
  .hero__status-dot::after,
  .hero__scroll-line::after,
  .hero__cursor {
    animation: none;
  }
}

/* ---- Tablet ---- */
@media (max-width: 960px) {
  .hero__bottom {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero__cta {
    align-items: flex-start;
  }
}

/* ---- HP ---- */
@media (max-width: 640px) {
  .hero__title {
    font-size: clamp(3.4rem, 19vw, 5.4rem);
  }

  .hero__cta {
    align-items: stretch;
  }

  .hero__actions .hero__btn {
    flex: 1 1 100%;
  }

  /* Ikon sosial di tengah, dipisah garis tipis dari tombol di atasnya */
  .hero__meta {
    flex-direction: column;
    gap: 1.1rem;
    margin-top: 1.75rem;
    padding-top: 1.75rem;
    border-top: 1px solid var(--color-rule);
  }

  .hero__social-link {
    width: 52px;
    height: 48px;
  }

  /* Statistik jadi baris buku besar: label kiri, angka kanan */
  .hero__stats {
    grid-template-columns: 1fr;
    border-bottom: 0;
  }

  .hero__stat {
    flex-direction: row;
    align-items: center;
    padding: 0.9rem 0;
    border-left: 0;
    border-bottom: 1px solid var(--color-rule);
  }

  .hero__stat-value {
    font-size: 2.6rem;
  }

  .hero__scroll {
    display: none;
  }
}
</style>
