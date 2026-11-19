import { ref } from 'vue'

const STORAGE_KEY = 'lang'
export const LANGS = ['id', 'en', 'ja']

export const LOCALES = { id: 'id-ID', en: 'en-US', ja: 'ja-JP' }

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
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
  }
}

export function t(pair) {
  if (pair == null || typeof pair !== 'object') return pair
  return pair[lang.value] ?? (lang.value === 'ja' ? pair.en : undefined) ?? pair.id
}
