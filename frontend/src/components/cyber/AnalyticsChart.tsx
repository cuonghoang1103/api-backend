'use client';

import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { CyberAnalytics } from '@/lib/api';

interface CyberAnalyticsProps {
  data: CyberAnalytics | null;
  loading: boolean;
}

const PERIODS = ['day', 'month', 'year'] as const;

export function CyberAnalyticsChart({ data, loading }: CyberAnalyticsProps) {
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('month');

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
        <div className="h-32 bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="font-mono text-xs text-white/30">
        &gt; NO_ANALYTICS_DATA. COMPLETE_TASKS_TO_UNLOCK.
      </div>
    );
  }

  const maxCpu = Math.max(...data.cpuLoad, 1);
  const maxRam = Math.max(...data.ramUsage, 1);
  const maxNet = Math.max(...data.netLoad, 1);

  return (
    <div className="space-y-4">
      {/* Period Tabs */}
      <div className="flex gap-1">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`
              px-3 py-1 rounded font-mono text-[10px] transition-colors
              ${period === p
                ? 'bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan'
                : 'bg-white/5 border border-white/10 text-white/30 hover:text-white/50'
              }
            `}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="font-mono text-neon-green text-sm font-bold">{data.totalTasks}</div>
          <div className="font-mono text-[9px] text-white/30">TOTAL</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-neon-cyan text-sm font-bold">{data.completedTasks}</div>
          <div className="font-mono text-[9px] text-white/30">DONE</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-neon-amber text-sm font-bold">
            {data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0}%
          </div>
          <div className="font-mono text-[9px] text-white/30">RATE</div>
        </div>
      </div>

      {/* Bar Chart */}
      {data.labels.length > 0 && (
        <div className="space-y-3">
          {/* CPU (completion rate) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] text-white/40">CPU_LOAD (completion %)</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {data.cpuLoad.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                  <div
                    className="w-full bg-neon-cyan/80 rounded-t transition-all duration-500"
                    style={{ height: `${Math.max(4, (val / maxCpu) * 100)}%` }}
                    title={`${val}%`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RAM (study hours) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] text-white/40">RAM_USAGE (study hours)</span>
            </div>
            <div className="flex items-end gap-1 h-12">
              {data.ramUsage.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                  <div
                    className="w-full bg-neon-amber/80 rounded-t transition-all duration-500"
                    style={{ height: `${Math.max(4, (val / maxRam) * 100)}%` }}
                    title={`${val}h`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* NET (consistency) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] text-white/40">NET_LOAD (consistency %)</span>
            </div>
            <div className="flex items-end gap-1 h-12">
              {data.netLoad.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                  <div
                    className="w-full bg-neon-green/80 rounded-t transition-all duration-500"
                    style={{ height: `${Math.max(4, (val / maxNet) * 100)}%` }}
                    title={`${val}%`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex gap-1 overflow-hidden">
            {data.labels
              .filter((_, i) => i % Math.ceil(data.labels.length / 8) === 0)
              .map((label, i) => (
                <div key={i} className="flex-1 text-center font-mono text-[8px] text-white/20 truncate">
                  {label}
                </div>
              ))}
          </div>
        </div>
      )}

      {data.labels.length === 0 && (
        <div className="font-mono text-xs text-white/20 text-center py-4">
          &gt; NO_DATA_FOR_PERIOD. START_COMPLETING_TASKS.
        </div>
      )}
    </div>
  );
}
