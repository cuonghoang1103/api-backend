/**
 * ============================================================
 * BẢNG CHẠY LỆNH — terminal rút gọn ngay trong app
 * ============================================================
 *
 * Người dùng: "có terminal ở trong này luôn giống claude app được không?"
 *
 * ─── ⚠️ ĐÂY KHÔNG PHẢI TERMINAL THẬT, và phải nói thẳng ───
 * Terminal thật cần một PTY. `node-pty` là module NATIVE: phải biên dịch lại
 * theo ABI của Electron cho cả ba nền tảng, tức là đụng thẳng vào đường dựng
 * bản cài — rủi ro vỡ build cho cả ba, đổi lấy `vim` chạy được trong app.
 *
 * Cái ở đây chạy một lệnh, chảy đầu ra, và dừng được. KHÔNG có `vim`, không có
 * chương trình hỏi-đáp tương tác, không màu ANSI, không điều khiển con trỏ.
 * Đủ cho `npm test`, `npm run build`, `git status` — phần lớn việc thật.
 *
 * ─── Vì sao dùng lại `lenhNen.ts` thay vì tự spawn ───
 * Hạ tầng đó agent đã dùng và đã có bộ kiểm, kèm ba thứ dễ quên nhất:
 *  • trần số tiến trình cùng lúc (chống bỏ quên `next dev` ăn CPU mãi),
 *  • dọn theo CUỘC và dọn lúc thoát app,
 *  • dừng là giết CẢ NHÓM tiến trình — `npm test` đẻ ra node → vitest → worker,
 *    giết mỗi `npm` thì cây con vẫn sống và người vừa bấm Dừng tưởng đã dừng.
 * Tự spawn lại ở đây là chép lại ba thứ đó, rồi quên một cái.
 *
 * ─── ⚠️ Vì sao `cuocId` được ĐỔI TIỀN TỐ ───
 * `docDauRaNen` trả phần MỚI kể từ lần đọc trước rồi ĐẨY con trỏ đọc lên. Nếu
 * bảng này và agent cùng đọc một lệnh thì chúng ăn mất đầu ra của nhau — mỗi
 * bên thấy một nửa log, không bên nào biết mình thiếu. Tiền tố `term:` tách
 * hẳn hai không gian: `dsLenhNen(cuocId)` của agent không thấy lệnh của bảng
 * này, và ngược lại.
 */
import { batLenhNen, docDauRaNen, dungLenhNen } from '../agent/lenhNen';
import { gocCuaCuoc } from '../agent/loop';
import { handle } from './index';

/** Không gian tên riêng — xem chú thích đầu tệp. */
const khoaCuoc = (cuocId: string): string => `term:${cuocId}`;

export function registerTerminalHandlers(): void {
  handle('terminal:chay', ({ cuocId, lenh }) => {
    /*
     * Bắt buộc phải có thư mục dự án.
     *
     * Không có gốc thì `cwd` rơi về thư mục đang chạy app — với bản đã cài đó
     * là `/Applications/…`, nơi lệnh vừa vô nghĩa vừa nguy hiểm. Thà từ chối
     * và nói rõ còn hơn chạy đúng lệnh ở sai chỗ.
     */
    const goc = gocCuaCuoc(cuocId);
    if (!goc) {
      return {
        ok: false,
        loi: 'Chưa chọn thư mục dự án. Lệnh cần một chỗ để chạy — hãy mở một dự án trước.',
      };
    }
    return batLenhNen({ lenh, cwd: goc, cuocId: khoaCuoc(cuocId) });
  });

  handle('terminal:doc', ({ id }) => docDauRaNen(id));

  handle('terminal:dung', ({ id }) => dungLenhNen(id));
}
