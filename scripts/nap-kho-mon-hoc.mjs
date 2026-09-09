/**
 * ============================================================
 * NẠP NỘI DUNG MỘT MÔN VÀO KHO KIẾN THỨC CỦA TRỢ LÝ
 * ============================================================
 *
 * Dùng:
 *   docker exec cuonghoangdev_backend node scripts/nap-kho-mon-hoc.mjs LAB211
 *   docker exec cuonghoangdev_backend node scripts/nap-kho-mon-hoc.mjs LAB211 --that   # ghi thật
 *
 * KHÔNG ghi gì nếu thiếu cờ `--that` — chạy khan trước, xem số rồi mới ghi.
 *
 * ⚠️ Embedding sinh TẠI CHỖ bằng ONNX (`Xenova/all-MiniLM-L6-v2`, 384 chiều),
 * không gọi API, không tốn tiền. Đây là lý do nạp cả môn được mà không phải
 * xin phép về chi phí.
 *
 * ⚠️ Ghi CẢ HAI cột: `embedding` (jsonb, cho mã cũ) và `embedding_vec`
 * (vector, cho phần tra cứu thật). Thiếu cột vector thì mẩu nằm đó mà không
 * bao giờ được tìm thấy — im lặng, không lỗi.
 */
import { PrismaClient } from '@prisma/client';
import { computeEmbeddings } from '../dist/services/aiProviders.js';

const prisma = new PrismaClient();
const maMon = (process.argv[2] || '').toUpperCase();
const GHI_THAT = process.argv.includes('--that');
const LOAI = 'khoa-hoc';

if (!maMon) { console.error('Thiếu mã môn. Ví dụ: LAB211'); process.exit(1); }

/** Bỏ thẻ HTML, giữ chữ. Nội dung bài học lưu dạng HTML. */
function boHtml(s) {
  return String(s || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Cắt mẩu ~700 ký tự, ngắt ở cuối câu, chồng lấn 100 ký tự.
 *
 * 700 để khớp kho đang có (trung bình 561, lớn nhất 993). Chồng lấn để câu
 * bị cắt đôi vẫn còn nguyên ngữ cảnh ở một trong hai mẩu.
 */
function catMau(chu, dai = 700, chongLan = 100) {
  const ra = [];
  let i = 0;
  while (i < chu.length) {
    let het = Math.min(i + dai, chu.length);
    if (het < chu.length) {
      const cham = chu.lastIndexOf('. ', het);
      if (cham > i + dai * 0.5) het = cham + 1;
    }
    const m = chu.slice(i, het).trim();
    if (m.length > 80) ra.push(m);      // mẩu quá ngắn không mang thông tin gì
    if (het >= chu.length) break;
    i = het - chongLan;
  }
  return ra;
}

const khoa = await prisma.course.findFirst({
  where: { courseCode: { equals: maMon, mode: 'insensitive' } },
  select: { id: true, courseCode: true, title: true },
});
if (!khoa) { console.error(`Không thấy môn ${maMon}`); process.exit(1); }

const bai = await prisma.lesson.findMany({
  where: { section: { courseId: khoa.id } },
  select: { id: true, title: true, content: true, section: { select: { title: true } } },
  orderBy: { id: 'asc' },
});

const docId = `${khoa.courseCode}`;
let mau = [];
for (const b of bai) {
  const chu = boHtml(b.content);
  if (chu.length < 120) continue;
  // Gắn TÊN MÔN + TÊN BÀI vào đầu mỗi mẩu: không có nó thì mẩu ở giữa bài
  // trôi nổi không biết thuộc đâu, và model trích dẫn sai bài.
  const dau = `[${khoa.courseCode} · ${b.section?.title ?? ''} · ${b.title}]\n`;
  for (const m of catMau(chu)) mau.push({ noiDung: dau + m, baiId: b.id });
}

console.log(`Môn ${khoa.courseCode} — ${khoa.title}`);
console.log(`  ${bai.length} bài · ${mau.length} mẩu sẽ nạp`);
console.log(`  dài trung bình ${Math.round(mau.reduce((s, m) => s + m.noiDung.length, 0) / (mau.length || 1))} ký tự`);

const daCo = await prisma.documentChunk.count({ where: { documentType: LOAI, documentId: docId } });
console.log(`  đã có sẵn trong kho: ${daCo} mẩu` + (daCo ? ' (sẽ XOÁ rồi nạp lại)' : ''));

if (!GHI_THAT) {
  console.log('\n(chạy khan — thêm --that để ghi thật)');
  console.log('Mẩu đầu:\n' + mau[0]?.noiDung.slice(0, 300));
  await prisma.$disconnect();
  process.exit(0);
}

if (daCo) await prisma.documentChunk.deleteMany({ where: { documentType: LOAI, documentId: docId } });

const LO = 32;
let xong = 0;
for (let i = 0; i < mau.length; i += LO) {
  const lo = mau.slice(i, i + LO);
  const vecs = await computeEmbeddings(lo.map((m) => m.noiDung));
  for (let k = 0; k < lo.length; k++) {
    const v = vecs[k];
    if (!Array.isArray(v) || v.length !== 384) continue;
    const r = await prisma.documentChunk.create({
      data: {
        content: lo[k].noiDung, documentId: docId, documentType: LOAI,
        chunkIndex: i + k, embedding: v,
        metadata: { lessonId: lo[k].baiId, courseId: khoa.id },
      },
      select: { id: true },
    });
    // Prisma chưa hiểu kiểu `vector` nên phải ghi bằng SQL thô.
    await prisma.$executeRawUnsafe(
      'UPDATE document_chunks SET embedding_vec = $1::vector WHERE id = $2',
      `[${v.join(',')}]`, r.id,
    );
    xong++;
  }
  console.log(`  ...${xong}/${mau.length}`);
}
const thieu = await prisma.documentChunk.count({
  where: { documentType: LOAI, documentId: docId, embeddingVec: null },
}).catch(() => -1);
console.log(`\nXONG: ghi ${xong} mẩu` + (thieu > 0 ? ` · ⚠️ ${thieu} mẩu THIẾU vector` : ' · vector đủ'));
await prisma.$disconnect();
