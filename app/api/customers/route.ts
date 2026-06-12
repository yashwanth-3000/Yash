import { NextResponse } from 'next/server'
import DodoPayments from 'dodopayments'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 10

interface CustomerActivity {
  created_at: string
}

interface CustomerRecord extends CustomerActivity {
  customer_id?: string | null
  email?: string | null
  name?: string | null
  metadata?: Record<string, unknown> | null
}

interface CustomerSnapshot {
  customers: CustomerRecord[]
  fetchedPages: number
  hasMore: boolean
  timestamp: string
}

// In-memory cache to avoid hammering the API on every request.
// Dodo rate limits: 40 req/s, 240 req/min — pagination burns through this fast.
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const PAGE_SIZE = 100
const MAX_PAGES = 25
const REQUEST_TIMEOUT_MS = 2_500
const FETCH_BUDGET_MS = 9_000

let cachedSnapshot: CustomerSnapshot | null = null
let cacheTimestamp = 0
let fetchInProgress: Promise<CustomerSnapshot> | null = null

function normalizeIdentity(value: unknown) {
  return typeof value === 'string' && value.trim()
    ? value.trim().toLowerCase()
    : null
}

function getMetadataAdobeUserId(customer: CustomerRecord) {
  return normalizeIdentity(customer.metadata?.adobe_uid)
}

function getGeneratedAdobeUserId(customer: CustomerRecord) {
  const email = normalizeIdentity(customer.email)
  const suffix = '@adobe-express.local'
  if (email?.endsWith(suffix)) return email.slice(0, -suffix.length)

  const name = normalizeIdentity(customer.name)
  if (name?.startsWith('user ')) return name.slice(5).trim()

  return null
}

function getAdobeUserId(customer: CustomerRecord) {
  return getMetadataAdobeUserId(customer) ?? getGeneratedAdobeUserId(customer)
}

function getIdentityForProject(customer: CustomerRecord, project: string | null) {
  if (project === 'content-hub') {
    // Content Hub writes the Adobe user ID into Dodo metadata when it creates
    // or finds the customer. Count that identity, not feature-specific metadata
    // such as x_voice_* which only appears after optional My Voice setup.
    return getMetadataAdobeUserId(customer)
  }

  if (project === 'img-crafter') {
    return getAdobeUserId(customer)
  }

  return normalizeIdentity(customer.customer_id)
}

function toCustomerActivity(
  customers: CustomerRecord[],
  project: string | null,
): CustomerActivity[] {
  const identityMap = new Map<string, CustomerActivity>()

  customers.forEach((customer) => {
    const identity = getIdentityForProject(customer, project)
    if (!identity) return

    const existing = identityMap.get(identity)
    if (!existing || customer.created_at < existing.created_at) {
      identityMap.set(identity, { created_at: customer.created_at })
    }
  })

  return Array.from(identityMap.values()).sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  )
}

function emptySnapshot(): CustomerSnapshot {
  return {
    customers: [],
    fetchedPages: 0,
    hasMore: false,
    timestamp: new Date().toISOString(),
  }
}

async function fetchDodoCustomers(): Promise<CustomerSnapshot> {
  const now = Date.now()
  if (cachedSnapshot && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSnapshot
  }

  // Deduplicate concurrent requests while a fetch is already running
  if (fetchInProgress) return fetchInProgress

  fetchInProgress = (async () => {
    try {
      const apiKey = process.env.DODO_PAYMENTS_API_KEY
      if (!apiKey) {
        console.error('DODO_PAYMENTS_API_KEY not configured in .env.local')
        return cachedSnapshot ?? emptySnapshot()
      }

      const client = new DodoPayments({ bearerToken: apiKey })

      const customers: CustomerRecord[] = []
      let fetchedPages = 0
      let hasMore = false
      const startedAt = Date.now()

      for (let pageNumber = 0; pageNumber < MAX_PAGES; pageNumber++) {
        const elapsed = Date.now() - startedAt
        const remainingBudget = FETCH_BUDGET_MS - elapsed

        if (customers.length > 0 && remainingBudget <= REQUEST_TIMEOUT_MS) {
          hasMore = true
          break
        }

        const page = await client.customers.list(
          {
            page_number: pageNumber,
            page_size: PAGE_SIZE,
          },
          {
            maxRetries: 0,
            timeout: Math.max(
              1_000,
              Math.min(REQUEST_TIMEOUT_MS, remainingBudget),
            ),
          },
        )

        const items = page.items ?? []
        fetchedPages += 1

        if (!items.length) {
          hasMore = false
          break
        }

        customers.push(...items)

        if (items.length < PAGE_SIZE) {
          hasMore = false
          break
        }

        hasMore = true
      }

      console.log(
        `✅ Successfully fetched ${customers.length}${hasMore ? '+' : ''} customers from Dodo Payments across ${fetchedPages} page(s)`,
      )

      const snapshot = {
        customers,
        fetchedPages,
        hasMore,
        timestamp: new Date().toISOString(),
      }

      cachedSnapshot = snapshot
      cacheTimestamp = Date.now()
      return snapshot
    } catch (error: any) {
      const status = error?.status ?? error?.statusCode
      if (status === 429) {
        console.warn(
          '⚠️  Rate limited by Dodo Payments (429). Serving cached data.',
        )
        if (cachedSnapshot) {
          cacheTimestamp = Date.now() - CACHE_TTL_MS + 60_000 // retry in 1 min
          return cachedSnapshot
        }
      }
      console.error('Error fetching customers from Dodo Payments:', error)
      return cachedSnapshot ?? emptySnapshot()
    } finally {
      fetchInProgress = null
    }
  })()

  return fetchInProgress
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const project = searchParams.get('project')
    const snapshot = await fetchDodoCustomers()
    const customerActivity = toCustomerActivity(
      snapshot.customers,
      project,
    )

    return NextResponse.json(
      {
        customers: customerActivity,
        total: customerActivity.length,
        fetchedPages: snapshot.fetchedPages,
        hasMore: snapshot.hasMore,
        project: project ?? 'all',
        timestamp: snapshot.timestamp,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        },
      },
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers', customers: [], total: 0 },
      { status: 500 },
    )
  }
}
