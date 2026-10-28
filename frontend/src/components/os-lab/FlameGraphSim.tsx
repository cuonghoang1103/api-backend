'use client';
/**
 * Đọc flame graph (bài 15.2–15.4): 8 flame graph THẬT của Chương 15 dựng lại tương tác — rê/chạm để xem SELF và TOTAL,
 * bấm để phóng một nhánh, tìm tên (tô hồng + tổng %), lật icicle, on-CPU vs off-CPU, differential trước/sau, và câu đố
 * "hàm nóng nhất là gì?" khi JIT đã inline nó. Engine: engine/flame.ts (khớp folded.py — c152, c153, c154).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { ancestry, byName, flame, frameColor, INLINE_TRAP, search, type Flame, type FNode } from './engine/flame';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { useWidth } from './charts';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab3.module.css';

type GKey = 'hot' | 'hot-fixed' | 'hot-diff' | 'wait-on' | 'wait-off' | 'node' | 'java' | 'python';
const GRAPH_LABEL: Record<GKey, [string, string]> = {
  hot: ['hot.c before', 'hot.c trước'], 'hot-fixed': ['hot.c after', 'hot.c sau'], 'hot-diff': ['diff before → after', 'diff trước → sau'],
  'wait-on': ['wait.c on-CPU', 'wait.c on-CPU'], 'wait-off': ['wait.c off-CPU', 'wait.c off-CPU'], node: ['Node orders.js', 'Node orders.js'], java: ['Java Orders', 'Java Orders'], python: ['Python orders.py', 'Python orders.py'],
};
interface GStep { graph: GKey; select?: string | ((F: Flame) => string); search?: string; en: string | ((F: Flame) => string); vi: string | ((F: Flame) => string); tone?: 'ok' | 'bad' | 'warn' }
const top = (F: Flame) => byName(F).self[0]?.name ?? 'all';
const pctOf = (F: Flame, name: string, kind: 'self' | 'total') => (byName(F)[kind].find((x) => x.name === name)?.pct ?? 0).toFixed(1);
const SCRIPTS: Record<string, GStep[]> = {
  hot: [
    { graph: 'hot', en: 'A real flame graph: hot.c under perf at 999 Hz, 915 samples. Each box is a function; its WIDTH = how many samples had it on the stack. The x axis is NOT time — boxes are sorted alphabetically.', vi: 'Một flame graph thật: hot.c dưới perf ở 999 Hz, 915 mẫu. Mỗi hộp là một hàm; BỀ RỘNG = bao nhiêu mẫu có nó trên ngăn xếp. Trục x KHÔNG phải thời gian — các hộp xếp theo ABC.' },
    { graph: 'hot', select: 'handle', en: 'Read bottom-up: _start → __libc_start_main → main → handle. handle is 100 % TOTAL — every sample passed through it — but that alone says nothing about where the time goes.', vi: 'Đọc từ dưới lên: _start → __libc_start_main → main → handle. handle có TOTAL 100 % — mẫu nào cũng đi qua nó — nhưng chỉ vậy thì chưa nói thời gian đi đâu.' },
    { graph: 'hot', select: 'crc_bitwise', tone: 'bad', en: (F) => `The widest box with nothing on top: crc_bitwise — ${pctOf(F, 'crc_bitwise', 'self')} % SELF. Self = the CPU was executing ITS instructions. This is the function to fix.`, vi: (F) => `Hộp rộng nhất mà trên đỉnh không còn gì: crc_bitwise — SELF ${pctOf(F, 'crc_bitwise', 'self')} %. Self = CPU đang chạy lệnh CỦA CHÍNH NÓ. Đây là hàm cần sửa.` },
    { graph: 'hot', select: 'render_json', en: (F) => `render_json: TOTAL ${pctOf(F, 'render_json', 'total')} % but SELF ≈ 0 — all of it is sprintf below. Optimising a function with zero self time cannot help much.`, vi: (F) => `render_json: TOTAL ${pctOf(F, 'render_json', 'total')} % nhưng SELF ≈ 0 — toàn bộ là sprintf bên dưới. Tối ưu một hàm có self bằng 0 thì chẳng được bao nhiêu.` },
    { graph: 'hot-fixed', select: 'crc_table', tone: 'ok', en: (F) => `After switching to a lookup table: ${F.total} samples instead of 915 (310 ms vs 916 ms). crc_table is still the top at ${pctOf(F, 'crc_table', 'self')} % — and render_json grew to ${pctOf(F, 'render_json', 'total')} % only because the total shrank.`, vi: (F) => `Sau khi đổi sang bảng tra: ${F.total} mẫu thay vì 915 (310 ms so với 916 ms). crc_table vẫn đứng đầu với ${pctOf(F, 'crc_table', 'self')} % — còn render_json lên ${pctOf(F, 'render_json', 'total')} % chỉ vì tổng nhỏ lại.` },
  ],
  diff: [
    { graph: 'hot-diff', en: 'Differential flame graph (difffolded.pl -n): widths are the AFTER profile, colour is the change — red = more samples than before, blue = fewer, grey = same.', vi: 'Flame graph khác biệt (difffolded.pl -n): bề rộng theo bản SAU, màu là chênh lệch — đỏ = nhiều mẫu hơn trước, xanh = ít hơn, xám = như cũ.' },
    { graph: 'hot-diff', select: 'crc_table', tone: 'warn', en: (F) => `crc_table is deep red (+${F.nodes.find((n) => n.name === 'crc_table')?.delta.toFixed(1)} %) — it looks like a regression! It is the NEW function that replaced crc_bitwise; crc_bitwise does not exist in the after-profile, so there is no blue box for it. Trap: a renamed function is always all red.`, vi: (F) => `crc_table đỏ đậm (+${F.nodes.find((n) => n.name === 'crc_table')?.delta.toFixed(1)} %) — trông như chậm đi! Thật ra nó là hàm MỚI thay crc_bitwise; crc_bitwise không có trong bản sau nên không có hộp xanh nào cho nó. Bẫy: hàm đổi tên luôn hiện toàn đỏ.` },
    { graph: 'hot-diff', select: 'render_json', en: 'render_json is red too, yet its code did not change. Normalised (-n) shares rise when the total falls. Always read the absolute numbers: 916 ms → 310 ms.', vi: 'render_json cũng đỏ, dù mã của nó không đổi. Tỉ lệ chuẩn hoá (-n) tăng khi tổng giảm. Luôn đọc con số tuyệt đối: 916 ms → 310 ms.' },
  ],
  offcpu: [
    { graph: 'wait-on', select: 'price_order', en: (F) => `wait.c on-CPU (profile, 499 Hz): price_order ${pctOf(F, 'price_order', 'self')} %. So… make price_order faster? Look at the clock first: wall 1 621 ms, CPU only 626 ms — 0.39 cores busy out of 8 threads.`, vi: (F) => `wait.c on-CPU (profile, 499 Hz): price_order ${pctOf(F, 'price_order', 'self')} %. Vậy… làm price_order nhanh hơn? Nhìn đồng hồ trước: wall 1 621 ms, CPU chỉ 626 ms — 8 luồng mà chỉ bận 0,39 lõi.` },
    { graph: 'wait-off', en: 'Off-CPU flame graph (offcputime, unit = microseconds): where the threads were NOT running, and the kernel stack that put them to sleep.', vi: 'Flame graph off-CPU (offcputime, đơn vị = micro giây): các luồng KHÔNG chạy ở đâu, và ngăn xếp nhân đã cho chúng ngủ.' },
    { graph: 'wait-off', select: 'futex_do_wait', tone: 'bad', en: (F) => `futex_do_wait ${pctOf(F, 'futex_do_wait', 'self')} %: threads queued on a mutex. do_nanosleep ${pctOf(F, 'do_nanosleep', 'self')} %: the usleep inside write_audit — done WHILE holding that mutex. Moving the audit outside the lock: 1 621 ms → 250 ms.`, vi: (F) => `futex_do_wait ${pctOf(F, 'futex_do_wait', 'self')} %: các luồng xếp hàng chờ mutex. do_nanosleep ${pctOf(F, 'do_nanosleep', 'self')} %: lệnh usleep trong write_audit — chạy TRONG LÚC giữ mutex đó. Đưa audit ra ngoài khoá: 1 621 ms → 250 ms.` },
  ],
  inline: [
    { graph: 'node', select: 'Builtins_ArrayIncludesSmiOrObject', en: (F) => `Node orders.js under load (perf + --perf-basic-prof, ${F.total} samples). Top of the widest tower: Builtins_ArrayIncludesSmiOrObject, ${pctOf(F, 'Builtins_ArrayIncludesSmiOrObject', 'self')} % SELF — V8's built-in for Array.prototype.includes.`, vi: (F) => `Node orders.js dưới tải (perf + --perf-basic-prof, ${F.total} mẫu). Đỉnh của tháp rộng nhất: Builtins_ArrayIncludesSmiOrObject, SELF ${pctOf(F, 'Builtins_ArrayIncludesSmiOrObject', 'self')} % — hàm dựng sẵn của V8 cho Array.prototype.includes.` },
    { graph: 'node', select: 'JS:^report /tmp/orders.js:22:16', en: (F) => `Right below it: JS:^report, ${pctOf(F, 'JS:^report /tmp/orders.js:22:16', 'total')} % TOTAL. "^" = baseline-compiled (Sparkplug), "*" = optimised (TurboFan), "~" = interpreted.`, vi: (F) => `Ngay bên dưới: JS:^report, TOTAL ${pctOf(F, 'JS:^report /tmp/orders.js:22:16', 'total')} %. "^" = biên dịch baseline (Sparkplug), "*" = tối ưu (TurboFan), "~" = thông dịch.` },
    { graph: 'node', search: 'uniqueCustomers', tone: 'warn', en: (F) => `Search "uniqueCustomers": ${search(F, 'uniqueCustomers').pct.toFixed(1)} %. Almost invisible — yet report never calls includes itself. Which function is really hot? Answer the quiz.`, vi: (F) => `Tìm "uniqueCustomers": ${search(F, 'uniqueCustomers').pct.toFixed(1)} %. Gần như vô hình — trong khi report không hề tự gọi includes. Hàm nào mới thật sự nóng? Trả lời câu đố.` },
  ],
  java: [
    { graph: 'java', en: (F) => `Orders.java under async-profiler -e cpu: ${F.total} samples, ${F.nodes.length} frames — JIT compiler, GC and JFR threads included. Zoom in by clicking a box.`, vi: (F) => `Orders.java dưới async-profiler -e cpu: ${F.total} mẫu, ${F.nodes.length} khung — gồm cả luồng JIT, GC và JFR. Bấm một hộp để phóng to.` },
    { graph: 'java', select: top, tone: 'bad', en: (F) => `Hottest SELF: ${top(F)} — ${byName(F).self[0].pct.toFixed(1)} %.`, vi: (F) => `SELF nóng nhất: ${top(F)} — ${byName(F).self[0].pct.toFixed(1)} %.` },
  ],
  python: [
    { graph: 'python', en: 'orders.py under py-spy: Python frames are "function (file:line)" — py-spy reads the interpreter\'s own stack, no perf map needed.', vi: 'orders.py dưới py-spy: khung Python có dạng "hàm (tệp:dòng)" — py-spy đọc ngăn xếp của chính trình thông dịch, không cần perf map.' },
    { graph: 'python', select: (F) => byName(F).total.find((x) => x.name.startsWith('report'))?.name ?? 'all', tone: 'bad', en: (F) => `report (orders.py:29): ${(byName(F).total.find((x) => x.name.startsWith('report'))?.pct ?? 0).toFixed(1)} % TOTAL — the same list-membership bug as the Node and Java versions.`, vi: (F) => `report (orders.py:29): TOTAL ${(byName(F).total.find((x) => x.name.startsWith('report'))?.pct ?? 0).toFixed(1)} % — cùng lỗi tìm-trong-danh-sách như bản Node và Java.` },
  ],
};
const PRESETS = Object.keys(SCRIPTS);
const QUIZ: Array<[string, [string, string]]> = [
  ['includes', ['Builtins_ArrayIncludesSmiOrObject', 'Builtins_ArrayIncludesSmiOrObject']],
  ['report', ['report', 'report']],
  ['unique', ['uniqueCustomers — inlined into report', 'uniqueCustomers — đã bị inline vào report']],
  ['emit', ['emit (the HTTP event)', 'emit (sự kiện HTTP)']],
];

export default function FlameGraphSim({ lang = 'vi', preset = 'hot' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const pre = PRESETS.includes(preset) ? preset : 'hot';
  const [script, setScript] = useState(pre);
  const steps = SCRIPTS[script];
  const [graph, setGraph] = useState<GKey>(steps[0].graph);
  const F = useMemo(() => flame(graph), [graph]);
  const [sel, setSel] = useState<number>(-1);
  const [zoom, setZoom] = useState<number>(0);
  const [hover, setHover] = useState<number>(-1);
  const [q, setQ] = useState('');
  const [icicle, setIcicle] = useState(false);
  const [quiz, setQuiz] = useState<string | null>(null);
  const p = usePlayer(steps.length, 2600);
  const i = Math.min(p.i, steps.length - 1);
  const st = steps[i];
  useOwnStepSound();

  const findNode = (G: Flame, name: string) => G.nodes.filter((n) => n.name === name).sort((a, b) => b.n - a.n)[0];
  // bước dẫn đọc ⇒ đổi đồ thị, chọn khung, tìm
  const prev = useRef(-1);
  useEffect(() => {
    if (prev.current === p.i) return;
    const G = flame(st.graph);
    setGraph(st.graph); setZoom(0);
    const name = typeof st.select === 'function' ? st.select(G) : st.select;
    const nd = name ? findNode(G, name) : undefined;
    setSel(nd ? nd.id : -1);
    setQ(st.search ?? '');
    if (prev.current !== -1) labSfx(st.tone === 'bad' ? 'oops' : st.tone === 'ok' ? 'hit' : 'blip-exec');
    prev.current = p.i;
  }, [p.i, script]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { prev.current = -1; p.reset(); setQuiz(null); }, [script]); // eslint-disable-line react-hooks/exhaustive-deps

  const [box, W] = useWidth<HTMLDivElement>(640);
  const scroller = useRef<HTMLDivElement>(null);
  const maxDepth = Math.max(...F.nodes.map((n) => n.depth));
  const rowH = 17;
  const H = (maxDepth + 1) * rowH + 4;
  useEffect(() => { const el = scroller.current; if (el) el.scrollTop = icicle ? 0 : el.scrollHeight; }, [graph, icicle]);
  const Z = F.nodes[zoom] ?? F.nodes[0];
  const anc = new Set(ancestry(F, Z.id).map((n) => n.id));
  const inZoom = (n: FNode) => anc.has(n.id) || (n.start >= Z.start && n.start + n.n <= Z.start + Z.n && n.depth >= Z.depth);
  const X = (v: number) => ((v - Z.start) / Math.max(1e-9, Z.n)) * W;
  const S = useMemo(() => search(F, q), [F, q]);
  const ranks = useMemo(() => byName(F), [F]);
  const info = F.nodes[hover >= 0 ? hover : sel];
  const unit = F.unit === 'us' ? 'µs' : t('samples', 'mẫu');
  const fmt = (v: number) => v.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US');
  const offCpu = graph === 'wait-off';

  const pick = (nd: FNode | undefined, zoomIt = true) => { if (!nd) return; setSel(nd.id); if (zoomIt) setZoom(nd.kids.length ? nd.id : (nd.parent >= 0 ? nd.parent : 0)); labSfx('pop'); };
  useLabBridge('fg', {
    script, graph, i: p.i, atEnd: p.atEnd, sel: F.nodes[sel]?.name ?? '', zoom: Z.name, q, matched: +S.pct.toFixed(1), icicle, quiz: quiz ?? '', quizOk: quiz === 'unique',
  }, {
    script: (v) => { setScript(String(v)); labSfx('tap'); }, graph: (v) => { setGraph(v as GKey); setZoom(0); setSel(-1); labSfx('tap'); },
    select: (v) => pick(findNode(F, String(v)), false), zoom: (v) => { const nd = String(v) === 'all' ? F.nodes[0] : findNode(F, String(v)); if (nd) setZoom(nd.id); labSfx('pop'); },
    search: (v) => setQ(String(v)), icicle: (v) => setIcicle(!!v), answer: (v) => { setQuiz(String(v)); labSfx(String(v) === 'unique' ? 'right' : 'wrong'); },
  });

  const txt = (x: GStep['en']) => (typeof x === 'function' ? x(flame(st.graph)) : x);
  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Reading a flame graph', 'Đọc flame graph')}
      sub={t('Eight real profiles from Chapter 15: self vs total, on- vs off-CPU, before/after, and the inlining trap', 'Tám hồ sơ thật của Chương 15: self vs total, on- vs off-CPU, trước/sau, và cái bẫy inline')}>
      <div className={s.bar} data-tour="fg-script">
        <Seg value={script} options={[['hot', t('self vs total', 'self vs total')], ['diff', t('before/after diff', 'diff trước/sau')], ['offcpu', 'on/off-CPU'], ['inline', t('inlining trap', 'bẫy inline')], ['java', 'Java'], ['python', 'Python']]} onChange={(v) => { setScript(v); labSfx('tap'); }} />
      </div>
      <div className={s.bar} data-tour="fg-tools">
        <span className={s.lbl}>{t('profile', 'hồ sơ')}
          <select value={graph} onChange={(e) => { setGraph(e.target.value as GKey); setZoom(0); setSel(-1); labSfx('tap'); }}>
            {(Object.keys(GRAPH_LABEL) as GKey[]).map((k) => <option key={k} value={k}>{t(GRAPH_LABEL[k][0], GRAPH_LABEL[k][1])}</option>)}
          </select>
        </span>
        <span className={s.lbl}>🔍 <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search a name', 'tìm tên hàm')} style={{ width: 150 }} aria-label={t('search', 'tìm')} /></span>
        {q && <span className={s.small}>{t('matched', 'khớp')} <b>{S.pct.toFixed(1)} %</b></span>}
        <Seg value={icicle ? 'icicle' : 'flame'} options={[['flame', t('flame ▲', 'flame ▲')], ['icicle', t('icicle ▼', 'icicle ▼')]]} onChange={(v) => setIcicle(v === 'icicle')} />
      </div>
      <Controls p={p} lang={lang} />
      <Explain tone={st.tone}>{txt(lang === 'vi' ? st.vi : st.en)}</Explain>

      <div className={s.panel} style={{ marginTop: 10 }} data-tour="fg-graph">
        <div className={s.panelTitle} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ flex: 1, minWidth: 0 }}>{F.title} — {fmt(F.total)} {unit}{F.diff ? t(' · red = more, blue = fewer', ' · đỏ = nhiều hơn, xanh = ít hơn') : ''}</span>
        </div>
        {zoom !== 0 && <div className={c.fgCrumbs} style={{ marginBottom: 6 }}>{ancestry(F, Z.id).map((n) => <button type="button" key={n.id} onClick={() => setZoom(n.id)} title={n.name}>{n.name}</button>)}</div>}
        <div ref={box} style={{ minWidth: 0 }}>
          <div className={c.fgBox} ref={scroller}>
            <svg className={c.fgSvg} viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={t('flame graph', 'flame graph')}>
              {F.nodes.map((n) => {
                if (!inZoom(n)) return null;
                const isAnc = anc.has(n.id) && n.id !== Z.id;
                const x0 = isAnc ? 0 : X(n.start), w = isAnc ? W : X(n.start + n.n) - X(n.start);
                if (w < 0.6) return null;
                const y = icicle ? n.depth * rowH : (maxDepth - n.depth) * rowH;
                const hit = S.ids.has(n.id);
                const chars = Math.floor((w - 6) / 6.6);
                return (
                  <g key={n.id} className={cx(c.fgFrame, sel === n.id && c.fgSel)} onClick={() => pick(n)} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(-1)}>
                    <rect x={x0} y={y + 1} width={Math.max(0.6, w - 0.4)} height={rowH - 1.5} rx={2} fill={hit ? '#e040fb' : frameColor(F, n, offCpu)} opacity={isAnc ? 0.55 : 1} />
                    {chars >= 3 && <text x={x0 + 3} y={y + 12.5} className={c.fgText}>{n.name.length > chars ? n.name.slice(0, chars - 1) + '…' : n.name}</text>}
                    <title>{`${n.name} (${fmt(n.n)} ${unit}, ${((100 * n.n) / F.total).toFixed(2)}%)`}</title>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className={c.cols} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="fg-info">
            <div className={s.panelTitle}>{t('Selected box', 'Hộp đang chọn')}</div>
            {info && info.name !== 'all' ? <>
              <div className={s.mono} style={{ overflowWrap: 'anywhere', fontWeight: 800 }}>{info.name}</div>
              <div className={s.kpis} style={{ marginTop: 6 }}>
                <Kpi k="TOTAL" v={`${((100 * info.n) / F.total).toFixed(1)} %`} />
                <Kpi k="SELF" v={`${((100 * info.self) / F.total).toFixed(1)} %`} tone={info.self / F.total > 0.3 ? 'bad' : undefined} />
                {F.diff && <Kpi k={t('change', 'chênh')} v={`${info.delta > 0 ? '+' : ''}${info.delta.toFixed(2)} %`} tone={info.delta > 0 ? 'bad' : info.delta < 0 ? 'ok' : undefined} />}
              </div>
              <div className={s.small} style={{ marginTop: 4 }}>{fmt(info.n)} {unit} {t('on the stack', 'có mặt trên ngăn xếp')} · {fmt(info.self)} {t('at the very top', 'ở chính đỉnh')} · {t('depth', 'độ sâu')} {info.depth}</div>
            </> : <span className={s.empty}>{t('Tap or hover a box.', 'Chạm hoặc rê chuột lên một hộp.')}</span>}
          </div>
          {script === 'inline' && (
            <div className={s.panel} data-tour="fg-quiz">
              <div className={s.panelTitle}>{t('Quiz: which JavaScript function should you fix?', 'Câu đố: nên sửa hàm JavaScript nào?')}</div>
              <div className={s.bar}>{QUIZ.map(([k, l]) => <button type="button" key={k} className={cx(s.btn, quiz === k && (k === 'unique' ? s.on : s.danger))} onClick={() => { setQuiz(k); labSfx(k === 'unique' ? 'right' : 'wrong'); }}>{t(l[0], l[1])}</button>)}</div>
              {quiz && <div className={s.small}>
                {quiz === 'unique' ? t('Right. ', 'Đúng. ') : t('Not quite. ', 'Chưa đúng. ')}
                {t(`Node's own profiler (--cpu-prof, c154) tells the truth line by line: ${INLINE_TRAP.hotLine[0]} = ${INLINE_TRAP.hotLine[1]} % of ticks — "${INLINE_TRAP.hotLine[2]}". uniqueCustomers shows only ${INLINE_TRAP.cpuprofSelf[3][2]} % self because the JIT inlined it into report (${INLINE_TRAP.cpuprofSelf[0][2]} %). Fix: a Set instead of array.includes ⇒ ${INLINE_TRAP.fixed.before.rps} → ${INLINE_TRAP.fixed.after.rps} req/s, p99 ${INLINE_TRAP.fixed.before.p99} → ${INLINE_TRAP.fixed.after.p99} ms.`, `Profiler của chính Node (--cpu-prof, c154) nói thật theo từng dòng: ${INLINE_TRAP.hotLine[0]} = ${INLINE_TRAP.hotLine[1]} % tick — "${INLINE_TRAP.hotLine[2]}". uniqueCustomers chỉ có ${INLINE_TRAP.cpuprofSelf[3][2]} % self vì JIT đã inline nó vào report (${INLINE_TRAP.cpuprofSelf[0][2]} %). Sửa: dùng Set thay vì array.includes ⇒ ${INLINE_TRAP.fixed.before.rps} → ${INLINE_TRAP.fixed.after.rps} req/s, p99 ${INLINE_TRAP.fixed.before.p99} → ${INLINE_TRAP.fixed.after.p99} ms.`)}
              </div>}
            </div>
          )}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="fg-rank">
            <div className={s.panelTitle}>SELF ({t('top of the stack', 'ở đỉnh ngăn xếp')}) — folded.py</div>
            <div className={c.rank}>{ranks.self.slice(0, 5).flatMap((x, k) => [<span key={`a${k}`} className={cx(k === 0 && c.rankHot)} title={x.name} onClick={() => pick(findNode(F, x.name), false)} style={{ cursor: 'pointer' }}>{x.name}</span>, <span key={`b${k}`}>{x.pct.toFixed(1)} %</span>])}</div>
            <div className={s.panelTitle} style={{ marginTop: 8 }}>TOTAL ({t('anywhere in the stack', 'ở bất kỳ đâu trên ngăn xếp')})</div>
            <div className={c.rank}>{ranks.total.filter((x) => x.pct < 99.99).slice(0, 5).flatMap((x, k) => [<span key={`a${k}`} title={x.name} onClick={() => pick(findNode(F, x.name), false)} style={{ cursor: 'pointer' }}>{x.name}</span>, <span key={`b${k}`}>{x.pct.toFixed(1)} %</span>])}</div>
          </div>
          <WhereBox focus="profiler" lang={lang} height={170} />
        </div>
      </div>
    </Frame>
  );
}
