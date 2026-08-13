const path = require('path')

// ------------------------------------------------------------------
// GANTI dua link ini kalau nanti berubah
// ------------------------------------------------------------------
const LINKEDIN_URL = 'https://www.linkedin.com/in/joseparhusip/'
const INSTAGRAM_URL = 'https://www.instagram.com/joseparhusip_/'
const SITE_URL = 'https://joseelioparhusip.vercel.app' // ganti sesuai url portofolio kamu

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
}

function emailShell({ previewText, bodyHtml }) {
  return `
  <!doctype html>
  <html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Jose Elio Parhusip</title>
  </head>
  <body style="margin:0; padding:0; background:#f1f4f1; font-family:'Segoe UI', Arial, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(previewText)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f4f1; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

            <tr>
              <td style="background:linear-gradient(135deg, #6b9080, #4f7566); border-radius:20px 20px 0 0; padding:32px 28px;">
                <p style="margin:0; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#dceee5;">Portofolio</p>
                <p style="margin:4px 0 0; font-size:19px; font-weight:700; color:#ffffff;">Jose Elio Parhusip</p>
              </td>
            </tr>

            <tr>
              <td style="background:#ffffff; padding:32px 28px;">
                ${bodyHtml}
              </td>
            </tr>

            <tr>
              <td style="background:#ffffff; border-radius:0 0 20px 20px; padding:0 28px 28px;">
                <hr style="border:none; border-top:1px solid #e7ede9; margin:0 0 20px;" />
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:12px;">
                      <a href="${LINKEDIN_URL}" target="_blank" style="display:inline-block; width:34px; height:34px; border-radius:10px; background:#f1f4f1; text-align:center; line-height:34px;">
                        <img src="cid:linkedinIcon" width="18" height="18" alt="LinkedIn" style="vertical-align:middle;" />
                      </a>
                    </td>
                    <td>
                      <a href="${INSTAGRAM_URL}" target="_blank" style="display:inline-block; width:34px; height:34px; border-radius:10px; background:#f1f4f1; text-align:center; line-height:34px;">
                        <img src="cid:instagramIcon" width="18" height="18" alt="Instagram" style="vertical-align:middle;" />
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:18px 0 0; font-size:12px; color:#9aa9a3;">
                  Dikirim otomatis dari form kontak di
                  <a href="${SITE_URL}" style="color:#6b9080; text-decoration:none;">portofolio Jose</a>.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

function buildOwnerNotificationEmail({ name, email, message }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')
  const gmailReplyUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Re: Pesan dari portofolio')}`

  const bodyHtml = `
    <p style="margin:0 0 6px; font-size:13px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#6b9080;">
      Pesan baru masuk
    </p>
    <h1 style="margin:0 0 20px; font-size:21px; color:#253632;">
      ${safeName} baru saja menghubungi kamu
    </h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f4f1; border-radius:14px; padding:18px 20px; margin-bottom:20px;">
      <tr>
        <td style="padding-bottom:10px;">
          <p style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:#5c6f69;">Nama</p>
          <p style="margin:2px 0 0; font-size:15px; font-weight:600; color:#253632;">${safeName}</p>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:10px;">
          <p style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:#5c6f69;">Email</p>
          <p style="margin:2px 0 0; font-size:15px; font-weight:600; color:#253632;">${safeEmail}</p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:#5c6f69;">Pesan</p>
          <p style="margin:6px 0 0; font-size:14.5px; line-height:1.7; color:#3c4a45;">${safeMessage}</p>
        </td>
      </tr>
    </table>

    <a
      href="${gmailReplyUrl}"
      target="_blank"
      style="display:inline-block; background:#6b9080; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; padding:12px 24px; border-radius:999px;"
    >
      Balas ${safeName} →
    </a>
  `

  return {
    subject: `📩 Pesan baru dari ${name} lewat portofolio`,
    text: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
    html: emailShell({
      previewText: `${name} mengirim pesan baru lewat form kontak portofolio kamu.`,
      bodyHtml,
    }),
    attachments: brandAttachments,
  }
}

function buildVisitorConfirmationEmail({ name }) {
  const safeName = escapeHtml(name)

  const bodyHtml = `
    <p style="margin:0 0 6px; font-size:13px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#6b9080;">
      Pesan diterima
    </p>
    <h1 style="margin:0 0 16px; font-size:21px; color:#253632;">
      Terima kasih, ${safeName}! 👋
    </h1>
    <p style="margin:0 0 14px; font-size:15px; line-height:1.75; color:#3c4a45;">
      Pesan kamu lewat form kontak di portofolio saya sudah masuk dengan aman. Saya akan
      membaca dan membalas pesan kamu secepatnya, paling lambat dalam waktu 1 x 24 jam.
    </p>
    <p style="margin:0 0 24px; font-size:15px; line-height:1.75; color:#3c4a45;">
      Sambil menunggu balasan, kalau kamu ingin kenalan lebih jauh atau melihat proyek-proyek
      saya yang lain, silakan mampir ke sosial media saya di bawah ini. Saya selalu senang
      berkenalan dengan orang baru.
    </p>

    <p style="margin:0 0 4px; font-size:15px; line-height:1.75; color:#3c4a45;">
      Terima kasih banyak sudah menyempatkan waktu untuk menghubungi saya.
    </p>

    <p style="margin:28px 0 0; font-size:14px; line-height:1.7; color:#5c6f69;">
      Salam hangat,<br />
      <strong style="color:#253632;">Jose Elio Parhusip</strong>
    </p>
  `

  return {
    subject: 'Terima kasih sudah menghubungi saya 👋',
    text: `Halo ${name},\n\nTerima kasih sudah mengirim pesan lewat portofolio saya. Pesan kamu sudah saya terima dan akan saya balas paling lambat dalam 1 x 24 jam.\n\nSalam hangat,\nJose Elio Parhusip`,
    html: emailShell({
      previewText: 'Pesanmu sudah saya terima, akan saya balas secepatnya!',
      bodyHtml,
    }),
    attachments: brandAttachments,
  }
}

module.exports = {
  buildOwnerNotificationEmail,
  buildVisitorConfirmationEmail,
}
