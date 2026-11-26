/**
 * Mục 0 — Bắt đầu tại đây (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 5 bài học/lab (0.1–0.5) trong ./s00/ và bài kiểm tra 12 câu (0.6, dm5-0-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s00/b1-bat-dau-1.mjs';
import B2 from './s00/b2-bat-dau-2.mjs';
import B3 from './s00/b3-ban-do-labflow.mjs';
import B4 from './s00/b4-dung-cong-ty-mot-nguoi.mjs';
import B5 from './s00/b5-lab.mjs';

const QUIZ0 = [
  Q('dm5-0-q1',
    'How does this course relate to Academy SWP391 and Courses like Spring Boot / React?|||Khoá học này có quan hệ thế nào với Academy SWP391 và các khoá Spring Boot / React?',
    [
      'It replaces all technical courses so you never need to study Spring Boot or React|||Nó thay thế toàn bộ khoá kỹ thuật nên bạn không cần học Spring Boot hay React',
      'It copies the entire LabFlow code so you can submit it directly|||Nó chép sẵn toàn bộ code LabFlow để bạn nộp trực tiếp',
      'It acts as the orchestration thread teaching how 1 person operates all 5 roles (C1–C5) across planning, docs, code workflow, QA, and defense, linking out to specialist courses without duplicating them|||Nó là sợi chỉ điều phối dạy 1 người vận hành đủ 5 vai (C1–C5) từ kế hoạch, hồ sơ, quy trình code, QA tới bảo vệ, dẫn link sang khoá chuyên môn mà không lặp lại',
      'It only covers theoretical Scrum definitions for multiple-choice exams|||Nó chỉ dạy định nghĩa Scrum lý thuyết để thi trắc nghiệm',
    ],
    2,
    'This course avoids duplication: technical depth stays in Spring Boot/React/Testing/SWP391, while this course teaches the 5-role project operations playbook on LabFlow. Lesson 0.1.|||Khoá này giữ luật không trùng: kiến thức kỹ thuật nằm ở Spring Boot/React/Testing/SWP391, còn khoá này dạy quy trình vận hành dự án 5 vai trên LabFlow. Bài 0.1.'),

  Q('dm5-0-q2',
    'What is the core lesson of the NASA Mars Climate Orbiter (1999) and Knight Capital (2012) incidents for a solo 5-role project?|||Bài học cốt lõi từ sự cố NASA Mars Climate Orbiter (1999) và Knight Capital (2012) cho đồ án 1 mình 5 vai là gì?',
    [
      'Solo developers never face integration or deployment bugs|||Người làm một mình không bao giờ gặp lỗi tích hợp hay triển khai',
      'Even great code fails catastrophically without explicit interface contracts, checklists, and independent verification under a separate QA/review hat|||Ngay cả code tốt cũng có thể sập nghiêm trọng nếu thiếu hợp đồng giao diện rõ ràng, checklist và bước kiểm chứng độc lập dưới mũ QA/review riêng',
      'You should skip documentation to save time for coding|||Nên bỏ tài liệu để dành thời gian code',
      'Microservices would have prevented both failures automatically|||Microservices sẽ tự động ngăn được cả hai sự cố',
    ],
    1,
    'Mars Climate Orbiter failed from a unit mismatch across an unverified interface; Knight Capital missed 1 of 8 servers during a manual deploy without a verification checklist. Lesson 0.1.|||Mars Climate Orbiter hỏng vì lệch đơn vị qua giao diện không được kiểm chứng; Knight Capital sót 1/8 máy chủ khi triển khai tay thiếu checklist xác minh. Bài 0.1.'),

  Q('dm5-0-q3',
    'Why does the solo 5-role method require a cooling-off gap (1–24 hours) between coding under C3/C4 and reviewing/testing under C5?|||Vì sao phương pháp 1 mình 5 vai yêu cầu một khoảng nghỉ (1–24 giờ) giữa lúc code dưới mũ C3/C4 và lúc review/test dưới mũ C5?',
    [
      'Because GitHub blocks PR reviews for 24 hours|||Vì GitHub khoá review PR trong 24 giờ',
      'To weaken author/ownership bias so you inspect your own work with fresh, sceptical eyes instead of glossing over mistakes|||Để giảm thiên kiến của tác giả với sản phẩm mình làm, giúp bạn soi lại bài của mình bằng đôi mắt mới và hoài nghi hơn thay vì lướt qua lỗi',
      'To artificially increase logged hours on the Weekly Report|||Để tăng giả tạo số giờ trên Weekly Report',
      'Because PostgreSQL needs 24 hours to rebuild indexes|||Vì PostgreSQL cần 24 giờ để dựng lại chỉ mục',
    ],
    1,
    'Author/ownership bias makes you forgive flaws right after writing code; a cooling-off interval + a separate browser profile/checklist creates real separation of duties. Lesson 0.2.|||Thiên kiến của tác giả với sản phẩm mình làm khiến bạn dễ bỏ qua lỗi ngay sau khi vừa code; khoảng nghỉ + profile trình duyệt/checklist riêng tạo ra sự tách biệt trách nhiệm thật sự. Bài 0.2.'),

  Q('dm5-0-q4',
    'Which practice complies with the Academic Honesty Rule when practicing 5 roles solo on CT Work and GitHub?|||Cách làm nào tuân thủ đúng Luật Trung Thực Học Thuật khi tự luyện 5 vai trên CT Work và GitHub?',
    [
      'Create 5 fake GitHub accounts with different student names so the commit graph looks like a 5-person team|||Tạo 5 tài khoản GitHub giả với tên 5 sinh viên khác nhau để biểu đồ commit trông như nhóm 5 người',
      'Copy a senior team\'s Report 3 SRS and Find-and-Replace their project name with LabFlow|||Lấy Report 3 SRS của nhóm khoá trước rồi Find-and-Replace tên dự án thành LabFlow',
      'Declare "1 person playing 5 roles" openly on CT Work/docs, use 1 real Git identity on GitHub, and tag roles via branch/commit prefixes and CT Work cards|||Công khai "1 người đóng 5 vai" trên CT Work/tài liệu, dùng 1 danh tính Git thật trên GitHub, phân biệt vai qua tiền tố nhánh/commit và thẻ CT Work',
      'Hide AI usage from the Weekly Report so the lecturer thinks you never asked questions|||Giấu việc dùng AI khỏi Weekly Report để giảng viên tưởng bạn không bao giờ hỏi AI',
    ],
    2,
    'Never forge Git identities or copy sample reports. Declare solo 5-role transparently, keep one real Git identity, and log AI mentor usage honestly in Template5. Lesson 0.2 & 0.4.|||Không bao giờ giả danh tính Git hay chép báo cáo mẫu. Công khai 1 người 5 vai, giữ một danh tính Git thật và ghi nhận việc dùng AI mentor trung thực trong Template5. Bài 0.2 & 0.4.'),

  Q('dm5-0-q5',
    'According to the Stanford study (Perry et al., ACM CCS 2023) cited in Lesson 0.2, what is the hidden danger of copying AI-generated code without hand-coding and verifying it?|||Theo nghiên cứu của Đại học Stanford (Perry et al., ACM CCS 2023) nêu ở Bài 0.2, nguy cơ ngầm khi chép code AI mà không tự gõ và kiểm chứng là gì?',
    [
      'AI code never compiles|||Code AI không bao giờ biên dịch được',
      'Users with AI assistants wrote less secure code yet felt MORE confident that their code was secure|||Người dùng có trợ lý AI tạo ra mã kém an toàn hơn nhưng lại TỰ TIN HƠN rằng mã mình an toàn',
      'AI always refuses to write Spring Boot controllers|||AI luôn từ chối viết controller Spring Boot',
      'It makes Git repositories too small|||Nó làm kho Git quá nhỏ',
    ],
    1,
    'False confidence + hidden security bugs (such as missing backend @PreAuthorize or race conditions) is why LabFlow enforces 100% hand-coding and using AI strictly as a mentor/reviewer. Lesson 0.2.|||Sự tự tin ảo + lỗ hổng bảo mật ngầm (như quên @PreAuthorize ở backend hay lỗi tranh chấp) là lý do LabFlow giữ luật tự code tay 100% và chỉ dùng AI làm mentor/phản biện. Bài 0.2.'),

  Q('dm5-0-q6',
    'You have a heavy exam week and only 14 hours available for LabFlow. What does the anti-burnout rule recommend?|||Tuần này bạn dính lịch thi nặng và chỉ còn 14 giờ cho LabFlow. Luật chống kiệt sức khuyên bạn làm gì?',
    [
      'Pull two all-nighters in a row and skip Sunday rest|||Thức trắng hai đêm liên tiếp và bỏ nghỉ Chủ nhật',
      'Skip writing tests and drag unfinished cards straight to Done|||Bỏ viết test và kéo thẻ chưa xong thẳng sang Done',
      'Keep WIP ≤ 2, cut P2 scope explicitly in CT Work with a documented reason, and protect sleep/Sunday rest|||Giữ WIP ≤ 2, chủ động cắt hạng mục P2 trên CT Work kèm lý do rõ ràng, giữ giấc ngủ và ngày nghỉ Chủ nhật',
      'Stop logging Daily/Weekly reports until the exam week ends|||Dừng ghi Daily/Weekly Report cho tới khi thi xong',
    ],
    2,
    'Cut low-priority scope visibly rather than cutting sleep or quality — real PMs manage scope transparently instead of hiding delays. Lesson 0.2.|||Cắt phạm vi ưu tiên thấp một cách minh bạch thay vì cắt giấc ngủ hay chất lượng — PM thật quản lý phạm vi công khai thay vì giấu trễ. Bài 0.2.'),

  Q('dm5-0-q7',
    'In the 20-minute LabFlow reading route (Lesson 0.3), which item is LOCKED and which item MUST be confirmed with your lecturer in Week 1 via a Q&A card?|||Trong đường đọc 20 phút LabFlow (Bài 0.3), mục nào ĐÃ CHỐT và mục nào BẮT BUỘC phải hỏi giảng viên xác nhận ở Tuần 1 qua thẻ Q&A?',
    [
      'Locked: MySQL; Ask lecturer: whether to use Git|||Đã chốt: MySQL; Hỏi GV: có nên dùng Git không',
      'Locked: Modular monolith ("monolith-first") + 100% hand-coded; Ask lecturer: PostgreSQL approval (vs SWP391 MySQL policy), MaxLOC table, and BR-01..14 numbers|||Đã chốt: Modular monolith ("monolith-first") + tự code tay 100%; Hỏi GV: duyệt dùng PostgreSQL (so với policy MySQL), bảng MaxLOC và các con số BR-01..14',
      'Locked: Microservices with 10 services; Ask lecturer: colour of the logo|||Đã chốt: Microservices 10 dịch vụ; Hỏi GV: màu logo',
      'Everything on /projects/labflow-ai is locked university law; nothing needs lecturer confirmation|||Mọi thứ trên /projects/labflow-ai đều là luật cứng của trường; không cần hỏi GV gì cả',
    ],
    1,
    'Never treat proposed BR numbers or stack exceptions as automatically approved — log Week-1 Q&A cards with fallback options (e.g., MySQL UNIQUE constraint if PostgreSQL is rejected). Lesson 0.3.|||Đừng mặc định số BR đề xuất hay ngoại lệ stack đã được duyệt — luôn tạo thẻ Q&A Tuần 1 kèm phương án dự phòng (vd ràng buộc UNIQUE trên MySQL nếu bị từ chối PostgreSQL). Bài 0.3.'),

  Q('dm5-0-q8',
    'In SWP391 LOC grading on LabFlow, a Medium (M = 120 LOC) screen works on the happy path only (Quality L1) instead of covering unhappy cases (Quality L2). What happens?|||Theo luật chấm LOC SWP391 trên LabFlow, một màn Medium (M = 120 LOC) chỉ chạy happy path (Quality L1) thay vì có đủ unhappy case (Quality L2). Điều gì xảy ra?',
    [
      'It still earns 100% (120 LOC) as long as the UI looks nice|||Vẫn được 100% (120 LOC) miễn giao diện đẹp',
      'It drops to 50% (60 LOC) instead of 75% (90 LOC) — losing a quarter of the screen\'s base value right away|||Nó tụt xuống 50% (60 LOC) thay vì 75% (90 LOC) — mất ngay một phần tư điểm gốc của màn hình',
      'It is automatically upgraded to Complex (240 LOC)|||Nó tự động được nâng lên Complex (240 LOC)',
      'Quality level only matters in Iteration 3|||Mức chất lượng chỉ tính ở Iteration 3',
    ],
    1,
    'Golden rule of LabFlow & SWP391: bring every screen to at least Quality L2 (1 happy + ≥ 3 unhappy cases) before starting the next screen. Lesson 0.3.|||Luật vàng của LabFlow & SWP391: đưa mọi màn hình đạt tối thiểu Quality L2 (1 happy + ≥ 3 unhappy case) rồi mới sang màn mới. Bài 0.3.'),

  Q('dm5-0-q9',
    'What is the difference between a Defect and a Leakage in LabFlow / SWP391?|||Defect và Leakage khác nhau thế nào trong LabFlow / SWP391?',
    [
      'Defect is a backend bug; Leakage is a frontend bug|||Defect là lỗi backend; Leakage là lỗi frontend',
      'Defect is found by your own team/QA before submission; Leakage is found by the lecturer/client AFTER submission and must be fixed first in the next iteration|||Defect do chính nhóm/QA tự tìm ra trước khi nộp; Leakage do giảng viên/khách phát hiện SAU khi nộp và phải ưu tiên sửa đầu tiên ở iteration sau',
      'Leakage only refers to memory leaks in Java|||Leakage chỉ là lỗi rò rỉ bộ nhớ trong Java',
      'There is no difference; they are synonyms|||Không khác nhau; là hai từ đồng nghĩa',
    ],
    1,
    'Catching bugs yourself as Defects under the C5 QA hat protects your score; letting bugs slip to the lecturer creates penalised Leakage. Lesson 0.3.|||Tự bắt lỗi dạng Defect dưới mũ QA C5 giúp bảo vệ điểm; để lọt lỗi tới tay giảng viên sẽ thành Leakage bị trừ điểm. Bài 0.3.'),

  Q('dm5-0-q10',
    'Why should you enable GitHub Branch Protection (including "Do not allow bypassing" for admins) on main even when working completely alone?|||Vì sao bạn vẫn nên bật Branch Protection trên GitHub (kèm tuỳ chọn không cho admin vượt qua) cho nhánh main ngay cả khi làm một mình?',
    [
      'It automatically backs up your local database every night|||Nó tự động sao lưu cơ sở dữ liệu dưới máy bạn mỗi đêm',
      'It protects main from your own tired late-night self, forcing every change through a PR (and automated CI checks once CI is set up in Chapter 6)|||Nó bảo vệ main khỏi chính bạn lúc khuya mệt mỏi, ép mọi thay đổi phải đi qua PR (và bước kiểm CI tự động sau khi dựng CI ở Chương 6)',
      'It automatically writes your Weekly Report|||Nó tự động viết Weekly Report',
      'It hides your commit history from lecturers|||Nó giấu lịch sử commit khỏi giảng viên',
    ],
    1,
    'Server-side branch protection (available on private repos with GitHub Student Pack/Pro, or on PII-free public repos / GitLab Free) is the real lock; client-side hooks are only seatbelt reminders. Lesson 0.4 & Lab 0.5.|||Bảo vệ nhánh phía máy chủ (hỗ trợ kho private khi có GitHub Student Pack/Pro, hoặc trên kho public không PII / GitLab Free) mới là ổ khoá thật; hook dưới máy chỉ là tiếng nhắc thắt dây an toàn. Bài 0.4 & Lab 0.5.'),

  Q('dm5-0-q11',
    'You accidentally committed .env containing your database password and pushed it, then deleted .env in the very next commit. What is true?|||Bạn lỡ commit tệp .env chứa mật khẩu CSDL và push lên, rồi xoá .env ở ngay commit kế tiếp. Điều nào đúng?',
    [
      'The password is completely safe because the latest commit no longer has .env|||Mật khẩu hoàn toàn an toàn vì commit mới nhất không còn .env',
      'The secret is STILL exposed in Git history — treat it as leaked, rotate the credentials immediately, and scrub history if needed|||Bí mật VẪN nằm trong lịch sử Git — phải coi như đã lộ, đổi ngay mật khẩu/khoá và dọn lịch sử nếu cần',
      'Adding .env to .gitignore afterwards automatically erases past commits|||Thêm .env vào .gitignore sau đó sẽ tự xoá các commit cũ',
      'Private repositories never need credential rotation|||Kho private không bao giờ cần đổi lại bí mật đã lộ',
    ],
    1,
    'Git keeps every historical snapshot. The Toyota T-Connect (2022) incident shows why you must never leave access keys in public repos, scan for secrets before pushing, and rotate keys immediately upon leak — while .gitignore + .env.example on Commit #1 serve as preventive safeguards. Lesson 0.4.|||Git lưu mọi ảnh chụp lịch sử. Sự cố Toyota T-Connect (2022) cho thấy tuyệt đối không để khoá truy cập trong kho public, phải quét secret trước khi push và đổi khoá ngay khi lộ — còn .gitignore + .env.example từ Commit #1 là biện pháp phòng ngừa. Bài 0.4.'),

  Q('dm5-0-q12',
    'In Lab 0.5 (Day-0 Commissioning), why does C5 QA intentionally try to push directly to main and drag an empty-Evidence card to Done?|||Trong Lab 0.5 (Khai trương Ngày 0), vì sao mũ C5 QA cố tình thử push thẳng lên main và kéo thẻ trống Evidence sang Done?',
    [
      'To break the workspace so you have to rebuild it|||Để phá hỏng không gian làm việc cho bạn dựng lại',
      'Because an untested guardrail is just an assumption — commissioning proves branch protection and Done rules actually block mistakes before Week 1 starts|||Vì một hàng rào chưa từng thử nghiệm chỉ là giả định — nghiệm thu chứng minh bảo vệ nhánh và Done rules thật sự chặn lỗi trước khi Tuần 1 bắt đầu',
      'To generate extra commits for LOC grading|||Để tạo thêm commit tính điểm LOC',
      'Because CT Work only activates webhooks after a failed push|||Vì CT Work chỉ kích hoạt webhook sau một lần push lỗi',
    ],
    1,
    'Testing the smoke alarm before cooking catches silent misconfigurations (such as forgetting "Include administrators" on GitHub branch protection). Lab 0.5.|||Bấm thử chuông báo cháy trước khi nấu giúp phát hiện cấu hình sót (như quên tích "Include administrators" ở branch protection trên GitHub). Lab 0.5.'),
];

export default {
  title: 'Section 0 — Start Here|||Mục 0 — Bắt đầu tại đây',
  description: 'Mục khởi động trọn vẹn cho khoá Đồ án một mình đóng 5 vai: hiểu mô hình 1 người 5 vai cùng lịch sử/sự cố có nguồn, cách học nhịp 10+10 tuần, luật trung thực và tự code tay 100%, đường đọc bản đồ LabFlow AI trong 20 phút, dựng không gian CT Work + GitHub + lịch họp và bài Lab khai trương có rubric.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    {
      title: '0.6 — Section 0 Quiz|||0.6 — Kiểm tra Mục 0',
      slug: 'dm5-0-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười hai câu trắc nghiệm tình huống kiểm tra toàn bộ Mục 0: mô hình 1 người 5 vai, bài học từ sự cố thật, cơ chế đổi mũ, trung thực học thuật, bẫy code AI (Stanford/ACM CCS 2023), đường đọc LabFlow, luật LOC/Leakage, bảo vệ nhánh, bảo mật .env và nghiệm thu Ngày 0.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>0.6 — Check your Day-0 readiness</h2>
<p class="lead">Twelve scenario-based questions covering Lessons 0.1–0.5. Aim for at least 10/12 before starting Chapter 1 and Week 1 on LabFlow. Every explanation points back to the exact lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>0.6 — Kiểm tra độ sẵn sàng Ngày 0</h2>
<p class="lead">Mười hai câu hỏi tình huống bao trọn Bài 0.1–0.5. Hãy đặt mục tiêu đạt tối thiểu 10/12 trước khi sang Chương 1 và bắt đầu Tuần 1 của LabFlow. Mỗi giải thích đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ0 },
    },
  ],
};
