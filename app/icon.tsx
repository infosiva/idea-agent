import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export default function Icon() {
  return new ImageResponse(
    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #4c1d95, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18h6M10 21h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 3a6 6 0 00-3 11.2V16h6v-1.8A6 6 0 0012 3z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="white" fillOpacity="0.15"/>
      </svg>
    </div>
  )
}
