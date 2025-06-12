export type SQLLevel = 1 | 2 | 3 | 4 | 5;

export interface SQLUser {
  id: string;
  sqlLevel: SQLLevel;
  sqlVerifiedBy: string;
  sqlExpiry: string;
  sqlIssuedAt: string;
  sqlStatus: 'verified' | 'pending' | 'expired';
  sqlBenefits: string[];
  sqlProgress: number;
  sqlNextLevelRequirements: {
    description: string;
    completed: boolean;
  }[];
}

export interface SQLUpgradeRequest {
  id: string;
  userId: string;
  currentLevel: SQLLevel;
  targetLevel: SQLLevel;
  documents: {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface SQLVerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  link: string;
}
