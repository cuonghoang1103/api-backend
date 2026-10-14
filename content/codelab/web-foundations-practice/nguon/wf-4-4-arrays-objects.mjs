/** Bộ luyện bài 4.4 — Mảng và đối tượng. Lược đồ: ./_luoc-do.mjs (loại 'js'). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const SV = `[
  { ten: "Lan",  diem: 8.5, lop: "SE1" },
  { ten: "Minh", diem: 4,   lop: "SE2" },
  { ten: "Hà",   diem: 6,   lop: "SE1" },
]`;

export default doiDau({
  slug: 'wf-4-4-arrays-objects',
  ten: '4.4 Mảng và đối tượng',
  baiHoc: 'Nền tảng Web — Bài 4.4 Mảng và đối tượng',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Mảng (chỉ số, length, push), map / filter / reduce / find / forEach, object (dấu chấm, ngoặc vuông, khoá động), mảng các object, bản chép nông với structuredClone, tự viết groupBy — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'map và filter trên danh sách người dùng',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['map', 'filter', 'mảng các object', 'arrow callback'],
      tienQuyet: ['arrow function', 'object'],
      the: ['javascript', 'array', 'map', 'filter'],
      moTa: `<p>Bài 4.4: <em>"Hình dạng bạn thấy khắp nơi: một mảng các đối tượng."</em> API trả về danh sách người dùng. Viết hai hàm:</p>
<ul><li>${c('layTen(ds)')}: mảng tên, cùng thứ tự — dùng ${c('map')}.</li>
<li>${c('tenNguoiTu(ds, tuoi)')}: tên của những người có ${c('age >= tuoi')} — ${c('filter')} rồi ${c('map')}.</li></ul>
<p>Code khởi đầu dùng ${c('forEach')} và tưởng nó trả về mảng mới — nhưng ${c('forEach')} luôn trả về ${c('undefined')}.</p>`,
      yeuCau: [
        `${c('layTen([{ name: "Lan", age: 25 }, { name: "Minh", age: 30 }])')} → ${c('["Lan", "Minh"]')}.`,
        `${c('tenNguoiTu(ds, 30)')} → tên những người từ 30 tuổi, giữ thứ tự gốc.`,
        'Không sửa mảng đầu vào; danh sách rỗng → mảng rỗng.',
      ],
      dauVao: 'ds: mảng object { name: string, age: number }; tuoi: number.',
      dauRa: 'Mảng string.',
      rangBuoc: ['Dùng map / filter, không dùng vòng lặp for và push.'],
      viDu: [
        { input: 'layTen([{ name: "Lan", age: 25 }, { name: "Minh", age: 30 }])', output: '["Lan", "Minh"]', explanation: 'map: mười người vào, mười cái tên ra — cùng độ dài.' },
        { input: 'tenNguoiTu([{ name: "Lan", age: 25 }, { name: "Minh", age: 30 }], 30)', output: '["Minh"]', explanation: 'filter giữ người ≥ 30, map lấy tên.' },
      ],
      goiY: [
        'map nhận một hàm biến MỘT phần tử thành MỘT giá trị mới: u => u.name.',
        'return ds.filter(u => u.age >= tuoi).map(u => u.name); — hai phương thức nối nhau vì filter trả về một mảng.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.4 — map và filter
function layTen(ds) {
  return ds.forEach(u => u.name);
}

function tenNguoiTu(ds, tuoi) {
  return ds.forEach(u => u.age >= tuoi);
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.4 — map và filter
function layTen(ds) {
  // map: biến MỖI phần tử thành một giá trị mới ⇒ mảng MỚI cùng độ dài
  return ds.map(u => u.name);
}

function tenNguoiTu(ds, tuoi) {
  return ds
    .filter(u => u.age >= tuoi)   // giữ những người đủ tuổi (mảng mới, ngắn hơn)
    .map(u => u.name);            // rồi lấy tên của họ
}
`,
      },
      giaiThich: `<p>${c('forEach')} để <em>làm</em> gì đó với từng phần tử (tác dụng phụ) và trả về ${c('undefined')}; ${c('map')} để <em>tạo ra</em> một mảng mới. Câu hỏi để chọn: "mình cần kết quả không?" — cần thì ${c('map')}/${c('filter')}.</p>
<p>Cả hai trả về mảng mới, mảng gốc nguyên vẹn — nên nối được ${c('.filter(…).map(…)')}. Máy chấm gọi với danh sách 2 và 4 người, danh sách rỗng, và kiểm mảng gốc không đổi.</p>`,
      loiHayGap: [
        `Viết ${c('ds.map(u => { u.name })')} — ngoặc nhọn không return, ra mảng toàn ${c('undefined')}.`,
        `${c('filter(u => u.name)')} khi cần tên — filter trả về object, không phải tên.`,
        `Dùng ${c('>')} thay ${c('>=')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
      kiem: [
        { moTa: 'layTen hai người', goi: 'layTen([{ name: "Lan", age: 25 }, { name: "Minh", age: 30 }])', mongDoi: ['Lan', 'Minh'] },
        { moTa: 'layTen([]) = []', goi: 'layTen([])', mongDoi: [] },
        { moTa: 'tenNguoiTu(…, 30)', goi: 'tenNguoiTu([{ name: "Lan", age: 25 }, { name: "Minh", age: 30 }, { name: "Hà", age: 41 }, { name: "Tú", age: 18 }], 30)', mongDoi: ['Minh', 'Hà'] },
        { moTa: 'Không ai đủ tuổi → []', goi: 'tenNguoiTu([{ name: "Tú", age: 18 }], 60)', mongDoi: [] },
        { moTa: 'Mảng gốc không đổi', chuanBi: 'const ds = [{ name: "A", age: 40 }]; tenNguoiTu(ds, 30); layTen(ds);', goi: 'ds', mongDoi: [{ name: 'A', age: 40 }], an: true },
        { moTa: 'Dùng map', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.map\\s*\\(' },
        { moTa: 'Dùng filter', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.filter\\s*\\(' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Tổng giỏ hàng bằng reduce — và giá trị khởi đầu bị quên',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['reduce', 'giá trị khởi đầu', 'mảng rỗng'],
      tienQuyet: ['arrow function', 'object'],
      the: ['javascript', 'array', 'reduce'],
      moTa: `<p>Bài 4.4: <em>"reduce — gộp mọi phần tử thành một giá trị."</em> Giỏ hàng là mảng ${c('{ ten, gia, soLuong }')}. ${c('tongGioHang(gio)')} phải trả về tổng ${c('gia × soLuong')}. Bản cũ gọi ${c('reduce')} <strong>không có giá trị khởi đầu</strong>: với giỏ có hàng, lượt đầu nó lấy cả object làm "tổng" (ra ${c('"[object Object]…"')}); với giỏ rỗng nó ném ${c('TypeError')}.</p>`,
      yeuCau: [
        `${c('tongGioHang([{ ten: "Bút", gia: 5000, soLuong: 3 }, { ten: "Vở", gia: 12000, soLuong: 2 }])')} → ${c('39000')}.`,
        `Giỏ rỗng → ${c('0')}, không ném lỗi.`,
        `Dùng ${c('reduce')} với giá trị khởi đầu ${c('0')}.`,
      ],
      dauVao: 'gio: mảng { ten: string, gia: number, soLuong: number }.',
      dauRa: 'number.',
      rangBuoc: ['Không dùng vòng lặp for.'],
      viDu: [
        { input: 'tongGioHang([{ ten: "Bút", gia: 5000, soLuong: 3 }, { ten: "Vở", gia: 12000, soLuong: 2 }])', output: '39000', explanation: '15000 + 24000.' },
        { input: 'tongGioHang([])', output: '0', explanation: 'Có giá trị khởi đầu thì reduce trên mảng rỗng trả về chính giá trị đó.' },
      ],
      goiY: [
        'reduce((tong, mon) => …, 0) — số 0 ở cuối là giá trị đầu của "tong". Thiếu nó, reduce lấy PHẦN TỬ ĐẦU (một object) làm tong.',
        'return gio.reduce((tong, mon) => tong + mon.gia * mon.soLuong, 0);',
      ],
      khoiDau: {
        'main.js': `// Bài 4.4 — reduce
function tongGioHang(gio) {
  return gio.reduce((tong, mon) => tong + mon.gia * mon.soLuong);
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.4 — reduce
function tongGioHang(gio) {
  // reduce(hàmGộp, giáTrịKhởiĐầu):
  //   tong bắt đầu bằng 0, mỗi lượt cộng thêm thành tiền của một món.
  // Thiếu số 0: lượt đầu tong = cả object món đầu tiên, và mảng rỗng ném TypeError.
  return gio.reduce((tong, mon) => tong + mon.gia * mon.soLuong, 0);
}
`,
      },
      giaiThich: `<p>${c('reduce')} có hai chế độ. Có giá trị khởi đầu: ${c('tong')} bắt đầu bằng nó và hàm gộp chạy cho MỌI phần tử. Không có: ${c('tong')} bắt đầu bằng <em>phần tử đầu tiên</em> và hàm gộp chạy từ phần tử thứ hai. Khi cộng số trong mảng số thì hai chế độ trùng kết quả — nên lỗi chỉ lộ khi phần tử là object (cộng object với số ra chuỗi) hoặc mảng rỗng (không có phần tử đầu ⇒ TypeError).</p>
<p>Quy tắc an toàn: luôn đưa giá trị khởi đầu. Máy chấm thử giỏ 1 món, 2 món, rỗng, và một giỏ ẩn 4 món.</p>`,
      loiHayGap: [
        'Quên giá trị khởi đầu (như bản cũ).',
        `Đặt giá trị khởi đầu là ${c('""')} — ra chuỗi nối, không phải tổng.`,
        `Quên ${c('return')} khi viết hàm gộp có ngoặc nhọn — lượt sau ${c('tong')} là undefined, ra NaN.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce',
      kiem: [
        { moTa: 'Giỏ hai món = 39000', goi: 'tongGioHang([{ ten: "Bút", gia: 5000, soLuong: 3 }, { ten: "Vở", gia: 12000, soLuong: 2 }])', mongDoi: 39000 },
        { moTa: 'Giỏ một món', goi: 'tongGioHang([{ ten: "Sách", gia: 85000, soLuong: 1 }])', mongDoi: 85000 },
        { moTa: 'Giỏ rỗng = 0, không lỗi', goi: 'tongGioHang([])', mongDoi: 0 },
        { moTa: 'Giỏ ẩn 4 món', goi: 'tongGioHang([{ gia: 1000, soLuong: 1 }, { gia: 2000, soLuong: 2 }, { gia: 0, soLuong: 9 }, { gia: 500, soLuong: 4 }])', mongDoi: 7000, an: true },
        { moTa: 'Dùng reduce', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.reduce\\s*\\(' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'find trả về undefined khi không thấy — đừng quên ca đó',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['find', 'undefined', 'optional chaining ?.', '??'],
      tienQuyet: ['arrow function', '??'],
      the: ['javascript', 'array', 'find'],
      moTa: `<p>Bài 4.4: <em>"find — dừng ở cái khớp đầu tiên. Cái undefined khi chẳng có gì khớp mới là phần người ta hay quên xử lý."</em> ${c('tenSanPham(ds, ma)')} trả về tên sản phẩm có mã ${c('ma')}. Bản cũ viết ${c('ds.find(…).ten')} — chạy tốt với mã có thật, nhưng một mã sai làm sập cả trang với ${c('TypeError: Cannot read properties of undefined')}.</p>`,
      yeuCau: [
        `Tìm bằng ${c('find')} và so ${c('===')}; thấy → trả về ${c('ten')}.`,
        `Không thấy → trả về ${c('"Không tìm thấy"')}, không ném lỗi.`,
        `Có nhiều sản phẩm trùng mã → lấy cái ĐẦU TIÊN.`,
      ],
      dauVao: 'ds: mảng { ma: string, ten: string }; ma: string.',
      dauRa: 'string.',
      rangBuoc: ['Dùng find, không dùng filter(...)[0].'],
      viDu: [
        { input: 'tenSanPham([{ ma: "SP1", ten: "Bút" }, { ma: "SP2", ten: "Vở" }], "SP2")', output: '"Vở"', explanation: 'find trả về object khớp đầu tiên.' },
        { input: 'tenSanPham([{ ma: "SP1", ten: "Bút" }], "SP9")', output: '"Không tìm thấy"', explanation: 'find trả về undefined ⇒ phải xử lý trước khi đọc .ten.' },
      ],
      goiY: [
        'Lưu kết quả find vào biến rồi kiểm nó trước khi đọc .ten: if (!sp) return "Không tìm thấy";',
        'Dạng ngắn: return ds.find(sp => sp.ma === ma)?.ten ?? "Không tìm thấy"; — ?. dừng lại (ra undefined) thay vì ném lỗi khi vế trái là undefined.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.4 — find
function tenSanPham(ds, ma) {
  return ds.find(sp => sp.ma === ma).ten;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.4 — find
function tenSanPham(ds, ma) {
  const sp = ds.find(sp => sp.ma === ma);   // object khớp ĐẦU TIÊN, hoặc undefined
  if (sp === undefined) {
    return "Không tìm thấy";                // xử lý ca "không thấy" TRƯỚC khi đọc .ten
  }
  return sp.ten;
  // Dạng ngắn tương đương: return ds.find(sp => sp.ma === ma)?.ten ?? "Không tìm thấy";
}
`,
      },
      giaiThich: `<p>${c('find')} trả về hai kiểu giá trị: một object hoặc ${c('undefined')}. Đọc ${c('.ten')} trên ${c('undefined')} là ném lỗi, nên mọi lần dùng ${c('find')} phải đi kèm câu hỏi "nếu không thấy thì sao?". Optional chaining ${c('?.')} là cách gọn: ${c('x?.ten')} trả về ${c('undefined')} khi x là null/undefined thay vì ném.</p>
<p>Máy chấm thử mã có thật, mã không có, danh sách rỗng và danh sách có mã trùng (lấy cái đầu).</p>`,
      loiHayGap: [
        `Dùng ${c('filter(...)[0]')} — chạy được nhưng duyệt hết mảng, và vẫn phải xử lý undefined.`,
        `Bọc ${c('try/catch')} quanh ${c('.ten')} — che lỗi thay vì xử lý đúng ca.`,
        `So ${c('sp.ma == ma')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find',
      kiem: [
        { moTa: 'Tìm thấy "SP2" → "Vở"', goi: 'tenSanPham([{ ma: "SP1", ten: "Bút" }, { ma: "SP2", ten: "Vở" }], "SP2")', mongDoi: 'Vở' },
        { moTa: 'Không thấy → "Không tìm thấy"', goi: 'tenSanPham([{ ma: "SP1", ten: "Bút" }], "SP9")', mongDoi: 'Không tìm thấy' },
        { moTa: 'Danh sách rỗng', goi: 'tenSanPham([], "SP1")', mongDoi: 'Không tìm thấy' },
        { moTa: 'Mã trùng → lấy cái đầu', goi: 'tenSanPham([{ ma: "A", ten: "Một" }, { ma: "A", ten: "Hai" }], "A")', mongDoi: 'Một', an: true },
        { moTa: 'Dùng find', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.find\\s*\\(' },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Khoá động bằng ngoặc vuông: đếm đơn theo trạng thái',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['bracket notation', 'khoá động', 'object làm bộ đếm', 'thuộc tính thiếu là undefined'],
      tienQuyet: ['object', 'for...of'],
      the: ['javascript', 'object', 'bracket-notation'],
      moTa: `<p>Bài 4.4: <em>"Truy cập bằng ngoặc vuông — cần cho khoá động."</em> Bảng điều khiển cửa hàng cần đếm đơn theo trạng thái. Trạng thái nằm trong <em>biến</em> (${c('don.trangThai')}), nên ${c('dem.trangThai')} (dấu chấm) sẽ đếm vào một khoá tên là chữ "trangThai" — sai. Viết ${c('demTheoTrangThai(dsDon)')} trả về object dạng ${c('{ moi: 2, dangGiao: 1, daGiao: 3 }')}.</p>`,
      yeuCau: [
        'Mỗi trạng thái xuất hiện là một khoá; giá trị là số đơn có trạng thái đó.',
        'Trạng thái chưa xuất hiện thì KHÔNG có khoá (không phải khoá với giá trị 0).',
        `Dùng ${c('dem[don.trangThai]')}; xử lý lần gặp đầu (giá trị đang là ${c('undefined')}).`,
        `Hàm thứ hai ${c('layTruong(obj, tenTruong)')} trả về ${c('obj[tenTruong]')}, hoặc ${c('null')} nếu object không có trường đó.`,
      ],
      dauVao: 'dsDon: mảng { ma, trangThai: string }; obj: object; tenTruong: string.',
      dauRa: 'demTheoTrangThai → object; layTruong → giá trị hoặc null.',
      rangBuoc: ['Không viết cứng tên trạng thái (moi, dangGiao…) trong code — trạng thái mới phải tự đếm được.'],
      viDu: [
        { input: 'demTheoTrangThai([{ ma: 1, trangThai: "moi" }, { ma: 2, trangThai: "daGiao" }, { ma: 3, trangThai: "moi" }])', output: '{ moi: 2, daGiao: 1 }', explanation: 'Không có đơn "dangGiao" nên không có khoá đó.' },
        { input: 'layTruong({ ten: "Lan", tuoi: 0 }, "tuoi")', output: '0', explanation: 'Giá trị 0 vẫn trả về 0 — đừng nhầm với "không có".' },
        { input: 'layTruong({ ten: "Lan" }, "email")', output: 'null', explanation: 'Trường thiếu ⇒ obj["email"] là undefined ⇒ trả về null.' },
      ],
      goiY: [
        'const dem = {}; for (const don of dsDon) { const k = don.trangThai; dem[k] = (dem[k] ?? 0) + 1; } return dem;',
        'layTruong: return obj[tenTruong] ?? null; — ?? giữ được 0 và "" (|| thì không).',
      ],
      khoiDau: {
        'main.js': `// Bài 4.4 — Khoá động
function demTheoTrangThai(dsDon) {
  const dem = {};
  for (const don of dsDon) {
    dem.trangThai = dem.trangThai + 1;
  }
  return dem;
}

function layTruong(obj, tenTruong) {
  return obj.tenTruong || null;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.4 — Khoá động
function demTheoTrangThai(dsDon) {
  const dem = {};
  for (const don of dsDon) {
    const khoa = don.trangThai;          // tên khoá nằm trong BIẾN
    // dem[khoa] lần đầu là undefined ⇒ ?? 0 cho nó điểm xuất phát
    dem[khoa] = (dem[khoa] ?? 0) + 1;    // ngoặc vuông: dùng GIÁ TRỊ của biến làm tên khoá
  }
  return dem;
}

function layTruong(obj, tenTruong) {
  // obj.tenTruong tìm khoá tên đúng là chữ "tenTruong"; obj[tenTruong] dùng giá trị biến.
  // ?? (không phải ||) để giữ 0, "" và false là giá trị thật.
  return obj[tenTruong] ?? null;
}
`,
      },
      giaiThich: `<p>${c('obj.ten')} luôn tìm khoá có tên đúng là chữ ${c('"ten"')}; ${c('obj[bieu_thuc]')} tính biểu thức trước rồi dùng kết quả làm tên khoá. Khi tên khoá chỉ biết lúc chạy (đọc từ dữ liệu, từ ô nhập, từ URL), ngoặc vuông là cách duy nhất.</p>
<p>Lần đầu gặp một trạng thái, ${c('dem[khoa]')} là ${c('undefined')} — và ${c('undefined + 1')} là ${c('NaN')}. ${c('(dem[khoa] ?? 0) + 1')} cho nó điểm xuất phát. Máy chấm đếm cả trạng thái lạ chưa có trong ví dụ và kiểm ${c('layTruong')} với giá trị 0 / chuỗi rỗng.</p>`,
      loiHayGap: [
        `Dùng ${c('dem.trangThai')} — mọi đơn được đếm vào một khoá tên "trangThai".`,
        `Khởi tạo sẵn ${c('{ moi: 0, dangGiao: 0, daGiao: 0 }')} — trạng thái mới (vd "huy") không được đếm, và thừa khoá giá trị 0.`,
        `${c('obj[tenTruong] || null')} — trường có giá trị 0 hoặc "" bị biến thành null.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors#bracket_notation',
      kiem: [
        { moTa: 'Đếm ba đơn', goi: 'demTheoTrangThai([{ ma: 1, trangThai: "moi" }, { ma: 2, trangThai: "daGiao" }, { ma: 3, trangThai: "moi" }])', mongDoi: { moi: 2, daGiao: 1 } },
        { moTa: 'Trạng thái lạ cũng được đếm', goi: 'demTheoTrangThai([{ trangThai: "huy" }, { trangThai: "huy" }, { trangThai: "dangGiao" }])', mongDoi: { huy: 2, dangGiao: 1 } },
        { moTa: 'Không đơn nào → {}', goi: 'demTheoTrangThai([])', mongDoi: {} },
        { moTa: 'layTruong có trường', goi: 'layTruong({ ten: "Lan" }, "ten")', mongDoi: 'Lan' },
        { moTa: 'layTruong giữ 0 và ""', goi: '[layTruong({ a: 0 }, "a"), layTruong({ b: "" }, "b")]', mongDoi: [0, ''] },
        { moTa: 'layTruong thiếu trường → null', goi: 'layTruong({ ten: "Lan" }, "email")', mongDoi: null },
        { moTa: 'Dùng ngoặc vuông với biến', kiem: 'ma-nguon', tep: 'main.js', khop: '\\w\\[\\s*[a-zA-Z_][\\w.]*\\s*\\]' },
        { moTa: 'Không viết cứng tên trạng thái', kiem: 'ma-nguon', tep: 'main.js', khop: '["\'](moi|dangGiao|daGiao)["\']|\\b(moi|dangGiao|daGiao)\\s*:', phuDinh: true, an: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Bản chép nông: sửa một bài thì bài gốc cũng đổi',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['spread {...obj}', 'bản chép nông', 'tham chiếu dùng chung', 'structuredClone', 'không đột biến'],
      tienQuyet: ['object', 'mảng'],
      the: ['javascript', 'object', 'immutability', 'spread'],
      moTa: `<p>Bài 4.4, mục <em>"Bẫy — chép một object bằng {...obj} rồi sửa thứ nằm sâu hơn một tầng"</em>. Trình soạn blog có nút "nhân bản bài viết rồi gắn thêm thẻ". Người dùng phàn nàn: gắn thẻ cho bản nhân bản thì <strong>bài gốc cũng có thẻ đó</strong>. Sửa ${c('themThe(baiViet, the)')} để trả về một bài MỚI có thêm thẻ, bài gốc nguyên vẹn; và viết ${c('nhanBanSau(baiViet)')} chép sâu mọi tầng.</p>`,
      yeuCau: [
        `${c('themThe(bai, "js")')} trả về object mới: mọi trường như bài gốc, ${c('the')} có thêm ${c('"js"')} ở cuối.`,
        `Bài gốc (kể cả mảng ${c('the')} của nó) không đổi; kết quả không phải cùng object với bài gốc.`,
        `${c('nhanBanSau(bai)')} trả về bản chép SÂU: sửa ${c('banSao.tacGia.ten')} không làm đổi bài gốc — dùng ${c('structuredClone')}.`,
      ],
      dauVao: 'baiViet: { tieuDe: string, the: string[], tacGia: { ten: string } }; the: string.',
      dauRa: 'object mới.',
      rangBuoc: ['Không dùng push trên mảng của bài gốc.', 'Không dùng JSON.parse(JSON.stringify(...)) (chưa học, và làm mất kiểu Date).'],
      viDu: [
        { input: 'const goc = { tieuDe: "A", the: ["web"], tacGia: { ten: "Lan" } };\nconst moi = themThe(goc, "js");\n[goc.the, moi.the]', output: '[["web"], ["web", "js"]]', explanation: 'Mảng the của bài mới là một mảng MỚI.' },
        { input: 'const ban = nhanBanSau(goc);\nban.tacGia.ten = "Minh";\ngoc.tacGia.ten', output: '"Lan"', explanation: 'Bản chép sâu không dùng chung object tacGia.' },
      ],
      goiY: [
        '{...bai} chỉ chép tầng ngoài: bai.the và ban.the vẫn là CÙNG một mảng. Phải tạo mảng mới cho trường the: [...bai.the, the].',
        'return { ...baiViet, the: [...baiViet.the, the] }; — nhanBanSau: return structuredClone(baiViet);',
      ],
      khoiDau: {
        'main.js': `// Bài 4.4 — Bản chép nông
function themThe(baiViet, the) {
  const banSao = { ...baiViet };
  banSao.the.push(the);
  return banSao;
}

function nhanBanSau(baiViet) {
  return { ...baiViet };
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.4 — Bản chép nông
function themThe(baiViet, the) {
  // {...baiViet} chép tầng NGOÀI; trường the vẫn trỏ vào mảng CŨ.
  // Nên tạo luôn mảng mới cho đúng tầng mình định sửa: [...mảngCũ, phầnTửMới]
  return { ...baiViet, the: [...baiViet.the, the] };
}

function nhanBanSau(baiViet) {
  // structuredClone chép MỌI tầng: object/mảng lồng bên trong cũng là bản mới
  return structuredClone(baiViet);
}
`,
      },
      giaiThich: `<p>Spread ${c('{...a}')} tạo object mới và chép <em>giá trị</em> từng trường. Với trường là mảng hay object, giá trị đó là một <em>tham chiếu</em> — nên bản chép và bản gốc cùng trỏ một mảng ${c('the')}. ${c('push')} vào mảng chung thì cả hai cùng thấy. Đây là lỗi "sửa một mục thì mọi mục cùng đổi" mà bài học cảnh báo — và là lý do React đòi bạn tạo mảng mới thay vì push.</p>
<p>Hai cách sửa: chép tường minh đúng tầng cần đổi (${c('the: [...bai.the, the]')} — nhẹ, phổ biến nhất), hoặc chép sâu toàn bộ (${c('structuredClone')}). Máy chấm kiểm mảng gốc không đổi, ${c('moi !== goc')}, ${c('moi.the !== goc.the')}, và độc lập của ${c('tacGia')} trong bản chép sâu.</p>`,
      loiHayGap: [
        `${c('const ban = baiViet')} — không chép gì cả, chỉ thêm một tên cho cùng object.`,
        `${c('{ ...baiViet, the: baiViet.the.push(the) }')} — push trả về ĐỘ DÀI mới (một số), và vẫn sửa mảng gốc.`,
        `Tưởng ${c('{...obj}')} chép sâu.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone',
      kiem: [
        { moTa: 'Bài mới có thêm thẻ ở cuối', chuanBi: 'const goc = { tieuDe: "A", the: ["web"], tacGia: { ten: "Lan" } }; const moi = themThe(goc, "js");', goi: 'moi', mongDoi: { tieuDe: 'A', the: ['web', 'js'], tacGia: { ten: 'Lan' } } },
        { moTa: 'Mảng thẻ của bài gốc không đổi', chuanBi: 'const goc = { tieuDe: "A", the: ["web"], tacGia: { ten: "Lan" } }; themThe(goc, "js");', goi: 'goc.the', mongDoi: ['web'] },
        { moTa: 'Kết quả là object mới, mảng mới', chuanBi: 'const goc = { tieuDe: "A", the: ["web"], tacGia: { ten: "Lan" } }; const moi = themThe(goc, "js");', goi: '[moi !== goc, moi.the !== goc.the]', mongDoi: [true, true] },
        { moTa: 'Bản chép sâu độc lập ở tầng tacGia', chuanBi: 'const goc = { tieuDe: "A", the: ["web"], tacGia: { ten: "Lan" } }; const ban = nhanBanSau(goc); ban.tacGia.ten = "Minh"; ban.the.push("x");', goi: '[goc.tacGia.ten, goc.the.length, ban.tacGia.ten]', mongDoi: ['Lan', 1, 'Minh'] },
        { moTa: 'Thêm hai thẻ liên tiếp', chuanBi: 'const goc = { tieuDe: "B", the: [], tacGia: { ten: "Hà" } }; const m = themThe(themThe(goc, "a"), "b");', goi: '[goc.the, m.the]', mongDoi: [[], ['a', 'b']], an: true },
        { moTa: 'Không dùng JSON.parse(JSON.stringify())', kiem: 'ma-nguon', tep: 'main.js', khop: 'JSON\\.parse', phuDinh: true, an: true },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Thống kê lớp học: chuỗi filter, map, reduce',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['filter', 'map', 'reduce', 'Math.round', 'object kết quả'],
      tienQuyet: ['map', 'filter', 'reduce'],
      the: ['javascript', 'array', 'data-processing'],
      moTa: `<p>Ba phương thức của Bài 4.4 ghép lại là đủ cho hầu hết báo cáo dữ liệu. Viết ${c('thongKeLop(dsSV, lop)')} trả về thống kê của MỘT lớp:</p>
<pre><code>{ siSo, soDat, diemTB, danhSachDat }</code></pre>
<p>Đạt là ${c('diem >= 5')}. ${c('diemTB')} là trung bình điểm của cả lớp, làm tròn 2 chữ số thập phân (${c('Math.round(x * 100) / 100')}); lớp không có ai → ${c('diemTB: null')}. ${c('danhSachDat')} là mảng tên người đạt, theo thứ tự gốc.</p>
<pre><code>const ds = ${SV};</code></pre>`,
      yeuCau: [
        `Chỉ tính sinh viên thuộc ${c('lop')} (lọc trước).`,
        `${c('siSo')}, ${c('soDat')}: số nguyên; ${c('diemTB')}: làm tròn 2 chữ số hoặc ${c('null')}; ${c('danhSachDat')}: mảng tên.`,
        `Dùng ${c('filter')}, ${c('map')}, ${c('reduce')} — không vòng lặp ${c('for')}.`,
      ],
      dauVao: 'dsSV: mảng { ten, diem: number, lop }; lop: string.',
      dauRa: 'object { siSo: number, soDat: number, diemTB: number|null, danhSachDat: string[] }.',
      rangBuoc: ['Không sửa mảng đầu vào.', 'Không dùng for / while.'],
      viDu: [
        { input: 'thongKeLop(ds, "SE1")', output: '{ siSo: 2, soDat: 2, diemTB: 7.25, danhSachDat: ["Lan", "Hà"] }', explanation: '(8.5 + 6) / 2 = 7.25.' },
        { input: 'thongKeLop(ds, "SE9")', output: '{ siSo: 0, soDat: 0, diemTB: null, danhSachDat: [] }', explanation: 'Không chia cho 0 — lớp rỗng thì diemTB là null.' },
      ],
      goiY: [
        'const trongLop = dsSV.filter(sv => sv.lop === lop); rồi mọi thứ khác tính trên trongLop.',
        'const tong = trongLop.reduce((s, sv) => s + sv.diem, 0); const diemTB = trongLop.length === 0 ? null : Math.round(tong / trongLop.length * 100) / 100;',
      ],
      khoiDau: {
        'main.js': `// Bài 4.4 — Thống kê lớp
function thongKeLop(dsSV, lop) {
  const tong = dsSV.reduce((s, sv) => s + sv.diem, 0);
  return {
    siSo: dsSV.length,
    soDat: 0,
    diemTB: tong / dsSV.length,
    danhSachDat: [],
  };
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.4 — Thống kê lớp
function thongKeLop(dsSV, lop) {
  // 1) Lọc đúng lớp TRƯỚC — mọi con số sau đều tính trên nhóm này
  const trongLop = dsSV.filter(sv => sv.lop === lop);

  // 2) Những người đạt (diem >= 5), rồi lấy tên — giữ thứ tự gốc
  const dat = trongLop.filter(sv => sv.diem >= 5);
  const danhSachDat = dat.map(sv => sv.ten);

  // 3) Trung bình: reduce ra tổng; lớp rỗng thì không chia (tránh NaN)
  const tong = trongLop.reduce((s, sv) => s + sv.diem, 0);
  const diemTB = trongLop.length === 0
    ? null
    : Math.round((tong / trongLop.length) * 100) / 100;   // làm tròn 2 chữ số

  return { siSo: trongLop.length, soDat: dat.length, diemTB, danhSachDat };
}
`,
      },
      giaiThich: `<p>Thứ tự là chìa khoá: lọc theo lớp TRƯỚC, rồi mọi phép đếm/trung bình làm trên nhóm đã lọc — bản cũ tính trên cả trường. Mỗi bước một phương thức, một mảng mới, không biến cộng dồn nào trôi nổi: dễ đọc và dễ kiểm từng bước bằng ${c('console.log')}.</p>
<p>Lớp rỗng là ca biên kinh điển: ${c('0 / 0')} là ${c('NaN')}, và ${c('NaN')} sẽ lan khắp báo cáo. Trả ${c('null')} nói rõ "không có dữ liệu". ${c('{ siSo: …, diemTB, danhSachDat }')} dùng cú pháp viết tắt — tên biến trùng tên khoá. Máy chấm thử hai lớp, lớp rỗng, lớp ẩn có trung bình cần làm tròn (${c('6.666…')} → ${c('6.67')}).</p>`,
      loiHayGap: [
        'Tính trung bình trên cả danh sách thay vì lớp đã lọc.',
        `Làm tròn bằng ${c('toFixed(2)')} — trả về CHUỖI ${c('"7.25"')}, không phải số.`,
        `Lớp rỗng ra ${c('NaN')} hoặc ném lỗi.`,
      ],
      thamKhao: 'https://javascript.info/array-methods',
      kiem: [
        { moTa: 'Thống kê lớp SE1', goi: `thongKeLop(${SV.replace(/\s+/g, ' ')}, "SE1")`, mongDoi: { siSo: 2, soDat: 2, diemTB: 7.25, danhSachDat: ['Lan', 'Hà'] } },
        { moTa: 'Lớp SE2 (có người trượt)', goi: `thongKeLop(${SV.replace(/\s+/g, ' ')}, "SE2")`, mongDoi: { siSo: 1, soDat: 0, diemTB: 4, danhSachDat: [] } },
        { moTa: 'Lớp không tồn tại', goi: `thongKeLop(${SV.replace(/\s+/g, ' ')}, "SE9")`, mongDoi: { siSo: 0, soDat: 0, diemTB: null, danhSachDat: [] } },
        { moTa: 'Làm tròn 2 chữ số: 6.67', goi: 'thongKeLop([{ ten: "A", diem: 5, lop: "X" }, { ten: "B", diem: 7, lop: "X" }, { ten: "C", diem: 8, lop: "X" }, { ten: "D", diem: 1, lop: "Y" }], "X")', mongDoi: { siSo: 3, soDat: 3, diemTB: 6.67, danhSachDat: ['A', 'B', 'C'] }, an: true },
        { moTa: 'Biên đạt: 5 là đạt, 4.99 là trượt', goi: 'thongKeLop([{ ten: "A", diem: 5, lop: "X" }, { ten: "B", diem: 4.99, lop: "X" }], "X").danhSachDat', mongDoi: ['A'] },
        { moTa: 'Không dùng for / while', kiem: 'ma-nguon', tep: 'main.js', khop: '\\b(for|while)\\s*\\(', phuDinh: true },
        { moTa: 'Dùng reduce', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.reduce\\s*\\(' },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Tự viết groupBy: gom mảng theo khoá hoặc theo hàm',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['reduce ra object', 'khoá động', 'hàm làm đối số', 'typeof', 'không đột biến'],
      tienQuyet: ['reduce', 'bracket notation', 'callback'],
      the: ['javascript', 'array', 'object', 'reduce', 'utility'],
      moTa: `<p>Bài tổng hợp 4.4. Gom dữ liệu theo nhóm là việc làm mỗi ngày: đơn theo trạng thái, bài theo tháng, sinh viên theo lớp. Viết ${c('nhomTheo(ds, khoa)')} — phiên bản tự cài của ${c('Object.groupBy')}:</p>
<ul><li>${c('khoa')} là <strong>chuỗi</strong> ⇒ nhóm theo giá trị trường đó: ${c('nhomTheo(sv, "lop")')}.</li>
<li>${c('khoa')} là <strong>hàm</strong> ⇒ nhóm theo giá trị hàm trả về: ${c('nhomTheo(sv, s => s.diem >= 5 ? "dat" : "truot")')}.</li></ul>
<p>Kết quả: object mà mỗi khoá là một nhóm, giá trị là mảng các phần tử thuộc nhóm, giữ thứ tự gốc.</p>`,
      yeuCau: [
        'Hỗ trợ cả khoá chuỗi lẫn khoá hàm (kiểm bằng typeof).',
        'Mỗi nhóm giữ thứ tự xuất hiện ban đầu; phần tử trong nhóm là CHÍNH object gốc (không chép).',
        `Không sửa mảng ${c('ds')}; ${c('ds')} rỗng → ${c('{}')}.`,
        `Khoá không phải chuỗi/hàm → ném ${c('TypeError')} với thông điệp chứa ${c('"khoa"')}.`,
        `Không dùng ${c('Object.groupBy')} có sẵn.`,
      ],
      dauVao: 'ds: mảng; khoa: string | function.',
      dauRa: 'object { [tenNhom]: mảng phần tử }.',
      rangBuoc: ['Không dùng thư viện, không dùng Object.groupBy / Map.groupBy.'],
      viDu: [
        { input: `nhomTheo(${SV.replace(/\s+/g, ' ')}, "lop")`, output: '{ SE1: [Lan, Hà], SE2: [Minh] }', explanation: '(viết tắt — mỗi phần tử là cả object sinh viên).' },
        { input: 'nhomTheo([1, 2, 3, 4, 5], n => n % 2 === 0 ? "chan" : "le")', output: '{ le: [1, 3, 5], chan: [2, 4] }', explanation: 'Khoá hàm: tên nhóm là giá trị hàm trả về.' },
        { input: 'nhomTheo([1], 42)', output: 'TypeError: khoa phải là chuỗi hoặc hàm', explanation: 'Chốt chặn đầu vào.' },
      ],
      goiY: [
        'Bước 1: biến khoa thành MỘT hàm layKhoa: typeof khoa === "function" ? khoa : (x => x[khoa]). Từ đó trở đi chỉ còn một trường hợp.',
        'return ds.reduce((nhom, x) => { const k = layKhoa(x); (nhom[k] ??= []).push(x); return nhom; }, {}); — hoặc viết if (!nhom[k]) nhom[k] = []; cho dễ đọc.',
      ],
      khoiDau: {
        'main.js': `// Bài 4.4 — groupBy tự viết
function nhomTheo(ds, khoa) {
  const ketQua = {};
  for (const x of ds) {
    ketQua[khoa] = x;
  }
  return ketQua;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 4.4 — groupBy tự viết
function nhomTheo(ds, khoa) {
  // Chuẩn hoá hai kiểu "khoa" về MỘT hàm — phần còn lại chỉ phải lo một trường hợp
  let layKhoa;
  if (typeof khoa === "function") {
    layKhoa = khoa;
  } else if (typeof khoa === "string") {
    layKhoa = (x) => x[khoa];          // khoá động: dùng giá trị của biến khoa
  } else {
    throw new TypeError("khoa phải là chuỗi hoặc hàm");
  }

  // reduce gộp cả mảng thành MỘT object; giá trị khởi đầu {} là object rỗng MỚI
  return ds.reduce((nhom, x) => {
    const k = layKhoa(x);
    if (nhom[k] === undefined) {
      nhom[k] = [];                     // lần đầu gặp nhóm này
    }
    nhom[k].push(x);                    // push vào mảng của KẾT QUẢ, không đụng ds
    return nhom;                        // quên dòng này ⇒ lượt sau nhom là undefined
  }, {});
}
`,
      },
      giaiThich: `<p>Mẹo thiết kế: thay vì rải ${c('if (typeof khoa === "string")')} khắp thân hàm, chuẩn hoá đầu vào về một dạng ngay từ đầu (khoá chuỗi thành hàm ${c('x => x[khoa]')}). Phần lõi khi đó chỉ có một đường đi — ít chỗ sai hơn.</p>
<p>${c('reduce')} với giá trị khởi đầu ${c('{}')} là khuôn chuẩn để "gộp mảng thành object". Hàm gộp phải ${c('return nhom')} mỗi lượt. ${c('push')} ở đây hợp lệ vì nó sửa mảng của <em>kết quả</em> do chính ta tạo, không phải dữ liệu người gọi đưa vào. Máy chấm kiểm thứ tự trong nhóm, ${c('=== ')} object gốc, mảng đầu vào không đổi, và TypeError cho khoá sai.</p>`,
      loiHayGap: [
        `Quên ${c('return nhom')} trong hàm gộp — lượt thứ hai ném TypeError (đọc thuộc tính của undefined).`,
        `${c('nhom[k] = [x]')} mỗi lượt — mỗi nhóm chỉ còn phần tử cuối.`,
        `Dùng ${c('nhom.k')} thay vì ${c('nhom[k]')} — mọi thứ dồn vào một nhóm tên "k".`,
        `Chép phần tử (${c('{...x}')}) vào nhóm — đề yêu cầu giữ chính object gốc.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy',
      kiem: [
        { moTa: 'Nhóm theo khoá chuỗi "lop"', goi: `nhomTheo(${SV.replace(/\s+/g, ' ')}, "lop")`, mongDoi: { SE1: [{ ten: 'Lan', diem: 8.5, lop: 'SE1' }, { ten: 'Hà', diem: 6, lop: 'SE1' }], SE2: [{ ten: 'Minh', diem: 4, lop: 'SE2' }] } },
        { moTa: 'Nhóm theo khoá hàm', goi: 'nhomTheo([1, 2, 3, 4, 5], n => n % 2 === 0 ? "chan" : "le")', mongDoi: { le: [1, 3, 5], chan: [2, 4] } },
        { moTa: 'Mảng rỗng → {}', goi: 'nhomTheo([], "lop")', mongDoi: {} },
        { moTa: 'Phần tử trong nhóm là CHÍNH object gốc', chuanBi: 'const a = { t: "x" }; const r = nhomTheo([a], "t");', goi: 'r.x[0] === a', mongDoi: true },
        { moTa: 'Mảng đầu vào không đổi', chuanBi: 'const ds = [{ t: "x" }, { t: "y" }]; nhomTheo(ds, "t");', goi: 'ds', mongDoi: [{ t: 'x' }, { t: 'y' }] },
        { moTa: 'Khoá sai → TypeError', goi: 'nhomTheo([1], 42)', mongDoi: { loi: 'TypeError', thongDiep: 'khoa' } },
        { moTa: 'Nhóm theo độ dài chuỗi (thứ tự trong nhóm)', goi: 'nhomTheo(["an", "binh", "chi", "dung", "em", "hoang"], s => s.length)', mongDoi: { 2: ['an', 'em'], 3: ['chi'], 4: ['binh', 'dung'], 5: ['hoang'] }, an: true },
        { moTa: 'Không dùng Object.groupBy', kiem: 'ma-nguon', tep: 'main.js', khop: '\\b(Object|Map)\\.groupBy', phuDinh: true },
      ],
    },
  ],
});
