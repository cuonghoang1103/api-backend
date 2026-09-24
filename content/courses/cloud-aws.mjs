/**
 * Cloud cơ bản (AWS) — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (status DRAFT), chi tiết soạn sau.
 * ⚠️ Khi soạn chi tiết: chỉ dùng Free Tier, luôn đặt cảnh báo chi phí (Budgets) trước, dọn tài nguyên sau mỗi bài.
 * Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'cloud-aws',
    title: 'Cloud Fundamentals (AWS)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'DRAFT',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/cloud-aws.png?v=1',
    shortDescription: 'The cloud from a developer’s seat: IAM, networking (VPC), compute (EC2, containers, Lambda), storage (S3), databases (RDS), deploying a real app — and never waking up to a surprise bill.|||Cloud từ góc nhìn lập trình viên: IAM, mạng (VPC), máy chủ (EC2, container, Lambda), lưu trữ (S3), cơ sở dữ liệu (RDS), đưa một ứng dụng thật lên — và không bao giờ thức dậy với hoá đơn bất ngờ.',
    description: 'Khoá cloud cơ bản lấy AWS làm ví dụ chính (khái niệm dùng được cho GCP/Azure). Đi từ vì sao cloud, mô hình trách nhiệm chung, tài khoản và chi phí an toàn; IAM và quyền tối thiểu; VPC, subnet, security group; EC2 so với VPS bạn đang dùng; container trên ECS/App Runner; serverless với Lambda; S3 và CDN; RDS Postgres; bí mật và cấu hình; triển khai bằng GitHub Actions với OIDC; hạ tầng dưới dạng mã (Terraform nhập môn); giám sát và chi phí; tới dự án cuối khoá đưa app đặt lịch lên AWS.',
    whatYouLearn: 'Mở tài khoản AWS an toàn với cảnh báo chi phí; cấp quyền IAM tối thiểu; dựng mạng VPC hợp lý; chạy ứng dụng trên EC2, container và Lambda; dùng S3 và RDS; triển khai từ GitHub Actions không cần khoá bí mật dài hạn; viết Terraform cơ bản; và so sánh cloud với VPS để chọn đúng cho dự án.',
    requirements: 'Linux cơ bản, Docker, Git. Nên học trước khoá Linux & Bash, Docker, GitHub Actions và Deploy VPS.',
    documentsNote: 'Tài liệu chính: docs.aws.amazon.com • AWS Well-Architected Framework • aws.amazon.com/free • developer.hashicorp.com/terraform • AWS Skill Builder.',
  },
  sections: khung('aws', [
    ['Section 0 — What the cloud is', 'Mục 0 — Cloud là gì', 'Cloud khác VPS thế nào, và mở tài khoản an toàn.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What the cloud is, and why employers ask for it', 'Bắt đầu tại đây (1/2) — Điện toán đám mây là gì, ra đời thế nào, vì sao nhà tuyển dụng đòi', 'Cloud bằng hình ảnh đời thường · Lịch sử: AWS 2006, S3/EC2 · IaaS/PaaS/SaaS · Tin tuyển dụng ghi "biết AWS" nghĩa là gì'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Cloud disasters: surprise bills, public buckets, leaked keys', 'Bắt đầu tại đây (2/2) — Thảm hoạ cloud: hoá đơn bất ngờ, bucket công khai, lộ khoá', 'Sự cố thật có nguồn · Sinh viên bị tính tiền vì quên tắt máy · Lộ trình học an toàn'],
      ['tai-khoan', 'A safe AWS account: root, MFA, budgets', 'Tài khoản AWS an toàn: root, MFA, ngân sách', 'Khoá root · MFA · Budgets + cảnh báo · Free Tier'],
      ['cloud-vs-vps', 'Cloud vs the VPS you already run', 'Cloud so với VPS bạn đang chạy', 'Chi phí thật · Khi nào VPS là đủ · Khi nào cần cloud'],
    ]],
    ['Chapter 1 — Identity and access (IAM)', 'Chương 1 — Danh tính và quyền truy cập (IAM)', 'Ai được làm gì, và quyền tối thiểu.', [
      ['khai-niem', 'Users, groups, roles and policies', 'User, group, role và policy', 'Khác nhau thế nào · Đọc một policy JSON'],
      ['toi-thieu', 'Least privilege in practice', 'Quyền tối thiểu trong thực tế', 'Bắt đầu từ không · Access Analyzer'],
      ['khoa', 'Access keys, CLI profiles and SSO', 'Khoá truy cập, profile CLI và SSO', 'aws configure · Không để khoá trong code'],
      ['oidc', 'Roles for machines: OIDC from GitHub Actions', 'Role cho máy: OIDC từ GitHub Actions', 'Không cần khoá dài hạn · Trỏ khoá GitHub Actions Ch6'],
    ]],
    ['Chapter 2 — Networking (VPC)', 'Chương 2 — Mạng (VPC)', 'Subnet, route, security group — dựng một mạng hợp lý.', [
      ['vpc', 'VPC, subnets and route tables', 'VPC, subnet và bảng định tuyến', 'Public vs private subnet · CIDR nhập môn'],
      ['security-group', 'Security groups and NACLs', 'Security group và NACL', 'Mở cổng tối thiểu · So với firewall VPS'],
      ['nat', 'Internet and NAT gateways', 'Internet gateway và NAT gateway', 'Máy private ra Internet · Chi phí NAT'],
      ['dns', 'DNS and load balancers', 'DNS và load balancer', 'Route 53 · ALB · Chứng chỉ ACM'],
    ]],
    ['Chapter 3 — Compute: EC2', 'Chương 3 — Máy chủ: EC2', 'Máy ảo trên cloud, so với VPS.', [
      ['ec2', 'Launching and connecting to EC2', 'Tạo và kết nối EC2', 'Loại máy · AMI · SSH hoặc Session Manager'],
      ['user-data', 'Bootstrapping with user data', 'Khởi tạo bằng user data', 'Cài Docker tự động · Chạy app khi máy lên'],
      ['luu-tru', 'EBS volumes and snapshots', 'Ổ EBS và snapshot', 'Dữ liệu sống qua máy · Sao lưu'],
      ['chi-phi', 'Instance pricing: on-demand, spot, savings', 'Giá máy: on-demand, spot, gói tiết kiệm', 'Tính chi phí tháng · Tắt khi không dùng'],
    ]],
    ['Chapter 4 — Containers on AWS', 'Chương 4 — Container trên AWS', 'ECR, ECS/Fargate, App Runner.', [
      ['ecr', 'ECR: your private image registry', 'ECR: kho ảnh riêng', 'Đẩy ảnh từ CI · So với GHCR'],
      ['ecs', 'ECS on Fargate', 'ECS trên Fargate', 'Task, service, cluster · Không cần quản máy'],
      ['app-runner', 'App Runner and simpler options', 'App Runner và lựa chọn đơn giản hơn', 'Từ ảnh ra URL · Khi nào đủ'],
      ['so-sanh', 'Choosing: EC2 vs ECS vs Kubernetes (EKS)', 'Chọn: EC2 vs ECS vs Kubernetes (EKS)', 'Bảng so sánh · Trỏ khoá Kubernetes'],
    ]],
    ['Chapter 5 — Serverless', 'Chương 5 — Serverless', 'Lambda, API Gateway và khi nào serverless hợp lý.', [
      ['lambda', 'Lambda functions', 'Hàm Lambda', 'Handler Node.js · Cold start · Giới hạn'],
      ['api-gateway', 'HTTP APIs with API Gateway', 'API HTTP với API Gateway', 'Route · Xác thực · Chi phí theo request'],
      ['su-kien', 'Event-driven: S3, SQS, EventBridge triggers', 'Hướng sự kiện: kích hoạt từ S3, SQS, EventBridge', 'Xử lý ảnh khi tải lên · Việc định kỳ'],
      ['khi-nao', 'When serverless is (not) a good idea', 'Khi nào serverless (không) hợp', 'Tải thấp/đột biến · Khoá nhà cung cấp'],
    ]],
    ['Chapter 6 — Storage and CDN', 'Chương 6 — Lưu trữ và CDN', 'S3, quyền truy cập và phân phối nội dung.', [
      ['s3', 'S3 buckets and objects', 'Bucket và object S3', 'Lớp lưu trữ · Phiên bản · Vòng đời'],
      ['quyen', 'S3 permissions and presigned URLs', 'Quyền S3 và URL ký sẵn', 'Chặn truy cập công khai · Tải lên trực tiếp từ trình duyệt'],
      ['cdn', 'CloudFront CDN', 'CDN CloudFront', 'Cache · HTTPS · So với Cloudflare R2 bạn đang dùng'],
      ['sao-luu', 'Backups and data lifecycle', 'Sao lưu và vòng đời dữ liệu', 'Glacier · Khôi phục'],
    ]],
    ['Chapter 7 — Databases', 'Chương 7 — Cơ sở dữ liệu', 'RDS Postgres và các lựa chọn khác.', [
      ['rds', 'RDS for PostgreSQL', 'RDS cho PostgreSQL', 'Tạo trong subnet private · Kết nối từ app'],
      ['van-hanh', 'Backups, replicas and maintenance', 'Sao lưu, bản sao và bảo trì', 'Snapshot · Read replica · Multi-AZ'],
      ['bi-mat', 'Secrets Manager and Parameter Store', 'Secrets Manager và Parameter Store', 'Không để mật khẩu trong code · Xoay khoá'],
      ['khac', 'DynamoDB and ElastiCache in brief', 'DynamoDB và ElastiCache tóm tắt', 'Khi nào dùng · Chi phí'],
    ]],
    ['Chapter 8 — Infrastructure as code', 'Chương 8 — Hạ tầng dưới dạng mã', 'Terraform: dựng lại mọi thứ bằng một lệnh.', [
      ['vi-sao', 'Why click-ops does not scale', 'Vì sao bấm tay không mở rộng được', 'Không tái lập được · Quên dọn'],
      ['terraform', 'Terraform basics', 'Terraform căn bản', 'Provider · Resource · plan/apply/destroy'],
      ['state', 'State, modules and environments', 'State, module và môi trường', 'State từ xa · Module · dev/prod'],
      ['ci', 'Terraform in GitHub Actions', 'Terraform trong GitHub Actions', 'plan trên PR · apply có duyệt'],
    ]],
    ['Chapter 9 — Observability and cost', 'Chương 9 — Quan sát và chi phí', 'CloudWatch, cảnh báo và hoá đơn.', [
      ['cloudwatch', 'CloudWatch logs and metrics', 'Log và chỉ số CloudWatch', 'Log nhóm · Chỉ số · Dashboard'],
      ['canh-bao', 'Alarms that matter', 'Cảnh báo đáng có', 'CPU, lỗi, độ trễ · Gửi về email/Slack'],
      ['chi-phi', 'Understanding the bill', 'Hiểu hoá đơn', 'Cost Explorer · Tag · Thủ phạm hay gặp'],
      ['don-dep', 'Cleaning up everything', 'Dọn sạch mọi thứ', 'Checklist dọn · terraform destroy'],
    ]],
    ['Chapter 10 — Capstone: the booking app on AWS', 'Chương 10 — Dự án cuối khoá: app đặt lịch trên AWS', 'Từ Terraform tới CI/CD và giám sát.', [
      ['kien-truc', 'Architecture and cost estimate', 'Kiến trúc và ước tính chi phí', 'Sơ đồ · Tính tiền tháng · So với VPS'],
      ['dung', 'Building it with Terraform', 'Dựng bằng Terraform', 'VPC · RDS · ECS/App Runner · S3'],
      ['cicd', 'CI/CD with OIDC', 'CI/CD với OIDC', 'Build ảnh · Đẩy ECR · Deploy'],
      ['tong-ket', 'Operate, tear down, and interview story', 'Vận hành, dỡ bỏ, và câu chuyện phỏng vấn', 'Giám sát · Dọn sạch · Kể dự án · Chứng chỉ Cloud Practitioner nên thi không'],
    ]],
  ]),
};
