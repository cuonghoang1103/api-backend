/**
 * 4.2 — Upload ảnh lên R2/S3 bằng presigned URL (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: MinIO RELEASE.2026-11-16 (ảnh cgr.dev/chainguard/minio — repo minio/minio đã archive),
 * @aws-sdk/client-s3 + s3-request-presigner 3.1176.0, repo chiase nhánh ch4/bai-viet (commit 7afdc78).
 * Phát hiện thật 24/11: MinIO không có /data là volume ⇒ "Rename across devices not allowed"; MinIO trả NotImplemented cho
 * PutBucketCors (CORS đặt bằng MINIO_API_CORS_ALLOW_ORIGIN, mặc định cho MỌI origin); SDK v3 mặc định chỉ ký
 * content-length;host — KHÔNG ký content-type (tài liệu R2 nói "signature will include this header") ⇒ cần signableHeaders;
 * kho lưu nguyên Content-Type client gửi (text/html); URL ký sẵn có x-amz-checksum-crc32=AAAAAA== (CRC32 body rỗng) từ
 * SDK 3.729.0 ⇒ requestChecksumCalculation: 'WHEN_REQUIRED'; URL hạn 1 giây ⇒ 403 Request has expired.
 * Nguồn (GET 200, 24/11/2026): Cloudflare R2 docs — Presigned URLs, CORS; GitHub aws-sdk-js-v3 #6810 (16/01/2025);
 * GitHub minio/minio (README "THIS REPOSITORY IS NO LONGER MAINTAINED", archived); Wikipedia Uber (sự cố 2016).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const MINIO_LOI = `$ docker run -d --name fsp-minio --memory 2g --memory-swap 2g --cpus 2 -p 127.0.0.1:41813:9000 -p 127.0.0.1:41814:9001 -e MINIO_ROOT_USER=chiase-dev -e MINIO_ROOT_PASSWORD=chiase-dev-matkhau cgr.dev/chainguard/minio:latest server /data --console-address :9001
$ docker logs fsp-minio 2&gt;&amp;1 | head -3

API: SYSTEM.storage
Error: unable to rename (/data/.minio.sys/tmp -&gt; /data/.minio.sys/tmp-old/cd1e4942-0e6f-4b63-9df7-cdf5591fc61f) Rename across devices not allowed, please fix your backend configuration (/data/.minio.sys/tmp)-&gt;(/data/.minio.sys/tmp-old/cd1e4942-0e6f-4b63-9df7-cdf5591fc61f), drive may be faulty, please investigate (*fmt.wrapError)`;

const MINIO_OK = `$ docker run -d --name fsp-minio --memory 2g --memory-swap 2g --cpus 2 -p 127.0.0.1:41813:9000 -p 127.0.0.1:41814:9001 \\
    -v fsp-minio-data:/data -e MINIO_ROOT_USER=chiase-dev -e MINIO_ROOT_PASSWORD=chiase-dev-matkhau \\
    -e MINIO_API_CORS_ALLOW_ORIGIN=http://localhost:41811 cgr.dev/chainguard/minio:latest server /data --console-address :9001
$ docker exec fsp-minio minio --version | head -1
minio version RELEASE.2026-11-16T00-11-40Z (commit-id=ee9fee0715118245ff4d9149c102608653748196)
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:41813/minio/health/live
200`;

const KHO_SCRIPT = `// Chuẩn bị bucket cho máy dev (MinIO): npm run kho:chuan-bi -w apps/api — chạy lại nhiều lần vẫn an toàn.
// Trên R2 các bước tương đương làm ở trang quản trị Cloudflare (bài 4.3 ghi rõ từng bước).
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  PutBucketLifecycleConfigurationCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { s3, BUCKET } from '../src/lib/storage.js';
import { config } from '../src/config.js';

const buoc = async (ten: string, f: () =&gt; Promise&lt;unknown&gt;) =&gt; {
  try {
    await f();
    console.log(\`✔ \${ten}\`);
  } catch (e) {
    const err = e as { name?: string; message?: string };
    console.log(\`✘ \${ten}: \${err.name} — \${err.message}\`);
  }
};

await buoc(\`bucket "\${BUCKET}"\`, async () =&gt; {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
  }
});

// Chỉ thư mục posts/ là công khai (ảnh đã duyệt). tmp/ (ảnh vừa tải lên, chưa kiểm) KHÔNG ai đọc được trực tiếp.
await buoc('chính sách: ai cũng ĐỌC được posts/*', () =&gt;
  s3.send(
    new PutBucketPolicyCommand({
      Bucket: BUCKET,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [\`arn:aws:s3:::\${BUCKET}/posts/*\`],
          },
        ],
      }),
    }),
  ),
);

// Trình duyệt PUT thẳng lên kho từ trang web (khác origin) ⇒ kho phải trả header CORS cho origin của web.
// MinIO KHÔNG có CORS theo bucket (trả NotImplemented) — nó đặt CORS cho cả máy chủ bằng biến
// MINIO_API_CORS_ALLOW_ORIGIN lúc docker run (mặc định "*" = mọi trang). R2/S3 thì nhận lệnh dưới đây.
await buoc(\`CORS: cho phép PUT từ \${config.webOrigin}\`, () =&gt;
  s3
    .send(
      new PutBucketCorsCommand({
        Bucket: BUCKET,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedOrigins: [config.webOrigin],
              AllowedMethods: ['PUT'],
              AllowedHeaders: ['content-type'],
              MaxAgeSeconds: 3600,
            },
          ],
        },
      }),
    )
    .catch((e: { name?: string }) =&gt; {
      if (e.name !== 'NotImplemented') throw e;
      console.log('  (MinIO: bỏ qua — CORS đặt bằng MINIO_API_CORS_ALLOW_ORIGIN khi chạy container)');
    }),
);

// Ảnh tải lên mà không bao giờ gắn vào bài (người dùng bỏ ngang) ⇒ kho tự xoá sau 1 ngày.
await buoc('vòng đời: tự xoá tmp/ sau 1 ngày', () =&gt;
  s3.send(
    new PutBucketLifecycleConfigurationCommand({
      Bucket: BUCKET,
      LifecycleConfiguration: {
        Rules: [{ ID: 'xoa-tmp', Status: 'Enabled', Filter: { Prefix: 'tmp/' }, Expiration: { Days: 1 } }],
      },
    }),
  ),
);`;

const OUT_KHO = `$ npm run kho:chuan-bi -w apps/api

&gt; api@0.0.0 kho:chuan-bi
&gt; tsx --env-file-if-exists=.env scripts/kho-chuan-bi.ts

✔ bucket "chiase"
✔ chính sách: ai cũng ĐỌC được posts/*
  (MinIO: bỏ qua — CORS đặt bằng MINIO_API_CORS_ALLOW_ORIGIN khi chạy container)
✔ CORS: cho phép PUT từ http://localhost:41811
✔ vòng đời: tự xoá tmp/ sau 1 ngày`;

const CORS1 = `$ curl -si -X OPTIONS localhost:41813/chiase/tmp/x -H "Origin: http://localhost:41811" -H "Access-Control-Request-Method: PUT" -H "Access-Control-Request-Headers: content-type" | grep -i "^\\(HTTP\\|access-control\\)"; curl -si -X OPTIONS localhost:41813/chiase/tmp/x -H "Origin: https://trang-la.example" -H "Access-Control-Request-Method: PUT" | grep -i "^\\(HTTP\\|access-control-allow-origin\\)"
HTTP/1.1 204 No Content
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Methods: PUT
Access-Control-Allow-Origin: http://localhost:41811
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://trang-la.example`;

const CORS2 = `$ curl -si -X OPTIONS localhost:41813/chiase/tmp/x -H "Origin: https://trang-la.example" -H "Access-Control-Request-Method: PUT" | grep -i "^\\(HTTP\\|access-control-allow-origin\\)"; curl -si -X OPTIONS localhost:41813/chiase/tmp/x -H "Origin: http://localhost:41811" -H "Access-Control-Request-Method: PUT" | grep -i "^\\(HTTP\\|access-control-allow-origin\\)"
HTTP/1.1 204 No Content
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:41811`;

const ENV = `# Kho ảnh tương thích S3 (bài 4.2). Máy dev: MinIO trong Docker cổng 41813. Production: Cloudflare R2
#   (S3_ENDPOINT=https://&lt;account_id&gt;.r2.cloudflarestorage.com, S3_REGION=auto) hoặc AWS S3.
S3_ENDPOINT=http://localhost:41813
S3_REGION=auto
S3_BUCKET=chiase
S3_ACCESS_KEY_ID=chiase-dev
S3_SECRET_ACCESS_KEY=chiase-dev-matkhau
# Gốc URL công khai của ảnh (CDN/tên miền riêng của bucket). API ghép MEDIA_BASE_URL + "/" + image_key.
MEDIA_BASE_URL=http://localhost:41813/chiase`;

const STORAGE = `import { S3Client } from '@aws-sdk/client-s3';
import { config } from '../config.js';

// MỘT client dùng chung cả ứng dụng (nó giữ pool kết nối HTTP bên trong).
// forcePathStyle: URL dạng http://host/bucket/key thay vì http://bucket.host/key — MinIO ở localhost cần kiểu này;
// R2 và S3 nhận cả hai.
export const s3 = new S3Client({
  endpoint: config.s3.endpoint,
  region: config.s3.region,
  forcePathStyle: true,
  // SDK ≥ 3.729 mặc định nhét x-amz-checksum-crc32 (tính trên body RỖNG lúc ký) vào URL ký sẵn ⇒ URL phụ thuộc việc kho
  // có kiểm tổng kiểm tra hay không. Chỉ tính checksum khi API bắt buộc ⇒ URL ký sẵn sạch, chạy như nhau trên MinIO/R2/S3.
  requestChecksumCalculation: 'WHEN_REQUIRED',
  credentials: { accessKeyId: config.s3.accessKeyId, secretAccessKey: config.s3.secretAccessKey },
});
export const BUCKET = config.s3.bucket;

// Khoá ảnh ⇒ URL công khai. Đổi CDN chỉ cần đổi MEDIA_BASE_URL.
export const urlAnh = (key: string | null) =&gt; (key ? \`\${config.mediaBaseUrl}/\${key}\` : null);`;

const CRC = `$ npx tsx --env-file=.env thu-ky3.ts      # lần 1: client S3 mặc định
mặc định: x-amz-checksum-crc32 = AAAAAA== (CRC32 của body RỖNG lúc ký)
  PUT body thật lên MinIO → 200 
$ npx tsx --env-file=.env thu-ky3.ts      # lần 2: sau khi thêm requestChecksumCalculation vào storage.ts
requestChecksumCalculation: 'WHEN_REQUIRED' ⇒ tham số: X-Amz-Algorithm X-Amz-Content-Sha256 X-Amz-Credential X-Amz-Date X-Amz-Expires X-Amz-Signature X-Amz-SignedHeaders x-id`;

const UPLOAD_SCHEMA = `import { z } from 'zod';

export const LOAI_ANH = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ANH_TOI_DA = 5 * 1024 * 1024; // 5 MiB

// Client khai TRƯỚC loại và kích thước ⇒ server ký đúng hai giá trị đó vào URL. Khai dối thì PUT bị kho từ chối.
export const xinTaiLenSchema = z.strictObject({
  contentType: z.enum(LOAI_ANH),
  size: z.int().min(1).max(ANH_TOI_DA, \`ảnh tối đa \${ANH_TOI_DA} byte\`),
});
export type XinTaiLen = z.infer&lt;typeof xinTaiLenSchema&gt;;`;

const UPLOAD_SVC = `import { randomUUID } from 'node:crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, BUCKET } from '../lib/storage.js';
import type { XinTaiLen } from '../schemas/upload.schema.js';

const HAN_URL_S = 300; // URL ký sẵn sống 5 phút: đủ để tải một ảnh, không đủ để đem đi dùng lại lâu dài

// Cấp "vé" tải MỘT ảnh lên kho, không đi qua máy chủ API. Ảnh vào tmp/&lt;userId&gt;/… — vùng chưa kiểm, không công khai.
// Khoá do SERVER đặt (uuid ngẫu nhiên), không bao giờ lấy tên tệp của người dùng.
export async function capUrlTaiLen(userId: string, { contentType, size }: XinTaiLen) {
  const key = \`tmp/\${userId}/\${randomUUID()}\`;
  const lenh = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });
  // signableHeaders: ÉP ký content-type và content-length — gửi khác giá trị đã khai ⇒ chữ ký sai ⇒ 403.
  const url = await getSignedUrl(s3, lenh, {
    expiresIn: HAN_URL_S,
    signableHeaders: new Set(['content-type', 'content-length']),
  });
  return { key, url, method: 'PUT' as const, headers: { 'content-type': contentType }, expiresIn: HAN_URL_S };
}`;

const OUT_VE = `$ curl -s $A/uploads -H "Authorization: Bearer $AN" $J -d "{\\"contentType\\":\\"image/jpeg\\",\\"size\\":$(stat -c %s $ANH)}" | tee /tmp/fsp-ve.json | node -pe "const v=JSON.parse(require(\\"fs\\").readFileSync(0)); ({...v, url: v.url.slice(0,95)+\\"…\\"})"
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

const KY_THU2 = `$ npx tsx --env-file=.env thu-ky2.ts
tham số trong URL: X-Amz-Algorithm X-Amz-Content-Sha256 X-Amz-Credential X-Amz-Date X-Amz-Expires X-Amz-Signature X-Amz-SignedHeaders x-amz-checksum-crc32 x-amz-sdk-checksum-algorithm x-id
PUT 200; kho lưu ContentType = text/html, 39 byte
URL hạn 1 giây, PUT sau 2,5 giây → 403 Request has expired`;

const THU_KY_MA = `// THỬ (không commit): ký có/không signableHeaders rồi PUT sai loại/sai kích thước
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { readFileSync } from 'node:fs';
import { s3, BUCKET } from './src/lib/storage.js';
const anh = readFileSync(process.argv[2]!);
const html = Buffer.from('&lt;script&gt;alert(document.domain)&lt;/script&gt;'.padEnd(anh.length, ' '));
for (const ep of [false, true]) {
  const lenh = new PutObjectCommand({ Bucket: BUCKET, Key: \`tmp/thu/\${ep}\`, ContentType: 'image/jpeg', ContentLength: anh.length });
  const url = await getSignedUrl(s3, lenh, ep ? { expiresIn: 300, signableHeaders: new Set(['content-type', 'content-length']) } : { expiresIn: 300 });
  console.log(\`\\n\${ep ? 'CÓ signableHeaders' : 'KHÔNG signableHeaders (mặc định)'} — X-Amz-SignedHeaders=\${new URL(url).searchParams.get('X-Amz-SignedHeaders')}\`);
  const put = async (moTa: string, body: Buffer, loai: string) =&gt; {
    const r = await fetch(url, { method: 'PUT', body, headers: { 'content-type': loai } });
    console.log(\`  \${moTa.padEnd(46)} → \${r.status} \${r.ok ? '' : ((await r.text()).match(/&lt;Code&gt;(\\w+)/)?.[1] ?? '')}\`);
  };
  await put('đúng ảnh, đúng image/jpeg', anh, 'image/jpeg');
  await put('HTML cùng cỡ, khai text/html', html, 'text/html');
  await put('HTML cùng cỡ, khai image/jpeg (nói dối)', html, 'image/jpeg');
  await put('ảnh gấp đôi kích thước đã khai', Buffer.concat([anh, anh]), 'image/jpeg');
}`;

const KY_THU = `$ npx tsx --env-file=.env thu-ky.ts meo.jpg      # ảnh JPEG thật 31.213 byte
KHÔNG signableHeaders (mặc định) — X-Amz-SignedHeaders=content-length;host
  đúng ảnh, đúng image/jpeg                      → 200 
  HTML cùng cỡ, khai text/html                   → 200 
  HTML cùng cỡ, khai image/jpeg (nói dối)        → 200 
  ảnh gấp đôi kích thước đã khai                 → 403 SignatureDoesNotMatch

CÓ signableHeaders — X-Amz-SignedHeaders=content-length;content-type;host
  đúng ảnh, đúng image/jpeg                      → 200 
  HTML cùng cỡ, khai text/html                   → 403 SignatureDoesNotMatch
  HTML cùng cỡ, khai image/jpeg (nói dối)        → 200 
  ảnh gấp đôi kích thước đã khai                 → 403 SignatureDoesNotMatch`;

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-10-1-nhan-file-multipart', title: 'Node.js 10.1 — Nhận file: multipart, base64, và cái giá phải trả', sub: 'Đo thật khi tệp đi XUYÊN máy chủ Node.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-10-2-object-storage-presigned', title: 'Node.js 10.2 — Object storage và URL ký sẵn', sub: 'Bài khái niệm gốc của presigned URL.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-4-2-sigv4-bug', title: 'Object Storage 4.2 — Bug SigV4 signableHeaders XSS', sub: 'Vì sao Content-Type không được ký lại thành lỗ XSS — chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-5-1-vi-sao-cors', title: 'Object Storage 5.1 — Vì sao CORS: browser chặn cross-origin PUT', sub: 'CORS cho upload từ trình duyệt.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-2-2-quirks', title: 'Object Storage 2.2 — R2 quirks: region auto, path style, header', sub: 'Những điểm R2 khác S3.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'Cloudflare R2 — Presigned URLs', 'Giới hạn Content-Type, hạn ngắn; presigned URL chỉ chạy trên miền S3 API (&lt;ACCOUNT_ID&gt;.r2.cloudflarestorage.com), không chạy trên tên miền riêng.', 'https://developers.cloudflare.com/r2/api/s3/presigned-urls/'),
  nguon('📘', 'Cloudflare R2 — Configure CORS', 'CORS theo bucket cho upload từ trình duyệt.', 'https://developers.cloudflare.com/r2/buckets/cors/'),
  nguon('🐙', 'GitHub aws-sdk-js-v3 #6810 — Announcement: S3 default integrity change (16/01/2025)', 'Từ v3.729.0 client S3 mặc định thêm checksum; dịch vụ tương thích S3 bên thứ ba có thể chưa hỗ trợ ⇒ WHEN_REQUIRED.', 'https://github.com/aws/aws-sdk-js-v3/issues/6810'),
  nguon('🐙', 'GitHub minio/minio', 'README: "THIS REPOSITORY IS NO LONGER MAINTAINED" — repo đã archive.', 'https://github.com/minio/minio'),
  nguon('📰', 'Wikipedia — Uber (mục sự cố bảo mật 2016)', 'Khoá AWS nằm trong repo GitHub riêng ⇒ dữ liệu 57 triệu khách + 600.000 tài xế.', 'https://en.wikipedia.org/wiki/Uber'),
].join('\n');

const MERMAID = `sequenceDiagram
  participant W as Trình duyệt
  participant A as API ChiaSe
  participant K as Kho ảnh (MinIO / R2)
  W->>A: POST /api/uploads {contentType, size} + Bearer
  A-->>W: 201 {key: tmp/userId/uuid, url ký sẵn 5 phút}
  W->>K: PUT url (body = ảnh, đúng content-type)
  K-->>W: 200
  W->>A: POST /api/posts {title, body, imageKey: key}
  A->>K: HEAD + GET tmp/… (bài 4.3 kiểm và xử lý)
  A-->>W: 201 {…, imageUrl}`;

export default {
  title: '4.2 — Uploading images to R2/S3 with presigned URLs|||4.2 — Upload ảnh lên R2/S3 bằng presigned URL',
  slug: 'fp-4-2-upload-r2',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao ảnh không đi xuyên máy chủ API; dựng MinIO trên máy dev (repo gốc đã ngừng bảo trì, bẫy volume, CORS không theo bucket) và script chuẩn bị bucket; client S3 cho MinIO/R2; cấp URL ký sẵn 5 phút vào vùng tmp/ do server đặt khoá; đo thật: SDK v3 mặc định KHÔNG ký Content-Type, kho lưu nguyên text/html, checksum CRC32 của body rỗng trong URL — và cách sửa; lưu khoá, không lưu URL; kèm sự cố Uber 2016.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Upload</span>
<h2>Let the browser talk to storage directly — with a ticket the server signed</h2>
<p class="lead">A post with a photo is the core of ChiaSe. Photos from phones are 2–6 MB; pushing them through the Node API wastes bandwidth and memory and ties up the server for seconds. The industry answer is the <strong>presigned URL</strong>: the API signs a short-lived "ticket" that allows exactly one upload, and the browser sends the bytes straight to object storage. This lesson builds that on MinIO (S3-compatible, runs in Docker) so the same code works on Cloudflare R2 or AWS S3 in Chapter 11 — and measures what the ticket actually enforces. The answer surprised us.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Why not upload through the API?</h3>
<p>Three costs, all of which the Node.js course measures in detail (lesson 10.1, linked below): every byte crosses the network <em>twice</em> (client → API → storage), each upload holds memory or a temp file on the API server, and a slow phone on 4G keeps a request open for many seconds — on a small VPS a handful of those is enough to make every other user wait. Our API also has <code>express.json({ limit: '100kb' })</code> from Chapter 2; a photo would not even fit. With a presigned URL the API only does what it is good at: decide <em>who</em> may upload <em>what</em>, in a 5 ms request.</p>

<h3>2. Object storage on your machine: MinIO</h3>
<p>MinIO speaks the S3 API, so the code you write now talks to R2 or S3 later by changing four environment variables. One fact you should know in 2026: the original <code>minio/minio</code> GitHub repository has been archived with "THIS REPOSITORY IS NO LONGER MAINTAINED" on its README. We use the image maintained by Chainguard (<code>cgr.dev/chainguard/minio</code>, built from their fork) for development only; production uses R2.</p>
<p>The first attempt failed:</p>
<div class="out">${MINIO_LOI}</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — MinIO's data directory must be a real volume.</strong> Without <code>-v</code>, <code>/data</code> lives in the container's overlay filesystem, and MinIO's internal "rename" between two of its folders is refused. Mount a named volume and the error disappears (and your images survive <code>docker rm</code>).</p></div>
<div class="out">${MINIO_OK}</div>

<h3>3. Preparing the bucket — as code, not as clicks</h3>
<pre><code class="language-ts">${KHO_SCRIPT}</code></pre>
<div class="out">${OUT_KHO}</div>
<p>Three rules, each a security decision:</p>
<ul>
<li><strong>Only <code>posts/*</code> is public.</strong> Uploads land in <code>tmp/</code>, which nobody can read without credentials. A file becomes public only after the API has checked and re-encoded it (lesson 4.3).</li>
<li><strong>CORS</strong> lets the web page at <code>localhost:41811</code> send a cross-origin PUT. MinIO answered <code>NotImplemented</code> — it has no per-bucket CORS. It sets CORS for the whole server with <code>MINIO_API_CORS_ALLOW_ORIGIN</code>, and the default is "any origin":</li>
</ul>
<div class="out">${CORS1}</div>
<p>After recreating the container with the variable:</p>
<div class="out">${CORS2}</div>
<ul>
<li><strong>Lifecycle</strong>: abandoned uploads in <code>tmp/</code> are deleted by the storage itself after one day. No cron job of ours to forget.</li>
</ul>

<h3>4. One S3 client for MinIO, R2 and S3</h3>
<pre><code class="language-bash">${ENV}</code></pre>
<pre><code class="language-ts">${STORAGE}</code></pre>
<p><code>forcePathStyle</code> builds URLs as <code>host/bucket/key</code> (MinIO on localhost needs it), <code>region: 'auto'</code> is what R2 expects. The last option came from a measurement:</p>
<div class="out">${CRC}</div>
<p>Since SDK v3.729.0 (January 2025, GitHub issue #6810) the S3 client adds a CRC32 checksum by default. In a presigned URL it is computed when signing — over an <em>empty</em> body, hence <code>AAAAAA==</code>. MinIO ignored it; AWS's own announcement warns that third-party S3-compatible services may not handle the new defaults. <code>WHEN_REQUIRED</code> keeps our URLs plain and portable.</p>

<h3>5. Issuing the upload ticket</h3>
<pre><code class="language-ts">${UPLOAD_SCHEMA}</code></pre>
<pre><code class="language-ts">${UPLOAD_SVC}</code></pre>
<div class="out">${OUT_VE}</div>
<p>The client declares type and size up front; the server refuses SVG (an "image" that can contain JavaScript) and anything over 5 MiB before signing. The <strong>key is chosen by the server</strong>: <code>tmp/&lt;userId&gt;/&lt;random uuid&gt;</code>. Never build keys from the user's file name — <code>../../index.html</code>, <code>avatar.png</code> overwriting someone else's <code>avatar.png</code>, or a 300-character Vietnamese name with spaces are all problems you simply do not have. The URL is valid for 5 minutes, then:</p>
<div class="out">${KY_THU2}</div>

<h3>6. The measurement: what does the ticket really enforce?</h3>
<p>Cloudflare's R2 documentation advises restricting Content-Type in the SDK parameters and says "the signature will include this header". We tested that claim with the AWS SDK v3 instead of trusting it — a script signs one URL the default way and one with <code>signableHeaders</code>, then tries four uploads against each:</p>
<pre><code class="language-ts">${THU_KY_MA}</code></pre>
<div class="out">${KY_THU}</div>
<p>Read <code>X-Amz-SignedHeaders</code>, it tells the truth. <strong>By default the SDK signs <code>content-length</code> and <code>host</code> — not <code>content-type</code>.</strong> So with a default URL, HTML declared as <code>text/html</code> was accepted, and the line "PUT 200; storage keeps ContentType = text/html" above shows the storage then <em>serves it back as HTML</em>. If that object were public on your media domain, it would be a page running the attacker's script (stored XSS) — exactly the bug the Object Storage course dissects in lesson 4.2. With <code>signableHeaders: new Set(['content-type', 'content-length'])</code>, a different type or size breaks the signature: 403.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a signed Content-Type is still a lie the client chose.</strong> Look at the third line of the second block: HTML bytes declared as <code>image/jpeg</code> passed — the signature only checks that the header equals what was declared, not what the bytes are. That is why the files land in a private <code>tmp/</code> area and the API inspects the real bytes before anything becomes public. Lesson 4.3.</p></div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ask</span><span class="lz-d">POST /api/uploads {contentType ∈ jpeg/png/webp, size ≤ 5 MiB} + access token</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">sign</span><span class="lz-d">server picks tmp/&lt;userId&gt;/&lt;uuid&gt;, signs PUT with content-type + content-length, 5 minutes</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">upload</span><span class="lz-d">browser PUTs bytes straight to storage; other type/size/late ⇒ 403</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">attach</span><span class="lz-d">POST /api/posts {imageKey}: API checks and publishes (4.3)</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">forget</span><span class="lz-d">never attached ⇒ lifecycle deletes tmp/ after 1 day</span></div>
</div>

<h3>7. Store the key, not the URL</h3>
<p>The database column is <code>image_key</code> (<code>posts/….webp</code>), and the API turns it into <code>imageUrl</code> using <code>MEDIA_BASE_URL</code>. Today that base is <code>http://localhost:41813/chiase</code>; in Chapter 11 it becomes an R2 custom domain such as <code>https://media.yourdomain</code>. If you stored full URLs you would rewrite every row at each move — and R2's documentation notes presigned URLs only work on the S3 API domain, not on custom domains, so the upload URL and the public URL are different hosts anyway.</p>

<h3>🕵️ Hacker's corner — Uber, 2016</h3>
<p>Presigned URLs exist so that storage credentials never leave the server. Uber shows the cost of the opposite. In 2016 attackers got into a private GitHub repository used by Uber engineers, found AWS credentials in it, and used them to download data on 57 million riders and 600,000 drivers; Uber paid the attackers 100,000 USD and disclosed the breach only in November 2017 (Wikipedia, "Uber"). Your <code>S3_SECRET_ACCESS_KEY</code> lives in <code>.env</code> on the server, is never committed (Checkpoint 3 checks <code>.env</code> is not in git), and the browser only ever sees a URL that allows one PUT to one key for five minutes.</p>

<h3>In everyday life</h3>
<p>Sending a big parcel through a friend who forwards it to the warehouse doubles the trips and keeps your friend busy. Instead the warehouse office (the API) hands you a stamped delivery slip: "one parcel, up to 5 kg, labelled 'photo', dock 7, before 3:05 pm". You drive to the warehouse yourself. The guard checks the stamp, the label and the weight — but not what is inside the box. Someone still has to open it before it goes on the shelf.</p>

<h3>On a real job</h3>
<p>Two tickets you will meet. "Upload works in Postman but the browser says CORS error" — the browser sends a preflight <code>OPTIONS</code> to the storage, not to your API; fix the bucket's CORS (or MinIO's variable), not Express's. "Uploads to S3 fail with SignatureDoesNotMatch after we bumped the SDK" — compare <code>X-Amz-SignedHeaders</code> and the extra query parameters before and after; the checksum change of SDK 3.729 broke many S3-compatible setups.</p>

${spring(false, 'Spring Boot does the same with the AWS SDK for Java v2: <code>S3Presigner.presignPutObject(...)</code> returns a presigned URL; the controller only validates type/size and returns the key + URL, exactly like <code>POST /api/uploads</code> here. The Spring Boot course has no dedicated upload lesson — the concepts are in the Node.js/Object Storage lessons linked below; these Spring lessons cover the surrounding pieces.', [
  ['sb-4-2-dto', 'Spring Boot 4.2 — DTOs: why not return the entity (key ⇒ URL in the response)'],
  ['sb-3-7-profile-config', 'Spring Boot 3.7 — Profiles and typed configuration (S3_* per environment)'],
  ['sb-10-5-rate-limit-secret', 'Spring Boot 10.5 — Rate limits, secrets and exposed Actuator'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you let users upload large files without overloading your API?"</strong> — Presigned URLs: the API authorizes and signs, the client uploads directly to object storage, then the API registers the key.</li>
<li><strong>"What can a presigned PUT URL restrict?"</strong> — Method, bucket/key, expiry, and any header included in the signature (content-type, content-length). It cannot check the bytes are what they claim.</li>
<li><strong>"Who chooses the object key?"</strong> — The server, from random ids, never from the user's filename.</li>
<li><strong>"Why store a key instead of a URL?"</strong> — The base URL (CDN, domain) changes; the key does not. Build URLs at the edge of the API.</li>
<li><strong>"Upload fails with a CORS error — where do you look?"</strong> — At the storage bucket's CORS rules and the preflight response, because the browser talks to the storage, not to the API.</li>
</ol>

<h3>🧪 Lab 4.2 (75 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run MinIO <em>without</em> a volume and find the rename error in <code>docker logs</code>; then run it properly with a volume and <code>MINIO_API_CORS_ALLOW_ORIGIN</code>.</li>
<li>Write <code>scripts/kho-chuan-bi.ts</code> and the <code>kho:chuan-bi</code> npm script; run it twice (it must be safe to re-run).</li>
<li>Write <code>lib/storage.ts</code>, the upload schema, service and route. Get a ticket with curl and PUT a real photo with <code>curl --data-binary @photo.jpg</code>.</li>
<li>Reproduce the measurement table of section 6 with your own script: default signing vs <code>signableHeaders</code>.</li>
<li>Check that a guest cannot read your <code>tmp/</code> object, and that a URL used after its expiry returns 403.</li>
</ol>
<p><strong>Done when:</strong> a real photo reaches <code>tmp/&lt;yourId&gt;/…</code> through a ticket, a different Content-Type or size is refused with 403, and you can show <code>X-Amz-SignedHeaders</code> contains <code>content-type</code>.</p>
<p><strong>Rubric (10):</strong> MinIO running with volume + CORS (2) · bucket script: private tmp, public posts, lifecycle (2) · ticket endpoint with server-chosen key and limits (3) · signing measurement reproduced (2) · expiry/guest checks (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>7afdc78</code>: <code>apps/api/scripts/kho-chuan-bi.ts</code>, <code>src/lib/storage.ts</code>, <code>src/schemas/upload.schema.ts</code>, <code>src/services/upload.service.ts</code>, <code>src/controllers/upload.controller.ts</code>, route <code>POST /uploads</code>. If every PUT gives <code>SignatureDoesNotMatch</code> even with the right file, the usual causes are: <code>curl</code> sending a different <code>Content-Type</code> (use <code>-H "content-type: image/jpeg"</code> exactly), using <code>-d</code> instead of <code>--data-binary</code> (curl strips newlines and changes the size), or <code>localhost</code> vs <code>127.0.0.1</code> mismatch with the signed host.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">object storage</span><span class="v">Storage addressed by bucket + key over HTTP (S3 API): S3, R2, MinIO.</span></div>
  <div class="kv"><span class="k">presigned URL</span><span class="v">A URL carrying a signature that allows one operation on one key until it expires.</span></div>
  <div class="kv"><span class="k">X-Amz-SignedHeaders</span><span class="v">The headers covered by the signature; anything not listed can be changed freely.</span></div>
  <div class="kv"><span class="k">CORS preflight</span><span class="v">The browser's OPTIONS request asking the storage whether a cross-origin PUT is allowed.</span></div>
  <div class="kv"><span class="k">lifecycle rule</span><span class="v">A storage-side rule that deletes (or moves) objects by prefix and age.</span></div>
  <div class="kv"><span class="k">path-style URL</span><span class="v">host/bucket/key instead of bucket.host/key.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Images never cross the API: the API signs, the browser PUTs to storage.</li>
<li>MinIO for development (volume required, CORS by environment variable); the same code targets R2/S3.</li>
<li>Server-chosen keys in a private <code>tmp/</code>; only <code>posts/</code> is public; tmp expires after a day.</li>
<li>Measured: the SDK does not sign Content-Type by default — use <code>signableHeaders</code>; and disable the empty-body checksum with <code>WHEN_REQUIRED</code>.</li>
<li>A signature checks headers, not bytes; store keys, not URLs.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Tải ảnh</span>
<h2>Để trình duyệt nói chuyện thẳng với kho — bằng một tấm vé do server ký</h2>
<p class="lead">Bài viết kèm ảnh là trái tim của ChiaSe. Ảnh từ điện thoại nặng 2–6 MB; đẩy chúng xuyên qua API Node là phí băng thông, phí bộ nhớ và giữ máy chủ bận hàng giây. Cách cả ngành đang làm là <strong>presigned URL</strong> (URL ký sẵn): API ký một "tấm vé" ngắn hạn cho phép đúng một lần tải lên, và trình duyệt gửi byte thẳng tới kho đối tượng. Bài này dựng việc đó trên MinIO (tương thích S3, chạy trong Docker) để cùng đoạn mã chạy được trên Cloudflare R2 hay AWS S3 ở Chương 11 — và đo xem tấm vé thật ra ép được những gì. Kết quả làm chính chúng tôi bất ngờ.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Sao không tải ảnh xuyên qua API?</h3>
<p>Ba cái giá, khoá Node.js đã đo chi tiết (bài 10.1, liên kết bên dưới): mỗi byte đi qua mạng <em>hai lần</em> (client → API → kho), mỗi lần tải giữ bộ nhớ hoặc tệp tạm trên máy chủ API, và một chiếc điện thoại chạy 4G chậm giữ request mở hàng chục giây — trên một VPS nhỏ, vài request như thế là đủ bắt mọi người dùng khác chờ. API của ta còn có <code>express.json({ limit: '100kb' })</code> từ Chương 2; một tấm ảnh còn chẳng lọt. Với presigned URL, API chỉ làm việc nó giỏi: quyết định <em>ai</em> được tải <em>cái gì</em>, trong một request 5 ms.</p>

<h3>2. Kho đối tượng ngay trên máy bạn: MinIO</h3>
<p>MinIO nói giao thức S3, nên mã viết hôm nay sẽ nói chuyện với R2 hay S3 sau này chỉ bằng cách đổi bốn biến môi trường. Một sự thật bạn nên biết năm 2026: repo GitHub gốc <code>minio/minio</code> đã bị archive, README ghi "THIS REPOSITORY IS NO LONGER MAINTAINED". Ta dùng ảnh do Chainguard duy trì (<code>cgr.dev/chainguard/minio</code>, dựng từ bản fork của họ) chỉ cho máy dev; production dùng R2.</p>
<p>Lần chạy đầu thất bại:</p>
<div class="out">${MINIO_LOI}</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — thư mục dữ liệu của MinIO phải là volume thật.</strong> Thiếu <code>-v</code>, <code>/data</code> nằm trong hệ tệp overlay của container, và thao tác "đổi tên" nội bộ giữa hai thư mục của MinIO bị từ chối. Gắn một named volume là hết lỗi (và ảnh của bạn sống sót qua <code>docker rm</code>).</p></div>
<div class="out">${MINIO_OK}</div>

<h3>3. Chuẩn bị bucket — bằng mã, không bằng cú nhấp chuột</h3>
<pre><code class="language-ts">${KHO_SCRIPT}</code></pre>
<div class="out">${OUT_KHO}</div>
<p>Ba luật, mỗi luật là một quyết định bảo mật:</p>
<ul>
<li><strong>Chỉ <code>posts/*</code> là công khai.</strong> Ảnh tải lên rơi vào <code>tmp/</code>, không ai đọc được nếu không có khoá truy cập. Một tệp chỉ thành công khai SAU khi API đã kiểm và mã hoá lại nó (bài 4.3).</li>
<li><strong>CORS</strong> cho phép trang web ở <code>localhost:41811</code> gửi PUT khác origin. MinIO trả <code>NotImplemented</code> — nó không có CORS theo bucket. Nó đặt CORS cho cả máy chủ bằng <code>MINIO_API_CORS_ALLOW_ORIGIN</code>, và mặc định là "mọi origin":</li>
</ul>
<div class="out">${CORS1}</div>
<p>Sau khi tạo lại container có biến đó:</p>
<div class="out">${CORS2}</div>
<ul>
<li><strong>Vòng đời (lifecycle)</strong>: ảnh tải lên rồi bỏ ngang trong <code>tmp/</code> do chính kho tự xoá sau một ngày. Không có cron job nào của ta để mà quên.</li>
</ul>

<h3>4. Một client S3 cho cả MinIO, R2 và S3</h3>
<pre><code class="language-bash">${ENV}</code></pre>
<pre><code class="language-ts">${STORAGE}</code></pre>
<p><code>forcePathStyle</code> dựng URL dạng <code>host/bucket/key</code> (MinIO ở localhost cần kiểu này), <code>region: 'auto'</code> là giá trị R2 chờ đợi. Tuỳ chọn cuối cùng đến từ một lần đo:</p>
<div class="out">${CRC}</div>
<p>Từ SDK v3.729.0 (tháng 01/2025, GitHub issue #6810), client S3 mặc định thêm checksum CRC32. Trong URL ký sẵn, nó được tính lúc ký — trên một body <em>rỗng</em>, nên ra <code>AAAAAA==</code>. MinIO bỏ qua; chính thông báo của AWS cảnh báo các dịch vụ tương thích S3 của bên thứ ba có thể chưa xử lý được mặc định mới. <code>WHEN_REQUIRED</code> giữ URL của ta sạch và mang đi đâu cũng chạy.</p>

<h3>5. Cấp vé tải lên</h3>
<pre><code class="language-ts">${UPLOAD_SCHEMA}</code></pre>
<pre><code class="language-ts">${UPLOAD_SVC}</code></pre>
<div class="out">${OUT_VE}</div>
<p>Client khai trước loại và kích thước; server từ chối SVG (một "ảnh" có thể chứa JavaScript) và mọi thứ trên 5 MiB TRƯỚC khi ký. <strong>Khoá do server chọn</strong>: <code>tmp/&lt;userId&gt;/&lt;uuid ngẫu nhiên&gt;</code>. Đừng bao giờ dựng khoá từ tên tệp của người dùng — <code>../../index.html</code>, <code>avatar.png</code> đè lên <code>avatar.png</code> của người khác, hay một cái tên tiếng Việt 300 ký tự có dấu cách đều là những rắc rối bạn đơn giản là không có. URL sống 5 phút, sau đó:</p>
<div class="out">${KY_THU2}</div>

<h3>6. Phép đo: tấm vé thật sự ép được gì?</h3>
<p>Tài liệu R2 của Cloudflare khuyên giới hạn Content-Type trong tham số SDK và nói "chữ ký sẽ bao gồm header này". Ta kiểm câu đó bằng AWS SDK v3 thay vì tin luôn — một script ký một URL theo cách mặc định và một URL có <code>signableHeaders</code>, rồi thử bốn lần tải lên mỗi URL:</p>
<pre><code class="language-ts">${THU_KY_MA}</code></pre>
<div class="out">${KY_THU}</div>
<p>Đọc <code>X-Amz-SignedHeaders</code>, nó nói thật. <strong>Mặc định SDK ký <code>content-length</code> và <code>host</code> — KHÔNG ký <code>content-type</code>.</strong> Nên với URL mặc định, HTML khai <code>text/html</code> vẫn được nhận, và dòng "PUT 200; kho lưu ContentType = text/html" ở trên cho thấy kho sau đó <em>trả nó về đúng như HTML</em>. Nếu object đó công khai trên tên miền ảnh của bạn, nó là một trang chạy script của kẻ tấn công (stored XSS) — đúng lỗi mà khoá Object Storage mổ xẻ ở bài 4.2. Với <code>signableHeaders: new Set(['content-type', 'content-length'])</code>, khác loại hay khác cỡ là vỡ chữ ký: 403.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — Content-Type đã ký vẫn là lời khai do client chọn.</strong> Nhìn dòng thứ ba của khối thứ hai: byte HTML khai là <code>image/jpeg</code> vẫn lọt — chữ ký chỉ kiểm header bằng đúng giá trị đã khai, không kiểm byte thật là gì. Vì thế tệp rơi vào vùng riêng tư <code>tmp/</code> và API soi byte thật trước khi bất cứ thứ gì thành công khai. Bài 4.3.</p></div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">xin vé</span><span class="lz-d">POST /api/uploads {contentType ∈ jpeg/png/webp, size ≤ 5 MiB} + access token</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">ký</span><span class="lz-d">server chọn tmp/&lt;userId&gt;/&lt;uuid&gt;, ký PUT kèm content-type + content-length, 5 phút</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">tải lên</span><span class="lz-d">trình duyệt PUT byte thẳng lên kho; khác loại/cỡ/quá hạn ⇒ 403</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">gắn bài</span><span class="lz-d">POST /api/posts {imageKey}: API kiểm và công khai (4.3)</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">bỏ quên</span><span class="lz-d">không gắn bài ⇒ vòng đời xoá tmp/ sau 1 ngày</span></div>
</div>

<h3>7. Lưu khoá, không lưu URL</h3>
<p>Cột trong CSDL là <code>image_key</code> (<code>posts/….webp</code>), và API biến nó thành <code>imageUrl</code> bằng <code>MEDIA_BASE_URL</code>. Hôm nay gốc đó là <code>http://localhost:41813/chiase</code>; ở Chương 11 nó thành tên miền riêng của R2, kiểu <code>https://media.tenmiencuaban</code>. Nếu lưu URL đầy đủ, mỗi lần chuyển nhà bạn phải viết lại mọi dòng — và tài liệu R2 ghi rõ presigned URL chỉ chạy trên miền S3 API, không chạy trên tên miền riêng, nên URL tải lên và URL công khai vốn đã là hai máy chủ khác nhau.</p>

<h3>🕵️ Góc hacker — Uber, 2016</h3>
<p>Presigned URL tồn tại để khoá truy cập kho không bao giờ rời máy chủ. Uber cho thấy cái giá của điều ngược lại. Năm 2016, kẻ tấn công vào được một repo GitHub riêng mà kỹ sư Uber dùng, thấy khoá AWS trong đó, và dùng nó tải dữ liệu của 57 triệu khách hàng và 600.000 tài xế; Uber trả kẻ tấn công 100.000 USD và chỉ công bố vụ việc vào tháng 11/2017 (Wikipedia, "Uber"). <code>S3_SECRET_ACCESS_KEY</code> của bạn nằm trong <code>.env</code> trên máy chủ, không bao giờ được commit (Checkpoint 3 kiểm <code>.env</code> không nằm trong git), và trình duyệt chỉ bao giờ thấy một URL cho phép một lần PUT vào một khoá trong năm phút.</p>

<h3>Liên hệ đời thường</h3>
<p>Gửi một kiện hàng lớn qua tay một người bạn để bạn ấy chuyển tới kho là gấp đôi số chuyến và giữ bạn ấy bận. Thay vào đó, văn phòng kho (API) đưa bạn một phiếu giao hàng có đóng dấu: "một kiện, tối đa 5 kg, nhãn 'ảnh', cửa số 7, trước 15:05". Bạn tự chở tới kho. Bảo vệ kiểm con dấu, cái nhãn và cân nặng — nhưng không mở thùng xem bên trong là gì. Vẫn phải có người mở ra trước khi xếp lên kệ.</p>

<h3>Đi làm thật</h3>
<p>Hai ticket bạn sẽ gặp. "Tải lên chạy trong Postman nhưng trình duyệt báo lỗi CORS" — trình duyệt gửi preflight <code>OPTIONS</code> tới KHO, không phải tới API của bạn; sửa CORS của bucket (hoặc biến của MinIO), không phải của Express. "Tải lên S3 lỗi SignatureDoesNotMatch sau khi nâng SDK" — so <code>X-Amz-SignedHeaders</code> và các tham số thêm trên URL trước và sau; thay đổi checksum của SDK 3.729 đã làm hỏng rất nhiều hệ tương thích S3.</p>

${spring(false, 'Spring Boot làm y hệt với AWS SDK for Java v2: <code>S3Presigner.presignPutObject(...)</code> trả về presigned URL; controller chỉ kiểm loại/cỡ rồi trả khoá + URL, đúng như <code>POST /api/uploads</code> ở đây. Khoá Spring Boot chưa có bài riêng về tải tệp — khái niệm nằm ở các bài Node.js/Object Storage liên kết bên dưới; các bài Spring sau phủ phần xung quanh.', [
  ['sb-4-2-dto', 'Spring Boot 4.2 — DTO: vì sao không trả thẳng entity (khoá ⇒ URL trong response)'],
  ['sb-3-7-profile-config', 'Spring Boot 3.7 — Profile và cấu hình có kiểu (S3_* theo môi trường)'],
  ['sb-10-5-rate-limit-secret', 'Spring Boot 10.5 — Giới hạn tần suất, bí mật và lộ Actuator'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Cho người dùng tải tệp lớn mà không làm quá tải API thế nào?"</strong> — Presigned URL: API cấp quyền và ký, client tải thẳng lên kho, sau đó API ghi nhận khoá.</li>
<li><strong>"Presigned PUT URL giới hạn được những gì?"</strong> — Phương thức, bucket/khoá, hạn dùng, và mọi header nằm trong chữ ký (content-type, content-length). Nó không kiểm được byte có đúng như lời khai.</li>
<li><strong>"Ai chọn khoá object?"</strong> — Server, từ id ngẫu nhiên, không bao giờ từ tên tệp của người dùng.</li>
<li><strong>"Sao lưu khoá thay vì URL?"</strong> — URL gốc (CDN, tên miền) thay đổi; khoá thì không. Dựng URL ở rìa API.</li>
<li><strong>"Tải lên báo lỗi CORS — bạn nhìn vào đâu?"</strong> — Luật CORS của bucket và phản hồi preflight, vì trình duyệt nói chuyện với kho chứ không phải với API.</li>
</ol>

<h3>🧪 Lab 4.2 (75 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy MinIO <em>không</em> có volume và tìm lỗi rename trong <code>docker logs</code>; rồi chạy đúng cách với volume và <code>MINIO_API_CORS_ALLOW_ORIGIN</code>.</li>
<li>Viết <code>scripts/kho-chuan-bi.ts</code> và npm script <code>kho:chuan-bi</code>; chạy hai lần (chạy lại phải an toàn).</li>
<li>Viết <code>lib/storage.ts</code>, schema, service và route tải lên. Xin vé bằng curl rồi PUT một tấm ảnh thật bằng <code>curl --data-binary @anh.jpg</code>.</li>
<li>Tái hiện bảng đo ở mục 6 bằng script của chính bạn: ký mặc định vs <code>signableHeaders</code>.</li>
<li>Kiểm khách không đọc được object trong <code>tmp/</code> của bạn, và URL dùng sau khi hết hạn trả 403.</li>
</ol>
<p><strong>Xong khi:</strong> một tấm ảnh thật tới được <code>tmp/&lt;idCuaBan&gt;/…</code> qua vé, Content-Type hay kích thước khác bị từ chối 403, và bạn chỉ ra được <code>X-Amz-SignedHeaders</code> có chứa <code>content-type</code>.</p>
<p><strong>Thang điểm (10):</strong> MinIO chạy có volume + CORS (2) · script bucket: tmp riêng tư, posts công khai, vòng đời (2) · endpoint cấp vé với khoá do server chọn và giới hạn (3) · tái hiện phép đo chữ ký (2) · kiểm hết hạn/khách (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>7afdc78</code>: <code>apps/api/scripts/kho-chuan-bi.ts</code>, <code>src/lib/storage.ts</code>, <code>src/schemas/upload.schema.ts</code>, <code>src/services/upload.service.ts</code>, <code>src/controllers/upload.controller.ts</code>, route <code>POST /uploads</code>. Mọi lần PUT đều <code>SignatureDoesNotMatch</code> dù đúng tệp? Nguyên nhân hay gặp: <code>curl</code> gửi <code>Content-Type</code> khác (dùng đúng <code>-H "content-type: image/jpeg"</code>), dùng <code>-d</code> thay vì <code>--data-binary</code> (curl bỏ ký tự xuống dòng và làm đổi kích thước), hoặc lệch <code>localhost</code> với <code>127.0.0.1</code> so với host đã ký.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">object storage</span><span class="v">Kho đối tượng: lưu theo bucket + khoá, truy cập qua HTTP (giao thức S3): S3, R2, MinIO.</span></div>
  <div class="kv"><span class="k">presigned URL</span><span class="v">URL mang chữ ký, cho phép một thao tác trên một khoá tới khi hết hạn.</span></div>
  <div class="kv"><span class="k">X-Amz-SignedHeaders</span><span class="v">Các header nằm trong chữ ký; header không có trong danh sách thì đổi thoải mái.</span></div>
  <div class="kv"><span class="k">CORS preflight</span><span class="v">Request OPTIONS của trình duyệt hỏi kho có cho PUT khác origin không.</span></div>
  <div class="kv"><span class="k">lifecycle rule</span><span class="v">Luật phía kho tự xoá (hoặc chuyển) object theo tiền tố và tuổi.</span></div>
  <div class="kv"><span class="k">path-style URL</span><span class="v">host/bucket/key thay vì bucket.host/key.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ảnh không đi xuyên API: API ký, trình duyệt PUT thẳng lên kho.</li>
<li>MinIO cho máy dev (bắt buộc volume, CORS bằng biến môi trường); cùng mã chạy với R2/S3.</li>
<li>Khoá do server chọn trong <code>tmp/</code> riêng tư; chỉ <code>posts/</code> công khai; tmp hết hạn sau một ngày.</li>
<li>Đo thật: SDK mặc định không ký Content-Type — dùng <code>signableHeaders</code>; tắt checksum body rỗng bằng <code>WHEN_REQUIRED</code>.</li>
<li>Chữ ký kiểm header, không kiểm byte; lưu khoá, không lưu URL.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
