/**
 * ĐÓNG GÓI SÂN CHƠI 3D CHO APP DESKTOP.
 *
 * Chia bản dựng sân chơi làm hai phần:
 *
 *   1. PHẦN MÃ (~12 MB) → `desktop/resources/playground/`, đi kèm bản cài.
 *      index.html + gói JS + Rapier wasm + bộ giải Draco/Basis + phông chữ.
 *      Đủ để engine khởi động và vẽ màn hình tải.
 *
 *   2. PHẦN THẾ GIỚI (~82 MB) → chỉ một `manifest-media.json` đi kèm bản cài.
 *      Âm thanh, ảnh giao diện, model, texture. App tải một lần vào `userData`
 *      lúc người dùng bấm chơi lần đầu (xem `main/sanChoi.ts`).
 *
 * Vì sao chia: bản cài hôm nay 160 MB (dmg arm64). Nhét cả 90 MB sân chơi vào
 * là +47% cho MỌI người dùng, kể cả người vào app chỉ để ghi chú và chat. Chia
 * ra thì bản cài chỉ phình ~12 MB, còn người chơi trả 82 MB đúng một lần rồi
 * chơi offline mãi mãi.
 *
 * ─── NGUỒN LÀ BẢN DỰNG ĐÃ DEPLOY, CỐ Ý ─────────────────────────────────────
 * Script đọc `frontend/public/playground/` — đúng thư mục production đang phục
 * vụ — chứ không tự chạy `vite build`. Hai cái lợi:
 *   · App và web dùng CHUNG một bản dựng, không thể lệch nhau.
 *   · CI dựng bản cài không cần cài phụ thuộc của `playground-3d` (sharp,
 *     gltf-transform… ~316 MB) trên cả ba nền tảng.
 * Đổi lại: sửa mã sân chơi thì phải `cd playground-3d && npm run build` rồi
 * rsync sang `frontend/public/playground/` TRƯỚC, y như quy trình deploy web.
 *
 * Chạy:
 *   cd desktop && npm run dong-goi:san-choi
 *   NGUON=/duong/dan/khac npm run dong-goi:san-choi
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const desktopRoot = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const repoRoot = path.resolve(desktopRoot, '..');
const nguon = process.env.NGUON ?? path.join(repoRoot, 'frontend', 'public', 'playground');
const dich = path.join(desktopRoot, 'resources', 'playground');

/**
 * Những thứ ĐI KÈM BẢN CÀI.
 *
 * Nguyên tắc chọn: thứ cần để engine chạy được và vẽ ra màn hình tải. Mọi thứ
 * còn lại là nội dung thế giới — không có nó thì game cũng không chơi được,
 * nên chẳng lợi gì khi nhét vào bản cài.
 *
 * `draco/` và `basis/` là bộ GIẢI (wasm), không phải dữ liệu: thiếu chúng thì
 * không mở nổi một file .glb hay .ktx nào, kể cả file đã tải về.
 */
const THU_MUC_MA = ['assets', 'draco', 'basis', 'fonts', 'favicons'];
const FILE_MA = ['index.html', 'palette.png', 'palette.ktx', 'ATTRIBUTION.txt', 'license.md'];

async function liet(dir, goc = dir) {
  const ra = [];
  for (const muc of await fs.readdir(dir, { withFileTypes: true })) {
    const duong = path.join(dir, muc.name);
    if (muc.isDirectory()) ra.push(...(await liet(duong, goc)));
    else if (muc.isFile()) ra.push(path.relative(goc, duong).split(path.sep).join('/'));
  }
  return ra;
}

async function chep(tuong) {
  await fs.mkdir(path.dirname(path.join(dich, tuong)), { recursive: true });
  await fs.copyFile(path.join(nguon, tuong), path.join(dich, tuong));
}

const mb = (b) => (b / 1048576).toFixed(1) + ' MB';

// ── 1. Kiểm nguồn ──────────────────────────────────────────────────────────
const indexNguon = path.join(nguon, 'index.html');
try {
  await fs.access(indexNguon);
} catch {
  console.error(`\n✗ Không thấy ${indexNguon}`);
  console.error('  Dựng sân chơi trước: cd playground-3d && npm run build');
  console.error('  rồi rsync dist/ sang frontend/public/playground/\n');
  process.exit(1);
}

console.log(`\nNguồn : ${nguon}`);
console.log(`Đích  : ${dich}\n`);

await fs.rm(dich, { recursive: true, force: true });
await fs.mkdir(dich, { recursive: true });

// ── 2. Phần mã ─────────────────────────────────────────────────────────────
const tatCa = await liet(nguon);
const laMa = (p) => THU_MUC_MA.some((d) => p.startsWith(d + '/')) || FILE_MA.includes(p);

let byteMa = 0;
for (const p of tatCa.filter(laMa)) {
  if (p === 'index.html') continue; // xử lý riêng ở dưới
  await chep(p);
  byteMa += (await fs.stat(path.join(nguon, p))).size;
}

/**
 * `<base href>` phải thành `./`.
 *
 * Bản web ghi `/playground/` vì Next phục vụ nó dưới thư mục con. Trong app,
 * tài liệu nằm ở `app://playground/index.html`, nên `/playground/` sẽ trỏ ra
 * `app://playground/playground/…` và 404 sạch — đúng cái bẫy mà chính thẻ này
 * sinh ra để tránh, chỉ là lệch một tầng.
 *
 * `./` đúng cho cả hai vì tài liệu luôn nằm ở gốc của host `playground`.
 */
const htmlNguon = await fs.readFile(indexNguon, 'utf8');
const html = htmlNguon.replace(/<base\s+href="[^"]*"\s*\/?>/i, '<base href="./">');
if (html === htmlNguon) {
  console.error('✗ Không tìm thấy thẻ <base href="…"> để đổi trong index.html.');
  console.error('  Bản dựng này sai — kiểm VITE_BASE_HREF (xem vite.config.js).\n');
  process.exit(1);
}
await fs.writeFile(path.join(dich, 'index.html'), html);
byteMa += Buffer.byteLength(html);

// ── 3. Manifest phần thế giới ──────────────────────────────────────────────
const media = [];
let byteMedia = 0;
for (const p of tatCa.filter((x) => !laMa(x))) {
  const duong = path.join(nguon, p);
  const [{ size }, noiDung] = await Promise.all([fs.stat(duong), fs.readFile(duong)]);
  media.push({ p, size, sha256: createHash('sha256').update(noiDung).digest('hex') });
  byteMedia += size;
}
media.sort((a, b) => (a.p < b.p ? -1 : 1));

/**
 * `version` = vân tay của TOÀN BỘ danh sách.
 *
 * Đổi một file bất kỳ là đổi version. App so version đã tải với version trong
 * bản cài; lệch thì tải lại đúng những file có sha256 khác, không tải lại cả
 * 82 MB. Không có mốc này thì một bản cập nhật đổi vài model sẽ hoặc bắt tải
 * lại tất, hoặc âm thầm dùng file cũ lẫn file mới.
 */
const version = createHash('sha256')
  .update(media.map((m) => `${m.p}:${m.sha256}`).join('\n'))
  .digest('hex')
  .slice(0, 16);

await fs.writeFile(
  path.join(dich, 'manifest-media.json'),
  JSON.stringify({ version, totalBytes: byteMedia, count: media.length, files: media })
);

// ── 4. Báo cáo ─────────────────────────────────────────────────────────────
const soFileMa = tatCa.filter(laMa).length;
console.log(`  Phần mã     ${String(soFileMa).padStart(4)} tệp   ${mb(byteMa).padStart(9)}   → đi kèm bản cài`);
console.log(`  Phần thế giới ${String(media.length).padStart(3)} tệp   ${mb(byteMedia).padStart(9)}   → tải lần đầu`);
console.log(`  manifest version: ${version}\n`);

if (byteMa > 25 * 1048576) {
  console.error(`✗ Phần mã ${mb(byteMa)} — vượt trần 25 MB.`);
  console.error('  Có thư mục dữ liệu nào lọt vào THU_MUC_MA? Bản cài sẽ phình vô cớ.\n');
  process.exit(1);
}
console.log('✓ Xong.\n');
