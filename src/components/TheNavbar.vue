<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <nav class="navbar__inner">
      <a href="#beranda" class="navbar__logo" @click="closeMenu">
        Jose<span class="navbar__logo-dot">.</span>
      </a>

      <ul class="navbar__links" :class="{ 'navbar__links--open': isMenuOpen }">
        <li v-for="link in navLinks" :key="link.href">
          <a :href="link.href" class="navbar__link" @click="closeMenu">
            {{ link.label }}
          </a>
        </li>
        <li class="navbar__cta-wrap navbar__cta-wrap--mobile">
          <a href="#kontak" class="navbar__cta" @click="closeMenu">Hubungi Saya</a>
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

/* Discroll: lebar TETAP SAMA (full width), cuma dikasih jarak dikit dari atas
   biar ga mepet ke tepi layar, warna jadi gelap, ujung kiri-kanan jadi bulat,
   dan hover link jadi ijau. */
.navbar--scrolled {
  top: 0.75rem;
  background: rgba(37, 54, 50, 0.92);
  border-radius: 999px;
  box-shadow: 0 12px 30px -14px rgba(0, 0, 0, 0.45);
}

/* Saat kapsul (scrolled), teks & logo otomatis kontras terang di atas background gelap */
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

.navbar__links {
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

/* State DEFAULT (belum discroll / masih di area Home): efek biasa saja, cuma garis bawah tipis */
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

/* State SCROLLED: hover jadi pill highlight ala tab aktif di IDLIX, garis bawah dimatikan */
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

.navbar__cta-wrap--mobile {
  display: none;
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

/* tombol hamburger dibuat bulat penuh (setengah lingkaran kanan-kiri), bukan kotak */
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

.navbar__toggle--open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.navbar__toggle--open span:nth-child(2) {
  opacity: 0;
}

.navbar__toggle--open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 820px) {
  .navbar__toggle {
    display: flex;
  }

  .navbar__links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: var(--color-surface, #fff);
    border-bottom: 1px solid rgba(107, 144, 128, 0.15);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, background-color 0.3s ease;
  }

  .navbar__links--open {
    max-height: 400px;
  }

  .navbar__link {
    display: block;
    padding: 1rem 1.5rem;
  }

  .navbar__link::after {
    display: none;
  }

  .navbar__cta-wrap--mobile {
    display: block;
    margin: 0.5rem 1.5rem 1.25rem;
  }

  .navbar__cta {
    display: block;
    text-align: center;
  }

  .navbar__cta--desktop {
    display: none;
  }

  /* FIX: dropdown mobile ikut gelap saat navbar dalam state scrolled,
     supaya teks link (yang jadi terang di state ini) tetap kebaca.
     Sebelumnya background dropdown tetap putih -> teks terang jadi invisible. */
  .navbar--scrolled .navbar__links {
    background: rgba(37, 54, 50, 0.98);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>
