'use client';
/** Race condition từng lệnh máy: counter++ = load/add/store; sửa bằng mutex/atomic; deadlock hai khoá và cách sửa. */
import { useMemo, useState } from 'react';
import { BarChart3, Dices } from 'lucide-react';
import { autoRun, histogram, init, runnable, step, finished, type RMode, type RState } from './engine/race';
import { Controls, Explain, Frame, Kpi, Seg, colorOf, css as s, cx, rng, tx, usePlayer, type Lang } from './ui';

const MODES: Array<[RMode, string, string]> = [
  ['none', 'No lock', 'Không khoá'], ['mutex', 'Mutex', 'Mutex'], ['atomic', 'Atomic', 'Nguyên tử'],
  ['deadlock', 'Deadlock (A→B, B→A)', 'Deadlock (A→B, B→A)'], ['ordered', 'Fixed lock order', 'Cố định thứ tự khoá'],
];
const NOTE: Record<RMode, [string, string]> = {
  none: ['counter++ looks like one step in C, Java or JS, but the CPU does three: load, add, store. If the other thread runs between your load and your store, one increment disappears.', 'counter++ trông như một bước trong C, Java hay JS, nhưng CPU làm ba bước: nạp, cộng, ghi. Nếu luồng kia chạy chen giữa lúc bạn nạp và lúc bạn ghi, một lần tăng biến mất.'],
  mutex: ['A mutex turns the three instructions into a critical section: only the thread holding m may be inside. The other sleeps until unlock.', 'Mutex biến ba lệnh thành một vùng găng: chỉ luồng đang giữ m được vào. Luồng kia ngủ tới khi có unlock.'],
  atomic: ['An atomic read-modify-write (lock xadd on x86, ldadd/LL-SC on ARM, AtomicInteger in Java) does all three in one indivisible instruction. No lock, no lost updates.', 'Phép đọc-sửa-ghi nguyên tử (lock xadd trên x86, ldadd/LL-SC trên ARM, AtomicInteger trong Java) làm cả ba trong một lệnh không chia cắt. Không cần khoá, không mất lần tăng nào.'],
  deadlock: ['Two bank transfers: T1 locks account A then B, T2 locks B then A. Interleave them and each holds one lock while waiting for the other — forever.', 'Hai lệnh chuyển tiền: T1 khoá tài khoản A rồi B, T2 khoá B rồi A. Chạy xen kẽ là mỗi luồng giữ một khoá và chờ khoá kia — mãi mãi.'],
  ordered: ['The fix: every thread takes locks in the same global order (A before B). A cycle in the wait-for graph becomes impossible.', 'Cách sửa: mọi luồng lấy khoá theo cùng một thứ tự toàn cục (A trước B). Đồ thị chờ không thể tạo vòng nữa.'],
};

export default function RaceSim({ lang = 'vi', preset = 'none' }: { lang?: Lang; preset?: string }) {
  const [mode, setMode] = useState<RMode>((MODES.find((m) => m[0] === preset)?.[0]) ?? 'none');
  const [n, setN] = useState(3);
  const [sched, setSched] = useState<'alt' | 'rand' | 'manual' | 'seq'>(preset === 'deadlock' || preset === 'ordered' ? 'alt' : 'alt');
  const [seed, setSeed] = useState(7);
  const [manual, setManual] = useState<RState[]>(() => [init(mode, n)]);
  const [hist, setHist] = useState<Array<[number, number]> | null>(null);

  const auto = useMemo(() => (sched === 'manual' ? null : autoRun(mode, n, sched, rng(seed))), [mode, n, sched, seed]);
  const states = auto ?? manual;
  const p = usePlayer(states.length, 1100);
  const S = states[Math.min(p.i, states.length - 1)];
  const expected = mode === 'deadlock' || mode === 'ordered' ? null : 2 * n;

  const reset = (m: RMode = mode, k: number = n) => { setManual([init(m, k)]); setHist(null); p.reset(); };
  const manualStep = (t: number) => {
    const cur = manual[Math.min(p.i, manual.length - 1)];
    if (!runnable(cur, t) || finished(cur)) return;
    const nh = [...manual.slice(0, p.i + 1), step(cur, t)];
    setManual(nh);
    window.setTimeout(() => p.setI(nh.length - 1), 0);
  };

  const W = 300, lineH = 21;
  const lockOwner = (L: string) => S.locks[L];

  return (
    <Frame badge={tx(lang, 'OS lab', 'Phòng lab OS')} title={tx(lang, 'Race condition, instruction by instruction', 'Race condition, từng lệnh máy một')}
      sub={tx(lang, 'Two threads, one shared variable — and how locks fix it (or deadlock)', 'Hai luồng, một biến chung — và khoá sửa nó ra sao (hoặc gây deadlock)')}>
      <div className={s.bar}>
        <Seg label={tx(lang, 'Mode', 'Chế độ')} value={mode} options={MODES.map(([v, en, vi]) => [v, tx(lang, en, vi)])} onChange={(v) => { setMode(v); reset(v); }} />
      </div>
      <div className={s.bar}>
        {mode !== 'deadlock' && mode !== 'ordered' && (
          <span className={s.lbl}>{tx(lang, 'Increments per thread', 'Số lần tăng mỗi luồng')}
            <input type="number" min={1} max={5} value={n} onChange={(e) => { const k = Math.max(1, Math.min(5, Number(e.target.value) || 1)); setN(k); reset(mode, k); }} /></span>
        )}
        <Seg label={tx(lang, 'Interleaving', 'Cách xen kẽ')} value={sched}
          options={[['alt', tx(lang, 'alternate (worst case)', 'luân phiên (xấu nhất)')], ['rand', tx(lang, 'random', 'ngẫu nhiên')], ['seq', tx(lang, 'one after another', 'lần lượt')], ['manual', tx(lang, 'you choose', 'bạn chọn')]]}
          onChange={(v) => { setSched(v); reset(); }} />
        {sched === 'rand' && <button type="button" className={s.btn} onClick={() => { setSeed((x) => x + 1); p.reset(); }}><Dices />{tx(lang, 'new random run', 'lần chạy ngẫu nhiên mới')} #{seed}</button>}
      </div>
      <Explain>{tx(lang, NOTE[mode][0], NOTE[mode][1])}</Explain>
      <Controls p={p} lang={lang} extra={sched === 'manual' ? (
        <>
          <button type="button" className={s.btn} style={{ borderColor: colorOf(0) }} disabled={!runnable(S, 0) || finished(S) || p.i < manual.length - 1} onClick={() => manualStep(0)}>▶ T1</button>
          <button type="button" className={s.btn} style={{ borderColor: colorOf(1) }} disabled={!runnable(S, 1) || finished(S) || p.i < manual.length - 1} onClick={() => manualStep(1)}>▶ T2</button>
        </>
      ) : undefined} />

      <div className={s.grid3} style={{ alignItems: 'start' }}>
        {[0, 1].map((t) => {
          const T = S.th[t], c = colorOf(t);
          return (
            <div key={t} className={s.panel} style={{ borderColor: S.ranThread === t ? c : undefined, borderWidth: S.ranThread === t ? 2 : 1 }}>
              <div className={s.panelTitle} style={{ color: c }}>
                {tx(lang, `Thread T${t + 1}`, `Luồng T${t + 1}`)} · {T.done ? tx(lang, 'done', 'xong') : T.blockedOn && lockOwner(T.blockedOn) !== null ? tx(lang, `blocked on ${T.blockedOn}`, `chờ khoá ${T.blockedOn}`) : tx(lang, 'runnable', 'chạy được')}
              </div>
              <div className={s.code} style={{ maxHeight: 9 * lineH + 16, overflowY: 'auto' }}>
                {S.prog[t].map((ins, k) => (
                  <span key={k} className={cx(s.ln, T.pc === k && !T.done && s.cur)} style={T.pc > k ? { opacity: 0.45 } : undefined}>
                    {ins.op === 'lock' || ins.op === 'unlock' ? <span className={s.fn}>{ins.txt}</span> : ins.op === 'xadd' ? <span className={s.ty}>{ins.txt}</span> : ins.op === 'work' ? <span className={s.cm}>{ins.txt}</span> : ins.txt}
                  </span>
                ))}
              </div>
              <div className={s.bar} style={{ marginBottom: 0 }}>
                {mode !== 'deadlock' && mode !== 'ordered' && <span className={s.mono}>r = {T.reg}</span>}
                <span className={s.small}>{tx(lang, 'holds', 'đang giữ')}: {T.holds.length ? T.holds.join(', ') : '—'}</span>
                {mode !== 'deadlock' && mode !== 'ordered' && <span className={s.small}>{tx(lang, 'increments written', 'lần tăng đã ghi')}: {T.inc}</span>}
              </div>
            </div>
          );
        })}
        <div className={s.stack}>
          {mode !== 'deadlock' && mode !== 'ordered' ? (
            <div className={cx(s.panel, S.lastLost && s.flash)} key={S.steps} style={{ borderColor: S.lastLost ? 'var(--ol-bad)' : undefined }}>
              <div className={s.panelTitle}>{tx(lang, 'Shared memory', 'Bộ nhớ chung')}</div>
              <div className={s.mono} style={{ fontSize: 26, fontWeight: 800 }}>counter = {S.mem}</div>
              <div className={s.kpis} style={{ marginTop: 6 }}>
                <Kpi k={tx(lang, 'expected', 'đáng lẽ')} v={expected} />
                <Kpi k={tx(lang, 'lost updates', 'lần tăng mất')} v={S.lost} tone={S.lost ? 'bad' : 'ok'} />
              </div>
            </div>
          ) : (
            <div className={s.panel} style={{ borderColor: S.deadlock ? 'var(--ol-bad)' : undefined }}>
              <div className={s.panelTitle}>{tx(lang, 'Locks and the wait-for graph', 'Khoá và đồ thị chờ')}</div>
              <svg width={W} height={170} viewBox={`0 0 ${W} 170`} role="img" aria-label="wait-for graph" style={{ maxWidth: '100%' }}>
                <defs><marker id="ol-wf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ol-muted)" /></marker>
                  <marker id="ol-wf-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ol-bad)" /></marker></defs>
                {/* T1 (trái), T2 (phải), khoá A (trên), B (dưới) */}
                {(['A', 'B'] as const).map((L, k) => {
                  const y = k === 0 ? 30 : 140, owner = lockOwner(L);
                  return (
                    <g key={L}>
                      <rect x={W / 2 - 26} y={y - 18} width={52} height={36} rx={6} fill="var(--ol-panel2)" stroke={owner === null ? 'var(--ol-border)' : colorOf(owner!)} strokeWidth={2} />
                      <text x={W / 2} y={y + 5} fontSize={14} fontWeight={800} textAnchor="middle" className={s.svgText}>🔒{L}</text>
                      {owner !== null && owner !== undefined && (
                        <path d={`M${W / 2 + (owner === 0 ? -26 : 26)},${y} L${owner === 0 ? 62 : W - 62},85`} stroke={colorOf(owner)} strokeWidth={2.5} fill="none" />
                      )}
                    </g>
                  );
                })}
                {[0, 1].map((t) => {
                  const T = S.th[t], x = t === 0 ? 34 : W - 34, c = colorOf(t);
                  const waitL = T.blockedOn && lockOwner(T.blockedOn) !== null ? T.blockedOn : null;
                  return (
                    <g key={t}>
                      <circle cx={x} cy={85} r={26} fill={c} />
                      <text x={x} y={90} fontSize={14} fontWeight={800} textAnchor="middle" fill="#fff">T{t + 1}</text>
                      {waitL && <path d={`M${x + (t === 0 ? 18 : -18)},${t === 0 ? 70 : 100} L${W / 2 + (t === 0 ? -28 : 28)},${waitL === 'A' ? 36 : 134}`} stroke={S.deadlock ? 'var(--ol-bad)' : 'var(--ol-muted)'} strokeWidth={2.5} strokeDasharray="6 4" fill="none" markerEnd={`url(#${S.deadlock ? 'ol-wf-r' : 'ol-wf'})`} />}
                    </g>
                  );
                })}
              </svg>
              <div className={s.small}>{tx(lang, 'Solid line = holds the lock · dashed arrow = waits for it. A cycle = deadlock.', 'Nét liền = đang giữ khoá · mũi tên đứt = đang chờ khoá. Có vòng = deadlock.')}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <Explain tone={S.deadlock || S.lastLost ? 'bad' : finished(S) ? 'ok' : undefined}>
          <b>{tx(lang, `Step ${p.i}`, `Bước ${p.i}`)}:</b> {tx(lang, S.en, S.vi)}
          {finished(S) && !S.deadlock && expected !== null && (
            S.mem === expected
              ? tx(lang, ` ✓ Final value ${S.mem} = ${expected}.`, ` ✓ Kết quả ${S.mem} = ${expected}.`)
              : tx(lang, ` ✗ Final value ${S.mem}, expected ${expected}: ${expected - S.mem} update(s) lost — and no error message anywhere.`, ` ✗ Kết quả ${S.mem}, đáng lẽ ${expected}: mất ${expected - S.mem} lần tăng — và không có thông báo lỗi nào cả.`)
          )}
        </Explain>
      </div>

      {(mode === 'none' || mode === 'mutex' || mode === 'atomic') && (
        <div className={s.panel} style={{ marginTop: 10 }}>
          <div className={s.bar} style={{ marginTop: 0 }}>
            <button type="button" className={s.btn} onClick={() => setHist(histogram(mode, n, 1000, rng(seed * 31 + n)))}><BarChart3 />{tx(lang, 'Run it 1,000 times with random interleavings', 'Chạy 1.000 lần với xen kẽ ngẫu nhiên')}</button>
            <span className={s.small}>{tx(lang, 'This is what "it works on my machine" hides: the result depends on timing.', 'Đây là điều "máy tôi chạy được mà" che giấu: kết quả phụ thuộc vào thời điểm.')}</span>
          </div>
          {hist && (
            <div className={s.svgWrap}>
              <svg width={Math.max(320, hist.length * 56 + 20)} height={150} viewBox={`0 0 ${Math.max(320, hist.length * 56 + 20)} 150`} role="img" aria-label="histogram">
                {hist.map(([v, c], k) => {
                  const max = Math.max(...hist.map((h) => h[1]));
                  const h = Math.max(2, (c / max) * 100), x = 10 + k * 56;
                  const good = v === expected;
                  return (
                    <g key={v}>
                      <rect x={x} y={115 - h} width={44} height={h} rx={4} fill={good ? 'var(--ol-ok)' : 'var(--ol-bad)'} opacity={0.85} />
                      <text x={x + 22} y={110 - h} fontSize={11} textAnchor="middle" className={s.svgText}>{c}</text>
                      <text x={x + 22} y={132} fontSize={12} fontWeight={800} textAnchor="middle" className={s.svgText}>{v}</text>
                    </g>
                  );
                })}
                <text x={10} y={147} fontSize={10.5} className={s.svgMuted}>{tx(lang, `final counter value (expected ${expected}) · bar = how many of 1,000 runs`, `giá trị cuối của counter (đáng lẽ ${expected}) · cột = bao nhiêu trong 1.000 lần`)}</text>
              </svg>
            </div>
          )}
        </div>
      )}
    </Frame>
  );
}
