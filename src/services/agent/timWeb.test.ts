/**
 * `tim_web` — canh hành vi khi CHƯA có khoá, và ranh giới "khoá ở máy chủ".
 *
 * Cách hỏng nguy hiểm nhất của một tool tìm kiếm KHÔNG phải là ném lỗi, mà là
 * trả về RỖNG: model đọc "không có kết quả" rồi nói với người dùng "tôi không
 * tìm thấy gì" — trong khi sự thật là quản trị viên chưa cắm khoá. Một câu trả
 * lời sai mà nghe hợp lý thì không ai đi kiểm lại.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { timWeb, timWebSanSang } from './timWeb.js';

function xoaKhoa(): void {
  delete process.env.TAVILY_API_KEY;
  delete process.env.SEARCH_API_KEY;
}

test('chưa cấu hình: nói RÕ, KHÔNG trả rỗng', async () => {
  xoaKhoa();
  const r = await timWeb({ q: 'thư viện abc bản mới nhất' });
  assert.equal(timWebSanSang(), false);
  assert.ok(r.content.includes('CHƯA ĐƯỢC CẤU HÌNH'), 'phải nói thẳng là chưa cấu hình');
  assert.ok(r.content.includes('TAVILY_API_KEY'), 'phải nêu đúng tên biến cần cắm');
  assert.ok(/KHÔNG phải/.test(r.content), 'phải phân biệt với "không tìm thấy gì"');
  assert.equal(r.summary, 'chưa cấu hình');
});

test('đọc được cả hai tên biến khoá', () => {
  xoaKhoa();
  assert.equal(timWebSanSang(), false);
  process.env.SEARCH_API_KEY = 'x';
  assert.equal(timWebSanSang(), true, '`SEARCH_API_KEY` là tên thứ hai, phải nhận');
  xoaKhoa();
});

test('thiếu "q" thì báo lỗi, KHÔNG đi gọi mạng', async () => {
  process.env.TAVILY_API_KEY = 'x';
  const r = await timWeb({});
  assert.equal(r.summary, 'thiếu câu hỏi');
  xoaKhoa();
});

test("là vòng MÁY CHỦ — khoá không bao giờ xuống app", () => {
  const t = readFileSync(new URL('./tools.ts', import.meta.url), 'utf8');
  const i = t.indexOf("name: 'tim_web'");
  assert.ok(i > -1, 'không thấy khai báo tim_web');
  const than = t.slice(i, i + 500);
  assert.ok(
    than.includes("ring: 'server'"),
    "phải là ring:'server' — app tải về được, .asar mở bằng một lệnh",
  );
});
