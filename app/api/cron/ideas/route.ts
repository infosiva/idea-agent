/**
 * GET /api/cron/ideas
 * Vercel Cron — runs daily at 08:00 UTC
 * Scans 3 random trends and pushes the top ideas to Telegram.
 */
import { NextRequest, NextResponse } from 'next/server'
import { scanTrend, SEED_TRENDS } from '@/lib/trendScanner'

export const maxDuration = 120

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID

async function sendTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:    TELEGRAM_CHAT_ID,
      text:       message,
      parse_mode: 'Markdown',
    }),
  })
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function GET(req: NextRequest) {
  // Vercel cron sends Authorization: Bearer CRON_SECRET
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trends = shuffle(SEED_TRENDS).slice(0, 3)
  const date   = new Date().toISOString().slice(0, 10)
  const results: string[] = []

  for (const trend of trends) {
    try {
      const report = await scanTrend(trend)
      // Top idea per trend
      const top = report.ideas.sort((a, b) => b.score - a.score)[0]
      if (!top) continue

      results.push(
        `🔥 *${trend}*\n` +
        `💡 *${top.title}*\n` +
        `Problem: ${top.problem.slice(0, 120)}…\n` +
        `Monetization: ${top.monetization.slice(0, 100)}\n` +
        `Effort: ${top.effort} · Revenue in: ${top.timeToRevenue}\n` +
        `Score: ${'⭐'.repeat(Math.min(10, top.score))} ${top.score}/10`
      )
    } catch (e: any) {
      console.error(`[cron/ideas] Failed for trend "${trend}":`, e.message)
    }
  }

  const message = results.length > 0
    ? `🤖 *Daily Business Ideas — ${date}*\n\n${results.join('\n\n---\n\n')}\n\nhttps://idea-agent.vercel.app`
    : `🤖 *Daily Ideas — ${date}*\nNo ideas generated today. Check AI keys.`

  await sendTelegram(message)

  return NextResponse.json({
    ok:     true,
    date,
    trends,
    sent:   results.length,
  })
}
