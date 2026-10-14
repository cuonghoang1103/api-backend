/** Bộ luyện bài 4.3 — Hàm. Lược đồ: ./_luoc-do.mjs (loại 'js'). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

export default doiDau({
  slug: 'wf-4-3-functions',
  ten: '4.3 Hàm: khối logic tái dùng',
  baiHoc: 'Nền tảng Web — Bài 4.3 Hàm: khối logic tái dùng',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Khai báo hàm và arrow function, tham số/đối số, return, tham số mặc định, phạm vi (scope), mệnh đề chốt chặn, bẫy arrow có ngoặc nhọn, hàm làm đối số — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Đổi hàm thường sang arrow function',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['arrow function', 'trả về ngầm', 'một tham số bỏ ngoặc'],
      tienQuyet: ['function'],
      the: ['javascript', 'arrow-function'],
      moTa: `<p>Bài 4.3: <em>"Hàm mũi tên — dạng ngắn hiện đại. Hãy đọc được cả hai dạng, chúng cùng một ý nghĩa."</em> Ba hàm dưới đây đang viết bằng ${c('function')}. Viết lại cả ba thành ${c('const ten = (...) => ...')}; hai hàm chỉ có một biểu thức thì dùng dạng <strong>trả về ngầm</strong> (không ngoặc nhọn, không ${c('return')}).</p>`,
      yeuCau: [
        `${c('binhPhuong(n)')} → ${c('n * n')}, viết ${c('const binhPhuong = n => n * n;')} (một tham số không cần ngoặc).`,
        `${c('tong(a, b)')} → ${c('a + b')}, arrow trả về ngầm.`,
        `${c('chaoHoi(ten)')} → ${c('"Chào " + ten + "!"')} hoặc template literal — dạng khối ${c('{ }')} có ${c('return')} cũng được.`,
        `Không còn từ khoá ${c('function')} trong tệp.`,
      ],
      dauVao: 'n, a, b: number; ten: string.',
      dauRa: 'Như ba hàm cũ — kết quả không đổi, chỉ đổi cách viết.',
      rangBuoc: ['Giữ nguyên tên ba hàm.'],
      viDu: [
        { input: 'binhPhuong(7)', output: '49', explanation: 'n => n * n — biểu thức sau => là giá trị trả về.' },
        { input: 'tong(2, 3)', output: '5', explanation: 'Hai tham số thì phải có ngoặc: (a, b) => a + b.' },
        { input: 'chaoHoi("Lan")', output: '"Chào Lan!"', explanation: 'Cùng kết quả với bản function cũ.' },
      ],
      goiY: [
        'function tong(a, b) { return a + b; }  ⇔  const tong = (a, b) => a + b;',
        'Nếu dùng ngoặc nhọn { } sau => thì PHẢI có return — không có là hàm trả về undefined.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.3 — function → arrow
function binhPhuong(n) {
  return n * n;
}

function tong(a, b) {
  return a + b;
}

function chaoHoi(ten) {
  return "Chào " + ten + "!";
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.3 — function → arrow
// Một tham số: bỏ được ngoặc. Một biểu thức: bỏ { } và return (trả về ngầm).
const binhPhuong = n => n * n;

// Hai tham số: bắt buộc có ngoặc (a, b)
const tong = (a, b) => a + b;

// Dạng khối { } — được, nhưng khi đó PHẢI viết return
const chaoHoi = (ten) => {
  return ´Chào @{ten}!´;
};
`,
      },
      giaiThich: `<p>Arrow function có hai dạng thân: <strong>biểu thức</strong> (${c('n => n * n')}) — giá trị biểu thức tự được trả về; và <strong>khối</strong> (${c('n => { … }')}) — như hàm thường, phải ${c('return')}. Dạng biểu thức là lý do arrow gọn khi viết callback cho ${c('map')}/${c('filter')} ở Bài 4.4.</p>
<p>Một khác biệt nhỏ: ${c('const f = () => …')} không được "kéo lên" (hoisting) như ${c('function f()')} — gọi trước dòng khai báo sẽ lỗi. Máy chấm gọi ba hàm và soi mã không còn ${c('function')}, có đủ ba ${c('=>')}.</p>`,
      loiHayGap: [
        `Viết ${c('const tong = a, b => a + b')} — thiếu ngoặc, JavaScript hiểu thành hai khai báo.`,
        `Giữ ngoặc nhọn mà bỏ ${c('return')}: ${c('n => { n * n }')} trả về ${c('undefined')}.`,
        `Gọi hàm trước dòng ${c('const')} khai báo nó — ReferenceError.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
      kiem: [
        { moTa: 'binhPhuong(7) = 49', goi: 'binhPhuong(7)', mongDoi: 49 },
        { moTa: 'tong(2, 3) = 5', goi: 'tong(2, 3)', mongDoi: 5 },
        { moTa: 'chaoHoi("Lan") = "Chào Lan!"', goi: 'chaoHoi("Lan")', mongDoi: 'Chào Lan!' },
        { moTa: 'Không còn từ khoá function', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bfunction\\b', phuDinh: true },
        { moTa: 'binhPhuong viết dạng trả về ngầm', kiem: 'ma-nguon', tep: 'main.js', khop: 'binhPhuong\\s*=\\s*\\(?\\s*n\\s*\\)?\\s*=>\\s*n\\s*\\*\\s*n' },
        { moTa: 'tong viết dạng trả về ngầm', kiem: 'ma-nguon', tep: 'main.js', khop: 'tong\\s*=\\s*\\(\\s*a\\s*,\\s*b\\s*\\)\\s*=>\\s*a\\s*\\+\\s*b' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Bẫy arrow có ngoặc nhọn: hàm trả về undefined',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['arrow function', 'return', 'trả về object literal', '({ … })'],
      tienQuyet: ['arrow function'],
      the: ['javascript', 'arrow-function', 'pitfall'],
      moTa: `<p>Bài 4.3, mục <em>"Bẫy — một arrow function có dấu ngoặc nhọn thì trả về undefined"</em>. Cả ba hàm dưới đây "trông đúng" nhưng đều trả về ${c('undefined')} — không có lỗi đỏ nào, chỉ có ${c('NaN')} hiện ra ba hàm sau đó. Sửa cả ba.</p>`,
      yeuCau: [
        `${c('nhanDoi(5)')} → ${c('10')}.`,
        `${c('taoNguoiDung("Lan")')} → object ${c('{ ten: "Lan", vaiTro: "thanh-vien" }')} — lưu ý cách trả về object literal từ arrow.`,
        `${c('tinhVAT(100000)')} → ${c('10000')} (10%), giữ thân hàm nhiều dòng và thêm ${c('return')}.`,
      ],
      dauVao: 'number / string như ví dụ.',
      dauRa: 'number / object.',
      rangBuoc: ['Giữ dạng arrow function cho cả ba.'],
      viDu: [
        { input: 'nhanDoi(5)', output: '10', explanation: 'n => n * 2 (không ngoặc nhọn) hoặc n => { return n * 2; }.' },
        { input: 'taoNguoiDung("Lan")', output: '{ ten: "Lan", vaiTro: "thanh-vien" }', explanation: 'Bọc object trong ngoặc tròn: (ten) => ({ ... }).' },
        { input: '(code khởi đầu) nhanDoi(5) + 1', output: 'NaN', explanation: 'undefined + 1 là NaN — lỗi hiện ra ở chỗ khác chỗ sai.' },
      ],
      goiY: [
        'Sau => mà gặp { thì JavaScript hiểu là THÂN HÀM, không phải object. { ten: ten } bên trong thân hàm là một "nhãn" lạ, không phải object.',
        'const taoNguoiDung = (ten) => ({ ten: ten, vaiTro: "thanh-vien" });  — ngoặc tròn bao ngoài biến nó thành biểu thức.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.3 — Bẫy arrow có ngoặc nhọn
const nhanDoi = n => { n * 2 };

const taoNguoiDung = (ten) => { ten: ten };

const tinhVAT = (gia) => {
  const THUE = 0.1;
  gia * THUE;
};
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.3 — Bẫy arrow có ngoặc nhọn
// Một biểu thức ⇒ bỏ ngoặc nhọn, giá trị tự được trả về
const nhanDoi = n => n * 2;

// Trả về object literal: bọc trong ( ) để { } không bị hiểu là thân hàm
const taoNguoiDung = (ten) => ({ ten: ten, vaiTro: "thanh-vien" });

// Thân nhiều dòng thì giữ { } — và PHẢI có return
const tinhVAT = (gia) => {
  const THUE = 0.1;
  return gia * THUE;
};
`,
      },
      giaiThich: `<p>Dấu ${c('{')} ngay sau ${c('=>')} luôn mở <em>thân hàm</em>. Thân hàm không có ${c('return')} thì hàm trả về ${c('undefined')} — hợp lệ hoàn toàn, nên chẳng có lỗi nào báo. ${c('{ ten: ten }')} trong thân hàm còn tệ hơn: ${c('ten:')} là một <em>nhãn</em> (label), và ${c('ten')} là một câu lệnh không làm gì.</p>
<p>Muốn trả về object bằng dạng ngắn, bọc nó trong ngoặc tròn: ${c('() => ({ … })')}. Máy chấm gọi cả ba hàm, và có một kiểm ẩn gọi ${c('taoNguoiDung')} với tên khác để chắc bạn không viết cứng "Lan".</p>`,
      loiHayGap: [
        `Sửa ${c('taoNguoiDung')} thành ${c('(ten) => { ten: ten, vaiTro: "…" }')} — giờ thì thành LỖI CÚ PHÁP (nhãn không có dấu phẩy).`,
        `Trả về ${c('{ name: …, role: … }')} — sai tên khoá đề yêu cầu.`,
        `Làm tròn VAT — ${c('100000 * 0.1')} đã đúng ${c('10000')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body',
      kiem: [
        { moTa: 'nhanDoi(5) = 10', goi: 'nhanDoi(5)', mongDoi: 10 },
        { moTa: 'taoNguoiDung("Lan")', goi: 'taoNguoiDung("Lan")', mongDoi: { ten: 'Lan', vaiTro: 'thanh-vien' } },
        { moTa: 'taoNguoiDung với tên khác', goi: 'taoNguoiDung("Minh")', mongDoi: { ten: 'Minh', vaiTro: 'thanh-vien' }, an: true },
        { moTa: 'tinhVAT(100000) = 10000', goi: 'tinhVAT(100000)', mongDoi: 10000 },
        { moTa: 'Không còn NaN ở phía sau', goi: 'nhanDoi(5) + 1', mongDoi: 11 },
        { moTa: 'Cả ba vẫn là arrow function', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bfunction\\b', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Tham số mặc định: khi nào thì giá trị mặc định được dùng?',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['tham số mặc định', 'undefined', 'null', 'đối số thiếu'],
      tienQuyet: ['function', 'template literal'],
      the: ['javascript', 'default-parameters'],
      moTa: `<p>Bài 4.3: <em>"Một tham số không có đối số là undefined, một cách lặng lẽ — giá trị mặc định (= 1) chữa được."</em> Viết ${c('taoLoiChao(ten, loiChao)')} có <strong>tham số mặc định</strong>: ${c('ten = "bạn"')}, ${c('loiChao = "Xin chào"')}. Code khởi đầu tự kiểm bằng ${c('if (!ten)')} — nên ${c('taoLoiChao("")')} lại thành "bạn", và cả ${c('0')} cũng bị nuốt.</p>`,
      yeuCau: [
        `${c('taoLoiChao()')} → ${c('"Xin chào, bạn!"')}; ${c('taoLoiChao("Lan")')} → ${c('"Xin chào, Lan!"')}; ${c('taoLoiChao("Lan", "Hi")')} → ${c('"Hi, Lan!"')}.`,
        `Truyền ${c('undefined')} rõ ràng cũng dùng mặc định: ${c('taoLoiChao(undefined, "Hi")')} → ${c('"Hi, bạn!"')}.`,
        `Mặc định CHỈ áp cho ${c('undefined')}: ${c('taoLoiChao(null)')} → ${c('"Xin chào, null!"')}, ${c('taoLoiChao("")')} → ${c('"Xin chào, !"')}.`,
      ],
      dauVao: 'ten, loiChao: string hoặc vắng.',
      dauRa: 'string "<loiChao>, <ten>!".',
      rangBuoc: ['Dùng cú pháp tham số mặc định trong khai báo hàm, không if.'],
      viDu: [
        { input: 'taoLoiChao()', output: '"Xin chào, bạn!"', explanation: 'Thiếu cả hai đối số ⇒ cả hai mặc định.' },
        { input: 'taoLoiChao(undefined, "Hi")', output: '"Hi, bạn!"', explanation: 'Muốn bỏ qua tham số đầu thì truyền undefined.' },
        { input: 'taoLoiChao(null)', output: '"Xin chào, null!"', explanation: 'null là một giá trị được truyền — mặc định không áp.' },
      ],
      goiY: [
        'function taoLoiChao(ten = "bạn", loiChao = "Xin chào") { … } — giá trị sau dấu = chỉ dùng khi đối số là undefined.',
        'Thân hàm chỉ còn một dòng: return ´@{loiChao}, @{ten}!´;',
      ],
      khoiDau: {
        'main.js': `// Bài 4.3 — Tham số mặc định
function taoLoiChao(ten, loiChao) {
  if (!ten) {
    ten = "bạn";
  }
  return ´@{loiChao}, @{ten}!´;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.3 — Tham số mặc định
// Giá trị sau dấu = chỉ được dùng khi đối số là undefined (thiếu, hoặc truyền undefined).
// null, "" hay 0 là giá trị THẬT được truyền vào ⇒ giữ nguyên.
function taoLoiChao(ten = "bạn", loiChao = "Xin chào") {
  return ´@{loiChao}, @{ten}!´;
}
`,
      },
      giaiThich: `<p>Tham số mặc định đặt "ý định" ngay ở chữ ký hàm: đọc dòng đầu là biết hàm chịu được thiếu đối số nào. Luật của nó trùng với ${c('??')} một nửa: chỉ ${c('undefined')} kích hoạt mặc định (${c('null')} thì không — khác ${c('??')}).</p>
<p>${c('if (!ten)')} là kiểu kiểm "falsy" — nó gộp chung chuỗi rỗng, 0, null với "không truyền". Máy chấm thử 6 cách gọi, gồm truyền ${c('undefined')}, ${c('null')}, ${c('""')} và số 0.</p>`,
      loiHayGap: [
        `Đặt tham số mặc định ở GIỮA danh sách rồi gọi thiếu đối số — muốn bỏ qua tham số đầu thì phải truyền ${c('undefined')}.`,
        `Giữ thêm ${c('if (!ten)')} — "" lại thành "bạn".`,
        `Tưởng ${c('null')} cũng kích hoạt mặc định.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters',
      kiem: [
        { moTa: 'taoLoiChao() dùng cả hai mặc định', goi: 'taoLoiChao()', mongDoi: 'Xin chào, bạn!' },
        { moTa: 'taoLoiChao("Lan")', goi: 'taoLoiChao("Lan")', mongDoi: 'Xin chào, Lan!' },
        { moTa: 'taoLoiChao("Lan", "Hi")', goi: 'taoLoiChao("Lan", "Hi")', mongDoi: 'Hi, Lan!' },
        { moTa: 'undefined rõ ràng dùng mặc định', goi: 'taoLoiChao(undefined, "Hi")', mongDoi: 'Hi, bạn!' },
        { moTa: 'null và "" giữ nguyên', goi: '[taoLoiChao(null), taoLoiChao("")]', mongDoi: ['Xin chào, null!', 'Xin chào, !'] },
        { moTa: 'Số 0 giữ nguyên', goi: 'taoLoiChao(0)', mongDoi: 'Xin chào, 0!', an: true },
        { moTa: 'Khai báo tham số mặc định', kiem: 'ma-nguon', tep: 'main.js', khop: 'ten\\s*=\\s*["\']bạn["\'][\\s\\S]*loiChao\\s*=\\s*["\']Xin chào["\']' },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Phạm vi: hai bộ đếm dùng chung một biến toàn cục',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['scope', 'biến cục bộ', 'hàm trả về hàm', 'closure'],
      tienQuyet: ['arrow function', 'let'],
      the: ['javascript', 'scope', 'closure'],
      moTa: `<p>Bài 4.3, mục <em>"Phạm vi — nơi một biến nhìn thấy được"</em>. ${c('taoBoDem()')} phải trả về một <strong>hàm đếm</strong>: mỗi lần gọi hàm đó, nó tăng và trả về số đếm của riêng nó. Code khởi đầu để biến ${c('dem')} ở phạm vi toàn cục, nên hai bộ đếm (vd đếm lượt thích và đếm lượt xem) giẫm lên nhau.</p>`,
      yeuCau: [
        `${c('const a = taoBoDem(); a(); a();')} ⇒ ${c('a()')} lần thứ ba trả về ${c('3')}.`,
        `Hai bộ đếm độc lập: sau ba lần ${c('a()')}, lần đầu ${c('b()')} vẫn trả về ${c('1')}.`,
        `${c('taoBoDem(10)')} bắt đầu từ 10 (lần gọi đầu trả về 11) — tham số ${c('batDau')} mặc định 0.`,
        `Không còn biến đếm nào ở phạm vi toàn cục.`,
      ],
      dauVao: 'batDau: number (tuỳ chọn, mặc định 0).',
      dauRa: 'Một hàm; mỗi lần gọi trả về số đếm tăng 1.',
      rangBuoc: ['Không dùng class (chưa học).'],
      viDu: [
        { input: 'const a = taoBoDem();\na(); a();\na()', output: '3', explanation: 'Mỗi lần gọi a() tăng biến đếm của a.' },
        { input: 'const a = taoBoDem(); const b = taoBoDem();\na(); a(); a();\nb()', output: '1', explanation: 'b có biến đếm riêng — đây là thứ code khởi đầu làm sai (nó ra 4).' },
      ],
      goiY: [
        'Đưa let dem vào TRONG taoBoDem. Mỗi lần gọi taoBoDem tạo ra một biến dem mới, riêng.',
        'function taoBoDem(batDau = 0) { let dem = batDau; return () => { dem = dem + 1; return dem; }; } — hàm bên trong vẫn "nhìn thấy" dem của lần gọi đã tạo ra nó.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.3 — Phạm vi
let dem = 0;   // ⚠ toàn cục: mọi bộ đếm dùng chung

function taoBoDem(batDau) {
  return () => {
    dem = dem + 1;
    return dem;
  };
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.3 — Phạm vi
function taoBoDem(batDau = 0) {
  // dem là biến CỤC BỘ: mỗi lần gọi taoBoDem() sinh ra một biến dem mới
  let dem = batDau;

  // Hàm trả về vẫn nhìn thấy đúng biến dem của lần gọi đã tạo ra nó
  // (gọi là closure) — người ngoài không đọc/sửa được dem trực tiếp.
  return () => {
    dem = dem + 1;
    return dem;
  };
}
`,
      },
      giaiThich: `<p>Biến khai báo trong một hàm chỉ sống trong phạm vi hàm đó — và mỗi <em>lần gọi</em> hàm có bộ biến riêng. Hàm con được tạo bên trong vẫn giữ tham chiếu tới biến của lần gọi ấy, kể cả sau khi ${c('taoBoDem')} đã chạy xong. Đó là <strong>closure</strong>: cách JavaScript cho mỗi bộ đếm một "ngăn kéo" riêng mà không cần class.</p>
<p>Biến toàn cục thì ngược lại: một ngăn kéo cho cả chương trình, ai cũng mở được. Máy chấm tạo nhiều bộ đếm trong cùng một lần chạy để bắt đúng lỗi "giẫm chân", và soi mã không còn ${c('let dem')} ở cấp ngoài cùng.</p>`,
      loiHayGap: [
        `Đặt ${c('let dem = 0')} BÊN TRONG hàm trả về — mỗi lần gọi ${c('a()')} lại về 0, luôn trả 1.`,
        `Quên ${c('return')} hàm con — ${c('taoBoDem()')} trả về undefined, gọi ${c('a()')} ném TypeError "a is not a function".`,
        `Bỏ qua ${c('batDau')} — ${c('taoBoDem(10)')} vẫn bắt đầu từ 0.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
      kiem: [
        { moTa: 'Gọi ba lần ra 3', chuanBi: 'const a = taoBoDem(); a(); a();', goi: 'a()', mongDoi: 3 },
        { moTa: 'Hai bộ đếm độc lập', chuanBi: 'const a = taoBoDem(); const b = taoBoDem(); a(); a(); a();', goi: 'b()', mongDoi: 1 },
        { moTa: 'taoBoDem(10) bắt đầu từ 10', chuanBi: 'const c = taoBoDem(10);', goi: '[c(), c()]', mongDoi: [11, 12] },
        { moTa: 'Xen kẽ hai bộ đếm', chuanBi: 'const a = taoBoDem(); const b = taoBoDem(5);', goi: '[a(), b(), a(), b(), a()]', mongDoi: [1, 6, 2, 7, 3], an: true },
        { moTa: 'Không còn biến dem toàn cục', kiem: 'ma-nguon', tep: 'main.js', khop: '^(let|var|const)\\s+dem\\b', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Mệnh đề chốt chặn thay cho if lồng bốn tầng',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['guard clause', 'return sớm', 'typeof', '.length', '.includes()'],
      tienQuyet: ['if / else', 'return'],
      the: ['javascript', 'guard-clause', 'refactoring'],
      moTa: `<p>Bài 4.3: <em>"Trả về sớm — xử các ca xấu ngay đầu rồi trả về; nhánh thuận lợi ở lại phẳng."</em> ${c('kiemTraMatKhau(matKhau, tenDangNhap)')} trả về thông báo lỗi ĐẦU TIÊN gặp phải, hoặc ${c('"OK"')}. Bản cũ lồng ${c('if')} bốn tầng, và trong lúc lồng đã đặt nhầm thứ tự hai luật. Viết lại bằng các chốt chặn phẳng, theo đúng thứ tự:</p>
<ol><li>Không phải chuỗi hoặc chuỗi rỗng → ${c('"Thiếu mật khẩu"')}</li>
<li>Ngắn hơn 8 ký tự → ${c('"Mật khẩu quá ngắn"')}</li>
<li>Trùng tên đăng nhập → ${c('"Không được trùng tên đăng nhập"')}</li>
<li>Không chứa chữ số nào → ${c('"Cần ít nhất một chữ số"')}</li></ol>`,
      yeuCau: [
        'Trả về đúng thông báo của luật ĐẦU TIÊN bị vi phạm, theo thứ tự 1 → 4; không vi phạm gì → "OK".',
        `Viết bằng các ${c('if (…) return …;')} liên tiếp, không có ${c('else')}, không lồng ${c('if')} trong ${c('if')}.`,
        `Kiểm "có chữ số" bằng vòng lặp qua từng ký tự và ${c('"0123456789".includes(kyTu)')}.`,
      ],
      dauVao: 'matKhau: giá trị bất kỳ; tenDangNhap: string.',
      dauRa: 'string — một trong 5 thông báo.',
      rangBuoc: ['Không dùng regex (chưa học).', 'Không dùng else.'],
      viDu: [
        { input: 'kiemTraMatKhau("", "lan")', output: '"Thiếu mật khẩu"', explanation: 'Luật 1.' },
        { input: 'kiemTraMatKhau("lan12345", "lan12345")', output: '"Không được trùng tên đăng nhập"', explanation: 'Đủ 8 ký tự nên qua luật 2, vấp luật 3.' },
        { input: 'kiemTraMatKhau("matkhaudai", "lan")', output: '"Cần ít nhất một chữ số"', explanation: 'Luật 4.' },
        { input: 'kiemTraMatKhau("hoa-sen-2026", "lan")', output: '"OK"', explanation: 'Qua cả bốn luật.' },
      ],
      goiY: [
        'Mỗi luật một dòng: if (điều kiện xấu) return "thông báo"; — tới được dòng cuối nghĩa là mọi luật đều qua: return "OK";',
        'Luật 4: let coSo = false; for (const kyTu of matKhau) { if ("0123456789".includes(kyTu)) coSo = true; } if (!coSo) return "Cần ít nhất một chữ số";',
      ],
      khoiDau: {
        'main.js': `// Bài 4.3 — Chốt chặn
function kiemTraMatKhau(matKhau, tenDangNhap) {
  if (typeof matKhau === "string" && matKhau !== "") {
    if (matKhau !== tenDangNhap) {
      if (matKhau.length >= 8) {
        return "OK";
      } else {
        return "Mật khẩu quá ngắn";
      }
    } else {
      return "Không được trùng tên đăng nhập";
    }
  } else {
    return "Thiếu mật khẩu";
  }
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.3 — Chốt chặn
function kiemTraMatKhau(matKhau, tenDangNhap) {
  // Mỗi ca xấu: kiểm rồi trả về ngay. Thứ tự dòng = thứ tự ưu tiên của luật.
  if (typeof matKhau !== "string" || matKhau === "") return "Thiếu mật khẩu";
  if (matKhau.length < 8) return "Mật khẩu quá ngắn";
  if (matKhau === tenDangNhap) return "Không được trùng tên đăng nhập";

  // Luật 4: đi qua từng ký tự, tìm một chữ số
  let coChuSo = false;
  for (const kyTu of matKhau) {
    if ("0123456789".includes(kyTu)) {
      coChuSo = true;
    }
  }
  if (!coChuSo) return "Cần ít nhất một chữ số";

  // Tới được đây nghĩa là mọi luật đều đã qua — nhánh thuận lợi nằm phẳng ở cuối
  return "OK";
}
`,
      },
      giaiThich: `<p>Code lồng nhau giấu thứ tự luật trong độ thụt lề: muốn biết luật nào xét trước phải dò ngoặc. Bản cũ vì thế kiểm "trùng tên" trước "quá ngắn" mà không ai để ý — ${c('kiemTraMatKhau("lan", "lan")')} báo trùng tên thay vì quá ngắn. Với chốt chặn, thứ tự dòng chính là thứ tự luật, và thêm luật 4 chỉ là thêm vài dòng chứ không phải thêm một tầng.</p>
<p>Máy chấm thử 9 cách gọi phủ đủ năm kết quả, gồm ca ${c('("lan", "lan")')} bắt đúng lỗi thứ tự, ${c('null')}, số, và soi mã không còn ${c('else')}.</p>`,
      loiHayGap: [
        `Kiểm ${c('if (!matKhau)')} rồi gọi ${c('matKhau.length')} khi matKhau là số — số không có length (undefined < 8 là false!).`,
        `Đặt luật "trùng tên" trước "quá ngắn" như bản cũ.`,
        `Đặt ${c('return "Cần ít nhất một chữ số"')} TRONG vòng lặp — trả về ngay ở ký tự đầu không phải số.`,
      ],
      thamKhao: 'https://refactoring.guru/replace-nested-conditional-with-guard-clauses',
      kiem: [
        { moTa: 'Chuỗi rỗng → Thiếu mật khẩu', goi: 'kiemTraMatKhau("", "lan")', mongDoi: 'Thiếu mật khẩu' },
        { moTa: 'Không phải chuỗi → Thiếu mật khẩu', goi: '[kiemTraMatKhau(null, "lan"), kiemTraMatKhau(12345678, "lan")]', mongDoi: ['Thiếu mật khẩu', 'Thiếu mật khẩu'] },
        { moTa: '"abc" → Mật khẩu quá ngắn', goi: 'kiemTraMatKhau("abc", "lan")', mongDoi: 'Mật khẩu quá ngắn' },
        { moTa: 'Ngắn VÀ trùng tên → báo quá ngắn (luật 2 trước luật 3)', goi: 'kiemTraMatKhau("lan", "lan")', mongDoi: 'Mật khẩu quá ngắn' },
        { moTa: 'Trùng tên đăng nhập', goi: 'kiemTraMatKhau("lan12345", "lan12345")', mongDoi: 'Không được trùng tên đăng nhập' },
        { moTa: 'Thiếu chữ số', goi: 'kiemTraMatKhau("matkhaudai", "lan")', mongDoi: 'Cần ít nhất một chữ số' },
        { moTa: 'Hợp lệ → OK', goi: '[kiemTraMatKhau("hoa-sen-2026", "lan"), kiemTraMatKhau("9abcdefg", "lan")]', mongDoi: ['OK', 'OK'] },
        { moTa: 'Không dùng else', kiem: 'ma-nguon', tep: 'main.js', khop: '\\belse\\b', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Hàm làm đối số: áp một phép biến đổi n lần',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['hàm là giá trị', 'callback', 'arrow function', 'vòng lặp'],
      tienQuyet: ['arrow function', 'vòng lặp for'],
      the: ['javascript', 'callback', 'higher-order-function'],
      moTa: `<p>Bài 4.3 nói arrow function là "mặc định cho callback". Callback là một hàm bạn <strong>truyền vào</strong> hàm khác như một đối số — ${c('map')}, ${c('setTimeout')} và ${c('addEventListener')} đều nhận callback. Tự viết hai hàm nhận callback để hiểu cơ chế:</p>
<ul><li>${c('apDungNLan(f, n, x)')}: áp ${c('f')} lên ${c('x')} ${c('n')} lần: ${c('f(f(f(x)))')} khi n = 3.</li>
<li>${c('demThoa(tu, den, dieuKien)')}: đếm các số nguyên trong ${c('[tu, den]')} mà ${c('dieuKien(so)')} trả về truthy.</li></ul>`,
      yeuCau: [
        `${c('apDungNLan(x => x * 2, 3, 1)')} → ${c('8')}; ${c('n = 0')} trả về ${c('x')} nguyên vẹn.`,
        `${c('demThoa(1, 10, n => n % 3 === 0)')} → ${c('3')}; ${c('tu > den')} → ${c('0')}.`,
        `Gọi ${c('f')} / ${c('dieuKien')} như một hàm bình thường — không viết cứng phép nhân 2 hay phép chia 3.`,
        `Nếu ${c('f')} không phải hàm, ${c('apDungNLan')} ném ${c('TypeError')} với thông điệp ${c('"f phải là hàm"')}.`,
      ],
      dauVao: 'f, dieuKien: function; n: số nguyên >= 0; x: bất kỳ; tu, den: số nguyên.',
      dauRa: 'apDungNLan → giá trị sau n lần biến đổi; demThoa → number.',
      rangBuoc: ['Không dùng đệ quy bắt buộc — vòng lặp là đủ.', 'Không dùng mảng.'],
      viDu: [
        { input: 'apDungNLan(x => x * 2, 3, 1)', output: '8', explanation: '1 → 2 → 4 → 8.' },
        { input: 'apDungNLan(s => s + "!", 2, "Chào")', output: '"Chào!!"', explanation: 'Callback làm gì cũng được — apDungNLan chỉ lo việc "gọi n lần".' },
        { input: 'demThoa(1, 10, n => n % 3 === 0)', output: '3', explanation: '3, 6, 9.' },
      ],
      goiY: [
        'let ketQua = x; for (let i = 0; i < n; i++) { ketQua = f(ketQua); } return ketQua;',
        'Ném lỗi: if (typeof f !== "function") throw new TypeError("f phải là hàm"); — đặt ở đầu hàm (chốt chặn).',
      ],
      khoiDau: {
        'main.js': `// Bài 4.3 — Hàm làm đối số
function apDungNLan(f, n, x) {
  // áp f lên x đúng n lần
  return x * 2 * n;
}

function demThoa(tu, den, dieuKien) {
  let dem = 0;
  // đếm các số trong [tu, den] mà dieuKien(so) đúng
  return dem;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.3 — Hàm làm đối số
function apDungNLan(f, n, x) {
  // Chốt chặn: f phải gọi được
  if (typeof f !== "function") throw new TypeError("f phải là hàm");

  let ketQua = x;
  for (let i = 0; i < n; i++) {
    ketQua = f(ketQua);          // f là một giá trị kiểu hàm — gọi nó như mọi hàm khác
  }
  return ketQua;                 // n = 0 ⇒ vòng lặp không chạy ⇒ trả về x
}

function demThoa(tu, den, dieuKien) {
  let dem = 0;
  for (let so = tu; so <= den; so++) {
    if (dieuKien(so)) {          // người gọi quyết định "thoả" nghĩa là gì
      dem++;
    }
  }
  return dem;
}
`,
      },
      giaiThich: `<p>Trong JavaScript hàm là một giá trị như số hay chuỗi: gán được vào biến, truyền được làm đối số, trả về được từ hàm khác (bài bộ đếm). ${c('apDungNLan')} không biết và không cần biết ${c('f')} làm gì — nó chỉ lo "gọi n lần". Tách "khung việc" khỏi "chi tiết việc" như vậy chính là cách ${c('map')}/${c('filter')} ở Bài 4.4 hoạt động.</p>
<p>Máy chấm truyền callback số, callback chuỗi, ${c('n = 0')}, khoảng rỗng, và gọi với ${c('f = 5')} để chắc bạn ném đúng ${c('TypeError')}.</p>`,
      loiHayGap: [
        `Viết ${c('f(x)')} trong vòng lặp mà không gán lại — lần nào cũng áp lên x gốc, ra f(x) thay vì f(f(f(x))).`,
        `Truyền ${c('dieuKien')} rồi so ${c('dieuKien(so) === true')} — callback trả về số khác 0 (truthy) sẽ bị bỏ qua.`,
        `Gọi ${c('f()')} không đối số.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Callback_function',
      kiem: [
        { moTa: 'apDungNLan(x => x * 2, 3, 1) = 8', goi: 'apDungNLan(x => x * 2, 3, 1)', mongDoi: 8 },
        { moTa: 'Callback chuỗi', goi: 'apDungNLan(s => s + "!", 2, "Chào")', mongDoi: 'Chào!!' },
        { moTa: 'n = 0 trả về x', goi: 'apDungNLan(x => x + 1, 0, 42)', mongDoi: 42 },
        { moTa: 'f không phải hàm → TypeError', goi: 'apDungNLan(5, 1, 1)', mongDoi: { loi: 'TypeError', thongDiep: 'f phải là hàm' } },
        { moTa: 'demThoa(1, 10, chia hết cho 3) = 3', goi: 'demThoa(1, 10, n => n % 3 === 0)', mongDoi: 3 },
        { moTa: 'Khoảng rỗng → 0', goi: 'demThoa(5, 1, n => true)', mongDoi: 0 },
        { moTa: 'Callback trả về truthy (không phải true)', goi: 'demThoa(1, 6, n => n % 2)', mongDoi: 3, an: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Nhà máy định dạng tiền: hàm trả về hàm',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['hàm trả về hàm', 'closure', 'tham số mặc định', 'chốt chặn', 'duyệt chuỗi từ cuối'],
      tienQuyet: ['closure', 'tham số mặc định', 'vòng lặp'],
      the: ['javascript', 'closure', 'string', 'real-world'],
      moTa: `<p>Bài tổng hợp 4.3. Trang bán hàng cần định dạng tiền theo nhiều kiểu: ${c('1.250.000đ')} cho tiếng Việt, ${c('$1,250,000')} cho bản tiếng Anh. Thay vì một hàm với năm tham số gọi đi gọi lại, viết một <strong>nhà máy</strong>: ${c('taoDinhDang(tuyChon)')} nhận cấu hình MỘT lần và trả về một hàm ${c('dinhDang(so)')} dùng mãi.</p>
<p>Cấu hình (mọi trường đều tuỳ chọn): ${c('kyHieu = "đ"')}, ${c('viTri = "sau"')} (hoặc ${c('"truoc"')}), ${c('phanCach = "."')}. Tự cài phần chia nhóm ba chữ số bằng vòng lặp — không dùng ${c('toLocaleString')} / ${c('Intl')}.</p>`,
      yeuCau: [
        `${c('taoDinhDang()(1250000)')} → ${c('"1.250.000đ"')}; ${c('taoDinhDang({ kyHieu: "$", viTri: "truoc", phanCach: "," })(1250000)')} → ${c('"$1,250,000"')}.`,
        `Số âm giữ dấu trừ ở đầu: ${c('-1500')} → ${c('"-1.500đ"')} (và ${c('"-$1,500"')} khi ký hiệu đứng trước).`,
        `Số có phần lẻ được làm tròn tới đơn vị (${c('Math.round')}) trước khi định dạng; ${c('0')} → ${c('"0đ"')}.`,
        `Đầu vào không phải số hữu hạn (chuỗi, NaN, Infinity, undefined) → ${c('"—"')} (gạch dài).`,
        `${c('taoDinhDang')} được gọi không có đối số vẫn chạy (tham số mặc định cho cả object).`,
      ],
      dauVao: 'tuyChon: { kyHieu?, viTri?, phanCach? } hoặc vắng; so: giá trị bất kỳ.',
      dauRa: 'taoDinhDang → function; dinhDang → string.',
      rangBuoc: ['Không dùng toLocaleString, Intl, regex.', 'Mỗi lần gọi taoDinhDang tạo một bộ định dạng độc lập.'],
      viDu: [
        { input: 'const vnd = taoDinhDang();\nvnd(1250000)', output: '"1.250.000đ"', explanation: 'Mặc định: ký hiệu đ đứng sau, phân cách dấu chấm.' },
        { input: 'const usd = taoDinhDang({ kyHieu: "$", viTri: "truoc", phanCach: "," });\nusd(-1500.6)', output: '"-$1,501"', explanation: 'Làm tròn −1500.6 thành −1501, dấu trừ đứng trước ký hiệu.' },
        { input: 'vnd("abc")', output: '"—"', explanation: 'Không phải số ⇒ gạch dài, không ném lỗi.' },
      ],
      goiY: [
        'Chia nhóm: chuyển phần trị tuyệt đối thành chuỗi, đi từ ký tự CUỐI về đầu, cứ đủ 3 chữ số (và còn chữ số phía trước) thì chèn phanCach.',
        'function taoDinhDang({ kyHieu = "đ", viTri = "sau", phanCach = "." } = {}) { return (so) => { … }; } — "= {}" ở cuối cho phép gọi taoDinhDang() không đối số.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.3 — Nhà máy định dạng tiền
function taoDinhDang(tuyChon) {
  return (so) => {
    return so + tuyChon.kyHieu;
  };
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.3 — Nhà máy định dạng tiền

// Chèn dấu phân cách mỗi 3 chữ số, đi từ phải sang trái: "1250000" → "1.250.000"
function chiaNhom(chuSo, phanCach) {
  let ketQua = "";
  let dem = 0;
  for (let i = chuSo.length - 1; i >= 0; i--) {
    ketQua = chuSo[i] + ketQua;
    dem++;
    if (dem % 3 === 0 && i > 0) {   // đủ 3 chữ số VÀ còn chữ số phía trước
      ketQua = phanCach + ketQua;
    }
  }
  return ketQua;
}

// Destructuring + mặc định từng trường; "= {}" cho phép gọi taoDinhDang() trống
function taoDinhDang({ kyHieu = "đ", viTri = "sau", phanCach = "." } = {}) {
  // Hàm trả về "nhớ" kyHieu/viTri/phanCach của lần cấu hình này (closure)
  return (so) => {
    if (typeof so !== "number" || !Number.isFinite(so)) return "—";   // chốt chặn

    const tron = Math.round(so);
    const dau = tron < 0 ? "-" : "";
    const nhom = chiaNhom(String(Math.abs(tron)), phanCach);

    return viTri === "truoc"
      ? ´@{dau}@{kyHieu}@{nhom}´
      : ´@{dau}@{nhom}@{kyHieu}´;
  };
}
`,
      },
      giaiThich: `<p>Nhà máy hàm tách hai thời điểm: <em>cấu hình</em> (một lần, lúc khởi động trang) và <em>dùng</em> (hàng trăm lần, mỗi giá sản phẩm). Hàm trả về giữ cấu hình qua closure — đúng cơ chế bộ đếm, chỉ là thứ được nhớ là ba tuỳ chọn thay vì một con số.</p>
<p>Phần chia nhóm đi từ phải sang vì nhóm ba chữ số tính từ hàng đơn vị; điều kiện ${c('i > 0')} tránh dấu phân cách thừa ở đầu (${c('".250.000"')}). Dấu trừ xử lý riêng — chia nhóm trên trị tuyệt đối, ghép dấu lại sau — để không ra ${c('"-.150"')}. Máy chấm thử 12 trường hợp, gồm 3 chữ số tròn (${c('100')}, ${c('999')}), ${c('1000')}, số âm, số lẻ, hai bộ định dạng độc lập trong cùng một lần chạy.</p>`,
      loiHayGap: [
        `Đặt mặc định ${c('function taoDinhDang({ kyHieu = "đ" })')} mà thiếu ${c('= {}')} — gọi ${c('taoDinhDang()')} ném TypeError (không destructure được undefined).`,
        `Chèn phân cách ở đầu với số có số chữ số chia hết cho 3 — ${c('".100đ"')}.`,
        `Chia nhóm trên ${c('String(-1500)')} — dấu trừ bị đếm như một chữ số.`,
        `Dùng ${c('if (!so)')} để chặn đầu vào — chặn luôn số 0 hợp lệ.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value',
      kiem: [
        { moTa: 'Mặc định: 1250000 → "1.250.000đ"', goi: 'taoDinhDang()(1250000)', mongDoi: '1.250.000đ' },
        { moTa: 'Kiểu USD: "$1,250,000"', goi: 'taoDinhDang({ kyHieu: "$", viTri: "truoc", phanCach: "," })(1250000)', mongDoi: '$1,250,000' },
        { moTa: 'Biên nhóm: 0, 100, 999, 1000', chuanBi: 'const f = taoDinhDang();', goi: '[f(0), f(100), f(999), f(1000)]', mongDoi: ['0đ', '100đ', '999đ', '1.000đ'] },
        { moTa: 'Số âm: "-1.500đ" và "-$1,501"', goi: '[taoDinhDang()(-1500), taoDinhDang({ kyHieu: "$", viTri: "truoc", phanCach: "," })(-1500.6)]', mongDoi: ['-1.500đ', '-$1,501'] },
        { moTa: 'Làm tròn: 999.5 → "1.000đ"', goi: 'taoDinhDang()(999.5)', mongDoi: '1.000đ' },
        { moTa: 'Đầu vào sai → "—"', chuanBi: 'const f = taoDinhDang();', goi: '[f("abc"), f(NaN), f(Infinity), f(undefined), f("1000")]', mongDoi: ['—', '—', '—', '—', '—'] },
        { moTa: 'Chỉ đổi một trường, hai trường kia giữ mặc định', goi: 'taoDinhDang({ kyHieu: " VND" })(25000)', mongDoi: '25.000 VND' },
        { moTa: 'Hai bộ định dạng độc lập', chuanBi: 'const a = taoDinhDang(); const b = taoDinhDang({ phanCach: " " });', goi: '[a(1234567), b(1234567), a(1234567)]', mongDoi: ['1.234.567đ', '1 234 567đ', '1.234.567đ'], an: true },
        { moTa: 'Không dùng toLocaleString / Intl', kiem: 'ma-nguon', tep: 'main.js', khop: 'toLocaleString|\\bIntl\\b', phuDinh: true },
      ],
    },
  ],
});
