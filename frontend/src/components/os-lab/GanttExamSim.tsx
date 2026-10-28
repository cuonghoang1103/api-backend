'use client';
/**
 * Chế độ THI cho lập lịch CPU (bài 16.3): người học tô biểu đồ Gantt và điền finish/turnaround/waiting, mô phỏng chấm
 * từng ô, gọi tên quy ước bị hiểu sai, rồi phát lời giải từng thời điểm. Engine: engine/gantt.ts (khớp osgcalc.py c163
 * và engine/scheduler.ts).
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPE } from 'react';
import { DRILLS, fracText, grade, perfect, POLICY_NAME, randomDrill, SLIP_TEXT, solve, type GAnswer, type GConv, type GGrade, type GJob, type GPolicy } from './engine/gantt';
import { Controls, Explain, Frame, Kpi, Seg, colorOf, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useLabRecord, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab3.module.css';

const PRESET: Record<string, { drill: string; policy: GPolicy; quantum?: number }> = {
  s1: { drill: 's1', policy: 'fcfs' },
  sjf: { drill: 's2', policy: 'sjf' },
  srtf: { drill: 's2', policy: 'srtf' },
  rr: { drill: 's2', policy: 'rr', quantum: 3 },
  prio: { drill: 's3', policy: 'prio-p' },
  random: { drill: 'random', policy: 'rr' },
};
type Brush = string; // id việc | 'idle' | 'erase'
type RowIn = Record<string, { finish: string; turnaround: string; waiting: string }>;
const num = (v: string) => (v.trim() === '' ? undefined : Number(v.replace(',', '.')));

export default function GanttExamSim({ lang = 'vi', preset = 's1' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const P0 = PRESET[preset] ?? PRESET.s1;
  const record = useLabRecord();
  const [drillKey, setDrillKey] = useState(P0.drill);
  const [seed, setSeed] = useState(() => (record ? 7 : 1 + Math.floor(Math.random() * 900)));
  const [policy, setPolicy] = useState<GPolicy>(P0.policy);
  const base = useMemo(() => (drillKey === 'random' ? randomDrill(seed, 'rr') : DRILLS[drillKey]), [drillKey, seed]);
  const [quantum, setQuantum] = useState(P0.quantum ?? base.conv.quantum);
  const [hiBig, setHiBig] = useState(base.conv.hiBig);
  const [mode, setMode] = useState<'exam' | 'solution'>('exam');
  const jobs: GJob[] = base.jobs;
  const conv: GConv = useMemo(() => ({ quantum, hiBig, rrNewFirst: true }), [quantum, hiBig]);
  const R = useMemo(() => solve(jobs, policy, conv), [jobs, policy, conv]);
  const [cells, setCells] = useState<Array<string | null | undefined>>([]);
  const [rows, setRows] = useState<RowIn>({});
  const [avgW, setAvgW] = useState('');
  const [avgT, setAvgT] = useState('');
  const [graded, setGraded] = useState<GGrade | null>(null);
  const [brush, setBrush] = useState<Brush>(jobs[0].id);
  const p = usePlayer(R.decisions.length, 1300);
  const i = Math.min(p.i, R.decisions.length - 1);
  const D = R.decisions[i];
  useOwnStepSound();

  const resetAnswer = () => { setCells(Array(R.end).fill(undefined)); setRows({}); setAvgW(''); setAvgT(''); setGraded(null); };
  // đổi đề / chính sách / quy ước ⇒ bài làm cũ vô nghĩa
  const sig = `${drillKey}|${seed}|${policy}|${quantum}|${hiBig}`;
  const lastSig = useRef('');
  useEffect(() => {
    if (lastSig.current === sig) return;
    lastSig.current = sig;
    resetAnswer(); p.reset(); setBrush(jobs[0].id);
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps

  const prevI = useRef(p.i);
  useEffect(() => {
    if (p.i !== prevI.current && mode === 'solution') labSfx(D.finished ? 'done' : D.preempted ? 'pop' : R.rows.some((r) => r.finish === D.t && D.t > 0) ? 'hit' : 'blip-exec');
    else if (p.i !== prevI.current) labSfx('tick');
    prevI.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDrill = (k: string) => {
    const d = k === 'random' ? randomDrill(seed, 'rr') : DRILLS[k];
    setDrillKey(k); setQuantum(d.conv.quantum); setHiBig(d.conv.hiBig); labSfx('tap');
  };
  const newRandom = () => { const ns = 1 + Math.floor(Math.random() * 900); const d = randomDrill(ns, 'rr'); setSeed(ns); setDrillKey('random'); setQuantum(d.conv.quantum); setHiBig(d.conv.hiBig); labSfx('whoosh'); };

  const answer = (): GAnswer => ({
    cells,
    rows: Object.fromEntries(Object.entries(rows).map(([id, r]) => [id, { finish: num(r.finish), turnaround: num(r.turnaround), waiting: num(r.waiting) }])),
    avgWaiting: num(avgW), avgTurnaround: num(avgT),
  });
  const check = () => {
    const g = grade(jobs, policy, conv, answer());
    setGraded(g);
    labSfx(g.score === g.max ? 'done' : g.score >= g.max * 0.7 ? 'step-ok' : 'wrong');
  };
  const fill = (A: GAnswer) => {
    setCells([...A.cells]);
    setRows(Object.fromEntries(Object.entries(A.rows).map(([id, r]) => [id, { finish: String(r.finish ?? ''), turnaround: String(r.turnaround ?? ''), waiting: String(r.waiting ?? '') }])));
    setAvgW(A.avgWaiting === undefined ? '' : String(A.avgWaiting)); setAvgT(A.avgTurnaround === undefined ? '' : String(A.avgTurnaround));
    setGraded(null);
  };
  const paintRange = (id: string | null | undefined, from: number, to: number) => {
    setCells((cs) => { const n = [...cs]; for (let k = Math.max(0, from); k < Math.min(R.end, to); k++) n[k] = id; return n; });
    setGraded(null);
  };
  const brushVal = (b: Brush) => (b === 'erase' ? undefined : b === 'idle' ? null : b);

  // tô bằng kéo: pointerdown bắt đầu, di chuyển tô tiếp ô dưới con trỏ (elementFromPoint — chạy cả trên cảm ứng)
  const painting = useRef(false);
  const lastCell = useRef(-1);
  const cellAt = (e: RPE) => {
    const el = (document.elementFromPoint?.(e.clientX, e.clientY) as HTMLElement | null)?.closest('[data-cell]') as HTMLElement | null;
    return el ? Number(el.dataset.cell) : -1;
  };
  const paintAt = (k: number) => { if (k < 0 || k === lastCell.current) return; lastCell.current = k; paintRange(brushVal(brush), k, k + 1); labSfx('tap'); };

  useLabBridge('gx', {
    drill: drillKey, policy, quantum, hiBig, mode, i: p.i, atEnd: p.atEnd,
    filled: cells.filter((x) => x !== undefined).length, end: R.end,
    graded: !!graded, score: graded?.score ?? -1, max: graded?.max ?? -1, full: !!graded && graded.score === graded.max,
    slips: graded ? graded.slips.join(',') : '', avgWait: Math.round(R.avg.waiting * 100) / 100,
  }, {
    drill: (v) => loadDrill(String(v)), policy: (v) => { setPolicy(v as GPolicy); labSfx('tap'); }, quantum: (v) => setQuantum(Number(v)),
    hiBig: (v) => setHiBig(!!v), mode: (v) => { setMode(v as 'exam' | 'solution'); p.reset(); labSfx('tap'); },
    paint: (v) => { const [id, a, b] = String(v).split(':'); paintRange(id === 'idle' ? null : id, Number(a), Number(b)); labSfx('tap'); },
    fill: () => fill(perfect(jobs, policy, conv)),
    // bài làm SAI nhất quán: biểu đồ + bảng tính theo quy ước bị hiểu nhầm (để tour cho thấy một lỗi lan ra cả bảng)
    wrong: (v) => fill(perfect(jobs, policy, v === 'rr-order' ? { ...conv, rrNewFirst: false } : v === 'prio-dir' ? { ...conv, hiBig: !conv.hiBig } : conv)),
    check: () => check(), clear: () => { resetAnswer(); labSfx('off'); },
  });

  const N = R.end;
  const gridVars = { '--gx-n': N, '--gx-m': Math.min(N, 12) } as CSSProperties;
  const color = (id: string | null | undefined) => (id ? colorOf(jobs.findIndex((j) => j.id === id)) : undefined);
  const showT = mode === 'solution' ? D.t : -1;
  const arrivalsAt = (k: number) => jobs.filter((j) => j.arrival === k).map((j) => j.id);
  const isPrio = policy === 'prio' || policy === 'prio-p';
  const doneBy = (id: string) => R.rows.find((r) => r.id === id)!.finish <= D.t;

  const explain = () => {
    if (mode === 'solution') return <><b className={s.mono}>t = {D.t}</b> — {t(D.en, D.vi)}{D.finished && <> {t('Averages:', 'Trung bình:')} <b className={s.mono}>{t('turnaround', 'hoàn thành')} {fracText(R.sum.turnaround, jobs.length)}</b>, <b className={s.mono}>{t('waiting', 'chờ')} {fracText(R.sum.waiting, jobs.length)}</b>.</>}</>;
    if (graded) {
      if (graded.score === graded.max) return <>{t(`Full marks: ${graded.score}/${graded.max}. Now press "Worked solution" and check your reasoning at every time step.`, `Đúng hết: ${graded.score}/${graded.max}. Giờ bấm "Lời giải" và đối chiếu lập luận của bạn ở từng thời điểm.`)}</>;
      return <>{t(`${graded.score}/${graded.max}. Red cells show the right job in the corner.`, `${graded.score}/${graded.max}. Ô đỏ có ghi việc đúng ở góc.`)} {graded.slips.length ? graded.slips.map((sl) => <span key={sl}> ⚠ {t(SLIP_TEXT[sl][0], SLIP_TEXT[sl][1])}</span>) : t('Compare with the worked solution, step by step.', 'Hãy so với lời giải từng bước.')}</>;
    }
    const arr = arrivalsAt(D.t);
    return <><b className={s.mono}>t = {D.t}</b> — {arr.length ? t(`${arr.join(', ')} arrive${arr.length > 1 ? '' : 's'} now. Who runs from ${D.t} to ${D.t + 1}? Paint that cell.`, `${arr.join(', ')} đến lúc này. Ai chạy từ ${D.t} tới ${D.t + 1}? Tô ô đó.`) : t(`Nobody new arrives. Who runs from ${D.t} to ${D.t + 1}?`, `Không ai mới đến. Ai chạy từ ${D.t} tới ${D.t + 1}?`)} {t('Pick a job below, then tap or drag across the cells.', 'Chọn một việc bên dưới rồi chạm hoặc kéo qua các ô.')}</>;
  };
  const tone = mode === 'solution' ? (D.finished ? 'ok' : D.preempted ? 'warn' : undefined) : graded ? (graded.score === graded.max ? 'ok' : 'bad') : undefined;

  return (
    <Frame badge={t('OS lab · exam', 'Phòng lab OS · luyện thi')} title={t('Gantt exam: fill it in, get it graded', 'Luyện đề Gantt: tự điền, được chấm')}
      sub={t('The OSG202 scheduling question, cell by cell — with the conventions the exam expects', 'Câu lập lịch của đề OSG202, từng ô một — đúng quy ước đề chờ')}>
      <div className={s.bar} data-tour="gx-drill">
        <span className={s.lbl}>{t('Question', 'Đề')}
          <select value={drillKey} onChange={(e) => loadDrill(e.target.value)}>
            {Object.values(DRILLS).map((d) => <option key={d.key} value={d.key}>{t(d.en, d.vi)}</option>)}
            <option value="random">{t(`Random exam #${seed}`, `Đề ngẫu nhiên #${seed}`)}</option>
          </select>
        </span>
        <button type="button" className={s.btn} onClick={newRandom}>🎲 {t('New exam', 'Đề mới')}</button>
      </div>
      <div className={s.bar} data-tour="gx-policy">
        <Seg value={policy} options={(['fcfs', 'sjf', 'srtf', 'rr', 'prio', 'prio-p'] as GPolicy[]).map((k) => [k, k === 'prio' ? 'Prio' : k === 'prio-p' ? 'Prio-P' : k.toUpperCase()])} onChange={(v) => { setPolicy(v); labSfx('tap'); }} />
        {policy === 'rr' && <span className={s.lbl}>quantum <input type="number" min={1} max={8} value={quantum} onChange={(e) => setQuantum(Math.max(1, Math.min(8, Number(e.target.value) || 1)))} /></span>}
        {isPrio && <Seg label={t('higher priority =', 'ưu tiên cao =')} value={hiBig ? 'big' : 'small'} options={[['small', t('smaller number', 'số nhỏ')], ['big', t('bigger number', 'số lớn')]]} onChange={(v) => setHiBig(v === 'big')} />}
      </div>
      <div className={s.bar} data-tour="gx-mode">
        <Seg value={mode} options={[['exam', t('✍️ Do it myself', '✍️ Tự làm')], ['solution', t('📖 Worked solution', '📖 Lời giải')]]} onChange={(v) => { setMode(v); p.reset(); labSfx('tap'); }} />
        <span className={s.small}>{t(POLICY_NAME[policy][0], POLICY_NAME[policy][1])}{policy === 'rr' ? `, q = ${quantum}` : ''}{isPrio ? `, ${hiBig ? t('bigger = higher', 'số lớn = cao') : t('smaller = higher', 'số nhỏ = cao')}` : ''}</span>
      </div>
      <Controls p={p} lang={lang} label={`t = ${D.t}`} />
      <Explain tone={tone}>{explain()}</Explain>

      <div className={c.cols} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="gx-jobs">
            <div className={s.panelTitle}>{t('The question', 'Đề bài')}</div>
            <div className={s.scrollX}>
              <table className={cx(s.tbl, s.compact)}>
                <thead><tr><th>{t('job', 'việc')}</th><th className={s.num}>{t('arrival', 'đến')}</th><th className={s.num}>{t('burst', 'CPU')}</th>{isPrio && <th className={s.num}>{t('priority', 'ưu tiên')}</th>}</tr></thead>
                <tbody>{jobs.map((j, k) => <tr key={j.id} className={mode === 'solution' && D.running === j.id ? s.hl : undefined}><td><b style={{ color: colorOf(k) }}>■</b> {j.id}</td><td className={s.num}>{j.arrival}</td><td className={s.num}>{j.burst}</td>{isPrio && <td className={s.num}>{j.prio}</td>}</tr>)}</tbody>
              </table>
            </div>
          </div>

          {mode === 'exam' ? (
            <div className={s.panel} data-tour="gx-grid">
              <div className={s.panelTitle}>{t(`Your Gantt chart (${N} time units)`, `Biểu đồ Gantt của bạn (${N} đơn vị thời gian)`)}</div>
              <div className={c.brushes} data-tour="gx-brush" role="group" aria-label={t('Brush', 'Bút tô')}>
                {jobs.map((j, k) => <button type="button" key={j.id} className={c.brush} style={{ background: colorOf(k) }} aria-pressed={brush === j.id} onClick={() => { setBrush(j.id); labSfx('tap'); }}>{j.id}</button>)}
                <button type="button" className={cx(c.brush, c.brushIdle)} aria-pressed={brush === 'idle'} onClick={() => setBrush('idle')}>{t('idle', 'rảnh')}</button>
                <button type="button" className={cx(c.brush, c.brushErase)} aria-pressed={brush === 'erase'} onClick={() => setBrush('erase')}>⌫</button>
              </div>
              <div className={c.gwrap} style={{ marginTop: 8 }}>
                <div className={c.ggrid} style={gridVars}
                  onPointerDown={(e) => { painting.current = true; lastCell.current = -1; paintAt(cellAt(e)); }}
                  onPointerMove={(e) => { if (painting.current) paintAt(cellAt(e)); }}
                  onPointerUp={() => { painting.current = false; }} onPointerLeave={() => { painting.current = false; }} onPointerCancel={() => { painting.current = false; }}>
                  {Array.from({ length: N }, (_, k) => {
                    const v = cells[k];
                    const ok = graded?.cells[k];
                    return (
                      <button type="button" key={k} data-cell={k} aria-label={`${k}–${k + 1}: ${v === undefined ? t('empty', 'trống') : v ?? t('idle', 'rảnh')}`}
                        className={cx(c.gcell, v !== undefined && c.gcellFilled, v === null && c.gcellIdle, graded && (ok ? c.gcellOk : c.gcellBad), D.t === k && !graded && c.gcellCur)}
                        style={{ background: color(v) }}>
                        <span className={c.gt}>{k}</span>{v ?? (v === null ? '·' : '')}
                        {graded && !ok && <span className={c.gfix}>{R.cells[k] ?? '·'}</span>}
                      </button>
                    );
                  })}
                </div>
                <div className={c.gruler} style={gridVars}>{Array.from({ length: N }, (_, k) => <span key={k}>{k % (N > 20 ? 2 : 1) === 0 ? k : ''}</span>)}</div>
              </div>
              <div className={s.small} style={{ marginTop: 4 }}>{t('One cell = one time unit. Arrivals are marked on the timeline as you step.', 'Một ô = một đơn vị thời gian. Bấm Bước để xem việc nào đến lúc nào.')}</div>
            </div>
          ) : (
            <div className={s.panel} data-tour="gx-grid">
              <div className={s.panelTitle}>{t('Gantt chart, built one time unit at a time', 'Biểu đồ Gantt, dựng từng đơn vị thời gian')}</div>
              <div className={c.ggrid} style={gridVars}>
                {R.cells.map((id, k) => (
                  <div key={k} className={cx(c.gcell, c.gcellFilled, id === null && c.gcellIdle, k === D.t && c.gcellCur)} style={{ background: k <= showT || D.finished ? color(id) : 'transparent', borderStyle: k <= showT || D.finished ? 'solid' : 'dashed', cursor: 'default' }}>
                    <span className={c.gt}>{k}</span>{k <= showT || D.finished ? id ?? '·' : ''}
                  </div>
                ))}
              </div>
              <div className={c.gruler} style={gridVars}>{R.cells.map((_, k) => <span key={k}>{k % (N > 20 ? 2 : 1) === 0 ? k : ''}</span>)}</div>
              <div className={s.small} style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }} data-tour="gx-queue">
                <b>{t('ready queue after the pick:', 'hàng sẵn sàng sau khi chọn:')}</b>
                <span className={c.qchips}>{D.ready.length ? D.ready.map((id) => <span key={id} className={s.chip} style={{ background: color(id), height: 22, minWidth: 30 }}>{id}</span>) : <span className={s.empty}>{t('empty', 'trống')}</span>}</span>
              </div>
            </div>
          )}
        </div>

        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="gx-rules">
            <div className={s.panelTitle}>{t('Tie rules — write them on your paper (Ch16)', 'Luật hoà — ghi ra giấy (Ch16)')}</div>
            <ul className={c.rules}>
              <li>{t('Equal burst / equal priority: earlier arrival first, then table order.', 'Bằng thời gian hay bằng ưu tiên: đến sớm hơn trước, rồi tới thứ tự trong bảng.')}</li>
              <li>{t('Round robin: a job arriving at t joins the queue BEFORE the job preempted at t.', 'Round robin: việc đến đúng lúc t vào hàng TRƯỚC việc bị cắt lúc t.')}</li>
              <li>{t('Say which number means "higher priority" — exams use both.', 'Ghi rõ số nào là "ưu tiên cao hơn" — đề dùng cả hai quy ước.')}</li>
              <li>{t('turnaround = finish − arrival · waiting = turnaround − burst · response = first run − arrival.', 'turnaround = xong − đến · waiting = turnaround − CPU · response = lần chạy đầu − đến.')}</li>
            </ul>
          </div>
          <div className={s.kpis} data-tour="gx-score">
            <Kpi k={t('score', 'điểm')} v={graded ? `${graded.score}/${graded.max}` : '—'} tone={graded ? (graded.score === graded.max ? 'ok' : 'bad') : undefined} />
            <Kpi k={t('cells right', 'ô đúng')} v={graded ? `${graded.cellScore}/${N}` : '—'} />
            {mode === 'solution' && <Kpi k={t('switches', 'lần đổi việc')} v={R.switches} />}
          </div>
          <WhereBox focus="scheduler" lang={lang} height={190} />
        </div>
      </div>

      <div className={s.panel} style={{ marginTop: 10 }} data-tour="gx-table">
        <div className={s.panelTitle}>{mode === 'exam' ? t('Your table', 'Bảng của bạn') : t('Answer table (fills in as jobs finish)', 'Bảng đáp án (điền dần khi việc xong)')}</div>
        <div className={s.scrollX}>
          <table className={cx(s.tbl, s.compact)}>
            <thead><tr><th>{t('job', 'việc')}</th><th className={s.num}>{t('finish', 'xong')}</th><th className={s.num}>turnaround</th><th className={s.num}>waiting</th>{mode === 'solution' && <th className={s.num}>response</th>}</tr></thead>
            <tbody>
              {R.rows.map((r) => {
                if (mode === 'solution') {
                  const show = doneBy(r.id) || !!D.finished;
                  return <tr key={r.id}><td>{r.id}</td><td className={s.num}>{show ? r.finish : ''}</td><td className={s.num}>{show ? `${r.finish} − ${r.arrival} = ${r.turnaround}` : ''}</td><td className={s.num}>{show ? `${r.turnaround} − ${r.burst} = ${r.waiting}` : ''}</td><td className={s.num}>{show ? r.response : ''}</td></tr>;
                }
                const g = graded?.rows[r.id];
                const inp = (f: 'finish' | 'turnaround' | 'waiting') => (
                  <input type="text" inputMode="numeric" className={cx(c.ginput, g && (g[f] ? c.inOk : c.inBad))} aria-label={`${r.id} ${f}`} value={rows[r.id]?.[f] ?? ''}
                    onChange={(e) => { setRows((o) => ({ ...o, [r.id]: { ...(o[r.id] ?? { finish: '', turnaround: '', waiting: '' }), [f]: e.target.value } })); setGraded(null); }} />
                );
                return <tr key={r.id}><td>{r.id}</td><td className={s.num}>{inp('finish')}</td><td className={s.num}>{inp('turnaround')}</td><td className={s.num}>{inp('waiting')}</td></tr>;
              })}
              <tr>
                <td><b>{t('average', 'trung bình')}</b></td><td />
                <td className={s.num}>{mode === 'solution' ? (D.finished ? fracText(R.sum.turnaround, jobs.length) : '') : <input type="text" inputMode="decimal" className={cx(c.ginput, graded && (graded.avgTurnaround ? c.inOk : c.inBad))} aria-label="avg turnaround" value={avgT} onChange={(e) => { setAvgT(e.target.value); setGraded(null); }} />}</td>
                <td className={s.num}>{mode === 'solution' ? (D.finished ? fracText(R.sum.waiting, jobs.length) : '') : <input type="text" inputMode="decimal" className={cx(c.ginput, graded && (graded.avgWaiting ? c.inOk : c.inBad))} aria-label="avg waiting" value={avgW} onChange={(e) => { setAvgW(e.target.value); setGraded(null); }} />}</td>
                {mode === 'solution' && <td />}
              </tr>
            </tbody>
          </table>
        </div>
        {mode === 'exam' && (
          <div className={s.bar} data-tour="gx-check">
            <button type="button" className={cx(s.btn, s.primary)} onClick={check}>✅ {t('Check my answer', 'Chấm bài')}</button>
            <button type="button" className={s.btn} onClick={() => { resetAnswer(); labSfx('off'); }}>{t('Clear', 'Xoá')}</button>
            <span className={s.small}>{t('Averages: 2 decimals are enough (10.20).', 'Trung bình: 2 chữ số thập phân là đủ (10,20 ghi 10.20).')}</span>
          </div>
        )}
      </div>
    </Frame>
  );
}
