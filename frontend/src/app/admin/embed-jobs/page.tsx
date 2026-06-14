'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RefreshCw, Trash2, Zap, AlertTriangle, CheckCircle, Clock, Loader2, BarChart3, Database } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
type JobType = 'embed_document' | 'reembed_all' | 'cleanup_garbage';

interface EmbedJob {
  id: string;
  type: JobType;
  status: JobStatus;
  payload: Record<string, unknown>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  attempts: number;
  result?: Record<string, unknown>;
}

interface JobStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  byType: Record<JobType, number>;
  recentErrors: { jobId: string; type: JobType; error: string; at: string }[];
}

const STATUS_STYLES: Record<JobStatus, { color: string; bg: string; icon: typeof Clock }> = {
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Clock },
  processing: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Loader2 },
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle },
  failed: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: AlertTriangle },
};

const TYPE_LABELS: Record<JobType, string> = {
  embed_document: 'Embed Document',
  reembed_all: 'Re-embed All',
  cleanup_garbage: 'Cleanup',
};

export default function EmbedJobsPage() {
  const [mounted, setMounted] = useState(false);
  const [jobs, setJobs] = useState<EmbedJob[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [actionPending, setActionPending] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get('/admin/embed-jobs', { params: { limit: 100, ...(filter !== 'all' ? { status: filter } : {}) } }),
        api.get('/admin/embed-jobs/stats'),
      ]);
      setJobs(jobsRes.data?.data?.jobs || []);
      setStats(statsRes.data?.data || null);
    } catch (err) {
      toast.error('Failed to load embed jobs');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!mounted) return;
    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [mounted, fetchData]);

  const handleAction = async (action: 'flush' | 'reembed' | 'cleanup') => {
    setActionPending(action);
    try {
      const res = await api.post(`/admin/embed-jobs/${action}`);
      toast.success(res.data?.message || `${action} triggered`);
      await fetchData();
    } catch (err) {
      toast.error(`${action} failed`);
    } finally {
      setActionPending(null);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#64748b] font-mono">[ loading embed jobs... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#f8fafc] font-mono flex items-center gap-2">
            <Database className="w-6 h-6 text-[#22d3ee]" />
            Embed Queue
          </h1>
          <p className="text-sm text-[#64748b] font-mono mt-1">
            <span className="text-[#22d3ee]">//</span> Auto-train cron jobs (Mục #6)
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 rounded-lg hover:bg-[#22d3ee]/20 transition-colors font-mono text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Activity} label="Total" value={stats.total} color="#22d3ee" />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="#facc15" />
          <StatCard icon={Loader2} label="Processing" value={stats.processing} color="#60a5fa" />
          <StatCard icon={CheckCircle} label="Completed" value={stats.completed} color="#34d399" />
          <StatCard icon={AlertTriangle} label="Failed" value={stats.failed} color="#f87171" />
          <StatCard icon={Zap} label="Embed Docs" value={stats.byType.embed_document} color="#a78bfa" />
          <StatCard icon={BarChart3} label="Re-embed" value={stats.byType.reembed_all} color="#fb923c" />
          <StatCard icon={Trash2} label="Cleanup" value={stats.byType.cleanup_garbage} color="#94a3b8" />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleAction('reembed')}
          disabled={actionPending !== null}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors font-mono text-sm disabled:opacity-50"
        >
          {actionPending === 'reembed' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Trigger Re-embed
        </button>
        <button
          onClick={() => handleAction('cleanup')}
          disabled={actionPending !== null}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors font-mono text-sm disabled:opacity-50"
        >
          {actionPending === 'cleanup' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Trigger Cleanup
        </button>
        <button
          onClick={() => handleAction('flush')}
          disabled={actionPending !== null}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors font-mono text-sm disabled:opacity-50"
        >
          {actionPending === 'flush' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          Flush Queue
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-[#22d3ee]/10">
        {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-mono text-sm transition-colors ${
              filter === f
                ? 'text-[#22d3ee] border-b-2 border-[#22d3ee]'
                : 'text-[#64748b] hover:text-[#f8fafc]'
            }`}
          >
            {f}
            {stats && f !== 'all' && (
              <span className="ml-1.5 text-[10px] opacity-60">
                ({stats[f]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Jobs table */}
      <div className="bg-[#0d1117]/60 border border-[#22d3ee]/10 rounded-xl overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-12 text-center text-[#64748b] font-mono">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No jobs found</p>
            <p className="text-xs mt-1 opacity-60">Upload a document or trigger a job above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead className="bg-[#0d1117]/80 border-b border-[#22d3ee]/10">
                <tr>
                  <th className="px-4 py-3 text-left text-[#64748b] text-xs font-semibold">JOB ID</th>
                  <th className="px-4 py-3 text-left text-[#64748b] text-xs font-semibold">TYPE</th>
                  <th className="px-4 py-3 text-left text-[#64748b] text-xs font-semibold">STATUS</th>
                  <th className="px-4 py-3 text-left text-[#64748b] text-xs font-semibold">ATTEMPTS</th>
                  <th className="px-4 py-3 text-left text-[#64748b] text-xs font-semibold">CREATED</th>
                  <th className="px-4 py-3 text-left text-[#64748b] text-xs font-semibold">DETAILS</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {jobs.map((job) => {
                    const style = STATUS_STYLES[job.status];
                    const Icon = style.icon;
                    const duration = job.completedAt && job.startedAt
                      ? `${new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()}ms`
                      : job.startedAt
                        ? `${Math.floor((Date.now() - new Date(job.startedAt).getTime()) / 1000)}s running`
                        : '-';
                    return (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-[#22d3ee]/5 hover:bg-[#22d3ee]/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-[#94a3b8] text-xs">
                          <code className="bg-[#0d1117] px-1.5 py-0.5 rounded">
                            {job.id.slice(0, 16)}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-[#f8fafc]">
                          {TYPE_LABELS[job.type]}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${style.bg} ${style.color}`}>
                            <Icon className={`w-3 h-3 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#94a3b8]">
                          {job.attempts}
                        </td>
                        <td className="px-4 py-3 text-[#64748b] text-xs">
                          <div>{new Date(job.createdAt).toLocaleTimeString()}</div>
                          <div className="text-[10px] opacity-60">{duration}</div>
                        </td>
                        <td className="px-4 py-3 text-[#94a3b8] text-xs max-w-md">
                          {job.error ? (
                            <span className="text-red-400 break-words">{job.error}</span>
                          ) : job.result ? (
                            <code className="text-emerald-400">
                              {JSON.stringify(job.result)}
                            </code>
                          ) : (
                            <span className="opacity-50">-</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent errors */}
      {stats && stats.recentErrors.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-red-400 font-mono mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Recent Errors
          </h3>
          <ul className="space-y-1.5 text-xs font-mono">
            {stats.recentErrors.map((e) => (
              <li key={e.jobId} className="text-[#94a3b8]">
                <span className="text-red-400">[{e.type}]</span>{' '}
                <code className="text-[#64748b]">{e.jobId.slice(0, 16)}</code>{' '}
                <span className="text-[#f87171]">{e.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Activity; label: string; value: number; color: string }) {
  return (
    <div className="bg-[#0d1117]/60 border border-[#22d3ee]/10 rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-[#64748b] font-mono uppercase">{label}</div>
        <div className="text-xl font-bold font-mono" style={{ color }}>
          {value}
        </div>
      </div>
    </div>
  );
}
