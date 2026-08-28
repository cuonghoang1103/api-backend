import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SKILL_BOOKS, SKILL_SERIES_TOTALS } from './skill-books-plan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const target = path.join(root, 'docs/handoff/CLAUDE_CODE_SKILLS_BOOKS_PROMPT.md');

const catalog = SKILL_BOOKS.map((book) => {
  const status = book.published ? 'ĐÃ XUẤT BẢN' : 'CHƯA VIẾT';
  const chapters = book.chapters.map((title, i) => `${i + 1}. ${title}`).join('\n');
  return `### Quyển ${book.vol} — ${book.title} (${book.chapters.length} chương) — ${status}\n\n` +
    `- Slug: \`${book.slug}\`\n- Phụ đề: ${book.subtitle}\n- Màu bìa: \`${book.color}\`\n\n${chapters}`;
}).join('\n\n');

const prompt = `# PROMPT BÀN GIAO — BỘ SÁCH KỸ NĂNG TOÀN DIỆN

> Sao chép toàn bộ file này vào Claude Code. Đây vừa là prompt thực thi vừa là
> nguồn phạm vi đầy đủ cho bộ sách. Không tự rút gọn danh mục hoặc đổi số quyển.

## Vai trò và mục tiêu

Bạn đang tiếp tục viết **Bộ Kỹ năng toàn diện** trên website CuongThai Books.
Bộ này có chính xác **${SKILL_SERIES_TOTALS.volumes} quyển / ${SKILL_SERIES_TOTALS.chapters} chương**, đánh số **26–41**.
Mục tiêu dài hạn là xuất bản lần lượt từng quyển bằng tiếng Việt, giữ thuật ngữ
tiếng Anh khi cần, với nội dung dùng được trong công việc, phỏng vấn, học tập,
lãnh đạo, kinh doanh và đời sống.

Ba quyển 26–28 đã được xuất bản. Hãy tiếp tục từ **quyển 29** và chỉ đánh dấu
một quyển là hoàn thành khi toàn bộ chương của quyển đó có nội dung thật, ví dụ,
bài tập và checkpoint. Ưu tiên hoàn thành một quyển chất lượng thay vì tạo nhiều
file rỗng.

## Việc phải làm trước khi sửa

1. Đọc toàn bộ \`AGENTS.md\` ở root và tuân thủ mọi giới hạn của dự án.
2. Chạy \`git status --short\`; thay đổi đang có là của người dùng, không được
   ghi đè hoặc hoàn tác.
3. Đọc các file nguồn sự thật:
   - \`frontend/scripts/skill-books-plan.mjs\`
   - \`frontend/scripts/generate-skill-books.mjs\`
   - \`frontend/src/app/books/booksData.ts\`
   - \`frontend/src/app/books/LibraryClient.tsx\`
   - \`frontend/src/app/books/[slug]/page.tsx\`
4. Mở ít nhất một sách đã xuất bản, ví dụ
   \`frontend/public/books/27-tu-duy-phan-bien-va-giai-quyet-van-de.html\`, để
   kiểm tra cấu trúc HTML thật và giao diện đọc.

## Trạng thái hiện tại

- Thư viện kỹ thuật cũ: 25 quyển, số 01–25.
- Bộ kỹ năng: 16 quyển, số 26–41.
- Đã xuất bản: 26, 27, 28 (${SKILL_SERIES_TOTALS.publishedChapters} chương).
- Chưa viết: 29–41.
- Ba file HTML đã xuất bản được sinh bởi
  \`node frontend/scripts/generate-skill-books.mjs\`.
- Bìa là CSS 3D bọc vải/ép nhũ trong trang \`/books\`; **không tạo ảnh bìa
  raster** nếu không có yêu cầu mới.
- Sách kỹ năng viết gốc bằng tiếng Việt (\`<html lang="vi">\`), nên trình đọc
  tự ẩn nút EN/EN+VI/VI. Sách kỹ thuật cũ vẫn giữ song ngữ như trước.

## Chuẩn nội dung bắt buộc cho từng chương

Mỗi chương phải có tối thiểu:

1. Bản chất và định nghĩa bằng hành vi quan sát được.
2. Vì sao cần kỹ năng này trong công việc, phỏng vấn, học tập và đời sống.
3. Một framework/quy trình 3–6 bước có giải thích.
4. Ít nhất một tình huống thực tế có bối cảnh, hành động và kết quả.
5. So sánh cách làm yếu với cách làm trưởng thành.
6. Sai lầm và hiểu nhầm thường gặp.
7. Worksheet có thể điền ngay.
8. Ít nhất 8 bài tập chia cơ bản, ứng dụng, thực chiến.
9. Ít nhất 3 checkpoint kèm đáp án.
10. Thử thách 7 ngày hoặc kế hoạch 30 ngày.
11. Cách biến kỹ năng thành bằng chứng dùng trong CV/phỏng vấn/portfolio.

Không dùng lời khuyên rỗng như “hãy cố gắng”, “hãy tích cực”, “giao tiếp tốt
hơn”. Mọi lời khuyên phải trả lời được: **làm gì, trong tình huống nào, quan sát
kết quả bằng gì, sai thì điều chỉnh ra sao**.

## Chuẩn biên tập

- Viết tiếng Việt tự nhiên; giữ English term trong ngoặc khi nó giúp tra cứu.
- Giọng điệu tỉnh táo, thực tế, không lên lớp và không hứa chắc chắn thành công.
- Phân biệt dữ kiện, suy luận, kinh nghiệm và ý kiến.
- Không bịa nghiên cứu, số liệu, case khách hàng hoặc trích dẫn.
- Với y tế, pháp lý, tài chính: chỉ viết kiến thức giáo dục phổ thông, nêu giới
  hạn và khuyên tìm chuyên gia phù hợp khi quyết định có rủi ro cao.
- Nếu dùng thông tin có thể thay đổi, tra nguồn sơ cấp/chính thức và ghi link.
- Ví dụ phải đa dạng: cá nhân, nhân viên, kỹ sư, quản lý, freelancer, người làm
  sản phẩm và chủ doanh nghiệp; tránh biến toàn bộ sách thành ví dụ lập trình.
- Không sao chép cùng một đoạn cho nhiều chương. Khung có thể nhất quán nhưng
  luận điểm, tình huống, lỗi và bài tập phải riêng cho kỹ năng đó.

## Quy trình xuất bản một quyển mới

1. Trong \`skill-books-plan.mjs\`, giữ nguyên số, slug, tiêu đề, số chương và
   màu. Chưa đổi \`published\` thành \`true\`.
2. Thêm một mảng \`GUIDES['NN']\` vào
   \`generate-skill-books.mjs\`, đúng một guide cho mỗi chương. Mỗi guide phải
   có luận điểm, framework, tình huống, sai lầm và cách dùng khi phỏng vấn.
3. Thêm nguồn đáng tin vào \`SOURCES['NN']\`.
4. Chạy generator trong lúc \`published\` vẫn false bằng cách tạm chỉ định
   quyển hoặc hoàn thiện guide trước; cuối cùng mới đổi \`published: true\` và
   chạy lại toàn bộ generator. Generator phải kết thúc không lỗi đếm guide.
5. Đọc file HTML sinh ra, kiểm:
   - số \`.toc-row\` = số chương;
   - số \`.chap-open\` = số chương;
   - mỗi chương có 8 \`.ex-row\`;
   - không có heading rỗng, placeholder, “TODO” hoặc nội dung lặp vô lý.
6. Thêm sách vào \`SKILL_BOOKS\` trong \`booksData.ts\`, đồng thời xóa đúng
   sách đó khỏi \`SKILL_BOOKS_UPCOMING\`.
7. Thêm slug vào \`generateStaticParams()\` trong
   \`frontend/src/app/books/[slug]/page.tsx\`.
8. Cập nhật số liệu thư viện bằng số đếm thật. Không đoán word count.
9. Chạy:
   - \`cd frontend && npx tsc --noEmit\`
   - \`cd frontend && npm run build\`
10. Mở \`/books\` và sách mới trong trình duyệt; kiểm desktop, mobile, bìa,
    mục lục, nhảy chương, thanh tiến độ, dark/light và console.

## Definition of Done cho một quyển

- Tất cả chương có nội dung riêng và đủ cấu trúc sư phạm.
- HTML tự chứa, đọc offline; chỉ font có thể rơi về system font.
- Bìa xuất hiện đúng kệ, không có link 404.
- Trình đọc nhận đúng tiêu đề và toàn bộ mục lục.
- Nội dung hiển thị tiếng Việt, không cố tải file dịch \`.vi.json\`.
- TypeScript và Next.js build đều xanh.
- \`git status\` không có file build hoặc file môi trường ngoài ý muốn.
- Không push, deploy hoặc commit nếu người dùng chưa yêu cầu riêng.

## Toàn bộ danh mục 16 quyển / 237 chương

${catalog}

## Thứ tự ưu tiên nếu người dùng không chỉ định

Viết tuần tự 29 → 33 trước vì đây là nhóm dùng thường xuyên nhất trong mọi
nghề: thời gian, giao tiếp, teamwork, dự án và leadership. Sau đó viết 35 → 38
để nối từ sản phẩm đến kiếm tiền và vận hành doanh nghiệp. Quyển 34 về lập trình
có thể tận dụng 25 quyển kỹ thuật hiện có nhưng không được chỉ dẫn lại bằng
liên kết; nó phải dạy tư duy nghề nghiệp tích hợp. Cuối cùng hoàn thiện 39–41.

Khi kết thúc một phiên, cập nhật rõ trong file bàn giao hoặc báo cáo: quyển nào
đã hoàn thành, số chương, số bài tập, số từ thật, file đã đổi, kiểm tra đã chạy
và quyển tiếp theo. Không đánh dấu hoàn thành chỉ vì đã tạo skeleton.
`;

mkdirSync(path.dirname(target), { recursive: true });
writeFileSync(target, prompt);
console.log(`generated ${path.relative(root, target)}`);

