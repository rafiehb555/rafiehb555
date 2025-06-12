import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  shopId: string;
  stock: number;
  SKU: string;
  attributes: Record<string, any>;
  status: 'active' | 'inactive' | 'draft';
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  _id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  image?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  logo?: string;
  coverImage?: string;
  address: string;
  contact: {
    email: string;
    phone: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  userId: string;
  shopId: string;
  items: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const calculateOrderTotal = (items: Order['items']): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const validateProductStock = (product: Product, quantity: number): boolean => {
  return product.stock >= quantity;
};

export const formatProductPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};
