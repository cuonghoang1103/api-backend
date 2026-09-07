/**
 * academy-lab211-huongdan.mjs — chương "Hướng dẫn của thầy" cho khoá Academy
 * LAB211 (course id 18), đặt ở ĐẦU khoá.
 *
 * Cùng nội dung với module Code Lab (scripts/data/lab211-huongdan.mjs), nhưng
 * Academy CẮT NHỎ thành từng bài học — mỗi bài 1–5 trang tài liệu — vì Academy
 * học theo buổi, còn Code Lab đọc một mạch.
 *
 * Chạy lại được: xoá đúng chương do script này tạo (nhận theo slug tiền tố
 * `lab211-hd-`) rồi tạo lại, không đụng 10 chương gốc.
 *
 *   node scripts/academy-lab211-huongdan.mjs           # thử khô
 *   node scripts/academy-lab211-huongdan.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
import { BLOCKS } from './data/lab211-huongdan.mjs';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const COURSE_ID = 18;
const TIEN_TO = 'lab211-hd-';
const CL = 'https://cuongthai.com/code-lab/lab211';

// ─── Blocks → HTML ────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function sangHtml(blocks) {
  return blocks.map((b) => {
    switch (b.type) {
      case 'heading':
        return `<h3>${b.textVi || b.text}</h3>`;
      case 'prose':
        return b.html;
      case 'image':
        return `<div class="anh-slide"><img src="${b.url}" alt="${esc(b.caption)}" loading="lazy" />` +
               `<p class="chu-thich">${b.caption}</p></div>`;
      case 'code':
        return `<div class="khoi-ma"><p class="nhan-ma">${b.titleVi || b.title}</p>` +
               `<pre><code class="language-${b.language}">${esc(b.code)}</code></pre></div>`;
      default:
        return '';
    }
  }).join('\n');
}

/** Cắt BLOCKS theo mốc heading: [từ heading thứ i, đến trước heading thứ j). */
const MOC = BLOCKS.map((b, i) => (b.type === 'heading' ? i : -1)).filter((i) => i >= 0);
const PART = BLOCKS.map((b, i) => (b.type === 'part' ? i : -1)).filter((i) => i >= 0);
function lat(tuHeading, denHeading) {
  const dau = MOC[tuHeading];
  const cuoi = denHeading === null ? BLOCKS.length : MOC[denHeading];
  return BLOCKS.slice(dau, cuoi);
}

// Bản đồ heading (theo thứ tự trong BLOCKS) — in ra để đối chiếu khi chạy thử.
// 0..9   = slide 1..10 của tài liệu A
// 10,11  = trang 1,2 của tài liệu B
// 12..21 = trang 1..10 của tài liệu C
// 22,23  = trang 1,2 của tài liệu D
// 24..27 = bốn mục của phần tổng hợp

const BAI = [
  { slug: 'ai-cham-ban-va-bon-con-so',
    en: 'A.1 — Who grades you, and the four numbers that decide it',
    vi: 'A.1 — Ai chấm bạn, và bốn con số quyết định',
    desc: 'Slide 1–2: email thầy (cần để CC), và hợp đồng 20 slot · 80% · 750 LOC · PRO192.',
    leadEn: 'The cover slide and the requirements slide. Two pages, and the second one is the contract you signed.',
    tu: 0, den: 2, dauPart: 0,
    coda: `<p>Con số <strong>750 LOC</strong> ở slide này là thứ mọi bài học sau đều xoay quanh. Lộ trình
    9 bài cụ thể để vượt mốc đó — kèm LOC thật của từng đề — nằm ngay trên Code Lab:</p>` },

  { slug: 'bay-chu-de-thay-se-hoi',
    en: 'A.2 — The seven topics on the "must know" list',
    vi: 'A.2 — Bảy chủ đề thầy sẽ hỏi',
    desc: 'Slide 3–4: OOP · convention · access modifier · static · truyền tham số · kiểu dữ liệu · SOLID + Design Pattern.',
    leadEn: 'Not a syllabus — a list of viva questions, written down in advance.',
    tu: 2, den: 4,
    coda: `<p>Bốn chủ đề đầu được dạy đầy đủ ở chương <strong>"OOP · SOLID · Design Pattern"</strong> phía
    dưới. Bẫy <code>ArrayList</code> vs <code>List</code> ở mục 6 thì luyện tay ngay bằng bộ khung:</p>` },

  { slug: 'yeu-cau-thuc-hanh-va-dat-ten',
    en: 'A.3 — Four practice requirements, and the naming rules',
    vi: 'A.3 — Bốn yêu cầu thực hành và quy tắc đặt tên',
    desc: 'Slide 5–6: "tất cả theo OOP", cấu trúc MVC, SRP ở Model, "không truyền dữ liệu qua lại", và khuôn đặt tên project/package/class/method.',
    leadEn: 'Slide 5 contains the single hardest sentence in the whole pack: "no passing data around".',
    tu: 4, den: 6,
    coda: `<p>Câu "không truyền dữ liệu qua lại" chỉ hiểu được khi tự tay sửa. Bài luyện số 1 (thêm trường
    <code>phone</code>) cho bạn thấy đúng chỗ đó — 9 file phải sửa, và Controller <strong>không phải sửa
    một chữ nào</strong>:</p>` },

  { slug: 'single-responsibility-va-quy-trinh-buoi-hoc',
    en: 'A.4 — Single Responsibility, and the three steps of every session',
    vi: 'A.4 — Single Responsibility và ba bước của mỗi buổi',
    desc: 'Slide 7–8: đường ranh giới Model ✕ Controller/Service, và vòng lặp "cất điện thoại → save draft → review".',
    leadEn: 'One slide out of ten is spent on a single SOLID principle. That ratio tells you how much it matters.',
    tu: 6, den: 8,
    coda: `<p>Ranh giới Model ✕ View ✕ Service là toàn bộ tinh thần của kiến trúc 8 package. Xem nó chạy
    thật trong 10 file của bộ khung:</p>` },

  { slug: 'noi-quy-trang-nang-nhat',
    en: 'A.5 — House rules: the heaviest page in the pack',
    vi: 'A.5 — Nội quy: trang nặng nhất cả bộ tài liệu',
    desc: 'Slide 9: hai mức phạt điện thoại, điểm danh 10 phút, bài P0055 buổi đầu không tính LOC, và ba bài phải tránh.',
    leadEn: 'Phone in your pocket rejects work from previous sessions too. Read this page twice.',
    tu: 8, den: 9,
    coda: `<p>Ba lời cảnh báo chọn bài ở cuối slide thu hẹp 54 bài xuống còn khoảng 40 bài an toàn. Danh sách
    9 bài đã chọn sẵn, kèm LOC thật và lý do chọn từng bài:</p>` },

  { slug: 'bang-cau-hoi-review',
    en: 'A.6 — The review question list',
    vi: 'A.6 — Bảng câu hỏi review',
    desc: 'Slide 10: bốn điều kiện chặn cửa, bốn câu hỏi cho điểm, và hai chỗ "được cộng LOC".',
    leadEn: 'Four gates that stop the review, four questions that earn marks, and the only two places the deck mentions bonus LOC.',
    tu: 9, den: 10,
    coda: `<p>Đáp án mẫu đầy đủ cho cả 12 câu hỏi review nằm ở bài cuối chương
    <strong>"OOP · SOLID · Design Pattern"</strong>. Luyện trả lời ngay trên Starter code:</p>` },

  { slug: 'pts-draft-va-submit',
    en: 'A.7 — PTS: logging in, picking assignments, DRAFT and SUBMIT',
    vi: 'A.7 — PTS: đăng nhập, chọn bài, DRAFT và SUBMIT',
    desc: 'Tài liệu B: hai kiểu đăng nhập khác nhau, luật tối đa 5 bài, và khác biệt không sửa được giữa DRAFT với SUBMIT.',
    leadEn: 'Two pages. Forget DRAFT and you lose the session; SUBMIT early and you can never edit again.',
    tu: 10, den: 12, dauPart: 1 },

  { slug: 'usb-lab-chuan-bi-may',
    en: 'A.8 — USB LAB: preparing your laptop',
    vi: 'A.8 — USB LAB: chuẩn bị máy',
    desc: 'Tài liệu C trang 1–5: nội quy phòng LAB, điều kiện phần cứng, vào BIOS, tắt Secure Boot/TPM, boot USB, và luật wifi có thể xoá sạch máy.',
    leadEn: 'Nothing to do with Java — but if your laptop will not boot the LAB USB, you cannot work at all.',
    tu: 12, den: 17, dauPart: 2 },

  { slug: 'usb-lab-dang-ky-va-su-co',
    en: 'A.9 — USB LAB: registration and troubleshooting',
    vi: 'A.9 — USB LAB: đăng ký máy và xử lý sự cố',
    desc: 'Tài liệu C trang 6–10: đăng ký máy lần đầu, lấy địa chỉ MAC, email đăng ký đúng format, và bảng xử lý sáu sự cố hay gặp.',
    leadEn: 'The exact email format, and the fixes for the six failures that actually happen.',
    tu: 17, den: 22 },

  { slug: 'cham-diem-va-ranh-gioi-chep-bai',
    en: 'A.10 — Grading policy, and where the line on copying is',
    vi: 'A.10 — Chấm điểm và ranh giới của việc chép bài',
    desc: 'Tài liệu D: ba tiêu chí chấm ("chạy đúng" chỉ đứng thứ ba), và điều bạn ĐƯỢC PHÉP dùng lại từ code mẫu của môn.',
    leadEn: 'The policy is wider than most students think: the course sample code is yours to reuse, uncited.',
    tu: 22, den: 24, dauPart: 3,
    coda: `<p>Vì bài mẫu của môn được phép dùng lại, bộ khung P0055 là <strong>vốn liếng hợp lệ cho cả 9
    bài</strong>. Cái phải là của bạn là phần nghiệp vụ riêng từng bài:</p>` },

  { slug: 'lo-trinh-9-bai',
    en: 'A.11 — A nine-assignment route past 750 LOC',
    vi: 'A.11 — Lộ trình 9 bài để vượt mốc 750 LOC',
    desc: 'Chín bài cùng khuôn CRUD với P0055, LOC lấy từ chính tiêu đề đề bài, tránh ba loại bài thầy dặn không nên chọn.',
    leadEn: 'Nine assignments that share one skeleton, adding up to 795 LOC.',
    tu: null, den: null,
    html: `<h3>Chọn bài theo KHUÔN, không theo số LOC</h3>
<p>Slide 9 nói bài thuật toán <em>"cũng phải làm MVC"</em>. Nghĩa là một bài 21 LOC và một bài 150 LOC tốn
<strong>đúng bằng nhau</strong> ở công dựng 8 package — chỉ khác phần nghiệp vụ ở giữa. Vậy nên:</p>
<ul>
  <li><strong>Chọn bài cùng khuôn với P0055</strong> (quản lý danh sách: thêm/xoá/sửa/tìm/hiển thị) → bộ
  khung viết một lần, dùng lại được cả chín bài.</li>
  <li><strong>Trong cùng khuôn thì chọn bài LOC cao</strong> — cùng công sức, nhiều dòng hơn.</li>
  <li><strong>Tránh bài thuật toán thuần</strong> — ít LOC mà vẫn tốn đủ công dựng cấu trúc.</li>
</ul>
<h3>Chín bài, LOC lấy từ chính tiêu đề đề bài</h3>
<table>
  <tr><th>#</th><th>Bài</th><th>LOC</th><th>Cộng dồn</th><th>Vì sao chọn</th></tr>
  <tr><td>0</td><td><code>J1.S.P0055</code> Doctor management</td><td>73</td><td>0</td><td>Buổi 1, làm theo mẫu — <strong>không tính LOC</strong></td></tr>
  <tr><td>1</td><td><code>J1.S.P0054</code> Contact Management</td><td>64</td><td>64</td><td>Y hệt P0055, chỉ đổi tên đối tượng</td></tr>
  <tr><td>2</td><td><code>J1.S.P0056</code> Worker information</td><td>70</td><td>134</td><td>Cùng khuôn, thêm một phép tính lương</td></tr>
  <tr><td>3</td><td><code>J1.S.P0057</code> User management</td><td>56</td><td>190</td><td>Thêm đọc/ghi file — chỗ dùng DIP</td></tr>
  <tr><td>4</td><td><code>J1.S.P0052</code> Manage the geographic</td><td>69</td><td>259</td><td>Cùng khuôn, có quan hệ cha–con</td></tr>
  <tr><td>5</td><td><code>J1.S.P0066</code> Car showroom</td><td>63</td><td>322</td><td>Nhiều loại xe cùng gốc → Factory Method</td></tr>
  <tr><td>6</td><td><code>J1.S.P0059</code> The program handles files</td><td>73</td><td>395</td><td>Dùng lại đúng phần file của P0057</td></tr>
  <tr><td>7</td><td><code>J1.S.P0073</code> Handy Expense</td><td>100</td><td>495</td><td>Có nghiệp vụ tính toán → Strategy + Observer</td></tr>
  <tr><td>8</td><td><code>J1.S.P0085</code> Employee management</td><td>150</td><td>645</td><td>Bài lớn đầu tiên, vẫn đúng khuôn CRUD</td></tr>
  <tr><td>9</td><td><code>J1.S.P0071</code> Task management (CCRM)</td><td>150</td><td><strong>795 ✅</strong></td><td>Strategy + Observer + Builder</td></tr>
</table>
<p>💡 <strong>Ba bài cuối chiếm 400 trong 795 LOC.</strong> Sáu bài đầu chỉ được 395 — chúng là để luyện tay
và lấy đà; ba bài cuối mới là chỗ kiếm phần lớn số dòng. Đừng dừng ở nhóm bài nhỏ.</p>
<h3>Ba bài phải tránh — thầy nói thẳng trong slide 9</h3>
<table>
  <tr><th>Bài</th><th>Thầy nói gì</th></tr>
  <tr><td><code>J1.L.P0022</code> Candidates (350 LOC)</td><td>"cần implement đầy đủ SOLID → <strong>rất khó, không nên liều</strong>"</td></tr>
  <tr><td><code>J1.L.P0023</code> Fruit Shop (350 LOC)</td><td>"cần thiết kế được ERD… <strong>không nên chọn</strong>"</td></tr>
  <tr><td>Bài thuật toán thuần (40–50 LOC)</td><td>"cũng phải làm MVC, không OOP/MVC → không review" — lỗ công</td></tr>
</table>
<h3>Dự phòng nếu cần thêm</h3>
<p><code>J1.S.P0080</code> Shapes (90) và <code>J1.S.P0081</code> Bees (90) — có <strong>kế thừa và đa
hình</strong>, mà slide 10 ghi rõ hai tính chất đó <em>"sẽ được cộng LOC"</em>. <code>J1.S.P0070</code>
Login system Ebank (150) nếu cần một bài lớn nữa.</p>
<p>⚠️ <strong>Việc phải làm trước khi chọn bài:</strong> vào PTS xem <strong>đang có bao nhiêu LOC tích
luỹ</strong> từ những lần học trước, và <strong>bài nào đã khoá</strong>. Syllabus ghi LOC cũ được giữ
(<em>"the previously accumulated LOC is remained"</em>) nhưng bài đã pass thì không được làm lại
(<em>"not allowed to re-conduct previously completed assignments"</em>). Hai con số đó đổi hẳn bảng trên.</p>`,
    coda: `<p>Mọi bài trong bảng đều có sẵn đề đầy đủ, bộ khung 8 package và AI kèm cặp trên Code Lab:</p>` },

  { slug: 'checklist-tong-hop',
    en: 'A.12 — Everything the four documents demand, in one list',
    vi: 'A.12 — Tổng hợp: mọi thứ bốn tài liệu đòi hỏi',
    desc: 'Ba checklist (trước buổi học · trong phòng · trước khi gọi review) và bảng bốn hình phạt xếp theo mức thiệt hại.',
    leadEn: 'Print it. Tick it before every review.',
    tu: 24, den: null, dauPart: 4 },
];

// ─── Dựng HTML từng bài ───────────────────────────────────────
const CHUONG = [];
for (const b of BAI) {
  if (b.html) {   // bài viết tay, không cắt từ nội dung nguồn
    CHUONG.push({ ...b, soAnh: 0,
      html: `
<div class="ml-en"><span class="eyebrow">Fall 2026 · Mentor's own documents</span>
<h2>${b.en.replace(/^A\.\d+ — /, '')}</h2>
<p class="lead">${b.leadEn}</p>
<p>Switch to <strong>VI</strong> for the full table and the reasoning behind each choice.</p>
</div>
<div class="ml-vi"><span class="eyebrow">Fall 2026 · Lộ trình</span>
<h2>${b.vi.replace(/^A\.\d+ — /, '')}</h2>
${b.html}
${b.coda}<p class="di-toi"><a href="${CL}" target="_blank" rel="noopener">▶ Mở Code Lab LAB211 — bộ khung, 54 bài tập và bài luyện</a></p>
</div>` });
    continue;
  }
  let bl = lat(b.tu, b.den);
  // Bài mở đầu mỗi tài liệu: kèm đoạn dẫn của phần đó (nằm ngay sau block part).
  if (b.dauPart !== undefined) {
    const i = PART[b.dauPart];
    const dan = BLOCKS.slice(i + 1, MOC.find((m) => m > i));
    bl = [...dan, ...bl];
  }
  const than = sangHtml(bl);
  const coda = b.coda
    ? `${b.coda}<p class="di-toi"><a href="${CL}" target="_blank" rel="noopener">▶ Mở Code Lab LAB211 — bộ khung, 54 bài tập và bài luyện</a></p>`
    : '';
  CHUONG.push({
    ...b,
    html: `
<div class="ml-en"><span class="eyebrow">Fall 2026 · Mentor's own documents</span>
<h2>${b.en.replace(/^A\.\d+ — /, '')}</h2>
<p class="lead">${b.leadEn}</p>
<p>The four documents are written in Vietnamese and this walkthrough quotes them line by line, so the full
teaching sits in the Vietnamese tab. Switch to <strong>VI</strong> for the page-by-page reading.</p>
</div>
<div class="ml-vi"><span class="eyebrow">Fall 2026 · Tài liệu gốc của thầy</span>
<h2>${b.vi.replace(/^A\.\d+ — /, '')}</h2>
${than}
${coda}
</div>`,
    soAnh: bl.filter((x) => x.type === 'image').length,
  });
}

// ─── Báo cáo ──────────────────────────────────────────────────
console.log('Bản đồ heading trong nội dung nguồn:');
MOC.forEach((i, k) => console.log(`  [${String(k).padStart(2)}] ${BLOCKS[i].textVi || BLOCKS[i].text}`));
console.log(`\nChương "Fall 2026 · A — Hướng dẫn của thầy" — ${CHUONG.length} bài:`);
for (const c of CHUONG) {
  console.log(`  ${c.vi}`);
  console.log(`        ${c.soAnh} ảnh · ${c.html.length.toLocaleString('vi-VN')} ký tự`);
}
const tongAnh = CHUONG.reduce((a, c) => a + c.soAnh, 0);
console.log(`\nTổng: ${tongAnh} ảnh (nguồn có ${BLOCKS.filter((b) => b.type === 'image').length}) · ` +
            `${CHUONG.reduce((a, c) => a + c.html.length, 0).toLocaleString('vi-VN')} ký tự`);
if (tongAnh !== BLOCKS.filter((b) => b.type === 'image').length) {
  console.error('⛔ Số ảnh không khớp — có trang bị rơi khỏi lát cắt. Dừng.');
  process.exit(1);
}

// ─── Ghi vào DB ───────────────────────────────────────────────
const secs = await prisma.courseSection.findMany({
  where: { courseId: COURSE_ID },
  select: { id: true, title: true, sortOrder: true, lessons: { select: { slug: true } } },
  orderBy: { sortOrder: 'asc' },
});
const cuaToi = secs.filter((s) => s.lessons.some((l) => (l.slug || '').startsWith(TIEN_TO)));
const khac = secs.filter((s) => !cuaToi.includes(s));
console.log(`\nKhoá 18 đang có ${secs.length} chương (${cuaToi.length} của script này).`);
console.log(`Sẽ đẩy ${khac.length} chương cũ xuống sortOrder 1..${khac.length}, chương mới lên 0.`);

if (!APPLY) {
  console.log('\n(thử khô — thêm --apply để ghi thật)');
} else {
  for (const s of cuaToi) await prisma.courseSection.delete({ where: { id: s.id } });
  // Đẩy các chương cũ xuống một bậc, giữ nguyên thứ tự tương đối.
  let n = 1;
  for (const s of khac) await prisma.courseSection.update({ where: { id: s.id }, data: { sortOrder: n++ } });

  const sec = await prisma.courseSection.create({
    data: {
      courseId: COURSE_ID, sortOrder: 0, isLocked: false,
      title: "Fall 2026 · A — The mentor's own documents, page by page|||Fall 2026 · A — Hướng dẫn của thầy, đọc từng trang",
    },
  });
  for (let i = 0; i < CHUONG.length; i++) {
    const c = CHUONG[i];
    await prisma.lesson.create({
      data: {
        sectionId: sec.id, title: `${c.en}|||${c.vi}`, slug: `${TIEN_TO}${c.slug}`,
        description: c.desc, content: c.html, lessonType: 'VIDEO',
        sortOrder: i, isPublished: true, isFreePreview: true,
      },
    });
  }
  console.log(`\n✅ Đã tạo chương ${sec.id} ở sortOrder 0 với ${CHUONG.length} bài.`);
}
await prisma.$disconnect();
