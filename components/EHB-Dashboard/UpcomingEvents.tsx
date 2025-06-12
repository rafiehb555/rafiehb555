import React from 'react';
import { FiCalendar, FiClock, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  type: 'meeting' | 'reminder' | 'deadline' | 'event';
  priority: 'high' | 'medium' | 'low';
}

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return <FiCalendar className="w-5 h-5 text-blue-500" />;
      case 'reminder':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'deadline':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      case 'event':
        return <FiCalendar className="w-5 h-5 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        <a href="/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View Calendar
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(event.priority)}`}
                  >
                    {event.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-1" />
                    {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FiCalendar className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-gray-500">No upcoming events</p>
        </div>
      )}
    </div>
  );
}
