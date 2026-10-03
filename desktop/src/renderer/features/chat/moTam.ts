/**
 * MỞ MỘT TẤM CỦA THANH CÔNG CỤ TỪ CHỖ KHÁC (03/10/2026).
 *
 * Hai đường cần nó:
 *   • lệnh `/model`, `/memory`, `/hooks`, `/mcp` — mở đúng tấm đang có thay vì
 *     dựng bảng thứ hai (một bảng Bộ nhớ thứ hai là hai nguồn sự thật);
 *   • menu "⋯" khi khung hẹp — nút gốc bị ẩn, mục trong menu mở tấm của nó.
 *
 * Sự kiện mang `cuocId`: MỖI tab dựng một `AgentMode` (ẩn bằng CSS), nên bắn
 * chung không kèm id là mở tấm ở cả tab đang ẩn.
 */
import { useEffect } from 'react';

export type TenTam = 'model' | 'boNho' | 'hook' | 'mcp' | 'worktree';

const SU_KIEN = 'ct-agent-mo-tam';

export function moTam(cuocId: string, ten: TenTam): void {
  window.dispatchEvent(new CustomEvent(SU_KIEN, { detail: { cuocId, ten } }));
}

/**
 * Gắn vào component có tấm. `bat` của `useMoRieng` là BẬT/TẮT, nên chỉ gọi khi
 * tấm đang đóng — gõ `/memory` hai lần không được đóng mất cái vừa mở.
 */
export function useMoTuNgoai(cuocId: string | undefined, ten: TenTam, mo: boolean, bat: () => void): void {
  useEffect(() => {
    if (!cuocId) return;
    const f = (e: Event): void => {
      const d = (e as CustomEvent<{ cuocId: string; ten: TenTam }>).detail;
      if (d?.cuocId === cuocId && d.ten === ten && !mo) bat();
    };
    window.addEventListener(SU_KIEN, f);
    return () => window.removeEventListener(SU_KIEN, f);
  }, [cuocId, ten, mo, bat]);
}
