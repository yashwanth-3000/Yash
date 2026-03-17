import { NextResponse } from 'next/server'
import DodoPayments from 'dodopayments'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface DodoCustomer {
  customer_id: string
  business_id: string
  name: string
  email: string
  phone_number: string | null
  created_at: string
  metadata: Record<string, unknown>
}

// In-memory cache to avoid hammering the API on every request.
// Dodo rate limits: 40 req/s, 240 req/min — pagination burns through this fast.
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
let cachedCustomers: DodoCustomer[] | null = null
let cacheTimestamp = 0
let fetchInProgress: Promise<DodoCustomer[]> | null = null

async function fetchDodoCustomers(): Promise<DodoCustomer[]> {
  const now = Date.now()
  if (cachedCustomers && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedCustomers
  }

  // Deduplicate concurrent requests while a fetch is already running
  if (fetchInProgress) return fetchInProgress

  fetchInProgress = (async () => {
    try {
      const apiKey = process.env.DODO_PAYMENTS_API_KEY
      if (!apiKey) {
        console.error('DODO_PAYMENTS_API_KEY not configured in .env.local')
        return cachedCustomers ?? []
      }

      const client = new DodoPayments({ bearerToken: apiKey })

      const customers: DodoCustomer[] = []
      for await (const customer of client.customers.list()) {
        customers.push(customer as DodoCustomer)
      }

      console.log(
        `✅ Successfully fetched ${customers.length} customers from Dodo Payments`,
      )

      cachedCustomers = customers
      cacheTimestamp = Date.now()
      return customers
    } catch (error: any) {
      const status = error?.status ?? error?.statusCode
      if (status === 429) {
        console.warn(
          '⚠️  Rate limited by Dodo Payments (429). Serving cached data.',
        )
        if (cachedCustomers) {
          cacheTimestamp = Date.now() - CACHE_TTL_MS + 60_000 // retry in 1 min
          return cachedCustomers
        }
      }
      console.error('Error fetching customers from Dodo Payments:', error)
      return cachedCustomers ?? []
    } finally {
      fetchInProgress = null
    }
  })()

  return fetchInProgress
}

export async function GET() {
  try {
    const customers = await fetchDodoCustomers()

    return NextResponse.json(
      {
        customers,
        total: customers.length,
        timestamp: new Date().toISOString(),
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
