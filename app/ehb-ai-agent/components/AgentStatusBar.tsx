import React from 'react';
import { useAIAgent } from '../context/AIAgentContext';

const AGENTS = [
  { id: 'dev', label: 'Dev' },
  { id: 'api', label: 'API' },
  { id: 'data', label: 'Data' },
  { id: 'security', label: 'Security' },
  { id: 'performance', label: 'Performance' },
  { id: 'system', label: 'System' },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    case 'paused': return 'bg-yellow-400';
    case 'complete': return 'bg-purple-500';
    default: return 'bg-gray-300';
  }
};

export const AgentStatusBar: React.FC = () => {
  const { state } = useAIAgent();
  return (
    <div className="flex space-x-4 items-center mb-4">
      {AGENTS.map(agent => (
        <div key={agent.id} className="flex items-center space-x-1">
          <span className={`inline-block w-3 h-3 rounded-full ${statusColor(state.agentControls[agent.id]?.status)}`}></span>
          <span className="text-xs font-medium">{agent.label}</span>
        </div>
      ))}
    </div>
  );
}; 