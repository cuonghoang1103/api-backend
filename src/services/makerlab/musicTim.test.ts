import test from 'node:test';
import assert from 'node:assert/strict';
import { dungHangDoi, hieuYeuCau, type BaiTrongKho } from './musicTim.js';

const b = (id: number, title: string, artist: string, category = 'NORMAL', language: string | null = 'vi'): BaiTrongKho =>
  ({ id, title, artist, url: `u${id}`, durationSeconds: 200, category, language });
const KHO = [
  b(1, 'Chưa Bao Giờ', 'Trung Quân'),
  b(2, 'Nơi Này Có Anh', 'Sơn Tùng M-TP'),
  b(3, 'Lạc Trôi', 'Sơn Tùng M-TP'),
  b(4, 'Lạc Trôi (Remix)', 'Sơn Tùng M-TP', 'REMIX'),
  b(5, 'Shape of You', 'Ed Sheeran', 'NORMAL', 'en'),
  b(6, 'Tháng Tư Là Lời Nói Dối Của Em', 'Hà Anh Tuấn'),
  b(7, 'Bay Phòng Mix', 'DJ Hữu', 'REMIX'),
  b(8, '月亮代表我的心', 'Teresa Teng', 'NORMAL', 'zh'),
];
const r = () => 0.42;

test('hiểu lời xin: bỏ chữ đệm, nhận remix / ngôn ngữ / bất kỳ', () => {
  assert.deepEqual(hieuYeuCau('bật bài Chưa Bao Giờ cho tôi nghe'), { kieu: 'tim', tuKhoa: 'chua bao gio', remix: false, ngonNgu: null });
  assert.equal(hieuYeuCau('bật nhạc đi').kieu, 'bat-ky');
  assert.equal(hieuYeuCau('random').kieu, 'bat-ky');
  assert.equal(hieuYeuCau('mở nhạc remix').remix, true);
  assert.equal(hieuYeuCau('mở nhạc tiếng Anh').ngonNgu, 'en');
  assert.equal(hieuYeuCau('bật bài hát của ca sĩ Hà Anh Tuấn').tuKhoa, 'ha anh tuan');
});

test('Whisper rớt dấu vẫn ra đúng bài', () => {
  const { hang, theo } = dungHangDoi(KHO, hieuYeuCau('bat bai chua bao gio'), r);
  assert.equal(theo, 'ten');
  assert.equal(hang[0].id, 1);
});

test('tên ca sĩ ⇒ phát cả loạt bài của ca sĩ đó', () => {
  const { hang, theo } = dungHangDoi(KHO, hieuYeuCau('mở nhạc Sơn Tùng'), r);
  assert.equal(theo, 'ca-si');
  assert.deepEqual(new Set(hang.map((x) => x.id)), new Set([2, 3, 4]));
});

test('"Anh" trong tên ca sĩ không bị bỏ', () => {
  const { hang } = dungHangDoi(KHO, hieuYeuCau('bật Hà Anh Tuấn'), r);
  assert.equal(hang[0].id, 6);
});

test('bất kỳ: remix chỉ lấy kho REMIX; thường không lẫn remix; lọc ngôn ngữ', () => {
  assert.ok(dungHangDoi(KHO, hieuYeuCau('mở nhạc remix'), r).hang.every((x) => x.category === 'REMIX'));
  assert.ok(dungHangDoi(KHO, hieuYeuCau('bật nhạc đi'), r).hang.every((x) => x.category !== 'REMIX'));
  assert.deepEqual(dungHangDoi(KHO, hieuYeuCau('nhạc tiếng Anh'), r).hang.map((x) => x.id), [5]);
});

test('bài không có trong thư viện ⇒ hàng rỗng (để đi tìm YouTube), KHÔNG bật đại bài khác', () => {
  assert.equal(dungHangDoi(KHO, hieuYeuCau('bật bài Blinding Lights'), r).hang.length, 0);
});

test('tên bài ⇒ bài đó trước rồi nối bài cùng ca sĩ', () => {
  const { hang } = dungHangDoi(KHO, hieuYeuCau('lạc trôi'), r);
  assert.ok([3, 4].includes(hang[0].id));
  assert.ok(hang.some((x) => x.id === 2));
});

test('server tự bắt câu xin nhạc (log 15/11: model nói "bật rồi" mà không gửi lệnh)', async () => {
  const { khopXinNhac } = await import('./musicTim.js');
  assert.equal(khopXinNhac('Bật bài gì của Justin Bieber ấy'), 'justin bieber');
  assert.equal(khopXinNhac('bật cho tao một bài nhạc đi'), '');
  assert.equal(khopXinNhac('mở nhạc Sơn Tùng'), 'sơn tùng');
  assert.equal(khopXinNhac('Máy bật nhạc chưa? Sao tao không nghe thấy gì?'), '');
  assert.equal(khopXinNhac('tắt nhạc đi'), null);
  assert.equal(khopXinNhac('nhắc tao học bài lúc 8 giờ'), null);
  assert.equal(khopXinNhac('mở bài học tiếng Nhật'), null);
  assert.equal(khopXinNhac('kể chuyện cười đi'), null);
});
