import { ObjectId } from 'mongodb';

export interface Enrollment {
  _id: ObjectId;
  studentId: ObjectId;
  courseId: ObjectId;
  status: 'active' | 'completed' | 'cancelled';
  completed: boolean;
  rating?: number;
  completion?: number; // e.g. 75 for 75% complete
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEnrollmentInput {
  studentId: string;
  courseId: string;
}

export interface UpdateEnrollmentInput {
  status?: 'active' | 'completed' | 'cancelled';
  rating?: number;
  completion?: number;
}
