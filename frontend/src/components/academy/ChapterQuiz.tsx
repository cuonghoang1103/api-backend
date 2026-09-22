'use client';

// Đề luyện CUỐI CHƯƠNG — câu hỏi ĐỀ THẬT (FE/PE/PT) đã gán về chương
// (ExamQuestion.sectionId), làm ngay trong bài học.
//
// ── Bản 22/09/2026 — người dùng: ──────────────────────────────────────────
//  "bài quiz 2 bạn lại cho nó nằm trong lộ trình học dưới kia, làm nhiều user
//   không biết có bài quiz chuyên sâu này … tách riêng ra 1 mục Quiz và bài
//   thực hành đúng chương đó ở đầu trang quiz … Ấn 1 cái là vào thi luôn.
//   … làm xong câu nào hiện đáp án câu đó để user biết đúng sai luôn … không
//   cần phải làm full đợi nộp như quiz 1. Và thêm tính năng AI hỏi chuyên sâu
//   từng câu quiz này."
//
// Nên:
//  • `KhoiLuyenChuong` (variant 'top') — khối nổi bật ở ĐẦU trang quiz của
//    chương, trang học tự gắn vào. Khối trong "Lộ trình học" vẫn giữ nguyên
//    chỗ cũ (variant 'inline'), và app desktop vẫn dùng bản 'inline'.
//  • CHẤM TỪNG CÂU NGAY: câu một đáp án thì bấm là chấm; câu nhiều đáp án thì
//    chọn xong bấm "Kiểm tra". Đúng/sai + đáp án đúng + giải thích hiện ngay
//    dưới câu. Không còn nút "Nộp bài" chờ làm hết.
//  • Làm từng câu một (như phòng thi), có lưới số câu tô màu đúng/sai, phím
//    tắt, "Làm lại các câu sai".
//  • AI TỪNG CÂU: nút robot trên mỗi câu mở khung CuongMini (gia sư Phòng thi,
//    cache dùng chung) — "Hỏi theo câu" + chín câu hỏi dựng sẵn + chat. Con
//    robot nổi ở góc màn hình cũng mở đúng khung này (xem `hoiCauLuyenStore`).
//
// Render đề/đáp án/giải thích Y HỆT phòng thi: dùng lại ExamRichContent
// (KaTeX + sơ đồ mermaid + HTML + xuống dòng), kèm ảnh (imageUrl).
//
// ⚠️ App desktop dùng lại tệp này (`monHoc.tsx`) và có phép kiểm đọc mọi
// `var(--…)` ở đây (`giaoDienBai.test.ts`): chỉ dùng biến chủ đề đã có cầu
// nối — `--bg-card`, `--bg-surface(-active)`, `--border-color`, `--text-*`,
// `--accent-color`, `--exam-ok/bad`.

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  FileQuestion, Loader2, Shuffle, ListChecks, X, CheckCircle2, XCircle, RotateCcw, Languages,
  PenLine, ArrowLeft, ArrowRight, Play, ExternalLink, Trophy, Keyboard, Flag,
} from 'lucide-react';
import { api } from '@/lib/api';
import ExamRichContent from '@/app/exam/ExamRichContent';
import { pickLang } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';
import { useHoiCauLuyenStore, type CauTomTat, type TrangThaiCau } from '@/store/hoiCauLuyenStore';
import RobotAI from './RobotAI';
import HoiAICauLuyen from './HoiAICauLuyen';
import { CHE_DO_HOI, useHoiCauLuyen } from './useHoiCauLuyen';

interface ExamQ {
  id: number;
  prompt: string;
  imageUrl: string | null;
  options: unknown; // [{text}] | string[]
  correctIndexes: number[];
  explanation?: string | null;
  points: number;
  examKind?: string | null;
}

// Câu THỰC HÀNH (PE) của chương — không trắc nghiệm nên không tự chấm được;
// hiện đề + đề bài gốc, lời giải mẫu giấu trong <details> để tự làm trước.
interface PracticeQ {
  id: number;
  kind: string;                 // WRITE | CODE
  points: number;
  prompt: string;
  imageUrl: string | null;
  language?: string | null;
  starterCode?: string | null;
  sampleSolution?: string | null;
  expectedOutput?: string | null;
  rubric?: unknown;
  explanation?: string | null;
  examCode?: string | null;
  examTitle?: string | null;
}

const normOpts = (o: unknown): string[] =>
  Array.isArray(o) ? o.map((x) => (typeof x === 'string' ? x : ((x as { text?: string })?.text ?? ''))) : [];
const sameSet = (a: number[], b: number[]) =>
  a.length === b.length && [...a].sort((x, y) => x - y).join(',') === [...b].sort((x, y) => x - y).join(',');
const LETTER = (i: number) => String.fromCharCode(65 + i); // 0 → A
const laNhieuDapAn = (q: ExamQ) => (q.correctIndexes?.length || 0) > 1;

/** Đề → một dòng chữ thuần (cho danh sách "Hỏi theo câu" và lưới câu). */
function tomTatDe(html: string, L: 'vi' | 'en'): string {
  return pickLang(html, L)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

// ── Một câu hỏi — chấm NGAY khi chọn ─────────────────────────────────────
function CauHoi({ q, so, tong, L, chon, daCham, moAI, onChon, onKiemTra, onBatAI, onHoiViSao }: {
  q: ExamQ; so: number; tong: number; L: 'vi' | 'en';
  chon: number[]; daCham: boolean; moAI: boolean;
  onChon: (i: number) => void;
  onKiemTra: () => void;
  onBatAI: () => void;
  /** Một cú bấm: mở khung AI và hỏi luôn "Câu này làm như nào?". */
  onHoiViSao: () => void;
}) {
  const opts = normOpts(q.options);
  const multi = laNhieuDapAn(q);
  const dung = daCham && sameSet(chon, q.correctIndexes || []);
  const chuDung = (q.correctIndexes || []).map(LETTER).join(', ');

  return (
    <div className="rounded-xl border p-4 sm:p-5" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 items-center justify-center rounded-lg px-2 text-xs font-bold"
          style={{ background: 'var(--bg-surface)', color: 'var(--accent-color, #8b5cf6)' }}>
          Câu {so}<span className="font-medium" style={{ color: 'var(--text-muted)' }}>/{tong}</span>
        </span>
        {q.examKind && (
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
            đề {q.examKind}
          </span>
        )}
        {multi && <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>(chọn {q.correctIndexes.length} đáp án)</span>}

        {/* Nút robot — lối vào AI của RIÊNG câu này. */}
        <button
          type="button"
          onClick={onBatAI}
          aria-pressed={moAI}
          aria-label={moAI ? 'Đóng khung hỏi CuongMini' : `Hỏi CuongMini về câu ${so}`}
          title="Bí câu này? Hỏi CuongMini — gợi ý, dịch đề, cách làm từng bước…"
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl border py-1 pl-1 pr-2.5 text-xs font-semibold transition-colors"
          style={{
            borderColor: moAI ? 'var(--accent-color, #8b5cf6)' : 'var(--border-color)',
            background: moAI ? 'color-mix(in srgb, var(--accent-color, #8b5cf6) 14%, transparent)' : 'var(--bg-surface)',
            color: moAI ? 'var(--accent-color, #8b5cf6)' : 'var(--text-secondary)',
          }}
        >
          <RobotAI size={24} />
          Hỏi AI
        </button>
      </div>

      <ExamRichContent html={q.prompt} L={L} className="text-[15px] leading-relaxed" />
      {q.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={q.imageUrl} alt="" className="mt-2 max-w-full rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
      )}

      <div className="mt-4 space-y-2" role="group" aria-label={`Các đáp án của câu ${so}`}>
        {opts.map((o, i) => {
          const sel = chon.includes(i);
          const correct = (q.correctIndexes || []).includes(i);
          // Sau khi chấm: đúng → xanh, chọn mà sai → đỏ, còn lại → mờ đi.
          let border = 'var(--border-color)'; let bg = 'var(--bg-surface)'; let mo = false;
          if (daCham && correct) { border = 'var(--exam-ok, #22c55e)'; bg = 'rgba(34,197,94,0.12)'; }
          else if (daCham && sel) { border = 'var(--exam-bad, #ef4444)'; bg = 'rgba(239,68,68,0.12)'; }
          else if (daCham) { mo = true; }
          else if (sel) { border = 'var(--accent-color, #8b5cf6)'; bg = 'var(--bg-surface-active, var(--bg-surface))'; }
          const toDam = sel || (daCham && correct);
          return (
            <button key={i} type="button" disabled={daCham} onClick={() => onChon(i)} aria-pressed={sel}
              className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${daCham ? '' : 'hover:opacity-90'} ${mo ? 'opacity-60' : ''}`}
              style={{ borderColor: border, background: bg, color: 'var(--text-primary)' }}>
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                style={{
                  background: toDam ? (daCham ? (correct ? 'var(--exam-ok, #22c55e)' : 'var(--exam-bad, #ef4444)') : 'var(--accent-color, #8b5cf6)') : 'transparent',
                  color: toDam ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${toDam ? 'transparent' : 'var(--border-color)'}`,
                }}>
                {LETTER(i)}
              </span>
              <ExamRichContent html={o} L={L} inline className="min-w-0 flex-1 pt-0.5" />
              {daCham && correct && <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--exam-ok, #22c55e)' }} />}
              {daCham && sel && !correct && <XCircle size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--exam-bad, #ef4444)' }} />}
            </button>
          );
        })}
      </div>

      {/* Câu nhiều đáp án: chọn đủ rồi mới chấm — bấm là chấm thì không chọn nổi đáp án thứ hai. */}
      {multi && !daCham && (
        <button type="button" onClick={onKiemTra} disabled={!chon.length}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: 'var(--accent-color, #8b5cf6)' }}>
          <CheckCircle2 size={15} /> Kiểm tra đáp án
        </button>
      )}

      {daCham && (
        <div className="mt-4 overflow-hidden rounded-xl border" role="status"
          style={{ borderColor: dung ? 'var(--exam-ok, #22c55e)' : 'var(--exam-bad, #ef4444)' }}>
          <div className="flex flex-wrap items-center gap-2 px-3.5 py-2.5"
            style={{ background: dung ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)' }}>
            {dung
              ? <CheckCircle2 size={18} style={{ color: 'var(--exam-ok, #22c55e)' }} />
              : <XCircle size={18} style={{ color: 'var(--exam-bad, #ef4444)' }} />}
            <span className="text-sm font-bold" style={{ color: dung ? 'var(--exam-ok, #22c55e)' : 'var(--exam-bad, #ef4444)' }}>
              {dung ? 'Chính xác!' : 'Chưa đúng'}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Đáp án đúng: <b style={{ color: 'var(--text-primary)' }}>{chuDung || '?'}</b>
            </span>
            <button type="button" onClick={onHoiViSao}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-opacity hover:opacity-85"
              style={{ color: 'var(--accent-color, #8b5cf6)', background: 'var(--bg-card)' }}>
              <RobotAI size={18} /> {dung ? 'Giảng kỹ hơn' : 'Vì sao? Hỏi CuongMini'}
            </button>
          </div>
          {q.explanation ? (
            <div className="border-t px-3.5 py-3 text-[13.5px]" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Giải thích</span>
              <ExamRichContent html={q.explanation} L={L} className="exam-explain" />
            </div>
          ) : (
            <p className="border-t px-3.5 py-2.5 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
              Đề gốc không kèm lời giải cho câu này — bấm &ldquo;{dung ? 'Giảng kỹ hơn' : 'Vì sao? Hỏi CuongMini'}&rdquo; để AI giảng.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Lưới số câu — nhảy câu, thấy ngay câu nào đúng/sai/chưa làm ──────────
function LuoiCau({ ds, idx, onChon }: { ds: CauTomTat[]; idx: number; onChon: (i: number) => void }) {
  if (ds.length < 2) return null;
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
      <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
        <span className="font-semibold uppercase tracking-wide">Danh sách câu</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--exam-ok, #22c55e)' }} /> đúng</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--exam-bad, #ef4444)' }} /> sai</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border" style={{ borderColor: 'var(--border-color)' }} /> chưa làm</span>
      </div>
      {/* `max-h` + cuộn: bộ "làm tất cả" tới 200 câu không được chiếm cả màn hình. */}
      <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
        {ds.map((c, i) => {
          const dangXem = i === idx;
          const nen = c.trangThai === 'dung' ? 'var(--exam-ok, #22c55e)' : c.trangThai === 'sai' ? 'var(--exam-bad, #ef4444)' : 'var(--bg-surface)';
          return (
            <button key={c.id} type="button" onClick={() => onChon(i)}
              aria-label={`Câu ${c.soThuTu}${c.trangThai === 'dung' ? ' — đúng' : c.trangThai === 'sai' ? ' — sai' : ''}`}
              aria-current={dangXem ? 'true' : undefined}
              title={c.tomTat}
              className="h-7 min-w-7 rounded-md px-1 text-[11px] font-bold transition-transform hover:scale-105"
              style={{
                background: nen,
                color: c.trangThai === 'chua' ? 'var(--text-secondary)' : '#fff',
                border: `1px solid ${c.trangThai === 'chua' ? 'var(--border-color)' : 'transparent'}`,
                outline: dangXem ? '2px solid var(--accent-color, #8b5cf6)' : undefined,
                outlineOffset: 1,
              }}>
              {c.soThuTu}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Kết quả ────────────────────────────────────────────────────────────
function KetQua({ ds, onXemCau, onLamLaiSai, onLamLai, onDoi10, onLamTatCa, count, dangTai }: {
  ds: CauTomTat[];
  onXemCau: (i: number) => void;
  onLamLaiSai: () => void;
  onLamLai: () => void;
  onDoi10: () => void;
  onLamTatCa: () => void;
  count: number;
  dangTai: boolean;
}) {
  const dung = ds.filter((c) => c.trangThai === 'dung').length;
  const sai = ds.filter((c) => c.trangThai === 'sai').length;
  const chua = ds.length - dung - sai;
  const pct = ds.length ? Math.round((dung / ds.length) * 100) : 0;
  const loiKhen = pct >= 80 ? 'Xuất sắc! Bạn nắm chắc chương này.'
    : pct >= 50 ? 'Khá ổn — ôn lại các câu sai là vững.'
      : 'Cần ôn thêm — làm lại câu sai và hỏi CuongMini những câu chưa hiểu.';
  const dsSai = ds.map((c, i) => ({ c, i })).filter(({ c }) => c.trangThai === 'sai');

  return (
    <div className="rounded-xl border p-5 text-center" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
      <Trophy size={30} className="mx-auto" style={{ color: pct >= 50 ? 'var(--exam-ok, #22c55e)' : 'var(--accent-color, #8b5cf6)' }} />
      <p className="mt-2 text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
        {dung}<span className="text-lg font-bold" style={{ color: 'var(--text-muted)' }}>/{ds.length}</span>
        <span className="ml-2 text-lg font-bold" style={{ color: pct >= 50 ? 'var(--exam-ok, #22c55e)' : 'var(--exam-bad, #ef4444)' }}>{pct}%</span>
      </p>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{loiKhen}</p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        Đúng {dung} · Sai {sai}{chua ? ` · Chưa làm ${chua}` : ''}
      </p>

      {dsSai.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Xem lại câu sai:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {dsSai.map(({ c, i }) => (
              <button key={c.id} type="button" onClick={() => onXemCau(i)}
                className="rounded-md px-2 py-1 text-[11px] font-bold text-white" style={{ background: 'var(--exam-bad, #ef4444)' }}>
                Câu {c.soThuTu}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {sai > 0 && (
          <button type="button" onClick={onLamLaiSai}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent-color, #8b5cf6)' }}>
            <RotateCcw size={14} /> Làm lại {sai} câu sai
          </button>
        )}
        <button type="button" onClick={onLamLai}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          <RotateCcw size={14} /> Làm lại từ đầu
        </button>
        <button type="button" onClick={onDoi10} disabled={dangTai}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium disabled:opacity-50" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          {dangTai ? <Loader2 size={14} className="animate-spin" /> : <Shuffle size={14} />} 10 câu khác
        </button>
        {count > ds.length && (
          <button type="button" onClick={onLamTatCa} disabled={dangTai}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium disabled:opacity-50" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <ListChecks size={14} /> Làm tất cả {count} câu
          </button>
        )}
      </div>
    </div>
  );
}

// ── Khối THỰC HÀNH (PE) của chương ────────────────────────────────────
// Tách riêng khỏi quiz trắc nghiệm: câu PE là bài viết/vẽ/code nên KHÔNG chấm
// tự động được. Hiện đề thật + lời giải mẫu giấu trong <details> để người học
// tự làm trước rồi mới đối chiếu.
function PracticeBlock({ sectionId, L, tuMo = false, coVien = true }: {
  sectionId: number; L: 'vi' | 'en';
  /** Nạp ngay khi hiện (khối đầu trang đã có nút mở riêng). */
  tuMo?: boolean;
  coVien?: boolean;
}) {
  const [items, setItems] = useState<PracticeQ[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      // limit=50 = trần của route: khối đầu trang hứa đúng số bài ĐÃ khử trùng
      // (xem /summary), mặc định 20 của route sẽ cắt bớt mà không báo.
      const r = await api.get<{ success: boolean; data: PracticeQ[] }>(
        `/exams/practice/by-section/${sectionId}/practical`, { params: { limit: 50 } },
      );
      const data = r.data?.data ?? [];
      if (!data.length) { setErr('Chương này chưa có bài thực hành từ đề PE.'); return; }
      setItems(data);
    } catch {
      setErr('Không tải được bài thực hành. Thử lại nhé.');
    } finally { setLoading(false); }
  }, [sectionId]);

  const daNap = useRef(false);
  useEffect(() => {
    if (!tuMo || daNap.current) return;
    daNap.current = true;
    void load();
  }, [tuMo, load]);

  const vien = coVien ? 'mt-2 border-t pt-3' : '';

  if (!items) {
    if (tuMo) {
      return (
        <div className={vien} style={{ borderColor: 'var(--border-color)' }}>
          {loading && <p className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tải bài thực hành…</p>}
          {err && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {err} {!/chưa có/.test(err) && <button type="button" onClick={() => void load()} className="underline">Thử lại</button>}
            </p>
          )}
        </div>
      );
    }
    return (
      <div className={vien} style={{ borderColor: 'var(--border-color)' }}>
        <button type="button" disabled={loading} onClick={load}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PenLine className="h-3.5 w-3.5" />}
          Bài thực hành (PE) của chương này
        </button>
        {err && <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>{err}</p>}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${vien}`} style={{ borderColor: 'var(--border-color)' }}>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        <b>{items.length} bài thực hành</b> lấy từ đề PE thật đã gán về chương này. Không chấm tự động —
        tự làm rồi mở lời giải mẫu để đối chiếu.
      </p>
      {items.map((p, i) => (
        <div key={p.id} className="rounded-lg border p-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="rounded px-1.5 py-0.5 font-bold" style={{ background: 'rgba(139,92,246,.15)', color: 'var(--accent-color,#8b5cf6)' }}>
              Bài {i + 1} · {p.kind}
            </span>
            <span>{p.points} điểm</span>
            {p.examCode && <span>· từ đề {p.examCode}</span>}
            {p.language && <span>· {p.language}</span>}
          </div>
          <ExamRichContent html={p.prompt} L={L} />
          {p.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.imageUrl} alt="" className="mt-2 max-w-full rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
          )}
          {p.starterCode && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Mã cho sẵn</summary>
              <pre className="mt-1.5 overflow-x-auto rounded-lg p-2.5 text-[11px]" style={{ background: 'var(--bg-surface)' }}><code>{p.starterCode}</code></pre>
            </details>
          )}
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold" style={{ color: 'var(--accent-color,#8b5cf6)' }}>Xem lời giải mẫu</summary>
            {p.sampleSolution && (
              <pre className="mt-1.5 overflow-x-auto rounded-lg p-2.5 text-[11px]" style={{ background: 'var(--bg-surface)' }}><code>{p.sampleSolution}</code></pre>
            )}
            {p.expectedOutput && (
              <>
                <p className="mt-2 text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Kết quả mong đợi</p>
                <pre className="mt-1 overflow-x-auto rounded-lg p-2.5 text-[11px]" style={{ background: 'var(--bg-surface)' }}><code>{p.expectedOutput}</code></pre>
              </>
            )}
            {p.explanation && <div className="mt-2"><ExamRichContent html={p.explanation} L={L} className="exam-explain" /></div>}
          </details>
        </div>
      ))}
    </div>
  );
}

export function ChapterQuiz({ sectionId, sectionTitle, count, courseCode, variant = 'inline', soPE }: {
  sectionId: number; sectionTitle?: string;
  /** Số câu trắc nghiệm. Khối đầu trang truyền số ĐÃ khử trùng (/summary); Lộ trình học truyền số thô. */
  count: number;
  /** Số bài thực hành (PE) đã khử trùng — chỉ khối đầu trang biết. 0 ⇒ ẩn thẻ PE. */
  soPE?: number;
  /**
   * Còn giữ để không vỡ nơi gọi cũ (app desktop vẫn truyền). Gia sư giờ đi
   * theo TỪNG CÂU (CuongMini, ngữ cảnh là đề + đáp án) chứ không theo bài.
   */
  lessonId?: number;
  /** Có ⇒ khối đầu trang hiện nút "Mở trên Phòng Thi". */
  courseCode?: string;
  /** 'top' = khối nổi bật đầu trang quiz; 'inline' = trong Lộ trình học / app desktop. */
  variant?: 'top' | 'inline';
}) {
  const [qs, setQs] = useState<ExamQ[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [chon, setChon] = useState<Record<number, number[]>>({});
  const [daCham, setDaCham] = useState<Record<number, boolean>>({});
  const [xemKetQua, setXemKetQua] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [L, setL] = useState<'vi' | 'en'>('vi');
  const [moAI, setMoAI] = useState(false);
  const [moPE, setMoPE] = useState(false);

  const gocRef = useRef<HTMLDivElement>(null);
  const cauRef = useRef<HTMLDivElement>(null);
  const khoa = useId();
  const top = variant === 'top';

  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { isPro } = usePro();
  const { hoi } = useHoiCauLuyen();

  const batDau = useCallback((data: ExamQ[]) => {
    setQs(data); setIdx(0); setChon({}); setDaCham({}); setXemKetQua(false);
    requestAnimationFrame(() => {
      gocRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Đặt focus vào khối để phím tắt (A–D, Enter, ←/→) chạy ngay.
      gocRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const start = useCallback(async (mode: 'random' | 'all') => {
    setLoading(true); setErr(null);
    try {
      const params = mode === 'random' ? { random: 1, limit: 10 } : {};
      const r = await api.get<{ success: boolean; data: ExamQ[] }>(`/exams/practice/by-section/${sectionId}`, { params });
      const data = r.data?.data ?? [];
      if (!data.length) { setErr('Chương này chưa có câu luyện.'); return; }
      batDau(data);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setErr(status === 401 ? 'Đăng nhập để làm đề luyện chương.' : 'Không tải được đề luyện. Thử lại nhé.');
    } finally {
      setLoading(false);
    }
  }, [sectionId, batDau]);

  const laDung = useCallback((q: ExamQ) => sameSet(chon[q.id] || [], q.correctIndexes || []), [chon]);
  const trangThai = useCallback((q: ExamQ): TrangThaiCau => (!daCham[q.id] ? 'chua' : laDung(q) ? 'dung' : 'sai'), [daCham, laDung]);

  const dsCau: CauTomTat[] = useMemo(() => (qs || []).map((q, i) => ({
    id: q.id, soThuTu: i + 1, tomTat: tomTatDe(q.prompt, L), trangThai: trangThai(q),
  })), [qs, L, trangThai]);

  const soDung = dsCau.filter((c) => c.trangThai === 'dung').length;
  const soSai = dsCau.filter((c) => c.trangThai === 'sai').length;
  const soDaLam = soDung + soSai;
  const tong = qs?.length ?? 0;

  /* Cuộn về đầu câu khi đổi câu — nhưng chỉ khi đầu câu đã trôi khỏi tầm mắt
     (người học vừa cuộn xuống đọc giải thích). Đang thấy rồi mà vẫn cuộn là
     màn hình giật mỗi lần bấm "Câu tiếp". */
  const cuonVeCau = useCallback(() => {
    requestAnimationFrame(() => {
      const el = cauRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < 64 || r.top > window.innerHeight * 0.55) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const denCau = useCallback((i: number) => {
    if (!qs) return;
    setIdx(Math.max(0, Math.min(qs.length - 1, i)));
    setXemKetQua(false);
    cuonVeCau();
  }, [qs, cuonVeCau]);

  const tiep = useCallback(() => {
    if (!qs) return;
    if (idx < qs.length - 1) denCau(idx + 1);
    else { setXemKetQua(true); cuonVeCau(); }
  }, [qs, idx, denCau, cuonVeCau]);

  const chonDapAn = useCallback((q: ExamQ, i: number) => {
    if (daCham[q.id]) return;
    if (laNhieuDapAn(q)) {
      setChon((p) => {
        const cur = p[q.id] || [];
        return { ...p, [q.id]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] };
      });
      return;
    }
    // Câu một đáp án: bấm là CHỐT và CHẤM luôn — đúng yêu cầu "làm xong câu nào hiện đáp án câu đó".
    setChon((p) => ({ ...p, [q.id]: [i] }));
    setDaCham((p) => ({ ...p, [q.id]: true }));
  }, [daCham]);

  const kiemTra = useCallback((q: ExamQ) => {
    if (!(chon[q.id] || []).length) return;
    setDaCham((p) => ({ ...p, [q.id]: true }));
  }, [chon]);

  const cau = qs?.[idx];

  /* "Vì sao? Hỏi CuongMini" — một cú bấm: mở khung và hỏi luôn câu "làm như
     nào". Chưa đăng nhập/chưa Pro thì chỉ mở khung (khung tự hiện lời mời),
     không bắn một lượt chắc chắn bị 403. Đã hỏi đúng câu đó rồi thì chỉ mở —
     hỏi lại là thêm một bong bóng trùng. */
  const hoiViSao = useCallback((q: ExamQ) => {
    setMoAI(true);
    if (!isAuthed || !isPro) return;
    const nhan = CHE_DO_HOI.find((c) => c.ma === 'how_to_solve')?.nhan;
    const cu = useHoiCauLuyenStore.getState().cuoc[q.id] ?? [];
    if (cu.some((t) => t.role === 'user' && t.content === nhan)) return;
    void hoi(q.id, 'how_to_solve');
  }, [isAuthed, isPro, hoi]);

  // ── Công bố phiên cho con robot nổi ──
  const datPhien = useHoiCauLuyenStore((s) => s.datPhien);
  const boPhien = useHoiCauLuyenStore((s) => s.boPhien);
  /* Hàm nhảy câu đi qua REF: phiên được ghi lại ở mỗi lần trả lời, còn hàm thì
     phải luôn là bản MỚI NHẤT (đóng kín `qs` cũ là nhảy sai bộ đề). */
  const denCauRef = useRef(denCau);
  denCauRef.current = denCau;
  const chonCauOn = useCallback((i: number) => denCauRef.current(i), []);
  useEffect(() => {
    if (!qs || !dsCau.length) { boPhien(khoa); return; }
    datPhien({
      khoa,
      tieuDe: sectionTitle ? `Luyện chương · ${sectionTitle}` : 'Luyện chương',
      dsCau,
      idx,
      chonCau: chonCauOn,
    });
  }, [qs, dsCau, idx, khoa, sectionTitle, datPhien, boPhien, chonCauOn]);
  useEffect(() => () => boPhien(khoa), [boPhien, khoa]);

  /* Phím tắt: A–I hoặc 1–9 chọn đáp án, Enter = kiểm tra / câu tiếp, ←/→ đổi câu.
     Gắn trên KHỐI (không gắn `window`): một trang có thể có hai khối luyện, và
     gõ trong ô hỏi AI không được biến thành chọn đáp án. */
  const onKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!qs || !cau || xemKetQua) return;
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.nativeEvent.isComposing) return;
    const t = e.target as HTMLElement;
    if (t.closest('textarea, input, select, [contenteditable="true"]')) return;
    const k = e.key.toLowerCase();
    /* Enter/Space trên một NÚT đang focus: để trình duyệt tự bấm nút đó. Bắt
       thêm ở đây là một phím chạy hai việc — "Câu tiếp" nhảy liền hai câu. */
    if ((k === 'enter' || k === ' ') && t.closest('button, a')) return;
    const soDA = normOpts(cau.options).length;
    let i = -1;
    if (/^[1-9]$/.test(k)) i = Number(k) - 1;
    else if (/^[a-i]$/.test(k)) i = k.charCodeAt(0) - 97;
    if (i >= 0) {
      if (i < soDA) { e.preventDefault(); chonDapAn(cau, i); }
      return;
    }
    if (k === 'enter') {
      e.preventDefault();
      if (!daCham[cau.id] && laNhieuDapAn(cau)) kiemTra(cau);
      else if (daCham[cau.id]) tiep();
    } else if (k === 'arrowright') {
      e.preventDefault(); tiep();
    } else if (k === 'arrowleft') {
      e.preventDefault(); denCau(idx - 1);
    }
  }, [qs, cau, xemKetQua, daCham, chonDapAn, kiemTra, tiep, denCau, idx]);

  // ══ CHƯA BẮT ĐẦU — thẻ mở ═══════════════════════════════════════════════
  if (!qs) {
    const nutVaoThi = (
      <button type="button" disabled={loading} onClick={() => void start('random')}
        className={`inline-flex items-center gap-1.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${top ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'}`}
        style={{ background: 'var(--accent-color, #8b5cf6)' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Vào thi ngay · {Math.min(10, count)} câu
      </button>
    );
    const nutTatCa = (
      <button type="button" disabled={loading} onClick={() => void start('all')}
        className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors hover:opacity-90 disabled:opacity-50 ${top ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'}`}
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
        <ListChecks className="h-4 w-4" /> Làm tất cả {count} câu
      </button>
    );

    if (top) {
      const coQuiz = count > 0;
      const coPE = soPE == null || soPE > 0;
      return (
        <section
          aria-label="Quiz chuyên sâu và bài thực hành của chương"
          className="mb-6 overflow-hidden rounded-2xl border"
          style={{
            borderColor: 'color-mix(in srgb, var(--accent-color, #8b5cf6) 45%, var(--border-color))',
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-color, #8b5cf6) 13%, var(--bg-card)) 0%, var(--bg-card) 62%)',
          }}
        >
          <div className="flex items-start gap-4 p-5">
            <RobotAI size={52} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-color, #8b5cf6)' }}>
                Quiz &amp; thực hành chương · đề thật từ Phòng Thi
              </p>
              <h3 className="mt-0.5 text-lg font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                {sectionTitle ? `Luyện chuyên sâu — ${sectionTitle}` : 'Luyện chuyên sâu chương này'}
              </h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {coQuiz ? (
                  <>
                    <b style={{ color: 'var(--text-primary)' }}>{count} câu trắc nghiệm thật</b> từ đề FE/PE/PT đã gán về chương này
                    {soPE ? <>, cùng <b style={{ color: 'var(--text-primary)' }}>{soPE} bài thực hành</b></> : null}.
                    Chọn đáp án là biết ngay đúng/sai kèm giải thích — không phải làm hết mới nộp.
                    Bí câu nào thì bấm con robot để <b style={{ color: 'var(--text-primary)' }}>CuongMini</b> gợi ý, dịch đề hoặc hướng dẫn từng bước.
                  </>
                ) : (
                  <><b style={{ color: 'var(--text-primary)' }}>{soPE} bài thực hành</b> từ đề PE thật đã gán về chương này, kèm lời giải mẫu để tự đối chiếu.</>
                )}
              </p>
            </div>
          </div>

          <div className={`grid gap-3 border-t p-4 ${coQuiz && coPE ? 'sm:grid-cols-2' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
            {coQuiz && (
              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <FileQuestion className="h-4 w-4" style={{ color: 'var(--accent-color, #8b5cf6)' }} /> Trắc nghiệm chuyên sâu · {count} câu
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>Chấm từng câu ngay · có giải thích · hỏi AI từng câu</p>
                <div className="mt-3 flex flex-wrap gap-2">{nutVaoThi}{count > 10 && nutTatCa}</div>
              </div>
            )}
            {coPE && (
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                <PenLine className="h-4 w-4" style={{ color: 'var(--accent-color, #8b5cf6)' }} /> Bài thực hành (PE){soPE ? ` · ${soPE} bài` : ''}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>Đề tự luận / code thật của chương · có lời giải mẫu</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setMoPE((v) => !v)} aria-expanded={moPE}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}>
                  <PenLine className="h-4 w-4" /> {moPE ? 'Ẩn bài thực hành' : 'Mở bài thực hành'}
                </button>
                {courseCode && (
                  <a href={`/exam?course=${encodeURIComponent(courseCode)}&section=${sectionId}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ color: 'var(--accent-color, #8b5cf6)' }}>
                    Mở trên Phòng Thi <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
            )}
          </div>
          {err && <p className="px-5 pb-3 text-xs" style={{ color: 'var(--exam-bad, #ef4444)' }}>{err}</p>}
          {moPE && (
            <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: 'var(--border-color)' }}>
              <PracticeBlock sectionId={sectionId} L={L} tuMo coVien={false} />
            </div>
          )}
        </section>
      );
    }

    return (
      <div className="ml-2 mt-2 rounded-xl border p-3.5" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
        <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          <FileQuestion className="h-4 w-4" style={{ color: 'var(--accent-color, #8b5cf6)' }} /> Đề luyện cuối chương — {count} câu
        </p>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          Câu hỏi <b>thật</b> từ đề FE/PE/PT của kiến thức chương này. Chọn là chấm ngay từng câu, có giải thích + hỏi được CuongMini từng câu.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">{nutVaoThi}{count > 10 && nutTatCa}</div>
        {err && <p className="mt-2 text-[11px]" style={{ color: 'var(--exam-bad, #ef4444)' }}>{err}</p>}
        <PracticeBlock sectionId={sectionId} L={L} />
      </div>
    );
  }

  // ══ ĐANG LÀM ════════════════════════════════════════════════════════════
  const daChamCau = !!(cau && daCham[cau.id]);
  const cauCuoi = idx === tong - 1;
  const lamXetHet = soDaLam === tong;

  return (
    <div
      ref={gocRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      aria-label="Quiz chuyên sâu của chương"
      className={`scroll-mt-24 rounded-2xl border outline-none ${top ? 'mb-6' : 'ml-2 mt-2'}`}
      style={{
        borderColor: top ? 'color-mix(in srgb, var(--accent-color, #8b5cf6) 45%, var(--border-color))' : 'var(--border-color)',
        background: 'var(--bg-surface)',
      }}
    >
      {/* Thanh đầu: tên + điểm chạy + ngôn ngữ + kết thúc/đóng */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-t-2xl border-b px-4 py-2.5"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
        <span className="flex min-w-0 items-center gap-1.5 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          <FileQuestion className="h-4 w-4 shrink-0" style={{ color: 'var(--accent-color, #8b5cf6)' }} />
          <span className="truncate">Quiz chuyên sâu{sectionTitle ? ` · ${sectionTitle}` : ''}</span>
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1" style={{ color: 'var(--exam-ok, #22c55e)' }}><CheckCircle2 size={13} /> {soDung}</span>
          <span className="inline-flex items-center gap-1" style={{ color: 'var(--exam-bad, #ef4444)' }}><XCircle size={13} /> {soSai}</span>
          <span style={{ color: 'var(--text-muted)' }}>· còn {tong - soDaLam}/{tong}</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setL((v) => (v === 'vi' ? 'en' : 'vi'))}
            title="Đổi ngôn ngữ đề (nếu đề có hai bản)"
            className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <Languages size={12} /> {L === 'vi' ? 'EN' : 'VI'}
          </button>
          {!xemKetQua && soDaLam > 0 && (
            <button type="button" onClick={() => { setXemKetQua(true); cuonVeCau(); }}
              className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              <Flag size={12} /> Kết thúc
            </button>
          )}
          <button type="button" onClick={() => { setQs(null); setMoAI(false); }} className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <X className="h-3.5 w-3.5" /> Đóng
          </button>
        </div>
        {/* Thanh tiến độ hai màu: phần xanh = đúng, phần đỏ = sai. */}
        <div className="flex h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}
          role="progressbar" aria-valuemin={0} aria-valuemax={tong} aria-valuenow={soDaLam} aria-label="Tiến độ làm bài">
          <div className="h-full transition-all" style={{ width: `${(soDung / Math.max(1, tong)) * 100}%`, background: 'var(--exam-ok, #22c55e)' }} />
          <div className="h-full transition-all" style={{ width: `${(soSai / Math.max(1, tong)) * 100}%`, background: 'var(--exam-bad, #ef4444)' }} />
        </div>
      </div>

      <div ref={cauRef} className="scroll-mt-24 space-y-3 p-3 sm:p-4">
        {xemKetQua ? (
          <KetQua
            ds={dsCau}
            count={count}
            dangTai={loading}
            onXemCau={(i) => denCau(i)}
            onLamLaiSai={() => batDau((qs || []).filter((q) => trangThai(q) === 'sai'))}
            onLamLai={() => batDau(qs || [])}
            onDoi10={() => void start('random')}
            onLamTatCa={() => void start('all')}
          />
        ) : cau ? (
          <>
            <CauHoi
              key={cau.id}
              q={cau}
              so={idx + 1}
              tong={tong}
              L={L}
              chon={chon[cau.id] || []}
              daCham={daChamCau}
              moAI={moAI}
              onChon={(i) => chonDapAn(cau, i)}
              onKiemTra={() => kiemTra(cau)}
              onBatAI={() => setMoAI((v) => !v)}
              onHoiViSao={() => hoiViSao(cau)}
            />

            {moAI && dsCau[idx] && (
              <HoiAICauLuyen cau={dsCau[idx]} dsCau={dsCau} idx={idx} onChonCau={denCau} onDong={() => setMoAI(false)} />
            )}

            {/* Điều hướng */}
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => denCau(idx - 1)} disabled={idx === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-40"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                <ArrowLeft size={15} /> Câu trước
              </button>
              <span className="hidden items-center gap-1 text-[11px] md:inline-flex" style={{ color: 'var(--text-muted)' }}>
                <Keyboard size={12} /> Phím: A–D chọn · Enter câu tiếp · ←/→
              </span>
              <button type="button" onClick={tiep}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                style={daChamCau
                  ? { background: 'var(--accent-color, #8b5cf6)', color: '#fff' }
                  : { border: '1px solid var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                {cauCuoi
                  ? <>{lamXetHet ? 'Xem kết quả' : 'Kết thúc & xem kết quả'} <Trophy size={15} /></>
                  : daChamCau ? <>Câu tiếp <ArrowRight size={15} /></> : <>Bỏ qua <ArrowRight size={15} /></>}
              </button>
            </div>

            {/* Làm hết mà đang ở giữa bộ (nhảy câu lung tung) → mời xem kết quả. */}
            {lamXetHet && !cauCuoi && (
              <button type="button" onClick={() => { setXemKetQua(true); cuonVeCau(); }}
                className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--exam-ok, #22c55e)' }}>
                Đã làm hết {tong} câu — xem kết quả
              </button>
            )}

            <LuoiCau ds={dsCau} idx={idx} onChon={denCau} />
          </>
        ) : null}

        <PracticeBlock sectionId={sectionId} L={L} />
      </div>
    </div>
  );
}

/**
 * Khối "Quiz & thực hành chương" ở ĐẦU trang quiz của chương.
 *
 * Hỏi `/exams/practice/by-section/:id/summary` — số câu trắc nghiệm và số bài
 * thực hành SAU khi khử trùng, tức đúng số người học nhận được khi bấm vào
 * (`section-counts` đếm thô, gộp cả PE lẫn câu lặp qua nhiều đề). Chương chưa
 * có gì thì ẩn hẳn — một khối "0 câu" ở đầu trang là mời bấm vào chỗ trống.
 */
export function KhoiLuyenChuong({ courseCode, sectionId, sectionTitle }: {
  /** Giữ cho nơi gọi — số câu giờ hỏi theo chương, không theo khoá. */
  courseId?: number;
  courseCode?: string; sectionId: number; sectionTitle?: string;
}) {
  const [tomTat, datTomTat] = useState<{ mcq: number; pe: number } | null>(null);
  useEffect(() => {
    let conSong = true;
    api.get<{ success: boolean; data: { mcq: number; pe: number } }>(`/exams/practice/by-section/${sectionId}/summary`)
      .then((r) => { if (conSong) datTomTat({ mcq: Number(r.data?.data?.mcq ?? 0), pe: Number(r.data?.data?.pe ?? 0) }); })
      .catch(() => { if (conSong) datTomTat({ mcq: 0, pe: 0 }); });
    return () => { conSong = false; };
  }, [sectionId]);

  if (!tomTat || (!tomTat.mcq && !tomTat.pe)) return null;
  return (
    <ChapterQuiz
      key={sectionId}
      variant="top"
      sectionId={sectionId}
      sectionTitle={sectionTitle}
      count={tomTat.mcq}
      soPE={tomTat.pe}
      courseCode={courseCode}
    />
  );
}
