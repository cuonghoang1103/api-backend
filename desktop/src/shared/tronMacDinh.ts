/**
 * Điểm xuất phát của bàn trộn Xưởng Remix — MỘT bảng cho cả main lẫn giao diện.
 *
 * ─── Vì sao một tệp riêng, không nằm trong `ipc.ts` ───
 * `ipc.ts` khai hàng trăm schema zod, và mọi `z.object(...)` là một LỜI GỌI
 * HÀM — trình gói không rút gọn được, nên chỉ cần renderer nạp MỘT giá trị
 * (không phải kiểu) từ đó là cả zod đi theo vào gói. Ở đây chỉ có dữ liệu
 * thuần và một `import type` (bị xoá lúc dịch), nên nó không thêm một byte
 * nào vào lúc chạy.
 *
 * ─── Vì sao không chép sang renderer cho nhanh ───
 * Giao diện phải hiện đúng những con số mà bộ trộn sẽ dùng. Chép tay là mầm
 * trôi dạt, và kho này đã trả giá đúng kiểu ấy: union `ContentType` chép tay
 * trong `seed.ts` (08/08/2026) qua sạch mọi phép kiểm rồi vỡ trên production.
 *
 * ─── Mỗi con số có lý do, không phải số đẹp ───
 *   `drums`  KHÔNG duck. Ghì trống theo chính cú kick của nó là tự ăn mất cú
 *            kick — lỗi hay gặp nhất khi mới học sidechain.
 *   `bass`   duck sâu nhất. Bass và kick tranh nhau đúng một dải tần, và cú
 *            duck chính là cách nhường chỗ. 0,7 nghe rõ mà chưa lố.
 *   `other`  duck vừa, chắn trầm 90 Hz — nhạc nền không cần gì dưới đó.
 *   `vocals` duck nhẹ; ghì giọng mạnh là nghe ra ngay có máy can thiệp. Chắn
 *            trầm cao hơn (110 Hz) vì giọng người không xuống tới đó, nên mọi
 *            thứ dưới mức ấy trong stem giọng đều là rò từ bộ tách.
 */
import type { CaiDatStemTron } from './ipc';

export const TRON_MAC_DINH: Record<string, CaiDatStemTron> = {
  drums:  { bat: true, gainDb: 0,    chanTramHz: 0,   duck: 0 },
  bass:   { bat: true, gainDb: -1,   chanTramHz: 0,   duck: 0.7 },
  other:  { bat: true, gainDb: -1.5, chanTramHz: 90,  duck: 0.35 },
  vocals: { bat: true, gainDb: 0,    chanTramHz: 110, duck: 0.15 },
};
