import React, { useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiFilter, FiSearch } from 'react-icons/fi';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
  shop: {
    id: string;
    name: string;
    verified: boolean;
  };
}

interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  total: number;
  currency: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  sqlEarned: number;
}

// Mock data - replace with API calls
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      {
        id: '1',
        productId: '1',
        name: 'Premium Laptop',
        price: 999,
        currency: 'USD',
        quantity: 1,
        image: '/products/laptop.jpg',
        shop: {
          id: '1',
          name: 'Tech Haven',
          verified: true,
        },
      },
    ],
    status: 'delivered',
    date: '2024-02-15',
    total: 999,
    currency: 'USD',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-02-20',
    sqlEarned: 50,
  },
  {
    id: 'ORD-002',
    items: [
      {
        id: '2',
        productId: '2',
        name: 'Designer Watch',
        price: 299,
        currency: 'USD',
        quantity: 2,
        image: '/products/watch.jpg',
        shop: {
          id: '2',
          name: 'Luxury Timepieces',
          verified: true,
        },
      },
    ],
    status: 'shipped',
    date: '2024-02-18',
    total: 598,
    currency: 'USD',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-02-25',
    sqlEarned: 30,
  },
];

const orderStatuses = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderHistory() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'total':
        return b.total - a.total;
      case 'sql':
        return b.sqlEarned - a.sqlEarned;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-5 h-5" />;
      case 'processing':
        return <FiPackage className="w-5 h-5" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5" />;
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <FiCheckCircle className="w-5 h-5" />;
      default:
        return <FiPackage className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>

      {/* Search and Filter Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Most Recent</option>
              <option value="total">Highest Amount</option>
              <option value="sql">Most SQL Earned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {sortedOrders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-900">{order.id}</span>
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                  <span className="text-sm text-gray-500">SQL Earned: {order.sqlEarned}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.shop.name}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                        <span className="text-sm text-gray-600">
                          Price: {item.currency} {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    {order.trackingNumber && (
                      <p className="text-sm text-gray-600">
                        Tracking Number: {order.trackingNumber}
                      </p>
                    )}
                    {order.estimatedDelivery && (
                      <p className="text-sm text-gray-600">
                        Estimated Delivery: {order.estimatedDelivery}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="text-lg font-semibold text-gray-900">
                      Total: {order.currency} {order.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
