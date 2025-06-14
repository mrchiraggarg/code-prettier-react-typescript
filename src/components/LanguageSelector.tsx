import React from 'react';
import { ChevronDown, Code } from 'lucide-react';
import { Language, Theme } from '../types';

interface LanguageSelectorProps {
  language: Language;
  onChange: (language: Language) => void;
  theme: Theme;
}

const LANGUAGES: Array<{ value: Language; label: string; icon?: string }> = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'json', label: 'JSON', icon: '📄' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'xml', label: 'XML', icon: '📝' },
  { value: 'sql', label: 'SQL', icon: '💾' },
  { value: 'yaml', label: 'YAML', icon: '⚙️' },
  { value: 'markdown', label: 'Markdown', icon: '📖' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onChange,
  theme
}) => {
  const currentLanguage = LANGUAGES.find(lang => lang.value === language);

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => onChange(e.target.value as Language)}
        className={`appearance-none pl-10 pr-8 py-2 rounded-lg border cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      
      {/* Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {currentLanguage?.icon ? (
          <span className="text-sm">{currentLanguage.icon}</span>
        ) : (
          <Code className="w-4 h-4 text-gray-400" />
        )}
      </div>
      
      {/* Dropdown Arrow */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown className={`w-4 h-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </div>
    </div>
  );
};

export default LanguageSelector;