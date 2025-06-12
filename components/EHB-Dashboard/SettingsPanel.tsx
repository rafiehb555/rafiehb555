import React from 'react';
import { FiMoon, FiSun, FiGlobe, FiBell, FiLock, FiCreditCard, FiHelpCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Setting {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  type: 'toggle' | 'select' | 'link';
  value?: boolean | string;
  options?: { label: string; value: string }[];
  link?: string;
}

interface SettingsPanelProps {
  settings: Setting[];
  onSettingChange: (id: string, value: boolean | string) => void;
}

export default function SettingsPanel({ settings, onSettingChange }: SettingsPanelProps) {
  const getSettingIcon = (icon: React.ElementType) => {
    const Icon = icon;
    return <Icon className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {settings.map((setting, index) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{getSettingIcon(setting.icon)}</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                </div>
              </div>

              <div className="flex-shrink-0">
                {setting.type === 'toggle' && (
                  <button
                    onClick={() => onSettingChange(setting.id, !setting.value)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      setting.value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        setting.value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                )}

                {setting.type === 'select' && setting.options && (
                  <select
                    value={setting.value as string}
                    onChange={e => onSettingChange(setting.id, e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    {setting.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {setting.type === 'link' && setting.link && (
                  <a
                    href={setting.link}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Configure
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {settings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FiHelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-gray-500">No settings available</p>
        </div>
      )}
    </div>
  );
}
