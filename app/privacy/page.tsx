export const metadata = { title: 'Privacy Policy — Idea Agent', description: 'How Idea Agent handles your data.' }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#d8b4fe', marginBottom: 12 }}>{title}</h2>
    <div style={{ color: '#d1d5db', lineHeight: 1.7, fontSize: 15 }}>{children}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px', background: '#12051e', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f9fafb', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#6b7280', marginBottom: 48, fontSize: 14 }}>Last updated: June 2025</p>
      <Section title="Data We Collect"><p>We collect idea prompts and topic descriptions you submit. We do not store these beyond the active generation session.</p></Section>
      <Section title="How We Use Data"><p>Prompts are sent to AI providers to generate ideas. We never use your inputs for advertising or model training.</p></Section>
      <Section title="Cookies"><p>We use minimal session cookies for functionality. No advertising or tracking cookies are used.</p></Section>
      <Section title="Third-Party Services"><p>AI generation uses Groq and/or OpenAI APIs. Prompts are subject to their privacy policies during processing.</p></Section>
      <Section title="Data Retention"><p>Idea prompts and outputs are not retained after your session. Nothing is stored server-side.</p></Section>
      <Section title="Your Rights"><p>Email privacy@ideaagent.app to request deletion of any data we hold about you.</p></Section>
      <Section title="Children&apos;s Privacy"><p>This service is not directed at children under 13. We do not knowingly collect data from minors.</p></Section>
      <Section title="Contact"><p>Questions? Email <a href="mailto:privacy@ideaagent.app" style={{ color: '#8b5cf6' }}>privacy@ideaagent.app</a></p></Section>
    </main>
  )
}
