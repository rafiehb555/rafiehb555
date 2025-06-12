import { FiTrendingUp, FiPackage, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface BusinessData {
  name: string;
  sqlLevel: number;
  services: number;
  orders: number;
  revenue: number;
}

interface EMOHomeCardProps {
  businessData: BusinessData;
}

export default function EMOHomeCard({ businessData }: EMOHomeCardProps) {
  const { name, sqlLevel, services, orders, revenue } = businessData;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FiTrendingUp className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Business Overview</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{name}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <FiPackage className="h-5 w-5 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-500">Services</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{services}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <FiDollarSign className="h-5 w-5 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-500">Revenue</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">${revenue}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <FiAlertCircle className="h-5 w-5 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-500">SQL Level</span>
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{sqlLevel}</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            View all orders
          </a>
        </div>
      </div>
    </div>
  );
}
