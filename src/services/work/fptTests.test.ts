/**
 * CT Work đợt 1b — tài liệu kiểm thử chuẩn FPT, phần THUẦN (không DB):
 *   npx tsx --test src/services/work/fptTests.test.ts
 *
 *   1. Thống kê unit (P/F/Untested/N/A/B), chỉ tiêu 100 TC/KLOC, integration (vòng cuối có kết quả).
 *   2. Xuất 5.1 ⇒ đọc lại: đúng tên sheet, tiêu đề cột, vị trí ma trận, dấu O, công thức + giá trị tính sẵn.
 *   3. Xuất 5.2 ⇒ đọc lại: Cover / Test Cases / Test Statistics / sheet module, 4 vòng chạy.
 *   4. Vòng tròn: xuất ⇒ nhập ⇒ dữ liệu như cũ (kể cả khoảng trắng của giá trị biên, Test data / Actual gói trong ô).
 *   5. Nếu có tệp mẫu của trường ở ~/Downloads thì nhập được (đếm hàm/module) — không có thì bỏ qua.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  buildIntegrationSheets, buildUnitSheets, defaultIdPrefix, detectReport, itCurrentStatus, itStats, packNote, packProcedure,
  parseIntegrationWorkbook, parseUnitWorkbook, requiredCases, unitStats, unitSummary, unpackNote, unpackProcedure,
  type DocMeta, type ItModuleData, type UnitFunctionData,
} from './fptTests.js';
import { readXlsx, writeXlsx } from './xlsxStyled.js';

const meta: DocMeta = {
  projectName: 'Online Bookstore', projectCode: 'OBS', creator: 'CuongTH', reviewer: 'ThayA', version: '1.0',
  unitIssueDate: '2026-10-01', intIssueDate: '2026-10-05', environment: '1. Node 22\n2. PostgreSQL 16\n3. Chrome', tcPerKloc: 100,
  unitNotes: 'Unit notes', intNotes: null,
};

const login: UnitFunctionData = {
  moduleName: 'AuthService', methodName: 'Login', sheetName: null, description: 'Authenticates a user', preCondition: 'Account exists',
  testRequirement: 'Valid credentials log in; invalid ones show an error', codeRef: 'src/auth.ts#L10', loc: 50, createdBy: 'Cuong', executedBy: 'Cuong',
  rows: [
    { key: 'p', section: 'COND', groupName: 'Precondition', label: null, value: 'Connected to the server' },
    { key: 'e1', section: 'COND', groupName: 'email', label: null, value: 'a@b.co' },
    { key: 'e2', section: 'COND', groupName: 'email', label: 'with space', value: 'a@b.co    ' },
    { key: 'pw', section: 'COND', groupName: 'password', label: null, value: 'Test123@' },
    { key: 't', section: 'CONFIRM', groupName: 'Return', label: null, value: 'true' },
    { key: 'f', section: 'CONFIRM', groupName: 'Return', label: null, value: 'false' },
    { key: 'x', section: 'CONFIRM', groupName: 'Exception', label: null, value: null },
    { key: 'l', section: 'CONFIRM', groupName: 'Log message', label: null, value: '"Login successful"' },
  ],
  cases: [
    { key: 'c1', type: 'N', result: 'P', executedAt: '2026-10-02', defectId: null, note: null },
    { key: 'c2', type: 'B', result: 'F', executedAt: '2026-10-02', defectId: 'OBS-12', note: null },
    { key: 'c3', type: 'A', result: null, executedAt: null, defectId: null, note: null },
  ],
  marks: [['p', 'c1'], ['e1', 'c1'], ['pw', 'c1'], ['t', 'c1'], ['l', 'c1'], ['p', 'c2'], ['e2', 'c2'], ['pw', 'c2'], ['f', 'c2'], ['p', 'c3'], ['f', 'c3']],
};
const register: UnitFunctionData = {
  ...login, methodName: 'Register', loc: null, rows: [{ key: 'p', section: 'COND', groupName: 'Precondition', label: null, value: 'x' }],
  cases: [{ key: 'c1', type: 'N', result: 'P', executedAt: null, defectId: null, note: null }], marks: [['p', 'c1']],
};
const addBook: UnitFunctionData = { ...register, moduleName: 'BookService', methodName: 'AddBook' };

const authModule: ItModuleData = {
  name: 'Authentication', sheetName: null, idPrefix: 'AT', description: 'Login flow across UI, API and DB', preCondition: 'Accounts seeded',
  testRequirement: '- Login works\n- Logout clears the session',
  cases: [
    { section: 'Login', description: 'Login with valid credentials', procedure: '1. Open /login\n2. Submit', testData: 'email=a@b.co', expected: 'Home page shown', actual: null, preConditions: 'Account active', evidence: 'https://img/1.png', note: null,
      rounds: [{ status: 'Failed', date: '2026-10-05', tester: 'Cuong' }, { status: 'Passed', date: '2026-10-06', tester: 'Cuong' }] },
    { section: 'Login', description: 'Wrong password', procedure: '1. Open /login', testData: null, expected: 'Error shown', actual: 'Shows a 500 page', preConditions: null, evidence: null, note: 'Bug OBS-20',
      rounds: [{ status: 'Failed', date: '2026-10-05', tester: 'Cuong' }] },
    { section: 'Logout', description: 'Logout', procedure: null, testData: null, expected: 'Back to login', actual: null, preConditions: null, evidence: null, note: null, rounds: [] },
  ],
};
const cartModule: ItModuleData = { ...authModule, name: 'Shopping cart', idPrefix: 'SC', cases: [{ ...authModule.cases[2], section: null, rounds: [{ status: 'N/A', date: null, tester: null }] }] };

describe('FPT test reports — thống kê', () => {
  it('unitStats đếm P/F/Untested và N/A/B', () => {
    assert.deepEqual(unitStats(login.cases), { passed: 1, failed: 1, untested: 1, n: 1, a: 1, b: 1, total: 3 });
  });
  it('chỉ tiêu 100 TC/KLOC: 50 LOC ⇒ 5 TC; LOC trống ⇒ không đánh giá', () => {
    assert.equal(requiredCases(50, 100), 5);
    assert.equal(requiredCases(1001, 100), 101);
    assert.equal(requiredCases(null, 100), null);
    const s = unitSummary([login, register], 100);
    assert.equal(s.total, 4);
    assert.equal(s.totalLoc, 50);
    assert.equal(s.requiredCases, 5);
    assert.equal(s.belowNorm, 1, 'Login có 3 < 5 TC');
    assert.equal(s.meetsNorm, false);
    assert.equal(s.functionsWithoutLoc, 1);
    assert.equal(s.coverage, 75);
    assert.equal(unitSummary([register], 100).meetsNorm, null);
  });
  it('integration: trạng thái = vòng cuối có kết quả; chưa chạy = Pending', () => {
    assert.equal(itCurrentStatus(authModule.cases[0].rounds), 'Passed');
    assert.equal(itCurrentStatus([]), 'Pending');
    const s = itStats(authModule.cases);
    assert.deepEqual([s.passed, s.failed, s.pending, s.na, s.total, s.lastRound], [1, 1, 1, 0, 3, 2]);
    assert.deepEqual(s.rounds[0], { passed: 0, failed: 2, pending: 0, na: 0 });
  });
  it('gói/tách Test data và Actual trong ô của mẫu', () => {
    assert.deepEqual(unpackProcedure(packProcedure('1. Open', 'x=1')), { procedure: '1. Open', testData: 'x=1' });
    assert.deepEqual(unpackProcedure('1. Open'), { procedure: '1. Open', testData: null });
    assert.deepEqual(unpackNote(packNote('500 page', 'Bug 20')), { actual: '500 page', note: 'Bug 20' });
    assert.deepEqual(unpackNote('just a note'), { actual: null, note: 'just a note' });
    assert.equal(defaultIdPrefix('Authentication'), 'AT');
    assert.equal(defaultIdPrefix('UserManagement'), 'UM');
  });
});

describe('FPT Report 5.1 — xuất đúng cấu trúc mẫu', () => {
  const buf = writeXlsx(buildUnitSheets({ meta, changes: [], functions: [login, register, addBook] }));
  const sheets = readXlsx(buf);
  const by = (n: string) => sheets.find((s) => s.name === n)!;

  it('sheet: Guideline · Cover · Functions · Statistics · 1 sheet/hàm (tên mặc định viết thường chữ đầu)', () => {
    assert.deepEqual(sheets.map((s) => s.name), ['Guideline', 'Cover', 'Functions', 'Statistics', 'login', 'register', 'addBook']);
    assert.equal(detectReport(sheets), 'unit');
  });
  it('Cover: nhãn + Record of change như mẫu', () => {
    const c = by('Cover');
    assert.equal(c.text(2, 2), 'UNIT TEST DOCUMENT');
    assert.deepEqual([c.text(4, 1), c.text(5, 1), c.text(6, 1), c.text(4, 5), c.text(5, 5), c.text(6, 5)], ['Project Name', 'Project Code', 'Document Code', 'Creator', 'Issue Date', 'Version']);
    assert.equal(c.text(6, 2), 'OBS_TestReport_v1.0', 'công thức có giá trị tính sẵn');
    assert.deepEqual([1, 2, 3, 4, 5, 6].map((col) => c.text(10, col)), ['Effective Date', 'Version', 'Change Item', '*A,D,M', 'Change description', 'Reference']);
    assert.equal(c.text(11, 1), '2026-10-01', 'ngày dạng ô ngày Excel');
    assert.ok(c.merges.includes('B2:F2') && c.merges.includes('B4:D4'));
  });
  it('Functions: tiêu đề cột A–F đúng mẫu + gộp ô module + liên kết sang sheet', () => {
    const f = by('Functions');
    assert.deepEqual([1, 2, 3, 4, 5, 6].map((col) => f.text(10, col)), ['No', 'Module Name', 'Method Name', 'Sheet Name', 'Description', 'Pre-Condition']);
    assert.equal(f.text(6, 1), 'Normal number of Test cases/KLOC');
    assert.equal(f.get(6, 5), 100);
    assert.equal(f.text(11, 2), 'AuthService');
    assert.ok(f.merges.includes('B11:B12'), 'module AuthService gộp 2 dòng');
    assert.equal(f.links.get('D11'), 'login');
  });
  it('Statistics: cột như mẫu + công thức tham chiếu sheet hàm + Sub total', () => {
    const s = by('Statistics');
    assert.deepEqual([2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => s.text(9, col)), ['No', 'Function code', 'Passed', 'Failed', 'Untested', 'N', 'A', 'B', 'Total Test Cases']);
    assert.deepEqual([4, 5, 6, 7, 8, 9, 10].map((col) => s.get(10, col)), [1, 1, 1, 1, 1, 1, 3]);
    assert.equal(s.text(13, 3), 'Sub total');
    assert.equal(s.get(13, 10), 5);
  });
  it('sheet hàm: đầu sheet, UTCID ở hàng 7 từ cột E, Condition/Confirm/Result, dấu O, bộ đếm hàng 5', () => {
    const l = by('login');
    assert.deepEqual([l.text(1, 1), l.text(1, 3), l.text(1, 5), l.text(1, 14)], ['Code Module', 'AuthService', 'Method', 'Login']);
    assert.deepEqual([l.text(4, 1), l.text(4, 3), l.text(4, 5), l.text(4, 10), l.text(4, 13)], ['Passed', 'Failed', 'Untested', 'N/A/B', 'Total Test Cases']);
    assert.deepEqual([l.get(5, 1), l.get(5, 3), l.get(5, 5), l.get(5, 10), l.get(5, 11), l.get(5, 12), l.get(5, 13)], [1, 1, 1, 1, 1, 1, 3]);
    assert.deepEqual([5, 6, 7].map((c) => l.text(7, c)), ['UTCID01', 'UTCID02', 'UTCID03']);
    assert.equal(l.text(8, 1), 'Condition');
    assert.equal(l.text(8, 2), 'Precondition');
    assert.equal(l.text(9, 4), 'Connected to the server');
    assert.deepEqual([5, 6, 7].map((c) => l.text(9, c)), ['O', 'O', 'O']);
    const confirmRow = [...Array(l.maxRow).keys()].map((i) => i + 1).find((r) => l.text(r, 1) === 'Confirm')!;
    assert.equal(l.text(confirmRow, 2), 'Return');
    const resultRow = [...Array(l.maxRow).keys()].map((i) => i + 1).find((r) => l.text(r, 1) === 'Result')!;
    assert.deepEqual([5, 6, 7].map((c) => l.text(resultRow, c)), ['N', 'B', 'A']);
    assert.deepEqual([5, 6, 7].map((c) => l.text(resultRow + 1, c)), ['P', 'F', '']);
    assert.equal(l.text(resultRow + 3, 6), 'OBS-12');
  });
  it('vòng tròn: xuất ⇒ nhập lại ⇒ cùng dữ liệu (giữ khoảng trắng giá trị biên)', () => {
    const p = parseUnitWorkbook(sheets);
    assert.equal(p.functions.length, 3);
    assert.equal(p.tcPerKloc, 100);
    assert.equal(p.cover.projectCode, 'OBS');
    assert.equal(p.reviewer, 'ThayA');
    assert.equal(p.environment, meta.environment);
    const f = p.functions[0];
    assert.deepEqual([f.moduleName, f.methodName, f.loc, f.createdBy, f.testRequirement], ['AuthService', 'Login', 50, 'Cuong', login.testRequirement]);
    assert.deepEqual(f.rows.map((r) => [r.section, r.groupName, r.label, r.value]), login.rows.map((r) => [r.section, r.groupName, r.label, r.value]));
    assert.deepEqual(f.cases.map((c) => [c.type, c.result, c.executedAt, c.defectId]), login.cases.map((c) => [c.type, c.result, c.executedAt, c.defectId]));
    const keyOf = (rows: UnitFunctionData['rows'], k: string) => rows.findIndex((r) => r.key === k);
    const marks = (fn: UnitFunctionData) => fn.marks.map(([r, c]) => `${keyOf(fn.rows, r)}:${fn.cases.findIndex((x) => x.key === c)}`).sort();
    assert.deepEqual(marks(f), marks(login));
    assert.deepEqual(p.warnings, []);
  });
});

describe('FPT Report 5.2 — xuất đúng cấu trúc mẫu', () => {
  const buf = writeXlsx(buildIntegrationSheets({ meta, changes: [{ effectiveDate: '2026-10-05', version: '1.0', changeItem: 'Authentication', action: 'A', description: 'Add integration tests', reference: null }], modules: [authModule, cartModule] }));
  const sheets = readXlsx(buf);
  const by = (n: string) => sheets.find((s) => s.name === n)!;

  it('sheet: Cover · Test Cases · Test Statistics · 1 sheet/module', () => {
    assert.deepEqual(sheets.map((s) => s.name), ['Cover', 'Test Cases', 'Test Statistics', 'Authentication', 'Shopping cart']);
    assert.equal(detectReport(sheets), 'integration');
    assert.equal(by('Cover').text(2, 2), 'TEST REPORT DOCUMENT');
  });
  it('Test Cases + Test Statistics: tiêu đề cột như mẫu', () => {
    const t = by('Test Cases');
    assert.deepEqual([2, 3, 4, 5, 6].map((c) => t.text(8, c)), ['No', 'Function Name', 'Sheet Name', 'Description', 'Pre-Condition']);
    assert.equal(t.links.get('D9'), 'Authentication');
    const s = by('Test Statistics');
    assert.deepEqual([2, 3, 4, 5, 6, 7, 8].map((c) => s.text(9, c)), ['No', 'Module code', 'Passed', 'Failed', 'Pending', 'N/A', 'Number of  test cases']);
    // Authentication: vòng 2 là vòng cuối — 1 Passed; 2 ca chưa có kết quả vòng 2 ⇒ Pending.
    assert.deepEqual([4, 5, 6, 7, 8].map((c) => s.get(10, c)), [1, 0, 2, 0, 3]);
    assert.deepEqual([4, 5, 6, 7, 8].map((c) => s.get(11, c)), [0, 0, 0, 1, 1]);
  });
  it('sheet module: đầu sheet, 4 vòng, mã <AT1>, dòng nhóm', () => {
    const a = by('Authentication');
    assert.deepEqual([a.text(2, 1), a.text(3, 1), a.text(4, 1), a.text(5, 1)], ['Feature', 'Test requirement', 'Number of TCs', 'Testing Round']);
    assert.deepEqual([1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 20].map((c) => a.text(11, c)),
      ['Test Case ID', 'Test Case Description', 'Test Case Procedure', 'Expected Results', 'Pre-conditions', 'Evidence', 'Round 1', 'Test date', 'Tester', 'Round 2', 'Note']);
    assert.equal(a.text(12, 1), 'Login');
    assert.equal(a.text(13, 1), '<AT1>');
    assert.equal(a.get(4, 2), 3);
    assert.deepEqual([2, 3, 4, 5].map((c) => a.get(6, c)), [0, 2, 0, 0], 'Round 1: 2 Failed');
  });
  it('vòng tròn: xuất ⇒ nhập lại', () => {
    const p = parseIntegrationWorkbook(sheets);
    assert.deepEqual(p.warnings, []);
    assert.equal(p.modules.length, 2);
    const m = p.modules[0];
    assert.deepEqual([m.name, m.idPrefix, m.description, m.preCondition, m.testRequirement], [authModule.name, 'AT', authModule.description, authModule.preCondition, authModule.testRequirement]);
    assert.deepEqual(m.cases, authModule.cases);
    assert.equal(p.cover.changes.length, 1);
    assert.equal(p.environment, meta.environment);
  });
});

describe('FPT — nhập tệp mẫu thật của trường (nếu có trên máy)', () => {
  const dir = path.join(os.homedir(), 'Downloads');
  const unitFile = fs.existsSync(dir) ? fs.readdirSync(dir).find((f) => /Report5\.1_Unit_Test_Report\.xlsx$/.test(f)) : undefined;
  const itFile = fs.existsSync(dir) ? fs.readdirSync(dir).find((f) => /Report5\.2_Integration_Test_Report\.xlsx$/.test(f)) : undefined;
  it('5.1: đọc được hàm, ma trận và kết quả', { skip: !unitFile }, () => {
    const p = parseUnitWorkbook(readXlsx(fs.readFileSync(path.join(dir, unitFile!))));
    assert.ok(p.functions.length >= 10);
    const withCases = p.functions.filter((f) => f.cases.length);
    assert.ok(withCases.length >= 10);
    for (const f of withCases) assert.ok(f.rows.some((r) => r.section === 'COND') && f.rows.some((r) => r.section === 'CONFIRM'), f.methodName);
    assert.ok(p.functions.some((f) => f.marks.length > 10));
  });
  it('5.2: đọc được module, case và vòng chạy', { skip: !itFile }, () => {
    const p = parseIntegrationWorkbook(readXlsx(fs.readFileSync(path.join(dir, itFile!))));
    assert.ok(p.modules.length >= 3);
    assert.ok(p.modules.every((m) => m.cases.length > 0 && /^[A-Z]+$/.test(m.idPrefix)));
    assert.ok(p.modules[0].cases.some((c) => c.rounds.some((r) => r.status)));
  });
});
