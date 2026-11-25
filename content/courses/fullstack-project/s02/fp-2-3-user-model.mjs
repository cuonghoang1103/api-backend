/**
 * 2.3 — Model User và API health-check (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (PostgreSQL 18.7 container fsp-pg, Prisma 7.10.1 + adapter-pg, Express 5.3.0, Node 22.22.2), repo chiase tag ch2.
 * Phát hiện thật 24/11: @default(uuid(7)) sinh id phía ứng dụng ⇒ INSERT bằng psql lỗi NOT NULL; CHECK viết tay trong migration --create-only
 * không bị Prisma đòi xoá ("Already in sync"); lỗi Prisma P2002 (unique) và P2039 (CHECK, mã PG 23514); omit toàn cục giấu passwordHash;
 * docker pause ⇒ SELECT 1 trên kết nối có sẵn trong pool TREO dù connectionTimeoutMillis=3000 (curl chờ 30 s) ⇒ hạn chót 2 s ⇒ 503 sau 2,009 s;
 * client bỏ đi thì res 'finish' không bắn ⇒ log bằng 'close'; lỗi kết nối Prisma 7 có message rỗng, nguyên nhân ở e.code (ECONNREFUSED).
 * Sự cố có nguồn (GET 200, 24/11/2026): The Verge 03/05/2018 — Twitter ghi mật khẩu chưa băm vào log nội bộ.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const SCHEMA = `// Lược đồ ChiaSe — viết theo docs/schema-nhap.sql (Chương 1). Tên model/trường kiểu TypeScript (camelCase),
// tên bảng/cột trong PostgreSQL kiểu SQL (snake_case) nhờ @@map/@map.

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id           String   @id @default(dbgenerated("uuidv7()")) @db.Uuid
  /// Luôn lưu chữ thường (service chuẩn hoá trước khi ghi) — CHECK trong migration chặn nếu quên
  email        String   @unique
  passwordHash String   @map("password_hash")
  displayName  String   @map("display_name") @db.VarChar(50)
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@map("users")
}`;

const OUT_PSQL_THU = `$ docker exec fsp-pg psql -U chiase -c "INSERT INTO users (email, password_hash, display_name) VALUES ('an@mail.com', 'x', 'An')"
ERROR:  null value in column "id" of relation "users" violates not-null constraint
DETAIL:  Failing row contains (null, an@mail.com, x, An, 2026-11-24 12:00:08.828394+00).
$ docker exec fsp-pg psql -U chiase -c "INSERT INTO users (id, email, password_hash, display_name) VALUES (uuidv7(), 'An@Mail.com', 'x', 'An'), (uuidv7(), 'an@mail.com', 'x', 'An 2')"
INSERT 0 2`;

const OUT_CREATE_ONLY = `$ npx prisma migrate dev --create-only --name users_db_defaults

Prisma Migrate created the following migration without applying it 20261124120015_users_db_defaults

You can now edit it and apply it by running prisma migrate dev.`;

const MIGRATION_2 = `-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuidv7();

-- Viết tay: Prisma schema không diễn tả được CHECK. Email phải lưu chữ thường ⇒ unique trên email
-- đủ để "An@Mail.com" và "an@mail.com" không thành hai tài khoản (service chuẩn hoá trước khi ghi).
ALTER TABLE "users" ADD CONSTRAINT "users_email_lowercase_chk" CHECK ("email" = lower("email"));`;

const OUT_MIGRATE_CHECK = `$ npx prisma migrate dev

Applying migration \`20261124120015_users_db_defaults\`

The following migration(s) have been applied:

migrations/
  └─ 20261124120015_users_db_defaults/
    └─ migration.sql

Your database is now in sync with your schema.

$ npx prisma migrate dev     # chạy lại: Prisma có đòi xoá CHECK không?

Already in sync, no schema change or pending migration was found.`;

const OUT_PSQL_CHECK = `$ docker exec fsp-pg psql -U chiase -c "INSERT INTO users (email, password_hash, display_name) VALUES ('An@Mail.com', 'x', 'An')"
ERROR:  new row for relation "users" violates check constraint "users_email_lowercase_chk"
DETAIL:  Failing row contains (01a20d6d-c3fe-7aaf-9f8d-07bb99303fdd, An@Mail.com, x, An, 2026-11-24 12:00:27.134011+00).
$ docker exec fsp-pg psql -U chiase -c "INSERT INTO users (email, password_hash, display_name) VALUES ('an@mail.com', 'x', 'An') RETURNING id"
                  id                  
--------------------------------------
 01a20d6d-c451-71e9-8d47-7a8cae9a3a65
(1 row)

INSERT 0 1`;

const OUT_LOI_USER = `$ npx tsx --env-file=.env src/thu-loi-user.ts
create(an@chiase.dev) ⇒ {
  name: 'PrismaClientKnownRequestError',
  code: 'P2002',
  meta: {
    driverAdapterError: DriverAdapterError: UniqueConstraintViolation { … }
    modelName: 'User'
  },
  message: 'Unique constraint failed on the constraint: \`users_email_key\`'
}
create(An@ChiaSe.dev) ⇒ {
  name: 'PrismaClientKnownRequestError',
  code: 'P2039',
  meta: {
    modelName: 'User',
    driverAdapterError: DriverAdapterError: new row for relation "users" violates check constraint "users_email_lowercase_chk" { … }
  },
  message: 'Database error. Code: \`23514\`. Message: \`new row for relation "users" violates check constraint "users_email_lowercase_chk"\`'
}
findUnique (omit toàn cục): [ 'id', 'email', 'displayName', 'createdAt' ]
findUnique + omit:{passwordHash:false}: [ 'id', 'email', 'passwordHash', 'displayName', 'createdAt' ]`;

const DB_PRISMA = `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { config } from '../config.js';

// MỘT PrismaClient cho cả tiến trình (nó giữ một pool kết nối). Tạo mới mỗi request ⇒ cạn kết nối Postgres.
const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
  max: 10, // tối đa 10 kết nối trong pool
  connectionTimeoutMillis: 3_000, // mặc định của pg là 0 = chờ MÃI nếu CSDL treo
});
// omit toàn cục: KHÔNG truy vấn nào trả passwordHash, trừ khi chủ động ghi omit: { passwordHash: false } (chỉ lúc đăng nhập).
export const prisma = new PrismaClient({ adapter, omit: { user: { passwordHash: true } } });`;

const SEED = `// Dữ liệu mẫu cho máy dev: npx prisma db seed (chạy lại nhiều lần vẫn ra cùng kết quả — upsert theo email).
import { prisma } from '../src/db/prisma.js';

// "!" không phải mã băm hợp lệ của thuật toán nào ⇒ không ai đăng nhập được bằng tài khoản mẫu cho tới Chương 3.
const KHOA = '!';
const mau = [
  { email: 'an@chiase.dev', displayName: 'An Nguyễn' },
  { email: 'binh@chiase.dev', displayName: 'Bình Trần' },
];

for (const u of mau) {
  const kq = await prisma.user.upsert({
    where: { email: u.email },
    update: { displayName: u.displayName },
    create: { ...u, passwordHash: KHOA },
  });
  console.log('seed:', kq);
}
await prisma.$disconnect();`;

const OUT_SEED = `$ npx prisma db seed
Running seed command \`tsx prisma/seed.ts\` ...
seed: {
  id: '01a20d70-9a53-7f1f-a3f1-d1d94cfd0152',
  email: 'an@chiase.dev',
  displayName: 'An Nguyễn',
  createdAt: 2026-11-24T12:03:33.024Z
}
seed: {
  id: '01a20d70-9a5f-7cd1-b357-1fdd2c040645',
  email: 'binh@chiase.dev',
  displayName: 'Bình Trần',
  createdAt: 2026-11-24T12:03:33.086Z
}

🌱  The seed command has been executed.
$ npx prisma db seed     # chạy lần hai
(vẫn 2 dòng seed, không lỗi trùng)
      email      | display_name | password_hash 
-----------------+--------------+---------------
 an@chiase.dev   | An Nguyễn    | !
 binh@chiase.dev | Bình Trần    | !
(2 rows)`;

const OUT_HEALTH_DAU = `$ curl -s localhost:41815/api/health
{"status":"ok","db":"ok","dbMs":127,"uptimeS":3}
$ docker stop fsp-pg
fsp-pg
$ curl -s -w "  [HTTP %{http_code}, %{time_total}s]\\n" localhost:41815/api/health
{"status":"loi","db":"loi","dbMs":62,"uptimeS":4}  [HTTP 503, 0.065914s]
$ docker start fsp-pg
fsp-pg
$ curl -s localhost:41815/api/health
{"status":"ok","db":"ok","dbMs":48,"uptimeS":7}`;

const OUT_HEALTH_TREO = `$ docker pause fsp-pg      # CSDL treo: nhận kết nối nhưng không trả lời
fsp-pg
$ curl -s -m 30 -w "  [HTTP %{http_code}, %{time_total}s]\\n" localhost:41815/api/health
  [HTTP 000, 30.002397s]`;

const HEALTH_SERVICE = `import { prisma } from '../db/prisma.js';

const HAN_MS = 2_000;

// "Sống" chưa đủ — phải "dùng được": API mà mất CSDL thì mọi request thật đều hỏng.
// Có HẠN CHÓT: CSDL treo (nhận kết nối nhưng không trả lời) thì SELECT 1 chờ mãi — health check không được treo theo.
export async function kiemSucKhoe() {
  const batDau = performance.now();
  let hen: NodeJS.Timeout | undefined;
  const quaHan = new Promise&lt;never&gt;((_, reject) =&gt; {
    hen = setTimeout(() =&gt; reject(new Error(\`CSDL không trả lời sau \${HAN_MS} ms\`)), HAN_MS);
  });
  try {
    await Promise.race([prisma.$queryRaw\`SELECT 1\`, quaHan]);
    return { ok: true as const, db: 'ok', dbMs: Math.round(performance.now() - batDau) };
  } catch (e) {
    // Lỗi kết nối của Prisma 7 + adapter-pg: message gần như rỗng, nguyên nhân thật nằm ở e.code (vd ECONNREFUSED)
    const chiTiet = e instanceof Error &amp;&amp; 'code' in e &amp;&amp; e.code ? e.code : e instanceof Error ? e.message : e;
    console.error('[health] CSDL lỗi:', chiTiet);
    return { ok: false as const, db: 'loi', dbMs: Math.round(performance.now() - batDau) };
  } finally {
    clearTimeout(hen);
  }
}`;

const HEALTH_CONTROLLER = `import type { Request, Response } from 'express';
import { kiemSucKhoe } from '../services/health.service.js';

// 200 khi khoẻ, 503 khi CSDL hỏng — máy cân bằng tải/Docker/uptime monitor chỉ nhìn MÃ TRẠNG THÁI.
export async function getHealth(_req: Request, res: Response) {
  const k = await kiemSucKhoe();
  res.status(k.ok ? 200 : 503).json({
    status: k.ok ? 'ok' : 'loi',
    db: k.db,
    dbMs: k.dbMs,
    uptimeS: Math.round(process.uptime()),
  });
}`;

const OUT_HEALTH_HAN = `$ curl -s localhost:41815/api/health
{"status":"ok","db":"ok","dbMs":126,"uptimeS":3}
$ docker pause fsp-pg
fsp-pg
$ curl -s -m 30 -w "  [HTTP %{http_code}, %{time_total}s]\\n" localhost:41815/api/health
{"status":"loi","db":"loi","dbMs":2007,"uptimeS":5}  [HTTP 503, 2.009148s]
$ curl -s -m 1 localhost:41815/api/health    # client chỉ chờ 1 giây rồi bỏ
(curl: mã thoát 28)
$ docker unpause fsp-pg
fsp-pg
$ curl -s localhost:41815/api/health
{"status":"ok","db":"ok","dbMs":2,"uptimeS":10}
$ docker stop fsp-pg
fsp-pg
$ curl -s -w "  [HTTP %{http_code}, %{time_total}s]\\n" localhost:41815/api/health
{"status":"loi","db":"loi","dbMs":5,"uptimeS":10}  [HTTP 503, 0.006369s]`;

const OUT_HEALTH_LOG = `API ChiaSe đang nghe http://localhost:41815 (cho phép web http://localhost:41811)
2026-11-24T12:02:37.076Z GET /api/health 200 132.2ms
[health] CSDL lỗi: CSDL không trả lời sau 2000 ms
2026-11-24T12:02:39.136Z GET /api/health 503 2008.0ms
2026-11-24T12:02:40.149Z GET /api/health CLIENT_BO_DI 1002.6ms
[health] CSDL lỗi: CSDL không trả lời sau 2000 ms
2026-11-24T12:02:43.206Z GET /api/health 200 3.0ms
[health] CSDL lỗi: Invalid \`prisma.$queryRaw()\` invocation:`;

const OUT_ECODE = `# CSDL tắt hẳn (docker stop) — trước khi sửa, log chỉ có:
[health] CSDL lỗi: Invalid \`prisma.$queryRaw()\` invocation:
# in thử đối tượng lỗi:
{ name: 'PrismaClientKnownRequestError', code: 'ECONNREFUSED', meta: undefined, cause: undefined,
  message: '\\nInvalid \`prisma.$queryRaw()\` invocation:\\n\\n\\n' }
# sau khi log e.code:
[health] CSDL lỗi: ECONNREFUSED
2026-11-24T12:03:08.744Z GET /api/health 503 139.2ms`;

const LOG_REQUEST = `import type { NextFunction, Request, Response } from 'express';

// Một dòng mỗi request, ghi KHI KẾT THÚC để biết mã trạng thái và thời gian.
// Dùng 'close' (không dùng 'finish'): client bỏ đi giữa chừng thì 'finish' KHÔNG bao giờ bắn ⇒ request treo biến mất khỏi log.
// KHÔNG ghi body/header: body có mật khẩu, header có token.
export function logRequest(req: Request, res: Response, next: NextFunction) {
  const batDau = performance.now();
  res.on('close', () =&gt; {
    const ms = (performance.now() - batDau).toFixed(1);
    const ma = res.writableFinished ? String(res.statusCode) : 'CLIENT_BO_DI';
    console.log(\`\${new Date().toISOString()} \${req.method} \${req.originalUrl} \${ma} \${ms}ms\`);
  });
  next();
}`;

const SERVER = `import { config } from './config.js';
import { taoApp } from './app.js';
import { prisma } from './db/prisma.js';

const app = taoApp();
// Express 5: nếu mở cổng thất bại (cổng bị chiếm, không có quyền…), lỗi được TRUYỀN VÀO callback này.
const server = app.listen(config.port, (err?: Error) =&gt; {
  if (err) {
    console.error(\`Không mở được cổng \${config.port}: \${err.message}\`);
    process.exit(1);
  }
  console.log(\`API ChiaSe đang nghe http://localhost:\${config.port} (cho phép web \${config.webOrigin})\`);
});

// Tắt êm: Ctrl+C (SIGINT) hoặc docker stop (SIGTERM) ⇒ ngừng nhận request mới, chờ request đang chạy, đóng pool CSDL.
for (const tinHieu of ['SIGINT', 'SIGTERM'] as const) {
  process.once(tinHieu, () =&gt; {
    console.log(\`Nhận \${tinHieu}, đang tắt…\`);
    server.close(async () =&gt; {
      await prisma.$disconnect();
      console.log('Đã đóng HTTP và kết nối CSDL.');
      process.exit(0);
    });
  });
}`;

const OUT_TAT_EM = `$ npm run dev -w apps/api
API ChiaSe đang nghe http://localhost:41815 (cho phép web http://localhost:41811)
2026-11-24T12:03:08.744Z GET /api/health 503 139.2ms
^C
Nhận SIGINT, đang tắt…
Đã đóng HTTP và kết nối CSDL.`;

const THE = [
  lienKet({ khoa: 'prisma-orm', bai: 'pr-2-2-thuoc-tinh-truong', title: 'Prisma ORM 2.2 — Thuộc tính trường: đủ mọi @', sub: '@id, @default, @unique, @map, @db.* — từng cái một.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-6-3-viet-tay', title: 'Prisma ORM 6.3 — Migration viết tay', sub: '--create-only và những gì schema.prisma không nói được.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-9-4-connection-pool', title: 'Prisma ORM 9.4 — Connection pool, tính bằng số học', sub: 'Chọn max của pool bằng con số, không đoán.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-15-6-health-check-canh-bao', title: 'Node.js 15.6 — Health check, cảnh báo, và chuyện bị gọi dậy lúc 3 giờ sáng', sub: 'Liveness vs readiness, cảnh báo đúng chỗ.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📰', 'The Verge (03/05/2018) — Twitter password bug', 'Lỗi khiến mật khẩu được ghi dạng chữ thường vào log nội bộ trước khi băm; Twitter khuyên cả 330 triệu người dùng đổi mật khẩu.', 'https://www.theverge.com/2018/5/3/17316684/twitter-password-bug-security-flaw-exposed-change-now'),
  nguon('📘', 'Prisma Docs — Excluding fields (omit)', 'omit theo truy vấn và omit toàn cục khi tạo PrismaClient.', 'https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields'),
  nguon('📘', 'Prisma Docs — Error reference', 'Bảng mã lỗi P2002, P2039…', 'https://www.prisma.io/docs/orm/reference/error-reference'),
  nguon('📘', 'PostgreSQL 18 — UUID functions', 'uuidv7(): UUID có tiền tố thời gian, sắp xếp được.', 'https://www.postgresql.org/docs/18/functions-uuid.html'),
].join('\n');

const MERMAID = `sequenceDiagram
  participant M as Uptime monitor / Docker
  participant A as API /api/health
  participant P as Pool pg
  participant D as PostgreSQL
  M->>A: GET /api/health
  A->>P: SELECT 1 (hạn chót 2 s)
  alt CSDL trả lời
    P->>D: SELECT 1
    D-->>A: 1
    A-->>M: 200 {"db":"ok"}
  else tắt hẳn / treo quá 2 s
    A-->>M: 503 {"db":"loi"}
  end`;

export default {
  title: '2.3 — The User model and a health-check API|||2.3 — Model User và API health-check',
  slug: 'fp-2-3-user-model',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Model User từng thuộc tính; id do CSDL sinh (uuidv7) thay vì ứng dụng; email không phân biệt hoa thường bằng CHECK viết tay trong migration; mã lỗi P2002/P2039; omit toàn cục để passwordHash không bao giờ lọt ra; seed chạy lại được; /api/health kiểm CSDL thật với hạn chót (bẫy thật: CSDL "treo" làm health check treo 30 giây); log request bằng sự kiện close; tắt êm — kèm vụ Twitter 2018 ghi mật khẩu vào log.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · User & health</span>
<h2>A User table the database itself protects, and a health check that tells the truth even when the database hangs</h2>
<p class="lead">Two jobs in this lesson. First, finish the <code>User</code> model so that the database — not only your code — guarantees the rules: an id even for rows inserted by hand, one account per email regardless of capital letters, and a password hash that never appears in an API response. Second, give the API a <code>/api/health</code> endpoint that a monitor can trust, plus a one-line request log and a clean shutdown. While testing we found the database can fail in a way that made our first health check hang for 30 seconds; you will see the output and the fix.</p>

<h3>Everyday picture: the check-up</h3>
<p>A nurse does not only check that you are breathing ("the process is alive"); she asks you to squeeze her hand ("can you actually do your job?"). And if you do not answer within a few seconds, she does not stand there forever — she writes "unresponsive" and calls the doctor. <code>/api/health</code> is that check-up: <strong>alive and able</strong>, with a <strong>deadline</strong>.</p>

<h3>Part A — The User model, attribute by attribute</h3>
<pre><code class="language-prisma">${SCHEMA}</code></pre>
<table>
<thead><tr><th>Piece</th><th>Meaning</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>@id … @db.Uuid</code></td><td>Primary key stored as PostgreSQL <code>uuid</code> (16 bytes), not text (36+ bytes)</td><td>Smaller indexes; the type rejects garbage ids</td></tr>
<tr><td><code>@default(dbgenerated("uuidv7()"))</code></td><td>The <strong>database</strong> generates the id with PostgreSQL 18's <code>uuidv7()</code></td><td>Explained below — it replaced <code>uuid(7)</code></td></tr>
<tr><td><code>email String @unique</code></td><td>Unique index <code>users_email_key</code></td><td>One account per email; enables <code>findUnique({ where: { email } })</code></td></tr>
<tr><td><code>@map("password_hash")</code></td><td>Column name in SQL style</td><td>The table reads naturally in psql and in reports</td></tr>
<tr><td><code>@db.VarChar(50)</code></td><td>Length limit enforced by the database</td><td>Your validation (Chapter 5) can forget; the column cannot</td></tr>
<tr><td><code>@db.Timestamptz</code></td><td>Timestamp <em>with time zone</em></td><td>Stored in UTC, displayed per client — no "7-hour bug" between Vietnam and the server</td></tr>
</tbody>
</table>

<h4>Weakness 1 — an id only Prisma could create</h4>
<p>The first version used <code>@default(uuid(7))</code>. That generates the UUID <em>inside Prisma Client</em>, so the migration has no default at all (<code>"id" UUID NOT NULL</code>). The day someone inserts a row with psql, a SQL script or another service:</p>
<div class="out">${OUT_PSQL_THU}</div>
<p>The first insert fails for the id. The second one shows <strong>weakness 2</strong>: <code>An@Mail.com</code> and <code>an@mail.com</code> were both accepted — two accounts for one mailbox. Someone could register a "different" account with your email in capitals, and "forgot password" would behave unpredictably.</p>

<h4>The fix — a migration with hand-written SQL</h4>
<p>We switched the id to <code>dbgenerated("uuidv7()")</code>, then asked Prisma for the migration <em>without applying it</em>, so we could add what <code>schema.prisma</code> cannot express — a <code>CHECK</code> constraint:</p>
<div class="out">${OUT_CREATE_ONLY}</div>
<pre><code class="language-sql">${MIGRATION_2}</code></pre>
<div class="out">${OUT_MIGRATE_CHECK}</div>
<div class="out">${OUT_PSQL_CHECK}</div>
<p>Three things to notice. Prisma did <strong>not</strong> try to remove our CHECK on the next run ("Already in sync") — it does not model CHECK constraints, so it leaves them alone. Mixed-case emails are now impossible at the lowest level. And the id is generated by the database even for psql.</p>
<p>Why "store lowercase + CHECK" and not a unique index on <code>lower(email)</code> (our SQL draft in 1.2)? Prisma cannot describe expression indexes either, and with a plain <code>@unique</code> on an already-lowercase column, <code>findUnique({ where: { email } })</code> keeps working. The cost is one line in the service: <code>email.trim().toLowerCase()</code> before every write and every lookup (Chapter 3). The <code>citext</code> extension is another valid answer you may meet at work.</p>

<h4>What the errors look like from the code</h4>
<div class="out">${OUT_LOI_USER}</div>
<ul>
<li><strong>P2002</strong> = unique constraint violated. Chapter 3 turns it into a <em>generic</em> answer for register (not "this email exists" — that would let anyone test which emails have accounts).</li>
<li><strong>P2039</strong> + PostgreSQL code <code>23514</code> = a CHECK failed. If you ever see it in production, a code path forgot to lowercase — it is a bug, so it becomes a 500 and a log line, not a message to the user.</li>
<li>The last two lines show the safety net we added to the client: <strong>global omit</strong>.</li>
</ul>
<pre><code class="language-ts">${DB_PRISMA}</code></pre>
<p>With <code>omit: { user: { passwordHash: true } }</code> every query on User leaves the hash out unless the code explicitly asks for it (<code>omit: { passwordHash: false }</code>) — which only the login service will do. The classic leak "<code>res.json(user)</code> sent the password hash to the browser" is now impossible by default instead of avoided by memory.</p>

<h4>Seed data that can run twice</h4>
<pre><code class="language-ts">${SEED}</code></pre>
<div class="out">${OUT_SEED}</div>
<p><code>upsert</code> makes the seed <em>idempotent</em>: running it again updates instead of failing on the unique email. The password hash <code>!</code> is not a valid hash for any algorithm, so these accounts cannot log in until Chapter 3 gives them real passwords — the same trick Linux uses to lock an account. The seed command is declared in <code>prisma.config.ts</code>: <code>migrations: { path: 'prisma/migrations', seed: 'tsx prisma/seed.ts' }</code>.</p>

<h3>Part B — <code>/api/health</code></h3>
<pre><code class="language-mermaid">${MERMAID}</code></pre>
<p>Monitors (UptimeRobot, Docker's <code>HEALTHCHECK</code> in Chapter 9, a load balancer) read only the <strong>status code</strong>. So the contract is: 200 when the API can do real work, 503 ("Service Unavailable") when it cannot. A first version — controller, plus a service that runs <code>SELECT 1</code> — gave:</p>
<div class="out">${OUT_HEALTH_DAU}</div>
<p>Database stopped → 503 in 66 ms, database back → 200. Then we simulated the nastier failure: a database that <em>accepts</em> connections but never answers (overloaded server, network black hole, a long lock). <code>docker pause</code> freezes the container's processes:</p>
<div class="out">${OUT_HEALTH_TREO}</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>connectionTimeoutMillis</code> does not protect a query.</strong> We had set 3,000 ms in the pool, yet the request hung until curl gave up after 30 s (HTTP 000 = no answer at all). The pool already had an open connection from the first check, so no new connection was needed and the timeout never applied; <code>SELECT 1</code> was sent and waited forever. A health check that hangs is worse than one that fails: the monitor's own timeout fires and reports "unknown", and every hanging check holds a socket.</p></div>
<p>The fix is a deadline in the health service itself:</p>
<pre><code class="language-ts">${HEALTH_SERVICE}</code></pre>
<pre><code class="language-ts">${HEALTH_CONTROLLER}</code></pre>
<div class="out">${OUT_HEALTH_HAN}</div>
<p>Paused database → a clean 503 after 2.009 s. After <code>unpause</code> the same pooled connection answers in 2 ms. And the log, written by the middleware below:</p>
<div class="out">${OUT_HEALTH_LOG}</div>
<p>Look at the last two log lines: when the database was stopped, Prisma's error message was useless (<code>Invalid \`prisma.$queryRaw()\` invocation:</code> followed by blank lines). Printing the error object showed where the cause really was:</p>
<div class="out">${OUT_ECODE}</div>
<p>That is why the service logs <code>e.code</code> first. A log line that does not tell you <em>why</em> costs you an hour at 3 a.m.</p>
<p><strong>Liveness vs readiness.</strong> Kubernetes and some platforms distinguish "is the process alive?" (restart it if not) from "can it serve traffic?" (stop sending requests if not). Our <code>/api/health</code> is a readiness check. Never let a <em>liveness</em> check depend on the database: if the database goes down, the platform would restart every API instance in a loop, which fixes nothing.</p>

<h3>Part C — One log line per request</h3>
<pre><code class="language-ts">${LOG_REQUEST}</code></pre>
<p>Our first version listened to <code>'finish'</code>. During the "paused database" test the client gave up and that request <strong>never appeared in the log</strong> — <code>'finish'</code> fires only when the response is fully sent. <code>'close'</code> fires in both cases; <code>res.writableFinished</code> tells them apart, which is how the line <code>GET /api/health CLIENT_BO_DI 1002.6ms</code> above exists. The slow, abandoned requests are exactly the ones you need to see.</p>

<h3>⚠️ Real incident: passwords in the log — Twitter, 2018</h3>
<p>In May 2018 Twitter asked all of its roughly 330 million users to change their passwords: a bug had written passwords in plain text to an <strong>internal log</strong> before the hashing step, so the hashing that protected the database did not protect the log (The Verge, 03/05/2018). Twitter said it found no evidence of misuse — but logs are copied to log services, backups and laptops, and are read by far more people than the database. That is why our logger writes method, URL, status and duration, and <strong>never the body or the headers</strong> (body = passwords, headers = tokens). Chapter 3 will be tempted to <code>console.log(req.body)</code> while debugging register; do it, then delete it before committing.</p>

<h3>Part D — Shutting down cleanly</h3>
<pre><code class="language-ts">${SERVER}</code></pre>
<div class="out">${OUT_TAT_EM}</div>
<p><code>docker stop</code> (Chapter 9) sends SIGTERM and waits 10 seconds before killing. Without a handler, requests in progress are cut and database connections are dropped without goodbye; with it, the server stops accepting new connections, lets running requests finish, then closes the pool.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">logRequest</span><span class="lz-d">starts the timer, logs on 'close' — even if the client leaves</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">GET /api/health → controller</span><span class="lz-d">calls kiemSucKhoe()</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">SELECT 1 vs 2 s deadline</span><span class="lz-d">whichever settles first wins</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">200 or 503</span><span class="lz-d">status code is the contract; body helps humans</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">SIGTERM</span><span class="lz-d">server.close → $disconnect → exit 0</span></div>
</div>

<h3>On the job</h3>
<p>On a real project, the first question in an incident call is "what does health say?", and the second is "show me the log for that request". Teams that wrote both carefully answer in minutes. A common OJT task is exactly this lesson in reverse: "the health endpoint returns 200 but users get errors" — because it only checked that the process was alive. Another common review comment: "don't return the entity from the controller" — global omit is your belt-and-braces answer.</p>

${spring(true, 'Spring Boot Actuator gives you /actuator/health with a database indicator out of the box (and the same need for timeouts and for not exposing details publicly); seed data is usually a Flyway migration or a CommandLineRunner; JPA uses @Column(name=…) where Prisma uses @map.', [
  ['sb-15-1-actuator', 'Spring Boot 15.1 — Spring Boot Actuator, safely'],
  ['sb-8-3-seed-data', 'Spring Boot 8.3 — Loading initial reference data'],
  ['sb-6-1-entity-repository', 'Spring Boot 6.1 — Entities and repositories'],
])}

<h3>🎤 Interview corner</h3>
<ol>
<li><strong>"How do you make emails unique case-insensitively?"</strong> — Normalise to lowercase before write and lookup, plus a DB guarantee: CHECK + unique, a unique index on <code>lower(email)</code>, or <code>citext</code>. Code alone is not a guarantee.</li>
<li><strong>"Where should UUIDs be generated?"</strong> — Either works; DB-side defaults protect every writer (scripts, other services). UUIDv7 is time-ordered, so inserts stay index-friendly unlike random v4.</li>
<li><strong>"What should a health endpoint check?"</strong> — The dependencies needed to serve requests, each with a short timeout; return 503 when not ready. Keep liveness independent of the database.</li>
<li><strong>"What do you never log?"</strong> — Passwords, tokens, full card numbers, request bodies of auth endpoints, personal data you do not need. Logs travel further than databases (Twitter 2018).</li>
<li><strong>"What is graceful shutdown?"</strong> — On SIGTERM: stop accepting, finish in-flight requests, close pools, exit — within the platform's grace period.</li>
</ol>

<h3>🧪 Lab 2.3 (60 min)</h3>
<div class="callout ok">
<ol>
<li>Reproduce both weaknesses with psql on your <code>init_users</code> table (insert without id; two emails differing only in case). Then <code>TRUNCATE users</code>.</li>
<li>Change the id default, create the migration with <code>--create-only</code>, add the CHECK by hand, apply it, run <code>migrate dev</code> again and confirm "Already in sync".</li>
<li>Add global omit; write a throw-away script that proves <code>findUnique</code> has no <code>passwordHash</code> key. Delete the script.</li>
<li>Write the seed with <code>upsert</code>; run it twice.</li>
<li>Implement <code>/api/health</code>, <code>logRequest</code> and graceful shutdown. Test: DB running → 200; <code>docker stop chiase-pg</code> → 503; <code>docker pause chiase-pg</code> → 503 in about 2 s (not 30); <code>docker unpause</code>/<code>start</code> → 200.</li>
</ol>
<p><strong>Done when:</strong> the five health results above match, and the log contains one line per request including a <code>CLIENT_BO_DI</code> line from <code>curl -m 1</code> during a pause.</p>
<p><strong>Rubric (10 pts):</strong> both DB-level fixes applied by migration (3) · omit proven (1) · idempotent seed (1) · health with deadline, 200/503 (3) · log via 'close', no body/headers (1) · graceful shutdown prints both lines (1).</p>
</div>
<details><summary>Solution</summary>
<p>All code above is the ChiaSe repo at tag <code>ch2</code> (<code>apps/api/src/services/health.service.ts</code>, <code>middlewares/log-request.ts</code>, <code>db/prisma.ts</code>, <code>server.ts</code>, <code>prisma/seed.ts</code>). If pause still takes 30 s, your <code>Promise.race</code> is racing the wrong thing — the query must be <em>started</em> inside the race, not awaited before it. If shutdown never prints the second line, a request is still running (a slow query, a stream); <code>server.close</code> waits for in-flight requests (idle keep-alive connections are closed for you since Node 19). Give it a deadline: after a few seconds call <code>server.closeAllConnections()</code> and exit.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CHECK constraint</span><span class="v">Rule the database enforces on every row (here: email = lower(email)).</span></div>
  <div class="kv"><span class="k">UUIDv7</span><span class="v">UUID starting with a timestamp — unique and roughly ordered by creation time.</span></div>
  <div class="kv"><span class="k">global omit</span><span class="v">Prisma option hiding a field from every query unless explicitly requested.</span></div>
  <div class="kv"><span class="k">idempotent</span><span class="v">Running it twice has the same effect as once.</span></div>
  <div class="kv"><span class="k">readiness / liveness</span><span class="v">"Can it serve traffic?" vs "is the process alive?"</span></div>
  <div class="kv"><span class="k">graceful shutdown</span><span class="v">Stop accepting, finish in-flight work, release resources, exit.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Let the database enforce rules: DB-generated uuidv7, CHECK for lowercase email, unique index.</li>
<li><code>--create-only</code> + hand-written SQL for what schema.prisma cannot say; Prisma leaves CHECKs alone.</li>
<li>P2002 = unique, P2039/23514 = CHECK; global omit keeps passwordHash out of every response.</li>
<li>Health = real dependency check + deadline → 200/503; a paused DB hung the first version for 30 s.</li>
<li>Log on 'close', never bodies or headers (Twitter 2018); log <code>e.code</code> for Prisma connection errors.</li>
<li>SIGINT/SIGTERM → close server → disconnect → exit.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · User & health</span>
<h2>Bảng User do chính CSDL bảo vệ, và một health check nói thật kể cả khi CSDL treo</h2>
<p class="lead">Bài này có hai việc. Một: hoàn thiện model <code>User</code> để chính CSDL — không chỉ mã của bạn — bảo đảm các luật: có id kể cả với dòng chèn bằng tay, mỗi email một tài khoản bất kể chữ hoa, và mã băm mật khẩu không bao giờ xuất hiện trong response. Hai: cho API một endpoint <code>/api/health</code> mà hệ thống giám sát tin được, cộng một dòng log cho mỗi request và tắt máy chủ êm. Lúc thử, chúng tôi gặp một kiểu hỏng của CSDL làm health check bản đầu treo 30 giây; bạn sẽ thấy output và cách sửa.</p>

<h3>Liên tưởng đời thường: khám sức khoẻ</h3>
<p>Y tá không chỉ xem bạn còn thở ("tiến trình còn sống"); cô ấy bảo bạn nắm tay cô thật chặt ("làm được việc thật không?"). Và nếu vài giây bạn không phản ứng, cô không đứng chờ mãi — cô ghi "không đáp ứng" và gọi bác sĩ. <code>/api/health</code> chính là buổi khám đó: <strong>còn sống và làm được việc</strong>, kèm <strong>hạn chót</strong>.</p>

<h3>Phần A — Model User, từng thuộc tính một</h3>
<pre><code class="language-prisma">${SCHEMA}</code></pre>
<table>
<thead><tr><th>Mảnh</th><th>Nghĩa</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>@id … @db.Uuid</code></td><td>Khoá chính lưu bằng kiểu <code>uuid</code> của PostgreSQL (16 byte), không phải text (36+ byte)</td><td>Chỉ mục nhỏ hơn; kiểu dữ liệu từ chối id rác</td></tr>
<tr><td><code>@default(dbgenerated("uuidv7()"))</code></td><td><strong>CSDL</strong> sinh id bằng hàm <code>uuidv7()</code> của PostgreSQL 18</td><td>Giải thích bên dưới — nó thay cho <code>uuid(7)</code></td></tr>
<tr><td><code>email String @unique</code></td><td>Chỉ mục duy nhất <code>users_email_key</code></td><td>Mỗi email một tài khoản; cho phép <code>findUnique({ where: { email } })</code></td></tr>
<tr><td><code>@map("password_hash")</code></td><td>Tên cột kiểu SQL</td><td>Bảng đọc tự nhiên trong psql và báo cáo</td></tr>
<tr><td><code>@db.VarChar(50)</code></td><td>Giới hạn độ dài do CSDL giữ</td><td>Phần validate (Chương 5) có thể quên; cột thì không</td></tr>
<tr><td><code>@db.Timestamptz</code></td><td>Mốc thời gian <em>có múi giờ</em></td><td>Lưu UTC, hiển thị theo client — không có "lỗi lệch 7 tiếng" giữa Việt Nam và máy chủ</td></tr>
</tbody>
</table>

<h4>Điểm yếu 1 — id mà chỉ Prisma tạo được</h4>
<p>Bản đầu dùng <code>@default(uuid(7))</code>. Cách đó sinh UUID <em>bên trong Prisma Client</em>, nên migration không có giá trị mặc định nào (<code>"id" UUID NOT NULL</code>). Ngày ai đó chèn dòng bằng psql, bằng script SQL hay từ một dịch vụ khác:</p>
<div class="out">${OUT_PSQL_THU}</div>
<p>Lệnh đầu hỏng vì id. Lệnh thứ hai lộ <strong>điểm yếu 2</strong>: <code>An@Mail.com</code> và <code>an@mail.com</code> đều được nhận — hai tài khoản cho một hộp thư. Ai đó có thể đăng ký một tài khoản "khác" bằng email của bạn viết hoa, và "quên mật khẩu" sẽ chạy không đoán được.</p>

<h4>Cách sửa — một migration có SQL viết tay</h4>
<p>Chúng tôi đổi id sang <code>dbgenerated("uuidv7()")</code>, rồi bảo Prisma tạo migration <em>nhưng chưa áp dụng</em>, để thêm thứ <code>schema.prisma</code> không diễn tả được — một ràng buộc <code>CHECK</code>:</p>
<div class="out">${OUT_CREATE_ONLY}</div>
<pre><code class="language-sql">${MIGRATION_2}</code></pre>
<div class="out">${OUT_MIGRATE_CHECK}</div>
<div class="out">${OUT_PSQL_CHECK}</div>
<p>Để ý ba điều. Prisma <strong>không</strong> đòi xoá CHECK của ta ở lần chạy sau ("Already in sync") — nó không mô hình hoá CHECK nên để yên. Email lẫn chữ hoa giờ không thể vào ở tầng thấp nhất. Và id được CSDL sinh, kể cả khi chèn bằng psql.</p>
<p>Sao lại "lưu chữ thường + CHECK" mà không dùng chỉ mục duy nhất trên <code>lower(email)</code> (SQL nháp ở 1.2)? Prisma cũng không mô tả được chỉ mục biểu thức, còn với <code>@unique</code> thường trên một cột vốn đã là chữ thường thì <code>findUnique({ where: { email } })</code> vẫn chạy. Cái giá là một dòng trong service: <code>email.trim().toLowerCase()</code> trước mọi lần ghi và mọi lần tìm (Chương 3). Extension <code>citext</code> là một đáp án đúng khác bạn có thể gặp khi đi làm.</p>

<h4>Lỗi trông thế nào từ phía mã</h4>
<div class="out">${OUT_LOI_USER}</div>
<ul>
<li><strong>P2002</strong> = vi phạm ràng buộc duy nhất. Chương 3 biến nó thành câu trả lời <em>chung chung</em> cho đăng ký (không phải "email này đã tồn tại" — câu đó cho phép bất kỳ ai dò email nào có tài khoản).</li>
<li><strong>P2039</strong> + mã PostgreSQL <code>23514</code> = một CHECK bị vi phạm. Nếu thấy nó ở production, nghĩa là có đường mã quên chuyển chữ thường — đó là bug, nên thành 500 và một dòng log, không phải thông báo cho người dùng.</li>
<li>Hai dòng cuối là tấm lưới an toàn ta thêm cho client: <strong>omit toàn cục</strong>.</li>
</ul>
<pre><code class="language-ts">${DB_PRISMA}</code></pre>
<p>Với <code>omit: { user: { passwordHash: true } }</code>, mọi truy vấn trên User đều bỏ mã băm ra ngoài trừ khi mã chủ động xin (<code>omit: { passwordHash: false }</code>) — chỉ service đăng nhập làm vậy. Kiểu rò rỉ kinh điển "<code>res.json(user)</code> gửi luôn mã băm mật khẩu cho trình duyệt" giờ mặc định là không thể, thay vì phải nhớ mà tránh.</p>

<h4>Dữ liệu mẫu chạy hai lần vẫn ổn</h4>
<pre><code class="language-ts">${SEED}</code></pre>
<div class="out">${OUT_SEED}</div>
<p><code>upsert</code> làm seed thành <em>idempotent</em> (chạy lại không đổi kết quả): lần hai cập nhật thay vì hỏng vì trùng email. Mã băm <code>!</code> không hợp lệ với thuật toán nào, nên các tài khoản này không đăng nhập được cho tới khi Chương 3 cho chúng mật khẩu thật — đúng mẹo Linux dùng để khoá tài khoản. Lệnh seed khai báo trong <code>prisma.config.ts</code>: <code>migrations: { path: 'prisma/migrations', seed: 'tsx prisma/seed.ts' }</code>.</p>

<h3>Phần B — <code>/api/health</code></h3>
<pre><code class="language-mermaid">${MERMAID}</code></pre>
<p>Hệ thống giám sát (UptimeRobot, <code>HEALTHCHECK</code> của Docker ở Chương 9, bộ cân bằng tải) chỉ đọc <strong>mã trạng thái</strong>. Nên hợp đồng là: 200 khi API làm được việc thật, 503 ("Service Unavailable") khi không. Bản đầu — controller, cộng service chạy <code>SELECT 1</code> — cho ra:</p>
<div class="out">${OUT_HEALTH_DAU}</div>
<p>CSDL tắt → 503 trong 66 ms, CSDL bật lại → 200. Rồi chúng tôi giả lập kiểu hỏng khó chịu hơn: CSDL <em>vẫn nhận</em> kết nối nhưng không bao giờ trả lời (máy chủ quá tải, mạng "hố đen", một khoá giữ quá lâu). <code>docker pause</code> đóng băng mọi tiến trình trong container (container trên máy chúng tôi tên <code>fsp-pg</code>):</p>
<div class="out">${OUT_HEALTH_TREO}</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>connectionTimeoutMillis</code> không bảo vệ truy vấn.</strong> Pool đã đặt 3.000 ms, vậy mà request treo tới khi curl bỏ cuộc sau 30 giây (HTTP 000 = không có câu trả lời nào). Pool đã có sẵn một kết nối mở từ lần kiểm đầu, nên không cần mở kết nối mới và thời hạn đó không bao giờ áp dụng; <code>SELECT 1</code> được gửi đi rồi chờ mãi. Health check mà treo còn tệ hơn health check báo lỗi: hệ thống giám sát hết giờ và báo "không rõ", còn mỗi lần kiểm treo lại giữ một socket.</p></div>
<p>Cách sửa là đặt hạn chót ngay trong service health:</p>
<pre><code class="language-ts">${HEALTH_SERVICE}</code></pre>
<pre><code class="language-ts">${HEALTH_CONTROLLER}</code></pre>
<div class="out">${OUT_HEALTH_HAN}</div>
<p>CSDL bị đóng băng → 503 gọn gàng sau 2,009 giây. Sau <code>unpause</code>, đúng kết nối đó trong pool trả lời trong 2 ms. Còn đây là log, do middleware bên dưới ghi:</p>
<div class="out">${OUT_HEALTH_LOG}</div>
<p>Nhìn hai dòng log cuối: khi CSDL tắt hẳn, thông báo lỗi của Prisma vô dụng (<code>Invalid \`prisma.$queryRaw()\` invocation:</code> rồi vài dòng trống). In thử đối tượng lỗi mới thấy nguyên nhân thật nằm ở đâu:</p>
<div class="out">${OUT_ECODE}</div>
<p>Vì vậy service ghi <code>e.code</code> trước. Một dòng log không nói được <em>vì sao</em> sẽ lấy của bạn một tiếng đồng hồ lúc 3 giờ sáng.</p>
<p><strong>Liveness và readiness.</strong> Kubernetes và vài nền tảng tách "tiến trình còn sống không?" (không thì khởi động lại) khỏi "phục vụ được không?" (không thì ngừng gửi request tới). <code>/api/health</code> của ta là readiness. Đừng bao giờ để <em>liveness</em> phụ thuộc CSDL: CSDL sập là nền tảng khởi động lại mọi bản API theo vòng lặp, mà chẳng sửa được gì.</p>

<h3>Phần C — Mỗi request một dòng log</h3>
<pre><code class="language-ts">${LOG_REQUEST}</code></pre>
<p>Bản đầu của chúng tôi nghe sự kiện <code>'finish'</code>. Trong lần thử "CSDL đóng băng", client bỏ đi và request đó <strong>không hề xuất hiện trong log</strong> — <code>'finish'</code> chỉ bắn khi response được gửi trọn. <code>'close'</code> bắn trong cả hai trường hợp; <code>res.writableFinished</code> phân biệt chúng, nhờ vậy mới có dòng <code>GET /api/health CLIENT_BO_DI 1002.6ms</code> ở trên. Những request chậm, bị bỏ dở lại chính là những request bạn cần thấy nhất.</p>

<h3>⚠️ Sự cố thật: mật khẩu nằm trong log — Twitter, 2018</h3>
<p>Tháng 5/2018, Twitter đề nghị toàn bộ khoảng 330 triệu người dùng đổi mật khẩu: một lỗi đã ghi mật khẩu dạng chữ thường vào <strong>log nội bộ</strong> trước bước băm, nên việc băm bảo vệ được CSDL nhưng không bảo vệ được log (The Verge, 03/05/2018). Twitter nói không thấy dấu hiệu bị lạm dụng — nhưng log được chép sang dịch vụ log, bản sao lưu, laptop, và có nhiều người đọc hơn CSDL rất nhiều. Đó là lý do logger của ta ghi method, URL, mã trạng thái và thời gian, và <strong>không bao giờ ghi body hay header</strong> (body = mật khẩu, header = token). Ở Chương 3 bạn sẽ muốn <code>console.log(req.body)</code> khi gỡ lỗi đăng ký; cứ làm, rồi xoá trước khi commit.</p>

<h3>Phần D — Tắt máy chủ êm</h3>
<pre><code class="language-ts">${SERVER}</code></pre>
<div class="out">${OUT_TAT_EM}</div>
<p><code>docker stop</code> (Chương 9) gửi SIGTERM và chờ 10 giây trước khi giết hẳn. Không có handler, request đang chạy bị cắt ngang, kết nối CSDL bị bỏ không lời chào; có handler, máy chủ ngừng nhận kết nối mới, để request đang chạy làm xong, rồi đóng pool.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">logRequest</span><span class="lz-d">bấm giờ, ghi log khi 'close' — kể cả khi client bỏ đi</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">GET /api/health → controller</span><span class="lz-d">gọi kiemSucKhoe()</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">SELECT 1 đua với hạn 2 s</span><span class="lz-d">bên nào xong trước thắng</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">200 hoặc 503</span><span class="lz-d">mã trạng thái là hợp đồng; body để người đọc</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">SIGTERM</span><span class="lz-d">server.close → $disconnect → thoát mã 0</span></div>
</div>

<h3>Đi làm thật</h3>
<p>Trong dự án thật, câu hỏi đầu tiên của cuộc gọi xử lý sự cố là "health báo gì?", câu thứ hai là "cho xem log của request đó". Đội nào viết cẩn thận cả hai thứ thì trả lời trong vài phút. Một việc OJT hay gặp chính là bài này theo chiều ngược: "endpoint health trả 200 mà người dùng vẫn bị lỗi" — vì nó chỉ kiểm tiến trình còn sống. Một bình luận review hay gặp khác: "đừng trả nguyên entity từ controller" — omit toàn cục là câu trả lời "thắt lưng kèm dây đeo quần" của bạn.</p>

${spring(false, 'Spring Boot Actuator cho sẵn /actuator/health có chỉ báo CSDL (và cũng cần hạn chót, cũng không được lộ chi tiết ra công khai); dữ liệu mẫu thường là một migration Flyway hoặc một CommandLineRunner; JPA dùng @Column(name=…) ở chỗ Prisma dùng @map.', [
  ['sb-15-1-actuator', 'Spring Boot 15.1 — Spring Boot Actuator, an toàn'],
  ['sb-8-3-seed-data', 'Spring Boot 8.3 — Nạp dữ liệu tham chiếu ban đầu'],
  ['sb-6-1-entity-repository', 'Spring Boot 6.1 — Entity và repository'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Làm sao để email duy nhất không phân biệt hoa thường?"</strong> — Chuẩn hoá về chữ thường trước khi ghi và tìm, cộng một bảo đảm ở CSDL: CHECK + unique, chỉ mục duy nhất trên <code>lower(email)</code>, hoặc <code>citext</code>. Chỉ có mã thì chưa phải bảo đảm.</li>
<li><strong>"Nên sinh UUID ở đâu?"</strong> — Chỗ nào cũng được; mặc định phía CSDL bảo vệ mọi bên ghi (script, dịch vụ khác). UUIDv7 có thứ tự thời gian, nên chèn vẫn thân thiện với chỉ mục, khác v4 ngẫu nhiên.</li>
<li><strong>"Endpoint health nên kiểm gì?"</strong> — Các phụ thuộc cần để phục vụ request, mỗi cái một hạn chót ngắn; trả 503 khi chưa sẵn sàng. Giữ liveness độc lập với CSDL.</li>
<li><strong>"Thứ gì không bao giờ ghi vào log?"</strong> — Mật khẩu, token, số thẻ đầy đủ, body của endpoint xác thực, dữ liệu cá nhân không cần thiết. Log đi xa hơn CSDL (Twitter 2018).</li>
<li><strong>"Graceful shutdown là gì?"</strong> — Khi nhận SIGTERM: ngừng nhận, làm xong request đang chạy, đóng pool, thoát — trong thời gian nền tảng cho phép.</li>
</ol>

<h3>🧪 Lab 2.3 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Tái hiện cả hai điểm yếu bằng psql trên bảng <code>init_users</code> của bạn (chèn không có id; hai email chỉ khác chữ hoa). Rồi <code>TRUNCATE users</code>.</li>
<li>Đổi mặc định của id, tạo migration với <code>--create-only</code>, tự thêm CHECK, áp dụng, chạy lại <code>migrate dev</code> và xác nhận "Already in sync".</li>
<li>Thêm omit toàn cục; viết một script dùng-xong-bỏ chứng minh kết quả <code>findUnique</code> không có khoá <code>passwordHash</code>. Xoá script.</li>
<li>Viết seed bằng <code>upsert</code>; chạy hai lần.</li>
<li>Làm <code>/api/health</code>, <code>logRequest</code> và tắt êm. Thử: CSDL chạy → 200; <code>docker stop chiase-pg</code> → 503; <code>docker pause chiase-pg</code> → 503 sau khoảng 2 giây (không phải 30); <code>docker unpause</code>/<code>start</code> → 200.</li>
</ol>
<p><strong>Xong khi:</strong> năm kết quả health ở trên khớp, và log có đúng một dòng cho mỗi request, kể cả một dòng <code>CLIENT_BO_DI</code> từ <code>curl -m 1</code> trong lúc CSDL bị pause.</p>
<p><strong>Thang điểm (10):</strong> cả hai sửa ở tầng CSDL đều qua migration (3) · chứng minh được omit (1) · seed idempotent (1) · health có hạn chót, 200/503 (3) · log bằng 'close', không body/header (1) · tắt êm in đủ hai dòng (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Toàn bộ mã ở trên là repo ChiaSe tại tag <code>ch2</code> (<code>apps/api/src/services/health.service.ts</code>, <code>middlewares/log-request.ts</code>, <code>db/prisma.ts</code>, <code>server.ts</code>, <code>prisma/seed.ts</code>). Nếu pause vẫn mất 30 giây, <code>Promise.race</code> của bạn đang đua sai thứ — truy vấn phải được <em>bắt đầu</em> bên trong race, không phải await xong rồi mới race. Nếu tắt máy không in dòng thứ hai, vẫn còn một request đang chạy (truy vấn chậm, luồng dữ liệu); <code>server.close</code> chờ request đang chạy (kết nối keep-alive rảnh thì Node đã tự đóng từ bản 19). Đặt hạn chót cho nó: sau vài giây gọi <code>server.closeAllConnections()</code> rồi thoát.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CHECK constraint</span><span class="v">Ràng buộc kiểm tra: luật CSDL áp lên mọi dòng (ở đây: email = lower(email)).</span></div>
  <div class="kv"><span class="k">UUIDv7</span><span class="v">UUID bắt đầu bằng mốc thời gian — duy nhất và gần như theo thứ tự tạo.</span></div>
  <div class="kv"><span class="k">global omit</span><span class="v">Omit toàn cục: tuỳ chọn Prisma giấu một trường khỏi mọi truy vấn trừ khi xin rõ.</span></div>
  <div class="kv"><span class="k">idempotent</span><span class="v">Chạy hai lần cho kết quả như chạy một lần.</span></div>
  <div class="kv"><span class="k">readiness / liveness</span><span class="v">"Phục vụ được không?" và "tiến trình còn sống không?"</span></div>
  <div class="kv"><span class="k">graceful shutdown</span><span class="v">Tắt êm: ngừng nhận, làm xong việc dở, trả tài nguyên, thoát.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Để CSDL giữ luật: uuidv7 do CSDL sinh, CHECK email chữ thường, chỉ mục duy nhất.</li>
<li><code>--create-only</code> + SQL viết tay cho thứ schema.prisma không nói được; Prisma để yên CHECK.</li>
<li>P2002 = trùng unique, P2039/23514 = vi phạm CHECK; omit toàn cục giữ passwordHash ngoài mọi response.</li>
<li>Health = kiểm phụ thuộc thật + hạn chót → 200/503; CSDL bị pause làm bản đầu treo 30 giây.</li>
<li>Log khi 'close', không bao giờ ghi body hay header (Twitter 2018); ghi <code>e.code</code> với lỗi kết nối Prisma.</li>
<li>SIGINT/SIGTERM → đóng server → ngắt CSDL → thoát.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
