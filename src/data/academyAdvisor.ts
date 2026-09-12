/**
 * academyAdvisor.ts — DỮ LIỆU NEO cho "Phòng tư vấn chọn ngành hẹp" ở /academy.
 *
 * Vì sao có file này: phần tư vấn dùng AI, nhưng SỐ LIỆU/SỰ THẬT (ngôn ngữ, sản
 * phẩm thật, ưu/nhược, mức thị trường, link báo cáo) phải CHÍNH XÁC, không để AI
 * bịa. AI chỉ diễn giải, so sánh, nối với môn Academy dựa trên đúng các sự thật
 * dưới đây. Frontend cũng đọc chính data này để vẽ thẻ so sánh + biểu đồ, nên
 * một nguồn duy nhất, không lệch.
 *
 * Mức 1–5 là ĐỊNH TÍNH (tương đối ở thị trường VN, cập nhật thủ công) — con số
 * lương/nhu cầu CHÍNH XÁC nằm ở các báo cáo được LINK (TopDev, ITviec, VietnamWorks).
 * v1 tập trung khối CNTT (nhất là các chuyên ngành hẹp SE) — đúng phạm vi người
 * dùng hỏi (ví dụ Node.JS). Khối khác bổ sung sau.
 */

export interface AdvisorLink {
  label: string;
  url: string;
}

/**
 * Thống kê thị trường cho MỘT khu vực (VN hoặc toàn cầu) — để thẻ so sánh
 * "Việt Nam vs Toàn cầu" vẽ song song. Số 1–5 định tính, khoảng lương là
 * chuỗi, kèm nhận định 1 câu và nguồn thống kê THẬT.
 */
export interface MarketStat {
  /** 1 → 5: nhu cầu tuyển (định tính, theo khu vực). */
  demand: number;
  /** 1 → 5: mặt bằng lương (định tính, theo khu vực). */
  salary: number;
  /** Khoảng lương — VN: VNĐ/tháng; Global: USD/năm. */
  salaryRange: string;
  /** 1 câu nhận định thị trường (tiếng Việt). */
  note: string;
  /** Nguồn thống kê THẬT (báo cáo/khảo sát lương hợp pháp). */
  sources: AdvisorLink[];
}

export interface AdvisorSpec {
  /** khớp combo.id (khối IT) hoặc major/combo id các khối khác. */
  key: string;
  facultyId: string;
  majorId: string;
  comboId?: string;
  nameVi: string;
  icon: string;
  /** Ngôn ngữ/công nghệ chính (chuỗi ngắn để hiện chip). */
  languages: string[];
  /** Làm ra được gì: web/app/nhúng/game… */
  builds: string[];
  /** Sản phẩm/công ty THẬT dùng hướng công nghệ này. */
  products: string[];
  pros: string[];
  cons: string[];
  /** 1 (dễ vào) → 5 (khó, cần nền toán/thuật toán mạnh). */
  difficulty: number;
  /** 1 → 5: nhu cầu tuyển ở VN (định tính). */
  demand: number;
  /** 1 → 5: mặt bằng lương (định tính). */
  salary: number;
  /** Khoảng lương ĐỊNH TÍNH (VND/tháng, junior→mid) — số chính xác xem báo cáo. */
  salaryRange: string;
  /** Mã môn Academy tiêu biểu của hướng này (nối với môn người học đã học). */
  academyCourses: string[];
  /** Mẫu code ngắn để so sánh cú pháp (ngôn ngữ + code). */
  codeSample: { language: string; label: string; code: string };
  reports: AdvisorLink[];
  /** Thị trường VIỆT NAM cho hướng này (lương VNĐ/tháng). */
  vietnam: MarketStat;
  /** Thị trường TOÀN CẦU cho hướng này (lương USD/năm). */
  global: MarketStat;
  /** Nơi thường tuyển hướng này — nền tảng việc + công ty/loại hình. */
  hiring: AdvisorLink[];
}

/** Báo cáo thị trường tuyển dụng IT ở VN — nguồn THẬT, dùng chung nhiều ngành. */
export const MARKET_REPORTS: AdvisorLink[] = [
  { label: 'TopDev — Báo cáo thị trường IT Việt Nam', url: 'https://topdev.vn/blog/bao-cao-thi-truong-it-viet-nam/' },
  { label: 'ITviec — Báo cáo lương & thị trường IT', url: 'https://itviec.com/blog/bao-cao-luong-it/' },
  { label: 'VietnamWorks inTECH — Lương ngành CNTT', url: 'https://www.vietnamworks.com/' },
  { label: 'Stack Overflow Developer Survey', url: 'https://survey.stackoverflow.co/' },
];

export const ADVISOR_SPECS: AdvisorSpec[] = [
  {
    key: 'react-nodejs', facultyId: 'it', majorId: 'se', comboId: 'react-nodejs',
    nameVi: 'React / Node.JS (Full-stack JS)', icon: '⚛️',
    languages: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    builds: ['Web app (SPA)', 'REST / real-time API', 'Web bảng điều khiển', 'Ứng dụng thời gian thực (chat, bảng tin)'],
    products: ['Facebook (React)', 'Netflix (Node.js ở backend)', 'PayPal (Node.js)', 'Airbnb, Uber (React)'],
    pros: ['Một ngôn ngữ (JS) cho cả frontend lẫn backend', 'Cộng đồng & việc làm CỰC nhiều ở VN', 'Vào nghề nhanh, nhiều tài nguyên'],
    cons: ['Hệ sinh thái đổi nhanh, phải học liên tục', 'JS "lỏng" — dễ sai kiểu nếu không dùng TypeScript'],
    difficulty: 2, demand: 5, salary: 4, salaryRange: '12–35 triệu (junior→mid)',
    academyCourses: ['FER202', 'PRJ301', 'PRN232', 'WDP301', 'SWP391'],
    codeSample: {
      language: 'javascript', label: 'Node.js — REST API tối giản (Express)',
      code: "import express from 'express';\nconst app = express();\napp.get('/api/hello', (req, res) => {\n  res.json({ message: 'Xin chao tu Node.js!' });\n});\napp.listen(3000);",
    },
    reports: MARKET_REPORTS,
    vietnam: {
      demand: 5, salary: 4, salaryRange: '12–35 triệu/tháng (junior→mid)',
      note: 'VN tuyển RẤT nhiều fresher React/Node cho outsourcing & startup; cạnh tranh cao ở bậc fresher nhưng thoáng dần và lương bật nhanh từ mid.',
      sources: [
        { label: 'ITviec — Báo cáo lương IT', url: 'https://itviec.com/blog/bao-cao-luong-it/' },
        { label: 'TopDev — Thị trường IT Việt Nam', url: 'https://topdev.vn/blog/bao-cao-thi-truong-it-viet-nam/' },
        { label: 'VietnamWorks', url: 'https://www.vietnamworks.com/' },
      ],
    },
    global: {
      demand: 5, salary: 4, salaryRange: '$60k–$120k/năm (junior→mid, US/EU)',
      note: 'Full-stack JS là nhóm phổ biến nhất toàn cầu (Stack Overflow Survey); nhiều việc remote nhưng cũng đông ứng viên nên phải nổi bật bằng sản phẩm thật.',
      sources: [
        { label: 'Stack Overflow Developer Survey', url: 'https://survey.stackoverflow.co/' },
        { label: 'levels.fyi', url: 'https://www.levels.fyi/' },
        { label: 'Glassdoor', url: 'https://www.glassdoor.com/' },
      ],
    },
    hiring: [
      { label: 'ITviec', url: 'https://itviec.com/' },
      { label: 'TopCV', url: 'https://www.topcv.vn/' },
      { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' },
      { label: 'Upwork (freelance)', url: 'https://www.upwork.com/' },
      { label: 'RemoteOK (việc remote)', url: 'https://remoteok.com/' },
    ],
  },
  {
    key: 'dotnet', facultyId: 'it', majorId: 'se', comboId: 'dotnet',
    nameVi: '.NET (C#)', icon: '🟣',
    languages: ['C#', '.NET', 'ASP.NET Core', 'Blazor'],
    builds: ['Web API / web doanh nghiệp', 'App Windows / desktop', 'Dịch vụ backend quy mô lớn', 'Game (Unity dùng C#)'],
    products: ['Stack Overflow (.NET)', 'Microsoft (Azure, Office)', 'nhiều ngân hàng & ERP doanh nghiệp'],
    pros: ['Ngôn ngữ mạnh mẽ, gõ kiểu chặt (ít lỗi runtime)', 'Rất được ưa ở công ty doanh nghiệp/ngân hàng', 'Cùng C# làm được cả web lẫn game Unity'],
    cons: ['Trước đây gắn Windows (nay .NET Core đa nền tảng rồi)', 'Ít "hot" hơn JS ở startup nhỏ'],
    difficulty: 3, demand: 4, salary: 4, salaryRange: '13–38 triệu (junior→mid)',
    academyCourses: ['PRN212', 'PRN222', 'PRN232', 'PRU213', 'SWD392'],
    codeSample: {
      language: 'csharp', label: 'C# — Web API tối giản (ASP.NET Core)',
      code: "var app = WebApplication.Create(args);\napp.MapGet(\"/api/hello\", () =>\n    new { message = \"Xin chao tu C#!\" });\napp.Run();",
    },
    reports: MARKET_REPORTS,
    vietnam: {
      demand: 4, salary: 4, salaryRange: '13–38 triệu/tháng (junior→mid)',
      note: 'Nhu cầu .NET ở VN bền vững nhờ ngân hàng, ERP và outsourcing doanh nghiệp; ít "hot" ở startup nhưng việc ổn định, ít biến động.',
      sources: [
        { label: 'ITviec — Báo cáo lương IT', url: 'https://itviec.com/blog/bao-cao-luong-it/' },
        { label: 'TopDev — Thị trường IT Việt Nam', url: 'https://topdev.vn/blog/bao-cao-thi-truong-it-viet-nam/' },
        { label: 'TopCV', url: 'https://www.topcv.vn/' },
      ],
    },
    global: {
      demand: 4, salary: 4, salaryRange: '$65k–$125k/năm (junior→mid, US/EU)',
      note: 'C#/.NET đứng vững trong nhóm ngôn ngữ phổ biến toàn cầu, mạnh ở doanh nghiệp lớn và fintech; lương ổn định, ít trồi sụt theo trào lưu.',
      sources: [
        { label: 'Stack Overflow Developer Survey', url: 'https://survey.stackoverflow.co/' },
        { label: 'levels.fyi', url: 'https://www.levels.fyi/' },
        { label: 'Glassdoor', url: 'https://www.glassdoor.com/' },
      ],
    },
    hiring: [
      { label: 'ITviec', url: 'https://itviec.com/' },
      { label: 'TopCV', url: 'https://www.topcv.vn/' },
      { label: 'FPT Software', url: 'https://www.fpt-software.com/' },
      { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' },
      { label: 'Ngân hàng & ERP (Techcombank, MISA…)', url: 'https://www.misa.vn/' },
    ],
  },
  {
    key: 'java', facultyId: 'it', majorId: 'se', comboId: 'java',
    nameVi: 'Java chuyên sâu', icon: '☕',
    languages: ['Java', 'Spring Boot', 'JPA/Hibernate'],
    builds: ['Hệ thống backend lớn', 'Ứng dụng ngân hàng/tài chính', 'App Android (nền Java/Kotlin)', 'Microservices'],
    products: ['Google (nhiều hệ thống)', 'ngân hàng & viễn thông VN', 'LinkedIn, Amazon (backend)'],
    pros: ['Rất ổn định, chạy hệ thống lớn nhiều năm', 'Nhu cầu tuyển ở ngân hàng/doanh nghiệp cao & bền', 'Nền tảng vững để lên vị trí senior/kiến trúc'],
    cons: ['Dài dòng hơn Python/JS', 'Khởi động dự án nặng hơn'],
    difficulty: 3, demand: 4, salary: 4, salaryRange: '13–40 triệu (junior→mid)',
    academyCourses: ['PRO192', 'PRJ301', 'PRJ302', 'HSF302', 'SWP391'],
    codeSample: {
      language: 'java', label: 'Java — REST controller (Spring Boot)',
      code: "@RestController\npublic class HelloController {\n  @GetMapping(\"/api/hello\")\n  public Map<String,String> hello() {\n    return Map.of(\"message\", \"Xin chao tu Java!\");\n  }\n}",
    },
    reports: MARKET_REPORTS,
    vietnam: {
      demand: 4, salary: 4, salaryRange: '13–40 triệu/tháng (junior→mid)',
      note: 'Java là "xương sống" tuyển dụng ở ngân hàng, viễn thông và các công ty lớn (Naver/LINE, FPT); cầu ổn định và bền, lương senior/kiến trúc rất tốt.',
      sources: [
        { label: 'ITviec — Báo cáo lương IT', url: 'https://itviec.com/blog/bao-cao-luong-it/' },
        { label: 'TopDev — Thị trường IT Việt Nam', url: 'https://topdev.vn/blog/bao-cao-thi-truong-it-viet-nam/' },
        { label: 'VietnamWorks', url: 'https://www.vietnamworks.com/' },
      ],
    },
    global: {
      demand: 4, salary: 4, salaryRange: '$70k–$130k/năm (junior→mid, US/EU)',
      note: 'Java giữ vị trí backend chủ lực ở doanh nghiệp và fintech toàn cầu; lương nhỉnh hơn nhiều web JS nhờ hệ thống lớn, nhưng ít việc remote fresher hơn.',
      sources: [
        { label: 'Stack Overflow Developer Survey', url: 'https://survey.stackoverflow.co/' },
        { label: 'levels.fyi', url: 'https://www.levels.fyi/' },
        { label: 'Glassdoor', url: 'https://www.glassdoor.com/' },
      ],
    },
    hiring: [
      { label: 'ITviec', url: 'https://itviec.com/' },
      { label: 'TopCV', url: 'https://www.topcv.vn/' },
      { label: 'FPT Software', url: 'https://www.fpt-software.com/' },
      { label: 'LINE / Naver VN', url: 'https://careers.linecorp.com/' },
      { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' },
    ],
  },
  {
    key: 'ai', facultyId: 'it', majorId: 'se', comboId: 'ai',
    nameVi: 'Trí tuệ nhân tạo (AI)', icon: '🧠',
    languages: ['Python', 'TensorFlow', 'PyTorch'],
    builds: ['Mô hình học máy / học sâu', 'Nhận diện ảnh, xử lý ngôn ngữ', 'Hệ khuyến nghị', 'Chatbot / AI tạo sinh'],
    products: ['ChatGPT (OpenAI)', 'Google Dịch, YouTube gợi ý', 'Tesla Autopilot', 'Netflix gợi ý phim'],
    pros: ['Ngành "nóng" nhất, lương cao, nhiều tiềm năng', 'Ứng dụng khắp mọi lĩnh vực', 'Rất hợp bạn thích toán & dữ liệu'],
    cons: ['Cần nền TOÁN (đại số tuyến tính, xác suất) mạnh', 'Vào nghề khó hơn, thường cần học sâu/kiên trì', 'Cần dữ liệu & máy tính mạnh để thực hành'],
    difficulty: 5, demand: 4, salary: 5, salaryRange: '15–50 triệu (junior→mid, cao hơn khi giỏi)',
    academyCourses: ['AIL304m', 'DPL303m', 'DBM301', 'MAE101', 'MAS291'],
    codeSample: {
      language: 'python', label: 'Python — mạng nơ-ron tối giản (TensorFlow)',
      code: "import tensorflow as tf\nmodel = tf.keras.Sequential([\n  tf.keras.layers.Dense(64, activation='relu'),\n  tf.keras.layers.Dense(10, activation='softmax'),\n])\nmodel.compile(optimizer='adam', loss='categorical_crossentropy')",
    },
    reports: MARKET_REPORTS,
    vietnam: {
      demand: 4, salary: 5, salaryRange: '15–50 triệu/tháng (junior→mid, cao hơn khi giỏi)',
      note: 'VN đang khát kỹ sư AI (VinAI, FPT.AI, Zalo AI) nhưng cửa vào hẹp — hầu hết vị trí đòi nền toán mạnh và thường ưu tiên bằng thạc sĩ/nghiên cứu.',
      sources: [
        { label: 'ITviec — Báo cáo lương IT', url: 'https://itviec.com/blog/bao-cao-luong-it/' },
        { label: 'TopDev — Thị trường IT Việt Nam', url: 'https://topdev.vn/blog/bao-cao-thi-truong-it-viet-nam/' },
        { label: 'VietnamWorks', url: 'https://www.vietnamworks.com/' },
      ],
    },
    global: {
      demand: 5, salary: 5, salaryRange: '$90k–$180k/năm (junior→mid, US/EU; cao hơn ở big tech)',
      note: 'AI/ML là nhóm lương cao nhất và tăng nóng nhất toàn cầu; cạnh tranh gắt, nhưng người có sản phẩm/nghiên cứu thật được săn đón mạnh.',
      sources: [
        { label: 'Stack Overflow Developer Survey', url: 'https://survey.stackoverflow.co/' },
        { label: 'State of AI Report', url: 'https://www.stateof.ai/' },
        { label: 'levels.fyi', url: 'https://www.levels.fyi/' },
      ],
    },
    hiring: [
      { label: 'ITviec', url: 'https://itviec.com/' },
      { label: 'VinAI', url: 'https://www.vinai.io/' },
      { label: 'FPT.AI', url: 'https://fpt.ai/' },
      { label: 'Zalo AI', url: 'https://zalo.ai/' },
      { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' },
    ],
  },
  {
    key: 'data-science', facultyId: 'it', majorId: 'se', comboId: 'data-science',
    nameVi: 'Khoa học dữ liệu ứng dụng', icon: '📊',
    languages: ['Python', 'SQL', 'Pandas', 'Power BI'],
    builds: ['Phân tích & trực quan dữ liệu', 'Dự báo kinh doanh', 'Data pipeline / ETL', 'Báo cáo & dashboard'],
    products: ['Spotify Wrapped', 'Grab/Shopee (phân tích hành vi)', 'ngân hàng (chống gian lận)'],
    pros: ['Cầu nối kỹ thuật & kinh doanh — nhiều ngành cần', 'Dễ vào hơn AI thuần, vẫn lương tốt', 'Kỹ năng SQL/phân tích dùng được ở mọi công ty'],
    cons: ['Cần cả thống kê lẫn kỹ năng kể chuyện bằng dữ liệu', 'Ranh giới với AI/BA đôi khi mờ'],
    difficulty: 4, demand: 4, salary: 4, salaryRange: '13–40 triệu (junior→mid)',
    academyCourses: ['DBM301', 'DBI202', 'MAS291', 'AIL304m'],
    codeSample: {
      language: 'python', label: 'Python — phân tích dữ liệu (pandas)',
      code: "import pandas as pd\ndf = pd.read_csv('sales.csv')\ntop = (df.groupby('country')['amount']\n         .sum().sort_values(ascending=False).head(5))\nprint(top)",
    },
    reports: MARKET_REPORTS,
    vietnam: {
      demand: 4, salary: 4, salaryRange: '13–40 triệu/tháng (junior→mid)',
      note: 'Ngân hàng và e-commerce (Shopee, Tiki) tuyển nhiều data analyst/DS; dễ vào hơn AI thuần, kỹ năng SQL/BI dùng được ở gần như mọi công ty.',
      sources: [
        { label: 'ITviec — Báo cáo lương IT', url: 'https://itviec.com/blog/bao-cao-luong-it/' },
        { label: 'TopDev — Thị trường IT Việt Nam', url: 'https://topdev.vn/blog/bao-cao-thi-truong-it-viet-nam/' },
        { label: 'VietnamWorks', url: 'https://www.vietnamworks.com/' },
      ],
    },
    global: {
      demand: 4, salary: 4, salaryRange: '$70k–$130k/năm (junior→mid, US/EU)',
      note: 'Nhu cầu data toàn cầu rộng và trải khắp ngành; lương thấp hơn ML engineer nhưng cửa vào rộng hơn, nhiều vai trò lai với analytics/BI.',
      sources: [
        { label: 'Stack Overflow Developer Survey', url: 'https://survey.stackoverflow.co/' },
        { label: 'Kaggle State of Data Science & ML Survey', url: 'https://www.kaggle.com/' },
        { label: 'Glassdoor', url: 'https://www.glassdoor.com/' },
      ],
    },
    hiring: [
      { label: 'ITviec', url: 'https://itviec.com/' },
      { label: 'TopCV', url: 'https://www.topcv.vn/' },
      { label: 'Shopee', url: 'https://careers.shopee.vn/' },
      { label: 'Tiki', url: 'https://tuyendung.tiki.vn/' },
      { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' },
    ],
  },
  {
    key: 'game-dev', facultyId: 'it', majorId: 'se', comboId: 'game-dev',
    nameVi: 'Phát triển Game', icon: '🎮',
    languages: ['C#', 'Unity', 'C++', 'Unreal'],
    builds: ['Game 2D/3D (PC, mobile, console)', 'Game thực tế ảo (VR/AR)', 'Mô phỏng tương tác'],
    products: ['Genshin Impact, Among Us (Unity)', 'PUBG, Fortnite (Unreal)', 'nhiều studio game VN (VNG, Amanotes)'],
    pros: ['Sáng tạo, đam mê — làm ra thứ chơi được', 'Kỹ năng C#/Unity cũng dùng cho app khác', 'Ngành giải trí VN đang lớn'],
    cons: ['Cạnh tranh cao, cần portfolio game thật', 'Đôi khi crunch (áp lực deadline ra mắt)', 'Cần chút toán/hình học & vật lý'],
    difficulty: 3, demand: 3, salary: 3, salaryRange: '10–30 triệu (junior→mid)',
    academyCourses: ['PRU213', 'PRU221m', 'FGU301', 'GDC301', 'AGU301'],
    codeSample: {
      language: 'csharp', label: 'C# (Unity) — di chuyển nhân vật',
      code: "void Update() {\n  float h = Input.GetAxis(\"Horizontal\");\n  transform.Translate(Vector3.right * h * speed * Time.deltaTime);\n}",
    },
    reports: MARKET_REPORTS,
    vietnam: {
      demand: 3, salary: 3, salaryRange: '10–30 triệu/tháng (junior→mid)',
      note: 'Số studio ở VN có hạn (VNG, Gameloft, Amanotes) nên vị trí ít hơn web/backend; cần portfolio game thật, đôi khi phải chấp nhận crunch.',
      sources: [
        { label: 'ITviec — Báo cáo lương IT', url: 'https://itviec.com/blog/bao-cao-luong-it/' },
        { label: 'TopDev — Thị trường IT Việt Nam', url: 'https://topdev.vn/blog/bao-cao-thi-truong-it-viet-nam/' },
        { label: 'TopCV', url: 'https://www.topcv.vn/' },
      ],
    },
    global: {
      demand: 4, salary: 4, salaryRange: '$55k–$110k/năm (junior→mid, US/EU)',
      note: 'Thị trường game toàn cầu lớn hơn hẳn VN, nhiều studio và cơ hội indie; đổi lại cạnh tranh cao và thu nhập biến động theo dự án ra mắt.',
      sources: [
        { label: 'Game Developer — Salary Survey', url: 'https://www.gamedeveloper.com/' },
        { label: 'Stack Overflow Developer Survey', url: 'https://survey.stackoverflow.co/' },
        { label: 'Glassdoor', url: 'https://www.glassdoor.com/' },
      ],
    },
    hiring: [
      { label: 'ITviec', url: 'https://itviec.com/' },
      { label: 'Gameloft', url: 'https://www.gameloft.com/' },
      { label: 'VNG Games', url: 'https://www.vng.com.vn/' },
      { label: 'Amanotes', url: 'https://www.amanotes.com/' },
      { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' },
    ],
  },
];

/** Câu hỏi GỢI Ý SẴN cho người dùng bấm — chia nhóm để robot trả lời chuyên sâu. */
export const ADVISOR_SUGGESTED_QUESTIONS: { group: string; icon: string; questions: string[] }[] = [
  {
    group: 'Chưa biết mình hợp gì', icon: '🧭',
    questions: [
      'Mình chưa biết điểm mạnh của mình là gì, làm sao để biết mình hợp ngành hẹp nào?',
      'Mình thích logic & giải đố nhưng ngại toán nặng — nên chọn ngành hẹp nào?',
      'Mình học lực trung bình, ngành hẹp nào dễ vào nghề nhất?',
    ],
  },
  {
    group: 'So sánh & thị trường', icon: '📊',
    questions: [
      'So sánh Node.JS và .NET: cái nào dễ xin việc và lương tốt hơn ở Việt Nam?',
      'Ngành hẹp nào đang tuyển nhiều nhất và có tương lai lâu dài nhất?',
      'AI và Khoa học dữ liệu khác nhau thế nào, cái nào khó hơn?',
    ],
  },
  {
    group: 'Dựa trên môn đã học', icon: '🎓',
    questions: [
      'Mình đã học Java và C ở kỳ 1-2-3, chuyển sang ngành hẹp nào thì tận dụng được nhiều nhất?',
      'Nếu chọn Node.JS thì mình sẽ code bằng ngôn ngữ gì và học thêm môn nào?',
      'Các môn mình đã học liên quan gì tới ngành hẹp mình đang cân nhắc?',
    ],
  },
  {
    group: 'Làm được gì & khó không', icon: '🚀',
    questions: [
      'Chọn Game thì làm ra được sản phẩm gì và có khó không?',
      'Ngành hẹp nào làm được app điện thoại? Web? Nhúng?',
      'Ưu và nhược điểm của từng ngành hẹp trong ngành của mình là gì?',
    ],
  },
];
