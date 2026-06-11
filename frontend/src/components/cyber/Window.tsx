'use client';

import React, { useState, useCallback } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultMinimize?: boolean;
  neonColor?: 'green' | 'cyan' | 'amber';
}

export function CyberWindow({
  title,
  icon,
  children,
  className = '',
  defaultMinimize = false,
  neonColor = 'green',
}: WindowProps) {
  const [minimized, setMinimized] = useState(defaultMinimize);
  const [maximized, setMaximized] = useState(false);

  const colorMap = {
    green: {
      border: 'border-neon-green/30',
      titleBg: 'bg-neon-green/10',
      titleText: 'text-neon-green',
      glow: 'shadow-[0_0_15px_rgba(0,255,102,0.15)]',
      glowHover: 'hover:shadow-[0_0_25px_rgba(0,255,102,0.3)]',
    },
    cyan: {
      border: 'border-neon-cyan/30',
      titleBg: 'bg-neon-cyan/10',
      titleText: 'text-neon-cyan',
      glow: 'shadow-[0_0_15px_rgba(0,240,255,0.15)]',
      glowHover: 'hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]',
    },
    amber: {
      border: 'border-neon-amber/30',
      titleBg: 'bg-neon-amber/10',
      titleText: 'text-neon-amber',
      glow: 'shadow-[0_0_15px_rgba(255,179,0,0.15)]',
      glowHover: 'hover:shadow-[0_0_25px_rgba(255,179,0,0.3)]',
    },
  };

  const c = colorMap[neonColor];

  return (
    <div
      className={`
        flex flex-col
        rounded-lg overflow-hidden
        border ${c.border} ${c.glow} ${c.glowHover}
        bg-cyber-bg/95 backdrop-blur-sm
        transition-shadow duration-300
        ${maximized ? 'fixed inset-4 z-50' : ''}
        ${className}
      `}
    >
      {/* Title Bar */}
      <div
        className={`
          flex items-center justify-between px-3 py-1.5
          ${c.titleBg} border-b ${c.border}
          select-none cursor-default
        `}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={c.titleText}>{icon}</span>}
          <span className={`font-mono text-xs font-bold tracking-widest ${c.titleText}`}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus size={10} />
          </button>
          <button
            onClick={() => setMaximized(!maximized)}
            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Maximize"
          >
            {maximized ? <Square size={10} /> : <Maximize2 size={10} />}
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="p-1 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
            title="Close"
          >
            <X size={10} />
          </button>
        </div>
      </div>

      {/* Window Dots (decorative) */}
      <div className="flex gap-1.5 px-3 pt-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500/40" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
        <div className="w-2 h-2 rounded-full bg-green-500/40" />
      </div>

      {/* Content */}
      {!minimized && (
        <div className="p-3 overflow-auto font-mono text-sm text-white/80">
          {children}
        </div>
      )}
    </div>
  );
}
