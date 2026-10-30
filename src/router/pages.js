/* ---------------------------------------------------------
   Daftar halaman situs: satu sumber untuk router, navbar,
   footer, dan script build (scripts/prerender-pages.js).
   File ini sengaja tanpa import Vue supaya bisa dibaca Node.

   Judul & deskripsi tiap halaman inilah yang dibaca Google,
   dan biasanya jadi teks "sitelinks" di hasil pencarian.
--------------------------------------------------------- */
export const SITE_URL = 'https://www.joseparhusip.com'

export const pages = [
  {
    path: '/',
    name: 'home',
    sectionId: 'beranda',
    label: 'Beranda',
    title: 'Jose Elio Parhusip — Fresh Graduate & Passionate in Technology',
    description:
      'Portofolio Jose Elio Parhusip, Fresh Graduate S1 Bisnis Digital ULBI Bandung yang passionate di dunia teknologi, khususnya web, mobile, data, dan AI.',
  },
  {
    path: '/tentang',
    name: 'tentang',
    sectionId: 'tentang',
    label: 'Tentang',
    title: 'Tentang Saya — Jose Elio Parhusip',
    description:
      'Kenali Jose Elio Parhusip: latar belakang pendidikan S1 Bisnis Digital ULBI, keahlian, dan perjalanan belajar teknologi.',
  },
  {
    path: '/pengalaman',
    name: 'pengalaman',
    sectionId: 'pengalaman',
    label: 'Pengalaman',
    title: 'Pengalaman — Jose Elio Parhusip',
    description:
      'Pengalaman kerja, magang, dan organisasi Jose Elio Parhusip di bidang pengembangan web, mobile, dan data.',
  },
  {
    path: '/proyek',
    name: 'proyek',
    sectionId: 'proyek',
    label: 'Proyek',
    title: 'Proyek — Jose Elio Parhusip',
    description:
      'Kumpulan proyek Jose Elio Parhusip: web landing page, web e-commerce, aplikasi mobile Flutter, dan analisis data.',
  },
  {
    path: '/kontak',
    name: 'kontak',
    sectionId: 'kontak',
    label: 'Kontak',
    title: 'Kontak — Jose Elio Parhusip',
    description:
      'Hubungi Jose Elio Parhusip untuk peluang kerja, kolaborasi, atau proyek. Kirim pesan langsung atau lewat LinkedIn dan Instagram.',
  },
]
