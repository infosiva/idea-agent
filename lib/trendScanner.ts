import { callAI } from './ai'

export interface BusinessIdea {
  title: string
  problem: string
  solution: string
  monetization: string
  effort: 'easy' | 'medium' | 'hard'
  timeToRevenue: string
  techStack: string[]
  marketSignal: string
  score: number  // 1-10 opportunity score
}

export interface TrendReport {
  date: string
  trend: string
  ideas: BusinessIdea[]
  whyNow: string
  redFlags: string[]
}

const SYSTEM = `You are a sharp business strategist and trend analyst.
Your job: scan current market trends and surface SPECIFIC, ACTIONABLE SaaS/app ideas that:
1. Have REAL demand signals (search trends, Reddit threads, Twitter complaints, App Store gaps)
2. Can be built by a solo developer in <4 weeks
3. Have clear monetization from day 1
4. Are NOT already saturated (avoid: todo apps, another ChatGPT wrapper, generic AI chat)

Be brutally honest about effort and revenue potential. No hype.
Always respond with valid JSON only.`

export async function scanTrend(trend: string, context?: string): Promise<TrendReport> {
  const prompt = `Current trend to analyze: "${trend}"
${context ? `Additional context: ${context}` : ''}
Today: ${new Date().toISOString().slice(0, 10)}

Find 3-4 specific business opportunities in this trend space that a solo dev can build and monetize quickly.

Respond with JSON:
{
  "trend": "${trend}",
  "date": "${new Date().toISOString().slice(0, 10)}",
  "whyNow": "why this trend is actionable RIGHT NOW (timing signal)",
  "redFlags": ["risk1", "risk2"],
  "ideas": [
    {
      "title": "product name",
      "problem": "exact pain point being solved (be specific)",
      "solution": "what you build (be concrete)",
      "monetization": "exact revenue model + realistic monthly revenue at 100 users",
      "effort": "easy|medium|hard",
      "timeToRevenue": "e.g. 2 weeks to first dollar",
      "techStack": ["Next.js", "Groq API", "..."],
      "marketSignal": "evidence this is real demand (Reddit thread, App Store gap, Google Trends, etc)",
      "score": 8
    }
  ]
}`

  const { text } = await callAI(SYSTEM, [{ role: 'user', content: prompt }], 2048, 'best')
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()
  return JSON.parse(clean)
}

// Pre-seeded trends to scan on first load
export const SEED_TRENDS = [
  'AI agents and autonomous workflows',
  'Local LLMs and privacy-first AI',
  'Creator economy monetization tools',
  'No-code/low-code automation',
  'B2B micro-SaaS for niche industries',
  'AI-powered developer tools',
  'Short-form video tools',
  'Remote work productivity',
]
