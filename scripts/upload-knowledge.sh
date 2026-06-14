#!/usr/bin/env bash
# Upload personal knowledge base to CuongMini AI.
set -uo pipefail

API="https://cuongthai.com"

echo "🔐 Logging in..."
TOKEN=$(curl -s --max-time 10 -X POST "$API/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"Cuong03dx","password":"Cuong123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")
echo "   Token: ${TOKEN:0:30}..."
echo

upload() {
  local id="$1" type="$2" content="$3"
  local body chunks
  body=$(printf '%s' "$content" | python3 -c "import json,sys; print(json.dumps({'documentId':'$id','documentType':'$type','content':sys.stdin.read()}))")
  local res
  res=$(curl -s --max-time 30 -X POST "$API/api/v1/ai/admin/documents" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$body")
  chunks=$(printf '%s' "$res" | python3 -c "import sys,json
try:
  d=json.load(sys.stdin)
  print(d.get('data',{}).get('chunksCreated', 'ERR: '+str(d)))
except Exception as e:
  print('PARSE_ERR: '+str(e)+' raw='+sys.stdin.read()[:200])" 2>&1)
  echo "  [$type] $id → $chunks"
}

echo "=== Uploading 7 knowledge chunks ==="

upload "bio-overview-2026" "personal_bio" "Hoàng Nghĩa Cường (tên thường gọi CuongThaiswit, online brand CuongMini và CuongHoangDev). Sinh 03/11/2003 tại Hà Nội Việt Nam. Sinh viên FPT University chuyên ngành Software Engineering khóa K17 (2022-2026), GPA tích lũy khoảng 3.0/4.0. Tiếng Anh TOEIC 600+ giao tiếp cơ bản. Vai trò Fullstack Developer và AI/ML enthusiast. Sở thích: lập trình fullstack Next.js React Node.js TypeScript, AI/LLM Groq OpenAI RAG prompt engineering, DevOps Docker Nginx CI/CD Linux, marketing cá nhân trên Facebook Zalo, thể thao gym chạy bộ bơi lội, đọc sách self-help và technical books. Tính cách hướng nội introvert nhưng thân thiện, cẩn thận tỉ mỉ ham học hỏi, thích giúp đỡ người khác, thích làm việc độc lập tự chủ. Mục tiêu nghề nghiệp: Senior Fullstack Developer trong 3-5 năm tới, xây dựng portfolio CuongHoangDev thành thương hiệu có tầm ảnh hưởng, phát triển sản phẩm AI chatbot phục vụ cộng đồng Việt Nam, mức lương 2000-3000 USD mỗi tháng trong 2 năm tới."

upload "contact-info-2026" "contact" "Thông tin liên hệ của Hoàng Nghĩa Cường CuongHoangDev. Email chính cuongthaihnhe176322@gmail.com. Số điện thoại và Zalo 0399360938. Facebook https://www.facebook.com/CuongThaiswit tên Hoàng Nghĩa Cường. GitHub https://github.com/cuonghoang1103. Website portfolio https://cuongthai.com. API backend https://api.cuongthai.com. Địa chỉ Hà Nội Việt Nam. Kênh liên lạc ưu tiên Zalo phản hồi nhanh nhất, email phản hồi trong 24h, Facebook thỉnh thoảng check. Giờ làm việc Thứ 2 đến Thứ 7 từ 9:00 đến 22:00 giờ Việt Nam, Chủ nhật 14:00 đến 20:00 giờ Việt Nam. Ngoài giờ vẫn nhận tin nhắn nhưng phản hồi chậm hơn."

upload "skills-tech-2026" "skills" "Kỹ năng kỹ thuật chi tiết của Hoàng Nghĩa Cường CuongHoangDev. Frontend: Next.js 14 App Router Server Components Server Actions 2 năm kinh nghiệm, React 18 3 năm, TypeScript thành thạo 2 năm, Tailwind CSS thành thạo, Framer Motion trung cấp, next-intl i18n Việt Anh trung cấp. Backend: Node.js Express 2.5 năm, TypeScript 2 năm, REST API thành thạo, GraphQL cơ bản, WebSocket SSE trung cấp, JWT thành thạo, Passport OAuth2 trung cấp. Database: PostgreSQL thành thạo 2 năm, Prisma ORM thành thạo, MySQL trung cấp, Redis trung cấp, pgvector cơ bản, MongoDB cơ bản. DevOps: Docker Compose thành thạo, Nginx reverse proxy SSL thành thạo, Linux Ubuntu trung cấp, Git GitHub thành thạo, Let's Encrypt Certbot trung cấp, VPS deployment thành thạo. AI/ML: Groq API OpenAI-compatible thành thạo, OpenAI API trung cấp, LLM prompting trung cấp, RAG trung cấp, embeddings vector databases cơ bản."

upload "projects-portfolio-2026" "projects" "Các project cá nhân nổi bật của Hoàng Nghĩa Cường CuongHoangDev. Project 1: CuongHoangDev Portfolio tại cuongthai.com (2024-2026) là website portfolio và AI chatbot chính là dự án hiện tại, dùng Next.js 14 TypeScript Prisma PostgreSQL Docker Nginx Groq AI với features authentication email password Google OAuth GitHub OAuth AI chatbot CuongMini streaming SSE RAG knowledge base admin upload documents music player course platform project showcase payment integration VNPay Momo admin dashboard i18n Việt Anh, source code tại https://github.com/cuonghoang1103, đang phát triển và bảo trì. Project 2: Cyber Terminal Dashboard nội bộ lấy cảm hứng Cyberpunk 2077 hiển thị tasks achievements stats theo phong cách cyberpunk dùng Next.js Framer Motion Tailwind. Project 3: AI Chatbot Platform đang phát triển cho nhiều lĩnh vực giáo dục bán hàng hỗ trợ khách hàng multi-tenant multi-language dùng Next.js FastAPI Python PostgreSQL Qdrant. Tech stack ưa thích: Next.js TypeScript Prisma PostgreSQL Docker ưu tiên hiệu năng SEO UX dark mode animation tinh tế bảo mật JWT OAuth rate-limit CORS đúng cách."

upload "pricing-services-2026" "pricing" "Bảng giá dịch vụ freelance của Hoàng Nghĩa Cường CuongHoangDev. Dịch vụ 1 thiết kế website portfolio cá nhân: Gói Basic 1-3 trang 1-2 tuần giá 3.000.000 đến 5.000.000 VND, Gói Standard 5-8 trang 2-4 tuần giá 7.000.000 đến 12.000.000 VND, Gói Premium 10+ trang AI chatbot payment 1-2 tháng giá 15.000.000 đến 30.000.000 VND. Dịch vụ 2 website bán hàng e-commerce: Gói cơ bản 10-20 sản phẩm giá 8.000.000 đến 15.000.000 VND, Gói nâng cao 100+ sản phẩm payment admin giá 20.000.000 đến 50.000.000 VND. Dịch vụ 3 AI Chatbot giống CuongMini: Gói Basic 1 AI 1 website giá 5.000.000 đến 10.000.000 VND, Gói Standard 1 AI RAG knowledge base admin giá 15.000.000 đến 25.000.000 VND, Gói Premium multi-AI multi-tenant custom giá 30.000.000 VND trở lên. Dịch vụ 4 tư vấn kỹ thuật 1-1 giá 500.000 VND mỗi giờ tối thiểu 1 giờ. Phương thức thanh toán: chuyển khoản ngân hàng MoMo ZaloPay VNPay qua website, thanh toán 50% trước 50% khi bàn giao. Chính sách bảo hành 3-6 tháng miễn phí, hỗ trợ kỹ thuật qua Zalo trong giờ làm việc, source code bàn giao đầy đủ."

upload "education-fpt-2026" "education" "Thông tin học vấn của Hoàng Nghĩa Cường CuongHoangDev. Trường FPT University (Đại học FPT) campus Hà Nội Hoa Lạc chuyên ngành Software Engineering (Kỹ thuật phần mềm) khóa K17 (2022-2026) GPA tích lũy khoảng 3.0/4.0. Môn học nổi bật đã hoàn thành: Cấu trúc dữ liệu và Giải thuật, Lập trình hướng đối tượng OOP, Cơ sở dữ liệu SQL NoSQL, Mạng máy tính, Phát triển ứng dụng web, Trí tuệ nhân tạo AI, Học máy Machine Learning, Kỹ thuật phần mềm Software Engineering, Quản lý dự án Project Management. Hoạt động ngoại khoá: tham gia CLB lập trình, Hackathon FPT 2023 và 2024, làm freelance từ năm 2, mentor cho sinh viên năm nhất."

upload "faq-how-can-i-help-2026" "faq" "FAQ các câu hỏi thường gặp về Hoàng Nghĩa Cường CuongHoangDev. Cường có nhận làm freelance không? Có, Cường nhận các dự án website portfolio e-commerce AI chatbot tư vấn kỹ thuật, liên hệ qua Zalo 0399360938 hoặc email cuongthaihnhe176322@gmail.com. Cường học trường nào? FPT University chuyên ngành Software Engineering khóa K17 2022-2026. Website này là gì? Đây là portfolio cá nhân và AI chatbot của Cường tên CuongHoangDev, bạn có thể xem các project kỹ năng blog và chat với AI CuongMini chính là bot bạn đang nói chuyện. Con AI này có phải Cường lập trình không? Đúng vậy toàn bộ backend frontend và AI integration trên website này đều do Cường tự code, AI sử dụng Groq API mô hình Llama 3.1 8B Instant và có RAG Retrieval Augmented Generation để trả lời chính xác về Cường. Cường có thể dạy lập trình không? Hiện tại Cường chưa có khoá học chính thức nhưng có thể tư vấn 1-1 qua Zoom Google Meet với phí 500.000 VND mỗi giờ. Làm sao để thuê Cường làm project? Bước 1 liên hệ qua Zalo 0399360938 hoặc email, Bước 2 mô tả yêu cầu dự án mục đích tính năng deadline budget, Bước 3 Cường sẽ gửi báo giá timeline trong 24-48h, Bước 4 ký hợp đồng đặt cọc 50%, Bước 5 bắt đầu phát triển cập nhật tiến độ hàng tuần. Thời gian hoàn thành website portfolio: Gói Basic 1-2 tuần, Gói Standard 2-4 tuần, Gói Premium 1-2 tháng."

echo
echo "✅ All uploads complete"
