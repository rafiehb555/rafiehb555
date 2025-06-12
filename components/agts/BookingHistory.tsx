import React, { useState } from 'react';
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'tour' | 'transport';
  provider: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  date: string;
  location: string;
  duration: string;
  price: number;
  currency: string;
  bookingRef: string;
}

// Mock data - replace with API calls
const mockBookings: Booking[] = [
  {
    id: '1',
    type: 'flight',
    provider: 'SkyWings Airlines',
    status: 'upcoming',
    date: '2024-03-15',
    location: 'New York → London',
    duration: '7h 30m',
    price: 850,
    currency: 'USD',
    bookingRef: 'SW123456',
  },
  {
    id: '2',
    type: 'hotel',
    provider: 'Grand Hotels International',
    status: 'completed',
    date: '2024-02-01',
    location: 'London, UK',
    duration: '3 nights',
    price: 450,
    currency: 'USD',
    bookingRef: 'GH789012',
  },
];

export default function BookingHistory() {
  const [bookings] = useState<Booking[]>(mockBookings);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredBookings = bookings.filter(booking => {
    return selectedStatus === 'all' || booking.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <FiClock className="w-4 h-4" />;
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-900">Booking History</h2>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Bookings</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <div
            key={booking.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {booking.type} Booking
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{booking.provider}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {booking.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                    {booking.duration}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiDollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    {booking.currency} {booking.price}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end space-y-4">
                <div className="text-sm text-gray-500">Booking Ref: {booking.bookingRef}</div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    View Details
                  </button>
                  {booking.status === 'upcoming' && (
                    <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
