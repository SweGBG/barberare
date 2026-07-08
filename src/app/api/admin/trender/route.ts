import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface NewsArticle {
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  source: { name: string }
}

interface CacheEntry {
  data: NewsArticle[]
  timestamp: number
  queries: string[]
}

const CACHE_DURATION_MS = 60 * 60 * 1000

// In-memory state (lever mellan requests på samma serverinstans)
let cache: CacheEntry | null = null
let savedQueries: string[] = ['barbershop trends', 'hair styling 2026']

async function fetchNews(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) throw new Error('NEWS_API_KEY saknas i miljövariabler')

  const url = new URL('https://newsapi.org/v2/everything')
  url.searchParams.set('q', query)
  url.searchParams.set('language', 'en')
  url.searchParams.set('sortBy', 'publishedAt')
  url.searchParams.set('pageSize', '5')
  url.searchParams.set('apiKey', apiKey)

  const res = await fetch(url.toString(), { next: { revalidate: 0 } })
  if (!res.ok) throw new Error(`NewsAPI svarade ${res.status}`)

  const json = await res.json()
  return (json.articles ?? []) as NewsArticle[]
}

async function buildFeed(queries: string[]): Promise<NewsArticle[]> {
  const results = await Promise.all(queries.map(fetchNews))

  const seen = new Set<string>()
  const merged: NewsArticle[] = []

  for (const article of results.flat()) {
    if (!seen.has(article.url) && merged.length < 8) {
      seen.add(article.url)
      merged.push(article)
    }
  }

  merged.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return merged
}

// GET — hämta nyheter (cacha 1h) + returnera aktiva queries
export async function GET() {
  try {
    const now = Date.now()

    if (
      cache &&
      now - cache.timestamp < CACHE_DURATION_MS &&
      JSON.stringify(cache.queries) === JSON.stringify(savedQueries)
    ) {
      return NextResponse.json({
        articles: cache.data,
        cachedAt: new Date(cache.timestamp).toISOString(),
        fromCache: true,
        queries: savedQueries,
      })
    }

    const articles = await buildFeed(savedQueries)
    cache = { data: articles, timestamp: now, queries: [...savedQueries] }

    return NextResponse.json({
      articles,
      cachedAt: new Date(now).toISOString(),
      fromCache: false,
      queries: savedQueries,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Okänt fel'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST — uppdatera sökord och töm cache
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const queries: string[] = body.queries

    if (!Array.isArray(queries) || queries.length === 0) {
      return NextResponse.json(
        { error: 'Skicka en array med minst ett sökord' },
        { status: 400 }
      )
    }

    const cleaned = queries
      .map((q: string) => q.trim())
      .filter((q: string) => q.length > 0)
      .slice(0, 5) // max 5 queries

    savedQueries = cleaned
    cache = null // töm cache så nästa GET hämtar färskt

    return NextResponse.json({ ok: true, queries: savedQueries })
  } catch {
    return NextResponse.json({ error: 'Ogiltigt JSON' }, { status: 400 })
  }
}