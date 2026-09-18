/**
 * ============================================================
 * ROBOT NHẮC KẾ HOẠCH — 15 phút một lần
 * ============================================================
 *
 * Người dùng đặt hàng: *"cứ cách 15' sẽ thông báo việc sắp tới gần nhất
 * sẽ làm gì qua icon robot"*, và *"sắp hết giờ cách 15' phải hiện thông
 * báo ngay"*.
 *
 * Hai thứ đó KHÁC NHAU và đi hai đường khác nhau:
 *
 *  1. **Việc sắp tới** — nhắc định kỳ, êm, mỗi 15 phút. Ở tệp này.
 *  2. **Sắp hết giờ** — cảnh báo, phải tới trong vòng một phút kể từ lúc
 *     còn đúng 15 phút. Đi nhờ vòng dò 60 giây có sẵn trong `nhacNho.ts`,
 *     vì một vòng 15 phút có thể bắn câu cảnh báo muộn tới 14 phút — tức
 *     là sau khi đã hết giờ.
 *
 * Gộp hai thứ vào một nhịp là cách chắc chắn nhất để cảnh báo tới trễ, và
 * một cảnh báo "sắp hết giờ" tới sau khi hết giờ thì tệ hơn là không có.
 */
import type { ApiClient } from '../../api/client';
import { ngayMay } from './lichThang';

/** Nhịp nhắc việc sắp tới — đúng con số người dùng đặt hàng. */
export const NHIP_KE_HOACH_MS = 15 * 60_000;

/** Xa hơn ngần này thì không nhắc: nhắc việc của 4 tiếng nữa là làm phiền. */
export const XA_NHAT_PHUT = 180;

export interface ViecNhac {
  id: number;
  title: string;
  done: boolean;
  truotLuc: string | null;
  batDauAt: string | null;
  phutLam: number | null;
  doKho: number;
  priority: number;
  truNeuTruot: number;
}

/**
 * Việc SẮP TỚI gần nhất còn phải làm.
 *
 * Bỏ qua việc đã xong và việc đã trượt: nhắc "sắp tới giờ" cho một việc
 * đã trượt là thông tin sai, và nó làm người dùng ngừng tin mọi câu robot
 * nói sau đó.
 */
export function viecGanNhat(ds: ViecNhac[], bayGio = Date.now()): { viec: ViecNhac; phut: number } | null {
  let tot: { viec: ViecNhac; phut: number } | null = null;
  for (const v of ds) {
    if (v.done || v.truotLuc || !v.batDauAt) continue;
    const t = new Date(v.batDauAt).getTime();
    if (Number.isNaN(t)) continue;
    const phut = Math.round((t - bayGio) / 60_000);
    if (phut < 0 || phut > XA_NHAT_PHUT) continue;
    if (!tot || phut < tot.phut) tot = { viec: v, phut };
  }
  return tot;
}

/** `0` → "ngay bây giờ" · `45` → "45 phút nữa" · `150` → "2 tiếng rưỡi nữa". */
export function moTaKhoang(phut: number): string {
  if (phut <= 1) return 'ngay bây giờ';
  if (phut < 60) return `${phut} phút nữa`;
  const g = Math.floor(phut / 60);
  const le = phut % 60;
  if (le === 0) return `${g} tiếng nữa`;
  if (le === 30) return `${g} tiếng rưỡi nữa`;
  return `${g} tiếng ${le} phút nữa`;
}

/** Câu robot nói về việc sắp tới. */
export function cauSapToi(v: ViecNhac, phut: number): string {
  const khi = moTaKhoang(phut);
  const dai = v.phutLam ? `, dự kiến ${v.phutLam} phút` : '';
  return `${khi}: ${v.title}${dai}.`;
}

/**
 * Câu cảnh báo sắp hết giờ — NGUYÊN VĂN người dùng đặt hàng.
 *
 * Giữ nguyên chữ của họ chứ không "viết lại cho mượt": đây là câu họ sẽ
 * nghe hàng chục lần một tuần, và họ đã nói ra chính xác cái họ muốn nghe.
 */
export function cauSapHetGio(ten: string): string {
  return `Bạn sắp hết giờ "${ten}" — bạn làm việc xong chưa, còn chấm điểm danh.`;
}

/** Câu báo vừa bị đánh trượt. Nói rõ MẤT bao nhiêu và CÒN bao nhiêu. */
export function cauVuaTruot(ds: Array<{ title: string; tru: number }>, diem: number | null): string {
  if (ds.length === 0) return '';
  const mat = ds.reduce((t, v) => t + v.tru, 0);
  const ten = ds.length === 1 ? `"${ds[0]!.title}"` : `${ds.length} việc`;
  const con = diem === null ? '' : ` Uy tín còn ${diem}.`;
  return `Hết giờ mà ${ten} chưa được tích xong — trừ ${mat} uy tín.${con} Làm nốt vẫn được hoàn lại một nửa.`;
}

/**
 * Vòng nhắc việc sắp tới. Trả về hàm dừng.
 *
 * `dangBat()` được hỏi lại ở MỖI nhịp chứ không đọc một lần lúc khởi động:
 * người dùng tắt robot phải có tác dụng ngay, không phải đợi mở lại app.
 *
 * ⚠️ KHÔNG nói lại đúng câu vừa nói. Vòng 15 phút mà việc còn cách 2 tiếng
 * thì cùng một câu sẽ lặp 8 lần, và một trợ lý lặp lại chính nó là một trợ
 * lý bị tắt.
 */
export function batDauNhacKeHoach(
  api: ApiClient,
  noi: (chu: string) => void,
  dangBat: () => boolean,
): () => void {
  let dungRoi = false;
  let cauTruoc = '';

  const dò = async (): Promise<void> => {
    if (dungRoi || !dangBat()) return;
    try {
      const kq = await api.request<{ tasks: ViecNhac[] }>(
        `/api/v1/dashboard/ngay?date=${ngayMay()}`,
      );
      if (dungRoi || !dangBat()) return;
      const som = viecGanNhat(kq?.tasks ?? []);
      if (!som) { cauTruoc = ''; return; }
      const cau = cauSapToi(som.viec, som.phut);
      if (cau === cauTruoc) return;
      cauTruoc = cau;
      noi(cau);
    } catch {
      /* Mất mạng thì bỏ nhịp này. KHÔNG dừng vòng — đứt mạng một phút mà
         tắt hẳn nhắc nhở cả ngày là hỏng nặng hơn nhiều. */
    }
  };

  void dò();
  const id = setInterval(() => { void dò(); }, NHIP_KE_HOACH_MS);
  return () => { dungRoi = true; clearInterval(id); };
}
