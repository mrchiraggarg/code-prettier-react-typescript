export type Language = 
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'json'
  | 'python'
  | 'xml'
  | 'sql'
  | 'yaml'
  | 'markdown';

export type Theme = 'light' | 'dark';

export interface FormatterSettings {
  tabWidth: number;
  useTabs: boolean;
  semicolons: boolean;
  singleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  printWidth: number;
  autoFormat: boolean;
}

export interface LanguageConfig {
  name: string;
  extensions: string[];
  monacoLanguage: string;
  supportsFormatting: boolean;
}