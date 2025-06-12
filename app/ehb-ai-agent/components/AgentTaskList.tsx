import React from 'react';
import { useAIAgent } from '../context/AIAgentContext';

const AGENTS = [
  { id: 'dev', label: 'Dev Agent' },
  { id: 'api', label: 'API Agent' },
  { id: 'data', label: 'Data Agent' },
  { id: 'security', label: 'Security Agent' },
  { id: 'performance', label: 'Performance Agent' },
  { id: 'system', label: 'System Agent' },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'assigned': return 'bg-blue-200';
    case 'in-progress': return 'bg-yellow-200';
    case 'completed': return 'bg-green-200';
    case 'failed': return 'bg-red-200';
    default: return 'bg-gray-100';
  }
};

export const AgentTaskList: React.FC = () => {
  const { state } = useAIAgent();
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Agent Task List</h2>
      {AGENTS.map(agent => (
        <div key={agent.id} className="mb-4">
          <div className="font-medium mb-1">{agent.label}</div>
          <ul className="space-y-1">
            {(state.agentControls[agent.id]?.tasks || []).length === 0 && (
              <li className="text-xs text-gray-400">No tasks assigned.</li>
            )}
            {(state.agentControls[agent.id]?.tasks || []).map(task => (
              <li key={task.id} className={`flex items-center space-x-2 p-1 rounded ${statusColor(task.status)}`}>
                <span className="text-xs font-mono">{task.timestamp.toLocaleString()}</span>
                <span className="text-xs">{task.description}</span>
                <span className="text-xs font-bold">[{task.status}]</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}; 