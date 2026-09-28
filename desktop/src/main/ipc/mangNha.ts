/**
 * IPC — Mạng nhà: quét LAN + thông tin card mạng.
 *
 * Quét là việc CHẠY NỀN có phát sự kiện, nên `mangNha:quet` khởi động rồi trả
 * về ngay; thiết bị và tiến độ chảy về renderer qua `webContents.send`. Một
 * lượt một lúc: gọi lại khi đang chạy thì bỏ qua (cờ `dangChay`).
 */
import { BrowserWindow, type IpcMainInvokeEvent } from 'electron';
import { handle } from './index';
import { quetMang, thongTinMang } from '../mangNha/quet';
import type { ThietBiMangBridge, ThongTinMangBridge } from '../../shared/ipc';

let dangChay = false;
let dungLai = false;

function guiToiRenderer(event: IpcMainInvokeEvent, kenh: string, payload: unknown): void {
  const wc = BrowserWindow.fromWebContents(event.sender)?.webContents ?? event.sender;
  if (!wc.isDestroyed()) wc.send(kenh, payload);
}

export function registerMangNhaHandlers(): void {
  handle('mangNha:thongTin', (): ThongTinMangBridge => thongTinMang());

  handle('mangNha:dung', () => {
    dungLai = true;
    return { ok: true };
  });

  handle('mangNha:quet', async (tuyChon, event) => {
    const thongTin = thongTinMang();
    if (dangChay) return { dangChay: true, dai: thongTin.dai };
    if (!thongTin.dai) return { dangChay: false, dai: null };

    dangChay = true;
    dungLai = false;

    // Chạy nền: không await ở đây, để lời gọi invoke trả về ngay. Bắt lỗi tại
    // chỗ để một lần quét hỏng không làm treo cờ `dangChay` vĩnh viễn.
    void (async () => {
      try {
        const { soThietBi } = await quetMang({
          onThietBi: (tb: ThietBiMangBridge) => guiToiRenderer(event, 'mangNha:thietBi', tb),
          onTienDo: (da, tong) => guiToiRenderer(event, 'mangNha:tienDo', { da, tong }),
          batDung: () => dungLai,
          tuyChon: tuyChon ?? undefined,
        });
        guiToiRenderer(event, 'mangNha:xong', { soThietBi, dung: dungLai });
      } catch (loi) {
        guiToiRenderer(event, 'mangNha:xong', {
          soThietBi: 0,
          dung: dungLai,
          loi: loi instanceof Error ? loi.message : String(loi),
        });
      } finally {
        dangChay = false;
        dungLai = false;
      }
    })();

    return { dangChay: true, dai: thongTin.dai };
  });
}
