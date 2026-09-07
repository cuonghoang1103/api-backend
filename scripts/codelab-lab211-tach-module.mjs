/**
 * codelab-lab211-tach-module.mjs — tách bài giảng 25 phần của module 847
 * thành nhiều module riêng, mỗi module một mục đích.
 *
 * Vì sao: 25 phần trong MỘT bài giảng thì phần quan trọng nhất (tài liệu của
 * thầy) nằm ở cuối cùng, và không ai đọc tới. Sau khi tách:
 *
 *   sort 0  lab211-huong-dan-thay      Hướng dẫn của thầy — đọc từng trang   (script riêng)
 *   sort 1  lab211-java-nen-tang       Java nền tảng                          phần 1–15
 *   sort 2  lab211-kien-truc-bo-khung  Kiến trúc 8 package & bộ khung P0055   phần 16, 17, 24
 *   sort 3  lab211-oop-solid-pattern   OOP · SOLID · Design Pattern           phần 18–23
 *   sort 4  lab211-assignments (847)   54 bài tập + bài giảng dẫn đường NGẮN  (viết mới)
 *   sort 5+ 855/856/857 giữ nguyên, đẩy xuống
 *
 * Phần 25 cũ bị BỎ — đã được thay bằng module sort 0, sâu gấp ba.
 *
 *   node scripts/codelab-lab211-tach-module.mjs           # thử khô
 *   node scripts/codelab-lab211-tach-module.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const TRACK_ID = 39;
const GOC = 847;

/** Cắt blocks theo số thứ tự phần (1-based, cả hai đầu). */
function layPhan(blocks, danhSachSo) {
  const moc = blocks.map((b, i) => (b.type === 'part' ? i : -1)).filter((i) => i >= 0);
  const ra = [];
  for (const so of danhSachSo) {
    const dau = moc[so - 1];
    if (dau === undefined) throw new Error(`không có phần ${so}`);
    const cuoi = moc[so] ?? blocks.length;
    ra.push(...blocks.slice(dau, cuoi));
  }
  return ra;
}
/** Đánh số lại các part về 1..n. */
function danhSoLai(blocks) {
  let n = 0;
  return blocks.map((b) => (b.type === 'part' ? { ...b, number: String(++n) } : b));
}

const goc = await prisma.codeModule.findUnique({ where: { id: GOC } });
if (!goc) { console.error(`Không thấy module ${GOC}`); process.exit(1); }
const blocks = Array.isArray(goc.lessonBlocks) ? goc.lessonBlocks : [];
const soPhan = blocks.filter((b) => b.type === 'part').length;
console.log(`Module ${GOC}: ${blocks.length} block · ${soPhan} phần`);
if (soPhan !== 25) {
  console.error(`⛔ Cần đúng 25 phần để tách (đang có ${soPhan}). Dừng — dữ liệu đã đổi so với lúc viết script.`);
  process.exit(1);
}

// ─── Bài giảng NGẮN cho chính module 847 ──────────────────────
const CL = 'https://cuongthai.com/code-lab/lab211';
const dan = [
  { type: 'part', number: '1', text: 'Where to start, and which assignments to do',
    textVi: 'Bắt đầu từ đâu, và làm những bài nào',
    subtitle: 'A one-page map — the teaching lives in the modules above',
    subtitleVi: 'Một trang bản đồ — phần dạy nằm ở các module phía trên' },
  { type: 'prose', html: `<p>Danh sách dưới đây là <strong>toàn bộ 54 bài của LAB211</strong>, xếp theo
LOC ghi trong đề. Nhưng bạn <strong>không làm cả 54 bài</strong> — bạn chỉ cần <strong>≥ 750 LOC</strong>.</p>
<p>Phần dạy đã được tách thành bốn module riêng ở phía trên, đọc theo thứ tự:</p>
<ol>
  <li><strong>Hướng dẫn của thầy — đọc từng trang tài liệu</strong> · luật chơi, nội quy, cách nộp bài,
  cách chấm. <em>Đọc trước khi gõ dòng code đầu tiên.</em></li>
  <li><strong>Java nền tảng</strong> · kiểu dữ liệu, vòng lặp, mảng/ArrayList/HashMap, file, thuật toán,
  debug. <em>Tra khi quên cú pháp.</em></li>
  <li><strong>Kiến trúc 8 package &amp; bộ khung P0055</strong> · cấu trúc thầy bắt buộc, và 10 file mẫu
  đọc từng dòng. <em>Học một lần, dùng cho cả 9 bài.</em></li>
  <li><strong>OOP · SOLID · Design Pattern</strong> · phần thầy hỏi khi review, và phần "được cộng LOC".</li>
</ol>` },
  { type: 'heading', text: 'The nine-assignment route to 750 LOC', textVi: 'Lộ trình 9 bài để đủ 750 LOC' },
  { type: 'prose', html: `<p>Xếp <strong>dễ → khó</strong>, và đều tránh ba loại bài thầy dặn không nên
chọn (candidate · mua bán hoa quả · bài thuật toán thuần):</p>
<table>
  <tr><th>#</th><th>Bài</th><th>LOC đề</th><th>Cộng dồn</th><th>Vì sao chọn</th></tr>
  <tr><td>0</td><td><code>J1.S.P0055</code> Doctor Management</td><td>—</td><td>0</td><td>Buổi 1, làm theo mẫu, <strong>không tính LOC</strong></td></tr>
  <tr><td>1</td><td><code>J1.S.P0054</code> Contact Management</td><td>100</td><td>100</td><td>Y hệt P0055, chỉ đổi tên đối tượng</td></tr>
  <tr><td>2</td><td><code>J1.S.P0056</code> Worker Management</td><td>100</td><td>200</td><td>Thêm một phép tính lương</td></tr>
  <tr><td>3</td><td><code>J1.S.P0057</code> User Management</td><td>110</td><td>310</td><td>Thêm đọc/ghi file <code>.dat</code></td></tr>
  <tr><td>4</td><td><code>J1.S.P0060</code> Region Management</td><td>100</td><td>410</td><td>Cùng khuôn, thêm quan hệ cha–con</td></tr>
  <tr><td>5</td><td><code>J1.S.P0066</code> Car Showroom</td><td>120</td><td>530</td><td>Chỗ dùng <strong>Factory Method</strong> tự nhiên nhất</td></tr>
  <tr><td>6</td><td><code>J1.S.P0073</code> Handy Expense</td><td>120</td><td>650</td><td>Strategy + Observer</td></tr>
  <tr><td>7</td><td><code>J1.S.P0071</code> Task Management</td><td>130</td><td>780</td><td>✅ <strong>Vượt mốc 750</strong></td></tr>
  <tr><td>8</td><td><code>J1.S.P0058</code> Account Management</td><td>110</td><td>890</td><td>Dự phòng</td></tr>
  <tr><td>9</td><td><code>J1.S.P0061</code> Student Management</td><td>120</td><td>1010</td><td>Dự phòng</td></tr>
</table>
<p>Bảy bài đầu là đủ. Hai bài cuối là <strong>đệm</strong> — phòng khi thầy tính LOC chặt hơn số ghi trong
đề, hoặc một bài bị trả về.</p>
<p>⚠️ <strong>Chưa xác nhận với thầy:</strong> LOC của những lần học trước có được cộng dồn không, và bài
nào đã bị khoá. Hỏi ngay buổi tới — câu trả lời đổi hẳn lộ trình này.</p>` },
  { type: 'heading', text: 'Checklist before every review', textVi: 'Checklist trước mỗi lần gọi review' },
  { type: 'prose', html: `<ul>
  <li>☐ Đủ <strong>8 package</strong> · ☐ <code>Scanner</code> chỉ trong <code>Main</code> · ☐
  <code>System.out</code> chỉ trong <code>view/</code> và <code>Main</code></li>
  <li>☐ Mọi field <code>private</code> · ☐ <code>static</code> chỉ ở <code>utils/Validation</code> · ☐
  không hardcode chữ ngoài <code>constants/Message</code></li>
  <li>☐ Khai báo <code>ArrayList</code>/<code>HashMap</code> (<strong>không</strong> <code>List</code>/<code>Map</code>)
  · ☐ mỗi hàm và mỗi <code>if</code>/<code>for</code> có một dòng <code>//</code></li>
  <li>☐ Đã bấm <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> · ☐ chạy hết happy case + hiện đủ message lỗi
  · ☐ debug được tại chỗ · ☐ trả lời được 12 câu review</li>
</ul>` },
];

const KE_HOACH = [
  { slug: 'lab211-java-nen-tang', sortOrder: 1,
    name: 'Java nền tảng — ôn lại trước khi làm bài',
    description: 'Kiểu dữ liệu, nhập/xuất, vòng lặp, kiểm tra dữ liệu, mảng/ArrayList/HashMap, class, OOP, thuật toán tự viết, file, MVC, debug, vấn đáp, checklist. Tra khi quên cú pháp — không cần đọc một mạch.',
    phan: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], giuSo: true },
  { slug: 'lab211-kien-truc-bo-khung', sortOrder: 2,
    name: 'Kiến trúc 8 package & bộ khung P0055',
    description: 'Luật chơi LAB211, cấu trúc 8 package thầy bắt buộc, và bộ khung J1.S.P0055 đọc từng file một. Học một lần, dùng lại cho cả 9 bài.',
    phan: [16,17,24], giuSo: false },
  { slug: 'lab211-oop-solid-pattern', sortOrder: 3,
    name: 'OOP · SOLID · Design Pattern — phần thầy hỏi khi review',
    description: '4 tính chất OOP soi thẳng vào bài P0055, access modifier & static, 5 nguyên lý SOLID bằng Java, 5 Design Pattern thầy dạy, quan hệ giữa class, và 12 câu hỏi review kèm đáp án mẫu.',
    phan: [18,19,20,21,22,23], giuSo: false },
];

console.log(`\nSẽ tạo ${KE_HOACH.length} module mới, và viết lại bài giảng của ${GOC}:\n`);
const dungSan = [];
for (const k of KE_HOACH) {
  let bl = layPhan(blocks, k.phan);
  if (!k.giuSo) bl = danhSoLai(bl);
  const anh = bl.filter((b) => b.type === 'image').length;
  const chu = bl.reduce((a, b) => a + JSON.stringify(b).length, 0);
  console.log(`  [${k.sortOrder}] ${k.name}`);
  console.log(`       phần ${k.phan.join(', ')} → ${bl.length} block · ${anh} ảnh · ${chu.toLocaleString('vi-VN')} ký tự`);
  dungSan.push({ ...k, blocks: bl });
}
console.log(`  [4] LAB211 Assignments (${GOC}) — bài giảng mới ${dan.length} block, 54 bài tập giữ nguyên`);
console.log(`\n  Phần 25 cũ (Hướng dẫn chung, 55 block) — BỎ, đã thay bằng module sort 0 sâu hơn.`);

if (!APPLY) {
  console.log('\n(thử khô — thêm --apply để ghi thật)');
} else {
  for (const k of dungSan) {
    const cu = await prisma.codeModule.findFirst({ where: { trackId: TRACK_ID, slug: k.slug } });
    if (cu) {
      await prisma.codeModule.update({ where: { id: cu.id },
        data: { name: k.name, description: k.description, sortOrder: k.sortOrder,
                lessonBlocks: k.blocks, lessonGeneratedAt: new Date() } });
      console.log(`  ✓ cập nhật ${k.slug} (id ${cu.id})`);
    } else {
      const m = await prisma.codeModule.create({
        data: { trackId: TRACK_ID, name: k.name, slug: k.slug, description: k.description,
                level: 'BEGINNER', sortOrder: k.sortOrder,
                lessonBlocks: k.blocks, lessonGeneratedAt: new Date() } });
      console.log(`  ✓ tạo ${k.slug} (id ${m.id})`);
    }
  }
  await prisma.codeModule.update({ where: { id: GOC },
    data: { sortOrder: 4, lessonBlocks: dan, lessonGeneratedAt: new Date() } });
  console.log(`  ✓ ${GOC} → sortOrder 4, bài giảng mới ${dan.length} block`);

  // Đẩy ba module tham khảo xuống dưới
  const sau = { 'lab211-api-reference': 5, 'lab211-algorithm-reference': 6, 'lab211-error-handbook': 7 };
  for (const [slug, so] of Object.entries(sau)) {
    const m = await prisma.codeModule.findFirst({ where: { trackId: TRACK_ID, slug } });
    if (m) { await prisma.codeModule.update({ where: { id: m.id }, data: { sortOrder: so } });
             console.log(`  ✓ ${slug} → sortOrder ${so}`); }
  }
  console.log('\n✅ Xong.');
}
await prisma.$disconnect();
