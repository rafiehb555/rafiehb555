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

function downloadReport(agentId: string, state: any) {
  const agent = state.agentControls[agentId];
  const data = {
    agentId,
    status: agent.status,
    tasks: agent.tasks,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${agentId}-dev-report.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const AgentControlPanel: React.FC = () => {
  const { state, dispatch } = useAIAgent();
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Agent Control Panel</h2>
      <div className="flex space-x-2 mb-4">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded"
          onClick={() => dispatch({ type: 'START_ALL_AGENTS' })}
        >Start All</button>
        <button
          className="px-3 py-1 bg-yellow-500 text-white rounded"
          onClick={() => dispatch({ type: 'PAUSE_ALL_AGENTS' })}
        >Pause All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AGENTS.map(agent => (
          <div key={agent.id} className="flex flex-col items-start p-2 border rounded">
            <div className="font-medium mb-1">{agent.label}</div>
            <div className="mb-2 text-sm">Status: <span className="font-bold">{state.agentControls[agent.id]?.status || 'idle'}</span></div>
            <div className="flex space-x-2 mb-2">
              <button
                className="px-2 py-1 bg-green-500 text-white rounded"
                onClick={() => dispatch({ type: 'START_AGENT', agentId: agent.id })}
              >Start</button>
              <button
                className="px-2 py-1 bg-yellow-500 text-white rounded"
                onClick={() => dispatch({ type: 'PAUSE_AGENT', agentId: agent.id })}
              >Pause</button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => dispatch({ type: 'RESET_AGENT', agentId: agent.id })}
              >Reset</button>
            </div>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
              onClick={() => downloadReport(agent.id, state)}
            >Download Report</button>
          </div>
        ))}
      </div>
    </div>
  );
}; 