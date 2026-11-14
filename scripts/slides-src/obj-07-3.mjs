/**
 * obj-07-3 — Object Storage · Chapter 7 · 3 "Budgets, alerts, and forensics after an incident" (deck video + web, 15/11/2026).
 * Bài web: os-7-3-budgets. Output THẬT (scratchpad/obj/demo/n7-3.txt · MinIO RELEASE.2026-11-12 + audit webhook ⇒ audit.jsonl · SDK v3 3.1071.0 · jq 1.7.1 · Node 22.23.3, Mac)
 * + docs Cloudflare đọc 15/11/2026 (budget-alerts cập nhật 13/11, R2 Data Access Logs 02/10, R2 metrics 24/09): 3 khoá theo việc; cảnh báo tốc độ tự viết: mốc nền ~1 LIST/s,
 * script loạn ~216–297 LIST/s ⇒ vượt 3 cửa sổ ⇒ báo động t=+16 s; nhật ký 5.999 dòng: ci-migration-2026-11 5.432 LIST, app-primary 29, backup-worker 1, 40 sai chữ ký (không gắn được khoá);
 * 403 có trong nhật ký MinIO, R2 DAL bỏ mọi mã ≥ 400; ghi nhật ký vào chính bucket ⇒ 1 request ⇒ 2.090 PUT trong 8 s.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n7-3:file:luu-luong.mjs": "// luu-luong.mjs <khoá> <kiểu> <giây> — sinh lưu lượng THẬT bằng một khoá riêng: \"app\" = nhịp bình thường (GET/HEAD/PUT, thỉnh thoảng 1 LIST),\n// \"doc\" = như app nhưng chỉ đọc (khoá readonly), \"loop\" = script chạy loạn: liệt kê cả prefix lặp liên tục (mỗi trang 1 lệnh Class A).\nimport { readFileSync } from 'node:fs';\nimport { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';\nconst [ak, kieu, giay] = process.argv.slice(2);\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true, credentials: { accessKeyId: ak, secretAccessKey: readFileSync(`khoa-${ak}.txt`, 'utf8').trim() } });\nconst B = 'kho-73', het = Date.now() + giay * 1000, ngu = (ms) => new Promise((r) => setTimeout(r, ms));\nlet n = 0;\nwhile (Date.now() < het) {\n  if (kieu === 'loop') { let t; do { const r = await s3.send(new ListObjectsV2Command({ Bucket: B, Prefix: 'media/', MaxKeys: 100, ContinuationToken: t })); t = r.NextContinuationToken; n++; } while (t); continue; }\n  const k = `media/u42/${String(1 + Math.floor(Math.random() * 300)).padStart(5, '0')}.jpg`;\n  await s3.send(new GetObjectCommand({ Bucket: B, Key: k })).then((r) => r.Body.transformToByteArray()); await s3.send(new HeadObjectCommand({ Bucket: B, Key: k }));\n  if (kieu !== 'doc' && n % 5 === 0) await s3.send(new PutObjectCommand({ Bucket: B, Key: `media/u42/moi-${n}.jpg`, Body: 'x' }));\n  if (n % 3 === 0) await s3.send(new ListObjectsV2Command({ Bucket: B, Prefix: 'media/u42/', MaxKeys: 100 }));\n  n++; await ngu(400);\n}\nconsole.log(`${ak} (${kieu}) xong: ${n} vòng`);\n",
 "n7-3:file:canh.mjs": "// canh.mjs — \"cảnh báo tốc độ\" tự viết: mỗi 2 giây đếm số LIST trong dòng nhật ký mới (đời thật: hỏi R2 GraphQL r2OperationsAdaptiveGroups / CloudWatch mỗi phút),\n// mốc nền = trung bình 3 cửa sổ đầu; báo động khi > max(mốc nền × 5, 5/giây) ba cửa sổ LIÊN TIẾP (lab: 3 × 2 s; thật: 15 × 1 phút).\nimport { openSync, readSync, fstatSync } from 'node:fs';\nconst fd = openSync('audit.jsonl', 'r'), t0 = Date.now();\nlet doc = fstatSync(fd).size, nen = [], vuot = 0, bao = false;\nconst dem = () => { const het = fstatSync(fd).size, b = Buffer.alloc(het - doc); readSync(fd, b, 0, b.length, doc); doc = het;\n  return b.toString().split('\\n').filter((l) => l.includes('\"name\":\"ListObjectsV2\"')).length; };\nfor (let i = 0; i < 16; i++) {\n  await new Promise((r) => setTimeout(r, 2000));\n  const toc = dem() / 2;\n  const muc = nen.length < 3 ? null : Math.max(5 * nen.reduce((a, b) => a + b, 0) / nen.length, 5);\n  if (muc === null) nen.push(toc); else vuot = toc > muc ? vuot + 1 : 0;\n  const tt = muc === null ? 'đo mốc nền' : vuot >= 3 ? '🚨 BÁO ĐỘNG' : vuot ? `vượt ${vuot}/3` : 'bình thường';\n  console.log(`t=+${String(Math.round((Date.now() - t0) / 1000)).padStart(2)}s  LIST/giây ${toc.toFixed(1).padStart(6)}  ngưỡng ${muc === null ? '     —' : muc.toFixed(1).padStart(6)}  ${tt}`);\n  if (vuot >= 3 && !bao) { bao = true; console.log(`   ⇒ gửi cảnh báo lúc t=+${Math.round((Date.now() - t0) / 1000)}s — script vẫn đang chạy, còn kịp chặn`); }\n}\n",
 "n7-3:dung": "$ # Dựng: bucket kho-73 (300 object) + 3 khoá theo việc + máy thu nhật ký (audit webhook của MinIO ⇒ audit.jsonl)\n$ mc admin user list lab\nenabled app-primary readwrite\nenabled backup-worker readonly\nenabled ci-migration-2026-11 readwrite",
 "n7-3:bao": "$ node canh.mjs        # chạy song song: lưu lượng app-primary từ giây 0, script ci-migration-2026-11 chạy loạn từ giây ~10\nt=+ 2s  LIST/giây    1.0  ngưỡng      —  đo mốc nền\nt=+ 4s  LIST/giây    1.0  ngưỡng      —  đo mốc nền\nt=+ 6s  LIST/giây    0.5  ngưỡng      —  đo mốc nền\nt=+ 8s  LIST/giây    1.0  ngưỡng    5.0  bình thường\nt=+10s  LIST/giây    0.5  ngưỡng    5.0  bình thường\nt=+12s  LIST/giây  216.5  ngưỡng    5.0  vượt 1/3\nt=+14s  LIST/giây  261.5  ngưỡng    5.0  vượt 2/3\nt=+16s  LIST/giây  286.5  ngưỡng    5.0  🚨 BÁO ĐỘNG\n   ⇒ gửi cảnh báo lúc t=+16s — script vẫn đang chạy, còn kịp chặn\nt=+18s  LIST/giây  287.0  ngưỡng    5.0  🚨 BÁO ĐỘNG\nt=+20s  LIST/giây  297.5  ngưỡng    5.0  🚨 BÁO ĐỘNG\nt=+22s  LIST/giây  281.5  ngưỡng    5.0  🚨 BÁO ĐỘNG\nt=+24s  LIST/giây  275.5  ngưỡng    5.0  🚨 BÁO ĐỘNG\nt=+26s  LIST/giây  294.5  ngưỡng    5.0  🚨 BÁO ĐỘNG\nt=+28s  LIST/giây  273.0  ngưỡng    5.0  🚨 BÁO ĐỘNG\nt=+30s  LIST/giây  249.0  ngưỡng    5.0  🚨 BÁO ĐỘNG\nt=+32s  LIST/giây    2.5  ngưỡng    5.0  bình thường",
 "n7-3:tra": "$ wc -l audit.jsonl     # mỗi request S3 = một dòng JSON\n5999\n$ # Câu hỏi sau sự cố: khoá nào gọi LIST nhiều nhất? (gom theo accessKey, đếm, xếp giảm dần)\n$ jq -r 'select(.api.name==\"ListObjectsV2\") | .accessKey' audit.jsonl | sort | uniq -c | sort -rn\n5432 ci-migration-2026-11\n  40 (sai chữ ký — không gắn được khoá)\n  29 app-primary\n   1 backup-worker\n$ # Khoá đó làm gì, từ đâu, bằng công cụ gì?\n$ jq -r 'select(.accessKey==\"ci-migration-2026-11\") | [.api.name, .remotehost, .userAgent[0:40]] | @tsv' audit.jsonl | sort | uniq -c\n5432 ListObjectsV2\t172.17.0.1\taws-sdk-js/3.1071.0 ua/2.1 os/darwin#27.\n$ # Request bị từ chối (sai chữ ký) — MinIO ghi lại; nhật ký Data Access Logs của R2 thì BỎ mọi mã ≥ 400\n$ jq -r 'select(.api.statusCode>=400) | [.api.name, .api.statusCode, .accessKey // \"(sai chữ ký)\"] | @tsv' audit.jsonl | sort | uniq -c\n  40 ListObjectsV2\t403\t(sai chữ ký)\n   1 ListObjectsV2\t403\tbackup-worker",
 "n7-3:file:vong.mjs": "// vong.mjs — BẪY: ghi nhật ký vào CHÍNH bucket đang được ghi nhật ký. Mỗi sự kiện nhận được ⇒ PUT nó vào kho-73/logs/ ⇒ PUT đó lại sinh sự kiện mới…\nimport http from 'node:http';\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nlet put = 0;\nhttp.createServer((q, r) => { let b = ''; q.on('data', (c) => (b += c)); q.on('end', () => { r.end();\n  for (const l of b.split('\\n').filter((x) => x.includes('\"kho-73\"') || x.includes('/kho-73/'))) s3.send(new PutObjectCommand({ Bucket: 'kho-73', Key: `logs/${Date.now()}-${put++}.json`, Body: l })).catch(() => {});\n}); }).listen(20260);\nsetTimeout(() => { console.log(`8 giây sau MỘT request ban đầu: ${put} lệnh PUT nhật ký (Class A) — và vẫn đang tăng`); process.exit(0); }, 8000);\n",
 "n7-3:vong": "$ printf x | aws s3 cp - s3://kho-73/media/mot-request.jpg && echo \"1 request ban đầu\"\n1 request ban đầu\n8 giây sau MỘT request ban đầu: 2090 lệnh PUT nhật ký (Class A) — và vẫn đang tăng"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, ts, cmp, box, two, steps, kw, tiers, meter } from './_obj-chung.mjs';

export const deck = { key: 'obj-07-3', code: 'OBJ 7.3', title: '7.3 — Budgets, alerts, and forensics after an incident', sub: 'Chapter 7 · Lesson 7.3' };
const O = (k) => { const v = DU_LIEU[`n7-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.split('\n').filter((l) => !/^\$ #/.test(l)).join('\n');
const BAO = O('bao');
const TRA = bo(O('tra')).split('\n');
const iRej = TRA.findIndex((l) => l.includes('statusCode>=400'));
const TRA1 = TRA.slice(0, iRej).join('\n'), TRA2 = TRA.slice(iRej).join('\n');
const VONG = O('vong');

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.3', t: 'Budgets, alerts, and<br>forensics after an incident', sub: 'Hear about a runaway script in seconds, not on next month\'s invoice — and name the key that did it',
    en: 'Chapter seven, lesson three: budgets, alerts, and forensics after an incident. Hear about a runaway script in seconds, not on next month\'s invoice, and name the key that did it.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three defences, and the one question each answers</li>
    <li>What Cloudflare's budget alert really does (and does not)</li>
    <li>A rate alarm you build yourself — measured firing in 16 s</li>
    <li>R2 Data Access Logs: fields, 7 days, and the 4xx blind spot</li>
    <li>The forensic query, and the log loop that bills itself</li></ul>`,
    en: 'Takeaways: three defences and the question each answers; what Cloudflare\'s budget alert really does; a rate alarm you build yourself; R2 data access logs and their blind spot; and the forensic query.' },
  { t: 'Three defences, three questions', body: tiers([
      ['bell', 'Budget alert — "did we spend too much?"', 'catches the RESULT, after the money is spent', '#2563eb'],
      ['clock', 'Rate alarm — "is something calling too often, right now?"', 'catches the CAUSE while it runs', '#e0590b'],
      ['search', 'Request log — "which key did this, from where?"', 'names the CULPRIT afterwards', '#1f8a3b'],
    ], { th: 78, gap: 30 }) + box('Drop one, lose one answer', 'Without the budget alert you hear late; without the rate alarm you cannot stop it mid-run; without logs you never learn who did it.', ''),
    en: 'Three defences, three questions. A budget alert asks whether you spent too much; it catches the result. A rate alarm asks whether something is calling too often right now; it catches the cause. A request log names the key afterwards.' },
  { t: 'Layer 1 — budget alerts, as they exist today', body: two(box('Cloudflare (docs 13/11/2026)', '<ul><li>Billing → <b>Billable Usage</b> → Create budget alert: a USD threshold + email recipients</li><li><b>Account-wide</b> usage-based spend, not per bucket</li><li>One email when crossed; resets each billing period</li><li><b>Informational only — it does not stop usage</b>; Pay-as-you-go accounts</li></ul>', 'lam'),
      box('AWS Budgets', '<ul><li>Cost budget, monthly amount</li><li>Alerts on <b>actual</b> and on <b>forecast</b> (e.g. 80% actual, 100% actual, 100% forecast)</li><li>Targets: email, SNS → pager / chat</li></ul>', '')) +
      box('Corrected', 'The lesson described "Billing → Notifications" with "projected" thresholds on Cloudflare. Today\'s docs: budget alerts live under Billable Usage and fire on <b>cumulative actual</b> spend; per-product usage notifications (Pro plan and up) are a separate thing.', 'do2'),
    en: 'Layer one, budget alerts as they exist today. On Cloudflare: billable usage, create budget alert, a dollar threshold, account-wide, one email, and it never stops usage. AWS Budgets can alert on actual and on forecast spend.' },
  { t: 'Choosing the numbers', body: two(box('From last month', '<ul><li>Warning at <b>steady state × 1.5</b></li><li>Pager at × 1.5 again (≈ × 2.25)</li><li>The goal is not precision — it is hearing about a <b>doubling within a day</b>, not a week</li></ul>', 'lam'),
      box('The forecast-only trap', 'A forecast extrapolates; a sudden spike may not move it fast enough. On AWS pair every forecast alert with an <b>actual 100%</b> alert. On Cloudflare there is no forecast — only actual — so set the first threshold low.', 'do2')) +
      box('Example', 'Steady state $40/month ⇒ warning $60, pager $90. A weekend runaway at 300 LIST/s (lesson 7.1) is ~$3,500/month of Class A — it crosses both within hours.', ''),
    en: 'Choosing the numbers: warn at steady state times one and a half, page at that again. The goal is to hear about a doubling within a day. Beware forecast-only alerts; on Cloudflare there is only actual spend, so set the first threshold low.' },
  { t: 'Layer 2 — a rate alarm you build yourself', body: ts(`// canh.mjs (core) — every 2 s count LIST requests in new log lines
// real life: poll R2's GraphQL r2OperationsAdaptiveGroups (or CloudWatch) every minute
const toc = countNewLines('"name":"ListObjectsV2"') / 2;          // LIST per second
const muc = base.length < 3 ? null
  : Math.max(5 * avg(base), 5);                                     // threshold = baseline × 5
if (muc === null) base.push(toc);                                   // first 3 windows = baseline
else over = toc > muc ? over + 1 : 0;                               // consecutive windows
if (over >= 3) alert('LIST rate', toc, muc);                        // lab 3 × 2 s; real 15 × 1 min`, { fs: 15 }) +
      box('Why build it', 'R2 exposes operations per type through its GraphQL Analytics API (dataset <code>r2OperationsAdaptiveGroups</code>, up to 31 days), but has no threshold alarm on Class A rate. A small poller is the alarm.', 'lam'),
    en: 'Layer two: a rate alarm you build yourself. R2 exposes operation counts through its GraphQL analytics API but has no rate alarm. A small poller is the alarm: learn a baseline, and fire when the rate stays above five times the baseline for three windows in a row.' },
  { t: 'Measured: the alarm fires while the script still runs', body: tn(BAO, { fs: 13, wrap: 130 }) +
      box('Read it', 'Baseline ~1 LIST/s from the app key. The runaway key starts at ~10 s: 216–297 LIST/s. Three windows over the threshold ⇒ <b>alarm at +16 s</b> — a budget alert would have fired days later.', 'lam'),
    en: 'Measured. The app traffic gives a baseline of about one list per second. The runaway script starts around ten seconds in, at two to three hundred lists per second. After three windows above the threshold the alarm fires at sixteen seconds, while the script is still running.' },
  { t: 'Layer 3 — R2 Data Access Logs (docs 02/10/2026)', body: cmp(['', 'What you get'], [
      ['Turn on', 'Per bucket: Bucket settings → Data Access Logs → Enabled; view in Workers Observability'],
      ['Who', '<code>actor.accessKeyId</code> (SigV4 key), <code>actor.type</code>, <code>interface</code> (S3 / API / Workers / Public)'],
      ['What, where', '<code>action</code>, <code>request.method</code>, <code>request.uri</code>, <code>response.status</code>, <code>requestMetadata.ip</code>, <code>userAgent</code>'],
      ['Retention', '<b>7 days</b> — export yourself if you need 30'],
      ['Blind spot', '<b>Only status &lt; 400</b>; best effort, events may be delayed or omitted'],
    ], { fs: 17 }) + box('Corrected', 'The lesson said "R2 request logs via Logpush, keep 30 days". The Logpush dataset list has no R2 dataset; R2\'s per-request log is Data Access Logs, kept 7 days, from 1/12/2026 billed as Observability.', 'do2'),
    en: 'Layer three on R2: data access logs. Enabled per bucket, viewed in Workers observability. Each event carries the access key ID, the action, the URI, the status, the client IP and user agent. Retention is seven days, and only requests below status 400 are logged.' },
  { t: 'Measured: "which key did this?"', body: tn(TRA1, { fs: 14, wrap: 124 }) + meter([['ci-migration-2026-11', 5432, '#c0392b'], ['wrong signature (no key)', 40, '#94a3b8'], ['app-primary', 29, '#2563eb'], ['backup-worker', 1, '#1f8a3b']], { don: 'LIST', nhan: 300, rh: 30, fs: 16, log: true }) +
      box('Five seconds to an answer', 'One key made <b>5,432 of the LIST calls</b>, two orders of magnitude above the next. Same IP, same SDK. That is the incident: rotate the key, stop the script, add the alarm you wished you had.', 'lam'),
    en: 'Measured: which key did this? Group the log by access key and count. One key made 5,432 list calls, two orders of magnitude above the next. Same IP, same SDK. Rotate it, stop the script, add the alarm.' },
  { t: 'What the log cannot tell you', body: tn(TRA2, { fs: 19, wrap: 96 }) + meter([['MinIO audit log', 41, '#c0392b'], ['R2 Data Access Logs', 0, '#94a3b8']], { don: 'rejected requests', nhan: 300, rh: 48, fs: 19 }) + two(
      box('Failed signatures have no owner', '40 requests with a wrong secret: MinIO logged them, but <b>no access key</b> could be attached — the signature never verified.', ''),
      box('R2 drops them entirely', 'Data Access Logs exclude every status ≥ 400. A flood of 403s from someone guessing keys or URLs will <b>not</b> appear there — look at your edge/WAF logs instead.', 'do2')),
    en: 'What the log cannot tell you. Forty requests with a wrong secret were logged by MinIO without any key attached, because the signature never verified. And R2\'s data access logs drop every status of 400 and above, so a flood of 403s never appears there.' },
  { t: 'Trap: logging into the bucket you are logging', body: tn(VONG, { fs: 19, wrap: 96 }) + meter([['requests you made', 1, '#2563eb'], ['log PUTs after 8 s', 2090, '#c0392b']], { don: 'req', nhan: 300, rh: 52, fs: 20, log: true }) +
      box('Measured: 1 request ⇒ 2,090 PUTs in 8 s', 'Each log write is itself a request, which produces a log event, which is written… The lab loop wrote <b>2,090 Class A</b> from one upload and was still climbing. Log into a <b>separate</b> bucket, and exclude it from its own logging.', 'do2'),
    en: 'A trap, measured: writing logs into the same bucket you are logging. Every log write is a request, which produces a log event, which is written again. One upload became 2,090 puts in eight seconds, still climbing. Always log into a separate bucket.' },
  { t: 'The one-page runbook', body: steps([
      '<b>Budget alert fires</b> → open operations by type for the last week. A cliff or a step is a signal; a smooth ramp is real growth — raise the budget instead.',
      '<b>Rate alarm fires</b> → run the per-key count on the last hour of logs. The top key is almost always the culprit; confirm with its owner, then rotate or revoke.',
      '<b>After the incident</b> → lower the alarm threshold to just below what this incident looked like; one key per workload so the next culprit is obvious (lesson 2.3).',
    ]) + box('Five minutes, written before you need it', 'Save the query (group by key, sort by count) next to the alarm. During an incident nobody wants to remember jq syntax.', 'lam'),
    en: 'The one-page runbook. Budget alert: look at operations by type, a step means trouble, a smooth ramp means growth. Rate alarm: count requests per key in the last hour and rotate the top one. Afterwards: lower the threshold, and keep one key per workload.' },
  { t: 'Real life, what-if, and the attacker\'s view', body: two(box('Real life', '<ul><li>A teammate debugs with a listing loop and leaves it running over the weekend — Monday\'s surprise is a Class A line, not a breach.</li><li>A smoke detector (rate alarm) beats reading the electricity bill (budget alert) to learn the house is on fire.</li></ul>', 'lam'),
      box('What if…', '<ul><li>…everyone shares one key? The per-key query returns one line: you know <i>that</i> it happened, never <i>who</i>.</li><li>…the logs are only kept 7 days and you look on day 9? Gone — export them.</li></ul>', '')) +
      box('The attacker\'s view', 'Someone with a leaked key wants to stay unseen: they stay <b>under</b> your alarm\'s threshold, or make requests that fail (4xx never reach R2\'s logs). Defences: thresholds from a real baseline, one key per workload, rotation on any doubt, and edge logs for the failures.', 'do2'),
    en: 'Real life: a debug loop left running over the weekend; a smoke detector beats the electricity bill. What if everyone shares one key? You learn that it happened, never who. The attacker\'s view: stay under the threshold, or use requests that fail, which R2\'s logs never show.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Budget alert', 'account spend crosses $X — one email'), kw('Rate alarm', 'ops/s above baseline × 5 for N windows'), kw('Baseline', 'the normal rate'),
      kw('Steady state', 'a normal month'), kw('Data Access Logs', 'R2 per-request log, 7 days, < 400'), kw('accessKeyId', 'who signed the request'),
      kw('Forensics', 'query the log after the incident'), kw('Blast radius', 'what one key can do before you notice'), kw('Log loop', 'logging into the logged bucket'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: budget alert, rate alarm, baseline, steady state, data access logs, access key ID, forensics, blast radius, and the log loop.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Create a budget alert at steady state × 1.5',
      'Write the rate alarm: baseline, × 5, N windows in a row',
      'Turn on request logging to a SEPARATE bucket; export if you need > 7 days',
      'Save the per-key forensic query next to the alarm',
      'Give every workload its own key',
    ]), box('Keep these', '<ul><li>Result · cause · culprit</li><li>Budget alerts do not stop usage</li><li>Alarm in seconds, not on the invoice</li><li>R2 logs: 7 days, &lt; 400 only</li><li>Never log into the logged bucket</li></ul>', 'lam'), ''),
    en: 'Your turn: a budget alert at steady state times one and a half, a rate alarm with a baseline, logging into a separate bucket, the forensic query saved next to the alarm, and one key per workload.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Cost management', bai: '7.3 Budgets, alerts, forensics' }, S);
