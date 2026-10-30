<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/* ---------------------------------------------------------
   Kursor custom berbentuk segitiga garis tipis dengan segitiga kecil
   terbalik di tengahnya (bukan kotak, bukan lingkaran), berpusat di
   posisi mouse.
   - Diarahkan ke card / tombol / link: segitiga jadi penuh, dan sebuah
     garis pendek muncul di tengah tepi bawah elemen itu (lebarnya
     sekitar sepertiga elemen, maksimal LINE_MAX px), sedikit tertarik
     ke arah mouse.
   - Elemen dengan data-cursor="Teks": garis + label kecil di atasnya.
   - Segitiga berputar pelan terus-menerus: saat diam, saat digeser,
     dan saat menyorot card.
   - Kolom ketik & peta Leaflet: kursor bawaan dipakai lagi.
   Hanya aktif di perangkat dengan mouse. Kalau "kurangi animasi" aktif,
   garis langsung pindah tanpa meluncur. Semua posisi ditulis lewat
   style di requestAnimationFrame, jadi tidak ada re-render Vue.
--------------------------------------------------------- */
const enabled = ref(false)
const reduced = ref(false)
const markEl = ref(null)
const frameEl = ref(null)
const spinEl = ref(null)
const label = ref('')
const state = ref('hidden') // default | snap | native | hidden
const pressed = ref(false)

// Elemen yang diberi garis bawah saat disorot
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
  '.contact__item',
  '.contact__map-card',
].join(', ')
const NATIVE = 'input, textarea, [contenteditable="true"], .leaflet-container'

// Saat tidak menyorot apa-apa garisnya selebar 0 (tersembunyi di mouse)
const SNAP_PAD = 6 // jarak garis dari tepi elemen
const MAX_SNAP_W = 760 // elemen yang lebih besar dari ini diabaikan
const MAX_SNAP_H = 640
const MAGNET = 0.08 // seberapa jauh garis ikut tertarik ke mouse
const LINE_MIN = 18 // lebar garis bawah, px
const LINE_MAX = 44
const SPIN_SPEED = 1.2 // derajat per frame (kira-kira 1 putaran per 5 detik)

let mouseX = -100
let mouseY = -100
let target = null // elemen yang sedang disorot
// Posisi & ukuran area garis saat ini (dihaluskan menuju tujuan)
const box = { x: -100, y: -100, w: 0, h: 0 }
let ease = 0.22
let frame = 0
let angle = 0

function goal() {
  if (target && target.isConnected) {
    const r = target.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    return {
      x: cx + (mouseX - cx) * MAGNET,
      y: cy + (mouseY - cy) * MAGNET,
      w: Math.min(LINE_MAX, Math.max(LINE_MIN, r.width / 3)),
      h: r.height + SNAP_PAD * 2,
    }
  }
  return { x: mouseX, y: mouseY, w: 0, h: 0 }
}

function loop() {
  const g = goal()
  box.x += (g.x - box.x) * ease
  box.y += (g.y - box.y) * ease
  box.w += (g.w - box.w) * ease
  box.h += (g.h - box.h) * ease

  if (markEl.value) markEl.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
  if (frameEl.value) {
    const s = frameEl.value.style
    s.transform = `translate3d(${box.x - box.w / 2}px, ${box.y - box.h / 2}px, 0)`
    s.width = `${box.w}px`
    s.height = `${box.h}px`
  }

  // Segitiga selalu berputar, jadi loop terus jalan selama kursor terlihat.
  // Berhenti hanya kalau mouse keluar jendela; gerakan berikutnya
  // menyalakannya lagi lewat kick().
  angle = (angle + SPIN_SPEED) % 360
  if (spinEl.value) spinEl.value.style.transform = `rotate(${angle}deg)`

  frame = state.value === 'hidden' ? 0 : requestAnimationFrame(loop)
}

function kick() {
  if (!frame) frame = requestAnimationFrame(loop)
}

function onMove(event) {
  mouseX = event.clientX
  mouseY = event.clientY
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
// jadi elemen di bawah kursor dicek ulang di sini. Tanpa ini garis tetap
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
    <!-- Garis bawah elemen yang disorot: posisi & ukuran diatur dari JS -->
    <span ref="frameEl" class="cursor__frame">
      <span class="cursor__line"></span>
      <span v-if="label" class="cursor__label">{{ label }}</span>
    </span>

    <!-- Segitiga di posisi mouse -->
    <span ref="markEl" class="cursor__mark">
      <span ref="spinEl" class="cursor__spin">
        <svg class="cursor__tri" viewBox="0 0 24 24">
          <!-- Titik berat kedua segitiga tepat di tengah (12, 12).
               Lapisan "halo" berwarna latar di belakang garis supaya
               segitiga tetap terbaca di atas tombol biru / gambar terang. -->
          <polygon class="cursor__halo" points="12,2.5 20.23,16.75 3.77,16.75" />
          <polygon class="cursor__edge" points="12,2.5 20.23,16.75 3.77,16.75" />
          <!-- Segitiga kecil terbalik di tengah, seperti tanda delta -->
          <polygon class="cursor__core" points="12,14.9 9.49,10.55 14.51,10.55" />
        </svg>
      </span>
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
  --halo: var(--color-bg);
  position: fixed;
  inset: 0;
  z-index: 10000; /* di atas grain (9999) */
  pointer-events: none;
}

/* ---- Segitiga ---- */
.cursor__mark {
  position: fixed;
  top: 0;
  left: 0;
  will-change: transform;
}

.cursor__spin {
  position: absolute;
  left: -13px;
  top: -13px;
  width: 26px;
  height: 26px;
}

.cursor__tri {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  transition: transform 0.3s var(--ease-out);
}

.cursor__tri polygon {
  stroke-linejoin: round;
  transition: fill 0.2s ease, opacity 0.2s ease, transform 0.3s var(--ease-out);
  transform-origin: 12px 12px;
}

.cursor__halo {
  fill: none;
  stroke: var(--halo);
  stroke-width: 3.8;
  opacity: 0.85;
}

.cursor__edge {
  fill: transparent;
  stroke: var(--ink);
  stroke-width: 1.4;
}

.cursor__core {
  fill: var(--ink);
  stroke: var(--ink);
  stroke-width: 0.8;
}

/* Saat menyorot: segitiga luar jadi penuh, delta kecilnya melebur ke dalam;
   garis bawah elemen yang jadi fokus */
.cursor--snap .cursor__tri {
  transform: scale(0.72);
}

.cursor--snap .cursor__edge {
  fill: var(--ink);
}

.cursor--snap .cursor__core {
  opacity: 0;
  transform: scale(0.2);
}

.cursor--pressed .cursor__tri {
  transform: scale(0.82);
}

.cursor--snap.cursor--pressed .cursor__tri {
  transform: scale(0.6);
}

/* ---- Garis bawah ---- */
.cursor__frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  will-change: transform, width, height;
}

.cursor__line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--ink);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--halo) 55%, transparent);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.cursor--snap .cursor__line {
  opacity: 1;
}

/* Label kecil di atas garis, di tengah ("LIHAT") */
.cursor__label {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
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
.cursor--reduced .cursor__tri,
.cursor--reduced .cursor__tri polygon,
.cursor--reduced .cursor__line {
  transition: none;
}

/* Kolom ketik / peta / di luar jendela: kursor custom disembunyikan */
.cursor--native .cursor__frame,
.cursor--native .cursor__mark,
.cursor--hidden .cursor__frame,
.cursor--hidden .cursor__mark {
  opacity: 0;
}
</style>
