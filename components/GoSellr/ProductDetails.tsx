import React, { useState } from 'react';
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from 'react-icons/fi';

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  shop: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    sqlLevel: 'basic' | 'normal' | 'high';
  };
  category: string;
  tags: string[];
  sqlRequired: 'free' | 'basic' | 'normal' | 'high';
  images: string[];
  stock: number;
  discount?: number;
  specifications: {
    [key: string]: string;
  };
}

// Mock data - replace with API calls
const mockProduct: Product = {
  id: '1',
  name: 'Premium Laptop',
  description:
    'High-performance laptop with latest specifications. Perfect for gaming, content creation, and professional work.',
  price: 999,
  currency: 'USD',
  rating: 4.8,
  reviews: 128,
  shop: {
    id: '1',
    name: 'Tech Haven',
    rating: 4.9,
    verified: true,
    sqlLevel: 'high',
  },
  category: 'Electronics',
  tags: ['laptop', 'electronics', 'gaming'],
  sqlRequired: 'normal',
  images: [
    '/products/laptop-1.jpg',
    '/products/laptop-2.jpg',
    '/products/laptop-3.jpg',
    '/products/laptop-4.jpg',
  ],
  stock: 15,
  discount: 10,
  specifications: {
    Processor: 'Intel Core i7-11800H',
    RAM: '16GB DDR4',
    Storage: '512GB SSD',
    Display: '15.6" 144Hz IPS',
    Graphics: 'NVIDIA RTX 3060',
    Battery: '6-cell 86Whr',
    Weight: '2.3 kg',
  },
};

const mockReviews: Review[] = [
  {
    id: '1',
    user: 'John D.',
    rating: 5,
    date: '2024-02-15',
    comment:
      'Excellent product! The performance is outstanding and the build quality is top-notch.',
    verified: true,
  },
  {
    id: '2',
    user: 'Sarah M.',
    rating: 4,
    date: '2024-02-10',
    comment:
      'Great laptop for the price. Battery life could be better, but overall very satisfied.',
    verified: true,
  },
];

export default function ProductDetails() {
  const [product] = useState<Product>(mockProduct);
  const [reviews] = useState<Review[]>(mockReviews);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{product.shop.name}</span>
              {product.shop.verified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              )}
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              SQL {product.sqlRequired}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <FiStar className="w-5 h-5 text-yellow-400" />
              <span className="ml-1 font-semibold">{product.rating}</span>
              <span className="ml-1 text-gray-500">({product.reviews} reviews)</span>
            </div>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <FiShare2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {product.currency} {product.price}
              </span>
              {product.discount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {product.currency} {Math.round(product.price * (1 + product.discount / 100))}
                  </span>
                  <span className="text-sm text-red-500">-{product.discount}%</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">In Stock: {product.stock} units</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiTruck className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiRefreshCw className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">30 Day Returns</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => handleQuantityChange(parseInt(e.target.value))}
                  className="w-16 text-center border-x border-gray-300 py-2"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                <FiShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiHeart className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="w-1/3 text-gray-500">{key}</span>
              <span className="w-2/3 text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">{review.user}</span>
                  {review.verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
