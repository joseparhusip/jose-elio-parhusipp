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
    // Alamat yang tidak ada: tampilkan halaman 404 (bukan dilempar ke beranda)
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        notFound: true,
        title: '404 — Halaman tidak ditemukan · Jose Elio Parhusip',
        description: 'Halaman yang kamu cari tidak ada atau sudah dipindahkan.',
      },
    },
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
  // Halaman 404 jangan sampai diindeks Google
  setMeta('meta[name="robots"]', 'content', page.notFound ? 'noindex, follow' : 'index, follow')
  document.title = page.title
  if (page.notFound) return

  const url = SITE_URL + (page.path === '/' ? '/' : page.path)
  setMeta('meta[name="description"]', 'content', page.description)
  setMeta('link[rel="canonical"]', 'href', url)
  setMeta('meta[property="og:title"]', 'content', page.title)
  setMeta('meta[property="og:description"]', 'content', page.description)
  setMeta('meta[property="og:url"]', 'content', url)
})

export default router
