import { test } from 'node:test';
import assert from 'node:assert/strict';
import dns from 'node:dns';
import { docBangDuPhong, caiDnsDuPhong } from './dnsDuPhong.js';

test('đọc bảng: mặc định có rambo; off ⇒ rỗng; nhiều tên miền; bỏ IP rác', () => {
  assert.deepEqual(docBangDuPhong(undefined).get('rambo.ai.vn'), ['172.67.171.45', '104.21.39.183']);
  assert.equal(docBangDuPhong('off').size, 0);
  const b = docBangDuPhong('A.example=1.2.3.4, x ;b.example=::1');
  assert.deepEqual(b.get('a.example'), ['1.2.3.4']);
  assert.deepEqual(b.get('b.example'), ['::1']);
});

test('chỉ tên miền khai báo + chỉ khi tra cứu hỏng mới dùng IP dự phòng', async () => {
  caiDnsDuPhong('khong-ton-tai-ctw.invalid=203.0.113.7');
  const hoi = (h: string, o: dns.LookupOptions = {}) => new Promise<unknown>((res) => dns.lookup(h, o, (e, a) => res(e ? e.code : a)));
  assert.equal(await hoi('khong-ton-tai-ctw.invalid'), '203.0.113.7');
  assert.deepEqual(await hoi('khong-ton-tai-ctw.invalid', { all: true }), [{ address: '203.0.113.7', family: 4 }]);
  assert.equal(await hoi('khong-ton-tai-khac.invalid'), 'ENOTFOUND', 'tên miền không khai ⇒ lỗi giữ nguyên');
  assert.equal(await hoi('localhost', { family: 4 }), '127.0.0.1', 'tra cứu thường thành công ⇒ không đổi gì');
});
