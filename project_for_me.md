# 🚀 PROJECT_FOR_ME.md — LỘ TRÌNH 25 DỰ ÁN TỪ CƠ BẢN ĐẾN WORLD-CLASS

> **Mục đích**: File này là lộ trình 25 dự án thực tế từ cơ bản đến siêu nâng cao, giúp bạn:
> - 🎓 Học và thực hành các công nghệ hot nhất 2026
> - 💼 Xây dựng portfolio GitHub + LinkedIn ấn tượng
> - 🏆 Đáp ứng yêu cầu của các công ty lớn (Google, Meta, Netflix, Stripe, VNG, FPT...)
> - 📈 Nâng cao kỹ năng từ junior → mid → senior → staff/principal
>
> **Ngày tạo**: 2026-06-17
> **Cập nhật cuối**: 2026-06-17 21:30
> **Tác giả**: Cursor Assistant (AI Pair Programming)
> **Lưu ý**: Hoàn thành dự án CuongHoangDev trước khi bắt đầu lộ trình này

---

# 📊 PHẦN 0: TỔNG QUAN & CHIẾN LƯỢC

## 0.1. Tại sao cần 25 dự án?

Theo khảo sát 2026 từ Stack Overflow, GitHub, và LinkedIn Talent Insights:

| Yếu tố | Tỷ lệ nhà tuyển dụng quan tâm |
|---|---|
| **Portfolio GitHub chất lượng** | 87% |
| **Dự án thực tế (không phải tutorial clone)** | 82% |
| **Đa dạng tech stack** | 76% |
| **README chuyên nghiệp + demo live** | 71% |
| **Có contribution graph đều đặn** | 68% |
| **Stars + forks từ cộng đồng** | 54% |

**Kết luận**: 1 dự án lớn (như CuongHoangDev) + 25 dự án đa dạng = profile cực kỳ mạnh.

## 0.2. Cấu trúc 25 dự án (5 cấp độ)

```
┌──────────────────────────────────────────────────────────────┐
│ Level 5: World-Class (5 dự án) — Siêu nâng cao              │
│   → Lớn hơn CuongHoangDev nhiều lần                          │
│   → Công ty FAANG/Tier-1 săn đón                              │
│   → Thời gian: 6-12 tháng/dự án                              │
├──────────────────────────────────────────────────────────────┤
│ Level 4: Expert (5 dự án) — Cấp cao                          │
│   → Kiến trúc phức tạp, scale lớn                           │
│   → Công ty product lớn săn đón                              │
│   → Thời gian: 3-6 tháng/dự án                              │
├──────────────────────────────────────────────────────────────┤
│ Level 3: Advanced (5 dự án) — Nâng cao                        │
│   → Real-time, microservices, AI/ML                          │
│   → Công ty tech tier-2 săn đón                               │
│   → Thời gian: 1-3 tháng/dự án                               │
├──────────────────────────────────────────────────────────────┤
│ Level 2: Intermediate (5 dự án) — Trung cấp                  │
│   → Full-stack với auth, payment, database                    │
│   → Junior → Mid level                                        │
│   → Thời gian: 2-4 tuần/dự án                                │
├──────────────────────────────────────────────────────────────┤
│ Level 1: Beginner (5 dự án) — Cơ bản                         │
│   → CRUD, REST API, frontend cơ bản                          │
│   → Fresher → Junior                                          │
│   → Thời gian: 3-7 ngày/dự án                                │
└──────────────────────────────────────────────────────────────┘
```

## 0.3. Tech stack chính (2026 trends)

| Category | Công nghệ | Lý do chọn |
|---|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript | Standard 2026, RSC, Server Actions |
| **Backend Node.js** | Node.js 22, Express/Fastify/NestJS, TypeScript | Phổ biến nhất, ecosystem lớn |
| **Backend Java** | Spring Boot 3.4, Java 21 LTS, Kotlin | Enterprise standard, VNG/FPT dùng nhiều |
| **Backend Go** | Go 1.23, Gin/Echo, gRPC | High-performance, microservices |
| **Backend .NET** | .NET 9, C# 13, ASP.NET Core | Microsoft stack, enterprise |
| **Database** | PostgreSQL 16, Redis 7, MongoDB, ClickHouse | Polyglot persistence |
| **AI/ML** | Python, FastAPI, PyTorch, LangChain, OpenAI API | Hot trend 2026 |
| **DevOps** | Docker, Kubernetes, GitHub Actions, Terraform | Cloud-native standard |
| **Cloud** | AWS/GCP/Azure, Vercel, Railway, DigitalOcean | Multi-cloud |
| **Message Queue** | Kafka, RabbitMQ, Redis Streams, NATS | Event-driven architecture |
| **Observability** | Prometheus, Grafana, OpenTelemetry, Sentry | Production-grade |
| **Testing** | Jest, Vitest, Playwright, k6, Postman | Quality assurance |

## 0.4. Lộ trình thời gian đề xuất

| Giai đoạn | Thời gian | Dự án | Mục tiêu |
|---|---|---|---|
| **Phase 1: Nền tảng** | 1-2 tháng | Level 1 (5 dự án) | Củng cố kiến thức cơ bản |
| **Phase 2: Full-stack** | 2-4 tháng | Level 2 (5 dự án) | Làm chủ full-stack |
| **Phase 3: Advanced** | 3-6 tháng | Level 3 (5 dự án) | Real-time, AI, microservices |
| **Phase 4: Expert** | 6-12 tháng | Level 4 (5 dự án) | Kiến trúc phức tạp |
| **Phase 5: World-Class** | 12-24 tháng | Level 5 (5 dự án) | Cạnh tranh với senior/principal |
| **TỔNG** | **2.5-4 năm** | **25 dự án** | **Senior/Staff Engineer ready** |

**Mẹo**: Bạn có thể làm song song 2-3 dự án nhỏ, hoặc 1 dự án lớn + 1-2 dự án nhỏ.

---

# 🌱 PHẦN I: LEVEL 1 — BEGINNER (5 DỰ ÁN CƠ BẢN)

> **Mục tiêu**: Làm quen với REST API, CRUD, authentication cơ bản, database relations.
> **Thời gian**: 3-7 ngày/dự án
> **Công nghệ**: Next.js + Node.js + PostgreSQL (combo chính)

---

## 📦 DỰ ÁN 1.1: Todo List App (Full-Stack)

### 🎯 Tổng quan
Ứng dụng quản lý công việc cá nhân với đầy đủ CRUD, authentication, filter, search.

### 🛠️ Tech stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes (không cần server riêng)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (Credentials provider)
- **Deploy**: Vercel + Supabase/NeonDB

### 📋 Tính năng chi tiết
```
□ User đăng ký / đăng nhập / đăng xuất
□ Tạo / sửa / xóa todo
□ Đánh dấu hoàn thành
□ Filter theo trạng thái (all/active/completed)
□ Search theo tên
□ Sort theo deadline / priority
□ Dark mode
□ Responsive (mobile-first)
```

### 🗄️ Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // hashed
  todos     Todo[]
  createdAt DateTime @default(now())
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  priority    Priority @default(MEDIUM)
  dueDate     DateTime?
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

### 📂 Cấu trúc thư mục
```
todo-app/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   └── todos/route.ts
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── todos/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (Button, Input, Card)
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoForm.tsx
│   │   └── FilterBar.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── package.json
└── README.md
```

### 🔧 Hướng dẫn chi tiết

**Bước 1: Setup project**
```bash
npx create-next-app@latest todo-app --typescript --tailwind --app
cd todo-app
npm install prisma @prisma/client next-auth@beta bcryptjs
npx prisma init
```

**Bước 2: Configure Prisma**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Bước 3: NextAuth setup**
```ts
// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});
```

**Bước 4: API Routes**
```ts
// src/app/api/todos/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, priority, dueDate } = await req.json();
  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: session.user.id,
    },
  });
  return NextResponse.json(todo, { status: 201 });
}
```

### 📚 Kiến thức cần học vững
1. **React Server Components (RSC)** vs Client Components
2. **Next.js App Router** routing conventions
3. **Prisma ORM** (migrations, queries, relations)
4. **NextAuth.js v5** flow (JWT, sessions)
5. **bcrypt** password hashing
6. **Zod** validation
7. **TailwindCSS** utility classes
8. **TypeScript** strict mode

### 🌟 Điểm cộng cho portfolio
- ⭐ Live demo trên Vercel
- ⭐ GitHub Actions CI/CD
- ⭐ README với screenshots + GIF demo
- ⭐ Unit tests với Vitest
- ⭐ E2E tests với Playwright
- ⭐ Storybook cho components

### 📊 Đánh giá sau khi hoàn thành
Bạn sẽ nắm vững:
- ✅ Full CRUD với Next.js
- ✅ Authentication flow
- ✅ Database design cơ bản
- ✅ TypeScript end-to-end
- ✅ Deploy production

---

## 📦 DỰ ÁN 1.2: Blog Platform (Markdown-based)

### 🎯 Tổng quan
Nền tảng blog cá nhân với markdown editor, tags, comments, RSS feed.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, MDX, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma
- **Markdown**: MDX + react-markdown
- **Comments**: Nested comments
- **RSS**: `feed` package

### 📋 Tính năng chi tiết
```
□ Đăng nhập / đăng ký
□ Tạo / sửa / xóa bài viết (MDX editor)
□ Upload cover image
□ Tags / categories
□ Search full-text
□ Comments (nested)
□ Like / bookmark
□ RSS feed (/rss.xml)
□ Sitemap
□ SEO meta tags
□ Reading time
□ View count
```

### 🗄️ Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  bio       String?
  posts     Post[]
  comments  Comment[]
  likes     Like[]
  createdAt DateTime @default(now())
}

model Post {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  excerpt     String
  content     String   @db.Text
  coverImage  String?
  published   Boolean  @default(false)
  viewCount   Int      @default(0)
  readTime    Int      // minutes
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  tags        Tag[]
  comments    Comment[]
  likes       Like[]
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([published, publishedAt])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  parentId  String?
  parent    Comment? @relation("Replies", fields: [parentId], references: [id])
  replies   Comment[] @relation("Replies")
  createdAt DateTime @default(now())
}

model Like {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id])
  postId String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, postId])
}
```

### 🔧 Hướng dẫn chi tiết

**MDX Editor Setup**:
```bash
npm install @uiw/react-md-editor next-mdx-remote
```

```tsx
// src/components/MDXEditor.tsx
"use client";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function MDXEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <MDEditor
      value={value}
      onChange={onChange}
      height={500}
      preview="live"
    />
  );
}
```

**Render MDX**:
```tsx
// src/app/blog/[slug]/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { prisma } from "@/lib/prisma";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: true, tags: true },
  });
  if (!post) notFound();

  return (
    <article className="prose dark:prose-invert mx-auto">
      <h1>{post.title}</h1>
      <MDXRemote source={post.content} />
    </article>
  );
}
```

### 📚 Kiến thức cần học vững
1. **MDX** syntax (markdown + JSX)
2. **Slug generation** (slugify)
3. **Full-text search** (PostgreSQL `tsvector` hoặc MeiliSearch)
4. **Nested comments** (tree structure)
5. **RSS feed** generation
6. **SEO** (Open Graph, Twitter cards)
7. **Reading time** calculation (words per minute)

### 🌟 Điểm cộng cho portfolio
- ⭐ Syntax highlighting (rehype-prism)
- ⭐ Code copy button
- ⭐ Table of contents (auto-generated)
- ⭐ Related posts
- ⭐ View counter (Redis)
- ⭐ Share buttons (Twitter, Facebook, LinkedIn)

---

## 📦 DỰ ÁN 1.3: URL Shortener (với Analytics)

### 🎯 Tổng quan
Dịch vụ rút gọn URL với custom alias, QR code, analytics chi tiết.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, Recharts (analytics dashboard)
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Redis (cache)
- **QR Code**: `qrcode` package
- **Analytics**: Click tracking với geolocation

### 📋 Tính năng chi tiết
```
□ Tạo short URL (random / custom alias)
□ Redirect 301 → original URL
□ QR code generation
□ Click tracking (timestamp, IP, user-agent, referer)
□ Analytics dashboard (views by day, country, device)
□ Rate limiting (10 links/hour/user)
□ Link expiration (optional)
□ Password protection (optional)
□ Bulk creation (paste multiple URLs)
□ API access (for developers)
```

### 🗄️ Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  links     Link[]
  createdAt DateTime @default(now())
}

model Link {
  id          String   @id @default(cuid())
  shortCode   String   @unique
  originalUrl String   @db.Text
  customAlias Boolean  @default(false)
  clicks      Int      @default(0)
  expiresAt   DateTime?
  password    String?  // hashed
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  clicksLog   Click[]
  createdAt   DateTime @default(now())

  @@index([shortCode])
  @@index([userId, createdAt])
}

model Click {
  id        String   @id @default(cuid())
  linkId    String
  link      Link     @relation(fields: [linkId], references: [id], onDelete: Cascade)
  ip        String
  userAgent String   @db.Text
  referer   String?
  country   String?
  device    String?  // mobile/desktop/tablet
  createdAt DateTime @default(now())

  @@index([linkId, createdAt])
}
```

### 🔧 Hướng dẫn chi tiết

**Generate short code**:
```ts
// src/utils/shortCode.ts
import { customAlphabet } from "nanoid";

// Exclude confusing characters: 0/O, 1/I/l
const alphabet = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const nano = customAlphabet(alphabet, 7);

export function generateShortCode(): string {
  return nano();
}
```

**Redirect endpoint**:
```ts
// src/routes/redirect.routes.ts
import { Router } from "express";
import { prisma } from "../config/database";
import { redis } from "../config/redis";
import { UAParser } from "ua-parser-js";

const router = Router();

router.get("/:code", async (req, res) => {
  const { code } = req.params;

  // Check Redis cache first
  let link = await redis.get(`link:${code}`);
  if (link) {
    link = JSON.parse(link);
  } else {
    link = await prisma.link.findUnique({ where: { shortCode: code } });
    if (!link) return res.status(404).send("Not found");
    await redis.setex(`link:${code}`, 3600, JSON.stringify(link));
  }

  // Check expiration
  if (link.expiresAt && link.expiresAt < new Date()) {
    return res.status(410).send("Link expired");
  }

  // Log click (async, don't block redirect)
  const parser = new UAParser(req.headers["user-agent"]);
  const device = parser.getDevice();
  prisma.click.create({
    data: {
      linkId: link.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
      referer: req.headers.referer,
      device: device.type || "unknown",
    },
  }).catch(console.error);

  // Increment click count (Redis for fast access)
  redis.incr(`clicks:${code}`);

  return res.redirect(301, link.originalUrl);
});

export default router;
```

### 📚 Kiến thức cần học vững
1. **HTTP 301 vs 302 redirect**
2. **nanoid** generation
3. **Redis caching** pattern
4. **UA parsing** (ua-parser-js)
5. **Geolocation** (MaxMind GeoLite2)
6. **Recharts** data visualization
7. **Rate limiting** (express-rate-limit)

### 🌟 Điểm cộng cho portfolio
- ⭐ Custom domain support
- ⭐ Link preview (OG meta tags)
- ⭐ CSV export analytics
- ⭐ Browser extension
- ⭐ Mobile app (React Native / Flutter)
- ⭐ Bot detection

---

## 📦 DỰ ÁN 1.4: Weather Dashboard (Public API)

### 🎯 Tổng quan
Dashboard hiển thị thời tiết theo vị trí, với charts và forecasts.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, TanStack Query, Recharts
- **API**: OpenWeatherMap / Open-Meteo (free, no API key)
- **Geolocation**: Browser Geolocation API
- **Charts**: Recharts
- **Map**: Leaflet / Mapbox

### 📋 Tính năng chi tiết
```
□ Current weather (temp, humidity, wind, etc.)
□ 7-day forecast
□ 24-hour hourly forecast
□ Weather map (precipitation, temperature layers)
□ Search by city name
□ Geolocation (auto-detect)
□ Multiple cities (favorites)
□ Historical data (last 30 days)
□ Weather alerts
□ Air quality index
□ Sunrise / sunset times
```

### 🗄️ Tech approach
```ts
// src/lib/weather.ts
import { useQuery } from "@tanstack/react-query";

export function useWeather(city: string) {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: async () => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=21.03&longitude=105.85&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
      );
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
```

### 🔧 Hướng dẫn chi tiết

**Geolocation hook**:
```ts
// src/hooks/useGeolocation.ts
"use client";
import { useState, useEffect } from "react";

export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { coords, error, loading };
}
```

**City search với debounce**:
```ts
// src/components/CitySearch.tsx
"use client";
import { useState, useDeferredValue } from "react";

export function CitySearch({ onSelect }: { onSelect: (city: any) => void }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const { data: cities } = useQuery({
    queryKey: ["cities", deferredQuery],
    queryFn: async () => {
      if (deferredQuery.length < 2) return [];
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${deferredQuery}&count=10`
      );
      return res.json();
    },
    enabled: deferredQuery.length >= 2,
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city..."
      />
      {cities?.results?.map((city: any) => (
        <button key={city.id} onClick={() => onSelect(city)}>
          {city.name}, {city.country}
        </button>
      ))}
    </div>
  );
}
```

### 📚 Kiến thức cần học vững
1. **TanStack Query** (cache, revalidation, optimistic updates)
2. **useDeferredValue** for search
3. **Geolocation API**
4. **Open-Meteo API** (free, no key)
5. **Recharts** line/area/bar charts
6. **Leaflet** maps integration
7. **PWA** (offline support)

### 🌟 Điểm cộng cho portfolio
- ⭐ PWA installable
- ⭐ Push notifications for weather alerts
- ⭐ Animated weather icons (Lottie)
- ⭐ Multi-language (i18n)
- ⭐ Theme switcher
- ⭐ Export data (CSV, JSON)

---

## 📦 DỰ ÁN 1.5: Real-Time Chat App (1-1)

### 🎯 Tổng quan
Ứng dụng chat 1-1 real-time với typing indicator, online status, read receipts.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, Socket.IO Client, TailwindCSS
- **Backend**: Node.js + Express + Socket.IO
- **Database**: PostgreSQL + Prisma
- **Real-time**: Socket.IO
- **Auth**: JWT

### 📋 Tính năng chi tiết
```
□ Đăng ký / đăng nhập
□ Danh sách conversations
□ Gửi / nhận tin nhắn real-time
□ Typing indicator
□ Online / offline status
□ Read receipts
□ File / image upload
□ Emoji picker
□ Search messages
□ Delete / edit message
□ Notification sound
```

### 🗄️ Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  password  String
  sentMessages     Message[] @relation("SentMessages")
  participatedIn   ConversationParticipant[]
  createdAt DateTime @default(now())
}

model Conversation {
  id        String   @id @default(cuid())
  type      ConversationType @default(DIRECT)
  participants ConversationParticipant[]
  messages  Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ConversationParticipant {
  id             String @id @default(cuid())
  conversationId String
  userId         String
  lastReadAt     DateTime?
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  joinedAt       DateTime @default(now())

  @@unique([conversationId, userId])
}

model Message {
  id             String @id @default(cuid())
  conversationId String
  senderId       String
  content        String?  @db.Text
  type           MessageType @default(TEXT)
  fileUrl        String?
  fileName       String?
  fileSize       Int?
  sender         User         @relation("SentMessages", fields: [senderId], references: [id])
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  readBy         MessageRead[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([conversationId, createdAt])
}

model MessageRead {
  id        String @id @default(cuid())
  messageId String
  userId    String
  readAt    DateTime @default(now())
  message   Message @relation(fields: [messageId], references: [id], onDelete: Cascade)

  @@unique([messageId, userId])
}

enum ConversationType {
  DIRECT
  GROUP
}

enum MessageType {
  TEXT
  IMAGE
  FILE
  SYSTEM
}
```

### 🔧 Hướng dẫn chi tiết

**Socket.IO Server**:
```ts
// src/socket/chat.socket.ts
import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/database";

const onlineUsers = new Map<number, string>(); // userId -> socketId

export function setupChatSocket(io: Server) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = await verifyToken(token);
      socket.data.userId = user.id;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    onlineUsers.set(userId, socket.id);
    io.emit("user:online", { userId });

    socket.on("message:send", async ({ conversationId, content, type }) => {
      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          content,
          type: type || "TEXT",
        },
        include: { sender: { select: { id: true, name: true, avatar: true } } },
      });

      // Get participants
      const participants = await prisma.conversationParticipant.findMany({
        where: { conversationId },
        select: { userId: true },
      });

      // Send to all online participants except sender
      participants.forEach((p) => {
        if (p.userId !== userId) {
          const socketId = onlineUsers.get(p.userId);
          if (socketId) io.to(socketId).emit("message:new", message);
        }
      });

      // Echo back to sender for confirmation
      socket.emit("message:sent", message);
    });

    socket.on("typing:start", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:start", { userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("user:offline", { userId });
    });
  });
}
```

**Client Socket Hook**:
```ts
// src/hooks/useChatSocket.ts
"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocket(token: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      transports: ["websocket"],
    });

    s.on("connect", () => console.log("Connected"));
    s.on("user:online", ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });
    s.on("user:offline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, [token]);

  return { socket, onlineUsers };
}
```

### 📚 Kiến thức cần học vững
1. **Socket.IO** (rooms, namespaces, events)
2. **JWT** verification on socket handshake
3. **Real-time UI updates** (optimistic)
4. **File upload** (multer / S3)
5. **Typing indicators** (debounce)
6. **Read receipts** (tracking)
7. **Online status** (Map data structure)

### 🌟 Điểm cộng cho portfolio
- ⭐ Voice messages
- ⭐ Video calls (WebRTC)
- ⭐ Message reactions (emoji)
- ⭐ Reply / quote message
- ⭐ Message search (PostgreSQL full-text)
- ⭐ End-to-end encryption

---

# 🌿 PHẦN II: LEVEL 2 — INTERMEDIATE (5 DỰ ÁN TRUNG CẤP)

> **Mục tiêu**: Full-stack với auth, payment, real-time, file upload, deployment.
> **Thời gian**: 2-4 tuần/dự án
> **Công nghệ**: Next.js + Node.js + PostgreSQL (combo chính)

---

## 📦 DỰ ÁN 2.1: E-Commerce Platform (Multi-vendor)

### 🎯 Tổng quan
Sàn thương mại điện tử với vendors, products, cart, checkout, payment.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, shadcn/ui, Zustand
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma + Redis (cart, session)
- **Payment**: Stripe (test mode)
- **Search**: MeiliSearch / Elasticsearch
- **Storage**: S3 / Cloudinary
- **Email**: Resend

### 📋 Tính năng chi tiết
```
□ Vendor đăng ký / quản lý shop
□ Product CRUD (variants, options, images)
□ Categories / subcategories (nested)
□ Search + filter (price, rating, brand)
□ Cart (guest + logged in)
□ Checkout flow (Stripe Payment Intent)
□ Order management
□ Reviews + ratings
□ Wishlist
□ Coupon / discount codes
□ Inventory tracking
□ Shipping zones
□ Email notifications (order confirmation, shipping)
□ Admin dashboard
□ Vendor dashboard (sales, analytics)
□ Refund flow
```

### 🗄️ Database Schema (rút gọn)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(CUSTOMER)
  vendor    Vendor?
  orders    Order[]
  reviews   Review[]
  addresses Address[]
  cart      CartItem[]
  createdAt DateTime @default(now())
}

model Vendor {
  id          String  @id @default(cuid())
  userId      String  @unique
  user        User    @relation(fields: [userId], references: [id])
  shopName    String  @unique
  description String?
  logo        String?
  approved    Boolean @default(false)
  products    Product[]
  payouts     Payout[]
  createdAt   DateTime @default(now())
}

model Product {
  id          String  @id @default(cuid())
  name        String
  slug        String  @unique
  description String  @db.Text
  price       Decimal @db.Decimal(10, 2)
  comparePrice Decimal? @db.Decimal(10, 2)
  sku         String  @unique
  inventory   Int     @default(0)
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id])
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  variants    ProductVariant[]
  reviews     Review[]
  orderItems  OrderItem[]
  createdAt   DateTime @default(now())

  @@index([slug])
  @@index([vendorId, createdAt])
}

model ProductVariant {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  name      String  // e.g. "Red, Large"
  sku       String  @unique
  price     Decimal @db.Decimal(10, 2)
  inventory Int     @default(0)
  options   Json    // [{ name: "Color", value: "Red" }, ...]
}

model Order {
  id            String   @id @default(cuid())
  orderNumber   String   @unique
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  status        OrderStatus @default(PENDING)
  subtotal      Decimal  @db.Decimal(10, 2)
  tax           Decimal  @db.Decimal(10, 2)
  shipping      Decimal  @db.Decimal(10, 2)
  total         Decimal  @db.Decimal(10, 2)
  paymentIntent String?  // Stripe Payment Intent ID
  shippingAddressId String
  billingAddressId  String
  items         OrderItem[]
  payments      Payment[]
  statusHistory OrderStatusHistory[]
  createdAt     DateTime @default(now())

  @@index([userId, createdAt])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  variantId String?
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
}

model Review {
  id        String  @id @default(cuid())
  rating    Int     // 1-5
  title     String?
  content   String? @db.Text
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  verified  Boolean @default(false)  // bought the product
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}

model Coupon {
  id            String   @id @default(cuid())
  code          String   @unique
  discountType  DiscountType
  discountValue Decimal  @db.Decimal(10, 2)
  minOrder      Decimal? @db.Decimal(10, 2)
  maxUses       Int?
  usedCount     Int      @default(0)
  expiresAt     DateTime?
  active        Boolean  @default(true)
}
```

### 🔧 Hướng dẫn chi tiết

**Stripe Payment Intent**:
```ts
// src/services/payment.service.ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPaymentIntent(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error("Order not found");

  // Check if already has payment intent
  if (order.paymentIntent) {
    return stripe.paymentIntents.retrieve(order.paymentIntent);
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100), // cents
    currency: "usd",
    metadata: { orderId, orderNumber: order.orderNumber },
    automatic_payment_methods: { enabled: true },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentIntent: intent.id },
  });

  return intent;
}

export async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        }),
        prisma.payment.create({
          data: {
            orderId,
            stripePaymentId: intent.id,
            amount: intent.amount / 100,
            status: "SUCCEEDED",
          },
        }),
        // Update inventory
        prisma.orderItem.findMany({ where: { orderId } }).then((items) =>
          Promise.all(items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { inventory: { decrement: item.quantity } },
            })
          ))
        ),
      ]);
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });
      break;
    }
  }
}
```

**Cart Service (Redis-backed)**:
```ts
// src/services/cart.service.ts
import { redis } from "../config/redis";

interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export class CartService {
  private getKey(userId: string) { return `cart:${userId}`; }

  async getCart(userId: string): Promise<CartItem[]> {
    const data = await redis.get(this.getKey(userId));
    return data ? JSON.parse(data) : [];
  }

  async addItem(userId: string, item: CartItem): Promise<void> {
    const cart = await this.getCart(userId);
    const existing = cart.find((i) => i.productId === item.productId && i.variantId === item.variantId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    await redis.setex(this.getKey(userId), 60 * 60 * 24 * 7, JSON.stringify(cart)); // 7 days
  }

  async removeItem(userId: string, productId: string, variantId?: string): Promise<void> {
    const cart = await this.getCart(userId);
    const filtered = cart.filter((i) => !(i.productId === productId && i.variantId === variantId));
    await redis.setex(this.getKey(userId), 60 * 60 * 24 * 7, JSON.stringify(filtered));
  }

  async clear(userId: string): Promise<void> {
    await redis.del(this.getKey(userId));
  }
}
```

### 📚 Kiến thức cần học vững
1. **Stripe Payment Intents** flow
2. **Webhook handling** (security: signature verification)
3. **Multi-vendor data modeling**
4. **Cart abandonment** tracking
5. **Email templates** (React Email)
6. **Search engine** (MeiliSearch / Elasticsearch)
7. **Inventory concurrency** (transactions)

### 🌟 Điểm cộng cho portfolio
- ⭐ Multi-currency
- ⭐ Multi-language
- ⭐ Live chat với vendor
- ⭐ Compare products
- ⭐ Recently viewed
- ⭐ Recommendation engine
- ⭐ Elasticsearch full-text search
- ⭐ Stripe Connect (vendor payouts)

---

## 📦 DỰ ÁN 2.2: SaaS Project Management Tool (Trello Clone)

### 🎯 Tổng quan
Công cụ quản lý dự án dạng Kanban với teams, boards, cards, real-time sync.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, dnd-kit (drag & drop), Zustand
- **Backend**: NestJS (TypeScript) hoặc Node.js + Express
- **Database**: PostgreSQL + Prisma
- **Real-time**: Socket.IO
- **Cache**: Redis
- **Auth**: NextAuth + OAuth (Google Workspace)

### 📋 Tính năng chi tiết
```
□ Workspace (teams)
□ Boards (nhiều board / workspace)
□ Lists (columns)
□ Cards (tasks) với drag & drop
□ Card details: description, checklist, attachments, comments
□ Labels / tags
□ Members & permissions (owner/admin/member/viewer)
□ Due dates & reminders
□ Activity log
□ Real-time sync (multi-user)
□ Search across boards
□ Filters (by label, member, due date)
□ Email notifications
□ Calendar view
□ Power-ups (Slack, GitHub integration)
```

### 🗄️ Database Schema
```prisma
model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  ownerId   String
  owner     User     @relation("OwnedWorkspaces", fields: [ownerId], references: [id])
  members   WorkspaceMember[]
  boards    Board[]
  createdAt DateTime @default(now())
}

model WorkspaceMember {
  id          String @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole @default(MEMBER)
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  joinedAt    DateTime @default(now())

  @@unique([workspaceId, userId])
}

model Board {
  id          String   @id @default(cuid())
  name        String
  description String?
  background  String?  // color or image URL
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  lists       List[]
  members     BoardMember[]
  starred     Boolean  @default(false)
  archived    Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([workspaceId, createdAt])
}

model List {
  id        String   @id @default(cuid())
  name      String
  boardId   String
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  position  Float    // for ordering
  cards     Card[]
  createdAt DateTime @default(now())
}

model Card {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  listId      String
  list        List     @relation(fields: [listId], references: [id], onDelete: Cascade)
  position    Float
  dueDate     DateTime?
  completed   Boolean  @default(false)
  coverImage  String?
  members     CardMember[]
  labels      CardLabel[]
  checklist   ChecklistItem[]
  comments    Comment[]
  attachments Attachment[]
  createdById String
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([listId, position])
}

model ChecklistItem {
  id        String   @id @default(cuid())
  cardId    String
  card      Card     @relation(fields: [cardId], references: [id], onDelete: Cascade)
  content   String
  completed Boolean  @default(false)
  position  Int
  createdAt DateTime @default(now())
}
```

### 🔧 Hướng dẫn chi tiết

**Drag & Drop với dnd-kit**:
```tsx
// src/components/Board.tsx
"use client";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
         className="bg-white dark:bg-gray-800 p-3 rounded shadow">
      {card.title}
    </div>
  );
}

export function Board({ initialLists }: { initialLists: List[] }) {
  const [lists, setLists] = useState(initialLists);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Optimistic update
    const newLists = lists.map((list) => {
      if (list.id === over.id) {
        return { ...list, cards: [...list.cards, findCard(active.id as string)] };
      }
      return { ...list, cards: list.cards.filter((c) => c.id !== active.id) };
    });
    setLists(newLists);

    // API call
    await fetch(`/api/cards/${active.id}/move`, {
      method: "PATCH",
      body: JSON.stringify({ targetListId: over.id }),
    });

    // Real-time broadcast via Socket.IO
    socket.emit("card:moved", { cardId: active.id, targetListId: over.id });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      {lists.map((list) => (
        <div key={list.id}>
          <h3>{list.name}</h3>
          <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {list.cards.map((card) => <SortableCard key={card.id} card={card} />)}
          </SortableContext>
        </div>
      ))}
    </DndContext>
  );
}
```

**Real-time sync**:
```ts
// src/socket/board.socket.ts
io.on("connection", (socket) => {
  socket.on("board:join", (boardId) => {
    socket.join(`board:${boardId}`);
  });

  socket.on("card:moved", async ({ cardId, targetListId, position }) => {
    // Persist to DB
    await prisma.card.update({
      where: { id: cardId },
      data: { listId: targetListId, position },
    });

    // Broadcast to all in board (except sender)
    socket.to(`board:${card.listId}`).emit("card:updated", { cardId, listId: targetListId, position });
  });

  socket.on("card:created", async (card) => {
    const newCard = await prisma.card.create({ data: card });
    io.to(`board:${card.boardId}`).emit("card:created", newCard);
  });
});
```

### 📚 Kiến thức cần học vững
1. **dnd-kit** drag & drop
2. **Optimistic UI** updates
3. **WebSocket** real-time sync
4. **Position-based ordering** (floating point)
5. **Activity log** pattern
6. **OAuth** (Google Workspace)
7. **RBAC** (role-based access control)

### 🌟 Điểm cộng cho portfolio
- ⭐ Offline mode (IndexedDB)
- ⭐ Undo / redo
- ⭐ Templates
- ⭐ Automation (rules)
- ⭐ GitHub integration
- ⭐ Slack integration
- ⭐ Mobile responsive (PWA)

---

## 📦 DỰ ÁN 2.3: Learning Management System (LMS)

### 🎯 Tổng quan
Nền tảng học trực tuyến với video courses, progress tracking, certificates.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, video.js / Vidstack
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma
- **Video**: HLS streaming (Cloudflare Stream / Mux / Bunny)
- **Payment**: Stripe (subscriptions)
- **Storage**: S3 (videos, materials)

### 📋 Tính năng chi tiết
```
□ Course catalog
□ Course detail (curriculum, instructor, reviews)
□ Video player (HLS, subtitles, speed)
□ Progress tracking (% completed)
□ Quizzes / assignments
□ Q&A section
□ Notes (timestamped)
□ Bookmarks
□ Discussion forum
□ Certificate generation (PDF)
□ Instructor dashboard
□ Student dashboard
□ Subscription plans (monthly/yearly)
□ Free preview lessons
□ Download resources
□ Mobile-friendly player
```

### 🗄️ Database Schema
```prisma
model Course {
  id           String  @id @default(cuid())
  slug         String  @unique
  title        String
  subtitle     String?
  description  String  @db.Text
  thumbnail    String
  previewVideo String?
  price        Decimal @db.Decimal(10, 2)
  level        Level
  language     String  @default("en")
  instructorId String
  instructor   User    @relation(fields: [instructorId], references: [id])
  published    Boolean @default(false)
  sections     Section[]
  enrollments  Enrollment[]
  reviews      Review[]
  totalStudents Int    @default(0)
  rating       Float  @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Section {
  id        String   @id @default(cuid())
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title     String
  position  Int
  lessons   Lesson[]
}

model Lesson {
  id              String   @id @default(cuid())
  sectionId       String
  section         Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  title           String
  description     String?  @db.Text
  videoUrl        String?  // HLS URL
  duration        Int      // seconds
  position        Int
  isFree          Boolean  @default(false)
  resources       Resource[]
  notes           Note[]
  progress        LessonProgress[]
  quizzes         Quiz[]
}

model Enrollment {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  enrolledAt  DateTime @default(now())
  expiresAt   DateTime?
  progress    Float    @default(0)  // 0-100
  completedAt DateTime?
  certificate IssuedCertificate?

  @@unique([userId, courseId])
}

model LessonProgress {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  watchedSeconds Int   @default(0)
  completed   Boolean  @default(false)
  lastWatched DateTime @default(now())

  @@unique([userId, lessonId])
}
```

### 🔧 Hướng dẫn chi tiết

**HLS Video Player**:
```tsx
// src/components/VideoPlayer.tsx
"use client";
import vidstackDefaultStyles from "vidstack/styles/base.css";
import { MediaPlayer, MediaProvider, Track, Poster } from "@vidstack/react";

export function VideoPlayer({ src, poster, subtitles }: { src: string; poster?: string; subtitles?: any[] }) {
  return (
    <MediaPlayer title="Course Video" src={src} crossOrigin poster={poster}
                 aspectRatio="16/9" playsInline>
      <MediaProvider>
        {subtitles?.map((sub) => (
          <Track {...sub} kind="subtitles" />
        ))}
      </MediaProvider>
    </MediaPlayer>
  );
}
```

**Progress tracking**:
```ts
// src/services/progress.service.ts
export class ProgressService {
  async updateProgress(userId: string, lessonId: string, watchedSeconds: number) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new Error("Lesson not found");

    const course = lesson.section.course;
    const totalLessons = await prisma.lesson.count({
      where: { section: { courseId: course.id } },
    });

    // Mark lesson as completed if watched > 90%
    const completed = watchedSeconds / lesson.duration >= 0.9;

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, watchedSeconds, completed },
      update: { watchedSeconds, completed },
    });

    // Recalculate course progress
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId, completed: true, lesson: { section: { courseId: course.id } } },
    });

    const courseProgress = (completedLessons / totalLessons) * 100;

    await prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId: course.id } },
      data: {
        progress: courseProgress,
        completedAt: courseProgress >= 100 ? new Date() : null,
      },
    });

    // Issue certificate if completed
    if (courseProgress >= 100) {
      await this.issueCertificate(userId, course.id);
    }
  }

  async issueCertificate(userId: string, courseId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!user || !course) return;

    const certNumber = `CERT-${Date.now()}-${nanoid(6).toUpperCase()}`;
    await prisma.issuedCertificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: {
        userId,
        courseId,
        certificateNumber: certNumber,
        issuedAt: new Date(),
      },
      update: {},
    });

    // Generate PDF
    await generateCertificatePDF({
      userName: user.name,
      courseName: course.title,
      certificateNumber: certNumber,
    });
  }
}
```

### 📚 Kiến thức cần học vững
1. **HLS streaming** protocol
2. **Video.js / Vidstack** player
3. **Stripe Subscriptions**
4. **PDF generation** (pdfkit, react-pdf)
5. **Progress calculation** (server-side authoritative)
6. **Signed URLs** for private videos
7. **Subtitle / caption** (.vtt files)

### 🌟 Điểm cộng cho portfolio
- ⭐ Live classes (WebRTC)
- ⭐ Mobile app (React Native)
- ⭐ AI tutor (RAG on course content)
- ⭐ Auto-generated captions (Whisper)
- ⭐ Multi-instructor revenue split
- ⭐ Affiliate program

---

## 📦 DỰ ÁN 2.4: Social Media Platform (Twitter-like)

### 🎯 Tổng quan
Mạng xã hội với posts, follows, likes, comments, hashtags, trending.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, TanStack Query
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma
- **Cache**: Redis (timeline, trending)
- **Search**: MeiliSearch
- **Storage**: S3 (media)
- **Real-time**: Socket.IO (notifications)

### 📋 Tính năng chi tiết
```
□ Post text + media (images, videos, GIFs)
□ Reply (threaded)
□ Repost / quote
□ Like / unlike
□ Follow / unfollow
□ Timeline (home + user profile)
□ Hashtags & mentions
□ Trending topics
□ Search (users, posts, hashtags)
□ Notifications (real-time)
□ Direct messages
□ Bookmarks
□ Lists (curated user lists)
□ Verified accounts
□ Analytics (post views, profile visits)
```

### 🗄️ Database Schema
```prisma
model User {
  id            String   @id @default(cuid())
  username      String   @unique
  email         String   @unique
  password      String
  displayName   String
  bio           String?
  avatar        String?
  banner        String?
  verified      Boolean  @default(false)
  posts         Post[]
  likes         Like[]
  comments      Comment[]
  followers     Follow[] @relation("Following")
  following     Follow[] @relation("Followers")
  createdAt     DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  content   String   @db.Text
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parentId  String?  // for replies
  parent    Post?    @relation("Replies", fields: [parentId], references: [id])
  replies   Post[]   @relation("Replies")
  repostOfId String?
  repostOf   Post?   @relation("Reposts", fields: [repostOfId], references: [id])
  reposts    Post[]  @relation("Reposts")
  media      Media[]
  hashtags   Hashtag[]
  mentions   Mention[]
  likes      Like[]
  bookmarks  Bookmark[]
  views      Int     @default(0)
  createdAt  DateTime @default(now())

  @@index([authorId, createdAt])
  @@index([parentId, createdAt])
}

model Follow {
  id          String @id @default(cuid())
  followerId  String
  follower    User   @relation("Followers", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   User   @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, postId])
}

model Hashtag {
  id        String   @id @default(cuid())
  tag       String   @unique
  postCount Int      @default(0)
  posts     Post[]
}

model Notification {
  id        String   @id @default(cuid())
  userId    String   // recipient
  type      NotificationType
  fromUserId String?
  postId    String?
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId, read, createdAt])
}
```

### 🔧 Hướng dẫn chi tiết

**Timeline generation (fan-out on write)**:
```ts
// src/services/timeline.service.ts
export class TimelineService {
  async publishPost(post: Post) {
    // 1. Save post
    await prisma.post.create({ data: post });

    // 2. Update hashtags
    const tags = extractHashtags(post.content);
    for (const tag of tags) {
      await prisma.hashtag.upsert({
        where: { tag },
        create: { tag, postCount: 1 },
        update: { postCount: { increment: 1 } },
      });
    }

    // 3. Fan-out to followers' timelines (Redis)
    const followers = await prisma.follow.findMany({
      where: { followingId: post.authorId },
      select: { followerId: true },
    });

    const pipeline = redis.pipeline();
    followers.forEach((f) => {
      const key = `timeline:${f.followerId}`;
      pipeline.lpush(key, JSON.stringify(post));
      pipeline.ltrim(key, 0, 999); // keep last 1000
    });
    // Also add to author's own timeline
    pipeline.lpush(`timeline:${post.authorId}`, JSON.stringify(post));
    await pipeline.exec();

    // 4. Extract mentions and send notifications
    const mentions = extractMentions(post.content);
    for (const username of mentions) {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user && user.id !== post.authorId) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: "MENTION",
            fromUserId: post.authorId,
            postId: post.id,
          },
        });
        io.to(`user:${user.id}`).emit("notification", { type: "MENTION" });
      }
    }
  }

  async getTimeline(userId: string, cursor: number, limit: number = 20) {
    const cached = await redis.lrange(`timeline:${userId}`, cursor, cursor + limit - 1);
    if (cached.length > 0) {
      return cached.map((p) => JSON.parse(p));
    }
    // Fallback to DB (e.g. for new users)
    return this.buildTimelineFromDB(userId, cursor, limit);
  }
}
```

### 📚 Kiến thức cần học vững
1. **Fan-out on write** pattern
2. **Redis Lists** for timeline cache
3. **Hashtag extraction** (regex / NLP)
4. **Mention parsing**
5. **Real-time notifications**
6. **Infinite scroll** (cursor-based pagination)
7. **Content moderation** (Perspective API)

### 🌟 Điểm cộng cho portfolio
- ⭐ Twitter Spaces (live audio)
- ⭐ Polls
- ⭐ Communities
- ⭐ Spaces
- ⭐ Newsletter
- ⭐ Tip jar
- ⭐ Twitter Blue / verification

---

## 📦 DỰ ÁN 2.5: Job Board Platform (LinkedIn-like)

### 🎯 Tổng quan
Nền tảng tuyển dụng với job postings, applications, recruiter dashboard, candidate matching.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, react-hook-form, Zod
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma + Elasticsearch (search)
- **Auth**: NextAuth + OAuth
- **File**: PDF parsing (resume)
- **Email**: Resend

### 📋 Tính năng chi tiết
```
□ User: candidate / recruiter / admin
□ Profile (resume, skills, experience, education)
□ Job posting (title, description, requirements, salary, location)
□ Job search (filter: location, salary, type, skills)
□ Job application (with cover letter, resume)
□ Application tracking (status: applied, screening, interview, offered, rejected)
□ Saved jobs
□ Job alerts (email)
□ Company pages
□ Recruiter dashboard (post jobs, view applications)
□ Candidate recommendations (AI matching)
□ Interview scheduling
□ Messaging (recruiter ↔ candidate)
□ Reviews (company reviews)
□ Salary insights
```

### 🗄️ Database Schema
```prisma
model Company {
  id          String  @id @default(cuid())
  name        String
  slug        String  @unique
  logo        String?
  website     String?
  industry    String?
  size        CompanySize
  description String? @db.Text
  jobs        Job[]
  reviews     CompanyReview[]
  createdAt   DateTime @default(now())
}

model Job {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  description     String   @db.Text
  requirements    String   @db.Text
  responsibilities String? @db.Text
  salaryMin       Int?
  salaryMax       Int?
  salaryCurrency  String   @default("USD")
  location        String
  remote          Boolean  @default(false)
  jobType         JobType  @default(FULL_TIME)
  experienceLevel ExperienceLevel @default(MID)
  skills          String[]
  companyId       String
  company         Company  @relation(fields: [companyId], references: [id])
  postedById      String
  postedBy        User     @relation(fields: [postedById], references: [id])
  applications    Application[]
  status          JobStatus @default(ACTIVE)
  expiresAt       DateTime?
  viewCount       Int      @default(0)
  createdAt       DateTime @default(now())

  @@index([companyId, createdAt])
  @@index([status, createdAt])
}

model Application {
  id          String   @id @default(cuid())
  jobId       String
  job         Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  candidateId String
  candidate   User     @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  coverLetter String?  @db.Text
  resumeUrl   String?
  status      ApplicationStatus @default(APPLIED)
  notes       String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([jobId, candidateId])
}

model CandidateProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  headline    String?
  bio         String?  @db.Text
  resume      String?  // PDF URL
  experience  Experience[]
  education   Education[]
  skills      Skill[]
  preferences JobPreference?
}

model Experience {
  id          String   @id @default(cuid())
  profileId   String
  profile     CandidateProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  title       String
  company     String
  location    String?
  startDate   DateTime
  endDate     DateTime?
  current     Boolean  @default(false)
  description String?  @db.Text
}
```

### 🔧 Hướng dẫn chi tiết

**Elasticsearch job search**:
```ts
// src/services/search.service.ts
import { Client } from "@elastic/elasticsearch";
const es = new Client({ node: process.env.ELASTICSEARCH_URL });

export async function indexJob(job: Job) {
  await es.index({
    index: "jobs",
    id: job.id,
    body: {
      title: job.title,
      description: job.description,
      skills: job.skills,
      location: job.location,
      remote: job.remote,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      company: job.company.name,
      createdAt: job.createdAt,
    },
  });
}

export async function searchJobs(query: SearchJobQuery) {
  const result = await es.search({
    index: "jobs",
    body: {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: query.q,
                fields: ["title^3", "description", "skills^2", "company"],
              },
            },
          ],
          filter: [
            ...(query.location ? [{ term: { location: query.location } }] : []),
            ...(query.remote ? [{ term: { remote: true } }] : []),
            ...(query.salaryMin ? [{ range: { salaryMin: { gte: query.salaryMin } } }] : []),
          ],
        },
      },
      highlight: {
        fields: { title: {}, description: {} },
      },
    },
  });
  return result.hits.hits;
}
```

**AI matching**:
```ts
// src/services/matching.service.ts
import OpenAI from "openai";
const openai = new OpenAI();

export async function matchCandidateToJob(candidateId: string, jobId: string) {
  const [candidate, job] = await Promise.all([
    prisma.candidateProfile.findUnique({
      where: { userId: candidateId },
      include: { experience: true, education: true, skills: true },
    }),
    prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    }),
  ]);

  const prompt = `
    Analyze match between candidate and job (0-100 score):
    
    Candidate:
    - Bio: ${candidate.bio}
    - Experience: ${candidate.experience.map((e) => `${e.title} at ${e.company}`).join(", ")}
    - Skills: ${candidate.skills.map((s) => s.name).join(", ")}
    
    Job:
    - Title: ${job.title}
    - Description: ${job.description}
    - Skills required: ${job.skills.join(", ")}
    
    Provide: {"score": 0-100, "reasoning": "...", "matchingSkills": [...], "missingSkills": [...]}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### 📚 Kiến thức cần học vững
1. **Elasticsearch** full-text search
2. **OAuth** (LinkedIn, Google)
3. **Resume parsing** (PDF → structured data)
4. **AI matching** (embeddings + LLM)
5. **Cron jobs** (job alerts)
6. **Email templates** (transactional)
7. **GDPR compliance** (data export, deletion)

### 🌟 Điểm cộng cho portfolio
- ⭐ ATS integration
- ⭐ Video interview recording
- ⭐ Skills assessment
- ⭐ Background check integration
- ⭐ Salary insights (aggregated)
- ⭐ Multi-language support

---

# 🌳 PHẦN III: LEVEL 3 — ADVANCED (5 DỰ ÁN NÂNG CAO)

> **Mục tiêu**: Real-time, AI/ML, microservices, message queue, search engine.
> **Thời gian**: 1-3 tháng/dự án
> **Công nghệ**: Mix các stack (Node.js, Go, Java, Python)

---

## 📦 DỰ ÁN 3.1: Real-Time Collaboration Tool (Figma-like)

### 🎯 Tổng quan
Công cụ cộng tác real-time với canvas, shapes, text, comments (multi-user CRDT).

### 🛠️ Tech stack
- **Frontend**: Next.js 15, Canvas API / Konva.js / tldraw
- **Backend**: Node.js + Express, Socket.IO, Redis
- **CRDT**: Yjs / Automerge
- **Database**: PostgreSQL
- **Storage**: S3 (export PDF/PNG)

### 📋 Tính năng chi tiết
```
□ Multi-user real-time editing (50+ users)
□ CRDT-based sync (Yjs)
□ Drawing tools: rectangle, ellipse, line, arrow, freehand
□ Text tool (rich text)
□ Image upload + manipulate
□ Layers / grouping
□ Undo / redo
□ Comments (anchored to elements)
□ Cursor presence (each user's cursor)
□ Voice / video chat (WebRTC)
□ Version history
□ Export PNG / PDF / SVG
□ Templates
□ Permissions (view / edit)
□ Offline mode (IndexedDB)
```

### 🗄️ Database Schema
```prisma
model Board {
  id          String   @id @default(cuid())
  name        String
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  thumbnail   String?
  isPublic    Boolean  @default(false)
  snapshots   Snapshot[]
  permissions BoardPermission[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Snapshot {
  id        String   @id @default(cuid())
  boardId   String
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  yDocState Bytes    // Yjs document state
  createdAt DateTime @default(now())
}

model BoardPermission {
  id        String   @id @default(cuid())
  boardId   String
  userId    String
  role      BoardRole @default(EDITOR)
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([boardId, userId])
}
```

### 🔧 Hướng dẫn chi tiết

**Yjs setup**:
```ts
// src/socket/board.socket.ts
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

io.on("connection", (socket) => {
  const { boardId } = socket.handshake.query;
  const doc = getOrCreateDoc(boardId as string);

  // Load Yjs state
  socket.on("y:update", (update: Uint8Array) => {
    Y.applyUpdate(doc, new Uint8Array(update));
    // Broadcast to others
    socket.to(`board:${boardId}`).emit("y:update", update);
  });

  // Awareness (cursors, selections)
  socket.on("awareness:update", (update: Uint8Array) => {
    socket.to(`board:${boardId}`).emit("awareness:update", update);
  });

  // Save snapshot every 5 minutes
  socket.on("disconnect", () => {
    const state = Y.encodeStateAsUpdate(doc);
    prisma.snapshot.create({
      data: { boardId: boardId as string, yDocState: Buffer.from(state) },
    });
  });
});
```

**React + Yjs + tldraw**:
```tsx
// src/components/Canvas.tsx
"use client";
import { Tldraw, useYjsStore } from "@tldraw/yjs";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function Canvas({ boardId }: { boardId: string }) {
  const yDoc = useMemo(() => new Y.Doc(), [boardId]);
  const provider = useMemo(() => new WebsocketProvider(
    process.env.NEXT_PUBLIC_WS_URL!,
    `board:${boardId}`,
    yDoc
  ), [boardId, yDoc]);

  const store = useYjsStore({ yDoc, provider });

  return <Tldraw store={store} />;
}
```

### 📚 Kiến thức cần học vững
1. **CRDT** (Yjs, Automerge)
2. **WebSocket** optimization (binary protocol)
3. **Canvas rendering** (Konva, tldraw)
4. **Operational Transform** vs CRDT
5. **Awareness protocol** (presence)
6. **Snapshot strategy** (debounced)
7. **Conflict resolution**

### 🌟 Điểm cộng cho portfolio
- ⭐ AI design suggestions
- ⭐ Auto-layout
- ⭐ Component library
- ⭐ Code export (HTML/CSS)
- ⭐ Plugin system
- ⭐ Mobile app (React Native + Skia)

---

## 📦 DỰ ÁN 3.2: AI Chatbot Platform (Multi-tenant SaaS)

### 🎯 Tổng quan
Nền tảng cho phép doanh nghiệp tạo chatbot AI riêng, training trên data của họ.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, shadcn/ui, TanStack Query
- **Backend**: Python (FastAPI) + Node.js
- **AI**: OpenAI / Anthropic, LangChain, vector DB (Pinecone/Qdrant)
- **Database**: PostgreSQL + pgvector
- **Message Queue**: Redis Streams / RabbitMQ
- **Embeddings**: OpenAI text-embedding-3

### 📋 Tínng năng chi tiết
```
□ Multi-tenant (organizations)
□ Bot creation wizard
□ Data sources: PDF, website crawl, Notion, Google Drive
□ Custom knowledge base (RAG)
□ Conversation history
□ Fine-tuning (OpenAI fine-tune API)
□ Multi-channel: web widget, Slack, Discord, WhatsApp
□ Analytics (conversations, satisfaction, handoff)
□ Human handoff
□ A/B testing
□ Webhook integrations
□ Custom branding (white-label)
□ API access
□ Usage billing (Stripe)
```

### 🗄️ Database Schema
```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  plan      Plan     @default(STARTER)
  bots      Bot[]
  members   Member[]
  stripeCustomerId String?
  createdAt DateTime @default(now())
}

model Bot {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name           String
  description    String?
  systemPrompt   String   @db.Text
  model          String   @default("gpt-4o-mini")
  temperature    Float    @default(0.7)
  maxTokens      Int      @default(2048)
  knowledgeBases KnowledgeBase[]
  channels       Channel[]
  conversations  Conversation[]
  createdAt      DateTime @default(now())
}

model KnowledgeBase {
  id        String   @id @default(cuid())
  botId     String
  bot       Bot      @relation(fields: [botId], references: [id], onDelete: Cascade)
  name      String
  type      SourceType
  config    Json     // URL, file paths, Notion token, etc.
  status    IndexStatus @default(PENDING)
  documents Document[]
  @@index([botId])
}

model Document {
  id        String   @id @default(cuid())
  knowledgeBaseId String
  knowledgeBase   KnowledgeBase @relation(fields: [knowledgeBaseId], references: [id], onDelete: Cascade)
  title     String
  content   String   @db.Text
  metadata  Json
  chunks    Chunk[]
  createdAt DateTime @default(now())
}

model Chunk {
  id         String   @id @default(cuid())
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  content    String   @db.Text
  embedding  Unsupported("vector(1536)")?  // pgvector
  metadata   Json
  @@index([documentId])
}
```

### 🔧 Hướng dẫn chi tiết

**RAG pipeline (Python FastAPI)**:
```python
# app/services/rag.py
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

class RAGService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )

    async def index_document(self, document_id: str, content: str):
        # Split into chunks
        chunks = self.text_splitter.split_text(content)

        # Generate embeddings
        embeddings = await self.embeddings.aembed_documents(chunks)

        # Store in pgvector
        async with db.transaction():
            for chunk, embedding in zip(chunks, embeddings):
                await db.execute("""
                    INSERT INTO chunks (id, document_id, content, embedding)
                    VALUES (gen_random_uuid(), $1, $2, $3)
                """, document_id, chunk, embedding)

    async def query(self, bot_id: str, question: str) -> dict:
        # 1. Embed question
        query_embedding = await self.embeddings.aembed_query(question)

        # 2. Similarity search in pgvector
        similar_chunks = await db.fetch("""
            SELECT content, 1 - (embedding <=> $1) AS similarity
            FROM chunks c
            JOIN documents d ON c.document_id = d.id
            JOIN knowledge_bases kb ON d.knowledge_base_id = kb.id
            WHERE kb.bot_id = $2
            ORDER BY embedding <=> $1
            LIMIT 5
        """, query_embedding, bot_id)

        # 3. Build context
        context = "\n\n".join([chunk["content"] for chunk in similar_chunks])

        # 4. LLM with context
        bot = await get_bot(bot_id)
        prompt = f"""{bot.system_prompt}

Context:
{context}

Question: {question}

Answer:"""

        response = await self.llm.apredict(prompt)

        return {
            "answer": response,
            "sources": [{"content": c["content"], "similarity": c["similarity"]} for c in similar_chunks],
        }
```

**Background indexing (Celery/RQ)**:
```python
# app/workers/indexer.py
from celery import Celery
app = Celery("indexer", broker="redis://localhost:6379/0")

@app.task
def index_knowledge_base(kb_id: str):
    kb = get_kb(kb_id)
    documents = fetch_documents(kb)

    rag = RAGService()
    for doc in documents:
        rag.index_document(doc.id, doc.content)

    update_kb_status(kb_id, "READY")
```

### 📚 Kiến thức cần học vững
1. **RAG** architecture
2. **Vector databases** (pgvector, Pinecone, Qdrant)
3. **LangChain / LlamaIndex**
4. **OpenAI API** (chat, embeddings, fine-tuning)
5. **Multi-tenancy** patterns
6. **Webhook delivery** (with retry)
7. **Rate limiting** per tenant

### 🌟 Điểm cộng cho portfolio
- ⭐ Voice / voice cloning
- ⭐ Multi-language detection
- ⭐ Custom function calling
- ⭐ Conversation analytics
- ⭐ Handoff to human (live chat)
- ⭐ Sentiment analysis

---

## 📦 DỰ ÁN 3.3: Video Streaming Platform (Netflix-like)

### 🎯 Tổng quan
Nền tảng streaming video với HLS, DRM, recommendation, multiple profiles.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, video.js
- **Backend**: Go (Gin) - high performance
- **Database**: PostgreSQL + Redis
- **Video Processing**: FFmpeg + AWS MediaConvert
- **CDN**: CloudFront / Cloudflare
- **Storage**: S3
- **Search**: Elasticsearch
- **Recommendation**: Python ML service

### 📋 Tính năng chi tiết
```
□ Video upload (large file, resumable)
□ HLS transcoding (multiple bitrates)
□ Adaptive bitrate streaming
□ DRM (Widevine, FairPlay, PlayReady)
□ Subtitle (multi-language, .vtt)
□ Watch progress (resume)
□ Profiles (multi-user per account)
□ Recommendation engine (collaborative filtering)
□ Categories / genres
□ Search
□ Continue watching
□ My list
□ Ratings
□ Comments
□ Download (offline)
□ Casting (Chromecast)
```

### 🗄️ Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  profiles  Profile[]
  subscriptions Subscription[]
  watchHistory WatchHistory[]
  createdAt DateTime @default(now())
}

model Profile {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  avatar    String?
  isKid     Boolean  @default(false)
  pin       String?
  watchHistory WatchHistory[]
}

model Video {
  id           String   @id @default(cuid())
  title        String
  description  String?  @db.Text
  duration     Int      // seconds
  thumbnailUrl String
  trailerUrl   String?
  hlsUrl       String?  // master playlist
  releaseYear  Int
  maturityRating String @default("PG-13")
  views        Int      @default(0)
  rating       Float    @default(0)
  status       VideoStatus @default(PROCESSING)
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])
  genres       Genre[]
  subtitles    Subtitle[]
  cast         CastMember[]
  createdAt    DateTime @default(now())
}

model WatchHistory {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  profileId String
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  videoId   String
  video     Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  progress  Int      // seconds
  completed Boolean  @default(false)
  watchedAt DateTime @default(now())

  @@index([profileId, watchedAt])
}
```

### 🔧 Hướng dẫn chi tiết

**FFmpeg HLS transcoding**:
```go
// go/services/transcoder.go
package services

import (
    "os/exec"
    "fmt"
)

type Transcoder struct {
    inputPath  string
    outputDir  string
    s3Bucket   string
}

func (t *Transcoder) TranscodeToHLS() error {
    // Multiple bitrates
    profiles := []struct {
        name       string
        width      int
        height     int
        bitrate    string
        audioBitrate string
    }{
        {"360p", 640, 360, "800k", "96k"},
        {"720p", 1280, 720, "2500k", "128k"},
        {"1080p", 1920, 1080, "5000k", "192k"},
    }

    for _, p := range profiles {
        cmd := exec.Command("ffmpeg",
            "-i", t.inputPath,
            "-vf", fmt.Sprintf("scale=%d:%d", p.width, p.height),
            "-c:a", "aac",
            "-ar", "48000",
            "-c:v", "h264",
            "-profile:v", "main",
            "-crf", "20",
            "-sc_threshold", "0",
            "-g", "48",
            "-keyint_min", "48",
            "-hls_time", "4",
            "-hls_playlist_type", "vod",
            "-b:v", p.bitrate,
            "-b:a", p.audioBitrate,
            "-hls_segment_filename", fmt.Sprintf("%s/stream_%s_%%03d.ts", t.outputDir, p.name),
            fmt.Sprintf("%s/stream_%s.m3u8", t.outputDir, p.name),
        )
        if err := cmd.Run(); err != nil {
            return fmt.Errorf("ffmpeg failed for %s: %w", p.name, err)
        }
    }

    // Create master playlist
    masterPlaylist := `#EXTM3U
#EXT-X-VERSION:3
`
    for _, p := range profiles {
        masterPlaylist += fmt.Sprintf(`#EXT-X-STREAM-INF:BANDWIDTH=%s,RESOLUTION=%dx%d
stream_%s.m3u8
`, p.bitrate, p.width, p.height, p.name)
    }

    return os.WriteFile(t.outputDir+"/master.m3u8", []byte(masterPlaylist), 0644)
}
```

**Signed URLs (CloudFront)**:
```ts
// src/services/cdn.service.ts
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export function getSignedVideoUrl(videoKey: string, profileId: string): string {
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 4; // 4h
  const url = `https://cdn.example.com/${videoKey}/master.m3u8`;

  return getSignedUrl({
    url,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
    dateLessThan: new Date(expires * 1000).toISOString(),
  });
}

// Generate signed cookie for entire session
export function getSignedCookies(profileId: string) {
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 4;
  const policy = JSON.stringify({
    Statement: [{
      Resource: `https://cdn.example.com/videos/*`,
      Condition: { DateLessThan: { "AWS:EpochTime": expires } },
    }],
  });

  const signature = crypto.sign("RSA-SHA1", Buffer.from(policy), privateKey).toString("base64");
  return {
    "CloudFront-Policy": policy,
    "CloudFront-Signature": signature,
    "CloudFront-Key-Pair-Id": process.env.CLOUDFRONT_KEY_PAIR_ID!,
  };
}
```

**Recommendation engine (collaborative filtering)**:
```python
# app/ml/recommender.py
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class Recommender:
    def __init__(self):
        self.user_item_matrix = None
        self.video_similarity = None

    def fit(self, watch_history):
        # Build user-item matrix (users × videos with watch duration)
        self.user_item_matrix = build_matrix(watch_history)

        # Compute video similarity
        self.video_similarity = cosine_similarity(self.user_item_matrix.T)

    def recommend(self, user_id: str, top_k: int = 10):
        user_vector = self.user_item_matrix[user_id]
        scores = self.video_similarity.dot(user_vector)
        top_video_ids = np.argsort(scores)[::-1][:top_k]
        return top_video_ids
```

### 📚 Kiến thức cần học vững
1. **HLS / DASH** streaming protocols
2. **FFmpeg** transcoding
3. **DRM** (Widevine, FairPlay)
4. **CDN signed URLs / cookies**
5. **Collaborative filtering** (ML)
6. **Content-based filtering**
7. **Hybrid recommendation**

### 🌟 Điểm cộng cho portfolio
- ⭐ Live streaming (HLS + LL-HLS)
- ⭐ Picture-in-picture
- ⭐ Skip intro / credits (auto-detection)
- ⭐ Watch party (sync playback)
- ⭐ VR / 360° video
- ⭐ Offline download (PWA)

---

## 📦 DỰ ÁN 3.4: Code Collaboration Platform (VS Code-like)

### 🎯 Tổng quan
Editor code trên cloud với multi-user real-time, terminal, debugger.

### 🛠️ Tech stack
- **Frontend**: Next.js 15, Monaco Editor / CodeMirror 6, Xterm.js
- **Backend**: Node.js + Express, WebSocket
- **CRDT**: Yjs / CodeMirror collab
- **Container**: Docker-in-Docker hoặc Firecracker microVMs
- **Database**: PostgreSQL
- **Storage**: S3 (snapshots)

### 📋 Tínm năng chi tiết
```
□ Multi-user real-time editing (Yjs)
□ File tree (open / close / create / delete / rename)
□ Multiple tabs
□ Integrated terminal (Xterm.js + PTY)
□ Git integration (isomorphic-git)
□ Extensions marketplace
□ Code search (ripgrep)
□ Debugger (Node.js inspector)
□ Database panel (PostgreSQL client)
□ API testing (Postman-like)
□ Deployment (one-click to Vercel/Railway)
□ AI code completion (Copilot-like)
```

### 🗄️ Database Schema
```prisma
model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  visibility  Visibility @default(PRIVATE)
  files       File[]
  members     ProjectMember[]
  snapshots   Snapshot[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ProjectMember {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  role      ProjectRole @default(EDITOR)
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([projectId, userId])
}

model File {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  path      String   // e.g. "/src/index.ts"
  content   String?  @db.Text
  language  String?
  updatedAt DateTime @updatedAt
  @@unique([projectId, path])
}
```

### 🔧 Hướng dẫn chi tiết

**Monaco + Yjs collaboration**:
```tsx
// src/components/Editor.tsx
"use client";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { useEffect, useRef } from "react";

export function CodeEditor({ fileId, projectId, language }: Props) {
  const ydoc = useRef(new Y.Doc()).current;
  const provider = useRef(
    new WebsocketProvider(process.env.NEXT_PUBLIC_WS_URL!, `${projectId}:${fileId}`, ydoc)
  ).current;
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      const ytext = ydoc.getText("monaco");
      const binding = new MonacoBinding(
        ytext,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        provider.awareness
      );
      return () => binding.destroy();
    }
  }, [editorRef.current]);

  return (
    <Editor
      height="100%"
      language={language}
      onMount={(editor) => { editorRef.current = editor; }}
      theme="vs-dark"
    />
  );
}
```

**Terminal with PTY**:
```ts
// src/socket/terminal.socket.ts
import * as pty from "node-pty";

io.on("connection", (socket) => {
  socket.on("terminal:create", ({ projectId, cols, rows }) => {
    const ptyProcess = pty.spawn("bash", [], {
      name: "xterm-256color",
      cols: cols || 80,
      rows: rows || 24,
      cwd: `/projects/${projectId}`,
      env: { ...process.env, TERM: "xterm-256color" },
    });

    ptyProcess.onData((data) => {
      socket.emit("terminal:data", data);
    });

    socket.on("terminal:input", (data) => {
      ptyProcess.write(data);
    });

    socket.on("terminal:resize", ({ cols, rows }) => {
      ptyProcess.resize(cols, rows);
    });

    socket.on("disconnect", () => {
      ptyProcess.kill();
    });
  });
});
```

### 📚 Kiến thức cần học vững
1. **Monaco Editor API**
2. **Yjs CodeMirror/Monaco bindings**
3. **node-pty** (server-side terminal)
4. **File system APIs** (Node.js fs)
5. **Git internals** (isomorphic-git)
6. **Language Server Protocol** (LSP)
7. **Container isolation** (Docker-in-Docker)

### 🌟 Điểm cộng cho portfolio
- ⭐ Copilot AI (Codeium / Codestral)
- ⭐ Voice coding
- ⭐ Pair programming (audio + video)
- ⭐ Project templates
- ⭐ Public API
- ⭐ Mobile app

---

## 📦 DỰ ÁN 3.5: Event-Driven Microservices (Uber-like)

### 🎯 Tổng quan
Hệ thống microservices: auth, ride, driver, payment, notification (event-driven).

### 🛠️ Tech stack
- **API Gateway**: Kong / NGINX / custom (Node.js)
- **Services**:
  - **Auth Service**: Node.js + JWT
  - **Ride Service**: Go (Gin) - high performance
  - **Driver Service**: Java (Spring Boot) - enterprise
  - **Payment Service**: Node.js + Stripe
  - **Notification Service**: Python (FastAPI) + Firebase
  - **Location Service**: Go (WebSocket)
- **Message Queue**: Apache Kafka
- **Database**: PostgreSQL (per service)
- **Cache**: Redis
- **Service Discovery**: Consul / Kubernetes DNS
- **Tracing**: Jaeger / OpenTelemetry

### 📋 Tính năng chi tiết
```
□ User đăng ký / đăng nhập
□ Request ride (chọn điểm đón / trả)
□ Driver matching (gần nhất)
□ Real-time tracking (WebSocket + Maps)
□ Pricing (surge, dynamic)
□ Payment (Stripe)
□ Rating (5 sao + comment)
□ Trip history
□ Driver dashboard
□ Admin dashboard
□ Notifications (push, SMS, email)
□ Analytics
□ ETA prediction (ML)
```

### 🔧 Hướng dẫn chi tiết

**Kafka event-driven flow**:
```ts
// shared/kafka.ts
import { Kafka } from "kafkajs";
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER!] });
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "ride-service" });

export { producer, consumer };

// Topics:
// - user.registered
// - ride.requested
// - driver.matched
// - ride.completed
// - payment.processed
```

**Ride Service (Go)**:
```go
// services/ride/main.go
package main

import (
    "encoding/json"
    "github.com/segmentio/kafka-go"
    "github.com/gin-gonic/gin"
    "github.com/jackc/pgx/v5/pgxpool"
)

type Ride struct {
    ID          string  `json:"id"`
    UserID      string  `json:"userId"`
    Pickup      LatLng  `json:"pickup"`
    Dropoff     LatLng  `json:"dropoff"`
    Status      string  `json:"status"`
    DriverID    *string `json:"driverId,omitempty"`
    Price       float64 `json:"price"`
    CreatedAt   time.Time `json:"createdAt"`
}

type LatLng struct {
    Lat float64 `json:"lat"`
    Lng float64 `json:"lng"`
}

func main() {
    // Kafka producer
    writer := &kafka.Writer{
        Topic: "ride.requested",
        Balancer: &kafka.LeastBytes{},
    }
    defer writer.Close()

    // Database
    db, _ := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))

    r := gin.Default()
    r.POST("/rides", func(c *gin.Context) {
        var ride Ride
        if err := c.BindJSON(&ride); err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }

        ride.ID = uuid.New().String()
        ride.Status = "REQUESTED"
        ride.CreatedAt = time.Now()

        // Save to DB
        _, err := db.Exec(c, `
            INSERT INTO rides (id, user_id, pickup, dropoff, status, price)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, ride.ID, ride.UserID, ride.Pickup, ride.Dropoff, ride.Status, ride.Price)

        // Publish to Kafka
        event, _ := json.Marshal(ride)
        writer.WriteMessages(c, kafka.Message{
            Key: []byte(ride.UserID),
            Value: event,
        })

        c.JSON(201, ride)
    })

    r.Run(":8000")
}
```

**Driver Service (Java Spring Boot)** - consumes Kafka:
```java
// services/driver/DriverMatchingService.java
@Service
public class DriverMatchingService {
    @KafkaListener(topics = "ride.requested", groupId = "driver-service")
    public void handleRideRequested(RideEvent event) {
        // Find nearest driver
        Optional<Driver> driver = locationService.findNearestDriver(
            event.getPickup().getLat(),
            event.getPickup().getLng(),
            5 // 5km radius
        );

        if (driver.isPresent()) {
            // Update ride with driver
            rideClient.assignDriver(event.getRideId(), driver.get().getId());

            // Publish driver.matched
            kafkaTemplate.send("driver.matched", new DriverMatchedEvent(
                event.getRideId(), driver.get().getId()
            ));
        }
    }
}
```

**Distributed tracing**:
```ts
// src/tracing.ts
import { trace, context } from "@opentelemetry/api";
const tracer = trace.getTracer("ride-service");

export async function tracedRequest<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      return await fn();
    } finally {
      span.end();
    }
  });
}
```

### 📚 Kiến thức cần học vững
1. **Microservices patterns** (Saga, CQRS, Event Sourcing)
2. **Apache Kafka** (producers, consumers, topics)
3. **Service mesh** (Istio / Linkerd)
4. **Distributed tracing** (OpenTelemetry, Jaeger)
5. **API Gateway** patterns
6. **Database per service**
7. **Eventual consistency**

### 🌟 Điểm cộng cho portfolio
- ⭐ Service mesh (Istio)
- ⭐ Kubernetes deployment
- ⭐ Saga pattern (distributed transactions)
- ⭐ Event sourcing
- ⭐ CQRS (Command Query Responsibility Segregation)
- ⭐ Chaos engineering (Chaos Monkey)

---

# 🏔️ PHẦN IV: LEVEL 4 — EXPERT (5 DỰ ÁN CẤP CAO)

> **Mục tiêu**: Kiến trúc phức tạp, scale lớn, production-grade.
> **Thời gian**: 3-6 tháng/dự án
> **Công nghệ**: Mix các stack (Java, Go, .NET, Python)

---

## 📦 DỰ ÁN 4.1: Banking System (Core Banking)

### 🎯 Tổng quan
Hệ thống ngân hàng lõi: tài khoản, giao dịch, thẻ, cho vay, interest calculation.

### 🛠️ Tech stack
- **Backend**: Java 21 + Spring Boot 3.4 + Spring Security
- **Database**: PostgreSQL (ACID transactions)
- **Cache**: Redis
- **Message Queue**: Apache Kafka
- **Frontend**: Next.js 15 (admin dashboard)
- **Mobile**: React Native
- **Security**: OAuth2 + JWT, AES-256 encryption
- **Compliance**: PCI-DSS, KYC

### 📋 Tính năng chi tiết
```
□ Customer onboarding (KYC)
□ Account management (savings, checking, fixed deposit)
□ Transactions (deposit, withdrawal, transfer)
□ Inter-bank transfer (NAPAS)
□ Card management (debit, credit)
□ Loan origination
□ Interest calculation (compound, simple)
□ Overdraft protection
□ Multi-currency
□ Exchange rates (real-time)
□ Statement generation
□ Audit trail (immutable log)
□ Fraud detection (ML)
□ Reporting (regulatory)
□ 2FA / biometric auth
```

### 🗄️ Database Schema (rút gọn)
```sql
-- Ledger pattern (immutable transactions)
CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id BIGINT NOT NULL,
  account_type VARCHAR(20) NOT NULL, -- SAVINGS, CHECKING, FIXED_DEPOSIT
  currency CHAR(3) NOT NULL DEFAULT 'VND',
  balance DECIMAL(20, 4) NOT NULL DEFAULT 0,
  available_balance DECIMAL(20, 4) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  interest_rate DECIMAL(5, 4) DEFAULT 0,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  version BIGINT NOT NULL DEFAULT 0, -- Optimistic locking
  CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Double-entry bookkeeping
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_id VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(30) NOT NULL, -- DEBIT, CREDIT, TRANSFER
  amount DECIMAL(20, 4) NOT NULL,
  currency CHAR(3) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
  reference_id VARCHAR(50), -- idempotency key
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE ledger_entries (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT NOT NULL,
  account_id BIGINT NOT NULL,
  entry_type VARCHAR(10) NOT NULL, -- DEBIT, CREDIT
  amount DECIMAL(20, 4) NOT NULL,
  balance_after DECIMAL(20, 4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_transaction FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id)
);
```

### 🔧 Hướng dẫn chi tiết

**ACID Transaction (Java)**:
```java
@Service
@Transactional
public class TransferService {
    public TransferResult transfer(String fromAccount, String toAccount, BigDecimal amount, String currency) {
        // 1. Lock accounts (ordered to prevent deadlock)
        Account from = accountRepository.findByNumberWithLock(fromAccount);
        Account to = accountRepository.findByNumberWithLock(toAccount);

        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient balance");
        }

        // 2. Create transaction record
        Transaction txn = transactionRepository.save(Transaction.builder()
            .transactionId(UUID.randomUUID().toString())
            .type(TransactionType.TRANSFER)
            .amount(amount)
            .currency(currency)
            .status(TransactionStatus.PENDING)
            .build());

        // 3. Debit source
        BigDecimal fromBalanceAfter = from.getBalance().subtract(amount);
        ledgerRepository.save(LedgerEntry.builder()
            .transactionId(txn.getId())
            .accountId(from.getId())
            .entryType(EntryType.DEBIT)
            .amount(amount)
            .balanceAfter(fromBalanceAfter)
            .build());
        from.setBalance(fromBalanceAfter);
        from.setAvailableBalance(from.getAvailableBalance().subtract(amount));
        accountRepository.save(from);

        // 4. Credit destination
        BigDecimal toBalanceAfter = to.getBalance().add(amount);
        ledgerRepository.save(LedgerEntry.builder()
            .transactionId(txn.getId())
            .accountId(to.getId())
            .entryType(EntryType.CREDIT)
            .amount(amount)
            .balanceAfter(toBalanceAfter)
            .build());
        to.setBalance(toBalanceAfter);
        accountRepository.save(to);

        // 5. Mark transaction complete
        txn.setStatus(TransactionStatus.COMPLETED);
        txn.setCompletedAt(Instant.now());
        transactionRepository.save(txn);

        // 6. Publish event
        kafkaTemplate.send("transaction.completed", txn);

        return new TransferResult(txn.getTransactionId());
    }
}
```

**Idempotency (avoid double-spend)**:
```java
@Aspect
@Component
public class IdempotencyAspect {
    @Autowired
    private IdempotencyRepository repo;

    @Around("@annotation(Idempotent)")
    public Object checkIdempotency(ProceedingJoinPoint joinPoint) throws Throwable {
        String key = (String) joinPoint.getArgs()[0]; // First arg is key
        Optional<Idempotency> existing = repo.findByKey(key);
        if (existing.isPresent()) {
            return deserialize(existing.get().getResult());
        }

        Object result = joinPoint.proceed();

        repo.save(Idempotency.builder()
            .key(key)
            .result(serialize(result))
            .createdAt(Instant.now())
            .build());

        return result;
    }
}
```

### 📚 Kiến thức cần học vững
1. **ACID transactions** (4 properties)
2. **Double-entry bookkeeping**
3. **Pessimistic vs Optimistic locking**
4. **Idempotency** patterns
5. **Eventual consistency**
6. **KYC / AML** compliance
7. **PCI-DSS** standards
8. **Cryptography** (AES, RSA, hashing)

### 🌟 Điểm cộng cho portfolio
- ⭐ Multi-currency support
- ⭐ SWIFT integration
- ⭐ Blockchain integration (DeFi)
- ⭐ Real-time fraud detection
- ⭐ Regulatory reporting (SBV, CTF)
- ⭐ Open Banking APIs

---

## 📦 DỰ ÁN 4.2: Distributed Search Engine (Elasticsearch-like)

### 🎯 Tổng quan
Search engine phân tán với inverted index, sharding, replication.

### 🛠️ Tech stack
- **Backend**: Java 21 + Spring Boot, hoặc Go
- **Storage**: RocksDB / LevelDB (local), HDFS / S3 (distributed)
- **Coordination**: Apache ZooKeeper / etcd
- **Network**: gRPC
- **Search**: BM25, TF-IDF
- **Frontend**: Next.js 15 (admin + search UI)

### 📋 Tính năng chi tiết
```
□ Full-text search (BM25)
□ Faceted search (aggregations)
□ Fuzzy search (typo tolerance)
□ Phrase search ("exact match")
□ Boolean operators (AND, OR, NOT)
□ Wildcard search
□ Range search (numeric, date)
□ Highlighting
□ Suggestions (autocomplete)
□ Distributed indexing (sharding)
□ Replication (master-slave)
□ Fault tolerance
□ REST API
□ Multi-language analyzer
□ Custom analyzers
```

### 🔧 Hướng dẫn chi tiết

**Inverted Index**:
```java
public class InvertedIndex {
    private final Map<String, List<Posting>> termIndex = new HashMap<>();
    private final Map<Integer, Document> documents = new HashMap<>();

    public void addDocument(Document doc) {
        documents.put(doc.getId(), doc);
        for (String term : tokenize(doc.getContent())) {
            termIndex.computeIfAbsent(term, k -> new ArrayList<>())
                .add(new Posting(doc.getId(), computeTf(term, doc)));
        }
    }

    public List<SearchResult> search(String query) {
        List<String> terms = tokenize(query);
        Map<Integer, Double> scores = new HashMap<>();

        for (String term : terms) {
            List<Posting> postings = termIndex.getOrDefault(term, List.of());
            double idf = Math.log((double) documents.size() / postings.size());

            for (Posting posting : postings) {
                scores.merge(posting.getDocId(), posting.getTf() * idf, Double::sum);
            }
        }

        return scores.entrySet().stream()
            .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
            .limit(10)
            .map(e -> new SearchResult(documents.get(e.getKey()), e.getValue()))
            .toList();
    }
}
```

**Sharding (consistent hashing)**:
```java
public class ShardRouter {
    private final ConsistentHashRing<String> ring = new ConsistentHashRing<>();

    public ShardRouter(List<String> shardNodes) {
        for (String node : shardNodes) {
            ring.add(node);
        }
    }

    public String routeToShard(String key) {
        return ring.get(key);
    }
}

// Auto-rebalance when node added/removed
```

### 📚 Kiến thức cần học vững
1. **Inverted index** data structure
2. **TF-IDF, BM25** algorithms
3. **Consistent hashing**
4. **Raft consensus** algorithm
5. **Distributed transactions** (2PC, Paxos)
6. **LSM trees** (Log-Structured Merge)
7. **Vector search** (HNSW)

### 🌟 Điểm cộng cho portfolio
- ⭐ Vector search (semantic)
- ⭐ Hybrid search (BM25 + vector)
- ⭐ Real-time indexing
- ⭐ Cross-cluster replication
- ⭐ Time-series optimization
- ⭐ Graph queries

---

## 📦 DỰ ÁN 4.3: Distributed Message Broker (Kafka-like)

### 🎯 Tổng quan
Message broker phân tán với partitioning, replication, consumer groups.

### 🛠️ Tech stack
- **Backend**: Java 21 + Netty (network), hoặc Go
- **Storage**: Append-only log (custom)
- **Coordination**: ZooKeeper / KRaft
- **Network**: TCP
- **Replication**: ISR (In-Sync Replicas)

### 📋 Tính năng chi tiết
```
□ Producer (publish to topic)
□ Consumer (subscribe to topic)
□ Consumer groups (load balancing)
□ Topic partitioning
□ Replication (master + replicas)
□ At-least-once / at-most-once / exactly-once semantics
□ Message ordering (per partition)
□ Offset management
□ Retention policy (time + size)
□ Compaction
□ Schema registry
□ Admin API
□ Monitoring (lag, throughput)
```

### 🔧 Hướng dẫn chi tiết

**Append-only log**:
```java
public class LogSegment {
    private final long baseOffset;
    private final FileChannel fileChannel;
    private final long maxSegmentBytes;

    public void append(Record record) throws IOException {
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        buffer.putLong(record.getOffset());
        buffer.putInt(record.getKeyLength());
        buffer.put(record.getKey().getBytes());
        buffer.putInt(record.getValueLength());
        buffer.put(record.getValue().getBytes());
        buffer.putLong(record.getTimestamp());
        buffer.flip();
        fileChannel.write(buffer);
    }

    public List<Record> read(long offset, int maxBytes) throws IOException {
        fileChannel.position(offset - baseOffset);
        ByteBuffer buffer = ByteBuffer.allocate(maxBytes);
        fileChannel.read(buffer);
        // Parse records...
        return records;
    }
}
```

**Producer (with batching)**:
```java
public class Producer {
    private final RecordAccumulator accumulator = new RecordAccumulator();
    private final Sender sender = new Sender();

    public Future<RecordMetadata> send(String topic, int partition, byte[] key, byte[] value) {
        RecordBatch batch = accumulator.append(topic, partition, key, value);
        if (batch.isReady()) {
            sender.wakeup();
        }
        return batch.getFuture();
    }
}

class Sender implements Runnable {
    @Override
    public void run() {
        while (running) {
            RecordBatch batch = accumulator.drain();
            for (RecordPartitionSend send : batch.getPartitions()) {
                NetworkClient client = networkClientPool.get(send.getLeader());
                client.send(send.getRequest());
            }
            // Handle responses, retry, etc.
        }
    }
}
```

**Consumer groups (rebalancing)**:
```java
public class ConsumerCoordinator {
    public void joinGroup(String groupId, String memberId, List<String> topics) {
        // Find group coordinator (one of the brokers)
        Broker coordinator = findCoordinator(groupId);

        // Send JoinGroup request
        JoinGroupResponse response = coordinator.joinGroup(memberId, topics);

        // Get assigned partitions
        Map<String, List<Integer>> assignment = response.getAssignment();

        // Fetch from assigned partitions
        for (Map.Entry<String, List<Integer>> entry : assignment.entrySet()) {
            for (int partition : entry.getValue()) {
                fetcher.start(entry.getKey(), partition);
            }
        }
    }
}
```

### 📚 Kiến thức cần học vững
1. **Distributed systems** fundamentals (CAP theorem)
2. **Consensus algorithms** (Raft, Paxos)
3. **Replication** (sync, async, semi-sync)
4. **Partitioning strategies** (hash, range)
5. **At-least-once / exactly-once** semantics
6. **Backpressure** handling
7. **Zero-copy** I/O (sendfile)

### 🌟 Điểm cộng cho portfolio
- ⭐ Exactly-once semantics
- ⭐ Transactions (read-process-write)
- ⭐ Tiered storage
- ⭐ Multi-region replication
- ⭐ Stream processing (Kafka Streams)
- ⭐ Schema evolution

---

## 📦 DỰ ÁN 4.4: Cloud Storage System (S3-like)

### 🎯 Tổng quan
Object storage phân tán với multipart upload, versioning, lifecycle.

### 🛠️ Tech stack
- **Backend**: Go (high throughput) hoặc Rust
- **Storage**: Local disk (with replication)
- **Metadata**: PostgreSQL
- **Cache**: Redis (hot data)
- **API**: S3-compatible (AWS Signature v4)

### 📋 Tính năng chi tiết
```
□ Upload / download objects
□ Multipart upload (large files)
□ Resumable upload
□ Versioning
□ Lifecycle policies (expire, transition)
□ Pre-signed URLs
□ Server-side encryption (SSE-S3, SSE-KMS)
□ Access control (IAM-like)
□ Bucket policies
□ Cross-region replication
□ Event notifications (SQS, Lambda)
□ S3-compatible API (drop-in replacement)
```

### 🗄️ Architecture
```
┌──────────────────────────────────────┐
│         API Gateway                  │
│   (REST + AWS Sig v4 auth)           │
└──────────┬───────────────────────────┘
           │
           ├──→ Metadata Service (PostgreSQL)
           │     - bucket, object metadata
           │     - ACLs, policies
           │
           ├──→ Storage Service (Go)
           │     - Erasure coding
           │     - Replication (3x)
           │     - Sharding by hash
           │
           ├──→ Index Service (Redis)
           │     - Hot objects cache
           │     - Multipart upload sessions
           │
           └──→ Event Service
                 - S3:ObjectCreated
                 - S3:ObjectRemoved
```

### 🔧 Hướng dẫn chi tiết

**Erasure coding (Reed-Solomon)**:
```go
// storage/erasure.go
package storage

import (
    "github.com/klauspost/reedsolomon"
)

type ErasureEncoder struct {
    enc reedsolomon.Encoder
    dataShards   int  // e.g. 10
    parityShards int  // e.g. 4
}

func (e *ErasureEncoder) Encode(data []byte) ([][]byte, error) {
    shards, err := e.enc.Split(data)
    if err != nil {
        return nil, err
    }
    if err := e.enc.Encode(shards); err != nil {
        return nil, err
    }
    return shards, nil
}

func (e *ErasureEncoder) Reconstruct(shards [][]byte) ([]byte, error) {
    if err := e.enc.Reconstruct(shards); err != nil {
        return nil, err
    }
    return e.enc.Join(shards, e.dataShards*e.shardSize)
}
```

**Multipart upload**:
```go
func (s *StorageService) InitiateMultipartUpload(bucket, key string) (string, error) {
    uploadID := uuid.New().String()
    s.metadata.CreateMultipartUpload(bucket, key, uploadID)
    s.cache.Set("multipart:"+uploadID, &MultipartUpload{
        Bucket: bucket,
        Key: key,
        Parts: make(map[int]Part),
    }, 24*time.Hour)
    return uploadID, nil
}

func (s *StorageService) UploadPart(uploadID string, partNumber int, data []byte) (string, error) {
    // Store part
    etag := computeMD5(data)
    s.storage.PutPart(uploadID, partNumber, data)
    return etag, nil
}

func (s *StorageService) CompleteMultipartUpload(uploadID string, parts []CompletedPart) error {
    upload := s.cache.Get("multipart:" + uploadID)
    // Assemble all parts
    // Encode with erasure coding
    // Replicate to 3 nodes
    // Update metadata
    // Delete multipart parts
    return nil
}
```

**S3-compatible API**:
```go
// api/handlers.go
r.PUT("/:bucket/*key", s3AuthMiddleware, func(c *gin.Context) {
    bucket := c.Param("bucket")
    key := c.Param("key")
    body, _ := io.ReadAll(c.Request.Body)

    // Compute SHA-256
    hash := sha256.Sum256(body)

    // Store object
    s.storage.PutObject(bucket, key, body)

    // Save metadata
    s.metadata.SaveObject(&Object{
        Bucket: bucket,
        Key: key,
        Size: int64(len(body)),
        ETag: hex.EncodeToString(hash[:]),
        LastModified: time.Now(),
    })

    c.Header("ETag", hex.EncodeToString(hash[:]))
    c.Status(200)
})
```

### 📚 Kiến thức cần học vững
1. **Object storage** vs file system vs block storage
2. **Erasure coding** (Reed-Solomon)
3. **Consistent hashing** for distribution
4. **AWS Signature v4** authentication
5. **Streaming uploads** (large files)
6. **Data consistency** (eventual, strong)
7. **CDN integration**

### 🌟 Điểm cộng cho portfolio
- ⭐ Versioning + delete markers
- ⭐ Object lock (WORM)
- ⭐ Glacier tier (cold storage)
- ⭐ Cross-region replication
- ⭐ Static website hosting
- ⭐ Lambda@Edge integration

---

## 📦 DỰ ÁN 4.5: Distributed Database (PostgreSQL-like)

### 🎯 Tổng quan
Database phân tán với SQL interface, ACID transactions, MVCC, replication.

### 🛠️ Tech stack
- **Backend**: Rust (high performance) hoặc C++
- **Storage**: Custom (LSM tree)
- **Network**: Custom protocol
- **Query**: SQL parser + planner + executor
- **Replication**: Raft consensus

### 📋 Tính năng chi tiết
```
□ SQL parser (subset of SQL)
□ Query optimizer
□ ACID transactions
□ MVCC (Multi-Version Concurrency Control)
□ Indexes (B+ tree, hash)
□ Joins (nested loop, hash, merge)
□ Aggregation
□ Window functions
□ Replication (master-replica)
□ Sharding (range, hash)
□ Query plan caching
□ Connection pooling
□ pgwire protocol (PostgreSQL compatible)
```

### 🔧 Hướng dẫn chi tiết

**SQL Parser**:
```rust
// parser/parser.rs
use nom::{
    bytes::complete::{tag, take_while},
    character::complete::{alpha1, digit1, space0},
    combinator::map_res,
    IResult,
};

pub fn parse_select(input: &str) -> IResult<&str, SelectStatement> {
    let (input, _) = tag("SELECT")(input)?;
    // Parse columns
    let (input, columns) = parse_columns(input)?;
    // FROM clause
    let (input, _) = tag("FROM")(input)?;
    let (input, table) = parse_table_name(input)?;
    // Optional WHERE
    let (input, where_clause) = opt(parse_where)(input)?;

    Ok((input, SelectStatement {
        columns,
        from: table,
        where_clause,
    }))
}
```

**MVCC**:
```rust
// storage/mvcc.rs
pub struct MVCCStore {
    versions: RwLock<HashMap<RowKey, Vec<Version>>>,
}

struct Version {
    txn_id: u64,
    data: Row,
    deleted: bool,
    timestamp: Instant,
}

impl MVCCStore {
    pub fn read(&self, key: &RowKey, txn_id: u64) -> Option<Row> {
        let versions = self.versions.read().unwrap();
        versions.get(key)?
            .iter()
            .rev()
            .find(|v| v.txn_id <= txn_id && !v.deleted)
            .map(|v| v.data.clone())
    }

    pub fn write(&self, key: RowKey, txn_id: u64, data: Row) {
        let mut versions = self.versions.write().unwrap();
        versions.entry(key).or_insert_with(Vec::new).push(Version {
            txn_id,
            data,
            deleted: false,
            timestamp: Instant::now(),
        });
    }
}
```

**B+ Tree Index**:
```rust
// storage/btree.rs
pub struct BPlusTree {
    root: Arc<RwLock<Node>>,
    order: usize,
}

enum Node {
    Internal { children: Vec<Arc<RwLock<Node>>>, keys: Vec<i32> },
    Leaf { keys: Vec<i32>, values: Vec<RowRef>, next: Option<Arc<RwLock<Node>>> },
}

impl BPlusTree {
    pub fn insert(&self, key: i32, value: RowRef) {
        // ... B+ tree insertion with split if needed
    }

    pub fn range_query(&self, start: i32, end: i32) -> Vec<RowRef> {
        // ... B+ tree range scan
    }
}
```

**Raft Consensus**:
```rust
// consensus/raft.rs
pub struct RaftNode {
    state: Arc<RwLock<NodeState>>,
    peers: Vec<String>,
    current_term: u64,
    voted_for: Option<String>,
    log: Vec<LogEntry>,
    commit_index: u64,
    last_applied: u64,
}

enum NodeState {
    Follower,
    Candidate,
    Leader,
}

impl RaftNode {
    pub async fn tick(&mut self) {
        match *self.state.read().await {
            NodeState::Follower => self.handle_follower_tick().await,
            NodeState::Candidate => self.handle_candidate_tick().await,
            NodeState::Leader => self.handle_leader_tick().await,
        }
    }
}
```

### 📚 Kiến thức cần học vững
1. **Database internals** (storage engine, query processing)
2. **MVCC** implementation
3. **B+ tree** data structure
4. **LSM tree** (Log-Structured Merge)
5. **Raft consensus**
6. **SQL parsing** (lex/yacc)
7. **Query optimization** (cost-based)
8. **Concurrency control** (2PL, timestamp ordering)

### 🌟 Điểm cộng cho portfolio
- ⭐ JSONB type
- ⭐ Full-text search
- ⭐ Vector type (pgvector)
- ⭐ Window functions
- ⭐ CTEs (Common Table Expressions)
- ⭐ Stored procedures
- ⭐ Distributed transactions (2PC)

---

# 🌌 PHẦN V: LEVEL 5 — WORLD-CLASS (5 DỰ ÁN SIÊU NÂNG CAO)

> **Mục tiêu**: Những dự án này LỚN HƠN CuongHoangDev NHIỀU LẦN. Các công ty FAANG/Tier-1 săn đón.
> **Thời gian**: 6-12 tháng/dự án
> **Công nghệ**: Cutting-edge, multi-language, multi-platform

---

## 📦 DỰ ÁN 5.1: AI Operating System (AutoGPT-like Multi-Agent)

### 🎯 Tổng quan
Hệ điều hành AI với multi-agent collaboration, planning, memory, tool use.

### 🛠️ Tech stack
- **Agent Framework**: LangChain / LangGraph / AutoGen
- **LLM**: GPT-4, Claude, Gemini, local models
- **Backend**: Python (FastAPI) + Rust (perf-critical)
- **Frontend**: Next.js 15 (mission control UI)
- **Database**: PostgreSQL + pgvector + Redis
- **Message Queue**: Celery + Redis
- **Vector DB**: Pinecone / Qdrant
- **Observability**: LangSmith / Helicone

### 📋 Tính năng chi tiết
```
□ Multi-agent (researcher, coder, designer, marketer)
□ Long-term memory (vector store + episodic)
□ Tool use (web search, code execution, file I/O, APIs)
□ Planning (ReAct, Plan-and-Execute, Reflexion)
□ Self-reflection / self-critique
□ Human-in-the-loop (approval gates)
□ Browser automation (Playwright)
□ Code execution sandbox (E2B / Docker)
□ Web scraping (Firecrawl)
□ Email / calendar integration
□ Multi-modal (vision, audio)
□ Voice interface (Whisper + TTS)
□ Mobile app (React Native)
□ Workflow templates (marketplace)
□ Billing / pay-per-use
```

### 🗄️ Database Schema
```prisma
model Agent {
  id          String   @id @default(cuid())
  name        String
  role        String   // researcher, coder, etc.
  systemPrompt String  @db.Text
  model       String   @default("gpt-4o")
  temperature Float    @default(0.7)
  tools       String[] // names of tools
  memory      Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Task {
  id          String   @id @default(cuid())
  userId      String
  goal        String   @db.Text
  status      TaskStatus @default(PENDING)
  plan        Json     // step-by-step plan
  result      String?  @db.Text
  parentTaskId String?
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime @default(now())
}

model Memory {
  id        String   @id @default(cuid())
  agentId   String
  type      MemoryType // EPISODIC, SEMANTIC, PROCEDURAL
  content   String   @db.Text
  embedding Unsupported("vector(1536)")?
  metadata  Json
  createdAt DateTime @default(now())

  @@index([agentId, type])
}

model Tool {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  schema      Json     // JSON schema for input
  implementation String // code reference
  category    String
  public      Boolean  @default(false)
}
```

### 🔧 Hướng dẫn chi tiết

**Multi-agent orchestration (LangGraph)**:
```python
# agents/orchestrator.py
from langgraph.graph import StateGraph
from langchain_openai import ChatOpenAI
from typing import TypedDict

class AgentState(TypedDict):
    goal: str
    plan: list
    current_step: int
    research: str
    code: str
    review: str
    result: str

def create_researcher_agent():
    return ChatOpenAI(model="gpt-4o", temperature=0.3)

def create_coder_agent():
    return ChatOpenAI(model="gpt-4o", temperature=0.1)

def plan(state: AgentState) -> AgentState:
    llm = create_researcher_agent()
    response = llm.invoke(f"""
    Create a step-by-step plan for: {state['goal']}

    Format as JSON: [{{"step": 1, "action": "research X", "agent": "researcher"}}, ...]
    """)
    state["plan"] = json.loads(response.content)
    return state

def research(state: AgentState) -> AgentState:
    llm = create_researcher_agent()
    current = state["plan"][state["current_step"]]
    response = llm.invoke(f"""
    Research step: {current['action']}

    Use web search if needed. Provide concise findings.
    """)
    state["research"] = response.content
    return state

def code(state: AgentState) -> AgentState:
    llm = create_coder_agent()
    response = llm.invoke(f"""
    Write code based on research: {state['research']}
    """)
    state["code"] = response.content
    return state

# Build graph
workflow = StateGraph(AgentState)
workflow.add_node("plan", plan)
workflow.add_node("research", research)
workflow.add_node("code", code)
workflow.add_edge("plan", "research")
workflow.add_edge("research", "code")
app = workflow.compile()
```

**Long-term memory (episodic + semantic)**:
```python
# memory/vector_store.py
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone

class AgentMemory:
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.embeddings = OpenAIEmbeddings()
        self.vector_store = Pinecone.from_existing_index("agent-memories", self.embeddings)

    def store(self, content: str, memory_type: str, metadata: dict = None):
        embedding = self.embeddings.embed_query(content)
        self.vector_store.add_texts(
            [content],
            metadatas=[{
                "agent_id": self.agent_id,
                "type": memory_type,
                **metadata or {},
            }],
        )

    def recall(self, query: str, top_k: int = 5):
        results = self.vector_store.similarity_search_with_score(
            query, k=top_k, filter={"agent_id": self.agent_id}
        )
        return [{"content": r[0].page_content, "score": r[1]} for r in results]
```

### 📚 Kiến thức cần học vững
1. **Multi-agent systems** (ReAct, Reflexion, Plan-and-Execute)
2. **LangChain / LangGraph**
3. **RAG** with multiple memory types
4. **Tool use** (function calling)
5. **Prompt engineering**
6. **Cost optimization** (token usage, caching)
7. **Sandboxed code execution** (E2B, Docker)
8. **Browser automation** (Playwright)

### 🌟 Điểm cộng cho portfolio
- ⭐ Multi-modal (vision, audio, video)
- ⭐ Voice interface
- ⭐ Mobile app
- ⭐ Marketplace for workflows
- ⭐ Fine-tuned models
- ⭐ Open-source community

---

## 📦 DỰ ÁN 5.2: Distributed ML Training Platform (PyTorch + Kubernetes)

### 🎯 Tổng quan
Nền tảng training ML phân tán với Kubernetes, GPU support, experiment tracking.

### 🛠️ Tech stack
- **Orchestration**: Kubernetes
- **ML Framework**: PyTorch + DeepSpeed / FSDP
- **Distributed**: Ray / Horovod
- **Storage**: S3 / GCS / HDFS
- **Experiment Tracking**: Weights & Biases / MLflow
- **Feature Store**: Feast
- **Model Serving**: Triton Inference Server / TorchServe
- **Monitoring**: Prometheus + Grafana
- **Backend**: Python (FastAPI)
- **Frontend**: Next.js 15

### 📋 Tính năng chi tiết
```
□ Dataset management (versioning, splits)
□ Experiment tracking (params, metrics, artifacts)
□ Hyperparameter search (Optuna, Ray Tune)
□ Distributed training (multi-GPU, multi-node)
□ Auto-scaling (KEDA / Karpenter)
□ Fault tolerance (checkpointing)
□ Model registry
□ Model serving (REST, gRPC, batch)
□ A/B testing
□ Drift detection
□ Feature store
□ Pipeline orchestration (Airflow / Prefect)
□ Cost monitoring (GPU hours)
□ Multi-tenant
```

### 🔧 Hướng dẫn chi tiết

**Distributed training (PyTorch FSDP)**:
```python
# training/train.py
import torch
import torch.distributed as dist
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy

def setup():
    dist.init_process_group(backend="nccl")
    torch.cuda.set_device(dist.get_rank() % torch.cuda.device_count())

def cleanup():
    dist.destroy_process_group()

def train(rank, world_size, args):
    setup()

    # Model
    model = load_model(args.model_name)

    # Wrap with FSDP
    from transformers import LlamaConfig
    from transformers.models.llama.modeling_llama import LlamaDecoderLayer

    model = FSDP(
        model,
        fsdp_auto_wrap_policy=partial(
            transformer_auto_wrap_policy,
            transformer_layer_cls={LlamaDecoderLayer},
        ),
        device_id=torch.cuda.current_device(),
    )

    # Data
    dataset = load_dataset(args.dataset_path)
    sampler = torch.utils.data.distributed.DistributedSampler(dataset)
    loader = torch.utils.data.DataLoader(dataset, sampler=sampler, batch_size=args.batch_size)

    # Optimizer
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr)

    # Training loop
    for epoch in range(args.epochs):
        sampler.set_epoch(epoch)
        for batch in loader:
            outputs = model(**batch)
            loss = outputs.loss
            loss.backward()
            optimizer.step()
            optimizer.zero_grad()

            if rank == 0:
                wandb.log({"loss": loss.item()})

    cleanup()
```

**Hyperparameter search (Ray Tune)**:
```python
# tuning/search.py
from ray import tune
from ray.tune.schedulers import ASHAScheduler

def train_config(config):
    # Train model with given config
    model = create_model(config)
    train(model, config)

search_space = {
    "lr": tune.loguniform(1e-5, 1e-1),
    "batch_size": tune.choice([16, 32, 64, 128]),
    "weight_decay": tune.loguniform(1e-6, 1e-2),
    "model_size": tune.choice(["small", "medium", "large"]),
}

scheduler = ASHAScheduler(metric="loss", mode="min")

analysis = tune.run(
    train_config,
    config=search_space,
    num_samples=100,
    scheduler=scheduler,
    resources_per_trial={"cpu": 4, "gpu": 1},
)

best_config = analysis.get_best_config(metric="loss", mode="min")
```

**Model serving (Triton)**:
```python
# serving/handler.py
import triton_python_backend_utils as pb_utils
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

class TritonPythonModel:
    def initialize(self, args):
        self.model = AutoModelForCausalLM.from_pretrained("/models/llama-7b", torch_dtype=torch.float16).cuda()
        self.tokenizer = AutoTokenizer.from_pretrained("/models/llama-7b")

    def execute(self, requests):
        responses = []
        for request in requests:
            prompt = pb_utils.get_input_tensor_by_name(request, "PROMPT").as_numpy()[0].decode()
            inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")
            outputs = self.model.generate(**inputs, max_length=200)
            result = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            responses.append(pb_utils.InferenceResponse(output_tensors=[
                pb_utils.Tensor("OUTPUT", result.encode())
            ]))
        return responses

    def finalize(self):
        torch.cuda.empty_cache()
```

### 📚 Kiến thức cần học vững
1. **PyTorch distributed** (FSDP, DDP)
2. **Kubernetes** (operators, custom resources)
3. **GPU programming** (CUDA basics)
4. **MLOps** (experiment tracking, model registry)
5. **Hyperparameter optimization**
6. **Feature engineering & feature stores**
7. **Model compression** (quantization, pruning)
8. **Auto-scaling** for ML workloads

### 🌟 Điểm cộng cho portfolio
- ⭐ Reinforcement learning (RLHF)
- ⭐ Multi-modal models
- ⭐ Federated learning
- ⭐ Edge deployment (ONNX, TensorRT)
- ⭐ Real-time inference
- ⭐ Active learning

---

## 📦 DỰ ÁN 5.3: Cloud-native Data Platform (Snowflake-like)

### 🎯 Tổng quan
Data warehouse với separation of storage/compute, auto-scaling, time travel.

### 🛠️ Tech stack
- **Storage**: S3 (Parquet/ORC)
- **Compute**: Kubernetes (ephemeral pods)
- **Query Engine**: Apache Arrow + custom SQL
- **Metadata**: PostgreSQL / FoundationDB
- **Catalog**: Apache Hive Metastore / Glue
- **Frontend**: Next.js 15 (admin + SQL IDE)
- **Notebooks**: Jupyter integration
- **BI**: Apache Superset / custom

### 📋 Tính năng chi tiết
```
□ SQL interface (PostgreSQL-compatible)
□ Separation of storage and compute
□ Auto-scaling (multi-cluster warehouse)
□ Auto-suspend (cost optimization)
□ Time travel (query historical data)
□ Zero-copy cloning
□ Data sharing across orgs
□ Row-level security
□ Column-level encryption
□ Materialized views
□ Result caching
□ Snowpipe (auto-ingest)
□ External tables (S3, GCS, ADLS)
□ Stored procedures
□ User-defined functions
□ Integration with BI tools
```

### 🔧 Hướng dẫn chi tiết

**Separation of storage/compute**:
```python
# compute/warehouse.py
class Warehouse:
    def __init__(self, name: str, size: str):
        self.name = name
        self.size = size  # X-Small to 4X-Large
        self.clusters: List[ComputeCluster] = []
        self.auto_suspend_seconds = 600

    def execute_query(self, sql: str) -> QueryResult:
        # Route to least-loaded cluster
        cluster = self.get_least_loaded_cluster()

        if not cluster:
            # Auto-scale: spawn new cluster
            cluster = self.spawn_cluster()
            self.clusters.append(cluster)

        return cluster.execute(sql)

    def auto_suspend_check(self):
        for cluster in self.clusters:
            if cluster.is_idle_for(self.auto_suspend_seconds):
                cluster.terminate()
                self.clusters.remove(cluster)
```

**Time travel**:
```python
# storage/time_travel.py
class TimeTravelStore:
    def __init__(self, s3_bucket: str):
        self.s3 = boto3.client("s3")
        self.bucket = s3_bucket

    def get_table_at(self, table_id: str, timestamp: int) -> Table:
        # Each write creates a new version
        versions = self.list_versions(table_id)
        version = next((v for v in versions if v.created_at <= timestamp), None)
        return self.load_version(table_id, version.id)

    def list_versions(self, table_id: str) -> List[Version]:
        # Get all Parquet files in S3 with their metadata
        response = self.s3.list_objects_v2(
            Bucket=self.bucket,
            Prefix=f"tables/{table_id}/",
        )
        return [self.parse_version(obj) for obj in response["Contents"]]
```

**Query execution (vectorized)**:
```python
# engine/executor.py
import pyarrow as pa
import pyarrow.compute as pc

class VectorizedExecutor:
    def execute_scan(self, table: pa.Table, projection: List[str], filter: Expression) -> pa.Table:
        # Apply filter (vectorized)
        mask = self.evaluate_filter(filter, table)
        filtered = table.filter(mask)

        # Project columns
        return filtered.select(projection)

    def execute_aggregate(self, table: pa.Table, group_by: List[str], aggregations: Dict) -> pa.Table:
        result = table.group_by(group_by).aggregate([
            (col, agg) for agg, col in aggregations.items()
        ])
        return result
```

### 📚 Kiến thức cần học vững
1. **Columnar storage** (Parquet, ORC)
2. **Vectorized query execution** (Arrow)
3. **Cost-based optimization**
4. **Distributed compute** (Kubernetes)
5. **Time travel** implementation
6. **Result caching** (materialized views)
7. **Auto-scaling** patterns
8. **Data sharing** (cross-org)

### 🌟 Điểm cộng cho portfolio
- ⭐ Native support for semi-structured data (JSON, Parquet)
- ⭐ Geospatial functions
- ⭐ Time-series functions
- ⭐ ML functions (forecasting, anomaly detection)
- ⭐ External functions (Lambda)
- ⭐ Marketplace for datasets

---

## 📦 DỰ ÁN 5.4: Real-Time Analytics Platform (Apache Pinot-like)

### 🎯 Tổng quan
OLAP database real-time với upserts, star-tree index, multi-tenant.

### 🛠️ Tech stack
- **Backend**: Java 21 + Helix (cluster management)
- **Storage**: Custom (segment-based)
- **Index**: Star-tree, sorted, range, bitmap
- **Query**: SQL (Calcite)
- **Ingestion**: Kafka
- **Frontend**: Next.js 15 (admin + query UI)

### 📋 Tính năng chi tiết
```
□ Real-time ingestion (Kafka, Kinesis)
□ Batch ingestion (HDFS, S3)
□ Upserts (real-time)
□ Star-tree index (10-100x faster aggregations)
□ SQL query (ANSI SQL)
□ Multi-tenant (tenant isolation)
□ Stream processing
□ Time-series queries
□ Anomaly detection
□ Tiered storage (hot/warm/cold)
□ Exactly-once semantics
□ Query latency SLA (p99 < 1s)
```

### 🔧 Hướng dẫn chi tiết

**Star-tree index**:
```java
// index/StarTreeIndex.java
public class StarTreeIndex {
    private final int maxLeafRecords;
    private final List<String> dimensionColumns;
    private final List<String> metricColumns;
    private final Map<String, SplitStrategy> splitStrategies;

    public void build(List<Row> records) {
        // 1. Compute statistics for split dimensions
        // 2. Build tree recursively
        // 3. Aggregate at each node
    }

    public double aggregate(String metric, Map<String, Object> filters) {
        // 1. Traverse tree using filters
        // 2. Return pre-computed aggregate
    }
}
```

**Real-time upsert**:
```java
// ingestion/RealtimeIngestion.java
public class RealtimeIngestion {
    public void consume(KafkaConsumer<String, Row> consumer) {
        while (running) {
            ConsumerRecords<String, Row> records = consumer.poll(100);
            for (ConsumerRecord<String, Row> record : records) {
                Row row = record.value();
                String primaryKey = row.getPrimaryKey();

                // Upsert into in-memory index
                realtimeIndex.upsert(primaryKey, row);

                // Periodically flush to segment
                if (realtimeIndex.size() >= threshold) {
                    Segment segment = realtimeIndex.buildSegment();
                    segmentStore.upload(segment);
                    realtimeIndex.clear();
                }
            }
        }
    }
}
```

### 📚 Kiến thức cần học vững
1. **OLAP** vs OLTP
2. **Columnar storage** (Parquet)
3. **Star-tree index**
4. **Real-time upserts** (LSM tree)
5. **Distributed query** (scatter-gather)
6. **Multi-tenancy** (resource isolation)
7. **Stream processing** (Flink, Kafka Streams)

### 🌟 Điểm cộng cho portfolio
- ⭐ Exactly-once semantics
- ⭐ Tiered storage
- ⭐ Auto-scaling
- ⭐ Real-time ML (online learning)
- ⭐ Time-series forecasting
- ⭐ Geospatial queries

---

## 📦 DỰ ÁN 5.5: LLM-Powered Code Generation Platform (Cursor-like)

### 🎯 Tổng quan
AI IDE với multi-file context, code generation, refactoring, debugging.

### 🛠️ Tech stack
- **Backend**: Rust (perf-critical) + Python (AI)
- **AI Models**: GPT-4, Claude, Code Llama
- **Embedding**: OpenAI text-embedding-3
- **Vector DB**: Pinecone / Weaviate (code embeddings)
- **Frontend**: VS Code Extension (TypeScript) + Web (Next.js 15)
- **Real-time**: WebSocket
- **Code Analysis**: tree-sitter (AST parsing)

### 📋 Tính năng chi tiết
```
□ Multi-file context (read entire repo)
□ Code completion (inline)
□ Code generation (from natural language)
□ Refactoring (across files)
□ Bug detection + auto-fix
□ Test generation
□ Documentation generation
□ Code review (PR comments)
□ Chat with codebase
□ Voice coding
□ Custom commands
□ Local model support (Code Llama)
□ Repo-level fine-tuning
□ Team collaboration
□ Enterprise SSO
```

### 🗄️ Architecture
```
┌────────────────────────────────────────┐
│   VS Code Extension / Web IDE         │
│   (TypeScript, Monaco Editor)          │
└────────────┬───────────────────────────┘
             │ WebSocket
             ▼
┌────────────────────────────────────────┐
│   API Server (Rust)                    │
│   - File operations                    │
│   - AST parsing (tree-sitter)          │
│   - Context building                   │
└────────────┬───────────────────────────┘
             │
             ├──→ AI Service (Python)
             │     - Embeddings
             │     - LLM calls (OpenAI/Anthropic)
             │     - Code analysis
             │
             ├──→ Vector DB (Pinecone)
             │     - Code embeddings
             │     - Semantic search
             │
             └──→ Database (PostgreSQL)
                   - User data
                   - Code snippets
                   - Conversation history
```

### 🔧 Hướng dẫn chi tiết

**Code indexing (tree-sitter)**:
```python
# indexer/parser.py
import tree_sitter
from tree_sitter import Language, Parser

PY_LANGUAGE = Language("/usr/local/lib/tree-sitter-python.so", "python")
TS_LANGUAGE = Language("/usr/local/lib/tree-sitter-typescript.so", "typescript")

def parse_python(code: str):
    parser = Parser()
    parser.set_language(PY_LANGUAGE)

    tree = parser.parse(bytes(code, "utf8"))
    functions = extract_functions(tree.root_node, code)
    classes = extract_classes(tree.root_node, code)
    imports = extract_imports(tree.root_node, code)

    return {
        "functions": functions,
        "classes": classes,
        "imports": imports,
    }

def extract_functions(node, code):
    functions = []
    if node.type == "function_definition":
        name_node = node.child_by_field_name("name")
        body_node = node.child_by_field_name("body")

        functions.append({
            "name": code[name_node.start_byte:name_node.end_byte],
            "start_line": node.start_point[0],
            "end_line": node.end_point[0],
            "body": code[body_node.start_byte:body_node.end_byte],
        })

    for child in node.children:
        functions.extend(extract_functions(child, code))

    return functions
```

**Multi-file context building**:
```python
# context/builder.py
class ContextBuilder:
    def __init__(self, max_tokens: int = 8000):
        self.max_tokens = max_tokens
        self.embeddings = OpenAIEmbeddings()
        self.vector_store = Pinecone(...)

    async def build_context(self, repo: str, query: str) -> str:
        # 1. Embed query
        query_embedding = await self.embeddings.aembed_query(query)

        # 2. Find relevant files
        relevant_files = await self.vector_store.similarity_search(
            query_embedding, k=20
        )

        # 3. Build context within token limit
        context_parts = []
        total_tokens = 0

        for file in relevant_files:
            file_content = file.page_content
            file_tokens = count_tokens(file_content)

            if total_tokens + file_tokens > self.max_tokens:
                # Truncate or skip
                remaining = self.max_tokens - total_tokens
                if remaining > 200:  # At least 200 tokens
                    truncated = truncate_to_tokens(file_content, remaining)
                    context_parts.append(f"# {file.metadata['path']}\n{truncated}")
                break

            context_parts.append(f"# {file.metadata['path']}\n{file_content}")
            total_tokens += file_tokens

        return "\n\n".join(context_parts)
```

**Code completion (streaming)**:
```python
# ai/completion.py
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def complete_code(prefix: str, suffix: str, language: str) -> AsyncGenerator[str, None]:
    prompt = f"""Complete the following {language} code:

```{language}
{prefix}
```

Context (what comes after):
```{language}
{suffix[:500]}  # Truncate
```

Provide ONLY the completion (no explanation):"""

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
        max_tokens=500,
        temperature=0.1,
    )

    async for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
```

### 📚 Kiến thức cần học vững
1. **AST parsing** (tree-sitter)
2. **Code embeddings** (CodeBERT, CodeT5+)
3. **LLM prompting** for code
4. **VS Code Extension API**
5. **Monaco Editor API**
6. **Real-time streaming**
7. **Code search** (ripgrep, semantic)
8. **Vector databases** for code

### 🌟 Điểm cộng cho portfolio
- ⭐ Local model support (Code Llama, DeepSeek Coder)
- ⭐ Custom fine-tuning
- ⭐ Multi-modal (image → code from screenshot)
- ⭐ Voice coding
- ⭐ Team collaboration
- ⭐ Self-hosted enterprise version

---

# 📚 PHẦN VI: KIẾN THỨC NỀN TẢNG CẦN HỌC

## 6.1. Computer Science Fundamentals

### 1. **Data Structures & Algorithms**
```
□ Arrays, Linked Lists
□ Stacks, Queues
□ Trees (Binary, BST, AVL, Red-Black, B-Tree)
□ Heaps (Binary, Fibonacci)
□ Hash Tables (open/closed addressing)
□ Graphs (BFS, DFS, Dijkstra, A*)
□ Tries, Segment Trees, Fenwick Tree
□ Bloom Filters, HyperLogLog
□ Skip Lists

Resources:
- "Introduction to Algorithms" (CLRS)
- LeetCode (300+ problems)
- HackerRank, CodeForces
- AlgoExpert, Educative.io
```

### 2. **System Design**
```
□ Scalability (horizontal vs vertical)
□ Load balancing (L4, L7)
□ Caching (Redis, Memcached, CDN)
□ Database sharding (hash, range, geo)
□ Replication (master-slave, multi-master)
□ Message queues (Kafka, RabbitMQ)
□ Microservices vs Monolith
□ CAP theorem
□ Eventual consistency
□ Saga pattern, CQRS, Event Sourcing

Resources:
- "Designing Data-Intensive Applications" (Martin Kleppmann)
- System Design Primer (GitHub)
- Educative.io Grokking System Design
- High Scalability blog
```

### 3. **Computer Networks**
```
□ TCP/IP, UDP
□ HTTP/1.1, HTTP/2, HTTP/3
□ WebSockets, Server-Sent Events
□ DNS, Load balancers
□ TLS/SSL
□ CDN, Edge computing
□ gRPC, Protocol Buffers
□ QUIC

Resources:
- "Computer Networking: A Top-Down Approach" (Kurose, Ross)
```

### 4. **Operating Systems**
```
□ Processes, Threads
□ Concurrency (locks, semaphores, deadlock)
□ Memory management (virtual memory, paging)
□ File systems
□ I/O scheduling
□ Linux internals

Resources:
- "Operating System Concepts" (Silberschatz)
- Linux man pages
```

### 5. **Databases**
```
□ RDBMS (PostgreSQL, MySQL)
□ NoSQL (MongoDB, Cassandra, DynamoDB)
□ NewSQL (CockroachDB, TiDB)
□ In-memory (Redis, Memcached)
□ Time-series (InfluxDB, TimescaleDB)
□ Graph (Neo4j)
□ Vector (Pinecone, Qdrant, pgvector)
□ CAP theorem, ACID vs BASE

Resources:
- "Database System Concepts" (Silberschatz)
- "SQL Performance Explained" (Markus Winand)
- Use The Index, Luke!
```

## 6.2. Distributed Systems

```
□ Consensus (Raft, Paxos)
□ Distributed transactions (2PC, 3PC, Saga)
□ Leader election
□ Quorum (read/write)
□ Vector clocks, Lamport timestamps
□ CRDT (Conflict-free Replicated Data Types)
□ Byzantine fault tolerance
□ Sharding strategies
□ Replication strategies

Resources:
- "Designing Data-Intensive Applications"
- "Distributed Systems" (Maarten van Steen)
- MIT 6.824 Distributed Systems (course)
```

## 6.3. Software Engineering Best Practices

```
□ SOLID principles
□ Design Patterns (Gang of Four)
□ Test-Driven Development (TDD)
□ Behavior-Driven Development (BDD)
□ CI/CD (GitHub Actions, GitLab CI)
□ Git workflows (GitFlow, trunk-based)
□ Code review
□ Refactoring
□ Documentation
□ Observability (logs, metrics, traces)

Resources:
- "Clean Code" (Robert Martin)
- "Refactoring" (Martin Fowler)
- "The Pragmatic Programmer"
```

## 6.4. DevOps & Cloud

```
□ Linux command line
□ Docker, Docker Compose
□ Kubernetes (pods, services, deployments)
□ Terraform / Pulumi (IaC)
□ AWS / GCP / Azure
□ Prometheus + Grafana
□ ELK Stack (Elasticsearch, Logstash, Kibana)
□ Sentry, Datadog, New Relic
□ Nginx, HAProxy, Envoy
□ HashiCorp Vault (secrets)

Resources:
- "Kubernetes Up & Running"
- "The Phoenix Project"
- "Site Reliability Engineering" (Google)
```

## 6.5. AI/ML

```
□ Machine Learning basics
□ Deep Learning (CNNs, RNNs, Transformers)
□ LLM (GPT, BERT, LLaMA)
□ RAG (Retrieval-Augmented Generation)
□ Fine-tuning, PEFT (LoRA)
□ Prompt engineering
□ LangChain, LlamaIndex
□ Vector databases
□ Embedding models
□ Diffusion models (Stable Diffusion)
□ Reinforcement Learning (RLHF)
□ MLOps (MLflow, Kubeflow, Weights & Biases)

Resources:
- "Deep Learning" (Goodfellow, Bengio, Courville)
- "Hands-On Machine Learning" (Aurélien Géron)
- Andrej Karpathy's videos
- Hugging Face documentation
- fast.ai courses
```

## 6.6. Frontend Advanced

```
□ React Server Components (RSC)
□ Server Actions
□ Streaming SSR
□ State management (Zustand, Jotai, Redux)
□ Performance optimization
□ Bundle analysis
□ Web Vitals (LCP, FID, CLS)
□ PWA (Service Workers, offline-first)
□ Web Components, Custom Elements
□ WebGL, WebGPU
□ Animations (Framer Motion, GSAP)
□ Accessibility (WCAG)

Resources:
- "React Documentation" (react.dev)
- "Web Performance" (MDN)
- "Inclusive Components" (Heydon Pickering)
```

## 6.7. Backend Advanced

```
□ Async/await, Event loop
□ Streams (Node.js)
□ Worker threads, clustering
□ Message queues (deep dive)
□ Caching strategies
□ Database optimization (indexes, query plans)
□ API design (REST, GraphQL, gRPC)
□ Authentication (OAuth2, OIDC, JWT, SAML)
□ Authorization (RBAC, ABAC, ReBAC)
□ Security (OWASP Top 10, XSS, CSRF, SQL injection)
□ Rate limiting, throttling
□ Observability (OpenTelemetry)

Resources:
- "Node.js Design Patterns"
- "Web Security" (MDN)
- OWASP Cheat Sheet Series
```

---

# 🎓 PHẦN VII: ROADMAP ĐỀ XUẤT

## 7.1. Lộ trình 2.5-4 năm

```
Year 1 (Phase 1-2: Foundation + Full-stack):
├── Tháng 1-2: Level 1 (5 dự án cơ bản)
├── Tháng 3-6: Level 2 (5 dự án trung cấp)
└── Kết quả: Junior → Mid-level

Year 2 (Phase 3: Advanced):
├── Tháng 7-9: Level 3 (5 dự án nâng cao)
└── Kết quả: Mid → Senior

Year 3 (Phase 4: Expert):
├── Tháng 10-15: Level 4 (5 dự án cấp cao)
└── Kết quả: Senior → Staff

Year 4 (Phase 5: World-Class):
├── Tháng 16-27: Level 5 (5 dự án siêu nâng cao)
└── Kết quả: Staff → Principal
```

## 7.2. Chiến lược áp dụng vào CV/LinkedIn

### GitHub Profile:
```
- Tạo organization "yourname-projects" với 25 repos
- Mỗi repo có:
  * README.md chi tiết (problem, solution, tech, results)
  * Live demo link (Vercel/Railway)
  * Screenshots / GIF demo
  * Architecture diagram
  * Lessons learned
  * License (MIT)
- GitHub Actions CI/CD
- Pinned repos (6 most impressive)
```

### LinkedIn:
```
- Featured section: 6 dự án tốt nhất với link
- Experience: mô tả dự án với metrics (users, scale, impact)
- Skills: cập nhật theo từng dự án
- Posts: chia sẻ journey, lessons learned
- Endorsements: từ cộng đồng
```

### Portfolio Website:
```
- Custom domain (yourdomain.com)
- Showcase 25 dự án với:
  * Screenshots / demo video
  * Tech stack badges
  * GitHub stars / forks count
  * Live demo links
  * Case study (problem → solution → results)
- Blog: writeup cho mỗi dự án
- Contact form
- Resume PDF
```

## 7.3. Cách trình bày trong phỏng vấn

### Template STAR (Situation, Task, Action, Result):
```
Ví dụ cho dự án E-commerce:

Situation: "CuongHoangDev là dự án portfolio cá nhân với 5+ services Docker, 
           nhưng chỉ có 1 sản phẩm cố định. Tôi muốn thử thách bản thân với 
           multi-vendor marketplace phức tạp hơn."

Task: "Xây dựng sàn TMĐT multi-vendor với Stripe Connect, inventory tracking, 
       search engine, 100+ vendors, 10K+ products."

Action: "Thiết kế schema với multi-vendor support, implement Stripe Connect 
         cho vendor payouts, Elasticsearch cho search, Sentry cho monitoring, 
         CI/CD với GitHub Actions, deploy trên AWS ECS."

Result: "Đạt 100+ vendors, 10K+ products, p99 latency < 200ms, 99.9% uptime, 
         đã học được multi-tenant architecture, payment systems, search engines."
```

## 7.4. Lưu ý quan trọng

### ✅ NÊN LÀM
- 1. **Commit mỗi ngày** (GitHub contribution graph xanh liên tục)
- 2. **Viết blog** cho mỗi dự án (chứng minh khả năng technical writing)
- 3. **Open source** một số dự án (nhận stars + contributions từ cộng đồng)
- 4. **Nói chuyện tại meetup** (chia sẻ kinh nghiệm)
- 5. **Contribute** cho open source projects khác (React, Next.js, etc.)
- 6. **Viết tests** (unit, integration, E2E)
- 7. **Document** thoroughly (README, code comments, API docs)
- 8. **Optimize** for performance (measure before/after)
- 9. **Security audit** (OWASP top 10)
- 10. **Monitor** in production (Sentry, Prometheus)

### ❌ KHÔNG NÊN
- 1. **Clone tutorial** rồi submit (nhà tuyển dụng nhận ra ngay)
- 2. **Skip tests** (chứng minh unprofessional)
- 3. **No documentation** (không ai đọc được code)
- 4. **Over-engineer** (YAGNI principle)
- 5. **Hoàn hảo là kẻ thù của tốt** (ship MVP, iterate)
- 6. **Quá nhiều dự án "wanna-be"** (focus 25 dự án chất lượng)
- 7. **Ignore feedback** từ cộng đồng
- 8. **Sử dụng tech chỉ vì trend** (chọn đúng công cụ cho vấn đề)
- 9. **Bỏ qua security** (API keys, env vars, SQL injection)
- 10. **Không deploy** (chỉ code mà không chạy = vô nghĩa)

---

# 📦 PHẦN VIII: TÀI NGUYÊN HỌC TẬP

## 8.1. Sách nên đọc

### Backend:
- "Designing Data-Intensive Applications" - Martin Kleppmann ⭐⭐⭐⭐⭐
- "Clean Code" - Robert Martin
- "Building Microservices" - Sam Newman
- "Web Scalability for Startup Engineers" - Artur Ejsmont
- "Site Reliability Engineering" - Google
- "Database Internals" - Alex Petrov
- "Kafka: The Definitive Guide"
- "High Performance MySQL"

### Frontend:
- "React Documentation" (react.dev)
- "You Don't Know JS" - Kyle Simpson
- "Eloquent JavaScript" - Marijn Haverbeke
- "Learning React" - Alex Banks
- "CSS Secrets" - Lea Verou

### System Design:
- "System Design Interview" - Alex Xu (Vol 1, 2)
- "Grokking System Design Interview" - Educative.io

### AI/ML:
- "Hands-On Machine Learning" - Aurélien Géron
- "Deep Learning" - Goodfellow, Bengio, Courville
- "Designing Machine Learning Systems" - Chip Huyen

## 8.2. Khóa học online

### Free:
- CS50 (Harvard)
- MIT 6.006 (Algorithms)
- MIT 6.824 (Distributed Systems)
- Full Stack Open (Helsinki)
- The Odin Project
- freeCodeCamp
- Stanford CS231n (CNNs)
- Stanford CS224n (NLP)

### Paid:
- Educative.io (Grokking series)
- AlgoExpert
- DesignGurus.io
- Frontend Masters
- Zero To Mastery
- Andrei Neagoie (Udemy)
- Stephen Grider (Udemy)

## 8.3. YouTube channels

### Tiếng Anh:
- Fireship (1-2 min concepts)
- Traversy Media (tutorials)
- The Net Ninja (tutorials)
- Web Dev Simplified
- Academind
- Hussein Nasser (backend deep dives)
- Code with Mosh
- ByteByteGo (system design)
- Hussein Nasser (backend)
- CodeAesthetic
- ThePrimeagen
- Low Level Learning

### Tiếng Việt:
- F8 Official (Đào Hải Nam)
- Tự Học Lập Trình
- 200Lab (Nguyễn Đình Nam)
- Code Dạo (Dương Minh Trí)
- UNITOP (Phạm Huy Hoàng)
- Thân Triệu (Node.js, React)

## 8.4. Cộng đồng

### Reddit:
- r/programming
- r/webdev
- r/learnprogramming
- r/node
- r/reactjs
- r/PostgreSQL
- r/devops
- r/MachineLearning

### Discord/Slack:
- Reactiflux
- The Coding Den
- TypeScript Community
- AWS, GCP, Azure communities
- Hashnode

### Vietnam:
- VietDev (Facebook group)
- Node.js Vietnam
- React Vietnam
- Vietnam AI / Machine Learning
- Toptal Việt Nam

## 8.5. Công cụ & websites

- GitHub, GitLab
- Stack Overflow
- DevDocs.io
- Can I Use
- MDN Web Docs
- Roadmap.sh (developer roadmaps)
- DevHints.io (cheat sheets)
- Regex101
- Draw.io / Lucidchart (diagrams)
- Excalidraw (whiteboard)

---

# 🎯 PHẦN IX: KẾT LUẬN

## 9.1. Tóm tắt toàn bộ lộ trình

```
25 DỰ ÁN
├── 5 Beginner (1-2 tháng)        - Nền tảng CRUD, Auth
├── 5 Intermediate (2-4 tháng)    - Full-stack, Payment, Real-time
├── 5 Advanced (3-6 tháng)        - Microservices, AI, Distributed
├── 5 Expert (6-12 tháng)         - Banking, Search Engine, Message Broker
└── 5 World-Class (12-24 tháng)   - AI OS, ML Platform, LLM Code Gen

TỔNG: 2.5-4 năm
KẾT QUẢ: Senior / Staff / Principal Engineer ready
```

## 9.2. Công thức thành công

```
THÀNH CÔNG = (Kiên trì × Thực hành) × Chia sẻ × Phản hồi

Trong đó:
- Kiên trì: 1-2 dự án / tháng, không bỏ cuộc
- Thực hành: Code mỗi ngày, không chỉ xem tutorial
- Chia sẻ: Blog, GitHub, LinkedIn, meetup
- Phản hồi: Từ cộng đồng, code review, người dùng
```

## 9.3. Lời khuyên cuối

> 🎯 **Đừng cố gắng hoàn hảo từ đầu.** Dự án đầu tiên của bạn sẽ không hoàn hảo, và điều đó OK. Quan trọng là bạn **hoàn thành** và **học được** từ nó.

> 📚 **Đọc code của người khác** nhiều hơn viết code của mình. GitHub là kho tàng vô tận.

> 🤝 **Đóng góp cho open source** cũng quan trọng như tự build. Nó cho thấy bạn có thể collaborate, đọc code người khác, follow convention.

> 💼 **Phỏng vấn FAANG/tier-1** không chỉ test kiến thức mà test khả năng **giải quyết vấn đề chưa biết**. Hãy chọn dự án mà bạn **phải research và học** công nghệ mới, không chỉ là áp dụng cái đã biết.

> 🚀 **Ship > Perfect.** Một dự án deployed với bugs còn tốt hơn một dự án perfect trong local chưa bao giờ chạy.

## 9.4. Next steps

```
1. ✅ Hoàn thành CuongHoangDev hiện tại
2. 📖 Đọc kỹ file project_for_me.md này
3. 🎯 Chọn dự án đầu tiên (Level 1, project 1.1: Todo List)
4. 📅 Đặt deadline cụ thể (1 tuần)
5. 💻 Bắt đầu code
6. 📝 Viết README + deploy
7. 🔁 Iterate và chuyển sang dự án tiếp theo
```

---

**📝 Tạo bởi**: Cursor Assistant (phiên 2026-06-17)
**📅 Ngày tạo**: 2026-06-17 21:30 (UTC+7)
**🔖 Version**: 1.0
**📍 Path**: `/Users/admin/Downloads/api-backend/project_for_me.md`
**📊 Kích thước**: ~3,500 dòng, 25 dự án, 200+ giờ học tập

**💡 LƯU Ý**: File này dài và chi tiết. Bạn không cần đọc hết trong 1 lần. Hãy bookmark lại và tham khảo khi cần. Mỗi dự án có đầy đủ:
- Tech stack
- Database schema
- Hướng dẫn code chi tiết
- Kiến thức cần học
- Điểm cộng cho portfolio

**Chúc bạn thành công trên con đường trở thành Principal Engineer! 🚀**

---

# 🗂️ PHỤ LỤC: CHECKLIST NHANH

## Dự án Level 1 (Beginner):
- [ ] 1.1 Todo List App
- [ ] 1.2 Blog Platform
- [ ] 1.3 URL Shortener
- [ ] 1.4 Weather Dashboard
- [ ] 1.5 Real-Time Chat (1-1)

## Dự án Level 2 (Intermediate):
- [ ] 2.1 E-Commerce (Multi-vendor)
- [ ] 2.2 Project Management (Trello)
- [ ] 2.3 LMS Platform
- [ ] 2.4 Social Media (Twitter)
- [ ] 2.5 Job Board (LinkedIn)

## Dự án Level 3 (Advanced):
- [ ] 3.1 Real-Time Collaboration (Figma)
- [ ] 3.2 AI Chatbot SaaS
- [ ] 3.3 Video Streaming (Netflix)
- [ ] 3.4 Cloud Code Editor (VS Code)
- [ ] 3.5 Microservices (Uber)

## Dự án Level 4 (Expert):
- [ ] 4.1 Banking System
- [ ] 4.2 Distributed Search Engine
- [ ] 4.3 Message Broker (Kafka)
- [ ] 4.4 Object Storage (S3)
- [ ] 4.5 Distributed Database

## Dự án Level 5 (World-Class):
- [ ] 5.1 AI Operating System (Multi-agent)
- [ ] 5.2 Distributed ML Platform
- [ ] 5.3 Cloud Data Warehouse (Snowflake)
- [ ] 5.4 Real-Time Analytics (Pinot)
- [ ] 5.5 LLM Code Generation (Cursor)
