/**
 * Lộ trình 6 nghề cho tab Lộ trình (/courses?tab=lo-trinh, chế độ "🎯 Theo nghề").
 *
 * Thứ tự khoá mỗi nghề lấy ĐÚNG như backend `src/services/roadmap.seed.khoa-web.ts`
 * (HOC_TREN_WEB + chặng đầu của DATA_ENGINEER / CLOUD_ARCHITECT) — đổi ở đó thì đổi ở đây.
 * Kế hoạch: content/courses/_KE-HOACH-LO-TRINH-NGHE-0110.md — mỗi chủ đề MỘT khoá, các nghề
 * dùng chung tầng nền, dự án cuối khoá xoay quanh LabFlow AI (đặt lịch phòng lab, mượn thiết
 * bị, dữ liệu cảm biến AIoT, trợ lý AI — Spring Boot + React + PostgreSQL).
 *
 * "Học xong làm được gì" của từng khoá nằm ở roadmapData.ts → KHOA (viết một lần, dùng chung).
 */
import type { BuocHoc } from '../roadmapData';

export interface BuocNghe extends BuocHoc {
  /** Nhánh tuỳ chọn: mọc cạnh bậc thứ `canh` (đếm từ 1). */
  canh?: number;
}

export interface Nghe {
  slug: string;
  ten: string;
  /** Tên ngắn cho chip/bảng. */
  ngan: string;
  /** Tên icon lucide — map ở UI. */
  icon: 'Brain' | 'BarChart3' | 'Database' | 'Cloud' | 'Boxes' | 'Link2';
  hex: [string, string];
  moTa: string;
  /** Mắt xích của nghề này trong chuỗi dự án LabFlow AI. */
  labflow: string;
  buoc: BuocNghe[];
  tuyChon: BuocNghe[];
}

const LABFLOW = 'LabFlow AI';

export const NGHE: Nghe[] = [
  {
    slug: 'ai-engineer',
    ten: 'AI Engineer',
    ngan: 'AI Eng',
    icon: 'Brain',
    hex: ['#e879f9', '#9333ea'],
    moTa: 'Đưa AI vào sản phẩm thật: hiểu model từ toán tới mạng nơ-ron, rồi xây ứng dụng LLM, RAG, agent và vận hành chúng trên production.',
    labflow: 'Trợ lý AI của LabFlow: trả lời quy định phòng lab có trích nguồn, gợi ý lịch trống, cảnh báo cảm biến bất thường.',
    buoc: [
      { slug: 'python', ten: 'Python for Backend & AI', khung: true, viSao: 'Ngôn ngữ chung của AI và dữ liệu — mọi khoá phía sau đều viết bằng Python.',
        dongGop: 'Script đọc dữ liệu cảm biến và tài liệu quy định phòng lab của LabFlow, chuẩn bị đầu vào cho các bước sau.' },
      { slug: 'math-for-ml', ten: 'Toán cho ML', khung: true, viSao: 'Học một lần dùng cho cả ML lẫn DL — học trước để không phải dừng giữa chừng tra toán.',
        dongGop: 'Dự án cuối khoá: phát hiện bất thường cảm biến LabFlow (nhiệt độ, độ ẩm, điện năng) bằng numpy thuần.' },
      { slug: 'machine-learning', ten: 'Machine Learning Fundamentals', khung: true, viSao: 'Cần toán ở bước trước; là nền của mọi model phía sau.',
        dongGop: 'Model dự báo nhu cầu đặt phòng lab và phân loại thiết bị sắp hỏng từ lịch sử mượn trả.' },
      { slug: 'deep-learning', ten: 'Deep Learning with PyTorch', khung: true, viSao: 'Sau ML cổ điển — hiểu Transformer trước khi dùng LLM.',
        dongGop: 'Fine-tune model nhỏ đọc nhật ký cảm biến; hiểu Transformer bên dưới trợ lý LabFlow.' },
      { slug: 'llm-apps', ten: 'Building AI Apps with LLMs', khung: true, viSao: 'Bước sang dùng model có sẵn khi đã biết model là gì.',
        dongGop: 'Lõi trợ lý LabFlow: gọi LLM có streaming, output JSON để tạo lịch đặt phòng, tool calling.' },
      { slug: 'rag-vector-search', ten: 'RAG, Embeddings & Vector Search', khung: true, viSao: 'Cần biết gọi LLM trước khi cho nó đọc tài liệu.',
        dongGop: 'Trợ lý trả lời nội quy, hướng dẫn thiết bị của LabFlow từ pgvector, có trích dẫn đúng đoạn.' },
      { slug: 'ai-agents', ten: 'AI Agents & LLM Evaluation', khung: true, viSao: 'Agent = LLM + tool + RAG — học sau khi có đủ ba thứ đó.',
        dongGop: 'Agent đặt lịch giúp người dùng (kiểm phòng trống → đặt → báo lại) và bộ eval đo nó làm đúng hay sai.' },
      { slug: 'mlops-llmops', ten: 'MLOps & LLMOps', khung: true, viSao: 'Bậc cuối: có model và ứng dụng rồi mới cần vận hành chúng.',
        dongGop: 'Vận hành các model của LabFlow trên production: registry, giám sát drift, tracing và runbook.' },
    ],
    tuyChon: [
      { slug: 'ai-coding', ten: 'Coding with AI', khung: true, canh: 6, viSao: 'Kỹ năng làm việc hằng ngày, học xen lúc nào cũng được.',
        dongGop: 'Viết nhanh phần khung của trợ lý LabFlow bằng agent viết code, giữ test làm lưới an toàn.' },
      { slug: 'fastapi', ten: 'FastAPI', khung: true, canh: 7, viSao: 'Khi cần bọc dịch vụ AI bằng Python thay vì Node.',
        dongGop: 'Dịch vụ AI riêng của LabFlow bằng FastAPI, trả lời streaming cho frontend React.' },
    ],
  },
  {
    slug: 'data-scientist',
    ten: 'Data Scientist',
    ngan: 'Data Sci',
    icon: 'BarChart3',
    hex: ['#fbbf24', '#d97706'],
    moTa: 'Rút ra kết luận có căn cứ từ dữ liệu: thống kê suy luận, EDA, A/B test, nhân quả, rồi mô hình học máy khi thật sự cần.',
    labflow: 'Phân tích dữ liệu sử dụng phòng lab và cảm biến của LabFlow: giờ cao điểm, thiết bị ít dùng, đề xuất có số liệu.',
    buoc: [
      { slug: 'python', ten: 'Python for Backend & AI', khung: true, viSao: 'Công cụ chính của nghề — pandas, notebook, thư viện thống kê.',
        dongGop: 'Notebook đầu tiên đọc dữ liệu đặt phòng và cảm biến LabFlow (bộ giả lập có seed).' },
      { slug: 'math-for-ml', ten: 'Toán cho ML', khung: true, viSao: 'Dùng chung với AI Engineer — xác suất và đại số tuyến tính là ngôn ngữ của thống kê.',
        dongGop: 'Hiểu phân phối số đo cảm biến LabFlow trước khi đặt câu hỏi về nó.' },
      { slug: 'statistics-data-science', ten: 'Thống kê & Data Science', khung: true, viSao: 'Khoá trung tâm của nghề — học trước ML để biết kết luận nào đáng tin.',
        dongGop: 'Dự án cuối khoá: phân tích trọn vẹn dữ liệu sử dụng phòng lab và cảm biến của LabFlow, từ câu hỏi tới quyết định.' },
      { slug: 'postgresql', ten: 'PostgreSQL', viSao: 'Dữ liệu thật nằm trong CSDL — tự viết SQL thay vì chờ người khác xuất file.',
        dongGop: 'Truy vấn thẳng CSDL PostgreSQL của LabFlow bằng hàm cửa sổ và CTE cho báo cáo hằng tuần.' },
      { slug: 'machine-learning', ten: 'Machine Learning Fundamentals', khung: true, viSao: 'Sau thống kê: dự đoán thay vì chỉ giải thích.',
        dongGop: 'Model dự báo lượt đặt phòng theo tuần để khoa sắp xếp lịch trực lab.' },
      { slug: 'deep-learning', ten: 'Deep Learning with PyTorch', khung: true, viSao: 'Bậc cuối, khi dữ liệu là ảnh/chuỗi dài mà ML cổ điển không đủ.',
        dongGop: 'Model chuỗi thời gian cho dữ liệu cảm biến dày của LabFlow.' },
    ],
    tuyChon: [
      { slug: 'data-engineering', ten: 'Data Engineering', khung: true, canh: 5, viSao: 'Hiểu dữ liệu đến từ đâu — làm việc với Data Engineer dễ hơn hẳn.',
        dongGop: 'Đọc được pipeline dữ liệu LabFlow mà Data Engineer dựng, biết bảng nào tin được.' },
    ],
  },
  {
    slug: 'data-engineer',
    ten: 'Data Engineer',
    ngan: 'Data Eng',
    icon: 'Database',
    hex: ['#2dd4bf', '#0f766e'],
    moTa: 'Đưa dữ liệu từ hệ thống nghiệp vụ tới nơi phân tích được: SQL, mô hình hoá, ETL/ELT, xử lý luồng, Spark và lakehouse.',
    labflow: 'Đường ống dữ liệu của LabFlow: từ PostgreSQL và cảm biến AIoT về kho phân tích, bảng sạch dùng chung cho DS và AI.',
    buoc: [
      { slug: 'python', ten: 'Python for Backend & AI', khung: true, viSao: 'Ngôn ngữ viết pipeline và job dữ liệu.',
        dongGop: 'Script nạp file CSV cảm biến LabFlow, kiểm và làm sạch trước khi đưa vào kho.' },
      { slug: 'postgresql', ten: 'PostgreSQL', viSao: 'Nguồn dữ liệu của hầu hết hệ thống — phải đọc được nó trước.',
        dongGop: 'Hiểu lược đồ nghiệp vụ LabFlow (phòng, thiết bị, lượt đặt) và WAL — nền cho CDC sau này.' },
      { slug: 'docker', ten: 'Docker', viSao: 'Chạy cả hệ dữ liệu trên máy bằng Compose.',
        dongGop: 'Một file Compose dựng PostgreSQL, Kafka, ClickHouse, Airflow của LabFlow trên laptop.' },
      { slug: 'data-engineering', ten: 'Data Engineering', khung: true, viSao: 'Khoá trung tâm: OLTP/OLAP, mô hình hoá, dbt, điều phối.',
        dongGop: 'Kho dữ liệu LabFlow dạng star schema: fact lượt đặt + dimension phòng/thiết bị, biến đổi bằng dbt.' },
      { slug: 'kafka', ten: 'Apache Kafka', khung: true, viSao: 'Khi dữ liệu phải chảy liên tục, không chờ batch đêm.',
        dongGop: 'Dòng sự kiện cảm biến AIoT của LabFlow qua Kafka, CDC từ PostgreSQL bằng Debezium.' },
      { slug: 'spark-lakehouse', ten: 'Spark & Lakehouse', khung: true, viSao: 'Bậc cuối: dữ liệu lớn hơn một máy.',
        dongGop: 'Dự án cuối khoá: lakehouse cho LabFlow — dữ liệu cảm biến và đặt thiết bị tới bảng gold dùng chung.' },
    ],
    tuyChon: [
      { slug: 'linux-bash', ten: 'Linux & Bash', canh: 4, viSao: 'Làm việc trên máy chủ, cron, script xử lý file.',
        dongGop: 'Cron và script dọn file cảm biến cũ trên máy chủ dữ liệu LabFlow.' },
    ],
  },
  {
    slug: 'cloud-architect',
    ten: 'Cloud Architect',
    ngan: 'Cloud',
    icon: 'Cloud',
    hex: ['#60a5fa', '#1d4ed8'],
    moTa: 'Từ Linux, mạng, container tới thiết kế hệ thống trên cloud: IaC, Kubernetes, bảo mật, HA/DR, chi phí và chứng chỉ.',
    labflow: 'Đưa LabFlow lên cloud đúng chuẩn Well-Architected: nhiều tài khoản, HA/DR, chi phí có ngân sách.',
    buoc: [
      { slug: 'linux-bash', ten: 'Linux & Bash', viSao: 'Máy chủ nào trên cloud cũng là Linux.',
        dongGop: 'Tự dựng và chẩn đoán máy chủ chạy backend Spring Boot của LabFlow.' },
      { slug: 'networking-for-developers', ten: 'Networking for Developers', khung: true, viSao: 'VPC trên cloud chỉ là mạng này được ảo hoá.',
        dongGop: 'Truy vết đường đi một request của LabFlow qua DNS, TLS, CDN và cân bằng tải.' },
      { slug: 'docker', ten: 'Docker', viSao: 'Đơn vị triển khai chuẩn của cloud.',
        dongGop: 'Ảnh container cho backend, frontend và dịch vụ AI của LabFlow.' },
      { slug: 'cloud-aws', ten: 'Cloud Fundamentals (AWS)', khung: true, viSao: 'Học dịch vụ trước, rồi mới học ghép chúng thành kiến trúc.',
        dongGop: 'LabFlow chạy trên AWS: VPC, container, RDS PostgreSQL, S3 cho ảnh thiết bị.' },
      { slug: 'infrastructure-as-code', ten: 'Infrastructure as Code', khung: true, viSao: 'Hạ tầng bấm tay không lặp lại được — viết thành code.',
        dongGop: 'Toàn bộ hạ tầng LabFlow viết bằng Terraform, dựng lại từ số 0 bằng một lệnh.' },
      { slug: 'kubernetes', ten: 'Kubernetes', khung: true, viSao: 'Khi nhiều dịch vụ cần tự co giãn và tự hồi phục.',
        dongGop: 'Các dịch vụ LabFlow trên Kubernetes, tự co giãn giờ cao điểm đăng ký lab.' },
      { slug: 'network-security', ten: 'Network Security & Zero Trust', khung: true, viSao: 'Có mạng và cụm rồi mới siết chúng.',
        dongGop: 'Phân vùng mạng LabFlow, cổng cảm biến IoT tách riêng, mTLS giữa dịch vụ.' },
      { slug: 'cloud-container-security', ten: 'Cloud, Container & K8s Security', khung: true, viSao: 'Bảo mật đặc thù cloud: IAM, image, cụm.',
        dongGop: 'IAM tối thiểu, quét image và chính sách admission cho cụm LabFlow.' },
      { slug: 'cloud-architecture', ten: 'Cloud Architecture chuyên sâu', khung: true, viSao: 'Bậc cuối: ghép mọi thứ thành quyết định kiến trúc có lý do.',
        dongGop: 'Dự án cuối khoá: đưa LabFlow lên cloud đúng chuẩn Well-Architected, có landing zone, DR và FinOps.' },
    ],
    tuyChon: [
      { slug: 'observability-monitoring', ten: 'Observability & Monitoring', canh: 8, viSao: 'Vận hành được thứ mình thiết kế.',
        dongGop: 'Log, metric, trace và cảnh báo cho LabFlow trên cloud.' },
    ],
  },
  {
    slug: 'software-architect',
    ten: 'Software Architect',
    ngan: 'Architect',
    icon: 'Boxes',
    hex: ['#a5b4fc', '#4338ca'],
    moTa: 'Thiết kế hệ thống có lý do và bảo vệ được thiết kế: UML/COMET, API, system design, hệ phân tán, sự kiện, DDD.',
    labflow: 'Kiến trúc LabFlow từ đầu tới cuối: EventStorming, bounded context, C4 + ADR — dùng thẳng cho hồ sơ SEP490.',
    buoc: [
      { slug: 'software-architecture-and-design', ten: 'SWD392 — Software Architecture and Design', academy: 'SWD392', viSao: 'Môn trường — nền UML, COMET, GoF mà mọi bậc sau dựa vào.',
        dongGop: 'Use case, sơ đồ lớp và sơ đồ tuần tự cho LabFlow — đúng phần hội đồng SWD392 và SEP490 hỏi.' },
      { slug: 'api-design', ten: 'API & System Design', khung: true, viSao: 'Ranh giới giữa các phần của hệ thống bắt đầu từ API.',
        dongGop: 'Hợp đồng API OpenAPI cho LabFlow: đặt phòng, mượn thiết bị, idempotency khi bấm đặt hai lần.' },
      { slug: 'system-design', ten: 'System Design in Practice', khung: true, viSao: 'Nhìn cả hệ thống khi lớn lên, qua case study.',
        dongGop: 'Dự án cuối khoá: thiết kế LabFlow cho quy mô lớn — cả nghìn sinh viên giành lịch lab cùng lúc.' },
      { slug: 'distributed-systems', ten: 'Distributed Systems', khung: true, viSao: 'Hiểu vì sao nhiều máy lại khó trước khi tách dịch vụ.',
        dongGop: 'Chống đặt trùng phòng khi nhiều máy chủ cùng xử lý: khoá, lease, idempotency.' },
      { slug: 'kafka', ten: 'Apache Kafka', khung: true, viSao: 'Công cụ chính của kiến trúc hướng sự kiện.',
        dongGop: 'Sự kiện "đã đặt phòng", "đã trả thiết bị" của LabFlow qua Kafka, có outbox.' },
      { slug: 'software-architecture', ten: 'Software Architecture chuyên sâu', khung: true, viSao: 'Bậc cuối: ghép tất cả thành nghề kiến trúc sư.',
        dongGop: 'Dự án cuối khoá: kiến trúc LabFlow từ EventStorming tới hai bounded context chạy thật, có ADR và ATAM.' },
    ],
    tuyChon: [],
  },
  {
    slug: 'blockchain',
    ten: 'Blockchain Engineer',
    ngan: 'Blockchain',
    icon: 'Link2',
    hex: ['#fb923c', '#c2410c'],
    moTa: 'Từ mật mã và hệ phân tán tới Bitcoin, Ethereum, Solidity, audit và dApp — học trên testnet, không đụng tiền thật.',
    labflow: 'Mắt xích tuỳ chọn: chứng nhận dấu vân tay dữ liệu và chứng chỉ hoàn thành lab của LabFlow trên chain.',
    buoc: [
      { slug: 'applied-cryptography', ten: 'Applied Cryptography', khung: true, viSao: 'Băm, chữ ký số, đường cong elliptic — nền của mọi blockchain.',
        dongGop: 'Dự án cuối khoá: mã hoá dữ liệu nhạy cảm của LabFlow đúng chuẩn — chữ ký số dùng lại ở bậc sau.' },
      { slug: 'distributed-systems', ten: 'Distributed Systems', khung: true, viSao: 'Đồng thuận và lỗi Byzantine — vì sao sổ cái phân tán lại khó.',
        dongGop: 'Hiểu vì sao một bản ghi LabFlow trên chain không sửa được dù không ai giữ máy chủ chính.' },
      { slug: 'blockchain-fundamentals', ten: 'Blockchain Fundamentals', khung: true, viSao: 'Có mật mã + đồng thuận rồi mới hiểu được Bitcoin, Ethereum.',
        dongGop: 'Dự án cuối khoá: chứng nhận dấu vân tay dữ liệu LabFlow trên chain.' },
      { slug: 'smart-contracts-solidity', ten: 'Smart Contracts & Solidity', khung: true, viSao: 'Bậc cuối: code giữ tiền và không vá được — cần đủ nền phía trước.',
        dongGop: 'Dự án cuối khoá: hợp đồng cấp chứng chỉ hoàn thành lab on-chain cho LabFlow, có test Foundry.' },
    ],
    tuyChon: [
      { slug: 'react', ten: 'React', canh: 4, viSao: 'Giao diện cho dApp.',
        dongGop: 'Trang tra cứu chứng chỉ lab LabFlow bằng React, kết nối ví.' },
    ],
  },
];

/** Chuỗi dự án LabFlow AI — thứ tự từ kế hoạch 01/10 (DE → DS → AI → Cloud → SA → Blockchain). */
export const CHUOI_LABFLOW: { nghe: string; viec: string }[] = [
  { nghe: 'data-engineer', viec: 'Dựng pipeline dữ liệu lab' },
  { nghe: 'data-scientist', viec: 'Phân tích sử dụng & cảm biến' },
  { nghe: 'ai-engineer', viec: 'Làm trợ lý AI' },
  { nghe: 'cloud-architect', viec: 'Đưa lên cloud' },
  { nghe: 'software-architect', viec: 'Viết ADR / C4' },
  { nghe: 'blockchain', viec: 'Chứng nhận on-chain (tuỳ chọn)' },
];

export const TEN_DU_AN_NGHE = LABFLOW;

/** Khoá dùng chung ≥ 2 nghề — "tầng nền". Tính từ NGHE để không lệch. */
export function tinhNenChung(): { slug: string; ten: string; khung?: boolean; academy?: string; nghe: string[] }[] {
  const map = new Map<string, { slug: string; ten: string; khung?: boolean; academy?: string; nghe: string[] }>();
  for (const n of NGHE) {
    for (const b of [...n.buoc, ...n.tuyChon]) {
      const cu = map.get(b.slug);
      if (cu) {
        if (!cu.nghe.includes(n.slug)) cu.nghe.push(n.slug);
      } else {
        map.set(b.slug, { slug: b.slug, ten: b.ten, khung: b.khung, academy: b.academy, nghe: [n.slug] });
      }
    }
  }
  return [...map.values()].filter((x) => x.nghe.length >= 2).sort((a, b) => b.nghe.length - a.nghe.length);
}
