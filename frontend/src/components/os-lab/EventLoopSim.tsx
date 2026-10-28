'use client';
/** Event loop của Node.js: call stack, nextTick, microtask, các pha libuv, thread pool, epoll — từng bước, với đồng hồ ms. */
import { useMemo, useState } from 'react';
import { blockScenario, ORDER, poolScenario, raceScenario, run, type ELState, type Inst, type Phase, type Scenario } from './engine/eventloop';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';

type Mode = 'order' | 'block' | 'pool' | 'race';
const MODES: Array<[Mode, string, string]> = [['order', 'Who prints first?', 'Ai in trước?'], ['block', 'Blocking the loop', 'Chặn vòng lặp'], ['pool', 'libuv thread pool', 'Thread pool của libuv'], ['race', 'Race across await', 'Race qua await']];
const INTRO: Record<Mode, [string, string]> = {
  order: ['Predict the output before you press Play. Synchronous code first; then everything queued by process.nextTick, then Promise callbacks (microtasks); only then the event loop phases: timers → poll (I/O) → check (setImmediate).', 'Đoán output trước khi bấm Chạy. Mã đồng bộ chạy trước; rồi mọi thứ xếp bởi process.nextTick, rồi callback của Promise (microtask); sau đó mới tới các pha của event loop: timers → poll (I/O) → check (setImmediate).'],
  block: ['One web server, one JavaScript thread. Four requests arrive 5 ms apart; request 2 does 200 ms of synchronous work. Watch the requests that arrive during those 200 ms — then switch to "offload".', 'Một máy chủ web, một luồng JavaScript. Bốn request đến cách nhau 5 ms; request 2 làm 200 ms việc đồng bộ. Nhìn các request đến trong 200 ms đó — rồi chuyển sang "đẩy ra ngoài".'],
  pool: ['crypto.pbkdf2, fs.*, dns.lookup and zlib do not run on the JavaScript thread: libuv hands them to a thread pool of UV_THREADPOOL_SIZE threads (default 4). Sockets (http, database drivers) use epoll in the kernel instead — no thread at all.', 'crypto.pbkdf2, fs.*, dns.lookup và zlib không chạy trên luồng JavaScript: libuv giao chúng cho một thread pool UV_THREADPOOL_SIZE luồng (mặc định 4). Còn socket (http, driver CSDL) dùng epoll trong kernel — không tốn luồng nào.'],
  race: ['Node has ONE thread, so no data race on a variable — but every await hands control to someone else. "Check, await, then act" is a race: both requests read seatsLeft = 1 before either writes. Same bug as ch05/async-race.js.', 'Node chỉ có MỘT luồng nên không có data race trên biến — nhưng mỗi await trao quyền cho người khác. "Kiểm, await, rồi làm" là race: cả hai request đọc seatsLeft = 1 trước khi ai kịp ghi. Đúng lỗi của ch05/async-race.js.'],
};
const PRESET_MODE: Record<string, Mode> = { order: 'order', block: 'block', pool: 'pool', race: 'race', racelock: 'race', offload: 'block' };

function Q({ title, items, empty, color, sub }: { title: string; items: Inst[]; empty: string; color: string; sub?: (i: Inst) => string }) {
  return (
    <div className={s.panel} style={{ padding: '6px 8px' }}>
      <div className={s.panelTitle} style={{ marginBottom: 4 }}>{title}</div>
      <div className={s.chips} style={{ minHeight: 26 }}>
        {items.length ? items.map((i, k) => <span key={k} className={s.chip} style={{ background: color, fontSize: 11.5, height: 'auto', padding: '2px 7px' }}>{i.label}{sub ? ` · ${sub(i)}` : ''}</span>) : <span className={s.empty}>{empty}</span>}
      </div>
    </div>
  );
}

export default function EventLoopSim({ lang = 'vi', preset = 'order' }: { lang?: Lang; preset?: string }) {
  const [mode, setMode] = useState<Mode>(PRESET_MODE[preset] ?? 'order');
  const [offload, setOffload] = useState(preset === 'offload');
  const [lock, setLock] = useState(preset === 'racelock');
  const [poolSize, setPoolSize] = useState(4);
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const sc: Scenario = useMemo(() => (mode === 'order' ? ORDER : mode === 'block' ? blockScenario(offload) : mode === 'pool' ? poolScenario() : raceScenario(lock)), [mode, offload, lock]);
  const states = useMemo(() => run(sc, poolSize), [sc, poolSize]);
  const p = usePlayer(states.length, 950);
  const S: ELState = states[Math.min(p.i, states.length - 1)];
  const reset = () => p.reset();
  const PHASES: Array<[Phase, string]> = [['timers', 'timers'], ['poll', 'poll (I/O)'], ['check', 'check']];

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('The Node.js event loop, step by step', 'Event loop của Node.js, từng bước')}
      sub={t('One JavaScript thread, many queues, a thread pool and the kernel', 'Một luồng JavaScript, nhiều hàng đợi, một thread pool và kernel')}>
      <div className={s.bar}>
        <Seg value={mode} options={MODES.map(([v, en, vi]) => [v, t(en, vi)])} onChange={(v) => { setMode(v); reset(); }} />
      </div>
      <div className={s.bar}>
        {mode === 'block' && <Seg label={t('Report handler', 'Handler /report')} value={offload ? 'y' : 'n'} options={[['n', t('synchronous', 'đồng bộ')], ['y', t('offload (async)', 'đẩy ra ngoài (async)')]]} onChange={(v) => { setOffload(v === 'y'); reset(); }} />}
        {mode === 'pool' && <Seg label="UV_THREADPOOL_SIZE" value={poolSize} options={[[1, '1'], [2, '2'], [4, '4'], [8, '8']]} onChange={(v) => { setPoolSize(v); reset(); }} />}
        {mode === 'race' && <Seg label={t('Lock', 'Khoá')} value={lock ? 'y' : 'n'} options={[['n', t('none', 'không')], ['y', t('Promise-chain mutex', 'mutex chuỗi Promise')]]} onChange={(v) => { setLock(v === 'y'); reset(); }} />}
      </div>
      <Explain>{t(INTRO[mode][0], INTRO[mode][1])}</Explain>
      <Controls p={p} lang={lang} label={`${t('step', 'bước')} ${p.i + 1}/${p.total} · ${S.now} ms`} />
      <Explain tone={S.blockedMs >= 50 ? 'bad' : S.phase === 'done' ? 'ok' : undefined}><b>{S.now} ms:</b> {t(S.ev, S.evVi)}</Explain>

      <div className={s.grid2} style={{ marginTop: 10, alignItems: 'start' }}>
        <div className={s.stack}>
          <div className={s.code}>
            {sc.src.map((l, k) => <span key={k} className={cx(s.ln, S.line === k && s.cur)}>{l || ' '}</span>)}
          </div>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('Console output', 'Console')}</div>
            <div className={s.term} style={{ minHeight: 70 }}>
              {S.out.length ? S.out.map((o, k) => <div key={k}><span className={s.dim}>{String(o.t).padStart(4)} ms </span>{o.v}</div>) : <span className={s.dim}>{t('(nothing printed yet)', '(chưa in gì)')}</span>}
            </div>
          </div>
          {mode === 'block' && (
            <table className={s.tbl}>
              <thead><tr><th>{t('request', 'request')}</th><th className={s.num}>{t('arrives', 'đến lúc')}</th><th className={s.num}>{t('answered', 'trả lời lúc')}</th><th className={s.num}>{t('latency', 'độ trễ')}</th></tr></thead>
              <tbody>{Object.entries(S.reqs).map(([k, r]) => {
                const lat = r.done === null ? null : r.done - r.arrive;
                return <tr key={k}><td className={s.mono}>{k}</td><td className={s.num}>{r.arrive}</td><td className={s.num}>{r.done ?? '…'}</td><td className={s.num} style={{ color: lat !== null && lat > 50 && !k.includes('report') ? 'var(--ol-bad)' : undefined, fontWeight: 700 }}>{lat === null ? '…' : `${lat} ms`}</td></tr>;
              })}</tbody>
            </table>
          )}
          {mode === 'race' && (
            <div className={s.kpis}>
              <Kpi k="db.seatsLeft" v={String(S.g.seatsLeft)} tone={(S.g.seatsLeft as number) < 0 ? 'bad' : undefined} />
              <Kpi k="db.bookings" v={(S.g.bookings as string[]).join(', ') || '—'} tone={(S.g.bookings as string[]).length > 1 ? 'bad' : (S.g.bookings as string[]).length ? 'ok' : undefined} />
              {Object.entries(S.locals).filter(([k]) => k !== 'main').map(([k, l]) => l.left !== undefined && <Kpi key={k} k={`${k}: left`} v={String(l.left)} />)}
            </div>
          )}
        </div>

        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} style={{ borderColor: S.blockedMs ? 'var(--ol-bad)' : undefined }}>
            <div className={s.panelTitle}>{t('Call stack (the ONE JavaScript thread)', 'Call stack (MỘT luồng JavaScript duy nhất)')}</div>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4, minHeight: 34 }}>
              {S.stack.length ? S.stack.map((f, k) => (
                <div key={k} className={s.mono} style={{ padding: '4px 8px', borderRadius: 7, background: k === S.stack.length - 1 ? 'var(--ol-accent)' : 'var(--ol-panel2)', color: k === S.stack.length - 1 ? '#fff' : undefined, fontWeight: 700 }}>
                  {sc.cbs[f.inst.cb]?.name ?? f.inst.label}{f.inst.ctx !== 'main' ? ` [${f.inst.ctx}]` : ''}{f.busy ? ` → ${f.busy} ⏳` : ''}
                </div>
              )) : <span className={s.empty}>{t('empty — the event loop may pick the next callback', 'trống — event loop được chọn callback kế')}</span>}
            </div>
          </div>
          <div className={s.grid2} style={{ gap: 8 }}>
            <Q title="process.nextTick" items={S.tickQ} empty="—" color="#7c3aed" />
            <Q title={t('microtasks (Promise)', 'microtask (Promise)')} items={S.microQ} empty="—" color="#db2777" />
          </div>
          <div className={s.panel} style={{ padding: '6px 8px' }}>
            <div className={s.panelTitle}>{t('Event loop phases (libuv)', 'Các pha của event loop (libuv)')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {PHASES.map(([ph, label], k) => (
                <span key={ph} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span className={s.mono} style={{ padding: '3px 8px', borderRadius: 999, fontWeight: 800, fontSize: 12, border: '2px solid', borderColor: S.phase === ph ? 'var(--ol-accent)' : 'var(--ol-border)', background: S.phase === ph ? 'var(--ol-accent-bg)' : undefined }}>{label}</span>
                  {k < 2 && <span className={s.small}>→</span>}
                </span>
              ))}
              <span className={s.small}>↺ {S.phase === 'main' ? t('(not started: main() still running)', '(chưa bắt đầu: main() đang chạy)') : S.phase === 'done' ? t('(exited)', '(đã thoát)') : ''}</span>
            </div>
            <div className={s.grid3} style={{ gap: 6, marginTop: 6 }}>
              <Q title={t('timers', 'timers')} items={[...S.timers].sort((a, b) => a.due - b.due)} empty="—" color="#d97706" sub={(i) => `@${(i as Inst & { due: number }).due}`} />
              <Q title={t('poll: I/O done', 'poll: I/O xong')} items={S.pollQ} empty="—" color="#059669" />
              <Q title="check (setImmediate)" items={S.checkQ} empty="—" color="#0891b2" />
            </div>
          </div>
          <div className={s.panel} style={{ padding: '6px 8px' }}>
            <div className={s.panelTitle}>{t(`libuv thread pool (${S.pool.length} threads)`, `Thread pool của libuv (${S.pool.length} luồng)`)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(4, S.pool.length)}, minmax(0,1fr))`, gap: 4 }}>
              {S.pool.map((j, k) => {
                const pr = j ? Math.max(0, Math.min(1, (S.now - j.start) / j.ms)) : 0;
                return (
                  <div key={k} style={{ border: '1px solid var(--ol-border)', borderRadius: 7, padding: '3px 6px', fontSize: 11.5, minWidth: 0, background: 'var(--ol-bg)' }}>
                    <div style={{ fontWeight: 800 }}>#{k + 1}</div>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j ? j.label : t('idle', 'rảnh')}</div>
                    <div style={{ height: 4, background: 'var(--ol-panel2)', borderRadius: 2 }}><div style={{ width: `${pr * 100}%`, height: '100%', background: '#059669', borderRadius: 2 }} /></div>
                  </div>
                );
              })}
            </div>
            {S.poolWait.length > 0 && <div className={s.small} style={{ marginTop: 4 }}>{t('waiting for a pool thread', 'chờ luồng của pool')}: <b>{S.poolWait.map((j) => j.label).join(', ')}</b></div>}
          </div>
          <div className={s.panel} style={{ padding: '6px 8px' }}>
            <div className={s.panelTitle}>{t('Kernel: sockets in epoll (no thread)', 'Kernel: socket trong epoll (không tốn luồng)')}</div>
            <div className={s.chips} style={{ minHeight: 24 }}>
              {S.net.length ? S.net.map((j) => <span key={j.id} className={s.chip} style={{ background: '#475569', fontSize: 11.5, height: 'auto', padding: '2px 7px' }}>{j.label} · @{j.end} ms</span>) : <span className={s.empty}>—</span>}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
