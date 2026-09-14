/**
 * Khoá đúng cái lỗi đã làm nút "Cài OpenCode Terminal" vô dụng.
 *
 * `ApiClient.baseUrl` là GỐC TÊN MIỀN (`https://api.cuongthai.com`), không
 * phải gốc API. Mọi lời gọi phải tự viết đủ `/api/v1/...`. Tôi viết thiếu, máy
 * chủ trả 404, và vì lời gọi nuốt lỗi nên nút hiện "chưa có key" y hệt như khi
 * người dùng thật sự chưa có key — người đã được duyệt key vẫn bị mời đi mua,
 * và không có dấu hiệu nào chỉ ra nguyên nhân.
 *
 * Đo thật 14/09/2026:
 *   /llm-keys/mine          → 404
 *   /api/v1/llm-keys/mine   → 401  (tồn tại, chỉ cần đăng nhập)
 *
 * `tsc` không bắt được vì cả hai đều là `string`.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { timKeyDangDung } from './NutOpenCode';

const nguon = readFileSync(new URL('./NutOpenCode.tsx', import.meta.url), 'utf8');

describe('NutOpenCode gọi đúng đường API', () => {
  it('mọi api.request đều có tiền tố /api/v1', () => {
    const duong = [...nguon.matchAll(/api\?\.request<[^>]*>\(\s*'([^']+)'/g)].map((m) => m[1]);
    expect(duong.length).toBeGreaterThan(0);
    for (const d of duong) {
      expect(d, `"${d}" thiếu tiền tố /api/v1 ⇒ máy chủ trả 404 và nút im lặng báo "chưa có key"`)
        .toMatch(/^\/api\/v1\//);
    }
  });

  it('hỏi máy chủ HỎNG phải khác với CHƯA CÓ KEY', () => {
    // Nuốt lỗi thành `null` rồi hiện đúng màn hình "đi mua key" là cách chắc
    // chắn để lần sau không ai tìm ra nguyên nhân.
    expect(nguon, 'không còn ghi nhận lỗi tải ⇒ lỗi hạ tầng lại trông như chưa có key')
      .toMatch(/setLoiTai\(/);
    expect(nguon).toMatch(/loiTai && !coKey/);
  });

  it('KHÔNG nhét key vào prompt gửi cho agent', () => {
    // Key phải đi qua IPC ghi file, không qua cổng LLM.
    const khoiPrompt = nguon.slice(nguon.indexOf('const chu = ['), nguon.indexOf("].join('\\n')"));
    expect(khoiPrompt, 'prompt có chứa biến key ⇒ key của khách bị gửi lên cổng LLM')
      .not.toMatch(/\$\{key\}|\bkey\b\s*,/);
    expect(nguon).toMatch(/vietCauHinh\(\{\s*\n?\s*key,/);
  });
});

/**
 * ═══ CHẠY THẬT logic chọn key, không chỉ đọc chữ trong file ═══
 *
 * Bộ kiểm cũ chỉ soi nguồn nên nó xanh trong khi nút vẫn hỏng: đường dẫn API
 * đã đúng, nhưng HÌNH DẠNG phản hồi thì sai (bóc `.data` hai lần). Người dùng
 * phải báo lại lần thứ hai mới lộ ra. Phép kiểm đọc chữ không thay được phép
 * kiểm chạy.
 */
describe('timKeyDangDung chạy với thân phản hồi THẬT', () => {
  const donDaDuyet = {
    id: 4, status: 'APPROVED', reason: 'x', key: 'sk-abcdefghijklmnop',
    quotaUsd: 150, adminNote: null, source: 'REQUEST', expiresAt: null,
    hetHan: false, createdAt: '', resolvedAt: '',
  };

  /** Y hệt `ApiClient.unwrap`: `return (envelope.data ?? envelope)`. */
  const unwrap = (phongBi: unknown) => (phongBi as { data?: unknown }).data ?? phongBi;

  it('tìm ra key sau khi request() đã bóc phong bì', () => {
    const traVe = unwrap({ success: true, data: [donDaDuyet] });
    expect(Array.isArray(traVe), 'unwrap phải trả về MẢNG — nếu không thì giả định này sai').toBe(true);
    expect(timKeyDangDung(traVe)?.key, 'người ĐÃ được duyệt key mà nút vẫn mời đi mua')
      .toBe(donDaDuyet.key);
  });

  it('vẫn tìm ra nếu một ngày phản hồi CÒN NGUYÊN phong bì', () => {
    expect(timKeyDangDung({ success: true, data: [donDaDuyet] })?.key).toBe(donDaDuyet.key);
  });

  it('không nhận key của đơn HẾT HẠN, BỊ TỪ CHỐI hay THU HỒI', () => {
    expect(timKeyDangDung([{ ...donDaDuyet, hetHan: true }])).toBeNull();
    expect(timKeyDangDung([{ ...donDaDuyet, status: 'REJECTED' }])).toBeNull();
    expect(timKeyDangDung([{ ...donDaDuyet, status: 'REVOKED' }])).toBeNull();
    expect(timKeyDangDung([{ ...donDaDuyet, key: null }])).toBeNull();
  });

  it('danh sách rỗng hay dữ liệu lạ ⇒ null, không ném', () => {
    expect(timKeyDangDung([])).toBeNull();
    expect(timKeyDangDung(null)).toBeNull();
    expect(timKeyDangDung({ loi: 'gì đó' })).toBeNull();
  });
});
