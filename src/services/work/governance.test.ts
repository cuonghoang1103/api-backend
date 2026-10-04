/**
 * Luật thuần của đợt S3b (CR · RAID · họp) + iCalendar RFC 5545 + luật RAG mới của portfolio
 * + danh sách trắng cổng khách cho tuyến mới. Không chạm DB — chạy trong `npm test`.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  crCanRequestApproval, crManualTransitionAllowed, crStatusAfterApproval, crTotals, meetingProvider, meetingTimeError,
  raidStatusesFor, reviewDue, riskLevel, riskMatrix, riskScore, splitKickoffTemplate, starterRisksFromTemplate, validTimezone,
} from './governance.js';
import { icsDocument, icsEscape, icsFold, meetingEventLines } from './ics.js';
import { canDeleteGovernance, clientPortalRouteAllowed, governanceAccess } from './permissions.js';
import { RAG_RULES, ragOf, type RagInput } from './portfolioRules.js';
import { clientEmailContent } from './portalNotify.js';
import { defaultModulesFor } from './studio.js';

describe('CR — vòng đời', () => {
  it('chuyển tay chỉ Draft ⇄ Submitted, Rejected → Draft, Approved → Implemented', () => {
    assert.ok(crManualTransitionAllowed('DRAFT', 'SUBMITTED'));
    assert.ok(crManualTransitionAllowed('SUBMITTED', 'DRAFT'));
    assert.ok(crManualTransitionAllowed('REJECTED', 'DRAFT'));
    assert.ok(crManualTransitionAllowed('APPROVED', 'IMPLEMENTED'));
    // Trạng thái duyệt chỉ do phê duyệt đặt.
    for (const to of ['UNDER_REVIEW', 'APPROVED', 'REJECTED']) {
      for (const from of ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED']) {
        assert.equal(crManualTransitionAllowed(from, to), false, `${from} → ${to}`);
      }
    }
    assert.equal(crManualTransitionAllowed('IMPLEMENTED', 'DRAFT'), false);
    assert.equal(crManualTransitionAllowed('UNDER_REVIEW', 'DRAFT'), false);
  });
  it('gửi duyệt được từ DRAFT/SUBMITTED; kết quả phê duyệt ⇒ trạng thái CR', () => {
    assert.deepEqual(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED'].map(crCanRequestApproval), [true, true, false, false]);
    assert.equal(crStatusAfterApproval('APPROVED'), 'APPROVED');
    assert.equal(crStatusAfterApproval('REJECTED'), 'REJECTED');
    assert.equal(crStatusAfterApproval('CANCELLED'), 'SUBMITTED');
  });
  it('tổng sổ CR: chỉ CR đã duyệt/đã làm; chi phí gộp theo đơn vị ghi tự do, không quy đổi', () => {
    const t = crTotals([
      { status: 'APPROVED', scheduleDays: 5, costAmount: 1000, costCurrency: 'usd' },
      { status: 'IMPLEMENTED', scheduleDays: -2, costAmount: 500, costCurrency: 'USD' },
      { status: 'APPROVED', scheduleDays: null, costAmount: 3_000_000, costCurrency: 'VND' },
      { status: 'REJECTED', scheduleDays: 30, costAmount: 99, costCurrency: 'USD' },
      { status: 'UNDER_REVIEW', scheduleDays: 7, costAmount: 1, costCurrency: 'USD' },
      { status: 'SUBMITTED', scheduleDays: 1, costAmount: null, costCurrency: null },
    ]);
    assert.equal(t.approvedCount, 3);
    assert.equal(t.approvedDays, 3);
    assert.deepEqual(t.approvedCost, [{ currency: 'USD', amount: 1500 }, { currency: 'VND', amount: 3_000_000 }]);
    assert.equal(t.pending, 2);
  });
});

describe('RAID — điểm, mức, ma trận, xem lại', () => {
  it('điểm = L × I; mức theo so-dang-ky-rui-ro.md (≥15 cao, 8–14 trung bình, ≤7 thấp)', () => {
    assert.equal(riskScore(4, 5), 20);
    assert.equal(riskScore(null, 5), null);
    assert.deepEqual([riskLevel(20), riskLevel(15), riskLevel(14), riskLevel(8), riskLevel(7), riskLevel(null)], ['HIGH', 'HIGH', 'MEDIUM', 'MEDIUM', 'LOW', null]);
  });
  it('trạng thái theo loại — giả định có bộ riêng', () => {
    assert.deepEqual([...raidStatusesFor('ASSUMPTION')], ['UNVALIDATED', 'VALIDATED', 'INVALID']);
    assert.deepEqual([...raidStatusesFor('RISK')], ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED']);
  });
  it('ma trận 5×5 chỉ đếm RỦI RO chưa đóng, đã chấm điểm', () => {
    const m = riskMatrix([
      { type: 'RISK', status: 'OPEN', probability: 4, impact: 5 },
      { type: 'RISK', status: 'MONITORING', probability: 4, impact: 5 },
      { type: 'RISK', status: 'CLOSED', probability: 4, impact: 5 },
      { type: 'ISSUE', status: 'OPEN', probability: 4, impact: 5 },
      { type: 'RISK', status: 'OPEN', probability: null, impact: 5 },
      { type: 'RISK', status: 'OPEN', probability: 1, impact: 1 },
    ]);
    assert.equal(m[3][4], 2);
    assert.equal(m[0][0], 1);
    assert.equal(m.flat().reduce((a, b) => a + b, 0), 3);
  });
  it('review due: ngày xem lại ≤ hôm nay và chưa đóng', () => {
    assert.equal(reviewDue({ status: 'OPEN', reviewDate: '2026-10-04' }, '2026-10-04'), true);
    assert.equal(reviewDue({ status: 'OPEN', reviewDate: '2026-10-05' }, '2026-10-04'), false);
    assert.equal(reviewDue({ status: 'CLOSED', reviewDate: '2026-10-01' }, '2026-10-04'), false);
    assert.equal(reviewDue({ status: 'VALIDATED', reviewDate: '2026-10-01' }, '2026-10-04'), false);
    assert.equal(reviewDue({ status: 'OPEN', reviewDate: null }, '2026-10-04'), false);
  });
  it('rủi ro mẫu đọc từ bảng của so-dang-ky-rui-ro.md', () => {
    const md = '| ID | Ngày | Rủi ro | Nhóm | L | I | Mức | Chiến lược | Biện pháp | Trigger | Ai | TT | Cập nhật |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n| R01 | | Nếu khách chậm thì trễ | Phụ thuộc | | | | Giảm | Nhắc trước | Quá 2 ngày | PM | Mở | |\n| R02 | | Phụ thuộc một người | Nguồn lực | | | | Chấp nhận | | | PM | Mở | |';
    const r = starterRisksFromTemplate(md);
    assert.equal(r.length, 2);
    assert.deepEqual(r[0], { title: 'Nếu khách chậm thì trễ', category: 'Phụ thuộc', response: 'MITIGATE', mitigation: 'Nhắc trước', trigger: 'Quá 2 ngày' });
    assert.equal(r[1].response, 'ACCEPT');
  });
});

describe('Họp — giờ, múi giờ, link, mẫu kick-off', () => {
  it('kết thúc sau bắt đầu, ≤ 24 giờ', () => {
    const a = new Date('2026-10-05T02:00:00Z');
    assert.equal(meetingTimeError(a, new Date('2026-10-05T03:00:00Z')), null);
    assert.match(meetingTimeError(a, a) ?? '', /end after/);
    assert.match(meetingTimeError(a, new Date('2026-10-06T03:00:00Z')) ?? '', /24 hours/);
  });
  it('múi giờ IANA + nhận diện Meet/Zoom/Teams (chỉ nhãn, không gọi API)', () => {
    assert.equal(validTimezone('Asia/Ho_Chi_Minh'), true);
    assert.equal(validTimezone('Mars/Olympus'), false);
    assert.equal(meetingProvider('https://meet.google.com/abc-defg-hij'), 'MEET');
    assert.equal(meetingProvider('https://us02web.zoom.us/j/123'), 'ZOOM');
    assert.equal(meetingProvider('https://teams.microsoft.com/l/meetup-join/x'), 'TEAMS');
    assert.equal(meetingProvider('https://example.com/x'), 'OTHER');
    assert.equal(meetingProvider('not a url'), null);
  });
  it('mẫu kick-off tách thành chương trình + khung biên bản', () => {
    const md = '# Biên bản\n\n> **Mục đích:** x\n\n---\n\n## 1. Thông tin cuộc họp\nA\n\n## 2. Chương trình (gợi ý 60–90 phút)\n1. Giới thiệu\n\n## 3. Nội dung đã thống nhất\nB\n\n## 4. Quyết định\nC\n\n---\n*Mẫu*';
    const t = splitKickoffTemplate(md);
    assert.match(t.agenda, /^## 2\. Chương trình/);
    assert.doesNotMatch(t.agenda, /Thông tin|Nội dung/);
    assert.match(t.minutes, /## 3\. Nội dung[\s\S]*## 4\. Quyết định/);
  });
});

describe('iCalendar (RFC 5545)', () => {
  it('escape dấu phẩy, chấm phẩy, gạch chéo, xuống dòng', () => {
    assert.equal(icsEscape('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
  });
  it('gập dòng ≤ 75 octet, dòng tiếp bắt đầu bằng dấu cách, không cắt giữa ký tự UTF-8', () => {
    const line = `SUMMARY:${'Họp khởi động dự án — ưu tiên cao '.repeat(8)}`;
    const folded = icsFold(line);
    for (const l of folded.split('\r\n')) assert.ok(Buffer.byteLength(l) <= 75, `${Buffer.byteLength(l)} > 75`);
    assert.ok(folded.split('\r\n').slice(1).every((l) => l.startsWith(' ')));
    assert.equal(folded.split('\r\n').map((l, i) => (i ? l.slice(1) : l)).join(''), line);
  });
  it('VEVENT có giờ đủ DTSTART/DTEND/UID/ORGANIZER/ATTENDEE; email chỉ của người nhận', () => {
    const ev = meetingEventLines({
      uid: 'ctwork-meeting-7@cuongthai.com', sequence: 2, title: 'Kick-off, phase 1; scope', status: 'SCHEDULED',
      startsAt: new Date('2026-10-05T02:00:00Z'), endsAt: new Date('2026-10-05T03:30:00Z'), timezone: 'Asia/Ho_Chi_Minh',
      location: 'Room 1, HQ', meetingUrl: 'https://meet.google.com/abc', description: 'Line 1\nLine 2', url: 'https://x.test/m/7',
      organizer: { name: 'An, PM', email: 'no-reply@cuongthai.com' },
      attendees: [{ id: 1, name: 'Me', email: 'me@x.test' }, { id: 2, name: 'Other "Q"', email: null }],
    }, new Date('2026-10-04T00:00:00Z'));
    const doc = icsDocument(ev);
    assert.ok(doc.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'));
    assert.ok(doc.endsWith('END:VCALENDAR\r\n'));
    const unfolded = doc.replace(/\r\n /g, '');
    assert.match(unfolded, /\r\nUID:ctwork-meeting-7@cuongthai\.com\r\n/);
    assert.match(unfolded, /\r\nSEQUENCE:2\r\n/);
    assert.match(unfolded, /\r\nDTSTART:20261005T020000Z\r\n/);
    assert.match(unfolded, /\r\nDTEND:20261005T033000Z\r\n/);
    assert.match(unfolded, /\r\nSUMMARY:Kick-off\\, phase 1\\; scope\r\n/);
    assert.match(unfolded, /\r\nLOCATION:Room 1\\, HQ · https:\/\/meet\.google\.com\/abc\r\n/);
    assert.match(unfolded, /\r\nDESCRIPTION:Line 1\\nLine 2\r\n/);
    assert.match(unfolded, /\r\nORGANIZER;CN="An, PM":mailto:no-reply@cuongthai\.com\r\n/);
    assert.match(unfolded, /\r\nATTENDEE;CN="Me";ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION:mailto:me@x\.test\r\n/);
    assert.match(unfolded, /\r\nATTENDEE;CN="Other Q";[^\r]*:urn:ctwork:user:2\r\n/);
    assert.doesNotMatch(unfolded, /mailto:[^\r]*other/i);
    for (const l of doc.split('\r\n')) assert.ok(Buffer.byteLength(l) <= 75);
    // Mọi dòng kết thúc CRLF — không có LF lẻ.
    assert.equal(doc.replace(/\r\n/g, '').includes('\n'), false);
  });
  it('huỷ họp ⇒ STATUS:CANCELLED', () => {
    const ev = meetingEventLines({
      uid: 'u@x', sequence: 0, title: 't', status: 'CANCELLED', startsAt: new Date('2026-10-05T02:00:00Z'), endsAt: new Date('2026-10-05T03:00:00Z'),
      timezone: 'UTC', organizer: { name: 'o', email: 'o@x' }, attendees: [],
    }, new Date());
    assert.ok(ev.includes('STATUS:CANCELLED'));
  });
});

describe('Quyền + mô-đun + cổng khách', () => {
  it('governanceAccess: khách/GUEST không thấy; VIEWER/TEACHER xem; MEMBER/ADMIN sửa', () => {
    assert.deepEqual(governanceAccess('CLIENT', 'GUEST'), { view: false, edit: false, manage: false });
    assert.deepEqual(governanceAccess('CLIENT', 'MEMBER'), { view: false, edit: false, manage: false });
    assert.deepEqual(governanceAccess('MEMBER', 'GUEST'), { view: false, edit: false, manage: false });
    assert.deepEqual(governanceAccess('TEACHER', 'GUEST'), { view: true, edit: false, manage: false });
    assert.deepEqual(governanceAccess('VIEWER', 'MEMBER'), { view: true, edit: false, manage: false });
    assert.deepEqual(governanceAccess('MEMBER', 'MEMBER'), { view: true, edit: true, manage: false });
    assert.deepEqual(governanceAccess('ADMIN', 'OWNER'), { view: true, edit: true, manage: true });
    assert.deepEqual(governanceAccess(null, null), { view: false, edit: false, manage: false });
  });
  it('xoá: ADMIN, hoặc người tạo còn quyền sửa', () => {
    assert.equal(canDeleteGovernance('ADMIN', 'MEMBER', 1, 2), true);
    assert.equal(canDeleteGovernance('MEMBER', 'MEMBER', 1, 1), true);
    assert.equal(canDeleteGovernance('MEMBER', 'MEMBER', 1, 2), false);
    assert.equal(canDeleteGovernance('VIEWER', 'MEMBER', 1, 1), false);
  });
  it('dự án CLIENT mới bật CR/RAID/họp; loại khác thì không', () => {
    const c = defaultModulesFor('CLIENT');
    assert.deepEqual([c.changeRequests, c.raid, c.meetings], [true, true, true]);
    for (const k of ['SOFTWARE', 'SCHOOL', 'PERSONAL'] as const) {
      const m = defaultModulesFor(k);
      assert.deepEqual([m.changeRequests, m.raid, m.meetings], [false, false, false], k);
    }
  });
  it('danh sách trắng khách: CR/RAID/họp nội bộ bị chặn; họp qua /portal/meetings thì mở', () => {
    for (const [m, p] of [['GET', '/changes'], ['GET', '/changes/3'], ['POST', '/changes/3/approval'], ['GET', '/raid'], ['GET', '/raid/top'], ['GET', '/raid/1'],
      ['GET', '/meetings'], ['GET', '/meetings/2'], ['GET', '/meetings/2/ics'], ['GET', '/issues/4/governance']] as const) {
      assert.equal(clientPortalRouteAllowed(m, p), false, `${m} ${p}`);
    }
    for (const p of ['/portal/meetings', '/portal/meetings/2', '/portal/meetings/2/ics']) assert.equal(clientPortalRouteAllowed('GET', p), true, p);
  });
  it('thư khách loại meeting: không chữ "internal"', () => {
    const c = clientEmailContent({ portalKind: 'meeting', title: 'Weekly sync', message: 'You are invited to a meeting' });
    assert.match(c.subject, /Weekly sync/);
    assert.doesNotMatch(JSON.stringify(c), /internal/i);
  });
});

describe('Portfolio — luật RAG mới (đợt S3b)', () => {
  const base: RagInput = { open: 10, overdue: 0, sprint: null, milestones: [], blockedBy: 0, pendingApprovals: 0, oldestPendingApprovalDays: null };
  const codes = (i: RagInput) => ragOf(i).reasons.map((r) => r.code);
  it(`rủi ro OPEN ≥ ${RAG_RULES.RED_RISK_SCORE} ⇒ ĐỎ; ${RAG_RULES.AMBER_RISK_SCORE}–${RAG_RULES.RED_RISK_SCORE - 1} ⇒ VÀNG; thấp hơn ⇒ không gì`, () => {
    const red = ragOf({ ...base, openRisks: [{ key: 'R-1', title: 'Vendor API', score: 20 }, { key: 'R-2', title: 'x', score: 16 }] });
    assert.equal(red.rag, 'RED');
    assert.deepEqual(red.reasons.map((r) => r.code), ['RISK_CRITICAL', 'RISK_HIGH']);
    assert.match(red.reasons[0].text, /R-1 "Vendor API" \(20\)/);
    assert.equal(ragOf({ ...base, openRisks: [{ key: 'R-2', title: 'x', score: 15 }] }).rag, 'AMBER');
    assert.deepEqual(codes({ ...base, openRisks: [{ key: 'R-3', title: 'x', score: 14 }] }), ['ALL_CLEAR']);
  });
  it(`CR chờ quyết định > ${RAG_RULES.AMBER_CR_DAYS} ngày ⇒ VÀNG; đúng ${RAG_RULES.AMBER_CR_DAYS} ngày ⇒ chưa`, () => {
    const r = ragOf({ ...base, pendingChangeRequests: [{ key: 'CR-1', waitingDays: 6 }, { key: 'CR-2', waitingDays: 9 }] });
    assert.equal(r.rag, 'AMBER');
    assert.deepEqual(r.reasons.map((x) => x.code), ['CR_WAITING']);
    assert.match(r.reasons[0].text, /CR-2.*9 days/);
    assert.deepEqual(codes({ ...base, pendingChangeRequests: [{ key: 'CR-1', waitingDays: 5 }] }), ['ALL_CLEAR']);
  });
  it('không truyền dữ liệu S3b (dự án cũ / mô-đun tắt) ⇒ kết quả như trước', () => {
    assert.deepEqual(codes(base), ['ALL_CLEAR']);
  });
});
