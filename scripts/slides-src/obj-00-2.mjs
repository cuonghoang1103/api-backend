/**
 * obj-00-2 — Object Storage · Section 0 · 0.2 "Bucket, key, object: the three-level model" (deck video + web, 14/11/2026).
 * Bài web: os-0-2-model. Output THẬT (scratchpad/obj/demo/n0-2.txt · MinIO RELEASE.2026-11-12 · aws-cli 2.31.22 · SDK v3 3.1071.0 · Node 22.23.3, Mac):
 * buildKey CỦA KHO (src/storage/keys.ts, 15 category) ⇒ images/avatar/u42/<ms>-<12 hex>.jpg (tên gốc bị bỏ, đuôi giữ, chữ thường); Postgres lưu User.avatarUrl
 * (URL công khai) + PendingUpload.r2Key, keyFromUrl ở 11 tệp, model MediaFile = 0 (bài web cũ bịa); giới hạn: key 1.024 byte OK / 1.025 KeyTooLongError,
 * MinIO riêng: một đoạn 300 byte ⇒ XMinioInvalidObjectName, "tết/"×170 = 680 ký tự 1.020 byte OK, metadata 1,9 KB OK / 2,1 KB MetadataTooLarge, object 0 byte ETag d41d8…;
 * metadata hệ thống vs x-amz-meta-*, thiếu content-type ⇒ binary/octet-stream; ETag: PUT nhỏ = MD5, 20 MB multipart ⇒ "…-3" ≠ MD5, PUT một lượt = MD5;
 * key "logo tết+1#a.png": URL ghép tay 404, encodeURIComponent 200, dấu cách thành "+" 404.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-2:khoa": "$ # Quy ước key THẬT của kho: src/storage/keys.ts (chạy hàm buildKey của kho, không gọi mạng)\n$ cd ~/Downloads/api-backend && grep -c \"^  | '\" src/storage/keys.ts && grep -A3 \"^export type StorageCategory\" src/storage/keys.ts | tail -3\n15\n  | 'images/avatar'\n  | 'images/cover'\n  | 'images/post'\n$ npx tsx -e \"import { buildKey, buildAudioKey } from './src/storage/keys.ts'; …\"\nimages/avatar/u42/1794628549709-3a5edb866277.jpg\nimages/post/u42/1794628549709-813586f6726e.png\ndocuments/lesson/1794628549709-8c870e70cf2b.pdf\naudio/songs/u7/1794628549709-6ea6810ccb2a.mp3\n$ # Kho lưu GÌ trong Postgres để khỏi liệt kê bucket?\n$ cd ~/Downloads/api-backend && grep -nE \"^model (User|PendingUpload) |^  avatarUrl |^  r2Key \" prisma/schema.prisma | head -4\n29:model User {\n36:  avatarUrl        String?   @map(\"avatar_url\") @db.VarChar(500)\n2114:model PendingUpload {\n2117:  r2Key     String   @map(\"r2_key\") @db.VarChar(700)\n$ cd ~/Downloads/api-backend && grep -c \"model MediaFile\" prisma/schema.prisma; grep -rln \"keyFromUrl\" src | wc -l | tr -d ' '\n0\n11",
 "n0-2:file:gioi-han.mjs": "// Đo giới hạn của mô hình trên MinIO: độ dài key (byte UTF-8), metadata người dùng, object rỗng.\nimport { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nconst B = 'mo-hinh';\nconst thu = async (nhan, lenh) => { try { await s3.send(lenh); console.log(`${nhan}: OK`); } catch (e) { console.log(`${nhan}: ${e.name} (${e.$metadata?.httpStatusCode})`); } };\nconst dai = ('a'.repeat(199) + '/').repeat(5);                 // 1.000 byte, mỗi đoạn 200 byte\nawait thu('key 1.024 byte (đoạn ≤ 200 byte)', new PutObjectCommand({ Bucket: B, Key: dai + 'b'.repeat(24), Body: 'x' }));\nawait thu('key 1.025 byte', new PutObjectCommand({ Bucket: B, Key: dai + 'b'.repeat(25), Body: 'x' }));\nawait thu('key 300 byte KHÔNG có \"/\" (một đoạn dài)', new PutObjectCommand({ Bucket: B, Key: 'c'.repeat(300), Body: 'x' }));\nconst tet = 'tết/'.repeat(170);\nconsole.log(`key \"tết/\" × 170: ${tet.length} ký tự nhưng ${Buffer.byteLength(tet)} byte UTF-8`);\nawait thu('  ⇒ PUT', new PutObjectCommand({ Bucket: B, Key: tet, Body: 'x' }));\nawait thu('metadata người dùng ~1,9 KB', new PutObjectCommand({ Bucket: B, Key: 'm1', Body: 'x', Metadata: { ghichu: 'a'.repeat(1900) } }));\nawait thu('metadata người dùng ~2,1 KB', new PutObjectCommand({ Bucket: B, Key: 'm2', Body: 'x', Metadata: { ghichu: 'a'.repeat(2100) } }));\nawait thu('object 0 byte', new PutObjectCommand({ Bucket: B, Key: 'rong.txt', Body: Buffer.alloc(0) }));\nconst h = await s3.send(new HeadObjectCommand({ Bucket: B, Key: 'rong.txt' }));\nconsole.log(`  ⇒ ContentLength ${h.ContentLength} · ETag ${h.ETag}`);\nprocess.exit(0);\n",
 "n0-2:gioihan": "$ aws s3 mb s3://mo-hinh\nmake_bucket: mo-hinh\n$ node gioi-han.mjs\nkey 1.024 byte (đoạn ≤ 200 byte): OK\nkey 1.025 byte: KeyTooLongError (400)\nkey 300 byte KHÔNG có \"/\" (một đoạn dài): XMinioInvalidObjectName (400)\nkey \"tết/\" × 170: 680 ký tự nhưng 1020 byte UTF-8\n  ⇒ PUT: OK\nmetadata người dùng ~1,9 KB: OK\nmetadata người dùng ~2,1 KB: MetadataTooLarge (400)\nobject 0 byte: OK\n  ⇒ ContentLength 0 · ETag \"d41d8cd98f00b204e9800998ecf8427e\"",
 "n0-2:meta": "$ aws s3api put-object --bucket mo-hinh --key brand/logo.svg --body logo.svg --content-type image/svg+xml --cache-control \"public, max-age=31536000, immutable\" --metadata nguon=figma,nguoi-tai=42 --query ETag --output text\n\"46661d6d65debc63884004fed6e37e5c\"\n$ aws s3api head-object --bucket mo-hinh --key brand/logo.svg --query '{ContentType:ContentType,CacheControl:CacheControl,ContentLength:ContentLength,ETag:ETag,LastModified:LastModified,Metadata:Metadata}'\n{\n    \"ContentType\": \"image/svg+xml\",\n    \"CacheControl\": \"public, max-age=31536000, immutable\",\n    \"ContentLength\": 41,\n    \"ETag\": \"\\\"46661d6d65debc63884004fed6e37e5c\\\"\",\n    \"LastModified\": \"2026-11-14T03:56:17+00:00\",\n    \"Metadata\": {\n        \"nguoi-tai\": \"42\",\n        \"nguon\": \"figma\"\n    }\n}\n$ # Trên dây HTTP, metadata người dùng đi dưới dạng header x-amz-meta-*\n$ curl -s -D - -o /dev/null \"$(aws s3 presign s3://mo-hinh/brand/logo.svg)\" | grep -iE \"^(content-type|cache-control|etag|x-amz-meta)\"\nCache-Control: public, max-age=31536000, immutable\nContent-Type: image/svg+xml\nETag: \"46661d6d65debc63884004fed6e37e5c\"\nx-amz-meta-nguoi-tai: 42\nx-amz-meta-nguon: figma\n$ # Không gửi --content-type thì sao?\n$ printf 'abc' > khong-ro && aws s3api put-object --bucket mo-hinh --key khong-ro --body khong-ro --query ETag --output text >/dev/null && aws s3api head-object --bucket mo-hinh --key khong-ro --query ContentType --output text\nbinary/octet-stream",
 "n0-2:etag": "$ aws s3api put-object --bucket mo-hinh --key nho.txt --body nho.txt --query ETag --output text; md5 -q nho.txt\n\"2201c07c37755e663c07335cfd2f44c6\"\n2201c07c37755e663c07335cfd2f44c6\n$ aws s3 cp to.bin s3://mo-hinh/to.bin     # 20 MB ⇒ CLI tự chia multipart (ngưỡng 8 MB)\n\"ac3827f7556624c52349a9e6b88ce0cf-3\"\nd129b1c1416d6288aaf9636648112905\n$ aws s3api put-object --bucket mo-hinh --key to-mot-luot.bin --body to.bin --query ETag --output text\n\"d129b1c1416d6288aaf9636648112905\"",
 "n0-2:file:doc-cong-khai.json": "{ \"Version\": \"2012-10-17\", \"Statement\": [{ \"Effect\": \"Allow\", \"Principal\": \"*\", \"Action\": [\"s3:GetObject\"], \"Resource\": [\"arn:aws:s3:::mo-hinh/*\"] }] }\n",
 "n0-2:ten": "$ aws s3api put-object --bucket mo-hinh --key \"logo tết+1#a.png\" --body p.png --query ETag --output text\n\"bff139fa05ac583f685a523ab3d110a0\"\n$ aws s3api list-objects-v2 --bucket mo-hinh --prefix logo --query 'Contents[].Key' --output text\nlogo tết+1#a.png\n$ # Ghép URL bằng cộng chuỗi, chỉ thay dấu cách — \"#\" bị hiểu là ĐẦU fragment, không gửi lên server:\n$ curl -s -o /dev/null -w \"%{http_code}  %{url_effective}\\n\" \"http://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt+1#a.png\"\n404  http://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt+1#a.png\n$ # Mã hoá từng đoạn bằng encodeURIComponent:\n$ node -e \"console.log('http://localhost:20200/mo-hinh/' + encodeURIComponent('logo tết+1#a.png'))\" > url.txt && cat url.txt && curl -s -o /dev/null -w \"%{http_code}\\n\" \"$(cat url.txt)\"\nhttp://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt%2B1%23a.png\n200\n$ # Mã hoá dấu cách thành \"+\" (kiểu form) — lệch:\n$ curl -s -o /dev/null -w \"%{http_code}  %{url_effective}\\n\" \"http://localhost:20200/mo-hinh/logo+t%E1%BA%BFt%2B1%23a.png\"\n404  http://localhost:20200/mo-hinh/logo+t%E1%BA%BFt%2B1%23a.png"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, icards, cmp, box, two, steps, kw, c, cay, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-00-2', code: 'OBJ 0.2', title: '0.2 — Bucket, key, object: the three-level model', sub: 'Section 0 · Lesson 0.2' };
const O = (k) => { const v = DU_LIEU[`n0-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s, re) => s.split('\n').filter((l) => !re.test(l)).join('\n');
const KHOA = O('khoa'), GH = bo(O('gioihan'), /^\$ aws s3 mb|^make_bucket/), ETAG = O('etag'), TEN = bo(O('ten'), /^\$ #|list-objects-v2|^logo tết/);
const META = O('meta').replace(/\$ aws s3api head-object[\s\S]*?\n\}\n/, '');
const [KHOA1, KHOA2] = KHOA.split('$ # Kho lưu GÌ');

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.2', t: 'Bucket, key, object:<br>the three-level model', sub: 'Every limit measured on MinIO; every convention read from this repo\'s own code',
    en: 'Lesson zero point two: bucket, key and object, the three levels every S3 call rests on. Limits measured on MinIO, conventions read from the repo.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The three concepts, and the limits of each — measured</li>
    <li>How this repo names its keys (its real <code>buildKey</code>)</li>
    <li>What the repo stores in Postgres so it never lists the bucket</li>
    <li>System metadata vs user metadata, on the wire</li>
    <li>When the ETag is an MD5 — and when it is not</li>
    <li>Key names that break URLs, and how to encode them</li></ul>`,
    en: 'Takeaways: the three concepts and their limits; the repo\'s real key naming; what the repo keeps in Postgres; system versus user metadata; when the ETag is an MD5; and key names that break URLs.' },
  { t: 'Three concepts', body: icards([
      ['box', 'Bucket — the container', 'top level. On AWS a bucket name is unique across ALL accounts; on R2, unique per account. Chosen at creation; cannot be renamed.'],
      ['key', 'Key — the identifier', 'any UTF-8 string up to 1,024 BYTES, "/" included. Unique inside its bucket: the object\'s primary key.'],
      ['page', 'Object — data + metadata + ETag', '0 bytes to 5 TB of data, plus system metadata (Content-Type, Cache-Control…), user metadata (x-amz-meta-*), and an ETag.'],
    ], 3) + box('Everything else is built on these three', `${c('PutObject(Bucket, Key, Body, metadata)')} · ${c('GetObject(Bucket, Key)')} · ${c('ListObjectsV2(Bucket, Prefix)')} — read any S3 call and you will find them.`, 'lam'),
    en: 'Three concepts. A bucket is the container: on AWS its name is unique across all accounts, on R2 per account, and it cannot be renamed. A key is the identifier, up to one thousand twenty-four bytes. An object is data plus metadata plus an ETag, from zero bytes to five terabytes.' },
  { t: 'Measured: the limits', body: tn(GH, { fs: 15, wrap: 104 }) + cmp(['Limit', 'Measured on MinIO'], [
        ['key ≤ 1,024 BYTES (UTF-8)', '1,024 OK · 1,025 KeyTooLongError'],
        ['bytes, not characters', '"tết/" × 170 = 680 chars = 1,020 B'],
        ['user metadata ≤ 2 KB', '1.9 KB OK · 2.1 KB MetadataTooLarge'],
        ['an object may be empty', '0 B, ETag d41d8cd9… (MD5 of nothing)'],
        ['MinIO-only quirk', 'one 300-byte segment → XMinioInvalidObjectName'],
      ], { fs: 15 }),
    en: 'Measured limits. A key of one thousand twenty-four bytes was accepted, one more byte was rejected with KeyTooLong. Bytes, not characters: Vietnamese letters take two or three bytes each. User metadata above about two kilobytes was rejected. An empty object is fine. And one MinIO-only quirk: a single path segment over two hundred fifty-five bytes is refused.' },
  { t: 'How this repo names its keys — its real buildKey', body: tn(KHOA1.trim(), { fs: 15, wrap: 104 }) +
      two(box('The rules in src/storage/keys.ts', `${c('<category>/u<userId>/<timestamp>-<12 hex><ext>')} · lowercase ASCII · no leading or trailing slash · the original name is DROPPED, only the extension kept · 15 categories.`, 'lam'),
        box('Why a random suffix', 'No two uploads collide, a user\'s Vietnamese file name never reaches a URL, and keys cannot be guessed by counting. (The old lesson text showed users/42/avatars/… — the repo never used that.)', 'do2')),
    en: 'How this repo really names keys: we ran its buildKey function. A Vietnamese file name becomes images slash avatar slash u forty-two slash a timestamp, twelve random hex characters and the extension. The original name is dropped, so it never reaches a URL, and keys cannot be guessed.' },
  { t: 'What the repo keeps in Postgres — so it never lists', body: tn(('$ # Kho lưu GÌ' + KHOA2).trim(), { fs: 15, wrap: 104 }) + `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">${box('A URL in the row', `${c('User.avatarUrl')} stores the PUBLIC URL (media.cuongthai.com/<key>). To delete, ${c('keyFromUrl()')} cuts the key back out — used in 11 files.`, 'xanh')}${box('A key for uploads in flight', `${c('PendingUpload.r2Key')} remembers the key of a presigned upload until it is confirmed (Chapter 4).`, 'lam')}${box('No MediaFile table', 'The old lesson text showed a MediaFile model; grep finds 0. The principle stands: the database knows every key.', 'do2')}</div>`,
    en: 'What the repo keeps in Postgres: the user row stores the public URL of the avatar, and keyFromUrl cuts the key back out when it must delete. Uploads in flight keep their key in PendingUpload. There is no MediaFile table, but the principle stands: the database knows every key.' },
  { t: 'Two kinds of metadata', body: tn(META, { fs: 14, wrap: 104 }) +
      two(box('System metadata', `${c('Content-Type')}, ${c('Cache-Control')}, ${c('Content-Length')}, ${c('ETag')}, ${c('Last-Modified')} — real HTTP headers. Forget Content-Type and you get <b>binary/octet-stream</b>.`, 'lam'),
        box('User metadata', `${c('x-amz-meta-*')}: your own key/value pairs, ≤ 2 KB in total, returned as headers. Cannot be queried — the repo keeps such facts in Postgres instead.`, '')),
    en: 'Two kinds of metadata. System metadata, like Content-Type and Cache-Control, are real HTTP headers; upload without a content type and MinIO answers binary octet-stream. User metadata travel as x-amz-meta headers, up to about two kilobytes, and cannot be queried.' },
  { t: 'The ETag: an MD5 — until it is not', body: tn(ETAG, { fs: 15, wrap: 104 }) +
      two(cmp(['Upload', 'ETag', '= MD5?'], [['8 bytes, one PUT', '2201c07c…', '✅'], ['20 MB, CLI multipart (3 parts)', '…-3', '❌'], ['same 20 MB, one PUT', 'd129b1c1…', '✅']], { hl: [1] }),
        box('Do not rely on it', 'Multipart ETags are a hash of the part hashes plus "-N"; encrypted objects have opaque ETags. Need a content hash? Compute SHA-256 yourself and store it.', 'do2'), 'r64'),
    en: 'The ETag is an MD5 for a single PUT: eight bytes and twenty megabytes both matched md5. But the CLI uploaded the same twenty megabytes in three parts, and the ETag ended in dash three and was not the MD5. If you need a content hash, compute it yourself.' },
  { t: 'Key names that break URLs', body: tn(TEN, { fs: 14, wrap: 104 }) +
      two(box('Encode each segment', `${c("encodeURIComponent('logo tết+1#a.png')")} → <b>200</b>. Hand-built URLs: "#" starts a fragment and never reaches the server (<b>404</b>); a space sent as "+" names another key (<b>404</b>).`, 'do2'),
        box('Or avoid the problem', 'The repo\'s rule: lowercase ASCII letters, digits, "-", "_", "/" and an extension. A display name belongs in the database, not in the key.', 'xanh')),
    en: 'Key names that break URLs. A key with a space, a Vietnamese letter, a plus and a hash was stored fine. Encoding it with encodeURIComponent returned two hundred. A hand-built URL lost everything after the hash, and a space written as plus pointed at another key: four oh four both times.' },
  { t: 'The whole model in one picture', body: cay({ t: 'the repo\'s R2 bucket', s: 'public through media.cuongthai.com', mau: XANH }, [
      { t: 'images/avatar/u42/…jpg', s: 'image/jpeg · ETag · avatarUrl in DB', mau: '#2563eb' },
      { t: 'audio/songs/u7/…mp3', s: 'audio/mpeg · ETag', mau: '#1f8a3b' },
      { t: 'documents/lesson/…pdf', s: 'application/pdf · ETag', mau: '#7c3aed' },
    ], { w: 1110, h: 250, fs: 19 }) + box('One sentence to keep', 'A bucket holds objects; each object is found by its key (≤ 1,024 bytes) and carries data, system metadata, user metadata and an ETag — and your database remembers the keys so you never have to list.', 'lam'),
    en: 'The whole model in one picture: one bucket, many keys built by buildKey, each object with its type and ETag, and the database remembering every key so nobody lists the bucket.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Bucket', 'the container; name fixed at creation'), kw('Key', '≤ 1,024 UTF-8 bytes, unique in its bucket'), kw('Object', 'data + metadata + ETag, 0 B – 5 TB'),
      kw('System metadata', 'Content-Type, Cache-Control, ETag, Last-Modified'), kw('User metadata', 'x-amz-meta-* pairs, ≤ 2 KB'), kw('ETag', 'MD5 for a single PUT; "…-N" for multipart'),
      kw('buildKey', 'the repo\'s key builder: category/u<id>/<ms>-<hex><ext>'), kw('keyFromUrl', 'recovers a key from a stored public URL'), kw('encodeURIComponent', 'encodes one URL segment safely'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: bucket, key, object; system and user metadata; ETag; the repo\'s buildKey and keyFromUrl; and encodeURIComponent.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'PUT an object with --content-type and --cache-control, and one without: compare the HEADs',
      'Add --metadata, then read it back with curl -D - as x-amz-meta-* headers',
      'Upload 20 MB with aws s3 cp and with put-object: compare both ETags with md5',
      `Run the repo's ${c('buildKey')} on a Vietnamese file name — what survives?`,
    ]), box('Keep these', '<ul><li>Key ≤ 1,024 BYTES; user metadata ≤ 2 KB</li><li>Repo keys: category/u&lt;id&gt;/&lt;ms&gt;-&lt;hex&gt;.ext</li><li>The DB stores URL or key — never list</li><li>ETag = MD5 only for a single PUT</li><li>Encode each segment, or keep keys ASCII</li></ul>', 'lam'), ''),
    en: 'Your turn: compare HEADs with and without content type; read user metadata back as headers; compare ETags of a multipart and a single upload; and run the repo\'s buildKey on a Vietnamese name.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What object storage really is', bai: '0.2 Bucket, key, object' }, S);
