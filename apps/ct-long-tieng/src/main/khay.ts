/**
 * Biểu tượng khay / thanh menu: số việc đang chạy, mở app, thoát. Đóng cửa sổ KHÔNG thoát app — việc vẫn chạy,
 * xong vẫn tự tải về và báo; muốn thoát hẳn thì chọn "Thoát" ở đây (hoặc Cmd+Q trên macOS).
 */
import { Menu, Tray, nativeImage } from 'electron';
import path from 'node:path';
import type { ViecHienThi } from '../shared/ipc';

let khay: Tray | null = null;

export function taoKhay(thuMucTaiNguyen: string, moApp: () => void, thoat: () => void): Tray {
  const anh = process.platform === 'darwin'
    ? nativeImage.createFromPath(path.join(thuMucTaiNguyen, 'trayTemplate.png'))
    : nativeImage.createFromPath(path.join(thuMucTaiNguyen, 'tray.png'));
  if (process.platform === 'darwin') anh.setTemplateImage(true);
  khay = new Tray(anh);
  khay.setToolTip('CT Lồng Tiếng');
  khay.on('click', moApp);
  capNhatKhay([], moApp, thoat);
  return khay;
}

export function capNhatKhay(viec: ViecHienThi[], moApp: () => void, thoat: () => void): void {
  if (!khay) return;
  const chay = viec.filter((v) => v.hienThi.dangChay);
  khay.setToolTip(chay.length ? `CT Lồng Tiếng — ${chay.length} việc đang chạy` : 'CT Lồng Tiếng');
  if (process.platform === 'darwin') khay.setTitle(chay.length ? ` ${chay.length}` : '');
  const muc: Electron.MenuItemConstructorOptions[] = chay.slice(0, 8).map((v) => ({
    label: `${v.tieuDe.slice(0, 48)} — ${v.hienThi.nhan}${v.hienThi.phanTram !== null ? ` ${v.hienThi.phanTram}%` : ''}`,
    enabled: false,
  }));
  if (!muc.length) muc.push({ label: 'Không có việc nào đang chạy', enabled: false });
  khay.setContextMenu(Menu.buildFromTemplate([
    ...muc,
    { type: 'separator' },
    { label: 'Mở CT Lồng Tiếng', click: moApp },
    { label: 'Thoát', click: thoat },
  ]));
}
