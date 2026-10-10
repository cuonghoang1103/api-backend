/**
 * CT Work đợt 8c — phần THUẦN: họp định kỳ (RRULE, EXDATE, tách chuỗi), mẫu chương trình, SARIF + V(G), ảnh Mermaid
 * (làm sạch SVG), ước lượng BA (khớp tệp Wiegers), báo cáo trạng thái yêu cầu, stakeholder AI, cycle CI tự đóng,
 * phiên bản test case, định nghĩa chỉ số tiếng Việt.
 *   npx tsx --test src/services/work/ctw8c.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  describeRecurrence, MEETING_TEMPLATES, meetingTemplate, normalizeRecurrence, occurrencesBetween, occurrenceTimes, parseExdates,
  splitRecurrence, templateAgendaItems, toRrule,
} from './meetingSeries.js';
import {
  complexityFromMessage, complexityRisk, complexitySummary, cyclomatic, cyclomaticFromDecisions, fingerprintOf, fixedFingerprints, normPath,
  parseJacocoComplexity, parseLizardCsv, parseSarif, parseStatic, unitKey,
} from './staticAnalysis.js';
import { decodePng, krokiUrl, normalizeMermaid, renderHash, sanitizeSvg } from './diagramRender.js';
import { countMismatches, estimate, parseTurns, stakeholderPrompt, statusReport, turnsAsTranscript, weekStart, type EstCounts } from './swrPack.js';
import { cycleCloseDecision, cycleIdleExpired } from './testAutomation.service.js';
import { testContentKey } from './tests.service.js';
import { METRIC_DEFINITIONS, METRIC_DEFINITIONS_VI, metricDefinitions } from './contribRules.js';
import { zonedMidnight } from './projectTime.js';

describe('họp định kỳ — luật lặp', () => {
  const weekly = normalizeRecurrence({ freq: 'WEEKLY', interval: 1, byWeekday: [1, 4], hour: 9, minute: 30, startDate: '2026-10-12', endDate: null });
  it('WEEKLY thứ Hai + thứ Năm, bỏ EXDATE', () => {
    assert.deepEqual(occurrencesBetween(weekly, '2026-10-12', '2026-10-25'), ['2026-10-12', '2026-10-15', '2026-10-19', '2026-10-22']);
    assert.deepEqual(occurrencesBetween(weekly, '2026-10-12', '2026-10-25', ['2026-10-15']), ['2026-10-12', '2026-10-19', '2026-10-22']);
  });
  it('2 tuần một lần, trần số buổi, UNTIL', () => {
    const r = normalizeRecurrence({ freq: 'WEEKLY', interval: 2, byWeekday: [5], hour: 14, minute: 0, startDate: '2026-10-16', endDate: '2026-12-31' });
    assert.deepEqual(occurrencesBetween(r, '2026-10-01', '2026-11-30'), ['2026-10-16', '2026-10-30', '2026-11-13', '2026-11-27']);
    assert.equal(occurrencesBetween(r, '2026-10-01', '2027-06-01').at(-1), '2026-12-25');
    assert.equal(occurrencesBetween(r, '2026-10-01', '2027-06-01', [], 2).length, 2);
  });
  it('MONTHLY ngày cuối tháng', () => {
    const r = normalizeRecurrence({ freq: 'MONTHLY', interval: 1, byMonthDay: -1, hour: 8, minute: 0, startDate: '2026-01-31', endDate: null });
    assert.deepEqual(occurrencesBetween(r, '2026-01-01', '2026-04-30'), ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30']);
  });
  it('giờ bắt đầu/kết thúc theo múi giờ (09:30 VN = 02:30Z)', () => {
    const t = occurrenceTimes(weekly, '2026-10-12', 45, (d) => zonedMidnight(d, 'Asia/Ho_Chi_Minh'));
    assert.equal(t.startsAt.toISOString(), '2026-10-12T02:30:00.000Z');
    assert.equal(t.endsAt.toISOString(), '2026-10-12T03:15:00.000Z');
  });
  it('tách chuỗi "từ buổi này về sau" giữ thứ trong tuần', () => {
    const r = normalizeRecurrence({ freq: 'WEEKLY', interval: 1, byWeekday: [], hour: 9, minute: 0, startDate: '2026-10-13', endDate: null });
    const { before, after } = splitRecurrence(r, '2026-10-27', { hour: 10 });
    assert.equal(before?.endDate, '2026-10-26');
    assert.equal(after.startDate, '2026-10-27');
    assert.deepEqual(after.byWeekday, [2]);
    assert.equal(after.hour, 10);
    assert.equal(splitRecurrence(r, '2026-10-13').before, null, 'tách ở buổi đầu ⇒ không còn phần trước');
  });
  it('RRULE + câu mô tả + EXDATE sạch', () => {
    assert.equal(toRrule(weekly), 'FREQ=WEEKLY;BYDAY=MO,TH;BYHOUR=9;BYMINUTE=30');
    assert.equal(describeRecurrence(weekly), 'Weekly on Mon, Thu at 09:30');
    assert.match(describeRecurrence(weekly, 'vi'), /Hằng tuần vào T2, T5 lúc 09:30/);
    assert.deepEqual(parseExdates(['2026-10-15', 'x', '2026-10-15', 3]), ['2026-10-15']);
  });
});

describe('mẫu chương trình họp', () => {
  it('đủ 6 mẫu đề giao: daily, planning, review, retro, giảng viên, khách', () => {
    assert.deepEqual(MEETING_TEMPLATES.map((t) => t.key), ['daily', 'sprint-planning', 'sprint-review', 'retro', 'lecturer', 'client']);
    for (const t of MEETING_TEMPLATES) {
      assert.ok(t.agenda.length >= 3 && t.minutes.includes('##'), t.key);
      assert.equal(t.agenda.reduce((a, x) => a + x.minutes, 0) <= t.durationMin, true, `${t.key}: agenda vượt thời lượng`);
    }
    assert.equal(meetingTemplate('daily')?.durationMin, 15);
    assert.equal(meetingTemplate('nope'), null);
    assert.deepEqual(templateAgendaItems(meetingTemplate('retro')!).map((i) => i.id).slice(0, 2), ['retro-1', 'retro-2']);
  });
});

describe('phân tích tĩnh — SARIF', () => {
  const sarif = {
    version: '2.1.0',
    runs: [{
      tool: { driver: { name: 'ESLint', rules: [{ id: 'no-unused-vars', helpUri: 'https://eslint.org/docs/rules/no-unused-vars', defaultConfiguration: { level: 'warning' } }, { id: 'complexity' }] } },
      results: [
        { ruleId: 'no-unused-vars', message: { text: "'x' is defined but never used." }, locations: [{ physicalLocation: { artifactLocation: { uri: 'file:///home/runner/work/app/app/src/a.ts' }, region: { startLine: 12 } } }] },
        { ruleId: 'complexity', level: 'error', message: { text: "Function 'login' has a complexity of 14. Maximum allowed is 10." }, locations: [{ physicalLocation: { artifactLocation: { uri: 'src/auth.ts' }, region: { startLine: 3 } } }] },
        { ruleId: 'no-unused-vars', message: { text: 'suppressed' }, suppressions: [{ kind: 'inSource' }] },
      ],
    }, { tool: { driver: { name: 'Semgrep' } }, results: [{ ruleId: 'sql-injection', level: 'error', message: { text: 'Possible SQL injection' }, partialFingerprints: { primaryLocationLineHash: 'abc:1' }, locations: [{ physicalLocation: { artifactLocation: { uri: 'src/db.ts' }, region: { startLine: 40 } } }] }] }],
  };
  const p = parseSarif(sarif);
  it('đọc kết quả, mức, tệp chuẩn hoá, bỏ kết quả đã tắt', () => {
    assert.deepEqual(p.tools, ['ESLint', 'Semgrep']);
    assert.equal(p.findings.length, 3);
    assert.equal(p.findings[0].file, 'src/a.ts');
    assert.equal(p.findings[0].level, 'warning');
    assert.equal(p.findings[0].helpUri, 'https://eslint.org/docs/rules/no-unused-vars');
    assert.equal(p.findings[1].level, 'error');
  });
  it('V(G) từ rule complexity của ESLint/PMD', () => {
    assert.deepEqual(p.complexity, [{ name: 'login', file: 'src/auth.ts', line: 3, vg: 14, source: 'SARIF' }]);
    assert.deepEqual(complexityFromMessage('CyclomaticComplexity', "The method 'save()' has a cyclomatic complexity of 12."), { name: 'save', vg: 12 });
    assert.equal(complexityFromMessage('S3776', 'Cognitive Complexity of 20'), null);
    assert.equal(complexityFromMessage('sonar:cognitive-complexity', 'complexity of 20'), null);
  });
  it('dấu vân tay ổn định khi dòng xê dịch, dùng partialFingerprints khi có', () => {
    const a = fingerprintOf({ tool: 'ESLint', ruleId: 'r', file: 'a.ts', message: 'Line 12: bad thing at col 4' });
    const b = fingerprintOf({ tool: 'ESLint', ruleId: 'r', file: 'a.ts', message: 'Line 15: bad thing at col 9' });
    assert.equal(a, b);
    assert.notEqual(a, fingerprintOf({ tool: 'ESLint', ruleId: 'r', file: 'b.ts', message: 'Line 12: bad thing at col 4' }));
    assert.equal(p.findings[2].fingerprint, fingerprintOf({ tool: 'Semgrep', ruleId: 'sql-injection', file: 'src/db.ts', message: 'whatever' }, 'abc:1'));
    assert.deepEqual(fixedFingerprints([{ fingerprint: 'a' }, { fingerprint: 'b' }], new Set(['a'])), ['b']);
  });
  it('báo lỗi rõ khi không phải SARIF; tự nhận dạng định dạng', () => {
    assert.throws(() => parseSarif('{"x":1}'), /no "runs"/);
    assert.throws(() => parseSarif('not json'), /not valid JSON/);
    assert.equal(parseStatic(JSON.stringify(sarif)).kind, 'SARIF');
    assert.equal(normPath('D:\\a\\proj\\proj\\src\\Main.java'), 'src/Main.java');
  });
});

describe('V(G) — JaCoCo, lizard, máy tính', () => {
  const jacoco = `<?xml version="1.0"?><!DOCTYPE report PUBLIC "-//JACOCO//DTD Report 1.1//EN" "report.dtd"><report name="lab"><package name="vn/fpt/lab"><class name="vn/fpt/lab/Calc" sourcefilename="Calc.java">
    <method name="&lt;init&gt;" desc="()V" line="3"><counter type="COMPLEXITY" missed="0" covered="1"/></method>
    <method name="divide" desc="(II)I" line="8"><counter type="INSTRUCTION" missed="2" covered="10"/><counter type="COMPLEXITY" missed="1" covered="3"/></method>
  </class></package></report>`;
  it('JaCoCo: V(G) = missed + covered của counter COMPLEXITY', () => {
    const r = parseJacocoComplexity(jacoco);
    assert.deepEqual(r.complexity.map((u) => [u.name, u.vg, u.file, u.line]), [['Calc()', 1, 'vn/fpt/lab/Calc.java', 3], ['Calc.divide', 4, 'vn/fpt/lab/Calc.java', 8]]);
    assert.equal(parseStatic(jacoco).kind, 'JACOCO');
  });
  it('lizard --csv có/không tiêu đề', () => {
    const noHead = '5,3,40,2,7,"divide@8-14@src/Calc.java","src/Calc.java","divide","divide( int a , int b )",8,14';
    const r = parseLizardCsv(noHead);
    assert.deepEqual(r.complexity.map((u) => [u.name, u.vg, u.line]), [['divide', 3, 8]]);
    const head = `NLOC,CCN,token,PARAM,length,location,file,function,long_name,start,end\n${noHead}`;
    assert.equal(parseLizardCsv(head).complexity[0].vg, 3);
    assert.throws(() => parseLizardCsv('a,b\n'), /CCN/);
  });
  it('máy tính V(G) + phân loại SEI + tóm tắt', () => {
    assert.equal(cyclomatic(9, 8, 1), 3);
    assert.throws(() => cyclomatic(1, 5, 1), /at least 1/);
    assert.equal(cyclomaticFromDecisions(3), 4);
    assert.deepEqual([5, 15, 30, 60].map(complexityRisk), ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']);
    const s = complexitySummary([{ vg: 1 }, { vg: 4 }, { vg: 12 }]);
    assert.equal(s.units, 3); assert.equal(s.over10, 1); assert.equal(s.basisPaths, 17); assert.equal(s.average, 5.7);
    assert.equal(unitKey({ file: 'a', name: 'f' }), unitKey({ file: 'a', name: 'f' }));
  });
});

describe('ảnh Mermaid vẽ sẵn', () => {
  it('băm theo nguồn đã chuẩn hoá (CR, khoảng trắng cuối dòng)', () => {
    assert.equal(renderHash('graph TD\r\n  A-->B  \n'), renderHash('graph TD\n  A-->B'));
    assert.equal(normalizeMermaid('  \nx  \n'), 'x');
  });
  it('làm sạch SVG: bỏ script, on*, href ngoài, DOCTYPE', () => {
    const dirty = '<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)"><text>A</text></a><use href="#n1"/><image href="https://evil/x.png"/></svg>';
    const clean = sanitizeSvg(dirty)!;
    assert.ok(clean.startsWith('<svg'));
    assert.doesNotMatch(clean, /script|onload|javascript|ENTITY|evil/i);
    assert.match(clean, /href="#n1"/);
    assert.equal(sanitizeSvg('<html></html>'), null);
  });
  it('PNG: kiểm chữ ký; Kroki URL chỉ http(s)', () => {
    const png1 = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
    assert.ok(decodePng(`data:image/png;base64,${png1.toString('base64')}`));
    assert.equal(decodePng(`data:image/png;base64,${Buffer.from('GIF89a....').toString('base64')}`), null);
    assert.equal(krokiUrl('http://kroki:8000/', 'svg'), 'http://kroki:8000/mermaid/svg');
    assert.equal(krokiUrl('file:///x', 'png'), null);
  });
});

describe('R13 ước lượng BA — khớp tệp Wiegers', () => {
  // Đầu vào mẫu của `Chapter 19/Requirements Estimation Tool.xlsx` (sheet Summary, đọc thật 12/10/2026).
  const sample: EstCounts = { existingDocPages: 100, existingSystems: 1, stakeholders: 52, interfacesSmall: 50, interfacesMedium: 2, interfacesLarge: 1, useCases: 50, businessDataDiagrams: 2, screens: 100, reports: 100 };
  const e = estimate(sample, { project: { totalBudget: 2_000_000, baHourlyCost: 125, projectType: 'COTS', developers: 8, remote: false, projectWeeks: 56, requirementsWeeks: 28 } });
  const near = (a: number | null, b: number, eps = 0.01) => assert.ok(a !== null && Math.abs(a - b) < eps, `${a} ≈ ${b}`);
  it('giờ theo nhóm và tổng = tệp gốc (218,83 / 1296,73 / 835,83 / 1125,5 ⇒ 3476,9 h)', () => {
    const h = Object.fromEntries(e.categories.map((c) => [c.category, c.hours]));
    near(h['Project Start and Management'], 218.833);
    near(h['Model Requirements - People'], 1296.733);
    near(h['Model Requirements - System'], 835.833);
    near(h['Model Requirements - Data'], 1125.5);
    near(e.totals.hours, 3476.9);
  });
  it('ba cách tính BA: 2,14 (% ngân sách) · 2,67 (dev/BA, COTS) · 3,10 (hoạt động)', () => {
    near(e.methods.budgetPercent.bas, 2.142857);
    near(e.methods.devRatio.bas, 2.666667);
    near(e.methods.activity.bas, 3.104375);
    near(e.methods.budgetPercent.requirementsCost, 300_000, 1);
    near(e.methods.devRatio.projectCost, 746_666.67, 1);
    near(e.methods.activity.projectCost, 869_225, 1);
  });
  it('nhóm làm từ xa +10%, sửa phút mỗi đơn vị, cảnh báo số đếm lệch dữ liệu', () => {
    const r = estimate(sample, { project: { remote: true, requirementsWeeks: 28 } });
    near(r.totals.remoteBuffer, 347.69);
    const m = estimate(sample, { minutes: { useCases: 600 } });
    assert.equal(m.rows.find((x) => x.key === 'useCases')!.minutes, 30_000);
    assert.deepEqual(countMismatches(sample, { counts: { useCases: 14 } }).map((x) => [x.key, x.entered, x.actual]), [['useCases', 14, 50]]);
  });
});

describe('R24 báo cáo trạng thái yêu cầu', () => {
  const now = new Date('2026-10-12T00:00:00Z');
  const d = (s: string) => new Date(`${s}T10:00:00Z`);
  const r = statusReport({
    reqs: [
      { lifecycle: 'APPROVED', reqType: 'FUNCTIONAL', createdAt: d('2026-08-01'), reqVersion: 2 },
      { lifecycle: 'PROPOSED', reqType: 'QUALITY', createdAt: d('2026-10-05'), reqVersion: 1 },
      { lifecycle: 'VERIFIED', reqType: 'FUNCTIONAL', createdAt: d('2026-08-02'), reqVersion: 1 },
      { lifecycle: 'APPROVED', reqType: 'FUNCTIONAL', createdAt: d('2026-08-03'), reqVersion: 1, deletedAt: d('2026-10-06') },
    ],
    changes: [{ at: d('2026-10-07'), field: 'Requirement priority', from: 'LOW', to: 'HIGH' }, { at: d('2026-10-08'), field: 'Requirement lifecycle', from: 'PROPOSED', to: 'REJECTED' }],
    effort: [{ at: d('2026-10-09'), minutes: 90, who: 'An' }, { at: d('2026-10-10'), minutes: 30, who: 'Bình' }, { at: d('2026-07-01'), minutes: 600, who: 'An' }],
    now, days: 30,
  });
  it('đếm theo trạng thái/loại, biến động, công RM', () => {
    assert.equal(r.total, 3);
    assert.deepEqual(r.byLifecycle, { APPROVED: 1, PROPOSED: 1, VERIFIED: 1 });
    assert.equal(r.window.added, 1);
    assert.equal(r.window.modified, 1);
    assert.equal(r.window.deleted, 2);
    assert.equal(r.window.volatility, 200);
    assert.equal(r.effort.hours, 2);
    assert.deepEqual(r.effort.byPerson[0], { who: 'An', hours: 1.5 });
    assert.equal(r.trend.length, 8);
    assert.equal(weekStart(new Date('2026-10-11T10:00:00Z')), '2026-10-05');
  });
});

describe('R28 stakeholder do AI đóng vai', () => {
  it('lời nhắc giữ vai, cấm bịa số liệu, nhớ lịch sử', () => {
    const turns = parseTurns([{ role: 'analyst', text: 'Hi', at: 'x' }, { role: 'bad', text: 'x' }, { role: 'stakeholder', text: 'Hello', at: 'y' }]);
    assert.equal(turns.length, 2);
    const p = stakeholderPrompt({ persona: { name: 'Lan', role: 'Lab manager', organization: null, userClass: null, attitude: 'CRITIC', majorValue: 'Fewer booking clashes', interests: null, constraints: 'No budget for new hardware', decisionRights: null, notes: null }, systemName: 'LabFlow', objective: 'Booking pain points', language: 'vi', turns, question: 'Bạn đặt phòng thế nào?' });
    assert.match(p.system, /Lab manager/);
    assert.match(p.system, /never invent precise numbers/);
    assert.match(p.system, /Vietnamese/);
    assert.deepEqual(p.messages.map((m) => m.role), ['user', 'assistant', 'user']);
    assert.deepEqual(turnsAsTranscript(turns, 'Lan').map((t) => t.who), ['Analyst', 'Lan (AI-simulated)']);
  });
});

describe('TST-2: cycle CI gộp tự đóng + phiên bản test case', () => {
  it('đóng khi close=true hoặc đủ số job; im lặng quá hạn ⇒ đóng', () => {
    assert.equal(cycleCloseDecision({ importCount: 1, expectedJobs: 3 }, {}), null);
    assert.equal(cycleCloseDecision({ importCount: 3, expectedJobs: 3 }, {}), 'JOBS');
    assert.equal(cycleCloseDecision({ importCount: 1, expectedJobs: null }, { close: true }), 'CLOSE');
    const at = new Date('2026-10-12T10:00:00Z');
    assert.equal(cycleIdleExpired({ state: 'IN_PROGRESS', autoCloseMinutes: 120, lastImportAt: at }, new Date('2026-10-12T11:59:00Z')), false);
    assert.equal(cycleIdleExpired({ state: 'IN_PROGRESS', autoCloseMinutes: 120, lastImportAt: at }, new Date('2026-10-12T12:00:00Z')), true);
    assert.equal(cycleIdleExpired({ state: 'DONE', autoCloseMinutes: 120, lastImportAt: at }, new Date('2026-10-13T00:00:00Z')), false);
  });
  it('khoá nội dung test: bỏ khoảng trắng thừa, đổi bước ⇒ khác', () => {
    const a = { kind: 'MANUAL', preconditions: ' logged in ', gherkin: null, steps: [{ action: 'Open', data: null, expected: 'Page' }] };
    assert.equal(testContentKey(a), testContentKey({ ...a, preconditions: 'logged in' }));
    assert.notEqual(testContentKey(a), testContentKey({ ...a, steps: [{ action: 'Open', data: null, expected: 'Home' }] }));
  });
});

describe('i18n: định nghĩa chỉ số Đóng góp tiếng Việt (tệp xuất)', () => {
  it('cùng bộ khoá với bản tiếng Anh, không chuỗi rỗng', () => {
    assert.deepEqual(Object.keys(METRIC_DEFINITIONS_VI), Object.keys(METRIC_DEFINITIONS));
    for (const [k, d] of Object.entries(METRIC_DEFINITIONS_VI)) assert.ok(d.label && d.how && d.how !== METRIC_DEFINITIONS[k].how, k);
    assert.equal(metricDefinitions('en'), METRIC_DEFINITIONS);
  });
});
