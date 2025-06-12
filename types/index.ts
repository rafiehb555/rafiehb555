export interface Module {
  name: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

export interface NavigationItem {
  name: string;
  path: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  modules: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  module: string;
  status: 'active' | 'maintenance' | 'beta';
  features: string[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}
