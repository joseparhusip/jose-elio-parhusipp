<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  AmbientLight,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { useTheme } from '@/composables/useTheme'
import { t } from '@/composables/useLang'

const props = defineProps({
  variant: { type: String, default: 'hero' },
})

const GRAVITY = 4200
const SOFT_LIMIT = props.variant === 'hero' ? 1.1 : 0.7
const HARD_LIMIT = props.variant === 'hero' ? 1.35 : 0.95
const MAX_CORRECTION = 0.12

function clampCorrection(value) {
  return Math.max(-MAX_CORRECTION, Math.min(MAX_CORRECTION, value))
}

function keepInRange(item) {
  if (!Number.isFinite(item.angle) || !Number.isFinite(item.velocity)) {
    item.angle = 0
    item.velocity = 0
  }
  if (Math.abs(item.angle) > HARD_LIMIT) {
    item.angle = Math.sign(item.angle) * HARD_LIMIT
    if (Math.sign(item.velocity) === Math.sign(item.angle)) item.velocity *= -0.4
  }
}
const LAYOUTS = {
  hero: {
    height: 240,
    width: 300,
    padLeft: 230,
    padRight: 60,
    items: [
      { x: 52, length: 64, radius: 21, base: '#d9a93a', band: '#fff4d6', pattern: 'glitter', metal: 0.85 },
      { x: 150, length: 112, radius: 33, base: '#c8202f', band: '#e8b84a', pattern: 'band', metal: 0.45 },
      { x: 248, length: 46, radius: 25, base: '#1f7fe0', band: '#ffffff', pattern: 'snow', metal: 0.5 },
    ],
  },
  tablet: {
    height: 130,
    width: 230,
    padLeft: 150,
    padRight: 40,
    items: [
      { x: 40, length: 26, radius: 15, base: '#d9a93a', band: '#fff4d6', pattern: 'glitter', metal: 0.85 },
      { x: 115, length: 44, radius: 23, base: '#c8202f', band: '#e8b84a', pattern: 'band', metal: 0.45 },
      { x: 190, length: 18, radius: 18, base: '#1f7fe0', band: '#ffffff', pattern: 'snow', metal: 0.5 },
    ],
  },
  compact: {
    height: 120,
    width: null,
    items: [
      { fromLeft: 34, length: 30, radius: 18, base: '#c8202f', band: '#e8b84a', pattern: 'band', metal: 0.45 },
      { fromLeft: 76, length: 52, radius: 12, base: '#d9a93a', band: '#fff4d6', pattern: 'glitter', metal: 0.85 },
      { fromRight: 70, length: 22, radius: 13, base: '#d9a93a', band: '#fff4d6', pattern: 'glitter', metal: 0.85 },
      { fromRight: 32, length: 44, radius: 17, base: '#1f7fe0', band: '#ffffff', pattern: 'snow', metal: 0.5 },
    ],
  },
}
const layout = LAYOUTS[props.variant] || LAYOUTS.hero
const HEIGHT = layout.height
const PAD_LEFT = layout.padLeft || 0
const PAD_RIGHT = layout.padRight || 0

const { theme } = useTheme()
const wrapEl = ref(null)
const canvasEl = ref(null)
const hitEls = ref([])
const dragging = ref(-1)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let width = layout.width ? layout.width + PAD_LEFT + PAD_RIGHT : 300
let renderer = null
let scene = null
let camera = null
let stringMaterial = null
let envTarget = null
let frame = 0
let last = 0
let time = 0
let observer = null
let resizeObserver = null
const textures = []
const state = layout.items.map((item, i) => ({
  ...item,
  baseX: item.x ?? 0,
  x: (item.x ?? 0) + PAD_LEFT,
  angle: reduced ? 0 : (i % 2 ? -1 : 1) * (0.28 + i * 0.06),
  velocity: 0,
  spin: Math.random() * Math.PI * 2,
  spinVelocity: 0,
  target: 0,
  group: null,
  ball: null,
  reach: 0,
}))

function paintTexture(item) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = item.base
  ctx.fillRect(0, 0, 512, 256)
  if (item.pattern === 'band') {
    ctx.fillStyle = item.band
    ctx.fillRect(0, 112, 512, 32)
    ctx.fillStyle = '#fff6e0'
    for (let x = 16; x < 512; x += 32) {
      ctx.beginPath()
      ctx.arc(x, 128, 5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = item.band
    ctx.fillRect(0, 84, 512, 5)
    ctx.fillRect(0, 167, 512, 5)
  } else if (item.pattern === 'snow') {
    ctx.strokeStyle = item.band
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    for (let i = 0; i < 9; i++) {
      const cx = 28 + i * 57
      const cy = i % 2 ? 92 : 164
      for (let k = 0; k < 3; k++) {
        const a = (k * Math.PI) / 3
        ctx.beginPath()
        ctx.moveTo(cx - Math.cos(a) * 13, cy - Math.sin(a) * 13)
        ctx.lineTo(cx + Math.cos(a) * 13, cy + Math.sin(a) * 13)
        ctx.stroke()
      }
    }
  } else {
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255, 248, 225, ${0.15 + Math.random() * 0.5})`
      ctx.fillRect(Math.random() * 512, Math.random() * 256, 2, 2)
    }
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  textures.push(texture)
  return texture
}

function stringColor() {
  return new Color(getComputedStyle(document.documentElement).getPropertyValue('--color-text-soft').trim() || '#9aa0a8')
}

function placeItems() {
  for (const item of state) {
    if (item.x == null || item.baseX != null) item.x = item.baseX + PAD_LEFT
    if (item.fromLeft != null) item.x = item.fromLeft
    if (item.fromRight != null) item.x = width - item.fromRight
    item.group?.position.set(item.x, 0, 0)
  }
}

function measure() {
  if (!layout.width) width = Math.max(1, Math.round(wrapEl.value.clientWidth))
  placeItems()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, HEIGHT, false)
  camera.aspect = width / HEIGHT
  const distance = HEIGHT / 2 / Math.tan((camera.fov * Math.PI) / 360)
  camera.position.set(width / 2, -HEIGHT / 2, distance)
  camera.lookAt(width / 2, -HEIGHT / 2, 0)
  camera.updateProjectionMatrix()
  render()
}

function buildScene() {
  renderer = new WebGLRenderer({ canvas: canvasEl.value, alpha: true, antialias: true })
  renderer.setClearColor(0x000000, 0)
  scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envTarget.texture
  pmrem.dispose()

  camera = new PerspectiveCamera(30, 1, 1, 3000)
  scene.add(new AmbientLight(0xffffff, 0.6))
  const key = new DirectionalLight(0xffffff, 2.2)
  key.position.set(-120, 200, 300)
  scene.add(key)

  stringMaterial = new MeshStandardMaterial({ color: stringColor(), roughness: 0.8 })
  const capMaterial = new MeshStandardMaterial({ color: '#d8b25a', metalness: 1, roughness: 0.28 })

  for (const item of state) {
    const group = new Group()
    const capHeight = item.radius * 0.34
    const string = new Mesh(new CylinderGeometry(0.7, 0.7, item.length, 6), stringMaterial)
    string.position.y = -item.length / 2
    const loop = new Mesh(new TorusGeometry(item.radius * 0.13, 1.3, 8, 20), capMaterial)
    loop.position.y = -item.length - item.radius * 0.08
    const cap = new Mesh(new CylinderGeometry(item.radius * 0.26, item.radius * 0.31, capHeight, 24), capMaterial)
    cap.position.y = -item.length - item.radius * 0.18 - capHeight / 2
    const ball = new Mesh(
      new SphereGeometry(item.radius, 40, 28),
      new MeshStandardMaterial({ map: paintTexture(item), metalness: item.metal, roughness: 0.2 }),
    )
    item.reach = item.length + item.radius * 0.18 + capHeight + item.radius * 0.92
    ball.position.y = -item.reach
    group.add(string, loop, cap, ball)
    scene.add(group)
    item.group = group
    item.ball = ball
  }
}

function step(dt) {
  time += dt
  state.forEach((item, i) => {
    if (dragging.value === i) {
      const target = Math.max(-HARD_LIMIT, Math.min(HARD_LIMIT, item.target))
      const next = item.angle + (target - item.angle) * Math.min(1, dt * 40)
      item.velocity = (next - item.angle) / dt
      item.angle = next
    } else {
      const wind = reduced ? 0 : Math.sin(time * 0.8 + i * 1.7) * 0.25
      let force = -(GRAVITY / item.reach) * Math.sin(item.angle) + wind
      const beyond = Math.abs(item.angle) - SOFT_LIMIT
      if (beyond > 0) force -= Math.sign(item.angle) * beyond * 260
      item.velocity += force * dt
      item.velocity *= Math.pow(0.7, dt)
      item.velocity = Math.max(-14, Math.min(14, item.velocity))
      item.angle += item.velocity * dt
    }
    keepInRange(item)
    item.spinVelocity *= Math.pow(0.4, dt)
    item.spin += ((reduced ? 0 : 0.35) + item.spinVelocity) * dt
  })
  for (let pass = 0; pass < 4; pass++) {
    collide()
    collideStrings()
  }
  state.forEach(keepInRange)
}

function collideStrings() {
  state.forEach((ball, i) => {
    if (dragging.value === i) return
    const c = ballCenter(ball)
    state.forEach((rope, j) => {
      if (i === j) return
      const ax = rope.x
      const ay = 0
      const bx = rope.x + Math.sin(rope.angle) * rope.length
      const by = Math.cos(rope.angle) * rope.length
      const sx = bx - ax
      const sy = by - ay
      const along = Math.max(0, Math.min(1, ((c.x - ax) * sx + (c.y - ay) * sy) / (sx * sx + sy * sy)))
      const px = ax + sx * along
      const py = ay + sy * along
      const dx = c.x - px
      const dy = c.y - py
      const distance = Math.hypot(dx, dy) || 0.0001
      const overlap = ball.radius + 1.5 - distance
      if (overlap <= 0) return
      const nx = dx / distance
      const ny = dy / distance
      const k = nx * c.tx + ny * c.ty
      if (Math.abs(k) < 0.25) return
      ball.angle += clampCorrection(overlap / k / ball.reach)
      const normalSpeed = ball.velocity * ball.reach * k
      if (normalSpeed < 0) ball.velocity -= ((1 + RESTITUTION * 0.6) * normalSpeed) / (ball.reach * k)
    })
  })
}

const RESTITUTION = 0.72

function ballCenter(item) {
  return {
    x: item.x + Math.sin(item.angle) * item.reach,
    y: Math.cos(item.angle) * item.reach,
    tx: Math.cos(item.angle),
    ty: -Math.sin(item.angle),
  }
}

function inverseMass(index) {
  if (dragging.value === index) return 0
  return 1 / state[index].radius ** 3
}

function collide() {
  for (let i = 0; i < state.length; i++) {
    for (let j = i + 1; j < state.length; j++) {
      const a = state[i]
      const b = state[j]
      const pa = ballCenter(a)
      const pb = ballCenter(b)
      const dx = pb.x - pa.x
      const dy = pb.y - pa.y
      const distance = Math.hypot(dx, dy) || 0.0001
      const overlap = a.radius + b.radius + 0.5 - distance
      if (overlap <= 0) continue

      const nx = dx / distance
      const ny = dy / distance
      const ka = nx * pa.tx + ny * pa.ty
      const kb = nx * pb.tx + ny * pb.ty
      const wa = inverseMass(i) * ka * ka
      const wb = inverseMass(j) * kb * kb
      const total = wa + wb
      if (total <= 0) continue

      if (Math.abs(ka) > 0.001) a.angle -= clampCorrection(((overlap * wa) / total / ka) / a.reach)
      if (Math.abs(kb) > 0.001) b.angle += clampCorrection(((overlap * wb) / total / kb) / b.reach)

      const va = a.velocity * a.reach * ka
      const vb = b.velocity * b.reach * kb
      const approach = vb - va
      if (approach >= 0) continue
      const impulse = (-(1 + RESTITUTION) * approach) / (inverseMass(i) * ka * ka + inverseMass(j) * kb * kb)
      a.velocity -= (impulse * inverseMass(i) * ka) / a.reach
      b.velocity += (impulse * inverseMass(j) * kb) / b.reach
      const kick = Math.min(14, -approach * 0.03)
      a.spinVelocity -= kick
      b.spinVelocity += kick
    }
  }
}

function render() {
  if (!renderer) return
  state.forEach((item, i) => {
    item.group.rotation.z = item.angle
    item.ball.rotation.y = item.spin
    const hit = hitEls.value[i]
    if (!hit) return
    const cx = item.x + Math.sin(item.angle) * item.reach
    const cy = Math.cos(item.angle) * item.reach
    hit.style.transform = `translate(${cx - item.radius}px, ${cy - item.radius}px)`
  })
  renderer.render(scene, camera)
}

function loop(now) {
  frame = requestAnimationFrame(loop)
  let elapsed = Math.min(now - last, 50) / 1000
  last = now
  while (elapsed > 0) {
    const dt = Math.min(elapsed, 1 / 240)
    step(dt)
    elapsed -= dt
  }
  render()
}

function start() {
  if (frame || !renderer) return
  last = performance.now()
  frame = requestAnimationFrame(loop)
}

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
}

let press = null

function pointerTarget(event, item) {
  const rect = wrapEl.value.getBoundingClientRect()
  const dx = event.clientX - rect.left - item.x
  const dy = Math.max(12, event.clientY - rect.top)
  return Math.atan2(dx, dy)
}

function onPointerDown(event, index) {
  event.preventDefault()
  event.currentTarget.setPointerCapture(event.pointerId)
  dragging.value = index
  state[index].target = state[index].angle
  press = { x: event.clientX, y: event.clientY, time: performance.now(), lastX: event.clientX }
}

function onPointerMove(event, index) {
  if (dragging.value !== index) return
  const item = state[index]
  item.target = pointerTarget(event, item)
  item.spinVelocity += (event.clientX - press.lastX) * 0.04
  press.lastX = event.clientX
}

function onPointerUp(event, index) {
  if (dragging.value !== index) return
  const item = state[index]
  const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y)
  if (moved < 6 && performance.now() - press.time < 400) {
    item.velocity += (Math.random() < 0.5 ? -1 : 1) * 2.6
    item.spinVelocity += 9
  }
  dragging.value = -1
  press = null
}

watch(theme, () =>
  setTimeout(() => {
    if (stringMaterial) stringMaterial.color.copy(stringColor())
  }),
)

onMounted(() => {
  try {
    buildScene()
  } catch {
    renderer = null
    return
  }
  measure()
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(wrapEl.value)
  observer = new IntersectionObserver((entries) => (entries[0].isIntersecting ? start() : stop()))
  observer.observe(wrapEl.value)
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
  resizeObserver?.disconnect()
  if (!scene) return
  scene.traverse((object) => {
    object.geometry?.dispose()
    object.material?.dispose()
  })
  textures.forEach((texture) => texture.dispose())
  envTarget?.dispose()
  renderer.dispose()
})
</script>

<template>
  <div
    ref="wrapEl"
    class="ornaments"
    :class="`ornaments--${variant}`"
    :style="{
      height: `${HEIGHT}px`,
      width: layout.width ? `${width}px` : null,
      right: PAD_RIGHT ? `${-PAD_RIGHT}px` : null,
    }"
    aria-hidden="true"
  >
    <canvas ref="canvasEl" class="ornaments__canvas"></canvas>
    <span
      v-for="(item, index) in layout.items"
      :key="index"
      :ref="(el) => (hitEls[index] = el)"
      class="ornaments__hit"
      :class="{ 'is-dragging': dragging === index }"
      :style="{ width: `${item.radius * 2}px`, height: `${item.radius * 2}px` }"
      :data-cursor="t({ id: 'Tarik', en: 'Drag', ja: 'ドラッグ' })"
      @pointerdown="onPointerDown($event, index)"
      @pointermove="onPointerMove($event, index)"
      @pointerup="onPointerUp($event, index)"
      @pointercancel="onPointerUp($event, index)"
    ></span>
  </div>
</template>

<style scoped>
.ornaments {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  pointer-events: none;
}

.ornaments--compact {
  left: 0;
}

.ornaments__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.ornaments__hit {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: auto;
  cursor: grab;
  touch-action: none;
}

.ornaments__hit.is-dragging {
  cursor: grabbing;
}
</style>
