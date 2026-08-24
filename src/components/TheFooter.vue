<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import linkedinIcon from '@/components/icons/icons-about/linkedin-svgrepo-com.svg'
import instagramIcon from '@/components/icons/icons-about/instagram-2016-logo-svgrepo-com.svg'

const year = new Date().getFullYear()

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang' },
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
    <div class="footer__top">
      <div class="footer__brand">
        <a href="#beranda" class="footer__logo">Jose<span class="footer__logo-dot">.</span></a>
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
    </div>

    <span class="footer__deco-text" aria-hidden="true">JOSE</span>
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
  background: var(--color-primary-dark, #3f5f53);
  color: #eef3ef;
  padding: 3.5rem 1.5rem 1.5rem;
  overflow: hidden;
}

/* Teks dekoratif "JOSE" 3D bergaris, nempel di pojok kanan bawah footer */
.footer__deco-text {
  position: absolute;
  right: -0.1rem;
  bottom: -0.55rem;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: clamp(3.5rem, 12vw, 8rem);
  line-height: 1;
  letter-spacing: 0.01em;

  /* Pola garis-garis (stripe) sebagai isi teks */
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(238, 243, 239, 0.55) 0px,
    rgba(238, 243, 239, 0.55) 3px,
    transparent 3px,
    transparent 8px
  );
  background-color: rgba(238, 243, 239, 0.06);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  /* Efek 3D: tumpukan bayangan teks berlapis */
  text-shadow:
    1px 1px 0 rgba(0, 0, 0, 0.18),
    2px 2px 0 rgba(0, 0, 0, 0.16),
    3px 3px 0 rgba(0, 0, 0, 0.14),
    4px 4px 0 rgba(0, 0, 0, 0.12),
    5px 5px 0 rgba(0, 0, 0, 0.1),
    6px 6px 10px rgba(0, 0, 0, 0.25);

  opacity: 0.9;
}

@media (max-width: 820px) {
  .footer__deco-text {
    font-size: clamp(2.8rem, 16vw, 5rem);
  }
}

@media (max-width: 480px) {
  .footer__deco-text {
    display: none;
  }
}

.footer__top {
  position: relative;
  z-index: 1;
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(238, 243, 239, 0.15);
}

.footer__logo {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
}

.footer__logo-dot {
  color: var(--color-accent, #f2a488);
}

.footer__tagline {
  margin-top: 0.9rem;
  max-width: 320px;
  font-family: var(--font-body);
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(238, 243, 239, 0.75);
}

.footer__heading {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(238, 243, 239, 0.55);
  margin: 0 0 1rem;
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
  font-family: var(--font-body);
  font-size: 0.94rem;
  color: rgba(238, 243, 239, 0.85);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer__link:hover {
  color: var(--color-accent, #f2a488);
}

.footer__link--static {
  cursor: default;
}

.footer__link--static:hover {
  color: rgba(238, 243, 239, 0.85);
}

.footer__socials {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(238, 243, 239, 0.1);
  border: 1px solid rgba(238, 243, 239, 0.2);
  color: #eef3ef;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.footer__social-link:hover {
  background: var(--color-accent, #f2a488);
  border-color: var(--color-accent, #f2a488);
  transform: translateY(-2px);
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
  /* Ikon logo aslinya berwarna; dijadikan putih agar senada dengan tema footer gelap */
  filter: brightness(0) invert(1);
  /* Proteksi: cegah seleksi, drag, dan long-press save di mobile */
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.footer__bottom {
  position: relative;
  z-index: 1;
  max-width: 1160px;
  margin: 0 auto;
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer__copyright {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: rgba(238, 243, 239, 0.6);
  margin: 0;
}

.top-btn {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary, #6b9080);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 14px 28px -12px rgba(37, 54, 50, 0.5);
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.top-btn:hover {
  background: var(--color-primary-dark, #4f7566);
  transform: translateY(-3px);
  box-shadow: 0 18px 32px -12px rgba(37, 54, 50, 0.55);
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
    bottom: 1rem;
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 820px) {
  .footer__top {
    grid-template-columns: 1fr 1fr;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer__top {
    grid-template-columns: 1fr;
  }
}
</style>
