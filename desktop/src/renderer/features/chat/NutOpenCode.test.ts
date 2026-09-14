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
