/**
 * AI Static Responses - Fallback data when Gemini API is unavailable
 * Used in Limited Mode when user hits quota limits (429 errors)
 */

export interface StaticResponse {
  title: string;
  icon: string;
  keywords: string[];
  response: string;
}

export const STATIC_RESPONSES: StaticResponse[] = [
  {
    title: 'About CuongHoang',
    icon: '👤',
    keywords: ['about', 'giới thiệu', 'ban la ai', 'who are you', 'hoang', 'cuonghoang', 'cuong', 'gioi thieu', 'intro'],
    response: `# 👋 Xin chào! Mình là **CuongHoangDev**

Mình là một **Full Stack Developer** với hơn **3+ năm kinh nghiệm** trong việc phát triển ứng dụng web hiện đại.

## 🎯 Mục tiêu
Xây dựng những sản phẩm chất lượng, giúp doanh nghiệp số hóa và tối ưu quy trình làm việc.

## 💼 Kinh nghiệm làm việc
- **Full Stack Development** với Java/Spring Boot, React/Next.js
- **AI Integration** - Tích hợp Gemini API, RAG Architecture
- **Database** - PostgreSQL, Redis, MongoDB
- **DevOps** - Docker, CI/CD, Linux Server

## 📍 Thông tin liên hệ
- 🌐 Website: [cuonghoang.dev](https://cuonghoang.dev)
- 💻 GitHub: [github.com/cuonghoangdev](https://github.com/cuonghoangdev)
- 📧 Email: cuongthaihnhe176322@gmail.com
- 📱 Phone: +84 399 360 938

---
*Bạn có thể hỏi thêm về kỹ năng, dự án, hoặc blog của mình!*`
  },
  {
    title: 'Skills & Tech',
    icon: '⚡',
    keywords: ['skill', 'ky nang', 'skills', 'technology', 'technologies', 'cong nghe', 'tech stack', 'languages', 'framework'],
    response: `# ⚡ Kỹ năng & Công nghệ

## 🎨 Frontend
| Công nghệ | Level |
|-----------|-------|
| **React** | Chuyên nghiệp |
| **Next.js** | Chuyên nghiệp |
| **TypeScript** | Chuyên nghiệp |
| **Tailwind CSS** | Chuyên nghiệp |
| **Framer Motion** | Trung bình - Khá |

## ⚙️ Backend
| Công nghệ | Level |
|-----------|-------|
| **Java** | Chuyên nghiệp |
| **Spring Boot** | Chuyên nghiệp |
| **Node.js** | Khá |
| **REST API** | Chuyên nghiệp |
| **GraphQL** | Trung bình |

## 🗄️ Database
| Công nghệ | Level |
|-----------|-------|
| **PostgreSQL** | Chuyên nghiệp |
| **Redis** | Khá |
| **MongoDB** | Trung bình |
| **pgvector** | Khá |

## 🤖 AI & Machine Learning
| Công nghệ | Level |
|-----------|-------|
| **Gemini API** | Khá |
| **RAG Architecture** | Khá |
| **Vector Databases** | Khá |
| **OpenAI API** | Trung bình |

## 🚀 DevOps & Tools
- **Docker** - Container hóa ứng dụng
- **GitHub Actions** - CI/CD Pipeline
- **Linux** - Quản lý server
- **Nginx** - Reverse Proxy

---
*Bạn muốn biết thêm về dự án nào sử dụng các công nghệ này?*`
  },
  {
    title: 'Projects Done',
    icon: '🚀',
    keywords: ['project', 'du an', 'projects', 'portfolio', 'work', 'cong trinh', 'san pham'],
    response: `# 🚀 Dự án đã hoàn thành

## 1. CuongHoangDev V2 (Portfolio)
**Công nghệ:** Next.js, TypeScript, Spring Boot, PostgreSQL, pgvector, Gemini AI

Một portfolio cá nhân tích hợp AI Chatbot với kiến trúc RAG (Retrieval Augmented Generation) để trả lời câu hỏi về kinh nghiệm, kỹ năng và dự án.

**Tính năng nổi bật:**
- AI Chatbot thông minh với ngữ cảnh
- Hệ thống E-commerce (Shop, Cart, Checkout)
- Academy - Học viện trực tuyến
- Blog với nội dung đa dạng
- Responsive Design

---

## 2. E-Commerce Platform
**Công nghệ:** Spring Boot, React, PostgreSQL, Redis, Docker

Nền tảng thương mại điện tử với đầy đủ tính năng:
- Quản lý sản phẩm, danh mục
- Giỏ hàng, Checkout
- Quản lý đơn hàng
- Hệ thống discount/voucher
- Dashboard Admin

---

## 3. Microservices Demo
**Công nghệ:** Spring Cloud, Docker, Kubernetes, API Gateway

Hệ thống demo kiến trúc Microservices:
- API Gateway
- Service Discovery (Eureka)
- Config Server
- Load Balancing
- Circuit Breaker

---

## 4. AI RAG Chatbot
**Công nghệ:** Spring Boot, PostgreSQL, pgvector, Gemini API, Next.js

Chatbot thông minh sử dụng RAG:
- Embedding và vector search
- Semantic search trong knowledge base
- Streaming responses
- Session management

---
*Bạn muốn xem chi tiết dự án nào hơn?*`
  },
  {
    title: 'Recent Blogs',
    icon: '📝',
    keywords: ['blog', 'bai viet', 'article', 'tutorials', 'huong dan', 'posts', 'writing'],
    response: `# 📝 Blog & Bài viết

## Các chủ đề chính:

### 1. Java & Spring Boot
- Xây dựng REST API với Spring Boot
- Spring Security - Authentication & Authorization
- Spring Data JPA - Tối ưu truy vấn
- Microservices với Spring Cloud

### 2. React & Next.js
- Next.js App Router - Hướng dẫn toàn diện
- Server Components vs Client Components
- State Management với Zustand
- Performance Optimization

### 3. AI Integration & RAG
- Tích hợp Gemini API vào ứng dụng
- Xây dựng RAG Architecture từ đầu
- Vector Search với pgvector
- Prompt Engineering best practices

### 4. DevOps & Docker
- Docker từ A-Z cho developer
- CI/CD với GitHub Actions
- Deploy lên VPS/Linux Server
- Nginx reverse proxy setup

### 5. Database & Performance
- PostgreSQL Performance Tuning
- Redis Caching Strategies
- Database Indexing Optimization

---

## 📚 Truy cập Blog
Website: **/blog** - Xem tất cả bài viết

---
*Bạn quan tâm đến chủ đề nào? Mình có thể chia sẻ thêm!*`
  },
  {
    title: 'Contact & Social',
    icon: '📧',
    keywords: ['contact', 'lien he', 'email', 'social', 'mang xa hoi', 'phone', 'zalo', 'facebook'],
    response: `# 📧 Liên hệ & Mạng xã hội

## Thông tin liên hệ

| Kênh | Thông tin |
|------|-----------|
| 📧 **Email** | cuongthaihnhe176322@gmail.com |
| 📱 **Phone** | +84 399 360 938 |
| 💬 **Zalo** | 0399360938 |
| 🌐 **Website** | cuonghoang.dev |

## Mạng xã hội

| Nền tảng | Link |
|----------|------|
| 💻 **GitHub** | github.com/cuonghoangdev |
| 💼 **LinkedIn** | linkedin.com/in/cuonghoangdev |
| 🐦 **Twitter** | @cuonghoangdev |

## 🕐 Thời gian phản hồi
- **Email:** Trong vòng 24 giờ
- **Zalo:** Nhanh nhất có thể
- **LinkedIn:** Trong giờ làm việc

## 💼 Dịch vụ nhận làm
- Web Development (Frontend/Backend)
- API Development & Integration
- AI/Chatbot Integration
- Database Design & Optimization
- DevOps Setup

---
*Liên hệ mình để trao đổi về dự án hoặc cơ hội hợp tác!*`
  },
  {
    title: 'Start a Project',
    icon: '💻',
    keywords: ['thue', 'hire', 'project', 'lam viec', 'cong viec', 'freelance', 'bao gia', 'quote'],
    response: `# 💻 Bắt đầu một dự án

## 🎯 Mình có thể giúp bạn

### Phát triển Web
- Website Doanh nghiệp
- E-commerce / Shop online
- Landing Page / Portfolio
- Dashboard Admin

### Backend & API
- REST API / GraphQL
- Microservices
- Authentication System
- Database Design

### AI Integration
- Chatbot thông minh
- RAG System
- AI-powered features
- Gemini/OpenAI integration

### DevOps
- Docker setup
- CI/CD Pipeline
- Server deployment
- Performance optimization

## 📋 Quy trình làm việc

1. **Tiếp nhận yêu cầu** - Nghe và hiểu ý tưởng của bạn
2. **Báo giá** - Đưa ra timeline và chi phí dự kiến
3. **Thiết kế** - UI/UX và System Architecture
4. **Phát triển** - Code và test theo từng milestone
5. **Bàn giao** - Deploy và hướng dẫn sử dụng

## 📞 Liên hệ ngay

- 📧 Email: cuongthaihnhe176322@gmail.com
- 📱 Phone: +84 399 360 938
- 💬 Zalo: 0399360938

---
*Share ý tưởng của bạn, mình sẽ phản hồi sớm nhất có thể!*`
  },
  {
    title: 'Courses & Learning',
    icon: '🎓',
    keywords: ['course', 'khoa hoc', 'hoc', 'learn', 'education', 'dao tao', 'academy', 'lessons'],
    response: `# 🎓 Học viện & Khóa học

## Các khóa học hiện có

### 1. Spring Boot Ultimate
**Level:** Từ căn bản đến nâng cao

**Nội dung:**
- Setup dự án Spring Boot
- REST API Development
- Spring Data JPA
- Spring Security
- Testing & Deployment

### 2. Next.js Complete Guide
**Level:** Trung bình - Nâng cao

**Nội dung:**
- App Router & Server Components
- TypeScript Integration
- State Management
- API Routes
- Deployment Strategies

### 3. AI & RAG from Scratch
**Level:** Nâng cao

**Nội dung:**
- RAG Architecture
- Vector Databases
- Gemini API Integration
- Embedding Strategies
- Production Deployment

### 4. DevOps Essentials
**Level:** Trung bình

**Nội dung:**
- Docker Fundamentals
- CI/CD with GitHub Actions
- Linux Server Management
- Nginx & Reverse Proxy

## 📚 Truy cập Academy
Website: **/academy** - Xem tất cả khóa học

## 💡 Học cách gì trước?

**Người mới bắt đầu:**
1. Spring Boot Ultimate
2. Next.js Complete Guide

**Muốn học AI:**
1. AI & RAG from Scratch (cần kiến thức backend trước)

---
*Bạn quan tâm đến khóa học nào?*`
  }
];

/**
 * Find a static response that matches the user's message
 */
export function findStaticResponse(userMessage: string): StaticResponse | null {
  const lowerMessage = userMessage.toLowerCase();
  
  // Score each response by number of keyword matches
  const scored = STATIC_RESPONSES.map(response => {
    const matches = response.keywords.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    ).length;
    return { response, score: matches };
  });

  // Return the response with highest score (at least 1 match)
  const best = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  return best?.response || null;
}

/**
 * Get default greeting response
 */
export function getDefaultGreeting(): string {
  return `# 👋 Chào bạn!

Mình là **Ai CuongMini** - trợ lý AI của CuongHoangDev.

**Lưu ý:** Hiện tại AI đang ở **Limited Mode** do API quota đã hết. Mình vẫn có thể trả lời các câu hỏi từ dữ liệu có sẵn.

## Bạn có thể hỏi về:

- 👤 **Giới thiệu** - Thông tin về CuongHoangDev
- ⚡ **Kỹ năng** - Các công nghệ sử dụng
- 🚀 **Dự án** - Các dự án đã hoàn thành
- 📝 **Blog** - Bài viết và hướng dẫn
- 📧 **Liên hệ** - Thông tin liên hệ
- 💻 **Thuê** - Bắt đầu một dự án
- 🎓 **Khóa học** - Các khóa học có sẵn

---
*Hoặc hỏi bất kỳ câu nào, mình sẽ cố gắng trả lời từ dữ liệu có sẵn!*`;
}

/**
 * Get fallback response for random questions
 */
export function getFallbackResponse(userMessage: string): string {
  return `## 🤔 Câu hỏi của bạn

**"${userMessage}"**

---

### 💡 Gợi ý

Hiện tại mình đang ở **Limited Mode** (API quota đã hết) nên có thể không trả lời được câu hỏi này một cách chi tiết.

### Bạn có thể:
1. **Thử hỏi lại sau** - Khi API được reset
2. **Hỏi về chủ đề có sẵn** - Xem các gợi ý bên dưới
3. **Liên hệ trực tiếp** - cuongthaihnhe176322@gmail.com

### 📚 Các chủ đề có sẵn:
- Giới thiệu CuongHoangDev
- Kỹ năng & Công nghệ
- Dự án đã hoàn thành
- Blog & Bài viết
- Liên hệ & Mạng xã hội

---
*Cảm ơn bạn đã thông cảm!*`;
}
