/**
 * Chuẩn bị trước khi nộp.
 *
 * Phần này tồn tại vì một lý do đo được: trong 108 tin, chỉ 1 tin nhắc tới
 * hỗ trợ visa, còn 36 tin chặn cứng theo địa lý. Nghĩa là con đường thật của
 * một dev ở Việt Nam KHÔNG phải "nộp thật nhiều rồi hy vọng", mà là nhắm
 * đúng nhóm nộp được rồi làm hồ sơ đủ mạnh cho nhóm đó.
 *
 * Các mẫu thư ở đây viết sẵn bằng tiếng Anh nhưng CỐ Ý để trống chỗ điền số —
 * hồ sơ dùng lại nguyên văn của người khác thì nhà tuyển dụng nhận ra ngay.
 */
import type { ApplyItem } from './types';

export const APPLY_ITEMS: ApplyItem[] = [
  {
    id: 'where',
    title: 'Săn việc ở đâu — đừng săn trên aitmpl',
    why: 'Trang aitmpl chỉ là bản sao chép lại, và sao khá ẩu: 12 tin trùng, 35 tin quá 90 ngày vẫn nằm nguyên, 14/20 nhãn công nghệ không hề có trong JD. Vào thẳng nguồn thì tin mới hơn và không bị bóc sai.',
    todo: [
      'HackerNews "Who is hiring?" — đăng vào ngày mùng 1 hằng tháng, là nguồn của 67/108 tin ở đây. Đây là nơi đáng vào nhất.',
      'Dùng Ctrl+F ngay trong chủ đề với: "REMOTE (worldwide)", "anywhere", "Asia", "GMT+7", "GMT+8". Bỏ qua mọi tin ghi "REMOTE (US)" — đó là đòi quyền lao động tại Mỹ, không phải làm từ xa toàn cầu.',
      'Trang tuyển dụng trực tiếp của công ty đã biết: wetheflywheel.com/en/careers (có bộ lọc Saigon và Vietnam), flywheelmotion.com/en/careers.',
      'RemoteOK và WeWorkRemotely — lọc theo "worldwide", đừng lọc theo "remote" chung chung.',
      'Công ty nước ngoài CÓ VĂN PHÒNG tại Việt Nam. Đây mới là đường vào thật, không phải visa Mỹ.',
    ],
  },
  {
    id: 'cv',
    title: 'Hồ sơ — bán thứ bạn đã dựng, đừng bán bằng cấp',
    why: '38 tin là startup nhỏ, và họ tìm một dấu hiệu duy nhất: người này đã tự làm ra thứ gì trọn vẹn chưa. Bạn có — một nền tảng nhiều module đang chạy production thật. Phần lớn ứng viên junior không có. Nên hồ sơ phải mở bằng cái đó, không phải mở bằng GPA.',
    todo: [
      'Dòng đầu tiên là dự án, không phải trường học. Trường để xuống cuối.',
      'Mỗi gạch đầu dòng phải có SỐ: bao nhiêu module, bao nhiêu bài học, bao nhiêu người dùng, thời gian triển khai còn bao nhiêu.',
      'Ghi rõ bạn tự vận hành production: Docker, CI/CD, triển khai không gián đoạn, migration. Rất nhiều dev đi làm vài năm vẫn chưa tự dựng.',
      'Về Claude Code: đừng ghi "thành thạo". Ghi thứ bạn đã ship bằng nó, và ghi cả chỗ bạn KHÔNG tin nó — đúng thứ mọi JD đang tìm.',
      'Giữ đúng một trang. Link GitHub và link site đặt ngay đầu trang.',
      'Đừng liệt kê 30 công nghệ. Liệt kê 8 thứ bạn dám bị hỏi sâu.',
    ],
    sample: [
      {
        label: 'Mở đầu hồ sơ — nên viết thế này',
        text: 'Full-stack developer. I built and run cuongthai.com end to end — a learning platform with [số] modules serving [số] users: Next.js frontend, Express/TypeScript API, PostgreSQL with Prisma, deployed on my own VPS with Docker and GitHub Actions, zero-downtime releases with automated smoke tests. I use Claude Code daily as an engineering tool, with a written project spec and a pre-push checklist that the agent must follow.',
      },
      {
        label: 'Nên tránh — nghe giống mọi hồ sơ khác',
        text: 'Passionate developer with strong knowledge of modern web technologies. Proficient in Claude Code, AI tools, React, Node.js, and more. Fast learner and team player looking for opportunities to grow.',
      },
    ],
  },
  {
    id: 'letter',
    title: 'Thư ứng tuyển — 150 từ, ba đoạn',
    why: 'Tin ở Sài Gòn ghi thẳng "không cần nền lập trình chính quy", tức là họ tuyển theo cách bạn tư duy chứ không theo bằng cấp. Thư dài không giúp gì; thư có một chi tiết cụ thể mới giúp.',
    todo: [
      'Đoạn 1: bạn đã tự dựng và đang vận hành cái gì. Một câu, có số.',
      'Đoạn 2: bạn dùng AI agent thế nào VÀ chỗ nào bạn không tin nó. Đoạn này quan trọng nhất.',
      'Đoạn 3: vì sao đúng vị trí này — nhắc một chi tiết có thật trong JD của họ.',
      'Nhắc là bạn thấy tin qua HackerNews nếu tin có yêu cầu (nhiều tin có).',
      'Không dùng mẫu có sẵn. Không dùng "I am writing to express my interest".',
    ],
    sample: [
      {
        label: 'Mẫu 150 từ — điền số vào chỗ ngoặc',
        text: 'I run cuongthai.com, a learning platform I built and deploy myself: Next.js, Express/TypeScript, PostgreSQL, Docker on a VPS, with CI that blocks a release when the post-deploy smoke test returns a 404.\n\nI use Claude Code every day, but I treat it as a fast collaborator that cannot see production. My repo has a written spec telling the agent what it must never do — reset the database, force-push, skip the type check. The failures I have hit were not model failures; they were missing guardrails. One release shipped a stale image and a route silently 404ed while the code on disk was correct. I now diagnose route health with curl, not the browser.\n\nYour posting says you hire engineers, not prompt operators. That is the part I want to be measured on.',
      },
    ],
  },
  {
    id: 'interview',
    title: 'Phỏng vấn — ba câu chắc chắn bị hỏi',
    why: '63 tin đòi thiết kế hệ thống. Câu hỏi luôn xoay quanh: bạn có hiểu thứ mình xây, hay chỉ ghép cho chạy. Với người dùng AI nhiều, họ sẽ dò kỹ hơn — nên phải chuẩn bị thật.',
    todo: [
      '"Vì sao chọn kiến trúc này?" — trả lời theo đánh đổi, đừng trả lời theo sở thích.',
      '"Nếu lượng người dùng gấp 100 lần thì hỏng ở đâu trước?" — chỉ ra đúng một điểm nghẽn cụ thể và cách bạn sẽ đo trước khi sửa.',
      '"Lần hỏng nặng nhất là gì?" — dùng thẳng một case study đã viết. Đừng giấu phần chẩn đoán sai lúc đầu.',
      '"Bạn dùng AI thế nào?" — câu bẫy. Trả lời sai là "nó viết hộ tôi". Trả lời đúng là: tôi giao việc rõ, tôi đọc lại, và đây là những chỗ tôi không cho nó đụng.',
      'Chuẩn bị 2 câu để HỎI LẠI họ. Không hỏi gì là dấu hiệu xấu.',
      'Luyện bằng Interview Simulator có sẵn trong chính dự án của bạn.',
    ],
  },
  {
    id: 'realistic',
    title: 'Kỳ vọng cho đúng — để không nản',
    why: 'Phần này không dễ nghe nhưng cần thiết. Nhìn thẳng vào số liệu thì rõ: chỉ 12/108 tin bạn nộp được ngay, mà bỏ trùng còn 8, và chỉ 4 tin còn tươi dưới 60 ngày. Biết trước con số này thì 20 lá thư không hồi âm là chuyện bình thường, không phải dấu hiệu bạn kém.',
    todo: [
      'Anthropic: 37 tin, tất cả từ Staff/Manager trở lên, ngồi tại Mỹ/Anh/Úc. Không có vị trí junior nào. Đây là mục tiêu 3–5 năm, không phải chỗ nộp năm nay.',
      'Nhóm B (Railway, ALBERT tới 750k USD, Grafana): nhận người ở bất cứ đâu nhưng đòi 5–15 năm. Chúng chờ được — ghi lại và quay lại sau.',
      'Việc thật khả thi ngay: hợp đồng bán thời gian, làm từ xa, trả theo giờ hoặc theo gói. Không hào nhoáng nhưng là bậc thang đầu tiên có thật.',
      'Một hợp đồng 3–6 tháng với công ty nước ngoài đáng giá hơn nhiều so với chờ một vị trí toàn thời gian hoàn hảo — vì nó cho bạn thứ đang thiếu: kinh nghiệm làm việc quốc tế ghi được vào hồ sơ.',
      'Đặt mục tiêu theo số lần nộp, đừng đặt theo số lần được nhận. Cái đầu bạn kiểm soát được, cái sau thì không.',
    ],
  },
];
