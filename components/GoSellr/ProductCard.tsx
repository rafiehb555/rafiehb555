import React from 'react';
import { FiShoppingCart, FiLock } from 'react-icons/fi';
import SQLBadge from './SQLBadge';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sqlLevel: string;
  views: number;
  seller: {
    id: string;
    name: string;
    sqlLevel: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Product Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img src={product.image} alt={product.title} className="object-cover w-full h-full" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
          <SQLBadge level={product.sqlLevel} />
        </div>

        <p className="mt-2 text-gray-600 line-clamp-2">{product.description}</p>

        {/* Seller Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm font-medium text-gray-900">{product.seller.name}</p>
              <SQLBadge level={product.seller.sqlLevel} />
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
