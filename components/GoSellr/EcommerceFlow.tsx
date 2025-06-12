import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { FranchiseType } from './FranchiseTypes';

interface EcommerceFlowProps {
  franchiseType: FranchiseType;
  onComplete: () => void;
}

type FlowStep = 'setup' | 'products' | 'payment' | 'shipping' | 'complete';

const flowSteps: { id: FlowStep; title: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'setup',
    title: 'Store Setup',
    description: 'Configure your store settings and preferences',
    icon: <FiShoppingCart className="w-6 h-6" />,
  },
  {
    id: 'products',
    title: 'Product Selection',
    description: 'Choose products for your store',
    icon: <FiPackage className="w-6 h-6" />,
  },
  {
    id: 'payment',
    title: 'Payment Setup',
    description: 'Configure payment methods and pricing',
    icon: <FiCheckCircle className="w-6 h-6" />,
  },
  {
    id: 'shipping',
    title: 'Shipping Configuration',
    description: 'Set up shipping methods and rates',
    icon: <FiTruck className="w-6 h-6" />,
  },
  {
    id: 'complete',
    title: 'Ready to Launch',
    description: 'Review and launch your store',
    icon: <FiCheckCircle className="w-6 h-6" />,
  },
];

export default function EcommerceFlow({ franchiseType, onComplete }: EcommerceFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('setup');
  const [progress, setProgress] = useState(0);

  const handleNext = () => {
    const currentIndex = flowSteps.findIndex(step => step.id === currentStep);
    if (currentIndex < flowSteps.length - 1) {
      setCurrentStep(flowSteps[currentIndex + 1].id);
      setProgress(((currentIndex + 2) / flowSteps.length) * 100);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    const currentIndex = flowSteps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(flowSteps[currentIndex - 1].id);
      setProgress((currentIndex / flowSteps.length) * 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between mb-8">
        {flowSteps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = flowSteps.findIndex(s => s.id === currentStep) > index;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isActive ? 'bg-blue-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                {step.icon}
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* Current Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {flowSteps.find(step => step.id === currentStep)?.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {flowSteps.find(step => step.id === currentStep)?.description}
        </p>

        {/* Step-specific content would go here */}
        <div className="min-h-[200px] flex items-center justify-center text-gray-500">
          {franchiseType} store setup content for {currentStep} step
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 'setup'}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentStep === 'setup'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {currentStep === 'complete' ? 'Launch Store' : 'Next Step'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
