import { ObjectId } from 'mongodb';

export interface Course {
  _id: ObjectId;
  tutorId: ObjectId;
  title: string;
  description: string;
  subject: string;
  price: number;
  schedule: {
    days: string[]; // e.g. ['Monday', 'Wednesday']
    times: string[]; // e.g. ['10:00-11:00', '14:00-15:00']
  };
  city: string;
  mode: 'online' | 'onsite';
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  tutorId: string;
  title: string;
  description: string;
  schedule: {
    days: string[];
    times: string[];
  };
  price: number;
  city: string;
  mode: 'online' | 'onsite';
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {}
