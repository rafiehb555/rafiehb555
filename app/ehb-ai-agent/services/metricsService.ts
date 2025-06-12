import { performance } from 'perf_hooks';
import { Message } from '../context/AIAgentContext';
import { MetricsData } from '../types/metrics';

interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
    frequency: number;
    cores: {
      [key: string]: {
        usage: number;
        temperature: number;
        frequency: number;
      };
    };
  };
  memory: {
    total: number;
    used: number;
    free: number;
    swap: {
      total: number;
      used: number;
      free: number;
    };
  };
  disk: {
    total: number;
    used: number;
    free: number;
    io: {
      read: number;
      write: number;
      readTime: number;
      writeTime: number;
    };
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    errors: number;
    connections: number;
    interfaces: {
      [key: string]: {
        bytesIn: number;
        bytesOut: number;
        packetsIn: number;
        packetsOut: number;
        errors: number;
      };
    };
  };
  processes: {
    total: number;
    running: number;
    blocked: number;
    zombie: number;
    top: Array<{
      pid: number;
      name: string;
      cpu: number;
      memory: number;
      state: string;
    }>;
  };
}

interface SecurityMetrics {
  alerts: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    byType: {
      [key: string]: number;
    };
  };
  threats: {
    active: number;
    blocked: number;
    suspicious: number;
    byType: {
      [key: string]: number;
    };
  };
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    byComponent: {
      [key: string]: number;
    };
  };
  incidents: {
    total: number;
    open: number;
    resolved: number;
    bySeverity: {
      [key: string]: number;
    };
  };
  compliance: {
    score: number;
    violations: number;
    byStandard: {
      [key: string]: {
        score: number;
        violations: number;
      };
    };
  };
}

interface PerformanceMetrics {
  responseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  throughput: number;
  latency: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
  cache: {
    hitRate: number;
    missRate: number;
    size: number;
    evictions: number;
  };
  database: {
    connections: number;
    queries: number;
    slowQueries: number;
    deadlocks: number;
  };
  queue: {
    length: number;
    processing: number;
    failed: number;
    retries: number;
  };
  systemMetrics: SystemMetrics;
}

interface MetricsHistory {
  timestamp: Date;
  metrics: SystemMetrics | SecurityMetrics | PerformanceMetrics;
}

export class MetricsService {
  private static instance: MetricsService;
  private metricsHistory: Map<string, MetricsHistory[]>;
  private readonly MAX_HISTORY_LENGTH = 1000;
  private metrics: Map<string, MetricsData> = new Map();

  private constructor() {
    this.metricsHistory = new Map();
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  public async collectSystemMetrics(): Promise<SystemMetrics> {
    try {
      // In a real implementation, this would collect actual system metrics
      // For now, we'll generate realistic mock data
      const cpuUsage = Math.random() * 100;
      const memoryTotal = 16 * 1024 * 1024 * 1024; // 16GB
      const memoryUsed = Math.random() * memoryTotal;
      const diskTotal = 512 * 1024 * 1024 * 1024; // 512GB
      const diskUsed = Math.random() * diskTotal;

      return {
        cpu: {
          usage: cpuUsage,
          temperature: 40 + Math.random() * 30,
          frequency: 2000 + Math.random() * 1000,
          cores: {
            '0': {
              usage: Math.random() * 100,
              temperature: 40 + Math.random() * 20,
              frequency: 2000 + Math.random() * 500
            },
            '1': {
              usage: Math.random() * 100,
              temperature: 40 + Math.random() * 20,
              frequency: 2000 + Math.random() * 500
            }
          }
        },
        memory: {
          total: memoryTotal,
          used: memoryUsed,
          free: memoryTotal - memoryUsed,
          swap: {
            total: 8 * 1024 * 1024 * 1024, // 8GB
            used: Math.random() * 8 * 1024 * 1024 * 1024,
            free: Math.random() * 8 * 1024 * 1024 * 1024
          }
        },
        disk: {
          total: diskTotal,
          used: diskUsed,
          free: diskTotal - diskUsed,
          io: {
            read: Math.random() * 1000,
            write: Math.random() * 1000,
            readTime: Math.random() * 100,
            writeTime: Math.random() * 100
          }
        },
        network: {
          bytesIn: Math.random() * 1000000,
          bytesOut: Math.random() * 1000000,
          packetsIn: Math.random() * 10000,
          packetsOut: Math.random() * 10000,
          errors: Math.random() * 100,
          connections: Math.random() * 1000,
          interfaces: {
            'eth0': {
              bytesIn: Math.random() * 1000000,
              bytesOut: Math.random() * 1000000,
              packetsIn: Math.random() * 10000,
              packetsOut: Math.random() * 10000,
              errors: Math.random() * 100
            }
          }
        },
        processes: {
          total: 100 + Math.floor(Math.random() * 50),
          running: 80 + Math.floor(Math.random() * 20),
          blocked: Math.floor(Math.random() * 5),
          zombie: Math.floor(Math.random() * 2),
          top: [
            {
              pid: 1000 + Math.floor(Math.random() * 1000),
              name: 'node',
              cpu: Math.random() * 100,
              memory: Math.random() * 1024,
              state: 'R'
            },
            {
              pid: 2000 + Math.floor(Math.random() * 1000),
              name: 'nginx',
              cpu: Math.random() * 50,
              memory: Math.random() * 512,
              state: 'S'
            }
          ]
        }
      };
    } catch (error) {
      console.error('Error collecting system metrics:', error);
      throw error;
    }
  }

  public async collectSecurityMetrics(): Promise<SecurityMetrics> {
    try {
      // In a real implementation, this would collect actual security metrics
      // For now, we'll generate realistic mock data
      const totalAlerts = Math.floor(Math.random() * 100);
      const totalThreats = Math.floor(Math.random() * 50);
      const totalVulnerabilities = Math.floor(Math.random() * 200);

      return {
        alerts: {
          total: totalAlerts,
          critical: Math.floor(totalAlerts * 0.1),
          high: Math.floor(totalAlerts * 0.2),
          medium: Math.floor(totalAlerts * 0.4),
          low: Math.floor(totalAlerts * 0.3),
          byType: {
            'authentication': Math.floor(Math.random() * 20),
            'authorization': Math.floor(Math.random() * 15),
            'data_leak': Math.floor(Math.random() * 10),
            'malware': Math.floor(Math.random() * 25),
            'network': Math.floor(Math.random() * 30)
          }
        },
        threats: {
          active: Math.floor(totalThreats * 0.3),
          blocked: Math.floor(totalThreats * 0.7),
          suspicious: Math.floor(Math.random() * 20),
          byType: {
            'brute_force': Math.floor(Math.random() * 10),
            'ddos': Math.floor(Math.random() * 5),
            'injection': Math.floor(Math.random() * 15),
            'malware': Math.floor(Math.random() * 20)
          }
        },
        vulnerabilities: {
          total: totalVulnerabilities,
          critical: Math.floor(totalVulnerabilities * 0.05),
          high: Math.floor(totalVulnerabilities * 0.15),
          medium: Math.floor(totalVulnerabilities * 0.4),
          low: Math.floor(totalVulnerabilities * 0.4),
          byComponent: {
            'api': Math.floor(Math.random() * 50),
            'database': Math.floor(Math.random() * 30),
            'frontend': Math.floor(Math.random() * 40),
            'infrastructure': Math.floor(Math.random() * 60)
          }
        },
        incidents: {
          total: Math.floor(Math.random() * 30),
          open: Math.floor(Math.random() * 10),
          resolved: Math.floor(Math.random() * 20),
          bySeverity: {
            'critical': Math.floor(Math.random() * 5),
            'high': Math.floor(Math.random() * 8),
            'medium': Math.floor(Math.random() * 12),
            'low': Math.floor(Math.random() * 15)
          }
        },
        compliance: {
          score: 70 + Math.random() * 30,
          violations: Math.floor(Math.random() * 20),
          byStandard: {
            'GDPR': {
              score: 70 + Math.random() * 30,
              violations: Math.floor(Math.random() * 10)
            },
            'PCI-DSS': {
              score: 70 + Math.random() * 30,
              violations: Math.floor(Math.random() * 10)
            },
            'ISO27001': {
              score: 70 + Math.random() * 30,
              violations: Math.floor(Math.random() * 10)
            }
          }
        }
      };
    } catch (error) {
      console.error('Error collecting security metrics:', error);
      throw error;
    }
  }

  public async collectPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const systemMetrics = await this.collectSystemMetrics();
      const responseTime = 50 + Math.random() * 200;
      const requestsPerSecond = 100 + Math.random() * 900;
      const errorRate = Math.random() * 5;

      return {
        responseTime,
        requestsPerSecond,
        errorRate,
        throughput: requestsPerSecond * (1 - errorRate / 100),
        latency: {
          p50: responseTime,
          p90: responseTime * 1.5,
          p95: responseTime * 2,
          p99: responseTime * 3
        },
        cache: {
          hitRate: 70 + Math.random() * 30,
          missRate: Math.random() * 30,
          size: Math.random() * 1024 * 1024 * 1024, // Up to 1GB
          evictions: Math.floor(Math.random() * 1000)
        },
        database: {
          connections: 10 + Math.floor(Math.random() * 90),
          queries: 1000 + Math.floor(Math.random() * 9000),
          slowQueries: Math.floor(Math.random() * 100),
          deadlocks: Math.floor(Math.random() * 10)
        },
        queue: {
          length: Math.floor(Math.random() * 1000),
          processing: Math.floor(Math.random() * 100),
          failed: Math.floor(Math.random() * 50),
          retries: Math.floor(Math.random() * 200)
        },
        systemMetrics
      };
    } catch (error) {
      console.error('Error collecting performance metrics:', error);
      throw error;
    }
  }

  public getMetricsHistory(module: 'security' | 'performance' | 'system', timeRange: '1h' | '24h' | '7d' | '30d'): any[] {
    const key = `${module}-${timeRange}`;
    return this.metricsHistory.get(key) || [];
  }

  private addToHistory(module: 'security' | 'performance' | 'system', metrics: any) {
    const now = new Date();
    const history = this.metricsHistory.get(module) || [];
    
    history.push({
      timestamp: now,
      metrics
    });

    // Keep only the last MAX_HISTORY_LENGTH entries
    if (history.length > this.MAX_HISTORY_LENGTH) {
      history.shift();
    }

    this.metricsHistory.set(module, history);
  }

  public async startCollection() {
    setInterval(async () => {
      try {
        const systemMetrics = await this.collectSystemMetrics();
        const securityMetrics = await this.collectSecurityMetrics();
        const performanceMetrics = await this.collectPerformanceMetrics();

        this.addToHistory('system', systemMetrics);
        this.addToHistory('security', securityMetrics);
        this.addToHistory('performance', performanceMetrics);
      } catch (error) {
        console.error('Error in metrics collection:', error);
      }
    }, 5000); // Collect metrics every 5 seconds
  }

  getMetrics(module: string, timeRange: string): MetricsData {
    return this.metrics.get(`${module}-${timeRange}`) || {
      timestamp: new Date(),
      module,
      timeRange,
      data: {}
    };
  }

  updateMetrics(module: string, timeRange: string, data: Partial<MetricsData>): void {
    const key = `${module}-${timeRange}`;
    const existing = this.metrics.get(key) || {
      timestamp: new Date(),
      module,
      timeRange,
      data: {}
    };

    this.metrics.set(key, {
      ...existing,
      ...data,
      timestamp: new Date()
    });
  }

  exportMetrics(module: string, timeRange: string): string {
    const metrics = this.getMetrics(module, timeRange);
    return JSON.stringify(metrics, null, 2);
  }

  importMetrics(module: string, data: string): void {
    try {
      const metrics = JSON.parse(data) as MetricsData;
      this.metrics.set(`${module}-${metrics.timeRange}`, {
        ...metrics,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error importing metrics:', error);
      throw new Error('Invalid metrics data format');
    }
  }
} 