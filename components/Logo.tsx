// Brand logo: mark + wordmark. Used in navbar/header; same mark as app/icon.svg.
export function Logo({ size = 28, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="IdeaAgent">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="var(--accent, #14b8a6)" />
        <path d="M24 46h16M26 52h12M32 12a14 14 0 0 0-7 26v4h14v-4a14 14 0 0 0-7-26z" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      {showText && (
        <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          Idea<span style={{ color: "var(--accent, #14b8a6)" }}>Agent</span>
        </span>
      )}
    </span>
  );
}
export default Logo;
