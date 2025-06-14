import React from 'react';
import { X, Settings2 } from 'lucide-react';
import { FormatterSettings, Theme } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FormatterSettings;
  onSettingsChange: (settings: FormatterSettings) => void;
  theme: Theme;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  theme
}) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof FormatterSettings>(
    key: K,
    value: FormatterSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md transform transition-transform duration-300 ease-in-out ${
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-white text-gray-900'
      } shadow-2xl`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold">Formatter Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-full pb-20">
          
          {/* Indentation */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-indigo-500 uppercase tracking-wide">
              Indentation
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">Tab Width</span>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={settings.tabWidth}
                  onChange={(e) => updateSetting('tabWidth', parseInt(e.target.value))}
                  className={`w-16 px-2 py-1 text-sm rounded border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-gray-200'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm">Use Tabs</span>
                <input
                  type="checkbox"
                  checked={settings.useTabs}
                  onChange={(e) => updateSetting('useTabs', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Code Style */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-indigo-500 uppercase tracking-wide">
              Code Style
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">Semicolons</span>
                <input
                  type="checkbox"
                  checked={settings.semicolons}
                  onChange={(e) => updateSetting('semicolons', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm">Single Quotes</span>
                <input
                  type="checkbox"
                  checked={settings.singleQuote}
                  onChange={(e) => updateSetting('singleQuote', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm">Trailing Comma</span>
                <select
                  value={settings.trailingComma}
                  onChange={(e) => updateSetting('trailingComma', e.target.value as FormatterSettings['trailingComma'])}
                  className={`px-2 py-1 text-sm rounded border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-gray-200'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="none">None</option>
                  <option value="es5">ES5</option>
                  <option value="all">All</option>
                </select>
              </label>
            </div>
          </div>

          {/* Line Width */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-indigo-500 uppercase tracking-wide">
              Line Width
            </h3>
            
            <label className="flex items-center justify-between">
              <span className="text-sm">Print Width</span>
              <input
                type="number"
                min="40"
                max="200"
                value={settings.printWidth}
                onChange={(e) => updateSetting('printWidth', parseInt(e.target.value))}
                className={`w-20 px-2 py-1 text-sm rounded border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </label>
          </div>

          {/* Auto Format */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-indigo-500 uppercase tracking-wide">
              Auto Format
            </h3>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm">Auto Format on Change</span>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically format code as you type (with delay)
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoFormat}
                onChange={(e) => updateSetting('autoFormat', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>
          </div>

          {/* Reset Button */}
          <div className="pt-6">
            <button
              onClick={() => onSettingsChange({
                tabWidth: 2,
                useTabs: false,
                semicolons: true,
                singleQuote: false,
                trailingComma: 'es5',
                printWidth: 80,
                autoFormat: false,
              })}
              className={`w-full px-4 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700'
              }`}
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;