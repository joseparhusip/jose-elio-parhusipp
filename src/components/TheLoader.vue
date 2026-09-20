<script setup>
import { ref, onMounted } from 'vue'
import { loaderDone } from '@/composables/useLoaderState'

const isVisible = ref(true)
const isExiting = ref(false)

onMounted(() => {
  document.body.style.overflow = 'hidden'

  const exitTimer = setTimeout(() => {
    isExiting.value = true
  }, 1900)

  const removeTimer = setTimeout(() => {
    isVisible.value = false
    document.body.style.overflow = ''
    loaderDone.value = true
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
      <div class="loader__flip">
        <div class="loader__flip-card">
          <div class="loader__flip-face loader__flip-face--front">
            <img src="/logo-navbar-sebelum-scroll.png" alt="Jose Elio Parhusip" class="loader__logo-img" draggable="false" />
          </div>
          <div class="loader__flip-face loader__flip-face--back">
            <img src="/logo-navbar-sebelum-scroll.png" alt="Jose Elio Parhusip" class="loader__logo-img" draggable="false" />
          </div>
        </div>
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
  background: #f1f4f1;
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

/* Panggung 3D tempat kartu logo berputar */
.loader__flip {
  perspective: 900px;
  width: clamp(120px, 20vw, 180px);
  height: clamp(120px, 20vw, 180px);
}

/* Kartu yang diputar terus-menerus sepanjang sumbu Y (efek flip depan-belakang) */
.loader__flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: loader-flip 3.6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

/* Sisi depan & belakang kartu, masing-masing menampilkan logo yang sama.
   Sisi belakang diputar 180deg lebih dulu supaya saat kartu berputar,
   yang terlihat gantian adalah "depan" lalu "belakang" logo, bukan layar kosong. */
.loader__flip-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.loader__flip-face--front {
  transform: rotateY(0deg);
}

.loader__flip-face--back {
  transform: rotateY(180deg);
}

.loader__logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

/* Flip bolak-balik: diam di depan (0deg) -> pelan-pelan buka ke belakang (180deg)
   -> diam sejenak -> pelan-pelan balik lagi ke depan (0deg) -> diam -> ulang terus.
   Bukan muter 360 satu arah terus-terusan, tapi kayak kartu dibolak-balik. */
@keyframes loader-flip {
  0%,
  22% {
    transform: rotateY(0deg);
  }
  50%,
  72% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .loader__panel {
    transition: none;
  }
}
</style>
