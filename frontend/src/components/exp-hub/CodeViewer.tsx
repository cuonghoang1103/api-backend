'use client';

import { useState, useMemo, useCallback } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface CodeViewerProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

// Simple syntax highlighting using regex patterns
function highlightCode(code: string, language: string): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Keywords for common languages
  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'interface', 'type', 'enum', 'implements', 'extends', 'public', 'private', 'protected', 'readonly'],
    python: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'lambda', 'pass', 'break', 'continue', 'raise', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'self', 'async', 'await'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'long', 'double', 'float', 'boolean', 'char', 'String', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'import', 'package'],
    go: ['func', 'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'break', 'continue', 'go', 'chan', 'select', 'defer', 'package', 'import', 'type', 'struct', 'interface', 'map', 'make', 'new', 'nil', 'true', 'false', 'var', 'const', 'fmt'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'INTO', 'VALUES', 'SET'],
  };

  const langKeywords = keywords[language.toLowerCase()] || keywords.javascript || [];

  // Escape HTML and apply highlighting
  let result = escaped;

  // Highlight strings (double and single quotes)
  result = result.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-green-500">$&</span>');

  // Highlight comments
  result = result.replace(/(\/\/.*$)/gm, '<span class="text-neutral-500 italic">$1</span>');
  result = result.replace(/(#.*$)/gm, '<span class="text-neutral-500 italic">$1</span>');
  result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-neutral-500 italic">$1</span>');

  // Highlight numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');

  // Highlight keywords
  const keywordRegex = new RegExp(`\\b(${langKeywords.join('|')})\\b`, 'g');
  result = result.replace(keywordRegex, '<span class="text-blue-400">$1</span>');

  // Highlight function calls
  result = result.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="text-yellow-300">$1</span>(');

  return result;
}

export function CodeViewer({
  code,
  language,
  filename,
  showLineNumbers = true,
  maxHeight = '600px',
  className = '',
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [code]);

  const highlightedCode = useMemo(() => highlightCode(code, language), [code, language]);

  const lines = code.split('\n');

  return (
    <div className={`rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 ${className}`}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">{filename}</span>
          <a
            href="#"
            className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </a>
        </div>
      )}

      <div className="flex bg-neutral-900">
        {showLineNumbers && (
          <div className="py-3 pl-4 pr-3 text-right select-none border-r border-neutral-800 text-neutral-600 text-sm font-mono leading-6">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-x-auto">
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-white transition-colors z-10"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <pre
              className="p-4 font-mono text-sm leading-6 overflow-x-auto"
              style={{ maxHeight }}
            >
              <code
                className="text-neutral-300"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
