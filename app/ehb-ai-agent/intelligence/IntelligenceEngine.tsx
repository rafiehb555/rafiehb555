import React, { useEffect } from 'react';
import { useAIAgent } from '../context/AIAgentContext';
import { MissingDataResolver } from './MissingDataResolver';
import { ConflictManager } from './ConflictManager';
import { TaskPrioritizer } from './TaskPrioritizer';

export const IntelligenceEngine: React.FC = () => {
  const { state, dispatch } = useAIAgent();

  // Assign IQ based on agent performance (simple example)
  useEffect(() => {
    Object.entries(state.agentControls).forEach(([agentId, control]) => {
      const completed = control.tasks.filter(t => t.status === 'completed').length;
      const failed = control.tasks.filter(t => t.status === 'failed').length;
      const IQ = 100 + completed * 10 - failed * 20;
      dispatch({
        type: 'ADD_LOG',
        payload: {
          module: agentId,
          message: {
            id: Date.now().toString(),
            role: 'system',
            type: 'log',
            content: `Agent ${agentId} IQ: ${IQ}`,
            timestamp: new Date(),
            severity: 'info',
          },
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.agentControls]);

  return (
    <div className="hidden">
      <MissingDataResolver />
      <ConflictManager />
      <TaskPrioritizer />
    </div>
  );
}; 