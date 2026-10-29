import path from 'path'
import { fileURLToPath } from 'url'

// __dirname nggak otomatis ada di ES Module, jadi dibikin manual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ------------------------------------------------------------------
// GANTI link ini kalau nanti berubah
// ------------------------------------------------------------------
const LINKEDIN_URL = 'https://www.linkedin.com/in/joseparhusip/'
const INSTAGRAM_URL = 'https://www.instagram.com/joseparhusip_/'
const SITE_URL = 'https://jose-elio-parhusipp.vercel.app' // sama dengan SITE_URL di src/router/pages.js

// Warna mengikuti DESIGN.md (mode terang): grafit netral + biru azure.
// Email tidak bisa memakai CSS variable, jadi nilainya ditulis di sini.
// Tanpa gradien: banyak aplikasi email (Outlook, sebagian Gmail) tidak
// mendukungnya dan latar bisa hilang.
const C = {
  page: '#F4F4F1',
  card: '#FFFFFF',
  ink: '#111214',
  text: '#2B2E33',
  soft: '#5B6068',
  rule: '#E3E4E2',
  panel: '#F4F4F1',
  accent: '#0059B3',
  onInk: '#FFFFFF',
  onInkSoft: '#A9AEB6',
}
const FONT = "'Segoe UI', Helvetica, Arial, sans-serif"
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"

// Logo LinkedIn & Instagram disimpan di dalam folder ini juga (api/_lib/email-assets),
// jadi ikut ke-deploy bareng function-nya, nggak perlu path ke folder src/ lagi.
const ASSET_DIR = path.join(__dirname, 'email-assets')

const brandAttachments = [
  {
    filename: 'linkedin.png',
    path: path.join(ASSET_DIR, 'linkedin.png'),
    cid: 'linkedinIcon',
    contentType: 'image/png',
  },
  {
    filename: 'instagram.png',
    path: path.join(ASSET_DIR, 'instagram.png'),
    cid: 'instagramIcon',
    contentType: 'image/png',
  },
]

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Label kecil huruf besar, seperti ".mono-meta" di website
function label(text, color = C.soft) {
  return `<p style="margin:0; font-family:${MONO}; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:${color};">${text}</p>`
}

// Tombol yang aman di semua aplikasi email (tabel + bgcolor, bukan hanya CSS)
function button(href, text) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td bgcolor="${C.accent}" style="border-radius:6px;">
          <a href="${href}" target="_blank"
             style="display:inline-block; padding:12px 22px; font-family:${FONT}; font-size:14px; font-weight:600; color:#FFFFFF; text-decoration:none; border-radius:6px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>`
}

function emailShell({ previewText, eyebrow, bodyHtml }) {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>Jose Elio Parhusip</title>
</head>
<body style="margin:0; padding:0; background:${C.page}; font-family:${FONT};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(previewText)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page}; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Kepala: blok tinta, nama besar, label mono -->
          <tr>
            <td bgcolor="${C.ink}" style="background:${C.ink}; border-radius:14px 14px 0 0; padding:28px 28px 26px;">
              ${label(eyebrow, C.onInkSoft)}
              <p style="margin:8px 0 0; font-family:${FONT}; font-size:22px; font-weight:700; letter-spacing:-0.02em; color:${C.onInk};">
                Jose Elio Parhusip
              </p>
            </td>
          </tr>

          <!-- Isi -->
          <tr>
            <td bgcolor="${C.card}" style="background:${C.card}; padding:30px 28px 26px; border-left:1px solid ${C.rule}; border-right:1px solid ${C.rule};">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Kaki: sosial + asal email -->
          <tr>
            <td bgcolor="${C.card}" style="background:${C.card}; border-radius:0 0 14px 14px; padding:0 28px 26px; border:1px solid ${C.rule}; border-top:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.rule};">
                <tr>
                  <td style="padding-top:18px;">
                    <a href="${LINKEDIN_URL}" target="_blank" style="display:inline-block; margin-right:8px; text-decoration:none;">
                      <img src="cid:linkedinIcon" width="20" height="20" alt="LinkedIn" style="vertical-align:middle; border:0;" />
                    </a>
                    <a href="${INSTAGRAM_URL}" target="_blank" style="display:inline-block; text-decoration:none;">
                      <img src="cid:instagramIcon" width="20" height="20" alt="Instagram" style="vertical-align:middle; border:0;" />
                    </a>
                  </td>
                  <td align="right" style="padding-top:18px;">
                    <a href="${SITE_URL}" target="_blank" style="font-family:${MONO}; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:${C.accent}; text-decoration:none;">
                      Lihat portofolio
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0; font-family:${FONT}; font-size:12px; line-height:1.6; color:${C.soft};">
                Dikirim otomatis dari chat kontak di portofolio Jose. Bandung, Indonesia.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Kotak data bergaris tipis: label mono di atas, nilai di bawah
function detailRow(name, valueHtml, last = false) {
  return `
    <tr>
      <td style="padding:14px 0; ${last ? '' : `border-bottom:1px solid ${C.rule};`}">
        ${label(name)}
        <div style="margin-top:4px; font-family:${FONT}; font-size:15px; line-height:1.65; color:${C.text};">${valueHtml}</div>
      </td>
    </tr>`
}

function buildOwnerNotificationEmail({ name, email, message }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')
  const gmailReplyUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Re: Pesan dari portofolio')}`

  const bodyHtml = `
    <h1 style="margin:0 0 6px; font-family:${FONT}; font-size:21px; line-height:1.3; letter-spacing:-0.01em; color:${C.ink};">
      ${safeName} baru saja menghubungi kamu
    </h1>
    <p style="margin:0 0 18px; font-family:${FONT}; font-size:14px; line-height:1.6; color:${C.soft};">
      Pesan ini masuk lewat chat di portofolio. Balas langsung ke email pengirim.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.ink}; margin-bottom:24px;">
      ${detailRow('Nama', `<strong style="color:${C.ink};">${safeName}</strong>`)}
      ${detailRow('Email', `<a href="mailto:${safeEmail}" style="color:${C.accent}; text-decoration:none; font-weight:600;">${safeEmail}</a>`)}
      ${detailRow('Pesan', safeMessage, true)}
    </table>

    ${button(gmailReplyUrl, `Balas ${safeName} &rarr;`)}
  `

  return {
    subject: `Pesan baru dari ${name} lewat portofolio`,
    text: `Pesan baru lewat portofolio\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}\n\nBalas: ${gmailReplyUrl}`,
    html: emailShell({
      previewText: `${name}: ${String(message).slice(0, 90)}`,
      eyebrow: 'Pesan baru masuk',
      bodyHtml,
    }),
    attachments: brandAttachments,
  }
}

function buildVisitorConfirmationEmail({ name, message = '' }) {
  const safeName = escapeHtml(name)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')

  const bodyHtml = `
    <h1 style="margin:0 0 16px; font-family:${FONT}; font-size:21px; line-height:1.3; letter-spacing:-0.01em; color:${C.ink};">
      Terima kasih, ${safeName}!
    </h1>
    <p style="margin:0 0 14px; font-family:${FONT}; font-size:15px; line-height:1.75; color:${C.text};">
      Pesan kamu lewat portofolio saya sudah masuk dengan aman. Saya akan membaca dan
      membalasnya secepatnya, paling lambat dalam 1 x 24 jam.
    </p>

    ${
      safeMessage
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 20px; border-top:1px solid ${C.ink};">
            ${detailRow('Salinan pesan kamu', safeMessage, true)}
          </table>`
        : ''
    }

    <p style="margin:0 0 22px; font-family:${FONT}; font-size:15px; line-height:1.75; color:${C.text};">
      Sambil menunggu, kamu bisa lihat proyek-proyek saya yang lain di portofolio atau
      sapa saya di LinkedIn dan Instagram.
    </p>

    ${button(SITE_URL, 'Lihat portofolio &rarr;')}

    <p style="margin:28px 0 0; font-family:${FONT}; font-size:14px; line-height:1.7; color:${C.soft};">
      Salam,<br />
      <strong style="color:${C.ink};">Jose Elio Parhusip</strong>
    </p>
  `

  return {
    subject: 'Pesan kamu sudah saya terima',
    text: `Halo ${name},\n\nTerima kasih sudah mengirim pesan lewat portofolio saya. Pesan kamu sudah saya terima dan akan saya balas paling lambat dalam 1 x 24 jam.${message ? `\n\nSalinan pesan kamu:\n${message}` : ''}\n\nPortofolio: ${SITE_URL}\n\nSalam,\nJose Elio Parhusip`,
    html: emailShell({
      previewText: 'Pesan kamu sudah saya terima, akan saya balas secepatnya.',
      eyebrow: 'Pesan diterima',
      bodyHtml,
    }),
    attachments: brandAttachments,
  }
}

export { buildOwnerNotificationEmail, buildVisitorConfirmationEmail }
