import { NextRequest, NextResponse } from 'next/server'
import { scanTrend, SEED_TRENDS } from '@/lib/trendScanner'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { trend, context } = await req.json()
    const t = trend?.trim() || SEED_TRENDS[Math.floor(Math.random() * SEED_TRENDS.length)]
    const report = await scanTrend(t, context)
    return NextResponse.json(report)
  } catch (e: unknown) {
    console.error('[ideas]', e)
    return NextResponse.json({ error: 'Scan failed: ' + (e as Error).message }, { status: 500 })
  }
}

export async function GET() {
  // Return a random seed trend scan
  const trend = SEED_TRENDS[Math.floor(Math.random() * SEED_TRENDS.length)]
  try {
    const report = await scanTrend(trend)
    return NextResponse.json(report)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
