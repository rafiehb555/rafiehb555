import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const product = await db.collection('products').findOne({
      _id: new ObjectId(params.productId),
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if product exists and user owns it
    const product = await db.collection('products').findOne({
      _id: new ObjectId(params.productId),
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const shop = await db.collection('shops').findOne({
      _id: product.shopId,
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json({ error: 'Unauthorized to edit this product' }, { status: 403 });
    }

    const data = await req.json();
    const { name, description, price, imageUrl, stock, category } = data;

    // Validate required fields
    if (!name || !description || !price || !stock || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update product
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      images: [imageUrl],
      stock: parseInt(stock),
      categoryId: category,
      updatedAt: new Date(),
    };

    await db
      .collection('products')
      .updateOne({ _id: new ObjectId(params.productId) }, { $set: updateData });

    return NextResponse.json({
      message: 'Product updated successfully',
      product: {
        ...product,
        ...updateData,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if product exists and user owns it
    const product = await db.collection('products').findOne({
      _id: new ObjectId(params.productId),
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const shop = await db.collection('shops').findOne({
      _id: product.shopId,
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json({ error: 'Unauthorized to delete this product' }, { status: 403 });
    }

    await db.collection('products').deleteOne({
      _id: new ObjectId(params.productId),
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
