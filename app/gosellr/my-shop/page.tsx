'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Shop } from '@/lib/models/Shop';
import { Order } from '@/lib/models/Order';
import { Wallet } from '@/lib/models/Wallet';
import { checkModuleEligibility } from '@/lib/utils/walletEligibility';
import Modal from '@/components/ui/Modal';

interface ShopStats {
  totalProducts: number;
  totalOrders: number;
  totalIncome: number;
  pendingOrders: number;
  deliveredOrders: number;
}

interface WalletInfo {
  balance: number;
  lockedBalance: number;
  sqlLevel: string;
}

export default function ShopkeeperDashboard() {
  const { data: session } = useSession();
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [stats, setStats] = useState<ShopStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalIncome: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchShopAndData();
  }, [session]);

  const fetchShopAndData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch shop data
      const shopRes = await fetch('/api/shops/my-shop');
      if (!shopRes.ok) throw new Error('Failed to fetch shop');
      const shopData = await shopRes.json();

      // Fetch wallet data
      const walletRes = await fetch('/api/wallet');
      if (!walletRes.ok) throw new Error('Failed to fetch wallet');
      const walletData = await walletRes.json();

      // Fetch orders with filters
      const ordersRes = await fetch(
        `/api/orders?shopOwner=true&status=${filters.status}${
          filters.startDate ? `&startDate=${filters.startDate}` : ''
        }${filters.endDate ? `&endDate=${filters.endDate}` : ''}`
      );
      if (!ordersRes.ok) throw new Error('Failed to fetch orders');
      const ordersData = await ordersRes.json();

      setShop(shopData);
      setWallet(walletData);
      setOrders(ordersData.orders);

      // Calculate stats
      const completedOrders = ordersData.orders.filter(
        (order: Order) => order.status === 'delivered'
      );
      const pendingOrders = ordersData.orders.filter((order: Order) => order.status === 'pending');

      setStats({
        totalProducts: shopData.totalProducts || 0,
        totalOrders: ordersData.orders.length,
        totalIncome: completedOrders.reduce(
          (sum: number, order: Order) => sum + order.totalAmount,
          0
        ),
        pendingOrders: pendingOrders.length,
        deliveredOrders: completedOrders.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      // Refresh data
      fetchShopAndData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">No Shop Found</h2>
          <p className="mb-4 text-gray-600">
            You need to create a shop first to access the dashboard.
          </p>
          <button
            onClick={() => (window.location.href = '/gosellr/create-shop')}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Create Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Shop Header */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
            <p className="text-gray-600">{shop.city}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">SQL Level</p>
              <p className="text-lg font-semibold text-blue-600">{wallet?.sqlLevel || 'Basic'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="text-lg font-semibold text-green-600">
                ${wallet?.balance.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => (window.location.href = '/gosellr/my-products')}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Manage Products
              </button>
              <button
                onClick={() => (window.location.href = '/gosellr/edit-shop')}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Edit Shop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">${stats.totalIncome.toFixed(2)}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Delivered Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.deliveredOrders}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select
          value={filters.status}
          onChange={e => {
            setFilters(prev => ({ ...prev, status: e.target.value }));
            fetchShopAndData();
          }}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={e => {
            setFilters(prev => ({ ...prev, startDate: e.target.value }));
            fetchShopAndData();
          }}
          className="rounded-lg border border-gray-300 px-4 py-2"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={e => {
            setFilters(prev => ({ ...prev, endDate: e.target.value }));
            fetchShopAndData();
          }}
          className="rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map(order => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{order._id.toString().slice(-6)}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.map(item => item.product?.name).join(', ')}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">${order.totalAmount.toFixed(2)}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Update Status
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-medium">Update Order Status</h3>
          <div className="space-y-4">
            {['processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => {
                  if (selectedOrder) {
                    handleStatusUpdate(selectedOrder._id.toString(), status);
                    setIsModalOpen(false);
                  }
                }}
                className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
