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
  if (c.device === 'reduced') return [{ opacity: 0, translate: `0 ${c.dist}px` }, { opacity: 1, translate: '0 0' }]

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

function prepare(target, variant, delay, c, duration) {
  const anim = target.animate(keyframesFor(variant, c), {
    duration: duration ?? c.dur,
    delay: Math.round(delay * c.delayScale),
    easing: EASE,
    fill: 'backwards',
  })
  anim.pause()
  anim.currentTime = 0
  return anim
}

const pending = new Map()
const callbacks = new WeakMap()
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
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) play(entry.target)
      })
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

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

const WAIT_ATTR = 'data-reveal-wait'
const lazy = new Map()
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
    { rootMargin: '200% 0px 200% 0px' },
  )
  return prepObserver
}

let started = false
const waiting = new Set()
const preArms = new Map()

function startObserving(el) {
  if (!pending.has(el)) return
  getObserver().observe(el)
}

function start() {
  if (started) return
  started = true
  preArms.forEach((arm) => arm())
  preArms.clear()
  window.addEventListener('scroll', onScrollSettled, { passive: true })
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
    setTimeout(start, LOADER_FALLBACK_MS)
  }
}

export const vReveal = {
  mounted(el, binding) {
    const opts = optionsOf(binding.value)

    const skipForIntro = binding.modifiers.intro && playsFullIntro && !loaderDone.value
    if (!canAnimate || skipForIntro) {
      if (typeof opts.onReveal === 'function') opts.onReveal()
      return
    }

    const variant = variantOf(binding.modifiers)
    const baseDelay = opts.delay ?? 0
    const targets = () => (binding.modifiers.stagger ? Array.from(el.children) : [el])

    const arm = () => {
      if (!started) {
        preArms.set(el, arm)
        return
      }
      const c = deviceConfig()
      if (typeof opts.onReveal === 'function') {
        callbacks.set(el, { fn: opts.onReveal, delay: Math.round(baseDelay * c.delayScale) })
      }
      const step = opts.step ?? c.step
      const anims = targets().map((target, i) => {
        const anim = prepare(target, variant, baseDelay + (binding.modifiers.stagger ? i * step : 0), c, opts.duration)
        target.removeAttribute(WAIT_ATTR)
        return anim
      })
      pending.set(el, anims)
      if (started) requestAnimationFrame(() => requestAnimationFrame(() => startObserving(el)))
      else waiting.add(el)
    }

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 2.5) {
      arm()
      return
    }

    targets().forEach((target) => target.setAttribute(WAIT_ATTR, ''))
    lazy.set(el, arm)
    getPrepObserver().observe(el)
  },

  unmounted(el) {
    preArms.delete(el)
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
