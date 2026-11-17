<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import router from '@/router'

/* ---------------------------------------------------------
   Skeleton saat reload biasa (kunjungan pertama tetap memakai intro zoom).

   Ukurannya PERSIS sama dengan halaman asli karena tidak digambar manual:
   halaman asli sudah dirender di balik layar (tidak terlihat, tapi tetap
   punya tata letak), lalu setiap bagian yang terlihat di layar diukur:
   - teks: per baris (lebar & tinggi baris sebenarnya),
   - tombol, gambar, peta, kartu foto: kotak penuh dengan sudut yang sama,
   - kartu/panel bergaris: bingkai tipis, dan garis pemisah tetap digambar,
   lalu digambar ulang sebagai "tulang" berkilau. Saat konten siap,
   skeleton memudar dan halaman asli muncul tepat di tempat yang sama.
   Diukur ulang saat layar di-resize atau posisi scroll dipulihkan browser.
--------------------------------------------------------- */
const emit = defineEmits(['reveal', 'done'])

const MIN_SHOW_MS = 750 // skeleton terlihat minimal selama ini (tidak sekadar berkedip)
const MAX_WAIT_MS = 2600 // paling lama menunggu gambar di layar pertama
const FADE_MS = 380
const MAX_BONES = 700

// Elemen yang digambar sebagai satu kotak penuh (isinya tidak diukur lagi)
const BLOCK_SEL = 'img, video, svg, canvas:not(.lanyard__canvas), .contact__map, .skyline, .lanyard__hit, input, textarea, select'
// Tombol & kontrol: kotak penuh dengan sudut yang sama, teks di dalamnya tidak digambar terpisah
// (.lang = pilihan bahasa ID/EN/JA: satu kapsul utuh)
const CONTROL_SEL = 'button, .btn, .btn-close, [role="button"], [role="tab"], .lang'
// Tidak pernah digambar (hiasan / lapisan transparan)
const SKIP_SEL = '.lanyard__canvas, .scroll-progress, .custom-cursor, [data-skeleton-skip], .gh__tooltip, .skyline__hint'

const bones = ref([])
const shown = ref(false)
const fading = ref(false)
const root = document.documentElement
let frame = 0
let alive = true

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

function isTransparent(color) {
  return !color || color === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(color)
}

function radiusOf(cs, rect) {
  const r = parseFloat(cs.borderTopLeftRadius) || 0
  return Math.min(r, rect.height / 2, rect.width / 2)
}

function measure() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pageBg = getComputedStyle(document.body).backgroundColor
  const list = []
  const inView = (r) => r.width > 0.5 && r.height > 0.5 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw
  const add = (kind, r, radius = 0) => {
    if (list.length < MAX_BONES) list.push({ kind, x: r.left, y: r.top, w: r.width, h: r.height, radius })
  }
  const range = document.createRange()

  const visit = (el, isRoot = false) => {
    if (el.matches(SKIP_SEL)) return
    const cs = getComputedStyle(el)
    if (cs.display === 'none') return
    // Huruf yang belum "diketik" (v-type) sengaja disembunyikan tapi tetap memakan tempat
    if (cs.visibility === 'hidden' && !el.classList.contains('type-rest')) return
    if (!isRoot && cs.opacity === '0') return
    const rect = el.getBoundingClientRect()
    // Teks khusus pembaca layar (disembunyikan secara visual, ukuran 1px): lewati
    if (!isRoot && rect.width <= 1 && rect.height <= 1 && cs.overflow !== 'visible') return
    // Di luar layar: lewati beserta isinya (kecuali elemen fixed seperti navbar)
    const outside = rect.bottom < 0 || rect.top > vh || rect.right < 0 || rect.left > vw
    if (outside && cs.position !== 'fixed') return

    if (el.matches(BLOCK_SEL)) {
      if (inView(rect) && rect.width >= 6 && rect.height >= 6) add('block', rect, radiusOf(cs, rect))
      return
    }
    if (el.matches(CONTROL_SEL)) {
      if (inView(rect)) add('control', rect, radiusOf(cs, rect))
      return
    }

    // Teks yang baru diketik setelah loading (mis. peran di hero): pakai teks contohnya
    const ghost = el.dataset.skeletonGhost
    if (ghost && inView(rect)) {
      const ctx = (measure.canvas ??= document.createElement('canvas')).getContext('2d')
      ctx.font = cs.font
      const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2
      const h = Math.max(4, lineH * 0.62)
      const w = Math.min(ctx.measureText(ghost).width, vw - rect.left)
      add('text', { left: rect.left, top: rect.top + (rect.height - h) / 2, width: w, height: h }, Math.min(6, h / 2))
      return
    }

    if (inView(rect) && !isRoot) {
      const borders = ['Top', 'Right', 'Bottom', 'Left'].map(
        (side) => parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== 'none' && !isTransparent(cs[`border${side}Color`]),
      )
      const hasBg = !isTransparent(cs.backgroundColor) && cs.backgroundColor !== pageBg
      if ((borders.every(Boolean) || hasBg) && rect.width > 40 && rect.height > 24) {
        // Selebar layar (latar section): cukup warnanya, tanpa bingkai di tepi layar
        add(rect.width >= vw - 2 ? 'band' : 'panel', rect, radiusOf(cs, rect))
      } else {
        // Garis pemisah (border satu sisi) tetap digambar supaya struktur halaman terbaca
        if (borders[0]) add('line', { left: rect.left, top: rect.top, width: rect.width, height: 1 })
        if (borders[2]) add('line', { left: rect.left, top: rect.bottom - 1, width: rect.width, height: 1 })
        if (borders[3]) add('line', { left: rect.left, top: rect.top, width: 1, height: rect.height })
        if (borders[1]) add('line', { left: rect.right - 1, top: rect.top, width: 1, height: rect.height })
      }
    }

    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.data.trim()) continue
        range.selectNodeContents(child)
        for (const r of range.getClientRects()) {
          if (!inView(r) || r.width < 2) continue
          // Batang teks setinggi ±62% baris, di tengah baris (seperti huruf kecil + kapital)
          const h = Math.max(4, r.height * 0.62)
          add('text', { left: r.left, top: r.top + (r.height - h) / 2, width: r.width, height: h }, Math.min(6, h / 2))
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        visit(child)
      }
    }
  }

  const stage = document.querySelector('.app-stage')
  if (stage) visit(stage, true)
  document.querySelectorAll('.chat-widget__fab').forEach((el) => visit(el))
  bones.value = list
}

function scheduleMeasure() {
  if (frame || fading.value) return
  frame = requestAnimationFrame(() => {
    frame = 0
    measure()
  })
}

// Tunggu gambar yang terlihat di layar pertama selesai dimuat
function viewportImagesReady() {
  const vh = window.innerHeight
  const pending = [...document.querySelectorAll('.app-stage img')].filter((img) => {
    const r = img.getBoundingClientRect()
    return r.bottom > 0 && r.top < vh && !img.complete
  })
  return Promise.all(
    pending.map(
      (img) =>
        new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true })
          img.addEventListener('error', resolve, { once: true })
        }),
    ),
  )
}

onMounted(async () => {
  const started = performance.now()
  root.classList.add('skeleton-hold')

  // Halaman asli harus sudah dirender & font sudah dipakai, supaya ukurannya final
  await router.isReady()
  await nextTick()
  await Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(1200)])
  await nextFrame()
  if (!alive) return

  measure()
  shown.value = true
  window.addEventListener('resize', scheduleMeasure, { passive: true })
  window.addEventListener('scroll', scheduleMeasure, { passive: true })

  const left = Math.max(300, MAX_WAIT_MS - (performance.now() - started))
  await Promise.all([wait(MIN_SHOW_MS), Promise.race([viewportImagesReady(), wait(left)])])
  if (!alive) return

  // Halaman asli muncul di bawah, skeleton memudar di atasnya
  fading.value = true
  root.classList.remove('skeleton-hold')
  emit('reveal')
  await wait(FADE_MS)
  if (alive) emit('done')
})

onBeforeUnmount(() => {
  alive = false
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', scheduleMeasure)
  window.removeEventListener('scroll', scheduleMeasure)
  root.classList.remove('skeleton-hold')
})
</script>

<template>
  <div class="skeleton" :class="{ 'is-shown': shown, 'is-fading': fading }" aria-hidden="true">
    <span
      v-for="(bone, i) in bones"
      :key="i"
      class="skeleton__bone"
      :class="`skeleton__bone--${bone.kind}`"
      :style="{
        transform: `translate(${bone.x}px, ${bone.y}px)`,
        width: `${bone.w}px`,
        height: `${bone.h}px`,
        borderRadius: `${bone.radius}px`,
      }"
    ></span>
  </div>
</template>

<style>
/* Halaman asli dirender tapi tidak terlihat selama skeleton tampil
   (tata letaknya tetap ada, jadi bisa diukur). */
html.skeleton-hold .app-stage,
html.skeleton-hold .chat-widget,
html.skeleton-hold .top-btn {
  opacity: 0;
}
</style>

<style scoped>
.skeleton {
  --sk-base: color-mix(in srgb, var(--color-text) 7%, var(--color-bg));
  --sk-shine: color-mix(in srgb, var(--color-text) 15%, var(--color-bg));
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  background: var(--color-bg);
  pointer-events: none;
  transition: opacity 0.38s ease;
}

.skeleton.is-fading {
  opacity: 0;
}

.skeleton__bone {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.skeleton.is-shown .skeleton__bone {
  opacity: 1;
}

/* Kilau: satu sapuan cahaya untuk SEMUA tulang sekaligus (latar dipaku ke
   layar), jadi terlihat seperti satu cahaya yang melintas, bukan ratusan
   kilau terpisah. */
.skeleton__bone--text,
.skeleton__bone--control,
.skeleton__bone--block {
  background-color: var(--sk-base);
  background-image: linear-gradient(
    100deg,
    transparent 0%,
    transparent 38%,
    var(--sk-shine) 50%,
    transparent 62%,
    transparent 100%
  );
  background-size: 200vw 100%;
  background-attachment: fixed;
  background-repeat: no-repeat;
  animation: skeleton-shine 1.6s linear infinite;
}

/* Tombol sedikit lebih tegas dari teks, seperti tombol 3D aslinya */
.skeleton__bone--control {
  --sk-base: color-mix(in srgb, var(--color-text) 11%, var(--color-bg));
  box-shadow: 0 3px 0 color-mix(in srgb, var(--color-text) 6%, var(--color-bg));
}

/* Kartu / panel: bingkai tipis tanpa kilau, isinya digambar terpisah */
.skeleton__bone--panel {
  box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--color-text) 9%, transparent);
  background: color-mix(in srgb, var(--color-text) 2.5%, transparent);
}

.skeleton__bone--band {
  background: color-mix(in srgb, var(--color-text) 2.5%, transparent);
}

.skeleton__bone--line {
  background: color-mix(in srgb, var(--color-text) 10%, transparent);
}

@keyframes skeleton-shine {
  from {
    background-position: 100vw 0;
  }
  to {
    background-position: -100vw 0;
  }
}

/* Kilau ini penanda "sedang memuat" (bukan hiasan), jadi tetap jalan
   walau efek animasi dimatikan, hanya lebih pelan. Aturan global di
   main.css mematikan semua animasi, jadi dikecualikan dengan !important. */
@media (prefers-reduced-motion: reduce) {
  .skeleton__bone--text,
  .skeleton__bone--control,
  .skeleton__bone--block {
    animation-duration: 2.4s !important;
    animation-iteration-count: infinite !important;
  }
}
</style>
