'use client';

/**
 * Code Lab — "Sự cố & Lỗi" (03/11/2026).
 *
 * Bảng người học chia sẻ sự cố/lỗi thật gặp khi code + cách gỡ, kèm ảnh. Ai
 * cũng đọc được; đăng/bình luận cần đăng nhập. Chuyển động kiểu iOS (framer
 * -motion), đồng bộ với trang About.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle, Search, X, Loader2, Plus, MessageCircle, Eye, ImageIcon, Tag, CheckCircle2, Camera, Trash2,
} from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import { formatRelative } from '@/lib/formatDate';
import { useAuthStore } from '@/store/authStore';
import type { IncidentListItem } from '@/types/code-lab';

function authorName(a: IncidentListItem['author']): string {
  return a.displayName || a.fullName || a.username;
}

const STATUS_TABS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'OPEN', label: 'Đang mắc' },
  { key: 'RESOLVED', label: 'Đã gỡ' },
];

export default function SuCoPage() {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const [items, setItems] = useState<IncidentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [qInput, setQInput] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async (p: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const res = await codeLabApi.listIncidents({
        page: p,
        pageSize: 12,
        status: status === 'all' ? undefined : status,
        q: q || undefined,
      });
      const d = res.data.data;
      setItems((prev) => (append ? [...prev, ...d.items] : d.items));
      setTotal(d.total);
      setHasMore(d.hasMore);
      setPage(d.page);
    } catch {
      if (!append) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [status, q]);

  useEffect(() => { void load(1, false); }, [load]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(qInput.trim());
  };

  const onCreated = (created: IncidentListItem) => {
    setShowForm(false);
    setItems((prev) => [created, ...prev]);
    setTotal((t) => t + 1);
  };

  return (
    <div className="cl-root mx-auto max-w-5xl px-4 pb-16 pt-20" style={{ color: 'var(--text-primary)' }}>
      {/* Hero */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#ea580c' }}>
          <AlertTriangle size={14} /> Code Lab · Sự cố &amp; Lỗi
        </div>
        <h1 className="text-[1.5rem] font-bold leading-tight sm:text-[2rem]">
          Học từ lỗi của nhau
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Gặp một lỗi lạ, một sự cố khi dựng dự án hay chạy bài? Kể lại bạn đang làm gì, lỗi ra sao, và cách bạn đã gỡ (hoặc đang kẹt chỗ nào) — kèm ảnh chụp màn hình. Người sau tìm đúng lỗi của mình sẽ đỡ mất cả buổi.
        </p>
      </div>

      {/* Thanh công cụ */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <form onSubmit={onSearch} className="relative min-w-0 flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Tìm theo lỗi, công nghệ, từ khoá…"
            className="w-full rounded-xl border py-2.5 pl-9 pr-9 text-sm outline-none"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          />
          {qInput && (
            <button type="button" onClick={() => { setQInput(''); setQ(''); }} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Xoá tìm kiếm">
              <X size={15} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </form>
        {isAuthed ? (
          <motion.button
            type="button"
            onClick={() => setShowForm(true)}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ background: '#ea580c' }}
          >
            <Plus size={16} /> Chia sẻ sự cố
          </motion.button>
        ) : (
          <Link href="/login?redirect=%2Fcode-lab%2Fsu-co" className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: '#ea580c' }}>
            <Plus size={16} /> Đăng nhập để chia sẻ
          </Link>
        )}
      </div>

      {/* Tab trạng thái */}
      <div className="mb-5 flex items-center gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium transition"
            style={status === t.key
              ? { background: '#ea580c', color: '#fff' }
              : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
          >
            {t.label}
          </button>
        ))}
        {!loading && <span className="ml-auto text-[13px]" style={{ color: 'var(--text-muted)' }}>{total} sự cố</span>}
      </div>

      {/* Danh sách */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="cl-skel" style={{ height: 150 }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          <AlertTriangle size={30} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Chưa có sự cố nào{q ? ' khớp tìm kiếm' : ''}.</p>
          {isAuthed && !q && <button onClick={() => setShowForm(true)} className="mt-3 text-sm font-semibold" style={{ color: '#ea580c' }}>Là người đầu tiên chia sẻ →</button>}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {items.map((it, i) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.03, type: 'spring', stiffness: 380, damping: 30 } }}
                exit={{ opacity: 0, scale: 0.97 }}
              >
                <IncidentCard it={it} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => void load(page + 1, true)}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            {loadingMore ? <Loader2 size={15} className="animate-spin" /> : null} Xem thêm
          </button>
        </div>
      )}

      <AnimatePresence>
        {showForm && <CreateModal onClose={() => setShowForm(false)} onCreated={onCreated} />}
      </AnimatePresence>
    </div>
  );
}

function IncidentCard({ it }: { it: IncidentListItem }) {
  return (
    <Link
      href={`/code-lab/su-co/${it.id}`}
      className="group flex h-full gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      {it.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={it.coverUrl} alt="" className="h-20 w-20 flex-none rounded-xl object-cover" style={{ border: '1px solid var(--border-color)' }} />
      ) : (
        <span className="grid h-20 w-20 flex-none place-items-center rounded-xl" style={{ background: 'rgba(234,88,12,0.10)', color: '#ea580c' }}>
          <AlertTriangle size={22} />
        </span>
      )}
      <div className="flex min-w-0 flex-col">
        <div className="mb-1 flex items-center gap-1.5">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={it.status === 'RESOLVED'
              ? { background: 'rgba(22,163,74,0.12)', color: '#16a34a' }
              : { background: 'rgba(234,88,12,0.12)', color: '#ea580c' }}
          >
            {it.status === 'RESOLVED' ? <span className="inline-flex items-center gap-1"><CheckCircle2 size={11} /> Đã gỡ</span> : 'Đang mắc'}
          </span>
          {it.track && <span className="truncate text-[11px]" style={{ color: it.track.color || 'var(--text-muted)' }}>{it.track.name}</span>}
        </div>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug group-hover:text-[color:var(--accent-color)]">{it.title}</h3>
        <p className="mt-1 line-clamp-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>{it.context}</p>
        <div className="mt-auto flex items-center gap-3 pt-2 text-[12px]" style={{ color: 'var(--text-muted)' }}>
          <span className="truncate">{authorName(it.author)}</span>
          <span>·</span>
          <span>{formatRelative(it.createdAt)}</span>
          <span className="ml-auto flex items-center gap-2.5">
            {it.imageCount > 0 && <span className="inline-flex items-center gap-1"><ImageIcon size={12} />{it.imageCount}</span>}
            <span className="inline-flex items-center gap-1"><MessageCircle size={12} />{it.commentCount}</span>
            <span className="inline-flex items-center gap-1"><Eye size={12} />{it.viewCount}</span>
          </span>
        </div>
        {it.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {it.tags.slice(0, 3).map((t) => (
              <span key={t} className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px]" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                <Tag size={9} />{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

const MAX_IMAGES = 4;

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (it: IncidentListItem) => void }) {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [errorText, setErrorText] = useState('');
  const [solution, setSolution] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'OPEN' | 'RESOLVED'>('OPEN');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_IMAGES));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (title.trim().length < 3) { setErr('Tiêu đề cần ít nhất 3 ký tự.'); return; }
    if (context.trim().length < 3) { setErr('Hãy mô tả bạn đang làm gì.'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('context', context.trim());
      if (errorText.trim()) fd.append('errorText', errorText.trim());
      if (solution.trim()) fd.append('solution', solution.trim());
      if (tags.trim()) fd.append('tags', tags.trim());
      fd.append('status', status);
      files.forEach((f) => fd.append('images', f));
      const res = await codeLabApi.createIncident(fd);
      const d = res.data.data;
      onCreated({
        id: d.id, title: d.title, context: d.context, errorText: d.errorText, solution: d.solution,
        tags: d.tags, status: d.status, viewCount: d.viewCount, commentCount: d.comments.length,
        imageCount: d.images.length, coverUrl: d.images[0] ?? null, track: d.track, author: d.author,
        createdAt: d.createdAt, updatedAt: d.updatedAt,
      });
    } catch (e2: unknown) {
      const msg = (e2 as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(msg || 'Đăng không thành công, thử lại nhé.');
      setSubmitting(false);
    }
  };

  const field = { borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 32 } }}
        exit={{ y: 30, opacity: 0, scale: 0.98 }}
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl"
        style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold"><AlertTriangle size={18} style={{ color: '#ea580c' }} /> Chia sẻ sự cố</h2>
          <button type="button" onClick={onClose} aria-label="Đóng"><X size={20} style={{ color: 'var(--text-muted)' }} /></button>
        </div>

        <label className="mb-1 block text-[13px] font-semibold">Tiêu đề <span style={{ color: '#ea580c' }}>*</span></label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="VD: Spring Boot chạy lên là 'Port 8080 already in use'" className="mb-3 w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={field} />

        <label className="mb-1 block text-[13px] font-semibold">Mình đang làm gì? <span style={{ color: '#ea580c' }}>*</span></label>
        <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="Bối cảnh: bài/đồ án nào, bước nào thì gặp…" className="mb-3 w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={field} />

        <label className="mb-1 block text-[13px] font-semibold">Lỗi / log (dán nguyên văn)</label>
        <textarea value={errorText} onChange={(e) => setErrorText(e.target.value)} rows={3} placeholder="Dán thông báo lỗi, stack trace…" className="mb-3 w-full rounded-xl border px-3 py-2.5 font-mono text-[12px] outline-none" style={field} />

        <label className="mb-1 block text-[13px] font-semibold">Cách gỡ / bài học (nếu đã xong)</label>
        <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} placeholder="Mình đã sửa thế nào, rút ra điều gì…" className="mb-3 w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={field} />

        <label className="mb-1 block text-[13px] font-semibold">Thẻ (cách nhau bằng dấu phẩy)</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="spring-boot, port, maven" className="mb-3 w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={field} />

        {/* Ảnh */}
        <label className="mb-1 block text-[13px] font-semibold">Ảnh chụp màn hình (tối đa {MAX_IMAGES})</label>
        <div className="mb-3 flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <span key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-16 w-16 rounded-lg object-cover" style={{ border: '1px solid var(--border-color)' }} />
              <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full text-white" style={{ background: '#ef4444' }} aria-label="Bỏ ảnh">
                <Trash2 size={11} />
              </button>
            </span>
          ))}
          {files.length < MAX_IMAGES && (
            <button type="button" onClick={() => fileRef.current?.click()} className="grid h-16 w-16 place-items-center rounded-lg border border-dashed" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              <Camera size={18} />
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-[13px] font-semibold">Trạng thái:</span>
          {(['OPEN', 'RESOLVED'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className="rounded-full px-3 py-1 text-[12px] font-medium"
              style={status === s
                ? { background: s === 'RESOLVED' ? '#16a34a' : '#ea580c', color: '#fff' }
                : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
            >
              {s === 'RESOLVED' ? 'Đã gỡ được' : 'Vẫn đang mắc'}
            </button>
          ))}
        </div>

        {err && <p className="mb-3 rounded-lg px-3 py-2 text-[13px]" style={{ background: 'rgba(239,68,68,0.10)', color: '#ef4444' }}>{err}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>Huỷ</button>
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60" style={{ background: '#ea580c' }}>
            {submitting ? <Loader2 size={15} className="animate-spin" /> : null} Đăng
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
