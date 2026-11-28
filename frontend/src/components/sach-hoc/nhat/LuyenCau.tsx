'use client';

/**
 * 🔁 Luyện câu 2 chiều (khối `luyenCau`, khoá Dekiru — 28/11/2026).
 *
 * Người học đã trượt JPD113/JPD123 nhiều lần, tập VIẾT TAY mỗi ngày trên iPad và muốn bấm vào câu để nghe rồi nói theo.
 * Sáu tab trên cùng một bộ câu của bài:
 *   ✍️ Việt → Nhật   đọc câu Việt, viết tay (ô viết ngay dưới câu / vở) hoặc gõ ⇒ xem đáp án (chữ Hán + furigana + romaji),
 *                    gõ thì máy chấm (chamCau.ts: kana / chữ Hán / trộn / romaji, nhận ra lỗi trường âm, katakana, trợ từ).
 *   🔁 Nhật → Việt   nghe / đọc câu Nhật, chọn nghĩa đúng trong 4.
 *   🎧 Nghe – chép   nghe (thường / chậm) rồi gõ lại.
 *   🗣️ Nói theo      nghe mẫu rồi đọc, máy chấm phát âm từng chữ (CauPhatAm — Azure ja-JP).
 *   📚 Từ của bài    từ vựng đúng danh sách của bài (onTheData sinh từ bài) + Hán Việt + hình, chạm là nghe.
 *   📋 Danh sách     xem gọn mọi câu, che Nhật / che Việt để tự kiểm, 🖨️ in ra giấy đặt cạnh iPad.
 * Tiến độ (đúng liên tiếp / sai / XP / chuỗi ngày) lưu localStorage `dekiru-luyencau-v1`, theo NỘI DUNG câu (khoaCau);
 * % câu đã thuộc báo lên trang (report) để tổng quan buổi + đồng bộ tiến độ.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, Lightbulb, Mic, Printer, RotateCcw, Snail, Volume2 } from 'lucide-react';
import { Inline } from '../Blocks';
import { play } from '../audio';
import { anhUrl } from '../HinhSlide';
import { inKhung } from '../inKhung';
import { useTutor } from '../tutorContext';
import { CauPhatAm } from '../PhatAm';
import HandCanvas, { type HandCanvasHandle, type Painter, type Stroke } from '../HandCanvas';
import type { Block, CauLuyen } from '../types';
import { bare, reading } from './chia';
import { chamCau, chuoiNgay, CHU_QUEN, DA_THUOC, ghiLuot, khoaCau, KHO_RONG, ngaySo, tuDien, type Kho, type KetQua } from './chamCau';
import s from '../course.module.css';
import c from './luyencau.module.css';

const O_LUU = 'dekiru-luyencau-v1';
const LUOT = 10;
const MUC_TIEU_NGAY = 20;

type Mode = 'viet' | 'dich' | 'nghe' | 'noi' | 'tu' | 'ds';
const MODES: { k: Mode; icon: string; ten: string; sub: string }[] = [
  { k: 'viet', icon: '✍️', ten: 'Việt → Nhật', sub: 'viết tay / gõ' },
  { k: 'dich', icon: '🔁', ten: 'Nhật → Việt', sub: 'chọn nghĩa' },
  { k: 'nghe', icon: '🎧', ten: 'Nghe – chép', sub: 'chính tả' },
  { k: 'noi', icon: '🗣️', ten: 'Nói theo', sub: 'máy chấm' },
  { k: 'tu', icon: '📚', ten: 'Từ của bài', sub: 'hình · Hán Việt' },
  { k: 'ds', icon: '📋', ten: 'Danh sách', sub: 'xem gọn · in' },
];

type Loc = 'all' | 'chua' | 'sai';
type Do = 0 | 1 | 2 | 3;
/** Độ dài theo số chữ kana của câu: ngắn ≤ 12 · vừa ≤ 22 · dài. */
const doDai = (x: CauLuyen): Do => { const n = [...reading(x.ja).replace(/[\s。、？！?!「」—]/g, '')].length; return n <= 12 ? 1 : n <= 22 ? 2 : 3; };

function docKho(): Kho {
  try { const v = JSON.parse(localStorage.getItem(O_LUU) ?? 'null'); if (v && typeof v === 'object' && v.c) return { ...KHO_RONG(), ...v }; } catch { /* bỏ qua */ }
  return KHO_RONG();
}
const tron = <T,>(a: T[]): T[] => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/** Các "từ cần dùng" của câu: cụm {漢字|かな} + từ katakana — làm ô 💡 gợi ý khi câu không khai `goi`. */
function goiY(x: CauLuyen): string {
  if (x.goi) return x.goi;
  const ds = new Set<string>();
  for (const m of x.ja.matchAll(/\{([^|}]+)\|([^}]+)\}/g)) ds.add(`{${m[1]}|${m[2]}}`);
  for (const m of bare(x.ja).matchAll(/[ァ-ヶー]{2,}/g)) ds.add(m[0]);
  return [...ds].join(' · ') || 'Câu này chỉ dùng hiragana — nghĩ trật tự: chủ đề は → … → động từ / です ở cuối.';
}

/* ── Ô viết tay nhỏ ngay dưới câu (giấy kẻ 2 dòng ô vuông) ───────────────── */
const COT = 14;
const giay: Painter = (ctx, w, h, o) => {
  const q = w / COT;
  ctx.save();
  ctx.strokeStyle = o.exporting ? '#d5dbe5' : o.dark ? '#323741' : '#d6deea';
  ctx.lineWidth = 1;
  for (let y = 0; y <= h + 1; y += q) { ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(w, Math.round(y) + 0.5); ctx.stroke(); }
  for (let k = 0; k <= COT; k++) { const x = Math.round(k * q) + 0.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  ctx.restore();
};
function ONhap({ k }: { k: string }) {
  const ref = useRef<HandCanvasHandle>(null);
  const [st, setSt] = useState<Stroke[]>([]);
  useEffect(() => { setSt([]); }, [k]);
  return (
    <div className={c.pad}>
      <HandCanvas key={k} ref={ref} aspect={3 / COT} strokes={st} onChange={setSt} penWidth={3} designWidth={720} background={giay} ariaLabel="Ô viết tay câu trả lời" />
      <div className={c.padBar} style={{ padding: '6px 8px' }}>
        <span>✍️ Viết câu trả lời bằng bút / ngón tay (không lưu)</span>
        <span className={c.row}>
          <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => ref.current?.undo()}>Hoàn tác</button>
          <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => ref.current?.clear()}>Xoá</button>
        </span>
      </div>
    </div>
  );
}

/* ── Đáp án ─────────────────────────────────────────────────────────────── */
function DapAn({ x, ketQua, go, noi, setNoi, onDiem }: {
  x: CauLuyen; ketQua?: KetQua | null; go?: string; noi: boolean; setNoi: (v: boolean) => void; onDiem: (d: number) => void;
}) {
  return (
    <div className={c.answer}>
      {ketQua && (
        <div className={`${c.res} ${ketQua.kq === 'dung' ? c.resOk : ketQua.kq === 'gan' ? c.resGan : c.resNo}`}>
          {ketQua.kq === 'dung' ? '✅ Đúng rồi!' : ketQua.kq === 'gan' ? '🟡 Gần đúng' : '❌ Chưa đúng'}
          {ketQua.ghi && <span><Inline text={ketQua.ghi} /></span>}
          {ketQua.kq !== 'dung' && go && <span>Bạn gõ: <b className={c.jp}>{go}</b></span>}
        </div>
      )}
      <div className={c.answerLbl}>Đáp án</div>
      <div className={`${c.jaText} ${c.jp}`} lang="ja"><Inline text={x.ja} /></div>
      <div className={c.roText}>{x.ro}</div>
      <div style={{ fontSize: 15 }}>{x.vi}</div>
      {x.alt?.length ? <div className={c.alt}>Cũng đúng: {x.alt.map((a, i) => <span key={i} className={c.jp}>{i ? ' · ' : ''}<Inline text={a} /></span>)}</div> : null}
      <div className={c.row}>
        <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => play({ text: x.ja })}><Volume2 size={15} /> Nghe</button>
        <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => play({ text: x.ja, toc: 0.65 })}><Snail size={15} /> Nghe chậm</button>
        <button type="button" className={`${c.btn} ${c.btnSm} ${noi ? c.btnPri : ''}`} onClick={() => setNoi(!noi)} aria-expanded={noi}><Mic size={15} /> Nói theo</button>
      </div>
      {noi && <CauPhatAm text={x.ja} ro={x.ro} vi={x.vi} onDiem={onDiem} />}
    </div>
  );
}

export default function LuyenCau({ b }: { b: Extract<Block, { t: 'luyenCau' }> }) {
  const { report } = useTutor();
  const [kho, setKho] = useState<Kho>(KHO_RONG);
  const [san, setSan] = useState(false);
  useEffect(() => { setKho(docKho()); setSan(true); }, []);
  const luu = useCallback((k: Kho) => { setKho(k); try { localStorage.setItem(O_LUU, JSON.stringify(k)); } catch { /* đầy bộ nhớ */ } }, []);

  const cau = b.cau;
  const khoa = useMemo(() => cau.map((x) => khoaCau(x.ja)), [cau]);
  const td = useMemo(() => tuDien(cau.flatMap((x) => [x.ja, ...(x.alt ?? [])]), CHU_QUEN), [cau]);
  const npDs = useMemo(() => [...new Set(cau.map((x) => x.np).filter(Boolean))] as string[], [cau]);

  const [mode, setMode] = useState<Mode>('viet');
  const [loc, setLoc] = useState<Loc>('all');
  const [doSel, setDoSel] = useState<Do>(0);
  const [np, setNp] = useState('');
  const [tronCau, setTronCau] = useState(false);
  const [viet, setViet] = useState(true); // hiện ô viết tay dưới câu
  useEffect(() => { try { setViet(localStorage.getItem('dekiru-luyencau-pad') !== '0'); } catch { /* bỏ qua */ } }, []);
  const doiViet = (v: boolean) => { setViet(v); try { localStorage.setItem('dekiru-luyencau-pad', v ? '1' : '0'); } catch { /* bỏ qua */ } };

  const thuoc = (i: number) => (kho.c[khoa[i]]?.[0] ?? 0) >= DA_THUOC;
  const haySai = (i: number) => (kho.c[khoa[i]]?.[1] ?? 0) > 0 && !thuoc(i);
  const soThuoc = san ? khoa.filter((_, i) => thuoc(i)).length : 0;
  const pct = cau.length ? Math.round((soThuoc / cau.length) * 100) : 0;
  // Báo % đã thuộc lên trang (tiến độ đồng bộ) — chỉ khi đổi.
  const daBao = useRef(-1);
  useEffect(() => { if (san && soThuoc > 0 && pct !== daBao.current) { daBao.current = pct; report(b.id, pct); } }, [san, pct, soThuoc, report, b.id]);

  const loc1 = useMemo(() => cau.map((x, i) => i).filter((i) =>
    (!np || cau[i].np === np) && (!doSel || doDai(cau[i]) === doSel)
    && (loc === 'all' || (loc === 'chua' ? !thuoc(i) : haySai(i)))), // eslint-disable-line react-hooks/exhaustive-deps
  [cau, np, doSel, loc, kho, khoa]);

  // Lượt 10 câu: dựng lại khi đổi bộ lọc / chế độ / bấm "Lượt mới".
  const [luot, setLuot] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [kq, setKq] = useState<boolean[]>([]);
  const [lanLuot, setLanLuot] = useState(0);
  const dungLuot = useCallback(() => {
    const ds = tronCau ? tron(loc1) : loc1;
    // Không trộn: bắt đầu từ câu CHƯA thuộc đầu tiên (đi tuần tự ngắn → dài).
    const tu = tronCau ? 0 : Math.max(0, ds.findIndex((i) => !thuoc(i)));
    setLuot([...ds.slice(tu), ...ds.slice(0, tu)].slice(0, LUOT));
    setPos(0); setKq([]);
  }, [loc1, tronCau]); // eslint-disable-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (san) dungLuot(); }, [san, np, doSel, loc, tronCau, mode, lanLuot]);

  const ghi = (i: number, dung: boolean, diem: number) => {
    luu(ghiLuot(kho, khoa[i], dung, diem));
    setKq((k) => { const n = [...k]; n[pos] = dung; return n; });
  };
  const tiep = () => setPos((p) => p + 1);

  const hom = ngaySo();
  const chuoi = chuoiNgay(kho.ngay);
  const homNay = kho.homNay?.[0] === hom ? kho.homNay[1] : 0;

  const cur = luot[pos];
  const xong = luot.length > 0 && pos >= luot.length;

  return (
    <div className={c.root}>
      {b.title && <div className={s.quizTitle}>{b.title}</div>}
      <div className={c.stats} aria-live="polite">
        <div className={`${c.stat} ${c.statWide}`}>
          <small>Đã thuộc (đúng {DA_THUOC} lần liên tiếp)</small>
          <b>{soThuoc}/{cau.length} câu · {pct}%</b>
          <div className={c.bar}><i style={{ width: `${pct}%` }} /></div>
        </div>
        <div className={c.stat}><small>Chuỗi ngày</small><b>🔥 {chuoi}</b></div>
        <div className={c.stat}><small>XP</small><b>⭐ {kho.xp}</b></div>
        <div className={c.stat}><small>Hôm nay</small><b>{homNay >= MUC_TIEU_NGAY ? '🏆' : '🎯'} {homNay}/{MUC_TIEU_NGAY}</b></div>
      </div>

      <div className={c.modes} role="tablist" aria-label="Cách luyện">
        {MODES.map((m) => (
          <button key={m.k} type="button" role="tab" className={c.mode} aria-pressed={mode === m.k} aria-selected={mode === m.k} onClick={() => setMode(m.k)}>
            <span aria-hidden>{m.icon}</span>{m.ten}<small>{m.sub}</small>
          </button>
        ))}
      </div>

      {mode !== 'tu' && (
        <div className={c.filters}>
          <div className={c.fRow}>
            <span className={c.fLbl}>Câu</span>
            {([['all', 'Tất cả'], ['chua', 'Chưa thuộc'], ['sai', 'Hay sai']] as [Loc, string][]).map(([k, t]) => (
              <button key={k} type="button" className={c.chip} aria-pressed={loc === k} onClick={() => setLoc(k)}>{t}</button>
            ))}
            <span className={c.count}>{loc1.length} câu</span>
          </div>
          <div className={c.fRow}>
            <span className={c.fLbl}>Độ dài</span>
            {([[0, 'Mọi câu'], [1, 'Ngắn'], [2, 'Vừa'], [3, 'Dài']] as [Do, string][]).map(([k, t]) => (
              <button key={k} type="button" className={c.chip} aria-pressed={doSel === k} onClick={() => setDoSel(k)}>{t}</button>
            ))}
            {mode !== 'ds' && mode !== 'noi' && (
              <button type="button" className={c.chip} aria-pressed={tronCau} onClick={() => setTronCau((x) => !x)}>🔀 Trộn</button>
            )}
          </div>
          {npDs.length > 1 && (
            <div className={c.fRow}>
              <span className={c.fLbl}>Mẫu câu</span>
              <select className={c.select} value={np} onChange={(e) => setNp(e.target.value)} aria-label="Lọc theo mẫu câu">
                <option value="">Mọi mẫu câu của bài</option>
                {npDs.map((x) => <option key={x} value={x}>{x.replace(/\{([^|}]+)\|[^}]+\}/g, '$1')}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {mode === 'tu' ? <TuCuaBai bai={b.bai} />
        : mode === 'ds' ? <DanhSach cau={cau} chon={loc1} thuoc={thuoc} title={`Bài ${b.bai} — luyện câu 2 chiều`} />
        : mode === 'noi' ? <NoiTheo cau={cau} chon={loc1} onDiem={(i, d) => { if (d >= 80) luu(ghiLuot(kho, khoa[i], true, 5)); }} />
        : !luot.length ? (
          <div className={c.empty}>{loc === 'all' ? 'Không có câu nào khớp bộ lọc.' : loc === 'chua' ? '🎉 Bạn đã thuộc hết các câu này! Chọn "Tất cả" để ôn lại.' : 'Chưa có câu nào hay sai — tốt lắm!'}</div>
        ) : xong ? (
          <div className={`${c.card} ${c.done}`}>
            <div className={c.score}>{kq.filter(Boolean).length}/{luot.length}</div>
            <div>{kq.filter(Boolean).length === luot.length ? '🎉 Trọn điểm lượt này!' : 'Câu sai sẽ được hỏi lại ở lượt sau (chọn "Hay sai").'}</div>
            <div className={c.row}>
              <button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => setLanLuot((x) => x + 1)}><RotateCcw size={15} /> Lượt mới</button>
              {kq.some((x) => !x) && <button type="button" className={c.btn} onClick={() => { setLoc('sai'); setLanLuot((x) => x + 1); }}>Ôn câu sai</button>}
            </div>
          </div>
        ) : (
          <Card
            key={`${mode}-${cur}-${pos}-${lanLuot}`}
            mode={mode}
            x={cau[cur]}
            i={cur}
            pos={pos}
            tong={luot.length}
            kq={kq}
            td={td}
            cau={cau}
            viet={viet}
            doiViet={doiViet}
            ghi={ghi}
            tiep={tiep}
          />
        )}
    </div>
  );
}

/* ── Một thẻ câu (Việt→Nhật / Nhật→Việt / Nghe–chép) ───────────────────── */
function Card({ mode, x, i, pos, tong, kq, td, cau, viet, doiViet, ghi, tiep }: {
  mode: Mode; x: CauLuyen; i: number; pos: number; tong: number; kq: boolean[]; td: Map<string, string[]>; cau: CauLuyen[];
  viet: boolean; doiViet: (v: boolean) => void; ghi: (i: number, dung: boolean, diem: number) => void; tiep: () => void;
}) {
  const [go, setGo] = useState('');
  const [mo, setMo] = useState(false);
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [daGhi, setDaGhi] = useState(false);
  const [hint, setHint] = useState(false);
  const [noi, setNoi] = useState(false);
  const [chon, setChon] = useState<number | null>(null);
  const [anChu, setAnChu] = useState(false);
  const inp = useRef<HTMLInputElement>(null);

  // Nghe – chép: tự đọc câu khi mở thẻ.
  useEffect(() => { if (mode === 'nghe') play({ text: x.ja }); }, [mode, x.ja]);
  useEffect(() => { if (mode === 'nghe' || (mode === 'viet' && !viet)) inp.current?.focus({ preventScroll: true }); }, [mode, viet]);

  const kiem = () => {
    if (!go.trim()) return;
    const r = chamCau(go, x.ja, x.alt, td);
    setKetQua(r); setMo(true);
    if (!daGhi) { ghi(i, r.kq === 'dung', 10); setDaGhi(true); }
  };
  const tuCham = (dung: boolean) => { if (!daGhi) { ghi(i, dung, 10); setDaGhi(true); } tiep(); };

  // Nhật → Việt: 3 nghĩa nhiễu, ưu tiên câu cùng mẫu câu (khó đoán hơn).
  const opts = useMemo(() => {
    if (mode !== 'dich') return [];
    const cung = cau.filter((y) => y !== x && y.vi !== x.vi && y.np === x.np);
    const khac = cau.filter((y) => y !== x && y.vi !== x.vi && y.np !== x.np);
    const nhieu = [...tron(cung), ...tron(khac)].slice(0, 3).map((y) => y.vi);
    return tron([x.vi, ...nhieu]);
  }, [mode, x, cau]);

  const head = (
    <div className={c.cardHead}>
      <span>Câu {pos + 1}/{tong}{x.np ? <> · <span className={c.tag}><Inline text={x.np} /></span></> : null}</span>
      <span className={c.dots} aria-hidden>{Array.from({ length: tong }, (_, k) => <i key={k} data-k={k === pos ? 'cur' : kq[k] === true ? 'ok' : kq[k] === false ? 'no' : ''} />)}</span>
    </div>
  );

  if (mode === 'dich') {
    const daChon = chon !== null;
    return (
      <div className={c.card}>
        {head}
        <div className={c.row}>
          <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => play({ text: x.ja })}><Volume2 size={15} /> Nghe</button>
          <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => play({ text: x.ja, toc: 0.65 })}><Snail size={15} /> Chậm</button>
          <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => setAnChu((v) => !v)} aria-pressed={anChu}>{anChu ? <Eye size={15} /> : <EyeOff size={15} />} {anChu ? 'Hiện chữ' : 'Chỉ nghe'}</button>
        </div>
        <div className={`${c.jaText} ${c.jp} ${anChu && !daChon ? c.che : ''}`} lang="ja"><Inline text={x.ja} /></div>
        {daChon && <div className={c.roText}>{x.ro}</div>}
        <div className={c.opts}>
          {opts.map((o, k) => (
            <button
              key={k}
              type="button"
              disabled={daChon}
              className={`${c.opt} ${daChon && o === x.vi ? c.optOk : ''} ${daChon && k === chon && o !== x.vi ? c.optNo : ''}`}
              onClick={() => { setChon(k); ghi(i, o === x.vi, 5); }}
            >{o}</button>
          ))}
        </div>
        {daChon && <button type="button" className={`${c.btn} ${c.btnPri}`} onClick={tiep}>Câu tiếp →</button>}
      </div>
    );
  }

  const laNghe = mode === 'nghe';
  return (
    <div className={c.card}>
      {head}
      {laNghe ? (
        <div className={c.row}>
          <button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => play({ text: x.ja })}><Volume2 size={16} /> Nghe lại</button>
          <button type="button" className={c.btn} onClick={() => play({ text: x.ja, toc: 0.65 })}><Snail size={16} /> Nghe chậm</button>
          <span className={s.quizSub}>Gõ đúng câu vừa nghe (kana hoặc chữ Hán).</span>
        </div>
      ) : (
        <>
          <div className={c.viText}>{x.vi}</div>
          <div className={c.row}>
            <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => setHint((v) => !v)} aria-expanded={hint}><Lightbulb size={15} /> Gợi ý từ</button>
            <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => doiViet(!viet)} aria-pressed={viet}>✍️ {viet ? 'Ẩn ô viết tay' : 'Viết tay trên màn hình'}</button>
          </div>
          {hint && <div className={c.hint}><Inline text={goiY(x)} /></div>}
          {viet && <ONhap k={`${i}`} />}
        </>
      )}
      <input
        ref={inp}
        className={`${c.input} ${c.jp}`}
        lang="ja"
        value={go}
        onChange={(e) => setGo(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); if (!mo) kiem(); else tiep(); } }}
        placeholder={laNghe ? 'Gõ câu vừa nghe…' : 'Gõ tiếng Nhật (kana / chữ Hán / romaji) — hoặc viết tay rồi bấm Xem đáp án'}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        disabled={mo && !!ketQua}
        aria-label="Câu trả lời"
      />
      {!mo ? (
        <div className={c.row}>
          <button type="button" className={`${c.btn} ${c.btnGrow} ${go.trim() ? c.btnPri : ''}`} onClick={kiem} disabled={!go.trim()}>Kiểm tra</button>
          <button type="button" className={`${c.btn} ${c.btnGrow} ${go.trim() ? '' : c.btnPri}`} onClick={() => setMo(true)}>{laNghe ? 'Không nghe ra — xem đáp án' : 'Xem đáp án'}</button>
        </div>
      ) : (
        <>
          <DapAn x={x} ketQua={ketQua} go={go} noi={noi} setNoi={setNoi} onDiem={(d) => { if (d >= 80 && !daGhi) { ghi(i, true, 5); setDaGhi(true); } }} />
          {ketQua || daGhi ? (
            <button type="button" className={`${c.btn} ${c.btnPri}`} onClick={tiep}>Câu tiếp →</button>
          ) : laNghe ? (
            <button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => tuCham(false)}>Câu tiếp →</button>
          ) : (
            <div className={c.row}>
              <span className={s.quizSub} style={{ width: '100%' }}>So bài viết tay của bạn với đáp án (trợ từ, động từ cuối câu, chữ Hán, trường âm):</span>
              <button type="button" className={`${c.btn} ${c.btnGrow} ${c.btnOk}`} onClick={() => tuCham(true)}>✅ Mình viết đúng</button>
              <button type="button" className={`${c.btn} ${c.btnGrow} ${c.btnNo}`} onClick={() => tuCham(false)}>❌ Chưa đúng</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Nói theo ──────────────────────────────────────────────────────────── */
function NoiTheo({ cau, chon, onDiem }: { cau: CauLuyen[]; chon: number[]; onDiem: (i: number, d: number) => void }) {
  const [trang, setTrang] = useState(0);
  const per = 8;
  const so = Math.max(1, Math.ceil(chon.length / per));
  const ds = chon.slice(trang * per, trang * per + per);
  useEffect(() => { setTrang(0); }, [chon.length]);
  if (!chon.length) return <div className={c.empty}>Không có câu nào khớp bộ lọc.</div>;
  return (
    <div className={c.card}>
      <div className={s.quizSub}>Bấm <b>Nghe mẫu</b> (hoặc 🐢 chậm), rồi <b>Đọc &amp; chấm</b> và đọc to câu. Máy tô màu từng chữ: xanh đúng, vàng gần đúng, đỏ cần sửa. Câu đạt ≥ 80 điểm được +5 XP.</div>
      {ds.map((i) => (
        <div key={i} className={c.noiItem}>
          <div className={c.row} style={{ justifyContent: 'space-between' }}>
            <span className={c.noiVi}>{i + 1}. {cau[i].vi}</span>
            <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => play({ text: cau[i].ja, toc: 0.65 })} aria-label="Nghe chậm"><Snail size={15} /></button>
          </div>
          <CauPhatAm text={cau[i].ja} ro={cau[i].ro} onDiem={(d) => onDiem(i, d)} />
        </div>
      ))}
      {so > 1 && (
        <div className={c.row} style={{ justifyContent: 'center' }}>
          <button type="button" className={`${c.btn} ${c.btnSm}`} disabled={trang === 0} onClick={() => setTrang((t) => t - 1)}>← Trước</button>
          <span className={c.count}>Trang {trang + 1}/{so}</span>
          <button type="button" className={`${c.btn} ${c.btnSm}`} disabled={trang >= so - 1} onClick={() => setTrang((t) => t + 1)}>Sau →</button>
        </div>
      )}
    </div>
  );
}

/* ── Danh sách · in ───────────────────────────────────────────────────── */
function DanhSach({ cau, chon, thuoc, title }: { cau: CauLuyen[]; chon: number[]; thuoc: (i: number) => boolean; title: string }) {
  const [cheJa, setCheJa] = useState(false);
  const [cheVi, setCheVi] = useState(false);
  const [moRieng, setMoRieng] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const inDs = () => {
    if (!ref.current) return;
    const g = ref.current.closest(`.${s.root}`) as HTMLElement | null;
    inKhung(ref.current, { lop: g?.className ?? '', tieuDe: title });
  };
  const lat = (i: number) => setMoRieng((m) => { const n = new Set(m); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <div className={c.card}>
      <div className={c.row}>
        <button type="button" className={`${c.btn} ${c.btnSm}`} aria-pressed={cheJa} onClick={() => { setCheJa((v) => !v); setCheVi(false); setMoRieng(new Set()); }}>{cheJa ? <Eye size={15} /> : <EyeOff size={15} />} Che tiếng Nhật</button>
        <button type="button" className={`${c.btn} ${c.btnSm}`} aria-pressed={cheVi} onClick={() => { setCheVi((v) => !v); setCheJa(false); setMoRieng(new Set()); }}>{cheVi ? <Eye size={15} /> : <EyeOff size={15} />} Che tiếng Việt</button>
        <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => play(chon.map((i) => ({ text: cau[i].ja })), undefined, { gapMs: 900 })}><Volume2 size={15} /> Nghe cả danh sách</button>
        <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={inDs}><Printer size={15} /> In</button>
      </div>
      <div className={s.quizSub}>Đang che: chạm vào ô bị che để lật xem từng câu. Chạm vào câu Nhật để nghe.</div>
      <div ref={ref}>
        <div className={c.inTieuDe}><b>{title}</b> — {chon.length} câu</div>
        <table className={c.ds}>
          <thead><tr><th>#</th><th>Tiếng Việt</th><th>Tiếng Nhật</th></tr></thead>
          <tbody>
            {chon.map((i) => {
              const lo = moRieng.has(i);
              return (
                <tr key={i}>
                  <td>{i + 1}{thuoc(i) ? <span className={c.thuoc} title="Đã thuộc"> ✓</span> : null}</td>
                  <td className={cheVi && !lo ? c.che : ''} onClick={() => cheVi && lat(i)}>{cau[i].vi}</td>
                  <td className={cheJa && !lo ? c.che : ''} onClick={() => (cheJa && !lo ? lat(i) : play({ text: cau[i].ja }))}>
                    <span className={`${c.dsJa} ${c.jp}`} lang="ja"><Inline text={cau[i].ja} /></span>
                    <span className={c.dsRo}>{cau[i].ro}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Từ của bài (dữ liệu sinh onTheData + hình + Hán Việt) ───────────────── */
type Tu = { w: string; ro: string; vi: string; nhom: string; hv: string; anh?: string };
const khoaTu = (w: string) => bare(w).replace(/［[^］]*］/g, '').replace(/\s*\d+\s*$/, '').replace(/（[^）]*）|\([^)]*\)/g, '').replace(/[～〜]/g, '').trim();

function TuCuaBai({ bai }: { bai: number }) {
  const [tu, setTu] = useState<Tu[] | null>(null);
  const [che, setChe] = useState<'' | 'vi' | 'ja'>('');
  const [loi, setLoi] = useState(false);
  useEffect(() => {
    let song = true;
    Promise.all([import('@/app/language/[code]/dekiru/bai/onTheData'), import('@/app/language/[code]/dekiru/bai/luyenCauAnh')]).then(([d, a]) => {
      if (!song) return;
      const hv = new Map(d.HAN.map((h) => [h[0], h[2]] as const));
      const anh = new Map(a.ANH_TU.map((x) => [khoaTu(x.w), x.anh] as const));
      const ds: Tu[] = d.TU.filter((t) => t[0] === bai).map(([, g, w, , ipa, vi]) => {
        const chu = [...bare(w)].filter((ch) => /[一-鿿]/.test(ch));
        const h = chu.map((ch) => hv.get(ch)).filter(Boolean);
        return { w, ro: ipa, vi, nhom: d.NHOM[bai]?.[g] ?? '', hv: h.length === chu.length ? h.join(' ') : '', anh: anh.get(khoaTu(w)) };
      });
      setTu(ds);
    }, () => song && setLoi(true));
    return () => { song = false; };
  }, [bai]);
  if (loi) return <div className={c.empty}>Không tải được từ vựng — kiểm tra mạng rồi mở lại tab.</div>;
  if (!tu) return <div className={s.soonBox} aria-busy="true">Đang tải từ vựng Bài {bai}…</div>;
  const nhom: [string, Tu[]][] = [];
  for (const t of tu) { const l = nhom[nhom.length - 1]; if (l && l[0] === t.nhom) l[1].push(t); else nhom.push([t.nhom, [t]]); }
  return (
    <div className={c.card}>
      <div className={c.row}>
        <span className={s.quizSub} style={{ flex: 1 }}>{tu.length} từ — đúng danh sách từ của Bài {bai}. Chạm thẻ để nghe; chữ Hán trên thẻ chạm vào để xem nét viết.</span>
        <button type="button" className={`${c.btn} ${c.btnSm}`} aria-pressed={che === 'vi'} onClick={() => setChe(che === 'vi' ? '' : 'vi')}>Che nghĩa</button>
        <button type="button" className={`${c.btn} ${c.btnSm}`} aria-pressed={che === 'ja'} onClick={() => setChe(che === 'ja' ? '' : 'ja')}>Che từ</button>
      </div>
      {nhom.map(([ten, ds]) => (
        <div key={ten}>
          {ten && <div className={c.nhomTen}>{ten}</div>}
          <div className={c.tuGrid}>
            {ds.map((t, k) => (
              <div key={k} role="button" tabIndex={0} className={c.tu} onClick={() => play({ text: reading(t.w).replace(/［[^］]*］|[（）()〜～]/g, '') })} onKeyDown={(e) => { if (e.key === 'Enter') play({ text: reading(t.w) }); }}>
                {t.anh && che !== 'vi' && (
                  // eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh nhỏ trên CDN
                  <img src={anhUrl(t.anh)} alt="" className={c.tuAnh} loading="lazy" decoding="async" draggable={false} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                )}
                <span className={`${c.tuW} ${c.jp} ${che === 'ja' ? c.che : ''}`} lang="ja"><Inline text={t.w} /></span>
                <span className={`${c.tuRo} ${che === 'ja' ? c.che : ''}`}>{t.ro}</span>
                {t.hv && <span className={`${c.tuHv} ${che === 'ja' ? c.che : ''}`}>{t.hv}</span>}
                <span className={`${c.tuVi} ${che === 'vi' ? c.che : ''}`}><Inline text={t.vi} /></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
