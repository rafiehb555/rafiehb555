import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '../../../lib/api/openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    const text = await generateText(prompt);
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
