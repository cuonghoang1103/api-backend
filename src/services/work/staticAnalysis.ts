/**
 * CT Work đợt 8c (12/10/2026) — TST-2 phần còn lại: T3 PHÂN TÍCH TĨNH (SARIF) và T4 ĐỘ PHỨC TẠP V(G) — phần THUẦN (không DB),
 * test ở ctw8c.test.ts. Phần có DB ở staticAnalysis.service.ts.
 *
 *   SARIF 2.1.0 (chuẩn OASIS) — đọc được ESLint (`@microsoft/eslint-formatter-sarif`), Semgrep, CodeQL, SpotBugs, PMD
 *   (`-f sarif`), SonarQube (sonar-sarif / sonarqube export), Checkstyle (qua chuyển đổi). Mỗi kết quả ⇒ một phát hiện,
 *   CHỐNG TRÙNG bằng dấu vân tay: `partialFingerprints` của công cụ nếu có, nếu không thì công cụ + rule + tệp + lời nhắn
 *   đã bỏ số (dòng code xê dịch không sinh phát hiện mới).
 *
 *   V(G) (McCabe 1976) — KHÔNG tự phân tích mã nguồn; đọc từ báo cáo có sẵn:
 *     · JaCoCo XML: counter COMPLEXITY của từng <method> (missed + covered = V(G)) — đúng báo cáo Lab 2.5 dùng.
 *     · lizard `--csv`: cột CCN.
 *     · SARIF: rule complexity của ESLint ("has a complexity of 12") / PMD CyclomaticComplexity ("cyclomatic complexity of 12").
 *   Máy tính V(G) = E − N + 2P (đồ thị luồng điều khiển) và = số điểm quyết định + 1 (câu PE 2 của SWT301).
 */

import crypto from 'node:crypto';
import { parseXml } from './testResults.js';

export const SARIF_MAX_RESULTS = 5000;
export const LEVELS = ['error', 'warning', 'note'] as const;
export type Level = (typeof LEVELS)[number];

export interface Finding {
  tool: string; ruleId: string; level: Level; message: string; file: string | null; line: number | null;
  helpUri: string | null; fingerprint: string;
}
export interface ComplexityUnit { name: string; file: string | null; line: number | null; vg: number; source: 'JACOCO' | 'LIZARD' | 'SARIF' }
export interface ParsedStatic { kind: 'SARIF' | 'JACOCO' | 'LIZARD'; tools: string[]; findings: Finding[]; complexity: ComplexityUnit[] }

const clip = (s: unknown, n: number) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const sha = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

/** Chuẩn hoá đường dẫn: bỏ file://, %20, tiền tố thư mục CI (/home/runner/work/x/x/, D:\a\x\x\) để cùng tệp khớp nhau. */
export function normPath(uri: string | null | undefined): string | null {
  if (!uri) return null;
  let p = String(uri).trim();
  try { p = decodeURIComponent(p); } catch { /* giữ nguyên */ }
  p = p.replace(/^file:\/+/i, '/').replace(/\\/g, '/');
  p = p.replace(/^\/?(home\/runner\/work|github\/workspace|builds|workspace|[a-z]:\/a)\/[^/]+(\/[^/]+)?\//i, '');
  p = p.replace(/^\.\//, '').replace(/^\/+/, '');
  return p.slice(0, 500) || null;
}

/** Lời nhắn bỏ số + khoảng trắng — để dòng/cột trong câu không làm phát hiện "mới". */
const msgKey = (m: string) => m.toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ').trim().slice(0, 300);

export function fingerprintOf(f: { tool: string; ruleId: string; file: string | null; message: string }, toolFp?: string | null): string {
  if (toolFp) return sha(`${f.tool}|${f.ruleId}|${f.file ?? ''}|fp:${toolFp}`);
  return sha(`${f.tool}|${f.ruleId}|${f.file ?? ''}|${msgKey(f.message)}`);
}

const levelOf = (v: unknown): Level | null => (v === 'error' || v === 'warning' || v === 'note' ? v : v === 'none' ? 'note' : null);

/** Đọc V(G) từ lời nhắn rule complexity (ESLint / PMD / Checkstyle). */
export function complexityFromMessage(ruleId: string, message: string): { name: string; vg: number } | null {
  if (!/complexity/i.test(ruleId) || /cognitive/i.test(ruleId)) return null;
  const m = /(?:cyclomatic\s+)?complexity\s+(?:of|is)\s+(\d+)/i.exec(message);
  if (!m) return null;
  const name = /['"`]([^'"`]{1,200})['"`]/.exec(message)?.[1] ?? 'anonymous';
  return { name: name.replace(/\(\)$/, ''), vg: Number(m[1]) };
}

export function parseSarif(raw: string | object): ParsedStatic {
  let doc: unknown = raw;
  if (typeof raw === 'string') {
    try { doc = JSON.parse(raw); } catch { throw new Error('The SARIF report is not valid JSON'); }
  }
  const runs = (doc as { runs?: unknown[] })?.runs;
  if (!Array.isArray(runs)) throw new Error('Not a SARIF report (no "runs")');
  const findings: Finding[] = [];
  const complexity: ComplexityUnit[] = [];
  const tools = new Set<string>();
  for (const run of runs as Array<Record<string, any>>) {
    const driver = run?.tool?.driver ?? {};
    const tool = clip(driver.name || 'SARIF', 80) || 'SARIF';
    tools.add(tool);
    const rules = new Map<string, { level: Level | null; helpUri: string | null; short: string }>();
    const ruleList: Array<Record<string, any>> = [...(Array.isArray(driver.rules) ? driver.rules : []), ...((Array.isArray(run?.tool?.extensions) ? run.tool.extensions : []) as Array<Record<string, any>>).flatMap((e) => (Array.isArray(e?.rules) ? e.rules : []))];
    ruleList.forEach((r, i) => {
      const v = { level: levelOf(r?.defaultConfiguration?.level), helpUri: typeof r?.helpUri === 'string' ? r.helpUri.slice(0, 500) : null, short: clip(r?.shortDescription?.text ?? r?.name, 300) };
      if (r?.id) rules.set(String(r.id), v);
      rules.set(`#${i}`, v);
    });
    for (const res of (Array.isArray(run?.results) ? run.results : []) as Array<Record<string, any>>) {
      if (findings.length >= SARIF_MAX_RESULTS) break;
      if (res?.suppressions?.length || res?.baselineState === 'absent') continue; // đã được tắt trong mã / đã biến mất
      const ruleId = clip(res?.ruleId ?? res?.rule?.id ?? (typeof res?.ruleIndex === 'number' ? `rule#${res.ruleIndex}` : 'unknown'), 200);
      const rule = rules.get(ruleId) ?? (typeof res?.ruleIndex === 'number' ? rules.get(`#${res.ruleIndex}`) : undefined);
      const level = levelOf(res?.level) ?? rule?.level ?? 'warning';
      const message = clip(res?.message?.text ?? res?.message?.markdown ?? rule?.short ?? ruleId, 2000) || ruleId;
      const loc = res?.locations?.[0]?.physicalLocation;
      const file = normPath(loc?.artifactLocation?.uri);
      const lineN = Number(loc?.region?.startLine);
      const line = Number.isInteger(lineN) && lineN > 0 ? lineN : null;
      const pf = res?.partialFingerprints && typeof res.partialFingerprints === 'object' ? Object.values(res.partialFingerprints as Record<string, unknown>).find((x) => typeof x === 'string') as string | undefined : undefined;
      const cx = complexityFromMessage(ruleId, message);
      if (cx) complexity.push({ name: cx.name, file, line, vg: cx.vg, source: 'SARIF' });
      findings.push({ tool, ruleId, level, message, file, line, helpUri: rule?.helpUri ?? null, fingerprint: fingerprintOf({ tool, ruleId, file, message }, pf ?? null) });
    }
  }
  return { kind: 'SARIF', tools: [...tools], findings, complexity };
}

/** JaCoCo XML: mỗi <method> có <counter type="COMPLEXITY" missed covered> ⇒ V(G) = missed + covered. */
export function parseJacocoComplexity(xml: string): ParsedStatic {
  const root = parseXml(xml);
  const report = root.children.find((c) => c.name === 'report');
  if (!report) throw new Error('Not a JaCoCo XML report');
  const units: ComplexityUnit[] = [];
  for (const pkg of report.children.filter((c) => c.name === 'package')) {
    for (const cls of pkg.children.filter((c) => c.name === 'class')) {
      const clsName = (cls.attrs.name ?? '').split('/').pop() ?? '';
      const src = cls.attrs.sourcefilename ? `${pkg.attrs.name ? `${pkg.attrs.name}/` : ''}${cls.attrs.sourcefilename}` : null;
      for (const m of cls.children.filter((c) => c.name === 'method')) {
        const cnt = m.children.find((c) => c.name === 'counter' && c.attrs.type === 'COMPLEXITY');
        if (!cnt) continue;
        const vg = Number(cnt.attrs.missed ?? 0) + Number(cnt.attrs.covered ?? 0);
        if (!Number.isFinite(vg) || vg < 1) continue;
        const name = m.attrs.name === '<init>' ? `${clsName}()` : m.attrs.name === '<clinit>' ? `${clsName} static init` : `${clsName}.${m.attrs.name}`;
        const line = Number(m.attrs.line);
        units.push({ name: name.slice(0, 300), file: normPath(src), line: Number.isInteger(line) && line > 0 ? line : null, vg, source: 'JACOCO' });
        if (units.length >= SARIF_MAX_RESULTS) return { kind: 'JACOCO', tools: ['JaCoCo'], findings: [], complexity: units };
      }
    }
  }
  return { kind: 'JACOCO', tools: ['JaCoCo'], findings: [], complexity: units };
}

/** CSV một dòng (ngoặc kép + dấu phẩy trong ngoặc). */
function csvRow(line: string): string[] {
  const out: string[] = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}

/** lizard --csv: NLOC,CCN,token,PARAM,length,location,file,function,long_name,start,end (có hoặc không dòng tiêu đề). */
export function parseLizardCsv(text: string): ParsedStatic {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) throw new Error('The lizard CSV is empty');
  let head = csvRow(lines[0]).map((h) => h.toLowerCase());
  let body = lines.slice(1);
  if (!head.includes('ccn')) { head = ['nloc', 'ccn', 'token', 'param', 'length', 'location', 'file', 'function', 'long_name', 'start', 'end']; body = lines; }
  const ix = (k: string) => head.indexOf(k);
  const units: ComplexityUnit[] = [];
  for (const l of body.slice(0, SARIF_MAX_RESULTS)) {
    const c = csvRow(l);
    const vg = Number(c[ix('ccn')]);
    if (!Number.isInteger(vg) || vg < 1) continue;
    const start = Number(c[ix('start')]);
    units.push({ name: (c[ix('function')] || c[ix('long_name')] || 'anonymous').slice(0, 300), file: normPath(c[ix('file')]), line: Number.isInteger(start) && start > 0 ? start : null, vg, source: 'LIZARD' });
  }
  if (!units.length) throw new Error('No functions with a CCN column were found — export with "lizard --csv"');
  return { kind: 'LIZARD', tools: ['lizard'], findings: [], complexity: units };
}

export type StaticKind = 'SARIF' | 'JACOCO' | 'LIZARD';
export function detectStatic(raw: string): StaticKind {
  const t = raw.trimStart();
  if (t.startsWith('{')) return 'SARIF';
  if (t.startsWith('<')) return 'JACOCO';
  return 'LIZARD';
}
export function parseStatic(raw: string | object, kind?: StaticKind | 'AUTO'): ParsedStatic {
  if (typeof raw === 'object') return parseSarif(raw);
  const k = !kind || kind === 'AUTO' ? detectStatic(raw) : kind;
  return k === 'SARIF' ? parseSarif(raw) : k === 'JACOCO' ? parseJacocoComplexity(raw) : parseLizardCsv(raw);
}

/** Khoá của một đơn vị (tệp + tên) — một dòng mỗi hàm, lần nhập sau ghi đè. */
export const unitKey = (u: Pick<ComplexityUnit, 'file' | 'name'>) => sha(`${u.file ?? ''}|${u.name}`);

// ─── Máy tính V(G) + phân loại ───────────────────────────────────

/** V(G) = E − N + 2P (McCabe). Ném lỗi khi đầu vào vô nghĩa. */
export function cyclomatic(edges: number, nodes: number, components = 1): number {
  if (![edges, nodes, components].every((x) => Number.isInteger(x) && x >= 0) || nodes < 1 || components < 1) throw new Error('Edges, nodes and components must be whole numbers (nodes ≥ 1)');
  const v = edges - nodes + 2 * components;
  if (v < 1) throw new Error('V(G) must be at least 1 — check the edge and node counts');
  return v;
}
/** V(G) = số điểm quyết định (if, while, for, case, &&, ||, ?:) + 1. */
export const cyclomaticFromDecisions = (decisions: number) => Math.max(0, Math.floor(decisions)) + 1;

/** Phân loại rủi ro theo SEI: 1–10 đơn giản · 11–20 vừa · 21–50 phức tạp · >50 không kiểm thử nổi. */
export function complexityRisk(vg: number): 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' {
  return vg <= 10 ? 'LOW' : vg <= 20 ? 'MODERATE' : vg <= 50 ? 'HIGH' : 'VERY_HIGH';
}

/** Tóm tắt cho trang: số hàm, trung bình, số hàm > 10, tổng số đường cơ sở (= số test tối thiểu cho phủ đường cơ sở). */
export function complexitySummary(units: Array<{ vg: number }>) {
  const n = units.length;
  const total = units.reduce((a, u) => a + u.vg, 0);
  return {
    units: n, average: n ? Math.round((total / n) * 10) / 10 : null, max: n ? Math.max(...units.map((u) => u.vg)) : null,
    over10: units.filter((u) => u.vg > 10).length, basisPaths: total,
    byRisk: { LOW: 0, MODERATE: 0, HIGH: 0, VERY_HIGH: 0, ...Object.fromEntries((['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'] as const).map((r) => [r, units.filter((u) => complexityRisk(u.vg) === r).length])) },
  };
}

/** Phát hiện của các công cụ trong lần nhập này mà lần nhập không còn thấy ⇒ coi như đã sửa. */
export function fixedFingerprints(openOfTools: Array<{ fingerprint: string }>, seen: Set<string>): string[] {
  return openOfTools.filter((f) => !seen.has(f.fingerprint)).map((f) => f.fingerprint);
}
