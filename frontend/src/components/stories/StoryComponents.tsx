'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Globe, Users, Lock, Trash2 } from 'lucide-react';
import { storiesApi, type Story, type StoryHighlight } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StoryBarProps {
  onCreateStory?: () => void;
}

export default function StoryBar({ onCreateStory }: StoryBarProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRing, setSelectedRing] = useState<{ userId: number; username: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const res = await storiesApi.getFeedStories();
      setStories(res.data.data || []);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 120;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className="relative rounded-2xl border border-darkborder bg-darkcard/40 p-3">
        <div className="flex items-center gap-2">
          {/* Scroll left button */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-darkbg/80 text-text-muted hover:bg-darkbg hover:text-text-primary transition-colors z-10"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Stories scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Add Story button (own profile) */}
            {user && (
              <button
                onClick={onCreateStory}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-darkbg border-2 border-dashed border-neon-violet/50 flex items-center justify-center group-hover:border-neon-violet transition-colors">
                    <Plus size={24} className="text-neon-violet" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-neon-violet flex items-center justify-center">
                    <Plus size={12} className="text-white" />
                  </div>
                </div>
                <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors">Tin của bạn</span>
              </button>
            )}

            {/* Story avatars */}
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedRing({ userId: story.userId, username: story.user.username })}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div className="relative">
                  {/* Gradient ring for unviewed stories */}
                  {!story.hasViewed && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-violet via-neon-pink to-neon-cyan p-0.5">
                      <div className="w-full h-full rounded-full" />
                    </div>
                  )}
                  {/* Avatar */}
                  <div className={cn(
                    "relative h-14 w-14 rounded-full overflow-hidden bg-darkbg",
                    !story.hasViewed && "m-0.5"
                  )}>
                    {story.user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.user.avatarUrl}
                        alt={story.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-violet to-neon-pink text-white font-bold text-lg">
                        {(story.user.displayName || story.user.username).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Username badge */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-darkbg text-[9px] font-medium text-text-primary truncate max-w-[60px]">
                    {story.user.username.slice(0, 8)}
                  </div>
                </div>
                <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors truncate max-w-[70px]">
                  {story.user.displayName || story.user.username}
                </span>
              </button>
            ))}
          </div>

          {/* Scroll right button */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-darkbg/80 text-text-muted hover:bg-darkbg hover:text-text-primary transition-colors z-10"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Story Ring Viewer */}
      {selectedRing && (
        <StoryRingViewer
          userId={selectedRing.userId}
          username={selectedRing.username}
          onClose={() => setSelectedRing(null)}
        />
      )}
    </>
  );
}

// ─── Story Ring Viewer ────────────────────────────────────────────────
interface StoryRingViewerProps {
  userId: number;
  username: string;
  onClose: () => void;
}

function StoryRingViewer({ userId, username, onClose }: StoryRingViewerProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    loadStories();
  }, [userId]);

  const loadStories = async () => {
    try {
      const res = await storiesApi.getRingStories();
      // Filter stories by this user
      const userStories = (res.data.data || []).filter((s: Story) => s.userId === userId);
      setStories(userStories);
      if (userStories.length > 0) {
        await storiesApi.viewStory(userStories[0].id);
      }
    } catch {
      toast.error('Không tải được tin');
    } finally {
      setLoading(false);
    }
  };

  const goNext = async () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      await storiesApi.viewStory(stories[currentIndex + 1].id);
    } else {
      onClose();
    }
  };

  const goPrev = async () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        onClick={onClose}
      >
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
      </motion.div>
    );
  }

  if (stories.length === 0) {
    return null;
  }

  const story = stories[currentIndex];
  const progress = ((currentIndex + 1) / stories.length) * 100;
  const isOwn = user?.id === story.userId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col"
      onClick={goNext}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-3">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: i <= currentIndex ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.user.username}`}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <div>
            <Link
              href={`/profile/${story.userId}`}
              className="font-semibold text-white hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {story.user.displayName || story.user.username}
            </Link>
            <p className="text-xs text-white/70">
              {formatStoryTime(story.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOwn && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <MoreHorizontal size={20} className="text-white" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Own story menu */}
        {showMenu && isOwn && (
          <div
            className="absolute right-4 top-14 bg-darkcard/95 rounded-xl border border-darkborder p-2 min-w-[160px] z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={async () => {
                try {
                  await storiesApi.deleteStory(story.id);
                  toast.success('Đã xoá tin');
                  setStories(stories.filter((s) => s.id !== story.id));
                  if (stories.length <= 1) onClose();
                  setShowMenu(false);
                } catch {
                  toast.error('Không xoá được tin');
                }
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Xoá tin
            </button>
          </div>
        )}
      </div>

      {/* Media content */}
      <div className="flex-1 flex items-center justify-center relative">
        {story.mediaType === 'VIDEO' || story.mediaUrl?.endsWith('.mp4') ? (
          <video
            src={story.mediaUrl || undefined}
            className="w-full h-full object-contain"
            autoPlay
            loop
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        ) : story.mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={story.mediaUrl}
            alt=""
            className="w-full h-full object-contain"
          />
        ) : (
          /* Text-only story */
          <div
            className="w-full h-full flex items-center justify-center p-8"
            style={{ background: story.backgroundColor || '#1a1a2e' }}
          >
            <p className="text-white text-2xl font-medium text-center">{story.caption}</p>
          </div>
        )}

        {/* Caption overlay */}
        {story.caption && story.mediaUrl && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-center font-medium">{story.caption}</p>
          </div>
        )}

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        )}
      </div>

      {/* Views count */}
      {story.viewsCount > 0 && (
        <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white/70 text-sm">
          <Eye size={14} />
          {story.viewsCount} lượt xem
        </div>
      )}
    </motion.div>
  );
}

// ─── Create Story Modal ────────────────────────────────────────────────
interface CreateStoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateStoryModal({ open, onClose }: CreateStoryModalProps) {
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'FRIENDS' | 'PRIVATE'>('PUBLIC');
  const [mediaUrl, setMediaUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!caption.trim() && !mediaUrl.trim()) {
      toast.error('Vui lòng nhập nội dung hoặc chọn ảnh/video');
      return;
    }

    setSubmitting(true);
    try {
      await storiesApi.create({
        caption: caption.trim() || undefined,
        mediaUrl: mediaUrl.trim() || undefined,
        visibility,
        backgroundColor,
      });
      toast.success('Đã đăng tin');
      onClose();
      setCaption('');
      setMediaUrl('');
    } catch {
      toast.error('Không đăng được tin');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const bgColors = ['#1a1a2e', '#2d1b4e', '#1b2d4e', '#2d1b1b', '#1b4e2d', '#4e2d1b'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-darkcard rounded-2xl border border-darkborder overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-darkborder">
            <h3 className="font-semibold text-text-primary">Tạo Tin</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Visibility */}
            <div className="flex gap-2">
              {(['PUBLIC', 'FRIENDS', 'PRIVATE'] as const).map((v) => {
                const Icon = v === 'PUBLIC' ? Globe : v === 'FRIENDS' ? Users : Lock;
                const label = v === 'PUBLIC' ? 'Công khai' : v === 'FRIENDS' ? 'Bạn bè' : 'Chỉ mình tôi';
                return (
                  <button
                    key={v}
                    onClick={() => setVisibility(v)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors',
                      visibility === v
                        ? 'border-neon-violet bg-neon-violet/10 text-neon-violet'
                        : 'border-darkborder text-text-muted hover:bg-white/5'
                    )}
                  >
                    <Icon size={16} />
                    <span className="text-xs">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Caption / Text */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Viết gì đó..."
              className="w-full h-32 rounded-xl bg-darkbg border border-darkborder p-3 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-neon-violet/50"
              style={{ background: backgroundColor, color: '#fff' }}
            />

            {/* Background colors */}
            <div className="flex gap-2">
              {bgColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-transform',
                    backgroundColor === color && 'scale-110 ring-2 ring-white'
                  )}
                  style={{ background: color }}
                />
              ))}
            </div>

            {/* Media URL */}
            <div>
              <label className="block text-sm text-text-muted mb-1.5">Link ảnh/video</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg bg-darkbg border border-darkborder px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
              />
            </div>

            {/* Preview */}
            {mediaUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-darkbg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-darkborder">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-text-muted hover:bg-white/5 transition-colors"
            >
              Huỷ
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-violet to-neon-pink text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Đang đăng...' : 'Đăng Tin'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Story Highlights ──────────────────────────────────────────────────
interface StoryHighlightsProps {
  userId: number;
  isOwn?: boolean;
  onCreateHighlight?: () => void;
}

export function StoryHighlights({ userId, isOwn, onCreateHighlight }: StoryHighlightsProps) {
  const [highlights, setHighlights] = useState<StoryHighlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHighlights();
  }, [userId]);

  const loadHighlights = async () => {
    try {
      const res = await storiesApi.getHighlights(userId);
      setHighlights(res.data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (loading || highlights.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
      {highlights.map((highlight) => (
        <button
          key={highlight.id}
          className="flex flex-col items-center gap-1.5 shrink-0 group"
        >
          <div className="relative">
            <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-darkborder group-hover:ring-neon-violet transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={highlight.stories[0]?.thumbnail || highlight.stories[0]?.mediaUrl || ''}
                alt={highlight.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors truncate max-w-[70px]">
            {highlight.name}
          </span>
        </button>
      ))}

      {/* Add Highlight button (for own profile) */}
      {isOwn && (
        <button
          onClick={onCreateHighlight}
          className="flex flex-col items-center gap-1.5 shrink-0 group"
        >
          <div className="h-16 w-16 rounded-full bg-darkbg border-2 border-dashed border-darkborder flex items-center justify-center group-hover:border-neon-violet transition-colors">
            <Plus size={20} className="text-text-muted" />
          </div>
          <span className="text-xs text-text-muted">Mới</span>
        </button>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatStoryTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return date.toLocaleDateString('vi-VN');
}
