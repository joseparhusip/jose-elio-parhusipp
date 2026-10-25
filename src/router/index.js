import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { SITE_URL, pages } from './pages'

const routes = pages.map((page) =>
  page.name === 'home'
    ? { path: page.path, name: page.name, component: HomeView, meta: page }
    : {
        path: page.path,
        name: page.name,
        // route level code-splitting: tiap halaman dimuat saat dibuka
        component: () => import('../views/SectionView.vue'),
        props: { section: page.sectionId },
        meta: page,
      },
)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    // Alamat lama
    { path: '/about', redirect: '/tentang' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    // Link lama seperti /#kontak tetap meluncur ke bagiannya
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  },
})

/* ---------------------------------------------------------
   Judul tab, deskripsi, canonical & Open Graph ikut halaman.
   Versi statisnya juga ditulis saat build oleh
   scripts/prerender-pages.js, supaya Google langsung membacanya.
--------------------------------------------------------- */
function setMeta(selector, attr, value) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

router.afterEach((to) => {
  const page = to.meta
  if (!page?.title) return
  const url = SITE_URL + (page.path === '/' ? '/' : page.path)

  document.title = page.title
  setMeta('meta[name="description"]', 'content', page.description)
  setMeta('link[rel="canonical"]', 'href', url)
  setMeta('meta[property="og:title"]', 'content', page.title)
  setMeta('meta[property="og:description"]', 'content', page.description)
  setMeta('meta[property="og:url"]', 'content', url)
})

export default router
