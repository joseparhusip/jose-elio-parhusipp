<script setup>
import { ref } from 'vue'

// Tech stack icons
import pythonIcon from './icons/icons-about/Python-logo-notext.svg'
import streamlitIcon from './icons/icons-about/Streamlit.svg'
import excelIcon from './icons/icons-about/Microsoft_Office_Excel_(2025–present).svg'
import flutterIcon from './icons/icons-about/lockup_flutter_horizontal.svg'
import nodeIcon from './icons/icons-about/Node.js_logo.svg'
import mysqlIcon from './icons/icons-about/mysql-ar21.svg'
import googleIcon from './icons/icons-about/google-icon-logo-svgrepo-com.svg'
import reactIcon from './icons/icons-about/React-icon.svg'
import tailwindIcon from './icons/icons-about/Tailwind_CSS_Logo.svg'

// Thumbnail proyek
import kolThumb from './img-proyek/img-bisnis-intelegence/img-savvy-1.png'
import mobileJecThumb from './img-proyek/img-jec/IMG-JEC-1.jpeg'
import dashboardJecThumb from './img-proyek/img-admin-jec/img-admin-jec-1.png'
import securaKostThumb from './img-proyek/img-securakost/img-secura-kost.png'
import tokoKelontongThumb from './img-proyek/img-toko-kelontong/img-toko-kelontong.png'

const projects = [
  {
    title: 'Dashboard KOL',
    desc: 'Dashboard analitik untuk memantau performa Key Opinion Leader (KOL), dibangun dengan Python dan Streamlit. Data konten dan engagement diolah langsung dari file Excel, lalu divisualisasikan dalam bentuk grafik dan tabel interaktif agar tren dan performa lebih mudah dibaca untuk pengambilan keputusan.',
    thumb: kolThumb,
    techStack: [
      { name: 'Python', icon: pythonIcon },
      { name: 'Streamlit', icon: streamlitIcon },
      { name: 'Excel', icon: excelIcon },
    ],
    demoHref: 'https://dashboard-savvy.streamlit.app/',
    codeHref: 'https://github.com/joseparhusip/dashboard-savvy',
  },
  {
    title: 'Mobile JEC',
    desc: 'Aplikasi mobile untuk JEC Eye Hospitals & Clinics, dibangun dengan Flutter di sisi frontend dan Node.js di backend, dengan MySQL sebagai basis data. Dilengkapi fitur OCR untuk membaca data KTP secara otomatis saat pendaftaran, serta login dengan akun Google agar proses masuk lebih cepat dan aman.',
    thumb: mobileJecThumb,
    techStack: [
      { name: 'Flutter', icon: flutterIcon },
      { name: 'Node.js', icon: nodeIcon },
      { name: 'MySQL', icon: mysqlIcon },
      { name: 'Google Login', icon: googleIcon },
    ],
    demoHref: 'https://drive.google.com/file/d/1oze0Swrzc9JgRU-l0gX_ZiuBRP6WWuNV/view?usp=sharing',
    codeHref: 'https://github.com/joseparhusip/application_jec',
  },
  {
    title: 'Dashboard JEC',
    desc: 'Dashboard admin untuk JEC Eye Hospitals & Clinics, dikembangkan dengan React di frontend dan Node.js di backend, didukung basis data MySQL. Digunakan untuk mengelola data pasien, jadwal, dan operasional klinik secara terpusat dalam satu tampilan yang ringkas.',
    thumb: dashboardJecThumb,
    techStack: [
      { name: 'React', icon: reactIcon },
      { name: 'Node.js', icon: nodeIcon },
      { name: 'MySQL', icon: mysqlIcon },
    ],
    demoHref: 'https://administrator-jec.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/administrator-jec',
  },
  {
    title: 'Secura Kost',
    desc: 'Landing page dan sistem informasi untuk kost, dibangun sebagai proyek frontend murni menggunakan React JS dan Tailwind CSS. Menampilkan daftar kamar, fasilitas, dan informasi kost dengan tampilan yang responsif, tanpa terhubung ke backend atau database.',
    thumb: securaKostThumb,
    techStack: [
      { name: 'React', icon: reactIcon },
      { name: 'Tailwind CSS', icon: tailwindIcon },
    ],
    demoHref: 'https://secura-kost.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/secura-kost',
  },
  {
    title: 'Toko Kelontong Online',
    desc: 'Aplikasi katalog toko kelontong online, dikembangkan murni di sisi frontend menggunakan React JS. Menampilkan daftar produk dan fitur belanja sederhana secara statis tanpa koneksi ke database maupun backend.',
    thumb: tokoKelontongThumb,
    techStack: [
      { name: 'React', icon: reactIcon },
    ],
    demoHref: 'https://toko-kelontong-online.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/toko-kelontong-online',
  },
]

// Bottom sheet: hanya satu kartu yang bisa terbuka dalam satu waktu
const activeIndex = ref(null)

function toggleSheet(index) {
  activeIndex.value = activeIndex.value === index ? null : index
}

function closeSheet() {
  activeIndex.value = null
}
</script>

<template>
  <section id="proyek" class="projects">
    <div class="projects__inner">
      <div class="projects__header">
        <span class="projects__eyebrow">Proyek</span>
        <h2 class="projects__title">Beberapa proyek yang pernah saya kerjakan</h2>
        <p class="projects__desc">
          Kumpulan proyek yang menunjukkan cara saya berpikir, mulai dari
          menyusun struktur sampai menyelesaikan detail kecil.
        </p>
      </div>

      <div class="projects__grid">
        <article
          v-for="(project, index) in projects"
          :key="project.title"
          class="project-card"
        >
          <div class="project-card__thumb">
            <div class="project-card__photo-card">
              <span class="project-card__blob" aria-hidden="true"></span>
              <div class="project-card__glass">
                <img :src="project.thumb" :alt="project.title" class="project-card__thumb-img" loading="lazy" />
              </div>
            </div>
          </div>

          <div class="project-card__body">
            <h3 class="project-card__title">{{ project.title }}</h3>

            <button
              type="button"
              class="project-card__detail-btn"
              :aria-expanded="activeIndex === index"
              @click="toggleSheet(index)"
            >
              Lihat deskripsi
              <svg viewBox="0 0 24 24" class="project-card__detail-icon" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6" />
              </svg>
            </button>

            <div class="project-card__footer">
              <ul class="project-card__stack">
                <li
                  v-for="tech in project.techStack"
                  :key="tech.name"
                  class="project-card__stack-item"
                  :title="tech.name"
                >
                  <img :src="tech.icon" :alt="tech.name" class="project-card__stack-icon" loading="lazy" />
                </li>
              </ul>

              <div class="project-card__links">
                <a
                  :href="project.codeHref"
                  class="project-card__icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lihat kode sumber di GitHub"
                  title="Kode Sumber"
                >
                  <svg viewBox="0 0 24 24" class="project-card__icon-svg" aria-hidden="true">
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
                  :href="project.demoHref"
                  class="project-card__icon-link project-card__icon-link--primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lihat demo"
                  title="Lihat Demo"
                >
                  <svg viewBox="0 0 24 24" class="project-card__icon-svg" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14 4h6v6M10 14 20 4M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Bottom sheet: muncul dari bawah kartu, berisi deskripsi lengkap -->
          <div
            class="project-card__sheet"
            :class="{ 'project-card__sheet--open': activeIndex === index }"
            role="dialog"
            :aria-hidden="activeIndex !== index"
          >
            <div class="project-card__sheet-handle" aria-hidden="true"></div>

            <button
              type="button"
              class="project-card__sheet-close"
              aria-label="Tutup deskripsi"
              @click="closeSheet"
            >
              <svg viewBox="0 0 24 24" class="project-card__sheet-close-icon" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            <h4 class="project-card__sheet-title">{{ project.title }}</h4>
            <p class="project-card__sheet-desc">{{ project.desc }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  padding: 5rem 1.5rem;
  background: var(--color-surface, #fff);
}

.projects__inner {
  max-width: 1160px;
  margin: 0 auto;
}

.projects__header {
  max-width: 620px;
  margin: 0 auto 3rem;
  text-align: center;
}

.projects__eyebrow {
  display: inline-flex;
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-mint, #cfe3dd);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.projects__title {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 1.25;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 1.1rem 0 1rem;
}

.projects__desc {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-soft, #5c6f69);
  margin: 0;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
}

.project-card {
  position: relative;
  background: var(--color-surface, #fff);
  border: 1px solid rgba(107, 144, 128, 0.15);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 40px -28px rgba(37, 54, 50, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 26px 48px -24px rgba(37, 54, 50, 0.45);
}

/* --- Thumbnail: glass card + moving blob, mengikuti tema warna --- */
.project-card__thumb {
  position: relative;
  height: 240px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg, #f1f4f1);
}

.project-card__photo-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    10px 10px 28px rgba(37, 54, 50, 0.14),
    -8px -8px 22px rgba(255, 255, 255, 0.75);
}

.project-card__blob {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: var(--color-primary, #6b9080);
  opacity: 0.9;
  filter: blur(22px);
  animation: project-blob-bounce 7s infinite ease;
}

/* Warna blob gantian per kartu, mengikuti palet tema */
.project-card:nth-child(3n + 2) .project-card__blob {
  background: var(--color-accent, #f2a488);
}

.project-card:nth-child(3n + 3) .project-card__blob {
  background: var(--color-mint, #cfe3dd);
}

@keyframes project-blob-bounce {
  0% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
  25% {
    transform: translate(-100%, -100%) translate3d(90%, 0, 0);
  }
  50% {
    transform: translate(-100%, -100%) translate3d(90%, 90%, 0);
  }
  75% {
    transform: translate(-100%, -100%) translate3d(0, 90%, 0);
  }
  100% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
}

.project-card__glass {
  position: absolute;
  inset: 5px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  outline: 2px solid rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(6px);
}

.project-card__thumb-img {
  width: 100%;
  height: 100%;
  /* contain, bukan cover: seluruh screenshot terlihat, tidak terpotong */
  object-fit: contain;
  object-position: center;
  display: block;
}

.project-card__body {
  padding: 1.5rem;
}

.project-card__title {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 0 0 0.6rem;
}

/* --- Tombol pemicu bottom sheet --- */
.project-card__detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-primary-dark, #4f7566);
  background: none;
  border: none;
  padding: 0;
  margin: 0 0 1.3rem;
  cursor: pointer;
  transition: gap 0.2s ease, color 0.2s ease;
}

.project-card__detail-btn:hover {
  color: var(--color-primary, #6b9080);
  gap: 0.55rem;
}

.project-card__detail-icon {
  width: 16px;
  height: 16px;
}

/* --- Bottom sheet: muncul dari bawah kartu --- */
.project-card__sheet {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 1.75rem;
  background: var(--color-surface, #fff);
  border-radius: 18px;
  box-shadow: 0 -14px 32px -12px rgba(37, 54, 50, 0.35);
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.project-card__sheet--open {
  transform: translateY(0);
}

.project-card__sheet-handle {
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: rgba(107, 144, 128, 0.3);
  margin: 0 auto 1rem;
}

.project-card__sheet-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(107, 144, 128, 0.2);
  background: var(--color-bg, #f1f4f1);
  color: var(--color-text-soft, #5c6f69);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.project-card__sheet-close:hover {
  background: var(--color-text, #253632);
  color: #fff;
}

.project-card__sheet-close-icon {
  width: 16px;
  height: 16px;
}

.project-card__sheet-title {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 0 0 0.75rem;
  padding-right: 2rem;
}

.project-card__sheet-desc {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--color-text-soft, #5c6f69);
  margin: 0;
  overflow-y: auto;
}

/* --- Baris footer: tech stack di kiri, icon GitHub/Demo di kanan, sejajar --- */
.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0 0 0;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.project-card__stack-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--color-bg, #f1f4f1);
  border: 1px solid rgba(107, 144, 128, 0.2);
}

.project-card__stack-icon {
  width: 20px;
  height: 20px;
  max-width: 100%;
  object-fit: contain;
  display: block;
}

/* --- Tombol GitHub / Demo: icon-only --- */
.project-card__links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.project-card__icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--color-bg, #f1f4f1);
  color: var(--color-text-soft, #5c6f69);
  border: 1px solid rgba(107, 144, 128, 0.2);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.project-card__icon-link:hover {
  transform: translateY(-2px);
  color: #fff;
  background: var(--color-text, #253632);
}

.project-card__icon-link--primary:hover {
  background: var(--color-primary, #6b9080);
}

.project-card__icon-svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 960px) {
  .projects__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .projects {
    padding: 3.5rem 1.25rem;
  }

  .projects__grid {
    grid-template-columns: 1fr;
  }

  .project-card__thumb {
    height: 200px;
    padding: 14px;
  }

  .project-card__body {
    padding: 1.25rem;
  }

  .project-card__title {
    font-size: 1.1rem;
  }

  .project-card__detail-btn {
    font-size: 0.85rem;
    margin-bottom: 1.1rem;
  }

  .project-card__stack-item {
    width: 30px;
    height: 30px;
  }

  .project-card__icon-link {
    width: 34px;
    height: 34px;
  }

  /* Bottom sheet: padding lebih ringkas & area teks lebih besar di layar kecil */
  .project-card__sheet {
    padding: 1.1rem 1.1rem 1.4rem;
  }

  .project-card__sheet-handle {
    width: 34px;
    margin-bottom: 0.85rem;
  }

  .project-card__sheet-close {
    top: 0.75rem;
    right: 0.75rem;
    width: 30px;
    height: 30px;
  }

  .project-card__sheet-title {
    font-size: 1rem;
    padding-right: 1.75rem;
  }

  .project-card__sheet-desc {
    font-size: 0.88rem;
    line-height: 1.65;
  }
}
</style>
