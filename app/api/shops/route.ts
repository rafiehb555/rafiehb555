import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Shop } from '@/lib/models/Product';
import { checkModuleEligibility } from '@/lib/utils/walletEligibility';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const search = searchParams.get('search');

    const client = await clientPromise;
    const db = client.db();

    // Build query
    const query: any = { status: 'active' };

    if (category) {
      query.category = category;
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Get shops with pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      db.collection('shops').find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection('shops').countDocuments(query),
    ]);

    return NextResponse.json({
      shops,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check wallet eligibility
    const eligibility = await checkModuleEligibility(session.user.id, 'gosellr');
    if (!eligibility.isEligible) {
      return NextResponse.json({ error: eligibility.message }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, city, category, contact } = body;

    if (!name || !description || !city || !category || !contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user already has a shop
    const existingShop = await db.collection('shops').findOne({
      ownerId: session.user.id,
    });

    if (existingShop) {
      return NextResponse.json({ error: 'You already have a shop' }, { status: 400 });
    }

    // Create shop
    const shop: Shop = {
      _id: new ObjectId().toString(),
      name,
      description,
      ownerId: session.user.id,
      city,
      category,
      contact,
      status: 'active',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert shop
    await db.collection('shops').insertOne(shop);

    return NextResponse.json({
      message: 'Shop created successfully',
      shop,
    });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json({ error: 'Failed to create shop' }, { status: 500 });
  }
}
