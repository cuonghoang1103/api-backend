/** CT Work đợt 6 — hàm thuần: kỹ thuật thiết kế test, số đo, ước lượng, rủi ro, TSR, review, baseline. */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  allPairs, decisionRules, dtInput, epClasses, generateDecisionTable, generateEpBva, generatePairwise, generateStateTransition,
  pairCoverage, toUnitMatrix, toXray,
} from './testDesign.js';
import { cycleStats, defectStats, estimateTesting, evaluateExit, retestStats, riskLevel, sCurve, tcFromFp, tsrMarkdown } from './testMetrics.js';
import { checklistItems, CHECKLISTS, closeBlockers, REVIEW_FLOW, reviewMetrics, reviewMinutesMarkdown } from './reviewRules.js';
import { baselineHash, diffBaselines, itemHash, signoffOutcome, stableJson, type BaselineItem } from './baselineRules.js';

describe('EP + BVA', () => {
  it('trường số [18, 60]: lớp hợp lệ/không hợp lệ + biên 2 điểm', () => {
    const cl = epClasses({ name: 'age', kind: 'number', min: 18, max: 60, step: 1 }, 2);
    const samples = cl.map((c) => `${c.valid ? 'V' : 'I'}${c.boundary ? 'b' : ''}:${c.sample}`);
    assert.ok(samples.includes('V:39'));
    for (const s of ['Ib:17', 'Vb:18', 'Vb:60', 'Ib:61']) assert.ok(samples.includes(s), s);
    assert.ok(cl.some((c) => !c.valid && !c.boundary && Number(c.sample) < 18));
    assert.ok(cl.some((c) => !c.valid && !c.boundary && Number(c.sample) > 60));
  });
  it('BVA 3 điểm thêm min+1, max−1; độ dài chuỗi sinh chuỗi đúng độ dài', () => {
    const n = epClasses({ name: 'age', kind: 'number', min: 18, max: 60 }, 3).filter((c) => c.boundary).map((c) => c.sample);
    assert.deepEqual(n.sort(), ['17', '18', '19', '59', '60', '61'].sort());
    const s = epClasses({ name: 'pw', kind: 'length', min: 8, max: 16 }, 2);
    assert.ok(s.some((c) => c.boundary && c.sample.length === 7 && !c.valid));
    assert.ok(s.some((c) => c.boundary && c.sample.length === 16 && c.valid));
  });
  it('một lớp không hợp lệ mỗi case; case đầu tiên hợp lệ toàn bộ', () => {
    const r = generateEpBva({ fields: [{ name: 'age', kind: 'number', min: 18, max: 60 }, { name: 'role', kind: 'enum', values: ['admin', 'user'] }], validOutcome: 'Saved' });
    assert.equal(r.cases[0].expected, 'Saved');
    assert.equal(r.cases[0].type, 'N');
    const invalid = r.cases.filter((c) => c.type === 'A');
    assert.ok(invalid.length >= 3);
    for (const c of invalid) {
      const bad = Object.entries(c.inputs).filter(([k, v]) => (k === 'age' ? Number(v) < 18 || Number(v) > 60 : !['admin', 'user'].includes(v)));
      assert.equal(bad.length, 1, `${c.title} ⇒ ${JSON.stringify(c.inputs)}`);
    }
    assert.ok(r.cases.some((c) => c.inputs.role === 'user' && c.type === 'N'), 'mỗi giá trị enum hợp lệ có case');
    assert.ok(r.cases.some((c) => c.type === 'B'));
    assert.throws(() => generateEpBva({ fields: [{ name: 'x', kind: 'number', min: 5, max: 1 }] }), /min is greater/);
  });
});

describe('Bảng quyết định', () => {
  it('đủ 2^n luật, gộp "–" khi cùng hành động khác một điều kiện', () => {
    const input = dtInput.parse({
      conditions: ['Valid user', 'Valid password'], actions: ['Login', 'Show error'],
      outcomes: { TT: [0], TF: [1], FT: [1], FF: [1] },
    });
    const { full, rules } = decisionRules(input);
    assert.equal(full.length, 4);
    assert.equal(rules.length, 3, JSON.stringify(rules)); // TT · TF · F-
    assert.ok(rules.some((r) => r.conditions.includes('-')));
    assert.equal(rules.reduce((n, r) => n + r.combos.length, 0), 4, 'mọi tổ hợp vẫn thuộc đúng một luật');
    const r = generateDecisionTable(input);
    assert.equal(r.coverage.covered, 4);
    assert.equal(r.cases.find((c) => c.inputs['Valid user'] === 'Yes' && c.inputs['Valid password'] === 'Yes')!.expected, 'Login');
  });
  it('bỏ luật không thể xảy ra + cảnh báo luật chưa có hành động', () => {
    const r = generateDecisionTable({ conditions: ['A', 'B', 'C'], actions: ['X'], outcomes: { TTT: [0] }, impossible: ['FFF'], collapse: false });
    assert.equal(r.cases.length, 7);
    assert.match(r.warnings[0], /6 rule/);
  });
});

describe('Chuyển trạng thái', () => {
  const machine = {
    states: ['Draft', 'Submitted', 'Approved', 'Rejected'], initial: 'Draft',
    transitions: [
      { from: 'Draft', event: 'submit', to: 'Submitted' },
      { from: 'Submitted', event: 'approve', to: 'Approved' },
      { from: 'Submitted', event: 'reject', to: 'Rejected' },
      { from: 'Rejected', event: 'edit', to: 'Draft' },
    ],
  };
  it('phủ mọi cạnh (0-switch) với đường đi ngắn nhất từ trạng thái đầu', () => {
    const r = generateStateTransition(machine);
    assert.equal(r.coverage.covered, 4);
    assert.equal(r.cases.length, 4);
    const edit = r.cases.find((c) => c.title.startsWith('Rejected'))!;
    assert.deepEqual(edit.steps!.map((s) => s.action), ['In Draft: submit', 'In Submitted: reject', 'In Rejected: edit']);
  });
  it('case cạnh không hợp lệ + báo trạng thái không tới được', () => {
    const r = generateStateTransition({ ...machine, invalid: true });
    assert.ok(r.cases.some((c) => c.type === 'A' && c.title === 'Invalid: approve in Draft'));
    const u = generateStateTransition({ states: ['A', 'B', 'C'], initial: 'A', transitions: [{ from: 'A', event: 'go', to: 'B' }, { from: 'C', event: 'x', to: 'A' }] });
    assert.match(u.warnings[0], /Unreachable.*C/);
    assert.throws(() => generateStateTransition({ states: ['A', 'B'], initial: 'Z', transitions: [{ from: 'A', event: 'e', to: 'B' }] }), /Initial state/);
  });
});

describe('Pairwise', () => {
  it('phủ đủ mọi cặp, ít dòng hơn tổ hợp đầy đủ', () => {
    for (const sizes of [[2, 2, 2], [3, 3, 3, 3], [4, 3, 2, 5, 2], [2, 7], [3, 2, 2, 2, 2, 2, 2]]) {
      const rows = allPairs(sizes);
      const cov = pairCoverage(sizes, rows);
      assert.equal(cov.covered, cov.total, `sizes ${sizes}`);
      assert.ok(rows.length <= sizes.reduce((a, b) => a * b, 1));
    }
    assert.ok(allPairs([3, 3, 3, 3]).length <= 12); // tối ưu là 9; IPOG thường 9–11
    const r = generatePairwise({ parameters: [{ name: 'Browser', values: ['Chrome', 'Firefox', 'Safari'] }, { name: 'OS', values: ['Win', 'Mac'] }, { name: 'Lang', values: ['vi', 'en'] }] });
    assert.equal(r.coverage.covered, r.coverage.total);
    assert.ok((r.table as { reduction: number }).reduction > 0);
  });
});

describe('Đổ case ra Xray / 5.1', () => {
  it('Xray: case không bước ⇒ một bước có dữ liệu; 5.1: hàng COND/CONFIRM + dấu O khớp', () => {
    const r = generateEpBva({ fields: [{ name: 'qty', kind: 'number', min: 1, max: 10 }] });
    const x = toXray(r.cases[1], 'Qty');
    assert.equal(x.steps.length, 1);
    assert.match(x.steps[0].data!, /qty = /);
    const m = toUnitMatrix(r.cases);
    assert.equal(m.cases.length, r.cases.length);
    for (const c of m.cases) assert.equal(m.marks.filter(([, ck]) => ck === c.key).length, 2, 'một COND + một CONFIRM');
    assert.ok(m.rows.some((row) => row.section === 'CONFIRM' && row.groupName === 'Exception'));
    assert.deepEqual(new Set(m.cases.map((c) => c.type)), new Set(['N', 'A', 'B']));
  });
});

describe('Số đo kiểm thử', () => {
  const day = (d: number) => new Date(Date.UTC(2026, 9, d));
  const cycles = [{ id: 1, name: 'R1', state: 'DONE', startAt: day(1), endAt: day(5), createdAt: day(1) }, { id: 2, name: 'R2', state: 'IN_PROGRESS', startAt: day(6), endAt: day(10), createdAt: day(6) }];
  const runs = [
    { cycleId: 1, testCaseId: 1, status: 'PASS', executedAt: day(2) }, { cycleId: 1, testCaseId: 2, status: 'FAIL', executedAt: day(2) },
    { cycleId: 1, testCaseId: 3, status: 'FAIL', executedAt: day(3) }, { cycleId: 1, testCaseId: 4, status: 'TODO', executedAt: null },
    { cycleId: 2, testCaseId: 2, status: 'PASS', executedAt: day(7) }, { cycleId: 2, testCaseId: 3, status: 'RETEST', executedAt: null },
  ];
  it('pass rate theo vòng chỉ tính lượt đã thực thi; retest rate', () => {
    const s = cycleStats(cycles, runs);
    assert.equal(s[0].passRate, 33.3);
    assert.equal(s[0].progress, 75);
    assert.equal(s[1].passRate, 100);
    const r = retestStats(cycles, runs);
    assert.deepEqual([r.failedCases, r.retested, r.fixedOnRetest, r.retestRate], [2, 2, 1, 100]);
  });
  it('đường S: kế hoạch tuyến tính, thực tế cộng dồn', () => {
    const pts = sCurve(cycles[0], runs, day(4));
    assert.equal(pts[0].planned, 0);
    assert.equal(pts[pts.length - 1].planned, 4);
    assert.equal(pts.find((p) => p.day === '2026-10-03')!.actual, 3);
    assert.equal(pts.find((p) => p.day === '2026-10-05')!.actual, null);
  });
  it('defect: leakage/DRE theo pha AT, tuổi, mở lại', () => {
    const d = (o: Partial<Parameters<typeof defectStats>[0][number]>) => ({ severity: 'MAJOR', activity: 'ST', module: 'Login', open: false, createdAt: day(1), resolvedAt: day(3), rootCause: null, injectedPhase: null, reopened: false, ...o });
    const s = defectStats([d({}), d({ activity: 'AT', open: true, resolvedAt: null }), d({ severity: 'CRITICAL', reopened: true }), d({ activity: null })]);
    assert.equal(s.leakage, 33.3);
    assert.equal(s.dre, 66.7);
    assert.equal(s.avgAgeDays, 2);
    assert.equal(s.reopenRate, 25);
    assert.equal(s.bySeverity[0].key, 'MAJOR');
  });
  it('ước lượng: TC & FP, rủi ro 5×5, tiêu chí ra', () => {
    assert.equal(tcFromFp(100), 251);
    const e = estimateTesting({ size: 100, designPerDay: 25, executePerDay: 40, cycles: 3, retestPct: 50, overheadPct: 20 });
    assert.equal(e.effort.designDays, 4);
    assert.equal(e.executions, 200);
    assert.equal(e.effort.totalDays, 10.8);
    assert.deepEqual(riskLevel(4, 5), { score: 20, level: 'CRITICAL' });
    assert.deepEqual(riskLevel(2, 2), { score: 4, level: 'LOW' });
    assert.equal(riskLevel(null, 3).level, null);
    const x = evaluateExit({ passRate: 90 }, { passRate: 92, openCritical: 0, openMajor: 1, reqCoverage: 100, executed: 100 });
    assert.equal(x.met, true);
    assert.equal(evaluateExit({}, { passRate: 92, openCritical: 1, openMajor: 0, reqCoverage: 100, executed: 100 }).met, false);
  });
  it('TSR IEEE 829 có đủ 8 mục, hai ngôn ngữ', () => {
    const base = {
      project: { name: 'LabFlow', key: 'LF' }, planName: 'Release 1', identifier: 'LF-TSR-1', preparedBy: 'QA', date: day(10), scopeIn: 'Login', scopeOut: '', environment: 'Chrome',
      cycles: cycleStats(cycles, runs), retest: retestStats(cycles, runs), defects: defectStats([]),
      coverage: { requirements: 2, covered: 1, verified: 1, pct: 50, verifiedPct: 50 },
      exit: evaluateExit({}, { passRate: 100, openCritical: 0, openMajor: 0, reqCoverage: 50, executed: 50 }),
      variances: '', risks: [], openCritical: [], approvers: [], levels: [{ level: 'SYSTEM', cases: 4 }], exploratory: { sessions: 1, bugs: 2, minutes: 60 },
    };
    const en = tsrMarkdown({ ...base, language: 'en' });
    for (const h of ['## 1.', '## 2.', '## 3.', '## 4.', '## 5.', '## 6.', '## 7.', '## 8.']) assert.ok(en.includes(h), h);
    assert.match(en, /Exit criteria NOT met/);
    assert.match(tsrMarkdown({ ...base, language: 'vi' }), /Báo cáo tổng kết kiểm thử/);
  });
});

describe('Review / inspection', () => {
  it('mẫu checklist hai ngôn ngữ, đủ số câu', () => {
    for (const c of CHECKLISTS) {
      assert.equal(checklistItems(c.key, 'en').length, checklistItems(c.key, 'vi').length);
      assert.ok(checklistItems(c.key, 'en').length >= 6, c.key);
    }
    assert.ok(CHECKLISTS.some((c) => c.key === 'UT_WHITEBOX') && CHECKLISTS.some((c) => c.key === 'JAVA_BASIC'));
    assert.deepEqual(checklistItems('NOPE', 'en'), []);
  });
  it('số đo: tốc độ, mật độ lỗi, hiệu suất; cảnh báo đọc quá nhanh', () => {
    const m = reviewMetrics({
      size: 10, sizeUnit: 'PAGE', meetingMinutes: 60, reworkMinutes: 30,
      participants: [{ userId: 1, role: 'MODERATOR', prepMinutes: 60 }, { userId: 2, role: 'AUTHOR', prepMinutes: 0 }, { userId: 3, role: 'REVIEWER', prepMinutes: 120 }],
      items: [{ result: 'NG', severity: 'MAJOR' }, { result: 'NG', severity: 'MINOR' }, { result: 'OK', severity: null }, { result: null, severity: null }],
    });
    assert.equal(m.rate, 10);
    assert.equal(m.rateTooFast, true);
    assert.equal(m.density, 0.2);
    assert.equal(m.defects, 2);
    assert.equal(m.majorDefects, 1);
    assert.equal(m.efficiency, 0.33); // 2 lỗi / (3h chuẩn bị + 3 người × 1h họp)
    assert.equal(m.checklistProgress, 75);
    const code = reviewMetrics({ size: 400, sizeUnit: 'LOC', meetingMinutes: 120, reworkMinutes: null, participants: [], items: [{ result: 'NG', severity: null }] });
    assert.equal(code.density, 2.5);
    assert.equal(code.rateTooFast, false);
  });
  it('luồng trạng thái + điều kiện đóng + biên bản', () => {
    assert.deepEqual(REVIEW_FLOW.CLOSED, []);
    assert.ok(REVIEW_FLOW.MEETING.includes('REWORK'));
    assert.deepEqual(closeBlockers({ decision: null, items: [{ result: null }], participants: [] }).sort(), ['CHECKLIST_INCOMPLETE', 'NO_DECISION', 'NO_MODERATOR']);
    const md = reviewMinutesMarkdown({
      language: 'en', project: { name: 'P', key: 'P' },
      session: { key: 'REV-1', title: 'SRS v1', kind: 'DOC', method: 'INSPECTION', checklistName: 'SRS', workProduct: 'SRS', prUrl: null, status: 'CLOSED', decision: 'REINSPECT', meetingAt: null, entryCriteria: null, exitCriteria: null, notes: null },
      participants: [{ name: 'Ann', role: 'MODERATOR', prepMinutes: 30 }],
      items: [{ section: 'S', question: 'Q | pipe', result: 'NG', line: '3', note: null, severity: 'MAJOR', defectKey: 'P-9' }],
      metrics: reviewMetrics({ size: 2, sizeUnit: 'PAGE', meetingMinutes: 30, reworkMinutes: 0, participants: [{ role: 'MODERATOR', prepMinutes: 30 }], items: [{ result: 'NG', severity: 'MAJOR' }] }),
    });
    assert.match(md, /Re-inspect after rework/);
    assert.match(md, /Q \\\| pipe/);
    assert.match(md, /P-9 \(MAJOR\)/);
  });
});

describe('Baseline', () => {
  const it1 = (kind: BaselineItem['kind'], refId: number, content: unknown, title = `T${refId}`): BaselineItem => ({ kind, refId, ref: `${kind}-${refId}`, title, version: '1', hash: itemHash(content) });
  it('hash ổn định theo nội dung, không theo thứ tự khoá/mục', () => {
    assert.equal(stableJson({ b: 1, a: [1, { d: 2, c: 3 }] }), '{"a":[1,{"c":3,"d":2}],"b":1}');
    const a = [it1('REQ', 1, { t: 'x', d: 'y' }), it1('UC', 2, 'flow')];
    assert.equal(baselineHash(a), baselineHash([...a].reverse()));
    assert.notEqual(baselineHash(a), baselineHash([it1('REQ', 1, { t: 'x', d: 'z' }), it1('UC', 2, 'flow')]));
  });
  it('so sánh: thêm / bỏ / đổi + độ biến động', () => {
    const d = diffBaselines([it1('REQ', 1, 'a'), it1('REQ', 2, 'b'), it1('BR', 3, 'c')], [it1('REQ', 1, 'a'), it1('REQ', 2, 'B!', 'Renamed'), it1('DOC', 9, 'd')]);
    assert.deepEqual(d.counts, { added: 1, removed: 1, changed: 1 });
    assert.equal(d.unchanged, 1);
    assert.equal(d.volatility, 100);
    assert.equal(d.rows.find((r) => r.change === 'CHANGED')!.fromTitle, 'T2');
  });
  it('kết quả chữ ký', () => {
    assert.equal(signoffOutcome(['APPROVED', 'APPROVED']), 'APPROVED');
    assert.equal(signoffOutcome(['APPROVED', 'PENDING']), 'PENDING');
    assert.equal(signoffOutcome(['APPROVED', 'REJECTED']), 'REJECTED');
    assert.equal(signoffOutcome([]), 'PENDING');
  });
});

describe('D9 — nhập ZIP: luật tự động đổi id, worklog/chữ ký người ngoài thành ghi chú', async () => {
  const { remapAutomationConfig, orphanWorklogNote, orphanSignatureLines } = await import('./importRemap.js');
  const maps = {
    status: (o: number) => ({ 10: 110, 11: 111 } as Record<number, number>)[o],
    label: (o: number) => ({ 5: 55 } as Record<number, number>)[o],
    user: (o: number) => ({ 1: 101 } as Record<number, number>)[o] ?? null,
  };
  it('đổi id đã biết; bỏ phần tử/hành động không đổi được; assign null gốc giữ nguyên', () => {
    const { config, dropped } = remapAutomationConfig({
      toStatusIds: [10, 99], conditions: [{ jql: 'status = Done' }],
      actions: [
        { kind: 'transition', statusId: 11 }, { kind: 'transition', statusId: 98 }, { kind: 'add_label', labelId: 7 },
        { kind: 'assign', assignee: 2 }, { kind: 'assign', assignee: 1 }, { kind: 'assign', assignee: null }, { kind: 'assign', assignee: 'reporter' },
        { kind: 'notify', to: ['watchers', 1, 3] },
      ],
    }, maps);
    assert.deepEqual(config.toStatusIds, [110]);
    assert.deepEqual((config.actions as any[]).map((a) => [a.kind, a.statusId ?? a.labelId ?? a.assignee ?? a.to]), [
      ['transition', 111], ['assign', 101], ['assign', undefined], ['assign', 'reporter'], ['notify', ['watchers', 101]],
    ]);
    assert.ok(dropped.length >= 5);
    assert.deepEqual((config._import as any).dropped, dropped);
    assert.deepEqual(remapAutomationConfig({ actions: [{ kind: 'comment', text: 'hi' }] }, maps).dropped, []);
  });
  it('ghi chú worklog + chữ ký', () => {
    const n = orphanWorklogNote([{ name: 'An', minutes: 90, startedAt: '2026-10-02T03:00:00Z', note: 'fix' }, { name: 'Bình', minutes: 30, startedAt: '2026-10-01T03:00:00Z' }]);
    assert.match(n.text, /2h total/);
    assert.match(n.text.split('\n')[1], /^2026-10-01 · Bình · 30m/);
    assert.match(orphanSignatureLines([{ name: 'An', decision: 'APPROVED', decidedAt: '2026-10-03T04:05:00Z', comment: 'ok', contentHash: 'abcdef1234567890' }]), /An: APPROVED on 2026-10-03 04:05 UTC \(hash abcdef123456\) — ok/);
  });
});

describe('D3 — bộ đệm ngắn theo dự án (single-flight + xoá khi dự án đổi)', async () => {
  const { projectCached, _setProjectCacheDisabledForTests } = await import('./projectCache.js');
  const { emitWorkEvent } = await import('./events.js');
  it('8 request trùng khoá ⇒ 1 lần tính; sự kiện của dự án ⇒ tính lại; dự án khác không ảnh hưởng; lỗi không bị đệm', async () => {
    _setProjectCacheDisabledForTests(false);
    let n = 0;
    const slow = () => new Promise<number>((r) => setTimeout(() => r(++n), 20));
    const got = await Promise.all(Array.from({ length: 8 }, () => projectCached(901, 'k', slow)));
    assert.deepEqual(new Set(got), new Set([1]));
    assert.equal(await projectCached(901, 'k', slow), 1);
    await projectCached(902, 'k', slow);
    emitWorkEvent({ type: 'project.updated', projectId: 901, actor: { kind: 'USER', userId: 1 } } as never);
    await new Promise((r) => setImmediate(r)); // listener chạy ở microtask
    assert.equal(await projectCached(901, 'k', slow), 3);
    assert.equal(await projectCached(902, 'k', slow), 2);
    let fail = true;
    await assert.rejects(projectCached(903, 'e', async () => { if (fail) throw new Error('x'); return 1; }));
    fail = false;
    assert.equal(await projectCached(903, 'e', async () => 7), 7);
    _setProjectCacheDisabledForTests(true);
  });
});
