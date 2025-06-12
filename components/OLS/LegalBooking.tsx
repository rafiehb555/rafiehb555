import React, { useState } from 'react';
import { FiCalendar, FiClock, FiFileText, FiCreditCard, FiCheck } from 'react-icons/fi';

interface BookingStep {
  id: number;
  title: string;
  icon: React.ReactElement;
}

interface BookingForm {
  caseType: string;
  description: string;
  date: string;
  time: string;
  paymentMethod: string;
}

const bookingSteps: BookingStep[] = [
  {
    id: 1,
    title: 'Case Details',
    icon: <FiFileText className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Select Time',
    icon: <FiClock className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Payment',
    icon: <FiCreditCard className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Confirmation',
    icon: <FiCheck className="w-5 h-5" />,
  },
];

const caseTypes = [
  'Family Law',
  'Criminal Law',
  'Corporate Law',
  'Real Estate',
  'Intellectual Property',
  'Tax Law',
  'Other',
];

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const paymentMethods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'];

export default function LegalBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingForm>({
    caseType: '',
    description: '',
    date: '',
    time: '',
    paymentMethod: '',
  });

  const handleInputChange = (field: keyof BookingForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Handle booking submission
    console.log('Booking submitted:', formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Book Legal Consultation</h2>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {bookingSteps.map(step => (
          <div
            key={step.id}
            className={`flex items-center ${step.id !== bookingSteps.length ? 'flex-1' : ''}`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.icon}
            </div>
            <div
              className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step.title}
            </div>
            {step.id !== bookingSteps.length && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="mt-8">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Case Type</label>
              <select
                value={formData.caseType}
                onChange={e => handleInputChange('caseType', e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select case type</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                rows={4}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Briefly describe your legal matter..."
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => handleInputChange('date', e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Slot</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => handleInputChange('time', slot)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      formData.time === slot
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <div className="mt-2 space-y-2">
                {paymentMethods.map(method => (
                  <button
                    key={method}
                    onClick={() => handleInputChange('paymentMethod', method)}
                    className={`w-full px-4 py-3 rounded-lg text-left ${
                      formData.paymentMethod === method
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <FiCreditCard className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="font-medium">{method}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center space-y-4">
            <FiCheck className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900">Booking Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p>
                <span className="font-medium">Case Type:</span> {formData.caseType}
              </p>
              <p>
                <span className="font-medium">Date:</span> {formData.date}
              </p>
              <p>
                <span className="font-medium">Time:</span> {formData.time}
              </p>
              <p>
                <span className="font-medium">Payment:</span> {formData.paymentMethod}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={currentStep === 4 ? handleSubmit : handleNext}
          className={`px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors ${
            currentStep === 1 ? 'ml-auto' : ''
          }`}
        >
          {currentStep === 4 ? 'Confirm Booking' : 'Next'}
        </button>
      </div>
    </div>
  );
}
