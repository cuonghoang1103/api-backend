/**
 * MỌI đường hỏi AI có ô dán ảnh đều phải MANG ĐƯỢC ảnh qua IPC.
 *
 * Sinh ra từ một lỗi tôi tự gây ra 15/09/2026 và tự bắt lại khi rà: chế độ gia
 * sư trong cửa sổ robot có ô dán ảnh, khung chat hiện tấm ảnh trong bong bóng
 * của người dùng — nhưng lược đồ `robot:hoiGiaSu` KHÔNG có trường ảnh, nên nó
 * không bao giờ rời khỏi máy. Model trả lời về một tấm ảnh nó chưa từng thấy.
 *
 * ⚠️ Đây là loại hỏng tệ nhất: người dùng KHÔNG THỂ phát hiện. Họ đang nhìn
 * thấy chính tấm ảnh mình vừa dán ngay trên màn hình, nên không có lý do gì để
 * nghi ngờ. Câu trả lời sai thì họ kết luận "AI dốt", không phải "ảnh bị mất".
 *
 * Phép kiểm này gác HỢP ĐỒNG, không gác giao diện: thêm một đường hỏi AI mới
 * có ảnh thì thêm tên kênh vào danh sách dưới đây.
 */
import { describe, expect, it } from 'vitest';
import { INVOKE_CHANNELS } from './ipc';

/** Những kênh hỏi AI mà giao diện có ô dán ảnh. */
const KENH_CO_ANH = ['robot:hoi', 'robot:hoiGiaSu'] as const;

describe('ảnh phải đi được qua IPC', () => {
  for (const kenh of KENH_CO_ANH) {
    it(`${kenh} nhận được ảnh`, () => {
      const schema = INVOKE_CHANNELS[kenh];
      expect(schema, `${kenh} chưa khai lược đồ`).toBeTruthy();

      /* Thử PHÂN TÍCH một payload CÓ ảnh. Soi tên trường bằng mắt là không đủ:
         một trường khai `z.never()` hay đặt sai tên vẫn "có mặt" mà vứt dữ
         liệu. Chỉ chạy thật mới biết nó nhận. */
      const thu = kenh === 'robot:hoi'
        ? { chu: 'ảnh này là gì', anh: ['data:image/png;base64,AAAA'] }
        : { lessonId: 1, chu: 'ảnh này là gì', anh: ['data:image/png;base64,AAAA'] };

      const kq = (schema as { safeParse: (v: unknown) => { success: boolean; data?: unknown } }).safeParse(thu);
      expect(kq.success, `${kenh} từ chối payload có ảnh`).toBe(true);
      expect(
        (kq.data as { anh?: unknown[] })?.anh,
        `${kenh} nhận payload nhưng NUỐT mất ảnh — đúng cái hỏng câm này sinh ra để chặn`,
      ).toHaveLength(1);
    });
  }
});
