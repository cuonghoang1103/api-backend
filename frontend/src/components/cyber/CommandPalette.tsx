'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

interface ParsedCmd {
  cmd: string;
  args: Record<string, string>;
}

function parseCommand(input: string): ParsedCmd {
  const parts = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const cmd = parts[0] || '';
  const args: Record<string, string> = {};

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].replace(/^"|"$/g, '');
    if (part.startsWith('--')) {
      const [key, value] = part.slice(2).split('=');
      args[key] = value || '';
    } else if (part.startsWith('-')) {
      args[part.slice(1)] = '';
    } else if (!args._) {
      args._ = part;
    } else {
      args[`_${i}`] = part;
    }
  }

  return { cmd, args };
}

const COMMANDS = [
  {
    name: 'task add',
    usage: 'task add "title" --time 14:00 --end 15:00 --type study --exp 50',
    description: 'Create a new task',
  },
  {
    name: 'task list',
    usage: 'task list',
    description: 'List all tasks for today',
  },
  {
    name: 'task delete',
    usage: 'task delete <id>',
    description: 'Delete a task by ID',
  },
  {
    name: 'profile',
    usage: 'profile',
    description: 'Show your current profile stats',
  },
  {
    name: 'help',
    usage: 'help [command]',
    description: 'Show help for a command',
  },
];

export function CommandPalette({ isOpen, onClose, onCommand }: CommandPaletteProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInput('');
      setHistoryIdx(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    const matches = COMMANDS
      .map((c) => c.name)
      .filter((n) => n.startsWith(input.trim()));
    setSuggestions(matches);
  }, [input]);

  const submit = () => {
    if (!input.trim()) return;
    setHistory((h) => [input, ...h].slice(0, 20));
    setHistoryIdx(-1);
    onCommand(input);
    setInput('');
    setSuggestions([]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-32"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl mx-4 bg-cyber-bg border border-neon-green/40 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,255,102,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 border-b border-neon-green/20">
          <Terminal size={14} className="text-neon-green" />
          <span className="font-mono text-xs text-neon-green">CYBER_OS v1.0 — COMMAND PALETTE</span>
          <button onClick={onClose} className="ml-auto text-white/30 hover:text-white">
            <X size={14} />
          </button>
        </div>

        {/* Input */}
        <div className="flex items-center px-4 py-3 gap-2 border-b border-neon-green/10">
          <span className="font-mono text-neon-green text-sm">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
              if (e.key === 'Escape') onClose();
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHistoryIdx((i) => Math.min(i + 1, history.length - 1));
                if (historyIdx >= 0) setInput(history[historyIdx]);
              }
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHistoryIdx((i) => Math.max(i - 1, -1));
                setInput(historyIdx > 0 ? history[historyIdx - 1] : '');
              }
            }}
            className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/20"
            placeholder="task add &quot;Study React&quot; --time 14:00 --type study --exp 50"
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-4 py-2 space-y-1 border-b border-neon-green/10">
            {suggestions.map((s) => (
              <div key={s} className="font-mono text-xs text-neon-green/70">
                &gt; {s}
              </div>
            ))}
          </div>
        )}

        {/* Help reference */}
        <div className="px-4 py-2 max-h-40 overflow-y-auto">
          <div className="font-mono text-[10px] text-white/30 mb-2">AVAILABLE_COMMANDS:</div>
          {COMMANDS.map((c) => (
            <div key={c.name} className="mb-1">
              <div className="font-mono text-xs text-neon-cyan">{c.name}</div>
              <div className="font-mono text-[10px] text-white/30 ml-4">{c.description}</div>
              <div className="font-mono text-[9px] text-white/20 ml-4">{c.usage}</div>
            </div>
          ))}
        </div>

        {/* Keyboard hint */}
        <div className="px-4 py-1 bg-black/30 border-t border-neon-green/10 flex gap-4">
          <span className="font-mono text-[9px] text-white/20">
            <kbd className="text-white/40">ENTER</kbd> execute
          </span>
          <span className="font-mono text-[9px] text-white/20">
            <kbd className="text-white/40">ESC</kbd> close
          </span>
          <span className="font-mono text-[9px] text-white/20">
            <kbd className="text-white/40">↑↓</kbd> history
          </span>
          <span className="font-mono text-[9px] text-white/20">
            <kbd className="text-white/40">Ctrl+`</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}
