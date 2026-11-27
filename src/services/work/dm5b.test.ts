/**
 * dm5 G2 (27/11/2026) — test THUẦN (không DB) của gói "Hồ sơ SRS/SDS/Report 2-3-4-6-7 & truy vết":
 * B9 bảng System Messages · B10 NFR + BR theo nhóm vào Report 3 (kèm .docx) · B8 lint UC · B13 4 chỉ số phủ + sheet NFR ·
 * B16 bảng CSDL 7 cột từ SQL (LabFlow 15 bảng) · B17 khung Class Specifications · B19 đối soát Report 7 · B21 Record of Changes
 * từ CR · B2 RACI theo vai · B15 ADR · B20 khung User Guide · B14 tên UC ↔ thẻ · B6 mã đích Q&A.
 * Chạy: npx tsx --test src/services/work/dm5b.test.ts
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import { adrNumberOf, adrTitle, markSuperseded, markSupersedes, numberAdrDoc } from './adr.js';
import { closest, fillUserGuide, sameUcName, ucNameChecks } from './dm5bDocs.js';
import { crAction, crChangeRows, mergeChangeRows, mergeRaci, raciReport2Table, recordOfChanges, REPORT2_PACKAGES, tableRowsText } from './docFill.js';
import { plainText, renderDocx } from './docExport.js';
import type { PmNode } from './docMarkdown.js';
import { getTemplate } from './docTemplates.js';
import { finalChecks, statedEffortPds, statedTestNumbers } from './finalReport.js';
import { normalizeTargetRef } from './qna.service.js';
import { buildRtmSheets, coverageOf, evaluateRow, nfrTraceRows, summarize, type RtmRow } from './rtm.js';
import { dbDesigns, fillClassSpecs, fillDbDesign, parseJavaClass, stripTypeSuffix } from './sdsFill.js';
import { analyzeSql } from './sqlDesign/index.js';
import { applySrsFill, findHeading, refsIn, rulesTable, sectionEnd, smKey, systemMessagesTable, type NfrFillLite, type SrsData, type UseCaseLite } from './srs.js';
import { raciProblems } from './swr6b.js';
import { normalFlowSteps, stepPointers, ucLint } from './swr.js';
import { readXlsx, writeXlsx } from './xlsxStyled.js';

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const tablesUnder = (doc: PmNode, re: RegExp): PmNode[] => {
  const b = doc.content ?? [];
  const i = findHeading(b, re);
  return i < 0 ? [] : b.slice(i + 1, sectionEnd(b, i)).filter((x) => x.type === 'table');
};

const uc = (o: Partial<UseCaseLite> = {}): UseCaseLite => ({
  id: 1, number: 1, name: 'Book a lab room', feature: 'Booking', description: 'Student books a room', trigger: null,
  preconditions: 'Student is logged in', postconditions: 'Booking status = PENDING', normalFlow: '1. Student opens Booking\n2. LabFlow shows free rooms\n3. Student confirms',
  alternativeFlows: '2A. No free room: LabFlow shows SM-02', exceptionFlows: '3E1. Slot taken meanwhile: LabFlow shows SM-03', priority: 'HIGH', status: 'APPROVED',
  primaryActorId: 1, secondaryActorIds: [], ruleNumbers: [1], ...o,
});

const nfr = (o: Partial<NfrFillLite['spec']> = {}, key = 'LAB-20', title = 'Page response time'): NfrFillLite => ({
  key, number: Number(key.split('-')[1]), title,
  spec: { characteristic: 'PERFORMANCE_EFFICIENCY', subCharacteristic: 'Time behaviour', scale: '95th percentile response time', meter: 'k6 load test, 10 min', unit: 'ms', comparator: '<=', mustValue: 2000, planValue: 1000, wishValue: 500, conditions: '100 concurrent users', verification: 'TEST', ...o },
});

const srsData = (): SrsData => ({
  actors: [{ id: 1, name: 'Student', description: null, kind: 'PERSON', position: 0 }, { id: 2, name: 'Lab Manager', description: null, kind: 'PERSON', position: 1 }],
  useCases: [uc()],
  rules: [
    { id: 1, number: 1, name: 'Cancel 2h before', definition: 'A booking can be cancelled up to 2 hours before start', category: 'CONSTRAINT', status: 'APPROVED' },
    { id: 2, number: 2, name: 'Max 3 bookings', definition: 'A student holds at most 3 open bookings', category: 'Constraints', status: 'APPROVED' },
    { id: 3, number: 3, name: 'Fee', definition: 'Fee = hours × rate', category: 'COMPUTATION', status: 'APPROVED' },
    { id: 4, number: 4, name: 'Draft rule', definition: null, category: null, status: 'PROPOSED' },
  ],
  screens: [], links: [], auth: [], functions: [],
  systemMessages: [
    { id: 11, number: 1, msgType: 'SUCCESS', context: 'Booking form', text: 'Đặt phòng thành công', textEn: 'Booking created', httpStatus: 201, useCaseIds: [1], status: 'APPROVED' },
    { id: 12, number: 2, msgType: 'WARNING', context: 'Room list', text: 'Không còn phòng trống', textEn: null, httpStatus: null, useCaseIds: [1], status: 'DRAFT' },
    { id: 13, number: 3, msgType: 'ERROR', context: null, text: 'Slot đã bị đặt', textEn: null, httpStatus: 409, useCaseIds: [], status: 'PROPOSED' },
  ],
  nfrs: [nfr(), nfr({ characteristic: 'SECURITY', subCharacteristic: 'Resistance', scale: 'Failed logins before lock', meter: 'Automated test', unit: 'attempts', mustValue: 5, planValue: 5, wishValue: null }, 'LAB-21', 'Brute-force lockout'),
    nfr({ characteristic: 'MAINTAINABILITY', subCharacteristic: 'Testability', scale: 'Line coverage of services', meter: 'JaCoCo', unit: '%', comparator: '>=', mustValue: 70, planValue: 80, wishValue: null }, 'LAB-22', 'Service coverage')],
});

// ─── B9 + B10: Report 3 ──────────────────────────────────────────

describe('dm5 G2 — Report 3: System Messages (B9), NFR + BR theo nhóm (B10)', () => {
  it('SM-xx: bảng 4 cột đúng mẫu, bỏ đề xuất PROPOSED, ngữ cảnh kèm UC + HTTP, nội dung kèm EN', () => {
    const rows = tableRowsText(systemMessagesTable(srsData().systemMessages!, (id) => (id === 1 ? 1 : null)));
    assert.deepEqual(rows[0], ['ID', 'Message Type', 'Context', 'Content']);
    assert.equal(rows.length, 3);
    assert.deepEqual(rows[1].slice(0, 2), ['SM-01', 'Success']);
    assert.match(rows[1][2], /Booking form[\s\S]*Used in: UC-01[\s\S]*HTTP 201/);
    assert.match(rows[1][3], /Đặt phòng thành công[\s\S]*EN: Booking created/);
    assert.equal(smKey(7), 'SM-07');
    assert.deepEqual(refsIn('show SM-2 then SM-10, not XSM-3', 'SM'), [2, 10]);
  });
  it('BR theo nhóm: 3 cột như mẫu, hàng nhóm gộp 3 ô, Constraint/Constraints gộp làm một, Computation sau Constraint', () => {
    const t = rulesTable(srsData().rules);
    const rows = tableRowsText(t);
    assert.deepEqual(rows[0], ['ID', 'Rule Name', 'Rule Definition']);
    assert.equal(rows[1][0], 'Constraint');
    assert.equal(Number(t.content![1].content![0].attrs?.colspan), 3);
    assert.deepEqual(rows.slice(2, 4).map((r) => r[0]), ['BR-01', 'BR-02']);
    assert.equal(rows[4][0], 'Computation');
    assert.ok(!rows.some((r) => r[0] === 'BR-04'), 'PROPOSED không vào tài liệu');
    // Không BR nào có nhóm ⇒ y như cũ.
    assert.deepEqual(tableRowsText(rulesTable([{ id: 9, number: 9, name: 'X', definition: 'd', category: null, status: 'DRAFT' }]))[1], ['BR-09', 'X', 'd']);
  });
  it('mẫu Report 3 thật: điền 4.2.x (Scale/Meter/Must→Minimum/Plan→Goal/Wish), thêm 4.2.5 cho đặc tính ngoài mẫu, 5.2 đủ bảng', async () => {
    const doc = clone((await getTemplate('fpt-report3-srs')).doc) as PmNode;
    const done = applySrsFill(doc, srsData());
    assert.ok(done.includes('nfr') && done.includes('systemMessages') && done.includes('businessRules'), done.join(','));
    const perf = tablesUnder(doc, /^Performance Efficiency$/);
    assert.equal(perf.length, 1);
    const pr = tableRowsText(perf[0]);
    assert.deepEqual(pr[0], ['ID', 'Ambition', 'Scale', 'Meter', 'Minimum (Must)', 'Goal (Plan)', 'Wish', 'Verification']);
    assert.deepEqual([pr[1][0], pr[1][4], pr[1][5], pr[1][6], pr[1][7]], ['LAB-20', '<= 2000 ms', '<= 1000 ms', '<= 500 ms', 'Test']);
    assert.match(pr[1][2], /Conditions: 100 concurrent users/);
    assert.equal(tableRowsText(tablesUnder(doc, /^Security & Privacy$/)[0])[1][0], 'LAB-21');
    const heads = (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b).trim());
    assert.ok(heads.includes('4.2.5 Maintainability'), heads.filter((h) => h.startsWith('4.2')).join(' | '));
    const sm = tableRowsText(tablesUnder(doc, /^System Messages$/)[0]);
    assert.deepEqual(sm.map((r) => r[0]), ['ID', 'SM-01', 'SM-02']);
    // Điền lần 2: không nhân đôi mục 4.2.5, không nhân đôi bảng.
    applySrsFill(doc, srsData());
    const heads2 = (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b).trim());
    assert.equal(heads2.filter((h) => /Maintainability/.test(h)).length, 1);
    assert.equal(tablesUnder(doc, /^Performance Efficiency$/).length, 1);
    // Bản .docx chứa bảng NFR + SM (snapshot nội dung).
    const xml = new AdmZip(await renderDocx(doc, { title: 'Report 3', projectName: 'LabFlow', projectKey: 'LAB', docLabel: 'DOC-3', version: 2, date: new Date('2026-11-27'), capstone: true }, { resolveImage: async () => null })).readAsText('word/document.xml');
    for (const s of ['Minimum (Must)', 'Goal (Plan)', 'LAB-20', '&lt;= 2000 ms', 'SM-01', 'Đặt phòng thành công', 'Message Type', 'Constraint']) assert.ok(xml.includes(s), s);
  });
});

// ─── B8: lint UC ─────────────────────────────────────────────────

describe('dm5 G2 — lint use case (B8)', () => {
  it('bước Normal Flow + mã bước luồng phụ', () => {
    assert.deepEqual([...normalFlowSteps('1. A\n2) B\nStep 3: C\nnot a step')], [1, 2, 3]);
    assert.deepEqual(stepPointers('2A. x\n4E1. y\n2A again, v1.2A no'), [{ code: '2A', step: 2 }, { code: '4E1', step: 4 }]);
  });
  it('UC sạch ⇒ không cảnh báo; "System", bước 9A lạ, BR/SM trong Postconditions, SM không tồn tại ⇒ đủ 4 mã', () => {
    assert.deepEqual(ucLint(uc(), { systemName: 'LabFlow', messageNumbers: [1, 2, 3] }), []);
    const bad = uc({
      normalFlow: '1. Student opens Booking\n2. System shows free rooms', alternativeFlows: '9A. the system retries', exceptionFlows: '2E1. LabFlow shows SM-07',
      postconditions: 'Show SM-01 and BR-02 applies',
    });
    const codes = ucLint(bad, { systemName: 'LabFlow', messageNumbers: [1, 2] }).map((g) => `${g.code}:${g.severity}`);
    assert.deepEqual(codes, ['SYSTEM_SUBJECT:warning', 'STEP_REF_UNKNOWN:warning', 'CODE_IN_POSTCONDITION:warning', 'SM_UNKNOWN:error']);
    // Tên hệ thống có chữ "System" ⇒ không bắt lỗi chữ System; "System Messages" không tính.
    assert.ok(!ucLint(uc({ normalFlow: '1. Library System shows list' }), { systemName: 'Library System' }).some((g) => g.code === 'SYSTEM_SUBJECT'));
    assert.ok(!ucLint(uc({ description: 'See System Messages' }), { systemName: 'LabFlow' }).some((g) => g.code === 'SYSTEM_SUBJECT'));
  });
});

// ─── B13: RTM ────────────────────────────────────────────────────

const row = (o: Partial<RtmRow> = {}): RtmRow => {
  const b: Omit<RtmRow, 'status' | 'gaps'> = {
    reqId: 'UC-01', kind: 'UC', ucNumber: 1, issueNumber: 5, issueKey: 'LAB-5', requirement: 'Login', feature: 'Auth', rules: [], srs: ['2.1.1'], screens: [],
    sds: ['Doc 4 › Login'], code: { commits: 2, prs: 1, branches: 0, latest: null }, classMethod: [], unit: [{ name: 'login', ref: 'Auth.login', cases: 4, passed: 4, failed: 0, notRun: 0 }],
    integration: [], system: [{ name: 'ST Login', cases: 3, passed: 3, failed: 0, notRun: 0 }], xray: [], bugs: [], iteration: '', issueDone: true, ucMissing: [], ...o,
  };
  return { ...b, ...evaluateRow(b) };
};

describe('dm5 G2 — RTM: 4 chỉ số phủ + sheet NFR (B13)', () => {
  it('UC coded thiếu SDS · UC tested thiếu ST · % BR có test · test mồ côi', () => {
    const rows = [row(), row({ reqId: 'UC-02', sds: [] }), row({ reqId: 'UC-03', system: [] }), row({ reqId: 'LAB-9', kind: 'REQ', sds: [], system: [] })];
    const c = coverageOf(rows, [
      { key: 'BR-01', name: 'a', usedIn: [], unit: ['x'], integration: [], system: [], covered: true },
      { key: 'BR-02', name: 'b', usedIn: [], unit: [], integration: [], system: [], covered: false },
      { key: 'BR-03', name: 'c', usedIn: [], unit: [], integration: [], system: ['s'], covered: true },
    ], [{ kind: 'XRAY', ref: 'LAB-30', name: 'orphan' }]);
    assert.deepEqual(c.ucCodedNoSds, ['UC-02']);
    assert.deepEqual(c.ucTestedNoSt, ['UC-03']);
    assert.equal(c.brCoveredPct, 67);
    assert.deepEqual(c.brUncovered, ['BR-02']);
    assert.equal(c.orphanTests, 1);
    assert.equal(summarize(rows).coverage.brTotal, 0);
  });
  it('sheet NFR: NFR → meter → test của chính thẻ NFR; Summary có 4 dòng chỉ số', () => {
    const rows = [row({ reqId: 'LAB-20', kind: 'REQ', issueNumber: 20, issueKey: 'LAB-20', xray: [{ key: 'LAB-40', title: 'k6', last: 'PASS' }], unit: [], system: [] })];
    const nf = nfrTraceRows([nfr(), nfr({ verification: 'TEST' }, 'LAB-21', 'No test NFR')], rows);
    assert.deepEqual(nf[0].tests, ['LAB-40 [PASS]']);
    assert.equal(nf[0].result, 'All 1 passed');
    assert.equal(nf[0].must, '≤ 2000 ms');
    assert.equal(nf[1].result, 'No test yet');
    const sheets = readXlsx(writeXlsx(buildRtmSheets({ projectName: 'LabFlow', rows, rules: [], orphans: [], nfrs: nf, generated: '2026-11-27' })));
    const s = sheets.find((x) => x.name === 'NFR')!;
    assert.equal(s.text(1, 5), 'Meter (how it is measured)');
    assert.equal(s.text(2, 1), 'LAB-20');
    const sum = sheets.find((x) => x.name === 'Summary')!;
    const labels = Array.from({ length: 40 }, (_, i) => String(sum.text(5 + i, 1) ?? ''));
    for (const l of ['UC coded but without an SDS section', 'UC tested but without a System Test (5.3)', 'Business rules covered by a test (%)', 'Untraced (orphan) tests']) assert.ok(labels.some((x) => x.includes(l)), l);
  });
});

// ─── B16 + B17: Report 4 ─────────────────────────────────────────

const LABFLOW_SQL = readFileSync(path.resolve('src/services/work/sqlDesign/fixtures/labflow-v1.sql'), 'utf8');

describe('dm5 G2 — Report 4: bảng CSDL 7 cột (B16) + Class Specifications (B17)', () => {
  it('LabFlow 15 bảng ⇒ 15 bảng thiết kế, tên cột khớp 100% migration, PK/FK/UN/NN đúng, Constraints', () => {
    const a = analyzeSql(LABFLOW_SQL);
    assert.deepEqual(a.parse.errors, []);
    const d = dbDesigns(a.parse.model);
    assert.equal(d.length, 15);
    // Mọi tên cột trong SQL (dòng định nghĩa cột) xuất hiện nguyên văn.
    for (const t of a.parse.model.tables) assert.deepEqual(d.find((x) => x.name === t.name)!.fields.map((f) => f.field), t.columns.map((c) => c.name));
    const users = d.find((x) => x.name === 'users')!;
    const email = users.fields.find((f) => f.field === 'email')!;
    assert.deepEqual([email.pk, email.fk, email.un, email.nn], [false, false, true, true]);
    assert.match(email.description, /^Login e-mail \(FPT mail\) \(VARCHAR\(255\)\)$/);
    assert.ok(users.constraints.some((c) => /CHECK \(status IN/.test(c)));
    const ur = d.find((x) => x.name === 'user_roles')!;
    assert.deepEqual(ur.fields.map((f) => [f.field, f.pk, f.fk]), [['user_id', true, true], ['role_id', true, true]]);
    assert.ok(ur.constraints.includes('PRIMARY KEY (user_id, role_id)'));
    assert.ok(d.find((x) => x.name === 'rooms')!.constraints.some((c) => c.startsWith('UNIQUE (lab_id, room_no)')));
    assert.ok(d.find((x) => x.name === 'bookings')!.constraints.some((c) => /UNIQUE INDEX ux_bookings_room_slot \(room_id, start_at\) WHERE/.test(c)));
    assert.deepEqual(d.find((x) => x.name === 'settings')!.fields.map((f) => f.field), ['key', 'value', 'updated_by']);
  });
  it('mẫu Report 4: thay mục TABLE_NAME bằng 15 mục 1.3.k, bảng đúng 7 cột, giữ mô tả người đã gõ khi điền lại', async () => {
    const doc = clone((await getTemplate('fpt-report4-sds')).doc) as PmNode;
    const designs = dbDesigns(analyzeSql(LABFLOW_SQL).parse.model);
    assert.equal(fillDbDesign(doc, designs), 15);
    const heads = (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b).trim());
    assert.ok(!heads.some((h) => /TABLE_NAME/.test(h)));
    assert.ok(heads.includes('1.3.1 roles') && heads.includes('1.3.15 settings'), heads.filter((h) => h.startsWith('1.3')).join(' | '));
    const i = (doc.content ?? []).findIndex((b) => b.type === 'heading' && plainText(b).trim() === '1.3.2 users');
    const tbl = (doc.content ?? []).slice(i).find((b) => b.type === 'table')!;
    assert.deepEqual(tableRowsText(tbl)[0], ['No', 'Field', 'PK', 'FK', 'UN', 'NN', 'Description']);
    assert.deepEqual(tableRowsText(tbl)[1].slice(0, 6), ['1', 'id', 'X', '', '', 'X']);
    // Người sửa mô tả cột "password_hash" ⇒ điền lại giữ chữ đó (phần kiểu trong ngoặc cập nhật).
    const r = tableRowsText(tbl).findIndex((x) => x[1] === 'password_hash');
    tbl.content![r].content![6] = { type: 'tableCell', attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'BCrypt hash (VARCHAR(255))' }] }] };
    fillDbDesign(doc, designs);
    const heads2 = (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b).trim());
    assert.equal(heads2.filter((h) => /\busers$/.test(h)).length, 1, 'không nhân đôi mục');
    const i2 = (doc.content ?? []).findIndex((b) => b.type === 'heading' && /\busers$/.test(plainText(b).trim()));
    const tbl2 = (doc.content ?? []).slice(i2).find((b) => b.type === 'table')!;
    assert.equal(tableRowsText(tbl2).find((x) => x[1] === 'password_hash')![6], 'BCrypt hash (VARCHAR(255))');
    assert.equal(stripTypeSuffix('Mã (BIGINT · → users(id))', 'BIGINT · → users(id)'), 'Mã');
    assert.equal(stripTypeSuffix('VARCHAR(20)', 'VARCHAR(20)'), '');
  });
  it('lớp Java ⇒ package, thuộc tính, phương thức; khung §3 theo package controller → service → repository → entity', async () => {
    const svc = parseJavaClass('src/main/java/vn/fpt/labflow/service/BookingService.java', `package vn.fpt.labflow.service;
      import java.util.List;
      @Service
      public class BookingService {
        private final BookingRepository repo;
        public BookingService(BookingRepository repo) { this.repo = repo; }
        @Transactional
        public Booking create(Long roomId, BookingRequest req) { if (req == null) { throw new X(); } return repo.save(new Booking()); }
        public List<Booking> listMine(Long userId) { return repo.findAll(); }
        private void check() {}
      }`)!;
    assert.equal(svc.pkg, 'vn.fpt.labflow.service');
    assert.deepEqual(svc.attributes.map((a) => [a.name, a.type, a.visibility]), [['repo', 'BookingRepository', 'private']]);
    assert.deepEqual(svc.methods.map((m) => m.name), ['BookingService', 'create', 'listMine', 'check']);
    assert.equal(svc.methods[1].params, 'Long roomId, BookingRequest req');
    const ctl = parseJavaClass('src/main/java/vn/fpt/labflow/controller/BookingController.java', 'package vn.fpt.labflow.controller;\npublic class BookingController { @PostMapping public ResponseEntity<Booking> create(@RequestBody BookingRequest r) { return null; } }')!;
    const doc = clone((await getTemplate('fpt-report4-sds')).doc) as PmNode;
    assert.equal(fillClassSpecs(doc, [svc, ctl]), 2);
    const heads = (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b).trim());
    const at = heads.indexOf('3.1 vn.fpt.labflow.controller');
    assert.ok(at >= 0 && heads[at + 1] === '3.1.1 BookingController' && heads[at + 2] === '3.2 vn.fpt.labflow.service', heads.join(' | '));
    assert.ok(!heads.includes('3.1 Package name'));
  });
});

// ─── B19: Report 7 ───────────────────────────────────────────────

const docOf = (blocks: PmNode[]): PmNode => ({ type: 'doc', content: blocks });
const h = (lv: number, text: string): PmNode => ({ type: 'heading', attrs: { level: lv }, content: [{ type: 'text', text }] });
const p = (text: string): PmNode => ({ type: 'paragraph', content: [{ type: 'text', text }] });
const tbl = (rows: string[][]): PmNode => ({ type: 'table', content: rows.map((r, i) => ({ type: 'tableRow', content: r.map((c) => ({ type: i ? 'tableCell' : 'tableHeader', content: [p(c)] })) })) });

describe('dm5 G2 — đối soát Report 7 trước khi ghép (B19)', () => {
  const facts = {
    registers: { UC: new Map([[1, 'Book a lab room'], [2, 'Approve booking']]), BR: new Map([[1, 'Cancel 2h before']]), SM: new Map([[1, 'ok']]), FE: new Map([[1, 'Booking']]) },
    tests: { unit: { total: 40, passed: 38 }, integration: { total: 10, passed: 10 }, system: { total: 0, passed: 0 } },
    loggedHours: 400,
  };
  it('số liệu đọc từ bảng/câu chữ Phần V + effort Phần II', () => {
    assert.deepEqual(statedTestNumbers([tbl([['Module', 'Total', 'Passed', 'Pass rate'], ['Booking', '20', '19', '95%'], ['Total', '45', '43', '95.6 %']])]), { totals: [45], passRates: [95.6] });
    assert.deepEqual(statedTestNumbers([p('We executed 40 test cases with a pass rate of 95%.')]), { totals: [40], passRates: [95] });
    assert.equal(statedEffortPds(docOf([h(3, '1.1 Cost & Time Estimations'), tbl([['#', 'Work Package', 'Est. Effort (pds)', 'Deadline'], ['1', 'Stage 1', '20', ''], ['1.1', 'x', '5', ''], ['2', 'Stage 2', '30', '']])])), 50);
  });
  it('mã lạ / trùng / tên lệch · số test lệch · pass rate lệch · effort lệch > 5% · chữ mẫu còn sót', () => {
    const r3 = docOf([h(2, 'Use Cases'), tbl([['ID', 'Use Case', 'Feature', 'Desc'], ['UC-01', 'Book lab room', 'Booking', ''], ['UC-02', 'Cancel booking', '', ''], ['UC-02', 'Approve booking', '', '']]), p('See UC-07 and BR-09, show SM-01.'), h(3, '3.2 Feature name')]);
    const r5 = docOf([h(2, '5. Test Reports'), h(3, '5.1 Unit Test'), p('We ran 42 test cases, pass rate 95%.'), h(3, '5.2 Integration test'), tbl([['Module', 'Total', 'Passed'], ['API', '10', '10']])]);
    const r2 = docOf([h(3, '1.1 Cost & Time Estimations'), tbl([['#', 'Work Package', 'Est. Effort (pds)'], ['1', 'All', '30']])]);
    const checks = finalChecks([{ n: 2, doc: r2, label: '' }, { n: 3, doc: r3, label: '' }, { n: 5, doc: r5, label: '' }], facts);
    const codes = checks.map((c) => c.code);
    assert.ok(codes.includes('CODE_UNKNOWN'));
    assert.ok(checks.find((c) => c.code === 'CODE_UNKNOWN' && /UC/.test(c.message))!.items.some((x) => x.startsWith('UC-07')));
    assert.ok(checks.find((c) => c.code === 'CODE_UNKNOWN' && /BR/.test(c.message))!.items.some((x) => x.startsWith('BR-09')));
    assert.ok(checks.find((c) => c.code === 'CODE_DUPLICATE')!.items.some((x) => /UC-02 defined 2× in Report 3/.test(x)));
    assert.ok(checks.find((c) => c.code === 'NAME_MISMATCH')!.items.some((x) => /UC-02 is "Approve booking" in CT Work but "Cancel booking"/.test(x)));
    assert.ok(checks.some((c) => c.code === 'TEST_COUNT_MISMATCH' && /says 42 .* CT Work has 40/.test(c.message)));
    assert.ok(!checks.some((c) => c.code === 'PASS_RATE_MISMATCH' && /Unit/.test(c.message)), '95% ≈ 38/40 = 95%');
    assert.ok(checks.some((c) => c.code === 'EFFORT_MISMATCH' && /30 person-days .* 50/.test(c.message)));
    assert.ok(checks.find((c) => c.code === 'TEMPLATE_LEFTOVER' && c.report === 3)!.items.some((x) => /Feature name/.test(x)));
    // Sạch ⇒ không có lỗi.
    const clean = finalChecks([{ n: 3, doc: docOf([tbl([['ID', 'Use Case'], ['UC-01', 'Book a lab room']]), p('UC-02 approves')]), label: '' }], facts);
    assert.deepEqual(clean.filter((c) => c.severity === 'error'), []);
  });
});

// ─── B21 + B2: Report 2 ──────────────────────────────────────────

describe('dm5 G2 — Record of Changes từ CR (B21) + RACI theo vai (B2)', () => {
  it('CR IMPLEMENTED ⇒ dòng A/M/D trộn theo thời gian với dòng phiên bản', () => {
    assert.equal(crAction('Add QR check-in'), 'A');
    assert.equal(crAction('Remove the fine module'), 'D');
    assert.equal(crAction('Change cancel window to 4h'), 'M');
    assert.equal(crAction('Bổ sung báo cáo tuần'), 'A');
    const v = recordOfChanges([{ n: 1, kind: 'CREATE', note: null, createdAt: new Date('2026-10-01T03:00:00Z'), author: 'Cuong', contentJson: docOf([h(2, 'Intro')]) },
      { n: 2, kind: 'EDIT', note: null, createdAt: new Date('2026-11-01T03:00:00Z'), author: 'Cuong', contentJson: docOf([h(2, 'Intro'), p('x')]) }]);
    const c = crChangeRows([{ number: 4, title: 'Add QR check-in', reason: null, implementedAt: new Date('2026-10-15T03:00:00Z'), inCharge: 'Cuong', refs: ['UC-05', 'BR-02'] }]);
    const m = mergeChangeRows(v, c);
    assert.deepEqual(m.map((r) => r.action), ['A', 'A', 'M']);
    assert.equal(m[1].description, 'CR-4: Add QR check-in (UC-05, BR-02)');
    assert.equal(m[1].date, '15/10/2026');
  });
  it('ONE_ROLE_MAJORITY_A: một mũ giữ > 50% chữ A', () => {
    const acts = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }];
    const cells = [{ activityId: 1, stakeholderId: 7, role: 'A' }, { activityId: 2, stakeholderId: 7, role: 'A' }, { activityId: 3, stakeholderId: 8, role: 'A' },
      ...acts.map((x) => ({ activityId: x.id, stakeholderId: 9, role: 'R' }))];
    const pr = raciProblems(acts, cells, new Map([[7, 'C1 Leader/PM']]));
    assert.deepEqual(pr.filter((x) => x.code === 'ONE_ROLE_MAJORITY_A'), [{ activity: '', code: 'ONE_ROLE_MAJORITY_A', count: 67, stakeholder: 'C1 Leader/PM' }]);
    assert.ok(!raciProblems(acts, cells.filter((c) => c.stakeholderId !== 7)).some((x) => x.code === 'ONE_ROLE_MAJORITY_A'));
  });
  it('Report 2 §3: roles = 5 cột mũ · honest = Sinh viên + Supervisor (gộp A > R > C > I) · ô người gõ giữ lại', () => {
    assert.equal(mergeRaci(['C', 'R', 'I']), 'R');
    const matrix = {
      activities: [{ id: 1, name: 'Prepare SRS Document' }, { id: 2, name: 'Final Report' }, { id: 3, name: 'Elicit requirements' }, { id: 4, name: 'Demo video' }],
      stakeholders: [{ id: 10, name: 'C1 Leader/PM', kind: 'ROLE', userId: null, role: null }, { id: 11, name: 'C2 BA', kind: 'ROLE', userId: null, role: null }, { id: 20, name: 'Ms Dong', kind: 'PERSON', userId: 99, role: 'Supervisor' }],
      cells: [{ activityId: 1, stakeholderId: 11, role: 'R' }, { activityId: 1, stakeholderId: 10, role: 'A' }, { activityId: 1, stakeholderId: 20, role: 'C' }, { activityId: 2, stakeholderId: 10, role: 'R' }, { activityId: 2, stakeholderId: 20, role: 'A' }],
    };
    const people = [{ userId: 1, name: 'Cuong', lecturer: false }, { userId: 99, name: 'Ms Dong', lecturer: true }];
    const roles = tableRowsText(raciReport2Table(null, { mode: 'roles', people, matrix })!);
    assert.deepEqual(roles[0], ['Work Package', 'C1 Leader/PM', 'C2 BA']);
    assert.deepEqual(roles.find((r) => r[0] === 'Prepare SRS Document'), ['Prepare SRS Document', 'A', 'R']);
    assert.deepEqual(roles.map((r) => r[0]).slice(1), [...REPORT2_PACKAGES, 'Demo video'], 'gói mẫu + hoạt động tự thêm, bỏ hoạt động yêu cầu của SRS');
    const old = tableRowsText(raciReport2Table(null, { mode: 'honest', people, matrix })!);
    assert.deepEqual(old[0], ['Work Package', 'Cuong', 'Supervisor']);
    assert.deepEqual(old.find((r) => r[0] === 'Prepare SRS Document'), ['Prepare SRS Document', 'A', 'C']);
    assert.deepEqual(old.find((r) => r[0] === 'Final Report'), ['Final Report', 'R', 'A']);
    // Ô người đã gõ ở hàng không có trong ma trận ⇒ giữ.
    const typed = tbl([['Work Package', 'Cuong', 'Supervisor'], ['Presentation Slide', 'R', 'I']]);
    assert.deepEqual(tableRowsText(raciReport2Table(typed, { mode: 'honest', people, matrix })!).find((r) => r[0] === 'Presentation Slide'), ['Presentation Slide', 'R', 'I']);
  });
});

// ─── B15 · B20 · B14 · B6 ────────────────────────────────────────

describe('dm5 G2 — ADR (B15), User Guide (B20), tên UC (B14), mã đích Q&A (B6)', () => {
  it('ADR: số tự tăng trong tiêu đề + nội dung; Superseded by / Supersedes trong bảng trường', () => {
    assert.equal(adrTitle(3, 'ADR-<số>: <Tiêu đề quyết định ngắn>'), 'ADR-003: New decision');
    assert.equal(adrTitle(12, 'Chọn PostgreSQL'), 'ADR-012: Chọn PostgreSQL');
    assert.equal(adrNumberOf('ADR-007: x'), 7);
    const d = numberAdrDoc(docOf([h(1, 'ADR-<number>: Use JWT'), tbl([['Field', 'Value'], ['Status', 'Accepted'], ['Related', 'UC-01']])]), 4);
    assert.equal(plainText(d.content![0]), 'ADR-004: Use JWT');
    assert.ok(markSuperseded(d, 9));
    assert.ok(markSupersedes(d, 2));
    assert.ok(markSupersedes(d, 2));
    const rows = tableRowsText(d.content![1]);
    assert.deepEqual(rows[1], ['Status', 'Superseded by ADR-009']);
    assert.deepEqual(rows[2], ['Related', 'UC-01 · Supersedes ADR-002']);
  });
  it('User Guide: mục theo actor → màn (tên đúng WorkSrsScreen), giữ mục đã viết, cảnh báo tiêu đề lệch', async () => {
    const doc = clone((await getTemplate('fpt-report6-user-guides')).doc) as PmNode;
    const data = {
      actors: [{ id: 1, name: 'Student', description: null, kind: 'PERSON', position: 0 }, { id: 2, name: 'Payment Gateway', description: null, kind: 'SYSTEM', position: 1 }],
      screens: [{ id: 1, name: 'Booking Calendar', feature: 'Booking', description: 'Pick a free slot', position: 0 }, { id: 2, name: 'My Bookings', feature: null, description: null, position: 1 }],
      auth: [[1, 1], [2, 1]] as Array<[number, number]>,
    };
    const r = fillUserGuide(doc, data)!;
    assert.deepEqual(r.added, ['Student Features', 'Student › Booking Calendar', 'Student › My Bookings']);
    const heads = (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b).trim());
    assert.ok(heads.includes('3.2 Student Features') && heads.includes('3.2.1 Booking Calendar') && heads.includes('3.2.2 My Bookings'), heads.join(' | '));
    assert.ok(!heads.includes('3.2 Feature name'));
    // Người viết một mục sai tên ⇒ cảnh báo kèm gợi ý; điền lại không nhân đôi.
    const i = (doc.content ?? []).findIndex((b) => b.type === 'heading' && plainText(b).trim() === '3.2.2 My Bookings');
    doc.content![i] = h(4, '3.2.3 Booking Calender');
    const r2 = fillUserGuide(doc, data)!;
    assert.deepEqual(r2.added, ['Student › My Bookings']);
    assert.deepEqual(r2.warnings, [{ heading: '3.2.3 Booking Calender', suggestion: 'Booking Calendar' }]);
    assert.equal(closest('Bookng calendar', ['My Bookings', 'Booking Calendar']), 'Booking Calendar');
  });
  it('tên UC ↔ tiêu đề thẻ; mã đích Q&A chuẩn hoá', () => {
    assert.ok(sameUcName('Book a lab room', '[UC-01] Book a lab room'));
    assert.ok(!sameUcName('Book a lab room', 'Cancel booking'));
    const r = ucNameChecks([{ number: 1, name: 'Book a lab room', status: 'APPROVED', issueKey: 'LAB-5' }, { number: 2, name: 'Approve', status: 'DRAFT', issueKey: null }, { number: 3, name: 'X', status: 'PROPOSED', issueKey: null }], (k) => (k === 'LAB-5' ? 'Book lab' : null));
    assert.deepEqual(r.map((x) => [x.uc, x.problem]), [['UC-01', 'NAME_MISMATCH'], ['UC-02', 'NO_ISSUE']]);
    assert.equal(normalizeTargetRef('br3', 'LAB'), 'BR-03');
    assert.equal(normalizeTargetRef(' uc-12 ', 'LAB'), 'UC-12');
    assert.equal(normalizeTargetRef('sm 2', 'LAB'), 'SM-02');
    assert.equal(normalizeTargetRef('fe-4', 'LAB'), 'FE-4');
    assert.equal(normalizeTargetRef('lab-17', 'LAB'), 'LAB-17');
    assert.equal(normalizeTargetRef('hello', 'LAB'), null);
  });
});

// ─── B18: PlantUML ───────────────────────────────────────────────

import { inflateRawSync } from 'node:zlib';
import { importFile } from './diagramImport.js';
import { blocksFor, numberFigures, type PlacedDiagram } from './diagramFill.js';
import { parseEmbed } from './diagram.js';
import { lintPlantUml, plantumlEncode, sanitizeSvg, typeFromPlantUml } from './plantuml.js';

const PUML_ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
function plantumlDecode(s: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < s.length; i += 4) {
    const [c1, c2, c3, c4] = [0, 1, 2, 3].map((k) => PUML_ALPHA.indexOf(s[i + k] ?? '0'));
    bytes.push(((c1 << 2) | (c2 >> 4)) & 0xff, (((c2 & 0xf) << 4) | (c3 >> 2)) & 0xff, (((c3 & 0x3) << 6) | c4) & 0xff);
  }
  return inflateRawSync(Buffer.from(bytes), { finishFlush: 2 }).toString('utf8');
}

describe('dm5 G2 — PlantUML (B18)', () => {
  const SEQ = '@startuml\nactor Student\nStudent -> LabFlow : book room\nLabFlow --> Student : SM-01\n@enduml\n';
  it('mã hoá URL đúng chuẩn (deflate thô + bảng chữ PlantUML) — giải ngược ra đúng nguồn', () => {
    const e = plantumlEncode(SEQ);
    assert.match(e, /^[0-9A-Za-z_-]+$/);
    assert.equal(plantumlDecode(e), SEQ);
  });
  it('lint: thiếu @enduml, !include bị chặn; loại sơ đồ đoán đúng', () => {
    assert.equal(lintPlantUml(SEQ).ok, true);
    assert.match(lintPlantUml('@startuml\nA -> B\n').errors[0].message, /Missing @enduml/);
    assert.match(lintPlantUml('@startuml\n!include /etc/passwd\n@enduml').errors[0].message, /not allowed/);
    assert.equal(typeFromPlantUml(SEQ), 'SEQUENCE');
    assert.equal(typeFromPlantUml('@startuml\nclass Booking {\n +id: Long\n}\n@enduml'), 'CLASS');
    assert.equal(typeFromPlantUml('@startuml\n[*] --> Pending\nPending --> Approved\n@enduml'), 'STATE');
    assert.equal(typeFromPlantUml('@startuml\nentity users {\n id\n}\n@enduml'), 'ERD');
  });
  it('làm sạch SVG: bỏ script / on*= / foreignObject / href ngoài', () => {
    const s = sanitizeSvg('<?xml version="1.0"?><svg onload="x()"><script>alert(1)</script><a href="https://evil">t</a><foreignObject><div/></foreignObject><text>ok</text></svg>');
    assert.equal(s, '<svg><a href="#">t</a><text>ok</text></svg>');
  });
  it('nhập .puml ⇒ PLANTUML (trước đây rơi vào nhánh Mermaid thành sơ đồ rác)', () => {
    const r = importFile({ fileName: 'docs/uml/booking-flow.puml', content: SEQ });
    assert.equal(r.format, 'PLANTUML');
    assert.equal(r.type, 'SEQUENCE');
    assert.equal(r.title, 'booking flow');
    assert.equal(r.source, SEQ);
    assert.throws(() => importFile({ fileName: 'x.puml', content: 'Bob -> Alice' }), /No @startuml/);
  });
  it('đặt vào Docs: khối code plantuml có dòng nhúng `\'`; chú thích đánh số Figure n theo thứ tự', () => {
    const d: PlacedDiagram = { id: 7, number: 4, title: 'Booking flow', type: 'SEQUENCE', format: 'PLANTUML', version: 2, source: SEQ };
    const [code, cap] = blocksFor(d, 1);
    assert.equal(code.attrs?.language, 'plantuml');
    const text = plainText(code);
    assert.match(text.split('\n')[0], /^' ctw-diagram:7@2 D-4 v2/);
    assert.deepEqual(parseEmbed(text), { id: 7, mode: 'pinned', version: 2 });
    const doc = docOf([cap, p('x'), { type: 'paragraph', content: [{ type: 'text', text: 'Figure 5: D-9 Other (v1)' }] }]);
    assert.equal(numberFigures(doc), 2);
    assert.match(plainText(doc.content![0]), /^Figure 1: D-4 /);
    assert.match(plainText(doc.content![2]), /^Figure 2: D-9 /);
  });
});
