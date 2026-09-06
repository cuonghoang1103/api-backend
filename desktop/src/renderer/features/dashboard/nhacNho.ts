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
import { conMayPhut, ngayISO, type Buoi } from './LichHoc';

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
/**
 * NHẮC TRƯỚC GIỜ HỌC.
 *
 * Khác nhắc việc ở một điểm quyết định cách làm: buổi học LẶP mỗi tuần, không
 * có bản ghi riêng cho từng lần — nên không thể đánh dấu "đã nhắc" trên máy chủ
 * như việc. Ghi nhớ trong bộ nhớ theo khoá `id|ngày`.
 *
 * Cái giá: mở lại app trong khoảng nhắc thì nó nhắc lại một lần. Chấp nhận —
 * thà nhắc thừa còn hơn để người ta lỡ buổi, và người mở app lúc đó gần như
 * chắc chắn đang ngồi trước máy.
 */
const daNhacHoc = new Set<string>();

async function doLichHoc(api: ApiClient, onNhac: (viec: ViecNhac[]) => void): Promise<void> {
  const homNay = new Date();
  const thu = homNay.getDay() === 0 ? 8 : homNay.getDay() + 1;
  const ngay = ngayISO(homNay);

  const ds = await api.request<{ items: Array<Buoi & { remindMinutes?: number }> }>(
    `/api/v1/class-schedule?ngay=${ngay}`,
  ).catch(() => null);
  if (!ds?.items?.length) return;

  const toi: ViecNhac[] = [];
  for (const b of ds.items) {
    if (b.weekday !== thu) continue;
    const truoc = b.remindMinutes ?? 30;
    if (truoc <= 0) continue;
    const con = conMayPhut(b.startTime, homNay);
    /* Chỉ nhắc trong CỬA SỔ [0, truoc]: đã qua giờ thì nhắc là vô nghĩa, mà
       còn quá xa thì nhắc sớm sẽ bị quên trước khi tới giờ. */
    if (con <= 0 || con > truoc) continue;
    const khoa = `${b.id}|${ngay}`;
    if (daNhacHoc.has(khoa)) continue;
    daNhacHoc.add(khoa);
    toi.push({
      id: `hoc-${b.id}`,
      title: `${b.classCode || b.subject} — còn ${con} phút`,
      note: [b.room, b.teacher].filter(Boolean).join(' · ') || null,
    });
  }
  if (toi.length === 0) return;
  keuNhac();
  for (const v of toi) baoHeDieuHanh(v);
  onNhac(toi);
}

export function batDauDoNhac(
  api: ApiClient,
  onNhac: (viec: ViecNhac[]) => void,
): () => void {
  let dungRoi = false;

  const dò = async (): Promise<void> => {
    if (dungRoi) return;
    try {
      /* Lịch học dò TRƯỚC việc: lỡ một buổi học là mất cả buổi, còn lỡ một
         việc thì làm bù được. Lỗi ở đây không được chặn phần việc bên dưới. */
      await doLichHoc(api, onNhac).catch(() => undefined);

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
