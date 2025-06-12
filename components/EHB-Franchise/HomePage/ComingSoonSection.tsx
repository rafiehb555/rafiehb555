import React from 'react';
import { ServiceCategory } from '../FranchiseUtils/FranchiseTypes';

interface ComingSoonService {
  category: ServiceCategory;
  title: string;
  description: string;
  expectedLaunch: string;
  features: string[];
}

export const ComingSoonSection: React.FC = () => {
  const comingSoonServices: ComingSoonService[] = [
    {
      category: ServiceCategory.HEALTH,
      title: 'Health Services Franchise',
      description: 'Comprehensive healthcare and medical services franchise network',
      expectedLaunch: 'Q3 2024',
      features: [
        'Medical Consultation',
        'Pharmacy Services',
        'Health Monitoring',
        'Emergency Response',
      ],
    },
    {
      category: ServiceCategory.LAW,
      title: 'Legal Services Franchise',
      description: 'Professional legal consultation and services franchise',
      expectedLaunch: 'Q4 2024',
      features: [
        'Legal Consultation',
        'Document Preparation',
        'Court Representation',
        'Legal Education',
      ],
    },
    {
      category: ServiceCategory.EDUCATION,
      title: 'Education Services Franchise',
      description: 'Educational services and learning center franchise',
      expectedLaunch: 'Q1 2025',
      features: [
        'Online Learning',
        'Tutoring Services',
        'Skill Development',
        'Certification Programs',
      ],
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Coming Soon: New Franchise Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comingSoonServices.map(service => (
            <div key={service.category} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {service.expectedLaunch}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Notify Me When Available
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
