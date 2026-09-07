/**
 * codelab-lab211-847-lesson.mjs — bài giảng NGẮN dẫn đường cho module 847
 * (54 bài tập). Phần dạy nằm ở 4 module phía trên; đây chỉ là bản đồ.
 *
 * ⚠️ Bảng lộ trình dưới đây dùng LOC ĐỌC TỪ CHÍNH TIÊU ĐỀ 54 ĐỀ trong DB,
 * không phải từ trí nhớ. Bản đầu tiên viết theo trí nhớ đã sai cả tên bài
 * lẫn LOC (P0060 là "tính tiền hoá đơn 21 LOC", không phải "Region 100 LOC").
 *
 *   node scripts/codelab-lab211-847-lesson.mjs           # thử khô
 *   node scripts/codelab-lab211-847-lesson.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const GOC = 847;

// Lấy LOC THẬT từ tiêu đề đề bài trong DB.
const ex = await prisma.codeExercise.findMany({
  where: { moduleId: GOC }, select: { slug: true, title: true },
});
const locCua = {};
const slugCua = {};
for (const e of ex) {
  const ma = e.title.match(/^(J1\.[SL]\.P\d+)/)?.[1];
  const loc = Number(e.title.match(/\((\d+) LOC\)/)?.[1] || 0);
  if (ma) { locCua[ma] = loc; slugCua[ma] = e.slug; }
}
const CL = 'https://cuongthai.com/code-lab/lab211';
const lienKet = (ma, ten) =>
  slugCua[ma] ? `<a href="${CL}/${slugCua[ma]}"><code>${ma}</code> ${ten}</a>` : `<code>${ma}</code> ${ten}`;

// Lộ trình: cùng khuôn CRUD với P0055, tránh 3 bài thầy dặn không nên chọn.
const LO_TRINH = [
  ['J1.S.P0054', 'Contact Management',        'Y hệt P0055, chỉ đổi tên đối tượng — làm ngay sau buổi 1'],
  ['J1.S.P0056', 'Worker information',        'Cùng khuôn, thêm một phép tính lương'],
  ['J1.S.P0057', 'User management system',    'Thêm đọc/ghi file — chỗ dùng DIP (interface kho)'],
  ['J1.S.P0052', 'Manage the geographic',     'Cùng khuôn, có quan hệ cha–con giữa vùng'],
  ['J1.S.P0066', 'Car showroom',              'Nhiều loại xe cùng gốc → Factory Method tự nhiên'],
  ['J1.S.P0059', 'The program handles files', 'Xử lý tệp — dùng lại đúng phần file của P0057'],
  ['J1.S.P0073', 'Handy Expense',             'Có nghiệp vụ tính toán → Strategy + Observer'],
  ['J1.S.P0085', 'Employee management',       'Bài lớn đầu tiên, vẫn đúng khuôn CRUD'],
  ['J1.S.P0071', 'Task management (CCRM)',    'Strategy + Observer + Builder — bài "trình diễn"'],
];
let dồn = 0;
const hang = LO_TRINH.map(([ma, ten, vi], i) => {
  const loc = locCua[ma] ?? 0; dồn += loc;
  return `<tr><td>${i + 1}</td><td>${lienKet(ma, ten)}</td><td>${loc}</td><td>${dồn}${dồn >= 750 && dồn - loc < 750 ? ' ✅' : ''}</td><td>${vi}</td></tr>`;
}).join('\n');
const DU_PHONG = [
  ['J1.S.P0080', 'Shapes',                'Kế thừa + đa hình → slide nội quy ghi "được cộng LOC"'],
  ['J1.S.P0081', 'Bees',                  'Cùng lý do với Shapes'],
  ['J1.S.P0070', 'Login system (Ebank)',  'Bài 150 LOC, đủ khuôn CRUD'],
].map(([ma, ten, vi]) => `<tr><td>${lienKet(ma, ten)}</td><td>${locCua[ma] ?? '?'}</td><td>${vi}</td></tr>`).join('\n');

const B = [
  { type: 'part', number: '1', text: 'Where to start, and which assignments to do',
    textVi: 'Bắt đầu từ đâu, và làm những bài nào',
    subtitle: 'A one-page map — the teaching lives in the four modules above',
    subtitleVi: 'Một trang bản đồ — phần dạy nằm ở bốn module phía trên' },
  { type: 'prose', html: `<p>Dưới đây là <strong>toàn bộ 54 bài của LAB211</strong>, xếp theo LOC ghi trong
đề. Bạn <strong>không làm cả 54 bài</strong> — chỉ cần đủ <strong>≥ 750 LOC</strong>.</p>
<p>Phần dạy đã tách thành bốn module riêng ở phía trên, đọc theo thứ tự:</p>
<ol>
  <li><strong>Hướng dẫn của thầy — đọc từng trang tài liệu</strong> · luật chơi, nội quy, cách nộp bài, cách
  chấm, xử lý sự cố USB. <em>Đọc trước khi gõ dòng code đầu tiên.</em></li>
  <li><strong>Java nền tảng</strong> · kiểu dữ liệu, vòng lặp, ArrayList/HashMap, file, thuật toán, debug.
  <em>Tra khi quên cú pháp, không cần đọc một mạch.</em></li>
  <li><strong>Kiến trúc 8 package &amp; bộ khung P0055</strong> · cấu trúc thầy bắt buộc + 10 file mẫu đọc
  từng dòng. <em>Học một lần, dùng cho cả 9 bài.</em></li>
  <li><strong>OOP · SOLID · Design Pattern</strong> · phần thầy hỏi khi review, và hai chỗ "được cộng LOC".</li>
</ol>` },
  { type: 'heading', text: 'A nine-assignment route past 750 LOC', textVi: 'Lộ trình 9 bài vượt mốc 750 LOC' },
  { type: 'prose', html: `<p>Chín bài dưới đây <strong>cùng một khuôn với P0055</strong> (quản lý danh sách:
thêm / xoá / sửa / tìm / hiển thị), nên bộ khung viết một lần dùng lại được cả chín. Tất cả đều tránh ba
loại bài thầy dặn không nên chọn. <strong>Số LOC lấy từ chính tiêu đề đề bài.</strong></p>
<table>
  <tr><th>#</th><th>Bài</th><th>LOC</th><th>Cộng dồn</th><th>Vì sao chọn</th></tr>
  <tr><td>0</td><td>${lienKet('J1.S.P0055', 'Doctor management')}</td><td>${locCua['J1.S.P0055']}</td><td>0</td><td>Buổi 1, làm theo mẫu — <strong>không tính LOC</strong></td></tr>
${hang}
</table>
<p>Hết chín bài là <strong>${dồn} LOC</strong> — dôi ra ${dồn - 750} LOC so với mốc 750. Phần dôi đó là
đệm phòng khi một bài bị trả về hoặc thầy tính chặt hơn số ghi trong đề.</p>
<p>💡 <strong>Ba bài cuối (${LO_TRINH[6][1]}, ${LO_TRINH[7][1]}, ${LO_TRINH[8][1]}) chiếm 400 trong 795
LOC.</strong> Sáu bài đầu chỉ được 395 — chúng là để <em>luyện tay và lấy đà</em>, ba bài cuối mới là chỗ
kiếm phần lớn số dòng. Đừng dừng lại ở nhóm bài nhỏ.</p>` },
  { type: 'heading', text: 'Spares, if you need more', textVi: 'Bài dự phòng nếu cần thêm' },
  { type: 'prose', html: `<table>
  <tr><th>Bài</th><th>LOC</th><th>Vì sao đáng làm</th></tr>
${DU_PHONG}
</table>
<p>⚠️ Ba bài bạn <strong>đã làm ở kỳ trước</strong> (Shapes, Bubble sort, Linear search) vẫn để trong danh
sách cho đủ, nhưng syllabus ghi <em>"students are not allowed to re-conduct previously completed
assignments"</em> — bài đã pass thì không được làm lại. <strong>Vào PTS xem mình đang có bao nhiêu LOC và
bài nào đã khoá</strong> trước khi chọn; con số đó đổi hẳn lộ trình ở trên.</p>` },
  { type: 'heading', text: 'Three assignments to avoid', textVi: 'Ba bài phải tránh' },
  { type: 'prose', html: `<table>
  <tr><th>Bài</th><th>LOC</th><th>Thầy nói gì</th></tr>
  <tr><td><code>J1.L.P0022</code> Candidates</td><td>${locCua['J1.L.P0022'] ?? 350}</td><td>"cần implement đầy đủ SOLID → <strong>rất khó, không nên liều</strong>"</td></tr>
  <tr><td><code>J1.L.P0023</code> Fruit Shop</td><td>${locCua['J1.L.P0023'] ?? 350}</td><td>"cần thiết kế được ERD… trong java console sẽ rất phức tạp → <strong>không nên chọn</strong>"</td></tr>
  <tr><td>Bài thuật toán thuần<br/><small>P0001 · P0002 · P0003 · P0009 · P0010…</small></td><td>40–50</td><td>"cũng phải làm MVC, không OOP/MVC → không review". Ít LOC mà <strong>vẫn tốn đủ công dựng 8 package</strong> — lỗ.</td></tr>
</table>` },
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

console.log(`Đọc LOC thật từ ${ex.length} đề bài.`);
for (const [ma, ten] of LO_TRINH) console.log(`   ${ma} ${ten} → ${locCua[ma]} LOC`);
console.log(`   TỔNG 9 bài: ${dồn} LOC`);
console.log(`Bài giảng mới: ${B.length} block · ${B.reduce((a,b)=>a+JSON.stringify(b).length,0).toLocaleString('vi-VN')} ký tự`);
const thieu = LO_TRINH.filter(([ma]) => !locCua[ma]);
if (thieu.length) { console.error('⛔ Không tìm thấy trong DB:', thieu.map(x=>x[0]).join(', ')); process.exit(1); }

if (!APPLY) console.log('\n(thử khô — thêm --apply để ghi thật)');
else {
  await prisma.codeModule.update({ where: { id: GOC }, data: { lessonBlocks: B, lessonGeneratedAt: new Date() } });
  console.log('✅ Đã ghi.');
}
await prisma.$disconnect();
