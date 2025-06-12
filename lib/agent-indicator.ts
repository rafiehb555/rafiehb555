import { useEffect } from 'react';

interface AgentIndicatorProps {
  filePath: string;
  isActive: boolean;
}

export function useAgentIndicator({ filePath, isActive }: AgentIndicatorProps) {
  useEffect(() => {
    if (!isActive) return;

    // Get the file element from the DOM
    const fileElement = document.querySelector(`[data-file-path="${filePath}"]`);
    if (!fileElement) return;

    // Add active class
    fileElement.classList.add('agent-active');

    // Remove active class when component unmounts
    return () => {
      fileElement.classList.remove('agent-active');
    };
  }, [filePath, isActive]);
}

// CSS styles to be added to your global CSS
export const agentIndicatorStyles = `
  .agent-active {
    background-color: rgba(99, 102, 241, 0.1) !important;
    border-left: 3px solid #6366f1 !important;
    transition: all 0.3s ease;
  }

  .agent-active:hover {
    background-color: rgba(99, 102, 241, 0.2) !important;
  }
`;
