'use client';

// VocabTab — category manager (left) + word table with search &
// pagination (right) + word form modal (with dynamic pronunciation
// rows) + a CSV import panel (preview → import + template download).

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, ChevronRight, Search, Volume2, FileUp, Download, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { VocabCategory, VocabWord, VocabPronunciation, CsvRowResult } from '@/types/language';
import AiGeneratePanel from './AiGeneratePanel';
import {
  Modal,
  ImageField,
  AudioField,
  SortableList,
  RowActions,
  inputCls,
  labelCls,
  btnAdd,
  btnPrimary,
  btnGhost,
  unwrap,
  errMsg,
} from './shared';

interface TabProps {
  languageId: number;
  code: string;
}

interface CatEditor {
  id: number | null;
  name: string;
  icon: string;
}

interface WordEditor {
  id: number | null;
  word: string;
  meaningVi: string;
  pronunciations: VocabPronunciation[];
  exampleSentence: string;
  exampleMeaning: string;
  imageUrl: string;
  audioUrl: string;
  note: string;
}

const EMPTY_WORD: WordEditor = {
  id: null,
  word: '',
  meaningVi: '',
  pronunciations: [],
  exampleSentence: '',
  exampleMeaning: '',
  imageUrl: '',
  audioUrl: '',
  note: '',
};

const CSV_TEMPLATE =
  'word,pronunciation_type_1,pronunciation_value_1,pronunciation_type_2,pronunciation_value_2,meaning_vi,example,example_meaning,note\n' +
  'こんにちは,romaji,konnichiwa,,,xin chào,こんにちは、元気ですか,Xin chào, bạn khỏe không,Lời chào ban ngày';

const PAGE_SIZE = 20;

export default function VocabTab({ languageId, code }: TabProps) {
  const [categories, setCategories] = useState<VocabCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [catEditor, setCatEditor] = useState<CatEditor | null>(null);
  const [savingCat, setSavingCat] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const [words, setWords] = useState<VocabWord[]>([]);
  const [loadingWords, setLoadingWords] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wordEditor, setWordEditor] = useState<WordEditor | null>(null);
  const [savingWord, setSavingWord] = useState(false);

  const [csvOpen, setCsvOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvPreview, setCsvPreview] = useState<CsvRowResult[] | null>(null);
  const [csvBusy, setCsvBusy] = useState(false);

  const loadCats = useCallback(async () => {
    setLoadingCats(true);
    try {
      const rows = unwrap(await languageAdminApi.content(code, 'vocab')) as VocabCategory[];
      setCategories(rows);
      setSelectedId((prev) => prev ?? rows[0]?.id ?? null);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được danh mục'));
    } finally {
      setLoadingCats(false);
    }
  }, [code]);

  useEffect(() => {
    void loadCats();
  }, [loadCats]);

  const loadWords = useCallback(async () => {
    if (selectedId == null) {
      setWords([]);
      return;
    }
    setLoadingWords(true);
    try {
      const res = await languageAdminApi.vocabWords(selectedId, { page, search: search || undefined, limit: PAGE_SIZE });
      setWords(res.data.data);
      setTotalPages(res.data.pagination?.totalPages ?? 1);
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được từ vựng'));
    } finally {
      setLoadingWords(false);
    }
  }, [selectedId, page, search]);

  useEffect(() => {
    void loadWords();
  }, [loadWords]);

  const selected = categories.find((c) => c.id === selectedId) ?? null;

  // ─── Categories ────────────────────────────────────────────────
  const saveCat = async () => {
    if (!catEditor || savingCat) return;
    if (!catEditor.name.trim()) {
      toast.error('Cần tên danh mục');
      return;
    }
    setSavingCat(true);
    const body = { name: catEditor.name.trim(), icon: catEditor.icon || undefined };
    try {
      if (catEditor.id == null) {
        await languageAdminApi.createVocabCategory(languageId, { ...body, order: categories.length });
        toast.success('Đã tạo danh mục');
      } else {
        await languageAdminApi.updateVocabCategory(catEditor.id, body);
        toast.success('Đã cập nhật');
      }
      setCatEditor(null);
      await loadCats();
    } catch (e) {
      toast.error(errMsg(e, 'Lưu thất bại'));
    } finally {
      setSavingCat(false);
    }
  };

  const removeCat = async (c: VocabCategory) => {
    if (!window.confirm(`Xóa danh mục "${c.name}" và toàn bộ từ vựng trong đó?`)) return;
    try {
      await languageAdminApi.deleteVocabCategory(c.id);
      toast.success('Đã xóa');
      if (selectedId === c.id) setSelectedId(null);
      await loadCats();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  const reorderCats = async (ordered: VocabCategory[]) => {
    setCategories(ordered);
    try {
      await languageAdminApi.reorder('vocabCategory', ordered.map((c, i) => ({ id: c.id, order: i })));
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được thứ tự'));
      await loadCats();
    }
  };

  // ─── Words ─────────────────────────────────────────────────────
  const saveWord = async () => {
    if (!wordEditor || !selected || savingWord) return;
    if (!wordEditor.word.trim() || !wordEditor.meaningVi.trim()) {
      toast.error('Cần từ và nghĩa tiếng Việt');
      return;
    }
    setSavingWord(true);
    const body = {
      word: wordEditor.word.trim(),
      meaningVi: wordEditor.meaningVi.trim(),
      exampleSentence: wordEditor.exampleSentence || undefined,
      exampleMeaning: wordEditor.exampleMeaning || undefined,
      imageUrl: wordEditor.imageUrl || undefined,
      audioUrl: wordEditor.audioUrl || undefined,
      note: wordEditor.note || undefined,
      pronunciations: wordEditor.pronunciations.filter((p) => p.type.trim() || p.value.trim()),
    };
    try {
      if (wordEditor.id == null) {
        await languageAdminApi.createVocabWord(selected.id, body);
        toast.success('Đã thêm từ');
      } else {
        await languageAdminApi.updateVocabWord(wordEditor.id, body);
        toast.success('Đã cập nhật');
      }
      setWordEditor(null);
      await loadWords();
      await loadCats();
    } catch (e) {
      toast.error(errMsg(e, 'Lưu thất bại'));
    } finally {
      setSavingWord(false);
    }
  };

  const removeWord = async (w: VocabWord) => {
    if (!window.confirm(`Xóa từ "${w.word}"?`)) return;
    try {
      await languageAdminApi.deleteVocabWord(w.id);
      toast.success('Đã xóa');
      await loadWords();
      await loadCats();
    } catch (e) {
      toast.error(errMsg(e, 'Xóa thất bại'));
    }
  };

  // ─── CSV ───────────────────────────────────────────────────────
  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mau-tu-vung.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const runPreview = async () => {
    if (!selected || !csvText.trim()) {
      toast.error('Dán nội dung CSV');
      return;
    }
    setCsvBusy(true);
    try {
      const rows = unwrap(await languageAdminApi.csvPreview(selected.id, csvText));
      setCsvPreview(rows);
    } catch (e) {
      toast.error(errMsg(e, 'Không xem trước được'));
    } finally {
      setCsvBusy(false);
    }
  };

  const runImport = async () => {
    if (!selected || !csvText.trim()) return;
    setCsvBusy(true);
    try {
      const res = unwrap(await languageAdminApi.csvImport(selected.id, csvText));
      toast.success(`Đã nhập ${res.created} từ, bỏ qua ${res.skipped}`);
      setCsvOpen(false);
      setCsvText('');
      setCsvPreview(null);
      await loadWords();
      await loadCats();
    } catch (e) {
      toast.error(errMsg(e, 'Nhập thất bại'));
    } finally {
      setCsvBusy(false);
    }
  };

  const setPron = (idx: number, patch: Partial<VocabPronunciation>) =>
    setWordEditor((prev) => (prev ? { ...prev, pronunciations: prev.pronunciations.map((p, i) => (i === idx ? { ...p, ...patch } : p)) } : prev));

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Danh mục</h3>
          <button onClick={() => setCatEditor({ id: null, name: '', icon: '' })} className={btnAdd}><Plus className="h-4 w-4" /> Danh mục</button>
        </div>
        {loadingCats ? (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-neon-violet" /></div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-text-muted">Chưa có danh mục.</p>
        ) : (
          <SortableList
            items={categories}
            getId={(c) => c.id}
            onReorder={reorderCats}
            renderItem={(c) => (
              <div className="flex items-center gap-2">
                <button onClick={() => { setSelectedId(c.id); setPage(1); }} className="flex min-w-0 flex-1 items-center gap-1 text-left">
                  <ChevronRight className={`h-4 w-4 shrink-0 ${selectedId === c.id ? 'text-neon-violet' : 'text-text-muted'}`} />
                  {c.icon && <span>{c.icon}</span>}
                  <span className={`truncate text-sm ${selectedId === c.id ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{c.name}</span>
                  <span className="ml-1 text-[11px] text-text-muted">({c._count?.words ?? c.wordCount ?? 0})</span>
                </button>
                <button onClick={() => setCatEditor({ id: c.id, name: c.name, icon: c.icon ?? '' })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
                <RowActions onDelete={() => removeCat(c)} />
              </div>
            )}
          />
        )}
      </div>

      {/* Words */}
      <div className="space-y-3">
        {!selected ? (
          <p className="text-sm text-text-muted">Chọn một danh mục để quản lý từ vựng.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-text-primary">Từ vựng — {selected.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => setAiOpen(true)} className={btnAdd}><Sparkles className="h-4 w-4" /> AI tạo từ</button>
                <button onClick={() => { setCsvOpen(true); setCsvPreview(null); }} className={btnGhost}><FileUp className="h-4 w-4" /> CSV</button>
                <button onClick={() => setWordEditor({ ...EMPTY_WORD })} className={btnAdd}><Plus className="h-4 w-4" /> Từ</button>
              </div>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm từ…" className={`${inputCls} pl-9`} />
            </div>
            <div className="rounded-2xl border border-darkborder bg-darkcard overflow-hidden">
              {loadingWords ? (
                <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-neon-violet" /></div>
              ) : words.length === 0 ? (
                <p className="py-12 text-center text-sm text-text-muted">Không có từ nào.</p>
              ) : (
                <ul className="divide-y divide-darkborder">
                  {words.map((w) => (
                    <li key={w.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02]">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">{w.word}</span>
                          {w.audioUrl && <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
                        </div>
                        <div className="truncate text-xs text-text-secondary">{w.meaningVi}</div>
                        {w.pronunciations.length > 0 && (
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            {w.pronunciations.map((p, i) => (
                              <span key={i} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-text-muted">{p.type}: {p.value}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => setWordEditor({ id: w.id, word: w.word, meaningVi: w.meaningVi, pronunciations: w.pronunciations.map((p) => ({ type: p.type, value: p.value })), exampleSentence: w.exampleSentence ?? '', exampleMeaning: w.exampleMeaning ?? '', imageUrl: w.imageUrl ?? '', audioUrl: w.audioUrl ?? '', note: w.note ?? '' })} className="rounded p-1.5 text-text-muted hover:bg-white/5 hover:text-neon-violet"><Pencil className="h-3.5 w-3.5" /></button>
                      <RowActions onDelete={() => removeWord(w)} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={`${btnGhost} disabled:opacity-40`}>Trước</button>
                <span className="text-text-muted">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className={`${btnGhost} disabled:opacity-40`}>Sau</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Category modal */}
      <Modal
        open={catEditor != null}
        onClose={() => !savingCat && setCatEditor(null)}
        title={catEditor?.id == null ? 'Thêm danh mục' : 'Sửa danh mục'}
        footer={
          <>
            <button onClick={() => setCatEditor(null)} disabled={savingCat} className={btnGhost}>Hủy</button>
            <button onClick={saveCat} disabled={savingCat} className={btnPrimary}>{savingCat && <Loader2 className="h-4 w-4 animate-spin" />} Lưu</button>
          </>
        }
      >
        {catEditor && (
          <div className="grid grid-cols-[1fr_100px] gap-3">
            <label className={labelCls}>Tên *<input value={catEditor.name} onChange={(e) => setCatEditor({ ...catEditor, name: e.target.value })} placeholder="Vd: Gia đình" className={`mt-1 ${inputCls}`} autoFocus /></label>
            <label className={labelCls}>Icon<input value={catEditor.icon} onChange={(e) => setCatEditor({ ...catEditor, icon: e.target.value })} placeholder="👨‍👩‍👧" className={`mt-1 ${inputCls}`} /></label>
          </div>
        )}
      </Modal>

      {/* Word modal */}
      <Modal
        open={wordEditor != null}
        onClose={() => !savingWord && setWordEditor(null)}
        title={wordEditor?.id == null ? 'Thêm từ' : 'Sửa từ'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button onClick={() => setWordEditor(null)} disabled={savingWord} className={btnGhost}>Hủy</button>
            <button onClick={saveWord} disabled={savingWord} className={btnPrimary}>{savingWord && <Loader2 className="h-4 w-4 animate-spin" />} Lưu</button>
          </>
        }
      >
        {wordEditor && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelCls}>Từ *<input value={wordEditor.word} onChange={(e) => setWordEditor({ ...wordEditor, word: e.target.value })} className={`mt-1 ${inputCls}`} autoFocus /></label>
              <label className={labelCls}>Nghĩa (VI) *<input value={wordEditor.meaningVi} onChange={(e) => setWordEditor({ ...wordEditor, meaningVi: e.target.value })} className={`mt-1 ${inputCls}`} /></label>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className={labelCls}>Phiên âm</span>
                <button type="button" onClick={() => setWordEditor({ ...wordEditor, pronunciations: [...wordEditor.pronunciations, { type: '', value: '' }] })} className="text-xs text-neon-violet hover:underline">+ Thêm dòng</button>
              </div>
              <div className="mt-1 space-y-2">
                {wordEditor.pronunciations.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={p.type} onChange={(e) => setPron(i, { type: e.target.value })} placeholder="loại (romaji, IPA…)" className={`${inputCls} w-40`} />
                    <input value={p.value} onChange={(e) => setPron(i, { value: e.target.value })} placeholder="giá trị" className={inputCls} />
                    <button type="button" onClick={() => setWordEditor({ ...wordEditor, pronunciations: wordEditor.pronunciations.filter((_, j) => j !== i) })} className="rounded p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-400"><X className="h-4 w-4" /></button>
                  </div>
                ))}
                {wordEditor.pronunciations.length === 0 && <p className="text-xs text-text-muted">Chưa có phiên âm.</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className={labelCls}>Câu ví dụ<textarea value={wordEditor.exampleSentence} onChange={(e) => setWordEditor({ ...wordEditor, exampleSentence: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
              <label className={labelCls}>Nghĩa ví dụ<textarea value={wordEditor.exampleMeaning} onChange={(e) => setWordEditor({ ...wordEditor, exampleMeaning: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
            </div>

            <ImageField value={wordEditor.imageUrl} onChange={(url) => setWordEditor({ ...wordEditor, imageUrl: url })} label="Ảnh minh họa" />
            <AudioField value={wordEditor.audioUrl} onChange={(url) => setWordEditor({ ...wordEditor, audioUrl: url })} label="Phát âm" />
            <button type="button" onClick={() => toast('Phát âm tự động ở trang học (TTS trên trình duyệt)')} className="text-xs text-neon-violet hover:underline">Tạo TTS</button>
            <label className={labelCls}>Ghi chú<textarea value={wordEditor.note} onChange={(e) => setWordEditor({ ...wordEditor, note: e.target.value })} rows={2} className={`mt-1 ${inputCls}`} /></label>
          </>
        )}
      </Modal>

      {/* CSV modal */}
      <Modal
        open={csvOpen}
        onClose={() => !csvBusy && setCsvOpen(false)}
        title="Nhập từ vựng từ CSV"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button onClick={() => setCsvOpen(false)} disabled={csvBusy} className={btnGhost}>Hủy</button>
            <button onClick={runPreview} disabled={csvBusy} className={btnGhost}>{csvBusy && <Loader2 className="h-4 w-4 animate-spin" />} Xem trước</button>
            <button onClick={runImport} disabled={csvBusy || !csvPreview} className={btnPrimary}>{csvBusy && <Loader2 className="h-4 w-4 animate-spin" />} Nhập</button>
          </>
        }
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">Dán nội dung CSV hoặc tải tệp .csv.</p>
          <button onClick={downloadTemplate} className="inline-flex items-center gap-1 text-xs text-neon-violet hover:underline"><Download className="h-3.5 w-3.5" /> Tải mẫu CSV</button>
        </div>
        <input
          type="file"
          accept=".csv,text/csv"
          className="text-xs text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-text-secondary"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) f.text().then((t) => { setCsvText(t); setCsvPreview(null); });
            e.target.value = '';
          }}
        />
        <textarea value={csvText} onChange={(e) => { setCsvText(e.target.value); setCsvPreview(null); }} rows={6} placeholder="word,pronunciation_type_1,..." className={inputCls} />
        {csvPreview && (
          <div className="max-h-64 overflow-auto rounded-lg border border-darkborder">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-darkcard text-text-muted">
                <tr>
                  <th className="px-2 py-1.5 text-left">#</th>
                  <th className="px-2 py-1.5 text-left">Từ</th>
                  <th className="px-2 py-1.5 text-left">Nghĩa</th>
                  <th className="px-2 py-1.5 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkborder">
                {csvPreview.map((r) => (
                  <tr key={r.row} className={r.valid ? '' : 'bg-red-500/10'}>
                    <td className="px-2 py-1.5 text-text-muted">{r.row}</td>
                    <td className="px-2 py-1.5 text-text-primary">{r.word}</td>
                    <td className="px-2 py-1.5 text-text-secondary">{r.meaningVi}</td>
                    <td className="px-2 py-1.5">{r.valid ? <span className="text-emerald-400">OK</span> : <span className="text-red-400">{r.error || 'Lỗi'}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {selected && (
        <AiGeneratePanel
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          section="vocab"
          languageCode={code}
          categoryId={selected.id}
          onCommitted={loadWords}
        />
      )}
    </div>
  );
}
