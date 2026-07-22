# CuongThai.com - Full-Stack Project Documentation

> **Project:** CuongHoangDev API v2.0.0 - Một nền tảng toàn diện kết hợp mạng xã hội, học tập, thương mại điện tử, âm nhạc, tin nhắn, tài chính cá nhân và AI chatbot.

---

## MỤC LỤC

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Backend - Node.js/Express/TypeScript](#2-backend---nodejsexpresstypescript)
3. [Frontend - Next.js/React/TypeScript](#3-frontend---nextjsreacttypescript)
4. [Database - PostgreSQL/Prisma](#4-database---postgresqlprisma)
5. [Lưu Trữ - Cloudflare R2](#5-lưu-trữ---cloudflare-r2)
6. [VPS & Deployment](#6-vps--deployment)
7. [Các Công Nghệ Sử Dụng](#7-các-công-nghệ-sử-dụng)
8. [Số Liệu Thống Kê Code](#8-số-liệu-thống-kê-code)
9. [Lộ Trình Học Tập Cho Người Mới Bắt Đầu](#9-lộ-trình-học-tập-cho-người-mới-bắt-đầu)

---

## 1. Tổng Quan Dự Án

### Thông Tin Cơ Bản
| Thông tin | Chi tiết |
|-----------|----------|
| **Tên Project** | CuongHoangDev / cuongthai.com |
| **Phiên bản** | v2.0.0 |
| **Ngôn ngữ chính** | TypeScript (100%) |
| **Tổng dòng code** | ~204,000 lines |
| **Tổng số file** | ~713 files |
| **Số lượng người dùng** | (Tuỳ vào server) |
| **Trạng thái** | Production |

### Các Module Chính

```
cuongthai.com
├── 🏠 Trang Chủ / Social Feed      (Mạng xã hội)
├── 📚 Khóa Học (LMS)               (Học tập)
├── 🎵 Nghe Nhạc                     (Spotify Clone)
├── 🛒 Cửa Hàng                      (E-Commerce)
├── 💬 Tin Nhắn                      (Messenger)
├── 📝 Ghi Chú                       (Notion Clone)
├── 💰 Tài Chính                     (MoneyFlow)
├── 🤖 AI Chatbot                    (RAG Chatbot)
├── 🎮 Trò Chơi                     (Mini-games)
├── 📖 Blog                         (Blog cá nhân)
├── 💻 Code Snippets                (EXP Hub)
├── 🌐 Tech Trends                  (Tin công nghệ)
├── 📦 File Hub                     (Bookmark Manager)
├── 📖 Trang Cá Nhân                (Portfolio)
└── 🎬 Content Creator Studio       (Quản lý nội dung)
```

### Kiến Trúc Hệ Thống

```
                    ┌─────────────────────────────────────────┐
                    │              Nginx (Reverse Proxy)       │
                    │     Port 80/443 - SSL Termination       │
                    └─────────────────┬───────────────────────┘
                                      │
                    ┌─────────────────┴───────────────────────┐
                    │                                         │
           ┌────────▼────────┐                     ┌──────────▼─────────┐
           │   Frontend      │                     │    Backend         │
           │   Next.js       │                     │    Express.js      │
           │   Port 3000     │                     │    Port 3001       │
           │                 │                     │                    │
           └────────┬────────┘                     └──────────┬─────────┘
                    │                                         │
                    │  /api/v1/* (Proxy)                      │
                    └─────────────────┬───────────────────────┘
                                      │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
  ┌──────▼──────┐              ┌───────▼───────┐              ┌──────▼──────┐
  │ PostgreSQL  │              │    Redis      │              │  Cloudflare │
  │  Database   │              │    Cache      │              │     R2      │
  │  Port 5432 │              │  Port 6379    │              │   Storage   │
  └─────────────┘              └───────────────┘              └─────────────┘
```

---

## 2. Backend - Node.js/Express/TypeScript

### Thông Tin Chung

| Thông số | Giá trị |
|----------|---------|
| **Framework** | Express.js 4.21.0 |
| **Ngôn ngữ** | TypeScript 5.6.3 |
| **Runtime** | Node.js 22.x |
| **Module System** | ESM |
| **Số dòng code** | ~48,813 lines |
| **Số file** | 131 files |
| **Số endpoint** | 613 endpoints |
| **Số route file** | 51 files |

### Cấu Trúc Thư Mục Backend

```
src/
├── config/                    # Cấu hình ứng dụng
│   ├── env.ts                # Biến môi trường (Zod validation)
│   ├── database.ts           # Prisma client
│   ├── redis.ts              # Redis connection
│   └── r2.ts                 # Cloudflare R2 client
│
├── middleware/                # Middleware Express
│   ├── auth.middleware.ts    # Xác thực JWT
│   ├── rate-limit.ts         # Rate limiting
│   ├── captcha.ts            # Cloudflare Turnstile
│   ├── error.middleware.ts   # Xử lý lỗi
│   └── validation.middleware.ts
│
├── routes/                   # API Routes (51 files)
│   ├── auth.routes.ts        # Đăng nhập/đăng ký/OAuth
│   ├── social.routes.ts      # Feed, posts, comments
│   ├── music.routes.ts       # Nghe nhạc, playlists
│   ├── payment.routes.ts     # VNPay, Shop orders
│   ├── course.routes.ts      # Khóa học, enrollment
│   ├── admin.routes.ts       # Panel admin
│   ├── ai.routes.ts          # AI chatbot, RAG
│   ├── finance.routes.ts     # Tài chính cá nhân
│   ├── notes.routes.ts       # Ghi chú
│   ├── hub.routes.ts         # Bookmark manager
│   ├── messages.routes.ts    # Tin nhắn
│   ├── snippets.routes.ts    # Code snippets
│   └── [40+ route files khác]
│
├── services/                 # Business Logic (60+ files)
│   ├── auth.service.ts       # Auth logic
│   ├── email.service.ts      # Gửi email (Resend)
│   ├── social.service.ts     # Social feed
│   ├── music.service.ts      # Music streaming
│   ├── finance/              # Tài chính
│   │   ├── wallet.service.ts
│   │   ├── expense.service.ts
│   │   ├── income.service.ts
│   │   ├── debt.service.ts
│   │   ├── savings.service.ts
│   │   ├── investment.service.ts
│   │   └── reports.service.ts
│   └── [50+ service files]
│
├── socket/                   # Real-time (Socket.IO)
│   ├── messaging.socket.ts   # Chat thời gian thực
│   └── listen-together.ts    # Listen together feature
│
├── storage/                  # File Storage
│   ├── storage-provider.ts   # Interface
│   ├── r2-storage.ts         # R2 implementation
│   ├── local-storage.ts      # Local fallback
│   └── image-optimize.ts     # Sharp image processing
│
├── types/                    # TypeScript types
├── utils/                    # Utilities
│   ├── logger.ts             # Logging
│   └── helpers.ts
│
└── index.ts                  # Entry point
```

### Các Package Quan Trọng

| Package | Version | Mục đích |
|---------|---------|----------|
| **express** | 4.21.0 | Web framework |
| **socket.io** | 4.8.3 | Real-time communication |
| **prisma** | 5.22.0 | ORM |
| **jsonwebtoken** | 9.0.2 | JWT authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **zod** | 3.23.8 | Schema validation |
| **openai** | 4.77.0 | AI integration |
| **@aws-sdk/client-s3** | 3.1071.0 | Cloudflare R2 |
| **sharp** | 0.35.1 | Image optimization |
| **resend** | 6.12.4 | Email service |
| **@sentry/node** | 7.120.4 | Error tracking |
| **helmet** | 8.0.0 | Security headers |
| **express-rate-limit** | 7.4.1 | Rate limiting |
| **fluent-ffmpeg** | 2.1.3 | Audio processing |
| **node-cron** | 3.0.3 | Scheduled jobs |
| **playwright** | 1.61.0 | E2E testing |

---

## 3. Frontend - Next.js/React/TypeScript

### Thông Tin Chung

| Thông số | Giá trị |
|----------|---------|
| **Framework** | Next.js 14 (App Router) |
| **Ngôn ngữ** | TypeScript 5.6.3 |
| **UI Library** | React 18.3.1 |
| **Styling** | Tailwind CSS |
| **Số dòng code** | ~154,910 lines |
| **Số file** | 582 files |
| **Số pages** | 115 pages |
| **Số components** | 265 components |

### Cấu Trúc Thư Mục Frontend

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth routes (login, register)
│   │   ├── about/                # About page
│   │   ├── admin/                # Admin panel (31 sub-sections)
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── posts/
│   │   │   ├── shop/
│   │   │   ├── music/
│   │   │   ├── stats/
│   │   │   ├── ai-analytics/
│   │   │   └── [25+ more]
│   │   ├── blog/                 # Blog pages
│   │   ├── cart/                 # Shopping cart
│   │   ├── chat/                 # AI chatbot
│   │   ├── courses/              # Course listing
│   │   ├── dashboard/            # User dashboard
│   │   ├── exp-hub/              # Code snippets hub
│   │   ├── feed/                 # Social feed
│   │   │   └── video/            # Video feed (TikTok-style)
│   │   ├── finance/              # MoneyFlow tracker
│   │   ├── friends/              # Friends management
│   │   ├── games/                # Mini-games
│   │   ├── hub/                  # File bookmark hub
│   │   ├── messages/             # Messenger
│   │   ├── music/                # Music player
│   │   │   └── now-playing/
│   │   ├── my-courses/           # Enrolled courses
│   │   ├── notes/                # Notion-style notes
│   │   ├── profile/              # User profiles
│   │   ├── projects/              # Portfolio
│   │   ├── shop/                 # E-commerce
│   │   ├── academy/               # Academy
│   │   ├── checkout/
│   │   ├── settings/
│   │   ├── certificates/
│   │   └── api/                  # API routes (proxies)
│   │
│   ├── components/               # React Components (35 directories)
│   │   ├── ui/                   # Base UI components
│   │   ├── layout/               # Navbar, Dock, Layout
│   │   ├── social/               # Social feed components
│   │   ├── music/                # Music player
│   │   ├── chat/                 # AI chat
│   │   ├── messaging/            # Messenger
│   │   ├── notes/                # Note editor
│   │   ├── academy/              # Course components
│   │   ├── shop/                 # E-commerce
│   │   ├── finance/              # Finance charts
│   │   ├── games/               # Mini-games
│   │   ├── admin/               # Admin UI
│   │   ├── blog/                # Blog components
│   │   ├── projects/            # Portfolio
│   │   ├── hub/                 # File hub
│   │   ├── profile/             # Profile components
│   │   ├── cyber/               # Cyber/terminal theme
│   │   ├── studio/              # Content creator
│   │   └── [more...]
│   │
│   ├── lib/                     # Utilities
│   │   ├── api.ts               # Axios API client
│   │   ├── auth.ts              # NextAuth config
│   │   ├── socket.ts            # Socket.IO client
│   │   └── utils.ts             # Helpers
│   │
│   ├── store/                   # Zustand stores (18 stores)
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── chatStore.ts
│   │   ├── musicStore.ts
│   │   ├── socialStore.ts
│   │   ├── messagingStore.ts
│   │   └── [12 more stores]
│   │
│   ├── hooks/                   # Custom hooks (18 hooks)
│   │   ├── useAuth.ts
│   │   ├── useMusicQueries.ts
│   │   ├── useSocialQueries.ts
│   │   └── [15 more hooks]
│   │
│   ├── types/                   # TypeScript definitions
│   ├── context/                 # React Context
│   ├── config/                  # Config files
│   └── styles/                  # CSS
│
├── public/                      # Static assets
├── i18n/                        # i18n setup
├── messages/                    # Translation files
├── tailwind.config.ts          # Tailwind config
└── package.json
```

### Frontend Packages Chính

| Package | Version | Mục đích |
|---------|---------|----------|
| **next** | 14.2.15 | React framework |
| **react** | 18.3.1 | UI library |
| **tailwindcss** | 3.4.14 | Styling |
| **zustand** | 4.5.5 | State management |
| **@tanstack/react-query** | 5.101.0 | Server state |
| **next-auth** | 5.0.0-beta | Authentication |
| **framer-motion** | 11.9.0 | Animations |
| **@tiptap** | 2.27.2 | Rich text editor |
| **react-markdown** | 9.1.0 | Markdown rendering |
| **recharts** | 2.15.4 | Charts |
| **socket.io-client** | 4.8.3 | Real-time client |
| **react-hook-form** | 7.53.0 | Form handling |
| **zod** | 3.23.8 | Validation |
| **react-player** | 3.4.0 | Video player |
| **@dnd-kit** | 6.3.1 | Drag & drop |
| **lucide-react** | 0.453.0 | Icons |
| **shiki** | 4.2.0 | Syntax highlighting |
| **mermaid** | 11.16.0 | Diagrams |
| **@monaco-editor/react** | 4.7.0 | Code editor |
| **@sentry/nextjs** | 7.120.4 | Error tracking |
| **next-intl** | 4.13.0 | i18n |

### State Management

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend State                        │
├─────────────────────────────────────────────────────────┤
│  Zustand Stores (18)   │  TanStack Query               │
│  ─────────────────     │  ─────────────────            │
│  • authStore           │  • API caching                 │
│  • cartStore           │  • Background refetch          │
│  • chatStore           │  • Optimistic updates          │
│  • musicStore          │                               │
│  • socialStore         │  React Context                 │
│  • messagingStore      │  ─────────────────            │
│  • notificationStore   │  • ThemeContext                │
│  • playlistStore       │  • LocaleContext               │
│  • preferencesStore   │  • AuthProvider               │
│  • projectStore        │                               │
│  • [8 more...]         │                               │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Database - PostgreSQL/Prisma

### Thông Tin Database

| Thông số | Giá trị |
|----------|---------|
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma 5.22.0 |
| **Extensions** | pgvector (AI embeddings), pg_trgm |
| **Số Models** | 172 models |
| **Số Enums** | 16 enums |
| **Tổng** | 188 models + enums |

### Các Module Database

#### 1. Users & Authentication (8 models)
- `User` - Người dùng chính
- `Role` - Vai trò (admin, user)
- `UserRole` - Liên kết user-role
- `PasswordResetToken` - Token reset password
- `EmailVerificationToken` - Token xác thực email
- `UserProfile` - Hồ sơ mở rộng
- `Follow` - Theo dõi
- `Friendship` - Kết bạn

#### 2. Blog Module (6 models)
- `Post` - Bài viết blog
- `Category` - Danh mục
- `Tag` - Thẻ
- `PostTag` - Liên kết post-tag
- `Comment` - Bình luận

#### 3. Course/LMS Module (14 models)
- `Course` - Khóa học
- `CourseCategory` - Danh mục khóa học
- `Semester` - Học kỳ
- `CourseSection` - Phần trong khóa học
- `Lesson` - Bài học
- `LessonDetail` - Chi tiết bài học
- `CourseDocument` - Tài liệu
- `Enrollment` - Ghi danh
- `CourseCode` - Mã khóa học
- `LessonProgress` - Tiến độ học
- `Assignment` - Bài tập
- `AssignmentSubmission` - Nộp bài
- `Certificate` - Chứng chỉ
- `CourseReview` - Đánh giá

#### 4. E-Commerce Module (6 models)
- `Product` - Sản phẩm
- `ProductCategory` - Danh mục sản phẩm
- `ShopOrder` - Đơn hàng
- `ShopOrderItem` - Item trong đơn
- `DiscountCode` - Mã giảm giá
- `CourseOrder` - Đơn khóa học

#### 5. Music Module (10 models)
- `MusicTrack` - Bài hát
- `MusicPlaylist` - Playlist
- `MusicPlaylistTrack` - Bài trong playlist
- `MusicHistory` - Lịch sử nghe
- `MusicQueueItem` - Hàng đợi
- `MusicLike` - Thích bài hát
- `MusicPlayCount` - Số lượt nghe
- `MusicLyrics` - Lời bài hát (karaoke)
- `Song` - Pool bài hát cho posts
- `PostMusic` - Bài hát trong posts

#### 6. Social Feed Module (12 models)
- `SocialPost` - Post feed
- `SocialMedia` - Media đính kèm
- `SocialLike` - Thích (multi-emoji)
- `SocialComment` - Bình luận
- `SocialSave` - Lưu post
- `SocialShare` - Chia sẻ
- `SocialNotification` - Thông báo
- `SocialPoll` - Khảo sát
- `SocialPollOption` - Tuỳ chọn poll
- `SocialPollVote` - Vote poll
- `SocialLink` - Links cá nhân
- `FeedCollection` - Bộ sưu tập đã lưu

#### 7. Stories Module (4 models)
- `Story` - Story 24h
- `StoryView` - Người xem
- `StoryHighlight` - Highlight
- `StoryHide` - Ẩn story

#### 8. Messaging Module (10 models)
- `MessageThread` - Cuộc trò chuyện
- `Message` - Tin nhắn
- `MessageRead` - Đã đọc
- `MessageReaction` - Reaction
- `MessageAttachment` - File đính kèm
- `MessagePostShare` - Chia sẻ post
- `ThreadNickname` - Biệt danh
- `UserBlock` - Chặn user
- `ThreadReport` - Báo cáo

#### 9. Hub (Bookmark Manager) (4 models)
- `HubFolder` - Thư mục
- `HubLink` - Link đã lưu
- `HubFile` - File
- `HubShare` - Chia sẻ folder

#### 10. Notes Module (8 models)
- `NoteSubject` - Môn học
- `NoteChapter` - Chương
- `Note` - Ghi chú (TipTap JSON)
- `NoteAttachment` - File đính kèm
- `NoteLink` - Link ngoài
- `NoteVocabEntry` - Từ vựng
- `NoteSubjectShare` - Chia sẻ
- `NoteSubjectShareRecipient` - Người nhận

#### 11. Code Snippets (EXP Hub) (10 models)
- `SnippetCategory` - Thư mục
- `Snippet` - Code snippet
- `SnippetTag` - Tags
- `SnippetVersion` - Version history
- `SnippetVariable` - Variables
- `SnippetComment` - Bình luận
- `SnippetUpvote` - Upvote
- `SnippetBookmark` - Bookmark

#### 12. Language Learning (My Language) (13 models)
- `Language` - Ngôn ngữ
- `LangAlphabetGroup` - Bảng chữ cái
- `LangAlphabetItem` - Ký tự
- `LangVocabCategory` - Danh mục từ
- `LangVocabWord` - Từ vựng
- `LangVocabPronunciation` - Phát âm
- `LangGrammarPoint` - Ngữ pháp
- `LangListeningItem` - Bài nghe
- `LangConversationItem` - Hội thoại
- `LangReadingArticle` - Bài đọc
- `LangUserProgress` - Tiến độ (SRS)
- `LangQuizResult` - Kết quả quiz
- `LangVocabFavorite` - Từ yêu thích

#### 13. Personal Finance (MoneyFlow) (16 models)
- `Wallet` - Ví (tiền mặt, ngân hàng, ví điện tử)
- `WalletAdjustment` - Điều chỉnh số dư
- `IncomeSource` - Nguồn thu
- `WorkLog` - Giờ làm việc
- `IncomeEntry` - Thu nhập
- `Debt` - Nợ
- `DebtPayment` - Thanh toán nợ
- `DebtScheduleItem` - Lịch trả nợ
- `ExpenseCategory` - Loại chi tiêu
- `Expense` - Chi tiêu
- `RecurringTransaction` - Giao dịch định kỳ
- `SavingsGoal` - Mục tiêu tiết kiệm
- `SavingsContribution` - Đóng góp tiết kiệm
- `Investment` - Đầu tư
- `InvestmentTransaction` - Giao dịch đầu tư
- `TagRule` - Quy tắc tự động phân loại

#### 14. AI Chatbot Module (7 models)
- `ChatSession` - Phiên chat
- `ChatMessage` - Tin nhắn
- `ChatFeedback` - Phản hồi
- `ChatAnalytics` - Analytics
- `AiConfig` - Cấu hình AI
- `AiPrompt` - Prompt templates
- `DocumentChunk` - RAG chunks (vector)

#### 15. Gamification (Cyber) (3 models)
- `CyberProfile` - Hồ sơ gamification
- `CyberTask` - Nhiệm vụ
- `CyberInventory` - Inventory

#### 16. Content Creator Studio (7 models)
- `ContentProject` - Dự án video
- `ProductionDay` - Ngày quay
- `Scene` - Cảnh quay
- `AffiliateProduct` - Sản phẩm affiliate
- `PlatformPost` - Post theo platform
- `ChecklistItem` - Checklist
- `ContentIdea` - Ý tưởng

#### 17. Khác (Misc) (10 models)
- `Skill` - Kỹ năng
- `Project` - Dự án portfolio
- `GithubRepo` - GitHub repos
- `TechTrendArticle` - Bài viết tech
- `StickerPack` - Gói sticker
- `Sticker` - Sticker
- `ContactSubmission` - Form liên hệ
- `Announcement` - Thông báo
- `PaymentTransaction` - Giao dịch thanh toán
- `FileAttachment` - File đính kèm

### Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PostgreSQL                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Users   │  │  Roles   │  │ Sessions │  │  OAuth   │        │
│  └────┬─────┘  └────┬─────┘  └──────────┘  └──────────┘        │
│       │             │                                              │
│  ┌────┴─────────────┴────┐                                       │
│  │    Content Tables     │                                       │
│  │  Blog, Courses, Shop  │                                       │
│  └──────────┬────────────┘                                       │
│             │                                                   │
│  ┌──────────┴────────────┐                                       │
│  │   Social Tables       │                                       │
│  │  Posts, Comments,     │                                       │
│  │  Messages, Stories    │                                       │
│  └──────────┬────────────┘                                       │
│             │                                                   │
│  ┌──────────┴────────────┐                                       │
│  │   Feature Tables     │                                       │
│  │  Music, Notes, Hub,  │                                       │
│  │  Finance, Snippets   │                                       │
│  └──────────┬────────────┘                                       │
│             │                                                   │
│  ┌──────────┴────────────┐                                       │
│  │   AI & Media Tables  │                                       │
│  │  Chat, RAG, Files    │  ◄── pgvector extension              │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Lưu Trữ - Cloudflare R2

### Thông Tin R2

| Thông số | Giá trị |
|----------|---------|
| **Provider** | Cloudflare R2 (S3-compatible) |
| **Bucket** | `cuongthai-media-storage` |
| **Public URL** | `https://media.cuongthai.com` |
| **SDK** | AWS SDK v3 |

### Cấu Trúc Lưu Trữ

```
R2 Bucket: cuongthai-media-storage
├── /avatars/              # Avatar users
├── /posts/                # Social post images
├── /stories/              # Story images
├── /music/                # Audio files
├── /documents/            # Course documents
├── /products/             # Shop product images
├── /notes/                # Note attachments
├── /hub/                  # Hub file attachments
├── /snippets/             # Code snippet files
├── /profiles/             # Profile banners
└── /temp/                 # Temporary uploads
```

### Giới Hạn Upload

| Loại File | Kích thước tối đa |
|-----------|------------------|
| Images | 10 MB |
| Audio | 100 MB |
| Video | 500 MB |
| Documents | 70 MB |

---

## 6. VPS & Deployment

### Thông Tin VPS

| Thông số | Giá trị |
|----------|---------|
| **Server** | Single VPS |
| **RAM** | 6 GB |
| **vCPU** | 4 cores |
| **OS** | Ubuntu 24.04 |
| **IP** | `160.187.1.208` |
| **SSH** | Key-based authentication |

### Cấu Trúc VPS

```
/opt/cuonghoangdev/              # Data directory (SSD)
├── .env                         # Production secrets
├── postgres/                   # PostgreSQL data
├── redis/                      # Redis data
├── uploads/                    # User uploads
├── backups/                    # Database backups
├── scripts/
│   ├── backup-cron.sh          # Backup job
│   ├── monitor.sh              # Health check
│   └── ...
├── docker-compose.yml          # Compose file
└── frontend/

/home/deployer/repo/             # Code repository
```

### Docker Containers

| Container | Image | Memory | Port |
|-----------|-------|--------|------|
| postgres | postgis/postgis:16-3.4 | 2 GB | 5432 |
| redis | redis:7-alpine | 512 MB | 6379 |
| backend | Dockerfile.backend | 1 GB | 3001 |
| frontend | Dockerfile (Next.js) | 1.5 GB | 3000 |
| nginx | nginx:1.27-alpine | 256 MB | 80/443 |

### Domain Configuration

| Domain | Service |
|--------|---------|
| `cuongthai.com` | Frontend (Next.js) |
| `www.cuongthai.com` | Frontend (redirect) |
| `api.cuongthai.com` | Backend (Express) |
| `media.cuongthai.com` | R2 CDN |

### CI/CD Pipeline

```
Local (Developer)
       │
       │ git commit
       ▼
┌─────────────────┐
│  CI/CD Pipeline │
│  GitHub Actions │
└────────┬────────┘
         │
         ├──► Type Check (tsc)
         ├──► ESLint
         ├──► Unit Tests
         └──► Build
              │
              ├──► Build Docker images
              ├──► Push to GHCR
              └──► Deploy to VPS
                       │
                       ▼
              ┌────────────────┐
              │  Production    │
              │  VPS Server    │
              └────────────────┘
```

---

## 7. Các Công Nghệ Sử Dụng

### Backend Technologies

```
Backend Stack
├── Runtime
│   ├── Node.js 22.x
│   └── TypeScript 5.6.3
│
├── Web Framework
│   ├── Express.js 4.21.0
│   └── Socket.IO 4.8.3 (Real-time)
│
├── Database
│   ├── PostgreSQL 16
│   ├── Prisma 5.22.0 (ORM)
│   ├── pgvector (AI embeddings)
│   └── Redis 7 (Cache)
│
├── Authentication
│   ├── JWT (jsonwebtoken)
│   ├── bcryptjs (Password hashing)
│   ├── OAuth (Google, GitHub)
│   └── Cloudflare Turnstile (CAPTCHA)
│
├── AI/ML
│   ├── OpenAI 4.77.0
│   ├── Hugging Face Transformers
│   └── RAG (Retrieval Augmented Generation)
│
├── File Processing
│   ├── AWS SDK v3 (R2)
│   ├── Sharp (Image optimization)
│   ├── Multer (File upload)
│   └── FFmpeg (Audio processing)
│
├── Security
│   ├── Helmet (Security headers)
│   ├── Rate Limiting (express-rate-limit)
│   ├── Zod (Validation)
│   └── express-validator
│
├── Monitoring
│   ├── Sentry (Error tracking)
│   └── Morgan (HTTP logging)
│
└── Email
    └── Resend (Transactional email)
```

### Frontend Technologies

```
Frontend Stack
├── Framework
│   ├── Next.js 14 (App Router)
│   ├── React 18.3.1
│   └── TypeScript 5.6.3
│
├── Styling
│   ├── Tailwind CSS 3.4.14
│   ├── Framer Motion (Animations)
│   ├── CSS Variables (Theming)
│   └── PostCSS
│
├── State Management
│   ├── Zustand 4.5.5 (Client state)
│   ├── TanStack Query 5.101.0 (Server state)
│   └── React Context (Global state)
│
├── UI Components
│   ├── Lucide React (Icons)
│   ├── Sonner (Toasts)
│   ├── @dnd-kit (Drag & Drop)
│   └── Custom UI components
│
├── Rich Text & Markdown
│   ├── TipTap 2.27.2 (Editor)
│   ├── React Markdown
│   ├── Shiki (Syntax highlighting)
│   ├── Mermaid (Diagrams)
│   └── KaTeX (Math equations)
│
├── Forms
│   ├── React Hook Form 7.53.0
│   └── Zod (Validation)
│
├── Charts & Data
│   └── Recharts 2.15.4
│
├── Media
│   ├── React Player (Video/Audio)
│   ├── HTML2Canvas (Screenshots)
│   ├── jsPDF (PDF generation)
│   └── QRCode (QR codes)
│
├── Code Editor
│   └── Monaco Editor (VS Code)
│
├── i18n
│   └── next-intl 4.13.0
│
├── Real-time
│   └── Socket.IO Client 4.8.3
│
└── Error Tracking
    └── Sentry Next.js SDK
```

### DevOps & Infrastructure

```
DevOps Stack
├── Containers
│   ├── Docker
│   ├── Docker Compose
│   └── Multi-stage builds
│
├── CI/CD
│   ├── GitHub Actions
│   ├── GHCR (Container Registry)
│   └── rsync (Deployment)
│
├── Reverse Proxy
│   └── Nginx 1.27
│       ├── SSL/TLS (Let's Encrypt)
│       ├── Gzip compression
│       ├── Rate limiting
│       └── Security headers
│
├── Cloud Services
│   ├── Cloudflare R2 (Storage)
│   ├── Cloudflare Turnstile (CAPTCHA)
│   └── VNPay (Payment Gateway)
│
├── Monitoring
│   ├── Sentry (APM)
│   ├── Custom health checks
│   └── Cron monitoring
│
└── Backup
    ├── Daily PostgreSQL dumps
    └── Off-site R2 backup
```

---

## 8. Số Liệu Thống Kê Code

### Tổng Quan

| Metric | Số lượng |
|--------|----------|
| **Tổng dòng code** | ~204,000 lines |
| **Backend (src/)** | ~48,813 lines |
| **Frontend (frontend/src/)** | ~154,910 lines |
| **Tổng số file** | ~713 files |
| **Backend files** | 131 files |
| **Frontend files** | 582 files |
| **API Endpoints** | 613 endpoints |
| **Route files** | 51 files |
| **Database models** | 172 models |
| **Enums** | 16 enums |
| **Pages** | 115 pages |
| **Components** | 265 components |
| **Zustand stores** | 18 stores |
| **Custom hooks** | 18 hooks |

### Chi Tiết Theo Module

#### Backend Modules

| Module | Route File | Endpoint Count |
|--------|------------|----------------|
| Social Feed | social.routes.ts | ~80 |
| Music | music.routes.ts | ~75 |
| Payment | payment.routes.ts | ~40 |
| Admin | admin.routes.ts | ~100+ |
| Course/LMS | course.routes.ts | ~60 |
| Auth | auth.routes.ts | ~25 |
| Messages | messages.routes.ts | ~50 |
| AI Chatbot | ai.routes.ts | ~20 |
| Finance | finance.routes.ts | ~60 |
| Notes | notes.routes.ts | ~40 |
| Blog | blog.routes.ts | ~30 |
| Shop | shop.routes.ts | ~40 |

#### Frontend Pages

| Category | Page Count |
|----------|------------|
| Auth | 5 |
| Social | 10 |
| Learning | 15 |
| Commerce | 10 |
| Media | 8 |
| Admin | 31 |
| Utility | 36 |

---

## 9. Lộ Trình Học Tập Cho Người Mới Bắt Đầu

### Giai Đoạn 1: Nền Tảng Cơ Bản (3-4 tháng)

#### Tháng 1: HTML, CSS, JavaScript Cơ Bản

```
Tuần 1-2: HTML Fundamentals
├── Cấu trúc HTML
├── Semantic HTML tags
├── Forms và input elements
├── Tables và lists
└── Links và images

Tuần 3: CSS Fundamentals
├── CSS selectors và specificity
├── Box model
├── Flexbox layout
├── Grid layout
└── Responsive design (media queries)

Tuần 4: JavaScript Basics
├── Variables và data types
├── Operators và expressions
├── Control flow (if/else, loops)
├── Functions
└── Basic DOM manipulation
```

**Bài tập thực hành:**
- Tạo một trang web portfolio đơn giản
- Landing page cho sản phẩm
- Clone một trang login đơn giản

#### Tháng 2: JavaScript Nâng Cao

```
Tuần 1-2: Advanced JavaScript
├── ES6+ features (arrow functions, destructuring, spread)
├── Async/Await và Promises
├── Fetch API và HTTP requests
├── Error handling
└── Modules (import/export)

Tuần 3: DOM Advanced
├── Event handling
├── Event delegation
├── Dynamic DOM manipulation
├── Local Storage
└── Client-side form validation

Tuần 4: Git & Command Line
├── Git basics (init, add, commit, push, pull)
├── Branching và merging
├── GitHub workflow
├── Terminal commands
└── VS Code setup
```

**Bài tập thực hành:**
- Todo App với local storage
- Weather App với API
- Movie search app

#### Tháng 3: React Fundamentals

```
Tuần 1: React Core Concepts
├── JSX syntax
├── Components (functional)
├── Props và state
├── Conditional rendering
└── Lists và keys

Tuần 2: React Hooks
├── useState
├── useEffect
├── useRef
├── useCallback
├── useMemo
└── Custom hooks

Tuần 3: React Ecosystem
├── React Router
├── Context API
├── State management basics
└── React Developer Tools

Tuần 4: Styling in React
├── CSS Modules
├── Styled Components
├── Tailwind CSS basics
└── CSS-in-JS patterns
```

**Bài tập thực hành:**
- Social media feed (Instagram-style)
- E-commerce product listing
- Blog with comments

#### Tháng 4: TypeScript & Next.js

```
Tuần 1-2: TypeScript
├── Type basics (string, number, boolean)
├── Arrays và objects
├── Interfaces và types
├── Generics
├── Union và intersection types
└── Type guards

Tuần 3: Next.js Fundamentals
├── App Router structure
├── Pages vs App Router
├── Server components
├── Client components
├── Layouts và templates
└── Navigation (Link, useRouter)

Tuần 4: Next.js Advanced
├── API routes
├── Server actions
├── Data fetching patterns
├── Middleware
├── Image optimization
└── Metadata và SEO
```

**Bài tập thực hành:**
- Blog app với Next.js
- Dashboard với charts
- E-commerce storefront

---

### Giai Đoạn 2: Backend Development (3-4 tháng)

#### Tháng 5: Node.js & Express

```
Tuần 1-2: Node.js Fundamentals
├── Node.js runtime
├── npm/yarn/pnpm
├── CommonJS vs ESM
├── File system operations
├── Events và streams
└── Building simple CLI tools

Tuần 3: Express.js Basics
├── Express setup và middleware
├── Routing
├── Request/Response objects
├── Query params và URL parameters
├── Body parsing
└── Error handling

Tuần 4: Express Advanced
├── Custom middleware
├── Authentication middleware
├── Validation middleware
├── Logging middleware
├── Rate limiting
└── CORS configuration
```

**Bài tập thực hành:**
- REST API cho Blog
- User authentication system
- File upload service

#### Tháng 6: Database (PostgreSQL)

```
Tuần 1-2: SQL Fundamentals
├── Database concepts
├── PostgreSQL setup
├── SELECT, WHERE, ORDER BY
├── JOINs (INNER, LEFT, RIGHT, FULL)
├── GROUP BY và aggregates
└── Subqueries

Tuần 3: Database Design
├── Normalization (1NF, 2NF, 3NF)
├── Primary keys và foreign keys
├── Indexes
├── Constraints
├── ERD design
└── Migration strategies

Tuần 4: Prisma ORM
├── Prisma setup
├── Schema definition
├── CRUD operations
├── Relations (one-to-many, many-to-many)
├── Query optimization
└── Prisma migrations
```

**Bài tập thực hành:**
- Database schema cho E-commerce
- Database schema cho Social Network
- Complex queries practice

#### Tháng 7: Authentication & Security

```
Tuần 1-2: Authentication
├── JWT (JSON Web Tokens)
├── Password hashing (bcrypt)
├── Login/Register flows
├── Session vs Token
├── OAuth basics (Google, GitHub)
└── Refresh tokens

Tuần 3: Security Best Practices
├── Input validation (Zod)
├── SQL injection prevention
├── XSS prevention
├── CSRF protection
├── Rate limiting
└── Security headers (Helmet)

Tuần 4: Advanced Auth
├── Email verification
├── Password reset flows
├── Two-factor authentication
├── Account lockout
├── Role-based access control
└── Permission systems
```

**Bài tập thực hành:**
- Full authentication system
- Role-based admin panel
- Social login integration

#### Tháng 8: Real-time & Advanced Topics

```
Tuần 1-2: Real-time Communication
├── WebSocket basics
├── Socket.IO setup
├── Event handling
├── Rooms và namespaces
├── Broadcasting
└── Real-time chat implementation

Tuần 3: File Upload & Storage
├── Multer for uploads
├── Cloud storage (AWS S3 / R2)
├── Signed URLs
├── Image processing (Sharp)
├── File type validation
└── Storage optimization

Tuần 4: Performance & Caching
├── Redis basics
├── Redis caching patterns
├── Query optimization
├── Database indexing
├── Connection pooling
└── Load balancing basics
```

**Bài tập thực hành:**
- Real-time chat application
- File sharing service
- Image processing pipeline

---

### Giai Đoạn 3: Hoàn Thiện Dự Án (2-3 tháng)

#### Tháng 9-10: Triển Khai & DevOps

```
Tuần 1-2: Docker & Containers
├── Docker fundamentals
├── Images và containers
├── Dockerfile basics
├── Docker Compose
├── Multi-container apps
└── Volume management

Tuần 3: Deployment
├── VPS setup
├── Nginx configuration
├── SSL/TLS (Let's Encrypt)
├── Environment variables
├── Process managers
└── Docker production deployment

Tuần 4: CI/CD & Monitoring
├── GitHub Actions basics
├── Automated testing
├── Build pipelines
├── Health checks
├── Logging
└── Error tracking (Sentry)
```

#### Tháng 11: AI Integration (Optional)

```
Tuần 1-2: AI Basics
├── OpenAI API
├── Prompt engineering
├── Chat completions
├── Function calling
└── Streaming responses

Tuần 3: RAG (Retrieval Augmented Generation)
├── Vector databases
├── Embeddings
├── Chunking strategies
├── Semantic search
└── Context injection

Tuần 4: AI in Production
├── AI caching
├── Rate limiting
├── Cost optimization
├── Fallback strategies
└── Monitoring AI usage
```

---

### Lộ Trình Học Chi Tiết Theo Module

#### 1. Social Feed Module

```
Để xây dựng module Social Feed trong dự án này, bạn cần học:

Bước 1: Database Design (1-2 tuần)
├── SocialPost model
├── SocialMedia model
├── SocialComment model
├── SocialLike model
├── Relations setup
└── Index optimization

Bước 2: Backend API (2-3 tuần)
├── POST /api/v1/social/posts
├── GET /api/v1/social/feed
├── POST /api/v1/social/posts/:id/like
├── POST /api/v1/social/posts/:id/comment
├── DELETE /api/v1/social/posts/:id
└── Pagination và filtering

Bước 3: Real-time Features (1-2 tuần)
├── Socket.IO connection
├── Live like updates
├── New post notifications
├── Typing indicators
└── Comment notifications

Bước 4: Frontend (3-4 tuần)
├── Feed page layout
├── Post card component
├── Post composer
├── Comment system
├── Like animation
├── Infinite scroll
├── Image upload
└── Poll creation

Bước 5: Features Nâng Cao (2-3 tuần)
├── Stories (24h expiry)
├── Share functionality
├── Save/bookmark
├── Poll voting
├── Multi-emoji reactions
└── User mentions
```

#### 2. Music Streaming Module

```
Để xây dựng module Music trong dự án này, bạn cần học:

Bước 1: Database Design (1 tuần)
├── MusicTrack model
├── MusicPlaylist model
├── MusicPlaylistTrack
├── MusicHistory
├── MusicLike
└── Audio file storage

Bước 2: Backend API (2-3 tuần)
├── GET /api/v1/music/tracks
├── POST /api/v1/music/playlists
├── PUT /api/v1/music/queue
├── GET /api/v1/music/stream/:id
├── POST /api/v1/music/likes
└── GET /api/v1/music/history

Bước 3: Audio Streaming (1-2 tuần)
├── Range request handling
├── Audio format support
├── Streaming optimization
├── CORS configuration
└── CDN caching

Bước 4: Frontend (3-4 tuần)
├── Music player component
├── Playlist management
├── Queue system
├── Search functionality
├── Mini player
├── Full player view
├── Lyrics display
└── Audio visualization

Bước 5: Features Nâng Cao (2 tuần)
├── Lyrics (karaoke format)
├── Listen Together (multi-user)
├── Audio fingerprinting
├── Recommendation system
└── Play statistics
```

#### 3. Course/LMS Module

```
Để xây dựng module Course trong dự án này, bạn cần học:

Bước 1: Database Design (2 tuần)
├── Course model
├── CourseSection
├── Lesson
├── Enrollment
├── LessonProgress
├── Assignment
├── Certificate
├── CourseReview
└── Relations

Bước 2: Backend API (3-4 tuần)
├── CRUD courses
├── Course sections/lessons
├── Enrollment system
├── Progress tracking
├── Assignment submission
├── Certificate generation
├── Course review system
├── Course codes
└── Analytics

Bước 3: Frontend (4-5 tuần)
├── Course catalog
├── Course detail page
├── Video player
├── Curriculum sidebar
├── Note-taking
├── Quiz interface
├── Progress bar
├── Certificate viewer
└── Review form

Bước 4: Payment Integration (2 tuần)
├── VNPay integration
├── Order management
├── Enrollment on payment
├── Refund handling
└── Invoice generation

Bước 5: Advanced Features (2-3 tuần)
├── Drag-drop curriculum editor
├── Bulk enrollment
├── Analytics dashboard
├── Email notifications
└── Course recommendations
```

#### 4. Personal Finance Module

```
Để xây dựng module Finance trong dự án này, bạn cần học:

Bước 1: Database Design (2 tuần)
├── Wallet (multi-account)
├── IncomeEntry
├── Expense
├── ExpenseCategory
├── Debt
├── SavingsGoal
├── Investment
├── RecurringTransaction
└── Auto-categorization rules

Bước 2: Backend API (3-4 tuần)
├── Wallet CRUD
├── Transaction management
├── Category management
├── Debt tracking
├── Savings goals
├── Investment portfolio
├── Recurring transactions
├── Reports generation
└── Currency conversion

Bước 3: Frontend (4-5 tuần)
├── Dashboard overview
├── Transaction list
├── Add transaction modal
├── Category management
├── Chart visualizations (Recharts)
├── Budget tracking
├── Debt payoff calculator
├── Savings tracker
└── Investment overview

Bước 4: Advanced Features (2-3 tuần)
├── Auto-categorization (AI)
├── Receipt scanning
├── Recurring setup
├── Goal projections
├── Debt payoff strategies
├── Investment calculators
├── Multi-currency support
└── Export reports (PDF/Excel)
```

#### 5. Notes Module

```
Để xây dựng module Notes trong dự án này, bạn cần học:

Bước 1: Database Design (1 tuần)
├── NoteSubject
├── NoteChapter
├── Note (TipTap JSON)
├── NoteAttachment
├── NoteLink
├── NoteVocabEntry
└── Note sharing

Bước 2: TipTap Editor (2-3 tuần)
├── TipTap setup
├── Basic formatting
├── Code blocks (Shiki)
├── Math equations (KaTeX)
├── Diagrams (Mermaid)
├── Tables
├── Image embedding
└── Custom extensions

Bước 3: Backend API (2 tuần)
├── Note CRUD
├── Chapter management
├── Subject management
├── Vocabulary management
├── Attachment handling
├── Sharing system
└── Search

Bước 4: Frontend (3-4 tuần)
├── Notion-like interface
├── Sidebar navigation
├── Rich text editor
├── Vocabulary table
├── Note sharing
├── Search functionality
├── Tags system
└── Export (PDF, Markdown)
```

---

### Tài Nguyên Học Tập

#### Sách Khuyến Nghị

**JavaScript/TypeScript:**
1. JavaScript: The Good Parts - Douglas Crockford
2. You Don't Know JS (Series) - Kyle Simpson
3. TypeScript Handbook - Official Documentation
4. Effective TypeScript - Dan Vanderkam

**React:**
1. React - Official Documentation
2. Epic React - Kent C. Dodds
3. Thinking in React - Pete Hunt

**Node.js:**
1. Node.js Design Patterns - Mario Casciaro
2. Building Microservices - Sam Newman

**Database:**
1. SQL and Relational Theory - C.J. Date
2. Database Design for Mere Mortals - Michael Hernandez

**DevOps:**
1. Docker Deep Dive - Nigel Poulton
2. The DevOps Handbook - Gene Kim et al.

#### Websites & Documentation

```
Learning Resources:
├── https://javascript.info (JavaScript)
├── https://react.dev (React)
├── https://nextjs.org/docs (Next.js)
├── https://expressjs.com (Express)
├── https://prisma.io/docs (Prisma)
├── https://socket.io/docs (Socket.IO)
├── https://tailwindcss.com (Tailwind)
├── https://tanstack.com/query (TanStack Query)
└── https://zod.dev (Zod validation)

YouTube Channels:
├── Traversy Media
├── Fireship
├── Web Dev Simplified
├── Ben Awad
├── Theo Browne
├── Jack Herrington
└── Fireship

Practice Platforms:
├── LeetCode
├── HackerRank
├── Frontend Mentor
├── Roadmap.sh
└── Exercism
```

#### Roadmap.sh - Suggested Path

```
Đây là roadmap chi tiết: https://roadmap.sh/

Frontend Roadmap:
1. Internet basics
2. HTML
3. CSS
4. JavaScript
5. Version Control (Git)
6. Web Security
7. React
8. State Management
9. TypeScript
10. Next.js
11. Testing
12. SSR/SSG
13. GraphQL
14. Mobile Apps (React Native)

Backend Roadmap:
1. Git
2. Language (Node.js)
3. Package Manager
4. TypeScript
5. Runtime (Node.js)
6. Express.js
7. Database (PostgreSQL)
8. ORM (Prisma)
9. Authentication
10. REST APIs
11. Real-time (WebSocket)
12. Caching (Redis)
13. Testing
14. CI/CD
15. Docker
16. Cloud Services
17. Message Queues
18. Microservices
```

---

### Cách Tiếp Cận Để Làm Dự Án Này

#### Bước 1: Setup Môi Trường (1 tuần)

```
1. Cài đặt công cụ:
   ├── Node.js 22.x
   ├── VS Code + Extensions
   ├── Git
   ├── Docker Desktop
   ├── PostgreSQL (local)
   ├── Redis (local)
   └── Postman/Insomnia

2. Clone và setup:
   ├── git clone <repo>
   ├── npm install (backend)
   ├── cd frontend && npm install
   ├── Setup .env
   ├── docker-compose up (database)
   ├── npx prisma db push
   └── npm run dev

3. Hiểu cấu trúc:
   ├── Đọc README.md
   ├── Đọc CLAUDE.md
   ├── Explore src/ structure
   ├── Explore frontend/src/ structure
   └── Run và test từng feature
```

#### Bước 2: Bắt Đầu Với Auth Module (2-3 tuần)

```
Mục tiêu: Hiểu cách authentication hoạt động

1. Học lý thuyết:
   ├── JWT là gì
   ├── Cookie vs LocalStorage
   ├── bcrypt password hashing
   ├── Refresh token rotation
   └── OAuth flow

2. Khám phá code:
   ├── src/middleware/auth.middleware.ts
   ├── src/services/auth.service.ts
   ├── src/routes/auth.routes.ts
   ├── frontend/src/lib/auth.ts
   └── frontend/src/store/authStore.ts

3. Thực hành:
   ├── Trace login flow
   ├── Thêm custom field vào User
   ├── Sửa validation logic
   └── Thêm rate limiting
```

#### Bước 3: Database & Prisma (2-3 tuần)

```
Mục tiêu: Hiểu cách data được tổ chức

1. Học Prisma:
   ├── Schema syntax
   ├── Relations
   ├── Queries
   ├── Migrations
   └── Best practices

2. Khám phá schema:
   ├── prisma/schema.prisma
   ├── Hiểu từng model
   ├── Hiểu relations
   └── Hiểu enums

3. Thực hành:
   ├── Tạo migration mới
   ├── Viết complex query
   ├── Optimize query với include
   └── Thêm index
```

#### Bước 4: Xây Dựng Module Đơn Giản (3-4 tuần)

```
Mục tiêu: Tự tạo một module nhỏ

Chọn 1 trong các module:
- Blog Posts
- Skills/Portfolio
- Contact Form
- Announcements

Thực hiện:
1. Thiết kế database model
2. Tạo Prisma migration
3. Viết service layer
4. Tạo API routes
5. Thêm frontend page
6. Test toàn bộ flow
```

#### Bước 5: Frontend Components (3-4 tuần)

```
Mục tiêu: Hiểu frontend architecture

1. Học từ code có sẵn:
   ├── Component structure
   ├── Zustand stores
   ├── TanStack Query usage
   ├── API integration
   └── Tailwind patterns

2. Thực hành:
   ├── Tạo component mới
   ├── Thêm state management
   ├── Tạo custom hook
   └── Refactor component
```

#### Bước 6: Real-time Features (2-3 tuần)

```
Mục tiêu: Hiểu Socket.IO implementation

1. Học lý thuyết:
   ├── WebSocket basics
   ├── Socket.IO events
   ├── Rooms và namespaces
   └── Broadcasting

2. Khám phá code:
   ├── src/socket/messaging.socket.ts
   ├── frontend/src/lib/socket.ts
   ├── frontend/src/store/messagingStore.ts
   └── frontend/src/components/messaging/

3. Thực hành:
   ├── Thêm typing indicator
   ├── Thêm online status
   └── Thêm read receipts
```

#### Bước 7: Deployment (2 tuần)

```
Mục tiêu: Deploy lên production

1. Học Docker:
   ├── Dockerfile basics
   ├── Docker Compose
   ├── Multi-stage builds
   └── Volume management

2. Học VPS:
   ├── SSH setup
   ├── Nginx configuration
   ├── SSL certificates
   └── Process management

3. Thực hành:
   ├── Local Docker setup
   ├── Simulate deployment
   ├── Setup monitoring
   └── Backup strategy
```

---

### Checklist Khi Hoàn Thành

```
Sau khi hoàn thành lộ trình học, bạn sẽ có thể:

□ Xây dựng REST API hoàn chỉnh với Express
□ Sử dụng Prisma ORM thành thạo
□ Implement authentication với JWT/OAuth
□ Xây dựng real-time features với Socket.IO
□ Tạo React components với TypeScript
□ Sử dụng Next.js App Router
□ Implement state management với Zustand
□ Query server state với TanStack Query
□ Styling với Tailwind CSS
□ Rich text editing với TipTap
□ Data visualization với Recharts
□ Deploy với Docker
□ Setup CI/CD với GitHub Actions
□ Monitor với Sentry
□ Configure Nginx
□ Setup CI/CD pipeline
□ Quản lý Cloudflare R2 storage

Và có thể đóng góp vào dự án này!
```

---

### Lời Khuyên Quan Trọng

```
1. Đừng cố nhớ tất cả - Hiểu concepts và biết cách tra cứu

2. Code mỗi ngày - Dù chỉ 30 phút cũng tốt

3. Xây dựng projects nhỏ - Đừng nhảy vào dự án lớn ngay

4. Đọc code của người khác - GitHub là kho kiến thức vô tận

5. Tham gia cộng đồng - Discord, Reddit, Stack Overflow

6. Ask questions - Nhưng search trước khi hỏi

7. Break things - Debugging là cách học tốt nhất

8. Document your learning - Viết blog hoặc notes

9. Don't compare yourself - Học theo tốc độ của bạn

10. Enjoy the process - Lập trình là marathon, không phải sprint
```

---

## Thông Tin Liên Hệ & Tài Nguyên

```
Project: CuongHoangDev / cuongthai.com
Version: v2.0.0
Location: /Users/admin/Downloads/api-backend

Documentation:
├── README.md - Project overview
├── CLAUDE.md - Claude AI instructions
├── SECURITY_PLAN.md - Security implementation
├── DEPLOY_CLEANUP.md - Deployment guide
└── [20+ other docs]

Quick Start:
1. npm install
2. cd frontend && npm install
3. docker-compose up -d
4. npx prisma db push
5. npm run dev (backend)
6. cd frontend && npm run dev (frontend)

Environment Setup:
├── Copy .env.example to .env
├── Fill in required secrets
├── Generate JWT secrets
├── Setup PostgreSQL
└── Setup Redis
```

---

> **Document created:** 2024
> **Author:** AI Assistant
> **Purpose:** Complete project documentation and learning roadmap
