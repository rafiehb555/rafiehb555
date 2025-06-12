export type FranchiseType = 'retail' | 'wholesale' | 'dropship';

export interface FranchiseConfig {
  id: FranchiseType;
  name: string;
  description: string;
  features: string[];
  requirements: {
    sqlLevel: number;
    investment: string;
    documents: string[];
  };
  benefits: string[];
}

export interface StoreSetup {
  id: string;
  franchiseType: FranchiseType;
  name: string;
  description: string;
  logo?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  variants?: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  details: {
    name: string;
    number?: string;
    expiry?: string;
    upiId?: string;
    bankName?: string;
  };
  isDefault: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  isAvailable: boolean;
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  products: {
    id: string;
    quantity: number;
    price: number;
    variantId?: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}
