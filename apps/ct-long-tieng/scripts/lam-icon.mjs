/**
 * Dựng ảnh biểu tượng từ SVG bằng CHÍNH Electron (không thêm thư viện vẽ ảnh nào):
 *   build/icon.svg  → build/icon.png (1024) + resources/icon.png (512, cửa sổ Linux)
 *   khay macOS (ảnh "template" đen trên nền trong): resources/trayTemplate.png (16) + @2x (32)
 *   khay Windows/Linux (màu): resources/tray.png (32)
 *
 *   npm run icon     # = electron scripts/lam-icon.mjs
 */
import { app, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svgIcon = fs.readFileSync(path.join(goc, 'build/icon.svg'), 'utf8');

// Khay macOS: chỉ hình bóng đầu robot + tai nghe, một màu (macOS tự tô theo sáng/tối).
const svgKhay = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <path d="M10 34 a22 22 0 0 1 44 0" stroke="#000" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <rect x="6" y="30" width="9" height="16" rx="4.5" fill="#000"/>
  <rect x="49" y="30" width="9" height="16" rx="4.5" fill="#000"/>
  <path fill-rule="evenodd" fill="#000" d="M18 24 h28 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-28 a8 8 0 0 1 -8 -8 v-14 a8 8 0 0 1 8 -8 z
    M22 36 q4 -6 8 0 v1 h-8 z M34 36 q4 -6 8 0 v1 h-8 z"/>
</svg>`;
const svgKhayMau = svgIcon;

async function ve(svg, co, ra) {
  const w = new BrowserWindow({ width: co, height: co, show: false, transparent: true, frame: false, webPreferences: { offscreen: true } });
  const html = `<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" width="${co}" height="${co}"></body></html>`;
  await w.loadURL(`data:text/html;base64,${Buffer.from(html).toString('base64')}`);
  await new Promise((r) => setTimeout(r, 300));
  const anh = await w.webContents.capturePage({ x: 0, y: 0, width: co, height: co });
  fs.mkdirSync(path.dirname(ra), { recursive: true });
  fs.writeFileSync(ra, anh.resize({ width: co, height: co }).toPNG());
  w.destroy();
  console.log('✓', path.relative(goc, ra));
}

app.disableHardwareAcceleration();
app.on('window-all-closed', () => { /* đừng thoát giữa các lượt vẽ */ });
app.whenReady().then(async () => {
  await ve(svgIcon, 1024, path.join(goc, 'build/icon.png'));
  await ve(svgIcon, 512, path.join(goc, 'resources/icon.png'));
  await ve(svgKhay, 16, path.join(goc, 'resources/trayTemplate.png'));
  await ve(svgKhay, 32, path.join(goc, 'resources/trayTemplate@2x.png'));
  await ve(svgKhayMau, 32, path.join(goc, 'resources/tray.png'));
  app.quit();
});
