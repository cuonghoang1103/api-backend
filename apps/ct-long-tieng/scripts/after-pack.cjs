/**
 * Móc `afterPack` của electron-builder: bảo đảm ffmpeg trong bản cài ĐÚNG kiến trúc đích.
 *
 * `ffmpeg-static` tải nhị phân theo máy chạy `npm install`. Một lượt `electron-builder --mac` dựng CẢ arm64 lẫn x64
 * từ cùng `node_modules` ⇒ một trong hai bản mang ffmpeg sai kiến trúc. Ở đây: kiến trúc đích khác máy dựng ⇒ tải
 * `ffmpeg-<nền>-<kiến trúc>.gz` từ bản phát hành chính thức của ffmpeg-static (cùng thẻ phiên bản trong
 * package.json của nó), giải nén đè vào `app.asar.unpacked`, và kiểm phần đầu tệp đúng định dạng nhị phân.
 */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const TEN_KIEN_TRUC = { 0: 'ia32', 1: 'x64', 2: 'arm', 3: 'arm64' };

exports.default = async function afterPack(ctx) {
  const nen = ctx.electronPlatformName; // darwin | win32 | linux
  const kt = TEN_KIEN_TRUC[ctx.arch];
  if (kt && !(nen === process.platform && kt === process.arch)) await thayFfmpeg(ctx, nen, kt);
  if (nen === 'darwin' && process.platform === 'darwin') kyAdHoc(ctx);
};

/**
 * Chưa có Developer ID ⇒ electron-builder BỎ ký, để lại bundle mang chữ ký "linker-signed" của Electron đã lệch
 * (đổi Info.plist, thêm tài nguyên) — tải về máy Apple Silicon là "app bị hỏng". Ký ad-hoc cả bundle (kèm ffmpeg)
 * để chữ ký nhất quán; người dùng chỉ còn bước chuột phải → Mở lần đầu. Có chứng chỉ thật thì electron-builder ký
 * SAU móc này và đè lên.
 */
function kyAdHoc(ctx) {
  const app = path.join(ctx.appOutDir, `${ctx.packager.appInfo.productFilename}.app`);
  require('node:child_process').execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' });
  console.log('[after-pack] ✓ ký ad-hoc', path.basename(app));
}

async function thayFfmpeg(ctx, nen, kt) {
  const goiFfmpeg = require(path.join(ctx.packager.projectDir, 'node_modules/ffmpeg-static/package.json'));
  const the = goiFfmpeg['ffmpeg-static']['binary-release-tag'];
  const exe = nen === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const tai = nen === 'darwin'
    ? path.join(ctx.appOutDir, `${ctx.packager.appInfo.productFilename}.app`, 'Contents', 'Resources')
    : path.join(ctx.appOutDir, 'resources');
  const dich = path.join(tai, 'app.asar.unpacked', 'node_modules', 'ffmpeg-static', exe);
  if (!fs.existsSync(path.dirname(dich))) throw new Error(`[after-pack] không thấy ${path.dirname(dich)}`);

  const url = `https://github.com/eugeneware/ffmpeg-static/releases/download/${the}/ffmpeg-${nen}-${kt}.gz`;
  console.log(`[after-pack] ffmpeg cho ${nen}-${kt}: ${url}`);
  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) throw new Error(`[after-pack] tải ffmpeg lỗi HTTP ${r.status}`);
  const nhiPhan = zlib.gunzipSync(Buffer.from(await r.arrayBuffer()));

  const dau = nhiPhan.readUInt32BE(0);
  const hopLe = nen === 'darwin' ? [0xcffaedfe, 0xcafebabe].includes(dau) : nen === 'win32' ? nhiPhan.subarray(0, 2).toString() === 'MZ' : dau === 0x7f454c46;
  if (!hopLe) throw new Error('[after-pack] tệp ffmpeg tải về không phải nhị phân hợp lệ');
  if (nen === 'darwin') {
    // Mach-O 64-bit: cputype ở byte 4..7 (little-endian) — 0x0100000c = arm64, 0x01000007 = x86_64.
    const cpu = nhiPhan.readUInt32LE(4);
    const mong = kt === 'arm64' ? 0x0100000c : 0x01000007;
    if (dau === 0xcffaedfe && cpu !== mong) throw new Error(`[after-pack] ffmpeg tải về sai kiến trúc (cpu 0x${cpu.toString(16)})`);
  }
  fs.writeFileSync(dich, nhiPhan, { mode: 0o755 });
  console.log(`[after-pack] ✓ đã thay ffmpeg (${(nhiPhan.length / 1e6).toFixed(1)} MB)`);
}
