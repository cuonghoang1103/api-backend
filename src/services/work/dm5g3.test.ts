/**
 * dm5 G3 (27/11/2026) — hàm thuần của gói "Kiểm thử, review & UAT": npx tsx --test src/services/work/dm5g3.test.ts
 *   B4 checklist + mẫu cấp dự án + làm nguội · D2 tiêu chí vào/ra · D8 Leakage/DRE · D5 JUnit ⇒ 5.1 · D4 lint + 6 nhóm.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CHECKLISTS, checklistByKey, checklistItems, projectChecklistTemplate, templateItems } from './reviewRules.js';
import { checklistKeyOf, coolOffRemainingMs, normalizeChecklists, normalizeCoolOff, normalizeQualitySettings, qualitySettingsOf } from './qualitySettings.js';
import { defectStats, evaluateEntry, isLeakage, normalizeEntry, TEST_TYPES, type DefectRow } from './testMetrics.js';
import { automationNoteLine, caseIndexOfTest, countTestGroups, lintTestSteps, lintUnitFunctions, matchJUnitToUnit, mergeAutomationNote, testGroupOf } from './fptTests.js';
import { parseJUnit } from './testResults.js';

describe('B4 — checklist review', () => {
  it('4 bộ mới có đủ số điểm theo bài học, song ngữ, khoá duy nhất', () => {
    const count = (k: string) => checklistItems(k, 'vi').length;
    assert.equal(count('REBUTTAL_10'), 10);
    assert.equal(count('REQ_REVIEW_STRIDE'), 12); // 8 câu tra vấn + 4 STRIDE-lite
    assert.equal(count('DESIGN_REVIEW_10'), 10);
    assert.equal(count('PR_SELF_4PASS'), 9);
    assert.equal(checklistByKey('PR_SELF_4PASS')!.sections.length, 4);
    assert.equal(new Set(CHECKLISTS.map((c) => c.key)).size, CHECKLISTS.length);
    for (const k of ['REBUTTAL_10', 'REQ_REVIEW_STRIDE', 'DESIGN_REVIEW_10', 'PR_SELF_4PASS']) {
      const en = checklistItems(k, 'en'), vi = checklistItems(k, 'vi');
      assert.equal(en.length, vi.length);
      assert.ok(en.every((q, i) => q.question && vi[i].question && q.question !== vi[i].question), `${k} phải có cả hai ngôn ngữ`);
    }
    assert.equal(checklistByKey('REBUTTAL_10')!.kind, 'CODE');
    assert.equal(checklistByKey('REQ_REVIEW_STRIDE')!.sizeUnit, 'PAGE');
  });

  it('mẫu cấp dự án: chuẩn hoá, khoá P_, giới hạn, lỗi rõ ràng', () => {
    const out = normalizeChecklists([
      { name: 'Kiểm  API hợp đồng', kind: 'CODE', sections: [{ name: 'Chung', items: [' Có OpenAPI? ', '', 'Mã lỗi đúng SM-xx?'] }] },
      { name: 'Kiểm API hợp đồng', sections: [{ items: ['Q'] }] },
    ])!;
    assert.equal(out.length, 2);
    assert.equal(out[0].key, 'P_KIEM_API_HOP_DONG');
    assert.equal(out[1].key, 'P_KIEM_API_HOP_DONG_2');
    assert.deepEqual(out[0].sections[0].items, ['Có OpenAPI?', 'Mã lỗi đúng SM-xx?']);
    assert.equal(out[1].kind, 'DOC');
    assert.equal(out[1].sections[0].name, 'Section 1');
    assert.throws(() => normalizeChecklists([{ name: '', sections: [] }]), /needs a name/);
    assert.throws(() => normalizeChecklists([{ name: 'X', sections: [{ items: [] }] }]), /at least one question/);
    assert.throws(() => normalizeChecklists('x'), /list/);
    assert.equal(normalizeChecklists(null), null);
    assert.equal(checklistKeyOf('Đặc tả', new Set()), 'P_DAC_TA');
    const tpl = projectChecklistTemplate(out[0]);
    assert.equal(tpl.sizeUnit, 'LOC');
    assert.deepEqual(templateItems(tpl, 'vi').map((x) => x.question), ['Có OpenAPI?', 'Mã lỗi đúng SM-xx?']);
  });

  it('làm nguội + chế độ cổng + chuẩn hoá cả khối settings', () => {
    assert.equal(normalizeCoolOff(0), null);
    assert.equal(normalizeCoolOff('12'), 12);
    assert.throws(() => normalizeCoolOff(100), /between 0 and 72/);
    const opened = new Date('2026-11-27T08:00:00Z');
    assert.ok(coolOffRemainingMs(opened, 12, new Date('2026-11-27T09:00:00Z')) > 0);
    assert.ok(coolOffRemainingMs(opened, 12, new Date('2026-11-27T20:00:01Z')) <= 0);
    assert.equal(coolOffRemainingMs(opened, null), 0);
    const s = normalizeQualitySettings({ testGate: 'block', uatRevokeOnClose: 'yes', reviewCoolOffHours: 2, other: 1 });
    assert.deepEqual(s, { testGate: 'block', uatRevokeOnClose: null, reviewCoolOffHours: 2, other: 1 });
    assert.equal(normalizeQualitySettings({ testGate: 'nope' }).testGate, null);
    assert.deepEqual(qualitySettingsOf({ reviewChecklists: 'hỏng', reviewCoolOffHours: 999, testGate: 'warn', uatRevokeOnClose: true }), { reviewChecklists: [], reviewCoolOffHours: null, testGate: 'warn', uatRevokeOnClose: true });
  });
});

describe('D2 — tiêu chí vào/ra', () => {
  it('SECURITY là một loại test', () => assert.ok((TEST_TYPES as readonly string[]).includes('SECURITY')));

  it('normalizeEntry: mặc định target, MANUAL cần chữ, kind lạ ⇒ lỗi', () => {
    const e = normalizeEntry([{ kind: 'CASES_READY' }, { kind: 'REQ_COVERAGE', target: 90 }, { kind: 'MANUAL', text: ' Môi trường sẵn sàng ', done: true }, { kind: 'SMOKE_PASSED', target: 5 }]);
    assert.deepEqual(e, [{ kind: 'CASES_READY', target: 1 }, { kind: 'REQ_COVERAGE', target: 90 }, { kind: 'MANUAL', text: 'Môi trường sẵn sàng', done: true }, { kind: 'SMOKE_PASSED' }]);
    assert.throws(() => normalizeEntry([{ kind: 'MANUAL' }]), /needs its text/);
    assert.throws(() => normalizeEntry([{ kind: 'X' }]), /unknown kind/);
    assert.throws(() => normalizeEntry([{ kind: 'REQ_COVERAGE', target: 120 }]), /between 0 and 100/);
    assert.deepEqual(normalizeEntry(undefined), []);
  });

  it('evaluateEntry: mỗi dòng đo được; chỉ đạt khi mọi dòng đạt; rỗng = đạt', () => {
    const entry = normalizeEntry([{ kind: 'CASES_READY', target: 3 }, { kind: 'REQ_COVERAGE', target: 80 }, { kind: 'MAX_OPEN_CRITICAL', target: 0 }, { kind: 'SMOKE_PASSED' }, { kind: 'PLAN_REVIEWED' }, { kind: 'MANUAL', text: 'Data ready' }]);
    const bad = evaluateEntry(entry, { cases: 2, reqCoverage: 50, openCritical: 1, smoke: { cases: 2, passed: 1, failed: 1 }, planReviewed: false });
    assert.equal(bad.met, false);
    assert.deepEqual(bad.rows.map((r) => r.met), [false, false, false, false, false, false]);
    const good = evaluateEntry(entry.map((c) => (c.kind === 'MANUAL' ? { ...c, done: true } : c)), { cases: 3, reqCoverage: 80, openCritical: 0, smoke: { cases: 1, passed: 1, failed: 0 }, planReviewed: true });
    assert.equal(good.met, true);
    assert.equal(evaluateEntry([], { cases: 0, reqCoverage: null, openCritical: 9, smoke: { cases: 0, passed: 0, failed: 0 }, planReviewed: false }).met, true);
    // Không có ca smoke ⇒ điều kiện smoke KHÔNG đạt (không đoán là đạt).
    assert.equal(evaluateEntry(normalizeEntry([{ kind: 'SMOKE_PASSED' }]), { cases: 1, reqCoverage: 100, openCritical: 0, smoke: { cases: 0, passed: 0, failed: 0 }, planReviewed: true }).met, false);
  });
});

describe('D8 — Leakage & DRE', () => {
  const row = (o: Partial<DefectRow>): DefectRow => ({ severity: 'MAJOR', activity: 'ST', module: null, open: false, createdAt: new Date(), resolvedAt: new Date(), rootCause: null, injectedPhase: null, reopened: false, ...o });
  it('cờ thắng activity; null ⇒ suy AT hoặc nhãn Leakage', () => {
    assert.equal(isLeakage({ leakage: null, activity: 'AT' }), true);
    assert.equal(isLeakage({ leakage: false, activity: 'AT' }), false);
    assert.equal(isLeakage({ leakage: true, activity: 'UT' }), true);
    assert.equal(isLeakage({ activity: 'ST', labels: ['leakage'] }), true);
    assert.equal(isLeakage({ activity: 'ST', labels: ['Backend'] }), false);
  });
  it('DRE theo cờ: dữ liệu cũ (không cờ) giữ nguyên số; cờ đổi số', () => {
    const old = [row({ activity: 'AT' }), row({}), row({}), row({})];
    assert.equal(defectStats(old).dre, 75);
    // Như cũ khi chỉ truyền activity (leakage undefined).
    const flagged = [row({ activity: 'AT', leakage: false }), row({ leakage: true }), row({ activity: null, leakage: true }), row({}), row({})];
    const s = defectStats(flagged);
    assert.equal(s.leakage, 40); // 2 lọt / 5 đã phân loại
    assert.equal(s.dre, 60);
  });
});

describe('D5 — JUnit/Surefire ⇒ ma trận 5.1', () => {
  const fns = [
    { id: 1, moduleName: 'AuthService', methodName: 'login', caseIds: [11, 12, 13] },
    { id: 2, moduleName: 'AuthService', methodName: 'loginWithGoogle', caseIds: [21, 22] },
    { id: 3, moduleName: 'BookingService', methodName: 'cancel', caseIds: [31, 32] },
  ];
  it('nhận UTCID trong tên, [n] tham số hoá; hàm tên dài nhất thắng', () => {
    assert.equal(caseIndexOfTest('login_UTCID03', null), 3);
    assert.equal(caseIndexOfTest('cancel(String)[2]', null), 2);
    assert.equal(caseIndexOfTest('shouldCancel', 'BookingServiceTest'), null);
    const xml = `<?xml version="1.0"?><testsuites>
      <testsuite name="AuthServiceTest"><testcase classname="com.lf.AuthServiceTest" name="login_UTCID01"/>
        <testcase classname="com.lf.AuthServiceTest" name="login_UTCID02"><failure message="expected 401 but was 200"/></testcase>
        <testcase classname="com.lf.AuthServiceTest" name="loginWithGoogle_UTCID01"/>
        <testcase classname="com.lf.AuthServiceTest" name="login_UTCID09"/>
        <testcase classname="com.lf.AuthServiceTest" name="loginSmoke"/>
        <testcase classname="com.lf.AuthServiceTest" name="login_UTCID03"><skipped/></testcase></testsuite>
      <testsuite name="BookingServiceTest"><testcase classname="com.lf.BookingServiceTest" name="cancel(Long)[1]"/>
        <testcase classname="com.lf.BookingServiceTest" name="cancel(Long)[1]"><failure message="boom"/></testcase>
        <testcase classname="com.lf.PaymentTest" name="refund_UTCID01"/></testsuite></testsuites>`;
    const m = matchJUnitToUnit(fns, parseJUnit(xml).results);
    const by = new Map(m.updates.map((u) => [u.caseId, u]));
    assert.equal(by.get(11)!.result, 'P');
    assert.equal(by.get(12)!.result, 'F');
    assert.equal(by.get(12)!.message, 'expected 401 but was 200');
    assert.equal(by.get(21)!.result, 'P'); // loginWithGoogle, không nhầm sang login
    assert.equal(by.get(31)!.result, 'F'); // hai test cùng UTCID: một đỏ là đỏ
    assert.equal(m.skipped, 1);
    assert.deepEqual(m.unmatched.map((u) => u.reason).sort(), ['NO_FUNCTION', 'NO_UTCID', 'UTCID_NOT_FOUND']);
    // UTCID của hàm ĐÃ khớp mà không có test.
    assert.deepEqual(m.missing.map((x) => `${x.function}:${x.utcid}`).sort(), ['AuthService.login:UTCID03', 'AuthService.loginWithGoogle:UTCID02', 'BookingService.cancel:UTCID02']);
  });
  it('dự án một hàm ⇒ test có UTCID nào cũng thuộc hàm đó', () => {
    const m = matchJUnitToUnit([fns[2]], [{ suite: 'X', name: 'UTCID02 huỷ quá hạn', status: 'PASS' }]);
    assert.equal(m.updates[0].caseId, 32);
  });
  it('dòng Automation trong Notes: thay dòng cũ, giữ chữ người dùng', () => {
    const line = automationNoteLine({ date: '2026-11-27', format: 'JUnit', matched: 5, total: 7, passed: 4, failed: 1, linePct: 82.5, branchPct: 70, coverageFormat: 'JaCoCo', commitSha: 'abcdef1234567890' });
    assert.equal(line, 'Automation: JUnit 2026-11-27 — 5/7 UTCID matched (4 P, 1 F) · JaCoCo line 82.5%, branch 70% · commit abcdef123456');
    const merged = mergeAutomationNote('Ghi chú của em\nAutomation: cũ\n', line);
    assert.equal(merged, `Ghi chú của em\n${line}`);
    assert.equal(mergeAutomationNote(null, line), line);
  });
});

describe('D4 — lint 5.1, 6 nhóm, bước test', () => {
  it('bắt thiếu A/B, UTCID không đánh dấu, trùng, tiền điều kiện lẫn vào Condition', () => {
    const issues = lintUnitFunctions([{
      id: 1, moduleName: 'Auth', methodName: 'login', preCondition: null,
      rows: [
        { id: 1, section: 'COND', groupName: 'Precondition', label: null, value: 'DB up' },
        { id: 2, section: 'COND', groupName: 'Input', label: 'state', value: 'User is logged in' },
        { id: 3, section: 'CONFIRM', groupName: 'Return', label: null, value: 'true' },
      ],
      cases: [{ id: 10, type: 'N', rowIds: [2, 3] }, { id: 11, type: 'N', rowIds: [2, 3] }, { id: 12, type: 'N', rowIds: [2] }],
    }]);
    const codes = issues.map((i) => i.code).sort();
    assert.deepEqual(codes, ['CASE_NO_CONFIRM', 'DUPLICATE_CASE', 'NO_ABNORMAL', 'NO_BOUNDARY', 'NO_PRECONDITION_FIELD', 'PRECONDITION_IN_CONDITIONS']);
    assert.deepEqual(issues.find((i) => i.code === 'CASE_NO_CONFIRM')!.utcids, ['UTCID03']);
    assert.deepEqual(issues.find((i) => i.code === 'DUPLICATE_CASE')!.utcids, ['UTCID01', 'UTCID02']);
    const clean = lintUnitFunctions([{
      id: 2, moduleName: 'A', methodName: 'b', preCondition: 'x',
      rows: [{ id: 1, section: 'COND', groupName: 'Input', label: null, value: '5' }, { id: 2, section: 'CONFIRM', groupName: 'Return', label: null, value: 'ok' }, { id: 3, section: 'COND', groupName: 'Input', label: null, value: '0' }],
      cases: [{ id: 1, type: 'N', rowIds: [1, 2] }, { id: 2, type: 'A', rowIds: [3, 2] }, { id: 3, type: 'B', rowIds: [1, 3, 2] }],
    }]);
    assert.deepEqual(clean, []);
  });
  it('6 nhóm theo nhãn (cả tiếng Việt), nhóm thiếu, thẻ chưa phân nhóm', () => {
    assert.equal(testGroupOf('BVA'), 'Boundary');
    assert.equal(testGroupOf('bảo mật'), 'Security');
    assert.equal(testGroupOf('frontend'), null);
    const r = countTestGroups([{ key: 'LF-1', labels: ['Happy'] }, { key: 'LF-2', labels: ['boundary', 'security'] }, { key: 'LF-3', labels: ['ui'] }]);
    assert.deepEqual(r.groups.map((g) => g.count), [1, 0, 1, 0, 1, 0]);
    assert.deepEqual(r.missing, ['Empty', 'Conflict', 'Adjacent']);
    assert.deepEqual(r.ungrouped, ['LF-3']);
  });
  it('bước test: tiền điều kiện lẫn vào bước, bước thiếu mong đợi', () => {
    assert.deepEqual(lintTestSteps({ preconditions: null, steps: [{ action: 'User is logged in as student', expected: null }, { action: 'Click Book', expected: 'Booked' }] }), [
      { code: 'PRECONDITION_IN_STEPS', steps: [1] }, { code: 'STEP_NO_EXPECTED', steps: [1] },
    ]);
    assert.deepEqual(lintTestSteps({ preconditions: 'x', steps: [] }), [{ code: 'NO_STEPS' }]);
  });
});
