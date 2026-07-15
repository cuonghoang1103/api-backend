'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bookmark, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Client island for the SSR article detail page. The article
 * body is fully server-rendered (good for SEO); only these two
 * interactive controls need to run on the client:
 *
 *   - Bookmark: toggles the article id in the same localStorage
 *     key the index page uses (`tech-trends:bookmarks`), so a
 *     bookmark added here shows up on /tech-trends too.
 *   - Share: Web Share API on mobile, clipboard-copy fallback
 *     on desktop. This is the permalink the index page's card
 *     never had.
 */
export default function ArticleActions({
  articleId,
  title,
  summary,
  url,
}: {
  articleId: number;
  title: string;
  summary: string;
  url: string;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('tech-trends:bookmarks');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setBookmarked(arr.includes(articleId));
      }
    } catch {
      /* localStorage unavailable — leave unbookmarked */
    }
  }, [articleId]);

  const toggleBookmark = useCallback(() => {
    setBookmarked((prev) => {
      const next = !prev;
      try {
        const raw = localStorage.getItem('tech-trends:bookmarks');
        const arr: number[] = raw ? (JSON.parse(raw) as number[]).filter((x) => Number.isFinite(x)) : [];
        const set = new Set(arr);
        if (next) set.add(articleId);
        else set.delete(articleId);
        localStorage.setItem('tech-trends:bookmarks', JSON.stringify([...set]));
      } catch {
        /* keep in-memory state only */
      }
      toast.success(next ? 'Đã lưu bài viết' : 'Đã bỏ lưu');
      return next;
    });
  }, [articleId]);

  const share = useCallback(async () => {
    // Native share sheet where available (mobile). We guard with
    // a try/catch because the user can cancel it (AbortError).
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: summary, url });
        return;
      } catch {
        // user cancelled or share failed → fall through to copy
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
  }, [title, summary, url]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleBookmark}
        className={[
          'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all active:scale-95',
          mounted && bookmarked
            ? 'bg-neon-violet/20 text-neon-violet border-neon-violet/30'
            : 'bg-white/[0.04] text-text-secondary border-darkborder hover:text-text-primary hover:border-neon-violet/30',
        ].join(' ')}
        aria-label={bookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}
      >
        <Bookmark className={['w-4 h-4', mounted && bookmarked ? 'fill-current' : ''].join(' ')} />
        <span>{mounted && bookmarked ? 'Đã lưu' : 'Lưu'}</span>
      </button>
      <button
        onClick={share}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-darkborder bg-white/[0.04] text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-all active:scale-95"
        aria-label="Chia sẻ"
      >
        {copied ? <Check className="w-4 h-4 text-neon-emerald" /> : <Share2 className="w-4 h-4" />}
        <span>{copied ? 'Đã sao chép' : 'Chia sẻ'}</span>
      </button>
    </div>
  );
}
