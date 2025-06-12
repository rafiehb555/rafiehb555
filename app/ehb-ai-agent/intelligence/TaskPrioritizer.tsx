import React, { useEffect } from 'react';
import { useAIAgent } from '../context/AIAgentContext';

export const TaskPrioritizer: React.FC = () => {
  const { state, dispatch } = useAIAgent();

  useEffect(() => {
    Object.entries(state.agentControls).forEach(([agentId, control]) => {
      const urgentTasks = control.tasks.filter(t => t.description?.toLowerCase().includes('urgent') && t.status !== 'completed');
      const otherTasks = control.tasks.filter(t => !t.description?.toLowerCase().includes('urgent') && t.status !== 'completed');
      const completedTasks = control.tasks.filter(t => t.status === 'completed');
      const newOrder = [...urgentTasks, ...otherTasks, ...completedTasks];
      if (JSON.stringify(newOrder.map(t => t.id)) !== JSON.stringify(control.tasks.map(t => t.id))) {
        // Reorder tasks by dispatching a RESET_AGENT and re-adding tasks in new order
        dispatch({ type: 'RESET_AGENT', agentId });
        newOrder.forEach(task => {
          dispatch({ type: 'ADD_AGENT_TASK', agentId, task });
        });
        dispatch({
          type: 'ADD_LOG',
          payload: {
            module: agentId,
            message: {
              id: Date.now().toString(),
              role: 'system',
              type: 'log',
              content: `Task queue reprioritized for ${agentId}. Urgent tasks moved to top.`,
              timestamp: new Date(),
              severity: 'info',
            },
          },
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.agentControls]);
  return null;
}; 