<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import linkedinIcon from '@/components/icons/icons-about/linkedin-svgrepo-com.svg'
import instagramIcon from '@/components/icons/icons-about/instagram-2016-logo-svgrepo-com.svg'

const year = new Date().getFullYear()

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Pengalaman', href: '#pengalaman' },
  { label: 'Proyek', href: '#proyek' },
  { label: 'Kontak', href: '#kontak' },
]

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

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}
</script>

<template>
  <footer class="footer">
    <span class="footer__grid-bg" aria-hidden="true"></span>

    <div class="footer__hero">
      <p class="footer__hero-title">
        Mari bangun sesuatu yang <span class="footer__serif">berguna</span>.
      </p>
      <a href="#kontak" class="footer__hero-btn">
        Hubungi Saya
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
    </div>

    <div class="footer__top">
      <div class="footer__brand">
        <a href="#beranda" class="footer__logo">
          <img src="/logo-navbar-footer.png" alt="Jose Elio Parhusip" class="footer__logo-img" draggable="false" />
        </a>
        <p class="footer__tagline">
          Membangun antarmuka web yang rapi, cepat, dan enak dipakai — satu proyek pada satu waktu.
        </p>
      </div>

      <div class="footer__col">
        <h3 class="footer__heading">Navigasi</h3>
        <ul class="footer__list">
          <li v-for="link in navLinks" :key="link.href">
            <a :href="link.href" class="footer__link">{{ link.label }}</a>
          </li>
        </ul>
      </div>

      <div class="footer__col">
        <h3 class="footer__heading">Sosial Media</h3>
        <div class="footer__socials">
          <a
            href="https://github.com/joseparhusip"
            class="footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" class="footer__social-icon" aria-hidden="true">
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
          </a>

          <a
            href="https://www.linkedin.com/in/joseparhusip/"
            class="footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            oncontextmenu="return false"
            @contextmenu.prevent="preventImageAction"
          >
            <img
              :src="linkedinIcon"
              alt="LinkedIn"
              class="footer__social-img"
              draggable="false"
              oncontextmenu="return false"
              @contextmenu.prevent="preventImageAction"
              @dragstart.prevent="preventImageAction"
            />
          </a>

          <a
            href="https://www.instagram.com/joseparhusip_/"
            class="footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
            oncontextmenu="return false"
            @contextmenu.prevent="preventImageAction"
          >
            <img
              :src="instagramIcon"
              alt="Instagram"
              class="footer__social-img"
              draggable="false"
              oncontextmenu="return false"
              @contextmenu.prevent="preventImageAction"
              @dragstart.prevent="preventImageAction"
            />
          </a>
        </div>
      </div>

      <div class="footer__col">
        <h3 class="footer__heading">Kontak</h3>
        <ul class="footer__list">
          <li>
            <a href="mailto:joseparhusip7@gmail.com" class="footer__link"
              >joseparhusip7@gmail.com</a
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p class="footer__copyright">&copy; {{ year }} Jose Elio Parhusip. Semua hak dilindungi.</p>
      <button type="button" class="footer__back" @click="scrollToTop">
        Kembali ke atas
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
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
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: var(--color-primary-dark);
  color: #eef3ef;
  padding: clamp(3.5rem, 8vw, 5.5rem) var(--gutter) 1.5rem;
}

/* Pola grid tipis + cahaya, senada dengan hero */
.footer__grid-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(60% 80% at 85% 0%, rgba(79, 214, 192, 0.22), transparent 60%),
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px) 0 0 / 56px 56px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px) 0 0 / 56px 56px;
  mask-image: linear-gradient(to bottom, #000 0%, transparent 85%);
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 85%);
}

.footer__hero,
.footer__top,
.footer__bottom {
  max-width: calc(var(--container) - 2 * var(--gutter));
  margin: 0 auto;
}

.footer__hero {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem 2rem;
  padding-bottom: clamp(2.5rem, 5vw, 3.5rem);
  border-bottom: 1px solid rgba(238, 243, 239, 0.18);
}

.footer__hero-title {
  margin: 0;
  max-width: 15ch;
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 5.5vw, 4.2rem);
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #fff;
  text-wrap: balance;
}

.footer__serif {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: #4fd6c0;
}

.footer__hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.95rem 1.6rem;
  border-radius: 999px;
  background: #fff;
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 600;
  color: #2b2470;
  text-decoration: none;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s ease;
}

.footer__hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px -18px rgba(0, 0, 0, 0.6);
}

.footer__hero-btn svg {
  transition: transform 0.3s var(--ease-out);
}

.footer__hero-btn:hover svg {
  transform: rotate(45deg);
}

.footer__top {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 2.5rem;
  padding: clamp(2.5rem, 5vw, 3.25rem) 0;
  border-bottom: 1px solid rgba(238, 243, 239, 0.18);
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.footer__logo-img {
  height: 46px;
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

.footer__tagline {
  margin: 1rem 0 0;
  max-width: 300px;
  font-size: 0.93rem;
  line-height: 1.65;
  color: rgba(238, 243, 239, 0.75);
  text-wrap: pretty;
}

.footer__heading {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(238, 243, 239, 0.55);
  margin: 0 0 1.1rem;
}

.footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.footer__link {
  font-size: 0.95rem;
  color: rgba(238, 243, 239, 0.88);
  text-decoration: none;
  overflow-wrap: break-word;
  transition: color 0.2s ease;
}

.footer__link:hover {
  color: #4fd6c0;
}

.footer__socials {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(238, 243, 239, 0.08);
  border: 1px solid rgba(238, 243, 239, 0.22);
  color: #eef3ef;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.3s var(--ease-out);
}

.footer__social-link:hover {
  background: rgba(238, 243, 239, 0.2);
  border-color: rgba(238, 243, 239, 0.45);
  transform: translateY(-3px);
}

.footer__social-icon {
  width: 18px;
  height: 18px;
}

.footer__social-img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
  filter: brightness(0) invert(1);
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.footer__bottom {
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.8rem 1rem;
}

.footer__copyright {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: rgba(238, 243, 239, 0.6);
  margin: 0;
}

.footer__back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  border: 0;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: rgba(238, 243, 239, 0.75);
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer__back:hover {
  color: #fff;
}

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

@media (max-width: 480px) {
  .top-btn {
    right: 1rem;
    bottom: 5rem;
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 820px) {
  .footer__top {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .footer__brand,
  .footer__top > .footer__col:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer__hero-btn {
    width: 100%;
    justify-content: center;
  }

  .footer__logo-img {
    height: 40px;
  }

  /* Ruang di bawah supaya teks tidak tertutup tombol chat & ke atas */
  .footer__bottom {
    padding-right: 3.5rem;
  }
}
</style>
