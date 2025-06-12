export interface MetricsData {
  timestamp: Date;
  module: string;
  timeRange: string;
  data: {
    [key: string]: any;
  };
} 