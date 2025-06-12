'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Shop } from '@/lib/models/Shop';

export default function ShopManagementPage() {
  const { data: session } = useSession();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch('/api/shops/my-shop');
        if (!response.ok) {
          throw new Error('Failed to fetch shop data');
        }
        const data = await response.json();
        setShop(data.shop);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchShopData();
    }
  }, [session]);

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

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Create Your Shop</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <p className="text-gray-600 mb-6">
            Start your business journey by creating your shop. You'll be able to add products and
            start selling right away.
          </p>
          <button
            onClick={() => {
              /* TODO: Implement shop creation modal */
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Shop
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-gray-500 text-sm mb-2">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-gray-500 text-sm mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-gray-500 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">${stats.totalRevenue}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-gray-500 text-sm mb-2">Average Rating</h3>
          <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Shop Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-500 text-sm">Shop Name</h3>
              <p className="text-lg">{shop.name}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Description</h3>
              <p className="text-lg">{shop.description}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Address</h3>
              <p className="text-lg">
                {shop.address.street}, {shop.address.city}, {shop.address.state}{' '}
                {shop.address.zipCode}
              </p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Contact</h3>
              <p className="text-lg">
                {shop.contact.email} | {shop.contact.phone}
              </p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">SQL Level</h3>
              <p className="text-lg">{shop.sqlLevel}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                /* TODO: Implement add product */
              }}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Product
            </button>
            <button
              onClick={() => {
                /* TODO: Implement view orders */
              }}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              View Orders
            </button>
            <button
              onClick={() => {
                /* TODO: Implement edit shop */
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Edit Shop
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
