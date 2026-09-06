/**
 * ============================================================
 * ROBOT NHẮC LỊCH — "còn bao lâu nữa tới buổi học sớm nhất"
 * ============================================================
 *
 * Khác `nhacNho.ts` ở mục đích, nên khác cả cách chạy:
 *
 *  • `nhacNho` là BÁO ĐỘNG — kêu chuông + thông báo hệ điều hành, đúng một lần,
 *    trong cửa sổ `remindMinutes` trước giờ học. Nó phải chọc thủng sự tập
 *    trung của người dùng.
 *  • Cái này là ĐỒNG HỒ ĐẾM NGƯỢC — robot nói nhỏ một câu mỗi 10 phút, không
 *    chuông, không thông báo hệ thống. Nó để liếc mắt là biết còn bao lâu.
 *
 * Vì thế nó KHÔNG dùng `Notification` và KHÔNG gọi `keuNhac()`. Một thứ nói 10
 * phút một lần mà kêu chuông thì bị tắt trong ngày đầu tiên.
 *
 * Tắt bằng khoá cài đặt `nhacLichRobot`, có nút ngay trên khối Lịch học.
 */
import type { ApiClient } from '../../api/client';
import { conMayPhut, ngayISO, type Buoi } from './LichHoc';

/**
 * Tên sự kiện đưa câu nhắc tới con robot.
 *
 * Đi qua `window` chứ không truyền hàm xuống: vòng nhắc sống ở tầng App (để nó
 * chạy bất kể đang mở trang nào), còn con robot nằm trong `OdinDock`. Nối trực
 * tiếp thì phải kéo `announce` ngược lên qua context — nhiều dây cho một câu
 * chữ mỗi mười phút.
 */
export const SU_KIEN_NHAC = 'ct:robot-nhac-lich';

export function phatCauNhac(chu: string): void {
  window.dispatchEvent(new CustomEvent(SU_KIEN_NHAC, { detail: { chu } }));
}

/** Mười phút — đúng nhịp người dùng xin. */
export const NHIP_MS = 10 * 60_000;

/** Không nhắc khi còn xa hơn thế này. 4 tiếng nữa mới học thì đếm ngược là ồn. */
export const XA_NHAT_PHUT = 240;

/** `95` → `"1 giờ 35 phút"`, `35` → `"35 phút"`, `60` → `"1 giờ"`. */
export function moTaKhoang(phut: number): string {
  const p = Math.max(0, Math.round(phut));
  const g = Math.floor(p / 60);
  const le = p % 60;
  if (g === 0) return `${le} phút`;
  if (le === 0) return `${g} giờ`;
  return `${g} giờ ${le} phút`;
}

/**
 * Buổi gần nhất CHƯA bắt đầu trong hôm nay.
 *
 * Bỏ buổi đã qua giờ: nói "còn -30 phút" thì vô nghĩa, mà nói "đang học" lại
 * là thứ người ngồi trong lớp không cần nghe.
 */
export function buoiSomNhat(
  ds: Buoi[],
  bayGio = new Date(),
): { buoi: Buoi; phut: number } | null {
  const thu = bayGio.getDay() === 0 ? 8 : bayGio.getDay() + 1;
  let tot: { buoi: Buoi; phut: number } | null = null;
  for (const b of ds) {
    if (b.weekday !== thu) continue;
    const con = conMayPhut(b.startTime, bayGio);
    if (con <= 0 || con > XA_NHAT_PHUT) continue;
    if (!tot || con < tot.phut) tot = { buoi: b, phut: con };
  }
  return tot;
}

/** Câu robot nói. Ngắn — bong bóng chỉ vài dòng và người dùng đang làm việc khác. */
export function cauNhac(b: Buoi, phut: number): string {
  const ten = b.classCode || b.subject;
  const cho = b.room ? ` ở ${b.room}` : '';
  if (phut <= 5) return `Sắp vào ${ten}${cho} rồi — còn ${moTaKhoang(phut)}!`;
  return `Còn ${moTaKhoang(phut)} nữa là học ${ten}${cho} (${b.startTime}).`;
}

/**
 * Vòng nhắc. Trả về hàm dừng.
 *
 * `dangBat()` được hỏi lại ở MỖI nhịp chứ không đọc một lần lúc khởi động: người
 * dùng bấm tắt trên khối Lịch học phải có tác dụng ngay, không phải đợi khởi
 * động lại app.
 */
export function batDauNhacLichRobot(
  api: ApiClient,
  noi: (chu: string) => void,
  dangBat: () => boolean,
): () => void {
  let dungRoi = false;

  const dò = async (): Promise<void> => {
    if (dungRoi || !dangBat()) return;
    try {
      const ds = await api.request<{ items: Buoi[] }>(
        `/api/v1/class-schedule?ngay=${ngayISO(new Date())}`,
      );
      if (dungRoi || !dangBat()) return;
      const som = buoiSomNhat(ds?.items ?? []);
      if (som) noi(cauNhac(som.buoi, som.phut));
    } catch {
      /* Mất mạng thì im lặng bỏ nhịp này. KHÔNG dừng vòng — đứt mạng một phút
         mà tắt hẳn cả ngày là hỏng nặng hơn nhiều. */
    }
  };

  void dò();
  const id = setInterval(() => { void dò(); }, NHIP_MS);
  return () => { dungRoi = true; clearInterval(id); };
}
