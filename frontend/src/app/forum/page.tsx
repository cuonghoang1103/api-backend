'use client';

/**
 * /forum — "Diễn đàn / Tin tức" (admin announcements)
 * ====================================================
 * Public list of admin-authored announcements. Pinned first. Admins get
 * a "＋ Đăng thông báo" button that opens a create modal (title, body,
 * category, optional cover upload). Realtime new-announcement popups are
 * handled globally by AnnouncementBotPopup — this page just lists them.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Plus, Pin, X, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  announcementApi,
  fileApi,
  type Announcement,
  type AnnouncementCategory,
} from '@/lib/api';
import SmartImage from '@/components/ui/SmartImage';

// ── Category styling ──────────────────────────────────────────
const CATEGORY_META: Record<
  AnnouncementCategory,
  { label: string; emoji: string; color: string; bg: string }
> = {
  maintenance: { label: 'Bảo trì', emoji: '🛠️', color: '#f59e0b', bg: 'rgba(245,158,11,0.14)' },
  update: { label: 'Cập nhật', emoji: '🚀', color: '#3b82f6', bg: 'rgba(59,130,246,0.14)' },
  docs: { label: 'Tài liệu', emoji: '📚', color: '#14b8a6', bg: 'rgba(20,184,166,0.14)' },
  general: { label: 'Chung', emoji: '📢', color: '#a855f7', bg: 'rgba(168,85,247,0.14)' },
};

const CATEGORY_ORDER: AnnouncementCategory[] = ['general', 'update', 'maintenance', 'docs'];

function isAdminUser(roles: string[] | undefined | null): boolean {
  return (roles ?? []).some(
    (r) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN',
  );
}

function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(0, Math.floor((now - then) / 1000));
  if (s < 60) return 'Vừa xong';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

function CategoryBadge({ category }: { category: AnnouncementCategory }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.general;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ color: meta.color, background: meta.bg }}
    >
      <span>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}

export default function ForumPage() {
  const router = useRouter();
  // Admin gate — server-verified (the local persisted roles array is
  // often empty after rehydrate, which hid the "Đăng thông báo" button
  // from real admins). Mirrors NavigationDock's /api/auth/admin-check.
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/admin-check', {
          credentials: 'include',
          cache: 'no-store',
        });
        if (!res.ok || !alive) return;
        const data = await res.json();
        if (alive) setIsAdmin(isAdminUser(data.data?.roles));
      } catch {
        /* not signed in / offline — stays non-admin */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const [items, setItems] = useState<Announcement[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const loadedOnce = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await announcementApi.list(undefined, 20);
      const data = res.data.data;
      setItems(data.items ?? []);
      setNextCursor(data.nextCursor ?? null);
    } catch {
      setError('Không tải được danh sách thông báo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;
    void load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loadingMore || nextCursor == null) return;
    setLoadingMore(true);
    try {
      const res = await announcementApi.list(nextCursor, 20);
      const data = res.data.data;
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...(data.items ?? []).filter((i) => !seen.has(i.id))];
      });
      setNextCursor(data.nextCursor ?? null);
    } catch {
      toast.error('Không tải được thêm thông báo.');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextCursor]);

  // Pinned first, then newest. The server may already order this way; we
  // sort defensively so the UI is correct regardless.
  const ordered = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [items]);

  const handleCreated = (created: Announcement) => {
    setItems((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
    setShowCompose(false);
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(168,85,247,0.14)' }}
            >
              <Megaphone className="h-5 w-5" style={{ color: '#a855f7' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
                Diễn đàn / Tin tức
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Thông báo chính thức từ quản trị viên
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowCompose(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#d946ef)' }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng thông báo</span>
              <span className="sm:hidden">Đăng</span>
            </button>
          )}
        </div>

        {/* Body */}
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl"
                style={{ background: 'var(--bg-card)' }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
            <button
              onClick={() => void load()}
              className="mt-3 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
            >
              Thử lại
            </button>
          </div>
        ) : ordered.length === 0 ? (
          <div className="rounded-2xl border p-12 text-center" style={{ borderColor: 'var(--border-color)' }}>
            <Megaphone className="mx-auto mb-3 h-10 w-10" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Chưa có thông báo nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordered.map((a) => (
              <AnnouncementCard key={a.id} a={a} onOpen={() => router.push(`/forum/${a.id}`)} />
            ))}

            {nextCursor != null && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-60"
                  style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  Tải thêm
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCompose && (
          <ComposeModal onClose={() => setShowCompose(false)} onCreated={handleCreated} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────
function AnnouncementCard({ a, onOpen }: { a: Announcement; onOpen: () => void }) {
  const author = a.author;
  const authorName =
    author?.displayName || author?.fullName || author?.username || 'Admin';
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpen}
      className="group cursor-pointer overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      {a.coverImageUrl && (
        <div className="relative aspect-[2.4/1] w-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
          <SmartImage
            src={a.coverImageUrl}
            alt={a.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <CategoryBadge category={a.category} />
          {a.isPinned && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
              style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.12)' }}
            >
              <Pin className="h-3 w-3" />
              Ghim
            </span>
          )}
          <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
            {relativeDate(a.createdAt)}
          </span>
        </div>

        <h2 className="mb-1.5 text-lg font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
          {a.title}
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {a.body}
        </p>

        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {authorName}
        </p>
      </div>
    </motion.article>
  );
}

// ── Compose modal (admin only) ────────────────────────────────
function ComposeModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (a: Announcement) => void;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('general');
  const [isPinned, setIsPinned] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fileApi.upload(file, 'images');
      const url = res.data?.data?.url as string | undefined;
      if (!url) throw new Error('no url');
      setCoverImageUrl(url);
    } catch {
      toast.error('Tải ảnh bìa thất bại.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề.');
      return;
    }
    if (!body.trim()) {
      toast.error('Vui lòng nhập nội dung.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await announcementApi.create({
        title: title.trim(),
        body: body.trim(),
        category,
        coverImageUrl: coverImageUrl ?? undefined,
        isPinned,
      });
      toast.success('Đã đăng thông báo.');
      onCreated(res.data.data);
    } catch {
      toast.error('Đăng thông báo thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
      <motion.div
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl sm:max-w-lg sm:rounded-3xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Đăng thông báo mới
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Tiêu đề
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Bảo trì hệ thống ngày 10/07"
              className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Nội dung
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="Nội dung thông báo... (xuống dòng được giữ nguyên, link tự nhận diện)"
              className="w-full resize-y rounded-xl border px-3.5 py-2.5 text-sm outline-none"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Danh mục
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ORDER.map((c) => {
                const meta = CATEGORY_META[c];
                const active = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition"
                    style={{
                      color: active ? meta.color : 'var(--text-secondary)',
                      background: active ? meta.bg : 'var(--bg-surface)',
                      border: `1px solid ${active ? meta.color : 'var(--border-color)'}`,
                    }}
                  >
                    <span>{meta.emoji}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Ảnh bìa (tuỳ chọn)
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload(f);
                e.target.value = '';
              }}
            />
            {coverImageUrl ? (
              <div className="relative overflow-hidden rounded-xl">
                <SmartImage src={coverImageUrl} alt="cover" className="h-40 w-full object-cover" />
                <button
                  onClick={() => setCoverImageUrl(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                  aria-label="Xoá ảnh bìa"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-6 text-sm disabled:opacity-60"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải ảnh...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" />
                    Chọn ảnh bìa
                  </>
                )}
              </button>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="h-4 w-4 accent-violet-500"
            />
            Ghim thông báo lên đầu
          </label>
        </div>

        <div
          className="sticky bottom-0 flex gap-3 border-t px-5 py-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium"
            style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
          >
            Huỷ
          </button>
          <button
            onClick={() => void handleSubmit()}
            disabled={submitting || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#d946ef)' }}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Đăng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
