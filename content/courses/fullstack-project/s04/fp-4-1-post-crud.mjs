/**
 * 4.1 — Model Post và endpoint CRUD (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (PostgreSQL 18.7, Prisma 7.10.1, Zod 4.6.7, Express 5.3.0), repo chiase commit 63a367c (nhánh ch4/bai-viet).
 * Phát hiện thật 24/11: bản "ngây thơ" update where {id} cho Bình sửa được bài của An (200); GET /posts/abc ⇒ 500 vì Postgres
 * từ chối "abc" cho cột uuid (Prisma P2007) ⇒ thêm validateIdParam; z.strictObject chặn authorId trong body (400);
 * 48 bit đầu của UUIDv7 đọc ra đúng thời điểm tạo bài (13:07:48.715Z) — không đoán được id nhưng lộ giờ tạo.
 * Nguồn (GET 200, 24/11/2026): Wired 12/01/2021 (Parler); KrebsOnSecurity 24/05/2019 (First American, 885 triệu tệp);
 * OWASP API Security Top 10 2023 — API1 Broken Object Level Authorization.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const SCHEMA = `/// Bài nháp chỉ tác giả thấy; bài đã đăng ai cũng đọc được.
enum PostStatus {
  draft
  published

  @@map("post_status")
}

/// Bài viết. imageKey là KHOÁ của ảnh trong kho (vd posts/0199….webp) — KHÔNG lưu URL đầy đủ:
/// đổi CDN/tên miền chỉ cần đổi MEDIA_BASE_URL, không phải sửa hàng triệu dòng.
model Post {
  id        String     @id @default(dbgenerated("uuidv7()")) @db.Uuid
  authorId  String     @map("author_id") @db.Uuid
  title     String     @db.VarChar(120)
  body      String
  imageKey  String?    @map("image_key") @db.VarChar(200)
  status    PostStatus @default(draft)
  createdAt DateTime   @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime   @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([status, createdAt(sort: Desc), id(sort: Desc)], map: "posts_feed_idx")
  @@index([authorId])
  @@map("posts")
}`;

const MIGRATION = `-- CreateEnum
CREATE TYPE "post_status" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "author_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "body" TEXT NOT NULL,
    "image_key" VARCHAR(200),
    "status" "post_status" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_feed_idx" ON "posts"("status", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Viết tay (Prisma không sinh CHECK): tiêu đề/nội dung không được toàn khoảng trắng — chặn cả khi ai đó ghi bằng SQL trực tiếp
ALTER TABLE "posts" ADD CONSTRAINT "posts_title_not_blank" CHECK (length(btrim("title")) &gt; 0);
ALTER TABLE "posts" ADD CONSTRAINT "posts_body_not_blank" CHECK (length(btrim("body")) &gt; 0);`;

const POST_SCHEMA = `import { z } from 'zod';

// Chỉ nhận ĐÚNG các trường người dùng được phép gửi. authorId KHÔNG có ở đây: tác giả luôn lấy từ token (req.user),
// không bao giờ từ body — nếu không, ai cũng đăng bài "dưới tên" người khác (mass assignment).
// z.strictObject: gửi trường lạ (authorId, id, createdAt…) ⇒ 400 thay vì lặng lẽ bỏ qua.
const tieuDe = z.string().trim().min(1, 'không được để trống').max(120);
const noiDung = z.string().trim().min(1, 'không được để trống').max(10_000);
const trangThai = z.enum(['draft', 'published']);

export const taoBaiSchema = z.strictObject({
  title: tieuDe,
  body: noiDung,
  status: trangThai.default('draft'),
});

// PATCH: mọi trường tuỳ chọn, nhưng phải có ÍT NHẤT một trường
export const suaBaiSchema = z
  .strictObject({ title: tieuDe, body: noiDung, status: trangThai })
  .partial()
  .refine((o) =&gt; Object.keys(o).length &gt; 0, 'cần ít nhất một trường để sửa');

export type TaoBai = z.infer&lt;typeof taoBaiSchema&gt;;
export type SuaBai = z.infer&lt;typeof suaBaiSchema&gt;;`;

const POST_SVC = `import { prisma } from '../db/prisma.js';
import { HttpError } from '../lib/http-error.js';
import { Prisma } from '../generated/prisma/client.js';
import type { SuaBai, TaoBai } from '../schemas/post.schema.js';

// Những gì API trả về cho MỘT bài — chọn trường rõ ràng (không trả cả dòng CSDL), kèm tên tác giả.
const chonBai = {
  id: true,
  title: true,
  body: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, displayName: true } },
} satisfies Prisma.PostSelect;

const khongThay = () =&gt; new HttpError(404, 'KHONG_TIM_THAY', 'Không có bài viết này');

export function taoBai(tacGia: string, du: TaoBai) {
  return prisma.post.create({ data: { ...du, authorId: tacGia }, select: chonBai });
}

// Bài nháp của người khác ⇒ 404, KHÔNG phải 403: 403 xác nhận "bài này có tồn tại", lộ thông tin cho người dò.
export async function layBai(id: string, nguoiXem?: string) {
  const bai = await prisma.post.findUnique({ where: { id }, select: chonBai });
  if (!bai || (bai.status === 'draft' &amp;&amp; bai.author.id !== nguoiXem)) throw khongThay();
  return bai;
}

// Tạm thời: 20 bài đã đăng mới nhất. Chương 5 thay bằng phân trang cursor.
export function dsBaiDaDang() {
  return prisma.post.findMany({
    where: { status: 'published' },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: 20,
    select: chonBai,
  });
}

// Sửa/xoá: điều kiện "đúng tác giả" nằm NGAY TRONG câu UPDATE/DELETE (where: { id, authorId }) — kiểm và ghi là MỘT
// câu lệnh, không có khe hở giữa "kiểm" và "ghi". Không khớp (P2025) ⇒ mới tra lại để chọn 404 hay 403.
async function loiKhongKhop(id: string, nguoiLam: string): Promise&lt;HttpError&gt; {
  const bai = await prisma.post.findUnique({ where: { id }, select: { authorId: true, status: true } });
  if (!bai || (bai.status === 'draft' &amp;&amp; bai.authorId !== nguoiLam)) return khongThay();
  return new HttpError(403, 'KHONG_DUOC_PHEP', 'Chỉ tác giả mới sửa/xoá được bài này');
}

const laKhongKhop = (e: unknown) =&gt; e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2025';

export async function suaBai(id: string, nguoiLam: string, du: SuaBai) {
  try {
    return await prisma.post.update({ where: { id, authorId: nguoiLam }, data: du, select: chonBai });
  } catch (e) {
    if (laKhongKhop(e)) throw await loiKhongKhop(id, nguoiLam);
    throw e;
  }
}

export async function xoaBai(id: string, nguoiLam: string) {
  try {
    return await prisma.post.delete({ where: { id, authorId: nguoiLam }, select: { id: true } });
  } catch (e) {
    if (laKhongKhop(e)) throw await loiKhongKhop(id, nguoiLam);
    throw e;
  }
}`;

const OPTIONAL = `import type { NextFunction, Request, Response } from 'express';
import { requireAuth } from './require-auth.js';

// Route CÔNG KHAI nhưng trả khác nhau khi biết người xem (vd tác giả xem được bài nháp của mình).
// Không có header Authorization ⇒ khách, đi tiếp. CÓ header mà token hỏng/hết hạn ⇒ 401 như requireAuth
// (để frontend biết đường refresh), KHÔNG lặng lẽ coi là khách — nếu không, tác giả token hết hạn thấy bài nháp "biến mất".
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.get('authorization')) return next();
  return requireAuth(req, res, next);
}`;

const VALIDATE_ID = `import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

// /posts/abc ⇒ 404 ngay, không gửi "abc" xuống Postgres (cột uuid sẽ ném lỗi 22P02 ⇒ thành 500).
const uuid = z.uuid();
export function validateIdParam(req: Request, res: Response, next: NextFunction) {
  if (!uuid.safeParse(req.params.id).success) {
    res.status(404).json({ error: { code: 'KHONG_TIM_THAY', message: 'Không có tài nguyên này' } });
    return;
  }
  next();
}`;

const ROUTES = `// --- Công khai ---
apiRouter.get('/', getInfo);
apiRouter.get('/health', getHealth);
apiRouter.post('/auth/register', gioiHanXacThuc, validateBody(dangKySchema), postDangKy);
apiRouter.post('/auth/login', gioiHanXacThuc, validateBody(dangNhapSchema), postDangNhap);
apiRouter.post('/auth/refresh', postLamMoi); // xác thực bằng cookie refresh, không cần access token
apiRouter.post('/auth/logout', postDangXuat);
apiRouter.get('/posts', getDsBai);
apiRouter.get('/posts/:id', optionalAuth, validateIdParam, getBai); // công khai; tác giả có token thấy cả bài nháp

// --- Cần đăng nhập: GẮN requireAuth vào TỪNG route. KHÔNG dùng apiRouter.use(requireAuth): nó chạy cho MỌI đường dẫn
// tới sau nó, kể cả đường không tồn tại ⇒ route lạ trả 401 thay vì 404 (Checkpoint 2 bắt được, bài 3.3).
// Quên gắn = route công khai ⇒ checkpoint-3 gọi từng route dưới đây không token, phải ra 401.
apiRouter.get('/me', requireAuth, getToi);
apiRouter.get('/users/:id/sessions', requireAuth, getPhien);
apiRouter.post('/posts', requireAuth, validateBody(taoBaiSchema), postTaoBai);
apiRouter.patch('/posts/:id', requireAuth, validateIdParam, validateBody(suaBaiSchema), patchBai);
apiRouter.delete('/posts/:id', requireAuth, validateIdParam, deleteBai);`;

const OUT_TAO = `$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts -H "Authorization: Bearer $AN" -H "content-type: application/json" -d "{\\"title\\":\\"  Bài đầu tiên của An  \\",\\"body\\":\\"Xin chào ChiaSe!\\"}"
{"id":"01a20dab-065d-77bf-b72c-1740961383ab","title":"Bài đầu tiên của An","body":"Xin chào ChiaSe!","status":"draft","createdAt":"2026-11-24T13:07:21.820Z","updatedAt":"2026-11-24T13:07:21.820Z","author":{"id":"01a20da9-f6e4-7dc4-9e4c-4f6480a2e122","displayName":"An Nguyễn"}}  [HTTP 201]
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts -H "Authorization: Bearer $AN" -H "content-type: application/json" -d "{\\"title\\":\\"Mạo danh\\",\\"body\\":\\"x\\",\\"authorId\\":\\"00000000-0000-7000-8000-000000000000\\"}"
{"error":{"code":"DU_LIEU_SAI","message":"body: Unrecognized key: \\"authorId\\""}}  [HTTP 400]
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts -H "content-type: application/json" -d "{\\"title\\":\\"Không token\\",\\"body\\":\\"x\\"}"
{"error":{"code":"CHUA_DANG_NHAP","message":"Cần đăng nhập"}}  [HTTP 401]
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts -H "Authorization: Bearer $AN" -H "content-type: application/json" -d "{\\"title\\":\\"   \\",\\"body\\":\\"x\\",\\"status\\":\\"public\\"}"
{"error":{"code":"DU_LIEU_SAI","message":"title: không được để trống"}}  [HTTP 400]`;

const OUT_QUYEN = `$ curl -s -o /dev/null -w "An (tác giả) xem nháp: %{http_code}\\n" $A/posts/$ID -H "Authorization: Bearer $AN"
An (tác giả) xem nháp: 200
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts/$ID -H "Authorization: Bearer $BINH"      # Bình xem nháp của An
{"error":{"code":"KHONG_TIM_THAY","message":"Không có bài viết này"}}  [HTTP 404]
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts/$ID                                  # khách xem nháp
{"error":{"code":"KHONG_TIM_THAY","message":"Không có bài viết này"}}  [HTTP 404]
$ curl -s -w "  [HTTP %{http_code}]\\n" -X PATCH $A/posts/$ID -H "Authorization: Bearer $BINH" $J -d "{\\"title\\":\\"Bình sửa\\"}"   # Bình sửa nháp của An
{"error":{"code":"KHONG_TIM_THAY","message":"Không có bài viết này"}}  [HTTP 404]
$ curl -s -w "  [HTTP %{http_code}]\\n" -X PATCH $A/posts/$ID -H "Authorization: Bearer $AN" $J -d "{\\"status\\":\\"published\\"}" | cut -c1-90
{"id":"01a20dab-2bc5-7260-b508-50aa481eee49","title":"Nháp của An","body":"chưa xong",
$ curl -s -w "  [HTTP %{http_code}]\\n" -X PATCH $A/posts/$ID -H "Authorization: Bearer $BINH" $J -d "{\\"title\\":\\"Bình sửa\\"}"   # bài ĐÃ ĐĂNG
{"error":{"code":"KHONG_DUOC_PHEP","message":"Chỉ tác giả mới sửa/xoá được bài này"}}  [HTTP 403]
$ curl -s -w "  [HTTP %{http_code}]\\n" -X DELETE $A/posts/$ID -H "Authorization: Bearer $BINH"
{"error":{"code":"KHONG_DUOC_PHEP","message":"Chỉ tác giả mới sửa/xoá được bài này"}}  [HTTP 403]
$ curl -s -w "  [HTTP %{http_code}]\\n" -X PATCH $A/posts/$ID -H "Authorization: Bearer $AN" $J -d "{}"
{"error":{"code":"DU_LIEU_SAI","message":"body: cần ít nhất một trường để sửa"}}  [HTTP 400]
$ curl -s $A/posts | node -pe "JSON.parse(require(\\"fs\\").readFileSync(0)).map(b=&gt;b.status+\\" \\"+b.title).join(\\"\\\\n\\")"
published Nháp của An
$ curl -s -o /dev/null -w "An xoá bài của mình: %{http_code}\\n" -X DELETE $A/posts/$ID -H "Authorization: Bearer $AN"
An xoá bài của mình: 204
$ curl -s -w "  [HTTP %{http_code}]\\n" -X DELETE $A/posts/$ID -H "Authorization: Bearer $AN"     # xoá lần hai
{"error":{"code":"KHONG_TIM_THAY","message":"Không có bài viết này"}}  [HTTP 404]`;

const OUT_NGAY_THO = `$ curl -s -w "  [HTTP %{http_code}]\\n" -X PATCH $A/posts/$ID -H "Authorization: Bearer $BINH" $J -d "{\\"body\\":\\"Bình đã sửa bài của An\\"}" | cut -c1-120
{"id":"01a20dab-6f6b-73cd-b5f6-28783feac6c3","title":"Bài của An","body":"Bình đã sửa bài của An","status":"p
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts/abc
{"error":{"code":"LOI_MAY_CHU","message":"Có lỗi phía máy chủ"}}  [HTTP 500]`;

const LOG_500 = `[GET /api/posts/abc] PrismaClientKnownRequestError: 
Invalid \`prisma.post.findUnique()\` invocation in
/home/…/chiase/apps/api/src/services/post.service.ts:25:33

  22 
  23 // Bài nháp của người khác ⇒ 404, KHÔNG phải 403: 403 xác nhận "bài này có tồn tại", lộ thông tin cho người dò.
  24 export async function layBai(id: string, nguoiXem?: string) {
→ 25   const bai = await prisma.post.findUnique(
Invalid input value: invalid input syntax for type uuid: "abc"`;

const OUT_UUID = `$ node -e 'const id="01a20dab-6f6b-73cd-b5f6-28783feac6c3"; console.log(new Date(parseInt(id.replace(/-/g,"").slice(0,12), 16)))'
2026-11-24T13:07:48.715Z`;

const MA_NGAY_THO = `// BẢN NGÂY THƠ — đừng làm theo: chỉ tìm theo id, không hỏi "ai đang sửa"
export async function suaBai(id: string, nguoiLam: string, du: SuaBai) {
  return prisma.post.update({ where: { id }, data: du, select: chonBai });
}`;

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-8-3-requireauth-phan-quyen', title: 'Node.js 8.3 — requireAuth, phân quyền, và xoá bỏ AUTHOR_ID = 1', sub: 'Bài khái niệm gốc: tác giả lấy từ token, không từ body.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-7-3-crud-transaction', title: 'Node.js 7.3 — CRUD, transaction…', sub: 'CRUD với PostgreSQL và transaction, chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'API Design 6.2 — Phân quyền và truy cập theo đối tượng (BOLA)', sub: 'Khai thác và vá BOLA/IDOR bằng số đo thật.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-6-3-validate-schema', title: 'Node.js 6.3 — Kiểm tra dữ liệu bằng lược đồ', sub: 'Zod, strict và vì sao không tin body.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📰', 'Wired — An Absurdly Basic Bug Let Anyone Grab All of Parler\'s Data (12/01/2021)', 'ID bài tăng dần, xem bài không cần đăng nhập, không giới hạn tần suất ⇒ cào gần như toàn bộ bài công khai.', 'https://www.wired.com/story/parler-hack-data-public-posts-images-video/'),
  nguon('📰', 'KrebsOnSecurity — First American Financial Corp. leaked hundreds of millions of title insurance records (24/05/2019)', 'Đổi một chữ số trong đường dẫn là xem được tài liệu của người khác: ~885 triệu tệp, không cần xác thực.', 'https://krebsonsecurity.com/2019/05/first-american-financial-corp-leaked-hundreds-of-millions-of-title-insurance-records/'),
  nguon('📘', 'OWASP API Security Top 10 (2023) — API1 Broken Object Level Authorization', 'Lỗi số 1 của API: kiểm "đã đăng nhập" nhưng quên kiểm "đối tượng này có phải của bạn".', 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/'),
  nguon('📘', 'Wikipedia — Parler', 'Bối cảnh vụ cào dữ liệu 01/2021.', 'https://en.wikipedia.org/wiki/Parler'),
].join('\n');

const MERMAID = `flowchart TD
  R["PATCH /posts/:id"] --> A{"requireAuth: có token hợp lệ?"}
  A -->|không| U["401"]
  A -->|có| I{"id là uuid?"}
  I -->|không| N1["404"]
  I -->|có| B{"Zod strictObject: body hợp lệ?"}
  B -->|không| E["400 DU_LIEU_SAI"]
  B -->|có| Q["UPDATE … WHERE id = $1 AND author_id = $2"]
  Q -->|1 dòng| OK["200 + bài mới"]
  Q -->|0 dòng| T{"Tra lại: bài có, và người này thấy được?"}
  T -->|không| N2["404"]
  T -->|có| F["403 KHONG_DUOC_PHEP"]`;

export default {
  title: '4.1 — Post model and CRUD endpoints|||4.1 — Model Post và endpoint CRUD',
  slug: 'fp-4-1-post-crud',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Model Post (UUIDv7, enum draft/published, CHECK viết tay, chỉ mục feed) và năm endpoint CRUD; tác giả luôn lấy từ token, z.strictObject chặn mass assignment; bài nháp của người khác trả 404, bài đã đăng trả 403; điều kiện tác giả nằm ngay trong câu UPDATE/DELETE; bẫy thật: bản ngây thơ cho Bình sửa bài của An, /posts/abc thành 500 (P2007) — kèm vụ Parler 2021 và First American 2019.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Posts</span>
<h2>Five endpoints, one question that matters: "is this post yours?"</h2>
<p class="lead">ChiaSe finally gets its main content. This lesson adds the <code>Post</code> model and the five CRUD endpoints, with drafts and published posts. Writing CRUD is easy; the hard part — the part that leaks millions of records in real companies — is deciding <em>who</em> may read, edit and delete <em>which</em> post. We build the naive version first, watch Bình edit An's post, then fix it so that the check and the write are one SQL statement. Images come in lessons 4.2–4.3.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. The model: what a post is in the database</h3>
<pre><code class="language-prisma">${SCHEMA}</code></pre>
<p>Five decisions, each with a reason:</p>
<ul>
<li><strong><code>id</code> is a UUIDv7 generated by PostgreSQL 18</strong> (same as <code>users</code>, lesson 2.3). Not <code>1, 2, 3…</code>: with sequential ids anyone can walk <code>/posts/1</code>, <code>/posts/2</code>… — see Parler below. UUIDv7 is still time-ordered, so the primary key index stays compact.</li>
<li><strong><code>status</code> is an enum</strong> (<code>draft</code> | <code>published</code>), default <code>draft</code>: a post is private until its author publishes it.</li>
<li><strong><code>imageKey</code> stores a key, not a URL</strong> — <code>posts/0199….webp</code>, never <code>https://media…/posts/0199….webp</code>. Lesson 4.3 explains why this saves you a migration of every row when the CDN changes.</li>
<li><strong><code>updatedAt @updatedAt</code></strong> is filled by <em>Prisma Client</em>, not by the database. An <code>UPDATE</code> typed in psql will not touch it. We accept that, because every write goes through the API.</li>
<li><strong>The feed index</strong> <code>(status, created_at DESC, id DESC)</code> matches the query "newest published posts", which Chapter 5 turns into cursor pagination.</li>
</ul>
<p>Prisma cannot express "title must not be blank", so the migration was created with <code>--create-only</code> and two <code>CHECK</code> lines were added by hand (same technique as lesson 2.3):</p>
<pre><code class="language-sql">${MIGRATION}</code></pre>

<h3>2. Input: only what the user is allowed to send</h3>
<pre><code class="language-ts">${POST_SCHEMA}</code></pre>
<div class="out">${OUT_TAO}</div>
<p>Read the four results. The title was trimmed. The post was created as <code>draft</code> because the body did not say otherwise. The request that tried to set <code>authorId</code> was refused with 400 — <code>z.strictObject</code> rejects unknown keys. A plain <code>z.object</code> would have <em>silently dropped</em> it, which is also safe; we prefer a loud 400 so a frontend bug ("why does my field disappear?") is found on day one. The fourth request shows Zod reporting only the first problem (the blank title, not the invalid status) — Chapter 5 returns every field error at once.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — mass assignment.</strong> <code>prisma.post.create({ data: req.body })</code> works in the demo and is a vulnerability in production: whatever the client sends (<code>authorId</code>, <code>status</code>, <code>createdAt</code>…) is written. The author is <em>always</em> <code>req.user.id</code> from the verified token; the schema lists exactly the fields a user may set.</p></div>

<h3>3. Reading: drafts are invisible, not forbidden</h3>
<pre><code class="language-ts">${OPTIONAL}</code></pre>
<p><code>GET /posts/:id</code> is public, but the answer depends on who asks: the author can see their own draft. So the route uses <code>optionalAuth</code> — no header means guest, a header with a bad or expired token still means 401 (otherwise an author whose token just expired would see their draft "disappear" instead of refreshing).</p>
<div class="out">${OUT_QUYEN}</div>
<p>Look at the status codes carefully. On An's <strong>draft</strong>, Bình gets <strong>404</strong> for reading <em>and</em> for editing. On the same post once <strong>published</strong>, Bình gets <strong>403</strong>. Why the difference? A 403 on a draft would confirm "this id exists, it is just not yours" — information an attacker uses to map private content. For a published post everyone already knows it exists, so the honest answer is 403. Deleting twice gives 404 the second time: DELETE is idempotent in effect, not in status code.</p>

<h3>4. Writing: the check and the write are one statement</h3>
<p>First, the version almost everyone writes first:</p>
<pre><code class="language-ts">${MA_NGAY_THO}</code></pre>
<div class="out">${OUT_NGAY_THO}</div>
<p>Bình is logged in — <code>requireAuth</code> is happy — and the update goes through: <strong>200</strong>, An's post now says what Bình wrote. This is <strong>IDOR</strong> (Insecure Direct Object Reference), which OWASP calls <em>Broken Object Level Authorization</em> and ranks number one in its API Top 10 (2023). Authentication answered "who are you"; nobody asked "is this object yours".</p>
<p>The common fix is "find the post, compare <code>authorId</code>, then update". It works, but leaves a gap between the check and the write (another request can change the post in between — a time-of-check/time-of-use race). ChiaSe puts the condition <em>into</em> the write:</p>
<pre><code class="language-ts">${POST_SVC}</code></pre>
<p><code>where: { id, authorId: nguoiLam }</code> becomes <code>UPDATE posts … WHERE id = $1 AND author_id = $2</code>. If zero rows match, Prisma throws <code>P2025</code>, and only <em>then</em> do we look the post up again to choose between 404 and 403. The happy path costs one query; the unhappy path costs two, which is fine.</p>

<h3>5. The trap: <code>/posts/abc</code> crashed with 500</h3>
<div class="out">${LOG_500}</div>
<p>The id column is <code>uuid</code>; PostgreSQL refuses to even compare it with <code>"abc"</code>, Prisma reports <code>P2007</code>, and our error middleware correctly turns an unknown error into 500. A typo in a URL should be a 404, not an alert at 3 a.m. — and a stream of 500s is also how scanners find weak spots. One small middleware validates the parameter before any query:</p>
<pre><code class="language-ts">${VALIDATE_ID}</code></pre>
<pre><code class="language-ts">${ROUTES}</code></pre>
<p>Read the routes file top to bottom and you know the security model: reads of posts are public, every write carries <code>requireAuth</code>. Checkpoint 4 extends the "call every protected route without a token" list from Checkpoint 3.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">who?</span><span class="lz-d">requireAuth / optionalAuth ⇒ req.user from the token, never from the body</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">which?</span><span class="lz-d">validateIdParam: not a uuid ⇒ 404 before touching the database</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">what?</span><span class="lz-d">z.strictObject: only title/body/status; unknown keys ⇒ 400</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">allowed?</span><span class="lz-d">UPDATE/DELETE … WHERE id AND author_id — one statement</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">answer</span><span class="lz-d">0 rows ⇒ draft of someone else 404 · published 403</span></div>
</div>

<h3>🕵️ Hacker's corner — Parler (2021) and First American (2019)</h3>
<p>In January 2021, before the social network Parler went offline, researchers archived almost all of its public posts, images and videos. Wired (12/01/2021) explained how: posts had <strong>sequential ids</strong>, public posts could be fetched <strong>without logging in</strong>, there was <strong>no rate limit</strong>, and uploaded media still carried location metadata. A script just counted upwards. ChiaSe's answer to each point: UUIDv7 ids, drafts invisible to others, the rate limiter from Chapter 3 (extend it to reads before launch), and — lesson 4.3 — images re-encoded without EXIF.</p>
<p>In May 2019 KrebsOnSecurity reported that title-insurance company First American exposed about <strong>885 million</strong> files — bank account numbers, Social Security numbers, mortgage documents dating back 16 years. Anyone with one valid document link could read others "just by modifying a single digit in the link", with no authentication. Same bug class as our naive <code>suaBai</code>, at the scale of a public company.</p>
<p>One honest caveat about our own ids. UUIDv7 is not guessable (74 random bits), but its first 48 bits are a millisecond timestamp:</p>
<div class="out">${OUT_UUID}</div>
<p>Anyone holding a post id knows when it was created. For a social network that is already public information; for, say, medical records it might not be — then use UUIDv4 for public ids.</p>

<h3>In everyday life</h3>
<p>A hotel key card opens <em>your</em> room, not every room on the floor — even though every guest is "authenticated" at the front desk. The naive <code>suaBai</code> is a key card that opens any room whose number you can type. And a draft is a room that is not on the floor plan: the hotel does not say "occupied", it says "no such room".</p>

<h3>On a real job</h3>
<p>In outsourcing projects, IDOR is the finding that most often comes back from the client's penetration test, usually on an endpoint like <code>/api/orders/:id</code> that "only the mobile app calls". The ticket says "user A can view user B's order by changing the id". With this lesson you know the fix (ownership in the query, not in the controller), the status code question (404 vs 403, and why), and how to prove it: a test where user B calls user A's resource — Checkpoint 4 has exactly that.</p>

${spring(false, 'In Spring Boot the same rules apply: the author comes from <code>SecurityContext</code>, never from the request DTO; ownership is checked in the service (or in the query: <code>findByIdAndAuthorId</code>); and the request DTO lists only allowed fields.', [
  ['sb-10-2-idor', 'Spring Boot 10.2 — IDOR and object-level authorization'],
  ['sb-10-1-mass-assignment', 'Spring Boot 10.1 — Mass assignment'],
  ['sb-4-2-dto', 'Spring Boot 4.2 — DTOs: why not return the entity'],
  ['sb-4-5-thiet-ke-rest', 'Spring Boot 4.5 — REST design: status codes, pagination, idempotency'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"What is IDOR, and how do you prevent it?"</strong> — Accessing an object by id without checking it belongs to the caller. Check ownership on the server for every object access, ideally inside the query itself; add a test with two users.</li>
<li><strong>"404 or 403 when a user requests someone else's private resource?"</strong> — 404 if revealing existence is itself a leak (drafts, private files); 403 when existence is public anyway.</li>
<li><strong>"What is mass assignment?"</strong> — Binding the whole request body to the model, letting clients set fields they should not (owner, role, price). Whitelist fields with a schema/DTO.</li>
<li><strong>"Why not auto-increment ids in a public API?"</strong> — They are enumerable and leak volume. Use UUIDs (and still check authorization — ids are not secrets).</li>
<li><strong>"Check-then-update or conditional update?"</strong> — Conditional update (<code>WHERE id AND owner</code>) avoids the race between check and write and costs one query on the happy path.</li>
</ol>

<h3>🧪 Lab 4.1 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>On branch <code>ch4/bai-viet</code>, add the <code>Post</code> model and enum; create the migration with <code>--create-only</code>, add the two <code>CHECK</code> lines, apply it.</li>
<li>Write <code>post.schema.ts</code>, <code>post.service.ts</code>, the controller and the routes. First write the <em>naive</em> <code>suaBai</code>, and reproduce "Bình edits An's post → 200" with the two seed users.</li>
<li>Fix it with <code>where: { id, authorId }</code> and the 404/403 choice. Reproduce the whole table of section 3.</li>
<li>Call <code>/api/posts/abc</code> before and after adding <code>validateIdParam</code>; find the <code>P2007</code> line in your server log.</li>
<li>Try <code>psql</code>: <code>UPDATE posts SET title = '   ' …</code> — the CHECK must refuse it.</li>
</ol>
<p><strong>Done when:</strong> Bình can neither read An's draft (404) nor edit/delete An's published post (403), sending <code>authorId</code> is a 400, and no URL you can type produces a 500.</p>
<p><strong>Rubric (10):</strong> model + migration with CHECK (2) · strict input schema (2) · ownership inside the query + 404/403 choice (3) · optionalAuth for drafts (1) · invalid id ⇒ 404 (1) · naive version reproduced and explained (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>63a367c</code> on <code>ch4/bai-viet</code>: <code>prisma/schema.prisma</code>, migration <code>*_posts</code>, <code>schemas/post.schema.ts</code>, <code>services/post.service.ts</code>, <code>controllers/post.controller.ts</code>, <code>middlewares/optional-auth.ts</code>, <code>middlewares/validate-id.ts</code>. If TypeScript refuses <code>where: { id, authorId }</code>, check that you are on Prisma ≥ 5 (non-unique fields in a unique filter became stable in 5.0). If Bình gets 404 instead of 403 on a <em>published</em> post, your <code>loiKhongKhop</code> treats every non-author as "cannot see".</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CRUD</span><span class="v">Create, Read, Update, Delete — the four basic operations on a resource.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Accessing an object by its id without an ownership check. OWASP API #1 (2023).</span></div>
  <div class="kv"><span class="k">mass assignment</span><span class="v">Writing every field the client sends, including ones it must not control.</span></div>
  <div class="kv"><span class="k">TOCTOU</span><span class="v">Time-of-check to time-of-use: the state changes between the check and the action.</span></div>
  <div class="kv"><span class="k">P2025 / P2007</span><span class="v">Prisma error codes: record to update/delete not found · invalid value for the column type.</span></div>
  <div class="kv"><span class="k">UUIDv7</span><span class="v">Time-ordered UUID: 48-bit millisecond timestamp + random bits.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>Post</code>: UUIDv7 id, draft/published enum, image <em>key</em>, hand-written CHECKs, feed index.</li>
<li>The author is taken from the token; <code>z.strictObject</code> refuses any other field.</li>
<li>Someone else's draft ⇒ 404; someone else's published post ⇒ 403 on write.</li>
<li>Ownership lives inside <code>UPDATE/DELETE … WHERE id AND author_id</code>; the naive version is IDOR.</li>
<li>Invalid ids are rejected before the database; no typed URL may produce a 500.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài viết</span>
<h2>Năm endpoint, một câu hỏi quan trọng: "bài này có phải của bạn không?"</h2>
<p class="lead">ChiaSe cuối cùng cũng có nội dung chính. Bài này thêm model <code>Post</code> và năm endpoint CRUD, có bài nháp và bài đã đăng. Viết CRUD thì dễ; phần khó — phần đã làm lộ hàng triệu bản ghi ở công ty thật — là quyết định <em>ai</em> được đọc, sửa, xoá <em>bài nào</em>. Ta viết bản ngây thơ trước, nhìn Bình sửa được bài của An, rồi sửa sao cho việc kiểm và việc ghi là MỘT câu SQL. Ảnh để dành cho bài 4.2–4.3.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Model: một bài viết trong CSDL trông thế nào</h3>
<pre><code class="language-prisma">${SCHEMA}</code></pre>
<p>Năm quyết định, mỗi cái một lý do:</p>
<ul>
<li><strong><code>id</code> là UUIDv7 do PostgreSQL 18 sinh</strong> (giống bảng <code>users</code>, bài 2.3). Không dùng <code>1, 2, 3…</code>: id tăng dần thì ai cũng đi lần <code>/posts/1</code>, <code>/posts/2</code>… được — xem vụ Parler bên dưới. UUIDv7 vẫn tăng theo thời gian nên chỉ mục khoá chính vẫn gọn.</li>
<li><strong><code>status</code> là enum</strong> (<code>draft</code> | <code>published</code>), mặc định <code>draft</code>: bài là riêng tư cho tới khi tác giả bấm đăng.</li>
<li><strong><code>imageKey</code> lưu KHOÁ, không lưu URL</strong> — <code>posts/0199….webp</code>, không bao giờ là <code>https://media…/posts/0199….webp</code>. Bài 4.3 giải thích vì sao việc này cứu bạn khỏi một lần sửa mọi dòng khi đổi CDN.</li>
<li><strong><code>updatedAt @updatedAt</code></strong> do <em>Prisma Client</em> điền, không phải CSDL. Một câu <code>UPDATE</code> gõ tay trong psql sẽ không đổi nó. Ta chấp nhận, vì mọi thao tác ghi đều đi qua API.</li>
<li><strong>Chỉ mục feed</strong> <code>(status, created_at DESC, id DESC)</code> khớp với truy vấn "bài đã đăng mới nhất" mà Chương 5 biến thành phân trang cursor.</li>
</ul>
<p>Prisma không diễn đạt được "tiêu đề không được toàn khoảng trắng", nên migration được tạo bằng <code>--create-only</code> rồi thêm tay hai dòng <code>CHECK</code> (cùng kỹ thuật bài 2.3):</p>
<pre><code class="language-sql">${MIGRATION}</code></pre>

<h3>2. Dữ liệu vào: chỉ những gì người dùng được phép gửi</h3>
<pre><code class="language-ts">${POST_SCHEMA}</code></pre>
<div class="out">${OUT_TAO}</div>
<p>Đọc bốn kết quả. Tiêu đề đã được cắt khoảng trắng. Bài được tạo ở trạng thái <code>draft</code> vì body không nói gì khác. Request cố đặt <code>authorId</code> bị từ chối 400 — <code>z.strictObject</code> không nhận khoá lạ. Một <code>z.object</code> thường sẽ <em>lặng lẽ bỏ</em> trường đó — cũng an toàn; ta chọn 400 thật to để lỗi frontend ("sao trường của tôi biến mất?") lộ ra ngay ngày đầu. Request thứ tư cho thấy Zod hiện chỉ báo lỗi đầu tiên (tiêu đề trống, chưa nói tới status sai) — Chương 5 trả mọi lỗi theo từng trường một lần.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — mass assignment (gán hàng loạt).</strong> <code>prisma.post.create({ data: req.body })</code> chạy ngon khi demo và là lỗ hổng khi lên production: client gửi gì (<code>authorId</code>, <code>status</code>, <code>createdAt</code>…) cũng được ghi. Tác giả <em>luôn luôn</em> là <code>req.user.id</code> lấy từ token đã kiểm; schema liệt kê đúng những trường người dùng được đặt.</p></div>

<h3>3. Đọc: bài nháp là vô hình, không phải bị cấm</h3>
<pre><code class="language-ts">${OPTIONAL}</code></pre>
<p><code>GET /posts/:id</code> là công khai, nhưng câu trả lời phụ thuộc người hỏi: tác giả xem được bài nháp của mình. Vì vậy route dùng <code>optionalAuth</code> — không có header là khách; có header mà token hỏng/hết hạn thì vẫn 401 (nếu không, tác giả vừa hết hạn token sẽ thấy bài nháp "biến mất" thay vì được refresh).</p>
<div class="out">${OUT_QUYEN}</div>
<p>Nhìn kỹ các mã trạng thái. Với bài <strong>nháp</strong> của An, Bình nhận <strong>404</strong> khi đọc <em>và</em> khi sửa. Với cùng bài đó khi đã <strong>đăng</strong>, Bình nhận <strong>403</strong>. Vì sao khác? Trả 403 cho bài nháp là xác nhận "id này có tồn tại, chỉ là không phải của bạn" — thông tin kẻ tấn công dùng để vẽ bản đồ nội dung riêng tư. Bài đã đăng thì ai cũng biết nó tồn tại, nên trả lời thật là 403. Xoá lần hai ra 404: DELETE lặp lại an toàn về <em>hiệu ứng</em>, không phải về mã trạng thái.</p>

<h3>4. Ghi: kiểm và ghi là MỘT câu lệnh</h3>
<p>Trước hết, phiên bản gần như ai cũng viết đầu tiên:</p>
<pre><code class="language-ts">${MA_NGAY_THO}</code></pre>
<div class="out">${OUT_NGAY_THO}</div>
<p>Bình đã đăng nhập — <code>requireAuth</code> hài lòng — và lệnh sửa đi qua: <strong>200</strong>, bài của An giờ mang nội dung Bình viết. Đây là <strong>IDOR</strong> (Insecure Direct Object Reference — tham chiếu trực tiếp đối tượng không an toàn), OWASP gọi là <em>Broken Object Level Authorization</em> và xếp số 1 trong API Top 10 (2023). Xác thực đã trả lời "bạn là ai"; chẳng ai hỏi "đối tượng này có phải của bạn không".</p>
<p>Cách sửa phổ biến là "tìm bài, so <code>authorId</code>, rồi update". Chạy được, nhưng để hở một khe giữa lúc kiểm và lúc ghi (request khác có thể đổi bài ở giữa — cuộc đua time-of-check/time-of-use). ChiaSe đặt điều kiện <em>vào trong</em> câu ghi:</p>
<pre><code class="language-ts">${POST_SVC}</code></pre>
<p><code>where: { id, authorId: nguoiLam }</code> thành <code>UPDATE posts … WHERE id = $1 AND author_id = $2</code>. Không dòng nào khớp ⇒ Prisma ném <code>P2025</code>, và chỉ <em>lúc đó</em> ta mới tra lại bài để chọn 404 hay 403. Đường thành công tốn một truy vấn; đường thất bại tốn hai — chấp nhận được.</p>

<h3>5. Cái bẫy: <code>/posts/abc</code> sập 500</h3>
<div class="out">${LOG_500}</div>
<p>Cột id kiểu <code>uuid</code>; PostgreSQL từ chối so nó với <code>"abc"</code>, Prisma báo <code>P2007</code>, và middleware lỗi của ta biến lỗi lạ thành 500 — đúng như thiết kế. Gõ nhầm URL phải là 404, không phải cảnh báo lúc 3 giờ sáng — và một loạt 500 cũng là cách máy quét lỗ hổng tìm chỗ yếu. Một middleware nhỏ kiểm tham số trước mọi truy vấn:</p>
<pre><code class="language-ts">${VALIDATE_ID}</code></pre>
<pre><code class="language-ts">${ROUTES}</code></pre>
<p>Đọc tệp route từ trên xuống là biết mô hình bảo mật: đọc bài là công khai, mọi thao tác ghi đều mang <code>requireAuth</code>. Checkpoint 4 nối dài danh sách "gọi mọi route bảo vệ không token" của Checkpoint 3.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ai?</span><span class="lz-d">requireAuth / optionalAuth ⇒ req.user lấy từ token, không bao giờ từ body</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">bài nào?</span><span class="lz-d">validateIdParam: không phải uuid ⇒ 404 trước khi chạm CSDL</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">gửi gì?</span><span class="lz-d">z.strictObject: chỉ title/body/status; khoá lạ ⇒ 400</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">được phép?</span><span class="lz-d">UPDATE/DELETE … WHERE id AND author_id — một câu lệnh</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">trả lời</span><span class="lz-d">0 dòng ⇒ nháp người khác 404 · bài đã đăng 403</span></div>
</div>

<h3>🕵️ Góc hacker — Parler (2021) và First American (2019)</h3>
<p>Tháng 01/2021, trước khi mạng xã hội Parler bị ngắt, các nhà nghiên cứu đã lưu trữ gần như toàn bộ bài viết, ảnh và video công khai của nó. Wired (12/01/2021) giải thích cách làm: bài viết có <strong>id tăng dần</strong>, bài công khai lấy được <strong>không cần đăng nhập</strong>, <strong>không giới hạn tần suất</strong>, và ảnh/video tải lên vẫn còn siêu dữ liệu vị trí. Một script chỉ việc đếm lên. Câu trả lời của ChiaSe cho từng điểm: id UUIDv7, bài nháp vô hình với người khác, bộ giới hạn tần suất của Chương 3 (mở rộng sang route đọc trước khi ra mắt), và — bài 4.3 — ảnh được mã hoá lại, không còn EXIF.</p>
<p>Tháng 05/2019, KrebsOnSecurity đưa tin công ty bảo hiểm quyền sở hữu nhà đất First American để lộ khoảng <strong>885 triệu</strong> tệp — số tài khoản ngân hàng, số an sinh xã hội, hồ sơ vay mua nhà từ 16 năm trước. Ai có một đường dẫn tài liệu hợp lệ là đọc được tài liệu khác "chỉ bằng cách sửa một chữ số trong đường dẫn", không cần xác thực. Cùng loại lỗi với <code>suaBai</code> ngây thơ của ta, ở quy mô một công ty niêm yết.</p>
<p>Một lưu ý thật thà về chính id của ta. UUIDv7 không đoán được (74 bit ngẫu nhiên), nhưng 48 bit đầu là dấu thời gian tính bằng mili giây:</p>
<div class="out">${OUT_UUID}</div>
<p>Ai cầm id bài là biết bài được tạo lúc nào. Với mạng xã hội, đó vốn là thông tin công khai; với, chẳng hạn, hồ sơ bệnh án thì có thể không — khi đó dùng UUIDv4 cho id công khai.</p>

<h3>Liên hệ đời thường</h3>
<p>Thẻ từ khách sạn mở được phòng <em>của bạn</em>, không mở mọi phòng trên tầng — dù mọi khách đều đã "xác thực" ở quầy lễ tân. <code>suaBai</code> ngây thơ là chiếc thẻ mở được mọi phòng mà bạn gõ được số. Còn bài nháp là căn phòng không có trên sơ đồ tầng: khách sạn không nói "có người ở", mà nói "không có phòng này".</p>

<h3>Đi làm thật</h3>
<p>Ở dự án outsourcing, IDOR là phát hiện hay quay lại nhất từ đợt kiểm thử xâm nhập của khách hàng, thường ở một endpoint kiểu <code>/api/orders/:id</code> mà "chỉ ứng dụng di động gọi thôi". Ticket ghi "người dùng A xem được đơn của người dùng B bằng cách đổi id". Học xong bài này bạn biết cách sửa (quyền sở hữu nằm trong truy vấn, không nằm ở controller), câu hỏi mã trạng thái (404 hay 403, và vì sao), và cách chứng minh: một phép thử người dùng B gọi tài nguyên của người dùng A — Checkpoint 4 có đúng phép thử đó.</p>

${spring(false, 'Trong Spring Boot luật y hệt: tác giả lấy từ <code>SecurityContext</code>, không bao giờ từ DTO của request; quyền sở hữu kiểm trong service (hoặc ngay trong truy vấn: <code>findByIdAndAuthorId</code>); DTO đầu vào chỉ liệt kê trường được phép.', [
  ['sb-10-2-idor', 'Spring Boot 10.2 — IDOR và phân quyền cấp đối tượng'],
  ['sb-10-1-mass-assignment', 'Spring Boot 10.1 — Mass assignment'],
  ['sb-4-2-dto', 'Spring Boot 4.2 — DTO: vì sao không trả thẳng entity'],
  ['sb-4-5-thiet-ke-rest', 'Spring Boot 4.5 — Thiết kế REST: mã trạng thái, phân trang, idempotency'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"IDOR là gì, chặn thế nào?"</strong> — Truy cập đối tượng theo id mà không kiểm nó thuộc về người gọi. Kiểm quyền sở hữu phía server cho MỌI lần truy cập đối tượng, tốt nhất ngay trong truy vấn; thêm phép thử với hai người dùng.</li>
<li><strong>"Người dùng xin tài nguyên riêng của người khác: 404 hay 403?"</strong> — 404 nếu việc lộ "có tồn tại" đã là rò rỉ (bài nháp, tệp riêng); 403 khi sự tồn tại vốn công khai.</li>
<li><strong>"Mass assignment là gì?"</strong> — Gắn nguyên body request vào model, để client đặt được trường không được phép (chủ sở hữu, vai trò, giá). Liệt kê trường cho phép bằng schema/DTO.</li>
<li><strong>"Sao không dùng id tự tăng cho API công khai?"</strong> — Đếm lần được và lộ quy mô dữ liệu. Dùng UUID (và vẫn kiểm quyền — id không phải bí mật).</li>
<li><strong>"Kiểm-rồi-sửa hay sửa có điều kiện?"</strong> — Sửa có điều kiện (<code>WHERE id AND owner</code>) tránh cuộc đua giữa kiểm và ghi, và chỉ tốn một truy vấn ở đường thành công.</li>
</ol>

<h3>🧪 Lab 4.1 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Trên nhánh <code>ch4/bai-viet</code>, thêm model <code>Post</code> và enum; tạo migration bằng <code>--create-only</code>, thêm hai dòng <code>CHECK</code>, rồi áp dụng.</li>
<li>Viết <code>post.schema.ts</code>, <code>post.service.ts</code>, controller và route. Viết <code>suaBai</code> bản <em>ngây thơ</em> trước, tái hiện "Bình sửa bài của An → 200" bằng hai người dùng seed.</li>
<li>Sửa bằng <code>where: { id, authorId }</code> và lựa chọn 404/403. Tái hiện đủ bảng ở mục 3.</li>
<li>Gọi <code>/api/posts/abc</code> trước và sau khi thêm <code>validateIdParam</code>; tìm dòng <code>P2007</code> trong log máy chủ.</li>
<li>Thử trong <code>psql</code>: <code>UPDATE posts SET title = '   ' …</code> — CHECK phải từ chối.</li>
</ol>
<p><strong>Xong khi:</strong> Bình không đọc được bài nháp của An (404), không sửa/xoá được bài đã đăng của An (403), gửi <code>authorId</code> ra 400, và không URL nào bạn gõ được sinh ra 500.</p>
<p><strong>Thang điểm (10):</strong> model + migration có CHECK (2) · schema đầu vào strict (2) · quyền sở hữu trong truy vấn + chọn 404/403 (3) · optionalAuth cho bài nháp (1) · id sai ⇒ 404 (1) · tái hiện và giải thích bản ngây thơ (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>63a367c</code> trên <code>ch4/bai-viet</code>: <code>prisma/schema.prisma</code>, migration <code>*_posts</code>, <code>schemas/post.schema.ts</code>, <code>services/post.service.ts</code>, <code>controllers/post.controller.ts</code>, <code>middlewares/optional-auth.ts</code>, <code>middlewares/validate-id.ts</code>. TypeScript không nhận <code>where: { id, authorId }</code>? Kiểm bạn đang dùng Prisma ≥ 5 (trường không unique trong bộ lọc unique ổn định từ bản 5.0). Bình nhận 404 thay vì 403 với bài <em>đã đăng</em>? Hàm <code>loiKhongKhop</code> của bạn đang coi mọi người không phải tác giả là "không thấy được".</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CRUD</span><span class="v">Create, Read, Update, Delete — bốn thao tác cơ bản trên một tài nguyên.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Truy cập đối tượng theo id mà không kiểm quyền sở hữu. Số 1 của OWASP API (2023).</span></div>
  <div class="kv"><span class="k">mass assignment</span><span class="v">Ghi mọi trường client gửi, kể cả trường nó không được điều khiển.</span></div>
  <div class="kv"><span class="k">TOCTOU</span><span class="v">Time-of-check to time-of-use: trạng thái đổi giữa lúc kiểm và lúc làm.</span></div>
  <div class="kv"><span class="k">P2025 / P2007</span><span class="v">Mã lỗi Prisma: không có bản ghi để sửa/xoá · giá trị sai kiểu cột.</span></div>
  <div class="kv"><span class="k">UUIDv7</span><span class="v">UUID tăng theo thời gian: 48 bit mili giây + các bit ngẫu nhiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Post</code>: id UUIDv7, enum draft/published, lưu <em>khoá</em> ảnh, CHECK viết tay, chỉ mục feed.</li>
<li>Tác giả lấy từ token; <code>z.strictObject</code> từ chối mọi trường khác.</li>
<li>Bài nháp người khác ⇒ 404; sửa/xoá bài đã đăng của người khác ⇒ 403.</li>
<li>Quyền sở hữu nằm trong <code>UPDATE/DELETE … WHERE id AND author_id</code>; bản ngây thơ là IDOR.</li>
<li>Id sai bị chặn trước CSDL; không URL gõ tay nào được sinh ra 500.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
