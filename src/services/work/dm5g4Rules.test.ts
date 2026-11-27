/**
 * dm5 G4 — phần thuần: npx tsx --test src/services/work/dm5g4Rules.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  branchFlags, childCrKey, ciOfSha, cleanCrOptions, cleanImpactMatrix, cleanSyncChecklist, criticize, freezeVerdict, g4SettingsOf, hatOf,
  impactOverall, normalizeG4Settings, prFlags, releaseHeader, repoHealthOf, roleWeekly, stripCode, syncDone, vnMonday,
} from './dm5g4Rules.js';
import type { CodeReviewResult } from './codeReviewRules.js';
import { BLUEPRINTS, enabledGroups, groupsOf, previewBlueprint } from './projectBlueprints.js';
import { gateSettingsPatch, remapSettings } from './projectBlueprint.service.js';
import { exportRoute } from './toolRegistry/planning.js';

describe('C5 — mũ vai', () => {
  it('chọn tay > nhãn C1…C5 > nhãn PM/BA/BE/FE/QA > activity', () => {
    assert.deepEqual(hatOf({ hat: 'C4', activity: 'Testing' }), { hat: 'C4', source: 'set' });
    assert.equal(hatOf({ labels: ['c5'], activity: 'Coding' }).hat, 'C5');
    assert.equal(hatOf({ labels: ['QA'], activity: 'Coding' }).hat, 'C5');
    assert.equal(hatOf({ labels: ['BA'] }).hat, 'C2');
    assert.equal(hatOf({ activity: 'Training' }).hat, 'C1');
    assert.equal(hatOf({ activity: 'Analyzing' }).hat, 'C2');
    assert.equal(hatOf({ activity: 'Coding', title: 'Booking API' }).hat, 'C3');
    assert.equal(hatOf({ activity: 'Coding', title: 'Màn hình đặt phòng' }).hat, 'C4');
    assert.equal(hatOf({ activity: 'Coding', labels: ['FE'] }).hat, 'C4');
    assert.equal(hatOf({ activity: 'Designing', title: 'UI mockup' }).hat, 'C4');
    assert.equal(hatOf({ typeKey: 'TEST' }).hat, 'C5');
    assert.equal(hatOf({ hat: 'C9', activity: 'Testing' }).source, 'activity');
  });
  it('tuần theo giờ VN: Chủ nhật 23:30 VN vẫn thuộc tuần trước', () => {
    assert.equal(vnMonday(new Date('2026-11-29T16:30:00Z')), '2026-11-23'); // CN 29/11 23:30 VN
    assert.equal(vnMonday(new Date('2026-11-29T17:30:00Z')), '2026-11-30'); // T2 30/11 00:30 VN
  });
  it('% theo vai + cảnh báo QA < 15% và tổng > 30h', () => {
    const d = (iso: string) => new Date(iso);
    const r = roleWeekly([
      { minutes: 600, startedAt: d('2026-11-23T02:00:00Z'), hat: 'C3' },
      { minutes: 60, startedAt: d('2026-11-24T02:00:00Z'), hat: 'C5' },
      { minutes: 1260, startedAt: d('2026-11-25T02:00:00Z'), hat: 'C4' },
      { minutes: 120, startedAt: d('2026-11-30T02:00:00Z'), hat: 'C5' },
      { minutes: 120, startedAt: d('2026-11-30T03:00:00Z'), hat: 'C2' },
    ]);
    assert.equal(r.weeks.length, 2);
    const w1 = r.weeks[0];
    assert.equal(w1.weekStart, '2026-11-23');
    assert.equal(w1.totalHours, 32);
    assert.equal(w1.hours.C5, 1);
    assert.equal(w1.pct.C5, 3.1);
    assert.deepEqual(w1.alerts.map((a) => a.code), ['QA_LOW', 'OVER_HOURS']);
    assert.deepEqual(r.weeks[1].alerts, []);
    assert.equal(r.weeks[1].pct.C5, 50);
    assert.equal(r.totals.totalHours, 36);
    const custom = roleWeekly([{ minutes: 600, startedAt: d('2026-11-23T02:00:00Z'), hat: 'C5' }], { qaMinPct: 15, maxWeekHours: 8 });
    assert.deepEqual(custom.weeks[0].alerts.map((a) => a.code), ['OVER_HOURS']);
  });
});

describe('D14 — đóng băng version', () => {
  it('FEATURE chặn Req/Story/Epic, cho Task/Bug; CODE chỉ Bug P0–P1; HARD chặn hết; ADMIN vượt', () => {
    const v = (lv: string, typeKey: string, priority = 3, isAdmin = false) => freezeVerdict(lv, { typeKey, priority, isAdmin });
    assert.equal(v('NONE', 'STORY').ok, true);
    assert.equal(v('FEATURE', 'REQUIREMENT').ok, false);
    assert.equal(v('FEATURE', 'STORY').ok, false);
    assert.equal(v('FEATURE', 'TASK').ok, true);
    assert.equal(v('FEATURE', 'BUG').ok, true);
    assert.equal(v('CODE', 'BUG', 2).ok, true);
    assert.equal(v('CODE', 'BUG', 3).ok, false);
    assert.equal(v('CODE', 'TASK', 1).ok, false);
    assert.equal(v('HARD', 'BUG', 1).ok, false);
    assert.deepEqual(v('HARD', 'BUG', 1, true), { ok: true, override: true });
    assert.equal(v('weird', 'STORY').ok, true);
  });
  it('CI ở SHA: khớp đầu headSha, lấy lần chạy mới nhất; SHA ngắn < 7 ⇒ unknown', () => {
    const pulls = [
      { number: 4, headSha: 'abcdef1234567890', ciState: 'failure', ciAt: new Date('2026-11-01') },
      { number: 5, headSha: 'abcdef1234567890', ciState: 'success', ciAt: new Date('2026-11-02'), ciUrl: 'https://ci/5' },
      { number: 6, headSha: '9999999', ciState: 'success', ciAt: new Date('2026-11-03') },
    ];
    assert.deepEqual(ciOfSha('abcdef1', pulls), { state: 'success', pr: 5, url: 'https://ci/5' });
    assert.equal(ciOfSha('abc', pulls).state, 'unknown');
    assert.equal(ciOfSha('1234567', pulls).state, 'unknown');
  });
  it('dòng đầu release notes có tag + SHA rút gọn + CI', () => {
    assert.equal(releaseHeader({ name: 'v1.0', gitTag: 'v1.0.0', commitSha: 'abcdef1234567890ff', releaseCi: 'success' }), '> v1.0 · Tag `v1.0.0` · commit `abcdef123456` · CI success');
    assert.equal(releaseHeader({ name: 'v1.0', gitTag: null, commitSha: null }), '');
  });
});

describe('D11 — AI chỉ phản biện', () => {
  const base: CodeReviewResult = {
    summary: 'Ổn. ```java\nps.close();\n```', verdict: 'CHANGES', verdictRaw: 'CHANGES', dropped: 0, linesCleared: 0,
    findings: [
      { file: 'a/RoomDao.java', line: 12, severity: 'MAJOR', category: 'correctness', message: 'PreparedStatement leaks', suggestion: 'Use:\n```java\ntry (PreparedStatement ps = c.prepareStatement(sql)) {\n}\n```' },
      { file: 'a/RoomDao.java', line: null, severity: 'MINOR', category: 'tests', message: 'No test', suggestion: 'Which test would fail for an empty id?' },
      { file: 'a/X.java', line: 3, severity: 'NIT', category: 'security', message: 'Inline     String sql = "x" + id;', suggestion: null },
    ],
    acceptance: [{ criterion: 'find by id', met: 'yes', evidence: '`RoomDao.java:11`' }],
    nextSteps: ['```\nfix\n```', 'Viết test cho find()'],
  };
  it('gỡ mọi khối mã; gợi ý có mã ⇒ câu hỏi theo loại; gợi ý đã là câu hỏi ⇒ giữ', () => {
    const r = criticize(base, 'vi');
    const all = JSON.stringify(r);
    assert.doesNotMatch(all, /```/);
    assert.doesNotMatch(all, /prepareStatement\(sql\)/);
    assert.match(r.findings[0].suggestion!, /\?$/);
    assert.match(r.findings[0].suggestion!, /biên/);
    assert.equal(r.findings[1].suggestion, 'Which test would fail for an empty id?');
    assert.match(r.findings[2].suggestion!, /phân quyền/);
    assert.deepEqual(r.nextSteps, ['Viết test cho find()']);
    assert.ok(r.codeRemoved >= 3);
    assert.equal(r.acceptance[0].evidence, '`RoomDao.java:11`', 'mã nội dòng ngắn (tên tệp) được giữ');
  });
  it('stripCode giữ chữ thường, bỏ dòng mã thụt lề', () => {
    assert.deepEqual(stripCode('Đổi tên biến.'), { text: 'Đổi tên biến.', hadCode: false });
    assert.equal(stripCode('Sửa thế này:\n    int x = a + b;\nxong').text, 'Sửa thế này:\nxong');
  });
});

describe('D12/D13 — sức khoẻ code', () => {
  const s = { branchMaxDays: 3, prMaxLines: 400 };
  const now = new Date('2026-11-27T00:00:00Z');
  it('nhánh > 3 ngày chưa merge/xoá ⇒ stale; nhánh chính không bao giờ', () => {
    assert.equal(branchFlags({ name: 'feature/LF-1', createdAt: new Date('2026-11-20'), deleted: false, merged: false }, 'main', s, now).stale, true);
    assert.equal(branchFlags({ name: 'feature/LF-1', createdAt: new Date('2026-11-25'), deleted: false, merged: false }, 'main', s, now).stale, false);
    assert.equal(branchFlags({ name: 'feature/LF-1', createdAt: new Date('2026-11-01'), deleted: false, merged: true }, 'main', s, now).stale, false);
    assert.equal(branchFlags({ name: 'main', createdAt: new Date('2026-01-01'), deleted: false, merged: false }, 'main', s, now).stale, false);
    assert.equal(branchFlags({ name: 'develop', createdAt: new Date('2026-01-01'), deleted: false, merged: false }, null, s, now).stale, false);
  });
  it('PR > 400 dòng ⇒ large', () => {
    assert.deepEqual(prFlags({ additions: 350, deletions: 51 }, s), { lines: 401, large: true });
    assert.deepEqual(prFlags({ additions: null, deletions: null }, s), { lines: 0, large: false });
  });
  it('5 mục vệ sinh repo; không đọc được ⇒ unknown cả 5', () => {
    const items = repoHealthOf({ rootFiles: ['.gitignore', '.env.example', 'pom.xml', '.github'], githubFiles: ['pull_request_template.md', 'workflows'], workflowFiles: ['ci.yml'], protection: null, defaultBranch: 'main', readable: true });
    assert.deepEqual(items.map((i) => `${i.key}:${i.state}`), ['gitignore:ok', 'envExample:ok', 'prTemplate:ok', 'ci:ok', 'branchProtection:unknown']);
    assert.match(items[4].detail, /không đọc|Cannot read/);
    const bad = repoHealthOf({ rootFiles: ['README.md'], githubFiles: [], workflowFiles: [], protection: false, defaultBranch: 'main', readable: true });
    assert.deepEqual(bad.map((i) => i.state), ['missing', 'missing', 'missing', 'missing', 'missing']);
    assert.ok(repoHealthOf({ rootFiles: [], githubFiles: [], workflowFiles: [], protection: null, defaultBranch: 'main', readable: false }).every((i) => i.state === 'unknown'));
  });
});

describe('C8 — CR có cấu trúc', () => {
  it('ma trận 6 chiều: mức lạ ⇒ NONE, toàn NONE không ghi chú ⇒ null, mức chung = chiều nặng nhất', () => {
    assert.equal(cleanImpactMatrix({}), null);
    const m = cleanImpactMatrix({ scope: { level: 'high', note: '2 màn mới' }, cost: { level: 'X' }, docs: { level: 'LOW' } })!;
    assert.equal(m.scope.level, 'HIGH');
    assert.equal(m.cost.level, 'NONE');
    assert.equal(m.quality.level, 'NONE');
    assert.equal(impactOverall(m), 'HIGH');
    assert.equal(impactOverall(null), 'NONE');
  });
  it('≤ 3 phương án A/B/C, chỉ một được chọn', () => {
    const o = cleanCrOptions([{ title: 'Làm ngay', chosen: true, effortDays: 2.25 }, { title: '' }, { title: 'Dời sang I3', chosen: true }, { title: 'Bỏ' }, { title: 'Thừa' }])!;
    assert.deepEqual(o.map((x) => [x.key, x.title, x.chosen]), [['A', 'Làm ngay', true], ['B', 'Dời sang I3', false], ['C', 'Bỏ', false]]);
    assert.equal(o[0].effortDays, 2.3);
    assert.equal(cleanCrOptions('x'), null);
  });
  it('khoá CR con a, b, …, z, aa', () => {
    assert.equal(childCrKey(3, 0), 'CR-3a');
    assert.equal(childCrKey(3, 1), 'CR-3b');
    assert.equal(childCrKey(3, 25), 'CR-3z');
    assert.equal(childCrKey(3, 26), 'CR-3aa');
  });
  it('checklist đồng bộ giữ giá trị cũ khi không gửi', () => {
    const a = cleanSyncChecklist({ srsRoc: true, rtm: true }, null, 7);
    const b = cleanSyncChecklist({ trackingWbs: true }, a, 8);
    assert.equal(syncDone(b), 3);
    assert.equal(b.updatedById, 8);
  });
});

describe('settings G4', () => {
  it('chuẩn hoá present / roleAlert / codeHealth / aiReviewMode; chỉ chạm khoá có mặt', () => {
    const n = normalizeG4Settings({
      other: 1, aiReviewMode: 'CRITIC', roleAlert: { qaMinPct: 150, maxWeekHours: 0 }, codeHealth: { branchMaxDays: 5, prMaxLines: 10 },
      present: { durationMin: 20, marks: [{ atMin: 25, label: 'quá giờ' }, { atMin: 9, label: 'Demo' }, { atMin: 2, label: 'Vấn đề' }, { label: 'thiếu phút' }], planBUrl: 'javascript:alert(1)', planBLabel: 'Clip' },
    });
    assert.equal(n.other, 1);
    assert.equal(n.aiReviewMode, null);
    assert.deepEqual(n.roleAlert, { qaMinPct: 100, maxWeekHours: 1 });
    assert.deepEqual(n.codeHealth, { branchMaxDays: 5, prMaxLines: 50 });
    assert.deepEqual(n.present, { durationMin: 20, marks: [{ atMin: 2, label: 'Vấn đề' }, { atMin: 9, label: 'Demo' }, { atMin: 20, label: 'quá giờ' }], planBUrl: null, planBLabel: 'Clip' });
    assert.ok(!('present' in normalizeG4Settings({ x: 1 })));
    assert.equal(normalizeG4Settings({ aiReviewMode: 'critic' }).aiReviewMode, 'critic');
    assert.equal(g4SettingsOf({}).aiReviewMode, 'full');
    assert.equal(g4SettingsOf({ present: { durationMin: 10, planBUrl: 'https://drive/x' } }).present.planBUrl, 'https://drive/x');
  });
});

describe('A25 — thư viện mẫu (thuần)', () => {
  it('đủ 5 bộ, bộ Solo khớp khoá học (5 vai, Evidence, WIP 2, notAssignee, nhịp Daily/giữa tuần/CN, gate)', () => {
    assert.deepEqual(BLUEPRINTS.map((b) => b.key), ['SWP391_TEAM5', 'SWP391_SOLO5', 'SEP490', 'OJT', 'SCRUM']);
    const solo = BLUEPRINTS.find((b) => b.key === 'SWP391_SOLO5')!;
    assert.deepEqual(solo.fields!.find((f) => f.name === 'Role (C1–C5)')!.options!.map((o) => o.label.slice(0, 2)), ['C1', 'C2', 'C3', 'C4', 'C5']);
    assert.equal(solo.workflow!.statuses.find((s) => s.name === 'In Progress')!.wipLimit, 2);
    assert.deepEqual(solo.workflow!.rules![0], { to: 'Done', onlyFrom: ['In Review'], rules: { notAssignee: true } });
    assert.equal((solo.gates!.doneRequirements as { fieldNames: string[] }).fieldNames[0], 'Evidence');
    assert.equal(solo.gates!.wipMode, 'block');
    assert.deepEqual(solo.cadence!.map((c) => c.byWeekday), [[1, 2, 3, 4, 5], [3], [0]]);
    assert.ok(solo.stages!.length >= 4);
    for (const t of ['ADR', 'Mini-Spec', 'User Story', 'interview', 'Use case', 'Design review']) assert.ok(solo.docs!.some((d) => d.title.toLowerCase().includes(t.toLowerCase())), t);
  });
  it('mỗi nhóm có nội dung ⇒ hiện; tắt nhóm ⇒ không bật; xem trước có dòng đọc được', () => {
    const b = BLUEPRINTS[1];
    assert.ok(groupsOf(b).includes('cadence'));
    assert.ok(!enabledGroups(b, { cadence: false }).has('cadence'));
    const pv = previewBlueprint(b, { docs: false });
    assert.equal(pv.groups.find((g) => g.key === 'docs')!.enabled, false);
    assert.match(pv.groups.find((g) => g.key === 'workflow')!.items[0], /In Progress \(WIP 2\)/);
    assert.ok(!groupsOf(BLUEPRINTS.find((x) => x.key === 'SCRUM')!).includes('stages'));
  });
  it('gates: tên trường ⇒ id thật; trường bị tắt ⇒ bỏ cổng đó', () => {
    const b = BLUEPRINTS[1];
    const on = enabledGroups(b);
    const p = gateSettingsPatch(b, on, new Map([['evidence', 11], ['ready (dor)', 12]]), new Map());
    assert.deepEqual((p.doneRequirements as { fieldIds: number[] }).fieldIds, [11]);
    assert.deepEqual((p.readyRequirements as { fieldIds: number[]; toStatusIds: null }).fieldIds, [12]);
    assert.equal(p.testGate, 'block');
    assert.ok(Array.isArray(p.definitionOfDone));
    const none = gateSettingsPatch(b, on, new Map(), new Map());
    assert.ok(!('doneRequirements' in none));
  });
  it('chép cấu hình: đổi id trường/trạng thái, bỏ người duyệt cổng + bố cục cũ', () => {
    const out = remapSettings({
      doneRequirements: { fieldIds: [1, 2, 99], typeKeys: ['STORY'] }, readyRequirements: { fieldIds: [2], toStatusIds: [10] },
      boardColumns: [{ name: 'Doing', statusIds: [10, 11] }, { name: 'Gone', statusIds: [77] }], stageGate: { approverIds: [5] }, workflowLayout: { 3: {} }, wipMode: 'block',
    }, new Map([[1, 101], [2, 102]]), new Map([[10, 210], [11, 211]]));
    assert.deepEqual(out.doneRequirements, { fieldIds: [101, 102], typeKeys: ['STORY'] });
    assert.deepEqual(out.readyRequirements, { fieldIds: [102], toStatusIds: [210] });
    assert.deepEqual(out.boardColumns, [{ name: 'Doing', statusIds: [210, 211] }]);
    assert.ok(!('stageGate' in out) && !('workflowLayout' in out));
    assert.equal(out.wipMode, 'block');
  });
});

describe('C12 — export_file kind mới', () => {
  it('đúng tuyến REST + bắt thiếu tham số', () => {
    assert.equal(exportRoute('contrib_xlsx', { from: '2026-11-01', to: '2026-11-30', lang: 'vi' }).path, '/contrib/export.xlsx?from=2026-11-01&to=2026-11-30&lang=vi');
    assert.equal(exportRoute('contrib_pdf', {}).path, '/contrib/export.pdf');
    assert.equal(exportRoute('test_cycle', { cycleId: 4, format: 'pdf' }).path, '/test-cycles/4/export?format=pdf');
    assert.equal(exportRoute('meeting_minutes', { meeting: 3 }).path, '/meetings/3/minutes-export?format=docx');
    assert.equal(exportRoute('review', { review: 2, format: 'pdf', lang: 'en' }).path, '/reviews/2/export?format=pdf&lang=en');
    assert.throws(() => exportRoute('test_cycle', {}), /cycle/);
    assert.throws(() => exportRoute('meeting_minutes', {}), /meeting/);
    assert.throws(() => exportRoute('review', {}), /review/);
  });
});
