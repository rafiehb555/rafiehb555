import { ObjectId } from 'mongodb';

export interface Tutor {
  _id: ObjectId;
  userId: string;
  name: string;
  city: string;
  subjects: string[];
  fee: number;
  sqlLevel: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTutorInput {
  userId: string;
  name: string;
  city: string;
  subjects: string[];
  fee: number;
  sqlLevel: number;
}

export interface UpdateTutorInput extends Partial<CreateTutorInput> {}
