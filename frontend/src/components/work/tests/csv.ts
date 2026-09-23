/**
 * Đọc/ghi CSV cho nhập test hàng loạt. Tự viết (không thêm thư viện): hỗ trợ
 * ngoặc kép, "" trong ngoặc, CRLF, dấu phẩy + xuống dòng trong ngoặc, BOM,
 * và tự đoán dấu phân cách `;` (Excel bản địa hoá châu Âu/Việt xuất bằng `;`).
 */

import type { TestInput } from '@/lib/work-api';

export function parseCsv(text: string): string[][] {
  let src = text.replace(/^\uFEFF/, '');
  const firstLine = src.slice(0, src.search(/\r?\n|$/));
  const delim = countOutsideQuotes(firstLine, ';') > countOutsideQuotes(firstLine, ',') ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  src = src.replace(/\r\n?/g, '\n');
  while (i < src.length) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"' && field.trim() === '') { field = ''; inQuotes = true; i++; continue; }
    if (c === delim) { row.push(field); field = ''; i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += c; i++;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  // Bỏ dòng trống hoàn toàn (Excel hay để dòng trắng cuối file).
  return rows.filter((r) => r.some((f) => f.trim() !== ''));
}

function countOutsideQuotes(line: string, ch: string): number {
  let n = 0;
  let q = false;
  for (const c of line) {
    if (c === '"') q = !q;
    else if (c === ch && !q) n++;
  }
  return n;
}

export function toCsv(rows: string[][]): string {
  const esc = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return '\uFEFF' + rows.map((r) => r.map(esc).join(',')).join('\r\n') + '\r\n';
}

type Col = 'title' | 'preconditions' | 'action' | 'data' | 'expected' | 'requirement' | 'priority';

const HEADER_ALIASES: Record<string, Col> = {
  title: 'title', summary: 'title', 'test title': 'title', name: 'title', 'test case': 'title',
  preconditions: 'preconditions', precondition: 'preconditions', 'pre-conditions': 'preconditions',
  step: 'action', action: 'action', steps: 'action', 'step action': 'action',
  data: 'data', 'test data': 'data',
  expected: 'expected', 'expected result': 'expected', 'expected results': 'expected',
  requirement: 'requirement', requirements: 'requirement', 'requirement key': 'requirement', covers: 'requirement',
  priority: 'priority',
};

const PRIORITY_NAMES: Record<string, number> = { highest: 1, high: 2, medium: 3, low: 4, lowest: 5 };

export interface ParsedTest {
  row: number; // dòng đầu tiên của test trong file (1 = dòng tiêu đề)
  input: TestInput & { title: string };
  warnings: string[];
}

export interface ParseResult {
  tests: ParsedTest[];
  errors: string[];
  warnings: string[];
}

export function parseTestsCsv(text: string, projectKey: string): ParseResult {
  const rows = parseCsv(text);
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!rows.length) return { tests: [], errors: ['The file is empty.'], warnings };
  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, ' '));
  const idx: Partial<Record<Col, number>> = {};
  header.forEach((h, i) => {
    const col = HEADER_ALIASES[h];
    if (col && idx[col] === undefined) idx[col] = i;
    else if (!col && h) warnings.push(`Column "${rows[0][i].trim()}" is not recognised and will be ignored.`);
  });
  if (idx.title === undefined) {
    return { tests: [], errors: ['A "Title" column is required. Download the template to see the expected layout.'], warnings };
  }
  const get = (r: string[], c: Col) => (idx[c] === undefined ? '' : (r[idx[c]!] ?? '').trim());

  const tests: ParsedTest[] = [];
  let cur: ParsedTest | null = null;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const line = i + 1;
    const title = get(r, 'title');
    if (title) {
      cur = { row: line, input: { title: title.slice(0, 255), steps: [] }, warnings: [] };
      if (title.length > 255) cur.warnings.push('Title was shortened to 255 characters.');
      tests.push(cur);
      const pre = get(r, 'preconditions');
      if (pre) cur.input.preconditions = pre;
      const pr = get(r, 'priority');
      if (pr) {
        const n = /^[1-5]$/.test(pr) ? Number(pr) : PRIORITY_NAMES[pr.toLowerCase()];
        if (n) cur.input.priority = n;
        else cur.warnings.push(`Unknown priority "${pr}" — Medium will be used.`);
      }
    } else if (!cur) {
      warnings.push(`Row ${line} has no title and no test above it — skipped.`);
      continue;
    } else {
      // Dòng tiếp theo của cùng test: cho phép bổ sung precondition/requirement.
      const pre = get(r, 'preconditions');
      if (pre) cur.input.preconditions = cur.input.preconditions ? `${cur.input.preconditions}\n${pre}` : pre;
    }
    const req = get(r, 'requirement');
    if (req) {
      const keys = req.split(/[\s,;]+/).map((k) => k.trim().toUpperCase()).filter(Boolean).map((k) => (/^\d+$/.test(k) ? `${projectKey}-${k}` : k));
      const list = cur.input.requirementKeys ?? [];
      for (const k of keys) {
        if (!/^[A-Z][A-Z0-9]*-\d+$/.test(k)) cur.warnings.push(`"${k}" does not look like an issue key.`);
        else if (!list.includes(k)) list.push(k);
      }
      cur.input.requirementKeys = list;
    }
    const action = get(r, 'action');
    const data = get(r, 'data');
    const expected = get(r, 'expected');
    if (action || data || expected) {
      const steps = cur.input.steps!;
      const prev = steps[steps.length - 1];
      if (!action && prev) {
        // Dòng không có action = phần nối tiếp của bước trước (ô Expected viết nhiều dòng).
        if (data) prev.data = prev.data ? `${prev.data}\n${data}` : data;
        if (expected) prev.expected = prev.expected ? `${prev.expected}\n${expected}` : expected;
      } else {
        if (!action) cur.warnings.push(`Row ${line}: step has no action and will be rejected.`);
        steps.push({ action, data: data || null, expected: expected || null });
      }
    }
  }
  for (const t of tests) {
    if ((t.input.steps?.length ?? 0) > 100) t.warnings.push('More than 100 steps — this test will be rejected.');
  }
  if (!tests.length && !errors.length) errors.push('No tests found. Every test needs a value in the Title column.');
  if (tests.length > 500) errors.push(`Found ${tests.length} tests — import at most 500 at a time.`);
  return { tests, errors, warnings };
}

export function templateCsv(projectKey: string): string {
  return toCsv([
    ['Title', 'Preconditions', 'Step', 'Test data', 'Expected result', 'Requirement', 'Priority'],
    ['Login with valid credentials', 'A registered account exists', 'Open the login page', '', 'The login form is displayed', `${projectKey}-1`, 'High'],
    ['', '', 'Enter username and password', 'user@example.com / Passw0rd!', 'Fields accept the input', '', ''],
    ['', '', 'Click "Sign in"', '', 'The dashboard opens and shows the user name', '', ''],
    ['Login with a wrong password', 'A registered account exists', 'Open the login page', '', 'The login form is displayed', `${projectKey}-1`, 'Medium'],
    ['', '', 'Enter a valid username and a wrong password', 'user@example.com / wrong', 'Fields accept the input', '', ''],
    ['', '', 'Click "Sign in"', '', 'An "Invalid username or password" message is shown; the user stays on the login page', '', ''],
  ]);
}
