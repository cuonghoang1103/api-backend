/**
 * 5.4 — Checkpoint 5: feed phân trang kèm số bình luận (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: scripts/checkpoint-5.mjs (23 tiêu chí, gọi checkpoint-4 → 3 → 2 → 1), repo chiase tag ch5 (main c2bc235).
 * Lần chạy đầu 20/2: checkpoint-3 vỡ vì requestId (bài 5.3) + ngưỡng "≥ 15 lỗi" tự đoán trong khi lượt chấm chỉ sinh 13.
 * Clone sạch + npm ci + Postgres/MinIO mới: lần 1 script văng lỗi 42P01 (chưa migrate) ⇒ sửa thành dòng gợi ý; lần 2 báo gợi ý;
 * lần 3 (migrate + seed + kho:chuan-bi) 23/23. Phá thử N+1 trên bản clone ⇒ "5 bài/trang → 7, 50 bài/trang → 28" bị bắt;
 * checkpoint-4 cũng trượt vì oxlint bắt hàm demBinhLuan không còn dùng.
 */
import { lienKet, spring } from '../_chung.mjs';

const SCRIPT = `// Checkpoint 5 — tự chấm: feed phân trang cursor (không trùng, không sót — kể cả bài TRÙNG giờ tạo và bài mới chen vào giữa),
// commentCount đúng với CSDL, số truy vấn mỗi trang KHÔNG tăng theo số bài (không N+1), bình luận + quyền xoá + cascade,
// và MỌI lỗi trả về cùng một hình dạng { error: { code, message, details?, requestId } }.
// Cần: Postgres + MinIO đang chạy, đã  npm run db:migrate -w apps/api  +  db:seed  +  kho:chuan-bi  (checkpoint-4 cần kho ảnh).
// TẮT máy chủ dev đang chạy trước (script tự bật một bản).  Chạy ở gốc repo:  node scripts/checkpoint-5.mjs
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
let dat = 0;
let truot = 0;
const kiem = (moTa, dung) =&gt; {
  console.log(\`  \${dung ? '✔' : '✘'} \${moTa}\`);
  dung ? dat++ : truot++;
};
const ngu = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const API = 'apps/api';

console.log('== 0. Checkpoint 4 vẫn đạt');
const cp4 = spawnSync(process.execPath, ['scripts/checkpoint-4.mjs'], { encoding: 'utf8' });
kiem(\`checkpoint-4: \${cp4.stdout.trim().split('\\n').at(-1)}\`, cp4.status === 0);

const env = Object.fromEntries(
  readFileSync(\`\${API}/.env\`, 'utf8')
    .split(/\\r?\\n/)
    .filter((d) =&gt; /^[A-Z_0-9]+=/.test(d))
    .map((d) =&gt; [d.slice(0, d.indexOf('=')), d.slice(d.indexOf('=') + 1)]),
);

console.log('== 1. Lược đồ: bảng comments');
const db = new pg.Client({ connectionString: env.DATABASE_URL });
await db.connect();
const sql = async (q, v = []) =&gt; (await db.query(q, v)).rows;
const [{ co }] = await sql(\`SELECT to_regclass('comments') IS NOT NULL AS co\`);
kiem('bảng comments tồn tại', co);
if (!co) {
  console.log('  ⇒ CSDL chưa có bảng comments. Chạy:  npm run db:migrate -w apps/api  rồi chấm lại.');
  await db.end();
  console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
  process.exit(1);
}
const fk = await sql(
  \`SELECT confdeltype FROM pg_constraint WHERE conname = 'comments_post_id_fkey' AND contype = 'f'\`,
);
kiem(
  \`khoá ngoại comments → posts có ON DELETE CASCADE (confdeltype=\${fk[0]?.confdeltype ?? 'không có'})\`,
  fk[0]?.confdeltype === 'c',
);
const chk = await sql(\`SELECT 1 FROM pg_constraint WHERE conrelid = 'comments'::regclass AND contype = 'c'\`);
kiem('comments có CHECK chặn nội dung toàn khoảng trắng', chk.length &gt; 0);
const doChinhXac = await sql(
  \`SELECT table_name, datetime_precision FROM information_schema.columns
   WHERE column_name = 'created_at' AND table_name IN ('posts', 'comments') ORDER BY 1\`,
);
kiem(
  \`created_at lưu tới mili giây: \${doChinhXac.map((d) =&gt; \`\${d.table_name}(\${d.datetime_precision})\`).join(', ')}\`,
  doChinhXac.length === 2 &amp;&amp; doChinhXac.every((d) =&gt; d.datetime_precision === 3),
);

console.log('== 2. Bật API (DEM_SQL=1 để đếm truy vấn mỗi request)');
const goc = \`http://localhost:\${env.PORT ?? '41810'}/api\`;
const laWin = process.platform === 'win32';
const api = spawn('npm', ['run', 'dev', '-w', API], {
  shell: laWin,
  detached: !laWin,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, DEM_SQL: '1' },
});
let logApi = '';
api.stdout.on('data', (d) =&gt; (logApi = (logApi + d).slice(-200_000)));
api.stderr.on('data', (d) =&gt; (logApi = (logApi + d).slice(-200_000)));
const ketThuc = async () =&gt; {
  if (laWin) spawnSync('taskkill', ['/pid', String(api.pid), '/T', '/F']);
  else
    try {
      process.kill(-api.pid, 'SIGTERM');
    } catch {}
  await db.end().catch(() =&gt; {});
  console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
  process.exit(truot === 0 ? 0 : 1);
};

// Mọi phản hồi lỗi đi qua đây đều được soát hình dạng (bài 5.3) — gom lại, chấm ở mục 6.
const loiDaThay = [];
const dungHinhDang = (j) =&gt;
  typeof j?.error?.code === 'string' &amp;&amp;
  /^[A-Z_]+$/.test(j.error.code) &amp;&amp;
  typeof j.error.message === 'string' &amp;&amp;
  /^[0-9a-f-]{36}$/.test(j.error.requestId ?? '') &amp;&amp;
  Object.keys(j).length === 1 &amp;&amp;
  (j.error.details === undefined || j.error.details.every((d) =&gt; d.field &amp;&amp; d.code &amp;&amp; d.message));
const goi = async (duong, { body, token, method = body !== undefined ? 'POST' : 'GET', tho } = {}) =&gt; {
  try {
    const r = await fetch(\`\${goc}\${duong}\`, {
      method,
      headers: {
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(token ? { authorization: \`Bearer \${token}\` } : {}),
      },
      body: tho ?? (body !== undefined ? JSON.stringify(body) : undefined),
      signal: AbortSignal.timeout(15000),
    });
    const text = await r.text();
    let json = {};
    try {
      json = JSON.parse(text);
    } catch {}
    if (r.status &gt;= 400) loiDaThay.push({ duong: \`\${method} \${duong.slice(0, 40)}\`, ma: r.status, json });
    return { ma: r.status, json, rid: r.headers.get('x-request-id') };
  } catch {
    return { ma: 0, json: {}, rid: null };
  }
};
let h = { ma: 0 };
for (let i = 0; i &lt; 40 &amp;&amp; h.ma === 0; i++) {
  await ngu(1000);
  h = await goi('/health');
}
kiem(\`API sống (\${goc}/health → \${h.ma})\`, h.ma === 200);
if (h.ma !== 200) await ketThuc();

const mk = process.env.SEED_PASSWORD ?? 'chiase-mau-2026';
const an = (await goi('/auth/login', { body: { email: 'an@chiase.dev', password: mk } })).json.accessToken;
const binh = (await goi('/auth/login', { body: { email: 'binh@chiase.dev', password: mk } })).json
  .accessToken;
if (!an || !binh) {
  kiem('hai tài khoản seed đăng nhập được', false);
  await ketThuc();
}
const BAO_VE = [
  ['POST', '/posts/00000000-0000-7000-8000-000000000000/comments'],
  ['DELETE', '/comments/00000000-0000-7000-8000-000000000000'],
];
const khongToken = await Promise.all(
  BAO_VE.map(([method, d]) =&gt; goi(d, { method, body: method === 'DELETE' ? undefined : {} })),
);
kiem(
  \`\${BAO_VE.length} route bình luận cần đăng nhập, không token → \${khongToken.map((r) =&gt; r.ma).join(', ')}\`,
  khongToken.every((r) =&gt; r.ma === 401),
);

// Dữ liệu thử: 25 bài tạo bằng MỘT câu INSERT ⇒ TRÙNG HẲN created_at (như nhập lô) — đúng ca làm cursor sai bỏ sót bài.
const nhan = \`cp5-\${Date.now()}\`;
const [{ id: idAn }] = await sql(\`SELECT id FROM users WHERE email = 'an@chiase.dev'\`);
const [{ id: idBinh }] = await sql(\`SELECT id FROM users WHERE email = 'binh@chiase.dev'\`);
const baiThu = await sql(
  \`INSERT INTO posts (author_id, title, body, status) SELECT $1, $2 || ' #' || g, 'x', 'published'
   FROM generate_series(1, 25) g RETURNING id, title\`,
  [idAn, nhan],
);
await sql(
  \`INSERT INTO comments (post_id, author_id, body, created_at)
   SELECT p.id, $1, 'bl ' || k, now() + make_interval(secs =&gt; k)
   FROM posts p, generate_series(1, 12) k
   WHERE p.title LIKE $2 || ' #%' AND k &lt;= split_part(p.title, '#', 2)::int % 5\`,
  [idBinh, nhan],
);
const laCuaToi = (b) =&gt; b.title?.startsWith(\`\${nhan} #\`);

console.log('== 3. Feed phân trang cursor');
const diFeed = async (limit, chenGiua) =&gt; {
  const thay = [];
  let cursor = null;
  for (let trang = 1; trang &lt;= 200; trang++) {
    const r = await goi(\`/posts?limit=\${limit}\${cursor ? \`&amp;cursor=\${encodeURIComponent(cursor)}\` : ''}\`);
    if (r.ma !== 200 || !Array.isArray(r.json.items)) return { loi: \`trang \${trang} → \${r.ma}\`, thay };
    thay.push(...r.json.items);
    if (trang === 1 &amp;&amp; chenGiua) await chenGiua();
    cursor = r.json.nextCursor;
    if (!cursor || baiThu.every((b) =&gt; thay.some((t) =&gt; t.id === b.id))) break;
  }
  return { thay };
};
const d1 = await diFeed(7);
const cuaToi = d1.thay.filter(laCuaToi);
kiem(
  \`đi feed 7 bài/trang: gặp \${cuaToi.length}/25 bài trùng giờ tạo\${d1.loi ? \` (\${d1.loi})\` : ''}\`,
  !d1.loi &amp;&amp; new Set(cuaToi.map((b) =&gt; b.id)).size === 25,
);
kiem(
  \`không bài nào lặp lại giữa các trang (\${d1.thay.length} bài nhận, \${new Set(d1.thay.map((b) =&gt; b.id)).size} khác nhau)\`,
  d1.thay.length === new Set(d1.thay.map((b) =&gt; b.id)).size,
);
const giam = d1.thay.every((b, i, a) =&gt; {
  if (i === 0) return true;
  const t = a[i - 1];
  return t.createdAt &gt; b.createdAt || (t.createdAt === b.createdAt &amp;&amp; t.id &gt; b.id);
});
kiem('thứ tự giảm dần chặt theo (createdAt, id) — id phân xử khi trùng giờ', giam);
const d2 = await diFeed(10, () =&gt;
  goi('/posts', { token: an, body: { title: \`\${nhan} chen\`, body: 'x', status: 'published' } }),
);
kiem(
  \`có bài mới đăng chen giữa trang 1 và 2 ⇒ vẫn không lặp (\${d2.thay.length} nhận, \${new Set(d2.thay.map((b) =&gt; b.id)).size} khác nhau)\`,
  !d2.loi &amp;&amp; d2.thay.length === new Set(d2.thay.map((b) =&gt; b.id)).size,
);
const sai = await Promise.all(
  ['/posts?limit=0', '/posts?limit=51', '/posts?limit=abc', '/posts?cursor=khong-phai-cursor'].map((d) =&gt;
    goi(d),
  ),
);
kiem(
  \`limit=0 | 51 | abc | cursor rác → \${sai.map((r) =&gt; \`\${r.ma} \${r.json.error?.code}\`).join(', ')}\`,
  sai.every((r) =&gt; r.ma === 400),
);

console.log('== 4. commentCount và số truy vấn');
const demThat = Object.fromEntries(
  (
    await sql(
      \`SELECT p.id, count(c.id)::int AS n FROM posts p LEFT JOIN comments c ON c.post_id = p.id
       WHERE p.title LIKE $1 || ' #%' GROUP BY p.id\`,
      [nhan],
    )
  ).map((d) =&gt; [d.id, d.n]),
);
const lech = cuaToi.filter((b) =&gt; b.commentCount !== demThat[b.id]);
kiem(
  \`commentCount của 25 bài khớp COUNT(*) trong CSDL (\${25 - lech.length}/25 khớp\${lech.length ? \`, vd "\${lech[0].title}": API \${lech[0].commentCount} ≠ CSDL \${demThat[lech[0].id]}\` : ''})\`,
  cuaToi.length === 25 &amp;&amp; lech.length === 0,
);
const soSql = async (limit) =&gt; {
  const r = await goi(\`/posts?limit=\${limit}\`);
  await ngu(300); // dòng log được ghi khi request ĐÓNG
  const dong = logApi.split('\\n').find((d) =&gt; r.rid &amp;&amp; d.includes(r.rid) &amp;&amp; /· \\d+ sql/.test(d));
  return Number(dong?.match(/· (\\d+) sql/)?.[1] ?? NaN);
};
const [s5, s50] = [await soSql(5), await soSql(50)];
kiem(
  \`số truy vấn: 5 bài/trang → \${s5}, 50 bài/trang → \${s50} (phải BẰNG nhau và ≤ 4; khác nhau = N+1)\`,
  Number.isFinite(s5) &amp;&amp; s5 === s50 &amp;&amp; s5 &lt;= 4,
);

console.log('== 5. Bình luận: tạo, đọc theo trang, quyền xoá, cascade');
const bai12 = baiThu.find((b) =&gt; b.title === \`\${nhan} #4\`); // 4 % 5 = 4 bình luận có sẵn
const them = [];
for (let i = 0; i &lt; 8; i++)
  them.push(await goi(\`/posts/\${bai12.id}/comments\`, { token: binh, body: { body: \`  thêm \${i}  \` } }));
kiem(
  \`Bình bình luận 8 lần → \${[...new Set(them.map((r) =&gt; r.ma))].join(',')}; nội dung đã trim ("\${them[0].json.body}")\`,
  them.every((r) =&gt; r.ma === 201) &amp;&amp; them[0].json.body === 'thêm 0',
);
const dsBl = [];
let c = null;
let soTrang = 0;
do {
  const r = await goi(\`/posts/\${bai12.id}/comments?limit=5\${c ? \`&amp;cursor=\${encodeURIComponent(c)}\` : ''}\`);
  if (r.ma !== 200) break;
  dsBl.push(...r.json.items);
  c = r.json.nextCursor;
  soTrang++;
} while (c &amp;&amp; soTrang &lt; 10);
kiem(
  \`đọc bình luận 5 cái/trang: \${soTrang} trang, \${dsBl.length} bình luận, cũ trước (phải 3 trang, 12, tăng dần)\`,
  soTrang === 3 &amp;&amp;
    dsBl.length === 12 &amp;&amp;
    dsBl.every((b, i, a) =&gt; i === 0 || a[i - 1].createdAt &lt;= b.createdAt),
);
const nhap = await goi('/posts', { token: an, body: { title: \`\${nhan} nháp\`, body: 'x' } });
const vaoNhap = await goi(\`/posts/\${nhap.json.id}/comments\`, { token: binh, body: { body: 'hi' } });
kiem(\`Bình bình luận vào bài NHÁP của An → \${vaoNhap.ma}\`, vaoNhap.ma === 404);
const blAn = await goi(\`/posts/\${bai12.id}/comments\`, { token: an, body: { body: 'tác giả trả lời' } });
const binhXoaAn = await goi(\`/comments/\${blAn.json.id}\`, { token: binh, method: 'DELETE' });
const anXoaBinh = await goi(\`/comments/\${them[0].json.id}\`, { token: an, method: 'DELETE' });
const xoaLai = await goi(\`/comments/\${them[0].json.id}\`, { token: an, method: 'DELETE' });
kiem(
  \`Bình xoá bình luận của An → \${binhXoaAn.ma}; An (tác giả bài) xoá bình luận của Bình → \${anXoaBinh.ma}; xoá lại → \${xoaLai.ma}\`,
  binhXoaAn.ma === 403 &amp;&amp; anXoaBinh.ma === 204 &amp;&amp; xoaLai.ma === 404,
);
const xoaBai = await goi(\`/posts/\${bai12.id}\`, { token: an, method: 'DELETE' });
const [{ con }] = await sql(\`SELECT count(*)::int AS con FROM comments WHERE post_id = $1\`, [bai12.id]);
kiem(
  \`An xoá bài → \${xoaBai.ma}; bình luận của bài đó còn trong CSDL: \${con} (cascade)\`,
  xoaBai.ma === 204 &amp;&amp; con === 0,
);

console.log('== 6. Một hình dạng lỗi cho TOÀN BỘ API');
const duLieuSai = await goi(\`/posts/\${baiThu[0].id}/comments\`, {
  token: binh,
  body: { body: '   ', authorId: idBinh },
});
const truong = (duLieuSai.json.error?.details ?? []).map((d) =&gt; d.field).sort();
kiem(
  \`body rỗng + authorId lạ → \${duLieuSai.ma}, details có ĐỦ 2 trường [\${truong.join(', ')}]\`,
  duLieuSai.ma === 400 &amp;&amp; truong.join() === 'authorId,body',
);
const lon = await goi('/posts', {
  token: an,
  tho: JSON.stringify({ title: 'x', body: 'a'.repeat(200_000) }),
  method: 'POST',
  body: null,
});
const hong = await goi('/posts', { token: an, tho: '{"title":', method: 'POST', body: null });
const urlHong = await goi('/posts/%E0%A4%A');
kiem(
  \`body 200 KB → \${lon.ma}; JSON hỏng → \${hong.ma}; URL mã % hỏng → \${urlHong.ma} (lỗi của CLIENT, không được là 500)\`,
  lon.ma === 413 &amp;&amp; hong.ma === 400 &amp;&amp; urlHong.ma === 400,
);
const saiHinh = loiDaThay.filter((l) =&gt; !dungHinhDang(l.json));
kiem(
  \`\${loiDaThay.length} phản hồi lỗi trong lượt chấm này đều đúng { error: { code, message, details?, requestId } }\${saiHinh.length ? \` — sai: \${saiHinh[0].duong} → \${saiHinh[0].ma} \${JSON.stringify(saiHinh[0].json).slice(0, 80)}\` : ''}\`,
  loiDaThay.length &gt;= 10 &amp;&amp; saiHinh.length === 0,
);
const rid = duLieuSai.json.error?.requestId;
kiem(\`requestId của lỗi tìm được trong log máy chủ (\${rid?.slice(0, 8)}…)\`, !!rid &amp;&amp; logApi.includes(rid));

// Dọn dữ liệu thử của lượt chấm (bình luận đi theo nhờ cascade)
await sql(\`DELETE FROM posts WHERE title LIKE $1 || ' %'\`, [nhan]);
await ketThuc();`;

const OUT_CLONE_3 = `$ npm run db:migrate -w apps/api &amp;&amp; npm run db:seed -w apps/api &amp;&amp; npm run kho:chuan-bi -w apps/api
Applying migration \`20261124120000_init_users\`
Applying migration \`20261124120015_users_db_defaults\`
Applying migration \`20261124122750_refresh_tokens\`
Applying migration \`20261124130621_posts\`
Applying migration \`20261124134442_comments\`
Applying migration \`20261124135157_ms_timestamps\`
The following migration(s) have been applied:
migrations/
seed: an@chiase.dev An Nguyễn
seed: binh@chiase.dev Bình Trần
Mật khẩu mẫu: chiase-mau-2026
✔ bucket "chiase"
✔ chính sách: ai cũng ĐỌC được posts/*
✔ CORS: cho phép PUT từ http://localhost:41811
✔ vòng đời: tự xoá tmp/ sau 1 ngày
$ node scripts/checkpoint-5.mjs     # lần 3
== 0. Checkpoint 4 vẫn đạt
  ✔ checkpoint-4: KẾT QUẢ: 23 đạt, 0 trượt
== 1. Lược đồ: bảng comments
  ✔ bảng comments tồn tại
  ✔ khoá ngoại comments → posts có ON DELETE CASCADE (confdeltype=c)
  ✔ comments có CHECK chặn nội dung toàn khoảng trắng
  ✔ created_at lưu tới mili giây: comments(3), posts(3)
== 2. Bật API (DEM_SQL=1 để đếm truy vấn mỗi request)
  ✔ API sống (http://localhost:41825/api/health → 200)
  ✔ 2 route bình luận cần đăng nhập, không token → 401, 401
== 3. Feed phân trang cursor
  ✔ đi feed 7 bài/trang: gặp 25/25 bài trùng giờ tạo
  ✔ không bài nào lặp lại giữa các trang (25 bài nhận, 25 khác nhau)
  ✔ thứ tự giảm dần chặt theo (createdAt, id) — id phân xử khi trùng giờ
  ✔ có bài mới đăng chen giữa trang 1 và 2 ⇒ vẫn không lặp (25 nhận, 25 khác nhau)
  ✔ limit=0 | 51 | abc | cursor rác → 400 DU_LIEU_SAI, 400 DU_LIEU_SAI, 400 DU_LIEU_SAI, 400 CURSOR_SAI
== 4. commentCount và số truy vấn
  ✔ commentCount của 25 bài khớp COUNT(*) trong CSDL (25/25 khớp)
  ✔ số truy vấn: 5 bài/trang → 3, 50 bài/trang → 3 (phải BẰNG nhau và ≤ 4; khác nhau = N+1)
== 5. Bình luận: tạo, đọc theo trang, quyền xoá, cascade
  ✔ Bình bình luận 8 lần → 201; nội dung đã trim ("thêm 0")
  ✔ đọc bình luận 5 cái/trang: 3 trang, 12 bình luận, cũ trước (phải 3 trang, 12, tăng dần)
  ✔ Bình bình luận vào bài NHÁP của An → 404
  ✔ Bình xoá bình luận của An → 403; An (tác giả bài) xoá bình luận của Bình → 204; xoá lại → 404
  ✔ An xoá bài → 204; bình luận của bài đó còn trong CSDL: 0 (cascade)
== 6. Một hình dạng lỗi cho TOÀN BỘ API
  ✔ body rỗng + authorId lạ → 400, details có ĐỦ 2 trường [authorId, body]
  ✔ body 200 KB → 413; JSON hỏng → 400; URL mã % hỏng → 400 (lỗi của CLIENT, không được là 500)
  ✔ 13 phản hồi lỗi trong lượt chấm này đều đúng { error: { code, message, details?, requestId } }
  ✔ requestId của lỗi tìm được trong log máy chủ (84e24588…)

KẾT QUẢ: 23 đạt, 0 trượt`;

const OUT_LAN1 = `$ node scripts/checkpoint-5.mjs      # lần chạy đầu tiên, trên máy đang phát triển
== 0. Checkpoint 4 vẫn đạt
  ✘ checkpoint-4: KẾT QUẢ: 22 đạt, 1 trượt
== 6. Một hình dạng lỗi cho TOÀN BỘ API
  ✘ 13 phản hồi lỗi trong lượt chấm này đều đúng { error: { code, message, details?, requestId } }
KẾT QUẢ: 20 đạt, 2 trượt`;

const OUT_CLONE_1 = `$ node scripts/checkpoint-5.mjs     # lần 1: clone sạch, CSDL mới, CHƯA migrate
== 0. Checkpoint 4 vẫn đạt
  ✘ checkpoint-4: KẾT QUẢ: 3 đạt, 2 trượt
== 1. Lược đồ: bảng comments
  ✘ khoá ngoại comments → posts có ON DELETE CASCADE (confdeltype=không có)
/home/…/.rtq-fsp/clone5/node_modules/pg/lib/client.js:694
          Error.captureStackTrace(err)
                ^

error: relation "comments" does not exist
    at /home/…/.rtq-fsp/clone5/node_modules/pg/lib/client.js:694:17
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async sql (file:///home/…/.rtq-fsp/clone5/scripts/checkpoint-5.mjs:35:35)
    at async file:///home/…/.rtq-fsp/clone5/scripts/checkpoint-5.mjs:43:13 {
  … (20 dòng thuộc tính của đối tượng lỗi pg: severity, code: '42P01', file: 'regproc.c'…)`;

const OUT_CLONE_2 = `$ node scripts/checkpoint-5.mjs     # lần 2: checkpoint đã sửa, vẫn CHƯA migrate
== 0. Checkpoint 4 vẫn đạt
  ✘ checkpoint-4: KẾT QUẢ: 3 đạt, 2 trượt
== 1. Lược đồ: bảng comments
  ✘ bảng comments tồn tại
  ⇒ CSDL chưa có bảng comments. Chạy:  npm run db:migrate -w apps/api  rồi chấm lại.

KẾT QUẢ: 0 đạt, 2 trượt`;

const OUT_PHA_N1 = `$ # phá thử: raDsBai đếm bình luận TỪNG bài (N+1)
$ node scripts/checkpoint-5.mjs
  ✘ checkpoint-4: KẾT QUẢ: 22 đạt, 1 trượt
  ✘ số truy vấn: 5 bài/trang → 7, 50 bài/trang → 28 (phải BẰNG nhau và ≤ 4; khác nhau = N+1)
KẾT QUẢ: 21 đạt, 2 trượt`;

const OUT_GIT = `$ git log --oneline --first-parent main -3 &amp;&amp; git log --oneline ch4..ch5 --no-merges
c2bc235 Merge ch5/binh-luan: Checkpoint 5 đạt 23/23
45cb470 Merge ch4/bai-viet: Checkpoint 4 đạt 23/23
6a811cd docs: quyết định bảo mật Chương 3 + bước điền JWT_ACCESS_SECRET trong README
1842bec docs: README — API bình luận, phân trang, quyết định Chương 5
6ce7825 test: checkpoint-5 báo gợi ý migrate thay vì văng lỗi 42P01
20f7233 test: checkpoint-5 (22 tiêu chí); checkpoint-3 so lỗi trừ requestId
75025e4 feat(errors): một hình dạng lỗi (code, message, details, requestId), lỗi thư viện 4xx không thành 500, query_timeout 5 s
b6bb884 test: checkpoint-4 đọc feed dạng { items, nextCursor }
70994ac feat(feed): phân trang cursor (createdAt,id) cho feed + bình luận; timestamptz(3); validateQuery
def2e66 feat(comments): model Comment cascade + CHECK, 3 endpoint, commentCount đếm theo lô (không N+1, không _count)
$ git tag
ch1 ch2 ch3 ch4 ch5 `;

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-5-3-validation', title: 'Testing 5.3 — Kiểm dữ liệu vào và phản hồi lỗi', sub: 'Viết test cho 400/422 và một định dạng lỗi — Chương 8 của khoá này dùng lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-3-5-lab', title: 'API Design 3.5 — Lab 3: danh sách bảo trì', sub: 'Thêm một lab phân trang con trỏ + lọc + sắp xếp để luyện tay.', cta: 'Mở bài →' }),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Section</th><th>What it proves</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>0</td><td>Checkpoint 4 (and through it 3, 2, 1) still passes — nothing from earlier chapters broke</td><td>4.4</td></tr>
<tr><td>1</td><td><code>comments</code> exists; its foreign key to <code>posts</code> is CASCADE; a CHECK exists; both <code>created_at</code> columns have precision 3</td><td>5.1, 5.2</td></tr>
<tr><td>2</td><td>The API starts with <code>DEM_SQL=1</code>; the two comment write routes refuse requests without a token</td><td>5.1</td></tr>
<tr><td>3</td><td>Walking the feed 7 per page finds all 25 posts that share one timestamp, no duplicates, strict order; a post published between page 1 and 2 causes no duplicate; bad <code>limit</code>/<code>cursor</code> ⇒ 400</td><td>5.2</td></tr>
<tr><td>4</td><td><code>commentCount</code> equals <code>COUNT(*)</code> for 25 posts; the number of queries is the same for 5 and 50 posts per page (and ≤ 4)</td><td>5.1</td></tr>
<tr><td>5</td><td>Comments: create + trim, pages of 5 oldest-first, draft ⇒ 404, delete permissions 403/204/404, cascade on post delete</td><td>5.1, 5.2</td></tr>
<tr><td>6</td><td>Validation lists every field; 413/400/400 for client mistakes; <em>every</em> error seen during the run matches the contract; its <code>requestId</code> is in the server log</td><td>5.3</td></tr>
</tbody></table>`;

const BANG_VI = `<table>
<thead><tr><th>Mục</th><th>Chứng minh điều gì</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>0</td><td>Checkpoint 4 (và qua nó 3, 2, 1) vẫn đạt — không gì của các chương trước bị vỡ</td><td>4.4</td></tr>
<tr><td>1</td><td>Có bảng <code>comments</code>; khoá ngoại tới <code>posts</code> là CASCADE; có CHECK; cả hai cột <code>created_at</code> có độ chính xác 3</td><td>5.1, 5.2</td></tr>
<tr><td>2</td><td>API bật với <code>DEM_SQL=1</code>; hai route ghi bình luận từ chối request không token</td><td>5.1</td></tr>
<tr><td>3</td><td>Đi feed 7 bài/trang gặp đủ 25 bài trùng một giờ tạo, không trùng, thứ tự chặt; bài đăng chen giữa trang 1 và 2 không gây lặp; <code>limit</code>/<code>cursor</code> sai ⇒ 400</td><td>5.2</td></tr>
<tr><td>4</td><td><code>commentCount</code> bằng <code>COUNT(*)</code> cho 25 bài; số truy vấn như nhau với 5 và 50 bài/trang (và ≤ 4)</td><td>5.1</td></tr>
<tr><td>5</td><td>Bình luận: tạo + trim, trang 5 cái cũ trước, nháp ⇒ 404, quyền xoá 403/204/404, cascade khi xoá bài</td><td>5.1, 5.2</td></tr>
<tr><td>6</td><td>Validate liệt kê mọi trường; 413/400/400 cho lỗi của client; <em>mọi</em> lỗi gặp trong lượt chấm đúng hợp đồng; <code>requestId</code> của nó có trong log máy chủ</td><td>5.3</td></tr>
</tbody></table>`;

export default {
  title: '5.4 — Checkpoint 5: a paginated feed with comment counts|||5.4 — Checkpoint 5: feed phân trang kèm số bình luận',
  slug: 'fp-5-4-checkpoint-5',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Checkpoint 5 chấm 23 tiêu chí bằng một lệnh: đi hết feed theo cursor với 25 bài trùng giờ tạo và một bài chen giữa, commentCount khớp COUNT(*), số truy vấn không đổi theo cỡ trang (bắt N+1), bình luận + quyền xoá + cascade, và mọi lỗi đúng một hợp đồng có requestId. Kèm các lần trượt thật: requestId làm vỡ checkpoint-3, ngưỡng tự đoán, script văng 42P01 trên CSDL mới, và phá thử N+1 để chứng minh checkpoint bắt được.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Checkpoint</span>
<h2>Twenty-three checks: the feed is complete, the counts are true, the errors are one shape</h2>
<p class="lead">Chapter 5 changed things that are easy to break silently: the shape of <code>GET /posts</code>, a column type, every error response. A checkpoint that only says "200 OK" would pass while users lose 15 posts to a microsecond. So Checkpoint 5 tests <em>properties</em> — every post exactly once, the count equals the database, the query count does not grow with the page — on data built to trigger the bugs we found.</p>

<h3>What Checkpoint 5 checks, and why</h3>
${BANG_EN}
<p>The test data is chosen, not random: 25 posts inserted with <strong>one</strong> <code>INSERT</code> so they share a timestamp (the case that broke our first cursor), comments in amounts 0–4 per post so counts differ, and a post with 12 comments to page through in steps of 5. Everything carries a unique label (<code>cp5-&lt;time&gt;</code>) and is deleted at the end, so you can run the checkpoint on your dev database as often as you like.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">schema</span><span class="lz-d">read pg_constraint and information_schema — not the Prisma file</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">data</span><span class="lz-d">insert the nasty cases with SQL: ties, varied counts</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">walk</span><span class="lz-d">follow nextCursor, insert mid-walk, compare sets</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">count</span><span class="lz-d">API numbers vs COUNT(*); SQL per request vs page size</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">contract</span><span class="lz-d">every 4xx/5xx seen in the run is checked against the error shape</span></div>
</div>

<h3>The script</h3>
<p>Plain Node (no TypeScript, no test framework) so it runs the same on Windows, macOS and Linux. It talks to PostgreSQL directly with <code>pg</code> to create data and to read the truth, starts the API itself with <code>DEM_SQL=1</code>, and reads the <code>· N sql</code> suffix of the log line whose request id matches the <code>X-Request-Id</code> header it received.</p>
<pre><code class="language-js">${SCRIPT}</code></pre>
<div class="pitfall co-tieu-de"><p><strong>Trap — counting queries in parallel.</strong> The counter is global (Prisma's query event fires outside the request's async context). It is exact only while one request runs at a time — which is why section 4 calls the feed sequentially and waits 300 ms for the log line. Do not use this number in production dashboards.</p></div>

<h3>Running it</h3>
<div class="out">${OUT_CLONE_3}</div>

<h3>Real failures on the way to 23/23</h3>
<p><strong>1. The first run on the development machine:</strong></p>
<div class="out">${OUT_LAN1}</div>
<p>Two different kinds of red. The first is a real regression caught by the chain: adding <code>requestId</code> broke Checkpoint 3's "identical bodies" assertion — lesson 5.3, section 6 explains the fix. The second was a bug in the checkpoint itself: "at least 15 errors seen" was a number I guessed; the run produces 13, all of them correct. A threshold that is not derived from the test's own steps is a guess — it now says ≥ 10, which the steps above guarantee.</p>
<p><strong>2. A machine that has never seen the project</strong> — fresh clone, <code>npm ci</code>, new PostgreSQL and MinIO containers, nothing migrated:</p>
<div class="out">${OUT_CLONE_1}</div>
<p>The checkpoint crashed with a raw <code>42P01 relation "comments" does not exist</code> — exactly the kind of message that makes a learner think the project is broken. Checkpoint 3 had the same flaw in Chapter 3. Fixed: check <code>to_regclass('comments')</code> first and print the command to run:</p>
<div class="out">${OUT_CLONE_2}</div>
<p>Then <code>db:migrate</code>, <code>db:seed</code>, <code>kho:chuan-bi</code> — and the run in the previous section, 23/23.</p>
<p><strong>3. Does it really catch N+1?</strong> A checkpoint you have never seen fail proves nothing. On the clone we put the per-post count back into <code>raDsBai</code>:</p>
<div class="out">${OUT_PHA_N1}</div>
<p>5 posts per page ⇒ 7 queries (2 + 5); 50 per page ⇒ 28 (2 + 26 — the fresh database only has 26 published posts). Caught. And Checkpoint 4 went red too, for a reason we did not plan: the lint step in Checkpoint 1 saw that <code>demBinhLuan</code> was no longer used (<code>eslint(no-unused-vars)</code>). Two independent alarms for one regression.</p>

<h3>When a line is red</h3>
<ul>
<li><strong>"gặp x/25 bài trùng giờ tạo"</strong> with x &lt; 25: your cursor loses ties. Check <code>datetime_precision</code> (section 1 line) and that the cursor contains the <code>id</code>.</li>
<li><strong>"không bài nào lặp lại" fails</strong>: ORDER BY lacks <code>id</code>, or the cursor condition uses <code>&lt;=</code> on both columns.</li>
<li><strong>"số truy vấn: 5 → a, 50 → b" with a ≠ b</strong>: something counts or loads per post. Run the feed with <code>IN_SQL=1</code> and look for a statement repeated N times.</li>
<li><strong>"commentCount … khớp" fails</strong>: you count something else (e.g. only your own comments) or cache counts.</li>
<li><strong>"phản hồi lỗi … đều đúng" fails</strong>: the message shows the first offending route and body — a middleware still writes JSON itself.</li>
<li><strong>"requestId … tìm được trong log"</strong> fails: <code>ganRequestId</code> is not the first middleware, or the log line does not print <code>req.id</code>.</li>
</ul>

<h3>Closing the chapter</h3>
<div class="out">${OUT_GIT}</div>
<p>Six commits on <code>ch5/binh-luan</code>, a README section "Quyết định Chương 5", merged with <code>--no-ff</code> so <code>main</code> reads one line per chapter, tagged <code>ch5</code>. Lab containers stopped and removed (with their volumes).</p>

${spring(false, 'In a Spring project the same checkpoint is a <code>@SpringBootTest</code> with Testcontainers: insert the tie case with <code>JdbcTemplate</code>, walk your keyset endpoint with <code>TestRestTemplate</code>/<code>MockMvc</code>, count statements with Hibernate statistics (<code>getPrepareStatementCount()</code>) for 5 and 50 items, and assert every error body is a <code>ProblemDetail</code>.', [
  ['sb-11-4-testcontainers', 'Spring Boot 11.4 — Testcontainers: tests against a real database'],
  ['sb-7-1-n-cong-1', 'Spring Boot 7.1 — The N+1 problem: detect and fix'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How would you test that pagination never skips or repeats items?"</strong> — Build data with ties and concurrent inserts, walk all pages, compare the set of ids with the database; assert strict ordering.</li>
<li><strong>"How do you write a test that catches N+1?"</strong> — Count queries for a request at two page sizes; the count must not depend on the number of items.</li>
<li><strong>"Your test passed the first time. Is that good?"</strong> — Not yet: break the code on purpose and see the test fail (mutation-style check). A test that cannot fail is not a test.</li>
<li><strong>"Test data: random or chosen?"</strong> — Chosen for the edge cases (ties, empty, boundaries) plus a unique label so tests can run on shared databases and clean up.</li>
</ol>

<h3>🧪 Lab — Checkpoint 5 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>Copy <code>scripts/checkpoint-5.mjs</code> or write your own with the same seven sections. Run it; fix your code until 23/23.</li>
<li>Break three things on purpose, one at a time, and record which line goes red: remove <code>id</code> from <code>orderBy</code>; revert <code>Timestamptz(3)</code> in a fresh database; count comments per post.</li>
<li>Clone your repo to a new folder, start new containers on other ports, run the checkpoint before and after migrating.</li>
<li>Merge <code>ch5/binh-luan</code> into <code>main</code> with <code>--no-ff</code>, tag <code>ch5</code>, stop and remove the lab containers.</li>
</ol>
<p><strong>Done when:</strong> <code>node scripts/checkpoint-5.mjs</code> prints <code>KẾT QUẢ: 23 đạt, 0 trượt</code> on a fresh clone, and you have seen each of your three sabotages turn a specific line red.</p>
</div>
<details><summary>Solution</summary>
<p>Tag <code>ch5</code> (main <code>c2bc235</code>), script <code>scripts/checkpoint-5.mjs</code> at commit <code>6ce7825</code>. Measured here: per-post counting turns the "số truy vấn" line red (section 3 above). The other two were not re-run inside the checkpoint — reason them out, then confirm on your machine: with microsecond timestamps, lesson 5.2 measured 15 of 25 tied posts lost at 10 per page, so at 7 per page expect the "x/25" line to show about 7/25; without <code>id</code> in <code>orderBy</code> the tied posts have no defined order, so the "strict order" line (and possibly "no duplicates") should go red. If the checkpoint hangs at "API sống", another server already holds the port in <code>.env</code> — stop it first.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">property test</span><span class="v">Asserting a rule that must hold for the whole result (each id once), not one example value.</span></div>
  <div class="kv"><span class="k">sabotage / mutation check</span><span class="v">Breaking the code on purpose to confirm the test can fail.</span></div>
  <div class="kv"><span class="k">regression</span><span class="v">Something that worked before and broke after a change; caught by re-running old checkpoints.</span></div>
  <div class="kv"><span class="k">to_regclass</span><span class="v">PostgreSQL function returning a table's oid, or NULL if it does not exist — no error.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>23 checks in 7 sections; each section maps to a lesson of the chapter.</li>
<li>Test data reproduces the bugs we found (timestamp ties, varied counts) and cleans itself up.</li>
<li>N+1 is detected by comparing query counts at two page sizes.</li>
<li>Every error seen during the run is validated against the contract.</li>
<li>We watched it fail for real reasons and fixed two flaws in the checkpoint itself.</li>
</ul>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Checkpoint</span>
<h2>Hai mươi ba phép kiểm: feed đủ bài, con số đúng, lỗi một hình dạng</h2>
<p class="lead">Chương 5 đổi những thứ rất dễ hỏng mà không ai hay: hình dạng của <code>GET /posts</code>, kiểu một cột, mọi phản hồi lỗi. Một checkpoint chỉ biết "200 OK" sẽ đạt trong khi người dùng mất 15 bài vì một micro giây. Vì vậy Checkpoint 5 kiểm <em>tính chất</em> — mỗi bài đúng một lần, con số bằng CSDL, số truy vấn không tăng theo cỡ trang — trên dữ liệu được dựng để kích đúng các lỗi ta đã tìm ra.</p>

<h3>Checkpoint 5 kiểm gì, và vì sao</h3>
${BANG_VI}
<p>Dữ liệu thử được CHỌN, không ngẫu nhiên: 25 bài chèn bằng <strong>một</strong> câu <code>INSERT</code> để trùng giờ tạo (đúng ca làm hỏng cursor đầu tiên của ta), bình luận 0–4 cái mỗi bài để các con số khác nhau, và một bài 12 bình luận để lật trang 5 cái một. Mọi thứ mang nhãn riêng (<code>cp5-&lt;thời điểm&gt;</code>) và bị xoá ở cuối, nên bạn chạy checkpoint trên CSDL dev bao nhiêu lần cũng được.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">lược đồ</span><span class="lz-d">đọc pg_constraint và information_schema — không đọc tệp Prisma</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">dữ liệu</span><span class="lz-d">chèn các ca hiểm bằng SQL: trùng giờ, số bình luận khác nhau</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">đi feed</span><span class="lz-d">theo nextCursor, chèn bài giữa chừng, so tập hợp</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">đếm</span><span class="lz-d">số của API vs COUNT(*); số SQL mỗi request vs cỡ trang</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">hợp đồng</span><span class="lz-d">mọi 4xx/5xx gặp trong lượt chấm đều soát theo hình dạng lỗi</span></div>
</div>

<h3>Script</h3>
<p>Node thuần (không TypeScript, không framework test) để chạy y hệt trên Windows, macOS và Linux. Nó nói chuyện thẳng với PostgreSQL bằng <code>pg</code> để tạo dữ liệu và đọc "sự thật", tự bật API với <code>DEM_SQL=1</code>, và đọc đuôi <code>· N sql</code> của dòng log có request id khớp với header <code>X-Request-Id</code> nó nhận được.</p>
<pre><code class="language-js">${SCRIPT}</code></pre>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đếm truy vấn khi chạy song song.</strong> Bộ đếm là toàn cục (sự kiện query của Prisma bắn ngoài ngữ cảnh async của request). Nó chỉ đúng khi một request chạy một lúc — vì vậy mục 4 gọi feed tuần tự và chờ 300 ms cho dòng log. Đừng dùng con số này trên bảng giám sát production.</p></div>

<h3>Chạy</h3>
<div class="out">${OUT_CLONE_3}</div>

<h3>Những lần trượt thật trên đường tới 23/23</h3>
<p><strong>1. Lần chạy đầu trên máy đang phát triển:</strong></p>
<div class="out">${OUT_LAN1}</div>
<p>Hai kiểu đỏ khác nhau. Kiểu thứ nhất là hồi quy thật, chuỗi checkpoint bắt được: thêm <code>requestId</code> làm vỡ khẳng định "hai body giống hệt" của Checkpoint 3 — bài 5.3 mục 6 giải thích cách sửa. Kiểu thứ hai là lỗi của chính checkpoint: "gặp ít nhất 15 lỗi" là con số tôi đoán; lượt chấm sinh ra 13 lỗi, lỗi nào cũng đúng. Ngưỡng không suy ra từ chính các bước của phép kiểm là đoán mò — giờ nó là ≥ 10, đúng số các bước ở trên bảo đảm.</p>
<p><strong>2. Một máy chưa từng thấy dự án</strong> — clone sạch, <code>npm ci</code>, container PostgreSQL và MinIO mới, chưa migrate gì:</p>
<div class="out">${OUT_CLONE_1}</div>
<p>Checkpoint văng nguyên lỗi <code>42P01 relation "comments" does not exist</code> — đúng kiểu thông báo làm người học tưởng dự án hỏng. Checkpoint 3 từng có lỗi y hệt ở Chương 3. Đã sửa: kiểm <code>to_regclass('comments')</code> trước và in lệnh cần chạy:</p>
<div class="out">${OUT_CLONE_2}</div>
<p>Rồi <code>db:migrate</code>, <code>db:seed</code>, <code>kho:chuan-bi</code> — và lần chạy ở mục trên, 23/23.</p>
<p><strong>3. Nó có bắt được N+1 thật không?</strong> Một checkpoint bạn chưa từng thấy trượt thì chẳng chứng minh được gì. Trên bản clone, ta đưa cách đếm từng bài trở lại <code>raDsBai</code>:</p>
<div class="out">${OUT_PHA_N1}</div>
<p>5 bài/trang ⇒ 7 truy vấn (2 + 5); 50 bài/trang ⇒ 28 (2 + 26 — CSDL mới chỉ có 26 bài đã đăng). Bắt được. Và Checkpoint 4 cũng đỏ, vì một lý do ta không định trước: bước lint trong Checkpoint 1 thấy <code>demBinhLuan</code> không còn được dùng (<code>eslint(no-unused-vars)</code>). Hai chuông báo độc lập cho một lần hồi quy.</p>

<h3>Khi một dòng đỏ</h3>
<ul>
<li><strong>"gặp x/25 bài trùng giờ tạo"</strong> với x &lt; 25: cursor của bạn làm rơi bài trùng giờ. Xem <code>datetime_precision</code> (dòng ở mục 1) và cursor có chứa <code>id</code> không.</li>
<li><strong>"không bài nào lặp lại" trượt</strong>: ORDER BY thiếu <code>id</code>, hoặc điều kiện cursor dùng <code>&lt;=</code> cho cả hai cột.</li>
<li><strong>"số truy vấn: 5 → a, 50 → b" với a ≠ b</strong>: có thứ gì đó đếm/tải theo từng bài. Chạy feed với <code>IN_SQL=1</code> và tìm câu lệnh lặp N lần.</li>
<li><strong>"commentCount … khớp" trượt</strong>: bạn đếm thứ khác (vd chỉ bình luận của mình) hoặc cache con số.</li>
<li><strong>"phản hồi lỗi … đều đúng" trượt</strong>: câu báo chỉ ra route và thân lỗi đầu tiên sai — vẫn còn middleware tự viết JSON.</li>
<li><strong>"requestId … tìm được trong log" trượt</strong>: <code>ganRequestId</code> không phải middleware đầu tiên, hoặc dòng log không in <code>req.id</code>.</li>
</ul>

<h3>Đóng chương</h3>
<div class="out">${OUT_GIT}</div>
<p>Sáu commit trên <code>ch5/binh-luan</code>, một mục README "Quyết định Chương 5", merge bằng <code>--no-ff</code> để <code>main</code> đọc mỗi chương một dòng, gắn tag <code>ch5</code>. Container lab đã dừng và xoá (kèm volume).</p>

${spring(false, 'Trong dự án Spring, checkpoint này là một <code>@SpringBootTest</code> với Testcontainers: chèn ca trùng giờ bằng <code>JdbcTemplate</code>, đi hết endpoint keyset bằng <code>TestRestTemplate</code>/<code>MockMvc</code>, đếm câu lệnh bằng Hibernate statistics (<code>getPrepareStatementCount()</code>) cho 5 và 50 phần tử, và khẳng định mọi thân lỗi là <code>ProblemDetail</code>.', [
  ['sb-11-4-testcontainers', 'Spring Boot 11.4 — Testcontainers: test với CSDL thật'],
  ['sb-7-1-n-cong-1', 'Spring Boot 7.1 — Vấn đề N+1: phát hiện và sửa'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn test thế nào để chắc phân trang không bao giờ sót hay lặp?"</strong> — Dựng dữ liệu có trùng khoá sắp xếp và có chèn đồng thời, đi hết các trang, so tập id với CSDL; khẳng định thứ tự chặt.</li>
<li><strong>"Viết test bắt N+1 thế nào?"</strong> — Đếm truy vấn của một request ở hai cỡ trang; con số không được phụ thuộc số phần tử.</li>
<li><strong>"Test của bạn đạt ngay lần đầu. Thế là tốt?"</strong> — Chưa: cố tình phá mã và xem test trượt (kiểu kiểm đột biến). Test không thể trượt thì không phải test.</li>
<li><strong>"Dữ liệu test: ngẫu nhiên hay chọn?"</strong> — Chọn theo ca biên (trùng, rỗng, ranh giới) cộng nhãn riêng để test chạy được trên CSDL dùng chung và tự dọn.</li>
</ol>

<h3>🧪 Lab — Checkpoint 5 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Chép <code>scripts/checkpoint-5.mjs</code> hoặc tự viết với đủ bảy mục như trên. Chạy; sửa mã tới khi 23/23.</li>
<li>Cố tình phá ba thứ, mỗi lần một thứ, ghi lại dòng nào đỏ: bỏ <code>id</code> khỏi <code>orderBy</code>; quay về micro giây trên một CSDL mới; đếm bình luận từng bài.</li>
<li>Clone repo sang thư mục mới, bật container mới ở cổng khác, chạy checkpoint trước và sau khi migrate.</li>
<li>Merge <code>ch5/binh-luan</code> vào <code>main</code> bằng <code>--no-ff</code>, gắn tag <code>ch5</code>, dừng và xoá container lab.</li>
</ol>
<p><strong>Xong khi:</strong> <code>node scripts/checkpoint-5.mjs</code> in <code>KẾT QUẢ: 23 đạt, 0 trượt</code> trên một bản clone sạch, và bạn đã thấy mỗi lần phá làm đúng một dòng cụ thể đỏ lên.</p>
</div>
<details><summary>Lời giải</summary>
<p>Tag <code>ch5</code> (main <code>c2bc235</code>), script <code>scripts/checkpoint-5.mjs</code> ở commit <code>6ce7825</code>. Đã đo ở đây: đếm từng bài ⇒ dòng "số truy vấn" đỏ (mục 3 ở trên). Hai ca còn lại CHƯA chạy lại trong checkpoint — hãy suy luận rồi tự xác nhận trên máy bạn: với micro giây, bài 5.2 đo được mất 15/25 bài trùng giờ ở 10 bài/trang, nên ở 7 bài/trang dòng "x/25" sẽ còn khoảng 7/25; bỏ <code>id</code> khỏi <code>orderBy</code> thì các bài trùng giờ không có thứ tự xác định, dòng "thứ tự chặt" (và có thể cả "không lặp") sẽ đỏ. Checkpoint treo ở "API sống": một máy chủ khác đang giữ cổng trong <code>.env</code> — tắt nó trước.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">kiểm tính chất</span><span class="v">Khẳng định một luật phải đúng cho cả kết quả (mỗi id một lần), không phải một giá trị mẫu.</span></div>
  <div class="kv"><span class="k">phá thử / kiểm đột biến</span><span class="v">Cố tình làm hỏng mã để chắc phép kiểm có thể trượt.</span></div>
  <div class="kv"><span class="k">hồi quy (regression)</span><span class="v">Thứ từng chạy đúng bị hỏng sau một thay đổi; bắt bằng cách chạy lại checkpoint cũ.</span></div>
  <div class="kv"><span class="k">to_regclass</span><span class="v">Hàm PostgreSQL trả oid của bảng, hoặc NULL nếu không có — không ném lỗi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>23 phép kiểm trong 7 mục; mỗi mục ứng với một bài của chương.</li>
<li>Dữ liệu thử tái hiện đúng các lỗi đã tìm ra (trùng giờ, số bình luận khác nhau) và tự dọn.</li>
<li>N+1 được phát hiện bằng cách so số truy vấn ở hai cỡ trang.</li>
<li>Mọi lỗi gặp trong lượt chấm đều được soát theo hợp đồng.</li>
<li>Ta đã thấy nó trượt vì lý do thật, và sửa hai lỗi trong chính checkpoint.</li>
</ul>
${THE}
</div>
`,
};
