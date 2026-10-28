'use client';
/** cgroup v2: dòng thời gian bộ nhớ (memory.high / memory.max → thu hồi → throttle → OOM 137) và CPU quota (cpu.max). */
import { useMemo, useState } from 'react';
import { cpuQuota, memTimeline, type MemCfg } from './engine/cgroup';
import { useWidth } from './charts';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';

const MEM_PRE: Record<string, { cfg: Partial<MemCfg>; en: string; vi: string }> = {
  oom: { cfg: {}, en: 'A service leaks 40 MiB/s inside a container with memory.max = 512M (docker run -m 512m). Watch memory.current climb into the ceiling.', vi: 'Một dịch vụ rò 40 MiB/s trong container có memory.max = 512M (docker run -m 512m). Nhìn memory.current leo lên chạm trần.' },
  high: { cfg: { high: 384 }, en: 'Same leak, plus memory.high = 384M (systemd MemoryHigh=). Above it the kernel reclaims and throttles: the service slows down and memory.pressure rises — your early warning — but a real leak still ends at memory.max.', vi: 'Cùng lỗi rò, thêm memory.high = 384M (systemd MemoryHigh=). Vượt mức đó kernel thu hồi và throttle: dịch vụ chậm lại, memory.pressure tăng — tín hiệu báo sớm của bạn — nhưng rò thật thì cuối cùng vẫn chạm memory.max.' },
  cache: { cfg: { leak: 0, base: 150, cacheRate: 60 }, en: 'No leak: the service streams a 4 GB file. memory.current hits the ceiling and stays there — it is page cache, reclaimable. No OOM. Look at memory.stat (anon vs file) before panicking.', vi: 'Không rò: dịch vụ đọc tuần tự một file 4 GB. memory.current chạm trần và nằm yên đó — đó là page cache, lấy lại được. Không OOM. Xem memory.stat (anon vs file) trước khi hoảng.' },
  swap: { cfg: { swapMax: 200 }, en: 'With memory.swap.max = 200M the kernel can push anonymous pages to swap first: the kill comes 5 s later, and those 5 s are very slow.', vi: 'Với memory.swap.max = 200M kernel được đẩy trang ẩn danh ra swap trước: cú giết đến muộn 5 giây, và 5 giây đó rất chậm.' },
  restart: { cfg: { restart: true }, en: 'restart: always (or a Kubernetes pod): killed, restarted, killed… the restart count climbs, the logs say nothing — check docker inspect → State.OOMKilled, or memory.events.', vi: 'restart: always (hay một pod Kubernetes): bị giết, chạy lại, bị giết… số lần restart tăng, log không nói gì — xem docker inspect → State.OOMKilled, hoặc memory.events.' },
};
const BASE: MemCfg = { max: 512, high: Infinity, swapMax: 0, base: 100, leak: 40, cacheRate: 4, restart: false, duration: 40 };
const COL = { anon: '#dc2626', file: '#d97706', swap: '#7c3aed' };

function Num({ label, v, min, max, step = 1, on, fmt }: { label: string; v: number; min: number; max: number; step?: number; on: (x: number) => void; fmt?: (x: number) => string }) {
  return (
    <label className={s.lbl} style={{ display: 'grid', gridTemplateColumns: 'minmax(110px,auto) minmax(0,1fr) 62px', gap: 6, width: '100%' }}>
      <span>{label}</span><input type="range" min={min} max={max} step={step} value={v} onChange={(e) => on(Number(e.target.value))} />
      <span className={s.mono} style={{ textAlign: 'right', color: 'var(--ol-text)' }}>{fmt ? fmt(v) : v}</span>
    </label>
  );
}

export default function CgroupSim({ lang = 'vi', preset = 'oom' }: { lang?: Lang; preset?: string }) {
  const [tab, setTab] = useState<'mem' | 'cpu'>(preset === 'cpuquota' || preset === 'cputhreads' ? 'cpu' : 'mem');
  const t = (en: string, vi: string) => tx(lang, en, vi);
  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('cgroups: what a container limit really does', 'cgroup: giới hạn của container thật ra làm gì')} sub={t('memory.high, memory.max, OOM kill 137 — and cpu.max throttling', 'memory.high, memory.max, OOM kill 137 — và throttle của cpu.max')}>
      <div className={s.tabs}>
        <button type="button" className={cx(s.tab, tab === 'mem' && s.on)} onClick={() => setTab('mem')}>{t('Memory', 'Bộ nhớ')}</button>
        <button type="button" className={cx(s.tab, tab === 'cpu' && s.on)} onClick={() => setTab('cpu')}>CPU (cpu.max)</button>
      </div>
      {tab === 'mem' ? <MemTab lang={lang} preset={MEM_PRE[preset] ? preset : 'oom'} /> : <CpuTab lang={lang} preset={preset} />}
    </Frame>
  );
}

function MemTab({ lang, preset }: { lang: Lang; preset: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [key, setKey] = useState(preset);
  const [cfg, setCfg] = useState<MemCfg>({ ...BASE, ...MEM_PRE[preset].cfg });
  const pts = useMemo(() => memTimeline(cfg), [cfg]);
  const p = usePlayer(pts.length, 90);
  const P = pts[Math.min(p.i, pts.length - 1)];
  const set = (patch: Partial<MemCfg>) => { setCfg((c) => ({ ...c, ...patch })); p.reset(); };
  const lastNote = [...pts.slice(0, p.i + 1)].reverse().find((x) => x.note)?.note;
  const [box, W] = useWidth<HTMLDivElement>();
  const H = 190, L = 44, R = 8, T = 10, B = 20;
  const top = Math.max(cfg.max, ...pts.map((x) => x.current + x.swap)) * 1.08;
  const X = (k: number) => L + ((W - L - R) * k) / (pts.length - 1), Y = (v: number) => T + (H - T - B) * (1 - v / top);
  const area = (lo: (q: (typeof pts)[0]) => number, hi: (q: (typeof pts)[0]) => number) => {
    const upto = Math.min(p.i, pts.length - 1);
    const a = pts.slice(0, upto + 1).map((q, k) => `${X(k).toFixed(1)},${Y(hi(q)).toFixed(1)}`);
    const b = pts.slice(0, upto + 1).map((q, k) => `${X(k).toFixed(1)},${Y(lo(q)).toFixed(1)}`).reverse();
    return `M${a.join('L')}L${b.join('L')}Z`;
  };
  const kill = pts.find((x) => x.oomKill > 0 && x.t <= P.t);
  return (
    <>
      <div className={s.bar}>
        <span className={s.lbl}>{t('Scenario', 'Kịch bản')}</span>
        {Object.keys(MEM_PRE).map((k) => <button type="button" key={k} className={cx(s.btn, key === k && s.on)} onClick={() => { setKey(k); setCfg({ ...BASE, ...MEM_PRE[k].cfg }); p.reset(); }}>{k}</button>)}
      </div>
      <Explain>{t(MEM_PRE[key].en, MEM_PRE[key].vi)}</Explain>
      <div className={s.grid2} style={{ marginTop: 8 }}>
        <div className={s.stack} style={{ gap: 4 }}>
          <Num label="memory.max" v={cfg.max} min={256} max={1024} step={32} on={(x) => set({ max: x, high: Math.min(cfg.high, x) })} fmt={(x) => `${x}M`} />
          <Num label="memory.high" v={Number.isFinite(cfg.high) ? cfg.high : cfg.max} min={128} max={cfg.max} step={32} on={(x) => set({ high: x >= cfg.max ? Infinity : x })} fmt={(x) => (x >= cfg.max ? 'max' : `${x}M`)} />
          <Num label="memory.swap.max" v={cfg.swapMax} min={0} max={512} step={64} on={(x) => set({ swapMax: x })} fmt={(x) => `${x}M`} />
        </div>
        <div className={s.stack} style={{ gap: 4 }}>
          <Num label={t('leak (anon)', 'rò (anon)')} v={cfg.leak} min={0} max={120} step={5} on={(x) => set({ leak: x })} fmt={(x) => `${x}M/s`} />
          <Num label={t('file reads (cache)', 'đọc file (cache)')} v={cfg.cacheRate} min={0} max={120} step={10} on={(x) => set({ cacheRate: x })} fmt={(x) => `${x}M/s`} />
          <label className={s.lbl}><input type="checkbox" checked={cfg.restart} onChange={(e) => set({ restart: e.target.checked })} />restart: always</label>
        </div>
      </div>
      <Controls p={p} lang={lang} label={`t = ${P.t.toFixed(1)} s`} />
      <div ref={box} style={{ minWidth: 0 }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }} role="img" aria-label="memory timeline">
          {[0, 0.5, 1].map((f) => <g key={f}><line x1={L} x2={W - R} y1={Y(top * f / 1.08)} y2={Y(top * f / 1.08)} className={s.svgGrid} /><text x={L - 4} y={Y(top * f / 1.08) + 4} fontSize={11} textAnchor="end" className={s.svgMuted}>{Math.round(top * f / 1.08)}M</text></g>)}
          <path d={area(() => 0, (q) => q.anon)} fill={COL.anon} opacity={0.85} />
          <path d={area((q) => q.anon, (q) => q.anon + q.file)} fill={COL.file} opacity={0.75} />
          <path d={area((q) => q.anon + q.file, (q) => q.anon + q.file + q.swap)} fill={COL.swap} opacity={0.55} />
          <line x1={L} x2={W - R} y1={Y(cfg.max)} y2={Y(cfg.max)} stroke="var(--ol-bad)" strokeWidth={2} strokeDasharray="7 4" />
          <text x={W - R - 2} y={Y(cfg.max) - 4} fontSize={11.5} textAnchor="end" fill="var(--ol-bad)" fontWeight={800}>memory.max {cfg.max}M</text>
          {Number.isFinite(cfg.high) && <><line x1={L} x2={W - R} y1={Y(cfg.high)} y2={Y(cfg.high)} stroke="var(--ol-warn)" strokeWidth={2} strokeDasharray="4 4" /><text x={W - R - 2} y={Y(cfg.high) - 4} fontSize={11.5} textAnchor="end" fill="var(--ol-warn)" fontWeight={800}>memory.high {cfg.high}M</text></>}
          {pts.filter((x, k) => k <= p.i && x.note?.tone === 'bad').map((x) => { const k = pts.indexOf(x); return <g key={k}><line x1={X(k)} x2={X(k)} y1={T} y2={H - B} stroke="var(--ol-bad)" strokeWidth={2} /><text x={X(k) + 3} y={T + 22} fontSize={11} fill="var(--ol-bad)" fontWeight={800}>💀 137</text></g>; })}
          <text x={L} y={H - 4} fontSize={11} className={s.svgMuted}>0 s</text><text x={W - R} y={H - 4} fontSize={11} textAnchor="end" className={s.svgMuted}>{cfg.duration} s</text>
        </svg>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px', fontSize: 11.5 }}>
          {([['anon', t('anon (heap, the leak)', 'anon (heap, chỗ rò)')], ['file', t('file (page cache — reclaimable)', 'file (page cache — lấy lại được)')], ['swap', 'swap']] as const).map(([k, n]) => <span key={k} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: COL[k] }} />{n}</span>)}
        </div>
      </div>
      {lastNote && <div style={{ marginTop: 8 }}><Explain tone={lastNote.tone}>{t(lastNote.en, lastNote.vi)}</Explain></div>}
      <div className={s.grid2} style={{ marginTop: 8, alignItems: 'start' }}>
        <div className={s.term}>
          {`$ cd /sys/fs/cgroup/system.slice/docker-3f9c…scope
$ cat memory.current memory.max memory.high
${Math.round(P.current * 1048576)}
${cfg.max * 1048576}
${Number.isFinite(cfg.high) ? cfg.high * 1048576 : 'max'}
$ grep -E '^(anon|file) ' memory.stat
anon ${Math.round(P.anon * 1048576)}
file ${Math.round(P.file * 1048576)}
$ cat memory.events
low 0
high ${P.high}
max ${P.maxEv}
oom ${P.oom}
oom_kill ${P.oomKill}
$ head -1 memory.pressure
some avg10=${(P.psi * 100).toFixed(2)} avg60=${(P.psi * 60).toFixed(2)} avg300=${(P.psi * 20).toFixed(2)} total=${Math.round(P.high * 41000)}`}
        </div>
        <div className={s.stack}>
          <div className={s.kpis}>
            <Kpi k="memory.current" v={`${Math.round(P.current)}M`} tone={P.current >= cfg.max - 1 ? 'bad' : P.current > cfg.high ? 'warn' : undefined} />
            <Kpi k="oom_kill" v={P.oomKill} tone={P.oomKill ? 'bad' : 'ok'} />
            <Kpi k={t('stall (PSI)', 'nghẽn (PSI)')} v={`${Math.round(P.psi * 100)}%`} tone={P.psi > 0.5 ? 'bad' : P.psi > 0.1 ? 'warn' : undefined} />
          </div>
          <div className={s.term} style={{ minHeight: 0 }}>
            {`$ docker ps -a --format '{{.Names}}  {{.Status}}'
report  ${P.alive ? `Up ${Math.floor(P.t)} seconds` : 'Exited (137) 1 second ago'}${kill ? `
$ docker inspect -f '{{.State.OOMKilled}}' report
true` : ''}${kill ? `
$ dmesg | tail -1
Memory cgroup out of memory: Killed process 4242 (java) total-vm:… anon-rss:${cfg.max * 1024}kB` : ''}`}
          </div>
          <div className={s.small}>{t('memory.high is a soft limit you SET (throttle + reclaim, never kill); memory.max is the hard wall (OOM kill inside the cgroup). Docker -m and Kubernetes limits.memory set memory.max.', 'memory.high là giới hạn mềm bạn tự ĐẶT (throttle + thu hồi, không bao giờ giết); memory.max là bức tường cứng (OOM kill bên trong cgroup). Docker -m và limits.memory của Kubernetes đặt memory.max.')}</div>
        </div>
      </div>
    </>
  );
}

function CpuTab({ lang, preset }: { lang: Lang; preset: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [quota, setQuota] = useState(50);
  const [threads, setThreads] = useState(preset === 'cputhreads' ? 4 : 1);
  const [work, setWork] = useState(preset === 'cputhreads' ? 30 : 120);
  const cores = 4, period = 100;
  const r = useMemo(() => cpuQuota({ quota: quota >= 400 ? Infinity : quota, period, cores, threads, work }), [quota, threads, work]);
  const ideal = useMemo(() => cpuQuota({ quota: Infinity, period, cores, threads, work }).end, [threads, work]);
  const len = r.run.length;
  const p = usePlayer(Math.ceil(len / 5) + 1, 60);
  const now = Math.min(len, p.i * 5);
  const [box, W] = useWidth<HTMLDivElement>();
  const H = 150, L = 34, Rr = 8, T = 10, B = 22;
  const span = Math.max(len, ideal, period * Math.ceil(len / period));
  const X = (ms: number) => L + ((W - L - Rr) * ms) / span, Y = (c: number) => T + (H - T - B) * (1 - c / cores);
  return (
    <>
      <Explain>{t(`cpu.max = "${quota >= 400 ? 'max' : quota * 1000} ${period * 1000}" means: this cgroup may use ${quota >= 400 ? 'unlimited' : quota} ms of CPU time in every ${period} ms window, summed over ALL cores. ${threads} thread(s) that each need ${work} ms. When the quota is gone, every thread in the cgroup stops until the next window — even though cores are idle.`, `cpu.max = "${quota >= 400 ? 'max' : quota * 1000} ${period * 1000}" nghĩa là: cgroup này được dùng ${quota >= 400 ? 'không giới hạn' : `${quota} ms`} thời gian CPU trong mỗi cửa sổ ${period} ms, cộng trên MỌI lõi. ${threads} luồng, mỗi luồng cần ${work} ms. Hết quota là mọi luồng trong cgroup đứng im tới cửa sổ sau — dù lõi đang rảnh.`)}</Explain>
      <div className={s.grid2} style={{ marginTop: 8 }}>
        <div className={s.stack} style={{ gap: 4 }}>
          <Num label={t('quota per 100 ms', 'quota mỗi 100 ms')} v={quota} min={10} max={400} step={10} on={(x) => { setQuota(x); p.reset(); }} fmt={(x) => (x >= 400 ? 'max' : `${x} ms`)} />
          <div className={s.small}>{quota >= 400 ? '' : t(`= --cpus=${(quota / 100).toFixed(1)} in Docker`, `= --cpus=${(quota / 100).toFixed(1)} trong Docker`)}</div>
        </div>
        <div className={s.stack} style={{ gap: 4 }}>
          <Num label={t('threads', 'số luồng')} v={threads} min={1} max={8} on={(x) => { setThreads(x); p.reset(); }} />
          <Num label={t('CPU per thread', 'CPU mỗi luồng')} v={work} min={10} max={300} step={10} on={(x) => { setWork(x); p.reset(); }} fmt={(x) => `${x} ms`} />
        </div>
      </div>
      <div className={s.bar}><Seg label={t('Try', 'Thử')} value="" options={[['a', t('1 thread, 120 ms', '1 luồng, 120 ms')], ['b', t('4 threads, 30 ms each (a JVM at startup)', '4 luồng, mỗi luồng 30 ms (JVM lúc khởi động)')]]} onChange={(v) => { if (v === 'a') { setThreads(1); setWork(120); } else { setThreads(4); setWork(30); } setQuota(50); p.reset(); }} /></div>
      <Controls p={p} lang={lang} label={`${now} ms`} />
      <div ref={box} style={{ minWidth: 0 }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }} role="img" aria-label="cpu timeline">
          {Array.from({ length: Math.ceil(span / period) }, (_, k) => <g key={k}><rect x={X(k * period)} y={T} width={X(period) - X(0)} height={H - T - B} fill={k % 2 ? 'var(--ol-panel)' : 'var(--ol-panel2)'} /><text x={X(k * period) + 3} y={H - 6} fontSize={10.5} className={s.svgMuted}>{k * period}</text></g>)}
          {r.run.slice(0, now).map((c, ms) => r.throttled[ms]
            ? <rect key={ms} x={X(ms)} y={T} width={Math.max(0.6, X(1) - X(0))} height={H - T - B} fill="var(--ol-bad)" opacity={0.18} />
            : <rect key={ms} x={X(ms)} y={Y(c)} width={Math.max(0.6, X(1) - X(0))} height={Y(0) - Y(c)} fill="#2563eb" />)}
          {[1, 2, 3, 4].map((c) => <text key={c} x={L - 4} y={Y(c) + 4} fontSize={10.5} textAnchor="end" className={s.svgMuted}>{c}</text>)}
          <line x1={X(ideal)} x2={X(ideal)} y1={T} y2={H - B} stroke="var(--ol-ok)" strokeWidth={2} strokeDasharray="4 3" />
          <text x={X(ideal) + 3} y={T + 12} fontSize={10.5} fill="var(--ol-ok)" fontWeight={800}>{t('no limit', 'không giới hạn')}</text>
        </svg>
        <div className={s.small}>{t('Blue = cores busy (0–4). Red band = throttled: the whole cgroup is frozen until the next 100 ms window.', 'Xanh = số lõi đang bận (0–4). Dải đỏ = bị throttle: cả cgroup đứng hình tới cửa sổ 100 ms kế tiếp.')}</div>
      </div>
      <div className={s.grid2} style={{ marginTop: 8, alignItems: 'start' }}>
        <div className={s.kpis}>
          <Kpi k={t('finished at', 'xong lúc')} v={`${+r.end.toFixed(1)} ms`} tone={r.end > ideal * 1.5 ? 'bad' : 'ok'} />
          <Kpi k={t('without the limit', 'không giới hạn')} v={`${+ideal.toFixed(1)} ms`} />
          <Kpi k={t('slower by', 'chậm hơn')} v={`×${(r.end / ideal).toFixed(1)}`} tone={r.end > ideal * 1.5 ? 'bad' : undefined} />
        </div>
        <div className={s.term}>{`$ cat /sys/fs/cgroup/…/cpu.stat
usage_usec ${Math.round(threads * work * 1000)}
nr_periods ${r.nrPeriods}
nr_throttled ${r.nrThrottled}
throttled_usec ${Math.round(r.throttledMs * 1000)}`}</div>
      </div>
      <div className={s.small} style={{ marginTop: 6 }}>{t('This is why p99 latency jumps by ~100 ms in containers with a CPU limit: a request that needs 20 ms of CPU but lands after the quota ran out waits for the next window. Multi-threaded runtimes (JVM, Go, Node with a thread pool) burn the quota fastest.', 'Đây là lý do p99 nhảy thêm ~100 ms trong container có giới hạn CPU: một request cần 20 ms CPU mà đến sau khi quota đã hết thì phải chờ cửa sổ sau. Runtime nhiều luồng (JVM, Go, Node có thread pool) đốt quota nhanh nhất.')}</div>
    </>
  );
}
