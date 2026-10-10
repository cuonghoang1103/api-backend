/**
 * CT Work đợt 7c — phép kiểm THUẦN (không DB): luật cổng 2FA, đọc báo cáo JUnit/Playwright/Jest + độ phủ, flaky,
 * chữ ký lỗi (chống trùng bug), mẫu chữ luật tự động, sổ tài sản (hạn, bí mật, xuất giấy phép), rào agent + scope token.
 *   npx tsx --test src/services/work/ctw7c.test.ts
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { graceUntilFrom, twoFactorState } from './twoFactor.js';
import {
  detectFormat, failSignature, flakiness, historyChar, parseCoverage, parseJest, parseJUnit, parsePlaywright, parseReport, parseXml, pushHistory, testKey,
} from './testResults.js';
import { renderTemplate, SUBTASK_TEMPLATES, TRIGGERS, ACTION_KINDS } from './automation.service.js';
import { annualCost, assertNoSecret, expiryState, renderLicenses } from './assets.service.js';
import { agentRouteAllowed } from './permissions.js';
import { TESTS_WRITE_ROUTE, TOKEN_SCOPES } from './apiTokens.service.js';

const FX = path.join(path.dirname(fileURLToPath(import.meta.url)), '__fixtures__', 'ctw7c');
const fx = (n: string) => readFileSync(path.join(FX, n), 'utf8');

describe('C17 — cổng 2FA theo không gian (hàm thuần)', () => {
  const now = new Date('2026-10-11T10:00:00Z');
  const sec = Math.floor(now.getTime() / 1000);
  const on = { require2fa: true, graceUntil: new Date('2026-10-15T00:00:00Z') };
  const past = { require2fa: true, graceUntil: new Date('2026-10-01T00:00:00Z') };
  const enabled = { mfaEnabled: true, mfaEnabledAt: new Date('2026-10-01T00:00:00Z') };
  const none = { mfaEnabled: false, mfaEnabledAt: null };
  it('không ép ⇒ OK với mọi người', () => {
    assert.equal(twoFactorState(null, none, null, { now }), 'OK');
    assert.equal(twoFactorState({ require2fa: false, graceUntil: null }, none, null, { now }), 'OK');
  });
  it('trong ân hạn ⇒ GRACE (chưa bật hoặc chưa xác minh)', () => {
    assert.equal(twoFactorState(on, none, null, { now }), 'GRACE');
    assert.equal(twoFactorState(on, enabled, {}, { now }), 'GRACE');
  });
  it('hết ân hạn: chưa bật ⇒ SETUP_REQUIRED; bật nhưng phiên chưa xác minh ⇒ VERIFY_REQUIRED', () => {
    assert.equal(twoFactorState(past, none, null, { now }), 'SETUP_REQUIRED');
    assert.equal(twoFactorState(past, enabled, null, { now }), 'VERIFY_REQUIRED');
    assert.equal(twoFactorState(past, enabled, { mfaAt: sec - 13 * 3600 }, { now, ttlHours: 12 }), 'VERIFY_REQUIRED', 'mfaAt quá TTL');
  });
  it('mfaAt còn hạn ⇒ OK; mfaAt TRƯỚC lần bật gần nhất ⇒ không tính', () => {
    assert.equal(twoFactorState(past, enabled, { mfaAt: sec - 60 }, { now, ttlHours: 12 }), 'OK');
    const reEnabled = { mfaEnabled: true, mfaEnabledAt: new Date(now.getTime() - 30_000) };
    assert.equal(twoFactorState(past, reEnabled, { mfaAt: sec - 600 }, { now, ttlHours: 12 }), 'VERIFY_REQUIRED');
  });
  it('mfaAt không có giá trị với người CHƯA bật 2FA (không tự chế claim mà qua)', () => {
    assert.equal(twoFactorState(past, none, { mfaAt: sec }, { now }), 'SETUP_REQUIRED');
  });
  it('ân hạn: 0 ngày = chặn ngay, trần 30 ngày', () => {
    assert.equal(graceUntilFrom(now, 0).getTime(), now.getTime());
    assert.equal(graceUntilFrom(now, 99).getTime(), now.getTime() + 30 * 86_400_000);
  });
});

describe('TST-2 — đọc báo cáo test', () => {
  it('JUnit (Surefire): pass/fail/error/skip, thực thể XML, CDATA, flakyFailure, DOCTYPE bị bỏ qua (chống XXE)', () => {
    const r = parseJUnit(fx('junit.xml'));
    assert.equal(r.format, 'JUNIT');
    assert.equal(r.results.length, 5);
    assert.equal(r.durationMs, 3250);
    const by = Object.fromEntries(r.results.map((x) => [x.name, x]));
    assert.equal(by.loginWithValidPassword.status, 'PASS');
    assert.equal(by.lockAfterFiveFailures.status, 'FAIL');
    assert.equal(by.lockAfterFiveFailures.message, 'expected: <LOCKED> but was: <ACTIVE>');
    assert.match(by.lockAfterFiveFailures.details!, /LoginServiceTest\.java:42/);
    assert.equal(by.resetPasswordEmail.status, 'SKIP');
    assert.equal(by.bookFreeSlot.status, 'PASS');
    assert.equal(by.bookFreeSlot.retried, true);
    assert.equal(by.rejectDoubleBooking.status, 'FAIL', '<error> cũng là đỏ');
    assert.equal(by.lockAfterFiveFailures.suite, 'com.labflow.auth.LoginServiceTest');
    assert.ok(!JSON.stringify(r).includes('root:'), 'không đọc thực thể ngoài');
  });
  it('JUnit hỏng / không phải JUnit ⇒ lỗi rõ', () => {
    assert.throws(() => parseJUnit('<a><b></a>'), /Malformed/);
    assert.throws(() => parseJUnit('<html><body/></html>'), /not a JUnit/);
    assert.throws(() => parseXml('<a x=1></a>'), /Malformed/);
  });
  it('Playwright JSON: suite lồng, expected/unexpected/flaky/skipped, bỏ mã màu ANSI', () => {
    const r = parsePlaywright(JSON.parse(fx('playwright.json')));
    assert.equal(r.results.length, 4);
    const by = Object.fromEntries(r.results.map((x) => [x.name, x]));
    assert.equal(by['shows an error for a wrong password'].status, 'PASS');
    assert.equal(by['redirects to the dashboard'].status, 'FAIL');
    assert.equal(by['redirects to the dashboard'].message, 'Error: expect(page).toHaveURL(expected)');
    assert.equal(by['remembers the user'].status, 'PASS');
    assert.equal(by['remembers the user'].retried, true);
    assert.equal(by['SSO login'].status, 'SKIP');
    assert.equal(by['SSO login'].suite, 'Login page');
    assert.equal(r.durationMs, 12346);
  });
  it('Jest/Vitest JSON: ancestorTitles ⇒ suite, pending ⇒ SKIP, invocations>1 ⇒ retried', () => {
    const r = parseJest(JSON.parse(fx('jest.json')));
    assert.equal(r.results.length, 4);
    const fail = r.results.find((x) => x.status === 'FAIL')!;
    assert.equal(fail.suite, 'price › formatVnd');
    assert.equal(fail.message, 'Error: expect(received).toBe(expected)');
    assert.equal(r.results.find((x) => x.name === 'handles negative numbers')!.status, 'SKIP');
    assert.equal(r.results.find((x) => x.name === 'retried then passed')!.retried, true);
  });
  it('tự nhận dạng định dạng', () => {
    assert.equal(detectFormat(fx('junit.xml')), 'JUNIT');
    assert.equal(detectFormat(fx('playwright.json')), 'PLAYWRIGHT');
    assert.equal(detectFormat(fx('jest.json')), 'JEST');
    assert.throws(() => detectFormat('{"foo":1}'), /Unrecognised/);
    assert.equal(parseReport(JSON.parse(fx('jest.json'))).format, 'JEST');
  });
  it('độ phủ: lcov (LF/LH, BRF/BRH), JaCoCo (bộ đếm cấp report), Cobertura, Istanbul', () => {
    const l = parseCoverage(fx('lcov.info'));
    assert.equal(l.format, 'LCOV');
    assert.equal(l.linePct, 70);
    assert.equal(l.branchPct, 50);
    assert.equal(l.modules[0].name, 'src/auth/login.ts', 'mô-đun phủ thấp nhất đứng đầu');
    const j = parseCoverage(fx('jacoco.xml'));
    assert.equal(j.format, 'JACOCO');
    assert.equal(j.linePct, 60, 'lấy counter LINE trực tiếp dưới <report>, không cộng gói');
    assert.equal(j.branchPct, 50);
    assert.equal(j.modules[0].name, 'com.labflow.lab');
    const c = parseCoverage('<?xml version="1.0"?><coverage line-rate="0.8125" branch-rate="0.5" lines-covered="13" lines-valid="16"><packages><package name="app" line-rate="0.8"/></packages></coverage>');
    assert.equal(c.format, 'COBERTURA');
    assert.equal(c.linePct, 81.25);
    const i = parseCoverage('{"total":{"lines":{"total":200,"covered":150,"pct":75},"branches":{"total":10,"covered":5,"pct":50}}}');
    assert.equal(i.linePct, 75);
    assert.throws(() => parseCoverage('nothing here'), /not an lcov/);
  });
});

describe('TST-2 — flaky, khoá test, chống trùng bug', () => {
  it('lịch sử giữ 30 ký tự gần nhất, R = xanh sau chạy lại', () => {
    assert.equal(historyChar({ status: 'PASS', retried: true }), 'R');
    assert.equal(historyChar({ status: 'FAIL', retried: false }), 'F');
    assert.equal(pushHistory('P'.repeat(30), 'F').length, 30);
    assert.ok(pushHistory('P'.repeat(30), 'F').endsWith('F'));
  });
  it('đỏ/xanh xen kẽ ⇒ flaky; đỏ liên tục (hỏng thật) KHÔNG phải flaky', () => {
    assert.equal(flakiness('PFPFP').flaky, true);
    assert.equal(flakiness('PPPPFFFF').flaky, false, 'một lần chuyển đỏ = hỏng thật');
    assert.equal(flakiness('PPPPPPPP').flaky, false);
    assert.equal(flakiness('PRPPR').flaky, true, 'đỏ-rồi-xanh khi chạy lại 2 lần');
    assert.equal(flakiness('PSFSPSF').flaky, true, 'bỏ qua S khi xét');
    assert.ok(flakiness('PFPFPFPF').score > flakiness('PFPPPPPP').score);
  });
  it('chữ ký lỗi: chuẩn hoá số/mã hex; cùng suite + cùng lỗi ⇒ cùng chữ ký; lỗi quá chung ⇒ không gộp', () => {
    const a = failSignature({ suite: 'Checkout', file: null, message: 'Timeout 5000ms waiting for #pay-button at 0x7f3a2b' });
    const b = failSignature({ suite: 'Checkout', file: null, message: 'Timeout 3000ms waiting for #pay-button at 0x11aa22' });
    const c = failSignature({ suite: 'Login', file: null, message: 'Timeout 5000ms waiting for #pay-button at 0x7f3a2b' });
    assert.ok(a && a === b);
    assert.notEqual(a, c);
    assert.equal(failSignature({ suite: 'X', file: null, message: 'failed' }), null);
  });
  it('khoá test = suite::tên (ổn định giữa các lần nhập)', () => {
    assert.equal(testKey({ suite: 'A', file: 'a.ts', name: ' t ' }), 'A::t');
    assert.equal(testKey({ suite: null, file: 'a.ts', name: 't' }), 'a.ts::t');
  });
});

describe('C13 — automation thêm', () => {
  it('có đủ trigger/action mới', () => {
    for (const t of ['issue.due_soon', 'sla.breached', 'pr.merged', 'test.failed', 'baseline.changed']) assert.ok((TRIGGERS as readonly string[]).includes(t), t);
    for (const k of ['post_chat', 'webhook', 'assign_round_robin', 'create_subtasks']) assert.ok((ACTION_KINDS as readonly string[]).includes(k), k);
    assert.ok(SUBTASK_TEMPLATES.dod.length >= 4);
  });
  it('mẫu chữ {{…}}: thay đúng khoá, giữ nguyên khoá lạ, không có thẻ ⇒ chuỗi rỗng', () => {
    const v = { issue: { key: 'LF-7', title: 'Login', url: '/work/x/LF/issue/7' }, projectKey: 'LF', ruleName: 'R', event: { test: 'login works', build: 42 } };
    assert.equal(renderTemplate('{{issue.key}} {{ issue.title }} in {{project.key}} — {{event.test}} #{{event.build}} by {{rule.name}}', v), 'LF-7 Login in LF — login works #42 by R');
    assert.equal(renderTemplate('{{foo.bar}} {{event.nope}}', v), '{{foo.bar}} {{event.nope}}');
    assert.equal(renderTemplate('[{{issue.key}}]', { ...v, issue: null }), '[]');
  });
});

describe('C25 — sổ tài sản', () => {
  const now = new Date('2026-10-11T08:00:00Z');
  it('trạng thái hạn', () => {
    assert.deepEqual(expiryState(null, 30, now), { state: 'NONE', daysLeft: null });
    assert.equal(expiryState(new Date('2026-10-30T00:00:00Z'), 30, now).state, 'EXPIRING');
    assert.equal(expiryState(new Date('2026-12-30T00:00:00Z'), 30, now).state, 'OK');
    assert.deepEqual(expiryState(new Date('2026-10-10T00:00:00Z'), 30, now), { state: 'EXPIRED', daysLeft: -1 });
  });
  it('chi phí quy năm', () => {
    assert.equal(annualCost(100, 'MONTHLY'), 1200);
    assert.equal(annualCost(100, 'YEARLY'), 100);
    assert.equal(annualCost(null, 'MONTHLY'), 0);
  });
  it('không cho dán bí mật vào sổ', () => {
    assert.throws(() => assertNoSecret('key sk-abcdefghijklmnopqrstuv'), /secret/);
    assert.throws(() => assertNoSecret('password: hunter22'), /secret/);
    assert.throws(() => assertNoSecret('ghp_ABCDEFGHIJKLMNOPQRSTUVWX'), /secret/);
    assert.doesNotThrow(() => assertNoSecret('Login stored in Bitwarden "LabFlow" vault — owner: Cuong', null));
  });
  it('xuất THIRD_PARTY_LICENSES + CREDITS: gom theo giấy phép, cảnh báo UNKNOWN, bỏ RETIRED', () => {
    const rows = [
      { name: 'React', version: '19', licenseType: 'MIT', licenseName: null, licenseUrl: null, source: 'Meta', sourceUrl: 'https://react.dev', attributionRequired: true, attribution: 'Copyright (c) Meta', category: 'LIBRARY', status: 'ACTIVE' },
      { name: 'Inter', version: null, licenseType: 'OFL', licenseName: null, licenseUrl: null, source: 'Rasmus', sourceUrl: null, attributionRequired: true, attribution: null, category: 'FONT', status: 'ACTIVE' },
      { name: 'Jump sound', version: null, licenseType: 'CC0', licenseName: null, licenseUrl: null, source: 'freesound', sourceUrl: null, attributionRequired: false, attribution: null, category: 'AUDIO', status: 'ACTIVE' },
      { name: 'Mystery icon', version: null, licenseType: 'UNKNOWN', licenseName: null, licenseUrl: null, source: null, sourceUrl: null, attributionRequired: false, attribution: null, category: 'IMAGE', status: 'ACTIVE' },
      { name: 'Old engine', version: null, licenseType: 'COMMERCIAL', licenseName: null, licenseUrl: null, source: null, sourceUrl: null, attributionRequired: false, attribution: null, category: 'SOFTWARE', status: 'RETIRED' },
    ];
    const md = renderLicenses({ key: 'FP', name: 'Flying Pencil' }, rows, 'licenses', 'md');
    assert.match(md, /^# Flying Pencil — Third-party licenses/);
    assert.match(md, /## MIT License\n\n- \*\*React 19\*\* — by Meta · https:\/\/react\.dev\n {2}- Copyright \(c\) Meta/);
    assert.match(md, /UNKNOWN license/);
    assert.doesNotMatch(md, /Old engine/);
    const credits = renderLicenses({ key: 'FP', name: 'Flying Pencil' }, rows, 'credits', 'txt');
    assert.match(credits, /React/);
    assert.match(credits, /Inter/);
    assert.doesNotMatch(credits, /Jump sound/, 'CC0 không bắt buộc ghi công');
  });
});

describe('Rào chắn: agent + scope token tests:write', () => {
  it('agent chỉ ĐỌC sổ tài sản, không xuất tệp giấy phép', () => {
    assert.equal(agentRouteAllowed('GET', '/assets'), true);
    assert.equal(agentRouteAllowed('POST', '/assets'), false);
    assert.equal(agentRouteAllowed('PATCH', '/assets/3'), false);
    assert.equal(agentRouteAllowed('DELETE', '/assets/3'), false);
    assert.equal(agentRouteAllowed('PUT', '/assets/3/links'), false);
    assert.equal(agentRouteAllowed('GET', '/assets-export'), false);
  });
  it('tests:write chỉ khớp đúng tuyến nhập kết quả', () => {
    assert.ok((TOKEN_SCOPES as readonly string[]).includes('tests:write'));
    assert.ok(TESTS_WRITE_ROUTE.test('/projects/12/tests/automation/import'));
    for (const p of ['/projects/12/tests/automation', '/projects/12/issues', '/projects/12/tests/automation/import/x', '/projects/12/tests/automation/imports']) {
      assert.equal(TESTS_WRITE_ROUTE.test(p), false, p);
    }
  });
});
