import { NextResponse } from 'next/server';
import { detectIntent } from '@/lib/ai/intentRouter';
import { buildPrompt } from '@/lib/ai/promptBuilder';
import { getServiceMap } from '@/lib/ai/serviceMap';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, language } = await req.json();

    // Get user's wallet and SQL level
    const user = session.user;
    const wallet = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet/${user.id}`).then(
      res => res.json()
    );
    const sqlLevel = user.sqlLevel || 0;

    // Detect intent and extract parameters
    const intent = await detectIntent(message, language);
    const serviceMap = await getServiceMap(intent);

    // Build GPT prompt with context
    const prompt = await buildPrompt({
      message,
      intent,
      serviceMap,
      user: {
        id: user.id,
        sqlLevel,
        wallet: {
          balance: wallet.balance,
          lockedCoins: wallet.lockedCoins,
        },
      },
    });

    // Get GPT response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const gptResponse = await response.json();

    // Build final response with routing information
    const finalResponse = {
      message: gptResponse.choices[0].message.content,
      intent: intent.type,
      service: intent.service,
      filters: serviceMap.filters,
      route: serviceMap.route,
      actions: serviceMap.actions,
      discounts: serviceMap.discounts,
    };

    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error('AI Router Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
