<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
const canvasEl = ref(null)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const compact = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches
const FRAME_MS = compact ? 1000 / 30 : 0

let ctx = null
let sprite = null
let flakes = []
let width = 0
let height = 0
let frame = 0
let last = 0
let lastDraw = 0
let time = 0

function makeSprite() {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const c = canvas.getContext('2d')
  const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  if (theme.value === 'light') {
    g.addColorStop(0, 'rgba(255, 255, 255, 1)')
    g.addColorStop(0.45, 'rgba(255, 255, 255, 0.95)')
    g.addColorStop(0.62, 'rgba(150, 172, 198, 0.55)')
    g.addColorStop(1, 'rgba(150, 172, 198, 0)')
  } else {
    g.addColorStop(0, 'rgba(255, 255, 255, 1)')
    g.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)')
    g.addColorStop(1, 'rgba(255, 255, 255, 0)')
  }
  c.fillStyle = g
  c.fillRect(0, 0, size, size)
  sprite = canvas
}

function makeFlake(randomY) {
  const size = 3 + Math.random() ** 1.6 * 7
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -12 - Math.random() * 40,
    size,
    speed: (0.35 + size * 0.09) * (reduced ? 0.55 : 1),
    phase: Math.random() * Math.PI * 2,
    sway: 0.3 + Math.random() * 0.9,
    alpha: 0.45 + Math.random() * 0.5,
  }
}

function resize() {
  const dpr = compact ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
  width = window.innerWidth
  height = window.innerHeight
  canvasEl.value.width = Math.round(width * dpr)
  canvasEl.value.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const density = compact ? 9000 : 15000
  const target = Math.round(Math.min(90, Math.max(30, (width * height) / density)) * (reduced ? 0.6 : 1))
  while (flakes.length < target) flakes.push(makeFlake(true))
  flakes.length = target
}

function draw(now) {
  frame = requestAnimationFrame(draw)
  if (FRAME_MS && now - lastDraw < FRAME_MS - 1) return
  lastDraw = now
  const dt = Math.min(now - last, 66) / 16.67
  last = now
  time += dt * 0.012
  const wind = Math.sin(time * 0.7) * 0.35 + Math.sin(time * 1.9) * 0.15
  ctx.clearRect(0, 0, width, height)
  for (const flake of flakes) {
    flake.y += flake.speed * dt
    flake.x += (wind + Math.sin(time * 2 + flake.phase) * flake.sway * 0.35) * dt
    if (flake.y > height + 12) Object.assign(flake, makeFlake(false))
    if (flake.x > width + 12) flake.x = -12
    if (flake.x < -12) flake.x = width + 12
    ctx.globalAlpha = flake.alpha
    ctx.drawImage(sprite, flake.x - flake.size / 2, flake.y - flake.size / 2, flake.size, flake.size)
  }
  ctx.globalAlpha = 1
}

function start() {
  if (frame) return
  last = performance.now()
  lastDraw = 0
  frame = requestAnimationFrame(draw)
}

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}

watch(theme, () => setTimeout(makeSprite))

onMounted(() => {
  ctx = canvasEl.value.getContext('2d')
  makeSprite()
  resize()
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  start()
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <canvas ref="canvasEl" class="snow" aria-hidden="true"></canvas>
</template>

<style scoped>
.snow {
  position: fixed;
  inset: 0;
  z-index: 150;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
