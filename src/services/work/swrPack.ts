/**
 * CT Work đợt 8c (12/10/2026) — SWR302 phần còn treo: R13 CÔNG CỤ ƯỚC LƯỢNG BA, R24 BÁO CÁO TRẠNG THÁI YÊU CẦU, R26 TRỌN GÓI
 * 8 DELIVERABLE, R28 STAKEHOLDER DO AI ĐÓNG VAI — phần THUẦN (test ở ctw8c.test.ts). Phần có DB ở swrPack.service.ts và
 * swrElic.service.ts (R28).
 *
 * R13 — chép ĐÚNG mô hình của `Chapter 19/Requirements Estimation Tool.xlsx` (Wiegers & Seilevel 2013, sheet Summary +
 * Assumptions — đã đọc thật 12/10): số đếm đầu vào (tự điền từ dữ liệu dự án, người sửa được) ⇒ số đếm suy ra (hệ số của
 * sheet Assumptions: user story = UC × 4, decision tree = UC × 0,1, DFD = BDD × 3, …) ⇒ phút mỗi đơn vị × số đơn vị ⇒ giờ
 * ⇒ BA theo 3 cách: (A) % ngân sách, (B) tỉ lệ dev/BA (6 chuẩn, 3 COTS), (C) theo hoạt động (+10% nếu nhóm làm từ xa).
 * Với đầu vào mẫu của tệp gốc, ba con số ra đúng 2,14 / 2,67 / 3,10 BA (test khoá con số này).
 */

// ═══ R13 — ước lượng ═══════════════════════════════════════════════

export const EST_COUNT_KEYS = [
  'existingDocPages', 'existingSystems', 'stakeholders', 'interfacesSmall', 'interfacesMedium', 'interfacesLarge',
  'useCases', 'businessDataDiagrams', 'screens', 'reports',
] as const;
export type EstCountKey = (typeof EST_COUNT_KEYS)[number];
export const EST_COUNT_LABEL: Record<EstCountKey, string> = {
  existingDocPages: 'Existing pages of documentation for review', existingSystems: 'Existing systems being updated or replaced',
  stakeholders: 'Stakeholders', interfacesSmall: 'Interfacing Systems - small systems', interfacesMedium: 'Interfacing Systems - medium systems',
  interfacesLarge: 'Interfacing Systems - large systems', useCases: 'Process Flows and/or Use Cases', businessDataDiagrams: 'Business Data Diagrams',
  screens: 'Screens/User interfaces', reports: 'Reports',
};
export type EstCounts = Record<EstCountKey, number>;

export interface EstProject {
  totalBudget: number; baHourlyCost: number; projectType: 'STANDARD' | 'COTS'; developers: number; remote: boolean;
  projectWeeks: number; requirementsWeeks: number;
  /** % ngân sách cho công việc yêu cầu (mặc định 15%, "industry standard" của tệp gốc). */
  budgetPercent: number;
}
export const DEFAULT_PROJECT: EstProject = { totalBudget: 0, baHourlyCost: 0, projectType: 'STANDARD', developers: 0, remote: false, projectWeeks: 10, requirementsWeeks: 4, budgetPercent: 15 };

/** Hệ số suy ra (sheet Assumptions, cột H) — người sửa được. */
export const EST_FACTORS = {
  userStoriesPerUseCase: 4, decisionTreesPerUseCase: 0.1, dfdsPerBdd: 3, dataDictionariesPerBdd: 10, stateTablesPerBdd: 0.5,
  requirementsPerUseCase: 14, businessRulesPerUseCase: 42, tracesPerRequirement: 3, orgCharts: 1, contextDiagrams: 1,
} as const;
export type EstFactors = { -readonly [K in keyof typeof EST_FACTORS]: number };

export interface EstActivity {
  key: string; category: string; label: string;
  /** Phút mỗi đơn vị (cột "Minutes per unit"). */
  minutes: number;
  /** Số đơn vị: 'once' = 1 lần (N/A), 'weeks' = số tuần làm yêu cầu, hoặc hàm của số đếm. */
  units: 'once' | 'weeks' | ((c: EstCounts, f: EstFactors) => number);
  note?: string;
}

const derived = (c: EstCounts, f: EstFactors) => {
  const requirements = c.useCases * f.requirementsPerUseCase;
  return {
    userStories: c.useCases * f.userStoriesPerUseCase,
    decisionTrees: Math.round(c.useCases * f.decisionTreesPerUseCase),
    dfds: c.businessDataDiagrams * f.dfdsPerBdd,
    dataDictionaries: c.businessDataDiagrams * f.dataDictionariesPerBdd,
    stateTables: Math.round(c.businessDataDiagrams * f.stateTablesPerBdd),
    requirements,
    businessRules: c.useCases * f.businessRulesPerUseCase,
    traces: requirements * f.tracesPerRequirement,
  };
};

export const EST_ACTIVITIES: readonly EstActivity[] = [
  { key: 'plans', category: 'Project Start and Management', label: 'Requirements plans', minutes: 420, units: 'once' },
  { key: 'status', category: 'Project Start and Management', label: 'Status reporting', minutes: 255, units: 'weeks', note: 'Uses requirements work duration' },
  { key: 'architecture', category: 'Project Start and Management', label: 'Requirements architecture', minutes: 300, units: 'once' },
  { key: 'repository', category: 'Project Start and Management', label: 'Setup requirements repository', minutes: 570, units: 'once' },
  { key: 'kickoff', category: 'Project Start and Management', label: 'Project kick-off', minutes: 1200, units: 'once' },
  { key: 'features', category: 'Project Start and Management', label: 'Functions/Features organization', minutes: 960, units: 'once' },
  { key: 'traces', category: 'Project Start and Management', label: 'Traceability Links', minutes: 1, units: (c, f) => derived(c, f).traces },
  { key: 'docReview', category: 'Project Start and Management', label: 'Existing documentation review', minutes: 2, units: (c) => c.existingDocPages },
  { key: 'systemsReview', category: 'Project Start and Management', label: 'Existing systems review', minutes: 240, units: (c) => c.existingSystems },
  { key: 'useCases', category: 'Model Requirements - People', label: 'Process Flows and/or Use Cases', minutes: 656, units: (c) => c.useCases },
  { key: 'orgCharts', category: 'Model Requirements - People', label: 'Org Charts', minutes: 654, units: (_c, f) => f.orgCharts },
  { key: 'userStories', category: 'Model Requirements - People', label: 'User Stories', minutes: 216, units: (c, f) => derived(c, f).userStories },
  { key: 'decisionTrees', category: 'Model Requirements - People', label: 'Decision Trees', minutes: 230, units: (c, f) => derived(c, f).decisionTrees },
  { key: 'context', category: 'Model Requirements - System', label: 'System Context Diagrams or Ecosystem Maps', minutes: 750, units: (_c, f) => f.contextDiagrams },
  { key: 'ifSmall', category: 'Model Requirements - System', label: 'System Interface Models - small systems', minutes: 300, units: (c) => c.interfacesSmall },
  { key: 'ifMedium', category: 'Model Requirements - System', label: 'System Interface Models - medium systems', minutes: 1000, units: (c) => c.interfacesMedium },
  { key: 'ifLarge', category: 'Model Requirements - System', label: 'System Interface Models - large systems', minutes: 2400, units: (c) => c.interfacesLarge },
  { key: 'dar', category: 'Model Requirements - System', label: 'Display-Action-Response Tables', minutes: 300, units: (c) => c.screens, note: 'Uses number of screens' },
  { key: 'bdd', category: 'Model Requirements - Data', label: 'Business Data Diagrams', minutes: 210, units: (c) => c.businessDataDiagrams },
  { key: 'dfd', category: 'Model Requirements - Data', label: 'Data Flow Diagrams', minutes: 495, units: (c, f) => derived(c, f).dfds },
  { key: 'dd', category: 'Model Requirements - Data', label: 'Data Dictionaries', minutes: 180, units: (c, f) => derived(c, f).dataDictionaries },
  { key: 'stateTables', category: 'Model Requirements - Data', label: 'State Tables', minutes: 270, units: (c, f) => derived(c, f).stateTables },
  { key: 'stateDiagrams', category: 'Model Requirements - Data', label: 'State Diagrams', minutes: 270, units: (c, f) => derived(c, f).stateTables },
  { key: 'reportTables', category: 'Model Requirements - Data', label: 'Report Tables', minutes: 600, units: (c) => c.reports },
];

export interface EstConfig {
  counts?: Partial<EstCounts>;
  project?: Partial<EstProject>;
  factors?: Partial<EstFactors>;
  /** Phút mỗi đơn vị người sửa (theo khoá hoạt động). */
  minutes?: Record<string, number>;
}

const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : d);

export function estimate(auto: EstCounts, cfg: EstConfig = {}) {
  const counts = Object.fromEntries(EST_COUNT_KEYS.map((k) => [k, num(cfg.counts?.[k], auto[k])])) as EstCounts;
  const project: EstProject = { ...DEFAULT_PROJECT, ...Object.fromEntries(Object.entries(cfg.project ?? {}).filter(([, v]) => v !== undefined && v !== null)) } as EstProject;
  const factors = Object.fromEntries(Object.entries(EST_FACTORS).map(([k, v]) => [k, num(cfg.factors?.[k as keyof EstFactors], v)])) as EstFactors;
  const rows = EST_ACTIVITIES.map((a) => {
    const perUnit = num(cfg.minutes?.[a.key], a.minutes);
    const units = a.units === 'once' ? null : a.units === 'weeks' ? project.requirementsWeeks : a.units(counts, factors);
    const minutes = perUnit * (units ?? 1);
    return { key: a.key, category: a.category, label: a.label, minutesPerUnit: perUnit, units, minutes, hours: minutes / 60, note: a.note ?? null, edited: cfg.minutes?.[a.key] !== undefined };
  });
  const categories = [...new Set(EST_ACTIVITIES.map((a) => a.category))].map((c) => ({ category: c, hours: rows.filter((r) => r.category === c).reduce((s, r) => s + r.hours, 0) }));
  const workHours = rows.reduce((s, r) => s + r.hours, 0);
  const buffer = project.remote ? workHours * 0.1 : 0;
  const hours = workHours + buffer;
  const reqHoursPerBa = project.requirementsWeeks * 40;
  const ratio = project.projectType === 'COTS' ? 3 : 6;
  const safeDiv = (a: number, b: number) => (b > 0 ? a / b : null);
  const scale = project.requirementsWeeks > 0 ? project.projectWeeks / project.requirementsWeeks : null;
  // (C) theo hoạt động
  const cBas = safeDiv(hours, reqHoursPerBa);
  const cReqCost = hours * project.baHourlyCost;
  // (B) tỉ lệ dev/BA
  const bBas = project.developers / ratio;
  const bReqCost = bBas * reqHoursPerBa * project.baHourlyCost;
  const bProjCost = bBas * project.projectWeeks * 40 * project.baHourlyCost;
  // (A) % ngân sách
  const aReqBudget = project.totalBudget * (project.budgetPercent / 100);
  const aBas = project.baHourlyCost > 0 ? safeDiv(aReqBudget / project.baHourlyCost, reqHoursPerBa) : null;
  const derivedCounts = derived(counts, factors);
  return {
    counts, project, factors, derived: derivedCounts, rows, categories,
    totals: { workHours, remoteBuffer: buffer, hours },
    methods: {
      budgetPercent: { bas: aBas, requirementsCost: aReqBudget, projectCost: scale !== null ? aReqBudget * scale : null },
      devRatio: { bas: bBas, ratio, requirementsCost: bReqCost, projectCost: bProjCost },
      activity: { bas: cBas, requirementsCost: cReqCost, projectCost: scale !== null ? cReqCost * scale : null },
    },
  };
}
export type EstimateResult = ReturnType<typeof estimate>;

/** Kiểm "số đếm khớp tài liệu" (liên kết #6): số người sửa khác số tự đếm từ dữ liệu ⇒ cảnh báo. */
export function countMismatches(auto: EstCounts, cfg: EstConfig): Array<{ key: EstCountKey; label: string; entered: number; actual: number }> {
  const out: Array<{ key: EstCountKey; label: string; entered: number; actual: number }> = [];
  for (const k of ['useCases', 'screens', 'reports', 'stakeholders'] as const) {
    const v = cfg.counts?.[k];
    if (typeof v === 'number' && v !== auto[k]) out.push({ key: k, label: EST_COUNT_LABEL[k], entered: v, actual: auto[k] });
  }
  return out;
}

// ═══ R24 — báo cáo trạng thái yêu cầu ═══════════════════════════════

export interface ReqLite { lifecycle: string; reqType: string; createdAt: Date; reqVersion: number; deletedAt?: Date | null }
export interface ReqChange { at: Date; field: string; from: string | null; to: string | null }

const DAY = 86_400_000;
/** Tuần ISO bắt đầu thứ Hai (UTC) — nhãn "YYYY-MM-DD" của thứ Hai. */
export function weekStart(d: Date): string {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x.toISOString().slice(0, 10);
}

/**
 * Wiegers ch.27 §"Measuring requirements management effort" + 7.4 khoá học: số yêu cầu theo trạng thái, độ biến động
 * (thay đổi / tổng số trong kỳ), và công RM (giờ worklog hoạt động Analyzing). `changes` = dòng lịch sử "Requirement …".
 */
export function statusReport(input: { reqs: ReqLite[]; changes: ReqChange[]; effort: Array<{ at: Date; minutes: number; who: string }>; now: Date; days: number; weeks?: number }) {
  const from = new Date(input.now.getTime() - input.days * DAY);
  const live = input.reqs.filter((r) => !r.deletedAt);
  const byLifecycle: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const r of live) { byLifecycle[r.lifecycle] = (byLifecycle[r.lifecycle] ?? 0) + 1; byType[r.reqType] = (byType[r.reqType] ?? 0) + 1; }
  const inWindow = input.changes.filter((c) => c.at >= from);
  const added = live.filter((r) => r.createdAt >= from).length;
  const deleted = input.reqs.filter((r) => r.deletedAt && r.deletedAt >= from).length + inWindow.filter((c) => /lifecycle/i.test(c.field) && /DELETED|REJECTED/.test(c.to ?? '')).length;
  const modified = inWindow.filter((c) => !/lifecycle/i.test(c.field)).length;
  const base = Math.max(1, live.length - added);
  const volatility = Math.round(((added + deleted + modified) / base) * 1000) / 10;
  const effort = input.effort.filter((e) => e.at >= from);
  const byWho = new Map<string, number>();
  for (const e of effort) byWho.set(e.who, (byWho.get(e.who) ?? 0) + e.minutes);
  // Xu hướng theo tuần.
  const weeks = input.weeks ?? 8;
  const trend: Array<{ week: string; added: number; changed: number; deleted: number; effortHours: number }> = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const w = weekStart(new Date(input.now.getTime() - i * 7 * DAY));
    trend.push({ week: w, added: 0, changed: 0, deleted: 0, effortHours: 0 });
  }
  const slot = (d: Date) => trend.find((t) => t.week === weekStart(d));
  for (const r of input.reqs) { const s = slot(r.createdAt); if (s && !r.deletedAt) s.added += 1; if (r.deletedAt) { const t = slot(r.deletedAt); if (t) t.deleted += 1; } }
  for (const c of input.changes) { const s = slot(c.at); if (s) { if (/lifecycle/i.test(c.field) && /DELETED|REJECTED/.test(c.to ?? '')) s.deleted += 1; else s.changed += 1; } }
  for (const e of input.effort) { const s = slot(e.at); if (s) s.effortHours += e.minutes / 60; }
  return {
    total: live.length, byLifecycle, byType,
    window: { days: input.days, from: from.toISOString().slice(0, 10), added, modified, deleted, volatility },
    effort: { hours: Math.round((effort.reduce((s, e) => s + e.minutes, 0) / 60) * 10) / 10, byPerson: [...byWho.entries()].map(([who, m]) => ({ who, hours: Math.round((m / 60) * 10) / 10 })).sort((a, b) => b.hours - a.hours) },
    trend: trend.map((t) => ({ ...t, effortHours: Math.round(t.effortHours * 10) / 10 })),
    versionedMoreThanOnce: live.filter((r) => r.reqVersion > 1).length,
  };
}

// ═══ R26 — trọn gói 8 deliverable ═══════════════════════════════════

/** Tên tệp theo đúng số thứ tự deliverable của đề Assignment SWR302 (`content/academy/swr302/assignment.mjs`). */
export const PACKAGE_FILES = [
  { n: 1, key: 'vision-scope', file: '1_Vision_and_Scope.docx' },
  { n: 2, key: 'use-cases', file: '2_Use_Cases.docx' },
  { n: 3, key: 'business-rules', file: '3_Business_Rules.docx' },
  { n: 4, key: 'srs', file: '4_Software_Requirements_Specification.docx' },
  { n: 5, key: 'data-dictionary', file: '5_Data_Dictionary.docx' },
  { n: 6, key: 'mockups', file: '6_Mockups/' },
  { n: 7, key: 'prioritization', file: '7_Requirements_Prioritization.xlsx' },
  { n: 8, key: 'estimation', file: '8_Requirements_Estimation.xlsx' },
] as const;

export const safeName = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_').slice(0, 60) || 'file';

// ═══ R28 — stakeholder do AI đóng vai ═══════════════════════════════

export interface AiTurn { role: 'analyst' | 'stakeholder'; text: string; at: string }
export const AI_TURNS_MAX = 80;

export function parseTurns(raw: unknown): AiTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((t) => {
    const o = t as Record<string, unknown>;
    if ((o.role !== 'analyst' && o.role !== 'stakeholder') || typeof o.text !== 'string') return [];
    return [{ role: o.role as AiTurn['role'], text: o.text.slice(0, 4000), at: typeof o.at === 'string' ? o.at : new Date(0).toISOString() }];
  }).slice(-AI_TURNS_MAX);
}

export interface Persona {
  name: string; role: string | null; organization: string | null; userClass: string | null; attitude: string | null;
  majorValue: string | null; interests: string | null; constraints: string | null; decisionRights: string | null; notes: string | null;
}

/**
 * Lời nhắc vai stakeholder. Mục tiêu là LUYỆN PHỎNG VẤN (đề SWR302 cho phép "AI-assisted inquiry" nếu giữ transcript), nên
 * nhân vật phải NHẤT QUÁN với hồ sơ đã ghi, KHÔNG bịa số liệu quan trọng, và được phép "không biết". Không trả lời thay BA.
 */
export function stakeholderPrompt(input: { persona: Persona; systemName: string; objective: string | null; language: 'vi' | 'en'; turns: AiTurn[]; question: string }) {
  const p = input.persona;
  const lang = input.language === 'vi' ? 'Vietnamese' : 'English';
  const facts = [
    `Name: ${p.name}`, p.role && `Role: ${p.role}`, p.organization && `Organization: ${p.organization}`, p.userClass && `User class: ${p.userClass}`,
    p.attitude && `Attitude toward the project: ${p.attitude.toLowerCase()}`, p.majorValue && `What they value most: ${p.majorValue}`,
    p.interests && `Interests: ${p.interests}`, p.constraints && `Constraints: ${p.constraints}`, p.decisionRights && `Decision rights: ${p.decisionRights}`,
    p.notes && `Other notes: ${p.notes}`,
  ].filter(Boolean).join('\n');
  const system = [
    `You are role-playing ONE stakeholder in a requirements elicitation interview for the system "${input.systemName}". This is a training simulation for a software requirements course (Wiegers & Beatty, "Software Requirements" 3rd ed.).`,
    'Stay in character, first person, conversational. Base every answer on the profile below and on what you already said in this conversation — never contradict yourself.',
    'Rules:',
    '- Talk about YOUR work, problems, goals and constraints. Do not write requirements, use cases or solutions for the analyst — that is their job. If asked to design the system, steer back to your needs.',
    '- If the profile does not say something, you may give a plausible answer typical for this role, but never invent precise numbers, laws, prices or names as if they were facts — say you would need to check, or give a rough range and say it is a guess.',
    '- If a question is vague, ask what they mean (real stakeholders do). If it is a leading question, answer honestly rather than agreeing.',
    '- Keep answers short: 2–6 sentences. No markdown headings, no bullet lists unless asked.',
    `- Answer in ${lang}.`,
    '',
    'Stakeholder profile:',
    facts,
    input.objective ? `\nSession objective (known to the analyst): ${input.objective}` : '',
  ].join('\n');
  const history = input.turns.slice(-24).map((t) => ({ role: (t.role === 'analyst' ? 'user' : 'assistant') as 'user' | 'assistant', content: t.text }));
  return { system, messages: [...history, { role: 'user' as const, content: input.question }] };
}

/** Transcript thành dòng nguồn cho "AI đề xuất yêu cầu" (ghi rõ AI-simulated — bằng chứng nguồn phải trung thực). */
export function turnsAsTranscript(turns: AiTurn[], personaName: string): Array<{ text: string; who: string }> {
  return turns.map((t) => ({ text: t.text, who: t.role === 'analyst' ? 'Analyst' : `${personaName} (AI-simulated)` }));
}
