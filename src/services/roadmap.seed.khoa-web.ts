/**
 * Lộ trình 6 nghề chuyên sâu (01/10/2026) — nối /roadmap với các khoá /courses của chính web.
 * Kế hoạch: content/courses/_KE-HOACH-LO-TRINH-NGHE-0110.md — mỗi chủ đề MỘT khoá sở hữu, các nghề dùng chung
 * tầng nền, dự án cuối khoá xoay quanh LabFlow AI.
 *
 *   HOC_TREN_WEB[slug] → chặng "📚 Học trên cuongthai.com" chèn ĐẦU lộ trình nghề đó (thứ tự khoá nên học).
 *   ROADMAP_MOI        → hai nghề chưa có: data-engineer, cloud-architect.
 *
 * ⚠️ Tiêu đề bước bắt đầu bằng "Khoá " để không trùng tiêu đề bước khái niệm có sẵn — seeder khớp node theo
 * CHẶNG + TIÊU ĐỀ để giữ dấu "đã xong" của người dùng.
 */
import type { SeedNode, SeedRoadmap, SeedStage, SeedLink, SeedResource } from './roadmap.seed.js';

const kh = (ref: string): SeedLink => ({ type: 'course', ref });
const rm = (ref: string): SeedLink => ({ type: 'roadmap', ref });
const off = (title: string, url: string): SeedResource => ({ type: 'official', title, url });
const art = (title: string, url: string): SeedResource => ({ type: 'article', title, url });

export const CHANG_HOC_TREN_WEB = '📚 Học trên cuongthai.com (theo thứ tự)';

/** Một bước = một khoá. `phu` = nhánh phụ (kind alternative), không bắt buộc. */
function buoc(so: number, slug: string, ten: string, moTa: string, phu = false): SeedNode {
  return {
    title: `Khoá ${ten}`,
    subtitle: phu ? 'Tuỳ chọn' : `Bước ${so}`,
    kind: phu ? 'alternative' : 'primary',
    side: phu ? 'right' : 'center',
    icon: 'BookOpen',
    description: moTa,
    link: kh(slug),
  };
}

// Tầng nền dùng chung — lặp lại ở nhiều nghề cùng MỘT khoá, không có bản riêng cho từng nghề.
const PYTHON = (n: number) => buoc(n, 'python', 'Python for Backend & AI', 'Ngôn ngữ chung của AI và dữ liệu: kiểu, hàm, OOP, async, numpy/pandas nhập môn.');
const TOAN = (n: number) => buoc(n, 'math-for-ml', 'Toán cho ML', 'Đại số tuyến tính, giải tích, xác suất — đúng phần ML/DL cần, học một lần dùng cho cả AI Engineer lẫn Data Scientist.');
const PG = (n: number) => buoc(n, 'postgresql', 'PostgreSQL', 'SQL thật trên PostgreSQL: truy vấn, chỉ mục, giao dịch — dữ liệu nào rồi cũng nằm trong một CSDL.');
const ML = (n: number) => buoc(n, 'machine-learning', 'Machine Learning Fundamentals', 'scikit-learn: hồi quy, phân loại, cây, đánh giá mô hình, chống overfitting.');
const DL = (n: number) => buoc(n, 'deep-learning', 'Deep Learning with PyTorch', 'Tensor, autograd, CNN, Transformer, fine-tune trên GPU.');

export const HOC_TREN_WEB: Record<string, SeedNode[]> = {
  'ai-engineer': [
    PYTHON(1), TOAN(2), ML(3), DL(4),
    buoc(5, 'llm-apps', 'Building AI Apps with LLMs', 'Gọi API đúng cách, prompt, streaming, structured output, tool calling, chi phí.'),
    buoc(6, 'rag-vector-search', 'RAG, Embeddings & Vector Search', 'Embedding, chunking, pgvector, hybrid search, rerank, trích dẫn, đánh giá RAG.'),
    buoc(7, 'ai-agents', 'AI Agents & LLM Evaluation', 'Vòng lặp agent, MCP, bộ nhớ, đa agent, guardrail, eval set, LLM-as-judge.'),
    buoc(8, 'mlops-llmops', 'MLOps & LLMOps', 'Đưa model lên production: serve, registry, giám sát drift, eval trên prod, pipeline fine-tune.'),
    buoc(0, 'ai-coding', 'Coding with AI', 'Dùng AI để viết code nhanh mà vẫn kiểm chứng được — kỹ năng làm việc hằng ngày.', true),
    buoc(0, 'fastapi', 'FastAPI', 'Đóng gói dịch vụ AI bằng Python (streaming response, DI, test).', true),
  ],
  'data-scientist': [
    PYTHON(1), TOAN(2),
    buoc(3, 'statistics-data-science', 'Thống kê & Data Science', 'Thống kê suy luận, EDA, trực quan hoá, A/B test, suy luận nhân quả, kể chuyện bằng dữ liệu.'),
    PG(4), ML(5), DL(6),
    buoc(0, 'data-engineering', 'Data Engineering', 'Hiểu dữ liệu đến từ đâu: kho dữ liệu, dbt, chất lượng dữ liệu.', true),
  ],
  'software-architect': [
    buoc(1, 'software-architecture-and-design', 'SWD392 — Software Architecture and Design', 'Môn trường (Academy): UML, COMET, kiến trúc theo Gomaa, Design Patterns GoF, SOLID — giảng trọn 854 slide.'),
    buoc(2, 'api-design', 'API & System Design', 'Thiết kế API: tài nguyên, lỗi, phân trang, phiên bản, idempotency, bảo mật API.'),
    buoc(3, 'system-design', 'System Design in Practice', 'Từ một server tới triệu người dùng; 8 case study; design doc.'),
    buoc(4, 'distributed-systems', 'Distributed Systems', 'Đồng hồ, nhân bản, phân vùng, CAP/PACELC, đồng thuận, giao dịch phân tán.'),
    buoc(5, 'kafka', 'Apache Kafka', 'Kiến trúc hướng sự kiện trên nhật ký phân tán: delivery guarantees, outbox, CDC.'),
    buoc(6, 'software-architecture', 'Software Architecture chuyên sâu', 'DDD, clean/hexagonal, saga/outbox/CQRS, event-driven, C4 + ADR, ATAM, vai trò kiến trúc sư.'),
  ],
  'blockchain': [
    buoc(1, 'applied-cryptography', 'Applied Cryptography', 'Băm, chữ ký số, đường cong elliptic — nền mật mã của mọi blockchain.'),
    buoc(2, 'distributed-systems', 'Distributed Systems', 'Đồng thuận và lỗi Byzantine — vì sao một sổ cái phân tán lại khó.'),
    buoc(3, 'blockchain-fundamentals', 'Blockchain Fundamentals', 'Bitcoin, Ethereum, EVM, ví, giao dịch, gas — từ con số 0.'),
    buoc(4, 'smart-contracts-solidity', 'Smart Contracts & Solidity', 'Solidity, Foundry, kiểm thử, lỗ hổng kinh điển & audit, DeFi, dApp — lab trên testnet.'),
    buoc(0, 'react', 'React', 'Giao diện dApp.', true),
  ],
};

const DATA_ENGINEER: SeedRoadmap = {
  slug: 'data-engineer', title: 'Data Engineer', type: 'role', icon: 'Database', color: '#0d9488',
  description: 'Lộ trình Data Engineer — đưa dữ liệu từ hệ thống nghiệp vụ tới nơi phân tích được: SQL & mô hình hoá, ETL/ELT, kho dữ liệu, xử lý luồng, Spark & lakehouse, điều phối, chất lượng dữ liệu.',
  stages: [
    { label: CHANG_HOC_TREN_WEB, nodes: [
      PYTHON(1), PG(2),
      buoc(3, 'docker', 'Docker', 'Chạy cả hệ dữ liệu (PostgreSQL, Kafka, ClickHouse, Airflow) trên máy bằng Compose.'),
      buoc(4, 'data-engineering', 'Data Engineering', 'OLTP vs OLAP, mô hình hoá phân tích, ingest batch/CDC, ClickHouse, dbt, điều phối, chất lượng.'),
      buoc(5, 'kafka', 'Apache Kafka', 'Dòng sự kiện, Kafka Connect, CDC bằng Debezium, xử lý luồng.'),
      buoc(6, 'spark-lakehouse', 'Spark & Lakehouse', 'Spark, Delta/Iceberg, Airflow chuyên sâu — dữ liệu lớn hơn một máy.'),
      buoc(0, 'linux-bash', 'Linux & Bash', 'Làm việc trên máy chủ, cron, script xử lý file.', true),
    ]},
    { label: 'Nền tảng', nodes: [
      { title: 'Data Engineer làm gì', kind: 'info', icon: 'Database', description: 'Xây và vận hành đường ống dữ liệu (pipeline) để người phân tích, data scientist và AI có dữ liệu sạch, đúng giờ. Khác Data Scientist: DE lo dòng chảy dữ liệu, DS lo rút ra kết luận.',
        resources: [ art('roadmap.sh — Data Engineer', 'https://roadmap.sh/data-engineer') ] },
      { title: 'SQL nâng cao', icon: 'Database', side: 'right', description: 'Window function, CTE, tối ưu truy vấn — công cụ dùng nhiều nhất của nghề.', link: rm('sql'),
        resources: [ off('PostgreSQL — Window Functions', 'https://www.postgresql.org/docs/current/tutorial-window.html') ] },
      { title: 'OLTP vs OLAP', kind: 'info', side: 'left', description: 'CSDL nghiệp vụ (ghi nhiều dòng nhỏ) khác kho phân tích (quét nhiều cột) — nên lưu trữ dạng cột.',
        resources: [ art('Wikipedia — Online analytical processing (OLAP)', 'https://en.wikipedia.org/wiki/Online_analytical_processing') ] },
    ]},
    { label: 'Mô hình hoá & Kho dữ liệu', nodes: [
      { title: 'Star schema & Dimensional modeling', icon: 'Boxes', description: 'Bảng fact + bảng dimension (Kimball) — nền của mọi kho dữ liệu.',
        resources: [ off('Kimball Group — Dimensional Modeling Techniques', 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/') ] },
      { title: 'Kho dữ liệu cột (ClickHouse/BigQuery/Snowflake)', kind: 'info', side: 'right', description: 'Lưu theo cột, nén mạnh, quét hàng tỷ dòng trong vài giây.',
        resources: [ off('ClickHouse (GitHub, tài liệu chính thức dẫn từ đây)', 'https://github.com/ClickHouse/ClickHouse') ] },
      { title: 'dbt (transform bằng SQL)', side: 'left', description: 'Viết biến đổi dữ liệu như code: model, test, tài liệu, lineage.',
        resources: [ off('dbt Docs', 'https://docs.getdbt.com/') ] },
    ]},
    { label: 'Ingest: Batch, CDC & Streaming', nodes: [
      { title: 'ETL vs ELT', icon: 'Workflow', description: 'Biến đổi trước khi nạp (ETL) hay nạp thô rồi biến đổi trong kho (ELT) — kho mạnh lên nên ELT phổ biến.',
        resources: [ art('roadmap.sh — Data Engineer', 'https://roadmap.sh/data-engineer') ] },
      { title: 'Change Data Capture (Debezium)', kind: 'info', side: 'right', description: 'Đọc WAL của CSDL nguồn, mỗi thay đổi thành một sự kiện — không cần quét lại cả bảng.',
        resources: [ off('Debezium Docs', 'https://debezium.io/documentation/') ] },
      { title: 'Xử lý luồng (Kafka Streams / Flink)', side: 'left', description: 'Tính toán liên tục trên dòng sự kiện theo cửa sổ thời gian.',
        resources: [ off('Apache Flink Docs', 'https://nightlies.apache.org/flink/flink-docs-stable/') ] },
    ]},
    { label: 'Dữ liệu lớn & Lakehouse', nodes: [
      { title: 'Apache Spark', icon: 'Zap', description: 'Xử lý phân tán dữ liệu lớn hơn một máy: DataFrame, Spark SQL, partition, shuffle.',
        resources: [ off('Apache Spark Docs', 'https://spark.apache.org/docs/latest/') ] },
      { title: 'Lakehouse (Delta Lake / Apache Iceberg)', kind: 'info', side: 'right', description: 'Bảng có giao dịch ACID trên file Parquet trong object storage — gộp data lake và kho dữ liệu.',
        resources: [ off('Apache Iceberg Docs', 'https://iceberg.apache.org/docs/latest/'), off('Delta Lake Docs', 'https://docs.delta.io/latest/index.html') ] },
      { title: 'Parquet & định dạng cột', side: 'left', description: 'Định dạng file cột chuẩn của hệ sinh thái dữ liệu.',
        resources: [ off('Apache Parquet Docs', 'https://parquet.apache.org/docs/') ] },
    ]},
    { label: 'Điều phối, Chất lượng & Vận hành', nodes: [
      { title: 'Apache Airflow / Dagster', icon: 'Workflow', description: 'Lập lịch và điều phối pipeline thành đồ thị phụ thuộc, có thử lại và giám sát.',
        resources: [ off('Apache Airflow Docs', 'https://airflow.apache.org/docs/') ] },
      { title: 'Data quality & contracts', kind: 'info', side: 'right', description: 'Kiểm dữ liệu như kiểm code: null, trùng, lệch phân phối; hợp đồng dữ liệu giữa nhóm nguồn và nhóm dùng.',
        resources: [ off('Great Expectations Docs', 'https://docs.greatexpectations.io/') ] },
      { title: 'Chi phí & quản trị dữ liệu', side: 'left', description: 'Phân quyền, dữ liệu cá nhân (Nghị định 13/2023), chi phí lưu trữ và truy vấn.', link: kh('privacy-data-law'),
        resources: [ art('roadmap.sh — Data Engineer', 'https://roadmap.sh/data-engineer') ] },
    ]},
  ],
};

const CLOUD_ARCHITECT: SeedRoadmap = {
  slug: 'cloud-architect', title: 'Cloud Architect', type: 'role', icon: 'Cloud', color: '#2563eb',
  description: 'Lộ trình Cloud Architect — từ Linux, mạng, container tới thiết kế hệ thống trên cloud: IaC, Kubernetes, bảo mật, độ sẵn sàng cao & khôi phục thảm hoạ, chi phí (FinOps), đa tài khoản và chứng chỉ.',
  stages: [
    { label: CHANG_HOC_TREN_WEB, nodes: [
      buoc(1, 'linux-bash', 'Linux & Bash', 'Máy chủ nào trên cloud cũng là Linux.'),
      buoc(2, 'networking-for-developers', 'Networking for Developers', 'DNS, TCP, TLS, HTTP, CDN — VPC trên cloud chỉ là mạng này được ảo hoá.'),
      buoc(3, 'docker', 'Docker', 'Đơn vị triển khai chuẩn của cloud.'),
      buoc(4, 'cloud-aws', 'Cloud Fundamentals (AWS)', 'IAM, VPC, EC2, container, serverless, lưu trữ, CSDL trên AWS.'),
      buoc(5, 'infrastructure-as-code', 'Infrastructure as Code', 'Terraform & Ansible: hạ tầng là code, state, module, GitOps.'),
      buoc(6, 'kubernetes', 'Kubernetes', 'Điều phối container ở quy mô lớn.'),
      buoc(7, 'network-security', 'Network Security & Zero Trust', 'Phân vùng mạng, VPN, zero trust.'),
      buoc(8, 'cloud-container-security', 'Cloud, Container & K8s Security', 'IAM chặt, bảo mật container và cụm.'),
      buoc(9, 'cloud-architecture', 'Cloud Architecture chuyên sâu', 'Well-Architected, landing zone đa tài khoản, HA/DR, FinOps, đối chiếu Azure/GCP, chứng chỉ SAA/SAP.'),
      buoc(0, 'observability-monitoring', 'Observability & Monitoring', 'Log, metric, trace, cảnh báo — vận hành được thứ mình thiết kế.', true),
    ]},
    { label: 'Nền tảng Cloud', nodes: [
      { title: 'Cloud Architect làm gì', kind: 'info', icon: 'Cloud', description: 'Chọn dịch vụ, vẽ kiến trúc, đặt chuẩn bảo mật/chi phí/độ sẵn sàng cho cả tổ chức — nối giữa yêu cầu nghiệp vụ và hạ tầng.',
        resources: [ art('roadmap.sh — AWS', 'https://roadmap.sh/aws') ] },
      { title: 'Mô hình dịch vụ IaaS / PaaS / SaaS & trách nhiệm chia sẻ', icon: 'Layers', side: 'right', description: 'Ai chịu trách nhiệm phần nào khi chạy trên cloud.',
        resources: [ off('AWS — Shared Responsibility Model', 'https://aws.amazon.com/compliance/shared-responsibility-model/') ] },
      { title: 'Region, Availability Zone & Edge', kind: 'info', side: 'left', description: 'Đặt hệ thống ở đâu để chịu được mất một trung tâm dữ liệu.',
        resources: [ off('AWS — Global Infrastructure', 'https://aws.amazon.com/about-aws/global-infrastructure/') ] },
    ]},
    { label: 'Thiết kế theo Well-Architected', nodes: [
      { title: 'Sáu trụ cột Well-Architected', icon: 'Compass', description: 'Vận hành, bảo mật, tin cậy, hiệu năng, chi phí, bền vững — khung đánh giá mọi kiến trúc cloud.',
        resources: [ off('AWS Well-Architected Framework', 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html'), off('Azure Well-Architected Framework', 'https://learn.microsoft.com/en-us/azure/well-architected/') ] },
      { title: 'High Availability & Disaster Recovery (RTO/RPO)', kind: 'info', side: 'right', description: 'Backup-restore, pilot light, warm standby, multi-site — chọn theo thời gian chịu được và dữ liệu chấp nhận mất.',
        resources: [ off('AWS — Disaster Recovery Workloads', 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html') ] },
      { title: 'Serverless vs Container vs VM', side: 'left', description: 'Đánh đổi chi phí, độ trễ khởi động, mức kiểm soát.', link: rm('system-design'),
        resources: [ art('roadmap.sh — System Design', 'https://roadmap.sh/system-design') ] },
    ]},
    { label: 'Mạng, Danh tính & Bảo mật', nodes: [
      { title: 'VPC, subnet, routing & private connectivity', icon: 'Network', description: 'Thiết kế mạng nhiều tầng, NAT, peering, PrivateLink, kết nối về on-premise.',
        resources: [ off('AWS — VPC User Guide', 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html') ] },
      { title: 'IAM & least privilege', kind: 'info', side: 'right', description: 'Vai trò, chính sách, tạm thời thay vì khoá dài hạn.',
        resources: [ off('AWS — IAM Best Practices', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html') ] },
      { title: 'Landing zone & đa tài khoản', side: 'left', description: 'Tách tài khoản theo môi trường/nhóm, chính sách tập trung, log tập trung.',
        resources: [ off('AWS — Control Tower', 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html') ] },
    ]},
    { label: 'Chi phí, Đa cloud & Chứng chỉ', nodes: [
      { title: 'FinOps & tối ưu chi phí', icon: 'Coins', description: 'Gắn tag, ngân sách, cảnh báo, reserved/spot, chọn đúng cỡ máy.',
        resources: [ off('FinOps Foundation — Framework', 'https://www.finops.org/framework/') ] },
      { title: 'Azure / Google Cloud tương đương', kind: 'alternative', side: 'right', description: 'Cùng khái niệm, khác tên dịch vụ — học một cloud kỹ rồi ánh xạ sang cloud khác.',
        resources: [ off('Azure for AWS professionals', 'https://learn.microsoft.com/en-us/azure/architecture/aws-professional/'), off('Google Cloud for AWS professionals', 'https://cloud.google.com/docs/get-started/aws-azure-gcp-service-comparison') ] },
      { title: 'AWS Solutions Architect (Associate / Professional)', kind: 'info', side: 'left', description: 'Chứng chỉ phổ biến nhất cho vị trí này.',
        resources: [ off('AWS Certified Solutions Architect – Associate', 'https://aws.amazon.com/certification/certified-solutions-architect-associate/') ] },
    ]},
  ],
};

export const ROADMAP_MOI: SeedRoadmap[] = [DATA_ENGINEER, CLOUD_ARCHITECT];

/** Chèn chặng "📚 Học trên cuongthai.com" lên ĐẦU các lộ trình nghề có sẵn. */
export function themChangHoc(ds: SeedRoadmap[]): SeedRoadmap[] {
  return ds.map((r) => {
    const nodes = HOC_TREN_WEB[r.slug];
    if (!nodes || r.stages.some((s) => s.label === CHANG_HOC_TREN_WEB)) return r;
    const chang: SeedStage = { label: CHANG_HOC_TREN_WEB, nodes };
    return { ...r, stages: [chang, ...r.stages] };
  });
}
