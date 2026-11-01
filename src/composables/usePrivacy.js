import { ref } from 'vue'

/* ---------------------------------------------------------
   Status pop up kebijakan privasi (PrivacyDialog.vue).
   Dibuka dari tautan di footer, dipasang sekali di App.vue.
--------------------------------------------------------- */
export const privacyOpen = ref(false)

export function openPrivacy() {
  privacyOpen.value = true
}

export function closePrivacy() {
  privacyOpen.value = false
}
