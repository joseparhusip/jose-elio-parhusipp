const USERNAME = 'joseparhusip'
const FIRST_YEAR = 2024
const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }

const QUERY = `query ($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

function rangeFor(key, now) {
  if (key === 'last') {
    const from = new Date(now)
    from.setUTCFullYear(from.getUTCFullYear() - 1)
    from.setUTCDate(from.getUTCDate() + 1)
    from.setUTCHours(0, 0, 0, 0)
    return { from, to: now }
  }
  const year = Number(key)
  if (!Number.isInteger(year) || year < FIRST_YEAR || year > now.getUTCFullYear()) return null
  const from = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59))
  return { from, to: end < now ? end : now }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(503).json({ error: 'Not configured' })

  const key = String(req.query.y ?? 'last')
  const range = rangeFor(key, new Date())
  if (!range) return res.status(400).json({ error: 'Invalid range' })

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-contributions',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: USERNAME, from: range.from.toISOString(), to: range.to.toISOString() },
      }),
    })
    if (!response.ok) return res.status(502).json({ error: 'Upstream error' })

    const json = await response.json()
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar
    if (!calendar) return res.status(502).json({ error: 'Upstream error' })

    const fromDate = range.from.toISOString().slice(0, 10)
    const toDate = range.to.toISOString().slice(0, 10)
    const contributions = calendar.weeks
      .flatMap((week) => week.contributionDays)
      .filter((day) => day.date >= fromDate && day.date <= toDate)
      .map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVELS[day.contributionLevel] ?? 0,
      }))

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({ total: { [key]: calendar.totalContributions }, contributions })
  } catch {
    return res.status(502).json({ error: 'Upstream error' })
  }
}
