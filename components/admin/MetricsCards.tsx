import { motion } from 'framer-motion';
import {
  FaUsers,
  FaShoppingCart,
  FaCalendarCheck,
  FaCoins,
  FaStore,
  FaCheckCircle,
} from 'react-icons/fa';

interface MetricsData {
  totalUsers: number;
  totalSales: number;
  totalBookings: number;
  totalEHBGC: number;
  activeFranchises: number;
  sqlVerifiedUsers: number;
  userChange: number;
  salesChange: number;
  bookingChange: number;
  ehbgcChange: number;
  franchiseChange: number;
  sqlChange: number;
}

export default function MetricsCards(metrics: MetricsData) {
  const cards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      change: metrics.userChange,
      icon: FaUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Sales',
      value: `$${metrics.totalSales.toLocaleString()}`,
      change: metrics.salesChange,
      icon: FaShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Total Bookings',
      value: metrics.totalBookings,
      change: metrics.bookingChange,
      icon: FaCalendarCheck,
      color: 'bg-purple-500',
    },
    {
      title: 'EHBGC in System',
      value: metrics.totalEHBGC.toLocaleString(),
      change: metrics.ehbgcChange,
      icon: FaCoins,
      color: 'bg-yellow-500',
    },
    {
      title: 'Active Franchises',
      value: metrics.activeFranchises,
      change: metrics.franchiseChange,
      icon: FaStore,
      color: 'bg-red-500',
    },
    {
      title: 'SQL Verified Users',
      value: metrics.sqlVerifiedUsers,
      change: metrics.sqlChange,
      icon: FaCheckCircle,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</p>
              <p
                className={`text-sm font-medium mt-2 ${
                  card.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {card.change >= 0 ? '+' : ''}
                {card.change}% from last month
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
