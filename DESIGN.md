# Design System — Jose Elio Parhusip Portfolio

Dokumen ini adalah acuan tampilan situs. Tempel isinya di awal sesi setiap kali
minta bantuan AI untuk desain, supaya hasilnya konsisten dan tidak jatuh ke
gaya "AI generik". Semua nilai di bawah sudah ada sebagai CSS variable di
[`src/assets/base.css`](src/assets/base.css). Pakai variable-nya, jangan tulis
hex langsung di komponen.

## Arah estetika

**Swiss editorial: grafit & biru azure.** Seperti poster gaya International
Typographic Style atau majalah arsitektur: latar abu grafit netral, tipografi
yang berkarakter, dan **satu** warna aksen biru azure yang tegas dan dipakai
seperlunya. Bukan dashboard SaaS dan bukan landing page startup.

Referensi rasa:

1. **Poster Swiss / International Typographic Style**: grid tegas, satu warna
   aksen yang berani, banyak ruang kosong.
2. **Biru rambu jalan / biru LinkedIn**: biru azure yang jujur (hue 210°),
   tanpa sedikit pun nuansa ungu.
3. **Jurnal arsitek**: garis struktur tipis, metadata mono, koordinat.

Kepribadian: percaya diri, tegas, rapi, tidak berisik.

Nama gaya layout: **"Field Notes"**, seperti buku catatan lapangan atau jurnal
arsitek. Struktur dibentuk oleh **garis tipis dan grid**, bukan oleh kartu
membulat yang ditumpuk. Metadata ditulis dengan font mono (nomor indeks,
periode, koordinat), dan judul besar dengan tracking rapat.

## Warna

Aturan 60–30–10: **60% netral** (bg/surface), **30% teks**, **≤10% warna**
(primary + accent digabung). Kalau satu layar terasa "warna-warni", kurangi.

### Mode gelap (default)

| Token                  | Nilai     | Pakai untuk                                  |
| ---------------------- | --------- | -------------------------------------------- |
| `--color-bg`           | `#0E0F11` | Latar halaman (grafit netral, bukan navy)    |
| `--color-surface`      | `#15171A` | Section bergantian, kartu                    |
| `--color-surface-soft` | `#1F2226` | Isian input, chip, sel kosong                |
| `--color-border`       | `rgba(230,233,238,.10)` | Garis pemisah, outline kartu   |
| `--color-rule`         | `rgba(230,233,238,.20)` | Garis struktur (section, tabel) |
| `--color-text`         | `#ECEEF1` | Teks utama                                   |
| `--color-text-soft`    | `#9AA0A8` | Teks sekunder, label                         |
| `--color-primary`      | `#1F7FE0` | **Biru azure.** CTA utama, link aktif, highlight |
| `--color-primary-dark` | `#1769BF` | Hover/pressed tombol primary                 |
| `--color-accent`       | `#3FCB8A` | **Hijau sinyal.** Status "tersedia", grafik GitHub |
| `--footer-bg`          | `#0059B3` | Footer: blok biru penuh, sama di kedua tema |
| `--footer-accent`      | `#CFE3F7` | Label kecil di atas footer biru              |

### Mode terang

| Token                  | Nilai     |
| ---------------------- | --------- |
| `--color-bg`           | `#F4F4F1` (kertas putih netral) |
| `--color-surface`      | `#FFFFFF` |
| `--color-surface-soft` | `#E8E9E9` |
| `--color-rule`         | `rgba(15,17,20,.24)` |
| `--color-text`         | `#111214` |
| `--color-text-soft`    | `#5B6068` |
| `--color-primary`      | `#0059B3` |
| `--color-primary-dark` | `#004C99` |
| `--color-accent`       | `#0F7A4B` |

Kontras sudah dicek: teks primary di atas bg ≥ 4.7:1 (gelap) dan 6.2:1 (terang);
teks putih di atas tombol primary ≥ 4:1 (gelap) dan 6.8:1 (terang); teks putih
di atas footer biru 6.8:1.

**Aturan hue biru:** primary harus di hue **200–215°** dengan kanal merah
hampir nol. Biru di atas ~220° (ultramarine, kobalt, indigo) terlihat
keunguan di layar, jangan dipakai.

## Tipografi

| Peran   | Font                    | Catatan                                        |
| ------- | ----------------------- | ---------------------------------------------- |
| Heading | **Bricolage Grotesque** | Berat 700–800, letter-spacing rapat (-0.02em)  |
| Aksen   | **Instrument Serif** italic | Hanya 1–3 kata per judul (`.serif-accent`) |
| Body    | **Geist** 400           | 16px, line-height 1.6                          |
| Label   | **Geist Mono**          | Nomor section, periode, label kecil, uppercase + tracking lebar |

Pakai kontras ekstrem: judul besar dan tebal vs label mono kecil. Hindari
ukuran "tengah-tengah" yang saling mirip.

## Bentuk & ruang

- Radius: `--radius-sm` 6px, `--radius` 10px, `--radius-lg` 14px (maksimal).
  Pill (`999px`) hanya untuk titik status, bukan untuk tombol.
- Garis struktur: `--color-rule` (lebih tegas dari `--color-border`). Pakai
  untuk garis atas section, baris tabel, dan bingkai.
- Spasi section: `--section-y` (clamp 4.5–8rem). Container 1200px.
- Bayangan cukup `--shadow-card`. Jangan menumpuk bayangan berwarna.

## Pola layout bersama (`src/assets/main.css`)

- **Header section** `.section-head`: garis atas penuh, lalu dua kolom (3:9).
  Kiri: `.section-label` → tampil "(01) TENTANG" + catatan mono kecil.
  Kanan: `.section-title` + `.section-lead`. Di HP jadi satu kolom.
- **Tombol** `.btn` + `.btn--primary` / `.btn--ghost`: kotak radius kecil,
  tinggi 46px.
- **Metadata** `.mono-meta`: mono kecil, huruf besar, tracking lebar.
- **Tekstur**: hanya grain kertas yang sangat halus, global di `body::after`
  (`--grain-opacity`). **Tidak ada** garis kontur/pola garis di latar.
- **Kartu foto 3D** (hero, `HomeView.vue`): panel lebih pendek dari foto
  sehingga kepala "keluar" dari bingkai; kartu miring maks ±9° mengikuti
  kursor (hanya mouse), foto di lapisan depan (`translateZ`), kilau halus
  mengikuti kursor. Di layar sentuh dan mode kurangi animasi kartu diam.
- Detail khas: koordinat Bandung `6°55′S 107°37′E`, nomor gambar
  ("Gbr. 01"), indeks "No. 03 / 06".

## Pemakaian warna di komponen

**Batas aksen: maksimal 2 pemakaian biru yang terlihat per layar.** Biru
(`--color-primary`) hanya untuk:

1. Satu kata aksen di judul (`.serif-accent`, "Parhusip" di hero).
2. Tombol aksi utama (`.btn--primary`: Lihat Proyek, Mulai Chat, Lihat demo).
3. State interaktif: hover, fokus, loading.

Semua yang lain netral (`--color-text` / `--color-text-soft`): nomor section,
indeks, caption, tanda sudut, garis menu aktif, tab aktif, bullet, kursor
ketik, bar progres scroll. Tombol navbar "Hubungi Saya" dan tombol chat
mengambang memakai **tinta solid** (latar `--color-text`, teks `--color-bg`)
dan baru jadi biru saat hover.

Pengecualian yang disengaja ("satu langkah berani"): footer berupa blok biru
penuh.

- **Grafik/data** (kontribusi GitHub): skala `--color-accent` (hijau) yang
  dicampur ke `--color-surface-soft` lewat `color-mix()`.
- **Peta (Leaflet)**: tile hitam-putih (`grayscale(1)`), penanda bawaan biru.

## Cek anti-AI-slop

Mengacu ke [anti-ai-slop.md](https://github.com/nexu-io/open-design/blob/main/craft/anti-ai-slop.md).
Sebelum merge, pastikan:

- [ ] Tidak ada indigo Tailwind (`#6366f1`, `#4f46e5`, `#8b5cf6`, `#7c3aed`, …).
- [ ] Tidak ada gradien dua warna di hero (ungu→biru, biru→cyan, dll.).
- [ ] Tidak ada emoji sebagai ikon. Ikon = SVG garis 1.6–1.8px, `currentColor`.
- [ ] Judul memakai font display (Bricolage / Instrument Serif), bukan Inter/system.
- [ ] Tidak ada kartu membulat dengan garis kiri berwarna.
- [ ] Tidak ada angka yang dikarang ("10× lebih cepat"). Semua angka nyata.
- [ ] Tidak ada teks pengisi (lorem ipsum, "fitur satu/dua/tiga").
- [ ] Biru maksimal 2× per layar; hex mentah di luar `:root` seminimal mungkin.
- [ ] Tidak ada blob/gelombang/pola garis dekoratif di latar.

## Jangan dipakai ❌

- Ungu/indigo/violet dalam bentuk apa pun (`#7C6FF0`, `#6366F1`, dll.).
- Biru ultramarine/kobalt (hue > 220°, mis. `#2448E0`, `#4A75FF`): di layar
  terbaca keunguan.
- Cokelat, terakota, krem hangat, atau oranye sebagai warna brand (sudah
  dicoba, terasa terlalu mirip brand lain).
- Gradien ungu→biru atau ungu→pink, terutama di hero.
- Latar navy kebiruan (`#0B0E17`, `#0F172A`). Latar harus grafit netral.
- Kombinasi ungu + toska/cyan.
- Font Inter, Roboto, Open Sans, Lato, atau system font sebagai font utama.
- Teks gradien di mana-mana. Satu tempat (judul hero) sudah cukup.
- Emoji di judul, badge "AI-powered", atau ikon sparkle ✨ sebagai dekorasi.
- Tiga kartu kembar sejajar dengan ikon bulat di atasnya.
- Blob cahaya blur (`radial-gradient` + `filter: blur`) sebagai dekorasi.
- Bento grid kartu membulat besar dengan bayangan.
- Dekorasi bintang ✦, marquee teks berjalan, atau gradien di tombol.
- Pola garis di latar (kontur topografi, grid, garis diagonal).
- Hex warna yang ditulis langsung di komponen. Tambahkan token di
  `base.css` dulu.

## Changelog

- **2026-10-29**: Audit terhadap anti-ai-slop.md. Biru dibatasi ke kata aksen
  + tombol utama; ~25 pemakaian dekoratif dinetralkan. Tombol navbar & chat
  jadi tinta solid. Garis kiri kutipan jadi warna teks.
- **2026-10-29**: Biru kobalt (hue 229°, terbaca keunguan) diganti **biru
  azure hue 210°** (`#1F7FE0` gelap / `#0059B3` terang, footer `#0059B3`).
- **2026-10-29**: Garis kontur topografi di latar dihapus. Foto hero jadi
  kartu 3D (miring mengikuti kursor, kepala keluar dari bingkai).
- **2026-10-29**: Palet cokelat/terakota diganti **grafit + biru kobalt +
  hijau sinyal**. Footer jadi blok kobalt penuh, peta jadi hitam-putih.
- **2026-10-29**: Redesign layout "Field Notes": header section bergaris,
  radius diperkecil, tekstur kontur topografi + grain, tombol `.btn`.
  Versi sebelumnya (palet cokelat, layout lama) disimpan di branch
  `design/cokelat`.
- **2026-10-29**: Palet ungu/navy/toska diganti menjadi terakota + sage di
  atas netral hangat. Footer pakai `--footer-bg` (espresso). Dokumen ini dibuat.
