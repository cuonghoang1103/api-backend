'use client';

import { Fragment, useState } from 'react';
import { Volume2, Check, X, RotateCcw, Sparkles, Lightbulb } from 'lucide-react';
import { VOCAB_INDEX, type Block } from './data';
import { useTutor } from './tutorContext';
import s from './ielts.module.css';

/* ── Đọc to ─────────────────────────────────────────────────────────────
 * Không dùng useSpeak của khoá cũ: đánh vần cần XẾP HÀNG nhiều câu ngắn
 * ("W", "A", "L"...). Gộp thành một chuỗi "W, A, L" thì giọng máy đọc chữ
 * "A" như mạo từ /ə/ — đúng cái bẫy mà bài nghe đang dạy tránh. Mỗi chữ một
 * utterance riêng thì nó đọc tên chữ cái.
 */
function enVoice(): SpeechSynthesisVoice | undefined {
  const v = window.speechSynthesis.getVoices();
  return v.find((x) => x.lang === 'en-GB') || v.find((x) => x.lang === 'en-US') || v.find((x) => x.lang?.startsWith('en'));
}

export function speak(parts: string | string[], rate = 0.9, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const list = Array.isArray(parts) ? parts : [parts];
  const voice = enVoice();
  list.forEach((text, i) => {
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || 'en-GB';
    u.rate = rate;
    if (i === list.length - 1 && onEnd) {
      u.onend = onEnd;
      u.onerror = onEnd;
    }
    synth.speak(u);
  });
}

function SpeakBtn({ text, label }: { text: string; label?: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={`${s.speak} ${on ? s.speakOn : ''}`}
      aria-label={label ?? `Nghe: ${text}`}
      onClick={() => {
        setOn(true);
        speak(text, 0.9, () => setOn(false));
      }}
    >
      <Volume2 size={15} />
    </button>
  );
}

/** **đậm** và ~~gạch (câu sai)~~ — đủ cho nội dung soạn tay, không cần markdown đầy đủ. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|~~[^~]+~~|==[^=]+==)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b>
          : p.startsWith('~~') ? <s key={i}>{p.slice(2, -2)}</s>
            : p.startsWith('==') ? <mark key={i} className={s.hl}>{p.slice(2, -2)}</mark>
            : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

/**
 * Công thức tô màu theo thành phần câu, như sách ngữ pháp in màu:
 * S chủ ngữ · V động từ · O tân ngữ · C bổ ngữ · A trạng ngữ · do/does trợ động từ.
 * Chỉ tô các KÝ HIỆU; phần còn lại (dấu +, ngoặc, chữ Việt) giữ nguyên.
 */
const ROLE: Record<string, string> = { S: s.rS, V: s.rV, O: s.rO, C: s.rC, A: s.rA, Wh: s.rA };
const AUX = /^(do|does|don't|doesn't|am|is|are|not)$/i;
export function Formula({ text }: { text: string }) {
  const parts = text.split(/(\bWh-|\b[SVOCA]\b(?:\([^)]*\))?|\b(?:[Dd]o|[Dd]oes|[Dd]on't|[Dd]oesn't)\b)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        const head = p.startsWith('Wh') ? 'Wh' : p[0];
        if (/^(Wh-|[SVOCA](\(|$))/.test(p) && ROLE[head]) return <span key={i} className={`${s.role} ${ROLE[head]}`}>{p}</span>;
        if (AUX.test(p)) return <span key={i} className={`${s.role} ${s.rAux}`}>{p}</span>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
// Chỉ ô MỞ ĐẦU bằng ký hiệu thành phần câu mới là công thức ('bỏ y, + ies' thì không).
const looksLikeFormula = (c: string) => (/^(S|V|Do|Does)\b/.test(c) || c.startsWith("Wh-")) && / \+ /.test(c) && c.length < 48;

function FormulaLegend() {
  return (
    <div className={s.legend}>
      <span className={`${s.role} ${s.rS}`}>S</span> chủ ngữ
      <span className={`${s.role} ${s.rV}`}>V</span> động từ
      <span className={`${s.role} ${s.rO}`}>O</span> tân ngữ
      <span className={`${s.role} ${s.rC}`}>C</span> bổ ngữ
      <span className={`${s.role} ${s.rA}`}>A</span> trạng ngữ
      <span className={`${s.role} ${s.rAux}`}>do</span> trợ động từ
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
const norm = (x: string) =>
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
  const words = (hint ?? '').split(/\s*[,/]\s*/).map((w) => w.trim()).filter(Boolean);
  return (
    <div className={s.hintBox}>
      {words.length > 0 && (
        <div>
          <b>Từ vựng:</b>{' '}
          {words.map((w, i) => {
            const v = VOCAB_INDEX.get(w.toLowerCase());
            return (
              <span key={w}>
                {i > 0 && ' · '}
                <b className={s.hintWord}>{w}</b>
                {v ? <> ({v.pos}) {v.ipa} = {v.vi}</> : null}
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
        {b.kind === 'translate' ? 'Gõ câu tiếng Anh. Dịch khác đáp án mẫu mà vẫn đúng? Bấm "Nhờ gia sư chấm".' : 'Gõ đáp án vào ô trống rồi bấm Kiểm tra.'}
      </div>
      {b.items.map((it, i) => {
        const state = !checked || !vals[i].trim() ? '' : results[i] ? s.inputGood : s.inputBad;
        return (
          <div key={i} className={s.qItem}>
            <div className={s.qText}>
              <span className={s.qNum}>{i + 1}</span>
              {it.q}
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
                placeholder={b.kind === 'translate' ? 'Câu tiếng Anh của bạn…' : 'Đáp án…'}
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
            <div className={s.qText}><span className={s.qNum}>{i + 1}</span>{it.q}</div>
            {it.options.map((o, j) => {
              const cls = chosen === undefined ? '' : j === it.correct ? s.optGood : j === chosen ? s.optBad : '';
              return (
                <button key={j} type="button" disabled={chosen !== undefined} className={`${s.option} ${cls}`} onClick={() => choose(i, j)}>
                  {String.fromCharCode(97 + j)}) {o}
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
                  speak(it.spell.split(/\s*,\s*/), 0.8);
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
                <FormulaLegend />
                <table className={`${s.table} ${s.stackTable}`}>
                  <thead><tr><th>Công thức (Formula)</th><th>Ví dụ</th></tr></thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r.formula}>
                        <td className={`${s.cell} ${s.formulaCell}`}>
                          <span className={s.formula}><Formula text={r.formula} /></span>
                          <span className={s.formulaVi}>{r.vi}</span>
                        </td>
                        <td className={s.cell}>
                          {r.examples.map((e, j) => (
                            <div key={e.en} className={s.exRow} style={j === 0 ? { marginTop: 0 } : undefined}>
                              <SpeakBtn text={e.en} />
                              <div>
                                <div className={s.exEn}>{e.en}</div>
                                <div className={s.exVi}>{e.vi}</div>
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
          case 'table':
            return (
              <div key={i} className={s.tableWrap}>
                {b.caption && <div className={s.caption}>{b.caption}</div>}
                <table className={s.table}>
                  <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td key={ci} className={`${s.cell} ${ci === 0 ? s.cellFirst : ''}`}>
                            {looksLikeFormula(c) ? <span className={s.formula}><Formula text={c} /></span> : <Inline text={c} />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
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
                      <div className={s.exEn}>{e.en}</div>
                      <div className={s.exVi}>{e.vi}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          case 'vocab':
            return (
              <div key={i} className={s.vocab}>
                {b.items.map((v) => (
                  <div key={v.w} className={s.word}>
                    <SpeakBtn text={v.w} />
                    <div className="min-w-0">
                      <div className={s.wordHead}>
                        <span className={s.wordW}>{v.w}</span>
                        <span className={`${s.wordPos} ${POS_CLASS(v.pos)}`}>{v.pos}</span>
                        <span className={s.wordIpa}>{v.ipa}</span>
                        <span className={s.wordVi}>{v.vi}</span>
                      </div>
                      <div className={s.wordEx}>
                        <button type="button" className={s.linkBtn} style={{ fontWeight: 400, color: 'inherit', textAlign: 'left' }} onClick={() => speak(v.ex)}>
                          <HighlightWord sentence={v.ex} word={v.w} />
                        </button>
                      </div>
                      <div className={s.wordExVi}>{v.exVi}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          case 'alphabet':
            return (
              <div key={i} className={s.abc}>
                {b.groups.map((g) => (
                  <div key={g.sound} className={s.abcRow}>
                    <span className={s.abcSound}>{g.sound}</span>
                    {g.letters.map((x) => (
                      <button key={x.l} type="button" className={s.letter} onClick={() => speak(x.l, 0.8)} aria-label={`Nghe chữ ${x.l}`}>
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
        }
}

const IS_EXERCISE = new Set(['quiz', 'mcq', 'dictation']);

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
