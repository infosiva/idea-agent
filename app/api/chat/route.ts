import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json()
    const sysPrompt = system ?? 'You are IdeaAgent — a creative brainstorming AI. Help users generate ideas, validate concepts, think through business models, and develop creative projects. Be imaginative and concise.'
    const text = await callAI(messages, sysPrompt, 500)
    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ text: 'Start brainstorming your idea above!' }, { status: 200 })
  }
}
