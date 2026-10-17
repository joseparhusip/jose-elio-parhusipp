<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { useTheme } from '@/composables/useTheme'

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Pengalaman', href: '#pengalaman' },
  { label: 'Proyek', href: '#proyek' },
  { label: 'Kontak', href: '#kontak' },
]

const { theme } = useTheme()
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const activeHref = ref('#beranda')

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

/* ---------------------------------------------------------
   Scroll-spy: menu yang sedang dilihat ditandai otomatis.
   Bagian aktif = bagian terakhir yang bagian atasnya sudah
   melewati 40% tinggi layar. Dihitung ulang tiap frame scroll.
--------------------------------------------------------- */
let frame = 0

function updateActive() {
  frame = 0
  isScrolled.value = window.scrollY > 12

  const line = window.innerHeight * 0.4
  let current = '#beranda'
  for (const link of navLinks) {
    const el = document.querySelector(link.href)
    if (el && el.getBoundingClientRect().top <= line) current = link.href
  }
  // Sudah mentok bawah: tandai menu terakhir
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    const last = navLinks[navLinks.length - 1]
    if (document.querySelector(last.href)) current = last.href
  }
  activeHref.value = current
}

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
})
</script>

<template>
  <header
    ref="headerEl"
    class="navbar"
    :class="{ 'navbar--scrolled': isScrolled, 'navbar--menu-open': isMenuOpen }"
  >
    <nav class="navbar__inner" aria-label="Navigasi utama">
      <a href="#beranda" class="navbar__logo" aria-label="Beranda" @click="closeMenu">
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
        <li v-for="link in navLinks" :key="link.href">
          <a
            :ref="(el) => setLinkRef(el, link.href)"
            :href="link.href"
            class="navbar__link"
            :class="{ 'navbar__link--active': activeHref === link.href }"
            :aria-current="activeHref === link.href ? 'true' : undefined"
            @mouseenter="hoverHref = link.href"
            @focus="hoverHref = link.href"
            @blur="hoverHref = null"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <div class="navbar__actions">
        <ThemeSwitch />
        <a href="#kontak" class="navbar__cta navbar__cta--desktop">
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
            :key="link.href"
            class="navbar__sheet-item"
            :style="{ '--i': index }"
          >
            <a
              :href="link.href"
              class="navbar__sheet-link"
              :class="{ 'navbar__sheet-link--active': activeHref === link.href }"
              @click="closeMenu"
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
          href="#kontak"
          class="navbar__cta navbar__cta--sheet"
          :style="{ '--i': navLinks.length }"
          @click="closeMenu"
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
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: var(--navbar-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
  transition:
    top 0.35s var(--ease-out),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.navbar__inner {
  position: relative;
  max-width: 1160px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  border: 1px solid transparent;
  transition:
    max-width 0.45s var(--ease-out),
    margin 0.45s var(--ease-out),
    padding 0.45s var(--ease-out),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Discroll (desktop): navbar "melayang" jadi pulau kapsul yang lebih ramping */
@media (min-width: 901px) {
  .navbar--scrolled {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .navbar--scrolled .navbar__inner {
    max-width: 1040px;
    margin-top: 0.75rem;
    padding: 0.45rem 0.55rem 0.45rem 1.2rem;
    border-radius: 999px;
    border: 1px solid var(--color-border);
    background: var(--navbar-bg-scrolled);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: var(--navbar-shadow);
  }
}

/* Discroll (HP & tablet): tetap full lebar, diberi garis + bayangan halus */
@media (max-width: 900px) {
  .navbar--scrolled {
    background: var(--navbar-bg-scrolled);
    border-bottom-color: var(--color-border);
    box-shadow: var(--navbar-shadow);
  }
}

/* ---- Logo ---- */
.navbar__logo {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s var(--ease-out);
}

.navbar__logo:hover {
  transform: rotate(-4deg) scale(1.04);
}

.navbar__logo-img {
  height: 38px;
  width: auto;
  display: block;
  object-fit: contain;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

/* ---- Menu desktop: kapsul di tengah ---- */
.navbar__links {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.15rem;
  list-style: none;
  margin: 0;
  padding: 0.3rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--navbar-toggle-bg);
}

.navbar__pill {
  position: absolute;
  top: 0.3rem;
  bottom: 0.3rem;
  left: 0;
  width: var(--pill-w);
  translate: var(--pill-x) 0;
  border-radius: 999px;
  background: var(--color-primary);
  box-shadow: 0 8px 18px -10px var(--color-primary);
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
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-text-soft, #5c6f69);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  white-space: nowrap;
  transition: color 0.25s ease;
}

.navbar__link:hover {
  color: var(--color-text);
}

/* Teks di atas pill: putih supaya terbaca di warna utama */
.navbar__links:not(:hover) .navbar__link--active,
.navbar__link:hover {
  color: #fff;
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
  gap: 0.8rem;
}

.navbar__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary, #6b9080);
  padding: 0.6rem 1.15rem 0.6rem 1.3rem;
  border-radius: 999px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 10px 22px -12px var(--color-primary);
  transition:
    background 0.2s ease,
    transform 0.25s var(--ease-out);
}

.navbar__cta svg {
  transition: transform 0.3s var(--ease-out);
}

.navbar__cta:hover {
  background: var(--color-primary-dark, #4f7566);
  transform: translateY(-1px);
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
  border-radius: 50%;
  background: var(--navbar-toggle-bg);
  border: 1px solid var(--color-border);
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease;
}

.navbar__toggle:hover {
  background: var(--navbar-toggle-bg-hover);
}

.navbar__toggle span {
  display: block;
  height: 2px;
  width: 18px;
  background: var(--color-text, #253632);
  border-radius: 2px;
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
  padding: calc(var(--nav-h, 72px) + 1.5rem) 1.5rem calc(1.5rem + env(safe-area-inset-bottom));
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
}

.navbar__sheet-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.05rem 0.25rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  text-decoration: none;
}

.navbar__sheet-num {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-soft);
  transition: color 0.25s ease;
}

.navbar__sheet-text {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 7vw, 2.2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.navbar__sheet-arrow {
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

.navbar__sheet-link--active .navbar__sheet-num {
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
    padding: 0.5rem 0.8rem;
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
    background: var(--navbar-dropdown-bg);
  }
}

@media (max-width: 480px) {
  .navbar__logo-img {
    height: 32px;
  }

  .navbar__inner {
    padding-left: 1.1rem;
    padding-right: 1.1rem;
  }
}
</style>
