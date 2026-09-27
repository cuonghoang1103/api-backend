'use client';

/**
 * Viết bài IELTS BẰNG TAY trên giấy kẻ dòng (chế độ ✍️ của khối essay).
 *
 * Giấy chia TRANG (1–4) thay vì một canvas cuộn dài: canvas cuộn bên trong
 * tranh chấp với cuộn trang và với bút, còn trang cố định thì bút chỉ việc
 * viết. Chấm bài: mỗi trang xuất JPEG nền trắng ≤ 1600px → backend chép lại
 * NGUYÊN VĂN (giữ cả lỗi) rồi chấm theo đúng bộ 4 tiêu chí của bài gõ phím.
 */
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import HandCanvas, { InkTools, b64, loadInk, renderInk, useInkSaver, type HandCanvasHandle, type InkColor, type Painter, type Stroke, type Tool } from './HandCanvas';
import { useCourse } from './tutorContext';
import s from './course.module.css';
import { AI_TIMEOUT } from './audio';

const ASPECT = 1.36;
const MAX_PAGES = 4;
/** Khoảng dòng = rộng / 20 → iPad dọc ~37px một dòng, vừa cỡ chữ viết tay. */
const LINES = 20;

const paper: Painter = (ctx, w, h, o) => {
  const gap = w / LINES;
  const top = gap * 1.6;
  ctx.save();
  ctx.strokeStyle = o.exporting ? '#d5dbe5' : o.dark ? '#2f343c' : '#d9e2ef';
  ctx.lineWidth = 1;
  for (let y = top; y < h - gap * 0.4; y += gap) {
    ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(w, Math.round(y) + 0.5); ctx.stroke();
  }
  // Lề đỏ bên trái như giấy thi.
  ctx.strokeStyle = o.exporting ? '#f3b4b4' : o.dark ? 'rgba(248,113,113,0.35)' : 'rgba(220,38,38,0.35)';
  const mx = Math.round(w * 0.075) + 0.5;
  ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, h); ctx.stroke();
  ctx.restore();
};

type Saved = { v: 1; pages: Stroke[][] };

export default function HandEssay({ id, de, task }: { id: string; de: string; task: string }) {
  const course = useCourse();
  const key = `${course?.storageKey ?? 'sach'}:ink:${id}`;
  const save = useInkSaver(key);
  const [pages, setPages] = useState<Stroke[][]>([[]]);
  const [pg, setPg] = useState(0);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<InkColor>('k');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ chep: string; ketQua: string | null } | null>(null);
  const [err, setErr] = useState('');
  const ref = useRef<HandCanvasHandle>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = loadInk<Saved>(key);
    if (v?.v === 1 && Array.isArray(v.pages) && v.pages.length) setPages(v.pages.slice(0, MAX_PAGES));
  }, [key]);

  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const setPage = (i: number, st: Stroke[]) => {
    const next = pagesRef.current.map((p, j) => (j === i ? st : p));
    pagesRef.current = next;
    setPages(next);
    save(next.some((p) => p.length) || next.length > 1 ? { v: 1, pages: next } : null);
  };

  const go = (i: number) => {
    setPg(i);
    // Chuyển trang thì đưa đầu tờ giấy vào tầm nhìn.
    requestAnimationFrame(() => top.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  };

  const addPage = () => {
    if (pages.length >= MAX_PAGES) return;
    const next = [...pagesRef.current, []];
    pagesRef.current = next;
    setPages(next);
    save({ v: 1, pages: next });
    go(next.length - 1);
  };

  const removeEmptyPage = () => {
    if (pages.length <= 1 || pages[pg].length) return;
    const next = pagesRef.current.filter((_, j) => j !== pg);
    pagesRef.current = next;
    setPages(next);
    save({ v: 1, pages: next });
    setPg(Math.max(0, pg - 1));
  };

  const filled = pages.filter((p) => p.length);

  const grade = async () => {
    setBusy(true); setErr(''); setOut(null);
    try {
      // 1600px, JPEG 0.85 — một trang chữ viết ~150–400KB, đủ nét cho model đọc.
      const imgs = filled.map((p) => b64(renderInk(p, 1600, ASPECT, paper).toDataURL('image/jpeg', 0.85)));
      const r = await api.post('/ielts/ai/cham-viet-tay', { pages: imgs, de, task }, AI_TIMEOUT);
      const d = r.data?.data as { chep?: string; ketQua: string | null; lyDo?: string };
      if (d?.chep || d?.ketQua) setOut({ chep: d.chep ?? '', ketQua: d.ketQua });
      if (!d?.ketQua) {
        setErr(d?.lyDo === 'ai_unavailable' ? 'AI chấm bài đang tạm tắt.'
          : d?.lyDo === 'qua_ngan' ? 'AI đọc được quá ít chữ để chấm (cần ≥ 20 từ). Xem bản chép bên dưới.'
            : 'Chưa chấm được, thử lại nhé.');
      }
    } catch (e) {
      const m = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
      setErr(m?.status === 401 ? 'Đăng nhập để AI chấm bài.' : m?.status === 413 ? 'Ảnh quá lớn — bớt trang rồi thử lại.' : m?.data?.message || 'Không kết nối được máy chấm.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.hPaperBox} ref={top}>
      <InkTools
        tool={tool} setTool={setTool} color={color} setColor={setColor}
        onUndo={() => ref.current?.undo()}
        onClear={() => { if (pages[pg].length && confirm(`Xoá hết trang ${pg + 1}?`)) ref.current?.clear(); }}
        clearLabel="Xoá trang"
      />
      <div className={s.hTabs} role="tablist" aria-label="Trang giấy">
        {pages.map((p, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === pg} className={`${s.wChip} ${i === pg ? s.wChipOn : ''}`} onClick={() => go(i)}>
            Trang {i + 1}{p.length ? '' : ' (trống)'}
          </button>
        ))}
        {pages.length < MAX_PAGES && (
          <button type="button" className={s.wChip} onClick={addPage}><Plus size={13} className="inline" /> Thêm trang</button>
        )}
        {pages.length > 1 && !pages[pg].length && (
          <button type="button" className={s.linkBtn} onClick={removeEmptyPage}>Bỏ trang trống này</button>
        )}
      </div>
      <div className={s.hPaper}>
        <HandCanvas
          key={pg}
          ref={ref}
          aspect={ASPECT}
          strokes={pages[pg]}
          onChange={(st) => setPage(pg, st)}
          tool={tool}
          color={color}
          penWidth={2.6}
          designWidth={800}
          background={paper}
          ariaLabel={`Giấy viết tay, trang ${pg + 1}`}
        />
      </div>
      <div className={s.quizFoot}>
        <span className={s.muted} style={{ fontSize: 13.5 }}>
          Trang {pg + 1}/{pages.length} · tối đa {MAX_PAGES} trang · bài tự lưu trên máy này
        </span>
        <button type="button" className={s.btn} disabled={busy || !filled.length} onClick={grade}>
          <Sparkles size={15} /> {busy ? 'AI đang đọc và chấm…' : 'Chấm bài viết tay'}
        </button>
      </div>
      {err && <div className={`${s.feedback} ${s.bad}`}>{err}</div>}
      {out?.chep && (
        <details className={s.hChep}>
          <summary><ChevronDown size={14} className="inline" /> AI đọc được bài của bạn thế này (bấm để xem)</summary>
          <pre>{out.chep}</pre>
        </details>
      )}
      {out?.ketQua && <div className={`${s.turnA} ${s.essayResult}`}><ChatMarkdown content={out.ketQua} renderMath={false} /></div>}
    </div>
  );
}
