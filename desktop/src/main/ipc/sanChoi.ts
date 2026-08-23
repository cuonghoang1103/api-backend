/**
 * IPC cho sân chơi 3D.
 *
 * Mỏng có chủ đích: mọi việc thật nằm ở `main/sanChoi.ts`. Ở đây chỉ có một
 * quyết định đáng bàn — tiến độ tải gửi đi đâu.
 */
import { BrowserWindow } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import type { TienDoTai, TrangThaiSanChoi } from '../../shared/ipc';
import { moCuaSo, taiVe, trangThai, xoaMedia } from '../sanChoi';
import { handle } from './index';

export function registerSanChoiHandlers(): void {
  handle('sanChoi:trangThai', (): Promise<TrangThaiSanChoi> => trangThai());

  /**
   * Trả về NGAY, không `await` lượt tải.
   *
   * Tải 78 MB mất vài phút. Một `ipcRenderer.invoke` treo lâu như vậy là lời
   * mời cho đủ loại lỗi: người dùng bấm lại nút, renderer nạp lại trang, hoặc
   * cửa sổ đóng — và lời hứa kia không bao giờ được giải. Tiến độ đi bằng sự
   * kiện, nên trạng thái nằm ở main và renderer có thể chết đi sống lại tuỳ ý.
   */
  handle('sanChoi:tai', (_input: undefined, event: IpcMainInvokeEvent) => {
    const cuaSo = BrowserWindow.fromWebContents(event.sender);

    void taiVe((t: TienDoTai) => {
      // Cửa sổ có thể đã đóng giữa chừng — gửi vào một webContents đã huỷ sẽ
      // ném lỗi và giết luôn phần còn lại của lượt tải.
      if (cuaSo && !cuaSo.isDestroyed()) cuaSo.webContents.send('sanChoi:tienDo', t);
    });
  });

  handle('sanChoi:mo', async ({ cheDo }) => {
    const tt = await trangThai();
    // Mở khi chưa tải đủ thì game kẹt ở màn hình tải và KHÔNG báo lỗi gì —
    // đúng cái triệu chứng đã tốn hai phiên hồi tháng 7. Chặn ở đây.
    if (!tt.sanSang) throw new Error('Chưa tải xong tài nguyên sân chơi.');
    moCuaSo(cheDo);
  });

  handle('sanChoi:xoa', () => xoaMedia());
}
