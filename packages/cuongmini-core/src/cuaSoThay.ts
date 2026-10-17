/**
 * Thay `desktop/src/main/window.ts` khi chạy ngoài app.
 *
 * `agent/tools.ts` cần "cửa sổ chính" ở hai chỗ:
 *  • `web_mo` — chưa có trình duyệt thì nó nhắn renderer `agent:moWeb` để mở
 *    khung chia đôi rồi CHỜ `trinhDuyet.dangMo()`. Ở đây không có renderer nào:
 *    tin nhắn đó được hiểu thành "bật trình duyệt thật" (`trinhDuyetThay.ts`).
 *    Nhờ vậy luồng `web_mo` của app chạy nguyên văn, không phải sửa tools.ts.
 *  • hộp thoại chọn thư mục tải — `dialog` giả nhận `(cửaSổ, tuỳChọn)` như Electron.
 * Mọi kênh khác đi ra khung chat như `BrowserWindow` giả trong `electron.ts`.
 */
import { BrowserWindow } from './electron';
import { batDau } from './trinhDuyetThay';

const cuaSoChinh = {
  id: 1,
  webContents: {
    id: 1,
    send: (kenh: string, ...duLieu: unknown[]): void => {
      if (kenh === 'agent:moWeb') { void batDau(); return; }
      BrowserWindow.cuaSo.webContents.send(kenh, ...duLieu);
    },
    isDestroyed: (): boolean => false,
  },
  isDestroyed: (): boolean => false,
};

export function layCuaSoChinh(): typeof cuaSoChinh { return cuaSoChinh; }
