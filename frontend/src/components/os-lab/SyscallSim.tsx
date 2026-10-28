'use client';
/**
 * "Hành trình một lời gọi hệ thống" (Chương 11): mã của bạn → libc → bẫy (svc/syscall) → bảng syscall → hàm xử lý →
 * driver → quay về với số byte hoặc −errno. Bộ đếm giá cộng dồn ns theo số đo thật của lab; khung "Ở đâu trong máy?"
 * bay theo từng chặng (lõi CPU đổi chế độ, mã nhân trong RAM, thiết bị). Engine: engine/syscall.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { BATCH, COST, STRACE_DD, cfgOf, fmtNs, journey, type Arch, type FilterAct, type Kind, type Layer, type SysCfg, type Target, type TraceMode } from './engine/syscall';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab2.module.css';

type Scn = 'write' | 'fail' | 'vdso' | 'batch' | 'strace' | 'seccomp';
const SCN: Array<[Scn, string, string]> = [
  ['write', 'write()', 'write()'], ['fail', 'Error: ENOENT', 'Lỗi: ENOENT'], ['vdso', 'vDSO clock', 'Đồng hồ vDSO'],
  ['batch', 'Batching', 'Gom lời gọi'], ['strace', 'Under strace', 'Dưới strace'], ['seccomp', 'seccomp', 'seccomp'],
];
const ROWS: Array<{ l: Layer; en: string; vi: string; sub: [string, string]; kern: boolean }> = [
  { l: 'app', en: 'Your code', vi: 'Mã của bạn', sub: ['C · Node · Python · Java', 'C · Node · Python · Java'], kern: false },
  { l: 'libc', en: 'libc', vi: 'libc', sub: ['the C library wrapper', 'lớp vỏ thư viện C'], kern: false },
  { l: 'vdso', en: 'vDSO page', vi: 'Trang vDSO', sub: ['kernel code, user mode', 'mã nhân, chế độ người dùng'], kern: false },
  { l: 'cpu', en: 'CPU core', vi: 'Lõi CPU', sub: ['trap / return', 'bẫy / quay về'], kern: true },
  { l: 'entry', en: 'Kernel entry', vi: 'Điểm vào nhân', sub: ['save registers', 'cất thanh ghi'], kern: true },
  { l: 'tracer', en: 'strace', vi: 'strace', sub: ['another process (ptrace)', 'tiến trình khác (ptrace)'], kern: true },
  { l: 'seccomp', en: 'seccomp filter', vi: 'Bộ lọc seccomp', sub: ['BPF, before the table', 'BPF, trước bảng'], kern: true },
  { l: 'table', en: 'Syscall table', vi: 'Bảng syscall', sub: ['nr → function', 'số hiệu → hàm'], kern: true },
  { l: 'handler', en: 'Handler', vi: 'Hàm xử lý', sub: ['VFS / net / process', 'VFS / mạng / tiến trình'], kern: true },
  { l: 'lsm', en: 'LSM hook', vi: 'Móc LSM', sub: ['AppArmor · SELinux', 'AppArmor · SELinux'], kern: true },
  { l: 'driver', en: 'Driver', vi: 'Driver', sub: ['/dev/null · ext4 · TCP', '/dev/null · ext4 · TCP'], kern: true },
  { l: 'device', en: 'Device', vi: 'Thiết bị', sub: ['SSD · network chip', 'SSD · chip mạng'], kern: true },
];

function scnOf(preset: string): Scn { return (SCN.some(([k]) => k === preset) ? preset : 'write') as Scn; }

export default function SyscallSim({ lang = 'vi', preset = 'write' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [scn, setScn] = useState<Scn>(scnOf(preset));
  const [cfg, setCfg] = useState<SysCfg>(() => cfgOf(scnOf(preset)));
  const J = useMemo(() => journey(cfg), [cfg]);
  const p = usePlayer(J.steps.length, 1300);
  const st = J.steps[Math.min(p.i, J.steps.length - 1)];
  const seen = J.steps.slice(0, p.i + 1);
  const nsSoFar = seen.reduce((a, x) => a + x.ns, 0);
  const estSoFar = seen.some((x) => x.est);
  useOwnStepSound();
  const prevI = useRef(p.i);
  useEffect(() => {
    if (p.i !== prevI.current && st?.sfx) labSfx(st.sfx);
    prevI.current = p.i;
  }, [p.i, st]);

  const pick = (k: Scn) => { setScn(k); setCfg((x) => ({ ...cfgOf(k), arch: x.arch })); p.reset(); labSfx('tap'); };
  const set = (patch: Partial<SysCfg>) => { setCfg((x) => ({ ...x, ...patch })); p.reset(); labSfx('tap'); };
  const atEnd = p.atEnd;
  useLabBridge('sys', {
    scenario: scn, arch: cfg.arch, kind: cfg.kind, target: cfg.target, trace: cfg.trace, filter: cfg.filter, force: cfg.force, lsm: cfg.lsmDeny,
    layer: st?.layer ?? '', mode: st?.mode ?? 'user', i: p.i, atEnd, ns: Math.round(nsSoFar * 10) / 10,
    ret: atEnd ? J.result.ret : null, raw: atEnd ? J.result.raw : null, errno: atEnd ? J.result.errno : 0, exit: atEnd ? J.result.exit : 0, steps: J.steps.length,
  }, {
    scenario: (v) => pick(v as Scn), arch: (v) => set({ arch: v as Arch }), target: (v) => set({ target: v as Target }), tty: (v) => set({ tty: !!v }),
    force: (v) => set({ force: !!v }), trace: (v) => set({ trace: v as TraceMode }), filter: (v) => set({ filter: v as FilterAct }),
    call: (v) => set({ kind: v as Kind }), lsm: (v) => set({ lsmDeny: !!v }), exists: (v) => set({ exists: !!v }),
  });

  const present = new Set(J.steps.map((x) => x.layer));
  const rows = ROWS.filter((r) => present.has(r.l) || ['app', 'libc', 'cpu', 'entry', 'table', 'handler', 'driver'].includes(r.l));
  const seenLayers = new Set(seen.map((x) => x.layer));
  const lastOn = (l: Layer) => { for (let k = seen.length - 1; k >= 0; k--) if (seen[k].layer === l) return seen[k]; return undefined; };
  const nsOn = (l: Layer) => seen.filter((x) => x.layer === l).reduce((a, x) => a + x.ns, 0);
  const arm = cfg.arch === 'arm64';
  const user = st?.mode === 'user';
  const out = seen.filter((x) => x.out).map((x) => x.out!).join('\n');
  const cmd = cfg.kind === 'write' ? (cfg.tty ? './hello' : './hello | cat') : cfg.kind === 'writev' ? './batch writev /dev/shm/out.txt' : cfg.kind === 'open' ? './fail' : cfg.kind === 'clock' ? './cost' : cfg.kind === 'mkdir' ? './sandbox <filter> mkdir /tmp/uploads' : cfg.kind === 'socket' ? './sandbox <filter> curl -sS http://example.com/' : './sandbox <filter> python3 thread.py';
  const ladder: Array<[string, string, number, boolean]> = [
    [t('plain function call', 'gọi hàm thường'), '2.1 ns', COST.fn, false],
    [t('clock_gettime via vDSO', 'clock_gettime qua vDSO'), '18.5 ns', COST.vdsoClock, cfg.kind === 'clock' && !cfg.force],
    [t('getppid() syscall', 'syscall getppid()'), '176 ns', COST.getppid, false],
    [t('write(/dev/null, 1 B)', 'write(/dev/null, 1 B)'), '195.7 ns', COST.writeNull, cfg.kind === 'write' && cfg.target === 'null' && cfg.trace !== 'ptrace'],
    [t('forced clock_gettime syscall', 'clock_gettime ép syscall'), '202.1 ns', COST.forcedClock, cfg.kind === 'clock' && cfg.force],
    [t('buffered write to ext4 (Ch 9)', 'ghi có đệm vào ext4 (Ch 9)'), '1.8 µs', COST.fileWrite, cfg.kind === 'write' && cfg.target === 'file'],
    [t('a syscall under strace', 'một syscall dưới strace'), '≈ 41 µs', COST.ptraceStop * 2 + COST.writeNull, cfg.trace === 'ptrace'],
    [t('fsync each write (Ch 9)', 'fsync mỗi lần ghi (Ch 9)'), '≈ 958 µs', COST.fsync, false],
  ];
  const lmax = Math.log10(COST.fsync), lmin = Math.log10(1);

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('The journey of one system call', 'Hành trình của một lời gọi hệ thống')}
      sub={t('From your code across the user/kernel line and back — with the price of every hop', 'Từ mã của bạn băng qua lằn ranh người dùng/nhân rồi quay về — kèm giá của từng chặng')}>
      <div className={s.bar} data-tour="sys-scenario">
        <Seg value={scn} options={SCN.map(([k, en, vi]) => [k, t(en, vi)])} onChange={pick} />
      </div>
      <div className={s.bar} data-tour="sys-options">
        <Seg label={t('CPU', 'CPU')} value={cfg.arch} options={[['arm64', 'arm64 (svc)'], ['x86', 'x86-64 (syscall)']]} onChange={(v) => set({ arch: v })} />
        {(scn === 'write' || scn === 'strace' || scn === 'batch') && (
          <Seg label={t('fd 1 →', 'fd 1 →')} value={cfg.target} options={[['null', '/dev/null'], ['file', t('file', 'tệp')], ['tcp', 'TCP']]} onChange={(v) => set({ target: v })} />
        )}
        {scn === 'write' && <Seg label="stdout" value={cfg.tty ? 'tty' : 'pipe'} options={[['pipe', t('pipe', 'ống')], ['tty', 'terminal']]} onChange={(v) => set({ tty: v === 'tty' })} />}
        {scn === 'write' && <Seg label={t('LSM', 'LSM')} value={cfg.lsmDeny ? 'deny' : 'ok'} options={[['ok', t('allow', 'cho')], ['deny', t('AppArmor denies', 'AppArmor cấm')]]} onChange={(v) => set({ lsmDeny: v === 'deny' })} />}
        {scn === 'fail' && <Seg label={t('path', 'đường dẫn')} value={cfg.exists ? 'y' : 'n'} options={[['n', '/nope/config.json'], ['y', '/etc/hostname']]} onChange={(v) => set({ exists: v === 'y' })} />}
        {scn === 'vdso' && <Seg label={t('path', 'đường đi')} value={cfg.force ? 'sys' : 'vdso'} options={[['vdso', 'vDSO'], ['sys', t('force syscall()', 'ép syscall()')]]} onChange={(v) => set({ force: v === 'sys' })} />}
        {scn === 'strace' && <Seg label="strace" value={cfg.trace} options={[['off', t('off', 'tắt')], ['ptrace', 'strace'], ['bpf', '--seccomp-bpf']]} onChange={(v) => set({ trace: v })} />}
        {scn === 'seccomp' && <>
          <Seg label={t('program', 'chương trình')} value={cfg.kind} options={[['mkdir', 'mkdir'], ['socket', 'curl'], ['clone3', t('Python thread', 'luồng Python')]]} onChange={(v) => set({ kind: v })} />
          <Seg label={t('action', 'hành động')} value={cfg.filter} options={[['allow', 'ALLOW'], ['eperm', 'EPERM'], ['enosys', 'ENOSYS'], ['kill', 'KILL'], ['log', 'LOG']]} onChange={(v) => set({ filter: v })} />
        </>}
      </div>
      <Controls p={p} lang={lang} label={`${t('hop', 'chặng')} ${p.i + 1}/${p.total}`} />
      <Explain tone={st?.tone}>{st && <><b>{st.fn}</b> — {t(st.en, st.vi)}</>}</Explain>

      <div className={c.split} style={{ marginTop: 10 }}>
        <div className={c.tower} data-tour="sys-path" aria-label={t('layers', 'các tầng')}>
          {rows.map((r) => {
            const on = st?.layer === r.l;
            const last = lastOn(r.l);
            const crossing = r.l === 'cpu';
            const visitedHere = present.has(r.l);
            const els = [];
            if (crossing) els.push(<div key="b" className={c.boundary}>{t(`▲ user mode (${arm ? 'EL0' : 'ring 3'}) · kernel mode (${arm ? 'EL1' : 'ring 0'}) ▼`, `▲ chế độ người dùng (${arm ? 'EL0' : 'ring 3'}) · chế độ nhân (${arm ? 'EL1' : 'ring 0'}) ▼`)}</div>);
            els.push(
              <div key={r.l} className={cx(c.row, r.kern ? c.rowKern : c.rowUser, r.l === 'tracer' && c.rowSide, seenLayers.has(r.l) && c.rowSeen,
                on && (st?.tone === 'bad' ? c.rowBad : st?.tone === 'ok' ? c.rowOk : st?.tone === 'warn' ? c.rowWarn : c.rowOn), !visitedHere && c.rowDim)} aria-current={on ? 'step' : undefined}>
                <span className={c.rowName}>{on && <span className={c.token} aria-hidden />}{t(r.en, r.vi)}<small>{t(r.sub[0], r.sub[1])}</small></span>
                <span className={c.rowFn}>{last ? last.fn : visitedHere ? '…' : t('— not visited on this path —', '— đường này không đi qua —')}</span>
                <span className={c.rowNs}>{nsOn(r.l) ? fmtNs(nsOn(r.l)) : ''}</span>
              </div>,
            );
            return els;
          })}
        </div>

        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="sys-cost">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <span className={cx(c.modeChip, user ? c.modeUser : c.modeKern)}>{user ? (arm ? 'EL0' : 'ring 3') : (arm ? 'EL1' : 'ring 0')} · {user ? t('user mode', 'chế độ người dùng') : t('kernel mode', 'chế độ nhân')}</span>
            </div>
            <div className={s.kpis}>
              <Kpi k={t('time so far', 'thời gian đã tốn')} v={`${estSoFar ? '≈ ' : ''}${fmtNs(nsSoFar)}`} tone={nsSoFar > 10000 ? 'bad' : nsSoFar > 150 ? 'warn' : 'ok'} />
              <Kpi k={t('the call itself', 'riêng lời gọi')} v={`${J.est ? '≈ ' : ''}${fmtNs(J.callNs)}`} />
              {atEnd && <Kpi k={t('returned', 'trả về')} v={J.result.ret === null ? 'SIGSYS' : J.result.errno ? `-1 · errno ${J.result.errno}` : String(J.result.ret)} tone={J.result.ret === null || J.result.errno ? 'bad' : 'ok'} />}
            </div>
            {J.est && <div className={s.small} style={{ marginTop: 4 }}>{t('≈ = this path has hops the lab did not time separately; the split is an estimate.', '≈ = đường này có chặng lab không đo riêng; phần chia là ước lượng.')}</div>}
          </div>
          <div className={s.panel} data-tour="sys-regs">
            <div className={s.panelTitle}>{t(`Registers (${arm ? 'arm64' : 'x86-64'}) — the whole API is numbers in these`, `Thanh ghi (${arm ? 'arm64' : 'x86-64'}) — cả "API" chỉ là số trong chúng`)}</div>
            {st?.regs.length ? <div className={c.regs}>{st.regs.map(([k, v]) => <span key={k} className={c.reg}><b>{k}</b>{v}</span>)}</div>
              : <span className={s.empty}>{t('(no syscall registers loaded yet)', '(chưa nạp thanh ghi syscall nào)')}</span>}
          </div>
          <div className={s.term} data-tour="sys-term" style={{ minHeight: 84 }}>
            <span className={s.pr}>$ </span>{cmd}{'\n'}{out || <span className={s.dim}>{t('(no output yet)', '(chưa có output)')}</span>}
            {atEnd && cfg.kind !== 'clock' && <>{'\n'}<span className={s.pr}>$ </span>strace -e trace={cfg.kind === 'open' ? 'openat' : cfg.kind === 'mkdir' ? 'mkdirat' : cfg.kind === 'socket' ? 'socket' : cfg.kind === 'clone3' ? 'clone3' : cfg.kind === 'writev' ? 'writev' : 'write'} {cmd.replace('./', '')}{'\n'}<span className={J.result.errno || J.result.raw === null ? s.er : undefined}>{J.result.strace}</span></>}
          </div>
          <WhereBox focus={st?.where ?? 'process'} lang={lang} />
        </div>
      </div>

      <div className={s.grid2} style={{ marginTop: 10, alignItems: 'start' }}>
        <div className={s.panel} data-tour="sys-ladder">
          <div className={s.panelTitle}>{t('What things cost (measured in the lab, log scale)', 'Giá của từng thứ (đo trong lab, thang log)')}</div>
          <div className={c.ladder}>
            {ladder.map(([name, label, ns, on]) => (
              <div key={name} className={cx(c.lrow, on && c.lrowOn)}>
                <span>{name}</span>
                <span className={c.ltrack}><span className={c.lfill} style={{ display: 'block', width: `${Math.max(3, (100 * (Math.log10(ns) - lmin)) / (lmax - lmin))}%` }} /></span>
                <span className={s.mono}>{label}</span>
              </div>
            ))}
          </div>
          <div className={s.small} style={{ marginTop: 6 }}>{t('A syscall is ~100× a function call — cheap enough to use freely, expensive enough to never do one per byte.', 'Một syscall đắt cỡ 100 lần gọi hàm — đủ rẻ để dùng thoải mái, đủ đắt để đừng bao giờ gọi một lần cho mỗi byte.')}</div>
        </div>
        {scn === 'strace' ? (
          <div className={s.panel} data-tour="sys-batch">
            <div className={s.panelTitle}>{t('dd bs=1 count=100000 — 200 000 syscalls (c113)', 'dd bs=1 count=100000 — 200 000 syscall (c113)')}</div>
            <div className={c.ladder}>
              {STRACE_DD.map((r) => (
                <div key={r.mode} className={cx(c.lrow, ((cfg.trace === 'off' && r.mode === 'plain') || (cfg.trace === 'ptrace' && r.mode === 'ptrace') || (cfg.trace === 'bpf' && r.mode === 'bpf')) && c.lrowOn)}>
                  <span>{t(r.en, r.vi)}</span>
                  <span className={c.ltrack}><span className={c.lfill} style={{ display: 'block', width: `${Math.max(2, (100 * r.s) / 8.671)}%` }} /></span>
                  <span className={s.mono}>{r.s.toFixed(3)} s</span>
                </div>
              ))}
            </div>
            <div className={s.small} style={{ marginTop: 6 }}>{t('Note row 3: "-e trace=openat" only FILTERS what strace prints — ptrace still stops on every call. --seccomp-bpf moves the filter into the kernel.', 'Để ý hàng 3: "-e trace=openat" chỉ LỌC thứ strace in ra — ptrace vẫn dừng ở mọi lời gọi. --seccomp-bpf đưa bộ lọc vào trong nhân.')}</div>
          </div>
        ) : (
          <div className={s.panel} data-tour="sys-batch">
            <div className={s.panelTitle}>{t('Writing 100 000 lines (c114)', 'Ghi 100 000 dòng (c114)')}</div>
            <div className={c.ladder}>
              {BATCH.map((b) => (
                <div key={b.mode} className={cx(c.lrow, scn === 'batch' && b.mode === 'writev' && c.lrowOn)}>
                  <span>{t(b.en, b.vi)}<br /><span className={s.small}>{b.calls.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} {b.sys}</span></span>
                  <span className={c.ltrack}><span className={c.lfill} style={{ display: 'block', width: `${Math.max(2, (100 * b.ms) / 31.69)}%` }} /></span>
                  <span className={s.mono}>{b.ms.toFixed(2)} ms</span>
                </div>
              ))}
            </div>
            <div className={s.small} style={{ marginTop: 6 }}>{t('Same bytes, 20× faster: the work is the same, only the number of trips into the kernel changes. Java raw vs BufferedOutputStream: 100 022 vs 398 writes, 39.8 vs 6.9 ms.', 'Cùng số byte, nhanh gấp 20: việc phải làm như nhau, chỉ số chuyến vào nhân thay đổi. Java ghi thẳng vs BufferedOutputStream: 100 022 vs 398 lần write, 39,8 vs 6,9 ms.')}</div>
          </div>
        )}
      </div>
    </Frame>
  );
}
