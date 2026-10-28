'use client';
/** Semaphore (pool N chỗ), producer–consumer với biến điều kiện (`if` vs `while`), khoá đọc–ghi và người ghi bị đói. */
import { useMemo, useState } from 'react';
import { Dices, Zap } from 'lucide-react';
import { allStuck, autoRun, init, runnable, spurious, stepThread, type Sched, type SState } from './engine/sync';
import { Controls, Explain, Frame, Kpi, Seg, colorOf, css as s, cx, rng, tx, usePlayer, type Lang } from './ui';

type Mode = 'semaphore' | 'pc' | 'rw';
const PRE: Record<string, { mode: Mode; leak?: boolean; loop?: boolean; pref?: 'reader' | 'writer'; sched: Sched | 'manual' }> = {
  semaphore: { mode: 'semaphore', sched: 'rand' }, leak: { mode: 'semaphore', leak: true, sched: 'rr' },
  pcif: { mode: 'pc', loop: false, sched: 'steal' }, pcwhile: { mode: 'pc', loop: true, sched: 'steal' },
  readers: { mode: 'rw', pref: 'reader', sched: 'rr' }, writerpref: { mode: 'rw', pref: 'writer', sched: 'rr' },
};
const NOTE: Record<Mode, [string, string]> = {
  semaphore: ['A counting semaphore with N permits = a pool of N connections. P() (acquire) takes a permit or sleeps; V() (release) gives it back — straight to a waiter if there is one. At most N threads are ever inside.', 'Semaphore đếm với N chỗ = một pool N kết nối. P() (acquire) lấy một chỗ hoặc ngủ; V() (release) trả lại — trao thẳng cho người đang chờ nếu có. Không bao giờ quá N luồng bên trong.'],
  pc: ['Bounded buffer (N = 2), one producer and two consumers, one mutex m and two condition variables. wait() releases m and sleeps in one atomic step; signal() only WAKES a sleeper — it must re-acquire m, and someone else may get there first.', 'Bộ đệm giới hạn (N = 2), một producer và hai consumer, một mutex m và hai biến điều kiện. wait() nhả m và ngủ trong một bước nguyên tử; signal() chỉ ĐÁNH THỨC — luồng đó phải giành lại m, và kẻ khác có thể tới trước.'],
  rw: ['Many readers may hold a read lock together; a writer needs it alone. If new readers may always join while others are reading, the count of readers never reaches zero — and the writer waits forever.', 'Nhiều người đọc được giữ khoá đọc cùng lúc; người ghi cần khoá một mình. Nếu người đọc mới luôn được vào khi người khác đang đọc, số người đọc không bao giờ về 0 — và người ghi chờ mãi.'],
};
const ST_COLOR: Record<string, string> = { ready: 'var(--ol-ok)', blocked: 'var(--ol-warn)', done: 'var(--ol-muted)', crashed: 'var(--ol-bad)' };

export default function SyncSim({ lang = 'vi', preset = 'semaphore' }: { lang?: Lang; preset?: string }) {
  const P0 = PRE[preset] ?? PRE.semaphore;
  const [mode, setMode] = useState<Mode>(P0.mode);
  const [slots, setSlots] = useState(3);
  const [leak, setLeak] = useState(!!P0.leak);
  const [loop, setLoop] = useState(P0.loop ?? false);
  const [pref, setPref] = useState<'reader' | 'writer'>(P0.pref ?? 'reader');
  const [sched, setSched] = useState<Sched | 'manual'>(P0.sched);
  const [seed, setSeed] = useState(5);
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const fresh = () => init(mode, { slots, leak, loop, pref, items: 6 });
  const [manual, setManual] = useState<SState[]>(() => [fresh()]);
  const auto = useMemo(() => (sched === 'manual' ? null : autoRun(init(mode, { slots, leak, loop, pref, items: 6 }), sched, mode === 'rw' ? 300 : 200, rng(seed))), [mode, slots, leak, loop, pref, sched, seed]);
  const states = auto ?? manual;
  const p = usePlayer(states.length, 700);
  const S = states[Math.min(p.i, states.length - 1)];
  const reset = () => { setManual([fresh()]); p.reset(); };
  const go = (fn: (x: SState) => SState) => {
    if (sched !== 'manual') return;
    const cur = manual[Math.min(p.i, manual.length - 1)];
    const nh = [...manual.slice(0, p.i + 1), fn(cur)];
    setManual(nh); window.setTimeout(() => p.setI(nh.length - 1), 0);
  };
  const stuck = allStuck(S);
  const err = S.errors.length > 0;

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Semaphores, condition variables, read–write locks', 'Semaphore, biến điều kiện, khoá đọc–ghi')}
      sub={t('Instruction by instruction, with Mesa semantics like pthreads and Java', 'Từng lệnh một, với ngữ nghĩa Mesa như pthread và Java')}>
      <div className={s.bar}>
        <Seg value={mode} options={[['semaphore', t('Semaphore pool', 'Pool semaphore')], ['pc', t('Producer–consumer', 'Producer–consumer')], ['rw', t('Readers–writers', 'Readers–writers')]]}
          onChange={(v) => { setMode(v); setSched(v === 'pc' ? 'steal' : v === 'rw' ? 'rr' : 'rand'); setManual([init(v, { slots, leak, loop, pref, items: 6 })]); p.reset(); }} />
      </div>
      <div className={s.bar}>
        {mode === 'semaphore' && <>
          <Seg label={t('Permits N', 'Số chỗ N')} value={slots} options={[[1, '1'], [2, '2'], [3, '3'], [4, '4']]} onChange={(v) => { setSlots(v); reset(); }} />
          <label className={s.lbl}><input type="checkbox" checked={leak} onChange={(e) => { setLeak(e.target.checked); reset(); }} />{t('bug: T3 forgets release() on its error path', 'lỗi: T3 quên release() ở nhánh lỗi')}</label>
        </>}
        {mode === 'pc' && <Seg label={t('Guard', 'Điều kiện')} value={loop ? 'while' : 'if'} options={[['if', 'if (…) wait'], ['while', 'while (…) wait']]} onChange={(v) => { setLoop(v === 'while'); reset(); }} />}
        {mode === 'rw' && <Seg label={t('Lock prefers', 'Khoá ưu tiên')} value={pref} options={[['reader', t('readers', 'người đọc')], ['writer', t('writers', 'người ghi')]]} onChange={(v) => { setPref(v); reset(); }} />}
        <Seg label={t('Interleaving', 'Xen kẽ')} value={sched}
          options={[...(mode === 'pc' ? [['steal', t('the bad one', 'kịch bản xấu')] as [Sched, string]] : []), ['rr', t('round robin', 'xoay vòng')], ['rand', t('random', 'ngẫu nhiên')], ['manual', t('you choose', 'bạn chọn')]]}
          onChange={(v) => { setSched(v); reset(); }} />
        {sched === 'rand' && <button type="button" className={s.btn} onClick={() => { setSeed((x) => x + 1); p.reset(); }}><Dices />#{seed}</button>}
      </div>
      <Explain>{t(NOTE[mode][0], NOTE[mode][1])}</Explain>
      <Controls p={p} lang={lang} extra={sched === 'manual' ? (
        <>
          {S.th.map((th, k) => <button type="button" key={k} className={s.btn} style={{ borderColor: colorOf(k) }} disabled={!runnable(S, k) || p.i < manual.length - 1} onClick={() => go((x) => stepThread(x, k))}>▶ {th.name}</button>)}
          {mode === 'pc' && <button type="button" className={s.btn} disabled={p.i < manual.length - 1} onClick={() => go(spurious)}><Zap />{t('spurious wakeup', 'đánh thức giả')}</button>}
        </>
      ) : undefined} />
      <Explain tone={err ? 'bad' : stuck ? 'warn' : undefined}>
        <b>{t(`Step ${S.steps}`, `Bước ${S.steps}`)}:</b> {t(S.en, S.vi)}
        {err && <> <b>{t('BUG:', 'LỖI:')}</b> {S.errors.join('; ')}. {!loop && mode === 'pc' && t('With `while` the woken thread would have checked again and gone back to sleep.', 'Với `while`, luồng được đánh thức sẽ kiểm lại và ngủ tiếp.')}</>}
        {stuck && !err && <> {mode === 'semaphore' ? t(' Every thread is waiting for a permit nobody will ever release — the service hangs without an error.', ' Mọi luồng đều chờ một chỗ không ai bao giờ trả — dịch vụ treo mà không có lỗi nào.') : t(' Everyone is waiting (the producer has finished its items).', ' Mọi luồng đều đang chờ (producer đã làm xong số món của nó).')}</>}
      </Explain>

      <div className={s.grid2} style={{ marginTop: 10, alignItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))', gap: 8 }}>
          {S.th.map((th, k) => (
            <div key={k} className={s.panel} style={{ padding: '6px 8px', borderColor: S.ran === k ? colorOf(k) : undefined, borderWidth: S.ran === k ? 2 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 800, color: colorOf(k) }}>{th.name} <span className={s.small}>{th.role}</span></span>
                <span style={{ fontSize: 11, fontWeight: 800, color: ST_COLOR[th.status] }}>
                  {th.status === 'blocked' ? `⏸ ${t('waits', 'chờ')} ${th.on}` : th.status === 'ready' ? (th.phase === 'relock' ? t('▶ woken, needs m', '▶ đã thức, cần m') : '▶ ready') : th.status === 'crashed' ? '💥' : '✓'}
                </span>
              </div>
              <div className={s.code} style={{ fontSize: 11.5, padding: '4px 0' }}>
                {th.prog.map((ins, j) => <span key={j} className={cx(s.ln, th.pc === j && th.status !== 'done' && s.cur)} style={{ padding: '0 8px' }}>{ins.txt}</span>)}
              </div>
              <div className={s.small} style={{ marginTop: 3 }}>
                {t('holds', 'giữ')}: {th.holds.length ? [...new Set(th.holds)].map((h) => `${h}${th.holds.filter((x) => x === h).length > 1 ? `×${th.holds.filter((x) => x === h).length}` : ''}`).join(', ') : '—'} · {t('rounds', 'vòng')}: {th.loops}
                {th.waited > 3 && <span style={{ color: 'var(--ol-warn)', fontWeight: 700 }}> · {t('waiting', 'chờ')} {th.waited}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className={s.stack}>
          {mode === 'semaphore' && (() => {
            const P = S.sems.pool;
            const holders = S.th.flatMap((th) => th.holds.filter((h) => h === 'pool').map(() => th.name));
            return (
              <div className={s.panel}>
                <div className={s.panelTitle}>{t('Semaphore "pool"', 'Semaphore "pool"')} · {t('free', 'trống')} {P.v}/{P.max}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Array.from({ length: P.max }, (_, k) => (
                    <div key={k} style={{ width: 64, height: 44, borderRadius: 9, border: '2px solid var(--ol-border)', display: 'grid', placeItems: 'center', fontWeight: 800, background: holders[k] ? colorOf(S.th.findIndex((x) => x.name === holders[k])) : 'var(--ol-panel2)', color: holders[k] ? '#fff' : 'var(--ol-muted)' }}>
                      {holders[k] ?? t('free', 'trống')}
                    </div>
                  ))}
                </div>
                <div className={s.small} style={{ marginTop: 6 }}>{t('queue', 'hàng chờ')}: {P.q.length ? P.q.map((q) => S.th[q].name).join(' → ') : '—'}</div>
                <div className={s.kpis} style={{ marginTop: 6 }}>
                  <Kpi k={t('max inside at once', 'tối đa cùng lúc')} v={S.maxInside} tone={S.maxInside <= P.max ? 'ok' : 'bad'} />
                  <Kpi k={t('waiting', 'đang chờ')} v={P.q.length} tone={P.q.length > 2 ? 'warn' : undefined} />
                </div>
              </div>
            );
          })()}
          {mode === 'pc' && (
            <div className={s.panel}>
              <div className={s.panelTitle}>{t('Shared state', 'Trạng thái chung')}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className={s.small}>buf[N=2]</span>
                {Array.from({ length: S.cap }, (_, k) => <div key={k} style={{ width: 54, height: 40, borderRadius: 8, border: '2px solid var(--ol-border)', display: 'grid', placeItems: 'center', fontWeight: 800, background: S.buf[k] ? '#d97706' : 'var(--ol-panel2)', color: S.buf[k] ? '#fff' : 'var(--ol-muted)' }}>{S.buf[k] ? `#${S.buf[k]}` : '·'}</div>)}
                <span className={s.mono} style={{ fontWeight: 800 }}>count = {err ? -1 : S.buf.length}</span>
              </div>
              <table className={cx(s.tbl, s.compact)} style={{ marginTop: 8 }}>
                <tbody>
                  <tr><td>mutex m</td><td className={s.mono}>{S.mx.m.owner === null ? t('free', 'trống') : `${t('held by', 'do')} ${S.th[S.mx.m.owner].name}`}{S.mx.m.q.length ? ` · ${t('waiting', 'chờ')}: ${S.mx.m.q.map((q) => S.th[q].name).join(', ')}` : ''}</td></tr>
                  <tr><td>notEmpty</td><td className={s.mono}>{S.cv.notEmpty.map((q) => S.th[q].name).join(', ') || '—'}</td></tr>
                  <tr><td>notFull</td><td className={s.mono}>{S.cv.notFull.map((q) => S.th[q].name).join(', ') || '—'}</td></tr>
                </tbody>
              </table>
              <div className={s.kpis} style={{ marginTop: 6 }}>
                <Kpi k={t('produced', 'đã làm')} v={S.produced} />
                <Kpi k={t('consumed', 'đã dùng')} v={S.consumed} />
                <Kpi k={t('spurious', 'thức giả')} v={S.spurious} />
              </div>
            </div>
          )}
          {mode === 'rw' && (() => {
            const W = S.th[4];
            return (
              <div className={s.panel}>
                <div className={s.panelTitle}>{t('Read–write lock', 'Khoá đọc–ghi')}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className={s.small}>{t('inside', 'bên trong')}:</span>
                  {S.rw.writer !== null ? <span className={s.chip} style={{ background: colorOf(4) }}>W ✍</span> :
                    S.th.filter((x) => x.holds.includes('R')).map((x) => <span key={x.name} className={s.chip} style={{ background: colorOf(S.th.indexOf(x)) }}>{x.name} 👁</span>)}
                  {S.rw.writer === null && S.rw.readers === 0 && <span className={s.empty}>{t('nobody', 'không ai')}</span>}
                </div>
                <div className={s.kpis} style={{ marginTop: 8 }}>
                  <Kpi k={t('reads done', 'lượt đọc')} v={S.rw.reads} />
                  <Kpi k={t('writes done', 'lượt ghi')} v={S.rw.writes} tone={S.rw.writes ? 'ok' : S.steps > 60 ? 'bad' : undefined} />
                  <Kpi k={t('writer waiting (steps)', 'người ghi đã chờ (bước)')} v={W.waited} tone={W.waited > 40 ? 'bad' : undefined} />
                </div>
                <div className={s.small} style={{ marginTop: 6 }}>{pref === 'reader'
                  ? t('Reader preference: a new reader enters whenever no writer is INSIDE. The readers overlap, the count never drops to 0 — writer starvation. (Java\'s ReentrantReadWriteLock non-fair mode and pthread_rwlock default lean this way.)', 'Ưu tiên người đọc: người đọc mới được vào khi không có người ghi BÊN TRONG. Người đọc gối nhau, số đếm không bao giờ về 0 — người ghi bị đói. (Chế độ không công bằng của ReentrantReadWriteLock và pthread_rwlock mặc định nghiêng về phía này.)')
                  : t('Writer preference: once a writer is waiting, new readers queue behind it. The current readers drain, the writer goes in. (The cost: readers can now starve if writers keep coming.)', 'Ưu tiên người ghi: hễ có người ghi đang chờ thì người đọc mới phải xếp sau. Người đọc hiện tại ra hết, người ghi vào. (Cái giá: giờ người đọc có thể đói nếu người ghi tới liên tục.)')}</div>
              </div>
            );
          })()}
        </div>
      </div>
    </Frame>
  );
}
