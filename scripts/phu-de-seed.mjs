#!/usr/bin/env node
/**
 * Nạp phụ đề tiếng Anh của video bài giảng vào `lesson_transcripts`.
 *
 * Nguồn: `content/phu-de/phu-de-bai-giang.jsonl.gz` — đã LÀM SẠCH sẵn
 * (khử cửa sổ trượt của phụ đề tự động YouTube, bỏ nhãn [Music]). Không
 * làm sạch ở đây: việc đó chạy một lần trên máy nhà, còn seed chạy mỗi lần
 * deploy và phải nhanh.
 *
 * ⚠️ Idempotent: upsert theo `lessonId`. Chạy lại không nhân đôi, và KHÔNG
 * xoá phụ đề của bài không còn trong tệp — bài bị xoá khỏi tệp có thể chỉ
 * là lần thu hỏng, mà xoá phụ đề thì mất luôn công sức thu.
 */
import { createReadStream } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TEP = 'content/phu-de/phu-de-bai-giang.jsonl.gz';
const apDung = process.argv.includes('--apply');

/** Lấy mã video từ mọi dạng link YouTube đang có trong `lessons.video_url`. */
function maVideo(url) {
  if (!url) return null;
  const m =
    url.match(/[?&]v=([\w-]{6,})/) ||
    url.match(/youtu\.be\/([\w-]{6,})/) ||
    url.match(/\/embed\/([\w-]{6,})/) ||
    url.match(/\/shorts\/([\w-]{6,})/);
  return m ? m[1] : null;
}

async function main() {
  // Đọc trước bản đồ lesson → videoUrl. Một lời gọi thay vì 1.030 lời gọi:
  // seed chạy trong container trên VPS, mỗi vòng round-trip đều tính tiền
  // bằng thời gian deploy.
  const bai = await prisma.lesson.findMany({
    where: { videoUrl: { not: null } },
    select: { id: true, videoUrl: true },
  });
  const banDo = new Map(bai.map((b) => [b.id, maVideo(b.videoUrl)]));

  let doc = 0, ghi = 0, boQua = 0, khongCoBai = 0, khongCoMa = 0;
  const rl = createInterface({
    input: createReadStream(TEP).pipe(createGunzip()),
    crlfDelay: Infinity,
  });

  for await (const dong of rl) {
    if (!dong.trim()) continue;
    doc++;
    let d;
    try { d = JSON.parse(dong); } catch { boQua++; continue; }
    if (!d.lessonId || !Array.isArray(d.cues) || d.cues.length === 0) { boQua++; continue; }

    if (!banDo.has(d.lessonId)) { khongCoBai++; continue; }
    const ma = banDo.get(d.lessonId);
    if (!ma) { khongCoMa++; continue; }

    if (apDung) {
      await prisma.lessonTranscript.upsert({
        where: { lessonId: d.lessonId },
        create: {
          lessonId: d.lessonId, videoId: ma, lang: 'en',
          cues: d.cues, soCau: d.soCau, soTu: d.soTu,
        },
        update: { videoId: ma, cues: d.cues, soCau: d.soCau, soTu: d.soTu },
      });
    }
    ghi++;
  }

  console.log(` phụ đề: đọc ${doc} · ${apDung ? 'ghi' : 'sẽ ghi'} ${ghi}` +
    ` · bài không còn ${khongCoBai} · không rút được mã video ${khongCoMa} · hỏng ${boQua}`);

  // ⚠️ CHỐT: khớp dưới 60% nghĩa là đang chạy nhầm database, hoặc id bài đã
  // đổi sau một lần re-seed. Không có dòng này thì seed vẫn "Done." và
  // deploy vẫn xanh trong khi kho phụ đề gần như rỗng — im lặng và sai.
  //
  // Đo thật 19/09/2026: chạy nhầm vào DB dev cục bộ cho ra 121/1030 (12%),
  // đúng loại số mà nếu không cảnh báo thì tôi đã tưởng là bình thường.
  const tiLe = doc > 0 ? (ghi / doc) * 100 : 0;
  if (tiLe < 60) {
    console.log(` ⚠️  CHỈ KHỚP ${tiLe.toFixed(0)}% — nghi chạy nhầm database` +
      ` hoặc id bài đã đổi. Kho phụ đề có ${doc} bài, DB chỉ nhận ${ghi}.`);
  }
  if (!apDung) console.log(' (chạy thử — thêm --apply để ghi thật)');
  console.log(' Done.');
}

main()
  .catch((e) => { console.error('✗ phu-de-seed:', e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
