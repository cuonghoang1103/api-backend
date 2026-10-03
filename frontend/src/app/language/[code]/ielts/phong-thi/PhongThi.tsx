'use client';

/**
 * 🎯 PHÒNG THI THỬ IELTS (web) — /language/en/ielts/phong-thi
 * ─────────────────────────────────────────────────────────────────────────
 * Đề dựng ở máy chủ (`GET /ielts/de-thi/:chang`, deThi.service.ts) từ kho bài
 * luyện 4 chặng: Nghe 4 phần/30 phút → Đọc 3 bài/60 phút → Viết Task 1 + 2/60 phút.
 * Trước 03/10/2026 chỉ app iOS mở được phòng thi; web có API mà không có trang.
 *
 * Luật giữ nguyên như bản iOS (xem commit 6c9a9d89):
 *  - Đồng hồ KHÔNG tạm dừng; hết giờ TỰ sang phần sau. Phòng thi cho dừng
 *    lại tra từ thì band trả về không nói lên điều gì.
 *  - Mỗi bài nghe chỉ phát MỘT lần (như thi thật) — trừ khi chọn "chế độ luyện"
 *    lúc bắt đầu; khi đó kết quả ghi rõ là chế độ luyện.
 *  - Band là ƯỚC LƯỢNG; câu `canhBao` của máy chủ hiện ở đầu và cuối đề.
 *
 * Tải lại trang giữa chừng không mất bài: trạng thái (kể cả giờ kết thúc
 * từng phần) nằm trong sessionStorage.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Play, Square, Sparkles, Check, X, RotateCcw } from 'lucide-react';
import api from '@/lib/api';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import { play, stopAudio, skipClip, AI_TIMEOUT, type Voice, type Clip } from '@/components/sach-hoc/audio';
import { dungLoiDan } from '@/components/sach-hoc/nghe';
import { DemDocCau } from '@/components/sach-hoc/DemDocCau';
import { useLangUser } from '@/components/language/primitives';
import FigureView from '@/app/tech-trends/ielts/FigureView';
import { isCorrect } from '@/app/tech-trends/ielts/check';
import type { Figure } from '@/app/tech-trends/ielts/data/types';
import { BAND_STAGES } from '@/app/tech-trends/ielts/data/roadmap';
import cs from '@/components/sach-hoc/course.module.css';
import s from './thi.module.css';

/* ── Hình dạng dữ liệu máy chủ trả về (payload kho nội dung) ─────────── */
type Cau = { q: string; answer: string; alt?: string[]; why?: string; whyNot?: string; options?: string[]; kind?: string };
type BaiNghe = { id: string; title: string; titleVi?: string; context?: string; level?: string; lines: { who?: string; text: string }[]; questions: Cau[] };
type BaiDoc = { id: string; title: string; titleVi?: string; level?: string; paragraphs: { label?: string; text: string }[]; questions: Cau[] };
type DeViet = { id: string; task: string; title: string; prompt: string; promptVi?: string; minWords?: number; minutes?: number; figure?: Figure; sample?: { band?: string; note?: string; text: string } };
type De = {
  chang: string; hat: number; canhBao: string;
  phan: { nghe: { phut: number; bai: BaiNghe[]; soCau: number }; doc: { phut: number; bai: BaiDoc[]; soCau: number }; viet: { phut: number; de: DeViet[] } };
};
type Phase = 'nghe' | 'doc' | 'viet' | 'ketqua';
type Luot = { de: De; phase: Phase; endAt: number; ans: Record<string, string>; viet: Record<string, string>; luyen: boolean; daPhat: Record<string, boolean>; band?: KetQuaBand };
type KetQuaBand = { bandDoc: number | null; bandNghe: number | null; bandTong: number | null };

const KEY = 'ielts-phong-thi:luot';
const THU_TU: Phase[] = ['nghe', 'doc', 'viet', 'ketqua'];
const TEN: Record<Phase, string> = { nghe: 'Listening', doc: 'Reading', viet: 'Writing', ketqua: 'Kết quả' };
const GIONG: Voice[] = ['uk-nu', 'uk-nam', 'us-nu', 'us-nam'];

const phutCua = (de: De, p: Phase) => (p === 'nghe' ? de.phan.nghe.phut : p === 'doc' ? de.phan.doc.phut : p === 'viet' ? de.phan.viet.phut : 0);
const demTu = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);
const loiMang = (e: unknown) => (e as { response?: { status?: number; data?: { message?: string } } })?.response;

function docLuot(): Luot | null {
  try { const r = sessionStorage.getItem(KEY); return r ? (JSON.parse(r) as Luot) : null; } catch { return null; }
}
function ghiLuot(l: Luot | null) {
  try { if (l) sessionStorage.setItem(KEY, JSON.stringify(l)); else sessionStorage.removeItem(KEY); } catch { /* bỏ qua */ }
}

/** Chấm tại chỗ: đếm đúng mỗi phần. */
function cham(de: De, ans: Record<string, string>) {
  let dungNghe = 0, dungDoc = 0;
  de.phan.nghe.bai.forEach((b, bi) => b.questions.forEach((c, ci) => { if (isCorrect(ans[`n${bi}-${ci}`] ?? '', c.answer, c.alt)) dungNghe++; }));
  de.phan.doc.bai.forEach((b, bi) => b.questions.forEach((c, ci) => { if (isCorrect(ans[`d${bi}-${ci}`] ?? '', c.answer, c.alt)) dungDoc++; }));
  return { dungNghe, cauNghe: de.phan.nghe.soCau, dungDoc, cauDoc: de.phan.doc.soCau };
}

/* ── Đồng hồ ─────────────────────────────────────────────────────────── */
function DongHo({ endAt, onHet }: { endAt: number; onHet: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const het = useRef(onHet);
  het.current = onHet;
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const con = Math.max(0, Math.round((endAt - now) / 1000));
  useEffect(() => { if (con === 0) het.current(); }, [con]);
  const mm = String(Math.floor(con / 60)).padStart(2, '0');
  const ss = String(con % 60).padStart(2, '0');
  return (
    <span className={`${s.clock} ${con <= 300 ? s.clockLow : ''}`} role="timer" aria-label={`Còn ${mm} phút ${ss} giây`}>
      <Clock size={15} /> {mm}:{ss}
    </span>
  );
}

/* ── Một câu hỏi ─────────────────────────────────────────────────────── */
function CauHoi({ k, n, c, v, set, xem }: { k: string; n: number; c: Cau; v: string; set: (k: string, v: string) => void; xem: boolean }) {
  const dung = xem && isCorrect(v, c.answer, c.alt);
  return (
    <div className={`${s.q} ${xem ? (dung ? s.qGood : s.qBad) : ''}`}>
      <div className={s.qText}><b className={s.qNum}>{n}</b> {c.q}</div>
      {c.options?.length ? (
        <div className={s.opts} role="radiogroup" aria-label={`Câu ${n}`}>
          {c.options.map((o) => (
            <label key={o} className={`${s.opt} ${v === o ? s.optOn : ''}`}>
              <input type="radio" name={k} checked={v === o} disabled={xem} onChange={() => set(k, o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      ) : (
        <input className={s.gap} value={v} disabled={xem} onChange={(e) => set(k, e.target.value)} placeholder="Câu trả lời…" autoComplete="off" spellCheck={false} />
      )}
      {xem && (
        <div className={s.why}>
          {dung ? <span className={s.good}><Check size={14} className="inline" /> Đúng</span>
            : <span className={s.bad}><X size={14} className="inline" /> {v ? <>Bạn chọn: <s>{v}</s> · </> : 'Bỏ trống · '}Đáp án: <b>{c.answer}</b></span>}
          {c.why && <div>{c.why}</div>}
          {!dung && c.whyNot && <div className={s.muted}>{c.whyNot}</div>}
        </div>
      )}
    </div>
  );
}

/* ── Phần Nghe ───────────────────────────────────────────────────────── */
function PhanNghe({ l, set, xem, onPhat }: { l: Luot; set: (k: string, v: string) => void; xem: boolean; onPhat: (id: string) => void }) {
  const [dangPhat, setDangPhat] = useState<string | null>(null);
  /** Đang ở lời dẫn (đầu/cuối) của Part nào — để hiện nút bỏ qua ở chế độ luyện. */
  const [loiDan, setLoiDan] = useState<string | null>(null);
  const [cho, setCho] = useState<number | null>(null);
  useEffect(() => () => stopAudio(), []);
  let so = 0;
  return (
    <>
      {l.de.phan.nghe.bai.map((b, bi) => {
        const nguoi: string[] = [];
        b.lines.forEach((x) => { const w = x.who ?? ''; if (!nguoi.includes(w)) nguoi.push(w); });
        // Thi thật: mỗi bài phát MỘT lần, đang phát cũng không dừng/không phát lại.
        // Chế độ luyện / xem lại: bấm lại = phát lại từ đầu, dừng có nút riêng.
        const khoa = !xem && !l.luyen && (l.daPhat[b.id] || dangPhat === b.id);
        const phat = () => {
          // Lời dẫn kiểu băng đề thật: Part N, câu tính dồn từ các Part trước.
          const tu = l.de.phan.nghe.bai.slice(0, bi).reduce((n, x) => n + x.questions.length, 0) + 1;
          const { mo, ket } = dungLoiDan({
            so: `Part ${bi + 1}`,
            tieuDe: b.title,
            cau: [tu, tu + b.questions.length - 1],
            chao: bi === 0 ? 'Welcome to the Cuong Thai English IELTS practice test. This is the Listening section.' : null,
            docGiay: 30, // phòng thi: đúng thời gian đọc câu hỏi của đề thật
          });
          const bai = b.lines.map((x) => ({ text: x.text, voice: GIONG[nguoi.indexOf(x.who ?? '') % GIONG.length] }));
          const all: Clip[] = [...mo, ...bai, ...ket];
          play(all, () => { setDangPhat((c) => (c === b.id ? null : c)); setLoiDan(null); setCho(null); }, {
            onClip: (i) => { setLoiDan(i < mo.length || i >= mo.length + bai.length ? b.id : null); setCho(all[i].pauseMs ? Date.now() + all[i].pauseMs! : null); },
          });
          setDangPhat(b.id);
          setLoiDan(b.id);
          onPhat(b.id);
        };
        return (
          <section key={b.id} className={s.part}>
            <div className={s.partHead}>
              <div className="min-w-0">
                <div className={s.partNo}>Part {bi + 1}{b.level ? ` · ${b.level}` : ''}</div>
                <div className={s.partTitle}>{b.title}{b.titleVi ? <span className={s.muted}> — {b.titleVi}</span> : null}</div>
                {b.context && <div className={s.muted}>{b.context}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {dangPhat === b.id && (xem || l.luyen) && (
                  <button type="button" className={s.ghost} onClick={() => stopAudio()} aria-label="Dừng"><Square size={14} /></button>
                )}
                <button type="button" className={s.playBtn} onClick={phat} disabled={khoa} aria-label={dangPhat === b.id ? 'Phát lại từ đầu' : 'Phát bài nghe'}>
                  {dangPhat === b.id ? <RotateCcw size={18} /> : <Play size={20} />}
                </button>
              </div>
            </div>
            {dangPhat === b.id && cho && <DemDocCau het={cho} onBoQua={l.luyen || xem ? skipClip : undefined} />}
            {l.luyen && loiDan === b.id && dangPhat === b.id && !cho && (
              <div className={s.hint}>🎙️ Lời dẫn của đề · <button type="button" className={s.ghost} onClick={skipClip}>⏭ Bỏ qua</button></div>
            )}
            {!xem && (
              <div className={s.hint}>
                {khoa ? (dangPhat === b.id ? 'Đang phát — như thi thật, không dừng hay nghe lại được.' : 'Đã phát — như thi thật, mỗi bài chỉ nghe một lần.') : l.luyen ? 'Chế độ luyện: nghe lại được.' : 'Đọc trước câu hỏi, rồi bấm ▶. Chỉ nghe được MỘT lần.'}
              </div>
            )}
            {b.questions.map((c, ci) => { so++; const k = `n${bi}-${ci}`; return <CauHoi key={k} k={k} n={so} c={c} v={l.ans[k] ?? ''} set={set} xem={xem} />; })}
            {xem && (
              <details className={s.script}>
                <summary>Lời thoại (transcript)</summary>
                {b.lines.map((x, i) => <p key={i}>{x.who ? <b>{x.who}: </b> : null}{x.text}</p>)}
              </details>
            )}
          </section>
        );
      })}
    </>
  );
}

/* ── Phần Đọc ────────────────────────────────────────────────────────── */
function PhanDoc({ l, set, xem }: { l: Luot; set: (k: string, v: string) => void; xem: boolean }) {
  let so = 0;
  return (
    <>
      {l.de.phan.doc.bai.map((b, bi) => (
        <section key={b.id} className={s.part}>
          <div className={s.partNo}>Passage {bi + 1}{b.level ? ` · ${b.level}` : ''}</div>
          <div className={s.readGrid}>
            <div className={s.passage}>
              <h2 className={s.passTitle}>{b.title}</h2>
              {b.paragraphs.map((p, i) => <p key={i}>{p.label ? <b className={s.paraLabel}>{p.label}</b> : null}{p.text}</p>)}
            </div>
            <div>
              {b.questions.map((c, ci) => { so++; const k = `d${bi}-${ci}`; return <CauHoi key={k} k={k} n={so} c={c} v={l.ans[k] ?? ''} set={set} xem={xem} />; })}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

/* ── Phần Viết ───────────────────────────────────────────────────────── */
function ChamViet({ d, bai }: { d: DeViet; bai: string }) {
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const chamAI = async () => {
    setBusy(true); setErr('');
    try {
      const r = await api.post('/ielts/ai/cham-viet', { bai, de: d.prompt, task: d.task.includes('1') ? 'Task 1' : 'Task 2' }, AI_TIMEOUT);
      const x = r.data?.data as { ketQua: string | null; lyDo?: string };
      if (x?.ketQua) setRes(x.ketQua); else setErr(x?.lyDo === 'ai_unavailable' ? 'AI chấm bài đang tạm tắt.' : 'Chưa chấm được, thử lại nhé.');
    } catch (e) {
      const m = loiMang(e);
      setErr(m?.status === 401 ? 'Đăng nhập để AI chấm bài.' : m?.data?.message || 'Không kết nối được máy chấm.');
    } finally { setBusy(false); }
  };
  return (
    <>
      <button type="button" className={cs.btn} disabled={busy || demTu(bai) < 20} onClick={chamAI}>
        <Sparkles size={15} /> {busy ? 'AI đang chấm…' : 'Nhờ AI chấm theo 4 tiêu chí'}
      </button>
      {demTu(bai) < 20 && <span className={s.muted} style={{ marginLeft: 10 }}>Bài dưới 20 từ, chưa chấm được.</span>}
      {err && <div className={s.bad} style={{ marginTop: 8 }}>{err}</div>}
      {res && <div className={s.aiBox}><ChatMarkdown content={res} renderMath={false} /></div>}
    </>
  );
}

function PhanViet({ l, setViet, xem }: { l: Luot; setViet: (id: string, v: string) => void; xem: boolean }) {
  return (
    <>
      {l.de.phan.viet.de.map((d) => {
        const bai = l.viet[d.id] ?? '';
        const min = d.minWords ?? (d.task.includes('1') ? 150 : 250);
        return (
          <section key={d.id} className={s.part}>
            <div className={s.partNo}>{d.task}{d.minutes ? ` · gợi ý ${d.minutes} phút` : ''}</div>
            <div className={s.partTitle}>{d.title}</div>
            {d.figure && <div className={s.figure}><FigureView figure={d.figure} /></div>}
            {/* Đề có hình thì bỏ bảng markdown chép kèm trong đề (`| Bus | 20% |`) — hình đã vẽ đúng số đó. */}
            <div className={s.prompt}>{d.figure ? d.prompt.split('\n').filter((x) => !x.trim().startsWith('|')).join('\n').replace(/\n{3,}/g, '\n\n') : d.prompt}</div>
            {d.promptVi && <div className={s.muted} style={{ marginTop: 6 }}>{d.promptVi}</div>}
            <textarea className={s.essay} value={bai} readOnly={xem} onChange={(e) => setViet(d.id, e.target.value)} placeholder="Viết bài ở đây…" spellCheck={false} />
            <div className={demTu(bai) >= min ? s.good : s.muted} style={{ fontSize: 14, fontWeight: 600 }}>{demTu(bai)} / {min} từ</div>
            {xem && (
              <div style={{ marginTop: 12 }}>
                <ChamViet d={d} bai={bai} />
                {d.sample && (
                  <details className={s.script}>
                    <summary>Bài mẫu{d.sample.band ? ` (${d.sample.band})` : ''}</summary>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{d.sample.text}</p>
                    {d.sample.note && <p className={s.muted}>{d.sample.note}</p>}
                  </details>
                )}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}

/* ── Trang chính ─────────────────────────────────────────────────────── */
type LichSu = { stage: string; muc: string; band: number | null; chiTiet: (KetQuaBand & { dungDoc?: number; cauDoc?: number; dungNghe?: number; cauNghe?: number }) | null; luc: string };

export default function PhongThi() {
  const { isAuthenticated } = useLangUser();
  const [l, setL] = useState<Luot | null>(null);
  const [chang, setChang] = useState('1');
  const [luyen, setLuyen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [hoiNop, setHoiNop] = useState(false);
  const [lichSu, setLichSu] = useState<LichSu[] | null>(null);

  useEffect(() => { setL(docLuot()); }, []);
  useEffect(() => { ghiLuot(l); }, [l]);
  useEffect(() => {
    if (!isAuthenticated || (l && l.phase !== 'ketqua')) return;
    api.get('/ielts/de-thi/lich-su').then((r) => setLichSu((r.data?.data?.items ?? []) as LichSu[])).catch(() => setLichSu(null));
  }, [isAuthenticated, l]);

  // Đang thi mà đóng tab → trình duyệt hỏi lại (bài vẫn còn nếu tải lại, nhưng đóng tab là mất).
  const dangThi = !!l && l.phase !== 'ketqua';
  useEffect(() => {
    if (!dangThi) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dangThi]);

  const batDau = async () => {
    setBusy(true); setErr('');
    try {
      const r = await api.get(`/ielts/de-thi/${chang}`);
      const de = r.data?.data as De;
      setL({ de, phase: 'nghe', endAt: Date.now() + de.phan.nghe.phut * 60_000, ans: {}, viet: {}, luyen, daPhat: {} });
      window.scrollTo({ top: 0 });
    } catch (e) {
      const m = loiMang(e);
      setErr(m?.status === 401 ? 'Đăng nhập để vào phòng thi (máy chủ lưu kết quả cho bạn).' : m?.data?.message || 'Không tải được đề, thử lại nhé.');
    } finally { setBusy(false); }
  };

  const nop = useCallback(async (cur: Luot) => {
    const kq = cham(cur.de, cur.ans);
    let band: KetQuaBand | undefined;
    try {
      const r = await api.post('/ielts/de-thi/nop', { chang: cur.de.chang, hat: cur.de.hat, ...kq });
      band = r.data?.data as KetQuaBand;
    } catch { band = undefined; }
    setL((x) => (x ? { ...x, band } : x));
  }, []);

  const sangPhanSau = useCallback(() => {
    stopAudio();
    setHoiNop(false);
    setL((cur) => {
      if (!cur || cur.phase === 'ketqua') return cur;
      const next = THU_TU[THU_TU.indexOf(cur.phase) + 1];
      const nl: Luot = { ...cur, phase: next, endAt: Date.now() + phutCua(cur.de, next) * 60_000 };
      if (next === 'ketqua') void nop(nl);
      return nl;
    });
    window.scrollTo({ top: 0 });
  }, [nop]);

  const setAns = useCallback((k: string, v: string) => setL((x) => (x ? { ...x, ans: { ...x.ans, [k]: v } } : x)), []);
  const setViet = useCallback((id: string, v: string) => setL((x) => (x ? { ...x, viet: { ...x.viet, [id]: v } } : x)), []);
  const onPhat = useCallback((id: string) => setL((x) => (x ? { ...x, daPhat: { ...x.daPhat, [id]: true } } : x)), []);

  const kq = useMemo(() => (l?.phase === 'ketqua' ? cham(l.de, l.ans) : null), [l]);
  const stageLabel = (st: string) => {
    const i = Number(st.replace('stage', '')) - 1;
    const b = BAND_STAGES[i];
    return b ? `Chặng ${i + 1} · band ${b.from}→${b.to}` : st;
  };

  return (
    <div className={cs.root}>
      <div className={s.wrap}>
        <div className={s.top}>
          <Link href="/language/en/ielts" className={s.back}><ArrowLeft size={16} /> Khoá IELTS</Link>
          {l && l.phase !== 'ketqua' && (
            <div className={s.bar}>
              <span className={s.phaseName}>{TEN[l.phase]}</span>
              <DongHo key={`${l.phase}-${l.endAt}`} endAt={l.endAt} onHet={sangPhanSau} />
            </div>
          )}
        </div>

        {!l && (
          <div className={s.intro}>
            <h1 className={s.h1}>🎯 Phòng thi thử IELTS</h1>
            <p className={s.lead}>
              Làm một đề đủ ba phần theo đúng thứ tự và đồng hồ của kỳ thi thật: <b>Listening 30 phút → Reading 60 phút → Writing 60 phút</b>.
              Đồng hồ không tạm dừng được, hết giờ tự sang phần sau. Xong đề thì xem đáp án, lời giải từng câu, và nhờ AI chấm bài viết.
            </p>
            <div className={s.pickTitle}>Chọn độ khó</div>
            <div className={s.stages}>
              {BAND_STAGES.map((b, i) => (
                <button key={b.id} type="button" className={`${s.stage} ${chang === String(i + 1) ? s.stageOn : ''}`} onClick={() => setChang(String(i + 1))}>
                  <span className={s.stageIcon}>{b.icon}</span>
                  <span><b>Chặng {i + 1}</b> · band {b.from} → {b.to}</span>
                  <span className={s.muted}>{b.title}</span>
                </button>
              ))}
            </div>
            <label className={s.check}>
              <input type="checkbox" checked={luyen} onChange={(e) => setLuyen(e.target.checked)} />
              <span><b>Chế độ luyện</b> — cho nghe lại bài Listening (thi thật chỉ nghe một lần). Mới bắt đầu thì nên bật.</span>
            </label>
            <div className={s.warn}>⚠️ Đây là ĐỀ THỬ dựng từ kho bài luyện, không phải đề thi thật. Band chỉ là ước lượng quy đổi từ tỉ lệ đúng.</div>
            {!isAuthenticated && <div className={s.bad} style={{ marginBottom: 10 }}>Cần đăng nhập để vào phòng thi.</div>}
            <button type="button" className={cs.btn} disabled={busy} onClick={batDau}>{busy ? 'Đang dựng đề…' : 'Bắt đầu làm bài'}</button>
            {err && <div className={s.bad} style={{ marginTop: 10 }}>{err}</div>}

            {lichSu && lichSu.length > 0 && (
              <div className={s.history}>
                <div className={s.pickTitle}>Các lượt đã thi</div>
                {lichSu.slice(0, 10).map((h) => (
                  <div key={h.muc} className={s.histRow}>
                    <span>{stageLabel(h.stage)}</span>
                    <span className={s.muted}>
                      {h.chiTiet?.cauNghe ? `Nghe ${h.chiTiet.dungNghe}/${h.chiTiet.cauNghe}` : ''}
                      {h.chiTiet?.cauDoc ? ` · Đọc ${h.chiTiet.dungDoc}/${h.chiTiet.cauDoc}` : ''}
                    </span>
                    <b>{h.band != null ? `≈ ${h.band}` : '—'}</b>
                    <span className={s.muted}>{new Date(h.luc).toLocaleDateString('vi-VN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {l && l.phase !== 'ketqua' && (
          <>
            <div className={s.steps}>
              {(['nghe', 'doc', 'viet'] as Phase[]).map((p) => (
                <span key={p} className={`${s.step} ${p === l.phase ? s.stepOn : THU_TU.indexOf(p) < THU_TU.indexOf(l.phase) ? s.stepDone : ''}`}>
                  {TEN[p]} · {phutCua(l.de, p)}′
                </span>
              ))}
            </div>
            {l.phase === 'nghe' && <PhanNghe l={l} set={setAns} xem={false} onPhat={onPhat} />}
            {l.phase === 'doc' && <PhanDoc l={l} set={setAns} xem={false} />}
            {l.phase === 'viet' && <PhanViet l={l} setViet={setViet} xem={false} />}
            <div className={s.foot}>
              {hoiNop ? (
                <>
                  <span>Nộp phần {TEN[l.phase]}? Không quay lại được.</span>
                  <button type="button" className={cs.btn} onClick={sangPhanSau}>Nộp</button>
                  <button type="button" className={s.ghost} onClick={() => setHoiNop(false)}>Làm tiếp</button>
                </>
              ) : (
                <button type="button" className={cs.btn} onClick={() => setHoiNop(true)}>
                  {l.phase === 'viet' ? 'Nộp bài & xem kết quả' : `Nộp phần ${TEN[l.phase]} → sang phần sau`}
                </button>
              )}
            </div>
          </>
        )}

        {l && l.phase === 'ketqua' && kq && (
          <>
            <h1 className={s.h1}>Kết quả · {stageLabel(l.de.chang)}{l.luyen ? ' · chế độ luyện' : ''}</h1>
            <div className={s.scores}>
              <div className={s.score}><span>Listening</span><b>{kq.dungNghe}/{kq.cauNghe}</b><span className={s.muted}>{l.band?.bandNghe != null ? `≈ band ${l.band.bandNghe}` : ''}</span></div>
              <div className={s.score}><span>Reading</span><b>{kq.dungDoc}/{kq.cauDoc}</b><span className={s.muted}>{l.band?.bandDoc != null ? `≈ band ${l.band.bandDoc}` : ''}</span></div>
              <div className={s.score}><span>Ước lượng (Nghe + Đọc)</span><b>{l.band?.bandTong != null ? l.band.bandTong : '…'}</b><span className={s.muted}>Writing: nhờ AI chấm bên dưới</span></div>
            </div>
            <div className={s.warn}>{l.de.canhBao}</div>
            <h2 className={s.h2}>Listening — đáp án & lời giải</h2>
            <PhanNghe l={l} set={setAns} xem onPhat={onPhat} />
            <h2 className={s.h2}>Reading — đáp án & lời giải</h2>
            <PhanDoc l={l} set={setAns} xem />
            <h2 className={s.h2}>Writing — bài của bạn</h2>
            <PhanViet l={l} setViet={setViet} xem />
            <div className={s.foot}>
              <button type="button" className={cs.btn} onClick={() => { setL(null); window.scrollTo({ top: 0 }); }}>Thi đề khác</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
