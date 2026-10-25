import { useRoute, useRouter } from 'vue-router'
import { pages } from '@/router/pages'

/* ---------------------------------------------------------
   Navigasi menu (navbar & footer).
   Link-nya alamat asli (/tentang, /proyek, ...) supaya Google
   mengenali tiap halaman. Tapi di beranda, klik menu tetap
   meluncur ke bagiannya seperti biasa, tanpa pindah halaman.
--------------------------------------------------------- */
export const navLinks = pages.map(({ path, sectionId, label }) => ({ path, sectionId, label }))

export function useSectionNav() {
  const route = useRoute()
  const router = useRouter()

  function onNavClick(event, link) {
    // Ctrl/Cmd/Shift + klik atau klik tengah: biarkan browser buka tab baru
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
