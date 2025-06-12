import React from 'react';
import { FranchiseType } from '../../../../components/EHB-Franchise/FranchiseUtils/FranchiseTypes';
import { FRANCHISE_TYPES } from '../../../../components/EHB-Franchise/FranchiseUtils/Constants';

interface AreaCheckResponse {
  isAvailable: boolean;
  message: string;
  existingFranchises?: {
    name: string;
    type: string;
    distance: number;
  }[];
}

export default function GoSellrBookingPage() {
  const [step, setStep] = React.useState(1);
  const [selectedArea, setSelectedArea] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState<number | null>(null);
  const [isAreaAvailable, setIsAreaAvailable] = React.useState(false);
  const [areaCheckResult, setAreaCheckResult] = React.useState<AreaCheckResponse | null>(null);
  const [isChecking, setIsChecking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const franchiseLevels = [
    { level: 1, investment: '$50,000', description: 'Basic franchise with essential features' },
    { level: 2, investment: '$60,000', description: 'Enhanced features and support' },
    { level: 3, investment: '$70,000', description: 'Premium features and priority support' },
    { level: 4, investment: '$80,000', description: 'Advanced features and dedicated support' },
    { level: 5, investment: '$90,000', description: 'Enterprise features and 24/7 support' },
  ];

  const handleAreaCheck = async () => {
    try {
      setIsChecking(true);
      setError(null);

      const response = await fetch('/api/franchise/area-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          area: selectedArea,
          serviceCategory: 'GOSELLR',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check area availability');
      }

      const result: AreaCheckResponse = await response.json();
      setAreaCheckResult(result);
      setIsAreaAvailable(result.isAvailable);

      if (result.isAvailable) {
        setStep(2);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level);
    setStep(3);
  };

  const handleSubmit = async () => {
    // TODO: Implement actual booking submission
    console.log('Booking submitted:', {
      area: selectedArea,
      level: selectedLevel,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(stepNumber => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  stepNumber < step ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    stepNumber <= step
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      stepNumber < step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Area Check</span>
            <span className="text-sm text-gray-600">Select Level</span>
            <span className="text-sm text-gray-600">Review & Submit</span>
          </div>
        </div>

        {/* Step 1: Area Check */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Check Area Availability</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  Enter Your Area
                </label>
                <input
                  type="text"
                  id="area"
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your city or area"
                />
              </div>
              <button
                onClick={handleAreaCheck}
                disabled={!selectedArea || isChecking}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isChecking ? 'Checking...' : 'Check Availability'}
              </button>

              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

              {areaCheckResult && !isAreaAvailable && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">Area Not Available</h3>
                  <p className="text-yellow-700 mb-4">{areaCheckResult.message}</p>
                  {areaCheckResult.existingFranchises && (
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-2">
                        Existing Franchises Nearby:
                      </h4>
                      <ul className="space-y-2">
                        {areaCheckResult.existingFranchises.map(franchise => (
                          <li key={franchise.name} className="text-yellow-700">
                            {franchise.name} ({franchise.type}) - {franchise.distance}km away
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Level Selection */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Franchise Level</h2>
            <div className="space-y-4">
              {franchiseLevels.map(level => (
                <div
                  key={level.level}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedLevel === level.level
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                  onClick={() => handleLevelSelect(level.level)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Level {level.level}</h3>
                      <p className="text-gray-600">{level.description}</p>
                    </div>
                    <div className="text-blue-600 font-semibold">{level.investment}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Review Your Selection</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Selected Area</h3>
                <p className="text-gray-600">{selectedArea}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Selected Franchise Level</h3>
                <p className="text-gray-600">
                  Level {selectedLevel} -{' '}
                  {franchiseLevels.find(l => l.level === selectedLevel)?.investment}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Next Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Review and sign the franchise agreement</li>
                  <li>Complete the payment process</li>
                  <li>Schedule your onboarding session</li>
                </ul>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
