'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Check } from 'lucide-react';
import { socialApi } from '@/lib/api';
import { toast } from 'sonner';
import type { SocialPoll } from '@/types/social';
import { useSocialStore } from '@/store/socialStore';

interface PostPollProps {
  postId: number;
  poll: SocialPoll;
}

/**
 * Inline poll renderer for a post card.
 * - Unvoted: shows clickable rows (checkboxes for multi, radios for single)
 * - Voted OR post author: shows horizontal bars with the vote
 *   distribution. Toggling a different option immediately replaces
 *   the previous vote (the backend re-vote semantics).
 *
 * Updates flow through useSocialStore so the rest of the feed stays
 * consistent if the same poll is rendered elsewhere.
 */
export default function PostPoll({ postId, poll }: PostPollProps) {
  const updatePostPoll = useSocialStore((s) => (s as any).updatePostPoll);
  const [submitting, setSubmitting] = useState(false);
  // Defensive defaults — the backend should always send `userVotes`
  // (see serializePost in social.service.ts) but a stale client
  // bundle or a malformed post can still produce undefined here.
  // Crashing on "reading 'length' of undefined" was a real
  // production bug; we short-circuit to a sane default so the
  // surrounding card still renders.
  const safeUserVotes = Array.isArray(poll?.userVotes) ? poll!.userVotes : [];
  const safeOptions = Array.isArray(poll?.options) ? poll!.options : [];
  const safeTotalVotes = typeof poll?.totalVotes === 'number' ? poll!.totalVotes : 0;
  const [pending, setPending] = useState<number[]>(safeUserVotes);

  const total = Math.max(safeTotalVotes, 0);
  const hasVoted = safeUserVotes.length > 0;
  const showResults = hasVoted;

  const handleVote = async (optionId: number) => {
    if (submitting) return;
    if (poll.multiChoice) {
      setPending((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    } else {
      setPending([optionId]);
    }
  };

  const handleSubmit = async () => {
    if (pending.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      const res = await socialApi.votePoll(poll.id, pending);
      const fresh = res.data?.data;
      if (fresh && updatePostPoll) {
        updatePostPoll(postId, {
          ...poll,
          totalVotes: fresh.totalVotes,
          options: fresh.options,
          userVotes: pending,
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Vote failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="mt-3 rounded-2xl p-3"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <BarChart3 className="h-3.5 w-3.5 text-neon-violet" />
        <p className="text-sm font-semibold text-text-primary">{poll.question}</p>
      </div>

      <div className="space-y-1.5">
        {safeOptions.map((opt) => {
          const pct = total > 0 ? Math.round((opt.votesCount / total) * 100) : 0;
          const isVoted = safeUserVotes.includes(opt.id);
          const isPending = pending.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleVote(opt.id)}
              className="relative w-full overflow-hidden rounded-lg px-3 py-2 text-left text-xs"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${isPending ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.08)'}`,
                color: '#e2e8f0',
              }}
            >
              {showResults && (
                <motion.span
                  className="absolute inset-y-0 left-0"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: isVoted
                      ? 'linear-gradient(90deg, rgba(139,92,246,0.35), rgba(99,102,241,0.2))'
                      : 'rgba(255,255,255,0.04)',
                    zIndex: 0,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 truncate">
                  {showResults && isVoted && <Check className="h-3 w-3 text-neon-violet shrink-0" />}
                  <span className="truncate">{opt.text}</span>
                </span>
                {showResults && (
                  <span className="text-[10px] tabular-nums text-text-muted">{pct}%</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!showResults && pending.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-2 w-full rounded-lg py-1.5 text-xs font-medium text-white transition-opacity disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg, #8B5CF6, #6366F1)' }}
        >
          {submitting ? 'Đang gửi...' : 'Bình chọn'}
        </button>
      )}

      <p className="mt-2 text-[10px] text-text-muted">
        {total} {total === 1 ? 'lượt bình chọn' : 'lượt bình chọn'}
        {poll.multiChoice && ' · Có thể chọn nhiều'}
        {poll.closesAt && new Date(poll.closesAt) > new Date() && (
          <> · Đóng lúc {new Date(poll.closesAt).toLocaleDateString('vi-VN')}</>
        )}
      </p>
    </div>
  );
}
