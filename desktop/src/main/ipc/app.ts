/**
 * Handler cấp ứng dụng: thông tin phiên bản, mở link ngoài, tải lại, zoom.
 */
import { app, BrowserWindow, dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AppInfo } from '../../shared/ipc';
import { API_ORIGIN, IS_DEV, RENDERER_SOURCE, WEB_ORIGIN } from '../config';
import { openExternalSafely } from '../security';
import { setSetting } from '../store';
import { handle } from './index';

export function registerAppHandlers(): void {
  handle('app:getInfo', (): AppInfo => ({
    version: app.getVersion(),
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    webOrigin: WEB_ORIGIN,
    apiOrigin: API_ORIGIN,
    // Dev đi qua proxy của Vite → đường dẫn tương đối. Xem shared/ipc.ts.
    apiBase: RENDERER_SOURCE === 'dev' ? '' : API_ORIGIN,
    isDev: IS_DEV,
  }));

  // Kiểm scheme lần hai ở đây. Lần một là zod trong shared/ipc.ts. Lặp lại có
  // chủ đích: hai lớp kiểm độc lập, sửa nhầm một chỗ thì chỗ kia vẫn đỡ.
  handle('app:openExternal', async (url) => {
    await openExternalSafely(url);
  });

  handle('app:reload', (_input, event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.webContents.reload();
  });

  /**
   * Lưu file do hộp cát Python sinh ra.
   *
   * ⛔ Nơi lưu do NGƯỜI DÙNG chọn qua hộp thoại hệ điều hành. Renderer chỉ đưa
   * tên gợi ý và nội dung; nó không bao giờ truyền đường dẫn, và vì thế không
   * có đường nào để một script ghi đè một file bất kỳ trên máy.
   *
   * `defaultPath` chỉ là gợi ý ban đầu trong hộp thoại — người dùng vẫn đổi
   * được, và hệ điều hành tự lo phần hỏi ghi đè.
   */
  handle('app:luuFile', async ({ ten, dulieu }, event) => {
    const cuaSo = BrowserWindow.fromWebContents(event.sender) ?? BrowserWindow.getAllWindows()[0];
    const tuyChon = {
      title: 'Lưu file',
      defaultPath: path.join(app.getPath('downloads'), ten),
      buttonLabel: 'Lưu',
    };
    const kq = cuaSo
      ? await dialog.showSaveDialog(cuaSo, tuyChon)
      : await dialog.showSaveDialog(tuyChon);
    if (kq.canceled || !kq.filePath) return { ok: false, huy: true };

    try {
      await fs.writeFile(kq.filePath, dulieu);
      return { ok: true };
    } catch (err) {
      return { ok: false, loi: (err as Error).message };
    }
  });

  handle('app:setZoom', (level, event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    window.webContents.setZoomFactor(level);
    setSetting('zoomLevel', level);
  });
}
