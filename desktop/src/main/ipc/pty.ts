/**
 * IPC của TERMINAL THẬT (PTY) — xem `main/terminal/phienTerminal.ts`.
 *
 * Khác `ipc/terminal.ts` (bảng chạy lệnh cũ, không PTY): ở đây giao diện nhận
 * byte bằng SỰ KIỆN đẩy (`pty:du`) chứ không hỏi theo nhịp — một terminal thật
 * vẽ lại con trỏ và thanh tiến trình liên tục, hỏi theo nhịp 350ms thì gõ phím
 * thấy trễ rõ ràng.
 *
 * Phát tới MỌI cửa sổ: khung terminal có thể nằm ở tab/ cửa sổ nào cũng được,
 * và mỗi khung tự lọc theo `id` của nó.
 */
import { BrowserWindow } from 'electron';
import os from 'node:os';

import { gocCuaCuoc } from '../agent/loop';
import {
  coLai, coPty, docDemTho, dongTerminal, dsTerminal, ganPhatSuKien, guiVao, moTerminal,
} from '../terminal/phienTerminal';
import { handle } from './index';

function phatMoiCuaSo(kenh: string, du: unknown): void {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) w.webContents.send(kenh, du);
  }
}

export function registerPtyHandlers(): void {
  ganPhatSuKien(
    (e) => phatMoiCuaSo('pty:du', e),
    (p) => phatMoiCuaSo('pty:trangThai', p),
  );

  handle('pty:mo', ({ cuocId, cot, dong }) => moTerminal({
    cuocId,
    /* Terminal người dùng tự mở: ở thư mục dự án nếu tab đã chọn, không thì
       thư mục nhà — khác lệnh của agent (bắt buộc có dự án), vì đây là cửa sổ
       dòng lệnh của CHÍNH người dùng, họ tự biết mình đang ở đâu. */
    cwd: gocCuaCuoc(cuocId) ?? os.homedir(),
    nguon: 'nguoiDung',
    cot, dong,
  }));
  handle('pty:gui', ({ id, du }) => guiVao(id, du));
  handle('pty:coLai', ({ id, cot, dong }) => { coLai(id, cot, dong); });
  handle('pty:dong', ({ id }) => dongTerminal(id));
  handle('pty:ds', ({ cuocId }) => dsTerminal(cuocId));
  handle('pty:demTho', ({ id }) => docDemTho(id));
  handle('pty:mayCo', () => coPty());
}
