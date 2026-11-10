/**
 * "Tùy chỉnh" của chế độ Trò chuyện (10/11/2026) — cùng nội dung với /chat web (`frontend/.../claude/ctcPrefs.ts`),
 * lưu ở localStorage của app.
 *
 * Chỉ gửi những tham số máy chủ ĐÃ nhận và kiểm bằng danh sách trắng ở `POST /ai/chat`: `ngonNgu`, `choTimWeb`,
 * `kyNang` (một trong 6 kỹ năng, hoặc `'tu-dong'`). Không có ô "chỉ dẫn tự do" nào đi vào prompt.
 * `tenGoi` chỉ dùng cho lời chào trên màn hình.
 */
import { useSyncExternalStore } from 'react';

export interface TuyChinhChat {
  tenGoi: string;
  ngonNgu: 'auto' | 'vi' | 'en';
  timWeb: boolean;
  kyNangTuDong: boolean;
  /** Kỹ năng đã thêm vào "Của bạn" — hiện trong menu ＋ của ô soạn. */
  kyNangBat: string[];
}

const KHOA = 'ctd-tuy-chinh';
const MAC_DINH: TuyChinhChat = { tenGoi: '', ngonNgu: 'auto', timWeb: true, kyNangTuDong: true, kyNangBat: ['code', 'toan', 'anh', 'tieng-anh'] };

let hienTai: TuyChinhChat = docLai();
const nghe = new Set<() => void>();

function docLai(): TuyChinhChat {
  try {
    const t = JSON.parse(localStorage.getItem(KHOA) ?? 'null') as Partial<TuyChinhChat> | null;
    return { ...MAC_DINH, ...(t ?? {}) };
  } catch {
    return { ...MAC_DINH };
  }
}

export function docTuyChinh(): TuyChinhChat { return hienTai; }

export function datTuyChinh(p: Partial<TuyChinhChat>): void {
  hienTai = { ...hienTai, ...p };
  try { localStorage.setItem(KHOA, JSON.stringify(hienTai)); } catch { /* đầy bộ nhớ — vẫn giữ trong phiên */ }
  for (const f of nghe) f();
}

export function useTuyChinh(): TuyChinhChat {
  return useSyncExternalStore((f) => { nghe.add(f); return () => nghe.delete(f); }, docTuyChinh, docTuyChinh);
}

/** Phần thân `/ai/chat` lấy từ tùy chỉnh. `kyNangEp` (chọn trong ô soạn) thắng chế độ tự nhận. */
export function thanTuyChinh(p: TuyChinhChat, kyNangEp?: string | null): Record<string, unknown> {
  return {
    ...(p.ngonNgu !== 'auto' ? { ngonNgu: p.ngonNgu } : {}),
    choTimWeb: p.timWeb,
    ...(kyNangEp ? { kyNang: kyNangEp } : p.kyNangTuDong ? { kyNang: 'tu-dong' } : {}),
  };
}
