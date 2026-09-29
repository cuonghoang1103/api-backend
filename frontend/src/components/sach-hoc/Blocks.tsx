'use client';

import { Fragment, useState } from 'react';
import { Volume2, Check, X, RotateCcw, Sparkles, Lightbulb } from 'lucide-react';
import type { Block } from './types';
import { useTutor, useCourse } from './tutorContext';
import { play } from './audio';
import { renderBlock2 } from './Blocks2';
import s from './course.module.css';

/* ── Đọc to: xem audio.ts (mp3 giọng Anh từ máy chủ, lùi về giọng trình duyệt). ── */
export { play } from './audio';

function SpeakBtn({ text, label }: { text: string; label?: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={`${s.speak} ${on ? s.speakOn : ''}`}
      aria-label={label ?? `Nghe: ${text}`}
      onClick={() => {
        setOn(true);
        play({ text }, () => setOn(false));
      }}
    >
      <Volume2 size={15} />
    </button>
  );
}

/**
 * Mỗi chữ Hán một <span data-kj> — trang có thẻ chữ Hán (KanjiSheet) thì chạm vào
 * là mở thẻ chữ đó; trang khác (IELTS) không có chữ Hán nên trả nguyên chuỗi.
 */
const KJ_RUN = /([\u4e00-\u9fff\u3400-\u4dbf])/;
export function Kj({ text }: { text: string }) {
  if (!KJ_RUN.test(text)) return <>{text}</>;
  return <>{text.split(KJ_RUN).map((p, i) => (i % 2 ? <span key={i} data-kj={p}>{p}</span> : p ? <Fragment key={i}>{p}</Fragment> : null))}</>;
}

/** **đậm** và ~~gạch (câu sai)~~ — đủ cho nội dung soạn tay, không cần markdown đầy đủ. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|~~[^~]+~~|==[^=]+==|\{[^|}]+\|[^}]+\})/g);
  return (
    <>
      {parts.map((p, i) =>
        // Đệ quy: **đậm** hay ==dạ quang== có thể chứa {漢字|かな} bên trong.
        p.startsWith('**') ? <b key={i}><Inline text={p.slice(2, -2)} /></b>
          : p.startsWith('~~') ? <s key={i}><Inline text={p.slice(2, -2)} /></s>
            : p.startsWith('==') ? <mark key={i} className={s.hl}><Inline text={p.slice(2, -2)} /></mark>
              // {漢字|かな}: chữ Hán có furigana (ẩn/hiện theo nút của trang).
              : p.startsWith('{') && p.includes('|') ? (
                <ruby key={i} className={s.ruby}><Kj text={p.slice(1, p.indexOf('|'))} /><rt>{p.slice(p.indexOf('|') + 1, -1)}</rt></ruby>
              )
            : <Kj key={i} text={p} />,
      )}
    </>
  );
}

/**
 * Công thức tô màu theo thành phần câu, như sách ngữ pháp in màu:
 * S chủ ngữ · V động từ (V-ing, V-ed, V3, V(s/es), to V) · O tân ngữ · C bổ ngữ ·
 * A trạng ngữ (cả adv, Wh-) · N danh từ · adj tính từ · trợ động từ
 * (do/does/did, am/is/are/was/were/be, not, will, have/has).
 * Chỉ tô các KÝ HIỆU đứng riêng; phần còn lại (dấu +, ngoặc, chữ Việt) giữ nguyên.
 */
type RoleKey = 'S' | 'V' | 'O' | 'C' | 'A' | 'N' | 'adj' | 'aux';
const ROLE: Record<RoleKey, string> = { S: s.rS, V: s.rV, O: s.rO, C: s.rC, A: s.rA, N: s.rN, adj: s.rAdj, aux: s.rAux };
const ROLE_VI: Record<RoleKey, string> = {
  S: 'chủ ngữ', V: 'động từ', O: 'tân ngữ', C: 'bổ ngữ', A: 'trạng ngữ / trạng từ', N: 'danh từ', adj: 'tính từ', aux: 'trợ động từ, to be',
};
const ROLE_SHOW: Record<RoleKey, string> = { S: 'S', V: 'V', O: 'O', C: 'C', A: 'A', N: 'N', adj: 'adj', aux: 'do/be' };
const TOKEN = /(\bWh-|\bto V\b|\b[SVOCA](?:-ing|-ed|3|2)?(?:\([^)]*\))?(?![\w'-])|\bN(?:\([^)]*\))?(?![\w'-])|\badj\b|\badv\b|\b(?:[Dd]o|[Dd]oes|[Dd]id|[Dd]on't|[Dd]oesn't|[Dd]idn't|[Aa]m|[Ii]s|[Aa]re|[Ww]as|[Ww]ere|[Bb]e|not|[Ww]ill|won't|[Hh]as|[Hh]ave)\b(?!'))/;
function roleOf(p: string): RoleKey | null {
  if (p === 'Wh-' || p === 'adv') return 'A';
  if (p === 'to V') return 'V';
  if (p === 'adj') return 'adj';
  if (/^N(\(|$)/.test(p)) return 'N';
  if (/^[SVOCA](-ing|-ed|3|2)?(\(|$)/.test(p)) return p[0] as RoleKey;
  if (/^[A-Za-z']+$/.test(p) && TOKEN.test(p)) return 'aux';
  return null;
}
/** Các loại thành phần có trong một (vài) công thức — để chú thích chỉ ghi những gì thật sự xuất hiện. */
export function rolesIn(texts: string[]): RoleKey[] {
  const seen = new Set<RoleKey>();
  for (const t of texts) for (const p of t.split(TOKEN)) { const r = p && roleOf(p); if (r) seen.add(r); }
  return (Object.keys(ROLE) as RoleKey[]).filter((k) => seen.has(k));
}
const VI_CHARS = /[À-ỹđĐ]/;
export function Formula({ text }: { text: string }) {
  // Tách thành các mảnh {chữ, vai}; gộp "am / is / are" (cùng vai, nối bằng "/") thành MỘT ô màu.
  const raw = text.split(TOKEN).map((p, i) => ({ p, r: i % 2 ? roleOf(p) : null })).filter((x) => x.p);
  const parts: { p: string; r: RoleKey | null }[] = [];
  for (let i = 0; i < raw.length; i++) {
    const last = parts[parts.length - 1];
    if (last?.r && raw[i].r === null && /^\s*\/\s*$/.test(raw[i].p) && raw[i + 1]?.r === last.r) {
      last.p += '/' + raw[i + 1].p;
      i++;
      continue;
    }
    parts.push({ ...raw[i] });
  }
  return (
    <>
      {parts.map(({ p, r }, i) => {
        if (r) return <span key={i} className={`${s.role} ${ROLE[r]}`}>{p}</span>;
        // Chữ tiếng Việt trong công thức ("lý do 1", "không đếm") đọc bằng font thường, không phải font mã.
        if (VI_CHARS.test(p)) return <span key={i} className={s.fVi}>{p}</span>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
// Chỉ ô MỞ ĐẦU bằng ký hiệu thành phần câu mới là công thức ('bỏ y, + ies' thì không).
const looksLikeFormula = (c: string) => (/^(S|V|N|Do|Does|Did|Am|Is|Are|Was|Were)\b/.test(c) || c.startsWith("Wh-")) && / \+ /.test(c) && c.length < 60;

function FormulaLegend({ texts }: { texts: string[] }) {
  // Chú thích S/V/O là của ngữ pháp tiếng Anh — khoá tiếng Nhật không dùng.
  const ja = useCourse()?.voice.startsWith('ja');
  const roles = rolesIn(texts);
  if (ja || !roles.length) return null;
  return (
    <div className={s.legend}>
      {roles.map((r) => (
        <span key={r} className={s.legendItem}><span className={`${s.role} ${ROLE[r]}`}>{ROLE_SHOW[r]}</span> {ROLE_VI[r]}</span>
      ))}
    </div>
  );
}

/** Tô dạ quang chính từ đang học trong câu ví dụ (cả dạng chia: post → posts, posted). */
function HighlightWord({ sentence, word }: { sentence: string; word: string }) {
  const toks = word.split(/\s+/).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Bỏ -e/-y cuối để khớp create → created, study → studies.
  const stem = (t: string) => (t.length > 3 ? t.replace(/(e|y)$/i, '') : t);
  const re = new RegExp(`\\b(${toks.map((t) => `${stem(t)}\\w*`).join('\\s+')})\\b`, 'i');
  const m = sentence.match(re);
  if (!m || m.index == null) return <>{sentence}</>;
  return (
    <>
      {sentence.slice(0, m.index)}
      <mark className={s.hl}>{m[0]}</mark>
      {sentence.slice(m.index + m[0].length)}
    </>
  );
}

const POS_CLASS = (pos: string) =>
  pos.startsWith('phr') ? s.posPhr : pos.startsWith('adj') ? s.posAdj : pos.startsWith('adv') ? s.posAdv : pos.startsWith('v') ? s.posV : s.posN;

/** Ba loại ô ghi chú: cảnh báo lỗi, mẹo, ghi nhớ — mỗi loại một màu và một nhãn. */
function noteTone(title: string): 'warn' | 'tip' | 'info' {
  if (/sai|nhầm|cẩn thận|lỗi/i.test(title)) return 'warn';
  if (/mẹo|cách học|tips?/i.test(title)) return 'tip';
  return 'info';
}

/* ── So đáp án ── */
const JA = /[\u3040-\u30ff\u3400-\u9fff]/;
const norm = (x: string) => {
  // Tiếng Nhật: không có khoảng trắng giữa từ và kết câu bằng 。 — bỏ hết dấu
  // câu/khoảng trắng, đổi số & chữ toàn khổ (１２, ｋｇ) về nửa khổ.
  const t = x.normalize('NFKC');
  if (JA.test(t)) return t.replace(/[\s。、，．,.!?！？「」]/g, '').toLowerCase();
  return normEn(t);
};
const normEn = (x: string) =>
  x
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.?!]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const isRight = (given: string, answers: string[]) => answers.some((a) => norm(a) === norm(given));

/**
 * Ô 💡 Gợi ý của một câu — cách học người dùng thích nhất ở sách: đưa câu
 * tiếng Việt, gợi ý TỪ và CẤU TRÚC, để tự viết lại tiếng Anh. Nghĩa và phiên
 * âm của từ gợi ý tra thẳng từ danh sách từ vựng của khoá, nên một từ chỉ
 * phải soạn một lần.
 */
function Hint({ hint, grammar }: { hint?: string; grammar?: string }) {
  const index = useCourse()?.vocabIndex;
  const words = (hint ?? '').split(/\s*[,/]\s*/).map((w) => w.trim()).filter(Boolean);
  return (
    <div className={s.hintBox}>
      {words.length > 0 && (
        <div>
          <b>Từ vựng:</b>{' '}
          {words.map((w, i) => {
            const v = index?.get(w.toLowerCase());
            return (
              <span key={w}>
                {i > 0 && ' · '}
                <b className={s.hintWord}><Inline text={v?.w ?? w} /></b>
                {v ? <> ({v.pos}) {v.ipa} = <Inline text={v.vi} /></> : null}
              </span>
            );
          })}
        </div>
      )}
      {grammar && <div style={{ marginTop: words.length ? 4 : 0 }}><b>Ngữ pháp:</b> {grammar}</div>}
    </div>
  );
}

/* ── Bài điền / dịch ── */
function Quiz({ b }: { b: Extract<Block, { t: 'quiz' }> }) {
  const tutor = useTutor();
  const ja = useCourse()?.voice.startsWith('ja');
  const [vals, setVals] = useState<string[]>(() => b.items.map(() => ''));
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState<Record<number, boolean>>({});
  const [hints, setHints] = useState<Record<number, boolean>>({});
  const results = b.items.map((it, i) => isRight(vals[i], it.answers));
  const score = results.filter(Boolean).length;

  return (
    <div className={s.quiz}>
      <div className={s.quizTitle}>{b.title}</div>
      <div className={s.quizSub}>
        {b.kind === 'translate'
          ? `Gõ câu tiếng ${ja ? 'Nhật (kana hoặc kanji đều được)' : 'Anh'}. Dịch khác đáp án mẫu mà vẫn đúng? Bấm "Nhờ gia sư chấm".`
          : 'Gõ đáp án vào ô trống rồi bấm Kiểm tra.'}
      </div>
      {b.items.map((it, i) => {
        const state = !checked || !vals[i].trim() ? '' : results[i] ? s.inputGood : s.inputBad;
        return (
          <div key={i} className={s.qItem}>
            <div className={s.qText}>
              <span className={s.qNum}>{i + 1}</span>
              <Inline text={it.q} />
              {b.kind === 'fill' && it.hint && <span className={s.qHint}> ({it.hint})</span>}
              {(b.kind === 'translate' || b.grammar) && (it.hint || b.grammar) && (
                <button type="button" className={s.hintBtn} onClick={() => setHints({ ...hints, [i]: !hints[i] })}>
                  <Lightbulb size={13} /> Gợi ý
                </button>
              )}
            </div>
            {hints[i] && <Hint hint={b.kind === 'translate' ? it.hint : undefined} grammar={b.grammar} />}
            <div className={s.qRow}>
              <input
                className={`${s.input} ${state}`}
                value={vals[i]}
                onChange={(e) => {
                  const v = [...vals];
                  v[i] = e.target.value;
                  setVals(v);
                }}
                placeholder={b.kind === 'translate' ? `Câu tiếng ${ja ? 'Nhật' : 'Anh'} của bạn…` : 'Đáp án…'}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            {checked && vals[i].trim() && (
              <div className={s.feedback}>
                {results[i] ? (
                  <span className={s.good}><Check size={14} className="inline" /> Đúng</span>
                ) : (
                  <span>
                    <span className={s.bad}><X size={14} className="inline" /> Chưa khớp đáp án mẫu. </span>
                    {shown[i] ? (
                      <span className={s.muted}>Đáp án: <b>{it.answers[0]}</b> </span>
                    ) : (
                      <button type="button" className={s.linkBtn} onClick={() => setShown({ ...shown, [i]: true })}>Xem đáp án</button>
                    )}
                    {b.kind === 'translate' && (
                      <>
                        {' · '}
                        <button
                          type="button"
                          className={s.linkBtn}
                          onClick={() => tutor.ask({
                            label: `Chấm câu ${i + 1}`,
                            chu: it.q,
                            cauHoi: `Câu tiếng Việt: "${it.q}". Tôi dịch: "${vals[i]}". Đáp án mẫu: "${it.answers[0]}". Câu của tôi đúng chưa? Nếu sai thì sai ở đâu và sửa thế nào?`,
                          })}
                        >
                          <Sparkles size={12} className="inline" /> Nhờ gia sư chấm
                        </button>
                      </>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div className={s.quizFoot}>
        {checked ? <span className={s.score}>Đúng {score}/{b.items.length}</span> : <span />}
        <div className="flex gap-2">
          {checked && (
            <button type="button" className={s.btnGhost} onClick={() => { setVals(b.items.map(() => '')); setChecked(false); setShown({}); }}>
              <RotateCcw size={14} /> Làm lại
            </button>
          )}
          <button
            type="button"
            className={s.btn}
            onClick={() => {
              setChecked(true);
              tutor.report(b.id, Math.round((score / b.items.length) * 100));
            }}
          >
            Kiểm tra
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Trắc nghiệm ── */
function Mcq({ b }: { b: Extract<Block, { t: 'mcq' }> }) {
  const tutor = useTutor();
  const [pick, setPick] = useState<Record<number, number>>({});
  const choose = (i: number, j: number) => {
    const next = { ...pick, [i]: j };
    setPick(next);
    // Báo điểm khi làm xong câu cuối — điểm dở dang không nói lên gì.
    if (Object.keys(next).length === b.items.length) {
      const right = b.items.filter((it, k) => next[k] === it.correct).length;
      tutor.report(b.id, Math.round((right / b.items.length) * 100));
    }
  };
  const done = Object.keys(pick).length;
  const score = b.items.filter((it, i) => pick[i] === it.correct).length;
  return (
    <div className={s.quiz}>
      <div className={s.quizTitle}>{b.title}</div>
      <div className={s.quizSub}>Chọn một đáp án. Chọn xong sẽ thấy ngay đúng sai và lý do.</div>
      {b.items.map((it, i) => {
        const chosen = pick[i];
        return (
          <div key={i} className={s.qItem}>
            <div className={s.qText}><span className={s.qNum}>{i + 1}</span><Inline text={it.q} /></div>
            {it.options.map((o, j) => {
              const cls = chosen === undefined ? '' : j === it.correct ? s.optGood : j === chosen ? s.optBad : '';
              return (
                <button key={j} type="button" disabled={chosen !== undefined} className={`${s.option} ${cls}`} onClick={() => choose(i, j)}>
                  {String.fromCharCode(97 + j)}) <Inline text={o} />
                </button>
              );
            })}
            {chosen !== undefined && (
              <div className={`${s.feedback} ${chosen === it.correct ? s.good : s.bad}`}>
                {chosen === it.correct ? 'Đúng. ' : 'Chưa đúng. '}
                <span className={s.muted}><Inline text={it.why} /></span>
              </div>
            )}
          </div>
        );
      })}
      <div className={s.quizFoot}>
        <span className={s.score}>{done ? `Đúng ${score}/${done} câu đã làm` : ''}</span>
        {done > 0 && (
          <button type="button" className={s.btnGhost} onClick={() => setPick({})}><RotateCcw size={14} /> Làm lại</button>
        )}
      </div>
    </div>
  );
}

/* ── Nghe chép đánh vần ── */
function Dictation({ b }: { b: Extract<Block, { t: 'dictation' }> }) {
  const tutor = useTutor();
  const [vals, setVals] = useState<string[]>(() => b.items.map(() => ''));
  const [plays, setPlays] = useState<number[]>(() => b.items.map(() => 0));
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  // "Greenwood Road" nghe là cả cụm; chấm không phân biệt hoa thường và dấu cách thừa.
  const same = (a: string, c: string) => a.toLowerCase().replace(/\s+/g, ' ').trim() === c.toLowerCase();
  const grade = (i: number) => {
    const next = { ...checked, [i]: true };
    setChecked(next);
    const right = b.items.filter((it, k) => next[k] && same(vals[k], it.answer)).length;
    tutor.report(b.id, Math.round((right / b.items.length) * 100));
  };
  return (
    <div className={s.quiz}>
      <div className={s.quizTitle}>{b.title ?? 'Nghe và chép lại'}</div>
      <div className={s.quizSub}>Trong phòng thi bạn chỉ được nghe một lần. Hãy cố nghe ít lần nhất.</div>
      {b.items.map((it, i) => {
        const ok = checked[i] ? same(vals[i], it.answer) : null;
        return (
          <div key={i} className={s.qItem}>
            <div className={s.qRow} style={{ marginTop: 0 }}>
              <button
                type="button"
                className={s.btnGhost}
                onClick={() => {
                  const p = [...plays];
                  p[i] += 1;
                  setPlays(p);
                  play({ text: it.spell, kieu: 'danhvan', toc: 0.85 });
                }}
              >
                <Volume2 size={15} /> Nghe{plays[i] > 0 ? ` (${plays[i]})` : ''}
              </button>
              <span className={s.qHint}>{i + 1}. {it.label}</span>
            </div>
            <div className={s.qRow}>
              <input
                className={`${s.input} ${ok === null ? '' : ok ? s.inputGood : s.inputBad}`}
                value={vals[i]}
                onChange={(e) => {
                  const v = [...vals];
                  v[i] = e.target.value;
                  setVals(v);
                }}
                onKeyDown={(e) => e.key === 'Enter' && grade(i)}
                placeholder="Gõ lại điều bạn nghe…"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button type="button" className={s.btn} onClick={() => grade(i)}>Chấm</button>
            </div>
            {ok !== null && (
              <div className={`${s.feedback} ${ok ? s.good : s.bad}`}>
                {ok ? 'Chính xác.' : <>Chưa đúng. Đáp án: <b>{it.answer}</b></>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Từ vựng: danh sách + tự kiểm tra (che nghĩa / che từ) ── */
type VocabMode = 'all' | 'hideVi' | 'hideW';
function Masked({ on, onShow, children, label }: { on: boolean; onShow: () => void; children: React.ReactNode; label: string }) {
  if (!on) return <>{children}</>;
  return (
    <button type="button" className={s.mask} onClick={onShow} aria-label={label}>
      <span className={s.maskInner} aria-hidden>{children}</span>
      <span className={s.maskHint}>chạm để xem</span>
    </button>
  );
}
function Vocab({ b }: { b: Extract<Block, { t: 'vocab' }> }) {
  const lang = useCourse()?.voice.startsWith('ja') ? 'Nhật' : 'Anh';
  const [mode, setMode] = useState<VocabMode>('all');
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const pick = (m: VocabMode) => { setMode(m); setOpen({}); };
  const opened = Object.keys(open).length;
  return (
    <div className={s.vocab}>
      {b.items.length >= 4 && (
        <div className={s.vocabBar}>
          <span className={s.vocabBarLabel}>Tự kiểm tra:</span>
          {([['all', 'Xem đủ'], ['hideVi', 'Che nghĩa'], ['hideW', `Che từ tiếng ${lang}`]] as [VocabMode, string][]).map(([m, l]) => (
            <button key={m} type="button" className={`${s.chip} ${mode === m ? s.chipOn : ''}`} aria-pressed={mode === m} onClick={() => pick(m)}>{l}</button>
          ))}
          {mode !== 'all' && <span className={s.vocabBarCount}>đã lật {opened}/{b.items.length}</span>}
        </div>
      )}
      {mode !== 'all' && (
        <div className={s.vocabHow}>
          {mode === 'hideVi' ? `Nhìn từ tiếng ${lang}, nói to nghĩa tiếng Việt, rồi chạm vào ô mờ để kiểm tra.` : `Nhìn nghĩa tiếng Việt, nói to (hoặc viết ra giấy) từ tiếng ${lang}, rồi chạm để kiểm tra.`}
        </div>
      )}
      {b.items.map((v, k) => {
        const hideVi = mode === 'hideVi' && !open[k];
        const hideW = mode === 'hideW' && !open[k];
        const show = () => setOpen((o) => ({ ...o, [k]: true }));
        return (
          <div key={v.w} className={s.word}>
            {hideW ? <span className={s.speakGhost} aria-hidden /> : <SpeakBtn text={v.w} />}
            <div className="min-w-0">
              <div className={s.wordHead}>
                <Masked on={hideW} onShow={show} label={`Hiện từ tiếng ${lang}`}>
                  <span className={s.wordW}><Inline text={v.w} /></span>
                </Masked>
                <span className={`${s.wordPos} ${POS_CLASS(v.pos)}`}>{v.pos}</span>
                {!hideW && <span className={s.wordIpa}>{v.ipa}</span>}
                <Masked on={hideVi} onShow={show} label="Hiện nghĩa">
                  <span className={s.wordVi}><Inline text={v.vi} /></span>
                </Masked>
              </div>
              {!hideW && (
                <div className={s.wordEx}>
                  <button type="button" className={s.linkBtn} style={{ fontWeight: 400, color: 'inherit', textAlign: 'left' }} onClick={() => play({ text: v.ex })}>
                    {v.ex.includes('{') ? <Inline text={v.ex} /> : <HighlightWord sentence={v.ex} word={v.w} />}
                  </button>
                </div>
              )}
              {v.exRo && !hideW && <div className={s.ro}>{v.exRo}</div>}
              {!hideVi && <div className={s.wordExVi}><Inline text={v.exVi} /></div>}
              {v.more && !hideVi && !hideW && <div className={s.wordMore}><span className={s.wordMoreTag}>＋</span><span className="min-w-0"><Inline text={v.more} /></span></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderBlock(b: Block, i: number) {
        switch (b.t) {
          case 'h':
            return <h2 key={i} className={s.h2}><span className={s.pill}>{b.text}</span></h2>;
          case 'p':
            return <p key={i} className={s.p}><Inline text={b.text} /></p>;
          case 'patterns':
            // Bảng hai cột "Công thức | Ví dụ" như sách — mắt đi theo hàng ngang,
            // công thức bên trái luôn nằm cạnh đúng ví dụ của nó.
            return (
              <div key={i} className={s.tableWrap}>
                <FormulaLegend texts={b.rows.map((r) => r.formula)} />
                <table className={`${s.table} ${s.stackTable}`}>
                  <thead><tr><th>Công thức (Formula)</th><th>Ví dụ</th></tr></thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r.formula}>
                        <td className={`${s.cell} ${s.formulaCell}`}>
                          <span className={s.formula}>{JA.test(r.formula) || r.formula.includes('{') ? <Inline text={r.formula} /> : <Formula text={r.formula} />}</span>
                          <span className={s.formulaVi}>{r.vi}</span>
                        </td>
                        <td className={s.cell}>
                          {r.examples.map((e, j) => (
                            <div key={e.en} className={s.exRow} style={j === 0 ? { marginTop: 0 } : undefined}>
                              <SpeakBtn text={e.en} />
                              <div>
                                <div className={s.exEn}><Inline text={e.en} /></div>
                                {e.ro && <div className={s.ro}>{e.ro}</div>}
                                <div className={s.exVi}><Inline text={e.vi} /></div>
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'table': {
            // Bảng ≥ 3 cột chữ dài: trên điện thoại xếp mỗi hàng thành một thẻ (nhãn cột ở đầu mỗi ô)
            // thay vì ép cột cuối còn một chữ mỗi dòng. Bảng ô ngắn (bảng đại từ…) vẫn cuộn ngang.
            const cells = b.rows.flat();
            const avg = cells.reduce((n, c) => n + c.replace(/\*\*|==|~~/g, '').length, 0) / Math.max(1, cells.length);
            const stack = b.head.length >= 3 && avg > 22;
            return (
              <div key={i} className={s.tableWrap}>
                {b.caption && <div className={s.caption}>{b.caption}</div>}
                <table className={`${s.table} ${stack ? s.cardTable : ''}`}>
                  <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td key={ci} className={`${s.cell} ${ci === 0 ? s.cellFirst : ''}`} data-label={stack && ci > 0 ? b.head[ci] : undefined}>
                            {looksLikeFormula(c) ? <span className={s.formula}><Formula text={c} /></span> : <Inline text={c} />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          case 'note':
            return (
              <div key={i} className={`${s.note} ${s[`note_${noteTone(b.title)}`]}`}>
                {noteTone(b.title) === 'warn' ? (
                  <span className={s.watch} aria-hidden>Watch<br />out!</span>
                ) : (
                  <span className={s.noteIcon} aria-hidden>{noteTone(b.title) === 'tip' ? '💡' : '📌'}</span>
                )}
                <div className="min-w-0">
                <div className={s.noteTitle}>{b.title}</div>
                <ul className={s.noteList}>
                  {b.items.map((it, j) => <li key={j} className={s.noteItem}><Inline text={it} /></li>)}
                </ul>
                </div>
              </div>
            );
          case 'examples':
            return (
              <div key={i} className={s.pattern} style={{ margin: '16px 0' }}>
                {b.items.map((e, j) => (
                  <div key={e.en} className={s.exRow} style={j === 0 ? { marginTop: 0 } : undefined}>
                    <SpeakBtn text={e.en} />
                    <div>
                      <div className={s.exEn}><Inline text={e.en} /></div>
                      {e.ro && <div className={s.ro}>{e.ro}</div>}
                      <div className={s.exVi}><Inline text={e.vi} /></div>
                    </div>
                  </div>
                ))}
              </div>
            );
          case 'vocab':
            return <Vocab key={i} b={b} />;
          case 'recap':
            return (
              <div key={i} className={s.recap}>
                <div className={s.recapTitle}><span aria-hidden>🎯</span> {b.title ?? 'Tóm tắt nhanh'}</div>
                <ol className={s.recapList}>
                  {b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}
                </ol>
              </div>
            );
          case 'rule':
            return (
              <div key={i} className={s.rule}>
                <span className={s.ruleTag}>Công thức 1 dòng</span>
                <span className={`${s.formula} ${s.ruleFormula}`}><Formula text={b.formula} /></span>
                {b.vi && <span className={s.ruleVi}><Inline text={b.vi} /></span>}
              </div>
            );
          case 'alphabet':
            return (
              <div key={i} className={s.abc}>
                {b.groups.map((g) => (
                  <div key={g.sound} className={s.abcRow}>
                    <span className={s.abcSound}>{g.sound}</span>
                    {g.letters.map((x) => (
                      <button key={x.l} type="button" className={s.letter} onClick={() => play({ text: x.l, kieu: 'danhvan' })} aria-label={`Nghe chữ ${x.l}`}>
                        <span className={s.letterL}>{x.l}</span>
                        <span className={s.letterIpa}>{x.ipa}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            );
          case 'dictation':
            return <Dictation key={b.id} b={b} />;
          case 'quiz':
            return <Quiz key={b.id} b={b} />;
          case 'mcq':
            return <Mcq key={b.id} b={b} />;
          default:
            return renderBlock2(b, i);
        }
}

const IS_EXERCISE = new Set(['vocabAll', 'quiz', 'mcq', 'dictation', 'listen', 'essay', 'speak', 'passage', 'build', 'readkanji', 'write']);

/**
 * `framed` (bài ngữ pháp): mỗi mục bắt đầu bằng tiêu đề được ĐÓNG KHUNG cùng
 * công thức và ví dụ bên dưới nó — người học nhìn là biết một điểm ngữ pháp
 * bắt đầu và kết thúc ở đâu, như khung trong sách. Bài tập đứng ngoài khung.
 */
export function Blocks({ blocks, framed = false }: { blocks: Block[]; framed?: boolean }) {
  if (!framed) return <>{blocks.map(renderBlock)}</>;
  const out: React.ReactNode[] = [];
  let box: { title: string; items: React.ReactNode[] } | null = null;
  const close = () => {
    if (!box) return;
    out.push(
      <section key={`box-${out.length}`} className={s.gbox}>
        <div className={s.gboxTitle}>{box.title}</div>
        {box.items}
      </section>,
    );
    box = null;
  };
  blocks.forEach((b, i) => {
    if (b.t === 'h') {
      close();
      box = { title: b.text, items: [] };
    } else if (IS_EXERCISE.has(b.t)) {
      close();
      out.push(renderBlock(b, i));
    } else if (box) {
      (box as { items: React.ReactNode[] }).items.push(renderBlock(b, i));
    } else {
      out.push(renderBlock(b, i));
    }
  });
  close();
  return <>{out}</>;
}
