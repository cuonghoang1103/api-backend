/**
 * Kiểm PROD có đúng bản vừa deploy hay không — cho trang /tech-trends/on-thi-jpd113.
 *
 * Vì sao không grep thẳng HTML: trang server-render CHỈ ra tab Lộ trình, mọi
 * tab khác nằm trong gói JS. `curl | grep` ra 0 là BÌNH THƯỜNG, không phải lỗi.
 * Nên script tải HTML → gom mọi <script src> → tải hết chunk → grep trong đó.
 *
 * Marker CHỈ dùng kana: chuỗi có à á â ê ô luôn bị escape thành \xe0 trong
 * bundle nên grep luôn miss, từng làm kết luận sai "deploy cũ" hai lần.
 */

const BASE = 'https://cuongthai.com';
const PAGE = '/tech-trends/on-thi-jpd113';

/** Marker MỚI — chỉ có sau commit b5d02fd */
const NEW = [
  ['はっせんごひゃく', 'feBank · đọc kanji 八千五百'],
  ['ろくじゅうはっさい', 'feBank · viết kanji 六十八才'],
  ['にせんろく', 'personalQA · năm sinh 2006'],
  ['もういちど', 'personalQA · câu cứu hộ'],
  ['きつえんじょ', 'feBank · từ katakana'],
];

/** Marker ĐỐI CHỨNG — đã có từ trước, dùng để chứng minh phép quét chạy đúng */
const CONTROL = [
  ['はたち', 'cheatsheet cũ · 20 tuổi'],
  ['さんがい', 'cheatsheet cũ · tầng 3'],
];

const get = async (u) => {
  const r = await fetch(u, { headers: { 'user-agent': 'jpd113-check' } });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return r.text();
};

const html = await get(BASE + PAGE);
const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
console.log(`HTML ${html.length} ký tự · ${srcs.length} thẻ script`);

let all = html;
let ok = 0;
for (const s of srcs) {
  const url = s.startsWith('http') ? s : BASE + s;
  try {
    all += await get(url);
    ok++;
  } catch (e) {
    console.log('  bỏ qua', s, String(e.message));
  }
}
console.log(`Tải được ${ok}/${srcs.length} chunk · tổng ${all.length.toLocaleString()} ký tự\n`);

const check = (list, label) => {
  let pass = 0;
  console.log(`── ${label} ──`);
  for (const [m, what] of list) {
    const hit = all.includes(m);
    if (hit) pass++;
    console.log(`  ${hit ? '✅' : '❌'} ${m.padEnd(22)} ${what}`);
  }
  return pass;
};

const nPass = check(NEW, 'MARKER MỚI (phải có hết)');
const cPass = check(CONTROL, 'ĐỐI CHỨNG (chứng minh phép quét chạy)');

console.log();
if (cPass < CONTROL.length) {
  console.log('⚠️  Đối chứng cũng miss ⇒ phép quét SAI, đừng kết luận gì về marker mới.');
  process.exit(2);
}
if (nPass === NEW.length) {
  console.log('✅ PROD ĐANG CHẠY BẢN MỚI — đủ cả 5 marker.');
  process.exit(0);
}
console.log(`❌ Chỉ ${nPass}/${NEW.length} marker mới có mặt ⇒ prod còn chạy image CŨ.`);
process.exit(1);
