/**
 * obj-01-3 — Object Storage · Chapter 1 · 1.3 "Multipart upload for large files" (deck video + web, 14/11/2026).
 * Bài web: os-1-3-multipart. Output THẬT (scratchpad/obj/demo/n1-3.txt · MinIO RELEASE.2026-11-12 · SDK v3 + lib-storage 3.1071.0 · Node 22.23.3, Mac):
 * ba bước bằng tay (part gửi thứ tự 3,1,2): trước Complete HEAD ⇒ NotFound, LIST 0 object; Complete ⇒ "824b6959…-3", 12.582.912 B, video/mp4; tự tính MD5(MD5 các phần)+"-3" KHỚP,
 * MD5 cả tệp khác; luật: phần đầu 1 MB ⇒ EntityTooSmall, PartNumber 0 ⇒ InvalidPart, 10.000 OK, 10.001 ⇒ InvalidArgument, Complete [2,1] ⇒ InvalidPartOrder, sau Abort ⇒ NoSuchUpload;
 * mồ côi: thoát giữa chừng ⇒ aws s3 ls không thấy, list-multipart-uploads thấy 3 (cả 2 cái Complete hỏng), list-parts 2 × 5.242.880 B; don.mjs Abort ⇒ còn 0;
 * 100 MB trên localhost: PutObject 1,52 s vs Upload 10 MB × 4: 1,82 s, 10 sự kiện tiến độ, ETag "…-10". Kho: multipart 0 lần trong src.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-3:file:s3.mjs": "import { S3Client } from '@aws-sdk/client-s3';\nexport const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nexport const B = 'nhieu-phan';\n",
 "n1-3:file:ba-buoc.mjs": "// Ba bước bằng tay: Create ⇒ UploadPart × 3 (5 MB + 5 MB + 2 MB, gửi KHÔNG theo thứ tự) ⇒ Complete. Trước Complete: object chưa tồn tại.\nimport { CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';\nimport { createHash } from 'node:crypto';\nimport { s3, B } from './s3.mjs';\nconst MB = 1024 * 1024, Key = 'video/bai-1.mp4';\nconst phan = [Buffer.alloc(5 * MB, 1), Buffer.alloc(5 * MB, 2), Buffer.alloc(2 * MB, 3)];\nconst { UploadId } = await s3.send(new CreateMultipartUploadCommand({ Bucket: B, Key, ContentType: 'video/mp4' }));\nconsole.log(`1) Create ⇒ UploadId ${UploadId.slice(0, 20)}…`);\nconst parts = [];\nfor (const i of [3, 1, 2]) {\n  const r = await s3.send(new UploadPartCommand({ Bucket: B, Key, UploadId, PartNumber: i, Body: phan[i - 1] }));\n  parts.push({ PartNumber: i, ETag: r.ETag });\n  console.log(`2) UploadPart #${i} (${phan[i - 1].length / MB} MB) ⇒ ETag ${r.ETag}`);\n}\ntry { await s3.send(new HeadObjectCommand({ Bucket: B, Key })); console.log('   trước Complete: object ĐÃ có'); }\ncatch (e) { console.log(`   trước Complete: HEAD ⇒ ${e.name} · LIST thấy ${(await s3.send(new ListObjectsV2Command({ Bucket: B }))).KeyCount} object`); }\nparts.sort((a, b) => a.PartNumber - b.PartNumber);\nconst r = await s3.send(new CompleteMultipartUploadCommand({ Bucket: B, Key, UploadId, MultipartUpload: { Parts: parts } }));\nconst h = await s3.send(new HeadObjectCommand({ Bucket: B, Key }));\nconsole.log(`3) Complete ⇒ ETag ${r.ETag} · ${h.ContentLength} byte · ${h.ContentType}`);\n// Tự tính ETag multipart: MD5( MD5(part1) ‖ MD5(part2) ‖ MD5(part3) ) + \"-3\"\nconst tinh = createHash('md5').update(Buffer.concat(phan.map((p) => createHash('md5').update(p).digest()))).digest('hex') + '-3';\nconsole.log(`   tự tính MD5(MD5 các phần) + \"-3\" = \"${tinh}\" · MD5 cả tệp = ${createHash('md5').update(Buffer.concat(phan)).digest('hex')}`);\n",
 "n1-3:ba": "$ npm i --no-save @aws-sdk/lib-storage@3.1071.0 2>&1 | grep -E \"added|packages\"\nadded 11 packages, removed 1 package, and audited 48 packages in 2s\n3 packages are looking for funding\n$ node ba-buoc.mjs\n1) Create ⇒ UploadId ODQ1OTAzNzAtM2EyMS00…\n2) UploadPart #3 (2 MB) ⇒ ETag \"52b85f09b5f2d93f7ada64b0e9328258\"\n2) UploadPart #1 (5 MB) ⇒ ETag \"08b46181d7094b5ece88bb389c7499af\"\n2) UploadPart #2 (5 MB) ⇒ ETag \"d76f89e449720d99d4b92c79040f4882\"\n   trước Complete: HEAD ⇒ NotFound · LIST thấy 0 object\n3) Complete ⇒ ETag \"824b6959c5810442584b3a32d0cd0804-3\" · 12582912 byte · video/mp4\n   tự tính MD5(MD5 các phần) + \"-3\" = \"824b6959c5810442584b3a32d0cd0804-3\" · MD5 cả tệp = f22b41aa94c5e34abe4e38f64705c2ea",
 "n1-3:file:luat.mjs": "// Luật của part: phần (trừ phần cuối) < 5 MB; PartNumber 0 và 10.001; Complete với danh sách sai thứ tự; UploadPart sau Abort.\nimport { CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3';\nimport { s3, B } from './s3.mjs';\nconst MB = 1024 * 1024;\nconst moi = async (Key) => (await s3.send(new CreateMultipartUploadCommand({ Bucket: B, Key }))).UploadId;\nconst len = async (Key, UploadId, PartNumber, n) => ({ PartNumber, ETag: (await s3.send(new UploadPartCommand({ Bucket: B, Key, UploadId, PartNumber, Body: Buffer.alloc(n, PartNumber) }))).ETag });\nconst thu = async (nhan, f) => { try { await f(); console.log(`${nhan}: OK`); } catch (e) { console.log(`${nhan}: ${e.name} · HTTP ${e.$metadata?.httpStatusCode}`); } };\nlet id = await moi('nho.bin'); const p = [await len('nho.bin', id, 1, 1 * MB), await len('nho.bin', id, 2, 1 * MB)];\nawait thu('Complete 2 phần 1 MB (phần đầu < 5 MB)', () => s3.send(new CompleteMultipartUploadCommand({ Bucket: B, Key: 'nho.bin', UploadId: id, MultipartUpload: { Parts: p } })));\nid = await moi('so.bin');\nawait thu('UploadPart PartNumber 0', () => len('so.bin', id, 0, 10));\nawait thu('UploadPart PartNumber 10000', () => len('so.bin', id, 10000, 10));\nawait thu('UploadPart PartNumber 10001', () => len('so.bin', id, 10001, 10));\nid = await moi('thu-tu.bin'); const q = [await len('thu-tu.bin', id, 1, 5 * MB), await len('thu-tu.bin', id, 2, 10)];\nawait thu('Complete danh sách [2, 1] (sai thứ tự)', () => s3.send(new CompleteMultipartUploadCommand({ Bucket: B, Key: 'thu-tu.bin', UploadId: id, MultipartUpload: { Parts: [q[1], q[0]] } })));\nawait s3.send(new AbortMultipartUploadCommand({ Bucket: B, Key: 'thu-tu.bin', UploadId: id }));\nawait thu('UploadPart sau khi Abort', () => len('thu-tu.bin', id, 3, 10));\n",
 "n1-3:luat": "$ node luat.mjs\nComplete 2 phần 1 MB (phần đầu < 5 MB): EntityTooSmall · HTTP 400\nUploadPart PartNumber 0: InvalidPart · HTTP 400\nUploadPart PartNumber 10000: OK\nUploadPart PartNumber 10001: InvalidArgument · HTTP 400\nComplete danh sách [2, 1] (sai thứ tự): InvalidPartOrder · HTTP 400\nUploadPart sau khi Abort: NoSuchUpload · HTTP 404",
 "n1-3:file:bo-do.mjs": "// Giả lập trình duyệt sập: Create + 2 phần 5 MB rồi THOÁT, không Complete, không Abort.\nimport { CreateMultipartUploadCommand, UploadPartCommand } from '@aws-sdk/client-s3';\nimport { s3, B } from './s3.mjs';\nconst Key = 'video/sap-giua-chung.mp4';\nconst { UploadId } = await s3.send(new CreateMultipartUploadCommand({ Bucket: B, Key }));\nfor (const n of [1, 2]) await s3.send(new UploadPartCommand({ Bucket: B, Key, UploadId, PartNumber: n, Body: Buffer.alloc(5 * 1024 * 1024, n) }));\nconsole.log('đã gửi 2 phần × 5 MB rồi process.exit(1) — không Complete, không Abort');\nprocess.exit(1);\n",
 "n1-3:file:don.mjs": "// Dọn: liệt kê mọi upload dở rồi Abort từng cái.\nimport { ListMultipartUploadsCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3';\nimport { s3, B } from './s3.mjs';\nconst { Uploads = [] } = await s3.send(new ListMultipartUploadsCommand({ Bucket: B }));\nfor (const u of Uploads) { await s3.send(new AbortMultipartUploadCommand({ Bucket: B, Key: u.Key, UploadId: u.UploadId })); console.log(`Abort ${u.Key} (bắt đầu ${u.Initiated.toISOString()})`); }\nconst con = (await s3.send(new ListMultipartUploadsCommand({ Bucket: B }))).Uploads?.length ?? 0;\nconsole.log(`còn lại: ${con} upload dở`);\n",
 "n1-3:mocoi": "$ node bo-do.mjs; echo \"exit $?\"\nđã gửi 2 phần × 5 MB rồi process.exit(1) — không Complete, không Abort\nexit 1\n$ aws s3 ls s3://nhieu-phan/video/\n2026-11-14 12:02:32   12582912 bai-1.mp4\n$ aws s3api list-multipart-uploads --bucket nhieu-phan --query 'Uploads[].Key' --output text\nnho.bin\tso.bin\tvideo/sap-giua-chung.mp4\n$ aws s3api list-parts --bucket nhieu-phan --key video/sap-giua-chung.mp4 --upload-id \"$(aws s3api list-multipart-uploads --bucket nhieu-phan --query 'Uploads[?Key==`video/sap-giua-chung.mp4`].UploadId' --output text)\" --query 'Parts[].[PartNumber,Size]' --output text\n1\t5242880\n2\t5242880\n$ node don.mjs\nAbort nho.bin (bắt đầu 2026-11-14T05:02:33.198Z)\nAbort so.bin (bắt đầu 2026-11-14T05:02:33.278Z)\nAbort video/sap-giua-chung.mp4 (bắt đầu 2026-11-14T05:02:33.583Z)\ncòn lại: 0 upload dở",
 "n1-3:file:lib.mjs": "// 100 MB: PutObject một lượt vs Upload (lib-storage) partSize 10 MB, queueSize 4 — thời gian, số sự kiện tiến độ, ETag.\nimport { PutObjectCommand } from '@aws-sdk/client-s3';\nimport { Upload } from '@aws-sdk/lib-storage';\nimport { createReadStream, readFileSync } from 'node:fs';\nimport { s3, B } from './s3.mjs';\nlet t = performance.now();\nlet r = await s3.send(new PutObjectCommand({ Bucket: B, Key: 'mot-luot.bin', Body: readFileSync('to-100mb.bin') }));\nconsole.log(`PutObject 100 MB một lượt: ${((performance.now() - t) / 1000).toFixed(2)} s · ETag ${r.ETag}`);\nt = performance.now(); let su = 0, cuoi = 0;\nconst up = new Upload({ client: s3, params: { Bucket: B, Key: 'nhieu-phan.bin', Body: createReadStream('to-100mb.bin'), ContentType: 'application/octet-stream' }, queueSize: 4, partSize: 10 * 1024 * 1024 });\nup.on('httpUploadProgress', (p) => { su++; cuoi = p.loaded; if (su <= 2) console.log(`  tiến độ: ${p.loaded} / ${p.total ?? '?'} · phần ${p.part}`); });\nr = await up.done();\nconsole.log(`Upload (10 MB × 4 song song): ${((performance.now() - t) / 1000).toFixed(2)} s · ${su} sự kiện tiến độ · cuối ${cuoi} byte · ETag ${r.ETag}`);\n",
 "n1-3:lib": "$ node lib.mjs\nPutObject 100 MB một lượt: 1.52 s · ETag \"8fc9eb42756746c05ec92a14bafb54a0\"\n  tiến độ: 10485760 / 104857600 · phần 1\n  tiến độ: 20971520 / 104857600 · phần 2\nUpload (10 MB × 4 song song): 1.82 s · 10 sự kiện tiến độ · cuối 104857600 byte · ETag \"e03bbe14466924b9fcc07c754e04ff42-10\"",
 "n1-3:file:song-song.mjs": "// Bản SONG SONG thật: Promise.all gửi 3 phần cùng lúc, rồi Complete (danh sách theo PartNumber tăng dần).\nimport { CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';\nimport { s3, B as Bucket } from './s3.mjs';\nconst MB = 1024 * 1024, Key = 'video/song-song.mp4';\nconst chunks = [Buffer.alloc(5 * MB, 1), Buffer.alloc(5 * MB, 2), Buffer.alloc(2 * MB, 3)];\nconst t = performance.now();\nconst { UploadId } = await s3.send(new CreateMultipartUploadCommand({ Bucket, Key, ContentType: 'video/mp4' }));\nconst parts = await Promise.all(chunks.map((Body, i) =>\n  s3.send(new UploadPartCommand({ Bucket, Key, UploadId, PartNumber: i + 1, Body }))\n    .then((r) => ({ PartNumber: i + 1, ETag: r.ETag }))));\nconst r = await s3.send(new CompleteMultipartUploadCommand({ Bucket, Key, UploadId, MultipartUpload: { Parts: parts } }));\nconsole.log(`Promise.all 3 phần ⇒ Complete ETag ${r.ETag} · ${(performance.now() - t).toFixed(0)} ms`);\n",
 "n1-3:song": "$ node song-song.mjs\nPromise.all 3 phần ⇒ Complete ETag \"824b6959c5810442584b3a32d0cd0804-3\" · 148 ms"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, tsx, icards, cmp, box, two, steps, kw, c, flow, meter, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-01-3', code: 'OBJ 1.3', title: '1.3 — Multipart upload for large files', sub: 'Chapter 1 · Lesson 1.3' };
const O = (k) => { const v = DU_LIEU[`n1-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const BA = O('ba').split('\n').filter((l) => !/npm i|added|funding/.test(l)).join('\n'), LUAT = O('luat'), MOCOI = O('mocoi'), LIB = O('lib');
const [MC1, MC2] = MOCOI.split('$ node don.mjs');
const SONG = O('song');

const TAY = `// song-song.mjs — the three calls, parts sent at the same time
const { UploadId } = await s3.send(new CreateMultipartUploadCommand(
  { Bucket, Key, ContentType: 'video/mp4' }));
const parts = await Promise.all(chunks.map((Body, i) =>      // truly parallel
  s3.send(new UploadPartCommand({ Bucket, Key, UploadId, PartNumber: i + 1, Body }))
    .then((r) => ({ PartNumber: i + 1, ETag: r.ETag }))));
await s3.send(new CompleteMultipartUploadCommand({ Bucket, Key, UploadId,
  MultipartUpload: { Parts: parts } }));                      // sorted 1..N`;

const LIBMA = `import { Upload } from '@aws-sdk/lib-storage';   // npm i @aws-sdk/lib-storage
const up = new Upload({ client: s3,
  params: { Bucket, Key, Body: createReadStream('to-100mb.bin'), ContentType },
  queueSize: 4, partSize: 10 * 1024 * 1024 });     // 4 parts in flight, 10 MB each
up.on('httpUploadProgress', (p) => console.log(p.loaded, p.total, p.part));
await up.done();                                     // Create + UploadPart×N + Complete`;

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.3', t: 'Multipart upload<br>for large files', sub: 'The three calls by hand, the rules of a part, the "-N" ETag, and the orphans nobody sees',
    en: 'Lesson one point three: multipart upload for large files. The three calls by hand, the rules of a part, the dash-N ETag, and the orphans nobody sees.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why one PUT is not enough for big files</li>
    <li>Create → UploadPart × N → Complete, run by hand</li>
    <li>The rules of a part — each one broken on purpose</li>
    <li>Where the "-N" ETag comes from (we compute it)</li>
    <li>The SDK's <code>Upload</code> helper, measured</li>
    <li>Orphaned uploads: invisible, still stored — and how to clean them</li></ul>`,
    en: 'Takeaways: why one PUT is not enough; the three calls by hand; the rules of a part, each broken on purpose; where the dash-N ETag comes from; the SDK Upload helper; and orphaned uploads.' },
  { t: 'Why multipart', body: icards([
      ['upload', 'One PUT: all or nothing', 'Up to 5 GB per PUT (AWS limit). A dropped connection at 90% means sending 100% again.'],
      ['box', 'Multipart: many small PUTs', 'Parts of 5 MB – 5 GB, numbered 1 – 10,000, sent independently, retried alone, in any order, in parallel.'],
      ['key', 'One atomic object', 'Complete stitches the parts into ONE object up to 5 TB. Before Complete the key does not exist at all.'],
    ], 3) + flow([
      { t: '1 · Create', s: '⇒ UploadId', mau: '#2563eb' }, { t: '2 · UploadPart × N', s: 'PartNumber + body ⇒ ETag', mau: XANH }, { t: '3 · Complete', s: 'list of (PartNumber, ETag)', mau: '#1f8a3b' },
    ], { h: 130, fs: 21 }) + box('In this repo', 'grep finds no multipart call in src/ today: the biggest uploads (chat attachments, 25 MB) go in one PUT. You will need this lesson the day videos or backups arrive.', 'lam'),
    en: 'Why multipart. One PUT is all or nothing, up to five gigabytes. Multipart sends many small numbered parts, each retried alone, then Complete stitches them into one object. The repo has no multipart call today; its biggest uploads are twenty-five megabytes.' },
  { t: 'The three calls, by hand — measured', body: tn(BA, { fs: 15, wrap: 104 }) + two(
      box('Atomic', 'Parts went in as 3, 1, 2. Until Complete, HEAD said <b>NotFound</b> and LIST saw <b>0</b> objects. Then one 12,582,912-byte object, video/mp4, appeared at once.', 'xanh'),
      box('Order is the PartNumber', 'Upload order does not matter; the PartNumber decides where a part goes. Complete needs the list sorted 1..N.', 'lam')),
    en: 'The three calls by hand. The parts were sent as three, one, two. Before Complete, HEAD said NotFound and the bucket listed zero objects. After Complete, one twelve megabyte object appeared at once.' },
  { t: 'Where the "-N" ETag comes from', body: flow([
      { t: 'MD5(part 1)', s: '08b46181…' }, { t: 'MD5(part 2)', s: 'd76f89e4…' }, { t: 'MD5(part 3)', s: '52b85f09…' }, { t: 'MD5 of the 3 digests', s: '+ "-3"', mau: XANH },
    ], { h: 130, fs: 19 }) + cmp(['', 'value'], [
      ['ETag returned by Complete', '"824b6959c5810442584b3a32d0cd0804-3"'], ['computed: MD5(MD5₁‖MD5₂‖MD5₃) + "-3"', '"824b6959c5810442584b3a32d0cd0804-3"  ✅'], ['MD5 of the whole file', 'f22b41aa94c5e34abe4e38f64705c2ea  ≠'],
    ], { fs: 18, hl: [1] }) + box('So', 'A multipart ETag depends on the PART SIZE, not only on the bytes: the same file cut differently gets another ETag. Never compare it with an MD5 — store your own SHA-256 (0.2).', 'do2'),
    en: 'Where the dash-N ETag comes from: the MD5 of the three part MD5s, plus dash three. We computed it ourselves and it matched exactly. It is not the MD5 of the file, and it changes if you cut the file differently.' },
  { t: 'The rules of a part — broken on purpose', body: tn(LUAT, { fs: 16, wrap: 104 }) + cmp(['Rule', 'Broken ⇒'], [
      ['every part except the last ≥ 5 MB', 'EntityTooSmall (at Complete, not at UploadPart)'], ['PartNumber 1 – 10,000', '0 ⇒ InvalidPart · 10,001 ⇒ InvalidArgument'],
      ['Complete lists parts in ascending order', 'InvalidPartOrder'], ['an aborted UploadId is gone', 'NoSuchUpload (404)'],
    ], { fs: 17 }),
    en: 'The rules of a part, each broken on purpose. Parts under five megabytes failed only at Complete, with EntityTooSmall. Part number zero and ten thousand and one were refused. A list out of order gave InvalidPartOrder. And after Abort the upload id is gone.' },
  { t: 'Parallel for real — and the 10,000-part ceiling', body: tsx(TAY, { sm: true, hl: [4, 8] }) + tn(SONG, { fs: 15, wrap: 104 }) + two(
      box('Old lesson code', 'It said "(parallel)" but awaited each UploadPart in a for loop — one at a time. Promise.all (above, same ETag) or the Upload helper makes it parallel.', 'do2'),
      box('Pick the part size from the file size', '10,000 × 5 MB = only ~48.8 GB. 100 GB needs parts ≥ ~10.3 MB; 5 TB ≥ ~525 MB. Guide: 10 MB under 1 GB, 50–100 MB to 100 GB.', 'lam')),
    en: 'Parallel for real. The old lesson code said parallel but awaited each part in a loop, one at a time; Promise all makes it parallel. And mind the ceiling: ten thousand parts of five megabytes is only about forty-nine gigabytes.' },
  { t: 'The SDK helper: Upload from lib-storage', body: tsx(LIBMA, { sm: true, hl: [4, 6] }) + tn(LIB, { fs: 15, wrap: 104 }) + meter([
      ['PutObject, one shot', 1.52, '#94a3b8'], ['Upload, 10 MB × 4', 1.82, XANH],
    ], { don: 's', nhan: 250, fs: 18, rh: 40 }),
    en: 'The SDK helper Upload does Create, the parts and Complete for you, with progress events. On localhost, one hundred megabytes took one point five seconds in one shot and one point eight with the helper: multipart is not about speed here, it is about retrying a part instead of the whole file.' },
  { t: 'Orphans: invisible, still stored', body: tn(MC1.trim(), { fs: 15, wrap: 104 }) + two(
      box('Measured', `The script died after 2 parts. ${c('aws s3 ls')} shows only the finished file — yet ${c('list-multipart-uploads')} holds <b>3</b> uploads and ${c('list-parts')} shows 2 × 5,242,880 bytes stored. Two came from Completes that FAILED: a failed Complete does not abort.`, 'do2'),
      box('Why it costs', 'On S3 and R2 the stored parts of an unfinished upload are billed like any data until someone aborts them. Nothing in the console listing shows them.', '')),
    en: 'Orphans. The script died after two parts. The normal listing showed only the finished file, but three unfinished uploads were still there, two of them left by Completes that failed. Their parts are stored, and on S3 and R2 they are billed.' },
  { t: 'Clean them up — now, and automatically', giua: true, body: tn('$ node don.mjs' + MC2, { fs: 17, wrap: 104 }) +
      tsx(`// by hand (don.mjs): list every unfinished upload, then abort each
const { Uploads = [] } = await s3.send(new ListMultipartUploadsCommand({ Bucket }));
for (const u of Uploads)
  await s3.send(new AbortMultipartUploadCommand({ Bucket, Key: u.Key, UploadId: u.UploadId }));`, { sm: true }) +
      two(tsx(`// automatically: lifecycle rule (Chapter 6)
"AbortIncompleteMultipartUpload":
  { "DaysAfterInitiation": 7 }`, { sm: true }), box('Do both', 'The script for today; the rule so that a crashed browser next month does not leave parts billed forever.', 'xanh')),
    en: 'Clean them up. By hand: list the unfinished uploads and abort each one; afterwards zero remain. Automatically: a lifecycle rule that aborts anything older than seven days, which Chapter six applies and measures.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Multipart upload', 'parts sent apart, stitched atomically'), kw('UploadId', 'the handle of one unfinished upload'), kw('PartNumber', '1 – 10,000; decides the order'),
      kw('Part', '≥ 5 MB except the last, ≤ 5 GB'), kw('"-N" ETag', 'MD5 of the part MD5s + number of parts'), kw('Upload (lib-storage)', 'helper: parts, parallelism, progress'),
      kw('Orphaned upload', 'never completed or aborted; still stored'), kw('AbortMultipartUpload', 'deletes the parts of one upload'), kw('AbortIncompleteMultipartUpload', 'lifecycle action: abort after N days'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: multipart upload, UploadId, PartNumber, part, the dash-N ETag, the Upload helper, orphaned upload, AbortMultipartUpload, and the lifecycle action that aborts after N days.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run the three calls by hand with 3 parts sent out of order; HEAD before and after Complete',
      'Compute the "-N" ETag yourself and compare it with the file\'s MD5',
      'Break each rule: a 1 MB first part, PartNumber 10,001, an unsorted Complete',
      'Kill a script after 2 parts; find the orphan with list-multipart-uploads; abort it',
    ]), box('Keep these', '<ul><li>Parts 5 MB – 5 GB, 1 – 10,000; object ≤ 5 TB</li><li>Nothing exists before Complete</li><li>ETag "-N" = MD5 of part MD5s</li><li>Part size × 10,000 ≥ file size</li><li>Orphans are billed: abort them, add a lifecycle rule</li></ul>', 'lam'), ''),
    en: 'Your turn: run the three calls by hand, compute the ETag yourself, break each rule of a part, and create, find and abort an orphan.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The S3 API', bai: '1.3 Multipart upload' }, S);
