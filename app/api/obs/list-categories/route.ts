import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement database query to fetch books
    // This is a mock response for now
    const mockBooks = [
      {
        id: '1',
        title: 'Introduction to SQL',
        category: 'SQL Basics',
        author: 'John Doe',
        price: 0,
        coverUrl: '/images/books/sql-intro.jpg',
      },
      {
        id: '2',
        title: 'Advanced Database Design',
        category: 'Database Design',
        author: 'Jane Smith',
        price: 29.99,
        coverUrl: '/images/books/db-design.jpg',
      },
      // Add more mock books as needed
    ];

    return NextResponse.json(mockBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
