import * as prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserTypeScript from 'prettier/parser-typescript';
import parserHtml from 'prettier/parser-html';
import parserPostcss from 'prettier/parser-postcss';
import parserYaml from 'prettier/parser-yaml';
import parserMarkdown from 'prettier/parser-markdown';
import { js_beautify, css_beautify, html_beautify } from 'js-beautify';
import { Language, FormatterSettings } from '../types';

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
          plugins: [parserBabel],
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
          plugins: [parserTypeScript],
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
          plugins: [parserHtml],
          tabWidth: settings.tabWidth,
          useTabs: settings.useTabs,
          printWidth: settings.printWidth,
          htmlWhitespaceSensitivity: 'css',
        });

      case 'css':
        return await prettier.format(code, {
          parser: 'css',
          plugins: [parserPostcss],
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
          plugins: [parserYaml],
          tabWidth: settings.tabWidth,
          useTabs: settings.useTabs,
          printWidth: settings.printWidth,
        });

      case 'markdown':
        return await prettier.format(code, {
          parser: 'markdown',
          plugins: [parserMarkdown],
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