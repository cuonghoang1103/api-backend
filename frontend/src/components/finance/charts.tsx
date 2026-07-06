'use client';
/**
 * MoneyFlow chart wrappers (recharts). recharts needs concrete colour strings,
 * so we pass hex values from the neon palette / category colours rather than
 * CSS vars. Axis/label text uses a muted grey that reads in both themes.
 */
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { formatVnd, formatVndCompact } from '@/lib/utils';

const AXIS = '#94a3b8';
const GRID = 'rgba(148,163,184,0.15)';

const tooltipStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 12,
  fontSize: 12,
  color: 'var(--text-primary)',
} as const;

export function CashflowChart({ data }: { data: Array<{ date: string; income: string; expense: string }> }) {
  const rows = data.map((d) => ({ day: d.date.slice(8), income: Number(d.income), expense: Number(d.expense) }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
          <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity={0.5} /><stop offset="100%" stopColor="#f97316" stopOpacity={0} /></linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" tick={{ fill: AXIS, fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: AXIS, fontSize: 11 }} tickFormatter={(v) => formatVndCompact(v)} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [formatVnd(v), n === 'income' ? 'Thu' : 'Chi']} labelFormatter={(l) => `Ngày ${l}`} />
        <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#inc)" />
        <Area type="monotone" dataKey="expense" stroke="#f97316" strokeWidth={2} fill="url(#exp)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const DONUT_FALLBACK = ['#8b5cf6', '#22d3ee', '#f97316', '#22c55e', '#ef4444', '#eab308', '#ec4899', '#3b82f6', '#a855f7', '#64748b'];

export function ExpenseDonut({ data }: { data: Array<{ category: { id: number; name: string; color: string | null } | null; total: string }> }) {
  const rows = data
    .map((d, i) => ({ name: d.category?.name ?? 'Khác', value: Number(d.total), color: d.category?.color || DONUT_FALLBACK[i % DONUT_FALLBACK.length] }))
    .filter((r) => r.value > 0);
  if (rows.length === 0) return <div className="flex h-[220px] items-center justify-center text-sm text-text-muted">Chưa có chi tiêu</div>;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} strokeWidth={0}>
          {rows.map((r, i) => <Cell key={i} fill={r.color} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatVnd(v)} />
        <Legend wrapperStyle={{ fontSize: 11, color: AXIS }} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function IncomeMonthBars({ months }: { months: Array<{ month: number; total: string }> }) {
  const rows = months.map((m) => ({ month: `T${m.month}`, total: Number(m.total) }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={{ fill: AXIS, fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: AXIS, fontSize: 11 }} tickFormatter={(v) => formatVndCompact(v)} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatVnd(v), 'Thu nhập']} />
        <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DebtBalanceChart({ data }: { data: Array<{ label: string; remaining: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs><linearGradient id="rem" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient></defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: AXIS, fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: AXIS, fontSize: 11 }} tickFormatter={(v) => formatVndCompact(v)} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatVnd(v), 'Còn lại']} />
        <Area type="stepAfter" dataKey="remaining" stroke="#ef4444" strokeWidth={2} fill="url(#rem)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
