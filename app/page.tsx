'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { BusinessIdea, TrendReport } from '@/lib/trendScanner'

const SEED_TRENDS = [
  'AI agents and autonomous workflows',
  'Local LLMs and privacy-first AI',
  'Creator economy monetization tools',
  'No-code/low-code automation',
  'B2B micro-SaaS for niche industries',
  'AI-powered developer tools',
  'Short-form video tools',
  'Remote work productivity',
]

const EFFORT_COLOR: Record<string, string> = {
  easy:   'text-green-400 bg-green-900/30 border-green-800',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  hard:   'text-red-400 bg-red-900/30 border-red-800',
}

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 10) * 100
  const color = score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold tabular-nums">{score}/10</span>
    </div>
  )
}

function IdeaCard({ idea }: { idea: BusinessIdea }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-gray-900/60 border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all card-hover card-tilt backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg leading-tight">{idea.title}</h3>
        <span className={`shrink-0 text-xs px-2 py-1 rounded-full border font-medium ${EFFORT_COLOR[idea.effort]}`}>
          {idea.effort}
        </span>
      </div>

      <ScoreBar score={idea.score} />

      <p className="text-sm text-gray-300 leading-relaxed">{idea.problem}</p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-800 rounded-lg p-2">
          <p className="text-gray-500 mb-0.5">💰 Monetization</p>
          <p className="text-gray-300">{idea.monetization}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <p className="text-gray-500 mb-0.5">⏱ Time to $</p>
          <p className="text-gray-300">{idea.timeToRevenue}</p>
        </div>
      </div>

      <button
        onClick={() => setExpanded(e => !e)}
        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
      >
        {expanded ? 'Less ↑' : 'More details ↓'}
      </button>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-gray-800">
          <div>
            <p className="text-xs text-gray-500 mb-1">What to build</p>
            <p className="text-sm text-gray-300">{idea.solution}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Market signal</p>
            <p className="text-sm text-yellow-300/80">{idea.marketSignal}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Tech stack</p>
            <div className="flex flex-wrap gap-1.5">
              {idea.techStack.map(t => (
                <span key={t} className="text-xs bg-blue-900/30 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [trend, setTrend]     = useState('')
  const [report, setReport]   = useState<TrendReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function scan(customTrend?: string) {
    const t = customTrend ?? trend.trim()
    setLoading(true); setError(''); setReport(null)
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trend: t }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scan failed')
      setReport(data)
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-x-hidden">
      <div className="noise-overlay" aria-hidden="true" />

      <div className="liquid-blob liquid-blob-1" style={{ top: '-180px', left: '-120px', width: '500px', height: '500px', background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} aria-hidden="true" />
      <div className="liquid-blob liquid-blob-2" style={{ top: '120px', right: '-140px', width: '420px', height: '420px', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} aria-hidden="true" />
      <div className="liquid-blob liquid-blob-3" style={{ bottom: '10%', left: '30%', width: '360px', height: '360px', background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} aria-hidden="true" />

      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10" style={{ height: '52px' }}>
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-base tracking-tight">IdeaAgent</span>
          <span className="pill-glass text-xs ml-1">AI Market Intel</span>
        </div>
        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</a>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 pt-6 pb-12">
        <div className="w-full max-w-2xl text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            Spot the next{' '}
            <span className="text-iridescent">big thing</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto">
            Type a trend. AI scans the market. Get 6 buildable SaaS ideas in seconds.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-4">
          <div className="glass-liquid rounded-2xl p-2 flex items-center gap-2">
            <input
              value={trend}
              onChange={e => setTrend(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && scan()}
              placeholder="What trend are you curious about?"
              className="flex-1 bg-transparent px-4 py-3 text-sm md:text-base focus:outline-none placeholder-gray-500"
            />
            <button
              onClick={() => scan()}
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              className="shrink-0 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 whitespace-nowrap flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Scanning...' : 'Scan'}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SEED_TRENDS.map(t => (
              <button
                key={t}
                onClick={() => { setTrend(t); scan(t) }}
                disabled={loading}
                className="pill-glass shrink-0 text-xs disabled:opacity-40 transition-all hover:scale-105"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 flex justify-center gap-3 flex-wrap px-4 pb-16 -mt-6">
        {['🎯 Validated ideas', '💰 Monetization paths', '⚡ Time to revenue', '🔍 Market signals'].map(label => (
          <span key={label} className="pill-glass text-sm">{label}</span>
        ))}
      </section>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-20 space-y-3">
            <div className="text-4xl animate-pulse">🤖</div>
            <p className="text-gray-400 text-sm">Scanning market signals...</p>
          </div>
        )}

        {report && (
          <div className="space-y-6">
            <div className="glass-liquid rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-indigo-300">📡 Trend: {report.trend}</h2>
                <span className="text-xs text-gray-500">{report.date}</span>
              </div>
              <p className="text-sm text-gray-300 mb-3"><span className="text-yellow-400">⚡ Why now: </span>{report.whyNow}</p>
              {report.redFlags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {report.redFlags.map(f => (
                    <span key={f} className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 px-2 py-1 rounded-full">
                      ⚠ {f}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {report.ideas?.length} Opportunities Found
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {report.ideas?.sort((a, b) => b.score - a.score).map((idea, i) => (
                  <div key={i} className="reveal-3d">
                    <IdeaCard idea={idea} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => scan(report.trend)}
              disabled={loading}
              className="w-full border border-gray-700 hover:border-indigo-500 text-gray-400 hover:text-white py-3 rounded-xl text-sm transition-colors disabled:opacity-40"
            >
              🔄 Re-scan same trend for fresh ideas
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
