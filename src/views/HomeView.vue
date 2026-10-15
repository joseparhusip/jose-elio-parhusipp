<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const stats = [
  { value: '4+', label: 'Tahun belajar teknologi' },
  { value: '6', label: 'Proyek selesai' },
  { value: '3,75', label: 'IPK S1 Bisnis Digital' },
]

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
</script>

<template>
  <main>
    <section id="beranda" class="hero">
      <div class="hero__bg" aria-hidden="true">
        <span class="hero__grid"></span>
        <span class="hero__glow hero__glow--a"></span>
        <span class="hero__glow hero__glow--b"></span>
      </div>

      <div class="container hero__inner">
        <div class="hero__content">
          <span class="hero__status" v-reveal>
            <span class="hero__status-dot" aria-hidden="true"></span>
            Fresh Graduate · Bandung
          </span>

          <h1 class="hero__title" v-reveal="90">
            Jose Elio<br />
            Parhusip<span class="hero__title-dot">.</span>
          </h1>

          <p class="hero__role" v-reveal="160">
            <span class="hero__role-prefix">Saya seorang</span>
            <span class="hero__role-typed serif-accent">
              {{ typedRole }}<span class="hero__cursor" aria-hidden="true"></span>
            </span>
          </p>

          <p class="hero__lead" v-reveal="230">
            Lulusan S1 Bisnis Digital ULBI yang senang mengubah data, desain, dan kode menjadi produk yang
            benar-benar dipakai, dari web, mobile, sampai dashboard data dan AI.
          </p>

          <div class="hero__actions" v-reveal="300">
            <a href="#proyek" class="hero__btn hero__btn--primary">
              Lihat Proyek
              <svg viewBox="0 0 24 24" class="hero__btn-arrow" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
            <a
              href="/CV - Jose Elio Parhusip.pdf"
              class="hero__btn hero__btn--ghost hero__btn--download"
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

          <div class="hero__meta" v-reveal="370">
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

            <span class="hero__meta-divider" aria-hidden="true"></span>

            <ul class="hero__stack" aria-label="Fokus pengerjaan">
              <li v-for="tech in stack" :key="tech" class="hero__stack-item">{{ tech }}</li>
            </ul>
          </div>
        </div>

        <div class="hero__visual" :class="{ 'is-in': photoReady }">
          <div class="hero__arch" aria-hidden="true">
            <span class="hero__arch-ring"></span>
            <span class="hero__arch-orbit"></span>
          </div>

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

          <div class="hero__badge hero__badge--top">
            <span class="hero__badge-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m8 6-6 6 6 6M16 6l6 6-6 6" /></svg>
            </span>
            <span class="hero__badge-text">
              <strong>Web &amp; Mobile</strong>
              <span>Vue · React · Flutter</span>
            </span>
          </div>
          <div class="hero__badge hero__badge--bottom">
            <span class="hero__badge-icon hero__badge-icon--accent" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 19V9m6 10V5m6 14v-7m4 7H3" /></svg>
            </span>
            <span class="hero__badge-text">
              <strong>Data &amp; BI</strong>
              <span>Python · Streamlit</span>
            </span>
          </div>
        </div>
      </div>

      <div class="container">
        <dl class="hero__stats" v-reveal="120">
          <div v-for="item in stats" :key="item.label" class="hero__stat">
            <dt class="hero__stat-label">{{ item.label }}</dt>
            <dd class="hero__stat-value">{{ item.value }}</dd>
          </div>
          <a href="#tentang" class="hero__scroll">
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
   HERO
   ========================================================= */
.hero {
  position: relative;
  padding: clamp(2.5rem, 6vw, 4.5rem) 0 clamp(2.5rem, 5vw, 3.5rem);
  overflow: hidden;
  isolation: isolate;
}

/* ---- Latar: grid halus + dua cahaya warna brand ---- */
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%);
  opacity: 0.55;
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
}

.hero__glow--a {
  width: 520px;
  height: 520px;
  top: -160px;
  right: -80px;
  background: var(--color-primary-soft);
}

.hero__glow--b {
  width: 420px;
  height: 420px;
  bottom: -140px;
  left: -120px;
  background: var(--color-accent-soft);
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4rem);
}

/* ---- Teks ---- */
.hero__status {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
  padding: 0.45rem 0.95rem 0.45rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface) 70%, transparent);
  backdrop-filter: blur(8px);
}

.hero__status-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}

.hero__status-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  animation: hero-ping 2s var(--ease-out) infinite;
}

@keyframes hero-ping {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}

.hero__title {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 7.6vw, 6rem);
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -0.035em;
  color: var(--color-text);
  margin: 1.4rem 0 1.2rem;
}

.hero__title-dot {
  color: var(--color-primary);
}

.hero__role {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.15rem 0.6rem;
  margin: 0;
  min-height: 1.3em;
  font-size: clamp(1.35rem, 2.6vw, 2rem);
  line-height: 1.25;
}

.hero__role-prefix {
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-text-soft);
}

.hero__role-typed {
  font-size: 1.12em;
  white-space: nowrap;
}

.hero__cursor {
  display: inline-block;
  width: 2px;
  height: 0.9em;
  margin-left: 4px;
  background: var(--color-accent);
  vertical-align: -0.08em;
  animation: hero-cursor-blink 0.85s steps(1) infinite;
}

@keyframes hero-cursor-blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

.hero__lead {
  max-width: 34rem;
  margin: 1.1rem 0 2rem;
  font-size: clamp(1rem, 1.35vw, 1.1rem);
  line-height: 1.75;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

/* ---- Tombol ---- */
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 52px;
  padding: 0 1.6rem;
  font-family: var(--font-body);
  font-size: 0.97rem;
  font-weight: 600;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.25s var(--ease-out), background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.hero__btn--primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 14px 30px -14px var(--color-primary), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.hero__btn--primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.hero__btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.25s var(--ease-out);
}

.hero__btn--primary:hover .hero__btn-arrow {
  transform: translateX(3px);
}

.hero__btn--ghost {
  color: var(--color-text);
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(8px);
}

.hero__btn--ghost:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.hero__btn--download {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.hero__btn--download.is-loading {
  cursor: progress;
  border-color: var(--color-primary);
}

.hero__btn--download.is-done {
  border-color: var(--color-primary);
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
  gap: 1rem 1.25rem;
  margin-top: 2rem;
}

.hero__socials {
  display: flex;
  gap: 0.5rem;
}

.hero__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: transform 0.25s var(--ease-out), border-color 0.25s ease, background 0.25s ease;
}

.hero__social-link:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  transform: translateY(-2px);
}

.hero__social-icon,
.hero__social-img {
  width: 19px;
  height: 19px;
  display: block;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.hero__meta-divider {
  width: 1px;
  height: 28px;
  background: var(--color-border);
}

.hero__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.hero__stack-item {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--color-text-soft);
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px dashed var(--color-border);
}

/* ---- Foto: figur keluar dari bingkai lengkung ---- */
.hero__visual {
  position: relative;
  width: 100%;
  max-width: 520px;
  margin-inline: auto;
  aspect-ratio: 1 / 1.08;
  --hero-slide-x: 60vw;
}

.hero__arch {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 74%;
  height: 84%;
  transform: translateX(-50%);
  border-radius: 999px 999px var(--radius-lg) var(--radius-lg);
  background:
    radial-gradient(120% 70% at 50% 0%, var(--color-primary-soft), transparent 70%),
    linear-gradient(180deg, var(--color-surface-soft), var(--color-surface));
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
}

.hero__arch-ring {
  position: absolute;
  inset: -14px;
  border-radius: inherit;
  border: 1px dashed color-mix(in srgb, var(--color-primary) 45%, transparent);
  opacity: 0.6;
}

.hero__arch-orbit {
  position: absolute;
  top: 9%;
  right: -10px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 6px var(--color-accent-soft);
}

.hero__photo {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 112%;
  max-width: none;
  height: auto;
  transform: translateX(-50%);
  /* pudarkan sedikit bagian bawah supaya menyatu dengan bingkai */
  mask-image: linear-gradient(to bottom, #000 70%, transparent 98%);
  -webkit-mask-image: linear-gradient(to bottom, #000 70%, transparent 98%);
  -webkit-user-drag: none;
  user-select: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.hero__badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 1rem 0.7rem 0.7rem;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-card);
  animation: hero-float 6s ease-in-out infinite;
}

.hero__badge--top {
  /* Badge sengaja di bawah area wajah (setinggi dada), jangan sampai menutupi muka */
  top: 46%;
  left: -8%;
}

.hero__badge--bottom {
  bottom: 8%;
  right: -6%;
  animation-delay: -3s;
}

@keyframes hero-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.hero__badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.hero__badge-icon--accent {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.hero__badge-icon svg {
  width: 18px;
  height: 18px;
}

.hero__badge-text {
  display: grid;
  line-height: 1.25;
}

.hero__badge-text strong {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.hero__badge-text span {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-soft);
}

/* Foto masuk dari kanan setelah loader selesai (logika di script) */
.hero__visual:not(.is-in) {
  opacity: 0;
  transform: translateX(var(--hero-slide-x));
}

.hero__visual.is-in {
  animation: hero-visual-slide-in 1.3s var(--ease-out) backwards;
}

@keyframes hero-visual-slide-in {
  from { opacity: 0; transform: translateX(var(--hero-slide-x)); }
  15% { opacity: 1; }
  to { opacity: 1; transform: translateX(0); }
}

/* ---- Statistik ---- */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  align-items: end;
  gap: 1rem;
  margin: clamp(2.5rem, 6vw, 4rem) 0 0;
  padding-top: 1.75rem;
  border-top: 1px solid var(--color-border);
}

.hero__stat {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.2rem;
}

.hero__stat-value {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-text);
}

.hero__stat-label {
  font-size: 0.85rem;
  color: var(--color-text-soft);
}

.hero__scroll {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-soft);
  text-decoration: none;
}

.hero__scroll-line {
  position: relative;
  width: 1px;
  height: 42px;
  background: var(--color-border);
  overflow: hidden;
}

.hero__scroll-line::after {
  content: '';
  position: absolute;
  left: 0;
  top: -40%;
  width: 100%;
  height: 40%;
  background: var(--color-accent);
  animation: hero-scroll 1.8s var(--ease-out) infinite;
}

@keyframes hero-scroll {
  to { top: 100%; }
}

/* =========================================================
   TABLET (<= 960px): satu kolom, foto di atas
   ========================================================= */
@media (max-width: 960px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }

  .hero__visual {
    order: -1;
    max-width: 380px;
    --hero-slide-x: 100vw;
  }

  .hero__title {
    margin-top: 1.1rem;
  }
}

/* =========================================================
   HP (<= 600px)
   ========================================================= */
@media (max-width: 600px) {
  .hero__visual {
    max-width: 300px;
  }

  .hero__badge {
    padding: 0.5rem 0.75rem 0.5rem 0.5rem;
    gap: 0.5rem;
    border-radius: 12px;
  }

  .hero__badge-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
  }

  .hero__badge-text strong {
    font-size: 0.8rem;
  }

  .hero__badge-text span {
    font-size: 0.62rem;
  }

  .hero__badge--top {
    top: 50%;
    left: -10%;
  }

  .hero__badge--bottom {
    bottom: 6%;
    right: -8%;
  }

  .hero__role {
    min-height: 2.6em; /* ruang 2 baris di HP supaya teks di bawahnya tidak lompat saat mengetik */
  }

  .hero__actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero__meta-divider {
    display: none;
  }

  .hero__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .hero__stat-label {
    font-size: 0.74rem;
    line-height: 1.35;
  }

  .hero__scroll {
    display: none;
  }
}
</style>
