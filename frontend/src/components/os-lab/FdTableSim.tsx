'use client';
/**
 * Tên → inode → mô tả file mở → bảng fd (Chương 9): ba cột của nhân, đi từng thao tác (open, dup, fork, write, close,
 * rm, ln, exec…). Thấy vì sao hai lần open() ghi đè nhau còn dup()/fork() thì không, O_APPEND, tệp đã xoá mà df không
 * giảm, EMFILE, và thứ tự chuyển hướng của shell. Engine: engine/fdtable.ts (khớp lab/out/c92-fd, c91-inode, c104-fd).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { FD_PRESETS, dfBytes, duBytes, fmtBytes, inodeOf, namesOf, openCount, posOf, runFd, type FdOp, type FdState } from './engine/fdtable';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab2.module.css';

const PRESETS = Object.keys(FD_PRESETS);
const OFD_COL = ['#64748b', '#2563eb', '#d97706', '#059669', '#9333ea', '#db2777', '#0891b2', '#4d7c0f'];
const ofdColor = (id: number) => OFD_COL[id % OFD_COL.length];

export default function FdTableSim({ lang = 'vi', preset = 'twice' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState(FD_PRESETS[preset] ? preset : 'twice');
  const [ops, setOps] = useState<FdOp[]>(() => FD_PRESETS[pre].ops);
  const states = useMemo(() => runFd(FD_PRESETS[pre].init, ops), [pre, ops]);
  const p = usePlayer(states.length, 1400);
  const S: FdState = states[Math.min(p.i, states.length - 1)];
  const [append, setAppend] = useState(false);
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => {
    if (p.i !== prev.current && p.i > 0) labSfx(S.last.err ? 'oops' : S.last.tone === 'warn' ? 'miss' : S.last.tone === 'ok' ? 'hit' : 'blip-exec');
    prev.current = p.i;
  }, [p.i, S]);

  const seekEnd = useRef(false);
  const load = (k: string) => { setPre(k); setOps(FD_PRESETS[k].ops); p.reset(); labSfx('tap'); };
  const doOp = (op: FdOp) => {
    const nops = [...ops.slice(0, p.i), op];
    setOps(nops);
    seekEnd.current = true;
    labSfx('tap');
  };
  useEffect(() => { if (seekEnd.current) { seekEnd.current = false; p.setI(states.length - 1); } }, [states]); // eslint-disable-line react-hooks/exhaustive-deps
  const main = S.procs[0];
  const fds = main.fds.map(([f]) => f);
  const userFd = fds.filter((f) => f > 2);
  const [fdSel, setFdSel] = useState<number | null>(null);
  const fdPick = fdSel !== null && fds.includes(fdSel) ? fdSel : userFd[userFd.length - 1] ?? 1;
  const files = S.dentries.map((d) => d.name);
  const mainFile = S.dentries.find((d) => inodeOf(S, d.ino)?.kind === 'file' && /log|out/.test(d.name))?.name ?? S.dentries[0]?.name;
  const H = S.last.hot;

  useLabBridge('fd', {
    preset: pre, i: p.i, atEnd: p.atEnd, total: states.length,
    pos3: posOf(S, 100, 3) ?? -1, pos4: posOf(S, 100, 4) ?? -1, file: mainFile ? (inodeOf(S, S.dentries.find((d) => d.name === mainFile)!.ino)?.data ?? '') : '',
    fds: main.fds.length, soft: S.soft, err: S.last.err ?? '', df: dfBytes(S), du: duBytes(S), inodes: S.inodes.length, deletedOpen: S.inodes.some((n) => n.kind === 'file' && n.links === 0),
    term: S.term.join('\n'),
  }, {
    preset: (v) => load(String(v)),
    open: (v) => doOp({ op: 'open', pid: main.pid, path: String(v ?? mainFile ?? 'log.txt'), append, creat: true }),
    append: (v) => setAppend(!!v),
    dup: (v) => doOp({ op: 'dup', pid: main.pid, fd: Number(v ?? fdPick) }),
    close: (v) => doOp({ op: 'close', pid: main.pid, fd: Number(v ?? fdPick) }),
    write: (v) => doOp({ op: 'write', pid: main.pid, fd: Number(v ?? fdPick), text: 'hello\n' }),
    rm: (v) => doOp({ op: 'rm', name: String(v ?? mainFile) }),
    ulimit: (v) => doOp({ op: 'ulimit', soft: Number(v) }),
  });

  const procCard = (pr: FdState['procs'][number]) => {
    const many = pr.fds.length > 14;
    const rows = many ? [...pr.fds.slice(0, 6), ...pr.fds.slice(-3)] : pr.fds;
    return (
      <div key={pr.pid} className={cx(c.card, H.pid === pr.pid && !H.fd && c.cardHot, S.last.err === 'EMFILE' && H.pid === pr.pid && c.cardBad)}>
        <b>{pr.name}</b> <span className={s.small}>PID {pr.pid}</span>
        {many && (
          <div style={{ margin: '4px 0' }}>
            <div className={c.ltrack}><div className={c.lfill} style={{ width: `${Math.min(100, (100 * pr.fds.length) / S.soft)}%`, background: pr.fds.length >= S.soft ? 'var(--ol-bad)' : undefined }} /></div>
            <span className={s.small}>{pr.fds.length} / {S.soft} fd ({t('soft limit', 'giới hạn mềm')})</span>
          </div>
        )}
        {rows.map(([fd, of], k) => (
          <div key={fd} className={s.mono} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '1px 0', fontWeight: H.pid === pr.pid && H.fd === fd ? 800 : 500, background: H.pid === pr.pid && H.fd === fd ? 'var(--ol-hl)' : undefined, borderRadius: 4 }}>
            {many && k === 6 && <span className={s.small} style={{ marginRight: 4 }}>⋯</span>}
            <span style={{ minWidth: 34 }}>fd {fd}</span><span style={{ color: ofdColor(of), fontWeight: 800 }}>→ #{of}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('File descriptors, open files and inodes', 'fd, tệp đang mở và inode')}
      sub={t('What the number 3 in write(3, …) really points at — three tables inside the kernel', 'Con số 3 trong write(3, …) thật ra trỏ vào đâu — ba bảng bên trong nhân')}>
      <div className={s.bar} data-tour="fd-preset">
        <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={PRESETS.map((k) => [k, k])} onChange={load} />
      </div>
      <Explain>{t(FD_PRESETS[pre].en, FD_PRESETS[pre].vi)}</Explain>
      <div className={s.bar} data-tour="fd-ops">
        <span className={s.lbl}>{t('Do it yourself:', 'Tự làm:')}</span>
        <button type="button" className={s.btn} onClick={() => doOp({ op: 'open', pid: main.pid, path: mainFile ?? 'log.txt', append, creat: true })}>open({mainFile ?? 'log.txt'})</button>
        <label className={s.lbl}><input type="checkbox" checked={append} onChange={(e) => setAppend(e.target.checked)} /> O_APPEND</label>
        <label className={s.lbl}>fd <select value={fdPick} onChange={(e) => setFdSel(Number(e.target.value))}>{fds.map((f) => <option key={f} value={f}>{f}</option>)}</select></label>
        <button type="button" className={s.btn} onClick={() => doOp({ op: 'write', pid: main.pid, fd: fdPick, text: 'hello\n' })}>write(fd, "hello\n")</button>
        <button type="button" className={s.btn} onClick={() => doOp({ op: 'dup', pid: main.pid, fd: fdPick })}>dup(fd)</button>
        <button type="button" className={s.btn} onClick={() => doOp({ op: 'close', pid: main.pid, fd: fdPick })}>close(fd)</button>
        {S.procs.length < 3 && <button type="button" className={s.btn} onClick={() => doOp({ op: 'fork', pid: main.pid, child: 200 + S.procs.length })}>fork()</button>}
        {files.length > 0 && <button type="button" className={s.btn} onClick={() => doOp({ op: 'rm', name: mainFile ?? files[0] })}>rm {mainFile ?? files[0]}</button>}
      </div>
      <Controls p={p} lang={lang} label={`${t('step', 'bước')} ${p.i}/${p.total - 1}`} />
      <Explain tone={S.last.err ? 'bad' : S.last.tone}>{S.last.cmd && <><b className={s.mono}>{S.last.cmd}</b> — </>}{t(S.last.en, S.last.vi)}</Explain>

      <div className={c.cols3} style={{ marginTop: 10 }}>
        <div className={c.col} data-tour="fd-procs">
          <div className={c.colHead}>① {t('fd table (per process)', 'Bảng fd (mỗi tiến trình)')}</div>
          {S.procs.map(procCard)}
          <span className={s.small}>{t('Just small numbers. Each row points at an open file description →', 'Chỉ là các số nhỏ. Mỗi dòng trỏ tới một mô tả file mở →')}</span>
        </div>
        <div className={c.col} data-tour="fd-ofds">
          <div className={c.colHead}>② {t('open file descriptions (kernel)', 'Mô tả file mở (của nhân)')}</div>
          {S.ofds.slice(0, 8).map((o) => {
            const ino = inodeOf(S, o.ino);
            return (
              <div key={o.id} className={cx(c.card, H.ofd === o.id && c.cardHot)} style={{ borderLeft: `4px solid ${ofdColor(o.id)}` }}>
                <b style={{ color: ofdColor(o.id) }}>#{o.id}</b> → {ino?.kind === 'tty' ? '/dev/pts/0' : `inode ${o.ino}`}
                <span className={c.link}>offset <b className={s.mono}>{ino?.kind === 'tty' ? '—' : fmtBytes(o.pos)}</b> · refs {o.refs}{o.append ? ' · O_APPEND' : ''}{o.cloexec ? ' · O_CLOEXEC' : ''}</span>
              </div>
            );
          })}
          {S.ofds.length > 8 && <span className={s.small}>… {S.ofds.length - 8} {t('more', 'nữa')}</span>}
          <span className={s.small}>{t('open() makes a NEW one (own offset); dup() and fork() SHARE one.', 'open() tạo một cái MỚI (offset riêng); dup() và fork() DÙNG CHUNG một cái.')}</span>
        </div>
        <div className={c.col} data-tour="fd-inodes">
          <div className={c.colHead}>③ {t('inodes (the files themselves)', 'Inode (chính các tệp)')}</div>
          {S.inodes.filter((n) => n.kind !== 'socket' && n.kind !== 'tty').map((n) => {
            const names = namesOf(S, n.ino), oc = openCount(S, n.ino);
            return (
              <div key={n.ino} className={cx(c.card, H.ino === n.ino && c.cardHot, n.links === 0 && c.cardBad)}>
                <b>inode {n.ino}</b> <span className={s.small}>{n.kind === 'symlink' ? 'symlink' : fmtBytes(n.size)}</span>
                <span className={c.link}>links {n.links} · {t('open', 'đang mở')} {oc}{n.links === 0 ? t(' · (deleted)', ' · (đã xoá)') : ''}</span>
                {n.kind === 'symlink' ? <span className={c.link}>→ "{n.target}"</span> : n.size < 200 && n.data ? <code className={s.mono} style={{ fontSize: 11, whiteSpace: 'pre-wrap', display: 'block' }}>{n.data.replace(/\n/g, '↵\n')}</code> : null}
                {names.length === 0 && <span className={c.link}>{t('no name left', 'không còn tên nào')}</span>}
              </div>
            );
          })}
          {S.inodes.some((n) => n.kind === 'socket') && <div className={c.card}><b>{S.inodes.filter((n) => n.kind === 'socket').length}</b> socket {t('inodes', 'inode')} <span className={c.link}>socket:[…] {t('— no name on disk', '— không có tên trên đĩa')}</span></div>}
          <div className={s.panel} style={{ padding: '6px 8px' }} data-tour="fd-dir">
            <div className={s.panelTitle} style={{ marginBottom: 2 }}>{t('Directory = table name → inode', 'Thư mục = bảng tên → inode')}</div>
            {S.dentries.length ? S.dentries.map((d) => <div key={d.name} className={s.mono} style={{ fontWeight: H.name === d.name ? 800 : 500 }}>{d.name} → {d.ino}</div>) : <span className={s.empty}>{t('(empty)', '(trống)')}</span>}
          </div>
        </div>
      </div>

      <div className={c.split} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          {(pre === 'deleted' || S.inodes.some((n) => n.kind === 'file' && n.links === 0)) && (
            <div className={s.kpis} data-tour="fd-df">
              <Kpi k={t('df (blocks in use)', 'df (khối đang dùng)')} v={fmtBytes(dfBytes(S))} tone={dfBytes(S) > duBytes(S) ? 'bad' : undefined} />
              <Kpi k={t('du (files with a name)', 'du (tệp còn tên)')} v={fmtBytes(duBytes(S))} />
            </div>
          )}
          <div className={s.term} data-tour="fd-term" style={{ minHeight: 70 }}>
            {states.slice(Math.max(1, p.i - 5), p.i + 1).map((x, k) => <div key={k} className={s.dim}>{x.last.cmd}</div>)}
            {S.term.length ? S.term.slice(-6).map((l, k) => <div key={`o${k}`} className={/EMFILE|No such|EXDEV/.test(l) ? s.er : undefined} style={{ whiteSpace: 'pre-wrap' }}>{l}</div>) : <span className={s.dim}>{t('(no output yet)', '(chưa có output)')}</span>}
          </div>
        </div>
        <WhereBox focus={pre === 'deleted' || pre === 'links' ? 'inode' : 'fd-table'} lang={lang} height={200} />
      </div>
    </Frame>
  );
}
