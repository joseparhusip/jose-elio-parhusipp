# Design System — Jose Elio Parhusip Portfolio

Dokumen ini adalah acuan tampilan situs. Tempel isinya di awal sesi setiap kali
minta bantuan AI untuk desain, supaya hasilnya konsisten dan tidak jatuh ke
gaya "AI generik". Semua nilai di bawah sudah ada sebagai CSS variable di
[`src/assets/base.css`](src/assets/base.css). Pakai variable-nya, jangan tulis
hex langsung di komponen.

## Arah estetika

**Swiss editorial: grafit & kobalt.** Seperti poster gaya International
Typographic Style atau majalah arsitektur: latar abu grafit netral, tipografi
yang berkarakter, dan **satu** warna aksen biru kobalt yang tegas dan dipakai
seperlunya. Bukan dashboard SaaS dan bukan landing page startup.

Referensi rasa:

1. **Poster Swiss / International Typographic Style**: grid tegas, satu warna
   aksen yang berani, banyak ruang kosong.
2. **Biru Klein (International Klein Blue)**: biru kobalt pekat sebagai warna
   tanda tangan.
3. **Peta topografi & jurnal arsitek**: garis kontur, metadata mono, koordinat.

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
| `--color-primary`      | `#4A75FF` | **Kobalt.** CTA utama, link aktif, highlight |
| `--color-primary-dark` | `#3360F0` | Hover/pressed tombol primary                 |
| `--color-accent`       | `#3FCB8A` | **Hijau sinyal.** Status "tersedia", grafik GitHub |
| `--footer-bg`          | `#1B3BC4` | Footer: blok kobalt penuh, sama di kedua tema |
| `--footer-accent`      | `#C7D3FF` | Label kecil di atas footer kobalt            |

### Mode terang

| Token                  | Nilai     |
| ---------------------- | --------- |
| `--color-bg`           | `#F4F4F1` (kertas putih netral) |
| `--color-surface`      | `#FFFFFF` |
| `--color-surface-soft` | `#E8E9E9` |
| `--color-rule`         | `rgba(15,17,20,.24)` |
| `--color-text`         | `#111214` |
| `--color-text-soft`    | `#5B6068` |
| `--color-primary`      | `#2448E0` |
| `--color-primary-dark` | `#1A37B8` |
| `--color-accent`       | `#0F7A4B` |

Kontras sudah dicek: teks primary di atas bg ≥ 5:1 di kedua tema; teks putih
di atas tombol primary ≥ 4.4:1 (gelap) dan ≥ 6.5:1 (terang); teks putih di
atas footer kobalt 8.5:1.

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
- **Tekstur**:
  - `.topo` / `.topo--alt`: garis kontur topografi (SVG di
    `src/assets/textures/`, dipasang lewat CSS mask sehingga warnanya ikut
    tema). Pasang sebagai `<span class="topo" aria-hidden="true">` di dalam
    elemen `position: relative; isolation: isolate`. Hanya untuk hero, kontak,
    dan footer, jangan di setiap section.
  - Grain kertas: global di `body::after`, kekuatannya diatur
    `--grain-opacity`.
- Detail khas: koordinat Bandung `6°55′S 107°37′E`, nomor gambar
  ("Gbr. 01"), indeks "No. 03 / 06".

## Pemakaian warna di komponen

- **Tombol primary**: latar `--color-primary`, teks putih. Tombol sekunder:
  outline `--color-border`, teks `--color-text`.
- **Tab/filter aktif**: netral (latar `--color-text`, teks `--color-bg`), bukan
  primary. Primary disimpan untuk aksi utama.
- **Grafik/data** (misalnya kontribusi GitHub): skala `--color-accent` yang
  dicampur ke `--color-surface-soft` lewat `color-mix()`.
- **Peta (Leaflet)**: tile dibuat hitam-putih (`grayscale(1)`), penanda
  bawaan Leaflet yang biru dibiarkan.

## Jangan dipakai ❌

- Ungu/indigo/violet dalam bentuk apa pun (`#7C6FF0`, `#6366F1`, dll.).
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
- Hex warna yang ditulis langsung di komponen. Tambahkan token di
  `base.css` dulu.

## Changelog

- **2026-10-29**: Palet cokelat/terakota diganti **grafit + biru kobalt +
  hijau sinyal**. Footer jadi blok kobalt penuh, peta jadi hitam-putih.
- **2026-10-29**: Redesign layout "Field Notes": header section bergaris,
  radius diperkecil, tekstur kontur topografi + grain, tombol `.btn`.
  Versi sebelumnya (palet cokelat, layout lama) disimpan di branch
  `design/cokelat`.
- **2026-10-29**: Palet ungu/navy/toska diganti menjadi terakota + sage di
  atas netral hangat. Footer pakai `--footer-bg` (espresso). Dokumen ini dibuat.
