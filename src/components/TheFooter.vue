<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { vReveal } from '@/directives/reveal'
import linkedinIcon from '@/components/icons/icons-about/linkedin-svgrepo-com.svg'
import instagramIcon from '@/components/icons/icons-about/instagram-2016-logo-svgrepo-com.svg'
import { navLinks, useSectionNav } from '@/composables/useSectionNav'

const { onNavClick } = useSectionNav()

const year = new Date().getFullYear()

const socials = [
  { name: 'GitHub', handle: '@joseparhusip', href: 'https://github.com/joseparhusip', icon: null },
  { name: 'LinkedIn', handle: 'in/joseparhusip', href: 'https://www.linkedin.com/in/joseparhusip/', icon: linkedinIcon },
  { name: 'Instagram', handle: '@joseparhusip_', href: 'https://www.instagram.com/joseparhusip_/', icon: instagramIcon },
]

// Pita teks berjalan: bidang yang dikerjakan (sama dengan "Fokus" di beranda)
const marqueeItems = ['Web Landing Page', 'Web E-commerce', 'Mobile App', 'Data', 'Dashboard BI', 'AI']

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Tombol kembali ke atas: melayang di layar, hanya muncul setelah scroll ke bawah
const showTopBtn = ref(false)

function handleScroll() {
  showTopBtn.value = window.scrollY > 400
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

/* Jam lokal Bandung (WIB), diperbarui tiap 30 detik */
const localTime = ref('')
let clockId = null

function updateClock() {
  localTime.value = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

onMounted(() => {
  updateClock()
  clockId = setInterval(updateClock, 30000)
})

onUnmounted(() => {
  clearInterval(clockId)
})

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}
</script>

<template>
  <footer class="footer">
    <span class="footer__grid-bg" aria-hidden="true"></span>
    <span class="footer__glow" aria-hidden="true"></span>

    <!-- Pita teks berjalan -->
    <div class="footer__marquee" aria-hidden="true">
      <div v-for="copy in 2" :key="copy" class="footer__marquee-track">
        <span v-for="item in marqueeItems" :key="item" class="footer__marquee-item">
          {{ item }}<span class="footer__marquee-star">✦</span>
        </span>
      </div>
    </div>

    <div class="footer__inner">
      <!-- Kolom informasi -->
      <div v-reveal.stagger="{ delay: 60, step: 90 }" class="footer__grid">
        <div class="footer__brand">
          <a :href="navLinks[0].path" class="footer__logo" aria-label="Kembali ke beranda" @click="onNavClick($event, navLinks[0])">
            <img src="/logo-navbar-footer.png" alt="Jose Elio Parhusip" class="footer__logo-img" draggable="false" />
          </a>
          <p class="footer__name">Jose Elio Parhusip</p>
          <p class="footer__role">Full Stack · Flutter · Data</p>
          <span class="footer__clock">
            <span class="footer__clock-dot" aria-hidden="true"></span>
            Bandung · {{ localTime }} WIB
          </span>
        </div>

        <nav class="footer__col" aria-label="Navigasi footer">
          <h3 class="footer__heading">Navigasi</h3>
          <ul class="footer__list">
            <li v-for="link in navLinks" :key="link.path">
              <a :href="link.path" class="footer__link" @click="onNavClick($event, link)">
                <span class="footer__link-dash" aria-hidden="true"></span>
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>

        <div class="footer__col">
          <h3 class="footer__heading">Sosial Media</h3>
          <ul class="footer__list footer__list--social">
            <li v-for="item in socials" :key="item.name">
              <a
                :href="item.href"
                class="footer__social"
                target="_blank"
                rel="noopener noreferrer"
                oncontextmenu="return false"
                @contextmenu.prevent="preventImageAction"
              >
                <span class="footer__social-icon" aria-hidden="true">
                  <svg v-if="!item.icon" viewBox="0 0 24 24" class="footer__social-svg">
                    <path
                fill="currentColor"
                d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.78 10.77.57.1.78-.25.78-.55
                   0-.27-.01-1-.02-1.96-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66
                   -1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94
                   .1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04
                   -.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.16a10.9 10.9 0 0 1 5.74 0
                   c2.19-1.47 3.15-1.16 3.15-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04
                   0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1 0 1.51-.01 2.73-.01 3.1
                   0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z"
              />
                  </svg>
                  <img
                    v-else
                    :src="item.icon"
                    alt=""
                    class="footer__social-img"
                    draggable="false"
                    oncontextmenu="return false"
                    @contextmenu.prevent="preventImageAction"
                    @dragstart.prevent="preventImageAction"
                  />
                </span>
                <span class="footer__social-text">
                  <span class="footer__social-name">{{ item.name }}</span>
                  <span class="footer__social-handle">{{ item.handle }}</span>
                </span>
                <svg class="footer__social-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Baris bawah -->
      <div v-reveal="100" class="footer__bottom">
        <p class="footer__copyright">&copy; {{ year }} Jose Elio Parhusip. Semua hak dilindungi.</p>
        <button type="button" class="footer__back" @click="scrollToTop">
          Kembali ke atas
          <span class="footer__back-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="15" height="15">
              <path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </footer>

  <!-- Tombol kembali ke atas: melayang di pojok kanan bawah layar -->
  <Transition name="top-btn-fade">
    <button
      v-if="showTopBtn"
      class="top-btn"
      type="button"
      @click="scrollToTop"
      aria-label="Kembali ke atas"
      title="Kembali ke atas"
    >
      <svg viewBox="0 0 24 24" class="top-btn__icon" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 19V5M5 12l7-7 7 7"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.footer {
  --line: rgba(238, 243, 239, 0.16);
  --soft: rgba(238, 243, 239, 0.72);
  --muted: rgba(238, 243, 239, 0.52);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: var(--color-primary-dark);
  color: #eef3ef;
  padding: clamp(1.5rem, 4vw, 2.5rem) 0 0;
}

/* Pola grid tipis + cahaya, senada dengan hero */
.footer__grid-bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px) 0 0 / 56px 56px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px) 0 0 / 56px 56px;
  mask-image: linear-gradient(to bottom, #000 0%, transparent 70%);
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 70%);
}

.footer__glow {
  position: absolute;
  z-index: -1;
  top: -30%;
  right: -10%;
  width: 60%;
  height: 90%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(79, 214, 192, 0.24), transparent);
  filter: blur(20px);
  pointer-events: none;
}

.footer__inner {
  max-width: calc(var(--container) - 2 * var(--gutter));
  margin: 0 auto;
  padding: 0 var(--gutter);
  box-sizing: content-box;
}

/* ---- Pita teks berjalan ---- */
.footer__marquee {
  display: flex;
  overflow: hidden;
  margin: 0 0 clamp(2.5rem, 6vw, 3.5rem);
  padding: 1rem 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}

.footer__marquee-track {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  animation: footer-marquee 32s linear infinite;
}

.footer__marquee:hover .footer__marquee-track {
  animation-play-state: paused;
}

.footer__marquee-item {
  display: inline-flex;
  align-items: center;
  gap: clamp(1rem, 2.5vw, 2rem);
  padding-right: clamp(1rem, 2.5vw, 2rem);
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3.6vw, 2.8rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1px rgba(238, 243, 239, 0.45);
  transition: color 0.3s ease;
}

.footer__marquee-item:nth-child(even) {
  color: #fff;
  -webkit-text-stroke: 0;
}

.footer__marquee-star {
  font-size: 0.55em;
  color: #4fd6c0;
  -webkit-text-stroke: 0;
}

@keyframes footer-marquee {
  to { transform: translateX(-100%); }
}

/* ---- Kolom informasi ---- */
.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.1fr;
  gap: 2.5rem;
  padding-bottom: clamp(2.25rem, 5vw, 3rem);
}

.footer__logo {
  display: inline-flex;
  text-decoration: none;
}

.footer__logo-img {
  height: 44px;
  width: auto;
  display: block;
  object-fit: contain;
  /* Logo aslinya berwarna; dijadikan putih agar senada dengan footer */
  filter: brightness(0) invert(1);
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.footer__name {
  margin: 1.1rem 0 0;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #fff;
}

.footer__role {
  margin: 0.25rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted);
}

.footer__clock {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--soft);
}

.footer__clock-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4fd6c0;
  box-shadow: 0 0 0 4px rgba(79, 214, 192, 0.18);
}

.footer__heading {
  margin: 0 0 1.1rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.footer__list {
  display: grid;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer__link {
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
  color: rgba(238, 243, 239, 0.88);
  text-decoration: none;
  transition: color 0.25s ease;
}

/* Garis kecil yang memanjang dari kiri saat hover */
.footer__link-dash {
  display: inline-block;
  width: 0;
  height: 1px;
  margin-right: 0;
  background: #4fd6c0;
  transition:
    width 0.3s var(--ease-out),
    margin-right 0.3s var(--ease-out);
}

.footer__link:hover {
  color: #4fd6c0;
}

.footer__link:hover .footer__link-dash {
  width: 14px;
  margin-right: 0.5rem;
}

.footer__list--social {
  gap: 0.5rem;
}

.footer__social {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.04);
  color: #eef3ef;
  text-decoration: none;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.3s var(--ease-out);
}

.footer__social:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(238, 243, 239, 0.4);
  transform: translateX(4px);
}

.footer__social-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.footer__social-svg {
  width: 17px;
  height: 17px;
}

.footer__social-img {
  width: 17px;
  height: 17px;
  object-fit: contain;
  display: block;
  filter: brightness(0) invert(1);
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.footer__social-text {
  display: grid;
  min-width: 0;
  line-height: 1.25;
}

.footer__social-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.footer__social-handle {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--muted);
}

.footer__social-arrow {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--muted);
  transition:
    color 0.25s ease,
    transform 0.3s var(--ease-out);
}

.footer__social:hover .footer__social-arrow {
  color: #4fd6c0;
  transform: rotate(45deg);
}

/* ---- Baris bawah ---- */
.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.8rem 1rem;
  padding: 1.4rem 0 1.6rem;
  border-top: 1px solid var(--line);
}

.footer__copyright {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted);
}

.footer__back {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0;
  border: 0;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--soft);
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer__back-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--line);
  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.3s var(--ease-out);
}

.footer__back:hover {
  color: #fff;
}

.footer__back:hover .footer__back-icon {
  background: #fff;
  color: #2b2470;
  transform: translateY(-3px);
}

/* ---- Tombol melayang kembali ke atas ---- */
.top-btn {
  position: fixed;
  right: 1.5rem;
  /* Digeser ke atas biar gak numpuk sama bubble ChatWidget yang juga
     fixed di pojok kanan bawah (right/bottom 1.5rem, tinggi 58px). */
  bottom: 6rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 14px 28px -12px rgba(0, 0, 0, 0.5);
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.top-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 18px 32px -12px rgba(0, 0, 0, 0.55);
}

.top-btn__icon {
  width: 20px;
  height: 20px;
}

.top-btn-fade-enter-active,
.top-btn-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.top-btn-fade-enter-from,
.top-btn-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Pita teks tetap bergerak walaupun "Animation effects" di Windows/HP dimatikan.
   main.css punya aturan global yang mematikan semua animasi di mode itu,
   jadi di sini sengaja ditimpa (selector lebih spesifik + !important). */
@media (prefers-reduced-motion: reduce) {
  .footer__marquee .footer__marquee-track {
    animation-duration: 32s !important;
    animation-iteration-count: infinite !important;
  }
}

/* ---- Tablet ---- */
@media (max-width: 960px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.25rem 2rem;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

/* ---- HP ---- */
@media (max-width: 560px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer__brand,
  .footer__grid > .footer__col:nth-child(3) {
    grid-column: 1 / -1;
  }

  .footer__logo-img {
    height: 40px;
  }

  .footer__grid > .footer__col:nth-child(2) {
    grid-column: 1 / -1;
  }

  /* Menu navigasi jadi 2 kolom supaya tidak terlalu panjang */
  .footer__grid > .footer__col:nth-child(2) .footer__list {
    grid-template-columns: 1fr 1fr;
  }


  /* Ruang di kanan supaya teks tidak tertutup tombol chat & ke atas */
  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
    padding-right: 3.5rem;
  }

  .top-btn {
    right: 1rem;
    bottom: 5rem;
    width: 44px;
    height: 44px;
  }
}
</style>
