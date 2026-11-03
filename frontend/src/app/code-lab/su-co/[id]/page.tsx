'use client';

/**
 * Code Lab — "Sự cố & Lỗi": trang chi tiết một sự cố + bình luận (03/11/2026).
 */
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle, ArrowLeft, CheckCircle2, Eye, MessageCircle, Tag, Loader2, Trash2, Send, X,
} from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import { formatRelative } from '@/lib/formatDate';
import { useAuthStore } from '@/store/authStore';
import type { IncidentDetail, IncidentComment } from '@/types/code-lab';

function authorName(a: { displayName: string | null; fullName: string | null; username: string }): string {
  return a.displayName || a.fullName || a.username;
}

export default function SuCoChiTietPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const user = useAuthStore((s) => s.user);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = (user?.roles ?? []).some((r) => ['ADMIN', 'EDITOR'].includes(r.toUpperCase().replace('ROLE_', '')));

  const [inc, setInc] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isInteger(id) || id <= 0) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await codeLabApi.getIncident(id);
      setInc(res.data.data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  const canManage = !!inc && !!user && (user.id === inc.author.id || isAdmin);

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !inc) return;
    setPosting(true);
    try {
      const res = await codeLabApi.addIncidentComment(inc.id, comment.trim());
      setInc({ ...inc, comments: [...inc.comments, res.data.data] });
      setComment('');
    } catch { /* giữ nguyên ô nhập để thử lại */ } finally { setPosting(false); }
  };

  const removeComment = async (c: IncidentComment) => {
    if (!inc) return;
    try {
      await codeLabApi.deleteIncidentComment(inc.id, c.id);
      setInc({ ...inc, comments: inc.comments.filter((x) => x.id !== c.id) });
    } catch { /* bỏ qua */ }
  };

  const removeIncident = async () => {
    if (!inc || deleting) return;
    if (!window.confirm('Xoá sự cố này? Không khôi phục được.')) return;
    setDeleting(true);
    try {
      await codeLabApi.deleteIncident(inc.id);
      router.push('/code-lab/su-co');
    } catch { setDeleting(false); }
  };

  if (loading) {
    return (
      <div className="cl-root mx-auto max-w-3xl px-4 pb-16 pt-20">
        <div className="cl-skel mb-4" style={{ height: 32, width: '60%' }} />
        <div className="cl-skel mb-2" style={{ height: 120 }} />
        <div className="cl-skel" style={{ height: 200 }} />
      </div>
    );
  }

  if (notFound || !inc) {
    return (
      <div className="cl-root mx-auto max-w-3xl px-4 pb-16 pt-24 text-center" style={{ color: 'var(--text-primary)' }}>
        <AlertTriangle size={34} className="mx-auto mb-3 opacity-50" />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Không tìm thấy sự cố này.</p>
        <Link href="/code-lab/su-co" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#ea580c' }}>
          <ArrowLeft size={15} /> Về danh sách
        </Link>
      </div>
    );
  }

  const canDeleteComment = (c: IncidentComment) => !!user && (user.id === c.author.id || isAdmin);

  return (
    <div className="cl-root mx-auto max-w-3xl px-4 pb-16 pt-20" style={{ color: 'var(--text-primary)' }}>
      <Link href="/code-lab/su-co" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={15} /> Sự cố &amp; Lỗi
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 360, damping: 30 } }}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
            style={inc.status === 'RESOLVED'
              ? { background: 'rgba(22,163,74,0.12)', color: '#16a34a' }
              : { background: 'rgba(234,88,12,0.12)', color: '#ea580c' }}
          >
            {inc.status === 'RESOLVED' ? <span className="inline-flex items-center gap-1"><CheckCircle2 size={12} /> Đã gỡ</span> : 'Đang mắc'}
          </span>
          {inc.track && (
            <Link href={`/code-lab/${inc.track.slug}`} className="text-[12px] font-medium" style={{ color: inc.track.color || 'var(--text-muted)' }}>
              {inc.track.name}
            </Link>
          )}
        </div>

        <h1 className="text-[1.4rem] font-bold leading-tight sm:text-[1.8rem]">{inc.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{authorName(inc.author)}</span>
          <span>· {formatRelative(inc.createdAt)}</span>
          <span className="inline-flex items-center gap-1">· <Eye size={13} /> {inc.viewCount}</span>
          <span className="inline-flex items-center gap-1">· <MessageCircle size={13} /> {inc.comments.length}</span>
          {canManage && (
            <button onClick={removeIncident} disabled={deleting} className="ml-auto inline-flex items-center gap-1 text-[12px]" style={{ color: '#ef4444' }}>
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Xoá
            </button>
          )}
        </div>

        {/* Bối cảnh */}
        <Section label="Mình đang làm gì">
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{inc.context}</p>
        </Section>

        {/* Ảnh */}
        {inc.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {inc.images.map((src, i) => (
              <button key={i} type="button" onClick={() => setLightbox(src)} className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border-color)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Ảnh ${i + 1}`} className="h-32 w-full object-cover transition hover:scale-[1.03]" />
              </button>
            ))}
          </div>
        )}

        {/* Lỗi / log */}
        {inc.errorText && (
          <Section label="Lỗi / log">
            <pre className="overflow-x-auto rounded-xl p-3 font-mono text-[12.5px] leading-relaxed" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              {inc.errorText}
            </pre>
          </Section>
        )}

        {/* Cách gỡ */}
        {inc.solution && (
          <Section label="Cách gỡ / bài học">
            <p className="whitespace-pre-wrap text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{inc.solution}</p>
          </Section>
        )}

        {/* Tags */}
        {inc.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {inc.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[12px]" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                <Tag size={10} />{t}
              </span>
            ))}
          </div>
        )}
      </motion.article>

      {/* Bình luận */}
      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
          <MessageCircle size={16} /> Bình luận ({inc.comments.length})
        </h2>

        {isAuthed ? (
          <form onSubmit={postComment} className="mb-5 flex items-start gap-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="Góp cách gỡ, hoặc hỏi thêm cho rõ…"
              className="min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
            <button type="submit" disabled={posting || !comment.trim()} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" style={{ background: '#ea580c' }}>
              {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </form>
        ) : (
          <p className="mb-5 rounded-xl border px-3 py-2.5 text-[13px]" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <Link href={`/login?redirect=%2Fcode-lab%2Fsu-co%2F${inc.id}`} className="font-semibold underline" style={{ color: '#ea580c' }}>Đăng nhập</Link> để bình luận.
          </p>
        )}

        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {inc.comments.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border p-3"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
              >
                <div className="mb-1 flex items-center gap-2 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{authorName(c.author)}</span>
                  <span>· {formatRelative(c.createdAt)}</span>
                  {canDeleteComment(c) && (
                    <button onClick={() => removeComment(c)} className="ml-auto" aria-label="Xoá bình luận" style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{c.body}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {inc.comments.length === 0 && (
            <p className="py-4 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>Chưa có bình luận. Bạn gặp lỗi tương tự, hay biết cách gỡ?</p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className="absolute right-4 top-4 text-white" onClick={() => setLightbox(null)} aria-label="Đóng"><X size={26} /></button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={lightbox}
              alt=""
              className="max-h-[90dvh] max-w-full rounded-lg object-contain"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</div>
      {children}
    </div>
  );
}
