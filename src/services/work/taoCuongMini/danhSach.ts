/**
 * "Create with CuongMini" — đọc DANH SÁCH THÀNH VIÊN: dán từ Excel/Sheets (tab), CSV (`,` hoặc `;` — Excel tiếng Việt
 * hay xuất `;`), bảng Markdown (`| … |`), hoặc tệp .xlsx. THUẦN — không gọi mạng, không CSDL.
 *
 * Nhận ra cột theo tiêu đề tiếng Việt / tiếng Anh (bỏ dấu khi so); không có tiêu đề ⇒ đoán theo nội dung từng ô
 * (email theo dạng, MSSV kiểu FPT `SE123456` hoặc dãy số, họ tên = ô chữ dài nhất).
 */

import { foldVi } from '../fold.js';
import { readXlsx } from '../xlsxStyled.js';
import { CAP, type RosterRow } from './kieu.js';

export type RosterField = 'name' | 'lastName' | 'firstName' | 'studentId' | 'email' | 'role' | 'skills' | 'level' | 'hours' | 'prefs' | 'group' | 'no';

/** Tiêu đề đã bỏ dấu + thường hoá ⇒ trường. Khớp NGUYÊN chuỗi trước, rồi mới khớp "chứa". */
const HEADERS: Array<[RosterField, string[]]> = [
  ['no', ['stt', 'no', 'no.', '#', 'so thu tu', 'tt']],
  ['studentId', ['mssv', 'ma sv', 'ma so sinh vien', 'ma sinh vien', 'msv', 'student id', 'studentid', 'student code', 'roll number', 'roll no', 'roll', 'ma so', 'id', 'code']],
  ['email', ['email', 'e-mail', 'mail', 'gmail', 'email address', 'dia chi email']],
  ['lastName', ['ho', 'ho dem', 'ho va ten dem', 'last name', 'surname', 'family name']],
  ['firstName', ['first name', 'given name']],
  ['name', ['ho ten', 'ho va ten', 'ten', 'full name', 'fullname', 'name', 'student name', 'ten sinh vien', 'sinh vien', 'thanh vien', 'member', 'student', 'nguoi']],
  ['role', ['vai tro', 'role', 'chuc vu', 'position', 'vi tri', 'nhiem vu chinh', 'title']],
  ['skills', ['ky nang', 'skills', 'skill', 'strengths', 'strength', 'diem manh', 'the manh', 'cong nghe', 'tech']],
  ['level', ['level', 'trinh do', 'cap do', 'nang luc', 'muc', 'rank', 'xep loai', 'hoc luc', 'experience', 'kinh nghiem']],
  ['hours', ['hours', 'hours/week', 'hours per week', 'gio/tuan', 'so gio', 'so gio/tuan', 'availability', 'thoi gian', 'gio ranh', 'capacity']],
  ['prefs', ['preferences', 'preference', 'so thich', 'mong muon', 'muon lam', 'prefer', 'wants', 'nguyen vong', 'ghi chu', 'note', 'notes']],
  ['group', ['group', 'nhom', 'team', 'nhom so', 'group no', 'project group']],
];

const norm = (s: string) => foldVi(s).replace(/[_*`]/g, ' ').replace(/\s+/g, ' ').trim();

export function fieldOfHeader(raw: string): RosterField | null {
  const h = norm(raw).replace(/[:.()]+$/g, '').trim();
  if (!h) return null;
  for (const [f, names] of HEADERS) if (names.includes(h)) return f;
  // "Họ và tên SV", "MSSV (Student ID)", "Email FPT" — khớp phần đầu/chứa, từ dài trước (tránh "id" khớp nhầm).
  const all = HEADERS.flatMap(([f, names]) => names.filter((n) => n.length >= 3).map((n) => [f, n] as const)).sort((a, b) => b[1].length - a[1].length);
  for (const [f, n] of all) if (new RegExp(`(^|[^a-z])${n.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}([^a-z]|$)`).test(h)) return f;
  return null;
}

const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[a-z]{2,}$/i;
/** MSSV FPT (SE/HE/DE/QE/CE/HS/SS/SA… + 5–7 số) hoặc dãy 6–10 chữ số. */
const MSSV_RE = /^(?:[A-Z]{2,3}\d{5,7}|\d{6,10})$/i;

/** "Giỏi", "strong", "4/5", "beginner"… ⇒ 1–5. Không hiểu ⇒ null. */
export function parseLevel(raw: string): number | null {
  const t = norm(raw);
  if (!t) return null;
  const num = /(\d+(?:[.,]\d+)?)\s*(?:\/\s*(\d+))?/.exec(t);
  if (num) {
    const v = Number(num[1].replace(',', '.'));
    const of = num[2] ? Number(num[2]) : v > 5 ? 10 : 5;
    if (Number.isFinite(v) && of > 0) return Math.min(5, Math.max(1, Math.round((v / of) * 5)));
  }
  const words: Array<[number, string[]]> = [
    [5, ['xuat sac', 'expert', 'very strong', 'rat manh', 'rat gioi', 'excellent', 'lead', 'senior']],
    [4, ['gioi', 'strong', 'good', 'manh', 'tot', 'advanced', 'middle', 'mid']],
    [3, ['kha', 'average', 'medium', 'trung binh', 'fair', 'ok', 'normal', 'intermediate']],
    [2, ['yeu', 'weak', 'junior', 'it kinh nghiem', 'basic', 'co ban']],
    [1, ['beginner', 'moi', 'newbie', 'new', 'chua biet', 'none', 'fresher', 'moi bat dau', 'zero']],
  ];
  for (const [lv, ws] of words) if (ws.some((w) => new RegExp(`(^|\\s)${w}(\\s|$)`).test(t))) return lv;
  return null;
}

export function parseHours(raw: string): number | null {
  const m = /(\d+(?:[.,]\d+)?)/.exec(raw);
  if (!m) return null;
  const v = Number(m[1].replace(',', '.'));
  return Number.isFinite(v) ? Math.min(80, Math.max(0, v)) : null;
}

/** Tách một dòng theo dấu phân cách đã chọn (nháy kép kiểu CSV). */
function splitLine(line: string, sep: string): string[] {
  if (sep === '|') {
    const t = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    return t.split('|').map((c) => c.trim());
  }
  const out: string[] = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') { if (line[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch;
    } else if (ch === '"' && !cell.trim()) q = true;
    else if (line.startsWith(sep, i)) { out.push(cell.trim()); cell = ''; i += sep.length - 1; }
    else cell += ch;
  }
  out.push(cell.trim());
  return out;
}

/** Đoán dấu phân cách từ vài dòng đầu: tab > | (bảng Markdown) > ; > , > " - ". */
export function detectDelimiter(lines: string[]): string {
  const head = lines.slice(0, 5);
  const count = (sep: string) => head.reduce((n, l) => n + (l.split(sep).length - 1), 0);
  if (count('\t')) return '\t';
  if (head.some((l) => /^\s*\|.*\|\s*$/.test(l))) return '|';
  const semi = count(';');
  const comma = count(',');
  if (semi && semi >= comma) return ';';
  if (comma) return ',';
  if (count(' - ')) return ' - ';
  return '\t';
}

/** Văn bản dán ⇒ bảng ô. Bỏ dòng kẻ của bảng Markdown (|---|---|). */
export function textToTable(text: string): string[][] {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim());
  const sep = detectDelimiter(lines);
  return lines
    .filter((l) => !(sep === '|' && /^\s*\|?\s*:?-{2,}/.test(l)))
    .map((l) => splitLine(l, sep));
}

export interface RosterParse {
  rows: RosterRow[];
  headerFound: boolean;
  /** Cột ⇒ trường đã nhận ra (để giao diện hiện "cột 2 = MSSV"). */
  columns: Array<RosterField | null>;
  warnings: string[];
}

/** Đoán trường của một ô KHÔNG có tiêu đề. */
function guessRow(cells: string[]): Partial<Record<RosterField, string>> {
  const out: Partial<Record<RosterField, string>> = {};
  const rest: string[] = [];
  for (const raw of cells) {
    const c = raw.trim();
    if (!c) continue;
    if (!out.email && EMAIL_RE.test(c)) out.email = c;
    else if (!out.studentId && MSSV_RE.test(c.replace(/\s/g, ''))) out.studentId = c.replace(/\s/g, '').toUpperCase();
    else if (/^\d{1,3}$/.test(c) && !out.no && !rest.length) out.no = c;
    else rest.push(c);
  }
  // Họ tên: ô có ≥ 2 từ toàn chữ (kể cả chữ có dấu) — dài nhất; còn lại lần lượt là vai trò / kỹ năng.
  const nameLike = rest.filter((c) => /^[\p{L}][\p{L}' .-]+$/u.test(c) && c.trim().split(/\s+/).length >= 2).sort((a, b) => b.length - a.length);
  out.name = nameLike[0] ?? rest[0];
  const others = rest.filter((c) => c !== out.name);
  for (const c of others) {
    if (!out.level && parseLevel(c) !== null && c.length <= 20) out.level = c;
    else if (!out.role) out.role = c;
    else if (!out.skills) out.skills = c;
  }
  return out;
}

function toRow(f: Partial<Record<RosterField, string>>): RosterRow | null {
  const name = (f.name || [f.lastName, f.firstName].filter(Boolean).join(' ')).replace(/\s+/g, ' ').trim();
  if (!name || name.length < 2) return null;
  // Dòng tiêu đề lặp lại giữa bảng / dòng tổng ("Tổng", "Total") ⇒ bỏ.
  if (fieldOfHeader(name) === 'name' || /^(tong|total|cong)\b/i.test(norm(name))) return null;
  const email = (f.email ?? '').trim();
  return {
    name: name.slice(0, 120),
    studentId: (f.studentId ?? '').replace(/\s/g, '').toUpperCase().slice(0, 40),
    email: EMAIL_RE.test(email) ? email.toLowerCase().slice(0, 160) : '',
    role: (f.role ?? '').trim().slice(0, 60),
    skills: (f.skills ?? '').trim().slice(0, 300),
    level: parseLevel(f.level ?? '') ?? 3,
    hoursPerWeek: parseHours(f.hours ?? '') ?? 8,
    prefs: (f.prefs ?? '').trim().slice(0, 200),
    group: (f.group ?? '').trim().slice(0, 80),
  };
}

/** Bảng ô ⇒ danh sách thành viên. */
export function parseRosterTable(table: string[][]): RosterParse {
  const warnings: string[] = [];
  const rows0 = table.filter((r) => r.some((c) => c && c.trim()));
  if (!rows0.length) return { rows: [], headerFound: false, columns: [], warnings: ['The list is empty'] };
  // Tiêu đề: trong 5 dòng đầu, dòng có ≥ 2 ô nhận ra được (và có cột tên hoặc họ).
  let headerAt = -1;
  let columns: Array<RosterField | null> = [];
  for (let i = 0; i < Math.min(5, rows0.length); i++) {
    const cols = rows0[i].map(fieldOfHeader);
    const known = cols.filter(Boolean).length;
    if (known >= 2 && cols.some((c) => c === 'name' || c === 'lastName')) { headerAt = i; columns = cols; break; }
    if (known >= 1 && rows0[i].filter((c) => c.trim()).length === 1 && cols[0] === 'name') { headerAt = i; columns = cols; break; }
  }
  // Hai cột cùng là "name" (vd "Tên" + "Họ và tên") ⇒ giữ cột đầu là họ tên đầy đủ nếu không có cột họ riêng.
  const out: RosterRow[] = [];
  const seen = new Set<string>();
  const body = headerAt >= 0 ? rows0.slice(headerAt + 1) : rows0;
  for (const cells of body) {
    let f: Partial<Record<RosterField, string>>;
    if (headerAt >= 0) {
      f = {};
      cells.forEach((c, i) => {
        const k = columns[i];
        if (k && !f[k] && c?.trim()) f[k] = c.trim();
      });
      // Có cột "Họ" + cột "Tên" riêng: ô "Tên" bị đọc thành name ⇒ ghép lại.
      if (columns.includes('lastName') && f.name && f.lastName && !f.name.includes(f.lastName)) f.name = `${f.lastName} ${f.name}`;
    } else f = guessRow(cells);
    const row = toRow(f);
    if (!row) continue;
    const id = row.studentId || row.email || foldVi(row.name);
    if (seen.has(id)) { warnings.push(`Duplicate row skipped: ${row.name}${row.studentId ? ` (${row.studentId})` : ''}`); continue; }
    seen.add(id);
    out.push(row);
    if (out.length >= CAP.members) { warnings.push(`Only the first ${CAP.members} members are kept`); break; }
  }
  if (!out.length) warnings.push('No member rows were recognised — put one person per line (name, student ID, email…)');
  return { rows: out, headerFound: headerAt >= 0, columns, warnings };
}

export function parseRosterText(text: string): RosterParse {
  return parseRosterTable(textToTable(text.slice(0, 400_000)));
}

/** Tệp: .xlsx (sheet đầu có dữ liệu) / .csv / .tsv / .txt. */
export function parseRosterFile(buf: Buffer, fileName: string): RosterParse {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.xlsx') || lower.endsWith('.xlsm')) {
    const sheets = readXlsx(buf);
    for (const sh of sheets) {
      const table: string[][] = [];
      for (let r = 1; r <= Math.min(sh.maxRow, CAP.members + 20); r++) {
        const row: string[] = [];
        for (let c = 1; c <= Math.min(sh.maxCol, 30); c++) row.push(sh.text(r, c) ?? '');
        table.push(row);
      }
      const p = parseRosterTable(table);
      if (p.rows.length) return { ...p, warnings: sheets.length > 1 ? [...p.warnings, `Read sheet “${sh.name}”`] : p.warnings };
    }
    return { rows: [], headerFound: false, columns: [], warnings: ['No member rows were found in the spreadsheet'] };
  }
  if (lower.endsWith('.xls')) return { rows: [], headerFound: false, columns: [], warnings: ['Old .xls files are not supported — save as .xlsx or CSV'] };
  return parseRosterText(buf.toString('utf8'));
}
