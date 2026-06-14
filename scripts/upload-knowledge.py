#!/usr/bin/env python3
"""Upload personal knowledge base chunks to CuongMini AI RAG."""
import json
import sys
import time
import urllib.error
import urllib.request

API = "https://cuongthai.com"


def login() -> str:
    req = urllib.request.Request(
        f"{API}/api/v1/auth/login",
        data=json.dumps({"username": "Cuong03dx", "password": "Cuong123"}).encode(),
        headers={
            "Content-Type": "application/json",
            "User-Agent": "CuongMini-Knowledge-Uploader/1.0",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["data"]["token"]


def upload(token: str, doc_id: str, doc_type: str, content: str) -> dict:
    body = json.dumps({
        "documentId": doc_id,
        "documentType": doc_type,
        "content": content,
    }).encode()
    req = urllib.request.Request(
        f"{API}/api/v1/ai/admin/documents",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "CuongMini-Knowledge-Uploader/1.0",
        },
        method="POST",
    )
    last_err = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            last_err = e
            # 502/503/504 are transient, retry with backoff
            if e.code in (502, 503, 504) and attempt < 2:
                time.sleep(1 + attempt)
                continue
            raise
    raise last_err  # pragma: no cover


CHUNKS = [    {
        "id": "bio-overview-2026",
        "type": "personal_bio",
        "content": """Hoàng Nghĩa Cường (tên thường gọi: CuongThaiswit, online brand: CuongMini/CuongHoangDev)

# Thông tin cơ bản
- Sinh: 03/11/2003
- Quê quán: Hà Nội, Việt Nam
- Học vấn: Sinh viên FPT University, chuyên ngành Software Engineering (Công nghệ thông tin)
- Năm học: 2022 - 2026 (kỳ vọng tốt nghiệp)
- Tiếng Anh: TOEIC 600+, giao tiếp cơ bản
- Vai trò: Fullstack Developer + AI/ML enthusiast

# Sở thích & đam mê
- Lập trình fullstack: Next.js, React, Node.js, TypeScript
- AI/LLM: Groq, OpenAI, RAG, prompt engineering
- DevOps: Docker, Nginx, CI/CD, Linux
- Marketing cá nhân: Xây dựng thương hiệu cá nhân trên Facebook, Zalo
- Thể thao: Gym, chạy bộ, bơi lội
- Đọc sách: Self-help, technical books

# Tính cách
- Hướng nội (introvert) nhưng thân thiện
- Cẩn thận, tỉ mỉ, ham học hỏi
- Thích giúp đỡ người khác, hay chia sẻ kiến thức
- Thích làm việc độc lập và tự chủ

# Mục tiêu nghề nghiệp
- Trở thành Senior Fullstack Developer trong 3-5 năm tới
- Xây dựng portfolio website cá nhân (CuongHoangDev) thành thương hiệu có tầm ảnh hưởng
- Phát triển các sản phẩm AI chatbot phục vụ cộng đồng Việt Nam
- Đạt mức lương 2000-3000 USD/tháng trong 2 năm tới""",
    },
    {
        "id": "contact-info-2026",
        "type": "contact",
        "content": """Thông tin liên hệ của Hoàng Nghĩa Cường (CuongHoangDev)

# Kênh liên hệ chính
- Email chính: cuongthaihnhe176322@gmail.com
- Số điện thoại/Zalo: 0399360938
- Facebook: https://www.facebook.com/CuongThaiswit (tên: Hoàng Nghĩa Cường)
- GitHub: https://github.com/cuonghoang1103
- Website portfolio: https://cuongthai.com
- API backend: https://api.cuongthai.com
- Địa chỉ: Hà Nội, Việt Nam

# Kênh liên lạc ưu tiên
1. Zalo (phản hồi nhanh nhất)
2. Email (phản hồi trong 24h)
3. Facebook (thỉnh thoảng check)

# Giờ làm việc / sẵn sàng chat
- Thứ 2 - Thứ 7: 9:00 - 22:00 (giờ VN)
- Chủ nhật: 14:00 - 20:00 (giờ VN)
- Ngoài giờ: vẫn nhận tin nhắn nhưng phản hồi chậm hơn""",
    },
    {
        "id": "skills-tech-2026",
        "type": "skills",
        "content": """Kỹ năng kỹ thuật chi tiết của Hoàng Nghĩa Cường (CuongHoangDev)

# Frontend
- Next.js 14 (App Router, Server Components, Server Actions): 2 năm kinh nghiệm
- React 18: 3 năm kinh nghiệm
- TypeScript: thành thạo (2 năm)
- Tailwind CSS, CSS-in-JS: thành thạo
- Framer Motion (animation): trung cấp
- next-intl (i18n tiếng Việt/Anh): trung cấp

# Backend
- Node.js + Express: 2.5 năm
- TypeScript: 2 năm
- REST API design: thành thạo
- GraphQL: cơ bản
- WebSocket / SSE: trung cấp
- JWT authentication: thành thạo
- Passport.js, OAuth2: trung cấp

# Database
- PostgreSQL: thành thạo (2 năm)
- Prisma ORM: thành thạo
- MySQL: trung cấp
- Redis (cache, rate-limit): trung cấp
- pgvector (vector search): cơ bản
- MongoDB: cơ bản

# DevOps & Tools
- Docker + Docker Compose: thành thạo
- Nginx (reverse proxy, SSL): thành thạo
- Linux (Ubuntu Server): trung cấp
- Git + GitHub: thành thạo
- Let's Encrypt (Certbot): trung cấp
- Bash scripting: cơ bản
- VPS deployment: thành thạo (đã deploy nhiều dự án lên DigitalOcean, Contabo)

# AI / ML
- Groq API (OpenAI-compatible): thành thạo (đang sử dụng cho chatbot này)
- OpenAI API: trung cấp
- LLM prompting: trung cấp
- RAG (Retrieval Augmented Generation): trung cấp
- Embeddings, vector databases: cơ bản
- Hugging Face Transformers: cơ bản

# Khác
- Marketing cá nhân / content creation: trung cấp
- UI/UX design (Figma): cơ bản
- Photoshop, Canva: cơ bản""",
    },
    {
        "id": "projects-portfolio-2026",
        "type": "projects",
        "content": """Các project cá nhân nổi bật của Hoàng Nghĩa Cường (CuongHoangDev)

# 1. CuongHoangDev Portfolio (cuongthai.com) - 2024-2026
- Website portfolio + AI chatbot (chính là dự án hiện tại)
- Tech: Next.js 14, TypeScript, Prisma, PostgreSQL, Docker, Nginx, Groq AI
- Features:
  - Authentication (email/password, Google OAuth, GitHub OAuth)
  - AI chatbot CuongMini (streaming SSE)
  - RAG knowledge base (admin upload documents)
  - Music player, course platform, project showcase
  - Payment integration (VNPay, Momo)
  - Admin dashboard
  - i18n (Việt/Anh)
- Source: https://github.com/cuonghoang1103
- Status: Đang phát triển & bảo trì

# 2. Cyber Terminal Dashboard (nội bộ)
- Game/UI concept lấy cảm hứng từ Cyberpunk 2077
- Hiển thị tasks, achievements, stats theo phong cách cyberpunk
- Tech: Next.js, Framer Motion, Tailwind
- Status: Production

# 3. AI Chatbot Platform (đang phát triển)
- Chatbot AI cho nhiều lĩnh vực (giáo dục, bán hàng, hỗ trợ khách hàng)
- Multi-tenant, multi-language
- Tech: Next.js, FastAPI (Python), PostgreSQL, Qdrant
- Status: MVP

# Tech stack ưa thích (cho freelance/dự án mới)
- Next.js + TypeScript + Prisma + PostgreSQL + Docker
- Ưu tiên hiệu năng, SEO, UX
- Ưu tiên dark mode + animation tinh tế
- Ưu tiên bảo mật (JWT, OAuth, rate-limit, CORS đúng cách)""",
    },
    {
        "id": "pricing-services-2026",
        "type": "pricing",
        "content": """Bảng giá dịch vụ freelance của Hoàng Nghĩa Cường (CuongHoangDev)

# 1. Thiết kế website portfolio cá nhân
- Gói Basic (1-3 trang, 1-2 tuần): 3.000.000 - 5.000.000 VND
- Gói Standard (5-8 trang, 2-4 tuần): 7.000.000 - 12.000.000 VND
- Gói Premium (10+ trang, AI chatbot, payment, 1-2 tháng): 15.000.000 - 30.000.000 VND

# 2. Website bán hàng / E-commerce
- Gói cơ bản (10-20 sản phẩm): 8.000.000 - 15.000.000 VND
- Gói nâng cao (100+ sản phẩm, payment, admin): 20.000.000 - 50.000.000 VND

# 3. AI Chatbot (giống CuongMini)
- Gói Basic (1 AI, 1 website): 5.000.000 - 10.000.000 VND
- Gói Standard (1 AI + RAG knowledge base + admin): 15.000.000 - 25.000.000 VND
- Gói Premium (multi-AI, multi-tenant, custom): 30.000.000+ VND

# 4. Tư vấn kỹ thuật (1-1)
- 500.000 VND / giờ
- Tối thiểu 1 giờ

# Phương thức thanh toán
- Chuyển khoản ngân hàng
- MoMo, ZaloPay
- VNPay (qua website)
- Thanh toán 50% trước, 50% khi bàn giao

# Chính sách
- Bảo hành 3-6 tháng miễn phí
- Hỗ trợ kỹ thuật qua Zalo trong giờ làm việc
- Source code bàn giao đầy đủ""",
    },
    {
        "id": "education-fpt-2026",
        "type": "education",
        "content": """Thông tin học vấn của Hoàng Nghĩa Cường (CuongHoangDev)

# Trường
- FPT University (Đại học FPT)
- Campus: Hà Nội (Hoa Lạc)
- Chuyên ngành: Software Engineering (Kỹ thuật phần mềm)
- Khóa: K17 (2022 - 2026)
- GPA tích lũy: ~3.0/4.0 (tốt)

# Môn học nổi bật đã hoàn thành
- Cấu trúc dữ liệu & Giải thuật
- Lập trình hướng đối tượng (OOP)
- Cơ sở dữ liệu (SQL, NoSQL)
- Mạng máy tính
- Phát triển ứng dụng web
- Trí tuệ nhân tạo (AI)
- Học máy (Machine Learning)
- Kỹ thuật phần mềm (Software Engineering)
- Quản lý dự án (Project Management)

# Hoạt động ngoại khoá
- Tham gia CLB lập trình
- Hackathon FPT (2023, 2024)
- Làm freelance từ năm 2
- Mentor cho sinh viên năm nhất""",
    },
    {
        "id": "faq-how-can-i-help-2026",
        "type": "faq",
        "content": """FAQ - Các câu hỏi thường gặp về Hoàng Nghĩa Cường (CuongHoangDev)

# Cường có nhận làm freelance không?
Có. Cường nhận các dự án website portfolio, e-commerce, AI chatbot, tư vấn kỹ thuật. Liên hệ qua Zalo 0399360938 hoặc email cuongthaihnhe176322@gmail.com.

# Cường học trường nào?
FPT University, chuyên ngành Software Engineering, khóa K17 (2022-2026).

# Website này là gì?
Đây là portfolio cá nhân + AI chatbot của Cường, tên là CuongHoangDev. Bạn có thể xem các project, kỹ năng, blog, và chat với AI CuongMini (chính là bot bạn đang nói chuyện).

# Con AI này có phải Cường lập trình không?
Đúng vậy. Toàn bộ backend, frontend, và AI integration trên website này đều do Cường tự code. AI sử dụng Groq API (mô hình Llama 3.1 8B Instant) và có RAG (Retrieval Augmented Generation) để trả lời chính xác về Cường.

# Cường có thể dạy lập trình không?
Hiện tại Cường chưa có khoá học chính thức, nhưng có thể tư vấn 1-1 qua Zoom/Google Meet với phí 500.000 VND / giờ. Nếu bạn cần học bài bản, có thể tham gia khoá học của FPT University.

# Làm sao để thuê Cường làm project?
Bước 1: Liên hệ qua Zalo 0399360938 hoặc email.
Bước 2: Mô tả yêu cầu dự án (mục đích, tính năng, deadline, budget).
Bước 3: Cường sẽ gửi báo giá + timeline trong 24-48h.
Bước 4: Ký hợp đồng + đặt cọc 50%.
Bước 5: Bắt đầu phát triển, cập nhật tiến độ hàng tuần.

# Thời gian hoàn thành website portfolio?
- Gói Basic: 1-2 tuần
- Gói Standard: 2-4 tuần
- Gói Premium: 1-2 tháng""",
    },
]


def main() -> int:
    print("🔐 Logging in...")
    token = login()
    print(f"   Token: {token[:30]}...\n")

    ok = 0
    for chunk in CHUNKS:
        print(f"→ [{chunk['type']}] {chunk['id']} ({len(chunk['content'])} chars)")
        try:
            res = upload(token, chunk["id"], chunk["type"], chunk["content"])
            n = res.get("data", {}).get("chunksCreated", "?")
            print(f"   ✓ Created {n} chunks")
            ok += 1
        except Exception as e:
            print(f"   ✗ FAILED: {e}")

    print(f"\n📊 Done: {ok}/{len(CHUNKS)} uploads OK")
    return 0 if ok == len(CHUNKS) else 1


if __name__ == "__main__":
    sys.exit(main())
