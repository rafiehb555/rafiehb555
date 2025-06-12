'use client';

import React, { useState, useEffect } from 'react';
import { useAIAgent } from '../context/AIAgentContext';
import { FiRefreshCw, FiMessageSquare, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { GitService } from '../services/gitService';

interface AIAgentHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AIAgentHeader({ 
  title = "EHB AI Agent", 
  subtitle = "Automated Development & Monitoring System" 
}: AIAgentHeaderProps) {
  const { state, dispatch } = useAIAgent();
  const enabledTools = state.tools.filter(tool => tool.enabled);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'busy'>('offline');
  const [gitStatus, setGitStatus] = useState<'idle' | 'pushing' | 'error'>('idle');
  const [lastPush, setLastPush] = useState<string | null>(null);
  const [isUltraFastMode, setIsUltraFastMode] = useState(true);
  const [pushSpeed, setPushSpeed] = useState<number | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate syncing
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Use an action type that exists in your reducer with correct parameters
    dispatch({ type: 'UPDATE_AGENT_STATUS', agentId: 'system', status: 'active' });
    setIsSyncing(false);
  };

  const handleManualPush = async () => {
    try {
      setGitStatus('pushing');
      const startTime = Date.now();
      const gitService = GitService.getInstance();
      const result = await gitService.commitAndPush('Manual push from UI');
      const endTime = Date.now();
      const speed = endTime - startTime;
      
      if (result) {
        setLastPush(new Date().toLocaleTimeString());
        setPushSpeed(speed);
        setGitStatus('idle');
      } else {
        setGitStatus('error');
      }
    } catch (error) {
      console.error('Error during manual push:', error);
      setGitStatus('error');
    }
  };

  const toggleUltraFastMode = () => {
    try {
      const gitService = GitService.getInstance();
      gitService.setFastMode(!isUltraFastMode);
      setIsUltraFastMode(!isUltraFastMode);
    } catch (error) {
      console.error('Error toggling fast mode:', error);
    }
  };

  useEffect(() => {
    // Set agent status to online after component mounts
    setAgentStatus('online');
    
    // Check git status every 10 seconds
    const gitStatusInterval = setInterval(async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return;
        
        const gitService = GitService.getInstance();
        const hasChanges = await gitService.hasChanges();
        
        if (hasChanges && gitStatus !== 'pushing') {
          const startTime = Date.now();
          setGitStatus('pushing');
          // This will trigger the actual push via the auto-push system
          setTimeout(() => {
            const endTime = Date.now();
            setPushSpeed(endTime - startTime);
            setGitStatus('idle');
            setLastPush(new Date().toLocaleTimeString());
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking git status:', error);
        setGitStatus('error');
      }
    }, 10000);
    
    return () => {
      clearInterval(gitStatusInterval);
    };
  }, [gitStatus]);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 hidden md:block">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Git Status Indicator */}
          <div className="flex items-center border-r pr-4 border-gray-200">
            <span className="text-xs mr-2 text-gray-500">Git:</span>
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-1 ${
                gitStatus === 'idle' ? 'bg-green-400' : 
                gitStatus === 'pushing' ? 'bg-yellow-400 animate-pulse' : 
                'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-600">
                {gitStatus === 'idle' ? 'Synced' : 
                 gitStatus === 'pushing' ? 'Pushing...' : 
                 'Error'}
              </span>
            </div>
            {lastPush && (
              <span className="text-xs ml-2 text-gray-400">
                Last: {lastPush}
                {pushSpeed && <span className="ml-1 text-xs text-blue-400">({pushSpeed}ms)</span>}
              </span>
            )}
            <button
              onClick={handleManualPush}
              disabled={gitStatus === 'pushing'}
              className={`ml-2 text-xs px-2 py-0.5 rounded ${
                gitStatus === 'pushing' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              Push
            </button>
            <button
              onClick={toggleUltraFastMode}
              className={`ml-2 text-xs px-2 py-0.5 rounded ${
                isUltraFastMode
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isUltraFastMode ? '⚡ Ultra' : 'Normal'}
            </button>
          </div>
          
          {/* Agent Status Indicator */}
          <div className="flex items-center border-r pr-4 border-gray-200">
            <span className="text-xs mr-2 text-gray-500">Agent:</span>
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-1 ${
                agentStatus === 'online' ? 'bg-green-400' : 
                agentStatus === 'busy' ? 'bg-yellow-400 animate-pulse' : 
                'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-600">{agentStatus.charAt(0).toUpperCase() + agentStatus.slice(1)}</span>
            </div>
          </div>

          {/* Tools */}
          <div className="flex items-center space-x-2">
            {enabledTools.map(tool => (
              <div 
                key={tool.id} 
                className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {tool.status === 'success' ? (
                  <FiCheckCircle className="text-green-500 mr-1" size={12} />
                ) : (
                  <FiAlertCircle className="text-yellow-500 mr-1" size={12} />
                )}
                {tool.name}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center text-xs px-3 py-1.5 rounded-md ${
                isSyncing 
                  ? 'bg-blue-100 text-blue-400' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <FiRefreshCw 
                className={`mr-1 ${isSyncing ? 'animate-spin' : ''}`} 
                size={12} 
              />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className="flex items-center text-xs px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <FiMessageSquare className="mr-1" size={12} />
              {showChat ? 'Hide Chat' : 'Show Chat'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 