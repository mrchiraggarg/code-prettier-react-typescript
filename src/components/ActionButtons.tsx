import React from 'react';
import { Play, Copy, Download, RotateCcw, Check } from 'lucide-react';
import { Theme } from '../types';

interface ActionButtonsProps {
  onFormat: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onReset: () => void;
  isLoading: boolean;
  theme: Theme;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFormat,
  onCopy,
  onDownload,
  onReset,
  isLoading,
  theme
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonClass = `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`;
  
  const primaryButtonClass = `${buttonClass} bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`;
  
  const secondaryButtonClass = `${buttonClass} ${
    theme === 'dark'
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md'
  }`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onFormat}
        disabled={isLoading}
        className={primaryButtonClass}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Formatting...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Format Code</span>
          </>
        )}
      </button>

      <button
        onClick={handleCopy}
        className={secondaryButtonClass}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </>
        )}
      </button>

      <button
        onClick={onDownload}
        className={secondaryButtonClass}
      >
        <Download className="w-4 h-4" />
        <span>Download</span>
      </button>

      <button
        onClick={onReset}
        className={secondaryButtonClass}
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default ActionButtons;