import React from 'react';
import Editor from '@monaco-editor/react';
import { Language, Theme } from '../types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  theme: Theme;
  readOnly?: boolean;
}

const LANGUAGE_MAP: Record<Language, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  html: 'html',
  css: 'css',
  json: 'json',
  python: 'python',
  xml: 'xml',
  sql: 'sql',
  yaml: 'yaml',
  markdown: 'markdown'
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  theme,
  readOnly = false
}) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      value={value}
      onChange={handleEditorChange}
      language={LANGUAGE_MAP[language]}
      theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        bracketPairColorization: { enabled: true },
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        fontFamily: '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
      }}
      loading={
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading editor...
            </span>
          </div>
        </div>
      }
    />
  );
};

export default CodeEditor;