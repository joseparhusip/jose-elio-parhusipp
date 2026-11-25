const API = 'https://wakatime.com/api/v1/users'

async function wakatime(url, headers = {}) {
  const response = await fetch(url, { headers: { ...headers, 'User-Agent': 'portfolio-coding-time' } })
  if (response.status === 202) return null
  if (!response.ok) throw new Error(`WakaTime ${response.status}`)
  const json = await response.json()
  return json?.data ?? null
}

function topLanguages(list) {
  return (list ?? [])
    .filter((lang) => lang.total_seconds > 0 && lang.name !== 'Other')
    .slice(0, 4)
    .map((lang) => ({ name: lang.name, percent: Math.round(lang.percent) }))
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function publicProfile(username) {
  const id = UUID.test(username) ? username : `@${username}`
  const base = `${API}/${encodeURIComponent(id).replace('%40', '@')}`
  const [total, week] = await Promise.all([
    wakatime(`${base}/all_time_since_today`),
    wakatime(`${base}/stats/last_7_days`).catch(() => null),
  ])
  if (!total || typeof total.total_seconds !== 'number') return null
  return {
    mode: 'total',
    totalSeconds: Math.round(total.total_seconds),
    since: total.range?.start_date ?? total.range?.start ?? null,
    dailyAverageSeconds: Math.round(week?.daily_average ?? 0),
    bestDay: week?.best_day?.date ? { date: week.best_day.date, seconds: Math.round(week.best_day.total_seconds) } : null,
    languages: topLanguages(week?.languages),
  }
}

async function today(apiKey) {
  const auth = `Basic ${Buffer.from(apiKey).toString('base64')}`
  const data = await wakatime(`${API}/current/status_bar/today`, { Authorization: auth })
  if (!data?.grand_total) return null
  return {
    mode: 'today',
    todaySeconds: Math.round(data.grand_total.total_seconds ?? 0),
    date: data.range?.date ?? null,
    timezone: data.range?.timezone ?? null,
    languages: topLanguages(data.languages),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const username = process.env.WAKATIME_USERNAME?.trim().replace(/^@/, '')
  const apiKey = process.env.WAKATIME_API_KEY?.trim()
  if (!username && !apiKey) return res.status(503).json({ error: 'Not configured' })

  try {
    const result = (username && (await publicProfile(username).catch(() => null))) || (apiKey && (await today(apiKey)))
    if (!result) return res.status(502).json({ error: 'Upstream error' })
    res.setHeader('Cache-Control', `public, s-maxage=${result.mode === 'today' ? 300 : 1800}, stale-while-revalidate=3600`)
    return res.status(200).json(result)
  } catch {
    return res.status(502).json({ error: 'Upstream error' })
  }
}
