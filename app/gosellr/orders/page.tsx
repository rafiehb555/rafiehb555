'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Order } from '@/lib/models/Product';

export default function OrderManagementPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: '',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status: filters.status !== 'all' ? filters.status : '',
        dateRange: filters.dateRange,
        search: filters.search,
      });

      const response = await fetch(`/api/orders?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      // Refresh orders after update
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="flex gap-4">
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {orders.map(order => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
                    <p className="text-gray-600">Items: {order.items.length}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={e => updateOrderStatus(selectedOrder._id, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <h3 className="font-semibold">Customer</h3>
                  <p className="text-gray-600">{selectedOrder.userId}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Items</h3>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.items.map(item => (
                      <div key={item._id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Total</h3>
                  <p className="text-xl font-bold">${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Shipping Address</h3>
                  <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Payment Status</h3>
                  <p className="text-gray-600">{selectedOrder.paymentStatus}</p>
                </div>
                {selectedOrder.trackingNumber && (
                  <div>
                    <h3 className="font-semibold">Tracking Number</h3>
                    <p className="text-gray-600">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
