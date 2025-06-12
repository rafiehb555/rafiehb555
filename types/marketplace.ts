export type SQLLevel = 'free' | 'basic' | 'normal' | 'high' | 'vip';
export type ServiceStatus = 'live' | 'upcoming' | 'maintenance';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: ServiceStatus;
  sqlLevel: SQLLevel;
  region: string;
  features: string[];
}
