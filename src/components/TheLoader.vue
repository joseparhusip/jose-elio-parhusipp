<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(true)
const isExiting = ref(false)
const typingDone = ref(false)
const percent = ref(0)

onMounted(() => {
  document.body.style.overflow = 'hidden'

  // Progress % dihitung manual via rAF, disinkronkan kira-kira dengan efek ketik di CSS
  const duration = 1300
  const start = performance.now()

  function tick(now) {
    const elapsed = now - start
    const t = Math.min(elapsed / duration, 1)
    percent.value = Math.round(t * 100)
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      typingDone.value = true
    }
  }
  requestAnimationFrame(tick)

  const exitTimer = setTimeout(() => {
    isExiting.value = true
  }, 1900)

  const removeTimer = setTimeout(() => {
    isVisible.value = false
    document.body.style.overflow = ''
  }, 2650)

  return () => {
    clearTimeout(exitTimer)
    clearTimeout(removeTimer)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div v-if="isVisible" class="loader" :class="{ 'loader--exit': isExiting }" aria-hidden="true">
    <!-- Dua panel ini yang "membelah" seperti tirai saat loading selesai -->
    <div class="loader__panel loader__panel--top"></div>
    <div class="loader__panel loader__panel--bottom"></div>

    <div class="loader__content" :class="{ 'loader__content--fade': isExiting }">
      <div class="loader__type">
        <span class="loader__type-text" :class="{ 'loader__type-text--done': typingDone }">Jose</span>
        <span class="loader__dot" :class="{ 'loader__dot--show': typingDone }">.</span>
      </div>

      <div class="loader__progress">
        <span class="loader__progress-track">
          <span class="loader__progress-fill" :style="{ width: percent + '%' }"></span>
        </span>
        <span class="loader__progress-num">{{ percent }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.loader__panel {
  position: absolute;
  left: 0;
  right: 0;
  background: var(--color-primary-dark, #4f7566);
  transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
}

.loader__panel--top {
  top: 0;
  height: 51%;
}

.loader__panel--bottom {
  bottom: 0;
  height: 51%;
}

.loader--exit .loader__panel--top {
  transform: translateY(-100%);
}

.loader--exit .loader__panel--bottom {
  transform: translateY(100%);
}

.loader__content {
  position: fixed;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.4rem;
  transition: opacity 0.3s ease;
}

.loader__content--fade {
  opacity: 0;
}

.loader__type {
  display: inline-flex;
  align-items: baseline;
}

.loader__type-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  border-right: 3px solid var(--color-accent, #f2a488);
  padding-right: 4px;
  font-family: 'Stack Sans Text', sans-serif;
  font-weight: 700;
  font-size: clamp(2.8rem, 9vw, 4.6rem);
  letter-spacing: 0.01em;
  color: #f4f7f5;
  animation:
    loader-type 1.1s steps(4, end) forwards,
    loader-caret-blink 0.8s step-end infinite;
}

.loader__type-text--done {
  border-right-color: transparent;
  animation: none;
  width: 4.4ch;
}

@keyframes loader-type {
  to {
    width: 4.4ch;
  }
}

@keyframes loader-caret-blink {
  50% {
    border-color: transparent;
  }
}

.loader__dot {
  display: inline-block;
  margin-left: 2px;
  font-family: 'Stack Sans Text', sans-serif;
  font-weight: 700;
  font-size: clamp(2.8rem, 9vw, 4.6rem);
  color: var(--color-accent, #f2a488);
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.loader__dot--show {
  opacity: 1;
  transform: scale(1);
}

.loader__progress {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.loader__progress-track {
  position: relative;
  width: 96px;
  height: 2px;
  background: rgba(244, 247, 245, 0.25);
  border-radius: 999px;
  overflow: hidden;
}

.loader__progress-fill {
  position: absolute;
  inset: 0;
  width: 0;
  background: var(--color-accent, #f2a488);
  border-radius: 999px;
}

.loader__progress-num {
  min-width: 2.6ch;
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(244, 247, 245, 0.65);
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .loader__type-text {
    animation: none;
    width: 4.4ch;
    border-right-color: transparent;
  }

  .loader__dot {
    opacity: 1;
    transform: none;
  }

  .loader__panel {
    transition: none;
  }
}
</style>
