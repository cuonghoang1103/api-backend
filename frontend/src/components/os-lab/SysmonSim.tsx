'use client';
/**
 * Phòng máy top/htop: một máy Linux ảo chạy từng giây; người học bơm sự cố, đọc các cột như máy thật, gõ lệnh chẩn đoán
 * (free, df, vmstat, iostat, dmesg, lsof…), can thiệp (kill, renice, ionice, truncate, cgroup.kill) và trả lời "máy bị gì?".
 */
import { useMemo, useState } from 'react';
import { Flame, RotateCcw, Stethoscope, Terminal } from 'lucide-react';
import { act, cmd, COMMANDS, initSys, inject, SCENS, symptoms, tick, TOP_COLS, topHeader, topLine, topRows, type Action, type Cmd, type Scen, type Sys } from './engine/sysmon';
import { useLivePlayer } from './live';
import { LineChart, Meter } from './charts';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, type Lang } from './ui';

const SC: Record<Scen, { en: string; vi: string; icon: string }> = {
  cpuhog: { en: 'CPU hog', vi: 'Chiếm CPU', icon: '🔥' },
  memleak: { en: 'Memory leak', vi: 'Rò bộ nhớ', icon: '💧' },
  diskfull: { en: 'Log fills the disk', vi: 'Log làm đầy đĩa', icon: '💾' },
  iostorm: { en: 'I/O storm (backup)', vi: 'Bão I/O (sao lưu)', icon: '🌪️' },
  forkbomb: { en: 'Fork bomb (in a cgroup)', vi: 'Fork bomb (trong cgroup)', icon: '💣' },
  zombies: { en: 'Zombie pile-up', vi: 'Zombie dồn đống', icon: '🧟' },
};
const PRESETS = ['calm', 'cpuhog', 'memleak', 'diskfull', 'iostorm', 'forkbomb', 'zombies', 'mystery'];
const ANSWERS: Array<['none' | Scen, string, string]> = [
  ['none', 'Nothing — it is healthy', 'Không sao — máy khoẻ'], ['cpuhog', 'CPU saturated by one program', 'Một chương trình ăn hết CPU'],
  ['memleak', 'Running out of memory', 'Sắp hết bộ nhớ'], ['diskfull', 'Disk (filesystem) full', 'Đầy ổ đĩa'],
  ['iostorm', 'Disk I/O saturated', 'Đĩa bị nghẽn I/O'], ['forkbomb', 'Too many processes (fork bomb)', 'Quá nhiều tiến trình (fork bomb)'],
  ['zombies', 'Zombie processes piling up', 'Zombie dồn đống'],
];

const HINTS: Array<{ key: string; en: string; vi: string; cmds: string; why: [string, string] }> = [
  { key: 'load', en: 'Load average', vi: 'Load average', cmds: 'uptime · cat /proc/loadavg · nproc', why: ['Tasks running + waiting for a CPU + waiting for disk (state D), averaged over 1/5/15 min. Compare with nproc: load 8 on 8 cores is full, on 2 cores is a queue of 6.', 'Số tác vụ đang chạy + chờ CPU + chờ đĩa (trạng thái D), trung bình 1/5/15 phút. So với nproc: load 8 trên 8 lõi là vừa kín, trên 2 lõi là hàng đợi 6.'] },
  { key: 'cpu', en: '%CPU and us/sy/wa', vi: '%CPU và us/sy/wa', cmds: 'top (P) · ps -eo pid,comm,%cpu --sort=-%cpu · mpstat -P ALL 1 · pidstat 1', why: ['us = your code, sy = the kernel working for you, ni = niced code, wa = idle CPUs waiting for the disk. %CPU per process is per core: 380% = almost 4 cores.', 'us = mã của bạn, sy = kernel làm hộ, ni = mã đã nice, wa = CPU rảnh ngồi chờ đĩa. %CPU từng tiến trình tính theo lõi: 380% ≈ gần 4 lõi.'] },
  { key: 'mem', en: 'Memory: free vs available', vi: 'Bộ nhớ: free vs available', cmds: 'free -m · ps -eo pid,comm,rss --sort=-rss · dmesg -T | grep -i oom · journalctl -k', why: ['Look at "available", not "free": Linux fills spare RAM with buff/cache and gives it back on demand. RES = RAM a process really uses; VIRT = address space it reserved (often huge, harmless).', 'Nhìn cột "available", đừng nhìn "free": Linux lấp RAM rảnh bằng buff/cache và trả lại khi cần. RES = RAM tiến trình dùng thật; VIRT = vùng địa chỉ nó giữ chỗ (thường rất lớn, vô hại).'] },
  { key: 'disk', en: 'Disk space', vi: 'Dung lượng đĩa', cmds: 'df -h · du -sh /var/log/* | sort -h · lsof +L1', why: ['df = filesystem view, du = files you can still see by name. df ≫ du means a deleted file is still held open: lsof +L1.', 'df = góc nhìn hệ thống file, du = các file còn tên. df ≫ du nghĩa là có file đã xoá nhưng vẫn bị giữ mở: lsof +L1.'] },
  { key: 'io', en: 'Disk I/O', vi: 'I/O đĩa', cmds: 'iostat -x 1 · iotop -o · pidstat -d 1 · ps -eo stat,pid,comm | grep ^D', why: ['%util near 100 and await in the tens/hundreds of ms = the disk is the bottleneck. Processes stuck in D (uninterruptible) count toward load even though they use no CPU.', '%util gần 100 và await hàng chục/trăm ms = đĩa là nút cổ chai. Tiến trình kẹt ở D (không ngắt được) vẫn tính vào load dù không dùng CPU.'] },
  { key: 'pids', en: 'Process count / zombies', vi: 'Số tiến trình / zombie', cmds: "ps -e --no-headers | wc -l · ps -eo stat,pid,ppid,comm | grep '^Z' · cat …/pids.current", why: ['A zombie (Z) has exited but its parent has not called wait(): no CPU, no RAM, only a PID slot. Fix the parent. A fork bomb is stopped by pids.max of its cgroup.', 'Zombie (Z) đã thoát nhưng cha chưa gọi wait(): không CPU, không RAM, chỉ giữ một PID. Sửa tiến trình cha. Fork bomb bị chặn bởi pids.max của cgroup.'] },
];

const gb = (mib: number) => (mib / 1024).toFixed(1);

function readings(S: Sys, lang: Lang): Array<{ tone: 'ok' | 'warn' | 'bad'; t: string }> {
  const y = symptoms(S), out: Array<{ tone: 'ok' | 'warn' | 'bad'; t: string }> = [];
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const lpc = y.loadPerCore;
  out.push({ tone: lpc > 1.2 ? 'bad' : lpc > 0.8 ? 'warn' : 'ok', t: t(`Load ${S.load[0].toFixed(2)} on ${S.cores} cores = ${lpc.toFixed(2)} per core${lpc > 1 ? ' → more tasks want to run than there are cores. Is it CPU (us+sy high) or disk (wa high, state D)?' : ' → there is spare capacity.'}`, `Load ${S.load[0].toFixed(2)} trên ${S.cores} lõi = ${lpc.toFixed(2)} mỗi lõi${lpc > 1 ? ' → số tác vụ muốn chạy nhiều hơn số lõi. Do CPU (us+sy cao) hay do đĩa (wa cao, trạng thái D)?' : ' → còn dư sức.'}`) });
  if (S.load[0] > S.load[2] * 1.6 && S.load[0] > 1) out.push({ tone: 'warn', t: t('1-minute load ≫ 15-minute load: the problem started recently and is getting worse.', 'Load 1 phút ≫ load 15 phút: sự cố mới bắt đầu và đang tệ dần.') });
  if (y.cpuBusy > 85) out.push({ tone: 'bad', t: t(`CPU ${y.cpuBusy.toFixed(0)}% busy (us ${S.cpu.us.toFixed(0)} · sy ${S.cpu.sy.toFixed(0)} · ni ${S.cpu.ni.toFixed(0)}). Sort top by %CPU (P) to see who.${S.cpu.sy > 30 ? ' High sy = the kernel is busy (forking, swapping, syscalls).' : ''}`, `CPU bận ${y.cpuBusy.toFixed(0)}% (us ${S.cpu.us.toFixed(0)} · sy ${S.cpu.sy.toFixed(0)} · ni ${S.cpu.ni.toFixed(0)}). Sắp top theo %CPU (P) để thấy ai.${S.cpu.sy > 30 ? ' sy cao = kernel đang bận (fork, swap, syscall).' : ''}`) });
  if (S.cpu.wa > 15) out.push({ tone: 'bad', t: t(`wa ${S.cpu.wa.toFixed(0)}%: CPUs sit idle waiting for the disk. iostat -x: %util ${S.io.util.toFixed(0)}, await ${S.io.await.toFixed(0)} ms.`, `wa ${S.cpu.wa.toFixed(0)}%: CPU ngồi không chờ đĩa. iostat -x: %util ${S.io.util.toFixed(0)}, await ${S.io.await.toFixed(0)} ms.`) });
  out.push({ tone: y.availPct < 10 ? 'bad' : y.availPct < 25 ? 'warn' : 'ok', t: t(`available ${gb(S.mem.avail)} GiB of ${gb(S.memTotal)} (${y.availPct.toFixed(0)}%). "free" is ${gb(S.mem.free)} GiB${S.mem.free < 1024 && y.availPct > 25 ? ' — small, and that is fine: buff/cache is given back on demand' : ''}.`, `available ${gb(S.mem.avail)} GiB trên ${gb(S.memTotal)} (${y.availPct.toFixed(0)}%). "free" là ${gb(S.mem.free)} GiB${S.mem.free < 1024 && y.availPct > 25 ? ' — nhỏ, và không sao: buff/cache được trả lại khi cần' : ''}.`) });
  if (S.swapUsed > 50) out.push({ tone: S.so > 0 ? 'bad' : 'warn', t: t(`Swap ${Math.round(S.swapUsed)} MiB used${S.so > 0 ? ', pages are being swapped out right now (vmstat so > 0, kswapd0 busy) — the machine will feel frozen' : ''}.`, `Swap đã dùng ${Math.round(S.swapUsed)} MiB${S.so > 0 ? ', trang đang bị đẩy ra ngay lúc này (vmstat so > 0, kswapd0 bận) — máy sẽ như đơ' : ''}.`) });
  out.push({ tone: y.diskPct >= 99 ? 'bad' : y.diskPct > 85 ? 'warn' : 'ok', t: t(`/ is ${y.diskPct.toFixed(0)}% full${y.diskPct >= 99 ? ' — every write fails with ENOSPC (database included!)' : y.diskPct > 85 ? ' and growing? Run df twice, a few seconds apart.' : ''}.`, `/ đã đầy ${y.diskPct.toFixed(0)}%${y.diskPct >= 99 ? ' — mọi lệnh ghi lỗi ENOSPC (cả CSDL!)' : y.diskPct > 85 ? ' và đang tăng? Chạy df hai lần cách nhau vài giây.' : ''}.`) });
  if (y.zombies > 0) out.push({ tone: y.zombies > 100 ? 'bad' : 'warn', t: t(`${y.zombies} zombies (S = Z). They cost nothing but PIDs; they all share one parent.`, `${y.zombies} zombie (cột S = Z). Không tốn gì ngoài PID; tất cả chung một cha.`) });
  if (y.tasks > 400) out.push({ tone: 'bad', t: t(`${y.tasks} tasks — normally ~110. Something is forking like crazy.`, `${y.tasks} tác vụ — bình thường ~110. Có thứ gì đó đang fork điên cuồng.`) });
  return out;
}

export default function SysmonSim({ lang = 'vi', preset = 'calm' }: { lang?: Lang; preset?: string }) {
  const pre = PRESETS.includes(preset) ? preset : 'calm';
  const [mystery] = useState<Scen>(() => SCENS[Math.floor(Math.random() * SCENS.length)]);
  const first = (): Sys => (pre === 'mystery' ? initSys([mystery]) : pre === 'calm' ? initSys([]) : initSys([pre as Scen]));
  const { p, S, hist, apply, restart } = useLivePlayer<Sys>(first, tick, 1000, 900);
  const [sort, setSort] = useState<'cpu' | 'mem'>('cpu');
  const [sel, setSel] = useState<number | null>(null);
  const [term, setTerm] = useState<Cmd | null>(null);
  const [note, setNote] = useState<{ en: string; vi: string; tone: 'ok' | 'bad' | 'warn' } | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const hidden = pre === 'mystery' && !answer;

  const rows = useMemo(() => topRows(S, sort, 13), [S, sort]);
  const selRow = rows.find((r) => r.pid === sel) ?? null;
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const doAct = (a: Action) => {
    const box: { r?: ReturnType<typeof act> } = {};
    apply((x) => { box.r = act(x, a); return box.r.s; });
    if (box.r) setNote({ en: box.r.en, vi: box.r.vi, tone: box.r.tone });
  };
  const add = (sc: Scen) => { apply((x) => inject(x, sc)); setNote(null); };
  const reset = () => { restart(first()); setNote(null); setSel(null); setAnswer(null); setTerm(null); };
  const y = symptoms(S);
  const last = hist.slice(-120);
  const truth = S.scen.length ? S.scen : ['none'];

  const C = { us: '#16a34a', ni: '#2563eb', sy: '#dc2626', wa: '#94a3b8', used: '#16a34a', cache: '#d97706', swap: '#dc2626', disk: '#7c3aed' };
  const lpc = S.load[0] / S.cores;

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('System monitor: read top/htop like an SRE', 'Phòng máy: đọc top/htop như người trực hệ thống')}
      sub={t('A virtual 4-core Linux box, one second per step. Break it, read it, fix it.', 'Một máy Linux ảo 4 lõi, mỗi bước một giây. Làm hỏng nó, đọc nó, sửa nó.')}>
      {pre !== 'mystery' || answer ? (
        <div className={s.bar}>
          <span className={s.lbl}><Flame style={{ width: 14, height: 14 }} />{t('Inject an incident', 'Bơm sự cố')}</span>
          {SCENS.map((k) => (
            <button type="button" key={k} className={cx(s.btn, S.scen.includes(k) && s.on)} onClick={() => add(k)} disabled={S.scen.includes(k)}>{SC[k].icon} {t(SC[k].en, SC[k].vi)}</button>
          ))}
          <button type="button" className={s.btn} onClick={reset}><RotateCcw />{t('Fresh machine', 'Máy mới')}</button>
        </div>
      ) : (
        <Explain tone="warn"><b>{t('Mystery machine.', 'Máy bí ẩn.')}</b> {t('Users say "the site is slow". Something is wrong with this server — press Play, watch for 30–60 s, run the commands below, then answer at the bottom. Hints unlock after you answer.', 'Người dùng kêu "web chậm". Máy chủ này có chuyện — bấm Chạy, quan sát 30–60 giây, gõ các lệnh bên dưới, rồi trả lời ở cuối. Gợi ý mở sau khi bạn trả lời.')}</Explain>
      )}
      <Controls p={p} lang={lang} label={`t = ${S.t} s`} />

      <div className={s.grid2} style={{ alignItems: 'start' }}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{t('htop-style meters', 'Thanh đo kiểu htop')}</div>
          <div className={s.stack} style={{ gap: 5 }}>
            <Meter label="CPU" total={100} parts={[{ v: S.cpu.us, color: C.us, name: 'us' }, { v: S.cpu.ni, color: C.ni, name: 'ni' }, { v: S.cpu.sy, color: C.sy, name: 'sy' }, { v: S.cpu.wa, color: C.wa, name: 'wa' }]}
              right={`${(100 - S.cpu.id).toFixed(0)}%`} />
            <Meter label="Mem" total={S.memTotal} parts={[{ v: S.mem.used, color: C.used, name: 'used' }, { v: S.cache, color: C.cache, name: 'buff/cache' }]} right={`${gb(S.mem.used)}G/${gb(S.memTotal)}G`} />
            <Meter label="Swp" total={S.swapTotal} parts={[{ v: S.swapUsed, color: C.swap }]} right={`${Math.round(S.swapUsed)}M/${S.swapTotal}M`} />
            <Meter label="Disk" total={S.disk.size} parts={[{ v: S.disk.used, color: y.diskPct >= 99 ? C.swap : C.disk }]} right={`${S.disk.used.toFixed(1)}G/${S.disk.size}G`} />
            <Meter label="I/O" total={100} parts={[{ v: S.io.util, color: S.io.util > 90 ? C.swap : C.wa }]} right={`util ${S.io.util.toFixed(0)}%`} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px', fontSize: 11.5, marginTop: 6 }}>
            {([['us', C.us, t('user', 'người dùng')], ['ni', C.ni, 'nice'], ['sy', C.sy, 'kernel'], ['wa', C.wa, 'iowait'], ['buff/cache', C.cache, t('cache (reclaimable)', 'cache (lấy lại được)')]] as const).map(([k, c, n]) => (
              <span key={k} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><span style={{ width: 10, height: 10, background: c, borderRadius: 2, display: 'inline-block' }} />{k} = {n}</span>
            ))}
          </div>
          <div className={s.kpis} style={{ marginTop: 8 }}>
            <Kpi k={t('load / cores', 'load / lõi')} v={`${S.load[0].toFixed(2)} / ${S.cores}`} tone={lpc > 1.2 ? 'bad' : lpc > 0.8 ? 'warn' : 'ok'} />
            <Kpi k="available" v={`${gb(S.mem.avail)}G`} tone={y.availPct < 10 ? 'bad' : y.availPct < 25 ? 'warn' : 'ok'} />
            <Kpi k={t('tasks', 'tác vụ')} v={y.tasks} tone={y.tasks > 400 ? 'bad' : undefined} />
            <Kpi k={t('API p99 (users feel)', 'API p99 (người dùng thấy)')} v={S.apiMs === null ? 'DOWN' : S.apiMs > 10000 ? t('> 10 s (timeouts)', '> 10 s (timeout)') : `${Math.round(S.apiMs)} ms`} tone={S.apiMs === null || S.apiMs > 300 ? 'bad' : S.apiMs > 80 ? 'warn' : 'ok'} />
          </div>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{t('Last 2 minutes', '2 phút gần nhất')}</div>
          <LineChart height={92} title={t('load average (1 min) — dashed line = number of cores', 'load average (1 phút) — vạch đứt = số lõi')} series={[{ name: 'load1', color: '#2563eb', data: last.map((x) => x.load[0]), area: true }]} refs={[{ y: S.cores, label: `${S.cores} ${t('cores', 'lõi')}` }]} />
          <LineChart height={92} title={t('available memory (MiB) · disk used (%) · iowait (%)', 'bộ nhớ available (MiB) · đĩa đã dùng (%) · iowait (%)')} yMax={100}
            series={[{ name: t('available % of RAM', 'available % RAM'), color: C.used, data: last.map((x) => (100 * x.mem.avail) / x.memTotal) }, { name: t('disk %', 'đĩa %'), color: C.disk, data: last.map((x) => (100 * x.disk.used) / x.disk.size) }, { name: 'wa %', color: '#64748b', data: last.map((x) => x.cpu.wa), dash: '4 3' }]} />
        </div>
      </div>

      <div className={s.panel} style={{ marginTop: 10 }}>
        <div className={s.bar} style={{ marginTop: 0 }}>
          <span className={s.panelTitle} style={{ margin: 0 }}>top</span>
          <Seg value={sort} options={[['cpu', t('sort by %CPU (P)', 'sắp theo %CPU (P)')], ['mem', t('sort by %MEM (M)', 'sắp theo %MEM (M)')]]} onChange={setSort} />
          <span className={s.small}>{t('Tap a row to act on that process.', 'Chạm một dòng để xử lý tiến trình đó.')}</span>
        </div>
        <div className={s.term} style={{ padding: '6px 0', whiteSpace: 'pre' }}>
          {topHeader(S).map((l, k) => <div key={k} style={{ padding: '0 10px' }}>{l}</div>)}
          <div style={{ padding: '0 10px', background: '#d6dde6', color: '#0f1720', fontWeight: 700, marginTop: 4, minWidth: 'max-content' }}>{TOP_COLS}</div>
          {rows.map((r) => (
            <div key={r.pid} onClick={() => setSel(r.pid === sel ? null : r.pid)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSel(r.pid); }}
              style={{ padding: '0 10px', cursor: 'pointer', minWidth: 'max-content', background: r.pid === sel ? 'rgba(110,168,255,.28)' : undefined, color: r.st === 'Z' ? '#a1a1aa' : r.st === 'D' ? '#fbbf5a' : r.cpu > 90 ? '#ff9b94' : undefined }}>
              {topLine(r)}
            </div>
          ))}
        </div>
        {selRow && (
          <div className={s.bar}>
            <span className={s.mono}>PID {selRow.pid} · {selRow.cmd}</span>
            <button type="button" className={cx(s.btn, s.danger)} onClick={() => doAct({ k: 'kill', pid: selRow.pid })}>kill -9 {selRow.pid}</button>
            {selRow.role !== 'zombie' && selRow.role !== 'bomb' && <button type="button" className={s.btn} onClick={() => doAct({ k: 'renice', pid: selRow.pid })}>renice -n 19</button>}
            {(selRow.role === 'io') && <button type="button" className={s.btn} onClick={() => doAct({ k: 'ionice', pid: selRow.pid })}>ionice -c3</button>}
          </div>
        )}
        <div className={s.bar} style={{ marginBottom: 0 }}>
          {S.scen.includes('diskfull') && <>
            <button type="button" className={s.btn} onClick={() => doAct({ k: 'truncate' })}>truncate -s 0 debug.log</button>
            <button type="button" className={s.btn} onClick={() => doAct({ k: 'rm' })}>rm debug.log</button>
            <button type="button" className={s.btn} onClick={() => doAct({ k: 'stop', svc: 'worker' })}>systemctl stop worker</button>
          </>}
          {S.scen.includes('memleak') && <button type="button" className={s.btn} onClick={() => doAct({ k: 'stop', svc: 'report' })}>systemctl stop report</button>}
          {S.bomb && <button type="button" className={cx(s.btn, s.danger)} onClick={() => doAct({ k: 'cgkill' })}>echo 1 &gt; cgroup.kill</button>}
        </div>
        {note && <div style={{ marginTop: 8 }}><Explain tone={note.tone}>{t(note.en, note.vi)}</Explain></div>}
      </div>

      <div className={s.grid2} style={{ marginTop: 10, alignItems: 'start' }}>
        <div className={s.panel}>
          <div className={s.panelTitle}><Terminal style={{ width: 13, height: 13, verticalAlign: -2 }} /> {t('Which command shows this? — run one', 'Lệnh nào cho thấy điều này? — chạy thử')}</div>
          <div className={s.bar} style={{ marginTop: 0 }}>
            {COMMANDS.map((c) => <button type="button" key={c} className={cx(s.btn, term === c && s.on)} style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }} onClick={() => setTerm(c)}>{c}</button>)}
          </div>
          <div className={s.term}>{term ? cmd(S, term) : t('# pick a command — the output is computed from this very second of the machine', '# chọn một lệnh — output tính từ đúng giây hiện tại của máy')}</div>
          <div className={s.stack} style={{ gap: 4, marginTop: 8 }}>
            {HINTS.map((h) => (
              <div key={h.key}>
                <button type="button" className={cx(s.btn, hint === h.key && s.on)} style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => setHint(hint === h.key ? null : h.key)}>
                  <span>{t(h.en, h.vi)}</span><span className={s.mono} style={{ fontSize: 11, opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '55%' }}>{h.cmds.split(' · ')[0]}</span>
                </button>
                {hint === h.key && <div className={s.small} style={{ padding: '4px 6px' }}><code className={s.mono}>{h.cmds}</code><br />{t(h.why[0], h.why[1])}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className={s.stack}>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('How to read it right now', 'Đọc máy ngay lúc này')}</div>
            {hidden ? <div className={s.small}>{t('Hidden until you answer — read the numbers yourself first.', 'Ẩn tới khi bạn trả lời — hãy tự đọc số trước.')}</div> : (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                {readings(S, lang).map((r, k) => <li key={k} style={{ color: r.tone === 'bad' ? 'var(--ol-bad)' : r.tone === 'warn' ? 'var(--ol-warn)' : undefined }}>{r.t}</li>)}
              </ul>
            )}
          </div>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('Recent log lines (dmesg / journal / shell)', 'Log gần nhất (dmesg / journal / shell)')}</div>
            <div className={s.term} style={{ minHeight: 40, fontSize: 11 }}>{S.log.slice(-5).map((l) => `[${l.t}s] ${l.txt}`).join('\n') || t('(quiet)', '(yên ắng)')}</div>
          </div>
          <div className={s.panel}>
            <div className={s.panelTitle}><Stethoscope style={{ width: 13, height: 13, verticalAlign: -2 }} /> {t('Your diagnosis: what is wrong?', 'Chẩn đoán của bạn: máy bị gì?')}</div>
            <div className={s.bar} style={{ marginTop: 0 }}>
              {ANSWERS.map(([k, en, vi]) => (
                <button type="button" key={k} className={cx(s.btn, answer === k && (truth.includes(k) ? s.on : s.danger))} onClick={() => setAnswer(k)}>{t(en, vi)}</button>
              ))}
            </div>
            {answer && (truth.includes(answer as Scen | 'none')
              ? <Explain tone="ok">✓ {t('Correct.', 'Đúng.')} {t(evidence(truth[0] as Scen | 'none', S)[0], evidence(truth[0] as Scen | 'none', S)[1])}</Explain>
              : <Explain tone="bad">✗ {t('Not quite — look again at the numbers above.', 'Chưa đúng — nhìn lại các con số ở trên.')} {S.t < 20 ? t('(Let it run longer: some problems need time to show.)', '(Cho máy chạy lâu thêm: có sự cố cần thời gian mới lộ.)') : ''}</Explain>)}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function evidence(sc: Scen | 'none', S: Sys): [string, string] {
  switch (sc) {
    case 'cpuhog': return ['us ≈ 100%, load above the core count, one process at ~380 %CPU (6 threads sharing 4 cores). Fix: renice/limit it (cpu.max), or move it off the web server.', 'us ≈ 100%, load vượt số lõi, một tiến trình ~380 %CPU (6 luồng chia 4 lõi). Sửa: renice/giới hạn (cpu.max), hoặc dời nó khỏi máy chủ web.'];
    case 'memleak': return [`One process's RES grows ~180 MiB every second; available falls, buff/cache shrinks first, then swap fills, kswapd0 burns CPU, and the OOM killer strikes (dmesg: "Out of memory: Killed process"). ${S.oomKills ? 'It already happened here — exit code 137.' : ''}`, `RES của một tiến trình tăng ~180 MiB mỗi giây; available tụt, buff/cache co lại trước, rồi swap đầy, kswapd0 ăn CPU, và OOM killer ra tay (dmesg: "Out of memory: Killed process"). ${S.oomKills ? 'Ở đây đã xảy ra rồi — mã thoát 137.' : ''}`];
    case 'diskfull': return ['df shows / climbing to 100%; du -sh /var/log/* points at /var/log/app; the logs then say ENOSPC — even PostgreSQL panics. Fix: truncate (not rm!) and fix the log level / logrotate.', 'df cho thấy / leo tới 100%; du -sh /var/log/* chỉ vào /var/log/app; rồi log báo ENOSPC — cả PostgreSQL cũng panic. Sửa: truncate (đừng rm!) và sửa mức log / logrotate.'];
    case 'iostorm': return ['High load but the CPU is mostly idle: wa is high, three processes are in state D, iostat shows %util 100 and await in the hundreds of ms. Fix: ionice -c3 the backup, or run it at night / throttle it.', 'Load cao mà CPU gần như rảnh: wa cao, ba tiến trình ở trạng thái D, iostat báo %util 100 và await hàng trăm ms. Sửa: ionice -c3 bản sao lưu, hoặc chạy ban đêm / giới hạn tốc độ.'];
    case 'forkbomb': return ['Tasks jumped to ~600, hundreds of identical bash processes, sy% high, load in the hundreds, "fork: retry: Resource temporarily unavailable". pids.max of the cgroup kept it contained. Fix: kill the whole cgroup.', 'Số tác vụ vọt lên ~600, hàng trăm bash giống hệt nhau, sy% cao, load hàng trăm, "fork: retry: Resource temporarily unavailable". pids.max của cgroup đã khoanh nó lại. Sửa: giết cả cgroup.'];
    case 'zombies': return ['The zombie count keeps rising (state Z, 0 CPU, 0 RES), all with the same PPID: worker-mgr never calls wait(). Harmless until PIDs run out. Fix the parent (or restart it).', 'Số zombie cứ tăng (trạng thái Z, 0 CPU, 0 RES), tất cả cùng PPID: worker-mgr không bao giờ gọi wait(). Vô hại cho tới khi cạn PID. Sửa tiến trình cha (hoặc khởi động lại nó).'];
    default: return ['Load well under the core count, plenty of available memory (free is small only because of cache), disk 65%, no iowait.', 'Load dưới số lõi xa, available còn nhiều (free nhỏ chỉ vì cache), đĩa 65%, không có iowait.'];
  }
}
