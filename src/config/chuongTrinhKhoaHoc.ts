/**
 * Chương trình đào tạo của /courses (khoá ngoài Academy) — 15 kỳ, 4 năm, mỗi kỳ 5 khoá.
 *
 * Ở đây chỉ có KHUNG: năm nào, kỳ nào, tên và mô tả (VI + EN). Khoá nào thuộc kỳ nào nằm trong CSDL
 * (`courses.lo_trinh_ky` + `lo_trinh_thu_tu`), gán bằng `scripts/gan-chuong-trinh-khoa-hoc.mjs` từ
 * `scripts/chuong-trinh-15-ky.json` hoặc sửa tay ở trang admin. Tách vậy để:
 *   - đổi câu chữ của kỳ = sửa mã + deploy, không cần migration;
 *   - thêm khoá mới không cần deploy — admin chọn kỳ, hoặc để trống thì khoá hiện ở mục "Khoá mới".
 *
 * App iOS đọc cùng hình dạng này qua `GET /api/v1/courses/chuong-trinh` — đổi tên trường ở đây là đổi
 * hợp đồng với app.
 */

export interface NamHoc {
  so: number;
  ten: string;
  tenEn: string;
  moTa: string;
  moTaEn: string;
}

export interface KyHoc {
  so: number;
  nam: number;
  ten: string;
  tenEn: string;
  /** Học xong kỳ này người học làm được gì — một câu, cụ thể. */
  moTa: string;
  moTaEn: string;
}

export const NAM_HOC: readonly NamHoc[] = [
  {
    so: 1,
    ten: 'Nền tảng',
    tenEn: 'Foundations',
    moTa: 'Làm quen công cụ nghề, một ngôn ngữ kiểu tĩnh và dựng giao diện web đầu tiên.',
    moTaEn: 'Learn the tools of the trade, a statically typed language and your first web interfaces.',
  },
  {
    so: 2,
    ten: 'Cốt lõi',
    tenEn: 'Core',
    moTa: 'Viết backend có cơ sở dữ liệu, đóng gói và đưa một sản phẩm full-stack thật lên mạng.',
    moTaEn: 'Build database-backed backends, then package and ship a real full-stack product.',
  },
  {
    so: 3,
    ten: 'Chuyên sâu',
    tenEn: 'Specialisation',
    moTa: 'Vận hành hệ thống, bảo mật ứng dụng, AI ứng dụng và xử lý dữ liệu ở quy mô lớn.',
    moTaEn: 'Operate systems, secure applications, apply AI and process data at scale.',
  },
  {
    so: 4,
    ten: 'Chuyên gia',
    tenEn: 'Mastery',
    moTa: 'Kiến trúc hệ thống đáng tin cậy, bảo mật nâng cao, công nghệ mới và bước ra nghề.',
    moTaEn: 'Design reliable architectures, master advanced security, explore new tech and go pro.',
  },
];

export const KY_HOC: readonly KyHoc[] = [
  {
    so: 1, nam: 1,
    ten: 'Nhập môn & công cụ của lập trình viên',
    tenEn: 'Introduction & the developer’s toolkit',
    moTa: 'Dựng trang web tĩnh, làm việc trên terminal Linux, quản lý mã bằng Git và phối hợp trong nhóm Scrum.',
    moTaEn: 'Build static web pages, work in a Linux terminal, manage code with Git and collaborate in a Scrum team.',
  },
  {
    so: 2, nam: 1,
    ten: 'Ngôn ngữ & tư duy kỹ thuật',
    tenEn: 'Languages & engineering thinking',
    moTa: 'Viết TypeScript và Python sạch, hiểu hệ điều hành chạy mã ra sao, viết test và làm việc cùng AI.',
    moTaEn: 'Write clean TypeScript and Python, understand how the OS runs your code, write tests and code alongside AI.',
  },
  {
    so: 3, nam: 1,
    ten: 'Frontend căn bản',
    tenEn: 'Frontend fundamentals',
    moTa: 'Dựng giao diện React/Next.js đẹp, dễ dùng, chuẩn SEO và đo được hành vi người dùng.',
    moTaEn: 'Ship polished, usable React/Next.js interfaces that rank in search and measure user behaviour.',
  },
  {
    so: 4, nam: 2,
    ten: 'Backend căn bản',
    tenEn: 'Backend fundamentals',
    moTa: 'Viết REST API bằng Node.js trên PostgreSQL và Prisma, có đăng nhập an toàn và bộ nhớ đệm Redis.',
    moTaEn: 'Build Node.js REST APIs on PostgreSQL and Prisma, with secure authentication and Redis caching.',
  },
  {
    so: 5, nam: 2,
    ten: 'Đưa sản phẩm lên mạng',
    tenEn: 'Shipping to production',
    moTa: 'Đóng gói bằng Docker, cấu hình Nginx, tự deploy lên VPS và đám mây với CI/CD GitHub Actions.',
    moTaEn: 'Containerise with Docker, configure Nginx, and deploy to a VPS and the cloud with GitHub Actions CI/CD.',
  },
  {
    so: 6, nam: 2,
    ten: 'Full-stack thực chiến',
    tenEn: 'Full-stack in practice',
    moTa: 'Làm trọn một ứng dụng thật: realtime, lưu tệp và xử lý ảnh/video, nhận thanh toán trực tuyến.',
    moTaEn: 'Build a complete real-world app: realtime features, file storage, image/video processing and online payments.',
  },
  {
    so: 7, nam: 2,
    ten: 'Backend nâng cao',
    tenEn: 'Advanced backend',
    moTa: 'Thiết kế API bền vững, viết dịch vụ bằng Spring Boot và FastAPI, chạy job nền và gửi email đáng tin cậy.',
    moTaEn: 'Design durable APIs, build services in Spring Boot and FastAPI, run background jobs and deliver email reliably.',
  },
  {
    so: 8, nam: 3,
    ten: 'Vận hành hệ thống',
    tenEn: 'Systems operations',
    moTa: 'Giám sát hệ thống đang chạy, dựng hạ tầng bằng mã, vận hành Kubernetes và đo tải trước khi sự cố tới.',
    moTaEn: 'Monitor live systems, define infrastructure as code, run Kubernetes and load-test before incidents happen.',
  },
  {
    so: 9, nam: 3,
    ten: 'An toàn thông tin nền tảng',
    tenEn: 'Security foundations',
    moTa: 'Nhận diện và vá lỗ hổng web, mô hình hoá mối đe doạ, dùng mật mã đúng cách và tuân thủ luật dữ liệu.',
    moTaEn: 'Find and fix web vulnerabilities, model threats, use cryptography correctly and comply with data-protection law.',
  },
  {
    so: 10, nam: 3,
    ten: 'Trí tuệ nhân tạo ứng dụng',
    tenEn: 'Applied artificial intelligence',
    moTa: 'Nắm toán nền của học máy, huấn luyện mô hình và xây ứng dụng LLM có RAG trên dữ liệu của chính mình.',
    moTaEn: 'Master the maths behind machine learning, train models and build LLM apps with RAG over your own data.',
  },
  {
    so: 11, nam: 3,
    ten: 'Dữ liệu lớn',
    tenEn: 'Big data',
    moTa: 'Phân tích thống kê, dựng tìm kiếm toàn văn và xây đường ống dữ liệu luồng/lô với Kafka và Spark.',
    moTaEn: 'Analyse data statistically, build full-text search and design streaming and batch pipelines with Kafka and Spark.',
  },
  {
    so: 12, nam: 4,
    ten: 'Bảo mật nâng cao',
    tenEn: 'Advanced security',
    moTa: 'Bảo vệ mạng và hạ tầng đám mây, chống DDoS, phát hiện xâm nhập bằng SIEM và phân tích mã độc.',
    moTaEn: 'Defend networks and cloud infrastructure, mitigate DDoS, detect intrusions with a SIEM and analyse malware.',
  },
  {
    so: 13, nam: 4,
    ten: 'Kiến trúc & độ tin cậy',
    tenEn: 'Architecture & reliability',
    moTa: 'Thiết kế hệ thống phân tán chịu tải, chọn kiến trúc phù hợp và trực sự cố theo chuẩn SRE.',
    moTaEn: 'Design distributed systems that scale, choose the right architecture and run on-call the SRE way.',
  },
  {
    so: 14, nam: 4,
    ten: 'Công nghệ mới',
    tenEn: 'Emerging technologies',
    moTa: 'Xây và đánh giá AI agent, vận hành mô hình trong production, làm app di động và hợp đồng thông minh.',
    moTaEn: 'Build and evaluate AI agents, run models in production, ship mobile apps and write smart contracts.',
  },
  {
    so: 15, nam: 4,
    ten: 'Ra nghề',
    tenEn: 'Launching your career',
    moTa: 'Vượt phỏng vấn kỹ thuật, tự ra mắt sản phẩm có doanh thu và xây thương hiệu cá nhân bằng nội dung.',
    moTaEn: 'Pass technical interviews, launch a product that earns revenue and build a personal brand through content.',
  },
];

export const SO_KY = KY_HOC.length;

/** Kỳ hợp lệ? (1..SO_KY, số nguyên). Dùng cho validate admin + script gán. */
export function kyHopLe(ky: unknown): ky is number {
  return typeof ky === 'number' && Number.isInteger(ky) && ky >= 1 && ky <= SO_KY;
}

export interface MonTrongKy {
  loTrinhKy: number | null;
  loTrinhThuTu: number | null;
  title: string;
}

export interface KyCoMon<M> extends KyHoc {
  mon: M[];
}

export interface NamCoKy<M> extends NamHoc {
  ky: KyCoMon<M>[];
}

/**
 * Xếp danh sách khoá (đã lọc: chỉ khoá xuất bản, ngoài Academy) vào khung năm → kỳ.
 * Khoá có `loTrinhKy` ngoài 1..SO_KY (dữ liệu lệch) bị coi như CHƯA XẾP — hiện ở "Khoá mới", không mất.
 * Trong kỳ: theo `loTrinhThuTu` tăng dần (NULL xuống cuối), hoà thì theo tên.
 */
export function xepChuongTrinh<M extends MonTrongKy>(ds: M[]): { nam: NamCoKy<M>[]; chuaXep: M[] } {
  const theoKy = new Map<number, M[]>();
  const chuaXep: M[] = [];
  for (const m of ds) {
    if (kyHopLe(m.loTrinhKy)) {
      const arr = theoKy.get(m.loTrinhKy) ?? [];
      arr.push(m);
      theoKy.set(m.loTrinhKy, arr);
    } else {
      chuaXep.push(m);
    }
  }
  const thuTu = (a: M, b: M) =>
    (a.loTrinhThuTu ?? Number.MAX_SAFE_INTEGER) - (b.loTrinhThuTu ?? Number.MAX_SAFE_INTEGER)
    || a.title.localeCompare(b.title);

  const nam = NAM_HOC.map((n) => ({
    ...n,
    ky: KY_HOC.filter((k) => k.nam === n.so).map((k) => ({
      ...k,
      mon: (theoKy.get(k.so) ?? []).sort(thuTu),
    })),
  }));
  return { nam, chuaXep };
}

/* ─────────────── Môn tự chọn · Sắp ra mắt (khoá status = COMING_SOON) ─────────────── */

export interface NhomTuChon {
  ma: string;
  ten: string;
  tenEn: string;
  /** Slug khoá thuộc nhóm, theo thứ tự hiện. Khoá "Sắp ra mắt" không có ở đây ⇒ nhóm "Môn khác" (không bao giờ mất). */
  slugs: readonly string[];
}

export const NHOM_TU_CHON: readonly NhomTuChon[] = [
  { ma: 'mobile', ten: 'Mobile', tenEn: 'Mobile', slugs: ['ios-swift-swiftui', 'android-kotlin-compose'] },
  {
    ma: 'kien-truc-backend', ten: 'Kiến trúc & Backend', tenEn: 'Architecture & Backend',
    slugs: [
      'cau-truc-du-lieu-giai-thuat', 'design-patterns-clean-code', 'golang',
      'domain-driven-design', 'microservices-event-driven', 'platform-engineering',
    ],
  },
  { ma: 'ai', ten: 'AI', tenEn: 'AI', slugs: ['ky-su-dung-agent-ai', 'ai-engineering-thuc-chien'] },
  { ma: 'nghe-nghiep', ten: 'Nghề nghiệp', tenEn: 'Career', slugs: ['tieng-anh-it-viet-tai-lieu', 'tech-lead'] },
];

const NHOM_KHAC = { ma: 'khac', ten: 'Môn khác', tenEn: 'Other' } as const;

/** Chia khoá "Sắp ra mắt" theo nhóm (thứ tự nhóm + thứ tự slug như khai ở trên). Nhóm rỗng bị bỏ. */
export function nhomSapRaMat<M extends { slug: string; title: string }>(
  ds: M[],
): Array<{ ma: string; ten: string; tenEn: string; mon: M[] }> {
  const daXep = new Set<string>();
  const ra: Array<{ ma: string; ten: string; tenEn: string; mon: M[] }> = [];
  for (const n of NHOM_TU_CHON) {
    const mon = n.slugs.map((sl) => ds.find((m) => m.slug === sl)).filter((m): m is M => Boolean(m));
    mon.forEach((m) => daXep.add(m.slug));
    if (mon.length) ra.push({ ma: n.ma, ten: n.ten, tenEn: n.tenEn, mon });
  }
  const conLai = ds.filter((m) => !daXep.has(m.slug)).sort((a, b) => a.title.localeCompare(b.title));
  if (conLai.length) ra.push({ ...NHOM_KHAC, mon: conLai });
  return ra;
}
