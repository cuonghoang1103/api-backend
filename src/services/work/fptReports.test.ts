/**
 * CT Work đợt 3B — báo cáo Excel nộp trường, phần THUẦN (không DB):
 *   npx tsx --test src/services/work/fptReports.test.ts
 *
 *   1. Bảng quy đổi độ phức tạp (A3): phân loại theo field/transaction, man-day, cây WBS 1.0/1.1/1.1.1, tổng không đếm trùng.
 *   2. System Test 5.3 (A14): xuất ⇒ đọc lại đúng sheet/cột/3 vòng; vòng tròn xuất ⇒ nhập; nhận diện loại tệp.
 *   3. Project Tracking SEP490 / Template1 / Template4 (A23), Weekly (A21), AI Usage (A29): tên sheet + tiêu đề cột như mẫu.
 *   4. Có tệp mẫu thật của trường trên máy ⇒ so TÊN SHEET + TIÊU ĐỀ CỘT với tệp mẫu (không có thì bỏ qua).
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  buildAiUsageSheets, buildSep490Sheets, buildTemplate1Sheets, buildTemplate4Sheet, buildWbs, buildWeeklySheets, classify, DEFAULT_MATRIX,
  iterationLabel, iterIndex, mondayOf, normalizeMatrix, phaseOf, productOf, weekNumber, wbsStatusOf,
  type T1Row, type WbsSourceIssue, type WeeklyData,
} from './fptReports.js';
import {
  buildSystemSheets, detectReport, packSysNote, parseIntegrationWorkbook, unpackSysNote, type DocMeta, type ItModuleData,
} from './fptTests.js';
import { readXlsx, writeXlsx, type RSheet } from './xlsxStyled.js';

const rowOf = (sh: RSheet, r: number, from = 1, to = 15) => Array.from({ length: to - from + 1 }, (_, i) => sh.text(r, from + i));

describe('A3 — bảng quy đổi độ phức tạp', () => {
  const m = DEFAULT_MATRIX;
  it('phân loại đúng tiêu chí mẫu (≤7/≤15/>15 field, ≤3/≤7/>7 transaction)', () => {
    assert.equal(classify(5, 2, m), 'Simple');
    assert.equal(classify(7, 3, m), 'Simple');
    assert.equal(classify(8, 2, m), 'Medium');
    assert.equal(classify(5, 6, m), 'Medium', 'transaction vượt Simple ⇒ Medium');
    assert.equal(classify(16, 1, m), 'Complex');
    assert.equal(classify(3, 9, m), 'Complex');
    assert.equal(classify(null, null, m), null);
    assert.equal(classify(10, null, m), 'Medium', 'chỉ có số field vẫn phân loại được');
  });
  it('normalizeMatrix giữ mặc định khi JSON hỏng, nhận cấu hình hợp lệ', () => {
    assert.deepEqual(normalizeMatrix(null), DEFAULT_MATRIX);
    assert.deepEqual(normalizeMatrix({ levels: 'x', hoursPerDay: -1 }), DEFAULT_MATRIX);
    const c = normalizeMatrix({ levels: [{ name: 'Medium', maxFields: 20, maxTransactions: 8, manDays: 4 }], hoursPerDay: 6 });
    assert.equal(c.levels[1].manDays, 4);
    assert.equal(c.levels[1].maxFields, 20);
    assert.equal(c.levels[0].manDays, 3, 'mức không khai giữ mặc định');
    assert.equal(c.hoursPerDay, 6);
  });
  it('nhãn iteration theo chữ mẫu', () => {
    assert.equal(iterationLabel('iter2'), 'Iteration 2');
    assert.equal(iterationLabel('Iteration 3'), 'Iteration 3');
    assert.equal(iterationLabel('v1.0'), 'v1.0');
    const idx = iterIndex(['iter2', 'Release A', 'Iteration 1']);
    assert.equal(idx.get('iter2'), 2);
    assert.equal(idx.get('Iteration 1'), 1);
    assert.equal(idx.get('Release A'), 3);
  });
});

const base = { description: '', category: 'TODO', statusName: 'To Do', resolution: null, assignee: 'An', iteration: '', estimateMin: null, spentMin: 0, fieldComplexity: null, phases: [], wbs: null };
const src: WbsSourceIssue[] = [
  { ...base, id: 1, number: 1, key: 'OBS-1', title: 'Shopping', typeKey: 'EPIC', parentId: null, rank: 'b' },
  { ...base, id: 2, number: 2, key: 'OBS-2', title: 'Cart screen', typeKey: 'STORY', parentId: 1, rank: 'a', iteration: 'iter1', spentMin: 960,
    wbs: { kind: 'Screen', complexity: null, fields: 9, transactions: 2, feature: null, subFeature: null, plannedDays: null, note: null } },
  { ...base, id: 3, number: 3, key: 'OBS-3', title: 'Write SRS for cart', typeKey: 'SUBTASK', parentId: 2, rank: 'a', category: 'DONE', spentMin: 240 },
  { ...base, id: 4, number: 4, key: 'OBS-4', title: 'Checkout', typeKey: 'STORY', parentId: 1, rank: 'b', iteration: 'Iteration 2',
    wbs: { kind: 'Function', complexity: 'Complex', fields: null, transactions: null, feature: 'Payment', subFeature: null, plannedDays: 10, note: 'PayOS' } },
  { ...base, id: 5, number: 5, key: 'OBS-5', title: 'Login', typeKey: 'STORY', parentId: null, rank: 'a', estimateMin: 960, fieldComplexity: 'Simple' },
  { ...base, id: 6, number: 6, key: 'OBS-6', title: 'Cart total wrong', typeKey: 'BUG', parentId: 2, rank: 'c' },
  { ...base, id: 7, number: 7, key: 'OBS-7', title: 'Logout', typeKey: 'TASK', parentId: null, rank: 'c', estimateMin: 240 },
];

describe('A3 — cây WBS', () => {
  const res = buildWbs(src, DEFAULT_MATRIX);
  it('đánh số 1.0 / 1.1 / 1.1.1, epic trước, bỏ Bug', () => {
    assert.deepEqual(res.rows.map((r) => [r.wbs, r.key]), [
      ['1.0', 'OBS-1'], ['1.1', 'OBS-2'], ['1.1.1', 'OBS-3'], ['1.2', 'OBS-4'], ['2.0', 'OBS-5'], ['3.0', 'OBS-7'],
    ]);
    assert.ok(!res.rows.some((r) => r.typeKey === 'BUG'));
  });
  it('effort: suy từ field/transaction, ghi đè, trường Complexity, ước lượng giờ', () => {
    const by = new Map(res.rows.map((r) => [r.key, r]));
    assert.deepEqual([by.get('OBS-2')!.complexity, by.get('OBS-2')!.complexitySource, by.get('OBS-2')!.plannedDays], ['Medium', 'derived', 5]);
    assert.deepEqual([by.get('OBS-4')!.complexity, by.get('OBS-4')!.plannedSource, by.get('OBS-4')!.plannedDays], ['Complex', 'override', 10]);
    assert.deepEqual([by.get('OBS-5')!.complexity, by.get('OBS-5')!.complexitySource, by.get('OBS-5')!.plannedDays], ['Simple', 'field', 3]);
    assert.deepEqual([by.get('OBS-7')!.plannedSource, by.get('OBS-7')!.plannedDays], ['estimate', 0.5]);
    assert.equal(by.get('OBS-2')!.actualDays, 2, '960 phút / 8h');
    assert.equal(by.get('OBS-2')!.actualTotal, 2.5, 'gồm việc con 240 phút');
    assert.equal(by.get('OBS-1')!.plannedTotal, 15, 'epic = tổng cây con');
    assert.equal(by.get('OBS-4')!.feature, 'Payment');
    assert.equal(by.get('OBS-2')!.feature, 'Shopping', 'feature mặc định = epic');
  });
  it('tổng không đếm trùng cha + con; theo iteration', () => {
    assert.equal(res.totals.plannedDays, 5 + 10 + 3 + 0.5);
    assert.equal(res.totals.actualDays, 2.5);
    const it1 = res.totals.byIteration.find((x) => x.iteration === 'Iteration 1')!;
    assert.deepEqual([it1.functions, it1.plannedDays], [1, 5]);
  });
  it('trạng thái theo danh sách của mẫu', () => {
    assert.equal(wbsStatusOf({ category: 'DONE', resolution: null, phases: [], iteration: '' }), 'Tested');
    assert.equal(wbsStatusOf({ category: 'TODO', resolution: "Won't do", phases: [], iteration: '' }), 'Cancelled');
    assert.equal(wbsStatusOf({ category: 'IN_PROGRESS', resolution: null, phases: ['Done', 'Done', 'Done', '', ''], iteration: 'x' }), 'Coded');
    assert.equal(wbsStatusOf({ category: 'TODO', resolution: null, phases: [], iteration: 'iter1' }), 'Planned');
    assert.equal(wbsStatusOf({ category: 'TODO', resolution: null, phases: [], iteration: '' }), 'Pending');
  });
});

// ─── System Test 5.3 ─────────────────────────────────────────────

const meta: DocMeta = {
  projectName: 'Online Bookstore', projectCode: 'OBS', creator: 'CuongTH', reviewer: 'ThayA', version: '1.0',
  unitIssueDate: null, intIssueDate: null, environment: '1. Chrome', tcPerKloc: 100, unitNotes: null, intNotes: null,
  sysIssueDate: '2026-11-20', sysNotes: 'Round 3 = regression',
};
const login: ItModuleData = {
  name: 'Login', sheetName: null, idPrefix: 'LG', description: 'Login workflow', preCondition: 'Accounts seeded', testRequirement: 'UI, validation, flow',
  cases: [
    { section: 'Scenario A', description: 'Show login page', procedure: '1. Open /login', testData: null, expected: 'Form shown', actual: null, preConditions: 'Logged out', evidence: 'https://img/1.png', note: null,
      rounds: [{ status: 'Failed', date: '2026-11-10', tester: 'Son' }, { status: 'Passed', date: '2026-11-12', tester: 'Son' }, { status: 'Passed', date: '2026-11-18', tester: 'Tam' }] },
    { section: 'Scenario A', description: 'Empty phone', procedure: '1. Leave phone empty', testData: 'phone=', expected: 'Error shown', actual: 'No error', preConditions: null, evidence: null, note: 'Bug OBS-9',
      rounds: [{ status: 'Failed', date: '2026-11-10', tester: 'Son' }] },
    { section: 'Scenario B', description: 'Admin login', procedure: null, testData: null, expected: 'Dashboard', actual: null, preConditions: null, evidence: null, note: null, rounds: [] },
  ],
};
const pay: ItModuleData = { ...login, name: 'Pay Invoice', idPrefix: 'PI', cases: [{ ...login.cases[2], section: null, rounds: [{ status: 'N/A', date: null, tester: null }] }] };

describe('A14 — System Test 5.3', () => {
  const sheets = readXlsx(writeXlsx(buildSystemSheets({ meta, changes: [], workflows: [login, pay] })));
  const by = (n: string) => sheets.find((s) => s.name === n)!;
  it('sheet: Cover · Test Cases · Test Statistics · 1 sheet/workflow', () => {
    assert.deepEqual(sheets.map((s) => s.name), ['Cover', 'Test Cases', 'Test Statistics', 'Login', 'Pay Invoice']);
    assert.equal(by('Cover').text(2, 2), 'SYSTEM TEST REPORT DOCUMENT');
    assert.equal(by('Cover').text(6, 2), 'OBS_TestReport5.3_v1.0');
    assert.equal(detectReport(sheets), 'system');
  });
  it('Test Cases + Test Statistics đúng nhãn/cột của mẫu', () => {
    const tc = by('Test Cases');
    assert.equal(tc.text(1, 4), 'TEST CASE LIST');
    assert.deepEqual(rowOf(tc, 8, 2, 6), ['No', 'Function Name', 'Sheet Name', 'Description', 'Pre-Condition']);
    const ts = by('Test Statistics');
    assert.equal(ts.text(1, 2), 'TEST STATISTICS');
    assert.deepEqual(rowOf(ts, 10, 2, 8), ['No', 'Module code', 'Passed', 'Failed', 'Pending', 'N/A', 'Number of  test cases']);
    // Login vòng cuối = 3: 1 Passed; 2 ca chưa chạy vòng 3 ⇒ Pending.
    assert.deepEqual([ts.get(11, 4), ts.get(11, 5), ts.get(11, 6), ts.get(11, 7), ts.get(11, 8)], [1, 0, 2, 0, 3]);
    assert.equal(ts.text(13, 3), 'Sub total');
  });
  it('sheet workflow: Workflow/Test requirement/Number of TCs, Round 1–3, bảng ở hàng 10', () => {
    const s = by('Login');
    assert.deepEqual([s.text(2, 1), s.text(3, 1), s.text(4, 1), s.text(5, 1)], ['Workflow', 'Test requirement', 'Number of TCs', 'Testing Round']);
    assert.deepEqual([s.text(6, 1), s.text(7, 1), s.text(8, 1)], ['Round 1', 'Round 2', 'Round 3']);
    assert.equal(s.text(9, 1), '', 'không có Round 4');
    assert.deepEqual(rowOf(s, 10, 1, 15), ['Test Case ID', 'Test Case Description', 'Test Case Procedure', 'Expected Results', 'Pre-conditions', 'Round 1', 'Test date', 'Tester', 'Round 2', 'Test date', 'Tester', 'Round 3', 'Test date', 'Tester', 'Note']);
    assert.equal(s.text(11, 1), 'Scenario A');
    assert.equal(s.text(12, 1), '<LG1>');
    assert.deepEqual([s.get(6, 2), s.get(6, 3)], [0, 2], 'Round 1: 0 Passed, 2 Failed');
    assert.equal(s.text(2, 18), 'Passed', 'danh sách thả xuống ở R2:R5 như mẫu');
  });
  it('vòng tròn xuất ⇒ nhập giữ case, 3 vòng, Evidence/Actual gói trong Note', () => {
    const parsed = parseIntegrationWorkbook(sheets, { system: true });
    assert.equal(parsed.modules.length, 2);
    const l = parsed.modules[0];
    assert.equal(l.name, 'Login');
    assert.equal(l.idPrefix, 'LG');
    assert.equal(l.cases.length, 3);
    assert.equal(l.cases[0].rounds.length, 3);
    assert.equal(l.cases[0].rounds[2].tester, 'Tam');
    assert.equal(l.cases[0].evidence, 'https://img/1.png');
    assert.equal(l.cases[1].actual, 'No error');
    assert.equal(l.cases[1].note, 'Bug OBS-9');
    assert.equal(l.cases[1].testData, 'phone=');
    assert.equal(l.cases[2].section, 'Scenario B');
    assert.equal(parsed.cover.issueDate, '2026-11-20');
    assert.equal(parsed.notes, 'Round 3 = regression');
  });
  it('gói/tách Note của 5.3', () => {
    assert.deepEqual(unpackSysNote(packSysNote('500 page', 'http://x', 'see bug')), { actual: '500 page', note: 'see bug', evidence: 'http://x' });
    assert.deepEqual(unpackSysNote('evidence: in the middle of a sentence'), { actual: null, note: 'evidence: in the middle of a sentence', evidence: null });
  });
});

// ─── Project Tracking / Weekly / AI usage ────────────────────────

describe('A23 — Project Tracking SEP490 / Template1 / Template4', () => {
  const wbs = buildWbs(src, DEFAULT_MATRIX);
  const sheets = readXlsx(writeXlsx(buildSep490Sheets({
    matrix: DEFAULT_MATRIX,
    scope: [{ wbs: '1.0', title: 'Stage 1: Initiating', bold: true, estDays: null, inCharge: '', deadline: '', status: 'Completed', actualDays: null, notes: '' },
      { wbs: '1.1', title: 'Report 1', bold: false, estDays: 7, inCharge: 'An', deadline: 'Week1', status: 'Completed', actualDays: 6.5, notes: 'OBS-10' }],
    wbs: wbs.rows,
    qa: [{ date: '2026-10-01', question: 'Pay by PayOS?', by: 'An', to: 'ThayA', priority: 'Medium', due: null, status: 'Open', notes: '' }],
    timelogs: [{ date: '2026-10-02', reporter: 'An', task: 'OBS-2 Cart', hours: 2.5, activity: 'Coding', type: 'Newly-Create', product: 'Software Package', workProduct: 'Iteration 1', status: 'Submitted', updated: '2026-10-02', notes: '' }],
    defects: [{ date: '2026-10-03', description: 'OBS-6 Cart total wrong', activity: 'ST', product: 'Software Package', productDetails: 'Cart', assigner: 'Binh', assignee: 'An', status: 'Fixing', updated: '2026-10-04', notes: '' }],
    issues: [{ date: '2026-10-01', issue: 'Missing stakeholder', type: '', priority: 'High', created: 'An', owner: 'Binh', due: null, status: 'Open', notes: '' }],
  })));
  const by = (n: string) => sheets.find((s) => s.name === n)!;
  it('6 sheet đúng tên + tiêu đề cột của Report2_Project Tracking', () => {
    assert.deepEqual(sheets.map((s) => s.name), ['Scope', 'WBS', 'Q&A', 'TimeLogs', 'Defects', 'Issues']);
    assert.deepEqual(rowOf(by('Scope'), 1, 1, 8), ['#', 'Work Package', 'Est. Effort\n(pds)', 'In Charge', 'Deadline', 'Status', 'Actual Effort (pds)', 'Notes']);
    assert.deepEqual(rowOf(by('WBS'), 1, 1, 11), ['#', 'Function/Screen', 'Type', 'Feature', 'Sub Feature', 'Function/Screen Description', 'Level*', 'Est. Effort', 'Planned', 'Status', 'Notes']);
    assert.deepEqual(rowOf(by('Q&A'), 2, 1, 8), ['Date', 'Question', 'By', 'To', 'Priority', 'Due Date', 'Status', 'Notes (answers or any other notes)']);
    assert.deepEqual(rowOf(by('TimeLogs'), 2, 1, 11), ['Date', 'Reporter', 'Task', '# hours', 'Activity', 'Type', 'Product', 'Work Product', 'Status', 'Updated', 'Notes']);
    assert.deepEqual(rowOf(by('Defects'), 2, 1, 10), ['Date', 'Defect Description', 'Activity', 'Product', 'Product Details', 'Assigner', 'Assignee', 'Status', 'Updated', 'Notes']);
    assert.deepEqual(rowOf(by('Issues'), 2, 1, 9), ['Date', 'Issue', 'Type', 'Priority', 'Created', 'Owner', 'Due Date', 'Status', 'Notes']);
  });
  it('WBS: bảng tiêu chí + tổng theo iteration + công thức effort của mẫu', () => {
    const w = by('WBS');
    assert.deepEqual([w.text(2, 2), w.text(2, 3), w.text(2, 4)], ['Simple', '<=7 fields', '<= 3 transactions']);
    assert.deepEqual([w.text(4, 2), w.text(4, 3)], ['Complex', '>15 fields']);
    assert.deepEqual([w.text(2, 8), w.text(2, 9), w.text(2, 10)], ['Planned', 'Functions', 'Total Effort']);
    const data = 7;
    assert.equal(w.text(data, 1), '1.0');
    const cart = [...Array(10)].map((_, i) => data + i).find((r) => w.text(r, 13) === 'OBS-2')!;
    assert.equal(w.get(cart, 8), 5, 'giá trị tính sẵn của công thức IF(G="Complex",7,…)');
    assert.equal(w.text(cart, 7), 'Medium');
    assert.equal(w.text(cart, 9), 'Iteration 1');
  });
  it('Template1: Project + Iter1…Iter4, cột SRS/SDS', () => {
    const rows: T1Row[] = [
      { screen: 'Login', feature: 'Common', actor: 'User', description: 'd', inCharge: 'An', status: 'Done', actual: 'iter1', updated: 'none', details: '', iteration: 'iter1', srs: 'Done', sds: 'Doing', notes: '' },
      { screen: 'Cart', feature: 'Shop', actor: 'User', description: 'd', inCharge: 'Binh', status: 'To Do', actual: '', updated: 'none', details: '', iteration: 'iter3', srs: 'Pending', sds: '', notes: '' },
    ];
    const t1 = readXlsx(writeXlsx(buildTemplate1Sheets(rows)));
    assert.deepEqual(t1.map((s) => s.name), ['Project', 'Iter1', 'Iter2', 'Iter3', 'Iter4']);
    assert.deepEqual(rowOf(t1[0], 3, 1, 10), ['#', 'Screen/Function', 'Feature', 'Actor', 'Screen/Function Description', 'In Charge', 'Status', 'Actual', 'Updated', 'Update Details']);
    assert.deepEqual(rowOf(t1[1], 5, 1, 9), ['#', 'Screen / Function', 'Feature', 'Screen/Function Description', 'In Charge', 'Status', 'SRS', 'SDS', 'Notes']);
    assert.equal(t1[1].text(6, 2), 'Login');
    assert.equal(t1[3].text(6, 2), 'Cart');
    assert.equal(t1[2].text(6, 2), '', 'Iter2 trống');
  });
  it('Template4: Issues Report kiểu GitLab', () => {
    const t4 = readXlsx(writeXlsx([buildTemplate4Sheet([{ title: 'User Login Screen', description: 'x', id: 1, url: 'https://x/1', state: 'Open', assignee: 'An', createdAt: new Date('2026-10-01T03:00:00Z'), dueDate: '2026-10-08', milestone: 'iter2', labels: 'WP, 2_Doing', functions: 'User Login' }])]));
    assert.deepEqual(t4.map((s) => s.name), ['Issues Report']);
    assert.deepEqual(rowOf(t4[0], 1, 1, 11), ['Title', 'Description', 'Issue ID', 'URL', 'State', 'Assignee', 'Created At', 'Due Date', 'Milestone', 'Labels', 'Functions/Screens']);
    assert.equal(t4[0].text(2, 10), 'WP, 2_Doing');
  });
  it('sản phẩm / pha SDLC đoán theo chữ', () => {
    assert.equal(productOf('Write Report 3 SRS v1.0'), 'Report3 (SRS)');
    assert.equal(productOf('Implement cart API'), 'Software Package');
    assert.equal(phaseOf('Draw ERD', 'TASK'), 'Design');
    assert.equal(phaseOf('Login', 'TEST'), 'Testing');
  });
});

describe('A21 — Weekly Report', () => {
  const data: WeeklyData = {
    status: [{ task: 'Report 1', inCharge: 'all', status: 'Completed', notes: 'OBS-1' }],
    issues: [{ issue: 'Missing stakeholder', owner: 'An', status: 'Pending', notes: '' }],
    plan: [{ task: 'Report 2', inCharge: 'Binh', deadline: '2026-10-12', notes: '' }],
    matters: [], grades: [{ name: 'An', grade: 8 }, { name: 'Binh', grade: null }],
  };
  it('mondayOf / weekNumber', () => {
    assert.equal(mondayOf('2026-10-09'), '2026-10-05');
    assert.equal(mondayOf('2026-10-05'), '2026-10-05');
    assert.equal(mondayOf('2026-10-11'), '2026-10-05', 'Chủ nhật thuộc tuần bắt đầu thứ Hai trước');
    assert.equal(weekNumber('2026-10-12', '2026-10-01'), 3);
    assert.equal(weekNumber('2026-10-12', null), null);
  });
  it('mỗi tuần một sheet, đủ 5 mục như mẫu', () => {
    const s = readXlsx(writeXlsx(buildWeeklySheets('G108', [{ weekStart: '2026-10-05', weekNo: 2, data }, { weekStart: '2026-10-12', weekNo: 3, data }])));
    assert.deepEqual(s.map((x) => x.name), ['Week 2', 'Week 3']);
    const w = s[0];
    assert.deepEqual([w.text(1, 1), w.text(2, 1), w.text(2, 2), w.text(3, 1), w.text(3, 2)], ['WEEKLY REPORT', 'Group', 'G108', 'Week', '05/10/2026-11/10/2026']);
    assert.equal(w.text(4, 1), 'I. Status Report');
    assert.deepEqual(rowOf(w, 5, 1, 5), ['#', 'Project Task', 'In-charge', 'Status', 'Notes (Work Item in Details)']);
    assert.equal(w.text(6, 2), 'Report 1');
    const col = Array.from({ length: w.maxRow }, (_, i) => w.text(i + 1, 1));
    for (const t of ['II. Project Issues', 'III. Next Week Plan', 'IV. Other Project Matters/Suggestions', 'V. Personal Grade']) assert.ok(col.includes(t), t);
    const g = col.indexOf('V. Personal Grade') + 2;
    assert.deepEqual(rowOf(w, g, 1, 3), ['#', 'Name', 'Grade']);
    assert.deepEqual([w.text(g + 1, 2), w.get(g + 1, 3)], ['An', 8]);
  });
});

describe('A29 — AI Usage Report', () => {
  it('0.Overview · n. Week n · Instruction, cột như Template0', () => {
    const s = readXlsx(writeXlsx(buildAiUsageSheets(
      { subjectCode: 'SWP391', subjectName: 'Software development project', classCode: 'SE1801', semester: 'Fall 2026', lecturer: 'ThayA', groupCode: 'G1', projectTitle: 'Bookstore', students: [{ code: 'HE1', name: 'An', role: 'Leader', aiTools: 'ChatGPT' }] },
      [{ weekNo: 1, label: 'Week 1', rows: [{ usedAt: '2026-10-01', phase: 'Requirement', task: 'User stories', tool: 'ChatGPT', output: '10 stories', validation: 'kept 5', evidence: 'link', measure: '5 kept', value: 4, risks: 'off scope' }] },
        { weekNo: 3, label: 'Week 3', rows: [] }],
    )));
    assert.deepEqual(s.map((x) => x.name), ['0.Overview', '1. Week 1', '2. Week 3', 'Instruction ']);
    assert.equal(s[0].text(1, 1), 'SWP391- Project AI Usage Report');
    assert.deepEqual(rowOf(s[0], 11, 1, 5), ['No', 'StudentCode', 'StudentName', 'Role In Group', 'AI Tool Usaged']);
    assert.deepEqual(rowOf(s[1], 1, 1, 10), ['No.', 'SDLC Phase', 'Task / Activity', 'AI Tool Used', 'AI Output', 'Student’s Validation / Modification', 'Evidence / Link', 'Quantitative Measure', 'Value Added (1-5)', 'Risks / Limitations Observed']);
    assert.deepEqual([s[1].text(2, 2), s[1].get(2, 9)], ['Requirement', 4]);
    assert.deepEqual([s[3].text(1, 1), s[3].text(1, 2)], ['Column', 'Description & How to Fill']);
  });
});

// ─── So với tệp MẪU THẬT của trường (nếu có trên máy) ────────────

const DOCS = path.join(os.homedir(), 'Documents');
const tpl = (...p: string[]) => { const f = path.join(DOCS, ...p); return fs.existsSync(f) ? readXlsx(fs.readFileSync(f)) : null; };
/** Tiêu đề cột của một hàng (bỏ ô trống ở đuôi). */
const heads = (sh: RSheet, r: number, n: number) => rowOf(sh, r, 1, n).map((x) => x.replace(/\s+/g, ' ').trim());

describe('So với tệp mẫu thật (bỏ qua nếu không có)', () => {
  it('Report5.3_System Test.xlsx: tiêu đề sheet workflow + Test Statistics trùng', (t) => {
    const real = tpl('Report Đồ án', 'Report5.3_System Test.xlsx');
    if (!real) return t.skip('không có tệp mẫu');
    const mine = readXlsx(writeXlsx(buildSystemSheets({ meta, changes: [], workflows: [login] })));
    assert.deepEqual(mine.slice(0, 3).map((s) => s.name), real.slice(0, 3).map((s) => s.name));
    const rw = real.find((s) => s.name === 'Login')!;
    assert.deepEqual(heads(mine[3], 10, 15), heads(rw, 10, 15));
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map((r) => mine[3].text(r, 1)), [1, 2, 3, 4, 5, 6, 7, 8].map((r) => rw.text(r, 1)));
    assert.deepEqual(heads(mine[2], 10, 8), heads(real.find((s) => s.name === 'Test Statistics')!, 10, 8));
    assert.deepEqual(heads(mine[1], 8, 6), heads(real.find((s) => s.name === 'Test Cases')!, 8, 6));
    assert.equal(parseIntegrationWorkbook(real, { system: true }).modules.length >= 5, true, 'nhập được tệp mẫu của nhóm');
    assert.equal(detectReport(real), 'system');
  });
  it('Report2_Project Tracking.xlsx: 6 sheet + tiêu đề cột trùng', (t) => {
    const real = tpl('Report Đồ án', 'Report2_Project Tracking.xlsx');
    if (!real) return t.skip('không có tệp mẫu');
    const mine = readXlsx(writeXlsx(buildSep490Sheets({ matrix: DEFAULT_MATRIX, scope: [], wbs: [], qa: [], timelogs: [], defects: [], issues: [] })));
    assert.deepEqual(mine.map((s) => s.name), real.map((s) => s.name));
    const pairs: Array<[string, number, number]> = [['Scope', 1, 8], ['WBS', 1, 11], ['Q&A', 2, 8], ['TimeLogs', 2, 11], ['Defects', 2, 10], ['Issues', 2, 9]];
    for (const [n, r, c] of pairs) assert.deepEqual(heads(mine.find((s) => s.name === n)!, r, c), heads(real.find((s) => s.name === n)!, r, c), n);
  });
  it('SWP391 Template0/1/4 + Weekly Report: tên sheet + tiêu đề cột trùng', (t) => {
    const m = ['Slide-Document', 'SWP391', 'materials'];
    const t1 = tpl(...m, 'Template1_Project Tracking.xlsx');
    const t4 = tpl(...m, 'Template4_Issues Report.xlsx');
    const t0 = tpl(...m, 'Template0__SWP391_AI_Usage_Report_ Template.xlsx');
    const wk = tpl('Report Đồ án', 'SEP490_G108_Weekly Report.xlsx');
    if (!t1 || !t4 || !t0 || !wk) return t.skip('không có tệp mẫu');
    const mine1 = readXlsx(writeXlsx(buildTemplate1Sheets([])));
    assert.deepEqual(mine1.map((s) => s.name), t1.map((s) => s.name));
    assert.deepEqual(heads(mine1[0], 3, 10), heads(t1[0], 3, 10));
    assert.deepEqual(heads(mine1[1], 5, 9), heads(t1[1], 5, 9));
    const mine4 = readXlsx(writeXlsx([buildTemplate4Sheet([])]));
    assert.deepEqual(heads(mine4[0], 1, 11), heads(t4[0], 1, 11));
    const mine0 = readXlsx(writeXlsx(buildAiUsageSheets({ subjectCode: null, subjectName: null, classCode: null, semester: null, lecturer: null, groupCode: null, projectTitle: null, students: [] }, [])));
    assert.deepEqual([mine0[0].name, mine0[mine0.length - 1].name], [t0[0].name, t0[t0.length - 1].name]);
    assert.deepEqual(heads(mine0[1], 1, 10), heads(t0[1], 1, 10));
    assert.deepEqual(heads(mine0[0], 11, 5), heads(t0[0], 11, 5));
    assert.deepEqual([2, 3, 4, 5, 6, 7, 8].map((r) => mine0[0].text(r, 1)), [2, 3, 4, 5, 6, 7, 8].map((r) => t0[0].text(r, 1)));
    const w = readXlsx(writeXlsx(buildWeeklySheets('G', [{ weekStart: '2026-10-05', weekNo: 2, data: { status: [], issues: [], plan: [], matters: [], grades: [] } }])))[0];
    assert.deepEqual(heads(w, 5, 5), heads(wk[0], 5, 5));
    const sec = (sh: RSheet) => Array.from({ length: Math.min(sh.maxRow, 60) }, (_, i) => sh.text(i + 1, 1)).filter((x) => /^(I|II|III|IV|V)\. /.test(x)).map((x) => x.replace(/Masters/, 'Matters'));
    assert.deepEqual(sec(w), sec(wk[0]), 'đủ 5 mục I–V (mẫu gõ "Masters", CT Work viết đúng "Matters")');
  });
});
