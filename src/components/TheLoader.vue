<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loaderDone, hasSeenIntro, INTRO_SEEN_KEY } from '@/composables/useLoaderState'
import { useTheme } from '@/composables/useTheme'
import PageSkeleton from './PageSkeleton.vue'

const COUNT_MS = 1700
const LOGO_ZOOM_MS = 900
const CARD_PAUSE_MS = 450
const REVEAL_MS = 1200

function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch {
  }
}

const isQuick = hasSeenIntro()
const isVisible = ref(true)
const isExiting = ref(false)
const isHiding = ref(false)
const isFading = ref(false)
const count = ref(0)

const { theme } = useTheme()
const logoSrc = computed(() =>
  theme.value === 'light' ? '/logo-navbar-sebelum-scroll.webp' : '/logo-navbar-footer.webp',
)

const root = document.documentElement
let frame = 0
const timers = []

function finish() {
  isVisible.value = false
  const app = document.getElementById('app')
  if (app) app.style.transition = 'none'
  root.classList.remove('intro-hold', 'intro-reveal')
  document.body.style.overflow = ''
  if (app) {
    void app.offsetHeight
    requestAnimationFrame(() => {
      app.style.transition = ''
    })
  }
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  if (isQuick) return
  root.classList.add('intro-hold')

  const start = performance.now()
  const tick = (now) => {
    const t = Math.min(1, (now - start) / COUNT_MS)
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
      loaderDone.value = true
    }, tZoom),
    setTimeout(() => {
      isHiding.value = true
    }, tHide),
    setTimeout(() => {
      root.classList.add('intro-reveal')
      root.classList.remove('intro-hold')
    }, tReveal),
    setTimeout(() => {
      markIntroSeen()
      finish()
    }, tReveal + REVEAL_MS + 60),
  )
})

function onSkeletonReveal() {
  isFading.value = true
  loaderDone.value = true
}

onUnmounted(() => {
  cancelAnimationFrame(frame)
  timers.forEach(clearTimeout)
  finish()
})

</script>

<template>
  <PageSkeleton v-if="isVisible && isQuick" @reveal="onSkeletonReveal" @done="finish" />
  <div
    v-else-if="isVisible"
    class="loader"
    :class="{
      'loader--exit': isExiting,
      'loader--hide': isHiding,
      'loader--quick': isQuick,
      'loader--fade': isFading,
    }"
    aria-hidden="true"
  >
    <div class="loader__center">
      <div class="loader__logo">
        <div class="loader__spin">
        <img
          v-for="layer in 9"
          :key="layer"
          :src="logoSrc"
          alt=""
          class="loader__layer"
          :class="{ 'loader__layer--face': layer === 9 }"
          :style="{ '--z': `${(layer - 9) * 2.6}px`, '--shade': (9 - layer) * 0.07 }"
          width="512"
          height="512"
          draggable="false"
        />
        </div>
      </div>
    </div>

    <div class="loader__bar">
      <span class="loader__bar-fill" :style="{ transform: `scaleX(${count / 100})` }"></span>
    </div>
  </div>
</template>

<style>
html.intro-hold #app,
html.intro-reveal #app {
  background: color-mix(in srgb, var(--color-bg) 82%, #000);
}

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
  position: relative;
  width: clamp(110px, 15vw, 180px);
  aspect-ratio: 1;
  opacity: 0;
  perspective: 900px;
  animation: loader-show 0.6s 0.1s ease forwards;
  user-select: none;
}

.loader__spin {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation:
    loader-in 0.9s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both,
    loader-sway 2.4s 1s ease-in-out infinite alternate;
}

.loader__layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: translateZ(var(--z));
  filter: brightness(calc(1 - var(--shade)));
  backface-visibility: visible;
  -webkit-user-drag: none;
}

.loader__layer--face {
  filter: drop-shadow(0 0 18px color-mix(in srgb, var(--color-primary, #1f7fe0) 45%, transparent));
}

.loader__center {
  transition:
    transform 0.85s cubic-bezier(0.7, 0, 0.84, 0),
    opacity 0.3s ease 0.5s;
}

.loader--exit .loader__center {
  transform: scale(22);
  opacity: 0;
}

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

.loader--quick .loader__logo {
  opacity: 1;
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .loader__spin {
    animation: none;
  }
}

@keyframes loader-show {
  to {
    opacity: 1;
  }
}

.loader--quick {
  transition: opacity 0.25s ease;
}

.loader--fade {
  opacity: 0;
  pointer-events: none;
}

@keyframes loader-in {
  from {
    transform: rotateY(-150deg) rotateX(20deg) scale(0.7);
  }
  to {
    transform: rotateY(0deg) rotateX(0deg) scale(1);
  }
}

@keyframes loader-sway {
  from {
    rotate: y -26deg;
  }
  to {
    rotate: y 26deg;
  }
}
</style>
