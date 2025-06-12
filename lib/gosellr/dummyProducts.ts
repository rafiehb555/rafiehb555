export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sqlLevel: 'free' | 'basic' | 'premium' | 'enterprise';
  views: number;
  seller: {
    id: string;
    name: string;
    sqlLevel: 'free' | 'basic' | 'premium' | 'enterprise';
  };
}

export const dummyProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Smartphone',
    description: 'Latest model with advanced features and high-performance camera.',
    price: 999.99,
    image: 'https://via.placeholder.com/400x300',
    category: 'electronics',
    sqlLevel: 'premium',
    views: 1200,
    seller: {
      id: 's1',
      name: 'TechGadgets',
      sqlLevel: 'premium',
    },
  },
  {
    id: '2',
    title: 'Designer Watch',
    description: 'Elegant timepiece with premium materials and craftsmanship.',
    price: 299.99,
    image: 'https://via.placeholder.com/400x300',
    category: 'fashion',
    sqlLevel: 'basic',
    views: 800,
    seller: {
      id: 's2',
      name: 'LuxuryTime',
      sqlLevel: 'basic',
    },
  },
  {
    id: '3',
    title: 'Smart Home Hub',
    description: 'Control your home devices with voice commands and automation.',
    price: 149.99,
    image: 'https://via.placeholder.com/400x300',
    category: 'electronics',
    sqlLevel: 'enterprise',
    views: 1500,
    seller: {
      id: 's3',
      name: 'SmartLiving',
      sqlLevel: 'enterprise',
    },
  },
  {
    id: '4',
    title: 'Organic Skincare Set',
    description: 'Natural ingredients for healthy and glowing skin.',
    price: 79.99,
    image: 'https://via.placeholder.com/400x300',
    category: 'beauty',
    sqlLevel: 'free',
    views: 600,
    seller: {
      id: 's4',
      name: 'NaturalBeauty',
      sqlLevel: 'free',
    },
  },
  {
    id: '5',
    title: 'Modern Coffee Table',
    description: 'Stylish and functional furniture for your living room.',
    price: 199.99,
    image: 'https://via.placeholder.com/400x300',
    category: 'home',
    sqlLevel: 'basic',
    views: 900,
    seller: {
      id: 's5',
      name: 'HomeDecor',
      sqlLevel: 'basic',
    },
  },
];
