import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Enrollment } from '@/lib/models/Enrollment';
import { calculateLoyaltyDiscount } from '@/lib/utils/franchiseUtils';

// GET /api/enrollments
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const enrollments = await db
      .collection('enrollments')
      .find({ studentId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

// POST /api/enrollments
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if course exists
    const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if student is already enrolled
    const existingEnrollment = await db.collection('enrollments').findOne({
      studentId: session.user.id,
      courseId: new ObjectId(courseId),
      status: 'active',
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // Get student's wallet
    const wallet = await db.collection('wallets').findOne({ userId: session.user.id });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Calculate discounted price
    const discount = calculateLoyaltyDiscount(wallet);
    const discountedPrice = course.price * (1 - discount);

    // Check if student has enough balance
    if (wallet.balance < discountedPrice) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Start a session for transaction
    const session = await client.startSession();
    try {
      await session.withTransaction(async () => {
        // Create enrollment
        const enrollment: Enrollment = {
          _id: new ObjectId(),
          studentId: session.user.id,
          courseId: new ObjectId(courseId),
          status: 'active',
          completion: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection('enrollments').insertOne(enrollment, { session });

        // Deduct from student's wallet
        await db.collection('wallets').updateOne(
          { userId: session.user.id },
          {
            $inc: { balance: -discountedPrice },
            $push: {
              transactions: {
                type: 'course_payment',
                amount: -discountedPrice,
                description: `Payment for course: ${course.title}`,
                createdAt: new Date(),
              },
            },
          },
          { session }
        );

        // Add to tutor's wallet
        const tutor = await db.collection('tutors').findOne({ _id: course.tutorId });

        if (tutor) {
          await db.collection('wallets').updateOne(
            { userId: tutor.userId },
            {
              $inc: { balance: discountedPrice * 0.7 }, // 70% to tutor
              $push: {
                transactions: {
                  type: 'course_income',
                  amount: discountedPrice * 0.7,
                  description: `Income from course: ${course.title}`,
                  createdAt: new Date(),
                },
              },
            },
            { session }
          );
        }
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 });
  }
}

// PATCH /api/enrollments/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, completion, rating } = body;

    const client = await clientPromise;
    const db = client.db();

    // Check if enrollment exists and belongs to user
    const enrollment = await db.collection('enrollments').findOne({
      _id: new ObjectId(params.id),
      studentId: session.user.id,
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Update enrollment
    const updatedEnrollment = await db.collection('enrollments').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...(status && { status }),
          ...(completion && { completion }),
          ...(rating && { rating }),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    // If rating is provided, update course's average rating
    if (rating) {
      const course = await db.collection('courses').findOne({ _id: enrollment.courseId });

      if (course) {
        const enrollments = await db
          .collection('enrollments')
          .find({ courseId: enrollment.courseId, rating: { $exists: true } })
          .toArray();

        const averageRating =
          enrollments.reduce((sum, e) => sum + e.rating, 0) / enrollments.length;

        await db
          .collection('courses')
          .updateOne({ _id: enrollment.courseId }, { $set: { rating: averageRating } });
      }
    }

    return NextResponse.json({ enrollment: updatedEnrollment });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 });
  }
}

// DELETE /api/enrollments/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if enrollment exists and belongs to user
    const enrollment = await db.collection('enrollments').findOne({
      _id: new ObjectId(params.id),
      studentId: session.user.id,
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Check if enrollment is active
    if (enrollment.status !== 'active') {
      return NextResponse.json({ error: 'Can only cancel active enrollments' }, { status: 400 });
    }

    // Start a session for transaction
    const session = await client.startSession();
    try {
      await session.withTransaction(async () => {
        // Update enrollment status
        await db.collection('enrollments').updateOne(
          { _id: new ObjectId(params.id) },
          {
            $set: {
              status: 'cancelled',
              updatedAt: new Date(),
            },
          },
          { session }
        );

        // Get course details
        const course = await db.collection('courses').findOne({ _id: enrollment.courseId });

        if (course) {
          // Refund student
          await db.collection('wallets').updateOne(
            { userId: session.user.id },
            {
              $inc: { balance: course.price },
              $push: {
                transactions: {
                  type: 'course_refund',
                  amount: course.price,
                  description: `Refund for course: ${course.title}`,
                  createdAt: new Date(),
                },
              },
            },
            { session }
          );

          // Deduct from tutor's wallet
          const tutor = await db.collection('tutors').findOne({ _id: course.tutorId });

          if (tutor) {
            await db.collection('wallets').updateOne(
              { userId: tutor.userId },
              {
                $inc: { balance: -course.price * 0.7 }, // 70% of course price
                $push: {
                  transactions: {
                    type: 'course_refund',
                    amount: -course.price * 0.7,
                    description: `Refund for course: ${course.title}`,
                    createdAt: new Date(),
                  },
                },
              },
              { session }
            );
          }
        }
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    return NextResponse.json({ error: 'Failed to cancel enrollment' }, { status: 500 });
  }
}
