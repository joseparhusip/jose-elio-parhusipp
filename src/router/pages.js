/* ---------------------------------------------------------
   Daftar halaman situs: satu sumber untuk router, navbar,
   footer, dan script build (scripts/prerender-pages.js).
   File ini sengaja tanpa import Vue supaya bisa dibaca Node.

   Judul & deskripsi tiap halaman inilah yang dibaca Google,
   dan biasanya jadi teks "sitelinks" di hasil pencarian.
--------------------------------------------------------- */
export const SITE_URL = 'https://www.joseparhusip.com'

// `en`: label menu, judul tab, & deskripsi versi Inggris (lihat useLang.js)
export const pages = [
  {
    path: '/',
    name: 'home',
    sectionId: 'beranda',
    label: 'Beranda',
    title: 'Jose Elio Parhusip — Fresh Graduate & Passionate in Technology',
    description:
      'Portofolio Jose Elio Parhusip, Fresh Graduate S1 Bisnis Digital ULBI Bandung yang passionate di dunia teknologi, khususnya web, mobile, data, dan AI.',
    en: {
      label: 'Home',
      title: 'Jose Elio Parhusip — Fresh Graduate Passionate About Technology',
      description:
        'Portfolio of Jose Elio Parhusip, a Digital Business graduate from ULBI Bandung who is passionate about technology, especially web, mobile, data, and AI.',
    },
  },
  {
    path: '/tentang',
    name: 'tentang',
    sectionId: 'tentang',
    label: 'Tentang',
    title: 'Tentang Saya — Jose Elio Parhusip',
    description:
      'Kenali Jose Elio Parhusip: latar belakang pendidikan S1 Bisnis Digital ULBI, keahlian, dan perjalanan belajar teknologi.',
    en: {
      label: 'About',
      title: 'About — Jose Elio Parhusip',
      description:
        'Get to know Jose Elio Parhusip: his Digital Business degree from ULBI, his skills, and his journey in technology.',
    },
  },
  {
    path: '/pengalaman',
    name: 'pengalaman',
    sectionId: 'pengalaman',
    label: 'Pengalaman',
    title: 'Pengalaman — Jose Elio Parhusip',
    description:
      'Pengalaman kerja, magang, dan organisasi Jose Elio Parhusip di bidang pengembangan web, mobile, dan data.',
    en: {
      label: 'Experience',
      title: 'Experience — Jose Elio Parhusip',
      description:
        'Work, internship, and organizational experience of Jose Elio Parhusip in web, mobile, and data development.',
    },
  },
  {
    path: '/proyek',
    name: 'proyek',
    sectionId: 'proyek',
    label: 'Proyek',
    title: 'Proyek — Jose Elio Parhusip',
    description:
      'Kumpulan proyek Jose Elio Parhusip: web landing page, web e-commerce, aplikasi mobile Flutter, dan analisis data.',
    en: {
      label: 'Projects',
      title: 'Projects — Jose Elio Parhusip',
      description:
        'Projects by Jose Elio Parhusip: landing pages, e-commerce websites, Flutter mobile apps, and data analysis.',
    },
  },
  {
    path: '/sertifikat',
    name: 'sertifikat',
    sectionId: 'sertifikat',
    label: 'Sertifikat',
    title: 'Sertifikat — Jose Elio Parhusip',
    description:
      'Sertifikat dan pelatihan Jose Elio Parhusip: SAP, bootcamp karier IT, program P2MW, dan kursus pengembangan web.',
    en: {
      label: 'Certificates',
      title: 'Certificates — Jose Elio Parhusip',
      description:
        'Certificates and training of Jose Elio Parhusip: SAP, an IT career bootcamp, the P2MW program, and a web development course.',
    },
  },
  {
    path: '/kontak',
    name: 'kontak',
    sectionId: 'kontak',
    label: 'Kontak',
    title: 'Kontak — Jose Elio Parhusip',
    description:
      'Hubungi Jose Elio Parhusip untuk peluang kerja, kolaborasi, atau proyek. Kirim pesan langsung atau lewat LinkedIn dan Instagram.',
    en: {
      label: 'Contact',
      title: 'Contact — Jose Elio Parhusip',
      description:
        'Contact Jose Elio Parhusip about job opportunities, collaborations, or projects. Send a message directly or reach out on LinkedIn and Instagram.',
    },
  },
]
