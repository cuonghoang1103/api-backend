'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { snippetsApi } from '@/lib/exp-hub-api';
import type { SnippetVariable } from '@/types/exp-hub';

interface CopyButtonProps {
  snippetId: number;
  code: string;
  language: string;
  variables?: SnippetVariable[];
  variant?: 'button' | 'icon';
  className?: string;
}

export function CopyButton({
  snippetId,
  code,
  language,
  variables = [],
  variant = 'icon',
  className = '',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showVariableForm, setShowVariableForm] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    variables.forEach((v) => {
      defaults[v.key] = v.defaultValue ?? '';
    });
    return defaults;
  });

  const handleCopy = async () => {
    if (variables.length > 0 && !showVariableForm) {
      setShowVariableForm(true);
      return;
    }

    try {
      // Replace variables in code
      let finalCode = code;
      Object.entries(variableValues).forEach(([key, value]) => {
        finalCode = finalCode.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `{{${key}}}`);
      });

      await navigator.clipboard.writeText(finalCode);
      setCopied(true);
      toast.success('Copied to clipboard!');

      // Track copy on server
      snippetsApi.copy(snippetId, variableValues).catch(() => {});

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (variant === 'button') {
    return (
      <div className={className}>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>

        {showVariableForm && variables.length > 0 && (
          <div className="mt-3 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm font-medium mb-2">Fill in template variables:</p>
            {variables.map((v) => (
              <div key={v.key} className="mb-2">
                <label className="block text-sm mb-1">{v.label}</label>
                <input
                  type="text"
                  value={variableValues[v.key] ?? ''}
                  onChange={(e) => setVariableValues((prev) => ({ ...prev, [v.key]: e.target.value }))}
                  placeholder={v.defaultValue ?? `{{${v.key}}}`}
                  className="w-full px-3 py-1.5 text-sm border rounded-md bg-white dark:bg-neutral-800"
                />
              </div>
            ))}
            <button
              onClick={() => setShowVariableForm(false)}
              className="text-sm text-neutral-500 hover:text-neutral-700 mt-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={`p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors ${className}`}
      title="Copy code"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-neutral-500" />
      )}
    </button>
  );
}
