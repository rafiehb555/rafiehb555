import { ObjectId } from 'mongodb';

export interface Availability {
  _id: ObjectId;
  doctorId: string;
  day: string; // e.g. 'Monday'
  timeSlots: string[]; // e.g. ['10:00-10:30', '10:30-11:00']
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAvailabilityInput {
  doctorId: string;
  day: string;
  timeSlots: string[];
}

export interface UpdateAvailabilityInput extends Partial<CreateAvailabilityInput> {}
