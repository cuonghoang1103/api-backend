/**
 * obj-02-1 — Object Storage · Chapter 2 · 1 "Zero egress: what R2 costs" (deck video + web, 14/11/2026).
 * Bài web: os-2-1-egress. Output THẬT (scratchpad/obj/demo/n2-1.txt · Node 22.23.3 · MinIO RELEASE.2026-11-12 · SDK v3 3.1071.0, Mac): giá lấy TRỰC TIẾP từ AWS Price List API
 * (AmazonS3 + AWSDataTransfer us-east-1, công bố 2026-11-09) + developers.cloudflare.com/r2/pricing (14/11/2026) — KHÔNG chạm tài khoản nào:
 * S3 $0.023/GB-tháng, PUT $5/triệu, GET $0.40/triệu, egress $0.09/GB (100 GB miễn phí); R2 $0.015/GB, A $4.50/triệu, B $0.36/triệu, miễn phí 10 GB / 1 triệu A / 10 triệu B,
 * DeleteObject/DeleteBucket/AbortMultipartUpload MIỄN PHÍ (bài web cũ xếp Delete vào Class A); kịch bản bài (1 TB lưu, 10 TB egress, 1M PUT, 10M GET): S3 $923.00 vs R2 $14.85 ×62.2
 * (bài cũ $928 vs $20 ×46); egress 0/1/5/10/50 TB ⇒ ×2.2/7.6/31.9/62.2/291.2; nặng request không egress ⇒ $923 vs $816.75 ×1.1; đếm request thật một lượt đổi avatar trên MinIO.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-1:file:gia.mjs": "// Giá THẬT hôm nay từ nguồn công khai (không chạm tài khoản nào): AWS Price List API (AmazonS3 + AWSDataTransfer, us-east-1) + trang giá R2 (developers.cloudflare.com).\nconst S3 = await (await fetch('https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/us-east-1/index.json')).json();\nconst DT = await (await fetch('https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSDataTransfer/current/us-east-1/index.json')).json();\nconst R2 = await (await fetch('https://developers.cloudflare.com/r2/pricing/index.md')).text();\nconst gia = (j, loc) => { const ra = []; for (const [sku, p] of Object.entries(j.products)) if (loc(p)) for (const t of Object.values(j.terms.OnDemand[sku])) for (const r of Object.values(t.priceDimensions)) ra.push({ tu: +r.beginRange, den: r.endRange === 'Inf' ? Infinity : +r.endRange, usd: +r.pricePerUnit.USD }); return ra.sort((a, b) => a.tu - b.tu); };\nconst luuS3 = gia(S3, (p) => p.productFamily === 'Storage' && p.attributes.volumeType === 'Standard');\nconst putS3 = gia(S3, (p) => p.productFamily === 'API Request' && p.attributes.group === 'S3-API-Tier1')[0].usd;\nconst getS3 = gia(S3, (p) => p.productFamily === 'API Request' && p.attributes.group === 'S3-API-Tier2')[0].usd;\nconst raS3 = gia(DT, (p) => p.attributes.fromLocation === 'US East (N. Virginia)' && p.attributes.toLocation === 'External' && p.attributes.transferType === 'AWS Outbound');\nconsole.log(`AWS (công bố ${S3.publicationDate.slice(0, 10)}): S3 Standard $${luuS3[0].usd}/GB-tháng · PUT/COPY/POST/LIST $${(putS3 * 1e6).toFixed(2)}/triệu · GET $${(getS3 * 1e6).toFixed(2)}/triệu · egress $${raS3[0].usd}/GB (100 GB đầu miễn phí)`);\nfor (const l of R2.split('\\n').filter((l) => /^\\| (Storage|Class A Operations|Class B Operations)\\s*\\|/.test(l) || /^Free operations include/.test(l)).slice(0, 7)) console.log('R2: ' + l.replace(/\\s+\\|\\s*$/, '').replace(/\\s+/g, ' '));\nconst bac = (gb, ds, mien = 0) => { let c = 0, con = Math.max(0, gb - mien); for (const b of ds) { const lop = Math.min(con, b.den - b.tu); if (lop <= 0) break; c += lop * b.usd; con -= lop; } return c; };\nconst tinh = ({ luu, ra, put, get }) => {\n  const s3 = bac(luu, luuS3) + bac(ra, raS3, 100) + put * putS3 + get * getS3;\n  const r2 = Math.max(0, luu - 10) * 0.015 + Math.max(0, put - 1e6) * 4.5e-6 + Math.max(0, get - 10e6) * 0.36e-6;\n  return { s3, r2 };\n};\nconst in1 = (ten, kb) => { const { s3, r2 } = tinh(kb); console.log(`${ten.padEnd(40)} S3 $${s3.toFixed(2).padStart(8)}   R2 $${r2.toFixed(2).padStart(7)}   ×${(s3 / Math.max(r2, 0.01)).toFixed(1)}`); };\nconsole.log('— Kịch bản của bài: lưu 1.000 GB, egress 10.000 GB, 1 triệu PUT, 10 triệu GET / tháng');\nin1('  1 TB lưu · 10 TB egress', { luu: 1000, ra: 10000, put: 1e6, get: 10e6 });\nconsole.log('— Đổi egress, giữ 1 TB lưu + 1 triệu PUT + 10 triệu GET:');\nfor (const tb of [0, 1, 5, 10, 50]) in1(`  egress ${tb} TB`, { luu: 1000, ra: tb * 1000, put: 1e6, get: 10e6 });\nconsole.log('— App nặng request, không egress: 1 TB lưu, 100 triệu PUT, 1 tỉ GET:');\nin1('  100 triệu PUT · 1 tỉ GET · 0 egress', { luu: 1000, ra: 0, put: 100e6, get: 1e9 });\n",
 "n2-1:gia": "$ node gia.mjs\nAWS (công bố 2026-11-09): S3 Standard $0.023/GB-tháng · PUT/COPY/POST/LIST $5.00/triệu · GET $0.40/triệu · egress $0.09/GB (100 GB đầu miễn phí)\nR2: | Storage | $0.015 / GB-month | $0.01 / GB-month\nR2: | Class A Operations | $4.50 / million requests | $9.00 / million requests\nR2: | Class B Operations | $0.36 / million requests | $0.90 / million requests\nR2: | Storage | 10 GB-month / month\nR2: | Class A Operations | 1 million requests / month\nR2: | Class B Operations | 10 million requests / month\nR2: Free operations include `DeleteObject`, `DeleteBucket` and `AbortMultipartUpload`.\n— Kịch bản của bài: lưu 1.000 GB, egress 10.000 GB, 1 triệu PUT, 10 triệu GET / tháng\n  1 TB lưu · 10 TB egress                S3 $  923.00   R2 $  14.85   ×62.2\n— Đổi egress, giữ 1 TB lưu + 1 triệu PUT + 10 triệu GET:\n  egress 0 TB                            S3 $   32.00   R2 $  14.85   ×2.2\n  egress 1 TB                            S3 $  113.00   R2 $  14.85   ×7.6\n  egress 5 TB                            S3 $  473.00   R2 $  14.85   ×31.9\n  egress 10 TB                           S3 $  923.00   R2 $  14.85   ×62.2\n  egress 50 TB                           S3 $ 4324.70   R2 $  14.85   ×291.2\n— App nặng request, không egress: 1 TB lưu, 100 triệu PUT, 1 tỉ GET:\n  100 triệu PUT · 1 tỉ GET · 0 egress    S3 $  923.00   R2 $ 816.75   ×1.1",
 "n2-1:file:dem.mjs": "// Một lượt \"đăng ảnh đại diện\" của app sinh ra bao nhiêu request, thuộc lớp nào? Đếm request THẬT mà SDK gửi tới MinIO (middleware), rồi xếp lớp theo bảng giá R2.\nimport { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nconst LOP = { PutObject: 'A', ListObjectsV2: 'A', CopyObject: 'A', HeadObject: 'B', GetObject: 'B', DeleteObject: 'miễn phí' };\nconst dem = {};\ns3.middlewareStack.add((next, ctx) => async (args) => { dem[ctx.commandName] = (dem[ctx.commandName] ?? 0) + 1; return next(args); }, { step: 'build' });\ntry { await s3.send(new CreateBucketCommand({ Bucket: 'dem-lop' })); } catch {}\nconst B = 'dem-lop', K = 'images/avatar/u42/1794628549709-3a5edb866277.jpg';\nawait s3.send(new PutObjectCommand({ Bucket: B, Key: K, Body: Buffer.alloc(48 * 1024), ContentType: 'image/jpeg' }));   // tải ảnh mới lên\nawait s3.send(new HeadObjectCommand({ Bucket: B, Key: K }));                                                              // xác nhận đã lên\nfor (let i = 0; i < 20; i++) await (await s3.send(new GetObjectCommand({ Bucket: B, Key: K }))).Body.transformToByteArray(); // 20 người xem KHÔNG qua CDN\nawait s3.send(new DeleteObjectCommand({ Bucket: B, Key: 'images/avatar/u42/anh-cu.jpg' }));                               // xoá ảnh cũ\nawait s3.send(new ListObjectsV2Command({ Bucket: B, Prefix: 'images/avatar/u42/' }));                                     // \"liệt kê cho chắc\" (đừng!)\nfor (const [lenh, n] of Object.entries(dem)) console.log(`${lenh.replace('Command', '').padEnd(16)} × ${String(n).padStart(2)}  ⇒ lớp ${LOP[lenh.replace('Command', '')] ?? '?'}`);\n",
 "n2-1:lop": "$ node dem.mjs\nCreateBucket     ×  1  ⇒ lớp ?\nPutObject        ×  1  ⇒ lớp A\nHeadObject       ×  1  ⇒ lớp B\nGetObject        × 20  ⇒ lớp B\nDeleteObject     ×  1  ⇒ lớp miễn phí\nListObjectsV2    ×  1  ⇒ lớp A"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, icards, cmp, box, two, steps, kw, c, meter, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-02-1', code: 'OBJ 2.1', title: '2.1 — Zero egress: what R2 costs', sub: 'Chapter 2 · Lesson 2.1' };
const O = (k) => { const v = DU_LIEU[`n2-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const GIA = O('gia');
const [GIA1, GIA2] = GIA.split('— Kịch bản của bài');
const LOP = O('lop').split('\n').filter((l) => !/^CreateBucket/.test(l)).join('\n');

const thanh = (o, mau) => o.map(([t, w, m]) => `<div style="width:${w}%;background:${m || mau};color:#fff;font:700 15px/34px Arial;text-align:center;white-space:nowrap;overflow:hidden">${t}</div>`).join('');
const chong = (ten, tong, phan) => `<div style="display:flex;align-items:center;gap:12px;margin:8px 0"><div style="width:250px;font:700 18px Arial;text-align:right">${ten}</div><div style="flex:1;display:flex;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0">${thanh(phan)}</div><div style="width:110px;font:800 19px Arial;color:#2a1406">${tong}</div></div>`;

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.1', t: 'Zero egress:<br>what R2 really costs', sub: 'Prices pulled live from the AWS Price List API and Cloudflare\'s pricing page — then computed, not guessed',
    en: 'Chapter two, lesson one: zero egress and what R2 really costs. Prices pulled live from AWS and Cloudflare, then computed, not guessed.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Today's real price sheet — S3 vs R2, with free tiers</li>
    <li>The lesson's scenario, recomputed: ×62, not ×46</li>
    <li>Egress decides the ratio — and when R2 stops being dramatic</li>
    <li>Class A, Class B, and the operations that are free</li>
    <li>What one avatar change really costs in requests</li>
    <li>When staying on S3 is still the right call</li></ul>`,
    en: 'Takeaways: today\'s real price sheet; the lesson\'s scenario recomputed; how egress decides the ratio; Class A, Class B and free operations; the requests behind one avatar change; and when S3 is still the right call.' },
  { t: 'The price sheet, fetched today', body: tn(GIA1.trim().split('\n').filter((l) => !/^R2: \| /.test(l)).join('\n'), { fs: 15, wrap: 108 }) + cmp(['per month', 'S3 Standard (us-east-1)', 'R2 Standard'], [
      ['storage', '$0.023 / GB', '$0.015 / GB · first 10 GB free'], ['writes + LIST (S3 Tier 1 / R2 Class A)', '$5.00 / million', '$4.50 / million · first 1 M free'],
      ['reads (S3 Tier 2 / R2 Class B)', '$0.40 / million', '$0.36 / million · first 10 M free'], ['egress to the Internet', '<b>$0.09 / GB</b> (first 100 GB free, cheaper tiers above 10 TB)', '<b>$0</b>'],
      ['DeleteObject · AbortMultipartUpload', 'free (DELETE is not billed)', 'free'],
    ], { fs: 16, hl: [3] }),
    en: 'The price sheet, fetched today from the AWS price list and Cloudflare\'s page. Storage and requests are close: R2 is a little cheaper and has a free tier. The one line that differs is egress: nine cents per gigabyte on S3, zero on R2.' },
  { t: 'The lesson\'s scenario, recomputed', body: tn('— Kịch bản của bài' + GIA2.split('— Đổi egress')[0], { fs: 16, wrap: 108 }) +
      chong('S3', '$923.00', [['egress $891', 96.5, '#c0392b'], ['', 2.5, '#94a3b8'], ['', 1, '#64748b']]) + chong('R2', '$14.85', [['storage $14.85', 1.6, XANH], ['', 98.4, '#f8fafc']]) +
      two(box('Measured, not guessed', 'S3: storage $23 + egress (10,000 − 100 free) × $0.09 = $891 + 1 M PUT $5 + 10 M GET $4 = <b>$923</b>. R2: 990 GB × $0.015 = <b>$14.85</b>; the requests fit in the free tier.', 'lam'),
        box('Correction', 'The old lesson text said $928 vs $20, "46× cheaper": it skipped both free tiers and charged R2 ~$5 of PUTs that are free. Real ratio for this profile: <b>×62</b>.', 'do2')),
    en: 'The lesson\'s own scenario, recomputed with today\'s prices: S3 nine hundred twenty-three dollars, of which eight hundred ninety-one is egress; R2 fourteen dollars eighty-five. Sixty-two times, not forty-six, because the old text ignored both free tiers.' },
  { t: 'Egress decides the ratio', body: meter([
      ['egress 0 TB', 2.2, '#94a3b8', '$32 / $14.85'], ['egress 1 TB', 7.6, '#e0590b', '$113 / $14.85'], ['egress 5 TB', 31.9, XANH, '$473 / $14.85'],
      ['egress 10 TB', 62.2, XANH, '$923 / $14.85'], ['egress 50 TB', 291.2, '#c0392b', '$4,325'],
    ], { don: '×', nhan: 170, fs: 20, rh: 58, log: true }) + two(box('Read it', 'Same 1 TB stored, same requests: with no egress R2 is "only" 2.2× cheaper. Every TB served moves the S3 bill by ~$90 and the R2 bill by $0.', 'lam'),
      box('Break-even question', 'Ask "how many GB do we SERVE per month?" — not "how many do we store?". Below a few hundred GB served, the choice is about tooling, not money.', 'xanh')),
    en: 'Egress decides the ratio. With zero egress R2 is only two point two times cheaper; at one terabyte, seven point six; at ten terabytes sixty-two; at fifty terabytes two hundred ninety-one. Ask how much you serve, not how much you store.' },
  { t: 'Not magic: a request-heavy app', body: tn(GIA2.split('— App nặng')[1] ? '— App nặng' + GIA2.split('— App nặng')[1] : GIA2, { fs: 17, wrap: 108 }) +
      chong('S3 · $923.00', '', [['PUT $500', 54.2, '#2563eb'], ['GET $400', 43.3, '#1f8a3b'], ['', 2.5, '#94a3b8']]) + chong('R2 · $816.75', '', [['Class A $445.50', 54.5, '#2563eb'], ['Class B $356.40', 43.6, '#1f8a3b'], ['', 1.9, XANH]]) +
      box('So', 'With no egress, 100 M writes and 1 B reads a month cost almost the same on both (×1.1). R2 removes the egress line, not the request lines — cache reads at the CDN so they never reach the bucket (Chapter 3).', 'do2'),
    en: 'Not magic. A request-heavy app with no egress: one hundred million writes and a billion reads cost nine hundred twenty-three dollars on S3 and eight hundred seventeen on R2. Only one point one times. R2 removes egress, not requests.' },
  { t: 'Class A, Class B — and what is free', body: tn('$ node dem.mjs   # one "change avatar" flow, requests counted by an SDK middleware\n' + LOP.replace(/^\$ node dem\.mjs\n/, ''), { fs: 17, wrap: 108 }) +
      cmp(['Class', 'R2 price', 'Operations (R2 pricing page)'], [
        ['A — mutate / list', '$4.50 / M', 'PutObject, CopyObject, ListObjects, CreateMultipartUpload, UploadPart, CompleteMultipartUpload, ListMultipartUploads, PutBucketCors…'],
        ['B — read', '$0.36 / M', 'GetObject, HeadObject, HeadBucket, GetBucketCors…'],
        ['free', '$0', '<b>DeleteObject</b>, DeleteBucket, AbortMultipartUpload'],
      ], { fs: 15 }) + box('Correction', 'The old lesson text put DeleteObjects in Class A. On R2, deleting is free — and the one LIST in this flow costs as much as the PUT: do not "list to be sure" (0.1).', 'do2'),
    en: 'Class A, Class B and free. One change-avatar flow, counted request by request: one PUT and one LIST are Class A, one HEAD and twenty GETs are Class B, and the DELETE is free. The old lesson text put delete in Class A; on R2 it costs nothing.' },
  { t: 'This repo: an estimate, labelled as one', body: cmp(['', 'old lesson text', 'recomputed with today\'s prices + free tiers'], [
      ['storage ~50 GB', '$0.75', '(50 − 10) × $0.015 = <b>$0.60</b>'], ['30 k PUT / month', '$0.14', '< 1 M free ⇒ <b>$0</b>'], ['1.5 M GET / month', '$0.54', '< 10 M free ⇒ <b>$0</b>'],
      ['egress ~500 GB', '$0', '$0'], ['TOTAL R2', '~$1.50', '<b>~$0.60</b>'], ['same on S3', '~$46', '$1.15 + (500 − 100) × $0.09 + $0.75 = <b>~$37.90</b>'],
    ], { fs: 17, hl: [4] }) + two(box('Honest label', 'These usage figures are the lesson\'s guesses. This course never reads the real account or bucket — check the real invoice after 30 days before you conclude anything.', ''),
      box('Why GETs may be even fewer', 'Public files go through media.cuongthai.com: a CDN cache HIT never reaches the bucket, so it is not a Class B operation (Cloudflare docs; measured in Chapter 3).', 'lam')),
    en: 'This repo, as an estimate labelled as one. Recomputed with the free tiers, the lesson\'s own guesses give about sixty cents a month on R2, versus about thirty-eight dollars on S3. The usage numbers are guesses: always check the real invoice.' },
  { t: 'When staying on S3 is still right', body: icards([
      ['key', 'Ecosystem lock-in', 'Lambda triggers, CloudFront, IAM roles, Athena… The monthly saving may not pay for migrating and retraining.'],
      ['shield', 'Compliance / data residency', 'R2 places data automatically. It offers jurisdictional restrictions (e.g. EU) — check they fit your rules before you move.'],
      ['box', 'Missing S3 features', 'R2 implements most of the S3 API, not all: e.g. S3 Select, Object Lambda, Batch Operations are AWS-only.'],
      ['globe', 'Replication / DR', 'S3 Cross-Region Replication is built in. On R2 you design that layer yourself.'],
    ], 2) + box('Rule', 'Compute the bill with YOUR served GB and request counts, then list which of these four apply. Money is one column of the decision, not the decision.', 'lam'),
    en: 'When staying on S3 is still right: ecosystem lock-in, compliance and data residency, S3 features R2 does not have, and built-in replication. Compute your own bill, then list which of these apply.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Egress', 'bytes served out of the bucket — $0.09/GB on S3, $0 on R2'), kw('Zero egress', 'R2 bills storage + operations, never serving'), kw('Free tier', 'R2: 10 GB, 1 M Class A, 10 M Class B / month'),
      kw('Class A', 'writes + LIST: $4.50 / million'), kw('Class B', 'reads: $0.36 / million'), kw('Free operations', 'DeleteObject, DeleteBucket, AbortMultipartUpload'),
      kw('Price List API', 'AWS\'s public, machine-readable prices'), kw('Break-even', 'served GB where R2 stops being dramatically cheaper'), kw('Lock-in', 'tooling that assumes AWS'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: egress, zero egress, free tier, Class A, Class B, free operations, the AWS Price List API, break-even, and lock-in.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run gia.mjs: fetch today\'s prices yourself from the two public sources',
      'Put in YOUR month: GB stored, GB served, writes, reads — get both bills',
      'Re-run with egress 0, 1 and 50 TB: watch only the ratio move',
      'Count the requests of one feature of your app with an SDK middleware; classify them',
    ]), box('Keep these', '<ul><li>Egress: $0.09/GB on S3, $0 on R2</li><li>Storage + requests: close (R2 slightly cheaper + free tier)</li><li>1 TB / 10 TB served ⇒ ×62</li><li>No egress ⇒ ×1–2 only</li><li>Delete is free on R2; LIST is Class A</li></ul>', 'lam'), ''),
    en: 'Your turn: fetch today\'s prices yourself, compute your own month, vary egress, and count and classify the requests of one feature.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — R2 specifics', bai: '2.1 Zero egress' }, S);
