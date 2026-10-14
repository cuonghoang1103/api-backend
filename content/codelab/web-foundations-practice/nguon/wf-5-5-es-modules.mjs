/** Bộ luyện bài 5.5 — ES modules. Lược đồ: ./_luoc-do.mjs (loại 'module'). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const MODULE_NOTE = '<p><em>Mọi tệp .js ở đây là ES module, nạp giống trình duyệt: đường dẫn import phải là đường tương đối CÓ đuôi <code>.js</code>; import một tên mà tệp kia không export là lỗi ngay lúc liên kết. Máy chấm chạy <code>main.js</code> và đọc từng dòng console.</em></p>';

// Máy chủ thời tiết giả — nhận cả hai cách mã hoá dấu cách (URLSearchParams: +, encodeURIComponent: %20)
const thoiTiet = (tp, mau) => Object.fromEntries([
  [`/api/thoi-tiet?city=${encodeURIComponent(tp)}`, mau],
  [`/api/thoi-tiet?${new URLSearchParams({ city: tp })}`, mau],
]);
const FETCH_THOI_TIET = {
  ...thoiTiet('Hà Nội', { json: { thanhPho: 'Hà Nội', nhietDo: 31, troi: 'nắng' } }),
  ...thoiTiet('Huế', { json: { thanhPho: 'Huế', nhietDo: 29, troi: 'mưa' } }),
  ...thoiTiet('Đà Lạt', { status: 404, json: { loi: 'Không có dữ liệu' } }),
};

const CONFIG_TT = `// config.js — cấu hình chung
export const API_GOC = "/api/thoi-tiet";
`;
const DINH_DANG_TT = `// dinh-dang.js — MỘT việc chính ⇒ default export
export default function dinhDangThoiTiet({ thanhPho, nhietDo, troi }) {
  return ´@{thanhPho}: @{nhietDo}°C, @{troi}´;
}
`;

export default doiDau({
  slug: 'wf-5-5-es-modules',
  ten: '5.5 ES modules: chia code thành nhiều file',
  baiHoc: 'Nền tảng Web — Bài 5.5 ES modules: chia code thành nhiều file',
  ngonNgu: 'javascript',
  loaiKiem: 'module',
  level: 'BEGINNER',
  moTa: 'export có tên và export default, import đúng dạng, đường dẫn tương đối có đuôi .js, tách một tệp lớn thành module, module chạy một lần và trạng thái dùng chung, gom export qua index.js, ghép một ứng dụng nhỏ nhiều module — 7 bài, máy chấm nạp module thật.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Export có tên: chia sẻ nhiều thứ từ một tệp',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['export có tên', 'import { … }', 'module scope'],
      tienQuyet: ['hàm', 'const'],
      the: ['javascript', 'es-modules', 'export'],
      moTa: `<p>Bài 5.5: <em>"Mỗi tệp export những phần nó muốn chia sẻ và import thứ nó cần từ tệp khác."</em> ${c('main.js')} đang ${c('import { add, PI } from "./math.js"')} nhưng ${c('math.js')} chưa export gì — trình duyệt báo ${c("SyntaxError: The requested module './math.js' does not provide an export named 'add'")}. Thêm ${c('export')} cho cả ba thứ trong math.js.</p>
${MODULE_NOTE}`,
      yeuCau: [
        `${c('math.js')} export có tên ${c('add')}, ${c('multiply')} và ${c('PI')}.`,
        `${c('main.js')} chạy được và in ${c('5')} rồi ${c('3.14159')}.`,
        'Không đổi main.js.',
      ],
      dauVao: 'Hai tệp: math.js, main.js.',
      dauRa: 'Console: 5, 3.14159.',
      rangBuoc: ['Dùng export có tên (không default).'],
      viDu: [
        { input: 'export function add(a, b) { return a + b; }', output: 'import { add } from "./math.js" dùng được', explanation: 'Tên trong ngoặc nhọn phải KHỚP tên đã export.' },
      ],
      goiY: [
        'Viết chữ export ngay trước function / const muốn chia sẻ.',
        'export function add(…) {…}  export function multiply(…) {…}  export const PI = 3.14159;',
      ],
      khoiDau: {
        'math.js': `// math.js — chưa export gì cả
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

const PI = 3.14159;
`,
        'main.js': `// main.js — đừng sửa
import { add, PI } from "./math.js";

console.log(add(2, 3));
console.log(PI);
`,
      },
      loiGiai: {
        'math.js': `// math.js — export có tên: một tệp chia sẻ được NHIỀU thứ
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;
// Thứ gì không export thì chỉ sống trong tệp này (phạm vi module)
`,
        'main.js': `// main.js — đừng sửa
import { add, PI } from "./math.js";

console.log(add(2, 3));
console.log(PI);
`,
      },
      giaiThich: `<p>Mỗi tệp module có phạm vi riêng: ${c('function add')} khai báo trong math.js không tự lọt sang tệp khác (khác hẳn script cổ điển, nơi mọi thứ cấp cao nhất thành toàn cục). ${c('export')} là cách duy nhất để chia sẻ, ${c('import { tên }')} là cách duy nhất để dùng — và tên phải khớp, nên trình soạn thảo đổi tên xuyên tệp được.</p>
<p>Lỗi import sai tên xảy ra lúc <em>liên kết</em>, trước khi dòng nào của main.js chạy. Máy chấm nạp main.js, đọc console, và kiểm danh sách export của math.js.</p>`,
      loiHayGap: [
        `${c('export { add, multiply, PI }')} ở cuối tệp cũng đúng — miễn là có export.`,
        'Chỉ export add và PI — multiply vẫn cần cho các tệp khác (máy chấm kiểm).',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
      kiem: [
        { moTa: 'main.js nạp được (import khớp export)', kiem: 'nap-duoc' },
        { moTa: 'main.js in 5 và 3.14159', so: 'console', mongDoi: ['5', '3.14159'] },
        { moTa: 'math.js export đủ ba tên', goi: 'Object.keys(__module("./math.js")).sort()', mongDoi: ['PI', 'add', 'multiply'] },
        { moTa: 'multiply(4, 5) = 20', goi: '__module("./math.js").multiply(4, 5)', mongDoi: 20 },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Export default: import không có ngoặc nhọn',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['export default', 'import X from', 'một default mỗi tệp'],
      tienQuyet: ['export có tên'],
      the: ['javascript', 'es-modules', 'default-export'],
      moTa: `<p>Bài 5.5: <em>"Default export — một thứ chính mỗi tệp. Import không ngoặc nhọn, đặt tên gì tuỳ bạn."</em> ${c('User.js')} export default một hàm tạo người dùng. ${c('main.js')} lại import nó bằng ngoặc nhọn — tìm một export <em>có tên</em> ${c('taoNguoiDung')} không hề tồn tại. Sửa main.js.</p>
${MODULE_NOTE}`,
      yeuCau: [
        `Sửa dòng import trong ${c('main.js')} cho khớp với ${c('export default')} của User.js.`,
        `main.js in ${c('{"ten":"Lan","vaiTro":"thanh-vien"}')}.`,
        'Không sửa User.js.',
      ],
      dauVao: 'User.js (export default), main.js.',
      dauRa: 'Console: một dòng JSON.',
      rangBuoc: ['Không đổi User.js sang export có tên.'],
      viDu: [
        { input: 'export default function User(name) { … }', output: 'import User from "./User.js";', explanation: 'Không ngoặc nhọn; tên phía import tuỳ chọn.' },
      ],
      goiY: [
        'Ngoặc nhọn = export CÓ TÊN. Không ngoặc nhọn = export DEFAULT.',
        'import taoNguoiDung from "./User.js";',
      ],
      khoiDau: {
        'main.js': `// main.js
import { taoNguoiDung } from "./User.js";

console.log(JSON.stringify(taoNguoiDung("Lan")));
`,
        'User.js': `// User.js — đừng sửa
export default function taoNguoiDung(ten) {
  return { ten, vaiTro: "thanh-vien" };
}
`,
      },
      loiGiai: {
        'main.js': `// main.js
// Export DEFAULT ⇒ import KHÔNG ngoặc nhọn; tên bên trái do tệp import tự đặt
import taoNguoiDung from "./User.js";

console.log(JSON.stringify(taoNguoiDung("Lan")));
`,
        'User.js': `// User.js — đừng sửa
export default function taoNguoiDung(ten) {
  return { ten, vaiTro: "thanh-vien" };
}
`,
      },
      giaiThich: `<p>Một module có thể có nhiều export có tên và tối đa một ${c('default')}. Bên trong, ${c('default')} thật ra là một export có tên đặc biệt tên là ${c('"default"')} — ${c('import X from')} là cách viết tắt của ${c('import { default as X } from')}. Vì phía import tự đặt tên, hai tệp có thể gọi cùng một thứ bằng hai tên khác nhau — tiện, nhưng công cụ khó theo dõi hơn.</p>
<p>Máy chấm nạp main.js, đọc console, và kiểm User.js vẫn chỉ có export ${c('default')}.</p>`,
      loiHayGap: [
        `Sửa User.js thành export có tên — đề cấm; React và nhiều thư viện dùng default, bạn phải đọc được cả hai.`,
        `${c('import * from "./User.js"')} — thiếu ${c('as tên')}, lỗi cú pháp.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#importing_defaults',
      kiem: [
        { moTa: 'main.js nạp được', kiem: 'nap-duoc' },
        { moTa: 'In ra người dùng Lan', so: 'console', mongDoi: ['{"ten":"Lan","vaiTro":"thanh-vien"}'] },
        { moTa: 'User.js vẫn chỉ có export default', goi: 'Object.keys(__module("./User.js"))', mongDoi: ['default'] },
        { moTa: 'main.js import không ngoặc nhọn', kiem: 'ma-nguon', tep: 'main.js', khop: 'import\\s+\\w+\\s+from\\s+["\']\\./User\\.js["\']' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Đường dẫn import: có đuôi .js, đúng ./ và ../',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['đường dẫn tương đối', '../', 'đuôi .js bắt buộc trong trình duyệt', 'thư mục con'],
      tienQuyet: ['import / export'],
      the: ['javascript', 'es-modules', 'paths'],
      moTa: `<p>Bài 5.5: <em>"Trong trình duyệt là ./utils.js — không phải ./utils. Bundler cho bỏ đuôi, nên chuyển code sang trình duyệt đôi khi vỡ import."</em> Dự án có thư mục con:</p>
<pre><code>main.js
config.js
utils/tien.js</code></pre>
<p>Hai dòng import đang sai: ${c('main.js')} viết ${c('"./utils/tien"')} (thiếu đuôi), và ${c('utils/tien.js')} viết ${c('"./config.js"')} — nhưng config.js nằm ở thư mục <em>cha</em> của utils/.</p>
${MODULE_NOTE}`,
      yeuCau: [
        `main.js import từ ${c('"./utils/tien.js"')}.`,
        `utils/tien.js import ${c('KY_HIEU')} từ ${c('"../config.js"')} (đường dẫn tính từ CHÍNH tệp tien.js).`,
        `main.js in ${c('"125000đ"')}.`,
      ],
      dauVao: 'Ba tệp.',
      dauRa: 'Console: 125000đ.',
      rangBuoc: ['Không di chuyển tệp.'],
      viDu: [
        { input: 'import { x } from "./utils/tien"', output: 'Failed to resolve module specifier "./utils/tien"', explanation: 'Trình duyệt tải đúng URL bạn viết — không tự đoán đuôi.' },
        { input: 'trong utils/tien.js: import … from "./config.js"', output: 'tìm utils/config.js — không có', explanation: './ là thư mục của tệp đang viết, không phải thư mục gốc dự án.' },
      ],
      goiY: [
        'Đường dẫn tương đối tính từ vị trí của TỆP CHỨA dòng import (giống href tương đối ở Bài 1.1/2.2).',
        'main.js: from "./utils/tien.js"; utils/tien.js: from "../config.js".',
      ],
      khoiDau: {
        'main.js': `// main.js
import { dinhDangTien } from "./utils/tien";

console.log(dinhDangTien(125000));
`,
        'utils/tien.js': `// utils/tien.js
import { KY_HIEU } from "./config.js";

export function dinhDangTien(so) {
  return ´@{so}@{KY_HIEU}´;
}
`,
        'config.js': `// config.js
export const KY_HIEU = "đ";
`,
      },
      loiGiai: {
        'main.js': `// main.js — đường dẫn tính từ thư mục của main.js; trình duyệt cần ĐỦ đuôi .js
import { dinhDangTien } from "./utils/tien.js";

console.log(dinhDangTien(125000));
`,
        'utils/tien.js': `// utils/tien.js — "./" là utils/, nên lên một cấp bằng "../" để tới config.js
import { KY_HIEU } from "../config.js";

export function dinhDangTien(so) {
  return ´@{so}@{KY_HIEU}´;
}
`,
        'config.js': `// config.js
export const KY_HIEU = "đ";
`,
      },
      giaiThich: `<p>Specifier của import là một URL tương đối, phân giải theo URL của <em>tệp đang import</em> — đúng luật của ${c('href')} và ${c('src')}. Trong trình duyệt không ai "đoán" đuôi hay tìm ${c('index.js')} giúp bạn; bundler (Vite, webpack) và Node có luật phân giải riêng nên code chạy ở đó có thể vỡ khi đưa thẳng lên trình duyệt.</p>
<p>Máy chấm phân giải đường dẫn như trình duyệt. Nó nạp main.js, đọc console và kiểm từng tệp nạp được.</p>`,
      loiHayGap: [
        'Sửa thành "/config.js" (đường dẫn tuyệt đối) — trỏ về gốc tên miền, không phải gốc dự án; dễ vỡ khi trang nằm trong thư mục con.',
        'Chép config.js vào utils/ — giờ có hai bản cấu hình lệch nhau.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_features_into_your_script',
      kiem: [
        { moTa: 'main.js nạp được', kiem: 'nap-duoc' },
        { moTa: 'utils/tien.js nạp được', kiem: 'nap-duoc', tep: 'utils/tien.js' },
        { moTa: 'In 125000đ', so: 'console', mongDoi: ['125000đ'] },
        { moTa: 'dinhDangTien dùng ký hiệu từ config.js', goi: '__module("./utils/tien.js").dinhDangTien(5)', mongDoi: '5đ' },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Tách một tệp 60 dòng thành ba module',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['tách module theo trách nhiệm', 'named + default trong cùng dự án', 'hàm thuần'],
      tienQuyet: ['export có tên', 'export default'],
      the: ['javascript', 'es-modules', 'refactoring'],
      moTa: `<p>Bài 5.5: <em>"Không thể nhét cả ứng dụng vào một tệp."</em> ${c('main.js')} đang chứa mọi thứ của giỏ hàng. Tách ra:</p>
<ul><li>${c('gio-hang.js')}: export có tên ${c('themVao(gio, mon)')} (trả về giỏ MỚI) và ${c('tongTien(gio)')}.</li>
<li>${c('dinh-dang.js')}: export default ${c('dinhDangTien(so)')} → ${c('"39000đ"')}.</li>
<li>${c('main.js')}: chỉ còn import và phần chạy — output giữ nguyên y như trước.</li></ul>
${MODULE_NOTE}`,
      yeuCau: [
        'gio-hang.js và dinh-dang.js export đúng như trên.',
        'main.js không còn định nghĩa themVao / tongTien / dinhDangTien — chỉ import.',
        `Output của main.js không đổi: ${c('"2 món"')}, ${c('"Tổng: 39000đ"')}.`,
        'themVao không sửa mảng giỏ cũ.',
      ],
      dauVao: 'main.js nguyên khối; gio-hang.js và dinh-dang.js đang trống.',
      dauRa: 'Ba tệp, cùng output.',
      rangBuoc: ['Không đổi tên hàm.'],
      viDu: [
        { input: 'tongTien([{ gia: 5000, soLuong: 3 }, { gia: 12000, soLuong: 2 }])', output: '39000', explanation: 'Logic như Bài 4.4, giờ nằm ở gio-hang.js.' },
      ],
      goiY: [
        'Cắt từng hàm sang tệp mới, thêm export; ở main.js thêm import tương ứng. Chạy sau mỗi bước.',
        'main.js: import { themVao, tongTien } from "./gio-hang.js"; import dinhDangTien from "./dinh-dang.js";',
      ],
      khoiDau: {
        'main.js': `// main.js — mọi thứ trong một tệp
function themVao(gio, mon) {
  return [...gio, mon];
}

function tongTien(gio) {
  return gio.reduce((tong, mon) => tong + mon.gia * mon.soLuong, 0);
}

function dinhDangTien(so) {
  return ´@{so}đ´;
}

let gio = [];
gio = themVao(gio, { ten: "Bút", gia: 5000, soLuong: 3 });
gio = themVao(gio, { ten: "Vở", gia: 12000, soLuong: 2 });
console.log(´@{gio.length} món´);
console.log(´Tổng: @{dinhDangTien(tongTien(gio))}´);
`,
        'gio-hang.js': `// gio-hang.js — chuyển themVao và tongTien vào đây
`,
        'dinh-dang.js': `// dinh-dang.js — chuyển dinhDangTien vào đây (export default)
`,
      },
      loiGiai: {
        'main.js': `// main.js — chỉ còn "dây nối": import rồi chạy
import { themVao, tongTien } from "./gio-hang.js";   // export có tên ⇒ ngoặc nhọn
import dinhDangTien from "./dinh-dang.js";           // export default ⇒ không ngoặc

let gio = [];
gio = themVao(gio, { ten: "Bút", gia: 5000, soLuong: 3 });
gio = themVao(gio, { ten: "Vở", gia: 12000, soLuong: 2 });
console.log(´@{gio.length} món´);
console.log(´Tổng: @{dinhDangTien(tongTien(gio))}´);
`,
        'gio-hang.js': `// gio-hang.js — logic giỏ hàng (không biết gì về hiển thị)
export function themVao(gio, mon) {
  return [...gio, mon];        // giỏ MỚI — giỏ cũ không bị sửa
}

export function tongTien(gio) {
  return gio.reduce((tong, mon) => tong + mon.gia * mon.soLuong, 0);
}
`,
        'dinh-dang.js': `// dinh-dang.js — một việc chính ⇒ export default
export default function dinhDangTien(so) {
  return ´@{so}đ´;
}
`,
      },
      giaiThich: `<p>Tách theo <em>trách nhiệm</em>: logic dữ liệu (giỏ hàng) không phụ thuộc cách hiển thị (định dạng tiền) — muốn đổi sang "39.000 ₫" chỉ sửa một tệp, muốn kiểm thử tongTien thì import mỗi gio-hang.js. main.js trở thành "dây nối" ngắn đọc một lượt là hiểu ứng dụng làm gì.</p>
<p>Máy chấm kiểm output không đổi, từng hàm gọi được qua đúng tệp của nó, giỏ cũ không bị sửa, và main.js không còn định nghĩa lại các hàm.</p>`,
      loiHayGap: [
        'Để lại bản sao hàm trong main.js "cho chắc" — hai bản sẽ lệch nhau.',
        'Export default trong gio-hang.js một object { themVao, tongTien } — chạy được nhưng mất lợi ích của export có tên.',
      ],
      thamKhao: 'https://javascript.info/import-export',
      kiem: [
        { moTa: 'Output không đổi', so: 'console', mongDoi: ['2 món', 'Tổng: 39000đ'] },
        { moTa: 'gio-hang.js export themVao và tongTien', goi: 'Object.keys(__module("./gio-hang.js")).sort()', mongDoi: ['themVao', 'tongTien'] },
        { moTa: 'tongTien gọi được từ gio-hang.js', goi: '__module("./gio-hang.js").tongTien([{ gia: 5000, soLuong: 3 }, { gia: 12000, soLuong: 2 }])', mongDoi: 39000 },
        { moTa: 'themVao không sửa giỏ cũ', chuanBi: 'const cu = [{ ten: "A" }]; const moi = __module("./gio-hang.js").themVao(cu, { ten: "B" });', goi: '[cu.length, moi.length]', mongDoi: [1, 2] },
        { moTa: 'dinh-dang.js export default', goi: '__module("./dinh-dang.js").default(39000)', mongDoi: '39000đ' },
        { moTa: 'main.js không còn định nghĩa các hàm', kiem: 'ma-nguon', tep: 'main.js', khop: 'function\\s+(themVao|tongTien|dinhDangTien)\\b', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Module chạy một lần: trạng thái dùng chung giữa các tệp',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['module được cache', 'chạy một lần', 'live binding', 'trạng thái dùng chung'],
      tienQuyet: ['export có tên'],
      the: ['javascript', 'es-modules', 'singleton'],
      moTa: `<p>Bài 5.5: <em>"Import cùng một tệp từ năm chỗ thì nó chạy đúng một lần."</em> ${c('kho.js')} giữ bộ đếm lượt thích của cả trang. ${c('a.js')} và ${c('b.js')} (hai component) mỗi cái thích một lần lúc nạp. Nhưng ${c('b.js')} đang tự chép một bộ đếm riêng, nên tổng chỉ ra 1. Sửa b.js để dùng chung kho, và cho main.js đọc cả ${c('layDem()')} lẫn biến ${c('dem')} export trực tiếp.</p>
${MODULE_NOTE}`,
      yeuCau: [
        `${c('kho.js')} (đã có) in ${c('"Nạp kho"')} khi được nạp; export ${c('tang')}, ${c('layDem')} và ${c('let dem')}.`,
        `${c('b.js')} import ${c('tang')} từ ${c('"./kho.js"')} — không còn bộ đếm riêng.`,
        `${c('main.js')} in: ${c('"Nạp kho"')} (MỘT lần), ${c('"Tổng: 2"')}, ${c('"dem trực tiếp: 2"')} — dòng cuối import thẳng biến ${c('dem')}.`,
      ],
      dauVao: 'kho.js, a.js, b.js, main.js.',
      dauRa: 'Console ba dòng.',
      rangBuoc: ['Không sửa kho.js và a.js.'],
      viDu: [
        { input: 'a.js và b.js cùng import "./kho.js"', output: 'Nạp kho   (chỉ một lần)', explanation: 'Module được lưu đệm theo URL đã phân giải — lần import thứ hai nhận lại đúng instance cũ.' },
      ],
      goiY: [
        'b.js chỉ cần: import { tang } from "./kho.js"; tang();',
        'main.js: import "./a.js"; import "./b.js"; import { layDem, dem } from "./kho.js"; — dem là "live binding": đọc lúc nào thấy giá trị lúc đó.',
      ],
      khoiDau: {
        'main.js': `// main.js
import "./a.js";
import "./b.js";
import { layDem } from "./kho.js";

console.log(´Tổng: @{layDem()}´);
`,
        'b.js': `// b.js — tự chép một bộ đếm riêng (sai)
let dem = 0;
function tang() {
  dem = dem + 1;
}
tang();
`,
        'a.js': `// a.js — đừng sửa
import { tang } from "./kho.js";
tang();
`,
        'kho.js': `// kho.js — đừng sửa
console.log("Nạp kho");

export let dem = 0;

export function tang() {
  dem = dem + 1;
}

export function layDem() {
  return dem;
}
`,
      },
      loiGiai: {
        'main.js': `// main.js
import "./a.js";                        // import chỉ để CHẠY tệp (tác dụng phụ)
import "./b.js";
import { layDem, dem } from "./kho.js"; // cùng instance mà a.js và b.js đã dùng

console.log(´Tổng: @{layDem()}´);
// dem là live binding: không phải bản sao lúc import, mà là "cửa sổ" nhìn vào biến của kho.js
console.log(´dem trực tiếp: @{dem}´);
`,
        'b.js': `// b.js — dùng CHUNG kho với a.js: cùng URL "./kho.js" ⇒ cùng một module, nạp một lần
import { tang } from "./kho.js";
tang();
`,
        'a.js': `// a.js — đừng sửa
import { tang } from "./kho.js";
tang();
`,
        'kho.js': `// kho.js — đừng sửa
console.log("Nạp kho");

export let dem = 0;

export function tang() {
  dem = dem + 1;
}

export function layDem() {
  return dem;
}
`,
      },
      giaiThich: `<p>Mỗi module được nạp, liên kết và chạy <strong>một lần</strong> cho mỗi URL; mọi import sau đó nhận lại cùng instance. Nên một module giữ trạng thái (bộ đếm, kết nối cơ sở dữ liệu, cấu hình) tự nhiên thành "một bản duy nhất" dùng chung — đó là lý do kết nối Prisma ở backend Chương 8 nằm trong một tệp riêng được import khắp nơi.</p>
<p>${c('import { dem }')} không chép giá trị: nó là một <em>live binding</em>, luôn thấy giá trị hiện tại của biến trong kho.js (nhưng phía import không gán lại được nó). Máy chấm kiểm "Nạp kho" chỉ in một lần và cả hai cách đọc đều ra 2.</p>`,
      loiHayGap: [
        'Import "./Kho.js" hay "./kho.js?x" ở một chỗ — URL khác ⇒ module khác ⇒ hai kho.',
        'Gán dem = 5 trong main.js — binding import là chỉ đọc (TypeError).',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#imported_values_can_only_be_modified_by_the_exporter',
      kiem: [
        { moTa: 'Output: Nạp kho một lần, Tổng 2, dem trực tiếp 2', so: 'console', mongDoi: ['Nạp kho', 'Tổng: 2', 'dem trực tiếp: 2'] },
        { moTa: 'b.js import tang từ ./kho.js', kiem: 'ma-nguon', tep: 'b.js', khop: 'import\\s*\\{\\s*tang\\s*\\}\\s*from\\s*["\']\\./kho\\.js["\']' },
        { moTa: 'b.js không còn bộ đếm riêng', kiem: 'ma-nguon', tep: 'b.js', khop: '\\blet\\s+dem\\b|function\\s+tang', phuDinh: true },
        { moTa: 'Đọc kho từ ngoài: layDem() = 2', goi: '__module("./kho.js").layDem()', mongDoi: 2 },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Gom export qua utils/index.js (barrel file)',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['export { … } from', 'export { default as … } from', 'barrel file', 'import * as'],
      tienQuyet: ['export có tên', 'export default'],
      the: ['javascript', 'es-modules', 're-export'],
      moTa: `<p>Thư mục ${c('utils/')} có ba tệp nhỏ. Thay vì để mọi nơi import ba dòng, dự án dùng một tệp ${c('utils/index.js')} <strong>gom và xuất lại</strong> (re-export) — người dùng chỉ cần ${c('import { … } from "./utils/index.js"')}. Bản hiện tại của index.js chỉ <em>import</em> chứ không xuất lại, nên main.js báo thiếu export.</p>
<ul><li>${c('tien.js')}: export có tên ${c('dinhDangTien')}</li>
<li>${c('chu.js')}: export có tên ${c('vietHoaDau')}</li>
<li>${c('slug.js')}: export <strong>default</strong> một hàm — xuất lại dưới tên ${c('taoSlug')}</li></ul>
${MODULE_NOTE}`,
      yeuCau: [
        `${c('utils/index.js')} xuất lại đúng ba tên: ${c('dinhDangTien')}, ${c('vietHoaDau')}, ${c('taoSlug')}.`,
        `Dùng cú pháp ${c('export { … } from "…"')} (default thì ${c('export { default as taoSlug } from …')}).`,
        'main.js (không sửa) chạy được và in đúng ba dòng.',
      ],
      dauVao: 'utils/tien.js, utils/chu.js, utils/slug.js, utils/index.js, main.js.',
      dauRa: 'Console: 50000đ · Hà nội · ha-noi-mua-thu.',
      rangBuoc: ['Không sửa main.js và ba tệp tiện ích.'],
      viDu: [
        { input: 'export { dinhDangTien } from "./tien.js";', output: 'index.js có export dinhDangTien', explanation: 'Một dòng: import rồi export lại, không tạo biến cục bộ.' },
      ],
      goiY: [
        'Ba dòng export … from, mỗi tệp tiện ích một dòng.',
        'export { default as taoSlug } from "./slug.js"; — default của slug.js trở thành export CÓ TÊN taoSlug của index.js.',
      ],
      khoiDau: {
        'utils/index.js': `// utils/index.js — đang chỉ import, chưa xuất lại
import { dinhDangTien } from "./tien.js";
import { vietHoaDau } from "./chu.js";
import taoSlug from "./slug.js";
`,
        'main.js': `// main.js — đừng sửa
import { dinhDangTien, vietHoaDau, taoSlug } from "./utils/index.js";

console.log(dinhDangTien(50000));
console.log(vietHoaDau("hà nội"));
console.log(taoSlug("Hà Nội mùa thu"));
`,
        'utils/tien.js': `// utils/tien.js — đừng sửa
export function dinhDangTien(so) {
  return ´@{so}đ´;
}
`,
        'utils/chu.js': `// utils/chu.js — đừng sửa
export function vietHoaDau(chuoi) {
  return chuoi.charAt(0).toUpperCase() + chuoi.slice(1);
}
`,
        'utils/slug.js': `// utils/slug.js — đừng sửa (export default)
export default function taoSlug(chuoi) {
  return chuoi
    .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().trim().replace(/\\s+/g, "-");
}
`,
      },
      loiGiai: {
        'utils/index.js': `// utils/index.js — "barrel": gom các tiện ích về một cửa
// export { x } from "...": import và export lại trong một dòng (không tạo biến trong tệp này)
export { dinhDangTien } from "./tien.js";
export { vietHoaDau } from "./chu.js";
// default của slug.js ⇒ một export CÓ TÊN của index.js
export { default as taoSlug } from "./slug.js";
`,
        'main.js': `// main.js — đừng sửa
import { dinhDangTien, vietHoaDau, taoSlug } from "./utils/index.js";

console.log(dinhDangTien(50000));
console.log(vietHoaDau("hà nội"));
console.log(taoSlug("Hà Nội mùa thu"));
`,
        'utils/tien.js': `// utils/tien.js — đừng sửa
export function dinhDangTien(so) {
  return ´@{so}đ´;
}
`,
        'utils/chu.js': `// utils/chu.js — đừng sửa
export function vietHoaDau(chuoi) {
  return chuoi.charAt(0).toUpperCase() + chuoi.slice(1);
}
`,
        'utils/slug.js': `// utils/slug.js — đừng sửa (export default)
export default function taoSlug(chuoi) {
  return chuoi
    .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().trim().replace(/\\s+/g, "-");
}
`,
      },
      giaiThich: `<p>Import chỉ đưa tên <em>vào</em> phạm vi của tệp; muốn tệp khác thấy thì phải export. ${c('export { x } from "./a.js"')} làm cả hai việc trong một dòng mà không tạo biến cục bộ. Default không có tên cố định nên khi xuất lại phải đặt tên: ${c('export { default as taoSlug }')}.</p>
<p>Barrel file làm import gọn, nhưng có giá: nạp index.js là nạp <em>mọi</em> tệp nó gom, kể cả thứ bạn không dùng — với thư viện lớn đó là lý do bundle phình. Máy chấm kiểm danh sách export của index.js và output của main.js.</p>`,
      loiHayGap: [
        `${c('export default from "./slug.js"')} — không phải cú pháp hợp lệ.`,
        `${c('export * from "./slug.js"')} — export * KHÔNG mang theo default.`,
        'Giữ nguyên ba dòng import rồi thêm export { … } ở cuối — đúng, nhưng dài gấp đôi.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#re-exporting_aggregating',
      kiem: [
        { moTa: 'main.js nạp được', kiem: 'nap-duoc' },
        { moTa: 'Output ba dòng', so: 'console', mongDoi: ['50000đ', 'Hà nội', 'ha-noi-mua-thu'] },
        { moTa: 'index.js export đúng ba tên', goi: 'Object.keys(__module("./utils/index.js")).sort()', mongDoi: ['dinhDangTien', 'taoSlug', 'vietHoaDau'] },
        { moTa: 'Dùng export … from', kiem: 'ma-nguon', tep: 'utils/index.js', khop: 'export\\s*\\{[^}]*default\\s+as\\s+taoSlug[^}]*\\}\\s*from' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Ghép ứng dụng thời tiết từ bốn module + fetch',
      doKho: 'HARD', phut: 30, fetchGia: FETCH_THOI_TIET,
      khaiNiem: ['đồ thị phụ thuộc module', 'export async function', 'top-level await', 'Promise.all', 'lỗi từng phần'],
      tienQuyet: ['ES modules', 'fetch + res.ok', 'Promise.all', 'URLSearchParams'],
      the: ['javascript', 'es-modules', 'fetch', 'project'],
      moTa: `<p>Bài tổng hợp Chương 5. Ứng dụng thời tiết gồm bốn module:</p>
<pre><code>config.js      export const API_GOC
api.js         export async function layThoiTiet(thanhPho)      ← cần config.js
dinh-dang.js   export default function dinhDangThoiTiet(duLieu)
main.js        export async function taiTatCa(dsThanhPho)        ← cần api.js + dinh-dang.js</code></pre>
<p>Hoàn thiện ${c('api.js')} và ${c('main.js')}:</p>
<ul><li>${c('layThoiTiet(tp)')}: GET ${c('<API_GOC>?city=<tp đã mã hoá>')}, kiểm ${c('res.ok')} (lỗi ⇒ ném ${c('Error("HTTP <status>")')}), trả JSON.</li>
<li>${c('taiTatCa(ds)')}: tải mọi thành phố <strong>song song</strong>, trả mảng dòng hiển thị theo đúng thứ tự ds; thành phố lỗi thành dòng ${c('"Không tải được <tp>: HTTP 404"')} — không làm hỏng các dòng khác.</li>
<li>Cuối main.js: dùng top-level ${c('await')} gọi ${c('taiTatCa(["Hà Nội", "Đà Lạt", "Huế"])')} và in từng dòng.</li></ul>
${MODULE_NOTE}<p><em>fetch là máy chủ giả: mỗi phản hồi mất 50 ms ảo; Đà Lạt trả 404.</em></p>`,
      yeuCau: [
        `${c('api.js')} export có tên ${c('layThoiTiet')}; dùng ${c('API_GOC')} import từ config.js; mã hoá tên thành phố (URLSearchParams hoặc encodeURIComponent).`,
        `${c('main.js')} export ${c('taiTatCa')}; import default của dinh-dang.js đúng dạng.`,
        'Tải song song: 3 thành phố vẫn chỉ mất 50 ms.',
        `Output: ${c('"Hà Nội: 31°C, nắng"')}, ${c('"Không tải được Đà Lạt: HTTP 404"')}, ${c('"Huế: 29°C, mưa"')}.`,
      ],
      dauVao: 'Bốn tệp module; máy chủ giả.',
      dauRa: 'Console ba dòng; taiTatCa trả mảng ba dòng.',
      rangBuoc: ['Không sửa config.js, dinh-dang.js.', 'Không dùng Promise.allSettled.'],
      viDu: [
        { input: 'await taiTatCa(["Huế", "Hà Nội"])', output: '["Huế: 29°C, mưa", "Hà Nội: 31°C, nắng"]', explanation: 'Thứ tự theo đầu vào, sau 50 ms.' },
        { input: 'await layThoiTiet("Đà Lạt")', output: 'Error: HTTP 404', explanation: 'api.js ném; main.js bắt riêng cho từng thành phố.' },
      ],
      goiY: [
        'api.js: import { API_GOC } from "./config.js"; export async function layThoiTiet(tp) { const res = await fetch(´@{API_GOC}?@{new URLSearchParams({ city: tp })}´); if (!res.ok) throw new Error(´HTTP @{res.status}´); return res.json(); }',
        'main.js: return Promise.all(ds.map(async (tp) => { try { return dinhDangThoiTiet(await layThoiTiet(tp)); } catch (err) { return ´Không tải được @{tp}: @{err.message}´; } })); — rồi const dong = await taiTatCa([...]); for (const d of dong) console.log(d);',
      ],
      khoiDau: {
        'main.js': `// main.js
import { layThoiTiet } from "./api.js";
import { dinhDangThoiTiet } from "./dinh-dang.js";

export async function taiTatCa(dsThanhPho) {
  const dong = [];
  for (const tp of dsThanhPho) {
    dong.push(dinhDangThoiTiet(await layThoiTiet(tp)));
  }
  return dong;
}
`,
        'api.js': `// api.js
import { API_GOC } from "./config.js";

async function layThoiTiet(thanhPho) {
  const res = await fetch(API_GOC + "?city=" + thanhPho);
  return res.json();
}
`,
        'config.js': CONFIG_TT,
        'dinh-dang.js': DINH_DANG_TT,
      },
      loiGiai: {
        'main.js': `// main.js — "dây nối" của ứng dụng
import { layThoiTiet } from "./api.js";               // export có tên
import dinhDangThoiTiet from "./dinh-dang.js";         // export default ⇒ không ngoặc

export async function taiTatCa(dsThanhPho) {
  // Mỗi thành phố một Promise, bắt đầu cùng lúc; mỗi cái tự bắt lỗi của nó
  // ⇒ không cái nào reject ⇒ Promise.all không thất bại vì một thành phố.
  return Promise.all(
    dsThanhPho.map(async (tp) => {
      try {
        return dinhDangThoiTiet(await layThoiTiet(tp));
      } catch (err) {
        return ´Không tải được @{tp}: @{err.message}´;
      }
    }),
  );
}

// Top-level await: được phép ở cấp cao nhất của một ES module
const dong = await taiTatCa(["Hà Nội", "Đà Lạt", "Huế"]);
for (const d of dong) {
  console.log(d);
}
`,
        'api.js': `// api.js — mọi thứ về nói chuyện với máy chủ nằm ở đây
import { API_GOC } from "./config.js";

export async function layThoiTiet(thanhPho) {
  // Mã hoá tên có dấu và dấu cách — đừng ghép chuỗi trần vào URL
  const qs = new URLSearchParams({ city: thanhPho });
  const res = await fetch(´@{API_GOC}?@{qs}´);
  if (!res.ok) throw new Error(´HTTP @{res.status}´);   // fetch không tự ném khi 404
  return res.json();
}
`,
        'config.js': CONFIG_TT,
        'dinh-dang.js': DINH_DANG_TT,
      },
      giaiThich: `<p>Bài này gom cả chương: module chia trách nhiệm (cấu hình / mạng / hiển thị / dây nối), fetch có kiểm ${c('res.ok')}, Promise.all để song song, và bắt lỗi đúng phạm vi để một thành phố hỏng không kéo sập cả trang. Bốn lỗi của bản khởi đầu: api.js quên export; main.js import default bằng ngoặc nhọn; URL không mã hoá; tải tuần tự và một lỗi làm hỏng tất cả.</p>
<p>Top-level ${c('await')} chỉ có trong ES module: trình duyệt (và máy chấm) chờ module chạy xong — kể cả những ${c('await')} ở cấp cao nhất — trước khi coi nó đã nạp. Máy chấm kiểm output, export của từng tệp, lỗi 404 từ api.js và thời gian song song 50 ms.</p>`,
      loiHayGap: [
        'Bắt lỗi bằng một try/catch quanh cả Promise.all — một thành phố lỗi làm mất cả ba dòng.',
        'Gọi taiTatCa nhưng quên await ở cấp cao nhất — console in "[object Promise]" hoặc không in gì.',
        'Import "./api" thiếu đuôi .js.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await',
      kiem: [
        { moTa: 'main.js nạp được', kiem: 'nap-duoc' },
        { moTa: 'Output ba dòng đúng thứ tự', so: 'console', mongDoi: ['Hà Nội: 31°C, nắng', 'Không tải được Đà Lạt: HTTP 404', 'Huế: 29°C, mưa'] },
        { moTa: 'api.js export layThoiTiet', goi: 'await __module("./api.js").layThoiTiet("Huế")', mongDoi: { thanhPho: 'Huế', nhietDo: 29, troi: 'mưa' } },
        { moTa: 'layThoiTiet ném HTTP 404', goi: 'await __module("./api.js").layThoiTiet("Đà Lạt")', mongDoi: { loi: 'Error', thongDiep: '^HTTP 404$' } },
        { moTa: 'taiTatCa song song: 50 ms', chuanBi: 'const tai = __module("./main.js").taiTatCa; const t = Date.now(); await tai(["Huế", "Hà Nội", "Đà Lạt"]);', goi: 'Date.now() - t', mongDoi: 50 },
        { moTa: 'taiTatCa giữ thứ tự đầu vào', goi: 'await __module("./main.js").taiTatCa(["Huế", "Hà Nội"])', mongDoi: ['Huế: 29°C, mưa', 'Hà Nội: 31°C, nắng'], an: true },
        { moTa: 'Không dùng allSettled', kiem: 'ma-nguon', tep: 'main.js', khop: 'allSettled', phuDinh: true, an: true },
      ],
    },
  ],
});
