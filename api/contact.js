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

/* ---------------------------------------------------------
   Pengamanan endpoint (supaya akun email tidak disalahgunakan):
   - Hanya domain sendiri yang boleh memanggil dari browser (CORS).
   - Batas panjang isian, dan baris baru dibuang dari nama/email
     supaya tidak bisa menyisipkan header email.
   - Batas kiriman per IP (5 per 10 menit). Disimpan di memori function,
     jadi bukan pengaman mutlak, tapi cukup menahan spam berulang.
--------------------------------------------------------- */
const ALLOWED_ORIGINS = [
  'https://www.joseparhusip.com',
  'https://joseparhusip.com',
  'https://jose-elio-parhusipp.vercel.app',
]
const LIMITS = { name: 80, email: 254, message: 3000 }
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const hits = new Map() // ip -> [timestamp, ...]

function isRateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // jaga memori tetap kecil
  return recent.length > RATE_MAX
}

const oneLine = (text) => String(text || '').replace(/[\r\n\t]+/g, ' ').trim()

// Vercel otomatis menjadikan file ini endpoint: POST /api/contact
export default async (req, res) => {
  // Hanya domain sendiri yang boleh memanggil dari browser
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  // Permintaan dari situs lain ditolak (browser selalu mengirim Origin pada POST)
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ ok: false, error: 'Asal permintaan tidak diizinkan.' })
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (isRateLimited(ip)) {
    return res
      .status(429)
      .json({ ok: false, error: 'Terlalu banyak pesan. Coba lagi beberapa menit lagi.' })
  }

  const name = oneLine(req.body?.name)
  const email = oneLine(req.body?.email)
  const message = String(req.body?.message || '').trim()

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Nama, email, dan pesan wajib diisi.' })
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return res.status(400).json({ ok: false, error: 'Isian terlalu panjang.' })
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Format email tidak valid.' })
  }

  try {
    const ownerEmail = buildOwnerNotificationEmail({ name, email, message })
    const visitorEmail = buildVisitorConfirmationEmail({ name, message })

    await transporter.sendMail({
      // Tanda kutip dibuang supaya nama tidak merusak format alamat pengirim
      from: `"Portofolio - ${name.replace(/["\\]/g, '')}" <${EMAIL_USER}>`,
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
