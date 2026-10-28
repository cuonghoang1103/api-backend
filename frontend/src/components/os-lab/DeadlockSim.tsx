'use client';
/** Phòng lab deadlock: Banker từng bước, phát hiện deadlock (đồ thị nhiều bản), triết gia ăn tối, đảo ngược ưu tiên. */
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Dices } from 'lucide-react';
import { availOf, detectExamples, hasCycle, initDine, priorityInversion, request, safety, stepDine, textbookBank, type Bank, type Detect, type Dine, type PMode, type SafeStep, type Vec } from './engine/deadlock';
import { useWidth } from './charts';
import { Controls, Explain, Frame, Kpi, Seg, colorOf, css as s, cx, rng, tx, usePlayer, type Lang } from './ui';
import { useLabBridge } from '../labs/bus';
import { labSfx } from '../labs/sfx';

type Tab = 'banker' | 'detect' | 'philo' | 'pi';
const TAB_OF: Record<string, Tab> = { banker: 'banker', request: 'banker', detect: 'detect', cycle: 'detect', pool: 'detect', philosophers: 'philo', inversion: 'pi' };
const v = (x: Vec) => `(${x.join(',')})`;

export default function DeadlockSim({ lang = 'vi', preset = 'banker' }: { lang?: Lang; preset?: string }) {
  const [tab, setTab] = useState<Tab>(TAB_OF[preset] ?? 'banker');
  const t = (en: string, vi: string) => tx(lang, en, vi);
  useLabBridge('deadlock', { tab }, { tab: (x) => setTab(x as Tab) });
  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Deadlock lab', 'Phòng lab deadlock')} sub={t('Avoid it, detect it, provoke it — and the priority bug that rebooted a Mars rover', 'Tránh nó, phát hiện nó, gây ra nó — và lỗi ưu tiên đã làm xe tự hành sao Hoả khởi động lại')}>
      <div className={s.tabs} role="tablist" data-tour="tabs">
        {([['banker', "Banker's algorithm", 'Thuật toán Banker'], ['detect', 'Detection (multi-instance)', 'Phát hiện (nhiều bản)'], ['philo', 'Dining philosophers', 'Triết gia ăn tối'], ['pi', 'Priority inversion', 'Đảo ngược ưu tiên']] as const).map(([k, en, vi]) => (
          <button type="button" role="tab" aria-selected={tab === k} key={k} className={cx(s.tab, tab === k && s.on)} onClick={() => setTab(k)}>{t(en, vi)}</button>
        ))}
      </div>
      {tab === 'banker' && <BankerTab lang={lang} startRequest={preset === 'request'} />}
      {tab === 'detect' && <DetectTab lang={lang} start={preset === 'cycle' ? 'cycle' : preset === 'pool' ? 'pool' : 'textbook'} />}
      {tab === 'philo' && <PhiloTab lang={lang} />}
      {tab === 'pi' && <PiTab lang={lang} />}
    </Frame>
  );
}

function StepTable({ lang, names, res, alloc, mid, midLabel, need, needLabel, avail, step, zeroDone }: {
  lang: Lang; names: string[]; res: string[]; alloc: Vec[]; mid: Vec[] | null; midLabel?: string; need: Vec[]; needLabel: string; avail: Vec; step: SafeStep | null; zeroDone?: boolean;
}) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const fin = step ? step.finish : alloc.map((a) => !!zeroDone && a.every((x) => x === 0));
  const work = step ? (step.k === 'run' ? step.newWork : step.work) : avail;
  const cur = step && step.k !== 'end' ? step.i : -1;
  const head = (label: string) => <th colSpan={res.length} style={{ textAlign: 'center' }}>{label}</th>;
  const cells = (x: Vec, hi?: boolean) => x.map((n, k) => <td key={k} className={s.num} style={hi ? { fontWeight: 800 } : undefined}>{n}</td>);
  return (
    <div className={s.scrollX}>
      <table className={cx(s.tbl, s.compact)} style={{ minWidth: 380 }}>
        <thead>
          <tr><th rowSpan={2}></th>{head('Allocation')}{mid && head(midLabel ?? 'Max')}{head(needLabel)}<th rowSpan={2}>Finish</th></tr>
          <tr>{[...res, ...(mid ? res : []), ...res].map((r, k) => <th key={k} className={s.num}>{r}</th>)}</tr>
        </thead>
        <tbody>
          {names.map((n, i) => (
            <tr key={n} className={cx(i === cur && s.hl)}>
              <td style={{ fontWeight: 800 }}>{n}</td>{cells(alloc[i])}{mid && cells(mid[i])}{cells(need[i], i === cur)}
              <td style={{ color: fin[i] ? 'var(--ol-ok)' : 'var(--ol-muted)', fontWeight: 800 }}>{fin[i] ? 'true ✓' : 'false'}</td>
            </tr>
          ))}
          <tr><td style={{ fontWeight: 800 }}>{t('Available', 'Available')}</td>{cells(avail)}{mid && <td colSpan={res.length} />}<td colSpan={res.length} /><td /></tr>
          <tr><td style={{ fontWeight: 800, color: 'var(--ol-accent)' }}>Work</td>{work.map((n, k) => <td key={k} className={s.num} style={{ fontWeight: 800, color: 'var(--ol-accent)' }}>{n}</td>)}{mid && <td colSpan={res.length} />}<td colSpan={res.length} /><td /></tr>
        </tbody>
      </table>
    </div>
  );
}

function narrate(lang: Lang, st: SafeStep | null, names: string[], verb: [string, string]) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  if (!st) return t('Work = Available, every Finish = false. Press Step.', 'Work = Available, mọi Finish = false. Bấm Bước.');
  if (st.k === 'check') return st.ok
    ? t(`${names[st.i]} ${verb[0]} ≤ Work ${v(st.work)}? YES → it can run to completion.`, `${names[st.i]} ${verb[1]} ≤ Work ${v(st.work)}? CÓ → nó chạy được tới cùng.`)
    : t(`${names[st.i]}: its ${verb[0]} is not ≤ Work ${v(st.work)} → skip it for now.`, `${names[st.i]}: ${verb[1]} không ≤ Work ${v(st.work)} → tạm bỏ qua.`);
  if (st.k === 'run') return t(`${names[st.i]} finishes and returns everything it holds: Work ${v(st.work)} → ${v(st.newWork)}.`, `${names[st.i]} chạy xong và trả hết những gì nó giữ: Work ${v(st.work)} → ${v(st.newWork)}.`);
  return st.stuck.length
    ? t(`Nobody else fits. ${st.stuck.map((i) => names[i]).join(', ')} can never finish.`, `Không ai vừa nữa. ${st.stuck.map((i) => names[i]).join(', ')} không bao giờ chạy xong được.`)
    : t(`Everyone finished: <${st.order.map((i) => names[i]).join(', ')}>.`, `Ai cũng xong: <${st.order.map((i) => names[i]).join(', ')}>.`);
}

function BankerTab({ lang, startRequest }: { lang: Lang; startRequest: boolean }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [bank, setBank] = useState<Bank>(textbookBank);
  const [who, setWho] = useState(1);
  const [req, setReq] = useState<Vec>([1, 0, 2]);
  const [last, setLast] = useState<{ verdict: string; i: number; req: Vec; pretend: Bank | null } | null>(null);
  const shown = last?.pretend ?? bank;
  const res = useMemo(() => safety(shown.alloc, shown.need, shown.avail), [shown]);
  const p = usePlayer(res.steps.length + 1, 900);
  const st = p.i === 0 ? null : res.steps[p.i - 1];
  const doneOrder = st ? (st.k === 'end' ? st.order : res.order.slice(0, st.finish.filter(Boolean).length)) : [];
  const ask = (who: number, req: Vec) => {
    const r = request(bank, who, req);
    const pretend: Bank = { ...bank, avail: bank.avail.map((x, k) => x - req[k]), alloc: bank.alloc.map((a, k) => (k === who ? a.map((x, j) => x + req[j]) : a)), need: bank.need.map((n, k) => (k === who ? n.map((x, j) => x - req[j]) : n)) };
    setLast({ verdict: r.verdict, i: who, req, pretend: r.verdict === 'grant' || r.verdict === 'deny' ? pretend : null });
    if (r.verdict === 'grant') setBank(r.after);
    labSfx(r.verdict === 'grant' ? 'right' : r.verdict === 'wait' ? 'tick' : 'wrong');
    p.reset();
  };
  const end = res.steps[res.steps.length - 1] as Extract<SafeStep, { k: 'end' }>;
  useLabBridge('banker', { verdict: last?.verdict ?? '', who: last?.i ?? -1, i: p.i, atEnd: p.atEnd, safe: end ? !end.stuck.length : null }, {
    request: (x) => { const [w, r] = x as [number, Vec]; setWho(w); setReq(r); ask(w, r); },
    reset: () => { setBank(textbookBank()); setLast(null); p.reset(); },
  });
  return (
    <>
      <Explain>{t('Each process declares its MAXIMUM need in advance. The OS only grants a request if, afterwards, there is still some order in which every process could get its maximum and finish (a safe sequence). The safety check below is exactly what you do by hand in the exam — and what ch06/banker.py prints.', 'Mỗi tiến trình khai trước nhu cầu TỐI ĐA. Hệ điều hành chỉ cấp một yêu cầu nếu sau đó vẫn còn một thứ tự để mọi tiến trình lấy đủ tối đa rồi chạy xong (dãy an toàn). Phép kiểm an toàn bên dưới đúng là thứ bạn làm tay trong bài thi — và là thứ ch06/banker.py in ra.')}</Explain>
      <div className={s.panel} style={{ marginTop: 8 }} data-tour="bank-request">
        <div className={s.panelTitle}>{t('Request resources', 'Xin tài nguyên')} {startRequest && !last ? t('— try P1 (1,0,2), then P4 (3,3,0), then P0 (0,2,0)', '— thử P1 (1,0,2), rồi P4 (3,3,0), rồi P0 (0,2,0)') : ''}</div>
        <div className={s.bar} style={{ margin: 0 }}>
          <select value={who} onChange={(e) => setWho(Number(e.target.value))}>{bank.names.map((n, i) => <option key={n} value={i}>{n}</option>)}</select>
          {bank.res.map((r, k) => <span key={r} className={s.lbl}>{r}<input type="number" min={0} max={9} value={req[k]} onChange={(e) => setReq(req.map((x, j) => (j === k ? Math.max(0, Math.min(9, Number(e.target.value) || 0)) : x)))} /></span>)}
          <button type="button" className={cx(s.btn, s.primary)} onClick={() => ask(who, req)} data-tour="bank-ask">{t('Request', 'Xin')}</button>
          <button type="button" className={s.btn} onClick={() => { setBank(textbookBank()); setLast(null); p.reset(); }}>{t('Reset to textbook state', 'Về trạng thái của sách')}</button>
        </div>
        {last && (
          <div style={{ marginTop: 8 }}>
            <Explain tone={last.verdict === 'grant' ? 'ok' : last.verdict === 'wait' ? 'warn' : 'bad'}>
              <b>{bank.names[last.i]} {t('requests', 'xin')} {v(last.req)}.</b>{' '}
              {last.verdict === 'error' && t(`Request > Need ${v(bank.need[last.i])}: it asks for more than it declared — error, rejected.`, `Request > Need ${v(bank.need[last.i])}: xin quá mức đã khai — lỗi, từ chối.`)}
              {last.verdict === 'wait' && t(`Request ≤ Need, but not ≤ Available ${v(bank.avail)} — the process must WAIT.`, `Request ≤ Need, nhưng không ≤ Available ${v(bank.avail)} — tiến trình phải CHỜ.`)}
              {last.verdict === 'grant' && t('Request ≤ Need and ≤ Available. Pretend to grant it, run the safety algorithm on the new state (below): SAFE → GRANT.', 'Request ≤ Need và ≤ Available. Giả vờ cấp, chạy thuật toán an toàn trên trạng thái mới (bên dưới): AN TOÀN → CẤP.')}
              {last.verdict === 'deny' && t('Request ≤ Need and ≤ Available — the resources ARE there — but after pretending to grant, no safe sequence exists (below). DENY: the process waits and the state is rolled back.', 'Request ≤ Need và ≤ Available — tài nguyên CÓ sẵn — nhưng giả vờ cấp xong thì không còn dãy an toàn (bên dưới). TỪ CHỐI: tiến trình chờ và trạng thái được trả về như cũ.')}
            </Explain>
          </div>
        )}
      </div>
      <div className={s.small} style={{ margin: '8px 0 0' }}>{last?.pretend ? t(`Showing the safety check of the PRETEND state (after granting ${bank.names[last.i]} ${v(last.req)}).`, `Đang kiểm an toàn cho trạng thái GIẢ VỜ (sau khi cấp cho ${bank.names[last.i]} ${v(last.req)}).`) : t('Showing the safety check of the current state.', 'Đang kiểm an toàn cho trạng thái hiện tại.')}</div>
      <Controls p={p} lang={lang} />
      <Explain tone={st?.k === 'end' ? (st.stuck.length ? 'bad' : 'ok') : undefined}>{narrate(lang, st, shown.names, ['Need', 'Need'])}</Explain>
      <div style={{ marginTop: 8 }} data-tour="bank-table">
        <StepTable lang={lang} names={shown.names} res={shown.res} alloc={shown.alloc} mid={shown.max} need={shown.need} needLabel="Need = Max − Alloc" avail={shown.avail} step={st} />
      </div>
      <div className={s.bar} data-tour="bank-sequence">
        <span className={s.lbl}>{t('Safe sequence so far', 'Dãy an toàn tới giờ')}:</span>
        <div className={s.chips}>{doneOrder.length ? doneOrder.map((i) => <span key={i} className={s.chip} style={{ background: colorOf(i) }}>{shown.names[i]}</span>) : <span className={s.empty}>—</span>}</div>
        {p.atEnd && <b style={{ color: end.stuck.length ? 'var(--ol-bad)' : 'var(--ol-ok)' }}>{end.stuck.length ? t('UNSAFE', 'KHÔNG AN TOÀN') : t('SAFE', 'AN TOÀN')}</b>}
      </div>
      <div className={s.small}>{t('Unsafe ≠ deadlocked: it means the OS can no longer GUARANTEE that everyone finishes if they all ask for their maximum. Banker refuses to enter such a state.', 'Không an toàn ≠ đã deadlock: nghĩa là hệ điều hành không còn BẢO ĐẢM được ai cũng xong nếu tất cả cùng xin tối đa. Banker từ chối bước vào trạng thái đó.')}</div>
    </>
  );
}

function Rag({ d, lang }: { d: Detect; lang: Lang }) {
  const n = d.names.length, m = d.res.length;
  const W = Math.max(320, 110 * Math.max(n, m)), H = 230;
  const px = (i: number) => ((i + 0.5) * W) / n, rx = (j: number) => ((j + 0.5) * W) / m;
  const py = 40, ry = 170;
  const lines: ReactElement[] = [];
  d.names.forEach((_, i) => d.res.forEach((_, j) => {
    for (let k = 0; k < d.alloc[i][j]; k++) lines.push(<line key={`a${i}${j}${k}`} x1={rx(j) - 18 + k * 7} y1={ry - 20} x2={px(i) + (k - d.alloc[i][j] / 2) * 4} y2={py + 20} stroke={colorOf(i)} strokeWidth={2} markerEnd="url(#ol-rag-a)" />);
    if (d.req[i][j] > 0) lines.push(<g key={`r${i}${j}`}><line x1={px(i) + 6} y1={py + 20} x2={rx(j) + 10} y2={ry - 22} stroke="var(--ol-bad)" strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#ol-rag-r)" /><text x={(px(i) + rx(j)) / 2 + 14} y={(py + ry) / 2} fontSize={11} fill="var(--ol-bad)" fontWeight={800}>{d.req[i][j]}</text></g>);
  }));
  return (
    <div className={s.svgWrap}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="resource allocation graph" style={{ maxWidth: '100%' }}>
        <defs>
          <marker id="ol-rag-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ol-muted)" /></marker>
          <marker id="ol-rag-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ol-bad)" /></marker>
        </defs>
        {lines}
        {d.names.map((nm, i) => <g key={nm}><circle cx={px(i)} cy={py} r={20} fill={colorOf(i)} /><text x={px(i)} y={py + 4} fontSize={12} fontWeight={800} textAnchor="middle" fill="#fff">{nm}</text></g>)}
        {d.res.map((r, j) => (
          <g key={r}>
            <rect x={rx(j) - 32} y={ry - 20} width={64} height={40} rx={6} className={s.svgPanel} stroke="var(--ol-border)" strokeWidth={2} />
            <text x={rx(j)} y={ry + 34} fontSize={12} fontWeight={800} textAnchor="middle" className={s.svgText}>{r} ×{d.inst[j]}</text>
            {Array.from({ length: d.inst[j] }, (_, k) => <circle key={k} cx={rx(j) - 24 + (k % 7) * 8} cy={ry - 8 + Math.floor(k / 7) * 10} r={3} className={s.svgText} />)}
          </g>
        ))}
        <text x={4} y={H - 4} fontSize={10.5} className={s.svgMuted}>{tx(lang, 'solid: instance held by · dashed red: requests (count)', 'nét liền: bản đang được giữ · nét đứt đỏ: đang xin (số lượng)')}</text>
      </svg>
    </div>
  );
}

function DetectTab({ lang, start }: { lang: Lang; start: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const ex = useMemo(detectExamples, []);
  const [key, setKey] = useState(start);
  const d = ex.find((x) => x.key === key) ?? ex[0];
  const av = availOf(d);
  const res = useMemo(() => safety(d.alloc, d.req, av, true), [d]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = usePlayer(res.steps.length + 1, 900);
  const st = p.i === 0 ? null : res.steps[p.i - 1];
  const cyc = hasCycle(d);
  const endSt = res.steps[res.steps.length - 1] as Extract<SafeStep, { k: 'end' }>;
  useLabBridge('detect', { key, i: p.i, atEnd: p.atEnd, cycle: cyc, stuck: endSt ? endSt.stuck.length : 0 }, {
    example: (x) => { setKey(String(x)); p.reset(); },
  });
  // phép quét chạy tới cuối: có người kẹt ⇒ "bịch", ai cũng xong ⇒ chuông
  useEffect(() => { if (st?.k === 'end') labSfx(st.stuck.length ? 'thud' : 'done'); }, [st]);
  return (
    <>
      <Explain>{t('Detection does not need maximums — only what each process holds now (Allocation) and what it is waiting for now (Request). Same scan as Banker: whoever can be satisfied finishes and returns everything. Whoever is left at the end is DEADLOCKED.', 'Phát hiện không cần mức tối đa — chỉ cần mỗi tiến trình đang giữ gì (Allocation) và đang chờ gì (Request). Quét giống Banker: ai được đáp ứng thì chạy xong và trả hết. Ai còn lại cuối cùng là bị DEADLOCK.')}</Explain>
      <div className={s.bar} data-tour="det-pick">
        <select value={key} onChange={(e) => { setKey(e.target.value); p.reset(); }} style={{ maxWidth: '100%' }}>{ex.map((x) => <option key={x.key} value={x.key}>{t(x.en, x.vi)}</option>)}</select>
      </div>
      <div className={s.grid2} style={{ alignItems: 'start' }}>
        <div className={s.panel} data-tour="det-graph"><div className={s.panelTitle}>{t('Resource-allocation graph', 'Đồ thị cấp phát tài nguyên')}</div><Rag d={d} lang={lang} />
          <div className={s.small}>{t('Cycle in the wait-for graph', 'Có vòng trong đồ thị chờ')}: <b>{cyc ? t('yes', 'có') : t('no', 'không')}</b>. {cyc && res.safe ? t('A cycle with multi-instance resources only means deadlock is POSSIBLE — here another holder can still finish and free an instance.', 'Có vòng với tài nguyên nhiều bản chỉ nghĩa là CÓ THỂ deadlock — ở đây vẫn có người giữ chạy xong và nhả ra một bản.') : ''}</div>
        </div>
        <div>
          <Controls p={p} lang={lang} />
          <Explain tone={st?.k === 'end' ? (st.stuck.length ? 'bad' : 'ok') : undefined}>{narrate(lang, st, d.names, ['Request', 'Request'])}
            {st?.k === 'end' && st.stuck.length > 0 && key === 'pool' && t(' This is the classic pool deadlock: pool.connect() inside a handler that already holds a connection. Fix: pass the client down, or give the inner call a timeout.', ' Đây là deadlock pool kinh điển: gọi pool.connect() trong một handler đang giữ sẵn một kết nối. Sửa: truyền client xuống, hoặc cho lời gọi bên trong một thời hạn.')}
          </Explain>
          <div style={{ marginTop: 8 }} data-tour="det-table">
            <StepTable lang={lang} names={d.names} res={d.res} alloc={d.alloc} mid={null} need={d.req} needLabel="Request" avail={av} step={st} zeroDone />
          </div>
        </div>
      </div>
    </>
  );
}

const MODES: Array<[PMode, string, string, string, string]> = [
  ['naive', 'naive', 'ngây thơ', 'Everyone picks up the LEFT fork, then the right. If all five get hungry together, each holds one fork and waits for the other forever.', 'Ai cũng nhặt đũa TRÁI rồi mới tới đũa phải. Nếu cả năm cùng đói, mỗi người cầm một chiếc và chờ chiếc kia mãi mãi.'],
  ['ordered', 'lock ordering', 'thứ tự khoá', 'Number the forks; always pick up the LOWER number first. Philosopher 4 now reaches for fork 0 first — the circle is broken, no cycle can form.', 'Đánh số đũa; luôn nhặt chiếc SỐ NHỎ trước. Triết gia 4 giờ với đũa 0 trước — vòng tròn bị bẻ gãy, không thể có chu trình.'],
  ['waiter', 'waiter (N−1)', 'người phục vụ (N−1)', 'A waiter (a semaphore with N−1 = 4 permits) lets at most four sit down at once. With four people and five forks, someone always gets two.', 'Người phục vụ (semaphore N−1 = 4 chỗ) chỉ cho tối đa bốn người ngồi. Bốn người với năm chiếc đũa thì luôn có người có đủ hai.'],
  ['trylock', 'trylock + backoff', 'trylock + lùi lại', 'Take the left fork; TRY the right. If it is taken, put the left one down and wait a random moment. No deadlock — but watch the "put down" counter: wasted effort, and with fixed back-off it could livelock.', 'Nhặt đũa trái; THỬ lấy đũa phải. Nếu bị chiếm thì đặt đũa trái xuống và chờ một lúc ngẫu nhiên. Không deadlock — nhưng xem bộ đếm "đặt xuống": công sức phí, và nếu lùi cố định thì có thể livelock.'],
];

function PhiloTab({ lang }: { lang: Lang }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [mode, setMode] = useState<PMode>('naive');
  const [together, setTogether] = useState(true);
  const [seed, setSeed] = useState(3);
  const frames = useMemo(() => {
    const R = rng(seed); let d = initDine(mode, together, R); const out: Dine[] = [d];
    for (let k = 0; k < 300 && !d.deadlock; k++) { d = stepDine(d, R); out.push(d); }
    return out;
  }, [mode, together, seed]);
  const p = usePlayer(frames.length, 450);
  const D = frames[Math.min(p.i, frames.length - 1)];
  const R0 = 105, C = 140;
  const pos = (i: number, r: number) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / D.n; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  const fpos = (f: number, r: number) => { const a = -Math.PI / 2 + (2 * Math.PI * (f + 0.5)) / D.n; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  const ST: Record<string, [string, string, string]> = { think: ['#64748b', 'thinking', 'đang nghĩ'], hungry: ['#d97706', 'hungry', 'đói'], eat: ['#16a34a', 'eating', 'đang ăn'], backoff: ['#7c3aed', 'backing off', 'lùi lại'] };
  const m = MODES.find((x) => x[0] === mode)!;
  useLabBridge('philo', { mode, together, deadlock: !!D.deadlock, t: D.t }, { mode: (x) => { setMode(x as PMode); p.reset(); }, together: (x) => { setTogether(!!x); p.reset(); } });
  useEffect(() => { if (D.deadlock) labSfx('thud'); }, [D.deadlock]);
  return (
    <>
      <div className={s.bar} data-tour="philo-mode">
        <Seg value={mode} options={MODES.map((x) => [x[0], t(x[1], x[2])])} onChange={(v) => { setMode(v); p.reset(); }} />
      </div>
      <div className={s.bar}>
        <Seg label={t('Start', 'Bắt đầu')} value={together ? 'y' : 'n'} options={[['y', t('all hungry at once', 'cùng đói một lúc')], ['n', t('random', 'ngẫu nhiên')]]} onChange={(v) => { setTogether(v === 'y'); p.reset(); }} />
        <button type="button" className={s.btn} onClick={() => { setSeed((x) => x + 1); p.reset(); }}><Dices />#{seed}</button>
      </div>
      <Explain>{t(m[3], m[4])}</Explain>
      <Controls p={p} lang={lang} label={`tick ${D.t}`} />
      <div className={s.grid2} style={{ alignItems: 'center' }}>
        <svg viewBox="0 0 280 280" width="100%" style={{ maxWidth: 320, margin: '0 auto', display: 'block' }} role="img" aria-label="dining philosophers" data-tour="philo-table">
          <circle cx={C} cy={C} r={62} className={s.svgPanel} stroke="var(--ol-border)" strokeWidth={2} />
          <text x={C} y={C + 4} fontSize={12} textAnchor="middle" className={s.svgMuted}>{mode === 'waiter' ? `${t('seated', 'đang ngồi')} ${D.seated}/4` : '🍜'}</text>
          {D.forks.map((o, f) => {
            const [x1, y1] = o >= 0 ? pos(o, 72) : fpos(f, 48), [x2, y2] = o >= 0 ? (() => { const [a, b] = pos(o, 72); const [c, d] = fpos(f, 60); return [(a + c) / 2, (b + d) / 2]; })() : fpos(f, 74);
            return <g key={f}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={o >= 0 ? colorOf(o) : 'var(--ol-muted)'} strokeWidth={5} strokeLinecap="round" /><text x={fpos(f, 36)[0]} y={fpos(f, 36)[1] + 4} fontSize={10} textAnchor="middle" className={s.svgMuted}>{f}</text></g>;
          })}
          {D.ph.map((ph, i) => {
            const [x, y] = pos(i, R0);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={24} fill={ST[ph.st][0]} stroke={colorOf(i)} strokeWidth={4} />
                <text x={x} y={y - 2} fontSize={12} fontWeight={800} textAnchor="middle" fill="#fff">P{i}</text>
                <text x={x} y={y + 11} fontSize={9.5} textAnchor="middle" fill="#fff">{ph.held.length}🥢</text>
              </g>
            );
          })}
        </svg>
        <div className={s.stack} style={{ gap: 6 }}>
          {D.deadlock && <Explain tone="bad"><b>DEADLOCK.</b> {t('Every philosopher holds exactly one fork and waits for the neighbour\'s. Nobody will ever let go: mutual exclusion + hold-and-wait + no preemption + circular wait — all four Coffman conditions.', 'Mỗi triết gia cầm đúng một chiếc đũa và chờ chiếc của người bên cạnh. Không ai chịu buông: loại trừ tương hỗ + giữ-và-chờ + không thu hồi + chờ vòng tròn — đủ bốn điều kiện Coffman.')}</Explain>}
          <table className={cx(s.tbl, s.compact)}>
            <thead><tr><th></th><th>{t('state', 'trạng thái')}</th><th className={s.num}>{t('meals', 'bữa')}</th><th className={s.num}>{t('longest hunger', 'đói lâu nhất')}</th>{mode === 'trylock' && <th className={s.num}>{t('put down', 'đặt xuống')}</th>}</tr></thead>
            <tbody>{D.ph.map((ph, i) => (
              <tr key={i}><td style={{ fontWeight: 800, color: colorOf(i) }}>P{i}</td><td><span style={{ color: ST[ph.st][0], fontWeight: 700 }}>{t(ST[ph.st][1], ST[ph.st][2])}</span></td>
                <td className={s.num}><span style={{ display: 'inline-block', height: 8, width: Math.min(60, ph.meals * 2), background: colorOf(i), borderRadius: 3, marginRight: 4 }} />{ph.meals}</td>
                <td className={s.num}>{ph.maxHungry}</td>{mode === 'trylock' && <td className={s.num}>{ph.drops}</td>}</tr>
            ))}</tbody>
          </table>
          <div className={s.small}>{t('Fair = everyone\'s meal count grows. Starvation = one count stays flat while others grow.', 'Công bằng = số bữa của ai cũng tăng. Bị đói = một người đứng yên trong khi người khác tăng.')}</div>
        </div>
      </div>
    </>
  );
}

function PiTab({ lang }: { lang: Lang }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [inherit, setInherit] = useState(false);
  const [wd, setWd] = useState(false);
  const r = useMemo(() => priorityInversion(inherit, wd ? 125 : null), [inherit, wd]);
  const end = Math.max(...r.segs.map((x) => x.to));
  const p = usePlayer(Math.ceil(end / 10) + 1, 120);
  const now = Math.min(end, p.i * 10);
  const [box, W] = useWidth<HTMLDivElement>(640);
  const L = 30, rowH = 30, X = (ms: number) => L + ((W - L - 10) * ms) / end;
  const rows = ['H', 'M', 'L'], col: Record<string, string> = { H: '#dc2626', M: '#d97706', L: '#2563eb' };
  const hReq = 10;
  return (
    <>
      <Explain>{t('One CPU, real-time priorities (SCHED_FIFO), like ch06/pi.c. L (prio 10) holds the "bus" mutex and needs 50 ms more. At 10 ms H (prio 30) wants the bus and blocks; M (prio 20) arrives with 500 ms of unrelated work. M outranks L — so M runs, L cannot finish, and H (the MOST important task) waits for M, which it outranks. That is priority inversion.', 'Một CPU, ưu tiên thời gian thực (SCHED_FIFO), như ch06/pi.c. L (ưu tiên 10) đang giữ mutex "bus" và cần thêm 50 ms. Lúc 10 ms, H (ưu tiên 30) cần bus và bị chặn; M (ưu tiên 20) đến với 500 ms việc không liên quan. M cao hơn L — nên M chạy, L không xong được, và H (việc QUAN TRỌNG NHẤT) phải chờ M, kẻ thấp hơn nó. Đó là đảo ngược ưu tiên.')}</Explain>
      <div className={s.bar}>
        <Seg label={t('Mutex protocol', 'Kiểu mutex')} value={inherit ? 'y' : 'n'} options={[['n', t('plain', 'thường')], ['y', 'PTHREAD_PRIO_INHERIT']]} onChange={(v) => { setInherit(v === 'y'); p.reset(); }} />
        <label className={s.lbl}><input type="checkbox" checked={wd} onChange={(e) => { setWd(e.target.checked); p.reset(); }} />{t('125 ms watchdog (like Pathfinder)', 'watchdog 125 ms (như Pathfinder)')}</label>
      </div>
      <Controls p={p} lang={lang} label={`${now} ms`} />
      <div className={s.svgWrap} ref={box}>
        <svg width={W} height={rows.length * (rowH + 8) + 34} viewBox={`0 0 ${W} ${rows.length * (rowH + 8) + 34}`} style={{ maxWidth: '100%' }} role="img" aria-label="timeline">
          {rows.map((nm, k) => (
            <g key={nm}>
              <text x={6} y={14 + k * (rowH + 8) + rowH / 2 + 4} fontSize={13} fontWeight={800} fill={col[nm]}>{nm}</text>
              <rect x={L} y={14 + k * (rowH + 8)} width={W - L - 10} height={rowH} className={s.svgPanel} />
              {nm === 'H' && r.hGot > hReq && <rect x={X(hReq)} y={14 + k * (rowH + 8) + rowH / 2 - 3} width={Math.max(0, X(Math.min(now, r.hGot)) - X(hReq))} height={6} fill={col.H} opacity={0.35} />}
              {r.segs.filter((x) => x.task === nm && x.from < now).map((x, j) => (
                <g key={j}>
                  <rect x={X(x.from)} y={14 + k * (rowH + 8)} width={Math.max(1.5, X(Math.min(now, x.to)) - X(x.from))} height={rowH} rx={3} fill={col[nm]} opacity={x.eff !== ({ H: 30, M: 20, L: 10 } as Record<string, number>)[nm] ? 1 : 0.85} />
                  {x.eff === 30 && nm === 'L' && X(Math.min(now, x.to)) - X(x.from) > 40 && <text x={X(x.from) + 4} y={14 + k * (rowH + 8) + 19} fontSize={10.5} fill="#fff" fontWeight={800}>prio 30</text>}
                </g>
              ))}
            </g>
          ))}
          <line x1={X(now)} x2={X(now)} y1={8} y2={rows.length * (rowH + 8) + 14} stroke="var(--ol-text)" strokeWidth={1} strokeDasharray="3 3" />
          {r.watchdogAt !== null && now >= r.watchdogAt && <g><line x1={X(r.watchdogAt)} x2={X(r.watchdogAt)} y1={8} y2={rows.length * (rowH + 8) + 14} stroke="var(--ol-bad)" strokeWidth={3} /><text x={X(r.watchdogAt) + 4} y={rows.length * (rowH + 8) + 28} fontSize={11} fill="var(--ol-bad)" fontWeight={800}>RESET</text></g>}
          {[0, 100, 200, 300, 400, 500].filter((x) => x <= end).map((x) => <text key={x} x={X(x)} y={rows.length * (rowH + 8) + 28} fontSize={10.5} textAnchor="middle" className={s.svgMuted}>{x}</text>)}
        </svg>
      </div>
      <div className={s.kpis} style={{ marginTop: 6 }}>
        <Kpi k={t('H waited for the bus', 'H chờ bus')} v={now >= r.hGot ? `${r.hWait} ms` : `${Math.max(0, now - hReq)} ms…`} tone={r.hWait > 100 ? 'bad' : 'ok'} />
        <Kpi k={t('L at priority', 'L chạy ở ưu tiên')} v={r.segs.some((x) => x.task === 'L' && x.eff === 30 && x.from < now) ? '30 (inherited)' : '10'} />
      </div>
      <ul style={{ fontSize: 12.5, margin: '8px 0 0', paddingLeft: 18 }}>
        {r.events.filter((e) => e.t <= now).map((e, k) => <li key={k} style={{ color: /WATCHDOG/.test(e.en) ? 'var(--ol-bad)' : undefined }}><span className={s.mono}>{e.t} ms</span> — {t(e.en, e.vi)}</li>)}
      </ul>
      <div className={s.small} style={{ marginTop: 6 }}>{t('Mars Pathfinder, July 1997: a low-priority meteorological task held the information-bus mutex, medium-priority communication tasks preempted it, the high-priority bus manager missed its deadline and a watchdog reset the whole computer — several times. JPL fixed it from Earth by turning on priority inheritance in VxWorks for that mutex.', 'Mars Pathfinder, tháng 7/1997: một tác vụ khí tượng ưu tiên thấp giữ mutex của bus thông tin, các tác vụ liên lạc ưu tiên vừa chen ngang nó, tác vụ quản lý bus ưu tiên cao trễ hạn và watchdog khởi động lại cả máy — nhiều lần. JPL sửa từ Trái Đất bằng cách bật kế thừa ưu tiên trong VxWorks cho đúng mutex đó.')}</div>
    </>
  );
}
