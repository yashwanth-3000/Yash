import { NextResponse } from 'next/server'

// Revalidate every 30 minutes to keep contributions fresh throughout the day
export const revalidate = 60 * 30 // 30 minutes

type RawContribution = {
  date?: string
  count?: number
  contributionCount?: number
}

function asNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)))
    return Number(v)
  return null
}

function pickContributions(raw: any): RawContribution[] {
  if (Array.isArray(raw?.contributions)) return raw.contributions
  if (Array.isArray(raw?.contributions?.contributions))
    return raw.contributions.contributions
  if (Array.isArray(raw?.data?.contributions)) return raw.data.contributions
  return []
}

export async function GET(
  _req: Request,
  { params }: { params: { username: string } },
) {
  const username = params.username?.trim()
  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 })
  }

  // Public endpoint (no auth token) that returns per-day contribution counts.
  const upstream = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
    username,
  )}?y=last`

  const res = await fetch(upstream, {
    headers: {
      // Some upstreams require a UA.
      'User-Agent': 'portfolio-site',
      Accept: 'application/json',
    },
    next: { revalidate },
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Upstream request failed' },
      { status: 502 },
    )
  }

  const raw = await res.json()
  const items = pickContributions(raw)

  const contributions = items
    .map((c) => {
      const date = typeof c?.date === 'string' ? c.date : null
      const count =
        asNumber((c as any)?.count) ?? asNumber((c as any)?.contributionCount) ?? 0
      return date ? { date, count } : null
    })
    .filter(Boolean) as Array<{ date: string; count: number }>

  const total =
    asNumber(raw?.total) ??
    asNumber(raw?.totalContributions) ??
    contributions.reduce((sum, d) => sum + (d.count || 0), 0)

  return NextResponse.json({
    username,
    total,
    contributions,
  })
}

