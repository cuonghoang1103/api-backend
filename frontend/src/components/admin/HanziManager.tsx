'use client';
/**
 * Admin — Hán tự (kanji / hanzi) CRUD.
 *
 * Stroke data is not editable here: it comes from the vendored datasets. This is
 * for what they cannot know — the Vietnamese meaning, the mnemonic, the compound
 * words, and 1–3 illustrations the admin uploads.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { languageAdminApi, type HanziChar } from '@/lib/language-api';
import { Plus, Pencil, Trash2, X, Loader2, ImagePlus, Search, Check } from 'lucide-react';

type Draft = {
  id?: number;
  char: string;
  level: string;
  strokeCount: string;
  onyomi: string;
  kunyomi: string;
  pinyin: string;
  meaningVi: string;
  mnemonic: string;
  radical: string;
  breakdown: string;
  note: string;
  examples: Array<{ word: string; reading: string; meaningVi: string }>;
  images: Array<{ url: string; caption: string }>;
};

const empty = (): Draft => ({
  char: '', level: '', strokeCount: '', onyomi: '', kunyomi: '', pinyin: '',
  meaningVi: '', mnemonic: '', radical: '', breakdown: '', note: '', examples: [], images: [],
});

const IN = 'w-full rounded-xl border border-darkborder bg-darkbg px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-orange/60';

export default function HanziManager({ code }: { code: string }) {
  const [rows, setRows] = useState<HanziChar[] | null>(null);
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await languageAdminApi.hanziList(code);
      setRows(Array.isArray(r.data.data) ? r.data.data : []);
    } catch {
      setRows([]);
      toast.error('Không tải được danh sách chữ');
    }
  }, [code]);

  useEffect(() => { setRows(null); void load(); }, [load]);

  const isCjk = code === 'ja' || code === 'zh';
  if (!isCjk) {
    return (
      <div className="rounded-2xl border border-darkborder bg-darkcard p-6 text-center text-sm text-text-muted">
        Chữ Hán chỉ áp dụng cho tiếng Nhật và tiếng Trung.
      </div>
    );
  }

  const openEdit = (c: HanziChar) => setDraft({
    id: c.id,
    char: c.char,
    level: c.level ?? '',
    strokeCount: c.strokeCount != null ? String(c.strokeCount) : '',
    onyomi: c.onyomi ?? '',
    kunyomi: c.kunyomi ?? '',
    pinyin: c.pinyin ?? '',
    meaningVi: c.meaningVi,
    mnemonic: c.mnemonic ?? '',
    radical: c.radical ?? '',
    breakdown: c.breakdown ?? '',
    note: c.note ?? '',
    examples: c.examples.map((e) => ({ word: e.word, reading: e.reading ?? '', meaningVi: e.meaningVi })),
    images: c.images.map((i) => ({ url: i.url, caption: i.caption ?? '' })),
  });

  const save = async () => {
    if (!draft) return;
    if (!draft.char.trim() || [...draft.char.trim()].length !== 1) { toast.error('Cần đúng 1 ký tự Hán'); return; }
    if (!draft.meaningVi.trim()) { toast.error('Cần nghĩa tiếng Việt'); return; }
    setSaving(true);
    const body = {
      char: draft.char.trim(),
      level: draft.level.trim() || null,
      strokeCount: draft.strokeCount ? Number(draft.strokeCount) : null,
      onyomi: draft.onyomi.trim() || null,
      kunyomi: draft.kunyomi.trim() || null,
      pinyin: draft.pinyin.trim() || null,
      meaningVi: draft.meaningVi.trim(),
      mnemonic: draft.mnemonic.trim() || null,
      radical: draft.radical.trim() || null,
      breakdown: draft.breakdown.trim() || null,
      note: draft.note.trim() || null,
      examples: draft.examples.filter((e) => e.word.trim()),
      images: draft.images.filter((i) => i.url.trim()),
    };
    try {
      if (draft.id) await languageAdminApi.hanziUpdate(draft.id, body);
      else await languageAdminApi.hanziCreate(code, body);
      toast.success(draft.id ? 'Đã lưu' : 'Đã thêm chữ');
      setDraft(null);
      void load();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không lưu được');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: HanziChar) => {
    if (!window.confirm(`Xoá chữ ${c.char}? Tiến độ luyện viết của người học cũng mất theo.`)) return;
    try {
      await languageAdminApi.hanziDelete(c.id);
      toast.success('Đã xoá');
      void load();
    } catch {
      toast.error('Không xoá được');
    }
  };

  const upload = async (file: File) => {
    if (!draft) return;
    if (draft.images.length >= 3) { toast.info('Tối đa 3 ảnh mỗi chữ'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      // Reuses the module's existing admin image upload → R2.
      const r = await api.post('/admin/my-language/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = (r.data?.data as { url?: string })?.url;
      if (!url) throw new Error('no url');
      setDraft((d) => (d ? { ...d, images: [...d.images, { url, caption: '' }] } : d));
      toast.success('Đã tải ảnh lên');
    } catch {
      toast.error('Không tải được ảnh');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const filtered = (rows ?? []).filter(
    (r) => !q.trim() || r.char.includes(q.trim()) || r.meaningVi.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm chữ hoặc nghĩa…" className={`${IN} pl-9`} />
        </div>
        <button type="button" onClick={() => setDraft(empty())} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-neon-orange px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
          <Plus size={16} /> Thêm chữ
        </button>
      </div>

      {rows === null ? (
        <div className="h-40 animate-pulse rounded-2xl border border-darkborder bg-darkcard" />
      ) : !filtered.length ? (
        <div className="rounded-2xl border border-darkborder bg-darkcard p-8 text-center text-sm text-text-muted">
          {q ? 'Không tìm thấy chữ nào' : 'Chưa có chữ nào — bấm "Thêm chữ" hoặc chạy seed N5.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5 rounded-2xl border border-darkborder bg-darkcard p-3">
              <span className="font-serif text-3xl text-text-primary">{c.char}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  {c.level && <span className="rounded bg-neon-orange/15 px-1 text-[9px] font-bold text-neon-orange">{c.level}</span>}
                  {c.images.length > 0 && <span className="text-[9px] text-neon-cyan">{c.images.length} ảnh</span>}
                  {c.mnemonic && <Check size={9} className="text-neon-green" />}
                </div>
                <p className="truncate text-xs text-text-secondary">{c.meaningVi}</p>
              </div>
              <button type="button" onClick={() => openEdit(c)} aria-label="Sửa" className="text-text-muted transition hover:text-neon-orange"><Pencil size={14} /></button>
              <button type="button" onClick={() => void remove(c)} aria-label="Xoá" className="text-text-muted transition hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      {draft && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setDraft(null)}>
          <div onClick={(e) => e.stopPropagation()} className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-darkborder bg-darkcard sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-darkborder px-4 py-3">
              <h3 className="font-heading font-bold text-text-primary">{draft.id ? `Sửa chữ ${draft.char}` : 'Thêm chữ Hán'}</h3>
              <button type="button" onClick={() => setDraft(null)} aria-label="Đóng" className="text-text-muted hover:text-text-primary"><X size={18} /></button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Field label="Chữ *">
                  <input
                    value={draft.char}
                    onChange={(e) => setDraft({ ...draft, char: e.target.value })}
                    disabled={!!draft.id}
                    placeholder="漢"
                    className={`${IN} text-center font-serif text-2xl disabled:opacity-60`}
                  />
                </Field>
                <Field label="Cấp"><input value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })} placeholder={code === 'ja' ? 'N5' : 'HSK1'} className={IN} /></Field>
                <Field label="Số nét"><input value={draft.strokeCount} onChange={(e) => setDraft({ ...draft, strokeCount: e.target.value })} placeholder="14" inputMode="numeric" className={IN} /></Field>
                <Field label="Bộ thủ"><input value={draft.radical} onChange={(e) => setDraft({ ...draft, radical: e.target.value })} placeholder="氵" className={IN} /></Field>
              </div>

              {code === 'ja' ? (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Âm On"><input value={draft.onyomi} onChange={(e) => setDraft({ ...draft, onyomi: e.target.value })} placeholder="カン" className={IN} /></Field>
                  <Field label="Âm Kun"><input value={draft.kunyomi} onChange={(e) => setDraft({ ...draft, kunyomi: e.target.value })} placeholder="みなもと" className={IN} /></Field>
                </div>
              ) : (
                <Field label="Pinyin"><input value={draft.pinyin} onChange={(e) => setDraft({ ...draft, pinyin: e.target.value })} placeholder="hàn" className={IN} /></Field>
              )}

              <Field label="Nghĩa tiếng Việt *"><input value={draft.meaningVi} onChange={(e) => setDraft({ ...draft, meaningVi: e.target.value })} placeholder="Hán, sông Hán" className={IN} /></Field>
              <Field label="Cách nhớ"><textarea value={draft.mnemonic} onChange={(e) => setDraft({ ...draft, mnemonic: e.target.value })} rows={3} placeholder="Câu chuyện giúp nhớ mặt chữ…" className={IN} /></Field>
              <Field label="Chiết tự"><input value={draft.breakdown} onChange={(e) => setDraft({ ...draft, breakdown: e.target.value })} placeholder="氵(nước) + 難(khó)" className={IN} /></Field>

              {/* Images */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Hình minh hoạ ({draft.images.length}/3)</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading || draft.images.length >= 3}
                    className="inline-flex items-center gap-1 rounded-full bg-neon-cyan/15 px-2.5 py-1 text-xs font-semibold text-neon-cyan ring-1 ring-neon-cyan/30 disabled:opacity-40"
                  >
                    {uploading ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />} Tải ảnh
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }} />
                </div>
                {draft.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {draft.images.map((im, i) => (
                      <div key={i} className="rounded-xl border border-darkborder bg-darkbg p-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={im.url} alt={`Minh hoạ ${i + 1}`} className="h-20 w-full rounded-lg object-cover" />
                        <input
                          value={im.caption}
                          onChange={(e) => setDraft({ ...draft, images: draft.images.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)) })}
                          placeholder="chú thích"
                          className="mt-1 w-full rounded bg-transparent px-1 text-[11px] text-text-secondary outline-none"
                        />
                        <button type="button" onClick={() => setDraft({ ...draft, images: draft.images.filter((_, j) => j !== i) })} className="mt-0.5 w-full text-[11px] text-red-400 hover:underline">Xoá ảnh</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Examples */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Từ ghép ({draft.examples.length})</p>
                  <button type="button" onClick={() => setDraft({ ...draft, examples: [...draft.examples, { word: '', reading: '', meaningVi: '' }] })} className="inline-flex items-center gap-1 rounded-full bg-neon-violet/15 px-2.5 py-1 text-xs font-semibold text-neon-violet ring-1 ring-neon-violet/30">
                    <Plus size={12} /> Thêm từ
                  </button>
                </div>
                <div className="space-y-1.5">
                  {draft.examples.map((e, i) => (
                    <div key={i} className="flex gap-1.5">
                      <input value={e.word} onChange={(ev) => setDraft({ ...draft, examples: draft.examples.map((x, j) => (j === i ? { ...x, word: ev.target.value } : x)) })} placeholder="日本" className={`${IN} w-24`} />
                      <input value={e.reading} onChange={(ev) => setDraft({ ...draft, examples: draft.examples.map((x, j) => (j === i ? { ...x, reading: ev.target.value } : x)) })} placeholder="にほん" className={`${IN} w-28`} />
                      <input value={e.meaningVi} onChange={(ev) => setDraft({ ...draft, examples: draft.examples.map((x, j) => (j === i ? { ...x, meaningVi: ev.target.value } : x)) })} placeholder="Nhật Bản" className={IN} />
                      <button type="button" onClick={() => setDraft({ ...draft, examples: draft.examples.filter((_, j) => j !== i) })} aria-label="Xoá" className="shrink-0 text-text-muted hover:text-red-400"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <Field label="Ghi chú"><input value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} className={IN} /></Field>
            </div>

            <div className="flex justify-end gap-2 border-t border-darkborder px-4 py-3">
              <button type="button" onClick={() => setDraft(null)} className="rounded-xl px-4 py-2 text-sm text-text-muted hover:text-text-primary">Huỷ</button>
              <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-1.5 rounded-xl bg-neon-orange px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {saving && <Loader2 size={14} className="animate-spin" />} Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-text-muted">{label}</span>
      {children}
    </label>
  );
}
