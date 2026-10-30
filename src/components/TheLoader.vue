<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loaderDone } from '@/composables/useLoaderState'
import { useTheme } from '@/composables/useTheme'

/* ---------------------------------------------------------
   Layar pembuka:
   1. Logo JP besar di tengah + garis progres (± 1,7 detik).
   2. Logo zoom in sangat besar (seperti kamera menembus logo) sampai
      hilang. Latar loader tetap menutup layar selama tahap ini.
   3. BARU SETELAH ITU latar loader memudar dan beranda (.app-stage di
      App.vue) terlihat sebagai kartu kecil di tengah layar, lalu zoom
      in sampai memenuhi layar. Tahap 2 dan 3 sengaja tidak bersamaan.
   Kelas di <html>: intro-hold (kartu kecil), intro-reveal (kartu
   membesar). Keduanya dihapus setelah selesai
   supaya transform tidak mengganggu elemen fixed (navbar, dll).
--------------------------------------------------------- */
const COUNT_MS = 1700
const LOGO_ZOOM_MS = 900 // logo zoom sampai habis
const CARD_PAUSE_MS = 450 // kartu kecil terlihat sebentar, baru membesar
const REVEAL_MS = 1100

const isVisible = ref(true)
const isExiting = ref(false) // tahap 2: logo zoom
const isHiding = ref(false) // tahap 3: latar loader memudar
const count = ref(0)

// Logo mengikuti tema, sama seperti di navbar
const { theme } = useTheme()
const logoSrc = computed(() =>
  theme.value === 'light' ? '/logo-navbar-sebelum-scroll.png' : '/logo-navbar-footer.png',
)

const root = document.documentElement
let frame = 0
const timers = []

function finish() {
  isVisible.value = false
  root.classList.remove('intro-hold', 'intro-reveal')
  document.body.style.overflow = ''
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  root.classList.add('intro-hold')

  const start = performance.now()
  const tick = (now) => {
    const t = Math.min(1, (now - start) / COUNT_MS)
    // Cepat di awal, melambat di akhir
    count.value = Math.round((1 - Math.pow(1 - t, 3)) * 100)
    if (t < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)

  const tZoom = COUNT_MS + 120
  const tHide = tZoom + LOGO_ZOOM_MS
  const tReveal = tHide + CARD_PAUSE_MS
  timers.push(
    setTimeout(() => {
      isExiting.value = true
    }, tZoom),
    setTimeout(() => {
      isHiding.value = true
      // Animasi hero mulai saat kartu muncul, jadi isinya sudah bergerak
      loaderDone.value = true
    }, tHide),
    setTimeout(() => {
      root.classList.add('intro-reveal')
      root.classList.remove('intro-hold')
    }, tReveal),
    setTimeout(finish, tReveal + REVEAL_MS + 60),
  )
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  timers.forEach(clearTimeout)
  finish()
})

const year = new Date().getFullYear()
</script>

<template>
  <div v-if="isVisible" class="loader" :class="{ 'loader--exit': isExiting, 'loader--hide': isHiding }" aria-hidden="true">
    <div class="loader__top">
      <span>Jose Elio Parhusip</span>
      <span>Portofolio · {{ year }}</span>
    </div>

    <div class="loader__center">
      <img :src="logoSrc" alt="" class="loader__logo" draggable="false" />
    </div>

    <div class="loader__bottom">
      <div class="loader__meta">
        <span>{{ count < 100 ? 'Memuat' : 'Siap' }}</span>
      </div>
      <div class="loader__bar">
        <span class="loader__bar-fill" :style="{ transform: `scaleX(${count / 100})` }"></span>
      </div>
    </div>
  </div>
</template>

<style>
/* Panggung halaman (App.vue) selama intro. Tanpa scoped karena kelasnya
   ada di <html> dan elemennya di luar komponen ini. Hanya layar pertama
   yang ditampilkan (clip setinggi 100vh), jadi terlihat seperti kartu. */
html.intro-hold #app,
html.intro-reveal #app {
  background: color-mix(in srgb, var(--color-bg) 82%, #000);
}

html.intro-hold .app-stage,
html.intro-reveal .app-stage {
  background: var(--color-bg);
  transform-origin: 50% 50vh;
  will-change: transform, clip-path;
}

html.intro-hold .app-stage {
  transform: scale(0.62);
  clip-path: inset(0 0 calc(100% - 100vh) 0 round 28px);
}

html.intro-reveal .app-stage {
  transform: scale(1);
  clip-path: inset(0 0 calc(100% - 100vh) 0 round 0);
  transition:
    transform 1.1s cubic-bezier(0.76, 0, 0.24, 1),
    clip-path 1.1s cubic-bezier(0.76, 0, 0.24, 1);
}
</style>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  background: var(--color-bg, #0e0f11);
  color: var(--color-text, #eceef1);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Setelah logo selesai zoom, latar loader memudar: yang terlihat adalah
   kartu beranda yang sudah menunggu di tengah. */
.loader {
  transition: background-color 0.4s ease;
}

.loader--hide {
  background-color: transparent;
  pointer-events: none;
}

.loader__top,
.loader__meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--color-text-soft, #9aa0a8);
}

.loader__top,
.loader__bottom {
  transition: opacity 0.3s ease;
}

.loader--exit .loader__top,
.loader--exit .loader__bottom {
  opacity: 0;
}

.loader__center {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 1.25rem;
}

.loader__logo {
  width: clamp(110px, 15vw, 180px);
  height: auto;
  opacity: 0;
  animation:
    loader-in 0.7s 0.1s cubic-bezier(0.22, 1, 0.36, 1) forwards,
    loader-breathe 1.6s 0.8s ease-in-out infinite alternate;
  user-select: none;
  -webkit-user-drag: none;
}

/* Zoom in: logo membesar berkali-kali lipat seperti kamera menembus logo,
   dan sudah hilang penuh sebelum kartu beranda terlihat */
.loader__center {
  transition:
    transform 0.85s cubic-bezier(0.7, 0, 0.84, 0),
    opacity 0.3s ease 0.5s;
}

.loader--exit .loader__center {
  transform: scale(22);
  opacity: 0;
}

.loader__bottom {
  display: grid;
  gap: 0.6rem;
}

.loader__bar {
  height: 2px;
  background: var(--color-rule, rgba(230, 233, 238, 0.2));
  overflow: hidden;
}

.loader__bar-fill {
  display: block;
  height: 100%;
  background: var(--color-text, #eceef1);
  transform-origin: left center;
}

@keyframes loader-in {
  from {
    transform: scale(0.82);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Logo "bernapas" pelan selama menunggu */
@keyframes loader-breathe {
  from {
    scale: 1;
  }
  to {
    scale: 1.05;
  }
}
</style>
