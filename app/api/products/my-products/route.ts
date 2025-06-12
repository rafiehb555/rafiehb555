import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get user's shop
    const shop = await db.collection('shops').findOne({
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Get products for the shop
    const products = await db
      .collection('products')
      .find({ shopId: shop._id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching user products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
