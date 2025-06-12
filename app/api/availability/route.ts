import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Availability } from '@/lib/models/Availability';

// GET /api/availability?doctorId=xxx&date=yyyy-mm-dd
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    if (!doctorId || !date) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get doctor's availability
    const availability = await db.collection('availability').findOne({
      doctorId: new ObjectId(doctorId),
      day: new Date(date).getDay(),
    });

    if (!availability) {
      return NextResponse.json({ slots: [] });
    }

    // Get booked slots for the date
    const bookedSlots = await db
      .collection('appointments')
      .find({
        doctorId: new ObjectId(doctorId),
        date,
        status: { $ne: 'cancelled' },
      })
      .project({ timeSlot: 1 })
      .toArray();

    const bookedTimeSlots = bookedSlots.map((slot: { timeSlot: string }) => slot.timeSlot);

    // Filter out booked slots
    const availableSlots = availability.timeSlots.filter(
      (slot: string) => !bookedTimeSlots.includes(slot)
    );

    return NextResponse.json({ slots: availableSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

// POST /api/availability
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { day, timeSlots } = body;

    if (!day || !timeSlots || !Array.isArray(timeSlots)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if doctor exists
    const doctor = await db.collection('doctors').findOne({ userId: session.user.id });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Update or create availability
    const availability: Availability = {
      _id: new ObjectId(),
      doctorId: doctor._id as unknown as ObjectId,
      day,
      timeSlots,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('availability').updateOne(
      {
        doctorId: doctor._id,
        day,
      },
      { $set: availability },
      { upsert: true }
    );

    return NextResponse.json({ availability });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}
