'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, Link2, List, ListOrdered, Heading2, Quote, Minus, Loader2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-neon-violet/20 text-neon-violet'
          : 'text-text-muted hover:text-text-primary hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = useCallback(
    (before: string, after: string = '') => {
      const ta = textareaRef.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = value.substring(start, end);
      const newValue =
        value.substring(0, start) +
        before +
        selected +
        after +
        value.substring(end);

      onChange(newValue);

      // Restore cursor
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(
          start + before.length,
          start + before.length + selected.length
        );
      }, 0);
    },
    [value, onChange]
  );

  const insertLine = useCallback(
    (prefix: string) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const newValue =
        value.substring(0, lineStart) + prefix + value.substring(lineStart);

      onChange(newValue);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
      }, 0);
    },
    [value, onChange]
  );

  const tools: Array<{ icon: React.ReactNode; action: () => void; title: string; active?: boolean }> = [
    {
      icon: <Bold className="w-4 h-4" />,
      action: () => insertAtCursor('**', '**'),
      title: 'Bold',
      active: value.slice(textareaRef.current?.selectionStart ?? 0, textareaRef.current?.selectionEnd ?? 0).startsWith('**'),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      action: () => insertAtCursor('_', '_'),
      title: 'Italic',
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      action: () => insertLine('## '),
      title: 'Heading',
    },
    {
      icon: <Quote className="w-4 h-4" />,
      action: () => insertLine('> '),
      title: 'Quote',
    },
    {
      icon: <Link2 className="w-4 h-4" />,
      action: () => insertAtCursor('[', '](url)'),
      title: 'Link',
    },
    {
      icon: <List className="w-4 h-4" />,
      action: () => insertLine('- '),
      title: 'Bullet List',
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      action: () => insertLine('1. '),
      title: 'Numbered List',
    },
    {
      icon: <Minus className="w-4 h-4" />,
      action: () => insertAtCursor('\n---\n', ''),
      title: 'Divider',
    },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden border transition-colors"
      style={{
        borderColor: 'rgba(168,85,247,0.2)',
        background: 'rgba(15,10,30,0.5)',
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-0.5 px-3 py-2 border-b"
        style={{ borderColor: 'rgba(168,85,247,0.15)' }}
      >
        {tools.map((tool, i) => (
          <ToolbarButton key={i} onClick={tool.action} title={tool.title}>
            {tool.icon}
          </ToolbarButton>
        ))}
        <div className="flex-1" />
        <span className="text-[10px]" style={{ color: 'rgba(168,85,247,0.4)' }}>
          Markdown
        </span>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Viết case study chi tiết về dự án... Sử dụng Markdown để định dạng.'}
        rows={12}
        className="w-full px-4 py-3 bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 resize-none outline-none"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '13px', lineHeight: '1.7' }}
      />
    </div>
  );
}
