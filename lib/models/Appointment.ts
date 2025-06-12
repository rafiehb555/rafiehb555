import { ObjectId } from 'mongodb';

export interface Appointment {
  _id: ObjectId;
  doctorId: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. '10:00-10:30'
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentInput {
  doctorId: string;
  patientId: string;
  date: string;
  timeSlot: string;
}

export interface UpdateAppointmentInput {
  status?: 'pending' | 'confirmed' | 'cancelled';
}
