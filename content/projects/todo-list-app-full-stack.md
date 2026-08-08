# Todo List App (Full-Stack)

Đây là dự án đầu tiên trong lộ trình, và nó bị đánh giá thấp nhiều hơn bất kỳ dự án nào khác. "Todo list" nghe như bài tập tuần đầu học React. Nhưng phiên bản đúng nghĩa của nó — có tài khoản người dùng, có phân quyền dữ liệu, có validate hai đầu, có deploy thật — chứa đúng những mảnh ghép mà **mọi** ứng dụng web sau này đều dùng lại: một bảng người dùng, một bảng dữ liệu thuộc về người dùng đó, một cơ chế chứng minh "tôi là ai", và một tầng API từ chối mọi thứ không chứng minh được.

Nếu bạn làm xong dự án này mà không thể trả lời được câu "vì sao người dùng A không đọc được todo của người dùng B", thì phần còn lại của lộ trình sẽ sụp. Toàn bộ bài viết này được viết để bạn trả lời được câu đó — và khoảng hai chục câu tương tự.

> **Cách đọc bài này.** Mỗi phần đều có: quyết định thiết kế → lý do → code thật → cái bẫy đi kèm. Bạn có thể gõ lại toàn bộ code trong bài và có một ứng dụng chạy được. Nhưng phần đáng giá là các đoạn "vì sao" — đó là thứ người phỏng vấn hỏi, không phải cú pháp.

---

## Bạn sẽ dựng ra cái gì

Một ứng dụng quản lý công việc cá nhân, một người dùng thấy đúng dữ liệu của mình:

- Đăng ký bằng email + mật khẩu, đăng nhập, đăng xuất
- Tạo / sửa / xoá công việc, đánh dấu hoàn thành
- Mức ưu tiên (thấp / trung bình / cao) và hạn chót
- Lọc theo trạng thái, tìm theo tên, sắp xếp theo hạn hoặc mức ưu tiên
- Giao diện tối / sáng, dùng được trên điện thoại
- Chạy thật trên internet, không phải `localhost`

Nghe đơn giản. Nhưng có sáu chỗ mà người mới gần như luôn làm sai, và bài này dừng lại ở từng chỗ:

1. Lưu mật khẩu (hash chứ không mã hoá — hai thứ khác nhau)
2. Kiểm tra quyền ở **server**, không phải ở giao diện
3. Validate ở cả client lẫn server, và hiểu vì sao phải làm hai lần
4. Phân biệt Server Component với Client Component
5. Xử lý trạng thái tải / lỗi thay vì giả định mọi thứ thành công
6. Đưa biến môi trường lên production mà không commit chúng vào Git

---

## Kiến trúc tổng thể

Điểm đặc biệt của dự án này: **không có server backend riêng**. Next.js App Router cho phép viết cả giao diện lẫn API trong một codebase, chạy trong một tiến trình. Đây là kiến trúc phù hợp cho ứng dụng nhỏ, và cũng là cách nhanh nhất để hiểu ranh giới client/server — vì ranh giới đó nằm ngay trong cùng một thư mục.

```mermaid
flowchart TB
    subgraph browser["Trình duyệt"]
        RC["Client Component<br/>TodoItem, TodoForm, FilterBar<br/>có useState, onClick"]
    end

    subgraph vercel["Next.js trên Vercel"]
        SC["Server Component<br/>dashboard/page.tsx<br/>truy vấn DB trực tiếp"]
        RH["Route Handler<br/>/api/todos<br/>GET POST PATCH DELETE"]
        MW["Middleware<br/>chặn route chưa đăng nhập"]
        NA["NextAuth v5<br/>ký và đọc JWT trong cookie"]
    end

    subgraph data["Dữ liệu"]
        PG[("PostgreSQL<br/>Neon / Supabase")]
    end

    RC -->|"fetch có cookie"| RH
    RC -.->|"render lần đầu"| SC
    MW --> NA
    RH --> NA
    RH -->|"Prisma Client"| PG
    SC -->|"Prisma Client"| PG
    NA -->|"tra user khi đăng nhập"| PG
```

Ba đường đi vào cơ sở dữ liệu, và chúng khác nhau ở một điểm quan trọng:

- **Server Component** truy vấn DB trực tiếp khi dựng HTML lần đầu. Không có vòng đi mạng nào từ trình duyệt. Nhanh nhất, nhưng chỉ chạy được một lần lúc render.
- **Route Handler** phục vụ những thao tác xảy ra *sau* khi trang đã hiện: bấm nút thêm việc, tick hoàn thành. Trình duyệt gọi qua `fetch`.
- **NextAuth** đọc DB đúng một lần lúc đăng nhập, sau đó mọi request đều dựa vào JWT trong cookie chứ không tra DB nữa.

Cái bẫy đầu tiên nằm ngay đây: **nhiều người viết toàn bộ ứng dụng bằng Client Component** vì quen React thuần, rồi tự hỏi vì sao trang tải chậm và không có SEO. Quy tắc thực dụng: *mặc định là Server Component; chỉ thêm `'use client'` khi component cần `useState`, `useEffect`, hoặc bắt sự kiện chuột/bàn phím.*

---

## Chuẩn bị môi trường từ số 0

Phần này viết cho người chưa từng cài gì. Nếu máy bạn đã có Node và Postgres, nhảy xuống mục sau.

### Node.js

Cài **Node 20 trở lên** (Next.js 15 yêu cầu tối thiểu Node 18.18, nhưng 20 là bản LTS đang được hỗ trợ dài). Dùng `nvm` thay vì cài trực tiếp — sau này mỗi dự án một phiên bản Node khác nhau là chuyện bình thường:

```bash
# macOS / Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 20
nvm use 20
node -v    # phải in ra v20.x
```

### PostgreSQL

Có ba lựa chọn, xếp theo độ dễ:

| Cách | Ưu | Nhược |
|---|---|---|
| **Neon** (neon.tech) | Miễn phí, có sẵn URL, không cài gì | Cần mạng, độ trễ cao hơn |
| **Docker** | Giống production, tắt bật nhanh | Phải cài Docker |
| **Cài trực tiếp** | Nhanh nhất khi chạy | Gỡ ra khó, dễ xung đột phiên bản |

Với người mới, dùng Docker là cân bằng tốt nhất:

```bash
docker run --name todo-pg \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=todoapp \
  -p 5432:5432 \
  -d postgres:16
```

Kiểm tra nó sống:

```bash
docker exec -it todo-pg psql -U postgres -d todoapp -c "SELECT version();"
```

Nếu lệnh này in ra phiên bản Postgres, bạn đã có database. Chuỗi kết nối sẽ là:

```
postgresql://postgres:devpassword@localhost:5432/todoapp
```

### Khởi tạo dự án

```bash
npx create-next-app@latest todo-app --typescript --tailwind --app --eslint
cd todo-app
npm install prisma @prisma/client next-auth@beta bcryptjs zod
npm install -D @types/bcryptjs
npx prisma init
```

Vì sao `next-auth@beta`? NextAuth v5 là bản viết lại cho App Router; bản v4 ổn định nhưng thiết kế cho Pages Router và dùng khá gượng với Server Component. Toàn bộ bài này dùng v5.

Vì sao **Zod**? Đây là thư viện validate. Nó sẽ trả lời câu hỏi "vì sao phải validate hai lần" ở phần sau.

---

## Thiết kế cơ sở dữ liệu

Hai bảng, một quan hệ. Nhìn sơ đồ trước, đọc code sau:

```mermaid
erDiagram
    USER ||--o{ TODO : "sở hữu"
    USER {
        string id PK "cuid, không đoán được"
        string email UK "duy nhất"
        string name "có thể null"
        string password "CHUỖI BĂM bcrypt"
        datetime createdAt
    }
    TODO {
        string id PK
        string title "bắt buộc, tối đa 200"
        string description "có thể null"
        boolean completed "mặc định false"
        enum priority "LOW MEDIUM HIGH"
        datetime dueDate "null = không có hạn"
        string userId FK "onDelete Cascade"
        datetime createdAt
        datetime updatedAt
    }
```

Ký hiệu `||--o{` đọc là: một `USER` có **không hoặc nhiều** `TODO`, và mỗi `TODO` thuộc về **đúng một** `USER`. Cái "đúng một" đó chính là thứ khiến `where: { userId }` đủ để phân tách dữ liệu — nếu một todo có thể thuộc nhiều người, toàn bộ chương về phân quyền phải viết lại.

Đây là bảng thiết kế đầy đủ. Đọc kỹ phần chú thích — mỗi dòng là một quyết định, không phải cú pháp bắt buộc.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  // cuid() thay vì autoincrement(): id không đoán được.
  // Với id tăng dần, người dùng số 5 biết chắc có người
  // dùng số 4, và biết hệ thống có bao nhiêu tài khoản —
  // rò rỉ thông tin kinh doanh miễn phí cho đối thủ.
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  // Đây là chuỗi BĂM, không phải mật khẩu. Xem phần
  // "Xác thực" để hiểu vì sao phân biệt này quan trọng.
  password  String
  todos     Todo[]
  createdAt DateTime @default(now())

  @@map("users")
}

model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?

  // Cột khoá ngoại + onDelete: Cascade.
  // Cascade nghĩa là xoá user thì todo của họ tự biến mất.
  // Không có nó, xoá user sẽ lỗi ràng buộc khoá ngoại, HOẶC
  // tệ hơn: để lại "todo mồ côi" trỏ tới user không tồn tại.
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Chỉ mục kép. MỌI truy vấn trong app đều có dạng
  // "lấy todo của user X, mới nhất trước" — chỉ mục này
  // khiến Postgres đọc thẳng đúng phần cần thay vì quét
  // cả bảng rồi mới sắp xếp.
  @@index([userId, createdAt])
  @@map("todos")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

### Vì sao `enum` chứ không phải `String`

Nếu `priority` là `String`, không có gì ngăn một bug ghi vào `"high"`, `"HIGH "` (thừa dấu cách), hay `"cao"`. Sáu tháng sau bạn có một cột với năm biến thể của cùng một khái niệm, và mọi truy vấn lọc đều sai. `enum` đẩy việc kiểm tra xuống tận Postgres: ghi sai giá trị là lỗi ngay, không phải dữ liệu bẩn phát hiện sau.

### Vì sao `dueDate` cho phép `null` còn `completed` thì không

`completed` luôn có câu trả lời — hoặc xong hoặc chưa. `dueDate` thì không: rất nhiều việc không có hạn. Dùng `null` cho "không có" đúng hơn là dùng một ngày quy ước như `9999-12-31`, vì `null` bị mọi hàm so sánh loại ra một cách tự nhiên, còn ngày quy ước thì lọt vào mọi phép lọc "sắp đến hạn".

Chạy migration đầu tiên:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Lệnh `migrate dev` tạo một file SQL trong `prisma/migrations/`. **Đừng bao giờ sửa file đã chạy** — đó là lịch sử, không phải bản nháp. Muốn đổi gì thì tạo migration mới.

---

## Xác thực: phần dễ sai nhất

### Băm mật khẩu, không mã hoá

Mã hoá (encryption) là quá trình hai chiều — có khoá thì giải ra được. Băm (hashing) là một chiều: từ chuỗi băm không lần ngược ra mật khẩu gốc. Mật khẩu **phải** băm, vì ngay cả bạn — chủ hệ thống — cũng không được phép biết mật khẩu của người dùng.

`bcrypt` còn thêm hai thứ nữa mà hàm băm thường (như SHA-256) không có:

- **Salt**: một chuỗi ngẫu nhiên trộn vào trước khi băm. Nghĩa là hai người dùng đặt cùng mật khẩu `123456` vẫn cho ra hai chuỗi băm khác nhau. Không có salt, kẻ tấn công lấy được DB chỉ cần tra bảng có sẵn là ra hàng loạt mật khẩu phổ biến.
- **Cost factor**: số vòng lặp, mặc định 10 (tức 2¹⁰ vòng). Băm chậm là *tính năng*, không phải lỗi: nó khiến việc thử hàng tỉ mật khẩu trở nên đắt đỏ.

```ts
// src/app/api/auth/register/route.ts
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const RegisterSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  // 8 ký tự là mức tối thiểu thực dụng. Đừng bắt buộc
  // "phải có ký tự đặc biệt" — nghiên cứu của NIST cho thấy
  // luật đó đẩy người dùng tới các mẫu dễ đoán như "Password1!".
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Thông báo cố tình mơ hồ. Nếu trả về "email này đã tồn tại",
    // bất kỳ ai cũng có thể dò xem một email có đăng ký hay không —
    // đó là rò rỉ quyền riêng tư, và là bước đầu của tấn công dò tài khoản.
    return NextResponse.json(
      { error: 'Không thể đăng ký với thông tin này' },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, name: name ?? null },
    // select rõ ràng: KHÔNG bao giờ để cột password lọt ra response,
    // kể cả bản đã băm.
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json(user, { status: 201 });
}
```

### Luồng đăng nhập, từng bước

```mermaid
sequenceDiagram
    participant U as Người dùng
    participant B as Trình duyệt
    participant N as NextAuth
    participant DB as PostgreSQL

    U->>B: nhập email + mật khẩu
    B->>N: POST /api/auth/callback/credentials
    N->>DB: findUnique(email)
    DB-->>N: user (kèm chuỗi băm)
    N->>N: bcrypt.compare(mật khẩu, chuỗi băm)
    alt Khớp
        N->>N: ký JWT chứa userId
        N-->>B: Set-Cookie httpOnly, chứa JWT
        B-->>U: chuyển tới /dashboard
    else Không khớp
        N-->>B: 401
        B-->>U: hiện "email hoặc mật khẩu sai"
    end
```

Chú ý cụm **httpOnly** trên cookie. Nó nghĩa là JavaScript trong trang **không đọc được** cookie đó. Nếu một script độc hại chèn được vào trang (tấn công XSS), nó vẫn không lấy được token. Đây là lý do không bao giờ lưu token trong `localStorage`: `localStorage` đọc được bằng một dòng JavaScript.

```ts
// src/lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        // Trả null cho MỌI trường hợp thất bại — không phân biệt
        // "không có user" với "sai mật khẩu". Phân biệt hai cái đó
        // là cách rò rỉ danh sách email đang tồn tại.
        if (!user) return null;

        const ok = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    // Hai callback này tồn tại vì một lý do rất cụ thể: mặc định
    // JWT của NextAuth KHÔNG chứa `id`. Không có chúng,
    // `session.user.id` là undefined, và mọi truy vấn lọc theo
    // user sẽ trả về rỗng — một bug im lặng, không lỗi nào.
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
```

Cần thêm khai báo kiểu, nếu không TypeScript sẽ báo `Property 'id' does not exist`:

```ts
// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
    };
  }
}
```

---

## Tầng API: nơi quyết định ai thấy được gì

Đây là phần quan trọng nhất của cả dự án. Đọc kỹ.

```ts
// src/app/api/todos/route.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    // ĐÂY là dòng khiến người dùng A không đọc được dữ liệu
    // của người dùng B. userId lấy từ SESSION ĐÃ KÝ, không phải
    // từ query string. Nếu lấy từ `?userId=...` thì bất kỳ ai
    // cũng sửa được URL và đọc dữ liệu người khác.
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(todos);
}

const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được rỗng').max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  const parsed = CreateTodoSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const todo = await prisma.todo.create({
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      // userId KHÔNG lấy từ body. Kể cả khi client cố gửi
      // userId của người khác, giá trị đó bị bỏ qua hoàn toàn.
      userId: session.user.id,
    },
  });

  return NextResponse.json(todo, { status: 201 });
}
```

### Vì sao phải validate hai lần

Bạn đã validate trong form ở giao diện rồi. Vì sao còn validate lại ở server?

Vì validate ở giao diện chỉ là **trải nghiệm người dùng** — nó báo lỗi ngay, không cần chờ mạng. Nó **không phải bảo mật**, bởi bất kỳ ai cũng bỏ qua được: mở DevTools, gọi thẳng `fetch('/api/todos', { method: 'POST', body: '...' })`, thế là xong. Không có trình duyệt nào tham gia.

Quy tắc: **giao diện validate để lịch sự, server validate để sống sót.**

### Route sửa và xoá: bẫy IDOR

```ts
// src/app/api/todos/[id]/route.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  const { id } = await params;   // Next.js 15: params là Promise
  const body = await req.json().catch(() => ({}));

  // updateMany chứ không phải update — và where có CẢ userId.
  //
  // Đây là chống IDOR (Insecure Direct Object Reference).
  // Nếu viết `update({ where: { id } })`, bất kỳ ai đăng nhập
  // cũng sửa được todo của người khác chỉ bằng cách đoán id.
  // Thêm userId vào where khiến truy vấn khớp 0 dòng khi id
  // không thuộc về người đang đăng nhập.
  const result = await prisma.todo.updateMany({
    where: { id, userId: session.user.id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.completed !== undefined ? { completed: Boolean(body.completed) } : {}),
      ...(body.priority !== undefined ? { priority: body.priority } : {}),
    },
  });

  if (result.count === 0) {
    // 404 chứ không phải 403. Trả 403 ("bạn không có quyền")
    // vô tình xác nhận rằng todo đó TỒN TẠI — thông tin mà
    // người không sở hữu nó không nên biết.
    return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });
  }

  const updated = await prisma.todo.findUnique({ where: { id } });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  const { id } = await params;
  const result = await prisma.todo.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
```

IDOR là lỗ hổng phổ biến nhất trong các ứng dụng CRUD tự viết, và nó *không* gây lỗi khi bạn tự test — vì bạn chỉ có một tài khoản. Cách phát hiện: tạo hai tài khoản, lấy id một todo của tài khoản A, rồi gọi `DELETE` bằng cookie của tài khoản B. Nếu xoá được, bạn vừa tìm ra lỗ hổng.

---

## Prisma Client: cái bẫy hot-reload

```ts
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

// Trong dev, Next.js nạp lại module mỗi lần bạn sửa file. Nếu
// mỗi lần nạp lại tạo một PrismaClient mới, sau vài chục lần sửa
// code bạn sẽ có vài chục connection pool, và Postgres từ chối
// kết nối mới với lỗi "too many clients already".
// Gắn instance vào globalThis khiến nó sống sót qua hot-reload.
// Ở production không làm vậy: mỗi tiến trình chỉ khởi tạo một lần.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Đây là đoạn code mà gần như mọi dự án Next.js + Prisma đều có, và gần như không ai giải thích vì sao. Giờ bạn biết.

---

## Giao diện: ranh giới Server / Client

### Trang dashboard — Server Component

```tsx
// src/app/dashboard/page.tsx
// KHÔNG có 'use client' — đây là Server Component.
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import TodoList from '@/components/TodoList';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Truy vấn chạy TRÊN SERVER, trước khi HTML được gửi đi.
  // Người dùng nhận trang đã có sẵn dữ liệu — không có
  // khoảnh khắc "loading..." nào ở lần tải đầu.
  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Công việc của {session.user.name ?? 'bạn'}</h1>
      {/* Dữ liệu đi từ server sang client qua props.
          Mọi thứ truyền qua ranh giới này phải serialize được:
          chuỗi, số, boolean, mảng, object thuần, Date.
          KHÔNG truyền được: hàm, class instance, Map, Set. */}
      <TodoList initialTodos={todos} />
    </main>
  );
}
```

### Danh sách — Client Component

```tsx
// src/components/TodoList.tsx
'use client';

import { useState, useMemo } from 'react';
import type { Todo } from '@prisma/client';

type Filter = 'all' | 'active' | 'completed';

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    return todos
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t) =>
        query.trim()
          ? t.title.toLowerCase().includes(query.trim().toLowerCase())
          : true,
      );
  }, [todos, filter, query]);

  async function toggle(todo: Todo) {
    // Cập nhật lạc quan: đổi giao diện NGAY, không chờ server.
    // Người dùng thấy phản hồi tức thì thay vì đợi 200ms.
    const previous = todos;
    setTodos((ts) =>
      ts.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)),
    );
    setPendingIds((s) => new Set(s).add(todo.id));

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
    } catch {
      // Hoàn tác khi server từ chối. Thiếu bước này, giao diện
      // và cơ sở dữ liệu sẽ nói hai chuyện khác nhau, và người
      // dùng chỉ phát hiện ra sau khi tải lại trang.
      setTodos(previous);
      alert('Không lưu được thay đổi. Vui lòng thử lại.');
    } finally {
      setPendingIds((s) => {
        const next = new Set(s);
        next.delete(todo.id);
        return next;
      });
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm công việc..."
          className="flex-1 rounded-lg border px-3 py-2 dark:bg-slate-800"
        />
        {(['all', 'active', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-2 text-sm ${
              filter === f ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            {f === 'all' ? 'Tất cả' : f === 'active' ? 'Chưa xong' : 'Đã xong'}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          {query ? 'Không tìm thấy công việc nào.' : 'Chưa có công việc nào. Thêm một cái đi!'}
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                pendingIds.has(todo.id) ? 'opacity-60' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggle(todo)}
                disabled={pendingIds.has(todo.id)}
                className="h-5 w-5"
              />
              <span className={todo.completed ? 'line-through text-slate-500' : ''}>
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Ba chi tiết đáng chú ý ở component trên, và cả ba đều là thứ phân biệt code người mới với code người đã làm sản phẩm thật:

1. **Cập nhật lạc quan có hoàn tác.** Rất nhiều hướng dẫn dạy phần "đổi giao diện ngay" mà quên phần "trả lại khi thất bại".
2. **`pendingIds` là một `Set`, không phải một `boolean`.** Người dùng bấm ba checkbox liên tiếp — với một biến `loading` chung, cả ba đều mờ đi. Với `Set`, chỉ đúng cái đang gửi bị khoá.
3. **Trạng thái rỗng phân biệt hai trường hợp.** "Chưa có gì" và "tìm không ra" là hai tình huống khác nhau và cần hai câu khác nhau.

---

## Middleware: chặn ở cửa

```ts
// src/middleware.ts
export { auth as middleware } from '@/lib/auth';

export const config = {
  // Matcher chạy TRƯỚC khi trang được render, ở tầng edge.
  // Nó không thay thế việc kiểm tra trong Route Handler —
  // nó chỉ tránh việc render cả một trang rồi mới phát hiện
  // người dùng chưa đăng nhập.
  matcher: ['/dashboard/:path*'],
};
```

Điểm cần nhớ: **middleware là tối ưu trải nghiệm, không phải lớp bảo mật duy nhất.** Route Handler vẫn phải tự kiểm tra session. Nếu chỉ dựa vào middleware, một lỗi cấu hình matcher là đủ để mở toang toàn bộ API.

---

## Kiểm thử

Viết test cho dự án đầu tiên nghe như thừa. Nhưng đúng ba bài test dưới đây bắt được đúng những lỗi mà bạn không tự thấy khi bấm tay.

```ts
// tests/todos.api.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('phân tách dữ liệu giữa các người dùng', () => {
  let userA: { id: string }, userB: { id: string }, todoOfA: { id: string };

  beforeEach(async () => {
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();
    userA = await prisma.user.create({
      data: { email: 'a@test.dev', password: 'x' },
      select: { id: true },
    });
    userB = await prisma.user.create({
      data: { email: 'b@test.dev', password: 'x' },
      select: { id: true },
    });
    todoOfA = await prisma.todo.create({
      data: { title: 'việc của A', userId: userA.id },
      select: { id: true },
    });
  });

  it('B không sửa được todo của A', async () => {
    const result = await prisma.todo.updateMany({
      where: { id: todoOfA.id, userId: userB.id },
      data: { title: 'bị chiếm' },
    });
    expect(result.count).toBe(0);
  });

  it('B không xoá được todo của A', async () => {
    const result = await prisma.todo.deleteMany({
      where: { id: todoOfA.id, userId: userB.id },
    });
    expect(result.count).toBe(0);
    expect(await prisma.todo.count()).toBe(1);
  });

  it('xoá user thì todo của họ biến mất theo', async () => {
    await prisma.user.delete({ where: { id: userA.id } });
    expect(await prisma.todo.count({ where: { userId: userA.id } })).toBe(0);
  });
});
```

Bài test thứ ba kiểm tra `onDelete: Cascade` — thứ bạn khai báo trong schema nhưng chưa bao giờ thấy chạy. Nó cũng là cách phát hiện khi ai đó (có thể là chính bạn, sáu tháng sau) vô tình bỏ mất `Cascade` trong một lần sửa schema.

---

## Đưa lên production

### Biến môi trường

Ba biến, và không cái nào được commit:

```bash
# .env.local — file này PHẢI nằm trong .gitignore
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."          # sinh bằng: openssl rand -base64 32
AUTH_URL="http://localhost:3000"
```

`AUTH_SECRET` là khoá dùng để **ký** JWT. Ai có nó thì tự tạo được token hợp lệ cho bất kỳ tài khoản nào — nghĩa là chiếm được mọi tài khoản trong hệ thống. Rò rỉ khoá này nghiêm trọng hơn rò rỉ cả cơ sở dữ liệu mật khẩu đã băm.

Kiểm tra `.gitignore` **trước** lần commit đầu tiên:

```bash
git check-ignore -v .env.local
# Có output = đang được bỏ qua đúng cách. Không có output = NGUY HIỂM.
```

Nếu đã lỡ commit: đổi khoá ngay. Xoá file khỏi commit sau không đủ — nó vẫn nằm trong lịch sử Git và bất kỳ ai clone repo đều đọc được.

### Deploy lên Vercel

```bash
npm i -g vercel
vercel link
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
vercel --prod
```

Migration trên production chạy bằng `migrate deploy`, **không** phải `migrate dev`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

Khác biệt quan trọng: `migrate dev` có thể *tạo mới* migration và trong vài tình huống sẽ đề nghị reset cả database. Trên production, reset database nghĩa là mất toàn bộ dữ liệu người dùng. `migrate deploy` chỉ áp dụng những migration đã có sẵn trong repo, không bao giờ tự sinh và không bao giờ reset.

---

## Những cái bẫy đã được ghi lại

| Triệu chứng | Nguyên nhân thật | Cách sửa |
|---|---|---|
| `session.user.id` là `undefined` | JWT mặc định không mang `id` | Thêm callback `jwt` và `session` |
| `too many clients already` | Mỗi lần hot-reload tạo một PrismaClient | Gắn instance vào `globalThis` |
| Người dùng thấy dữ liệu người khác | `where` thiếu `userId` | Luôn kèm `userId` từ session |
| Sửa được todo người khác qua Postman | Dùng `update` thay vì `updateMany` có `userId` | Đổi sang `updateMany` / `deleteMany` |
| Build lỗi `PrismaClient is unable to run in browser` | Import `prisma` vào Client Component | Chỉ import trong Server Component / Route Handler |
| Trang trắng sau khi deploy | Thiếu biến môi trường trên Vercel | `vercel env ls` để đối chiếu |
| `Type error: params.id` | Next.js 15 đổi `params` thành `Promise` | `const { id } = await params` |

---

## Khi nào coi như xong

Không phải khi code chạy. Là khi cả bảy điều dưới đây đều đúng:

- [ ] Tạo hai tài khoản, xác nhận tài khoản này không thấy — và không sửa được — dữ liệu tài khoản kia, kiểm bằng `curl` chứ không phải bằng giao diện
- [ ] Gọi API không kèm cookie, nhận đúng 401 chứ không phải 500
- [ ] Gửi `title` rỗng và `title` dài 10.000 ký tự, cả hai đều bị từ chối với 400
- [ ] Tắt mạng giữa lúc tick checkbox, giao diện trả về trạng thái cũ chứ không kẹt sai
- [ ] `git log -p | grep -i "AUTH_SECRET"` không ra kết quả nào
- [ ] Ứng dụng chạy trên tên miền thật, mở được trên điện thoại
- [ ] README có ảnh chụp màn hình và hướng dẫn chạy lại từ đầu trên máy trắng

Điều cuối cùng đáng giá hơn bạn nghĩ: người tuyển dụng mở repo, đọc README, và quyết định trong ba mươi giây. Một README có ảnh và ba dòng lệnh chạy được thắng một dự án hay hơn nhưng không ai chạy nổi.

---

## Bước tiếp theo

Khi ứng dụng này chạy ổn, hai hướng mở rộng đáng làm — cả hai đều dẫn thẳng vào dự án tiếp theo trong lộ trình:

1. **Chia sẻ danh sách cho nhiều người.** Thêm bảng `TodoListMember`, và đột nhiên câu hỏi "ai được đọc cái gì" không còn trả lời được bằng một cột `userId` nữa. Đó là bước đầu tiên vào phân quyền thật.
2. **Đồng bộ thời gian thực.** Hai thiết bị cùng mở một danh sách, tick ở máy này thì máy kia đổi theo. Đó là bài toán mà [Real-Time Chat App](/projects/real-time-chat-app-1-1) giải quyết trọn vẹn với WebSocket.
