/**
 * BA CON SỐ TRẦN ẢNH PHẢI BẰNG NHAU.
 *
 *   • `MAX_ANH_THANG` — app quyết ảnh nào được gửi thẳng   (DinhKemCode.tsx)
 *   • `anhSchema.max()` — cửa IPC                          (shared/ipc.ts)
 *   • `MAX_ANH` — máy chủ lọc trước khi gọi cổng           (services/agent/turn.ts)
 *
 * Lệch một cái thì ảnh thứ n bị bỏ ở tầng có số NHỎ NHẤT: không lỗi, không
 * cảnh báo, thẻ ảnh vẫn nằm trên màn hình — model chỉ đơn giản không thấy nó.
 * Đúng họ với lỗi "ảnh dán không tới model" đã mất cả buổi để tìm ra.
 *
 * Đọc bằng REGEX trên mã nguồn, không import: ba hằng này nằm ở ba tầng khác
 * nhau (renderer / shared / backend) và backend không nằm trong cây build của
 * app — không có cách nào nạp cả ba vào cùng một tiến trình.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const GOC_APP = path.resolve(__dirname, '../../..');
const GOC_WEB = path.resolve(GOC_APP, '..');

function so(duong: string, mau: RegExp): number {
  const tho = fs.readFileSync(duong, 'utf8');
  const m = mau.exec(tho);
  if (!m) throw new Error(`không tìm thấy ${mau} trong ${duong} — hằng vừa bị đổi tên?`);
  // Bỏ `_` phân nhóm: `Number('5_600_000')` là NaN, và NaN đi qua `toEqual`
  // thành một phép so sánh chẳng khẳng định gì.
  const n = Number((m[1] ?? '').replace(/_/g, ''));
  if (!Number.isFinite(n)) throw new Error(`đọc ra số không hợp lệ: "${m[1]}" ở ${duong}`);
  return n;
}

describe('trần số ảnh', () => {
  it('ba tầng khai CÙNG một con số', () => {
    const app = so(path.join(GOC_APP, 'src/renderer/features/chat/DinhKemCode.tsx'),
      /const MAX_ANH_THANG = (\d+);/);
    const ipc = so(path.join(GOC_APP, 'src/shared/ipc.ts'),
      /anh: z\.array\(anhSchema\)\.max\((\d+)\)/);
    const mayChu = so(path.join(GOC_WEB, 'src/services/agent/turn.ts'),
      /const MAX_ANH = (\d+);/);

    expect({ app, ipc, mayChu }).toEqual({ app: 8, ipc: 8, mayChu: 8 });
  });

  it('trần BYTE mỗi ảnh cũng phải khớp app ↔ IPC ↔ máy chủ', () => {
    // Cùng cái bẫy: app cho qua một ảnh 5,5MB mà IPC chặn ở 5MB thì cả lượt
    // gửi bị TỪ CHỐI — lần này ồn ào, nhưng vẫn là do hai con số lệch nhau.
    const app = so(path.join(GOC_APP, 'src/renderer/features/chat/DinhKemCode.tsx'),
      /const TRAN_ANH_BYTE = (\d+) \* 1024 \* 1024;/);
    const ipc = so(path.join(GOC_APP, 'src/shared/ipc.ts'),
      /export const anhSchema[\s\S]{0,200}?\.max\((\d[\d_]*)\)/);
    const mayChu = so(path.join(GOC_WEB, 'src/services/agent/turn.ts'),
      /const MAX_ANH_BYTES = (\d[\d_]*);/);

    /*
     * App đo BYTE GỐC (4MB); hai tầng kia đo CHUỖI base64. Nên không so bằng
     * nhau — so đúng phép biến đổi: base64 dài `ceil(n/3)*4`, cộng tiền tố
     * `data:image/png;base64,`.
     *
     * ⚠️ Dùng ĐÚNG công thức, đừng ước lượng: bản đầu tôi đặt hệ số 1,34
     * (chặt hơn 4/3 = 1,3333) và chốt này ĐỎ trong khi mã hoàn toàn đúng —
     * suýt nữa thì đi nới trần thật để chiều một con số tôi bịa ra.
     */
    const byteGoc = app * 1024 * 1024;
    const canToiThieu = Math.ceil(byteGoc / 3) * 4 + 'data:image/png;base64,'.length;
    expect(ipc).toBe(mayChu);
    expect(ipc).toBeGreaterThanOrEqual(canToiThieu);
  });
});
