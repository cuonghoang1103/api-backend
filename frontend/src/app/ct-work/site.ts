/**
 * Dữ liệu trang chủ app CT Work (/ct-work) — giao diện dùng chung ở `components/appsite/*`.
 *
 * Mọi câu chữ đối chiếu với nguồn CÓ THẬT (17/11/2026):
 *  - mô tả App Store của CT Work (iTunes Lookup id 6824877696, bản 1.0.0 ngày 02/11/2026),
 *  - ios-app/CTWORK_APP_REVIEW_NOTES.md (Face ID, Siri, widget, xoá tài khoản 72 giờ, báo cáo/chặn…),
 *  - components/work/help/content.ts (65 bài trợ giúp — lời mời, vai trò, board, sprint, họp, thông báo),
 *  - components/work/help/videos.ts (12 tập video hướng dẫn = khoá CTW_COURSE_HREF),
 *  - commit "chore(ctwork-desktop): 1.0.x — …" (bản phát hành app máy tính; release GitHub không có ghi chú),
 *  - CLAUDE.md mục "Agent trong CT Work" và `aiTaiTro` (giới hạn AI).
 * CT Work KHÔNG có gói Pro riêng ⇒ không khai `pro`. Thêm tính năng mới thì sửa ở đây, đừng bịa số.
 */
import type { Metadata } from 'next';
import type { AppSite } from '@/components/appsite/types';
import { CTW_COURSE_HREF } from '@/components/work/help/videos';

const A = '/images/ct-work/app';

export const CTWORK_SITE: AppSite = {
  goc: '/ct-work',
  ten: 'CT Work',
  phuDe: 'Quản lý dự án cho nhóm',
  tieuDeLon: 'Việc của cả nhóm, gọn trong một app',
  moTa:
    'Lên sprint, kéo thẻ trên board, đăng tin cho cả nhóm, nhắn tin kiểu Messenger, họp, theo dõi code và hỏi CuongMini — trợ lý AI hiểu dự án của bạn. Viết riêng cho iPhone và iPad, đồng bộ tức thì với web và app máy tính.',
  icon: '/images/ct-work/ct-work-app-icon-512.png',
  // Nhận diện CT Work (public/images/ct-work/BRAND.md): Indigo = --w-accent, Azure = góc dưới-phải của gradient.
  mau: '#4f5bd5',
  mau2: '#2299e0',
  appStoreId: '6824877696',
  nenTang: 'iPhone & iPad · miễn phí',
  nutPhu: [
    { href: '/work', nhan: 'Dùng trên web' },
    { href: '/download/ct-work', nhan: 'App máy tính' },
  ],
  conSo: [
    { so: '65', nhan: 'bài trợ giúp chi tiết' },
    { so: '12', nhan: 'tập video hướng dẫn' },
    { so: '3', nhan: 'hệ điều hành có app máy tính' },
  ],
  diemNoi: [
    {
      emoji: '🧩',
      ten: 'Một chỗ cho cả nhóm',
      moTa: 'Board, sprint, bảng tin, chat, cuộc họp, tài liệu và code — không phải nhảy qua lại giữa năm công cụ.',
    },
    {
      emoji: '🐻',
      ten: 'CuongMini hiểu dự án',
      moTa: 'Hỏi về thẻ, tài liệu, sprint. CuongMini chỉ đề xuất — không gì thay đổi cho tới khi bạn bấm Apply.',
    },
    {
      emoji: '🎓',
      ten: 'Hợp với đồ án ở trường',
      moTa: 'Mẫu dự án SWP391, SWR302, SWT301, báo cáo kiểm thử theo mẫu FPT, vai trò Teacher cho giảng viên.',
    },
    {
      emoji: '🔄',
      ten: 'Ở đâu cũng dùng được',
      moTa: 'Cùng một tài khoản trên web, app máy tính, iPhone và iPad. Dữ liệu đồng bộ tức thì.',
    },
  ],
  tinhNang: [
    {
      id: 'board-sprint',
      emoji: '📋',
      ten: 'Board, backlog & sprint',
      ngan: 'Kéo thẻ qua các cột, xếp backlog, chạy sprint theo Scrum hoặc làm liên tục theo Kanban.',
      chiTiet: [
        'Board: trên iPhone chạm và giữ một thẻ rồi thả sang cột khác; trên web kéo thả như thường',
        'Backlog, sprint và danh sách thẻ có bộ lọc',
        'Lọc nhanh “chỉ việc của tôi”, theo loại thẻ hoặc theo người',
        'Tạo sprint, đặt mục tiêu, kết thúc sprint và dời việc chưa xong sang sprint sau',
        'Mẫu dự án sẵn: Blank, SWP391, SWR302, SWT301, Client và Team',
      ],
      anh: `${A}/iphone-01-01-board.webp`,
      anhIpad: `${A}/ipad-01-01-board.webp`,
    },
    {
      id: 'cuongmini',
      emoji: '🐻',
      ten: 'CuongMini — trợ lý AI',
      ngan: 'Hỏi “Hôm nay tôi nên làm gì?”, tóm tắt thẻ, tách việc con, soạn test case — ngay trong dự án.',
      chiTiet: [
        'Hỏi về thẻ, tài liệu và sprint của dự án bạn đang xem',
        'Thao tác một chạm trong thẻ: Summarize, Split into sub-tasks, Generate test cases, Review story quality',
        'Create with CuongMini: phác kế hoạch dự án từ một đoạn mô tả ngắn — không gì được tạo khi bạn chưa xem lại',
        'Câu trả lời có link mở thẳng tới thẻ được nhắc, gắn nhãn “AI-generated”, có nút Copy và Report',
        'App xin phép bạn trước câu hỏi đầu tiên. AI có thể sai — hãy kiểm lại điều quan trọng. Có giới hạn sử dụng',
      ],
      anh: `${A}/iphone-02-02-cuongmini.webp`,
      anhIpad: `${A}/ipad-03-03-cuongmini.webp`,
      nhan: 'Có giới hạn mỗi ngày',
    },
    {
      id: 'bang-tin',
      emoji: '📣',
      ten: 'Bảng tin nhóm',
      ngan: 'Đăng cập nhật cho cả không gian hoặc một dự án: chữ, ảnh, video, tệp và bình chọn.',
      chiTiet: [
        'Đăng cho toàn không gian làm việc hoặc riêng một dự án',
        'Thả sáu kiểu cảm xúc, bình luận và trả lời, @nhắc tên đồng đội',
        'Lưu bài để đọc sau; quản trị viên ghim bài quan trọng',
        'Bài mới hiện ngay, không phải tải lại',
      ],
      anh: `${A}/iphone-03-03-feed.webp`,
      anhIpad: `${A}/ipad-02-02-feed.webp`,
    },
    {
      id: 'tro-chuyen',
      emoji: '💬',
      ten: 'Chat nhóm & tin nhắn riêng',
      ngan: 'Kênh nhóm, nhóm riêng và tin nhắn 1–1 kiểu Messenger — chung hộp thư với web.',
      chiTiet: [
        'Kênh nhóm và nhóm riêng: ảnh, tệp, tin thoại, cảm xúc, @nhắc, ghim và chuỗi trả lời',
        'Tin nhắn riêng: trả lời, chuyển tiếp, GIF và nhãn dán, tin thoại, “Đã xem” và “đang gõ”',
        'Thu hồi tin trong vòng 5 phút',
        'Danh sách thành viên kèm trạng thái hoạt động (tắt được)',
      ],
      anh: `${A}/iphone-04-04-messages.webp`,
      anhIpad: `${A}/ipad-04-04-messages.webp`,
    },
    {
      id: 'code',
      emoji: '💻',
      ten: 'Code của nhóm',
      ngan: 'Dự án nối GitHub hoặc GitLab: xem hoạt động Git, nhánh, pull request và diff ngay trong app.',
      chiTiet: [
        'Hoạt động Git, nhánh và pull request của dự án',
        'Xem mã nguồn có tô màu cú pháp và diff từng commit',
        'Commit, nhánh hoặc PR có mã thẻ (ví dụ SWP-12) sẽ hiện trên chính thẻ đó',
        'Chỉ hiện khi dự án đã nối GitHub hoặc GitLab',
      ],
      anh: `${A}/iphone-10-10-code.webp`,
      anhIpad: `${A}/ipad-06-06-code.webp`,
    },
    {
      id: 'cuoc-hop',
      emoji: '📅',
      ten: 'Cuộc họp',
      ngan: 'Lịch họp có RSVP, chương trình, biên bản và việc cần làm — vào Meet, Zoom, Teams hoặc Jitsi một chạm.',
      chiTiet: [
        'Trả lời tham dự (RSVP), xem chương trình và ghi biên bản',
        'Việc cần làm trong biên bản biến thành thẻ, có người làm và hạn',
        'Vào Google Meet, Zoom, Teams hoặc Jitsi một chạm (CT Work lưu link, không tự tạo cuộc gọi)',
        'Lời mời qua email kèm tệp lịch .ics',
      ],
    },
    {
      id: 'thanh-vien',
      emoji: '👤',
      ten: 'Hồ sơ & thành viên',
      ngan: 'Đổi ảnh đại diện, ảnh bìa, giới thiệu ngay trong app; chạm avatar bất kỳ để xem người đó.',
      chiTiet: [
        'Ảnh đại diện, ảnh bìa và giới thiệu dùng chung với hồ sơ trên web',
        'Chạm avatar của ai đó để xem vai trò, dự án chung, bài đăng gần đây và nhắn tin',
        'Danh sách thành viên với trạng thái “đang hoạt động”',
      ],
      anh: `${A}/iphone-05-05-profile-other.webp`,
      anhIpad: `${A}/ipad-05-05-profile-other.webp`,
    },
    {
      id: 'tim-kiem',
      emoji: '🔎',
      ten: 'My Work, tìm kiếm & hộp thư',
      ngan: 'Mọi việc giao cho bạn ở mọi dự án, một ô tìm cho tất cả, một hộp thư cho mọi thông báo.',
      chiTiet: [
        'My Work gom việc theo quá hạn, đến hạn hôm nay và sắp đến hạn',
        'Một ô tìm cho thẻ, dự án, người và lệnh (⌘K trên iPad)',
        'Hộp thư gom việc được giao, @nhắc, trả lời và phê duyệt — trả lời hoặc duyệt ngay từ thông báo',
        'Chọn loại thông báo đẩy muốn nhận, đặt giờ im lặng và âm báo riêng',
      ],
      anh: `${A}/iphone-07-07-search.webp`,
    },
    {
      id: 'cong-cu-du-an',
      emoji: '🧰',
      ten: 'Tài liệu & công cụ dự án',
      ngan: 'Docs, phê duyệt, test cycle, yêu cầu thay đổi, sổ RAID, service desk, sơ đồ và ghi giờ.',
      chiTiet: [
        'Docs kiểu Confluence: cây trang, mẫu quy trình, lịch sử phiên bản, bình luận',
        'Phê duyệt, yêu cầu thay đổi, sổ RAID (rủi ro, giả định, vấn đề, phụ thuộc)',
        'Sơ đồ: viết SQL là thấy ERD, xuất SQL Server, PostgreSQL, MySQL, MongoDB',
        'Trên app: ghim công cụ hay dùng, phần còn lại nằm trong More tools',
      ],
    },
    {
      id: 'kiem-thu',
      emoji: '🧪',
      ten: 'Kiểm thử & báo cáo cho đồ án',
      ngan: 'Test case, test plan, test cycle, bug từ bước Fail và báo cáo kiểm thử theo mẫu của trường.',
      chiTiet: [
        'Test case theo bước hoặc Gherkin, gom vào plan, chạy trong cycle',
        'Bước Fail tạo bug ngay, test lại khi bug được sửa',
        'Báo cáo kiểm thử 5.1, 5.2, 5.3 theo mẫu FPT; nhập từ Excel',
        'Báo cáo sprint, burndown, velocity và đóng góp từng thành viên',
      ],
      nhan: 'Đầy đủ trên web & máy tính',
    },
    {
      id: 'lop-hoc',
      emoji: '🏫',
      ten: 'Lớp học cho giảng viên',
      ngan: 'Bảng tin lớp, tài liệu theo chủ đề, điểm danh QR, bài tập, sổ điểm và quiz tự chấm.',
      chiTiet: [
        'Tạo lớp có bảng tin (Stream) và tài liệu theo chủ đề',
        'Lịch học có điểm danh bằng mã QR',
        'Giao bài nộp tệp, link hoặc văn bản; chấm theo rubric; sổ điểm có trọng số',
        'Quiz tự chấm với ngân hàng câu hỏi, nhập Aiken/GIFT',
        'Vai trò Teacher xem được dự án của nhóm sinh viên',
      ],
      nhan: 'Đầy đủ trên web & máy tính',
    },
    {
      id: 'ai-agent',
      emoji: '🤖',
      ten: 'AI agent & kết nối',
      ngan: 'Thêm AI agent làm thành viên, nối Claude qua MCP, GitHub, GitLab, Google, Microsoft, Notion và Slack.',
      chiTiet: [
        'AI agent là thành viên có nhãn “AI agent” ở mọi chỗ, đăng nhập bằng token chứ không bằng mật khẩu',
        'Agent không duyệt, không xoá, không đụng tới cài đặt hay tài chính; việc agent làm xong vào cột Review để người kiểm',
        'Nối Claude Code, Claude Desktop, Cursor… vào CT Work qua MCP',
        'Đồng bộ lịch Google/Microsoft, nhận thông báo Slack, nhập trang Notion',
      ],
      nhan: 'Đầy đủ trên web & máy tính',
    },
    {
      id: 'iphone-ipad',
      emoji: '📱',
      ten: 'Sinh ra cho iPhone & iPad',
      ngan: 'Widget, Live Activity, Siri, Share Extension, Spotlight, khoá Face ID và bố cục iPad riêng.',
      chiTiet: [
        'Live Activity cho đồng hồ ghi giờ đang chạy; widget ở Màn hình chính và Màn hình khoá',
        'Siri và Phím tắt, Share Extension (ảnh, link, chữ thành thẻ hoặc bình luận), Spotlight',
        'Khoá app bằng Face ID (tuỳ chọn, mặc định tắt)',
        'Bố cục iPad riêng với thanh bên, phím tắt bàn phím, chế độ sáng/tối và Dynamic Type',
      ],
      anhIpad: `${A}/ipad-01-01-board.webp`,
    },
    {
      id: 'an-toan',
      emoji: '🛡️',
      ten: 'An toàn từ thiết kế',
      ngan: 'Báo cáo mọi nội dung, chặn người dùng, nhãn rõ cho AI, xoá tài khoản ngay trong app.',
      chiTiet: [
        'Báo cáo bài đăng, bình luận, tin nhắn, hồ sơ hoặc câu trả lời AI; báo cáo được xem xét trong 24 giờ',
        'Ẩn bài, chặn người dùng',
        'AI agent do quản trị viên thêm luôn có nhãn “AI agent”',
        'Xoá tài khoản bất cứ lúc nào: Account › Delete account',
      ],
    },
  ],
  anhChay: [
    { anh: `${A}/iphone-01-01-board.webp`, nhan: 'Board — chạm giữ để kéo thẻ' },
    { anh: `${A}/iphone-02-02-cuongmini.webp`, nhan: 'Hỏi CuongMini về dự án' },
    { anh: `${A}/iphone-03-03-feed.webp`, nhan: 'Bảng tin nhóm' },
    { anh: `${A}/iphone-04-04-messages.webp`, nhan: 'Tin nhắn kiểu Messenger' },
    { anh: `${A}/iphone-05-05-profile-other.webp`, nhan: 'Hồ sơ đồng đội' },
    { anh: `${A}/iphone-06-06-issue-cuongmini.webp`, nhan: 'CuongMini ngay trong thẻ việc' },
    { anh: `${A}/iphone-07-07-search.webp`, nhan: 'Tìm mọi thứ ở một chỗ' },
    { anh: `${A}/iphone-08-08-members-active-now.webp`, nhan: 'Thành viên đang hoạt động' },
    { anh: `${A}/iphone-09-09-my-profile.webp`, nhan: 'Hồ sơ của bạn' },
    { anh: `${A}/iphone-10-10-code.webp`, nhan: 'Code: nhánh, PR, diff' },
  ],
  anhIpad: [
    { anh: `${A}/ipad-01-01-board.webp`, nhan: 'Board trên iPad' },
    { anh: `${A}/ipad-02-02-feed.webp`, nhan: 'Bảng tin trên iPad' },
    { anh: `${A}/ipad-03-03-cuongmini.webp`, nhan: 'CuongMini trên iPad' },
    { anh: `${A}/ipad-04-04-messages.webp`, nhan: 'Tin nhắn trên iPad' },
    { anh: `${A}/ipad-05-05-profile-other.webp`, nhan: 'Hồ sơ trên iPad' },
    { anh: `${A}/ipad-06-06-code.webp`, nhan: 'Code trên iPad' },
  ],
  huongDan: [
    {
      id: 'bat-dau',
      emoji: '🚀',
      tieuDe: 'Bắt đầu: dự án đầu tiên',
      moTa: 'Từ lúc tải app tới khi cả nhóm có thẻ việc đầu tiên.',
      buoc: [
        {
          ten: 'Tải app hoặc mở web',
          moTa: 'Tải CT Work trên App Store cho iPhone, iPad; app máy tính cho macOS, Windows, Linux ở /download/ct-work; hoặc mở thẳng cuongthai.com/work.',
        },
        {
          ten: 'Đăng nhập',
          moTa: 'Dùng tài khoản cuongthai.com hoặc Đăng nhập bằng Apple. Chưa có tài khoản thì tạo miễn phí ngay trong app.',
        },
        {
          ten: 'Tạo không gian và dự án',
          moTa: 'Bấm “New workspace” và đặt tên (ví dụ “SE1801 Group 3”). Trong không gian bấm “Create project”, chọn mẫu (SWP391 cho đồ án Scrum), chọn Scrum hoặc Kanban.',
          meo: 'Key của dự án (tiền tố mã thẻ như SWP-12) không đổi được về sau — chọn cẩn thận.',
        },
        {
          ten: 'Mời nhóm',
          moTa: 'Mở “Members & settings” → “Invitations”: nhập email, hoặc tạo “Invite link” rồi dán vào nhóm chat.',
          meo: 'Lời mời qua email dùng một lần, hết hạn sau 7 ngày. Link mời đặt được số lượt (1–200) và số ngày (1–30).',
        },
        {
          ten: 'Tạo thẻ việc đầu tiên',
          moTa: 'Bấm “Create” ở Board hoặc Backlog (phím C trên máy tính). Bắt đầu bằng vài Epic, rồi Story bên trong, Sub-task cho bước nhỏ.',
        },
      ],
    },
    {
      id: 'board-sprint',
      emoji: '📋',
      tieuDe: 'Board, backlog & sprint mỗi ngày',
      buoc: [
        {
          ten: 'Kéo thẻ để đổi trạng thái',
          moTa: 'Trên iPhone, chạm và giữ một thẻ rồi thả sang cột khác. Trên web kéo thả như thường. Cột không được phép theo workflow sẽ không nhận thẻ.',
          anh: `${A}/iphone-01-01-board.webp`,
        },
        {
          ten: 'Lọc cho gọn',
          moTa: 'Dùng “Only my issues”, lọc theo loại, hoặc bấm ảnh đại diện để chỉ hiện thẻ của người đó.',
        },
        {
          ten: 'Lập sprint',
          moTa: 'Mở Backlog → “Create sprint”, kéo thẻ vào cho tới khi tổng point vừa sức nhóm.',
        },
        {
          ten: 'Bắt đầu sprint',
          moTa: 'Bấm “Start sprint”, chọn thời lượng (1–4 tuần hoặc tuỳ chỉnh) và viết mục tiêu sprint một câu.',
        },
        {
          ten: 'Kết thúc sprint',
          moTa: 'Bấm “Complete sprint”, chọn dời việc chưa xong sang sprint mới, backlog hoặc sprint đã lên kế hoạch.',
          meo: 'Chỉ Admin dự án quản lý sprint. Dự án Kanban không có sprint.',
        },
      ],
    },
    {
      id: 'the-viec',
      emoji: '🗂️',
      tieuDe: 'Một thẻ việc từ A tới Z',
      buoc: [
        {
          ten: 'Điền các trường chính',
          moTa: 'Trạng thái, người làm (“Assign to me” một chạm), mức ưu tiên, hạn, story point, nhãn.',
        },
        {
          ten: 'Tách việc con và liên kết',
          moTa: '“Add sub-task” để tách bước nhỏ; “Link issue” để nối thẻ chặn nhau, liên quan, trùng hoặc kiểm thử.',
        },
        {
          ten: 'Bình luận và @nhắc tên',
          moTa: 'Gõ @ để nhắc đồng đội — họ nhận thông báo. Người theo dõi thẻ nhận thông báo mỗi bình luận mới.',
        },
        {
          ten: 'Đính kèm tệp',
          moTa: 'Đính kèm ảnh, tài liệu — tối đa 25 MB mỗi tệp, 50 tệp mỗi thẻ.',
        },
        {
          ten: 'Xem lịch sử',
          moTa: 'Tab History ghi mọi thay đổi trường, kể cả thay đổi do AI hay luật tự động.',
        },
      ],
    },
    {
      id: 'cuongmini',
      emoji: '🐻',
      tieuDe: 'Hỏi CuongMini',
      moTa: 'Trợ lý AI đọc được những gì bạn được xem trong dự án.',
      buoc: [
        {
          ten: 'Mở CuongMini',
          moTa: 'Trên iPhone: nút lấp lánh ở trang dự án, “Ask CuongMini” trong More, nút CuongMini trong một thẻ, hoặc “What should I work on today?” ở My Work. Trên web: nút “Ask AI” ở đầu trang dự án.',
          anh: `${A}/iphone-02-02-cuongmini.webp`,
        },
        {
          ten: 'Cho phép lần đầu',
          moTa: 'Trước câu hỏi đầu tiên, app nói rõ gửi gì và gửi cho ai để trả lời. Chỉ khi bạn đồng ý thì câu hỏi mới được gửi.',
        },
        {
          ten: 'Dùng thao tác nhanh trong thẻ',
          moTa: 'Summarize, Split into sub-tasks, Generate test cases, Review story quality — hoặc hỏi “Explain this issue and how to do it step by step”.',
          anh: `${A}/iphone-06-06-issue-cuongmini.webp`,
        },
        {
          ten: 'Xem đề xuất rồi bấm Apply',
          moTa: 'CuongMini không tự sửa gì. Muốn tạo hay sửa thẻ, nó hiện thẻ đề xuất; chỉ khi bạn bấm Apply thay đổi mới được làm, dưới tên và đúng quyền của bạn.',
          meo: 'AI có thể sai — kiểm lại điều quan trọng. Câu trả lời sai lệch thì bấm Report.',
        },
      ],
    },
    {
      id: 'tro-chuyen',
      emoji: '💬',
      tieuDe: 'Bảng tin, chat & tin nhắn',
      buoc: [
        {
          ten: 'Đăng lên bảng tin',
          moTa: 'My Work › Feed (cả không gian) hoặc một dự án › More › Feed. Đăng chữ, ảnh, video, tệp hoặc bình chọn.',
          anh: `${A}/iphone-03-03-feed.webp`,
        },
        {
          ten: 'Trò chuyện trong kênh',
          moTa: 'Tab Chat › Channels: kênh nhóm và nhóm riêng, gửi ảnh, tệp, tin thoại, @nhắc, ghim, trả lời theo chuỗi.',
        },
        {
          ten: 'Nhắn tin riêng',
          moTa: 'Tab Chat › Messages: chạm và giữ một tin để thả cảm xúc, Reply, Forward, Unsend (trong 5 phút) hoặc Report. Giữ nút micro để ghi tin thoại.',
          anh: `${A}/iphone-04-04-messages.webp`,
        },
        {
          ten: 'Xem ai đang hoạt động',
          moTa: 'Tab Chat › Members hiện trạng thái hoạt động. Muốn ẩn của mình: Account › Privacy & security.',
          anh: `${A}/iphone-08-08-members-active-now.webp`,
        },
      ],
    },
    {
      id: 'cuoc-hop-tai-lieu',
      emoji: '📅',
      tieuDe: 'Cuộc họp & tài liệu',
      buoc: [
        {
          ten: 'Lên lịch họp',
          moTa: 'Meetings → “Schedule meeting”: loại họp, giờ, độ dài, địa điểm và link Meet / Zoom / Teams. Người được mời nhận email kèm tệp .ics.',
        },
        {
          ten: 'Ghi chương trình và biên bản',
          moTa: 'Viết Agenda, Minutes và Decisions ngay trong cuộc họp.',
        },
        {
          ten: 'Biến việc cần làm thành thẻ',
          moTa: 'Thêm Action items (nội dung, người phụ trách, hạn) rồi bấm “Create issues” — mỗi việc thành một thẻ.',
          meo: '“Suggest from minutes” nhờ AI đọc biên bản và gợi ý việc; không gì được lưu cho tới khi bạn chọn.',
        },
        {
          ten: 'Viết tài liệu dự án',
          moTa: 'Mở Docs → “New page”, bắt đầu trang trắng hoặc từ mẫu (SRS, test plan…). Trang tự lưu và có lịch sử phiên bản.',
        },
      ],
    },
    {
      id: 'nhom-truong',
      emoji: '🧑‍🏫',
      tieuDe: 'Cho nhóm trưởng & giảng viên',
      buoc: [
        {
          ten: 'Đặt vai trò cho từng người',
          moTa: 'Dự án có năm vai trò: Admin, Member, Viewer, Teacher, Client. Đổi ở Project settings → Members.',
        },
        {
          ten: 'Theo dõi sức khoẻ dự án',
          moTa: 'Reports → Health cho thấy việc quá hạn hoặc bị kẹt; cuối sprint xem Sprint report, burndown, velocity và đóng góp từng thành viên.',
        },
        {
          ten: 'Cho giảng viên xem',
          moTa: 'Mời giảng viên với vai trò Teacher, hoặc tạo link công khai chỉ đọc cho board, backlog, báo cáo và kết quả kiểm thử.',
        },
        {
          ten: 'Giảng viên điều hành lớp',
          moTa: 'Mục Lớp học: bảng tin lớp, tài liệu, điểm danh QR, giao bài, sổ điểm và quiz — trên web và app máy tính.',
        },
      ],
    },
    {
      id: 'iphone-ipad',
      emoji: '📱',
      tieuDe: 'Mẹo trên iPhone & iPad',
      buoc: [
        {
          ten: 'Thêm widget',
          moTa: 'Thêm widget “My work today” hoặc “Timer” ra Màn hình chính hay Màn hình khoá; đồng hồ ghi giờ đang chạy hiện thành Live Activity.',
        },
        {
          ten: 'Gọi Siri',
          moTa: 'Nói “What’s on my plate in CT Work”, hoặc bắt đầu, dừng đồng hồ ghi giờ cho một thẻ bằng Siri và Phím tắt.',
        },
        {
          ten: 'Chia sẻ vào CT Work',
          moTa: 'Từ ảnh, trang web hay đoạn chữ, bấm Chia sẻ → CT Work để tạo thẻ mới hoặc thêm bình luận.',
        },
        {
          ten: 'Chọn thông báo',
          moTa: 'Chọn loại thông báo đẩy muốn nhận, đặt giờ im lặng và âm báo riêng. Trả lời hoặc duyệt ngay từ thông báo.',
        },
        {
          ten: 'Khoá bằng Face ID',
          moTa: 'Account → Security để bật khoá Face ID (mặc định tắt).',
          meo: 'Trên iPad, ⌘K mở ô tìm kiếm.',
        },
      ],
    },
  ],
  congDong: {
    moTa:
      'Hỏi cách dùng, chia sẻ cách nhóm bạn chạy dự án, báo lỗi hay đề xuất tính năng. Mọi góp ý đều được đọc và trả lời.',
    lienKet: [
      { href: '/forum', nhan: 'Diễn đàn CuongThai', moTa: 'Hỏi đáp và chia sẻ cách làm việc nhóm cùng mọi người.' },
      { href: CTW_COURSE_HREF, nhan: 'Khoá video “Hướng dẫn CT Work”', moTa: '12 tập tiếng Việt, từ tạo dự án đầu tiên tới AI agent.' },
      { href: '/gop-y', nhan: 'Góp ý & báo lỗi', moTa: 'Gặp lỗi hay muốn thêm tính năng? Gửi ở đây.' },
      { href: '/about/studio/case/ct-work', nhan: 'Câu chuyện xây dựng CT Work', moTa: 'Vì sao có CT Work và nó được làm ra thế nào.' },
    ],
    quyTac: [
      'Tôn trọng mọi người: không xúc phạm, quấy rối, đe doạ hay nội dung tình dục.',
      'Không spam, không quảng cáo trá hình.',
      'Không đăng thông tin riêng tư của người khác hay dữ liệu mật của dự án.',
      'Thấy nội dung xấu? Bấm Report — báo cáo được xem xét trong 24 giờ.',
      'Vi phạm nặng hoặc lặp lại có thể bị gỡ nội dung và khoá tài khoản.',
    ],
  },
  capNhat: [
    {
      phienBan: 'máy tính 1.0.11',
      ngay: '08/11/2026',
      muc: [
        'Giao diện bốn chế độ: Mặc định, Sáng, Tối, Theo giờ',
        'Tự cập nhật có đường dự phòng khi GitHub gặp lỗi',
        'Gợi ý ở thanh bên nhanh và rõ hơn',
      ],
    },
    {
      phienBan: 'iOS 1.0.0',
      ngay: '02/11/2026',
      tieuDe: 'CT Work lên App Store cho iPhone và iPad',
      muc: [
        'My Work, board chạm-giữ để kéo, backlog, sprint, danh sách có lọc',
        'Bảng tin nhóm, chat kênh và tin nhắn riêng kiểu Messenger',
        'CuongMini: hỏi về dự án, thao tác nhanh trong thẻ, Create with CuongMini',
        'Code: hoạt động Git, nhánh, pull request, diff',
        'Cuộc họp, hộp thư thông báo, hồ sơ',
        'Widget, Live Activity, Siri, Share Extension, Spotlight, khoá Face ID, bố cục iPad riêng',
      ],
    },
    {
      phienBan: 'máy tính 1.0.10',
      ngay: '28/10/2026',
      muc: ['CuongMini đề xuất được các thao tác trong CT Work — chỉ chạy khi bạn bấm Apply'],
    },
    {
      phienBan: 'máy tính 1.0.9',
      ngay: '27/10/2026',
      muc: [
        'Logo CT Work mới',
        'CuongMini đọc code và review code của dự án',
        'Hỏi nhanh để chuyển thẻ',
        'Kết nối GitHub qua GitHub App',
        'Sửa lỗi sơ đồ trong câu trả lời bị cắt',
      ],
    },
    {
      phienBan: 'máy tính 1.0.8',
      ngay: '24/10/2026',
      muc: [
        'Report 5.3 theo mẫu: 4 vòng kiểm thử và cột Evidence',
        'Nhập Excel giữ được ảnh Evidence',
        'Bảng 5.1, 5.2, 5.3 kéo rộng được cột, có khung chi tiết từng case',
      ],
    },
    {
      phienBan: 'máy tính 1.0.7',
      ngay: '22/10/2026',
      muc: [
        'Bảng tin nhóm: đăng ảnh, video, tệp; bình luận, cảm xúc, ghim, báo cáo',
        'Thùng rác dữ liệu 30 ngày; yêu cầu xoá chờ trưởng nhóm duyệt',
        'CuongMini trả lời đúng ngôn ngữ của câu hỏi',
      ],
    },
    {
      phienBan: 'máy tính 1.0.6',
      ngay: '20/10/2026',
      muc: [
        'Create with CuongMini',
        'Xem tệp đính kèm ngay trong app: ảnh, PDF, Word, Excel, video',
        'Nút Tải về riêng cho tệp đính kèm',
      ],
    },
    {
      phienBan: 'máy tính 1.0.3',
      ngay: '17/10/2026',
      muc: [
        'Thiết kế database bằng SQL trong Sơ đồ: ERD vẽ ngay khi gõ',
        'Xuất SQL Server, PostgreSQL, MySQL, MongoDB; kiểm chuẩn thiết kế',
        'Xem sơ đồ phóng to, kéo, toàn màn hình',
      ],
    },
    {
      phienBan: 'máy tính 1.0.2',
      ngay: '17/10/2026',
      muc: ['Bảng trợ giúp có video hướng dẫn từng chức năng (12 tập) và link tới khoá Hướng dẫn CT Work'],
    },
    {
      phienBan: 'máy tính 1.0.0',
      ngay: '15/10/2026',
      tieuDe: 'App máy tính riêng của CT Work',
      muc: ['App riêng cho macOS, Windows và Linux — mở là vào thẳng board, cài song song với app CuongThai'],
    },
  ],
  hoiDap: [
    // ── Bắt đầu
    {
      nhom: 'Bắt đầu',
      hoi: 'CT Work là gì?',
      dap: 'CT Work là app quản lý công việc cho nhóm làm dự án: board, backlog, sprint, bảng tin, chat, cuộc họp, tài liệu, code và trợ lý AI CuongMini — tất cả ở một chỗ. Đặc biệt hợp với đồ án nhóm ở trường (mẫu SWP391, SWR302, SWT301).',
    },
    {
      nhom: 'Bắt đầu',
      hoi: 'CT Work có mất phí không?',
      dap: 'Không. CT Work miễn phí trên web, app máy tính và App Store. Riêng trợ lý AI CuongMini có giới hạn sử dụng mỗi ngày.',
    },
    {
      nhom: 'Bắt đầu',
      hoi: 'Tôi dùng CT Work trên những thiết bị nào?',
      dap: 'Trên web (cuongthai.com/work), app máy tính cho macOS, Windows, Linux (/download/ct-work), và app cho iPhone, iPad từ iOS 17 trở lên. Cùng một tài khoản, dữ liệu đồng bộ tức thì.',
    },
    {
      nhom: 'Bắt đầu',
      hoi: 'Có cần tài khoản riêng cho app không?',
      dap: 'Không. App dùng chính tài khoản CT Work trên cuongthai.com. Bạn có thể đăng nhập bằng tài khoản đó hoặc bằng Apple, hay tạo tài khoản miễn phí ngay trong app.',
    },
    {
      nhom: 'Bắt đầu',
      hoi: 'Nên chọn Scrum hay Kanban?',
      dap: 'Scrum có backlog và sprint — hợp với đồ án chia theo vòng 1–4 tuần. Kanban làm liên tục, không có sprint. Kiểu dự án chọn lúc tạo dự án.',
    },
    // ── Làm việc nhóm
    {
      nhom: 'Làm việc nhóm',
      hoi: 'Mời bạn vào nhóm thế nào?',
      dap: 'Owner hoặc Admin mở “Members & settings” → “Invitations”. Mời qua email (dùng một lần, hết hạn sau 7 ngày), hoặc tạo link mời có số lượt và số ngày hết hạn rồi dán vào nhóm chat.',
    },
    {
      nhom: 'Làm việc nhóm',
      hoi: 'Các vai trò trong dự án khác nhau ra sao?',
      dap: 'Có năm vai trò: Admin (toàn quyền dự án, quản lý sprint), Member (làm việc hằng ngày), Viewer (chỉ xem), Teacher (cho giảng viên) và Client (cho khách). Owner và Admin của không gian luôn là Admin ở mọi dự án.',
    },
    {
      nhom: 'Làm việc nhóm',
      hoi: 'Sao tôi không kéo được thẻ sang một cột?',
      dap: 'Workflow của dự án không cho bước chuyển đó — chuyển từng bước, hoặc nhờ admin cho phép ở Project settings → Workflow. Nếu không kéo được thẻ nào, vai trò của bạn là Viewer, Teacher hoặc Client.',
    },
    {
      nhom: 'Làm việc nhóm',
      hoi: 'Sao tôi không thấy nút “Create sprint” hay “Start sprint”?',
      dap: 'Chỉ Admin dự án quản lý sprint, và dự án Kanban không có sprint. Nếu báo sprint “still running” thì phải kết thúc sprint đang chạy trước; sprint rỗng không bắt đầu được.',
    },
    {
      nhom: 'Làm việc nhóm',
      hoi: 'Giảng viên xem tiến độ nhóm thế nào?',
      dap: 'Mời giảng viên vào dự án với vai trò Teacher, hoặc tạo link công khai chỉ đọc cho board, backlog, báo cáo và kết quả kiểm thử — người xem không cần tài khoản.',
    },
    {
      nhom: 'Làm việc nhóm',
      hoi: 'Lỡ xoá nhầm thẻ hay dự án thì sao?',
      dap: 'Thẻ, dự án và không gian bị xoá đều vào thùng rác trước, khôi phục được từ đó.',
    },
    // ── CuongMini & AI
    {
      nhom: 'CuongMini & AI',
      hoi: 'CuongMini là ai?',
      dap: 'CuongMini là trợ lý AI trong CT Work (cũng là chú Gấu pixel của CuongThai). Nó đọc được thẻ, bình luận, tài liệu và sprint mà bạn được xem, rồi trả lời bằng ngôn ngữ bạn hỏi.',
    },
    {
      nhom: 'CuongMini & AI',
      hoi: 'CuongMini có tự sửa dự án của tôi không?',
      dap: 'Không. Khi muốn tạo hay sửa gì, CuongMini chỉ hiện thẻ đề xuất. Không có gì thay đổi cho tới khi bạn bấm Apply, và thay đổi được làm dưới tên, đúng quyền của bạn.',
    },
    {
      nhom: 'CuongMini & AI',
      hoi: 'Câu hỏi của tôi được gửi đi đâu?',
      dap: 'Câu hỏi và phần nội dung dự án cần để trả lời được gửi tới máy chủ CuongThai rồi xử lý bởi nhà cung cấp mô hình AI bên thứ ba, chỉ để tạo câu trả lời. App hỏi ý bạn trước câu hỏi đầu tiên và không dùng dữ liệu cho quảng cáo hay theo dõi.',
    },
    {
      nhom: 'CuongMini & AI',
      hoi: 'Dùng CuongMini có giới hạn không?',
      dap: 'Có giới hạn mỗi ngày. Nếu bạn hoặc trưởng nhóm của dự án có tài khoản Pro của CuongThai, cả nhóm được dùng CuongMini thoải mái hơn trong dự án đó (vẫn có giới hạn chống spam).',
    },
    {
      nhom: 'CuongMini & AI',
      hoi: '“AI agent” trong dự án là gì?',
      dap: 'Là thành viên AI do quản trị viên thêm vào, làm việc qua token thay vì mật khẩu và luôn có nhãn “AI agent”. Agent không duyệt, không xoá, không đụng cài đặt hay tài chính; việc agent đánh dấu xong sẽ vào cột Review để người kiểm.',
    },
    // ── Tài khoản & app
    {
      nhom: 'Tài khoản & app',
      hoi: 'App iPhone làm được những gì so với web?',
      dap: 'App làm được việc hằng ngày: My Work, board, thẻ việc, bảng tin, chat, tin nhắn, cuộc họp, CuongMini, Code, Docs và nhiều công cụ dự án. Những công cụ nặng như trình soạn tài liệu đầy đủ, sơ đồ hay báo cáo kiểm thử theo mẫu dùng thuận tay nhất trên web hoặc app máy tính.',
    },
    {
      nhom: 'Tài khoản & app',
      hoi: 'Làm sao bớt thông báo?',
      dap: 'Trên iPhone, chọn loại thông báo đẩy muốn nhận và đặt giờ im lặng. Với email, mở My work → “Notification settings” trên web: nhận ngay, gộp một thư mỗi sáng lúc 08:00, hoặc tắt.',
    },
    {
      nhom: 'Tài khoản & app',
      hoi: 'Ẩn trạng thái “đang hoạt động” thế nào?',
      dap: 'Trong app: Account › Privacy & security, tắt trạng thái hoạt động.',
    },
    {
      nhom: 'Tài khoản & app',
      hoi: 'Xoá tài khoản thế nào?',
      dap: 'Trong app: Account › Delete account. Tài khoản bị xoá sau 72 giờ kể từ lúc yêu cầu; trong khoảng đó bạn huỷ được.',
    },
    {
      nhom: 'Tài khoản & app',
      hoi: 'Gặp nội dung xấu thì làm gì?',
      dap: 'Bấm Report trên bài đăng, bình luận, tin nhắn, hồ sơ hoặc câu trả lời AI — báo cáo được xem xét trong 24 giờ. Bạn cũng có thể ẩn bài và chặn người dùng.',
    },
    // ── Sự cố thường gặp
    {
      nhom: 'Sự cố thường gặp',
      hoi: 'Commit GitHub không hiện trên thẻ?',
      dap: 'Commit message, tên nhánh hoặc pull request phải chứa mã thẻ, ví dụ SWP-12. Nếu vẫn không thấy, nhờ admin dự án kiểm lại kết nối GitHub trong cài đặt dự án.',
    },
    {
      nhom: 'Sự cố thường gặp',
      hoi: 'Không nhận được email thông báo?',
      dap: 'Kiểm tra My work → “Notification settings” (có đang Off hay trong giờ im lặng không) và thư mục spam. Bạn không nhận thông báo về thay đổi của chính mình.',
    },
    {
      nhom: 'Sự cố thường gặp',
      hoi: 'Link mời báo hết hạn hoặc đã dùng?',
      dap: 'Lời mời qua email chỉ dùng một lần và hết hạn sau 7 ngày; link mời hết hạn theo số ngày hoặc số lượt đã đặt. Nhờ admin tạo lời mời mới.',
    },
  ],
  gioiThieu: {
    doan: [
      'CT Work là công cụ quản lý dự án kiểu Jira dành cho đúng những dự án sinh viên và các nhóm nhỏ đang làm: board, backlog và sprint, tài liệu, báo cáo kiểm thử theo mẫu của trường, cuộc họp, chat nhóm, và CuongMini — trợ lý AI hiểu dự án của bạn.',
      'CT Work chạy trên web, có app máy tính riêng cho macOS, Windows, Linux, và app viết native cho iPhone, iPad. Mọi nơi dùng chung một tài khoản cuongthai.com, dữ liệu đồng bộ tức thì.',
      'Giảng viên theo dõi được tiến độ nhóm bằng vai trò Teacher hoặc link chỉ đọc; nhóm làm dự án cho khách có cổng khách hàng riêng, gọn, không lộ gì nội bộ.',
    ],
    giaTri: [
      {
        emoji: '✋',
        ten: 'AI không tự ý',
        moTa: 'CuongMini chỉ đề xuất. Mọi thay đổi chờ bạn bấm Apply, và AI luôn được gắn nhãn rõ ràng.',
      },
      {
        emoji: '🎯',
        ten: 'Làm đúng việc nhóm cần',
        moTa: 'Mẫu dự án, báo cáo và quy trình bám sát cách các nhóm đồ án thật sự làm việc.',
      },
      {
        emoji: '🔐',
        ten: 'Dữ liệu là của bạn',
        moTa: 'Không quảng cáo, không theo dõi. Xuất trọn dự án khi cần, xoá tài khoản ngay trong app.',
      },
    ],
    nguoiLam: 'CT Work là một sản phẩm của CuongThai (cuongthai.com).',
  },
  lienHe: {
    email: 'cuongthaihnhe176322@gmail.com',
    kenh: [
      { href: '/gop-y', nhan: 'Góp ý & báo lỗi' },
      { href: '/forum', nhan: 'Diễn đàn' },
    ],
  },
  chinhSach: [
    { href: '/chinh-sach-bao-mat', nhan: 'Chính sách bảo mật' },
    { href: '/dieu-khoan-su-dung', nhan: 'Điều khoản sử dụng' },
  ],
  gau: true,
  loiChao: "Chào bạn! Có CuongMini lo việc nhóm rồi ✨",
  nhanDan: ["✓ Done", "Sprint 3", "@CuongMini", "KEY-12"],
};

/** Metadata riêng từng trang con: canonical đúng trang (layout không được gán canonical chung cho cả nhánh). */
export function metaCtWork(duong: string, title: string, description: string): Metadata {
  const url = `${CTWORK_SITE.goc}${duong}`;
  return {
    title,
    description,
    alternates: { canonical: `https://cuongthai.com${url}` },
    openGraph: {
      title: `${title} · CT Work`,
      description,
      url,
      images: ['/images/ct-work/ct-work-app-icon-1024.png'],
    },
  };
}
