import React, { useState, useEffect } from 'react';
import { EHBDevAgent } from './EHBDevAgent';
import { APIAgent } from './agents/APIAgent';
import { DataCollectorAgent } from './agents/DataCollectorAgent';
import { SecurityAgent } from './agents/SecurityAgent';
import { PerformanceAgent } from './agents/PerformanceAgent';
import { AgentLogPanel } from './AgentLogPanel';
import SystemMonitor from './visualizations/SystemMonitor';
import AdvancedVisualizations from './visualizations/AdvancedVisualizations';
import { MetricsService } from '../services/metricsService';
import { FiCheckCircle, FiAlertCircle, FiClock, FiPlay, FiPause } from 'react-icons/fi';
import { roadmapAgentMap } from '../../ehb-dashboard/roadmap/roadmapAgentMap';
import { GitService } from '../services/gitService';
import { AgentService } from '../services/agentService';

type Tab = 'tools' | 'dev' | 'api' | 'data' | 'security' | 'performance' | 'logs' | 'system' | 'advanced';

interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'active' | 'error';
  assignedModule?: string;
  lastUpdate: Date;
}

const AIAgentTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tools');
  const [selectedModule, setSelectedModule] = useState<'security' | 'performance' | 'system'>('system');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isPaused, setIsPaused] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [lastPushTime, setLastPushTime] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<{
    isRunning: boolean;
    currentTask: string | null;
    queueLength: number;
  }>({ isRunning: false, currentTask: null, queueLength: 0 });
  const [metricsData, setMetricsData] = useState<any>(null);
  const metricsService = MetricsService.getInstance();

  useEffect(() => {
    // Check agent status periodically
    const statusInterval = setInterval(() => {
      const agentService = AgentService.getInstance();
      setAgentStatus(agentService.getStatus());
    }, 5000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    // Update metrics data when module or time range changes
    const data = metricsService.getMetrics(selectedModule, timeRange);
    setMetricsData(data);
  }, [selectedModule, timeRange]);

  const handleExport = () => {
    const data = metricsService.exportMetrics(selectedModule, timeRange);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedModule}-metrics-${timeRange}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          metricsService.importMetrics(selectedModule, data);
        } catch (error) {
          console.error('Error importing metrics:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGitPush = async () => {
    setIsPushing(true);
    try {
      const gitService = GitService.getInstance();
      const hasChanges = await gitService.hasChanges();
      
      if (hasChanges) {
        const success = await gitService.commitAndPush('Manual push from AI Agent Tools');
        if (success) {
          setLastPushTime(new Date().toLocaleTimeString());
        }
      } else {
        console.log('No changes to push');
      }
    } catch (error) {
      console.error('Error pushing changes:', error);
    } finally {
      setIsPushing(false);
    }
  };
  
  const handleStartAgent = async () => {
    const agentService = AgentService.getInstance();
    await agentService.start();
    setAgentStatus(agentService.getStatus());
  };
  
  const handleStopAgent = async () => {
    const agentService = AgentService.getInstance();
    await agentService.stop();
    setAgentStatus(agentService.getStatus());
  };
  
  const handleAddTask = async () => {
    const agentService = AgentService.getInstance();
    await agentService.addTask({
      type: 'monitoring',
      description: 'Check system health',
      priority: 'medium',
      data: {}
    });
    setAgentStatus(agentService.getStatus());
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsPaused(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tools':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">AI Agent Tools</h2>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center space-x-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {isPaused ? <FiPlay /> : <FiPause />}
                <span>{isPaused ? 'Resume' : 'Pause'} Updates</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Agent status cards will be rendered here */}
              <div className="p-4 border rounded-md">
                <h3 className="font-medium">Agent Status Dashboard</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {agentStatus.isRunning 
                    ? `Agent is running. Tasks in queue: ${agentStatus.queueLength}` 
                    : "Agent is not running. Click 'Start Agent' to begin processing."}
                </p>
                {agentStatus.currentTask && (
                  <p className="text-sm text-blue-500 mt-1">
                    Currently working on: {agentStatus.currentTask}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 'dev':
        return <EHBDevAgent />;
      case 'api':
        return <APIAgent />;
      case 'data':
        return <DataCollectorAgent />;
      case 'security':
        return <SecurityAgent />;
      case 'performance':
        return <PerformanceAgent />;
      case 'logs':
        return <AgentLogPanel />;
      case 'system':
        return <SystemMonitor />;
      case 'advanced':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {['security', 'performance', 'system'].map((module) => (
                  <button
                    key={module}
                    onClick={() => setSelectedModule(module as 'security' | 'performance' | 'system')}
                    className={`px-3 py-1 rounded ${
                      selectedModule === module
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {module.charAt(0).toUpperCase() + module.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                {['1h', '24h', '7d', '30d'].map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeRange(time as '1h' | '24h' | '7d' | '30d')}
                    className={`px-2 py-1 text-sm rounded ${
                      timeRange === time
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Git and Agent Controls */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Git & Agent Controls</h3>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={handleGitPush}
                      disabled={isPushing}
                      className={`px-3 py-1 text-xs rounded-md ${
                        isPushing 
                          ? 'bg-gray-300 text-gray-500' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isPushing ? 'Pushing...' : 'Push Changes'}
                    </button>
                    {lastPushTime && (
                      <span className="text-xs text-gray-500 self-center">
                        Last push: {lastPushTime}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Agent Status</h3>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={agentStatus.isRunning ? handleStopAgent : handleStartAgent}
                      className={`px-3 py-1 text-xs rounded-md ${
                        agentStatus.isRunning 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {agentStatus.isRunning ? 'Stop Agent' : 'Start Agent'}
                    </button>
                    <button
                      onClick={handleAddTask}
                      disabled={!agentStatus.isRunning}
                      className={`px-3 py-1 text-xs rounded-md ${
                        !agentStatus.isRunning 
                          ? 'bg-gray-300 text-gray-500' 
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      Add Test Task
                    </button>
                    <span className="text-xs text-gray-500 self-center">
                      Queue: {agentStatus.queueLength}
                    </span>
                    {agentStatus.currentTask && (
                      <span className="text-xs text-blue-500 self-center">
                        Working: {agentStatus.currentTask}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Chart */}
            <div className="mt-4">
              <AdvancedVisualizations module={selectedModule} timeRange={timeRange} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <nav className="bg-white rounded-lg shadow mb-4">
          <div className="flex space-x-4 p-4">
            {[
              { id: 'tools', label: 'Tools' },
              { id: 'dev', label: 'Dev' },
              { id: 'api', label: 'API' },
              { id: 'data', label: 'Data' },
              { id: 'security', label: 'Security' },
              { id: 'performance', label: 'Performance' },
              { id: 'logs', label: 'Logs' },
              { id: 'system', label: 'System' },
              { id: 'advanced', label: 'Advanced' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as Tab)}
                className={`px-3 py-2 rounded ${
                  activeTab === id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <main className="bg-white rounded-lg shadow p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AIAgentTools; 