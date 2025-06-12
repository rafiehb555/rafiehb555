import React, { createContext, useContext, useReducer } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  severity?: 'info' | 'warning' | 'error' | 'success';
  type?: 'log' | 'alert' | 'notification';
  metadata?: {
    source?: string;
    module?: string;
    action?: string;
    [key: string]: any;
  };
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'code' | 'data' | 'api' | 'system';
  status: 'idle' | 'processing' | 'error' | 'success';
  lastUsed?: Date;
  metadata?: {
    version?: string;
    dependencies?: string[];
    [key: string]: any;
  };
}

export type AgentStatus = 'idle' | 'active' | 'paused' | 'error' | 'complete';

export interface AgentTask {
  id: string;
  agentId: string;
  description: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'failed';
  timestamp: Date;
}

export interface AgentControl {
  status: AgentStatus;
  tasks: AgentTask[];
}

export interface AIAgentState {
  messages: Message[];
  tools: Tool[];
  isProcessing: boolean;
  selectedTool: string | null;
  activeModules: {
    [key: string]: {
      status: 'idle' | 'processing' | 'error' | 'success';
      progress: number;
      lastUpdated: Date;
    };
  };
  logs: {
    [key: string]: {
      messages: Message[];
      lastUpdated: Date;
    };
  };
  agentControls: Record<string, AgentControl>;
}

export type AIAgentAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SELECT_TOOL'; payload: string }
  | { type: 'TOGGLE_TOOL'; payload: string }
  | { type: 'CLEAR_CHAT' }
  | { type: 'UPDATE_MODULE_STATUS'; payload: { module: string; status: string; progress: number } }
  | { type: 'ADD_LOG'; payload: { module: string; message: Message } }
  | { type: 'START_AGENT'; agentId: string }
  | { type: 'PAUSE_AGENT'; agentId: string }
  | { type: 'RESET_AGENT'; agentId: string }
  | { type: 'UPDATE_AGENT_STATUS'; agentId: string; status: AgentStatus }
  | { type: 'ADD_AGENT_TASK'; agentId: string; task: AgentTask }
  | { type: 'UPDATE_AGENT_TASK_STATUS'; agentId: string; taskId: string; status: AgentTask['status'] }
  | { type: 'START_ALL_AGENTS' }
  | { type: 'PAUSE_ALL_AGENTS' }
;

const initialState: AIAgentState = {
  messages: [],
  tools: [
    {
      id: 'code-analysis',
      name: 'Code Analysis',
      description: 'Analyze code for potential issues and improvements',
      enabled: true,
      type: 'code',
      status: 'idle',
    },
    {
      id: 'bug-detection',
      name: 'Bug Detection',
      description: 'Detect and analyze bugs in the codebase',
      enabled: true,
      type: 'code',
      status: 'idle',
    },
    {
      id: 'code-generation',
      name: 'Code Generation',
      description: 'Generate code based on requirements',
      enabled: true,
      type: 'code',
      status: 'idle',
    },
    {
      id: 'documentation',
      name: 'Documentation',
      description: 'Generate and update documentation',
      enabled: true,
      type: 'code',
      status: 'idle',
    },
  ],
  isProcessing: false,
  selectedTool: null,
  activeModules: {},
  logs: {},
  agentControls: {
    'dev': { status: 'idle', tasks: [] },
    'api': { status: 'idle', tasks: [] },
    'data': { status: 'idle', tasks: [] },
    'security': { status: 'idle', tasks: [] },
    'performance': { status: 'idle', tasks: [] },
    'system': { status: 'idle', tasks: [] },
  },
};

function aiAgentReducer(state: AIAgentState, action: AIAgentAction): AIAgentState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      };
    case 'SELECT_TOOL':
      return {
        ...state,
        selectedTool: action.payload,
      };
    case 'TOGGLE_TOOL':
      return {
        ...state,
        tools: state.tools.map(tool =>
          tool.id === action.payload
            ? { ...tool, enabled: !tool.enabled }
            : tool
        ),
      };
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
      };
    case 'UPDATE_MODULE_STATUS':
      return {
        ...state,
        activeModules: {
          ...state.activeModules,
          [action.payload.module]: {
            status: action.payload.status as any,
            progress: action.payload.progress,
            lastUpdated: new Date(),
          },
        },
      };
    case 'ADD_LOG':
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.payload.module]: {
            messages: [
              ...(state.logs[action.payload.module]?.messages || []),
              action.payload.message,
            ],
            lastUpdated: new Date(),
          },
        },
      };
    case 'START_AGENT':
      return {
        ...state,
        agentControls: {
          ...state.agentControls,
          [action.agentId]: {
            ...state.agentControls[action.agentId],
            status: 'active',
          },
        },
      };
    case 'PAUSE_AGENT':
      return {
        ...state,
        agentControls: {
          ...state.agentControls,
          [action.agentId]: {
            ...state.agentControls[action.agentId],
            status: 'paused',
          },
        },
      };
    case 'RESET_AGENT':
      return {
        ...state,
        agentControls: {
          ...state.agentControls,
          [action.agentId]: {
            status: 'idle',
            tasks: [],
          },
        },
      };
    case 'UPDATE_AGENT_STATUS':
      const { agentId, status } = action;
      if (status === 'error') {
        setTimeout(() => {
          // Dispatch START_AGENT after 2 seconds (must be handled in component with useEffect)
        }, 2000);
      }
      return {
        ...state,
        agentControls: {
          ...state.agentControls,
          [agentId]: {
            ...state.agentControls[agentId],
            status,
          },
        },
      };
    case 'ADD_AGENT_TASK':
      return {
        ...state,
        agentControls: {
          ...state.agentControls,
          [action.agentId]: {
            ...state.agentControls[action.agentId],
            tasks: [...state.agentControls[action.agentId].tasks, action.task],
          },
        },
      };
    case 'UPDATE_AGENT_TASK_STATUS':
      return {
        ...state,
        agentControls: {
          ...state.agentControls,
          [action.agentId]: {
            ...state.agentControls[action.agentId],
            tasks: state.agentControls[action.agentId].tasks.map(task =>
              task.id === action.taskId ? { ...task, status: action.status } : task
            ),
          },
        },
      };
    case 'START_ALL_AGENTS': {
      const updated = { ...state.agentControls };
      Object.keys(updated).forEach(id => {
        updated[id] = { ...updated[id], status: 'active' };
      });
      return { ...state, agentControls: updated };
    }
    case 'PAUSE_ALL_AGENTS': {
      const updated = { ...state.agentControls };
      Object.keys(updated).forEach(id => {
        updated[id] = { ...updated[id], status: 'paused' };
      });
      return { ...state, agentControls: updated };
    }
    default:
      return state;
  }
}

const AIAgentContext = createContext<{
  state: AIAgentState;
  dispatch: React.Dispatch<AIAgentAction>;
} | null>(null);

export function AIAgentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aiAgentReducer, initialState);

  return (
    <AIAgentContext.Provider value={{ state, dispatch }}>
      {children}
    </AIAgentContext.Provider>
  );
}

export function useAIAgent() {
  const context = useContext(AIAgentContext);
  if (!context) {
    throw new Error('useAIAgent must be used within an AIAgentProvider');
  }
  return context;
} 