import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Order } from '@/lib/models/Product';
import { checkModuleEligibility } from '@/lib/utils/walletEligibility';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const shopOwner = searchParams.get('shopOwner') === 'true';
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const client = await clientPromise;
    const db = client.db();

    // Build query
    const query: any = {};

    if (shopOwner) {
      // Get user's shop
      const shop = await db.collection('shops').findOne({
        ownerId: session.user.id,
      });

      if (!shop) {
        return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
      }

      // Get products from the shop
      const products = await db
        .collection('products')
        .find({ shopId: shop._id })
        .project({ _id: 1 })
        .toArray();

      const productIds = products.map(p => p._id);
      query['items.productId'] = { $in: productIds };
    } else {
      // Regular user query
      query.userId = session.user.id;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Get total count for pagination
    const total = await db.collection('orders').countDocuments(query);

    // Get orders with pagination
    const orders = await db
      .collection('orders')
      .aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $addFields: {
            items: {
              $map: {
                input: '$items',
                as: 'item',
                in: {
                  $mergeObjects: [
                    '$$item',
                    {
                      product: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$productDetails',
                              as: 'product',
                              cond: { $eq: ['$$product._id', '$$item.productId'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            productDetails: 0,
          },
        },
      ])
      .toArray();

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
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
    const { items, shippingAddress, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Calculate total and validate products
    let total = 0;
    for (const item of items) {
      const product = await db.collection('products').findOne({ _id: new ObjectId(item._id) });
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item._id}` }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product.name}` },
          { status: 400 }
        );
      }
      total += product.price * item.quantity;
    }

    // Create order
    const order: Order = {
      _id: new ObjectId().toString(),
      userId: session.user.id,
      shopId: items[0].shopId, // Assuming all items are from the same shop
      items: items.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      status: 'pending',
      shippingAddress,
      paymentStatus: 'pending',
      paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert order
    await db.collection('orders').insertOne(order);

    // Update product stock
    for (const item of items) {
      await db
        .collection('products')
        .updateOne({ _id: new ObjectId(item._id) }, { $inc: { stock: -item.quantity } });
    }

    return NextResponse.json({
      message: 'Order created successfully',
      orderId: order._id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
