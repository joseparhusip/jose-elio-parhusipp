/* ---------------------------------------------------------
   Daftar halaman situs: satu sumber untuk router, navbar,
   footer, dan script build (scripts/prerender-pages.js).
   File ini sengaja tanpa import Vue supaya bisa dibaca Node.

   Judul & deskripsi tiap halaman inilah yang dibaca Google,
   dan biasanya jadi teks "sitelinks" di hasil pencarian.
--------------------------------------------------------- */
export const SITE_URL = 'https://www.joseparhusip.com'

// `en` / `ja`: label menu, judul tab, & deskripsi versi Inggris / Jepang (lihat useLang.js)
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
    ja: {
      label: 'ホーム',
      title: 'Jose Elio Parhusip — テクノロジーに情熱を注ぐ新卒エンジニア',
      description:
        'Jose Elio Parhusipのポートフォリオです。ULBI（バンドン）でデジタルビジネス学士を取得した新卒で、Web・モバイル・データ・AIを中心にテクノロジーに情熱を注いでいます。',
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
    ja: {
      label: '自己紹介',
      title: '自己紹介 — Jose Elio Parhusip',
      description:
        'Jose Elio Parhusipの自己紹介です。ULBIでのデジタルビジネス学士の学び、スキル、テクノロジーとの歩みをご紹介します。',
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
    ja: {
      label: '経歴',
      title: '経歴 — Jose Elio Parhusip',
      description:
        'Jose Elio ParhusipのWeb・モバイル・データ開発分野における職務経験、インターンシップ、組織活動の経歴です。',
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
    ja: {
      label: 'プロジェクト',
      title: 'プロジェクト — Jose Elio Parhusip',
      description:
        'Jose Elio Parhusipのプロジェクト一覧です。ランディングページ、ECサイト、Flutterによるモバイルアプリ、データ分析などを掲載しています。',
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
    ja: {
      label: '資格',
      title: '資格・修了証 — Jose Elio Parhusip',
      description:
        'Jose Elio Parhusipの資格・研修歴です。SAP、ITキャリアブートキャンプ、P2MWプログラム、Web開発講座などを修了しています。',
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
    ja: {
      label: 'お問い合わせ',
      title: 'お問い合わせ — Jose Elio Parhusip',
      description:
        '求人・協業・プロジェクトのご相談は、Jose Elio Parhusipまでお気軽にご連絡ください。メッセージの直接送信のほか、LinkedInやInstagramからもご連絡いただけます。',
    },
  },
]
