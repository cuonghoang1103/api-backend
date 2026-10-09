/**
 * CT Work đợt 5b K-1 — luật thuần của bình luận đầy đủ: luồng một cấp, voice note, chữ tìm kiếm, hiện diện.
 *   npx tsx --test src/services/work/commentThreads.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  baseMime, buildThreads, checkVoice, commentSearchText, isVoiceMime, parsePresence, threadRootOf, transcriptNote,
  VOICE_LABEL, VOICE_MAX_BYTES, VOICE_MAX_SECONDS, vnDayStart, voiceExt,
} from './commentThreads.js';

describe('K-1 luồng trả lời', () => {
  it('trả lời gốc ⇒ gốc; trả lời một trả lời ⇒ gắn vào gốc của nó (một cấp)', () => {
    assert.equal(threadRootOf({ id: 5, issueId: 1, parentId: null, deletedAt: null }, 1), 5);
    assert.equal(threadRootOf({ id: 9, issueId: 1, parentId: 5, deletedAt: null }, 1), 5);
  });
  it('cha khác thẻ / đã xoá / không có ⇒ null', () => {
    assert.equal(threadRootOf({ id: 5, issueId: 2, parentId: null, deletedAt: null }, 1), null);
    assert.equal(threadRootOf({ id: 5, issueId: 1, parentId: null, deletedAt: new Date() }, 1), null);
    assert.equal(threadRootOf(null, 1), null);
  });
  it('buildThreads: gom trả lời dưới gốc theo thứ tự; mồ côi đứng như gốc có cờ', () => {
    const t = buildThreads([
      { id: 1, parentId: null }, { id: 2, parentId: 1 }, { id: 3, parentId: null }, { id: 4, parentId: 1 }, { id: 5, parentId: 99 },
    ]);
    assert.deepEqual(t.map((x) => [x.id, x.replies.map((r) => r.id), x.orphan]), [[1, [2, 4], false], [3, [], false], [5, [], true]]);
  });
});

describe('K-1 voice note', () => {
  it('nhận đúng kiểu ghi của Chrome/Firefox/Safari, bỏ codecs', () => {
    for (const m of ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4', 'audio/x-m4a', 'audio/mpeg']) assert.ok(isVoiceMime(m), m);
    for (const m of ['video/webm', 'application/pdf', 'audio/../../x', 'text/plain']) assert.ok(!isVoiceMime(m), m);
    assert.equal(baseMime('audio/webm;codecs=opus'), 'audio/webm');
    assert.equal(voiceExt('audio/mp4'), 'm4a');
    assert.equal(voiceExt('audio/ogg'), 'ogg');
    assert.equal(voiceExt('audio/webm;codecs=opus'), 'webm');
  });
  it('trần 3 phút + 8 MB; quá ngắn/rỗng/sai kiểu bị chặn với mã riêng', () => {
    assert.deepEqual(checkVoice({ size: 50_000, mime: 'audio/webm', durationMs: 4200 }), { ok: true, durationMs: 4200 });
    // Đồng hồ chạy theo giây ⇒ dung sai 5 giây, nhưng lưu tối đa đúng 3 phút.
    assert.deepEqual(checkVoice({ size: 50_000, mime: 'audio/webm', durationMs: VOICE_MAX_SECONDS * 1000 + 3000 }), { ok: true, durationMs: VOICE_MAX_SECONDS * 1000 });
    const code = (r: ReturnType<typeof checkVoice>) => (r.ok ? 'OK' : r.code);
    assert.equal(code(checkVoice({ size: 50_000, mime: 'audio/webm', durationMs: (VOICE_MAX_SECONDS + 10) * 1000 })), 'WORK_VOICE_TOO_LONG');
    assert.equal(code(checkVoice({ size: VOICE_MAX_BYTES + 1, mime: 'audio/webm', durationMs: 5000 })), 'WORK_FILE_TOO_LARGE');
    assert.equal(code(checkVoice({ size: 0, mime: 'audio/webm', durationMs: 5000 })), 'WORK_VOICE_EMPTY');
    assert.equal(code(checkVoice({ size: 10, mime: 'audio/webm', durationMs: 200 })), 'WORK_VOICE_TOO_SHORT');
    assert.equal(code(checkVoice({ size: 10, mime: 'video/mp4', durationMs: 5000 })), 'WORK_VOICE_TYPE');
    assert.equal(code(checkVoice({ size: 10, mime: 'audio/webm', durationMs: Number.NaN })), 'WORK_VOICE_TOO_SHORT');
  });
  it('chữ tìm kiếm: chữ gõ + phiên âm; thân trống ⇒ nhãn voice / tên tệp', () => {
    assert.equal(commentSearchText('Xem log', { transcripts: ['lỗi đăng nhập trên iOS'] }), `Xem log\n${VOICE_LABEL} lỗi đăng nhập trên iOS`);
    assert.equal(commentSearchText('', { voiceCount: 1, transcripts: [null] }), VOICE_LABEL);
    assert.equal(commentSearchText('', { fileNames: ['log.txt', 'a.pdf'] }), '[Files] log.txt, a.pdf');
    assert.equal(commentSearchText('Hi', { fileNames: ['log.txt'] }), 'Hi');
    assert.equal(commentSearchText('', {}), '');
  });
  it('mỗi trạng thái có câu cho người đọc; NO_KEY nói rõ audio vẫn được lưu', () => {
    assert.match(transcriptNote('NO_KEY'), /not available.*audio is saved/);
    assert.equal(transcriptNote('DONE'), '');
    for (const s of ['PENDING', 'NO_SPEECH', 'LIMIT', 'FAILED']) assert.ok(transcriptNote(s).length > 3, s);
  });
  it('ngày đếm trần theo giờ VN', () => {
    assert.equal(vnDayStart(new Date('2026-10-09T18:30:00Z')).toISOString(), '2026-10-09T17:00:00.000Z');
    assert.equal(vnDayStart(new Date('2026-10-09T16:30:00Z')).toISOString(), '2026-10-08T17:00:00.000Z');
  });
});

describe('K16 hiện diện', () => {
  it('chỉ nhận đúng hình dạng', () => {
    assert.deepEqual(parsePresence({ projectId: 3, number: 7, state: 'typing' }), { projectId: 3, number: 7, state: 'typing' });
    assert.equal(parsePresence({ projectId: 3, number: 7, state: 'hacking' }), null);
    assert.equal(parsePresence({ projectId: '3x', number: 7, state: 'viewing' }), null);
    assert.equal(parsePresence({ projectId: 3, number: 0, state: 'viewing' }), null);
    assert.equal(parsePresence(null), null);
  });
});
