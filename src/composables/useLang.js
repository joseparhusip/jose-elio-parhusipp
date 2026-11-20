import { ref } from 'vue'

const STORAGE_KEY = 'lang'
export const LANGS = ['id', 'en', 'ja']

export const LOCALES = { id: 'id-ID', en: 'en-US', ja: 'ja-JP' }

function initialLang() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
  }
  return 'en'
}

export const lang = ref(initialLang())
document.documentElement.lang = lang.value

export function setLang(value) {
  if (!LANGS.includes(value) || value === lang.value) return
  lang.value = value
  document.documentElement.lang = value
}

export function t(pair) {
  if (pair == null || typeof pair !== 'object') return pair
  return pair[lang.value] ?? (lang.value === 'ja' ? pair.en : undefined) ?? pair.id
}
