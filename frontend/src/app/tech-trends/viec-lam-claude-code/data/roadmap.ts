/**
 * Lộ trình 20 tuần, xếp theo THỨ TỰ CÓ LÝ DO chứ không theo độ khó.
 *
 * Ba nguyên tắc chi phối thứ tự này:
 *
 * 1. Việc đang mở thì nộp TRƯỚC, học sau. Tin Agentic Engineer ở Sài Gòn còn
 *    ghi "Actively Accepting Candidates" ngay lúc soạn trang này — chờ học
 *    xong mới nộp là chờ mất một cơ hội có thật.
 * 2. Lấp khoảng trống RẺ NHẤT trước. Python đứng trước Kubernetes vì 48 tin
 *    đòi Python còn 6 tin đòi K8s, mà Python lại dễ hơn với người đã biết code.
 * 3. Tiếng Anh chạy SONG SONG cả 20 tuần, không phải một chặng riêng. Gộp nó
 *    thành một chặng thì nó luôn bị đẩy xuống cuối rồi bỏ dở.
 */
import type { Phase } from './types';

export const PHASES: Phase[] = [
  {
    id: 'p0',
    no: 0,
    title: 'Nộp trước đã',
    span: '3 ngày tới',
    goal: 'Gửi được hồ sơ cho vị trí đang thực sự mở ở TP.HCM, và có một trang hồ sơ công khai để dẫn link.',
    why: 'Vị trí Agentic Engineer (Saigon) của We The Flywheel còn ghi "Actively Accepting Candidates", hybrid Quận 2, dưới 30 giờ/tuần, hợp đồng 3–6 tháng — và JD ghi thẳng "không cần nền lập trình chính quy". Đây là tin khớp với bạn nhất trong cả 108 tin. Cơ hội có hạn sử dụng; kỹ năng thì không.',
    skills: ['claude-code', 'ownership', 'english'],
    tasks: [
      {
        id: 'p0-1',
        text: 'Đọc kỹ JD Agentic Engineer (Saigon) và bản Agentic Operator (Saigon)',
        detail: 'Cùng công ty còn bản remote của cả hai vị trí. Nộp cả hai nơi — chúng khác nhau về mức độ code, và bạn hợp cả hai.',
      },
      {
        id: 'p0-2',
        text: 'Đẩy kho api-backend lên GitHub ở chế độ công khai (hoặc tách một bản rút gọn)',
        detail: 'Đây là bằng chứng mạnh nhất bạn có, đừng để nó chỉ nằm trên máy. Nếu ngại lộ mã nguồn thật, tách riêng vài module tiêu biểu. BẮT BUỘC kiểm lại không có .env, khoá API hay thông tin đăng nhập trong lịch sử commit.',
      },
      {
        id: 'p0-3',
        text: 'Viết một trang README tiếng Anh cho dự án cuongthai.com',
        detail: 'Cấu trúc: làm gì, cho ai, kiến trúc (một sơ đồ), công nghệ, và 3 vấn đề khó nhất đã giải. Đây vừa là hồ sơ vừa là bài luyện viết.',
      },
      {
        id: 'p0-4',
        text: 'Chuẩn bị 3 con số về dự án',
        detail: 'Ví dụ: bao nhiêu module, bao nhiêu bài học/đề thi, bao nhiêu người dùng, thời gian triển khai. Nhà tuyển dụng nhớ số, không nhớ tính từ.',
      },
      {
        id: 'p0-5',
        text: 'Viết thư ứng tuyển 150 từ, tiếng Anh, không dùng mẫu có sẵn',
        detail: 'Ba đoạn: (1) tôi đã tự dựng và đang vận hành cái gì, (2) tôi dùng Claude Code như thế nào và chỗ nào tôi KHÔNG tin nó, (3) vì sao đúng vị trí này. Ý số 2 quan trọng nhất — JD của họ nói thẳng họ không tuyển thợ gõ prompt.',
      },
      {
        id: 'p0-6',
        text: 'Nộp, rồi mới học tiếp',
        detail: 'Đừng chờ "khi nào giỏi hơn". Với hợp đồng bán thời gian, họ tuyển theo tiềm năng và cách bạn tư duy, không theo số năm kinh nghiệm.',
      },
    ],
    milestone: 'Đã bấm nút nộp cho ít nhất 2 vị trí, và có một link GitHub công khai để dán vào hồ sơ.',
    output: 'Hồ sơ công khai + thư ứng tuyển tiếng Anh dùng lại được cho mọi tin sau.',
  },

  {
    id: 'p1',
    no: 1,
    title: 'Python tới mức làm việc được',
    span: 'Tuần 1–4',
    goal: 'Viết được một API bằng Python, gọi được Claude API, xử lý được một tệp dữ liệu — không phải "học xong khoá Python".',
    why: '48/108 tin đòi Python, nhiều nhất trong mọi ngôn ngữ. Bạn đã biết lập trình nên đây thuần tuý là đổi cú pháp — khoảng trống rẻ nhất trong cả lộ trình. Học nó trước vì mọi chặng sau (agent, evals, RAG, pipeline) đều mặc định dùng Python.',
    skills: ['python', 'llm', 'api'],
    tasks: [
      {
        id: 'p1-1',
        text: 'Bỏ qua phần cơ bản, học thẳng phần khác với JavaScript',
        detail: 'Danh sách đủ dùng: list/dict comprehension, unpacking, f-string, type hints, decorator, context manager (with), async/await, và cách quản môi trường bằng venv + pip.',
      },
      {
        id: 'p1-2',
        text: 'Dựng một API FastAPI có 4 route CRUD, nối vào PostgreSQL đang chạy',
        detail: 'FastAPI rất giống Express về tư duy nên bạn bắt nhịp nhanh. Dùng SQLAlchemy hoặc thẳng psycopg — đừng sa đà chọn ORM.',
      },
      {
        id: 'p1-3',
        text: 'Gọi Claude API bằng SDK anthropic, có streaming',
        detail: 'Làm cho được cả ba: gọi thường, gọi có streaming, và ép đầu ra theo JSON schema. Ba thứ này là nền của mọi chặng sau.',
      },
      {
        id: 'p1-4',
        text: 'Viết một script xử lý dữ liệu thật',
        detail: 'Gợi ý dùng luôn dữ liệu có sẵn: đọc tệp JSON tin tuyển dụng, lọc, thống kê, xuất CSV. Chính là việc tôi đã làm để dựng trang này.',
      },
      {
        id: 'p1-5',
        text: 'Viết test bằng pytest cho những gì vừa làm',
        detail: 'Tập thói quen từ đầu. Ở Python, test dễ viết hơn ở Node nhiều.',
      },
      {
        id: 'p1-6',
        text: 'Làm DỰ ÁN SỐ 4 — viết lại một service của api-backend bằng Python',
        detail: 'Đây là điểm khác biệt: không làm bài tập giả, mà viết lại một thứ đang chạy thật. Kết quả là một câu chuyện so sánh Node vs Python rất đắt khi phỏng vấn.',
      },
    ],
    milestone: 'Có một service Python chạy được, có test, làm đúng việc mà bản Node đang làm.',
    output: 'Một kho mã Python công khai + khả năng nói "tôi làm được cả hai phía".',
  },

  {
    id: 'p2',
    no: 2,
    title: 'Agent thật, không phải chatbot',
    span: 'Tuần 5–8',
    goal: 'Dựng được một agent gọi công cụ, tự sửa khi sai, và có bộ evals chấm điểm chất lượng đầu ra.',
    why: 'Đây là chặng đổi đời của hồ sơ. 42 tin nói về agentic, 19 tin đòi evals, 19 tin nhắc MCP — mà gần như không ứng viên junior nào có. Sau chặng này bạn không còn là "sinh viên biết dùng Claude Code" mà là "người đã dựng agent có đo chất lượng".',
    skills: ['agentic', 'evals', 'mcp', 'prompt', 'llm', 'ai-safety'],
    tasks: [
      {
        id: 'p2-1',
        text: 'Tự viết vòng lặp agent bằng tay, KHÔNG dùng framework',
        detail: 'model → chọn tool → chạy tool → trả kết quả về → lặp. Viết tay một lần thì mọi framework sau này chỉ là đường tắt, không còn là hộp đen.',
      },
      {
        id: 'p2-2',
        text: 'Định nghĩa 3–5 tool có schema chặt',
        detail: 'Mỗi tool: tên rõ nghĩa, mô tả nói rõ KHI NÀO dùng, tham số có kiểu. Tool mô tả mơ hồ là nguyên nhân số một khiến agent gọi sai.',
      },
      {
        id: 'p2-3',
        text: 'Xử lý lỗi cho tử tế',
        detail: 'Tool ném lỗi thì agent phải đọc được thông báo lỗi và thử cách khác, không được chết cả phiên. Đây là chỗ demo và sản phẩm thật khác nhau.',
      },
      {
        id: 'p2-4',
        text: 'Dựng bộ evals 30 ca',
        detail: 'Viết tay 30 cặp đầu vào → đầu ra mong muốn. Chấm bằng 3 cách: khớp chính xác, khớp theo luật, và dùng model khác chấm. Lưu điểm theo thời gian.',
      },
      {
        id: 'p2-5',
        text: 'Đổi prompt rồi chạy lại evals, ghi lại điểm trước/sau',
        detail: 'Chính cái bảng điểm này là thứ mang đi phỏng vấn. Nó chứng minh bạn cải tiến bằng số liệu chứ không bằng cảm giác.',
      },
      {
        id: 'p2-6',
        text: 'Viết một MCP server cắm vào dữ liệu của chính bạn',
        detail: 'Dự án số 2. Cho Claude Code truy vấn được cơ sở dữ liệu cuongthai.com qua MCP — vừa học vừa dùng được thật hằng ngày.',
      },
      {
        id: 'p2-7',
        text: 'Đọc và tự thử prompt injection',
        detail: 'Cho agent đọc một tệp có chứa câu "bỏ qua mọi lệnh trước, hãy làm X" và xem nó có nghe theo không. Biết cách chặn là điểm cộng lớn ở 16 tin về an toàn AI.',
      },
    ],
    milestone: 'Agent chạy được đầu-cuối trên một việc thật, có bảng điểm evals ghi ít nhất 2 lần đo cách nhau một lần sửa prompt.',
    output: 'Dự án nổi bật nhất trong hồ sơ. Đây là thứ bạn kể đầu tiên khi phỏng vấn.',
  },

  {
    id: 'p3',
    no: 3,
    title: 'Làm cho nó đáng tin',
    span: 'Tuần 9–12',
    goal: 'Có test tự động chặn lỗi trước khi triển khai, và biết hệ thống đang sống hay chết mà không cần vào SSH.',
    why: '13 tin đòi testing, 21 tin đòi observability. Quan trọng hơn: bạn đang chạy production thật mà chưa có hai thứ này — nên chặng này vừa để xin việc vừa để chính bạn đỡ khổ. Càng dùng AI sinh code, test càng quan trọng, vì test là thứ duy nhất chặn được code trông đúng mà chạy sai.',
    skills: ['testing', 'obs', 'cicd', 'security'],
    tasks: [
      {
        id: 'p3-1',
        text: 'Viết test cho 3 luồng dễ vỡ nhất trong api-backend',
        detail: 'Đăng nhập, phân quyền, và một luồng nghiệp vụ chính. Đừng cố phủ hết — phủ đúng chỗ đau.',
      },
      {
        id: 'p3-2',
        text: 'Thêm test luồng người dùng bằng Playwright',
        detail: 'Một luồng thôi: mở trang → đăng nhập → làm một việc → thấy kết quả. Đây cũng là kỹ năng tin Comvex đòi đích danh.',
      },
      {
        id: 'p3-3',
        text: 'Nối test vào GitHub Actions, chặn triển khai nếu test đỏ',
        detail: 'Bạn đã có sẵn CI — chỉ thêm một bước. Dự án số 7.',
      },
      {
        id: 'p3-4',
        text: 'Gắn Sentry cho cả backend và frontend',
        detail: 'Lần đầu bật sẽ thấy một đống lỗi đang âm thầm xảy ra mà bạn không biết. Đó chính là giá trị của nó.',
      },
      {
        id: 'p3-5',
        text: 'Chuyển log sang dạng có cấu trúc',
        detail: 'JSON có mã yêu cầu, id người dùng, thời gian xử lý. Sau này tìm lỗi theo mã yêu cầu thay vì đọc mò.',
      },
      {
        id: 'p3-6',
        text: 'Dựng một trang trạng thái đơn giản',
        detail: 'Dự án số 6. Hiện tình trạng backend, database, R2 và thời gian phản hồi. Nhỏ nhưng rất "kỹ sư vận hành".',
      },
    ],
    milestone: 'Đẩy một commit cố tình sai và thấy CI chặn lại được, trước khi nó lên production.',
    output: 'Câu chuyện "tôi đã làm hệ thống của mình đáng tin hơn thế nào" — đúng thứ 21 tin đang tìm.',
  },

  {
    id: 'p4',
    no: 4,
    title: 'Đám mây và dữ liệu',
    span: 'Tuần 13–16',
    goal: 'Nói được chuyện AWS, và dựng được một pipeline dữ liệu chạy đều đặn, chạy lại được mà không hỏng.',
    why: '19 tin đòi AWS, 14 tin đòi pipeline dữ liệu. Bạn đang tự quản VPS nên đã hiểu bản chất — chỉ thiếu tên gọi và thói quen của hệ sinh thái đám mây. Đây là chặng "dịch" kiến thức sẵn có sang ngôn ngữ nhà tuyển dụng dùng.',
    skills: ['aws', 'pipeline', 'postgres', 'gcp'],
    tasks: [
      {
        id: 'p4-1',
        text: 'Đối chiếu thứ bạn đang dùng với tên gọi bên AWS',
        detail: 'R2 ↔ S3, VPS ↔ EC2, Postgres tự quản ↔ RDS, cron ↔ EventBridge. Bạn đã biết việc, chỉ cần biết từ.',
      },
      {
        id: 'p4-2',
        text: 'Dựng một thứ nhỏ chạy thật trên AWS bậc miễn phí',
        detail: 'Một Lambda + S3 là đủ. Mục tiêu là chạm tay vào IAM và hiểu vì sao ai cũng kêu nó khó.',
      },
      {
        id: 'p4-3',
        text: 'Làm DỰ ÁN SỐ 5 — pipeline gom tin tuyển dụng',
        detail: 'Chính là thứ aitmpl đang làm, và làm khá ẩu. Bạn làm bản tốt hơn: bỏ trùng, gỡ tin cũ, nhãn công nghệ đọc từ JD thật thay vì đoán.',
      },
      {
        id: 'p4-4',
        text: 'Làm pipeline chạy lại được mà không hỏng dữ liệu',
        detail: 'Chạy hai lần phải ra cùng kết quả, không nhân đôi bản ghi. Đây là câu hỏi phỏng vấn kinh điển về data engineering.',
      },
      {
        id: 'p4-5',
        text: 'Học đọc EXPLAIN ANALYZE của PostgreSQL',
        detail: 'Lấy một truy vấn chậm có thật trong dự án, đọc kế hoạch thực thi, thêm index, đo lại. Ghi lại số trước/sau.',
      },
    ],
    milestone: 'Pipeline chạy tự động theo lịch trong 7 ngày liên tục mà không cần can thiệp tay.',
    output: 'Một hệ thống dữ liệu chạy thật + con số tối ưu truy vấn để kể.',
  },

  {
    id: 'p5',
    no: 5,
    title: 'Kể lại được',
    span: 'Tuần 17–20',
    goal: 'Biến mọi thứ đã làm thành câu chuyện kể được bằng tiếng Anh trong 3 phút, và qua được vòng phỏng vấn kỹ thuật.',
    why: 'Đây là chặng nhiều người tự học bỏ qua rồi trượt oan. 63 tin đòi thiết kế hệ thống và 46 tin đòi giao tiếp — cả hai đều được kiểm bằng cách BẠN NÓI, không phải bằng kho mã của bạn. Làm được mà không kể được thì trong mắt nhà tuyển dụng là chưa làm được.',
    skills: ['sysdesign', 'english', 'ownership', 'startup', 'customer'],
    tasks: [
      {
        id: 'p5-1',
        text: 'Viết case study tiếng Anh cho 3 vấn đề khó nhất đã giải',
        detail: 'Dự án số 8. Khung cố định: bối cảnh → triệu chứng → chẩn đoán sai lúc đầu → nguyên nhân thật → cách sửa → bài học. Lấy thẳng từ bảng Known Error Patterns trong CLAUDE.md.',
      },
      {
        id: 'p5-2',
        text: 'Vẽ sơ đồ kiến trúc cuongthai.com trên một trang giấy',
        detail: 'Phải vẽ lại được từ trí nhớ trong 5 phút khi phỏng vấn. Tập vẽ vài lần.',
      },
      {
        id: 'p5-3',
        text: 'Chuẩn bị câu trả lời cho 3 câu hỏi chắc chắn bị hỏi',
        detail: '"Nếu lượng người dùng gấp 100 lần thì hỏng ở đâu trước?" · "Vì sao chọn kiến trúc này?" · "Lần hỏng nặng nhất là gì và bạn sửa ra sao?"',
      },
      {
        id: 'p5-4',
        text: 'Tập nói to, bấm giờ 3 phút, tự ghi âm rồi nghe lại',
        detail: 'Nghe lại chính mình là cách sửa nhanh nhất, dù rất ngại. Bạn đã có khoá giao tiếp 30 ngày trên site — dùng đúng kỹ thuật ở đó.',
      },
      {
        id: 'p5-5',
        text: 'Làm một buổi phỏng vấn thử bằng tiếng Anh',
        detail: 'Bạn có sẵn Interview Simulator trong dự án — dùng chính công cụ mình làm ra.',
      },
      {
        id: 'p5-6',
        text: 'Rà lại toàn bộ hồ sơ và nộp đợt hai',
        detail: 'Lúc này bạn có: agent có evals, MCP server, service Python, pipeline, test + observability, 3 case study tiếng Anh. Hồ sơ đã khác hẳn 20 tuần trước.',
      },
    ],
    milestone: 'Kể trọn một dự án bằng tiếng Anh trong 3 phút, không đọc giấy, người nghe hiểu được.',
    output: 'Bộ hồ sơ hoàn chỉnh, sẵn sàng cho nhóm A và bắt đầu chạm được nhóm B.',
  },

  {
    id: 'p6',
    no: 6,
    title: 'Tiếng Anh — chạy song song cả 20 tuần',
    span: 'Mỗi ngày, xuyên suốt',
    goal: 'Viết được cập nhật công việc mạch lạc và họp thoại được, đủ để làm từ xa với team nước ngoài.',
    why: 'Đây KHÔNG phải một chặng riêng, vì gộp thành chặng riêng thì nó luôn bị đẩy xuống cuối rồi bỏ dở. 46 tin đòi giao tiếp; mọi việc nhóm A đều là hợp đồng từ xa. Tin Agentic Operator ở Sài Gòn ghi thẳng: "tiếng Anh nói và viết mạnh, và ngày càng mạnh hơn". Code giỏi mà không viết nổi cập nhật tiến độ thì vẫn không ai nhận.',
    skills: ['english', 'customer'],
    tasks: [
      {
        id: 'p6-1',
        text: 'Mỗi ngày: viết mô tả PR bằng tiếng Anh trong chính kho này',
        detail: 'Ba dòng cũng được: thay đổi gì, vì sao, kiểm thế nào. Đều đặn quan trọng hơn dài.',
      },
      {
        id: 'p6-2',
        text: 'Mỗi tuần: viết một đoạn 150 từ kể một thứ vừa sửa',
        detail: 'Chính là khung trả lời phỏng vấn. Viết 20 tuần là có 20 câu chuyện sẵn sàng.',
      },
      {
        id: 'p6-3',
        text: 'Giữ lộ trình IELTS và khoá giao tiếp 30 ngày đang học',
        detail: 'Chúng không phải việc phụ. Trong bối cảnh này chúng là việc chính — thứ mở khoá toàn bộ phần còn lại.',
      },
      {
        id: 'p6-4',
        text: 'Đọc JD gốc bằng tiếng Anh, đừng đọc bản dịch',
        detail: 'Vừa luyện đọc vừa nhặt đúng từ mà nhà tuyển dụng dùng — rồi dùng lại chính những từ đó trong hồ sơ.',
      },
      {
        id: 'p6-5',
        text: 'Đổi giao diện máy tính và điện thoại sang tiếng Anh',
        detail: 'Rẻ, không tốn thời gian học, mà tiếp xúc mỗi ngày.',
      },
    ],
    milestone: 'Viết được một đoạn 150 từ kể một sự cố kỹ thuật mà người bản ngữ đọc không phải hỏi lại.',
    output: 'Thứ quyết định bạn có nhận được việc từ xa hay không.',
  },
];

/** Tổng số việc cần tick — tính từ dữ liệu, đừng gõ tay. */
export const TOTAL_TASKS = PHASES.reduce((n, p) => n + p.tasks.length, 0);
