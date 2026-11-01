/**
 * Luật "khoá đang soạn" (services/khoaDaSoan.ts) — hàm thuần, không cần CSDL.
 * Chạy: npx tsx --test src/services/khoaDaSoan.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { laBaiDaSoan, laDangSoan, NGUONG_BYTE } from './khoaDaSoan.js';

describe('laBaiDaSoan', () => {
  it('bài chỉ là đoạn giới thiệu (~1.000 ký tự, không video) ⇒ CHƯA soạn', () => {
    assert.equal(laBaiDaSoan({ content: 'x'.repeat(1000), videoDurationSeconds: 0 }), false);
  });
  it('nội dung đủ ngưỡng byte ⇒ đã soạn (tiếng Việt có dấu tính theo byte UTF-8)', () => {
    assert.equal(laBaiDaSoan({ content: 'x'.repeat(NGUONG_BYTE), videoDurationSeconds: 0 }), true);
    assert.equal(laBaiDaSoan({ content: 'ộ'.repeat(Math.ceil(NGUONG_BYTE / 3)), videoDurationSeconds: 0 }), true);
  });
  it('có video ⇒ đã soạn dù nội dung trống', () => {
    assert.equal(laBaiDaSoan({ content: null, videoDurationSeconds: 120 }), true);
  });
});

describe('laDangSoan', () => {
  it('dưới 20% bài đã soạn ⇒ đang soạn', () => {
    assert.equal(laDangSoan({ soBai: 55, soBaiDaSoan: 1 }), true);
    assert.equal(laDangSoan({ soBai: 48, soBaiDaSoan: 0 }), true);
  });
  it('từ 20% trở lên ⇒ không gắn nhãn', () => {
    assert.equal(laDangSoan({ soBai: 65, soBaiDaSoan: 16 }), false);
    assert.equal(laDangSoan({ soBai: 91, soBaiDaSoan: 79 }), false);
  });
  it('không có số liệu / không có bài ⇒ không đoán', () => {
    assert.equal(laDangSoan(undefined), false);
    assert.equal(laDangSoan({ soBai: 0, soBaiDaSoan: 0 }), false);
  });
});
