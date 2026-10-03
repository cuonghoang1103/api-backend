/**
 * Kỹ năng của trợ lý trong khung chat robot — chip chọn nhanh.
 *
 * Chủ app 03/10/2026: "tôi thường hỏi ảnh, code, toán, ngôn ngữ Anh, Nhật,
 * tiếng Việt". Mỗi chip chỉ gửi một MÃ (`kyNang`) lên máy chủ; luật thật nằm ở
 * `src/services/troLy/kyNangTroLy.ts` bên backend, nơi nó được lọc bằng danh
 * sách trắng. "Tự động" để máy chủ tự nhận việc theo câu hỏi.
 *
 * Biểu tượng là một CHỮ ngắn (∑, {}, あ…) chứ không phải emoji: nhìn ra ngay
 * việc gì, và cùng một nét với phần còn lại của khung.
 */
import type { RobotKyNang } from '../../shared/ipc';

export interface KyNangChip {
  id: RobotKyNang;
  ten: string;
  /** Ký hiệu ngắn trên chip. */
  kyHieu: string;
  /** Chữ mờ trong ô nhập khi chọn chip này. */
  goiYNhap: string;
  /** Câu mẫu bấm vào là điền sẵn vào ô nhập (không gửi ngay). */
  mau: string[];
}

export const KY_NANG: readonly KyNangChip[] = [
  {
    id: 'tu-dong', ten: 'Tự động', kyHieu: '✦',
    goiYNhap: 'Hỏi gì cũng được — tớ tự nhận việc…',
    mau: ['Tóm tắt giúp mình đoạn này', 'Giải thích khái niệm này thật dễ hiểu'],
  },
  {
    id: 'anh', ten: 'Ảnh', kyHieu: '▣',
    goiYNhap: 'Dán ảnh (Ctrl/⌘+V) hoặc bấm nút kẹp ảnh…',
    mau: ['Đọc đề trong ảnh rồi giải từng bước', 'Ảnh lỗi này nghĩa là gì, sửa sao?'],
  },
  {
    id: 'code', ten: 'Code', kyHieu: '{ }',
    goiYNhap: 'Dán code hoặc thông báo lỗi…',
    mau: ['Vì sao đoạn code này lỗi?', 'Viết lại đoạn này gọn và dễ đọc hơn'],
  },
  {
    id: 'toan', ten: 'Toán', kyHieu: '∑',
    goiYNhap: 'Nhập đề toán, tớ giải từng bước…',
    mau: ['Giải từng bước: 2x² − 5x + 2 = 0', 'Tính đạo hàm của y = x·ln(x)'],
  },
  {
    id: 'tieng-anh', ten: 'Tiếng Anh', kyHieu: 'EN',
    goiYNhap: 'Hỏi từ vựng, ngữ pháp, hay dán câu cần sửa…',
    mau: ['Sửa ngữ pháp: "I have went to school yesterday"', 'Phân biệt "affect" và "effect"'],
  },
  {
    id: 'tieng-nhat', ten: 'Tiếng Nhật', kyHieu: 'あ',
    goiYNhap: 'Hỏi ngữ pháp, kanji, cách đọc…',
    mau: ['Giải thích ngữ pháp 〜てもいい', 'Đọc và dịch: 毎日日本語を勉強します'],
  },
  {
    id: 'tieng-viet', ten: 'Tiếng Việt', kyHieu: 'Vi',
    goiYNhap: 'Dán đoạn văn cần sửa hay viết lại…',
    mau: ['Sửa chính tả và dấu câu đoạn này', 'Viết lại email này cho lịch sự hơn'],
  },
];

/** Nhãn nhỏ dưới câu trả lời: máy chủ đã áp kỹ năng nào. */
export function tenKyNang(id: string | null | undefined): string | null {
  if (!id) return null;
  return KY_NANG.find((k) => k.id === id)?.ten ?? null;
}
