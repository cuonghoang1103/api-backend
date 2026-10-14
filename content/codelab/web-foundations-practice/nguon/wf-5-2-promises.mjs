/** Bộ luyện bài 5.2 — Promise. Lược đồ: ./_luoc-do.mjs (loại 'js'). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const GIO_GIA = '<p><em>Máy chấm dùng đồng hồ GIẢ: các khoảng trễ là thật về thứ tự và thời điểm, nhưng bạn không phải chờ.</em></p>';
const API_NOTE = '<p><code>api.js</code> là "máy chủ giả" có sẵn — <strong>đừng sửa</strong>; nó được nạp trước <code>main.js</code> nên các hàm của nó gọi được trực tiếp.</p>';

const API_NGUOI_DUNG = `// api.js — MÁY CHỦ GIẢ, đừng sửa. Mỗi hàm trả về Promise sau một khoảng trễ.
const NGUOI_DUNG = {
  1: { id: 1, ten: "Lan", tuoi: 25 },
  2: { id: 2, ten: "Minh", tuoi: 30 },
};

function layNguoiDung(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const u = NGUOI_DUNG[id];
      if (u) resolve({ ...u });
      else reject(new Error(´Không tìm thấy người dùng @{id}´));
    }, 100);
  });
}
`;

const API_BAI = `// api.js — MÁY CHỦ GIẢ, đừng sửa.
const KHO_BAI = {};
let soBai = 0;

// Lưu một bài, trả về Promise<id> sau 100 ms. Nội dung rỗng ⇒ reject.
function luuBai(noiDung) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!noiDung) return reject(new Error("Nội dung trống"));
      soBai = soBai + 1;
      KHO_BAI[soBai] = noiDung;
      resolve(soBai);
    }, 100);
  });
}

// Đọc một bài theo id, trả về Promise<string> sau 50 ms.
function docBai(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (KHO_BAI[id] === undefined) return reject(new Error(´Không có bài @{id}´));
      resolve(KHO_BAI[id]);
    }, 50);
  });
}
`;

const API_TEP = `// api.js — API kiểu CALLBACK cũ (kiểu Node.js), đừng sửa.
// cb(loi, duLieu): thành công ⇒ loi = null; thất bại ⇒ loi là một Error.
const O_DIA = { "ghi-chu.txt": "Học Promise", "rong.txt": "" };

function docTepCallback(ten, cb) {
  setTimeout(() => {
    if (!(ten in O_DIA)) cb(new Error(´ENOENT: không có tệp @{ten}´));
    else cb(null, O_DIA[ten]);
  }, 30);
}
`;

const API_DON = `// api.js — MÁY CHỦ GIẢ của cửa hàng, đừng sửa.
const KHO = { BUT: { ma: "BUT", ten: "Bút bi", gia: 5000, ton: 100 }, VO: { ma: "VO", ten: "Vở", gia: 12000, ton: 0 } };
let soDon = 0;

// Promise<sanPham> — hết hàng / không có mã ⇒ reject
function kiemTraKho(ma, soLuong) {
  return new Promise((resolve, reject) => setTimeout(() => {
    const sp = KHO[ma];
    if (!sp) return reject(new Error(´Không có sản phẩm @{ma}´));
    if (sp.ton < soLuong) return reject(new Error("Hết hàng"));
    resolve(sp);
  }, 40));
}

// Promise<number> — số lượng <= 0 ⇒ reject
function tinhTien(sp, soLuong) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (!(soLuong > 0)) return reject(new Error("Số lượng không hợp lệ"));
    resolve(sp.gia * soLuong);
  }, 20));
}

// Promise<{ maDon, tien }>
function taoDon(tien) {
  return new Promise((resolve) => setTimeout(() => {
    soDon = soDon + 1;
    resolve({ maDon: ´DH-@{soDon}´, tien });
  }, 30));
}
`;

export default doiDau({
  slug: 'wf-5-2-promises',
  ten: '5.2 Promise: một giá trị đến sau',
  baiHoc: 'Nền tảng Web — Bài 5.2 Promise: một giá trị đến sau',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Ba trạng thái pending / fulfilled / rejected, new Promise, .then / .catch / .finally, chuỗi then phẳng và cái bẫy quên return, bọc API callback thành Promise, settle một lần — 7 bài, máy chấm chạy với đồng hồ giả.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Tự tạo Promise: hàm cho(ms) chờ một lúc rồi trả giá trị',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['new Promise', 'resolve', 'setTimeout', 'Promise trả về giá trị'],
      tienQuyet: ['setTimeout', 'arrow function'],
      the: ['javascript', 'promise'],
      moTa: `<p>Bài 5.2 có đúng một dòng tạo Promise bằng tay: ${c('const wait = ms => new Promise(resolve => setTimeout(resolve, ms));')}. Viết ${c('cho(ms, giaTri)')} mạnh hơn một chút: trả về Promise được ${c('fulfilled')} sau ${c('ms')} mili-giây với giá trị ${c('giaTri')}. Code khởi đầu gọi ${c('setTimeout')} nhưng không trả về gì — người gọi không có thứ gì để ${c('.then')}.</p>
${GIO_GIA}`,
      yeuCau: [
        `${c('cho(ms)')} trả về một ${c('Promise')} (kiểm bằng ${c('instanceof Promise')}).`,
        `Promise fulfilled đúng sau ${c('ms')} ms với giá trị ${c('giaTri')} (vắng ⇒ ${c('undefined')}).`,
        `${c('cho(0, "x")')} vẫn bất đồng bộ (đi qua hàng đợi).`,
      ],
      dauVao: 'ms: number >= 0; giaTri: bất kỳ (tuỳ chọn).',
      dauRa: 'Promise<giaTri>.',
      rangBuoc: ['Không dùng async/await (Bài 5.3).'],
      viDu: [
        { input: 'cho(250, "xong").then(v => console.log(v))', output: 'xong   (sau 250 ms)', explanation: 'resolve(giaTri) được gọi trong callback của setTimeout.' },
        { input: 'cho(10) instanceof Promise', output: 'true', explanation: 'Trả về Promise ngay, giá trị đến sau.' },
      ],
      goiY: [
        'return new Promise((resolve) => { … }); — hàm truyền vào new Promise chạy NGAY, và resolve là "nút bấm" để báo xong.',
        'return new Promise((resolve) => setTimeout(() => resolve(giaTri), ms));',
      ],
      khoiDau: {
        'main.js': `// Bài 5.2 — Tự tạo Promise
function cho(ms, giaTri) {
  setTimeout(() => {
    return giaTri;
  }, ms);
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.2 — Tự tạo Promise
function cho(ms, giaTri) {
  // Trả về Promise NGAY (trạng thái pending); setTimeout bấm "resolve" sau ms mili-giây.
  // return bên trong callback của setTimeout không đi tới đâu — phải dùng resolve.
  return new Promise((resolve) => {
    setTimeout(() => resolve(giaTri), ms);
  });
}
`,
      },
      giaiThich: `<p>${c('return giaTri')} bên trong callback của setTimeout trả giá trị về cho... setTimeout, kẻ bỏ qua nó. Hàm ${c('cho')} đã kết thúc từ lâu và trả về ${c('undefined')}. Promise giải quyết đúng chuyện này: hàm trả về <em>ngay</em> một object đại diện cho giá trị tương lai, và ${c('resolve')} là cách "giao hàng" khi giá trị có.</p>
<p>Máy chấm đo bằng đồng hồ giả: ${c('await cho(250)')} phải tốn đúng 250 ms ảo, và giá trị phải đi qua.</p>`,
      loiHayGap: [
        `${c('setTimeout(resolve(giaTri), ms)')} — gọi resolve NGAY, không chờ.`,
        'Quên return trước new Promise — hàm vẫn trả về undefined.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise',
      kiem: [
        { moTa: 'Trả về một Promise', goi: 'cho(10) instanceof Promise', mongDoi: true },
        { moTa: 'Giá trị đi qua', goi: 'await cho(50, "xong")', mongDoi: 'xong' },
        { moTa: 'Chờ đúng 250 ms', chuanBi: 'const t = Date.now(); await cho(250);', goi: 'Date.now() - t', mongDoi: 250 },
        { moTa: 'Không truyền giá trị → undefined', goi: 'await cho(5)', mongDoi: { $js: 'undefined' } },
        { moTa: 'cho(0) vẫn bất đồng bộ', chuanBi: 'const log = []; cho(0, "p").then((v) => log.push(v)); log.push("dong-bo"); await cho(1);', goi: 'log', mongDoi: ['dong-bo', 'p'], an: true },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: '.then, .catch và .finally: mô tả một người dùng',
      doKho: 'EASY', phut: 12, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['.then', '.catch', '.finally', 'rejected'],
      tienQuyet: ['Promise'],
      the: ['javascript', 'promise', 'error-handling'],
      moTa: `<p>Bài 5.2: <em>"then chạy khi fulfilled, catch khi rejected, finally chạy dù thế nào."</em> Viết ${c('moTaNguoiDung(id)')} dùng ${c('layNguoiDung(id)')} của máy chủ giả, trả về một Promise của chuỗi:</p>
<ul><li>thành công: ${c('"Lan (25 tuổi)"')}</li>
<li>thất bại: ${c('"Lỗi: <thông điệp lỗi>"')} — Promise vẫn FULFILLED với chuỗi này, không reject</li>
<li>dù thế nào cũng in ${c('"Đã tải xong <id>"')} bằng ${c('.finally')}.</li></ul>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `Thành công → ${c('"<ten> (<tuoi> tuổi)"')}.`,
        `Thất bại → ${c('"Lỗi: Không tìm thấy người dùng 9"')} (dùng ${c('err.message')}).`,
        `${c('.finally')} in ${c('"Đã tải xong <id>"')} trong cả hai trường hợp.`,
        `Dùng ${c('.then / .catch / .finally')}, không async/await.`,
      ],
      dauVao: 'id: number.',
      dauRa: 'Promise<string>.',
      rangBuoc: ['Không sửa api.js.', 'Không dùng async/await.'],
      viDu: [
        { input: 'moTaNguoiDung(1).then(console.log)', output: 'Đã tải xong 1\nLan (25 tuổi)', explanation: 'finally chạy trước then gắn SAU nó (nó nằm trước trong chuỗi).' },
        { input: 'moTaNguoiDung(9).then(console.log)', output: 'Đã tải xong 9\nLỗi: Không tìm thấy người dùng 9', explanation: 'catch "chữa" lỗi thành một chuỗi bình thường.' },
      ],
      goiY: [
        'return layNguoiDung(id).then(u => …).catch(err => …).finally(() => …); — giá trị return trong catch thành giá trị FULFILLED của chuỗi.',
        '.then((u) => ´@{u.ten} (@{u.tuoi} tuổi)´).catch((err) => ´Lỗi: @{err.message}´).finally(() => console.log(´Đã tải xong @{id}´))',
      ],
      khoiDau: {
        'api.js': API_NGUOI_DUNG,
        'main.js': `// Bài 5.2 — then / catch / finally
function moTaNguoiDung(id) {
  return layNguoiDung(id).then((u) => {
    console.log(u.ten + " (" + u.tuoi + " tuổi)");
  });
}
`,
      },
      loiGiai: {
        'api.js': API_NGUOI_DUNG,
        'main.js': `// Bài 5.2 — then / catch / finally
function moTaNguoiDung(id) {
  return layNguoiDung(id)
    // fulfilled: biến object người dùng thành chuỗi mô tả (RETURN, đừng chỉ log)
    .then((u) => ´@{u.ten} (@{u.tuoi} tuổi)´)
    // rejected: chữa lỗi thành một chuỗi — chuỗi Promise từ đây lại fulfilled
    .catch((err) => ´Lỗi: @{err.message}´)
    // luôn chạy; KHÔNG đổi giá trị đang đi qua chuỗi
    .finally(() => console.log(´Đã tải xong @{id}´));
}
`,
      },
      giaiThich: `<p>Mỗi ${c('.then')}/${c('.catch')}/${c('.finally')} trả về một Promise mới. Giá trị ${c('return')} trong ${c('.then')} hoặc ${c('.catch')} thành giá trị của Promise mới; ${c('.finally')} thì để giá trị cũ đi qua nguyên vẹn. Vì ${c('.catch')} trả về chuỗi, cả chuỗi kết thúc fulfilled — người gọi không phải bắt lỗi nữa.</p>
<p>Bản cũ ${c('console.log')} thay vì ${c('return')}: người gọi nhận ${c('undefined')}. Máy chấm kiểm giá trị trả về và các dòng in của cả hai trường hợp.</p>`,
      loiHayGap: [
        'log trong then thay vì return — Promise trả về undefined.',
        'Đặt catch TRƯỚC then — lỗi bị chữa xong thì then nhận chuỗi lỗi và cố đọc u.ten.',
        `Trả về ${c('err')} thay vì ${c('err.message')} — chuỗi thành "Lỗi: Error: …".`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally',
      kiem: [
        { moTa: 'Thành công → "Lan (25 tuổi)"', goi: 'await moTaNguoiDung(1)', mongDoi: 'Lan (25 tuổi)' },
        { moTa: 'Thất bại → chuỗi lỗi, không reject', goi: 'await moTaNguoiDung(9)', mongDoi: 'Lỗi: Không tìm thấy người dùng 9' },
        { moTa: 'finally in khi thành công', so: 'console', goi: 'await moTaNguoiDung(2)', mongDoi: ['Đã tải xong 2'] },
        { moTa: 'finally in khi thất bại', so: 'console', goi: 'await moTaNguoiDung(9)', mongDoi: ['Đã tải xong 9'] },
        { moTa: 'Dùng .catch và .finally', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.catch\\s*\\([\\s\\S]*\\.finally\\s*\\(' },
        { moTa: 'Không dùng async/await', kiem: 'ma-nguon', tep: 'main.js', khop: '\\b(async|await)\\b', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Quên return trong .then: chuỗi gãy mà không báo lỗi',
      doKho: 'EASY', phut: 10, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['chuỗi Promise', 'return Promise trong then', 'lỗi lan theo chuỗi'],
      tienQuyet: ['.then'],
      the: ['javascript', 'promise', 'pitfall'],
      moTa: `<p>Bài 5.2, mục <em>"Bẫy — quên return promise bên trong .then, chuỗi gãy lặng lẽ"</em>. ${c('luuRoiDoc(noiDung)')} lưu một bài (${c('luuBai')}) rồi đọc lại nó (${c('docBai')}) và trả về nội dung đọc được. Bản hiện tại trả về ${c('undefined')}, và khi lưu thất bại thì lỗi không tới được người gọi.</p>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `${c('await luuRoiDoc("Xin chào")')} → ${c('"Xin chào"')}.`,
        `Nội dung rỗng → Promise của ${c('luuRoiDoc')} REJECT với lỗi ${c('"Nội dung trống"')}.`,
        `Chuỗi phẳng: ${c('luuBai(…).then(…).then(…)')} — không lồng then trong then.`,
      ],
      dauVao: 'noiDung: string.',
      dauRa: 'Promise<string>.',
      rangBuoc: ['Không dùng async/await.', 'Không sửa api.js.'],
      viDu: [
        { input: 'luuRoiDoc("Xin chào").then(console.log)', output: 'Xin chào   (sau 150 ms: 100 lưu + 50 đọc)', explanation: 'then thứ nhất RETURN Promise của docBai ⇒ then thứ hai chờ nó.' },
        { input: 'luuRoiDoc("").catch(e => console.log(e.message))', output: 'Nội dung trống', explanation: 'Lỗi của luuBai đi thẳng tới catch của người gọi.' },
      ],
      goiY: [
        'Ngoặc nhọn sau => mở thân hàm — không có return là trả về undefined (bẫy của Bài 4.3, gặp lại ở đây).',
        'return luuBai(noiDung).then((id) => docBai(id)); — hoặc .then(docBai).',
      ],
      khoiDau: {
        'api.js': API_BAI,
        'main.js': `// Bài 5.2 — Quên return
function luuRoiDoc(noiDung) {
  luuBai(noiDung)
    .then((id) => {
      docBai(id);
    })
    .then((bai) => bai);
}
`,
      },
      loiGiai: {
        'api.js': API_BAI,
        'main.js': `// Bài 5.2 — Quên return
function luuRoiDoc(noiDung) {
  // return chuỗi cho người gọi — không có nó, người gọi nhận undefined
  return luuBai(noiDung)
    // then trả về Promise của docBai ⇒ bước sau CHỜ nó và nhận nội dung bài
    .then((id) => docBai(id));
  // Lỗi của luuBai hay docBai đều đi theo chuỗi tới .catch của người gọi
}
`,
      },
      giaiThich: `<p>Hai chỗ thiếu ${c('return')}: (1) hàm ${c('luuRoiDoc')} không trả chuỗi Promise cho người gọi; (2) callback của then có ngoặc nhọn mà không return ${c('docBai(id)')}, nên then trả về Promise của ${c('undefined')} ngay lập tức — bước sau không chờ lần đọc. Không chỗ nào văng lỗi; thứ tự chỉ lặng lẽ sai, và lỗi của Promise bị bỏ rơi thành "unhandled rejection".</p>
<p>Khi callback của then <em>trả về một Promise</em>, chuỗi chờ Promise đó — đó là thứ làm chuỗi phẳng được. Máy chấm kiểm giá trị, thời gian (150 ms ảo) và lỗi lan tới người gọi.</p>`,
      loiHayGap: [
        'Chỉ thêm return ở một trong hai chỗ.',
        'Lồng .then bên trong .then — chạy được nhưng quay lại "kim tự tháp".',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#chaining',
      kiem: [
        { moTa: 'Trả về nội dung đã lưu', goi: 'await luuRoiDoc("Xin chào")', mongDoi: 'Xin chào' },
        { moTa: 'Mất đúng 150 ms (lưu rồi mới đọc)', chuanBi: 'const t = Date.now(); await luuRoiDoc("a");', goi: 'Date.now() - t', mongDoi: 150 },
        { moTa: 'Nội dung rỗng → reject "Nội dung trống"', goi: 'await luuRoiDoc("")', mongDoi: { loi: 'Error', thongDiep: '^Nội dung trống$' } },
        { moTa: 'Hai lần lưu không lẫn nhau', goi: 'await Promise.all([luuRoiDoc("một"), luuRoiDoc("hai")])', mongDoi: ['một', 'hai'], an: true },
        { moTa: 'Không dùng async/await', kiem: 'ma-nguon', tep: 'main.js', khop: '\\b(async|await)\\b', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Bọc API callback cũ thành Promise',
      doKho: 'MEDIUM', phut: 15, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['new Promise(resolve, reject)', 'callback kiểu Node (err, data)', 'promisify'],
      tienQuyet: ['new Promise'],
      the: ['javascript', 'promise', 'callback'],
      moTa: `<p>Bài 5.2: <em>"Bạn hiếm khi tự tạo Promise — trừ khi phải bọc một API kiểu cũ."</em> ${c('docTepCallback(ten, cb)')} là API kiểu Node.js đời đầu: gọi ${c('cb(loi)')} khi lỗi, ${c('cb(null, duLieu)')} khi thành công. Viết ${c('docTep(ten)')} trả về Promise, rồi ${c('docHaiTep(a, b)')} đọc hai tệp liên tiếp và trả về mảng ${c('[noiDungA, noiDungB]')}.</p>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `${c('docTep("ghi-chu.txt")')} fulfilled với ${c('"Học Promise"')}; tệp không có → reject với đúng Error mà API đưa.`,
        `Tệp rỗng (${c('"rong.txt"')}) là thành công với ${c('""')} — đừng nhầm "không có dữ liệu" với "có lỗi".`,
        `${c('docHaiTep')} dùng ${c('docTep')} và chuỗi ${c('.then')}; một tệp lỗi ⇒ cả Promise reject.`,
      ],
      dauVao: 'ten, a, b: string.',
      dauRa: 'docTep → Promise<string>; docHaiTep → Promise<[string, string]>.',
      rangBuoc: ['Không sửa api.js.', 'Không async/await.'],
      viDu: [
        { input: 'docTep("khong-co.txt").catch(e => e.message)', output: '"ENOENT: không có tệp khong-co.txt"', explanation: 'Lỗi của callback đi qua reject.' },
        { input: 'docHaiTep("ghi-chu.txt", "rong.txt")', output: '["Học Promise", ""]', explanation: 'Chuỗi rỗng vẫn là dữ liệu hợp lệ.' },
      ],
      goiY: [
        'return new Promise((resolve, reject) => { docTepCallback(ten, (loi, duLieu) => { … }); });',
        'Trong callback: if (loi) reject(loi); else resolve(duLieu); — đừng viết if (duLieu): chuỗi rỗng là falsy.',
      ],
      khoiDau: {
        'api.js': API_TEP,
        'main.js': `// Bài 5.2 — Bọc callback thành Promise
function docTep(ten) {
  return new Promise((resolve) => {
    docTepCallback(ten, (loi, duLieu) => {
      if (duLieu) resolve(duLieu);
    });
  });
}

function docHaiTep(a, b) {
  return docTep(a);
}
`,
      },
      loiGiai: {
        'api.js': API_TEP,
        'main.js': `// Bài 5.2 — Bọc callback thành Promise
function docTep(ten) {
  return new Promise((resolve, reject) => {
    docTepCallback(ten, (loi, duLieu) => {
      if (loi) {
        reject(loi);          // giữ nguyên Error gốc — đừng tạo lỗi mới mất thông tin
      } else {
        resolve(duLieu);      // kể cả "" — không có lỗi nghĩa là thành công
      }
    });
  });
}

function docHaiTep(a, b) {
  let noiDungA;
  return docTep(a)
    .then((nd) => {
      noiDungA = nd;
      return docTep(b);       // return Promise ⇒ bước sau chờ nó
    })
    .then((noiDungB) => [noiDungA, noiDungB]);
}
`,
      },
      giaiThich: `<p>Bọc callback vào Promise là ba dòng cố định: ${c('new Promise((resolve, reject) => api(…, (loi, kq) => loi ? reject(loi) : resolve(kq)))')}. Phán đoán thành công phải dựa vào <em>lỗi</em>, không dựa vào dữ liệu — tệp rỗng trả về ${c('""')} (falsy) nhưng vẫn là thành công; bản cũ để Promise đó pending mãi mãi.</p>
<p>Bản cũ còn quên ${c('reject')}: tệp lỗi cũng treo vĩnh viễn. Máy chấm phát hiện treo (Promise không bao giờ settle) và báo trượt. Node.js có sẵn ${c('util.promisify')} làm đúng việc này.</p>`,
      loiHayGap: [
        `${c('if (duLieu) resolve(duLieu)')} — tệp rỗng treo mãi.`,
        `${c('reject(new Error("Lỗi đọc tệp"))')} — vứt mất thông điệp gốc.`,
        'Đọc hai tệp song song rồi ghép sai thứ tự (đây là đọc liên tiếp).',
      ],
      thamKhao: 'https://javascript.info/promisify',
      kiem: [
        { moTa: 'Đọc tệp có nội dung', goi: 'await docTep("ghi-chu.txt")', mongDoi: 'Học Promise' },
        { moTa: 'Tệp rỗng vẫn fulfilled với ""', goi: 'await docTep("rong.txt")', mongDoi: '' },
        { moTa: 'Tệp không có → reject với lỗi gốc', goi: 'await docTep("khong-co.txt")', mongDoi: { loi: 'Error', thongDiep: 'ENOENT: không có tệp khong-co.txt' } },
        { moTa: 'docHaiTep', goi: 'await docHaiTep("ghi-chu.txt", "rong.txt")', mongDoi: ['Học Promise', ''] },
        { moTa: 'docHaiTep đọc liên tiếp (60 ms)', chuanBi: 'const t = Date.now(); await docHaiTep("ghi-chu.txt", "ghi-chu.txt");', goi: 'Date.now() - t', mongDoi: 60 },
        { moTa: 'Một tệp lỗi → docHaiTep reject', goi: 'await docHaiTep("ghi-chu.txt", "x.txt")', mongDoi: { loi: 'Error', thongDiep: 'x\\.txt' }, an: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Chuỗi ba bước đặt hàng với MỘT .catch ở cuối',
      doKho: 'MEDIUM', phut: 20, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['chuỗi then phẳng', 'truyền giá trị qua các bước', 'một catch cho cả chuỗi'],
      tienQuyet: ['.then', '.catch'],
      the: ['javascript', 'promise', 'chaining'],
      moTa: `<p>Bài 5.2: <em>"Nếu bước nào reject, điều khiển nhảy thẳng tới .catch gần nhất."</em> Đặt hàng gồm ba bước bất đồng bộ của máy chủ giả: ${c('kiemTraKho(ma, soLuong)')} → ${c('tinhTien(sp, soLuong)')} → ${c('taoDon(tien)')}. Viết ${c('datHang(ma, soLuong)')} trả về Promise của chuỗi:</p>
<ul><li>thành công: ${c('"Đơn DH-1: 15000đ"')}</li>
<li>bất kỳ bước nào lỗi: ${c('"Lỗi: <thông điệp>"')}</li></ul>
<p>Bản hiện tại lồng ba tầng then (kim tự tháp) và chỉ bắt lỗi của bước đầu.</p>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        'Ba bước nối thành MỘT chuỗi phẳng .then(...).then(...).then(...).',
        'MỘT .catch ở cuối bắt lỗi của cả ba bước.',
        'Các bước chạy tuần tự: tổng thời gian 40 + 20 + 30 = 90 ms khi thành công.',
      ],
      dauVao: 'ma: string; soLuong: number.',
      dauRa: 'Promise<string>.',
      rangBuoc: ['Không async/await.', 'Không lồng .then trong callback của .then.'],
      viDu: [
        { input: 'datHang("BUT", 3)', output: '"Đơn DH-1: 15000đ"', explanation: '5000 × 3.' },
        { input: 'datHang("VO", 1)', output: '"Lỗi: Hết hàng"', explanation: 'Bước 1 reject.' },
        { input: 'datHang("BUT", 0)', output: '"Lỗi: Số lượng không hợp lệ"', explanation: 'Bước 2 reject — bản cũ không bắt được lỗi này.' },
      ],
      goiY: [
        'Mỗi callback RETURN Promise của bước kế: .then((sp) => tinhTien(sp, soLuong)).then((tien) => taoDon(tien)).then((don) => ´Đơn @{don.maDon}: @{don.tien}đ´)',
        'Cuối chuỗi: .catch((err) => ´Lỗi: @{err.message}´) — chỉ một cái là đủ cho mọi bước phía trên.',
      ],
      khoiDau: {
        'api.js': API_DON,
        'main.js': `// Bài 5.2 — Chuỗi đặt hàng
function datHang(ma, soLuong) {
  return kiemTraKho(ma, soLuong)
    .then((sp) => {
      return tinhTien(sp, soLuong).then((tien) => {
        return taoDon(tien).then((don) => {
          return "Đơn " + don.maDon + ": " + don.tien + "đ";
        });
      });
    }, (err) => "Lỗi: " + err.message);
}
`,
      },
      loiGiai: {
        'api.js': API_DON,
        'main.js': `// Bài 5.2 — Chuỗi đặt hàng
function datHang(ma, soLuong) {
  return kiemTraKho(ma, soLuong)                 // bước 1: Promise<sanPham>
    .then((sp) => tinhTien(sp, soLuong))         // bước 2: return Promise ⇒ chuỗi chờ nó
    .then((tien) => taoDon(tien))                // bước 3
    .then((don) => ´Đơn @{don.maDon}: @{don.tien}đ´)
    // MỘT catch cho cả chuỗi: lỗi ở bước nào cũng nhảy thẳng xuống đây
    .catch((err) => ´Lỗi: @{err.message}´);
}
`,
      },
      giaiThich: `<p>Bản cũ truyền hàm lỗi làm đối số thứ hai của then đầu tiên: nó chỉ bắt lỗi của <em>bước 1</em>; lỗi ở bước 2 nằm trong Promise lồng bên trong và không ai bắt. Chuỗi phẳng + một ${c('.catch')} cuối cùng nghĩa là: lỗi xảy ra ở đâu, mọi then còn lại bị bỏ qua và điều khiển tới catch.</p>
<p>Lưu ý: lỗi ở bước 2 ⇒ bước 3 không chạy, không đơn nào được tạo — máy chấm kiểm số đơn tiếp theo vẫn là DH-1. Nó cũng đo tổng 90 ms ảo để chắc ba bước nối tiếp.</p>`,
      loiHayGap: [
        'Thêm catch sau mỗi then — lỗi ở bước 1 bị "chữa" thành chuỗi, bước 2 lại nhận chuỗi đó thay vì sản phẩm.',
        'Quên return trong then — bước sau nhận undefined.',
      ],
      thamKhao: 'https://javascript.info/promise-error-handling',
      kiem: [
        { moTa: 'Đặt hàng thành công', goi: 'await datHang("BUT", 3)', mongDoi: 'Đơn DH-1: 15000đ' },
        { moTa: 'Hết hàng (lỗi bước 1)', goi: 'await datHang("VO", 1)', mongDoi: 'Lỗi: Hết hàng' },
        { moTa: 'Số lượng 0 (lỗi bước 2) cũng được bắt', goi: 'await datHang("BUT", 0)', mongDoi: 'Lỗi: Số lượng không hợp lệ' },
        { moTa: 'Lỗi bước 2 ⇒ không tạo đơn', chuanBi: 'await datHang("BUT", 0);', goi: 'await datHang("BUT", 1)', mongDoi: 'Đơn DH-1: 5000đ' },
        { moTa: 'Ba bước tuần tự: 90 ms', chuanBi: 'const t = Date.now(); await datHang("BUT", 2);', goi: 'Date.now() - t', mongDoi: 90 },
        { moTa: 'Mã không tồn tại', goi: 'await datHang("XYZ", 1)', mongDoi: 'Lỗi: Không có sản phẩm XYZ', an: true },
        { moTa: 'Không async/await', kiem: 'ma-nguon', tep: 'main.js', khop: '\\b(async|await)\\b', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Hạn chờ cho một Promise: settle đúng một lần',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['Promise settle một lần', 'chạy đua hai việc', 'clearTimeout', 'reject với Error'],
      tienQuyet: ['new Promise', '.then'],
      the: ['javascript', 'promise', 'timeout'],
      moTa: `<p>Bài 5.2: <em>"Một Promise rời trạng thái pending đúng một lần. Gọi resolve lần hai chẳng làm gì — hữu ích khi bọc API."</em> Tận dụng điều đó để viết ${c('voiHanGio(promise, ms)')}: trả về Promise mới mang kết quả của ${c('promise')} nếu nó xong trong ${c('ms')}; quá hạn thì reject với ${c('Error("Quá thời gian <ms>ms")')}.</p>
${GIO_GIA}`,
      yeuCau: [
        `${c('promise')} fulfilled kịp → Promise mới fulfilled cùng giá trị.`,
        `${c('promise')} rejected kịp → Promise mới rejected cùng lỗi.`,
        `Quá ${c('ms')} → reject ${c('Error')} với thông điệp ${c('"Quá thời gian <ms>ms"')}, ngay tại mốc ${c('ms')} (không chờ promise gốc).`,
        `Khi promise gốc xong trước, huỷ hẹn giờ bằng ${c('clearTimeout')}.`,
      ],
      dauVao: 'promise: Promise; ms: number.',
      dauRa: 'Promise.',
      rangBuoc: ['Không dùng Promise.race (tự viết để hiểu cơ chế).', 'Không async/await.'],
      viDu: [
        { input: 'voiHanGio(cho(50, "ok"), 100)', output: '"ok"   (ở mốc 50 ms)', explanation: 'Xong kịp.' },
        { input: 'voiHanGio(cho(500, "muộn"), 100)', output: 'Error: Quá thời gian 100ms   (ở mốc 100 ms)', explanation: 'resolve của promise gốc ở mốc 500 không còn tác dụng — Promise mới đã rejected.' },
      ],
      goiY: [
        'return new Promise((resolve, reject) => { const hen = setTimeout(() => reject(new Error(…)), ms); promise.then(…, …); });',
        'Ai gọi trước thắng: promise.then((v) => { clearTimeout(hen); resolve(v); }, (e) => { clearTimeout(hen); reject(e); }); — lần gọi sau (của kẻ thua) bị bỏ qua.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.2 — Hạn chờ
// cho(ms, giaTri) — tiện ích có sẵn để thử
const cho = (ms, giaTri) => new Promise((resolve) => setTimeout(() => resolve(giaTri), ms));

function voiHanGio(promise, ms) {
  return promise;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.2 — Hạn chờ
// cho(ms, giaTri) — tiện ích có sẵn để thử
const cho = (ms, giaTri) => new Promise((resolve) => setTimeout(() => resolve(giaTri), ms));

function voiHanGio(promise, ms) {
  return new Promise((resolve, reject) => {
    // Đối thủ 1: đồng hồ — hết giờ thì reject
    const hen = setTimeout(() => {
      reject(new Error(´Quá thời gian @{ms}ms´));
    }, ms);

    // Đối thủ 2: promise gốc. Ai settle Promise mới TRƯỚC thì thắng;
    // lời gọi resolve/reject của kẻ thua bị bỏ qua (Promise chỉ settle một lần).
    promise.then(
      (giaTri) => { clearTimeout(hen); resolve(giaTri); },
      (loi) => { clearTimeout(hen); reject(loi); },
    );
  });
}
`,
      },
      giaiThich: `<p>Promise mới có hai "đối thủ" cùng cầm resolve/reject: hẹn giờ và promise gốc. Luật settle-một-lần biến chuyện chạy đua thành an toàn: kẻ thua gọi resolve/reject cũng không đổi được gì. ${c('clearTimeout')} không bắt buộc cho đúng kết quả, nhưng dọn hẹn giờ thừa là thói quen tốt (nhiều hẹn giờ treo giữ chương trình Node không thoát).</p>
<p>${c('Promise.race([promise, hetGio])')} làm đúng việc này trong một dòng — giờ bạn biết bên trong nó là gì. Máy chấm kiểm cả ba kết cục và <em>thời điểm</em> reject (100 ms, không phải 500).</p>`,
      loiHayGap: [
        'reject bằng chuỗi thay vì Error — người gọi đọc err.message ra undefined.',
        'Chờ promise gốc xong rồi mới kiểm "đã quá giờ chưa" — reject muộn ở mốc 500.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race',
      kiem: [
        { moTa: 'Xong kịp → giá trị gốc', goi: 'await voiHanGio(cho(50, "ok"), 100)', mongDoi: 'ok' },
        { moTa: 'Quá hạn → Error "Quá thời gian 100ms"', goi: 'await voiHanGio(cho(500, "muộn"), 100)', mongDoi: { loi: 'Error', thongDiep: '^Quá thời gian 100ms$' } },
        { moTa: 'Reject đúng ở mốc 100 ms', chuanBi: 'const t = Date.now(); let tg = -1; await voiHanGio(cho(500), 100).catch(() => { tg = Date.now() - t; });', goi: 'tg', mongDoi: 100 },
        { moTa: 'Promise gốc reject kịp → cùng lỗi', goi: 'await voiHanGio(Promise.reject(new RangeError("hỏng")), 100)', mongDoi: { loi: 'RangeError', thongDiep: 'hỏng' } },
        { moTa: 'Không dùng Promise.race', kiem: 'ma-nguon', tep: 'main.js', khop: 'Promise\\.race', phuDinh: true },
        { moTa: 'Dọn hẹn giờ bằng clearTimeout', kiem: 'ma-nguon', tep: 'main.js', khop: 'clearTimeout\\s*\\(', an: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Chạy tuần tự một danh sách việc bất đồng bộ bằng chuỗi then',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['reduce dựng chuỗi Promise', 'Promise.resolve()', 'dừng chuỗi khi lỗi', 'gom kết quả'],
      tienQuyet: ['chuỗi then', 'reduce'],
      the: ['javascript', 'promise', 'reduce'],
      moTa: `<p>Bài tổng hợp 5.2. ${c('chayTuanTu(cacViec)')} nhận một mảng <strong>hàm</strong>, mỗi hàm khi gọi trả về một Promise (vd ba lần ghi vào cơ sở dữ liệu phải theo đúng thứ tự). Chạy từng việc <em>sau khi</em> việc trước xong, trả về Promise của mảng kết quả theo thứ tự. Một việc reject ⇒ dừng ngay (các việc sau KHÔNG được bắt đầu) và reject với lỗi đó.</p>
<p>Code khởi đầu gọi mọi hàm cùng lúc — chúng chạy song song, và kết quả theo thứ tự <em>xong</em>, không theo thứ tự <em>danh sách</em>.</p>
${GIO_GIA}`,
      yeuCau: [
        'Việc i chỉ được GỌI sau khi Promise của việc i − 1 fulfilled.',
        'Kết quả là mảng giá trị theo thứ tự danh sách; tổng thời gian = tổng thời gian từng việc.',
        'Một việc reject ⇒ Promise trả về reject với đúng lỗi đó; các việc sau không được gọi.',
        `Danh sách rỗng ⇒ fulfilled với ${c('[]')}.`,
        'Không async/await (luyện chuỗi then) — gợi ý: reduce bắt đầu từ Promise.resolve([]).',
      ],
      dauVao: 'cacViec: mảng hàm () => Promise.',
      dauRa: 'Promise<mảng kết quả>.',
      rangBuoc: ['Không async/await.', 'Không Promise.all (nó chạy song song).'],
      viDu: [
        { input: 'chayTuanTu([() => cho(100, "A"), () => cho(50, "B"), () => cho(10, "C")])', output: '["A", "B", "C"]   (sau 160 ms)', explanation: 'Song song sẽ chỉ mất 100 ms, nhưng thứ tự BẮT ĐẦU sẽ không còn là A → B → C.' },
      ],
      goiY: [
        'Bắt đầu từ một Promise đã fulfilled với mảng rỗng, rồi với mỗi việc nối thêm một then: chuoi = chuoi.then((kq) => viec().then((v) => [...kq, v]));',
        'return cacViec.reduce((chuoi, viec) => chuoi.then((kq) => viec().then((v) => [...kq, v])), Promise.resolve([])); — lỗi của một việc làm mọi then sau bị bỏ qua, nên các việc sau không được gọi.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.2 — Chạy tuần tự
// cho(ms, giaTri) — tiện ích có sẵn để thử
const cho = (ms, giaTri) => new Promise((resolve) => setTimeout(() => resolve(giaTri), ms));

function chayTuanTu(cacViec) {
  const ketQua = [];
  cacViec.forEach((viec) => {
    viec().then((v) => ketQua.push(v));
  });
  return Promise.resolve(ketQua);
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.2 — Chạy tuần tự
// cho(ms, giaTri) — tiện ích có sẵn để thử
const cho = (ms, giaTri) => new Promise((resolve) => setTimeout(() => resolve(giaTri), ms));

function chayTuanTu(cacViec) {
  // Mắt xích đầu: một Promise đã fulfilled với mảng kết quả rỗng
  return cacViec.reduce(
    (chuoi, viec) =>
      // Nối thêm một mắt xích: CHỈ khi chuỗi trước xong mới gọi viec()
      chuoi.then((ketQua) =>
        viec().then((giaTri) => [...ketQua, giaTri])   // mảng mới, không push vào mảng cũ
      ),
    Promise.resolve([]),
  );
  // Một việc reject ⇒ mọi then phía sau bị bỏ qua ⇒ các việc sau KHÔNG được gọi,
  // và lỗi đi thẳng tới người gọi.
}
`,
      },
      giaiThich: `<p>Mấu chốt: gọi ${c('viec()')} là bắt đầu công việc. Code khởi đầu gọi tất cả trong ${c('forEach')} nên mọi việc bắt đầu cùng lúc; nó còn trả về mảng rỗng ngay vì các then chưa kịp chạy. Muốn tuần tự, lời gọi ${c('viec()')} phải nằm <em>bên trong</em> then của mắt xích trước.</p>
<p>${c('reduce')} dựng cả chuỗi ${c('Promise.resolve([]).then(v1).then(v2).then(v3)')} từ một mảng độ dài bất kỳ. Ở Bài 5.3, ${c('for…of')} + ${c('await')} làm đúng việc này dễ đọc hơn — nhưng bên dưới nó chính là chuỗi then này. Máy chấm ghi lại thời điểm <em>bắt đầu</em> từng việc để chắc không có hai việc chạy chồng nhau.</p>`,
      loiHayGap: [
        'Gọi viec() khi dựng chuỗi (ngoài then) — mọi việc vẫn bắt đầu cùng lúc.',
        'Dùng Promise.all — song song, đề cấm.',
        'push vào một mảng dùng chung rồi trả về mảng đó trước khi các việc xong.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#composition',
      kiem: [
        { moTa: 'Kết quả theo thứ tự danh sách', goi: 'await chayTuanTu([() => cho(100, "A"), () => cho(50, "B"), () => cho(10, "C")])', mongDoi: ['A', 'B', 'C'] },
        { moTa: 'Tuần tự: 160 ms', chuanBi: 'const t = Date.now(); await chayTuanTu([() => cho(100), () => cho(50), () => cho(10)]);', goi: 'Date.now() - t', mongDoi: 160 },
        { moTa: 'Mốc bắt đầu từng việc: 0, 100, 150', chuanBi: 'const t = Date.now(); const bd = []; const v = (ms) => () => { bd.push(Date.now() - t); return cho(ms); }; await chayTuanTu([v(100), v(50), v(10)]);', goi: 'bd', mongDoi: [0, 100, 150] },
        { moTa: 'Danh sách rỗng → []', goi: 'await chayTuanTu([])', mongDoi: [] },
        { moTa: 'Một việc reject → reject đúng lỗi đó', goi: 'await chayTuanTu([() => cho(10, 1), () => Promise.reject(new Error("việc 2 hỏng")), () => cho(10, 3)])', mongDoi: { loi: 'Error', thongDiep: 'việc 2 hỏng' } },
        { moTa: 'Sau lỗi, các việc sau không được gọi', chuanBi: 'let daGoi3 = false; await chayTuanTu([() => Promise.reject(new Error("x")), () => { daGoi3 = true; return cho(1); }]).catch(() => {});', goi: 'daGoi3', mongDoi: false, an: true },
        { moTa: 'Không async/await, không Promise.all', kiem: 'ma-nguon', tep: 'main.js', khop: '\\b(async|await)\\b|Promise\\.all', phuDinh: true },
      ],
    },
  ],
});
