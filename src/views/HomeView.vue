<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { loaderDone } from '@/composables/useLoaderState'
import { vReveal } from '@/directives/reveal'
import AboutSection from '@/components/AboutSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import myPhoto from '@/components/icons/icons-about/img-me.png'
import linkedinIcon from '@/components/icons/icons-about/linkedin-svgrepo-com.svg'
import instagramIcon from '@/components/icons/icons-about/instagram-2016-logo-svgrepo-com.svg'

const stack = ['Web Landing Page', 'Web E-commerce', 'Mobile App', 'Data']

// Spesifikasi singkat di samping foto
const specs = [
  { label: 'Web & Mobile', value: 'Vue · React · Flutter' },
  { label: 'Data & BI', value: 'Python · Streamlit' },
  { label: 'Sertifikasi', value: 'SAP Certified' },
]

const edition = new Date().getFullYear()

const stats = [
  { value: '4+', label: 'Tahun belajar teknologi' },
  { value: '6', label: 'Proyek selesai' },
  { value: '3,75', label: 'IPK S1 Bisnis Digital' },
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
   Animasi foto hero: foto masuk dari kanan layar lalu meluncur
   ke posisi aslinya. TIDAK bergantung pada scroll.
   Animasi baru dimulai kalau DUA syarat terpenuhi:
   1. Loader (TheLoader) sudah selesai & layar terbuka.
   2. Gambar sudah dimuat. Ada fallback 1,5 detik.
--------------------------------------------------------- */
const photoLoaded = ref(false)
const photoReady = computed(() => loaderDone.value && photoLoaded.value)
const photoEl = ref(null)
let photoFallbackId = null

function markPhotoLoaded() {
  photoLoaded.value = true
}

onMounted(() => {
  if (photoEl.value?.complete) markPhotoLoaded()
  photoFallbackId = setTimeout(markPhotoLoaded, 1500)
})

onUnmounted(() => {
  clearTimeout(photoFallbackId)
})

/* ---------------------------------------------------------
   Kartu foto 3D: miring mengikuti kursor, foto di lapisan depan
   bergerak lebih jauh dari panel sehingga terasa berlapis.
   Hanya untuk mouse; di layar sentuh & "kurangi animasi" kartu diam.
   Nilai ditulis ke CSS variable, jadi tidak ada re-render Vue.
--------------------------------------------------------- */
const cardEl = ref(null)
const MAX_TILT_Y = 9
const MAX_TILT_X = 7
let canTilt = false
let tiltFrame = 0

function onCardMove(event) {
  if (!canTilt || !cardEl.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  cancelAnimationFrame(tiltFrame)
  tiltFrame = requestAnimationFrame(() => {
    const style = cardEl.value.style
    style.setProperty('--ry', `${((x - 0.5) * 2 * MAX_TILT_Y).toFixed(2)}deg`)
    style.setProperty('--rx', `${((0.5 - y) * 2 * MAX_TILT_X).toFixed(2)}deg`)
    style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
    style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
    cardEl.value.classList.add('is-tilting')
  })
}

function onCardLeave() {
  if (!cardEl.value) return
  cancelAnimationFrame(tiltFrame)
  const style = cardEl.value.style
  style.setProperty('--rx', '0deg')
  style.setProperty('--ry', '0deg')
  cardEl.value.classList.remove('is-tilting')
}

onMounted(() => {
  canTilt = !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches
})

onUnmounted(() => {
  cancelAnimationFrame(tiltFrame)
})

/* ---------------------------------------------------------
   Angka statistik naik dari 0 saat terlihat di layar.
   Format desimal pakai koma (3,75) dan akhiran (+) dipertahankan.
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
          <span class="hero__strip-coord">Bandung, ID — 6°55′S 107°37′E</span>
          <span class="hero__strip-status">
            <span class="hero__status-dot" aria-hidden="true"></span>
            Terbuka untuk kerja
          </span>
        </div>

        <div class="hero__inner">
          <div class="hero__content">
            <span class="hero__kicker mono-meta" v-reveal="40">Fresh Graduate · S1 Bisnis Digital</span>

            <!-- Nama tersibak per baris, baris kedua menyusul -->
            <h1 class="hero__title">
              <span v-reveal.clip="90" class="hero__title-line">Jose Elio</span>
              <span v-reveal.clip="190" class="hero__title-line hero__title-line--accent"
                >Parhusip<span class="hero__title-dot">.</span></span
              >
            </h1>

            <p class="hero__role" v-reveal="300">
              <span class="hero__role-prefix">Saya seorang</span>
              <!-- Pembaca layar membaca daftar peran lengkap, bukan huruf yang sedang diketik -->
              <span class="hero__sr">{{ roles.join(', ') }}</span>
              <span class="hero__role-typed" aria-hidden="true">
                {{ typedRole }}<span class="hero__cursor"></span>
              </span>
            </p>

            <p class="hero__lead" v-reveal="380">
              Lulusan S1 Bisnis Digital ULBI yang senang mengubah data, desain, dan kode menjadi produk yang
              benar-benar dipakai, dari web, mobile, sampai dashboard data dan AI.
            </p>

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

              <div class="hero__focus">
                <span class="hero__focus-label mono-meta">Fokus</span>
                <ul class="hero__stack" aria-label="Fokus pengerjaan">
                  <li v-for="tech in stack" :key="tech" class="hero__stack-item">{{ tech }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Foto sebagai "pelat" bergambar, lengkap dengan keterangan -->
          <figure class="hero__visual" :class="{ 'is-in': photoReady }">
            <div class="hero__plate" @pointermove="onCardMove" @pointerleave="onCardLeave">
              <div ref="cardEl" class="hero__card">
                <span class="hero__card-panel" aria-hidden="true">
                  <span class="hero__plate-mark hero__plate-mark--tl"></span>
                  <span class="hero__plate-mark hero__plate-mark--br"></span>
                </span>
                <img
                  ref="photoEl"
                  :src="myPhoto"
                  alt="Jose Elio Parhusip"
                  class="hero__photo"
                  draggable="false"
                  fetchpriority="high"
                  width="944"
                  height="944"
                  @load="markPhotoLoaded"
                  @error="markPhotoLoaded"
                  @contextmenu.prevent="preventImageAction"
                  @dragstart.prevent="preventImageAction"
                />
              </div>
            </div>
            <figcaption class="hero__caption mono-meta">
              <span>Gbr. 01</span>
              <span>Jose Elio Parhusip, Bandung</span>
            </figcaption>

            <dl class="hero__specs">
              <div v-for="spec in specs" :key="spec.label" class="hero__spec">
                <dt class="mono-meta">{{ spec.label }}</dt>
                <dd>{{ spec.value }}</dd>
              </div>
            </dl>
          </figure>
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
    <ContactSection />
  </main>
</template>

<style scoped>
/* =========================================================
   HERO — gaya "Field Notes": sampul jurnal dengan garis tipis,
   nama besar rata kiri, dan foto sebagai pelat bergambar.
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

/* ---- Isi utama: teks lebar di kiri, pelat foto di kanan ---- */
.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 4.2fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: end;
  padding-top: clamp(2.5rem, 6vw, 4.5rem);
}

.hero__content {
  min-width: 0;
}

.hero__kicker {
  display: block;
  margin-bottom: 1.25rem;
}

.hero__title {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: clamp(3.4rem, 10vw, 8.2rem);
  line-height: 0.9;
  letter-spacing: -0.045em;
  color: var(--color-text);
}

.hero__title-line {
  display: block;
  padding-bottom: 0.06em; /* ruang untuk ekor huruf saat clip reveal */
}

.hero__title-line--accent {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.03em;
  color: var(--color-primary);
  padding-left: 0.04em;
}

.hero__title-dot {
  font-family: var(--font-heading);
  font-style: normal;
  font-weight: 700;
  color: var(--color-text);
}

/* ---- Peran yang diketik ---- */
.hero__role {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.15rem 0.6rem;
  margin: clamp(1.4rem, 3vw, 2rem) 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--color-rule);
  max-width: 36rem;
}

.hero__role-prefix {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.hero__role-typed {
  min-height: 1.3em;
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.hero__cursor {
  display: inline-block;
  width: 2px;
  height: 0.9em;
  margin-left: 3px;
  background: var(--color-primary);
  vertical-align: -0.08em;
  animation: hero-cursor-blink 0.85s steps(1) infinite;
}

@keyframes hero-cursor-blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

.hero__lead {
  max-width: 34rem;
  margin: 1rem 0 2rem;
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

.hero__btn:hover {
  transform: translateY(-2px);
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
  margin-top: 2rem;
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

.hero__focus {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.9rem;
  min-width: 0;
}

.hero__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hero__stack-item {
  font-size: 0.86rem;
  color: var(--color-text);
}

.hero__stack-item + .hero__stack-item::before {
  content: '/';
  margin: 0 0.55rem;
  color: var(--color-text-soft);
}

/* ---- Pelat foto ---- */
.hero__visual {
  --hero-slide-x: 72px;
  margin: 0;
  min-width: 0;
}

.hero__plate {
  position: relative;
  aspect-ratio: 4 / 5;
  perspective: 1100px;
}

/* Kartu yang dimiringkan. Anak-anaknya tetap 3D (preserve-3d). */
.hero__card {
  --rx: 0deg;
  --ry: 0deg;
  --gx: 50%;
  --gy: 30%;
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.7s var(--ease-out);
}

.hero__card.is-tilting {
  transition: transform 0.12s linear;
}

/* Panel kartu lebih pendek dari foto, jadi kepala & bahu "keluar" dari bingkai */
.hero__card-panel {
  position: absolute;
  inset: 16% 0 0;
  overflow: hidden;
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-lg);
  background: var(--color-surface-soft);
  box-shadow: 0 40px 70px -40px rgba(0, 0, 0, 0.55);
}

/* Kilau cahaya halus di permukaan panel, mengikuti kursor */
.hero__card-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--gx) var(--gy), rgba(255, 255, 255, 0.16), transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.hero__card.is-tilting .hero__card-panel::after {
  opacity: 1;
}

/* Foto di lapisan depan. scale() menetralkan pembesaran dari translateZ,
   jadi saat kartu diam ukurannya pas dengan panel. */
.hero__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  transform: translateZ(50px) scale(0.955);
  clip-path: inset(0 0 0 0 round 0 0 var(--radius-lg) var(--radius-lg));
  filter: drop-shadow(0 18px 22px rgba(0, 0, 0, 0.3));
  user-select: none;
  -webkit-user-drag: none;
}

/* Tanda registrasi di sudut, seperti cetak foto */
.hero__plate-mark {
  position: absolute;
  z-index: 1;
  width: 14px;
  height: 14px;
  border-color: var(--color-primary);
  border-style: solid;
  pointer-events: none;
}

.hero__plate-mark--tl {
  top: 10px;
  left: 10px;
  border-width: 1px 0 0 1px;
}

.hero__plate-mark--br {
  right: 10px;
  bottom: 10px;
  border-width: 0 1px 1px 0;
}

.hero__caption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid var(--color-rule);
}

.hero__caption span:first-child {
  color: var(--color-primary);
}

.hero__specs {
  margin: 0;
}

.hero__spec {
  display: grid;
  grid-template-columns: 7.5rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-rule);
}

.hero__spec dd {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

/* Foto masuk dari kanan setelah loader selesai (logika di script) */
.hero__visual:not(.is-in) .hero__plate {
  opacity: 0;
  transform: translateX(var(--hero-slide-x));
}

.hero__visual.is-in .hero__plate {
  animation: hero-plate-in 1.2s var(--ease-out) backwards;
}

.hero__visual:not(.is-in) .hero__caption,
.hero__visual:not(.is-in) .hero__specs {
  opacity: 0;
}

.hero__visual.is-in .hero__caption,
.hero__visual.is-in .hero__specs {
  animation: hero-fade-up 0.7s var(--ease-out) 0.6s backwards;
}

.hero__visual.is-in .hero__specs {
  animation-delay: 0.75s;
}

@keyframes hero-plate-in {
  from { opacity: 0; transform: translateX(var(--hero-slide-x)); clip-path: inset(0 0 0 100%); }
  to { opacity: 1; transform: translateX(0); clip-path: inset(0 0 0 0); }
}

@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
  color: var(--color-primary);
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
  color: var(--color-primary);
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
  background: var(--color-primary);
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

  .hero__visual:not(.is-in) .hero__plate,
  .hero__visual:not(.is-in) .hero__caption,
  .hero__visual:not(.is-in) .hero__specs {
    opacity: 1;
    transform: none;
  }

  .hero__visual.is-in .hero__plate,
  .hero__visual.is-in .hero__caption,
  .hero__visual.is-in .hero__specs {
    animation: none;
  }
}

/* ---- Tablet ---- */
@media (max-width: 960px) {
  .hero__inner {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .hero__visual {
    --hero-slide-x: 40px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: 1.5rem;
    align-items: end;
  }

  .hero__plate {
    grid-row: span 2;
  }
}

/* ---- HP ---- */
@media (max-width: 640px) {
  .hero__strip-coord {
    display: none;
  }

  .hero__title {
    font-size: clamp(3.2rem, 18vw, 5rem);
  }

  .hero__actions .hero__btn {
    flex: 1 1 100%;
  }

  /* Sosial + fokus di tengah, dipisah garis tipis dari tombol di atasnya */
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

  .hero__focus {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  /* Di HP daftar fokus jadi chip, supaya tanda "/" tidak jatuh di awal baris */
  .hero__stack {
    justify-content: center;
    gap: 0.4rem;
  }

  .hero__stack-item {
    padding: 0.3rem 0.65rem;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
  }

  .hero__stack-item + .hero__stack-item::before {
    content: none;
  }

  .hero__visual {
    --hero-slide-x: 24px;
    display: block;
  }

  .hero__spec {
    grid-template-columns: 6.5rem 1fr;
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
