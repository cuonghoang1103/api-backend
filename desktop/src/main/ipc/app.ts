/**
 * Handler cấp ứng dụng: thông tin phiên bản, mở link ngoài, tải lại, zoom.
 */
import { app, BrowserWindow } from 'electron';
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

  handle('app:setZoom', (level, event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    window.webContents.setZoomFactor(level);
    setSetting('zoomLevel', level);
  });
}
