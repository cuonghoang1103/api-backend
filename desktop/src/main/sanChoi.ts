/**
 * SÂN CHƠI 3D trong app desktop.
 *
 * Ba việc, gói trong một file vì chúng chỉ có nghĩa khi đi cùng nhau:
 *   1. Tìm hai thư mục: phần mã (đi kèm bản cài) và phần thế giới (tải về).
 *   2. Tải ~78 MB thế giới lần đầu, có tiến độ, dừng giữa chừng chạy lại được.
 *   3. Phục vụ cả hai qua `app://playground/…` và mở cửa sổ chơi.
 *
 * ─── VÌ SAO HAI THƯ MỤC ─────────────────────────────────────────────────────
 * `resources/playground/` (~12 MB) nằm trong bản cài: index.html, gói JS,
 * Rapier wasm, bộ giải Draco/Basis, phông chữ, và `manifest-media.json`.
 * `userData/san-choi-media/` (~78 MB) là thế giới: âm thanh, model, texture.
 *
 * Nhét cả 90 MB vào bản cài là +47% cho MỌI người dùng, kể cả người chỉ dùng
 * app để ghi chú. Xem `docs/playground-dong-goi-app.md` để có số đo.
 *
 * ─── VÌ SAO TẢI Ở MAIN, KHÔNG Ở RENDERER ────────────────────────────────────
 * `net.fetch` trong main đi thẳng, không vướng CSP `connect-src`, và ghi được
 * xuống đĩa mà không phải chuyển 78 MB qua IPC. Renderer chỉ nhận con số tiến
 * độ.
 */
import { app, BrowserWindow, net } from 'electron';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { IS_DEV, PLAYGROUND_ASSET_BASE, PLAYGROUND_ORIGIN } from './config';
import type { TienDoTai, TrangThaiSanChoi } from '../shared/ipc';
import { hardenWebContents } from './security';

/** Một dòng trong `manifest-media.json` do `dong-goi-san-choi.mjs` sinh ra. */
interface MucManifest {
  p: string;
  size: number;
  sha256: string;
}

interface Manifest {
  version: string;
  totalBytes: number;
  count: number;
  files: MucManifest[];
}

/**
 * Phần mã: trong bản đóng gói nằm ở `resources/playground` (khai bằng
 * `extraResources` trong electron-builder.yml); lúc dev thì lấy thẳng trong cây
 * mã nguồn.
 *
 * ⚠️ `process.resourcesPath` KHÔNG dùng được ở dev — ở đó nó trỏ vào
 * `node_modules/electron/dist/resources`, tức thư mục của chính Electron. Đọc
 * ở đó sẽ luôn 404 và triệu chứng là "màn hình tải quay mãi", không phải một
 * lỗi đọc file.
 */
export function thuMucMa(): string {
  return IS_DEV
    ? path.join(__dirname, '..', '..', 'resources', 'playground')
    : path.join(process.resourcesPath, 'playground');
}

export function thuMucMedia(): string {
  return path.join(app.getPath('userData'), 'san-choi-media');
}

let manifestCache: Manifest | null = null;

export async function docManifest(): Promise<Manifest | null> {
  if (manifestCache) return manifestCache;
  try {
    const raw = await fs.readFile(path.join(thuMucMa(), 'manifest-media.json'), 'utf8');
    manifestCache = JSON.parse(raw) as Manifest;
    return manifestCache;
  } catch {
    return null;
  }
}

/**
 * File đánh dấu "đã tải xong đúng bộ này".
 *
 * Chứa `version` của manifest. Không có nó thì mỗi lần mở app phải `stat` 891
 * file mới biết đủ hay thiếu; có nó thì đọc một dòng là xong. Nó chỉ được ghi
 * SAU khi mọi file đã về đủ, nên một lượt tải đứt giữa chừng không bao giờ để
 * lại dấu "xong".
 */
function duongDauMoc(): string {
  return path.join(thuMucMedia(), '.da-tai');
}

async function docDauMoc(): Promise<string | null> {
  return fs.readFile(duongDauMoc(), 'utf8').then((s) => s.trim()).catch(() => null);
}

export async function trangThai(): Promise<TrangThaiSanChoi> {
  const manifest = await docManifest();
  if (!manifest) {
    return { coPhanMa: false, sanSang: false, version: null, tongByte: 0, daCoByte: 0, soFileThieu: 0 };
  }

  if ((await docDauMoc()) === manifest.version) {
    return {
      coPhanMa: true,
      sanSang: true,
      version: manifest.version,
      tongByte: manifest.totalBytes,
      daCoByte: manifest.totalBytes,
      soFileThieu: 0,
    };
  }

  const goc = thuMucMedia();
  let daCoByte = 0;
  let soFileThieu = 0;
  await Promise.all(
    manifest.files.map(async (m) => {
      const st = await fs.stat(path.join(goc, m.p)).catch(() => null);
      if (st && st.size === m.size) daCoByte += m.size;
      else soFileThieu += 1;
    }),
  );

  return {
    coPhanMa: true,
    sanSang: soFileThieu === 0,
    version: manifest.version,
    tongByte: manifest.totalBytes,
    daCoByte,
    soFileThieu,
  };
}

let dangTai = false;

/**
 * Tải phần thế giới.
 *
 * · Bỏ qua file đã có đúng kích thước ⇒ chạy lại sau khi đứt mạng là tiếp tục,
 *   không phải làm lại từ đầu.
 * · Ghi `.part` rồi đổi tên ⇒ không bao giờ để lại file CỤT mà `stat` thấy
 *   "đủ kích thước". Đây đúng là bẫy đã sụp ở bộ tải nhạc (xem ipc/music.ts).
 * · Đối chiếu sha256 ⇒ proxy hay CDN trả nhầm nội dung thì bắt được ngay, chứ
 *   không phải đợi tới lúc three ném lỗi giải mã giữa màn hình tải.
 */
export async function taiVe(onTienDo: (t: TienDoTai) => void): Promise<void> {
  if (dangTai) return;
  const manifest = await docManifest();
  if (!manifest) {
    onTienDo({ daTaiByte: 0, tongByte: 0, soFileXong: 0, soFileTong: 0, xong: true, loi: 'Bản cài thiếu phần mã sân chơi.' });
    return;
  }

  dangTai = true;
  const goc = thuMucMedia();
  await fs.mkdir(goc, { recursive: true });

  let daTaiByte = 0;
  let soFileXong = 0;
  let loi: string | null = null;

  // Báo tiến độ tối đa ~10 lần/giây. Mỗi file xong mà bắn một sự kiện thì 891
  // sự kiện dồn qua IPC chỉ để vẽ một thanh tiến độ rộng 300px.
  let lanBaoCuoi = 0;
  const bao = () => {
    const gio = Date.now();
    if (gio - lanBaoCuoi < 100) return;
    lanBaoCuoi = gio;
    onTienDo({
      daTaiByte,
      tongByte: manifest.totalBytes,
      soFileXong,
      soFileTong: manifest.files.length,
      xong: false,
    });
  };

  const hangDoi = [...manifest.files];

  async function motTho(): Promise<void> {
    for (;;) {
      const muc = hangDoi.pop();
      if (!muc || loi) return;

      const dich = path.join(goc, muc.p);
      const st = await fs.stat(dich).catch(() => null);
      if (st && st.size === muc.size) {
        daTaiByte += muc.size;
        soFileXong += 1;
        bao();
        continue;
      }

      try {
        const res = await net.fetch(`${PLAYGROUND_ASSET_BASE}/${muc.p}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const bytes = Buffer.from(await res.arrayBuffer());

        const bam = createHash('sha256').update(bytes).digest('hex');
        if (bam !== muc.sha256) throw new Error('sai sha256');

        await fs.mkdir(path.dirname(dich), { recursive: true });
        const tam = `${dich}.part`;
        await fs.writeFile(tam, bytes);
        await fs.rename(tam, dich);

        daTaiByte += muc.size;
        soFileXong += 1;
        bao();
      } catch (e) {
        loi = `${muc.p}: ${e instanceof Error ? e.message : String(e)}`;
        return;
      }
    }
  }

  // Sáu luồng: đủ để lấp băng thông trên mạng nhà, chưa tới mức làm máy chủ
  // coi là một trận dồn yêu cầu. Phần lớn 891 file là tệp nhỏ, nên độ trễ mỗi
  // yêu cầu mới là thứ quyết định, không phải băng thông.
  await Promise.all(Array.from({ length: 6 }, () => motTho()));

  if (!loi) await fs.writeFile(duongDauMoc(), manifest.version);
  dangTai = false;

  onTienDo({
    daTaiByte,
    tongByte: manifest.totalBytes,
    soFileXong,
    soFileTong: manifest.files.length,
    xong: true,
    ...(loi ? { loi } : {}),
  });
}

export async function xoaMedia(): Promise<void> {
  await fs.rm(thuMucMedia(), { recursive: true, force: true });
}

/**
 * Giải một đường dẫn yêu cầu thành file trên đĩa.
 *
 * Thứ tự: phần mã trước, rồi tới phần thế giới. Phần mã đi theo bản cài nên nó
 * luôn khớp với gói JS đang chạy; nếu một file cùng tên tồn tại ở cả hai chỗ
 * thì bản trong bản cài mới là bản đúng.
 *
 * ⚠️ Chốt chặn đi ra ngoài thư mục là BẮT BUỘC ở đây, y như handler của
 * `app://cuongthai`: `app://playground/../../../../etc/passwd` mà không chặn
 * thì đọc được file bất kỳ trên máy. Nó im lặng cho tới lúc bị khai thác.
 */
function trongThuMuc(goc: string, tuong: string): string | null {
  const duong = path.resolve(goc, tuong);
  const gocCoSep = goc.endsWith(path.sep) ? goc : goc + path.sep;
  if (duong !== goc && !duong.startsWith(gocCoSep)) return null;
  return duong;
}

export async function phucVu(rawPath: string): Promise<Response> {
  // Không có đuôi file ⇒ coi như xin trang chủ của game. Sân chơi không có
  // router, nên đây chỉ để `app://playground` (không gạch chéo) cũng mở được.
  const tuong = path.extname(rawPath) === '' ? 'index.html' : rawPath.replace(/^\/+/, '');

  for (const goc of [thuMucMa(), thuMucMedia()]) {
    const duong = trongThuMuc(goc, tuong);
    if (!duong) return new Response('Forbidden', { status: 403 });
    if (await fs.stat(duong).then((s) => s.isFile()).catch(() => false)) {
      return net.fetch(pathToFileURL(duong).toString());
    }
  }

  return new Response('Not found', { status: 404 });
}

let cuaSoGame: BrowserWindow | null = null;

/**
 * Mở cửa sổ chơi.
 *
 * Cửa sổ RIÊNG chứ không nhúng trong trang React: game chiếm trọn khung hình,
 * tự bắt bàn phím và chuột, và người chơi cần phóng to / toàn màn hình mà
 * không kéo theo thanh điều hướng của app.
 *
 * KHÔNG gắn `preload`: game không gọi IPC nào, và một preload thừa là một cửa
 * mở thừa vào main process từ 50k dòng mã bên thứ ba.
 */
export function moCuaSo(cheDo: 'sinh-ton' | 'tu-do' = 'sinh-ton'): BrowserWindow {
  if (cuaSoGame && !cuaSoGame.isDestroyed()) {
    cuaSoGame.focus();
    return cuaSoGame;
  }

  const cuaSo = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 560,
    show: false,
    backgroundColor: '#000000',
    title: 'CuongThai — Sân chơi',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: IS_DEV,
      // Game tự quản vòng lặp rAF của nó. Để Chromium bóp tiến trình nền thì
      // vòng lặp vật lý tụt xuống 1 nhịp/giây khi người chơi alt-tab, và lúc
      // quay lại thì Rapier nhận một bước thời gian khổng lồ, xe văng khỏi bản
      // đồ. Game đã tự tạm dừng khi mất tiêu điểm — nên đừng bóp thêm.
      backgroundThrottling: false,
    },
  });

  cuaSoGame = cuaSo;
  cuaSo.on('closed', () => {
    if (cuaSoGame === cuaSo) cuaSoGame = null;
  });

  hardenWebContents(cuaSo);
  cuaSo.once('ready-to-show', () => cuaSo.show());

  const bam = cheDo === 'sinh-ton' ? '#sinh-ton' : '';
  void cuaSo.loadURL(`${PLAYGROUND_ORIGIN}/index.html${bam}`);

  return cuaSo;
}
