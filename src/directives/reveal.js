/* ---------------------------------------------------------
   v-reveal: animasi "muncul" saat elemen masuk layar.
   Dipakai bersama oleh semua section.

   Cara pakai:
     v-reveal              fade + naik
     v-reveal.down         fade + turun
     v-reveal.left         masuk dari kiri
     v-reveal.right        masuk dari kanan
     v-reveal.scale        membesar sedikit + naik
     v-reveal.blur         dari buram ke tajam
     v-reveal.clip         teks "tersibak" dari atas ke bawah (cocok untuk judul)
     v-reveal="120"        angka = delay dalam ms
     v-reveal.stagger      anak-anak elemen muncul BERGANTIAN (elemen induknya diam)
     v-reveal.stagger="{ delay: 100, step: 70 }"
     Modifier arah bisa digabung dengan stagger, mis. v-reveal.stagger.scale
     v-reveal="{ delay: 120, onReveal: () => (sudahMuncul = true) }"
       onReveal dipanggil saat elemen mulai muncul, untuk animasi khusus
       di komponen (mis. galeri yang "terbuka" seperti kipas).
     v-reveal.intro        (untuk layar pertama) saat intro zoom kunjungan
       pertama diputar, elemen langsung tampil tanpa animasi. Animasinya
       memang tidak terlihat karena berjalan di balik intro, dan teks yang
       langsung tampil membuat halaman dinilai lebih cepat (LCP).

   Kenapa pakai Web Animations API (el.animate), bukan class CSS?
   - Animasi berjalan di atas style komponen, jadi TIDAK bentrok dengan
     transition/hover/transform milik komponen (mis. kartu yang naik saat hover).
   - Setelah selesai, efeknya hilang sendiri, jadi hover tidak ikut telat.
   - Yang dianimasikan hanya opacity, translate, scale, filter, clip-path
     (properti terpisah dari `transform`), aman untuk elemen yang punya transform.

   Optimasi per perangkat:
   - Desktop: jarak gerak & durasi penuh.
   - Tablet: jarak lebih pendek.
   - HP: jarak paling pendek, durasi lebih cepat, delay dipersingkat,
     arah kiri/kanan diganti naik (biar tidak ada geser horizontal),
     blur dimatikan (berat untuk GPU HP).
   - "Kurangi animasi" aktif (mis. Windows: Settings > Accessibility >
     Visual effects > Animation effects = Off): tetap ada efek, tapi sangat
     halus: fade + naik 8px saja, pelan, tanpa geser samping/zoom/blur.
     Gerak sekecil ini nyaman untuk yang sensitif gerak, dan situs tidak
     terasa "datar" di laptop Windows yang mematikan efek animasi.
   - Jenis perangkat dibaca ulang saat layar diputar / jendela di-resize,
     jadi elemen berikutnya memakai setelan yang sesuai ukuran terbaru.
   - Hemat untuk HP kelas bawah: animasi baru disiapkan saat elemen
     mendekati layar (sekitar 2 layar sebelumnya), bukan ratusan sekaligus
     saat halaman dibuka. Sambil menunggu, elemen disembunyikan lewat
     atribut data-reveal-wait (lihat main.css).

   Animasi baru dimulai setelah loader (TheLoader) selesai, supaya animasi
   di layar pertama benar-benar terlihat dan tidak "habis" di balik tirai loader.
--------------------------------------------------------- */
import { watch } from 'vue'
import { loaderDone, playsFullIntro } from '@/composables/useLoaderState'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const LOADER_FALLBACK_MS = 4500

const hasWindow = typeof window !== 'undefined'
const canAnimate =
  hasWindow &&
  typeof IntersectionObserver !== 'undefined' &&
  typeof Element !== 'undefined' &&
  typeof Element.prototype.animate === 'function'
const reduceMotion = hasWindow && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function readDeviceConfig() {
  if (reduceMotion) return { device: 'reduced', dist: 8, side: 0, dur: 700, delayScale: 0.5, step: 45 }
  const w = window.innerWidth
  if (w <= 640) return { device: 'phone', dist: 18, side: 0, dur: 620, delayScale: 0.6, step: 55 }
  if (w <= 960) return { device: 'tablet', dist: 24, side: 28, dur: 760, delayScale: 0.8, step: 65 }
  return { device: 'desktop', dist: 30, side: 44, dur: 880, delayScale: 1, step: 80 }
}

// Disimpan, dibaca ulang hanya setelah ukuran layar berubah (putar tablet, resize)
let cachedConfig = null
function deviceConfig() {
  if (!cachedConfig) cachedConfig = readDeviceConfig()
  return cachedConfig
}
if (hasWindow) {
  const reset = () => (cachedConfig = null)
  window.addEventListener('resize', reset, { passive: true })
  window.addEventListener('orientationchange', reset, { passive: true })
}

function keyframesFor(variant, c) {
  // Kurangi animasi: semua jenis jadi fade + naik sedikit
  if (c.device === 'reduced') return [{ opacity: 0, translate: `0 ${c.dist}px` }, { opacity: 1, translate: '0 0' }]

  // Di HP gerak samping diganti naik supaya tidak memicu scroll horizontal
  if (c.device === 'phone' && (variant === 'left' || variant === 'right')) variant = 'up'
  if (c.device === 'phone' && variant === 'blur') variant = 'up'

  const end = { opacity: 1, translate: '0 0' }

  switch (variant) {
    case 'down':
      return [{ opacity: 0, translate: `0 ${-c.dist}px` }, end]
    case 'left':
      return [{ opacity: 0, translate: `${-c.side}px 0` }, end]
    case 'right':
      return [{ opacity: 0, translate: `${c.side}px 0` }, end]
    case 'scale':
      return [
        { opacity: 0, translate: `0 ${Math.round(c.dist * 0.6)}px`, scale: '0.94' },
        { ...end, scale: '1' },
      ]
    case 'blur':
      return [
        { opacity: 0, translate: `0 ${Math.round(c.dist * 0.5)}px`, filter: 'blur(10px)' },
        { ...end, filter: 'blur(0px)' },
      ]
    case 'clip':
      return [
        { opacity: 0, translate: `0 ${Math.round(c.dist * 0.7)}px`, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, offset: 0.35 },
        { ...end, clipPath: 'inset(-20% -5% -20% -5%)' },
      ]
    default:
      return [{ opacity: 0, translate: `0 ${c.dist}px` }, end]
  }
}

function variantOf(modifiers) {
  for (const v of ['down', 'left', 'right', 'scale', 'blur', 'clip']) {
    if (modifiers[v]) return v
  }
  return 'up'
}

function optionsOf(value) {
  if (typeof value === 'number') return { delay: value }
  if (value && typeof value === 'object') return value
  return {}
}

/* ---- Satu animasi siap jalan, ditahan di frame pertama (tersembunyi) ---- */
function prepare(target, variant, delay, c, duration) {
  const anim = target.animate(keyframesFor(variant, c), {
    duration: duration ?? c.dur,
    delay: Math.round(delay * c.delayScale),
    easing: EASE,
    fill: 'backwards', // tahan keadaan awal selama delay
  })
  anim.pause()
  anim.currentTime = 0
  return anim
}

/* ---- Antrian elemen yang menunggu terlihat ---- */
const pending = new Map() // elemen -> daftar animasi
const callbacks = new WeakMap() // elemen -> { fn, delay } dari opsi onReveal
let observer = null

function play(el) {
  const anims = pending.get(el)
  if (!anims) return
  pending.delete(el)
  observer?.unobserve(el)
  anims.forEach((a) => a.play())
  const cb = callbacks.get(el)
  if (cb) setTimeout(cb.fn, cb.delay)
}

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Muncul saat masuk layar, ATAU kalau sudah terlewat (scroll super cepat)
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) play(entry.target)
      })
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

/* Jaring pengaman: kalau pengunjung scroll sangat cepat (atau lompat lewat
   link #kontak), elemen yang sudah terlewat tetap dimunculkan setelah scroll berhenti. */
let scrollIdle = null
function onScrollSettled() {
  clearTimeout(scrollIdle)
  scrollIdle = setTimeout(() => {
    const limit = window.innerHeight
    const due = []
    pending.forEach((_, el) => {
      if (el.getBoundingClientRect().top < limit) due.push(el)
    })
    due.forEach(play)
  }, 160)
}

/* ---- Siapkan animasi hanya saat elemen mendekati layar ---- */
const WAIT_ATTR = 'data-reveal-wait'
const lazy = new Map() // elemen -> fungsi penyiap animasinya
let prepObserver = null

function getPrepObserver() {
  if (prepObserver) return prepObserver
  prepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.boundingClientRect.bottom >= 0) return
        prepObserver.unobserve(entry.target)
        const arm = lazy.get(entry.target)
        lazy.delete(entry.target)
        arm?.()
      })
    },
    // Dua layar sebelum (dan sesudah) elemen terlihat
    { rootMargin: '200% 0px 200% 0px' },
  )
  return prepObserver
}

/* ---- Tunggu loader selesai baru mulai mengamati ---- */
let started = false
const waiting = new Set()

function startObserving(el) {
  if (!pending.has(el)) return
  getObserver().observe(el)
}

function start() {
  if (started) return
  started = true
  window.addEventListener('scroll', onScrollSettled, { passive: true })
  // 2 frame: biarkan keadaan tersembunyi sempat dilukis dulu
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      waiting.forEach(startObserving)
      waiting.clear()
    }),
  )
}

if (canAnimate) {
  if (loaderDone.value) start()
  else {
    const stop = watch(loaderDone, (done) => {
      if (!done) return
      stop()
      start()
    })
    // Kalau suatu saat loader dihapus, animasi tetap jalan
    setTimeout(start, LOADER_FALLBACK_MS)
  }
}

export const vReveal = {
  mounted(el, binding) {
    const opts = optionsOf(binding.value)

    const skipForIntro = binding.modifiers.intro && playsFullIntro && !loaderDone.value
    if (!canAnimate || skipForIntro) {
      // Tanpa animasi: semua langsung tampil, callback langsung dipanggil
      if (typeof opts.onReveal === 'function') opts.onReveal()
      return
    }

    const variant = variantOf(binding.modifiers)
    const baseDelay = opts.delay ?? 0
    const targets = () => (binding.modifiers.stagger ? Array.from(el.children) : [el])

    // Membuat animasinya (ditahan tersembunyi) lalu mendaftar ke antrian tampil
    const arm = () => {
      const c = deviceConfig()
      if (typeof opts.onReveal === 'function') {
        callbacks.set(el, { fn: opts.onReveal, delay: Math.round(baseDelay * c.delayScale) })
      }
      const step = opts.step ?? c.step
      const anims = targets().map((target, i) => {
        // Animasi dibuat dulu, baru penanda tunggu dilepas: tidak ada kedip
        const anim = prepare(target, variant, baseDelay + (binding.modifiers.stagger ? i * step : 0), c, opts.duration)
        target.removeAttribute(WAIT_ATTR)
        return anim
      })
      pending.set(el, anims)
      if (started) requestAnimationFrame(() => requestAnimationFrame(() => startObserving(el)))
      else waiting.add(el)
    }

    // Dekat layar (atau sudah terlewat): siapkan sekarang seperti biasa
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 2.5) {
      arm()
      return
    }

    // Jauh di bawah: sembunyikan dulu, siapkan saat mendekati layar
    targets().forEach((target) => target.setAttribute(WAIT_ATTR, ''))
    lazy.set(el, arm)
    getPrepObserver().observe(el)
  },

  unmounted(el) {
    if (lazy.has(el)) {
      lazy.delete(el)
      prepObserver?.unobserve(el)
    }
    const anims = pending.get(el)
    anims?.forEach((a) => a.cancel())
    pending.delete(el)
    waiting.delete(el)
    observer?.unobserve(el)
  },
}
