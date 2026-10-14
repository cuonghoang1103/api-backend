/** Bộ luyện bài 5.1 — Đồng bộ, bất đồng bộ và event loop. Lược đồ: ./_luoc-do.mjs (loại 'console' / 'js'). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const GIO_GIA = '<p><em>Máy chấm dùng đồng hồ GIẢ: setTimeout không bắt bạn chờ thật, nhưng thứ tự và thời điểm chạy y như trình duyệt.</em></p>';

const DOAN_1 = `function doanMa() {
  console.log("A");
  setTimeout(() => console.log("B"), 0);
  console.log("C");
  setTimeout(() => console.log("D"), 10);
  setTimeout(() => console.log("E"), 0);
  console.log("F");
}`;

const DOAN_2 = `function doanMa() {
  console.log("1");
  setTimeout(() => console.log("2"), 0);
  Promise.resolve().then(() => console.log("3"));
  queueMicrotask(() => console.log("4"));
  Promise.resolve().then(() => console.log("5"));
  console.log("6");
}`;

const DOAN_3 = `function doanMa() {
  console.log("A");
  setTimeout(() => {
    console.log("B");
    Promise.resolve().then(() => console.log("C"));
  }, 0);
  Promise.resolve().then(() => {
    console.log("D");
    setTimeout(() => console.log("E"), 0);
  });
  setTimeout(() => console.log("F"), 0);
  console.log("G");
}`;

export default doiDau({
  slug: 'wf-5-1-event-loop',
  ten: '5.1 Đồng bộ, bất đồng bộ và event loop',
  baiHoc: 'Nền tảng Web — Bài 5.1 Đồng bộ, bất đồng bộ và event loop',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Một luồng, call stack, hàng đợi task và microtask, vì sao setTimeout(…, 0) vẫn chạy sau cùng, vòng lặp đồng bộ chặn mọi thứ — 7 bài: đoán thứ tự in, rồi tự sắp xếp công việc cho đúng thứ tự. Máy chấm bắt từng dòng console.log.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'Đoán thứ tự in: code đồng bộ chạy hết trước',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['code đồng bộ', 'setTimeout', 'task queue', 'thứ tự hẹn giờ'],
      tienQuyet: ['hàm', 'mảng'],
      the: ['javascript', 'event-loop', 'setTimeout'],
      moTa: `<p>Bài 5.1: <em>"Đồng bộ chạy hết trước, rồi mới tới các callback trong hàng đợi."</em> Đọc hàm ${c('doanMa()')} dưới đây <strong>mà không chạy</strong>, rồi điền vào mảng ${c('duDoan')} thứ tự các chữ được in. Sau đó mới bấm Chạy để đối chiếu.</p>
<pre><code>${DOAN_1.replace(/</g, '&lt;')}</code></pre>
${GIO_GIA}`,
      yeuCau: [
        `${c('duDoan')} là mảng sáu chuỗi, theo đúng thứ tự in khi gọi ${c('doanMa()')}.`,
        `Không sửa hàm ${c('doanMa')} (máy chấm chạy nó để đối chiếu).`,
        'Điền giá trị bằng tay — không tính bằng code.',
      ],
      dauVao: 'Không có — đọc code.',
      dauRa: 'const duDoan = ["…", …];',
      rangBuoc: ['duDoan chỉ chứa chuỗi một chữ cái in hoa.'],
      viDu: [
        { input: 'console.log("x"); setTimeout(() => console.log("y"), 0); console.log("z");', output: '["x", "z", "y"]', explanation: 'Ví dụ trong bài học: hẹn 0 ms vẫn in cuối cùng.' },
      ],
      goiY: [
        'Chia làm hai lượt: lượt 1 là mọi console.log nằm thẳng trong hàm (không trong callback); lượt 2 là các setTimeout.',
        'Các setTimeout chạy theo thời điểm hẹn; cùng thời điểm thì theo thứ tự đã đăng ký. Hẹn 10 ms chạy sau mọi hẹn 0 ms.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.1 — Đoán thứ tự in. KHÔNG sửa doanMa.
${DOAN_1}

// Điền thứ tự bạn đoán, ví dụ ["A", "B", …]
const duDoan = [];
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.1 — Đoán thứ tự in. KHÔNG sửa doanMa.
${DOAN_1}

// Lượt 1 (đồng bộ, chạy ngay):        A, C, F
// Lượt 2 (hàng đợi, theo giờ hẹn):    B (0 ms), E (0 ms, đăng ký sau B), D (10 ms)
const duDoan = ["A", "C", "F", "B", "E", "D"];
`,
      },
      giaiThich: `<p>${c('setTimeout')} không chạy callback "sau 0 ms" mà "đưa callback vào hàng đợi, sớm nhất sau 0 ms". Event loop chỉ lấy việc từ hàng đợi khi call stack trống — tức khi ${c('doanMa()')} chạy xong cả ba lệnh in đồng bộ. Trong hàng đợi, các hẹn giờ ra theo thời điểm hẹn, cùng thời điểm thì theo thứ tự đăng ký: B rồi E, cuối cùng D (10 ms).</p>
<p>Máy chấm chạy ${c('doanMa()')} thật (đồng hồ giả, thứ tự y như trình duyệt) để chắc hàm không bị sửa, rồi so mảng ${c('duDoan')} của bạn.</p>`,
      loiHayGap: [
        'Xếp D trước E vì D được viết trước — thời điểm hẹn (10 ms) mới quyết định.',
        'Xếp B ngay sau A vì "0 ms là ngay lập tức".',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
      kiem: [
        { moTa: 'doanMa() vẫn in đúng như bản gốc (không bị sửa)', so: 'console', goi: 'doanMa()', mongDoi: ['A', 'C', 'F', 'B', 'E', 'D'] },
        { moTa: 'Dự đoán của bạn khớp thứ tự in thật', goi: 'duDoan', mongDoi: ['A', 'C', 'F', 'B', 'E', 'D'] },
        { moTa: 'Ba dòng đầu là phần đồng bộ', goi: 'duDoan.slice(0, 3)', mongDoi: ['A', 'C', 'F'] },
        { moTa: 'Điền bằng tay, không tính bằng code', kiem: 'ma-nguon', tep: 'main.js', khop: 'duDoan\\s*=\\s*\\[\\s*"[A-Z]"', },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Đoán thứ tự in: microtask chen trước setTimeout',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['microtask', 'Promise.then', 'queueMicrotask', 'task (macrotask)'],
      tienQuyet: ['setTimeout'],
      the: ['javascript', 'event-loop', 'microtask'],
      moTa: `<p>Bài 5.1, đoạn ${c('first / done sync / second / third')}: <em>"callback của promise nằm ở hàng đợi ưu tiên cao hơn hẹn giờ"</em>. Đoán thứ tự in của:</p>
<pre><code>${DOAN_2.replace(/</g, '&lt;')}</code></pre>
${GIO_GIA}`,
      yeuCau: [
        `${c('duDoan')}: mảng sáu chuỗi số theo thứ tự in.`,
        'Không sửa doanMa; điền giá trị bằng tay.',
      ],
      dauVao: 'Không có — đọc code.',
      dauRa: 'const duDoan = ["…", …];',
      rangBuoc: ['duDoan chỉ chứa chuỗi một chữ số.'],
      viDu: [
        { input: 'setTimeout(() => console.log("t"), 0);\nPromise.resolve().then(() => console.log("p"));', output: '["p", "t"]', explanation: 'Microtask (p) chạy hết trước khi event loop lấy task kế tiếp (t).' },
      ],
      goiY: [
        'Ba tầng: đồng bộ → TẤT CẢ microtask (then, queueMicrotask) theo thứ tự đăng ký → task hẹn giờ.',
        'queueMicrotask và Promise.resolve().then cùng vào MỘT hàng microtask.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.1 — Microtask và task. KHÔNG sửa doanMa.
${DOAN_2}

const duDoan = [];
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.1 — Microtask và task. KHÔNG sửa doanMa.
${DOAN_2}

// Đồng bộ: 1, 6
// Microtask (theo thứ tự đăng ký): 3, 4, 5
// Task hẹn giờ: 2
const duDoan = ["1", "6", "3", "4", "5", "2"];
`,
      },
      giaiThich: `<p>Sau mỗi task (ở đây là lần chạy ${c('doanMa')}), event loop <strong>xả sạch hàng microtask</strong> rồi mới lấy task kế tiếp. Callback của ${c('.then')} và ${c('queueMicrotask')} là microtask; ${c('setTimeout')} là task. Nên dù hẹn 0 ms, "2" vẫn đứng sau cả ba microtask.</p>
<p>Hệ quả thực tế: một chuỗi promise dài chạy liền một mạch không nhường chỗ cho hẹn giờ hay vẽ lại màn hình. Máy chấm chạy doanMa thật rồi so mảng của bạn.</p>`,
      loiHayGap: [
        'Xếp "4" sau "5" vì nghĩ queueMicrotask là một hàng riêng — cùng một hàng.',
        'Xếp "2" trước "3" vì setTimeout được viết trước.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide',
      kiem: [
        { moTa: 'doanMa() vẫn in như bản gốc', so: 'console', goi: 'doanMa()', mongDoi: ['1', '6', '3', '4', '5', '2'] },
        { moTa: 'Dự đoán khớp thứ tự in thật', goi: 'duDoan', mongDoi: ['1', '6', '3', '4', '5', '2'] },
        { moTa: '"2" (setTimeout) đứng cuối', goi: 'duDoan[duDoan.length - 1]', mongDoi: '2' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Hoãn việc chậm ra sau: trang hiện trước, email gửi sau',
      doKho: 'EASY', phut: 10, loaiKiem: 'console',
      khaiNiem: ['setTimeout(…, 0)', 'nhường call stack', 'template literal'],
      tienQuyet: ['setTimeout'],
      the: ['javascript', 'event-loop', 'setTimeout'],
      moTa: `<p>Khi người dùng đăng ký, ${c('dangKy(ten)')} làm hai việc: báo ${c('"Đang xử lý <ten>"')} ngay lập tức, và "gửi email chào mừng" — một việc chậm không cần xong trước khi trang hiện. Code khởi đầu làm cả hai liền một mạch nên dòng ${c('"Trang đã hiện"')} của người gọi bị đẩy xuống sau. Dùng ${c('setTimeout(…, 0)')} để hoãn phần email ra sau mọi code đồng bộ đang chạy.</p>
${GIO_GIA}`,
      yeuCau: [
        `${c('dangKy("Lan")')} in ngay ${c('"Đang xử lý Lan"')}.`,
        `${c('"Đã gửi email cho Lan"')} được in SAU mọi code đồng bộ của người gọi — bằng ${c('setTimeout')}.`,
        'Gọi dangKy hai lần liền nhau: hai dòng "Đang xử lý" in trước, hai dòng email in sau, giữ thứ tự gọi.',
      ],
      dauVao: 'ten: string.',
      dauRa: 'Các dòng console theo thứ tự yêu cầu.',
      rangBuoc: ['Không đổi nội dung chữ của hai dòng in.'],
      viDu: [
        { input: 'dangKy("Lan");\nconsole.log("Trang đã hiện");', output: 'Đang xử lý Lan\nTrang đã hiện\nĐã gửi email cho Lan', explanation: 'Phần email chờ trong hàng đợi tới khi call stack trống.' },
      ],
      goiY: [
        'Bọc đúng dòng in email trong setTimeout(() => { … }, 0).',
        'setTimeout(() => console.log(´Đã gửi email cho @{ten}´), 0);',
      ],
      khoiDau: {
        'main.js': `// Bài 5.1 — Hoãn việc chậm
function dangKy(ten) {
  console.log(´Đang xử lý @{ten}´);
  console.log(´Đã gửi email cho @{ten}´);
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.1 — Hoãn việc chậm
function dangKy(ten) {
  console.log(´Đang xử lý @{ten}´);           // phản hồi tức thì cho người dùng

  // Việc chậm, không gấp: đưa vào hàng đợi. Nó chỉ chạy khi call stack trống,
  // tức sau khi người gọi (và mọi code đồng bộ khác) đã chạy xong.
  setTimeout(() => {
    console.log(´Đã gửi email cho @{ten}´);
  }, 0);
}
`,
      },
      giaiThich: `<p>${c('setTimeout(fn, 0)')} là cách đơn giản nhất nói "làm việc này, nhưng không phải bây giờ": ${c('fn')} vào hàng đợi, call stack chạy tiếp phần còn lại của người gọi. Hai lần gọi ${c('dangKy')} đặt hai hẹn giờ cùng thời điểm, chạy theo thứ tự đăng ký.</p>
<p>Máy chấm gọi hàm theo hai kịch bản và so toàn bộ dãy dòng in.</p>`,
      loiHayGap: [
        'Bọc cả hai dòng trong setTimeout — "Đang xử lý" cũng bị trễ.',
        `Viết ${c('setTimeout(console.log(…), 0)')} — gọi log NGAY rồi đưa kết quả (undefined) cho setTimeout.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout',
      kiem: [
        { moTa: 'Một lần đăng ký', goi: '(dangKy("Lan"), console.log("Trang đã hiện"))', mongDoi: ['Đang xử lý Lan', 'Trang đã hiện', 'Đã gửi email cho Lan'] },
        { moTa: 'Hai lần đăng ký liền nhau', goi: '(dangKy("A"), dangKy("B"), console.log("X"))', mongDoi: ['Đang xử lý A', 'Đang xử lý B', 'X', 'Đã gửi email cho A', 'Đã gửi email cho B'] },
        { moTa: 'Dùng setTimeout', kiem: 'ma-nguon', tep: 'main.js', khop: 'setTimeout\\s*\\(' },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Thông báo ưu tiên: microtask cho việc gấp, task cho việc thường',
      doKho: 'MEDIUM', phut: 15, loaiKiem: 'console',
      khaiNiem: ['queueMicrotask', 'setTimeout', 'chốt chặn đầu vào', 'TypeError'],
      tienQuyet: ['microtask', 'setTimeout'],
      the: ['javascript', 'event-loop', 'microtask'],
      moTa: `<p>Hệ thống thông báo nhận việc từ nhiều nơi trong một lượt chạy. Viết ${c('guiThongBao(loai, noiDung)')}: không in ngay, mà xếp lịch sao cho sau khi code đồng bộ chạy xong, <strong>mọi thông báo gấp in trước mọi thông báo thường</strong> — bất kể thứ tự gọi. Đó đúng là quan hệ microtask / task của Bài 5.1.</p>
${GIO_GIA}`,
      yeuCau: [
        `${c('loai === "gap"')} → in ${c('"[GẤP] <noiDung>"')} bằng ${c('queueMicrotask')} (hoặc ${c('Promise.resolve().then')}).`,
        `${c('loai === "thuong"')} → in ${c('"[thường] <noiDung>"')} bằng ${c('setTimeout(…, 0)')}.`,
        'Trong cùng một loại, giữ thứ tự gọi.',
        `Loại khác → ném ${c('TypeError')} ngay lúc gọi (đồng bộ), thông điệp chứa tên loại sai.`,
      ],
      dauVao: 'loai: "gap" | "thuong"; noiDung: string.',
      dauRa: 'Các dòng console.',
      rangBuoc: ['Không tự sắp xếp bằng mảng — để event loop làm việc đó.'],
      viDu: [
        { input: 'guiThongBao("thuong", "Có bài mới");\nguiThongBao("gap", "Mất kết nối");\nconsole.log("render xong");', output: 'render xong\n[GẤP] Mất kết nối\n[thường] Có bài mới', explanation: 'Gọi "thường" trước nhưng in sau.' },
      ],
      goiY: [
        'Hai hàng đợi có sẵn của event loop làm hộ việc ưu tiên: microtask luôn xả hết trước task kế tiếp.',
        'if (loai === "gap") queueMicrotask(() => console.log(´[GẤP] @{noiDung}´)); else if (loai === "thuong") setTimeout(…, 0); else throw new TypeError(´Loại không hợp lệ: @{loai}´);',
      ],
      khoiDau: {
        'main.js': `// Bài 5.1 — Thông báo ưu tiên
function guiThongBao(loai, noiDung) {
  if (loai === "gap") {
    console.log(´[GẤP] @{noiDung}´);
  } else {
    console.log(´[thường] @{noiDung}´);
  }
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.1 — Thông báo ưu tiên
function guiThongBao(loai, noiDung) {
  if (loai === "gap") {
    // microtask: chạy ngay khi call stack trống, TRƯỚC mọi task hẹn giờ
    queueMicrotask(() => console.log(´[GẤP] @{noiDung}´));
  } else if (loai === "thuong") {
    // task: chờ tới lượt của event loop, sau khi hàng microtask đã xả hết
    setTimeout(() => console.log(´[thường] @{noiDung}´), 0);
  } else {
    // lỗi đầu vào: báo ngay, đồng bộ — đừng để nó lặng lẽ biến mất trong hàng đợi
    throw new TypeError(´Loại không hợp lệ: @{loai}´);
  }
}
`,
      },
      giaiThich: `<p>Không cần tự viết hàng đợi ưu tiên: event loop đã có hai tầng. Đặt việc gấp vào microtask, việc thường vào task, rồi để luật "xả hết microtask trước task kế tiếp" làm phần còn lại. Mỗi tầng là FIFO nên thứ tự gọi trong cùng loại được giữ.</p>
<p>Ném lỗi đầu vào <em>đồng bộ</em> quan trọng: nếu ném bên trong callback hẹn giờ, người gọi không bắt được bằng ${c('try/catch')}. Máy chấm gọi xen kẽ năm thông báo và một loại sai.</p>`,
      loiHayGap: [
        'Dùng setTimeout cho cả hai với độ trễ khác nhau (0 và 1 ms) — chạy được ở đây, nhưng phụ thuộc thời gian thay vì cơ chế.',
        'Ném lỗi bên trong callback — người gọi không bắt được.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask',
      kiem: [
        { moTa: 'Gấp in trước thường, sau code đồng bộ', goi: '(guiThongBao("thuong", "Có bài mới"), guiThongBao("gap", "Mất kết nối"), console.log("render xong"))', mongDoi: ['render xong', '[GẤP] Mất kết nối', '[thường] Có bài mới'] },
        { moTa: 'Xen kẽ năm thông báo — giữ thứ tự trong từng loại', goi: '(guiThongBao("thuong", "t1"), guiThongBao("gap", "g1"), guiThongBao("thuong", "t2"), guiThongBao("gap", "g2"), guiThongBao("gap", "g3"))', mongDoi: ['[GẤP] g1', '[GẤP] g2', '[GẤP] g3', '[thường] t1', '[thường] t2'] },
        { moTa: 'Loại sai → TypeError ngay khi gọi', so: 'giaTri', goi: 'guiThongBao("khac", "x")', mongDoi: { loi: 'TypeError', thongDiep: 'khac' } },
        { moTa: 'Không in đồng bộ', goi: '(guiThongBao("gap", "a"), console.log("sau"))', mongDoi: ['sau', '[GẤP] a'], an: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Đồng hồ đếm ngược in toàn số 0: var trong vòng lặp hẹn giờ',
      doKho: 'MEDIUM', phut: 15, loaiKiem: 'console',
      khaiNiem: ['setTimeout trong vòng lặp', 'var vs let', 'closure', 'thời điểm hẹn'],
      tienQuyet: ['setTimeout', 'let / var', 'closure'],
      the: ['javascript', 'event-loop', 'closure', 'pitfall'],
      moTa: `<p>${c('demNguoc(n)')} phải in ${c('n')}, ${c('n-1')}, …, ${c('1')} cách nhau 1 giây (số đầu tiên in ngay lúc 0 ms), rồi ${c('"Hết giờ!"')} ở giây thứ ${c('n')}. Bản cũ in ra ${c('0, 0, 0, Hết giờ!')}. Lý do nằm ở hai bài: callback chạy <em>sau</em> khi vòng lặp đã xong (5.1), và ${c('var')} chỉ có MỘT biến dùng chung cho mọi lượt (4.1).</p>
${GIO_GIA}`,
      yeuCau: [
        `${c('demNguoc(3)')} in ${c('3, 2, 1, Hết giờ!')} ở các mốc 0, 1000, 2000, 3000 ms.`,
        `${c('demNguoc(0)')} chỉ in ${c('"Hết giờ!"')} (ở mốc 0 ms).`,
        `Không dùng ${c('var')}.`,
      ],
      dauVao: 'n: số nguyên >= 0.',
      dauRa: 'n + 1 dòng console theo đúng mốc thời gian.',
      rangBuoc: ['In số dưới dạng chuỗi (console.log(String(i)) hoặc console.log(i) đều ra "3").'],
      viDu: [
        { input: 'demNguoc(3)', output: '3   (0 ms)\n2   (1000 ms)\n1   (2000 ms)\nHết giờ!   (3000 ms)', explanation: 'Mỗi lượt lặp đặt một hẹn giờ với độ trễ riêng.' },
        { input: '(code khởi đầu) demNguoc(3)', output: '0\n0\n0\nHết giờ!', explanation: 'Lúc các callback chạy, vòng lặp đã xong và biến var i duy nhất đang bằng 0.' },
      ],
      goiY: [
        'Lúc callback chạy, nó đọc giá trị HIỆN TẠI của i. Với var, cả ba callback cùng đọc MỘT biến i — đã thành 0.',
        'Đổi var thành let: mỗi lượt lặp có biến i riêng, mỗi callback giữ đúng i của lượt mình.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.1 — Đếm ngược
function demNguoc(n) {
  for (var i = n; i > 0; i--) {
    setTimeout(() => console.log(i), (n - i) * 1000);
  }
  setTimeout(() => console.log("Hết giờ!"), n * 1000);
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.1 — Đếm ngược
function demNguoc(n) {
  // let: MỖI lượt lặp có một biến i riêng ⇒ mỗi callback nhớ đúng i của lượt đó.
  // (var: một biến i chung — khi các callback chạy, vòng lặp đã xong và i = 0)
  for (let i = n; i > 0; i--) {
    setTimeout(() => console.log(i), (n - i) * 1000);   // n ở 0 ms, n-1 ở 1000 ms, ...
  }
  setTimeout(() => console.log("Hết giờ!"), n * 1000);
}
`,
      },
      giaiThich: `<p>Vòng lặp chạy xong <em>đồng bộ</em> trong tích tắc, chỉ đặt hẹn giờ; các callback chạy muộn hơn nhiều. Với ${c('var')}, chỉ có một biến ${c('i')} cho cả hàm, và lúc callback đọc nó thì nó đã là 0. Với ${c('let')}, mỗi lượt lặp tạo một biến mới — ba callback đóng gói ba biến khác nhau (closure, Bài 4.3).</p>
<p>Máy chấm chạy với đồng hồ giả và kiểm cả thứ tự lẫn <em>thời điểm</em>: ở mốc 2500 ms phải đã in đúng ba dòng.</p>`,
      loiHayGap: [
        'Đặt mọi hẹn giờ cùng độ trễ 1000 — cả ba in cùng lúc.',
        'Dùng setInterval rồi quên clearInterval — đếm xuống số âm mãi.',
      ],
      thamKhao: 'https://javascript.info/closure#closures-in-loops',
      kiem: [
        { moTa: 'demNguoc(3) in 3, 2, 1, Hết giờ!', goi: 'demNguoc(3)', mongDoi: ['3', '2', '1', 'Hết giờ!'] },
        { moTa: 'demNguoc(0) chỉ in Hết giờ!', goi: 'demNguoc(0)', mongDoi: ['Hết giờ!'] },
        { moTa: 'Đúng mốc thời gian: tới 2500 ms đã in 3 dòng', so: 'giaTri', chuanBi: 'demNguoc(3); await new Promise((r) => setTimeout(r, 2500));', goi: '__log.slice()', mongDoi: ['3', '2', '1'] },
        { moTa: 'Không dùng var', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bvar\\b', phuDinh: true },
        { moTa: 'demNguoc(5) đủ 6 dòng', goi: 'demNguoc(5)', mongDoi: ['5', '4', '3', '2', '1', 'Hết giờ!'], an: true },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Đoán thứ tự in: hẹn giờ trong microtask, microtask trong hẹn giờ',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['xả microtask sau MỖI task', 'lồng setTimeout / then', 'event loop từng vòng'],
      tienQuyet: ['microtask', 'setTimeout'],
      the: ['javascript', 'event-loop', 'microtask'],
      moTa: `<p>Bài khó hơn hai bài đoán trước: callback lồng nhau tạo thêm việc mới <em>trong lúc</em> event loop đang chạy. Đoán thứ tự in:</p>
<pre><code>${DOAN_3.replace(/</g, '&lt;')}</code></pre>
<p>Ngoài ${c('duDoan')}, điền ${c('soVongTask')} = số task hẹn giờ phải chạy (không tính lần gọi doanMa).</p>
${GIO_GIA}`,
      yeuCau: [
        `${c('duDoan')}: mảng bảy chữ theo thứ tự in.`,
        `${c('soVongTask')}: một số nguyên.`,
        'Không sửa doanMa; điền bằng tay.',
      ],
      dauVao: 'Không có — đọc code.',
      dauRa: 'const duDoan = [...]; const soVongTask = …;',
      rangBuoc: ['Điền bằng tay.'],
      viDu: [
        { input: 'setTimeout(() => { console.log("x"); Promise.resolve().then(() => console.log("y")); }, 0);\nsetTimeout(() => console.log("z"), 0);', output: '["x", "y", "z"]', explanation: 'Sau task x, microtask y được xả TRƯỚC task z.' },
      ],
      goiY: [
        'Mô phỏng từng vòng: [đồng bộ] → xả microtask → task 1 → xả microtask → task 2 → … Ghi ra hai cột "hàng task" và "hàng microtask" trên giấy.',
        'Hẹn giờ E được đặt BÊN TRONG microtask D — tức sau khi B và F đã nằm sẵn trong hàng task.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.1 — Lồng nhau. KHÔNG sửa doanMa.
${DOAN_3}

const duDoan = [];
const soVongTask = 0;
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.1 — Lồng nhau. KHÔNG sửa doanMa.
${DOAN_3}

// Đồng bộ:                     A, G       (hàng task: B, F · hàng microtask: D)
// Xả microtask:                D          (D đặt thêm task E ⇒ hàng task: B, F, E)
// Task B:                      B          (B đặt microtask C)
// Xả microtask sau task B:     C
// Task F:                      F
// Task E:                      E
const duDoan = ["A", "G", "D", "B", "C", "F", "E"];
const soVongTask = 3;   // B, F, E
`,
      },
      giaiThich: `<p>Hai luật đủ giải mọi bài loại này: (1) sau <em>mỗi</em> task, event loop xả sạch microtask trước khi lấy task kế; (2) việc mới được thêm vào CUỐI hàng tương ứng tại thời điểm nó được đặt. C là microtask sinh ra trong task B nên chạy ngay sau B, trước F. E là task sinh ra trong microtask D — lúc đó B và F đã xếp hàng, nên E đứng cuối.</p>
<p>Máy chấm chạy doanMa thật và so cả hai giá trị.</p>`,
      loiHayGap: [
        'Xếp C ở cuối cùng (sau mọi task) — microtask được xả sau MỖI task, không chỉ sau đồng bộ.',
        'Xếp E trước F vì E nằm trong microtask "chạy sớm" — chỉ D chạy sớm; E vẫn là task, xếp sau những task có sẵn.',
      ],
      thamKhao: 'https://javascript.info/event-loop',
      kiem: [
        { moTa: 'doanMa() vẫn in như bản gốc', so: 'console', goi: 'doanMa()', mongDoi: ['A', 'G', 'D', 'B', 'C', 'F', 'E'] },
        { moTa: 'Dự đoán khớp thứ tự thật', goi: 'duDoan', mongDoi: ['A', 'G', 'D', 'B', 'C', 'F', 'E'] },
        { moTa: 'C chạy ngay sau B', goi: 'duDoan.indexOf("C") - duDoan.indexOf("B")', mongDoi: 1 },
        { moTa: 'soVongTask = 3', goi: 'soVongTask', mongDoi: 3 },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Xử lý theo lô: đừng để vòng lặp dài đóng băng trang',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['vòng lặp đồng bộ chặn event loop', 'chia nhỏ công việc', 'setTimeout(…, 0) để nhường', 'callback hoàn tất', 'luôn bất đồng bộ'],
      tienQuyet: ['setTimeout', 'callback', 'mảng'],
      the: ['javascript', 'event-loop', 'performance'],
      moTa: `<p>Bài 5.1, mục bẫy: <em>"một vòng lặp đồng bộ dài chặn MỌI thứ — hẹn giờ, cú bấm, cả vòng quay 'đang tải'."</em> Hàm xử lý 50.000 dòng dữ liệu một mạch làm trang đứng hình vài giây. Cách chữa kinh điển: chia thành <strong>lô</strong>, xử lý một lô, rồi nhường event loop (${c('setTimeout(…, 0)')}) để trình duyệt kịp xử lý cú bấm và vẽ lại, rồi mới làm lô kế.</p>
<p>Viết ${c('xuLyTheoLo(mang, kichThuocLo, xuLy, xong)')}:</p>
<ul><li>Lô đầu xử lý <strong>ngay</strong> (đồng bộ) khi gọi; mỗi lô sau chạy trong một ${c('setTimeout(…, 0)')} mới.</li>
<li>${c('xuLy(phanTu)')} trả về giá trị mới; kết quả cuối là mảng các giá trị đó theo thứ tự gốc.</li>
<li>Xong hết thì gọi ${c('xong(ketQua)')} — <strong>luôn bất đồng bộ</strong>, kể cả khi mảng rỗng.</li></ul>
${GIO_GIA}`,
      yeuCau: [
        `${c('xong')} nhận ${c('[2, 4, 6, 8, 10]')} với ${c('mang = [1..5]')}, ${c('xuLy = x => x * 2')}.`,
        'Giữa hai lô, một cú bấm (task đã xếp hàng trước) phải chạy được.',
        `Mảng rỗng: ${c('xong([])')} được gọi nhưng KHÔNG đồng bộ (sau khi xuLyTheoLo đã trả về).`,
        `${c('kichThuocLo')} không phải số nguyên dương → ném ${c('RangeError')} ngay.`,
        `${c('xong')} chỉ được gọi đúng một lần.`,
      ],
      dauVao: 'mang: mảng; kichThuocLo: số nguyên >= 1; xuLy: hàm; xong: hàm.',
      dauRa: 'Không trả về gì; kết quả đi qua xong(ketQua).',
      rangBuoc: ['Không dùng Promise/async (bài 5.2–5.3) — luyện callback + setTimeout.', 'Không sửa mảng đầu vào.'],
      viDu: [
        { input: 'Đã có hẹn giờ "click" xếp hàng; gọi xuLyTheoLo([1,2,3,4,5], 2, ghi, xong)', output: 'Thứ tự: 1, 2, click, 3, 4, 5, rồi xong', explanation: 'Lô [1,2] chạy ngay; lô [3,4] xếp hàng SAU cú bấm.' },
        { input: '(code khởi đầu) cùng kịch bản', output: '1, 2, 3, 4, 5, xong, click', explanation: 'Một mạch đồng bộ — cú bấm phải chờ tới khi xong hết.' },
      ],
      goiY: [
        'Viết một hàm con chayLo(batDau) xử lý mang[batDau … batDau + kichThuocLo - 1]; còn phần tử thì setTimeout(() => chayLo(batDau + kichThuocLo), 0); hết thì setTimeout(() => xong(ketQua), 0).',
        'Gọi chayLo(0) trực tiếp (lô đầu đồng bộ). Với mảng rỗng, chayLo(0) không xử lý gì và đi thẳng nhánh "hết" — vẫn qua setTimeout nên vẫn bất đồng bộ.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.1 — Xử lý theo lô
function xuLyTheoLo(mang, kichThuocLo, xuLy, xong) {
  const ketQua = [];
  for (const x of mang) {
    ketQua.push(xuLy(x));      // một mạch: trang đứng hình tới khi xong
  }
  xong(ketQua);
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.1 — Xử lý theo lô
function xuLyTheoLo(mang, kichThuocLo, xuLy, xong) {
  // Chốt chặn đồng bộ: báo lỗi cho người gọi NGAY, đừng để lỗi chìm trong hàng đợi
  if (!Number.isInteger(kichThuocLo) || kichThuocLo < 1) {
    throw new RangeError("kichThuocLo phải là số nguyên >= 1");
  }

  const ketQua = [];

  function chayLo(batDau) {
    const ketThuc = Math.min(batDau + kichThuocLo, mang.length);
    for (let i = batDau; i < ketThuc; i++) {
      ketQua.push(xuLy(mang[i]));          // một lô nhỏ: chiếm call stack rất ngắn
    }
    if (ketThuc < mang.length) {
      // Nhường event loop: cú bấm, hẹn giờ, việc vẽ lại đã xếp hàng được chạy trước lô kế
      setTimeout(() => chayLo(ketThuc), 0);
    } else {
      // "Luôn bất đồng bộ": người gọi không phải đoán xong() chạy trước hay sau dòng kế tiếp
      setTimeout(() => xong(ketQua), 0);
    }
  }

  chayLo(0);   // lô đầu chạy ngay
}
`,
      },
      giaiThich: `<p>Một luồng nghĩa là trong lúc vòng lặp của bạn chạy, trình duyệt không làm được gì khác — không xử lý cú bấm, không vẽ lại. Chia lô + ${c('setTimeout(…, 0)')} trả quyền điều khiển cho event loop sau mỗi lô: những task đã xếp hàng (như cú bấm) chen vào giữa. Tổng thời gian dài hơn chút, nhưng trang không bao giờ đứng hình lâu hơn một lô.</p>
<p>"Luôn bất đồng bộ" là một luật thiết kế API: nếu ${c('xong')} lúc thì gọi đồng bộ (mảng rỗng) lúc thì bất đồng bộ, code người gọi sẽ chạy theo hai thứ tự khác nhau tuỳ dữ liệu — một loại lỗi rất khó tìm. Máy chấm kiểm kết quả, thứ tự xen kẽ với cú bấm, mảng rỗng, ${c('xong')} gọi một lần, và RangeError.</p>`,
      loiHayGap: [
        'Đặt mọi lô vào hẹn giờ cùng lúc trong một vòng for — chúng vẫn chạy liền nhau, cú bấm chỉ chen được trước lô đầu.',
        'Gọi xong(ketQua) đồng bộ khi mảng rỗng.',
        'Ném RangeError bên trong setTimeout — người gọi không bắt được.',
        'Dùng ketQua[i] = … với chỉ số lệch giữa các lô.',
      ],
      thamKhao: 'https://web.dev/articles/optimize-long-tasks',
      kiem: [
        { moTa: 'Kết quả đúng thứ tự', so: 'giaTri', chuanBi: 'const kq = await new Promise((r) => xuLyTheoLo([1, 2, 3, 4, 5], 2, (x) => x * 2, r));', goi: 'kq', mongDoi: [2, 4, 6, 8, 10] },
        { moTa: 'Cú bấm chen được giữa hai lô', so: 'giaTri', chuanBi: 'const log = []; setTimeout(() => log.push("click"), 0); await new Promise((r) => xuLyTheoLo([1, 2, 3, 4, 5], 2, (x) => { log.push(x); return x; }, () => { log.push("xong"); r(); }));', goi: 'log', mongDoi: [1, 2, 'click', 3, 4, 5, 'xong'] },
        { moTa: 'Mảng rỗng: xong được gọi, nhưng bất đồng bộ', so: 'giaTri', chuanBi: 'let daGoi = false; let nhan = null; xuLyTheoLo([], 3, (x) => x, (kq) => { daGoi = true; nhan = kq; }); const ngay = daGoi; await new Promise((r) => setTimeout(r, 0));', goi: '[ngay, daGoi, nhan]', mongDoi: [false, true, []] },
        { moTa: 'Lô đầu chạy đồng bộ', so: 'giaTri', chuanBi: 'const log = []; xuLyTheoLo([1, 2, 3], 2, (x) => { log.push(x); return x; }, () => {}); const ngay = log.slice();', goi: 'ngay', mongDoi: [1, 2] },
        { moTa: 'xong chỉ được gọi một lần', so: 'giaTri', chuanBi: 'let soLan = 0; xuLyTheoLo([1, 2, 3, 4], 1, (x) => x, () => { soLan++; }); await new Promise((r) => setTimeout(r, 50));', goi: 'soLan', mongDoi: 1 },
        { moTa: 'kichThuocLo = 0 → RangeError', so: 'giaTri', goi: 'xuLyTheoLo([1], 0, (x) => x, () => {})', mongDoi: { loi: 'RangeError' } },
        { moTa: 'Lô lớn hơn mảng: một lô', so: 'giaTri', chuanBi: 'const log = []; setTimeout(() => log.push("click"), 0); await new Promise((r) => xuLyTheoLo([7, 8], 10, (x) => { log.push(x); return x; }, () => r()));', goi: 'log', mongDoi: [7, 8, 'click'], an: true },
        { moTa: 'Không dùng Promise / async', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bPromise\\b|\\basync\\b|\\bawait\\b', phuDinh: true, an: true },
      ],
    },
  ],
});
