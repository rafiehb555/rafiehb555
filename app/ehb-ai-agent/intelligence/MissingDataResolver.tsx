import React, { useEffect } from 'react';
import { useAIAgent } from '../context/AIAgentContext';

export const MissingDataResolver: React.FC = () => {
  const { state, dispatch } = useAIAgent();

  useEffect(() => {
    Object.entries(state.agentControls).forEach(([agentId, control]) => {
      control.tasks.forEach(task => {
        if (!task.description || task.description.trim() === '') {
          dispatch({
            type: 'ADD_LOG',
            payload: {
              module: agentId,
              message: {
                id: Date.now().toString(),
                role: 'system',
                type: 'alert',
                content: `Agent ${agentId} has a task with missing description. Please provide details.`,
                timestamp: new Date(),
                severity: 'warning',
              },
            },
          });
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.agentControls]);
  return null;
}; 