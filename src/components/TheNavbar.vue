<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { useTheme } from '@/composables/useTheme'
import { navLinks, useSectionNav } from '@/composables/useSectionNav'

const homeLink = navLinks[0]
const contactLink = navLinks[navLinks.length - 1]

const { theme } = useTheme()
const { route, onNavClick } = useSectionNav()
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const activeHref = ref(route.path)

function onLinkClick(event, link) {
  closeMenu()
  onNavClick(event, link)
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

/* ---------------------------------------------------------
   Menu aktif.
   - Di beranda (scroll-spy): bagian aktif = bagian terakhir yang
     bagian atasnya sudah melewati 40% tinggi layar.
   - Di halaman lain (/tentang, dst.): ikut alamat halaman.
--------------------------------------------------------- */
let frame = 0

function updateActive() {
  frame = 0
  isScrolled.value = window.scrollY > 12

  if (route.name !== 'home') {
    activeHref.value = route.path
    return
  }

  const line = window.innerHeight * 0.4
  let current = homeLink.path
  for (const link of navLinks) {
    const el = document.getElementById(link.sectionId)
    if (el && el.getBoundingClientRect().top <= line) current = link.path
  }
  // Sudah mentok bawah: tandai menu terakhir
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    if (document.getElementById(contactLink.sectionId)) current = contactLink.path
  }
  activeHref.value = current
}

// Pindah halaman: tunggu isi halaman baru tampil, lalu hitung ulang
watch(
  () => route.path,
  () => nextTick(updateActive),
)

function onScroll() {
  if (!frame) frame = requestAnimationFrame(updateActive)
}

/* ---------------------------------------------------------
   Pill penanda yang meluncur di bawah menu aktif (desktop).
   Saat kursor di atas menu lain, pill ikut pindah ke sana.
--------------------------------------------------------- */
const linkEls = ref({})
const hoverHref = ref(null)
const pill = ref({ x: 0, w: 0, ready: false })

function setLinkRef(el, href) {
  if (el) linkEls.value[href] = el
}

function updatePill() {
  const el = linkEls.value[hoverHref.value || activeHref.value]
  if (!el || !el.offsetWidth) return
  pill.value = { x: el.offsetLeft, w: el.offsetWidth, ready: true }
}

watch([activeHref, hoverHref], () => nextTick(updatePill))

/* ---------------------------------------------------------
   Menu HP: layar penuh, scroll halaman dikunci selama terbuka,
   bisa ditutup dengan tombol Esc.
--------------------------------------------------------- */
const headerEl = ref(null)

watch(isMenuOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  // Tombol melayang (chat, ke atas) disembunyikan selama menu terbuka, lihat main.css
  document.documentElement.classList.toggle('nav-menu-open', open)
  // Panel menu dimulai tepat di bawah navbar
  if (open && headerEl.value) {
    headerEl.value.style.setProperty('--nav-h', `${headerEl.value.offsetHeight}px`)
  }
})

function onKeydown(event) {
  if (event.key === 'Escape' && isMenuOpen.value) closeMenu()
}

function onResize() {
  if (window.innerWidth > 900 && isMenuOpen.value) closeMenu()
  onScroll()
  updatePill()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('keydown', onKeydown)
  updateActive()
  // Font web bisa selesai dimuat belakangan dan mengubah lebar menu
  document.fonts?.ready.then(updatePill)
  nextTick(updatePill)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
  document.documentElement.classList.remove('nav-menu-open')
})
</script>

<template>
  <header
    ref="headerEl"
    class="navbar"
    :class="{ 'navbar--scrolled': isScrolled, 'navbar--menu-open': isMenuOpen }"
  >
    <nav class="navbar__inner" aria-label="Navigasi utama">
      <a :href="homeLink.path" class="navbar__logo" aria-label="Beranda" @click="onLinkClick($event, homeLink)">
        <img
          :src="theme === 'light' ? '/logo-navbar-sebelum-scroll.png' : '/logo-navbar-footer.png'"
          alt="Jose Elio Parhusip"
          class="navbar__logo-img"
          draggable="false"
        />
      </a>

      <!-- Desktop: menu di dalam kapsul dengan pill penanda yang meluncur -->
      <ul class="navbar__links" @mouseleave="hoverHref = null">
        <span
          class="navbar__pill"
          :class="{ 'navbar__pill--ready': pill.ready }"
          :style="{ '--pill-x': `${pill.x}px`, '--pill-w': `${pill.w}px` }"
          aria-hidden="true"
        ></span>
        <li v-for="link in navLinks" :key="link.path">
          <a
            :ref="(el) => setLinkRef(el, link.path)"
            :href="link.path"
            class="navbar__link"
            :class="{ 'navbar__link--active': activeHref === link.path }"
            :aria-current="activeHref === link.path ? 'page' : undefined"
            @click="onLinkClick($event, link)"
            @mouseenter="hoverHref = link.path"
            @focus="hoverHref = link.path"
            @blur="hoverHref = null"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <div class="navbar__actions">
        <ThemeSwitch />
        <a :href="contactLink.path" class="navbar__cta navbar__cta--desktop" @click="onLinkClick($event, contactLink)">
          Hubungi Saya
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
              stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>

        <button
          class="navbar__toggle"
          :class="{ 'navbar__toggle--open': isMenuOpen }"
          type="button"
          :aria-label="isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'"
          :aria-expanded="isMenuOpen"
          aria-controls="navbar-sheet"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <!-- HP & tablet: menu layar penuh -->
    <Transition name="sheet">
      <div v-if="isMenuOpen" id="navbar-sheet" class="navbar__sheet">
        <span class="navbar__sheet-label">Menu</span>
        <ul class="navbar__sheet-links">
          <li
            v-for="(link, index) in navLinks"
            :key="link.path"
            class="navbar__sheet-item"
            :style="{ '--i': index }"
          >
            <a
              :href="link.path"
              class="navbar__sheet-link"
              :class="{ 'navbar__sheet-link--active': activeHref === link.path }"
              @click="onLinkClick($event, link)"
            >
              <span class="navbar__sheet-num">0{{ index + 1 }}</span>
              <span class="navbar__sheet-text">{{ link.label }}</span>
              <svg class="navbar__sheet-arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </li>
        </ul>

        <a
          :href="contactLink.path"
          class="navbar__cta navbar__cta--sheet"
          :style="{ '--i': navLinks.length }"
          @click="onLinkClick($event, contactLink)"
        >
          Hubungi Saya
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
              stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* =========================================================
   Navbar "Field Notes": bar datar, garis tipis di bawah saat
   discroll, menu teks biasa dengan garis bawah biru yang
   meluncur ke menu aktif / yang disorot.
   ========================================================= */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: var(--color-bg);
  border-bottom: 1px solid transparent;
  transition:
    background 0.3s ease,
    border-color 0.3s ease;
}

.navbar--scrolled {
  background: var(--navbar-bg-scrolled);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: var(--color-rule);
}

.navbar__inner {
  position: relative;
  max-width: var(--container);
  margin: 0 auto;
  padding: 0.95rem var(--gutter);
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  transition: padding 0.35s var(--ease-out);
}

.navbar--scrolled .navbar__inner {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}

/* ---- Logo ---- */
.navbar__logo {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.navbar__logo-img {
  height: 36px;
  width: auto;
  display: block;
  object-fit: contain;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

/* ---- Menu desktop: teks biasa + garis bawah ---- */
.navbar__links {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Penanda menu aktif: garis tipis biru di bawah teks */
.navbar__pill {
  position: absolute;
  bottom: 0.15rem;
  left: 0;
  height: 2px;
  width: var(--pill-w);
  translate: var(--pill-x) 0;
  background: var(--color-primary);
  transform: scaleX(0.55);
  opacity: 0;
  pointer-events: none;
}

.navbar__pill--ready {
  opacity: 1;
  transition:
    translate 0.45s var(--ease-out),
    width 0.45s var(--ease-out);
}

.navbar__link {
  position: relative;
  z-index: 1;
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-soft);
  text-decoration: none;
  padding: 0.5rem 0.9rem;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.navbar__links:not(:hover) .navbar__link--active,
.navbar__link:hover {
  color: var(--color-text);
}

.navbar__link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* ---- Aksi kanan ---- */
.navbar__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.navbar__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-family: var(--font-body);
  font-size: 0.86rem;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary);
  padding: 0.6rem 1rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.navbar__cta svg {
  transition: transform 0.3s var(--ease-out);
}

.navbar__cta:hover {
  background: var(--color-primary-dark);
}

.navbar__cta:hover svg {
  transform: rotate(45deg);
}

/* ---- Tombol menu HP: dua garis yang jadi silang ---- */
.navbar__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid var(--color-rule);
  cursor: pointer;
  padding: 0;
  transition: border-color 0.2s ease;
}

.navbar__toggle:hover {
  border-color: var(--color-text);
}

.navbar__toggle span {
  display: block;
  height: 1.5px;
  width: 18px;
  background: var(--color-text);
  transition: transform 0.35s var(--ease-out), width 0.35s var(--ease-out);
}

.navbar__toggle span:nth-child(2) {
  width: 12px;
  align-self: center;
  translate: 3px 0;
}

.navbar__toggle--open span:nth-child(1) {
  transform: translateY(4px) rotate(45deg);
}

.navbar__toggle--open span:nth-child(2) {
  width: 18px;
  translate: 0 0;
  transform: translateY(-4px) rotate(-45deg);
}

/* ---- Menu layar penuh (HP & tablet) ---- */
/* Panel menutup seluruh layar, di belakang isi navbar (z-index -1 di dalam
   header), jadi logo & tombol silang tetap terlihat di atasnya */
.navbar__sheet {
  position: fixed;
  inset: 0;
  z-index: -1;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: calc(var(--nav-h, 72px) + 1.5rem) var(--gutter) calc(1.5rem + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: var(--color-bg);
  overflow-y: auto;
}

.navbar__sheet-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.navbar__sheet-links {
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-rule);
}

.navbar__sheet-link {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--color-rule);
  color: var(--color-text);
  text-decoration: none;
}

.navbar__sheet-num {
  min-width: 2rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-soft);
  transition: color 0.25s ease;
}

.navbar__sheet-text {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 9vw, 2.8rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
}

.navbar__sheet-arrow {
  align-self: center;
  margin-left: auto;
  color: var(--color-text-soft);
  transition:
    transform 0.3s var(--ease-out),
    color 0.25s ease;
}

.navbar__sheet-link:hover .navbar__sheet-arrow,
.navbar__sheet-link--active .navbar__sheet-arrow {
  color: var(--color-primary);
  transform: rotate(45deg);
}

.navbar__sheet-link--active .navbar__sheet-num,
.navbar__sheet-link--active .navbar__sheet-text {
  color: var(--color-primary);
}

.navbar__cta--sheet {
  margin-top: auto;
  padding: 1rem 1.5rem;
  font-size: 1rem;
}

/* Animasi buka/tutup menu: panel turun, item muncul bergantian */
.sheet-enter-active,
.sheet-leave-active {
  transition:
    opacity 0.35s ease,
    clip-path 0.5s var(--ease-out);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  clip-path: inset(0 0 100% 0);
}

.sheet-enter-to,
.sheet-leave-from {
  clip-path: inset(0 0 0 0);
}

.sheet-enter-active .navbar__sheet-item,
.sheet-enter-active .navbar__cta--sheet {
  animation: sheet-item-in 0.55s var(--ease-out) backwards;
  animation-delay: calc(120ms + var(--i) * 60ms);
}

@keyframes sheet-item-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

/* ---- Breakpoint ---- */
@media (max-width: 1080px) {
  .navbar__link {
    padding: 0.5rem 0.7rem;
  }
}

@media (max-width: 900px) {
  .navbar__inner {
    display: flex;
    justify-content: space-between;
  }

  .navbar__links,
  .navbar__cta--desktop {
    display: none;
  }

  .navbar__toggle {
    display: flex;
  }

  /* Menu terbuka: navbar jadi solid supaya menyatu dengan panel */
  .navbar--menu-open {
    background: var(--color-bg);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (max-width: 480px) {
  .navbar__logo-img {
    height: 32px;
  }
}
</style>
