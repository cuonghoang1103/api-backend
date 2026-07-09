'use client';

/**
 * /forum/[id] — announcement detail
 * ==================================
 * Full announcement view: cover, category badge, title, author, date and
 * the full body (whitespace-preserved + linkified). Admins can edit or
 * delete inline.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Megaphone, Pin, Pencil, Trash2, X, Loader2, ImagePlus,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  announcementApi,
  fileApi,
  type Announcement,
  type AnnouncementCategory,
} from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { UserAvatar } from '@/components/common/UserAvatar';
import SmartImage from '@/components/ui/SmartImage';
import { linkifyToNodes } from '@/lib/linkify';

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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idNum = Number(Array.isArray(params?.id) ? params.id[0] : params?.id);

  const roles = useAuthStore((s) => s.user?.roles);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAdmin = useMemo(() => isAdminUser(roles), [roles]);

  const [item, setItem] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(idNum)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await announcementApi.get(idNum);
      setItem(res.data.data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [idNum]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async () => {
    if (!item) return;
    if (!window.confirm('Xoá thông báo này?')) return;
    setDeleting(true);
    try {
      await announcementApi.remove(item.id);
      toast.success('Đã xoá thông báo.');
      router.push('/forum');
    } catch {
      toast.error('Xoá thất bại.');
      setDeleting(false);
    }
  };

  const meta = item ? CATEGORY_META[item.category] ?? CATEGORY_META.general : null;

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
        <Link
          href="/forum"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Diễn đàn
        </Link>

        {loading ? (
          <div className="space-y-4">
            <div className="h-48 animate-pulse rounded-2xl" style={{ background: 'var(--bg-card)' }} />
            <div className="h-8 w-2/3 animate-pulse rounded-lg" style={{ background: 'var(--bg-card)' }} />
            <div className="h-32 animate-pulse rounded-lg" style={{ background: 'var(--bg-card)' }} />
          </div>
        ) : notFound || !item || !meta ? (
          <div className="rounded-2xl border p-12 text-center" style={{ borderColor: 'var(--border-color)' }}>
            <Megaphone className="mx-auto mb-3 h-10 w-10" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Không tìm thấy thông báo này.</p>
            <Link
              href="/forum"
              className="mt-3 inline-block rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
            >
              Về Diễn đàn
            </Link>
          </div>
        ) : (
          <article
            className="overflow-hidden rounded-2xl border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            {item.coverImageUrl && (
              <div className="relative aspect-[2.4/1] w-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                <SmartImage
                  src={item.coverImageUrl}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-5 sm:p-7">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ color: meta.color, background: meta.bg }}
                >
                  <span>{meta.emoji}</span>
                  {meta.label}
                </span>
                {item.isPinned && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
                    style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.12)' }}
                  >
                    <Pin className="h-3 w-3" />
                    Ghim
                  </span>
                )}

                {isHydrated && isAdmin && (
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => setShowEdit(true)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                      style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Sửa
                    </button>
                    <button
                      onClick={() => void handleDelete()}
                      disabled={deleting}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium disabled:opacity-60"
                      style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e' }}
                    >
                      {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Xoá
                    </button>
                  </div>
                )}
              </div>

              <h1 className="mb-3 text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h1>

              {/* Author + date */}
              <div className="mb-5 flex items-center gap-3">
                <UserAvatar
                  user={
                    item.author
                      ? {
                          id: item.author.id,
                          username: item.author.username,
                          displayName: item.author.displayName ?? undefined,
                          fullName: item.author.fullName ?? undefined,
                          avatarUrl: item.author.avatarUrl ?? undefined,
                        }
                      : { id: 0, username: 'admin', displayName: 'Admin' }
                  }
                  size="sm"
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.author?.displayName || item.author?.fullName || item.author?.username || 'Admin'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div
                className="text-[15px] leading-relaxed"
                style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {linkifyToNodes(item.body)}
              </div>
            </div>
          </article>
        )}
      </div>

      <AnimatePresence>
        {showEdit && item && (
          <EditModal
            announcement={item}
            onClose={() => setShowEdit(false)}
            onSaved={(updated) => {
              setItem(updated);
              setShowEdit(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Edit modal (admin) ────────────────────────────────────────
function EditModal({
  announcement,
  onClose,
  onSaved,
}: {
  announcement: Announcement;
  onClose: () => void;
  onSaved: (a: Announcement) => void;
}) {
  const [title, setTitle] = useState(announcement.title);
  const [body, setBody] = useState(announcement.body);
  const [category, setCategory] = useState<AnnouncementCategory>(announcement.category);
  const [isPinned, setIsPinned] = useState(announcement.isPinned);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(announcement.coverImageUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Tiêu đề và nội dung không được để trống.');
      return;
    }
    setSaving(true);
    try {
      const res = await announcementApi.update(announcement.id, {
        title: title.trim(),
        body: body.trim(),
        category,
        coverImageUrl: coverImageUrl ?? null,
        isPinned,
      });
      toast.success('Đã cập nhật.');
      onSaved(res.data.data);
    } catch {
      toast.error('Cập nhật thất bại.');
    } finally {
      setSaving(false);
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
            Sửa thông báo
          </h3>
          <button onClick={onClose} className="rounded-full p-1.5" style={{ color: 'var(--text-secondary)' }} aria-label="Đóng">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Nội dung"
            className="w-full resize-y rounded-xl border px-3.5 py-2.5 text-sm outline-none"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />

          <div className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((c) => {
              const m = CATEGORY_META[c];
              const active = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
                  style={{
                    color: active ? m.color : 'var(--text-secondary)',
                    background: active ? m.bg : 'var(--bg-surface)',
                    border: `1px solid ${active ? m.color : 'var(--border-color)'}`,
                  }}
                >
                  <span>{m.emoji}</span>
                  {m.label}
                </button>
              );
            })}
          </div>

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
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {uploading ? 'Đang tải ảnh...' : 'Chọn ảnh bìa'}
            </button>
          )}

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
            onClick={() => void handleSave()}
            disabled={saving || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#d946ef)' }}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Lưu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
