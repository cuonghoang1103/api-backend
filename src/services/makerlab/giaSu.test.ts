import test from 'node:test';
import assert from 'node:assert/strict';
import { chamTraLoi, chuanDapAn, khopBatDauHoc, khopLenhTrongBai } from './giaSu.js';

test('nhận lời mở buổi học theo ngôn ngữ + kiểu', () => {
  assert.deepEqual(khopBatDauHoc('ôn tập tiếng Nhật đi'), { nn: 'ja', kieu: 'on' });
  assert.deepEqual(khopBatDauHoc('dạy tao từ mới tiếng Trung'), { nn: 'zh', kieu: 'moi' });
  assert.deepEqual(khopBatDauHoc('luyện nói tiếng Anh với tao'), { nn: 'en', kieu: 'noi' });
  assert.deepEqual(khopBatDauHoc('học tiếng Nhật'), { nn: 'ja', kieu: 'tu-dong' });
  assert.equal(khopBatDauHoc('hôm nay trời đẹp ghê'), null);
  assert.equal(khopBatDauHoc('tiếng Nhật khó quá'), null);
});

test('lệnh trong bài; câu dài là câu trả lời chứ không phải lệnh', () => {
  assert.equal(khopLenhTrongBai('dừng học'), 'dung');
  assert.equal(khopLenhTrongBai('nói lại đi'), 'lap-lai');
  assert.equal(khopLenhTrongBai('bỏ qua'), 'bo-qua');
  assert.equal(khopLenhTrongBai('gợi ý đi'), 'goi-y');
  assert.equal(khopLenhTrongBai('nghĩa là gì'), 'nghia');
  assert.equal(khopLenhTrongBai('ねこ'), null);
});

test('chuẩn hoá: katakana ⇒ hiragana, bỏ dấu câu; tiếng Anh hạ chữ', () => {
  assert.equal(chuanDapAn('ja', 'ネコ。'), 'ねこ');
  assert.equal(chuanDapAn('en', 'Apple!'), 'apple');
});

test('chấm: đúng chữ gốc / đúng cách đọc / gần đúng / sai', () => {
  const neko = { tu: '猫', doc: 'ねこ' };
  assert.equal(chamTraLoi('ja', neko, '猫です'), 'dung');
  assert.equal(chamTraLoi('ja', neko, 'ネコ'), 'dung');
  assert.equal(chamTraLoi('ja', neko, 'いぬ'), 'sai');
  assert.equal(chamTraLoi('zh', { tu: '你好', doc: 'nǐ hǎo' }, '你好！'), 'dung');
  assert.equal(chamTraLoi('en', { tu: 'apple', doc: null }, 'I think it is apple'), 'dung');
  assert.equal(chamTraLoi('en', { tu: 'pineapple', doc: null }, 'pinapple'), 'gan');
  assert.equal(chamTraLoi('en', { tu: 'apple', doc: null }, 'orange'), 'sai');
});
