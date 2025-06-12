import { useState } from 'react';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

interface Order {
  id: string;
  customerName: string;
  serviceName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'disputed';
  date: string;
}

export default function EMOOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'John Doe',
      serviceName: 'Web Development',
      amount: 1000,
      status: 'pending',
      date: '2024-03-15',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      serviceName: 'Digital Marketing',
      amount: 500,
      status: 'completed',
      date: '2024-03-14',
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      // TODO: Call API to update order status
      setOrders(
        orders.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders =
    selectedStatus === 'all' ? orders : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Orders</h3>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.map(order => (
            <li key={order.id} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{order.serviceName}</p>
                  <p className="text-sm text-gray-500 truncate">{order.customerName}</p>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="mr-2">${order.amount}</span>
                    <span className="mr-2">•</span>
                    <span>{order.date}</span>
                    <span className="mr-2">•</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'disputed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        className="text-green-400 hover:text-green-500"
                        title="Mark as completed"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        className="text-red-400 hover:text-red-500"
                        title="Cancel order"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {order.status === 'disputed' && (
                    <button
                      onClick={() => {
                        /* TODO: Handle dispute */
                      }}
                      className="text-yellow-400 hover:text-yellow-500"
                      title="View dispute details"
                    >
                      <FiAlertCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
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
