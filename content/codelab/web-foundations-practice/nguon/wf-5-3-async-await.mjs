/** Bộ luyện bài 5.3 — async / await. Lược đồ: ./_luoc-do.mjs (loại 'js'). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const GIO_GIA = '<p><em>Máy chấm dùng đồng hồ GIẢ và đo thời gian bằng Date.now() — tuần tự hay song song lộ ra ngay trong con số.</em></p>';
const API_NOTE = '<p><code>api.js</code> là "máy chủ giả" có sẵn (đừng sửa), nạp trước <code>main.js</code>.</p>';

const API = `// api.js — MÁY CHỦ GIẢ, đừng sửa. Mọi hàm trả về Promise sau một khoảng trễ.
const cho = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const NGUOI_DUNG = {
  1: { id: 1, ten: "Lan" },
  2: { id: 2, ten: "Minh" },
  3: { id: 3, ten: "Hà" },
};
const BAI_VIET = {
  1: [{ tieuDe: "Học async" }, { tieuDe: "Học fetch" }],
  2: [],
  3: [{ tieuDe: "Ghi chú CSS" }],
};

// 100 ms
async function layNguoiDung(id) {
  await cho(100);
  if (!NGUOI_DUNG[id]) throw new Error(´Không tìm thấy người dùng @{id}´);
  return { ...NGUOI_DUNG[id] };
}

// 200 ms
async function layBaiViet(userId) {
  await cho(200);
  return (BAI_VIET[userId] || []).map((b) => ({ ...b }));
}

// 150 ms — người dùng 3 làm hỏng dịch vụ bạn bè
async function layBanBe(userId) {
  await cho(150);
  if (userId === 3) throw new Error("Dịch vụ bạn bè lỗi");
  return userId === 1 ? [2, 3] : [1];
}

// 100 ms
async function layThongBao(userId) {
  await cho(100);
  return [´Chào @{userId}´];
}
`;

const API_DIEM = `// api.js — MÁY CHỦ GIẢ, đừng sửa.
const DIEM = { toan: 8, van: 7, anh: 9 };

// Promise<number> sau 50 ms
function layDiem(mon) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (!(mon in DIEM)) return reject(new Error(´Không có môn @{mon}´));
    resolve(DIEM[mon]);
  }, 50));
}
`;

const API_LUU = `// api.js — MÁY CHỦ GIẢ, đừng sửa.
// Mỗi lần lưu mất một khoảng KHÁC nhau; daLuu ghi lại thứ tự các lần lưu XONG.
const daLuu = [];
function luu(muc) {
  const tre = muc.length * 30;          // chuỗi dài lưu lâu hơn
  return new Promise((resolve) => setTimeout(() => {
    daLuu.push(muc);
    resolve(true);
  }, tre));
}
`;

export default doiDau({
  slug: 'wf-5-3-async-await',
  ten: '5.3 async / await: code bất đồng bộ đọc như đồng bộ',
  baiHoc: 'Nền tảng Web — Bài 5.3 async / await',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'async luôn trả Promise, await tạm dừng hàm, try/catch quanh await, tuần tự vs song song với Promise.all, bẫy await trong forEach — 7 bài, có đo thời gian bằng đồng hồ giả.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Viết lại chuỗi .then bằng async/await',
      doKho: 'EASY', phut: 10, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['async function', 'await', 'chuỗi then'],
      tienQuyet: ['Promise', '.then'],
      the: ['javascript', 'async-await'],
      moTa: `<p>Bài 5.3: <em>"Cùng một việc, hai cách viết — async/await đọc như code bình thường."</em> ${c('tieuDeBaiDau(userId)')} dưới đây chạy đúng, nhưng viết bằng chuỗi ${c('.then')}. Viết lại bằng ${c('async')}/${c('await')}, kết quả không đổi: tiêu đề bài viết đầu tiên của người dùng, hoặc ${c('null')} nếu họ chưa có bài.</p>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `${c('tieuDeBaiDau')} là ${c('async function')} và dùng ${c('await')}; không còn ${c('.then(')}.`,
        `Kết quả như cũ: ${c('"Học async"')} cho người dùng 1, ${c('null')} cho người dùng 2.`,
        'Vẫn tuần tự: lấy người dùng (100 ms) rồi mới lấy bài viết (200 ms).',
      ],
      dauVao: 'userId: number.',
      dauRa: 'Promise<string | null>.',
      rangBuoc: ['Không sửa api.js.'],
      viDu: [
        { input: 'await tieuDeBaiDau(1)', output: '"Học async"', explanation: 'Người dùng 1 có hai bài, lấy bài đầu.' },
        { input: 'await tieuDeBaiDau(2)', output: 'null', explanation: 'Mảng bài rỗng.' },
      ],
      goiY: [
        'Mỗi .then((x) => …) trở thành một dòng const x = await …;',
        'const u = await layNguoiDung(userId); const bai = await layBaiViet(u.id); return bai.length > 0 ? bai[0].tieuDe : null;',
      ],
      khoiDau: {
        'api.js': API,
        'main.js': `// Bài 5.3 — then → await
function tieuDeBaiDau(userId) {
  return layNguoiDung(userId)
    .then((u) => layBaiViet(u.id))
    .then((bai) => (bai.length > 0 ? bai[0].tieuDe : null));
}
`,
      },
      loiGiai: {
        'api.js': API,
        'main.js': `// Bài 5.3 — then → await
async function tieuDeBaiDau(userId) {
  const u = await layNguoiDung(userId);     // dừng ở đây tới khi có người dùng
  const bai = await layBaiViet(u.id);       // rồi mới hỏi bài viết (cần u.id)
  return bai.length > 0 ? bai[0].tieuDe : null;
  // async ⇒ giá trị return được bọc trong một Promise cho người gọi
}
`,
      },
      giaiThich: `<p>${c('await p')} tạm dừng <em>hàm này</em> tới khi ${c('p')} settle rồi trao giá trị — mỗi bước then thành một dòng gán. Code đọc từ trên xuống y như code đồng bộ, nhưng bên dưới vẫn là đúng chuỗi Promise cũ. Hàm ${c('async')} luôn trả về Promise, nên người gọi vẫn ${c('await')} hoặc ${c('.then')} nó như trước.</p>
<p>Máy chấm kiểm kết quả, kiểm 300 ms (vẫn tuần tự — bước 2 cần ${c('u.id')}) và soi mã không còn ${c('.then(')}.</p>`,
      loiHayGap: [
        'Quên async trước function — await trong hàm thường là lỗi cú pháp.',
        'Quên await trước layNguoiDung — u là một Promise, u.id là undefined.',
      ],
      thamKhao: 'https://javascript.info/async-await',
      kiem: [
        { moTa: 'Người dùng 1 → "Học async"', goi: 'await tieuDeBaiDau(1)', mongDoi: 'Học async' },
        { moTa: 'Người dùng 2 chưa có bài → null', goi: 'await tieuDeBaiDau(2)', mongDoi: null },
        { moTa: 'Vẫn tuần tự: 300 ms', chuanBi: 'const t = Date.now(); await tieuDeBaiDau(3);', goi: 'Date.now() - t', mongDoi: 300 },
        { moTa: 'Là async function (trả Promise)', goi: 'tieuDeBaiDau(1) instanceof Promise', mongDoi: true },
        { moTa: 'Dùng await, không còn .then(', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.then\\s*\\(', phuDinh: true },
        { moTa: 'Có từ khoá await', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bawait\\b' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'try/catch quanh await: tải an toàn',
      doKho: 'EASY', phut: 10, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['try / catch', 'rejected → ném lỗi', 'object kết quả'],
      tienQuyet: ['async/await'],
      the: ['javascript', 'async-await', 'error-handling'],
      moTa: `<p>Bài 5.3: <em>"Promise bị reject trở thành một lỗi được ném ra, nên try/catch bình thường xử lý được."</em> ${c('taiAnToan(id)')} không bao giờ được reject — giao diện gọi nó không có catch. Trả về:</p>
<ul><li>thành công: ${c('{ ok: true, nguoiDung: { id, ten } }')}</li>
<li>thất bại: ${c('{ ok: false, thongBao: "<err.message>" }')}</li></ul>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `Bọc lời gọi ${c('await layNguoiDung(id)')} trong ${c('try')}.`,
        'Thành công / thất bại trả về đúng hai hình dạng object trên.',
        'Promise của taiAnToan luôn fulfilled.',
      ],
      dauVao: 'id: number.',
      dauRa: 'Promise<{ ok, nguoiDung } | { ok, thongBao }>.',
      rangBuoc: ['Không dùng .catch (luyện try/catch).'],
      viDu: [
        { input: 'await taiAnToan(1)', output: '{ ok: true, nguoiDung: { id: 1, ten: "Lan" } }', explanation: 'Người dùng có thật ⇒ nhánh try đi hết.' },
        { input: 'await taiAnToan(99)', output: '{ ok: false, thongBao: "Không tìm thấy người dùng 99" }', explanation: 'Reject của layNguoiDung thành lỗi ném ra ở dòng await, rơi vào catch.' },
      ],
      goiY: [
        'try { const u = await layNguoiDung(id); return { … }; } catch (err) { return { … }; }',
        'Thiếu await trong try thì Promise bị reject SAU khi try đã xong — catch không bắt được.',
      ],
      khoiDau: {
        'api.js': API,
        'main.js': `// Bài 5.3 — try/catch
async function taiAnToan(id) {
  const u = await layNguoiDung(id);
  return { ok: true, nguoiDung: u };
}
`,
      },
      loiGiai: {
        'api.js': API,
        'main.js': `// Bài 5.3 — try/catch
async function taiAnToan(id) {
  try {
    // await biến Promise bị reject thành một lỗi ném ra NGAY TẠI dòng này
    const u = await layNguoiDung(id);
    return { ok: true, nguoiDung: u };
  } catch (err) {
    // mọi lỗi trong khối try (kể cả từ await) rơi vào đây
    return { ok: false, thongBao: err.message };
  }
}
`,
      },
      giaiThich: `<p>Ưu điểm lớn nhất của await so với then: xử lý lỗi bất đồng bộ bằng đúng công cụ của code đồng bộ. Phải có ${c('await')} <em>bên trong</em> ${c('try')}: ${c('return layNguoiDung(id)')} không await thì hàm rời khối try trước khi Promise kịp reject.</p>
<p>Trả về object ${c('{ ok, … }')} là một mẫu hay gặp ở ranh giới giao diện: người gọi kiểm ${c('kq.ok')} thay vì phải nhớ bắt lỗi. Máy chấm kiểm cả hai hình dạng và một lời gọi không await-được-bắt.</p>`,
      loiHayGap: [
        `${c('return layNguoiDung(id)')} trong try mà không await — lỗi lọt ra ngoài.`,
        `Trả về ${c('thongBao: err')} (cả object Error) thay vì ${c('err.message')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch',
      kiem: [
        { moTa: 'Thành công', goi: 'await taiAnToan(1)', mongDoi: { ok: true, nguoiDung: { id: 1, ten: 'Lan' } } },
        { moTa: 'Thất bại → ok: false + thông báo', goi: 'await taiAnToan(99)', mongDoi: { ok: false, thongBao: 'Không tìm thấy người dùng 99' } },
        { moTa: 'Không bao giờ reject', goi: 'await taiAnToan(-1).then(() => "fulfilled", () => "rejected")', mongDoi: 'fulfilled' },
        { moTa: 'Dùng try/catch', kiem: 'ma-nguon', tep: 'main.js', khop: '\\btry\\s*\\{[\\s\\S]*\\bawait\\b[\\s\\S]*\\}\\s*catch' },
        { moTa: 'Không dùng .catch', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.catch\\s*\\(', phuDinh: true, an: true },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: '"[object Promise][object Promise]": quên await',
      doKho: 'EASY', phut: 10, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['async luôn trả Promise', 'quên await', 'Promise không phải giá trị'],
      tienQuyet: ['async/await'],
      the: ['javascript', 'async-await', 'pitfall'],
      moTa: `<p>Bài 5.3: <em>"async làm hàm luôn trả về Promise — kể cả khi bạn return một con số."</em> ${c('tongDiem()')} cộng điểm Toán và Văn từ ${c('layDiem(mon)')} (trả Promise). Bản hiện tại trả về chuỗi ${c('"[object Promise][object Promise]"')} — nó đang cộng hai <em>Promise</em>, không phải hai con số. Sửa nó, và viết thêm ${c('diemTrungBinh(dsMon)')}.</p>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `${c('await tongDiem()')} → ${c('15')}.`,
        `${c('await diemTrungBinh(["toan", "van", "anh"])')} → ${c('8')}; danh sách rỗng → ${c('null')}.`,
        `Môn không có → ${c('diemTrungBinh')} reject với lỗi của ${c('layDiem')}.`,
      ],
      dauVao: 'dsMon: mảng tên môn.',
      dauRa: 'Promise<number | null>.',
      rangBuoc: ['Không sửa api.js.'],
      viDu: [
        { input: 'await tongDiem()', output: '15', explanation: '8 + 7.' },
        { input: '(code khởi đầu) tongDiem()', output: '"[object Promise][object Promise]"', explanation: 'Promise + Promise ⇒ cả hai bị đổi sang chuỗi.' },
      ],
      goiY: [
        'Hàm phải là async để dùng await; mỗi layDiem(...) cần một await trước nó.',
        'diemTrungBinh: if (dsMon.length === 0) return null; let tong = 0; for (const mon of dsMon) tong += await layDiem(mon); return tong / dsMon.length;',
      ],
      khoiDau: {
        'api.js': API_DIEM,
        'main.js': `// Bài 5.3 — Quên await
function tongDiem() {
  const toan = layDiem("toan");
  const van = layDiem("van");
  return toan + van;
}

async function diemTrungBinh(dsMon) {
  return 0;
}
`,
      },
      loiGiai: {
        'api.js': API_DIEM,
        'main.js': `// Bài 5.3 — Quên await
async function tongDiem() {
  const toan = await layDiem("toan");    // await: lấy CON SỐ ra khỏi Promise
  const van = await layDiem("van");
  return toan + van;                     // 8 + 7 — hàm async bọc 15 trong một Promise
}

async function diemTrungBinh(dsMon) {
  if (dsMon.length === 0) return null;   // tránh 0 / 0 = NaN
  let tong = 0;
  for (const mon of dsMon) {
    tong = tong + (await layDiem(mon));  // lỗi của layDiem ném ra ⇒ hàm reject
  }
  return tong / dsMon.length;
}
`,
      },
      giaiThich: `<p>Một Promise là "giấy hẹn", không phải giá trị. Cộng hai giấy hẹn bằng ${c('+')} thì JavaScript đổi cả hai sang chuỗi ${c('"[object Promise]"')} (Bài 4.1: ${c('+')} gặp thứ không phải số thì nối). ${c('await')} đổi giấy hẹn ra giá trị thật. Không có lỗi đỏ nào ở đây — chỉ một kết quả kỳ quặc — nên nhận ra mẫu chữ ${c('[object Promise]')} là kỹ năng gỡ lỗi đáng nhớ.</p>
<p>Máy chấm kiểm giá trị, danh sách rỗng, môn không có, và ${c('tongDiem()')} trả về Promise.</p>`,
      loiHayGap: [
        'Thêm await nhưng quên async — lỗi cú pháp "await is only valid in async functions".',
        'Gọi tongDiem() mà không await ở phía người gọi — lại nhận một Promise.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
      kiem: [
        { moTa: 'tongDiem() = 15', goi: 'await tongDiem()', mongDoi: 15 },
        { moTa: 'tongDiem() trả về Promise', goi: 'tongDiem() instanceof Promise', mongDoi: true },
        { moTa: 'Trung bình ba môn = 8', goi: 'await diemTrungBinh(["toan", "van", "anh"])', mongDoi: 8 },
        { moTa: 'Danh sách rỗng → null', goi: 'await diemTrungBinh([])', mongDoi: null },
        { moTa: 'Môn không có → reject', goi: 'await diemTrungBinh(["toan", "su"])', mongDoi: { loi: 'Error', thongDiep: 'Không có môn su' } },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Bảng điều khiển chậm gấp ba: chạy song song bằng Promise.all',
      doKho: 'MEDIUM', phut: 15, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['Promise.all', 'tuần tự vs song song', 'destructuring mảng'],
      tienQuyet: ['async/await'],
      the: ['javascript', 'async-await', 'performance'],
      moTa: `<p>Bài 5.3: <em>"Đừng await trong vòng lặp khi các lời gọi độc lập — ba lời gọi 1 giây thành 3 giây."</em> Trang chủ cần ba thứ <strong>không phụ thuộc nhau</strong> về người dùng ${c('id')}: hồ sơ (${c('layNguoiDung')}, 100 ms), thông báo (${c('layThongBao')}, 100 ms) và bạn bè (${c('layBanBe')}, 150 ms). Bản hiện tại await lần lượt: 350 ms. Song song chỉ cần 150 ms.</p>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `${c('taiBangDieuKhien(id)')} trả về ${c('{ nguoiDung, thongBao, banBe }')}.`,
        `Ba lời gọi bắt đầu cùng lúc; tổng thời gian bằng lời gọi lâu nhất (${c('150 ms')}).`,
        `Dùng ${c('Promise.all')} và một ${c('await')}.`,
      ],
      dauVao: 'id: number (1 hoặc 2).',
      dauRa: 'Promise<{ nguoiDung, thongBao, banBe }>.',
      rangBuoc: ['Không sửa api.js.'],
      viDu: [
        { input: 'await taiBangDieuKhien(1)', output: '{ nguoiDung: { id: 1, ten: "Lan" }, thongBao: ["Chào 1"], banBe: [2, 3] }', explanation: 'Sau 150 ms.' },
      ],
      goiY: [
        'Gọi cả ba hàm TRƯỚC (bắt đầu công việc), rồi mới await một lần cho cả ba.',
        'const [nguoiDung, thongBao, banBe] = await Promise.all([layNguoiDung(id), layThongBao(id), layBanBe(id)]);',
      ],
      khoiDau: {
        'api.js': API,
        'main.js': `// Bài 5.3 — Song song
async function taiBangDieuKhien(id) {
  const nguoiDung = await layNguoiDung(id);
  const thongBao = await layThongBao(id);
  const banBe = await layBanBe(id);
  return { nguoiDung, thongBao, banBe };
}
`,
      },
      loiGiai: {
        'api.js': API,
        'main.js': `// Bài 5.3 — Song song
async function taiBangDieuKhien(id) {
  // Ba việc độc lập: BẮT ĐẦU cả ba ngay (gọi hàm), rồi chờ MỘT lần cho cả ba.
  // Promise.all giữ đúng thứ tự kết quả theo thứ tự mảng đưa vào.
  const [nguoiDung, thongBao, banBe] = await Promise.all([
    layNguoiDung(id),
    layThongBao(id),
    layBanBe(id),
  ]);
  return { nguoiDung, thongBao, banBe };
}
`,
      },
      giaiThich: `<p>Hai ${c('await')} liên tiếp nghĩa là "xong cái này mới <em>bắt đầu</em> cái kia". Khi các việc không cần kết quả của nhau, đó là thời gian chết. ${c('Promise.all')} nhận các Promise <em>đã bắt đầu</em>, chờ tất cả, trả mảng kết quả theo đúng thứ tự đưa vào (không theo thứ tự xong). Đây là một trong những lỗi hiệu năng phổ biến nhất ngoài đời.</p>
<p>Máy chấm đo bằng đồng hồ giả: 150 ms là đạt, 350 ms là trượt.</p>`,
      loiHayGap: [
        'Truyền hàm thay vì lời gọi: Promise.all([layNguoiDung, …]) — nhận về chính các hàm.',
        'await từng phần tử trong mảng trước khi đưa vào Promise.all — lại tuần tự.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
      kiem: [
        { moTa: 'Kết quả đúng cho người dùng 1', goi: 'await taiBangDieuKhien(1)', mongDoi: { nguoiDung: { id: 1, ten: 'Lan' }, thongBao: ['Chào 1'], banBe: [2, 3] } },
        { moTa: 'Song song: 150 ms', chuanBi: 'const t = Date.now(); await taiBangDieuKhien(2);', goi: 'Date.now() - t', mongDoi: 150 },
        { moTa: 'Người dùng 2', goi: 'await taiBangDieuKhien(2)', mongDoi: { nguoiDung: { id: 2, ten: 'Minh' }, thongBao: ['Chào 2'], banBe: [1] }, an: true },
        { moTa: 'Dùng Promise.all', kiem: 'ma-nguon', tep: 'main.js', khop: 'Promise\\.all\\s*\\(' },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'await trong forEach không chờ gì cả',
      doKho: 'MEDIUM', phut: 15, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['forEach bỏ qua Promise', 'for…of + await', 'tuần tự có thứ tự'],
      tienQuyet: ['async/await', 'for…of'],
      the: ['javascript', 'async-await', 'pitfall'],
      moTa: `<p>Bài 5.3, mục <em>"Bẫy — await bên trong forEach chẳng làm gì cả"</em>. ${c('luuTatCa(ds)')} phải lưu từng mục <strong>theo đúng thứ tự</strong> (mục sau chỉ bắt đầu khi mục trước xong) và chỉ trả về số mục đã lưu SAU KHI tất cả đã xong. Mỗi lần ${c('luu')} mất thời gian khác nhau (chuỗi dài lâu hơn), và ${c('daLuu')} ghi thứ tự các lần lưu xong. Bản dùng ${c('forEach')} trả về 0 ngay lập tức và lưu lộn thứ tự.</p>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `${c('await luuTatCa(["ccc", "a", "bb"])')} → ${c('3')}, và lúc đó ${c('daLuu')} là ${c('["ccc", "a", "bb"]')}.`,
        'Mục sau chỉ bắt đầu khi mục trước xong (tổng thời gian = tổng từng lần).',
        `Dùng ${c('for…of')} + ${c('await')}, không ${c('forEach')}.`,
      ],
      dauVao: 'ds: mảng chuỗi.',
      dauRa: 'Promise<number>.',
      rangBuoc: ['Không sửa api.js.'],
      viDu: [
        { input: 'await luuTatCa(["ccc", "a", "bb"]); daLuu', output: '["ccc", "a", "bb"]', explanation: 'Tuần tự ⇒ thứ tự xong = thứ tự danh sách.' },
        { input: '(code khởi đầu) await luuTatCa(["ccc", "a", "bb"])', output: '0   (và daLuu sau đó: ["a", "bb", "ccc"])', explanation: 'forEach phóng cả ba cùng lúc, không chờ; cái ngắn xong trước.' },
      ],
      goiY: [
        'forEach không biết callback của nó trả về Promise — nó gọi xong là đi tiếp. for…of thì tôn trọng await.',
        'let dem = 0; for (const muc of ds) { await luu(muc); dem++; } return dem;',
      ],
      khoiDau: {
        'api.js': API_LUU,
        'main.js': `// Bài 5.3 — await trong forEach
async function luuTatCa(ds) {
  let dem = 0;
  ds.forEach(async (muc) => {
    await luu(muc);
    dem++;
  });
  return dem;
}
`,
      },
      loiGiai: {
        'api.js': API_LUU,
        'main.js': `// Bài 5.3 — await trong forEach
async function luuTatCa(ds) {
  let dem = 0;
  // for...of chạy TRONG hàm async này ⇒ mỗi await tạm dừng chính vòng lặp
  for (const muc of ds) {
    await luu(muc);   // mục sau chỉ bắt đầu khi mục này xong
    dem++;
  }
  return dem;         // tới đây mọi lần lưu đã xong
}
`,
      },
      giaiThich: `<p>${c('forEach(async (muc) => …)')} tạo ra một hàm async cho mỗi phần tử; mỗi hàm trả về Promise, và ${c('forEach')} vứt các Promise đó đi. Vòng lặp xong ngay, ${c('return dem')} chạy khi chưa lần lưu nào kết thúc. Với ${c('for…of')}, ${c('await')} nằm trong chính hàm ${c('luuTatCa')} nên dừng được vòng lặp.</p>
<p>Khi thứ tự KHÔNG quan trọng và muốn nhanh: ${c('await Promise.all(ds.map(luu))')}. Máy chấm kiểm giá trị trả về, thứ tự ${c('daLuu')} và tổng thời gian.</p>`,
      loiHayGap: [
        'Thêm await trước ds.forEach(…) — forEach trả về undefined, await undefined chẳng chờ gì.',
        'Dùng map(async …) mà không Promise.all — mảng Promise không được chờ.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#description',
      kiem: [
        { moTa: 'Trả về 3 sau khi lưu xong', goi: 'await luuTatCa(["ccc", "a", "bb"])', mongDoi: 3 },
        { moTa: 'Lưu đúng thứ tự', chuanBi: 'await luuTatCa(["ccc", "a", "bb"]);', goi: 'daLuu', mongDoi: ['ccc', 'a', 'bb'] },
        { moTa: 'Tuần tự: 90 + 30 + 60 = 180 ms', chuanBi: 'const t = Date.now(); await luuTatCa(["ccc", "a", "bb"]);', goi: 'Date.now() - t', mongDoi: 180 },
        { moTa: 'Danh sách rỗng → 0', goi: 'await luuTatCa([])', mongDoi: 0 },
        { moTa: 'Không dùng forEach', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.forEach\\s*\\(', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Tải nhiều người dùng song song mà vẫn giữ thứ tự',
      doKho: 'MEDIUM', phut: 15, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['Promise.all với map', 'thứ tự kết quả', 'thất bại nhanh (fail-fast)'],
      tienQuyet: ['Promise.all', 'map'],
      the: ['javascript', 'async-await', 'promise-all'],
      moTa: `<p>Danh sách thành viên cần tên của nhiều người dùng. Viết ${c('layTen(ids)')} trả về mảng tên <strong>đúng thứ tự ids</strong>, tải song song (tổng 100 ms dù bao nhiêu người). Nếu một id không tồn tại, cả lời gọi reject với lỗi đó (Promise.all "thất bại nhanh"). Viết thêm ${c('layTenAnToan(ids)')}: id lỗi thì đặt ${c('null')} vào đúng vị trí đó, không reject.</p>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `${c('await layTen([3, 1, 2])')} → ${c('["Hà", "Lan", "Minh"]')} sau 100 ms.`,
        `${c('layTen([1, 99])')} reject với lỗi ${c('"Không tìm thấy người dùng 99"')}.`,
        `${c('await layTenAnToan([1, 99, 2])')} → ${c('["Lan", null, "Minh"]')}, vẫn 100 ms.`,
        `Dùng ${c('Promise.all')} + ${c('map')}.`,
      ],
      dauVao: 'ids: mảng số.',
      dauRa: 'Promise<mảng tên>.',
      rangBuoc: ['Không dùng Promise.allSettled (luyện cách tự bắt lỗi từng phần tử).'],
      viDu: [
        { input: 'await layTen([3, 1, 2])', output: '["Hà", "Lan", "Minh"]', explanation: 'Thứ tự theo ids, không theo thứ tự xong.' },
        { input: 'await layTenAnToan([1, 99, 2])', output: '["Lan", null, "Minh"]', explanation: 'Mỗi phần tử tự bắt lỗi của nó.' },
      ],
      goiY: [
        'const ds = await Promise.all(ids.map((id) => layNguoiDung(id))); return ds.map((u) => u.ten);',
        'Bản an toàn: map mỗi id thành một hàm async có try/catch riêng: ids.map(async (id) => { try { return (await layNguoiDung(id)).ten; } catch { return null; } })',
      ],
      khoiDau: {
        'api.js': API,
        'main.js': `// Bài 5.3 — Promise.all + map
async function layTen(ids) {
  const ten = [];
  for (const id of ids) {
    const u = await layNguoiDung(id);
    ten.push(u.ten);
  }
  return ten;
}

async function layTenAnToan(ids) {
  return [];
}
`,
      },
      loiGiai: {
        'api.js': API,
        'main.js': `// Bài 5.3 — Promise.all + map
async function layTen(ids) {
  // map: mỗi id ⇒ một Promise ĐÃ BẮT ĐẦU; Promise.all chờ tất cả, giữ thứ tự ids.
  // Một Promise reject ⇒ Promise.all reject ngay với lỗi đó.
  const ds = await Promise.all(ids.map((id) => layNguoiDung(id)));
  return ds.map((u) => u.ten);
}

async function layTenAnToan(ids) {
  // Mỗi phần tử tự bắt lỗi của mình ⇒ không Promise nào reject ⇒ Promise.all không thất bại
  return Promise.all(
    ids.map(async (id) => {
      try {
        const u = await layNguoiDung(id);
        return u.ten;
      } catch {
        return null;            // giữ đúng vị trí, đánh dấu "không lấy được"
      }
    }),
  );
}
`,
      },
      giaiThich: `<p>${c('ids.map((id) => layNguoiDung(id))')} gọi hàm cho mọi id ngay lập tức ⇒ mọi request chạy cùng lúc; ${c('Promise.all')} chờ tất cả và xếp kết quả theo vị trí trong mảng. Một phần tử reject ⇒ toàn bộ reject (thất bại nhanh) — phù hợp khi thiếu một mảnh là vô nghĩa.</p>
<p>Khi muốn "lấy được bao nhiêu thì lấy", chuyển việc bắt lỗi xuống từng phần tử: mỗi hàm async con có try/catch, không bao giờ reject. (${c('Promise.allSettled')} làm sẵn việc này.) Máy chấm kiểm thứ tự, thời gian 100 ms và cả hai cách xử lý lỗi.</p>`,
      loiHayGap: [
        'await trong vòng for — đúng thứ tự nhưng 100 ms × số người.',
        'Gom kết quả bằng push trong .then — thứ tự theo ai xong trước.',
      ],
      thamKhao: 'https://javascript.info/promise-api#promise-all',
      kiem: [
        { moTa: 'Đúng thứ tự ids', goi: 'await layTen([3, 1, 2])', mongDoi: ['Hà', 'Lan', 'Minh'] },
        { moTa: 'Song song: 100 ms cho 3 người', chuanBi: 'const t = Date.now(); await layTen([3, 1, 2]);', goi: 'Date.now() - t', mongDoi: 100 },
        { moTa: 'Một id lỗi → reject', goi: 'await layTen([1, 99])', mongDoi: { loi: 'Error', thongDiep: 'Không tìm thấy người dùng 99' } },
        { moTa: 'Bản an toàn: null đúng vị trí', goi: 'await layTenAnToan([1, 99, 2])', mongDoi: ['Lan', null, 'Minh'] },
        { moTa: 'Bản an toàn vẫn song song', chuanBi: 'const t = Date.now(); await layTenAnToan([1, 99, 2, 3]);', goi: 'Date.now() - t', mongDoi: 100, an: true },
        { moTa: 'Không dùng allSettled', kiem: 'ma-nguon', tep: 'main.js', khop: 'allSettled', phuDinh: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Trang cá nhân: tuần tự khi phụ thuộc, song song khi độc lập',
      doKho: 'HARD', phut: 30, tepNap: ['api.js', 'main.js'],
      khaiNiem: ['phụ thuộc dữ liệu', 'Promise.all', 'try/catch cục bộ', 'xuống cấp nhẹ nhàng'],
      tienQuyet: ['Promise.all', 'try/catch quanh await'],
      the: ['javascript', 'async-await', 'architecture'],
      moTa: `<p>Bài 5.3: <em>"Dùng await khi bước B cần kết quả bước A; dùng Promise.all khi các bước độc lập."</em> Trang cá nhân cần: người dùng (100 ms) → rồi, <strong>với id của họ</strong>, bài viết (200 ms) và bạn bè (150 ms). Viết ${c('taiTrangCaNhan(id)')} trả về ${c('{ ten, soBai, soBan }')}:</p>
<ul><li>Bước 1 phải chờ; bước 2 và 3 chạy song song ⇒ tổng ${c('300 ms')} (không phải 450).</li>
<li>Dịch vụ bạn bè lỗi thì trang vẫn hiện: ${c('soBan: null')} (xuống cấp nhẹ nhàng).</li>
<li>Không lấy được người dùng thì cả hàm reject — không có gì để hiện.</li></ul>
${API_NOTE}${GIO_GIA}`,
      yeuCau: [
        `${c('await taiTrangCaNhan(1)')} → ${c('{ ten: "Lan", soBai: 2, soBan: 2 }')} sau đúng 300 ms.`,
        `Người dùng 3 (dịch vụ bạn bè lỗi) → ${c('{ ten: "Hà", soBai: 1, soBan: null }')}, vẫn 300 ms.`,
        `Lỗi bài viết hay người dùng KHÔNG bị nuốt: ${c('taiTrangCaNhan(99)')} reject.`,
        'Chỉ lỗi của bạn bè được thay bằng null — không bọc cả hàm trong một try/catch lớn.',
      ],
      dauVao: 'id: number.',
      dauRa: 'Promise<{ ten, soBai, soBan }>.',
      rangBuoc: ['Không sửa api.js.', 'Không dùng Promise.allSettled.'],
      viDu: [
        { input: 'await taiTrangCaNhan(1)', output: '{ ten: "Lan", soBai: 2, soBan: 2 }   (300 ms)', explanation: '100 + max(200, 150).' },
        { input: 'await taiTrangCaNhan(3)', output: '{ ten: "Hà", soBai: 1, soBan: null }', explanation: 'layBanBe(3) reject — chỉ phần bạn bè xuống cấp.' },
      ],
      goiY: [
        'const u = await layNguoiDung(id); rồi const [bai, ban] = await Promise.all([layBaiViet(u.id), layBanBeAnToan(u.id)]);',
        'layBanBeAnToan có thể là: layBanBe(uid).catch(() => null) — một Promise không bao giờ reject. Hoặc một hàm async con có try/catch.',
      ],
      khoiDau: {
        'api.js': API,
        'main.js': `// Bài 5.3 — Phụ thuộc vs độc lập
async function taiTrangCaNhan(id) {
  try {
    const u = await layNguoiDung(id);
    const bai = await layBaiViet(u.id);
    const ban = await layBanBe(u.id);
    return { ten: u.ten, soBai: bai.length, soBan: ban.length };
  } catch (err) {
    return null;
  }
}
`,
      },
      loiGiai: {
        'api.js': API,
        'main.js': `// Bài 5.3 — Phụ thuộc vs độc lập

// Bạn bè là phần "có thì tốt": lỗi ⇒ null thay vì làm hỏng cả trang.
// Bắt lỗi NGAY TẠI phần đó, không bọc cả hàm — lỗi khác vẫn phải lộ ra.
async function layBanBeAnToan(userId) {
  try {
    return await layBanBe(userId);   // return await: lỗi ném ra TRONG try nên bắt được
  } catch {
    return null;
  }
}

async function taiTrangCaNhan(id) {
  // Bước 1 — mọi thứ sau cần u.id ⇒ phải chờ (lỗi ở đây ⇒ cả hàm reject)
  const u = await layNguoiDung(id);

  // Bước 2 + 3 — độc lập với nhau ⇒ bắt đầu cùng lúc, chờ một lần
  const [bai, ban] = await Promise.all([
    layBaiViet(u.id),
    layBanBeAnToan(u.id),
  ]);

  return {
    ten: u.ten,
    soBai: bai.length,
    soBan: ban === null ? null : ban.length,
  };
}
`,
      },
      giaiThich: `<p>Vẽ đồ thị phụ thuộc trước khi viết: người dùng → {bài viết, bạn bè}. Mũi tên nào có thật thì phải ${c('await')} tuần tự; hai việc cùng tầng thì ${c('Promise.all')}. Kết quả 300 ms thay vì 450.</p>
<p>Bắt lỗi đúng <em>phạm vi</em>: bản cũ bọc tất cả trong một try/catch lớn và trả ${c('null')} — mất cả trang vì một dịch vụ phụ, và che luôn lỗi thật của người dùng. ${c('return await')} trong try là chỗ hiếm hoi mà ${c('await')} trước return là bắt buộc: thiếu nó, Promise reject sau khi đã rời khối try. Máy chấm kiểm ba người dùng, thời gian, và lỗi 99 phải lộ ra.</p>`,
      loiHayGap: [
        'Đưa layNguoiDung vào cùng Promise.all — nhưng bước 2, 3 cần u.id.',
        `${c('return layBanBe(uid)')} trong try mà thiếu await — lỗi lọt ra, Promise.all reject.`,
        'Một try/catch bọc tất cả rồi trả null — nuốt lỗi người dùng không tồn tại.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#composition',
      kiem: [
        { moTa: 'Người dùng 1', goi: 'await taiTrangCaNhan(1)', mongDoi: { ten: 'Lan', soBai: 2, soBan: 2 } },
        { moTa: 'Đúng 300 ms (bước 2, 3 song song)', chuanBi: 'const t = Date.now(); await taiTrangCaNhan(1);', goi: 'Date.now() - t', mongDoi: 300 },
        { moTa: 'Bạn bè lỗi → soBan null, trang vẫn hiện', goi: 'await taiTrangCaNhan(3)', mongDoi: { ten: 'Hà', soBai: 1, soBan: null } },
        { moTa: 'Bạn bè lỗi vẫn 300 ms', chuanBi: 'const t = Date.now(); await taiTrangCaNhan(3);', goi: 'Date.now() - t', mongDoi: 300 },
        { moTa: 'Người dùng không tồn tại → reject', goi: 'await taiTrangCaNhan(99)', mongDoi: { loi: 'Error', thongDiep: 'Không tìm thấy người dùng 99' } },
        { moTa: 'Người dùng 2 (không có bài)', goi: 'await taiTrangCaNhan(2)', mongDoi: { ten: 'Minh', soBai: 0, soBan: 1 }, an: true },
        { moTa: 'Không dùng allSettled', kiem: 'ma-nguon', tep: 'main.js', khop: 'allSettled', phuDinh: true, an: true },
      ],
    },
  ],
});
