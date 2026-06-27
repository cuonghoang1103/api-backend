'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Link2, Sparkles, Loader2, Image as ImageIcon, Globe, Hash,
  Save, Plus, Globe2, Lock,
} from 'lucide-react';
import { toast } from 'sonner';

import { hubApi, type HubFolder, type HubLink, type HubScrapeResult } from '@/lib/api';
import HubCoverUpload from '@/components/hub/HubCoverUpload';
import { cn } from '@/lib/utils';

interface HubAddLinkModalProps {
  open: boolean;
  initial: HubLink | null;
  folders: HubFolder[];
  onClose: () => void;
  onSave: (data: {
    id?: number;
    folderId: number | null;
    url: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    faviconUrl?: string | null;
    coverImageUrl?: string | null;
    notes?: string | null;
    tags?: string[];
    isPublic?: boolean;
  }) => Promise<void>;
}

export default function HubAddLinkModal({
  open, initial, folders, onClose, onSave,
}: HubAddLinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  // Phase 3 — owner-uploaded cover image. Lives separately from
  // `thumbnailUrl` so the user can clear the custom cover and
  // fall back to the auto-scraped og:image. The UI covers
  // `coverImageUrl` in priority: cover > thumbnail > gradient.
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [folderId, setFolderId] = useState<number | ''>('');
  const [isPublic, setIsPublic] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);

  const lastScrapedRef = useRef<string>('');

  // Hydrate when opening (create or edit).
  useEffect(() => {
    if (!open) return;
    if (initial) {
      setUrl(initial.url);
      setTitle(initial.title);
      setDescription(initial.description ?? '');
      setThumbnailUrl(initial.thumbnailUrl ?? '');
      setFaviconUrl(initial.faviconUrl ?? '');
      setCoverImageUrl(initial.coverImageUrl ?? null);
      setNotes(initial.notes ?? '');
      setTags(initial.tags);
      setFolderId(initial.folderId ?? '');
      setIsPublic(initial.isPublic);
      lastScrapedRef.current = initial.url;
    } else {
      setUrl(''); setTitle(''); setDescription('');
      setThumbnailUrl(''); setFaviconUrl('');
      setCoverImageUrl(null);
      setNotes(''); setTags([]); setFolderId(''); setIsPublic(false);
      lastScrapedRef.current = '';
    }
  }, [open, initial]);

  // Auto-scrape when URL changes (debounced 700ms). We only fire
  // for create mode — editing a saved link should not refetch.
  useEffect(() => {
    if (!open || initial) return;
    const trimmed = url.trim();
    if (!trimmed) return;
    try { new URL(trimmed); } catch { return; }
    if (lastScrapedRef.current === trimmed) return;
    const t = window.setTimeout(() => { void runScrape(trimmed); }, 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, open, initial]);

  const runScrape = async (target: string) => {
    setScraping(true);
    try {
      const res = await hubApi.scrape(target);
      const data: HubScrapeResult = res.data.data;
      lastScrapedRef.current = data.url;
      // Only fill empty fields so user edits aren't overwritten
      setTitle((cur) => cur || data.title || target);
      setDescription((cur) => cur || data.description || '');
      setThumbnailUrl((cur) => cur || data.thumbnailUrl || '');
      setFaviconUrl((cur) => cur || data.faviconUrl || '');
    } catch (err) {
      // Quietly fail — user can fill in manually
      console.warn('[hub] scrape failed', err);
    } finally {
      setScraping(false);
    }
  };

  const addTag = (raw: string) => {
    const t = raw.trim().replace(/^#+/, '').toLowerCase();
    if (!t) return;
    if (tags.includes(t)) return;
    if (t.length > 50) { toast.error('Tag qua dai (max 50 ky tu)'); return; }
    setTags([...tags, t]);
  };

  const handleSave = async () => {
    if (!url.trim()) { toast.error('URL khong duoc rong'); return; }
    if (!title.trim()) { toast.error('Tieu de khong duoc rong'); return; }
    setSaving(true);
    try {
      await onSave({
        id: initial?.id,
        folderId: folderId === '' ? null : Number(folderId),
        url: url.trim(),
        title: title.trim(),
        description: description.trim() || null,
        thumbnailUrl: thumbnailUrl.trim() || null,
        coverImageUrl: coverImageUrl ?? null,
        faviconUrl: faviconUrl.trim() || null,
        notes: notes.trim() || null,
        tags,
        isPublic,
      });
      onClose();
    } catch {
      // onSave already toasted; just stay open
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.32, 0.94, 0.6, 1] }}
              className="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-darkborder/60 bg-[#0d0f18]/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-violet/15">
                    <Link2 className="h-4 w-4 text-neon-violet" />
                  </div>
                  <h2 className="font-heading text-base font-bold text-text-primary">
                    {initial ? 'Sua link' : 'Them link moi'}
                  </h2>
                  {scraping && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-text-muted">
                      <Loader2 className="h-3 w-3 animate-spin" /> Dang lay metadata...
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {/* Cover image upload (Phase 3). Owner-uploaded
                    cover overrides the auto-scraped thumbnail
                    when set; clearing it falls back to thumbnail. */}
                <HubCoverUpload
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  label={title || 'Cover'}
                />

                {/* URL */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                    <Link2 className="h-3 w-3" /> URL
                  </label>
                  <div className="relative">
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 pr-24 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none focus:ring-1 focus:ring-neon-violet/30"
                    />
                    <button
                      type="button"
                      onClick={() => { if (url.trim()) void runScrape(url.trim()); }}
                      disabled={!url.trim() || scraping}
                      className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg bg-neon-violet/15 px-2 py-1 text-[10px] font-semibold text-neon-violet transition-colors hover:bg-neon-violet/25 disabled:opacity-50"
                    >
                      <Sparkles className="h-3 w-3" /> Auto-fill
                    </button>
                  </div>
                </div>

                {/* Title + folder */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_200px]">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary">Tieu de</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Tieu de link..."
                      className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none focus:ring-1 focus:ring-neon-violet/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary">Thu muc</label>
                    <select
                      value={folderId === '' ? '' : String(folderId)}
                      onChange={(e) => setFolderId(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full appearance-none rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary focus:border-neon-violet/50 focus:outline-none"
                    >
                      <option value="">Chua phan loai</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-text-secondary">Mo ta</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mo ta ngan..."
                    rows={2}
                    className="w-full resize-none rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                  />
                </div>

                {/* Thumbnail preview + URL inputs */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary">Thumbnail</label>
                    <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-dashed border-darkborder bg-darkbg/40">
                      {thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-text-muted" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="Thumbnail URL"
                      className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    />
                    <input
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="Favicon URL"
                      className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                    <Hash className="h-3 w-3" /> Tags
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-darkborder bg-darkbg/60 px-2 py-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-neon-violet/15 px-2 py-0.5 text-[11px] font-medium text-neon-violet"
                      >
                        #{t}
                        <button
                          onClick={() => setTags(tags.filter((x) => x !== t))}
                          className="rounded-full p-0.5 hover:bg-neon-violet/25"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          addTag(tagInput);
                          setTagInput('');
                        }
                        if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
                          setTags(tags.slice(0, -1));
                        }
                      }}
                      placeholder={tags.length === 0 ? 'Nhan Enter de them tag...' : ''}
                      className="min-w-[120px] flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-muted"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-text-secondary">Ghi chu</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chu ca nhan..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                  />
                </div>

                {/* Public toggle */}
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-darkborder bg-darkbg/40 p-3">
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all',
                      isPublic
                        ? 'border-neon-emerald bg-neon-emerald/20 text-neon-emerald'
                        : 'border-darkborder bg-darkbg text-text-muted',
                    )}
                  >
                    {isPublic && <Globe2 className="h-3 w-3" />}
                    {!isPublic && <Lock className="h-3 w-3" />}
                  </button>
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-text-primary">
                  Cong khai link
                    </div>
                    <div className="text-text-muted">
                      Bat len de chia se qua URL cong khai (chi hien thi title + mo ta).
                    </div>
                  </div>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] bg-black/20 px-5 py-3">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-darkborder bg-darkcard/60 px-4 py-2 text-xs text-text-secondary hover:text-text-primary"
                >
                  Huy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-neon-violet/30 transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  {initial ? 'Cap nhat' : 'Luu link'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
