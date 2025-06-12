import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { checkModuleEligibility } from '@/lib/utils/walletEligibility';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get('shopId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const client = await clientPromise;
    const db = client.db();

    // Build query
    const query: any = {};
    if (shopId) query.shopId = new ObjectId(shopId);
    if (category) query.categoryId = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await db.collection('products').countDocuments(query);

    // Get products with pagination
    const products = await db
      .collection('products')
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has a shop
    const client = await clientPromise;
    const db = client.db();

    const shop = await db.collection('shops').findOne({
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json({ error: 'You need to create a shop first' }, { status: 400 });
    }

    // Check wallet eligibility
    const eligibility = await checkModuleEligibility(session.user.id, 'gosellr');
    if (!eligibility.isEligible) {
      return NextResponse.json({ error: eligibility.message }, { status: 403 });
    }

    const data = await req.json();
    const { name, description, price, imageUrl, stock, category } = data;

    // Validate required fields
    if (!name || !description || !price || !stock || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create product
    const product = {
      name,
      description,
      price: parseFloat(price),
      images: [imageUrl],
      stock: parseInt(stock),
      categoryId: category,
      shopId: shop._id,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('products').insertOne(product);

    return NextResponse.json({
      message: 'Product created successfully',
      product: {
        ...product,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
