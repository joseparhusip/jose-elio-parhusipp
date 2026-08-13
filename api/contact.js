import nodemailer from 'nodemailer'
import { buildOwnerNotificationEmail, buildVisitorConfirmationEmail } from './_lib/emailTemplates.js'

const { EMAIL_USER, EMAIL_PASS, SMTP_HOST, SMTP_PORT } = process.env

// Transporter dibuat di luar handler supaya bisa dipakai ulang antar
// invocation selama function masih "hangat" (mengurangi cold start).
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Vercel otomatis menjadikan file ini endpoint: POST /api/contact
export default async (req, res) => {
  // Izinkan dipanggil dari domain frontend kamu (ganti kalau perlu dibatasi)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const name = (req.body?.name || '').trim()
  const email = (req.body?.email || '').trim()
  const message = (req.body?.message || '').trim()

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Nama, email, dan pesan wajib diisi.' })
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Format email tidak valid.' })
  }

  try {
    const ownerEmail = buildOwnerNotificationEmail({ name, email, message })
    const visitorEmail = buildVisitorConfirmationEmail({ name })

    await transporter.sendMail({
      from: `"Portofolio - ${name}" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: ownerEmail.subject,
      text: ownerEmail.text,
      html: ownerEmail.html,
      attachments: ownerEmail.attachments,
    })

    await transporter.sendMail({
      from: `"Jose Elio Parhusip" <${EMAIL_USER}>`,
      to: email,
      subject: visitorEmail.subject,
      text: visitorEmail.text,
      html: visitorEmail.html,
      attachments: visitorEmail.attachments,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Gagal kirim email:', err.message)
    return res.status(500).json({ ok: false, error: 'Gagal mengirim email, coba lagi nanti.' })
  }
}
