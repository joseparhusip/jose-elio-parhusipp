<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { useTheme } from '@/composables/useTheme'
import { t } from '@/composables/useLang'

/* ---------------------------------------------------------
   Grafik kontribusi GitHub versi 3D: tiap hari jadi balok yang
   tingginya sesuai jumlah kontribusi, seperti miniatur kota.
   - Diputar dengan menarik (mouse/jari). Di HP hanya geser ke samping
     yang memutar, geser ke atas/bawah tetap men-scroll halaman.
   - Digambar hanya saat perlu (animasi tumbuh, diputar, ganti tema),
     bukan terus-menerus, supaya hemat baterai.
   - Arahkan kursor ke balok: tooltip tanggal (lewat event "hover").
   - Zoom: tombol + / − / reset, Ctrl + scroll (atau cubit di touchpad),
     klik dua kali, atau cubit dua jari di HP. Saat diperbesar, menarik
     menggeser tampilan (bukan memutar). Scroll biasa tetap men-scroll
     halaman, jadi halaman tidak "tersangkut" di grafik.
--------------------------------------------------------- */
const props = defineProps({
  weeks: { type: Array, required: true },
  label: { type: String, default: '' },
})
const emit = defineEmits(['hover', 'unsupported'])

const { theme } = useTheme()
const wrapEl = ref(null)
const canvasEl = ref(null)
const isDragging = ref(false)
const zoomed = ref(window.innerWidth < 640)
const zoomHint = ref(false)

const STEP = 1.25 // jarak antar balok
const SIZE = 1 // lebar balok
const MAX_HEIGHT = 7
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let renderer = null
let scene = null
let camera = null
let bars = null
let base = null
let days = [] // urutan sama dengan indeks instance
let heights = []
let tallest = 1
const dummy = new Object3D()
const tmpColor = new Color()

// Sudut kamera (diubah saat ditarik)
// HP: setahun penuh terlalu kecil di layar sempit, jadi tampilan awal
// langsung diperbesar & fokus ke bulan-bulan terbaru (ujung kanan)
const isNarrow = window.innerWidth < 640
const START_AZIMUTH = isNarrow ? -0.55 : -0.24
const START_ZOOM = isNarrow ? 2.4 : 1
let azimuth = START_AZIMUTH
let polar = 0.98
let growStart = 0
let frame = 0
let hovered = -1

// Zoom & geser (satuan ruang pandang kamera)
const MIN_ZOOM = 1
const MAX_ZOOM = 6
let zoom = START_ZOOM
let panX = START_ZOOM > 1 ? Infinity : 0 // Infinity = mentok ke kanan
let panY = 0
let zoomAnim = null // { target, nx, ny }
let fit = { cx: 0, cy: 0, halfH: 1, minX: 0, maxX: 0, minY: 0, maxY: 0 }

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

// Warna 5 tingkat, sama dengan versi 2D: color-mix(in srgb, aksen, permukaan)
function levelColors() {
  const accent = new Color(cssVar('--color-accent')).getRGB({}, SRGBColorSpace)
  const soft = new Color(cssVar('--color-surface-soft')).getRGB({}, SRGBColorSpace)
  const mix = (k) => ['r', 'g', 'b'].map((c) => soft[c] + (accent[c] - soft[c]) * k)
  return [0, 0.3, 0.55, 0.8, 1].map((k) => new Color().setRGB(...mix(k), SRGBColorSpace))
}

function buildBars() {
  if (bars) {
    scene.remove(bars)
    bars.geometry.dispose()
    bars.material.dispose()
  }
  days = []
  props.weeks.forEach((week, w) => week.forEach((day, d) => day && days.push({ ...day, w, d })))
  const max = Math.max(1, ...days.map((day) => day.count))

  const geometry = new BoxGeometry(SIZE, 1, SIZE)
  geometry.translate(0, 0.5, 0) // alas balok di y = 0
  bars = new InstancedMesh(geometry, new MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 }), days.length)
  heights = days.map((day) => (day.count ? 0.35 + Math.sqrt(day.count / max) * MAX_HEIGHT : 0.12))
  tallest = Math.max(1, ...heights)
  paintBars()
  scene.add(bars)

  // Alas tipis di bawah semua balok
  const cols = props.weeks.length
  if (base) {
    scene.remove(base)
    base.geometry.dispose()
    base.material.dispose()
  }
  base = new Mesh(
    new BoxGeometry(cols * STEP + 1, 0.3, 7 * STEP + 1),
    new MeshStandardMaterial({ color: new Color(cssVar('--color-surface')), roughness: 0.9 }),
  )
  base.position.y = -0.15
  scene.add(base)

  growStart = reduced ? -1 : performance.now()
  layoutBars(reduced ? 1 : 0)
  requestRender()
}

function paintBars() {
  const colors = levelColors()
  days.forEach((day, i) => bars.setColorAt(i, i === hovered ? tmpColor.copy(colors[4]).offsetHSL(0, 0, 0.12) : colors[day.level]))
  bars.instanceColor.needsUpdate = true
  if (base) base.material.color.set(cssVar('--color-surface'))
}

// Posisi & tinggi balok; progress 0..1 untuk animasi tumbuh (gelombang kiri ke kanan)
function layoutBars(progress) {
  const cols = props.weeks.length
  days.forEach((day, i) => {
    const delay = (day.w / cols) * 0.5
    const t = Math.min(1, Math.max(0, (progress - delay) / 0.5))
    const eased = 1 - Math.pow(1 - t, 3)
    dummy.position.set((day.w - (cols - 1) / 2) * STEP, 0, (day.d - 3) * STEP)
    dummy.scale.set(1, Math.max(0.001, heights[i] * eased), 1)
    dummy.updateMatrix()
    bars.setMatrixAt(i, dummy.matrix)
  })
  bars.instanceMatrix.needsUpdate = true
  bars.computeBoundingSphere()
}

const corners = Array.from({ length: 8 }, () => new Vector3())
let viewW = 1
let viewH = 1

// Kamera mengitari grafik, lalu zoom diatur supaya seluruh grafik selalu muat
function placeCamera() {
  const radius = 120
  camera.position.set(
    radius * Math.sin(polar) * Math.sin(azimuth),
    radius * Math.cos(polar),
    radius * Math.sin(polar) * Math.cos(azimuth),
  )
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  const halfX = (props.weeks.length * STEP) / 2 + 0.5
  const halfZ = (7 * STEP) / 2 + 0.5
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  corners.forEach((corner, i) => {
    corner.set(i & 1 ? halfX : -halfX, i & 2 ? tallest : -0.3, i & 4 ? halfZ : -halfZ)
    corner.applyMatrix4(camera.matrixWorldInverse)
    minX = Math.min(minX, corner.x)
    maxX = Math.max(maxX, corner.x)
    minY = Math.min(minY, corner.y)
    maxY = Math.max(maxY, corner.y)
  })
  const pad = 1.06
  const aspect = viewW / viewH
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  fit = { cx, cy, halfH: Math.max((maxY - minY) / 2, (maxX - minX) / 2 / aspect) * pad, minX, maxX, minY, maxY }

  // Saat diperbesar: tampilan tidak boleh digeser keluar dari grafik
  const halfH = fit.halfH / zoom
  const halfW = halfH * aspect
  const clamp = (value, center, min, max, half) =>
    max - min <= half * 2 ? 0 : Math.max(min + half - center, Math.min(max - half - center, value))
  panX = clamp(panX, cx, minX, maxX, halfW)
  panY = clamp(panY, cy, minY, maxY, halfH)

  camera.left = cx + panX - halfW
  camera.right = cx + panX + halfW
  camera.top = cy + panY + halfH
  camera.bottom = cy + panY - halfH
  camera.updateProjectionMatrix()
}

// Ubah zoom dengan titik di bawah kursor (nx, ny: -1..1) tetap di tempat
function applyZoom(next, nx = 0, ny = 0) {
  next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next))
  const aspect = viewW / viewH
  const oldHalfH = fit.halfH / zoom
  const newHalfH = fit.halfH / next
  panX += nx * (oldHalfH - newHalfH) * aspect
  panY += ny * (oldHalfH - newHalfH)
  zoom = next
  if (zoom <= 1.001) {
    zoom = 1
    panX = 0
    panY = 0
  }
  zoomed.value = zoom > 1
}

function zoomTo(target, nx = 0, ny = 0) {
  target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target))
  if (reduced) {
    applyZoom(target, nx, ny)
  } else {
    zoomAnim = { target, nx, ny }
  }
  emit('hover', null)
  requestRender()
}

function zoomBy(factor) {
  zoomTo((zoomAnim?.target ?? zoom) * factor)
}

function resetView() {
  zoomAnim = null
  applyZoom(1)
  if (START_ZOOM > 1) {
    zoom = START_ZOOM
    panX = Infinity
    zoomed.value = true
  }
  azimuth = START_AZIMUTH
  polar = 0.98
  emit('hover', null)
  requestRender()
}

// Posisi kursor dalam koordinat -1..1 (y ke atas)
function toNdc(clientX, clientY) {
  const rect = canvasEl.value.getBoundingClientRect()
  return {
    nx: ((clientX - rect.left) / rect.width) * 2 - 1,
    ny: -((clientY - rect.top) / rect.height) * 2 + 1,
  }
}

let hintTimer = 0

function onWheel(event) {
  // Scroll biasa: biarkan halaman bergulir, cukup beri petunjuk singkat
  if (!event.ctrlKey && !event.metaKey) {
    zoomHint.value = true
    clearTimeout(hintTimer)
    hintTimer = setTimeout(() => (zoomHint.value = false), 1400)
    return
  }
  event.preventDefault()
  zoomHint.value = false
  const { nx, ny } = toNdc(event.clientX, event.clientY)
  zoomAnim = null
  applyZoom(zoom * Math.exp(-event.deltaY * 0.0025), nx, ny)
  emit('hover', null)
  requestRender()
}

function onDoubleClick(event) {
  const { nx, ny } = toNdc(event.clientX, event.clientY)
  zoomTo(zoom >= MAX_ZOOM - 0.01 ? 1 : zoom * 2, nx, ny)
}

function measure() {
  const rect = wrapEl.value.getBoundingClientRect()
  viewW = Math.max(1, rect.width)
  viewH = Math.max(1, rect.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(viewW, viewH, false)
  requestRender()
}

function draw(now) {
  frame = 0
  let again = false
  if (growStart > 0) {
    const progress = Math.min(1, (now - growStart) / 1400)
    layoutBars(progress)
    if (progress < 1) again = true
    else growStart = -1
  }
  if (zoomAnim) {
    const { target, nx, ny } = zoomAnim
    const next = zoom + (target - zoom) * 0.28
    if (Math.abs(target - next) < 0.003) {
      applyZoom(target, nx, ny)
      zoomAnim = null
    } else {
      applyZoom(next, nx, ny)
      again = true
    }
  }
  placeCamera()
  renderer.render(scene, camera)
  if (again) requestRender()
}

function requestRender() {
  if (!frame && renderer) frame = requestAnimationFrame(draw)
}

/* ---- Memutar (atau menggeser saat diperbesar) dengan menarik ---- */
let drag = null
const touches = new Map() // jari yang menempel, untuk cubit dua jari
let pinch = null

function onPointerDown(event) {
  canvasEl.value.setPointerCapture(event.pointerId)
  setHover(-1)
  if (event.pointerType === 'touch') {
    touches.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (touches.size === 2) {
      const [a, b] = [...touches.values()]
      const mid = toNdc((a.x + b.x) / 2, (a.y + b.y) / 2)
      pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y) || 1, zoom, ...mid }
      drag = null
      return
    }
  }
  drag = { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, azimuth, polar }
  isDragging.value = true
}

function onPointerMove(event) {
  if (touches.has(event.pointerId)) touches.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pinch && touches.size === 2) {
    const [a, b] = [...touches.values()]
    zoomAnim = null
    applyZoom(pinch.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance), pinch.nx, pinch.ny)
    pinch.zoom = zoom
    pinch.distance = Math.hypot(a.x - b.x, a.y - b.y) || 1
    requestRender()
    return
  }
  if (drag && zoom > 1) {
    // Diperbesar: tarik untuk menggeser tampilan
    const unit = (fit.halfH / zoom) * 2 / viewH
    panX -= (event.clientX - drag.lastX) * unit
    panY += (event.clientY - drag.lastY) * unit
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    requestRender()
    return
  }
  if (drag) {
    azimuth = Math.max(-1.1, Math.min(1.1, drag.azimuth - (event.clientX - drag.x) * 0.006))
    // Di HP sentuhan vertikal dipakai untuk scroll, jadi hanya mouse yang mengubah kemiringan
    if (event.pointerType === 'mouse') {
      polar = Math.max(0.55, Math.min(1.3, drag.polar - (event.clientY - drag.y) * 0.004))
    }
    requestRender()
    return
  }
  if (event.pointerType === 'mouse') pick(event)
}

function onPointerUp(event) {
  touches.delete(event.pointerId)
  if (pinch) {
    if (touches.size < 2) pinch = null
    drag = null
    isDragging.value = false
    return
  }
  // Ketukan singkat di HP: tampilkan tooltip balok yang diketuk
  const tapped = drag && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6
  drag = null
  isDragging.value = false
  if (tapped && event.pointerType !== 'mouse') pick(event)
}

/* ---- Tooltip: balok di bawah kursor ---- */
const raycaster = new Raycaster()
const pointer = new Vector2()
const top = new Vector3()

function pick(event) {
  const rect = canvasEl.value.getBoundingClientRect()
  pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObject(bars)[0]
  setHover(hit ? hit.instanceId : -1)
  if (!hit) return emit('hover', null)
  // Tooltip di atas puncak balok
  const day = days[hit.instanceId]
  bars.getMatrixAt(hit.instanceId, dummy.matrix)
  top.setFromMatrixPosition(dummy.matrix)
  top.y += heights[hit.instanceId]
  top.project(camera)
  emit('hover', { day, x: ((top.x + 1) / 2) * rect.width, y: ((1 - top.y) / 2) * rect.height })
}

function setHover(index) {
  if (index === hovered) return
  hovered = index
  paintBars()
  requestRender()
}

function onLeave(event) {
  // Di HP tooltip tetap tampil setelah diketuk (pointerleave selalu menyusul pointerup)
  if (event.pointerType !== 'mouse') return
  if (!drag) setHover(-1)
  emit('hover', null)
}

let resizeObserver = null

onMounted(() => {
  try {
    renderer = new WebGLRenderer({ canvas: canvasEl.value, alpha: true, antialias: true })
  } catch {
    emit('unsupported')
    return
  }
  renderer.setClearColor(0x000000, 0)
  scene = new Scene()
  camera = new OrthographicCamera(-1, 1, 1, -1, 1, 400)
  scene.add(new AmbientLight(0xffffff, 1.7))
  const key = new DirectionalLight(0xffffff, 2.4)
  key.position.set(-30, 60, 40)
  scene.add(key)

  buildBars()
  measure()
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(wrapEl.value)
})

watch(() => props.weeks, () => renderer && buildBars())
// Warna mengikuti tema (tunggu atribut data-theme diterapkan)
watch(theme, () => setTimeout(() => {
  if (!renderer) return
  paintBars()
  requestRender()
}))

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(hintTimer)
  resizeObserver?.disconnect()
  if (!renderer) return
  ;[bars, base].forEach((mesh) => {
    mesh?.geometry.dispose()
    mesh?.material.dispose()
  })
  renderer.dispose()
})
</script>

<template>
  <div ref="wrapEl" class="skyline" :class="{ 'is-dragging': isDragging, 'is-zoomed': zoomed }">
    <canvas
      ref="canvasEl"
      class="skyline__canvas"
      role="img"
      :aria-label="label"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerleave="onLeave"
      @wheel="onWheel"
      @dblclick="onDoubleClick"
    ></canvas>

    <!-- Tombol zoom (pojok kanan atas) -->
    <div class="skyline__zoom" role="group" :aria-label="t({ id: 'Zoom grafik', en: 'Graph zoom' })">
      <button type="button" class="skyline__btn" :aria-label="t({ id: 'Perbesar', en: 'Zoom in' })" @click="zoomBy(1.6)">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
      </button>
      <button type="button" class="skyline__btn" :disabled="!zoomed" :aria-label="t({ id: 'Perkecil', en: 'Zoom out' })" @click="zoomBy(1 / 1.6)">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
      </button>
      <button type="button" class="skyline__btn" :aria-label="t({ id: 'Kembalikan tampilan', en: 'Reset view' })" @click="resetView">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.2 6.2A5 5 0 1 1 3 9.5M3 2.8v3.6h3.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>

    <Transition name="skyline-hint">
      <p v-if="zoomHint" class="skyline__hint" aria-hidden="true">
        {{ t({ id: 'Tahan Ctrl + scroll untuk zoom', en: 'Hold Ctrl + scroll to zoom' }) }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.skyline {
  position: relative;
  width: 100%;
  height: clamp(220px, 26vw, 320px);
}

.skyline__canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
  /* Geser vertikal tetap men-scroll halaman di HP */
  touch-action: pan-y;
}

.skyline.is-dragging .skyline__canvas {
  cursor: grabbing;
}

/* Saat diperbesar: tarik untuk menggeser grafik. Di HP geser ke samping
   menggeser grafik, geser atas/bawah tetap men-scroll halaman. */
.skyline.is-zoomed .skyline__canvas {
  cursor: move;
}


.skyline__zoom {
  position: absolute;
  top: 0.25rem;
  right: 0;
  display: inline-flex;
  gap: 4px;
  padding: 3px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-soft);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.18);
}

/* Tombol kecil bergaya 3D, senada dengan sakelar 2D/3D */
.skyline__btn {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: calc(var(--radius-sm) - 2px);
  background: var(--btn-ghost-face), var(--color-surface);
  color: var(--color-text);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 2px 0 var(--btn-ghost-edge),
    0 7px 12px -7px var(--btn-ghost-shadow);
  transform: translateY(-1px);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease;
}

.skyline__btn:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 3px 0 var(--btn-ghost-edge),
    0 9px 14px -8px var(--btn-ghost-shadow);
}

.skyline__btn:active {
  transform: translateY(1px);
  box-shadow: 0 0 0 var(--btn-ghost-edge);
}

.skyline__btn:disabled {
  opacity: 0.4;
  cursor: default;
  transform: none;
  box-shadow: 0 1px 0 var(--btn-ghost-edge);
}

.skyline__btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.skyline__hint {
  position: absolute;
  left: 50%;
  bottom: 0.75rem;
  margin: 0;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--color-text);
  color: var(--color-bg);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  white-space: nowrap;
  pointer-events: none;
  transform: translateX(-50%);
}

.skyline-hint-enter-active,
.skyline-hint-leave-active {
  transition: opacity 0.25s ease;
}

.skyline-hint-enter-from,
.skyline-hint-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .skyline {
    height: 280px;
  }

  /* HP: tombol zoom di kanan bawah supaya tidak menutupi balok terbaru */
  .skyline__zoom {
    top: auto;
    bottom: 0.25rem;
  }
}
</style>
