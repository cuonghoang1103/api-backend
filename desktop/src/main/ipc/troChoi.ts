/**
 * IPC cho game cài riêng (08/10/2026) — lớp mỏng trên `main/troChoi/caiGame.ts`.
 *
 * Không handler nào ném (giao diện phải vẽ được kể cả khi mọi thứ hỏng), và
 * tiến độ gửi về ĐÚNG cửa sổ đã bấm tải (`event.sender`) — không dò cửa sổ
 * bằng `getAllWindows()[0]` ([[feedback_bay_electron_desktop]]).
 */
import type { WebContents } from 'electron';
import type { TroChoiTienDo } from '../../shared/ipc';
import { batDauTai, choi, go, huyTai, moThuMuc, tinhTrang } from '../troChoi/caiGame';
import { handle } from './index';

export function registerTroChoiHandlers(): void {
  handle('troChoi:tinhTrang', async ({ ma, napLai }) => tinhTrang(ma, napLai === true));

  handle('troChoi:tai', ({ ma }, event) => {
    const nguoiGoi: WebContents = event.sender;
    const bao = (t: TroChoiTienDo) => {
      if (!nguoiGoi.isDestroyed()) nguoiGoi.send('troChoi:tienDo', t);
    };
    return batDauTai(ma, bao);
  });

  handle('troChoi:huyTai', ({ ma }) => {
    huyTai(ma);
    return { ok: true };
  });

  handle('troChoi:choi', async ({ ma }) => {
    try {
      return await choi(ma);
    } catch (e) {
      return { ok: false, loi: (e as Error)?.message || 'Không mở được game.' };
    }
  });

  handle('troChoi:go', async ({ ma }) => go(ma));

  handle('troChoi:moThuMuc', async ({ ma }) => {
    try {
      return await moThuMuc(ma);
    } catch {
      return { ok: false };
    }
  });
}
