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
import { createReadStream, existsSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TEP = 'content/phu-de/phu-de-bai-giang.jsonl.gz';
/// Bản CHỒNG LÊN — câu đã chấm dấu, viết hoa, cắt theo câu thật (máy nhà
/// làm dần, ~17 giờ cho 963 bài). Nạp SAU `TEP` nên bài nào có ở đây thì
/// bản này thắng.
///
/// ⚠️ Cố ý để RIÊNG chứ không trộn vào `TEP`: trộn thì mỗi đợt xong thêm
/// vài chục bài lại phải commit lại cả tệp 9MB. Tệp chồng nhỏ, lớn dần, và
/// khi nào đủ 963 bài thì thay hẳn `TEP` bằng nó.
const TEP_V2 = 'content/phu-de/phu-de-v2.jsonl.gz';
/// Bản dịch tiếng Việt — TUỲ CHỌN. Máy nhà dịch dần bằng Qwen (~15 giờ cho
/// 1.030 bài), nên tệp này có thể chưa tồn tại hoặc mới có một phần. Thiếu
/// thì bỏ qua, KHÔNG làm hỏng seed: phụ đề tiếng Anh vẫn dùng được trọn vẹn.
const TEP_DICH = 'content/phu-de/dich-vi.jsonl.gz';
/// Bản BỔ SUNG — bài có video nhưng nằm NGOÀI bộ 963 gốc (các khoá thêm sau
/// 18/08, bài "Slide by slide"…). Cùng khuôn với `TEP` (đầu ra của
/// `lam-sach-vtt.py` trên máy nhà), chỉ chứa bài chưa có trong `TEP`.
///
/// ⚠️ TỆP RIÊNG, không trộn vào `TEP`: phiên chấm câu/dịch (`TEP_V2`,
/// `TEP_DICH`) sẽ "thay hẳn TEP bằng v2 khi đủ 963 bài" — trộn vào đây thì
/// lần thay đó xoá mất hơn nghìn bài bổ sung khỏi repo mà không ai để ý.
/// Nạp TRƯỚC `TEP_V2` để khi các bài này được chấm câu thì bản v2 thắng.
///
/// Người dùng 22/09/2026: lời mời vào phòng học video chỉ hiện ở bài đầu
/// khoá — đo ra 2.138 bài có video mà mới 963 bài có phụ đề.
const TEP_BO_SUNG = 'content/phu-de/phu-de-bo-sung.jsonl.gz';
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

  // Nạp trước bản dịch (nếu có) vào bộ nhớ: 1.030 mảng chuỗi, vài chục MB —
  // rẻ hơn hẳn việc mở lại tệp nén cho từng bài.
  const dich = new Map();
  if (existsSync(TEP_DICH)) {
    const rlD = createInterface({
      input: createReadStream(TEP_DICH).pipe(createGunzip()), crlfDelay: Infinity });
    for await (const d of rlD) {
      if (!d.trim()) continue;
      try {
        const o = JSON.parse(d);
        if (o.lessonId && Array.isArray(o.vi)) dich.set(o.lessonId, o.vi);
      } catch { /* dòng hỏng thì bỏ, không dừng cả seed */ }
    }
  }

  let doc = 0, ghi = 0, boQua = 0, khongCoBai = 0, khongCoMa = 0, coDich = 0;

  // ⚠️ `dungDich` chỉ BẬT ở lượt cuối. Bản dịch được sinh ra theo CÂU MỚI
  // (đã chấm dấu, cắt lại), nên gán nó vào câu CŨ là sai — kể cả khi số
  // dòng tình cờ bằng nhau. Đo 20/09/2026: 3 bài rơi đúng vào trường hợp
  // "tình cờ bằng nhau" đó; lần này lượt sau ghi đè nên không hỏng, nhưng
  // để nguyên thì một ngày nào đó nó sẽ hỏng im lặng.
  async function nap(tep, dungDich) {
   if (!existsSync(tep)) return 0;
   let n = 0;
   const rl = createInterface({
    input: createReadStream(tep).pipe(createGunzip()),
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

    // ⚠️ CHỈ nhận bản dịch khi SỐ DÒNG khớp số câu. Lệch một dòng là mọi
    // câu sau đó mang nghĩa của câu khác — tệ hơn hẳn không có bản dịch,
    // vì người học không có cách nào biết là nó lệch.
    const vi = dungDich ? dich.get(d.lessonId) : undefined;
    const dichVi = Array.isArray(vi) && vi.length === d.cues.length ? vi : undefined;
    if (dichVi) coDich++;

    if (apDung) {
      await prisma.lessonTranscript.upsert({
        where: { lessonId: d.lessonId },
        create: {
          lessonId: d.lessonId, videoId: ma, lang: 'en',
          cues: d.cues, soCau: d.soCau, soTu: d.soTu,
          ...(dichVi ? { dichVi } : {}),
        },
        update: {
          videoId: ma, cues: d.cues, soCau: d.soCau, soTu: d.soTu,
          // Không ghi đè bản dịch bằng `null` khi lượt này chưa có: bản dịch
          // tới dần theo từng đợt, và xoá cái đã có là mất công dịch.
          ...(dichVi ? { dichVi } : {}),
        },
      });
    }
    ghi++; n++;
   }
   return n;
  }

  // Bản dịch chỉ gán ở lượt CÓ CÂU MỚI. Khi nào `TEP_V2` phủ đủ 963 bài thì
  // thay hẳn `TEP` bằng nó và đổi cờ này về lượt duy nhất còn lại.
  const coV2 = existsSync(TEP_V2);
  const nBase = await nap(TEP, !coV2);
  const nBoSung = await nap(TEP_BO_SUNG, !coV2);
  const nV2 = await nap(TEP_V2, true);

  console.log(` phụ đề: đọc ${doc} · ${apDung ? 'ghi' : 'sẽ ghi'} ${ghi}` +
    ` · bổ sung ${nBoSung}` +
    ` · bản chấm câu mới ${nV2}/${nBase + nBoSung + nV2}` +
    ` · bài không còn ${khongCoBai} · không rút được mã video ${khongCoMa} · hỏng ${boQua}` +
    ` · kèm bản dịch ${coDich}`);

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
