'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Product } from '@/lib/models/Product';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  shopId: string;
}

export default function GoSellrPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    city: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });
  const [orderStatus, setOrderStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      });

      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.products);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === product._id?.toString());
      if (existingItem) {
        return prev.map(item =>
          item.productId === product._id?.toString()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id!.toString(),
          quantity: 1,
          price: product.price,
          name: product.name,
          shopId: product.shopId.toString(),
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const placeOrder = async () => {
    if (!session) {
      setOrderStatus({
        type: 'error',
        message: 'Please sign in to place an order',
      });
      return;
    }

    try {
      // Check wallet balance
      const walletResponse = await fetch('/api/wallet');
      if (!walletResponse.ok) throw new Error('Failed to fetch wallet');
      const walletData = await walletResponse.json();

      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (walletData.balance < totalAmount) {
        setOrderStatus({
          type: 'error',
          message: 'Insufficient wallet balance',
        });
        return;
      }

      // Place order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          paymentMethod: 'wallet',
        }),
      });

      if (!orderResponse.ok) throw new Error('Failed to place order');

      // Clear cart and show success message
      setCart([]);
      setOrderStatus({
        type: 'success',
        message: 'Order placed successfully!',
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setOrderStatus({ type: null, message: '' });
      }, 3000);
    } catch (err) {
      setOrderStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to place order',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="border rounded-lg p-2"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
          className="border rounded-lg p-2"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
          className="border rounded-lg p-2"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <motion.div
            key={product._id?.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative h-48 bg-gray-200">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
            className={`px-4 py-2 rounded-lg ${
              pagination.page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">
                  ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={placeOrder}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Place Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Status Message */}
      <AnimatePresence>
        {orderStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              orderStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {orderStatus.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
