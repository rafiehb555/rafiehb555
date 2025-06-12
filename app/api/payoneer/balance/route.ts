import { NextRequest, NextResponse } from 'next/server';
import { getAccountBalance } from '../../../../lib/api/payoneer';

export async function GET() {
  try {
    const balance = await getAccountBalance();
    return NextResponse.json({ balance });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
