import { ObjectId } from 'mongodb';

export interface Doctor {
  _id: ObjectId;
  userId: string;
  name: string;
  city: string;
  specialty: string;
  hospital: string;
  fee: number;
  sqlLevel: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDoctorInput {
  name: string;
  city: string;
  specialty: string;
  hospital: string;
  fee: number;
}

export interface UpdateDoctorInput {
  name?: string;
  city?: string;
  specialty?: string;
  hospital?: string;
  fee?: number;
}
