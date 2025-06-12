export interface Seller {
  id: string;
  name: string;
  sqlLevel: 'free' | 'basic' | 'premium' | 'enterprise';
  rating: number;
  totalSales: number;
  categories: string[];
}

export const dummySellers: Seller[] = [
  {
    id: 's1',
    name: 'TechGadgets',
    sqlLevel: 'premium',
    rating: 4.8,
    totalSales: 1200,
    categories: ['electronics'],
  },
  {
    id: 's2',
    name: 'LuxuryTime',
    sqlLevel: 'basic',
    rating: 4.5,
    totalSales: 800,
    categories: ['fashion'],
  },
  {
    id: 's3',
    name: 'SmartLiving',
    sqlLevel: 'enterprise',
    rating: 4.9,
    totalSales: 2500,
    categories: ['electronics', 'home'],
  },
  {
    id: 's4',
    name: 'NaturalBeauty',
    sqlLevel: 'free',
    rating: 4.2,
    totalSales: 400,
    categories: ['beauty'],
  },
  {
    id: 's5',
    name: 'HomeDecor',
    sqlLevel: 'basic',
    rating: 4.6,
    totalSales: 900,
    categories: ['home'],
  },
];
