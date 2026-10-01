'use client';

/**
 * Sơ đồ luồng liên kết bộ phận — ai chuyển gì cho ai.
 *
 * 15 nút (14 bộ phận + khách hàng) xếp lưới 5×3 theo thứ tự vòng đời; vẽ mũi
 * tên CHỈ cho bộ phận đang chọn (đi ra: liền, màu nhấn; đi vào: nét đứt) —
 * vẽ hết ~50 mũi tên cùng lúc thì thành mớ bòng bong không ai đọc được.
 * Bấm nút để chọn; khung chi tiết bên cạnh liệt kê đúng những chuyển giao đó.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DEPT_NAMES, STAGES, pick, stageHref, type Bi, type DeptKey, type RaciRole } from '../data';
import { DEPARTMENTS, deptByKey, raciOverview } from '../departments';
import { T } from '@/components/studio/StudioUI';

/** Lưới theo vòng đời: hàng 1 thương mại/quản trị, hàng 2 phân tích–xây dựng, hàng 3 kiểm chứng–vận hành. */
const GRID: DeptKey[][] = [
  ['client', 'sales', 'legal', 'pmo', 'pm'],
  ['ba', 'ux', 'arch', 'data', 'dev'],
  ['qa', 'sec', 'devops', 'infra', 'support'],
];

const VW = 1000;
const VH = 430;
const NW = 168;
const NH = 58;
const COLX = (c: number) => 20 + c * ((VW - 40 - NW) / 4);
const ROWY = (r: number) => 20 + r * ((VH - 40 - NH) / 2);

const ROLE_LABEL: Record<RaciRole, Bi> = {
  R: ['làm', 'does'],
  A: ['duyệt', 'owns'],
  C: ['tham vấn', 'consulted'],
  I: ['được báo', 'informed'],
};

export default function OrgFlow({ lang }: { lang: 'vi' | 'en' }) {
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const p = (b: Bi) => pick(b, lang);
  const reduced = !!useReducedMotion();
  const [sel, setSel] = useState<DeptKey>('sales');
  const [hover, setHover] = useState<string | null>(null);

  const pos = useMemo(() => {
    const m = new Map<DeptKey, { x: number; y: number }>();
    GRID.forEach((row, r) => row.forEach((k, c) => m.set(k, { x: COLX(c), y: ROWY(r) })));
    // Bộ phận nào ngoài lưới (nếu data thêm mới) — xếp tiếp hàng cuối.
    let extra = 0;
    for (const d of DEPARTMENTS) if (!m.has(d.key)) m.set(d.key, { x: COLX(extra++ % 5), y: ROWY(2) + NH + 20 });
    return m;
  }, []);

  const dept = deptByKey(sel);
  const incoming = useMemo(
    () => DEPARTMENTS.flatMap((d) => d.handoffs.filter((h) => h.to === sel).map((h) => ({ from: d.key, what: h.what }))),
    [sel],
  );
  const involvement = useMemo(
    () =>
      raciOverview()
        .map((r) => ({ n: r.n, slug: r.slug, role: r.cells[sel] }))
        .filter((r): r is { n: number; slug: string; role: RaciRole } => !!r.role),
    [sel],
  );

  const edges = [
    ...dept.handoffs.map((h, i) => ({ id: `o${i}`, from: sel, to: h.to, out: true })),
    ...incoming.map((h, i) => ({ id: `i${i}`, from: h.from, to: sel, out: false })),
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10 items-start">
      {/* Sơ đồ */}
      <div className="min-w-0">
        <div className="overflow-x-auto rounded-xl border border-[color:var(--s-line)] bg-[var(--s-raise)]">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="block w-full min-w-[720px] h-auto"
            role="group"
            aria-label={L('Sơ đồ luồng chuyển giao giữa các bộ phận', 'Hand-off map between functions')}
          >
            <defs>
              <marker id="org-arrow-out" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--s-accent)" />
              </marker>
              <marker id="org-arrow-in" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--s-ink-2)" />
              </marker>
            </defs>

            {/* Mũi tên */}
            {edges.map((e) => {
              const a = pos.get(e.from);
              const b = pos.get(e.to);
              if (!a || !b) return null;
              const d = curve(a, b, e.out ? 1 : -1);
              const hot = hover === e.id;
              return (
                <motion.path
                  key={`${sel}-${e.id}`}
                  d={d}
                  fill="none"
                  stroke={e.out ? 'var(--s-accent)' : 'var(--s-ink-2)'}
                  strokeWidth={hot ? 3 : 1.75}
                  strokeDasharray={e.out ? undefined : '6 5'}
                  markerEnd={`url(#org-arrow-${e.out ? 'out' : 'in'})`}
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: hover && !hot ? 0.25 : 1 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: 'easeOut' }}
                />
              );
            })}

            {/* Nút */}
            {DEPARTMENTS.map((d) => {
              const pt = pos.get(d.key)!;
              const on = d.key === sel;
              const linked = edges.some((e) => e.from === d.key || e.to === d.key);
              return (
                <g
                  key={d.key}
                  transform={`translate(${pt.x} ${pt.y})`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={p(d.name)}
                  onClick={() => setSel(d.key)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault();
                      setSel(d.key);
                    }
                  }}
                  className="cursor-pointer focus:outline-none [&:focus-visible>rect]:stroke-[var(--s-focus)] [&:focus-visible>rect]:[stroke-width:3]"
                  opacity={on || linked ? 1 : 0.55}
                >
                  <rect
                    width={NW}
                    height={NH}
                    rx={9}
                    fill={on ? 'var(--s-ink)' : 'var(--s-raise)'}
                    stroke={on ? 'var(--s-ink)' : d.external ? 'var(--s-accent)' : 'var(--s-line-strong)'}
                    strokeWidth={on ? 1.5 : 1.25}
                    strokeDasharray={d.external && !on ? '5 4' : undefined}
                  />
                  <foreignObject x={8} y={6} width={NW - 16} height={NH - 12}>
                    <div
                      className="h-full flex items-center justify-center text-center text-[12.5px] leading-[1.2] font-semibold"
                      style={{ color: on ? 'var(--s-on-ink)' : 'var(--s-ink)' }}
                    >
                      {p(DEPT_NAMES[d.key])}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
        <p className={`${T.small} mt-3 flex flex-wrap gap-x-5 gap-y-1`}>
          <span className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[var(--s-accent)]" aria-hidden /> {L('chuyển đi', 'hands off')}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-6 border-t-2 border-dashed border-[color:var(--s-ink-2)]" aria-hidden /> {L('nhận vào', 'receives')}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-3 rounded-sm border border-dashed border-[color:var(--s-accent)]" aria-hidden /> {L('bên ngoài (khách hàng)', 'external (client)')}
          </span>
          <span>{L('Bấm một bộ phận để xem luồng của nó.', 'Click a function to see its flow.')}</span>
        </p>
      </div>

      {/* Chi tiết bộ phận */}
      <motion.section
        key={sel}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`${T.card} p-6 min-w-0`}
        aria-live="polite"
      >
        <h3 className="font-editorial text-[1.6rem] leading-tight text-[color:var(--s-ink)]">{p(dept.name)}</h3>
        <p className={`${T.body} mt-2`}>{p(dept.mission)}</p>

        <Block title={L('Chuyển cho', 'Hands off to')}>
          {dept.handoffs.length ? (
            <ul className="space-y-2">
              {dept.handoffs.map((h, i) => (
                <li
                  key={i}
                  onMouseEnter={() => setHover(`o${i}`)}
                  onMouseLeave={() => setHover(null)}
                  className="text-[0.875rem] leading-snug"
                >
                  <button type="button" onClick={() => setSel(h.to)} className="font-semibold text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                    {p(DEPT_NAMES[h.to])}
                  </button>
                  <span className="text-[color:var(--s-body)]">: {p(h.what)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={T.small}>{L('Không có chuyển giao đi.', 'No outgoing hand-offs.')}</p>
          )}
        </Block>

        <Block title={L('Nhận từ', 'Receives from')}>
          {incoming.length ? (
            <ul className="space-y-2">
              {incoming.map((h, i) => (
                <li
                  key={i}
                  onMouseEnter={() => setHover(`i${i}`)}
                  onMouseLeave={() => setHover(null)}
                  className="text-[0.875rem] leading-snug"
                >
                  <button type="button" onClick={() => setSel(h.from)} className="font-semibold text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                    {p(DEPT_NAMES[h.from])}
                  </button>
                  <span className="text-[color:var(--s-body)]">: {p(h.what)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={T.small}>{L('Không có chuyển giao vào.', 'No incoming hand-offs.')}</p>
          )}
        </Block>

        <details className="mt-5 border-t border-[color:var(--s-line)] pt-4 group">
          <summary className="cursor-pointer text-sm font-semibold text-[color:var(--s-ink)] list-none [&::-webkit-details-marker]:hidden flex items-center gap-2">
            <span className="text-[color:var(--s-accent)] transition-transform group-open:rotate-90">›</span>
            {L('Trách nhiệm, đầu ra, kỹ năng', 'Responsibilities, outputs, skills')}
          </summary>
          <SubList title={L('Trách nhiệm', 'Responsibilities')} items={dept.responsibilities.map(p)} />
          <SubList title={L('Đầu ra', 'Outputs')} items={dept.outputs.map(p)} />
          <SubList title={L('Kỹ năng', 'Skills')} items={dept.skills.map(p)} />
          {dept.learn.length > 0 && (
            <div className="mt-4">
              <p className="text-[0.8rem] font-semibold text-[color:var(--s-ink)]">{L('Học ở đâu', 'Where to learn')}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {dept.learn.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-block px-2 py-1 rounded border border-[color:var(--s-line)] text-[0.78rem] text-[color:var(--s-ink)] hover:border-[color:var(--s-ink)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </details>

        {involvement.length > 0 && (
          <Block title={L(`Tham gia ${involvement.length}/${STAGES.length} giai đoạn`, `Involved in ${involvement.length}/${STAGES.length} stages`)}>
            <ul className="flex flex-wrap gap-1.5">
              {involvement.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={stageHref(STAGES[r.n])}
                    title={`${pick(STAGES[r.n].title, lang)} — ${p(ROLE_LABEL[r.role])}`}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[color:var(--s-line-strong)] text-[0.75rem] tabular-nums text-[color:var(--s-ink)] hover:border-[color:var(--s-ink)]"
                  >
                    {String(r.n).padStart(2, '0')}
                    <span className="font-semibold text-[color:var(--s-accent)]">{r.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Block>
        )}
      </motion.section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-[color:var(--s-line)] pt-4">
      <p className="text-[0.8rem] font-semibold text-[color:var(--s-muted)] mb-2.5">{title}</p>
      {children}
    </div>
  );
}

function SubList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4">
      <p className="text-[0.8rem] font-semibold text-[color:var(--s-ink)]">{title}</p>
      <ul className="mt-1.5 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-[0.85rem] leading-relaxed text-[color:var(--s-body)]">
            <span aria-hidden className="mt-[0.55rem] w-1 h-1 shrink-0 rounded-full bg-[var(--s-ink-2)]" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Đường cong từ mép hộp A tới mép hộp B; `side` uốn sang hai phía để đi/về không đè nhau. */
function curve(a: { x: number; y: number }, b: { x: number; y: number }, side: 1 | -1): string {
  const ax = a.x + NW / 2;
  const ay = a.y + NH / 2;
  const bx = b.x + NW / 2;
  const by = b.y + NH / 2;
  const [sx, sy] = edgePoint(ax, ay, bx, by);
  const [ex, ey] = edgePoint(bx, by, ax, ay);
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const dx = ex - sx;
  const dy = ey - sy;
  const len = Math.hypot(dx, dy) || 1;
  const bend = Math.min(60, len * 0.18) * side;
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  return `M${sx.toFixed(1)},${sy.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
}

/** Giao của tia (cx,cy)→(tx,ty) với mép hộp NW×NH tâm (cx,cy), lùi ra 4px. */
function edgePoint(cx: number, cy: number, tx: number, ty: number): [number, number] {
  const dx = tx - cx;
  const dy = ty - cy;
  const hw = NW / 2 + 4;
  const hh = NH / 2 + 4;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  return [cx + dx * t, cy + dy * t];
}
