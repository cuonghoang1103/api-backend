/**
 * 5.2 — Phân trang kiểu cursor cho feed (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (PostgreSQL 18.7, Prisma 7.10.1, Express 5.3.0), repo chiase commit 70994ac + b6bb884 (nhánh ch5/binh-luan).
 * Phát hiện thật 24/11: OFFSET có bài mới chen vào ⇒ lặp bài ("Nhập lô 22" hai lần); 25 bài cùng created_at (một INSERT) ⇒ cursor
 * tạo từ Date (mili giây) so với giá trị micro giây ⇒ feed THIẾU 15 bài ⇒ sửa bằng timestamptz(3) (ALTER 1 triệu dòng 1,3 s, viết lại
 * bảng). Điều kiện cursor dạng OR (Prisma sinh) KHÔNG dùng chỉ mục để nhảy: lọc 150 000 dòng, 2 909 buffer — chậm như OFFSET 150 000;
 * thêm created_at <= t ⇒ 5 buffer, 0,086 ms; API trang sâu 25,2 ms ⇒ 6,3 ms. Cursor có sẵn của Prisma (cursor: { id }) trả 0 bài khi bài
 * làm cursor bị xoá. Express 5: gán req.query ⇒ TypeError. Đổi GET /posts sang { items, nextCursor } làm checkpoint-4 (client cũ) trượt.
 * Nguồn (GET 200, 24/11/2026): use-the-index-luke.com/no-offset; PostgreSQL docs (datetime, row comparison, LIMIT/OFFSET);
 * Prisma docs pagination; Express "Migrating to Express 5" (req.query là getter).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const OUT_OFFSET_TROI = `# OFFSET: đọc trang 1, có người đăng bài mới, rồi đọc trang 2
$ docker exec fsp-pg psql -U chiase -tAc "SELECT title FROM posts WHERE status = 'published' ORDER BY created_at DESC, id DESC LIMIT 3 OFFSET 0"
Nhập lô 25
Nhập lô 24
Nhập lô 22
$ # … trong lúc bạn đọc trang 1, An đăng một bài mới …
$ docker exec fsp-pg psql -U chiase -tAc "SELECT title FROM posts WHERE status = 'published' ORDER BY created_at DESC, id DESC LIMIT 3 OFFSET 3"
Nhập lô 22
Nhập lô 21
Nhập lô 20`;

const OUT_EX1 = `=== (1) OFFSET: trang thứ 7501 (bỏ qua 150 000 bài) ===
                                            QUERY PLAN                                             
---------------------------------------------------------------------------------------------------
 Limit (actual time=29.501..29.510 rows=20.00 loops=1)
   Buffers: shared hit=2909
   -&gt;  Index Scan using posts_feed_idx on posts (actual time=0.031..25.994 rows=150020.00 loops=1)
         Index Cond: (status = 'published'::post_status)
         Index Searches: 1
         Buffers: shared hit=2909
 Planning:
   Buffers: shared hit=139
 Planning Time: 0.679 ms
 Execution Time: 29.554 ms
(10 rows)`;

const CURSOR = `import { z } from 'zod';
import { HttpError } from './http-error.js';

// Cursor = "vị trí của phần tử CUỐI trang trước": (createdAt, id). Gói thành chuỗi base64url để client coi là hộp đen —
// client chỉ gửi lại nguyên văn, không tự ghép, không tự hiểu. Đổi cách sắp xếp sau này không vỡ client.
const cursorSchema = z.strictObject({ t: z.iso.datetime(), id: z.uuid() });
export type ViTri = { createdAt: Date; id: string };

export const maHoaCursor = ({ createdAt, id }: ViTri) =&gt;
  Buffer.from(JSON.stringify({ t: createdAt.toISOString(), id })).toString('base64url');

export function giaiMaCursor(s: string): ViTri {
  try {
    const { t, id } = cursorSchema.parse(JSON.parse(Buffer.from(s, 'base64url').toString('utf8')));
    return { createdAt: new Date(t), id };
  } catch {
    // Cursor hỏng/bị sửa tay ⇒ 400 rõ ràng, không 500, không lặng lẽ trả trang đầu.
    throw new HttpError(400, 'CURSOR_SAI', 'Cursor không hợp lệ — hãy tải lại từ trang đầu');
  }
}

// "Đứng sau cursor": giảm dần (feed, mới trước) = (createdAt, id) &lt; (t, id); tăng dần (bình luận, cũ trước) = &gt; (t, id).
// Prisma không viết được so sánh bộ nên tách thành OR — NHƯNG OR một mình thì Postgres chỉ dùng chỉ mục cho phần đầu rồi
// LỌC từng dòng (đo thật: trang sâu đọc 150 000 dòng, bài 5.2). Thêm điều kiện "thừa" createdAt &lt;= t (hoặc &gt;= t) ⇒
// Postgres nhảy thẳng tới đúng chỗ trong chỉ mục (5 trang bộ nhớ thay vì 2 909).
export function dieuKienSau({ createdAt, id }: ViTri, chieu: 'asc' | 'desc') {
  const hon = chieu === 'desc' ? 'lt' : 'gt';
  return {
    createdAt: { [chieu === 'desc' ? 'lte' : 'gte']: createdAt },
    OR: [{ createdAt: { [hon]: createdAt } }, { createdAt, id: { [hon]: id } }],
  };
}

// Lấy limit + 1 dòng: có dòng thứ limit+1 ⇒ còn trang sau. Không cần COUNT(*) cả bảng.
export function catTrang&lt;T extends ViTri&gt;(dong: T[], limit: number) {
  const conNua = dong.length &gt; limit;
  const items = conNua ? dong.slice(0, limit) : dong;
  return { items, nextCursor: conNua ? maHoaCursor(items.at(-1)!) : null };
}`;

const PAGE_SCHEMA = `import { z } from 'zod';

// Query string luôn là CHUỖI ("?limit=10" ⇒ "10") ⇒ z.coerce đổi sang số rồi mới kiểm.
// Chặn trên 50: không ai được xin "?limit=1000000" để kéo cả CSDL trong một request.
export const trangSchema = z.strictObject({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().max(200).optional(),
});
export type Trang = z.infer&lt;typeof trangSchema&gt;;`;

const OUT_REQ_QUERY = `$ cat thu-q.mjs
import express from 'express';
const app = express();
app.get('/x', (req, res) =&gt; {
  try { req.query = { limit: 5 }; res.json({ ganDuoc: true, query: req.query }); }
  catch (e) { res.status(500).json({ loi: String(e) }); }
});
const s = app.listen(41817, async () =&gt; {
  console.log(await (await fetch('http://localhost:41817/x?limit=abc')).text()); s.close();
});
$ node thu-q.mjs
{"loi":"TypeError: Cannot set property query of #&lt;IncomingMessage&gt; which has only a getter"}`;

const VALIDATE_QUERY = `// Query string: Express 5 KHÔNG cho gán lại req.query (getter) — "req.query = …" ném TypeError ⇒ 500 (bài 5.2).
// Dữ liệu đã kiểm + đã ép kiểu để ở res.locals.query; controller đọc từ đó, không đọc req.query thô.
export const validateQuery = (schema: z.ZodType) =&gt; (req: Request, res: Response, next: NextFunction) =&gt; {
  const kq = schema.safeParse(req.query);
  if (!kq.success) {
    const dau = kq.error.issues[0]!;
    res
      .status(400)
      .json({ error: { code: 'DU_LIEU_SAI', message: \`\${dau.path.join('.') || 'query'}: \${dau.message}\` } });
    return;
  }
  res.locals.query = kq.data;
  next();
};`;

const OUT_QUERY_SAI = `$ curl -s "$A/posts?limit=0" -w " → %{http_code}\\n"
{"error":{"code":"DU_LIEU_SAI","message":"limit: Too small: expected number to be &gt;=1"}} → 400
$ curl -s "$A/posts?limit=1000" -w " → %{http_code}\\n"
{"error":{"code":"DU_LIEU_SAI","message":"limit: Too big: expected number to be &lt;=50"}} → 400
$ curl -s "$A/posts?limit=abc" -w " → %{http_code}\\n"
{"error":{"code":"DU_LIEU_SAI","message":"limit: Invalid input: expected number, received NaN"}} → 400
$ curl -s "$A/posts?cursor=eyJ0IjoiaGFjayJ9" -w " → %{http_code}\\n"
{"error":{"code":"CURSOR_SAI","message":"Cursor không hợp lệ — hãy tải lại từ trang đầu"}} → 400
$ curl -s "$A/posts?page=2" -w " → %{http_code}\\n"
{"error":{"code":"DU_LIEU_SAI","message":"query: Unrecognized key: \\"page\\""}} → 400
$ curl -s "$A/posts?limit=2&amp;limit=3" -w " → %{http_code}\\n"
{"error":{"code":"DU_LIEU_SAI","message":"limit: Invalid input: expected number, received NaN"}} → 400`;

const OUT_DI_FEED_DAU = `$ node di-feed.mjs 10    # đi hết feed theo nextCursor, 10 bài/trang, so với SELECT count(*)
103 trang · nhận 1030 bài · khác nhau 1030 · CSDL có 1030 bài đã đăng ⇒ thiếu 0`;

const OUT_MICRO = `$ docker exec fsp-pg psql -U chiase -c "INSERT INTO posts (author_id, title, body, status) SELECT '&lt;id của An&gt;', 'Nhập lô ' || g, '…', 'published' FROM generate_series(1, 25) g"
INSERT 0 25
$ docker exec fsp-pg psql -U chiase -c "SELECT created_at, count(*) FROM posts WHERE title LIKE 'Nhập lô %' GROUP BY 1"
          created_at           | count 
-------------------------------+-------
 2026-11-24 13:51:29.110369+00 |    25
(1 row)

$ node di-feed.mjs 10    # đi hết feed theo nextCursor, 10 bài/trang
104 trang · nhận 1040 bài · khác nhau 1040 · CSDL có 1055 bài đã đăng ⇒ thiếu 15`;

const MIGRATION = `-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);`;

const OUT_ALTER = `$ psql -U chiase      # \\timing on rồi ALTER trên bản sao 1 000 084 dòng + 1 chỉ mục
chiase=# ALTER TABLE thu_comments ALTER COLUMN created_at SET DATA TYPE timestamptz(3);
ALTER TABLE
Time: 1305.027 ms (00:01.305)`;

const OUT_SAU_SUA = `$ node di-feed.mjs 10
106 trang · nhận 1054 bài · khác nhau 1054 · CSDL có 1054 bài đã đăng ⇒ thiếu 0
$ node di-feed.mjs 7
151 trang · nhận 1054 bài · khác nhau 1054 · CSDL có 1054 bài đã đăng ⇒ thiếu 0
$ node di-feed.mjs 50
22 trang · nhận 1054 bài · khác nhau 1054 · CSDL có 1054 bài đã đăng ⇒ thiếu 0
$ node di-feed.mjs 50    # sau khi có 200 000 bài cũ
4022 trang · nhận 201053 bài · khác nhau 201053 · CSDL có 201053 bài đã đăng ⇒ thiếu 0`;

const OUT_EX2 = `=== (2) CURSOR dạng OR (Prisma sinh ra): cùng trang đó ===
                                                                                                     QUERY PLAN                                                                                                     
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Limit (actual time=16.767..16.773 rows=21.00 loops=1)
   Buffers: shared hit=2909
   -&gt;  Index Scan using posts_feed_idx on posts (actual time=16.765..16.770 rows=21.00 loops=1)
         Index Cond: (status = 'published'::post_status)
         Filter: ((created_at &lt; '2024-12-30 06:37:33+00'::timestamp with time zone) OR ((created_at = '2024-12-30 06:37:33+00'::timestamp with time zone) AND (id &lt; '01a20dd4-7a7c-7a33-ad4c-523b01689287'::uuid)))
         Rows Removed by Filter: 150000
         Index Searches: 1
         Buffers: shared hit=2909
 Planning:
   Buffers: shared hit=6
 Planning Time: 0.125 ms
 Execution Time: 16.824 ms
(12 rows)`;

const OUT_EX3 = `=== (3) CURSOR dạng so sánh bộ (row comparison) ===
                                                                                         QUERY PLAN                                                                                          
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Limit (actual time=0.030..0.035 rows=21.00 loops=1)
   Buffers: shared hit=5
   -&gt;  Index Scan using posts_feed_idx on posts (actual time=0.029..0.033 rows=21.00 loops=1)
         Index Cond: ((status = 'published'::post_status) AND (ROW(created_at, id) &lt; ROW('2024-12-30 06:37:33+00'::timestamp with time zone, '01a20dd4-7a7c-7a33-ad4c-523b01689287'::uuid)))
         Index Searches: 1
         Buffers: shared hit=5
 Planning Time: 0.138 ms
 Execution Time: 0.098 ms
(8 rows)`;

const OUT_EX4 = `=== (4) CURSOR dạng OR + thêm điều kiện thừa created_at &lt;= t ===
                                                                                                     QUERY PLAN                                                                                                     
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Limit (actual time=0.033..0.042 rows=21.00 loops=1)
   Buffers: shared hit=5
   -&gt;  Index Scan using posts_feed_idx on posts (actual time=0.032..0.039 rows=21.00 loops=1)
         Index Cond: ((status = 'published'::post_status) AND (created_at &lt;= '2024-12-30 06:37:33+00'::timestamp with time zone))
         Filter: ((created_at &lt; '2024-12-30 06:37:33+00'::timestamp with time zone) OR ((created_at = '2024-12-30 06:37:33+00'::timestamp with time zone) AND (id &lt; '01a20dd4-7a7c-7a33-ad4c-523b01689287'::uuid)))
         Rows Removed by Filter: 1
         Index Searches: 1
         Buffers: shared hit=5
 Planning:
   Buffers: shared hit=161
 Planning Time: 0.819 ms
 Execution Time: 0.086 ms
(12 rows)`;

const OUT_API_SAU = `trang 1:                         6.8 ms (trung vị 28 lần)
trang sau 150 000 bài (OR + &lt;=): 6.3 ms (trung vị 28 lần)`;

const FEED = `// Feed: bài đã đăng, MỚI NHẤT trước, phân trang bằng cursor (createdAt, id) — bài 5.2.
// Sắp theo (createdAt DESC, id DESC): id là "trọng tài" khi hai bài trùng createdAt ⇒ thứ tự luôn xác định.
export async function dsBaiDaDang({ cursor, limit }: Trang) {
  const sau = cursor ? giaiMaCursor(cursor) : null;
  const dong = await prisma.post.findMany({
    where: { status: 'published', ...(sau &amp;&amp; dieuKienSau(sau, 'desc')) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
    select: chonBai,
  });
  const { items, nextCursor } = catTrang(dong, limit);
  return { items: await raDsBai(items), nextCursor };
}`;

const PRISMA_CURSOR_CODE = `// Thử cursor CÓ SẴN của Prisma (cursor: { id }, skip: 1) — điều gì xảy ra khi bài ở vị trí cursor bị xoá giữa hai lần tải?
import { prisma } from './src/db/prisma.js';
const where = { status: 'published' as const, title: { startsWith: 'Bài mẫu' } };
const orderBy = [{ createdAt: 'desc' as const }, { id: 'desc' as const }];
const t1 = await prisma.post.findMany({ where, orderBy, take: 3, select: { id: true, title: true } });
console.log('trang 1:', t1.map((b) =&gt; b.title).join(', '));
const cuoi = t1.at(-1)!;
const t2 = await prisma.post.findMany({ where, orderBy, take: 3, skip: 1, cursor: { id: cuoi.id }, select: { title: true } });
console.log('trang 2 (cursor còn đó):', t2.map((b) =&gt; b.title).join(', '));
await prisma.post.delete({ where: { id: cuoi.id } });
console.log(\`— xoá "\${cuoi.title}" (đúng bài làm cursor) —\`);
const t3 = await prisma.post.findMany({ where, orderBy, take: 3, skip: 1, cursor: { id: cuoi.id }, select: { title: true } });
console.log('trang 2 (cursor đã bị xoá):', t3.length, 'bài', JSON.stringify(t3.map((b) =&gt; b.title)));
await prisma.$disconnect();`;

const OUT_PRISMA_CURSOR = `trang 1: Bài mẫu 1, Bài mẫu 2, Bài mẫu 3
trang 2 (cursor còn đó): Bài mẫu 4, Bài mẫu 5, Bài mẫu 6
— xoá "Bài mẫu 3" (đúng bài làm cursor) —
trang 2 (cursor đã bị xoá): 0 bài []`;

const OUT_PRISMA_CURSOR_SQL = `  [sql 2.5ms] SELECT … WHERE status = … AND title LIKE … AND (("posts"."created_at" = (SELECT "posts"."created_at" FROM "posts" WHERE ("posts"."id") = ($3)) AND "posts"."id" &lt;= (SELECT "posts"."id" FROM "posts" WHERE ("posts"."id") = ($4))) OR ("posts"."created_at" &lt; (SELECT "posts"."created_at" FROM "posts" WHERE ("posts"."id") = ($5))))) ORDER BY "posts"."created_at" DESC, "posts"."id" DESC LIMIT $6 OFFSET $7`;

const OUT_XOA_CURSOR = `$ curl -s "$A/posts?limit=3" | jq -c "[.items[].title]"
["Nhập lô 25","Nhập lô 24","Nhập lô 23"]
$ curl -s -X DELETE $A/posts/&lt;id bài "Nhập lô 23"&gt; -H "authorization: Bearer $AN" -w "→ %{http_code}\\n"
→ 204
$ curl -s "$A/posts?limit=3&amp;cursor=&lt;nextCursor của trang 1&gt;" | jq -c "[.items[].title]"
["Nhập lô 22","Nhập lô 21","Nhập lô 20"]`;

const OUT_CP4_VO = `$ node scripts/checkpoint-4.mjs      # sau khi đổi GET /posts sang { items, nextCursor }
  …
  ✔ checkpoint-3: KẾT QUẢ: 23 đạt, 0 trượt
  ✘ GET /posts (khách) có bài vừa đăng → 200
KẾT QUẢ: 22 đạt, 1 trượt`;

const OUT_HACKER = `$ echo -n "eyJ0IjoiMjAyNi0xMS0yNFQxMzo0NDowMy4xODhaIiwiaWQiOiIwMWEyMGRjZS03MjM2LTc4ZmMtYjQ1My0xMGI1YzRhNGEyZGQifQ" | base64 -d; echo
{"t":"2026-11-24T13:44:03.188Z","id":"01a20dce-7236-78fc-b453-10b5c4a4a2dd"}
$ C=$(echo -n "{\\"t\\":\\"2099-01-01T00:00:00.000Z\\",\\"id\\":\\"ffffffff-ffff-7fff-bfff-ffffffffffff\\"}" | base64 -w0 | tr "+/" "-_" | tr -d "="); curl -s "$A/posts?limit=3&amp;cursor=$C" | jq -c "[.items[] | {title, status}]"
[{"title":"Bài vừa đăng","status":"published"},{"title":"Nhập lô 25","status":"published"},{"title":"Nhập lô 24","status":"published"}]
$ C=$(echo -n "{\\"t\\":\\"2099-01-01T00:00:00.000Z\\",\\"id\\":\\"ffffffff-ffff-7fff-bfff-ffffffffffff\\",\\"status\\":\\"draft\\"}" | base64 -w0 | tr "+/" "-_" | tr -d "="); curl -s "$A/posts?limit=3&amp;cursor=$C" -w " → %{http_code}\\n"
{"error":{"code":"CURSOR_SAI","message":"Cursor không hợp lệ — hãy tải lại từ trang đầu","requestId":"a4ac4c92-4ffd-4ae8-ad59-3c674b1056ef"}} → 400
$ curl -s "$A/posts?limit=1000000" | jq -c .error.details
[{"field":"limit","code":"too_big","message":"Quá lớn: mong đợi number &lt;=50"}]`;

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-3-2-cursor', title: 'API Design 3.2 — Phân trang con trỏ làm cho đúng', sub: 'Con trỏ mờ, keyset, thứ tự ổn định — bài khái niệm chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-3-1-offset', title: 'API Design 3.1 — Phân trang offset và vấn đề của nó', sub: 'Khi nào offset vẫn là lựa chọn đúng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-5-3-sap-xep-phan-trang', title: 'Prisma ORM 5.3 — Sắp xếp, và phân trang sống sót được', sub: 'skip/take, cursor của Prisma, và giới hạn của nó.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-7-5-chi-muc-va-explain', title: 'Node.js 7.5 — Chỉ mục, và cách đọc EXPLAIN ANALYZE', sub: 'Đọc Index Cond, Filter, Buffers.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-4-1-thay-doi', title: 'API Design 4.1 — Thay đổi phá vỡ và không phá vỡ', sub: 'Vì sao đổi mảng thành { items } làm vỡ client cũ.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'Use The Index, Luke — We need tool support for keyset pagination', 'Markus Winand: vì sao OFFSET chậm dần và keyset (cursor) thì không.', 'https://use-the-index-luke.com/no-offset'),
  nguon('📘', 'PostgreSQL — Date/Time Types', 'timestamp lưu tới micro giây; timestamptz(p) giới hạn số chữ số phần giây.', 'https://www.postgresql.org/docs/current/datatype-datetime.html'),
  nguon('📘', 'PostgreSQL — Row and Array Comparisons', 'So sánh bộ (a, b) &lt; (x, y) theo thứ tự từ điển.', 'https://www.postgresql.org/docs/current/functions-comparisons.html'),
  nguon('📘', 'Prisma — Pagination', 'Offset (skip/take) và cursor-based của Prisma Client.', 'https://www.prisma.io/docs/orm/prisma-client/queries/pagination'),
  nguon('📘', 'Express — Migrating to Express 5', '"req.query … is no longer a writable property and is instead a getter."', 'https://expressjs.com/en/guide/migrating-5.html'),
].join('\n');

const MERMAID = `sequenceDiagram
  participant W as Web / app
  participant A as API
  participant D as PostgreSQL
  W->>A: GET /posts?limit=20
  A->>D: … ORDER BY created_at DESC, id DESC LIMIT 21
  D-->>A: 21 dòng
  A-->>W: items (20) + nextCursor = (t, id) của bài thứ 20
  W->>A: GET /posts?limit=20&cursor=eyJ0Ijo…
  A->>D: … AND created_at <= t AND (created_at < t OR (created_at = t AND id < id0)) LIMIT 21
  D-->>A: 21 dòng (hoặc ít hơn ở trang cuối)
  A-->>W: items + nextCursor (null = hết)`;

export default {
  title: '5.2 — Cursor-based pagination for the feed|||5.2 — Phân trang kiểu cursor cho feed',
  slug: 'fp-5-2-phan-trang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Feed phân trang bằng cursor (createdAt, id): cursor là hộp đen base64url, lấy limit+1 để biết còn trang, id làm trọng tài khi trùng giờ. Đo thật: OFFSET lặp bài khi có bài mới và đọc 150 000 dòng ở trang sâu; cursor tạo từ Date (ms) làm thiếu 15 bài trùng giờ (sửa timestamptz(3)); điều kiện OR không dùng chỉ mục (thêm created_at <= t: 2 909 ⇒ 5 buffer); cursor của Prisma trả 0 bài khi bài làm cursor bị xoá; Express 5 không cho gán req.query; đổi hình dạng phản hồi làm vỡ client cũ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Pagination</span>
<h2>The feed that never repeats, never skips, and stays fast on page 7,500</h2>
<p class="lead">Until now <code>GET /posts</code> returned "the 20 newest posts". A real feed needs page 2, page 3… as the user scrolls. The textbook answer is <code>LIMIT 20 OFFSET 40</code>; this lesson shows, with real output, the two ways it fails, then builds cursor pagination — and then finds three more bugs in our <em>own</em> cursor version that only appeared when we tested with 201,053 posts. Each fix is one line; finding them is the skill.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Why not OFFSET</h3>
<p><strong>Problem 1 — the page moves under the reader.</strong> OFFSET counts rows from the top <em>at the moment of the query</em>. If someone publishes while you read page 1, everything shifts down by one:</p>
<div class="out">${OUT_OFFSET_TROI}</div>
<p>"Nhập lô 22" appears on page 1 and again on page 2. With deletes, the opposite happens: a post is silently skipped. On an infinite-scroll feed where people post every second, this is not an edge case; it is every page.</p>
<p><strong>Problem 2 — deep pages read everything before them.</strong> With 201,053 posts, page 7,501 (offset 150,000):</p>
<div class="out">${OUT_EX1}</div>
<p><code>rows=150020</code>: PostgreSQL walks 150,020 index entries and throws 150,000 away. The cost grows with the page number. Scrapers love deep pages; your database does not.</p>

<h3>2. The cursor: "continue after this post"</h3>
<p>Instead of "skip 40", the client says "give me what comes <em>after</em> the last post I saw". The position is the pair <strong>(createdAt, id)</strong> of that post — <code>id</code> is the tie-breaker when two posts share a timestamp, so the order is total and stable. The API packs it into an opaque string:</p>
<pre><code class="language-ts">${CURSOR}</code></pre>
<ul>
<li><strong>Opaque.</strong> Base64url of a small JSON. The client must send it back verbatim, never build or parse it. That leaves us free to change the sort later without breaking apps.</li>
<li><strong>limit + 1.</strong> Fetch 21 to return 20: if the 21st exists, there is a next page. No <code>COUNT(*)</code> over the table.</li>
<li><strong>Validated.</strong> A tampered cursor is a clear 400, never a 500 and never a silent jump back to page 1.</li>
</ul>
<pre><code class="language-ts">${PAGE_SCHEMA}</code></pre>
<p>The query string arrives as strings, so <code>z.coerce.number()</code> converts <code>"10"</code> to <code>10</code>, and the maximum of 50 stops anyone from asking for a million rows. Where do we put the validated values? The obvious <code>req.query = parsed</code> is a trap in Express 5:</p>
<div class="out">${OUT_REQ_QUERY}</div>
<p>In Express 5 <code>req.query</code> is a getter (the migration guide says so in one line that is easy to miss). Our <code>validateQuery</code> stores the result in <code>res.locals.query</code>:</p>
<pre><code class="language-ts">${VALIDATE_QUERY}</code></pre>
<div class="out">${OUT_QUERY_SAI}</div>
<p>The last line is a small surprise: <code>?limit=2&amp;limit=3</code> becomes the array <code>["2","3"]</code>, and <code>Number(["2","3"])</code> is <code>NaN</code>. It is still a 400, which is what matters.</p>
<p>The response shape changes from a bare array to <code>{ items, nextCursor }</code>. Then we walk the whole feed, following <code>nextCursor</code> until it is <code>null</code>, and compare with the database:</p>
<div class="out">${OUT_DI_FEED_DAU}</div>
<p>103 pages, 1,030 posts, no duplicate, nothing missing. Done? Not yet.</p>

<h3>3. Bug #1: 25 posts with the same timestamp, 15 of them vanish</h3>
<p>Imports, seed scripts and batch jobs insert many rows in one statement — and inside one transaction <code>now()</code> returns the <em>same</em> value for every row. We imported 25 posts that way and walked the feed again:</p>
<div class="out">${OUT_MICRO}</div>
<p><strong>15 posts are never shown.</strong> Look at the timestamp in the database: <code>13:51:29.110369</code> — six digits, microseconds. Now look at our cursor: <code>13:51:29.110Z</code> — JavaScript's <code>Date</code> only has milliseconds. Page 2 asks for <code>created_at &lt; 13:51:29.110</code> or <code>(= 13:51:29.110 and id &lt; …)</code>. The 15 remaining posts are at <code>.110369</code>: not smaller, not equal. They fall into the gap.</p>
<p>The fix is to store what JavaScript can represent: <code>@db.Timestamptz(3)</code> — milliseconds.</p>
<pre><code class="language-sql">${MIGRATION}</code></pre>
<p>Changing a column type is not free on a big table. On a copy of the comments table:</p>
<div class="out">${OUT_ALTER}</div>
<p>1.3 seconds holding an exclusive lock for one million rows, and PostgreSQL rewrote the whole table (its file number changed). At 100 million rows that is minutes of downtime — which is why decisions like this belong in Chapter 2, not in production. After the migration:</p>
<div class="out">${OUT_SAU_SUA}</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — any language with millisecond dates.</strong> Java's <code>Instant</code> has nanoseconds, but JSON serializers, JavaScript clients and many drivers truncate to milliseconds. Whenever a timestamp makes a round trip through a client and comes back as a filter, its precision must match the column.</p></div>

<h3>4. Bug #2: the cursor query that is as slow as OFFSET</h3>
<p>"After (t, id)" in descending order means <code>(created_at, id) &lt; (t, id)</code>. Prisma cannot write tuple comparisons, so the first version used the textbook expansion: <code>created_at &lt; t OR (created_at = t AND id &lt; id0)</code>. Same page as before, page 7,501:</p>
<div class="out">${OUT_EX2}</div>
<p><code>Index Cond</code> contains only <code>status</code>; the time condition sits in <code>Filter</code>, and <code>Rows Removed by Filter: 150000</code>. The planner cannot turn an <code>OR</code> into a starting point in the index, so it reads from the top — 2,909 buffers, exactly like OFFSET. Real SQL comparison of rows does it right:</p>
<div class="out">${OUT_EX3}</div>
<p>5 buffers. Prisma cannot generate that, but it can generate a redundant condition that means the same: <code>created_at &lt;= t AND (…the OR…)</code>.</p>
<div class="out">${OUT_EX4}</div>
<p>Now <code>created_at &lt;= t</code> is in <code>Index Cond</code>: PostgreSQL jumps straight to the position, reads 5 buffers, removes 1 row by filter. Through the API:</p>
<div class="out">${OUT_API_SAU}</div>
<p>Before the extra condition the same deep page took 25.2 ms; now page 7,501 costs the same as page 1. The final service code:</p>
<pre><code class="language-ts">${FEED}</code></pre>
<p>Walking all 201,053 posts, 50 per page, 4,022 pages: 0 duplicates, 0 missing. Comments use the same helper in ascending order (oldest first): a post with 1000 comments, 50 per page, came back as 20 pages and 1000 comments.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">order</span><span class="lz-d">total order: (created_at, id) — id breaks ties</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">precision</span><span class="lz-d">column precision = client precision: timestamptz(3)</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">index</span><span class="lz-d">index on (status, created_at DESC, id DESC) = same order as the query</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">seek</span><span class="lz-d">created_at &lt;= t so the bound is an Index Cond, not a Filter</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">verify</span><span class="lz-d">walk every page and compare with COUNT(*) in the database</span></div>
</div>

<h3>5. Bug #3 (avoided): Prisma's own cursor and a deleted post</h3>
<p>Prisma has built-in cursor pagination: <code>cursor: { id }, skip: 1</code>. It looks simpler. We tested the one situation every feed meets — the post the cursor points to is deleted between two page loads:</p>
<pre><code class="language-ts">${PRISMA_CURSOR_CODE}</code></pre>
<div class="out">${OUT_PRISMA_CURSOR}</div>
<div class="out">${OUT_PRISMA_CURSOR_SQL}</div>
<p>Prisma's cursor looks the position up again with sub-queries <code>(SELECT created_at FROM posts WHERE id = $3)</code>. When that post is gone, the sub-queries return <code>NULL</code>, every comparison is unknown, and the "next page" is empty — the user's feed just ends. Our cursor carries the position itself, so it does not care:</p>
<div class="out">${OUT_XOA_CURSOR}</div>
<p>(Fairness: Prisma's version reads the exact timestamp from the database, so it never had bug #1. Each design has a failure mode; you must know which one you picked.)</p>

<h3>6. We just broke a client</h3>
<p><code>GET /posts</code> used to return an array. Now it returns an object. Checkpoint 4 is, in effect, an old client:</p>
<div class="out">${OUT_CP4_VO}</div>
<p>Nobody outside the project calls our API yet, so the honest fix is to update the client in the same commit (<code>b6bb884</code>) and note it in the README. Once a mobile app is published you cannot do that — the app on someone's phone will never update. Then you add the new shape under a new version, or add fields without removing any. The API Design course spends a whole chapter on this.</p>

<h3>🕵️ Hacker's corner — scraping with your pagination</h3>
<p>Every public list endpoint is also a scraping endpoint. Parler (2021, lesson 4.1) was archived almost entirely because nothing limited how fast and how far a script could page. Three things in this lesson are defensive: the <strong>limit cap</strong>, the <strong>validated cursor</strong>, and the fact that the cursor is only a <em>position</em>, not a permission. We tried to tamper with it:</p>
<div class="out">${OUT_HACKER}</div>
<p>A cursor from the year 2099 just returns the newest posts — position only. Adding a field (<code>"status":"draft"</code>) is refused, because <code>z.strictObject</code> validates the decoded content. The <code>WHERE status = 'published'</code> is in the server's query, not in the cursor, so no cursor can reveal a draft. What is still missing — rate limiting on reads — is a Chapter 11 item.</p>

<h3>In everyday life</h3>
<p>OFFSET is "continue from page 57" in a book that someone keeps inserting pages into: you re-read or skip. A cursor is a bookmark placed after a specific sentence: wherever new pages are inserted, you continue after that sentence. And bug #1 is a bookmark that only remembers the line number to the nearest ten.</p>

<h3>On a real job</h3>
<p>Admin tables with "page 3 of 12" and a total count are fine with OFFSET — small, mostly static, and users want to jump to a page. Infinite feeds, activity logs, notifications and public APIs want cursors. In a Spring project the default <code>Pageable</code> is OFFSET (<code>Page</code> also runs a <code>COUNT</code>); Spring Data's <code>Slice</code> drops the count, and keyset scrolling (<code>ScrollPosition</code>, <code>Window</code>) is the cursor version. If a ticket says "users see duplicates when scrolling", you now know the first three questions: OFFSET? ties without a tie-breaker? timestamp precision?</p>

${spring(false, 'Spring Data JPA: <code>Pageable</code>/<code>Page</code> = OFFSET + COUNT; <code>Slice</code> = OFFSET without COUNT; keyset scrolling with <code>ScrollPosition.keyset()</code> returns a <code>Window</code> — the cursor version. Hibernate maps <code>Instant</code> to <code>timestamp(6)</code> by default: the same precision question applies when a JavaScript client sends the timestamp back.', [
  ['sb-6-4-jpql-query', 'Spring Boot 6.4 — Queries: JPQL, @Query, projections and pagination'],
  ['sb-4-5-thiet-ke-rest', 'Spring Boot 4.5 — REST design: status codes, pagination, idempotency'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"Offset vs cursor pagination?"</strong> — Offset: simple, random access, total pages; but drifts when data changes and gets slower with depth. Cursor (keyset): stable under inserts/deletes, constant cost per page; no "jump to page 57".</li>
<li><strong>"Why do you need a tie-breaker column?"</strong> — Without a unique column in the ORDER BY, rows with equal sort keys have no defined order; pages can repeat or skip them.</li>
<li><strong>"How do you know there is a next page without COUNT?"</strong> — Fetch limit+1; if the extra row exists there is a next page.</li>
<li><strong>"Your cursor query is slow on deep pages. What do you check?"</strong> — EXPLAIN: is the cursor bound in <code>Index Cond</code> or in <code>Filter</code>? Index order matches ORDER BY? Use a row comparison or add a redundant range condition.</li>
<li><strong>"Should the client build cursors?"</strong> — No. Opaque cursors let the server change the sort or encoding without breaking clients; validate them on the server.</li>
</ol>

<h3>🧪 Lab 5.2 (75 minutes)</h3>
<div class="callout ok">
<ol>
<li>Reproduce OFFSET drift in psql: page 1, insert a post, page 2.</li>
<li>Write <code>lib/cursor.ts</code>, <code>schemas/page.schema.ts</code>, <code>validateQuery</code>, the new <code>dsBaiDaDang</code>. First try <code>req.query = …</code> and watch the TypeError.</li>
<li>Write a small script that walks the whole feed via <code>nextCursor</code> and compares with <code>SELECT count(*)</code>.</li>
<li>Insert 25 posts in one <code>INSERT … generate_series</code>, walk again, find the missing ones. Fix with <code>Timestamptz(3)</code>; walk with limits 7, 10, 50.</li>
<li>Insert 200,000 old posts, <code>EXPLAIN ANALYZE</code> the OR version, the row comparison and the version with <code>created_at &lt;= t</code>. Copy the three <code>Buffers</code> lines into your notes.</li>
<li>Apply the same pagination to <code>GET /posts/:id/comments</code> (ascending). Fix checkpoint-4 for the new response shape.</li>
</ol>
<p><strong>Done when:</strong> walking the feed with any limit returns every published post exactly once — including 25 posts with identical timestamps — and a page after 150,000 posts costs about the same as page 1.</p>
<p><strong>Rubric (10):</strong> opaque validated cursor + limit+1 (2) · validateQuery without assigning req.query (1) · tie-breaker in ORDER BY and cursor (1) · ms precision found and fixed (2) · EXPLAIN-driven fix of the OR condition (2) · comments paginated (1) · old client updated (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commits <code>70994ac</code> and <code>b6bb884</code> on <code>ch5/binh-luan</code>: <code>lib/cursor.ts</code> (<code>maHoaCursor</code>, <code>giaiMaCursor</code>, <code>dieuKienSau</code>, <code>catTrang</code>), <code>schemas/page.schema.ts</code>, <code>middlewares/validate.ts</code> (<code>validateQuery</code>), migration <code>*_ms_timestamps</code>, <code>services/post.service.ts</code>, <code>services/comment.service.ts</code>, <code>scripts/checkpoint-4.mjs</code>. If your walk still misses posts after the migration, check that you ran <code>prisma generate</code> and restarted the server. If <code>EXPLAIN</code> does not show your bound in <code>Index Cond</code>, compare the index column order with your <code>ORDER BY</code> — both must be <code>(status, created_at DESC, id DESC)</code>.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OFFSET pagination</span><span class="v">Skip N rows, return the next M. Simple, drifts, slower with depth.</span></div>
  <div class="kv"><span class="k">cursor / keyset</span><span class="v">Return rows after a known position (sort key values of the last row).</span></div>
  <div class="kv"><span class="k">tie-breaker</span><span class="v">A unique column added to ORDER BY so the order is total.</span></div>
  <div class="kv"><span class="k">opaque cursor</span><span class="v">An encoded token the client stores and sends back without interpreting.</span></div>
  <div class="kv"><span class="k">Index Cond vs Filter</span><span class="v">Index Cond limits what is read from the index; Filter discards rows after reading.</span></div>
  <div class="kv"><span class="k">timestamptz(3)</span><span class="v">Timestamp with time zone, three fractional digits (milliseconds).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>OFFSET repeats/skips rows when data changes and reads every skipped row.</li>
<li>Cursor = (createdAt, id) of the last row, opaque, validated; fetch limit+1.</li>
<li>Column precision must match the client's: microseconds lost 15 of 25 tied posts.</li>
<li>Prisma's OR expansion needs a redundant <code>created_at &lt;= t</code> to use the index (2,909 ⇒ 5 buffers).</li>
<li>Prisma's built-in cursor returns nothing when the cursor row is deleted; ours carries the position.</li>
<li>Changing a response shape breaks old clients — update them or version the API.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Phân trang</span>
<h2>Feed không bao giờ lặp, không bao giờ sót, và vẫn nhanh ở trang 7.500</h2>
<p class="lead">Tới giờ <code>GET /posts</code> trả "20 bài mới nhất". Feed thật cần trang 2, trang 3… khi người dùng cuộn. Đáp án sách giáo khoa là <code>LIMIT 20 OFFSET 40</code>; bài này cho thấy bằng output thật hai cách nó hỏng, rồi dựng phân trang cursor — và sau đó tìm thêm BA lỗi trong chính bản cursor của ta, chỉ lộ ra khi thử với 201.053 bài. Mỗi chỗ sửa chỉ một dòng; tìm ra chúng mới là kỹ năng.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Vì sao không dùng OFFSET</h3>
<p><strong>Vấn đề 1 — trang trôi dưới chân người đọc.</strong> OFFSET đếm dòng từ trên xuống <em>tại thời điểm truy vấn</em>. Có người đăng bài trong lúc bạn đọc trang 1 thì mọi thứ dịch xuống một nấc:</p>
<div class="out">${OUT_OFFSET_TROI}</div>
<p>"Nhập lô 22" xuất hiện ở trang 1 rồi lại ở trang 2. Có bài bị xoá thì ngược lại: một bài lặng lẽ bị bỏ qua. Trên feed cuộn vô tận, người ta đăng bài mỗi giây, đây không phải ca hiếm; nó xảy ra ở mọi trang.</p>
<p><strong>Vấn đề 2 — trang sâu đọc hết mọi thứ phía trước.</strong> Với 201.053 bài, trang 7.501 (offset 150.000):</p>
<div class="out">${OUT_EX1}</div>
<p><code>rows=150020</code>: PostgreSQL đi qua 150.020 mục chỉ mục rồi vứt 150.000. Chi phí tăng theo số trang. Kẻ cào dữ liệu thích trang sâu; CSDL của bạn thì không.</p>

<h3>2. Cursor: "đọc tiếp sau bài này"</h3>
<p>Thay vì "bỏ qua 40", client nói "đưa tôi những gì đứng <em>sau</em> bài cuối cùng tôi đã thấy". Vị trí là cặp <strong>(createdAt, id)</strong> của bài đó — <code>id</code> làm trọng tài khi hai bài trùng giờ, nên thứ tự là toàn phần và ổn định. API gói nó thành một chuỗi mờ:</p>
<pre><code class="language-ts">${CURSOR}</code></pre>
<ul>
<li><strong>Mờ (opaque).</strong> Base64url của một JSON nhỏ. Client gửi lại nguyên văn, không tự ghép, không tự đọc. Nhờ đó sau này ta đổi cách sắp xếp mà không làm vỡ ứng dụng.</li>
<li><strong>limit + 1.</strong> Lấy 21 để trả 20: có dòng thứ 21 là còn trang sau. Không cần <code>COUNT(*)</code> cả bảng.</li>
<li><strong>Có kiểm.</strong> Cursor bị sửa tay ⇒ 400 rõ ràng, không bao giờ 500, không lặng lẽ quay về trang đầu.</li>
</ul>
<pre><code class="language-ts">${PAGE_SCHEMA}</code></pre>
<p>Query string tới dưới dạng chuỗi, nên <code>z.coerce.number()</code> đổi <code>"10"</code> thành <code>10</code>; mức trần 50 chặn ai đó xin một triệu dòng. Để giá trị đã kiểm ở đâu? Câu hiển nhiên <code>req.query = parsed</code> là bẫy trong Express 5:</p>
<div class="out">${OUT_REQ_QUERY}</div>
<p>Trong Express 5, <code>req.query</code> là getter (hướng dẫn nâng cấp ghi đúng một dòng, rất dễ lướt qua). <code>validateQuery</code> của ta cất kết quả vào <code>res.locals.query</code>:</p>
<pre><code class="language-ts">${VALIDATE_QUERY}</code></pre>
<div class="out">${OUT_QUERY_SAI}</div>
<p>Dòng cuối là một bất ngờ nhỏ: <code>?limit=2&amp;limit=3</code> thành mảng <code>["2","3"]</code>, và <code>Number(["2","3"])</code> là <code>NaN</code>. Vẫn là 400 — điều quan trọng nhất.</p>
<p>Hình dạng phản hồi đổi từ mảng trần sang <code>{ items, nextCursor }</code>. Rồi ta đi hết feed, theo <code>nextCursor</code> tới khi nó là <code>null</code>, và so với CSDL:</p>
<div class="out">${OUT_DI_FEED_DAU}</div>
<p>103 trang, 1.030 bài, không trùng, không thiếu. Xong chưa? Chưa.</p>

<h3>3. Lỗi #1: 25 bài trùng giờ tạo, 15 bài biến mất</h3>
<p>Nhập dữ liệu, script seed, job chạy lô hay chèn nhiều dòng bằng MỘT câu lệnh — và trong một giao dịch, <code>now()</code> trả CÙNG một giá trị cho mọi dòng. Ta nhập 25 bài kiểu đó rồi đi feed lại:</p>
<div class="out">${OUT_MICRO}</div>
<p><strong>15 bài không bao giờ được hiện.</strong> Nhìn giờ tạo trong CSDL: <code>13:51:29.110369</code> — sáu chữ số, micro giây. Nhìn cursor của ta: <code>13:51:29.110Z</code> — <code>Date</code> của JavaScript chỉ có mili giây. Trang 2 hỏi <code>created_at &lt; 13:51:29.110</code> hoặc <code>(= 13:51:29.110 và id &lt; …)</code>. 15 bài còn lại nằm ở <code>.110369</code>: không nhỏ hơn, không bằng. Chúng rơi vào khe hở.</p>
<p>Cách sửa: lưu đúng thứ JavaScript biểu diễn được — <code>@db.Timestamptz(3)</code>, mili giây.</p>
<pre><code class="language-sql">${MIGRATION}</code></pre>
<p>Đổi kiểu cột trên bảng lớn không miễn phí. Trên bản sao bảng comments:</p>
<div class="out">${OUT_ALTER}</div>
<p>1,3 giây giữ khoá độc quyền cho một triệu dòng, và PostgreSQL viết lại cả bảng (số hiệu tệp của bảng đổi). Với 100 triệu dòng là vài phút ngừng dịch vụ — vì vậy quyết định kiểu này thuộc về Chương 2, không phải lúc đã chạy production. Sau migration:</p>
<div class="out">${OUT_SAU_SUA}</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — mọi ngôn ngữ có ngày giờ mili giây.</strong> <code>Instant</code> của Java có nano giây, nhưng bộ chuyển JSON, client JavaScript và nhiều driver cắt về mili giây. Hễ một mốc thời gian đi một vòng qua client rồi quay về làm điều kiện lọc, độ chính xác của nó phải khớp với cột.</p></div>

<h3>4. Lỗi #2: câu truy vấn cursor chậm y như OFFSET</h3>
<p>"Sau (t, id)" theo thứ tự giảm dần nghĩa là <code>(created_at, id) &lt; (t, id)</code>. Prisma không viết được so sánh bộ, nên bản đầu dùng cách khai triển sách giáo khoa: <code>created_at &lt; t OR (created_at = t AND id &lt; id0)</code>. Cùng trang 7.501 như trên:</p>
<div class="out">${OUT_EX2}</div>
<p><code>Index Cond</code> chỉ có <code>status</code>; điều kiện thời gian nằm ở <code>Filter</code>, và <code>Rows Removed by Filter: 150000</code>. Bộ lập kế hoạch không biến được một <code>OR</code> thành điểm xuất phát trong chỉ mục, nên đọc từ đầu — 2.909 buffer, y như OFFSET. So sánh bộ bằng SQL thật thì làm đúng:</p>
<div class="out">${OUT_EX3}</div>
<p>5 buffer. Prisma không sinh được câu đó, nhưng sinh được một điều kiện "thừa" mang cùng nghĩa: <code>created_at &lt;= t AND (…cái OR…)</code>.</p>
<div class="out">${OUT_EX4}</div>
<p>Giờ <code>created_at &lt;= t</code> nằm trong <code>Index Cond</code>: PostgreSQL nhảy thẳng tới vị trí, đọc 5 buffer, lọc bỏ 1 dòng. Qua API:</p>
<div class="out">${OUT_API_SAU}</div>
<p>Trước khi thêm điều kiện, cùng trang sâu đó mất 25,2 ms; giờ trang 7.501 tốn ngang trang 1. Mã service cuối cùng:</p>
<pre><code class="language-ts">${FEED}</code></pre>
<p>Đi hết 201.053 bài, 50 bài/trang, 4.022 trang: 0 trùng, 0 thiếu. Bình luận dùng cùng hàm phụ theo chiều tăng (cũ trước): một bài có 1000 bình luận, 50 cái/trang, trả về 20 trang và đủ 1000 bình luận.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">thứ tự</span><span class="lz-d">thứ tự toàn phần: (created_at, id) — id phân xử khi trùng</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">độ chính xác</span><span class="lz-d">độ chính xác của cột = của client: timestamptz(3)</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">chỉ mục</span><span class="lz-d">chỉ mục (status, created_at DESC, id DESC) = đúng thứ tự của truy vấn</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">nhảy tới</span><span class="lz-d">created_at &lt;= t để biên nằm ở Index Cond, không ở Filter</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">kiểm</span><span class="lz-d">đi hết mọi trang và so với COUNT(*) trong CSDL</span></div>
</div>

<h3>5. Lỗi #3 (đã né): cursor có sẵn của Prisma và một bài bị xoá</h3>
<p>Prisma có sẵn phân trang cursor: <code>cursor: { id }, skip: 1</code>. Trông gọn hơn. Ta thử đúng tình huống feed nào cũng gặp — bài mà cursor trỏ tới bị xoá giữa hai lần tải trang:</p>
<pre><code class="language-ts">${PRISMA_CURSOR_CODE}</code></pre>
<div class="out">${OUT_PRISMA_CURSOR}</div>
<div class="out">${OUT_PRISMA_CURSOR_SQL}</div>
<p>Cursor của Prisma tra lại vị trí bằng các truy vấn con <code>(SELECT created_at FROM posts WHERE id = $3)</code>. Bài đó mất thì truy vấn con trả <code>NULL</code>, mọi phép so sánh thành "không xác định", và "trang sau" rỗng — feed của người dùng đơn giản là hết. Cursor của ta tự mang vị trí, nên không quan tâm:</p>
<div class="out">${OUT_XOA_CURSOR}</div>
<p>(Công bằng mà nói: bản của Prisma đọc đúng giờ tạo từ CSDL nên chưa bao giờ dính lỗi #1. Thiết kế nào cũng có kiểu hỏng riêng; bạn phải biết mình đã chọn kiểu nào.)</p>

<h3>6. Ta vừa làm vỡ một client</h3>
<p><code>GET /posts</code> từng trả mảng. Giờ trả đối tượng. Checkpoint 4, xét cho cùng, là một client cũ:</p>
<div class="out">${OUT_CP4_VO}</div>
<p>Chưa ai ngoài dự án gọi API của ta, nên cách sửa trung thực là cập nhật client trong cùng commit (<code>b6bb884</code>) và ghi vào README. Khi đã phát hành ứng dụng di động thì không làm thế được nữa — ứng dụng trên điện thoại của ai đó sẽ không bao giờ cập nhật. Lúc đó bạn thêm hình dạng mới dưới phiên bản mới, hoặc chỉ THÊM trường chứ không bỏ. Khoá API Design dành cả một chương cho chuyện này.</p>

<h3>🕵️ Góc hacker — cào dữ liệu bằng chính phân trang của bạn</h3>
<p>Mọi endpoint danh sách công khai cũng là endpoint để cào. Parler (2021, bài 4.1) bị lưu trữ gần như toàn bộ vì không gì giới hạn script phân trang nhanh và sâu đến đâu. Ba thứ trong bài này mang tính phòng thủ: <strong>mức trần limit</strong>, <strong>cursor có kiểm</strong>, và việc cursor chỉ là <em>vị trí</em>, không phải quyền. Ta thử sửa tay nó:</p>
<div class="out">${OUT_HACKER}</div>
<p>Cursor "năm 2099" chỉ trả các bài mới nhất — nó chỉ là vị trí. Thêm một trường (<code>"status":"draft"</code>) bị từ chối, vì <code>z.strictObject</code> kiểm nội dung sau khi giải mã. Điều kiện <code>WHERE status = 'published'</code> nằm trong truy vấn của máy chủ, không nằm trong cursor, nên không cursor nào làm lộ được bài nháp. Thứ còn thiếu — giới hạn tần suất cho các request ĐỌC — là việc của Chương 11.</p>

<h3>Liên hệ đời thường</h3>
<p>OFFSET là "đọc tiếp từ trang 57" trong một cuốn sách mà có người liên tục chèn thêm trang: bạn đọc lại hoặc nhảy cóc. Cursor là cái kẹp sách đặt ngay sau một câu cụ thể: trang mới chèn ở đâu thì bạn vẫn đọc tiếp sau đúng câu đó. Còn lỗi #1 là cái kẹp sách chỉ nhớ số dòng làm tròn tới hàng chục.</p>

<h3>Tình huống đi làm thật</h3>
<p>Bảng quản trị kiểu "trang 3/12" có tổng số dòng thì OFFSET vẫn ổn — dữ liệu nhỏ, ít đổi, người dùng muốn nhảy tới trang bất kỳ. Feed cuộn vô tận, nhật ký hoạt động, thông báo và API công khai thì cần cursor. Trong dự án Spring, <code>Pageable</code> mặc định là OFFSET (<code>Page</code> còn chạy thêm <code>COUNT</code>); <code>Slice</code> của Spring Data bỏ COUNT, còn cuộn keyset (<code>ScrollPosition</code>, <code>Window</code>) là bản cursor. Gặp ticket "người dùng thấy bài trùng khi cuộn", giờ bạn biết ba câu hỏi đầu tiên: OFFSET à? trùng khoá sắp xếp mà không có trọng tài à? độ chính xác của mốc thời gian?</p>

${spring(false, 'Spring Data JPA: <code>Pageable</code>/<code>Page</code> = OFFSET + COUNT; <code>Slice</code> = OFFSET không COUNT; cuộn keyset bằng <code>ScrollPosition.keyset()</code> trả về <code>Window</code> — chính là bản cursor. Hibernate mặc định ánh xạ <code>Instant</code> thành <code>timestamp(6)</code>: câu hỏi độ chính xác y hệt khi client JavaScript gửi mốc thời gian quay lại.', [
  ['sb-6-4-jpql-query', 'Spring Boot 6.4 — Truy vấn: JPQL, @Query, projection và phân trang'],
  ['sb-4-5-thiet-ke-rest', 'Spring Boot 4.5 — Thiết kế REST: mã trạng thái, phân trang, idempotency'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Phân trang offset khác cursor thế nào?"</strong> — Offset: đơn giản, nhảy trang tuỳ ý, biết tổng số trang; nhưng trôi khi dữ liệu đổi và chậm dần theo độ sâu. Cursor (keyset): ổn định khi thêm/xoá, chi phí mỗi trang không đổi; không "nhảy tới trang 57" được.</li>
<li><strong>"Vì sao cần cột trọng tài?"</strong> — ORDER BY không có cột duy nhất thì các dòng trùng khoá sắp xếp không có thứ tự xác định; trang có thể lặp hoặc bỏ sót chúng.</li>
<li><strong>"Không COUNT thì sao biết còn trang sau?"</strong> — Lấy limit+1; có dòng dư là còn trang.</li>
<li><strong>"Truy vấn cursor chậm ở trang sâu, bạn kiểm gì?"</strong> — EXPLAIN: biên của cursor nằm ở <code>Index Cond</code> hay <code>Filter</code>? Thứ tự chỉ mục có khớp ORDER BY? Dùng so sánh bộ hoặc thêm điều kiện khoảng "thừa".</li>
<li><strong>"Client có nên tự dựng cursor?"</strong> — Không. Cursor mờ cho máy chủ đổi cách sắp xếp hay mã hoá mà không làm vỡ client; kiểm nó ở máy chủ.</li>
</ol>

<h3>🧪 Lab 5.2 (75 phút)</h3>
<div class="callout ok">
<ol>
<li>Tái hiện OFFSET trôi trang bằng psql: trang 1, chèn một bài, trang 2.</li>
<li>Viết <code>lib/cursor.ts</code>, <code>schemas/page.schema.ts</code>, <code>validateQuery</code>, <code>dsBaiDaDang</code> mới. Thử <code>req.query = …</code> trước và nhìn TypeError.</li>
<li>Viết một script nhỏ đi hết feed theo <code>nextCursor</code> rồi so với <code>SELECT count(*)</code>.</li>
<li>Chèn 25 bài bằng MỘT câu <code>INSERT … generate_series</code>, đi lại, tìm bài bị thiếu. Sửa bằng <code>Timestamptz(3)</code>; đi lại với limit 7, 10, 50.</li>
<li>Chèn 200.000 bài cũ, <code>EXPLAIN ANALYZE</code> bản OR, bản so sánh bộ và bản có <code>created_at &lt;= t</code>. Chép ba dòng <code>Buffers</code> vào ghi chú.</li>
<li>Áp cùng cách phân trang cho <code>GET /posts/:id/comments</code> (tăng dần). Sửa checkpoint-4 theo hình dạng phản hồi mới.</li>
</ol>
<p><strong>Xong khi:</strong> đi feed với limit bất kỳ đều nhận MỖI bài đã đăng đúng một lần — kể cả 25 bài trùng giờ tạo — và trang sau 150.000 bài tốn ngang trang 1.</p>
<p><strong>Thang điểm (10):</strong> cursor mờ có kiểm + limit+1 (2) · validateQuery không gán req.query (1) · cột trọng tài trong ORDER BY và cursor (1) · tìm và sửa lỗi độ chính xác ms (2) · sửa điều kiện OR dựa trên EXPLAIN (2) · bình luận có phân trang (1) · cập nhật client cũ (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>70994ac</code> và <code>b6bb884</code> trên <code>ch5/binh-luan</code>: <code>lib/cursor.ts</code> (<code>maHoaCursor</code>, <code>giaiMaCursor</code>, <code>dieuKienSau</code>, <code>catTrang</code>), <code>schemas/page.schema.ts</code>, <code>middlewares/validate.ts</code> (<code>validateQuery</code>), migration <code>*_ms_timestamps</code>, <code>services/post.service.ts</code>, <code>services/comment.service.ts</code>, <code>scripts/checkpoint-4.mjs</code>. Sau migration mà vẫn thiếu bài: kiểm đã chạy <code>prisma generate</code> và khởi động lại máy chủ chưa. <code>EXPLAIN</code> không thấy biên của bạn trong <code>Index Cond</code>: so thứ tự cột của chỉ mục với <code>ORDER BY</code> — cả hai phải là <code>(status, created_at DESC, id DESC)</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">phân trang OFFSET</span><span class="v">Bỏ qua N dòng, trả M dòng tiếp theo. Đơn giản, bị trôi, chậm dần theo độ sâu.</span></div>
  <div class="kv"><span class="k">cursor / keyset</span><span class="v">Trả các dòng đứng sau một vị trí đã biết (giá trị khoá sắp xếp của dòng cuối).</span></div>
  <div class="kv"><span class="k">cột trọng tài</span><span class="v">Cột duy nhất thêm vào ORDER BY để thứ tự là toàn phần.</span></div>
  <div class="kv"><span class="k">cursor mờ</span><span class="v">Chuỗi đã mã hoá, client cất và gửi lại mà không cần hiểu.</span></div>
  <div class="kv"><span class="k">Index Cond / Filter</span><span class="v">Index Cond giới hạn phần đọc từ chỉ mục; Filter vứt dòng SAU khi đã đọc.</span></div>
  <div class="kv"><span class="k">timestamptz(3)</span><span class="v">Mốc thời gian có múi giờ, ba chữ số phần giây (mili giây).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>OFFSET lặp/sót dòng khi dữ liệu đổi và phải đọc mọi dòng bị bỏ qua.</li>
<li>Cursor = (createdAt, id) của dòng cuối, mờ, có kiểm; lấy limit+1.</li>
<li>Độ chính xác của cột phải khớp client: micro giây làm mất 15/25 bài trùng giờ.</li>
<li>Khai triển OR của Prisma cần thêm <code>created_at &lt;= t</code> để dùng chỉ mục (2.909 ⇒ 5 buffer).</li>
<li>Cursor có sẵn của Prisma trả rỗng khi bài làm cursor bị xoá; cursor của ta tự mang vị trí.</li>
<li>Đổi hình dạng phản hồi làm vỡ client cũ — cập nhật client hoặc đánh phiên bản API.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
