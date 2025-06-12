import React, { useEffect } from 'react';
import { useAIAgent } from '../context/AIAgentContext';

export const ConflictManager: React.FC = () => {
  const { state, dispatch } = useAIAgent();

  useEffect(() => {
    const taskMap: Record<string, string[]> = {};
    Object.entries(state.agentControls).forEach(([agentId, control]) => {
      control.tasks.forEach(task => {
        if (task.description) {
          if (!taskMap[task.description]) taskMap[task.description] = [];
          taskMap[task.description].push(agentId);
        }
      });
    });
    Object.entries(taskMap).forEach(([desc, agents]) => {
      if (agents.length > 1) {
        agents.forEach(agentId => {
          dispatch({
            type: 'ADD_LOG',
            payload: {
              module: agentId,
              message: {
                id: Date.now().toString(),
                role: 'system',
                type: 'alert',
                content: `Conflict: Task "${desc}" assigned to multiple agents (${agents.join(', ')}).`,
                timestamp: new Date(),
                severity: 'warning',
              },
            },
          });
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.agentControls]);
  return null;
}; 