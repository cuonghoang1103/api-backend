/**
 * CT Work đợt S6 — luật thuần Spec Fidelity: từ mơ hồ VI + EN, câu đo được, acceptance criteria, câu yêu cầu trong
 * trang, tính điểm, cổng chặn/qua, nguồn gốc AI (trailer Co-Authored-By), duyệt độc lập. Chạy trong `npm test`.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  acceptanceCriteria, aiCoAuthorIn, analyze, appendAcceptanceCriteria, computeScores, evaluateGate, findVagueTerms, gateAppliesTo,
  hasEdgeCase, independentApprovalOk, isMeasurable, isRequirementStatement, mentionsQuality, pageStatements, replaceTextInDoc,
  requirementLabel, sanitizeAiFindings, specGateOf, splitSentences, type Finding, type SpecItem,
} from './specFidelity.js';

const terms = (s: string) => findVagueTerms(s).map((h) => h.match.toLowerCase());
const P = (t: string) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] });
const H = (t: string, level = 2) => ({ type: 'heading', attrs: { level }, content: [{ type: 'text', text: t }] });
const item = (over: Partial<SpecItem> & { ref: string; text: string }): SpecItem => ({
  kind: 'ISSUE', hasAcceptanceCriteria: true, acceptanceCriteriaCount: 2, testCount: 1, hasEdgeCase: true, ...over,
});

describe('S6 — từ mơ hồ (EN)', () => {
  it('bắt cụm dài thay vì cụm ngắn bên trong', () => {
    assert.deepEqual(terms('The dashboard should be fast.'), ['should be fast']);
    assert.deepEqual(terms('The UI must be user-friendly and intuitive, etc.'), ['user-friendly', 'intuitive', 'etc.']);
  });
  it('TBD/TODO chỉ tính khi viết hoa; "todo list" không phải chỗ trống', () => {
    assert.deepEqual(terms('Price rules: TBD'), ['tbd']);
    assert.deepEqual(terms('Users manage a todo list'), []);
  });
  it('không bắt từ nằm trong từ khác (breakfast, steady)', () => {
    assert.deepEqual(terms('The breakfast menu shall list 10 dishes.'), []);
    assert.deepEqual(terms('Admins may export reports and/or invoices'), ['may', 'and/or']);
  });
});

describe('S6 — từ mơ hồ (VI, không dùng \\b)', () => {
  it('nhanh / thân thiện / v.v. / tuỳ / có thể', () => {
    assert.deepEqual(terms('Hệ thống phải nhanh và thân thiện với người dùng.'), ['phải nhanh', 'thân thiện với người dùng']);
    assert.deepEqual(terms('Hỗ trợ thanh toán Momo, ZaloPay, v.v.'), ['v.v.']);
    assert.deepEqual(terms('Phí giao hàng tuỳ khu vực.'), ['tuỳ']);
    assert.deepEqual(terms('Phí giao hàng tùy trường hợp.'), ['tùy trường hợp']);
    assert.deepEqual(terms('Người dùng có thể đăng nhập bằng Google.'), ['có thể']);
  });
  it('"nhanh" không khớp trong "nhanhchóng" hay "chi nhánh"', () => {
    assert.deepEqual(terms('Quản lý chi nhánh cửa hàng'), []);
    assert.deepEqual(terms('Trang tải nhanh'), ['nhanh']);
  });
  it('NFC: chữ tổ hợp (NFD) vẫn khớp', () => {
    assert.deepEqual(terms('Giao diện thân thiện'.normalize('NFD')), ['thân thiện']);
  });
});

describe('S6 — đo được · chất lượng · edge case', () => {
  it('có số + đơn vị ⇒ đo được', () => {
    assert.equal(isMeasurable('Search returns results within 2 seconds'), true);
    assert.equal(isMeasurable('Trang chủ tải trong 1,5 giây'), true);
    assert.equal(isMeasurable('p95 latency under load'), true);
    assert.equal(isMeasurable('Supports 500 concurrent users'), true);
    assert.equal(isMeasurable('The page loads fast'), false);
    assert.equal(isMeasurable('Version 2 of the API'), false);
  });
  it('nói về chất lượng', () => {
    assert.equal(mentionsQuality('The system shall be secure'), true);
    assert.equal(mentionsQuality('Hệ thống phải ổn định'), true);
    assert.equal(mentionsQuality('Users can add items to the cart'), false);
  });
  it('edge case', () => {
    assert.equal(hasEdgeCase('Unhappy: wrong password shows an error'), true);
    assert.equal(hasEdgeCase('Nếu mã giảm giá hết hạn thì báo lỗi'), true);
    assert.equal(hasEdgeCase('User sees the dashboard'), false);
  });
});

describe('S6 — acceptance criteria', () => {
  it('Given/When/Then, Happy:/Unhappy:, mục "Acceptance criteria", Tiêu chí chấp nhận', () => {
    assert.equal(acceptanceCriteria('Given a cart\nWhen I pay\nThen I get a receipt').has, true);
    const swp = acceptanceCriteria('Login screen\nHappy: valid login opens Home\nUnhappy: wrong password\nUnhappy: locked account');
    assert.equal(swp.count, 3);
    assert.equal(swp.unhappy, 2);
    assert.equal(acceptanceCriteria('Story text\nAcceptance criteria\n- shows a list\n- sorts by date').count, 2);
    assert.equal(acceptanceCriteria('Mô tả\nTiêu chí chấp nhận:\n1. Hiện danh sách').has, true);
  });
  it('mô tả thường không có AC; taskItem của TipTap được đếm', () => {
    assert.equal(acceptanceCriteria('As a user I want to log in so that I can see my orders.').has, false);
    assert.equal(acceptanceCriteria('Login', 2).count, 2);
  });
});

describe('S6 — câu yêu cầu trong trang', () => {
  it('nhận câu có shall/phải/mã FR, bỏ mục lịch sử/thuật ngữ', () => {
    assert.equal(isRequirementStatement('The system shall send a receipt by email.'), true);
    assert.equal(isRequirementStatement('Hệ thống phải gửi hoá đơn qua email.'), true);
    assert.equal(isRequirementStatement('FR-02 Export orders to CSV'), true);
    assert.equal(isRequirementStatement('This document describes the shop.'), false);
    assert.equal(isRequirementStatement('The admin shall approve it.', 'Revision history'), false);
    assert.equal(requirementLabel('FR 3.1: Login'), 'FR-3.1');
  });
  it('tách câu không cắt "v.v." hay số thập phân', () => {
    assert.deepEqual(splitSentences('Tải trong 1.5 giây. Hỗ trợ Momo, v.v. Xong'), ['Tải trong 1.5 giây.', 'Hỗ trợ Momo, v.v. Xong']);
  });
  it('pageStatements: đoạn + hàng bảng, giữ tiêu đề và chỉ số khối', () => {
    const doc = {
      type: 'doc', content: [
        H('1. Purpose'), P('This SRS describes the shop.'),
        H('3. Functional requirements'), P('FR-01 The system shall show products. FR-02 The cart should be fast.'),
        { type: 'table', content: [
          { type: 'tableRow', content: [{ type: 'tableHeader', content: [P('ID')] }, { type: 'tableHeader', content: [P('Requirement')] }] },
          { type: 'tableRow', content: [{ type: 'tableCell', content: [P('FR-03')] }, { type: 'tableCell', content: [P('Users can pay by card')] }] },
        ] },
      ],
    };
    const r = pageStatements(doc);
    assert.deepEqual(r.statements.map((s) => s.label), ['FR-01', 'FR-02', 'FR-03']);
    assert.equal(r.statements[1].block.index, 1);
    assert.equal(r.statements[2].block.type, 'tableRow');
    assert.deepEqual(r.headings, ['1. Purpose', '3. Functional requirements']);
  });
});

describe('S6 — phân tích + điểm', () => {
  it('thẻ thiếu AC / thiếu test / mô tả rỗng / trùng ⇒ đúng chiều', () => {
    const r = analyze({
      scope: 'ISSUES', testingEnabled: true,
      items: [
        item({ ref: 'SH-1', title: 'Customer logs in with email', text: '', hasAcceptanceCriteria: false, testCount: 0, hasEdgeCase: false }),
        item({ ref: 'SH-2', title: 'Customer logs in with email', text: 'Happy: ok\nUnhappy: wrong password', hasEdgeCase: true }),
        item({ ref: 'SH-3', title: 'Checkout page', text: 'Happy: pay', hasEdgeCase: false }),
      ],
    });
    const rules = r.findings.map((f) => `${f.ref}:${f.rule}:${f.dimension}`);
    assert.ok(rules.includes('SH-1:empty_description:completeness'));
    assert.ok(rules.includes('SH-1:missing_ac:verifiability'));
    assert.ok(rules.includes('SH-1:no_test:verifiability'));
    assert.ok(rules.includes('SH-2:duplicate:consistency'));
    assert.ok(rules.includes('SH-3:no_edge_case:completeness'));
    assert.deepEqual(r.untraced.map((u) => u.ref), ['SH-1']);
    assert.equal(r.stats.acPct, 67);
    assert.equal(r.stats.testPct, 67);
  });
  it('quản lý test tắt ⇒ không đẻ phát hiện no_test (nhưng vẫn liệt kê chưa truy được)', () => {
    const r = analyze({ scope: 'ISSUES', testingEnabled: false, items: [item({ ref: 'A-1', title: 'X y z w', text: 'Happy: a\nUnhappy: b', testCount: 0 })] });
    assert.equal(r.findings.some((f) => f.rule === 'no_test'), false);
    assert.equal(r.untraced.length, 1);
  });
  it('trang mơ hồ điểm thấp hơn trang đã sửa; gợi ý viết lại có số', () => {
    const page = (fast: string) => {
      const doc = { type: 'doc', content: [
        H('Purpose'), P('Shop for students.'),
        H('Functional requirements'), P(`FR-01 The product page ${fast}`), P('FR-02 If payment fails, the system shall show an error and keep the cart.'),
        H('Non-functional requirements'), P('NFR-01 The site shall be available 99.5% of the month.'),
        H('Constraints'), P('Runs on the existing VPS.'),
        H('Acceptance criteria'), P('FR-01 and FR-02 are verified by tests SH-7.'),
      ] };
      const { statements, headings } = pageStatements(doc);
      const items: SpecItem[] = statements.map((s, i) => ({
        ref: s.label ?? `S${i + 1}`, kind: 'STATEMENT', text: s.sentence, heading: s.block.heading, blockIndex: s.block.index, label: s.label,
        hasAcceptanceCriteria: isMeasurable(s.sentence) || /FR-0[12]/.test(s.label ?? ''), acceptanceCriteriaCount: 1, testCount: 0, hasEdgeCase: hasEdgeCase(s.sentence),
      }));
      return analyze({ scope: 'PAGE', items, headings, pageNumber: 4, testingEnabled: true });
    };
    const bad = page('should be fast and user-friendly, etc.');
    const good = page('shall load within 2 seconds for 95% of requests.');
    const sBad = computeScores(bad.findings, bad.stats);
    const sGood = computeScores(good.findings, good.stats);
    assert.ok(sBad.unambiguity < sGood.unambiguity, `${sBad.unambiguity} < ${sGood.unambiguity}`);
    assert.ok(sBad.overall < sGood.overall);
    const fast = bad.findings.find((f) => f.rule === 'vague_term' && /fast/.test(f.why))!;
    assert.match(fast.rewrite!, /within 2 seconds/);
    assert.deepEqual(fast.target, { kind: 'PAGE', pageNumber: 4, blockIndex: 1 });
    assert.ok(!good.findings.some((f) => f.rule === 'missing_section'));
  });
  it('mã yêu cầu định nghĩa hai lần ⇒ consistency cao', () => {
    const doc = { type: 'doc', content: [H('Functional requirements'), P('FR-01 The system shall list orders.'), P('FR-01 The system shall delete orders.')] };
    const { statements, headings } = pageStatements(doc);
    const items: SpecItem[] = statements.map((s) => ({ ref: s.label!, kind: 'STATEMENT', text: s.sentence, blockIndex: s.block.index, label: s.label, hasAcceptanceCriteria: false, acceptanceCriteriaCount: 0, testCount: 0, hasEdgeCase: false }));
    const r = analyze({ scope: 'PAGE', items, headings, pageNumber: 1, testingEnabled: false });
    assert.ok(r.findings.some((f) => f.rule === 'duplicate_id' && f.severity === 'high'));
    assert.ok(r.findings.some((f) => f.rule === 'no_failure_modes'));
  });
  it('không có yêu cầu ⇒ mọi chiều 0', () => {
    const r = analyze({ scope: 'PAGE', items: [], headings: [], pageNumber: 2, testingEnabled: false });
    assert.equal(r.findings[0].rule, 'no_requirements');
    assert.deepEqual(computeScores(r.findings, r.stats), { completeness: 0, consistency: 0, unambiguity: 0, verifiability: 0, overall: 0, verifiabilityRules: 0 });
  });
  it('công thức: hệ số cỡ, phát hiện đã áp dụng không trừ, verifiability trộn 40/30/30, trần AI', () => {
    const f = (o: Partial<Finding>): Finding => ({ id: 'x', dimension: 'unambiguity', severity: 'high', rule: 'vague_term', ref: 'A', excerpt: '', why: '', suggestion: '', rewrite: null, target: null, source: 'rule', status: 'open', ...o });
    // 10 yêu cầu: một lỗi cao = −15
    assert.equal(computeScores([f({})], { items: 10, acPct: 100, testPct: 100 }).unambiguity, 85);
    // 20 yêu cầu: cùng lỗi = −7.5
    assert.equal(computeScores([f({})], { items: 20, acPct: 100, testPct: 100 }).unambiguity, 93);
    assert.equal(computeScores([f({ status: 'applied' })], { items: 10, acPct: 100, testPct: 100 }).unambiguity, 100);
    // verifiability: 0.4*50 + 0.3*0 + 0.3*100 = 50 (missing_ac không trừ hai lần)
    assert.equal(computeScores([f({ dimension: 'verifiability', rule: 'missing_ac' })], { items: 10, acPct: 50, testPct: 0 }).verifiability, 50);
    const many = Array.from({ length: 10 }, () => f({ source: 'ai', dimension: 'consistency' }));
    assert.equal(computeScores(many, { items: 10, acPct: 100, testPct: 100 }).consistency, 60);
    const s = computeScores([], { items: 3, acPct: 100, testPct: 100 });
    assert.equal(s.overall, 100);
  });
});

describe('S6 — cổng Spec Fidelity', () => {
  it('mặc định TẮT, 70/50, giai đoạn dac-ta-yeu-cau', () => {
    const c = specGateOf({});
    assert.deepEqual(c, { enabled: false, stageIds: [], minOverall: 70, minDimension: 50 });
    assert.equal(gateAppliesTo({ ...c, enabled: true }, { id: 3, slug: 'dac-ta-yeu-cau' }), true);
    assert.equal(gateAppliesTo({ ...c, enabled: true }, { id: 4, slug: 'thiet-ke-ux-ui' }), false);
    assert.equal(gateAppliesTo({ ...c, enabled: true, stageIds: [4] }, { id: 4, slug: 'thiet-ke-ux-ui' }), true);
    assert.equal(gateAppliesTo(c, { id: 3, slug: 'dac-ta-yeu-cau' }), false);
    assert.equal(specGateOf({ specGate: { enabled: true, minOverall: 150, minDimension: -3 } }).minOverall, 100);
  });
  it('chưa chạy ⇒ chặn; dưới ngưỡng tổng hoặc một chiều ⇒ chặn kèm lý do; đủ ⇒ qua', () => {
    const cfg = { minOverall: 70, minDimension: 50 };
    assert.equal(evaluateGate(null, cfg).pass, false);
    const low = evaluateGate({ overall: 72, completeness: 90, consistency: 90, unambiguity: 45, verifiability: 63 }, cfg);
    assert.equal(low.pass, false);
    assert.deepEqual(low.reasons, ['Unambiguity 45 is below 50']);
    assert.equal(evaluateGate({ overall: 65, completeness: 70, consistency: 70, unambiguity: 60, verifiability: 60 }, cfg).reasons[0], 'Overall 65 is below 70');
    assert.equal(evaluateGate({ overall: 80, completeness: 80, consistency: 80, unambiguity: 80, verifiability: 80 }, cfg).pass, true);
  });
});

describe('S6 — nguồn gốc AI', () => {
  it('trailer Co-Authored-By của model AI', () => {
    assert.equal(aiCoAuthorIn('fix: login\n\nCo-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>'), 'Claude Opus 5.5 (1M context)');
    assert.equal(aiCoAuthorIn('feat\n\nco-authored-by: GitHub Copilot <copilot@github.com>'), 'GitHub Copilot');
    assert.equal(aiCoAuthorIn('feat\n\nCo-authored-by: Lan Nguyen <lan@example.com>'), null);
    assert.equal(aiCoAuthorIn('mentions Claude in the body but no trailer'), null);
  });
  it('duyệt độc lập: người tạo/người áp dụng không tính; chữ ký phải còn khớp', () => {
    const steps = (ids: number[]) => ids.map((approverId) => ({ approverId, decision: 'APPROVED' }));
    assert.equal(independentApprovalOk([{ signedHash: 'h', steps: steps([1]) }], 'h', [1, 2]), false);
    assert.equal(independentApprovalOk([{ signedHash: 'h', steps: steps([3]) }], 'h', [1, 2]), true);
    assert.equal(independentApprovalOk([{ signedHash: 'old', steps: steps([3]) }], 'new', [1]), false);
    assert.equal(independentApprovalOk([], 'h', [1]), false);
  });
});

describe('S6 — áp dụng gợi ý + lọc nhận xét AI', () => {
  it('thay câu trong trang, giữ khối khác', () => {
    const doc = { type: 'doc', content: [H('Req'), P('FR-01 The cart should be fast.'), P('Other.')] };
    const r = replaceTextInDoc(doc, 'The cart should be fast.', 'The cart shall respond within 2 seconds.');
    assert.equal(r.found, true);
    assert.equal((r.doc.content![1].content![0] as { text: string }).text, 'FR-01 The cart shall respond within 2 seconds.');
    assert.equal(replaceTextInDoc(doc, 'missing text', 'x').found, false);
  });
  it('thêm khối Acceptance criteria', () => {
    const d = appendAcceptanceCriteria({ type: 'doc', content: [P('Story')] }, ['Happy: a', ' ', 'Unhappy: b']);
    assert.equal(d.content!.length, 3);
    assert.equal(d.content![2].content!.length, 2);
  });
  it('nhận xét AI: bỏ ref bịa, trích dẫn không có thật, chiều verifiability', () => {
    const items: SpecItem[] = [{ ref: 'FR-01', kind: 'STATEMENT', text: 'The cart keeps items for 7 days.', blockIndex: 2, hasAcceptanceCriteria: true, acceptanceCriteriaCount: 1, testCount: 0, hasEdgeCase: false }];
    const out = sanitizeAiFindings([
      { dimension: 'consistency', severity: 'high', ref: 'FR-01', excerpt: 'keeps items for 7 days', why: 'Conflicts with NFR-02 (30 days).', rewrite: 'The cart keeps items for 30 days.' },
      { dimension: 'consistency', ref: 'FR-99', excerpt: 'x', why: 'made up' },
      { dimension: 'completeness', ref: 'FR-01', excerpt: 'not in the text', why: 'bịa trích dẫn' },
      { dimension: 'verifiability', ref: 'FR-01', why: 'model không được chấm phần dữ liệu' },
    ], items, { pageNumber: 5 });
    assert.equal(out.length, 1);
    assert.equal(out[0].source, 'ai');
    assert.deepEqual(out[0].target, { kind: 'PAGE', pageNumber: 5, blockIndex: 2 });
  });
});
