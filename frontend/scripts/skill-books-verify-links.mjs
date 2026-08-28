/**
 * Giai đoạn 2 của quy trình xác minh nguồn: trích toàn bộ URL từ mọi file
 * skill-books-staging/<vol>.mjs, kiểm khả dụng bằng curl (batch song song),
 * rồi CẬP NHẬT _references-audit.json.
 *
 * KHÔNG đủ để coi 1 URL là "verified" — link YouTube hoặc link bị nghi ngờ
 * vẫn cần qua giai đoạn 3 (WebFetch, kiểm nội dung khớp chủ đề) trước khi
 * merge-check chấp nhận. Script này chỉ đánh dấu:
 *   - "dead"      nếu curl không trả 2xx sau redirect
 *   - "needs-webfetch" nếu curl 2xx nhưng là YouTube hoặc đã gắn needsReview
 *   - giữ nguyên "verified" cho URL ĐÃ được giai đoạn 3 xác nhận trước đó
 *     (không hạ cấp lại — tránh phải WebFetch lại link đã kiểm nội dung rồi)
 *
 * Chạy: node frontend/scripts/skill-books-verify-links.mjs [vol...]
 *   Không tham số  → quét toàn bộ file trong staging/
 *   Có tham số vol → chỉ quét các quyển đó, ví dụ: node ... 26 27
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const stagingDir = path.join(here, 'skill-books-staging');
const auditPath = path.join(stagingDir, '_references-audit.json');

const requestedVols = process.argv.slice(2);
const files = readdirSync(stagingDir).filter((f) => /^\d+\.mjs$/.test(f) && (requestedVols.length === 0 || requestedVols.includes(f.replace('.mjs', ''))));

const isYouTube = (url) => /youtube\.com|youtu\.be/.test(url);

const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

async function checkOne(url) {
  try {
    // -A giả lập trình duyệt thật — nhiều site (positivepsychology.com,
    // verywellmind.com, who.int...) trả 403 cho curl mặc định không phải vì
    // trang chết, mà vì chặn bot theo User-Agent. Không giả lập UA sẽ tạo
    // rất nhiều false-negative "dead" cho link thực ra vẫn sống.
    const { stdout } = await execFileAsync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '-L', '--max-time', '12', '-A', BROWSER_UA, url]);
    const code = stdout.trim();
    return { code, ok: code.startsWith('2') };
  } catch {
    return { code: 'ERR', ok: false };
  }
}

async function pool(items, limit, worker) {
  const results = [];
  let i = 0;
  async function run() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

const entries = []; // {vol, chapter, url, label, type, needsReview}
for (const file of files) {
  const vol = file.replace('.mjs', '');
  const mod = await import(`${path.join(stagingDir, file)}?t=${Date.now()}`);
  mod.default.forEach((g, chapterIdx) => {
    g.references.forEach((r) => {
      entries.push({ vol, chapter: chapterIdx + 1, url: r.url, label: r.label, type: r.type, needsReview: !!r.needsReview });
    });
  });
}

let audit = existsSync(auditPath) ? JSON.parse(readFileSync(auditPath, 'utf8')) : [];
const scannedVols = new Set(files.map((f) => f.replace('.mjs', '')));
const currentUrls = new Set(entries.map((e) => e.url));
// Dọn rác: bỏ bản ghi audit cũ thuộc ĐÚNG quyển đang quét MÀ URL đó không
// còn xuất hiện trong file staging nữa (đã bị sửa/thay thế) — tránh audit
// tích rác vô hạn. Giữ nguyên bản ghi của URL vẫn còn dùng (bảo toàn trạng
// thái "verified" đã có, không WebFetch lại vô ích) và của các quyển KHÔNG
// nằm trong lần quét này.
audit = audit.filter((a) => !scannedVols.has(a.vol) || currentUrls.has(a.url));
const auditByUrl = new Map(audit.map((a) => [a.url, a]));

const uniqueUrls = [...currentUrls];
console.log(`Kiểm ${uniqueUrls.length} URL duy nhất (từ ${entries.length} tham chiếu, ${files.length} quyển)...`);

const results = await pool(uniqueUrls, 15, async (url) => ({ url, ...(await checkOne(url)) }));
const codeByUrl = new Map(results.map((r) => [r.url, r]));

const now = new Date().toISOString().slice(0, 10);
let deadCount = 0;
let needsWebfetchCount = 0;
let keptVerifiedCount = 0;

for (const e of entries) {
  const check = codeByUrl.get(e.url);
  const prior = auditByUrl.get(e.url);

  let status;
  if (!check.ok && prior?.status === 'verified') {
    // curl bị chặn bot (403/999.../reset) NHƯNG bản ghi trước đó đã ở trạng
    // thái "verified" — dù qua WebFetch (giai đoạn 3) hay qua đối chiếu thủ
    // công (bare curl không UA, hoặc tổ chức/trang quá nổi tiếng để nghi ngờ)
    // — không hạ cấp xuống "dead" chỉ vì lần curl NÀY thất bại. Từng chỉ tin
    // method bắt đầu bằng "webfetch", nhưng bản ghi đánh dấu tay (ví dụ
    // "bot-block-override") bị bỏ sót và cứ mỗi lần chạy lại là rớt về dead
    // (đã thấy với poynter.org, rồi lại với consumerfinance.gov/exercism.org).
    status = 'verified';
    keptVerifiedCount++;
  } else if (!check.ok) {
    status = 'dead';
    deadCount++;
  } else if (prior?.status === 'verified') {
    // đã qua giai đoạn 3 trước đó, curl vẫn sống → giữ nguyên. `needsReview`
    // trên nguồn chỉ có nghĩa "lúc viết chưa chắc URL thật" — một khi đã
    // verified thì cờ đó không còn ý nghĩa, KHÔNG được hạ cấp lại mỗi lần
    // script này chạy lại (đã thấy bug này: 88 URL vừa verified xong bị hạ
    // ngược về needs-webfetch chỉ vì needsReview vẫn còn true trên nguồn).
    status = 'verified';
    keptVerifiedCount++;
  } else if (isYouTube(e.url) || e.needsReview) {
    status = 'needs-webfetch';
    needsWebfetchCount++;
  } else {
    status = 'needs-webfetch'; // mặc định an toàn: mọi link MỚI đều qua giai đoạn 3 trước khi verified
    needsWebfetchCount++;
  }

  auditByUrl.set(e.url, {
    vol: e.vol,
    chapter: e.chapter,
    url: e.url,
    label: e.label,
    type: e.type,
    needsReview: e.needsReview,
    httpCode: check.code,
    status,
    method: prior?.status === 'verified' && status === 'verified' ? prior.method : 'curl',
    checkedAt: now,
  });
}

writeFileSync(auditPath, JSON.stringify([...auditByUrl.values()], null, 2));

console.log(`Chết: ${deadCount} · Cần WebFetch (giai đoạn 3): ${needsWebfetchCount} · Đã verified từ trước (giữ nguyên): ${keptVerifiedCount}`);
console.log(`Ghi ${auditPath}`);
if (deadCount) {
  console.log('--- URL chết (curl không trả 2xx) ---');
  for (const [url, a] of auditByUrl) {
    if (a.status === 'dead') console.log(`  [${a.vol}/ch${a.chapter}] ${a.httpCode}  ${url}`);
  }
}
