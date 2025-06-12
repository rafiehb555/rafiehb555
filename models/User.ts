import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
  sqlLevel: number;
  sqlStatus: 'free' | 'pending' | 'approved' | 'rejected';
  sqlIssuedBy?: string;
  sqlVerifiedDate?: Date;
  sqlUpgradePending?: number;
  sqlHistory: Array<{
    fromLevel: number;
    toLevel: number;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    documents: Array<{
      name: string;
      url: string;
    }>;
    notes?: string;
  }>;
  pssVerified: boolean;
  edrPassed: boolean;
  emoVerified: boolean;
  hasJobProof: boolean;
  franchiseVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    sqlLevel: { type: Number, default: 0 },
    sqlStatus: {
      type: String,
      enum: ['free', 'pending', 'approved', 'rejected'],
      default: 'free',
    },
    sqlIssuedBy: { type: String },
    sqlVerifiedDate: { type: Date },
    sqlUpgradePending: { type: Number },
    sqlHistory: [
      {
        fromLevel: { type: Number, required: true },
        toLevel: { type: Number, required: true },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          required: true,
        },
        submittedAt: { type: Date, required: true },
        documents: [
          {
            name: { type: String, required: true },
            url: { type: String, required: true },
          },
        ],
        notes: { type: String },
      },
    ],
    pssVerified: { type: Boolean, default: false },
    edrPassed: { type: Boolean, default: false },
    emoVerified: { type: Boolean, default: false },
    hasJobProof: { type: Boolean, default: false },
    franchiseVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
