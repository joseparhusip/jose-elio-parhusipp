import { ref } from 'vue'

export const planeFlight = ref(null)

export function launchPaperPlane(fromEl) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = fromEl?.getBoundingClientRect?.()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height * 0.7 : window.innerHeight / 2
  planeFlight.value = { id: Date.now(), x, y }
}
