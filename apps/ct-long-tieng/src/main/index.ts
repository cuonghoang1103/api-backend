/**
 * CT Lồng Tiếng — tiến trình chính.
 *
 * App là đầu cuối MỎNG: phần nặng (tách giọng, chép lời, dịch, đọc giọng cuong8) chạy ở trạm máy nhà sau API web
 * `/api/v1/long-tieng`. App lo: nhận việc (link / tệp), tải lên, theo dõi, TỰ TẢI kết quả về thư mục, thư viện +
 * trình phát, và "Tải trên máy này" bằng yt-dlp khi trạm không tải được link.
 *
 * Bảo mật (renderer = vùng không tin): contextIsolation + sandbox + không nodeIntegration + webSecurity; CSP chặt
 * ở bản đóng gói; chặn điều hướng/mở cửa sổ mới; từ chối mọi xin quyền; IPC kiểm người gửi + kiểm đầu vào; mã kết
 * nối chỉ nằm ở main và kho khoá hệ điều hành.
 */
import { app, BrowserWindow, dialog, ipcMain, Menu, nativeTheme, session, shell, type IpcMainInvokeEvent } from 'electron';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { chuanHoaCaiDat, chuanHoaMayChu, laMaKetNoi, type CaiDat } from '../shared/caiDat';
import { KENH, kiemId, kiemLink, kiemMucId, kiemTuyChon, type KetQuaThaoTac, type TrangThaiApp } from '../shared/ipc';
import type { BaiNhac } from '../shared/hopDong';
import { laTepNhac, laTepVideo } from '../shared/tenTep';
import { ApiLongTieng } from './api';
import { datChayCungMay, moCungMay } from './chayCungMay';
import { dangKySchemeDacQuyen, phucVuGiaoDien, phucVuMedia, SCHEME_APP } from './giaoThuc';
import { HangViec } from './hangViec';
import { capNhatKhay, taoKhay } from './khay';
import { docCaiDat, docMa, ghiCaiDat, luuMa, luuMaDuoc, xoaMa } from './kho';
import { docPhuDe, duongDanMuc, quetThuVien } from './thuVien';
import { timFfmpeg } from './ytdlp';

const MOCK = process.argv.includes('--mock') || process.env.CTLT_MOCK === '1';
const DEV_URL = process.env.CTLT_DEV_URL ?? null;
const GOC_APP = DEV_URL ? new URL(DEV_URL).origin : `${SCHEME_APP}://app`;

/**
 * URL có thuộc giao diện của app không. KHÔNG dùng `new URL(x).origin`: với scheme tự đăng ký (`ctlt:`) WHATWG URL
 * của Node trả origin "null" ⇒ so origin là chặn nhầm mọi thứ (hoặc tệ hơn, cho qua mọi "null").
 */
function laGocApp(url: string | undefined): boolean {
  try {
    const u = new URL(url ?? '');
    if (DEV_URL) return u.origin === GOC_APP;
    return u.protocol === `${SCHEME_APP}:` && u.host === 'app';
  } catch {
    return false;
  }
}

// Thư mục dữ liệu riêng, tên không dấu (tránh trục trặc đường dẫn Unicode ở vài bản Linux/Windows cũ). Chế độ thử
// dùng thư mục KHÁC hẳn ⇒ không bao giờ lẫn mã kết nối thật với dữ liệu giả.
app.setName('CT Lồng Tiếng');
app.setPath('userData', path.join(app.getPath('appData'), MOCK ? 'ct-long-tieng-mock' : 'ct-long-tieng'));

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

dangKySchemeDacQuyen();

let cuaSo: BrowserWindow | null = null;
let dangThoat = false;
let caiDat: CaiDat;
let api: ApiLongTieng;
let hang: HangViec;
let mayChuThat: string;
let goiCapNhat: NodeJS.Timeout | null = null;
/** Bài nhạc nền đã lấy về — nguồn DUY NHẤT của URL nghe thử (renderer chỉ đưa mã bài). */
const nhacDaBiet = new Map<string, BaiNhac>();

const taiNguyen = () => path.join(app.getAppPath(), 'resources');
const tacNhan = () => `CTLongTieng/${app.getVersion()} (${process.platform}; ${process.arch})`;

function cuaSoHien(): boolean {
  return !!cuaSo && cuaSo.isVisible() && !cuaSo.isMinimized();
}

function anhChup(): TrangThaiApp {
  return {
    daKetNoi: api.coMa,
    luuMaDuoc: MOCK || luuMaDuoc(),
    mock: MOCK,
    phienBan: app.getVersion(),
    heDieuHanh: process.platform,
    caiDat,
    viec: hang.anhChup(),
    loiMang: hang.loiMang,
    thuMucKetQua: hang.thuMucKetQua,
  };
}

function moApp(): void {
  if (!cuaSo) taoCuaSo();
  cuaSo?.show();
  if (cuaSo?.isMinimized()) cuaSo.restore();
  cuaSo?.focus();
}

function thoat(): void {
  dangThoat = true;
  app.quit();
}

/** Gom nhiều thay đổi tiến độ trong 200 ms thành một lần gửi. */
function baoThayDoi(): void {
  if (goiCapNhat) return;
  goiCapNhat = setTimeout(() => {
    goiCapNhat = null;
    const s = anhChup();
    cuaSo?.webContents.send(KENH.capNhat, s);
    capNhatKhay(s.viec, moApp, thoat);
  }, 200);
}

function taoCuaSo(): void {
  const an = moCungMay();
  cuaSo = new BrowserWindow({
    width: 1180,
    height: 800,
    minWidth: 860,
    minHeight: 600,
    show: false,
    title: 'CT Lồng Tiếng',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#12141f' : '#f6f7fb',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: process.platform === 'linux' ? path.join(taiNguyen(), 'icon.png') : undefined,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged,
      spellcheck: false,
    },
  });
  const w = cuaSo;
  w.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//.test(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  w.webContents.on('will-navigate', (e, url) => {
    if (!laGocApp(url)) e.preventDefault();
  });
  w.webContents.on('will-attach-webview', (e) => e.preventDefault());
  w.once('ready-to-show', () => { if (!an || process.env.CTLT_CHUP) w.show(); });
  w.on('close', (e) => {
    if (!dangThoat) { e.preventDefault(); w.hide(); }
  });
  // Cửa sổ hiện lại ⇒ hỏi ngay (lúc ẩn mà không có việc chạy thì vòng hỏi đã ngừng).
  w.on('show', () => hang.hoiNgay());
  w.on('restore', () => hang.hoiNgay());
  w.on('closed', () => { if (cuaSo === w) cuaSo = null; });
  void w.loadURL(DEV_URL ?? `${SCHEME_APP}://app/index.html`);
}

// ── IPC ────────────────────────────────────────────────────────────────────

function tuApp(e: IpcMainInvokeEvent): boolean {
  return laGocApp(e.senderFrame?.url);
}

function xuLy<A extends unknown[], R>(kenh: string, fn: (...a: A) => Promise<R> | R): void {
  ipcMain.handle(kenh, async (e, ...a: unknown[]) => {
    if (!tuApp(e)) throw new Error('IPC bị từ chối');
    return fn(...(a as A));
  });
}

async function boc(fn: () => Promise<unknown>): Promise<KetQuaThaoTac> {
  try { await fn(); return { ok: true }; } catch (e) { return { ok: false, loi: (e as Error).message }; }
}

function dangKyIpc(): void {
  xuLy(KENH.layTrangThai, () => anhChup());
  xuLy(KENH.lamMoi, () => { hang.hoiNgay(); });

  xuLy(KENH.ketNoi, (ma: unknown) => boc(async () => {
    const s = typeof ma === 'string' ? ma.trim() : '';
    if (!laMaKetNoi(s)) throw new Error('Mã kết nối phải bắt đầu bằng "ctlt_" — hãy chép đúng mã từ trang web.');
    await api.kiemMa(s);
    await luuMa(s);
    api.datMa(s);
    hang.batDau();
    baoThayDoi();
  }));

  xuLy(KENH.dangXuat, async () => {
    await xoaMa();
    api.datMa(null);
    hang.xoaHet();
    baoThayDoi();
  });

  xuLy(KENH.moTrangWeb, () => shell.openExternal(`${mayChuThat}/long-tieng`));

  const tuyChon = (v: unknown) => kiemTuyChon(v, { lang: caiDat.ngonNgu, goc: caiDat.goc, nhip: caiDat.nhip, nhacNen: caiDat.nhacNen });

  xuLy(KENH.dsNhac, async () => {
    try {
      const ds = await api.dsNhac();
      nhacDaBiet.clear();
      for (const b of ds) nhacDaBiet.set(b.id, b);
      return { ok: true, ds: ds.map((b) => ({ ...b, nghiThu: b.nghiThu ? `ctlt-media://nghe-thu/${encodeURIComponent(b.id)}` : null })) };
    } catch (e) {
      return { ok: false, loi: (e as Error).message, ds: [] };
    }
  });

  xuLy(KENH.chonNhacTep, async () => {
    const r = await dialog.showOpenDialog(cuaSo!, {
      title: 'Chọn nhạc nền của bạn',
      properties: ['openFile'],
      filters: [{ name: 'Âm thanh', extensions: ['mp3', 'm4a', 'aac', 'wav', 'ogg', 'opus', 'flac'] }],
    });
    const p = r.filePaths[0];
    if (r.canceled || !p) return { ok: false };
    if (!laTepNhac(p)) return { ok: false, loi: 'Chỉ nhận tệp âm thanh (mp3, m4a, wav, ogg, flac…).' };
    caiDat = { ...caiDat, nhacNenTep: p, nhacNen: { ...caiDat.nhacNen, loai: 'tep', id: null } };
    await ghiCaiDat(caiDat);
    baoThayDoi();
    return { ok: true, ten: path.basename(p) };
  });

  xuLy(KENH.taoViecLink, (url: unknown, tc: unknown) => boc(async () => {
    const link = kiemLink(url);
    if (!link) throw new Error('Link không hợp lệ — hãy dán link http(s) của video.');
    await hang.taoTuLink(link, tuyChon(tc));
  }));

  xuLy(KENH.chonTep, (tc: unknown) => boc(async () => {
    const r = await dialog.showOpenDialog(cuaSo!, {
      title: 'Chọn video để lồng tiếng',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Video', extensions: ['mp4', 'mkv', 'webm', 'mov', 'm4v', 'avi', 'flv', 'ts', 'wmv'] }],
    });
    if (r.canceled || !r.filePaths.length) return;
    const { boQua } = await hang.taoTuTep(r.filePaths, tuyChon(tc));
    if (boQua.length) throw new Error(`Bỏ qua ${boQua.length} tệp không phải video: ${boQua.slice(0, 3).join(', ')}`);
  }));

  xuLy(KENH.taoViecTep, (dsDuongDan: unknown, tc: unknown) => boc(async () => {
    if (!Array.isArray(dsDuongDan) || dsDuongDan.length > 50) throw new Error('Danh sách tệp không hợp lệ.');
    const ds = dsDuongDan.filter((p): p is string => typeof p === 'string' && path.isAbsolute(p) && laTepVideo(p));
    if (!ds.length) throw new Error('Không có tệp video nào (mp4, mkv, webm, mov…).');
    const { boQua } = await hang.taoTuTep(ds, tuyChon(tc));
    const boThem = dsDuongDan.length - ds.length + boQua.length;
    if (boThem) throw new Error(`Bỏ qua ${boThem} tệp không phải video.`);
  }));

  xuLy(KENH.huyViec, (id: unknown) => boc(async () => { const v = kiemId(id); if (v) await hang.huy(v); }));
  xuLy(KENH.thuLai, (id: unknown) => boc(async () => { const v = kiemId(id); if (v) await hang.thuLai(v); }));
  xuLy(KENH.taiTrenMay, (id: unknown) => boc(async () => { const v = kiemId(id); if (v) void hang.taiTrenMay(v); }));
  xuLy(KENH.taiVe, (id: unknown) => boc(async () => { const v = kiemId(id); if (v) hang.taiVeThuCong(v); }));
  xuLy(KENH.moThuMucViec, async (id: unknown) => {
    const v = kiemId(id);
    const p = v ? hang.thuMucCuaViec(v) : null;
    if (p) await shell.openPath(p);
  });

  xuLy(KENH.thuVien, () => quetThuVien(hang.thuMucKetQua));
  xuLy(KENH.moThuMucMuc, async (id: unknown) => {
    const m = kiemMucId(id);
    const p = m ? duongDanMuc(hang.thuMucKetQua, m) : null;
    if (p) await shell.openPath(p);
  });
  xuLy(KENH.docPhuDe, async (id: unknown, loai: unknown) => {
    const m = kiemMucId(id);
    if (!m || (loai !== 'vi' && loai !== 'goc')) return null;
    return docPhuDe(hang.thuMucKetQua, m, loai);
  });

  xuLy(KENH.luuCaiDat, (p: unknown) => boc(async () => {
    const vao = (typeof p === 'object' && p !== null ? p : {}) as Record<string, unknown>;
    // Thư mục tải CHỈ đổi qua hộp thoại (chonThuMucTai) — renderer không được đặt đường dẫn tuỳ ý.
    delete vao.thuMucTai;
    delete vao.nhacNenTep;
    if ('mayChu' in vao && vao.mayChu !== undefined && chuanHoaMayChu(vao.mayChu) === null) {
      throw new Error('Địa chỉ máy chủ phải là https://… (http chỉ cho localhost).');
    }
    const cu = caiDat;
    caiDat = chuanHoaCaiDat({ ...caiDat, ...vao }, caiDat);
    await ghiCaiDat(caiDat);
    if (cu.chayCungMay !== caiDat.chayCungMay) await datChayCungMay(caiDat.chayCungMay);
    if (cu.mayChu !== caiDat.mayChu && !MOCK) { mayChuThat = caiDat.mayChu; api.datMayChu(caiDat.mayChu); hang.hoiNgay(); }
    if (!cu.tuTaiVe && caiDat.tuTaiVe) hang.hoiNgay();
    baoThayDoi();
  }));

  xuLy(KENH.chonThuMucTai, () => boc(async () => {
    const r = await dialog.showOpenDialog(cuaSo!, {
      title: 'Chọn thư mục lưu video đã lồng tiếng',
      defaultPath: caiDat.thuMucTai,
      properties: ['openDirectory', 'createDirectory'],
    });
    if (r.canceled || !r.filePaths[0]) return;
    caiDat = { ...caiDat, thuMucTai: r.filePaths[0] };
    await ghiCaiDat(caiDat);
    baoThayDoi();
  }));

  xuLy(KENH.moThuMucTai, async () => {
    await fsp.mkdir(hang.thuMucKetQua, { recursive: true });
    await shell.openPath(hang.thuMucKetQua);
  });
}

// ── Khởi động ──────────────────────────────────────────────────────────────

function khoaPhien(): void {
  // Chỉ cho đúng một quyền: toàn màn hình của trình phát.
  session.defaultSession.setPermissionRequestHandler((_wc, quyen, cb) => cb(quyen === 'fullscreen'));
  session.defaultSession.setPermissionCheckHandler((_wc, quyen) => quyen === 'fullscreen');
  // Renderer không tự gọi mạng (main làm hết) ⇒ chặn mọi yêu cầu http(s) đi ra từ trang, trừ dev server.
  session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (d, cb) => {
    cb({ cancel: !(DEV_URL && d.url.startsWith(GOC_APP)) });
  });
}

// macOS bắn `activate` NGAY lúc mở app — trước khi khởi động xong (IPC chưa đăng ký, máy chủ giả chưa lên). Mở cửa
// sổ lúc đó là ra một cửa sổ thứ hai không có IPC ("No handler registered"). Chỉ phản hồi khi đã sẵn sàng.
let sanSang = false;
app.on('second-instance', () => { if (sanSang) moApp(); });
app.on('activate', () => { if (sanSang) moApp(); });
app.on('before-quit', () => { dangThoat = true; hang?.dung(); });
app.on('window-all-closed', () => { /* ở lại khay */ });

void app.whenReady().then(async () => {
  khoaPhien();
  phucVuGiaoDien(path.join(__dirname, '../renderer'));
  phucVuMedia(() => hang.thuMucKetQua, async (id, range) => {
    const bai = nhacDaBiet.get(id);
    if (!bai?.nghiThu) return new Response('Not found', { status: 404 });
    return api.layNgheThu(bai.nghiThu, range);
  });

  const thuMucMacDinh = MOCK ? path.join(app.getPath('temp'), 'ctlt-mock-videos') : undefined;
  caiDat = docCaiDat(thuMucMacDinh);
  mayChuThat = caiDat.mayChu;
  let goc = caiDat.mayChu;
  let ma = docMa();
  if (MOCK) {
    const { moMayChuGia } = await import('./mock/mayChuGia');
    const mc = await moMayChuGia(app.getPath('userData'), await timFfmpeg());
    goc = mc.goc;
    if (process.env.CTLT_MOCK_MA && laMaKetNoi(process.env.CTLT_MOCK_MA)) ma = process.env.CTLT_MOCK_MA;
  }
  api = new ApiLongTieng(goc, ma, tacNhan());
  hang = new HangViec({
    api,
    caiDat: () => caiDat,
    cuaSoHien,
    thayDoi: baoThayDoi,
    moTrinhPhat: (mucId) => { moApp(); cuaSo?.webContents.send(KENH.moTrinhPhat, mucId); },
  });
  dangKyIpc();

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      { role: 'appMenu', submenu: [{ role: 'about', label: 'Giới thiệu CT Lồng Tiếng' }, { type: 'separator' }, { role: 'hide', label: 'Ẩn' }, { role: 'hideOthers', label: 'Ẩn các app khác' }, { type: 'separator' }, { label: 'Thoát CT Lồng Tiếng', accelerator: 'Cmd+Q', click: thoat }] },
      { role: 'editMenu', label: 'Sửa' },
      { role: 'windowMenu', label: 'Cửa sổ' },
    ]));
  } else {
    Menu.setApplicationMenu(null);
  }

  taoKhay(taiNguyen(), moApp, thoat);
  taoCuaSo();
  sanSang = true;
  hang.batDau();

  if (process.env.CTLT_KIEM_LUONG && MOCK && !app.isPackaged) {
    const { kiemLuong } = await import('./kiemLuong');
    const ok = await kiemLuong({
      cuaSo: cuaSo!,
      thuMucDuLieu: app.getPath('userData'),
      datNhacTep: async (p) => { caiDat = { ...caiDat, nhacNenTep: p, nhacNen: { loai: 'tep', id: null, amLuong: 0.5 } }; await ghiCaiDat(caiDat); },
      taoTuTep: async (p) => { await hang.taoTuTep([p], { lang: 'en', goc: 0.15, nhip: 'cho-giong', nhacNen: caiDat.nhacNen }); },
    }).catch((e) => { console.error(e); return false; });
    dangThoat = true;
    app.exit(ok ? 0 : 1);
  }

  if (process.env.CTLT_CHUP && !app.isPackaged) {
    const { chupManHinh } = await import('./chupManHinh');
    void chupManHinh(cuaSo!, process.env.CTLT_CHUP).finally(thoat);
  }
});
