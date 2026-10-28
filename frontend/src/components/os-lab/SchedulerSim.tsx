'use client';
/** Lập lịch CPU: N lõi, sơ đồ Gantt, FCFS/SJF/SRTF/RR/ưu tiên/MLFQ/CFS, số đo chờ/hoàn thành/đáp ứng. */
import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { simulate, PRESETS, type Policy, type SProc, type PState } from './engine/scheduler';
import { Controls, Explain, Frame, Kpi, Seg, colorOf, css as s, inkOn, tx, usePlayer, type Lang } from './ui';

const POLICIES: Array<[Policy, string]> = [
  ['fcfs', 'FCFS'], ['sjf', 'SJF'], ['srtf', 'SRTF'], ['rr', 'RR'], ['prio', 'Prio'], ['prio-p', 'Prio-P'], ['mlfq', 'MLFQ'], ['cfs', 'CFS'],
];
const POLICY_NOTE: Record<Policy, [string, string]> = {
  fcfs: ['First come, first served: runs each job to the end in arrival order. Simple, but one long job makes everyone wait (convoy effect).', 'Đến trước chạy trước: chạy trọn từng việc theo thứ tự đến. Đơn giản, nhưng một việc dài bắt mọi người chờ (hiệu ứng đoàn xe).'],
  sjf: ['Shortest job first (non-preemptive): when the CPU frees up, pick the shortest job. Best average waiting time if you know the lengths — you usually do not.', 'Việc ngắn nhất trước (không cắt ngang): khi CPU rảnh, chọn việc ngắn nhất. Thời gian chờ trung bình tốt nhất nếu biết trước độ dài — mà thường thì không biết.'],
  srtf: ['Shortest remaining time first: like SJF but a newcomer with less work left preempts the running job.', 'Còn ít việc nhất trước: như SJF nhưng việc mới đến còn ít việc hơn sẽ giành CPU ngay.'],
  rr: ['Round robin: everyone gets a time slice (quantum) in turn. Fair and responsive; more context switches.', 'Xoay vòng: mỗi việc được một lát thời gian (quantum) theo lượt. Công bằng, phản hồi nhanh; nhiều lần chuyển ngữ cảnh hơn.'],
  prio: ['Priority (non-preemptive): smaller number = more important. Low-priority work can starve.', 'Ưu tiên (không cắt ngang): số nhỏ = quan trọng hơn. Việc ưu tiên thấp có thể bị đói.'],
  'prio-p': ['Preemptive priority: a more important arrival takes the CPU at once.', 'Ưu tiên có cắt ngang: việc quan trọng hơn đến là giành CPU ngay.'],
  mlfq: ['Multi-level feedback queue: 3 queues (quantum q, 2q, then FCFS). Using the whole slice = looks CPU-bound → demoted; giving up the CPU for I/O = stays high. Interactive programs stay snappy.', 'Hàng đợi phản hồi đa mức: 3 hàng (quantum q, 2q, rồi FCFS). Dùng hết lát = trông như việc nặng CPU → bị hạ hàng; nhả CPU để chờ I/O = ở lại hàng cao. Chương trình tương tác luôn nhanh nhạy.'],
  cfs: ['Simplified CFS (Linux 2.6.23–6.5; EEVDF since 6.6): always run the task with the smallest virtual runtime. A higher nice value makes vruntime grow faster, so it gets a smaller share.', 'CFS rút gọn (Linux 2.6.23–6.5; từ 6.6 là EEVDF): luôn chạy tác vụ có vruntime nhỏ nhất. nice càng cao thì vruntime tăng càng nhanh nên phần CPU càng ít.'],
};
const STATE_LABEL: Record<PState, [string, string]> = {
  na: ['not arrived', 'chưa đến'], ready: ['ready (waiting for a CPU)', 'sẵn sàng (chờ CPU)'], run: ['running', 'đang chạy'],
  cs: ['context switch', 'chuyển ngữ cảnh'], blocked: ['blocked on I/O', 'chờ I/O'], done: ['finished', 'xong'],
};

export default function SchedulerSim({ lang = 'vi', preset = 'textbook' }: { lang?: Lang; preset?: string }) {
  const P0 = PRESETS[preset] ?? PRESETS.textbook;
  const [procs, setProcs] = useState<SProc[]>(P0.procs);
  const [policy, setPolicy] = useState<Policy>(P0.opts.policy ?? 'fcfs');
  const [cores, setCores] = useState(P0.opts.cores ?? 1);
  const [quantum, setQuantum] = useState(P0.opts.quantum ?? 2);
  const [cs, setCs] = useState(P0.opts.cs ?? 0);
  const [view, setView] = useState<'proc' | 'core'>('proc');
  const [presetKey, setPresetKey] = useState(preset in PRESETS ? preset : 'textbook');

  const res = useMemo(() => simulate(procs, { policy, cores, quantum, cs }), [procs, policy, cores, quantum, cs]);
  const p = usePlayer(res.ticks.length, 800);
  const tick = res.ticks[Math.min(p.i, res.ticks.length - 1)];
  const color = (id: string) => colorOf(procs.findIndex((x) => x.id === id));

  const loadPreset = (k: string) => {
    const pr = PRESETS[k]; if (!pr) return;
    setPresetKey(k); setProcs(pr.procs); setPolicy(pr.opts.policy ?? 'fcfs'); setCores(pr.opts.cores ?? 1);
    setQuantum(pr.opts.quantum ?? 2); setCs(pr.opts.cs ?? 0); p.reset();
  };
  const edit = (k: number, patch: Partial<SProc>) => { setProcs((ps) => ps.map((x, j) => (j === k ? { ...x, ...patch } : x))); p.reset(); };
  const add = () => {
    setProcs((ps) => {
      let n = ps.length + 1; while (ps.some((x) => x.id === `P${n}`)) n++;
      return [...ps, { id: `P${n}`, arrival: Math.min(20, ps.length), burst: 3, prio: 2 }];
    });
    p.reset();
  };
  const del = (k: number) => { setProcs((ps) => (ps.length > 1 ? ps.filter((_, j) => j !== k) : ps)); p.reset(); };

  // ── Gantt ──
  const end = res.end;
  const cw = Math.max(16, Math.min(30, Math.floor(720 / Math.max(1, end))));
  const lw = 74, rh = 26, top = 22;
  const rows = view === 'proc' ? procs.map((x) => x.id) : Array.from({ length: cores }, (_, k) => `CPU ${k}`);
  const W = lw + end * cw + 10, H = top + rows.length * (rh + 6) + 8;
  const cur = Math.min(p.i, end);

  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
  const finishedBy = (id: string) => res.stats[id].finish >= 0 && res.stats[id].finish <= tick.t;

  return (
    <Frame badge={tx(lang, 'OS lab', 'Phòng lab OS')} title={tx(lang, 'CPU scheduling', 'Lập lịch CPU')} sub={tx(lang, 'Who gets the CPU, when, and what it costs everyone else', 'Ai được CPU, lúc nào, và những người khác phải trả giá ra sao')}>
      <div className={s.bar}>
        <span className={s.lbl}>{tx(lang, 'Scenario', 'Kịch bản')}
          <select value={presetKey} onChange={(e) => loadPreset(e.target.value)}>
            {Object.entries(PRESETS).map(([k, v]) => <option key={k} value={k}>{tx(lang, v.en, v.vi)}</option>)}
          </select>
        </span>
        <Seg label={tx(lang, 'Policy', 'Chính sách')} value={policy} options={POLICIES} onChange={(v) => { setPolicy(v); p.reset(); }} />
      </div>
      <div className={s.bar}>
        <span className={s.lbl}>{tx(lang, 'Cores', 'Số lõi')}
          <input type="number" min={1} max={4} value={cores} onChange={(e) => { setCores(Math.max(1, Math.min(4, Number(e.target.value) || 1))); p.reset(); }} /></span>
        <span className={s.lbl}>{policy === 'cfs' ? tx(lang, 'Min slice', 'Lát tối thiểu') : 'Quantum'}
          <input type="number" min={1} max={10} value={quantum} onChange={(e) => { setQuantum(Math.max(1, Math.min(10, Number(e.target.value) || 1))); p.reset(); }} disabled={!['rr', 'mlfq', 'cfs'].includes(policy)} /></span>
        <span className={s.lbl}>{tx(lang, 'Switch cost (ticks)', 'Giá chuyển ngữ cảnh (tick)')}
          <input type="number" min={0} max={3} value={cs} onChange={(e) => { setCs(Math.max(0, Math.min(3, Number(e.target.value) || 0))); p.reset(); }} /></span>
      </div>
      <Explain>{tx(lang, POLICY_NOTE[policy][0], POLICY_NOTE[policy][1])}</Explain>

      <div className={s.scrollX} style={{ marginTop: 10 }}>
        <table className={s.tbl} style={{ minWidth: 520 }}>
          <thead><tr>
            <th>ID</th><th className={s.num}>{tx(lang, 'Arrival', 'Đến lúc')}</th><th className={s.num}>{tx(lang, 'Burst', 'Cần CPU')}</th>
            <th className={s.num}>{policy === 'cfs' ? 'nice' : tx(lang, 'Priority', 'Ưu tiên')}</th>
            <th>{tx(lang, 'I/O: every / for', 'I/O: mỗi / trong')}</th><th />
          </tr></thead>
          <tbody>
            {procs.map((x, k) => (
              <tr key={k}>
                <td><span className={s.chip} style={{ background: colorOf(k), color: inkOn(colorOf(k)) }}>{x.id}</span></td>
                <td className={s.num}><input type="number" min={0} max={30} value={x.arrival} onChange={(e) => edit(k, { arrival: Math.max(0, Math.min(30, Number(e.target.value) || 0)) })} /></td>
                <td className={s.num}><input type="number" min={1} max={30} value={x.burst} onChange={(e) => edit(k, { burst: Math.max(1, Math.min(30, Number(e.target.value) || 1)) })} /></td>
                <td className={s.num}><input type="number" min={-20} max={19} value={x.prio} onChange={(e) => edit(k, { prio: Math.max(-20, Math.min(19, Number(e.target.value) || 0)) })} /></td>
                <td className={s.nowrap}>
                  <input type="number" min={0} max={10} value={x.io?.every ?? 0} title={tx(lang, 'CPU ticks between I/O waits (0 = no I/O)', 'Số tick CPU giữa hai lần chờ I/O (0 = không I/O)')}
                    onChange={(e) => { const ev = Math.max(0, Math.min(10, Number(e.target.value) || 0)); edit(k, { io: ev ? { every: ev, dur: x.io?.dur ?? 3 } : null }); }} />
                  {' '}/{' '}
                  <input type="number" min={1} max={10} value={x.io?.dur ?? 3} disabled={!x.io} onChange={(e) => edit(k, { io: x.io ? { every: x.io.every, dur: Math.max(1, Math.min(10, Number(e.target.value) || 1)) } : null })} />
                </td>
                <td><button type="button" className={s.btn} onClick={() => del(k)} aria-label={tx(lang, 'Remove', 'Xoá')} disabled={procs.length <= 1}><Trash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.bar}>
        <button type="button" className={s.btn} onClick={add} disabled={procs.length >= 8}><Plus />{tx(lang, 'Add a process', 'Thêm tiến trình')}</button>
        <Seg label={tx(lang, 'Gantt rows', 'Hàng Gantt')} value={view} options={[['proc', tx(lang, 'per process', 'theo tiến trình')], ['core', tx(lang, 'per core', 'theo lõi')]]} onChange={setView} />
      </div>

      <Controls p={p} lang={lang} label={`t = ${tick.t}${p.atEnd ? tx(lang, ' · all done', ' · xong hết') : ''}`} />

      <div className={s.grid3}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, `CPU cores (${cores})`, `Lõi CPU (${cores})`)}</div>
          <div className={s.chips}>
            {tick.cores.map((c, k) => (
              <span key={k} className={s.chip} title={`CPU ${k}`} style={{
                background: c.pid ? (c.kind === 'cs' ? 'var(--ol-panel2)' : color(c.pid)) : 'transparent',
                color: c.pid ? (c.kind === 'cs' ? 'var(--ol-muted)' : inkOn(color(c.pid))) : 'var(--ol-muted)',
                borderColor: c.pid ? color(c.pid) : 'var(--ol-border)', borderStyle: c.pid ? 'solid' : 'dashed', minWidth: 64,
              }}>{k}: {c.pid ? (c.kind === 'cs' ? `⇄ ${c.pid}` : c.pid) : tx(lang, 'idle', 'rảnh')}</span>
            ))}
          </div>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, 'Ready queue (head → tail)', 'Hàng sẵn sàng (đầu → cuối)')}</div>
          <div className={s.chips}>
            {tick.ready.length ? tick.ready.map((id) => (
              <span key={id} className={s.chip} style={{ background: color(id), color: inkOn(color(id)) }}>
                {id}{policy === 'mlfq' ? ` ·L${tick.level[id]}` : policy === 'cfs' ? ` ·${tick.vruntime[id]}` : ['sjf', 'srtf'].includes(policy) ? ` ·${tick.remaining[id]}` : ''}
              </span>
            )) : <span className={s.empty}>{tx(lang, 'empty', 'trống')}</span>}
          </div>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, 'Blocked on I/O', 'Đang chờ I/O')}</div>
          <div className={s.chips}>
            {tick.blocked.length ? tick.blocked.map((id) => (
              <span key={id} className={s.chip} style={{ background: 'transparent', color: color(id), borderColor: color(id), borderStyle: 'dashed' }}>{id}</span>
            )) : <span className={s.empty}>{tx(lang, 'nobody', 'không ai')}</span>}
          </div>
        </div>
      </div>

      <div className={s.svgWrap} style={{ marginTop: 10 }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={tx(lang, 'Gantt chart', 'Sơ đồ Gantt')}>
          <defs>
            <pattern id="ol-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="var(--ol-panel2)" /><line x1="0" y1="0" x2="0" y2="6" stroke="var(--ol-muted)" strokeWidth="2" />
            </pattern>
          </defs>
          {Array.from({ length: end + 1 }, (_, t) => (
            <g key={t}>
              <line x1={lw + t * cw} y1={top - 4} x2={lw + t * cw} y2={H - 6} className={s.svgGrid} strokeWidth={t % 5 === 0 ? 1.2 : 0.6} />
              {(end <= 30 || t % 5 === 0) && <text x={lw + t * cw} y={13} fontSize={10} textAnchor="middle" className={s.svgMuted}>{t}</text>}
            </g>
          ))}
          {rows.map((r, ri) => {
            const y = top + ri * (rh + 6);
            return (
              <g key={r}>
                <text x={6} y={y + rh / 2 + 4} fontSize={12} fontWeight={700} className={s.svgText}>{r}</text>
                {res.ticks.slice(0, end).map((tk, t) => {
                  if (t > cur) return null;
                  const x = lw + t * cw + 1;
                  if (view === 'proc') {
                    const st = tk.state[r];
                    if (st === 'na' || st === 'done') return null;
                    const c = color(r);
                    if (st === 'run') return <rect key={t} x={x} y={y} width={cw - 2} height={rh} rx={3} fill={c} />;
                    if (st === 'cs') return <rect key={t} x={x} y={y} width={cw - 2} height={rh} rx={3} fill="url(#ol-hatch)" />;
                    if (st === 'blocked') return <rect key={t} x={x + 2} y={y + 8} width={cw - 6} height={rh - 16} rx={2} fill="none" stroke={c} strokeDasharray="3 2" />;
                    return <rect key={t} x={x} y={y + 9} width={cw - 2} height={rh - 18} rx={2} fill={c} opacity={0.28} />;
                  }
                  const cell = tk.cores[ri];
                  if (!cell || !cell.pid) return null;
                  if (cell.kind === 'cs') return <rect key={t} x={x} y={y} width={cw - 2} height={rh} rx={3} fill="url(#ol-hatch)" />;
                  return (
                    <g key={t}>
                      <rect x={x} y={y} width={cw - 2} height={rh} rx={3} fill={color(cell.pid)} />
                      {(t === 0 || res.ticks[t - 1].cores[ri]?.pid !== cell.pid) && cw * 2 > cell.pid.length * 7 &&
                        <text x={x + 3} y={y + rh / 2 + 4} fontSize={10.5} fontWeight={800} fill={inkOn(color(cell.pid))}>{cell.pid}</text>}
                    </g>
                  );
                })}
              </g>
            );
          })}
          <line x1={lw + cur * cw} y1={top - 6} x2={lw + cur * cw} y2={H - 4} stroke="var(--ol-bad)" strokeWidth={2} />
        </svg>
      </div>
      <div className={s.small} style={{ margin: '2px 0 8px' }}>
        {view === 'proc'
          ? tx(lang, 'Solid = running · thin bar = ready, waiting for a CPU · dashed = blocked on I/O · hatched = context switch', 'Khối đặc = đang chạy · vạch mảnh = sẵn sàng, chờ CPU · nét đứt = chờ I/O · gạch chéo = chuyển ngữ cảnh')
          : tx(lang, 'Each row is one core; hatched cells are time lost to context switches.', 'Mỗi hàng là một lõi; ô gạch chéo là thời gian mất cho chuyển ngữ cảnh.')}
      </div>

      <Explain tone={tick.events.some((e) => e.kind === 'preempt') ? 'warn' : tick.events.some((e) => e.kind === 'done') ? 'ok' : undefined}>
        <b>t = {tick.t}.</b>{' '}
        {tick.events.length ? tick.events.map((e) => tx(lang, e.en, e.vi)).join(' · ') : tx(lang, 'Nothing changes this tick — the cores keep running what they have.', 'Tick này không có gì đổi — các lõi chạy tiếp việc đang có.')}
        {' '}
        {procs.filter((x) => tick.state[x.id] !== 'na' && tick.state[x.id] !== 'done').map((x) => `${x.id}: ${tx(lang, STATE_LABEL[tick.state[x.id]][0], STATE_LABEL[tick.state[x.id]][1])}`).join(' · ')}
      </Explain>

      <div className={s.grid2} style={{ marginTop: 10 }}>
        <div className={s.scrollX}>
          <table className={s.tbl}>
            <thead><tr>
              <th>ID</th><th className={s.num}>{tx(lang, 'First run', 'Chạy lần đầu')}</th><th className={s.num}>{tx(lang, 'Finish', 'Xong')}</th>
              <th className={s.num} title="finish − arrival">{tx(lang, 'Turnaround', 'Hoàn thành')}</th>
              <th className={s.num} title={tx(lang, 'time spent in the ready queue', 'thời gian nằm trong hàng sẵn sàng')}>{tx(lang, 'Waiting', 'Chờ')}</th>
              <th className={s.num} title="first run − arrival">{tx(lang, 'Response', 'Đáp ứng')}</th>
            </tr></thead>
            <tbody>
              {procs.map((x) => {
                const st = res.stats[x.id]; const ok = finishedBy(x.id);
                return (
                  <tr key={x.id}>
                    <td style={{ color: color(x.id), fontWeight: 800 }}>{x.id}</td>
                    <td className={s.num}>{st.first >= 0 && st.first <= tick.t ? st.first : '…'}</td>
                    <td className={s.num}>{ok ? st.finish : '…'}</td>
                    <td className={s.num}>{ok ? st.turnaround : '…'}</td>
                    <td className={s.num}>{ok ? st.waiting : '…'}</td>
                    <td className={s.num}>{st.first >= 0 && st.first <= tick.t ? st.response : '…'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={s.stack}>
          <div className={s.kpis}>
            <Kpi k={tx(lang, 'avg waiting', 'chờ TB')} v={p.atEnd ? fmt(res.avg.waiting) : '…'} />
            <Kpi k={tx(lang, 'avg turnaround', 'hoàn thành TB')} v={p.atEnd ? fmt(res.avg.turnaround) : '…'} />
            <Kpi k={tx(lang, 'avg response', 'đáp ứng TB')} v={p.atEnd ? fmt(res.avg.response) : '…'} />
            <Kpi k={tx(lang, 'switches', 'lần chuyển')} v={res.switches} tone={res.switches > procs.length * 2 ? 'warn' : undefined} />
            <Kpi k={tx(lang, 'CPU busy', 'CPU bận')} v={`${Math.round((100 * res.busy) / Math.max(1, res.end * cores))}%`} />
          </div>
          <div className={s.small}>
            {tx(lang,
              'Turnaround = finish − arrival. Waiting = ticks spent in the ready queue (= turnaround − burst when there is no I/O). Response = first run − arrival. Press Play to fill the table, then switch the policy and compare.',
              'Hoàn thành = lúc xong − lúc đến. Chờ = số tick nằm trong hàng sẵn sàng (= hoàn thành − thời gian cần CPU khi không có I/O). Đáp ứng = lần chạy đầu − lúc đến. Bấm Chạy cho bảng đầy, rồi đổi chính sách và so sánh.')}
          </div>
        </div>
      </div>
    </Frame>
  );
}
