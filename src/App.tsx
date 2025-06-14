import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Settings, Copy, Download, Play, RotateCcw } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import LanguageSelector from './components/LanguageSelector';
import SettingsPanel from './components/SettingsPanel';
import ActionButtons from './components/ActionButtons';
import { formatCode } from './utils/formatters';
import { downloadFile } from './utils/fileUtils';
import { Language, FormatterSettings, Theme } from './types';

const DEFAULT_CODE = `// Welcome to Code Formatter Pro
function fibonacci(n) {
const arr = [0, 1];
for (let i = 2; i <= n; i++) {
arr[i] = arr[i - 1] + arr[i - 2];
}
return arr[n];
}

console.log('Fibonacci of 10:', fibonacci(10));`;

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [formattedCode, setFormattedCode] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<FormatterSettings>({
    tabWidth: 2,
    useTabs: false,
    semicolons: true,
    singleQuote: false,
    trailingComma: 'es5',
    printWidth: 80,
    autoFormat: false,
  });

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('code-formatter-theme', newTheme);
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('code-formatter-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Format code function
  const handleFormat = useCallback(async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formatted = await formatCode(code, language, settings);
      setFormattedCode(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to format code');
      setFormattedCode(code); // Fallback to original code
    } finally {
      setIsLoading(false);
    }
  }, [code, language, settings]);

  // Auto-format on code change if enabled
  useEffect(() => {
    if (settings.autoFormat && code.trim()) {
      const timeoutId = setTimeout(() => {
        handleFormat();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [code, settings.autoFormat, handleFormat]);

  // Initial format
  useEffect(() => {
    handleFormat();
  }, [language, settings]);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode || code);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Download file
  const handleDownload = () => {
    const fileExtensions: Record<Language, string> = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      json: 'json',
      python: 'py',
      xml: 'xml',
      sql: 'sql',
      yaml: 'yaml',
      markdown: 'md'
    };
    
    const extension = fileExtensions[language] || 'txt';
    downloadFile(formattedCode || code, `formatted-code.${extension}`);
  };

  // Reset code
  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setLanguage('javascript');
    setError(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-700'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <h1 className={`text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent`}>
                  Code Formatter Pro
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <LanguageSelector 
                language={language} 
                onChange={setLanguage}
                theme={theme}
              />
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Action Bar */}
        <div className="mb-6">
          <ActionButtons
            onFormat={handleFormat}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onReset={handleReset}
            isLoading={isLoading}
            theme={theme}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            theme === 'dark'
              ? 'bg-red-900/20 border-red-800 text-red-200'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Editor */}
          <div className={`rounded-xl border transition-colors duration-300 overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Input Code
              </h2>
            </div>
            <div className="h-96 lg:h-[500px]">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                theme={theme}
                readOnly={false}
              />
            </div>
          </div>

          {/* Output Editor */}
          <div className={`rounded-xl border transition-colors duration-300 overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Formatted Code
              </h2>
              {isLoading && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Formatting...
                  </span>
                </div>
              )}
            </div>
            <div className="h-96 lg:h-[500px]">
              <CodeEditor
                value={formattedCode || code}
                onChange={() => {}}
                language={language}
                theme={theme}
                readOnly={true}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        theme={theme}
      />
    </div>
  );
}

export default App;