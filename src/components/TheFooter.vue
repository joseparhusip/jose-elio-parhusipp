<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { vReveal } from '@/directives/reveal'
import { navLinks, useSectionNav } from '@/composables/useSectionNav'

const { onNavClick } = useSectionNav()

const socials = [
  { name: 'GitHub', href: 'https://github.com/joseparhusip' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/joseparhusip/' },
  { name: 'Instagram', href: 'https://www.instagram.com/joseparhusip_/' },
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

    <div class="footer__inner">
      <!-- Kolom informasi -->
      <div v-reveal.stagger="{ delay: 60, step: 90 }" class="footer__grid">
        <div class="footer__brand">
          <a :href="navLinks[0].path" class="footer__logo" aria-label="Kembali ke beranda" @click="onNavClick($event, navLinks[0])">
            <img src="/logo-navbar-footer.png" alt="Jose Elio Parhusip" class="footer__logo-img" draggable="false" />
          </a>
          <p class="footer__statement">
            Membangun web, mobile, dan dashboard data yang
            <span class="footer__serif">benar-benar dipakai.</span>
          </p>
        </div>

        <nav class="footer__col" aria-label="Navigasi footer">
          <ul class="footer__list">
            <li v-for="link in navLinks" :key="link.path">
              <a :href="link.path" class="footer__link" @click="onNavClick($event, link)">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>

        <div class="footer__col" aria-label="Sosial media">
          <ul class="footer__list">
            <li v-for="item in socials" :key="item.name">
              <a
                :href="item.href"
                class="footer__social"
                target="_blank"
                rel="noopener noreferrer"
                oncontextmenu="return false"
                @contextmenu.prevent="preventImageAction"
              >
                <span class="footer__social-name">{{ item.name }}</span>
                <svg class="footer__social-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Tanda tangan editorial: nama raksasa selebar layar, bagian bawah
         hurufnya terpotong rata oleh tepi bawah footer -->
    <p class="footer__wordmark" aria-hidden="true">
      <span>Jose Elio</span> <span>Parhusip</span>
    </p>
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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 19V5M5 12l7-7 7 7"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
/* =========================================================
   Footer "Field Notes": blok biru penuh (sama di kedua tema),
   kolom dipisah garis tipis, dan nama
   besar sebagai tanda tangan di bagian bawah.
   ========================================================= */
.footer {
  --ink: #ffffff;
  --line: rgba(255, 255, 255, 0.16);
  --soft: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: var(--footer-bg);
  color: var(--ink);
  padding: clamp(3rem, 7vw, 5rem) 0 0;
}

.footer__inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
  box-sizing: border-box;
}

/* ---- Kolom ---- */
.footer__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr);
}

.footer__grid > * {
  padding: 2rem 2rem 2.25rem;
  border-left: 1px solid var(--line);
}

.footer__grid > :first-child {
  padding-left: 0;
  border-left: 0;
}

.footer__grid > :last-child {
  padding-right: 0;
}

.footer__logo {
  display: inline-block;
}

.footer__logo-img {
  display: block;
  height: 44px;
  width: auto;
  object-fit: contain;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}

.footer__statement {
  margin: 1.4rem 0 0;
  max-width: 24ch;
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 2vw, 1.55rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: var(--ink);
  text-wrap: balance;
}

.footer__serif {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--footer-accent);
}


.footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.15rem;
}

.footer__link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.3rem 0;
  font-size: 0.98rem;
  color: var(--soft);
  text-decoration: none;
  transition: color 0.2s ease;
}


.footer__link:hover {
  color: var(--ink);
}


.footer__social {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
}


.footer__social-name {
  font-size: 0.95rem;
  font-weight: 600;
}


.footer__social-arrow {
  color: var(--muted);
  transition: color 0.2s ease, transform 0.3s var(--ease-out);
}

.footer__social:hover .footer__social-arrow {
  color: var(--footer-accent);
  transform: translate(2px, -2px);
}

.footer__link:focus-visible,
.footer__social:focus-visible,
.footer__logo:focus-visible {
  outline: 2px solid var(--footer-accent);
  outline-offset: 3px;
}

/* ---- Nama raksasa ---- */
.footer__wordmark {
  margin: clamp(1.5rem, 4vw, 3rem) 0 0;
  padding: 0 1.2vw;
  font-family: var(--font-heading);
  /* Dihitung supaya "Jose Elio Parhusip" pas selebar layar */
  font-size: 13.3vw;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.025em;
  white-space: nowrap;
  text-align: center;
  color: var(--ink);
  user-select: none;
  /* Hanya ± 3/4 tinggi huruf yang terlihat: kaki huruf terpotong rata */
  height: 0.74em;
  overflow: hidden;
  border-top: 1px solid var(--line);
  padding-top: 0.04em;
}

.footer__wordmark span {
  display: inline;
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
  width: 46px;
  height: 46px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.top-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
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

/* ---- Tablet ---- */
@media (max-width: 960px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer__grid > .footer__brand {
    grid-column: 1 / -1;
    padding-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .footer__grid > :nth-child(2) {
    padding-left: 0;
    border-left: 0;
  }
}

/* ---- HP ---- */
@media (max-width: 560px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }

  .footer__grid > * {
    padding: 1.75rem 0;
    border-left: 0;
  }

  .footer__grid > :nth-child(2) {
    border-bottom: 1px solid var(--line);
  }

  /* Menu navigasi jadi 2 kolom supaya tidak terlalu panjang */
  .footer__grid > :nth-child(2) .footer__list {
    grid-template-columns: 1fr 1fr;
  }

  .footer__logo-img {
    height: 40px;
  }

  /* HP: tetap satu baris selebar layar seperti desktop, dengan potongan
     bawah yang sama. Jarak atas dikecilkan supaya tidak terlalu renggang. */
  .footer__wordmark {
    margin-top: 1.25rem;
    font-size: 11.3vw;
  }

  .top-btn {
    right: 1rem;
    bottom: 5rem;
    width: 44px;
    height: 44px;
  }
}
</style>
