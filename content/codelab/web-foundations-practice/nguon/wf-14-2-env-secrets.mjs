/** Bộ luyện bài 14.2 — Biến môi trường và bí mật. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI".
 *  Đọc file .env, lọc biến công khai, nạp cấu hình chết sớm, soát bundle tìm bí mật lộ, che bí mật trong log, kiểm .env.example. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 14.2 — Biến môi trường và bí mật.</em> Mỗi bài là một mảnh của công cụ mà dự án thật cần để giữ bí mật ở lại máy chủ.</p>';

export default doiDau({
  slug: 'wf-14-2-env-secrets',
  ten: '14.2 Biến môi trường và bí mật',
  baiHoc: 'Nền tảng Web — Bài 14.2 Environment variables & secrets',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Đọc .env, lọc biến công khai VITE_, cấu hình chết sớm khi thiếu biến, soát bundle tìm bí mật, che bí mật trong log, đối chiếu .env.example — 6 bài.',
  de: [
    {
      tieuDe: 'Đọc file .env',
      doKho: 'EASY', phut: 15,
      khaiNiem: ['định dạng .env', 'split', 'trim'], tienQuyet: ['chuỗi', 'object'], the: ['javascript', 'env'],
      moTa: `${BAI}<p>Viết ${c('parseEnv(text)')} trả object từ nội dung file .env: mỗi dòng ${c('TÊN=giá trị')}; bỏ dòng trống và dòng bắt đầu bằng ${c('#')} (sau khi trim); tên và giá trị được trim; giá trị bọc trong nháy kép hoặc nháy đơn thì bỏ nháy; chỉ tách ở dấu ${c('=')} ĐẦU TIÊN (giá trị có thể chứa ${c('=')}); dòng không có ${c('=')} bị bỏ qua.</p>`,
      yeuCau: ['Bỏ chú thích và dòng trống.', 'Tách ở = đầu tiên.', 'Bỏ một cặp nháy bao quanh.'],
      dauVao: 'text: string (nhiều dòng).', dauRa: 'object.',
      rangBuoc: ['Không cần xử lý chú thích cuối dòng hay ${…}.'],
      viDu: [{ input: 'parseEnv("A=1\\n# x\\nB = \\"hi there\\"")', output: '{ A: "1", B: "hi there" }', explanation: 'Chú thích bị bỏ, nháy bị bỏ.' }],
      goiY: ['text.split(/\\r?\\n/)', 'const i = line.indexOf("="); if (i < 0) continue;', 'if (/^(["\']).*\\1$/.test(v)) v = v.slice(1, -1);'],
      khoiDau: { 'main.js': `// Bài 14.2 — đọc .env
function parseEnv(text) {
  const out = {};
  for (const line of text.split('\\n')) {
    const [k, v] = line.split('=');
    out[k] = v;
  }
  return out;
}
` },
      loiGiai: { 'main.js': `// Bài 14.2 — đọc .env: TÊN=giá trị, bỏ chú thích, tách ở dấu = đầu tiên
function parseEnv(text) {
  const out = {};
  for (const raw of text.split(/\\r?\\n/)) {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;      // dòng trống, chú thích
    const i = line.indexOf('=');
    if (i < 0) continue;                                     // không phải dòng gán
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (/^(["']).*\\1$/.test(value)) value = value.slice(1, -1);   // bỏ một cặp nháy
    out[key] = value;
  }
  return out;
}
` },
      giaiThich: `<p>Thư viện như dotenv làm đúng việc này (cộng vài trường hợp hiếm). Tách ở dấu ${c('=')} đầu tiên quan trọng vì URL cơ sở dữ liệu và chuỗi base64 thường chứa ${c('=')}; ${c('split("=")')} sẽ cắt cụt chúng mà không báo lỗi.</p>`,
      loiHayGap: ['split("=") — giá trị chứa "=" bị cắt.', 'Không trim — tên có dấu cách, process.env tra không ra.'],
      thamKhao: 'https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow',
      kiem: [
        { moTa: 'Comments, blanks and quotes|||Chú thích, dòng trống và nháy', goi: 'parseEnv("# demo\\n\\nVITE_API_URL=https://api.ctshop.example\\nTITLE = \\"CT Shop\\"\\nNAME=\'x y\'")', mongDoi: { VITE_API_URL: 'https://api.ctshop.example', TITLE: 'CT Shop', NAME: 'x y' } },
        { moTa: 'Split at the first = only|||Chỉ tách ở dấu = đầu tiên', goi: 'parseEnv("TOKEN=abc==\\nDATABASE_URL=postgres://u:p@h/db?sslmode=require")', mongDoi: { TOKEN: 'abc==', DATABASE_URL: 'postgres://u:p@h/db?sslmode=require' } },
        { moTa: 'Lines without = are ignored; CRLF works|||Dòng không có = bị bỏ; chạy được với CRLF', goi: 'parseEnv("export\\r\\nA=1\\r\\n  # note\\r\\n")', mongDoi: { A: '1' } },
      ],
    },
    {
      tieuDe: 'Chỉ biến VITE_ được công khai',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['tiền tố công khai', 'Object.entries'], tienQuyet: ['object', 'filter'], the: ['javascript', 'env', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('publicEnv(env, prefix = "VITE_")')} trả object CHỈ gồm biến có tên bắt đầu bằng ${c('prefix')}, các khoá theo thứ tự chữ cái. Đây là danh sách sẽ bị "nướng" vào bundle — mọi thứ khác phải ở lại máy chủ.</p>`,
      yeuCau: ['Lọc theo tiền tố (phân biệt hoa thường).', 'Khoá được sắp xếp.', 'Tham số prefix tuỳ chọn (Next.js dùng NEXT_PUBLIC_).'],
      dauVao: 'env: object; prefix?: string.', dauRa: 'object.',
      rangBuoc: ['Không sửa object vào.'],
      viDu: [{ input: 'publicEnv({ VITE_A: "1", SECRET: "x" })', output: '{ VITE_A: "1" }', explanation: 'SECRET không bao giờ được vào bundle.' }],
      goiY: ['Object.entries(env) cho mảng [tên, giá trị]; filter theo name.startsWith(prefix).', 'Sắp xếp bằng so sánh a < b (không dùng localeCompare), rồi Object.fromEntries.'],
      khoiDau: { 'main.js': `// Bài 14.2 — biến công khai
function publicEnv(env, prefix = 'VITE_') {
  return env;
}
` },
      loiGiai: { 'main.js': `// Bài 14.2 — biến công khai: chỉ tiền tố được chọn, sắp xếp theo tên
function publicEnv(env, prefix = 'VITE_') {
  const entries = Object.entries(env)
    .filter(([name]) => name.startsWith(prefix))            // tiền tố là hàng rào duy nhất
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));      // so mã ký tự, không phụ thuộc ngôn ngữ máy
  return Object.fromEntries(entries);
}
` },
      giaiThich: `<p>Tiền tố là một lời tuyên bố: "giá trị này ai cũng xem được". Đặt ${c('VITE_PAYMENT_SECRET')} là tự tay công khai bí mật — bài 14.2 cho thấy nó nằm nguyên trong file JS đã dựng.</p>`,
      loiHayGap: ['Lọc bằng includes("VITE_") — "MY_VITE_X" lọt qua.', 'Dùng localeCompare — thứ tự khác nhau giữa các máy.'],
      thamKhao: 'https://vite.dev/guide/env-and-mode.html#env-variables',
      kiem: [
        { moTa: 'Only VITE_, sorted|||Chỉ VITE_, đã sắp xếp', goi: 'Object.keys(publicEnv({ VITE_TITLE: "CT", DATABASE_URL: "pg", VITE_API_URL: "u", PAYMENT_SECRET: "s", MY_VITE_X: "no" }))', mongDoi: ['VITE_API_URL', 'VITE_TITLE'] },
        { moTa: 'Custom prefix for Next.js|||Tiền tố riêng cho Next.js', goi: 'publicEnv({ NEXT_PUBLIC_API: "a", VITE_X: "b", API_KEY: "c" }, "NEXT_PUBLIC_")', mongDoi: { NEXT_PUBLIC_API: 'a' } },
        { moTa: 'Input is not modified|||Không sửa object vào', chuanBi: 'const e = { A: "1", VITE_B: "2" }; publicEnv(e);', goi: 'Object.keys(e)', mongDoi: ['A', 'VITE_B'] },
      ],
    },
    {
      tieuDe: 'Cấu hình chết sớm khi thiếu biến',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['fail fast', 'xác thực cấu hình', 'kiểu số và URL'], tienQuyet: ['throw', 'URL', 'Number'], the: ['javascript', 'env', 'cấu hình'],
      moTa: `${BAI}<p>Viết ${c('loadConfig(env)')} như ${c('config.mjs')} của bài: cần ${c('DATABASE_URL')} (bắt buộc, phải là URL hợp lệ có giao thức ${c('postgres:')} hoặc ${c('postgresql:')}), ${c('PORT')} (tuỳ chọn, mặc định 3000, phải là số nguyên 1–65535), ${c('NODE_ENV')} (tuỳ chọn, mặc định ${c('"development"')}). Gom MỌI lỗi rồi ném một ${c('Error')} duy nhất có message ${c('"invalid config: " + danhSáchLỗi.join("; ")')}, lỗi theo thứ tự: ${c('DATABASE_URL is missing')} / ${c('DATABASE_URL must be a postgres URL')}, ${c('PORT must be an integer 1-65535')}. Hợp lệ ⇒ trả ${c('Object.freeze({ databaseUrl, port, nodeEnv })')}.</p>`,
      yeuCau: ['Báo hết lỗi một lượt, không dừng ở lỗi đầu.', 'Kiểu đúng: port là number.', 'Kết quả bị đóng băng.'],
      dauVao: 'env: object (như process.env).', dauRa: 'object đóng băng hoặc ném Error.',
      rangBuoc: ['Không đọc process.env trực tiếp — nhận env làm tham số để dễ test.'],
      viDu: [{ input: 'loadConfig({})', output: 'Error: invalid config: DATABASE_URL is missing', explanation: 'Chết ngay lúc khởi động, không phải lúc người dùng đầu tiên đặt hàng.' }],
      goiY: ['try { new URL(v) } catch { … } — URL ném TypeError với chuỗi không hợp lệ.', 'Number.isInteger(Number(p))'],
      khoiDau: { 'main.js': `// Bài 14.2 — nạp cấu hình
function loadConfig(env) {
  return { databaseUrl: env.DATABASE_URL, port: env.PORT, nodeEnv: env.NODE_ENV };
}
` },
      loiGiai: { 'main.js': `// Bài 14.2 — nạp cấu hình: kiểm hết, báo hết, chết sớm
function loadConfig(env) {
  const errors = [];
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    errors.push('DATABASE_URL is missing');
  } else {
    let ok = false;
    try { ok = ['postgres:', 'postgresql:'].includes(new URL(databaseUrl).protocol); } catch { ok = false; }
    if (!ok) errors.push('DATABASE_URL must be a postgres URL');
  }
  const port = env.PORT === undefined || env.PORT === '' ? 3000 : Number(env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) errors.push('PORT must be an integer 1-65535');
  if (errors.length) throw new Error('invalid config: ' + errors.join('; '));   // một lỗi, liệt kê đủ
  return Object.freeze({ databaseUrl, port, nodeEnv: env.NODE_ENV || 'development' });
}
` },
      giaiThich: `<p>Thiếu biến môi trường là lỗi deploy số một. Kiểm lúc khởi động biến nó thành container chết ngay với thông báo rõ ràng, thay vì một lỗi 500 khó hiểu nhiều giờ sau. Gom mọi lỗi giúp sửa một lần thay vì deploy năm lần.</p>`,
      loiHayGap: ['Dừng ở lỗi đầu tiên.', 'Để port là chuỗi "3000" — so sánh và cộng sai về sau.'],
      thamKhao: 'https://12factor.net/config',
      kiem: [
        { moTa: 'Valid config with defaults|||Cấu hình hợp lệ với mặc định', goi: 'loadConfig({ DATABASE_URL: "postgres://app:pw@db:5432/shop" })', mongDoi: { databaseUrl: 'postgres://app:pw@db:5432/shop', port: 3000, nodeEnv: 'development' } },
        { moTa: 'Missing DATABASE_URL fails early|||Thiếu DATABASE_URL chết sớm', goi: 'loadConfig({})', mongDoi: { loi: 'Error', thongDiep: '^invalid config: DATABASE_URL is missing$' } },
        { moTa: 'All errors at once|||Báo hết lỗi một lượt', goi: 'loadConfig({ DATABASE_URL: "mysql://x", PORT: "80a" })', mongDoi: { loi: 'Error', thongDiep: 'DATABASE_URL must be a postgres URL; PORT must be an integer 1-65535' } },
        { moTa: 'Port is a number and the result is frozen|||Port là số và kết quả bị đóng băng', goi: '(() => { const c = loadConfig({ DATABASE_URL: "postgresql://h/db", PORT: "8080", NODE_ENV: "production" }); return [c.port, c.nodeEnv, Object.isFrozen(c)]; })()', mongDoi: [8080, 'production', true] },
        { moTa: 'Hidden: invalid URL text|||Ẩn: chuỗi URL hỏng', an: true, goi: 'loadConfig({ DATABASE_URL: "not a url", PORT: "70000" })', mongDoi: { loi: 'Error', thongDiep: 'postgres URL; PORT must' } },
      ],
    },
    {
      tieuDe: 'Soát bundle tìm bí mật bị lộ',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['quét bí mật', 'indexOf', 'ngữ cảnh'], tienQuyet: ['chuỗi', 'vòng lặp'], the: ['javascript', 'env', 'bảo mật'],
      moTa: `${BAI}<p>Sau khi dựng, CI nên quét file JS tìm giá trị bí mật. Viết ${c('findLeaks(files, secrets)')}: ${c('files')} là ${c('{ "assets/x.js": nộiDung }')}, ${c('secrets')} là ${c('{ TÊN: giáTrị }')}. Trả mảng ${c('{ file, name, index }')} cho MỌI lần một giá trị bí mật xuất hiện (index là vị trí ký tự), sắp theo file rồi theo index. Bỏ qua bí mật có giá trị ngắn hơn 8 ký tự (quá dễ trùng ngẫu nhiên).</p>`,
      yeuCau: ['Tìm mọi lần xuất hiện, kể cả nhiều lần trong một file.', 'Bỏ giá trị < 8 ký tự.', 'Sắp theo file, rồi index.'],
      dauVao: 'files: object; secrets: object.', dauRa: 'mảng { file, name, index }.',
      rangBuoc: ['Không dùng regex xây từ giá trị bí mật (ký tự đặc biệt sẽ phá regex).'],
      viDu: [{ input: 'findLeaks({ "a.js": "k=\\"demo-secret-not-real-0001\\"" }, { VITE_PAYMENT_SECRET: "demo-secret-not-real-0001" })', output: '[{ file: "a.js", name: "VITE_PAYMENT_SECRET", index: 3 }]', explanation: 'Đúng thứ bài 14.2 tìm thấy bằng grep.' }],
      goiY: ['let i = text.indexOf(value); while (i !== -1) { found.push(…); i = text.indexOf(value, i + 1); }', 'Sắp xếp cuối: so file trước (a.file < b.file), bằng nhau thì a.index - b.index.'],
      khoiDau: { 'main.js': `// Bài 14.2 — soát bí mật
function findLeaks(files, secrets) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 14.2 — soát bí mật trong bundle: tìm mọi lần xuất hiện bằng indexOf
function findLeaks(files, secrets) {
  const found = [];
  for (const [file, text] of Object.entries(files)) {
    for (const [name, value] of Object.entries(secrets)) {
      if (typeof value !== 'string' || value.length < 8) continue;   // quá ngắn ⇒ trùng ngẫu nhiên
      let i = text.indexOf(value);
      while (i !== -1) {
        found.push({ file, name, index: i });
        i = text.indexOf(value, i + 1);
      }
    }
  }
  return found.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : a.index - b.index));
}
` },
      giaiThich: `<p>Công cụ thật (gitleaks, trufflehog) còn dò theo mẫu, nhưng phép kiểm chắc chắn nhất là đúng phép này: lấy giá trị thật từ kho bí mật và tìm nó trong file sắp phát hành. Không dùng regex dựng từ giá trị vì ${c('+ ? . (')} trong bí mật sẽ biến thành ký hiệu regex.</p>`,
      loiHayGap: ['Chỉ tìm lần đầu (indexOf một lần).', 'new RegExp(value) — vỡ khi bí mật có ký tự đặc biệt.'],
      thamKhao: 'https://github.com/gitleaks/gitleaks',
      kiem: [
        { moTa: 'Finds the lesson leak|||Tìm ra chỗ lộ của bài', goi: 'findLeaks({ "assets/index-1.js": "const k=\\"demo-secret-not-real-0001\\";", "assets/index-1.css": "body{}" }, { VITE_PAYMENT_SECRET: "demo-secret-not-real-0001", DATABASE_URL: "postgres://x" })', mongDoi: [{ file: 'assets/index-1.js', name: 'VITE_PAYMENT_SECRET', index: 9 }] },
        { moTa: 'Every occurrence, sorted by file then index|||Mọi lần xuất hiện, sắp theo file rồi index', goi: 'findLeaks({ "b.js": "TOKEN_12345678", "a.js": "x TOKEN_12345678 TOKEN_12345678" }, { T: "TOKEN_12345678" }).map((f) => f.file + ":" + f.index)', mongDoi: ['a.js:2', 'a.js:17', 'b.js:0'] },
        { moTa: 'Short values are ignored; special characters are fine|||Bỏ giá trị ngắn; ký tự đặc biệt không sao', goi: 'findLeaks({ "a.js": "id=1 key=a+b?c.(d)e*f" }, { ID: "1", K: "a+b?c.(d)e*f" })', mongDoi: [{ file: 'a.js', name: 'K', index: 9 }] },
      ],
    },
    {
      tieuDe: 'Che bí mật trong log',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['redaction', 'đệ quy', 'tên khoá nhạy cảm'], tienQuyet: ['đệ quy', 'regex', 'Array.isArray'], the: ['javascript', 'bảo mật', 'logging'],
      moTa: `${BAI}<p>Viết ${c('redact(value)')} trả bản sao để in log: mọi khoá (ở mọi độ sâu, kể cả trong mảng) có tên khớp ${c('/secret|password|token|key|authorization/i')} được thay giá trị bằng ${c('"[REDACTED]"')}; với khoá ${c('databaseUrl')} hoặc ${c('DATABASE_URL')} (giá trị là chuỗi URL), chỉ che mật khẩu: ${c('postgres://app:pw@db/shop')} ⇒ ${c('postgres://app:***@db/shop')}. Không sửa object gốc.</p>`,
      yeuCau: ['Đệ quy qua object và mảng.', 'Khoá nhạy cảm ⇒ "[REDACTED]" bất kể kiểu giá trị.', 'URL CSDL: chỉ che mật khẩu.'],
      dauVao: 'value: bất kỳ giá trị JSON nào.', dauRa: 'bản sao đã che.',
      rangBuoc: ['Không đổi giá trị nguyên thuỷ khác.'],
      viDu: [{ input: 'redact({ user: "an", password: "123" })', output: '{ user: "an", password: "[REDACTED]" }', explanation: 'Log vẫn hữu ích mà không chứa bí mật.' }],
      goiY: ['if (Array.isArray(v)) return v.map(redact);', 'Mật khẩu: v.replace(/^([a-z]+:\\/\\/[^:/@]+:)[^@]*@/i, "$1***@")'],
      khoiDau: { 'main.js': `// Bài 14.2 — che bí mật trong log
function redact(value) {
  return JSON.parse(JSON.stringify(value));
}
` },
      loiGiai: { 'main.js': `// Bài 14.2 — che bí mật trong log: đệ quy, khoá nhạy cảm ⇒ [REDACTED]
const SENSITIVE = /secret|password|token|key|authorization/i;

function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value === null || typeof value !== 'object') return value;     // giá trị nguyên thuỷ giữ nguyên
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (SENSITIVE.test(k)) out[k] = '[REDACTED]';
    else if ((k === 'databaseUrl' || k === 'DATABASE_URL') && typeof v === 'string') {
      out[k] = v.replace(/^([a-z][a-z0-9+.-]*:\\/\\/[^:/@]+:)[^@]*@/i, '$1***@');   // chỉ che mật khẩu
    } else out[k] = redact(v);
  }
  return out;
}
` },
      giaiThich: `<p>Log được gửi sang dịch vụ khác, lưu nhiều tháng, nhiều người đọc — in nguyên cấu hình là rò bí mật chậm. Che theo tên khoá là cách các thư viện log như pino làm (tuỳ chọn ${c('redact')}).</p>`,
      loiHayGap: ['Chỉ che ở tầng đầu — bí mật lồng trong object con vẫn lộ.', 'Sửa trực tiếp object gốc — code dùng cấu hình sau đó nhận "[REDACTED]".'],
      thamKhao: 'https://getpino.io/#/docs/redaction',
      kiem: [
        { moTa: 'Nested keys and arrays|||Khoá lồng nhau và mảng', goi: 'redact({ port: 3000, payment: { apiKey: "k", region: "vn" }, users: [{ name: "an", passwordHash: "h" }] })', mongDoi: { port: 3000, payment: { apiKey: '[REDACTED]', region: 'vn' }, users: [{ name: 'an', passwordHash: '[REDACTED]' }] } },
        { moTa: 'Database URL keeps everything but the password|||URL CSDL giữ tất cả trừ mật khẩu', goi: 'redact({ databaseUrl: "postgres://app:demo-pw@db:5432/shop" })', mongDoi: { databaseUrl: 'postgres://app:***@db:5432/shop' } },
        { moTa: 'Original untouched; primitives pass through|||Không sửa gốc; giá trị nguyên thuỷ đi qua', chuanBi: 'const o = { token: "t" }; const r = redact(o);', goi: '[o.token, r.token, redact(5), redact(null)]', mongDoi: ['t', '[REDACTED]', 5, null] },
      ],
    },
    {
      tieuDe: 'Đối chiếu .env.example',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['tài liệu hoá cấu hình', 'so sánh tập hợp', 'phát hiện bí mật trong file mẫu'], tienQuyet: ['Set', 'regex'], the: ['javascript', 'env', 'CI'],
      moTa: `${BAI}<p>Viết ${c('checkEnvExample(exampleText, codeText)')}: ${c('exampleText')} là nội dung .env.example (định dạng như bài 1 — viết lại phần đọc), ${c('codeText')} là toàn bộ mã nguồn. Tìm mọi tên biến được dùng trong mã qua ${c('process.env.TÊN')} hoặc ${c('import.meta.env.TÊN')} (TÊN: chữ in hoa, số, gạch dưới; bỏ ${c('MODE DEV PROD')}). Trả ${c('{ missing, unused, suspicious }')}: ${c('missing')} = dùng trong mã mà không có trong file mẫu; ${c('unused')} = có trong file mẫu mà mã không dùng; ${c('suspicious')} = tên trong file mẫu có giá trị trông như bí mật thật (dài ≥ 16 ký tự, không chứa dấu cách, có cả chữ lẫn số, và không phải URL — không chứa ${c('://')}). Cả ba mảng đều sắp xếp.</p>`,
      yeuCau: ['Nhận diện cả process.env và import.meta.env.', 'Ba mảng sắp xếp, không trùng lặp.', 'Giá trị giữ chỗ kiểu "ask-your-team-lead" (không có số) và URL mẫu không bị coi là bí mật.'],
      dauVao: 'exampleText: string; codeText: string.', dauRa: '{ missing: string[], unused: string[], suspicious: string[] }.',
      rangBuoc: ['Một hàm tự đủ (không dùng hàm của bài trước).'],
      viDu: [{ input: 'file mẫu thiếu PORT mà server.mjs đọc process.env.PORT', output: '{ missing: ["PORT"], … }', explanation: 'Người mới clone dự án sẽ không biết phải đặt PORT.' }],
      goiY: ['Tên trong mã: [...codeText.matchAll(/(?:process\\.env|import\\.meta\\.env)\\.([A-Z][A-Z0-9_]*)/g)]', 'So hai Set: [...a].filter((x) => !b.has(x)).sort()'],
      khoiDau: { 'main.js': `// Bài 14.2 — đối chiếu .env.example
function checkEnvExample(exampleText, codeText) {
  return { missing: [], unused: [], suspicious: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 14.2 — đối chiếu .env.example với mã nguồn
function checkEnvExample(exampleText, codeText) {
  const example = new Map();
  for (const raw of exampleText.split(/\\r?\\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 0) continue;
    example.set(line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^(["'])(.*)\\1$/, '$2'));
  }
  const used = new Set();
  for (const m of codeText.matchAll(/(?:process\\.env|import\\.meta\\.env)\\.([A-Z][A-Z0-9_]*)/g)) {
    if (!['MODE', 'DEV', 'PROD'].includes(m[1])) used.add(m[1]);    // biến dựng sẵn của Vite
  }
  const sorted = (arr) => [...new Set(arr)].sort();
  return {
    missing: sorted([...used].filter((n) => !example.has(n))),
    unused: sorted([...example.keys()].filter((n) => !used.has(n))),
    suspicious: sorted([...example].filter(([, v]) => v.length >= 16 && !/\\s/.test(v) && /[a-z]/i.test(v) && /\\d/.test(v) && !v.includes('://')).map(([n]) => n)),
  };
}
` },
      giaiThich: `<p>.env.example là tài liệu sống của cấu hình: người mới chỉ cần chép nó thành .env. Nó hỏng theo hai cách — thiếu biến mà mã cần (missing) và bị ai đó dán giá trị thật vào (suspicious) rồi commit. Phép kiểm này chạy được trong CI trước mỗi lần merge.</p>`,
      loiHayGap: ['Quên import.meta.env — bỏ sót biến frontend.', 'Coi URL ví dụ là bí mật — báo động giả làm người ta tắt phép kiểm.'],
      thamKhao: 'https://12factor.net/config',
      kiem: [
        { moTa: 'The lesson project|||Dự án của bài', goi: 'checkEnvExample("VITE_API_URL=https://api.ctshop.example\\nDATABASE_URL=postgres://app:change-me@localhost/shop\\nPAYMENT_SECRET=ask-your-team-lead", "const u = import.meta.env.VITE_API_URL; const db = process.env.DATABASE_URL; const p = Number(process.env.PORT); if (import.meta.env.DEV) {}")', mongDoi: { missing: ['PORT'], unused: ['PAYMENT_SECRET'], suspicious: [] } },
        { moTa: 'A real-looking secret is flagged|||Giá trị trông như bí mật thật bị gắn cờ', goi: 'checkEnvExample("API_KEY=demo0001demo0002demo0003\\nTITLE=CT Shop for everyone today", "process.env.API_KEY; process.env.TITLE")', mongDoi: { missing: [], unused: [], suspicious: ['API_KEY'] } },
        { moTa: 'Duplicates and sorting|||Trùng lặp và sắp xếp', goi: 'checkEnvExample("", "process.env.Z_VAR; process.env.A_VAR; process.env.Z_VAR").missing', mongDoi: ['A_VAR', 'Z_VAR'] },
      ],
    },
  ],
});
