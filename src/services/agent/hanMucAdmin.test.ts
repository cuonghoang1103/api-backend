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

/*
 * ⛔⛔ VÍ AGENT PHẢI LÀ CỦA TỪNG NGƯỜI, KHÔNG PHẢI CỦA CẢ WEB.
 *
 * Lỗi thật, người dùng báo 11/09/2026: *"tài khoản A của tôi dùng nhiều bị
 * giới hạn, tôi vào tài khoản B chưa sử dụng vẫn bị dính limit"*.
 *
 * Câu truy vấn cũ là `where: { feature: 'agent', createdAt: {...} }` — KHÔNG
 * có `userId`. Nó cộng tiền của mọi tài khoản rồi so với một con số duy nhất,
 * nên một người tiêu hết là tất cả bị chặn, kể cả tài khoản vừa tạo.
 *
 * Đây là họ hàng của [[feedback_req_user_id_khong_ton_tai]]: một trần "mỗi
 * người" mà quên mất mỗi-người thì nó âm thầm thành trần toàn-web, và không có
 * lỗi nào nổi lên — chỉ có người dùng không hiểu vì sao mình bị chặn.
 */
test('ví agent lọc theo userId — không cộng tiền của cả web', () => {
  const i = nguon.indexOf('async function tongTienAgent');
  assert.ok(i > -1, 'không còn hàm cộng tiền agent');
  const than = nguon.slice(i, i + 600);
  assert.match(
    than,
    /userId === null \? \{\} : \{ userId \}/,
    'câu truy vấn không nhận userId ⇒ ví lại thành của cả web',
  );
});

test('`xemViAgent` BẮT BUỘC nhận userId', () => {
  // Để `xemViAgent()` gọi được không tham số là mời gọi đúng lỗi cũ quay lại.
  assert.match(
    nguon,
    /export async function xemViAgent\(userId: number\)/,
    'xemViAgent phải nhận userId bắt buộc',
  );
});

test('câu báo hết ví nói RÕ đó là ví của ai', () => {
  // Câu cũ chỉ viết "Ngân sách AI ... đã hết", nên người bị chặn bởi ví CHUNG
  // vẫn tưởng mình đã tiêu hết phần của mình.
  const i = nguon.indexOf('export function loiCanVi');
  const than = nguon.slice(i, i + 700);
  assert.match(than, /TÀI KHOẢN BẠN/);
  assert.match(than, /CHUNG của cả web/);
});

test('trần CHUNG mặc định TẮT — quyết định của người dùng 08/09/2026', () => {
  const i = nguon.indexOf('export function tranTienSiteNgay');
  assert.ok(i > -1, 'không còn trần site');
  const than = nguon.slice(i, i + 300);
  assert.match(
    than,
    /raw === undefined \|\| raw === ''\) return 0/,
    'trần chung tự bật khi không đặt env — người dùng đã yêu cầu KHÔNG giới hạn',
  );
});
