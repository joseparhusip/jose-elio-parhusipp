import { ref } from 'vue'

export const loaderDone = ref(false)

export const INTRO_SEEN_KEY = 'intro-seen'

export function hasSeenIntro() {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export const playsFullIntro = typeof window !== 'undefined' && !hasSeenIntro()
