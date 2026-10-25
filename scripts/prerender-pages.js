/* ---------------------------------------------------------
   Dijalankan otomatis setelah `vite build`.
   1. Membuat dist/<halaman>/index.html untuk tiap halaman
      (/tentang, /pengalaman, ...) dengan judul, deskripsi,
      canonical & Open Graph masing-masing. Hasilnya: alamat itu
      bisa dibuka/di-refresh langsung (tidak 404) dan Google
      langsung membaca judul yang benar.
   2. Menulis dist/sitemap.xml berisi semua halaman.
--------------------------------------------------------- */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, pages } from '../src/router/pages.js'

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function pageUrl(page) {
  return SITE_URL + (page.path === '/' ? '/' : page.path)
}

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Tag tidak ditemukan di index.html: ${pattern}`)
  return html.replace(pattern, replacement)
}

function renderPage(page) {
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const url = pageUrl(page)

  let html = template
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`)
  html = replaceOnce(html, /(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
  html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  return html
}

for (const page of pages) {
  const outFile =
    page.path === '/' ? join(distDir, 'index.html') : join(distDir, page.path.slice(1), 'index.html')
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, renderPage(page))
  console.log(`✓ ${page.path} → ${outFile.slice(distDir.length + 1)}`)
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${pageUrl(page)}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`
writeFileSync(join(distDir, 'sitemap.xml'), sitemap)
console.log(`✓ sitemap.xml (${pages.length} halaman)`)
