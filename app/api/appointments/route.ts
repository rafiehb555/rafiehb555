import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Appointment } from '@/lib/models/Appointment';
import { Doctor } from '@/lib/models/Doctor';
import { Wallet } from '@/lib/models/Wallet';

// GET /api/appointments/my-appointments
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isMyAppointments = searchParams.get('my-appointments') === 'true';

    const client = await clientPromise;
    const db = client.db();

    let query = {};
    if (isMyAppointments) {
      query = { patientId: session.user.id };
    }

    const appointments = await db
      .collection('appointments')
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor',
          },
        },
        { $unwind: '$doctor' },
        { $sort: { date: 1 } },
      ])
      .toArray();

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST /api/appointments
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, date, timeSlot } = body;

    if (!doctorId || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if doctor exists and get their fee
    const doctor = await db.collection('doctors').findOne({ _id: new ObjectId(doctorId) });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Check if slot is available
    const existingAppointment = await db.collection('appointments').findOne({
      doctorId: new ObjectId(doctorId),
      date,
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: 'Time slot is not available' }, { status: 400 });
    }

    // Check if patient has enough balance
    const wallet = await db.collection('wallets').findOne({ userId: session.user.id });

    if (!wallet || wallet.balance < doctor.fee) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create appointment
    const appointment: Appointment = {
      _id: new ObjectId(),
      doctorId: new ObjectId(doctorId),
      patientId: session.user.id,
      date,
      timeSlot,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('appointments').insertOne(appointment);

    // Deduct fee from patient's wallet
    await db.collection('wallets').updateOne(
      { userId: session.user.id },
      {
        $inc: { balance: -doctor.fee },
        $push: {
          transactions: {
            type: 'appointment',
            amount: -doctor.fee,
            description: `Appointment with Dr. ${doctor.name}`,
            date: new Date(),
          },
        } as any,
      }
    );

    // Add fee to doctor's wallet
    await db.collection('wallets').updateOne(
      { userId: doctor.userId },
      {
        $inc: { balance: doctor.fee },
        $push: {
          transactions: {
            type: 'appointment',
            amount: doctor.fee,
            description: `Appointment with patient`,
            date: new Date(),
          },
        } as any,
      }
    );

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

// PATCH /api/appointments/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, timeSlot, status } = body;

    if (!date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if appointment exists and belongs to user
    const appointment = await db.collection('appointments').findOne({
      _id: new ObjectId(params.id),
      patientId: session.user.id,
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check if new slot is available
    const existingAppointment = await db.collection('appointments').findOne({
      doctorId: appointment.doctorId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' },
      _id: { $ne: new ObjectId(params.id) },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: 'Time slot is not available' }, { status: 400 });
    }

    // Update appointment
    const updatedAppointment = await db.collection('appointments').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          date,
          timeSlot,
          status: status || appointment.status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if appointment exists and belongs to user
    const appointment = await db.collection('appointments').findOne({
      _id: new ObjectId(params.id),
      patientId: session.user.id,
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Get doctor's fee
    const doctor = await db.collection('doctors').findOne({ _id: appointment.doctorId });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Update appointment status
    await db.collection('appointments').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: 'cancelled',
          updatedAt: new Date(),
        },
      }
    );

    // Refund fee to patient's wallet
    await db.collection('wallets').updateOne(
      { userId: session.user.id },
      {
        $inc: { balance: doctor.fee },
        $push: {
          transactions: {
            type: 'refund',
            amount: doctor.fee,
            description: `Refund for cancelled appointment with Dr. ${doctor.name}`,
            date: new Date(),
          },
        } as any,
      }
    );

    // Deduct fee from doctor's wallet
    await db.collection('wallets').updateOne(
      { userId: doctor.userId },
      {
        $inc: { balance: -doctor.fee },
        $push: {
          transactions: {
            type: 'refund',
            amount: -doctor.fee,
            description: `Refund for cancelled appointment`,
            date: new Date(),
          },
        } as any,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
  }
}
