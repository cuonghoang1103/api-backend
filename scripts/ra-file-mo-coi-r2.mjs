/**
 * ra-file-mo-coi-r2.mjs — tìm file nhạc/ảnh bìa còn nằm trên R2 mà KHÔNG còn
 * dòng nào trong CSDL trỏ tới.
 * ─────────────────────────────────────────────────────────────────────────────
 *   docker exec cuonghoangdev_backend node scripts/ra-file-mo-coi-r2.mjs
 *   docker exec cuonghoangdev_backend node scripts/ra-file-mo-coi-r2.mjs --xoa
 *
 * MẶC ĐỊNH CHỈ LIỆT KÊ, không xoá gì. Muốn xoá thật thì thêm `--xoa`.
 *
 * VÌ SAO CÓ FILE MỒ CÔI. `deleteTrack` trong `music.service.ts` có dọn R2, nhưng
 * cố ý dọn kiểu "best-effort": R2 lỗi thì vẫn xoá bài và chỉ ghi một dòng
 * cảnh báo. Đúng đắn — không nên chặn người dùng xoá bài vì kho lưu trữ trục
 * trặc — nhưng hệ quả là file nằm lại vĩnh viễn mà không ai đi tìm nữa, và
 * dung lượng R2 chỉ có tăng.
 *
 * ⚠️ AN TOÀN — ba rào, vì xoá nhầm file nhạc là mất thật, không lấy lại được:
 *
 *  1. Chỉ soi HAI tiền tố: `audio/songs/` và `images/playlist-covers/`. Không
 *     đụng tới bất cứ thứ gì khác trong bucket.
 *  2. Đối chiếu với TOÀN BỘ bảng `music_tracks`, kể cả dòng `active = false`.
 *     Xoá bài là xoá mềm, dòng vẫn còn và vẫn có thể được khôi phục — coi nó là
 *     rác vì "đã xoá" là hiểu sai và sẽ xoá mất file của bài còn khôi phục được.
 *  3. Bỏ qua file mới tạo dưới 24 giờ: một lượt tải lên đang dở dang có file
 *     trên R2 trước khi dòng CSDL kịp ghi, và nó trông y hệt file mồ côi.
 */
import { PrismaClient } from '@prisma/client';

const XOA = process.argv.includes('--xoa');
const TIEN_TO = ['audio/songs/', 'images/playlist-covers/'];
const MOI_MS = 24 * 60 * 60 * 1000;

const prisma = new PrismaClient();

function goc(url) {
  if (!url) return null;
  // Bỏ phần miền, giữ lại khoá trong bucket. Chấp cả khoá trần lẫn URL đầy đủ.
  try {
    if (/^https?:\/\//.test(url)) return new URL(url).pathname.replace(/^\/+/, '');
  } catch { /* URL méo — coi như khoá trần */ }
  return url.replace(/^\/+/, '');
}

async function main() {
  const { getStorageProvider } = await import('../dist/storage/StorageProvider.js');
  const provider = getStorageProvider();

  // ── 1. Mọi khoá mà CSDL đang trỏ tới ──────────────────────────────
  const rows = await prisma.musicTrack.findMany({
    select: { id: true, localPath: true, coverImage: true, audioUrl: true },
  });
  const dungRoi = new Set();
  for (const r of rows) {
    for (const u of [r.localPath, r.coverImage, r.audioUrl]) {
      const k = goc(u);
      if (k) dungRoi.add(k);
    }
  }
  console.log(`CSDL: ${rows.length} bài, ${dungRoi.size} khoá đang được dùng`);

  // ── 2. Mọi object trên R2 dưới hai tiền tố ────────────────────────
  const tren = [];
  for (const tienTo of TIEN_TO) {
    if (typeof provider.list !== 'function') {
      console.error('❌ StorageProvider không có hàm `list()` — không rà được. Xem src/storage/StorageProvider.ts');
      process.exit(2);
    }
    const ds = await provider.list(tienTo);
    for (const o of ds) tren.push(o);
  }
  console.log(`R2: ${tren.length} object dưới ${TIEN_TO.join(' và ')}`);

  // ── 3. Đối chiếu ──────────────────────────────────────────────────
  const bayGio = Date.now();
  const moCoi = [];
  let boQuaVieMoi = 0;
  for (const o of tren) {
    if (dungRoi.has(o.key)) continue;
    const tuoi = o.lastModified ? bayGio - new Date(o.lastModified).getTime() : Infinity;
    if (tuoi < MOI_MS) { boQuaVieMoi++; continue; }
    moCoi.push(o);
  }

  const tongMB = moCoi.reduce((t, o) => t + (o.size ?? 0), 0) / 1048576;
  console.log('');
  console.log(`MỒ CÔI: ${moCoi.length} object · ${tongMB.toFixed(1)} MB`);
  if (boQuaVieMoi > 0) console.log(`(bỏ qua ${boQuaVieMoi} file mới dưới 24 giờ — có thể là lượt tải đang dở)`);
  for (const o of moCoi) {
    console.log(`  ${((o.size ?? 0) / 1048576).toFixed(1).padStart(7)} MB  ${o.key}`);
  }

  if (!XOA) {
    console.log('');
    console.log('Chỉ LIỆT KÊ. Muốn xoá thật: thêm --xoa');
    return;
  }
  if (moCoi.length === 0) return;

  const { deleteByKey } = await import('../dist/storage/uploadService.js');
  for (const o of moCoi) await deleteByKey(o.key);
  console.log(`\n✅ Đã xoá ${moCoi.length} object (${tongMB.toFixed(1)} MB)`);
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
