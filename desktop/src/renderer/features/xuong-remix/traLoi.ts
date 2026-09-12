/**
 * Câu trả lời của AI kèm cặp — và lớp đọc KHÔNG tin lời khai kiểu.
 *
 * Tách khỏi `XuongRemixPage.tsx` để kiểm được mà không phải dựng cả cây React:
 * đây là một hàm thuần, và nó là thứ đứng giữa một phản hồi méo mó và một màn
 * hình trắng.
 */

export interface TraLoiAi {
  traLoi: string;
  model: string;
  /** Con số AI nêu ra mà bảng đo không có. Rỗng là sạch. */
  soLa: string[];
  /** Câu trả lời bị cắt vì chạm trần token. */
  biCat: boolean;
}

/**
 * Đọc câu trả lời của máy chủ mà KHÔNG tin lời khai kiểu.
 *
 * `api.request<TraLoiAi>()` chỉ là một lời hứa của TypeScript — lúc chạy nó
 * không kiểm gì cả. Máy chủ cũ hơn app một bản (hay một lời gọi hỏng trả về
 * hình dạng khác) là đủ để `traLoiAi.soLa.length` ném NGAY GIỮA LÚC VẼ, và
 * React 18 gỡ CẢ CÂY khi không có error boundary: người dùng thấy màn hình
 * trắng, không một dòng báo lỗi. Đã xảy ra thật 12/09/2026.
 *
 * Cùng bài học với `khoModel`/`phanTich` trong trang: chặn hình dạng ở BIÊN,
 * chứ đừng để một trường thiếu đi thẳng vào JSX.
 */
export function docTraLoi(raw: unknown): TraLoiAi | null {
  const o = (raw ?? {}) as Record<string, unknown>;
  const traLoi = typeof o.traLoi === 'string' ? o.traLoi.trim() : '';
  // Câu trả lời rỗng KHÔNG phải là câu trả lời: trả `null` để người gọi hiện
  // một câu báo lỗi, thay vì vẽ khung trống trông như AI đã trả lời xong.
  if (!traLoi) return null;
  return {
    traLoi,
    model: typeof o.model === 'string' ? o.model : '',
    soLa: Array.isArray(o.soLa) ? o.soLa.filter((x): x is string => typeof x === 'string') : [],
    biCat: o.biCat === true,
  };
}
