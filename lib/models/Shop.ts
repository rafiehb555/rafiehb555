import { ObjectId } from 'mongodb';

export interface Shop {
  _id: ObjectId;
  name: string;
  description: string;
  ownerId: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  coverImage: string;
  category: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShopInput {
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  coverImage: string;
  category: string;
}

export interface UpdateShopInput extends Partial<CreateShopInput> {}

export interface ShopStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
}

export function validateShopData(shop: Partial<Shop>): string | null {
  if (!shop.name || shop.name.length < 3) {
    return 'Shop name must be at least 3 characters long';
  }
  if (!shop.city) {
    return 'City is required';
  }
  if (!shop.email || !shop.phone) {
    return 'Email and phone are required';
  }
  return null;
}

export function calculateShopRating(ratings: number[]): number {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Number((sum / ratings.length).toFixed(1));
}
