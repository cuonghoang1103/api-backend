/**
 * CTW đợt 4b — SWR302 phần THUẦN (không DB):  npx tsx --test src/services/work/swr.test.ts
 *   R12 công thức Wiegers (đối chiếu sheet "Example" của Requirements Prioritization Spreadsheet.xlsx) + xlsx giữ công thức
 *   R16 ký hiệu Data Dictionary ⇒ mô hình ERD · R23 sáu liên kết · R6 vòng đời · R5 FE ↔ UC · R4 V&S + mẫu Wiegers điền đúng mục
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getTemplate } from './docTemplates.js';
import { erdFromModel } from './diagramGen.js';
import type { PmNode } from './docMarkdown.js';
import { plainText } from './docExport.js';
import type { ActorLite, RuleLite, UseCaseLite } from './srs.js';
import {
  applyVisionScopeFill, applyWiegersFill, canMove, computePriorities, ddToDataModel, featureUseCases, mergeByKey, nounCandidates, nounsWithoutDd,
  parseComposition, prioritySheets, sixLinks, undefinedComponents, WIEGERS_UC_ROWS,
  type DataElementLite, type FeatureLite, type SixLinksInput, type WiegersData,
} from './swr.js';
import { buildTable } from './docFill.js';
import { readXlsx, writeXlsx } from './xlsxStyled.js';

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const tableAfter = (doc: PmNode, re: RegExp) => {
  const b = doc.content ?? [];
  const i = b.findIndex((x) => x.type === 'heading' && re.test(plainText(x).replace(/^(?:\d+(?:\.\d+)*\.?)\s+/, '')));
  assert.ok(i >= 0, String(re));
  const t = b.slice(i + 1).find((x) => x.type === 'table' || x.type === 'heading');
  assert.equal(t?.type, 'table', `bảng sau ${re}`);
  return (t!.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c)));
};

// Ví dụ Chemical Tracking System — đúng sheet "Example" (trọng số 2 / 1 / 1 / 0.5).
const CTS: Array<[string, number, number, number, number]> = [
  ['Print a material safety data sheet', 2, 4, 1, 1], ['Query status of a vendor order', 5, 3, 2, 1],
  ['Generate a Chemical Stockroom inventory report', 9, 7, 5, 3], ['See history of a specific chemical container', 5, 5, 3, 2],
  ['Search vendor catalogs for a specific chemical', 9, 8, 3, 8], ['Maintain a list of hazardous chemicals', 3, 9, 3, 4],
  ['Modify a pending chemical request', 4, 3, 3, 2], ['Generate an individual laboratory inventory report', 6, 2, 4, 3],
  ['Check training database for hazardous chemical training record', 3, 4, 4, 2], ['Import chemical structures from structure drawing tools', 7, 4, 9, 7],
];

describe('R12 bảng ưu tiên Wiegers', () => {
  const rows = CTS.map(([label, benefit, penalty, cost, risk], id) => ({ id, label, benefit, penalty, cost, risk }));
  const w = { benefit: 2, penalty: 1, cost: 1, risk: 0.5 };

  it('đúng công thức sheet Template: value%, cost%, risk%, priority và thứ hạng', () => {
    const out = computePriorities(rows, w);
    const first = out.find((r) => r.id === 0)!;
    assert.equal(first.totalValue, 8);
    assert.equal(first.valuePct, 5.161);
    assert.equal(first.costPct, 2.703);
    assert.equal(first.riskPct, 3.03);
    assert.equal(first.priority, 1.224);
    assert.equal(first.rank, 1);
    assert.equal(out.find((r) => r.id === 9)!.rank, 10);
    assert.equal(Math.round(out.reduce((a, r) => a + r.valuePct, 0)), 100);
  });

  it('tổng bằng 0 không chia cho 0', () => {
    assert.deepEqual(computePriorities([], w), []);
  });

  it('xuất xlsx đúng layout: A1 Relative Weights, B1/C1/F1/H1, tiêu đề hàng 3, công thức gốc, hàng Totals', () => {
    const out = computePriorities(rows, w);
    const sheets = readXlsx(writeXlsx(prioritySheets(out, w, 'CTS')));
    assert.deepEqual(sheets.map((s) => s.name), ['Description', 'Prioritization']);
    const sh = sheets[1];
    assert.equal(sh.text(1, 1), 'Relative Weights:');
    assert.deepEqual([sh.text(1, 2), sh.text(1, 3), sh.text(1, 6), sh.text(1, 8)], ['2', '1', '1', '0.5']);
    assert.deepEqual(Array.from({ length: 10 }, (_, i) => sh.text(3, i + 1)), ['Feature', 'Relative Benefit', 'Relative Penalty', 'Total Value', 'Value %', 'Relative Cost', 'Cost %', 'Relative Risk', 'Risk %', 'Priority']);
    assert.equal(sh.text(4, 1), 'Print a material safety data sheet');
    assert.equal(sh.text(14, 1), 'Totals');
    assert.equal(sh.text(4, 10), '1.224');
  });
});

describe('R16 Data Dictionary', () => {
  it('ký hiệu Wiegers: +, ( ), m:n{ }, "literal"', () => {
    const parts = parseComposition('Request ID + Requester + (Vendor) + 1:10{Requested Chemical} + "-" + 0:n{(Note)}');
    assert.deepEqual(parts.map((p) => [p.name, p.optional, p.min, p.max, p.repeating, p.literal]), [
      ['Request ID', false, 1, 1, false, false], ['Requester', false, 1, 1, false, false], ['Vendor', true, 0, 1, false, false],
      ['Requested Chemical', false, 1, 10, true, false], ['-', false, 1, 1, false, true], ['Note', true, 0, 'n', true, false],
    ]);
  });

  const el = (id: number, name: string, kind: 'PRIMITIVE' | 'STRUCTURE', x: Partial<DataElementLite> = {}): DataElementLite =>
    ({ id, name, description: null, kind, composition: null, dataType: null, length: null, values: null, isKey: false, position: id, ...x });
  const dd = [
    el(1, 'Chemical Request', 'STRUCTURE', { composition: 'Request ID + Requester + Request Date + 1:10{Requested Chemical}' }),
    el(2, 'Request ID', 'PRIMITIVE', { dataType: 'integer', length: '8', isKey: true }),
    el(3, 'Requester', 'STRUCTURE', { composition: 'Requester Name + Employee Number' }),
    el(4, 'Request Date', 'PRIMITIVE', { dataType: 'MM/DD/YYYY' }),
    el(5, 'Requested Chemical', 'STRUCTURE', { composition: 'Chemical ID + Quantity' }),
    el(6, 'Requester Name', 'PRIMITIVE', { dataType: 'alphabetic characters', length: '40' }),
  ];

  it('cấu trúc ⇒ thực thể; nhóm lặp ⇒ một–nhiều; cấu trúc đơn ⇒ FK; erDiagram vẽ được', () => {
    const dm = ddToDataModel(dd);
    assert.deepEqual(dm.tables.map((t) => t.name), ['Chemical Request', 'Requester', 'Requested Chemical']);
    const cr = dm.tables[0];
    assert.deepEqual(cr.columns.map((c) => [c.name, c.type, !!c.pk, !!c.fk]), [['Request ID', 'int', true, false], ['Requester ID', 'int', false, true], ['Request Date', 'date', false, false]]);
    assert.deepEqual(dm.relations.map((r) => [r.from, r.to, r.fromMany]), [['Chemical Request', 'Requester', true], ['Requested Chemical', 'Chemical Request', true]]);
    const m = erdFromModel(dm, { title: 'ERD', sourceLabel: 'DD' }).mermaid;
    assert.match(m, /erDiagram/);
    assert.match(m, /\|\|--o\{/);
  });

  it('thành phần chưa định nghĩa được liệt kê', () => {
    assert.deepEqual(undefinedComponents(dd).map((x) => x.component).sort(), ['Chemical ID', 'Employee Number', 'Quantity']);
  });
});

describe('R23 danh từ trong luồng UC (liên kết #4)', () => {
  it('lấy cụm Viết Hoa giữa câu, cụm ≥ 2 từ đầu câu, chữ trong ngoặc kép; bỏ mã UC/BR/MSG', () => {
    const n = nounCandidates('1. Student opens the Booking page.\n2. LabFlow shows the Equipment List with each Lab Room.\n3. Student enters the "Booking Date" and the Time Slot.\n4. The system checks BR-03 and saves the Booking Request.\n2A. If the Equipment is unavailable, LabFlow shows MSG-01.');
    for (const x of ['Booking Date', 'Lab Room', 'Time Slot', 'Booking Request', 'Equipment']) assert.ok(n.includes(x), x);
    for (const x of ['Student', 'BR-03', 'MSG-01', 'The']) assert.ok(!n.includes(x), x);
    assert.deepEqual(nounCandidates('1.0.E1 File too large\n2A. Lab Room is busy'), ['Lab Room']);
  });
  it('DD (cả số nhiều), glossary alias, actor/màn/tên hệ thống, danh từ bỏ qua ⇒ không báo', () => {
    const uc = { number: 1, name: 'Book', status: 'DRAFT', preconditions: null, postconditions: null, alternativeFlows: null, exceptionFlows: null,
      normalFlow: '1. Student picks the Lab Rooms.\n2. LabFlow saves the Booking Request and the FC Code.\n3. Student sees the Booking screen and the Dashboard Widget.' };
    const gaps = nounsWithoutDd({ useCases: [uc], dataElements: [{ name: 'Lab Room' }, { name: 'Fulfillment Center Code' }], glossary: [{ term: 'Fulfillment Center Code', aliases: ['FC Code'] }], ignore: ['Dashboard Widget'], actors: ['Student'], screens: ['Booking'], systemName: 'LabFlow' });
    assert.deepEqual(gaps.map((g) => [g.noun, g.useCases]), [['Booking Request', ['UC-01']]]);
  });
});

// ─── Dữ liệu dự án mẫu dùng chung ────────────────────────────────

const actors: ActorLite[] = [{ id: 1, name: 'Student', description: 'Books lab equipment', kind: 'PERSON', position: 0 }, { id: 2, name: 'Payment Gateway', description: null, kind: 'SYSTEM', position: 1 }];
const uc = (id: number, number: number, x: Partial<UseCaseLite & { issueId: number | null }> = {}): UseCaseLite & { issueId?: number | null } => ({
  id, number, name: `Use case ${number}`, feature: null, description: 'desc', trigger: null, preconditions: 'PRE-1', postconditions: 'POST-1',
  normalFlow: '1. Student opens the page.', alternativeFlows: null, exceptionFlows: null, priority: 'HIGH', status: 'APPROVED', primaryActorId: 1,
  secondaryActorIds: [], ruleNumbers: [], ...x,
});
const rules: RuleLite[] = [{ id: 1, number: 1, name: 'Max 3 bookings', definition: 'A student may hold at most 3 active bookings.', category: 'Constraint', status: 'APPROVED' }, { id: 2, number: 2, name: 'Unused', definition: null, category: 'Fact', status: 'DRAFT' }];
const fe = (id: number, number: number, name: string, x: Partial<FeatureLite> = {}): FeatureLite => ({ id, number, name, description: `${name} description`, scope: 'IN', priority: 'HIGH', versionId: null, epicIssueId: null, position: number, ...x });

describe('R5 FE ↔ UC', () => {
  it('liên kết tay + UC.feature "FE-n" hoặc đúng tên feature', () => {
    const fs = [fe(10, 1, 'Booking'), fe(11, 2, 'Payments'), fe(12, 3, 'Reports')];
    const m = featureUseCases(fs, [{ featureId: 12, kind: 'UC', targetId: 3 }], [uc(1, 1, { feature: 'FE-1' }), uc(2, 2, { feature: 'payments' }), uc(3, 3, { feature: 'Other' })]);
    assert.deepEqual([...m.entries()], [[10, [1]], [11, [2]], [12, [3]]]);
  });
});

describe('R6 vòng đời yêu cầu (Wiegers Figure 27-2)', () => {
  it('chỉ đi đúng luồng', () => {
    assert.ok(canMove('PROPOSED', 'APPROVED'));
    assert.ok(canMove('APPROVED', 'IMPLEMENTED'));
    assert.ok(canMove('IMPLEMENTED', 'VERIFIED'));
    assert.ok(canMove('PROPOSED', 'REJECTED'));
    assert.ok(canMove('VERIFIED', 'DELETED'));
    assert.ok(canMove('REJECTED', 'PROPOSED'));
    assert.ok(!canMove('PROPOSED', 'VERIFIED'));
    assert.ok(!canMove('PROPOSED', 'IMPLEMENTED'));
    assert.ok(!canMove('DELETED', 'APPROVED'));
  });
});

describe('R23 sáu liên kết', () => {
  const base = (): SixLinksInput => ({
    features: [fe(10, 1, 'Booking'), fe(11, 2, 'Payments'), fe(12, 3, 'Chat', { scope: 'OUT' })],
    featureLinks: [{ featureId: 11, kind: 'ISSUE', targetId: 501 }],
    useCases: [uc(1, 1, { feature: 'FE-1', ruleNumbers: [1], issueId: 500 }), uc(2, 2, { feature: 'Booking', normalFlow: '1. Student pays. See BR-01 and BR-07.' }), uc(3, 3, { status: 'PROPOSED' })],
    rules,
    requirements: [
      { issueId: 500, key: 'LAB-1', number: 1, title: 'Book', text: '', reqType: 'FUNCTIONAL', lifecycle: 'APPROVED', parentId: null },
      { issueId: 502, key: 'LAB-3', number: 3, title: 'Refund', text: '', reqType: 'FUNCTIONAL', lifecycle: 'PROPOSED', parentId: 501 },
      { issueId: 503, key: 'LAB-4', number: 4, title: 'Export', text: 'see FE-1', reqType: 'FUNCTIONAL', lifecycle: 'APPROVED', parentId: null },
      { issueId: 504, key: 'LAB-5', number: 5, title: 'Orphan', text: '', reqType: 'FUNCTIONAL', lifecycle: 'APPROVED', parentId: null },
      { issueId: 505, key: 'LAB-6', number: 6, title: 'Gone', text: '', reqType: 'FUNCTIONAL', lifecycle: 'DELETED', parentId: null },
      { issueId: 506, key: 'LAB-7', number: 7, title: 'Fast', text: '', reqType: 'QUALITY', lifecycle: 'APPROVED', parentId: null },
    ],
    dataElements: [], glossary: [], priorityRows: [{ id: 1, targetKind: 'FE', targetId: 10 }, { id: 2, targetKind: 'UC', targetId: 3 }],
    declared: { useCases: 3, screens: 2 }, actual: { useCases: 2, screens: 2, interfacingSystems: 1 },
    actors, screens: [], systemName: 'LabFlow', ignoredNouns: [], issueParent: new Map([[502, 501]]),
  });

  it('chỉ ra đúng chỗ đứt của từng liên kết', () => {
    const r = sixLinks(base());
    const by = Object.fromEntries(r.links.map((l) => [l.key, l]));
    // #1: FE-2 Payments chưa có UC; FE-3 nằm ngoài phạm vi ⇒ không xét.
    assert.equal(by.FE_UC.checked, 2);
    assert.deepEqual(by.FE_UC.gaps.map((g) => g.ref), ['FE-2']);
    // #2: UC-02 nhắc BR-01 nhưng không liệt kê + BR-07 không tồn tại (lỗi); BR-02 không UC nào dùng (cảnh báo); UC PROPOSED bỏ qua.
    assert.ok(by.UC_BR.gaps.some((g) => g.ref === 'UC-02' && /BR-07 — no such rule/.test(g.detail) && g.severity === 'error'));
    assert.ok(by.UC_BR.gaps.some((g) => g.ref === 'UC-02' && /does not list it/.test(g.detail)));
    assert.ok(by.UC_BR.gaps.some((g) => g.ref === 'BR-02' && g.severity === 'warning'));
    assert.equal(by.UC_BR.ok, false);
    // #3: LAB-1 (UC-01 đặc tả) · LAB-3 (cha 501 gắn FE-2) · LAB-4 (nhắc FE-1) truy được; LAB-5 không; LAB-6 đã xoá, LAB-7 không phải FR.
    assert.deepEqual(by.FR_TRACE.gaps.map((g) => g.ref), ['LAB-5']);
    assert.equal(by.FR_TRACE.checked, 4);
    // #5: dòng UC-03 (đề xuất, chưa nhận) không phải UC đang có.
    assert.deepEqual(by.PRIORITY_REF.gaps.map((g) => g.ref), ['row 2']);
    // #6: UC khai 3, thực tế 2; màn khớp.
    assert.deepEqual(by.COUNTS.gaps.map((g) => g.ref), ['Process Flows and/or Use Cases']);
    assert.equal(by.COUNTS.checked, 2);
    assert.equal(r.passed, 1); // chỉ #4 (DD trống nhưng luồng không có danh từ viết hoa nào)
  });

  it('sửa hết ⇒ 6/6', () => {
    const d = base();
    d.featureLinks.push({ featureId: 11, kind: 'UC', targetId: 2 });
    d.useCases[1].normalFlow = '1. Student pays (BR-01).';
    d.useCases[1].ruleNumbers = [1];
    d.rules = [rules[0]];
    d.requirements = d.requirements.filter((q) => q.key !== 'LAB-5');
    d.priorityRows = [{ id: 1, targetKind: 'FE', targetId: 10 }];
    d.declared = { useCases: 2 };
    const r = sixLinks(d);
    assert.deepEqual(r.links.map((l) => [l.n, l.ok]), [[1, true], [2, true], [3, true], [4, true], [5, true], [6, true]]);
    assert.equal(r.ok, true);
  });

  it('chưa có dữ liệu ⇒ #1/#5/#6 KHÔNG được tính là đạt (không "xanh vì rỗng")', () => {
    const r = sixLinks({ ...base(), features: [], priorityRows: [], declared: null });
    const by = Object.fromEntries(r.links.map((l) => [l.key, l]));
    assert.equal(by.FE_UC.ok, false);
    assert.equal(by.PRIORITY_REF.ok, false);
    assert.equal(by.COUNTS.ok, false);
    assert.ok(by.COUNTS.note);
  });
});

describe('mergeByKey: ô mới rỗng giữ ô người đã gõ', () => {
  it('khớp theo cột khoá, không phân biệt hoa thường', () => {
    const old = buildTable(['Stakeholder', 'Major Value', 'Attitudes'], [['student', 'saves time', 'eager']]);
    const t = mergeByKey(old, ['Stakeholder', 'Major Value', 'Attitudes'], [['Student', 'Books lab equipment', ''], ['Lab Manager', '', '']]);
    const rows = (t.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c)));
    assert.deepEqual(rows.slice(1), [['Student', 'Books lab equipment', 'eager'], ['Lab Manager', '', '']]);
  });
});

describe('R4 + R25 điền mẫu Wiegers', () => {
  const data = (): WiegersData => ({
    projectName: 'LabFlow AI', actors, rules,
    useCases: [uc(1, 1, { name: 'Book Equipment', feature: 'FE-1', ruleNumbers: [1], alternativeFlows: '1.1 Equipment busy' }), uc(2, 2, { name: 'Draft', status: 'PROPOSED' })],
    ucExtra: new Map([[1, { createdBy: 'An Nguyen', createdAt: new Date('2026-10-05T00:00:00Z') }]]),
    features: [fe(10, 1, 'Booking'), fe(11, 2, 'Chat', { scope: 'OUT', description: 'Real-time chat is out of scope for 1.0' })],
    featureLinks: [],
    requirements: [
      { issueId: 500, key: 'LAB-1', number: 1, title: 'Reserve a slot', text: 'The system shall…', reqType: 'FUNCTIONAL', lifecycle: 'APPROVED', parentId: null, subtype: null, priority: 'HIGH', source: 'Interview 1', rationale: null },
      { issueId: 501, key: 'LAB-2', number: 2, title: 'Page loads in 2 s', text: '', reqType: 'QUALITY', lifecycle: 'APPROVED', parentId: null, subtype: 'PERFORMANCE', priority: 'MEDIUM', source: null, rationale: null },
      { issueId: 502, key: 'LAB-3', number: 3, title: 'Runs on Linux', text: '', reqType: 'CONSTRAINT', lifecycle: 'APPROVED', parentId: null, subtype: null, priority: null, source: null, rationale: null },
      { issueId: 503, key: 'LAB-4', number: 4, title: 'Daily usage report', text: '', reqType: 'DATA', lifecycle: 'APPROVED', parentId: null, subtype: 'REPORT', priority: null, source: null, rationale: null },
      { issueId: 504, key: 'LAB-5', number: 5, title: 'Pay with VNPay', text: '', reqType: 'EXTERNAL_INTERFACE', lifecycle: 'APPROVED', parentId: null, subtype: 'SOFTWARE', priority: null, source: null, rationale: null },
      { issueId: 505, key: 'LAB-6', number: 6, title: 'Rejected idea', text: '', reqType: 'FUNCTIONAL', lifecycle: 'REJECTED', parentId: null, subtype: null, priority: null, source: null, rationale: null },
    ],
    dataElements: [
      { id: 1, name: 'Booking', description: 'a reservation', kind: 'STRUCTURE', composition: 'Booking ID + Booking Date', dataType: null, length: null, values: null, isKey: false, position: 0 },
      { id: 2, name: 'Booking ID', description: 'id', kind: 'PRIMITIVE', composition: null, dataType: 'integer', length: '8', values: 'sequential', isKey: true, position: 1 },
    ],
    glossary: [{ term: 'Lab Room', definition: 'A room with equipment', aliases: ['room'] }],
    assumptions: [{ number: 4, type: 'ASSUMPTION', title: 'Students have accounts', description: null, probability: null, impact: null, mitigation: null }],
    revisions: [{ name: 'An Nguyen', date: '05/10/2026', reason: 'First version', version: '1.0' }],
    ucIssue: new Map([[1, 500]]),
  });
  const erd = (dm: Parameters<typeof erdFromModel>[0]) => erdFromModel(dm, { title: 'Logical data model', sourceLabel: 'DD' }).mermaid;

  it('Vision & Scope: mục tiêu, rủi ro, giả định, FE-n, phát hành, loại trừ, stakeholder — đúng mục, giữ ô người gõ', async () => {
    const doc = clone((await getTemplate('swr-vision-scope')).doc);
    const filled = applyVisionScopeFill(doc, {
      features: [fe(10, 1, 'Booking', { versionId: 1 }), fe(11, 2, 'Analytics', { versionId: 2 }), fe(12, 3, 'Chat', { scope: 'OUT', description: 'Not in 1.0' }), fe(13, 4, 'Export')],
      releases: [{ id: 2, name: 'v1.1', releaseDate: new Date('2026-12-01'), status: 'UNRELEASED', position: 1 }, { id: 1, name: 'v1.0', releaseDate: new Date('2026-11-01'), status: 'UNRELEASED', position: 0 }],
      risks: [{ number: 2, type: 'RISK', title: 'Lab closes', description: null, probability: 4, impact: 5, mitigation: 'Use the second lab' }],
      assumptions: [{ number: 4, type: 'ASSUMPTION', title: 'Students have accounts', description: null, probability: null, impact: null, mitigation: null }, { number: 5, type: 'DEPENDENCY', title: 'SSO of the university', description: null, probability: null, impact: null, mitigation: null }],
      objectives: [{ key: 'LAB-9', title: 'Cut booking time by 50%', source: 'Brief', rationale: 'from 10 to 5 minutes' }],
      stakeholders: [{ name: 'Student', description: 'Books lab equipment' }], useCaseCount: new Map(),
    });
    assert.deepEqual(filled, ['objectives', 'risks', 'assumptions', 'features', 'initialRelease', 'laterReleases', 'limitations', 'stakeholders']);
    assert.deepEqual(tableAfter(doc, /^Business Objectives$/).slice(1), [['BO-1', 'Cut booking time by 50%', 'from 10 to 5 minutes', 'LAB-9 · Brief']]);
    assert.deepEqual(tableAfter(doc, /^Business Risks$/)[1], ['RI-2', 'Lab closes', 'High', 'High', 'Use the second lab']);
    assert.deepEqual(tableAfter(doc, /^Business Assumptions and Dependencies$/).slice(1).map((r) => r[0]), ['AS-4', 'DE-5']);
    assert.deepEqual(tableAfter(doc, /^Major Features$/).slice(1).map((r) => [r[0], r[3]]), [['FE-1', 'v1.0'], ['FE-2', 'v1.1'], ['FE-4', 'Not scheduled']]);
    assert.deepEqual(tableAfter(doc, /^Scope of Initial Release$/).slice(1).map((r) => r[0]), ['FE-1']);
    assert.deepEqual(tableAfter(doc, /^Scope of Subsequent Releases$/).slice(1).map((r) => [r[0], r[1]]), [['v1.1', '01/12/2026'], ['Not scheduled', '']]);
    assert.deepEqual(tableAfter(doc, /^Limitations and Exclusions$/)[1], ['LI-1', 'Chat (FE-3)', 'Not in 1.0']);
    assert.deepEqual(tableAfter(doc, /^Stakeholder Profiles$/)[1].slice(0, 2), ['Student', 'Books lab equipment']);
    // Project Priorities (không có dữ liệu) còn nguyên của mẫu.
    assert.deepEqual(tableAfter(doc, /^Project Priorities$/).slice(1).map((r) => r[0]), ['Schedule', 'Features', 'Quality', 'Staff', 'Cost']);
  });

  it('Use Cases: danh sách + bảng 15 hàng Wiegers, BR chỉ ghi MÃ, đề xuất không vào; bản xuất bỏ phần hướng dẫn', async () => {
    const doc = clone((await getTemplate('swr-use-cases')).doc);
    const filled = applyWiegersFill('swr-use-cases', doc, data(), { forExport: true });
    assert.ok(filled.includes('use case list') && filled.includes('use case specifications') && filled.includes('revision history'));
    assert.deepEqual(tableAfter(doc, /^Use Case List$/).slice(1), [['Student', '', 'UC-01 Book Equipment', 'desc']]);
    const spec = tableAfter(doc, /^UC-01: Book Equipment$/);
    assert.deepEqual(spec.map((r) => r[0]), [...WIEGERS_UC_ROWS]);
    assert.deepEqual(spec[1], ['Created By:', 'An Nguyen', 'Date Created:', '05/10/2026']);
    assert.equal(spec[12][1], 'BR-01');
    assert.ok(!JSON.stringify(doc).includes('Draft'));
    assert.ok(!(doc.content ?? []).some((b) => b.type === 'heading' && plainText(b) === 'Use Case Field Guidance'));
  });

  it('Business Rules + Data Dictionary: đúng cột mẫu, <Project> ⇒ tên dự án', async () => {
    const br = clone((await getTemplate('swr-business-rules')).doc);
    applyWiegersFill('swr-business-rules', br, data());
    assert.deepEqual(tableAfter(br, /^Business Rules for LabFlow AI$/)[1], ['BR-01', 'Max 3 bookings: A student may hold at most 3 active bookings.', 'Constraint', '', '']);
    const dd = clone((await getTemplate('swr-data-dictionary')).doc);
    applyWiegersFill('swr-data-dictionary', dd, data());
    assert.deepEqual(tableAfter(dd, /^Data Dictionary for LabFlow AI$/).slice(1), [['Booking', 'a reservation', 'Booking ID\n+ Booking Date', '', ''], ['Booking ID', 'id', 'integer', '8', 'sequential']]);
    assert.deepEqual(tableAfter(dd, /^Revision History$/)[1], ['An Nguyen', '05/10/2026', 'First version', '1.0']);
  });

  it('SRS: tính năng 3.n + FR, ràng buộc, giao tiếp, chất lượng, báo cáo, DD + ERD, glossary, ma trận truy vết; yêu cầu bị bác không vào', async () => {
    const doc = clone((await getTemplate('swr-srs')).doc);
    const filled = applyWiegersFill('swr-srs', doc, data(), { erd });
    for (const s of ['project scope', 'user classes', 'constraints', 'assumptions', 'system features', 'logical data model', 'data dictionary', 'software interfaces', 'performance', 'reports', 'glossary', 'traceability matrix']) assert.ok(filled.includes(s), s);
    const hs = (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b));
    assert.ok(hs.includes('3.1 Booking (FE-1)') && hs.includes('3.1.2 Functional Requirements'));
    const exact = (text: string) => {
      const b = doc.content ?? [];
      const i = b.findIndex((x) => x.type === 'heading' && plainText(x) === text);
      assert.ok(i >= 0, text);
      return (b.slice(i + 1).find((x) => x.type === 'table')!.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c)));
    };
    assert.deepEqual(exact('3.1.2 Functional Requirements').slice(1).map((r) => r[0]), ['LAB-1']);
    assert.deepEqual(tableAfter(doc, /^Design and Implementation Constraints$/).slice(1).map((r) => r[0]), ['LAB-3']);
    assert.deepEqual(tableAfter(doc, /^Software Interfaces$/).slice(1).map((r) => r[0]), ['LAB-5']);
    assert.deepEqual(tableAfter(doc, /^Performance$/).slice(1).map((r) => r[0]), ['LAB-2']);
    assert.deepEqual(tableAfter(doc, /^Reports$/).slice(1).map((r) => r[0]), ['LAB-4']);
    assert.deepEqual(tableAfter(doc, /^Appendix A: Glossary$/)[1], ['Lab Room', 'A room with equipment (also called: room)']);
    assert.deepEqual(tableAfter(doc, /^Appendix C: Requirements Traceability Matrix$/)[1], ['FE-1 Booking', 'UC-01', 'LAB-1', 'BR-01']);
    assert.deepEqual(tableAfter(doc, /^User Classes and Characteristics$/).slice(1), [['Student', 'Books lab equipment']]);
    const ldm = (doc.content ?? []).find((b) => b.type === 'codeBlock' && b.attrs?.language === 'mermaid');
    assert.match(plainText(ldm), /erDiagram/);
    assert.ok(!JSON.stringify(doc).includes('Rejected idea'));
  });
});
