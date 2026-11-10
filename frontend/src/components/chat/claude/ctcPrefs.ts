/**
 * Mục "Tùy chỉnh" của /chat — lưu ở máy (localStorage), gửi kèm mỗi lượt hỏi.
 *
 * CHỈ dùng những tham số máy chủ ĐÃ nhận và ĐÃ kiểm bằng danh sách trắng ở `POST /ai/chat`
 * (ai.routes.ts): `ngonNgu` ('vi' | 'en'), `choTimWeb` (bool), `kyNang: 'tu-dong'`. Không có ô "chỉ dẫn tự do"
 * gửi lên prompt — xem lý do ở đầu `src/services/troLy/kyNangTroLy.ts`.
 * `tenGoi` chỉ dùng cho lời chào trên màn hình, KHÔNG gửi đi.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ssrSafeStorage } from '@/store/ssrSafeStorage';

export interface CtcPrefs {
  tenGoi: string;
  ngonNgu: 'auto' | 'vi' | 'en';
  timWeb: boolean;
  kyNangTuDong: boolean;
  /** Kỹ năng đã thêm vào "Của bạn" — hiện trong menu ＋ của ô soạn để chọn nhanh. */
  kyNangBat: string[];
  /** Phiên Code (mã phiên ⇒ kho đã gắn + mức nỗ lực) — để thanh bên lọc "Code" và lượt sau gửi lại đúng ngữ cảnh. */
  phienCode: Record<string, { kho: { ten: string; moTa: string | null; nhanh: string; ngonNgu: string | null; sao: number; soMuc: number; url: string } | null; doKy: 'nhanh' | 'vua' | 'ky' }>;
  set: (p: Partial<Omit<CtcPrefs, 'set'>>) => void;
}

export const useCtcPrefs = create<CtcPrefs>()(
  persist(
    (set) => ({
      tenGoi: '',
      ngonNgu: 'auto',
      timWeb: true,
      kyNangTuDong: true,
      kyNangBat: ['code', 'toan', 'anh', 'tieng-anh'],
      phienCode: {},
      set: (p) => set(p),
    }),
    { name: 'ctc-tuy-chinh', storage: createJSONStorage(() => ssrSafeStorage) },
  ),
);

/** Phần thân yêu cầu `/ai/chat` lấy từ tùy chỉnh. */
export function thanTuyChinh(p: CtcPrefs, kyNangEp?: string | null): Record<string, unknown> {
  return {
    ...(p.ngonNgu !== 'auto' ? { ngonNgu: p.ngonNgu } : {}),
    choTimWeb: p.timWeb,
    // Kỹ năng người dùng tự chọn trong ô soạn thắng chế độ tự nhận.
    ...(kyNangEp ? { kyNang: kyNangEp } : p.kyNangTuDong ? { kyNang: 'tu-dong' } : {}),
  };
}
