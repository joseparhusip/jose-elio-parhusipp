import { ref } from 'vue'

/* Penanda bersama: true kalau loader (TheLoader.vue) sudah selesai dan
   layar sudah terbuka. Dipakai komponen lain (mis. HomeView) untuk
   menunda animasi sambutan sampai pengunjung benar-benar bisa melihatnya.
   Ditaruh di level modul, jadi tetap true kalau pengunjung pindah
   halaman lalu kembali ke beranda. */
export const loaderDone = ref(false)
