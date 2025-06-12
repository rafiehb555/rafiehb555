import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '../../../../lib/api/shopify';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
