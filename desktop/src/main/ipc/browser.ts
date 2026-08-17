/**
 * IPC của trình duyệt trong app.
 *
 * Mỏng có chủ ý: mọi phép kiểm thật nằm ở `main/browser.ts` (lọc scheme, phiên
 * riêng, chặn window.open). Tầng này chỉ nối dây và tìm đúng cửa sổ.
 */
import { BrowserWindow } from 'electron';
import * as td from '../browser';
import { handle } from './index';

function cuaSoCua(event: { sender: Electron.WebContents }): BrowserWindow | null {
  return BrowserWindow.fromWebContents(event.sender) ?? BrowserWindow.getAllWindows()[0] ?? null;
}

export function registerBrowserHandlers(): void {
  handle('browser:mo', ({ vung, url }, event) => {
    const w = cuaSoCua(event);
    if (w) td.mo(w, vung, url);
  });

  handle('browser:an', () => td.an());
  handle('browser:datVung', (vung) => td.datVung(vung));
  handle('browser:diToi', ({ url }) => td.diToi(url));
  handle('browser:lui', () => td.lui());
  handle('browser:toi', () => td.toi());
  handle('browser:napLai', () => td.napLai());
  handle('browser:moNgoai', () => td.moNgoai());
}
