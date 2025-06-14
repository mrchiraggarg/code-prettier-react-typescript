import * as prettier from 'prettier';
import { Language, FormatterSettings } from '../types';
import { js_beautify, html_beautify } from 'js-beautify';

// Import parsers dynamically to avoid bundling issues
async function getParser(parserName: string) {
  switch (parserName) {
    case 'babel':
      return (await import('prettier/parser-babel')).default;
    case 'typescript':
      return (await import('prettier/parser-typescript')).default;
    case 'html':
      return (await import('prettier/parser-html')).default;
    case 'css':
      return (await import('prettier/parser-postcss')).default;
    case 'yaml':
      return (await import('prettier/parser-yaml')).default;
    case 'markdown':
      return (await import('prettier/parser-markdown')).default;
    default:
      throw new Error(`Unknown parser: ${parserName}`);
  }
}

export async function formatCode(
  code: string,
  language: Language,
  settings: FormatterSettings
): Promise<string> {
  if (!code.trim()) return code;

  try {
    switch (language) {
      case 'javascript':
        return await prettier.format(code, {
          parser: 'babel',
          plugins: [await getParser('babel')],
          tabWidth: settings.tabWidth,
          useTabs: settings.useTabs,
          semi: settings.semicolons,
          singleQuote: settings.singleQuote,
          trailingComma: settings.trailingComma,
          printWidth: settings.printWidth,
        });

      case 'typescript':
        return await prettier.format(code, {
          parser: 'typescript',
          plugins: [await getParser('typescript')],
          tabWidth: settings.tabWidth,
          useTabs: settings.useTabs,
          semi: settings.semicolons,
          singleQuote: settings.singleQuote,
          trailingComma: settings.trailingComma,
          printWidth: settings.printWidth,
        });

      case 'html':
        return await prettier.format(code, {
          parser: 'html',
          plugins: [await getParser('html')],
          tabWidth: settings.tabWidth,
          useTabs: settings.useTabs,
          printWidth: settings.printWidth,
          htmlWhitespaceSensitivity: 'css',
        });

      case 'css':
        return await prettier.format(code, {
          parser: 'css',
          plugins: [await getParser('css')],
          tabWidth: settings.tabWidth,
          useTabs: settings.useTabs,
          printWidth: settings.printWidth,
        });

      case 'json':
        try {
          const parsed = JSON.parse(code);
          return JSON.stringify(parsed, null, settings.useTabs ? '\t' : ' '.repeat(settings.tabWidth));
        } catch (error) {
          throw new Error('Invalid JSON syntax');
        }

      case 'yaml':
        return await prettier.format(code, {
          parser: 'yaml',
          plugins: [await getParser('yaml')],
          tabWidth: settings.tabWidth,
          useTabs: settings.useTabs,
          printWidth: settings.printWidth,
        });

      case 'markdown':
        return await prettier.format(code, {
          parser: 'markdown',
          plugins: [await getParser('markdown')],
          tabWidth: settings.tabWidth,
          useTabs: settings.useTabs,
          printWidth: settings.printWidth,
          proseWrap: 'preserve',
        });

      case 'python':
        // Basic Python formatting using simple rules
        return formatPython(code, settings);

      case 'xml':
        return html_beautify(code, {
          indent_size: settings.tabWidth,
          indent_char: settings.useTabs ? '\t' : ' ',
          max_preserve_newlines: 2,
          preserve_newlines: true,
          keep_array_indentation: false,
          break_chained_methods: false,
          indent_scripts: 'normal',
          brace_style: 'collapse',
          space_before_conditional: true,
          unescape_strings: false,
          jslint_happy: false,
          end_with_newline: false,
          wrap_line_length: settings.printWidth,
          indent_inner_html: false,
          comma_first: false,
          e4x: false,
          indent_empty_lines: false
        });

      case 'sql':
        return formatSQL(code, settings);

      default:
        return code;
    }
  } catch (error) {
    throw new Error(`Formatting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function formatPython(code: string, settings: FormatterSettings): string {
  // Basic Python formatting - split by lines and apply consistent indentation
  const lines = code.split('\n');
  let indentLevel = 0;
  const indentStr = settings.useTabs ? '\t' : ' '.repeat(settings.tabWidth);
  
  const formattedLines = lines.map(line => {
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('#')) {
      return trimmed;
    }
    
    // Decrease indent for closing statements
    if (trimmed.match(/^(except|elif|else|finally):/)) {
      return indentStr.repeat(Math.max(0, indentLevel - 1)) + trimmed;
    }
    
    if (trimmed.match(/^(return|break|continue|pass|raise)/)) {
      return indentStr.repeat(indentLevel) + trimmed;
    }
    
    const currentLine = indentStr.repeat(indentLevel) + trimmed;
    
    // Increase indent after certain statements
    if (trimmed.match(/:\s*$/)) {
      indentLevel++;
    }
    
    // Decrease indent level for dedent patterns
    if (trimmed.match(/^(except|elif|else|finally):/)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    return currentLine;
  });
  
  return formattedLines.join('\n');
}

function formatSQL(code: string, settings: FormatterSettings): string {
  // Basic SQL formatting
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE',
    'ALTER', 'DROP', 'INDEX', 'TABLE', 'DATABASE', 'VIEW', 'PROCEDURE', 'FUNCTION'
  ];
  
  let formatted = code;
  const indentStr = settings.useTabs ? '\t' : ' '.repeat(settings.tabWidth);
  
  // Add line breaks before major keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${keyword}`);
  });
  
  // Clean up and add proper indentation
  const lines = formatted.split('\n').map(line => line.trim()).filter(line => line);
  
  return lines.map((line, index) => {
    if (index === 0) return line;
    if (line.match(/^(AND|OR)/i)) return indentStr + line;
    return line;
  }).join('\n');
}