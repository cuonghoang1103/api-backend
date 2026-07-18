'use client';

/**
 * Admin — Voice Hub studio.
 *
 * The admin's creator console: create/edit Vlogs, Reactions, Coding-experience
 * posts, Podcasts and Tutorials. Media is a YouTube link, an uploaded R2 video,
 * or uploaded audio. Manage series, chapters, tags, publish state, and use the
 * AI helper to draft show-notes + tags + chapters from a title.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Plus, Search, Pencil, Trash2, X, Save, Sparkles, Upload, Loader2,
  Eye, EyeOff, Radio, Youtube, Video, Mic, Star, Pin, ListVideo, Clock,
} from 'lucide-react';
import {
  adminVoiceApi, fileApi,
  type AdminVoicePost, type VoiceSeries, type VoiceType, type VoiceMediaKind,
  type VoiceStatus, type VoiceChapter, type VoiceUpsertPayload,
} from '@/lib/api';

const TYPES: { value: VoiceType; label: string; emoji: string }[] = [
  { value: 'VLOG', label: 'Vlog', emoji: '🎬' },
  { value: 'REACTION', label: 'Reaction', emoji: '😮' },
  { value: 'CODE_EXP', label: 'Kinh nghiệm code', emoji: '💻' },
  { value: 'PODCAST', label: 'Podcast', emoji: '🎙️' },
  { value: 'TUTORIAL', label: 'Tutorial', emoji: '📚' },
];

const MEDIA: { value: VoiceMediaKind; label: string; icon: typeof Youtube }[] = [
  { value: 'YOUTUBE', label: 'YouTube', icon: Youtube },
  { value: 'R2_VIDEO', label: 'Video (upload)', icon: Video },
  { value: 'AUDIO', label: 'Audio (upload)', icon: Mic },
];

function secToMMSS(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
function mmssToSec(v: string): number {
  const parts = v.split(':').map((x) => parseInt(x, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

interface FormState {
  id?: number;
  title: string;
  type: VoiceType;
  mediaKind: VoiceMediaKind;
  youtubeInput: string;
  videoUrl: string;
  audioUrl: string;
  thumbnailUrl: string;
  summary: string;
  description: string;
  tags: string;
  seriesId: string;
  durationSec: string;
  chapters: VoiceChapter[];
  isFeatured: boolean;
  isPinned: boolean;
  status: VoiceStatus;
}

const EMPTY: FormState = {
  title: '', type: 'VLOG', mediaKind: 'YOUTUBE', youtubeInput: '', videoUrl: '', audioUrl: '',
  thumbnailUrl: '', summary: '', description: '', tags: '', seriesId: '', durationSec: '',
  chapters: [], isFeatured: false, isPinned: false, status: 'DRAFT',
};

export default function AdminVoicePage() {
  const [posts, setPosts] = useState<AdminVoicePost[]>([]);
  const [series, setSeries] = useState<VoiceSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<VoiceStatus | ''>('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminVoiceApi.list({ q: q || undefined, status: statusFilter || undefined, size: 100 });
      setPosts(r.data.data.posts);
    } catch {
      toast.error('Không tải được danh sách');
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter]);

  const loadSeries = useCallback(async () => {
    try {
      const r = await adminVoiceApi.listSeries();
      setSeries(r.data.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadSeries(); }, [loadSeries]);

  const openNew = () => { setForm(EMPTY); setEditorOpen(true); };

  const openEdit = async (id: number) => {
    try {
      const r = await adminVoiceApi.get(id);
      const p = r.data.data;
      setForm({
        id: p.id,
        title: p.title,
        type: p.type,
        mediaKind: p.mediaKind,
        youtubeInput: p.youtubeId || '',
        videoUrl: p.videoUrl || '',
        audioUrl: p.audioUrl || '',
        thumbnailUrl: p.thumbnailUrl || '',
        summary: p.summary || '',
        description: p.description || '',
        tags: (p.tags || []).join(', '),
        seriesId: p.seriesId ? String(p.seriesId) : '',
        durationSec: p.durationSec ? String(p.durationSec) : '',
        chapters: Array.isArray(p.chapters) ? p.chapters : [],
        isFeatured: p.isFeatured,
        isPinned: p.isPinned,
        status: p.status,
      });
      setEditorOpen(true);
    } catch {
      toast.error('Không tải được bài viết');
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Xoá bài viết này? Không thể hoàn tác.')) return;
    try {
      await adminVoiceApi.remove(id);
      toast.success('Đã xoá');
      load();
    } catch {
      toast.error('Xoá thất bại');
    }
  };

  const togglePublish = async (p: AdminVoicePost) => {
    try {
      if (p.status === 'PUBLISHED') { await adminVoiceApi.unpublish(p.id); toast.success('Đã ẩn (draft)'); }
      else { await adminVoiceApi.publish(p.id); toast.success('Đã đăng'); }
      load();
    } catch {
      toast.error('Thao tác thất bại');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-neon-violet" /> Voice Studio
          </h1>
          <p className="text-sm text-gray-400 mt-1">Vlog · Reaction · Kinh nghiệm code · Podcast · Tutorial</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSeriesOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 text-sm font-medium">
            <ListVideo className="w-4 h-4" /> Series
          </button>
          <button onClick={openNew} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90">
            <Plus className="w-4 h-4" /> Tạo mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tiêu đề…"
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as VoiceStatus | '')}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none">
          <option value="">Mọi trạng thái</option>
          <option value="PUBLISHED">Đã đăng</option>
          <option value="DRAFT">Nháp</option>
          <option value="SCHEDULED">Lên lịch</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 py-16 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Đang tải…</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Chưa có bài nào. Bấm “Tạo mới”.</div>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => {
            const t = TYPES.find((x) => x.value === p.type);
            return (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-neon-violet/30 transition-colors">
                <span className="text-lg shrink-0">{t?.emoji ?? '🎥'}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {t?.label} · {p.mediaKind} · {p.viewCount} views · {p.likeCount} likes
                    {p.isFeatured ? ' · ⭐' : ''}{p.isPinned ? ' · 📌' : ''}
                  </p>
                </div>
                <span className={['text-[11px] px-2 py-0.5 rounded-full shrink-0', p.status === 'PUBLISHED' ? 'bg-neon-emerald/15 text-neon-emerald' : 'bg-white/10 text-gray-400'].join(' ')}>
                  {p.status}
                </span>
                <button onClick={() => togglePublish(p)} title={p.status === 'PUBLISHED' ? 'Ẩn' : 'Đăng'} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                  {p.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-neon-violet hover:bg-white/10"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-neon-red hover:bg-white/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor */}
      <AnimatePresence>
        {editorOpen && (
          <Editor
            form={form}
            setForm={setForm}
            series={series}
            onClose={() => setEditorOpen(false)}
            onSaved={() => { setEditorOpen(false); load(); }}
          />
        )}
      </AnimatePresence>

      {/* Series manager */}
      <AnimatePresence>
        {seriesOpen && (
          <SeriesManager series={series} onClose={() => setSeriesOpen(false)} onChanged={loadSeries} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Editor drawer ────────────────────────────────────────────────────────────

function Editor({
  form, setForm, series, onClose, onSaved,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  series: VoiceSeries[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'thumb' | 'media' | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [aiBusy, setAiBusy] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const uploadThumb = async (file: File) => {
    setUploading('thumb');
    try {
      const r = await fileApi.upload(file, 'voice');
      const url = r.data?.data?.url;
      if (url) { set('thumbnailUrl', url); toast.success('Đã tải ảnh bìa'); }
    } catch {
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploading(null);
    }
  };

  const uploadMedia = async (file: File, kind: 'R2_VIDEO' | 'AUDIO') => {
    setUploading('media');
    setUploadPct(0);
    try {
      let url: string | undefined;
      if (kind === 'R2_VIDEO') {
        try {
          const r = await fileApi.uploadVideoDirect(file, setUploadPct);
          url = r.data?.data?.url;
        } catch {
          const r = await fileApi.upload(file, 'voice');
          url = r.data?.data?.url;
        }
      } else {
        const r = await fileApi.upload(file, 'voice');
        url = r.data?.data?.url;
      }
      if (url) {
        if (kind === 'R2_VIDEO') set('videoUrl', url); else set('audioUrl', url);
        toast.success('Đã tải lên');
      }
    } catch {
      toast.error('Tải media thất bại');
    } finally {
      setUploading(null);
      setUploadPct(0);
    }
  };

  const runAi = async () => {
    if (!form.title.trim()) { toast.error('Nhập tiêu đề trước'); return; }
    setAiBusy(true);
    try {
      const r = await adminVoiceApi.generateMeta({ title: form.title, notes: form.description || form.summary, type: form.type });
      const d = r.data.data;
      setForm((f) => ({
        ...f,
        summary: d.summary || f.summary,
        description: d.description || f.description,
        tags: d.tags?.length ? d.tags.join(', ') : f.tags,
        chapters: d.chapters?.length ? d.chapters : f.chapters,
      }));
      toast.success('AI đã điền nội dung gợi ý');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'AI thất bại');
    } finally {
      setAiBusy(false);
    }
  };

  const save = async (publish?: boolean) => {
    if (!form.title.trim()) { toast.error('Cần nhập tiêu đề'); return; }
    if (form.mediaKind === 'YOUTUBE' && !form.youtubeInput.trim()) { toast.error('Cần link YouTube'); return; }
    if (form.mediaKind === 'R2_VIDEO' && !form.videoUrl.trim()) { toast.error('Cần video'); return; }
    if (form.mediaKind === 'AUDIO' && !form.audioUrl.trim()) { toast.error('Cần audio'); return; }

    setSaving(true);
    const payload: VoiceUpsertPayload = {
      title: form.title.trim(),
      type: form.type,
      mediaKind: form.mediaKind,
      youtubeInput: form.mediaKind === 'YOUTUBE' ? form.youtubeInput.trim() : undefined,
      videoUrl: form.mediaKind === 'R2_VIDEO' ? form.videoUrl.trim() : undefined,
      audioUrl: form.mediaKind === 'AUDIO' ? form.audioUrl.trim() : undefined,
      thumbnailUrl: form.thumbnailUrl.trim() || null,
      summary: form.summary.trim() || null,
      description: form.description.trim() || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      seriesId: form.seriesId ? Number(form.seriesId) : null,
      durationSec: form.durationSec ? Number(form.durationSec) : null,
      chapters: form.chapters,
      isFeatured: form.isFeatured,
      isPinned: form.isPinned,
      status: publish ? 'PUBLISHED' : form.status,
    };
    try {
      if (form.id) await adminVoiceApi.update(form.id, payload);
      else await adminVoiceApi.create(payload);
      toast.success(form.id ? 'Đã lưu' : 'Đã tạo');
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const addChapter = () => set('chapters', [...form.chapters, { t: 0, label: '' }]);
  const updateChapter = (i: number, patch: Partial<VoiceChapter>) =>
    set('chapters', form.chapters.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const removeChapter = (i: number) => set('chapters', form.chapters.filter((_, idx) => idx !== i));

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-2xl h-full overflow-y-auto bg-[#0f0f16] border-l border-white/10 p-6"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">{form.id ? 'Sửa bài' : 'Tạo bài mới'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          {/* Title + AI */}
          <div>
            <label className="text-xs font-semibold text-gray-400">Tiêu đề *</label>
            <div className="flex gap-2 mt-1">
              <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="VD: Kinh nghiệm phỏng vấn backend đầu tiên"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/50" />
              <button onClick={runAi} disabled={aiBusy} title="AI gợi ý mô tả/tags/chapters"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neon-violet/15 text-neon-violet text-sm font-semibold border border-neon-violet/30 hover:bg-neon-violet/25 disabled:opacity-50 shrink-0">
                {aiBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI
              </button>
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-semibold text-gray-400">Loại nội dung</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TYPES.map((t) => (
                <button key={t.value} onClick={() => set('type', t.value)}
                  className={['px-3 py-1.5 rounded-lg text-sm border', form.type === t.value ? 'bg-neon-violet/20 text-neon-violet border-neon-violet/40' : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'].join(' ')}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Media kind */}
          <div>
            <label className="text-xs font-semibold text-gray-400">Nguồn media</label>
            <div className="flex gap-2 mt-1">
              {MEDIA.map((m) => {
                const Icon = m.icon;
                return (
                  <button key={m.value} onClick={() => set('mediaKind', m.value)}
                    className={['inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border', form.mediaKind === m.value ? 'bg-neon-indigo/20 text-neon-indigo border-neon-indigo/40' : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'].join(' ')}>
                    <Icon className="w-4 h-4" /> {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media input */}
          {form.mediaKind === 'YOUTUBE' ? (
            <div>
              <label className="text-xs font-semibold text-gray-400">Link YouTube *</label>
              <input value={form.youtubeInput} onChange={(e) => set('youtubeInput', e.target.value)} placeholder="https://youtu.be/… hoặc ID"
                className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/50" />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-gray-400">{form.mediaKind === 'R2_VIDEO' ? 'Video *' : 'Audio *'}</label>
              <div className="flex items-center gap-2 mt-1">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-white/10 cursor-pointer">
                  <Upload className="w-4 h-4" /> {uploading === 'media' ? `Đang tải ${uploadPct}%` : 'Chọn tệp'}
                  <input type="file" accept={form.mediaKind === 'R2_VIDEO' ? 'video/*' : 'audio/*'} className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMedia(f, form.mediaKind as 'R2_VIDEO' | 'AUDIO'); }} />
                </label>
                <input
                  value={form.mediaKind === 'R2_VIDEO' ? form.videoUrl : form.audioUrl}
                  onChange={(e) => set(form.mediaKind === 'R2_VIDEO' ? 'videoUrl' : 'audioUrl', e.target.value)}
                  placeholder="hoặc dán URL"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/50" />
              </div>
            </div>
          )}

          {/* Thumbnail */}
          <div>
            <label className="text-xs font-semibold text-gray-400">Ảnh bìa (tuỳ chọn — YouTube tự lấy nếu bỏ trống)</label>
            <div className="flex items-center gap-3 mt-1">
              {form.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.thumbnailUrl} alt="" className="w-24 h-14 rounded-lg object-cover border border-white/10" />
              )}
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-white/10 cursor-pointer">
                <Upload className="w-4 h-4" /> {uploading === 'thumb' ? 'Đang tải…' : 'Tải ảnh'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadThumb(f); }} />
              </label>
              {form.thumbnailUrl && <button onClick={() => set('thumbnailUrl', '')} className="text-xs text-gray-500 hover:text-neon-red">Xoá</button>}
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="text-xs font-semibold text-gray-400">Tóm tắt ngắn</label>
            <textarea value={form.summary} onChange={(e) => set('summary', e.target.value)} rows={2} placeholder="1-2 câu mô tả nổi bật"
              className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/50 resize-y" />
          </div>

          {/* Description (markdown) */}
          <div>
            <label className="text-xs font-semibold text-gray-400">Mô tả chi tiết (Markdown)</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={6} placeholder="Show-notes, link, timestamps mô tả…"
              className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/50 resize-y font-mono" />
          </div>

          {/* Chapters */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Mốc thời gian</label>
              <button onClick={addChapter} className="text-xs text-neon-violet hover:underline">+ Thêm mốc</button>
            </div>
            <div className="space-y-2 mt-2">
              {form.chapters.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={secToMMSS(c.t)} onChange={(e) => updateChapter(i, { t: mmssToSec(e.target.value) })} placeholder="mm:ss"
                    className="w-20 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-neon-violet/50" />
                  <input value={c.label} onChange={(e) => updateChapter(i, { label: e.target.value })} placeholder="Tên phần"
                    className="flex-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-neon-violet/50" />
                  <button onClick={() => removeChapter(i)} className="p-1.5 rounded-lg text-gray-500 hover:text-neon-red"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags + series + duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-400">Tags (phẩy)</label>
              <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="react, career, vlog"
                className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400">Series</label>
              <select value={form.seriesId} onChange={(e) => set('seriesId', e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-neon-violet/50">
                <option value="">— Không —</option>
                {series.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="accent-neon-violet" />
              <Star className="w-4 h-4" /> Nổi bật
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.isPinned} onChange={(e) => set('isPinned', e.target.checked)} className="accent-neon-violet" />
              <Pin className="w-4 h-4" /> Ghim
            </label>
            <div className="ml-auto">
              <select value={form.status} onChange={(e) => set('status', e.target.value as VoiceStatus)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none">
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Đã đăng</option>
                <option value="SCHEDULED">Lên lịch</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-white/10">
            <button onClick={() => save(false)} disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/15 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Lưu nháp
            </button>
            <button onClick={() => save(true)} disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 disabled:opacity-50">
              <Eye className="w-4 h-4" /> Lưu & Đăng
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Series manager ───────────────────────────────────────────────────────────

function SeriesManager({ series, onClose, onChanged }: { series: VoiceSeries[]; onClose: () => void; onChanged: () => void }) {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await adminVoiceApi.createSeries({ title: title.trim() });
      setTitle('');
      onChanged();
      toast.success('Đã tạo series');
    } catch {
      toast.error('Tạo series thất bại');
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: number) => {
    if (!window.confirm('Xoá series? Các bài trong series sẽ gỡ liên kết (không xoá bài).')) return;
    try {
      await adminVoiceApi.deleteSeries(id);
      onChanged();
      toast.success('Đã xoá series');
    } catch {
      toast.error('Xoá thất bại');
    }
  };

  return (
    <motion.div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="w-full max-w-md bg-[#0f0f16] border border-white/10 rounded-2xl p-5"
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2"><ListVideo className="w-5 h-5 text-neon-violet" /> Quản lý Series</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 mb-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} placeholder="Tên series mới"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/50" />
          <button onClick={add} disabled={busy || !title.trim()} className="px-3 py-2 rounded-lg bg-neon-violet/20 text-neon-violet text-sm font-semibold hover:bg-neon-violet/30 disabled:opacity-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
        <div className="space-y-1.5 max-h-72 overflow-y-auto">
          {series.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có series nào.</p>
          ) : series.map((s) => (
            <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10">
              <span className="flex-1 text-sm text-white truncate">{s.title}</span>
              <span className="text-xs text-gray-500">{s._count?.posts ?? 0} bài</span>
              <button onClick={() => del(s.id)} className="p-1 rounded text-gray-500 hover:text-neon-red"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
