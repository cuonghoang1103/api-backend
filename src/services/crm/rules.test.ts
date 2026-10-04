/**
 * CRM đợt S5b — luật thuần: chuyển giai đoạn, xác suất/dự báo, đồng bộ phiếu↔deal,
 * chấm go/no-go, hash chấp thuận đề xuất, báo cáo. Không cần CSDL.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  PACKAGE_IDS, buildReport, checkDecision, checkStageChange, columnTotals, composeProposalMarkdown, effectiveProbability,
  isStale, maxFunnelIndex, normalizeSource, packageIdFromSource, proposalHash, proposalLinkState, requestStatusForStage,
  scoreQualification, stageForRequestStatus, stripTemplateGuidance, weightedValue, type DealNumbers,
} from './rules.js';

test('xác suất: mặc định theo giai đoạn, ghi đè được, WON/LOST cố định', () => {
  assert.equal(effectiveProbability('LEAD', null), 10);
  assert.equal(effectiveProbability('PROPOSAL', null), 60);
  assert.equal(effectiveProbability('PROPOSAL', 35), 35);
  assert.equal(effectiveProbability('PROPOSAL', 150), 100);
  assert.equal(effectiveProbability('WON', 20), 100);
  assert.equal(effectiveProbability('LOST', 90), 0);
  assert.equal(weightedValue(100_000_000, 'NEGOTIATION', null), 80_000_000);
  assert.equal(weightedValue(null, 'NEGOTIATION', null), 0);
});

test('chuyển giai đoạn: lý do thua, cổng go/no-go, khoá WON khi đã có dự án', () => {
  assert.deepEqual(checkStageChange('LEAD', 'LEAD'), { ok: true, noop: true });
  assert.equal(checkStageChange('LEAD', 'QUALIFIED').ok, true);
  const gated = checkStageChange('QUALIFIED', 'DISCOVERY', { decision: null });
  assert.equal(gated.ok, false);
  assert.equal(!gated.ok && gated.code, 'CRM_QUALIFICATION_REQUIRED');
  assert.equal(checkStageChange('QUALIFIED', 'DISCOVERY', { decision: 'GO' }).ok, true);
  assert.equal(checkStageChange('QUALIFIED', 'PROPOSAL', { decision: 'GO_CONDITIONAL' }).ok, true);
  // Nhảy cóc LEAD → WON vẫn phải qua cổng.
  assert.equal(checkStageChange('LEAD', 'WON', { decision: null }).ok, false);
  const nogo = checkStageChange('QUALIFIED', 'PROPOSAL', { decision: 'NO_GO' });
  assert.equal(!nogo.ok && /NO-GO/.test(nogo.message), true);
  const lost = checkStageChange('PROPOSAL', 'LOST', { lostReason: '  ' });
  assert.equal(!lost.ok && lost.code, 'CRM_LOST_REASON_REQUIRED');
  assert.equal(checkStageChange('PROPOSAL', 'LOST', { lostReason: 'Chọn bên khác' }).ok, true);
  // NO_GO vẫn được đánh LOST.
  assert.equal(checkStageChange('QUALIFIED', 'LOST', { decision: 'NO_GO', lostReason: 'No-go' }).ok, true);
  const locked = checkStageChange('WON', 'NEGOTIATION', { decision: 'GO', projectCreated: true });
  assert.equal(!locked.ok && locked.code, 'CRM_DEAL_LOCKED');
  // Lùi được khi chưa có dự án.
  assert.equal(checkStageChange('WON', 'NEGOTIATION', { decision: 'GO' }).ok, true);
  assert.equal(checkStageChange('LEAD', 'NOPE').ok, false);
});

test('đồng bộ deal ⇒ phiếu', () => {
  assert.equal(requestStatusForStage('LEAD', 'NEW'), null);
  assert.equal(requestStatusForStage('QUALIFIED', 'NEW'), 'QUALIFYING');
  assert.equal(requestStatusForStage('DISCOVERY', 'QUALIFYING'), 'ACCEPTED');
  assert.equal(requestStatusForStage('WON', 'ACCEPTED'), null);
  assert.equal(requestStatusForStage('LOST', 'ACCEPTED'), 'DECLINED');
  assert.equal(requestStatusForStage('LEAD', 'ACCEPTED'), 'NEW');
  // Phiếu đã thành dự án: khoá.
  assert.equal(requestStatusForStage('LOST', 'PROJECT_CREATED'), null);
});

test('đồng bộ phiếu ⇒ deal: chỉ đẩy tới', () => {
  assert.equal(stageForRequestStatus('LEAD', 'QUALIFYING'), 'QUALIFIED');
  assert.equal(stageForRequestStatus('PROPOSAL', 'QUALIFYING'), null);
  assert.equal(stageForRequestStatus('QUALIFIED', 'ACCEPTED'), 'DISCOVERY');
  assert.equal(stageForRequestStatus('NEGOTIATION', 'ACCEPTED'), null);
  assert.equal(stageForRequestStatus('PROPOSAL', 'DECLINED'), 'LOST');
  assert.equal(stageForRequestStatus('WON', 'DECLINED'), null);
  assert.equal(stageForRequestStatus('LOST', 'ACCEPTED'), null);
  assert.equal(stageForRequestStatus('LOST', 'PROJECT_CREATED'), 'WON');
  assert.equal(stageForRequestStatus('WON', 'PROJECT_CREATED'), null);
  assert.equal(stageForRequestStatus('DISCOVERY', 'NEW'), null);
  // Khứ hồi không dao động: phiếu ACCEPTED ⇒ DISCOVERY ⇒ phiếu vẫn ACCEPTED (không ghi lại).
  assert.equal(requestStatusForStage(stageForRequestStatus('LEAD', 'ACCEPTED')!, 'ACCEPTED'), null);
});

test('nguồn + gói từ trường source của phiếu', () => {
  assert.equal(packageIdFromSource('about/nhan-du-an#goi=tro-ly-ai-rag'), 'tro-ly-ai-rag');
  assert.equal(packageIdFromSource('about/nhan-du-an'), null);
  assert.equal(normalizeSource('about/nhan-du-an#goi=lms'), 'about/nhan-du-an');
  assert.equal(normalizeSource(null), '(manual)');
});

test('PACKAGE_IDS khớp frontend packages.ts', () => {
  const src = fs.readFileSync(path.resolve('frontend/src/app/about/nhan-du-an/packages.ts'), 'utf8');
  const ids = [...src.matchAll(/^\s{4}id: '([a-z0-9-]+)'/gm)].map((m) => m[1]);
  assert.deepEqual([...ids].sort(), [...PACKAGE_IDS].sort());
});

test('bảng go/no-go: luật cứng 7/8/9, ngưỡng 15/10, quyết định hợp lệ', () => {
  const all = (v: number) => Object.fromEntries(Array.from({ length: 10 }, (_, i) => [String(i + 1), v]));
  assert.equal(scoreQualification(all(2)).suggestion, 'GO');
  assert.equal(scoreQualification(all(2)).total, 20);
  assert.equal(scoreQualification({ ...all(2), 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }).suggestion, 'GO'); // 15
  assert.equal(scoreQualification(all(1)).suggestion, 'GO_CONDITIONAL'); // 10
  assert.equal(scoreQualification({ ...all(1), 1: 0 }).suggestion, 'NO_GO'); // 9
  const hard = scoreQualification({ ...all(2), 8: 0 });
  assert.equal(hard.hardFail, true);
  assert.equal(hard.suggestion, 'NO_GO');
  assert.equal(scoreQualification({ 1: 2 }).suggestion, null);
  assert.equal(scoreQualification({ 9: 0 }).suggestion, 'NO_GO');
  // Quyết định:
  const c1 = checkDecision('GO', hard);
  assert.equal(!c1.ok && c1.code, 'CRM_HARD_FAIL');
  const c2 = checkDecision('GO', scoreQualification({ 1: 2 }));
  assert.equal(!c2.ok && c2.code, 'CRM_CHECKLIST_INCOMPLETE');
  const c3 = checkDecision('GO_CONDITIONAL', scoreQualification(all(1)), '');
  assert.equal(!c3.ok && c3.code, 'CRM_CONDITIONS_REQUIRED');
  assert.equal(checkDecision('GO_CONDITIONAL', scoreQualification(all(1)), 'Tách MVP').ok, true);
  assert.equal(checkDecision('NO_GO', scoreQualification({})).ok, true);
  // Người chấm được quyết khác gợi ý (vd tổng 20 nhưng vẫn NO_GO) — trừ luật cứng.
  assert.equal(checkDecision('NO_GO', scoreQualification(all(2))).ok, true);
});

test('hash đề xuất: ổn định, nhạy với nội dung/phiên bản, bỏ qua CRLF', () => {
  const base = { dealId: 7, version: 2, title: 'Đề xuất', content: 'Dòng 1\nDòng 2' };
  const h = proposalHash(base);
  assert.match(h, /^[0-9a-f]{64}$/);
  assert.equal(proposalHash({ ...base }), h);
  assert.equal(proposalHash({ ...base, content: 'Dòng 1\r\nDòng 2' }), h);
  assert.notEqual(proposalHash({ ...base, content: 'Dòng 1\nDòng 2 ' }), h);
  assert.notEqual(proposalHash({ ...base, version: 3 }), h);
  assert.notEqual(proposalHash({ ...base, dealId: 8 }), h);
  assert.notEqual(proposalHash({ ...base, title: 'Khác' }), h);
});

test('trạng thái link đề xuất', () => {
  const now = new Date('2026-10-05T00:00:00Z');
  const future = new Date('2026-11-01T00:00:00Z');
  const past = new Date('2026-10-01T00:00:00Z');
  assert.equal(proposalLinkState({ status: 'DRAFT', tokenExpiresAt: null, tokenRevokedAt: null }, now), 'NOT_SENT');
  assert.equal(proposalLinkState({ status: 'SENT', tokenExpiresAt: future, tokenRevokedAt: null }, now), 'OK');
  assert.equal(proposalLinkState({ status: 'SENT', tokenExpiresAt: past, tokenRevokedAt: null }, now), 'EXPIRED');
  assert.equal(proposalLinkState({ status: 'SENT', tokenExpiresAt: future, tokenRevokedAt: past }, now), 'REVOKED');
  // Đã trả lời: vẫn xem lại được sau hạn (bằng chứng cho khách).
  assert.equal(proposalLinkState({ status: 'ACCEPTED', tokenExpiresAt: past, tokenRevokedAt: null }, now), 'OK');
});

test('soạn đề xuất từ mẫu: bỏ hướng dẫn nội bộ, điền phần đầu', () => {
  const tp = fs.readFileSync(path.resolve('content/quy-trinh/mau/de-xuat-giai-phap.md'), 'utf8');
  const tq = fs.readFileSync(path.resolve('content/quy-trinh/mau/bao-gia.md'), 'utf8');
  const md = composeProposalMarkdown(tp, tq, { dealTitle: 'Phòng khám A — YC-2026-0003', orgName: 'Phòng khám A', requestCode: 'YC-2026-0003', version: 1, date: '2026-10-05' });
  assert.match(md, /^# Phòng khám A — YC-2026-0003/);
  assert.match(md, /\| YC-2026-0003 \| Phòng khám A \| v1 \| 2026-10-05 \|/);
  assert.doesNotMatch(md, /\*\*Ai điền:\*\*/);
  assert.doesNotMatch(md, /Mẫu tham khảo —/);
  assert.match(md, /## 3\. Các phương án/);
  assert.match(md, /# Báo giá/);
  assert.doesNotMatch(md, /## 0\. Thông tin\n/);
  assert.match(md, /## 0\. Thông tin báo giá/);
  assert.doesNotMatch(md, /CẦN KẾ TOÁN VÀ LUẬT SƯ/);
  assert.doesNotMatch(md, /^>/m);
  assert.equal(stripTemplateGuidance('# T\n\n> **Mục đích:** x\n\n---\n\n## A\nb'), '## A\nb');
});

test('stale: deal mở quá 14 ngày không hoạt động', () => {
  const now = new Date('2026-10-20T00:00:00Z');
  assert.equal(isStale('PROPOSAL', new Date('2026-10-05T00:00:00Z'), now), true);
  assert.equal(isStale('PROPOSAL', new Date('2026-10-07T00:00:00Z'), now), false);
  assert.equal(isStale('WON', new Date('2026-01-01T00:00:00Z'), now), false);
  assert.equal(isStale('LOST', new Date('2026-01-01T00:00:00Z'), now), false);
});

test('tổng cột Kanban tách theo tiền tệ', () => {
  const t = columnTotals([
    { stage: 'PROPOSAL', value: 100, currency: 'VND', probability: null },
    { stage: 'PROPOSAL', value: 50, currency: 'USD', probability: 50 },
    { stage: 'PROPOSAL', value: null, currency: 'VND', probability: null },
    { stage: 'LEAD', value: 200, currency: 'VND', probability: null },
  ]);
  assert.equal(t.PROPOSAL.count, 3);
  assert.deepEqual(t.PROPOSAL.total, { VND: 100, USD: 50 });
  assert.deepEqual(t.PROPOSAL.weighted, { VND: 60, USD: 25 });
  assert.deepEqual(t.LEAD.weighted, { VND: 20 });
  assert.equal(t.WON.count, 0);
});

test('báo cáo: phễu theo bậc cao nhất, win rate, chu kỳ, nguồn, dự báo tháng', () => {
  const d = (o: Partial<DealNumbers> & { id: number; stage: string }): DealNumbers => ({
    value: null, currency: 'VND', probability: null, source: 'about/nhan-du-an', packageId: null,
    createdAt: new Date('2026-09-01T00:00:00Z'), wonAt: null, lostAt: null, expectedCloseAt: null, stagesVisited: ['LEAD'], ...o,
  });
  const deals = [
    d({ id: 1, stage: 'WON', stagesVisited: ['LEAD', 'QUALIFIED', 'PROPOSAL', 'WON'], wonAt: new Date('2026-09-11T00:00:00Z'), value: 100, source: 'about/nhan-du-an#goi=lms' }),
    d({ id: 2, stage: 'LOST', stagesVisited: ['LEAD', 'QUALIFIED', 'DISCOVERY', 'LOST'], lostAt: new Date('2026-09-20T00:00:00Z') }),
    d({ id: 3, stage: 'PROPOSAL', stagesVisited: ['LEAD', 'QUALIFIED', 'PROPOSAL'], value: 200, expectedCloseAt: new Date('2026-11-15T00:00:00Z') }),
    d({ id: 4, stage: 'LEAD', value: 1000, source: 'manual', expectedCloseAt: new Date('2026-11-01T00:00:00Z') }),
    d({ id: 5, stage: 'NEGOTIATION', stagesVisited: ['LEAD', 'NEGOTIATION'], value: 50, probability: 50 }),
  ];
  assert.equal(maxFunnelIndex(['LEAD', 'QUALIFIED', 'DISCOVERY', 'LOST']), 2);
  const r = buildReport(deals);
  assert.deepEqual(r.funnel.map((f) => f.reached), [5, 4, 4, 3, 2, 1]);
  assert.equal(r.funnel[0].conversionToNext, 0.8);
  assert.equal(r.funnel[4].conversionToNext, 0.5);
  assert.equal(r.funnel[5].conversionToNext, null);
  assert.equal(r.won, 1);
  assert.equal(r.lost, 1);
  assert.equal(r.open, 3);
  assert.equal(r.winRate, 0.5);
  assert.equal(r.avgCycleDays, 10);
  const web = r.sources.find((s) => s.source === 'about/nhan-du-an')!;
  assert.equal(web.deals, 4);
  assert.equal(web.won, 1);
  assert.deepEqual(web.wonValue, { VND: 100 });
  assert.equal(r.sources[0].source, 'about/nhan-du-an');
  assert.deepEqual(r.packages, [{ packageId: 'lms', deals: 1, won: 1 }]);
  assert.deepEqual(r.forecast, [{ month: '2026-11', deals: 2, total: { VND: 1200 }, weighted: { VND: 220 } }]);
  assert.deepEqual(r.unscheduled, { deals: 1, weighted: { VND: 25 } });
  // Không có deal đóng ⇒ win rate null.
  assert.equal(buildReport([deals[2]]).winRate, null);
});
