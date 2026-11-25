/**
 * 5.1 — Model Comment và quan hệ lồng nhau (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (PostgreSQL 18.7, Prisma 7.10.1, Zod 4.6.7, Express 5.3.0), repo chiase commit def2e66 (nhánh ch5/binh-luan).
 * Phát hiện thật 24/11: feed 20 bài đếm bình luận từng bài = 22 truy vấn (N+1); `_count` của Prisma 7 chỉ 2 truy vấn nhưng sinh
 * LEFT JOIN (… GROUP BY post_id trên CẢ BẢNG comments) ⇒ với 1 triệu bình luận: Parallel Seq Scan cả bảng, 65,2 ms/trang, CHẬM HƠN
 * cả N+1 (14,4 ms); groupBy … WHERE post_id IN (20 id) = 3 truy vấn, 6,8 ms. NFD: 1000 chữ "ệ" gõ kiểu NFD = 3000 code point ⇒ Zod
 * max(1000) từ chối ⇒ normalize('NFC') trước khi đếm. RESTRICT chặn xoá bài (23503), CASCADE xoá kèm bình luận.
 * Nguồn (GET 200, 24/11/2026): Wikipedia Samy (computer worm); Prisma docs aggregation/relation queries; PostgreSQL docs ddl-constraints;
 * Unicode UAX #15.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const SCHEMA = `/// Bình luận: thuộc MỘT bài và MỘT người viết (hai quan hệ 1-n). Xoá bài ⇒ CSDL tự xoá bình luận (ON DELETE CASCADE),
/// không cần vòng lặp xoá trong mã. Phẳng (không trả lời lồng nhau) — cố tình, xem bài 5.1.
model Comment {
  id        String   @id @default(dbgenerated("uuidv7()")) @db.Uuid
  postId    String   @map("post_id") @db.Uuid
  authorId  String   @map("author_id") @db.Uuid
  body      String   @db.VarChar(1000)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // Đọc bình luận của MỘT bài theo thứ tự thời gian + đếm theo bài: cả hai dùng chỉ mục này
  @@index([postId, createdAt, id], map: "comments_post_idx")
  @@index([authorId])
  @@map("comments")
}`;

const MIGRATION = `-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "post_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "body" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_post_idx" ON "comments"("post_id", "created_at", "id");

-- CreateIndex
CREATE INDEX "comments_author_id_idx" ON "comments"("author_id");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Viết tay (Prisma không diễn tả được): bình luận không được chỉ toàn khoảng trắng — chặn cả khi ai đó ghi thẳng bằng psql
ALTER TABLE "comments" ADD CONSTRAINT "comments_body_not_blank" CHECK (btrim("body") &lt;&gt; '');`;

const SCHEMA_TS = `import { z } from 'zod';

// Bình luận: chỉ có nội dung. postId lấy từ URL, tác giả lấy từ token — không bao giờ từ body.
// normalize('NFC'): "ệ" gõ từ macOS/iOS có thể tới dạng NFD (3 code point) ⇒ chuẩn hoá trước khi đếm độ dài và lưu.
export const taoBinhLuanSchema = z.strictObject({
  body: z
    .string()
    .trim()
    .transform((s) =&gt; s.normalize('NFC'))
    .pipe(z.string().min(1, 'không được để trống').max(1000, 'tối đa 1000 ký tự')),
});
export type TaoBinhLuan = z.infer&lt;typeof taoBinhLuanSchema&gt;;`;

const SVC = `import { prisma } from '../db/prisma.js';
import { HttpError } from '../lib/http-error.js';
import { Prisma } from '../generated/prisma/client.js';
import type { TaoBinhLuan } from '../schemas/comment.schema.js';

const chonBinhLuan = {
  id: true,
  body: true,
  createdAt: true,
  author: { select: { id: true, displayName: true } },
} satisfies Prisma.CommentSelect;

const khongThayBai = () =&gt; new HttpError(404, 'KHONG_TIM_THAY', 'Không có bài viết này');

// Bài có "nhìn thấy được" với người này không? Cùng luật với layBai: nháp của người khác = không tồn tại.
async function baiNhinThay(postId: string, nguoiXem?: string) {
  const bai = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true, status: true },
  });
  if (!bai || (bai.status === 'draft' &amp;&amp; bai.authorId !== nguoiXem)) throw khongThayBai();
  return bai;
}

// Tạm thời: 50 bình luận CŨ NHẤT trước (đọc như một cuộc trò chuyện). Bài 5.2 thay bằng phân trang cursor.
export async function dsBinhLuan(postId: string, nguoiXem?: string) {
  await baiNhinThay(postId, nguoiXem);
  return prisma.comment.findMany({
    where: { postId },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    take: 50,
    select: chonBinhLuan,
  });
}

export async function taoBinhLuan(postId: string, tacGia: string, { body }: TaoBinhLuan) {
  const bai = await baiNhinThay(postId, tacGia);
  if (bai.status !== 'published')
    throw new HttpError(409, 'BAI_CHUA_DANG', 'Đăng bài trước rồi mới bình luận được');
  try {
    return await prisma.comment.create({ data: { postId, authorId: tacGia, body }, select: chonBinhLuan });
  } catch (e) {
    // Bài bị xoá ĐÚNG lúc giữa lần kiểm ở trên và câu INSERT ⇒ khoá ngoại từ chối (P2003) ⇒ trả 404, không phải 500.
    if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2003') throw khongThayBai();
    throw e;
  }
}

// Ai được xoá một bình luận? Người viết nó, HOẶC tác giả của bài (dọn bình luận rác trên bài của mình).
// Điều kiện quyền nằm NGAY TRONG câu DELETE (như bài 4.1) — kiểm và xoá là một câu lệnh.
export async function xoaBinhLuan(id: string, nguoiLam: string) {
  const { count } = await prisma.comment.deleteMany({
    where: { id, OR: [{ authorId: nguoiLam }, { post: { authorId: nguoiLam } }] },
  });
  if (count === 1) return;
  const con = await prisma.comment.findUnique({ where: { id }, select: { id: true } });
  if (!con) throw new HttpError(404, 'KHONG_TIM_THAY', 'Không có bình luận này');
  throw new HttpError(403, 'KHONG_DUOC_PHEP', 'Chỉ người viết hoặc tác giả bài mới xoá được bình luận này');
}`;

const PRISMA_TS = `import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { config } from '../config.js';

// MỘT PrismaClient cho cả tiến trình (nó giữ một pool kết nối). Tạo mới mỗi request ⇒ cạn kết nối Postgres.
const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
  max: 10, // tối đa 10 kết nối trong pool
  connectionTimeoutMillis: 3_000, // mặc định của pg là 0 = chờ MÃI nếu CSDL treo
});
// omit toàn cục: KHÔNG truy vấn nào trả passwordHash, trừ khi chủ động ghi omit: { passwordHash: false } (chỉ lúc đăng nhập).
// log 'query' dạng sự kiện: để ĐẾM truy vấn mỗi request (bắt lỗi N+1, bài 5.1). Không có người nghe thì không in gì.
export const prisma = new PrismaClient({
  adapter,
  omit: { user: { passwordHash: true } },
  log: [{ emit: 'event', level: 'query' }],
});

// Bộ đếm TOÀN CỤC (không theo request): sự kiện 'query' của Prisma bắn NGOÀI ngữ cảnh AsyncLocalStorage của request,
// nên chỉ đếm đúng khi một request chạy một lúc — đủ cho máy dev và checkpoint, KHÔNG dùng làm số liệu production.
export const soTruyVan = { n: 0 };
if (process.env.DEM_SQL === '1') {
  prisma.$on('query', (e) =&gt; {
    soTruyVan.n++;
    if (process.env.IN_SQL === '1') console.log(\`  [sql \${e.duration}ms] \${e.query}\`);
  });
}`;

const N1_CODE = `// Tạm thời: 20 bài đã đăng mới nhất. Chương 5 thay bằng phân trang cursor.
// BẢN NGÂY THƠ (bài 5.1): đếm bình luận cho TỪNG bài bằng một truy vấn riêng.
export async function dsBaiDaDang() {
  const ds = await prisma.post.findMany({
    where: { status: 'published' },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: 20,
    select: chonBai,
  });
  return Promise.all(
    ds.map(async (b) =&gt; ({ ...raBai(b), commentCount: await prisma.comment.count({ where: { postId: b.id } }) })),
  );
}`;

const OUT_N1 = `$ curl -s localhost:41815/api/posts | jq -c "length, [.[:3][] | {title, commentCount}]"
20
[{"title":"Bài mẫu 1","commentCount":1},{"title":"Bài mẫu 2","commentCount":2},{"title":"Bài mẫu 3","commentCount":3}]
--- log máy chủ (DEM_SQL=1 IN_SQL=1) ---
  [sql 3.9ms] SELECT "posts"."id", "posts"."title", "posts"."body", "posts"."status"::text, "posts"."image_key", "posts"."created_at", "posts"."updated_at", "posts"."author_id" FROM "posts" WHERE "posts"."status" = CAST($1::text AS "post_status") ORDER BY "posts"."created_at" DESC, "posts"."id" DESC LIMIT $2 OFFSET $3
  [sql 1.3ms] SELECT "users"."id", "users"."display_name" FROM "users" WHERE "users"."id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) OFFSET $21
  [sql 16.4ms] SELECT COUNT(*) AS "_count$_all" FROM (SELECT "comments"."id" FROM "comments" WHERE "comments"."post_id" = $1 OFFSET $2) AS "sub"
  [sql 19.8ms] SELECT COUNT(*) AS "_count$_all" FROM (SELECT "comments"."id" FROM "comments" WHERE "comments"."post_id" = $1 OFFSET $2) AS "sub"
  … (thêm 18 dòng SELECT COUNT(*) giống hệt — mỗi bài một dòng)
2026-11-24T13:46:33.217Z GET /api/posts 200 48.3ms · 22 sql`;

const OUT_COUNT = `$ curl -s localhost:41815/api/posts | jq -c "length, [.[:3][] | {title, commentCount}]"
20
[{"title":"Bài mẫu 1","commentCount":1},{"title":"Bài mẫu 2","commentCount":2},{"title":"Bài mẫu 3","commentCount":3}]
--- log máy chủ (DEM_SQL=1 IN_SQL=1) ---
  [sql 38.0ms] SELECT "posts"."id", "posts"."title", "posts"."body", "posts"."status"::text, "posts"."image_key", "posts"."created_at", "posts"."updated_at", "posts"."author_id", COALESCE("aggr_selection_0_Comment"."_aggr_count_comments", 0) AS "_aggr_count_comments" FROM "posts" LEFT JOIN (SELECT "comments"."post_id", COUNT(*) AS "_aggr_count_comments" FROM "comments" WHERE 1=1 GROUP BY "comments"."post_id") AS "aggr_selection_0_Comment" ON ("posts"."id" = "aggr_selection_0_Comment"."post_id") WHERE "posts"."status" = CAST($1::text AS "post_status") ORDER BY "posts"."created_at" DESC, "posts"."id" DESC LIMIT $2 OFFSET $3
  [sql 3.0ms] SELECT "users"."id", "users"."display_name" FROM "users" WHERE "users"."id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) OFFSET $21
2026-11-24T13:47:02.451Z GET /api/posts 200 209.5ms · 2 sql`;

const OUT_EXPLAIN = `                                                            QUERY PLAN                                                            
----------------------------------------------------------------------------------------------------------------------------------
 Limit (actual time=65.378..70.194 rows=20.00 loops=1)
   Buffers: shared hit=11382
   -&gt;  Nested Loop Left Join (actual time=65.377..70.189 rows=20.00 loops=1)
         Join Filter: (p.id = a.post_id)
         Rows Removed by Join Filter: 2205
         Buffers: shared hit=11382
         -&gt;  Index Scan using posts_feed_idx on posts p (actual time=0.019..0.030 rows=20.00 loops=1)
               Index Cond: (status = 'published'::post_status)
               Index Searches: 1
               Buffers: shared hit=3
         -&gt;  Materialize (actual time=3.268..3.502 rows=111.15 loops=20)
               Storage: Memory  Maximum Storage: 65kB
               Buffers: shared hit=11379
               -&gt;  Subquery Scan on a (actual time=65.344..69.755 rows=1026.00 loops=1)
                     Buffers: shared hit=11379
                     -&gt;  Finalize GroupAggregate (actual time=65.343..69.681 rows=1026.00 loops=1)
                           Group Key: comments.post_id
                           Buffers: shared hit=11379
                           -&gt;  Gather Merge (actual time=65.335..69.334 rows=2357.00 loops=1)
                                 Workers Planned: 2
                                 Workers Launched: 2
                                 Buffers: shared hit=11379
                                 -&gt;  Sort (actual time=61.000..61.033 rows=785.67 loops=3)
                                       Sort Key: comments.post_id
                                       Sort Method: quicksort  Memory: 56kB
                                       Buffers: shared hit=11379
                                       Worker 0:  Sort Method: quicksort  Memory: 55kB
                                       Worker 1:  Sort Method: quicksort  Memory: 55kB
                                       -&gt;  Partial HashAggregate (actual time=60.709..60.796 rows=785.67 loops=3)
                                             Group Key: comments.post_id
                                             Batches: 1  Memory Usage: 121kB
                                             Buffers: shared hit=11365
                                             Worker 0:  Batches: 1  Memory Usage: 121kB
                                             Worker 1:  Batches: 1  Memory Usage: 121kB
                                             -&gt;  Parallel Seq Scan on comments (actual time=0.008..21.655 rows=333362.33 loops=3)
                                                   Buffers: shared hit=11365
 Planning:
   Buffers: shared hit=247
 Planning Time: 1.403 ms
 Execution Time: 70.490 ms
(40 rows)`;

const DEM = `const raBai = ({ imageKey, ...b }: DongBai, commentCount: number) =&gt; ({
  ...b,
  imageUrl: urlAnh(imageKey),
  commentCount,
});

// Đếm bình luận cho MỘT LÔ bài bằng MỘT truy vấn: WHERE post_id IN (…) GROUP BY post_id — dùng chỉ mục comments_post_idx,
// chỉ đọc bình luận của đúng các bài này. KHÔNG dùng _count của Prisma 7 trong danh sách: nó GROUP BY CẢ BẢNG comments
// rồi mới JOIN (đo thật: 1 triệu bình luận ⇒ quét song song cả bảng cho 20 bài, bài 5.1).
async function demBinhLuan(ids: string[]): Promise&lt;Map&lt;string, number&gt;&gt; {
  if (ids.length === 0) return new Map();
  const nhom = await prisma.comment.groupBy({
    by: ['postId'],
    where: { postId: { in: ids } },
    _count: { _all: true },
  });
  return new Map(nhom.map((g) =&gt; [g.postId, g._count._all]));
}

// Một bài ⇒ một lô một phần tử. Danh sách ⇒ một lô nhiều phần tử. Không bao giờ đếm TỪNG bài trong vòng lặp (N+1).
async function raDsBai(ds: DongBai[]) {
  const dem = await demBinhLuan(ds.map((b) =&gt; b.id));
  return ds.map((b) =&gt; raBai(b, dem.get(b.id) ?? 0));
}
const raMotBai = async (b: DongBai) =&gt; (await raDsBai([b]))[0]!;`;

const OUT_GROUPBY = `$ curl -s localhost:41815/api/posts | jq -c "length, [.[:3][] | {title, commentCount}]"
20
[{"title":"Bài mẫu 1","commentCount":1},{"title":"Bài mẫu 2","commentCount":2},{"title":"Bài mẫu 3","commentCount":3}]
--- log máy chủ (DEM_SQL=1 IN_SQL=1) ---
  [sql 49.6ms] SELECT "posts".… FROM "posts" WHERE "posts"."status" = CAST($1::text AS "post_status") ORDER BY "posts"."created_at" DESC, "posts"."id" DESC LIMIT $2 OFFSET $3
  [sql 1.9ms] SELECT "users"."id", "users"."display_name" FROM "users" WHERE "users"."id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) OFFSET $21
  [sql 2.7ms] SELECT COUNT(*) AS "_count$_all", "comments"."post_id" FROM "comments" WHERE "comments"."post_id" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) GROUP BY "comments"."post_id" OFFSET $21
2026-11-24T13:48:17.706Z GET /api/posts 200 194.1ms · 3 sql`;

const OUT_TAO = `$ curl -s $A/posts/$P/comments -H "authorization: Bearer $BINH" -H "$J" -d "{\\"body\\":\\"  Thử rồi, mặn mà ngon!  \\"}" -w "  → %{http_code}\\n"
{"id":"01a20dd1-16b6-7dbd-b2de-b1b9947d2f23","body":"Thử rồi, mặn mà ngon!","createdAt":"2026-11-24T13:48:56.374Z","author":{"id":"01a20dcd-088f-7153-ae07-eec78150af04","displayName":"Bình Trần"}}  → 201
$ curl -s $A/posts/$P/comments -H "authorization: Bearer $CHI" -H "$J" -d "{\\"body\\":\\"Ở Sài Gòn có không?\\"}" -o /dev/null -w "%{http_code}\\n"
201
$ curl -s $A/posts/$P/comments | jq -c ".[] | {body, ai: .author.displayName}"
{"body":"Thử rồi, mặn mà ngon!","ai":"Bình Trần"}
{"body":"Ở Sài Gòn có không?","ai":"Chi Lê"}`;

const OUT_QUYEN = `# 1) bình luận vào bài NHÁP
$ curl -s $A/posts/$D/comments -H "authorization: Bearer $BINH" -H "$J" -d "{\\"body\\":\\"hi\\"}" -w "  → %{http_code}\\n"
{"error":{"code":"KHONG_TIM_THAY","message":"Không có bài viết này"}}  → 404
$ curl -s $A/posts/$D/comments -H "authorization: Bearer $AN" -H "$J" -d "{\\"body\\":\\"hi\\"}" -w "  → %{http_code}\\n"
{"error":{"code":"BAI_CHUA_DANG","message":"Đăng bài trước rồi mới bình luận được"}}  → 409
# 2) dữ liệu sai
$ curl -s $A/posts/$P/comments -H "authorization: Bearer $BINH" -H "$J" -d "{\\"body\\":\\"   \\"}" -w "  → %{http_code}\\n"
{"error":{"code":"DU_LIEU_SAI","message":"body: không được để trống"}}  → 400
$ curl -s $A/posts/$P/comments -H "authorization: Bearer $BINH" -H "$J" -d "{\\"body\\":\\"x\\",\\"authorId\\":\\"…\\"}" -w "  → %{http_code}\\n"
{"error":{"code":"DU_LIEU_SAI","message":"body: Unrecognized key: \\"authorId\\""}}  → 400
# 3) xoá: BL = bình luận của Bình, BLC = của Chi
$ curl -s -X DELETE $A/comments/$BL -H "authorization: Bearer $CHI" -w "  → %{http_code}\\n"
{"error":{"code":"KHONG_DUOC_PHEP","message":"Chỉ người viết hoặc tác giả bài mới xoá được bình luận này"}}  → 403
$ curl -s -X DELETE $A/comments/$BL -H "authorization: Bearer $AN" -w "  → %{http_code}\\n"
  → 204
$ curl -s -X DELETE $A/comments/$BLC -H "authorization: Bearer $CHI" -w "  → %{http_code}\\n"
  → 204
$ curl -s -X DELETE $A/comments/$BLC -H "authorization: Bearer $CHI" -w "  → %{http_code}\\n"
{"error":{"code":"KHONG_TIM_THAY","message":"Không có bình luận này"}}  → 404`;

const OUT_NFD = `# NFD vs NFC: cùng một chữ "ệ", khác số code point
$ node -e 'const nfd="ệ".normalize("NFD"); console.log("NFC:", [..."ệ".normalize("NFC")].length, "code point · NFD:", [...nfd].length, "code point"); console.log("1000 chữ ệ gõ kiểu NFD =", [...nfd.repeat(1000)].length, "code point")'
NFC: 1 code point · NFD: 3 code point
1000 chữ ệ gõ kiểu NFD = 3000 code point`;

const OUT_NFD_ZOD = `$ node -e "import('zod').then(({z}) =&gt; { const s = 'ệ'.normalize('NFD').repeat(1000); const r = z.string().max(1000).safeParse(s); console.log('không normalize:', r.success ? 'qua' : r.error.issues[0].message) })"
không normalize: Too big: expected string to have &lt;=1000 characters`;

const OUT_NFD2 = `$ # gửi 1000 chữ "ệ" — một lần dạng NFD (điện thoại/macOS), một lần dạng NFC
NFD: 201 · 5011 byte gửi đi
NFC: 201 · 3011 byte gửi đi
$ docker exec fsp-pg psql -U chiase -c "SELECT length(body), octet_length(body) FROM comments WHERE post_id = '…' ORDER BY created_at DESC LIMIT 2"
 length | octet_length 
--------+--------------
   1000 |         3000
   1000 |         3000
(2 rows)`;

const OUT_CASCADE = `$ docker exec fsp-pg psql -U chiase -tAc "SELECT count(*) FROM comments WHERE post_id = '$P'"
2
$ docker exec -i fsp-pg psql -U chiase &lt;&lt;SQL
BEGIN;
-- thử: nếu khoá ngoại KHÔNG cascade (RESTRICT; mặc định NO ACTION cũng chặn y hệt) thì sao?
ALTER TABLE comments DROP CONSTRAINT comments_post_id_fkey,
  ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE RESTRICT;
DELETE FROM posts WHERE id = '$P';
ROLLBACK;
SQL
BEGIN
ALTER TABLE
ERROR:  update or delete on table "posts" violates RESTRICT setting of foreign key constraint "comments_post_id_fkey" on table "comments"
DETAIL:  Key (id)=(…) is referenced from table "comments".
ROLLBACK
$ curl -s -X DELETE $A/posts/$P -H "authorization: Bearer $AN" -w "→ %{http_code}\\n"
→ 204
$ docker exec fsp-pg psql -U chiase -tAc "SELECT count(*) FROM comments WHERE post_id = '$P'"
0`;

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-7-4-quan-he-va-n-plus-1', title: 'Node.js 7.4 — Quan hệ, và bẫy N+1 đo bằng số thật', sub: 'Bài khái niệm gốc về N+1, đo trên PostgreSQL.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-9-2-n-cong-1', title: 'Prisma ORM 9.2 — N+1 ở đủ mọi dạng', sub: 'include, vòng lặp, Promise.all — từng dạng một, chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-3-2-khoa-ngoai', title: 'PostgreSQL 3.2 — Khoá ngoại & toàn vẹn tham chiếu', sub: 'CASCADE, RESTRICT, NO ACTION, SET NULL.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-7-4-recursive-cte', title: 'PostgreSQL 7.4 — CTE đệ quy: đi qua cây phân cấp', sub: 'Khi nào cần bình luận lồng nhiều tầng, đọc cây thế nào.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'Wikipedia — Samy (computer worm)', 'MySpace 04/10/2005: mã độc giấu trong nội dung hồ sơ người dùng, hơn một triệu người chạy nó trong 20 giờ.', 'https://en.wikipedia.org/wiki/Samy_(computer_worm)'),
  nguon('📘', 'Prisma — Aggregation, grouping, and summarizing', '_count, groupBy và cách đếm bản ghi quan hệ.', 'https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing'),
  nguon('📘', 'PostgreSQL — Constraints (Foreign Keys)', 'ON DELETE CASCADE / RESTRICT / NO ACTION / SET NULL.', 'https://www.postgresql.org/docs/current/ddl-constraints.html'),
  nguon('📘', 'Unicode — UAX #15 Unicode Normalization Forms', 'NFC và NFD: cùng một chữ, khác số code point.', 'https://unicode.org/reports/tr15/'),
].join('\n');

const MERMAID = `erDiagram
  users ||--o{ posts : "viết"
  users ||--o{ comments : "viết"
  posts ||--o{ comments : "có"
  posts {
    uuid id PK
    uuid author_id FK
    post_status status
  }
  comments {
    uuid id PK
    uuid post_id FK "ON DELETE CASCADE"
    uuid author_id FK "ON DELETE CASCADE"
    varchar body "1..1000, CHECK"
    timestamptz created_at
  }`;

export default {
  title: '5.1 — Comment model and nested relations|||5.1 — Model Comment và quan hệ lồng nhau',
  slug: 'fp-5-1-comment-model',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Model Comment (hai khoá ngoại ON DELETE CASCADE, CHECK, chỉ mục post_id+created_at), ba endpoint bình luận với luật bài nháp 404/409 và quyền xoá "người viết hoặc tác giả bài" nằm ngay trong câu DELETE; chuẩn hoá NFC trước khi đếm độ dài; commentCount không N+1 — đo thật N+1 (22 truy vấn), _count của Prisma 7 (quét cả bảng 1 triệu dòng, 65 ms) và groupBy theo lô (3 truy vấn, 6,8 ms).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Comments</span>
<h2>Comments: one relation, one count, and the query you did not see</h2>
<p class="lead">A comment is the smallest feature in ChiaSe and the one that teaches the most about relational data. It belongs to two parents at once (a post and a user), it must vanish when its post is deleted, and every post in the feed has to show "12 comments" — which is exactly where the most common performance bug in ORMs, <strong>N+1</strong>, sneaks in. In this lesson we build the model and three endpoints, then measure three ways to count comments on a database with one million rows. The "obvious" fix turns out to be the slowest.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. The model</h3>
<pre><code class="language-prisma">${SCHEMA}</code></pre>
<ul>
<li><strong>Two one-to-many relations.</strong> A post has many comments; a user writes many comments. "Nested relations" in the chapter title means exactly this: <code>Post → Comment ← User</code>. Prisma needs the back-references (<code>comments Comment[]</code> on <code>Post</code> and <code>User</code>) so it can query in both directions.</li>
<li><strong>Flat on purpose.</strong> No <code>parentId</code>, no replies to replies. Threaded comments need a tree query (a recursive CTE), moderation of whole sub-threads and a UI that indents — a week of work for a feature nobody asked for in the user stories of Chapter 1. Cutting it is a scoping decision, written in the README.</li>
<li><strong><code>VARCHAR(1000)</code> plus a hand-written <code>CHECK</code></strong> so a comment made only of spaces is refused even if someone writes SQL by hand (same technique as posts in lesson 4.1).</li>
<li><strong>Index <code>(post_id, created_at, id)</code></strong>: one index serves both questions we ask — "the comments of this post, oldest first" and "how many comments does this post have".</li>
</ul>
<pre><code class="language-sql">${MIGRATION}</code></pre>

<h3>2. Three endpoints and their rules</h3>
<table>
<thead><tr><th>Endpoint</th><th>Who</th><th>Rules</th></tr></thead>
<tbody>
<tr><td><code>GET /posts/:id/comments</code></td><td>anyone (optionalAuth)</td><td>Post must be visible to the caller — someone else's draft is 404, same rule as <code>GET /posts/:id</code>.</td></tr>
<tr><td><code>POST /posts/:id/comments</code></td><td>logged in</td><td>Someone else's draft ⇒ 404 (it "does not exist"). Your own draft ⇒ <strong>409</strong> <code>BAI_CHUA_DANG</code>: it exists, you can see it, but the action conflicts with its state.</td></tr>
<tr><td><code>DELETE /comments/:id</code></td><td>logged in</td><td>The comment's author <em>or</em> the post's author (so authors can clean spam off their own posts). Others ⇒ 403.</td></tr>
</tbody>
</table>
<pre><code class="language-ts">${SCHEMA_TS}</code></pre>
<pre><code class="language-ts">${SVC}</code></pre>
<p>Two details worth reading twice. First, the permission check for delete is <em>inside</em> the <code>DELETE</code> (<code>deleteMany</code> with <code>OR: [{ authorId }, { post: { authorId } }]</code>), exactly like the ownership check of lesson 4.1 — check and write are one statement. Second, <code>taoBinhLuan</code> checks the post and then inserts; if the post is deleted in the few milliseconds between, the foreign key refuses the insert with <code>P2003</code>, and we answer 404 instead of letting it become a 500.</p>
<div class="out">${OUT_TAO}</div>
<p>The surrounding spaces were trimmed, the author came from the token, and the list is public. Now the rules:</p>
<div class="out">${OUT_QUYEN}</div>
<p>Read the delete sequence: Chi (a third user) cannot delete Bình's comment — 403. An can, because it is on An's post — 204. Chi deletes her own — 204. Deleting again gives 404. Notice also the strict schema refusing <code>authorId</code>, and its message <code>body: Unrecognized key</code> — "body" here is the request body, which is confusing when the field itself is called <code>body</code>. Lesson 5.3 fixes that message shape for the whole API.</p>

<h3>3. The Vietnamese trap: 1000 characters that count as 3000</h3>
<p>The limit is "1000 characters". But what is a character? Vietnamese letters can arrive in two Unicode forms: <strong>NFC</strong> (one code point for "ệ") or <strong>NFD</strong> (the base letter plus two combining marks — three code points). Many phones and macOS text fields produce NFD.</p>
<div class="out">${OUT_NFD}</div>
<div class="out">${OUT_NFD_ZOD}</div>
<p>Without normalization, a user who types exactly 1000 letters on a Mac is told the comment is too long. The schema therefore normalizes to NFC <em>before</em> checking the length (the <code>.transform(…).pipe(…)</code> in the schema above). Real result:</p>
<div class="out">${OUT_NFD2}</div>
<p>Both forms are accepted, and both are stored identically: 1000 characters, 3000 bytes in UTF-8. Storing one form also matters for search — <code>WHERE body LIKE '%Việt%'</code> does not match an NFD "Việt". (Lesson 3.1 met the same problem with passwords.)</p>

<h3>4. Delete a post, and its comments go with it</h3>
<div class="out">${OUT_CASCADE}</div>
<p>The middle command proves what the foreign key protects us from: with <code>RESTRICT</code> (and the SQL default <code>NO ACTION</code> behaves the same here) PostgreSQL refuses to delete a post that still has comments — error <code>23503</code>. With <code>ON DELETE CASCADE</code> one <code>DELETE</code> on <code>posts</code> removes the comments in the same transaction; no loop in our code, and no orphan rows if the process crashes halfway.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — cascade is not free.</strong> Deleting a post with 200,000 comments deletes 200,000 rows inside one transaction, holding locks while it runs. For ChiaSe that is fine. For a platform with viral posts you would mark the post deleted and remove comments in batches in the background. Know the trade-off; choose deliberately.</p></div>

<h3>5. "12 comments": three ways to count, measured</h3>
<p>The feed shows a <code>commentCount</code> for every post. To see what each version really does, ChiaSe can count and print its own SQL (dev only):</p>
<pre><code class="language-ts">${PRISMA_TS}</code></pre>
<p><strong>Version A — the one everybody writes first:</strong></p>
<pre><code class="language-ts">${N1_CODE}</code></pre>
<div class="out">${OUT_N1}</div>
<p><strong>22 queries for one page</strong>: one for the posts, one for the authors, and one <code>COUNT</code> per post. That is N+1 (here 20+2). On a laptop with the database on <code>localhost</code> each query costs well under a millisecond of network, so it "works". In production the database is on another machine; every query pays a network round trip, and 20 of them share a pool of 10 connections — with 50 users scrolling at once, the pool becomes the bottleneck.</p>
<p><strong>Version B — the ORM feature:</strong> Prisma can count relations for you: <code>_count: { select: { comments: true } }</code>. Two queries instead of 22:</p>
<div class="out">${OUT_COUNT}</div>
<p>Look at the SQL before celebrating. The subquery <code>SELECT post_id, COUNT(*) FROM comments WHERE 1=1 GROUP BY post_id</code> counts comments for <em>every post in the table</em>, then joins the 20 we need. With 87 comments nobody notices. So we loaded one million comments (1000 old posts × 1000) and asked PostgreSQL how it runs it:</p>
<div class="out">${OUT_EXPLAIN}</div>
<p><code>Parallel Seq Scan on comments … rows=333362 loops=3</code>: three processes read all 1,000,087 comments to answer a question about 20 posts. The cost grows with the size of the <em>whole table</em>, forever.</p>
<p><strong>Version C — count the batch, and only the batch:</strong></p>
<pre><code class="language-ts">${DEM}</code></pre>
<div class="out">${OUT_GROUPBY}</div>
<p>One extra query, <code>WHERE post_id IN (…20 ids…) GROUP BY post_id</code>, served by the <code>comments_post_idx</code> index. The single-post endpoints reuse the same function with a batch of one, so there is exactly one place that counts.</p>
<table>
<thead><tr><th>Version</th><th>Queries / page</th><th>87 comments</th><th>1,000,087 comments</th></tr></thead>
<tbody>
<tr><td>A. count per post (N+1)</td><td>22</td><td>19.3 ms</td><td>14.4 ms</td></tr>
<tr><td>B. Prisma <code>_count</code></td><td>2</td><td>6.2 ms</td><td><strong>65.2 ms</strong></td></tr>
<tr><td>C. <code>groupBy … IN (ids)</code></td><td>3</td><td>—</td><td><strong>6.8 ms</strong></td></tr>
</tbody>
</table>
<p style="font-size:.9em">Median of 28 requests with <code>curl</code>, API and PostgreSQL 18 on the same machine, 24/11/2026. A was measured with 87 comments in the first run; C replaced B before the small-table run was repeated, hence the dash.</p>
<p>The lesson is not "never use <code>_count</code>" — on a single post or a small table it is fine. The lesson is: <strong>fewer queries is not the goal; less work is</strong>. Read the SQL your ORM generates, and test with data the size you expect in a year, not the size of your seed file.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">see</span><span class="lz-d">turn on the query counter: how many SQL statements does ONE request run?</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">read</span><span class="lz-d">print the SQL: what does the ORM actually send?</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">grow</span><span class="lz-d">load realistic volume (generate_series) — 1M rows takes 30 s</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">explain</span><span class="lz-d">EXPLAIN ANALYZE: Seq Scan on a big table = red flag</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">batch</span><span class="lz-d">one query for the whole page, filtered to the page's ids</span></div>
</div>

<h3>🕵️ Hacker's corner — Samy, MySpace (2005)</h3>
<p>On 4 October 2005 a user named Samy Kamkar put a small script inside the text of his MySpace profile. Anyone who viewed the profile ran it; the script added Samy as a friend and copied itself into the viewer's own profile. Within about 20 hours more than one million users had run it, and MySpace had to go offline to clean up (Wikipedia, "Samy (computer worm)"). The root cause: text written by users was shown to other users <em>as HTML</em>.</p>
<p>Comments are exactly that kind of text. ChiaSe's position: the API stores what the user typed, unchanged (after trim and NFC), and returns it as a JSON string. Making it safe is the job of whoever turns it into a page — Chapter 6 renders comments as text with React, which escapes it, and never with <code>dangerouslySetInnerHTML</code>. "Cleaning" HTML on input instead tends to corrupt legitimate text (<code>a &lt; b</code>) and still miss the context it will be used in.</p>

<h3>In everyday life</h3>
<p>You are the building manager and want to put "letters waiting" on 20 mailboxes. N+1 is walking to each box, opening it, counting, walking back — 20 trips. Prisma's <code>_count</code> here is asking the post office to count letters for <em>every address in the city</em> and then reading your 20 lines. The batch query is handing the post office a list of your 20 box numbers and getting 20 numbers back.</p>

<h3>On a real job</h3>
<p>N+1 is the performance finding you will meet most often in outsourcing code reviews, in every stack: Hibernate lazy collections, Entity Framework navigation properties, Prisma loops. It rarely shows on the developer's laptop and appears on the customer's staging server with real data. What makes you useful in that ticket: show the query count per request (like our <code>· 22 sql</code> log), show the generated SQL, propose the batched version, and attach before/after numbers measured on a realistic volume. Also expect the reverse: a senior asking "did you check what <code>_count</code> generates?" — now you have.</p>

${spring(false, 'JPA maps the same relations with <code>@ManyToOne</code> on <code>Comment</code> and <code>@OneToMany(mappedBy…)</code> on <code>Post</code>; <code>cascade = CascadeType.REMOVE</code> in JPA is done by Hibernate in memory (one DELETE per child) — prefer <code>ON DELETE CASCADE</code> in the Flyway migration. N+1 in Spring usually comes from lazy collections; fix with a batch query or <code>@EntityGraph</code>, and turn on Hibernate statistics to count queries.', [
  ['sb-6-3-quan-he-jpa', 'Spring Boot 6.3 — Relations: @ManyToOne, @OneToMany, @ManyToMany'],
  ['sb-7-1-n-cong-1', 'Spring Boot 7.1 — The N+1 problem: detect and fix'],
  ['sb-6-4-jpql-query', 'Spring Boot 6.4 — Queries: JPQL, @Query, projections and pagination'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"What is the N+1 query problem and how do you detect it?"</strong> — One query for a list, then one per item for related data. Detect by counting queries per request (ORM logging, query statistics), not by reading code alone. Fix by batching (<code>WHERE … IN</code>), a join, or the ORM's eager loading — then check the SQL it produces.</li>
<li><strong>"ON DELETE CASCADE or delete children in application code?"</strong> — Cascade in the database is atomic and cannot be forgotten by a second code path; application deletes allow hooks (files, events) but risk orphans. For huge child sets, soft-delete the parent and clean up in batches.</li>
<li><strong>"How would you show a comment count for each post in a feed?"</strong> — Batch count for the page's ids; for very hot posts, a denormalized <code>comment_count</code> column updated in the same transaction as the insert/delete (and accept the write contention).</li>
<li><strong>"Why normalize Unicode input?"</strong> — The same visible text can have different code points (NFC vs NFD): length limits, uniqueness and search break otherwise. Normalize at the boundary, once.</li>
<li><strong>"404, 403 or 409 when commenting on a draft?"</strong> — Someone else's draft: 404 (do not confirm it exists). Your own draft: 409 — the resource exists and you may see it, but its state conflicts with the action.</li>
</ol>

<h3>🧪 Lab 5.1 (60–75 minutes)</h3>
<div class="callout ok">
<ol>
<li>On branch <code>ch5/binh-luan</code>, add the <code>Comment</code> model and the back-references; create the migration with <code>--create-only</code>, add the <code>CHECK</code>, apply it, run <code>prisma generate</code> (Prisma 7 does not do it for you after migrate).</li>
<li>Write the schema (with NFC), service, controller and the three routes. Reproduce the 201/404/409/400/403/204/404 sequence of section 2 with An, Bình and a third account you register yourself.</li>
<li>Add the query counter to <code>db/prisma.ts</code> and <code>log-request.ts</code>. Write version A of the feed count; read <code>· N sql</code> in your log.</li>
<li>Load volume: 1000 old posts × 1000 comments with <code>generate_series</code>. Try version B, run <code>EXPLAIN ANALYZE</code> on its SQL, then write version C. Fill in your own table of section 5.</li>
<li>Prove cascade: count a post's comments, delete the post through the API, count again.</li>
</ol>
<p><strong>Done when:</strong> the feed shows a correct <code>commentCount</code> with the same number of queries for any page size, deleting a post leaves no comments behind, and 1000 Vietnamese letters typed in NFD are accepted.</p>
<p><strong>Rubric (10):</strong> model + migration with CASCADE and CHECK (2) · three endpoints with the 404/409/403 rules (2) · delete permission inside the DELETE (1) · NFC before length (1) · query counter + N+1 reproduced (1) · <code>_count</code> measured on 1M rows and explained with EXPLAIN (2) · batch count (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>def2e66</code> on <code>ch5/binh-luan</code>: <code>prisma/schema.prisma</code>, migration <code>*_comments</code>, <code>schemas/comment.schema.ts</code>, <code>services/comment.service.ts</code>, <code>controllers/comment.controller.ts</code>, <code>db/prisma.ts</code> (counter), <code>middlewares/log-request.ts</code>, <code>services/post.service.ts</code> (<code>demBinhLuan</code>, <code>raDsBai</code>, <code>raMotBai</code>). Volume script: <code>INSERT INTO comments … SELECT … FROM posts p, generate_series(1,1000) k</code> — took about 30 s on the home machine. If <code>prisma.comment</code> does not exist in TypeScript, you forgot <code>npx prisma generate</code>. If your <code>EXPLAIN</code> for version B shows an index scan, your table is still small — PostgreSQL picks plans by size; add more rows and <code>ANALYZE</code>.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">one-to-many (1-n)</span><span class="v">One row on one side relates to many rows on the other (a post has many comments).</span></div>
  <div class="kv"><span class="k">N+1</span><span class="v">One query for a list + one query per item for related data.</span></div>
  <div class="kv"><span class="k">ON DELETE CASCADE</span><span class="v">Deleting the parent row deletes child rows in the same statement.</span></div>
  <div class="kv"><span class="k">23503</span><span class="v">PostgreSQL foreign_key_violation: a delete/insert would break a reference. Prisma: P2003.</span></div>
  <div class="kv"><span class="k">NFC / NFD</span><span class="v">Composed vs decomposed Unicode forms of the same text.</span></div>
  <div class="kv"><span class="k">Seq Scan</span><span class="v">PostgreSQL reads the whole table — fine for small tables, a warning on big ones.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>Comment</code> has two parents; both foreign keys cascade; a hand-written CHECK refuses blank text.</li>
<li>Comment on someone else's draft ⇒ 404, on your own draft ⇒ 409; delete = comment author or post author, checked inside the DELETE.</li>
<li>Normalize to NFC before counting characters.</li>
<li>Count comments for a page in one batch query; Prisma 7's <code>_count</code> in a list scans the whole comments table.</li>
<li>Count queries per request and read the SQL — then test with realistic volume.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bình luận</span>
<h2>Bình luận: một quan hệ, một con số, và câu truy vấn bạn không nhìn thấy</h2>
<p class="lead">Bình luận là tính năng nhỏ nhất của ChiaSe, nhưng dạy nhiều nhất về dữ liệu quan hệ. Nó thuộc về HAI "cha" cùng lúc (một bài và một người), phải biến mất khi bài bị xoá, và mỗi bài trên feed phải hiện "12 bình luận" — đúng chỗ lỗi hiệu năng phổ biến nhất của ORM, <strong>N+1</strong>, lẻn vào. Bài này dựng model và ba endpoint, rồi đo ba cách đếm bình luận trên CSDL có một triệu dòng. Cách "sửa hiển nhiên" hoá ra lại chậm nhất.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Model</h3>
<pre><code class="language-prisma">${SCHEMA}</code></pre>
<ul>
<li><strong>Hai quan hệ một–nhiều.</strong> Một bài có nhiều bình luận; một người viết nhiều bình luận. "Quan hệ lồng nhau" trong tên chương chính là thế này: <code>Post → Comment ← User</code>. Prisma cần trường ngược (<code>comments Comment[]</code> ở <code>Post</code> và <code>User</code>) để truy vấn được cả hai chiều.</li>
<li><strong>Cố tình để phẳng.</strong> Không có <code>parentId</code>, không trả lời của trả lời. Bình luận dạng cây cần truy vấn cây (CTE đệ quy), kiểm duyệt cả nhánh con, giao diện thụt lề — một tuần công cho tính năng không có trong user story của Chương 1. Cắt nó là quyết định về phạm vi, ghi vào README.</li>
<li><strong><code>VARCHAR(1000)</code> + <code>CHECK</code> viết tay</strong>: bình luận toàn khoảng trắng bị từ chối kể cả khi ai đó ghi SQL bằng tay (cùng kỹ thuật với bài viết ở bài 4.1).</li>
<li><strong>Chỉ mục <code>(post_id, created_at, id)</code></strong>: một chỉ mục phục vụ cả hai câu hỏi ta hay hỏi — "bình luận của bài này, cũ trước" và "bài này có bao nhiêu bình luận".</li>
</ul>
<pre><code class="language-sql">${MIGRATION}</code></pre>

<h3>2. Ba endpoint và luật của chúng</h3>
<table>
<thead><tr><th>Endpoint</th><th>Ai gọi</th><th>Luật</th></tr></thead>
<tbody>
<tr><td><code>GET /posts/:id/comments</code></td><td>ai cũng được (optionalAuth)</td><td>Bài phải "nhìn thấy được" với người gọi — nháp của người khác là 404, cùng luật với <code>GET /posts/:id</code>.</td></tr>
<tr><td><code>POST /posts/:id/comments</code></td><td>đã đăng nhập</td><td>Nháp của người khác ⇒ 404 (coi như "không tồn tại"). Nháp của chính mình ⇒ <strong>409</strong> <code>BAI_CHUA_DANG</code>: bài có thật, bạn thấy được, nhưng hành động xung đột với trạng thái của nó.</td></tr>
<tr><td><code>DELETE /comments/:id</code></td><td>đã đăng nhập</td><td>Người viết bình luận <em>hoặc</em> tác giả bài (để tác giả dọn rác trên bài của mình). Người khác ⇒ 403.</td></tr>
</tbody>
</table>
<pre><code class="language-ts">${SCHEMA_TS}</code></pre>
<pre><code class="language-ts">${SVC}</code></pre>
<p>Hai chi tiết đáng đọc hai lần. Một: kiểm quyền xoá nằm <em>trong</em> câu <code>DELETE</code> (<code>deleteMany</code> với <code>OR: [{ authorId }, { post: { authorId } }]</code>), y như kiểm chủ sở hữu ở bài 4.1 — kiểm và ghi là một câu lệnh. Hai: <code>taoBinhLuan</code> kiểm bài rồi mới chèn; nếu bài bị xoá đúng vài mili giây ở giữa, khoá ngoại từ chối câu INSERT với <code>P2003</code>, và ta trả 404 thay vì để nó thành 500.</p>
<div class="out">${OUT_TAO}</div>
<p>Khoảng trắng hai đầu đã bị cắt, tác giả lấy từ token, danh sách công khai. Giờ đến các luật:</p>
<div class="out">${OUT_QUYEN}</div>
<p>Đọc chuỗi xoá: Chi (tài khoản thứ ba) không xoá được bình luận của Bình — 403. An xoá được, vì nó nằm trên bài của An — 204. Chi xoá bình luận của chính mình — 204. Xoá lần nữa ra 404. Để ý thêm: schema strict từ chối <code>authorId</code>, nhưng câu báo <code>body: Unrecognized key</code> gây rối — "body" ở đây là thân request, trong khi trường cũng tên là <code>body</code>. Bài 5.3 sửa hình dạng lỗi này cho cả API.</p>

<h3>3. Bẫy tiếng Việt: 1000 chữ mà đếm thành 3000</h3>
<p>Giới hạn là "1000 ký tự". Nhưng ký tự là gì? Chữ Việt có thể tới ở hai dạng Unicode: <strong>NFC</strong> (một code point cho "ệ") hoặc <strong>NFD</strong> (chữ gốc + hai dấu ghép — ba code point). Nhiều điện thoại và ô nhập trên macOS sinh ra NFD.</p>
<div class="out">${OUT_NFD}</div>
<div class="out">${OUT_NFD_ZOD}</div>
<p>Không chuẩn hoá, người gõ đúng 1000 chữ trên máy Mac sẽ bị báo "quá dài". Vì vậy schema chuẩn hoá về NFC <em>trước</em> khi kiểm độ dài (đoạn <code>.transform(…).pipe(…)</code> ở trên). Kết quả thật:</p>
<div class="out">${OUT_NFD2}</div>
<p>Cả hai dạng đều được nhận và được lưu giống hệt nhau: 1000 ký tự, 3000 byte UTF-8. Lưu MỘT dạng còn quan trọng cho tìm kiếm — <code>WHERE body LIKE '%Việt%'</code> không khớp chữ "Việt" dạng NFD. (Bài 3.1 đã gặp đúng chuyện này với mật khẩu.)</p>

<h3>4. Xoá bài, bình luận đi theo</h3>
<div class="out">${OUT_CASCADE}</div>
<p>Lệnh ở giữa chứng minh khoá ngoại bảo vệ ta khỏi điều gì: với <code>RESTRICT</code> (mặc định <code>NO ACTION</code> của SQL cũng chặn y hệt ở đây) PostgreSQL từ chối xoá bài còn bình luận — lỗi <code>23503</code>. Với <code>ON DELETE CASCADE</code>, một câu <code>DELETE</code> trên <code>posts</code> xoá luôn bình luận trong cùng giao dịch; không vòng lặp nào trong mã, không dòng mồ côi nếu tiến trình chết giữa chừng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — cascade không miễn phí.</strong> Xoá một bài có 200.000 bình luận là xoá 200.000 dòng trong một giao dịch, giữ khoá suốt lúc chạy. Với ChiaSe thế là ổn. Với nền tảng có bài "viral", người ta đánh dấu bài đã xoá rồi dọn bình luận theo từng lô ở nền. Biết đánh đổi; chọn có chủ đích.</p></div>

<h3>5. "12 bình luận": ba cách đếm, đo thật</h3>
<p>Feed hiện <code>commentCount</code> cho mỗi bài. Để thấy mỗi phiên bản thật sự làm gì, ChiaSe tự đếm và in SQL của nó (chỉ trên máy dev):</p>
<pre><code class="language-ts">${PRISMA_TS}</code></pre>
<p><strong>Phiên bản A — bản ai cũng viết đầu tiên:</strong></p>
<pre><code class="language-ts">${N1_CODE}</code></pre>
<div class="out">${OUT_N1}</div>
<p><strong>22 truy vấn cho một trang</strong>: một lấy bài, một lấy tác giả, và mỗi bài một câu <code>COUNT</code>. Đó là N+1 (ở đây 20+2). Trên laptop, CSDL ở <code>localhost</code>, mỗi truy vấn tốn chưa tới một mili giây đường mạng nên nó "chạy được". Trên production CSDL nằm ở máy khác; mỗi truy vấn trả một vòng mạng, và 20 truy vấn tranh nhau pool 10 kết nối — 50 người cùng cuộn feed là pool thành nút thắt.</p>
<p><strong>Phiên bản B — dùng tính năng của ORM:</strong> Prisma đếm quan hệ hộ bạn: <code>_count: { select: { comments: true } }</code>. Hai truy vấn thay cho 22:</p>
<div class="out">${OUT_COUNT}</div>
<p>Đọc SQL trước khi ăn mừng. Truy vấn con <code>SELECT post_id, COUNT(*) FROM comments WHERE 1=1 GROUP BY post_id</code> đếm bình luận cho <em>MỌI bài trong bảng</em>, rồi mới JOIN với 20 bài ta cần. Với 87 bình luận chẳng ai nhận ra. Vậy ta nạp một triệu bình luận (1000 bài cũ × 1000) và hỏi PostgreSQL nó chạy thế nào:</p>
<div class="out">${OUT_EXPLAIN}</div>
<p><code>Parallel Seq Scan on comments … rows=333362 loops=3</code>: ba tiến trình đọc toàn bộ 1.000.087 bình luận để trả lời câu hỏi về 20 bài. Chi phí tăng theo cỡ <em>cả bảng</em>, mãi mãi.</p>
<p><strong>Phiên bản C — đếm đúng lô, và chỉ lô đó:</strong></p>
<pre><code class="language-ts">${DEM}</code></pre>
<div class="out">${OUT_GROUPBY}</div>
<p>Thêm một truy vấn, <code>WHERE post_id IN (…20 id…) GROUP BY post_id</code>, đi qua chỉ mục <code>comments_post_idx</code>. Các endpoint một bài dùng lại đúng hàm này với lô một phần tử, nên chỉ có MỘT chỗ đếm.</p>
<table>
<thead><tr><th>Phiên bản</th><th>Truy vấn / trang</th><th>87 bình luận</th><th>1.000.087 bình luận</th></tr></thead>
<tbody>
<tr><td>A. đếm từng bài (N+1)</td><td>22</td><td>19,3 ms</td><td>14,4 ms</td></tr>
<tr><td>B. <code>_count</code> của Prisma</td><td>2</td><td>6,2 ms</td><td><strong>65,2 ms</strong></td></tr>
<tr><td>C. <code>groupBy … IN (ids)</code></td><td>3</td><td>—</td><td><strong>6,8 ms</strong></td></tr>
</tbody>
</table>
<p style="font-size:.9em">Trung vị 28 lần gọi bằng <code>curl</code>, API và PostgreSQL 18 cùng một máy, 24/11/2026. A đo với 87 bình luận ở lượt đầu; C thay B trước khi đo lại bảng nhỏ nên để trống.</p>
<p>Bài học không phải "đừng bao giờ dùng <code>_count</code>" — cho một bài hoặc bảng nhỏ thì ổn. Bài học là: <strong>mục tiêu không phải ít truy vấn, mà là ít việc</strong>. Đọc SQL mà ORM sinh ra, và thử với lượng dữ liệu bạn sẽ có sau một năm, không phải cỡ tệp seed.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">thấy</span><span class="lz-d">bật bộ đếm: MỘT request chạy bao nhiêu câu SQL?</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">đọc</span><span class="lz-d">in SQL ra: ORM thật sự gửi gì?</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">bơm</span><span class="lz-d">nạp lượng thật (generate_series) — 1 triệu dòng mất 30 giây</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">explain</span><span class="lz-d">EXPLAIN ANALYZE: Seq Scan trên bảng lớn = cờ đỏ</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">gom lô</span><span class="lz-d">một truy vấn cho cả trang, lọc đúng id của trang</span></div>
</div>

<h3>🕵️ Góc hacker — Samy, MySpace (2005)</h3>
<p>Ngày 04/10/2005, một người dùng tên Samy Kamkar giấu một đoạn script nhỏ trong phần chữ của trang hồ sơ MySpace. Ai xem hồ sơ là chạy nó; script thêm Samy làm bạn và tự chép mình vào hồ sơ của người xem. Trong khoảng 20 giờ, hơn một triệu người đã chạy nó, MySpace phải tạm ngừng để dọn (Wikipedia, "Samy (computer worm)"). Gốc rễ: chữ do người dùng viết được hiện cho người khác <em>như HTML</em>.</p>
<p>Bình luận đúng là loại chữ đó. Lập trường của ChiaSe: API lưu nguyên văn người dùng gõ (sau trim và NFC) và trả về dưới dạng chuỗi JSON. Làm cho nó an toàn là việc của nơi biến nó thành trang — Chương 6 hiện bình luận dạng CHỮ bằng React (React tự thoát ký tự), không bao giờ dùng <code>dangerouslySetInnerHTML</code>. "Làm sạch" HTML ngay lúc nhận thường làm hỏng chữ hợp lệ (<code>a &lt; b</code>) mà vẫn trượt ngữ cảnh nơi nó sẽ được dùng.</p>

<h3>Liên hệ đời thường</h3>
<p>Bạn là quản lý toà nhà, muốn ghi "số thư đang chờ" lên 20 hộp thư. N+1 là đi tới từng hộp, mở ra, đếm, đi về — 20 chuyến. <code>_count</code> của Prisma ở đây giống nhờ bưu điện đếm thư cho <em>mọi địa chỉ trong thành phố</em> rồi đọc 20 dòng của bạn. Truy vấn theo lô là đưa bưu điện danh sách 20 số hộp và nhận lại 20 con số.</p>

<h3>Tình huống đi làm thật</h3>
<p>N+1 là phát hiện hiệu năng bạn gặp nhiều nhất khi review mã ở công ty outsourcing, ở mọi stack: collection lazy của Hibernate, navigation property của Entity Framework, vòng lặp Prisma. Nó hiếm khi lộ trên laptop của dev, và hiện ra trên máy staging của khách với dữ liệu thật. Điều làm bạn có ích trong ticket đó: đưa ra số truy vấn mỗi request (như dòng log <code>· 22 sql</code>), đưa SQL được sinh ra, đề xuất bản gom lô, và đính kèm số đo trước/sau trên lượng dữ liệu thật. Và chuẩn bị cho câu ngược lại: anh senior hỏi "em đã xem <code>_count</code> sinh ra gì chưa?" — giờ thì bạn xem rồi.</p>

${spring(false, 'JPA ánh xạ cùng các quan hệ này bằng <code>@ManyToOne</code> ở <code>Comment</code> và <code>@OneToMany(mappedBy…)</code> ở <code>Post</code>; <code>cascade = CascadeType.REMOVE</code> của JPA do Hibernate làm trong bộ nhớ (mỗi con một câu DELETE) — nên dùng <code>ON DELETE CASCADE</code> trong migration Flyway. N+1 ở Spring thường đến từ collection lazy; sửa bằng truy vấn gom lô hoặc <code>@EntityGraph</code>, và bật Hibernate statistics để đếm truy vấn.', [
  ['sb-6-3-quan-he-jpa', 'Spring Boot 6.3 — Quan hệ: @ManyToOne, @OneToMany, @ManyToMany'],
  ['sb-7-1-n-cong-1', 'Spring Boot 7.1 — Vấn đề N+1: phát hiện và sửa'],
  ['sb-6-4-jpql-query', 'Spring Boot 6.4 — Truy vấn: JPQL, @Query, projection và phân trang'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"N+1 là gì, phát hiện thế nào?"</strong> — Một truy vấn lấy danh sách, rồi mỗi phần tử thêm một truy vấn lấy dữ liệu liên quan. Phát hiện bằng cách ĐẾM truy vấn mỗi request (log của ORM, thống kê truy vấn), không chỉ đọc mã. Sửa bằng gom lô (<code>WHERE … IN</code>), JOIN, hoặc eager loading của ORM — rồi kiểm SQL nó sinh ra.</li>
<li><strong>"ON DELETE CASCADE hay xoá con trong mã ứng dụng?"</strong> — Cascade trong CSDL là nguyên tử, không bị một đường mã thứ hai bỏ quên; xoá trong mã cho phép làm thêm việc (xoá tệp, bắn sự kiện) nhưng dễ để lại dòng mồ côi. Tập con rất lớn: xoá mềm cha rồi dọn theo lô.</li>
<li><strong>"Hiện số bình luận cho mỗi bài trên feed thế nào?"</strong> — Đếm theo lô cho các id của trang; bài cực "nóng" thì thêm cột <code>comment_count</code> cập nhật trong cùng giao dịch với lúc thêm/xoá bình luận (chấp nhận tranh chấp khi ghi).</li>
<li><strong>"Vì sao phải chuẩn hoá Unicode ở đầu vào?"</strong> — Cùng một chữ nhìn thấy có thể khác code point (NFC/NFD): giới hạn độ dài, tính duy nhất và tìm kiếm sẽ sai. Chuẩn hoá ở biên, một lần.</li>
<li><strong>"Bình luận vào bài nháp: 404, 403 hay 409?"</strong> — Nháp của người khác: 404 (đừng xác nhận nó tồn tại). Nháp của mình: 409 — tài nguyên có, bạn thấy được, nhưng trạng thái của nó xung đột với hành động.</li>
</ol>

<h3>🧪 Lab 5.1 (60–75 phút)</h3>
<div class="callout ok">
<ol>
<li>Trên nhánh <code>ch5/binh-luan</code>, thêm model <code>Comment</code> và các trường ngược; tạo migration bằng <code>--create-only</code>, thêm <code>CHECK</code>, áp dụng, chạy <code>prisma generate</code> (Prisma 7 không tự làm sau migrate).</li>
<li>Viết schema (có NFC), service, controller và ba route. Tái hiện chuỗi 201/404/409/400/403/204/404 ở mục 2 với An, Bình và một tài khoản thứ ba bạn tự đăng ký.</li>
<li>Thêm bộ đếm truy vấn vào <code>db/prisma.ts</code> và <code>log-request.ts</code>. Viết phiên bản A cho feed; đọc <code>· N sql</code> trong log.</li>
<li>Bơm dữ liệu: 1000 bài cũ × 1000 bình luận bằng <code>generate_series</code>. Thử phiên bản B, chạy <code>EXPLAIN ANALYZE</code> trên SQL của nó, rồi viết phiên bản C. Điền bảng số đo của riêng bạn như mục 5.</li>
<li>Chứng minh cascade: đếm bình luận của một bài, xoá bài qua API, đếm lại.</li>
</ol>
<p><strong>Xong khi:</strong> feed hiện <code>commentCount</code> đúng với số truy vấn KHÔNG đổi dù trang to hay nhỏ, xoá bài không để lại bình luận nào, và 1000 chữ Việt gõ kiểu NFD vẫn được nhận.</p>
<p><strong>Thang điểm (10):</strong> model + migration có CASCADE và CHECK (2) · ba endpoint đúng luật 404/409/403 (2) · quyền xoá nằm trong câu DELETE (1) · NFC trước khi đếm độ dài (1) · bộ đếm truy vấn + tái hiện N+1 (1) · đo <code>_count</code> trên 1 triệu dòng và giải thích bằng EXPLAIN (2) · đếm theo lô (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>def2e66</code> trên <code>ch5/binh-luan</code>: <code>prisma/schema.prisma</code>, migration <code>*_comments</code>, <code>schemas/comment.schema.ts</code>, <code>services/comment.service.ts</code>, <code>controllers/comment.controller.ts</code>, <code>db/prisma.ts</code> (bộ đếm), <code>middlewares/log-request.ts</code>, <code>services/post.service.ts</code> (<code>demBinhLuan</code>, <code>raDsBai</code>, <code>raMotBai</code>). Lệnh bơm dữ liệu: <code>INSERT INTO comments … SELECT … FROM posts p, generate_series(1,1000) k</code> — mất khoảng 30 giây trên máy nhà. TypeScript báo không có <code>prisma.comment</code>: bạn quên <code>npx prisma generate</code>. <code>EXPLAIN</code> của phiên bản B ra Index Scan: bảng của bạn còn nhỏ — PostgreSQL chọn kế hoạch theo cỡ dữ liệu; thêm dòng rồi chạy <code>ANALYZE</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">một–nhiều (1-n)</span><span class="v">Một dòng bên này ứng với nhiều dòng bên kia (một bài có nhiều bình luận).</span></div>
  <div class="kv"><span class="k">N+1</span><span class="v">Một truy vấn lấy danh sách + mỗi phần tử một truy vấn lấy dữ liệu liên quan.</span></div>
  <div class="kv"><span class="k">ON DELETE CASCADE</span><span class="v">Xoá dòng cha thì CSDL xoá luôn dòng con trong cùng câu lệnh.</span></div>
  <div class="kv"><span class="k">23503</span><span class="v">Mã lỗi PostgreSQL foreign_key_violation: xoá/chèn làm gãy tham chiếu. Prisma: P2003.</span></div>
  <div class="kv"><span class="k">NFC / NFD</span><span class="v">Dạng dựng sẵn và dạng tách dấu của cùng một đoạn chữ Unicode.</span></div>
  <div class="kv"><span class="k">Seq Scan</span><span class="v">PostgreSQL đọc cả bảng — ổn với bảng nhỏ, là cảnh báo với bảng lớn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Comment</code> có hai cha; cả hai khoá ngoại đều cascade; CHECK viết tay chặn chữ toàn khoảng trắng.</li>
<li>Bình luận vào nháp người khác ⇒ 404, nháp của mình ⇒ 409; xoá = người viết hoặc tác giả bài, kiểm ngay trong câu DELETE.</li>
<li>Chuẩn hoá NFC trước khi đếm ký tự.</li>
<li>Đếm bình luận cho cả trang bằng một truy vấn theo lô; <code>_count</code> của Prisma 7 trong danh sách quét cả bảng comments.</li>
<li>Đếm truy vấn mỗi request và đọc SQL — rồi thử với lượng dữ liệu thật.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
