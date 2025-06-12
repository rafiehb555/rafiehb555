import React from 'react';
import { Service, SQLLevel } from '@/types/marketplace';
import ServiceCard from './ServiceCard';

interface CategoryGridProps {
  services: Service[];
  userSqlLevel: SQLLevel;
}

export default function CategoryGrid({ services, userSqlLevel }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(service => (
        <ServiceCard key={service.id} service={service} userSqlLevel={userSqlLevel} />
      ))}
    </div>
  );
}
