import React, { useState } from 'react';
import { FiCalendar, FiUsers, FiCreditCard, FiCheck } from 'react-icons/fi';

interface BookingStep {
  id: number;
  title: string;
  icon: React.ReactNode;
}

const bookingSteps: BookingStep[] = [
  { id: 1, title: 'Select Route', icon: <FiCalendar className="w-5 h-5" /> },
  { id: 2, title: 'Choose Seats', icon: <FiUsers className="w-5 h-5" /> },
  { id: 3, title: 'Payment', icon: <FiCreditCard className="w-5 h-5" /> },
  { id: 4, title: 'Confirmation', icon: <FiCheck className="w-5 h-5" /> },
];

interface BookingForm {
  from: string;
  to: string;
  date: string;
  seats: number;
  paymentMethod: 'wallet' | 'card';
}

export default function BookTicketForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingForm>({
    from: '',
    to: '',
    date: '',
    seats: 1,
    paymentMethod: 'wallet',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < bookingSteps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking submission
    console.log('Booking submitted:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {bookingSteps.map(step => (
          <div
            key={step.id}
            className={`flex items-center ${
              step.id < currentStep
                ? 'text-green-600'
                : step.id === currentStep
                  ? 'text-blue-600'
                  : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.id <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {step.icon}
            </div>
            <span className="ml-2 text-sm font-medium">{step.title}</span>
            {step.id < bookingSteps.length && (
              <div className="w-16 h-0.5 mx-4 bg-gray-200">
                <div
                  className={`h-full ${step.id < currentStep ? 'bg-green-600' : 'bg-gray-200'}`}
                  style={{ width: step.id < currentStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                From
              </label>
              <input
                type="text"
                id="from"
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                To
              </label>
              <input
                type="text"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700">
                Number of Seats
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                min="1"
                max="10"
                value={formData.seats}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Seat Selection UI would go here */}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={formData.paymentMethod === 'wallet'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Pay with EHB Wallet</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Credit/Debit Card</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-800">Booking Summary</h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">From:</span> {formData.from}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">To:</span> {formData.to}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {formData.date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Seats:</span> {formData.seats}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Payment:</span> {formData.paymentMethod}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back
            </button>
          )}
          {currentStep < bookingSteps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Confirm Booking
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
