#!/usr/bin/env node
/**
 * Nạp video giải trí đã chọn + chấm câu + dịch vào `video_nguoi_dung`.
 *
 * Đây là video "biên tập sẵn": tìm bằng `yt-dlp ytsearch` (nên chắc chắn
 * tồn tại), lọc theo thời lượng + lượt xem, và chỉ nhận khi TẢI ĐƯỢC phụ đề
 * tiếng Anh thật ≥ 3KB. Không có link nào do model nghĩ ra.
 *
 * Idempotent: upsert theo (userId, nguon, videoId).
 *
 *   node scripts/video-hay-seed.mjs [--file <jsonl.gz|jsonl>] [--user <id>]
 */
import { createReadStream, existsSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const lay = (c, md) => { const i = args.indexOf(c); return i >= 0 ? args[i + 1] : md; };

const duong = lay('--file', 'content/phu-de/video-hay.jsonl.gz');
const userId = Number(lay('--user', '1'));

async function main() {
  if (!existsSync(duong)) {
    console.log(`  video hay: không có ${duong} — bỏ qua`);
    return;
  }
  const ai = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!ai) {
    console.log(`  video hay: không có user #${userId} — bỏ qua`);
    return;
  }

  const luong = duong.endsWith('.gz')
    ? createReadStream(duong).pipe(createGunzip())
    : createReadStream(duong);
  const rl = createInterface({ input: luong, crlfDelay: Infinity });

  let doc = 0, ghi = 0, boQua = 0;
  for await (const dong of rl) {
    if (!dong.trim()) continue;
    doc++;
    let d;
    try { d = JSON.parse(dong); } catch { boQua++; continue; }
    if (!d.videoId || !Array.isArray(d.cues) || d.cues.length === 0) { boQua++; continue; }

    // Bản dịch chỉ nhận khi ĐỦ số dòng — lệch một nhịp thì mỗi câu mang bản
    // dịch của câu khác, tệ hơn hẳn là không có bản dịch.
    const dichVi = Array.isArray(d.dichVi) && d.dichVi.length === d.cues.length
      ? d.dichVi : undefined;

    const ghiVao = {
      nhomLon: d.nhomLon || 'khac',
      tieuDe: String(d.tieuDe || 'Video').slice(0, 300),
      tacGia: d.tacGia ? String(d.tacGia).slice(0, 200) : null,
      anhBia: null,                 // lấy thẳng CDN YouTube theo videoId
      giay: Number.isFinite(d.giay) ? d.giay : null,
      cues: d.cues, soCau: d.soCau ?? d.cues.length, soTu: d.soTu ?? 0,
      ...(dichVi ? { dichVi } : {}),
    };

    await prisma.videoNguoiDung.upsert({
      where: { uk_video_nguoi_dung: { userId, nguon: 'youtube', videoId: d.videoId } },
      create: { userId, nguon: 'youtube', videoId: d.videoId, ...ghiVao },
      update: ghiVao,
    });
    ghi++;
  }
  console.log(`  video hay: đọc ${doc} · ghi ${ghi} · bỏ qua ${boQua}`);
}

main()
  .catch((e) => { console.error('  video hay: HỎNG', e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
