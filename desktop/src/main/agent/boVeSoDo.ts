/**
 * "Bộ vẽ" của tool `xuat_so_do` trong APP: một `BrowserWindow` ẩn (offscreen)
 * cấp kênh CDP qua `webContents.debugger`. Phần vẽ thật nằm ở `xuatSoDo.ts`.
 *
 * Ngoài app (VS Code / CLI) module này được tráo bằng
 * `packages/cuongmini-core/src/boVeSoDoThay.ts` (Chrome headless) — xem bảng
 * `THAY` trong `esbuildLoi.mjs`. Đổi chữ ký thì đổi cả hai.
 *
 * ─── RANH GIỚI ───
 * Trang vẽ nạp file .html / .svg của NGƯỜI DÙNG (có thể mang JS), nên: phân
 * vùng riêng (không cookie của app), sandbox, không preload, chặn mở cửa sổ
 * mới. `offscreen` chứ không `show: false`: cửa sổ ẩn thường bị Chromium ngừng
 * vẽ, và `Page.captureScreenshot` chờ một khung hình không bao giờ tới.
 */
import { BrowserWindow } from 'electron';

import type { KenhVe } from './xuatSoDo';

export async function moKenhVe(): Promise<KenhVe> {
  const w = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    webPreferences: {
      offscreen: true,
      partition: 'xuat-so-do',
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });
  w.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  try {
    await w.loadURL('about:blank');
    const d = w.webContents.debugger;
    d.attach('1.3');
    await d.sendCommand('Page.enable');
    return {
      cdp: { send: (m, t) => d.sendCommand(m, t) },
      /* `Page.printToPDF` qua debugger không chắc có trong Electron (Chrome chỉ
         hứa nó ở headless) — dùng API in của chính Electron. */
      inPdf: async (o) => await w.webContents.printToPDF({
        printBackground: o.nen,
        pageSize: { width: o.rongIn, height: o.caoIn },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        preferCSSPageSize: false,
        ...(o.chiTrangDau ? { pageRanges: '1' } : {}),
      }),
      dong: async () => {
        try { d.detach(); } catch { /* đã tách */ }
        if (!w.isDestroyed()) w.destroy();
      },
    };
  } catch (e) {
    if (!w.isDestroyed()) w.destroy();
    throw e;
  }
}

/** Mỗi lần vẽ một cửa sổ riêng, đóng ngay sau đó — không có gì để dọn. */
export async function dongBoVe(): Promise<void> { /* không */ }
