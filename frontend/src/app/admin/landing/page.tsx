'use client';

/**
 * Admin — landing page promo videos (the "/" marquee).
 *
 * Upload a short muted clip → it goes straight to R2 via the presigned-video
 * path (returns url + auto-extracted poster) → save as a promo with a title,
 * tagline, link and accent colour. List supports toggle-active, reorder, delete.
 * Admin-gated by the admin layout; the API is admin-gated server-side too.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Loader2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { fileApi } from '@/lib/api';
import { landingApi, type LandingPromo } from '@/lib/landing-api';

export default function AdminLandingPage() {
  const [promos, setPromos] = useState<LandingPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Draft for the new promo
  const [draft, setDraft] = useState({ title: '', tagline: '', href: '', accent: '#8b5cf6', videoUrl: '', posterUrl: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setPromos((await landingApi.adminList()).data.data || []); }
    catch { toast.error('Không tải được danh sách promo'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const onPickVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) { toast.error('Vui lòng chọn tệp video'); return; }
    setUploading(true); setProgress(0);
    try {
      const res = await fileApi.uploadVideoDirect(file, (p) => setProgress(p));
      const data = res.data?.data ?? {};
      setDraft((d) => ({ ...d, videoUrl: data.url || '', posterUrl: data.thumbnail || '' }));
      toast.success('Đã tải video lên R2');
    } catch (err: any) {
      toast.error(err?.message || 'Tải video thất bại (kiểm tra CORS bucket)');
    } finally {
      setUploading(false); setProgress(0);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const create = async () => {
    if (!draft.title.trim()) { toast.error('Nhập tiêu đề'); return; }
    if (!draft.videoUrl) { toast.error('Tải video trước'); return; }
    setSaving(true);
    try {
      await landingApi.create({
        title: draft.title.trim(),
        tagline: draft.tagline.trim() || undefined,
        href: draft.href.trim() || undefined,
        accent: draft.accent || undefined,
        videoUrl: draft.videoUrl,
        posterUrl: draft.posterUrl || undefined,
        order: promos.length,
      });
      setDraft({ title: '', tagline: '', href: '', accent: '#8b5cf6', videoUrl: '', posterUrl: '' });
      toast.success('Đã thêm promo');
      load();
    } catch { toast.error('Không lưu được promo'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (p: LandingPromo) => {
    try { await landingApi.update(p.id, { isActive: !p.isActive }); load(); }
    catch { toast.error('Không cập nhật được'); }
  };
  const remove = async (p: LandingPromo) => {
    if (!confirm(`Xoá promo "${p.title}"?`)) return;
    try { await landingApi.remove(p.id); load(); toast.success('Đã xoá'); }
    catch { toast.error('Không xoá được'); }
  };
  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= promos.length) return;
    const ids = promos.map((p) => p.id);
    [ids[i], ids[j]] = [ids[j], ids[i]];
    try { setPromos((await landingApi.reorder(ids)).data.data); }
    catch { toast.error('Không sắp xếp được'); }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-[var(--text-primary)]">Landing — Promo Videos</h1>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">Video ngắn (tắt tiếng, ~5–10s, ≤720p) chạy trong băng chuyền ở trang chủ <code>/</code>.</p>

      {/* Add form */}
      <div className="mb-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-[var(--text-primary)]"><Plus className="h-4 w-4" /> Thêm promo</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Tiêu đề *" className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]" />
          <input value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} placeholder="Mô tả ngắn" className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]" />
          <input value={draft.href} onChange={(e) => setDraft({ ...draft, href: e.target.value })} placeholder="Link khi bấm (vd /interview)" className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)]" />
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            Màu nhấn <input type="color" value={draft.accent} onChange={(e) => setDraft({ ...draft, accent: e.target.value })} className="h-8 w-14 rounded" />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input ref={fileRef} type="file" accept="video/*" onChange={onPickVideo} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-60">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? `Đang tải ${progress}%` : 'Tải video'}
          </button>
          {draft.videoUrl && (
            <video src={draft.videoUrl} poster={draft.posterUrl || undefined} className="h-16 rounded-lg border border-[var(--border-color)]" muted loop autoPlay playsInline />
          )}
          <button onClick={create} disabled={saving || !draft.videoUrl || !draft.title.trim()} className="ml-auto flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Thêm
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" /></div>
      ) : promos.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--text-muted)]">Chưa có promo nào — băng chuyền đang dùng placeholder.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {promos.map((p, i) => (
            <li key={p.id} className={`flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2.5 ${p.isActive ? '' : 'opacity-50'}`}>
              <video src={p.videoUrl} poster={p.posterUrl || undefined} className="h-14 w-24 shrink-0 rounded-lg object-cover" muted loop playsInline />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-[var(--text-primary)]">{p.title}</div>
                <div className="truncate text-xs text-[var(--text-muted)]">{p.tagline} {p.href ? `· ${p.href}` : ''}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(i, 1)} disabled={i === promos.length - 1} className="rounded p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => toggleActive(p)} className="rounded p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]" title={p.isActive ? 'Đang hiện' : 'Đang ẩn'}>{p.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                <button onClick={() => remove(p)} className="rounded p-1.5 text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
