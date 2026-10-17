<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/* Bar tipis di atas layar yang memanjang sesuai seberapa jauh halaman di-scroll.
   Nilai ditulis ke CSS variable, jadi tidak memicu render ulang Vue. */
const barEl = ref(null)
let frame = 0

function update() {
  frame = 0
  const max = document.documentElement.scrollHeight - window.innerHeight
  const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
  barEl.value?.style.setProperty('--scroll-progress', progress.toFixed(4))
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div ref="barEl" class="scroll-progress" aria-hidden="true"></div>
</template>
