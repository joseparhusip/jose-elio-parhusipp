import { ref } from 'vue'

/* ---------------------------------------------------------
   Bahasa situs: Indonesia (default), Inggris, & Jepang.

   Cara pakai di komponen:
     import { lang, t } from '@/composables/useLang'
     {{ t({ id: 'Lihat proyek', en: 'View projects', ja: 'プロジェクトを見る' }) }}
   Ketiga versi ditulis bersebelahan, jadi mudah dicek dan tidak ada
   kunci terjemahan yang terpisah. Kalau versi Jepang belum ada, yang
   tampil versi Inggris (bukan Indonesia).

   Pilihan disimpan di browser. Pengunjung baru: browser berbahasa
   Indonesia/Melayu -> ID, Jepang -> JA, selain itu -> EN (robot mesin
   pencari selalu ID, supaya Google tetap mengindeks versi Indonesia).
--------------------------------------------------------- */
const STORAGE_KEY = 'lang'
export const LANGS = ['id', 'en', 'ja']

// Kode locale untuk format tanggal & angka (Intl / toLocaleString)
export const LOCALES = { id: 'id-ID', en: 'en-US', ja: 'ja-JP' }

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    // localStorage tidak tersedia (mis. mode privat)
  }
  if (typeof navigator === 'undefined') return 'id'
  const isBot = navigator.webdriver || /bot|crawl|spider|slurp|lighthouse/i.test(navigator.userAgent)
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language || 'id']
  if (isBot) return 'id'
  for (const code of prefs) {
    if (/^(id|ms)\b/i.test(code)) return 'id'
    if (/^ja\b/i.test(code)) return 'ja'
  }
  return 'en'
}

export const lang = ref(initialLang())
document.documentElement.lang = lang.value

export function setLang(value) {
  if (!LANGS.includes(value) || value === lang.value) return
  lang.value = value
  document.documentElement.lang = value
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // abaikan, pilihan hanya berlaku sampai halaman ditutup
  }
}

// Ambil teks sesuai bahasa aktif. String biasa dikembalikan apa adanya.
export function t(pair) {
  if (pair == null || typeof pair !== 'object') return pair
  return pair[lang.value] ?? (lang.value === 'ja' ? pair.en : undefined) ?? pair.id
}
