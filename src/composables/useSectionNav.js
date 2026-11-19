import { useRoute, useRouter } from 'vue-router'
import { pages } from '@/router/pages'

export const navLinks = pages.map(({ path, sectionId, label, en, ja }) => ({
  path,
  sectionId,
  label: { id: label, en: en.label, ja: ja.label },
}))

export function useSectionNav() {
  const route = useRoute()
  const router = useRouter()

  function onNavClick(event, link) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()

    if (route.name === 'home') {
      const target = link.path === '/' ? null : document.getElementById(link.sectionId)
      if (target) target.scrollIntoView()
      else window.scrollTo({ top: 0 })
      return
    }
    if (route.path !== link.path) router.push(link.path)
    else window.scrollTo({ top: 0 })
  }

  return { route, onNavClick }
}
