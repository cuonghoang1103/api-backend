import { test } from 'node:test';
import assert from 'node:assert/strict';

import { canHeThong, type ChuDe } from './heThong.js';

const CO: Array<[string, ChuDe]> = [
  ['Server còn bao nhiêu ổ đĩa?', 'vps'],
  ['Máy chủ có ổn không?', 'vps'],
  ['RAM đang dùng bao nhiêu rồi?', 'vps'],
  ['Máy nhà đang chạy không?', 'may-nha'],
  ['Card đồ hoạ có nóng không?', 'may-nha'],
  ['Hôm nay web của tôi có bao nhiêu người đăng ký?', 'web'],
  ['Có bao nhiêu người dùng rồi?', 'web'],
  ['Hôm nay AI tốn bao nhiêu tiền?', 'ai'],
  ['Tiền token hôm nay hết bao nhiêu?', 'ai'],
  ['Deploy gần nhất lúc nào?', 'deploy'],
  ['Dung lượng lưu trữ R2 còn bao nhiêu?', 'luu-tru'],
  ['Database nặng bao nhiêu rồi?', 'luu-tru'],
  ['App desktop đang bản mấy?', 'app'],
];

for (const [cau, cd] of CO) {
  test(`canHeThong nhận: ${cau}`, () => {
    assert.ok(canHeThong(cau).includes(cd), `${cau} → ${JSON.stringify(canHeThong(cau))}`);
  });
}

test('canHeThong: hỏi chung chung về hệ thống ⇒ tóm tắt ba chủ đề', () => {
  assert.deepEqual(canHeThong('Hệ thống thế nào rồi?'), ['vps', 'may-nha', 'web']);
});

// Không phải câu hỏi về hệ thống của chủ robot — đừng kéo số liệu vào.
const KHONG = [
  'Web nào học tiếng Anh tốt?',
  'Mấy giờ rồi?',
  'Vì sao bầu trời có màu xanh?',
  'Kể chuyện cười đi',
  'Ngày mai tôi có những môn học gì?',
  '',
];
for (const cau of KHONG) {
  test(`canHeThong bỏ qua: "${cau}"`, () => {
    assert.deepEqual(canHeThong(cau), []);
  });
}
