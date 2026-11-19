/**
 * Bên trong cuongthai.com — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 19/11/2026 theo yêu cầu người dùng
 * ("thiếu gì cứ bổ sung và tạo khung trước"): khoá "kinh nghiệm thật" — đọc hiểu một hệ thống ĐANG CHẠY (web + API +
 * DB + R2 + deploy + agent AI) thay vì ví dụ đồ chơi. Người học chưa có kinh nghiệm đi làm ⇒ đây là phần bù.
 * ⛔ AN TOÀN: bài CHỈ dạy kiến trúc, quyết định và bài học ở mức nguyên tắc. KHÔNG đưa IP, cổng, tên container, cấu hình
 * tường lửa, đường dẫn bí mật, khoá, tên bảng nhạy cảm, lỗ hổng chưa vá. Sự cố trong docs/so-loi.md chỉ kể khi đã vá,
 * bỏ mọi chi tiết khai thác được. Mã trích phải qua gitleaks + đọc lại bằng mắt.
 * Soạn theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'inside-cuongthai',
    title: 'Inside cuongthai.com — a real production system',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/inside-cuongthai.png?v=1',
    shortDescription: 'Real-world experience without a job yet: read, run and reason about a production system that thousands use — architecture, codebase tour, data model, storage, deploy pipeline, AI agents, incidents and the trade-offs behind every decision.',
    description: 'Sinh viên hay thiếu đúng một thứ khi đi phỏng vấn: chưa từng nhìn thấy một hệ thống thật chạy ra sao. Khoá này lấy chính cuongthai.com (Next.js + Express/TypeScript + PostgreSQL/Prisma + Redis + Cloudflare R2 + Docker trên VPS + agent AI) làm giáo trình: đọc kiến trúc tổng thể, đi tour codebase lớn, lần theo một request từ trình duyệt tới DB, đọc mô hình dữ liệu, cách lưu tệp, cách deploy không gián đoạn, cách giám sát, cách làm việc cùng agent AI, và những sự cố thật đã xảy ra cùng bài học rút ra. Mỗi chương có bài tập "tự làm trên bản chạy cục bộ" để biến hiểu biết thành kinh nghiệm kể được khi phỏng vấn.',
    whatYouLearn: 'Đọc hiểu một codebase lớn mà không bị ngợp; vẽ sơ đồ kiến trúc của một hệ thống thật; lần theo request đầu-cuối; đọc schema và migration; hiểu pipeline deploy và rollback; đọc log/sổ lỗi để tìm nguyên nhân; giải thích các đánh đổi kỹ thuật; kể lại kinh nghiệm này trong CV và phỏng vấn.',
    requirements: 'Đã học nền: Git, TypeScript/Node.js hoặc Java, SQL cơ bản, HTTP/REST, Docker cơ bản. Nên học song song khoá Agile & Teamwork và AI Coding.',
    documentsNote: 'Tài liệu chính: mã nguồn và tài liệu nội bộ của cuongthai.com (đã lọc phần nhạy cảm) • "The Pragmatic Programmer" • "Working Effectively with Legacy Code" (Feathers) • Google SRE Book (chương postmortem) • C4 model (c4model.com).',
  },
  sections: khung('inside-cuongthai', [
    ['Section 0 — Why study a real system', 'Mục 0 — Vì sao học từ một hệ thống thật', 'Thứ sinh viên thiếu nhất khi đi làm, và cách khoá này bù.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What "real experience" means to an employer', 'Bắt đầu tại đây (1/2) — "Kinh nghiệm thật" nghĩa là gì với nhà tuyển dụng', 'Đồ án vs hệ thống có người dùng · Những câu phỏng vấn bạn sẽ trả lời được'],
      ['bat-dau-cach-hoc', 'Start here (2/2) — How to study this course without getting lost', 'Bắt đầu tại đây (2/2) — Học khoá này thế nào để không bị ngợp', 'Đọc từ ngoài vào trong · Chạy cục bộ trước · Ghi sổ tay kiến trúc'],
      ['chay-cuc-bo', 'Running the whole stack locally (safely)', 'Chạy toàn bộ hệ thống trên máy (an toàn)', 'docker compose · biến môi trường mẫu · storage sandbox, email sandbox'],
    ]],
    ['Chapter 1 — The big picture', 'Chương 1 — Bức tranh tổng', 'Hệ thống gồm những khối nào và nói chuyện với nhau ra sao.', [
      ['so-do', 'Architecture diagram: frontend, API, database, cache, storage, workers', 'Sơ đồ kiến trúc: frontend, API, DB, cache, lưu trữ, worker', 'C4 mức context và container · Vẽ lại bằng tay'],
      ['mot-request', 'Following one request end to end', 'Lần theo một request từ đầu tới cuối', 'Trình duyệt → CDN → reverse proxy → Next.js → Express → Prisma → PostgreSQL'],
      ['quyet-dinh', 'Why these technologies — the trade-offs', 'Vì sao chọn các công nghệ này — những đánh đổi', 'Monolith có module · VPS thay vì cloud lớn · R2 thay vì S3'],
    ]],
    ['Chapter 2 — Touring a large codebase', 'Chương 2 — Đi tour một codebase lớn', 'Hàng nghìn tệp: bắt đầu đọc từ đâu.', [
      ['cau-truc', 'Folder structure and module boundaries', 'Cấu trúc thư mục và ranh giới module', 'routes → services → Prisma · frontend app router'],
      ['doc-code-la', 'Reading code you did not write', 'Đọc code không phải của mình', 'grep, go-to-definition, git blame, git log -p · Đọc test trước'],
      ['quy-uoc', 'Conventions, docs and the project rulebook', 'Quy ước, tài liệu và sổ luật dự án', 'CLAUDE.md, docs/, sổ lỗi · Vì sao luật được viết bằng máu'],
      ['bai-tap-1', 'Exercise — Map one feature from button to table', 'Bài tập — Vẽ đường đi của một tính năng từ nút bấm tới bảng DB', 'Đạt khi: sơ đồ + danh sách tệp + giải thích'],
    ]],
    ['Chapter 3 — Data model and migrations', 'Chương 3 — Mô hình dữ liệu và migration', 'Schema thật lớn lên theo thời gian thế nào.', [
      ['schema', 'Reading a large Prisma schema', 'Đọc một schema Prisma lớn', 'Quan hệ · back-relation · @@unique đặt tên · enum'],
      ['migration', 'Migrations in production: what can go wrong', 'Migration trên production: điều gì có thể hỏng', 'Không bao giờ migrate reset · Migration viết tay · Drift'],
      ['du-lieu-lich-su', 'Data has history: code is not the whole truth', 'Dữ liệu có lịch sử: mã không phải toàn bộ sự thật', 'Hỏi dữ liệu thay vì đoán từ mã'],
    ]],
    ['Chapter 4 — Files, media and storage', 'Chương 4 — Tệp, media và lưu trữ', 'Ảnh, video, tài liệu đi đâu và về đâu.', [
      ['luu-tru', 'Object storage and presigned URLs in practice', 'Object storage và URL ký sẵn trong thực tế', 'Liên kết khoá AWS Ch.2 · CDN phía trước'],
      ['video', 'A video pipeline: from script to the lesson page', 'Đường đi của một video: từ kịch bản tới trang bài học', 'Soạn → giọng → render → R2 → gắn web'],
      ['sandbox', 'Keeping tests away from production storage', 'Giữ test tránh xa kho dữ liệu thật', 'Storage sandbox · dây bẫy trong test'],
    ]],
    ['Chapter 5 — Deploying without breaking things', 'Chương 5 — Deploy mà không làm vỡ', 'Từ commit tới production.', [
      ['pipeline', 'The deploy pipeline step by step', 'Pipeline deploy từng bước', 'Build ảnh → đẩy registry → tráo container → smoke test'],
      ['smoke-rollback', 'Smoke tests, rollback and stale builds', 'Smoke test, quay lui và build cũ', '404 = route chưa mount · Khôi phục nhanh'],
      ['ha-tang-ngoai-anh', 'Config that lives outside the image', 'Cấu hình nằm ngoài ảnh', 'Bind mount, biến môi trường · "đã ghi" ≠ "đã có hiệu lực"'],
    ]],
    ['Chapter 6 — Running in production', 'Chương 6 — Vận hành trên production', 'Giám sát, cảnh báo và đĩa đầy lúc 3 giờ sáng.', [
      ['giam-sat', 'Health checks, logs and alerts', 'Kiểm tra sức khoẻ, log và cảnh báo', 'Cảnh báo qua Telegram · Đọc log trước khi đoán'],
      ['tai-nguyen', 'Disk, memory and the noisy neighbour', 'Đĩa, RAM và hàng xóm ồn ào', 'Build cache đầy đĩa · Hai deploy chồng nhau hết RAM'],
      ['chi-phi', 'Cost: paying only for what you use', 'Chi phí: chỉ trả cho thứ mình dùng', 'Máy thuê theo đợt · Trần chi phí LLM'],
    ]],
    ['Chapter 7 — Working with AI agents in a real repo', 'Chương 7 — Làm việc với agent AI trong một repo thật', 'Người làm 3, AI làm 7 — và người phải giữ phần 3.', [
      ['agent-thuc-te', 'How agents write, review and deploy here', 'Agent viết, soát và deploy ở đây thế nào', 'Prompt có quy trình · Bộ kiểm tự động · Người duyệt cuối'],
      ['loi-cua-ai', 'Mistakes AI made and how they were caught', 'Những lỗi AI từng mắc và cách bắt được', 'Bịa API · Bỏ sót tệp · Báo xong khi chưa xong'],
      ['gioi-han', 'Guardrails: what an agent must never do', 'Hàng rào: những việc agent không bao giờ được làm', 'Bí mật · Xoá dữ liệu · Push không duyệt'],
    ]],
    ['Chapter 8 — Incidents and postmortems', 'Chương 8 — Sự cố và postmortem', 'Học từ những lần hệ thống thật sự hỏng.', [
      ['postmortem', 'How to write a blameless postmortem', 'Viết postmortem không đổ lỗi', 'Triệu chứng · nguyên nhân · cách sửa · bài học'],
      ['su-co', 'Five real incidents, retold safely', 'Năm sự cố thật, kể lại an toàn', 'Phiên hết hạn câm · Seed vỡ vì enum · Header cache bị nuốt…'],
      ['bai-tap-2', 'Exercise — Diagnose an incident from logs', 'Bài tập — Chẩn đoán sự cố từ log', 'Đạt khi: chỉ đúng nguyên nhân + đề xuất phòng'],
    ]],
    ['Chapter 9 — Turning this into experience', 'Chương 9 — Biến khoá học thành kinh nghiệm', 'Kể lại được, chứng minh được.', [
      ['cv', 'Writing it on your CV honestly', 'Ghi vào CV một cách trung thực', 'Bạn đã làm gì · Không nhận vơ'],
      ['phong-van', 'Interview questions this course prepares you for', 'Câu phỏng vấn khoá này giúp bạn trả lời', 'Kể một sự cố · Một đánh đổi · Một lần đọc code lạ'],
      ['quiz', 'Final quiz', 'Bài kiểm tra cuối khoá', '15 câu tổng hợp'],
    ]],
  ]),
};
