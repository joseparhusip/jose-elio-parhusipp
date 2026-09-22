import { defineStore } from 'pinia'

// State global untuk widget chat mengambang. Dipisah jadi store sendiri
// supaya komponen mana pun (ContactSection, navbar, dsb.) bisa membuka
// widget yang sama tanpa perlu emit event manual antar komponen.
export const useChatWidgetStore = defineStore('chatWidget', {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
    toggle() {
      this.isOpen = !this.isOpen
    },
  },
})
