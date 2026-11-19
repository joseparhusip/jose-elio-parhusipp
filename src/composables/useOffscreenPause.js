import { nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

const SELECTOR = 'main section, main > .gh, footer'

export function useOffscreenPause() {
  const route = useRoute()
  let observer = null
  const watched = new Set()

  function scan() {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (watched.has(el)) return
      watched.add(el)
      observer.observe(el)
    })
    watched.forEach((el) => {
      if (el.isConnected) return
      observer.unobserve(el)
      watched.delete(el)
    })
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.removeAttribute('data-offscreen')
          else entry.target.setAttribute('data-offscreen', '')
        })
      },
      { rootMargin: '150px 0px' },
    )
    nextTick(scan)
    setTimeout(scan, 1500)
  })

  watch(
    () => route.fullPath,
    () => nextTick(() => setTimeout(scan, 300)),
  )

  onBeforeUnmount(() => observer?.disconnect())
}
