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
  set: (p: Partial<Omit<CtcPrefs, 'set'>>) => void;
}

export const useCtcPrefs = create<CtcPrefs>()(
  persist(
    (set) => ({
      tenGoi: '',
      ngonNgu: 'auto',
      timWeb: true,
      kyNangTuDong: true,
      set: (p) => set(p),
    }),
    { name: 'ctc-tuy-chinh', storage: createJSONStorage(() => ssrSafeStorage) },
  ),
);

/** Phần thân yêu cầu `/ai/chat` lấy từ tùy chỉnh. */
export function thanTuyChinh(p: CtcPrefs): Record<string, unknown> {
  return {
    ...(p.ngonNgu !== 'auto' ? { ngonNgu: p.ngonNgu } : {}),
    choTimWeb: p.timWeb,
    ...(p.kyNangTuDong ? { kyNang: 'tu-dong' } : {}),
  };
}
