/** Bộ luyện bài 4.1 — Biến và kiểu dữ liệu. Lược đồ: ./_luoc-do.mjs (loại 'js'). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const KHUNG_HAM = '<p><em>Khung hàm đã viết sẵn — hàm sẽ học kỹ ở Bài 4.3. Ở đây bạn chỉ sửa/viết phần THÂN hàm và dòng ' + '<code>return</code>.</em></p>';

export default doiDau({
  slug: 'wf-4-1-variables-types',
  ten: '4.1 Biến và kiểu dữ liệu',
  baiHoc: 'Nền tảng Web — Bài 4.1 Biến và kiểu dữ liệu',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'const/let (và vì sao bỏ var), string/number/boolean/null/undefined, typeof, template literal, bẫy dấu + nối chuỗi, == với === — 7 bài từ dễ đến khó, chấm bằng cách gọi hàm.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Lời chào bằng template literal',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['template literal', 'nhúng biến bằng @{ }', 'string'],
      tienQuyet: [],
      the: ['javascript', 'string', 'template-literal'],
      moTa: `<p>Bài 4.1: <em>"Template literal: dấu huyền cho phép nhúng giá trị bằng ${c('@{ }')}."</em> Trang hồ sơ cần một câu chào ghép từ tên và tuổi. Người viết trước nối chuỗi bằng ${c('+')} và quên dấu cách, nên ra ${c('"Xin chào, tôi làLan,25 tuổi."')}. Viết lại hàm ${c('loiChao(ten, tuoi)')} bằng template literal.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('loiChao(ten, tuoi)')} trả về đúng chuỗi ${c('Xin chào, tôi là <ten>, <tuoi> tuổi.')} — có dấu cách sau dấu phẩy, có dấu chấm cuối.`,
        `Dùng template literal (dấu huyền ${c('´')} và ${c('@{ }')}), không nối bằng ${c('+')}.`,
        'Chạy đúng với mọi tên/tuổi, không viết cứng "Lan".',
      ],
      dauVao: 'ten: string (vd "Lan"), tuoi: number (vd 25).',
      dauRa: 'Một string: "Xin chào, tôi là Lan, 25 tuổi."',
      rangBuoc: ['Không dùng toán tử + để ghép chuỗi.', 'Giữ nguyên tên hàm loiChao.'],
      viDu: [
        { input: 'loiChao("Lan", 25)', output: '"Xin chào, tôi là Lan, 25 tuổi."', explanation: 'Hai giá trị được nhúng vào đúng chỗ bằng @{ten} và @{tuoi}.' },
        { input: 'loiChao("Minh Anh", 19)', output: '"Xin chào, tôi là Minh Anh, 19 tuổi."', explanation: 'Tên có dấu cách vẫn nằm nguyên trong chuỗi — template literal không cần nối thêm khoảng trắng.' },
      ],
      goiY: [
        'Template literal bắt đầu và kết thúc bằng dấu huyền ´ (phím cạnh số 1), không phải dấu nháy đơn.',
        'return ´Xin chào, tôi là @{ten}, @{tuoi} tuổi.´; — chép đúng dấu phẩy, dấu cách và dấu chấm.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.1 — Lời chào bằng template literal
function loiChao(ten, tuoi) {
  // Bản cũ: nối bằng + và quên dấu cách — sửa lại bằng template literal
  return "Xin chào, tôi là" + ten + "," + tuoi + " tuổi.";
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.1 — Lời chào bằng template literal
function loiChao(ten, tuoi) {
  // Dấu huyền mở template literal; @{...} nhúng giá trị của biến vào đúng chỗ.
  // Khoảng trắng và dấu câu viết thẳng như câu bình thường — không phải nhớ " " + ...
  return ´Xin chào, tôi là @{ten}, @{tuoi} tuổi.´;
}
`,
      },
      giaiThich: `<p>Với ${c('+')}, mỗi khoảng trắng phải là một mảnh ${c('" "')} riêng — quên một mảnh là chữ dính vào nhau. Template literal viết cả câu một lần, chỗ nào cần giá trị thì đặt ${c('@{…}')}: câu trong code trông y hệt câu hiện ra.</p>
<p>Số ${c('25')} được nhúng tự đổi thành chữ ${c('"25"')}. Máy chấm gọi hàm với ba bộ tên/tuổi khác nhau và đọc mã nguồn (đã bỏ chú thích) để chắc bạn không còn dùng ${c('+')} ghép chuỗi.</p>`,
      loiHayGap: [
        `Dùng dấu nháy đơn ${c("'Xin chào, @{ten}'")} — nháy đơn không phải template literal, ra nguyên văn chữ ${c('@{ten}')}.`,
        'Thiếu dấu chấm cuối hoặc dấu cách sau dấu phẩy — máy chấm so từng ký tự.',
        `Viết ${c('$ {ten}')} có dấu cách giữa ${c('$')} và ${c('{')} — không còn là chỗ nhúng.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals',
      kiem: [
        { moTa: 'loiChao("Lan", 25)', goi: 'loiChao("Lan", 25)', mongDoi: 'Xin chào, tôi là Lan, 25 tuổi.' },
        { moTa: 'Tên có dấu cách: loiChao("Minh Anh", 19)', goi: 'loiChao("Minh Anh", 19)', mongDoi: 'Xin chào, tôi là Minh Anh, 19 tuổi.' },
        { moTa: 'Tuổi 0 vẫn in ra "0"', goi: 'loiChao("Bé Na", 0)', mongDoi: 'Xin chào, tôi là Bé Na, 0 tuổi.', an: true },
        { moTa: 'Dùng template literal có @{…}', kiem: 'ma-nguon', tep: 'main.js', khop: '´[^´]*\\$\\{[^´]*´' },
        { moTa: 'Không ghép chuỗi bằng dấu +', kiem: 'ma-nguon', tep: 'main.js', khop: '["\'´]\\s*\\+|\\+\\s*["\'´]', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Sửa lỗi "Assignment to constant variable"',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['const', 'let', 'gán lại', 'TypeError'],
      tienQuyet: [],
      the: ['javascript', 'const', 'let'],
      moTa: `<p>Bài 4.1: <em>"Luôn bắt đầu bằng const; chỉ đổi sang let khi bạn gán lại."</em> Hàm ${c('tinhDiemThuong()')} dưới đây cộng điểm thưởng qua ba lượt chơi, nhưng gọi nó là văng ${c('TypeError: Assignment to constant variable.')} Ngoài ra nó còn dùng ${c('var')} — cách cũ mà bài học dặn đừng dùng nữa.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('tinhDiemThuong()')} chạy không lỗi và trả về ${c('35')}.`,
        `Biến bị gán lại khai báo bằng ${c('let')}; biến không bao giờ gán lại giữ ${c('const')}.`,
        `Không còn chữ ${c('var')} nào trong tệp.`,
      ],
      dauVao: 'Không có tham số.',
      dauRa: 'number 35 (10 + 5 + 20).',
      rangBuoc: ['Không đổi các con số thưởng.', 'Không xoá dòng cộng điểm nào.'],
      viDu: [
        { input: 'tinhDiemThuong()', output: '35', explanation: 'diem bắt đầu 0, cộng 10, rồi 5, rồi 20.' },
        { input: '(code khởi đầu) tinhDiemThuong()', output: 'TypeError: Assignment to constant variable.', explanation: 'diem khai báo bằng const nhưng dòng diem = diem + 10 lại gán lại nó.' },
      ],
      goiY: [
        'Tìm biến nào bị gán lại (có dấu = đứng sau tên nó lần thứ hai). Biến đó không được là const.',
        'Đổi const diem thành let diem; đổi var THUONG_CUOI thành const (nó không bao giờ đổi).',
      ],
      khoiDau: {
        'main.js': `// Bài 4.1 — const hay let?
function tinhDiemThuong() {
  const diem = 0;
  var THUONG_CUOI = 20;
  const thuongLuot1 = 10;
  const thuongLuot2 = 5;

  diem = diem + thuongLuot1;
  diem = diem + thuongLuot2;
  diem = diem + THUONG_CUOI;
  return diem;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.1 — const hay let?
function tinhDiemThuong() {
  let diem = 0;               // bị gán lại 3 lần bên dưới ⇒ phải là let
  const THUONG_CUOI = 20;     // không bao giờ đổi ⇒ const (bỏ var: var rò ra khỏi khối)
  const thuongLuot1 = 10;     // const: tên này không trỏ sang giá trị khác
  const thuongLuot2 = 5;

  diem = diem + thuongLuot1;  // 10
  diem = diem + thuongLuot2;  // 15
  diem = diem + THUONG_CUOI;  // 35
  return diem;
}
`,
      },
      giaiThich: `<p>${c('const')} khoá <em>cái tên</em>: tên đó không được trỏ sang giá trị khác. ${c('diem = diem + 10')} chính là trỏ sang giá trị mới, nên với ${c('const')} JavaScript ném ${c('TypeError')} ngay lúc chạy. Biến cộng dồn là ví dụ kinh điển của ${c('let')}.</p>
<p>${c('THUONG_CUOI')} chẳng bao giờ đổi nên ${c('const')} là đúng — và đổi ${c('var')} thành ${c('const')} cũng bỏ luôn luật phạm vi khó đoán của ${c('var')}. Máy chấm gọi hàm (phải ra 35, không ném lỗi) và soi mã nguồn không còn ${c('var')}.</p>`,
      loiHayGap: [
        `Đổi TẤT CẢ thành ${c('let')} cho chắc — chạy được, nhưng mất lời hứa "không đổi" mà ${c('const')} cho người đọc.`,
        `Đổi ${c('var')} thành ${c('let')} — chạy được, nhưng hằng số thưởng không bị gán lại nên ${c('const')} mới đúng ý.`,
        `Gộp thành ${c('const diem = 10 + 5 + 20')} — ra 35 nhưng xoá mất các dòng cộng (đề cấm).`,
      ],
      thamKhao: 'https://javascript.info/variables',
      kiem: [
        { moTa: 'tinhDiemThuong() trả về 35, không ném lỗi', goi: 'tinhDiemThuong()', mongDoi: 35 },
        { moTa: 'Gọi hai lần vẫn ra 35 (không cộng dồn ngoài hàm)', goi: 'tinhDiemThuong() + tinhDiemThuong()', mongDoi: 70, an: true },
        { moTa: 'diem khai báo bằng let', kiem: 'ma-nguon', tep: 'main.js', khop: '\\blet\\s+diem\\b' },
        { moTa: 'Không còn var', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bvar\\b', phuDinh: true },
        { moTa: 'THUONG_CUOI là const', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bconst\\s+THUONG_CUOI\\b' },
        { moTa: 'Vẫn giữ ba dòng cộng điểm', kiem: 'ma-nguon', tep: 'main.js', khop: '(diem\\s*=\\s*diem\\s*\\+[^\\n]*\\n[\\s\\S]*){3}' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Bẫy dấu +: cộng tiền đọc từ ô nhập',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['dấu + mang hai vai', 'string và number', 'Number()', 'typeof'],
      tienQuyet: ['template literal'],
      the: ['javascript', 'number', 'type-coercion'],
      moTa: `<p>Bài 4.1: <em>"Với số thì cộng; với một chuỗi ở bất kỳ bên nào thì nối thành chữ."</em> Trang thanh toán đọc giá từ một ô nhập — mà ô nhập luôn cho <strong>chuỗi</strong>. Hàm ${c('tongTien(giaNhap, phiShip)')} đang trả về ${c('"12000030000"')} thay vì ${c('150000')}. Sửa để nó trả về một <strong>số</strong>.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('tongTien("120000", 30000)')} trả về số ${c('150000')} (kiểu ${c('number')}, không phải chuỗi).`,
        `Đổi ${c('giaNhap')} sang số bằng ${c('Number(...)')} TRƯỚC khi cộng.`,
        `Hàm thứ hai ${c('kieuKetQua(giaNhap, phiShip)')} trả về ${c('typeof')} của kết quả ${c('tongTien')} — phải là ${c('"number"')}.`,
      ],
      dauVao: 'giaNhap: string chỉ gồm chữ số (vd "120000"); phiShip: number.',
      dauRa: 'tongTien → number; kieuKetQua → "number".',
      rangBuoc: ['Không dùng parseInt/parseFloat (chưa học) — dùng Number().', 'Giữ tên hai hàm.'],
      viDu: [
        { input: 'tongTien("120000", 30000)', output: '150000', explanation: 'Number("120000") là số 120000, cộng 30000 ra 150000.' },
        { input: '(code khởi đầu) tongTien("120000", 30000)', output: '"12000030000"', explanation: 'Một bên là chuỗi nên + nối chữ: "120000" + 30000 → "12000030000".' },
        { input: 'kieuKetQua("5", 1)', output: '"number"', explanation: 'typeof trả về tên kiểu dưới dạng chuỗi.' },
      ],
      goiY: [
        'Chỉ cần MỘT bên của + là chuỗi là cả phép thành nối chữ. Hãy đổi giaNhap thành số trước.',
        'const gia = Number(giaNhap); return gia + phiShip; — và kieuKetQua chỉ cần return typeof tongTien(giaNhap, phiShip);',
      ],
      khoiDau: {
        'main.js': `// Bài 4.1 — Bẫy dấu +
// giaNhap đến từ ô <input> nên LUÔN là chuỗi, ví dụ "120000"
function tongTien(giaNhap, phiShip) {
  return giaNhap + phiShip;
}

function kieuKetQua(giaNhap, phiShip) {
  // trả về typeof của tongTien(giaNhap, phiShip)
  return "?";
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.1 — Bẫy dấu +
// giaNhap đến từ ô <input> nên LUÔN là chuỗi, ví dụ "120000"
function tongTien(giaNhap, phiShip) {
  const gia = Number(giaNhap);   // "120000" → 120000 (number)
  return gia + phiShip;          // cả hai bên là số ⇒ + là phép CỘNG
}

function kieuKetQua(giaNhap, phiShip) {
  // typeof trả về tên kiểu dạng chuỗi: "number", "string", ...
  return typeof tongTien(giaNhap, phiShip);
}
`,
      },
      giaiThich: `<p>Dấu ${c('+')} xét kiểu hai bên: hai số ⇒ cộng; có một chuỗi ⇒ nối. ${c('"120000" + 30000')} nên ra chuỗi ${c('"12000030000"')} — và lỗi này lặng lẽ: không có thông báo nào, chỉ có một con số khổng lồ trên hoá đơn. Đổi kiểu <em>ở chỗ dữ liệu đi vào</em> (${c('Number(giaNhap)')}) là cách sửa gọn nhất.</p>
<p>${c('typeof')} là công cụ để <em>kiểm</em> giả thuyết về kiểu: ${c('typeof "12000030000"')} là ${c('"string"')}, còn sau khi sửa là ${c('"number"')}. Máy chấm gọi cả hai hàm với nhiều bộ số, kể cả ${c('"0"')}.</p>`,
      loiHayGap: [
        `Đổi kiểu SAU khi cộng: ${c('Number(giaNhap + phiShip)')} — chuỗi đã nối thành ${c('"12000030000"')} rồi mới đổi, ra số sai.`,
        `Viết ${c('kieuKetQua')} trả về chuỗi cứng ${c('"number"')} — máy chấm có kiểm ẩn gọi hàm thật.`,
        `Tưởng ${c('-')} cũng nối chuỗi: ${c('"5" - 2')} ra ${c('3')} (trừ luôn đổi sang số) — chỉ ${c('+')} có hai vai.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition',
      kiem: [
        { moTa: 'tongTien("120000", 30000) = 150000', goi: 'tongTien("120000", 30000)', mongDoi: 150000 },
        { moTa: 'tongTien("0", 0) = 0', goi: 'tongTien("0", 0)', mongDoi: 0 },
        { moTa: 'Kết quả là number', goi: 'typeof tongTien("99000", 15000)', mongDoi: 'number' },
        { moTa: 'kieuKetQua("5", 1) = "number"', goi: 'kieuKetQua("5", 1)', mongDoi: 'number' },
        { moTa: 'Dùng Number(...) để đổi kiểu', kiem: 'ma-nguon', tep: 'main.js', khop: 'Number\\s*\\(' },
        { moTa: 'kieuKetQua dùng typeof thật', kiem: 'ma-nguon', tep: 'main.js', khop: 'typeof\\s+tongTien|typeof\\s*\\(\\s*tongTien' , an: true },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Bảng so sánh == với ===',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['== (bằng lỏng lẻo)', '=== (bằng nghiêm ngặt)', 'typeof', 'object literal'],
      tienQuyet: ['typeof'],
      the: ['javascript', 'equality', 'typeof'],
      moTa: `<p>Bài 4.1, mục <em>"Bẫy — == chuyển đổi kiểu trước khi so, và luật của nó thì không nhớ nổi"</em>. Để thấy tận mắt, viết hàm ${c('soSanh(a, b)')} trả về một object bốn trường: kiểu của mỗi bên và kết quả của cả hai phép so. Sau đó tự gọi thử với ${c('("5", 5)')}, ${c('("", 0)')}, ${c('(null, undefined)')} — bảng đó chính là lý do bài học dặn luôn dùng ${c('===')}.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('soSanh(a, b)')} trả về object ${c('{ kieuA, kieuB, bangLong, bangChat }')}.`,
        `${c('kieuA')}/${c('kieuB')} là ${c('typeof')} của a/b; ${c('bangLong')} là ${c('a == b')}; ${c('bangChat')} là ${c('a === b')}.`,
        `Hàm ${c('anToan(a, b)')} trả về ${c('true')} chỉ khi a và b cùng giá trị VÀ cùng kiểu — dùng ${c('===')}.`,
      ],
      dauVao: 'a, b: hai giá trị bất kỳ.',
      dauRa: 'soSanh → object 4 trường; anToan → boolean.',
      rangBuoc: ['Trong anToan không được dùng ==.', 'Không viết cứng kết quả cho từng cặp — phải tính bằng toán tử.'],
      viDu: [
        { input: 'soSanh("5", 5)', output: '{ kieuA: "string", kieuB: "number", bangLong: true, bangChat: false }', explanation: '== đổi "5" sang số 5 rồi mới so; === thấy hai kiểu khác nhau nên false.' },
        { input: 'soSanh(null, undefined)', output: '{ kieuA: "object", kieuB: "undefined", bangLong: true, bangChat: false }', explanation: 'typeof null là "object" — một lỗi lịch sử của JavaScript, cứ thế mà nhớ.' },
        { input: 'anToan("", 0)', output: 'false', explanation: 'Chuỗi rỗng và số 0 khác kiểu.' },
      ],
      goiY: [
        'Một object literal: { tenTruong: giaTri, ... }. Mỗi giá trị ở đây là một biểu thức: typeof a, a == b, a === b.',
        'return { kieuA: typeof a, kieuB: typeof b, bangLong: a == b, bangChat: a === b }; — anToan chỉ cần return a === b;',
      ],
      khoiDau: {
        'main.js': `// Bài 4.1 — == hay ===?
function soSanh(a, b) {
  // trả về { kieuA, kieuB, bangLong, bangChat }
  return {};
}

function anToan(a, b) {
  return a == b;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.1 — == hay ===?
function soSanh(a, b) {
  return {
    kieuA: typeof a,      // vd "string"
    kieuB: typeof b,      // vd "number"
    bangLong: a == b,     // == ĐỔI KIỂU trước khi so ⇒ hay cho kết quả bất ngờ
    bangChat: a === b,    // === so cả giá trị LẪN kiểu ⇒ dễ đoán
  };
}

function anToan(a, b) {
  // Luật của bài học: luôn dùng === (và !==)
  return a === b;
}
`,
      },
      giaiThich: `<p>Bảng mà hàm của bạn in ra cho thấy vì sao ${c('==')} nguy hiểm: ${c('"" == 0')} là ${c('true')}, ${c('"0" == 0')} là ${c('true')}, nhưng ${c('"" == "0"')} lại ${c('false')} — phép "bằng" không còn bắc cầu. ${c('===')} không đổi kiểu nên kết quả khớp đúng thứ bạn đọc trên màn hình.</p>
<p>Lưu ý ${c('typeof null')} là ${c('"object"')} — lỗi từ phiên bản JavaScript đầu tiên, không sửa được vì sẽ làm vỡ web cũ. Máy chấm gọi ${c('soSanh')} với 5 cặp (có cặp ẩn) và kiểm ${c('anToan')} không dùng ${c('==')}.</p>`,
      loiHayGap: [
        `Viết cứng ${c('bangLong: true')} vì "thấy ví dụ ra true" — cặp ẩn ${c('("", "0")')} ra false.`,
        `Đặt sai tên trường (${c('kieu_a')}, ${c('KieuA')}) — object so khớp từng tên khoá.`,
        `Tưởng ${c('typeof null')} là ${c('"null"')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness',
      kiem: [
        { moTa: 'soSanh("5", 5)', goi: 'soSanh("5", 5)', mongDoi: { kieuA: 'string', kieuB: 'number', bangLong: true, bangChat: false } },
        { moTa: 'soSanh("", 0)', goi: 'soSanh("", 0)', mongDoi: { kieuA: 'string', kieuB: 'number', bangLong: true, bangChat: false } },
        { moTa: 'soSanh(null, undefined)', goi: 'soSanh(null, undefined)', mongDoi: { kieuA: 'object', kieuB: 'undefined', bangLong: true, bangChat: false } },
        { moTa: 'soSanh("", "0") — == không bắc cầu', goi: 'soSanh("", "0")', mongDoi: { kieuA: 'string', kieuB: 'string', bangLong: false, bangChat: false }, an: true },
        { moTa: 'soSanh(7, 7)', goi: 'soSanh(7, 7)', mongDoi: { kieuA: 'number', kieuB: 'number', bangLong: true, bangChat: true }, an: true },
        { moTa: 'anToan("", 0) = false', goi: 'anToan("", 0)', mongDoi: false },
        { moTa: 'anToan(3, 3) = true', goi: 'anToan(3, 3)', mongDoi: true },
        { moTa: 'anToan không dùng ==', kiem: 'ma-nguon', tep: 'main.js', khop: 'function\\s+anToan[^}]*[^=!]==[^=]', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Thẻ hồ sơ nhiều dòng: template literal + biểu thức',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['template literal nhiều dòng', 'biểu thức trong @{ }', '.length', 'toUpperCase()'],
      tienQuyet: ['template literal'],
      the: ['javascript', 'string', 'template-literal'],
      moTa: `<p>Template literal không chỉ nhúng <em>biến</em> — bên trong ${c('@{ }')} đặt được bất kỳ <strong>biểu thức</strong> nào: phép tính, ${c('.length')}, lời gọi phương thức. Và nó giữ nguyên xuống dòng. Viết ${c('theHoSo(ho, ten, namSinh, namNay)')} trả về một chuỗi ba dòng đúng định dạng dưới đây.</p>
<pre><code>Họ tên: NGUYỄN Lan
Tuổi: 25
Độ dài tên đầy đủ: 10 ký tự</code></pre>
${KHUNG_HAM}`,
      yeuCau: [
        `Dòng 1: ${c('Họ tên: ')} + họ VIẾT HOA (${c('ho.toUpperCase()')}) + dấu cách + tên giữ nguyên.`,
        `Dòng 2: ${c('Tuổi: ')} + ${c('namNay - namSinh')}.`,
        `Dòng 3: ${c('Độ dài tên đầy đủ: N ký tự')} với N = độ dài của ${c('"<ho> <ten>"')} (tính cả dấu cách).`,
        `Các dòng cách nhau bằng đúng một ký tự xuống dòng, không có khoảng trắng thừa đầu/cuối dòng.`,
      ],
      dauVao: 'ho, ten: string; namSinh, namNay: number.',
      dauRa: 'string ba dòng.',
      rangBuoc: ['Một template literal duy nhất cho cả ba dòng (được phép tạo biến phụ trước đó).', 'Không ghép bằng +.'],
      viDu: [
        { input: 'theHoSo("Nguyễn", "Lan", 2001, 2026)', output: '"Họ tên: NGUYỄN Lan\\nTuổi: 25\\nĐộ dài tên đầy đủ: 10 ký tự"', explanation: '"Nguyễn Lan" có 10 ký tự (6 + 1 dấu cách + 3).' },
        { input: 'theHoSo("Lê", "Minh Anh", 2008, 2026)', output: '"Họ tên: LÊ Minh Anh\\nTuổi: 18\\nĐộ dài tên đầy đủ: 11 ký tự"', explanation: 'Dấu cách giữa "Minh" và "Anh" cũng là một ký tự.' },
      ],
      goiY: [
        'Tạo biến phụ const hoTen = ´@{ho} @{ten}´; rồi dùng hoTen.length ở dòng 3.',
        'Xuống dòng thật bên trong dấu huyền, và đừng thụt lề hai dòng sau — khoảng trắng thụt lề cũng nằm trong chuỗi.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.1 — Thẻ hồ sơ nhiều dòng
function theHoSo(ho, ten, namSinh, namNay) {
  return "Họ tên: " + ho + " " + ten;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.1 — Thẻ hồ sơ nhiều dòng
function theHoSo(ho, ten, namSinh, namNay) {
  const hoTen = ´@{ho} @{ten}´;      // "Nguyễn Lan" — dấu cách cũng tính vào length
  const tuoi = namNay - namSinh;    // phép trừ giữa hai số

  // Template literal giữ nguyên xuống dòng. Hai dòng sau KHÔNG thụt lề,
  // vì mọi khoảng trắng nằm giữa hai dấu huyền đều thuộc về chuỗi.
  return ´Họ tên: @{ho.toUpperCase()} @{ten}
Tuổi: @{tuoi}
Độ dài tên đầy đủ: @{hoTen.length} ký tự´;
}
`,
      },
      giaiThich: `<p>Trong ${c('@{ }')} là một biểu thức JavaScript đầy đủ: ${c('ho.toUpperCase()')} gọi phương thức của chuỗi, ${c('namNay - namSinh')} tính toán, ${c('hoTen.length')} đọc độ dài. Kết quả của biểu thức được đổi thành chữ và chèn vào.</p>
<p>Cái bẫy của chuỗi nhiều dòng là <strong>thụt lề</strong>: nếu bạn thụt hai dòng sau cho "đẹp code", các dấu cách đó nằm luôn trong chuỗi và máy chấm (so từng ký tự) báo sai. Máy chấm gọi hàm với ba bộ dữ liệu, có tên chứa dấu cách.</p>`,
      loiHayGap: [
        'Thụt lề dòng 2 và 3 trong template literal — chuỗi có thêm khoảng trắng đầu dòng.',
        `Tính độ dài ${c('ho.length + ten.length')} — thiếu dấu cách ở giữa (ra 9 thay vì 10).`,
        `Viết ${c('ho.toUpperCase')} thiếu ${c('()')} — chèn nguyên mã của hàm vào chuỗi.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#multi-line_strings',
      kiem: [
        { moTa: 'theHoSo("Nguyễn", "Lan", 2001, 2026)', goi: 'theHoSo("Nguyễn", "Lan", 2001, 2026)', mongDoi: 'Họ tên: NGUYỄN Lan\nTuổi: 25\nĐộ dài tên đầy đủ: 10 ký tự' },
        { moTa: 'theHoSo("Lê", "Minh Anh", 2008, 2026)', goi: 'theHoSo("Lê", "Minh Anh", 2008, 2026)', mongDoi: 'Họ tên: LÊ Minh Anh\nTuổi: 18\nĐộ dài tên đầy đủ: 11 ký tự' },
        { moTa: 'Đúng 3 dòng', goi: 'theHoSo("Trần", "B", 2000, 2026).split("\\n").length', mongDoi: 3 },
        { moTa: 'Không có khoảng trắng thụt đầu dòng', goi: '/\\n\\s/.test(theHoSo("Trần", "B", 2000, 2026))', mongDoi: false },
        { moTa: 'Bộ dữ liệu ẩn', goi: 'theHoSo("Phạm", "Thu Hà", 1990, 2026)', mongDoi: 'Họ tên: PHẠM Thu Hà\nTuổi: 36\nĐộ dài tên đầy đủ: 11 ký tự', an: true },
        { moTa: 'Dùng template literal', kiem: 'ma-nguon', tep: 'main.js', khop: '´[^´]*\\$\\{[^´]*´' },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'const khoá cái tên, không khoá giá trị',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['const với object', 'sửa thuộc tính', 'gán lại', 'tham chiếu'],
      tienQuyet: ['const', 'let'],
      the: ['javascript', 'const', 'object'],
      moTa: `<p>Bài 4.1: <em>"const không có nghĩa là đóng băng — nó khoá cái tên, không khoá giá trị."</em> ${c('const user = { name: "An" }')} rồi ${c('user.name = "Bình"')} là hợp lệ; còn ${c('user = { name: "Chi" }')} thì ném ${c('TypeError')}. Hàm ${c('doiTen(nguoiDung, tenMoi)')} phải <strong>sửa chính object được đưa vào</strong> rồi trả lại đúng object đó — người viết trước lại cố gán một object mới vào một const.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `${c('doiTen(nguoiDung, tenMoi)')} đặt ${c('nguoiDung.name = tenMoi')} và trả về <strong>chính</strong> ${c('nguoiDung')} (cùng một object, không phải bản sao).`,
        'Các thuộc tính khác của object (vd tuoi) giữ nguyên.',
        `Hàm ${c('thuGanLai()')} trả về chuỗi tên lỗi khi cố gán lại một const: viết ${c('const x = 1;')} rồi ${c('x = 2;')} bên trong ${c('try')}, trong ${c('catch (e)')} trả về ${c('e.name')}.`,
      ],
      dauVao: 'nguoiDung: object có name (và có thể có thêm trường); tenMoi: string.',
      dauRa: 'doiTen → chính object đó; thuGanLai → "TypeError".',
      rangBuoc: ['Không tạo object mới trong doiTen.', 'try/catch được viết sẵn khung trong code khởi đầu — chỉ cần điền.'],
      viDu: [
        { input: 'const u = { name: "An", tuoi: 20 };\nconst r = doiTen(u, "Bình");\n[u.name, r === u]', output: '["Bình", true]', explanation: 'Object gốc đã đổi tên, và giá trị trả về là cùng một object.' },
        { input: 'thuGanLai()', output: '"TypeError"', explanation: 'x = 2 với const x ném TypeError: Assignment to constant variable.' },
      ],
      goiY: [
        'Đổi một THUỘC TÍNH (nguoiDung.name = …) không phải là gán lại tên nguoiDung — const cho phép.',
        'doiTen: nguoiDung.name = tenMoi; return nguoiDung;  — thuGanLai: try { const x = 1; x = 2; } catch (e) { return e.name; }',
      ],
      khoiDau: {
        'main.js': `// Bài 4.1 — const khoá tên, không khoá giá trị
function doiTen(nguoiDung, tenMoi) {
  const ketQua = nguoiDung;
  ketQua = { name: tenMoi };   // cố gán object mới vào một const
  return ketQua;
}

function thuGanLai() {
  try {
    // viết: một const x, rồi gán lại x
  } catch (e) {
    // trả về tên lỗi
  }
  return "không có lỗi";
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.1 — const khoá tên, không khoá giá trị
function doiTen(nguoiDung, tenMoi) {
  // Sửa THUỘC TÍNH của object — const/tham số không cấm việc này.
  // Mọi biến đang trỏ vào object này (kể cả biến của người gọi) đều thấy tên mới.
  nguoiDung.name = tenMoi;
  return nguoiDung;            // trả lại chính object đó, không phải bản sao
}

function thuGanLai() {
  try {
    const x = 1;
    x = 2;                     // gán lại một const ⇒ ném lỗi ngay tại đây
  } catch (e) {
    return e.name;             // "TypeError"
  }
  return "không có lỗi";
}
`,
      },
      giaiThich: `<p>Một biến giữ object thật ra giữ <em>tham chiếu</em> tới object. ${c('const')} khoá tham chiếu đó (không trỏ sang object khác được), còn bản thân object vẫn sửa thoải mái. Vì vậy ${c('nguoiDung.name = tenMoi')} hợp lệ, và người gọi — đang giữ cùng tham chiếu — thấy ngay tên mới.</p>
<p>Code khởi đầu tạo object mới nên dù không có const thì người gọi vẫn giữ object cũ, tên cũ. Máy chấm kiểm ${c('r === u')} (cùng object), tên mới, trường khác còn nguyên, và tên lỗi khi gán lại const.</p>`,
      loiHayGap: [
        `Đổi ${c('const ketQua')} thành ${c('let')} rồi vẫn gán object mới — hết lỗi, nhưng object của người gọi không đổi tên.`,
        `Trả về ${c('{ ...nguoiDung, name: tenMoi }')} — một bản sao: ${c('r === u')} là false (cách này đúng ở chỗ khác, như React, nhưng không phải yêu cầu ở đây).`,
        `Trong ${c('catch')} trả về ${c('e.message')} — đề hỏi tên lỗi (${c('e.name')}).`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const',
      kiem: [
        { moTa: 'Object gốc đổi tên, giá trị trả về là chính nó', chuanBi: 'const u = { name: "An", tuoi: 20 }; const r = doiTen(u, "Bình");', goi: '[u.name, r === u]', mongDoi: ['Bình', true] },
        { moTa: 'Trường khác giữ nguyên', chuanBi: 'const u = { name: "An", tuoi: 20 }; doiTen(u, "Chi");', goi: 'u', mongDoi: { name: 'Chi', tuoi: 20 } },
        { moTa: 'Đổi hai lần liên tiếp', chuanBi: 'const u = { name: "A" }; doiTen(doiTen(u, "B"), "C");', goi: 'u.name', mongDoi: 'C', an: true },
        { moTa: 'thuGanLai() = "TypeError"', goi: 'thuGanLai()', mongDoi: 'TypeError' },
        { moTa: 'thuGanLai thật sự gán lại một const', kiem: 'ma-nguon', tep: 'main.js', khop: 'const\\s+x\\s*=[^;\\n]*;?\\s*\\n?\\s*x\\s*=' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Gỡ năm lỗi kiểu dữ liệu trong hàm tính điểm',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['ép kiểu ngầm', '+ nối chuỗi', 'Number()', 'template literal', 'const/let', '==='],
      tienQuyet: ['template literal', 'dấu + mang hai vai', '== với ==='],
      the: ['javascript', 'debugging', 'types'],
      moTa: `<p>Bài tổng hợp Bài 4.1. Hàm ${c('bangDiem(ten, diemGK, diemCK)')} lấy điểm giữa kỳ và cuối kỳ từ hai ô nhập (nên là <strong>chuỗi</strong>) và trả về một dòng báo cáo. Code khởi đầu có <strong>năm</strong> lỗi đúng loại bài học đã cảnh báo: dùng ${c('var')}, gán lại một ${c('const')}, cộng chuỗi thay vì cộng số (nên ${c('("7" + "8") / 2')} ra ${c('39')}!), so sánh bằng ${c('==')}, và một chuỗi viết bằng nháy đơn nên ${c('@{…}')} không được thay. Tìm và sửa cả năm.</p>
<p>Định dạng chuẩn: ${c('Lan: trung bình 7.5 — đạt điểm tối đa: false')}. "Đạt điểm tối đa" là ${c('true')} khi trung bình bằng đúng ${c('10')}.</p>
${KHUNG_HAM}`,
      yeuCau: [
        `Trung bình = (giữa kỳ + cuối kỳ) / 2, tính trên SỐ: ${c('bangDiem("Lan", "7", "8")')} → ${c('"Lan: trung bình 7.5 — đạt điểm tối đa: false"')}.`,
        `"Đạt điểm tối đa" so bằng ${c('===')} với số ${c('10')}.`,
        `Chuỗi kết quả dùng template literal; không còn ${c('var')}; không còn phép ${c('==')} lỏng lẻo.`,
        `Hàm trả về chuỗi, không ném lỗi.`,
      ],
      dauVao: 'ten: string; diemGK, diemCK: string chứa số thập phân dạng "7" hoặc "8.5".',
      dauRa: 'string "<ten>: trung bình <tb> — đạt điểm tối đa: <true|false>".',
      rangBuoc: ['Không làm tròn trung bình.', 'Không dùng parseFloat — Number() là đủ.'],
      viDu: [
        { input: 'bangDiem("Lan", "7", "8")', output: '"Lan: trung bình 7.5 — đạt điểm tối đa: false"', explanation: 'Number("7") + Number("8") = 15; 15 / 2 = 7.5.' },
        { input: 'bangDiem("Huy", "10", "10")', output: '"Huy: trung bình 10 — đạt điểm tối đa: true"', explanation: '10 === 10. Với code cũ: "10" + "10" = "1010", chia 2 = 505.' },
        { input: '(code khởi đầu) bangDiem("Lan", "7", "8")', output: 'TypeError: Assignment to constant variable.', explanation: 'Lỗi đầu tiên chặn mọi thứ phía sau — sửa xong lỗi này mới thấy các lỗi kia.' },
      ],
      goiY: [
        'Sửa lần lượt và chạy lại sau mỗi lần sửa: lỗi TypeError trước, rồi đến con số sai (39 hay 505 là dấu hiệu + đang nối chữ), rồi đến chuỗi in ra nguyên văn "@{ten}".',
        'const gk = Number(diemGK); const ck = Number(diemCK); const tb = (gk + ck) / 2; const toiDa = tb === 10; return ´@{ten}: trung bình @{tb} — đạt điểm tối đa: @{toiDa}´;',
      ],
      khoiDau: {
        'main.js': `// Bài 4.1 — Gỡ 5 lỗi kiểu dữ liệu
function bangDiem(ten, diemGK, diemCK) {
  var tong = diemGK + diemCK;
  const tb = 0;
  tb = tong / 2;
  const toiDa = tb == "10";
  return '@{ten}: trung bình @{tb} — đạt điểm tối đa: @{toiDa}';
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.1 — Gỡ 5 lỗi kiểu dữ liệu
function bangDiem(ten, diemGK, diemCK) {
  // (1) Ô nhập cho CHUỖI ⇒ đổi sang số trước khi cộng, không thì + sẽ NỐI: "7" + "8" = "78"
  const gk = Number(diemGK);
  const ck = Number(diemCK);

  // (2) bỏ var — const đủ, vì không gán lại
  const tong = gk + ck;

  // (3) không gán lại const: tính một lần, đặt tên một lần
  const tb = tong / 2;

  // (4) === với SỐ 10 — không để == tự đổi kiểu hộ
  const toiDa = tb === 10;

  // (5) template literal dùng DẤU HUYỀN; nháy đơn sẽ in nguyên văn "@{ten}"
  return ´@{ten}: trung bình @{tb} — đạt điểm tối đa: @{toiDa}´;
}
`,
      },
      giaiThich: `<p>Năm lỗi, năm bài học của 4.1: (1) ${c('+')} có một bên là chuỗi thì nối — ${c('"7" + "8"')} là ${c('"78"')}, và ${c('"78" / 2')} ra ${c('39')} vì phép chia lặng lẽ đổi chuỗi sang số. Lỗi kiểu này không văng thông báo nào, chỉ cho ra con số sai. (2) ${c('var')} là cách cũ. (3) ${c('const')} không gán lại được. (4) ${c('==')} tự đổi kiểu — ${c('10 == "10"')} là true, che mất việc bạn đang so số với chuỗi. (5) Chỉ dấu huyền mới là template literal.</p>
<p>Thứ tự sửa cũng là bài học: lỗi ném ra (TypeError) chặn mọi thứ sau nó, nên phải sửa trước; lỗi "im lặng" (số sai, chuỗi in nguyên văn) chỉ lộ khi bạn nhìn kết quả. Máy chấm gọi hàm với 4 bộ điểm, có điểm lẻ ${c('"8.5"')}, và soi mã không còn ${c('var')} / ${c('==')}.</p>`,
      loiHayGap: [
        `Đổi kiểu sau khi cộng: ${c('Number(diemGK + diemCK)')} — ra 78, không phải 15.`,
        `So ${c('tb === "10"')} — số không bao giờ === chuỗi, luôn false.`,
        `Sửa nháy đơn thành nháy kép — vẫn không phải template literal.`,
        `Làm tròn ${c('Math.round(tb)')} — 7.5 thành 8, sai đề.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion',
      kiem: [
        { moTa: 'bangDiem("Lan", "7", "8")', goi: 'bangDiem("Lan", "7", "8")', mongDoi: 'Lan: trung bình 7.5 — đạt điểm tối đa: false' },
        { moTa: 'bangDiem("Huy", "10", "10") — đạt tối đa', goi: 'bangDiem("Huy", "10", "10")', mongDoi: 'Huy: trung bình 10 — đạt điểm tối đa: true' },
        { moTa: 'Điểm lẻ: bangDiem("Na", "8.5", "9")', goi: 'bangDiem("Na", "8.5", "9")', mongDoi: 'Na: trung bình 8.75 — đạt điểm tối đa: false' },
        { moTa: 'Bộ ẩn: bangDiem("Tú", "0", "3")', goi: 'bangDiem("Tú", "0", "3")', mongDoi: 'Tú: trung bình 1.5 — đạt điểm tối đa: false', an: true },
        { moTa: 'Không còn var', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bvar\\b', phuDinh: true },
        { moTa: 'Không còn == lỏng lẻo', kiem: 'ma-nguon', tep: 'main.js', khop: '[^=!<>]==[^=]', phuDinh: true },
        { moTa: 'Kết quả dựng bằng template literal', kiem: 'ma-nguon', tep: 'main.js', khop: '´[^´]*\\$\\{ten\\}[^´]*´' },
      ],
    },
  ],
});
