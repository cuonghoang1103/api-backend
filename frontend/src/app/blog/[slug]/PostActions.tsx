'use client';

import { useState } from 'react';
import { Download, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { blogApi } from '@/lib/api';

/**
 * Client island for the two interactive bits of a resource post: getting
 * the source code (which increments a counter server-side first) and
 * sharing the permalink. Everything else on the page is server-rendered.
 */
export default function PostActions({
  postId,
  sourceUrl,
  title,
  url,
}: {
  postId: number;
  sourceUrl: string | null;
  title: string;
  url: string;
}) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGetSource = async () => {
    if (!sourceUrl || busy) return;
    setBusy(true);
    // The counter is telemetry, not a gate: if recording fails, the
    // reader still gets the link.
    try {
      const res = await blogApi.recordDownload(postId);
      window.open(res.data?.data?.url || sourceUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(sourceUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* cancelled → fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Đã sao chép link bài viết');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Không thể sao chép link');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {sourceUrl && (
        <button
          onClick={handleGetSource}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-violet to-neon-fuchsia px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)] transition-all active:scale-95 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {busy ? 'Đang mở…' : 'Lấy source code'}
        </button>
      )}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-white/[0.04] px-3.5 py-2.5 text-sm text-text-secondary transition-all hover:border-neon-violet/30 hover:text-text-primary active:scale-95"
        aria-label="Chia sẻ bài viết"
      >
        {copied ? <Check className="h-4 w-4 text-neon-emerald" /> : <Share2 className="h-4 w-4" />}
        Chia sẻ
      </button>
    </div>
  );
}
