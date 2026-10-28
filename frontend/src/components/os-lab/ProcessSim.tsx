'use client';
/** Tiến trình: cây cha–con, máy trạng thái, fork/exec/wait/exit, zombie, mồ côi, exit 137, luồng — xem từng bước hoặc tự bấm. */
import { useMemo, useState } from 'react';
import { GitFork, Hourglass, LogOut, Skull, Cpu, Layers, Play as PlayI, Pause as PauseI, Terminal } from 'lucide-react';
import { SCENARIOS, STATE_EDGES, apply, psLines, run, stat, type Act, type PSt, type Proc, type World } from './engine/process';
import { Controls, Explain, Frame, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { useLabBridge } from '../labs/bus';

const ST_COLOR: Record<PSt, string> = { running: '#15803d', ready: '#2563eb', blocked: '#64748b', stopped: '#d97706', zombie: '#dc2626' };
const ST_NAME: Record<PSt | 'new' | 'gone', [string, string]> = {
  new: ['New', 'Mới tạo'], ready: ['Ready · R', 'Sẵn sàng · R'], running: ['Running · R', 'Đang chạy · R'], blocked: ['Blocked · S/D', 'Bị chặn · S/D'],
  stopped: ['Stopped · T', 'Tạm dừng · T'], zombie: ['Zombie · Z', 'Zombie · Z'], gone: ['Reaped', 'Đã dọn'],
};
const BOX: Record<PSt | 'new' | 'gone', [number, number, number, number]> = {
  new: [8, 24, 92, 48], ready: [140, 14, 130, 70], running: [320, 14, 130, 70], blocked: [140, 168, 130, 70],
  stopped: [320, 168, 130, 70], zombie: [476, 96, 96, 70], gone: [476, 200, 96, 44],
};
const EDGE_PATH: Record<string, string> = {
  'new>ready': 'M100,48 L140,48',
  'ready>running': 'M270,36 L320,36',
  'running>ready': 'M320,64 L270,64',
  'running>blocked': 'M346,84 L262,168',
  'blocked>ready': 'M184,168 L184,84',
  'running>stopped': 'M410,84 L410,168',
  'stopped>ready': 'M320,180 C270,150 250,120 236,84',
  'running>zombie': 'M450,50 C490,50 520,70 524,96',
  'zombie>gone': 'M524,166 L524,200',
};

function useWorlds(scId: string) {
  const sc = SCENARIOS.find((x) => x.id === scId) ?? SCENARIOS[0];
  return { sc, worlds: useMemo(() => run(sc), [sc]) };
}

function layoutTree(w: World) {
  const kids = new Map<number, Proc[]>();
  for (const p of w.procs) { if (!kids.has(p.ppid)) kids.set(p.ppid, []); kids.get(p.ppid)!.push(p); }
  for (const v of kids.values()) v.sort((a, b) => a.pid - b.pid);
  const pos = new Map<number, { x: number; y: number }>();
  let leaf = 0;
  const walk = (p: Proc, d: number): number => {
    const ch = kids.get(p.pid) ?? [];
    let x: number;
    if (!ch.length) x = leaf++;
    else { const xs = ch.map((c) => walk(c, d + 1)); x = (xs[0] + xs[xs.length - 1]) / 2; }
    pos.set(p.pid, { x, y: d });
    return x;
  };
  const roots = w.procs.filter((p) => !w.procs.some((q) => q.pid === p.ppid));
  for (const r of roots) walk(r, 0);
  return { pos, leaves: Math.max(1, leaf), depth: Math.max(1, ...[...pos.values()].map((v) => v.y + 1)) };
}

export default function ProcessSim({ lang = 'vi', preset = 'shell' }: { lang?: Lang; preset?: string }) {
  const [mode, setMode] = useState<string>(SCENARIOS.some((x) => x.id === preset) ? preset : preset === 'sandbox' ? 'sandbox' : 'shell');
  const { sc, worlds } = useWorlds(mode === 'sandbox' ? 'shell' : mode);
  // hộp cát: lịch sử thế giới do người dùng tạo
  const sandboxStart: World = useMemo(() => ({
    procs: [
      { pid: 1, ppid: 0, name: 'systemd', st: 'blocked', threads: 1 },
      { pid: 100, ppid: 1, name: 'bash', st: 'running', threads: 1 },
    ], next: 101, term: ['$ ./a.out   # pick a process, then press a button'], reaped: [],
  }), []);
  const [hist, setHist] = useState<{ w: World; en: string; vi: string }[]>([{ w: sandboxStart, en: 'Click a process in the tree, then use the buttons.', vi: 'Bấm chọn một tiến trình trên cây, rồi dùng các nút.' }]);
  const [sel, setSel] = useState(100);
  const sandbox = mode === 'sandbox';
  const total = sandbox ? hist.length : worlds.length;
  const p = usePlayer(total, 1500);
  const idx = Math.min(p.i, total - 1);
  const w = sandbox ? hist[idx].w : worlds[idx];
  const prev = sandbox ? hist[Math.max(0, idx - 1)].w : worlds[Math.max(0, idx - 1)];
  const step = sandbox ? null : idx > 0 ? sc.steps[idx - 1] : null;

  const doAct = (acts: Act[], en: string, vi: string) => {
    let nw = hist[idx].w;
    for (const a of acts) nw = apply(nw, a);
    const nh = [...hist.slice(0, idx + 1), { w: nw, en, vi }];
    setHist(nh); p.setI(nh.length - 1);
    window.setTimeout(() => p.setI(nh.length - 1), 0);
  };
  const selP = w.procs.find((x) => x.pid === sel);
  useLabBridge('process', {
    mode, i: p.i, procs: w.procs.length, zombies: w.procs.filter((q) => q.st === 'zombie').length,
    pids: w.procs.map((q) => `${q.pid}:${q.st}`).join(' '),
  }, { mode: (v) => { setMode(String(v)); p.reset(); } });

  // các chuyển trạng thái của bước này (để tô mũi tên)
  const moves = new Set<string>();
  for (const q of w.procs) {
    const old = prev.procs.find((x) => x.pid === q.pid);
    if (!old) moves.add('new>ready');
    else if (old.st !== q.st) moves.add(`${old.st}>${q.st}`);
  }
  for (const q of prev.procs) if (!w.procs.some((x) => x.pid === q.pid)) moves.add('zombie>gone');
  if (moves.has('blocked>running')) { moves.add('blocked>ready'); moves.add('ready>running'); }
  if (moves.has('ready>zombie')) { moves.add('ready>running'); moves.add('running>zombie'); }
  if (moves.has('blocked>zombie')) moves.add('running>zombie');

  const tree = layoutTree(w);
  const NW = 104, NH = 40, GX = 112, GY = 62;
  const TW = Math.max(300, tree.leaves * GX + 10), TH = tree.depth * GY + 10;
  const nodeX = (x: number) => 6 + x * GX, nodeY = (y: number) => 6 + y * GY;

  return (
    <Frame badge={tx(lang, 'OS lab', 'Phòng lab OS')} title={tx(lang, 'Processes: the family tree and the state machine', 'Tiến trình: cây gia phả và máy trạng thái')}
      sub={tx(lang, 'fork, exec, wait, exit — and what ps would show at every step', 'fork, exec, wait, exit — và ps sẽ hiện gì ở từng bước')}>
      <div className={s.bar} data-tour="proc-scenario">
        <span className={s.lbl}>{tx(lang, 'Scenario', 'Kịch bản')}
          <select value={mode} onChange={(e) => { setMode(e.target.value); p.reset(); }}>
            {SCENARIOS.map((x) => <option key={x.id} value={x.id}>{tx(lang, x.en, x.vi)}</option>)}
            <option value="sandbox">{tx(lang, '🧪 Sandbox: do it yourself', '🧪 Hộp cát: tự bấm')}</option>
          </select>
        </span>
      </div>
      <Controls p={p} lang={lang} />
      {sandbox && (
        <div className={s.bar}>
          <span className={s.lbl}>{tx(lang, 'Selected', 'Đang chọn')}: <b className={s.mono}>{selP ? `${selP.pid} ${selP.name}` : '—'}</b></span>
          <button type="button" className={s.btn} disabled={!selP || selP.st === 'zombie' || w.procs.length > 14}
            onClick={() => doAct([{ k: 'fork', pid: sel }], `${sel} called fork(): new child ${hist[idx].w.next}.`, `${sel} gọi fork(): con mới ${hist[idx].w.next}.`)}><GitFork />fork()</button>
          <button type="button" className={s.btn} disabled={!selP || selP.st === 'zombie' || sel === 1}
            onClick={() => doAct([{ k: 'exec', pid: sel, prog: selP?.name === 'node' ? 'python3' : 'node' }], `${sel} called exec(): same PID, new program.`, `${sel} gọi exec(): vẫn PID cũ, chương trình mới.`)}><Layers />exec()</button>
          <button type="button" className={s.btn} disabled={!selP || selP.st === 'zombie'}
            onClick={() => doAct([{ k: 'run', pid: sel }], `The scheduler gives the CPU to ${sel}.`, `Bộ lập lịch cho ${sel} CPU.`)}><Cpu />{tx(lang, 'give CPU', 'cho CPU')}</button>
          <button type="button" className={s.btn} disabled={!selP || selP.st === 'zombie'}
            onClick={() => doAct([{ k: 'block', pid: sel }], `${sel} blocks (read/sleep): state S.`, `${sel} bị chặn (read/sleep): trạng thái S.`)}><Hourglass />{tx(lang, 'sleep / I/O', 'ngủ / I/O')}</button>
          <button type="button" className={s.btn} disabled={!selP || selP.st === 'zombie'}
            onClick={() => doAct([{ k: selP?.st === 'stopped' ? 'cont' : 'stop', pid: sel }], selP?.st === 'stopped' ? `SIGCONT: ${sel} resumes.` : `SIGSTOP (Ctrl-Z): ${sel} is stopped (T).`, selP?.st === 'stopped' ? `SIGCONT: ${sel} chạy tiếp.` : `SIGSTOP (Ctrl-Z): ${sel} tạm dừng (T).`)}>{selP?.st === 'stopped' ? <PlayI /> : <PauseI />}{selP?.st === 'stopped' ? 'SIGCONT' : 'SIGSTOP'}</button>
          <button type="button" className={s.btn} disabled={!selP || selP.st === 'zombie' || sel === 1}
            onClick={() => doAct([{ k: 'exit', pid: sel, code: 0 }], `${sel} exited: zombie until its parent calls wait(). Its children (if any) now belong to PID 1.`, `${sel} thoát: zombie cho tới khi cha gọi wait(). Con của nó (nếu có) giờ thuộc PID 1.`)}><LogOut />exit(0)</button>
          <button type="button" className={cx(s.btn, s.danger)} disabled={!selP || selP.st === 'zombie' || sel === 1}
            onClick={() => doAct([{ k: 'kill', pid: sel, sig: 9 }], `kill -9 ${sel}: SIGKILL, exit status 137.`, `kill -9 ${sel}: SIGKILL, mã thoát 137.`)}><Skull />kill -9</button>
          <button type="button" className={s.btn} disabled={!selP || selP.st === 'zombie'}
            onClick={() => doAct([{ k: 'wait', pid: sel }], `${sel} called wait(): reaps one zombie child, or sleeps until a child exits.`, `${sel} gọi wait(): dọn một con zombie, hoặc ngủ tới khi có con thoát.`)}>wait()</button>
          <button type="button" className={s.btn} disabled={!selP || selP.st === 'zombie' || (selP?.threads ?? 0) >= 6}
            onClick={() => doAct([{ k: 'thread', pid: sel }], `pthread_create in ${sel}: one more thread, same PID.`, `pthread_create trong ${sel}: thêm một luồng, cùng PID.`)}>+ {tx(lang, 'thread', 'luồng')}</button>
        </div>
      )}

      <Explain tone={step && /exit|kill/.test(JSON.stringify(step.a)) ? 'warn' : undefined}>
        {sandbox ? tx(lang, hist[idx].en, hist[idx].vi) : step ? tx(lang, step.en, step.vi) : tx(lang, `Start: ${sc.en}. Press Play or Step.`, `Bắt đầu: ${sc.vi}. Bấm Chạy hoặc Bước.`)}
      </Explain>

      <div className={s.grid2} style={{ marginTop: 10 }}>
        <div className={s.stack}>
          <div className={s.panel} data-tour="proc-tree">
            <div className={s.panelTitle}>{tx(lang, 'Process tree (pstree)', 'Cây tiến trình (pstree)')}</div>
            <div className={s.svgWrap}>
              <svg width={TW} height={TH} viewBox={`0 0 ${TW} ${TH}`} role="img" aria-label="process tree">
                {w.procs.map((q) => {
                  const a = tree.pos.get(q.pid), b = tree.pos.get(q.ppid);
                  if (!a || !b) return null;
                  return <line key={`e${q.pid}`} x1={nodeX(b.x) + NW / 2} y1={nodeY(b.y) + NH} x2={nodeX(a.x) + NW / 2} y2={nodeY(a.y)} className={s.svgBorder} strokeWidth={1.6} />;
                })}
                {w.procs.map((q) => {
                  const a = tree.pos.get(q.pid); if (!a) return null;
                  const x = nodeX(a.x), y = nodeY(a.y), c = ST_COLOR[q.st];
                  const isNew = !prev.procs.some((o) => o.pid === q.pid);
                  return (
                    <g key={q.pid} style={{ cursor: sandbox ? 'pointer' : 'default' }} onClick={() => sandbox && setSel(q.pid)}>
                      <rect x={x} y={y} width={NW} height={NH} rx={8} fill="var(--ol-bg)" stroke={c} strokeWidth={sandbox && sel === q.pid ? 3.5 : isNew ? 3 : 2} strokeDasharray={q.st === 'zombie' ? '5 3' : undefined} />
                      <text x={x + 7} y={y + 16} fontSize={12} fontWeight={800} fill={c}>{q.pid}</text>
                      <text x={x + 7 + String(q.pid).length * 8 + 4} y={y + 16} fontSize={11.5} className={s.svgText}>{q.name.length > 10 ? q.name.slice(0, 9) + '…' : q.name}</text>
                      <text x={x + 7} y={y + 32} fontSize={10.5} className={s.svgMuted}>{stat(q)} · {tx(lang, ST_NAME[q.st][0].split(' ·')[0], ST_NAME[q.st][1].split(' ·')[0])}{q.threads > 1 ? ` · ${q.threads}🧵` : ''}{q.st === 'zombie' && q.exit !== undefined ? ` · ${q.exit}` : ''}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
          <div className={s.term} data-tour="proc-ps">{psLines(w).join('\n')}{w.procs.some((q) => (q.rss ?? 0) >= 100) ? '\n\n' + w.procs.filter((q) => (q.rss ?? 0) >= 100).map((q) => `RSS ${q.pid} ${q.name}: ${q.rss} MB`).join('\n') : ''}</div>
          <div className={s.term} aria-label="terminal"><Terminal style={{ width: 13, height: 13, verticalAlign: '-2px' }} /> {w.term.length ? '\n' + w.term.slice(-8).join('\n') : ''}</div>
        </div>
        <div className={s.stack}>
          <div className={s.panel} data-tour="proc-states">
            <div className={s.panelTitle}>{tx(lang, 'State machine (who is where now)', 'Máy trạng thái (ai đang ở đâu)')}</div>
            <div className={s.svgWrap}>
              <svg width="100%" viewBox="0 0 580 250" role="img" aria-label="process states" style={{ maxWidth: 580, height: 'auto' }}>
                <defs>
                  <marker id="ol-ps-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ol-muted)" /></marker>
                  <marker id="ol-ps-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ol-bad)" /></marker>
                </defs>
                {STATE_EDGES.map(([a, b]) => {
                  const k = `${a}>${b}`, hot = moves.has(k);
                  return <path key={k} d={EDGE_PATH[k]} fill="none" stroke={hot ? 'var(--ol-bad)' : 'var(--ol-muted)'} strokeWidth={hot ? 3.2 : 1.4} markerEnd={`url(#${hot ? 'ol-ps-h' : 'ol-ps-a'})`} opacity={hot ? 1 : 0.7} />;
                })}
                {(Object.keys(BOX) as Array<keyof typeof BOX>).map((k) => {
                  const [x, y, bw, bh] = BOX[k];
                  const here = k === 'new' || k === 'gone' ? [] : w.procs.filter((q) => q.st === k);
                  const c = k === 'new' || k === 'gone' ? 'var(--ol-muted)' : ST_COLOR[k];
                  return (
                    <g key={k}>
                      <rect x={x} y={y} width={bw} height={bh} rx={10} fill="var(--ol-panel)" stroke={c} strokeWidth={here.length ? 2.6 : 1.4} />
                      <text x={x + bw / 2} y={y + 18} fontSize={11.5} fontWeight={800} textAnchor="middle" fill={c}>{tx(lang, ST_NAME[k][0], ST_NAME[k][1])}</text>
                      {k === 'gone' && <text x={x + bw / 2} y={y + 34} fontSize={10.5} textAnchor="middle" className={s.svgMuted}>{w.reaped.slice(-3).join(' ')}</text>}
                      {here.slice(0, 6).map((q, j) => (
                        <text key={q.pid} x={x + 8 + (j % 3) * 40} y={y + 38 + Math.floor(j / 3) * 18} fontSize={11.5} fontWeight={700} fill={c}>{q.pid}</text>
                      ))}
                      {here.length > 6 && <text x={x + bw - 8} y={y + bh - 6} fontSize={10} textAnchor="end" className={s.svgMuted}>+{here.length - 6}</text>}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className={s.small}>{tx(lang, 'Red arrows = transitions that happened in this step. Linux ps letters: R (ready or running), S (sleeping), D (uninterruptible, usually disk I/O), T (stopped), Z (zombie).', 'Mũi tên đỏ = chuyển trạng thái vừa xảy ra ở bước này. Chữ của ps trên Linux: R (sẵn sàng hoặc đang chạy), S (ngủ), D (ngủ không ngắt được, thường là I/O đĩa), T (tạm dừng), Z (zombie).')}</div>
          </div>
          {!sandbox && (
            <div className={s.code} aria-label="code" data-tour="proc-code">
              {sc.code.map((ln, k) => <span key={k} className={cx(s.ln, step?.line === k + 1 && s.cur)}>{ln || ' '}</span>)}
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
