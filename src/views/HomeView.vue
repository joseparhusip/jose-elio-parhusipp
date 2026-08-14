<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AboutSection from '@/components/AboutSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import myPhoto from '@/components/icons/icons-about/img-me.png'
import linkedinIcon from '@/components/icons/icons-about/linkedin-svgrepo-com.svg'
import instagramIcon from '@/components/icons/icons-about/instagram-2016-logo-svgrepo-com.svg'

const stack = ['Web Landing Page', 'Web E-commerce', 'Mobile App', 'Data']

const roles = ['Full Stack Developer', 'Flutter Developer', 'Data Analyst', 'System Analyst']
const typedRole = ref('')

let roleIndex = 0
let charIndex = 0
let isDeleting = false
let timeoutId = null

const TYPING_SPEED = 90
const DELETING_SPEED = 45
const PAUSE_AFTER_TYPED = 1600
const PAUSE_AFTER_DELETED = 350

function tick() {
  const currentRole = roles[roleIndex]

  if (isDeleting) {
    charIndex -= 1
  } else {
    charIndex += 1
  }

  typedRole.value = currentRole.slice(0, charIndex)

  let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true
    delay = PAUSE_AFTER_TYPED
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    roleIndex = (roleIndex + 1) % roles.length
    delay = PAUSE_AFTER_DELETED
  }

  timeoutId = setTimeout(tick, delay)
}

onMounted(() => {
  timeoutId = setTimeout(tick, TYPING_SPEED)
})

onUnmounted(() => {
  clearTimeout(timeoutId)
})
</script>

<template>
  <main>
    <section id="beranda" class="hero">
      <div class="hero__inner">
        <div class="hero__content">
          <span class="hero__eyebrow">👋 Halo, saya</span>

          <h1 class="hero__title">
            Jose Elio Parhusip,
            <span class="hero__title-accent">
              {{ typedRole }}<span class="hero__cursor" aria-hidden="true"></span>
            </span>
          </h1>

          <p class="hero__desc">
            Mahasiswa Bisnis Digital semester akhir dengan minat besar pada
            pengolahan data serta pengembangan web landing page, web
            e-commerce, dan aplikasi mobile. Terbiasa membangun sistem
            end-to-end, mulai dari desain di Figma, frontend, backend,
            hingga visualisasi data.
          </p>

          <div class="hero__actions">
            <a href="#proyek" class="hero__btn hero__btn--primary">Lihat Proyek</a>
            <a
              href="/CV_Jose_Elio_Parhusip.pdf"
              class="hero__btn hero__btn--ghost"
              download="CV_Jose_Elio_Parhusip.pdf"
            >
              Unduh CV
            </a>

            <div class="hero__socials">
              <a
                href="https://github.com/joseparhusip"
                class="hero__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" class="hero__social-icon" aria-hidden="true">
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
                class="hero__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <img :src="linkedinIcon" alt="LinkedIn" class="hero__social-img" />
              </a>

              <a
                href="https://www.instagram.com/joseparhusip_/"
                class="hero__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <img :src="instagramIcon" alt="Instagram" class="hero__social-img" />
              </a>
            </div>
          </div>

          <ul class="hero__stack">
            <li v-for="tech in stack" :key="tech" class="hero__stack-item">{{ tech }}</li>
          </ul>
        </div>

        <div class="hero__visual">
          <div class="hero__blob"></div>
          <div class="hero__photo-frame">
            <img
              :src="myPhoto"
              alt="Jose Elio Parhusip"
              class="hero__photo"
              draggable="false"
              @contextmenu.prevent
              @dragstart.prevent
            />
          </div>

          <div class="hero__badge hero__badge--top">
            <strong>4+</strong>
            <span>Tahun Belajar</span>
          </div>
          <div class="hero__badge hero__badge--bottom">
            <strong>5</strong>
            <span>Proyek Selesai</span>
          </div>
        </div>
      </div>
    </section>

    <AboutSection />
    <ExperienceSection />
    <ProjectsSection />
    <ContactSection />
  </main>
</template>

<style scoped>
.hero {
  padding: 4.5rem 1.5rem 5rem;
  background: var(--color-bg, #f1f4f1);
  overflow: hidden;
}

.hero__inner {
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 3rem;
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-mint, #cfe3dd);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.hero__title {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: clamp(2.2rem, 4.2vw, 3.4rem);
  line-height: 1.15;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 1.2rem 0 1.1rem;
  letter-spacing: -0.01em;
}

.hero__title-accent {
  display: block;
  min-height: 1.2em;
  color: var(--color-accent, #f2a488);
  font-style: italic;
}

.hero__cursor {
  display: inline-block;
  width: 3px;
  height: 0.85em;
  margin-left: 3px;
  background: var(--color-accent, #f2a488);
  vertical-align: middle;
  animation: hero-cursor-blink 0.85s steps(1) infinite;
}

@keyframes hero-cursor-blink {
  0%,
  50% {
    opacity: 1;
  }
  50.01%,
  100% {
    opacity: 0;
  }
}

.hero__desc {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-text-soft, #5c6f69);
  max-width: 480px;
  margin: 0 0 2rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.hero__btn {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.85rem 1.7rem;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.hero__btn--primary {
  background: var(--color-primary, #6b9080);
  color: #fff;
  box-shadow: 0 12px 24px -12px rgba(107, 144, 128, 0.55);
}

.hero__btn--primary:hover {
  background: var(--color-primary-dark, #4f7566);
  transform: translateY(-2px);
}

.hero__btn--ghost {
  background: transparent;
  color: var(--color-text, #253632);
  border: 1.5px solid rgba(37, 54, 50, 0.2);
}

.hero__btn--ghost:hover {
  border-color: var(--color-primary, #6b9080);
  transform: translateY(-2px);
}

.hero__socials {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.hero__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #fff;
  color: var(--color-text-soft, #5c6f69);
  border: 1px solid rgba(107, 144, 128, 0.25);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.hero__social-link:hover {
  background: var(--color-primary, #6b9080);
  color: #fff;
  transform: translateY(-2px);
}

.hero__social-icon {
  width: 20px;
  height: 20px;
}

.hero__social-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  display: block;
}

.hero__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.hero__stack-item {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.78rem;
  color: var(--color-primary-dark, #4f7566);
  background: #fff;
  border: 1px solid rgba(107, 144, 128, 0.25);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
}

.hero__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.hero__blob {
  position: absolute;
  width: 460px;
  height: 460px;
  background: linear-gradient(155deg, var(--color-mint, #cfe3dd), var(--color-accent-soft, #fbe4d8));
  border-radius: 62% 38% 55% 45% / 45% 55% 45% 55%;
}

.hero__photo-frame {
  position: relative;
  width: 400px;
  height: 460px;
  border-radius: 46% 54% 58% 42% / 50% 45% 55% 50%;
  background: var(--color-surface, #fff);
  border: 2px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 30px 50px -25px rgba(37, 54, 50, 0.4);
  overflow: hidden;
}

.hero__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

.hero__badge {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  background: #fff;
  padding: 0.75rem 1.1rem;
  border-radius: 14px;
  box-shadow: 0 16px 30px -16px rgba(37, 54, 50, 0.35);
}

.hero__badge strong {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 1.3rem;
  color: var(--color-text, #253632);
}

.hero__badge span {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.75rem;
  color: var(--color-text-soft, #5c6f69);
}

.hero__badge--top {
  top: 0.5rem;
  right: -0.5rem;
}

.hero__badge--bottom {
  bottom: 0.5rem;
  left: -1rem;
}

@media (max-width: 960px) {
  .hero__inner {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .hero__visual {
    order: -1;
    min-height: 380px;
  }

  .hero__blob {
    width: 340px;
    height: 340px;
  }

  .hero__photo-frame {
    width: 300px;
    height: 350px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 3rem 1.25rem 3.5rem;
  }

  .hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero__btn {
    text-align: center;
  }

  .hero__socials {
    justify-content: center;
  }
}
</style>
