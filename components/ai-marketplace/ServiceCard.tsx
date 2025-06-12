import React from 'react';
import { Service } from '@/types/marketplace';
import ComingSoonTag from './ComingSoonTag';
import SQLLevelTag from './SQLLevelTag';
import { useRouter } from 'next/router';

interface ServiceCardProps {
  service: Service;
  userSqlLevel: string;
}

export default function ServiceCard({ service, userSqlLevel }: ServiceCardProps) {
  const router = useRouter();
  const isClickable = service.status === 'live';

  const handleClick = () => {
    if (isClickable) {
      router.push(`/services/${service.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        bg-white rounded-lg shadow-sm p-6
        ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : 'cursor-not-allowed opacity-75'}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{service.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        </div>
        {service.status === 'upcoming' && <ComingSoonTag />}
      </div>

      <div className="space-y-3">
        <SQLLevelTag level={service.sqlLevel} />

        <div className="flex flex-wrap gap-2">
          {service.features.map((feature, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
