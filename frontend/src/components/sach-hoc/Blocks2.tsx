'use client';

/**
 * Khối cho các KỸ NĂNG: bài đọc, bài nghe, hội thoại có nhân vật, ô viết có
 * AI chấm, biểu đồ Task 1, luyện nói có ghi âm. Tách khỏi Blocks.tsx để mỗi
 * tệp giữ được một việc — Blocks.tsx là phần "sách" (lý thuyết + bài tập).
 */
import { useEffect, useRef, useState } from 'react';
import { Play, Square, Eye, EyeOff, Mic, Volume2, Sparkles, RotateCcw } from 'lucide-react';
import api from '@/lib/api';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import type { Block, Role, Voice } from './types';
import { play, stopAudio, skipClip, AI_TIMEOUT, ngonNguKhoa, type Clip } from './audio';
import { dungLoiDan } from './nghe';
import { DemDocCau } from './DemDocCau';
import dynamic from 'next/dynamic';
import { Inline, Kj } from './Blocks';
import { useCourse, useTutor } from './tutorContext';
import HandEssay from './HandEssay';
import WriteBlock from './WriteBlock';
import { useMicro } from './useMicro';
import HanLop from './HanLop';
import PhatAm from './PhatAm';
import VietHanZh from './VietHanZh';
import s from './course.module.css';

// Công cụ chia động từ chỉ có ở một mục tra cứu — tách chunk riêng.
const ChiaDongTu = dynamic(() => import('./nhat/ChiaDongTu'), { ssr: false, loading: () => <div className={s.soonBox} aria-busy="true">Đang tải…</div> });
// Tra cứu từ vựng cả khoá — cũng chỉ ở một mục tra cứu.
const TraTuVung = dynamic(() => import('./TraTuVung'), { ssr: false, loading: () => <div className={s.soonBox} aria-busy="true">Đang tải…</div> });

/* ── Nhân vật ────────────────────────────────────────────────────────── */

const CAST: Record<Role, { voice: Voice; skin: string; hair: string; shirt: string; glasses?: boolean; long?: boolean }> = {
  examiner: { voice: 'uk-nam', skin: '#f2c9a0', hair: '#4b3621', shirt: '#1e3a8a', glasses: true },
  candidate: { voice: 'uk-nu', skin: '#f7d6b5', hair: '#1f1a17', shirt: '#db2777', long: true },
  a: { voice: 'us-nu', skin: '#e8b98f', hair: '#7c2d12', shirt: '#059669', long: true },
  b: { voice: 'us-nam', skin: '#c68a5e', hair: '#111827', shirt: '#ea580c' },
  c: { voice: 'uk-nu', skin: '#f5cfa8', hair: '#a16207', shirt: '#7c3aed', long: true },
};

/**
 * Giọng của một vai theo NGÔN NGỮ của khoá: khoá tiếng Nhật đọc bằng giọng
 * Nhật (vai nữ → ja-nu, vai nam → ja-nam), khoá tiếng Anh dùng giọng của vai.
 */
function useVoiceFor() {
  const ja = useCourse()?.voice.startsWith('ja');
  // "Cô giáo" / "Cô" là giáo viên nữ dù vai là examiner — giọng theo tên hiển thị.
  return (role: Role, who?: string): Voice => {
    if (!ja) return CAST[role].voice;
    if (who && /^(Cô|cô)/.test(who)) return 'ja-nu';
    return role === 'examiner' || role === 'b' ? 'ja-nam' : 'ja-nu';
  };
}

/** Nhân vật hoạt hình vẽ bằng SVG — không tải ảnh, sáng/tối đều rõ. */
export function Avatar({ role, size = 40, talking = false }: { role: Role; size?: number; talking?: boolean }) {
  const c = CAST[role];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className={talking ? s.avatarTalk : undefined}>
      <circle cx="32" cy="32" r="32" fill={`color-mix(in srgb, ${c.shirt} 18%, #fff)`} />
      <path d={`M10 64c2-12 11-18 22-18s20 6 22 18z`} fill={c.shirt} />
      {c.long && <path d="M16 30c0-12 7-19 16-19s16 7 16 19v14c-4-2-6-6-6-6H22s-2 4-6 6z" fill={c.hair} />}
      <rect x="27" y="38" width="10" height="9" rx="3" fill={c.skin} />
      <ellipse cx="32" cy="29" rx="13" ry="14" fill={c.skin} />
      <path d={c.long ? 'M19 27c1-9 6-14 13-14s12 5 13 14c-4-5-9-7-13-7s-9 2-13 7z' : 'M19 26c0-8 6-13 13-13s13 5 13 13c-3-4-8-6-13-6s-10 2-13 6z'} fill={c.hair} />
      <circle cx="27" cy="30" r="1.8" fill="#1f2937" />
      <circle cx="37" cy="30" r="1.8" fill="#1f2937" />
      {c.glasses && (
        <g fill="none" stroke="#1f2937" strokeWidth="1.4">
          <circle cx="27" cy="30" r="4" />
          <circle cx="37" cy="30" r="4" />
          <path d="M31 30h2" />
        </g>
      )}
      <path d="M28 36c2 2 6 2 8 0" stroke="#9f1239" strokeWidth="1.6" fill="none" strokeLinecap="round" className={s.mouth} />
      <circle cx="23" cy="34" r="2" fill="#fb7185" opacity="0.35" />
      <circle cx="41" cy="34" r="2" fill="#fb7185" opacity="0.35" />
    </svg>
  );
}

/* ── Bài đọc ─────────────────────────────────────────────────────────── */

function Passage({ b }: { b: Extract<Block, { t: 'passage' }> }) {
  return (
    <article className={s.passage}>
      <div className={s.passageHead}>Reading passage</div>
      <h3 className={s.passageTitle}>{b.title}</h3>
      {b.intro && <p className={s.passageIntro}><Inline text={b.intro} /></p>}
      {b.paras.map((p, i) => (
        <p key={i} className={s.passagePara}>
          {p.label && <span className={s.paraLabel}>{p.label}</span>}
          <Inline text={p.text} />
        </p>
      ))}
    </article>
  );
}

/* ── Bài nghe ────────────────────────────────────────────────────────── */

function Listen({ b }: { b: Extract<Block, { t: 'listen' }> }) {
  const [playing, setPlaying] = useState(false);
  const [plays, setPlays] = useState(0);
  const [show, setShow] = useState(false);
  const [line, setLine] = useState<number | null>(null);
  /** Đang ở đâu trong băng: lời dẫn đầu / hội thoại / lời kết (chỉ khi có `b.dan`). */
  const [doan, setDoan] = useState<'mo' | 'bai' | 'ket' | null>(null);
  /** Hết giờ đọc câu hỏi lúc nào (đang ở khoảng im lặng) — null khi không chờ. */
  const [cho, setCho] = useState<number | null>(null);
  useEffect(() => () => stopAudio(), []);

  // Bấm phát lúc đang phát = phát LẠI TỪ ĐẦU (người học muốn nghe lại); dừng có nút riêng.
  const start = () => {
    const bai = b.lines.map((l) => ({ text: l.text, voice: l.voice ?? 'uk-nu' }));
    const { mo, ket } = b.dan ? dungLoiDan({ ...b.dan, tieuDe: b.title }) : { mo: [], ket: [] };
    const all: Clip[] = [...mo, ...bai, ...ket];
    play(all, () => { setPlaying(false); setDoan(null); setCho(null); }, {
      onClip: (i) => {
        setDoan(i < mo.length ? 'mo' : i < mo.length + bai.length ? 'bai' : 'ket');
        setCho(all[i].pauseMs ? Date.now() + all[i].pauseMs! : null);
      },
    });
    setPlaying(true);
    setDoan(mo.length ? 'mo' : 'bai');
    setPlays((n) => n + 1);
  };
  const dung = () => { stopAudio(); setPlaying(false); setDoan(null); setCho(null); };

  return (
    <div className={s.listenBox}>
      <div className={s.listenTop}>
        <button type="button" className={s.playBig} onClick={start} aria-label={playing ? 'Phát lại từ đầu' : 'Phát bài nghe'} title={playing ? 'Phát lại từ đầu' : 'Phát bài nghe'}>
          {playing ? <RotateCcw size={20} /> : <Play size={22} />}
        </button>
        <div className="min-w-0 flex-1">
          <div className={s.listenLabel}>🎧 Bài nghe</div>
          <div className={s.listenTitle}>{b.title}</div>
          <div className={s.quizSub}>
            {b.note ?? 'Nghe trước, làm bài bên dưới, rồi mới mở lời thoại để kiểm tra.'}
            {plays > 0 && ` · Đã nghe ${plays} lần`}
          </div>
        </div>
        {playing && <span className={s.wave} aria-hidden><i /><i /><i /><i /><i /></span>}
        {playing && <button type="button" className={s.btnGhost} onClick={dung}><Square size={14} /> Dừng</button>}
      </div>
      {playing && b.dan && doan && doan !== 'bai' && (
        <div className={s.quizSub} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {cho ? <DemDocCau het={cho} onBoQua={skipClip} /> : (
            <>
              <span>{doan === 'mo' ? '🎙️ Phần giới thiệu của bài nghe' : '🎙️ Hết bài — soát lại đáp án'}</span>
              <button type="button" className={s.btnGhost} onClick={skipClip}>⏭ Bỏ qua đoạn này</button>
            </>
          )}
        </div>
      )}
      <button type="button" className={s.linkBtn} onClick={() => setShow(!show)} style={{ marginTop: 10 }}>
        {show ? <><EyeOff size={13} className="inline" /> Ẩn lời thoại</> : <><Eye size={13} className="inline" /> Hiện lời thoại (transcript)</>}
      </button>
      {show && (
        <div className={s.transcript}>
          {b.lines.map((l, i) => (
            <div key={i} className={`${s.tLine} ${line === i ? s.tLineOn : ''}`}>
              <button
                type="button"
                className={s.speak}
                aria-label="Nghe câu này"
                onClick={() => { play({ text: l.text, voice: l.voice ?? 'uk-nu' }, () => setLine(null)); setLine(i); setPlaying(false); setDoan(null); }}
              >
                <Volume2 size={14} />
              </button>
              <div>
                {l.who && <b className={s.tWho}><Inline text={l.who} />: </b>}<Inline text={l.text} />
                {l.ro && <div className={s.ro}>{l.ro}</div>}
                {l.vi && <div className={s.dVi}><Inline text={l.vi} /></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Hội thoại có nhân vật ───────────────────────────────────────────── */

function Dialogue({ b }: { b: Extract<Block, { t: 'dialogue' }> }) {
  const voiceFor = useVoiceFor();
  const [on, setOn] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  useEffect(() => () => stopAudio(), []);

  const playAll = () => {
    if (all) { stopAudio(); return; }
    // MỘT lượt phát cho cả đoạn, tô sáng người đang nói qua onClip. (Trước 03/10
    // là vòng lặp chờ từng câu — bị nút khác chen vào thì vòng lặp tưởng câu đã
    // xong và tự phát tiếp câu sau, đè lên tiếng của nút kia.)
    play(b.lines.map((l) => ({ text: l.text, voice: voiceFor(l.role, l.who) })), () => { setAll(false); setOn(null); }, { onClip: (i) => setOn(i) });
    setAll(true);
    setOn(0);
  };

  return (
    <div className={s.dialogue}>
      <div className={s.dialogueHead}>
        <span>💬 {b.title ?? 'Hội thoại mẫu'}</span>
        <button type="button" className={s.btnGhost} onClick={playAll}>
          {all ? <><Square size={14} /> Dừng</> : <><Play size={14} /> Nghe cả đoạn</>}
        </button>
      </div>
      {b.lines.map((l, i) => {
        const right = l.role === 'candidate' || l.role === 'b';
        return (
          <div key={i} className={`${s.dLine} ${right ? s.dRight : ''}`}>
            <Avatar role={l.role} size={42} talking={on === i} />
            <div className={`${s.dBubble} ${on === i ? s.dBubbleOn : ''}`}>
              <div className={s.dWho}><Inline text={l.who} /></div>
              <button
                type="button"
                className={s.dText}
                onClick={() => { play({ text: l.text, voice: voiceFor(l.role, l.who) }, () => setOn(null)); setOn(i); }}
              >
                <Inline text={l.text} />
              </button>
              {l.ro && <div className={s.ro}>{l.ro}</div>}
              {l.vi && <div className={s.dVi}><Inline text={l.vi} /></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Viết + AI chấm ──────────────────────────────────────────────────── */

function Essay({ b }: { b: Extract<Block, { t: 'essay' }> }) {
  const key = `ielts-v2:essay:${b.id}`;
  const [txt, setTxt] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<string | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { try { setTxt(localStorage.getItem(key) ?? ''); } catch { /* bỏ qua */ } }, [key]);
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
  // ⌨️ gõ phím / ✍️ viết tay — nhớ lựa chọn trên máy này (iPad thì hay viết tay).
  const modeKey = `${key}:mode`;
  const [hand, setHand] = useState(false);
  useEffect(() => { try { setHand(localStorage.getItem(modeKey) === 'hand'); } catch { /* bỏ qua */ } }, [modeKey]);
  const pickMode = (h: boolean) => { setHand(h); try { localStorage.setItem(modeKey, h ? 'hand' : 'type'); } catch { /* bỏ qua */ } };

  const grade = async () => {
    setBusy(true); setErr(''); setRes(null);
    try {
      const r = await api.post('/ielts/ai/cham-viet', { bai: txt, de: b.prompt, task: b.task }, AI_TIMEOUT);
      const d = r.data?.data as { ketQua: string | null; lyDo?: string };
      if (d?.ketQua) setRes(d.ketQua);
      else setErr(d?.lyDo === 'ai_unavailable' ? 'AI chấm bài đang tạm tắt.' : 'Chưa chấm được, thử lại nhé.');
    } catch (e) {
      const m = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
      setErr(m?.status === 401 ? 'Đăng nhập để AI chấm bài.' : m?.data?.message || 'Không kết nối được máy chấm.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.essay}>
      <div className={s.essayTask}>✍️ Writing {b.task}</div>
      <div className={s.essayPrompt}><Inline text={b.prompt} /></div>
      {b.tips && (
        <ul className={s.noteList} style={{ marginBottom: 10 }}>
          {b.tips.map((t) => <li key={t} className={s.noteItem}><Inline text={t} /></li>)}
        </ul>
      )}
      <div className={s.modeSwitch} role="tablist" aria-label="Cách viết bài">
        <button type="button" role="tab" aria-selected={!hand} className={`${s.modeBtn} ${!hand ? s.modeBtnOn : ''}`} onClick={() => pickMode(false)}>⌨️ Gõ phím</button>
        <button type="button" role="tab" aria-selected={hand} className={`${s.modeBtn} ${hand ? s.modeBtnOn : ''}`} onClick={() => pickMode(true)}>✍️ Viết tay</button>
      </div>
      {hand ? <HandEssay id={b.id} de={b.prompt} task={b.task} /> : <>
      <textarea
        className={s.essayInput}
        value={txt}
        onChange={(e) => { setTxt(e.target.value); try { localStorage.setItem(key, e.target.value); } catch { /* bỏ qua */ } }}
        placeholder="Viết bài của bạn ở đây… (bài tự lưu trên máy này)"
        spellCheck={false}
      />
      <div className={s.quizFoot}>
        <span className={words >= b.minWords ? s.good : s.muted} style={{ fontSize: 14, fontWeight: 600 }}>
          {words} / {b.minWords} từ
        </span>
        <button type="button" className={s.btn} disabled={busy || words < 20} onClick={grade}>
          <Sparkles size={15} /> {busy ? 'AI đang chấm…' : 'Nhờ AI chấm theo 4 tiêu chí'}
        </button>
      </div>
      {err && <div className={`${s.feedback} ${s.bad}`}>{err}</div>}
      {res && <div className={`${s.turnA} ${s.essayResult}`}><ChatMarkdown content={res} renderMath={false} /></div>}
      </>}
    </div>
  );
}

/* ── Biểu đồ ─────────────────────────────────────────────────────────── */

const PALETTE = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'];

function Chart({ b }: { b: Extract<Block, { t: 'chart' }> }) {
  const W = 560, H = 300, L = 48, R = 16, T = 20, B = 44;
  // Trục số chia TRÒN (0, 25, 50…) — người học đọc số liệu từ vạch chia, vạch lẻ
  // kiểu 79 hay 53 bắt họ tự nội suy và đọc sai.
  const raw = Math.max(...b.series.flatMap((x) => x.values)) || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5].map((f) => f * mag).find((st) => st * 4 >= raw * 1.05) ?? mag * 10;
  const max = (step * 4) || 1;
  const x = (i: number) => L + ((W - L - R) * (b.kind === 'bar' ? i + 0.5 : i)) / (b.kind === 'bar' ? b.labels.length : Math.max(1, b.labels.length - 1));
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const ticks = [0, 1, 2, 3, 4].map((k) => Math.round(step * k * 100) / 100);
  const bw = ((W - L - R) / b.labels.length) * 0.7 / b.series.length;
  return (
    <figure className={s.chart}>
      <figcaption className={s.chartTitle}>{b.title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.chartSvg} role="img" aria-label={b.title}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className={s.chartGrid} />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" className={s.chartAxis}>{t}</text>
          </g>
        ))}
        {b.labels.map((lb, i) => (
          <text key={lb} x={x(i)} y={H - B + 18} textAnchor="middle" className={s.chartAxis}>{lb}</text>
        ))}
        {b.unit && <text x={L} y={12} className={s.chartAxis}>{b.unit}</text>}
        {b.series.map((se, si) =>
          b.kind === 'line' ? (
            <g key={se.name}>
              <polyline fill="none" stroke={PALETTE[si % 5]} strokeWidth="2.5" points={se.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
              {se.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill={PALETTE[si % 5]} />)}
            </g>
          ) : (
            <g key={se.name}>
              {se.values.map((v, i) => (
                <rect key={i} x={x(i) - (bw * b.series.length) / 2 + si * bw} y={y(v)} width={bw - 2} height={H - B - y(v)} rx="2" fill={PALETTE[si % 5]} />
              ))}
            </g>
          ),
        )}
      </svg>
      <div className={s.legend} style={{ border: 'none', paddingTop: 0 }}>
        {b.series.map((se, si) => (
          <span key={se.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <i style={{ width: 12, height: 12, borderRadius: 3, background: PALETTE[si % 5], display: 'inline-block' }} />{se.name}
          </span>
        ))}
      </div>
    </figure>
  );
}

/* ── Luyện nói: ghi âm + AI chấm ─────────────────────────────────────── */

function SpeakQ({ q, part }: { q: string; part: string }) {
  // Máy chấm nói hiện chỉ hiểu tiếng Anh (Whisper 'en' + tiêu chí IELTS) — khoá
  // tiếng Nhật chỉ ghi âm & nghe lại, không gửi đi chấm sai ngôn ngữ.
  const ja = useCourse()?.voice.startsWith('ja');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ chu?: string | null; ketQua?: string | null; err?: string } | null>(null);
  /** Lượt chấm hiện hành — ghi bài mới trong lúc bài cũ đang chấm thì kết quả cũ bị bỏ. */
  const luot = useRef(0);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  // Câu trả lời Speaking dài và có lúc ngập ngừng tự nhiên ⇒ KHÔNG tự dừng theo khoảng lặng; tối đa 3 phút.
  const mic = useMicro({ toiDaMs: 180_000, onXong: (b) => { setBlob(b); setUrl(URL.createObjectURL(b)); } });
  const ghi = () => { luot.current += 1; setBlob(null); setUrl(null); setOut(null); setBusy(false); void mic.batDau(); };

  const grade = async () => {
    if (!blob) return;
    const my = ++luot.current;
    setBusy(true);
    try {
      const fd = new FormData();
      const ext = blob.type.includes('mp4') ? 'm4a' : 'webm';
      fd.append('audio', blob, `noi.${ext}`);
      fd.append('cauHoi', q);
      fd.append('part', part);
      const r = await api.post('/ielts/ai/cham-noi', fd, { headers: { 'Content-Type': 'multipart/form-data' }, ...AI_TIMEOUT });
      if (my !== luot.current) return;
      const d = r.data?.data as { chu: string | null; ketQua: string | null; lyDo?: string };
      setOut(d?.ketQua ? d : { chu: d?.chu, err: d?.lyDo === 'khong_nghe_thay' ? 'Chưa nghe thấy bạn nói — thử nói to và gần micro hơn.' : 'Chưa chấm được, thử lại nhé.' });
    } catch (e) {
      if (my !== luot.current) return;
      const st = (e as { response?: { status?: number } })?.response?.status;
      setOut({ err: st === 401 ? 'Đăng nhập để AI chấm phần nói.' : 'Không gửi được bản ghi. Thử lại nhé.' });
    } finally {
      if (my === luot.current) setBusy(false);
    }
  };

  return (
    <div className={s.speakQ}>
      <div className={s.speakRow}>
        <Avatar role="examiner" size={34} />
        <button type="button" className={s.dText} style={{ flex: 1 }} onClick={() => play({ text: q, voice: ja ? 'ja-nam' : 'uk-nam' })}>
          <Volume2 size={14} className="inline" style={{ marginRight: 6, opacity: 0.6 }} />{q}
        </button>
      </div>
      <div className={s.qRow} style={{ paddingLeft: 44 }}>
        {mic.trangThai === 'ghi' ? (
          <button type="button" className={s.recOn} onClick={mic.dung}><Square size={14} /> Xong</button>
        ) : (
          <button type="button" className={s.btnGhost} onClick={ghi} disabled={mic.trangThai === 'mo'}>
            <Mic size={15} /> {mic.trangThai === 'mo' ? 'Đang mở micro…' : blob ? 'Ghi lại' : 'Trả lời (ghi âm)'}
          </button>
        )}
        {mic.trangThai === 'ghi' && <span className={s.paMeter} title="Mức micro"><i style={{ width: `${Math.round(mic.muc * 100)}%` }} /></span>}
        {url && <audio src={url} controls className={s.recAudio} />}
        {blob && !ja && (
          <button type="button" className={s.btn} disabled={busy} onClick={grade}>
            <Sparkles size={14} /> {busy ? 'Đang chấm…' : 'AI chấm'}
          </button>
        )}
      </div>
      {(out?.err || mic.loi) && <div className={`${s.feedback} ${s.bad}`} style={{ paddingLeft: 44 }}>{out?.err || mic.loi}</div>}
      {out?.ketQua && (
        <div className={`${s.turnA} ${s.essayResult}`} style={{ marginLeft: 44 }}>
          {out.chu && <p className={s.quizSub}><b>Máy nghe được:</b> “{out.chu}”</p>}
          <ChatMarkdown content={out.ketQua} renderMath={false} />
        </div>
      )}
    </div>
  );
}

function Speak({ b }: { b: Extract<Block, { t: 'speak' }> }) {
  const ja = useCourse()?.voice.startsWith('ja');
  const [k, setK] = useState(0);
  return (
    <div className={s.quiz} key={k}>
      <div className={s.quizTitle}>🎤 Luyện nói{ja ? '' : ` — Speaking Part ${b.part}`}</div>
      <div className={s.quizSub}>{ja ? 'Bấm câu hỏi để nghe → ghi âm câu trả lời → nghe lại và so với câu mẫu.' : 'Bấm câu hỏi để nghe giám khảo hỏi → bấm ghi âm và trả lời → nghe lại → nhờ AI chấm.'}</div>
      {b.questions.map((q) => <SpeakQ key={q} q={q} part={b.part} />)}
      <div className={s.quizFoot}>
        <span />
        <button type="button" className={s.btnGhost} onClick={() => setK(k + 1)}><RotateCcw size={14} /> Làm lại cả bài</button>
      </div>
    </div>
  );
}

/* ── Ghép câu ─────────────────────────────────────────────────────────── */

function BuildItem({ it, n, onDone }: { it: Extract<Block, { t: 'build' }>['items'][number]; n: number; onDone: (ok: boolean) => void }) {
  // Xáo một lần theo chữ của câu — ổn định giữa các lần vẽ, khác nhau giữa các câu.
  const [order] = useState(() => it.chips.map((c, i) => ({ c, i, k: Math.sin((i + 1) * (n + 3) * 7.13) })).sort((a, b) => a.k - b.k));
  const [picked, setPicked] = useState<number[]>([]);
  const [res, setRes] = useState<boolean | null>(null);
  const text = picked.map((i) => it.chips[i]);
  const joined = (a: string[]) => a.join('').replace(/\s+/g, '');
  const check = () => {
    const ok = [it.answer, ...(it.alt ?? [])].some((a) => joined(a) === joined(text));
    setRes(ok);
    onDone(ok);
    if (ok) play({ text: it.answer.join('') });
  };
  return (
    <div className={s.qItem}>
      <div className={s.qText}><span className={s.qNum}>{n}</span>{it.vi}</div>
      <div className={s.buildLine} aria-label="Câu bạn ghép">
        {picked.length ? picked.map((i, k) => (
          <button key={k} type="button" className={`${s.chipJa} ${s.chipOn}`} onClick={() => { setPicked(picked.filter((_, x) => x !== k)); setRes(null); }}>
            <Inline text={it.chips[i]} />
          </button>
        )) : <span className={s.muted} style={{ fontSize: 14 }}>Bấm các mảnh bên dưới theo đúng thứ tự…</span>}
      </div>
      <div className={s.buildBank}>
        {order.map(({ c, i }) => (
          <button key={i} type="button" className={s.chipJa} disabled={picked.includes(i)} onClick={() => { setPicked([...picked, i]); setRes(null); }}>
            <Inline text={c} />
          </button>
        ))}
      </div>
      <div className={s.qRow}>
        <button type="button" className={s.btn} disabled={!picked.length} onClick={check}>Kiểm tra</button>
        <button type="button" className={s.btnGhost} onClick={() => { setPicked([]); setRes(null); }}><RotateCcw size={14} /> Xếp lại</button>
      </div>
      {res !== null && (
        <div className={`${s.feedback} ${res ? s.good : s.bad}`}>
          {res ? 'Đúng rồi! ' : 'Chưa đúng. Câu đúng: '}
          {!res && <b><Inline text={it.answer.join(' ')} /></b>}
          {it.ro && <div className={s.ro}>{it.ro}</div>}
        </div>
      )}
    </div>
  );
}

function Build({ b }: { b: Extract<Block, { t: 'build' }> }) {
  const tutor = useTutor();
  const [done, setDone] = useState<Record<number, boolean>>({});
  const right = Object.values(done).filter(Boolean).length;
  return (
    <div className={s.quiz}>
      <div className={s.quizTitle}>🧩 {b.title}</div>
      <div className={s.quizSub}>Đọc nghĩa tiếng Việt, bấm các mảnh theo đúng thứ tự để ghép thành câu. Bấm mảnh đã chọn để gỡ ra.</div>
      {b.items.map((it, i) => (
        <BuildItem
          key={i}
          it={it}
          n={i + 1}
          onDone={(ok) => setDone((d) => {
            const next = { ...d, [i]: ok };
            if (Object.keys(next).length === b.items.length) {
              tutor.report(b.id, Math.round((Object.values(next).filter(Boolean).length / b.items.length) * 100));
            }
            return next;
          })}
        />
      ))}
      {Object.keys(done).length > 0 && <div className={s.quizFoot}><span className={s.score}>Đúng {right}/{Object.keys(done).length} câu đã làm</span></div>}
    </div>
  );
}

/* ── Đọc chữ Hán không furigana ─────────────────────────────────────────── */

const bare = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');

function ReadKanji({ b }: { b: Extract<Block, { t: 'readkanji' }> }) {
  const tutor = useTutor();
  // Hàng đợi: câu "chưa đọc được" quay lại cuối lượt cho tới khi đọc được.
  const [queue, setQueue] = useState<number[]>(() => b.items.map((_, i) => i));
  const [shown, setShown] = useState(false);
  const [first, setFirst] = useState<Record<number, boolean>>({});
  const cur = queue[0];
  const doneAll = queue.length === 0;
  const mark = (ok: boolean) => {
    const f = first[cur] === undefined ? { ...first, [cur]: ok } : first;
    setFirst(f);
    const rest = queue.slice(1);
    const next = ok ? rest : [...rest, cur];
    setQueue(next);
    setShown(false);
    if (!next.length) {
      const right = Object.values(f).filter(Boolean).length;
      tutor.report(b.id, Math.round((right / b.items.length) * 100));
    }
  };
  const right = Object.values(first).filter(Boolean).length;
  return (
    <div className={s.quiz}>
      <div className={s.quizTitle}>🈶 {b.title}</div>
      <div className={s.quizSub}>{b.note ?? 'Giống đề thi: chữ Hán KHÔNG có furigana. Đọc to trước, rồi bấm "Xem cách đọc" để kiểm tra. Câu chưa đọc được sẽ quay lại cuối lượt.'}</div>
      {doneAll ? (
        <div className={s.qItem}>
          <div className={s.score} style={{ display: 'inline-block' }}>Lần đầu đọc đúng {right}/{b.items.length} câu</div>
          <div className={s.qRow}>
            <button type="button" className={s.btnGhost} onClick={() => { setQueue(b.items.map((_, i) => i)); setFirst({}); }}><RotateCcw size={14} /> Làm lại</button>
          </div>
        </div>
      ) : (
        <div className={s.qItem}>
          <div className={s.quizSub}>Còn {queue.length} câu · câu {cur + 1}/{b.items.length}</div>
          <div className={s.rkText}>{shown ? <Inline text={b.items[cur].text} /> : <Kj text={bare(b.items[cur].text)} />}</div>
          {shown && (
            <>
              <div className={s.ro}>{b.items[cur].ro}</div>
              <div className={s.dVi}>{b.items[cur].vi}</div>
            </>
          )}
          <div className={s.qRow}>
            {!shown ? (
              <button type="button" className={s.btn} onClick={() => { setShown(true); play({ text: b.items[cur].text }); }}>
                <Eye size={15} /> Xem cách đọc + nghe
              </button>
            ) : (
              <>
                <button type="button" className={s.btn} onClick={() => mark(true)}>✓ Mình đọc được</button>
                <button type="button" className={s.btnGhost} onClick={() => mark(false)}>✗ Chưa đọc được</button>
                <button type="button" className={s.btnGhost} onClick={() => play({ text: b.items[cur].text })}><Volume2 size={14} /> Nghe lại</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function renderBlock2(b: Block, i: number) {
  switch (b.t) {
    case 'passage': return <Passage key={i} b={b} />;
    case 'listen': return <Listen key={b.id} b={b} />;
    case 'dialogue': return <Dialogue key={i} b={b} />;
    case 'essay': return <Essay key={b.id} b={b} />;
    case 'chart': return <Chart key={i} b={b} />;
    case 'speak': return <Speak key={b.id} b={b} />;
    case 'phatam': return <PhatAm key={b.id} b={b} />;
    case 'build': return <Build key={b.id} b={b} />;
    case 'readkanji': return <ReadKanji key={b.id} b={b} />;
    // Khoá CH (giọng zh-…): chữ giản thể ⇒ hanzi-writer; khoá Nhật giữ KanjiVG.
    case 'write': return ngonNguKhoa() === 'zh' ? <VietHanZh key={b.id} b={b} /> : <WriteBlock key={b.id} b={b} />;
    case 'hanlop': return <HanLop key={`hanlop-${b.bai}`} b={b} />;
    case 'chia': return <ChiaDongTu key="chia" />;
    case 'vocabAll': return <TraTuVung key="vocabAll" />;
    default: return null;
  }
}
