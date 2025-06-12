import React, { useEffect } from 'react';
import { AgentControlPanel } from './components/AgentControlPanel';
import { AgentStatusBar } from './components/AgentStatusBar';
import { AgentTaskList } from './components/AgentTaskList';
import { AIAgentChat } from './components/AIAgentChat';
import { AgentLogPanel } from './components/AgentLogPanel';
import { EHBDevAgent } from './components/EHBDevAgent';
import { useAIAgent } from './context/AIAgentContext';
import { IntelligenceEngine } from './intelligence/IntelligenceEngine';

const AGENTS = [
  { id: 'dev', label: 'Dev Agent' },
  { id: 'api', label: 'API Agent' },
  { id: 'data', label: 'Data Agent' },
  { id: 'security', label: 'Security Agent' },
  { id: 'performance', label: 'Performance Agent' },
  { id: 'system', label: 'System Agent' },
];

const AIAgentPage: React.FC = () => {
  const { state, dispatch } = useAIAgent();

  useEffect(() => {
    AGENTS.forEach(agent => {
      const status = state.agentControls[agent.id]?.status;
      if (status === 'error') {
        setTimeout(() => {
          dispatch({ type: 'START_AGENT', agentId: agent.id });
          dispatch({
            type: 'ADD_LOG',
            payload: {
              module: agent.id,
              message: {
                id: Date.now().toString(),
                role: 'system',
                type: 'log',
                content: `Agent ${agent.label} auto-restarted after error.`,
                timestamp: new Date(),
                severity: 'info',
              },
            },
          });
        }, 2000);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.agentControls]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <IntelligenceEngine />
      <div className="max-w-7xl mx-auto space-y-4">
        <AgentControlPanel />
        <AgentStatusBar />
        <AgentTaskList />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <AIAgentChat />
            <AgentLogPanel />
          </div>
          <div>
            <EHBDevAgent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentPage; 