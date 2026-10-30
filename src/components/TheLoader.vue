<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loaderDone } from '@/composables/useLoaderState'
import { useTheme } from '@/composables/useTheme'

/* ---------------------------------------------------------
   Layar pembuka:
   1. Tampilan bersih: hanya logo JP di tengah + garis progres pendek
      di bawahnya (± 1,7 detik).
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
const REVEAL_MS = 1200

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
  // #app punya transisi warna latar (main.css). Tanpa ini, latar gelap
  // di sekitar kartu memudar pelan ke warna asli dan terlihat "berkedip".
  const app = document.getElementById('app')
  if (app) app.style.transition = 'none'
  root.classList.remove('intro-hold', 'intro-reveal')
  document.body.style.overflow = ''
  if (app) {
    void app.offsetHeight // terapkan warna baru tanpa transisi
    requestAnimationFrame(() => {
      app.style.transition = ''
    })
  }
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
      // Animasi masuk hero dijalankan di balik layar loader selama logo
      // zoom, jadi sudah selesai saat kartu beranda zoom: browser tidak
      // berebut tenaga dan zoom kartu tetap mulus.
      loaderDone.value = true
    }, tZoom),
    setTimeout(() => {
      isHiding.value = true
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

</script>

<template>
  <div v-if="isVisible" class="loader" :class="{ 'loader--exit': isExiting, 'loader--hide': isHiding }" aria-hidden="true">
    <div class="loader__center">
      <img :src="logoSrc" alt="" class="loader__logo" draggable="false" />
    </div>

    <!-- Garis progres pendek di bawah logo -->
    <div class="loader__bar">
      <span class="loader__bar-fill" :style="{ transform: `scaleX(${count / 100})` }"></span>
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

/* Supaya mulus: yang dianimasikan hanya transform (dikerjakan GPU, sama
   seperti zoom logo). Panggung dipotong setinggi satu layar dengan
   overflow, jadi lapisan yang di-zoom kecil, bukan seluruh halaman. */
html.intro-hold .app-stage,
html.intro-reveal .app-stage {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--color-bg);
  transform-origin: 50% 50%;
  will-change: transform;
  backface-visibility: hidden;
}

html.intro-hold .app-stage {
  transform: scale(0.62);
  border-radius: 28px;
}

html.intro-reveal .app-stage {
  transform: scale(1);
  border-radius: 0;
  transition:
    transform 1.2s cubic-bezier(0.65, 0, 0.35, 1),
    border-radius 0.4s ease 0.8s;
}
</style>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: var(--color-bg, #0e0f11);
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

/* Garis progres: pendek, tipis, tepat di bawah logo. Logo tetap persis di
   tengah layar karena garis ini diposisikan absolut. */
.loader__bar {
  position: absolute;
  top: calc(50% + clamp(70px, 9vw, 105px));
  left: 50%;
  width: clamp(88px, 9vw, 120px);
  height: 2px;
  border-radius: 2px;
  background: var(--color-rule, rgba(230, 233, 238, 0.2));
  overflow: hidden;
  transform: translateX(-50%);
  transition: opacity 0.25s ease;
}

/* Garis hilang duluan sebelum logo zoom */
.loader--exit .loader__bar {
  opacity: 0;
}

.loader__bar-fill {
  display: block;
  height: 100%;
  background: var(--color-text, #eceef1);
  transform-origin: left center;
  transition: transform 0.12s linear;
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
