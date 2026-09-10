<script setup>
const experiences = [
  {
    period: 'Agustus 2025 — September 2025',
    role: 'Mobile Developer',
    company: 'Solo Project — JEC Eye Hospitals & Clinics',
    desc: [
      'Mengumpulkan data melalui kuesioner ke pengguna baru non-JEC sebagai dasar analisis kebutuhan aplikasi.',
      'Merancang UI aplikasi di Figma serta mendokumentasikan arsitektur sistem melalui Use Case, Activity, Class Diagram, dan ERD.',
      'Membangun backend menggunakan Node.js & Express.js untuk mendukung komunikasi data antara aplikasi dan server.',
      'Mengimplementasikan sistem autentikasi (auth) dan fitur keamanan aplikasi untuk melindungi data pengguna.',
      'Merancang database relasional menggunakan SQL dengan metode pengembangan sistem Waterfall yang diintegrasikan pendekatan User-Centered Design (UCD).',
      'Mengimplementasikan UI ke aplikasi Android menggunakan Flutter & Dart, termasuk fitur OCR.',
      'Melakukan Black Box Testing untuk memastikan fungsi aplikasi berjalan sesuai kebutuhan, serta evaluasi usability menggunakan System Usability Scale (SUS) melibatkan 120 responden pengguna baru, memperoleh skor rata-rata 79 (kategori Acceptable/Good).',
    ],
    tags: ['Flutter', 'Dart', 'Figma'],
  },
  {
    period: 'Juli 2024 — September 2024',
    role: 'Back End Developer',
    company: 'Group Project — Kantor Pusat PT Pos Indonesia',
    desc: [
      'Mengembangkan backend web application IHSAN POS untuk mendukung pengelolaan data tenaga kerja profesional PT Pos Indonesia, dari perancangan arsitektur sistem hingga implementasi API.',
      'Merancang ERD dan membangun database menggunakan PostgreSQL yang aman dan terstruktur, termasuk konfigurasi environment untuk keamanan dan fleksibilitas sistem.',
      'Menguji dan memvalidasi seluruh endpoint API menggunakan Postman untuk memastikan proses request/response dan integrasi backend-frontend berjalan sesuai kebutuhan.',
      'Berkoordinasi dengan tim pengembang, serta menyelesaikan pengembangan tepat waktu sesuai standar keamanan dan skalabilitas; hasil proyek dipublikasikan di Jurnal JUISI (Sinta 5).',
    ],
    tags: ['Backend', 'REST API', 'Database'],
  },
  {
    period: 'Mei 2023 — April 2024',
    role: 'System Analyst',
    company: 'Program Pembinaan Mahasiswa Wirausaha — Kampus Merdeka',
    desc: [
      'Mengelola anggaran proyek dari estimasi biaya hingga pencatatan pengeluaran, termasuk penyusunan invoice, penawaran, dan kuitansi.',
      'Melakukan pemodelan sistem (Flowchart, ERD, UML) sebagai dasar pengembangan platform marketplace UMKM yang didanai Kemendikbudristek.',
    ],
    tags: ['ERD', 'UML', 'Flowchart'],
  },
  {
    period: 'Oktober 2022 — Mei 2023',
    role: 'Deputy Human Capital and Governance',
    company: 'Himpunan Mahasiswa Bisnis Digital',
    desc: [
      'Membantu proses rekrutmen dan seleksi pengurus.',
      'Menyusun target, jadwal, dan anggaran organisasi.',
      'Mempersiapkan rapat umum sebagai Komite Pengarah.',
    ],
    tags: ['Organisasi', 'Rekrutmen'],
  },
]
</script>

<template>
  <section id="pengalaman" class="experience">
    <div class="experience__inner">
      <div class="experience__header">
        <span class="experience__eyebrow">Pengalaman Kerja</span>
        <h2 class="experience__title">Perjalanan singkat sejauh ini</h2>
        <p class="experience__desc">
          Beberapa peran yang pernah saya jalani, dari magang sampai proyek
          lepas, yang membentuk cara saya bekerja sekarang.
        </p>
      </div>

      <ol class="experience__timeline">
        <li v-for="item in experiences" :key="item.role + item.period" class="experience__item">
          <div class="experience__marker">
            <span class="experience__dot"></span>
            <span class="experience__line"></span>
          </div>

          <div class="experience__card">
            <span class="experience__period">{{ item.period }}</span>
            <h3 class="experience__role">{{ item.role }}</h3>
            <span class="experience__company">{{ item.company }}</span>

            <ol class="experience__item-desc">
              <li v-for="(point, index) in item.desc" :key="index" class="experience__item-desc-point">
                {{ point }}
              </li>
            </ol>

            <ul class="experience__tags">
              <li v-for="tag in item.tags" :key="tag" class="experience__tag">{{ tag }}</li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.experience {
  padding: 5rem 1.5rem;
  background: var(--color-bg, #f1f4f1);
}

.experience__inner {
  max-width: 900px;
  margin: 0 auto;
}

.experience__header {
  max-width: 560px;
  margin: 0 auto 3.5rem;
  text-align: center;
}

.experience__eyebrow {
  display: inline-flex;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-mint, #cfe3dd);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.experience__title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 1.25;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 1.1rem 0 1rem;
}

.experience__desc {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-soft, #5c6f69);
  margin: 0;
}

.experience__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.experience__item {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 1.5rem;
}

.experience__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.experience__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary, #6b9080);
  border: 3px solid var(--color-mint, #cfe3dd);
  flex-shrink: 0;
  margin-top: 0.4rem;
}

.experience__line {
  flex: 1;
  width: 2px;
  background: rgba(107, 144, 128, 0.25);
  margin: 0.3rem 0;
}

.experience__item:last-child .experience__line {
  display: none;
}

.experience__card {
  padding-bottom: 2.5rem;
}

.experience__period {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--color-accent, #f2a488);
  margin-bottom: 0.5rem;
}

.experience__role {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 0 0 0.25rem;
}

.experience__company {
  display: block;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-soft, #5c6f69);
  margin-bottom: 0.85rem;
}

.experience__item-desc {
  list-style: none;
  counter-reset: exp-point;
  margin: 0 0 1rem;
  padding: 0;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.experience__item-desc-point {
  position: relative;
  padding-left: 1.7rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-soft, #5c6f69);
  counter-increment: exp-point;
}

.experience__item-desc-point::before {
  content: counter(exp-point) '.';
  position: absolute;
  left: 0;
  top: 0;
  font-family: var(--font-body);
  font-weight: 700;
  color: var(--color-primary-dark, #4f7566);
}

.experience__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.experience__tag {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-bg, #f1f4f1);
  border: 1px solid rgba(107, 144, 128, 0.25);
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
}

@media (max-width: 480px) {
  .experience {
    padding: 3.5rem 1.25rem;
  }

  .experience__desc {
    text-align: justify;
  }

  .experience__item {
    grid-template-columns: 20px 1fr;
    gap: 1rem;
  }

  .experience__item-desc-point {
    padding-left: 1.5rem;
    font-size: 0.9rem;
    line-height: 1.65;
    text-align: justify;
  }
}
</style>
