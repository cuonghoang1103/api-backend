/**
 * Chụp ảnh màn hình cho tài liệu (`CTLT_CHUP=<thư mục> npm run start:mock`, chỉ bản chưa đóng gói): trang chủ +
 * thư viện, sáng + tối. Chờ thư viện có mục (việc mẫu "xong" tự tải về) rồi mới chụp.
 */
import type { BrowserWindow } from 'electron';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { KENH } from '../shared/ipc';

const cho = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function chup(w: BrowserWindow, tep: string): Promise<void> {
  w.webContents.invalidate();
  await cho(300);
  await fsp.writeFile(tep, (await w.webContents.capturePage()).toPNG());
}

export async function chupManHinh(w: BrowserWindow, thuMuc: string): Promise<void> {
  await fsp.mkdir(thuMuc, { recursive: true });
  w.setSize(1180, 800);
  w.center();
  // macOS ngừng vẽ cửa sổ bị che ⇒ capturePage trả khung CŨ. Giữ cửa sổ trên cùng trong lúc chụp.
  w.setAlwaysOnTop(true, 'floating');
  w.show();
  await new Promise<void>((r) => (w.webContents.isLoading() ? w.webContents.once('did-finish-load', () => r()) : r()));
  const js = (s: string) => w.webContents.executeJavaScript(s, true) as Promise<unknown>;
  for (let i = 0; i < 60; i += 1) {
    const n = (await js('window.ctlt.thuVien().then((d) => d.length)')) as number;
    if (n >= 2) break;
    await cho(1000);
  }
  for (const giaoDien of ['sang', 'toi'] as const) {
    for (const trang of ['trang-chu', 'thu-vien'] as const) {
      await js(`document.documentElement.dataset.theme = '${giaoDien}'; location.hash = '#/${trang}'; 0`);
      await cho(1500);
      await chup(w, path.join(thuMuc, `${trang}-${giaoDien}.png`));
    }
  }
  // Hàng việc (cuộn xuống) + trình phát có phụ đề Việt + gốc, giao diện sáng.
  await js(`document.documentElement.dataset.theme = 'sang'; location.hash = '#/trang-chu'; 0`);
  await cho(800);
  await js(`document.querySelector('.cuon').scrollTop = 99999; 0`);
  await cho(800);
  await chup(w, path.join(thuMuc, 'hang-viec-sang.png'));
  const mucId = (await js('window.ctlt.thuVien().then((d) => d[0] && d[0].id)')) as string | undefined;
  if (mucId) {
    w.webContents.send(KENH.moTrinhPhat, mucId);
    await cho(1500);
    await js(`(() => { const v = document.querySelector('video'); if (v) { v.pause(); v.currentTime = 5.2; } const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Phụ đề gốc'); b && b.click(); })(); 0`);
    await cho(1200);
    await chup(w, path.join(thuMuc, 'trinh-phat.png'));
  }
}
