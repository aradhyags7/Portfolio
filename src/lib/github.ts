export interface Contribution {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface ContributionData {
  total: Record<string, number>
  contributions: Contribution[]
}

/**
 * Live GitHub contributions via the public jogruber proxy, falling back to the
 * snapshot bundled at build time if the network or API lets us down.
 */
export async function fetchContributions(
  user: string,
): Promise<{ data: ContributionData; live: boolean }> {
  try {
    const ctrl = new AbortController()
    const timer = window.setTimeout(() => ctrl.abort(), 6000)
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, {
      signal: ctrl.signal,
    })
    window.clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as ContributionData
    if (!Array.isArray(data.contributions) || data.contributions.length === 0) throw new Error('empty')
    return { data, live: true }
  } catch {
    const base = import.meta.env.BASE_URL || './'
    const cleanBase = base.endsWith('/') ? base : base + '/'
    const res = await fetch(`${cleanBase}github-fallback.json`)
    const data = (await res.json()) as ContributionData
    return { data, live: false }
  }
}
