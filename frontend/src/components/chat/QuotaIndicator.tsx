'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Zap, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface QuotaStatus {
  used: { minute: number; day: number; month: number };
  limit: { minute: number; day: number; month: number };
  remaining: { minute: number; day: number; month: number };
  resetAt: { minute: string; day: string; month: string };
  resetIn: { minute: number; day: number; month: number };
  source: 'redis' | 'postgres_fallback';
}

interface QuotaIndicatorProps {
  /** Refresh interval in ms (default 30s) */
  refreshInterval?: number;
  /** Compact mode (just shows the day meter) */
  compact?: boolean;
}

function formatResetTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function getColorForUsage(percent: number): string {
  if (percent < 60) return '#22d3ee'; // cyan
  if (percent < 85) return '#facc15'; // yellow
  return '#f87171'; // red
}

export default function QuotaIndicator({ refreshInterval = 30000, compact = false }: QuotaIndicatorProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [quota, setQuota] = useState<QuotaStatus | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchQuota = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get('/quota/me');
      if (res.data?.success) {
        setQuota(res.data.data);
      }
    } catch {
      // Silent fail — quota is non-critical info
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    fetchQuota();
    const interval = setInterval(fetchQuota, refreshInterval);
    return () => clearInterval(interval);
  }, [mounted, isAuthenticated, fetchQuota, refreshInterval]);

  // Don't render anything if not authenticated or not mounted (avoid hydration mismatch)
  if (!mounted || !isAuthenticated) return null;
  if (!quota) {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#64748b]">
        <Activity className="w-3 h-3" />
        <span>quota: ...</span>
      </div>
    );
  }

  const dayPercent = (quota.used.day / quota.limit.day) * 100;
  const minutePercent = (quota.used.minute / quota.limit.minute) * 100;
  const dayColor = getColorForUsage(dayPercent);
  const minuteColor = getColorForUsage(minutePercent);

  const isDayExhausted = quota.used.day >= quota.limit.day;
  const isMinuteExhausted = quota.used.minute >= quota.limit.minute;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <Zap className="w-3 h-3" style={{ color: dayColor }} />
          <span style={{ color: dayColor }}>{quota.remaining.day}/{quota.limit.day}</span>
        </div>
        <div className="w-16 h-1 bg-[#22d3ee]/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: dayColor }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, dayPercent)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetail(!showDetail)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#22d3ee]/5 transition-colors group"
        title="Click to view detailed quota"
      >
        <Activity className="w-3.5 h-3.5 text-[#22d3ee] group-hover:rotate-12 transition-transform" />
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="text-[#64748b]">daily:</span>
            <span style={{ color: dayColor }} className="font-semibold">
              {quota.remaining.day}/{quota.limit.day}
            </span>
            {(isDayExhausted || isMinuteExhausted) && (
              <AlertTriangle className="w-3 h-3 text-amber-400" />
            )}
          </div>
          <div className="w-20 h-1 bg-[#22d3ee]/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: dayColor }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, dayPercent)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 z-50
              bg-[#0d1117]/95 backdrop-blur-xl
              border border-[#22d3ee]/20 rounded-xl
              shadow-[0_8px_32px_rgba(0,0,0,0.4)]
              p-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#22d3ee]/10">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#22d3ee]" />
                <span className="text-[#f8fafc] font-semibold">QUOTA</span>
              </div>
              <span className="text-[10px] text-[#64748b]">{quota.source}</span>
            </div>

            {/* Per-minute */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#64748b]">per-minute</span>
                <span className="font-semibold" style={{ color: minuteColor }}>
                  {quota.used.minute}/{quota.limit.minute}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#22d3ee]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: minuteColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, minutePercent)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-[#64748b]">
                <Clock className="w-2.5 h-2.5" />
                <span>resets in {formatResetTime(quota.resetIn.minute)}</span>
              </div>
            </div>

            {/* Per-day */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#64748b]">daily</span>
                <span className="font-semibold" style={{ color: dayColor }}>
                  {quota.used.day}/{quota.limit.day}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#22d3ee]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: dayColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, dayPercent)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-[#64748b]">
                <Clock className="w-2.5 h-2.5" />
                <span>resets in {formatResetTime(quota.resetIn.day)}</span>
              </div>
            </div>

            {/* Per-month */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#64748b]">monthly</span>
                <span className="font-semibold text-[#f8fafc]">
                  {quota.used.month}/{quota.limit.month}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#22d3ee]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#22d3ee]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (quota.used.month / quota.limit.month) * 100)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-[#64748b]">
                <Clock className="w-2.5 h-2.5" />
                <span>resets in {formatResetTime(quota.resetIn.month)}</span>
              </div>
            </div>

            {isDayExhausted && (
              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-red-300 leading-relaxed">
                  Daily quota exhausted. Resets in {formatResetTime(quota.resetIn.day)}.
                </div>
              </div>
            )}

            <div className="mt-3 pt-2 border-t border-[#22d3ee]/10 text-[10px] text-[#64748b]/60 text-center">
              <span className="text-[#22d3ee]/60">user:</span> {user?.email || 'unknown'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
