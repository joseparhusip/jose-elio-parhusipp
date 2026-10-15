/* ---------------------------------------------------------
   v-reveal: animasi "muncul" halus saat elemen masuk viewport.
   Dipakai bersama oleh semua section (dulu disalin di tiap komponen).

   Pakai: v-reveal (fade + naik), v-reveal.scale, v-reveal.left, v-reveal.right
   Nilai opsional = delay dalam ms, untuk efek berurutan (stagger).
   Setelah animasi masuk selesai, delay dibuang dan elemen diberi class
   "reveal-done" supaya efek hover tidak ikut telat.
--------------------------------------------------------- */
let observer = null

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        el.classList.add('is-visible')
        observer.unobserve(el)
        const delay = parseFloat(el.style.transitionDelay) || 0
        setTimeout(() => {
          el.style.transitionDelay = '0ms'
          el.classList.add('reveal-done')
        }, delay + 900)
      })
    },
    { threshold: 0, rootMargin: '0px 0px -40px 0px' },
  )
  return observer
}

export const vReveal = {
  mounted(el, binding) {
    let variant = 'up'
    if (binding.modifiers.scale) variant = 'scale'
    else if (binding.modifiers.left) variant = 'left'
    else if (binding.modifiers.right) variant = 'right'

    el.classList.add('reveal', `reveal--${variant}`)
    el.style.transitionDelay = `${typeof binding.value === 'number' ? binding.value : 0}ms`

    const io = getObserver()
    if (!io) {
      el.classList.add('is-visible', 'reveal-done')
      return
    }
    // Tunggu 2 frame supaya kondisi tersembunyi sempat dilukis dulu
    requestAnimationFrame(() => requestAnimationFrame(() => io.observe(el)))
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
