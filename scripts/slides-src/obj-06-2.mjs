/**
 * obj-06-2 — Object Storage · Chapter 6 · 2 "Expiring objects by age" (deck video + web, 14/11/2026).
 * Bài web: os-6-2-expiration. Output THẬT (scratchpad/obj/demo/n6-2.txt · MinIO RELEASE.2026-11-12 · aws-cli 2.31.22 · Node 22.23.3, Mac):
 * luật exports/ 30 ngày + tmp-24h/ 1 ngày ⇒ mỗi object mang x-amz-expiration (14/11 09:43 UTC ⇒ 15/12 00:00 · 16/11 00:00 — làm tròn lên nửa đêm UTC), users/ ⇒ None;
 * Prefix "report" (không /) ⇒ report.pdf, reports/annual-2026.csv, reporting-config.json đều dính, users/report.pdf không; hai luật chồng ⇒ hạn sớm hơn thắng;
 * Expiration.Date đã qua ⇒ tmp-24h/ trống NGAY, tệp mới tải vào cũng 404; Expiration.Days 0 ⇒ InvalidArgument "Days must be positive integer"; luật đang chạy khớp tệp trong repo.
 * Docs R2 (26/10/2026): "typically removed … within 24 hours of the x-amz-expiration value"; 1000 luật/bucket.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-2:file:han.json": "{\"Rules\":[\n {\"ID\":\"het-han-exports-30d\",\"Status\":\"Enabled\",\"Filter\":{\"Prefix\":\"exports/\"},\"Expiration\":{\"Days\":30}},\n {\"ID\":\"het-han-tmp-1d\",\"Status\":\"Enabled\",\"Filter\":{\"Prefix\":\"tmp-24h/\"},\"Expiration\":{\"Days\":1}}\n]}\n",
 "n6-2:han": "$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://han.json\nđã đặt 2 luật\nbây giờ (UTC): 2026-11-14 09:43\n$ # Mỗi object tự mang hạn của nó — header x-amz-expiration\n$ for k in exports/u42/2026-11.csv tmp-24h/reset-7f3a.json users/u42/avatar.jpg; do aws s3api head-object --bucket kho-han --key $k --query Expiration; done\nexports/u42/2026-11.csv      expiry-date=\"Tue, 15 Dec 2026 00:00:00 GMT\", rule-id=\"het-han-exports-30d\"\ntmp-24h/reset-7f3a.json      expiry-date=\"Mon, 16 Nov 2026 00:00:00 GMT\", rule-id=\"het-han-tmp-1d\"\nusers/u42/avatar.jpg         None",
 "n6-2:file:tien.json": "{\"Rules\":[{\"ID\":\"thieu-gach-cheo\",\"Status\":\"Enabled\",\"Filter\":{\"Prefix\":\"report\"},\"Expiration\":{\"Days\":30}}]}\n",
 "n6-2:tien": "$ # Bẫy: prefix \"report\" KHÔNG có dấu / ở cuối\n$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://tien.json && echo 'đã đặt Prefix: \"report\"'\nđã đặt Prefix: \"report\"\n$ for k in report.pdf reports/annual-2026.csv reporting-config.json users/report.pdf; do aws s3api head-object … --query Expiration; done\nreport.pdf                 expiry-date=\"Tue, 15 Dec 2026 00:00:00 GMT\", rule-id=\"thieu-gach-cheo\"\nreports/annual-2026.csv    expiry-date=\"Tue, 15 Dec 2026 00:00:00 GMT\", rule-id=\"thieu-gach-cheo\"\nreporting-config.json      expiry-date=\"Tue, 15 Dec 2026 00:00:00 GMT\", rule-id=\"thieu-gach-cheo\"\nusers/report.pdf           None",
 "n6-2:file:nham.json": "{\"Rules\":[{\"ID\":\"don-mot-lan\",\"Status\":\"Enabled\",\"Filter\":{\"Prefix\":\"tmp-24h/\"},\"Expiration\":{\"Date\":\"2026-11-14T00:00:00Z\"}}]}\n",
 "n6-2:ngay": "$ # Nếu… ai đó đặt luật hết hạn theo NGÀY đã qua (định \"dọn một lần\" rồi quên gỡ)?\n$ aws s3 ls s3://kho-han/tmp-24h/\n2026-11-14 16:43:19          2 reset-7f3a.json\n$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://nham.json && echo 'đã đặt Date: 2026-11-14 (đã qua)'\nđã đặt Date: 2026-11-14 (đã qua)\n$ aws s3 ls s3://kho-han/tmp-24h/ || echo \"(trống)\"\n(trống)\n$ # Tải một tệp MỚI vào đúng prefix đó\n$ aws s3 cp x.txt s3://kho-han/tmp-24h/moi-tai.json >/dev/null && aws s3api head-object --bucket kho-han --key tmp-24h/moi-tai.json 2>&1 | tail -1\nAn error occurred (404) when calling the HeadObject operation: Not Found\n$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://k0.json   # Expiration.Days: 0\nAn error occurred (InvalidArgument) when calling the PutBucketLifecycleConfiguration operation: Days must be positive integer when used with Expiration",
 "n6-2:repo": "$ # Luật nằm trong repo = dấu vết giấy. So luật đang chạy với tệp trong repo:\n$ diff <(aws s3api get-bucket-lifecycle-configuration --bucket kho-han | jq -S .) <(jq -S . han.json) && echo \"khớp repo\"\nkhớp tệp trong repo (2 luật)",
 "n6-2:file:chong.json": "{\"Rules\":[\n {\"ID\":\"exports-30d\",\"Status\":\"Enabled\",\"Filter\":{\"Prefix\":\"exports/\"},\"Expiration\":{\"Days\":30}},\n {\"ID\":\"exports-u42-1d\",\"Status\":\"Enabled\",\"Filter\":{\"Prefix\":\"exports/u42/\"},\"Expiration\":{\"Days\":1}}\n]}\n",
 "n6-2:chong": "$ # Hai luật chồng nhau: exports/ 30 ngày và exports/u42/ 1 ngày — object của u42 theo luật nào?\n$ aws s3api put-bucket-lifecycle-configuration --bucket kho-han --lifecycle-configuration file://chong.json && echo \"đã đặt 2 luật chồng\"\nđã đặt 2 luật chồng\n$ for k in exports/u42/2026-11.csv exports/u7/2026-11.csv; do printf '%-24s ' $k; aws s3api head-object --bucket kho-han --key $k --query Expiration --output text; done\nexports/u42/2026-11.csv  expiry-date=\"Mon, 16 Nov 2026 00:00:00 GMT\", rule-id=\"exports-u42-1d\"\nexports/u7/2026-11.csv   expiry-date=\"Tue, 15 Dec 2026 00:00:00 GMT\", rule-id=\"exports-30d\""
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, ts, tree } from './_obj-chung.mjs';

export const deck = { key: 'obj-06-2', code: 'OBJ 6.2', title: '6.2 — Expiring objects by age', sub: 'Chapter 6 · Lesson 6.2' };
const O = (k) => { const v = DU_LIEU[`n6-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.split('\n').filter((l) => !/^\$ #/.test(l)).join('\n');
const [HAN, TIEN, NGAY, REPO, CHONG] = ['han', 'tien', 'ngay', 'repo', 'chong'].map((k) => bo(O(k)));

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.2', t: 'Expiring objects<br>by age', sub: 'Exports, temp files, reset tokens — prefix rules, the expiry date each object carries, and the one rule that empties a folder instantly',
    en: 'Chapter six, lesson two: expiring objects by age. Exports, temporary files, reset tokens: prefix rules, the expiry date each object carries, and the one rule that empties a folder instantly.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Which objects are "temporary" — and why a README is not a rule</li>
    <li>Prefix-scoped rules, and the x-amz-expiration header that proves them</li>
    <li>Prefix traps: the missing slash, overlapping rules</li>
    <li>The rule that deletes immediately (and the one that is refused)</li>
    <li>Rules in the repo: the paper trail an auditor asks for</li></ul>`,
    en: 'Takeaways: which objects are temporary; prefix rules and the expiration header that proves them; prefix traps; the rule that deletes immediately; and keeping rules in the repo.' },
  { t: 'Objects that were never meant to stay', body: cmp(['kind', 'typical keep', 'why it piles up'], [
      ['export / report downloads', '7–30 days', 'downloaded once, never again'],
      ['video transcode staging', '1–7 days', 'only the final output matters'],
      ['password-reset attachments', '24 hours', 'should not outlive the request'],
      ['logs / audit archives', '90 days – years', 'compliance says "at least N days"'],
      ['thumbnails of deleted posts', '0 — delete with the post', 'age cannot know a post was deleted (6.3)'],
    ], { fs: 17 }) + box('"Temporary" needs a rule', 'A README that says "this folder is temporary" costs money forever. Only a lifecycle rule — or code that deletes — makes it true.', 'lam'),
    en: 'Objects that were never meant to stay: exports, transcode staging, reset attachments, log archives. Thumbnails of deleted posts are different: age cannot know a post was deleted; that is lesson six three. A README saying temporary is not a rule.' },
  { t: 'Prefix rules — and the date each object carries', body: ts(O('file:han.json').trim(), { fs: 15 }) + tn(HAN, { fs: 14, wrap: 130 }) + two(box('Read the header', '<code>x-amz-expiration</code> on HEAD/GET tells you <b>which rule</b> and <b>which day</b>. <code>users/</code> has none — not matched.', 'lam'),
      box('Rounded to midnight UTC', 'Uploaded 14/11 09:43 UTC: 1 day ⇒ <b>16/11 00:00</b>, 30 days ⇒ <b>15/12 00:00</b>. Days count from creation, then round up to the next midnight.', '')),
    en: 'Prefix rules. Exports thirty days, temp one day. Every matching object now carries an x-amz-expiration header naming the rule and the day; users has none. The date is rounded up to the next midnight UTC: uploaded at nine forty-three on the fourteenth, one day means the sixteenth at midnight.' },
  { t: 'When does it actually disappear?', body: cmp(['source', 'what it says'], [
      ['R2 docs (updated 26/10/2026)', '"Objects will typically be removed from a bucket within 24 hours of the x-amz-expiration value."'],
      ['R2 docs — new rules', 'existing objects may take longer to be processed after a rule is added'],
      ['R2 docs — limit', '1,000 lifecycle rules per bucket'],
      ['MinIO (measured, next slides)', 'an object past its expiry is hidden at once (HEAD 404)'],
    ], { fs: 17, hl: [0] }) + box('Practical rule', 'Measure a day or two after adding a rule, never five minutes after. And check the <code>x-amz-expiration</code> header today — it is the proof that the rule matches.', 'lam'),
    en: 'When does it disappear? R2\'s docs: typically within twenty-four hours of the expiration value, and existing objects can take longer after a new rule. So measure a day or two later, and check the expiration header today as proof of the match.' },
  { t: 'Trap: the prefix without a slash', body: tn(TIEN, { fs: 15, wrap: 116 }) + two(box('Measured', '<code>"report"</code> matched <code>report.pdf</code>, <code>reports/annual-2026.csv</code> <b>and</b> <code>reporting-config.json</code>. Only <code>users/report.pdf</code> escaped — prefix means "starts with", nothing more.', 'do2'),
      box('Fix', 'End prefixes with <code>/</code>: <code>"reports/"</code>. And put temporary files under their own prefix: <code>reports/tmp/</code>, <code>tmp-24h/</code>, <code>keep-30d/</code> — the path says what will happen.', 'lam')),
    en: 'The prefix without a slash. Report matched report dot pdf, the reports folder and reporting config: prefix means starts with. Only users slash report escaped. End prefixes with a slash, and give temporary files their own prefix so the path says what will happen.' },
  { t: 'Two rules overlap: the earlier date wins', body: ts(O('file:chong.json').trim(), { fs: 14 }) + tn(CHONG, { fs: 13, wrap: 124 }) + box('Measured', 'An object under <code>exports/u42/</code> matches both rules and gets the <b>1-day</b> date; <code>exports/u7/</code> keeps 30 days. Design prefixes so a key matches one rule — overlaps are easy to misread.', 'lam'),
    en: 'Two rules overlap. Exports thirty days, exports slash u forty-two one day. The u forty-two file gets the one-day date; the earlier date wins. Design prefixes so each key matches one rule.' },
  { t: 'What if… a "one-off cleanup" rule is left on?', body: tn(NGAY, { fs: 13, wrap: 122 }) + two(box('Measured on MinIO', 'An <code>Expiration.Date</code> already in the past: <code>tmp-24h/</code> is empty <b>at once</b>, and a file uploaded <b>after</b> the rule is 404 straight away. Every future upload to that prefix is lost.', 'do2'),
      box('And Days: 0?', 'Refused: <i>"Days must be positive integer"</i>. The old text warned about <code>Days: 0</code>; the real foot-gun is a <b>Date</b> rule nobody removed.', 'lam')),
    en: 'What if a one-off cleanup rule is left on? An expiration date already in the past: the temp folder is empty at once, and a file uploaded afterwards is gone immediately. Days zero is simply refused. The real foot-gun is a date rule nobody removed.' },
  { t: 'Rules in the repo — the paper trail', body: tree(['my-app/', '  src/', '*  infra/', '*    r2-lifecycle.json   // the rules, reviewed like code', '  package.json'], { fs: 22 }) + tn(REPO, { fs: 14, wrap: 130 }) + two(box('The question three months later', '"Why did <code>exports/u42/2026-05-tax.csv</code> disappear on 18/06?" — the answer must be: rule <code>het-han-exports-30d</code>, committed on 01/05, in this file.', ''),
      box('So', 'Keep the lifecycle JSON in the repo next to the code that writes those prefixes; compare it with <code>get-bucket-lifecycle-configuration</code> in CI or before a release.', 'lam')),
    en: 'Rules in the repo. Three months later someone asks why a tax export disappeared. The answer must point to a rule, a date and a file. Keep the JSON in the repo and compare it with what the bucket really runs.' },
  { t: 'Real life, what-if, and the attacker\'s view', body: two(box('Real life', '<ul><li>A "download my data" export: the link in the email works for 7 days, the file can live 30 — then the rule removes it.</li><li>A course video pipeline writes temp renders to <code>tmp-24h/</code>; only finals go to <code>video/</code>.</li></ul>', 'lam'),
      box('What if the app needs the "folder"?', 'There are no folders: <code>exports/</code> exists only while one key starts with it. When the rule deletes the last one, code that HEADs <code>exports/</code> breaks. Do not depend on folders.', '')) +
      box('The attacker\'s view', 'Whoever can <b>write lifecycle rules</b> can delete a whole bucket with one rule — a past <code>Date</code> and an empty prefix — without a single DeleteObject in the logs. Keep <code>PutBucketLifecycleConfiguration</code> out of app tokens (lesson 2.3), and alert when the bucket\'s rules differ from the repo.', 'do2'),
    en: 'Real life: data exports, temporary renders. What if the app needs a folder? There are none; when the rule deletes the last key, the folder is gone. The attacker\'s view: whoever can write lifecycle rules can wipe a bucket with one past-date rule, with no delete calls in the logs. Keep that permission out of app tokens.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Expiration.Days', 'age, rounded to midnight UTC'), kw('Expiration.Date', 'a calendar day — beware the past'), kw('Filter.Prefix', '"starts with", end with /'),
      kw('x-amz-expiration', 'proof: rule + date'), kw('Overlap', 'earlier date wins'), kw('~24 h', 'R2 removal delay'),
      kw('Prefix discipline', 'tmp-24h/, keep-30d/'), kw('Paper trail', 'rules in the repo'), kw('PutBucketLifecycle', 'a destructive permission'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: expiration days, expiration date, filter prefix, the x-amz-expiration header, overlap, the twenty-four hour delay, prefix discipline, the paper trail, and the lifecycle permission as a destructive one.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Put a 30-day rule on exports/ and a 1-day rule on tmp-24h/',
      'Upload under exports/, tmp-24h/ and users/; HEAD each one',
      'Try the prefix "report" without a slash on four keys',
      'Overlap two rules; see which date wins',
      'Diff the bucket\'s rules against your repo file',
    ]), box('Keep these', '<ul><li>Prefix = starts with; end with /</li><li>x-amz-expiration is the proof</li><li>Earlier date wins</li><li>Never leave a past Date rule</li><li>Rules live in the repo</li></ul>', 'lam'), ''),
    en: 'Your turn: two prefix rules, HEAD three objects, the slash trap, an overlap, and a diff against your repo file.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — Lifecycle rules and cleanup', bai: '6.2 Expiration' }, S);
