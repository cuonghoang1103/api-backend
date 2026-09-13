/**
 * Kiểm VÍ TIỀN AI — của từng người, cửa sổ 5 giờ, tách theo mảng.
 *
 * Đây là phép kiểm ĐỌC NGUỒN. Nói rõ vì sao: mọi nhánh của `xemViTien` đều
 * chạm CSDL và `pro.service`, nên chạy thật cần một Postgres có dữ liệu —
 * thứ CI không có. Những chỗ dưới đây là những chỗ mà một lần "dọn dẹp" vô
 * tình sẽ biến ví riêng thành ví chung trở lại, im lặng.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const thuMuc = path.dirname(fileURLToPath(import.meta.url));
const nguon = readFileSync(path.join(thuMuc, 'viTien.ts'), 'utf8');

test('câu truy vấn LỌC theo userId — nếu không, ví lại là của cả web', () => {
  /*
   * Lỗi gốc, người dùng báo 11/09/2026: ví cũ cộng `costUsd` của MỌI tài khoản
   * rồi so với một con số, nên một người tiêu hết là tất cả bị chặn — kể cả
   * tài khoản vừa tạo.
   */
  const i = nguon.indexOf('const dieuKien =');
  assert.ok(i > -1, 'không còn chỗ dựng điều kiện truy vấn');
  assert.match(
    nguon.slice(i, i + 200),
    /userId,\s*feature: NHAN\[mang\]/,
    'điều kiện thiếu userId hoặc thiếu nhãn mảng ⇒ ví trộn của nhiều người/nhiều mảng',
  );
});

test('⛔ khoá nhớ đệm PHẢI gồm cả `mang`', () => {
  /*
   * Dùng chung một khoá cho hai mảng thì trong đúng 60 giây, số của AI Code
   * hiện ra ở ô AI Chat — người dùng nhìn thấy mình "đã tiêu" ở một chỗ chưa
   * hề mở, và tệ hơn: có thể bị CHẶN ở mảng chưa dùng.
   */
  assert.match(nguon, /const khoa = `\$\{userId\}:\$\{mang\}`/);
});

test('hai mảng ánh xạ sang HAI nhãn feature khác nhau', () => {
  const i = nguon.indexOf('const NHAN');
  const than = nguon.slice(i, i + 200);
  assert.match(than, /code: 'agent'/);
  assert.match(than, /chat: 'chat'/);
});

test('admin KHÔNG bị chặn nhưng VẪN được đếm', () => {
  /*
   * Chỉ hạ `canVi`, không đặt `daTieu` về 0. Giấu mức tiêu của admin đi thì
   * người duy nhất sửa được lại là người duy nhất không nhìn thấy — cùng lý do
   * đã ghi ở `quota.ts` cho trần token.
   */
  // `tong` = phần app desktop + phần key terminal (gộp ví 14/09/2026).
  // Khớp lỏng hơn một chút để đổi tên biến không làm đỏ phép kiểm, nhưng
  // VẪN chốt đúng hai điều cần bảo vệ: có `!miemTran`, và so với `tran`.
  assert.match(nguon, /canVi: !miemTran && \w+ >= tran/);
  assert.ok(
    !/miemTran[\s\S]{0,300}daTieu: 0[\s\S]{0,100}usd/.test(nguon),
    'đang giấu số liệu của admin',
  );
});

test('CSDL hỏng ⇒ CHO ĐI TIẾP, không tự khoá', () => {
  // Một cái khoá tự sập khi đồng hồ đo hỏng thì tệ hơn là không có khoá.
  const i = nguon.indexOf('catch (err)');
  assert.ok(i > -1);
  assert.match(nguon.slice(i, i + 300), /return rong\(/);
});

test('trần mặc định 100 $, và `0` là TẮT có chủ ý', () => {
  assert.match(nguon, /const MAC_DINH_TRAN_USD = 100/);
  assert.match(nguon, /if \(tran <= 0\) return rong\(/);
});

test('cửa sổ TRƯỢT, không phải reset theo mốc', () => {
  /*
   * "Reset mỗi 5 giờ" theo mốc cố định làm người bắt đầu lúc 04:50 chỉ được 10
   * phút. Cửa sổ trượt cộng tiền trong 5 giờ VỪA QUA — cùng lối với trần token
   * ở `quota.ts`.
   */
  assert.match(nguon, /const tu = new Date\(gio - ms\)/);
  assert.match(nguon, /createdAt: \{ gte: tu \}/);
});

test('câu báo nói RÕ đây là ví riêng, và mảng kia vẫn dùng được', () => {
  const i = nguon.indexOf('export function loiCanViTien');
  const than = nguon.slice(i);
  assert.match(than, /ví RIÊNG của tài khoản bạn/);
  assert.match(than, /vẫn dùng được bình thường/);
});

test('gộp ví: phần key terminal PHẢI được cộng vào cùng một ví', () => {
  /*
   * Người mua gói key terminal dùng CHUNG hạn mức với AI Code trên app.
   * Thiếu phép cộng này thì họ có HAI ví riêng và được gấp đôi thứ đã trả
   * tiền — đúng lỗi đã sửa ngày 14/09/2026.
   */
  assert.match(nguon, /const tong = usd \+ terminalUsd/);
  assert.match(nguon, /daTieu: tong/);
  assert.match(nguon, /conLai: Math\.max\(0, tran - tong\)/);
});

test('gộp ví: New API hỏng ⇒ phần terminal = 0, KHÔNG chặn người dùng', () => {
  // Cùng nguyên tắc với CSDL hỏng: đồng hồ đo hỏng không được tự khoá cửa.
  const kt = readFileSync(new URL('./keyTerminal.ts', import.meta.url), 'utf8');
  assert.match(kt, /catch[\s\S]{0,200}daTieuUsd: 0/);
  assert.ok(!/throw new/.test(kt), 'keyTerminal KHÔNG được ném lỗi ra ngoài');
});

test('gộp ví: trần riêng CHỈ áp cho mảng code, không đụng AI Chat', () => {
  // Gói bán ra là gói AI Code/terminal. Áp nhầm sang chat là lặng lẽ nới
  // trần một mảng không ai mua.
  assert.match(nguon, /if \(mang === 'code'\)[\s\S]{0,200}tranRiengCuaNguoi/);
});
