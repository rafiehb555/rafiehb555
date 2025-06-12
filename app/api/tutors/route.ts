import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Tutor } from '@/lib/models/Tutor';
import { Course } from '@/lib/models/Course';
import { Wallet } from '@/lib/models/Wallet';

// GET /api/tutors - Get all verified tutors (SQL level 3+)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const tutors = await db
      .collection('tutors')
      .find({ sqlLevel: { $gte: 3 } })
      .sort({ sqlLevel: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json({ tutors });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json({ error: 'Failed to fetch tutors' }, { status: 500 });
  }
}

// POST /api/tutors - Create a new tutor profile
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, subjects, experience, education, bio } = body;

    const client = await clientPromise;
    const db = client.db();

    // Check if user already has a tutor profile
    const existingTutor = await db.collection('tutors').findOne({ userId: session.user.id });
    if (existingTutor) {
      return NextResponse.json({ error: 'Tutor profile already exists' }, { status: 400 });
    }

    // Check user's SQL level from wallet
    const wallet = await db.collection('wallets').findOne({ userId: session.user.id });
    if (!wallet || wallet.sqlLevel < 3) {
      return NextResponse.json(
        { error: 'SQL level 3 or higher required to become a tutor' },
        { status: 403 }
      );
    }

    // Create tutor profile
    const tutor = {
      _id: new ObjectId(),
      userId: session.user.id,
      name,
      email,
      subjects,
      experience,
      education,
      bio,
      sqlLevel: wallet.sqlLevel,
      rating: 0,
      totalStudents: 0,
      totalCourses: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('tutors').insertOne(tutor);

    return NextResponse.json({ tutor });
  } catch (error) {
    console.error('Error creating tutor:', error);
    return NextResponse.json({ error: 'Failed to create tutor profile' }, { status: 500 });
  }
}

// PATCH /api/tutors - Update tutor profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, subjects, experience, education, bio } = body;

    const client = await clientPromise;
    const db = client.db();

    // Check if tutor exists and belongs to user
    const tutor = await db.collection('tutors').findOne({ userId: session.user.id });
    if (!tutor) {
      return NextResponse.json({ error: 'Tutor profile not found' }, { status: 404 });
    }

    // Update tutor profile
    const updatedTutor = await db.collection('tutors').findOneAndUpdate(
      { _id: tutor._id },
      {
        $set: {
          name,
          subjects,
          experience,
          education,
          bio,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ tutor: updatedTutor });
  } catch (error) {
    console.error('Error updating tutor:', error);
    return NextResponse.json({ error: 'Failed to update tutor profile' }, { status: 500 });
  }
}

// DELETE /api/tutors - Delete tutor profile
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if tutor exists and belongs to user
    const tutor = await db.collection('tutors').findOne({ userId: session.user.id });
    if (!tutor) {
      return NextResponse.json({ error: 'Tutor profile not found' }, { status: 404 });
    }

    // Check if tutor has any active courses
    const activeCourses = await db
      .collection('courses')
      .find({
        tutorId: tutor._id,
        status: 'active',
      })
      .toArray();

    if (activeCourses.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete profile with active courses' },
        { status: 400 }
      );
    }

    await db.collection('tutors').deleteOne({ _id: tutor._id });
    return NextResponse.json({ message: 'Tutor profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutor:', error);
    return NextResponse.json({ error: 'Failed to delete tutor profile' }, { status: 500 });
  }
}
