/**
 * 4.4 — Checkpoint 4: tạo một bài viết kèm ảnh thật từ đầu tới cuối (soạn 24/11/2026, agent fsp).
 * Output THẬT: scripts/checkpoint-4.mjs (23 tiêu chí, gọi checkpoint-3 → 2 → 1), repo chiase tag ch4 (merge 45cb470).
 * Phát hiện thật 24/11: lần chạy đầu trượt vì 3 tệp chưa chạy Prettier (checkpoint-1 bắt qua chuỗi); tiêu chí "tmp/ đã xoá" bản đầu
 * đọc ẩn danh nên LUÔN 403 dù còn hay mất ⇒ đổi sang HEAD có khoá (NotFound); "tạm" chú thích dòng xoá ảnh ⇒ ảnh còn 200
 * + oxlint bắt biến bai không dùng; clone sạch + npm ci + Postgres/MinIO mới: chưa migrate 3/2 trượt ⇒ chưa chuẩn bị kho:
 * PUT 404 (thêm gợi ý lệnh) ⇒ đủ bước 23/23.
 */
import { lienKet, spring } from '../_chung.mjs';

const TAI_LEN = `# tai_len &lt;token&gt; &lt;tệp&gt; &lt;contentType&gt;  ⇒ in khoá tmp/ sau khi PUT xong (cùng luồng mà frontend sẽ làm ở Chương 6)
tai_len() {
  local ve; ve=$(curl -s $A/uploads -H "Authorization: Bearer $1" -H 'content-type: application/json' \\
    -d "{\\"contentType\\":\\"$3\\",\\"size\\":$(stat -c %s "$2")}")
  curl -s -o /dev/null -X PUT -H "content-type: $3" --data-binary @"$2" "$(echo "$ve" | node -pe 'JSON.parse(require("fs").readFileSync(0)).url')"
  echo "$ve" | node -pe 'JSON.parse(require("fs").readFileSync(0)).key'
}`;

const VE = `$ curl -s $A/uploads -H "Authorization: Bearer $AN" $J -d "{\\"contentType\\":\\"image/jpeg\\",\\"size\\":$(stat -c %s $ANH)}" | tee /tmp/fsp-ve.json | node -pe "const v=JSON.parse(require(\\"fs\\").readFileSync(0)); ({...v, url: v.url.slice(0,95)+\\"…\\"})"
{
  key: 'tmp/01a20da9-f6e4-7dc4-9e4c-4f6480a2e122/28b1832c-d301-495f-ad1a-857ceecaa9c4',
  url: 'http://localhost:41813/chiase/tmp/01a20da9-f6e4-7dc4-9e4c-4f6480a2e122/28b1832c-d301-495f-ad1a-…',
  method: 'PUT',
  headers: { 'content-type': 'image/jpeg' },
  expiresIn: 300
}
$ curl -s -o /dev/null -w "PUT thẳng lên kho: %{http_code}, %{size_upload} byte, %{time_total}s\\n" -X PUT -H "content-type: image/jpeg" --data-binary @$ANH "$(node -pe "require(\\"/tmp/fsp-ve.json\\").url")"
PUT thẳng lên kho: 200, 29992 byte, 0.007539s
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/uploads -H "Authorization: Bearer $AN" $J -d "{\\"contentType\\":\\"image/svg+xml\\",\\"size\\":1000}"
{"error":{"code":"DU_LIEU_SAI","message":"contentType: Invalid option: expected one of \\"image/jpeg\\"|\\"image/png\\"|\\"image/webp\\""}}  [HTTP 400]
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/uploads -H "Authorization: Bearer $AN" $J -d "{\\"contentType\\":\\"image/png\\",\\"size\\":52428800}"
{"error":{"code":"DU_LIEU_SAI","message":"size: ảnh tối đa 5242880 byte"}}  [HTTP 400]`;

const GAN = `$ curl -s -o /dev/null -w "khách đọc thẳng ảnh tmp/: %{http_code}\\n" localhost:41813/chiase/$KEY
khách đọc thẳng ảnh tmp/: 403
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts -H "Authorization: Bearer $BINH" $J -d "{\\"title\\":\\"Lấy ảnh của An\\",\\"body\\":\\"x\\",\\"imageKey\\":\\"$KEY\\"}"
{"error":{"code":"ANH_KHONG_HOP_LE","message":"imageKey không phải ảnh bạn vừa tải lên"}}  [HTTP 400]
$ curl -s $A/posts -H "Authorization: Bearer $AN" $J -d "{\\"title\\":\\"Hồ Gươm sáng nay\\",\\"body\\":\\"Trời đẹp quá!\\",\\"status\\":\\"published\\",\\"imageKey\\":\\"$KEY\\"}" | tee /tmp/fsp-bai.json; echo
{"id":"01a20daf-b23c-7e52-b878-82e0efd36639","title":"Hồ Gươm sáng nay","body":"Trời đẹp quá!","status":"published","createdAt":"2026-11-24T13:12:27.963Z","updatedAt":"2026-11-24T13:12:27.963Z","author":{"id":"01a20da9-f6e4-7dc4-9e4c-4f6480a2e122","displayName":"An Nguyễn"},"imageUrl":"http://localhost:41813/chiase/posts/8e276ebf-882b-47ba-a4ca-8c70cd5ac5a7.webp"}
$ curl -s -o /dev/null -w "ảnh tmp/ sau khi duyệt: %{http_code}\\n" -I localhost:41813/chiase/$KEY
ảnh tmp/ sau khi duyệt: 403`;

const SCRIPT = `// Checkpoint 4 — tự chấm: bài viết kèm ảnh THẬT từ đầu tới cuối (xin vé → PUT lên kho → tạo bài → đọc lại → xoá + dọn ảnh)
// và các đường tấn công đã học (mạo danh tác giả, sửa bài người khác, ảnh giả, ảnh của người khác, đọc vùng tmp/).
// Cần: Postgres + MinIO đang chạy, đã chạy  npm run db:migrate -w apps/api  và  npm run kho:chuan-bi -w apps/api.
// TẮT máy chủ dev đang chạy trước (script tự bật một bản).  Chạy ở gốc repo:  node scripts/checkpoint-4.mjs
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
let dat = 0;
let truot = 0;
const kiem = (moTa, dung) =&gt; {
  console.log(\`  \${dung ? '✔' : '✘'} \${moTa}\`);
  dung ? dat++ : truot++;
};
const ngu = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const API = 'apps/api';

console.log('== 0. Checkpoint 3 vẫn đạt');
const cp3 = spawnSync(process.execPath, ['scripts/checkpoint-3.mjs'], { encoding: 'utf8' });
kiem(\`checkpoint-3: \${cp3.stdout.trim().split('\\n').at(-1)}\`, cp3.status === 0);

console.log('== 1. Cấu hình kho ảnh');
const env = Object.fromEntries(
  readFileSync(\`\${API}/.env\`, 'utf8')
    .split(/\\r?\\n/)
    .filter((d) =&gt; /^[A-Z_0-9]+=/.test(d))
    .map((d) =&gt; [d.slice(0, d.indexOf('=')), d.slice(d.indexOf('=') + 1)]),
);
const CAN = ['S3_ENDPOINT', 'S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'MEDIA_BASE_URL'];
const mau = readFileSync(\`\${API}/.env.example\`, 'utf8');
kiem(
  \`.env và .env.example đều có \${CAN.length} biến kho ảnh\`,
  CAN.every((k) =&gt; env[k] &amp;&amp; new RegExp(\`^\${k}=\`, 'm').test(mau)),
);
const kho = await fetch(\`\${env.S3_ENDPOINT}/minio/health/live\`, { signal: AbortSignal.timeout(3000) })
  .then((r) =&gt; r.status)
  .catch(() =&gt; 0);
kiem(\`kho ảnh sống (\${env.S3_ENDPOINT} → \${kho || 'không kết nối được'})\`, kho === 200);

console.log('== 2. Luồng bài viết + ảnh (bật API ở cổng trong .env)');
const goc = \`http://localhost:\${env.PORT ?? '41810'}/api\`;
const laWin = process.platform === 'win32';
const api = spawn('npm', ['run', 'dev', '-w', API], {
  shell: laWin,
  detached: !laWin,
  stdio: ['ignore', 'ignore', 'pipe'],
});
let loiApi = '';
api.stderr.on('data', (d) =&gt; (loiApi = (loiApi + d).slice(-4000)));
const ketThuc = () =&gt; {
  if (laWin) spawnSync('taskkill', ['/pid', String(api.pid), '/T', '/F']);
  else
    try {
      process.kill(-api.pid, 'SIGTERM');
    } catch {}
  console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
  process.exit(truot === 0 ? 0 : 1);
};
const goi = async (duong, { body, token, method = body ? 'POST' : 'GET' } = {}) =&gt; {
  try {
    const r = await fetch(duong.startsWith('http') ? duong : \`\${goc}\${duong}\`, {
      method,
      headers: {
        ...(body ? { 'content-type': 'application/json' } : {}),
        ...(token ? { authorization: \`Bearer \${token}\` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });
    const text = await r.text();
    let json = {};
    try {
      json = JSON.parse(text);
    } catch {}
    return { ma: r.status, json, headers: r.headers };
  } catch {
    return { ma: 0, json: {}, headers: new Headers() };
  }
};
let h = { ma: 0 };
for (let i = 0; i &lt; 40 &amp;&amp; h.ma === 0; i++) {
  await ngu(1000);
  h = await goi('/health');
}
kiem(\`API sống (\${goc}/health → \${h.ma})\`, h.ma === 200);
if (h.ma !== 200) {
  console.log(
    \`  ⇒ API không lên. Lỗi khởi động: \${
      loiApi
        .split('\\n')
        .find((d) =&gt; /Error:|Thiếu biến/.test(d))
        ?.trim() ?? '(xem npm run dev -w apps/api)'
    }\`,
  );
  ketThuc();
}

const mk = process.env.SEED_PASSWORD ?? 'chiase-mau-2026';
const an = (await goi('/auth/login', { body: { email: 'an@chiase.dev', password: mk } })).json.accessToken;
const binh = (await goi('/auth/login', { body: { email: 'binh@chiase.dev', password: mk } })).json
  .accessToken;
kiem('hai tài khoản seed (An, Bình) đăng nhập được', !!an &amp;&amp; !!binh);
if (!an || !binh) ketThuc();

const BAO_VE = [
  ['POST', '/posts'],
  ['PATCH', '/posts/00000000-0000-7000-8000-000000000000'],
  ['DELETE', '/posts/00000000-0000-7000-8000-000000000000'],
  ['POST', '/uploads'],
];
const khongToken = await Promise.all(
  BAO_VE.map(([method, d]) =&gt; goi(d, { method, body: method === 'DELETE' ? undefined : {} })),
);
kiem(
  \`\${BAO_VE.length} route ghi không token → \${khongToken.map((r) =&gt; r.ma).join(', ')}\`,
  khongToken.every((r) =&gt; r.ma === 401),
);
const lech = await goi('/posts/abc');
kiem(\`GET /posts/abc (id không phải uuid) → \${lech.ma}\`, lech.ma === 404);
const maoDanh = await goi('/posts', {
  token: an,
  body: { title: 'x', body: 'x', authorId: '00000000-0000-7000-8000-000000000000' },
});
kiem(\`gửi kèm authorId → \${maoDanh.ma} (không được tự chọn tác giả)\`, maoDanh.ma === 400);

// Tải một tệp qua đúng luồng frontend sẽ làm: xin vé ⇒ PUT thẳng lên kho
const taiLen = async (token, buf, loai, loaiPut = loai) =&gt; {
  const ve = await goi('/uploads', { token, body: { contentType: loai, size: buf.length } });
  if (ve.ma !== 201) return { ve, put: 0 };
  const put = await fetch(ve.json.url, { method: 'PUT', body: buf, headers: { 'content-type': loaiPut } })
    .then((r) =&gt; r.status)
    .catch(() =&gt; 0);
  return { ve, put, key: ve.json.key };
};
// Ảnh "chụp từ điện thoại": có EXIF hãng máy + toạ độ GPS
const anh = await sharp({ create: { width: 2400, height: 1600, channels: 3, background: '#1e88e5' } })
  .withExif({
    IFD0: { Make: 'Samsung', Model: 'Galaxy A55' },
    IFD3: {
      GPSLatitudeRef: 'N',
      GPSLatitude: '21/1 1/1 41/1',
      GPSLongitudeRef: 'E',
      GPSLongitude: '105/1 50/1 3/1',
    },
  })
  .jpeg()
  .toBuffer();

const t1 = await taiLen(an, anh, 'image/jpeg');
kiem(
  \`xin vé → \${t1.ve.ma}, khoá \${t1.key?.slice(0, 4)}…, PUT thẳng lên kho → \${t1.put}\`,
  t1.ve.ma === 201 &amp;&amp; t1.key?.startsWith('tmp/') &amp;&amp; t1.put === 200,
);
if (t1.put === 404) console.log('  ⇒ kho trả 404 = chưa có bucket. Chạy: npm run kho:chuan-bi -w apps/api');
const docTmp = await fetch(\`\${env.MEDIA_BASE_URL}/\${t1.key}\`)
  .then((r) =&gt; r.status)
  .catch(() =&gt; 0);
kiem(\`khách đọc thẳng ảnh vùng tmp/ → \${docTmp}\`, docTmp === 403 || docTmp === 404);
const lay = await goi('/posts', { token: binh, body: { title: 'Lấy ảnh', body: 'x', imageKey: t1.key } });
kiem(\`Bình gắn ảnh của An vào bài mình → \${lay.ma} \${lay.json.error?.code ?? ''}\`, lay.ma === 400);

const tao = await goi('/posts', {
  token: an,
  body: { title: 'Checkpoint 4', body: 'Ảnh thật', status: 'published', imageKey: t1.key },
});
const bai = tao.json;
kiem(
  \`An tạo bài kèm ảnh → \${tao.ma}, imageUrl bắt đầu bằng MEDIA_BASE_URL, không lộ imageKey\`,
  tao.ma === 201 &amp;&amp;
    bai.imageUrl?.startsWith(\`\${env.MEDIA_BASE_URL.replace(/\\/+$/, '')}/posts/\`) &amp;&amp;
    !('imageKey' in bai),
);
if (tao.ma !== 201) ketThuc();
const r = await fetch(bai.imageUrl).catch(() =&gt; null);
const sach = r ? Buffer.from(await r.arrayBuffer()) : Buffer.alloc(0);
const meta = sach.length ? await sharp(sach).metadata() : {};
kiem(
  \`GET imageUrl → \${r?.status} \${r?.headers.get('content-type')}, \${meta.width}×\${meta.height}\`,
  r?.status === 200 &amp;&amp;
    r.headers.get('content-type') === 'image/webp' &amp;&amp;
    Math.max(meta.width ?? 0, meta.height ?? 0) &lt;= 1600,
);
if (r?.status === 403)
  console.log(
    '  ⇒ ảnh trả 403 = bucket chưa cho đọc công khai posts/*. Chạy: npm run kho:chuan-bi -w apps/api',
  );
kiem(
  'ảnh công khai đã BỎ EXIF (không còn hãng máy, GPS)',
  sach.length &gt; 0 &amp;&amp;
    !meta.exif &amp;&amp;
    !sach.includes(Buffer.from('Galaxy')) &amp;&amp;
    anh.includes(Buffer.from('Galaxy')),
);
kiem(
  \`Cache-Control: \${r?.headers.get('cache-control')}\`,
  /immutable/.test(r?.headers.get('cache-control') ?? ''),
);
const ds = await goi('/posts');
kiem(
  \`GET /posts (khách) có bài vừa đăng → \${ds.ma}\`,
  ds.ma === 200 &amp;&amp; ds.json.some?.((b) =&gt; b.id === bai.id),
);
// Đọc ẩn danh vùng tmp/ luôn 403 (còn hay mất đều vậy) ⇒ phải hỏi kho BẰNG KHOÁ mới biết bản gốc còn không
const s3 = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION || 'auto',
  forcePathStyle: true,
  credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
});
const tmpCon = await s3
  .send(new HeadObjectCommand({ Bucket: env.S3_BUCKET, Key: t1.key }))
  .then(() =&gt; 'vẫn còn')
  .catch((e) =&gt; e.name);
kiem(\`bản gốc ở tmp/ đã bị xoá sau khi duyệt (HEAD có khoá → \${tmpCon})\`, tmpCon === 'NotFound');

console.log('== 3. Quyền tác giả và bài nháp');
const sua = await goi(\`/posts/\${bai.id}\`, { token: binh, method: 'PATCH', body: { title: 'Bình sửa' } });
const xoa = await goi(\`/posts/\${bai.id}\`, { token: binh, method: 'DELETE' });
kiem(\`Bình sửa bài của An → \${sua.ma}; xoá → \${xoa.ma}\`, sua.ma === 403 &amp;&amp; xoa.ma === 403);
const nhap = await goi('/posts', { token: an, body: { title: 'Nháp', body: 'chưa đăng' } });
const nhapKhach = await goi(\`/posts/\${nhap.json.id}\`);
const nhapBinh = await goi(\`/posts/\${nhap.json.id}\`, { token: binh });
const nhapAn = await goi(\`/posts/\${nhap.json.id}\`, { token: an });
kiem(
  \`bài nháp: khách → \${nhapKhach.ma}, Bình → \${nhapBinh.ma}, An → \${nhapAn.ma}\`,
  nhap.json.status === 'draft' &amp;&amp; nhapKhach.ma === 404 &amp;&amp; nhapBinh.ma === 404 &amp;&amp; nhapAn.ma === 200,
);
await goi(\`/posts/\${nhap.json.id}\`, { token: an, method: 'DELETE' });

console.log('== 4. Ảnh giả và khai sai');
const html = Buffer.from('&lt;html&gt;&lt;script&gt;alert(document.cookie)&lt;/script&gt;&lt;/html&gt;');
const gia = await taiLen(an, html, 'image/jpeg');
const baiGia = await goi('/posts', { token: an, body: { title: 'x', body: 'x', imageKey: gia.key } });
kiem(
  \`HTML khai là image/jpeg: kho nhận (\${gia.put}) nhưng API từ chối → \${baiGia.ma} \${baiGia.json.error?.code}\`,
  baiGia.ma === 400 &amp;&amp; baiGia.json.error?.code === 'ANH_SAI_DINH_DANG',
);
const khaiSai = await taiLen(an, anh, 'image/jpeg', 'text/html');
kiem(\`PUT với Content-Type khác lúc xin vé → kho trả \${khaiSai.put}\`, khaiSai.put === 403);
const svg = await goi('/uploads', { token: an, body: { contentType: 'image/svg+xml', size: 100 } });
const to = await goi('/uploads', { token: an, body: { contentType: 'image/png', size: 50 * 1024 * 1024 } });
kiem(\`xin vé SVG → \${svg.ma}; xin vé 50 MiB → \${to.ma}\`, svg.ma === 400 &amp;&amp; to.ma === 400);

console.log('== 5. Xoá bài thì ảnh cũng đi');
const xoaAn = await goi(\`/posts/\${bai.id}\`, { token: an, method: 'DELETE' });
const sauXoa = await goi(\`/posts/\${bai.id}\`);
const anhSauXoa = await fetch(bai.imageUrl)
  .then((x) =&gt; x.status)
  .catch(() =&gt; 0);
kiem(
  \`An xoá → \${xoaAn.ma}; đọc lại bài → \${sauXoa.ma}; ảnh → \${anhSauXoa}\`,
  xoaAn.ma === 204 &amp;&amp; sauXoa.ma === 404 &amp;&amp; anhSauXoa === 404,
);

ketThuc();`;

const DAT = `$ node scripts/checkpoint-4.mjs
== 0. Checkpoint 3 vẫn đạt
  ✔ checkpoint-3: KẾT QUẢ: 23 đạt, 0 trượt
== 1. Cấu hình kho ảnh
  ✔ .env và .env.example đều có 5 biến kho ảnh
  ✔ kho ảnh sống (http://localhost:41813 → 200)
== 2. Luồng bài viết + ảnh (bật API ở cổng trong .env)
  ✔ API sống (http://localhost:41815/api/health → 200)
  ✔ hai tài khoản seed (An, Bình) đăng nhập được
  ✔ 4 route ghi không token → 401, 401, 401, 401
  ✔ GET /posts/abc (id không phải uuid) → 404
  ✔ gửi kèm authorId → 400 (không được tự chọn tác giả)
  ✔ xin vé → 201, khoá tmp/…, PUT thẳng lên kho → 200
  ✔ khách đọc thẳng ảnh vùng tmp/ → 403
  ✔ Bình gắn ảnh của An vào bài mình → 400 ANH_KHONG_HOP_LE
  ✔ An tạo bài kèm ảnh → 201, imageUrl bắt đầu bằng MEDIA_BASE_URL, không lộ imageKey
  ✔ GET imageUrl → 200 image/webp, 1600×1067
  ✔ ảnh công khai đã BỎ EXIF (không còn hãng máy, GPS)
  ✔ Cache-Control: public, max-age=31536000, immutable
  ✔ GET /posts (khách) có bài vừa đăng → 200
  ✔ bản gốc ở tmp/ đã bị xoá sau khi duyệt (HEAD có khoá → NotFound)
== 3. Quyền tác giả và bài nháp
  ✔ Bình sửa bài của An → 403; xoá → 403
  ✔ bài nháp: khách → 404, Bình → 404, An → 200
== 4. Ảnh giả và khai sai
  ✔ HTML khai là image/jpeg: kho nhận (200) nhưng API từ chối → 400 ANH_SAI_DINH_DANG
  ✔ PUT với Content-Type khác lúc xin vé → kho trả 403
  ✔ xin vé SVG → 400; xin vé 50 MiB → 400
== 5. Xoá bài thì ảnh cũng đi
  ✔ An xoá → 204; đọc lại bài → 404; ảnh → 404

KẾT QUẢ: 23 đạt, 0 trượt`;

const LAN1 = `$ node scripts/checkpoint-4.mjs          # lần chạy ĐẦU TIÊN, ngay sau khi viết xong mã Chương 4
== 0. Checkpoint 3 vẫn đạt
  ✘ checkpoint-3: KẾT QUẢ: 22 đạt, 1 trượt
…
KẾT QUẢ: 22 đạt, 1 trượt
$ node scripts/checkpoint-1.mjs 2&gt;&amp;1 | grep -E "✘|KẾT"
  ✘ npm run format:check
KẾT QUẢ: 16 đạt, 1 trượt
$ npm run -s format:check
Checking formatting...
[warn] apps/api/src/services/image.service.ts
[warn] apps/api/src/services/post.service.ts
[warn] apps/api/src/services/upload.service.ts
[warn] Code style issues found in 3 files. Run Prettier with --write to fix.`;

const TRUOT = `$ node scripts/checkpoint-4.mjs     # sau khi "tạm" chú thích dòng await xoaAnh(bai.imageKey) trong xoaBai
  ✘ checkpoint-3: KẾT QUẢ: 22 đạt, 1 trượt
== 5. Xoá bài thì ảnh cũng đi
  ✘ An xoá → 204; đọc lại bài → 404; ảnh → 200
KẾT QUẢ: 21 đạt, 2 trượt
$ npm run -s lint
apps/api/src/services/post.service.ts:94:11: warning eslint(no-unused-vars): Variable 'bai' is declared but never used. Unused variables should start with a '_'. help: Consider removing this declaration.`;

const CLONE = `$ node scripts/checkpoint-4.mjs     # clone sạch, đã migrate + seed, CHƯA chuẩn bị kho
== 0. Checkpoint 3 vẫn đạt
  ✔ checkpoint-3: KẾT QUẢ: 23 đạt, 0 trượt
== 1. Cấu hình kho ảnh
  ✔ .env và .env.example đều có 5 biến kho ảnh
  ✔ kho ảnh sống (http://localhost:41823 → 200)
== 2. Luồng bài viết + ảnh (bật API ở cổng trong .env)
  ✔ API sống (http://localhost:41825/api/health → 200)
  ✔ hai tài khoản seed (An, Bình) đăng nhập được
  ✔ 4 route ghi không token → 401, 401, 401, 401
  ✔ GET /posts/abc (id không phải uuid) → 404
  ✔ gửi kèm authorId → 400 (không được tự chọn tác giả)
  ✘ xin vé → 201, khoá tmp/…, PUT thẳng lên kho → 404
  ⇒ kho trả 404 = chưa có bucket. Chạy: npm run kho:chuan-bi -w apps/api
  ✔ khách đọc thẳng ảnh vùng tmp/ → 403
  ✔ Bình gắn ảnh của An vào bài mình → 400 ANH_KHONG_HOP_LE
  ✘ An tạo bài kèm ảnh → 400, imageUrl bắt đầu bằng MEDIA_BASE_URL, không lộ imageKey

KẾT QUẢ: 10 đạt, 2 trượt`;

const MA_DONG = `git add -A
git commit -m "feat(api): bài viết + ảnh qua URL ký sẵn, duyệt ảnh, dọn ảnh mồ côi, Checkpoint 4"
git switch main
git merge --no-ff ch4/bai-viet -m "Merge ch4/bai-viet: Checkpoint 4 đạt 23/23"
git tag ch4
docker stop chiase-pg chiase-minio`;

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-0-8-bat-dau-tai-day', title: 'Testing — Bắt đầu tại đây', sub: 'Chương 8 biến các kịch bản checkpoint thành test Vitest + Supertest thật.', cta: 'Mở khoá →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-6-3-orphans', title: 'Object Storage 6.3 — Object mồ côi', sub: 'Kiểm định kỳ dòng ↔ object, chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'API Design 6.2 — Phân quyền theo đối tượng (BOLA)', sub: 'Cách viết phép thử hai người dùng cho mọi endpoint.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '4.4 — Checkpoint 4: create a post with a real image end to end|||4.4 — Checkpoint 4: tạo một bài viết kèm ảnh thật từ đầu tới cuối',
  slug: 'fp-4-4-checkpoint-4',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gõ tay luồng đầy đủ (xin vé → PUT lên kho → tạo bài → đọc ảnh) rồi chạy scripts/checkpoint-4.mjs: 23 tiêu chí gồm ảnh thật có GPS phải ra WebP sạch, quyền tác giả, bài nháp, ảnh giả, khai sai Content-Type, xoá bài dọn ảnh; ba lần trượt thật (Prettier, phép kiểm luôn đúng, chú thích dòng xoá ảnh) và chạy trên bản clone sạch; đóng chương bằng merge + tag ch4.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Checkpoint</span>
<h2>Twenty-three checks that a real photo goes in clean, comes out clean, and leaves when its post leaves</h2>
<p class="lead">Chapter 4 touches three systems at once — API, database and object storage — so "it works on my machine" is worth even less than before. This checkpoint drives the whole path the frontend will use in Chapter 6, with a generated phone-like photo carrying GPS data, and spends most of its checks on what must <em>fail</em>: someone else's post, someone else's image key, an HTML file pretending to be a JPEG, a Content-Type that differs from the ticket. Then it runs on a clean clone, because that is where missing steps show up.</p>

<h3>By hand first: one post with one photo</h3>
<p>This shell function is exactly what the browser will do in Chapter 6 — ask for a ticket, PUT the bytes, return the key:</p>
<pre><code class="language-bash">${TAI_LEN}</code></pre>
<div class="out">${VE}</div>
<div class="out">${GAN}</div>
<p>If you can do these three steps by hand and open the <code>imageUrl</code> in a browser, the script below will mostly be green. If you cannot, the script will not tell you more than your own curl does — fix it by hand first.</p>

<h3>What Checkpoint 4 checks, and why</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">0</span><span class="lz-t">no regression</span><span class="lz-d">Checkpoint 3 (→ 2 → 1) still passes: auth, health, lint, types, format</span></div>
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">config</span><span class="lz-d">5 storage variables in .env and .env.example; storage answers health</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">happy path</span><span class="lz-d">ticket → PUT → post with image → imageUrl is WebP ≤ 1600 px, no EXIF, immutable; tmp original gone</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ownership</span><span class="lz-d">Bình cannot edit/delete An's post (403), nobody but An sees An's draft (404)</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">lies</span><span class="lz-d">HTML as image/jpeg ⇒ 400; other Content-Type ⇒ storage 403; SVG and 50 MiB tickets ⇒ 400</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">cleanup</span><span class="lz-d">delete post ⇒ post 404 and image 404</span></div>
</div>
<p>Each criterion comes from something lessons 4.1–4.3 showed can go wrong. The list of write routes called without a token (<code>BAO_VE</code>) grows from Checkpoint 3: every new protected route must be added — the script is the memory, not you.</p>

<h3>The script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>Three details worth copying into your own tests. The photo is <em>generated</em> with sharp, with EXIF make/model and GPS, so the check "EXIF removed" is meaningful (the script also asserts the original <em>had</em> it). Uploads go through the same two steps as the browser. And the "tmp original deleted" check asks the storage <strong>with credentials</strong> — see the second failure below.</p>

<h3>Running it</h3>
<div class="out">${DAT}</div>

<h3>Three real failures on the way to 23/23</h3>
<p><strong>1. The first run failed on formatting.</strong></p>
<div class="out">${LAN1}</div>
<p>Nothing in Chapter 4's logic — three new files had never been through Prettier, and Checkpoint 1's <code>format:check</code>, three levels down the chain, caught it. Run <code>npx prettier --write</code> before every checkpoint, or better, let the editor format on save.</p>
<p><strong>2. A check that could never fail.</strong> The first version verified "the tmp/ original was deleted" by fetching it anonymously and expecting "not 200". But <code>tmp/</code> is private: an anonymous read returns 403 whether the file exists or not. The check was always green — it tested nothing. It now sends an authenticated <code>HEAD</code> and requires <code>NotFound</code>. Whenever a new check passes on the first try, break the code on purpose once and watch it turn red.</p>
<p><strong>3. Breaking it on purpose.</strong> We commented out the line that deletes the image when a post is deleted — the kind of "temporary" change that reaches production:</p>
<div class="out">${TRUOT}</div>
<p>Two independent alarms: the end-to-end check sees the image still answering 200, and the linter (through Checkpoint 1) sees that <code>bai</code> is now unused. Restore the line, and it is green again.</p>

<h3>On a machine that has never seen the project</h3>
<p>Clone, <code>npm ci</code>, a new Postgres and a new MinIO, a fresh <code>.env</code>. Not migrated yet: the chain fails early and says why. Migrated and seeded, but storage not prepared:</p>
<div class="out">${CLONE}</div>
<p>The storage answers 404 to the PUT because the bucket does not exist, and the script prints the command to fix it (this hint was added after the first clean-clone run showed only "→ 404"). After <code>npm run kho:chuan-bi -w apps/api</code>: <strong>23 passed, 0 failed</strong>. The README's quick start now lists all these steps in order.</p>

<h3>When a line is red</h3>
<ul>
<li><strong>"kho ảnh sống … không kết nối được"</strong> — MinIO is not running or not on the port in <code>S3_ENDPOINT</code> (<code>docker ps</code>, <code>docker logs</code>).</li>
<li><strong>"PUT … → 403"</strong> on the happy path — the Content-Type you send differs from the ticket, or the clock of your machine is far off (signatures carry a timestamp).</li>
<li><strong>"GET imageUrl → 403"</strong> — the public-read policy on <code>posts/*</code> is missing: run <code>kho:chuan-bi</code>.</li>
<li><strong>"ảnh công khai đã BỎ EXIF" red</strong> — you used <code>withMetadata()</code>/<code>keepMetadata()</code>, or you copy the original instead of re-encoding.</li>
<li><strong>"Bình sửa bài của An → 200"</strong> — ownership is not in the <code>where</code>; re-read lesson 4.1, section 4.</li>
<li><strong>"ảnh → 200" after delete</strong> — the image deletion is missing or happens before the row deletion and failed silently.</li>
</ul>

<h3>Closing the chapter</h3>
<pre><code class="language-bash">${MA_DONG}</code></pre>
<p>Before merging, read the README section "Decisions about posts and images (Chapter 4)": synchronous image processing (~0.4 s), MinIO only for development, orphan cleanup by script. Chapter 5 adds comments and replaces the "20 newest posts" list with real cursor pagination.</p>

${spring(true, 'In a Spring Boot project the same checkpoint is an integration test suite: Testcontainers starts PostgreSQL and MinIO, <code>MockMvc</code> or REST-assured drives the API, and the AWS SDK checks the bucket. The Spring Boot course covers the test side here:', [
  ['sb-11-4-testcontainers', 'Spring Boot 11.4 — Integration tests with Testcontainers'],
  ['sb-10-6-lab-10', 'Spring Boot 10.6 — Chapter 10 lab: IDOR, mass assignment, secrets'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you test a feature that spans API, database and storage?"</strong> — End-to-end checks against real services in containers, plus negative cases (other user, wrong type) — not just the happy path.</li>
<li><strong>"How do you know a test can fail?"</strong> — Break the code on purpose once and watch it go red; a check that is always green is worse than none.</li>
<li><strong>"Why run it on a clean clone?"</strong> — It exposes steps that only exist on your machine (a bucket, a migration, an env variable).</li>
</ol>

<h3>🧪 Lab — Checkpoint 4 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>Do the by-hand flow with your own photo; open <code>imageUrl</code> in the browser.</li>
<li>Write (or copy and read line by line) <code>scripts/checkpoint-4.mjs</code>; run it until 23/23.</li>
<li>Break three things on purpose — the ownership <code>where</code>, the image deletion, <code>.rotate()</code> or the EXIF strip — and note which line turns red each time. One of them will not be caught: write down which, and add a check for it.</li>
<li>Clone into a new folder, use new container names and ports, follow only the README, and reach 23/23.</li>
<li>Merge, tag <code>ch4</code>, stop the containers.</li>
</ol>
<p><strong>Done when:</strong> <code>node scripts/checkpoint-4.mjs</code> prints <code>23 đạt, 0 trượt</code> on a fresh clone, and tag <code>ch4</code> exists.</p>
</div>
<details><summary>Solution</summary>
<p>Tag <code>ch4</code> (merge <code>45cb470</code>). For step 3: removing <code>.rotate()</code> is <em>not</em> caught — the generated photo has no Orientation tag. A good extra check generates the photo with <code>.withMetadata({ orientation: 6 })</code> and asserts the output is taller than wide.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">end-to-end check</span><span class="v">Drives the system the way a real client does, across every component.</span></div>
  <div class="kv"><span class="k">negative test</span><span class="v">Asserts that something forbidden fails with the right code.</span></div>
  <div class="kv"><span class="k">vacuous check</span><span class="v">A check that passes whatever the code does — it tests nothing.</span></div>
  <div class="kv"><span class="k">clean clone</span><span class="v">A fresh checkout with fresh services: proves the README is complete.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>By hand: ticket → PUT → post → open imageUrl. Then the script.</li>
<li>23 checks: no regression, config, happy path with a GPS photo, ownership, lies, cleanup.</li>
<li>Three real failures: unformatted files, a check that could not fail, a "temporary" commented line.</li>
<li>Clean clone: migrate, seed, <code>kho:chuan-bi</code>, then 23/23; merge and tag <code>ch4</code>.</li>
</ul>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Checkpoint</span>
<h2>Hai mươi ba phép kiểm: ảnh thật vào sạch, ra sạch, và đi theo bài khi bài bị xoá</h2>
<p class="lead">Chương 4 chạm ba hệ thống cùng lúc — API, CSDL và kho đối tượng — nên câu "máy tôi chạy được" còn ít giá trị hơn trước. Checkpoint này đi hết đường mà frontend sẽ dùng ở Chương 6, với một tấm ảnh giống ảnh điện thoại có dữ liệu GPS, và dành phần lớn phép kiểm cho những gì BẮT BUỘC phải <em>thất bại</em>: bài của người khác, khoá ảnh của người khác, tệp HTML giả làm JPEG, Content-Type khác với vé. Rồi chạy lại trên bản clone sạch, vì đó là nơi các bước bị thiếu lộ ra.</p>

<h3>Gõ tay trước: một bài, một tấm ảnh</h3>
<p>Hàm shell này làm đúng những gì trình duyệt sẽ làm ở Chương 6 — xin vé, PUT byte, trả khoá:</p>
<pre><code class="language-bash">${TAI_LEN}</code></pre>
<div class="out">${VE}</div>
<div class="out">${GAN}</div>
<p>Làm tay được ba bước này và mở được <code>imageUrl</code> trên trình duyệt thì script bên dưới phần lớn sẽ xanh. Không làm được thì script cũng chẳng nói gì nhiều hơn chính lệnh curl của bạn — sửa bằng tay trước đã.</p>

<h3>Checkpoint 4 kiểm gì, và vì sao</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">0</span><span class="lz-t">không hồi quy</span><span class="lz-d">Checkpoint 3 (→ 2 → 1) vẫn đạt: xác thực, health, lint, kiểu, định dạng</span></div>
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">cấu hình</span><span class="lz-d">5 biến kho ảnh trong .env và .env.example; kho trả lời health</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">đường đẹp</span><span class="lz-d">vé → PUT → bài kèm ảnh → imageUrl là WebP ≤ 1600 px, không EXIF, immutable; bản gốc tmp đã mất</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">quyền sở hữu</span><span class="lz-d">Bình không sửa/xoá được bài của An (403), ngoài An không ai thấy bài nháp của An (404)</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">khai dối</span><span class="lz-d">HTML khai image/jpeg ⇒ 400; Content-Type khác ⇒ kho 403; vé SVG và 50 MiB ⇒ 400</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">dọn dẹp</span><span class="lz-d">xoá bài ⇒ bài 404 và ảnh 404</span></div>
</div>
<p>Mỗi tiêu chí đến từ một thứ mà bài 4.1–4.3 đã cho thấy có thể hỏng. Danh sách route ghi gọi không token (<code>BAO_VE</code>) nối dài từ Checkpoint 3: mọi route bảo vệ mới đều phải thêm vào — script là bộ nhớ, không phải bạn.</p>

<h3>Script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>Ba chi tiết đáng chép vào phép thử của chính bạn. Tấm ảnh được <em>tạo ra</em> bằng sharp, có EXIF hãng máy/đời máy và GPS, nên phép kiểm "đã bỏ EXIF" mới có nghĩa (script còn khẳng định ảnh gốc <em>có</em> EXIF). Tải lên đi qua đúng hai bước như trình duyệt. Và phép kiểm "bản gốc tmp đã xoá" hỏi kho <strong>bằng khoá truy cập</strong> — xem lần trượt thứ hai bên dưới.</p>

<h3>Chạy thật</h3>
<div class="out">${DAT}</div>

<h3>Ba lần trượt thật trên đường tới 23/23</h3>
<p><strong>1. Lần chạy đầu trượt vì định dạng.</strong></p>
<div class="out">${LAN1}</div>
<p>Chẳng liên quan gì logic Chương 4 — ba tệp mới chưa từng qua Prettier, và <code>format:check</code> của Checkpoint 1, ba tầng bên dưới chuỗi, đã bắt được. Chạy <code>npx prettier --write</code> trước mỗi checkpoint, hoặc tốt hơn, để trình soạn thảo tự định dạng khi lưu.</p>
<p><strong>2. Một phép kiểm không bao giờ trượt được.</strong> Bản đầu kiểm "bản gốc trong tmp/ đã bị xoá" bằng cách đọc ẩn danh và chờ "không phải 200". Nhưng <code>tmp/</code> là riêng tư: đọc ẩn danh trả 403 dù tệp còn hay mất. Phép kiểm luôn xanh — nó chẳng kiểm gì. Giờ nó gửi <code>HEAD</code> có khoá truy cập và đòi <code>NotFound</code>. Mỗi khi một phép kiểm mới xanh ngay lần đầu, hãy cố ý làm hỏng mã một lần và nhìn nó chuyển đỏ.</p>
<p><strong>3. Cố ý làm hỏng.</strong> Ta chú thích dòng xoá ảnh khi xoá bài — đúng kiểu thay đổi "tạm thời" hay lọt lên production:</p>
<div class="out">${TRUOT}</div>
<p>Hai chuông báo độc lập: phép kiểm đầu-cuối thấy ảnh vẫn trả 200, và linter (qua Checkpoint 1) thấy biến <code>bai</code> giờ không ai dùng. Trả dòng đó lại là xanh.</p>

<h3>Trên một máy chưa từng thấy dự án</h3>
<p>Clone, <code>npm ci</code>, một Postgres mới và một MinIO mới, một <code>.env</code> mới. Chưa migrate: chuỗi trượt từ sớm và nói rõ lý do. Đã migrate và seed, nhưng chưa chuẩn bị kho:</p>
<div class="out">${CLONE}</div>
<p>Kho trả 404 cho lệnh PUT vì bucket chưa có, và script in ra lệnh để sửa (dòng gợi ý này được thêm sau khi lần clone sạch đầu tiên chỉ hiện "→ 404"). Sau <code>npm run kho:chuan-bi -w apps/api</code>: <strong>23 đạt, 0 trượt</strong>. Mục bắt đầu nhanh trong README giờ liệt kê đủ các bước theo đúng thứ tự.</p>

<h3>Khi có dòng đỏ</h3>
<ul>
<li><strong>"kho ảnh sống … không kết nối được"</strong> — MinIO chưa chạy hoặc không ở cổng ghi trong <code>S3_ENDPOINT</code> (<code>docker ps</code>, <code>docker logs</code>).</li>
<li><strong>"PUT … → 403"</strong> ở đường đẹp — Content-Type bạn gửi khác với vé, hoặc đồng hồ máy bạn lệch nhiều (chữ ký mang dấu thời gian).</li>
<li><strong>"GET imageUrl → 403"</strong> — thiếu chính sách đọc công khai <code>posts/*</code>: chạy <code>kho:chuan-bi</code>.</li>
<li><strong>"ảnh công khai đã BỎ EXIF" đỏ</strong> — bạn dùng <code>withMetadata()</code>/<code>keepMetadata()</code>, hoặc chép nguyên bản gốc thay vì mã hoá lại.</li>
<li><strong>"Bình sửa bài của An → 200"</strong> — quyền sở hữu không nằm trong <code>where</code>; đọc lại bài 4.1 mục 4.</li>
<li><strong>"ảnh → 200" sau khi xoá</strong> — thiếu bước xoá ảnh, hoặc xoá ảnh chạy trước xoá dòng và lỗi trong im lặng.</li>
</ul>

<h3>Đóng chương</h3>
<pre><code class="language-bash">${MA_DONG}</code></pre>
<p>Trước khi merge, đọc mục README "Quyết định về bài viết + ảnh (Chương 4)": xử lý ảnh đồng bộ (~0,4 s), MinIO chỉ cho máy dev, dọn ảnh mồ côi bằng script. Chương 5 thêm bình luận và thay danh sách "20 bài mới nhất" bằng phân trang cursor thật.</p>

${spring(false, 'Trong dự án Spring Boot, checkpoint này là một bộ test tích hợp: Testcontainers bật PostgreSQL và MinIO, <code>MockMvc</code> hoặc REST-assured điều khiển API, AWS SDK kiểm bucket. Khoá Spring Boot dạy phần test ở đây:', [
  ['sb-11-4-testcontainers', 'Spring Boot 11.4 — Test tích hợp với Testcontainers'],
  ['sb-10-6-lab-10', 'Spring Boot 10.6 — Lab chương 10: IDOR, mass assignment, bí mật'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn test một tính năng trải qua API, CSDL và kho lưu trữ thế nào?"</strong> — Kiểm đầu-cuối trên dịch vụ thật chạy trong container, cộng các ca âm (người khác, sai loại) — không chỉ đường đẹp.</li>
<li><strong>"Làm sao biết một phép thử có thể trượt?"</strong> — Cố ý làm hỏng mã một lần và nhìn nó đỏ; phép kiểm luôn xanh còn tệ hơn không có.</li>
<li><strong>"Sao phải chạy trên bản clone sạch?"</strong> — Nó lộ các bước chỉ tồn tại trên máy bạn (một bucket, một migration, một biến môi trường).</li>
</ol>

<h3>🧪 Lab — Checkpoint 4 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Làm tay toàn luồng với ảnh của chính bạn; mở <code>imageUrl</code> trên trình duyệt.</li>
<li>Viết (hoặc chép rồi đọc từng dòng) <code>scripts/checkpoint-4.mjs</code>; chạy tới 23/23.</li>
<li>Cố ý làm hỏng ba chỗ — <code>where</code> quyền sở hữu, bước xoá ảnh, <code>.rotate()</code> hoặc bước bỏ EXIF — và ghi lại dòng nào đỏ mỗi lần. Sẽ có một chỗ không bị bắt: ghi lại là chỗ nào, và thêm phép kiểm cho nó.</li>
<li>Clone ra thư mục mới, dùng tên container và cổng mới, chỉ làm theo README, và đạt 23/23.</li>
<li>Merge, gắn tag <code>ch4</code>, tắt container.</li>
</ol>
<p><strong>Xong khi:</strong> <code>node scripts/checkpoint-4.mjs</code> in <code>23 đạt, 0 trượt</code> trên bản clone mới, và có tag <code>ch4</code>.</p>
</div>
<details><summary>Lời giải</summary>
<p>Tag <code>ch4</code> (merge <code>45cb470</code>). Bước 3: bỏ <code>.rotate()</code> <em>không</em> bị bắt — ảnh tạo ra không có thẻ Orientation. Một phép kiểm thêm tốt là tạo ảnh bằng <code>.withMetadata({ orientation: 6 })</code> rồi khẳng định ảnh đầu ra cao hơn rộng.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">kiểm đầu-cuối</span><span class="v">Điều khiển hệ thống đúng như client thật, đi qua mọi thành phần.</span></div>
  <div class="kv"><span class="k">ca âm</span><span class="v">Phép kiểm khẳng định một việc bị cấm phải thất bại với đúng mã.</span></div>
  <div class="kv"><span class="k">phép kiểm rỗng</span><span class="v">Phép kiểm đạt bất kể mã làm gì — nó không kiểm gì cả.</span></div>
  <div class="kv"><span class="k">clone sạch</span><span class="v">Bản checkout mới với dịch vụ mới: chứng minh README đủ bước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Làm tay: vé → PUT → bài → mở imageUrl. Rồi mới tới script.</li>
<li>23 phép kiểm: không hồi quy, cấu hình, đường đẹp với ảnh có GPS, quyền sở hữu, khai dối, dọn dẹp.</li>
<li>Ba lần trượt thật: tệp chưa định dạng, phép kiểm không thể trượt, một dòng chú thích "tạm thời".</li>
<li>Clone sạch: migrate, seed, <code>kho:chuan-bi</code>, rồi 23/23; merge và tag <code>ch4</code>.</li>
</ul>
${THE}
</div>
`,
};
