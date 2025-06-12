import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Doctor } from '@/lib/models/Doctor';

// GET /api/doctors?city=xxx&specialty=yyy&hospital=zzz&minSqlLevel=3
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const specialty = searchParams.get('specialty');
    const hospital = searchParams.get('hospital');
    const minSqlLevel = searchParams.get('minSqlLevel');

    const client = await clientPromise;
    const db = client.db();

    // Build query
    const query: any = {};
    if (city) query.city = city;
    if (specialty) query.specialty = specialty;
    if (hospital) query.hospital = hospital;
    if (minSqlLevel) query.sqlLevel = { $gte: parseInt(minSqlLevel) };

    const doctors = await db
      .collection('doctors')
      .find(query)
      .sort({ sqlLevel: -1, name: 1 })
      .toArray();

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

// POST /api/doctors
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, city, specialty, hospital, fee } = body;

    if (!name || !city || !specialty || !hospital || !fee) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user already has a doctor profile
    const existingDoctor = await db.collection('doctors').findOne({ userId: session.user.id });

    if (existingDoctor) {
      return NextResponse.json({ error: 'Doctor profile already exists' }, { status: 400 });
    }

    // Get user's SQL level from wallet
    const wallet = await db.collection('wallets').findOne({ userId: session.user.id });

    if (!wallet || wallet.sqlLevel < 3) {
      return NextResponse.json({ error: 'Insufficient SQL level. Required: 3' }, { status: 403 });
    }

    // Create doctor profile
    const doctor: Doctor = {
      _id: new ObjectId(),
      userId: session.user.id,
      name,
      city,
      specialty,
      hospital,
      fee,
      sqlLevel: wallet.sqlLevel,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('doctors').insertOne(doctor);

    return NextResponse.json({ doctor });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}

// PATCH /api/doctors/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, city, specialty, hospital, fee } = body;

    const client = await clientPromise;
    const db = client.db();

    // Check if doctor exists and belongs to user
    const doctor = await db.collection('doctors').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Update doctor profile
    const updatedDoctor = await db.collection('doctors').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...(name && { name }),
          ...(city && { city }),
          ...(specialty && { specialty }),
          ...(hospital && { hospital }),
          ...(fee && { fee }),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ doctor: updatedDoctor });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

// DELETE /api/doctors/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if doctor exists and belongs to user
    const doctor = await db.collection('doctors').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Check if doctor has any pending appointments
    const pendingAppointments = await db.collection('appointments').findOne({
      doctorId: new ObjectId(params.id),
      status: 'pending',
    });

    if (pendingAppointments) {
      return NextResponse.json(
        { error: 'Cannot delete doctor with pending appointments' },
        { status: 400 }
      );
    }

    // Delete doctor profile
    await db.collection('doctors').deleteOne({
      _id: new ObjectId(params.id),
    });

    // Delete doctor's availability
    await db.collection('availability').deleteMany({
      doctorId: new ObjectId(params.id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
