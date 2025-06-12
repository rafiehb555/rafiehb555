import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement database query to fetch certificates
    // This is a mock response for now
    const mockCertificates = [
      {
        id: '1',
        title: 'SQL Basics Certification',
        subject: 'SQL Basics',
        date: '2024-03-15',
        score: 85,
        status: 'passed',
        certificateUrl: '/certificates/sql-basics.pdf',
      },
      {
        id: '2',
        title: 'Advanced SQL Exam',
        subject: 'Advanced SQL',
        date: '2024-03-20',
        score: 65,
        status: 'failed',
      },
      {
        id: '3',
        title: 'Database Design Assessment',
        subject: 'Database Design',
        date: '2024-03-25',
        status: 'in-progress',
      },
      // Add more mock certificates as needed
    ];

    return NextResponse.json(mockCertificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
