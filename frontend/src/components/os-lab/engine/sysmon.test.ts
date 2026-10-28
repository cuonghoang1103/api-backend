/**
 * Kiểm "phòng máy" top/htop với các con số biết trước.
 *   npx tsx --test frontend/src/components/os-lab/engine/sysmon.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { act, cmd, EXP, initSys, inject, shareCpu, tick, topRows, weightOf, KERNEL_MIB, type Sys } from './sysmon';

const run = (s: Sys, n: number) => { for (let k = 0; k < n; k++) s = tick(s); return s; };

describe('sysmon: CPU share (CFS weights)', () => {
  it('6 busy threads on 4 cores each get 4/6 of a core', () => {
    const g = shareCpu(Array.from({ length: 6 }, () => ({ want: 1, w: 1024 })), 4);
    for (const x of g) assert.ok(Math.abs(x - 4 / 6) < 1e-9);
  });
  it('nice 0 vs nice 19 on one core: 1024 : 15', () => {
    const [a, b] = shareCpu([{ want: 1, w: weightOf(0) }, { want: 1, w: weightOf(19) }], 1);
    assert.ok(Math.abs(a - 1024 / 1039) < 1e-9 && Math.abs(b - 15 / 1039) < 1e-9);
  });
  it('a thread that wants little gets exactly that; the rest is shared', () => {
    const [a, b, c] = shareCpu([{ want: 0.1, w: 1024 }, { want: 1, w: 1024 }, { want: 1, w: 1024 }], 1);
    assert.ok(Math.abs(a - 0.1) < 1e-9 && Math.abs(b - 0.45) < 1e-9 && Math.abs(c - 0.45) < 1e-9);
  });
});

describe('sysmon: load average', () => {
  it('exponential decay: constant n for 60 s → 63.2% of the way (1 − 1/e)', () => {
    let l = 0; for (let k = 0; k < 60; k++) l = l * EXP[0] + 1 * (1 - EXP[0]);
    assert.ok(Math.abs(l - (1 - Math.exp(-1))) < 1e-9);
  });
  it('CPU hog (6 threads, 4 cores): load1 climbs above the core count, us ≈ 100%, the API slows', () => {
    const s = run(initSys(['cpuhog']), 300);
    assert.ok(s.load[0] > 5.5 && s.load[0] < 7.5, `load1=${s.load[0]}`);
    assert.ok(s.load[1] < s.load[0] && s.load[2] < s.load[1], '5- and 15-minute averages lag behind');
    assert.ok(s.cpu.us > 90 && s.cpu.id < 5);
    const hog = s.procs.find((p) => p.role === 'hog')!;
    assert.ok(hog.pcpu > 350 && hog.pcpu <= 400, `top shows per-core %: ${hog.pcpu}`);
    assert.ok(s.apiMs! > 60);
    const calm = run(initSys([]), 300);
    assert.ok(calm.load[0] < 1 && calm.apiMs! < 50);
  });
  it('renice 19 moves the hog to "ni" and gives the API its CPU back', () => {
    let s = run(initSys(['cpuhog']), 30);
    const hog = s.procs.find((p) => p.role === 'hog')!;
    s = act(s, { k: 'renice', pid: hog.pid }).s;
    s = run(s, 5);
    assert.ok(s.cpu.ni > 80 && s.cpu.us < 15);
    assert.ok(s.apiMs! < 50, `api=${s.apiMs}`);
  });
});

describe('sysmon: memory leak → swap → OOM kill (exit 137)', () => {
  it('cache is dropped first, then swap fills, then the biggest process is killed', () => {
    let s = initSys(['memleak']);
    // tổng nhu cầu = kernel + Σ RES; sức chứa = (RAM − min_free − cache tối thiểu) + swap
    const demand0 = KERNEL_MIB + s.procs.reduce((a, p) => a + p.rss, 0);
    const tKill = Math.ceil((7936 - 80 - 160 + 1024 - demand0) / 180);
    let killedAt = -1, sawCacheLow = false, maxSwap = 0;
    for (let k = 0; k < 60 && killedAt < 0; k++) {
      s = tick(s);
      if (s.cache <= 161) sawCacheLow = true;
      if (!s.oomKills) maxSwap = Math.max(maxSwap, s.swapUsed);
      if (s.oomKills) killedAt = s.t;
    }
    assert.ok(Math.abs(killedAt - tKill) <= 1, `killed at ${killedAt}, predicted ${tKill}`);
    assert.ok(sawCacheLow && maxSwap > 850, `swap peaked at ${maxSwap}`);
    assert.ok(s.log.some((l) => /Out of memory: Killed process 4242 \(java\)/.test(l.txt)));
    assert.ok(s.log.some((l) => /status=9\/KILL/.test(l.txt)));
    assert.ok(!s.procs.some((p) => p.role === 'leak'));
    s = run(s, 4);
    assert.ok(s.procs.some((p) => p.role === 'leak' && p.pid !== 4242), 'systemd restarts it (Restart=on-failure)');
  });
  it('free -m: used + free + buff/cache = total; available = free + reclaimable cache', () => {
    const s = run(initSys([]), 5);
    assert.ok(Math.abs(s.mem.used + s.mem.free + s.cache - s.memTotal) < 1e-6);
    assert.ok(s.mem.avail > s.mem.free + 2000, 'most of buff/cache is available');
    assert.match(cmd(s, 'free -m'), /available/);
  });
  it('systemctl stop keeps it dead', () => {
    let s = run(initSys(['memleak']), 10);
    s = act(s, { k: 'stop', svc: 'report' }).s;
    s = run(s, 10);
    assert.ok(!s.procs.some((p) => p.role === 'leak'));
  });
});

describe('sysmon: disk', () => {
  it('300 MB/s of logs fills the last 6 GiB in ~20 s; then ENOSPC', () => {
    let s = initSys(['diskfull']);
    let fullAt = -1;
    for (let k = 0; k < 40; k++) { s = tick(s); if (fullAt < 0 && s.disk.used >= s.disk.size - 1e-9) fullAt = s.t; }
    assert.equal(fullAt, Math.ceil((6 * 1024) / 300));
    assert.ok(s.enospc > 0 && /100%/.test(cmd(s, 'df -h /')));
  });
  it('rm while the writer holds it open frees nothing; lsof +L1 shows it; killing the writer frees it', () => {
    let s = run(initSys(['diskfull']), 8);
    const before = s.disk.used;
    s = act(s, { k: 'rm' }).s;
    assert.ok(Math.abs(s.disk.used - before) < 1e-9);
    s = run(s, 2);
    assert.match(cmd(s, 'lsof +L1'), /\(deleted\)/);
    const w = s.procs.find((p) => p.role === 'logger')!;
    const held = s.disk.deletedOpen, u2 = s.disk.used;
    s = act(s, { k: 'kill', pid: w.pid }).s;
    assert.ok(held > 5 && Math.abs(s.disk.used - (u2 - held)) < 1e-9, `used=${s.disk.used}`);
  });
  it('truncate frees space at once', () => {
    let s = run(initSys(['diskfull']), 5);
    const u = s.disk.used, f = s.disk.logFile;
    s = act(s, { k: 'truncate' }).s;
    assert.ok(Math.abs(s.disk.used - (u - f)) < 1e-9 && s.disk.logFile === 0);
  });
});

describe('sysmon: I/O storm', () => {
  it('load is high but the CPU is mostly idle/iowait: tasks in D state count toward load', () => {
    const s = run(initSys(['iostorm']), 200);
    assert.ok(s.io.util >= 100 && s.io.await > 20);
    assert.ok(s.cpu.us + s.cpu.sy < 40, `busy=${s.cpu.us + s.cpu.sy}`);
    assert.ok(s.cpu.wa > 20, `wa=${s.cpu.wa}`);
    assert.equal(s.procs.filter((p) => p.st === 'D').length, 3);
    assert.ok(s.load[0] > 2.5, `load1=${s.load[0]}`);
  });
  it('ionice -c3 on the backup gives the API its disk time back', () => {
    let s = run(initSys(['iostorm']), 20);
    const slow = s.apiMs!;
    s = act(s, { k: 'ionice', pid: s.procs.find((p) => p.role === 'io')!.pid }).s;
    s = run(s, 2);
    assert.ok(s.apiMs! < slow / 3, `${slow} → ${s.apiMs}`);
  });
});

describe('sysmon: fork bomb and zombies', () => {
  it('fork bomb doubles until pids.max = 512, then forks fail; cgroup.kill ends it', () => {
    let s = initSys(['forkbomb']);
    s = run(s, 9);
    assert.equal(s.bomb!.n, 512);
    s = run(s, 5);
    assert.equal(s.bomb!.n, 512);
    assert.ok(s.bomb!.failed > 0 && s.load[0] > 20);
    const one = topRows(s).find((r) => r.role === 'bomb')!;
    s = act(s, { k: 'kill', pid: one.pid }).s;
    s = tick(s);
    assert.equal(s.bomb!.n, 512, 'killing one copy does not help');
    s = act(s, { k: 'cgkill' }).s;
    assert.equal(s.bomb, null);
  });
  it('zombies use no CPU or memory; kill -9 on a zombie does nothing; killing the parent reaps them', () => {
    let s = run(initSys(['zombies']), 10);
    assert.equal(s.zomb!.n, 50);
    const z = topRows(s, 'cpu', 40).find((r) => r.st === 'Z')!;
    assert.equal(z.cpu, 0); assert.equal(z.res, 0);
    s = act(s, { k: 'kill', pid: z.pid }).s;
    assert.equal(s.zomb!.n, 50);
    s = act(s, { k: 'kill', pid: s.zomb!.ppid }).s;
    assert.equal(s.zomb, null);
  });
  it('inject adds a scenario to a running machine', () => {
    let s = run(initSys([]), 3);
    s = inject(s, 'cpuhog');
    assert.ok(s.scen.includes('cpuhog') && s.procs.some((p) => p.role === 'hog'));
  });
});
