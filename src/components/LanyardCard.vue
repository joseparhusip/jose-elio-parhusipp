<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CubicBezierCurve3,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  Shape,
  SphereGeometry,
  ShapeGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { useTheme } from '@/composables/useTheme'
import { lang, t } from '@/composables/useLang'
import { christmas } from '@/composables/useChristmas'
import photo from './img-lanyard/foto-jose.jpg'

const CARD_W = 184
const CARD_H = 350
const CARD_DEPTH = 9
const CARD_BEVEL = 1.4
const ROPE_LENGTH = 92
const ROPE_SEGMENTS = 8
const STRAP_WIDTH = 15
const STRAP_SAMPLES = 40
const TEXTURE_SCALE = 4
const CARD_LIGHT = {
  face: '#ECEEF1',
  soft: '#DADDE2',
  ink: '#111214',
  muted: '#5B6068',
  blue: '#0059B3',
  line: 'rgba(15, 17, 20, 0.24)',
  hole: '#0E0F11',
}
const CARD_DARK = {
  face: '#15171A',
  soft: '#1F2226',
  ink: '#ECEEF1',
  muted: '#9AA0A8',
  blue: '#1F7FE0',
  line: 'rgba(230, 233, 238, 0.2)',
  hole: '#F4F4F1',
}

const props = defineProps({
  variant: { type: String, default: 'id' },
  path: { type: String, default: '' },
})
const { theme } = useTheme()
const emit = defineEmits(['grab'])
const isNotFound = props.variant === 'notfound'
const CORNER_HOLE = { x: 24, y: 13 }
const CORNER_DX = CARD_W / 2 - CORNER_HOLE.x
const CORNER_DY = CARD_H / 2 - CORNER_HOLE.y
const CORNER_REACH = Math.hypot(CORNER_DX, CORNER_DY)
const CORNER_TILT = -Math.atan2(CORNER_DX, CORNER_DY)

const wrapEl = ref(null)
const canvasEl = ref(null)
const hitEl = ref(null)
const staticEl = ref(null)
const isStatic = ref(false)
const isGrabbing = ref(false)

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function drawCard(canvas, image) {
  const s = TEXTURE_SCALE
  canvas.width = CARD_W * s
  canvas.height = CARD_H * s
  const ctx = canvas.getContext('2d')
  ctx.scale(s, s)

  const { face, soft, ink, muted, blue, line, hole } = theme.value === 'light' ? CARD_DARK : CARD_LIGHT
  const heading = cssVar('--font-heading')
  const serif = cssVar('--font-serif')
  const mono = cssVar('--font-mono')
  const pad = 14
  const innerW = CARD_W - pad * 2

  ctx.fillStyle = face
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = hole
  roundRect(ctx, CARD_W / 2 - 13, 8, 26, 6, 3)
  ctx.fill()

  ctx.textAlign = 'left'
  ctx.font = `italic 400 13px ${serif}`
  ctx.fillStyle = blue
  ctx.fillText('JP', pad, 28)
  ctx.textAlign = 'right'
  ctx.font = `500 5.8px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText(`PORTFOLIO · ${new Date().getFullYear()}`, CARD_W - pad, 27)

  const photoY = 35
  const photoH = 209
  ctx.save()
  roundRect(ctx, pad, photoY, innerW, photoH, 5)
  ctx.clip()
  ctx.fillStyle = soft
  ctx.fillRect(pad, photoY, innerW, photoH)
  if (image) {
    const ratio = Math.max(innerW / image.width, photoH / image.height)
    const w = image.width * ratio
    const h = image.height * ratio
    ctx.drawImage(image, pad + (innerW - w) / 2, photoY + (photoH - h) / 2, w, h)
  } else {
    ctx.textAlign = 'center'
    ctx.font = `italic 400 62px ${serif}`
    ctx.fillStyle = blue
    ctx.fillText('JP', CARD_W / 2, photoY + photoH / 2 + 21)
  }
  ctx.restore()

  ctx.textAlign = 'left'
  const first = 'Jose Elio '
  const last = 'Parhusip'
  const firstFont = (size) => `700 ${size}px ${heading}`
  const lastFont = (size) => `italic 400 ${size * 1.1}px ${serif}`
  const widthOf = (font, text) => {
    ctx.font = font
    return ctx.measureText(text).width
  }
  let size = 22
  while (widthOf(firstFont(size), first) + widthOf(lastFont(size), last) > innerW) size -= 0.25
  const firstWidth = widthOf(firstFont(size), first)
  ctx.font = firstFont(size)
  ctx.fillStyle = ink
  ctx.fillText(first, pad, 268)
  ctx.font = lastFont(size)
  ctx.fillStyle = blue
  ctx.fillText(last, pad + firstWidth, 268)

  ctx.font = `500 6.4px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText('FULL STACK DEVELOPER', pad, 282)

  ctx.strokeStyle = line
  ctx.lineWidth = 0.6
  ctx.beginPath()
  ctx.moveTo(pad, 291)
  ctx.lineTo(CARD_W - pad, 291)
  ctx.stroke()
  const col2 = pad + innerW * 0.42
  ctx.font = `500 5.2px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText('BASE', pad, 303)
  ctx.fillText('WEB', col2, 303)
  ctx.font = `600 6.6px ${mono}`
  ctx.fillStyle = ink
  ctx.fillText('BEKASI, ID', pad, 314)
  ctx.fillText('JOSEPARHUSIP.COM', col2, 314)

  const bandY = 324
  ctx.fillStyle = blue
  ctx.fillRect(0, bandY, CARD_W, CARD_H - bandY)
  ctx.font = `600 6.4px ${mono}`
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText('OPEN TO WORK', pad, bandY + 16)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  const code = 'JOSEPARHUSIP'
  let x = CARD_W - pad
  for (let i = code.length - 1; i >= 0 && x > CARD_W * 0.55; i--) {
    const c = code.charCodeAt(i)
    const bar = 0.6 + (c % 3) * 0.55
    x -= bar
    ctx.fillRect(x, bandY + 7, bar, 12)
    x -= 0.8 + (c % 2) * 0.9
  }
}

function drawNotFound(canvas) {
  const s = TEXTURE_SCALE
  canvas.width = CARD_W * s
  canvas.height = CARD_H * s
  const ctx = canvas.getContext('2d')
  ctx.scale(s, s)

  const { face, soft, ink, muted, blue, line, hole } = theme.value === 'light' ? CARD_DARK : CARD_LIGHT
  const heading = cssVar('--font-heading')
  const serif = cssVar('--font-serif')
  const mono = cssVar('--font-mono')
  const pad = 14
  const innerW = CARD_W - pad * 2
  const ja = lang.value === 'ja'
  const mid = CARD_W / 2

  ctx.fillStyle = face
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = hole
  ctx.beginPath()
  ctx.moveTo(mid - 13, 0)
  ctx.lineTo(mid - 12, 9)
  ctx.lineTo(mid - 4, 14)
  ctx.lineTo(mid + 6, 12.5)
  ctx.lineTo(mid + 13, 8)
  ctx.lineTo(mid + 9, 0)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = muted
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(mid + 6, 12.5)
  ctx.lineTo(mid + 10, 18)
  ctx.lineTo(mid + 8, 22)
  ctx.lineTo(mid + 13, 27)
  ctx.moveTo(mid - 4, 14)
  ctx.lineTo(mid - 7, 19)
  ctx.stroke()

  ctx.fillStyle = hole
  ctx.beginPath()
  ctx.arc(CORNER_HOLE.x, CORNER_HOLE.y, 4.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.textAlign = 'right'
  ctx.font = `500 5.8px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText('ERROR · 404', CARD_W - pad, 27)

  const photoY = 35
  const photoH = 209
  ctx.fillStyle = soft
  roundRect(ctx, pad, photoY, innerW, photoH, 5)
  ctx.fill()
  ctx.save()
  ctx.setLineDash([3, 2.5])
  ctx.strokeStyle = line
  ctx.lineWidth = 0.8
  roundRect(ctx, pad + 6, photoY + 6, innerW - 12, photoH - 12, 3)
  ctx.stroke()
  ctx.restore()

  ctx.textAlign = 'left'
  ctx.font = `800 54px ${heading}`
  const four = ctx.measureText('4').width
  ctx.font = `italic 400 62px ${serif}`
  const zero = ctx.measureText('0').width
  const startX = mid - (four * 2 + zero) / 2
  const baseY = photoY + photoH / 2 + 18
  ctx.font = `800 54px ${heading}`
  ctx.fillStyle = ink
  ctx.fillText('4', startX, baseY)
  ctx.fillText('4', startX + four + zero, baseY)
  ctx.font = `italic 400 62px ${serif}`
  ctx.fillStyle = blue
  ctx.fillText('0', startX + four, baseY)

  ctx.textAlign = 'center'
  ctx.font = `500 5.6px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText(t({ id: 'FOTO TIDAK DITEMUKAN', en: 'PHOTO NOT FOUND', ja: '写真が見つかりません' }), mid, photoY + photoH - 16)

  ctx.textAlign = 'left'
  const first = t({ id: 'Halaman ', en: 'Page ', ja: 'ページが' })
  const last = t({ id: 'tersesat', en: 'not found', ja: '見つかりません' })
  const firstFont = (size) => `700 ${size}px ${heading}`
  const lastFont = (size) => `${ja ? '' : 'italic '}400 ${size * 1.1}px ${serif}`
  const widthOf = (font, text) => {
    ctx.font = font
    return ctx.measureText(text).width
  }
  let size = 22
  while (widthOf(firstFont(size), first) + widthOf(lastFont(size), last) > innerW) size -= 0.25
  const firstWidth = widthOf(firstFont(size), first)
  ctx.font = firstFont(size)
  ctx.fillStyle = ink
  ctx.fillText(first, pad, 268)
  ctx.font = lastFont(size)
  ctx.fillStyle = blue
  ctx.fillText(last, pad + firstWidth, 268)

  ctx.font = `500 6.4px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText('HTTP 404 · NOT FOUND', pad, 282)

  ctx.strokeStyle = line
  ctx.lineWidth = 0.6
  ctx.beginPath()
  ctx.moveTo(pad, 291)
  ctx.lineTo(CARD_W - pad, 291)
  ctx.stroke()

  ctx.font = `500 5.2px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText(t({ id: 'ALAMAT', en: 'PATH', ja: 'パス' }), pad, 303)
  ctx.font = `600 6.6px ${mono}`
  ctx.fillStyle = ink
  let path = (props.path || '/').toUpperCase()
  if (ctx.measureText(path).width > innerW) {
    while (path.length > 1 && ctx.measureText(`${path}…`).width > innerW) path = path.slice(0, -1)
    path += '…'
  }
  ctx.fillText(path, pad, 314)

  const bandY = 324
  ctx.fillStyle = blue
  ctx.fillRect(0, bandY, CARD_W, CARD_H - bandY)
  ctx.font = `600 6.4px ${mono}`
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(t({ id: 'HILANG · TIDAK BERLAKU', en: 'LOST · INVALID PASS', ja: '紛失・無効なカード' }), pad, bandY + 16)
}

function drawFront(canvas, image) {
  if (isNotFound) drawNotFound(canvas)
  else drawCard(canvas, image)
}

function drawBack(canvas) {
  const s = TEXTURE_SCALE
  canvas.width = CARD_W * s
  canvas.height = CARD_H * s
  const ctx = canvas.getContext('2d')
  ctx.scale(s, s)

  const { face, ink, muted, blue, line, hole } = theme.value === 'light' ? CARD_DARK : CARD_LIGHT
  const heading = cssVar('--font-heading')
  const serif = cssVar('--font-serif')
  const mono = cssVar('--font-mono')
  const pad = 14
  const innerW = CARD_W - pad * 2
  const ja = lang.value === 'ja'

  ctx.fillStyle = face
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = hole
  roundRect(ctx, CARD_W / 2 - 13, 8, 26, 6, 3)
  ctx.fill()

  ctx.textAlign = 'left'
  ctx.font = `italic 400 13px ${serif}`
  ctx.fillStyle = blue
  ctx.fillText('JP', pad, 28)
  ctx.textAlign = 'right'
  ctx.font = `500 5.8px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText(`ID · ${new Date().getFullYear()}`, CARD_W - pad, 27)
  ctx.textAlign = 'left'

  const fitted = (text, weight, max) => {
    let size = max
    do {
      ctx.font = `${weight} ${size}px ${heading}`
      size -= 0.25
    } while (ctx.measureText(text).width > innerW && size > 6)
  }
  const rule = (y) => {
    ctx.strokeStyle = line
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(pad, y)
    ctx.lineTo(CARD_W - pad, y)
    ctx.stroke()
  }
  const section = (y, label, value, sub) => {
    ctx.font = `500 5.4px ${mono}`
    ctx.fillStyle = muted
    ctx.fillText(label, pad, y)
    fitted(value, 700, 13)
    ctx.fillStyle = ink
    ctx.fillText(value, pad, y + 15)
    if (sub) {
      ctx.font = `500 6px ${mono}`
      ctx.fillStyle = muted
      ctx.fillText(sub, pad, y + 27)
    }
    rule(sub ? y + 37 : y + 25)
  }

  section(52, t({ id: 'SEKARANG', en: 'NOW', ja: '現在' }), 'Back End Developer', 'PT SPKD · FREELANCE')
  section(
    102,
    t({ id: 'PENDIDIKAN', en: 'EDUCATION', ja: '学歴' }),
    t({ id: 'S1 Bisnis Digital', en: 'Bachelor of Digital Business', ja: 'デジタルビジネス学士' }),
    'ULBI · 2026',
  )
  section(152, t({ id: 'FOKUS', en: 'FOCUS', ja: '専門' }), 'Web · Mobile · Data · AI')

  ctx.font = `500 5.4px ${mono}`
  ctx.fillStyle = muted
  ctx.fillText(t({ id: 'STACK UTAMA', en: 'CORE STACK', ja: '主なスキル' }), pad, 190)
  ctx.font = `600 6.4px ${mono}`
  let x = pad
  let y = 196
  for (const tech of ['Go', 'Vue.js', 'React', 'Flutter', 'PostgreSQL']) {
    const w = ctx.measureText(tech.toUpperCase()).width + 10
    if (x + w > CARD_W - pad) {
      x = pad
      y += 17
    }
    ctx.strokeStyle = line
    ctx.lineWidth = 0.7
    roundRect(ctx, x, y, w, 13, 3)
    ctx.stroke()
    ctx.fillStyle = ink
    ctx.fillText(tech.toUpperCase(), x + 5, y + 9)
    x += w + 4
  }

  ctx.font = `${ja ? '' : 'italic '}400 12.5px ${serif}`
  ctx.fillStyle = blue
  ctx.fillText(t({ id: 'Menemukan kartu ini?', en: 'Found this card?', ja: 'このカードを拾った方へ' }), pad, 280)
  ctx.font = `600 6.6px ${mono}`
  ctx.fillStyle = ink
  ctx.fillText('JOSEPARHUSIP7@GMAIL.COM', pad, 294)

  const bandY = 324
  ctx.fillStyle = blue
  ctx.fillRect(0, bandY, CARD_W, CARD_H - bandY)
  ctx.font = `600 6.4px ${mono}`
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(t({ id: 'KETUK UNTUK MEMBALIK', en: 'TAP TO FLIP', ja: 'タップして裏返す' }), pad, bandY + 16)
  const cx = CARD_W - pad - 5
  const cy = bandY + 13
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.1
  ctx.beginPath()
  ctx.arc(cx, cy, 4, Math.PI * 0.15, Math.PI * 1.75)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 3.6, cy - 3.6)
  ctx.lineTo(cx + 4.2, cy - 0.6)
  ctx.lineTo(cx + 1.2, cy - 1.4)
  ctx.stroke()
}

function drawStrap(canvas) {
  canvas.width = 64
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const blue = cssVar('--color-primary')
  ctx.fillStyle = blue
  ctx.fillRect(0, 0, 64, 512)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
  ctx.fillRect(0, 0, 5, 512)
  ctx.fillRect(59, 0, 5, 512)
  ctx.save()
  ctx.translate(32, 256)
  ctx.rotate(Math.PI / 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
  ctx.font = `600 22px ${cssVar('--font-mono')}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('JOSE ELIO PARHUSIP', 0, 1)
  ctx.restore()
}

function drawGlare(canvas) {
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 256, 256)
  gradient.addColorStop(0.36, 'rgba(255, 255, 255, 0)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)')
  gradient.addColorStop(0.64, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)
}

function drawShadow(canvas) {
  canvas.width = 320
  canvas.height = 400
  const ctx = canvas.getContext('2d')
  ctx.filter = 'blur(18px)'
  ctx.fillStyle = '#000'
  roundRect(ctx, 60, 60, 200, 280, 14)
  ctx.fill()
}

let photoImage = null

function loadPhoto() {
  if (isNotFound) return Promise.resolve(null)
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = photo
  })
}

const GRAVITY = 0.55
const DAMPING = 0.98
const ITERATIONS = 14
const STEP_MS = 1000 / 60

let width = 0
let height = 0
let scale = 1
let anchorX = 0
let segment = 0
let cardLength = 0
let points = []
let yaw = 0
let yawVelocity = 0
let tilt = 0
let time = 0
let grab = null
let tap = null
const flipped = ref(false)
let flipAngle = 0
let flipVelocity = 0
let flipTimer = 0
const FLIP_BACK_MS = 8000
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function resetPoints() {
  segment = ROPE_LENGTH / ROPE_SEGMENTS
  cardLength = CARD_H * scale
  points = []
  const swing = calm ? 0 : width < 520 ? 0.22 : 0.6
  for (let i = 0; i <= ROPE_SEGMENTS + 1; i++) {
    const d = i <= ROPE_SEGMENTS ? i * segment : ROPE_LENGTH + cardLength
    const x = anchorX + Math.sin(swing) * d
    const y = Math.cos(swing) * d
    points.push({ x, y, px: x, py: y })
  }
}

function constrain(a, b, length, pinA) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distance = Math.hypot(dx, dy) || 1
  const push = (distance - length) / distance
  if (pinA) {
    b.x -= dx * push
    b.y -= dy * push
    return
  }
  a.x += dx * push * 0.5
  a.y += dy * push * 0.5
  b.x -= dx * push * 0.5
  b.y -= dy * push * 0.5
}

function stepPhysics() {
  time += STEP_MS / 1000
  const wind = calm ? 0 : Math.sin(time * 0.75) * 0.03 + Math.sin(time * 1.9) * 0.012

  for (let i = 1; i < points.length; i++) {
    const p = points[i]
    const vx = (p.x - p.px) * DAMPING
    const vy = (p.y - p.py) * DAMPING
    p.px = p.x
    p.py = p.y
    p.x += vx + wind * (i / points.length)
    p.y += vy + GRAVITY
  }

  const ring = points[ROPE_SEGMENTS]
  const bottom = points[ROPE_SEGMENTS + 1]

  if (grab) {
    const heldX = ring.x + (bottom.x - ring.x) * grab.along
    const heldY = ring.y + (bottom.y - ring.y) * grab.along
    const dx = (grab.target.x - heldX) * 0.4
    const dy = (grab.target.y - heldY) * 0.4
    ring.x += dx
    ring.y += dy
    bottom.x += dx
    bottom.y += dy
  }

  for (let n = 0; n < ITERATIONS; n++) {
    for (let i = 0; i < ROPE_SEGMENTS; i++) {
      constrain(points[i], points[i + 1], segment, i === 0)
    }
    constrain(ring, bottom, cardLength, false)
  }

  const margin = (isNotFound ? 152 : CARD_W / 2) * scale + 6
  for (const p of [ring, bottom]) {
    p.x = Math.max(margin, Math.min(width - margin, p.x))
  }

  const speed = bottom.x - bottom.px
  yawVelocity += -yaw * 0.016 + speed * 0.0016
  yawVelocity *= 0.92
  yaw = Math.max(-0.7, Math.min(0.7, yaw + yawVelocity))
  tilt += ((bottom.y - bottom.py) * 0.012 - tilt) * 0.08

  const flipTarget = flipped.value && !isNotFound ? Math.PI : 0
  if (calm) {
    flipAngle += (flipTarget - flipAngle) * 0.3
  } else {
    flipVelocity += (flipTarget - flipAngle) * 0.05
    flipVelocity *= 0.8
    flipAngle += flipVelocity
  }
}

let renderer = null
let scene = null
let camera = null
let cardGroup = null
let cardMesh = null
let pivot = null
let cardTexture = null
let cardMaterial = null
let backTexture = null
let shadowMesh = null
let glareTexture = null
let glareMaterial = null
let shadowTexture = null
let strapMesh = null
let strapTexture = null
let strapPositions = null
let strapUvs = null
const textureCanvas = document.createElement('canvas')
const backCanvas = document.createElement('canvas')
const strapCanvas = document.createElement('canvas')

function cardShape() {
  const w = CARD_W
  const h = CARD_H
  const r = 9
  const x = -w / 2
  const y = -h / 2
  const shape = new Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

function fitUv(geometry) {
  const pos = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + CARD_W / 2) / CARD_W, (pos.getY(i) + CARD_H / 2) / CARD_H)
  }
  return geometry
}

function cardGeometry() {
  const geometry = new ExtrudeGeometry(cardShape(), {
    depth: CARD_DEPTH,
    bevelEnabled: true,
    bevelThickness: CARD_BEVEL,
    bevelSize: CARD_BEVEL,
    bevelSegments: 3,
    curveSegments: 10,
  })
  geometry.translate(0, 0, -CARD_DEPTH / 2)
  return fitUv(geometry)
}

function strapGeometry() {
  const count = (STRAP_SAMPLES + 1) * 2
  strapPositions = new Float32Array(count * 3)
  strapUvs = new Float32Array(count * 2)
  const index = []
  for (let i = 0; i < STRAP_SAMPLES; i++) {
    const a = i * 2
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(strapPositions, 3))
  geometry.setAttribute('uv', new BufferAttribute(strapUvs, 2))
  geometry.setIndex(index)
  return geometry
}

let santaHat = null

let hatEnv = null
const hatTextures = []

function hatNoise(x, y, z) {
  return (
    Math.sin(x * 1.7 + y * 2.3 + z * 0.7) * 0.45 +
    Math.sin(y * 3.1 - z * 1.3 + x * 0.4) * 0.3 +
    Math.sin(z * 2.7 + x * 0.9 - y * 1.1) * 0.25
  )
}

function hatBumpTexture(scale, strength) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = hatNoise(x * scale, y * scale, (x + y) * scale * 0.5) * 0.5 + Math.random() * strength
      const v = Math.max(0, Math.min(255, 128 + n * 110))
      const i = (y * size + x) * 4
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v
      image.data[i + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  hatTextures.push(texture)
  return texture
}

function displace(geometry, amount, frequency) {
  geometry.computeVertexNormals()
  const position = geometry.attributes.position
  const normal = geometry.attributes.normal
  const p = new Vector3()
  const n = new Vector3()
  for (let i = 0; i < position.count; i++) {
    p.fromBufferAttribute(position, i)
    n.fromBufferAttribute(normal, i)
    const d = hatNoise(p.x * frequency, p.y * frequency, p.z * frequency) * amount
    position.setXYZ(i, p.x + n.x * d, p.y + n.y * d, p.z + n.z * d)
  }
  geometry.computeVertexNormals()
  return geometry
}

function brimGeometry(radius, thickness, height) {
  const points = []
  const steps = 48
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2 - Math.PI / 2
    const c = Math.cos(a)
    const sn = Math.sin(a)
    const x = radius + Math.sign(c) * Math.abs(c) ** 0.55 * (thickness / 2)
    const y = Math.sign(sn) * Math.abs(sn) ** 0.55 * (height / 2)
    points.push(new Vector2(Math.max(0.1, x), y))
  }
  return displace(new LatheGeometry(points, 72), 1.4, 0.32)
}

function bodyGeometry(curve, baseRadius, tipRadius) {
  const lengthSegments = 72
  const radialSegments = 48
  const frames = curve.computeFrenetFrames(lengthSegments, false)
  const positions = []
  const uvs = []
  const indices = []
  const point = new Vector3()
  for (let i = 0; i <= lengthSegments; i++) {
    const t = i / lengthSegments
    curve.getPointAt(t, point)
    const taper = baseRadius * (1 - t) ** 0.8 + tipRadius * t
    const sag = 1 - 0.12 * Math.sin(t * Math.PI)
    for (let j = 0; j <= radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2
      const fold =
        1 +
        0.07 * Math.sin(theta * 5 + t * 11) * (1 - t * 0.6) +
        0.04 * Math.sin(theta * 9 - t * 17) +
        0.03 * hatNoise(theta * 2, t * 6, 0.5)
      const r = taper * sag * fold
      const nx = frames.normals[i]
      const bx = frames.binormals[i]
      positions.push(
        point.x + r * (Math.cos(theta) * nx.x + Math.sin(theta) * bx.x),
        point.y + r * (Math.cos(theta) * nx.y + Math.sin(theta) * bx.y),
        point.z + r * (Math.cos(theta) * nx.z + Math.sin(theta) * bx.z),
      )
      uvs.push(j / radialSegments, t)
    }
  }
  for (let i = 0; i < lengthSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j
      const b = a + radialSegments + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function buildSantaHat() {
  if (!hatEnv) {
    const pmrem = new PMREMGenerator(renderer)
    hatEnv = pmrem.fromScene(new RoomEnvironment(), 0.04)
    pmrem.dispose()
  }

  const velvetBump = hatBumpTexture(0.09, 0.35)
  velvetBump.repeat.set(3, 2)
  const furBump = hatBumpTexture(0.35, 1.2)
  furBump.repeat.set(6, 1)

  const velvet = new MeshPhysicalMaterial({
    color: 0xa3101c,
    roughness: 0.78,
    sheen: 1,
    sheenColor: 0xff6b6b,
    sheenRoughness: 0.42,
    bumpMap: velvetBump,
    bumpScale: 0.6,
    envMap: hatEnv.texture,
    envMapIntensity: 0.55,
    side: DoubleSide,
  })
  const fur = new MeshPhysicalMaterial({
    color: 0xf3f1ec,
    roughness: 1,
    sheen: 0.6,
    sheenColor: 0xffffff,
    sheenRoughness: 0.8,
    bumpMap: furBump,
    bumpScale: 1.4,
    envMap: hatEnv.texture,
    envMapIntensity: 0.7,
  })

  const hat = new Group()
  const brim = new Mesh(brimGeometry(26, 11, 17), fur)
  brim.position.y = 8

  const curve = new CubicBezierCurve3(
    new Vector3(0, 12, 0),
    new Vector3(-3, 52, 1),
    new Vector3(30, 66, 2),
    new Vector3(46, 32, 3),
  )
  const body = new Mesh(bodyGeometry(curve, 27, 3.2), velvet)

  const tip = curve.getPointAt(1)
  const tangent = curve.getTangentAt(1)
  const pompom = new Mesh(displace(new SphereGeometry(9.5, 40, 28), 1.1, 0.55), fur)
  pompom.position.copy(tip).addScaledVector(tangent, 5)

  hat.add(body, brim, pompom)
  hat.position.set(CARD_W / 2 - 18, CARD_H / 2 - 9, 0)
  hat.rotation.set(0.12, -0.25, -0.18)
  hat.scale.setScalar(0.95)
  return hat
}

watch(christmas, (on) => {
  if (santaHat) santaHat.visible = on
})

function buildScene() {
  renderer = new WebGLRenderer({ canvas: canvasEl.value, alpha: true, antialias: true })
  renderer.setClearColor(0x000000, 0)
  scene = new Scene()
  camera = new PerspectiveCamera(28, 1, 1, 4000)

  scene.add(new AmbientLight(0xffffff, 2.3))
  const key = new DirectionalLight(0xffffff, 1.5)
  key.position.set(-0.5, 0.8, 1)
  scene.add(key)

  cardTexture = new CanvasTexture(textureCanvas)
  cardTexture.colorSpace = SRGBColorSpace
  cardTexture.generateMipmaps = false
  cardTexture.minFilter = LinearFilter
  cardMaterial = new MeshBasicMaterial({ map: cardTexture })
  backTexture = new CanvasTexture(backCanvas)
  backTexture.colorSpace = SRGBColorSpace
  backTexture.generateMipmaps = false
  backTexture.minFilter = LinearFilter
  const edge = new MeshStandardMaterial({ color: 0xc4c9d0, metalness: 0.35, roughness: 0.3 })

  cardGroup = new Group()
  cardMesh = new Mesh(cardGeometry(), [new MeshBasicMaterial({ visible: false }), edge])
  pivot = new Group()
  pivot.add(cardMesh)
  cardGroup.add(pivot)
  const faceZ = CARD_DEPTH / 2 + CARD_BEVEL
  const front = new Mesh(fitUv(new ShapeGeometry(cardShape(), 10)), cardMaterial)
  front.position.z = faceZ
  const back = new Mesh(fitUv(new ShapeGeometry(cardShape(), 10)), new MeshBasicMaterial({ map: backTexture }))
  back.rotation.y = Math.PI
  back.position.z = -faceZ
  cardMesh.add(front, back)

  const glareCanvas = document.createElement('canvas')
  drawGlare(glareCanvas)
  glareTexture = new CanvasTexture(glareCanvas)
  glareMaterial = new MeshBasicMaterial({
    map: glareTexture,
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  })
  const glare = new Mesh(fitUv(new ShapeGeometry(cardShape(), 10)), glareMaterial)
  glare.position.z = faceZ + 0.05
  const glareBack = glare.clone()
  glareBack.rotation.y = Math.PI
  glareBack.position.z = -faceZ - 0.05
  cardMesh.add(glare, glareBack)

  const shadowCanvas = document.createElement('canvas')
  drawShadow(shadowCanvas)
  shadowTexture = new CanvasTexture(shadowCanvas)
  shadowMesh = new Mesh(
    new PlaneGeometry(CARD_W * 1.6, CARD_H * (400 / 280)),
    new MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: 0.45, depthWrite: false }),
  )
  shadowMesh.position.set(5, -8, -14)
  cardMesh.add(shadowMesh)

  const metal = new MeshStandardMaterial({ color: 0xc9ced6, metalness: 0.55, roughness: 0.32 })
  const hook = new Group()
  const crimp = new Mesh(new BoxGeometry(STRAP_WIDTH + 3, 12, 4), metal)
  crimp.position.y = 12
  const stem = new Mesh(new CylinderGeometry(1.6, 1.6, 8, 12), metal)
  stem.position.y = 4
  const ring = new Mesh(new TorusGeometry(6, 1.5, 12, 28), metal)
  ring.position.y = -3
  hook.add(crimp, stem, ring)
  cardGroup.add(hook)

  if (!isNotFound) {
    santaHat = buildSantaHat()
    santaHat.visible = christmas.value
    cardMesh.add(santaHat)
  }
  scene.add(cardGroup)

  strapTexture = new CanvasTexture(strapCanvas)
  strapTexture.colorSpace = SRGBColorSpace
  strapTexture.wrapT = RepeatWrapping
  strapTexture.anisotropy = 4
  strapMesh = new Mesh(
    strapGeometry(),
    new MeshStandardMaterial({ map: strapTexture, roughness: 0.75, side: DoubleSide }),
  )
  strapMesh.frustumCulled = false
  scene.add(strapMesh)
}

function catmull(p0, p1, p2, p3, u) {
  const u2 = u * u
  const u3 = u2 * u
  return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (3 * p1 - p0 - 3 * p2 + p3) * u3)
}

function toWorldX(x) {
  return x - width / 2
}

function toWorldY(y) {
  return height / 2 - y
}

function updateStrap(endX, endY) {
  const rope = points.slice(0, ROPE_SEGMENTS + 1)
  const last = rope.length - 1
  rope[last] = { x: endX, y: endY }
  let length = 0
  let prevX = rope[0].x
  let prevY = rope[0].y

  for (let i = 0; i <= STRAP_SAMPLES; i++) {
    const f = (i / STRAP_SAMPLES) * last
    const k = Math.min(Math.floor(f), last - 1)
    const u = f - k
    const a = rope[Math.max(0, k - 1)]
    const b = rope[k]
    const c = rope[k + 1]
    const d = rope[Math.min(last, k + 2)]
    const x = catmull(a.x, b.x, c.x, d.x, u)
    const y = catmull(a.y, b.y, c.y, d.y, u)

    const tx = c.x - b.x
    const ty = c.y - b.y
    const tl = Math.hypot(tx, ty) || 1
    const nx = -ty / tl
    const ny = tx / tl
    const twist = yaw * (i / STRAP_SAMPLES) ** 2
    const half = (STRAP_WIDTH * scale) / 2
    const wx = nx * Math.cos(twist) * half
    const wy = ny * Math.cos(twist) * half
    const wz = Math.sin(twist) * half

    length += Math.hypot(x - prevX, y - prevY)
    prevX = x
    prevY = y

    const v = i * 6
    strapPositions[v] = toWorldX(x - wx)
    strapPositions[v + 1] = toWorldY(y - wy)
    strapPositions[v + 2] = -wz
    strapPositions[v + 3] = toWorldX(x + wx)
    strapPositions[v + 4] = toWorldY(y + wy)
    strapPositions[v + 5] = wz

    const w = i * 4
    const along = length / 150
    strapUvs[w] = 0
    strapUvs[w + 1] = along
    strapUvs[w + 2] = 1
    strapUvs[w + 3] = along
  }

  const geometry = strapMesh.geometry
  geometry.attributes.position.needsUpdate = true
  geometry.attributes.uv.needsUpdate = true
  geometry.computeVertexNormals()
}

function render() {
  const ring = points[ROPE_SEGMENTS]
  const bottom = points[ROPE_SEGMENTS + 1]
  const angle = Math.atan2(bottom.x - ring.x, bottom.y - ring.y)
  const rotate = (x, y) => ({
    x: ring.x + x * Math.cos(angle) + y * Math.sin(angle),
    y: ring.y - x * Math.sin(angle) + y * Math.cos(angle),
  })

  cardGroup.position.set(toWorldX(ring.x), toWorldY(ring.y), 0)
  cardGroup.rotation.z = angle
  cardGroup.scale.setScalar(scale)
  if (isNotFound) {
    pivot.rotation.z = CORNER_TILT
    cardMesh.position.set(CORNER_DX, -CORNER_DY, 0)
  } else {
    cardMesh.position.y = -CARD_H / 2 + 11
  }
  cardMesh.rotation.y = flipAngle + yaw
  cardMesh.rotation.x = tilt
  const facing = Math.cos(flipAngle + yaw) >= 0 ? 1 : -1
  shadowMesh.position.set(5 * facing, -8, -14 * facing)
  const motion = Math.abs(yaw) * 1.5 + Math.abs(angle) * 1.1 + Math.abs(Math.sin(flipAngle)) * 1.2
  glareTexture.offset.x = 1.05 - motion
  glareMaterial.opacity = Math.min(0.32, motion * 0.8)

  const end = rotate(0, -18 * scale)
  updateStrap(end.x, end.y)

  renderer.render(scene, camera)

  if (hitEl.value) {
    const w = CARD_W * scale
    const h = CARD_H * scale
    const center = isNotFound ? rotate(0, CORNER_REACH * scale) : rotate(0, h / 2 - 11 * scale)
    const turn = isNotFound ? angle + CORNER_TILT : angle
    hitEl.value.style.width = `${w}px`
    hitEl.value.style.height = `${h}px`
    hitEl.value.style.transform = `translate(${canvasLeft + center.x - w / 2}px, ${center.y - h / 2}px) rotate(${-turn}rad)`
  }
}

let canvasLeft = 0

function measure() {
  const rect = wrapEl.value.getBoundingClientRect()
  const viewport = document.documentElement.clientWidth
  const maxScale = parseFloat(getComputedStyle(wrapEl.value).getPropertyValue('--lanyard-max-scale')) || 1
  scale = Math.min(maxScale, rect.width / (CARD_W + 16))
  const reach = ROPE_LENGTH + CARD_H * scale
  width = Math.round(Math.min(viewport, reach * 2 + 80))
  height = Math.round(reach + 150)

  const center = rect.left + rect.width / 2
  const pageLeft = Math.max(0, Math.min(viewport - width, center - width / 2))
  canvasLeft = pageLeft - rect.left
  anchorX = center - pageLeft

  const canvas = canvasEl.value
  canvas.style.left = `${canvasLeft}px`
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const coarse = window.matchMedia('(pointer: coarse)').matches
  renderer.setPixelRatio(coarse ? Math.min(window.devicePixelRatio || 1, 2) : Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5))
  renderer.setSize(width, height, false)

  camera.aspect = width / height
  const fov = (camera.fov * Math.PI) / 180
  const distance = height / 2 / Math.tan(fov / 2)
  camera.position.set(0, 0, distance)
  camera.near = Math.max(1, distance - 600)
  camera.far = distance + 600
  camera.updateProjectionMatrix()

  resetPoints()
}

function pointerPosition(event) {
  const rect = canvasEl.value.getBoundingClientRect()
  return {
    x: Math.max(8, Math.min(width - 8, event.clientX - rect.left)),
    y: Math.max(8, Math.min(height - 8, event.clientY - rect.top)),
  }
}

function onPointerDown(event) {
  event.preventDefault()
  hitEl.value.setPointerCapture(event.pointerId)
  const target = pointerPosition(event)
  const ring = points[ROPE_SEGMENTS]
  const bottom = points[ROPE_SEGMENTS + 1]
  const dx = bottom.x - ring.x
  const dy = bottom.y - ring.y
  const along = ((target.x - ring.x) * dx + (target.y - ring.y) * dy) / (dx * dx + dy * dy)
  grab = { along: Math.max(0, Math.min(1, along)), target }
  tap = { x: event.clientX, y: event.clientY, time: performance.now() }
  isGrabbing.value = true
  emit('grab')
}

function onPointerMove(event) {
  if (grab) grab.target = pointerPosition(event)
  if (tap && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 6) tap = null
}

function onPointerUp() {
  if (tap && performance.now() - tap.time < 450) {
    if (isNotFound) nudge()
    else toggleFlip()
  }
  tap = null
  grab = null
  isGrabbing.value = false
}

function onPointerCancel() {
  tap = null
  onPointerUp()
}

function nudge() {
  const bottom = points[ROPE_SEGMENTS + 1]
  bottom.px -= (Math.random() < 0.5 ? -1 : 1) * 14 * scale
}

function toggleFlip() {
  flipped.value = !flipped.value
  clearTimeout(flipTimer)
  if (flipped.value) flipTimer = setTimeout(() => (flipped.value = false), FLIP_BACK_MS)
}

function resetFlip() {
  clearTimeout(flipTimer)
  flipped.value = false
  flipAngle = 0
  flipVelocity = 0
}

let frame = 0
let lastTime = 0
let leftover = 0
let observer = null
let resizeObserver = null

function loop(now) {
  frame = requestAnimationFrame(loop)
  leftover += Math.min(now - lastTime, 50)
  lastTime = now
  while (leftover >= STEP_MS) {
    stepPhysics()
    leftover -= STEP_MS
  }
  render()
}

function start() {
  if (frame) return
  lastTime = performance.now()
  frame = requestAnimationFrame(loop)
}

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
}

function paintTextures() {
  drawFront(textureCanvas, photoImage)
  drawBack(backCanvas)
  drawStrap(strapCanvas)
  if (cardTexture) cardTexture.needsUpdate = true
  if (backTexture) backTexture.needsUpdate = true
  if (strapTexture) strapTexture.needsUpdate = true
  if (staticEl.value) drawFront(staticEl.value, photoImage)
}

watch(theme, () => setTimeout(paintTextures))
watch(lang, paintTextures)
watch(() => props.path, paintTextures)

onMounted(async () => {
  const fonts = ['--font-heading', '--font-mono'].map((name) =>
    document.fonts?.load(`600 12px ${cssVar(name)}`),
  )
  fonts.push(document.fonts?.load(`italic 400 12px ${cssVar('--font-serif')}`))
  ;[photoImage] = await Promise.all([loadPhoto(), ...fonts])
  if (!wrapEl.value) return

  try {
    buildScene()
  } catch (err) {
    console.warn('Lanyard 3D tidak tersedia:', err)
    renderer = null
  }
  if (!renderer) {
    isStatic.value = true
    await Promise.resolve()
    setTimeout(paintTextures)
    return
  }

  paintTextures()
  measure()
  try {
    await renderer.compileAsync(scene, camera)
  } catch {}
  if (!wrapEl.value) return

  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(wrapEl.value)
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) return start()
      stop()
      resetFlip()
    },
    { rootMargin: '120px' },
  )
  observer.observe(wrapEl.value)
})

onBeforeUnmount(() => {
  stop()
  clearTimeout(flipTimer)
  observer?.disconnect()
  resizeObserver?.disconnect()
  if (!scene) return
  scene.traverse((object) => {
    object.geometry?.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    materials.forEach((material) => material?.dispose())
  })
  cardTexture.dispose()
  backTexture.dispose()
  strapTexture.dispose()
  glareTexture.dispose()
  shadowTexture.dispose()
  hatTextures.forEach((texture) => texture.dispose())
  hatEnv?.dispose()
  renderer.dispose()
})
</script>

<template>
  <div
    ref="wrapEl"
    class="lanyard"
    :class="{ 'lanyard--static': isStatic }"
    :role="isNotFound ? undefined : 'group'"
    :aria-hidden="isNotFound ? 'true' : undefined"
    :aria-label="isNotFound ? undefined : t({ id: 'Kartu identitas Jose Elio Parhusip', en: 'Jose Elio Parhusip ID card', ja: 'Jose Elio ParhusipのIDカード' })"
  >
    <template v-if="isStatic">
      <span class="lanyard__static-strap" aria-hidden="true"></span>
      <canvas ref="staticEl" class="lanyard__static-card"></canvas>
    </template>
    <template v-else>
      <canvas ref="canvasEl" class="lanyard__canvas" aria-hidden="true"></canvas>
      <div
        v-if="isNotFound"
        ref="hitEl"
        class="lanyard__hit"
        :class="{ 'is-grabbing': isGrabbing }"
        :data-cursor="t({ id: 'Tarik', en: 'Drag', ja: 'ドラッグ' })"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @dragstart.prevent
      ></div>
      <div
        v-else
        ref="hitEl"
        class="lanyard__hit"
        :class="{ 'is-grabbing': isGrabbing }"
        role="button"
        tabindex="0"
        :aria-pressed="flipped"
        :aria-label="t({ id: 'Balik kartu untuk melihat info singkat', en: 'Flip the card to see a short profile', ja: 'カードを裏返して簡単なプロフィールを見る' })"
        :data-cursor="t({ id: 'Klik · Tarik', en: 'Click · Drag', ja: 'クリック · ドラッグ' })"
        @keydown.enter.prevent="toggleFlip"
        @keydown.space.prevent="toggleFlip"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @dragstart.prevent
      ></div>
    </template>
  </div>
</template>

<style scoped>
.lanyard {
  position: relative;
  width: 100%;
  height: 100%;
}

.lanyard__canvas {
  position: absolute;
  top: 0;
  display: block;
  pointer-events: none;
}

.lanyard__hit {
  position: absolute;
  top: 0;
  left: 0;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.lanyard__hit.is-grabbing {
  cursor: grabbing;
}

.lanyard--static {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lanyard__static-strap {
  flex-shrink: 0;
  width: 15px;
  height: 92px;
  background: var(--color-primary);
}

.lanyard__static-card {
  width: min(168px, 100%);
  height: auto;
  border: 1px solid var(--color-rule);
  border-radius: 9px;
}
</style>
