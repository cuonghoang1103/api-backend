/**
 * Dữ liệu trang chủ app CT Courses (/ct-courses) — 17/11/2026. Giao diện dùng chung ở `components/appsite/*`.
 *
 * Mọi câu phải khớp tính năng CÓ THẬT trong bản nộp. Nguồn đối chiếu:
 *  - chữ App Store: `ios-app/app-store/ctcourses/metadata.json` (com.cuongthai.ctcourses, ASC app 6835720684),
 *  - các màn trong `ios-app/CuongThaiApp/CTCoursesApp/Man/*` và màn Pro `Pro/ManProCTC.swift` (5 lợi ích Pro),
 *  - con số đếm từ API công khai của prod ngày 17/11/2026: `GET /courses/chuong-trinh` (75 khoá · 15 kỳ · 5.123 bài),
 *    `GET /code-lab/stats` (12.097 đề · 71 bộ luyện). Số làm tròn xuống ("5.000+") để không lỗi thời khi nội dung đổi.
 * Gói Pro: MỘT gói dùng chung web + các app CuongThai (49.000 ₫/tháng · 399.000 ₫/năm · 1 tuần dùng thử).
 * Thêm tính năng mới thì sửa ở đây, đừng bịa số.
 */
import type { Metadata } from 'next';
import type { AppSite } from '@/components/appsite/types';

const A = '/images/ct-courses/app';

export const CTCOURSES_SITE: AppSite = {
  goc: '/ct-courses',
  ten: 'CT Courses',
  phuDe: 'Học IT từ số 0 tới đi làm',
  tieuDeLon: 'Học lập trình từ dòng code đầu tiên tới buổi phỏng vấn đầu tiên',
  moTa:
    'App học công nghệ thông tin cho sinh viên và người tự học: môn học theo kỳ, khoá học từ số 0, Code Lab chấm tự động, phòng thi có đồng hồ, phỏng vấn thử với AI và vở viết tay Apple Pencil. Đồng bộ với cuongthai.com — học trên web, học tiếp trên iPhone, iPad đúng chỗ đã dừng.',
  icon: `${A}/icon-180.png`,
  // Nhận diện app (Shared/Theme.swift, cờ CTCOURSES_APP): lam cô-ban học thuật + nghệ làm điểm nhấn.
  mau: '#2b5cd9',
  mau2: '#f59e0b',
  appStoreId: '6835720684',
  nenTang: 'iPhone & iPad · miễn phí, có gói Pro tuỳ chọn',
  nutPhu: [
    { href: '/courses', nhan: 'Học trên web' },
    { href: '/code-lab', nhan: 'Code Lab trên web' },
  ],
  conSo: [
    { so: '75', nhan: 'khoá học xếp theo 15 kỳ' },
    { so: '5.000+', nhan: 'bài học: video, slide, bài đọc' },
    { so: '12.000+', nhan: 'đề Code Lab chấm tự động' },
    { so: '71', nhan: 'bộ luyện Code Lab theo môn và khoá' },
  ],
  diemNoi: [
    { emoji: '🧭', ten: 'Có lộ trình, không học vu vơ', moTa: 'Academy theo kỳ, khoá học từ số 0 và lộ trình nghề Frontend, Backend, Fullstack, AI — biết hôm nay học gì, học tiếp ở đâu.' },
    { emoji: '⌨️', ten: 'Học là phải làm', moTa: 'Viết code ngay trên iPhone, iPad; máy chấm chạy từng ca kiểm thử và báo kết quả tức thì.' },
    { emoji: '🤖', ten: 'CuongMini cạnh bên', moTa: 'Bôi đen đoạn chữ hay đoạn code trong bài để hỏi; gửi kèm ảnh, PDF, hỏi bằng giọng nói.' },
    { emoji: '🔄', ten: 'Một tài khoản với web', moTa: 'Tiến độ, ghi chú và gói Pro dùng chung với cuongthai.com và các app CuongThai.' },
  ],
  tinhNang: [
    {
      id: 'academy', emoji: '🏛️', ten: 'Academy — học theo kỳ',
      ngan: 'Chọn ngành, xem lộ trình từng kỳ và các môn của kỳ; mỗi môn có slide, video, bài đọc, tài liệu.',
      chiTiet: [
        'Chọn ngành và chuyên ngành hẹp, app xếp môn theo từng kỳ',
        'Mỗi môn có slide, video bài giảng, bài đọc, tài liệu và luyện tập theo chương',
        'Theo dõi tiến độ từng môn, học tiếp bài đang dở',
      ],
      anh: `${A}/iphone-02-academy.webp`, anhIpad: `${A}/ipad-02-academy.webp`,
    },
    {
      id: 'khoa-hoc', emoji: '🎬', ten: 'Khoá học từ số 0',
      ngan: 'Web, React, Node.js, Java, SQL, Docker, Linux… từ nền tảng tới chuyên sâu, học bằng video, slide và bài đọc.',
      chiTiet: [
        'Video nhiều luồng, slide, bài đọc, bài tập nộp, câu hỏi cuối chương',
        'Mục lục bên cạnh bài học trên iPad, chế độ tập trung',
        'Hỏi CuongMini ngay trong bài: bôi đen đoạn chữ hay đoạn code để hỏi',
        'Ghi khi học: viết thẳng lên bài học',
      ],
      anh: `${A}/iphone-03-bai-hoc.webp`, anhIpad: `${A}/ipad-03-bai-hoc.webp`,
    },
    {
      id: 'lo-trinh', emoji: '🗺️', ten: 'Lộ trình nghề',
      ngan: 'Frontend, Backend, Fullstack, AI… theo từng chặng, mỗi bước có bài đọc, bài học trong app và tài nguyên chọn lọc.',
      chiTiet: ['Lộ trình chia chặng, đánh dấu bước đã xong', 'Mỗi bước dẫn thẳng tới bài học và tài nguyên', 'Tiến độ lộ trình đồng bộ với web'],
    },
    {
      id: 'code-lab', emoji: '⌨️', ten: 'Code Lab — viết code, chấm ngay',
      ngan: 'Hàng nghìn đề theo môn và theo khoá; chạy thử, nộp bài, xem kết quả từng ca kiểm thử.',
      chiTiet: [
        'Trình soạn mã có tô màu, thanh ký hiệu, phím tắt bàn phím ngoài',
        'Kết quả từng ca kiểm thử; ca ẩn không lộ đáp án',
        'Gợi ý mở dần và lời giải khi bí',
        'iPad chia hai khung đề bài và code',
      ],
      anh: `${A}/iphone-04-code-lab.webp`, anhIpad: `${A}/ipad-04-code-lab.webp`,
    },
    {
      id: 'phong-thi', emoji: '⏱️', ten: 'Phòng thi',
      ngan: 'Đề luyện theo môn: trắc nghiệm, thực hành, viết, nói — làm bài có đồng hồ như thi thật.',
      chiTiet: [
        'Bảng câu hỏi, gắn cờ câu chưa chắc, tự lưu bài đang làm',
        'Xem lại từng câu, lời giải, thảo luận cùng người học khác',
        'Ôn tập cùng CuongMini, không tính giờ',
        'Pro: AI chấm bài thi thực hành và giải thích từng câu',
      ],
      anh: `${A}/iphone-05-phong-thi.webp`, anhIpad: `${A}/ipad-05-phong-thi.webp`,
    },
    {
      id: 'phong-van', emoji: '🎤', ten: 'Phỏng vấn thử với AI',
      ngan: 'Chọn vị trí, cấp độ, phong cách công ty; trả lời bằng chữ hoặc giọng nói, nhận xét theo từng tiêu chí.',
      chiTiet: [
        'Câu trả lời mẫu cho từng câu hỏi',
        'Báo cáo cuối buổi: điểm mạnh, điểm cần cải thiện, nên luyện gì tiếp',
        'Lịch sử các buổi để thấy mình tiến bộ',
        'Pro: phỏng vấn thử không giới hạn, báo cáo chi tiết',
      ],
      anh: `${A}/iphone-06-phong-van.webp`, anhIpad: `${A}/ipad-06-phong-van.webp`,
    },
    {
      id: 'cuongmini', emoji: '✨', ten: 'CuongMini — trợ lý AI học tập',
      ngan: 'Hỏi bài, giải thích code, gỡ lỗi, lên kế hoạch ôn thi — trò chuyện như với một người kèm học.',
      chiTiet: [
        'Gửi kèm ảnh và tệp PDF, hỏi bằng giọng nói',
        'Câu trả lời có bảng, khối mã tô màu, công thức',
        'Lưu lịch sử, xếp thư mục, ghim cuộc trò chuyện',
        'Pro: hỏi nhiều hơn, model mạnh hơn',
      ],
      anh: `${A}/iphone-07-cuongmini.webp`, anhIpad: `${A}/ipad-07-cuongmini.webp`,
    },
    {
      id: 'vo', emoji: '✏️', ten: 'Vở viết tay & ghi chú',
      ngan: 'Vở viết tay với Apple Pencil: giấy kẻ, ô ly, chấm; dán ảnh, ghi âm buổi học; ghi chú đồng bộ với web.',
      chiTiet: [
        'Xếp vở theo môn, nhiều loại giấy và khổ giấy',
        'Hai trang cạnh nhau khi xoay ngang iPad',
        'Ghi chú đồng bộ với Notes trên web',
        'Pro: AI viết lại trang, rút thẻ ôn, vẽ sơ đồ giúp',
      ],
      anh: `${A}/iphone-08-vo.webp`, anhIpad: `${A}/ipad-08-vo.webp`,
    },
    {
      id: 'them-nua', emoji: '🧰', ten: 'Dự án, snippet, mô phỏng, CV',
      ngan: 'Dự án mẫu làm từng bước, kho snippet chép một chạm, mô phỏng thuật toán chạy từng bước, thư viện sách, viết CV có AI góp ý.',
      chiTiet: [
        'Dự án mẫu làm từng bước để có portfolio',
        'Snippets: đoạn mã hay dùng, tìm nhanh, chép một chạm',
        'Mô phỏng và thuật toán chạy từng bước',
        'Viết CV, AI góp ý từng mục',
      ],
    },
    {
      id: 'ipad', emoji: '📱', ten: 'Viết riêng cho iPad',
      ngan: 'Thanh bên iPadOS, bố cục nhiều cột, bàn phím ngoài và Apple Pencil — học như trên máy tính.',
      chiTiet: ['Bài học cạnh mục lục hoặc CuongMini', 'Code Lab chia đôi đề bài và code', 'Chế độ sáng và tối'],
      anhIpad: `${A}/ipad-01-trang-chu.webp`,
    },
  ],
  anhChay: [
    { anh: `${A}/iphone-01-trang-chu.webp`, nhan: 'Tiếp tục học' },
    { anh: `${A}/iphone-02-academy.webp`, nhan: 'Academy theo kỳ' },
    { anh: `${A}/iphone-03-bai-hoc.webp`, nhan: 'Học một bài' },
    { anh: `${A}/iphone-04-code-lab.webp`, nhan: 'Code Lab chấm ngay' },
    { anh: `${A}/iphone-05-phong-thi.webp`, nhan: 'Phòng thi' },
    { anh: `${A}/iphone-06-phong-van.webp`, nhan: 'Phỏng vấn thử' },
    { anh: `${A}/iphone-07-cuongmini.webp`, nhan: 'CuongMini' },
    { anh: `${A}/iphone-08-vo.webp`, nhan: 'Vở viết tay' },
  ],
  anhIpad: [
    { anh: `${A}/ipad-01-trang-chu.webp`, nhan: 'Trên iPad' },
    { anh: `${A}/ipad-03-bai-hoc.webp`, nhan: 'Bài học nhiều cột' },
    { anh: `${A}/ipad-04-code-lab.webp`, nhan: 'Code Lab hai khung' },
    { anh: `${A}/ipad-05-phong-thi.webp`, nhan: 'Phòng thi' },
    { anh: `${A}/ipad-07-cuongmini.webp`, nhan: 'CuongMini' },
    { anh: `${A}/ipad-08-vo.webp`, nhan: 'Vở Apple Pencil' },
  ],
  huongDan: [
    {
      id: 'bat-dau', emoji: '🚀', tieuDe: 'Bắt đầu trong 1 phút',
      buoc: [
        { ten: 'Tải app miễn phí', moTa: 'Mở App Store trên iPhone hoặc iPad, tìm "CT Courses" hoặc quét mã QR ở trang này.' },
        { ten: 'Đăng nhập', moTa: 'Đăng nhập bằng tài khoản cuongthai.com. Tiến độ học trên web hiện ngay trong app.', meo: 'Học trên web hay app đều cộng chung tiến độ.' },
        { ten: 'Học tiếp từ Trang chủ', moTa: 'Trang chủ hiện các môn đang học dở và ô hỏi nhanh CuongMini; mục Khám phá dẫn tới Academy, khoá học, lộ trình, Code Lab, phòng thi…', anh: `${A}/iphone-01-trang-chu.webp` },
      ],
    },
    {
      id: 'academy', emoji: '🏛️', tieuDe: 'Học theo kỳ với Academy',
      buoc: [
        { ten: 'Chọn ngành', moTa: 'Mở Academy, chọn khối ngành, ngành và chuyên ngành hẹp. App xếp các môn theo từng kỳ.', anh: `${A}/iphone-02-academy.webp` },
        { ten: 'Mở một môn', moTa: 'Mỗi môn có slide, video bài giảng, bài đọc, tài liệu và luyện tập theo chương.' },
        { ten: 'Học một bài', moTa: 'Xem video, đọc bài, mở mục lục để chuyển bài; bôi đen một đoạn để hỏi CuongMini.', anh: `${A}/iphone-03-bai-hoc.webp` },
      ],
    },
    {
      id: 'code-lab', emoji: '⌨️', tieuDe: 'Làm bài Code Lab',
      buoc: [
        { ten: 'Chọn đề', moTa: 'Vào Code Lab, chọn bộ luyện theo môn hoặc theo khoá, hoặc tìm theo tên đề.' },
        { ten: 'Viết code', moTa: 'Trình soạn có tô màu và thanh ký hiệu; trên iPad dùng được bàn phím ngoài và phím tắt.' },
        { ten: 'Chạy thử rồi nộp', moTa: 'Chạy thử để xem kết quả từng ca kiểm thử; nộp bài để chấm cả ca ẩn.', anh: `${A}/iphone-04-code-lab.webp`, meo: 'Bí thì mở gợi ý từng bước trước khi xem lời giải.' },
      ],
    },
    {
      id: 'phong-thi', emoji: '⏱️', tieuDe: 'Luyện thi trong Phòng thi',
      buoc: [
        { ten: 'Chọn môn và đề', moTa: 'Vào Phòng thi, chọn môn rồi chọn đề: trắc nghiệm, thực hành, viết hoặc nói.' },
        { ten: 'Làm bài có đồng hồ', moTa: 'Đồng hồ chạy như phòng thi thật; bảng câu hỏi cho biết câu nào đã làm, câu nào gắn cờ. Bài đang làm tự lưu.', anh: `${A}/iphone-05-phong-thi.webp` },
        { ten: 'Xem lại', moTa: 'Xem từng câu, lời giải và thảo luận; hoặc chọn chế độ ôn tập cùng CuongMini, không tính giờ.' },
      ],
    },
    {
      id: 'phong-van', emoji: '🎤', tieuDe: 'Phỏng vấn thử với AI',
      buoc: [
        { ten: 'Chọn vị trí và cấp độ', moTa: 'Ví dụ Node.js Backend · Junior, rồi chọn phong cách công ty (startup, product, big tech…).' },
        { ten: 'Trả lời từng câu', moTa: 'Gõ hoặc nói câu trả lời; nhận xét theo từng tiêu chí và câu trả lời mẫu hiện ngay sau khi nộp.', anh: `${A}/iphone-06-phong-van.webp` },
        { ten: 'Đọc báo cáo', moTa: 'Cuối buổi có báo cáo: điểm mạnh, điểm cần cải thiện và nên luyện gì tiếp.' },
      ],
    },
    {
      id: 'cuongmini-vo', emoji: '✨', tieuDe: 'CuongMini & Vở',
      buoc: [
        { ten: 'Hỏi CuongMini', moTa: 'Mở tab CuongMini, hỏi bằng chữ hoặc giọng nói, gửi kèm ảnh hay PDF bài tập.', anh: `${A}/iphone-07-cuongmini.webp` },
        { ten: 'Viết vở bằng Apple Pencil', moTa: 'Mở tab Vở, tạo môn và cuốn vở, chọn loại giấy (kẻ ngang, ô ly, chấm…) rồi viết.', anh: `${A}/iphone-08-vo.webp` },
        { ten: 'Ghi chú đồng bộ web', moTa: 'Ghi chú soạn trong app hiện ở Notes trên cuongthai.com và ngược lại.' },
      ],
    },
    {
      id: 'tai-khoan', emoji: '👤', tieuDe: 'Tài khoản & gói Pro',
      buoc: [
        { ten: 'Đăng ký Pro', moTa: 'Trong app, mở màn Pro, chọn gói tháng hoặc năm. Người mới có 7 ngày dùng thử.' },
        { ten: 'Huỷ hoặc đổi gói', moTa: 'Cài đặt › Apple ID › Gói đăng ký › CT Courses. Tắt ít nhất 24 giờ trước khi hết kỳ để không bị gia hạn.' },
        { ten: 'Khôi phục giao dịch', moTa: 'Đổi máy? Mở màn Pro và chọn Khôi phục giao dịch bằng cùng Apple ID.' },
      ],
    },
  ],
  pro: {
    ten: 'CT Courses Pro',
    moTa: 'Học miễn phí mỗi ngày — Pro mở khoá toàn bộ và nâng giới hạn AI',
    gia: '49.000 ₫/tháng hoặc 399.000 ₫/năm tại Việt Nam (giá chính xác theo khu vực hiện trong app). Người mới có 7 ngày dùng thử.',
    ghiChu:
      'Thuê bao tự gia hạn qua Apple. Phí tính vào tài khoản Apple khi xác nhận mua và tự gia hạn trừ khi tắt ít nhất 24 giờ trước khi hết kỳ. Quản lý hoặc huỷ trong Cài đặt › Apple ID › Gói đăng ký. Một gói Pro dùng chung trên cuongthai.com và các app CuongThai. Các lượt AI có giới hạn sử dụng hợp lý để chống lạm dụng.',
    bang: [
      { muc: 'Academy, khoá học, lộ trình (phần mở miễn phí)', free: '✓', pro: '✓' },
      { muc: 'Toàn bộ bài học, đề luyện và lộ trình', free: '—', pro: '✓' },
      { muc: 'Code Lab: chạy thử, nộp, kết quả từng ca kiểm thử', free: '✓', pro: '✓' },
      { muc: 'Hỏi CuongMini', free: 'Có giới hạn', pro: 'Nhiều hơn, model mạnh hơn, gửi kèm ảnh/tệp' },
      { muc: 'AI chấm bài thi thực hành, Code Lab, giải thích từng câu', free: '—', pro: '✓' },
      { muc: 'Phỏng vấn thử với AI', free: 'Có giới hạn', pro: 'Không giới hạn, báo cáo chi tiết' },
      { muc: 'Vở: AI viết lại trang, rút thẻ ôn, vẽ sơ đồ', free: '—', pro: '✓' },
      { muc: 'Dùng chung trên web cuongthai.com và các app CuongThai', free: '—', pro: '✓' },
    ],
  },
  congDong: {
    moTa: 'Trong app, mỗi đề ở Phòng thi có mục thảo luận để hỏi và trao đổi lời giải. Trên web, bạn hỏi đáp ở diễn đàn chung và góp ý cho từng khoá học.',
    lienKet: [
      { href: '/forum', nhan: '🗣️ Diễn đàn CuongThai', moTa: 'Hỏi đáp lập trình, chia sẻ kinh nghiệm học và thi' },
      { href: '/courses', nhan: '📚 Chương trình đào tạo', moTa: '75 khoá xếp theo 15 kỳ — học tiếp trên web' },
      { href: '/academy', nhan: '🏛️ Academy', moTa: 'Môn học theo kỳ, slide, video, tài liệu' },
      { href: '/code-lab', nhan: '⌨️ Code Lab', moTa: 'Đề luyện code có máy chấm, cùng tiến độ với app' },
      { href: '/gop-y', nhan: '💌 Góp ý cho app', moTa: 'Báo lỗi hoặc đề xuất tính năng mới' },
    ],
    quyTac: [
      'Tôn trọng mọi người, không xúc phạm, không quấy rối',
      'Hỏi rõ ràng, kèm đoạn code hoặc ảnh lỗi nếu có',
      'Không quảng cáo, không đăng link lừa đảo',
      'Không đăng tài liệu vi phạm bản quyền',
      'Thấy nội dung xấu: bấm Báo cáo — có người kiểm duyệt xem xét',
    ],
  },
  capNhat: [
    {
      phienBan: '1.0', ngay: '11/2026', tieuDe: 'Phiên bản đầu tiên',
      muc: [
        'Academy theo kỳ, khoá học từ số 0, lộ trình nghề',
        'Code Lab có máy chấm, kết quả từng ca kiểm thử',
        'Phòng thi có đồng hồ, xem lại, thảo luận, ôn tập cùng CuongMini',
        'Phỏng vấn thử với AI, báo cáo cuối buổi',
        'CuongMini kiểu trò chuyện: ảnh, PDF, giọng nói, thư mục, ghim',
        'Vở viết tay Apple Pencil và ghi chú đồng bộ web',
        'Giao diện riêng cho iPad, chế độ sáng và tối',
      ],
    },
  ],
  hoiDap: [
    { nhom: 'Chung', hoi: 'CT Courses có miễn phí không?', dap: 'Có. Tải và học miễn phí phần mở của Academy, khoá học, lộ trình và Code Lab. Gói Pro mở khoá toàn bộ bài học, đề luyện và nâng giới hạn các tính năng AI.' },
    { nhom: 'Chung', hoi: 'Học trên web và trên app có chung tiến độ không?', dap: 'Có. Đăng nhập cùng tài khoản cuongthai.com: tiến độ, ghi chú và gói Pro dùng chung giữa web và app.' },
    { nhom: 'Chung', hoi: 'App có trên Android không?', dap: 'Hiện chỉ có trên iPhone và iPad. Trên máy khác, bạn học ở cuongthai.com bằng cùng tài khoản.' },
    { nhom: 'Học', hoi: 'Mới bắt đầu học lập trình nên học gì trước?', dap: 'Mở Chương trình đào tạo và học theo thứ tự từ kỳ 1, hoặc chọn một lộ trình nghề (Frontend, Backend…) rồi đi từng chặng.' },
    { nhom: 'Học', hoi: 'Code Lab chấm thế nào?', dap: 'Mỗi đề có các ca kiểm thử. Chạy thử để xem kết quả từng ca; nộp bài thì chấm thêm ca ẩn (không lộ đáp án). Gợi ý và lời giải mở khi bạn cần.' },
    { nhom: 'Học', hoi: 'Đề trong Phòng thi là đề gì?', dap: 'Đề luyện theo môn, soạn theo cấu trúc bài thi: trắc nghiệm, thực hành, viết, nói. Làm có đồng hồ, xem lại lời giải và thảo luận sau khi nộp.' },
    { nhom: 'CuongMini', hoi: 'CuongMini là gì?', dap: 'Trợ lý AI học tập của app: giải thích bài, đọc code, gỡ lỗi, lên kế hoạch ôn thi, đọc ảnh và PDF bạn gửi. Câu trả lời của AI có thể sai — hãy đối chiếu khi cần.' },
    { nhom: 'Pro & thanh toán', hoi: 'Giá Pro bao nhiêu?', dap: 'Tại Việt Nam: 49.000 ₫/tháng hoặc 399.000 ₫/năm. Giá chính xác theo khu vực hiện trong app. Người mới có 7 ngày dùng thử.' },
    { nhom: 'Pro & thanh toán', hoi: 'Đã có Pro trên web, vào app có Pro không?', dap: 'Có. Pro là một gói dùng chung cho cuongthai.com và các app CuongThai — đăng nhập cùng tài khoản là dùng được.' },
    { nhom: 'Pro & thanh toán', hoi: 'Huỷ Pro thế nào?', dap: 'Cài đặt › Apple ID › Gói đăng ký › CT Courses › Huỷ. Tắt ít nhất 24 giờ trước khi hết kỳ để không bị gia hạn.' },
    { nhom: 'Pro & thanh toán', hoi: 'Đổi máy có mất Pro không?', dap: 'Không. Mở màn Pro và chọn Khôi phục giao dịch bằng cùng Apple ID.' },
    { nhom: 'Tài khoản & riêng tư', hoi: 'App thu thập dữ liệu gì?', dap: 'Xem Chính sách bảo mật: dữ liệu học, nội dung bạn gửi cho AI, ghi chú và vở bạn đồng bộ… và cách xoá.' },
  ],
  gioiThieu: {
    doan: [
      'CT Courses bắt đầu từ một nhu cầu rất thật: học công nghệ thông tin mà có lộ trình rõ ràng, có chỗ viết code ngay, có đề để luyện và có người giải thích khi không hiểu.',
      'App gom Academy theo kỳ, khoá học từ số 0, lộ trình nghề, Code Lab chấm tự động, phòng thi, phỏng vấn thử và vở viết tay vào một nơi. CuongMini — trợ lý AI của CuongThai — luôn ở cạnh để giải thích bài, đọc code và lên kế hoạch ôn thi.',
      'CT Courses là một phần của hệ sinh thái CuongThai (cuongthai.com), dùng chung tài khoản, tiến độ và gói Pro với web và các app khác.',
    ],
    giaTri: [
      { emoji: '🇻🇳', ten: 'Viết cho người Việt', moTa: 'Giải thích bằng tiếng Việt, ví dụ gần gũi, từ số 0.' },
      { emoji: '🛠️', ten: 'Học để làm được', moTa: 'Lab chạy thật, dự án mẫu, phỏng vấn thử — không học suông.' },
      { emoji: '🔒', ten: 'Tôn trọng riêng tư', moTa: 'Không quảng cáo, không bán dữ liệu.' },
    ],
    nguoiLam: 'Làm bởi CuongThai — Hoàng Nghĩa Cường, Việt Nam.',
  },
  lienHe: {
    email: 'cuongthaihnhe176322@gmail.com',
    kenh: [
      { href: '/gop-y', nhan: 'Góp ý / báo lỗi' },
      { href: '/about', nhan: 'Về CuongThai' },
    ],
  },
  chinhSach: [
    { href: '/chinh-sach-bao-mat', nhan: 'Chính sách bảo mật' },
    { href: '/dieu-khoan-su-dung', nhan: 'Điều khoản sử dụng' },
  ],
  gau: true,
  loiChao: 'Chào bạn! Code cùng Gấu nhé ⌨️',
  nhanDan: ['</>', '{ }', 'SQL', 'Java'],
};

/** Metadata một trang con của /ct-courses (canonical + Open Graph có icon app). */
export function metaCtCourses(duong: string, title: string, description: string): Metadata {
  const url = `${CTCOURSES_SITE.goc}${duong}`;
  return {
    title,
    description,
    alternates: { canonical: `https://cuongthai.com${url}` },
    openGraph: {
      title: `${title} · CT Courses`,
      description,
      url,
      images: ['/images/ct-courses/app/icon-512.png'],
    },
  };
}
