# Idea Agent v2 — Weekly AI Product Scout & Marketplace

**Date:** 2026-05-11  
**Status:** Approved  
**Scope:** idea-agent Next.js app (Vercel)

---

## 1. Problem

Current idea-agent scans abstract market trends and posts random SaaS ideas to Telegram daily. It has no awareness of the products Siva has actually built, no competitor validation, and no public discovery surface. The goal is to flip this: scan your real projects, validate uniqueness, promote the best two weekly to communities where builders gather, and expose a public "What I Shipped" page anyone can find.

---

## 2. Goal

Every Monday at 08:00 UTC:
1. Scan all `infosiva/*` GitHub repos → score each project
2. Pick top 2 by score → validate no saturated competition via web search
3. At 09:00 UTC: post both picks to Reddit + Twitter/X + Telegram
4. Update public `/shipped` page on the idea-agent site

---

## 3. Architecture

### Two-phase cron (Option B)

**Phase 1 — Scout** (`/api/cron/scout`, Mon 08:00 UTC, maxDuration=120):
```
GitHub API (infosiva/*) → projectScanner
  → projectScorer (scores each 0–100)
  → competitorCheck (Brave Search, top 2 only)
  → Vercel KV: set("scout:latest", { projects[], topPicks[], validatedAt })
```

**Phase 2 — Publish** (`/api/cron/publish`, Mon 09:00 UTC, maxDuration=60):
```
Vercel KV: get("scout:latest")
  → publisher → Telegram (existing bot)
  → publisher → Reddit API (r/SideProject, r/entrepreneur)
  → publisher → Twitter API v2
  → KV: set("shipped:public", topPicks[]) ← feeds /shipped page
```

**Public page** (`/shipped`):
```
Page component → fetch KV "shipped:public" → render leaderboard
```

---

## 4. Project Scoring (0–100)

| Signal | Points | Method |
|--------|--------|--------|
| Custom domain (not .vercel.app) | +20 | parse homepage field in package.json / MEMORY.md domain list |
| Live URL returns 200 | +15 | HTTP HEAD with 5s timeout |
| AI-powered (uses callAI) | +10 | grep `callAI` in repo lib/ via GitHub API |
| Unique category (deduped) | +15 | AI assigns category tag, dedupe across projects |
| Monetization signal | +15 | README mentions pricing/stripe/subscription |
| Recent commit (< 30 days) | +10 | GitHub `pushed_at` field |
| Clear problem statement | +15 | AI judges README quality (1–3 score × 5) |

Top 2 scorers proceed to competitor validation. If top pick is SATURATED, use next scorer.

---

## 5. Competitor Validation

For each top-2 project:
1. Brave Search: `"{category} app" site:producthunt.com`
2. Brave Search: `"{product name} alternative"`
3. AI verdict from results:
   - `CLEAR_GAP` → publish as-is
   - `CROWDED` → publish with "differentiated by X" note
   - `SATURATED` → drop, use next scorer, re-validate

Brave Search API: free tier, 2,000 queries/month. Two searches × 2 projects = 4 queries/week.

---

## 6. Community Posting

### Telegram (existing)
Enhanced format showing both picks + validation verdict:
```
🚀 Weekly Shipped — 2026-05-11

#1 ProductName (Score: 87/100) ✅ CLEAR GAP
domain.app
Problem: ...
Built with: Next.js, Groq, ...
Gap: No direct competitor found on PH

#2 ProductName2 (Score: 74/100) ⚠ CROWDED
domain2.app
Differentiated by: ...
```

### Reddit (`r/SideProject`, `r/entrepreneur`)
```
Title: "Built [ProductName] — [one-line value prop] (feedback welcome)"
Body:
  Hey r/SideProject 👋

  I built [ProductName] — [2-sentence what it does and for whom].

  **Problem I solved:** [from README]
  **Live:** [domain]
  **Tech:** [stack]

  Would love honest feedback.
```
Rate: 1 subreddit per cron run. Alternates weekly: r/SideProject week 1, r/entrepreneur week 2.

### Twitter/X
```
Just shipped [ProductName] 🚀

[One-line value prop]

→ [domain]

#buildinpublic #saas #indiedev #ai
```

### Product Hunt
Automated draft only — PH API requires human submission approval. Cron generates full PH post text (tagline, description, first comment) → sends to Telegram so Siva can paste manually when ready.

---

## 7. Public `/shipped` Page

New tab on idea-agent site alongside existing Scan tab.

**UI:**
```
[Scan]  [Shipped ← new tab]

"What I Shipped"
Last updated: Mon May 11 2026

┌──────────────────────────────────────────┐
│ 🥇 ProductName              Score: 87   │
│ domain.app              [Visit →]        │
│ AI-powered [category]   LIVE ✓           │
│ "One-line what it does"                  │
│ Gap validated: no direct competitor      │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ 🥈 ProductName2             Score: 74   │
│ ...                                      │
└──────────────────────────────────────────┘
```

Data: `kv.get("shipped:public")` — static read, fast, no AI call on page load.
Fallback: if KV empty, show "Scout runs every Monday. Check back soon."

---

## 8. New Files

```
lib/projectScanner.ts     — GitHub API → repo list → metadata
lib/projectScorer.ts      — score each project 0–100
lib/competitorCheck.ts    — Brave Search → AI verdict
lib/publisher.ts          — format + send to Telegram/Reddit/Twitter
app/api/cron/scout/route.ts    — Phase 1 cron handler
app/api/cron/publish/route.ts  — Phase 2 cron handler
app/shipped/page.tsx           — public leaderboard page
```

Modify:
```
vercel.json               — add scout + publish crons (weekly), keep existing daily trend cron
app/page.tsx              — add Shipped tab
```

---

## 9. Environment Variables (new)

| Var | Source |
|-----|--------|
| `KV_REST_API_URL` | Vercel KV (free tier) |
| `KV_REST_API_TOKEN` | Vercel KV |
| `BRAVE_SEARCH_API_KEY` | api.search.brave.com (free 2k/mo) |
| `REDDIT_CLIENT_ID` | Reddit app (script type) |
| `REDDIT_CLIENT_SECRET` | Reddit app |
| `REDDIT_USERNAME` | Reddit account |
| `REDDIT_PASSWORD` | Reddit account |
| `TWITTER_BEARER_TOKEN` | Twitter API v2 |
| `TWITTER_API_KEY` | Twitter developer portal |
| `TWITTER_API_SECRET` | Twitter developer portal |
| `TWITTER_ACCESS_TOKEN` | Twitter developer portal |
| `TWITTER_ACCESS_SECRET` | Twitter developer portal |
| `GITHUB_TOKEN` | existing (infosiva) |

---

## 10. vercel.json Changes

```json
{
  "crons": [
    { "path": "/api/cron/ideas",   "schedule": "0 8 * * *" },
    { "path": "/api/cron/scout",   "schedule": "0 8 * * 1" },
    { "path": "/api/cron/publish", "schedule": "0 9 * * 1" }
  ]
}
```

Daily trend cron stays (existing feature). Scout + publish run Monday only.

---

## 11. Out of Scope

- Product Hunt API submission (manual draft only)
- LinkedIn posting (API requires company page approval)
- Email newsletter
- User accounts / auth on /shipped page
- Historical shipped archive (v3 feature)
