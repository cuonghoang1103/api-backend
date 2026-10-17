/**
 * Kênh `trinhSoan:*` — dò VS Code/Cursor/… đã cài, cài CuongMini Code vào đó,
 * và mở trình soạn. Phần "tìm ở đâu" nằm ở `../trinhSoan.ts` (thuần, có test).
 *
 * Chạy ở MAIN vì renderer (sandbox) không có `fs`/`child_process` — và không
 * được có: renderer chỉ gửi mã trình soạn trong danh sách trắng, mọi đường
 * dẫn, tham số đều do main tự tính.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { shell } from 'electron';
import { MA_TRINH_SOAN, type MaTrinhSoan, type TrinhSoanTinhTrang } from '../../shared/ipc';
import { MA_EXTENSION, deepLink, docPhienBanExt, moiTruongSach, thongTin, ungVien } from '../trinhSoan';
import { handle } from './index';

function timThay(ma: MaTrinhSoan): { app: string | null; cli: string | null } {
  const u = ungVien(ma, process.platform, process.env, homedir());
  return {
    app: u.app.find((p) => existsSync(p)) ?? null,
    cli: u.cli.find((p) => existsSync(p)) ?? null,
  };
}

/**
 * Chạy CLI của trình soạn với tham số CỐ ĐỊNH, có hạn giờ.
 *
 * Windows: CLI là `.cmd` ⇒ bắt buộc `shell: true` (spawn thẳng `.cmd` ném
 * EINVAL từ Node 20). Đường dẫn bọc ngoặc kép vì `Program Files` có dấu cách;
 * tham số là hằng nên không có gì để chèn.
 */
function chayCli(cli: string, thamSo: string[], hanMs: number): Promise<{ ok: boolean; ra: string; loi?: string }> {
  return new Promise((xong) => {
    let ra = '';
    let da = false;
    const ket = (kq: { ok: boolean; ra: string; loi?: string }): void => { if (!da) { da = true; xong(kq); } };
    const laWin = process.platform === 'win32';
    let con;
    try {
      con = spawn(laWin ? `"${cli}"` : cli, thamSo, {
        shell: laWin,
        windowsHide: true,
        env: moiTruongSach(process.env),
      });
    } catch (e) {
      ket({ ok: false, ra, loi: e instanceof Error ? e.message : String(e) });
      return;
    }
    const gom = (d: Buffer): void => { ra = (ra + d.toString()).slice(-20_000); };
    con.stdout?.on('data', gom);
    con.stderr?.on('data', gom);
    const dongHo = setTimeout(() => {
      try { con.kill(); } catch { /* đã thoát */ }
      ket({ ok: false, ra, loi: `Quá ${Math.round(hanMs / 1000)} giây chưa xong.` });
    }, hanMs);
    dongHo.unref?.();
    con.on('error', (e) => { clearTimeout(dongHo); ket({ ok: false, ra, loi: e.message }); });
    con.on('close', (ma) => {
      clearTimeout(dongHo);
      ket(ma === 0 ? { ok: true, ra } : { ok: false, ra, loi: `Thoát với mã ${ma}.` });
    });
  });
}

async function doMot(ma: MaTrinhSoan): Promise<TrinhSoanTinhTrang> {
  const t = thongTin(ma);
  const { app, cli } = timThay(ma);
  let phienBanExt: string | null = null;
  let kiemDuoc = false;
  if (cli) {
    // 15 giây: CLI của VS Code khởi động nguội mất vài giây trên máy yếu.
    const kq = await chayCli(cli, ['--list-extensions', '--show-versions'], 15_000);
    if (kq.ok) { kiemDuoc = true; phienBanExt = docPhienBanExt(kq.ra); }
  }
  return {
    ma,
    ten: t.ten,
    daCai: Boolean(app || cli),
    coCli: Boolean(cli),
    kiemDuocExt: kiemDuoc,
    phienBanExt,
  };
}

export function registerTrinhSoanHandlers(): void {
  handle('trinhSoan:doMay', async () => Promise.all(MA_TRINH_SOAN.map(doMot)));

  handle('trinhSoan:caiExt', async ({ ma }) => {
    const { cli } = timThay(ma);
    if (!cli) {
      // Không có CLI (vd Antigravity trên macOS) ⇒ để chính trình soạn mở
      // trang extension; người dùng bấm Install ở đó.
      await shell.openExternal(deepLink(ma));
      return { ok: true, quaDeepLink: true };
    }
    const kq = await chayCli(cli, ['--install-extension', MA_EXTENSION, '--force'], 180_000);
    if (!kq.ok) {
      return { ok: false, loi: kq.loi ?? 'Cài không thành công.', log: kq.ra.slice(-2000) };
    }
    const sau = await doMot(ma);
    return { ok: true, phienBan: sau.phienBanExt ?? undefined };
  });

  handle('trinhSoan:mo', async ({ ma }) => {
    const { app, cli } = timThay(ma);
    if (process.platform === 'darwin' && app) {
      const loi = await shell.openPath(app);
      return loi ? { ok: false, loi } : { ok: true };
    }
    if (cli) {
      // Mở cửa sổ trình soạn rồi để nó sống riêng — không giữ tiến trình con.
      const laWin = process.platform === 'win32';
      const con = spawn(laWin ? `"${cli}"` : cli, [], {
        shell: laWin, detached: true, stdio: 'ignore', windowsHide: true, env: moiTruongSach(process.env),
      });
      con.on('error', () => { /* đã báo "đã mở"; lỗi hiếm, người dùng tự mở */ });
      con.unref();
      return { ok: true };
    }
    return { ok: false, loi: `Không tìm thấy ${thongTin(ma).ten} trên máy này.` };
  });
}

