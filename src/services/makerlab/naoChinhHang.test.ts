import test from 'node:test';
import assert from 'node:assert/strict';
import { chuyenTin, modelRobotChinhHang, trongTran, chinhHangBat } from './naoChinhHang.js';
import { thinkingNhanh } from '../agent/anthropicChinhHang/dinhTuyen.js';

test('model: câu thường Haiku 5.5, câu khó Sonnet 5.5; env đè được', () => {
  delete process.env.MAKERLAB_MODEL_CHINH_HANG;
  delete process.env.MAKERLAB_MODEL_CHINH_HANG_KHO;
  assert.equal(modelRobotChinhHang(false), 'claude-haiku-5-5');
  assert.equal(modelRobotChinhHang(true), 'claude-sonnet-5-5');
  process.env.MAKERLAB_MODEL_CHINH_HANG = 'claude-sonnet-5-5';
  assert.equal(modelRobotChinhHang(false), 'claude-sonnet-5-5');
  delete process.env.MAKERLAB_MODEL_CHINH_HANG;
});

test('trần: mặc định KHÔNG trần; đặt > 0 thì chặn khi chạm', () => {
  assert.equal(trongTran(999, 0), true);
  assert.equal(trongTran(4.9, 5), true);
  assert.equal(trongTran(5, 5), false);
});

test('bật mặc định, chỉ MAKERLAB_CHINH_HANG=0 mới tắt', () => {
  delete process.env.MAKERLAB_CHINH_HANG;
  assert.equal(chinhHangBat(), true);
  process.env.MAKERLAB_CHINH_HANG = '0';
  assert.equal(chinhHangBat(), false);
  delete process.env.MAKERLAB_CHINH_HANG;
});

test('chuyenTin: gộp system, bỏ tin rỗng, tin đầu là user', () => {
  const r = chuyenTin([
    { role: 'system', content: 'Bạn là Odin.' },
    { role: 'assistant', content: 'chào (lời chào cũ đứng đầu lịch sử)' },
    { role: 'user', content: 'hôm nay thế nào' },
    { role: 'assistant', content: '  ' },
    { role: 'user', content: '[dặn: trả lời ngắn]' },
    { role: 'system', content: 'Ghi chú thêm.' },
  ]);
  assert.equal(r.system, 'Bạn là Odin.\n\nGhi chú thêm.');
  assert.deepEqual(r.messages, [
    { role: 'user', content: 'hôm nay thế nào' },
    { role: 'user', content: '[dặn: trả lời ngắn]' },
  ]);
});

test('thinkingNhanh: Sonnet 5.5 between_tools, Haiku disabled, Opus 5.5 bỏ trường', () => {
  assert.deepEqual(thinkingNhanh('claude-sonnet-5-5'), { type: 'between_tools' });
  assert.deepEqual(thinkingNhanh('claude-haiku-5-5'), { type: 'disabled' });
  assert.equal(thinkingNhanh('claude-opus-5-5'), null);
  assert.equal(thinkingNhanh('claude-fable-5-2'), null);
});
