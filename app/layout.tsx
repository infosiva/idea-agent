import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import SharedFooter from '@/components/SharedFooter'
import DesignEffects from '@/components/DesignEffects'
import type { BrandConfig } from '@/components/SharedNavbar'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'

const brand: BrandConfig = {
  name: 'IdeaAgent',
  tagline: 'AI scans market trends and surfaces profitable SaaS ideas for solo builders.',
  icon: '💡',
  color: '#8b5cf6',
  url: 'https://idea-agent.vercel.app',
  navLinks: [{ label: 'Scan trends', href: '/' }],
  cta: { label: 'Get ideas →', href: '/' },
}

export const metadata: Metadata = {
  title: 'IdeaAgent — AI-powered SaaS idea generator',
  description: 'AI agent scans real market trends and surfaces actionable, monetizable SaaS business ideas for solo developers and indie hackers.',
  keywords: ['SaaS ideas', 'startup ideas', 'AI business ideas', 'indie hacker', 'market trends'],
  metadataBase: new URL('https://idea-agent.vercel.app'),
  openGraph: { title: 'IdeaAgent — AI SaaS idea generator', description: 'AI scans trends and surfaces profitable startup ideas.', type: 'website', locale: 'en_GB', siteName: 'IdeaAgent' },
  twitter: { card: 'summary_large_image', title: 'IdeaAgent', description: 'AI-powered SaaS idea generator.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebApplication", "name": "IdeaAgent", "url": brand.url, "description": brand.tagline, "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" } },
            { "@type": "WebSite", "name": "IdeaAgent", "url": brand.url }
          ]
        })}} />
      </head>
      <body className="flex flex-col min-h-screen">
        <DesignEffects />
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <SharedFooter brand={brand} />
        <FloatingChatWrapper />
        <Script defer data-site="idea-agent.vercel.app" src="http://31.97.56.148:3098/t.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
