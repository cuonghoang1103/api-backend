/**
 * Việc (task) cho từng giai đoạn của mẫu dự án "Dự án khách hàng" trên CT Work.
 *
 * Nguồn sự thật của GIAI ĐOẠN (slug, tên, mục tiêu, exit criteria, mẫu tài
 * liệu…) là `frontend/src/app/about/quy-trinh/data.ts`. File này chỉ thêm
 * phần VIỆC — mỗi việc gắn MỘT vai (key trong DEPT_KEYS) để chế độ nhập vai
 * lọc theo nhãn `vai:<key>`.
 *
 * Việc "Cổng chất lượng" KHÔNG khai ở đây: `dung-mau-du-an.mts` tự sinh nó ở
 * cuối mỗi giai đoạn, checklist = exitCriteria trong data.ts, vai = `gateRole`.
 *
 * Luật (dung-mau-du-an.mts kiểm, sai là dừng):
 *   · mọi slug trong data.ts có mặt ở đây và ngược lại;
 *   · 2–7 việc thường (+ 1 cổng = 3–8 việc / giai đoạn);
 *   · mỗi checklist ≥ 3 mục; `role` / `gateRole` là key hợp lệ.
 *
 * Dựng lại JSON:  npx tsx content/quy-trinh/dung-mau-du-an.mts
 */

/** @type {Record<string, { gateRole: string, tasks: { summary: string, role: string, checklist: string[] }[] }>} */
export default {
  'tiep-nhan': {
    gateRole: 'sales',
    tasks: [
      {
        summary: 'Tiếp nhận yêu cầu, cấp mã phiếu và xác nhận đã nhận',
        role: 'sales',
        checklist: [
          'Phản hồi khách trong 1 ngày làm việc',
          'Ghi nguồn yêu cầu (web, giới thiệu, sự kiện…)',
          'Kiểm trùng với phiếu cũ của cùng tổ chức',
          'Lưu bằng chứng đồng ý xử lý dữ liệu (thời điểm, phiên bản thông báo)',
        ],
      },
      {
        summary: 'Ký NDA trước khi nhận tài liệu / dữ liệu nhạy cảm',
        role: 'legal',
        checklist: [
          'Xác định khách có chia sẻ thông tin mật không',
          'Gửi NDA hai chiều theo mẫu (nda.md) đã được luật sư duyệt',
          'Ký TRƯỚC buổi khảo sát và trước khi nhận tài liệu / quyền truy cập',
          'Lưu bản NDA đã ký vào hồ sơ dự án',
        ],
      },
      {
        summary: 'Họp tư vấn đầu tiên (30–45 phút)',
        role: 'sales',
        checklist: [
          'Hỏi bối cảnh, người dùng, mục tiêu kinh doanh đo được',
          'Hỏi hạn chót, khoảng ngân sách, ràng buộc pháp lý',
          'Xác định người ra quyết định và người dùng cuối',
          'Hỏi "vì sao" để tách nhu cầu khỏi giải pháp đã nghĩ sẵn',
        ],
      },
      {
        summary: 'Gửi biên bản tư vấn và danh sách câu hỏi mở',
        role: 'ba',
        checklist: [
          'Biên bản ≤ 1 trang: vấn đề, mục tiêu, ràng buộc',
          'Mỗi câu hỏi mở có người trả lời và hạn',
          'Gửi trong 24 giờ, xin khách xác nhận qua email',
        ],
      },
    ],
  },

  'tien-ban-hang': {
    gateRole: 'pmo',
    tasks: [
      {
        summary: 'Chấm bảng đánh giá phù hợp (BANT + năng lực + pháp lý)',
        role: 'sales',
        checklist: [
          'Chấm đủ 10 tiêu chí, ghi bằng chứng cho từng điểm',
          'Đánh dấu tiêu chí loại trực tiếp (pháp lý, xung đột lợi ích, đạo đức)',
          'Đính kèm bảng chấm vào phiếu yêu cầu',
        ],
      },
      {
        summary: 'Đánh giá khả thi kỹ thuật',
        role: 'arch',
        checklist: [
          'Liệt kê công nghệ / tích hợp cần có',
          'Đánh dấu phần ngoài năng lực hiện tại của đội',
          'Nêu rủi ro kỹ thuật lớn và cách giảm',
        ],
      },
      {
        summary: 'Đánh giá năng lực và lịch nguồn lực',
        role: 'pm',
        checklist: [
          'Đối chiếu hạn chót với lịch các dự án đang chạy',
          'Xác định ai sẵn sàng cho từng vai',
          'Ghi rủi ro phụ thuộc một người',
        ],
      },
      {
        summary: 'Rà soát rủi ro pháp lý và dữ liệu cá nhân',
        role: 'legal',
        checklist: [
          'Hệ thống có xử lý dữ liệu cá nhân / dữ liệu nhạy cảm không',
          'Có yêu cầu ngành hoặc lưu trữ trong nước không',
          'Có xung đột lợi ích với khách hiện tại không',
        ],
      },
      {
        summary: 'Phản hồi khách bằng văn bản',
        role: 'sales',
        checklist: [
          'Nêu quyết định và điều kiện (nếu có)',
          'Nếu "go": đề xuất phạm vi và thời lượng khảo sát',
          'Nếu "no-go": cảm ơn, nêu lý do ngắn gọn, gợi ý hướng khác',
        ],
      },
    ],
  },

  'khao-sat': {
    gateRole: 'ba',
    tasks: [
      {
        summary: 'Lập kế hoạch khảo sát và danh sách người phỏng vấn',
        role: 'ba',
        checklist: [
          'Liệt kê mọi nhóm người dùng chính',
          'Chuẩn bị bộ câu hỏi theo nhóm',
          'Đặt lịch với khách, gửi trước mục đích buổi phỏng vấn',
        ],
      },
      {
        summary: 'Phỏng vấn và quan sát người dùng',
        role: 'ux',
        checklist: [
          'Phỏng vấn ít nhất một đại diện mỗi nhóm người dùng',
          'Quan sát thao tác thật nếu được',
          'Ghi chỗ đau bằng nguyên lời người dùng',
        ],
      },
      {
        summary: 'Vẽ quy trình as-is / to-be (BPMN) và sơ đồ ngữ cảnh',
        role: 'ba',
        checklist: [
          'Mỗi luồng chính có sơ đồ as-is và to-be',
          'Đánh số điểm đau trên sơ đồ as-is',
          'Ghi phần nào phần mềm làm, phần nào vẫn làm tay',
        ],
      },
      {
        summary: 'Khảo sát hệ thống và dữ liệu hiện có',
        role: 'data',
        checklist: [
          'Liệt kê hệ thống nguồn, chủ sở hữu, khối lượng dữ liệu',
          'Đánh giá chất lượng dữ liệu sơ bộ',
          'Đánh dấu dữ liệu cá nhân; dữ liệu mẫu phải được ẩn danh',
        ],
      },
      {
        summary: 'Hoàn thiện tài liệu BA và glossary, xin khách xác nhận',
        role: 'ba',
        checklist: [
          'Danh sách vấn đề có xếp hạng ưu tiên',
          'Phạm vi và ngoài phạm vi sơ bộ',
          'Glossary định nghĩa mọi thuật ngữ nghiệp vụ',
          'Gửi khách xác nhận bằng văn bản',
        ],
      },
    ],
  },

  'de-xuat': {
    gateRole: 'sales',
    tasks: [
      {
        summary: 'Xây dựng và so sánh 2–3 phương án giải pháp',
        role: 'arch',
        checklist: [
          'So sánh tự xây / SaaS / kết hợp',
          'Ước tính chi phí vận hành hằng tháng cho từng phương án',
          'Nêu rủi ro và mức khoá chặt nhà cung cấp',
        ],
      },
      {
        summary: 'Lập WBS và ước lượng ba điểm',
        role: 'pm',
        checklist: [
          'WBS phủ cả kiểm thử, bảo mật, triển khai, đào tạo, chuyển dữ liệu, quản lý',
          'Ước lượng O / M / P cho từng hạng mục, tính E = (O + 4M + P) / 6',
          'Tách dự phòng rủi ro thành dòng riêng',
        ],
      },
      {
        summary: 'Đề xuất MVP và thứ tự ưu tiên (MoSCoW)',
        role: 'ba',
        checklist: [
          'Phân loại Must / Should / Could / Won’t',
          'Ghi giả định và hệ quả nếu giả định sai',
          'Xin khách chọn MVP',
        ],
      },
      {
        summary: 'Soạn đề xuất và lịch mốc, duyệt nội bộ',
        role: 'sales',
        checklist: [
          'Tóm tắt 1 trang cho người quyết định',
          'Lịch mốc kèm tiêu chí nghiệm thu từng mốc',
          'Chi phí bên thứ ba liệt kê riêng; báo giá gửi riêng',
          'PMO duyệt trước khi gửi; đặt ngày hết hiệu lực',
        ],
      },
      {
        summary: 'Trình bày đề xuất và ghi nhận lựa chọn của khách',
        role: 'client',
        checklist: [
          'Khách chọn phương án',
          'Khách xác nhận MVP và giả định bằng văn bản',
          'Câu hỏi còn mở có hạn trả lời',
        ],
      },
    ],
  },

  'phap-ly-tai-chinh': {
    gateRole: 'legal',
    tasks: [
      {
        summary: 'Soạn hợp đồng khung (MSA) và SOW',
        role: 'legal',
        checklist: [
          'SOW khớp đề xuất đã duyệt: phạm vi, ngoài phạm vi, mốc',
          'Tiêu chí nghiệm thu từng mốc đo được',
          'Bảo hành, giới hạn trách nhiệm, chấm dứt và trả dữ liệu',
          'Luật sư rà soát trước khi gửi',
        ],
      },
      {
        summary: 'Chốt điều khoản sở hữu trí tuệ và danh mục giấy phép bên thứ ba',
        role: 'arch',
        checklist: [
          'Liệt kê thư viện, font, ảnh, API trả phí và giấy phép của chúng',
          'Đánh dấu giấy phép có nghĩa vụ đặc biệt (copyleft…)',
          'Ghi thời điểm chuyển giao quyền sở hữu mã nguồn',
        ],
      },
      {
        summary: 'Lập lịch thanh toán theo mốc và thông tin hoá đơn',
        role: 'legal',
        checklist: [
          'Mỗi mốc thanh toán gắn với một biên bản nghiệm thu',
          'Thông tin xuất hoá đơn điện tử của khách',
          'Thời hạn thanh toán và xử lý chậm trả',
        ],
      },
      {
        summary: 'Thoả thuận xử lý dữ liệu (DPA) nếu xử lý dữ liệu cá nhân',
        role: 'legal',
        checklist: [
          'Xác định bên kiểm soát / bên xử lý dữ liệu',
          'Biện pháp bảo vệ và thời hạn thông báo vi phạm',
          'Quy tắc trả và xoá dữ liệu khi kết thúc',
          'Điền danh sách bên xử lý phụ (hạ tầng, lưu trữ, LLM…) và việc chuyển dữ liệu ra nước ngoài theo mẫu dpa.md',
          'Luật sư đối chiếu căn cứ hiện hành (Luật 91/2025/QH15 + NĐ 356/2025/NĐ-CP)',
        ],
      },
      {
        summary: 'Ký hợp đồng (hai bên)',
        role: 'client',
        checklist: [
          'Người ký có thẩm quyền ở cả hai bên',
          'Chữ ký số hoặc bản ký tay được lưu',
          'Product Owner và nhà tài trợ phía khách được chỉ định',
        ],
      },
      {
        summary: 'Họp kick-off và gửi biên bản',
        role: 'pm',
        checklist: [
          'Có mặt người ra quyết định của khách',
          'Thống nhất RACI, kênh liên lạc, nhịp báo cáo, đường leo thang',
          'Thống nhất quy trình thay đổi (CR)',
          'Gửi biên bản và danh sách việc trong 24 giờ',
        ],
      },
    ],
  },

  'dac-ta-yeu-cau': {
    gateRole: 'ba',
    tasks: [
      {
        summary: 'Viết use case và user story theo vai trò',
        role: 'ba',
        checklist: [
          'Mỗi tác nhân có danh sách use case',
          'Mỗi story theo INVEST',
          'Ma trận phân quyền màn hình theo vai trò',
        ],
      },
      {
        summary: 'Viết tiêu chí chấp nhận (Given / When / Then)',
        role: 'qa',
        checklist: [
          'Mọi story của sprint đầu có tiêu chí chấp nhận',
          'Có kịch bản lỗi và giá trị biên, không chỉ đường thuận',
          'Tiêu chí kiểm thử được, không có từ mơ hồ',
        ],
      },
      {
        summary: 'Chốt yêu cầu phi chức năng có số đo',
        role: 'arch',
        checklist: [
          'Hiệu năng, khả dụng, bảo mật, truy cập, sao lưu (RPO / RTO)',
          'Mỗi NFR có số đo mục tiêu và cách đo',
          'Trình duyệt / thiết bị được hỗ trợ',
        ],
      },
      {
        summary: 'Liệt kê yêu cầu bảo mật và dữ liệu cá nhân',
        role: 'sec',
        checklist: [
          'Chọn mức OWASP ASVS mục tiêu',
          'Dữ liệu cá nhân: thu gì, vì sao, giữ bao lâu, ai xem',
          'Yêu cầu nhật ký kiểm toán (audit log)',
        ],
      },
      {
        summary: 'Lập ma trận truy vết (RTM) và xin ký duyệt SRS',
        role: 'ba',
        checklist: [
          'Mỗi yêu cầu có ID duy nhất và nằm trong RTM',
          'Quy tắc nghiệp vụ và thông báo hệ thống có ID',
          'SRS có số phiên bản; khách ký duyệt',
        ],
      },
    ],
  },

  'thiet-ke-ux-ui': {
    gateRole: 'ux',
    tasks: [
      {
        summary: 'Vẽ user flow và sitemap',
        role: 'ux',
        checklist: [
          'Mỗi luồng chính có user flow',
          'Sitemap / sơ đồ màn hình đầy đủ',
          'BA đối chiếu với SRS',
        ],
      },
      {
        summary: 'Wireframe rồi mockup desktop và mobile',
        role: 'ux',
        checklist: [
          'Trạng thái tải / lỗi / rỗng cho mỗi màn hình',
          'Bố cục chạy từ chiều rộng 360 px',
          'Dùng nội dung thật thay lorem ipsum',
        ],
      },
      {
        summary: 'Prototype và kiểm thử khả dụng với 3–5 người dùng',
        role: 'ux',
        checklist: [
          'Có đồng ý tham gia và ghi hình',
          'Mỗi nhiệm vụ có điều kiện thành công',
          'Ghi phát hiện kèm mức độ và đề xuất sửa',
        ],
      },
      {
        summary: 'Rà truy cập (WCAG 2.2 AA) trên thiết kế',
        role: 'qa',
        checklist: [
          'Tương phản chữ thường ≥ 4.5:1',
          'Vùng chạm ≥ 24×24 px',
          'Thứ tự focus và trạng thái focus nhìn thấy',
        ],
      },
      {
        summary: 'Bàn giao design tokens / thư viện component',
        role: 'dev',
        checklist: [
          'Màu, chữ, khoảng cách, bo góc thành tokens',
          'Chế độ sáng / tối (nếu có)',
          'Đánh giá khả thi kỹ thuật các tương tác phức tạp',
        ],
      },
    ],
  },

  'kien-truc': {
    gateRole: 'arch',
    tasks: [
      {
        summary: 'Chọn kiểu kiến trúc và vẽ sơ đồ C4 (mức 1–3)',
        role: 'arch',
        checklist: [
          'Kiểu kiến trúc theo quy mô thật, có lý do',
          'Sơ đồ ngữ cảnh, container, component',
          'Sơ đồ triển khai cho dev / staging / production',
        ],
      },
      {
        summary: 'Thiết kế CSDL: ERD, từ điển dữ liệu, chiến lược migration',
        role: 'data',
        checklist: [
          'ERD chuẩn hoá, chỉ mục cho truy vấn chính',
          'Từ điển dữ liệu đánh dấu trường dữ liệu cá nhân',
          'Migration có phiên bản, chạy lại an toàn',
        ],
      },
      {
        summary: 'Viết hợp đồng API (OpenAPI 3.1)',
        role: 'dev',
        checklist: [
          'API thiết kế theo use case, không theo bảng',
          'Định dạng lỗi và phản hồi thống nhất',
          'Khoá phần API của sprint đầu',
        ],
      },
      {
        summary: 'Threat model (STRIDE) cho luồng dữ liệu nhạy cảm',
        role: 'sec',
        checklist: [
          'Vẽ luồng dữ liệu và ranh giới tin cậy',
          'Liệt kê mối đe doạ theo STRIDE',
          'Đưa biện pháp giảm thiểu vào backlog',
        ],
      },
      {
        summary: 'Ghi ADR và họp review thiết kế',
        role: 'arch',
        checklist: [
          'Mỗi quyết định khó đảo ngược có ADR',
          'Mỗi NFR có cơ chế đáp ứng trong thiết kế',
          'Biên bản review có danh sách việc',
        ],
      },
      {
        summary: 'Duyệt chi phí hạ tầng và vận hành hằng tháng',
        role: 'client',
        checklist: [
          'Bảng chi phí vận hành theo giả định tải',
          'Tài khoản cloud / dịch vụ đứng tên khách',
          'Khách duyệt bằng văn bản',
        ],
      },
    ],
  },

  'lap-ke-hoach': {
    gateRole: 'pm',
    tasks: [
      {
        summary: 'Lập kế hoạch dự án có baseline và lịch sprint',
        role: 'pm',
        checklist: [
          'Phạm vi, lịch, nguồn lực, rủi ro trong một tài liệu',
          'Lịch sprint và ngày demo',
          'PMO duyệt baseline',
        ],
      },
      {
        summary: 'Thống nhất Definition of Ready / Definition of Done',
        role: 'qa',
        checklist: [
          'DoD gồm review, CI xanh, test, chạy trên staging, tài liệu',
          'DoR gồm tiêu chí chấp nhận, thiết kế đã duyệt, ước lượng',
          'Đội và Product Owner cùng đồng ý',
        ],
      },
      {
        summary: 'Tạo repo, quy ước nhánh, mẫu PR, bảo vệ main',
        role: 'dev',
        checklist: [
          'README, CONTRIBUTING, .env.example đầy đủ',
          'Main bắt buộc review và CI xanh',
          'Quy ước commit (Conventional Commits)',
        ],
      },
      {
        summary: 'Dựng CI và ba môi trường dev / staging / production',
        role: 'devops',
        checklist: [
          'CI chạy lint, kiểm kiểu, test, build trên mỗi PR',
          'Mỗi môi trường có CSDL và bí mật riêng',
          'Staging chạy end-to-end bản "hello world"',
        ],
      },
      {
        summary: 'Lập sổ rủi ro, kế hoạch truyền thông, mẫu báo cáo tuần',
        role: 'pm',
        checklist: [
          'Mỗi rủi ro có người theo dõi và phương án',
          'Lịch họp định kỳ đã gửi',
          'Khách có link xem board công việc',
        ],
      },
    ],
  },

  'phat-trien': {
    gateRole: 'pm',
    tasks: [
      {
        summary: 'Phát triển backend và migration theo hợp đồng API',
        role: 'dev',
        checklist: [
          'Unit test cho nghiệp vụ mới',
          'Migration chạy được trên bản sao dữ liệu thật',
          'Không log dữ liệu cá nhân hay bí mật',
        ],
      },
      {
        summary: 'Phát triển frontend / mobile theo design system',
        role: 'dev',
        checklist: [
          'Đủ trạng thái tải / lỗi / rỗng',
          'Responsive và truy cập theo thiết kế đã duyệt',
          'Gọi API qua lớp client chung, xử lý lỗi thống nhất',
        ],
      },
      {
        summary: 'Tính năng AI: prompt có phiên bản, eval, trần chi phí (nếu có)',
        role: 'data',
        checklist: [
          'Bộ eval với câu hỏi thật trước khi chọn model',
          'Trần chi phí theo ngày / người dùng',
          'Đường lùi khi nhà cung cấp lỗi',
        ],
      },
      {
        summary: 'Review mã và merge',
        role: 'dev',
        checklist: [
          'PR nhỏ, có mô tả và liên kết story',
          'Người review khác người viết',
          'CI xanh trên bản cuối trước khi merge',
        ],
      },
      {
        summary: 'Demo cuối sprint và báo cáo tuần',
        role: 'pm',
        checklist: [
          'Demo trên staging, không trên máy dev',
          'Ghi phản hồi của khách thành thẻ',
          'Gửi báo cáo tuần: xong, tiếp theo, rủi ro, cần quyết định',
        ],
      },
      {
        summary: 'Xử lý yêu cầu thay đổi (CR)',
        role: 'ba',
        checklist: [
          'Mọi yêu cầu ngoài phạm vi có phiếu CR',
          'Đánh giá ảnh hưởng: công, lịch, rủi ro',
          'Chỉ làm khi khách duyệt bằng văn bản; cập nhật SRS / RTM',
        ],
      },
    ],
  },

  'chuyen-du-lieu': {
    gateRole: 'data',
    tasks: [
      {
        summary: 'Kiểm kê và đánh giá chất lượng dữ liệu nguồn',
        role: 'data',
        checklist: [
          'Số bản ghi, tỉ lệ trùng, thiếu, sai định dạng',
          'Đánh dấu trường dữ liệu cá nhân',
          'Chủ sở hữu dữ liệu phía khách xác nhận phạm vi',
        ],
      },
      {
        summary: 'Lập bảng ánh xạ trường và quy tắc chuyển đổi',
        role: 'ba',
        checklist: [
          'Ánh xạ 100% trường trong phạm vi',
          'Quy tắc xử lý trùng / thiếu / mặc định',
          'Múi giờ, mã hoá ký tự, định dạng số / tiền tệ',
        ],
      },
      {
        summary: 'Viết script chuyển đổi chạy lại được',
        role: 'dev',
        checklist: [
          'Upsert theo khoá tự nhiên, chạy lại không nhân đôi',
          'Chạy theo lô, ghi log từng lô',
          'Nạp theo thứ tự khoá ngoại',
        ],
      },
      {
        summary: 'Chạy thử (rehearsal) ít nhất hai lần trên bản sao',
        role: 'data',
        checklist: [
          'Đo thời gian mỗi lần chạy',
          'Ghi lỗi và sửa trước lần sau',
          'Xoá bản sao dữ liệu thử sau khi xong',
        ],
      },
      {
        summary: 'Đối soát và xin xác nhận của chủ sở hữu dữ liệu',
        role: 'qa',
        checklist: [
          'So số bản ghi và checksum / tổng tiền theo nhóm',
          'Người dùng nghiệp vụ kiểm mẫu ngẫu nhiên trên giao diện',
          'Lỗi còn lại được khách chấp nhận bằng văn bản',
        ],
      },
      {
        summary: 'Lập kế hoạch cutover và quay lui',
        role: 'devops',
        checklist: [
          'Trình tự bước, người làm, điểm quyết định tiếp / lùi',
          'Backup hệ thống cũ ngay trước cutover',
          'Thời gian cutover vừa cửa sổ bảo trì; quay lui đã thử',
        ],
      },
    ],
  },

  'kiem-thu': {
    gateRole: 'qa',
    tasks: [
      {
        summary: 'Viết kế hoạch kiểm thử',
        role: 'qa',
        checklist: [
          'Chiến lược theo cấp độ và tiêu chí vào / ra',
          'Định nghĩa mức độ lỗi và mức chặn phát hành (khách đồng ý)',
          'Trình duyệt / thiết bị cam kết',
        ],
      },
      {
        summary: 'Thiết kế test case truy vết về yêu cầu',
        role: 'qa',
        checklist: [
          'Mỗi yêu cầu có ít nhất một test case',
          'Có test giá trị biên và kịch bản lỗi',
          'Cập nhật RTM',
        ],
      },
      {
        summary: 'Unit và integration test trong CI',
        role: 'dev',
        checklist: [
          'Nghiệp vụ chính có unit test',
          'API + CSDL có integration test',
          'Chạy tự động trên mỗi PR',
        ],
      },
      {
        summary: 'System / E2E, hồi quy và truy cập',
        role: 'qa',
        checklist: [
          'Luồng chính chạy trên trình duyệt thật',
          'Bộ hồi quy tự động trong CI',
          'Kiểm truy cập bằng axe + kiểm tay',
        ],
      },
      {
        summary: 'Kiểm thử hiệu năng và tải theo NFR',
        role: 'devops',
        checklist: [
          'Kịch bản tải giống hành vi thật',
          'Đo p95 / p99, tỉ lệ lỗi',
          'So với mục tiêu NFR, ghi báo cáo',
        ],
      },
      {
        summary: 'Phân loại lỗi và phát hành báo cáo kiểm thử',
        role: 'qa',
        checklist: [
          'Lỗi có bước tái hiện, mức độ, ưu tiên',
          'Lỗi đã sửa được kiểm lại và hồi quy',
          'Báo cáo có khuyến nghị sẵn sàng / chưa sẵn sàng',
        ],
      },
    ],
  },

  'bao-mat': {
    gateRole: 'sec',
    tasks: [
      {
        summary: 'Review mã tập trung bảo mật',
        role: 'sec',
        checklist: [
          'Xác thực, phiên, đặt lại mật khẩu',
          'Phân quyền ở server, chặn IDOR',
          'Nhập liệu, upload, SSRF',
        ],
      },
      {
        summary: 'Bật SCA / SAST và quét bí mật trong CI',
        role: 'devops',
        checklist: [
          'Quét phụ thuộc (npm audit / Dependabot / Trivy)',
          'Quét mã tĩnh (Semgrep)',
          'Quét bí mật trong lịch sử git (gitleaks)',
        ],
      },
      {
        summary: 'Kiểm theo OWASP ASVS mức đã thống nhất',
        role: 'sec',
        checklist: [
          'Điền checklist bảo mật kèm bằng chứng',
          'Header bảo mật, CORS, HTTPS / HSTS',
          'Log không chứa bí mật hay dữ liệu cá nhân',
        ],
      },
      {
        summary: 'Quét động (DAST) trên staging',
        role: 'sec',
        checklist: [
          'Chạy OWASP ZAP trên staging',
          'Phân loại phát hiện theo mức độ',
          'Tạo thẻ sửa cho mức Critical / High',
        ],
      },
      {
        summary: 'Đánh giá tác động xử lý dữ liệu cá nhân (nếu áp dụng)',
        role: 'legal',
        checklist: [
          'Liệt kê hoạt động xử lý, mục đích, cơ sở',
          'Biện pháp bảo vệ đã áp dụng',
          'Lập hồ sơ đánh giá tác động theo quy định hiện hành',
        ],
      },
    ],
  },

  'ha-tang-devops': {
    gateRole: 'devops',
    tasks: [
      {
        summary: 'Cấu hình tên miền, DNS và xác thực email',
        role: 'infra',
        checklist: [
          'Tên miền đứng tên khách',
          'Bản ghi DNS có kiểm soát',
          'SPF / DKIM / DMARC',
        ],
      },
      {
        summary: 'TLS tự gia hạn, CDN / WAF, reverse proxy, tường lửa',
        role: 'infra',
        checklist: [
          'HTTPS tự gia hạn (ACME)',
          'Chỉ mở cổng cần thiết',
          'Cấu hình proxy kiểm từ bên trong container sau khi đổi',
        ],
      },
      {
        summary: 'Đóng gói container và pipeline triển khai có smoke test',
        role: 'devops',
        checklist: [
          'Ảnh dựng từ commit đã commit, không từ cây làm việc dở',
          'Smoke test sau deploy: báo lỗi khi 404 / 5xx',
          'Kiểm chính bộ smoke test (công cụ có trong ảnh)',
        ],
      },
      {
        summary: 'Giám sát, cảnh báo và SLO',
        role: 'devops',
        checklist: [
          'Log, số đo, theo dõi lỗi',
          'Cảnh báo uptime, đĩa, chứng chỉ tới đúng người',
          'SLO được khách đồng ý',
        ],
      },
      {
        summary: 'Sao lưu 3-2-1 và thử khôi phục',
        role: 'devops',
        checklist: [
          'Sao lưu tự động, có bản ngoài máy chủ',
          'Khôi phục thử bằng đúng phiên bản ảnh của production',
          'Lập biên bản thử khôi phục',
        ],
      },
      {
        summary: 'Viết runbook vận hành và quay lui',
        role: 'devops',
        checklist: [
          'Các bước triển khai, smoke test, quay lui',
          'Danh sách cấu hình nằm ngoài ảnh và cách cập nhật',
          'Liên hệ khẩn',
        ],
      },
    ],
  },

  'uat-nghiem-thu': {
    gateRole: 'client',
    tasks: [
      {
        summary: 'Soạn kế hoạch và kịch bản UAT từ tiêu chí chấp nhận',
        role: 'ba',
        checklist: [
          'Mỗi tiêu chí chấp nhận có kịch bản',
          'Kịch bản viết bằng ngôn ngữ nghiệp vụ',
          'Khách duyệt kịch bản',
        ],
      },
      {
        summary: 'Chuẩn bị môi trường và dữ liệu UAT',
        role: 'devops',
        checklist: [
          'Môi trường đúng phiên bản build cần nghiệm thu',
          'Dữ liệu gần thật, không dùng dữ liệu cá nhân thật chưa được đồng ý',
          'Tài khoản cho từng vai trò người kiểm',
        ],
      },
      {
        summary: 'Khách thực hiện UAT',
        role: 'client',
        checklist: [
          'Người dùng thật chạy đủ kịch bản',
          'Mỗi phát hiện có bằng chứng',
          'Ghi kết quả đạt / không đạt',
        ],
      },
      {
        summary: 'Phân loại phát hiện: lỗi / CR / cải tiến sau',
        role: 'pm',
        checklist: [
          'Lỗi so với đặc tả → sửa',
          'Thay đổi yêu cầu → lập phiếu CR',
          'Cải tiến → đưa vào backlog sau',
        ],
      },
      {
        summary: 'Sửa lỗi và chạy lại vòng UAT',
        role: 'dev',
        checklist: [
          'Sửa lỗi chặn nghiệm thu',
          'QA kiểm lại trước khi trả khách',
          'Ghi phiên bản build mới',
        ],
      },
    ],
  },

  'quan-ly-phat-hanh': {
    gateRole: 'pm',
    tasks: [
      {
        summary: 'Đánh số phiên bản (SemVer) và gắn tag',
        role: 'devops',
        checklist: [
          'Số phiên bản chưa từng được công bố',
          'Tag git trùng với bản build',
          'Không có lượt dựng nào khác đang chạy cho cùng số',
        ],
      },
      {
        summary: 'Viết release notes và CHANGELOG',
        role: 'pm',
        checklist: [
          'Viết cho người dùng: mới, thay đổi, đã sửa, cần làm gì',
          'Ghi migration, biến môi trường mới, cờ tính năng',
          'Hỗ trợ rà ngôn ngữ',
        ],
      },
      {
        summary: 'Đóng gói bản phát hành và giữ bản quay lui',
        role: 'devops',
        checklist: [
          'Bản phát hành bất biến, có checksum / chữ ký',
          'Bản trước còn trong registry / trên máy',
          'Kiểm tương thích môi trường chạy (libc, kiến trúc CPU…)',
        ],
      },
      {
        summary: 'Cấu hình cờ tính năng và kế hoạch bật dần',
        role: 'dev',
        checklist: [
          'Mỗi cờ có chủ sở hữu và ngày gỡ',
          'Giá trị mặc định an toàn',
          'Kế hoạch bật theo nhóm người dùng',
        ],
      },
      {
        summary: 'Diễn tập quay lui',
        role: 'devops',
        checklist: [
          'Chạy lệnh quay lui trên staging',
          'Đo thời gian quay lui',
          'Ghi điều kiện bắt buộc quay lui vào runbook',
        ],
      },
      {
        summary: 'Họp duyệt phát hành (go/no-go)',
        role: 'qa',
        checklist: [
          'Báo cáo kiểm thử và bảo mật đạt cổng',
          'Biên bản UAT đã ký',
          'Migration có hướng xử lý nếu phải quay lui',
          'Khách đồng ý thời điểm phát hành',
        ],
      },
    ],
  },

  'trien-khai-ban-giao': {
    gateRole: 'pm',
    tasks: [
      {
        summary: 'Go-live theo runbook',
        role: 'devops',
        checklist: [
          'Backup production trước, kiểm đọc được',
          'Chạy migration, thay container, smoke test',
          'Kiểm đúng phiên bản đang chạy',
        ],
      },
      {
        summary: 'Cutover dữ liệu và đối soát sau go-live',
        role: 'data',
        checklist: [
          'Chạy đúng kịch bản đã tập dượt',
          'Đối soát số lượng và checksum',
          'Khách xác nhận kết quả đối soát',
        ],
      },
      {
        summary: 'Đào tạo người dùng và quản trị viên',
        role: 'support',
        checklist: [
          'Buổi đào tạo theo vai trò',
          'Tài liệu người dùng và quản trị khớp phiên bản',
          'Video hướng dẫn cho thao tác chính',
        ],
      },
      {
        summary: 'Bàn giao mã nguồn, tài khoản và bí mật',
        role: 'pm',
        checklist: [
          'Chuyển quyền sở hữu repo, tên miền, tài khoản cloud',
          'Bí mật bàn giao qua trình quản lý mật khẩu',
          'Khách đổi mật khẩu / xoay khoá sau khi nhận',
        ],
      },
      {
        summary: 'Hypercare 72 giờ',
        role: 'devops',
        checklist: [
          'Người trực và kênh khẩn đã thông báo',
          'Theo dõi log, lỗi, hiệu năng',
          'Không còn sự cố P1 / P2 mở khi kết thúc',
        ],
      },
      {
        summary: 'Ký biên bản bàn giao',
        role: 'client',
        checklist: [
          'Kiểm đủ danh mục tài liệu và tài khoản',
          'Danh sách hạng mục chuyển sang bảo hành',
          'Ký biên bản',
        ],
      },
    ],
  },

  'dong-du-an': {
    gateRole: 'pm',
    tasks: [
      {
        summary: 'Đối chiếu sản phẩm bàn giao với SOW',
        role: 'pm',
        checklist: [
          'Mỗi hạng mục SOW có biên bản nghiệm thu',
          'Hạng mục tồn chuyển sang bảo hành có danh sách',
          'Khách xác nhận không còn hạng mục khác',
        ],
      },
      {
        summary: 'Retrospective toàn dự án',
        role: 'pm',
        checklist: [
          'So ước lượng với thực tế',
          'Tìm nguyên nhân gốc, không đổ lỗi',
          'Mỗi hành động cải tiến có người phụ trách và hạn',
        ],
      },
      {
        summary: 'Thu hồi quyền truy cập và xoay vòng bí mật',
        role: 'devops',
        checklist: [
          'Danh sách tài khoản đội từng có quyền và ngày thu hồi',
          'Khách xoay vòng bí mật đội từng dùng',
          'Xoá bản sao dữ liệu khách trên máy đội',
        ],
      },
      {
        summary: 'Quyết toán và thanh lý hợp đồng',
        role: 'legal',
        checklist: [
          'Phát hành hoá đơn cuối',
          'Xác nhận thanh toán đủ',
          'Thanh lý hợp đồng hoặc chuyển sang hợp đồng bảo trì',
        ],
      },
      {
        summary: 'Lưu trữ hồ sơ và cập nhật mẫu quy trình',
        role: 'pmo',
        checklist: [
          'Hồ sơ dự án có mục lục, thời hạn lưu',
          'Repo nội bộ chuyển chỉ đọc',
          'Bài học đưa vào mẫu / checklist / script',
        ],
      },
    ],
  },

  'bao-hanh-bao-tri': {
    gateRole: 'support',
    tasks: [
      {
        summary: 'Thiết lập kênh tiếp nhận và SLA',
        role: 'support',
        checklist: [
          'Kênh tiếp nhận và giờ hỗ trợ đã thông báo khách',
          'Định nghĩa mức độ P1–P4 và thời gian phản hồi',
          'Mẫu báo sự cố cho khách',
        ],
      },
      {
        summary: 'Tiếp nhận, phân loại và xử lý sự cố theo SLA',
        role: 'devops',
        checklist: [
          'Ghi thời gian phản hồi và khắc phục so với SLA',
          'Phân biệt lỗi bảo hành với yêu cầu mới',
          'Không sửa nóng production ngoài quy trình',
        ],
      },
      {
        summary: 'Viết postmortem cho sự cố P1 / P2',
        role: 'devops',
        checklist: [
          'Dòng thời gian và nguyên nhân gốc',
          'Hành động biến bài học thành kiểm tra tự động',
          'Gửi khách bản tóm tắt',
        ],
      },
      {
        summary: 'Cập nhật phụ thuộc và vá bảo mật định kỳ',
        role: 'sec',
        checklist: [
          'Lịch cập nhật hằng tháng',
          'Theo dõi CVE của phụ thuộc chính',
          'Chứng chỉ và tên miền không hết hạn',
        ],
      },
      {
        summary: 'Khôi phục thử định kỳ và báo cáo bảo trì',
        role: 'pm',
        checklist: [
          'Khôi phục thử có biên bản',
          'Theo dõi dung lượng đĩa và chi phí vận hành',
          'Báo cáo bảo trì gửi khách theo kỳ',
        ],
      },
    ],
  },

  'cai-tien': {
    gateRole: 'client',
    tasks: [
      {
        summary: 'Thu thập và phân tích số liệu sản phẩm',
        role: 'data',
        checklist: [
          'Analytics tuân thủ đồng ý cookie / dữ liệu',
          'Phễu chuyển đổi, tỉ lệ dùng tính năng, Core Web Vitals',
          'Chi phí vận hành so với dự kiến',
        ],
      },
      {
        summary: 'Phỏng vấn / khảo sát người dùng',
        role: 'ux',
        checklist: [
          'Khảo sát ngắn cho người dùng thật',
          'Phỏng vấn sâu một vài người dùng chính',
          'Tổng hợp yêu cầu kèm nguồn và tần suất',
        ],
      },
      {
        summary: 'Rà soát định kỳ với khách',
        role: 'pm',
        checklist: [
          'Số liệu, sự cố, chi phí, nợ kỹ thuật',
          'Mục tiêu kinh doanh mới của khách',
          'Ghi quyết định và việc tiếp theo',
        ],
      },
      {
        summary: 'Đề xuất lộ trình v2 có ưu tiên',
        role: 'ba',
        checklist: [
          'Ưu tiên theo giá trị / công sức',
          'Có hạng mục trả nợ kỹ thuật',
          'Hạng mục được duyệt đi vào bước Đề xuất như vòng mới',
        ],
      },
    ],
  },

  'ngung-he-thong': {
    gateRole: 'client',
    tasks: [
      {
        summary: 'Lập kế hoạch ngừng và kiểm kê nơi dữ liệu nằm',
        role: 'pm',
        checklist: [
          'Kiểm kê CSDL, file, bản sao lưu, log, máy dev, bên thứ ba',
          'Quyết định giữ / trả / xoá cho từng loại dữ liệu (khách quyết)',
          'Liệt kê phụ thuộc: tích hợp, webhook, DNS, email',
        ],
      },
      {
        summary: 'Thông báo người dùng cuối',
        role: 'support',
        checklist: [
          'Thông báo trước theo thời hạn đã thoả thuận',
          'Hướng dẫn người dùng tải dữ liệu của mình (nếu có)',
          'Nhắc lại trước ngày tắt',
        ],
      },
      {
        summary: 'Xuất và trả dữ liệu cho khách',
        role: 'data',
        checklist: [
          'Định dạng mở (CSV / JSON / SQL dump) kèm từ điển dữ liệu',
          'Tạo checksum cho từng tệp',
          'Khách xác nhận mở và đọc được',
        ],
      },
      {
        summary: 'Tắt dịch vụ và huỷ tài nguyên',
        role: 'devops',
        checklist: [
          'Chuyển chỉ đọc → tắt dịch vụ',
          'Gỡ bản ghi DNS trỏ vào dịch vụ đã huỷ',
          'Huỷ khoá API, webhook, chứng chỉ; dừng thanh toán định kỳ',
        ],
      },
      {
        summary: 'Xoá dữ liệu cá nhân và bản sao lưu, lập biên bản',
        role: 'legal',
        checklist: [
          'Xoá theo kế hoạch ở mọi nơi đã kiểm kê',
          'Dữ liệu giữ theo nghĩa vụ có ngày xoá cụ thể',
          'Biên bản xoá có người thực hiện và người kiểm chứng',
        ],
      },
    ],
  },
};
