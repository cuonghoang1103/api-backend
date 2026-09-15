/**
 * Lượt agent KHÔNG được treo mãi, và thiếu quyền thì phải CHỈ CHỖ BẬT.
 *
 * Cả hai đều từ một ảnh người dùng gửi 16/09/2026:
 *
 *   ① "step 150/160 · Odin đang xem kết quả lệnh… · 454s" và nút Dừng vẫn đó
 *      — *"làm xong rồi các bước vẫn chạy… phải để tôi ấn stop thủ công rất
 *      phiền"*. Canh im lặng 120s KHÔNG nổ, nghĩa là cổng vẫn nhỏ giọt byte
 *      mà lượt không bao giờ dứt.
 *   ② Agent nói *"Trang đó dùng JavaScript render nên tôi không đọc được"* và
 *      người dùng *"tưởng con AI Code của tôi bị dỏm"* — trong khi app làm
 *      được, chỉ cần bật công tắc Trình duyệt.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TRAN_IM_LANG_MS, TRAN_MOT_LUOT_MS } from './hanImLang';

const goc = join(import.meta.dirname, '../../..');
const loop = readFileSync(join(goc, 'src/main/agent/loop.ts'), 'utf8');
const prompt = readFileSync(join(goc, '../src/services/agent/prompt.ts'), 'utf8');

describe('① lượt không treo mãi', () => {
  it('có hạn TỔNG cho một lượt, ngoài canh im lặng', () => {
    expect(TRAN_MOT_LUOT_MS).toBeGreaterThan(TRAN_IM_LANG_MS);
    /* Đủ rộng để không giết oan lượt nặng (quan sát được ~90s), đủ chặt để
       người dùng không ngồi nhìn 454 giây. */
    expect(TRAN_MOT_LUOT_MS).toBeGreaterThanOrEqual(180_000);
    expect(TRAN_MOT_LUOT_MS).toBeLessThanOrEqual(600_000);
  });

  it('hạn tổng ĐI KÈM tín hiệu huỷ, không thay thế nó', () => {
    /* ⛔ Gắn mỗi hạn giờ vào `signal` sẽ nuốt mất nút Dừng — đổi một lỗi khó
       chịu lấy một lỗi tệ hơn. */
    expect(loop).toMatch(/AbortSignal\.any\(\[o\.signal,\s*henLuot\]\)/);
  });

  it('hết hạn có mã RIÊNG, không lẫn với "cổng im lặng"', () => {
    expect(loop).toContain('LUOT_QUA_LAU');
    expect(loop).toContain('GATEWAY_IM_LANG');
    const i = loop.indexOf('LUOT_QUA_LAU');
    expect(i).toBeGreaterThan(-1);
  });

  it('cả hai mã đều THỬ LẠI được — không thì một lần cổng ngẩn ngơ giết cả việc 150 bước', () => {
    /* Cắt từ chỗ KHAI BÁO tập hợp, không phải lần nhắc tên đầu tiên — tên này
       xuất hiện ở chỗ dùng (`MA_DANG_THU_LAI.has(...)`) trước khi được khai
       báo ở cuối tệp, và cắt nhầm chỗ thì phép kiểm đỏ vì lý do sai. */
    const i = loop.indexOf('const MA_DANG_THU_LAI = new Set([');
    expect(i, 'không thấy khai báo MA_DANG_THU_LAI').toBeGreaterThan(-1);
    const khoi = loop.slice(i, i + 2000);
    expect(khoi).toContain('LUOT_QUA_LAU');
    expect(khoi).toContain('GATEWAY_IM_LANG');
  });

  it('prompt cấm gọi thêm tool sau khi đã tóm tắt', () => {
    expect(prompt).toMatch(/XONG THÌ DỪNG/);
    expect(prompt).toMatch(/KHÔNG gọi thêm tool nào/);
  });
});

describe('② thiếu quyền thì chỉ chỗ bật', () => {
  it('prompt kể TÊN công tắc, không chỉ nói "không có tool"', () => {
    for (const nut of ['Trình duyệt', 'Chạy lệnh', 'Sửa file']) {
      expect(prompt, `prompt không kể tên công tắc "${nut}"`).toContain(nut);
    }
    expect(prompt).toMatch(/thanh ngay trên khung chat/);
  });

  it('prompt CẤM thẳng câu "tôi không đọc được trang đó" nếu không kèm chỗ bật', () => {
    expect(prompt).toMatch(/tôi không đọc được trang đó/);
    expect(prompt).toMatch(/CÔNG TẮC ĐANG TẮT/);
  });

  it('chỉ nhắc công tắc ĐANG TẮT — bật rồi mà còn nhắc là làm phiền', () => {
    /* Khối được dựng từ `dangTat`, tức đã lọc theo trạng thái thật của lượt. */
    expect(prompt).toMatch(/const dangTat = tatCa\.filter\(\(x\) => !x\.co\)/);
    expect(prompt).toMatch(/if \(dangTat\.length\)/);
  });
});
