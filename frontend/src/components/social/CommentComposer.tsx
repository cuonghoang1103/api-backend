'use client';

// CommentComposer — a self-contained, pinned comment composer used
// by <PostCommentModal />. It mirrors the inline composer that lives
// inside PostCard (emoji / GIF / sticker pickers, single media
// preview, @mention autocomplete, optimistic submit) but is packaged
// as a standalone bottom bar so the modal can pin it below a
// scrolling comment list.

import { useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSocialStore } from '@/store/socialStore';
import { socialApi, fileApi } from '@/lib/api';
import MentionAutocomplete from '@/components/social/MentionAutocomplete';
import EmojiPickerPopover from '@/components/messaging/EmojiPickerPopover';
import GifPicker from '@/components/messaging/GifPicker';
import StickerPicker from '@/components/messaging/StickerPicker';
import type { SocialComment } from '@/types/social';

export default function CommentComposer({
  postId,
  parentId,
  autoFocus = false,
  onSubmitted,
  placeholder = 'Viết bình luận… (gõ @ để tag)',
}: {
  postId: number;
  parentId?: number;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  placeholder?: string;
}) {
  const addOptimisticComment = useSocialStore((s) => s.addOptimisticComment);

  const [text, setText] = useState('');
  // User ids the commenter @'d. Sent to the backend so it can fan
  // out NEW_MENTION notifications. Cleared on submit / when the
  // input is emptied.
  const [mentions, setMentions] = useState<Set<number>>(new Set());
  const [media, setMedia] = useState<{ url: string; kind: 'gif' | 'sticker' | 'image' } | null>(null);
  const [picker, setPicker] = useState<'emoji' | 'gif' | 'sticker' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Upload an image file to R2 and attach it as the comment's media. Reuses
  // the shared /files/upload endpoint (category 'images' → webp-optimised).
  const uploadImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Ảnh tối đa 10MB'); return; }
    setUploading(true);
    try {
      const res = await fileApi.upload(file, 'images');
      const url = (res.data as any)?.data?.url ?? (res.data as any)?.url;
      if (url) setMedia({ url, kind: 'image' });
      else toast.error('Tải ảnh thất bại');
    } catch {
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };
  // Anchor so the media pickers portal ABOVE the bar (they use
  // fixed positioning relative to this element).
  const barRef = useRef<HTMLDivElement | null>(null);

  // Auto-focus ONLY on non-touch (desktop). On phones auto-focusing pops the
  // keyboard the instant the modal opens, which — combined with the modal's
  // keyboard-inset lift — left the sheet looking blank + froze the page.
  // On mobile the user taps the field when ready.
  useEffect(() => {
    if (!autoFocus) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)')?.matches) return;
    inputRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && !media) || submitting) return;

    setSubmitting(true);
    const submittedText = text;
    const submittedMedia = media;
    const mentionsArr = Array.from(mentions);
    const tempId = Date.now();

    const optimistic: SocialComment = {
      id: tempId,
      postId,
      parentId: parentId ?? null,
      content: submittedText,
      mediaUrl: submittedMedia?.url ?? null,
      mediaKind: submittedMedia?.kind ?? null,
      likesCount: 0,
      repliesCount: 0,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: { id: 0, username: 'You', fullName: 'You', avatarUrl: null },
      isLiked: false,
      replies: [],
    };
    addOptimisticComment(postId, optimistic);

    // Reset the composer immediately (optimistic UX).
    setText('');
    setMentions(new Set());
    setMedia(null);
    setPicker(null);

    try {
      await socialApi.createComment({
        postId,
        parentId,
        content: submittedText,
        mentions: mentionsArr.length > 0 ? mentionsArr : undefined,
        mediaUrl: submittedMedia?.url,
        mediaKind: submittedMedia?.kind,
      });
    } catch {
      // Optimistic — the comment already shows; a failure here is
      // non-fatal (matches PostCard's inline composer behaviour).
    } finally {
      setSubmitting(false);
      onSubmitted?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-2 border-t p-3 min-w-0"
      style={{
        borderColor: 'var(--border-color)',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Media pickers — portal-anchored above the bar. */}
      <EmojiPickerPopover
        open={picker === 'emoji'}
        onClose={() => setPicker(null)}
        onPick={(emo) => setText((t) => t + emo)}
        anchorRef={barRef}
      />
      <GifPicker
        open={picker === 'gif'}
        onClose={() => setPicker(null)}
        onPick={(url) => { setMedia({ url, kind: 'gif' }); setPicker(null); }}
        anchorRef={barRef}
      />
      <StickerPicker
        open={picker === 'sticker'}
        onClose={() => setPicker(null)}
        onPick={(url) => { setMedia({ url, kind: 'sticker' }); setPicker(null); }}
        anchorRef={barRef}
      />

      <div
        className="flex flex-1 flex-col gap-2 rounded-2xl px-4 py-2.5 min-w-0"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
        }}
      >
        {media && (
          <div className="relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.url}
              alt={media.kind}
              className="max-h-28 w-auto max-w-[160px] rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={() => setMedia(null)}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[11px] leading-none text-white"
              aria-label="Bỏ media"
            >
              ×
            </button>
          </div>
        )}
        <div ref={barRef} className="flex items-center gap-2 min-w-0">
          {/* Hidden file input for the 📷 upload button. */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadImageFile(f);
              e.target.value = '';
            }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={text}
            onChange={(e) => {
              const next = e.target.value;
              setText(next);
              if (next === '') setMentions(new Set());
            }}
            // Paste an image straight into the comment (Cmd/Ctrl+V of a
            // screenshot or copied picture) → upload + attach.
            onPaste={(e) => {
              const img = Array.from(e.clipboardData?.items ?? []).find((it) => it.type.startsWith('image/'));
              if (img) {
                const f = img.getAsFile();
                if (f) { e.preventDefault(); void uploadImageFile(f); }
              }
            }}
            // text-base (16px) avoids iOS focus zoom.
            className="flex-1 bg-transparent text-base outline-none min-w-0"
            style={{ color: 'var(--text-primary)' }}
          />
          {/* Image upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-shrink-0 opacity-80 hover:opacity-100 disabled:opacity-40"
            title="Thêm ảnh"
          >
            {uploading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ImageIcon className="h-[18px] w-[18px]" style={{ color: '#22c55e' }} />}
          </button>
          <button
            type="button"
            onClick={() => setPicker((p) => (p === 'emoji' ? null : 'emoji'))}
            className="flex-shrink-0 text-base leading-none opacity-80 hover:opacity-100"
            title="Emoji"
          >
            😊
          </button>
          <button
            type="button"
            onClick={() => setPicker((p) => (p === 'gif' ? null : 'gif'))}
            className="flex-shrink-0 rounded px-1 text-[11px] font-bold opacity-80 hover:opacity-100"
            style={{ color: '#8B5CF6' }}
            title="GIF"
          >
            GIF
          </button>
          <button
            type="button"
            onClick={() => setPicker((p) => (p === 'sticker' ? null : 'sticker'))}
            className="flex-shrink-0 text-base leading-none opacity-80 hover:opacity-100"
            title="Nhãn dán"
          >
            🏷️
          </button>
          <button
            type="submit"
            disabled={(!text.trim() && !media) || submitting}
            className="flex-shrink-0 rounded-xl p-1.5 transition-all disabled:opacity-40"
            style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}
            aria-label="Gửi"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* @mention autocomplete — listens to the input caret. */}
      <MentionAutocomplete
        textareaRef={inputRef}
        value={text}
        onChange={setText}
        onPick={(item) => {
          setMentions((prev) => {
            if (prev.has(item.id)) return prev;
            const next = new Set(prev);
            next.add(item.id);
            return next;
          });
        }}
        offsetY={36}
      />
    </form>
  );
}
