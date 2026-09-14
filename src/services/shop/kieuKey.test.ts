/**
 * Khoá RANH GIỚI TIỀN giữa hai loại key terminal.
 *
 * Người dùng chốt 14/09/2026:
 *   · key MUA BẰNG TIỀN THẬT (`source: 'SHOP'`) → hạn mức RIÊNG, KHÔNG dùng
 *     chung ví AI Code của app desktop;
 *   · key XIN theo quyền lợi Pro (`source: 'REQUEST'`) → DÙNG CHUNG ví.
 *
 * Đảo ngược chiều này không làm vỡ build, không làm đỏ phép kiểm nào khác, và
 * không ai thấy — nó chỉ hiện ra khi một khách đã trả tiền phát hiện hạn mức
 * của mình bị trừ bởi việc họ làm trên app desktop. Nên phải có chốt ở đây.
 *
 * Kiểm bằng NGUỒN vì logic nằm trong truy vấn Prisma: dựng một CSDL giả để
 * chạy thật thì tốn hơn giá trị nó mang lại, còn phép kiểm nguồn thì bắt đúng
 * cái sai duy nhất đáng sợ — ai đó xoá điều kiện `source`.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const doc = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');

test('ví chung CHỈ nhận key xin theo Pro, không nhận key mua ở shop', () => {
  const s = doc('../agent/keyTerminal.ts');
  assert.match(
    s,
    /function keyGopVi\(\)[\s\S]{0,300}?source:\s*'REQUEST'/,
    'keyTerminal không còn lọc theo source REQUEST ⇒ key MUA ở shop bị trừ chung ví',
  );
  // Cả hai nơi hỏi ví đều phải đi qua bộ lọc đó.
  const soLan = (s.match(/keyGopVi\(\)/g) ?? []).length;
  assert.ok(soLan >= 3, `keyGopVi() chỉ xuất hiện ${soLan} lần — có truy vấn nào bỏ quên bộ lọc?`);
});

test('endpoint nội bộ trả cờ gopVi để canh biết loại key', () => {
  const s = doc('../../routes/internal.routes.ts');
  assert.match(s, /gopVi\s*=\s*d\.source === 'REQUEST'/, 'mất cách tính gopVi');
  assert.match(s, /gopVi,/, 'gopVi không được trả ra ngoài');
  // Key không gộp ví thì số đã tiêu ở app desktop KHÔNG được rò sang.
  assert.match(s, /gopVi \? Math\.round/, 'daTieuUsd không còn phụ thuộc gopVi ⇒ rò số liệu sang key mua');
});

test('canh bỏ qua việc gộp ví với key mua, nhưng VẪN áp hạn gói', () => {
  const s = doc('../../../services/cong-llm/canh/canh.mjs');
  const iHan = s.indexOf('expired_time: hetHan');
  const iBoQua = s.indexOf('tin.gopVi === false');
  assert.ok(iHan > 0, 'canh không còn đặt expired_time ⇒ gói 30 ngày chạy vĩnh viễn');
  assert.ok(iBoQua > 0, 'canh không còn phân biệt gopVi ⇒ key mua bị trừ chung ví');
  // Thứ tự QUAN TRỌNG: đặt hạn TRƯỚC rồi mới bỏ qua. Ngược lại thì key mua ở
  // shop không bao giờ được ghi hạn, và gói "30 ngày" chạy mãi mãi.
  assert.ok(iHan < iBoQua, 'đặt hạn gói nằm SAU nhánh bỏ qua ⇒ key mua không bao giờ hết hạn');
});
