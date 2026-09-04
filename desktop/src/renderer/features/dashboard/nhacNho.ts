/**
 * ============================================================
 * NHẮC NHỞ — dò việc tới giờ, kêu và báo
 * ============================================================
 *
 * Chạy ở tầng App chứ KHÔNG ở trang Tổng quan. Một lời nhắc chỉ kêu khi bạn
 * đang mở đúng trang chứa nó thì vô dụng — người ta đặt nhắc chính vì họ sẽ
 * KHÔNG nhìn vào đó.
 *
 * Hỏi endpoint riêng `/dashboard/reminders` (nhẹ) mỗi phút, không phải cả trang
 * tổng quan: bản đầy đủ kéo theo timeline, EXP, celebration — mỗi phút một lần,
 * cả ngày, cho một danh sách gần như luôn rỗng.
 *
 * ⚠️ Đánh dấu ĐÃ NHẮC ngay sau khi báo (`remindedNow`). Không đánh dấu thì phút
 * sau nó nhắc lại đúng việc đó, và cứ thế cho tới khi người dùng tắt hẳn.
 */
import type { ApiClient } from '../../api/client';
import { keuNhac } from './amThanh';

/** Nhịp dò. Một phút là đủ mịn cho lời nhắc, và đủ thưa để không tốn gì. */
const NHIP_MS = 60_000;

interface ViecNhac { id: number | string; title: string; note?: string | null; dueAt?: string | null }

/**
 * Hiện thông báo hệ thống.
 *
 * Dùng `Notification` của trình duyệt chứ không dựng thêm đường IPC: renderer
 * trong Electron có sẵn nó, và nó hiện đúng thông báo hệ điều hành thật.
 * Không có quyền thì im lặng — tiếng chuông vẫn kêu, nên lời nhắc không mất hẳn.
 */
function baoHeDieuHanh(v: ViecNhac): void {
  try {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      new Notification('⏰ Tới giờ rồi', {
        body: v.title + (v.note ? `\n${v.note.slice(0, 120)}` : ''),
        silent: true, // tiếng do `keuNhac()` lo — thống nhất một giọng cho cả app
      });
    } else if (Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  } catch { /* thông báo hỏng không được làm chết vòng dò */ }
}

/**
 * Bắt đầu dò. Trả về hàm dừng.
 *
 * `onNhac` để giao diện hiện thẻ nhắc TRONG app — thông báo hệ điều hành có thể
 * bị tắt ở mức hệ thống mà app không biết, nên không được coi nó là đường duy nhất.
 */
export function batDauDoNhac(
  api: ApiClient,
  onNhac: (viec: ViecNhac[]) => void,
): () => void {
  let dungRoi = false;

  const dò = async (): Promise<void> => {
    if (dungRoi) return;
    try {
      const kq = await api.request<{ tasks: ViecNhac[] }>('/api/v1/dashboard/reminders');
      const ds = kq?.tasks ?? [];
      if (ds.length === 0 || dungRoi) return;

      keuNhac();
      for (const v of ds) baoHeDieuHanh(v);
      onNhac(ds);

      /* Đánh dấu đã nhắc — song song, và nuốt lỗi từng cái: một lời đánh dấu
         hỏng không được ngăn những cái còn lại. Cái hỏng sẽ nhắc lại lần sau,
         và nhắc thừa vẫn tốt hơn nhắc thiếu. */
      await Promise.all(ds.map((v) => api
        .request(`/api/v1/dashboard/tasks/${v.id}`, { method: 'PATCH', body: { remindedNow: true } })
        .catch(() => undefined)));
    } catch {
      /* Mất mạng thì thôi, lần sau dò lại. KHÔNG dừng vòng: đứt mạng một phút
         mà tắt hẳn nhắc nhở cả ngày là hỏng nặng hơn nhiều. */
    }
  };

  void dò();
  const id = setInterval(() => { void dò(); }, NHIP_MS);
  return () => { dungRoi = true; clearInterval(id); };
}
