import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MarketplaceHeader from '@/components/ai-marketplace/MarketplaceHeader';
import CategoryGrid from '@/components/ai-marketplace/CategoryGrid';
import { fetchServices } from '@/lib/ai-marketplace/fetchServices';
import { Service, SQLLevel } from '@/types/marketplace';
import { FiAlertCircle } from 'react-icons/fi';

export default function EHBMarketplace() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    region: 'global',
    sqlLevel: 'free' as SQLLevel,
  });

  useEffect(() => {
    loadServices();
  }, [filters]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchServices(filters);
      setServices(data);
    } catch (err) {
      setError('Failed to load services. Please try again later.');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleRegionChange = (region: string) => {
    setFilters(prev => ({ ...prev, region }));
  };

  const handleSqlLevelChange = (level: SQLLevel) => {
    setFilters(prev => ({ ...prev, sqlLevel: level }));
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <FiAlertCircle className="text-red-500 text-xl" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <MarketplaceHeader
        onSearch={handleSearch}
        onRegionChange={handleRegionChange}
        onSqlLevelChange={handleSqlLevelChange}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <CategoryGrid services={services} userSqlLevel={filters.sqlLevel} />
      )}
    </div>
  );
}
