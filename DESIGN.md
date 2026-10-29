# Design System — Jose Elio Parhusip Portfolio

Dokumen ini adalah acuan tampilan situs. Tempel isinya di awal sesi setiap kali
minta bantuan AI untuk desain, supaya hasilnya konsisten dan tidak jatuh ke
gaya "AI generik". Semua nilai di bawah sudah ada sebagai CSS variable di
[`src/assets/base.css`](src/assets/base.css). Pakai variable-nya, jangan tulis
hex langsung di komponen.

## Arah estetika

**Editorial hangat: tinta & kertas.** Seperti majalah desain atau buku
catatan arsitek: latar netral hangat, tipografi yang berkarakter, dan **satu**
warna aksen tegas yang dipakai seperlunya. Bukan dashboard SaaS dan bukan
landing page startup.

Referensi rasa:

1. **Are.na**: editorial, tenang, banyak ruang kosong.
2. **Tema IDE Gruvbox**: hangat, earthy, kontras nyaman di mode gelap.
3. **Kertas kraft + cap stempel terakota**: aksen tegas di atas netral hangat.

Kepribadian: percaya diri, hangat, rapi, tidak berisik.

## Warna

Aturan 60–30–10: **60% netral** (bg/surface), **30% teks**, **≤10% warna**
(primary + accent digabung). Kalau satu layar terasa "warna-warni", kurangi.

### Mode gelap (default)

| Token                  | Nilai     | Pakai untuk                                  |
| ---------------------- | --------- | -------------------------------------------- |
| `--color-bg`           | `#12110F` | Latar halaman (hitam tinta, sedikit hangat)  |
| `--color-surface`      | `#1A1916` | Section bergantian, kartu                    |
| `--color-surface-soft` | `#24221E` | Isian input, chip, sel kosong                |
| `--color-border`       | `rgba(237,231,220,.10)` | Garis pemisah, outline kartu   |
| `--color-text`         | `#EDE7DC` | Teks utama (putih kertas, bukan putih murni) |
| `--color-text-soft`    | `#A29B8F` | Teks sekunder, label                         |
| `--color-primary`      | `#D4572A` | **Terakota.** CTA utama, link aktif, highlight |
| `--color-primary-dark` | `#B34420` | Hover/pressed tombol primary                 |
| `--color-accent`       | `#8FB27A` | **Sage.** Status "tersedia", grafik, badge sukses |
| `--footer-bg`          | `#1E140E` | Footer (espresso tua, sama di kedua tema)    |

### Mode terang

| Token                  | Nilai     |
| ---------------------- | --------- |
| `--color-bg`           | `#F5F1E8` (kertas krem) |
| `--color-surface`      | `#FCFAF5` |
| `--color-surface-soft` | `#ECE6DA` |
| `--color-text`         | `#1F1B16` |
| `--color-text-soft`    | `#655D52` |
| `--color-primary`      | `#B8471E` |
| `--color-primary-dark` | `#963817` |
| `--color-accent`       | `#48733A` |

Kontras sudah dicek: teks primary di atas bg ≥ 4.5:1 di kedua tema; teks
putih di atas tombol primary ≥ 4:1 (gelap) dan ≥ 5:1 (terang).

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

- Radius: `--radius-sm` 10px, `--radius` 18px, `--radius-lg` 28px. Tombol dan
  chip boleh pill (`999px`).
- Spasi section: `--section-y` (clamp 4.5–8rem). Container 1200px.
- Bayangan cukup `--shadow-card`. Jangan menumpuk bayangan berwarna.

## Pemakaian warna di komponen

- **Tombol primary**: latar `--color-primary`, teks putih. Tombol sekunder:
  outline `--color-border`, teks `--color-text`.
- **Tab/filter aktif**: netral (latar `--color-text`, teks `--color-bg`), bukan
  primary. Primary disimpan untuk aksi utama.
- **Grafik/data** (misalnya kontribusi GitHub): skala `--color-accent` yang
  dicampur ke `--color-surface-soft` lewat `color-mix()`.
- **Glow latar**: maksimal satu cahaya `--color-primary-soft` per section,
  sangat halus.

## Jangan dipakai ❌

- Ungu/indigo/violet dalam bentuk apa pun (`#7C6FF0`, `#6366F1`, dll.).
- Gradien ungu→biru atau ungu→pink, terutama di hero.
- Latar navy kebiruan (`#0B0E17`, `#0F172A`) atau abu "slate" dingin.
- Kombinasi ungu + toska/cyan.
- Font Inter, Roboto, Open Sans, Lato, atau system font sebagai font utama.
- Teks gradien di mana-mana. Satu tempat (judul hero) sudah cukup.
- Emoji di judul, badge "AI-powered", atau ikon sparkle ✨ sebagai dekorasi.
- Tiga kartu kembar sejajar dengan ikon bulat di atasnya.
- Hex warna yang ditulis langsung di komponen. Tambahkan token di
  `base.css` dulu.

## Changelog

- **2026-10-29**: Palet ungu/navy/toska diganti menjadi terakota + sage di
  atas netral hangat. Footer pakai `--footer-bg` (espresso). Dokumen ini dibuat.
