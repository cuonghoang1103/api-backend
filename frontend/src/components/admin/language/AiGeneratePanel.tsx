'use client';

// AiGeneratePanel — admin AI content generator (preview → tick → save).
// Shared by Vocab/Grammar/Conversation/Qna/Reading tabs. Calls
// languageAdminApi.aiGenerate (preview, no DB write) then aiCommit (insert
// the ticked items). Deduplicates server-side against existing content.

import { useMemo, useState } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi, type AiGenProposal } from '@/lib/language-api';
import { Modal, inputCls, labelCls, btnPrimary, btnGhost, unwrap, errMsg } from './shared';

const LEVELS: Record<string, string[]> = {
  ja: ['N5', 'N4', 'N3', 'N2', 'N1'],
  zh: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5'],
  ko: ['TOPIK1', 'TOPIK2', 'TOPIK3', 'TOPIK4'],
};
const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const SECTION_LABEL: Record<string, string> = {
  vocab: 'từ vựng',
  grammar: 'ngữ pháp',
  conversation: 'hội thoại',
  qna: 'Q&A',
  reading: 'câu hỏi bài đọc',
};

export default function AiGeneratePanel({
  open,
  onClose,
  section,
  languageCode,
  categoryId,
  articleId,
  onCommitted,
  onItems,
}: {
  open: boolean;
  onClose: () => void;
  section: 'vocab' | 'grammar' | 'conversation' | 'qna' | 'reading';
  languageCode: string;
  categoryId?: number;
  articleId?: number;
  onCommitted?: () => void;
  /** When provided, "Lưu" hands the picked items to the parent instead of
   *  writing to the DB (used by Reading to drop questions into the form). */
  onItems?: (items: Record<string, unknown>[]) => void;
}) {
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(6);
  const [generating, setGenerating] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [proposals, setProposals] = useState<AiGenProposal[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const levelChips = useMemo(() => LEVELS[languageCode.toLowerCase()] ?? CEFR, [languageCode]);

  const generate = async (append = false) => {
    setGenerating(true);
    try {
      const res = unwrap(await languageAdminApi.aiGenerate({ languageCode, section, categoryId, articleId, level: level.trim() || undefined, topic: topic.trim() || undefined, count }));
      const incoming = res.items ?? [];
      if (append) {
        setProposals((prev) => {
          const seen = new Set(prev.map((p) => p.key));
          const merged = [...prev, ...incoming.filter((p) => !seen.has(p.key))];
          return merged;
        });
        setSelected((prev) => { const next = new Set(prev); incoming.forEach((p) => next.add(p.key)); return next; });
      } else {
        setProposals(incoming);
        setSelected(new Set(incoming.map((p) => p.key)));
      }
    } catch (e) {
      toast.error(errMsg(e, 'Không tạo được nội dung'));
    } finally {
      setGenerating(false);
    }
  };

  const commit = async () => {
    const items = proposals.filter((p) => selected.has(p.key)).map((p) => p.data);
    if (!items.length) { toast.info('Chưa chọn mục nào'); return; }
    if (onItems) {
      onItems(items);
      toast.success(`Đã thêm ${items.length} mục vào biểu mẫu`);
      reset();
      onClose();
      return;
    }
    setCommitting(true);
    try {
      const res = unwrap(await languageAdminApi.aiCommit({ languageCode, section, categoryId, articleId, items }));
      toast.success(`Đã lưu ${res.created} mục${res.skipped ? `, bỏ qua ${res.skipped} (trùng)` : ''}`);
      onCommitted?.();
      reset();
      onClose();
    } catch (e) {
      toast.error(errMsg(e, 'Không lưu được'));
    } finally {
      setCommitting(false);
    }
  };

  const reset = () => { setProposals([]); setSelected(new Set()); setTopic(''); };

  const toggle = (key: string) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose(); }}
      title={`✨ AI tạo ${SECTION_LABEL[section] ?? 'nội dung'}`}
      maxWidth="max-w-2xl"
      footer={
        proposals.length > 0 ? (
          <>
            <button className={btnGhost} onClick={() => generate(true)} disabled={generating || committing}>
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Sinh thêm
            </button>
            <button className={btnPrimary} onClick={commit} disabled={committing || !selected.size}>
              {committing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {onItems ? 'Thêm' : 'Lưu'} {selected.size} mục
            </button>
          </>
        ) : (
          <button className={btnPrimary} onClick={() => generate(false)} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Sinh
          </button>
        )
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Cấp độ (tùy chọn)</label>
          <input className={inputCls} value={level} onChange={(e) => setLevel(e.target.value)} placeholder="vd: N5 / A1" />
          <div className="mt-1.5 flex flex-wrap gap-1">
            {levelChips.map((lv) => (
              <button key={lv} type="button" onClick={() => setLevel(lv)} className={`rounded-full px-2 py-0.5 text-[11px] ring-1 transition ${level === lv ? 'bg-neon-violet/20 text-violet-200 ring-neon-violet/40' : 'text-text-muted ring-darkborder hover:text-text-primary'}`}>{lv}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Số lượng</label>
          <input type="number" min={3} max={12} className={inputCls} value={count} onChange={(e) => setCount(Math.max(3, Math.min(12, Number(e.target.value) || 6)))} />
        </div>
      </div>
      {section !== 'reading' && (
        <div>
          <label className={labelCls}>Chủ đề (tùy chọn)</label>
          <input className={inputCls} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="vd: gia đình, công việc, du lịch…" />
        </div>
      )}
      {section === 'reading' && (
        <p className="rounded-lg bg-neon-violet/10 px-3 py-2 text-xs text-violet-200">Câu hỏi sẽ được tạo dựa trên nội dung bài đọc đang mở.</p>
      )}

      {proposals.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>{proposals.length} đề xuất · đã chọn {selected.size}</span>
            <button type="button" className="text-neon-violet hover:underline" onClick={() => setSelected(selected.size === proposals.length ? new Set() : new Set(proposals.map((p) => p.key)))}>
              {selected.size === proposals.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>
          <ul className="space-y-1.5">
            {proposals.map((p) => {
              const on = selected.has(p.key);
              return (
                <li key={p.key}>
                  <button type="button" onClick={() => toggle(p.key)} className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition ${on ? 'border-neon-violet/50 bg-neon-violet/10' : 'border-darkborder hover:bg-white/5'}`}>
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? 'border-neon-violet bg-neon-violet text-white' : 'border-darkborder'}`}>
                      {on && <Check className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0 break-words text-text-primary">{p.summary}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Modal>
  );
}
