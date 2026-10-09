/**
 * CTW đợt 4 (09/10/2026) — phần THUẦN (không DB, không LLM):
 *   npx tsx --test src/services/work/ctw4.test.ts
 *
 *   1. srs.ts — mã UC/BR, điền đúng đề mục mẫu Report 3 (Actors, Use Cases, Screens Flow, Screen Authorization, Non-UI,
 *      Use Case Specifications 7 hàng đúng mẫu + Trigger/Priority/BR, Business Rules), PROPOSED không vào, điền lại không nhân đôi.
 *   2. rtm.ts — chỗ hở + trạng thái, lọc, Excel đúng cột hướng dẫn RTM.
 *   3. finalReport.ts — Report 1–6 ⇒ phần I–VI của Report 7, bỏ Record of Changes, giữ Acknowledgement, định nghĩa từ Report 1.
 *   4. CTW-12 — khung chấm theo loại trang (SRS/SDD/GDD/OTHER), tắt luật.
 *   5. Defect log + Q&A + bìa Final.
 */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import { markdownToTiptap, type PmNode } from './docMarkdown.js';
import { plainText, renderDocx } from './docExport.js';
import { findingBugDoc, severityOfFinding } from './defects.service.js';
import { assembleFinal, reportBody, tableHasData } from './finalReport.js';
import { isLegacyQa, qaStatusText } from './qna.service.js';
import { buildRtmSheets, evaluateRow, filterRows, RTM_HEADERS, summarize, type RtmRow } from './rtm.js';
import { analyze, docKindOf, type SpecItem } from './specFidelity.js';
import { applySrsFill, brKey, refNumber, refsIn, screensFlowMermaid, ucKey, ucMissing, type SrsData } from './srs.js';
import { readXlsx, writeXlsx } from './xlsxStyled.js';

const tpl = async (key: string) => markdownToTiptap(await readFile(path.resolve('content/quy-trinh/mau', `${key}.md`), 'utf8'), { dropTitle: true }).doc as unknown as PmNode;
const rowsOf = (t: PmNode) => (t.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c).trim()));
/** Bảng đầu tiên sau đề mục có chữ `h` (bỏ số thứ tự). */
function tableAfter(doc: PmNode, h: RegExp): string[][] | null {
  const b = doc.content ?? [];
  const i = b.findIndex((x) => x.type === 'heading' && h.test(plainText(x).replace(/^(?:[IVX]+\.|\d+(?:\.\d+)*\.?)\s+/, '').trim()));
  if (i < 0) return null;
  for (let j = i + 1; j < b.length && b[j].type !== 'heading'; j++) if (b[j].type === 'table') return rowsOf(b[j]);
  return null;
}

const DATA: SrsData = {
  actors: [
    { id: 1, name: 'Student', description: 'Books equipment', kind: 'PERSON', position: 0 },
    { id: 2, name: 'Lab Manager', description: 'Approves bookings', kind: 'PERSON', position: 1 },
    { id: 3, name: 'Timer', description: 'Scheduled jobs', kind: 'SYSTEM', position: 2 },
  ],
  useCases: [
    { id: 11, number: 1, name: 'Login', feature: 'Authentication', description: 'Sign in with email and password', trigger: 'User opens the app', preconditions: 'Account exists', postconditions: 'User is signed in', normalFlow: '1. Student enters email\n2. LabFlow checks the password\n3. LabFlow opens Home', alternativeFlows: '2A. Wrong password\n1. LabFlow shows SM-01', exceptionFlows: null, priority: 'HIGH', status: 'APPROVED', primaryActorId: 1, secondaryActorIds: [], ruleNumbers: [1] },
    { id: 12, number: 2, name: 'Approve Booking', feature: 'Booking', description: 'Manager approves', trigger: null, preconditions: 'Booking pending', postconditions: 'Booking approved', normalFlow: '1. Manager opens queue', alternativeFlows: null, exceptionFlows: null, priority: 'MEDIUM', status: 'DRAFT', primaryActorId: 2, secondaryActorIds: [1], ruleNumbers: [] },
    { id: 13, number: 3, name: 'Secret AI idea', feature: null, description: 'proposal', trigger: null, preconditions: null, postconditions: null, normalFlow: null, alternativeFlows: null, exceptionFlows: null, priority: 'LOW', status: 'PROPOSED', primaryActorId: 1, secondaryActorIds: [], ruleNumbers: [] },
  ],
  rules: [
    { id: 21, number: 1, name: 'Password length', definition: 'At least 8 characters', category: null, status: 'DRAFT' },
    { id: 22, number: 2, name: 'Proposed rule', definition: 'x', category: null, status: 'PROPOSED' },
  ],
  screens: [
    { id: 31, name: 'Login', feature: 'Authentication', description: 'Sign-in form', position: 0 },
    { id: 32, name: 'Home', feature: 'Common', description: null, position: 1 },
    { id: 33, name: 'Approval Queue', feature: 'Booking', description: null, position: 2 },
  ],
  links: [{ fromId: 31, toId: 32, label: 'Sign in' }, { fromId: 32, toId: 33, label: null }],
  auth: [[31, 1], [31, 2], [32, 1], [32, 2], [33, 2]],
  functions: [{ id: 41, feature: 'Booking', name: 'Auto-expire bookings', description: 'Every night at 00:00', position: 0 }],
};

describe('CTW đợt 4 — SRS có cấu trúc ⇒ Report 3 (srs.ts)', () => {
  it('mã UC/BR và dò mã trong chữ', () => {
    assert.equal(ucKey(3), 'UC-03');
    assert.equal(brKey(12), 'BR-12');
    assert.equal(refNumber('UC-07', 'UC'), 7);
    assert.equal(refNumber('uc7', 'UC'), 7);
    assert.equal(refNumber(4, 'BR'), 4);
    assert.equal(refNumber('FP-3', 'UC'), null);
    assert.deepEqual(refsIn('Covers UC-03 and uc-12, not XUC-9', 'UC'), [3, 12]);
    assert.deepEqual(ucMissing({ primaryActorId: null, description: '', preconditions: 'x', postconditions: null, normalFlow: '1.' }), ['primary actor', 'description', 'postconditions']);
  });

  it('điền đúng đề mục của mẫu Report 3; PROPOSED không vào; điền lại không nhân đôi', async () => {
    const doc = await tpl('fpt-report3-srs');
    const done = applySrsFill(doc, DATA);
    assert.deepEqual(done, ['actors', 'useCases', 'screensFlow', 'screenAuthorization', 'nonUi', 'ucSpecs', 'businessRules']);
    assert.deepEqual(tableAfter(doc, /^Actors$/), [['#', 'Actor', 'Description'], ['1', 'Student', 'Books equipment'], ['2', 'Lab Manager', 'Approves bookings'], ['3', 'Timer', 'Scheduled jobs']]);
    assert.deepEqual(tableAfter(doc, /^Use Cases \(UC\)$/), [['ID', 'Use Case', 'Feature', 'Use Case Description'], ['UC-01', 'Login', 'Authentication', 'Sign in with email and password'], ['UC-02', 'Approve Booking', 'Booking', 'Manager approves']]);
    assert.deepEqual(tableAfter(doc, /^Screen Authorization$/), [['Screen', 'Student', 'Lab Manager', 'Timer'], ['Login', 'X', 'X', ''], ['Home', 'X', 'X', ''], ['Approval Queue', '', 'X', '']]);
    assert.deepEqual(tableAfter(doc, /^Non-UI Functions$/), [['Feature', 'System Function', 'Description'], ['Booking', 'Auto-expire bookings', 'Every night at 00:00']]);
    assert.deepEqual(tableAfter(doc, /^Business Rules$/), [['ID', 'Rule Name', 'Rule Definition'], ['BR-01', 'Password length', 'At least 8 characters']]);
    // Screens Flow: Mermaid + bảng.
    const b = doc.content!;
    const sf = b.findIndex((x) => x.type === 'heading' && /Screens Flow/.test(plainText(x)));
    const mer = b.slice(sf + 1).find((x) => x.type === 'codeBlock');
    assert.equal(mer?.attrs?.language, 'mermaid');
    assert.match(plainText(mer!), /S1\["Login"\][\s\S]*S1 -->\|"Sign in"\| S2[\s\S]*S2 --> S3/);
    // Use Case Specifications: nhóm theo actor chính, 7 hàng đầu y hệt mẫu, rồi Trigger/Priority/Business Rules.
    const text = b.map((x) => (x.type === 'heading' ? `H${x.attrs?.level} ${plainText(x)}` : '')).filter(Boolean);
    assert.ok(text.includes('H3 2.1 Student Features'), text.join('\n'));
    assert.ok(text.includes('H4 2.1.1 Login (UC-01)'));
    assert.ok(text.includes('H3 2.2 Lab Manager Features'));
    assert.ok(text.includes('H4 2.2.1 Approve Booking (UC-02)'));
    assert.ok(!JSON.stringify(doc).includes('Secret AI idea'), 'UC PROPOSED không vào tài liệu');
    assert.ok(!JSON.stringify(doc).includes('Proposed rule'), 'BR PROPOSED không vào tài liệu');
    const spec = rowsOf(b[b.findIndex((x) => /Login \(UC-01\)/.test(plainText(x))) + 1]);
    assert.deepEqual(spec.map((r) => r[0]), ['Primary Actors', 'Description', 'Preconditions', 'Postconditions', 'Normal Sequence/Flow', 'Alternative Sequences/Flows', 'Exception Flows', 'Trigger', 'Priority', 'Business Rules']);
    assert.deepEqual(spec[0], ['Primary Actors', 'Student', 'Secondary Actors', 'None']);
    assert.equal(spec[4][1], '1. Student enters email2. LabFlow checks the password3. LabFlow opens Home');
    assert.equal(spec[9][1], 'BR-01: Password length');
    const specB = rowsOf(b[b.findIndex((x) => /Approve Booking \(UC-02\)/.test(plainText(x))) + 1]);
    assert.deepEqual(specB[0], ['Primary Actors', 'Lab Manager', 'Secondary Actors', 'Student']);
    // Hàng 2–7 gộp 3 ô phải như mẫu.
    const tbl = b[b.findIndex((x) => /Login \(UC-01\)/.test(plainText(x))) + 1];
    assert.equal(tbl.content![1].content![1].attrs!.colspan, 3);
    // Điền lần hai: cùng số bảng / khối Mermaid.
    const count = (d: PmNode) => ({ tables: d.content!.filter((x) => x.type === 'table').length, mermaid: d.content!.filter((x) => x.type === 'codeBlock').length });
    const before = count(doc);
    applySrsFill(doc, DATA);
    assert.deepEqual(count(doc), before);
  });

  it('không có dữ liệu ⇒ không đụng mẫu; trang không theo mẫu ⇒ không điền gì', async () => {
    const doc = await tpl('fpt-report3-srs');
    const json = JSON.stringify(doc);
    assert.deepEqual(applySrsFill(doc, { actors: [], useCases: [], rules: [], screens: [], links: [], auth: [], functions: [] }), []);
    assert.equal(JSON.stringify(doc), json);
    const other: PmNode = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hi' }] }] };
    assert.deepEqual(applySrsFill(other, DATA), []);
    assert.match(screensFlowMermaid([{ id: 1, name: 'A "quoted" [x]', feature: null, description: null, position: 0 }], []), /S1\["A quoted x"\]/);
  });
});

const baseRow = (o: Partial<RtmRow> = {}): Omit<RtmRow, 'status' | 'gaps'> => ({
  reqId: 'UC-01', kind: 'UC', ucNumber: 1, issueNumber: 5, issueKey: 'LAB-5', requirement: 'Login', feature: 'Auth', rules: ['BR-01'],
  srs: ['2.1.1'], screens: ['Login'], sds: ['Doc 4 › Login sequence'], code: { commits: 2, prs: 1, branches: 0, latest: null }, classMethod: ['AuthService.login'],
  unit: [{ name: 'login', ref: 'AuthService.login', cases: 4, passed: 4, failed: 0, notRun: 0 }], integration: [], system: [],
  xray: [{ key: 'LAB-9', title: 'Login ok', last: 'PASS' }], bugs: [], iteration: 'Iteration 1', issueDone: true, ucMissing: [], ...o,
});

describe('CTW đợt 4 — RTM (rtm.ts)', () => {
  it('đủ chuỗi + chạy đạt ⇒ Tested, không chỗ hở', () => {
    assert.deepEqual(evaluateRow(baseRow()), { status: 'Tested', gaps: [] });
  });
  it('chỗ hở: thiếu SDS, chưa code, test chưa chạy, trượt, Bug mở, UC thiếu ô, chưa gắn thẻ', () => {
    assert.deepEqual(evaluateRow(baseRow({ sds: [], code: { commits: 0, prs: 0, branches: 1, latest: null }, issueDone: false, unit: [], xray: [] })).gaps, ['NO_SDS', 'NO_CODE', 'NO_TEST']);
    const notRun = evaluateRow(baseRow({ unit: [{ name: 'f', cases: 3, passed: 0, failed: 0, notRun: 3 }], xray: [{ key: 'X', title: 't', last: null }] }));
    assert.deepEqual(notRun.gaps, ['NOT_RUN']);
    assert.equal(notRun.status, 'Coded');
    const failing = evaluateRow(baseRow({ xray: [{ key: 'X', title: 't', last: 'FAIL' }], bugs: [{ key: 'LAB-7', title: 'b', open: true, severity: 'MAJOR' }] }));
    assert.deepEqual(failing.gaps, ['FAILING', 'OPEN_BUGS']);
    assert.deepEqual(evaluateRow(baseRow({ ucMissing: ['description'], issueNumber: null, issueKey: null })).gaps, ['UC_INCOMPLETE', 'NO_ISSUE']);
    // Thẻ REQ không bị đòi UC/thẻ.
    assert.deepEqual(evaluateRow(baseRow({ kind: 'REQ', ucNumber: null, issueNumber: null })).gaps, []);
    // Trạng thái theo bậc: chỉ đặc tả đủ ⇒ Analyzed; có SDS ⇒ Designed.
    const empty = { code: { commits: 0, prs: 0, branches: 0, latest: null }, issueDone: false, unit: [], xray: [] };
    assert.equal(evaluateRow(baseRow({ ...empty, sds: [] })).status, 'Analyzed');
    assert.equal(evaluateRow(baseRow({ ...empty })).status, 'Designed');
    assert.equal(evaluateRow(baseRow({ ...empty, sds: [], ucMissing: ['normal flow'] })).status, 'Planned');
  });
  it('lọc + tổng kết + Excel đúng cột hướng dẫn RTM', () => {
    const a = { ...baseRow(), ...evaluateRow(baseRow()) };
    const bRow = baseRow({ reqId: 'LAB-12', kind: 'REQ', requirement: 'Export report', sds: [], xray: [], unit: [] });
    const b = { ...bRow, ...evaluateRow(bRow) };
    assert.deepEqual(filterRows([a, b], { gap: 'ANY' }).map((r) => r.reqId), ['LAB-12']);
    assert.deepEqual(filterRows([a, b], { gap: 'NO_TEST' }).map((r) => r.reqId), ['LAB-12']);
    assert.deepEqual(filterRows([a, b], { text: 'login' }).map((r) => r.reqId), ['UC-01']);
    assert.deepEqual(filterRows([a, b], { kind: 'REQ' }).map((r) => r.reqId), ['LAB-12']);
    const s = summarize([a, b]);
    assert.equal(s.rows, 2);
    assert.equal(s.testedPct, 50);
    assert.equal(s.gaps.NO_SDS, 1);
    const buf = writeXlsx(buildRtmSheets({ projectName: 'LabFlow', rows: [a, b], rules: [{ key: 'BR-01', name: 'Password', usedIn: ['UC-01'], unit: ['AuthService.login (4)'], integration: [], system: [], covered: true }], orphans: [{ kind: 'UNIT', ref: 'X.y', name: 'y' }], generated: '2026-10-09' }));
    const sheets = readXlsx(buf);
    assert.deepEqual(sheets.map((x) => x.name), ['RTM', 'BR Coverage', 'Untraced Tests', 'Summary']);
    const rtm = sheets[0];
    const head = RTM_HEADERS.map((_, i) => rtm.text(2, i + 1));
    assert.deepEqual(head.slice(0, 14), ['Req ID', 'Requirement', 'Feature', 'Related BR/NFR', 'SRS UC §', 'Screen (SRS §3)', 'SDS §', 'Class.method', 'Unit Test', 'Integration Test', 'System Test', 'Iteration', 'Status', 'Notes']);
    assert.equal(rtm.text(3, 1), 'UC-01');
    assert.equal(rtm.text(3, 13), 'Tested');
    assert.match(String(rtm.text(4, 19)), /No SDS section/);
  });
});

describe('CTW đợt 4 — Report 7 Final (finalReport.ts)', () => {
  it('Report ⇒ thân: bỏ Record of Changes + hướng dẫn, tách bảng định nghĩa', async () => {
    const r1 = await tpl('fpt-report1-project-introduction');
    const body = reportBody(r1);
    const heads = body.body.filter((x) => x.type === 'heading').map((x) => plainText(x));
    assert.ok(!heads.some((h) => /Record of Changes/.test(h)));
    assert.ok(heads.includes('1. Overview'));
    assert.ok(body.definitions && body.definitions.type === 'table');
    assert.ok(!JSON.stringify(body.body).includes('Purpose:'));
  });
  it('ghép: phần I–VI theo thứ tự, Acknowledgement giữ chữ người viết, thiếu Report ⇒ giữ phần cũ', async () => {
    const r7 = await tpl('fpt-report7-final-report');
    // Người viết lời cảm ơn trong Report 7.
    const ack = r7.content!.findIndex((x) => x.type === 'heading' && /Acknowledgement/.test(plainText(x)));
    r7.content!.splice(ack + 1, 0, { type: 'paragraph', content: [{ type: 'text', text: 'Thank you, Mr. Dong.' }] });
    const r3 = await tpl('fpt-report3-srs');
    applySrsFill(r3, DATA);
    const r1 = await tpl('fpt-report1-project-introduction');
    // Report 1 có định nghĩa.
    const defs = r1.content!.find((x) => x.type === 'table' && /Acronym/.test(plainText(x)))!;
    defs.content![1].content![0].content = [{ type: 'paragraph', content: [{ type: 'text', text: 'SRS' }] }];
    const out = assembleFinal(r7, [{ n: 1, doc: r1, label: 'Doc 2 v1' }, { n: 3, doc: r3, label: 'Doc 3 v4' }]);
    assert.deepEqual(out.merged, [1, 3]);
    assert.deepEqual(out.missing, [2, 4, 5, 6]);
    const h1 = out.doc.content!.filter((x) => x.type === 'heading' && x.attrs?.level === 1).map((x) => plainText(x));
    assert.deepEqual(h1, ['Acknowledgement', 'Definition and Acronyms', 'I. Project Introduction', 'II. Project Management Plan', 'III. Software Requirement Specification', 'IV. Software Design Description', 'V. Software Testing Documentation', 'VI. Release Package & User Guides']);
    const json = JSON.stringify(out.doc);
    assert.ok(json.includes('Thank you, Mr. Dong.'));
    assert.ok(json.includes('UC-01'), 'SRS có cấu trúc đã đi theo Report 3 vào Final');
    assert.ok(!/Record of Changes/.test(json));
    // Định nghĩa: Report 7 trống ⇒ lấy của Report 1.
    const di = out.doc.content!.findIndex((x) => x.type === 'heading' && /Definition and Acronyms/.test(plainText(x)));
    assert.ok(tableHasData(out.doc.content![di + 1]));
    // Phần II (thiếu Report 2) giữ đề mục của Report 7.
    const two = out.doc.content!.findIndex((x) => /II\. Project Management Plan/.test(plainText(x)));
    assert.match(plainText(out.doc.content![two + 1]), /Overview/);
  });
  it('bìa Final đúng tệp gốc (FPT University · Capstone Project Document · nhóm · giảng viên)', async () => {
    const buf = await renderDocx({ type: 'doc', content: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Acknowledgement' }] }] },
      { title: 'Report 7', projectName: 'LabFlow', projectKey: 'LAB', docLabel: 'DOC-8', version: 3, date: new Date('2026-12-01'), capstone: true, finalCover: { projectTitle: 'LabFlow AI', groupCode: 'SEP490-G108', members: ['An – HE1', 'Binh – HE2'], supervisor: 'Le Mai Dong', place: 'Hanoi' } },
      { resolveImage: async () => null });
    const xml = new AdmZip(buf).readAsText('word/document.xml');
    for (const s of ['MINISTRY OF EDUCATION AND TRAINING', 'FPT UNIVERSITY', 'Capstone Project Document', 'LabFlow AI', 'SEP490-G108', 'Group Members', 'Supervisor', 'Le Mai Dong', 'Hanoi, December 2026']) assert.ok(xml.includes(s), s);
  });
});

const item = (text: string, i: number): SpecItem => ({ ref: `¶${i}`, kind: 'STATEMENT', text, hasAcceptanceCriteria: false, acceptanceCriteriaCount: 0, testCount: 0, hasEdgeCase: false });

describe('CTW-12 — rà soát đặc tả chọn khung theo LOẠI trang', () => {
  it('nhận loại trang từ mẫu / tiêu đề / đề mục; không đoán được ⇒ OTHER (không mặc định SRS)', () => {
    assert.equal(docKindOf({ templateKey: 'fpt-report3-srs', title: 'x' }), 'SRS');
    assert.equal(docKindOf({ templateKey: 'fpt-report4-sds', title: 'x' }), 'SDD');
    assert.equal(docKindOf({ title: 'GDD — Flying Pencil' }), 'GDD');
    assert.equal(docKindOf({ title: 'Game Design Document' }), 'GDD');
    assert.equal(docKindOf({ title: 'SDD v1.2' }), 'SDD');
    assert.equal(docKindOf({ title: 'Đặc tả yêu cầu' }), 'SRS');
    assert.equal(docKindOf({ title: 'Notes', headings: ['Gameplay', 'Core loop & mechanics', 'Level design'] }), 'GDD');
    assert.equal(docKindOf({ title: 'Notes', headings: ['System architecture', 'Class diagram', 'Sequence diagram'] }), 'SDD');
    assert.equal(docKindOf({ title: 'Meeting minutes 06/10', headings: ['Attendees', 'Decisions'] }), 'OTHER');
  });
  it('GDD không bị đòi "Functional requirements"/AC/failure mode; SRS vẫn bị; tắt luật được', () => {
    const items = [item('The player shall jump when pressing Space.', 1), item('The plane must land within 30 seconds.', 2)];
    const heads = ['Overview', 'Gameplay & mechanics', 'Levels'];
    const gdd = analyze({ scope: 'PAGE', items, headings: heads, pageNumber: 1, testingEnabled: false, docKind: 'GDD' });
    const sections = gdd.findings.filter((f) => f.rule === 'missing_section').map((f) => f.why);
    assert.ok(!sections.some((w) => /Functional requirements|Non-functional/.test(w)), sections.join('\n'));
    assert.ok(sections.some((w) => /Story \/ characters/.test(w) && /game design document outline/.test(w)));
    assert.ok(!gdd.findings.some((f) => f.rule === 'missing_ac' || f.rule === 'no_failure_modes'));
    const srs = analyze({ scope: 'PAGE', items, headings: heads, pageNumber: 1, testingEnabled: false, docKind: 'SRS' });
    assert.ok(srs.findings.some((f) => f.rule === 'missing_section' && /Functional requirements/.test(f.why) && /29148/.test(f.why)));
    assert.ok(srs.findings.some((f) => f.rule === 'no_failure_modes'));
    const other = analyze({ scope: 'PAGE', items, headings: heads, pageNumber: 1, testingEnabled: false, docKind: 'OTHER' });
    assert.ok(!other.findings.some((f) => f.rule === 'missing_section'));
    const off = analyze({ scope: 'PAGE', items, headings: heads, pageNumber: 1, testingEnabled: false, docKind: 'SRS', disabledRules: ['missing_section', 'no_failure_modes'] });
    assert.ok(!off.findings.some((f) => f.rule === 'missing_section' || f.rule === 'no_failure_modes'));
    assert.deepEqual(off.findings.map((f) => f.id), off.findings.map((_, i) => `r${i + 1}`), 'id liền mạch sau khi lọc');
  });
});

describe('CTW đợt 4 — defect log + Q&A', () => {
  it('Severity theo phát hiện; mô tả Bug kiểu bug report', () => {
    assert.deepEqual(['high', 'medium', 'low'].map(severityOfFinding), ['MAJOR', 'MINOR', 'TRIVIAL']);
    const d = JSON.stringify(findingBugDoc({ ref: 'FR-01', excerpt: 'The system shall be fast', why: '"fast" is vague', suggestion: 'Say 2 s', dimension: 'unambiguity', rule: 'vague_term' }, 'Doc 3: SRS'));
    for (const s of ['Found by a spec review', 'Where: Doc 3: SRS — FR-01', 'The system shall be fast', 'Expected:', 'Say 2 s']) assert.ok(d.includes(s), s);
  });
  it('trạng thái Q&A ⇒ chữ của mẫu; dòng RAID cũ nhóm Q&A vẫn nhận', () => {
    assert.deepEqual(['OPEN', 'ANSWERED', 'CANCELLED', 'CLOSED', 'INVALID'].map(qaStatusText), ['Open', 'Closed', 'Cancelled', 'Closed', 'Cancelled']);
    assert.equal(isLegacyQa({ type: 'ISSUE', category: 'Q&A' }), true);
    assert.equal(isLegacyQa({ type: 'RISK', category: 'question for lecturer' }), true);
    assert.equal(isLegacyQa({ type: 'ISSUE', category: 'Scope' }), false);
    assert.equal(isLegacyQa({ type: 'QUESTION', category: 'Q&A' }), false);
  });
});
