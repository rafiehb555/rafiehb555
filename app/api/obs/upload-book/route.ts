import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') as string;
    const file = formData.get('file') as File;

    if (!title || !category || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Implement file upload to storage (e.g., AWS S3)
    // TODO: Save book metadata to database

    return NextResponse.json({
      message: 'Book uploaded successfully',
      data: {
        title,
        category,
        price: price || '0',
        fileName: file.name,
      },
    });
  } catch (error) {
    console.error('Error uploading book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
