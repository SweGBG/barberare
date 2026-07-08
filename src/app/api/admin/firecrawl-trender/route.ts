import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { url, query, mode, action, bust, sources } = body

  // Cache bust / sources update — ignoreras här, hanteras i GET
  if (bust || sources) {
    return NextResponse.json({ ok: true })
  }

  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'FIRECRAWL_API_KEY saknas' }, { status: 500 })

  const extractPrompt = mode === 'priser'
    ? 'Extract all product names and prices. Return JSON: {summary, products: [{name, price, currency}], trends: [], keyFacts: []}'
    : mode === 'trender'
    ? 'Extract hair and barbershop trends, style names, popular techniques. Return JSON: {summary, trends: ["fade","taper",...], products: [], keyFacts: []}'
    : mode === 'seo'
    ? 'Extract SEO data. Return JSON: {title, description, h1s: [], h2s: [], keywords: [], summary, trends: [], products: [], keyFacts: []}'
    : 'Extract main content, products, prices, trends, key facts. Return JSON: {summary, products: [{name, price}], trends: [], keyFacts: []}'

  // ── SEARCH ──
  if (action === 'search') {
    if (!query) return NextResponse.json({ error: 'Ingen sökfråga' }, { status: 400 })
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          limit: 8,
          lang: 'en',
          scrapeOptions: {
            formats: ['extract'],
            extract: { prompt: extractPrompt },
          },
        }),
      })
      const data = await res.json()
      const results = (data?.data || []).map((item: {
        title?: string; metadata?: { title?: string; description?: string };
        url?: string; description?: string; extract?: {
          summary?: string; products?: Product[]; trends?: string[]; keyFacts?: string[]
        }
      }) => ({
        title: item.title || item.metadata?.title || 'Okänd sida',
        url: item.url || '',
        description: item.description || item.metadata?.description || '',
        summary: item.extract?.summary || null,
        products: item.extract?.products || [],
        trends: item.extract?.trends || [],
        keyFacts: item.extract?.keyFacts || [],
      }))
      return NextResponse.json({
        action: 'search', query, results,
        resultCount: results.length,
        searchedAt: new Date().toISOString(),
      })
    } catch {
      return NextResponse.json({ error: 'Sökning misslyckades' }, { status: 500 })
    }
  }

  // ── SCRAPE ──
  if (!url) return NextResponse.json({ error: 'Ingen URL angiven' }, { status: 400 })
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        formats: ['extract'],
        extract: { prompt: extractPrompt },
      }),
    })
    const data = await res.json()
    const ext = data?.data?.extract || {}
    return NextResponse.json({
      action: 'scrape',
      url,
      summary: ext.summary || null,
      products: ext.products || [],
      trends: ext.trends || [],
      keyFacts: ext.keyFacts || [],
      title: ext.title || null,
      description: ext.description || null,
      h1s: ext.h1s || [],
      scrapedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Scrape misslyckades' }, { status: 500 })
  }
}

interface Product { name: string; price: string; currency?: string }

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Använd POST för scraping' })
}
