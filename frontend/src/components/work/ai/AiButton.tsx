'use client';

/** Nút wt('shell.askAi') ở header dự án — mở ngăn trợ lý AI. */

import { Sparkles } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import { openAiPanel } from './store';
import { wt } from '@/components/work/i18n';

export default function AiButton({ config, issueNumber }: { config: ProjectConfig; issueNumber?: number }) {
  if (!config.permissions.useAi) return null;
  return (
    <button
      type="button"
      className="w-btn"
      onClick={() => openAiPanel({ pid: config.id, issueNumber: issueNumber ?? null })}
      aria-label={wt('shell.askAi')}
      title={wt('shell.askAi')}
    >
      <Sparkles size={14} className="text-[var(--w-accent-text)]" />
      <span className="max-lg:hidden">{wt('shell.askAi')}</span>
    </button>
  );
}
