import { useState } from 'react';
import { FiCalendar, FiClock, FiDollarSign, FiInfo } from 'react-icons/fi';

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

interface BookingForm {
  lawyerId: string;
  date: string;
  timeSlot: string;
  consultationType: 'initial' | 'follow-up' | 'emergency';
  description: string;
}

export default function ConsultationBooking() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [consultationType, setConsultationType] =
    useState<BookingForm['consultationType']>('initial');
  const [description, setDescription] = useState('');

  // Mock time slots - replace with API call
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', isAvailable: true },
    { id: '2', time: '10:00 AM', isAvailable: true },
    { id: '3', time: '11:00 AM', isAvailable: false },
    { id: '4', time: '02:00 PM', isAvailable: true },
    { id: '5', time: '03:00 PM', isAvailable: true },
    { id: '6', time: '04:00 PM', isAvailable: false },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking submission
    console.log({
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationType,
      description,
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Consultation</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots
            </label>
            <div className="grid grid-cols-3 gap-4">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot.time)}
                  disabled={!slot.isAvailable}
                  className={`
                    flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium
                    ${
                      selectedTimeSlot === slot.time
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                        : slot.isAvailable
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <FiClock className="mr-2 h-4 w-4" />
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Type */}
          <div>
            <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700">
              Consultation Type
            </label>
            <select
              id="consultationType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={consultationType}
              onChange={e => setConsultationType(e.target.value as BookingForm['consultationType'])}
              required
            >
              <option value="initial">Initial Consultation</option>
              <option value="follow-up">Follow-up Consultation</option>
              <option value="emergency">Emergency Consultation</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Brief Description of Your Legal Matter
            </label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Pricing Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center text-sm text-gray-500">
              <FiInfo className="h-5 w-5 mr-2" />
              <span>Consultation fees will be deducted from your wallet balance</span>
            </div>
            <div className="mt-2 flex items-center text-lg font-semibold text-gray-900">
              <FiDollarSign className="h-5 w-5 mr-1" />
              <span>200.00</span>
              <span className="ml-1 text-sm font-normal text-gray-500">/hour</span>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Book Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
