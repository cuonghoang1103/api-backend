/**
 * CT Work — CTW đợt 9b (13/10/2026): SỔ ĐIỂM LỚP (tab Grades).
 *
 * Bảng sinh viên × mục (bài tập 9b + quiz 9c + nguồn khác — hợp đồng `classGradebookSources.ts`), trọng số theo loại
 * hoặc chủ đề (`work_class_gradebooks`), điểm tổng hệ 10 (`totalOf`). Xuất xlsx; nhập điểm từ xlsx có xem trước lỗi
 * từng dòng ⇒ xác nhận (đọc LẠI tệp ở máy chủ, chỉ ghi dòng hợp lệ — như nhập danh sách lớp đợt 5).
 *
 * Quyền: giảng viên (OWNER/TEACHER) thấy cả lớp, kể cả điểm nháp (đánh dấu `released: false`). Sinh viên CHỈ thấy dòng
 * của mình và CHỈ điểm đã trả/công bố — lọc hai lần (nguồn tự lọc + ở đây bỏ mọi ô `released: false` / người khác).
 * Agent ⇒ 403 (classCtx).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { displayName, PUBLIC_USER } from './common.js';
import { classCtx } from './classwork.service.js';
import { gradebookSources, type GradebookCell, type GradebookCtx, type GradebookItem } from './classGradebookSources.js';
import { GRADEBOOK_MODES, normalizeWeights, parseGradeImport, totalOf, type GbCell, type GradebookMode, type ImportPreview } from './classworkRules.js';
import { parseCsv } from './teachingRules.js';
import { readXlsx, writeXlsx, XSheet, type XStyle } from './xlsxStyled.js';

async function settingsOf(classId: number) {
  const s = await prisma.workClassGradebook.findUnique({ where: { classId } });
  return { mode: ((s?.mode ?? 'POINTS') as GradebookMode), weights: normalizeWeights(s?.weights), missingAsZero: s?.missingAsZero ?? false };
}

interface Row {
  userId: number; seatId: number; name: string; studentCode: string | null; group: { id: number; number: number; name: string } | null;
  cells: Record<string, GradebookCell>; total: number | null; byGroup: Record<string, number | null>;
}

async function collect(userId: number, classId: number) {
  const c = await classCtx(userId, classId);
  const now = new Date();
  const seats = await prisma.workClassStudent.findMany({
    where: { classId, userId: c.manage ? { not: null } : userId },
    orderBy: [{ studentCode: 'asc' }, { id: 'asc' }],
    select: { id: true, userId: true, studentCode: true, fullName: true, groupId: true, group: { select: { id: true, number: true, name: true } } },
  });
  const userIds = seats.map((s) => s.userId!);
  const ctx: GradebookCtx = { classId, viewer: { userId, manage: c.manage }, userIds, now };
  const items: GradebookItem[] = [];
  const cells: GradebookCell[] = [];
  // Nguồn quiz (9c) tự đăng ký khi module được nạp — nạp chắc chắn ở đây (cron/script/test không qua tuyến của 9c).
  await import('./quiz.service.js').catch(() => null);
  for (const src of gradebookSources()) {
    const its = await src.items(ctx);
    items.push(...its);
    if (userIds.length && its.length) cells.push(...(await src.cells(ctx, its)));
  }
  items.sort((a, b) => (a.dueAt?.getTime() ?? Infinity) - (b.dueAt?.getTime() ?? Infinity) || a.title.localeCompare(b.title));
  const users = new Map((await prisma.user.findMany({ where: { id: { in: userIds } }, select: PUBLIC_USER })).map((u) => [u.id, u]));
  const settings = await settingsOf(classId);
  const keys = new Set(items.map((i) => i.key));
  const rows: Row[] = seats.map((s) => {
    const mine = cells.filter((x) => x.userId === s.userId && keys.has(x.itemKey) && (c.manage || x.released));
    const byKey: Record<string, GradebookCell> = {};
    for (const x of mine) byKey[x.itemKey] = x;
    const forTotal = new Map<string, GbCell>();
    for (const x of mine) if (x.state !== 'NOT_ASSIGNED') forTotal.set(x.itemKey, { points: x.points, missing: x.state === 'MISSING' });
    const assignedItems = items.filter((i) => byKey[i.key] && byKey[i.key].state !== 'NOT_ASSIGNED');
    const t = totalOf(assignedItems, forTotal, settings.mode, settings.weights, settings.missingAsZero);
    const u = users.get(s.userId!);
    return {
      userId: s.userId!, seatId: s.id, name: s.fullName || (u ? displayName(u) : `#${s.userId}`), studentCode: s.studentCode, group: s.group,
      cells: byKey, total: t.total, byGroup: t.byGroup,
    };
  });
  return { c, items, rows, settings };
}

export async function gradebook(userId: number, classId: number) {
  const { c, items, rows, settings } = await collect(userId, classId);
  const categories = [...new Set(items.map((i) => i.category || 'Assignment'))];
  const topics = [...new Set(items.map((i) => i.topic?.trim() || 'No topic'))];
  return {
    manage: c.manage,
    settings,
    groupsForWeights: settings.mode === 'TOPIC' ? topics : categories,
    categories, topics,
    items: items.map((i) => ({ ...i, dueAt: i.dueAt?.toISOString() ?? null })),
    rows,
    classAverage: c.manage && rows.some((r) => r.total !== null)
      ? Math.round((rows.filter((r) => r.total !== null).reduce((a, r) => a + r.total!, 0) / rows.filter((r) => r.total !== null).length) * 100) / 100
      : null,
  };
}

export async function updateSettings(userId: number, classId: number, input: { mode?: GradebookMode; weights?: Record<string, number>; missingAsZero?: boolean }) {
  await classCtx(userId, classId, true);
  if (input.mode !== undefined && !GRADEBOOK_MODES.includes(input.mode)) throw new BadRequestError('Unknown grading mode', 'WORK_GRADEBOOK_BAD');
  const cur = await settingsOf(classId);
  const weights = input.weights !== undefined ? normalizeWeights(input.weights) : cur.weights;
  const mode = input.mode ?? cur.mode;
  if (mode !== 'POINTS' && input.weights !== undefined) {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    if (sum > 0 && Math.abs(sum - 100) > 0.01) throw new BadRequestError(`Weights must add up to 100% (now ${Math.round(sum * 100) / 100}%)`, 'WORK_GRADEBOOK_WEIGHTS');
  }
  const data = { mode, weights: weights as Prisma.InputJsonValue, missingAsZero: input.missingAsZero ?? cur.missingAsZero };
  await prisma.workClassGradebook.upsert({ where: { classId }, create: { classId, ...data }, update: data });
  return gradebook(userId, classId);
}

// ─── Xuất xlsx ───────────────────────────────────────────────────

const H: XStyle = { font: { b: true, color: 'FFFFFF' }, fill: '1F3B57', border: 'thin', align: { v: 'center', wrap: true } };
const C: XStyle = { border: 'thin', align: { v: 'top' } };
const N: XStyle = { border: 'thin', align: { h: 'right', v: 'top' } };
const D: XStyle = { border: 'thin', align: { h: 'right', v: 'top' }, font: { i: true, color: '7A5C00' } };

const STATE_TEXT: Record<string, string> = { MISSING: 'Missing', TURNED_IN: 'Turned in', LATE: 'Late', ASSIGNED: '', NOT_ASSIGNED: 'n/a', GRADED: '', RETURNED: '' };

export async function exportXlsx(userId: number, classId: number) {
  const { c, items, rows, settings } = await collect(userId, classId);
  const cls = await prisma.workClass.findUniqueOrThrow({ where: { id: classId }, select: { classCode: true, term: true, subject: true } });
  const g = new XSheet('Grades');
  const fixed = ['Student code', 'Name', 'Group'];
  fixed.forEach((h, i) => g.set(1, i + 1, h, H).width(i + 1, [14, 26, 14][i]));
  items.forEach((it, i) => g.set(1, fixed.length + i + 1, `${it.title} (${it.maxPoints})`, H).width(fixed.length + i + 1, 14));
  const totalCol = fixed.length + items.length + 1;
  g.set(1, totalCol, 'Total (10)', H).width(totalCol, 11);
  g.height(1, 36);
  g.freeze = { col: 3, row: 1 };
  rows.forEach((r, ri) => {
    const y = ri + 2;
    g.set(y, 1, r.studentCode ?? '', C).set(y, 2, r.name, C).set(y, 3, r.group ? r.group.name : '', C);
    items.forEach((it, i) => {
      const cell = r.cells[it.key];
      const v = cell?.points ?? (cell ? STATE_TEXT[cell.state] ?? '' : '');
      g.set(y, fixed.length + i + 1, v === '' ? null : v, typeof v === 'number' ? (cell && !cell.released ? D : N) : C);
    });
    g.set(y, totalCol, r.total, N);
  });
  const sheets = [g];
  if (c.manage) {
    const s = new XSheet('Settings');
    s.set(1, 1, 'Mode', H).set(1, 2, settings.mode, C).width(1, 22).width(2, 40);
    s.set(2, 1, 'Missing counts as 0', H).set(2, 2, settings.missingAsZero ? 'Yes' : 'No', C);
    let y = 4;
    s.set(3, 1, settings.mode === 'TOPIC' ? 'Topic' : 'Category', H).set(3, 2, 'Weight (%)', H);
    for (const [k, w] of Object.entries(settings.weights)) { s.set(y, 1, k, C).set(y, 2, w, N); y += 1; }
    s.set(y + 1, 1, 'Italic numbers in the Grades sheet are draft grades that students cannot see yet.', C);
    sheets.push(s);
  }
  const stamp = new Date().toISOString().slice(0, 10);
  return { buf: writeXlsx(sheets, { title: `Gradebook ${cls.classCode} ${cls.term}`, creator: 'CT Work' }), fileName: `ctwork-grades-${cls.subject}-${cls.classCode}-${cls.term}-${stamp}.xlsx` };
}

// ─── Nhập xlsx ───────────────────────────────────────────────────

export interface GradeImportSource { xlsxBase64?: string; csv?: string; confirm?: boolean }

function tableOf(src: GradeImportSource): string[][] {
  if (src.csv !== undefined) {
    if (src.csv.length > 2_000_000) throw new BadRequestError('The file is too large (max 2 MB)', 'WORK_GRADEBOOK_IMPORT');
    return parseCsv(src.csv);
  }
  if (!src.xlsxBase64) throw new BadRequestError('Upload an .xlsx or .csv file', 'WORK_GRADEBOOK_IMPORT');
  const buf = Buffer.from(src.xlsxBase64, 'base64');
  if (buf.length > 3_000_000) throw new BadRequestError('The file is too large (max 3 MB)', 'WORK_GRADEBOOK_IMPORT');
  let sheets;
  try { sheets = readXlsx(buf); } catch { throw new BadRequestError('This is not an .xlsx file', 'WORK_GRADEBOOK_IMPORT'); }
  const first = sheets.find((s) => s.maxRow > 0 && s.maxCol > 0);
  if (!first) return [];
  const out: string[][] = [];
  for (let r = 1; r <= Math.min(first.maxRow, 2000); r++) {
    const row: string[] = [];
    for (let col = 1; col <= Math.min(first.maxCol, 200); col++) row.push(first.text(r, col).trim());
    out.push(row);
  }
  return out;
}

async function previewCore(userId: number, classId: number, src: GradeImportSource): Promise<{ preview: ImportPreview; items: GradebookItem[]; ctx: GradebookCtx }> {
  const { items, rows } = await collect(userId, classId);
  const seats = await prisma.workClassStudent.findMany({ where: { classId, userId: { not: null } }, select: { userId: true, studentCode: true, email: true, fullName: true } });
  const preview = parseGradeImport(
    tableOf(src),
    items.map((i) => ({ key: i.key, title: i.title, maxPoints: i.maxPoints, importable: i.importable })),
    seats.map((s) => ({ userId: s.userId!, studentCode: s.studentCode, email: s.email, name: rows.find((r) => r.userId === s.userId)?.name ?? s.fullName ?? `#${s.userId}` })),
  );
  // Ô cho mục không giao cho người đó ⇒ lỗi dòng (không âm thầm tạo bài nộp).
  for (const r of preview.rows) {
    const row = rows.find((x) => x.userId === r.userId);
    if (!row) continue;
    for (const v of r.values) {
      if (row.cells[v.itemKey]?.state === 'NOT_ASSIGNED') r.errors.push(`NOT_ASSIGNED:${items.find((i) => i.key === v.itemKey)?.title ?? v.itemKey}`);
    }
  }
  preview.valid = preview.rows.filter((x) => !x.errors.length).length;
  preview.invalid = preview.rows.length - preview.valid;
  preview.cells = preview.rows.filter((x) => !x.errors.length).reduce((a, x) => a + x.values.length, 0);
  return { preview, items, ctx: { classId, viewer: { userId, manage: true }, userIds: [], now: new Date() } };
}

/** Xem trước — KHÔNG ghi gì. */
export async function previewImport(userId: number, classId: number, src: GradeImportSource) {
  await classCtx(userId, classId, true);
  return (await previewCore(userId, classId, src)).preview;
}

/** Nhập (sau khi xem trước + xác nhận): chỉ dòng hợp lệ, ghi thành điểm NHÁP (trả bài mới thấy). */
export async function importGrades(userId: number, classId: number, src: GradeImportSource) {
  await classCtx(userId, classId, true);
  if (src.confirm !== true) throw new BadRequestError('Review the preview and confirm the import', 'WORK_CONFIRM_REQUIRED');
  const { preview, ctx } = await previewCore(userId, classId, src);
  const cells = preview.rows.filter((r) => !r.errors.length && r.userId).flatMap((r) => r.values.filter((v) => v.points !== null).map((v) => ({ itemKey: v.itemKey, userId: r.userId!, points: v.points! })));
  let written = 0;
  for (const src2 of gradebookSources()) {
    const mine = cells.filter((x) => x.itemKey.startsWith(`${src2.kind}:`));
    if (mine.length && src2.importCells) written += await src2.importCells(ctx, mine);
  }
  return { ...preview, written };
}
