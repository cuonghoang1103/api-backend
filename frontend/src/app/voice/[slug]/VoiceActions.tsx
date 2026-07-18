'use client';

/**
 * VoiceActions — like + share on the detail page. Like requires auth and
 * toggles optimistically; share uses the Web Share API with a clipboard
 * fallback.
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Heart, Share2, Check } from 'lucide-react';
import { voiceApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function VoiceActions({
  postId,
  title,
  url,
  initialLiked,
  initialLikes,
}: {
  postId: number;
  title: string;
  url: string;
  initialLiked: boolean;
  initialLikes: number;
}) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleLike = async () => {
    if (!isAuthed) { toast.error('Đăng nhập để thích'); return; }
    if (busy) return;
    setBusy(true);
    setLiked((v) => !v);
    setLikes((n) => n + (liked ? -1 : 1));
    try {
      const r = await voiceApi.likePost(postId);
      setLiked(r.data.data.liked);
      setLikes(r.data.data.likeCount);
    } catch {
      setLiked(initialLiked);
      setLikes(initialLikes);
      toast.error('Không thể thích lúc này');
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Đã sao chép liên kết');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLike}
        className={[
          'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all active:scale-95',
          liked ? 'bg-neon-red/15 text-neon-red border-neon-red/30' : 'bg-white/[0.04] text-text-secondary border-darkborder hover:border-neon-red/30 hover:text-neon-red',
        ].join(' ')}
      >
        <Heart className={['w-4 h-4', liked ? 'fill-current' : ''].join(' ')} />
        {likes > 0 ? likes : ''} Thích
      </button>
      <button
        onClick={share}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-text-secondary border border-darkborder hover:text-text-primary hover:border-neon-violet/30 transition-all active:scale-95"
      >
        {copied ? <Check className="w-4 h-4 text-neon-emerald" /> : <Share2 className="w-4 h-4" />}
        Chia sẻ
      </button>
    </div>
  );
}
