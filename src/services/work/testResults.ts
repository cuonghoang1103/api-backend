/**
 * CT Work đợt 7c (TST-2 / B10, T11) — đọc kết quả test tự động + độ phủ. HÀM THUẦN, không chạm DB (testResults.test.ts).
 *
 *   JUnit XML  — Maven Surefire/Gradle, pytest --junitxml, PHPUnit, .NET (trx→junit), Playwright/Jest junit reporter…
 *   Playwright — `--reporter=json` (suites lồng nhau → specs → tests → results, trạng thái expected/unexpected/flaky/skipped).
 *   Jest       — `--json` (testResults[].assertionResults[]); Vitest `--reporter=json` cùng hình dạng.
 *   Độ phủ     — lcov.info (LF/LH, BRF/BRH), JaCoCo XML (<counter type="LINE|BRANCH">), Cobertura XML (line-rate),
 *                Istanbul `coverage-summary.json` (total.lines.pct).
 *
 * XML tự đọc bằng bộ tách thẻ nhỏ (không thêm thư viện): KHÔNG xử lý DTD/thực thể ngoài (chống XXE — `<!DOCTYPE …>` bị
 * bỏ qua, chỉ giải 5 thực thể chuẩn + &#…;), có trần số phần tử và độ sâu.
 */

import crypto from 'node:crypto';

export type ResultStatus = 'PASS' | 'FAIL' | 'SKIP';
export type ResultFormat = 'JUNIT' | 'PLAYWRIGHT' | 'JEST';
export type CoverageFormat = 'LCOV' | 'JACOCO' | 'COBERTURA' | 'ISTANBUL';

export interface TestResult {
  suite: string | null;
  name: string;
  file: string | null;
  status: ResultStatus;
  durationMs: number | null;
  /** Dòng lỗi ngắn (failure message). */
  message: string | null;
  /** Chi tiết (stack trace…), đã cắt. */
  details: string | null;
  /** Đỏ rồi xanh khi chạy lại (Playwright "flaky", Surefire flakyFailure/rerunFailure). */
  retried: boolean;
}

export interface ParsedReport { format: ResultFormat; results: TestResult[]; durationMs: number | null }

export const MAX_RESULTS = 5000;
const MAX_ELEMENTS = 300_000;
const MAX_DEPTH = 64;
const MSG_MAX = 1000;
const DETAILS_MAX = 4000;

const clip = (s: string | null | undefined, n: number) => {
  const t = (s ?? '').replace(/\r\n/g, '\n').trim();
  return t ? (t.length > n ? `${t.slice(0, n - 1)}…` : t) : null;
};
const ms = (v: unknown, scale = 1): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.round(n * scale) : null;
};
/** Bỏ mã màu ANSI (Jest/Playwright in lỗi có màu). */
const noAnsi = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');

// ─── XML tối giản ────────────────────────────────────────────────

export interface XmlEl { name: string; attrs: Record<string, string>; children: XmlEl[]; text: string }

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|lt|gt|amp|quot|apos);/g, (_m, e: string) => {
    if (e === 'lt') return '<';
    if (e === 'gt') return '>';
    if (e === 'amp') return '&';
    if (e === 'quot') return '"';
    if (e === 'apos') return "'";
    const code = e.startsWith('#x') ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : '';
  });
}

/** Tách XML thành cây. Ném Error khi hỏng nặng (thẻ đóng lệch, quá lớn). */
export function parseXml(xml: string): XmlEl {
  const root: XmlEl = { name: '#root', attrs: {}, children: [], text: '' };
  const stack: XmlEl[] = [root];
  const re = /<!\[CDATA\[([\s\S]*?)\]\]>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!DOCTYPE[^>[]*(?:\[[\s\S]*?\])?\s*>|<(\/?)([A-Za-z_][\w:.-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>|([^<]+)|(<)/g;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) { top.text += m[1]; continue; }
    if (m[6] !== undefined) { top.text += decodeEntities(m[6]); continue; }
    if (m[7] !== undefined) throw new Error('Malformed XML');
    if (!m[3]) continue; // chú thích / khai báo / DOCTYPE
    const name = m[3];
    if (m[2] === '/') {
      if (top.name !== name) throw new Error(`Malformed XML: unexpected </${name}>`);
      stack.pop();
      continue;
    }
    if (++count > MAX_ELEMENTS) throw new Error('The report is too large');
    const attrs: Record<string, string> = {};
    const ar = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
    let a: RegExpExecArray | null;
    while ((a = ar.exec(m[4] ?? ''))) attrs[a[1]] = decodeEntities(a[2] ?? a[3] ?? '');
    const el: XmlEl = { name, attrs, children: [], text: '' };
    top.children.push(el);
    if (m[5] !== '/') {
      if (stack.length > MAX_DEPTH) throw new Error('The report is nested too deeply');
      stack.push(el);
    }
  }
  if (stack.length !== 1) throw new Error('Malformed XML: unclosed elements');
  return root;
}

const local = (n: string) => n.replace(/^.*:/, '');
function* walk(el: XmlEl): Generator<XmlEl> {
  for (const c of el.children) { yield c; yield* walk(c); }
}

// ─── JUnit XML ───────────────────────────────────────────────────

export function parseJUnit(xml: string): ParsedReport {
  const root = parseXml(xml);
  const results: TestResult[] = [];
  let total: number | null = null;
  const visit = (el: XmlEl, suiteName: string | null, suiteFile: string | null) => {
    for (const c of el.children) {
      const n = local(c.name);
      if (n === 'testsuites') {
        if (total === null) total = ms(c.attrs.time, 1000);
        visit(c, suiteName, suiteFile);
      } else if (n === 'testsuite') {
        if (total === null && el === root) total = ms(c.attrs.time, 1000);
        visit(c, c.attrs.name || suiteName, c.attrs.file || suiteFile);
      } else if (n === 'testcase') {
        if (results.length >= MAX_RESULTS) return;
        const kids = c.children.map((k) => ({ n: local(k.name), k }));
        const fail = kids.find((k) => k.n === 'failure' || k.n === 'error');
        const skip = kids.find((k) => k.n === 'skipped');
        const retried = kids.some((k) => k.n === 'flakyFailure' || k.n === 'flakyError' || k.n === 'rerunFailure' || k.n === 'rerunError');
        const msg = fail ? (fail.k.attrs.message || fail.k.text.split('\n').find((l) => l.trim()) || fail.k.attrs.type || 'Failed') : skip ? (skip.k.attrs.message || null) : null;
        results.push({
          suite: c.attrs.classname || suiteName || null,
          name: c.attrs.name || '(unnamed test)',
          file: c.attrs.file || suiteFile || null,
          status: fail ? 'FAIL' : skip ? 'SKIP' : 'PASS',
          durationMs: ms(c.attrs.time, 1000),
          message: clip(msg, MSG_MAX),
          details: fail ? clip(fail.k.text, DETAILS_MAX) : null,
          retried: retried && !fail,
        });
      } else {
        visit(c, suiteName, suiteFile);
      }
    }
  };
  visit(root, null, null);
  if (!results.length && ![...walk(root)].some((e) => /^(testsuites?|testcase)$/.test(local(e.name)))) {
    throw new Error('This is not a JUnit XML report (no <testsuite> or <testcase>)');
  }
  return { format: 'JUNIT', results, durationMs: total };
}

// ─── Playwright JSON ─────────────────────────────────────────────

interface PwResult { status?: string; duration?: number; retry?: number; error?: { message?: string; stack?: string }; errors?: Array<{ message?: string }> }
interface PwTest { projectName?: string; status?: string; results?: PwResult[] }
interface PwSpec { title?: string; file?: string; tests?: PwTest[] }
interface PwSuite { title?: string; file?: string; specs?: PwSpec[]; suites?: PwSuite[] }

export function parsePlaywright(data: unknown): ParsedReport {
  const d = data as { suites?: PwSuite[]; stats?: { duration?: number }; config?: unknown };
  if (!d || !Array.isArray(d.suites)) throw new Error('This is not a Playwright JSON report (no "suites")');
  const results: TestResult[] = [];
  const projects = new Set<string>();
  const collect = (s: PwSuite, path: string[], file: string | null) => {
    const f = s.file || file;
    // Suite gốc của Playwright là tên TỆP ⇒ không lặp vào tên test.
    const p = s.title && s.title !== s.file ? [...path, s.title] : path;
    for (const sp of s.specs ?? []) {
      for (const t of sp.tests ?? []) {
        if (results.length >= MAX_RESULTS) return;
        const rs = t.results ?? [];
        const last = rs[rs.length - 1];
        const err = [...rs].reverse().find((r) => r.error?.message || r.errors?.length);
        const st = t.status;
        const status: ResultStatus = st === 'unexpected' ? 'FAIL'
          : st === 'skipped' || (rs.length > 0 && rs.every((r) => r.status === 'skipped')) ? 'SKIP'
            : st === 'expected' || st === 'flaky' ? 'PASS'
              : last?.status === 'passed' ? 'PASS' : last?.status === 'skipped' ? 'SKIP' : 'FAIL';
        const message = status === 'FAIL' ? noAnsi(err?.error?.message ?? err?.errors?.[0]?.message ?? `Test ${last?.status ?? 'failed'}`) : null;
        results.push({
          suite: p.length ? p.join(' › ') : null,
          name: `${sp.title ?? '(unnamed test)'}${projects.size > 1 && t.projectName ? ` [${t.projectName}]` : ''}`,
          file: sp.file || f || null,
          status,
          durationMs: rs.length ? rs.reduce((a, r) => a + (r.duration ?? 0), 0) : null,
          message: clip(message?.split('\n').find((l) => l.trim()) ?? null, MSG_MAX),
          details: status === 'FAIL' ? clip(noAnsi(err?.error?.stack ?? err?.error?.message ?? ''), DETAILS_MAX) : null,
          retried: st === 'flaky',
        });
      }
    }
    for (const c of s.suites ?? []) collect(c, p, f);
  };
  // Lượt một đếm project (tên test chỉ kèm [project] khi có nhiều project).
  const countProjects = (s: PwSuite) => { for (const sp of s.specs ?? []) for (const t of sp.tests ?? []) if (t.projectName) projects.add(t.projectName); (s.suites ?? []).forEach(countProjects); };
  d.suites.forEach(countProjects);
  for (const s of d.suites) collect(s, [], null);
  return { format: 'PLAYWRIGHT', results, durationMs: ms(d.stats?.duration) };
}

// ─── Jest / Vitest JSON ──────────────────────────────────────────

interface JestAssertion { ancestorTitles?: string[]; title?: string; fullName?: string; status?: string; duration?: number | null; failureMessages?: string[]; invocations?: number }
interface JestFile { name?: string; testFilePath?: string; assertionResults?: JestAssertion[]; startTime?: number; endTime?: number; message?: string; status?: string }

export function parseJest(data: unknown): ParsedReport {
  const d = data as { testResults?: JestFile[]; startTime?: number };
  if (!d || !Array.isArray(d.testResults)) throw new Error('This is not a Jest/Vitest JSON report (no "testResults")');
  const results: TestResult[] = [];
  let duration = 0;
  for (const f of d.testResults) {
    const file = f.name ?? f.testFilePath ?? null;
    if (typeof f.startTime === 'number' && typeof f.endTime === 'number' && f.endTime >= f.startTime) duration += f.endTime - f.startTime;
    const list = f.assertionResults ?? [];
    // Tệp hỏng trước khi chạy test nào (lỗi cú pháp, import) ⇒ một kết quả FAIL đại diện cho cả tệp.
    if (!list.length && f.status === 'failed' && f.message) {
      results.push({ suite: null, name: '(test file failed to run)', file, status: 'FAIL', durationMs: null, message: clip(noAnsi(f.message).split('\n').find((l) => l.trim()) ?? 'Test file failed', MSG_MAX), details: clip(noAnsi(f.message), DETAILS_MAX), retried: false });
      continue;
    }
    for (const a of list) {
      if (results.length >= MAX_RESULTS) break;
      const st = a.status ?? '';
      const status: ResultStatus = st === 'passed' ? 'PASS' : st === 'failed' ? 'FAIL' : 'SKIP';
      const fm = noAnsi((a.failureMessages ?? []).join('\n\n'));
      results.push({
        suite: a.ancestorTitles?.length ? a.ancestorTitles.join(' › ') : null,
        name: a.title || a.fullName || '(unnamed test)',
        file,
        status,
        durationMs: ms(a.duration),
        message: status === 'FAIL' ? clip(fm.split('\n').find((l) => l.trim()) ?? 'Failed', MSG_MAX) : null,
        details: status === 'FAIL' ? clip(fm, DETAILS_MAX) : null,
        // jest-circus retryTimes: invocations > 1 mà vẫn passed ⇒ đỏ rồi xanh.
        retried: status === 'PASS' && (a.invocations ?? 1) > 1,
      });
    }
  }
  return { format: 'JEST', results, durationMs: duration || null };
}

// ─── Nhận dạng ───────────────────────────────────────────────────

export function detectFormat(raw: string): ResultFormat {
  const t = raw.trimStart();
  if (t.startsWith('<')) return 'JUNIT';
  let j: unknown;
  try { j = JSON.parse(t); } catch { throw new Error('Unrecognised report — send JUnit XML, Playwright JSON or Jest/Vitest JSON'); }
  const o = j as Record<string, unknown>;
  if (o && Array.isArray(o.testResults)) return 'JEST';
  if (o && Array.isArray(o.suites)) return 'PLAYWRIGHT';
  throw new Error('Unrecognised JSON report — expected Playwright ("suites") or Jest/Vitest ("testResults")');
}

export function parseReport(raw: string | object, format?: ResultFormat | 'AUTO'): ParsedReport {
  const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const f = !format || format === 'AUTO' ? detectFormat(text) : format;
  if (f === 'JUNIT') return parseJUnit(text);
  let data: unknown = raw;
  if (typeof raw === 'string') {
    try { data = JSON.parse(raw); } catch { throw new Error(`The ${f === 'JEST' ? 'Jest' : 'Playwright'} report is not valid JSON`); }
  }
  return f === 'JEST' ? parseJest(data) : parsePlaywright(data);
}

// ─── Khoá, chữ ký lỗi, flaky ─────────────────────────────────────

export function testKey(r: Pick<TestResult, 'suite' | 'file' | 'name'>): string {
  return `${(r.suite ?? r.file ?? '').trim()}::${r.name.trim()}`;
}
export const keyHash = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

/**
 * Chữ ký một lỗi để CHỐNG TRÙNG bug: cùng nhóm (suite/tệp) + dòng lỗi đầu đã chuẩn hoá (số, mã hex, đường dẫn tạm, thời
 * gian bị thay bằng dấu chung). Hai test cùng suite hỏng vì cùng một nguyên nhân ⇒ một bug.
 */
export function failSignature(r: Pick<TestResult, 'suite' | 'file' | 'message'>): string | null {
  const line = (r.message ?? '').split('\n')[0]
    .toLowerCase()
    .replace(/0x[0-9a-f]+/g, '#')
    .replace(/\b[0-9a-f]{8,}\b/g, '#')
    .replace(/\d+(\.\d+)?/g, '#')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
  if (line.length < 12) return null; // "failed", "error" — quá chung, không gộp
  return crypto.createHash('sha256').update(`${r.suite ?? r.file ?? ''}|${line}`).digest('hex').slice(0, 64);
}

/** Lịch sử: P = xanh, F = đỏ, S = bỏ qua, R = xanh SAU khi chạy lại (đỏ-rồi-xanh trong cùng lượt). Mới nhất ở CUỐI. */
export const HISTORY_MAX = 30;
export function historyChar(r: Pick<TestResult, 'status' | 'retried'>): 'P' | 'F' | 'S' | 'R' {
  return r.status === 'FAIL' ? 'F' : r.status === 'SKIP' ? 'S' : r.retried ? 'R' : 'P';
}
export function pushHistory(history: string, c: string): string {
  return (history + c).slice(-HISTORY_MAX);
}

/**
 * Test flaky = đỏ/xanh xen kẽ mà không ai sửa gì. Xét 10 lượt CHẠY gần nhất (bỏ S):
 *   - flips = số lần đổi màu giữa hai lượt liền nhau (R tính là xanh);
 *   - có R (đỏ-rồi-xanh khi chạy lại) cũng là dấu hiệu flaky;
 *   flaky ⇔ flips ≥ 3, hoặc (flips ≥ 2 và có R), hoặc R xuất hiện ≥ 2 lần.
 * score 0–100 = flips / (n−1) (+15 mỗi R, trần 100) — để xếp hạng.
 */
export function flakiness(history: string): { flaky: boolean; score: number; flips: number; runs: number } {
  const ran = history.replace(/S/g, '').slice(-10);
  const color = (c: string) => (c === 'F' ? 'F' : 'P');
  let flips = 0;
  for (let i = 1; i < ran.length; i += 1) if (color(ran[i]) !== color(ran[i - 1])) flips += 1;
  const retries = (ran.match(/R/g) ?? []).length;
  const flaky = flips >= 3 || (flips >= 2 && retries >= 1) || retries >= 2;
  const base = ran.length > 1 ? (flips / (ran.length - 1)) * 100 : 0;
  return { flaky, score: Math.min(100, Math.round(base + retries * 15)), flips, runs: ran.length };
}

export function summarize(results: TestResult[]) {
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  return { total: results.length, passed, failed, skipped: results.length - passed - failed, retried: results.filter((r) => r.retried).length };
}

// ─── Độ phủ ──────────────────────────────────────────────────────

export interface CoverageModule { name: string; linePct: number | null; lines: { covered: number; total: number } }
export interface ParsedCoverage {
  format: CoverageFormat;
  linePct: number | null;
  branchPct: number | null;
  lines: { covered: number; total: number } | null;
  branches: { covered: number; total: number } | null;
  /** Mô-đun phủ thấp nhất trước (tối đa 50) — cho bảng 5.1. */
  modules: CoverageModule[];
}

const pct = (covered: number, total: number) => (total > 0 ? Math.round((covered / total) * 10000) / 100 : null);
const sortModules = (m: CoverageModule[]) => m.sort((a, b) => (a.linePct ?? 101) - (b.linePct ?? 101) || a.name.localeCompare(b.name)).slice(0, 50);

export function parseLcov(text: string): ParsedCoverage {
  let lf = 0, lh = 0, brf = 0, brh = 0, files = 0;
  const modules: CoverageModule[] = [];
  let cur: { name: string; lf: number; lh: number } | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('SF:')) { cur = { name: line.slice(3), lf: 0, lh: 0 }; files += 1; } else if (line.startsWith('LF:')) { const n = Number(line.slice(3)) || 0; lf += n; if (cur) cur.lf = n; } else if (line.startsWith('LH:')) { const n = Number(line.slice(3)) || 0; lh += n; if (cur) cur.lh = n; } else if (line.startsWith('BRF:')) brf += Number(line.slice(4)) || 0;
    else if (line.startsWith('BRH:')) brh += Number(line.slice(4)) || 0;
    else if (line === 'end_of_record' && cur) { modules.push({ name: cur.name, linePct: pct(cur.lh, cur.lf), lines: { covered: cur.lh, total: cur.lf } }); cur = null; }
  }
  if (!files) throw new Error('This is not an lcov report (no SF: records)');
  return { format: 'LCOV', linePct: pct(lh, lf), branchPct: pct(brh, brf), lines: { covered: lh, total: lf }, branches: brf ? { covered: brh, total: brf } : null, modules: sortModules(modules) };
}

function counter(el: XmlEl, type: string) {
  const c = el.children.find((k) => local(k.name) === 'counter' && k.attrs.type === type);
  if (!c) return null;
  const missed = Number(c.attrs.missed) || 0;
  const covered = Number(c.attrs.covered) || 0;
  return { covered, total: missed + covered };
}

export function parseCoverageXml(xml: string): ParsedCoverage {
  const root = parseXml(xml);
  const top = root.children.find((c) => c.name !== '#text');
  if (!top) throw new Error('Empty coverage report');
  if (local(top.name) === 'report') {
    // JaCoCo: bộ đếm TRỰC TIẾP dưới <report> là tổng cả báo cáo.
    const lines = counter(top, 'LINE');
    const branches = counter(top, 'BRANCH');
    const modules: CoverageModule[] = top.children.filter((c) => local(c.name) === 'package').map((p) => {
      const l = counter(p, 'LINE') ?? { covered: 0, total: 0 };
      return { name: p.attrs.name?.replace(/\//g, '.') || '(default)', linePct: pct(l.covered, l.total), lines: l };
    });
    return { format: 'JACOCO', linePct: lines ? pct(lines.covered, lines.total) : null, branchPct: branches ? pct(branches.covered, branches.total) : null, lines, branches, modules: sortModules(modules) };
  }
  if (local(top.name) === 'coverage') {
    // Cobertura: line-rate/branch-rate (0..1) + lines-covered/lines-valid khi có.
    const rate = (v: string | undefined) => (v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Math.round(Number(v) * 10000) / 100 : null);
    const lc = Number(top.attrs['lines-covered']);
    const lv = Number(top.attrs['lines-valid']);
    const bc = Number(top.attrs['branches-covered']);
    const bv = Number(top.attrs['branches-valid']);
    const modules: CoverageModule[] = [...walk(top)].filter((e) => local(e.name) === 'package').map((p) => ({ name: p.attrs.name || '(default)', linePct: rate(p.attrs['line-rate']), lines: { covered: 0, total: 0 } }));
    return {
      format: 'COBERTURA', linePct: rate(top.attrs['line-rate']), branchPct: rate(top.attrs['branch-rate']),
      lines: Number.isFinite(lc) && Number.isFinite(lv) && lv > 0 ? { covered: lc, total: lv } : null,
      branches: Number.isFinite(bc) && Number.isFinite(bv) && bv > 0 ? { covered: bc, total: bv } : null,
      modules: sortModules(modules),
    };
  }
  throw new Error('Unrecognised coverage XML — expected JaCoCo (<report>) or Cobertura (<coverage>)');
}

export function parseCoverage(raw: string, format?: CoverageFormat | 'AUTO'): ParsedCoverage {
  const t = raw.trimStart();
  const f = !format || format === 'AUTO'
    ? t.startsWith('<') ? null : t.startsWith('{') ? 'ISTANBUL' : 'LCOV'
    : format;
  if (f === 'LCOV') return parseLcov(raw);
  if (f === 'ISTANBUL') {
    let j: { total?: { lines?: { total?: number; covered?: number; pct?: number }; branches?: { total?: number; covered?: number; pct?: number } } };
    try { j = JSON.parse(raw); } catch { throw new Error('The coverage summary is not valid JSON'); }
    const l = j.total?.lines;
    const b = j.total?.branches;
    if (!l) throw new Error('Expected an Istanbul coverage-summary.json ("total.lines")');
    return {
      format: 'ISTANBUL',
      linePct: typeof l.pct === 'number' ? l.pct : pct(l.covered ?? 0, l.total ?? 0),
      branchPct: b ? (typeof b.pct === 'number' ? b.pct : pct(b.covered ?? 0, b.total ?? 0)) : null,
      lines: l.total ? { covered: l.covered ?? 0, total: l.total } : null,
      branches: b?.total ? { covered: b.covered ?? 0, total: b.total } : null,
      modules: [],
    };
  }
  const cov = parseCoverageXml(raw);
  if (f && f !== cov.format) throw new Error(`Expected a ${f} report, got ${cov.format}`);
  return cov;
}
