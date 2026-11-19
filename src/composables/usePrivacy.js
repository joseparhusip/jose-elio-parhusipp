import { ref } from 'vue'

export const privacyOpen = ref(false)

export function openPrivacy() {
  privacyOpen.value = true
}

export function closePrivacy() {
  privacyOpen.value = false
}
