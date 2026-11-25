const USERNAME = 'joseparhusip'
const SESSION_GAP = 2 * 3600
const SESSION_START = 3600
const MAX_PAGES = 15

function headers() {
  const token = process.env.GITHUB_TOKEN
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-coding-estimate',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers: headers() })
  if (response.status === 409) return []
  if (!response.ok) throw new Error(`GitHub ${response.status}`)
  return response.json()
}

async function ownRepos() {
  const repos = []
  for (let page = 1; page <= 5; page++) {
    const batch = await github(`/users/${USERNAME}/repos?type=owner&per_page=100&page=${page}`)
    repos.push(...batch)
    if (batch.length < 100) break
  }
  return repos.filter((repo) => !repo.fork)
}

async function commitTimes(repo) {
  const times = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await github(`/repos/${USERNAME}/${repo}/commits?author=${USERNAME}&per_page=100&page=${page}`)
    for (const commit of batch) {
      const date = commit.commit?.author?.date || commit.commit?.committer?.date
      if (date) times.push(Date.parse(date) / 1000)
    }
    if (batch.length < 100) break
  }
  return times
}

export function estimateSeconds(times) {
  const sorted = [...new Set(times)].sort((a, b) => a - b)
  let total = 0
  for (let i = 0; i < sorted.length; i++) {
    const gap = i === 0 ? Infinity : sorted[i] - sorted[i - 1]
    total += gap <= SESSION_GAP ? gap : SESSION_START
  }
  return total
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const repos = await ownRepos()
    const perRepo = await Promise.all(repos.map((repo) => commitTimes(repo.name).catch(() => [])))
    const times = perRepo.flat()
    if (!times.length) return res.status(502).json({ error: 'No commits' })

    const created = repos.map((repo) => Date.parse(repo.created_at)).filter(Boolean)
    const since = new Date(Math.min(...created, ...times.map((s) => s * 1000))).toISOString().slice(0, 10)

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800')
    return res.status(200).json({
      estimateSeconds: estimateSeconds(times),
      commits: times.length,
      repos: perRepo.filter((list) => list.length).length,
      since,
    })
  } catch {
    return res.status(502).json({ error: 'Upstream error' })
  }
}
