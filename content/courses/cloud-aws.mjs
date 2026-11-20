/**
 * Cloud cơ bản (AWS) — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026; SOẠN CHI TIẾT từ 19/11/2026 (agent aws, máy nhà)
 * theo lộ trình đi làm Backend Node.js + Spring Boot (chốt 17/11/2026): "làm chủ AWS từ con số 0 → dự án thật → thi chứng chỉ".
 * Mở rộng 11 → 17 mục (~107 bài): S3 lên sớm (Ch.2, kèm so sánh R2 của cuongthai.com), tách mạng/EC2/đưa ra Internet,
 * thêm RDS + bí mật, hướng sự kiện (SQS/SNS/EventBridge), CloudWatch, Terraform cho mọi thứ, CI/CD GitHub Actions → ECR → ECS,
 * chi phí + bảo mật (góc hacker), dự án cuối khoá LabFlow trên AWS, và hai chương luyện thi CLF-C02 / SAA-C03.
 *
 * ⚠️ Luật soạn: chỉ Free Tier; bài đầu tiên có tài khoản là đặt AWS Budgets + cảnh báo; mỗi lab có bước DỌN + lệnh kiểm "còn gì
 * đang tính tiền". Demo trong bài chạy thật trên LocalStack 4.12 (community) + AWS CLI 2.41.0 + Terraform 1.17.2 (xem
 * cloud-aws/_chung.mjs → PHIEN_BAN); dịch vụ chỉ AWS thật có (ALB, ECS, CloudFront…) ghi rõ "minh hoạ" khi không chạy được.
 *
 * Mục nào đã soạn thì thay phần tử khung bằng tệp chương thật (cloud-aws/sNN-*.mjs). Mục 0 GIỮ slug bài đầu
 * (aws-0-8-bat-dau-tai-day) và cả 4 slug bài cũ. Chương 1 giữ slug bài đầu aws-1-1-khai-niem. Các chương 2–10 cũ ĐỔI CHỖ
 * (S3 lên Ch.2, VPC xuống Ch.3, …) ⇒ seeder tạo section mới theo slug bài đầu mới; section khung cũ (aws-2-1-vpc, aws-3-1-ec2,
 * aws-4-1-ecr, aws-5-1-lambda, aws-6-1-s3, aws-7-1-rds, aws-8-1-vi-sao, aws-9-1-cloudwatch, aws-10-1-kien-truc) cần gỡ khi
 * deploy — ghi trong báo cáo agent aws.
 */
import { khung } from './_chung/khung.mjs';
import s00 from './cloud-aws/s00-bat-dau.mjs';
import s01 from './cloud-aws/s01-iam.mjs';
import s02 from './cloud-aws/s02-s3.mjs';
import s03 from './cloud-aws/s03-vpc.mjs';
import s04 from './cloud-aws/s04-ec2.mjs';
import s05 from './cloud-aws/s05-ra-internet.mjs';
import s06 from './cloud-aws/s06-du-lieu.mjs';
import s07 from './cloud-aws/s07-container.mjs';
import s08 from './cloud-aws/s08-serverless.mjs';
import s09 from './cloud-aws/s09-su-kien.mjs';
import s10 from './cloud-aws/s10-quan-sat.mjs';

const CHUONG = [
  ['Section 0 — What the cloud is', 'Mục 0 — Cloud là gì', '(đã soạn — cloud-aws/s00-bat-dau.mjs)', [['bat-dau-tai-day', '-', '-', '-']]],
  ['Chapter 1 — Identity and access (IAM)', 'Chương 1 — Danh tính và quyền truy cập (IAM)', '(đã soạn — cloud-aws/s01-iam.mjs)', [['khai-niem', '-', '-', '-']]],
  ['Chapter 2 — Storage: S3 (and the R2 you already use)', 'Chương 2 — Lưu trữ: S3 (và R2 bạn đang dùng)', '(đã soạn — cloud-aws/s02-s3.mjs)', [['s3', '-', '-', '-']]],
  ['Chapter 3 — Networking: VPC', 'Chương 3 — Mạng: VPC', '(đã soạn — cloud-aws/s03-vpc.mjs)', [['vpc-subnet', '-', '-', '-']]],
  ['Chapter 4 — Compute: EC2', 'Chương 4 — Máy chủ: EC2', '(đã soạn — cloud-aws/s04-ec2.mjs)', [['ec2', '-', '-', '-']]],
  ['Chapter 5 — Going public: load balancers, scaling, DNS and CDN', 'Chương 5 — Ra Internet: load balancer, co giãn, DNS và CDN', '(đã soạn — cloud-aws/s05-ra-internet.mjs)', [['alb', '-', '-', '-']]],
  ['Chapter 6 — Databases and secrets', 'Chương 6 — Cơ sở dữ liệu và bí mật', '(đã soạn — cloud-aws/s06-du-lieu.mjs)', [['rds', '-', '-', '-']]],
  ['Chapter 7 — Containers: ECR and ECS Fargate', 'Chương 7 — Container: ECR và ECS Fargate', '(đã soạn — cloud-aws/s07-container.mjs)', [['ecr', '-', '-', '-']]],
  ['Chapter 8 — Serverless: Lambda and API Gateway', 'Chương 8 — Serverless: Lambda và API Gateway', '(đã soạn — cloud-aws/s08-serverless.mjs)', [['lambda', '-', '-', '-']]],
  ['Chapter 9 — Event-driven: SQS, SNS and EventBridge', 'Chương 9 — Hướng sự kiện: SQS, SNS và EventBridge', '(đã soạn — cloud-aws/s09-su-kien.mjs)', [['sqs', '-', '-', '-']]],
  ['Chapter 10 — Observability: CloudWatch', 'Chương 10 — Quan sát: CloudWatch', '(đã soạn — cloud-aws/s10-quan-sat.mjs)', [['logs', '-', '-', '-']]],
  ['Chapter 11 — Infrastructure as code with Terraform', 'Chương 11 — Hạ tầng dưới dạng mã với Terraform', 'Dựng lại bằng mã mọi thứ đã bấm tay: provider, state, biến, module; học bài bản ở khoá Infrastructure as Code.', [
    ['vi-sao', 'Why click-ops does not scale', 'Vì sao bấm tay không mở rộng được', 'Không tái lập được · Quên dọn = hoá đơn bất ngờ · IaC là gì · Terraform vs CloudFormation vs CDK'],
    ['terraform', 'Terraform basics on AWS: init, plan, apply, destroy', 'Terraform cơ bản trên AWS: init, plan, apply, destroy', 'Provider AWS và xác thực an toàn · Resource, data source · Đồ thị phụ thuộc · Chạy thật với LocalStack'],
    ['bien-module', 'Variables, outputs and modules', 'Biến, output và module', 'variable/locals/output · Module VPC dùng lại · Module của cộng đồng · Môi trường dev/prod'],
    ['state', 'State: S3 backend, locking and drift', 'State: backend S3, khoá và lệch cấu hình', 'State chứa gì (cả bí mật) · Backend S3 + khoá · Drift khi ai đó bấm tay · import'],
    ['lab-11', 'Chapter 11 lab + interview questions', 'Lab chương 11 + câu hỏi phỏng vấn', 'VPC + S3 + DynamoDB của LabFlow bằng Terraform · Rubric · Câu phỏng vấn IaC'],
  ]],
  ['Chapter 12 — CI/CD: GitHub Actions → ECR → ECS', 'Chương 12 — CI/CD: GitHub Actions → ECR → ECS', 'Đẩy mã là có bản mới chạy trên AWS: OIDC, build ảnh, deploy cuốn chiếu, terraform plan trên PR.', [
    ['pipeline', 'The pipeline: build, test, push to ECR', 'Đường ống: build, test, đẩy lên ECR', 'Workflow từng bước · OIDC thay khoá · Gắn tag theo SHA · Cache build'],
    ['deploy-ecs', 'Deploying to ECS: rolling and blue/green', 'Deploy lên ECS: cuốn chiếu và blue/green', 'Cập nhật task definition · Circuit breaker tự quay lui · Blue/green với CodeDeploy · So với deploy-nha.sh'],
    ['terraform-ci', 'Terraform in CI: plan on PR, apply with approval', 'Terraform trong CI: plan trên PR, apply có duyệt', 'Môi trường được bảo vệ · Bình luận plan vào PR · Khoá state · Trỏ khoá Infrastructure as Code'],
    ['lab-12', 'Chapter 12 lab + interview questions', 'Lab chương 12 + câu hỏi phỏng vấn', 'Workflow hoàn chỉnh cho LabFlow · Rubric · Câu phỏng vấn CI/CD'],
  ]],
  ['Chapter 13 — Cost and security in production', 'Chương 13 — Chi phí và bảo mật khi chạy thật', 'Hiểu hoá đơn, cắt chi phí, Well-Architected, và góc hacker tổng hợp.', [
    ['hoa-don', 'Understanding the bill: Cost Explorer and tags', 'Hiểu hoá đơn: Cost Explorer và tag', 'Cost Explorer · Tag phân bổ chi phí · Thủ phạm hay gặp: NAT, IPv4, log, snapshot · Báo cáo CUR'],
    ['toi-uu', 'Cost optimization playbook', 'Cẩm nang tối ưu chi phí', 'Đúng cỡ máy · Tắt ngoài giờ · Spot/Savings Plans · Lớp lưu trữ S3 · Compute Optimizer · Trusted Advisor'],
    ['well-architected', 'The Well-Architected Framework', 'Well-Architected Framework', 'Sáu trụ cột · Đánh giá kiến trúc LabFlow theo từng trụ · Câu thi hay gặp'],
    ['bao-mat', 'Security services: KMS, GuardDuty, Security Hub, Organizations', 'Dịch vụ bảo mật: KMS, GuardDuty, Security Hub, Organizations', 'Mã hoá bằng KMS · GuardDuty phát hiện bất thường · SCP chặn cả tài khoản · Nhiều tài khoản dev/prod'],
    ['don-dep', 'Cleaning up everything: the "what is still billing?" checklist', 'Dọn sạch mọi thứ: danh sách "còn gì đang tính tiền"', 'Lệnh kiểm từng region · Tag Editor · terraform destroy · Đóng tài khoản · Thói quen sau mỗi lab'],
    ['lab-13', 'Chapter 13 lab + interview questions', 'Lab chương 13 + câu hỏi phỏng vấn', 'Kiểm toán chi phí + bảo mật một tài khoản mẫu · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 14 — Capstone: LabFlow on AWS, production-style', 'Chương 14 — Dự án cuối khoá: LabFlow trên AWS kiểu production', 'API đặt lịch phòng lab (cùng đề Dự án 1 Node.js / Dự án 2 Spring Boot) lên AWS: VPC, ALB, ECS Fargate, RDS, S3, CloudFront, CloudWatch, Terraform, GitHub Actions.', [
    ['kien-truc', 'Architecture and cost estimate', 'Kiến trúc và ước tính chi phí', 'Sơ đồ đầy đủ · Tính tiền tháng · So với VPS · Quyết định đánh đổi'],
    ['mang-du-lieu', 'Network and data layer with Terraform', 'Tầng mạng và dữ liệu bằng Terraform', 'VPC 2 AZ · RDS private · S3 + CloudFront · Bí mật'],
    ['ung-dung', 'Application layer: ECR, ECS Fargate, ALB', 'Tầng ứng dụng: ECR, ECS Fargate, ALB', 'Task definition · Service sau ALB · Health check · Migration chạy một lần'],
    ['cicd-giam-sat', 'CI/CD and monitoring', 'CI/CD và giám sát', 'Workflow OIDC → ECR → ECS · Dashboard + cảnh báo · Diễn tập sự cố'],
    ['bao-ve', 'Tear down, defend it in an interview, exam path', 'Dỡ bỏ, bảo vệ dự án khi phỏng vấn, lộ trình thi', 'terraform destroy + kiểm hoá đơn · Kể dự án theo STAR · Rubric chấm · Thi thực hành có giờ'],
  ]],
  ['Chapter 15 — Exam prep: AWS Certified Cloud Practitioner (CLF-C02)', 'Chương 15 — Luyện thi: AWS Certified Cloud Practitioner (CLF-C02)', 'Bản đồ 4 domain theo exam guide chính thức, mẹo loại đáp án, câu luyện TỰ VIẾT và đề thử.', [
    ['ban-do', 'Exam map: the four domains and how they are weighted', 'Bản đồ đề: bốn domain và tỉ trọng', 'Cloud Concepts · Security and Compliance · Cloud Technology and Services · Billing, Pricing and Support · Cách đăng ký, giá, thời gian'],
    ['khai-niem-bao-mat', 'Domains 1–2: cloud concepts, shared responsibility, security', 'Domain 1–2: khái niệm cloud, trách nhiệm chung, bảo mật', 'Sáu lợi ích của cloud · Well-Architected · Trách nhiệm chung · IAM, dịch vụ bảo mật · 10 câu luyện'],
    ['dich-vu-chi-phi', 'Domains 3–4: services, pricing and support plans', 'Domain 3–4: dịch vụ, giá và gói hỗ trợ', 'Chọn dịch vụ theo tình huống · Mô hình giá · Gói Support · Organizations, Cost Explorer · 10 câu luyện'],
    ['de-thu', 'Practice exam and elimination tricks', 'Đề thử và mẹo loại đáp án', 'Đề thử tự viết · Từ khoá trong đề · Đáp án "nghe kêu" nhưng sai · Kế hoạch ôn 2 tuần'],
  ]],
  ['Chapter 16 — Exam prep: Solutions Architect – Associate (SAA-C03)', 'Chương 16 — Luyện thi: Solutions Architect – Associate (SAA-C03)', 'Bốn domain thiết kế: an toàn, chịu lỗi, hiệu năng, tối ưu chi phí — câu tình huống TỰ VIẾT và đề thử.', [
    ['ban-do', 'Exam map: four design domains', 'Bản đồ đề: bốn domain thiết kế', 'Secure 30% · Resilient 26% · High-Performing 24% · Cost-Optimized 20% · Cách đọc câu tình huống dài'],
    ['an-toan', 'Design secure architectures', 'Thiết kế kiến trúc an toàn', 'IAM nhiều tài khoản · Mã hoá · Mạng nhiều lớp · 10 câu luyện'],
    ['chiu-loi', 'Design resilient architectures', 'Thiết kế kiến trúc chịu lỗi', 'Multi-AZ, multi-region · Tách bằng hàng đợi · Chiến lược DR · 10 câu luyện'],
    ['hieu-nang', 'Design high-performing architectures', 'Thiết kế kiến trúc hiệu năng cao', 'Chọn lưu trữ, CSDL, cache, CDN · Co giãn · 10 câu luyện'],
    ['chi-phi', 'Design cost-optimized architectures', 'Thiết kế kiến trúc tối ưu chi phí', 'Chọn mô hình giá · Lớp lưu trữ · Truyền dữ liệu · 10 câu luyện'],
    ['de-thu', 'Full practice exam and what to study next', 'Đề thử đầy đủ và học gì tiếp', 'Đề thử tự viết · Phân tích câu sai · Lộ trình sau SAA (Developer, DevOps) · Ghi chứng chỉ vào CV'],
  ]],
];

const sections = khung('aws', CHUONG);
sections[0] = s00;
sections[1] = s01;
sections[2] = s02;
sections[3] = s03;
sections[4] = s04;
sections[5] = s05;
sections[6] = s06;
sections[7] = s07;
sections[8] = s08;
sections[9] = s09;
sections[10] = s10;

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'cloud-aws',
    title: 'Cloud Fundamentals (AWS)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/cloud-aws.png?v=1',
    shortDescription: 'AWS from zero to a real production deploy and two certifications: IAM, S3, VPC, EC2, RDS, ECS Fargate, Lambda, Terraform, CI/CD — with a budget alarm first.|||AWS từ số 0 tới deploy kiểu production và hai chứng chỉ: IAM, S3, VPC, EC2, RDS, ECS Fargate, Lambda, Terraform, CI/CD — đặt cảnh báo ngân sách trước tiên.',
    description: 'Khoá AWS cho lập trình viên backend (Node.js/Spring Boot), học được từ con số 0. Mở tài khoản an toàn và đặt cảnh báo ngân sách trước mọi thứ; IAM và quyền tối thiểu; S3 (và vì sao R2 của cuongthai.com nói cùng giao thức); VPC, EC2, ALB, Auto Scaling, Route 53, CloudFront; RDS PostgreSQL và bí mật; ECR + ECS Fargate; Lambda + API Gateway; SQS/SNS/EventBridge; CloudWatch; Terraform cho mọi thứ; CI/CD GitHub Actions → ECR → ECS; chi phí và bảo mật qua các sự cố thật. Mọi demo chạy thật trên LocalStack + Terraform ở máy bạn; dự án cuối khoá đưa API đặt lịch phòng lab LabFlow lên AWS kiểu production; hai chương luyện thi CLF-C02 và SAA-C03 với câu luyện tự viết.',
    whatYouLearn: 'Mở tài khoản AWS an toàn với Budgets + MFA; đọc và viết policy IAM theo quyền tối thiểu; dùng S3 và URL ký sẵn từ Node.js/Java; dựng VPC public/private; chạy ứng dụng trên EC2, ECS Fargate và Lambda; dùng RDS, Secrets Manager, SQS/SNS; quan sát bằng CloudWatch; viết Terraform và CI/CD không cần khoá dài hạn; tối ưu chi phí, nhận ra các lỗi bảo mật kinh điển; ôn thi Cloud Practitioner và Solutions Architect – Associate.',
    requirements: 'Linux cơ bản, Docker, Git, viết được một API nhỏ (Node.js hoặc Spring Boot). Nên học trước khoá Linux & Bash, Docker, GitHub Actions và Deploy VPS.',
    documentsNote: 'Tài liệu chính: docs.aws.amazon.com • AWS Well-Architected Framework • aws.amazon.com/free • Exam guide CLF-C02 và SAA-C03 (aws.amazon.com/certification) • developer.hashicorp.com/terraform • docs.localstack.cloud • AWS Skill Builder.',
  },
  sections,
};
