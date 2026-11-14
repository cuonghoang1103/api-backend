/**
 * obj-06-1 — Object Storage · Chapter 6 · 1 "Abort incomplete multipart uploads" (deck video + web, 14/11/2026).
 * Bài web: os-6-1-abort. Output THẬT (scratchpad/obj/demo/n6-1.txt · MinIO RELEASE.2026-11-12 · Garage v2.1.0 · aws-cli 2.31.22 · SDK v3 3.1071.0 · Node 22.23.3, Mac):
 * giết aws s3 cp 200 MiB giữa chừng ⇒ list-objects 0, list-multipart-uploads 1, 10 part = 83.886.080 B, trên đĩa máy chủ: bucket 4.0K vs khu multipart 81M;
 * MinIO từ chối AbortIncompleteMultipartUpload (InvalidArgument) — tự dọn bằng cấu hình máy chủ stale_uploads_expiry=24h, interval 6h; Garage nhận + đọc lại được;
 * don-mpu.mjs: ngưỡng 24 giờ ⇒ 0, ngưỡng 0 + --that ⇒ ABORT 10 part 80.0 MiB ⇒ uploads 0, khu multipart 4.0K. Docs R2 (26/10/2026): bucket có luật MẶC ĐỊNH 7 ngày.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-1:ro": "$ # Đời thật: một script sao lưu đang đẩy tệp 200 MiB thì máy tắt (kill -9 giữa chừng)\n$ aws s3 cp sao-luu.bin s3://kho-mpu/backup/2026-11-14.bin & sleep 1.5; kill -9 $!\nđã giết aws-cli giữa chừng\n$ aws s3api list-objects-v2 --bucket kho-mpu --query 'length(Contents || `[]`)'   # object hoàn chỉnh\n0\n$ aws s3api list-multipart-uploads --bucket kho-mpu --query 'Uploads[].{Key:Key,Initiated:Initiated}'\n[{\"Key\":\"backup/2026-11-14.bin\",\"Initiated\":\"2026-11-14T09:42:28.934000+00:00\"}]\n$ u=…; aws s3api list-parts --bucket kho-mpu --key backup/2026-11-14.bin --upload-id $u --query '[length(Parts), sum(Parts[].Size)]'\n[10,83886080]\n$ # Byte thật trên đĩa của máy chủ: object hoàn chỉnh vs khu chờ multipart\n$ docker exec obj-minio du -sh /data/kho-mpu /data/.minio.sys/multipart\n4.0K\t/data/kho-mpu\n81M\t/data/.minio.sys/multipart",
 "n6-1:file:abort-7.json": "{\"Rules\":[{\"ID\":\"abort-incomplete-7d\",\"Status\":\"Enabled\",\"Filter\":{\"Prefix\":\"\"},\"AbortIncompleteMultipartUpload\":{\"DaysAfterInitiation\":7}}]}\n",
 "n6-1:luat": "$ # Cài luật dọn: MinIO\n$ aws s3api put-bucket-lifecycle-configuration --bucket kho-mpu --lifecycle-configuration file://abort-7.json    # MinIO :20200\nAn error occurred (InvalidArgument) when calling the PutBucketLifecycleConfiguration operation: The XML you provided was not well-formed or did not validate against our published schema\n$ # MinIO tự dọn bằng cấu hình máy chủ (không theo bucket)\n$ mc admin config get lab api | tr ' ' '\\n' | grep stale_uploads\nstale_uploads_cleanup_interval=6h\nstale_uploads_expiry=24h\n$ # Cùng luật trên Garage (:20220) — nhận, đọc lại được\n$ aws s3api put-bucket-lifecycle-configuration --bucket media-ch5 --lifecycle-configuration file://abort-7.json   # Garage\nđã đặt\n$ aws s3api get-bucket-lifecycle-configuration --bucket media-ch5   # Garage\n{\"Rules\":[{\"ID\":\"abort-incomplete-7d\",\"Filter\":{\"Prefix\":\"\"},\"Status\":\"Enabled\",\"AbortIncompleteMultipartUpload\":{\"DaysAfterInitiation\":7}}]}",
 "n6-1:file:don-mpu.mjs": "// don-mpu.mjs <bucket> <số giờ> [--that] — liệt kê multipart upload DỞ cũ hơn N giờ; có --that mới Abort. Dùng khi máy chủ không nhận luật\n// AbortIncompleteMultipartUpload (MinIO) hoặc muốn dọn NGAY thay vì chờ luật chạy (R2: tới 24 giờ). Không đụng object đã hoàn chỉnh.\nimport { S3Client, ListMultipartUploadsCommand, ListPartsCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nconst [Bucket, gio, that] = process.argv.slice(2);\nconst moc = Date.now() - Number(gio) * 3600_000;\nlet KeyMarker, UploadIdMarker, n = 0, byte = 0;\ndo {\n  const r = await s3.send(new ListMultipartUploadsCommand({ Bucket, KeyMarker, UploadIdMarker }));\n  for (const u of r.Uploads ?? []) {\n    if (u.Initiated.getTime() > moc) continue;                       // còn mới ⇒ có thể đang tải thật, để yên\n    const p = await s3.send(new ListPartsCommand({ Bucket, Key: u.Key, UploadId: u.UploadId }));\n    const sz = (p.Parts ?? []).reduce((a, x) => a + x.Size, 0); n++; byte += sz;\n    console.log(`${that ? 'ABORT' : 'thấy '} ${u.Key} · khởi tạo ${u.Initiated.toISOString()} · ${(p.Parts ?? []).length} part · ${(sz / 1048576).toFixed(1)} MiB`);\n    if (that) await s3.send(new AbortMultipartUploadCommand({ Bucket, Key: u.Key, UploadId: u.UploadId }));\n  }\n  ({ NextKeyMarker: KeyMarker, NextUploadIdMarker: UploadIdMarker } = r);\n  if (!r.IsTruncated) break;\n} while (true);\nconsole.log(`${n} upload dở · ${(byte / 1048576).toFixed(1)} MiB ${that ? 'đã giải phóng' : 'đang nằm chờ'}`);\n",
 "n6-1:tay": "$ node don-mpu.mjs kho-mpu 24          # cũ hơn 24 giờ: chưa có (vừa mới tạo)\n0 upload dở · 0.0 MiB đang nằm chờ\n$ node don-mpu.mjs kho-mpu 0 --that    # lab: ngưỡng 0 giờ để thấy Abort thật\nABORT backup/2026-11-14.bin · khởi tạo 2026-11-14T09:42:28.934Z · 10 part · 80.0 MiB\n1 upload dở · 80.0 MiB đã giải phóng\n$ aws s3api list-multipart-uploads --bucket kho-mpu --query 'length(Uploads || `[]`)'\n0\n$ docker exec obj-minio du -sh /data/.minio.sys/multipart\n4.0K\t/data/.minio.sys/multipart"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, ts, seq } from './_obj-chung.mjs';

export const deck = { key: 'obj-06-1', code: 'OBJ 6.1', title: '6.1 — Abort incomplete multipart uploads', sub: 'Chapter 6 · Lesson 6.1' };
const O = (k) => { const v = DU_LIEU[`n6-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.split('\n').filter((l) => !/^\$ #/.test(l)).join('\n');
const RO = bo(O('ro')), LUAT = bo(O('luat')), TAY = bo(O('tay'));
const MA = O('file:don-mpu.mjs').split('\n').filter((l) => !/^\/\//.test(l)).join('\n').trim();

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.1', t: 'Abort incomplete<br>multipart uploads', sub: 'Parts that no listing shows, bytes that still sit on disk — find them, rule them, and clean them by hand when the rule is not there',
    en: 'Chapter six, lesson one: abort incomplete multipart uploads. Parts that no listing shows but that still sit on disk: find them, set a rule, and clean them by hand when the rule is not available.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>How an interrupted upload leaves parts behind — reproduced with a killed aws-cli</li>
    <li>Why ListObjectsV2 shows nothing while the disk holds 81 MB</li>
    <li>R2's default 7-day rule — and providers that refuse the rule</li>
    <li>Choosing DaysAfterInitiation</li>
    <li>A cleanup script for when no rule exists</li></ul>`,
    en: 'Takeaways: how an interrupted upload leaves parts behind; why listings show nothing while the disk holds the bytes; R2\'s default rule and providers that refuse it; choosing the number of days; and a cleanup script.' },
  { t: 'How the leak happens', body: seq(['client', 'bucket'], [
      [0, 1, 'CreateMultipartUpload ⇒ UploadId'],
      [0, 1, 'UploadPart 1 … UploadPart 10 (8 MiB each)', '#2563eb'],
      [0, 0, '💥 process killed / laptop closed / tab crashed', '#c0392b'],
      [1, 1, 'no Complete, no Abort ⇒ 10 parts wait forever', '#c2410c'],
    ], { w: 1110, rh: 50, fs: 18 }) + two(box('A real scenario', 'A backup script pushes a 200 MiB file with <code>aws s3 cp</code> (which switches to multipart above 8 MiB). The machine sleeps or the job is killed. Nobody calls Abort.', 'do2'),
      box('This repo', 'The app itself never uses multipart (grep: no <code>CreateMultipartUpload</code> in src/) — browser uploads are single presigned PUTs. Leftover parts come from <b>tools</b>: aws-cli, rclone, backup and video-upload scripts.', 'lam')),
    en: 'How the leak happens. Create, then parts, then the process dies: no complete, no abort, and the parts wait. A real case: a backup script using aws s3 cp, which switches to multipart above eight megabytes, killed halfway. This repo\'s app never uses multipart; leftovers come from tools and scripts.' },
  { t: 'Measured: the upload nobody can see', body: tn(RO, { fs: 14, wrap: 130 }) + cmp(['question', 'answer (measured)'], [
      ['ListObjectsV2 — how many objects?', '<b>0</b>'],
      ['ListMultipartUploads — anything in flight?', '1 upload, started 09:42 UTC'],
      ['ListParts — how much?', '10 parts · 83,886,080 bytes'],
      ['bytes on the server\'s disk', 'bucket 4.0K · multipart area <b>81M</b>'],
    ], { fs: 16, hl: [0, 3] }),
    en: 'Measured. Kill aws cli halfway through a two hundred megabyte copy. List objects: zero. List multipart uploads: one. List parts: ten parts, about eighty-four megabytes. And on the server\'s disk, the multipart area holds eighty-one megabytes that no object listing will ever show.' },
  { t: 'R2 already has a default rule — the old text said it did not', body: cmp(['source', 'what it says'], [
      ['R2 docs, object lifecycles (updated 26/10/2026)', '"Buckets have a default lifecycle rule to expire multipart uploads seven days after initiation."'],
      ['same page — timing', '"Objects will typically be removed from a bucket within 24 hours of the x-amz-expiration value."'],
      ['same page — limit', '1,000 lifecycle rules per bucket; rules match by prefix'],
      ['the old lesson text', '"R2 does not do this by itself. You have to tell it." — <b>wrong for R2</b>'],
    ], { fs: 17, hl: [0, 3] }) + box('So why learn the rule?', 'Because the default is <b>7 days</b> and you may want shorter; because it can be removed or changed; and because S3, MinIO and others behave differently — check, don\'t assume. Verify with <code>get-bucket-lifecycle-configuration</code>.', 'lam'),
    en: 'R2 already has a default rule: its docs say buckets expire multipart uploads seven days after initiation, and deletions typically happen within twenty-four hours. The old text said R2 does not do this. You still learn the rule because you may want shorter, and other providers differ.' },
  { t: 'The rule — and two servers, two answers', body: ts(`{"Rules":[{ "ID": "abort-incomplete-7d", "Status": "Enabled", "Filter": { "Prefix": "" },
             "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 } }]}`, { fs: 16 }) + tn(LUAT, { fs: 13, wrap: 136 }) + cmp(['server', 'AbortIncompleteMultipartUpload rule', 'otherwise'], [
      ['R2', 'supported · a 7-day rule exists by default', '—'],
      ['MinIO (measured)', '<b>InvalidArgument</b>', 'server-wide stale_uploads_expiry=24h'],
      ['Garage (measured)', 'accepted, readable', '—'],
    ], { fs: 16 }),
    en: 'The rule: abort incomplete multipart uploads seven days after initiation. MinIO refuses it with invalid argument, measured; it cleans stale uploads with a server-wide setting instead, twenty-four hours, checked every six hours. Garage accepts the rule and returns it. S3-compatible does not mean identical.' },
  { t: 'Choosing DaysAfterInitiation', body: cmp(['consideration', 'numbers'], [
      ['the slowest legitimate upload', '1 GiB at 200 kbit/s ≈ 42,950 s ≈ 12 hours — never use 1 day on slow networks'],
      ['how long a leak may cost', 'parts are real bytes until aborted; shorter = less waste'],
      ['resumable uploads', 'resume window 3 days ⇒ abort after 4'],
      ['common defaults', 'R2 default 7 days · MinIO server-wide 24 h'],
    ], { fs: 17 }) + box('Age is only a proxy', 'A lifecycle rule cannot tell "still uploading" from "abandoned" — it only sees the initiation time. Pick a window longer than your slowest real upload.', 'lam'),
    en: 'Choosing the days. One gibibyte at two hundred kilobits per second takes about twelve hours, so one day is too short on slow networks. A resume window of three days means abort after four. Age is only a proxy: the rule cannot tell uploading from abandoned.' },
  { t: 'No rule? Clean it yourself', body: ts(`// don-mpu.mjs <bucket> <hours> [--that] — excerpt (full file: web lesson)
const cutoff = Date.now() - Number(hours) * 3600_000;
let r;
do {
  r = await s3.send(new ListMultipartUploadsCommand({
    Bucket, KeyMarker, UploadIdMarker }));
  for (const u of r.Uploads ?? []) {
    if (u.Initiated.getTime() > cutoff) continue;   // young ⇒ maybe still uploading
    const p = await s3.send(new ListPartsCommand({ Bucket, Key: u.Key, UploadId: u.UploadId }));
    console.log(u.Key, u.Initiated.toISOString(), p.Parts.length, 'parts');
    if (that) await s3.send(new AbortMultipartUploadCommand({
      Bucket, Key: u.Key, UploadId: u.UploadId }));
  }
  ({ NextKeyMarker: KeyMarker, NextUploadIdMarker: UploadIdMarker } = r);
} while (r.IsTruncated);`, { fs: 16 }) + box('Safety built in', 'Only uploads <b>older than N hours</b>; dry run by default; <code>--that</code> to abort. Completed objects are never touched — Abort only works on an UploadId.', 'lam'),
    en: 'No rule? Clean it yourself. The script lists multipart uploads page by page, skips anything newer than N hours, sums the parts, and only aborts with an explicit flag. Completed objects are never touched.' },
  { t: 'Measured: the script, dry run then real', body: tn(TAY, { fs: 15, wrap: 116 }) + two(box('Dry run, 24 hours', '0 uploads: the leak is minutes old, so a real cleanup with a 24-hour window leaves it alone — exactly what you want for an upload in progress.', 'lam'),
      box('Lab run, 0 hours + --that', 'ABORT 10 parts, 80.0 MiB freed; the multipart area on disk falls from 81M to 4.0K.', '')),
    en: 'Measured. With a twenty-four hour window the dry run finds nothing: the upload is minutes old. With zero hours and the flag, it aborts ten parts, eighty mebibytes, and the multipart area on disk drops back to four kilobytes.' },
  { t: 'Verify — with numbers you measured', body: cmp(['check', 'command'], [
      ['the rule exists and is Enabled', 'aws s3api get-bucket-lifecycle-configuration --bucket …'],
      ['how many uploads are waiting', 'aws s3api list-multipart-uploads --bucket … --query \'length(Uploads || `[]`)\''],
      ['how many bytes they hold', 'list-parts per upload, sum Size (don-mpu.mjs)'],
    ], { fs: 16 }) + box('Removed from the old text', 'A table "measured on a real R2 account, 07/2026: 84 GB billed, 23 GB parts, 27% waste" — no source, and this course never touches the real bucket. The method above is how you get <b>your</b> number.', 'do2'),
    en: 'Verify with numbers you measured: the rule exists and is enabled, how many uploads wait, and how many bytes they hold. The old text had a table claiming twenty-seven percent waste on a real account, with no source; we removed it.' },
  { t: 'Real life, what-if, and the attacker\'s view', body: two(box('Real life', '<ul><li>Uploading course videos with a script, the Wi-Fi drops: the parts of a 2 GB file stay on R2 until the default rule fires.</li><li>An <code>rclone</code> job killed by a reboot: same thing.</li></ul>', 'lam'),
      box('What if the rule is set to 1 day?', 'A slow phone upload of a long video can still be running when the rule aborts it — the user gets a failed Complete with <code>NoSuchUpload</code>. Measure your slowest real upload first.', '')) +
      box('The attacker\'s view', 'Anyone allowed to call <code>CreateMultipartUpload</code> + <code>UploadPart</code> (a leaked key, a careless "multipart from the browser" endpoint) can park gigabytes that <b>no object listing shows</b>. Defend: keep multipart server-side or tracked in your DB, keep the abort window short, and alert on the count from <code>ListMultipartUploads</code>.', 'do2'),
    en: 'Real life: a video upload script loses Wi-Fi, an rclone job dies in a reboot. What if the rule is one day? A slow phone upload gets aborted mid-way. The attacker\'s view: anyone allowed to create multipart uploads can park gigabytes no listing shows; keep multipart tracked, the window short, and alert on the count.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Multipart upload', 'create · parts · complete'), kw('Incomplete upload', 'no complete, no abort'), kw('ListMultipartUploads', 'the only listing that shows it'),
      kw('ListParts', 'how many bytes'), kw('AbortMultipartUpload', 'frees the parts (free on R2)'), kw('AbortIncompleteMultipartUpload', 'the lifecycle action'),
      kw('DaysAfterInitiation', 'age, not progress'), kw('R2 default rule', '7 days'), kw('stale_uploads_expiry', 'MinIO, server-wide'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: multipart upload, incomplete upload, list multipart uploads, list parts, abort, the lifecycle action, days after initiation, R2\'s default rule, and MinIO\'s stale uploads setting.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Start a large aws s3 cp and kill it; list objects vs multipart uploads',
      'Sum the parts with list-parts',
      'Put the abort rule; read it back (and try it on MinIO)',
      'Write the cleanup script with an age threshold and a dry run',
      'Check your R2 bucket\'s lifecycle settings in the dashboard',
    ]), box('Keep these', '<ul><li>Interrupted multipart = hidden bytes</li><li>Only ListMultipartUploads shows them</li><li>R2: default rule, 7 days</li><li>Window &gt; slowest real upload</li><li>No rule ⇒ script it</li></ul>', 'lam'), ''),
    en: 'Your turn: kill a large copy, compare the listings, sum the parts, put the rule, write the cleanup script, and check your own bucket\'s lifecycle settings.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — Lifecycle rules and cleanup', bai: '6.1 Abort incomplete MPU' }, S);
