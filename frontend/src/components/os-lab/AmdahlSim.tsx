'use client';
/**
 * Amdahl · Gustafson · Karp–Flatt · lõi không đều · chia việc (bài 4.1, 4.5): đường speedup theo số lõi với các điểm
 * ĐO THẬT của Chương 4 (c45-amdahl, c41-c — máy lab 10 lõi = 8 P + 2 E), bảng sweep tự dán ⇒ phần tuần tự e từng mức
 * và dự đoán 16/32/64 lõi. Engine: engine/amdahl.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { amdahl, BUSY, capacity, ceiling, GROW, gustafson, hetero, heteroStatic, karpTable, MEASURED, parseSweep, PRIMES, SWEEP_TEXT } from './engine/amdahl';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { useWidth } from './charts';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab3.module.css';

type View = 'amdahl' | 'gustafson' | 'karp' | 'hetero' | 'balance';
const NS = [1, 2, 4, 8, 10, 16, 32, 64];
const SETS: Record<string, { en: string; vi: string; text: string }> = {
  a10: { en: 'amdahl 10 % (c45)', vi: 'amdahl 10 % (c45)', text: SWEEP_TEXT },
  queue: { en: 'primes, shared queue (c41)', vi: 'số nguyên tố, hàng đợi (c41)', text: PRIMES.queue.map((r) => `${r.cores} ${r.ms}`).join('\n') },
  block: { en: 'primes, fixed blocks (c41)', vi: 'số nguyên tố, khối cố định (c41)', text: PRIMES.block.map((r) => `${r.cores} ${r.ms}`).join('\n') },
  fork: { en: 'primes, fork (c41)', vi: 'số nguyên tố, fork (c41)', text: PRIMES.fork.map((r) => `${r.cores} ${r.ms}`).join('\n') },
};

interface Curve { name: string; color: string; f: (n: number) => number; dash?: string; width?: number }
function SpeedChart({ curves, dots, nMax, yMax, n, refs, lang }: { curves: Curve[]; dots: Array<{ n: number; y: number; color: string; label?: string }>; nMax: number; yMax: number; n: number; refs: Array<{ y: number; label: string; color: string }>; lang: Lang }) {
  const [box, W] = useWidth<HTMLDivElement>(560);
  const H = 250, L = 34, R = 10, T = 10, B = 22;
  const lx = (v: number) => Math.log2(Math.max(1, v));
  const X = (v: number) => L + ((W - L - R) * lx(v)) / lx(nMax);
  const Y = (v: number) => T + (H - T - B) * (1 - Math.min(yMax, Math.max(0, v)) / yMax);
  const xt = NS.filter((v) => v <= nMax);
  const yt = [0, yMax / 4, yMax / 2, (3 * yMax) / 4, yMax];
  return (
    <div ref={box} className={c.chartBox}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block', maxWidth: '100%' }} role="img" aria-label={tx(lang, 'Speedup versus number of cores', 'Speedup theo số lõi')}>
        {yt.map((v) => <g key={v}><line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} className={s.svgGrid} /><text x={L - 4} y={Y(v) + 4} fontSize={10.5} textAnchor="end" className={s.svgMuted}>{Math.round(v * 10) / 10}×</text></g>)}
        {xt.map((v) => <g key={v}><line x1={X(v)} x2={X(v)} y1={T} y2={H - B} className={s.svgGrid} /><text x={X(v)} y={H - 6} fontSize={10.5} textAnchor="middle" className={s.svgMuted}>{v}</text></g>)}
        {refs.map((r) => <g key={r.label}><line x1={L} x2={W - R} y1={Y(r.y)} y2={Y(r.y)} stroke={r.color} strokeDasharray="6 4" strokeWidth={1.5} /><text x={W - R - 2} y={Y(r.y) - 4} fontSize={11} textAnchor="end" fill={r.color} fontWeight={800}>{r.label}</text></g>)}
        {curves.map((cv) => {
          let d = '';
          for (let k = 0; k <= 120; k++) { const v = 2 ** ((lx(nMax) * k) / 120); d += `${k ? 'L' : 'M'}${X(v).toFixed(1)},${Y(cv.f(v)).toFixed(1)}`; }
          return <path key={cv.name} d={d} fill="none" stroke={cv.color} strokeWidth={cv.width ?? 2.2} strokeDasharray={cv.dash} strokeLinejoin="round" />;
        })}
        <line x1={X(n)} x2={X(n)} y1={T} y2={H - B} stroke="var(--ol-text)" strokeWidth={1.2} strokeDasharray="2 3" />
        {curves.map((cv) => <circle key={`m${cv.name}`} cx={X(n)} cy={Y(cv.f(n))} r={3.5} fill={cv.color} />)}
        {dots.map((d, k) => <g key={k}><circle cx={X(d.n)} cy={Y(d.y)} r={5} fill="var(--ol-bg)" stroke={d.color} strokeWidth={2.4} />{d.label && <text x={X(d.n) - 6} y={Y(d.y) - 8} fontSize={10.5} textAnchor="end" fill={d.color} fontWeight={800}>{d.label}</text>}</g>)}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px', fontSize: 11.5 }}>
        {curves.map((cv) => <span key={cv.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 16, height: 0, borderTop: `3px ${cv.dash ? 'dashed' : 'solid'} ${cv.color}`, display: 'inline-block' }} />{cv.name}</span>)}
        {dots.length > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: '50%', border: `2.4px solid ${dots[0].color}`, display: 'inline-block' }} />{tx(lang, 'measured in the lab', 'đo thật trong lab')}</span>}
      </div>
    </div>
  );
}

export default function AmdahlSim({ lang = 'vi', preset = 'amdahl' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const V0 = (['amdahl', 'gustafson', 'karp', 'hetero', 'balance'] as View[]).includes(preset as View) ? (preset as View) : 'amdahl';
  const [view, setView] = useState<View>(V0);
  const [s10, setS10] = useState(100); // phần tuần tự × 1000 (0–500 ⇒ 0–50 %)
  const sFrac = s10 / 1000;
  const [n, setN] = useState(10);
  const [P, setP] = useState(8);
  const [r, setR] = useState(40);
  const [sweep, setSweep] = useState(SWEEP_TEXT);
  const [setKey, setSetKey] = useState('a10');
  const [work, setWork] = useState<'primes' | 'mandel'>('primes');
  const K = useMemo(() => karpTable(parseSweep(sweep)), [sweep]);
  const steps = view === 'balance' ? 11 : NS.length;
  const p = usePlayer(steps, view === 'balance' ? 700 : 1300);
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => {
    if (view !== 'balance') setN(NS[Math.min(p.i, NS.length - 1)]);
    if (p.i !== prev.current) labSfx(view === 'balance' ? 'tick' : p.atEnd ? 'thud' : 'blip-exec');
    prev.current = p.i;
  }, [p.i, view]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { p.reset(); }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  const measuredKey = s10 === 0 ? 's0' : s10 === 100 ? 's10' : s10 === 250 ? 's25' : null;
  const am = amdahl(sFrac, n), gu = gustafson(sFrac, n), ce = ceiling(sFrac);
  const he = hetero(sFrac, n, P, r / 100), hs = heteroStatic(sFrac, n, P, r / 100);
  const mPt = measuredKey ? MEASURED[measuredKey].pts.find(([k]) => k === n) : undefined;
  const eFit = K.e ?? 0;
  const nMax = view === 'hetero' ? 16 : 64;

  useLabBridge('amd', {
    view, s: sFrac, n, speedup: +am.toFixed(2), gus: +gu.toFixed(2), ceiling: Number.isFinite(ce) ? +ce.toFixed(2) : -1, e: K.e === null ? -1 : +(K.e * 100).toFixed(1),
    rows: K.rows.length, predict64: K.predict[2] ? +K.predict[2].speedup.toFixed(2) : -1, hetero: +he.toFixed(2), i: p.i, atEnd: p.atEnd, work, set: setKey,
  }, {
    view: (v) => { setView(v as View); labSfx('tap'); }, s: (v) => setS10(Math.round(Number(v) * 1000)), n: (v) => setN(Number(v)),
    load: (v) => { const k = String(v); if (SETS[k]) { setSetKey(k); setSweep(SETS[k].text); labSfx('pop'); } }, sweep: (v) => setSweep(String(v)),
    r: (v) => setR(Number(v)), work: (v) => { setWork(v as 'primes' | 'mandel'); p.reset(); labSfx('tap'); },
  });

  const pctS = (v: number) => `${(v * 100).toFixed(v * 100 < 10 ? 1 : 0)} %`;
  const curves: Curve[] = [{ name: t('ideal (n×)', 'lý tưởng (n×)'), color: '#94a3b8', f: (v) => v, dash: '5 4', width: 1.5 }];
  if (view === 'amdahl' || view === 'gustafson') curves.push({ name: `Amdahl s = ${pctS(sFrac)}`, color: '#2563eb', f: (v) => amdahl(sFrac, v) });
  if (view === 'gustafson') curves.push({ name: `Gustafson s = ${pctS(sFrac)}`, color: '#7c3aed', f: (v) => gustafson(sFrac, v) });
  if (view === 'karp' && K.e !== null) curves.push({ name: `Amdahl e = ${pctS(eFit)} (Karp–Flatt)`, color: '#059669', f: (v) => amdahl(Math.max(0, eFit), v) });
  if (view === 'hetero') {
    curves.push({ name: t('uniform cores', 'lõi đều nhau'), color: '#2563eb', f: (v) => amdahl(sFrac, v), dash: '3 3', width: 1.6 });
    curves.push({ name: t(`${P} P + E cores, shared queue`, `${P} P + lõi E, hàng đợi chung`), color: '#d97706', f: (v) => hetero(sFrac, v, P, r / 100) });
    curves.push({ name: t('… fixed equal blocks', '… chia khối bằng nhau'), color: '#dc2626', f: (v) => heteroStatic(sFrac, v, P, r / 100), dash: '6 3' });
  }
  const dots = view === 'karp'
    ? K.rows.map((x) => ({ n: x.cores, y: x.speedup, color: '#059669' }))
    : view === 'gustafson'
      ? GROW.map(([k, u, ms]) => ({ n: k, y: (u / ms) / (GROW[0][1] / GROW[0][2]), color: '#7c3aed' }))
      : measuredKey && view !== 'balance' ? MEASURED[view === 'hetero' ? 's0' : measuredKey].pts.map(([k, , y]) => ({ n: k, y, color: view === 'hetero' ? '#d97706' : '#2563eb' })) : [];
  const yMax = view === 'gustafson' ? 64 : view === 'hetero' ? 16 : view === 'karp' ? Math.max(10, ...K.predict.map((x) => x.speedup), ...K.rows.map((x) => x.speedup)) * 1.1 : Math.min(64, Math.max(10, (Number.isFinite(ce) ? ce : 64) * 1.12));
  const refs = (view === 'amdahl' || view === 'gustafson') && Number.isFinite(ce) && ce <= yMax ? [{ y: ce, label: t(`ceiling 1/s = ${ce.toFixed(1)}×`, `trần 1/s = ${ce.toFixed(1)}×`), color: 'var(--ol-bad)' }] : view === 'karp' && K.ceiling && K.ceiling <= yMax ? [{ y: K.ceiling, label: t(`ceiling 1/e = ${K.ceiling.toFixed(1)}×`, `trần 1/e = ${K.ceiling.toFixed(1)}×`), color: 'var(--ol-bad)' }] : [];

  // ── chia việc: thời gian bận từng luồng ──
  const B = BUSY[work];
  const wall = Math.max(B.wall.block, B.wall.queue);
  const tNow = (wall * Math.min(p.i, 10)) / 10;

  const explain = () => {
    if (view === 'amdahl') return t(`${n} core${n > 1 ? 's' : ''}: ideal ${n}×, Amdahl ${am.toFixed(2)}× (efficiency ${((100 * am) / n).toFixed(0)} %), ceiling ${Number.isFinite(ce) ? ce.toFixed(1) + '×' : '∞'} however many cores you add.${mPt ? ` Measured: ${mPt[2].toFixed(2)}× (${mPt[1]} ms).` : ''}`, `${n} lõi: lý tưởng ${n}×, Amdahl ${am.toFixed(2)}× (hiệu suất ${((100 * am) / n).toFixed(0)} %), trần ${Number.isFinite(ce) ? ce.toFixed(1) + '×' : '∞'} dù thêm bao nhiêu lõi.${mPt ? ` Đo thật: ${mPt[2].toFixed(2)}× (${mPt[1]} ms).` : ''}`);
    if (view === 'gustafson') { const g = GROW.find(([k]) => k === n); return t(`Gustafson: keep the TIME fixed and grow the job with the cores ⇒ ${gu.toFixed(2)}× more work done (Amdahl, fixed job: ${am.toFixed(2)}×).${g ? ` Lab "grow": ${g[1].toLocaleString('en-US')} units in ${g[2]} ms (1 core: 4 000 in 3 048 ms) ⇒ ${((g[1] / g[2]) / (4000 / 3048)).toFixed(2)}× throughput.` : ''}`, `Gustafson: giữ THỜI GIAN cố định, cho việc lớn lên theo số lõi ⇒ làm được ${gu.toFixed(2)}× việc (Amdahl, việc cố định: ${am.toFixed(2)}×).${g ? ` Lab "grow": ${g[1].toLocaleString('vi-VN')} đơn vị trong ${g[2]} ms (1 lõi: 4 000 trong 3 048 ms) ⇒ thông lượng ${((g[1] / g[2]) / (4000 / 3048)).toFixed(2)}×.` : ''}`); }
    if (view === 'karp') return K.e === null ? t('Paste a sweep table: one line per run, "cores ms", and the first line must be 1 core.', 'Dán bảng sweep: mỗi dòng một lần chạy, "lõi ms", dòng đầu phải là 1 lõi.') : t(`Karp–Flatt: e = (1/S − 1/n) / (1 − 1/n). From your largest run e = ${(eFit * 100).toFixed(1)} % ⇒ ceiling ${K.ceiling ? K.ceiling.toFixed(1) + '×' : '∞'}; 16 / 32 / 64 cores ⇒ ${K.predict.map((x) => x.speedup.toFixed(2) + '×').join(' / ')}. If e GROWS with n, the cost is not a fixed serial part — it is overhead (sync, memory bandwidth, slow cores).`, `Karp–Flatt: e = (1/S − 1/n) / (1 − 1/n). Từ lần chạy lớn nhất e = ${(eFit * 100).toFixed(1)} % ⇒ trần ${K.ceiling ? K.ceiling.toFixed(1) + '×' : '∞'}; 16 / 32 / 64 lõi ⇒ ${K.predict.map((x) => x.speedup.toFixed(2) + '×').join(' / ')}. Nếu e TĂNG theo n thì cái giá không phải phần tuần tự cố định — mà là chi phí phụ (đồng bộ, băng thông bộ nhớ, lõi chậm).`);
    if (view === 'hetero') return t(`Model: ${P} performance cores + E cores at ${r} % speed. On ${n} cores the machine has the strength of ${capacity(n, P, r / 100).toFixed(1)} P cores ⇒ shared queue ${he.toFixed(2)}×, fixed equal blocks ${hs.toFixed(2)}× (everyone waits for the slowest core). The lab Mac: 0 % serial went 7.53× on 8 cores but only 8.59× on 10 — the bend after 8 is the E cores, not s.`, `Mô hình: ${P} lõi hiệu năng + lõi E chạy ${r} % tốc độ. Trên ${n} lõi máy có sức của ${capacity(n, P, r / 100).toFixed(1)} lõi P ⇒ hàng đợi chung ${he.toFixed(2)}×, chia khối bằng nhau ${hs.toFixed(2)}× (ai cũng chờ lõi chậm nhất). Máy lab: 0 % tuần tự được 7,53× trên 8 lõi nhưng chỉ 8,59× trên 10 — chỗ gãy sau 8 là do lõi E, không phải do s.`);
    return t(`${work === 'primes' ? 'Primes up to 20 million' : 'Mandelbrot'} on 4 threads, t = ${Math.round(tNow)} ms. Fixed blocks: each thread gets a quarter of the work, but the quarters are not equal — ${work === 'primes' ? 'bigger numbers cost more to test' : 'the middle rows are inside the set and cost 13× more'}; wall time = the slowest thread (${B.wall.block} ms). Shared queue: threads take small chunks until none are left ⇒ all finish together (${B.wall.queue} ms).`, `${work === 'primes' ? 'Số nguyên tố tới 20 triệu' : 'Mandelbrot'} trên 4 luồng, t = ${Math.round(tNow)} ms. Khối cố định: mỗi luồng một phần tư việc, nhưng các phần tư không bằng nhau — ${work === 'primes' ? 'số càng lớn kiểm càng tốn' : 'các hàng giữa nằm trong tập Mandelbrot, tốn gấp 13 lần'}; thời gian tổng = luồng chậm nhất (${B.wall.block} ms). Hàng đợi chung: luồng lấy từng khúc nhỏ tới khi hết ⇒ cùng xong (${B.wall.queue} ms).`);
  };

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Amdahl, Gustafson & your own sweep', 'Amdahl, Gustafson & bảng đo của bạn')}
      sub={t('How much faster can more cores make it — and what the lab machine really measured', 'Thêm lõi thì nhanh hơn được bao nhiêu — và máy lab đo thật được bao nhiêu')}>
      <div className={s.bar} data-tour="amd-view">
        <Seg value={view} options={[['amdahl', 'Amdahl'], ['gustafson', 'Gustafson'], ['karp', 'Karp–Flatt'], ['hetero', t('P + E cores', 'lõi P + E')], ['balance', t('splitting work', 'chia việc')]]} onChange={(v) => { setView(v); labSfx('tap'); }} />
      </div>
      {(view === 'amdahl' || view === 'gustafson' || view === 'hetero') && (
        <div className={s.stack} style={{ gap: 4, margin: '6px 0' }} data-tour="amd-sliders">
          <label className={c.slider}><span>{t('serial part s', 'phần tuần tự s')}</span><input type="range" min={0} max={500} step={5} value={s10} onChange={(e) => setS10(Number(e.target.value))} /><output>{pctS(sFrac)}</output></label>
          <label className={c.slider}><span>{t('cores n', 'số lõi n')}</span><input type="range" min={1} max={nMax} value={Math.min(n, nMax)} onChange={(e) => setN(Number(e.target.value))} /><output>{n}</output></label>
          {view === 'hetero' && <label className={c.slider}><span>{t('E-core speed', 'tốc độ lõi E')}</span><input type="range" min={10} max={100} step={5} value={r} onChange={(e) => setR(Number(e.target.value))} /><output>{r} %</output></label>}
          {view === 'hetero' && <label className={c.slider}><span>{t('P cores', 'số lõi P')}</span><input type="range" min={2} max={12} value={P} onChange={(e) => setP(Number(e.target.value))} /><output>{P}</output></label>}
          {view !== 'hetero' && <Seg label={t('measured points', 'chấm số đo')} value={measuredKey ?? ''} options={[['s0', '0 %'], ['s10', '10 %'], ['s25', '25 %']]} onChange={(v) => setS10(v === 's0' ? 0 : v === 's10' ? 100 : 250)} />}
        </div>
      )}
      {view === 'balance' && <div className={s.bar} data-tour="amd-sliders"><Seg value={work} options={[['primes', t('primes (c41)', 'số nguyên tố (c41)')], ['mandel', 'Mandelbrot (c41)']]} onChange={(v) => { setWork(v); p.reset(); labSfx('tap'); }} /></div>}
      <Controls p={p} lang={lang} label={view === 'balance' ? `t = ${Math.round(tNow)} ms` : `n = ${n}`} />
      <Explain tone={view === 'hetero' || (view === 'amdahl' && am < n * 0.6) ? 'warn' : undefined}>{explain()}</Explain>

      <div className={c.cols} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          {view !== 'balance' ? (
            <div className={s.panel} data-tour="amd-chart">
              <div className={s.panelTitle}>{t('Speedup vs cores (log scale)', 'Speedup theo số lõi (thang log)')}</div>
              <SpeedChart curves={curves} dots={dots} nMax={nMax} yMax={yMax} n={Math.min(n, nMax)} refs={refs} lang={lang} />
            </div>
          ) : (
            <div className={s.panel} data-tour="amd-chart">
              {(['block', 'queue'] as const).map((mode) => (
                <div key={mode} style={{ marginBottom: 10 }}>
                  <div className={s.panelTitle}>{mode === 'block' ? t(`Fixed blocks — wall ${B.wall.block} ms`, `Khối cố định — tổng ${B.wall.block} ms`) : t(`Shared queue — wall ${B.wall.queue} ms`, `Hàng đợi chung — tổng ${B.wall.queue} ms`)}</div>
                  <div className={c.bars}>
                    {B[mode].map((ms, k) => (
                      <div key={k} className={c.thr}>
                        <span>{t('thread', 'luồng')} {k}</span>
                        <span className={c.thrTrack}><span className={c.thrFill} style={{ display: 'block', width: `${(100 * Math.min(ms, tNow)) / wall}%`, background: tNow >= ms ? '#94a3b8' : mode === 'block' ? '#dc2626' : '#059669' }} /></span>
                        <span className={s.mono}>{tNow >= ms ? `${ms} ms ✓` : `${Math.round(Math.min(ms, tNow))}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className={s.small}>{t('Grey = finished and idle. Real per-thread busy times from lab/out/c41-c.', 'Xám = đã xong và ngồi chơi. Thời gian bận thật từng luồng lấy từ lab/out/c41-c.')}</div>
            </div>
          )}
          {view === 'karp' && (
            <div className={s.panel} data-tour="amd-karp">
              <div className={s.panelTitle}>{t('Your sweep: "cores ms" per line (paste sweep.sh output)', 'Bảng sweep của bạn: mỗi dòng "lõi ms" (dán output sweep.sh)')}</div>
              <div className={s.bar}>{Object.entries(SETS).map(([k, v]) => <button type="button" key={k} className={cx(s.btn, setKey === k && sweep === v.text && s.on)} onClick={() => { setSetKey(k); setSweep(v.text); labSfx('pop'); }}>{t(v.en, v.vi)}</button>)}</div>
              <textarea className={c.sweep} value={sweep} onChange={(e) => setSweep(e.target.value)} aria-label={t('sweep table', 'bảng sweep')} spellCheck={false} />
              {K.rows.length > 0 && (
                <div className={s.scrollX}>
                  <table className={cx(s.tbl, s.compact)} style={{ marginTop: 6 }}>
                    <thead><tr><th className={s.num}>{t('cores', 'lõi')}</th><th className={s.num}>ms</th><th className={s.num}>speedup</th><th className={s.num}>{t('eff.', 'h.suất')}</th><th className={s.num}>Karp–Flatt e</th></tr></thead>
                    <tbody>{K.rows.map((x) => <tr key={x.cores}><td className={s.num}>{x.cores}</td><td className={s.num}>{x.ms}</td><td className={s.num}>{x.speedup.toFixed(2)}×</td><td className={s.num}>{(x.eff * 100).toFixed(0)} %</td><td className={s.num}>{x.e === null ? '—' : `${(x.e * 100).toFixed(1)} %`}</td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.kpis} data-tour="amd-kpi">
            {view === 'karp' ? <>
              <Kpi k="e" v={K.e === null ? '—' : `${(eFit * 100).toFixed(1)} %`} />
              <Kpi k={t('64 cores', '64 lõi')} v={K.predict[2] ? `${K.predict[2].speedup.toFixed(2)}×` : '—'} tone="warn" />
            </> : view === 'balance' ? <>
              <Kpi k={t('fixed blocks', 'khối cố định')} v={`${B.wall.block} ms`} tone="bad" />
              <Kpi k={t('shared queue', 'hàng đợi')} v={`${B.wall.queue} ms`} tone="ok" />
            </> : <>
              <Kpi k={t('speedup', 'tăng tốc')} v={`${(view === 'gustafson' ? gu : view === 'hetero' ? he : am).toFixed(2)}×`} />
              <Kpi k={t('efficiency', 'hiệu suất')} v={`${((100 * (view === 'gustafson' ? gu : view === 'hetero' ? he : am)) / n).toFixed(0)} %`} />
              {mPt && view === 'amdahl' && <Kpi k={t('measured', 'đo thật')} v={`${mPt[2].toFixed(2)}×`} tone="ok" />}
            </>}
          </div>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('Formulas', 'Công thức')}</div>
            <div className={s.mono} style={{ fontSize: 12, lineHeight: 1.7 }}>
              Amdahl: S = 1 / (s + (1−s)/n)<br />
              Gustafson: S = s + (1−s)·n<br />
              Karp–Flatt: e = (1/S − 1/n) / (1 − 1/n)
            </div>
          </div>
          <WhereBox focus="multicore" lang={lang} height={180} />
        </div>
      </div>
    </Frame>
  );
}
