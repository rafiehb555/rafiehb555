export interface CompanyInfo {
  name: string;
  description: string;
  foundedYear: number;
  headquarters: string;
  departments: Department[];
  techStack: TechStack[];
}

export interface Department {
  name: string;
  size: number;
}

export interface TechStack {
  name: string;
  version: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'error';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  team: string[];
  dependencies: string[];
  features: Feature[];
  error?: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  team: string[];
  dependencies: string[];
  apiEndpoints?: ApiEndpoint[];
  businessRules?: BusinessRule[];
}

export interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface BusinessRule {
  name: string;
  description: string;
  category: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'milestone' | 'release' | 'deadline';
  status: 'planned' | 'in-progress' | 'completed';
  dependencies: string[];
}

export interface RoadmapStatus {
  overall: 'planned' | 'in-progress' | 'completed';
  modules: {
    completed: number;
    inProgress: number;
    planned: number;
  };
  features: {
    completed: number;
    inProgress: number;
    planned: number;
  };
  timeline: {
    completed: number;
    inProgress: number;
    planned: number;
  };
}

export interface RoadmapData {
  companyInfo: CompanyInfo;
  modules: Module[];
  timeline: TimelineEvent[];
  status: RoadmapStatus;
} 