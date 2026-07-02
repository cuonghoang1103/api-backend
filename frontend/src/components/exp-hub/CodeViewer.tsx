'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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

// Map language names to Prism grammar names
const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  js: 'javascript',
  ts: 'typescript',
  jsx: 'jsx',
  tsx: 'tsx',
  python: 'python',
  py: 'python',
  java: 'java',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  rs: 'rust',
  sql: 'sql',
  bash: 'bash',
  shell: 'bash',
  sh: 'bash',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  css: 'css',
  html: 'markup',
  markup: 'markup',
  xml: 'markup',
  csharp: 'csharp',
  cs: 'csharp',
  cpp: 'cpp',
  c: 'cpp',
  kotlin: 'kotlin',
  kt: 'kotlin',
  swift: 'swift',
  ruby: 'ruby',
  rb: 'ruby',
  php: 'php',
  markdown: 'markdown',
  md: 'markdown',
};

// Simple syntax highlighting without Prism (works everywhere)
function highlightCode(code: string, language: string): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  let result = escaped;

  // Keywords for common languages
  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'default', 'extends', 'super', 'static', 'get', 'set'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'default', 'extends', 'super', 'static', 'interface', 'type', 'enum', 'implements', 'public', 'private', 'protected', 'readonly', 'abstract', 'as', 'is', 'keyof', 'namespace', 'module'],
    python: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'lambda', 'pass', 'break', 'continue', 'raise', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'self', 'async', 'await', 'global', 'nonlocal', 'assert', 'del'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'long', 'double', 'float', 'boolean', 'char', 'String', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'import', 'package', 'abstract', 'synchronized', 'volatile', 'transient', 'native', 'strictfp', 'enum'],
    go: ['func', 'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'break', 'continue', 'go', 'chan', 'select', 'defer', 'package', 'import', 'type', 'struct', 'interface', 'map', 'make', 'new', 'nil', 'true', 'false', 'var', 'const', 'fmt', 'error', 'string', 'int', 'int64', 'float64', 'bool', 'byte', 'rune'],
    rust: ['fn', 'let', 'mut', 'const', 'if', 'else', 'match', 'for', 'while', 'loop', 'return', 'struct', 'enum', 'impl', 'trait', 'pub', 'use', 'mod', 'self', 'Self', 'super', 'crate', 'true', 'false', 'Some', 'None', 'Ok', 'Err', 'async', 'await', 'move', 'ref', 'static', 'unsafe', 'where', 'type'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'INTO', 'VALUES', 'SET', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'DEFAULT', 'AUTO_INCREMENT', 'VARCHAR', 'INT', 'TEXT', 'BOOLEAN', 'TIMESTAMP', 'DATETIME'],
    bash: ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'exit', 'export', 'echo', 'read', 'cd', 'pwd', 'ls', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'sed', 'awk', 'chmod', 'chown', 'sudo', 'apt', 'yum', 'npm', 'git', 'docker', 'source', 'alias', 'export', 'local', 'true', 'false'],
    html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style', 'link', 'meta', 'title', 'header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'select', 'option', 'textarea', 'label', 'class', 'id', 'href', 'src'],
    css: ['color', 'background', 'font', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom', 'flex', 'grid', 'align', 'justify', 'text', 'line', 'overflow', 'transform', 'transition', 'animation', 'opacity', 'visibility', 'z-index', 'cursor', 'box-shadow', 'border-radius'],
    json: ['true', 'false', 'null'],
    yaml: ['true', 'false', 'null', 'yes', 'no', 'on', 'off'],
    markup: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style', 'link', 'meta', 'title'],
  };

  const langKeywords = keywords[language.toLowerCase()] || keywords.javascript || [];

  // Highlight strings (double and single quotes)
  result = result.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="token-string">$1</span>');
  result = result.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="token-string">$1</span>');
  result = result.replace(/(`(?:[^`\\]|\\.)*`)/g, '<span class="token-string">$1</span>');

  // Highlight comments
  result = result.replace(/(\/\/.*$)/gm, '<span class="token-comment">$1</span>');
  result = result.replace(/(#.*$)/gm, '<span class="token-comment">$1</span>');
  result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>');
  result = result.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token-comment">$1</span>');

  // Highlight numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>');

  // Highlight keywords
  const keywordRegex = new RegExp(`\\b(${langKeywords.join('|')})\\b`, 'g');
  result = result.replace(keywordRegex, '<span class="token-keyword">$1</span>');

  // Highlight function calls
  result = result.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="token-function">$1</span>(');

  // Highlight HTML/CSS tags
  result = result.replace(/(&lt;\/?[\w-]+)/g, '<span class="token-tag">$1</span>');
  result = result.replace(/(\/&gt;|&gt;)/g, '<span class="token-tag">$1</span>');
  result = result.replace(/([\w-]+)=/g, '<span class="token-attr">$1</span>=');

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

  const highlightedCode = highlightCode(code, language);
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

      <div className="flex bg-[#1e1e1e]">
        {showLineNumbers && (
          <div className="py-3 pl-4 pr-3 text-right select-none border-r border-neutral-700 text-neutral-500 text-sm font-mono leading-6 min-w-[3rem]">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-x-auto">
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-neutral-400 hover:text-white transition-colors z-10"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <pre
              className="p-4 font-mono text-sm leading-6 overflow-x-auto text-[#d4d4d4]"
              style={{ maxHeight }}
            >
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
