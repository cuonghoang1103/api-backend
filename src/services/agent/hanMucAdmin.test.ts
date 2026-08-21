/**
 * ADMIN KHÔNG BỊ TRẦN TOKEN AGENT — nhưng VẪN BỊ ĐẾM, và VẪN BỊ TRẦN TIỀN.
 *
 * 21/08/2026: một việc tải tài liệu dài chạm 4,12/4 triệu token rồi dừng giữa
 * chừng, đúng lúc chủ web đang cần chạy nhất. Cùng lý do mà trần token NGÀY đã
 * miễn cho admin (`pro.service.ts` → `laAdmin`).
 *
 * Ba tính chất dưới đây dễ bị xoá nhầm khi ai đó dọn dẹp, và mỗi cái mất đi
 * gây một kiểu hỏng khác nhau:
 *
 *  1. Không tra `laAdmin` ⇒ admin lại bị chặn giữa việc.
 *  2. Đặt `daDung` về 0 cho admin ⇒ thanh đo luôn rỗng, và người DUY NHẤT sửa
 *     được ví chung lại là người DUY NHẤT không nhìn thấy nó đang cạn.
 *  3. Miễn luôn trần TIỀN ⇒ mất lưới đỡ thật: ví agent là của CẢ SITE, cạn nó
 *     là agent của mọi người cùng tắt.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const nguon = readFileSync(new URL('./quota.ts', import.meta.url), 'utf8');

test('trần token có tra laAdmin', () => {
  assert.ok(
    nguon.includes('laAdmin'),
    'xemHanMuc không tra vai trò ⇒ admin lại bị chặn giữa việc',
  );
  assert.ok(
    /miemTran = await laAdmin\(userId\)/.test(nguon),
    'không hỏi laAdmin với đúng userId đang xét',
  );
});

test('chỉ hạ `hetHan`, KHÔNG giấu mức đã dùng', () => {
  assert.ok(
    nguon.includes('hetHan: !miemTran && daDung >= tran'),
    'không còn miễn chặn cho admin',
  );
  assert.ok(
    !/miemTran[\s\S]{0,200}daDung: 0/.test(nguon),
    'đang đặt daDung về 0 cho admin — thanh đo sẽ nói dối về ví chung',
  );
});

test('tra vai trò hỏng thì MẶC ĐỊNH là người thường', () => {
  const i = nguon.indexOf('let miemTran = false');
  assert.ok(i > -1, 'không còn cờ miemTran');
  assert.ok(
    /let miemTran = false[\s\S]{0,400}catch/.test(nguon),
    'không có nhánh catch ⇒ DB hỏng một nhịp là mở trần cho tất cả',
  );
});

test('trần TIỀN vẫn áp cho MỌI người, kể cả admin', () => {
  const i = nguon.indexOf('export async function xemViAgent');
  assert.ok(i > -1, 'không còn xemViAgent');
  const than = nguon.slice(i);
  assert.ok(
    !than.includes('laAdmin'),
    'ví agent đã bị miễn cho admin — mất lưới đỡ cuối của cả site',
  );
});
