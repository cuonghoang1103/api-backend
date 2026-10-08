/**
 * ============================================================
 * CÀI GAME RIÊNG VÀO MÁY (08/10/2026) — Flying Pencil
 * ============================================================
 *
 * Game nặng hàng trăm MB, cập nhật theo nhịp riêng, nên KHÔNG nằm trong bó app:
 * app đọc `phien_ban.json` (một URL cố định), tải zip, kiểm SHA-256, giải nén
 * vào thư mục của người dùng rồi mở bằng LaunchServices. Bản game mới chỉ cần
 * đẩy zip + `phien_ban.json` mới lên — không phát hành lại app.
 *
 * Bố cục trên đĩa (`userData` = ~/Library/Application Support/<app>):
 *
 *   games/<ma>/
 *     _tai/<version>.zip(.dangtai)   phần tải (dở) — xoá sau khi cài xong
 *     <version>.giainen/             thư mục tạm khi giải nén
 *     <version>/<ten_app>            bản đang dùng
 *     dang-dung.json                 { version, tenApp, ngayCai, dungLuong }
 *
 * Mọi đường dẫn đều do main dựng từ mã game (danh sách đóng) + `version`/
 * `ten_app` đã qua `docPhienBan` (mẫu chặt) + `namTrong()` lần nữa trước mọi
 * thao tác xoá/mở. Renderer không gửi được đường dẫn nào.
 *
 * Bài học áp ở đây ([[feedback_bay_electron_desktop]]):
 *   • xoá đệ quy bó `.app` phải `process.noAsar = true` (Electron vá `fs`);
 *   • bước DỌN (xoá zip, xoá bản cũ) bọc try/catch riêng — dọn hỏng không được
 *     biến "cài xong" thành "cài thất bại".
 */
import { app, shell } from 'electron';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, realpath, rename, rm, stat, statfs, writeFile } from 'node:fs/promises';
import { release } from 'node:os';
import { join } from 'node:path';
import type { TroChoiMa, TroChoiTienDo, TroChoiTinhTrang } from '../../shared/ipc';
import { kiemSha256, LoiTai, taiFile } from '../aiCucBo/taiVe';
import { docPhienBan, kiemHoTro, namTrong, type BanDayDu } from './phienBan';

/**
 * URL cố định đọc `phien_ban.json`. Thẻ `flying-pencil-latest` là release
 * PRERELEASE + `--latest=false` trong kho phát hành công khai — nó KHÔNG BAO
 * GIỜ là "latest" của kho, nên không chen vào đường tự cập nhật của app
 * (electron-updater đọc `/releases/latest`). Xem `dong_goi_game.sh`.
 *
 * `CT_FLYING_PENCIL_MANIFEST` đè được để thử bằng máy chủ http cục bộ.
 */
const PHIEN_BAN_URL: Record<TroChoiMa, string> = {
  'flying-pencil': process.env.CT_FLYING_PENCIL_MANIFEST
    ?? 'https://github.com/cuonghoang1103/cuongthai-desktop/releases/download/flying-pencil-latest/phien_ban.json',
};

interface DangDung {
  version: string;
  tenApp: string;
  ngayCai: string;
  dungLuong: number;
}

const dangTai = new Map<TroChoiMa, AbortController>();
const boNho = new Map<TroChoiMa, { luc: number; ban: BanDayDu | null; loi?: string }>();

export function thuMucGame(ma: TroChoiMa): string {
  return join(app.getPath('userData'), 'games', ma);
}

function chay(lenh: string, thamSo: string[]): Promise<{ ok: boolean; ra: string }> {
  return new Promise((xong) => {
    execFile(lenh, thamSo, { timeout: 10 * 60_000, maxBuffer: 4 << 20 }, (loi, ra, raLoi) => {
      xong({ ok: !loi, ra: `${ra}${raLoi}`.slice(-2000) || (loi?.message ?? '') });
    });
  });
}

/** Xoá đệ quy, kể cả bó `.app` (xem chú thích đầu tệp). */
async function xoaHan(duong: string): Promise<void> {
  const cu = process.noAsar;
  try {
    process.noAsar = true;
    await rm(duong, { recursive: true, force: true });
  } finally {
    process.noAsar = cu;
  }
}

async function docDangDung(ma: TroChoiMa): Promise<(DangDung & { duongApp: string }) | null> {
  const goc = thuMucGame(ma);
  try {
    const d = JSON.parse(await readFile(join(goc, 'dang-dung.json'), 'utf8')) as DangDung;
    if (typeof d.version !== 'string' || typeof d.tenApp !== 'string') return null;
    const duongApp = join(goc, d.version, d.tenApp);
    if (!namTrong(goc, duongApp) || !existsSync(join(duongApp, 'Contents', 'MacOS'))) return null;
    return { ...d, duongApp };
  } catch {
    return null;
  }
}

async function layPhienBan(ma: TroChoiMa, napLai: boolean): Promise<{ ban: BanDayDu | null; loi?: string }> {
  const cu = boNho.get(ma);
  if (!napLai && cu && Date.now() - cu.luc < 60_000) return cu;
  const url = PHIEN_BAN_URL[ma];
  let kq: { ban: BanDayDu | null; loi?: string };
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'CuongThai-Desktop', 'Cache-Control': 'no-cache' },
      redirect: 'follow',
      signal: AbortSignal.timeout(12_000),
    });
    if (!r.ok) throw new Error(r.status === 404 ? 'Bản game chưa được phát hành.' : `Máy chủ trả ${r.status}.`);
    kq = { ban: docPhienBan(await r.json(), url) };
  } catch (e) {
    const m = (e as Error)?.message ?? '';
    const thanThien = /fetch failed|ENOTFOUND|ECONN|timeout|aborted/i.test(m)
      ? 'Không kết nối được máy chủ tải game — kiểm tra mạng.'
      : m || 'Không đọc được thông tin phiên bản.';
    kq = { ban: null, loi: thanThien };
  }
  boNho.set(ma, { luc: Date.now(), ...kq });
  return kq;
}

function mayNay() {
  return { nenTang: process.platform, kienTruc: process.arch, darwin: release() };
}

async function coTep(p: string): Promise<number> {
  try { const s = await stat(p); return s.isFile() ? s.size : 0; } catch { return 0; }
}

export async function tinhTrang(ma: TroChoiMa, napLai = false): Promise<TroChoiTinhTrang> {
  const [{ ban, loi }, daCai] = await Promise.all([layPhienBan(ma, napLai), docDangDung(ma)]);
  let daTaiDo = 0;
  if (ban) {
    const zip = join(thuMucGame(ma), '_tai', `${ban.version}.zip`);
    daTaiDo = (await coTep(zip)) || (await coTep(`${zip}.dangtai`));
  }
  return {
    ma,
    hoTro: kiemHoTro(ban, mayNay()),
    daCai: daCai ? { version: daCai.version, ngayCai: daCai.ngayCai, dungLuong: daCai.dungLuong } : null,
    banMoi: ban
      ? {
        version: ban.version, size: ban.size, ngay: ban.ngay, ghiChu: ban.ghiChu, yeuCau: ban.yeuCau,
        nhatKy: ban.nhatKy, media: ban.media, ...(ban.sizeGiaiNen ? { sizeGiaiNen: ban.sizeGiaiNen } : {}),
      }
      : null,
    ...(loi ? { loiBanMoi: loi } : {}),
    coCapNhat: !!(ban && daCai && ban.version !== daCai.version),
    dangTai: dangTai.has(ma),
    daTaiDo,
  };
}

async function dungLuongThuMuc(p: string): Promise<number> {
  const kq = await chay('/usr/bin/du', ['-sk', p]);
  const kb = Number.parseInt(kq.ra.trim().split(/\s+/)[0] ?? '', 10);
  return Number.isFinite(kb) ? kb * 1024 : 0;
}

/**
 * Tải (tiếp) → kiểm SHA-256 → giải nén → tráo bản. Chạy NỀN: hàm IPC trả về
 * ngay, mọi kết cục báo qua `bao` (kể cả lỗi), không bao giờ ném ra ngoài.
 */
export function batDauTai(ma: TroChoiMa, bao: (t: TroChoiTienDo) => void): { ok: boolean; loi?: string } {
  if (dangTai.has(ma)) return { ok: false, loi: 'Đang tải rồi.' };
  const bo = new AbortController();
  dangTai.set(ma, bo);
  const baoBuoc = (t: Omit<TroChoiTienDo, 'ma'>) => bao({ ma, ...t });

  void (async () => {
    const { ban, loi } = await layPhienBan(ma, true);
    if (!ban) throw new Error(loi ?? 'Không đọc được thông tin phiên bản.');
    const hoTro = kiemHoTro(ban, mayNay());
    if (!hoTro.ok) throw new Error(hoTro.lyDo);

    const goc = thuMucGame(ma);
    const thuMucTai = join(goc, '_tai');
    await mkdir(thuMucTai, { recursive: true });
    const zip = join(thuMucTai, `${ban.version}.zip`);

    /* Đủ chỗ trống không: zip + bản giải nén + 10% dư. Hết đĩa giữa lúc giải
       nén để lại một bó .app cụt — tệ hơn là nói trước. */
    try {
      const fs = await statfs(goc);
      const trong = fs.bavail * fs.bsize;
      const can = (ban.size - (await coTep(`${zip}.dangtai`))) + (ban.sizeGiaiNen ?? ban.size * 2.2) * 1.1;
      if (trong > 0 && trong < can) {
        throw new Error(`Ổ đĩa còn ${(trong / 1e9).toFixed(1)} GB — cần khoảng ${(can / 1e9).toFixed(1)} GB để tải và cài.`);
      }
    } catch (e) {
      if ((e as Error)?.message?.startsWith('Ổ đĩa')) throw e;
    }

    baoBuoc({ buoc: 'tai', daCo: 0, tong: ban.size, bps: 0 });
    await taiFile({
      url: ban.url,
      dich: zip,
      coMong: ban.size,
      signal: bo.signal,
      onTienDo: (t) => baoBuoc({ buoc: 'tai', daCo: t.daCo, tong: t.tong || ban.size, bps: t.bps }),
    });

    baoBuoc({ buoc: 'kiem', daCo: ban.size, tong: ban.size, bps: 0 });
    if (!(await kiemSha256(zip, ban.sha256))) {
      await rm(zip, { force: true });
      await rm(`${zip}.sha256`, { force: true });
      throw new Error('Tệp tải về bị hỏng (sai mã kiểm tra SHA-256). Đã xoá — bấm tải lại để tải sạch từ đầu.');
    }
    if (bo.signal.aborted) throw new LoiTai('Đã dừng tải.', 'huy');

    baoBuoc({ buoc: 'giaiNen', daCo: ban.size, tong: ban.size, bps: 0 });
    const tam = join(goc, `${ban.version}.giainen`);
    const dich = join(goc, ban.version);
    if (!namTrong(goc, tam) || !namTrong(goc, dich)) throw new Error('Đường dẫn cài đặt không hợp lệ.');
    await xoaHan(tam);
    await mkdir(tam, { recursive: true });
    /* `ditto` của macOS: giữ symlink trong Frameworks, quyền chạy, chữ ký. */
    const gn = await chay('/usr/bin/ditto', ['-x', '-k', zip, tam]);
    if (!gn.ok) {
      await xoaHan(tam);
      throw new Error(`Không giải nén được: ${gn.ra.trim() || 'lỗi không rõ'}`);
    }
    const appTam = join(tam, ban.tenApp);
    if (!existsSync(join(appTam, 'Contents', 'MacOS'))) {
      await xoaHan(tam);
      throw new Error(`Gói tải về không có ${ban.tenApp} bên trong.`);
    }
    /* Tải bằng Node nên macOS KHÔNG gắn cờ quarantine — gỡ phòng xa (giải nén
       bằng công cụ khác có thể chép cờ từ zip sang). Có cờ đó + app chưa ký
       công chứng ⇒ Gatekeeper chặn "không thể mở". */
    await chay('/usr/bin/xattr', ['-dr', 'com.apple.quarantine', tam]);

    await xoaHan(dich);
    await rename(tam, dich);
    const dungLuong = await dungLuongThuMuc(join(dich, ban.tenApp));
    const dd: DangDung = { version: ban.version, tenApp: ban.tenApp, ngayCai: new Date().toISOString(), dungLuong };
    await writeFile(join(goc, 'dang-dung.json'), JSON.stringify(dd, null, 2));

    /* ── Dọn: hỏng thì thôi, việc chính đã xong. ── */
    try {
      await rm(zip, { force: true });
      await rm(`${zip}.sha256`, { force: true });
    } catch { /* bỏ qua */ }
    try {
      for (const ten of await readdir(goc)) {
        if (ten === ban.version || ten === '_tai' || ten === 'dang-dung.json') continue;
        const p = join(goc, ten);
        if (namTrong(goc, p)) await xoaHan(p);
      }
    } catch { /* bỏ qua */ }

    baoBuoc({ buoc: 'xong', daCo: ban.size, tong: ban.size, bps: 0 });
  })()
    .catch((e: unknown) => {
      const huy = e instanceof LoiTai ? e.maLoi === 'huy' : (e as { name?: string })?.name === 'AbortError';
      baoBuoc({
        buoc: huy ? 'huy' : 'loi', daCo: 0, tong: 0, bps: 0,
        ...(huy ? {} : { loi: (e as Error)?.message || 'Lỗi không rõ.' }),
      });
    })
    .finally(() => { if (dangTai.get(ma) === bo) dangTai.delete(ma); });

  return { ok: true };
}

export function huyTai(ma: TroChoiMa): void {
  dangTai.get(ma)?.abort();
}

export async function choi(ma: TroChoiMa): Promise<{ ok: boolean; loi?: string; chan?: boolean }> {
  const dd = await docDangDung(ma);
  if (!dd) return { ok: false, loi: 'Game chưa được cài.' };
  const goc = thuMucGame(ma);
  let that: string;
  try {
    that = await realpath(dd.duongApp);
  } catch {
    return { ok: false, loi: 'Không tìm thấy game trên máy — hãy cài lại.' };
  }
  if (!namTrong(await realpath(goc), that)) return { ok: false, loi: 'Đường dẫn game không hợp lệ.' };
  /* `shell.openPath` đi qua LaunchServices — y như bấm đúp trong Finder.
     Trả chuỗi rỗng khi thành công, câu lỗi khi không mở được. */
  const loi = await shell.openPath(that);
  if (loi) return { ok: false, loi, chan: true };
  return { ok: true };
}

export async function go(ma: TroChoiMa): Promise<{ ok: boolean; loi?: string }> {
  huyTai(ma);
  const goc = thuMucGame(ma);
  try {
    await xoaHan(goc);
    boNho.delete(ma);
    return { ok: true };
  } catch (e) {
    return { ok: false, loi: (e as Error)?.message || 'Không xoá được.' };
  }
}

export async function moThuMuc(ma: TroChoiMa): Promise<{ ok: boolean }> {
  const dd = await docDangDung(ma);
  if (dd) {
    shell.showItemInFolder(dd.duongApp);
    return { ok: true };
  }
  const goc = thuMucGame(ma);
  if (existsSync(goc)) {
    await shell.openPath(goc);
    return { ok: true };
  }
  return { ok: false };
}
