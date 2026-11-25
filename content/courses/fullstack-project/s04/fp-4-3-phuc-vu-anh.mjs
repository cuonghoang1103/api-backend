/**
 * 4.3 — Phục vụ và kiểm tra ảnh đã upload (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: sharp 0.35.5 (libvips 8.18.7), MinIO RELEASE.2026-11-16, repo chiase nhánh ch4/bai-viet (7afdc78).
 * Phát hiện thật 24/11: HTML giả .jpg bị magic bytes chặn; tệp "lai" (FF D8 FF + HTML) qua được magic bytes nhưng sharp không giải mã
 * được; bản đầu trả nguyên lỗi libvips (5 dòng) cho client ⇒ sửa thành thông báo ngắn + log; PNG xen kẽ 10000×10000 chỉ 45.584 byte
 * nhưng đỉnh RSS 203 MB, 1,27 s (PNG thường 112 MB/0,36 s; JPEG có Orientation 103 MB/0,25 s — libvips xử lý theo luồng);
 * ảnh điện thoại 1200×800 Orientation=6 có 7 dòng EXIF (GPS, hãng máy) ⇒ ảnh công khai WebP 800×1200, 0 dòng EXIF;
 * ảnh 4000×3000 3,6 MB duyệt ~0,41 s/lần (máy đang tải ~48); xoá bài khi kho sập: 204 sau 0,057 s + log ANH_CAN_DON
 * (lần đầu loi "AggregateError" vì localhost có ::1 và 127.0.0.1 ⇒ đọc e.code = ECONNREFUSED); dọn mồ côi bằng script.
 * Nguồn (GET 200, 24/11/2026): Wikipedia John McAfee (Vice 12/2012, EXIF lộ vị trí); Wired 12/01/2021 (Parler giữ siêu dữ liệu
 * vị trí); OWASP File Upload Cheat Sheet; sharp docs (constructor: limitInputPixels; output: metadata).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const IMAGE_SVC = `import { randomUUID } from 'node:crypto';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { s3, BUCKET } from '../lib/storage.js';
import { HttpError } from '../lib/http-error.js';
import { ANH_TOI_DA } from '../schemas/upload.schema.js';

const DIEM_ANH_TOI_DA = 40_000_000; // 40 triệu điểm ảnh (vd 8000×5000) — chặn "bom giải nén" (tệp nhỏ, giải ra hàng GB RAM)
const CANH_TOI_DA = 1600; // ảnh hiển thị trên feed không cần lớn hơn

const loi = (code: string, message: string) =&gt; new HttpError(400, code, message);

// Nhận dạng bằng MAGIC BYTES (vài byte đầu tệp), không tin Content-Type hay đuôi tệp người dùng khai.
export function nhanDangAnh(b: Uint8Array): 'jpeg' | 'png' | 'webp' | null {
  const ascii = (tu: number, den: number) =&gt; Buffer.from(b.subarray(tu, den)).toString('latin1');
  if (b[0] === 0xff &amp;&amp; b[1] === 0xd8 &amp;&amp; b[2] === 0xff) return 'jpeg';
  if (ascii(0, 8) === '\\x89PNG\\r\\n\\x1a\\n') return 'png';
  if (ascii(0, 4) === 'RIFF' &amp;&amp; ascii(8, 12) === 'WEBP') return 'webp';
  return null;
}

const xoaKhoa = (key: string) =&gt; s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

// Xoá ảnh "cố gắng hết sức": lỗi kho KHÔNG làm hỏng thao tác chính (bài đã xoá rồi) — ghi một dòng log có cấu trúc
// để việc dọn định kỳ (hoặc người trực) tìm lại được khoá cần xoá.
export async function xoaAnh(key: string | null | undefined) {
  if (!key) return;
  try {
    await xoaKhoa(key);
  } catch (e) {
    // "localhost" có hai địa chỉ (::1 và 127.0.0.1) ⇒ kho sập cho ra AggregateError; mã thật nằm ở e.code (ECONNREFUSED)
    const err = e as Error &amp; { code?: string };
    console.error(JSON.stringify({ suKien: 'ANH_CAN_DON', key, loi: err.code ?? err.name }));
  }
}

// Ảnh vừa tải lên vùng tmp/ ⇒ kiểm ⇒ chuẩn hoá ⇒ ghi bản sạch vào posts/ (công khai) ⇒ xoá bản tmp. Trả khoá mới.
export async function duyetAnh(userId: string, keyTam: string): Promise&lt;string&gt; {
  // 1. Khoá phải là vé SERVER đã cấp cho CHÍNH người này — không cho gắn ảnh của người khác / khoá tự bịa.
  if (!new RegExp(\`^tmp/\${userId}/[0-9a-f-]{36}$\`).test(keyTam))
    throw loi('ANH_KHONG_HOP_LE', 'imageKey không phải ảnh bạn vừa tải lên');

  // 2. Ảnh có thật trên kho chưa (client có thể gọi API trước khi PUT xong, hoặc PUT thất bại)?
  const dau = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: keyTam })).catch((e: Error) =&gt; {
    if (e.name === 'NotFound')
      throw loi('ANH_CHUA_TAI_LEN', 'Chưa thấy ảnh trên kho — tải lên xong rồi hãy gửi');
    throw e;
  });
  if ((dau.ContentLength ?? 0) &gt; ANH_TOI_DA) {
    await xoaAnh(keyTam);
    throw loi('ANH_QUA_LON', \`Ảnh tối đa \${ANH_TOI_DA} byte\`);
  }

  // 3. Đọc tệp, nhận dạng bằng byte đầu. Sai ⇒ xoá luôn bản tmp.
  const goc = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: keyTam }));
  const du = await goc.Body!.transformToByteArray();
  if (!nhanDangAnh(du)) {
    await xoaAnh(keyTam);
    throw loi('ANH_SAI_DINH_DANG', 'Chỉ nhận JPEG, PNG hoặc WebP');
  }

  // 4. Giải mã THẬT + mã hoá lại: rotate() xoay theo EXIF Orientation; sharp KHÔNG chép metadata sang ảnh mới
  //    (trừ khi gọi keepMetadata/withMetadata) ⇒ toạ độ GPS, hãng máy… biến mất. Tệp "giả ảnh" không giải mã được ⇒ lỗi.
  let sach: Buffer;
  try {
    sach = await sharp(du, { limitInputPixels: DIEM_ANH_TOI_DA })
      .rotate()
      .resize({ width: CANH_TOI_DA, height: CANH_TOI_DA, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch (e) {
    await xoaAnh(keyTam);
    // Lỗi thư viện (libvips) để trong log máy chủ; client chỉ nhận thông báo ngắn — đừng lộ nội tạng cho người dò.
    const chiTiet = (e as Error).message;
    console.warn(JSON.stringify({ suKien: 'ANH_BI_TU_CHOI', keyTam, chiTiet: chiTiet.split('\\n')[0] }));
    if (chiTiet.includes('pixel limit'))
      throw loi('ANH_QUA_LON', \`Ảnh tối đa \${DIEM_ANH_TOI_DA.toLocaleString('vi-VN')} điểm ảnh\`);
    throw loi('ANH_HONG', 'Tệp không phải ảnh đọc được');
  }

  // 5. Bản sạch vào posts/ với tên mới; nội dung không bao giờ đổi dưới cùng một khoá ⇒ cache "immutable" 1 năm.
  const key = \`posts/\${randomUUID()}.webp\`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: sach,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  await xoaAnh(keyTam);
  return key;
}`;

const TAO_BAI = `export async function taoBai(tacGia: string, { imageKey, ...du }: TaoBai) {
  // Xử lý ảnh TRƯỚC (chậm, có thể lỗi 400) rồi mới ghi CSDL. Ghi CSDL lỗi ⇒ dọn ảnh vừa tạo, không để mồ côi.
  const keyAnh = imageKey ? await duyetAnh(tacGia, imageKey) : null;
  try {
    return raBai(
      await prisma.post.create({ data: { ...du, imageKey: keyAnh, authorId: tacGia }, select: chonBai }),
    );
  } catch (e) {
    await xoaAnh(keyAnh);
    throw e;
  }
}`;

const GAN = `$ curl -s -o /dev/null -w "khách đọc thẳng ảnh tmp/: %{http_code}\\n" localhost:41813/chiase/$KEY
khách đọc thẳng ảnh tmp/: 403
$ curl -s -w "  [HTTP %{http_code}]\\n" $A/posts -H "Authorization: Bearer $BINH" $J -d "{\\"title\\":\\"Lấy ảnh của An\\",\\"body\\":\\"x\\",\\"imageKey\\":\\"$KEY\\"}"
{"error":{"code":"ANH_KHONG_HOP_LE","message":"imageKey không phải ảnh bạn vừa tải lên"}}  [HTTP 400]
$ curl -s $A/posts -H "Authorization: Bearer $AN" $J -d "{\\"title\\":\\"Hồ Gươm sáng nay\\",\\"body\\":\\"Trời đẹp quá!\\",\\"status\\":\\"published\\",\\"imageKey\\":\\"$KEY\\"}" | tee /tmp/fsp-bai.json; echo
{"id":"01a20daf-b23c-7e52-b878-82e0efd36639","title":"Hồ Gươm sáng nay","body":"Trời đẹp quá!","status":"published","createdAt":"2026-11-24T13:12:27.963Z","updatedAt":"2026-11-24T13:12:27.963Z","author":{"id":"01a20da9-f6e4-7dc4-9e4c-4f6480a2e122","displayName":"An Nguyễn"},"imageUrl":"http://localhost:41813/chiase/posts/8e276ebf-882b-47ba-a4ca-8c70cd5ac5a7.webp"}
$ curl -s -o /dev/null -w "ảnh tmp/ sau khi duyệt: %{http_code}\\n" -I localhost:41813/chiase/$KEY
ảnh tmp/ sau khi duyệt: 403`;

const TU_CHOI = `$ head -c 60 gia-anh.jpg; echo; tao "$(tai_len $AN gia-anh.jpg image/jpeg)"
&lt;html&gt;&lt;script&gt;alert(document.cookie)&lt;/script&gt;&lt;/html&gt;
{"error":{"code":"ANH_SAI_DINH_DANG","message":"Chỉ nhận JPEG, PNG hoặc WebP"}}  [HTTP 400]
$ od -An -c -N12 lai.jpg; tao "$(tai_len $AN lai.jpg image/jpeg)"
 377 330 377 340   &lt;   h   t   m   l   &gt;   &lt;   s
{"error":{"code":"ANH_HONG","message":"Tệp không phải ảnh đọc được"}}  [HTTP 400]
$ magick identify -format "%wx%h, " bom.png; stat -c "%s byte" bom.png; tao "$(tai_len $AN bom.png image/png)"
10000x10000, 32396 byte
{"error":{"code":"ANH_QUA_LON","message":"Ảnh tối đa 40.000.000 điểm ảnh"}}  [HTTP 400]
$ tao "tmp/$(node -pe "JSON.parse(Buffer.from(process.env.AN.split(\\".\\")[1],\\"base64url\\")).sub")/0199aaaa-0000-7000-8000-000000000000"   # khoá đúng dạng, chưa PUT
{"error":{"code":"ANH_CHUA_TAI_LEN","message":"Chưa thấy ảnh trên kho — tải lên xong rồi hãy gửi"}}  [HTTP 400]
$ tao "../posts/ai-do.webp"
{"error":{"code":"ANH_KHONG_HOP_LE","message":"imageKey không phải ảnh bạn vừa tải lên"}}  [HTTP 400]`;

const LO_LOI = `$ tao "$(tai_len $AN lai.jpg image/jpeg)"      # bản ĐẦU của duyetAnh: trả nguyên lỗi thư viện
{"error":{"code":"ANH_HONG","message":"Không đọc được ảnh: Input buffer has corrupt header: VipsJpeg: premature end of JPEG image\\nVipsJpeg: JPEG datastream contains no image\\nVipsJpeg: premature end of JPEG image\\nVipsJpeg: JPEG datastream contains no image\\nVipsJpeg: premature end of JPEG image"}}  [HTTP 400]
$ tao "$(tai_len $AN bom.png image/png)"
{"error":{"code":"ANH_HONG","message":"Không đọc được ảnh: Input image exceeds pixel limit"}}  [HTTP 400]`;

const LOG_TU_CHOI = `{"suKien":"ANH_BI_TU_CHOI","keyTam":"tmp/01a20da9-f6e4-7dc4-9e4c-4f6480a2e122/1be42ca6-655a-415c-8ec2-f9459df2498d","chiTiet":"Input buffer has corrupt header: VipsJpeg: premature end of JPEG image"}
{"suKien":"ANH_BI_TU_CHOI","keyTam":"tmp/01a20da9-f6e4-7dc4-9e4c-4f6480a2e122/6f8b09de-be68-4469-8aca-aecae661820a","chiTiet":"Input image exceeds pixel limit"}`;

const BOM = `$ for f in bom.png bom-xoay.jpg bom-xen-ke.png; do /usr/bin/time -f "  (đỉnh RSS cả tiến trình: %M KB)" node do-bom.mjs $f; done
bom.png: 32396 byte ⇒ 0.36 s, RSS +19 MiB
  (đỉnh RSS cả tiến trình: 112424 KB)
bom-xoay.jpg: 1172243 byte ⇒ 0.25 s, RSS +8 MiB
  (đỉnh RSS cả tiến trình: 103252 KB)
bom-xen-ke.png: 45584 byte ⇒ 1.27 s, RSS +13 MiB
  (đỉnh RSS cả tiến trình: 203352 KB)`;

const SACH = `$ npm run -s kho:liet-ke -w apps/api
    6936  posts/8e276ebf-882b-47ba-a4ca-8c70cd5ac5a7.webp
(1 object)
$ curl -sI $URL_ANH | grep -i "^\\(HTTP\\|content-type\\|content-length\\|cache-control\\|etag\\)"
HTTP/1.1 200 OK
Cache-Control: public, max-age=31536000, immutable
Content-Length: 6936
Content-Type: image/webp
ETag: "b4443f708314e5350cb4e1d050e2577c"
$ curl -s $URL_ANH -o /tmp/fsp-tai.webp; magick identify -format "%m %wx%h\\n" /tmp/fsp-tai.webp; magick identify -verbose /tmp/fsp-tai.webp | grep -ci "gps\\|exif:Make\\|exif:Model"
WEBP 800x1200
0
$ magick identify -format "%m %wx%h\\n" dien-thoai.jpg; magick identify -verbose dien-thoai.jpg | grep -ci "gps\\|exif:Make\\|exif:Model"
JPEG 1200x800
7`;

const DTO = `// DTO trả cho client: imageKey (chi tiết lưu trữ) ⇒ imageUrl (thứ client cần). Đổi CDN không đổi hợp đồng API.
const raBai = ({ imageKey, ...b }: DongBai) =&gt; ({ ...b, imageUrl: urlAnh(imageKey) });`;

const DO_THOI_GIAN = `lần 1: POST /posts kèm ảnh 4000×3000 (3,6 MB) → 201 sau 0.412871s
lần 2: POST /posts kèm ảnh 4000×3000 (3,6 MB) → 201 sau 0.410462s
lần 3: POST /posts kèm ảnh 4000×3000 (3,6 MB) → 201 sau 0.401118s
RSS API sau 3 lần: 292 MiB`;

const XOA_BAI = `export async function xoaBai(id: string, nguoiLam: string) {
  try {
    const bai = await prisma.post.delete({ where: { id, authorId: nguoiLam }, select: { imageKey: true } });
    await xoaAnh(bai.imageKey); // CSDL trước, kho sau: kho lỗi chỉ để lại một tệp thừa (có log), không để bài trỏ vào ảnh đã mất
  } catch (e) {
    if (laKhongKhop(e)) throw await loiKhongKhop(id, nguoiLam);
    throw e;
  }
}`;

const DOI_XOA = `$ lk
    6936  posts/8e276ebf-882b-47ba-a4ca-8c70cd5ac5a7.webp
(1 object)
$ curl -s -X PATCH $A/posts/$ID -H "Authorization: Bearer $AN" $J -d "{\\"imageKey\\":\\"$(tai_len $AN meo.jpg image/jpeg)\\"}" | node -pe "JSON.parse(require(\\"fs\\").readFileSync(0)).imageUrl"
http://localhost:41813/chiase/posts/f9b36642-94e8-4be7-bf7e-ac0f9050cd38.webp
$ lk
    7472  posts/f9b36642-94e8-4be7-bf7e-ac0f9050cd38.webp
(1 object)
$ curl -s -o /dev/null -w "xoá bài: %{http_code}\\n" -X DELETE $A/posts/$ID -H "Authorization: Bearer $AN"
xoá bài: 204
$ lk
(0 object)`;

const KHO_SAP = `$ docker stop fsp-minio &gt;/dev/null &amp;&amp; echo "kho đã tắt"
kho đã tắt
$ curl -s -o /dev/null -w "xoá bài khi kho sập: %{http_code} sau %{time_total}s\\n" -X DELETE $A/posts/$ID -H "Authorization: Bearer $AN"
xoá bài khi kho sập: 204 sau 0.057210s
$ curl -s -o /dev/null -w "đọc lại bài: %{http_code}\\n" $A/posts/$ID -H "Authorization: Bearer $AN"
đọc lại bài: 404`;

const LOG_CAN_DON = `{"suKien":"ANH_CAN_DON","key":"posts/affc6560-6aa2-4c2c-880b-ec41e7c68759.webp","loi":"ECONNREFUSED"}`;

const DON_SCRIPT = `// Dọn ảnh mồ côi trong posts/: object không còn dòng nào trong bảng posts trỏ tới (xoá bài lúc kho sập, tiến trình chết
// giữa chừng…). Mặc định CHỈ LIỆT KÊ; thêm --xoa mới xoá thật.  npm run kho:don -w apps/api [-- --xoa]
// Bỏ qua ảnh mới hơn 60 phút (đổi bằng --cu-hon=PHÚT): có thể đang ở giữa "đã ghi ảnh, chưa kịp ghi CSDL" của một request.
import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3, BUCKET } from '../src/lib/storage.js';
import { prisma } from '../src/db/prisma.js';

const XOA = process.argv.includes('--xoa');
const phut = Number(process.argv.find((a) =&gt; a.startsWith('--cu-hon='))?.split('=')[1] ?? 60);
const MOC = Date.now() - phut * 60 * 1000;
const moCoi: string[] = [];
let tong = 0;
let token: string | undefined;
do {
  // Mỗi lần liệt kê tối đa 1000 object ⇒ đi từng trang bằng ContinuationToken
  const trang = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: 'posts/', ContinuationToken: token }),
  );
  const ds = (trang.Contents ?? []).filter((o) =&gt; o.Key &amp;&amp; (o.LastModified?.getTime() ?? 0) &lt; MOC);
  tong += trang.KeyCount ?? 0;
  const coDung = await prisma.post.findMany({
    where: { imageKey: { in: ds.map((o) =&gt; o.Key!) } },
    select: { imageKey: true },
  });
  const dung = new Set(coDung.map((p) =&gt; p.imageKey));
  moCoi.push(...ds.map((o) =&gt; o.Key!).filter((k) =&gt; !dung.has(k)));
  token = trang.NextContinuationToken;
} while (token);

console.log(\`posts/: \${tong} object, \${moCoi.length} mồ côi (cũ hơn \${phut} phút)\`);
for (const k of moCoi) console.log(\`  \${k}\`);
if (XOA &amp;&amp; moCoi.length) {
  for (let i = 0; i &lt; moCoi.length; i += 1000) {
    const phan = moCoi.slice(i, i + 1000).map((Key) =&gt; ({ Key }));
    await s3.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: phan } }));
  }
  console.log(\`đã xoá \${moCoi.length}\`);
} else if (moCoi.length) console.log('(chỉ liệt kê — chạy lại với --xoa để xoá)');
await prisma.$disconnect();`;

const DON = `$ npm run -s kho:don -w apps/api
posts/: 1 object, 0 mồ côi (cũ hơn 60 phút)
$ npm run -s kho:don -w apps/api -- --cu-hon=0
posts/: 1 object, 1 mồ côi (cũ hơn 0 phút)
  posts/c14b3746-c2f7-4b49-92e4-1a867e0949fd.webp
(chỉ liệt kê — chạy lại với --xoa để xoá)
$ npm run -s kho:don -w apps/api -- --cu-hon=0 --xoa
posts/: 1 object, 1 mồ côi (cũ hơn 0 phút)
  posts/c14b3746-c2f7-4b49-92e4-1a867e0949fd.webp
đã xoá 1
$ npm run -s kho:liet-ke -w apps/api posts/
(0 object)`;

const VONG_DOI = `vòng đời đọc lại: [{"Status":"Enabled","Expiration":{"Days":1},"ID":"xoa-tmp","Filter":{"Prefix":"tmp/"}}]`;

const MA_DO_BOM = `// do-bom.mjs — đo một "bom giải nén" KHÔNG có giới hạn điểm ảnh, cùng chuỗi xử lý như duyetAnh
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const tep = readFileSync(process.argv[2]);
const truoc = process.memoryUsage().rss;
const t0 = performance.now();
await sharp(tep, { limitInputPixels: false }).rotate().resize(1600, 1600, { fit: 'inside' }).webp().toBuffer();
console.log(\`\${process.argv[2]}: \${tep.length} byte ⇒ \${((performance.now() - t0) / 1000).toFixed(2)} s, RSS +\${((process.memoryUsage().rss - truoc) / 2 ** 20).toFixed(0)} MiB\`);`;

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-10-3-kiem-file-that', title: 'Node.js 10.3 — Đừng tin file người dùng: magic bytes, file lai và bom', sub: 'Bài khái niệm gốc, nhiều kiểu tệp hơn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-10-4-phuc-vu-media-cache', title: 'Node.js 10.4 — Phục vụ media trở lại: định dạng, cache và CDN', sub: 'Cache-Control, ETag và CDN cho ảnh.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-3-1-three-urls', title: 'Object Storage 3.1 — Ba loại URL: API, CDN, signed', sub: 'Vì sao URL công khai khác URL tải lên.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-6-3-orphans', title: 'Object Storage 6.3 — Object mồ côi', sub: 'Dòng không có object, object không có dòng — chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-3-2-cache', title: 'Object Storage 3.2 — Cache-Control theo content type', sub: 'immutable, max-age và khi nào không được dùng.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📰', 'Wikipedia — John McAfee', '12/2012: tạp chí Vice đăng ảnh còn nguyên siêu dữ liệu vị trí EXIF ⇒ lộ chỗ ông đang ẩn ở Guatemala.', 'https://en.wikipedia.org/wiki/John_McAfee'),
  nguon('📰', 'Wired — An Absurdly Basic Bug Let Anyone Grab All of Parler\'s Data (12/01/2021)', 'Ảnh/video tải lên Parler vẫn giữ siêu dữ liệu vị trí khi bị cào.', 'https://www.wired.com/story/parler-hack-data-public-posts-images-video/'),
  nguon('📘', 'OWASP — File Upload Cheat Sheet', 'Danh sách cho phép, kiểm nội dung thật, đổi tên tệp, giới hạn kích thước, lưu ngoài web root.', 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html'),
  nguon('📘', 'sharp — Constructor (limitInputPixels)', 'Mặc định 268.402.689 điểm ảnh (0x3FFF × 0x3FFF); false = không giới hạn.', 'https://sharp.pixelplumbing.com/api-constructor'),
  nguon('📘', 'sharp — Output options (metadata)', 'Mặc định ảnh đầu ra KHÔNG mang EXIF/ICC/XMP của ảnh vào, trừ khi gọi keepMetadata/withMetadata.', 'https://sharp.pixelplumbing.com/api-output'),
].join('\n');

const MERMAID = `flowchart TD
  K["imageKey từ client"] --> P{"Đúng dạng tmp/(id của bạn)/(uuid)?"}
  P -->|không| E1["400 ANH_KHONG_HOP_LE"]
  P -->|có| H{"HEAD: có trên kho? ≤ 5 MiB?"}
  H -->|chưa có| E2["400 ANH_CHUA_TAI_LEN"]
  H -->|quá lớn| E3["400 ANH_QUA_LON + xoá tmp"]
  H -->|ổn| M{"Magic bytes: JPEG / PNG / WebP?"}
  M -->|không| E4["400 ANH_SAI_DINH_DANG + xoá tmp"]
  M -->|có| S{"sharp giải mã được, ≤ 40 triệu điểm ảnh?"}
  S -->|không| E5["400 ANH_HONG / ANH_QUA_LON + xoá tmp"]
  S -->|có| W["xoay theo EXIF, cạnh ≤ 1600, WebP, BỎ metadata"]
  W --> O["PUT posts/(uuid mới).webp (công khai, immutable) rồi xoá tmp"]`;

export default {
  title: '4.3 — Serving and validating uploaded media|||4.3 — Phục vụ và kiểm tra ảnh đã upload',
  slug: 'fp-4-3-phuc-vu-anh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ảnh vừa tải lên chưa được tin: kiểm khoá thuộc đúng người, HEAD xem có thật + kích thước, magic bytes, giải mã thật bằng sharp có giới hạn điểm ảnh (đo bom giải nén 45 KB ⇒ 203 MB), xoay theo EXIF và BỎ GPS rồi mới đưa vào posts/ công khai; base URL CDN + Cache-Control immutable; xoá bài thì dọn ảnh, kho sập thì log và dọn ảnh mồ côi bằng script; bẫy thật: lộ lỗi libvips cho client — kèm vụ John McAfee 2012 và Parler 2021.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Media</span>
<h2>An uploaded file is a claim. Check it, clean it, then publish it.</h2>
<p class="lead">After lesson 4.2 a file sits in the private <code>tmp/</code> area, and the client says "this is a JPEG photo". This lesson is the gate between that claim and a public URL: make sure the file belongs to the caller and really exists, look at its bytes, decode it with a pixel budget, rotate it, strip the location data a phone hides in every photo, and only then write a clean copy under <code>posts/</code>. Then we serve it with the right cache headers, and make sure deleting a post does not leave its image behind — even when the storage is down.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. The gate: <code>duyetAnh</code></h3>
<pre><code class="language-ts">${IMAGE_SVC}</code></pre>
<p>It runs when a post is created or its image is changed — before the database row is written, so a post can never point to an image that does not exist. The order is deliberate: cheap checks first (a regex, a <code>HEAD</code> request), expensive work last (download + decode). Every rejection after the file exists also deletes it from <code>tmp/</code>.</p>
<pre><code class="language-ts">${TAO_BAI}</code></pre>

<h3>2. Six ways to send a bad image — all refused</h3>
<div class="out">${GAN}</div>
<div class="out">${TU_CHOI}</div>
<p>Line by line: an HTML page renamed <code>.jpg</code> fails the <strong>magic bytes</strong> (the first bytes of a real JPEG are <code>FF D8 FF</code>). The "hybrid" file starts with exactly those bytes and then contains HTML — it passes the magic-bytes check, which is why we also <strong>decode</strong> the image for real: libvips finds no image data. The 10000×10000 PNG is refused by the pixel budget (next section). A well-formed key that was never uploaded is caught by <code>HEAD</code>. A key with <code>../</code>, or Bình using An's key, fails the regex: only tickets the server issued <em>to you</em> can be attached.</p>

<h3>3. The trap: telling the attacker what your library said</h3>
<div class="out">${LO_LOI}</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — echoing library errors to the client.</strong> The first version put <code>e.message</code> in the response: five lines naming libvips and its JPEG decoder. That tells a scanner exactly which library (and roughly which version) to target. The fixed version answers with a short code and keeps the detail in the server log as one JSON line:</p></div>
<div class="out">${LOG_TU_CHOI}</div>

<h3>4. Decompression bombs: measured, not imagined</h3>
<p>A "bomb" is a small file that decodes into a huge image. We built three 10000×10000 images (100 million pixels) and ran them through the same pipeline <em>without</em> a pixel limit:</p>
<pre><code class="language-js">${MA_DO_BOM}</code></pre>
<div class="out">${BOM}</div>
<p>Honest results. libvips is very good: for a normal PNG and a JPEG it processes the image in a stream and stays near 100 MB. The <strong>interlaced PNG</strong> is the real bomb: 45,584 bytes on disk, 203 MB peak memory and 1.27 s of CPU — an amplification of about 4,500×, because an interlaced PNG cannot be decoded line by line. Twenty such uploads at once would ask a 2 GB VPS for 4 GB. sharp's default limit is 268 million pixels; ChiaSe sets 40 million: a 12-megapixel (4000×3000) photo fits with a wide margin, a 48-megapixel original (8000×6000) is refused — a social feed can live with that. Pillow, the Python library we used to create the test files, warned on its own at 89 million pixels: different libraries, different defaults — always set yours explicitly.</p>

<h3>5. EXIF: the location every phone writes into every photo</h3>
<div class="out">${SACH}</div>
<p>The test photo was 1200×800 with <code>Orientation = 6</code> (the phone was held vertically) and seven EXIF lines including GPS coordinates and the phone model. The public image is 800×1200 — <code>rotate()</code> applied the orientation for real, so browsers that ignore EXIF still show it upright — and has <strong>zero</strong> EXIF lines. sharp does not copy metadata to the output unless you call <code>keepMetadata()</code>/<code>withMetadata()</code>; re-encoding is what removes it. The public file is a 6,936-byte WebP instead of a 30 KB JPEG.</p>

<h3>🕵️ Hacker's corner — John McAfee (2012) and Parler (2021)</h3>
<p>In December 2012 John McAfee was hiding from police in Belize. Journalists from Vice travelled with him and posted a photo; the photo still carried its EXIF geolocation, which placed him at a resort in Guatemala (Wikipedia, "John McAfee"). One forgotten metadata strip ended a manhunt. Nine years later Wired reported that the images and videos scraped from Parler in January 2021 still contained location metadata — so the archive could be mapped. Every phone photo a ChiaSe user posts may contain their home coordinates; the gate above is what stands between that and the public internet.</p>

<h3>6. Serving: base URL, CDN and cache</h3>
<pre><code class="language-ts">${DTO}</code></pre>
<p>The response has <code>imageUrl</code>, never <code>imageKey</code>: the key is a storage detail, the URL is what the client needs (Spring Boot calls this a DTO — lesson 4.2 of that course). The public file is served with <code>Cache-Control: public, max-age=31536000, immutable</code> (output of section 5). Because every processed image gets a <strong>new random key</strong> and is never overwritten, its content under that URL can never change, so browsers and CDNs may keep it for a year without asking again. Changing a post's image creates a new key and deletes the old object — no stale cache is possible. In Chapter 11, <code>MEDIA_BASE_URL</code> becomes the R2 custom domain behind Cloudflare's CDN; not a line of code changes.</p>
<p>The cost of the gate on a real-size photo (4000×3000, 3.6 MB), measured while this machine was under heavy load from other jobs:</p>
<div class="out">${DO_THOI_GIAN}</div>
<p>About 0.4 s per post. For ChiaSe v1 that is acceptable inside the request. Large platforms move this work to a queue and a worker process so the request returns immediately — a design you can explain in an interview, and add when numbers demand it.</p>

<h3>7. Deleting: database first, storage second, logs for the gap</h3>
<pre><code class="language-ts">${XOA_BAI}</code></pre>
<div class="out">${DOI_XOA}</div>
<p>Replacing the image deleted the old object; deleting the post deleted the new one — <code>posts/</code> is empty again. Why database first? If the storage call fails, the worst case is an unused file (costs a few cents); the opposite order could leave a post pointing at an image that no longer exists (a broken page for every reader). So what happens when the storage is down?</p>
<div class="out">${KHO_SAP}</div>
<div class="out">${LOG_CAN_DON}</div>
<p>The user got 204 in 57 ms; the post is gone; the server logged one structured line with the key and the cause. (The first version logged <code>"loi":"AggregateError"</code> — <code>localhost</code> resolves to both <code>::1</code> and <code>127.0.0.1</code>, Node tried both and wrapped the two refusals; the useful code is in <code>e.code</code>.) Those leftovers — plus any image processed by a request that died before writing its row — are found by a cleanup script:</p>
<pre><code class="language-ts">${DON_SCRIPT}</code></pre>
<div class="out">${DON}</div>
<p>It only lists by default, ignores objects younger than 60 minutes (a request may be between "image written" and "row written"), and deletes in batches of 1,000. Abandoned <code>tmp/</code> uploads need no script: the lifecycle rule from 4.2 handles them, and reading it back confirms the storage really stored it:</p>
<div class="out">${VONG_DOI}</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">owner</span><span class="lz-d">key must be tmp/&lt;caller id&gt;/&lt;uuid&gt;</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">exists</span><span class="lz-d">HEAD: present and ≤ 5 MiB, before any row is written</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">is image</span><span class="lz-d">magic bytes + real decode with a 40 M pixel budget</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">clean</span><span class="lz-d">rotate, resize ≤ 1600, WebP, no EXIF/GPS ⇒ posts/&lt;new uuid&gt;.webp</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">serve</span><span class="lz-d">imageUrl = MEDIA_BASE_URL + key, Cache-Control immutable 1 year</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">delete</span><span class="lz-d">row first, object second; failure ⇒ ANH_CAN_DON log + kho:don</span></div>
</div>

<h3>In everyday life</h3>
<p>A library accepting donated books does not shelve a box because the label says "novels". Someone opens it, checks every item is a book, removes the previous owner's name and address from the first page, puts a new library barcode on it, and only then places it on the public shelf. If a book is withdrawn, the catalogue entry goes first; a book still on a shelf without a catalogue entry is found at the yearly stock-take.</p>

<h3>On a real job</h3>
<p>Typical OJT tickets: "user photos appear sideways on some phones" (EXIF orientation not applied — <code>rotate()</code>), "the storage bill keeps growing although users delete posts" (no cleanup, no lifecycle rule), "security scan: uploaded file served as text/html" (content type trusted from the client). You now know where each one lives in the code — and the Checkpoint 4 script checks the EXIF and cleanup ones automatically.</p>

${spring(false, 'In Spring Boot the gate is the same service method: check the key prefix against the authenticated user, <code>headObject</code>, read the first bytes, decode and re-encode with an image library (for example Thumbnailator or a libvips binding), then <code>putObject</code> to the public prefix — and the response DTO exposes <code>imageUrl</code>, not the key.', [
  ['sb-4-2-dto', 'Spring Boot 4.2 — DTOs: why not return the entity'],
  ['sb-10-2-idor', 'Spring Boot 10.2 — IDOR (an image key that belongs to someone else)'],
  ['sb-3-7-profile-config', 'Spring Boot 3.7 — Profiles and typed configuration (MEDIA_BASE_URL)'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you validate an uploaded image?"</strong> — Allow-list of types, size limit, magic bytes, then actually decode it (with a pixel limit) and re-encode; never trust Content-Type or extension.</li>
<li><strong>"What is a decompression bomb?"</strong> — A small file that expands to a huge image in memory; defend with a pixel limit before decoding.</li>
<li><strong>"Why strip EXIF?"</strong> — It may contain GPS coordinates, device and time — a privacy leak (McAfee 2012, Parler 2021).</li>
<li><strong>"Delete the DB row or the file first?"</strong> — Row first: a leftover file is cheap and can be cleaned; a row pointing to a missing file breaks pages.</li>
<li><strong>"How do you make images cacheable forever?"</strong> — Never overwrite: new content gets a new key, so <code>Cache-Control: immutable, max-age=31536000</code> is safe.</li>
</ol>

<h3>🧪 Lab 4.3 (90 minutes)</h3>
<div class="callout ok">
<ol>
<li>Install <code>sharp</code> (pinned) and write <code>image.service.ts</code>: <code>nhanDangAnh</code>, <code>duyetAnh</code>, <code>xoaAnh</code>. Wire it into create, update and delete of posts.</li>
<li>Make the six bad files of section 2 yourself (an HTML page, a hybrid with <code>printf '\\xff\\xd8\\xff\\xe0'</code>, a 10000×10000 PNG with ImageMagick…) and get six different 400 codes.</li>
<li>Reproduce the bomb measurement with and without <code>limitInputPixels</code>; write down your own numbers.</li>
<li>Take a real photo with your phone (location on), post it through the API, download <code>imageUrl</code> and show the EXIF is gone (<code>magick identify -verbose</code> or any EXIF viewer).</li>
<li>Stop MinIO, delete a post, find the <code>ANH_CAN_DON</code> line, start MinIO, and clean the orphan with <code>kho:don</code>.</li>
</ol>
<p><strong>Done when:</strong> no file reaches <code>posts/</code> without being decoded and re-encoded, your phone photo is public without GPS, and deleting posts leaves <code>posts/</code> empty (immediately or after <code>kho:don</code>).</p>
<p><strong>Rubric (10):</strong> ownership + HEAD before the row (2) · magic bytes + real decode + pixel limit (3) · EXIF stripped, orientation applied (2) · no library error leaked (1) · delete order + orphan cleanup (2).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>7afdc78</code>: <code>src/services/image.service.ts</code>, the image parts of <code>src/services/post.service.ts</code>, <code>scripts/don-anh-mo-coi.ts</code>, <code>scripts/kho-liet-ke.ts</code>. If your phone photo appears sideways, you forgot <code>.rotate()</code> (with no argument it reads EXIF Orientation). If the EXIF is still there, check you did not call <code>withMetadata()</code> — some tutorials add it "to keep colours". If <code>HEAD</code> on a missing key throws something other than <code>NotFound</code>, print <code>e.name</code>: some S3-compatible services answer 403 for a missing key when the caller lacks <code>ListBucket</code> permission.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">magic bytes</span><span class="v">Fixed bytes at the start of a file format (JPEG FF D8 FF, PNG 89 50 4E 47…).</span></div>
  <div class="kv"><span class="k">polyglot / hybrid file</span><span class="v">A file that is valid (or looks valid) as two formats at once.</span></div>
  <div class="kv"><span class="k">decompression bomb</span><span class="v">Small file, huge decoded size; stopped by a pixel limit.</span></div>
  <div class="kv"><span class="k">EXIF</span><span class="v">Metadata inside photos: orientation, device, time, GPS.</span></div>
  <div class="kv"><span class="k">immutable</span><span class="v">Cache-Control directive: this URL's content never changes; do not revalidate.</span></div>
  <div class="kv"><span class="k">orphan object</span><span class="v">A stored file no database row points to.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The gate runs before the row is written: owner key → HEAD → magic bytes → real decode with a pixel budget.</li>
<li>Re-encoding with sharp applies orientation and removes EXIF/GPS; the clean copy gets a new key in <code>posts/</code>.</li>
<li>Measured bomb: 45 KB interlaced PNG ⇒ 203 MB, 1.27 s; limit 40 M pixels.</li>
<li>Errors to the client are short codes; library details stay in the log.</li>
<li><code>imageUrl = MEDIA_BASE_URL + key</code>, cached a year; delete row first, log and clean orphans.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Ảnh</span>
<h2>Tệp vừa tải lên chỉ là một lời khai. Kiểm nó, làm sạch nó, rồi mới công khai.</h2>
<p class="lead">Sau bài 4.2, tệp nằm trong vùng riêng tư <code>tmp/</code>, và client nói "đây là ảnh JPEG". Bài này là cánh cổng giữa lời khai đó và một URL công khai: chắc chắn tệp thuộc về người gọi và có thật, nhìn byte của nó, giải mã với hạn mức điểm ảnh, xoay đúng chiều, xoá dữ liệu vị trí mà điện thoại giấu trong mọi tấm ảnh, rồi mới ghi một bản sạch vào <code>posts/</code>. Sau đó ta phục vụ nó với header cache đúng, và bảo đảm xoá bài không bỏ lại ảnh — kể cả khi kho đang sập.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Cánh cổng: <code>duyetAnh</code></h3>
<pre><code class="language-ts">${IMAGE_SVC}</code></pre>
<p>Hàm chạy khi tạo bài hoặc đổi ảnh của bài — TRƯỚC khi ghi dòng CSDL, nên một bài không bao giờ trỏ vào ảnh không tồn tại. Thứ tự là có chủ ý: kiểm rẻ trước (một regex, một request <code>HEAD</code>), việc đắt để cuối (tải về + giải mã). Mọi lần từ chối sau khi tệp đã có trên kho đều xoá luôn nó khỏi <code>tmp/</code>.</p>
<pre><code class="language-ts">${TAO_BAI}</code></pre>

<h3>2. Sáu cách gửi ảnh xấu — đều bị từ chối</h3>
<div class="out">${GAN}</div>
<div class="out">${TU_CHOI}</div>
<p>Từng dòng: một trang HTML đổi tên thành <code>.jpg</code> trượt <strong>magic bytes</strong> (vài byte đầu của JPEG thật là <code>FF D8 FF</code>). Tệp "lai" mở đầu đúng bằng các byte đó rồi chứa HTML — nó qua được bước magic bytes, đó là lý do ta còn <strong>giải mã thật</strong>: libvips không tìm thấy dữ liệu ảnh. PNG 10000×10000 bị hạn mức điểm ảnh chặn (mục sau). Một khoá đúng dạng nhưng chưa từng tải lên bị <code>HEAD</code> bắt. Khoá có <code>../</code>, hay Bình dùng khoá của An, trượt regex: chỉ những vé server đã cấp <em>cho chính bạn</em> mới gắn được vào bài.</p>

<h3>3. Cái bẫy: kể cho kẻ tấn công nghe thư viện của bạn nói gì</h3>
<div class="out">${LO_LOI}</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — trả nguyên lỗi thư viện cho client.</strong> Bản đầu đặt <code>e.message</code> vào response: năm dòng nêu tên libvips và bộ giải mã JPEG của nó. Thế là chỉ cho máy quét biết chính xác nhắm vào thư viện nào (và đại khái phiên bản nào). Bản đã sửa trả một mã ngắn và giữ chi tiết trong log máy chủ, một dòng JSON:</p></div>
<div class="out">${LOG_TU_CHOI}</div>

<h3>4. Bom giải nén: đo thật, không tưởng tượng</h3>
<p>"Bom" là tệp nhỏ giải mã ra một ảnh khổng lồ. Ta dựng ba ảnh 10000×10000 (100 triệu điểm ảnh) và cho chạy qua đúng chuỗi xử lý <em>không</em> có giới hạn điểm ảnh:</p>
<pre><code class="language-js">${MA_DO_BOM}</code></pre>
<div class="out">${BOM}</div>
<p>Kết quả thật thà. libvips rất giỏi: với PNG thường và JPEG nó xử lý theo luồng và chỉ quanh 100 MB. <strong>PNG xen kẽ (interlaced)</strong> mới là quả bom thật: 45.584 byte trên đĩa, đỉnh 203 MB bộ nhớ và 1,27 giây CPU — khuếch đại khoảng 4.500 lần, vì PNG xen kẽ không giải mã được từng dòng một. Hai mươi lần tải lên như thế cùng lúc sẽ đòi một VPS 2 GB nhả ra 4 GB. Giới hạn mặc định của sharp là 268 triệu điểm ảnh; ChiaSe đặt 40 triệu: ảnh 12 megapixel (4000×3000) lọt thoải mái, ảnh gốc 48 megapixel (8000×6000) bị từ chối — một feed mạng xã hội sống tốt với điều đó. Pillow, thư viện Python ta dùng để tạo tệp thử, tự cảnh báo ở 89 triệu điểm ảnh: thư viện khác nhau, mặc định khác nhau — luôn tự đặt giới hạn của mình cho rõ.</p>

<h3>5. EXIF: vị trí mà mọi điện thoại ghi vào mọi tấm ảnh</h3>
<div class="out">${SACH}</div>
<p>Ảnh thử 1200×800 có <code>Orientation = 6</code> (điện thoại cầm dọc) và bảy dòng EXIF gồm toạ độ GPS và đời máy. Ảnh công khai là 800×1200 — <code>rotate()</code> đã xoay thật, nên trình duyệt bỏ qua EXIF vẫn hiện đúng chiều — và có <strong>không</strong> dòng EXIF nào. sharp không chép metadata sang ảnh đầu ra trừ khi bạn gọi <code>keepMetadata()</code>/<code>withMetadata()</code>; chính việc mã hoá lại là thứ xoá nó. Tệp công khai là WebP 6.936 byte thay vì JPEG 30 KB.</p>

<h3>🕵️ Góc hacker — John McAfee (2012) và Parler (2021)</h3>
<p>Tháng 12/2012, John McAfee đang trốn cảnh sát Belize. Phóng viên tạp chí Vice đi cùng ông và đăng một tấm ảnh; tấm ảnh vẫn mang nguyên toạ độ EXIF, chỉ ra ông đang ở một khu nghỉ dưỡng tại Guatemala (Wikipedia, "John McAfee"). Một lần quên xoá metadata kết thúc cả cuộc truy lùng. Chín năm sau, Wired đưa tin ảnh và video cào từ Parler tháng 01/2021 vẫn chứa siêu dữ liệu vị trí — nên cả kho lưu trữ vẽ lên bản đồ được. Mỗi tấm ảnh điện thoại người dùng ChiaSe đăng có thể chứa toạ độ nhà họ; cánh cổng ở trên là thứ đứng giữa điều đó và internet công khai.</p>

<h3>6. Phục vụ: base URL, CDN và cache</h3>
<pre><code class="language-ts">${DTO}</code></pre>
<p>Response có <code>imageUrl</code>, không bao giờ có <code>imageKey</code>: khoá là chi tiết lưu trữ, URL mới là thứ client cần (Spring Boot gọi đây là DTO — bài 4.2 của khoá đó). Header của tệp công khai nằm trong output mục 5: <code>Cache-Control: public, max-age=31536000, immutable</code>. Vì mỗi ảnh đã xử lý nhận một <strong>khoá ngẫu nhiên mới</strong> và không bao giờ bị ghi đè, nội dung dưới URL đó không bao giờ đổi, nên trình duyệt và CDN được giữ nó cả năm không cần hỏi lại. Đổi ảnh của bài là tạo khoá mới và xoá object cũ — không thể có cache cũ. Ở Chương 11, <code>MEDIA_BASE_URL</code> thành tên miền riêng của R2 nằm sau CDN của Cloudflare; không dòng mã nào phải đổi.</p>
<p>Cái giá của cánh cổng với một tấm ảnh cỡ thật (4000×3000, 3,6 MB), đo trong lúc máy này đang gánh nặng từ các việc khác:</p>
<div class="out">${DO_THOI_GIAN}</div>
<p>Khoảng 0,4 giây mỗi bài. Với ChiaSe v1, chấp nhận được ngay trong request. Các nền tảng lớn chuyển việc này sang hàng đợi và một tiến trình worker để request trả về ngay — một thiết kế bạn giải thích được khi phỏng vấn, và thêm vào khi số liệu đòi hỏi.</p>

<h3>7. Xoá: CSDL trước, kho sau, log cho khoảng hở</h3>
<pre><code class="language-ts">${XOA_BAI}</code></pre>
<div class="out">${DOI_XOA}</div>
<p>Đổi ảnh đã xoá object cũ; xoá bài đã xoá object mới — <code>posts/</code> lại trống. Sao CSDL trước? Nếu gọi kho thất bại, tệ nhất là một tệp thừa (tốn vài xu); thứ tự ngược lại có thể để một bài trỏ vào ảnh đã mất (trang hỏng cho mọi người đọc). Vậy kho sập thì sao?</p>
<div class="out">${KHO_SAP}</div>
<div class="out">${LOG_CAN_DON}</div>
<p>Người dùng nhận 204 sau 57 ms; bài đã mất; máy chủ ghi một dòng có cấu trúc kèm khoá và nguyên nhân. (Bản đầu ghi <code>"loi":"AggregateError"</code> — <code>localhost</code> phân giải ra cả <code>::1</code> lẫn <code>127.0.0.1</code>, Node thử cả hai rồi gói hai lần bị từ chối lại; mã hữu ích nằm ở <code>e.code</code>.) Những tệp sót lại đó — cộng với ảnh đã xử lý bởi một request chết trước khi kịp ghi dòng — được tìm bằng một script dọn:</p>
<pre><code class="language-ts">${DON_SCRIPT}</code></pre>
<div class="out">${DON}</div>
<p>Mặc định nó chỉ liệt kê, bỏ qua object mới hơn 60 phút (một request có thể đang ở giữa "đã ghi ảnh" và "đã ghi dòng"), và xoá theo lô 1.000. Ảnh <code>tmp/</code> bị bỏ ngang không cần script: luật vòng đời ở bài 4.2 lo, và đọc lại luật cho thấy kho thật sự đã lưu nó:</p>
<div class="out">${VONG_DOI}</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">chủ</span><span class="lz-d">khoá phải là tmp/&lt;id người gọi&gt;/&lt;uuid&gt;</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">có thật</span><span class="lz-d">HEAD: có mặt và ≤ 5 MiB, trước khi ghi dòng nào</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">là ảnh</span><span class="lz-d">magic bytes + giải mã thật với hạn mức 40 triệu điểm ảnh</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">làm sạch</span><span class="lz-d">xoay, thu ≤ 1600, WebP, không EXIF/GPS ⇒ posts/&lt;uuid mới&gt;.webp</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">phục vụ</span><span class="lz-d">imageUrl = MEDIA_BASE_URL + khoá, Cache-Control immutable 1 năm</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">xoá</span><span class="lz-d">dòng trước, object sau; lỗi ⇒ log ANH_CAN_DON + kho:don</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>Thư viện nhận sách quyên góp không xếp cả thùng lên kệ chỉ vì nhãn ghi "tiểu thuyết". Có người mở ra, kiểm từng cuốn đúng là sách, xoá tên và địa chỉ chủ cũ ở trang đầu, dán mã vạch mới của thư viện, rồi mới đặt lên kệ công cộng. Nếu rút một cuốn khỏi kho, thẻ mục lục bỏ trước; cuốn nào còn trên kệ mà không có thẻ sẽ được tìm ra ở đợt kiểm kê hằng năm.</p>

<h3>Đi làm thật</h3>
<p>Ticket OJT điển hình: "ảnh người dùng bị nằm ngang trên vài điện thoại" (chưa áp Orientation của EXIF — <code>rotate()</code>), "hoá đơn kho cứ tăng dù người dùng xoá bài" (không dọn, không có luật vòng đời), "quét bảo mật: tệp tải lên được trả về dạng text/html" (tin Content-Type từ client). Giờ bạn biết mỗi cái nằm ở đâu trong mã — và script Checkpoint 4 tự kiểm phần EXIF và phần dọn.</p>

${spring(false, 'Trong Spring Boot cánh cổng là cùng một phương thức service: so tiền tố khoá với người dùng đã xác thực, <code>headObject</code>, đọc vài byte đầu, giải mã và mã hoá lại bằng một thư viện ảnh (ví dụ Thumbnailator hoặc một binding libvips), rồi <code>putObject</code> vào tiền tố công khai — và DTO trả về có <code>imageUrl</code>, không có khoá.', [
  ['sb-4-2-dto', 'Spring Boot 4.2 — DTO: vì sao không trả thẳng entity'],
  ['sb-10-2-idor', 'Spring Boot 10.2 — IDOR (khoá ảnh thuộc về người khác)'],
  ['sb-3-7-profile-config', 'Spring Boot 3.7 — Profile và cấu hình có kiểu (MEDIA_BASE_URL)'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn kiểm một ảnh tải lên thế nào?"</strong> — Danh sách loại cho phép, giới hạn kích thước, magic bytes, rồi giải mã thật (có giới hạn điểm ảnh) và mã hoá lại; không bao giờ tin Content-Type hay đuôi tệp.</li>
<li><strong>"Bom giải nén là gì?"</strong> — Tệp nhỏ bung ra thành ảnh khổng lồ trong bộ nhớ; chặn bằng giới hạn điểm ảnh trước khi giải mã.</li>
<li><strong>"Sao phải xoá EXIF?"</strong> — Nó có thể chứa toạ độ GPS, thiết bị, thời gian — rò rỉ riêng tư (McAfee 2012, Parler 2021).</li>
<li><strong>"Xoá dòng CSDL hay xoá tệp trước?"</strong> — Dòng trước: tệp thừa thì rẻ và dọn được; dòng trỏ vào tệp đã mất thì làm hỏng trang.</li>
<li><strong>"Làm sao cho ảnh được cache mãi mãi?"</strong> — Không bao giờ ghi đè: nội dung mới có khoá mới, nên <code>Cache-Control: immutable, max-age=31536000</code> là an toàn.</li>
</ol>

<h3>🧪 Lab 4.3 (90 phút)</h3>
<div class="callout ok">
<ol>
<li>Cài <code>sharp</code> (ghim bản) và viết <code>image.service.ts</code>: <code>nhanDangAnh</code>, <code>duyetAnh</code>, <code>xoaAnh</code>. Nối vào tạo, sửa và xoá bài.</li>
<li>Tự làm sáu tệp xấu ở mục 2 (một trang HTML, một tệp lai bằng <code>printf '\\xff\\xd8\\xff\\xe0'</code>, một PNG 10000×10000 bằng ImageMagick…) và nhận đủ sáu mã 400 khác nhau.</li>
<li>Tái hiện phép đo bom có và không có <code>limitInputPixels</code>; ghi lại số của chính bạn.</li>
<li>Chụp một tấm ảnh thật bằng điện thoại (bật vị trí), đăng qua API, tải <code>imageUrl</code> về và chỉ ra EXIF đã mất (<code>magick identify -verbose</code> hoặc trình xem EXIF bất kỳ).</li>
<li>Tắt MinIO, xoá một bài, tìm dòng <code>ANH_CAN_DON</code>, bật lại MinIO, dọn ảnh mồ côi bằng <code>kho:don</code>.</li>
</ol>
<p><strong>Xong khi:</strong> không tệp nào tới được <code>posts/</code> mà chưa được giải mã và mã hoá lại, ảnh điện thoại của bạn công khai mà không còn GPS, và xoá bài để lại <code>posts/</code> trống (ngay lập tức hoặc sau <code>kho:don</code>).</p>
<p><strong>Thang điểm (10):</strong> kiểm chủ khoá + HEAD trước khi ghi dòng (2) · magic bytes + giải mã thật + giới hạn điểm ảnh (3) · bỏ EXIF, xoay đúng chiều (2) · không lộ lỗi thư viện (1) · thứ tự xoá + dọn mồ côi (2).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>7afdc78</code>: <code>src/services/image.service.ts</code>, phần ảnh trong <code>src/services/post.service.ts</code>, <code>scripts/don-anh-mo-coi.ts</code>, <code>scripts/kho-liet-ke.ts</code>. Ảnh điện thoại hiện nằm ngang? Bạn quên <code>.rotate()</code> (không tham số thì nó đọc EXIF Orientation). EXIF vẫn còn? Kiểm bạn không gọi <code>withMetadata()</code> — vài bài hướng dẫn thêm nó "để giữ màu". <code>HEAD</code> một khoá không có ném lỗi khác <code>NotFound</code>? In <code>e.name</code> ra: vài dịch vụ tương thích S3 trả 403 cho khoá không tồn tại khi người gọi thiếu quyền <code>ListBucket</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">magic bytes</span><span class="v">Các byte cố định ở đầu một định dạng tệp (JPEG FF D8 FF, PNG 89 50 4E 47…).</span></div>
  <div class="kv"><span class="k">tệp lai (polyglot)</span><span class="v">Tệp hợp lệ (hoặc trông hợp lệ) theo hai định dạng cùng lúc.</span></div>
  <div class="kv"><span class="k">bom giải nén</span><span class="v">Tệp nhỏ, giải mã ra cỡ khổng lồ; chặn bằng giới hạn điểm ảnh.</span></div>
  <div class="kv"><span class="k">EXIF</span><span class="v">Siêu dữ liệu trong ảnh: chiều xoay, thiết bị, thời gian, GPS.</span></div>
  <div class="kv"><span class="k">immutable</span><span class="v">Chỉ thị Cache-Control: nội dung URL này không bao giờ đổi, khỏi hỏi lại.</span></div>
  <div class="kv"><span class="k">object mồ côi</span><span class="v">Tệp trên kho mà không dòng CSDL nào trỏ tới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cánh cổng chạy trước khi ghi dòng: khoá đúng chủ → HEAD → magic bytes → giải mã thật có hạn mức điểm ảnh.</li>
<li>Mã hoá lại bằng sharp áp chiều xoay và xoá EXIF/GPS; bản sạch nhận khoá mới trong <code>posts/</code>.</li>
<li>Bom đo thật: PNG xen kẽ 45 KB ⇒ 203 MB, 1,27 s; giới hạn 40 triệu điểm ảnh.</li>
<li>Lỗi gửi client là mã ngắn; chi tiết thư viện nằm trong log.</li>
<li><code>imageUrl = MEDIA_BASE_URL + khoá</code>, cache một năm; xoá dòng trước, log và dọn mồ côi.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
