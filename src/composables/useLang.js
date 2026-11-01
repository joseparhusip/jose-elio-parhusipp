import { ref } from 'vue'

/* ---------------------------------------------------------
   Bahasa situs: Indonesia (default) & Inggris.

   Cara pakai di komponen:
     import { lang, t } from '@/composables/useLang'
     {{ t({ id: 'Lihat proyek', en: 'View projects' }) }}
   Teks Indonesia selalu ditulis bersebelahan dengan versi Inggrisnya,
   jadi mudah dicek dan tidak ada kunci terjemahan yang terpisah.

   Pilihan disimpan di browser. Pengunjung baru yang browsernya
   bukan berbahasa Indonesia otomatis melihat versi Inggris
   (kecuali robot mesin pencari, supaya Google tetap mengindeks
   versi Indonesia).
--------------------------------------------------------- */
const STORAGE_KEY = 'lang'
export const LANGS = ['id', 'en']

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
  const speaksIndonesian = prefs.some((code) => /^(id|ms)\b/i.test(code))
  return isBot || speaksIndonesian ? 'id' : 'en'
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
  return pair[lang.value] ?? pair.id
}
