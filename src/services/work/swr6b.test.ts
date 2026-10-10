/**
 * CTW đợt 6b — SRS chuyên sâu + elicitation & stakeholder, phần THUẦN (không DB):  npx tsx --test src/services/work/swr6b.test.ts
 *   R3 lưới quyền lực × quan tâm, RACI · R1 câu hỏi, nguồn, kiểm bằng chứng đề xuất AI · R2 khảo sát (câu hỏi, trả lời, tổng hợp, xlsx)
 *   R7 NFR ISO 25010/Planguage · checklist chất lượng 8 tiêu chí · R14 mô hình (context, DFD 1, state, feature tree, event–response)
 *   kiểm cú pháp + "mọi thực thể có nguồn" như Diagram Studio · chèn vào SRS Wiegers · báo cáo elicitation.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkDiagram, entityLabels, lintMermaid, mermaidKind } from './diagram.js';
import type { BuiltDiagram } from './diagramGen.js';
import { getTemplate } from './docTemplates.js';
import { plainText } from './docExport.js';
import type { PmNode } from './docMarkdown.js';
import type { ActorLite, UseCaseLite } from './srs.js';
import {
  contextDiagram, dfdLevel1, entityStateDiagram, eventResponseTable, featureTree, isMissing, parseStateValues, stateCandidates,
} from './srsModels.js';
import {
  applySrsDeepFill, checkProposals, elicitationReportDoc, normalizeQuestions, normalizeSurveyQuestions, nfrMeasured, nfrStatement, NFR_TEMPLATES, ISO_SUBS,
  planguageRows, proposalsPrompt, quadrantOf, qualityCheck, raciProblems, registerWarnings, sourceLines, sourceText, stakeholderProfiles, summarizeSurvey,
  surveySheets, validateAnswers, WIEGERS_TO_ISO, ISO_CHARACTERISTICS, type NfrSpecLite, type StakeholderLite, type SurveyQuestion,
} from './swr6b.js';
import type { DataElementLite, FeatureLite } from './swr.js';
import { readXlsx, writeXlsx } from './xlsxStyled.js';

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const actor = (id: number, name: string, kind = 'PERSON'): ActorLite => ({ id, name, description: null, kind, position: id });
const uc = (number: number, name: string, extra: Partial<UseCaseLite> = {}): UseCaseLite => ({
  id: number * 10, number, name, feature: null, description: null, trigger: null, preconditions: null, postconditions: null,
  normalFlow: '1. Customer opens the form.\n2. System saves the Order.', alternativeFlows: null, exceptionFlows: null, priority: 'MEDIUM', status: 'APPROVED',
  primaryActorId: 1, secondaryActorIds: [], ruleNumbers: [], ...extra,
});
const el = (id: number, name: string, extra: Partial<DataElementLite> = {}): DataElementLite => ({ id, name, description: null, kind: 'PRIMITIVE', composition: null, dataType: null, length: null, values: null, isKey: false, position: id, ...extra });
const fe = (id: number, number: number, name: string, scope = 'IN'): FeatureLite => ({ id, number, name, description: null, scope, priority: null, versionId: null, epicIssueId: null, position: number });
const sh = (number: number, name: string, extra: Partial<StakeholderLite> = {}): StakeholderLite => ({
  id: number, number, name, role: null, organization: null, kind: 'PERSON', userClass: null, influence: 3, interest: 3, attitude: null, isChampion: false,
  decisionRights: null, majorValue: null, interests: null, constraints: null, contact: null, notes: null, ...extra,
});
const passesStudio = (b: BuiltDiagram, ucNumbers: number[] = []) => {
  const lint = lintMermaid(b.mermaid);
  assert.ok(lint.ok, `${b.title}: ${JSON.stringify(lint.errors)}\n${b.mermaid}`);
  const c = checkDiagram({ type: b.type, mermaid: b.mermaid, allowed: b.allowed, structural: b.structural, ucNumbers });
  assert.ok(c.ok, JSON.stringify(c.errors));
  assert.deepEqual(c.unknown, [], `thực thể không nguồn: ${JSON.stringify(c.unknown)}`);
  return c;
};

describe('R3 stakeholder + RACI', () => {
  it('lưới Mendelow: ≥ 4 là cao, 3 mặc định ⇒ Monitor', () => {
    assert.equal(quadrantOf(5, 5), 'MANAGE_CLOSELY');
    assert.equal(quadrantOf(4, 2), 'KEEP_SATISFIED');
    assert.equal(quadrantOf(2, 4), 'KEEP_INFORMED');
    assert.equal(quadrantOf(3, 3), 'MONITOR');
  });
  it('nhắc: thiếu champion / người quyết định, người quyền lực phản đối, chưa chấm', () => {
    const w = registerWarnings([sh(1, 'Lan', { influence: 5, attitude: 'BLOCKER' }), sh(2, 'Minh')]).map((x) => x.code);
    assert.deepEqual(w, ['NO_CHAMPION', 'NO_DECIDER', 'POWERFUL_CRITIC', 'UNRATED']);
    assert.deepEqual(registerWarnings([sh(1, 'Lan', { isChampion: true, decisionRights: 'Approves scope', influence: 4, interest: 5 })]), []);
  });
  it('RACI: đúng một A, ít nhất một R', () => {
    const p = raciProblems([{ id: 1, name: 'Elicit' }, { id: 2, name: 'Approve' }, { id: 3, name: 'Write' }],
      [{ activityId: 1, role: 'R' }, { activityId: 1, role: 'A' }, { activityId: 2, role: 'A' }, { activityId: 2, role: 'A' }, { activityId: 3, role: 'C' }]);
    assert.deepEqual(p.map((x) => `${x.activity}:${x.code}`), ['Approve:MANY_A', 'Approve:NO_R', 'Write:NO_A', 'Write:NO_R']);
  });
  it('V&S Stakeholder Profiles từ sổ: giá trị, thái độ + champion, quan tâm + chiến lược, ràng buộc + quyền quyết định', () => {
    const [r] = stakeholderProfiles([sh(1, 'Lan', { role: 'Fulfillment Manager', majorValue: 'Faster picking', isChampion: true, attitude: 'SUPPORTER', interests: 'Accuracy', influence: 5, interest: 5, constraints: 'No new hardware', decisionRights: 'Signs off scope' })]);
    assert.equal(r.name, 'Lan (Fulfillment Manager)');
    assert.equal(r.description, 'Faster picking');
    assert.equal(r.attitude, 'Product champion; Supporter');
    assert.match(r.interests, /^Accuracy — Manage closely \(influence 5\/5, interest 5\/5\)$/);
    assert.equal(r.constraints, 'No new hardware; Decides: Signs off scope');
  });
});

describe('R1 phiên elicitation', () => {
  it('câu hỏi có id ổn định, bỏ câu rỗng, giữ câu trả lời', () => {
    const q = normalizeQuestions([{ id: 'q2', text: 'Why?', answer: ' because ' }, { text: '  ' }, { text: 'How?' }, { id: 'q2', text: 'Dup id' }]);
    assert.deepEqual(q.map((x) => x.id), ['q2', 'q3', 'q4']);
    assert.equal(q[0].answer, 'because');
    assert.equal(q[1].answer, null);
  });
  it('câu "nguồn" của yêu cầu: mã phiên + kỹ thuật + ngày + ai nói', () => {
    assert.equal(sourceText({ number: 3, technique: 'INTERVIEW', scheduledAt: new Date('2026-03-12T02:00:00Z'), title: 'x' }, { name: 'Lan', role: 'Fulfillment Manager' }), 'ELC-3 Interview, 12/03/2026 — Lan (Fulfillment Manager)');
    assert.equal(sourceText({ number: 1, technique: 'WORKSHOP', scheduledAt: null, title: 'Scope workshop', aiSimulated: true }), 'ELC-1 Workshop (AI-simulated) — Scope workshop');
  });
  it('nguồn cho AI: transcript + câu trả lời + ghi chú, đánh số dòng', () => {
    const s = sourceLines({ transcript: [{ text: 'We lose orders when the printer jams', who: 'Lan' }], questions: [{ id: 'q1', text: 'Peak?', answer: '500 orders per hour' }, { id: 'q2', text: 'X?', answer: null }], notes: 'Note A\n\nNote B' });
    assert.deepEqual(s.lines.map((l) => l.n), [1, 2, 3, 4]);
    assert.equal(s.lines[1].text, 'Q: Peak? — A: 500 orders per hour');
    const p = proposalsPrompt({ language: 'en', title: 'Interview', technique: 'INTERVIEW', objective: null, systemName: 'OMFS', stakeholders: [{ key: 'SH-1', name: 'Lan', role: null }], lines: s.lines, truncated: false, existing: ['Old one'] });
    assert.match(p.user, /1\. \[Lan\] We lose orders/);
    assert.match(p.user, /- Old one/);
    assert.match(p.system, /evidence/);
  });
  it('kiểm bằng chứng: trích dẫn phải có thật ở đúng dòng; không bằng chứng / trùng ⇒ bỏ; map stakeholder', () => {
    const lines = [{ n: 1, text: 'Pickers lose orders when the printer jams' }, { n: 2, text: 'Chúng tôi cần in phiếu trong 2 giây' }];
    const r = checkProposals({
      requirements: [
        { title: 'The system shall queue pick lists when the printer is offline', type: 'functional', evidence: [{ line: 1, quote: 'printer jams' }], stakeholder: 'SH-2' },
        { title: 'Phiếu phải in trong vòng 2 giây', type: 'NFR', priority: 'high', evidence: [{ line: 2, quote: 'in phieu trong 2 giay' }], stakeholder: 'lan' },
        { title: 'The system shall support blockchain', evidence: [{ line: 1, quote: 'blockchain' }] },
        { title: 'Made up', evidence: [{ line: 9, quote: 'printer' }] },
        { title: 'The system shall export to Excel', evidence: [] },
        { title: 'Existing requirement here', evidence: [{ line: 1, quote: 'orders' }] },
      ],
    }, lines, [{ id: 7, number: 2, name: 'Minh' }, { id: 8, number: 3, name: 'Lan' }], ['Existing requirement here']);
    assert.equal(r.kept.length, 2);
    assert.equal(r.dropped, 4);
    assert.equal(r.kept[0].reqType, 'FUNCTIONAL');
    assert.equal(r.kept[0].stakeholderId, 7);
    assert.equal(r.kept[1].reqType, 'QUALITY');
    assert.equal(r.kept[1].priority, 'HIGH');
    assert.equal(r.kept[1].stakeholderId, 8);
  });
});

describe('R2 khảo sát', () => {
  const qs = normalizeSurveyQuestions([
    { kind: 'SINGLE', text: 'Role?', options: ['Picker', 'Manager', 'Picker'], required: true },
    { kind: 'MULTI', text: 'Pain points?', options: ['Printer', 'Scanner', 'Stock'] },
    { kind: 'SCALE', text: 'Satisfaction', scaleMax: 5 },
    { kind: 'YES_NO', text: 'Use a phone?' },
    { kind: 'LONG_TEXT', text: 'Biggest problem?' },
  ]).questions as SurveyQuestion[];
  it('chuẩn hoá: id q1…, bỏ lựa chọn trùng; lựa chọn < 2 ⇒ lỗi', () => {
    assert.deepEqual(qs.map((q) => q.id), ['q1', 'q2', 'q3', 'q4', 'q5']);
    assert.deepEqual(qs[0].options, ['Picker', 'Manager']);
    assert.match(normalizeSurveyQuestions([{ kind: 'SINGLE', text: 'x', options: ['a'] }]).error ?? '', /two options/);
    assert.match(normalizeSurveyQuestions([]).error ?? '', /at least one/);
  });
  it('kiểm trả lời: bắt buộc, lựa chọn lạ, thang ngoài khoảng, yes/no', () => {
    assert.deepEqual(validateAnswers(qs, {}).errors, [{ id: 'q1', code: 'REQUIRED' }]);
    const bad = validateAnswers(qs, { q1: 'Boss', q2: ['Printer', 'X'], q3: 7, q4: 'maybe' });
    assert.deepEqual(bad.errors.map((e) => `${e.id}:${e.code}`), ['q1:INVALID', 'q2:INVALID', 'q3:INVALID', 'q4:INVALID']);
    const ok = validateAnswers(qs, { q1: 'Picker', q2: ['Printer', 'Printer'], q3: '4', q4: 'yes', q5: '  jams  ', zz: 'ignored' });
    assert.deepEqual(ok.errors, []);
    assert.deepEqual(ok.answers, { q1: 'Picker', q2: ['Printer'], q3: 4, q4: true, q5: 'jams' });
  });
  it('tổng hợp + xlsx 3 sheet (Responses / Summary / Questions) đọc lại được', () => {
    const rs = [
      { answers: { q1: 'Picker', q2: ['Printer'], q3: 2, q4: true, q5: 'Printer jams' }, createdAt: new Date('2026-10-11T01:00:00Z'), respondentName: 'An' },
      { answers: { q1: 'Manager', q2: ['Printer', 'Stock'], q3: 4, q4: false }, createdAt: new Date('2026-10-11T02:00:00Z'), respondentName: null },
    ];
    const s = summarizeSurvey(qs, rs);
    assert.deepEqual(s[0].counts, [{ option: 'Picker', n: 1, pct: 50 }, { option: 'Manager', n: 1, pct: 50 }]);
    assert.equal(s[1].counts![0].n, 2);
    assert.equal(s[2].average, 3);
    assert.deepEqual(s[2].distribution, [0, 1, 0, 1, 0]);
    assert.equal(s[3].yes, 1);
    assert.deepEqual(s[4].texts, ['Printer jams']);
    const book = readXlsx(writeXlsx(surveySheets({ key: 'SV-1', title: 'Pickers', collectName: true }, qs, rs, 'OMFS')));
    assert.deepEqual(book.map((b) => b.name), ['Responses', 'Summary', 'Questions']);
    const r = book[0];
    assert.equal(r.text(3, 3), 'Name');
    assert.equal(r.text(3, 4), 'Q1. Role?');
    assert.equal(r.text(4, 3), 'An');
    assert.equal(r.text(5, 5), 'Printer; Stock');
    assert.equal(r.text(4, 7), 'Yes');
    assert.equal(r.text(4, 6), '2');
    assert.equal(book[1].text(4, 3), 'Picker');
  });
});

describe('R7 NFR ISO 25010 + Planguage', () => {
  const spec: NfrSpecLite = { characteristic: 'PERFORMANCE_EFFICIENCY', subCharacteristic: 'Time behaviour', scale: '95th-percentile response time of checkout', meter: 'k6 load test', unit: 'ms', comparator: '<=', mustValue: 2000, planValue: 1000, wishValue: null, conditions: '100 concurrent users', verification: 'TEST' };
  it('câu đọc được + bảng Planguage', () => {
    assert.equal(nfrStatement(spec), '95th-percentile response time of checkout shall be at most 2000 ms (target 1000 ms) under 100 concurrent users. Verified by test: k6 load test.');
    assert.ok(nfrMeasured(spec));
    assert.ok(!nfrMeasured({ ...spec, mustValue: null }));
    assert.deepEqual(planguageRows([{ key: 'OM-9', title: 'Checkout speed', spec }])[0], ['OM-9 Checkout speed', 'Performance efficiency › Time behaviour', spec.scale, 'k6 load test', '<= 2000 ms', '1000 ms', '', 'Test']);
  });
  it('mẫu NFR: đặc tính/đặc tính con hợp lệ, có ngưỡng; nhóm Wiegers nào cũng có đặc tính ISO', () => {
    for (const t of NFR_TEMPLATES) {
      assert.ok(ISO_SUBS[t.characteristic].includes(t.sub), t.id);
      assert.ok(Number.isFinite(t.must) && t.scale && t.meter, t.id);
    }
    assert.equal(new Set(NFR_TEMPLATES.map((t) => t.id)).size, NFR_TEMPLATES.length);
    for (const v of Object.values(WIEGERS_TO_ISO)) assert.ok((ISO_CHARACTERISTICS as readonly string[]).includes(v));
  });
});

describe('checklist chất lượng 8 tiêu chí', () => {
  const base = { reqType: 'FUNCTIONAL', priority: 'HIGH', taskItems: 0, nfr: null, traced: true, hasSource: true, duplicates: [], manual: { feasible: true } };
  it('yêu cầu tốt: 8/8', () => {
    const r = qualityCheck({ ...base, title: 'The system shall print the pick list', text: 'Acceptance criteria:\n- Given an order, when it is released, then the pick list prints within 2 seconds' });
    assert.deepEqual(r.criteria.filter((c) => c.status !== 'pass').map((c) => c.key), []);
    assert.equal(r.score, 100);
  });
  it('từ mơ hồ EN/VI, thiếu AC, chưa nguồn, chưa ưu tiên, chưa truy vết, khả thi chưa chấm', () => {
    const r = qualityCheck({ ...base, priority: null, traced: false, hasSource: false, manual: {}, title: 'Hệ thống phải nhanh và thân thiện', text: 'Giao diện đẹp, dễ dùng, TBD' });
    const st = Object.fromEntries(r.criteria.map((c) => [c.key, c.status]));
    assert.deepEqual(st, { unambiguous: 'fail', complete: 'fail', consistent: 'pass', verifiable: 'fail', feasible: 'unchecked', necessary: 'fail', prioritized: 'fail', traceable: 'fail' });
    assert.match(r.criteria[0].reasons[0].params!.words as string, /nhanh/);
    assert.deepEqual(r.criteria[1].reasons.map((x) => x.code), ['PLACEHOLDER', 'NO_AC']);
    assert.ok(r.vague.some((v) => v.match === 'thân thiện' && v.replace));
  });
  it('NFR: không số đo ⇒ trượt kiểm chứng; có thước đo ⇒ đạt; trùng ⇒ không nhất quán; người đánh dấu mâu thuẫn thắng', () => {
    const q = { ...base, reqType: 'QUALITY', title: 'The system shall be fast', text: 'Pages should load quickly for users.' };
    assert.equal(qualityCheck(q).criteria.find((c) => c.key === 'verifiable')!.status, 'fail');
    const spec: NfrSpecLite = { characteristic: 'PERFORMANCE_EFFICIENCY', subCharacteristic: null, scale: 'p95 page load', meter: 'Lighthouse', unit: 's', comparator: '<=', mustValue: 2, planValue: null, wishValue: null, conditions: null, verification: 'TEST' };
    assert.equal(qualityCheck({ ...q, nfr: spec }).criteria.find((c) => c.key === 'verifiable')!.status, 'pass');
    assert.equal(qualityCheck({ ...q, duplicates: ['OM-3'] }).criteria.find((c) => c.key === 'consistent')!.status, 'fail');
    assert.equal(qualityCheck({ ...q, manual: { consistent: false, feasible: true } }).criteria.find((c) => c.key === 'consistent')!.reasons[0].code, 'MARKED_CONFLICT');
  });
});

describe('R14 mô hình từ dữ liệu', () => {
  const actors = [actor(1, 'Customer'), actor(2, 'Warehouse Manager'), actor(3, 'Payment Gateway', 'SYSTEM')];
  const dd = [el(1, 'Order', { kind: 'STRUCTURE', composition: 'Order ID + Order Status' }), el(2, 'Order Status', { values: 'Pending, Paid, Shipped, Cancelled' }), el(3, 'Order ID', { dataType: 'int' })];
  const ucs = [
    uc(1, 'Place order', { primaryActorId: 1, secondaryActorIds: [3], postconditions: 'The Order is Pending.', feature: 'Ordering' }),
    uc(2, 'Pay order', { primaryActorId: 1, secondaryActorIds: [3], preconditions: 'The order is Pending.', postconditions: 'The order is Paid.' }),
    uc(3, 'Ship order', { primaryActorId: 2, preconditions: 'Order is Paid', postconditions: 'Order is Shipped', trigger: 'Every day at 08:00 the manager ships paid orders' }),
    uc(4, 'Proposed only', { status: 'PROPOSED', primaryActorId: 2 }),
  ];
  const features = [fe(11, 1, 'Ordering'), fe(12, 2, 'Fulfillment'), fe(13, 3, 'Loyalty', 'OUT')];
  const links = [{ featureId: 12, kind: 'UC', targetId: 30 }];

  it('context (DFD 0): một tiến trình, actor + hệ thống ngoài, luồng đặt tên bằng DỮ LIỆU khi DD có; qua bộ kiểm Diagram Studio', () => {
    const b = contextDiagram({ systemName: 'OMFS', actors, useCases: ucs, dataElements: dd }) as BuiltDiagram;
    assert.ok(!isMissing(b));
    assert.equal(b.type, 'DATA_FLOW');
    assert.equal(mermaidKind(b.mermaid), 'flowchart');
    assert.match(b.mermaid, /SYS\(\("0<br\/>OMFS"\)\)/);
    assert.match(b.mermaid, /E1 -->\|"Order"\| SYS/);
    assert.match(b.mermaid, /SYS -->\|"Order"\| E3/);
    assert.doesNotMatch(b.mermaid, /Proposed only/);
    passesStudio(b, [1, 2, 3, 4]);
  });
  it('context thiếu nguồn ⇒ missing song ngữ', () => {
    const m = contextDiagram({ systemName: 'X', actors, useCases: [], dataElements: [] });
    assert.ok(isMissing(m));
    assert.match(m.missing.vi, /Sơ đồ ngữ cảnh/);
  });
  it('DFD 1: tiến trình = feature trong phạm vi, kho dữ liệu = cấu trúc DD được UC nhắc', () => {
    const b = dfdLevel1({ systemName: 'OMFS', actors, useCases: ucs, features, featureLinks: links, dataElements: dd }) as BuiltDiagram;
    assert.match(b.mermaid, /P1\(\("1\.0<br\/>Ordering"\)\)/);
    assert.match(b.mermaid, /P2\(\("2\.0<br\/>Fulfillment"\)\)/);
    assert.doesNotMatch(b.mermaid, /Loyalty/);
    assert.match(b.mermaid, /DS1\[\("D1 Order"\)\]/);
    assert.match(b.mermaid, /P1 <-->\|"Order"\| DS1/);
    assert.match(b.mermaid, /E2 -->\|"UC-03"\| P2/);
    passesStudio(b, [1, 2, 3, 4]);
    assert.ok(isMissing(dfdLevel1({ systemName: 'X', actors, useCases: ucs, features: [], featureLinks: [], dataElements: dd })));
  });
  it('state: trạng thái = Values của DD, chuyển = UC (tiền → hậu điều kiện), UC tạo thực thể từ [*]', () => {
    assert.deepEqual(parseStateValues('One of: Pending | Paid; Shipped or Cancelled.'), ['Pending', 'Paid', 'Shipped', 'Cancelled']);
    assert.deepEqual(stateCandidates(dd).map((c) => c.name), ['Order Status']);
    const b = entityStateDiagram({ element: 'Order Status', elements: dd, useCases: ucs }) as BuiltDiagram;
    assert.equal(mermaidKind(b.mermaid), 'state');
    assert.match(b.mermaid, /\[\*\] --> S1 : UC-01 Place order/);
    assert.match(b.mermaid, /S1 --> S2 : UC-02 Pay order/);
    assert.match(b.mermaid, /S2 --> S3 : UC-03 Ship order/);
    assert.match(b.mermaid, /S3 --> \[\*\]/);
    assert.equal(b.title, 'State diagram — Order');
    assert.deepEqual(b.assumptions, []);
    assert.match(b.notes[0], /Cancelled/);
    passesStudio(b, [1, 2, 3, 4]);
    const lin = entityStateDiagram({ element: '', elements: dd, useCases: [] }) as BuiltDiagram;
    assert.match(lin.assumptions[0], /assumed/);
    assert.ok(isMissing(entityStateDiagram({ element: 'Nope', elements: dd, useCases: ucs })));
    assert.ok(isMissing(entityStateDiagram({ element: '', elements: [el(9, 'Name')], useCases: ucs })));
  });
  it('feature tree: hệ thống → FE → UC', () => {
    const b = featureTree({ systemName: 'OMFS', features, featureLinks: links, useCases: ucs }) as BuiltDiagram;
    assert.match(b.mermaid, /ROOT --> F1/);
    assert.match(b.mermaid, /U1_1\["UC-01 Place order"\]\n  F1 --> U1_1/);
    assert.match(b.mermaid, /F2 --> U2_3/);
    assert.deepEqual(entityLabels(b.mermaid).map((e) => e.label).includes('FE-3 Loyalty'), false);
    passesStudio(b, [1, 2, 3, 4]);
  });
  it('event–response: trigger / Business · Signal · Temporal / tiền điều kiện / hậu điều kiện', () => {
    const rows = eventResponseTable({ actors, useCases: [...ucs, uc(5, 'Confirm payment', { primaryActorId: 3, postconditions: 'Order is Paid' })] });
    assert.equal(rows.length, 4);
    assert.deepEqual(rows.map((r) => r.type), ['BUSINESS', 'BUSINESS', 'TEMPORAL', 'SIGNAL']);
    assert.equal(rows[0].event, 'Customer requests to place order');
    assert.equal(rows[1].state, 'The order is Pending.');
    assert.equal(rows[2].response, 'Order is Shipped');
  });
});

describe('chèn vào SRS Wiegers + báo cáo elicitation', () => {
  it('SRS: context ở 2.1, sổ stakeholder ở 2.2 (+ lớp người dùng), prototype ở 5.1, NFR đo được ở 6.x, mô hình + event–response + Planguage ở Phụ lục B; điền lại không nhân đôi', async () => {
    const doc = clone((await getTemplate('swr-srs')).doc) as PmNode;
    const dg = (id: number, number: number, title: string) => ({ id, number, title, type: 'DATA_FLOW' as const, format: 'MERMAID' as const, version: 2, source: 'flowchart LR\n  A --> B' });
    const spec: NfrSpecLite = { characteristic: 'PERFORMANCE_EFFICIENCY', subCharacteristic: 'Time behaviour', scale: 'p95 response time', meter: 'k6', unit: 'ms', comparator: '<=', mustValue: 2000, planValue: null, wishValue: null, conditions: null, verification: 'TEST' };
    const data = {
      projectId: 5,
      stakeholders: [sh(1, 'Lan', { role: 'Manager', userClass: 'Warehouse staff', influence: 5, interest: 4, isChampion: true, decisionRights: 'Scope' })],
      models: [{ kind: 'CONTEXT', subject: '', diagram: dg(1, 4, 'Context diagram — OMFS') }, { kind: 'DFD1', subject: '', diagram: dg(2, 5, 'DFD 1') }],
      events: [{ ref: 'UC-01', event: 'Customer places an order', type: 'BUSINESS' as const, state: '—', response: 'Order saved', actor: 'Customer' }],
      nfr: [{ key: 'OM-9', title: 'Checkout speed', subtype: 'PERFORMANCE', priority: 'HIGH', spec }],
      mockups: [{ screen: 'Checkout', title: 'v2', kind: 'IMAGE', src: '/api/v1/work/projects/5/images/77', url: null, status: 'APPROVED', reviewer: 'Thầy An (lecturer)' }],
    };
    const filled = applySrsDeepFill(doc, data);
    assert.deepEqual(filled, ['context diagram', 'stakeholders', 'prototypes', 'measurable quality attributes', 'analysis models']);
    const text = JSON.stringify(doc);
    assert.match(text, /ctw-diagram:1@2 D-4/);
    assert.match(text, /Lan \(Manager\)/);
    assert.match(text, /images\/77/);
    assert.match(text, /p95 response time shall be at most 2000 ms/);
    assert.match(text, /Event-response table/);
    assert.match(text, /Planguage/);
    const blocks = doc.content ?? [];
    const uci = blocks.findIndex((b) => b.type === 'heading' && /User Classes and Characteristics/.test(plainText(b)));
    const ucTable = blocks.slice(uci + 1).find((b) => b.type === 'table')!;
    assert.ok(JSON.stringify(ucTable).includes('Warehouse staff'));
    const again = applySrsDeepFill(doc, data);
    assert.deepEqual(again, filled);
    assert.equal(JSON.stringify(doc).split('ctw-diagram:1@2').length - 1, 1, 'context diagram chỉ một lần');
    assert.equal(JSON.stringify(doc).split('Event-response table').length - 1, 1);
  });
  it('báo cáo elicitation: tóm tắt, stakeholder + lưới + RACI, từng phiên, khảo sát, truy vết', () => {
    const doc = elicitationReportDoc({
      projectName: 'OMFS', generatedAt: new Date('2026-10-11T00:00:00Z'),
      stakeholders: [sh(1, 'Lan', { influence: 5, interest: 5 })],
      raci: { activities: ['Elicit'], rows: [{ name: 'Lan', roles: ['A'] }] },
      sessions: [{ key: 'ELC-1', title: 'Pickers interview', technique: 'INTERVIEW', status: 'DONE', when: '12/03/2026', duration: 45, location: 'Warehouse', objective: 'Find pain points', plan: 'Ask', aiSimulated: false, participants: [{ key: 'SH-1', name: 'Lan', role: null, rolePlayed: 'Fulfillment Manager' }], questions: [{ id: 'q1', text: 'Pain?', answer: 'Printer' }], notes: 'n', outcome: 'o', meeting: 'Meeting #2 ELC-1', survey: null, requirements: [{ key: 'OM-9', title: 'Queue print jobs', status: 'Approved', stakeholder: 'Lan' }], pending: 1 }],
      surveys: [{ key: 'SV-1', title: 'Pickers', status: 'CLOSED', responses: 2, summary: [{ id: 'q1', kind: 'YES_NO', text: 'Phone?', answered: 2, yes: 1, no: 1 }] }],
      trace: [{ requirement: 'OM-9', title: 'Queue print jobs', sessions: 'ELC-1', stakeholders: 'Lan' }],
    });
    const heads = (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b));
    assert.deepEqual(heads, ['Requirements Elicitation Report — OMFS', '1. Summary', '2. Stakeholders', '2.1 Power × interest grid', '2.2 RACI matrix', '3. Sessions', '3.1 ELC-1 Pickers interview', 'Plan', 'Questions and answers', 'Notes', 'Outcome', 'Requirements from this session', '4. Surveys', '4.1 SV-1 Pickers (2 responses)', '5. Requirement traceability to sources']);
    assert.match(JSON.stringify(doc), /plays Fulfillment Manager/);
    assert.match(JSON.stringify(doc), /Yes 1 · No 1/);
  });
});
