<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/* ---------------------------------------------------------
   Kursor custom gaya "jendela bidik": tanda + tipis di posisi mouse
   dikelilingi 4 siku sudut (seperti tanda potong cetak, sama dengan
   tanda sudut di kartu foto hero).
   - Diarahkan ke card / tombol / link: keempat siku meluncur dan
     MEMBINGKAI elemen itu sesuai ukurannya, dengan sedikit tarikan
     magnet ke arah mouse.
   - Elemen dengan data-cursor="Teks": bingkai + label kecil di sudut.
   - Mouse diam sebentar: keempat siku berputar pelan. Begitu mouse
     bergerak lagi, putaran mendarat halus di kelipatan 90 derajat
     terdekat (bingkainya simetris, jadi tidak terlihat melompat).
   - Kolom ketik & peta Leaflet: kursor bawaan dipakai lagi.
   Hanya aktif di perangkat dengan mouse. Kalau "kurangi animasi" aktif,
   bingkai langsung pindah tanpa meluncur. Semua posisi ditulis lewat
   style di requestAnimationFrame, jadi tidak ada re-render Vue.
--------------------------------------------------------- */
const enabled = ref(false)
const reduced = ref(false)
const crossEl = ref(null)
const frameEl = ref(null)
const spinEl = ref(null)
const label = ref('')
const state = ref('hidden') // default | snap | native | hidden
const pressed = ref(false)

// Elemen yang dibingkai saat disorot
const SNAP = [
  'a',
  'button',
  '[role="button"]',
  '[role="tab"]',
  'summary',
  'select',
  '[data-cursor]',
  '.about__tool',
  '.about__cap',
  '.hero__plate',
  '.contact__item',
  '.contact__map-card',
].join(', ')
const NATIVE = 'input, textarea, [contenteditable="true"], .leaflet-container'

const IDLE_SIZE = 26 // ukuran bingkai saat tidak menyorot apa-apa
const SNAP_PAD = 6 // jarak bingkai dari tepi elemen
const MAX_SNAP_W = 760 // elemen yang lebih besar dari ini tidak dibingkai
const MAX_SNAP_H = 640
const MAGNET = 0.08 // seberapa jauh bingkai ikut tertarik ke mouse
const IDLE_DELAY = 700 // ms mouse diam sebelum bingkai mulai berputar
const SPIN_SPEED = 1.2 // derajat per frame (kira-kira 1 putaran per 5 detik)

let mouseX = -100
let mouseY = -100
let target = null // elemen yang sedang dibingkai
// Posisi & ukuran bingkai saat ini (dihaluskan menuju tujuan)
const box = { x: -100, y: -100, w: IDLE_SIZE, h: IDLE_SIZE }
let ease = 0.22
let frame = 0
let idle = false
let idleTimer = 0
let angle = 0

function goal() {
  if (target && target.isConnected) {
    const r = target.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    return {
      x: cx + (mouseX - cx) * MAGNET,
      y: cy + (mouseY - cy) * MAGNET,
      w: r.width + SNAP_PAD * 2,
      h: r.height + SNAP_PAD * 2,
    }
  }
  return { x: mouseX, y: mouseY, w: IDLE_SIZE, h: IDLE_SIZE }
}

function loop() {
  const g = goal()
  box.x += (g.x - box.x) * ease
  box.y += (g.y - box.y) * ease
  box.w += (g.w - box.w) * ease
  box.h += (g.h - box.h) * ease

  if (crossEl.value) crossEl.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
  if (frameEl.value) {
    const s = frameEl.value.style
    s.transform = `translate3d(${box.x - box.w / 2}px, ${box.y - box.h / 2}px, 0)`
    s.width = `${box.w}px`
    s.height = `${box.h}px`
  }

  // Berputar saat diam (bukan saat membingkai card); saat bergerak lagi,
  // mendarat di kelipatan 90 derajat terdekat.
  const spinning = idle && !target
  if (spinning) {
    angle = (angle + SPIN_SPEED) % 360
  } else {
    const rest = Math.round(angle / 90) * 90
    angle += (rest - angle) * 0.2
    if (Math.abs(rest - angle) < 0.05) angle = rest % 360
  }
  if (spinEl.value) spinEl.value.style.transform = `rotate(${angle}deg)`

  // Tetap jalan selama membingkai (elemen bisa bergeser karena scroll) atau
  // berputar; berhenti kalau semuanya sudah diam.
  const settled =
    Math.abs(g.x - box.x) < 0.1 &&
    Math.abs(g.y - box.y) < 0.1 &&
    Math.abs(g.w - box.w) < 0.1 &&
    Math.abs(g.h - box.h) < 0.1 &&
    angle % 90 === 0
  frame = target || spinning || !settled ? requestAnimationFrame(loop) : 0
}

function kick() {
  if (!frame) frame = requestAnimationFrame(loop)
}

function onMove(event) {
  mouseX = event.clientX
  mouseY = event.clientY
  idle = false
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    idle = true
    kick()
  }, IDLE_DELAY)
  if (state.value === 'hidden') {
    // Masuk lagi ke jendela: lompat langsung, jangan "terbang" dari pojok
    box.x = mouseX
    box.y = mouseY
    state.value = target ? 'snap' : 'default'
  }
  kick()
}

function pickTarget(el) {
  const found = el.closest(SNAP)
  if (!found) return null
  const r = found.getBoundingClientRect()
  return r.width <= MAX_SNAP_W && r.height <= MAX_SNAP_H ? found : null
}

function updateTarget(el) {
  if (!el) return
  if (el.closest(NATIVE)) {
    target = null
    state.value = 'native'
    return
  }
  target = pickTarget(el)
  label.value = target?.getAttribute('data-cursor') || ''
  state.value = target ? 'snap' : 'default'
  kick()
}

function onOver(event) {
  updateTarget(event.target instanceof Element ? event.target : null)
}

// Scroll dengan roda mouse tanpa menggerakkan mouse tidak memicu mouseover,
// jadi elemen di bawah kursor dicek ulang di sini. Tanpa ini bingkai tetap
// menempel ke card lama yang sudah ikut bergeser.
let scrollFrame = 0
function onScroll() {
  if (state.value === 'hidden' || scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    updateTarget(document.elementFromPoint(mouseX, mouseY))
  })
}

function onLeaveWindow(event) {
  if (!event.relatedTarget) state.value = 'hidden'
}

function onDown() {
  pressed.value = true
}

function onUp() {
  pressed.value = false
}

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value) ease = 1
  enabled.value = true
  document.documentElement.classList.add('has-custom-cursor')
  window.addEventListener('mousemove', onMove, { passive: true })
  document.addEventListener('mouseover', onOver, { passive: true })
  document.addEventListener('mouseout', onLeaveWindow, { passive: true })
  window.addEventListener('mousedown', onDown, { passive: true })
  window.addEventListener('mouseup', onUp, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  clearTimeout(idleTimer)
  document.documentElement.classList.remove('has-custom-cursor')
  window.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseover', onOver)
  document.removeEventListener('mouseout', onLeaveWindow)
  window.removeEventListener('mousedown', onDown)
  window.removeEventListener('mouseup', onUp)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(scrollFrame)
})
</script>

<template>
  <div
    v-if="enabled"
    class="cursor"
    :class="[`cursor--${state}`, { 'cursor--pressed': pressed, 'cursor--reduced': reduced }]"
    aria-hidden="true"
  >
    <!-- Bingkai 4 siku: posisi & ukuran diatur dari JS -->
    <span ref="frameEl" class="cursor__frame">
      <span ref="spinEl" class="cursor__spin">
        <span class="cursor__corners">
          <span class="cursor__corner cursor__corner--tl"></span>
          <span class="cursor__corner cursor__corner--tr"></span>
          <span class="cursor__corner cursor__corner--bl"></span>
          <span class="cursor__corner cursor__corner--br"></span>
        </span>
      </span>
      <span v-if="label" class="cursor__label">{{ label }}</span>
    </span>

    <!-- Tanda + di posisi mouse -->
    <span ref="crossEl" class="cursor__cross">
      <span class="cursor__cross-shape"></span>
    </span>
  </div>
</template>

<style>
/* Sembunyikan panah bawaan hanya kalau kursor custom aktif.
   Kolom ketik & peta tetap pakai kursor bawaan (teks / geser). */
html.has-custom-cursor,
html.has-custom-cursor * {
  cursor: none !important;
}

html.has-custom-cursor :is(input, textarea, [contenteditable='true']) {
  cursor: text !important;
}

html.has-custom-cursor .leaflet-container,
html.has-custom-cursor .leaflet-container * {
  cursor: grab !important;
}
</style>

<style scoped>
.cursor {
  --ink: var(--color-text);
  --corner: 7px;
  --stroke: 1.5px;
  position: fixed;
  inset: 0;
  z-index: 10000; /* di atas grain (9999) */
  pointer-events: none;
}

/* ---- Tanda + ---- */
.cursor__cross {
  position: fixed;
  top: 0;
  left: 0;
  will-change: transform;
}

.cursor__cross-shape {
  position: absolute;
  left: -6px;
  top: -6px;
  width: 12px;
  height: 12px;
  background:
    linear-gradient(var(--ink), var(--ink)) center / var(--stroke) 100% no-repeat,
    linear-gradient(var(--ink), var(--ink)) center / 100% var(--stroke) no-repeat;
  transition: transform 0.25s var(--ease-out), opacity 0.2s ease;
}

/* Saat membingkai, tanda + mengecil supaya card-nya yang menonjol */
.cursor--snap .cursor__cross-shape {
  transform: scale(0.6) rotate(45deg);
  opacity: 0.7;
}

/* ---- Bingkai ---- */
.cursor__frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 26px;
  height: 26px;
  will-change: transform, width, height;
}

/* Pembungkus untuk rotasi (diatur dari JS), terpisah dari skala saat diklik */
.cursor__spin {
  position: absolute;
  inset: 0;
}

.cursor__corners {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  transition: opacity 0.25s ease, transform 0.2s ease;
}

.cursor--snap .cursor__corners {
  --corner: 12px;
  opacity: 1;
}

.cursor--pressed .cursor__corners {
  transform: scale(0.96);
}

.cursor__corner {
  position: absolute;
  width: var(--corner);
  height: var(--corner);
  border: 0 solid var(--ink);
  transition: width 0.3s var(--ease-out), height 0.3s var(--ease-out);
}

.cursor__corner--tl {
  top: 0;
  left: 0;
  border-top-width: var(--stroke);
  border-left-width: var(--stroke);
}

.cursor__corner--tr {
  top: 0;
  right: 0;
  border-top-width: var(--stroke);
  border-right-width: var(--stroke);
}

.cursor__corner--bl {
  bottom: 0;
  left: 0;
  border-bottom-width: var(--stroke);
  border-left-width: var(--stroke);
}

.cursor__corner--br {
  right: 0;
  bottom: 0;
  border-bottom-width: var(--stroke);
  border-right-width: var(--stroke);
}

/* Label kecil di atas sudut kiri bingkai ("LIHAT") */
.cursor__label {
  position: absolute;
  left: 0;
  bottom: calc(100% + 6px);
  padding: 3px 7px;
  border-radius: 3px;
  background: var(--ink);
  color: var(--color-bg);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.5);
}

/* Kurangi animasi: tanpa transisi */
.cursor--reduced .cursor__cross-shape,
.cursor--reduced .cursor__corners,
.cursor--reduced .cursor__corner {
  transition: none;
}

/* Kolom ketik / peta / di luar jendela: kursor custom disembunyikan */
.cursor--native .cursor__frame,
.cursor--native .cursor__cross,
.cursor--hidden .cursor__frame,
.cursor--hidden .cursor__cross {
  opacity: 0;
}
</style>
