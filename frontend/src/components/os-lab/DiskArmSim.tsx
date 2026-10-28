'use client';
/**
 * Lập lịch tay đĩa (bài 16.5): một mặt đĩa nhìn từ trên với tay đọc xoay tới đúng trụ, đường đi bậc thang và bộ cộng dồn
 * số trụ; hai quy ước C-SCAN (385 tính cú nhảy về / 186 bỏ ra); chế độ thi (tự tính tổng + thứ tự, đoán thuật toán từ
 * thứ tự); độ lệch trụ. Engine: engine/disk.ts (khớp osgcalc.py disk, c165).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { cylinderSkew, D_ALGOS, D_NAME, diskSchedule, DISK_165, whichAlgo, type DAlgo } from './engine/disk';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { useWidth } from './charts';
import { WhereBox } from './where';
import { useLabBridge, useLabRecord, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab3.module.css';

const ALGO_SHORT: Record<DAlgo, string> = { fcfs: 'FCFS', sstf: 'SSTF', scan: 'SCAN', look: 'LOOK', cscan: 'C-SCAN', clook: 'C-LOOK' };

/** Mặt đĩa: tâm C, trụ 0 ở mép ngoài; tay đọc quay quanh trục P, đầu đọc là giao của hai đường tròn. */
const CX = 112, CY = 112, R_OUT = 96, R_IN = 26, PX = 246, PY = 196, ARM = 140;
function headAt(cyl: number, max: number) {
  const r = R_OUT - ((R_OUT - R_IN) * cyl) / Math.max(1, max);
  const dx = PX - CX, dy = PY - CY, d = Math.hypot(dx, dy);
  const ux = dx / d, uy = dy / d, vx = uy, vy = -ux;
  const x = (r * r - ARM * ARM + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r * r - x * x));
  const hx = CX + x * ux + h * vx, hy = CY + x * uy + h * vy;
  return { hx, hy, r, deg: (Math.atan2(hy - PY, hx - PX) * 180) / Math.PI - 180 };
}

function Platter({ cyl, max, reqs, served, lang }: { cyl: number; max: number; reqs: number[]; served: Set<number>; lang: Lang }) {
  const H = headAt(cyl, max);
  const rOf = (k: number) => R_OUT - ((R_OUT - R_IN) * k) / Math.max(1, max);
  return (
    <svg viewBox="0 0 270 230" className={c.platter} role="img" aria-label={tx(lang, `Disk seen from above, head over cylinder ${cyl}`, `Mặt đĩa nhìn từ trên, đầu đọc ở trụ ${cyl}`)}>
      <circle cx={CX} cy={CY} r={R_OUT + 6} fill="#9aa4b2" />
      <circle cx={CX} cy={CY} r={R_OUT + 2} fill="#cfd6df" />
      {[0, 0.25, 0.5, 0.75, 1].map((f) => <circle key={f} cx={CX} cy={CY} r={R_IN + (R_OUT - R_IN) * f} fill="none" stroke="#aeb7c4" strokeWidth={0.6} />)}
      {reqs.map((q, k) => <circle key={k} cx={CX} cy={CY} r={rOf(q)} fill="none" stroke={served.has(k) ? '#94a3b8' : '#2563eb'} strokeWidth={served.has(k) ? 0.8 : 1.6} strokeDasharray={served.has(k) ? '2 3' : undefined} opacity={0.9} />)}
      <g className={c.spin} style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <path d={`M${CX},${CY} L${CX + R_OUT},${CY} A${R_OUT},${R_OUT} 0 0,1 ${CX + R_OUT * Math.cos(0.35)},${CY + R_OUT * Math.sin(0.35)} Z`} fill="#ffffff" opacity={0.35} />
      </g>
      <circle cx={CX} cy={CY} r={R_IN - 6} fill="#64748b" />
      <circle cx={CX} cy={CY} r={5} fill="#334155" />
      <g className={c.arm} style={{ transformOrigin: `${PX}px ${PY}px`, transform: `rotate(${H.deg}deg)` }}>
        <path d={`M${PX - 4},${PY - 6} L${PX - ARM + 10},${PY - 2.5} L${PX - ARM + 10},${PY + 2.5} L${PX - 4},${PY + 6} Z`} fill="#475569" />
        <rect x={PX - ARM - 8} y={PY - 5} width={16} height={10} rx={2} fill="#e8590c" />
      </g>
      <circle cx={PX} cy={PY} r={11} fill="#334155" /><circle cx={PX} cy={PY} r={4} fill="#94a3b8" />
      <text x={6} y={14} fontSize={10.5} fill="#64748b">{tx(lang, 'cyl 0 = outer edge', 'trụ 0 = mép ngoài')}</text>
      <text x={6} y={226} fontSize={10.5} fill="#64748b">{tx(lang, `cyl ${max} = innermost`, `trụ ${max} = trong cùng`)}</text>
    </svg>
  );
}

function Stairs({ order, moves, upto, max, reqs, hidePath, lang }: { order: number[]; moves: ReturnType<typeof diskSchedule>['moves']; upto: number; max: number; reqs: number[]; hidePath: boolean; lang: Lang }) {
  const [box, W] = useWidth<HTMLDivElement>(560);
  const L = 14, Rm = 14, T = 26, rowH = 22;
  const H = T + Math.max(order.length, 2) * rowH + 6;
  const X = (v: number) => L + ((W - L - Rm) * v) / Math.max(1, max);
  const Y = (k: number) => T + k * rowH + 8;
  const ticks = [0, Math.round(max / 4), Math.round(max / 2), Math.round((3 * max) / 4), max];
  return (
    <div ref={box} style={{ minWidth: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block', maxWidth: '100%' }} role="img" aria-label={tx(lang, 'Head movement, one row per step', 'Đường đi của đầu đọc, mỗi hàng một bước')}>
        <line x1={L} x2={W - Rm} y1={T - 8} y2={T - 8} className={s.svgBorder} strokeWidth={1} />
        {ticks.map((v) => <text key={v} x={X(v)} y={11} fontSize={10.5} textAnchor="middle" className={s.svgMuted}>{v}</text>)}
        {reqs.map((q, k) => <line key={k} x1={X(q)} x2={X(q)} y1={T - 12} y2={H - 4} stroke="var(--ol-accent)" strokeOpacity={0.18} strokeWidth={1} />)}
        {reqs.map((q, k) => <circle key={`d${k}`} cx={X(q)} cy={T - 8} r={3.2} fill="var(--ol-accent)" />)}
        {!hidePath && moves.slice(0, upto).map((m, k) => (
          <g key={k}>
            <line x1={X(m.from)} y1={Y(k)} x2={X(m.to)} y2={Y(k + 1)} stroke={m.jump ? 'var(--ol-warn)' : 'var(--ol-accent)'} strokeWidth={2.2} strokeDasharray={m.jump ? '5 4' : undefined} strokeLinecap="round" />
          </g>
        ))}
        {!hidePath && order.slice(0, upto + 1).map((v, k) => (
          <g key={`p${k}`}>
            <circle cx={X(v)} cy={Y(k)} r={k === upto ? 5.5 : 3.6} fill={k === 0 ? '#e8590c' : moves[k - 1]?.edge ? 'var(--ol-warn)' : 'var(--ol-accent)'} />
            <text x={X(v) + (X(v) > W - 40 ? -8 : 8)} y={Y(k) + 4} fontSize={11} textAnchor={X(v) > W - 40 ? 'end' : 'start'} className={s.svgText} fontWeight={k === upto ? 800 : 500}>{v}</text>
          </g>
        ))}
        {hidePath && <circle cx={X(order[0])} cy={Y(0)} r={5.5} fill="#e8590c" />}
      </svg>
    </div>
  );
}

const PRESETS = ['fcfs', 'sstf', 'scan', 'look', 'cscan', 'clook', 'exam'];

export default function DiskArmSim({ lang = 'vi', preset = 'cscan' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const pre = PRESETS.includes(preset) ? preset : 'cscan';
  const record = useLabRecord();
  const [algo, setAlgo] = useState<DAlgo>(pre === 'exam' ? 'scan' : (pre as DAlgo));
  const [exam, setExam] = useState(pre === 'exam');
  const [up, setUp] = useState(true);
  const [countReturn, setCountReturn] = useState(true);
  const [reqText, setReqText] = useState(DISK_165.reqs.join(' '));
  const [head, setHead] = useState(DISK_165.head);
  const [max, setMax] = useState(DISK_165.max);
  const reqs = useMemo(() => reqText.split(/[\s,;]+/).map(Number).filter((x) => Number.isInteger(x) && x >= 0 && x <= max).slice(0, 16), [reqText, max]);
  const opts = { head: Math.min(max, Math.max(0, head)), reqs, up, max, countReturn };
  const R = useMemo(() => diskSchedule(algo, opts), [algo, reqs, up, max, countReturn, head]); // eslint-disable-line react-hooks/exhaustive-deps
  const all = useMemo(() => D_ALGOS.map((a) => ({ a, r: diskSchedule(a, opts) })), [reqs, up, max, countReturn, head]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = usePlayer(R.order.length, 1100);
  const i = Math.min(p.i, R.order.length - 1);
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => {
    if (p.i !== prev.current && p.i > 0) { const m = R.moves[i - 1]; labSfx(m?.jump ? 'whoosh' : m?.edge ? 'thud' : p.atEnd ? 'done' : 'blip-exec'); }
    prev.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { p.reset(); }, [algo, up, countReturn, reqText, head, max]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── chế độ thi ──
  const [ansTotal, setAnsTotal] = useState('');
  const [ansOrder, setAnsOrder] = useState('');
  const [checked, setChecked] = useState<null | { total: boolean; order: boolean }>(null);
  const [mystery, setMystery] = useState<DAlgo>(record ? 'clook' : 'clook');
  const [guess, setGuess] = useState<DAlgo | null>(null);
  const mysteryOrder = useMemo(() => diskSchedule(mystery, { ...opts, up: true }).order, [mystery, reqs, max, head]); // eslint-disable-line react-hooks/exhaustive-deps
  const mysteryOk = useMemo(() => whichAlgo({ ...opts, up: true }, mysteryOrder), [mysteryOrder]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setChecked(null); }, [algo, up, countReturn, reqText, head]);
  const check = () => {
    const want = R.order.slice(1).join(',');
    const got = ansOrder.split(/[\s,;>-]+/).filter(Boolean).map(Number);
    const res = { total: Number(ansTotal) === R.total, order: got.join(',') === want || got.join(',') === R.order.join(',') };
    setChecked(res); labSfx(res.total && res.order ? 'right' : 'wrong');
  };
  const newMystery = () => { const pool = D_ALGOS.filter((a) => a !== mystery); setMystery(pool[Math.floor(Math.random() * pool.length)]); setGuess(null); labSfx('whoosh'); };

  useLabBridge('disk', {
    algo, up, countReturn, exam, i: p.i, atEnd: p.atEnd, total: R.total, cyl: R.order[i], checked: !!checked, correct: !!checked && checked.total && checked.order,
    guess: guess ?? '', guessOk: guess !== null && mysteryOk.includes(guess), mystery,
  }, {
    algo: (v) => { setAlgo(v as DAlgo); labSfx('tap'); }, up: (v) => setUp(!!v), ret: (v) => { setCountReturn(!!v); labSfx(v ? 'on' : 'off'); },
    exam: (v) => { setExam(!!v); labSfx('tap'); }, total: (v) => setAnsTotal(String(v)), order: (v) => setAnsOrder(String(v)), check: () => check(),
    answer: () => { setAnsTotal(String(R.total)); setAnsOrder(R.order.slice(1).join(' ')); },
    guess: (v) => { setGuess(v as DAlgo); labSfx(mysteryOk.includes(v as DAlgo) ? 'right' : 'wrong'); },
  });

  const served = new Set<number>();
  const servedCyl = R.order.slice(1, i + 1);
  reqs.forEach((q, k) => { const n = servedCyl.filter((x) => x === q).length; const before = reqs.slice(0, k).filter((x) => x === q).length; if (n > before) served.add(k); });
  const m = i > 0 ? R.moves[i - 1] : null;
  const sumSoFar = R.moves.slice(0, i).reduce((a, x) => a + (x.counted ? x.dist : 0), 0);

  const explain = () => {
    if (exam && !checked) return t(`Head at ${opts.head}, moving ${up ? 'up' : 'down'}, requests ${reqs.join(', ')}. Work out the ${ALGO_SHORT[algo]} order and total on paper, then type them in below.`, `Đầu đọc ở ${opts.head}, đang đi ${up ? 'lên' : 'xuống'}, yêu cầu ${reqs.join(', ')}. Tự tính thứ tự và tổng của ${ALGO_SHORT[algo]} ra giấy rồi gõ vào bên dưới.`);
    if (exam && checked) return checked.total && checked.order ? t(`Correct: ${R.total} cylinders. Press Play to watch the arm do it.`, `Đúng: ${R.total} trụ. Bấm Chạy để xem tay đĩa làm đúng như vậy.`) : t(`Not yet: the order is ${R.order.join(' → ')}, total ${R.total}. Press Play and follow each move.`, `Chưa đúng: thứ tự là ${R.order.join(' → ')}, tổng ${R.total}. Bấm Chạy và theo từng bước.`);
    if (!m) return t(`${D_NAME[algo][0]}. The head starts at cylinder ${opts.head}${algo === 'fcfs' || algo === 'sstf' ? '' : `, moving ${up ? 'up (towards ' + max + ')' : 'down (towards 0)'}`}. Press Step.`, `${D_NAME[algo][1]}. Đầu đọc bắt đầu ở trụ ${opts.head}${algo === 'fcfs' || algo === 'sstf' ? '' : `, đang đi ${up ? 'lên (về phía ' + max + ')' : 'xuống (về phía 0)'}`}. Bấm Bước.`);
    const why = (): [string, string] => {
      if (m.jump) return [`Return jump ${m.from} → ${m.to}: the head services nothing on the way. ${countReturn ? `Counted here (+${m.dist}), like osgcalc and Ch16.` : 'NOT counted under this convention — the line is dashed.'}`, `Cú nhảy quay về ${m.from} → ${m.to}: đầu đọc không phục vụ gì trên đường. ${countReturn ? `Có tính (+${m.dist}), như osgcalc và Ch16.` : 'KHÔNG tính theo quy ước này — nét đứt.'}`];
      if (m.edge) return [`No more requests this way, but ${ALGO_SHORT[algo]} runs all the way to the edge (${m.to}) before turning: +${m.dist}.`, `Hết yêu cầu phía này, nhưng ${ALGO_SHORT[algo]} chạy tới tận mép (${m.to}) rồi mới quay: +${m.dist}.`];
      if (algo === 'fcfs') return [`Next in arrival order: ${m.to}. +${m.dist}.`, `Kế tiếp theo thứ tự đến: ${m.to}. +${m.dist}.`];
      if (algo === 'sstf') return [`Closest pending request to ${m.from} is ${m.to} (${m.dist} away; ties go to the lower cylinder).`, `Yêu cầu chờ gần ${m.from} nhất là ${m.to} (cách ${m.dist}; hoà thì chọn trụ nhỏ hơn).`];
      return [`Keep sweeping in the same direction: next request ${m.to}, +${m.dist}.`, `Quét tiếp cùng chiều: yêu cầu kế ${m.to}, +${m.dist}.`];
    };
    const w = why();
    return <>{t(w[0], w[1])} {t('Running total', 'Cộng dồn')}: <b className={s.mono}>{sumSoFar}</b>{p.atEnd ? <> — <b>{t(`done: ${R.total} cylinders`, `xong: ${R.total} trụ`)}</b>{algo === 'cscan' || algo === 'clook' ? ` (${t('without the return jump', 'không tính cú nhảy')}: ${R.totalWithJump - (R.moves.find((x) => x.jump)?.dist ?? 0)})` : ''}</> : null}</>;
  };

  const maxTotal = Math.max(...all.map((x) => x.r.total), 1);
  const sk = cylinderSkew(7200, 1, 300);
  const hide = exam && !checked;

  return (
    <Frame badge={t('OS lab · exam', 'Phòng lab OS · luyện thi')} title={t('Disk-arm scheduling', 'Lập lịch tay đĩa')}
      sub={t('FCFS, SSTF, SCAN, LOOK, C-SCAN, C-LOOK — the arm moves, the counter adds up the cylinders', 'FCFS, SSTF, SCAN, LOOK, C-SCAN, C-LOOK — tay đĩa di chuyển, bộ đếm cộng dồn số trụ')}>
      <div className={s.bar} data-tour="disk-algo">
        <Seg value={algo} options={D_ALGOS.map((a) => [a, ALGO_SHORT[a]] as [DAlgo, string])} onChange={(v) => { setAlgo(v); labSfx('tap'); }} />
        <Seg value={up ? 'up' : 'down'} options={[['up', t('↑ up', '↑ lên')], ['down', t('↓ down', '↓ xuống')]]} onChange={(v) => setUp(v === 'up')} />
      </div>
      <div className={s.bar} data-tour="disk-opts">
        <span className={s.lbl}>{t('head', 'đầu đọc')} <input type="number" min={0} max={max} value={head} onChange={(e) => setHead(Number(e.target.value) || 0)} /></span>
        <span className={s.lbl}>{t('requests', 'yêu cầu')} <input type="text" value={reqText} onChange={(e) => setReqText(e.target.value)} style={{ width: 210, maxWidth: '100%' }} aria-label={t('requests', 'yêu cầu')} /></span>
        <span className={s.lbl}>max <input type="number" min={20} max={9999} value={max} onChange={(e) => setMax(Math.max(20, Number(e.target.value) || 199))} /></span>
        {(algo === 'cscan' || algo === 'clook') && <Seg label={t('return jump', 'cú nhảy về')} value={countReturn ? 'yes' : 'no'} options={[['yes', t('counted (385)', 'tính (385)')], ['no', t('not counted (186)', 'không tính (186)')]]} onChange={(v) => { setCountReturn(v === 'yes'); labSfx(v === 'yes' ? 'on' : 'off'); }} />}
        <Seg value={exam ? 'exam' : 'learn'} options={[['learn', t('📖 Learn', '📖 Học')], ['exam', t('✍️ Exam', '✍️ Thi')]]} onChange={(v) => { setExam(v === 'exam'); labSfx('tap'); }} />
      </div>
      <Controls p={p} lang={lang} label={`${t('cyl', 'trụ')} ${R.order[i]}`} />
      <Explain tone={hide ? undefined : m?.jump ? 'warn' : p.atEnd ? 'ok' : undefined}>{explain()}</Explain>

      <div className={c.cols} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="disk-path">
            <div className={s.panelTitle}>{t('Path of the head (cylinders →, time ↓)', 'Đường đi của đầu đọc (trụ →, thời gian ↓)')}</div>
            <Stairs order={R.order} moves={R.moves} upto={i} max={max} reqs={reqs} hidePath={hide} lang={lang} />
          </div>
          <div className={s.panel} data-tour="disk-sum">
            <div className={s.panelTitle}>{t('Total head movement', 'Tổng quãng đường tay đĩa')}</div>
            {hide ? <span className={s.empty}>{t('hidden until you check', 'ẩn tới khi bạn chấm bài')}</span> : (
              <div className={c.sum}>
                {R.moves.slice(0, i).map((x, k) => <span key={k} className={cx(x.jump && c.sumJump, !x.counted && c.sumSkip)}>{k ? ' + ' : ''}{x.dist}</span>)}
                {i > 0 && <> = <b>{sumSoFar}</b></>}
                {i === 0 && <span className={s.empty}>{t('press Step', 'bấm Bước')}</span>}
              </div>
            )}
          </div>
          {exam && (
            <div className={s.panel} data-tour="disk-exam">
              <div className={s.panelTitle}>{t(`Your answer for ${ALGO_SHORT[algo]}`, `Bài làm của bạn cho ${ALGO_SHORT[algo]}`)}</div>
              <div className={s.bar}>
                <span className={s.lbl}>{t('order', 'thứ tự')} <input type="text" value={ansOrder} onChange={(e) => { setAnsOrder(e.target.value); setChecked(null); }} placeholder="98 132 …" style={{ width: 220, maxWidth: '100%' }} className={cx(checked && (checked.order ? c.inOk : c.inBad))} aria-label={t('order', 'thứ tự')} /></span>
                <span className={s.lbl}>{t('total', 'tổng')} <input type="text" inputMode="numeric" value={ansTotal} onChange={(e) => { setAnsTotal(e.target.value); setChecked(null); }} className={cx(c.ginput, checked && (checked.total ? c.inOk : c.inBad))} aria-label={t('total', 'tổng')} /></span>
                <button type="button" className={cx(s.btn, s.primary)} onClick={check}>✅ {t('Check', 'Chấm')}</button>
              </div>
              <div className={s.panelTitle} style={{ marginTop: 8 }}>{t('Which algorithm visited the cylinders in this order?', 'Thuật toán nào đi qua các trụ theo thứ tự này?')}</div>
              <div className={s.mono} style={{ overflowWrap: 'anywhere' }}>{mysteryOrder.join(' → ')}</div>
              <div className={s.bar} data-tour="disk-guess">
                {D_ALGOS.map((a) => <button type="button" key={a} className={cx(s.btn, guess === a && (mysteryOk.includes(a) ? s.on : s.danger))} onClick={() => { setGuess(a); labSfx(mysteryOk.includes(a) ? 'right' : 'wrong'); }}>{ALGO_SHORT[a]}</button>)}
                <button type="button" className={s.btn} onClick={newMystery}>🎲</button>
              </div>
              {guess && <div className={s.small}>{mysteryOk.includes(guess) ? t(`Yes — ${mysteryOk.map((a) => ALGO_SHORT[a]).join(' / ')}.`, `Đúng — ${mysteryOk.map((a) => ALGO_SHORT[a]).join(' / ')}.`) : t('No. Look at where it turns: at the edge or at the last request? Does it sweep back, or jump?', 'Chưa. Nhìn chỗ nó quay đầu: ở mép hay ở yêu cầu cuối? Nó quét ngược lại, hay nhảy về?')}</div>}
            </div>
          )}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={cx(s.panel, c.platterWrap)} data-tour="disk-platter">
            <Platter cyl={R.order[i]} max={max} reqs={reqs} served={served} lang={lang} />
          </div>
          <div className={s.kpis}>
            <Kpi k={t('cylinder', 'trụ')} v={R.order[i]} />
            <Kpi k={t('total', 'tổng')} v={hide ? '?' : R.total} tone={hide ? undefined : 'ok'} />
            <Kpi k={t('moves', 'bước')} v={`${i}/${R.moves.length}`} />
          </div>
          <div className={s.panel} data-tour="disk-compare">
            <div className={s.panelTitle}>{t('All six on the same requests', 'Cả sáu thuật toán trên cùng đề')}</div>
            {hide ? <span className={s.empty}>{t('hidden until you check', 'ẩn tới khi bạn chấm bài')}</span> : (
              <div className={c.bars}>
                {all.map(({ a, r }) => (
                  <div key={a} className={c.thr} style={{ fontWeight: a === algo ? 800 : 500 }}>
                    <span>{ALGO_SHORT[a]}</span>
                    <span className={c.thrTrack}><span className={c.thrFill} style={{ display: 'block', width: `${(100 * r.total) / maxTotal}%`, background: a === algo ? 'var(--ol-accent)' : '#94a3b8' }} /></span>
                    <span className={s.mono}>{r.total}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('Cylinder skew (16.5 K2)', 'Độ lệch trụ (16.5 K2)')}</div>
            <div className={s.small}>{t(`7200 rpm ⇒ one turn ${sk.rotMs.toFixed(4)} ms; 300 sectors ⇒ one sector passes in ${sk.perSector.toFixed(5)} ms; a 1 ms track-to-track seek lets ${sk.passing.toFixed(2)} sectors pass ⇒ skew = ⌈${sk.passing.toFixed(2)}⌉ = ${sk.skew} sectors.`, `7200 vòng/phút ⇒ một vòng ${sk.rotMs.toFixed(4)} ms; 300 sector ⇒ một sector đi qua trong ${sk.perSector.toFixed(5)} ms; chuyển trụ 1 ms để ${sk.passing.toFixed(2)} sector trôi qua ⇒ độ lệch = ⌈${sk.passing.toFixed(2)}⌉ = ${sk.skew} sector.`)}</div>
          </div>
          <WhereBox focus="disk-arm" lang={lang} height={180} />
        </div>
      </div>
    </Frame>
  );
}
