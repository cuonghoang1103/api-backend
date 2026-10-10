/**
 * CT Work đợt 6 — B2: KỸ THUẬT THIẾT KẾ TEST CÓ CÔNG CỤ (hàm thuần, không DB).
 *
 *   - EP + BVA  (ISTQB 4.2.1–4.2.2): nhập miền giá trị từng trường ⇒ lớp tương đương hợp lệ/không hợp lệ + giá trị biên
 *     (2 điểm hoặc 3 điểm) ⇒ case theo luật "một lớp không hợp lệ mỗi case" (weak normal + robust).
 *   - Bảng quyết định (4.2.3): điều kiện/hành động ⇒ đủ 2^n luật (tối đa 10 điều kiện), gộp luật cùng hành động khác
 *     đúng một điều kiện thành "–" (bảng rút gọn), mỗi luật một case.
 *   - Chuyển trạng thái (4.2.4): máy trạng thái ⇒ bảng trạng thái + case phủ MỌI cạnh (0-switch): đường ngắn nhất từ
 *     trạng thái đầu tới cạnh đó rồi đi cạnh; tuỳ chọn thêm case cạnh KHÔNG hợp lệ (cặp trạng thái × sự kiện không có).
 *   - Pairwise (all-pairs, IPOG): mọi cặp giá trị của mọi hai tham số xuất hiện ít nhất một lần.
 *
 * Mọi case ra cùng một dạng `DesignCase` để đổ được vào Xray (test case + bước) hoặc ma trận 5.1 (UTCID × điều kiện).
 * Loại case theo mẫu FPT 5.1: N = Normal, A = Abnormal, B = Boundary.
 */

import { z } from 'zod';

export const TECHNIQUES = ['EP_BVA', 'DECISION_TABLE', 'STATE_TRANSITION', 'PAIRWISE'] as const;
export type Technique = (typeof TECHNIQUES)[number];
export const TECHNIQUE_SHORT: Record<Technique, string> = { EP_BVA: 'EP/BVA', DECISION_TABLE: 'DT', STATE_TRANSITION: 'ST', PAIRWISE: 'PAIRWISE' };

export interface DesignCase {
  id: string;
  title: string;
  /** tên trường/điều kiện/tham số ⇒ giá trị (chữ) */
  inputs: Record<string, string>;
  /** kết quả mong đợi (chữ người đọc) */
  expected: string;
  type: 'N' | 'A' | 'B';
  /** bước thao tác (state transition) — các kỹ thuật khác để trống, khi đổ vào Xray sinh 1 bước */
  steps?: Array<{ action: string; expected: string }>;
  tags: string[];
}

export interface DesignResult {
  cases: DesignCase[];
  /** bảng phụ để hiển thị: lớp tương đương / bảng quyết định / bảng trạng thái / số cặp phủ */
  table: unknown;
  warnings: string[];
  coverage: { label: string; covered: number; total: number };
}

const pad = (n: number) => String(n).padStart(2, '0');

// ─── EP + BVA ────────────────────────────────────────────────────

export const epField = z.object({
  name: z.string().trim().min(1).max(60),
  kind: z.enum(['number', 'length', 'enum']),
  /** number: giá trị; length: độ dài chuỗi */
  min: z.number().finite().nullable().optional(),
  max: z.number().finite().nullable().optional(),
  /** bước (số nguyên = 1, tiền = 0.01…) */
  step: z.number().positive().max(1e6).optional(),
  /** enum: giá trị hợp lệ; invalid: giá trị không hợp lệ đại diện thêm (vd "abc" cho trường số) */
  values: z.array(z.string().max(80)).max(30).optional(),
  invalid: z.array(z.string().max(80)).max(10).optional(),
  required: z.boolean().optional(),
});
export const epInput = z.object({
  fields: z.array(epField).min(1).max(12),
  /** 2 = min-, min, max, max+ · 3 = thêm min+ và max- */
  bva: z.union([z.literal(2), z.literal(3)]).default(2),
  /** kết quả mong đợi khi mọi trường hợp lệ */
  validOutcome: z.string().max(200).default('Accepted'),
});
export type EpInput = z.infer<typeof epInput>;

interface EpClass { field: string; id: string; label: string; valid: boolean; sample: string; boundary: boolean }

const fmt = (n: number, step: number) => {
  const dec = String(step).includes('.') ? String(step).split('.')[1].length : 0;
  return n.toFixed(dec);
};
const strOfLen = (n: number) => (n <= 0 ? '' : 'a'.repeat(Math.min(n, 300)));
const lenLabel = (n: number) => (n <= 0 ? '"" (empty)' : n <= 12 ? `"${'a'.repeat(n)}" (${n} chars)` : `${n} chars`);

/** Lớp tương đương + giá trị biên của MỘT trường. */
export function epClasses(f: z.infer<typeof epField>, bva: 2 | 3): EpClass[] {
  const out: EpClass[] = [];
  const add = (label: string, valid: boolean, sample: string, boundary = false) => out.push({ field: f.name, id: `${f.name}#${out.length + 1}`, label, valid, sample, boundary });
  if (f.kind === 'enum') {
    for (const v of f.values ?? []) add(`= ${v}`, true, v);
    for (const v of f.invalid?.length ? f.invalid : ['<value not in list>']) add(`∉ {${(f.values ?? []).join(', ')}}`, false, v);
  } else {
    const step = f.step ?? 1;
    const min = f.min ?? null, max = f.max ?? null;
    const show = (n: number) => (f.kind === 'length' ? lenLabel(n) : fmt(n, step));
    const sample = (n: number) => (f.kind === 'length' ? strOfLen(n) : fmt(n, step));
    // Lớp hợp lệ (giá trị giữa) + hai lớp không hợp lệ (dưới min, trên max).
    const mid = min != null && max != null ? Math.round(((min + max) / 2) / step) * step : min != null ? min + step * 5 : max != null ? max - step * 5 : 0;
    add(`${min != null ? `${show(min)} ≤ ` : ''}${f.name}${max != null ? ` ≤ ${show(max)}` : ''} (valid partition)`, true, sample(f.kind === 'length' ? Math.max(0, mid) : mid));
    if (min != null && !(f.kind === 'length' && min <= 0)) add(`< ${show(min)} (invalid partition)`, false, sample(min - step * (f.kind === 'length' ? 1 : 5)));
    if (max != null) add(`> ${show(max)} (invalid partition)`, false, sample(max + step * (f.kind === 'length' ? 1 : 5)));
    // Biên.
    if (min != null) {
      if (!(f.kind === 'length' && min <= 0)) add(`min − ${step} = ${show(min - step)}`, false, sample(min - step), true);
      add(`min = ${show(min)}`, true, sample(min), true);
      if (bva === 3) add(`min + ${step} = ${show(min + step)}`, true, sample(min + step), true);
    }
    if (max != null) {
      if (bva === 3) add(`max − ${step} = ${show(max - step)}`, true, sample(max - step), true);
      add(`max = ${show(max)}`, true, sample(max), true);
      add(`max + ${step} = ${show(max + step)}`, false, sample(max + step), true);
    }
    for (const v of f.invalid ?? []) add(`invalid value "${v}"`, false, v);
  }
  if (f.required) add('empty / missing', false, '');
  // Bỏ trùng mẫu (biên trùng giá trị giữa khi miền hẹp).
  const seen = new Set<string>();
  return out.filter((c) => { const k = `${c.valid}|${c.sample}|${c.boundary}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

export function generateEpBva(raw: unknown): DesignResult {
  const input = epInput.parse(raw);
  const warnings: string[] = [];
  const all = input.fields.map((f) => {
    if (f.kind !== 'enum' && f.min != null && f.max != null && f.min > f.max) throw new Error(`${f.name}: min is greater than max`);
    if (f.kind === 'enum' && !(f.values ?? []).length) throw new Error(`${f.name}: list at least one valid value`);
    if (f.kind !== 'enum' && f.min == null && f.max == null) warnings.push(`${f.name}: no min/max — only one valid partition`);
    return { f, classes: epClasses(f, input.bva) };
  });
  // Giá trị "danh nghĩa" hợp lệ của từng trường (lớp hợp lệ đầu tiên, không phải biên).
  const nominal = Object.fromEntries(all.map(({ f, classes }) => [f.name, (classes.find((c) => c.valid && !c.boundary) ?? classes.find((c) => c.valid))?.sample ?? '']));
  const nominalLabel = (name: string) => all.find((x) => x.f.name === name)!.classes.find((c) => c.valid && !c.boundary)?.label ?? 'valid';
  const cases: DesignCase[] = [];
  const push = (title: string, inputs: Record<string, string>, expected: string, type: DesignCase['type'], tags: string[]) =>
    cases.push({ id: `TC-${pad(cases.length + 1)}`, title, inputs, expected, type, tags });

  // 1) Một case "mọi trường hợp lệ" (phủ mọi lớp hợp lệ danh nghĩa).
  push('All fields valid', { ...nominal }, input.validOutcome, 'N', ['EP']);
  // 2) Lớp hợp lệ còn lại (enum nhiều giá trị) — mỗi lớp một case, các trường khác danh nghĩa.
  for (const { f, classes } of all) {
    for (const c of classes.filter((x) => x.valid && !x.boundary).slice(1)) push(`${f.name} ${c.label}`, { ...nominal, [f.name]: c.sample }, input.validOutcome, 'N', ['EP']);
  }
  // 3) Biên (hợp lệ + không hợp lệ), 4) lớp không hợp lệ — MỘT lớp không hợp lệ mỗi case (không che lỗi nhau).
  for (const { f, classes } of all) {
    for (const c of classes.filter((x) => x.boundary)) {
      push(`${f.name} boundary ${c.label}`, { ...nominal, [f.name]: c.sample }, c.valid ? input.validOutcome : `Rejected: ${f.name} out of range`, 'B', ['BVA']);
    }
  }
  for (const { f, classes } of all) {
    for (const c of classes.filter((x) => !x.valid && !x.boundary)) {
      push(`${f.name} ${c.label}`, { ...nominal, [f.name]: c.sample }, `Rejected: ${f.name} ${c.label.replace(/\s*\(invalid partition\)/, '')} is not allowed`, 'A', ['EP']);
    }
  }
  const total = all.reduce((n, x) => n + x.classes.length, 0);
  return {
    cases,
    table: all.map(({ f, classes }) => ({ field: f.name, nominal: nominalLabel(f.name), classes: classes.map((c) => ({ label: c.label, valid: c.valid, boundary: c.boundary, sample: c.sample.length > 40 ? `${c.sample.slice(0, 37)}…` : c.sample })) })),
    warnings,
    coverage: { label: 'partitions + boundaries', covered: total, total },
  };
}

// ─── Bảng quyết định ─────────────────────────────────────────────

export const dtInput = z.object({
  conditions: z.array(z.string().trim().min(1).max(120)).min(1).max(10),
  actions: z.array(z.string().trim().min(1).max(120)).min(1).max(15),
  /** Luật đã điền tay: khoá = chuỗi T/F theo thứ tự điều kiện (vd "TFT") ⇒ chỉ số hành động thực hiện. Thiếu ⇒ để trống. */
  outcomes: z.record(z.string().regex(/^[TF]+$/), z.array(z.number().int().min(0))).default({}),
  /** "–" gộp các luật cùng hành động khác đúng một điều kiện */
  collapse: z.boolean().default(true),
  /** luật không thể xảy ra (vd hai điều kiện loại trừ nhau) ⇒ bỏ */
  impossible: z.array(z.string().regex(/^[TF]+$/)).default([]),
});
export type DtInput = z.infer<typeof dtInput>;

export interface DtRule { id: string; conditions: Array<'T' | 'F' | '-'>; actions: number[]; combos: string[] }

export function decisionRules(input: DtInput): { full: DtRule[]; rules: DtRule[] } {
  const n = input.conditions.length;
  const impossible = new Set(input.impossible);
  const full: DtRule[] = [];
  for (let i = 0; i < 2 ** n; i++) {
    // Thứ tự quen thuộc trong giáo trình: luật 1 = toàn T, rồi đếm dần như số nhị phân (T=0, F=1).
    const key = Array.from({ length: n }, (_, b) => ((i >> (n - 1 - b)) & 1 ? 'F' : 'T')).join('');
    if (impossible.has(key)) continue;
    full.push({ id: `R${full.length + 1}`, conditions: key.split('') as Array<'T' | 'F'>, actions: [...new Set(input.outcomes[key] ?? [])].filter((a) => a < input.actions.length).sort((a, b) => a - b), combos: [key] });
  }
  if (!input.collapse) return { full, rules: full };
  // Gộp lặp: hai luật cùng hành động, khác đúng một vị trí (không vị trí nào '-' lệch) ⇒ một luật với '-'.
  let rules = full.map((r) => ({ ...r, conditions: [...r.conditions], combos: [...r.combos] }));
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let a = 0; a < rules.length; a++) {
      for (let b = a + 1; b < rules.length; b++) {
        const A = rules[a], B = rules[b];
        if (A.actions.join(',') !== B.actions.join(',') || !A.actions.length) continue;
        const diff = A.conditions.flatMap((c, k) => (c !== B.conditions[k] ? [k] : []));
        if (diff.length !== 1 || A.conditions[diff[0]] === '-' || B.conditions[diff[0]] === '-') continue;
        const cond = [...A.conditions]; cond[diff[0]] = '-';
        rules.splice(b, 1);
        rules[a] = { id: A.id, conditions: cond, actions: A.actions, combos: [...A.combos, ...B.combos].sort() };
        merged = true;
        break outer;
      }
    }
  }
  rules = rules.map((r, i) => ({ ...r, id: `R${i + 1}` }));
  return { full, rules };
}

export function generateDecisionTable(raw: unknown): DesignResult {
  const input = dtInput.parse(raw);
  const { full, rules } = decisionRules(input);
  const warnings: string[] = [];
  const empty = full.filter((r) => !r.actions.length).length;
  if (empty) warnings.push(`${empty} rule(s) have no action yet — tick the actions for each rule`);
  const cases: DesignCase[] = rules.map((r, i) => ({
    id: `TC-${pad(i + 1)}`,
    title: `Rule ${r.id}: ${r.conditions.map((c, k) => (c === '-' ? null : `${input.conditions[k]} = ${c === 'T' ? 'Yes' : 'No'}`)).filter(Boolean).join(', ')}`.slice(0, 250),
    inputs: Object.fromEntries(input.conditions.map((c, k) => [c, r.conditions[k] === '-' ? 'any' : r.conditions[k] === 'T' ? 'Yes' : 'No'])),
    expected: r.actions.length ? r.actions.map((a) => input.actions[a]).join('; ') : '(no action)',
    type: r.actions.length ? (r.conditions.every((c) => c !== 'F') ? 'N' : 'A') : 'A',
    tags: ['DT'],
  }));
  return {
    cases,
    table: { conditions: input.conditions, actions: input.actions, full: full.map((r) => ({ id: r.id, key: r.combos[0], conditions: r.conditions, actions: r.actions })), rules },
    warnings,
    coverage: { label: 'rules', covered: rules.reduce((n, r) => n + r.combos.length, 0), total: full.length },
  };
}

// ─── Chuyển trạng thái ───────────────────────────────────────────

export const stInput = z.object({
  states: z.array(z.string().trim().min(1).max(60)).min(2).max(30),
  initial: z.string().trim().min(1).max(60),
  transitions: z.array(z.object({
    from: z.string().trim().min(1).max(60),
    event: z.string().trim().min(1).max(80),
    to: z.string().trim().min(1).max(60),
    guard: z.string().max(120).nullable().optional(),
    action: z.string().max(160).nullable().optional(),
  })).min(1).max(120),
  /** thêm case cho cặp (trạng thái, sự kiện) KHÔNG có cạnh — hệ thống phải từ chối/giữ nguyên */
  invalid: z.boolean().default(false),
});
export type StInput = z.infer<typeof stInput>;

export function generateStateTransition(raw: unknown): DesignResult {
  const input = stInput.parse(raw);
  const states = [...new Set(input.states)];
  const has = new Set(states);
  if (!has.has(input.initial)) throw new Error(`Initial state "${input.initial}" is not in the state list`);
  for (const t of input.transitions) {
    if (!has.has(t.from)) throw new Error(`Transition from unknown state "${t.from}"`);
    if (!has.has(t.to)) throw new Error(`Transition to unknown state "${t.to}"`);
  }
  // Đường ngắn nhất (BFS) từ trạng thái đầu tới mọi trạng thái — danh sách cạnh.
  const prev = new Map<string, number | null>([[input.initial, null]]);
  const queue = [input.initial];
  while (queue.length) {
    const s = queue.shift()!;
    input.transitions.forEach((t, i) => { if (t.from === s && !prev.has(t.to)) { prev.set(t.to, i); queue.push(t.to); } });
  }
  const pathTo = (s: string): number[] => { const p: number[] = []; let cur = s; while (prev.get(cur) != null) { const i = prev.get(cur)!; p.unshift(i); cur = input.transitions[i].from; } return p; };
  const label = (t: StInput['transitions'][number]) => `${t.event}${t.guard ? ` [${t.guard}]` : ''}`;
  const warnings: string[] = [];
  const unreachable = states.filter((s) => !prev.has(s));
  if (unreachable.length) warnings.push(`Unreachable from ${input.initial}: ${unreachable.join(', ')} — their transitions cannot be tested from the start state`);
  const cases: DesignCase[] = [];
  let covered = 0;
  input.transitions.forEach((t, i) => {
    if (!prev.has(t.from)) return;
    covered++;
    const route = [...pathTo(t.from), i];
    const steps = route.map((k) => { const e = input.transitions[k]; return { action: `In ${e.from}: ${label(e)}`, expected: `State is ${e.to}${e.action ? `; ${e.action}` : ''}` }; });
    cases.push({
      id: `TC-${pad(cases.length + 1)}`, title: `${t.from} —${label(t)}→ ${t.to}`.slice(0, 250),
      inputs: { start: input.initial, path: route.map((k) => input.transitions[k].event).join(' → ') },
      expected: `State is ${t.to}${t.action ? `; ${t.action}` : ''}`, type: 'N', steps, tags: ['ST', '0-switch'],
    });
  });
  const events = [...new Set(input.transitions.map((t) => t.event))];
  const table = states.map((s) => ({ state: s, cells: events.map((e) => input.transitions.filter((t) => t.from === s && t.event === e).map((t) => `${t.to}${t.guard ? ` [${t.guard}]` : ''}`).join(' / ') || null) }));
  if (input.invalid) {
    for (const s of states.filter((x) => prev.has(x))) {
      for (const e of events) {
        if (input.transitions.some((t) => t.from === s && t.event === e)) continue;
        const route = pathTo(s);
        cases.push({
          id: `TC-${pad(cases.length + 1)}`, title: `Invalid: ${e} in ${s}`.slice(0, 250),
          inputs: { start: input.initial, path: [...route.map((k) => input.transitions[k].event), e].join(' → ') },
          expected: `Event rejected; state stays ${s}`, type: 'A',
          steps: [...route.map((k) => { const t = input.transitions[k]; return { action: `In ${t.from}: ${label(t)}`, expected: `State is ${t.to}` }; }), { action: `In ${s}: ${e}`, expected: `Rejected; state stays ${s}` }],
          tags: ['ST', 'invalid'],
        });
      }
    }
  }
  return { cases, table: { events, rows: table }, warnings, coverage: { label: 'transitions (0-switch)', covered, total: input.transitions.length } };
}

// ─── Pairwise (IPOG) ─────────────────────────────────────────────

export const pwInput = z.object({
  parameters: z.array(z.object({ name: z.string().trim().min(1).max(60), values: z.array(z.string().trim().min(1).max(80)).min(1).max(20) })).min(2).max(15),
  expected: z.string().max(200).default('Works as specified'),
});
export type PwInput = z.infer<typeof pwInput>;

/** All-pairs theo IPOG: thêm dần từng tham số — mở ngang (gán giá trị cho dòng có sẵn) rồi mở dọc (thêm dòng cho cặp còn thiếu). */
export function allPairs(sizes: number[]): number[][] {
  if (sizes.length < 2) return (sizes[0] ? Array.from({ length: sizes[0] }, (_, i) => [i]) : []);
  let rows: Array<Array<number | null>> = [];
  for (let a = 0; a < sizes[0]; a++) for (let b = 0; b < sizes[1]; b++) rows.push([a, b]);
  for (let k = 2; k < sizes.length; k++) {
    // Cặp cần phủ: (tham số j < k, giá trị vj) × (k, vk).
    const need = new Set<string>();
    for (let j = 0; j < k; j++) for (let vj = 0; vj < sizes[j]; vj++) for (let vk = 0; vk < sizes[k]; vk++) need.add(`${j}:${vj}:${vk}`);
    // Mở ngang.
    for (const r of rows) {
      let best = 0, bestGain = -1;
      for (let v = 0; v < sizes[k]; v++) {
        let gain = 0;
        for (let j = 0; j < k; j++) if (r[j] != null && need.has(`${j}:${r[j]}:${v}`)) gain++;
        if (gain > bestGain) { best = v; bestGain = gain; }
      }
      r.push(best);
      for (let j = 0; j < k; j++) if (r[j] != null) need.delete(`${j}:${r[j]}:${best}`);
    }
    // Mở dọc: mỗi cặp còn thiếu ⇒ điền vào dòng có ô trống phù hợp, hoặc thêm dòng mới.
    for (const p of [...need]) {
      if (!need.has(p)) continue;
      const [j, vj, vk] = p.split(':').map(Number);
      let row = rows.find((r) => r[k] === vk && r[j] == null) ?? rows.find((r) => r[j] === vj && r[k] == null);
      if (row) { row[j] = vj; row[k] = vk; } else { row = Array.from({ length: k + 1 }, (_, i) => (i === j ? vj : i === k ? vk : null)); rows.push(row); }
      for (let i = 0; i < k; i++) if (row[i] != null) need.delete(`${i}:${row[i]}:${row[k]}`);
    }
  }
  // Ô còn trống (không ràng buộc cặp nào) ⇒ giá trị 0.
  return rows.map((r) => r.map((v) => v ?? 0));
}

/** Đếm cặp đã phủ (dùng cả trong test để chứng minh đủ). */
export function pairCoverage(sizes: number[], rows: number[][]): { covered: number; total: number } {
  let total = 0, covered = 0;
  for (let a = 0; a < sizes.length; a++) for (let b = a + 1; b < sizes.length; b++) {
    const seen = new Set(rows.map((r) => `${r[a]}:${r[b]}`));
    total += sizes[a] * sizes[b];
    for (let x = 0; x < sizes[a]; x++) for (let y = 0; y < sizes[b]; y++) if (seen.has(`${x}:${y}`)) covered++;
  }
  return { covered, total };
}

export function generatePairwise(raw: unknown): DesignResult {
  const input = pwInput.parse(raw);
  const sizes = input.parameters.map((p) => p.values.length);
  const rows = allPairs(sizes);
  const exhaustive = sizes.reduce((a, b) => a * b, 1);
  const cases: DesignCase[] = rows.map((r, i) => ({
    id: `TC-${pad(i + 1)}`,
    title: input.parameters.map((p, k) => `${p.name}=${p.values[r[k]]}`).join(', ').slice(0, 250),
    inputs: Object.fromEntries(input.parameters.map((p, k) => [p.name, p.values[r[k]]])),
    expected: input.expected, type: 'N', tags: ['PAIRWISE'],
  }));
  const cov = pairCoverage(sizes, rows);
  return { cases, table: { parameters: input.parameters.map((p) => p.name), exhaustive, rows: rows.length, reduction: exhaustive ? Math.round((1 - rows.length / exhaustive) * 100) : 0 }, warnings: [], coverage: { label: 'value pairs', ...cov } };
}

export function generateDesign(technique: Technique, input: unknown): DesignResult {
  switch (technique) {
    case 'EP_BVA': return generateEpBva(input);
    case 'DECISION_TABLE': return generateDecisionTable(input);
    case 'STATE_TRANSITION': return generateStateTransition(input);
    case 'PAIRWISE': return generatePairwise(input);
  }
}

// ─── Đổ case ra Xray / ma trận 5.1 ───────────────────────────────

/** Một case ⇒ test case Xray (tiêu đề + bước). Case không có bước ⇒ một bước "Enter …". */
export function toXray(c: DesignCase, designName: string): { title: string; steps: Array<{ action: string; data: string | null; expected: string | null }>; preconditions: string | null } {
  const data = Object.entries(c.inputs).map(([k, v]) => `${k} = ${v === '' ? '(empty)' : v.length > 60 ? `${v.slice(0, 57)}…` : v}`).join('\n');
  return {
    title: `[${designName}] ${c.id} ${c.title}`.slice(0, 255),
    preconditions: null,
    steps: c.steps?.length
      ? c.steps.map((s) => ({ action: s.action, data: null, expected: s.expected }))
      : [{ action: 'Enter the input values and submit', data, expected: c.expected }],
  };
}

/** Các case ⇒ ma trận 5.1 (Condition = trường/giá trị đầu vào, Confirmation = kết quả mong đợi; dấu O theo case). */
export function toUnitMatrix(cases: DesignCase[]) {
  const rows: Array<{ key: string; section: 'COND' | 'CONFIRM'; groupName: string; label: string | null; value: string | null }> = [];
  const marks: Array<[string, string]> = [];
  const rowKey = new Map<string, string>();
  const ensure = (section: 'COND' | 'CONFIRM', group: string, value: string) => {
    const k = `${section}|${group}|${value}`;
    if (!rowKey.has(k)) {
      const key = `r${rows.length + 1}`;
      rowKey.set(k, key);
      rows.push({ key, section, groupName: group.slice(0, 120), label: null, value: value.slice(0, 4000) });
    }
    return rowKey.get(k)!;
  };
  const unitCases = cases.slice(0, 200).map((c, i) => {
    const ck = `c${i + 1}`;
    for (const [g, v] of Object.entries(c.inputs)) marks.push([ensure('COND', g, v === '' ? '(empty)' : v), ck]);
    marks.push([ensure('CONFIRM', /^Rejected|reject|invalid/i.test(c.expected) ? 'Exception' : 'Return', c.expected), ck]);
    return { key: ck, type: c.type, result: null, executedAt: null, defectId: null, note: `${c.id} ${c.title}`.slice(0, 2000) };
  });
  return { rows: rows.slice(0, 300), cases: unitCases, marks };
}
