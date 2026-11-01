/** Dựng _track.json của authentication-practice từ các module: node content/codelab/authentication-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
// auth-<chương>-<bài>-… ; Mục 0 theo thứ tự học (0.8 → 0.9 → 0.1 → 0.2 → 0.3); Lab (auth-N-7-lab-…) sau các bài của chương.
const THU_TU_MUC0 = { 8: 0, 9: 1, 1: 2, 2: 3, 3: 4 };
const rank = (m) => {
  const [, ch, b, loai] = /^auth-(\d+)-(\d+)-(lab)?/.exec(m.slug) || [];
  const chuong = Number(ch); const bai = Number(b);
  return [chuong, loai ? 1 : 0, chuong === 0 ? (THU_TU_MUC0[bai] ?? bai) : bai];
};
// Thứ tự trong khoá (manifest) thắng thứ tự đoán từ slug — chỉ khi CẢ HAI module đều có trong manifest.
let ORDER = new Map();
try {
  const course = (await import(pathToFileURL(path.join(NGUON, '..', '..', '..', 'courses', 'authentication.mjs')).href)).default;
  ORDER = new Map(course.sections.flatMap((s) => s.lessons.map((l) => l.slug)).map((slug, i) => [slug, i]));
} catch (e) { console.warn('! không đọc được manifest authentication.mjs — xếp theo slug:', e.message); }
const pos = (m) => ORDER.get(m.baiHoc ?? m.slug);
mods.sort((a, b) => {
  if (pos(a) !== undefined && pos(b) !== undefined) return pos(a) - pos(b);
  const x = rank(a), y = rank(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
});
const en = (t) => (typeof t === 'string' ? t : t.en);
const track = {
  groupSlug: 'cuongthai',
  slug: 'authentication-practice',
  name: 'Authentication — Luyện tập',
  language: 'javascript',
  color: '#b45309',
  docsUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
  status: 'PUBLISHED',
  level: 'BEGINNER',
  description: 'Bộ luyện đi kèm khoá Authentication (dự án xuyên khoá LabFlow ID — dịch vụ danh tính của nền tảng LabFlow): mỗi bài học một bộ đề từ dễ đến khó, đề tiếng Anh có bản tiếng Việt, dữ liệu là output CHẠY THẬT của LabFlow ID (Node 22.23.3 + Express 5.3.0, chạy trong môi trường sạch). Trắc nghiệm, điền bảng, sắp thứ tự để đọc đúng output thật (401/403/404, Referer trong Chromium, Math.random bị đoán trước, length extension, log rò bí mật); bài khó là tự viết hàm từ gốc chạy thật trong trình duyệt — đọc header Cookie/Authorization, quyết định ba cổng xác thực, tính entropy và độ dài token, sinh chữ số không lệch, so sánh hằng thời gian, kiểm chữ ký webhook, dựng HMAC-SHA256 từ SHA-256, base64url bằng tay, giá trị có ký kèm hết hạn và xoay khoá, lọc log theo danh sách cho phép, quét bí mật kiểu gitleaks; Chương 2: bẻ bảng có muối và đếm số lần băm, bảng thời gian vét cạn, chọn tham số argon2id theo hai ngân sách, đọc chuỗi băm theo tên, phán quyết rò thời gian ở màn đăng nhập, đếm độ dài theo NIST, đọc phản hồi range API của HIBP, lập kế hoạch chuyển băm cũ; Chương 3: trạng thái phiên (hai mốc hết hạn), đếm số lần ghi last_seen, luật cookie __Host-, cookie nào được gửi theo SameSite (như đo trong Chromium 156), tái sinh phiên, đăng xuất mọi nơi, phán quyết CSRF (Sec-Fetch-Site + Origin), token đồng bộ, kho có TTL; Lab chương 1 dựng lại bộ công cụ nguyên hàm, Lab chương 2 dựng module mật khẩu (chọn đường theo tiền tố, một lần kiểm ở mọi đường, chính sách NIST), Lab chương 3 dựng lớp phiên (start/load/end) của LabFlow ID.',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: rank(m)[0] === 0 ? 'BEGINNER' : (rank(m)[1] ? 'INTERMEDIATE' : 'BEGINNER'),
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
