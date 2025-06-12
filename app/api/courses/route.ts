import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Course } from '@/lib/models/Course';

// GET /api/courses?subject=xxx&city=yyy&mode=zzz&maxFee=1000
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const city = searchParams.get('city');
    const mode = searchParams.get('mode');
    const maxFee = searchParams.get('maxFee');

    const client = await clientPromise;
    const db = client.db();

    // Build query
    const query: any = {};
    if (subject) query.subject = subject;
    if (city) query.city = city;
    if (mode) query.mode = mode;
    if (maxFee) query.price = { $lte: parseInt(maxFee) };

    const courses = await db.collection('courses').find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST /api/courses
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, subject, price, schedule, city, mode } = body;

    if (!title || !description || !subject || !price || !schedule || !city || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user is a verified tutor
    const tutor = await db.collection('tutors').findOne({ userId: session.user.id });

    if (!tutor || tutor.sqlLevel < 3) {
      return NextResponse.json(
        { error: 'Only verified tutors (SQL level 3+) can create courses' },
        { status: 403 }
      );
    }

    // Create course
    const course: Course = {
      _id: new ObjectId(),
      tutorId: tutor._id,
      title,
      description,
      subject,
      price,
      schedule,
      city,
      mode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('courses').insertOne(course);

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

// PATCH /api/courses/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, subject, price, schedule, city, mode } = body;

    const client = await clientPromise;
    const db = client.db();

    // Check if course exists and belongs to user
    const tutor = await db.collection('tutors').findOne({ userId: session.user.id });

    if (!tutor) {
      return NextResponse.json({ error: 'Tutor profile not found' }, { status: 404 });
    }

    const course = await db.collection('courses').findOne({
      _id: new ObjectId(params.id),
      tutorId: tutor._id,
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Update course
    const updatedCourse = await db.collection('courses').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(subject && { subject }),
          ...(price && { price }),
          ...(schedule && { schedule }),
          ...(city && { city }),
          ...(mode && { mode }),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

// DELETE /api/courses/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if course exists and belongs to user
    const tutor = await db.collection('tutors').findOne({ userId: session.user.id });

    if (!tutor) {
      return NextResponse.json({ error: 'Tutor profile not found' }, { status: 404 });
    }

    const course = await db.collection('courses').findOne({
      _id: new ObjectId(params.id),
      tutorId: tutor._id,
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course has any active enrollments
    const activeEnrollments = await db.collection('enrollments').findOne({
      courseId: new ObjectId(params.id),
      status: 'active',
    });

    if (activeEnrollments) {
      return NextResponse.json(
        { error: 'Cannot delete course with active enrollments' },
        { status: 400 }
      );
    }

    // Delete course
    await db.collection('courses').deleteOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
