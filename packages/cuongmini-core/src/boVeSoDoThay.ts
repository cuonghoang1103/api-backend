/**
 * Thay `desktop/src/main/agent/boVeSoDo.ts` khi chạy ngoài app: "bộ vẽ" cho
 * tool `xuat_so_do` là một tab của Chrome/Edge HEADLESS có sẵn trên máy (bản
 * app dùng `BrowserWindow` ẩn). Phần vẽ thật — dựng trang, đo khung, chụp, in
 * PDF — nằm chung ở `agent/xuatSoDo.ts` và chỉ nói chuyện qua kênh CDP, nên hai
 * môi trường cho ra cùng một ảnh.
 *
 * Trình duyệt ẩn TÁCH khỏi trình duyệt AI có cửa sổ (`trinhDuyetThay.ts`): xuất
 * sơ đồ không được mở tab lạ trước mặt người dùng, và không cần cookie của ai.
 * Hồ sơ tạm do puppeteer tự tạo/xoá. Giữ sống 60 giây sau lần dùng cuối — sửa
 * nguồn rồi xuất lại là chuyện liên tục, bật Chrome mỗi lần mất ~1 giây.
 */
import type { Browser } from 'puppeteer-core';

import { LOI_KHONG_CO_TRINH_DUYET, timTrinhDuyet } from './timTrinhDuyet';

/** Cùng hình dạng với `KenhVe` trong `agent/xuatSoDo.ts` (khai lại để tsc của lõi không phải nạp mã desktop). */
export interface KenhCdp { send(phuongThuc: string, thamSo?: Record<string, unknown>): Promise<any> }
export interface KenhVe { cdp: KenhCdp; dong(): Promise<void> }

let an: Promise<Browser> | null = null;
let soDangDung = 0;
let henDong: NodeJS.Timeout | null = null;

async function layTrinhDuyetAn(): Promise<Browser> {
  if (henDong) { clearTimeout(henDong); henDong = null; }
  if (an) {
    const b = await an.catch(() => null);
    if (b?.connected) return b;
    an = null;
  }
  const chay = timTrinhDuyet();
  if (!chay) throw new Error(LOI_KHONG_CO_TRINH_DUYET);
  an = (async () => {
    const pp = await import('puppeteer-core');
    const b = await pp.launch({
      executablePath: chay,
      headless: true,
      protocolTimeout: 90_000,
      args: ['--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--font-render-hinting=none'],
    });
    b.on('disconnected', () => { an = null; });
    return b;
  })();
  an.catch(() => { an = null; });
  return an;
}

export async function moKenhVe(): Promise<KenhVe> {
  const b = await layTrinhDuyetAn();
  soDangDung += 1;
  const p = await b.newPage();
  const s = await p.createCDPSession();
  await s.send('Page.enable');
  return {
    cdp: { send: (m, t) => s.send(m as never, t as never) },
    dong: async () => {
      await p.close().catch(() => undefined);
      soDangDung = Math.max(0, soDangDung - 1);
      if (soDangDung === 0) {
        henDong = setTimeout(() => { void dongBoVe(); }, 60_000);
        henDong.unref?.();
      }
    },
  };
}

export async function dongBoVe(): Promise<void> {
  if (henDong) { clearTimeout(henDong); henDong = null; }
  const cu = an;
  an = null;
  const b = await cu?.catch(() => null);
  await b?.close().catch(() => undefined);
}
