import React, { useRef, useEffect } from 'react';
import { useAIAgent } from '../context/AIAgentContext';
import { FiCode, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface LogMessage {
  id: string;
  type: 'system' | 'development' | 'error' | 'code' | 'status';
  content: string;
  timestamp: Date;
  module?: string;
  code?: string;
  language?: string;
  status?: 'success' | 'error' | 'in-progress';
}

export function AIAgentChat() {
  const { state, dispatch } = useAIAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = React.useState<LogMessage[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, logs]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date()
      }
    });

    // Clear input
    input.value = '';

    // Set processing state
    dispatch({ type: 'SET_PROCESSING', payload: true });

    try {
      // Add development log
      setLogs(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'development',
          content: 'Processing your request...',
          timestamp: new Date(),
          module: 'AIAgent',
          status: 'in-progress'
        }
      ]);

      // Simulate AI processing with code generation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add code snippet log
      setLogs(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'code',
          content: 'Generated code for module',
          timestamp: new Date(),
          module: 'GoSellr',
          code: `function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must contain items');
  }
  
  // Process payment
  const payment = await processPayment(order.total);
  
  // Update inventory
  await updateInventory(order.items);
  
  return { success: true, orderId: generateOrderId() };
}`,
          language: 'typescript'
        }
      ]);

      // Add success log
      setLogs(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          type: 'status',
          content: 'Module updated successfully',
          timestamp: new Date(),
          module: 'GoSellr',
          status: 'success'
        }
      ]);

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: (Date.now() + 3).toString(),
          role: 'assistant',
          content: `I've processed your request and generated the necessary code for the GoSellr module. The changes have been applied successfully.`,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error log
      setLogs(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'error',
          content: 'Error processing request',
          timestamp: new Date(),
          module: 'AIAgent',
          status: 'error'
        }
      ]);

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: (Date.now() + 2).toString(),
          role: 'system',
          content: 'Sorry, there was an error processing your message.',
          timestamp: new Date()
        }
      });
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const renderLog = (log: LogMessage) => {
    switch (log.type) {
      case 'code':
        return (
          <div className="max-w-[80%] rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
              <span className="text-sm font-medium">{log.module}</span>
              <FiCode className="text-gray-400" />
            </div>
            <SyntaxHighlighter
              language={log.language || 'typescript'}
              style={tomorrow}
              className="text-sm"
            >
              {log.code || ''}
            </SyntaxHighlighter>
          </div>
        );
      case 'status':
        return (
          <div className="flex items-center space-x-2 text-sm">
            {log.status === 'success' && <FiCheckCircle className="text-green-500" />}
            {log.status === 'error' && <FiAlertCircle className="text-red-500" />}
            {log.status === 'in-progress' && <FiClock className="text-yellow-500 animate-spin" />}
            <span>{log.content}</span>
          </div>
        );
      default:
        return (
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-50">
            <p className="text-xs">
              <span className="font-medium">
                {log.module ? `[${log.module}] ` : ''}
              </span>
              {log.content}
            </p>
            <p className="text-xs mt-1 opacity-75">
              {log.timestamp.toLocaleTimeString()}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Chat Messages */}
        {state.messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.role === 'assistant'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-red-100 text-red-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Development Logs */}
        {logs.map(log => (
          <div
            key={log.id}
            className={`flex justify-start ${
              log.type === 'error' ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {renderLog(log)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            name="message"
            placeholder="Ask about development status, request code changes, or get module updates..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={state.isProcessing}
          />
          <button
            type="submit"
            disabled={state.isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 