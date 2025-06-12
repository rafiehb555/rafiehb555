import React from 'react';
import { useAIAgent } from '../../context/AIAgentContext';
import fs from 'fs';
import path from 'path';

interface FolderStructure {
  path: string;
  type: 'file' | 'directory';
  status: 'valid' | 'missing' | 'invalid';
  required: boolean;
  details?: {
    size?: number;
    lastModified?: Date;
    extension?: string;
  };
}

interface ScanResult {
  valid: FolderStructure[];
  missing: FolderStructure[];
  invalid: FolderStructure[];
}

export function FolderFlowAgent() {
  const { dispatch } = useAIAgent();
  const [structure, setStructure] = React.useState<FolderStructure[]>([]);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanResults, setScanResults] = React.useState<ScanResult>({
    valid: [],
    missing: [],
    invalid: [],
  });

  const requiredStructure: FolderStructure[] = [
    {
      path: 'app',
      type: 'directory',
      status: 'valid',
      required: true,
    },
    {
      path: 'app/components',
      type: 'directory',
      status: 'valid',
      required: true,
    },
    {
      path: 'app/api',
      type: 'directory',
      status: 'valid',
      required: true,
    },
    {
      path: 'app/context',
      type: 'directory',
      status: 'valid',
      required: true,
    },
    {
      path: 'app/ehb-ai-agent',
      type: 'directory',
      status: 'valid',
      required: true,
    },
    {
      path: 'app/ehb-ai-agent/components',
      type: 'directory',
      status: 'valid',
      required: true,
    },
    {
      path: 'app/ehb-ai-agent/context',
      type: 'directory',
      status: 'valid',
      required: true,
    },
  ];

  const scanStructure = async () => {
    setIsScanning(true);
    try {
      const results: ScanResult = {
        valid: [],
        missing: [],
        invalid: [],
      };

      for (const item of requiredStructure) {
        const fullPath = path.join(process.cwd(), item.path);
        
        try {
          const stats = await fs.promises.stat(fullPath);
          const details = {
            size: stats.size,
            lastModified: stats.mtime,
            extension: path.extname(fullPath),
          };

          if (stats.isDirectory() === (item.type === 'directory')) {
            results.valid.push({ ...item, details });
          } else {
            results.invalid.push({ ...item, details });
          }
        } catch (error) {
          results.missing.push(item);
        }
      }

      setScanResults(results);
      setStructure([...results.valid, ...results.missing, ...results.invalid]);

      // Log findings
      if (results.missing.length > 0) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now().toString(),
            role: 'system',
            content: `Missing ${results.missing.length} required items in folder structure`,
            timestamp: new Date(),
          },
        });
      }

      if (results.invalid.length > 0) {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now().toString(),
            role: 'system',
            content: `Found ${results.invalid.length} invalid items in folder structure`,
            timestamp: new Date(),
          },
        });
      }

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          role: 'system',
          content: `Folder structure scan complete. Found ${results.valid.length} valid items.`,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          role: 'system',
          content: `Error scanning folder structure: ${error}`,
          timestamp: new Date(),
        },
      });
    } finally {
      setIsScanning(false);
    }
  };

  React.useEffect(() => {
    scanStructure();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Folder Structure</h3>
        <button
          onClick={scanStructure}
          disabled={isScanning}
          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Scan Structure'}
        </button>
      </div>

      {/* Scan Results Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600">Valid Items</div>
          <div className="text-2xl font-semibold text-green-700">{scanResults.valid.length}</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-red-600">Missing Items</div>
          <div className="text-2xl font-semibold text-red-700">{scanResults.missing.length}</div>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <div className="text-sm text-yellow-600">Invalid Items</div>
          <div className="text-2xl font-semibold text-yellow-700">{scanResults.invalid.length}</div>
        </div>
      </div>

      {/* Structure List */}
      <div className="space-y-4">
        {structure.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  item.status === 'valid'
                    ? 'bg-green-500'
                    : item.status === 'missing'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`} />
                <span className="font-medium text-gray-900">{item.path}</span>
              </div>
              <span className="text-sm text-gray-500">{item.type}</span>
            </div>

            {item.details && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                {item.details.size && (
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <span className="ml-1 font-medium">
                      {(item.details.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}
                {item.details.lastModified && (
                  <div>
                    <span className="text-gray-500">Last Modified:</span>
                    <span className="ml-1 font-medium">
                      {item.details.lastModified.toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {item.details.extension && (
                  <div>
                    <span className="text-gray-500">Extension:</span>
                    <span className="ml-1 font-medium">{item.details.extension}</span>
                  </div>
                )}
              </div>
            )}

            {item.status === 'missing' && (
              <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                Required {item.type} is missing. Please create it.
              </div>
            )}

            {item.status === 'invalid' && (
              <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded text-sm">
                Invalid {item.type} type. Expected {item.type === 'file' ? 'directory' : 'file'}.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 