<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Quaternion,
  RingGeometry,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
  WebGLRenderer,
} from 'three'
import { useTheme } from '@/composables/useTheme'

const props = defineProps({
  places: { type: Array, required: true },
})
const emit = defineEmits(['unsupported'])

const { theme } = useTheme()
const wrapEl = ref(null)
const canvasEl = ref(null)
const labels = ref([])

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const DEG = Math.PI / 180

let renderer = null
let scene = null
let camera = null
let globe = null
let dotsMaterial = null
let shellMaterial = null
let gridMaterial = null
let glowMaterial = null
let glowTexture = null
let pins = []
let baseQuat = null
let frame = 0
let visible = false
let observer = null
let resizeObserver = null
let drag = null
let yaw = 0
let pitch = 0
let yawVel = 0
let start = 0
let orbit = null

function toVector(lat, lng, r = 1) {
  const phi = lat * DEG
  const lambda = lng * DEG
  return new Vector3(r * Math.cos(phi) * Math.sin(lambda), r * Math.sin(phi), r * Math.cos(phi) * Math.cos(lambda))
}

function palette() {
  const dark = theme.value !== 'light'
  return {
    shell: dark ? '#14171B' : '#E7EAEE',
    dots: dark ? '#8A96A6' : '#7C8794',
    grid: dark ? '#2A3038' : '#C9CFD6',
    glow: dark ? 0.55 : 0.35,
  }
}

function applyTheme() {
  if (!shellMaterial) return
  const p = palette()
  shellMaterial.color = new Color(p.shell)
  dotsMaterial.color = new Color(p.dots)
  gridMaterial.color = new Color(p.grid)
  glowMaterial.opacity = p.glow
}

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 60, 128, 128, 128)
  g.addColorStop(0, 'rgba(31,127,224,0.55)')
  g.addColorStop(0.55, 'rgba(31,127,224,0.18)')
  g.addColorStop(1, 'rgba(31,127,224,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return new CanvasTexture(c)
}

function build() {
  scene = new Scene()
  camera = new PerspectiveCamera(32, 1, 0.1, 20)
  camera.position.set(0, 0, 4.1)

  glowTexture = makeGlowTexture()
  glowMaterial = new SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false, blending: AdditiveBlending })
  const glow = new Sprite(glowMaterial)
  glow.scale.set(3.1, 3.1, 1)
  scene.add(glow)

  globe = new Group()
  scene.add(globe)

  shellMaterial = new MeshBasicMaterial({ color: '#14171B' })
  globe.add(new Mesh(new SphereGeometry(0.995, 48, 32), shellMaterial))

  const count = 2600
  const positions = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const a = golden * i
    positions.push(Math.cos(a) * r, y, Math.sin(a) * r)
  }
  const dotGeometry = new BufferGeometry()
  dotGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  dotsMaterial = new PointsMaterial({ size: 0.021, sizeAttenuation: true })
  globe.add(new Points(dotGeometry, dotsMaterial))

  gridMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.9 })
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = []
    for (let lng = 0; lng < 360; lng += 4) pts.push(toVector(lat, lng, 1.002))
    globe.add(new LineLoop(new BufferGeometry().setFromPoints(pts), gridMaterial))
  }
  for (let lng = 0; lng < 180; lng += 30) {
    const pts = []
    for (let lat = 0; lat < 360; lat += 4) {
      const v = toVector(0, 0, 1.002)
      v.set(Math.cos(lat * DEG) * Math.sin(lng * DEG), Math.sin(lat * DEG), Math.cos(lat * DEG) * Math.cos(lng * DEG))
      v.multiplyScalar(1.002)
      pts.push(v)
    }
    globe.add(new LineLoop(new BufferGeometry().setFromPoints(pts), gridMaterial))
  }

  const pinMaterial = new MeshBasicMaterial({ color: '#1F7FE0' })
  pins = props.places.map((place, index) => {
    const pos = toVector(place.lat, place.lng, 1.01)
    const head = new Mesh(new SphereGeometry(index === 0 ? 0.022 : 0.018, 16, 12), pinMaterial)
    head.position.copy(pos)
    const ringMaterial = new MeshBasicMaterial({ color: '#6CB6FF', transparent: true, side: DoubleSide, depthWrite: false })
    const ring = new Mesh(new RingGeometry(0.03, 0.038, 40), ringMaterial)
    ring.position.copy(pos)
    ring.lookAt(pos.clone().multiplyScalar(2))
    globe.add(head, ring)
    return { pos, ring, ringMaterial, phase: index * 0.5 }
  })

  orbit = new Group()
  const orbitMaterial = new MeshBasicMaterial({ color: '#1F7FE0', transparent: true, opacity: 0.45 })
  orbit.add(new Mesh(new TorusGeometry(1.32, 0.0035, 6, 160), orbitMaterial))
  const sat = new Mesh(new SphereGeometry(0.03, 16, 12), new MeshBasicMaterial({ color: '#6CB6FF' }))
  sat.position.set(1.32, 0, 0)
  orbit.add(sat)
  orbit.rotation.set(1.15, 0.35, 0)
  scene.add(orbit)

  const center = toVector(-6.55, 107.3)
  baseQuat = new Quaternion().setFromUnitVectors(center.normalize(), new Vector3(0, 0, 1))
  const tilt = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 14 * DEG)
  baseQuat.premultiply(tilt)
  globe.quaternion.copy(baseQuat)
  applyTheme()
}

function resize() {
  if (!renderer || !wrapEl.value) return
  const { clientWidth: w, clientHeight: h } = wrapEl.value
  if (!w || !h) return
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderOnce()
}

const tmp = new Vector3()
const yawAxis = new Vector3(0, 1, 0)
const pitchAxis = new Vector3(1, 0, 0)
const qYaw = new Quaternion()
const qPitch = new Quaternion()

function renderOnce(time = 0) {
  if (!renderer) return
  const t = (time - start) / 1000
  if (!drag) {
    yawVel *= 0.94
    yaw += yawVel
    yaw += (Math.sin(t * 0.35) * 0.22 - yaw) * (reduced ? 0 : 0.012)
    pitch += (0 - pitch) * 0.05
  }
  qYaw.setFromAxisAngle(yawAxis, yaw)
  qPitch.setFromAxisAngle(pitchAxis, pitch)
  globe.quaternion.copy(baseQuat).premultiply(qYaw).premultiply(qPitch)

  for (const pin of pins) {
    const k = ((t * 0.7 + pin.phase) % 1 + 1) % 1
    const s = 1 + k * 2.6
    pin.ring.scale.set(s, s, s)
    pin.ringMaterial.opacity = reduced ? 0.6 : 0.85 * (1 - k)
  }

  if (orbit && !reduced) orbit.rotation.z = t * 0.35
  renderer.render(scene, camera)

  if (wrapEl.value) {
    const w = wrapEl.value.clientWidth
    const h = wrapEl.value.clientHeight
    labels.value = pins.map((pin, index) => {
      tmp.copy(pin.pos).applyQuaternion(globe.quaternion)
      const front = tmp.z > 0.15
      tmp.project(camera)
      return {
        name: props.places[index].name,
        x: (tmp.x * 0.5 + 0.5) * w,
        y: (-tmp.y * 0.5 + 0.5) * h,
        show: front,
        side: index === 0 ? 'left' : 'right',
      }
    })
  }
}

function loop(time) {
  frame = 0
  if (!visible) return
  renderOnce(time)
  if (!reduced || drag) frame = requestAnimationFrame(loop)
}

function play() {
  if (!frame && visible) frame = requestAnimationFrame(loop)
}

function onPointerDown(event) {
  drag = { x: event.clientX, y: event.clientY, yaw, pitch }
  event.currentTarget.setPointerCapture?.(event.pointerId)
  play()
}

function onPointerMove(event) {
  if (!drag) return
  const dx = event.clientX - drag.x
  const dy = event.clientY - drag.y
  const next = drag.yaw + dx * 0.008
  yawVel = next - yaw
  yaw = next
  pitch = Math.max(-0.5, Math.min(0.5, drag.pitch + dy * 0.006))
}

function onPointerUp() {
  drag = null
  play()
}

onMounted(() => {
  try {
    renderer = new WebGLRenderer({ canvas: canvasEl.value, antialias: true, alpha: true, powerPreference: 'low-power' })
  } catch {
    emit('unsupported')
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  build()
  start = performance.now()
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(wrapEl.value)
  observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting
    if (visible) play()
  })
  observer.observe(wrapEl.value)
})

watch(theme, () => {
  applyTheme()
  renderOnce(performance.now())
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  resizeObserver?.disconnect()
  scene?.traverse((obj) => {
    obj.geometry?.dispose()
    obj.material?.dispose()
  })
  glowTexture?.dispose()
  renderer?.dispose()
  renderer = null
})
</script>

<template>
  <div
    ref="wrapEl"
    class="globe"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <canvas ref="canvasEl" class="globe__canvas" aria-hidden="true"></canvas>
    <span
      v-for="label in labels"
      :key="label.name"
      class="globe__label mono-meta"
      :class="[`globe__label--${label.side}`, { 'is-hidden': !label.show }]"
      :style="{ left: `${label.x}px`, top: `${label.y}px` }"
      aria-hidden="true"
    >
      {{ label.name }}
    </span>
  </div>
</template>

<style scoped>
.globe {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 260px;
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;
  background:
    radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 60%),
    var(--color-surface);
}

.globe:active {
  cursor: grabbing;
}

.globe__canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.globe__label {
  position: absolute;
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  color: var(--color-text);
  font-size: 0.62rem;
  white-space: nowrap;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.globe__label--left {
  transform: translate(calc(-100% - 12px), -150%);
}

.globe__label--right {
  transform: translate(12px, 30%);
}

.globe__label.is-hidden {
  opacity: 0;
}
</style>
