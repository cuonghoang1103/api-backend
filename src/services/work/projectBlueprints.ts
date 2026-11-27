/**
 * CT Work — dm5 G4 (A25 mở rộng, 27/11/2026): THƯ VIỆN MẪU DỰ ÁN ("blueprint") — dữ liệu THUẦN, không DB.
 *
 * Mẫu cố định trong mã (`templates.ts`: BLANK/SWP391/CAPSTONE/COMPANY…) chỉ dựng quy trình + loại thẻ. Blueprint đứng TRÊN
 * mẫu đó (không làm lại): chọn một mẫu gốc rồi phủ thêm theo NHÓM TÍNH NĂNG bật/tắt được lúc tạo dự án:
 *
 *   workflow   — luồng trạng thái + WIP từng cột + luật chuyển (Done chỉ từ Review, người được giao không tự đóng…)
 *   types      — thêm loại thẻ còn thiếu so với mẫu gốc (Requirement, Test)
 *   fields     — trường tuỳ chỉnh (Evidence, Ready (DoR), Role C1–C5, MoSCoW, Complexity, Planned LOC…)
 *   labels     — nhãn chuẩn (Req, Q&A, Defect, Leakage, TechDebt, BE, FE, C1…C5)
 *   gates      — khoá settings cổng quy trình: Done rules (G1/A1–A2), DoR (G1/A14), WIP chặn cứng + chéo cột (A3/A4),
 *                sức chứa (A15), RAG (A19), MoSCoW (A22), stage chặn việc (A23), trần hành động retro (A12),
 *                test gate + làm nguội review (G3), AI chỉ phản biện + cảnh báo giờ theo vai (G4)
 *   cadence    — họp định kỳ (Daily, giữa tuần, Review + Retro Chủ nhật)
 *   stages     — giai đoạn / gate (có ngày kế hoạch tương đối theo tuần)
 *   docs       — cây Docs "Project kit": ADR, Mini-Spec/DoR, User Story + AC Given/When/Then, biên bản phỏng vấn, Use Case 7 dòng,
 *                Design Review
 *   checklists — Definition of Done + mẫu checklist review cấp dự án (settings.reviewChecklists của G3)
 *   modules    — mô-đun studio (Docs, RAID, họp, giai đoạn, CR…)
 *
 * Khoá settings của G1/G3 (đối chiếu mục "Kết quả G1/G3" của docs/ctw-nang-cap-do-an-5-vai.md): readyRequirements · doneRequirements
 * (+requireCiGreen) · wipMode · wipGuards · capacity {focusFactor,cautionPct,warnPct} · ragRules · moscowCapPct · stageGateBlocksWork ·
 * retroActionCap (G1) · testGate · reviewCoolOffHours · reviewChecklists (G3). Ghi ở đây dạng HẰNG SỐ; lúc áp dụng
 * service chạy qua bộ chuẩn hoá của chính gói đó (nếu có) nên sai khác định dạng bị loại, không làm hỏng dự án.
 * Trường / trạng thái được gọi bằng TÊN ở đây; service đổi sang id thật của dự án mới.
 */

import type { IssueTypeKey, ProjectKind, ProjectTemplate, ProjectType, StatusCategory, StudioModule } from './constants.js';

export const BLUEPRINT_GROUPS = ['workflow', 'types', 'fields', 'labels', 'gates', 'cadence', 'stages', 'docs', 'checklists', 'modules'] as const;
export type BlueprintGroup = (typeof BLUEPRINT_GROUPS)[number];
export const GROUP_LABEL: Record<BlueprintGroup, [en: string, vi: string]> = {
  workflow: ['Workflow, WIP limits & transition rules', 'Luồng trạng thái, WIP, luật chuyển'],
  types: ['Extra issue types', 'Loại thẻ bổ sung'],
  fields: ['Custom fields', 'Trường tuỳ chỉnh'],
  labels: ['Standard labels', 'Nhãn chuẩn'],
  gates: ['Process gates (Done / DoR / WIP / capacity / RAG / MoSCoW / tests)', 'Cổng quy trình (Done / DoR / WIP / sức chứa / RAG / MoSCoW / test)'],
  cadence: ['Recurring meetings', 'Họp định kỳ'],
  stages: ['Stages / gates', 'Giai đoạn / gate'],
  docs: ['Docs project kit (templates)', 'Bộ tài liệu mẫu trong Docs'],
  checklists: ['Definition of Done + review checklists', 'Definition of Done + checklist review'],
  modules: ['Project modules', 'Mô-đun dự án'],
};

export interface BpStatus { name: string; category: StatusCategory; wipLimit?: number }
export interface BpField { name: string; kind: 'TEXT' | 'NUMBER' | 'SELECT' | 'URL' | 'CHECKBOX'; options?: Array<{ label: string; color?: string }>; typeKeys: IssueTypeKey[] | null }
export interface BpSeries { templateKey: string; title: string; freq: 'DAILY' | 'WEEKLY'; byWeekday?: number[]; hour: number; minute?: number; durationMin: number }
export interface BpDoc { title: string; markdown: string }

export interface Blueprint {
  key: string;
  name: string; nameVi: string;
  description: string; descriptionVi: string;
  base: { template: ProjectTemplate; type: ProjectType; kind: ProjectKind };
  /** Trạng thái của quy trình MẶC ĐỊNH (thay bộ của mẫu gốc) — dự án mới chưa có thẻ nên thay an toàn. */
  workflow?: {
    statuses: BpStatus[];
    /** Luồng chuyển có luật. Có ít nhất một dòng ⇒ quy trình trở thành "có luồng": service thêm dòng "từ bất kỳ đâu" cho mọi
     *  trạng thái KHÔNG nằm trong `onlyFrom` để chỉ các trạng thái liệt kê mới bị siết. */
    rules?: Array<{ to: string; onlyFrom: string[]; rules: Record<string, unknown> }>;
  };
  types?: IssueTypeKey[];
  fields?: BpField[];
  labels?: Array<{ name: string; color: string }>;
  /** Khoá settings (tên trường/trạng thái dạng chữ: `fieldNames`, `toStatusNames`). */
  gates?: Record<string, unknown>;
  cadence?: BpSeries[];
  stages?: Array<{ slug: string; name: string; startWeek: number; weeks: number }>;
  docs?: BpDoc[];
  checklists?: { definitionOfDone: string[]; reviewChecklists?: Array<{ name: string; kind: 'DOC' | 'CODE'; sections: Array<{ name: string; items: string[] }> }> };
  modules?: StudioModule[];
}

// ─── Mảnh dùng chung ─────────────────────────────────────────────

const F_EVIDENCE: BpField = { name: 'Evidence', kind: 'TEXT', typeKeys: ['STORY', 'TASK', 'REQUIREMENT', 'BUG'] };
const F_READY: BpField = { name: 'Ready (DoR)', kind: 'CHECKBOX', typeKeys: ['REQUIREMENT', 'STORY'] };
const F_ROLE: BpField = {
  name: 'Role (C1–C5)', kind: 'SELECT', typeKeys: null,
  options: [{ label: 'C1 PM', color: '#7c3aed' }, { label: 'C2 BA', color: '#0891b2' }, { label: 'C3 Dev BE', color: '#2563eb' }, { label: 'C4 Dev FE', color: '#16a34a' }, { label: 'C5 QA', color: '#ca8a04' }],
};
const F_MOSCOW: BpField = {
  name: 'MoSCoW', kind: 'SELECT', typeKeys: ['REQUIREMENT', 'STORY', 'EPIC'],
  options: [{ label: 'Must', color: '#dc2626' }, { label: 'Should', color: '#ea580c' }, { label: 'Could', color: '#2563eb' }, { label: "Won't", color: '#64748b' }],
};
const F_COMPLEXITY: BpField = { name: 'Complexity', kind: 'SELECT', typeKeys: ['REQUIREMENT', 'STORY'], options: [{ label: 'Simple', color: '#16a34a' }, { label: 'Medium', color: '#ca8a04' }, { label: 'Complex', color: '#dc2626' }] };
const F_LOC: BpField = { name: 'Planned LOC', kind: 'NUMBER', typeKeys: ['REQUIREMENT', 'STORY'] };
const F_MENTOR: BpField = { name: 'Mentor feedback', kind: 'TEXT', typeKeys: ['TASK', 'STORY', 'BUG'] };
const F_PR: BpField = { name: 'Pull request', kind: 'URL', typeKeys: ['TASK', 'STORY', 'BUG'] };

const L = (name: string, color: string) => ({ name, color });
const LABELS_BASE = [L('Req', '#0891b2'), L('Task', '#2563eb'), L('Q&A', '#7c3aed'), L('Defect', '#dc2626'), L('Leakage', '#b91c1c'), L('TechDebt', '#64748b'), L('BE', '#1d4ed8'), L('FE', '#15803d')];
const LABELS_HATS = [L('C1', '#7c3aed'), L('C2', '#0891b2'), L('C3', '#2563eb'), L('C4', '#16a34a'), L('C5', '#ca8a04')];

const REVIEW_FLOW: BpStatus[] = [
  { name: 'To Do', category: 'TODO' }, { name: 'In Progress', category: 'IN_PROGRESS', wipLimit: 2 },
  { name: 'In Review', category: 'IN_PROGRESS', wipLimit: 2 }, { name: 'Done', category: 'DONE' },
];
/** Done CHỈ từ In Review, và người đang được giao không tự đóng (cần tài khoản vai khác — xem bài s00/s01). */
const DONE_FROM_REVIEW = [{ to: 'Done', onlyFrom: ['In Review'], rules: { notAssignee: true } }];

const DOD_COMMON = ['Acceptance criteria verified (Given/When/Then)', 'Evidence attached (screenshot / test run / PR link)', 'Code reviewed and merged with green CI', 'No open P0–P1 bug linked'];

const CADENCE_SOLO: BpSeries[] = [
  { templateKey: 'daily', title: 'Daily log (15 min)', freq: 'WEEKLY', byWeekday: [1, 2, 3, 4, 5], hour: 8, minute: 30, durationMin: 15 },
  { templateKey: 'lecturer', title: 'Mid-week check (C1 ↔ C5)', freq: 'WEEKLY', byWeekday: [3], hour: 20, durationMin: 30 },
  { templateKey: 'sprint-review', title: 'Sunday review + retro', freq: 'WEEKLY', byWeekday: [0], hour: 20, durationMin: 60 },
];
const CADENCE_TEAM: BpSeries[] = [
  { templateKey: 'daily', title: 'Daily stand-up', freq: 'WEEKLY', byWeekday: [1, 2, 3, 4, 5], hour: 21, durationMin: 15 },
  { templateKey: 'lecturer', title: 'Weekly lecturer meeting', freq: 'WEEKLY', byWeekday: [3], hour: 9, durationMin: 45 },
  { templateKey: 'sprint-review', title: 'Sprint review + retro', freq: 'WEEKLY', byWeekday: [0], hour: 20, durationMin: 60 },
];

const STAGES_ITER = [
  { slug: 'g0-kickoff', name: 'G0 · Kick-off & plan', startWeek: 0, weeks: 1 },
  { slug: 'iter-1', name: 'Iteration 1', startWeek: 1, weeks: 3 },
  { slug: 'iter-2', name: 'Iteration 2', startWeek: 4, weeks: 3 },
  { slug: 'iter-3', name: 'Iteration 3 · release', startWeek: 7, weeks: 3 },
  { slug: 'defence', name: 'Final review & defence', startWeek: 10, weeks: 1 },
];

// ─── Bộ tài liệu mẫu ─────────────────────────────────────────────

export const DOC_ADR: BpDoc = {
  title: 'ADR-000 · Template — Architecture decision record',
  markdown: `# ADR-000 · <decision title>

**Status:** Proposed | Accepted | Superseded by ADR-xxx
**Date:** YYYY-MM-DD · **Deciders:** C1 / C3

## Context
What problem forces a decision? Constraints (deadline, team skill, school rules).

## Options considered
| Option | Pros | Cons |
|---|---|---|
| A | | |
| B | | |

## Decision
We choose … because …

## Consequences
- Positive:
- Negative / risks (add to RAID):
- Follow-up issues: KEY-n
`,
};

export const DOC_MINISPEC: BpDoc = {
  title: 'Mini-Spec & Definition of Ready — template',
  markdown: `# Mini-Spec · <KEY-n feature>

A requirement is **Ready** (tick the "Ready (DoR)" field) only when all 6 lines are filled.

1. **Goal (who / why):** As a <role>, I want … so that …
2. **Scope in / out:** …
3. **Business rules:** BR-xx, BR-yy
4. **Screens / API:** screen name in SRS · endpoint
5. **Acceptance criteria:** see the story (Given/When/Then, at least one unhappy case)
6. **Open questions:** Q&A-n (or "none")

## Definition of Ready checklist
- [ ] Mockup approved (link + date)
- [ ] Estimate (S/M/C or hours) set
- [ ] Dependencies (BLOCKS links) known
- [ ] Test idea for each acceptance criterion
`,
};

export const DOC_STORY: BpDoc = {
  title: 'User Story + Acceptance Criteria — template',
  markdown: `# User story

**As a** <role> **I want** <goal> **so that** <benefit>.

## Acceptance criteria (Given / When / Then)
1. **Given** … **When** … **Then** …
2. **Given** … **When** … **Then** … *(unhappy case: empty / boundary / conflict)*
3. **Given** … **When** … **Then** … *(security / permission case)*

## Notes
- Business rules: BR-xx
- Out of scope: …
- Evidence when Done: screenshot / test run / PR link
`,
};

export const DOC_INTERVIEW: BpDoc = {
  title: 'Stakeholder interview minutes — template',
  markdown: `# Interview minutes · <stakeholder> · YYYY-MM-DD

**Interviewer:** C2 BA · **Interviewee:** … · **Duration:** … min · **Recording:** link (with consent)

## Objective
What decision this interview must unblock.

## Questions & answers
| # | Question | Answer (verbatim keywords) | Follow-up / target (BR / UC / Q&A) |
|---|---|---|---|
| 1 | | | |
| 2 | | | |

## New / changed requirements
- …

## Open questions → Q&A
- Q&A-n: …

## Agreed next steps
- [ ] …
`,
};

export const DOC_USECASE: BpDoc = {
  title: 'Use case specification (7 rows) — template',
  markdown: `# UC-xx · <use case name>

| Field | Content |
|---|---|
| 1. Actors | Primary: … · Secondary: … |
| 2. Description | One sentence: what the actor achieves |
| 3. Pre-conditions | … |
| 4. Post-conditions | State of the system after success (no BR / SM codes here) |
| 5. Normal flow | 1. The actor … 2. The system … 3. … |
| 6. Alternative / exception flows | 2a. … · 3E1. … (every step code must exist in the normal flow) |
| 7. Business rules & messages | BR-xx, SM-xx |
`,
};

export const DOC_DESIGN_REVIEW: BpDoc = {
  title: 'Design review checklist — template',
  markdown: `# Design review · <module> · YYYY-MM-DD

Reviewer: C1 (or another role than the author) · Author: C3 / C4 · Let it rest ≥ 12 h before deciding.

- [ ] 1. Every use case maps to a sequence / class (RTM row exists)
- [ ] 2. ERD: PK/FK/UNIQUE/NOT NULL match the business rules
- [ ] 3. Layering: controller → service → repository, no SQL in controllers
- [ ] 4. Transactions and concurrency for shared resources (double booking…)
- [ ] 5. Authorization checked on the server for every endpoint
- [ ] 6. Validation + system messages (SM-xx) defined
- [ ] 7. Error handling and logging strategy
- [ ] 8. Testability: what is unit-tested, what is integration-tested
- [ ] 9. Naming consistent between SRS, SDS and code
- [ ] 10. Decisions recorded as ADRs

## Findings
| # | Finding | Severity | Issue |
|---|---|---|---|
`,
};

const DOCS_ALL: BpDoc[] = [DOC_ADR, DOC_MINISPEC, DOC_STORY, DOC_INTERVIEW, DOC_USECASE, DOC_DESIGN_REVIEW];

const CHECKLIST_SOLO = {
  name: 'Solo 5-role hand-off', kind: 'DOC' as const,
  sections: [
    { name: 'Before In Review (author hat)', items: ['Self-test of every acceptance criterion done', 'Evidence attached', 'Time logged with the right hat (C1–C5)'] },
    { name: 'Before Done (reviewer hat — a different role account)', items: ['Read the diff / document after a cool-off', 'At least one unhappy case tested', 'Defects logged as Bug, not fixed silently'] },
  ],
};

// ─── 5 bộ mẫu ────────────────────────────────────────────────────

export const BLUEPRINTS: Blueprint[] = [
  {
    key: 'SWP391_TEAM5',
    name: 'SWP391 · team of 5', nameVi: 'SWP391 · nhóm 5 người',
    description: 'Scrum for a 5-student SWP391 group: review before Done, WIP 2, Evidence on Done, MoSCoW + S/M/C sizing, lecturer meeting cadence, Iterations 1–3 and the FPT document kit.',
    descriptionVi: 'Scrum cho nhóm SWP391 năm bạn: review trước khi Done, WIP 2, Evidence khi Done, MoSCoW + định cỡ S/M/C, nhịp họp với giảng viên, Iteration 1–3 và bộ tài liệu FPT.',
    base: { template: 'SWP391', type: 'SCRUM', kind: 'SCHOOL' },
    workflow: { statuses: REVIEW_FLOW, rules: DONE_FROM_REVIEW },
    types: ['REQUIREMENT', 'TEST'],
    fields: [F_EVIDENCE, F_READY, F_MOSCOW, F_COMPLEXITY, F_LOC, F_PR],
    labels: LABELS_BASE,
    gates: {
      doneRequirements: { fieldNames: ['Evidence'], typeKeys: ['STORY', 'TASK', 'REQUIREMENT'] },
      readyRequirements: { fieldNames: ['Ready (DoR)'], typeKeys: ['REQUIREMENT', 'STORY'], toStatusNames: null, requireMockupApproved: false },
      wipMode: 'block',
      capacity: { focusFactor: 0.7, cautionPct: 75, warnPct: 85 },
      ragRules: { schedule: { amber: 10, red: 25 }, scope: { amber: 10, red: 20 }, quality: { amber: 3, red: 6 }, effort: { amber: 15, red: 30 } },
      moscowCapPct: 60, retroActionCap: 2, testGate: 'warn',
    },
    cadence: CADENCE_TEAM,
    stages: STAGES_ITER,
    docs: DOCS_ALL,
    checklists: { definitionOfDone: DOD_COMMON },
    modules: ['stages', 'docs', 'raid', 'meetings', 'changeRequests', 'reports'],
  },
  {
    key: 'SWP391_SOLO5',
    name: 'SWP391 · one person, 5 roles', nameVi: 'SWP391 · một mình đóng 5 vai',
    description: 'Matches the course "Du an mot minh 5 vai": C1 PM · C2 BA · C3 Dev BE · C4 Dev FE · C5 QA. Done rules with Evidence, hard WIP 2, the assignee cannot close their own card (use the 5 role accounts), Daily / mid-week / Sunday review-retro, gates G0 → defence, critic-only AI review, hours-by-role alerts.',
    descriptionVi: 'Khớp khoá "Dự án một mình 5 vai": C1 PM · C2 BA · C3 Dev BE · C4 Dev FE · C5 QA. Done rules có Evidence, WIP 2 chặn cứng, người được giao không tự đóng thẻ (dùng 5 tài khoản vai), Daily / giữa tuần / review-retro Chủ nhật, gate G0 → bảo vệ, AI review chỉ phản biện, cảnh báo giờ theo vai.',
    base: { template: 'SWP391', type: 'SCRUM', kind: 'SCHOOL' },
    workflow: { statuses: REVIEW_FLOW, rules: DONE_FROM_REVIEW },
    types: ['REQUIREMENT', 'TEST'],
    fields: [F_EVIDENCE, F_READY, F_ROLE, F_MOSCOW, F_COMPLEXITY, F_LOC, F_PR],
    labels: [...LABELS_BASE, ...LABELS_HATS],
    gates: {
      // requireCiGreen (G1 · A2): PR gắn thẻ phải CI xanh; thẻ chưa có PR vẫn qua (requirePr tắt).
      doneRequirements: { fieldNames: ['Evidence'], typeKeys: ['STORY', 'TASK', 'REQUIREMENT', 'BUG'], requireCiGreen: true },
      readyRequirements: { fieldNames: ['Ready (DoR)'], typeKeys: ['REQUIREMENT', 'STORY'], toStatusNames: null, requireMockupApproved: false },
      wipMode: 'block',
      wipGuards: [{ whenColumn: 'In Review', blocksColumn: 'In Progress', limit: 2 }],
      capacity: { focusFactor: 0.6, cautionPct: 75, warnPct: 85 },
      ragRules: { schedule: { amber: 10, red: 25 }, scope: { amber: 10, red: 20 }, quality: { amber: 3, red: 6 }, effort: { amber: 15, red: 30 } },
      moscowCapPct: 60, stageGateBlocksWork: true, retroActionCap: 2,
      testGate: 'block', reviewCoolOffHours: 12,
      aiReviewMode: 'critic', roleAlert: { qaMinPct: 15, maxWeekHours: 30 }, codeHealth: { branchMaxDays: 3, prMaxLines: 400 },
      banner: { text: 'Solo · 1 person plays 5 roles (C1 PM · C2 BA · C3 BE · C4 FE · C5 QA)', tone: 'solo' },
    },
    cadence: CADENCE_SOLO,
    stages: STAGES_ITER,
    docs: DOCS_ALL,
    checklists: { definitionOfDone: DOD_COMMON, reviewChecklists: [CHECKLIST_SOLO] },
    modules: ['stages', 'docs', 'raid', 'meetings', 'changeRequests', 'reports', 'approvals'],
  },
  {
    key: 'SEP490',
    name: 'SEP490 · capstone', nameVi: 'SEP490 · đồ án tốt nghiệp',
    description: 'The CAPSTONE template (Report 1 → 7 stages, Iterations, FPT Docs) plus Evidence on Done, Definition of Ready, MoSCoW cap, test gate before release and the design/ADR kit.',
    descriptionVi: 'Mẫu CAPSTONE (giai đoạn Report 1 → 7, Iteration, Docs FPT) cộng Evidence khi Done, Definition of Ready, trần MoSCoW, test gate trước release và bộ mẫu thiết kế/ADR.',
    base: { template: 'CAPSTONE', type: 'SCRUM', kind: 'SCHOOL' },
    workflow: { statuses: REVIEW_FLOW, rules: DONE_FROM_REVIEW },
    fields: [F_EVIDENCE, F_READY, F_MOSCOW, F_COMPLEXITY, F_LOC, F_PR],
    labels: LABELS_BASE,
    gates: {
      doneRequirements: { fieldNames: ['Evidence'], typeKeys: ['STORY', 'TASK', 'REQUIREMENT'], requireCiGreen: true },
      readyRequirements: { fieldNames: ['Ready (DoR)'], typeKeys: ['REQUIREMENT', 'STORY'], toStatusNames: null, requireMockupApproved: true },
      wipMode: 'block',
      capacity: { focusFactor: 0.7, cautionPct: 75, warnPct: 85 },
      moscowCapPct: 60, retroActionCap: 2, testGate: 'block', reviewCoolOffHours: 12, releaseRequireGreenCi: true,
    },
    cadence: CADENCE_TEAM,
    docs: [DOC_ADR, DOC_MINISPEC, DOC_STORY, DOC_INTERVIEW, DOC_DESIGN_REVIEW],
    checklists: { definitionOfDone: DOD_COMMON },
    modules: ['stages', 'approvals', 'docs', 'raid', 'meetings', 'resources', 'changeRequests', 'reports'],
  },
  {
    key: 'OJT',
    name: 'OJT · internship', nameVi: 'OJT · thực tập',
    description: 'On-the-job training: Kanban-like flow with Code Review and Mentor check, mentor feedback field, weekly mentor 1:1, onboarding → training → real tasks → final review stages, critic-only AI review.',
    descriptionVi: 'Thực tập doanh nghiệp: luồng có Code Review và Mentor kiểm, trường nhận xét của mentor, 1:1 với mentor hằng tuần, giai đoạn onboarding → đào tạo → việc thật → đánh giá cuối, AI review chỉ phản biện.',
    base: { template: 'COMPANY', type: 'KANBAN', kind: 'SOFTWARE' },
    workflow: {
      statuses: [{ name: 'To Do', category: 'TODO' }, { name: 'In Progress', category: 'IN_PROGRESS', wipLimit: 2 }, { name: 'Code Review', category: 'IN_PROGRESS' }, { name: 'Mentor Check', category: 'IN_PROGRESS' }, { name: 'Done', category: 'DONE' }],
      rules: [{ to: 'Done', onlyFrom: ['Mentor Check'], rules: { notAssignee: true } }],
    },
    fields: [F_EVIDENCE, F_MENTOR, F_PR],
    labels: [L('Onboarding', '#0891b2'), L('Training', '#7c3aed'), L('Real task', '#2563eb'), L('TechDebt', '#64748b'), L('Defect', '#dc2626')],
    gates: { doneRequirements: { fieldNames: ['Evidence'], typeKeys: ['STORY', 'TASK'] }, wipMode: 'block', aiReviewMode: 'critic', codeHealth: { branchMaxDays: 3, prMaxLines: 400 } },
    cadence: [
      { templateKey: 'daily', title: 'Daily check-in', freq: 'WEEKLY', byWeekday: [1, 2, 3, 4, 5], hour: 9, durationMin: 15 },
      { templateKey: 'lecturer', title: 'Weekly mentor 1:1', freq: 'WEEKLY', byWeekday: [5], hour: 16, durationMin: 30 },
    ],
    stages: [
      { slug: 'onboarding', name: 'Onboarding', startWeek: 0, weeks: 1 },
      { slug: 'training', name: 'Training', startWeek: 1, weeks: 3 },
      { slug: 'real-tasks', name: 'Real tasks', startWeek: 4, weeks: 8 },
      { slug: 'final-review', name: 'Final review', startWeek: 12, weeks: 1 },
    ],
    docs: [DOC_ADR, DOC_STORY, DOC_DESIGN_REVIEW],
    checklists: { definitionOfDone: ['Mentor checked the change', 'Evidence attached', 'Tests pass in CI', 'What I learned written in the card'] },
    modules: ['stages', 'docs', 'meetings', 'resources'],
  },
  {
    key: 'SCRUM',
    name: 'Scrum · general', nameVi: 'Scrum · chung',
    description: 'A clean Scrum setup: review column, WIP limits that warn, story points, Daily / Review / Retro cadence, Definition of Done and the story + ADR templates.',
    descriptionVi: 'Scrum gọn: cột review, WIP chỉ cảnh báo, story point, nhịp Daily / Review / Retro, Definition of Done và mẫu story + ADR.',
    base: { template: 'BLANK', type: 'SCRUM', kind: 'SOFTWARE' },
    workflow: { statuses: [{ name: 'To Do', category: 'TODO' }, { name: 'In Progress', category: 'IN_PROGRESS', wipLimit: 3 }, { name: 'In Review', category: 'IN_PROGRESS' }, { name: 'Done', category: 'DONE' }] },
    fields: [F_PR],
    labels: [L('TechDebt', '#64748b'), L('Spike', '#7c3aed'), L('Blocked', '#dc2626')],
    gates: { capacity: { focusFactor: 0.8, cautionPct: 80, warnPct: 100 }, retroActionCap: 3 },
    cadence: [
      { templateKey: 'daily', title: 'Daily stand-up', freq: 'WEEKLY', byWeekday: [1, 2, 3, 4, 5], hour: 9, durationMin: 15 },
      { templateKey: 'sprint-review', title: 'Sprint review', freq: 'WEEKLY', byWeekday: [5], hour: 15, durationMin: 60 },
      { templateKey: 'retro', title: 'Retrospective', freq: 'WEEKLY', byWeekday: [5], hour: 16, durationMin: 45 },
    ],
    docs: [DOC_ADR, DOC_STORY],
    checklists: { definitionOfDone: ['Code reviewed and merged', 'Acceptance criteria verified', 'No open blocker bugs'] },
    modules: ['docs', 'meetings', 'reports'],
  },
];

export const blueprintOf = (key: string | null | undefined) => BLUEPRINTS.find((b) => b.key === key) ?? null;

/** Nhóm có nội dung trong bộ (nhóm rỗng không hiện checkbox). */
export function groupsOf(b: Blueprint): BlueprintGroup[] {
  return BLUEPRINT_GROUPS.filter((g) => {
    switch (g) {
      case 'workflow': return !!b.workflow;
      case 'types': return !!b.types?.length;
      case 'fields': return !!b.fields?.length;
      case 'labels': return !!b.labels?.length;
      case 'gates': return !!b.gates && Object.keys(b.gates).length > 0;
      case 'cadence': return !!b.cadence?.length;
      case 'stages': return !!b.stages?.length;
      case 'docs': return !!b.docs?.length;
      case 'checklists': return !!b.checklists;
      case 'modules': return !!b.modules?.length;
    }
  });
}

/** Nhóm bật: mặc định mọi nhóm có nội dung; `picked[g] === false` ⇒ tắt. */
export function enabledGroups(b: Blueprint, picked?: Partial<Record<string, boolean>> | null): Set<BlueprintGroup> {
  return new Set(groupsOf(b).filter((g) => picked?.[g] !== false));
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Xem trước (không ghi DB): mỗi nhóm một danh sách dòng chữ người đọc được — giao diện + MCP `create_project dryRun`. */
export function previewBlueprint(b: Blueprint, picked?: Partial<Record<string, boolean>> | null) {
  const on = enabledGroups(b, picked);
  const lines: Record<BlueprintGroup, string[]> = {
    workflow: b.workflow ? [
      b.workflow.statuses.map((s) => `${s.name}${s.wipLimit ? ` (WIP ${s.wipLimit})` : ''}`).join(' → '),
      ...(b.workflow.rules ?? []).map((r) => `→ ${r.to} only from ${r.onlyFrom.join(' / ')}${r.rules.notAssignee ? ' · the assignee cannot move it' : ''}`),
    ] : [],
    types: (b.types ?? []).map((t) => `+ ${t}`),
    fields: (b.fields ?? []).map((f) => `${f.name} (${f.kind.toLowerCase()}${f.options ? `: ${f.options.map((o) => o.label).join(' / ')}` : ''})`),
    labels: b.labels?.length ? [b.labels.map((l) => l.name).join(', ')] : [],
    gates: Object.entries(b.gates ?? {}).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`),
    cadence: (b.cadence ?? []).map((c) => `${c.title} — ${c.byWeekday?.map((d) => WEEKDAY[d]).join('/') ?? 'daily'} ${String(c.hour).padStart(2, '0')}:${String(c.minute ?? 0).padStart(2, '0')} · ${c.durationMin} min`),
    stages: (b.stages ?? []).map((s) => `${s.name} (week ${s.startWeek + 1}–${s.startWeek + s.weeks})`),
    docs: (b.docs ?? []).map((d) => d.title),
    checklists: [...(b.checklists?.definitionOfDone ?? []).map((x) => `DoD: ${x}`), ...(b.checklists?.reviewChecklists ?? []).map((c) => `Review checklist: ${c.name}`)],
    modules: b.modules?.length ? [b.modules.join(', ')] : [],
  };
  return {
    key: b.key, name: b.name, nameVi: b.nameVi, description: b.description, descriptionVi: b.descriptionVi, base: b.base,
    groups: groupsOf(b).map((g) => ({ key: g, label: GROUP_LABEL[g][0], labelVi: GROUP_LABEL[g][1], enabled: on.has(g), items: lines[g] })),
  };
}
