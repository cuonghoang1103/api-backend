/**
 * obj-00-9 — Object Storage · Section 0 · Start here (2/2) "Why it matters: money, safety, and how to study this course" (deck video + web, 14/11/2026).
 * Bài web: os-0-0b-vi-sao-quan-trong. Output THẬT (scratchpad/obj/demo/n0-9.txt, Mac · Node 22.23.3 · MinIO RELEASE.2026-11-12 · aws-cli 2.31.22):
 * giá egress đọc THẲNG bảng giá công khai AWS (AWSDataTransfer us-east-1, công bố 2026-11-11: 0,09/0,085/0,07/0,05 $/GB) + trang giá R2 (egress Free,
 * Standard $0.015/GB-tháng, Class A $4.50/triệu, Class B $0.36/triệu) ⇒ 1/5/20 TB: $83,16 / $451,80 / $1.783,50 vs $0 (bài web $460,80 = không trừ 100 GB miễn phí);
 * bucket private: người lạ GET/LIST 403 AccessDenied ⇒ một policy public ⇒ GET 200 + LIST lộ cả key cccd ⇒ gỡ policy 403; presigned URL: đúng 200, sửa 1 ký tự
 * đường dẫn / sửa X-Amz-Expires ⇒ SignatureDoesNotMatch, hết hạn ⇒ "Request has expired"; kho: commit 60e28eafd (28/07/2026) signableHeaders, r2.ts:171.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-9:file:gia-egress.mjs": "// Giá egress THẬT hôm nay: bảng giá công khai của AWS (AWSDataTransfer, us-east-1, ra Internet) + trang giá R2 của Cloudflare.\nconst aws = await (await fetch('https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSDataTransfer/current/us-east-1/index.json')).json();\nconst bac = [];\nfor (const [sku, p] of Object.entries(aws.products)) {\n  const a = p.attributes;\n  if (a.fromLocation !== 'US East (N. Virginia)' || a.toLocation !== 'External' || a.transferType !== 'AWS Outbound') continue;\n  for (const t of Object.values(aws.terms.OnDemand[sku])) for (const r of Object.values(t.priceDimensions))\n    bac.push({ tu: +r.beginRange, den: r.endRange === 'Inf' ? Infinity : +r.endRange, gia: +r.pricePerUnit.USD });\n}\nbac.sort((x, y) => x.tu - y.tu);\nconsole.log(`AWS bảng giá công bố ${aws.publicationDate.slice(0, 10)} — egress S3 ra Internet (us-east-1):`);\nfor (const b of bac) console.log(`  ${String(b.tu).padStart(6)} – ${String(b.den).padEnd(8)} GB/tháng: $${b.gia.toFixed(3)}/GB`);\nconst r2 = await (await fetch('https://developers.cloudflare.com/r2/pricing/index.md')).text();\nconsole.log('R2 (developers.cloudflare.com/r2/pricing):');\nfor (const l of r2.split('\\n').filter((l) => /^\\| (Storage|Class A Operations|Class B Operations|Egress) +\\| \\$|^\\| Egress/.test(l)).slice(0, 4)) console.log('  ' + l.replace(/<sup>.*?<\\/sup>/g, '').replace(/\\s+\\|\\s*$/, '').replace(/\\s+/g, ' '));\nconst tien = (gb) => { let c = 0, con = Math.max(0, gb - 100); for (const b of bac) { const lop = Math.min(con, b.den - b.tu); if (lop <= 0) break; c += lop * b.gia; con -= lop; } return c; };\nconsole.log('Phục vụ ra Internet mỗi tháng   S3 (trừ 100 GB miễn phí)   R2');\nfor (const tb of [1, 5, 20]) console.log(`  ${String(tb).padStart(2)} TB = ${String(tb * 1024).padStart(6)} GB      $${tien(tb * 1024).toFixed(2).padStart(8)}                  $0`);\nconsole.log(`Tính tay như bài web (5.120 GB × $0,09, không trừ miễn phí): $${(5120 * 0.09).toFixed(2)}`);\n",
 "n0-9:gia": "$ node gia-egress.mjs\nAWS bảng giá công bố 2026-11-11 — egress S3 ra Internet (us-east-1):\n       0 – 10240    GB/tháng: $0.090/GB\n   10240 – 51200    GB/tháng: $0.085/GB\n   51200 – 153600   GB/tháng: $0.070/GB\n  153600 – Infinity GB/tháng: $0.050/GB\nR2 (developers.cloudflare.com/r2/pricing):\n  | Storage | $0.015 / GB-month | $0.01 / GB-month\n  | Class A Operations | $4.50 / million requests | $9.00 / million requests\n  | Class B Operations | $0.36 / million requests | $0.90 / million requests\n  | Egress (data transfer to Internet) | Free | Free\nPhục vụ ra Internet mỗi tháng   S3 (trừ 100 GB miễn phí)   R2\n   1 TB =   1024 GB      $   83.16                  $0\n   5 TB =   5120 GB      $  451.80                  $0\n  20 TB =  20480 GB      $ 1783.50                  $0\nTính tay như bài web (5.120 GB × $0,09, không trừ miễn phí): $460.80",
 "n0-9:file:cong-khai.json": "{ \"Version\": \"2012-10-17\",\n  \"Statement\": [{ \"Effect\": \"Allow\", \"Principal\": \"*\",\n    \"Action\": [\"s3:GetObject\", \"s3:ListBucket\"],\n    \"Resource\": [\"arn:aws:s3:::ho-so-lop\", \"arn:aws:s3:::ho-so-lop/*\"] }] }\n",
 "n0-9:public": "$ aws s3 mb s3://ho-so-lop\nmake_bucket: ho-so-lop\n$ aws s3 cp bang-diem.txt s3://ho-so-lop/ && aws s3 cp cccd-an.txt s3://ho-so-lop/sinh-vien/an/\nđã tải 2 tệp\n$ # Người lạ, KHÔNG có khoá, thử đọc và liệt kê:\n$ curl -s -o /dev/null -w \"GET tệp: %{http_code}\\n\" http://localhost:20200/ho-so-lop/bang-diem.txt\nGET tệp: 403\n$ curl -s http://localhost:20200/ho-so-lop/bang-diem.txt | grep -oE \"<Code>[^<]+</Code>\"\n<Code>AccessDenied</Code>\n$ curl -s -o /dev/null -w \"LIST bucket: %{http_code}\\n\" \"http://localhost:20200/ho-so-lop?list-type=2\"\nLIST bucket: 403\n$ # Một dòng cấu hình \"cho tiện\": mở public cả đọc lẫn liệt kê\n$ aws s3api put-bucket-policy --bucket ho-so-lop --policy file://cong-khai.json && echo \"policy: public\"\npolicy: public\n$ curl -s -o /dev/null -w \"GET tệp: %{http_code}\\n\" http://localhost:20200/ho-so-lop/bang-diem.txt\nGET tệp: 200\n$ curl -s \"http://localhost:20200/ho-so-lop?list-type=2\" | grep -oE \"<Key>[^<]+</Key>\"\n<Key>bang-diem.txt</Key>\n<Key>sinh-vien/an/cccd-an.txt</Key>\n$ curl -s http://localhost:20200/ho-so-lop/sinh-vien/an/cccd-an.txt\nCCCD 0790xxxxxxx\n$ # Sửa: gỡ policy ⇒ private trở lại\n$ aws s3api delete-bucket-policy --bucket ho-so-lop && curl -s -o /dev/null -w \"GET tệp: %{http_code}\\n\" http://localhost:20200/ho-so-lop/bang-diem.txt\nGET tệp: 403",
 "n0-9:ky": "$ URL=$(aws s3 presign s3://ho-so-lop/bang-diem.txt --expires-in 5)\nhttp://localhost:20200/ho-so-lop/bang-diem.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential\n…\n$ curl -s -o /dev/null -w \"URL ký đúng: %{http_code}\\n\" \"$(cat url.txt)\"\nURL ký đúng: 200\n$ # Sửa MỘT ký tự trong đường dẫn (bang-diem ⇒ bang-diex), giữ nguyên chữ ký\n$ curl -s \"$(sed 's/bang-diem/bang-diex/' url.txt)\" | grep -oE \"<Code>[^<]+</Code>\"\n<Code>SignatureDoesNotMatch</Code>\n$ # Sửa thời hạn (X-Amz-Expires=5 ⇒ 99999) để \"gia hạn\" chùa\n$ curl -s \"$(sed 's/X-Amz-Expires=5/X-Amz-Expires=99999/' url.txt)\" | grep -oE \"<Code>[^<]+</Code>\"\n<Code>SignatureDoesNotMatch</Code>\n$ # 6 giây sau — URL đã hết hạn\n$ curl -s \"$(cat url.txt)\" | grep -oE \"<Code>[^<]+</Code>|<Message>[^<]+</Message>\"\n<Code>AccessDenied</Code>\n<Message>Request has expired</Message>",
 "n0-9:bug": "$ cd ~/Downloads/api-backend && git log --format='%h %ad %s' --date=short -S signableHeaders -- src/ | cut -c1-110\n60e28eafd 2026-07-28 fix(upload): ràng buộc Content-Type khi ký URL + chặn bom giải nén ảnh\n$ cd ~/Downloads/api-backend && grep -n \"signableHeaders\" src/config/r2.ts | cut -c1-120\n140: * SECURITY: `signableHeaders` is what actually pins the content type.\n171:    signableHeaders: new Set(['content-type']),"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, icards, cmp, box, two, steps, kw, c, flow, meter, path, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-00-9', code: 'OBJ 0.9', title: 'Start here (2/2) — Why it matters: money, safety, and how to study', sub: 'Section 0 · Start here (2/2)' };
const O = (k) => { const v = DU_LIEU[`n0-9:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const GIA = O('gia');
const TB = GIA.split('\n').filter((l) => /^\s+\d+ TB =/.test(l)).map((l) => { const m = /(\d+) TB =\s+(\d+) GB\s+\$\s*([\d.]+)/.exec(l); return [+m[1], +m[2], +m[3]]; });
const PUB = O('public').split('\n').filter((l) => !/^\$ #|^\$ aws s3 (mb|cp)|^make_bucket|^đã tải|grep -oE "<Code>|^<Code>/.test(l)).join('\n'), KY = O('ky'), BUG = O('bug');
const usd = (x) => '$' + x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (2/2)', t: 'Why it matters:<br>money, safety, and how to study', sub: 'A real price list, a real leak, a real forged signature — and a one-week path to shipping uploads safely',
    en: 'Start here, part two: why object storage is worth learning properly. Two currencies of pain — money and safety — then the course map and a one-week path.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Egress: the line that surprises the bill — from today's real price lists</li>
    <li>Zero egress is not zero cost: storage and operations still bill</li>
    <li>A private bucket made public by one policy line — measured</li>
    <li>A signed URL: what a forged character or a stretched expiry gets you</li>
    <li>The real SigV4 bug this repo fixed in production</li>
    <li>The map of eleven sections, and the shortest path to ship uploads</li></ul>`,
    en: 'Six takeaways: egress from real price lists; zero egress is not zero cost; a bucket made public by one policy line; what tampering with a signed URL gets you; the real SigV4 bug in this repo; and the map plus the shortest path.' },
  { t: 'Money pain: egress — read from today\'s price lists', body: tn(GIA, { fs: 14, wrap: 104 }) +
      box('Where the numbers come from', `The AWS public price file (${c('AWSDataTransfer')}, us-east-1, published 2026-11-11) and Cloudflare's R2 pricing page — fetched by a script, not copied from a blog.`, 'lam'),
    en: 'Money pain: egress, the bytes served out. The numbers here come from a script that read the AWS public price file, published on the eleventh of November twenty twenty-six, and the Cloudflare R2 pricing page. S3 egress to the internet starts at nine cents per gigabyte; R2 egress is free.' },
  { t: 'Serving 1, 5 and 20 TB a month', body: two(cmp(['Served per month', 'S3 egress', 'R2 egress'], TB.map(([t, gb, s]) => [`${t} TB = ${gb.toLocaleString('en-US')} GB`, `<b>${usd(s)}</b>`, '<b>$0</b>']), { hl: [1] }),
      box('How S3 was computed', 'Tiered: $0.09/GB for the first 10 TB, $0.085 for the next 40 TB…, after 100 GB/month free. The web lesson\'s quick estimate, 5,120 GB × $0.09 = $460.80, skips the free tier.', 'lam'), 'r64') +
      box('Zero egress is not zero cost', `R2 still bills storage (${c('$0.015/GB-month')}) and operations — Class A writes ${c('$4.50/million')}, Class B reads ${c('$0.36/million')}. A runaway script doing a million HEADs still costs money. Chapter 7.`, 'do2'),
    en: 'Serving one, five and twenty terabytes a month. On S3 that is about eighty-three, four hundred fifty-two and one thousand seven hundred eighty-four dollars, after the first hundred gigabytes free. On R2, zero. But zero egress is not zero cost: R2 still bills storage and every write and read operation.' },
  { t: 'Safety pain #1: one policy line made it public', body: two(tn(PUB, { fs: 13, wrap: 74 }),
      `<div>${box('Before: private', 'A stranger with no key: <b>403 AccessDenied</b> on both GET and LIST.', 'xanh')}${box('After one policy: everything', 'GET 200 — and LIST hands out every key, including the ID-card file nobody linked to.', 'do2')}${box('Fix', 'Remove the policy: 403 again. Chapter 3: private bucket + signed URLs.', '')}</div>`, 'r64'),
    en: 'Safety pain number one, measured on MinIO. A stranger without keys got four oh three on both read and list. One bucket policy that allows read and list for everyone, and the stranger got the file, plus a list of every key, including an ID card file nobody had linked anywhere.' },
  { t: 'Safety pain #2: what a signature protects', body: tn(KY, { fs: 14, wrap: 104 }) +
      icards([
        ['check', 'Signed correctly', 'the exact URL → 200, until it expires'],
        ['warn', 'One character changed', 'path or expiry edited → SignatureDoesNotMatch'],
        ['clock', 'Expired', '5 s later → AccessDenied · Request has expired'],
      ], 3),
    en: 'Safety pain number two: signatures. A presigned URL worked once. Changing one character of the path, or stretching the expiry, gave Signature Does Not Match. Six seconds later the same URL said Request has expired. The signature covers exactly what was signed — so signing the wrong thing is the danger.' },
  { t: 'The real bug: what this repo forgot to sign', body: two(tn(BUG, { fs: 15, wrap: 66 }),
      box('Fixed in production, 28/07/2026', `Upload URLs were signed WITHOUT the content type, so a browser could PUT an HTML file where an image was expected — and the CDN would serve it as HTML. The fix pins it: ${c("signableHeaders: new Set(['content-type'])")}. Chapter 4 reproduces it on MinIO.`, 'do2'), 'r64') +
      path([{ t: 'browser', s: 'PUT evil.html' }, { t: 'signed URL', s: 'type NOT signed', mau: '#c0392b', on: true }, { t: 'bucket', s: 'stores text/html' }, { t: 'CDN', s: 'serves it as a page' }, { t: 'visitor', s: 'runs its script', mau: '#c0392b' }],
        { nhan: ['any type', 'ok', 'cached', 'XSS'], h: 150, fs: 19 }),
    en: 'The real bug in this repo. Upload URLs were once signed without the content type, so a browser could upload an HTML file where an image was expected. Commit sixty e two eight, on the twenty-eighth of July twenty twenty-six, pinned the content type with signableHeaders. Chapter four reproduces it on MinIO.' },
  { t: 'What makes this course different', body: icards([
      ['test', 'Measured, not copied', 'every number comes from a run: MinIO in Docker, the AWS CLI, AWS SDK v3 3.1071.0 — the version in this repo'],
      ['code', 'This repo\'s real code', `${c('src/config/r2.ts')}, the upload service, the real key layout, the real Cache-Control values, the real bug`],
      ['lock', 'Never the production bucket', 'labs run on a local MinIO; the repo itself refuses to touch the real bucket in tests (storage sandbox)'],
      ['search', 'Say which is which', 'a measured number says so; a list price names its source page and date'],
    ], 2),
    en: 'What makes this course different: numbers are measured on MinIO with the AWS CLI and the same SDK version as the repo; the code is the repo\'s real storage code; labs never touch the production bucket; and every claim says whether it was measured or quoted, with its source.' },
  { t: 'The map — eleven sections', body: cmp(['Section', 'What you get'], [
      ['0 · Concept', 'object storage vs filesystem; bucket / key / object'], ['1 · S3 API', 'SDK v3 client; Put / Get / Head / Delete; multipart'],
      ['2 · R2 specifics', 'zero egress; R2 quirks; access keys and rotation'], ['3 · URLs & access', 'three URL types; Cache-Control; signed URLs'],
      ['4 · Presigned upload', 'browser PUT; the SigV4 signing bug'], ['5 · CORS', 'let the browser talk to the bucket, safely'],
      ['6 · Lifecycle', 'expiry rules; abort dead multipart uploads; orphans'], ['7 · Cost', 'storage + operations + egress = the bill'],
      ['8 · Migration', 'S3 → R2 without losing an object'], ['9 · Diagnosis', '403, CORS, stale cache — read the real cause'], ['10 · Exam', 'what survived measurement + final exam'],
    ], { fs: 17 }), to: true,
    en: 'The map, eleven sections: concept; the S3 API; R2 specifics; URLs and access; presigned uploads; CORS; lifecycle; cost; migration; diagnosis; and the final review with the exam.' },
  { t: 'The shortest path: ship avatar uploads in a week', body: flow([
      { t: 'Sec 0', s: 'concept' }, { t: '1.1 · 1.2', s: 'client + 4 ops' }, { t: '3.1 · 3.2', s: 'URL types + cache' },
      { t: 'Ch 4', s: 'presigned upload', mau: XANH }, { t: 'Ch 5', s: 'CORS', mau: XANH },
    ], { h: 140, fs: 22 }) + two(box('Enough to ship safely', 'Multipart, lifecycle, cost and migration can wait until you meet them — the map tells you where they are.', 'xanh'),
      box('The trap: "R2 is free, so cost does not matter"', 'Zero egress removes the scariest line, not your duty to measure. Storage and every operation still bill — that is why Chapter 7 exists.', 'do2')) +
      icards([['layers', 'Files over ~100 MB?', 'multipart upload — 1.3'], ['trash', 'Bucket keeps growing?', 'lifecycle + orphans — Ch 6'], ['gauge', 'Bill surprised you?', 'cost drivers — Ch 7'], ['merge', 'Changing provider?', 'migration S3 → R2 — Ch 8']], 4),
    en: 'The shortest path, if all you need is avatar uploads: section zero, then one point one and one point two, three point one and three point two, chapter four and chapter five. The trap to avoid: thinking R2 is free so cost does not matter.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Egress', 'bytes served out — AWS bills it, R2 does not'), kw('Free tier', 'the first 100 GB/month of AWS egress'), kw('Class A / Class B', 'billed write-type vs read-type operations'),
      kw('Public vs private bucket', 'anyone can read, or only signed/authenticated requests'), kw('Bucket policy', 'a JSON document that grants actions to principals'),
      kw('Signed URL', 'a time-limited URL that carries a signature'), kw('SigV4', 'AWS Signature Version 4 — signs every request'), kw('SignatureDoesNotMatch', 'what you get when anything signed was changed'),
      kw('signableHeaders', 'which headers the presigned URL pins'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: egress and the free tier; Class A and Class B operations; public versus private bucket; bucket policy; signed URL; SigV4; Signature Does Not Match; and signableHeaders.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run the price script (or read both pricing pages) and compute S3 vs R2 egress for YOUR monthly traffic',
      'On your MinIO: upload a file, try it as a stranger (403), add a public policy, LIST as a stranger — then remove it',
      `Presign a URL with ${c('--expires-in 30')}; edit one character; wait it out — read the error codes`,
      'Write your one-line gate: "Is this bucket public on purpose, and are all secrets outside Git?"',
    ]), box('Keep these', `<ul><li>Egress is the surprise line: ${usd(TB[1][2])} vs $0 for 5 TB</li><li>Zero egress ≠ zero cost</li><li>One policy line can expose every key</li><li>A signature pins exactly what was signed</li><li>Shortest path: 0 → 1.1/1.2 → 3.1/3.2 → 4 → 5</li></ul>`, 'lam'), ''),
    en: 'Your turn: compute egress for your own traffic; on MinIO, test a file as a stranger, open a public policy, list as a stranger, then remove it; tamper with and outlive a presigned URL; and write your one-line gate before any bucket goes live.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What object storage really is', bai: 'Start here 2/2' }, S);
