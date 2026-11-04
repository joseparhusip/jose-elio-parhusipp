<script setup>
import { nextTick, ref, watch } from 'vue'
import { privacyOpen, closePrivacy } from '@/composables/usePrivacy'
import { lang, t } from '@/composables/useLang'

/* ---------------------------------------------------------
   Pop up kebijakan privasi, dibuka dari tautan di footer.
   Isinya harus sesuai dengan yang benar-benar dilakukan situs:
   kalau menambah analitik, cookie, atau layanan pihak ketiga baru,
   perbarui daftar di bawah, lalu ganti UPDATED.

   Sengaja bukan <dialog> bawaan: elemen itu naik ke "top layer"
   di atas kursor custom, sehingga kursor tidak terlihat.
--------------------------------------------------------- */
const UPDATED = { iso: '2026-11-04', label: { id: '4 Nov 2026', en: 'Nov 4, 2026' } }
const CONTACT_EMAIL = 'joseparhusip7@gmail.com'

// Ringkasan: semua data yang pernah disimpan situs ini
const ledger = [
  {
    data: { id: 'Pilihan tema gelap/terang, bahasa, dan penanda kunjungan', en: 'Theme (dark/light), language, and a first-visit marker' },
    where: { id: 'Browser kamu', en: 'Your browser' },
    until: { id: 'Sampai kamu menghapusnya', en: 'Until you delete it' },
    erase: { id: 'Hapus data situs di pengaturan browser', en: 'Clear site data in your browser settings' },
  },
  {
    data: { id: 'Riwayat percakapan di jendela chat', en: 'Chat window conversation history' },
    where: { id: 'Browser kamu', en: 'Your browser' },
    until: { id: 'Sampai kamu menghapusnya', en: 'Until you delete it' },
    erase: { id: 'Tombol hapus riwayat di jendela chat', en: 'The clear history button in the chat window' },
  },
  {
    data: { id: 'Nama, email, dan pesan', en: 'Name, email, and message' },
    where: { id: 'Kotak masuk email saya', en: 'My email inbox' },
    until: { id: 'Selama dibutuhkan untuk membalas', en: 'As long as needed to reply' },
    erase: { id: 'Minta lewat email', en: 'Request it by email' },
  },
  {
    data: { id: 'Alamat IP saat mengirim pesan', en: 'IP address when you send a message' },
    where: { id: 'Memori server', en: 'Server memory' },
    until: { id: 'Sementara, hilang saat server dimuat ulang', en: 'Temporarily, cleared when the server restarts' },
    erase: { id: 'Terhapus dengan sendirinya', en: 'Deleted automatically' },
  },
]

const services = [
  { name: 'Vercel', href: 'https://vercel.com/legal/privacy-policy', use: { id: 'Menjalankan situs dan server pengirim pesan, termasuk log teknis untuk keamanan.', en: 'Runs the site and the message-sending server, including technical logs for security.' } },
  { name: 'Google Fonts', href: 'https://policies.google.com/privacy', use: { id: 'Huruf yang dipakai di situs ini.', en: 'The fonts used on this site.' } },
  { name: 'OpenStreetMap', href: 'https://osmfoundation.org/wiki/Privacy_Policy', use: { id: 'Peta lokasi di bagian Kontak.', en: 'The location map in the Contact section.' } },
  { name: 'GitHub Contributions API', href: null, use: { id: 'Data grafik aktivitas GitHub saya.', en: 'Data for my GitHub activity chart.' } },
  { name: 'Gmail', href: 'https://policies.google.com/privacy', use: { id: 'Kotak masuk tempat pesanmu diterima.', en: 'The inbox where your messages are received.' } },
]

const sheet = ref(null)
const closeBtn = ref(null)
const scroller = ref(null)
const progress = ref(0)
let lastFocus = null

// Cara pengunjung terakhir berinteraksi: 'keyboard' atau 'pointer'
let lastInput = 'pointer'
window.addEventListener('keydown', () => (lastInput = 'keyboard'), { capture: true, passive: true })
window.addEventListener('pointerdown', () => (lastInput = 'pointer'), { capture: true, passive: true })

function onScroll() {
  const el = scroller.value
  const max = el.scrollHeight - el.clientHeight
  progress.value = max > 0 ? el.scrollTop / max : 1
}

// Esc menutup; Tab berputar di dalam pop up saja
function onKeydown(event) {
  if (event.key === 'Escape') {
    closePrivacy()
    return
  }
  if (event.key !== 'Tab') return
  const items = sheet.value.querySelectorAll('a[href], button:not([disabled])')
  const first = items[0]
  const last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(privacyOpen, async (open) => {
  // Halaman di belakang tidak ikut ter-scroll; chat & tombol ke atas disembunyikan
  document.documentElement.classList.toggle('privacy-open', open)
  if (open) {
    lastFocus = document.activeElement
    // Garis fokus hanya kalau dibuka dengan keyboard; dibuka dengan klik tetap
    // memindah fokus ke tombol tutup, tapi tanpa garis (lihat main.css :focus-visible)
    const openedByKeyboard = lastInput === 'keyboard'
    progress.value = 0
    await nextTick()
    closeBtn.value?.focus({ preventScroll: true, focusVisible: openedByKeyboard })
  } else {
    lastFocus?.focus?.({ preventScroll: true })
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="privacy" :duration="{ enter: 460, leave: 260 }">
      <div v-if="privacyOpen" class="privacy" @keydown="onKeydown">
        <div class="privacy__backdrop" aria-hidden="true" @click="closePrivacy"></div>

        <section
          ref="sheet"
          class="privacy__sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
        >
          <header class="privacy__bar">
            <span class="mono-meta">{{ t({ id: 'Dokumen · Privasi', en: 'Document · Privacy' }) }}</span>
            <span class="mono-meta privacy__date">
              {{ t({ id: 'Diperbarui', en: 'Updated' }) }} <time :datetime="UPDATED.iso">{{ t(UPDATED.label) }}</time>
            </span>
            <button
              ref="closeBtn"
              type="button"
              class="btn-close privacy__close"
              :aria-label="t({ id: 'Tutup kebijakan privasi', en: 'Close privacy policy' })"
              @click="closePrivacy"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <!-- Garis baca: seberapa jauh dokumen sudah di-scroll -->
            <span class="privacy__progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true"></span>
          </header>

          <div ref="scroller" class="privacy__scroll" @scroll.passive="onScroll">
            <h2 id="privacy-title" class="privacy__title">
              <template v-if="lang === 'en'">Privacy <span class="serif-accent">policy</span>.</template>
              <template v-else>Kebijakan <span class="serif-accent">privasi</span>.</template>
            </h2>
            <p class="privacy__statement">
              <template v-if="lang === 'en'">
                There are no cookies, ads, or trackers on this site. Data only reaches me
                if <em class="privacy__em">you</em> choose to send it.
              </template>
              <template v-else>
                Tidak ada cookie, iklan, atau alat pelacak di situs ini. Data baru sampai ke saya
                kalau <em class="privacy__em">kamu sendiri</em> yang mengirimkannya.
              </template>
            </p>

            <section class="privacy__block" aria-labelledby="pv-1">
              <span class="privacy__num">01</span>
              <div class="privacy__body">
                <h3 id="pv-1" class="privacy__h3">{{ t({ id: 'Yang tersimpan, dan di mana.', en: 'What is stored, and where.' }) }}</h3>
                <ul class="ledger">
                  <li v-for="row in ledger" :key="row.data.id" class="ledger__row">
                    <p class="ledger__data">{{ t(row.data) }}</p>
                    <dl class="ledger__facts">
                      <div><dt>{{ t({ id: 'Disimpan di', en: 'Stored in' }) }}</dt><dd>{{ t(row.where) }}</dd></div>
                      <div><dt>{{ t({ id: 'Berapa lama', en: 'How long' }) }}</dt><dd>{{ t(row.until) }}</dd></div>
                      <div><dt>{{ t({ id: 'Cara menghapus', en: 'How to delete' }) }}</dt><dd>{{ t(row.erase) }}</dd></div>
                    </dl>
                  </li>
                </ul>
              </div>
            </section>

            <section class="privacy__block" aria-labelledby="pv-2">
              <span class="privacy__num">02</span>
              <div class="privacy__body">
                <h3 id="pv-2" class="privacy__h3">{{ t({ id: 'Saat kamu mengirim pesan.', en: 'When you send a message.' }) }}</h3>
                <template v-if="lang === 'en'">
                  <p>
                    Your name, email, and message from the chat window are forwarded to my email
                    inbox, and you receive a confirmation copy. This data is only used to reply:
                    it is not added to a mailing list, sold, or shared.
                  </p>
                  <p>
                    To prevent spam, the server temporarily remembers the sender's IP address, so
                    one address cannot send more than 5 messages in 10 minutes.
                  </p>
                </template>
                <template v-else>
                  <p>
                    Nama, email, dan pesan dari jendela chat diteruskan ke kotak masuk email saya,
                    lalu kamu menerima salinan konfirmasinya. Data itu hanya dipakai untuk membalas:
                    tidak masuk milis, tidak dijual, tidak dibagikan.
                  </p>
                  <p>
                    Untuk menahan spam, server mengingat alamat IP pengirim sementara waktu, supaya
                    satu alamat tidak bisa mengirim lebih dari 5 pesan dalam 10 menit.
                  </p>
                </template>
              </div>
            </section>

            <section class="privacy__block" aria-labelledby="pv-3">
              <span class="privacy__num">03</span>
              <div class="privacy__body">
                <h3 id="pv-3" class="privacy__h3">{{ t({ id: 'Layanan yang ikut dimuat.', en: 'Services loaded with this site.' }) }}</h3>
                <p v-if="lang === 'en'">
                  Your browser connects directly to these services, so they can see your IP
                  address and browser type, as described in their own privacy policies.
                </p>
                <p v-else>
                  Browser kamu terhubung langsung ke layanan ini, jadi mereka bisa melihat alamat
                  IP dan jenis browsermu sesuai kebijakan masing-masing.
                </p>
                <dl class="services">
                  <div v-for="item in services" :key="item.name" class="services__row">
                    <dt class="services__name">
                      <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer" class="services__link">
                        {{ item.name }}
                        <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                        </svg>
                      </a>
                      <template v-else>{{ item.name }}</template>
                    </dt>
                    <dd class="services__use">{{ t(item.use) }}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section class="privacy__block" aria-labelledby="pv-4">
              <span class="privacy__num">04</span>
              <div class="privacy__body">
                <h3 id="pv-4" class="privacy__h3">{{ t({ id: 'Tanya, perbaiki, hapus.', en: 'Ask, correct, delete.' }) }}</h3>
                <p v-if="lang === 'en'">
                  You may ask about your data, request a correction, or request its deletion, in
                  line with Indonesian Law No. 27 of 2022 on Personal Data Protection. Send the
                  email from the same address you used for your message, so I can confirm it is you.
                </p>
                <p v-else>
                  Kamu boleh menanyakan, meminta perbaikan, atau meminta penghapusan datamu, sesuai
                  UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Kirim email dari alamat
                  yang sama dengan saat mengirim pesan, supaya saya bisa memastikan itu kamu.
                </p>
              </div>
            </section>

            <section class="privacy__block" aria-labelledby="pv-5">
              <span class="privacy__num">05</span>
              <div class="privacy__body">
                <h3 id="pv-5" class="privacy__h3">{{ t({ id: 'Kalau ada yang berubah.', en: 'If anything changes.' }) }}</h3>
                <p>{{ t({ id: 'Dokumen ini diperbarui, dan tanggal di bagian atas ikut berganti.', en: 'If anything changes, this document will be updated and the date at the top will change accordingly.' }) }}</p>
              </div>
            </section>
          </div>

          <footer class="privacy__foot">
            <div class="privacy__ask">
              <span class="mono-meta">{{ t({ id: 'Pertanyaan', en: 'Questions' }) }}</span>
              <a :href="`mailto:${CONTACT_EMAIL}`" class="privacy__mail">{{ CONTACT_EMAIL }}</a>
            </div>
            <button type="button" class="btn btn--primary privacy__ok" @click="closePrivacy">{{ t({ id: 'Mengerti', en: 'Got it' }) }}</button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* =========================================================
   Pop up "lembar dokumen": satu lembar bergaris tipis seperti
   halaman jurnal di beranda. Kepala & kaki tetap, isi di tengah
   bisa di-scroll. Di HP muncul dari bawah (bottom sheet).
   z-index di bawah grain (9999) & kursor custom (10000).
   ========================================================= */
.privacy {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 2.5rem);
}

.privacy__backdrop {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--color-bg) 78%, transparent);
}

.privacy__sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, 46rem);
  max-height: min(86dvh, 52rem);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

/* ---- Kepala ---- */
.privacy__bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 0.7rem 0.7rem clamp(1.25rem, 3vw, 2rem);
  border-bottom: 1px solid var(--color-rule);
}

.privacy__date {
  margin-left: auto;
}

.privacy__close {
  --close-size: 38px;
}

.privacy__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--color-primary);
  transform-origin: left;
  transition: transform 0.1s linear;
}

/* ---- Isi ---- */
.privacy__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2rem) 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--color-rule) transparent;
}

.privacy__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.3rem, 6vw, 3.6rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: var(--color-text);
}

.privacy__statement {
  max-width: 30ch;
  margin: 1.1rem 0 clamp(1.75rem, 4vw, 2.5rem);
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 2.2vw, 1.35rem);
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--color-text);
  text-wrap: pretty;
}

.privacy__em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--color-primary);
}

/* Blok bernomor: angka mono di kiri, isi di kanan */
.privacy__block {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: 0 1rem;
  padding: 1.25rem 0 1.5rem;
  border-top: 1px solid var(--color-rule);
}

.privacy__num {
  padding-top: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
}

.privacy__body {
  min-width: 0;
}

.privacy__h3 {
  margin: 0 0 0.75rem;
  font-family: var(--font-heading);
  font-size: clamp(1.2rem, 2.4vw, 1.45rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--color-text);
}

.privacy__body p {
  margin: 0 0 0.7rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

/* ---- Ringkasan data ---- */
.ledger {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--color-text);
}

.ledger__row {
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--color-rule);
}

.ledger__data {
  margin: 0 0 0.5rem !important;
  font-size: 0.95rem !important;
  font-weight: 600;
  color: var(--color-text) !important;
}

.ledger__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem 1.25rem;
  margin: 0;
}

.ledger__facts dt {
  margin-bottom: 0.2rem;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--color-text-soft);
  opacity: 0.85;
}

.ledger__facts dd {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--color-text-soft);
}

/* ---- Pihak ketiga ---- */
.services {
  margin: 0.9rem 0 0;
  border-top: 1px solid var(--color-rule);
}

.services__row {
  display: grid;
  grid-template-columns: minmax(0, 12rem) minmax(0, 1fr);
  gap: 0.2rem 1.25rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--color-rule);
}

.services__name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.services__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: inherit;
  text-decoration: none;
}

.services__link svg {
  color: var(--color-text-soft);
  transition: color 0.2s ease, transform 0.3s var(--ease-out);
}

.services__link:hover svg {
  color: var(--color-primary);
  transform: translate(2px, -2px);
}

.services__use {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--color-text-soft);
}

/* ---- Kaki ---- */
.privacy__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem clamp(1.25rem, 3vw, 2rem) 1.1rem;
  border-top: 1px solid var(--color-rule);
}

.privacy__ask {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.privacy__mail {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  overflow-wrap: anywhere;
}

.privacy__mail:hover {
  text-decoration-thickness: 2px;
}

.privacy__ok {
  flex-shrink: 0;
}

.services__link:focus-visible,
.privacy__mail:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

/* ---- Buka & tutup: lembar naik sedikit, latar meredup ---- */
.privacy-enter-active .privacy__backdrop {
  transition: opacity 0.3s ease;
}

.privacy-enter-active .privacy__sheet {
  transition: opacity 0.3s ease, transform 0.46s var(--ease-out);
}

.privacy-leave-active .privacy__backdrop,
.privacy-leave-active .privacy__sheet {
  transition: opacity 0.22s ease, transform 0.26s ease-in;
}

.privacy-enter-from .privacy__backdrop,
.privacy-leave-to .privacy__backdrop {
  opacity: 0;
}

.privacy-enter-from .privacy__sheet,
.privacy-leave-to .privacy__sheet {
  opacity: 0;
  transform: translateY(18px) scale(0.985);
}

/* ---- HP: lembar dari bawah, selebar layar ---- */
@media (max-width: 640px) {
  .privacy {
    place-items: end stretch;
    padding: 0;
  }

  .privacy__sheet {
    width: 100%;
    max-height: 90dvh;
    border-width: 1px 0 0;
    border-radius: var(--radius) var(--radius) 0 0;
  }

  .privacy__date {
    display: none;
  }

  .privacy__bar > .mono-meta:first-child {
    margin-right: auto;
  }

  .privacy__block {
    grid-template-columns: 1fr;
  }

  .privacy__num {
    padding: 0 0 0.4rem;
  }

  /* Fakta tiap data: label di kiri, nilai di kanan */
  .ledger__facts {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }

  .ledger__facts > div {
    display: grid;
    grid-template-columns: 6.75rem minmax(0, 1fr);
    gap: 0.6rem;
  }

  .ledger__facts dt {
    margin: 0;
    padding-top: 0.2em;
  }

  .services__row {
    grid-template-columns: 1fr;
  }

  .privacy__foot {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .privacy-enter-from .privacy__sheet,
  .privacy-leave-to .privacy__sheet {
    transform: translateY(100%);
  }
}
</style>
