/**
 * CT Work — nhập / xuất dữ liệu (đợt 7.2).
 *
 * Xuất: CSV (UTF-8 có BOM để Excel đọc đúng tiếng Việt), Excel .xlsx thật
 * (tự dựng file zip bằng adm-zip — không thêm thư viện), PDF (pdfkit + font
 * có đủ dấu tiếng Việt, dùng lại của CV Builder). Cả ba lấy thẻ theo JQL nên
 * "xuất đúng cái đang lọc" là miễn phí.
 *
 * Nhập: CSV của CT Work hoặc file "Export → CSV (all fields)" của Jira. Tên
 * cột nhận nhiều biến thể, cột lặp (Jira xuất nhiều cột "Labels") được gộp.
 * Luôn chạy thử (dryRun) trước để người dùng thấy dòng nào lỗi/cảnh báo;
 * bản thật tạo theo thứ tự epic → thẻ thường → việc con để cha có trước con.
 */

import AdmZip from 'adm-zip';
import PDFDocument from 'pdfkit';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { notoSansViBoldBuffer, notoSansViBuffer } from '../cv/export/font.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import { emitWorkEvent } from './events.js';
import { createIssue } from './issueChange.js';
import { requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { compileFor } from './search.service.js';

const PRIORITY_NAME: Record<number, string> = { 1: 'Highest', 2: 'High', 3: 'Medium', 4: 'Low', 5: 'Lowest' };
const MAX_EXPORT = 5000;
const MAX_IMPORT = 2000;

// ═══ Xuất ═════════════════════════════════════════════════════════

export interface ExportRow {
  key: string; type: string; status: string; summary: string; priority: string; assignee: string; reporter: string;
  sprint: string; fixVersion: string; storyPoints: number | null; originalEstimateH: number | null; timeSpentH: number | null;
  startDate: string; dueDate: string; created: string; updated: string; resolved: string; labels: string; components: string;
  parent: string; description: string;
}

const COLUMNS: Array<[keyof ExportRow, string]> = [
  ['key', 'Issue key'], ['type', 'Issue Type'], ['status', 'Status'], ['summary', 'Summary'], ['priority', 'Priority'],
  ['assignee', 'Assignee'], ['reporter', 'Reporter'], ['sprint', 'Sprint'], ['fixVersion', 'Fix Version'], ['storyPoints', 'Story Points'],
  ['originalEstimateH', 'Original Estimate (h)'], ['timeSpentH', 'Time Spent (h)'], ['startDate', 'Start date'], ['dueDate', 'Due date'],
  ['created', 'Created'], ['updated', 'Updated'], ['resolved', 'Resolved'], ['labels', 'Labels'], ['components', 'Components'],
  ['parent', 'Parent'], ['description', 'Description'],
];

export async function exportRows(userId: number, projectId: number, jql: string): Promise<{ key: string; name: string; rows: ExportRow[] }> {
  const { access, where, orderBy } = await compileFor(userId, projectId, jql);
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true } });
  const rows = await prisma.workIssue.findMany({
    where: { AND: [{ projectId, deletedAt: null }, where] },
    orderBy: orderBy.length ? orderBy : [{ rank: 'asc' }, { id: 'asc' }],
    take: MAX_EXPORT,
    select: {
      number: true, title: true, priority: true, storyPoints: true, originalEstimateMin: true, timeSpentMin: true,
      startDate: true, dueDate: true, createdAt: true, updatedAt: true, resolvedAt: true, descriptionText: true,
      type: { select: { name: true } }, status: { select: { name: true } },
      assignee: { select: { username: true, fullName: true, displayName: true } },
      reporter: { select: { username: true, fullName: true, displayName: true } },
      sprint: { select: { name: true } }, fixVersion: { select: { name: true } }, parent: { select: { number: true } },
      labels: { select: { label: { select: { name: true } } } }, components: { select: { component: { select: { name: true } } } },
    },
  });
  const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : '');
  const ts = (d: Date | null) => (d ? d.toISOString().replace('T', ' ').slice(0, 16) : '');
  return {
    key: access.key,
    name: project.name,
    rows: rows.map((r) => ({
      key: `${access.key}-${r.number}`, type: r.type.name, status: r.status.name, summary: r.title, priority: PRIORITY_NAME[r.priority] ?? String(r.priority),
      assignee: r.assignee ? displayName(r.assignee) : '', reporter: r.reporter ? displayName(r.reporter) : '', sprint: r.sprint?.name ?? '',
      fixVersion: r.fixVersion?.name ?? '', storyPoints: r.storyPoints, originalEstimateH: r.originalEstimateMin === null ? null : Math.round((r.originalEstimateMin / 60) * 100) / 100,
      timeSpentH: r.timeSpentMin ? Math.round((r.timeSpentMin / 60) * 100) / 100 : null, startDate: day(r.startDate), dueDate: day(r.dueDate),
      created: ts(r.createdAt), updated: ts(r.updatedAt), resolved: ts(r.resolvedAt),
      labels: r.labels.map((l) => l.label.name).join(', '), components: r.components.map((c) => c.component.name).join(', '),
      parent: r.parent ? `${access.key}-${r.parent.number}` : '', description: (r.descriptionText ?? '').slice(0, 32_000),
    })),
  };
}

/** Ô CSV: bọc nháy khi cần. Ô bắt đầu bằng = + - @ bị chặn công thức (CSV injection). */
function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: ExportRow[]): string {
  const lines = [COLUMNS.map(([, h]) => csvCell(h)).join(',')];
  for (const r of rows) lines.push(COLUMNS.map(([k]) => csvCell(r[k])).join(','));
  return `﻿${lines.join('\r\n')}\r\n`;
}

const xmlEsc = (s: string) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

function colName(i: number): string {
  let s = '';
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

/** File .xlsx của danh sách thẻ. */
export function toXlsx(rows: ExportRow[], sheetName = 'Issues'): Buffer {
  const widths = COLUMNS.map(([k]) => (k === 'summary' ? 50 : k === 'description' ? 60 : 16));
  return xlsxTable(COLUMNS.map(([, h]) => h), rows.map((r) => COLUMNS.map(([k]) => r[k])), sheetName, widths);
}

/**
 * File .xlsx tối giản nhưng hợp lệ từ một bảng bất kỳ: một sheet, hàng tiêu
 * đề in đậm + cố định + bộ lọc. `pre` = vài dòng tóm tắt đặt TRÊN bảng.
 */
export function xlsxTable(headers: string[], data: unknown[][], sheetName = 'Sheet1', widths?: number[], pre: string[][] = []): Buffer {
  return xlsxWorkbook([{ name: sheetName, headers, data, widths, pre }]);
}

export interface XlsxSheet { name: string; headers: string[]; data: unknown[][]; widths?: number[]; pre?: string[][] }

/** Workbook nhiều sheet (Project Tracking SWP391: Product + Summary). Mỗi sheet có tiêu đề cố định + bộ lọc. */
export function xlsxWorkbook(sheets: XlsxSheet[]): Buffer {
  const cell = (ref: string, v: unknown, style = 0) => {
    if (typeof v === 'number' && Number.isFinite(v)) return `<c r="${ref}"${style ? ` s="${style}"` : ''}><v>${v}</v></c>`;
    const s = v === null || v === undefined ? '' : String(v);
    return s ? `<c r="${ref}" t="inlineStr"${style ? ` s="${style}"` : ''}><is><t xml:space="preserve">${xmlEsc(s)}</t></is></c>` : '';
  };
  const names = sheets.map((sh, i) => (sh.name.replace(/[\\/?*[\]:]/g, ' ').slice(0, 31) || `Sheet${i + 1}`));
  const built = sheets.map((sh) => {
    const pre = sh.pre ?? [];
    const off = pre.length ? pre.length + 1 : 0; // chừa một dòng trống sau phần tóm tắt
    const top = pre.map((line, ri) => `<row r="${ri + 1}">${line.map((v, ci) => cell(`${colName(ci)}${ri + 1}`, v, ci === 0 ? 1 : 0)).join('')}</row>`).join('');
    const hr = off + 1;
    const header = `<row r="${hr}">${sh.headers.map((h, i) => cell(`${colName(i)}${hr}`, h, 1)).join('')}</row>`;
    const body = sh.data.map((r, ri) => `<row r="${hr + ri + 1}">${r.map((v, ci) => cell(`${colName(ci)}${hr + ri + 1}`, v)).join('')}</row>`).join('');
    const cols = sh.headers.map((_, i) => `<col min="${i + 1}" max="${i + 1}" width="${sh.widths?.[i] ?? 18}" customWidth="1"/>`).join('');
    const last = colName(Math.max(0, sh.headers.length - 1));
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="${hr}" topLeftCell="A${hr + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${cols}</cols><sheetData>${top}${header}${body}</sheetData><autoFilter ref="A${hr}:${last}${hr + sh.data.length}"/></worksheet>`;
    return { xml, hr, last, rows: sh.data.length };
  });
  const zip = new AdmZip();
  zip.addFile('[Content_Types].xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${built.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`));
  zip.addFile('_rels/.rels', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`));
  zip.addFile('xl/workbook.xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${names.map((n, i) => `<sheet name="${xmlEsc(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets><definedNames>${built.map((b, i) => `<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${xmlEsc(names[i])}'!$A$${b.hr}:$${b.last}$${b.hr + b.rows}</definedName>`).join('')}</definedNames></workbook>`));
  zip.addFile('xl/_rels/workbook.xml.rels', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${built.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${built.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`));
  zip.addFile('xl/styles.xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>`));
  built.forEach((b, i) => zip.addFile(`xl/worksheets/sheet${i + 1}.xml`, Buffer.from(b.xml)));
  return zip.toBuffer();
}

/** PDF danh sách thẻ: bảng gọn (mã, loại, trạng thái, người làm, hạn, tiêu đề). */
export function toPdf(title: string, subtitle: string, rows: ExportRow[]): Promise<Buffer> {
  const cols: Array<{ key: keyof ExportRow; label: string; w: number }> = [
    { key: 'key', label: 'Key', w: 62 }, { key: 'type', label: 'Type', w: 60 }, { key: 'status', label: 'Status', w: 78 },
    { key: 'priority', label: 'Priority', w: 52 }, { key: 'assignee', label: 'Assignee', w: 96 }, { key: 'dueDate', label: 'Due', w: 62 },
    { key: 'summary', label: 'Summary', w: 360 },
  ];
  return pdfTable(title, subtitle, cols.map((c) => ({ label: c.label, w: c.w })), rows.map((r) => cols.map((c) => String(r[c.key] ?? ''))), [], 'No issues match this filter.');
}

/** PDF A4 ngang từ một bảng bất kỳ; `summary` = các dòng tóm tắt in trên bảng. */
export function pdfTable(title: string, subtitle: string, cols: Array<{ label: string; w: number }>, data: string[][], summary: string[] = [], empty = 'No rows.'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36, info: { Title: title, Creator: 'CT Work' } });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.registerFont('vi', notoSansViBuffer());
    doc.registerFont('vi-bold', notoSansViBoldBuffer());
    doc.font('vi-bold').fontSize(16).fillColor('#0f172a').text(title);
    doc.font('vi').fontSize(9).fillColor('#64748b').text(subtitle).moveDown(0.6);
    if (summary.length) {
      doc.font('vi').fontSize(10).fillColor('#0f172a');
      for (const line of summary) doc.text(line);
      doc.moveDown(0.6);
    }
    const left = doc.page.margins.left;
    const bottom = () => doc.page.height - doc.page.margins.bottom;
    const drawHeader = () => {
      let x = left;
      const y = doc.y;
      doc.font('vi-bold').fontSize(8.5).fillColor('#334155');
      for (const c of cols) { doc.text(c.label, x, y, { width: c.w - 6 }); x += c.w; }
      doc.moveTo(left, y + 13).lineTo(left + cols.reduce((s, c) => s + c.w, 0), y + 13).strokeColor('#cbd5e1').lineWidth(0.6).stroke();
      doc.y = y + 18;
    };
    drawHeader();
    doc.font('vi').fontSize(8.5).fillColor('#0f172a');
    for (const r of data) {
      const h = Math.max(...cols.map((c, i) => doc.heightOfString(r[i] ?? '', { width: c.w - 6 }))) + 5;
      if (doc.y + h > bottom()) { doc.addPage(); drawHeader(); doc.font('vi').fontSize(8.5).fillColor('#0f172a'); }
      const y = doc.y;
      let x = left;
      cols.forEach((c, i) => { doc.text(r[i] ?? '', x, y, { width: c.w - 6 }); x += c.w; });
      doc.y = y + h;
    }
    if (!data.length) doc.fillColor('#64748b').text(empty, left, doc.y);
    doc.end();
  });
}

// ═══ Nhập ═════════════════════════════════════════════════════════

/** Bộ đọc CSV theo RFC 4180: nháy kép, nháy kép lồng, xuống dòng trong ô. */
export function parseCsv(text: string): string[][] {
  const s = text.replace(/^﻿/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      if (ch === '"') { if (s[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c !== '')) rows.push(row);
  return rows;
}

const ALIASES: Record<string, string[]> = {
  summary: ['summary', 'title'],
  key: ['issue key', 'key'],
  jiraId: ['issue id'],
  type: ['issue type', 'type', 'issuetype'],
  status: ['status'],
  priority: ['priority'],
  assignee: ['assignee'],
  reporter: ['reporter'],
  description: ['description'],
  labels: ['labels', 'label'],
  storyPoints: ['story points', 'story point estimate', 'custom field (story points)', 'custom field (story point estimate)', 'points'],
  due: ['due date', 'due', 'duedate'],
  start: ['start date', 'custom field (start date)'],
  parent: ['parent', 'parent key', 'parent id', 'epic link', 'custom field (epic link)', 'parent summary'],
  sprint: ['sprint'],
  estimate: ['original estimate', 'original estimate (h)'],
  created: ['created'],
};

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** Ngày: 2026-09-23 · 23/Sep/26 (Jira) · 23/09/2026. Trả YYYY-MM-DD hoặc null. */
export function parseDay(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /^(\d{1,2})\/([A-Za-z]{3})\/(\d{2,4})/.exec(s);
  if (m) {
    const mo = MONTHS.indexOf(m[2].toLowerCase());
    if (mo < 0) return null;
    const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    return `${y}-${String(mo + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return null;
}

function parsePriority(v: string): number | null {
  const s = v.trim().toLowerCase();
  if (!s) return null;
  if (/^[1-5]$/.test(s)) return Number(s);
  const map: Record<string, number> = { highest: 1, blocker: 1, critical: 1, high: 2, major: 2, medium: 3, normal: 3, low: 4, minor: 4, lowest: 5, trivial: 5 };
  return map[s] ?? null;
}

export interface ImportPreviewRow {
  row: number; summary: string; type: string; status: string; parent: string | null; errors: string[]; warnings: string[];
}

export async function importCsv(userId: number, projectId: number, input: { csv: string; dryRun: boolean }) {
  const access = await requireProject(userId, projectId, 'project.settings');
  const table = parseCsv(input.csv);
  if (table.length < 2) throw new BadRequestError('The file has no data rows', 'WORK_IMPORT_EMPTY');
  if (table.length - 1 > MAX_IMPORT) throw new BadRequestError(`Import at most ${MAX_IMPORT} rows at a time`, 'WORK_LIMIT');
  const header = table[0].map((h) => h.trim().toLowerCase());
  // Cột → danh sách chỉ số (Jira lặp cột Labels / Sprint).
  const idx: Record<string, number[]> = {};
  for (const [field, names] of Object.entries(ALIASES)) idx[field] = header.flatMap((h, i) => (names.includes(h) ? [i] : []));
  if (!idx.summary.length) throw new BadRequestError('No "Summary" (or "Title") column found', 'WORK_IMPORT_NO_SUMMARY');
  const one = (r: string[], f: string) => (idx[f].map((i) => r[i]?.trim() ?? '').find((x) => x) ?? '');
  const many = (r: string[], f: string) => idx[f].flatMap((i) => (r[i] ?? '').split(/[,;]/)).map((x) => x.trim()).filter(Boolean);

  const [types, statuses, members, labels, sprints, existingKeys] = await Promise.all([
    prisma.workIssueType.findMany({ where: { projectId, archived: false }, select: { id: true, key: true, name: true, level: true, workflowId: true } }),
    prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true, name: true, category: true, workflowId: true, position: true } }),
    projectMembers(projectId),
    prisma.workLabel.findMany({ where: { projectId }, select: { id: true, name: true } }),
    prisma.workSprint.findMany({ where: { projectId, state: { not: 'CLOSED' } }, select: { id: true, name: true } }),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null }, select: { id: true, number: true } }),
  ]);
  const defaultWf = (await prisma.workWorkflow.findFirst({ where: { projectId, isDefault: true }, select: { id: true } }))!.id;
  const memberBy = (v: string) => {
    const s = v.trim().toLowerCase();
    if (!s) return null;
    return members.find((m) => [m.username, m.displayName, m.fullName].some((x) => x?.toLowerCase() === s)) ?? null;
  };
  const typeBy = (v: string) => {
    const s = v.trim().toLowerCase();
    return types.find((t) => t.name.toLowerCase() === s || t.key.toLowerCase() === s || (s === 'sub-task' && t.level === -1) || (s === 'subtask' && t.level === -1)) ?? null;
  };
  const fallbackType = types.find((t) => t.key === 'TASK') ?? types.find((t) => t.level === 0)!;

  type Plan = { row: number; r: string[]; summary: string; type: (typeof types)[number]; statusId: number | null; statusCat: string | null; parentRef: string | null; ref: string[]; errors: string[]; warnings: string[] };
  const plans: Plan[] = table.slice(1).map((r, i) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const summary = one(r, 'summary');
    if (!summary) errors.push('Summary is empty');
    const rawType = one(r, 'type');
    let type = rawType ? typeBy(rawType) : fallbackType;
    if (!type) { warnings.push(`Unknown type "${rawType}" — imported as ${fallbackType.name}`); type = fallbackType; }
    const wf = type.workflowId ?? defaultWf;
    const rawStatus = one(r, 'status');
    const st = rawStatus ? statuses.find((s) => s.workflowId === wf && s.name.toLowerCase() === rawStatus.toLowerCase()) : null;
    if (rawStatus && !st) warnings.push(`Unknown status "${rawStatus}" — imported into the first status`);
    const assignee = one(r, 'assignee');
    if (assignee && !memberBy(assignee)) warnings.push(`"${assignee}" is not a project member — left unassigned`);
    const pr = one(r, 'priority');
    if (pr && parsePriority(pr) === null) warnings.push(`Unknown priority "${pr}" — using Medium`);
    const sp = one(r, 'sprint');
    if (sp && !sprints.some((s) => s.name.toLowerCase() === sp.toLowerCase())) warnings.push(`Sprint "${sp}" not found — left in backlog`);
    const parentRef = one(r, 'parent') || null;
    if (type.level === -1 && !parentRef) errors.push('A sub-task needs a parent');
    return { row: i + 2, r, summary, type, statusId: st?.id ?? null, statusCat: st?.category ?? null, parentRef, ref: [one(r, 'key'), one(r, 'jiraId')].filter(Boolean), errors, warnings };
  });

  // Tham chiếu cha: mã/ID trong file, hoặc mã thẻ có sẵn của dự án (KEY-12).
  const inFile = new Map<string, Plan>();
  for (const p of plans) for (const ref of p.ref) inFile.set(ref.toLowerCase(), p);
  const existingByNumber = new Map(existingKeys.map((e) => [e.number, e.id]));
  for (const p of plans) {
    if (!p.parentRef) continue;
    const ref = p.parentRef.toLowerCase();
    const local = inFile.get(ref);
    const m = new RegExp(`^${access.key}-(\\d+)$`, 'i').exec(p.parentRef);
    if (local) {
      if (local.type.level !== p.type.level + 1) p.warnings.push(`Parent ${p.parentRef} is not the right level — parent ignored`);
    } else if (m && existingByNumber.has(Number(m[1])) && !inFile.has(ref)) {
      // cha là thẻ đã có trong dự án — kiểm tầng lúc tạo (createIssue sẽ báo lỗi nếu sai)
    } else {
      p.warnings.push(`Parent "${p.parentRef}" not found — parent ignored`);
      if (p.type.level === -1) p.errors.push('Sub-task parent not found');
    }
  }

  const preview: ImportPreviewRow[] = plans.map((p) => ({
    row: p.row, summary: p.summary, type: p.type.name, status: statuses.find((s) => s.id === p.statusId)?.name ?? '(first status)',
    parent: p.parentRef, errors: p.errors, warnings: p.warnings,
  }));
  const valid = plans.filter((p) => !p.errors.length);
  if (input.dryRun) return { dryRun: true, total: plans.length, valid: valid.length, rows: preview };

  const created = new Map<Plan, number>(); // plan → issue id
  const failures: Array<{ row: number; error: string }> = [];
  const labelIds = new Map(labels.map((l) => [l.name.toLowerCase(), l.id]));
  const actor = { kind: 'USER' as const, userId };
  for (const level of [1, 0, -1]) {
    for (const p of valid.filter((x) => x.type.level === level)) {
      try {
        let parentId: number | null = null;
        if (p.parentRef) {
          const local = inFile.get(p.parentRef.toLowerCase());
          const m = new RegExp(`^${access.key}-(\\d+)$`, 'i').exec(p.parentRef);
          if (local && created.has(local) && local.type.level === p.type.level + 1) parentId = created.get(local)!;
          else if (!local && m) parentId = existingByNumber.get(Number(m[1])) ?? null;
        }
        if (p.type.level === -1 && !parentId) throw new Error('Sub-task parent was not created');
        const sp = one(p.r, 'sprint');
        const est = one(p.r, 'estimate');
        // Jira xuất Original Estimate tính bằng GIÂY; file CT Work tính bằng giờ.
        const estMin = est && Number.isFinite(Number(est)) ? (idx.estimate.some((i) => header[i].includes('(h)')) ? Math.round(Number(est) * 60) : Math.round(Number(est) / 60)) : null;
        const points = Number(one(p.r, 'storyPoints'));
        const due = parseDay(one(p.r, 'due'));
        const start = parseDay(one(p.r, 'start'));
        const desc = one(p.r, 'description');
        const issue = await createIssue({
          projectId, typeId: p.type.id, title: p.summary.slice(0, 255),
          statusId: p.statusId ?? undefined, parentId,
          priority: parsePriority(one(p.r, 'priority')) ?? undefined,
          assigneeId: memberBy(one(p.r, 'assignee'))?.id ?? null,
          reporterId: memberBy(one(p.r, 'reporter'))?.id ?? userId,
          storyPoints: Number.isFinite(points) && one(p.r, 'storyPoints') ? points : null,
          originalEstimateMin: estMin && estMin > 0 ? estMin : null,
          dueDate: due ? new Date(`${due}T00:00:00Z`) : null,
          startDate: start ? new Date(`${start}T00:00:00Z`) : null,
          sprintId: p.type.level === 0 ? (sprints.find((s) => s.name.toLowerCase() === sp.toLowerCase())?.id ?? null) : undefined,
          descriptionJson: desc ? { type: 'doc', content: desc.split(/\r?\n/).map((line) => (line ? { type: 'paragraph', content: [{ type: 'text', text: line }] } : { type: 'paragraph' })) } : undefined,
        }, actor);
        // Nhập thẳng vào cột DONE thì vẫn phải có resolvedAt — báo cáo đọc trường đó.
        const createdDay = parseDay(one(p.r, 'created'));
        if (p.statusCat === 'DONE' || createdDay) {
          await prisma.workIssue.update({
            where: { id: issue.id },
            data: {
              ...(p.statusCat === 'DONE' ? { resolvedAt: new Date(), resolution: 'DONE' } : {}),
              ...(createdDay ? { createdAt: new Date(`${createdDay}T00:00:00Z`) } : {}),
            },
          });
        }
        const names = many(p.r, 'labels');
        for (const n of names.slice(0, 20)) {
          const k = n.toLowerCase().slice(0, 40);
          let lid = labelIds.get(k);
          if (!lid) {
            const l = await prisma.workLabel.upsert({ where: { uk_work_label: { projectId, name: n.slice(0, 40) } }, create: { projectId, name: n.slice(0, 40) }, update: {} });
            lid = l.id;
            labelIds.set(k, lid);
          }
          await prisma.workIssueLabel.createMany({ data: [{ issueId: issue.id, labelId: lid }], skipDuplicates: true });
        }
        created.set(p, issue.id);
      } catch (err) {
        failures.push({ row: p.row, error: err instanceof Error ? err.message : String(err) });
      }
    }
  }
  emitWorkEvent({ type: 'project.updated', projectId, actor });
  await auditProject(projectId, { actorId: userId, action: 'project.import', targetType: 'project', targetId: projectId, summary: `Imported ${created.size} issues from CSV`, detail: { created: created.size, failed: failures.length, skipped: plans.length - valid.length } });
  return { dryRun: false, total: plans.length, created: created.size, skipped: plans.length - valid.length, failures };
}
