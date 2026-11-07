import { ref } from 'vue'

/* Penanda bersama: true kalau loader (TheLoader.vue) sudah selesai dan
   layar sudah terbuka. Dipakai komponen lain (mis. HomeView) untuk
   menunda animasi sambutan sampai pengunjung benar-benar bisa melihatnya.
   Ditaruh di level modul, jadi tetap true kalau pengunjung pindah
   halaman lalu kembali ke beranda. */
export const loaderDone = ref(false)

/* Intro zoom (TheLoader) hanya diputar di kunjungan pertama. Penandanya
   disimpan setelah intro selesai ditonton sampai habis. */
export const INTRO_SEEN_KEY = 'intro-seen'

export function hasSeenIntro() {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false // localStorage tidak tersedia (mis. mode privat)
  }
}

// Dibaca sekali saat aplikasi dimuat: apakah kunjungan ini memutar intro zoom
export const playsFullIntro = typeof window !== 'undefined' && !hasSeenIntro()
