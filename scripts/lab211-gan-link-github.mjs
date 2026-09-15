/**
 * lab211-gan-link-github.mjs — gắn link kho source GitHub vào TỪNG bài Code Lab
 * của track `lab211`, và vào đầu khoá Academy LAB211.
 *
 * Vì sao cần: lời giải đã có link trong tab "Lời giải", nhưng người học muốn
 * tải project NetBeans đầy đủ NGAY KHI đọc đề (file dữ liệu .dat/.txt, nbproject/,
 * ảnh màn hình chạy) — những thứ không hiển thị được trong khung code của web.
 *
 * Ghép bài với thư mục GitHub bằng MÃ BÀI trong tiêu đề (`J1.S.P0001_...`),
 * không bằng slug: lưu bài trong admin từng viết lại slug.
 *
 * Chạy lại được: nhận dấu `data-gh="lab211"`; đã có thì bỏ qua, không nhân đôi.
 *
 *   node scripts/lab211-gan-link-github.mjs           # thử khô, in ra sẽ đổi gì
 *   node scripts/lab211-gan-link-github.mjs --apply   # ghi thật
 */
const { prisma } = await import('/app/dist/config/database.js');
const APPLY = process.argv.includes('--apply');

const GH = 'https://github.com/cuonghoang1103/Lab211_For_CuongHoang';
const DAU = 'data-gh="lab211"';

/** Mã bài -> tên thư mục trong kho (đọc từ chính danh sách bài, không gõ tay). */
function thuMuc(title) {
  const m = title.match(/^(J1\.([SL])\.P(\d{4}))_(.*?)(?:\s*[-–—]|$)/);
  if (!m) return null;
  return { lab: m[1], ma: `J1${m[2]}P${m[3]}` };
}

function hop(folder) {
  return `<div class="callout" ${DAU}><span class="badge">Source đầy đủ</span>
 Project NetBeans của bài này (kiến trúc theo <b>Guide.xlsx</b>: constants · model · dto · repository ·
 service · controller · view · utils · main) nằm trên GitHub:
 <a href="${GH}/tree/main/${folder}" target="_blank" rel="noopener"><b>${folder}</b></a> —
 gồm <code>src/</code>, <code>HUONG-DAN.md</code>, <code>nbproject/</code>, file dữ liệu (nếu bài cần)
 và <code>man-hinh-chay.png</code> (ảnh màn hình chạy thật).
 Tải riêng một bài: dán link thư mục vào
 <a href="https://download-directory.github.io/" target="_blank" rel="noopener">download-directory.github.io</a>.</div>`;
}

// ─── Code Lab: 54 bài của track lab211 ─────────────────────────────
const ex = await prisma.codeExercise.findMany({
  where: { track: { slug: 'lab211' } },
  select: { id: true, title: true, problemHtmlVi: true },
  orderBy: { id: 'asc' },
});

// Tên thư mục thật trong kho, gửi vào qua biến môi trường để script không
// phải đoán: FOLDERS="J1SP0001=HE176322_J1SP0001_BubbleSort,..."
const BANG = Object.fromEntries((process.env.FOLDERS || '').split(',').filter(Boolean)
  .map((x) => x.split('=')));

let doi = 0, boQua = 0, thieu = [];
for (const e of ex) {
  const t = thuMuc(e.title);
  const folder = t && BANG[t.ma];
  if (!folder) { thieu.push(e.title.slice(0, 40)); continue; }
  if ((e.problemHtmlVi || '').includes(DAU)) { boQua++; continue; }
  const moi = (e.problemHtmlVi || '') + '\n' + hop(folder);
  if (APPLY) {
    await prisma.codeExercise.update({ where: { id: e.id }, data: { problemHtmlVi: moi } });
  }
  doi++;
}
console.log(`[code lab] ${doi} bài gắn link, ${boQua} bài đã có sẵn, ${thieu.length} bài không ghép được`);
if (thieu.length) console.log('   không ghép được:', thieu.join(' | '));

// ─── Academy: khoá LAB211, đặt ở đầu bài 0.1 ──────────────────────
const khoa = await prisma.course.findFirst({
  where: { OR: [{ slug: 'lab211' }, { title: { contains: 'OOP with Java Lab' } }] },
  select: { id: true, title: true },
});
if (!khoa) {
  console.log('[academy] KHÔNG tìm thấy khoá LAB211 — bỏ qua');
} else {
  const bai = await prisma.lesson.findFirst({
    where: { chapter: { courseId: khoa.id }, title: { contains: '0.1' } },
    select: { id: true, title: true, content: true },
    orderBy: { id: 'asc' },
  });
  if (!bai) {
    console.log('[academy] không thấy bài 0.1 trong khoá', khoa.title);
  } else if ((bai.content || '').includes(DAU)) {
    console.log('[academy] bài 0.1 đã có link, bỏ qua');
  } else {
    const hopKhoa = `<div class="callout" ${DAU}><span class="badge">Source 54 bài</span>
 Toàn bộ 54 bài LAB211 đã có source thật, viết theo đúng kiến trúc <b>Guide.xlsx</b> của thầy, ở
 <a href="${GH}" target="_blank" rel="noopener"><b>github.com/cuonghoang1103/Lab211_For_CuongHoang</b></a>.
 Mỗi bài là một project NetBeans mở được ngay, kèm <code>HUONG-DAN.md</code> (đề · kiến thức · thiết kế ·
 code từng bước · test · debug · câu thầy hay hỏi) và ảnh màn hình chạy thật. Từng bài trên Code Lab
 cũng có link tới đúng thư mục của nó.</div>\n`;
    if (APPLY) {
      await prisma.lesson.update({ where: { id: bai.id }, data: { content: hopKhoa + (bai.content || '') } });
    }
    console.log(`[academy] gắn link vào "${bai.title}" (khoá ${khoa.title})`);
  }
}

console.log(APPLY ? 'ĐÃ GHI' : 'THỬ KHÔ — thêm --apply để ghi thật');
await prisma.$disconnect();
