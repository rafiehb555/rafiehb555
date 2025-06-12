export enum FranchiseType {
  SUB = 'SUB',
  MASTER = 'MASTER',
  CORPORATE = 'CORPORATE',
}

export enum ServiceCategory {
  GOSELLR = 'GOSELLR',
  HEALTH = 'HEALTH',
  LAW = 'LAW',
  EDUCATION = 'EDUCATION',
  TRAVEL = 'TRAVEL',
  BOOKS = 'BOOKS',
}

export interface FranchiseBase {
  id: string;
  name: string;
  type: FranchiseType;
  category: ServiceCategory;
  location: {
    city: string;
    area: string;
    postalCode: string;
  };
  sql: number; // Service Quality Level
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

export interface SubFranchise extends FranchiseBase {
  level: number; // 1-10
  masterFranchiseId: string;
  dailyOrders: number;
  deliveryVolume: number;
  complaintResolutionRate: number;
}

export interface MasterFranchise extends FranchiseBase {
  subFranchises: string[]; // Array of SubFranchise IDs
  territory: {
    district: string;
    region: string;
  };
  maxSubFranchises: number;
}

export interface CorporateFranchise extends FranchiseBase {
  country: string;
  masterFranchises: string[]; // Array of MasterFranchise IDs
  nationalData: {
    totalRevenue: number;
    totalOrders: number;
    activeUsers: number;
  };
}

export interface GoSellrFranchise extends SubFranchise {
  franchiseModel: 'PRODUCT_SUPPLY' | 'DELIVERY_NETWORK' | 'SERVICE_MANAGEMENT';
  inventory: {
    totalProducts: number;
    categories: string[];
  };
  deliveryMetrics: {
    averageDeliveryTime: number;
    successRate: number;
  };
}
