import test from 'node:test';
import assert from 'node:assert/strict';
import { chuanCauChon, khopChon } from './manChon.js';
import { chuDeTin, hoiTinChung, phanLoaiTraLoi } from './tinTuc.js';
import { parseRobotReply } from './voiceLoop.js';
import { khopBatDauHoc } from './giaSu.js';

test('khớp đáp án bằng giọng', () => {
  const abcd = ['apple', 'banana', 'cherry', 'durian'];
  assert.equal(khopChon('B', abcd), 1);
  assert.equal(khopChon('câu C', abcd), 2);
  assert.equal(khopChon('đáp án d', abcd), 3);
  assert.equal(khopChon('chọn a', abcd), 0);
  assert.equal(khopChon('câu hai', abcd), 1);
  assert.equal(khopChon('cherry', abcd), 2);
  assert.equal(khopChon('tao nghĩ là banana', abcd), 1);
  assert.equal(khopChon('kể chuyện cười đi', abcd), -1);
  const yn = ['Có', 'Không'];
  assert.equal(khopChon('ừ', yn), 0);
  assert.equal(khopChon('thôi không', yn), 1);
  assert.equal(khopChon('có chứ', yn), 0);
  const tin = ['Anthropic', 'GPT', 'Gemini', 'Tin khác'];
  assert.equal(khopChon('có, tin Gemini đi', tin), 2);
  assert.equal(khopChon('tin khác', tin), 3);
});

test('trường "chon" trong JSON trả lời', () => {
  const r = parseRobotReply('{"camXuc":"curious","say":"Apple nghĩa là gì? A táo, B chuối.","actions":[],"chon":{"hoi":"Apple là gì?","luaChon":["Táo","Chuối"],"dung":0}}');
  assert.deepEqual(r.chon, { hoi: 'Apple là gì?', luaChon: ['Táo', 'Chuối'], dung: 0 });
  assert.equal(chuanCauChon({ hoi: 'x', luaChon: ['một'] }), null);
  assert.equal(chuanCauChon({ hoi: 'x', luaChon: ['a', 'b'], dung: 5 })?.dung, undefined);
});

test('luồng tin tức kiểu bạn thân', () => {
  assert.equal(hoiTinChung('có tin gì mới không'), true);
  assert.equal(hoiTinChung('mấy giờ rồi'), false);
  assert.equal(phanLoaiTraLoi('không'), 'khong');
  assert.equal(phanLoaiTraLoi('có'), 'co');
  assert.equal(phanLoaiTraLoi('có, tin Gemini'), 'co-chu-de');
  assert.equal(chuDeTin('tin về Honda')?.ten, 'honda');
  assert.equal(chuDeTin('có tin gì mới không'), null);
});

test('mở trò chơi bằng giọng', () => {
  assert.deepEqual(khopBatDauHoc('chơi nối từ tiếng Nhật đi'), { nn: 'ja', kieu: 'noi-tu' });
  assert.deepEqual(khopBatDauHoc('chơi đố vui đi'), { nn: 'en', kieu: 'do-vui' });
});

test('hỏi tiến độ train giọng ⇒ chủ đề train', async () => {
  const { canHeThong } = await import('./heThong.js');
  assert.ok(canHeThong('train giọng tới đâu rồi').includes('train'));
  assert.ok(canHeThong('cuong6 xong chưa').includes('train'));
  assert.deepEqual(canHeThong('kể chuyện cười đi'), []);
});
