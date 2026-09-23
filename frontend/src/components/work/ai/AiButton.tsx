'use client';

/** Nút "Ask AI" ở header dự án — mở ngăn trợ lý AI. */

import { Sparkles } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import { openAiPanel } from './store';

export default function AiButton({ config, issueNumber }: { config: ProjectConfig; issueNumber?: number }) {
  if (!config.permissions.useAi) return null;
  return (
    <button
      type="button"
      className="w-btn"
      onClick={() => openAiPanel({ pid: config.id, issueNumber: issueNumber ?? null })}
      aria-label="Ask AI"
      title="Ask AI"
    >
      <Sparkles size={14} className="text-[var(--w-accent-text)]" />
      <span className="max-md:hidden">Ask AI</span>
    </button>
  );
}
