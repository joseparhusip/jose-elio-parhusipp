<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Pengalaman', href: '#pengalaman' },
  { label: 'Proyek', href: '#proyek' },
  { label: 'Kontak', href: '#kontak' },
]

const isMenuOpen = ref(false)
const isScrolled = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 12
}

// Kunci scroll body pas menu mobile lagi kebuka, biar nggak scroll dobel
watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <nav class="navbar__inner">
      <a href="#beranda" class="navbar__logo" @click="closeMenu">
        Jose<span class="navbar__logo-dot">.</span>
      </a>

      <ul class="navbar__links navbar__links--desktop">
        <li v-for="link in navLinks" :key="link.href">
          <a :href="link.href" class="navbar__link" @click="closeMenu">
            {{ link.label }}
          </a>
        </li>
      </ul>

      <div class="navbar__actions">
        <a href="#kontak" class="navbar__cta navbar__cta--desktop" @click="closeMenu">Hubungi Saya</a>

        <button
          class="navbar__toggle"
          :class="{ 'navbar__toggle--open': isMenuOpen }"
          type="button"
          aria-label="Buka menu navigasi"
          :aria-expanded="isMenuOpen"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <!-- Overlay gelap di belakang menu mobile -->
    <Transition name="fade">
      <div v-if="isMenuOpen" class="navbar__overlay" @click="closeMenu"></div>
    </Transition>

    <!-- Panel menu mobile, solid & di atas semua konten -->
    <Transition name="slide">
      <div v-if="isMenuOpen" class="navbar__mobile-panel">
        <ul class="navbar__mobile-links">
          <li v-for="link in navLinks" :key="link.href">
            <a :href="link.href" class="navbar__mobile-link" @click="closeMenu">
              {{ link.label }}
            </a>
          </li>
        </ul>
        <a href="#kontak" class="navbar__cta navbar__cta--mobile" @click="closeMenu">Hubungi Saya</a>
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
  background: rgba(241, 244, 241, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 0;
  transition: top 0.3s ease, background 0.3s ease, border-radius 0.3s ease,
    box-shadow 0.3s ease;
}

.navbar__inner {
  max-width: 1160px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar--scrolled {
  top: 0.75rem;
  background: rgba(37, 54, 50, 0.92);
  border-radius: 999px;
  box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.45);
}

.navbar--scrolled .navbar__logo,
.navbar--scrolled .navbar__link {
  color: #f1f4f1;
}

.navbar--scrolled .navbar__link:hover {
  color: #fff;
}

.navbar--scrolled .navbar__toggle {
  background: rgba(255, 255, 255, 0.12);
}

.navbar--scrolled .navbar__toggle:hover {
  background: rgba(255, 255, 255, 0.22);
}

.navbar--scrolled .navbar__toggle span {
  background: #f1f4f1;
}

.navbar__logo {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-text, #253632);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.navbar__logo-dot {
  color: var(--color-accent, #f2a488);
}

.navbar__links--desktop {
  display: flex;
  align-items: center;
  gap: 2.1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar__link {
  position: relative;
  display: inline-block;
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-soft, #5c6f69);
  text-decoration: none;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.navbar__link::after {
  content: '';
  position: absolute;
  left: 0.9rem;
  right: 0.9rem;
  bottom: 0.05rem;
  height: 2px;
  width: 0;
  background: var(--color-primary, #6b9080);
  transition: width 0.25s ease;
}

.navbar__link:hover {
  color: var(--color-text, #253632);
}

.navbar__link:hover::after {
  width: calc(100% - 1.8rem);
}

.navbar--scrolled .navbar__link::after {
  display: none;
}

.navbar--scrolled .navbar__link:hover {
  background: rgba(107, 144, 128, 0.12);
  color: var(--color-text, #253632);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.navbar__cta {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary, #6b9080);
  padding: 0.6rem 1.3rem;
  border-radius: 999px;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}

.navbar__cta:hover {
  background: var(--color-primary-dark, #4f7566);
  transform: translateY(-1px);
}

.navbar__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(107, 144, 128, 0.08);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease;
  position: relative;
  z-index: 210;
}

.navbar__toggle:hover {
  background: rgba(107, 144, 128, 0.16);
}

.navbar__toggle span {
  display: block;
  height: 2px;
  width: 16px;
  background: var(--color-text, #253632);
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.navbar--scrolled .navbar__toggle--open span {
  background: #f1f4f1;
}

.navbar__toggle--open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.navbar__toggle--open span:nth-child(2) {
  opacity: 0;
}

.navbar__toggle--open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Overlay gelap di belakang panel mobile */
.navbar__overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 20, 0.55);
  z-index: 190;
}

/* Panel menu mobile — dropdown dari atas, full width, solid */
.navbar__mobile-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 18px 40px -20px rgba(0, 0, 0, 0.35);
  z-index: 200;
  padding: 6.5rem 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-height: 85vh;
  overflow-y: auto;
}

.navbar__mobile-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.navbar__mobile-link {
  display: block;
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text, #253632);
  text-decoration: none;
  padding: 0.85rem 0.25rem;
  border-bottom: 1px solid rgba(107, 144, 128, 0.14);
  transition: color 0.2s ease;
}

.navbar__mobile-link:hover {
  color: var(--color-primary, #6b9080);
}

.navbar__cta--mobile {
  text-align: center;
  display: block;
}

.navbar__cta--desktop {
  display: inline-block;
}

/* Transisi overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transisi slide panel dari atas */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
}

@media (max-width: 820px) {
  .navbar__toggle {
    display: flex;
  }

  .navbar__links--desktop {
    display: none;
  }

  .navbar__cta--desktop {
    display: none;
  }
}
</style>
