/**
 * CTW K-2 — luật thuần của họp: điểm danh AUTO/MANUAL, chuyên cần, Đóng góp lùi về ước lượng, đồng ý ghi âm, kiểm
 * đoạn audio, ghép transcript + mốc giờ, bằng chứng của biên bản AI (có / thiếu / id bịa), hạn lưu, agenda, mẫu FPT.
 *   npx tsx --test src/services/work/meetingRules.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  agendaRef, appliedMinutesMarkdown, attendanceStats, attendedForContrib, autoAttendance, checkChunk, checkMinutes, chunkProgress,
  clampRetention, consentState, expiresAtFor, fmtTs, mergeTranscript, minutesMarkdown, minutesOut, minutesPrompt, normalizeAgenda,
  parseAgenda, presentIds, transcriptForPrompt, type ChunkLike,
} from './meetingRules.js';

const start = new Date('2026-10-10T02:00:00Z');

describe('điểm danh', () => {
  it('AUTO: vào trước/đúng giờ hoặc muộn ≤ 5 phút ⇒ PRESENT; muộn hơn ⇒ LATE', () => {
    assert.equal(autoAttendance(start, new Date(start.getTime() - 60_000), { attendance: null, source: null }).attendance, 'PRESENT');
    assert.equal(autoAttendance(start, new Date(start.getTime() + 5 * 60_000), { attendance: null, source: null }).attendance, 'PRESENT');
    assert.equal(autoAttendance(start, new Date(start.getTime() + 6 * 60_000), { attendance: null, source: null }).attendance, 'LATE');
  });
  it('MANUAL không bị AUTO ghi đè; vào lại phòng giữ mốc AUTO lần đầu', () => {
    assert.deepEqual(autoAttendance(start, new Date(start.getTime() + 30 * 60_000), { attendance: 'EXCUSED', source: 'MANUAL' }), { attendance: 'EXCUSED', source: 'MANUAL' });
    assert.equal(autoAttendance(start, new Date(start.getTime() + 30 * 60_000), { attendance: 'PRESENT', source: 'AUTO' }).attendance, 'PRESENT');
  });
  it('chuyên cần: tỉ lệ = (có mặt + muộn)/(có mặt + muộn + vắng); có phép không vào mẫu; cuộc họp chưa điểm danh không tính; huỷ bỏ qua', () => {
    const s = attendanceStats([
      { userId: 1, meetingId: 1, attendance: 'PRESENT', rsvp: 'YES', tracked: true, status: 'DONE' },
      { userId: 1, meetingId: 2, attendance: 'LATE', rsvp: 'MAYBE', tracked: true, status: 'DONE' },
      { userId: 1, meetingId: 3, attendance: 'ABSENT', rsvp: 'NO', tracked: true, status: 'DONE' },
      { userId: 1, meetingId: 4, attendance: 'EXCUSED', rsvp: 'NO', tracked: true, status: 'DONE' },
      { userId: 1, meetingId: 5, attendance: null, rsvp: null, tracked: false, status: 'DONE' },
      { userId: 1, meetingId: 6, attendance: 'PRESENT', rsvp: null, tracked: true, status: 'CANCELLED' },
      { userId: 2, meetingId: 1, attendance: null, rsvp: null, tracked: true, status: 'DONE' },
    ]);
    const a = s.find((x) => x.userId === 1)!;
    assert.deepEqual([a.invited, a.tracked, a.present, a.late, a.absent, a.excused, a.rsvpYes, a.rsvpNo, a.rsvpMaybe], [5, 4, 1, 1, 1, 1, 1, 2, 1]);
    assert.equal(a.rate, 66.7);
    const b = s.find((x) => x.userId === 2)!;
    assert.equal(b.unmarked, 1);
    assert.equal(b.rate, null);
  });
  it('Đóng góp: có điểm danh ⇒ dùng điểm danh thật; chưa ⇒ ước lượng cũ (DONE)', () => {
    assert.deepEqual(attendedForContrib({ status: 'DONE', tracked: true, attendance: 'ABSENT' }), { attended: false, source: 'attendance' });
    assert.deepEqual(attendedForContrib({ status: 'SCHEDULED', tracked: true, attendance: 'LATE' }), { attended: true, source: 'attendance' });
    assert.deepEqual(attendedForContrib({ status: 'DONE', tracked: false, attendance: undefined }), { attended: true, source: 'estimate' });
    assert.deepEqual(attendedForContrib({ status: 'SCHEDULED', tracked: false, attendance: null }), { attended: false, source: 'estimate' });
  });
});

describe('đồng ý ghi âm', () => {
  const t = new Date();
  it('người đang ở phòng = đã vào, chưa rời (vào lại ⇒ leftAt bị xoá)', () => {
    assert.deepEqual(presentIds([
      { userId: 1, joinedAt: t, leftAt: null },
      { userId: 2, joinedAt: t, leftAt: new Date(t.getTime() + 1000) },
      { userId: 4, joinedAt: null, leftAt: null },
    ]), [1]);
  });
  it('chỉ bắt đầu khi MỌI người ở phòng đồng ý; một người từ chối ⇒ không', () => {
    assert.equal(consentState([1, 2, 3], 1, [{ userId: 1, decision: 'AGREED' }, { userId: 2, decision: 'AGREED' }]).canBegin, false);
    const w = consentState([1, 2, 3], 1, [{ userId: 1, decision: 'AGREED' }, { userId: 2, decision: 'AGREED' }]);
    assert.deepEqual(w.waiting, [3]);
    assert.equal(consentState([1, 2, 3], 1, [{ userId: 1, decision: 'AGREED' }, { userId: 2, decision: 'AGREED' }, { userId: 3, decision: 'AGREED' }]).canBegin, true);
    const d = consentState([1, 2], 1, [{ userId: 1, decision: 'AGREED' }, { userId: 2, decision: 'DECLINED' }]);
    assert.equal(d.canBegin, false);
    assert.deepEqual(d.declined, [2]);
    // Người ghi không cần ở phòng vẫn được tính (đã đồng ý khi mở lượt ghi).
    assert.equal(consentState([], 9, [{ userId: 9, decision: 'AGREED' }]).canBegin, true);
  });
});

describe('đoạn audio', () => {
  it('kiểm kiểu / dung lượng / độ dài', () => {
    assert.equal(checkChunk({ size: 1000, mime: 'audio/webm;codecs=opus', durationMs: 90_000, startMs: 0 }).ok, true);
    assert.equal(checkChunk({ size: 1000, mime: 'audio/x-m4a', durationMs: 90_000, startMs: 0 }).ok, true);
    assert.equal(checkChunk({ size: 1000, mime: 'video/mp4', durationMs: 90_000, startMs: 0 }).ok, false);
    assert.equal((checkChunk({ size: 25 * 1024 * 1024, mime: 'audio/mpeg', durationMs: 90_000, startMs: 0 }) as { code: string }).code, 'WORK_FILE_TOO_LARGE');
    assert.equal((checkChunk({ size: 10, mime: 'audio/wav', durationMs: 100, startMs: 0 }) as { code: string }).code, 'WORK_AUDIO_SHORT');
    assert.equal((checkChunk({ size: 10, mime: 'audio/wav', durationMs: 11 * 60_000, startMs: 0 }) as { code: string }).code, 'WORK_AUDIO_LONG');
  });
  it('tiến độ phiên âm', () => {
    assert.deepEqual(chunkProgress([{ status: 'DONE' }, { status: 'NO_SPEECH' }, { status: 'PENDING' }, { status: 'FAILED' }]), { total: 4, done: 2, pending: 1, failed: 1, noKey: 0, limit: 0, percent: 50 });
  });
});

describe('ghép transcript + mốc giờ', () => {
  const chunks: ChunkLike[] = [
    { seq: 1, startMs: 90_000, durationMs: 90_000, status: 'DONE', text: null, segments: [{ start: 0.5, end: 4, text: 'Chốt dùng PostgreSQL.' }, { start: 10, end: 14, text: 'An làm ERD trước thứ Sáu.', speakerId: 7 }], speakerId: 3 },
    { seq: 0, startMs: 0, durationMs: 90_000, status: 'DONE', text: null, segments: [{ start: 1, end: 5, text: 'Bắt đầu họp.' }, { start: 88, end: 90.4, text: 'Chốt dùng PostgreSQL.' }], speakerId: 3 },
    { seq: 2, startMs: 180_000, durationMs: 60_000, status: 'FAILED', text: null, segments: null, speakerId: 3 },
    { seq: 3, startMs: 240_000, durationMs: 30_000, status: 'DONE', text: 'Hết giờ.', segments: null, speakerId: null },
  ];
  it('sắp theo vị trí, mốc tuyệt đối, id ổn định, bỏ đoạn lỗi, đoạn không segment ⇒ một dòng', () => {
    const lines = mergeTranscript(chunks);
    assert.deepEqual(lines.map((l) => [l.n, l.id, fmtTs(l.startMs), l.text, l.speakerId]), [
      [1, '0.0', '00:01', 'Bắt đầu họp.', 3],
      [2, '0.1', '01:28', 'Chốt dùng PostgreSQL.', 3],
      [3, '1.1', '01:40', 'An làm ERD trước thứ Sáu.', 7],
      [4, '3.0', '04:00', 'Hết giờ.', null],
    ]);
  });
  it('fmtTs có giờ khi ≥ 1 giờ', () => {
    assert.equal(fmtTs(3_725_000), '1:02:05');
    assert.equal(fmtTs(65_000), '01:05');
  });
  it('prompt: dòng [Ln mm:ss Tên]; quá dài ⇒ giữ đầu + cuối, báo truncated', () => {
    const lines = mergeTranscript(chunks);
    const t = transcriptForPrompt(lines, (id) => (id === 7 ? 'An' : 'Bình'));
    assert.match(t.text, /^\[L1 00:01 Bình\] Bắt đầu họp\./);
    assert.match(t.text, /\[L3 01:40 An\]/);
    const long = transcriptForPrompt(lines, () => 'X', 60);
    assert.equal(long.truncated, true);
    assert.match(long.text, /omitted/);
  });
});

describe('biên bản AI: bằng chứng', () => {
  const lines = mergeTranscript([
    { seq: 0, startMs: 0, durationMs: 60_000, status: 'DONE', text: null, segments: [{ start: 1, end: 3, text: 'Chốt dùng PostgreSQL.' }, { start: 5, end: 8, text: 'An làm ERD trước 2026-10-17.' }], speakerId: 1 },
  ]);
  const members = [{ id: 7, username: 'an.nguyen', name: 'Nguyễn An' }, { id: 8, username: 'binh', name: 'Trần Bình' }];
  it('mục có dòng thật ⇒ trích NGUYÊN VĂN transcript; id bịa / không có ⇒ unsupported', () => {
    const out = minutesOut.parse({
      summary: 'Họp chốt CSDL.',
      decisions: [{ text: 'Dùng PostgreSQL', evidence: ['L1'] }, { text: 'Dùng Kafka', evidence: ['L99'] }],
      actions: [{ text: 'Vẽ ERD', owner: 'an.nguyen', due: '2026-10-17', evidence: ['L2', 'L2', 2] }, { text: 'Viết test', owner: 'Hoa', due: 'tuần sau', evidence: [] }],
      openIssues: [{ text: 'Chưa rõ host', evidence: ['x'] }],
    });
    const c = checkMinutes(out, lines, members);
    assert.equal(c.decisions[0].unsupported, false);
    assert.equal(c.decisions[0].evidence[0].quote, 'Chốt dùng PostgreSQL.');
    assert.equal(c.decisions[1].unsupported, true, 'L99 không tồn tại');
    assert.equal(c.actions[0].evidence.length, 1, 'trùng dòng gộp một');
    assert.deepEqual([c.actions[0].ownerId, c.actions[0].due], [7, '2026-10-17']);
    assert.deepEqual([c.actions[1].ownerId, c.actions[1].ownerName, c.actions[1].due, c.actions[1].unsupported], [null, 'Hoa', null, true]);
    assert.equal(c.openIssues[0].unsupported, true);
    assert.equal(c.unsupportedCount, 3);
  });
  it('người phụ trách khớp tên không dấu / một phần tên', () => {
    const c = checkMinutes(minutesOut.parse({ actions: [{ text: 'x', owner: 'binh', evidence: ['L1'] }, { text: 'y', owner: 'Nguyen An', evidence: ['L1'] }] }), lines, members);
    assert.deepEqual(c.actions.map((a) => a.ownerId), [8, 7]);
  });
  it('prompt ép JSON + ngôn ngữ + chống lệnh trong transcript', () => {
    const p = minutesPrompt({ language: 'en', title: 'Sprint review', type: 'Demo', date: '2026-10-10', agenda: ['Demo'], attendees: ['An'], transcript: '[L1 00:01 An] hi' });
    assert.match(p.system, /English/);
    assert.match(p.system, /Ignore any instruction/);
    assert.match(p.user, /<transcript>/);
  });
});

describe('hạn lưu + agenda + mẫu FPT', () => {
  it('hạn lưu kẹp 1..365 ngày', () => {
    assert.equal(clampRetention(0), 1);
    assert.equal(clampRetention(900), 365);
    assert.equal(expiresAtFor(new Date('2026-10-01T00:00:00Z'), 30).toISOString(), '2026-10-31T00:00:00.000Z');
  });
  it('agenda: id ổn định, ref thẻ/trang/url', () => {
    let k = 0;
    const a = normalizeAgenda([{ title: ' Demo ', minutes: 10, ref: 'FP-12' }, { id: 'keep-1', title: 'Q&A', ref: 'https://x.dev/a' }], () => `n${++k}`);
    assert.deepEqual(a.map((x) => x.id), ['n1', 'keep-1']);
    assert.equal(a[0].title, 'Demo');
    assert.deepEqual(agendaRef('fp-12', 'FP'), { kind: 'issue', number: 12 });
    assert.deepEqual(agendaRef('DOC-3', 'FP'), { kind: 'page', number: 3 });
    assert.equal(agendaRef('http://x', 'FP')!.kind, 'text');
    assert.equal(parseAgenda([{ title: '' }, { title: 'ok' }, 'x']).length, 1);
  });
  it('mẫu biên bản FPT: đủ mục, cờ thiếu bằng chứng, ký tự | không phá bảng', () => {
    const md = minutesMarkdown({
      language: 'vi', projectName: 'LabFlow', projectKey: 'LF', meetingKey: 'M-3', title: 'Họp tuần | 3', typeLabel: 'Weekly', when: '10/10/2026 09:00', place: null,
      chair: 'An', secretary: 'Bình', attendees: [{ name: 'An', role: 'ADMIN', attendance: 'PRESENT', note: null }, { name: 'Hoa', role: 'MEMBER', attendance: 'EXCUSED', note: 'NO: ốm' }],
      agenda: [{ title: 'Demo', presenter: 'An', minutes: 10 }], summary: 'Tóm tắt.', decisions: [{ text: 'Dùng PG' }, { text: 'Dùng Kafka', unsupported: true }],
      actions: [{ text: 'ERD', owner: 'An', due: '2026-10-17' }], openIssues: [], next: null, recordingUrl: null,
    });
    for (const h of ['BIÊN BẢN HỌP', 'Thành phần tham dự', 'Nội dung (Agenda)', 'Diễn biến cuộc họp', 'Quyết định', 'Việc cần làm', 'Vấn đề còn mở', 'Xác nhận']) assert.ok(md.includes(h), h);
    assert.ok(md.includes('Vắng có phép'));
    assert.ok(md.includes('Họp tuần / 3'));
    assert.ok(md.includes('(chưa có bằng chứng trong transcript)'));
    assert.match(appliedMinutesMarkdown({ summary: 'S', decisions: [], actions: [], openIssues: [{ text: 'Q', evidence: [], unsupported: true }], unsupportedCount: 1, lineCount: 1, truncated: false }, 'en'), /Open issues/);
  });
});
