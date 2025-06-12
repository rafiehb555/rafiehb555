import { Service } from '@/types/marketplace';

const mockServices: Service[] = [
  {
    id: 'hps',
    name: 'HPS – Education',
    description: 'Education, Courses, Exams',
    icon: '📚',
    status: 'live',
    sqlLevel: 'basic',
    region: 'global',
    features: ['Course Catalog', 'Exam Platform', 'Progress Tracking'],
  },
  {
    id: 'wms',
    name: 'WMS – Health',
    description: 'Doctor Booking & Medical Flow',
    icon: '🏥',
    status: 'upcoming',
    sqlLevel: 'normal',
    region: 'global',
    features: ['Doctor Profiles', 'Appointment Booking', 'Medical Records'],
  },
  {
    id: 'ols',
    name: 'OLS – Law',
    description: 'Lawyer Hiring & Legal Consultations',
    icon: '⚖️',
    status: 'live',
    sqlLevel: 'high',
    region: 'global',
    features: ['Lawyer Profiles', 'Case Management', 'Document Upload'],
  },
  {
    id: 'gosellr',
    name: 'GoSellr – E-Commerce',
    description: 'E-Commerce & Delivery Flow',
    icon: '🛒',
    status: 'live',
    sqlLevel: 'vip',
    region: 'global',
    features: ['Product Management', 'Order Processing', 'Delivery Tracking'],
  },
  {
    id: 'ehb-tube',
    name: 'EHB Tube – Media',
    description: 'Video Content Platform',
    icon: '📺',
    status: 'upcoming',
    sqlLevel: 'basic',
    region: 'global',
    features: ['Video Upload', 'Content Creation', 'Monetization'],
  },
  {
    id: 'ehb-ads',
    name: 'EHB Ads – Classifieds',
    description: 'Advertisement Platform',
    icon: '📰',
    status: 'live',
    sqlLevel: 'normal',
    region: 'global',
    features: ['Ad Creation', 'Targeting', 'Analytics'],
  },
];

export async function fetchServices(params: {
  region?: string;
  sqlLevel?: string;
  search?: string;
}): Promise<Service[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  let filteredServices = [...mockServices];

  // Apply filters
  if (params.region) {
    filteredServices = filteredServices.filter(service => service.region === params.region);
  }

  if (params.sqlLevel) {
    filteredServices = filteredServices.filter(service => service.sqlLevel === params.sqlLevel);
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredServices = filteredServices.filter(
      service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
    );
  }

  return filteredServices;
}
