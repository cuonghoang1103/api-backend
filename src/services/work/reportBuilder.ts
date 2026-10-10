/**
 * CT Work — CTW đợt 8b: TRÌNH SOẠN BÁO CÁO (Reports → Builder). Phần THUẦN (không DB) — test ở ctw8b.test.ts.
 *
 *   - Bố cục báo cáo = danh sách KHỐI kéo-thả: tiêu đề, đoạn văn, ô KPI, biểu đồ có sẵn (burnup/burndown/CFD/velocity/
 *     defect/test pass rate/OKR/throughput/created vs resolved), bảng thẻ theo JQL, danh sách rủi ro, nhận xét AI (tuỳ chọn),
 *     ngắt trang. Kiểm bằng zod (`layoutSchema`) — mỗi khối có trần riêng để không ai nhét 5 MB vào một mẫu.
 *   - Bộ mẫu sẵn (BUILTIN_TEMPLATES): báo cáo tuần · báo cáo sprint · báo cáo cho giảng viên · báo cáo cho khách.
 *   - Biểu đồ vẽ thành SVG ở MÁY CHỦ (`renderChartSvg`) — CHỮ VẼ THÀNH ĐƯỜNG (glyph của font Roboto có đủ dấu tiếng Việt,
 *     cùng font PDF dùng) ⇒ đổi sang PNG bằng sharp trên ảnh node:22-slim (không có font hệ thống) vẫn đủ chữ, không ô vuông.
 *     Cùng một SVG cho xem trước trên web, ảnh trong PDF và ảnh trong DOCX ⇒ ba nơi giống nhau.
 *   - Kỳ báo cáo (`periodFor`): tuần (7 ngày lùi từ hôm nay theo múi giờ), 14/30 ngày, hoặc sprint (đang chạy, không thì sprint
 *     đóng gần nhất).
 */

import { createRequire } from 'node:module';
import { z } from 'zod';
import { notoSansViBoldBuffer, notoSansViBuffer } from '../cv/export/font.js';

// ═══ Bố cục ══════════════════════════════════════════════════════

export const KPI_KEYS = ['open', 'doneInPeriod', 'overdue', 'blocked', 'velocity', 'sprintProgress', 'testPassRate', 'openDefects', 'highRisks', 'okrProgress'] as const;
export type KpiKey = (typeof KPI_KEYS)[number];
export const CHART_KEYS = ['burnup', 'burndown', 'cfd', 'velocity', 'defects', 'testPassRate', 'okr', 'throughput', 'createdResolved'] as const;
export type ChartKey = (typeof CHART_KEYS)[number];
export const ISSUE_COLUMNS = ['key', 'title', 'type', 'status', 'assignee', 'priority', 'due', 'points'] as const;
export type IssueColumn = (typeof ISSUE_COLUMNS)[number];
export const PERIODS = ['week', 'last14', 'last30', 'sprint'] as const;
export type PeriodKind = (typeof PERIODS)[number];
export const AI_AUDIENCES = ['team', 'teacher', 'client'] as const;

const bid = z.string().regex(/^[A-Za-z0-9_-]{1,40}$/);
const shortText = (n: number) => z.string().max(n);

export const blockSchema = z.discriminatedUnion('type', [
  z.object({ id: bid, type: z.literal('heading'), text: shortText(200), level: z.number().int().min(1).max(3).default(1) }),
  z.object({ id: bid, type: z.literal('text'), text: shortText(8000) }),
  z.object({ id: bid, type: z.literal('kpis'), title: shortText(120).nullable().optional(), metrics: z.array(z.enum(KPI_KEYS)).min(1).max(8) }),
  z.object({
    id: bid, type: z.literal('chart'), chart: z.enum(CHART_KEYS), title: shortText(120).nullable().optional(),
    days: z.number().int().min(7).max(180).nullable().optional(), sprintId: z.number().int().positive().nullable().optional(),
  }),
  z.object({
    id: bid, type: z.literal('issues'), title: shortText(120).nullable().optional(), jql: shortText(1000).default(''),
    columns: z.array(z.enum(ISSUE_COLUMNS)).min(1).max(8).default(['key', 'title', 'status', 'assignee']), limit: z.number().int().min(1).max(200).default(25),
  }),
  z.object({ id: bid, type: z.literal('risks'), title: shortText(120).nullable().optional(), limit: z.number().int().min(1).max(20).default(5) }),
  z.object({
    id: bid, type: z.literal('ai'), title: shortText(120).nullable().optional(), audience: z.enum(AI_AUDIENCES).default('team'),
    text: shortText(20_000).nullable().optional(), generatedAt: z.string().max(40).nullable().optional(), refreshOnSend: z.boolean().default(false),
  }),
  z.object({ id: bid, type: z.literal('pageBreak') }),
]);
export type ReportBlock = z.infer<typeof blockSchema>;

export const layoutSchema = z.object({
  version: z.literal(1).default(1),
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().max(300).nullable().optional(),
  period: z.enum(PERIODS).default('week'),
  language: z.enum(['en', 'vi']).nullable().optional(),
  options: z.object({
    cover: z.boolean().default(true),
    toc: z.boolean().default(true),
    logo: z.boolean().default(true),
    coverImage: z.boolean().default(true),
    /** Màu nhấn (#rrggbb) — trống ⇒ màu dự án / mặc định. */
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
  }).default({}),
  blocks: z.array(blockSchema).max(60),
});
export type ReportLayout = z.infer<typeof layoutSchema>;

export function parseLayout(v: unknown): ReportLayout {
  return layoutSchema.parse(v);
}

// ═══ Bộ mẫu sẵn ══════════════════════════════════════════════════

export const BUILTIN_KEYS = ['weekly', 'sprint', 'lecturer', 'client'] as const;
export type BuiltinKey = (typeof BUILTIN_KEYS)[number];

type Lang = 'en' | 'vi';
const L = (lang: Lang, en: string, vi: string) => (lang === 'vi' ? vi : en);

/** Mẫu sẵn theo ngôn ngữ (chữ trong báo cáo theo ngôn ngữ dự án; giao diện CT Work vẫn theo người dùng). */
export function builtinTemplate(key: BuiltinKey, lang: Lang = 'en'): { key: BuiltinKey; name: string; description: string; layout: ReportLayout } {
  const t = (en: string, vi: string) => L(lang, en, vi);
  switch (key) {
    case 'weekly':
      return {
        key, name: t('Weekly report', 'Báo cáo tuần'), description: t('KPIs, flow and what moved this week — for the team.', 'KPI, dòng chảy và việc đã chạy trong tuần — cho cả nhóm.'),
        layout: parseLayout({
          title: t('Weekly report', 'Báo cáo tuần'), period: 'week',
          blocks: [
            { id: 'h1', type: 'heading', text: t('Summary', 'Tóm tắt'), level: 1 },
            { id: 'k1', type: 'kpis', metrics: ['doneInPeriod', 'open', 'overdue', 'blocked', 'sprintProgress', 'highRisks'] },
            { id: 'c1', type: 'chart', chart: 'cfd', days: 14 },
            { id: 'c2', type: 'chart', chart: 'createdResolved', days: 14 },
            { id: 'h2', type: 'heading', text: t('Completed this week', 'Đã xong trong tuần'), level: 1 },
            { id: 'i1', type: 'issues', jql: 'resolved >= -7d ORDER BY resolved DESC', columns: ['key', 'title', 'type', 'assignee'], limit: 30 },
            { id: 'h3', type: 'heading', text: t('Overdue and at risk', 'Trễ hạn và rủi ro'), level: 1 },
            { id: 'i2', type: 'issues', jql: 'due < now() AND resolved IS EMPTY ORDER BY due ASC', columns: ['key', 'title', 'assignee', 'due'], limit: 20 },
            { id: 'r1', type: 'risks', limit: 5 },
            { id: 'a1', type: 'ai', audience: 'team', text: null, refreshOnSend: false },
          ],
        }),
      };
    case 'sprint':
      return {
        key, name: t('Sprint report', 'Báo cáo sprint'), description: t('Burndown, velocity and sprint scope.', 'Burndown, velocity và phạm vi sprint.'),
        layout: parseLayout({
          title: t('Sprint report', 'Báo cáo sprint'), period: 'sprint',
          blocks: [
            { id: 'h1', type: 'heading', text: t('Sprint at a glance', 'Tổng quan sprint'), level: 1 },
            { id: 'k1', type: 'kpis', metrics: ['sprintProgress', 'velocity', 'doneInPeriod', 'open', 'blocked'] },
            { id: 'c1', type: 'chart', chart: 'burndown' },
            { id: 'c2', type: 'chart', chart: 'burnup' },
            { id: 'c3', type: 'chart', chart: 'velocity' },
            { id: 'h2', type: 'heading', text: t('Sprint scope', 'Phạm vi sprint'), level: 1 },
            { id: 'i1', type: 'issues', jql: 'sprint in openSprints() ORDER BY status ASC', columns: ['key', 'title', 'status', 'assignee', 'points'], limit: 60 },
            { id: 'h3', type: 'heading', text: t('Quality', 'Chất lượng'), level: 1 },
            { id: 'c4', type: 'chart', chart: 'defects', days: 30 },
          ],
        }),
      };
    case 'lecturer':
      return {
        key, name: t('Report for the lecturer', 'Báo cáo cho giảng viên'), description: t('Progress, quality, OKRs and risks — formal, for the supervisor.', 'Tiến độ, chất lượng, OKR và rủi ro — trang trọng, cho giảng viên hướng dẫn.'),
        layout: parseLayout({
          title: t('Progress report', 'Báo cáo tiến độ'), period: 'week', subtitle: t('Prepared for the project supervisor', 'Gửi giảng viên hướng dẫn'),
          blocks: [
            { id: 'h1', type: 'heading', text: t('1. Progress', '1. Tiến độ'), level: 1 },
            { id: 'k1', type: 'kpis', metrics: ['doneInPeriod', 'open', 'overdue', 'sprintProgress', 'testPassRate', 'okrProgress'] },
            { id: 'c1', type: 'chart', chart: 'burnup' },
            { id: 'c2', type: 'chart', chart: 'velocity' },
            { id: 'h2', type: 'heading', text: t('2. Work completed', '2. Việc đã hoàn thành'), level: 1 },
            { id: 'i1', type: 'issues', jql: 'resolved >= -7d ORDER BY resolved DESC', columns: ['key', 'title', 'type', 'assignee'], limit: 40 },
            { id: 'h3', type: 'heading', text: t('3. Quality', '3. Chất lượng'), level: 1 },
            { id: 'c3', type: 'chart', chart: 'testPassRate' },
            { id: 'c4', type: 'chart', chart: 'defects', days: 30 },
            { id: 'h4', type: 'heading', text: t('4. Objectives (OKR)', '4. Mục tiêu (OKR)'), level: 1 },
            { id: 'c5', type: 'chart', chart: 'okr' },
            { id: 'h5', type: 'heading', text: t('5. Risks and next steps', '5. Rủi ro và bước tiếp theo'), level: 1 },
            { id: 'r1', type: 'risks', limit: 5 },
            { id: 'a1', type: 'ai', audience: 'teacher', text: null, refreshOnSend: false },
          ],
        }),
      };
    case 'client':
      return {
        key, name: t('Report for the client', 'Báo cáo cho khách'), description: t('Outcomes and milestones in plain language — no internal workload.', 'Kết quả và mốc bằng lời dễ hiểu — không lộ khối lượng việc nội bộ.'),
        layout: parseLayout({
          title: t('Project update', 'Cập nhật dự án'), period: 'week',
          blocks: [
            { id: 'h1', type: 'heading', text: t('Highlights', 'Điểm chính'), level: 1 },
            { id: 'k1', type: 'kpis', metrics: ['doneInPeriod', 'open', 'sprintProgress'] },
            { id: 't1', type: 'text', text: t('This report summarises what the team delivered in the period and what comes next.', 'Báo cáo tóm tắt những gì nhóm đã bàn giao trong kỳ và việc sắp tới.') },
            { id: 'c1', type: 'chart', chart: 'burnup' },
            { id: 'h2', type: 'heading', text: t('Delivered', 'Đã bàn giao'), level: 1 },
            { id: 'i1', type: 'issues', jql: 'resolved >= -7d ORDER BY resolved DESC', columns: ['key', 'title', 'type'], limit: 30 },
            { id: 'h3', type: 'heading', text: t('Risks', 'Rủi ro'), level: 1 },
            { id: 'r1', type: 'risks', limit: 3 },
            { id: 'a1', type: 'ai', audience: 'client', text: null, refreshOnSend: false },
          ],
        }),
      };
  }
}

// ═══ Kỳ báo cáo ══════════════════════════════════════════════════

const DAY = 86_400_000;

/** Ngày YYYY-MM-DD theo múi giờ. */
export function localDay(d: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
const addDaysStr = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);

export interface Period { from: string; to: string; kind: PeriodKind; sprint: { id: number; name: string } | null }

export function periodFor(kind: PeriodKind, now: Date, tz: string, sprint?: { id: number; name: string; startAt: Date | null; endAt: Date | null; completedAt: Date | null } | null): Period {
  const today = localDay(now, tz);
  if (kind === 'sprint' && sprint?.startAt) {
    const end = sprint.completedAt ?? (sprint.endAt && sprint.endAt < now ? sprint.endAt : now);
    return { from: localDay(sprint.startAt, tz), to: localDay(end, tz), kind, sprint: { id: sprint.id, name: sprint.name } };
  }
  const days = kind === 'last30' ? 30 : kind === 'last14' ? 14 : 7;
  return { from: addDaysStr(today, -(days - 1)), to: today, kind: kind === 'sprint' ? 'week' : kind, sprint: null };
}

// ═══ Biểu đồ SVG (chữ = đường) ═══════════════════════════════════

export type ChartSpec =
  | { kind: 'line'; title: string; x: string[]; series: Array<{ name: string; values: Array<number | null>; color?: string; dashed?: boolean }>; yMax?: number | null; ySuffix?: string }
  | { kind: 'area'; title: string; x: string[]; series: Array<{ name: string; values: number[]; color?: string }> }
  | { kind: 'bar'; title: string; x: string[]; series: Array<{ name: string; values: number[]; color?: string }>; ySuffix?: string; yMax?: number | null }
  | { kind: 'hbar'; title: string; items: Array<{ label: string; value: number; color?: string }>; max?: number; suffix?: string }
  | { kind: 'empty'; title: string; message: string };

export const PALETTE = ['#4f5bd5', '#16a34a', '#f59e0b', '#dc2626', '#0891b2', '#7c3aed', '#db2777', '#64748b'];
const INK = '#1f2328';
const MUTED = '#6b7280';
const GRID = '#e5e7eb';

interface GlyphFont { unitsPerEm: number; layout(text: string): { glyphs: Array<{ id: number; path: { toSVG(): string } }>; positions: Array<{ xAdvance: number; xOffset: number; yOffset: number }> } }
let fonts: { regular: GlyphFont; bold: GlyphFont } | null | undefined;
function loadFonts() {
  if (fonts !== undefined) return fonts;
  try {
    const require = createRequire(import.meta.url);
    const fontkit = require('fontkit') as { create(buf: Buffer): GlyphFont };
    fonts = { regular: fontkit.create(notoSansViBuffer()), bold: fontkit.create(notoSansViBoldBuffer()) };
  } catch {
    fonts = null; // không có fontkit ⇒ lùi về <text> (trình duyệt vẫn vẽ được; PNG có thể thiếu chữ)
  }
  return fonts;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Bề rộng chữ (px) theo font thật. */
export function textWidth(text: string, size: number, bold = false): number {
  const f = loadFonts();
  if (!f) return text.length * size * 0.55;
  const font = bold ? f.bold : f.regular;
  const run = font.layout(text);
  return (run.positions.reduce((a, p) => a + p.xAdvance, 0) * size) / font.unitsPerEm;
}

/** Cắt chữ cho vừa bề rộng (thêm "…"). */
export function fitText(text: string, size: number, maxW: number, bold = false): string {
  if (textWidth(text, size, bold) <= maxW) return text;
  let lo = 0, hi = text.length;
  while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (textWidth(`${text.slice(0, mid)}…`, size, bold) <= maxW) lo = mid; else hi = mid - 1; }
  return `${text.slice(0, lo)}…`;
}

/** Một dòng chữ ⇒ SVG (đường glyph). anchor: start | middle | end. */
export function svgText(text: string, x: number, y: number, o: { size?: number; bold?: boolean; color?: string; anchor?: 'start' | 'middle' | 'end'; rotate?: number } = {}): string {
  const size = o.size ?? 11;
  const color = o.color ?? INK;
  const f = loadFonts();
  if (!text) return '';
  if (!f) {
    const a = o.anchor === 'middle' ? 'middle' : o.anchor === 'end' ? 'end' : 'start';
    return `<text x="${r2(x)}" y="${r2(y)}" font-family="Roboto, Arial, sans-serif" font-size="${size}"${o.bold ? ' font-weight="700"' : ''} fill="${color}" text-anchor="${a}"${o.rotate ? ` transform="rotate(${o.rotate} ${r2(x)} ${r2(y)})"` : ''}>${esc(text)}</text>`;
  }
  const font = o.bold ? f.bold : f.regular;
  const run = font.layout(text);
  const k = size / font.unitsPerEm;
  const w = run.positions.reduce((a, p) => a + p.xAdvance, 0) * k;
  const x0 = o.anchor === 'middle' ? x - w / 2 : o.anchor === 'end' ? x - w : x;
  let adv = 0;
  const paths: string[] = [];
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    const d = g.path.toSVG();
    if (d) paths.push(`<path transform="translate(${r2(adv + p.xOffset)} ${r2(p.yOffset)})" d="${d}"/>`);
    adv += p.xAdvance;
  });
  const rot = o.rotate ? `rotate(${o.rotate} ${r2(x)} ${r2(y)}) ` : '';
  return `<g fill="${color}" transform="${rot}translate(${r2(x0)} ${r2(y)}) scale(${r2(k * 1000) / 1000} ${-r2(k * 1000) / 1000})">${paths.join('')}</g>`;
}

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}
const fmtNum = (n: number) => (Math.abs(n) >= 1000 ? `${Math.round(n / 100) / 10}k` : Number.isInteger(n) ? String(n) : String(Math.round(n * 10) / 10));
const shortDay = (s: string) => (/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : s);

export const CHART_W = 720;
export const CHART_H = 300;

/** Biểu đồ ⇒ SVG đứng một mình (nền trắng — giấy in). */
export function renderChartSvg(spec: ChartSpec, o: { width?: number; height?: number; accent?: string | null } = {}): string {
  const W = o.width ?? CHART_W;
  const H = o.height ?? CHART_H;
  const parts: string[] = [];
  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="8" fill="#ffffff" stroke="${GRID}"/>`);
  parts.push(svgText(fitText(spec.title, 13, W - 32, true), 16, 24, { size: 13, bold: true }));
  const pal = (i: number, c?: string) => c ?? (i === 0 && o.accent ? o.accent : PALETTE[i % PALETTE.length]);

  if (spec.kind === 'empty') {
    parts.push(svgText(fitText(spec.message, 12, W - 40), W / 2, H / 2 + 4, { size: 12, color: MUTED, anchor: 'middle' }));
    return wrap(W, H, parts);
  }

  // Chú giải (hàng trên, sau tiêu đề).
  const legend = spec.kind === 'hbar' ? [] : spec.series.map((s, i) => ({ name: s.name, color: pal(i, s.color), dashed: 'dashed' in s ? !!s.dashed : false }));
  let lx = 16;
  let ly = 44;
  for (const l of legend) {
    const w = textWidth(l.name, 10) + 26;
    if (lx + w > W - 12) { lx = 16; ly += 16; }
    parts.push(l.dashed
      ? `<line x1="${lx}" y1="${ly - 4}" x2="${lx + 14}" y2="${ly - 4}" stroke="${l.color}" stroke-width="2" stroke-dasharray="4 3"/>`
      : `<rect x="${lx}" y="${ly - 9}" width="12" height="10" rx="2" fill="${l.color}"/>`);
    parts.push(svgText(l.name, lx + 18, ly, { size: 10, color: MUTED }));
    lx += w;
  }

  if (spec.kind === 'hbar') {
    const max = spec.max ?? 100;
    const items = spec.items.slice(0, 10);
    const top = 44;
    const rowH = Math.min(26, (H - top - 16) / Math.max(1, items.length));
    const labelW = Math.min(260, W * 0.38);
    const barX = 16 + labelW + 8;
    const barW = W - barX - 56;
    items.forEach((it, i) => {
      const y = top + i * rowH;
      const v = Math.max(0, Math.min(max, it.value));
      parts.push(svgText(fitText(it.label, 11, labelW), 16, y + rowH / 2 + 4, { size: 11 }));
      parts.push(`<rect x="${r2(barX)}" y="${r2(y + rowH * 0.2)}" width="${r2(barW)}" height="${r2(rowH * 0.6)}" rx="3" fill="#f1f5f9"/>`);
      parts.push(`<rect x="${r2(barX)}" y="${r2(y + rowH * 0.2)}" width="${r2((barW * v) / max)}" height="${r2(rowH * 0.6)}" rx="3" fill="${pal(0, it.color)}"/>`);
      parts.push(svgText(`${fmtNum(it.value)}${spec.suffix ?? ''}`, barX + barW + 6, y + rowH / 2 + 4, { size: 10, color: MUTED }));
    });
    return wrap(W, H, parts);
  }

  // Trục.
  const left = 48, right = 16, top = ly + 14, bottom = 34;
  const pw = W - left - right, ph = H - top - bottom;
  const n = spec.x.length;
  let dataMax = 0;
  if (spec.kind === 'area') {
    for (let i = 0; i < n; i++) dataMax = Math.max(dataMax, spec.series.reduce((a, s) => a + (s.values[i] ?? 0), 0));
  } else {
    for (const s of spec.series) for (const v of s.values) if (typeof v === 'number') dataMax = Math.max(dataMax, v);
  }
  const yMax = ('yMax' in spec && spec.yMax) ? spec.yMax : niceMax(dataMax || 1);
  const ySuffix = 'ySuffix' in spec ? spec.ySuffix ?? '' : '';
  const Y = (v: number) => top + ph - (v / yMax) * ph;
  for (let t = 0; t <= 4; t++) {
    const v = (yMax * t) / 4;
    const y = Y(v);
    parts.push(`<line x1="${left}" y1="${r2(y)}" x2="${W - right}" y2="${r2(y)}" stroke="${GRID}" stroke-width="1"/>`);
    parts.push(svgText(`${fmtNum(v)}${ySuffix}`, left - 6, y + 3.5, { size: 9.5, color: MUTED, anchor: 'end' }));
  }
  const step = Math.max(1, Math.ceil(n / 8));
  const X = spec.kind === 'bar' ? (i: number) => left + (pw * (i + 0.5)) / Math.max(1, n) : (i: number) => left + (n <= 1 ? pw / 2 : (pw * i) / (n - 1));
  spec.x.forEach((lab, i) => {
    if (i % step && i !== n - 1) return;
    parts.push(svgText(fitText(shortDay(lab), 9.5, Math.max(30, (pw / n) * step - 4)), X(i), H - bottom + 16, { size: 9.5, color: MUTED, anchor: 'middle' }));
  });

  if (spec.kind === 'line') {
    spec.series.forEach((s, si) => {
      const color = pal(si, s.color);
      let d = '';
      let pen = false;
      s.values.forEach((v, i) => {
        if (typeof v !== 'number') { pen = false; return; }
        d += `${pen ? 'L' : 'M'}${r2(X(i))} ${r2(Y(Math.min(v, yMax)))}`;
        pen = true;
      });
      if (d) parts.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="2"${s.dashed ? ' stroke-dasharray="5 4"' : ''} stroke-linejoin="round" stroke-linecap="round"/>`);
    });
  } else if (spec.kind === 'area') {
    const acc = new Array(n).fill(0) as number[];
    spec.series.forEach((s, si) => {
      const color = pal(si, s.color);
      const lower = [...acc];
      for (let i = 0; i < n; i++) acc[i] += s.values[i] ?? 0;
      if (!n) return;
      let d = `M${r2(X(0))} ${r2(Y(acc[0]))}`;
      for (let i = 1; i < n; i++) d += `L${r2(X(i))} ${r2(Y(acc[i]))}`;
      for (let i = n - 1; i >= 0; i--) d += `L${r2(X(i))} ${r2(Y(lower[i]))}`;
      parts.push(`<path d="${d}Z" fill="${color}" fill-opacity="0.85" stroke="#ffffff" stroke-width="0.6"/>`);
    });
  } else if (spec.kind === 'bar') {
    const groups = spec.series.length;
    const slot = pw / Math.max(1, n);
    const bw = Math.max(2, Math.min(28, (slot * 0.7) / groups));
    spec.series.forEach((s, si) => {
      const color = pal(si, s.color);
      s.values.forEach((v, i) => {
        const x = X(i) - (bw * groups) / 2 + si * bw;
        const y = Y(Math.min(v, yMax));
        parts.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(bw - 1)}" height="${r2(Math.max(0, top + ph - y))}" rx="1.5" fill="${color}"/>`);
      });
    });
  }
  parts.push(`<line x1="${left}" y1="${top + ph}" x2="${W - right}" y2="${top + ph}" stroke="#9ca3af" stroke-width="1"/>`);
  return wrap(W, H, parts);
}

function wrap(W: number, H: number, parts: string[]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`;
}

// ═══ Lịch tự gửi (thuần) ═════════════════════════════════════════

export const SCHEDULE_CADENCES = ['WEEKLY', 'SPRINT'] as const;
export type ScheduleCadence = (typeof SCHEDULE_CADENCES)[number];

/** Ngày-giờ địa phương (thứ 1–7, giờ 0–23) theo múi giờ. */
export function localWeekdayHour(now: Date, tz: string): { weekday: number; hour: number; day: string } {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: 'numeric', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  } catch {
    parts = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short', hour: 'numeric', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  }
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')) + 1;
  return { weekday: wd || 1, hour: Number(get('hour')) % 24, day: `${get('year')}-${get('month')}-${get('day')}` };
}

/** ISO tuần (YYYY-Www) của một ngày. */
export function isoWeek(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  const thu = new Date(d.getTime() + (3 - dow) * DAY);
  const year = thu.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const firstThu = jan4.getTime() + (3 - ((jan4.getUTCDay() + 6) % 7)) * DAY;
  return `${year}-W${String(1 + Math.round((thu.getTime() - firstThu) / (7 * DAY))).padStart(2, '0')}`;
}

/**
 * Lịch có tới hạn chưa, và KHOÁ KỲ (periodKey) — mỗi kỳ chỉ gửi MỘT lần (UNIQUE scheduleId + periodKey trong DB):
 *   WEEKLY — đúng thứ + đã qua giờ hẹn (gửi bù trong ngày nếu máy chủ tắt đúng giờ) ⇒ "W:2026-W41".
 *   SPRINT — sprint vừa ĐÓNG (completedAt trong 3 ngày gần đây) và đã qua giờ hẹn ⇒ "S:<sprintId>".
 */
export function scheduleDue(
  s: { cadence: string; weekday: number; hour: number; timezone: string; enabled: boolean },
  now: Date,
  lastClosedSprint?: { id: number; completedAt: Date | null } | null,
): { due: false } | { due: true; periodKey: string } {
  if (!s.enabled) return { due: false };
  const l = localWeekdayHour(now, s.timezone);
  if (s.cadence === 'SPRINT') {
    const c = lastClosedSprint?.completedAt;
    if (!lastClosedSprint || !c) return { due: false };
    if (now.getTime() - c.getTime() > 3 * DAY || c > now) return { due: false };
    if (l.hour < s.hour && localDay(c, s.timezone) === l.day) return { due: false };
    return { due: true, periodKey: `S:${lastClosedSprint.id}` };
  }
  if (l.weekday !== s.weekday || l.hour < s.hour) return { due: false };
  return { due: true, periodKey: `W:${isoWeek(l.day)}` };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const validEmail = (e: string) => EMAIL_RE.test(e) && e.length <= 254 && !e.endsWith('@agents.invalid');
