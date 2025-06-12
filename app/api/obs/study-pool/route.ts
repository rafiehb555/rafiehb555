import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement database query to fetch study resources
    // This is a mock response for now
    const mockResources = [
      {
        id: '1',
        title: 'SQL Practice Exercises',
        type: 'exercises',
        provider: 'SQL Academy',
        sqlLevel: 'beginner',
        downloadUrl: '/resources/sql-exercises.pdf',
        tags: ['SQL', 'Practice', 'Beginner'],
      },
      {
        id: '2',
        title: 'Database Design Guide',
        type: 'guides',
        provider: 'Tech University',
        sqlLevel: 'intermediate',
        downloadUrl: '/resources/db-design-guide.pdf',
        tags: ['Database', 'Design', 'Intermediate'],
      },
      // Add more mock resources as needed
    ];

    return NextResponse.json(mockResources);
  } catch (error) {
    console.error('Error fetching study resources:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
