/** Bộ luyện bài 13.4 — Giả lập & CI. Lược đồ: ./_luoc-do.mjs (loại 'js'; dùng fetch GIẢ `fetchGia` và đồng hồ ẢO của máy chấm).
 *  kiem[].moTa = "EN|||VI". */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 13.4 — Giả lập và chạy test trong CI.</em> Máy chấm KHÔNG có mạng thật: nó đưa cho bạn <code>fetch</code> giả và đồng hồ ảo (<code>setTimeout</code> và <code>Date.now()</code> chạy tức thì) — đúng những gì một test tốt làm.</p>';
const FAKE = 'const reply = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });';

export default doiDau({
  slug: 'wf-13-4-mocking-ci',
  ten: '13.4 Giả lập và chạy test trong CI',
  baiHoc: 'Nền tảng Web — Bài 13.4 Mocking và CI',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Tiêm fetch để test được, hàm giả tự ghi lời gọi (vi.fn tí hon), đường lỗi 404/500/mất mạng, debounce trên đồng hồ ảo, tiêm thời gian cho lời chào, retry có chờ — 6 bài, không một byte mạng thật.',
  de: [
    {
      tieuDe: 'Tiêm fetch để test được',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['dependency injection', 'tham số mặc định'], tienQuyet: ['async/await', 'fetch'], the: ['javascript', 'testing', 'mock'],
      moTa: `${BAI}<p>${c('getUserName(id)')} đang gọi thẳng ${c('fetch')} toàn cục nên test không thay được. Thêm tham số ${c('fetchFn = fetch')} và dùng nó. Hàm gọi ${c('"/api/users/" + id')}, trả ${c('data.name')}. Máy chấm sẽ gọi cả có lẫn không có ${c('fetchFn')}.</p>`,
      yeuCau: [`Chữ ký ${c('getUserName(id, fetchFn = fetch)')}.`, 'Gọi đúng URL /api/users/<id>.', 'Không truyền fetchFn ⇒ dùng fetch toàn cục.'],
      dauVao: 'id: number; fetchFn?: hàm.', dauRa: 'Promise<string>.',
      rangBuoc: ['Không gọi fetch trực tiếp trong thân hàm.'],
      viDu: [{ input: 'await getUserName(7, fakeFetch)', output: '"Lan"', explanation: 'fakeFetch trả { name: "Lan" }.' }],
      goiY: ['async function getUserName(id, fetchFn = fetch) { … }', 'const res = await fetchFn("/api/users/" + id); const data = await res.json(); return data.name;'],
      fetchGia: { '/api/users/7': { status: 200, json: { id: 7, name: 'Lan' } } },
      khoiDau: { 'main.js': `// Bài 13.4 — tiêm fetch
async function getUserName(id) {
  const res = await fetch('/api/users/' + id);
  const data = await res.json();
  return data.name;
}
` },
      loiGiai: { 'main.js': `// Bài 13.4 — tiêm fetch: code thật dùng fetch mặc định, test đưa hàm giả của riêng nó
async function getUserName(id, fetchFn = fetch) {
  const res = await fetchFn('/api/users/' + id);
  const data = await res.json();
  return data.name;
}
` },
      giaiThich: `<p>Tham số mặc định là cách tiêm phụ thuộc đơn giản nhất: nơi gọi thật không phải đổi gì, test thì đưa vào một hàm giả trả đúng thứ cần. Không cần vá ${c('globalThis.fetch')} — vốn dễ quên trả lại và làm hỏng test khác.</p>`,
      loiHayGap: ['Gán globalThis.fetch = … trong code — ảnh hưởng mọi nơi.', 'Đặt fetchFn trước id — mọi nơi gọi cũ vỡ.'],
      thamKhao: 'https://vitest.dev/guide/mocking.html',
      kiem: [
        { moTa: 'Uses the injected fake|||Dùng hàm giả được tiêm', chuanBi: `${FAKE} const calls = []; const fake = async (url) => { calls.push(url); return reply(200, { name: 'Minh' }); };`, goi: '[await getUserName(9, fake), calls]', mongDoi: ['Minh', ['/api/users/9']] },
        { moTa: 'Falls back to the global fetch|||Không tiêm thì dùng fetch toàn cục', goi: 'await getUserName(7)', mongDoi: 'Lan' },
        { moTa: 'Declares fetchFn = fetch|||Khai báo fetchFn = fetch', kiem: 'ma-nguon', tep: 'main.js', khop: 'fetchFn\\s*=\\s*fetch' },
      ],
    },
    {
      tieuDe: 'Hàm giả tự ghi lời gọi (vi.fn tí hon)',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['spy', 'closure', 'hàm cũng là object'], tienQuyet: ['closure', 'rest parameter'], the: ['javascript', 'testing', 'mock'],
      moTa: `${BAI}<p>Viết ${c('createSpy()')} — phiên bản nhỏ của ${c('vi.fn()')}: trả về một hàm ghi lại đối số của MỖI lần gọi vào mảng ${c('spy.calls')}; ${c('spy.callCount')} là số lần gọi; ${c('spy.returns(v)')} làm mọi lần gọi sau trả ${c('v')} (và trả lại chính spy để nối chuỗi); mặc định trả ${c('undefined')}.</p>`,
      yeuCau: ['spy.calls là mảng các mảng đối số.', 'callCount đúng.', 'returns(v) đổi giá trị trả về và nối chuỗi được.'],
      dauVao: 'Không.', dauRa: 'Một hàm có thêm calls, callCount, returns.',
      rangBuoc: ['Hai spy không dùng chung dữ liệu.'],
      viDu: [{ input: 'const s = createSpy().returns(5); s(1, 2); s.calls', output: '[[1, 2]]', explanation: 'Ghi đúng đối số.' }],
      goiY: ['const spy = (...args) => { spy.calls.push(args); return value; }; spy.calls = [];', 'callCount nên là getter: Object.defineProperty(spy, "callCount", { get: () => spy.calls.length })'],
      khoiDau: { 'main.js': `// Bài 13.4 — spy tí hon
function createSpy() {
  return function () {};
}
` },
      loiGiai: { 'main.js': `// Bài 13.4 — spy tí hon: closure giữ giá trị trả về, thuộc tính trên chính hàm giữ lịch sử gọi
function createSpy() {
  let value;                                   // giá trị trả về hiện tại
  const spy = (...args) => {
    spy.calls.push(args);                      // ghi lại đối số của lần gọi này
    return value;
  };
  spy.calls = [];
  Object.defineProperty(spy, 'callCount', { get: () => spy.calls.length });
  spy.returns = (v) => { value = v; return spy; };   // trả spy để nối chuỗi
  return spy;
}
` },
      giaiThich: `<p>Hàm trong JavaScript là object, nên gắn thêm ${c('calls')} hay ${c('returns')} được. ${c('value')} sống trong closure (bài 11.1), mỗi lần ${c('createSpy()')} có bản riêng. ${c('vi.fn')} của Vitest là cùng ý tưởng với nhiều tính năng hơn (${c('mockResolvedValue')}, ${c('mock.calls')}…).</p>`,
      loiHayGap: ['Lưu calls ở biến toàn cục — hai spy lẫn nhau.', 'callCount là số cố định gán một lần — không cập nhật.'],
      thamKhao: 'https://vitest.dev/api/mock.html',
      kiem: [
        { moTa: 'Records the arguments of every call|||Ghi đối số của mọi lần gọi', chuanBi: 'const s = createSpy(); s(1, 2); s("a");', goi: '[s.calls, s.callCount]', mongDoi: [[[1, 2], ['a']], 2] },
        { moTa: 'returns(v) is chainable and sets the result|||returns(v) nối chuỗi được và đặt kết quả', chuanBi: 'const s = createSpy().returns(42);', goi: '[s(), s("x"), s.callCount]', mongDoi: [42, 42, 2] },
        { moTa: 'Defaults to undefined; spies are independent|||Mặc định undefined; hai spy độc lập', chuanBi: 'const a = createSpy(); const b = createSpy().returns(1); a(); a();', goi: '[a(), b.callCount, a.callCount]', mongDoi: [{ $js: 'undefined' }, 0, 3] },
      ],
    },
    {
      tieuDe: 'Đường lỗi: 404, 500, mất mạng',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['sad path', 'res.ok', 'mockRejectedValue'], tienQuyet: ['fetch', 'throw'], the: ['javascript', 'testing', 'mock'],
      moTa: `${BAI}<p>Bài luyện trong bài học. ${c('getUserName(id, fetchFn = fetch)')}: 200 ⇒ ${c('data.name')}; 404 ⇒ ${c('"Guest"')}; mã lỗi khác ⇒ ném ${c("Error('users service failed: <status>')")}; mất mạng ⇒ để lỗi ${c('TypeError')} của fetch đi tiếp (không nuốt). Máy chấm dùng fetch giả với từng mã trạng thái.</p>`,
      yeuCau: ['200 ⇒ tên; 404 ⇒ "Guest".', '500 ⇒ Error đúng thông điệp.', 'Mất mạng ⇒ TypeError truyền ra ngoài.'],
      dauVao: 'id: number; fetchFn?.', dauRa: 'Promise<string>.',
      rangBuoc: ['Không bắt (catch) lỗi mạng rồi trả chuỗi.'],
      viDu: [{ input: 'await getUserName(404)', output: '"Guest"', explanation: 'Người dùng chưa có hồ sơ.' }],
      goiY: ['fetch KHÔNG ném lỗi với 404/500 — tự kiểm res.status / res.ok.', 'if (res.status === 404) return "Guest"; if (!res.ok) throw new Error("users service failed: " + res.status);'],
      fetchGia: { '/api/users/7': { status: 200, json: { name: 'Lan' } }, '/api/users/404': { status: 404, json: { error: 'not found' } }, '/api/users/500': { status: 500, json: {} }, '/api/users/0': { loiMang: true } },
      khoiDau: { 'main.js': `// Bài 13.4 — đường lỗi
async function getUserName(id, fetchFn = fetch) {
  const res = await fetchFn('/api/users/' + id);
  const data = await res.json();
  return data.name;
}
` },
      loiGiai: { 'main.js': `// Bài 13.4 — đường lỗi: fetch không ném với 404/500 nên tự kiểm mã trạng thái
async function getUserName(id, fetchFn = fetch) {
  const res = await fetchFn('/api/users/' + id);      // mất mạng ⇒ TypeError ném ra từ đây, để nó đi tiếp
  if (res.status === 404) return 'Guest';             // chưa có hồ sơ: không phải lỗi
  if (!res.ok) throw new Error('users service failed: ' + res.status);
  const data = await res.json();
  return data.name;
}
` },
      giaiThich: `<p>Ba đường, ba cách xử lý khác nhau: 404 là một trạng thái hợp lệ ("chưa có"), 500 là lỗi của máy chủ cần báo rõ, mất mạng là lỗi của môi trường — để nó nổi lên cho tầng trên quyết định (thử lại, báo người dùng). Chỉ đồ giả mới cho bạn tạo ba đường đó theo ý.</p>`,
      loiHayGap: ['Gọi res.json() trước khi kiểm status — 500 trả HTML làm json() ném SyntaxError.', 'catch mọi lỗi rồi trả "Guest" — che mất sự cố thật.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Response/ok',
      kiem: [
        { moTa: '200 ⇒ name|||200 ⇒ tên', goi: 'await getUserName(7)', mongDoi: 'Lan' },
        { moTa: '404 ⇒ "Guest"|||404 ⇒ "Guest"', goi: 'await getUserName(404)', mongDoi: 'Guest' },
        { moTa: '500 ⇒ clear error|||500 ⇒ lỗi rõ ràng', goi: 'await getUserName(500)', mongDoi: { loi: 'Error', thongDiep: '^users service failed: 500$' } },
        { moTa: 'Network failure propagates as TypeError|||Mất mạng truyền ra TypeError', goi: 'await getUserName(0)', mongDoi: { loi: 'TypeError' } },
        { moTa: 'Hidden: works with an injected fake too|||Ẩn: chạy với hàm giả được tiêm', an: true, chuanBi: FAKE, goi: 'await getUserName(1, async () => reply(503, {}))', mongDoi: { loi: 'Error', thongDiep: '503' } },
      ],
    },
    {
      tieuDe: 'Debounce trên đồng hồ ảo',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['debounce', 'clearTimeout', 'fake timers'], tienQuyet: ['setTimeout', 'closure'], the: ['javascript', 'testing', 'timer'],
      moTa: `${BAI}<p>Viết ${c('createDebouncedSearch(onSearch, delay = 300)')} trả về hàm ${c('search(text)')}: mỗi lần gọi huỷ hẹn giờ cũ và hẹn lại; chỉ khi ${c('delay')} ms trôi qua không có lần gọi mới thì mới gọi ${c('onSearch(text)')} với chữ CUỐI. Máy chấm dùng đồng hồ ảo: chờ 299 ms hay 1 giờ đều tức thì.</p>`,
      yeuCau: ['Gõ liên tục ⇒ chỉ một lần onSearch, với chữ cuối.', 'Trước delay ms ⇒ chưa gọi.', 'Hai đợt gõ cách nhau > delay ⇒ hai lần gọi.'],
      dauVao: 'onSearch: hàm; delay: ms.', dauRa: 'Hàm search(text).',
      rangBuoc: ['Dùng setTimeout/clearTimeout.'],
      viDu: [{ input: 'search("j"); search("ja"); search("java"); /* 300 ms sau */', output: 'onSearch("java") đúng một lần', explanation: 'Các hẹn giờ cũ đã bị huỷ.' }],
      goiY: ['let timer; return (text) => { clearTimeout(timer); timer = setTimeout(() => onSearch(text), delay); };', 'timer nằm trong closure — mỗi ô tìm kiếm có hẹn giờ riêng.'],
      khoiDau: { 'main.js': `// Bài 13.4 — debounce (chưa đúng: gọi ngay mỗi lần gõ)
function createDebouncedSearch(onSearch, delay = 300) {
  return (text) => onSearch(text);
}
` },
      loiGiai: { 'main.js': `// Bài 13.4 — debounce: chỉ chạy khi người dùng NGỪNG gõ đủ delay ms
function createDebouncedSearch(onSearch, delay = 300) {
  let timer;                                   // hẹn giờ đang chờ (riêng cho ô tìm kiếm này)
  return (text) => {
    clearTimeout(timer);                       // gõ tiếp ⇒ huỷ lần hẹn trước
    timer = setTimeout(() => onSearch(text), delay);
  };
}
` },
      giaiThich: `<p>Mỗi lần gõ huỷ hẹn giờ cũ và đặt hẹn mới, nên chỉ lần cuối sống sót đủ ${c('delay')} ms. Test với đồng hồ thật phải ngủ thật; với đồng hồ giả (${c('vi.useFakeTimers')} trong bài, đồng hồ ảo ở máy chấm) mọi thứ tức thì và chính xác tới từng mili giây.</p>`,
      loiHayGap: ['Quên clearTimeout — mỗi phím một lần tìm.', 'Đặt timer ở ngoài hàm — hai ô tìm kiếm huỷ hẹn của nhau.'],
      thamKhao: 'https://vitest.dev/guide/mocking.html#timers',
      kiem: [
        { moTa: 'Typing fast ⇒ one call with the last text|||Gõ nhanh ⇒ một lần gọi với chữ cuối', chuanBi: 'const got = []; const s = createDebouncedSearch((t) => got.push(t), 300); s("j"); s("ja"); s("jav"); s("java"); await new Promise((r) => setTimeout(r, 300));', goi: 'got', mongDoi: ['java'] },
        { moTa: 'Nothing before the delay|||Chưa tới delay thì chưa gọi', chuanBi: 'const got = []; const s = createDebouncedSearch((t) => got.push(t), 300); s("a"); await new Promise((r) => setTimeout(r, 299));', goi: 'got.length', mongDoi: 0 },
        { moTa: 'Two bursts ⇒ two calls|||Hai đợt gõ ⇒ hai lần gọi', chuanBi: 'const got = []; const s = createDebouncedSearch((t) => got.push(t), 100); s("a"); s("ab"); await new Promise((r) => setTimeout(r, 150)); s("x"); await new Promise((r) => setTimeout(r, 150));', goi: 'got', mongDoi: ['ab', 'x'] },
        { moTa: 'Hidden: two searches do not cancel each other|||Ẩn: hai ô tìm kiếm không huỷ nhau', an: true, chuanBi: 'const got = []; const a = createDebouncedSearch((t) => got.push("a:" + t), 50); const b = createDebouncedSearch((t) => got.push("b:" + t), 50); a("1"); b("2"); await new Promise((r) => setTimeout(r, 60));', goi: 'got.sort()', mongDoi: ['a:1', 'b:2'] },
      ],
    },
    {
      tieuDe: 'Tiêm thời gian: lời chào theo giờ',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['tiêm thời gian', 'Date', 'giá trị biên'], tienQuyet: ['Date', 'tham số mặc định'], the: ['javascript', 'testing', 'time'],
      moTa: `${BAI}<p>${c('greeting()')} đang gọi ${c('new Date()')} bên trong nên chỉ test được vào đúng giờ đó. Thêm tham số ${c('now = new Date()')}: trước 12 giờ ${c('"Good morning"')}, trước 18 giờ ${c('"Good afternoon"')}, còn lại ${c('"Good evening"')}. Máy chấm đưa các mốc 11:59, 12:00, 17:59, 18:00.</p>`,
      yeuCau: ['Nhận tham số now (Date), mặc định là bây giờ.', 'Đúng ở cả hai phía của 12:00 và 18:00.', 'Gọi không đối số vẫn trả một trong ba lời chào.'],
      dauVao: 'now?: Date.', dauRa: 'string.',
      rangBuoc: ['Đọc giờ bằng now.getHours().'],
      viDu: [{ input: 'greeting(new Date(2026, 10, 1, 12, 0))', output: '"Good afternoon"', explanation: 'Đúng 12:00 là buổi chiều.' }],
      goiY: ['function greeting(now = new Date()) { const h = now.getHours(); … }', 'return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";'],
      khoiDau: { 'main.js': `// Bài 13.4 — lời chào (không test được)
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}
` },
      loiGiai: { 'main.js': `// Bài 13.4 — lời chào: "bây giờ" là một tham số ⇒ test đưa bất kỳ thời điểm nào
function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
` },
      giaiThich: `<p>Đồng hồ là một phụ thuộc bên ngoài giống như mạng. Tiêm nó qua tham số cho test đi tới bất kỳ thời điểm nào — kể cả các mốc 12:00 và 18:00 nơi bug hay nấp. Trong Vitest còn có ${c('vi.setSystemTime')} khi không sửa được chữ ký hàm.</p>`,
      loiHayGap: ['Dùng <= 12 — đúng 12:00 thành buổi sáng.', 'Viết test so với giờ hiện tại thật — đỏ hay xanh tuỳ lúc chạy.'],
      thamKhao: 'https://vitest.dev/api/vi.html#vi-setsystemtime',
      kiem: [
        { moTa: 'Around noon|||Quanh trưa', goi: '[greeting(new Date(2026, 10, 1, 11, 59)), greeting(new Date(2026, 10, 1, 12, 0))]', mongDoi: ['Good morning', 'Good afternoon'] },
        { moTa: 'Around 18:00|||Quanh 18 giờ', goi: '[greeting(new Date(2026, 10, 1, 17, 59)), greeting(new Date(2026, 10, 1, 18, 0))]', mongDoi: ['Good afternoon', 'Good evening'] },
        { moTa: 'Default argument still works|||Không đối số vẫn chạy', goi: '["Good morning", "Good afternoon", "Good evening"].includes(greeting())', mongDoi: true },
        { moTa: 'Accepts a now parameter|||Có tham số now', kiem: 'ma-nguon', tep: 'main.js', khop: 'greeting\\s*\\(\\s*now\\s*=\\s*new Date\\(\\)\\s*\\)' },
      ],
    },
    {
      tieuDe: 'retry có chờ giữa các lần',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['retry', 'async/await', 'đồng hồ ảo'], tienQuyet: ['async/await', 'setTimeout', 'try/catch'], the: ['javascript', 'testing', 'async'],
      moTa: `${BAI}<p>Viết ${c('retry(fn, { times = 3, delayMs = 100 } = {})')}: gọi ${c('await fn()')}; nếu nó ném/từ chối thì chờ ${c('delayMs')} rồi thử lại, tối đa ${c('times')} lần TỔNG CỘNG; thành công thì trả kết quả ngay; hết lượt thì ném lại lỗi CUỐI CÙNG. Máy chấm đo bằng ${c('Date.now()')} của đồng hồ ảo: 3 lần thất bại với 100ms phải tốn đúng 200ms (không chờ sau lần cuối).</p>`,
      yeuCau: ['Thành công ở lần 2 ⇒ trả kết quả, fn chạy 2 lần.', 'Hết lượt ⇒ ném lỗi cuối cùng.', 'Chỉ chờ GIỮA các lần (times = 3, delay 100 ⇒ 200 ms).'],
      dauVao: 'fn: hàm async; { times, delayMs }.', dauRa: 'Promise kết quả của fn.',
      rangBuoc: ['Không chờ sau lần thử cuối.'],
      viDu: [{ input: 'await retry(flaky, { times: 3, delayMs: 100 })', output: 'kết quả lần thành công', explanation: 'Lỗi tạm thời được che bằng thử lại.' }],
      goiY: ['for (let i = 1; i <= times; i++) { try { return await fn(); } catch (e) { last = e; if (i < times) await sleep(delayMs); } } throw last;', 'const sleep = (ms) => new Promise((r) => setTimeout(r, ms));'],
      khoiDau: { 'main.js': `// Bài 13.4 — retry (chưa thử lại)
async function retry(fn, { times = 3, delayMs = 100 } = {}) {
  return fn();
}
` },
      loiGiai: { 'main.js': `// Bài 13.4 — retry: thử lại tối đa times lần, chờ delayMs GIỮA các lần, ném lỗi cuối nếu hết lượt
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry(fn, { times = 3, delayMs = 100 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await fn();                       // await: bắt được cả promise bị từ chối
    } catch (e) {
      lastError = e;
      if (attempt < times) await sleep(delayMs);   // không chờ sau lần cuối
    }
  }
  throw lastError;
}
` },
      giaiThich: `<p>${c('return await')} quan trọng: thiếu ${c('await')}, promise bị từ chối không rơi vào ${c('catch')} của vòng lặp. Đồng hồ ảo cho phép kiểm cả hành vi thời gian (200ms, không phải 300ms) mà không chờ thật — đúng cách test retry trong dự án thật bằng ${c('vi.useFakeTimers')}.</p>`,
      loiHayGap: ['return fn() thay vì return await fn() — lỗi async không được bắt.', 'Chờ cả sau lần cuối — chậm thêm vô ích.'],
      thamKhao: 'https://vitest.dev/guide/mocking.html#timers',
      kiem: [
        { moTa: 'Succeeds on the 2nd attempt|||Thành công ở lần thử thứ 2', chuanBi: 'let n = 0; const flaky = async () => { n++; if (n < 2) throw new Error("try again"); return "ok"; };', goi: '[await retry(flaky, { times: 3, delayMs: 100 }), n]', mongDoi: ['ok', 2] },
        { moTa: 'Gives up with the LAST error|||Hết lượt thì ném lỗi CUỐI', chuanBi: 'let n = 0; const bad = async () => { n++; throw new Error("fail " + n); };', goi: 'await retry(bad, { times: 3, delayMs: 10 })', mongDoi: { loi: 'Error', thongDiep: '^fail 3$' } },
        { moTa: 'Waits only between attempts: 200 ms|||Chỉ chờ giữa các lần: 200 ms', chuanBi: 'const t0 = Date.now(); try { await retry(async () => { throw new Error("x"); }, { times: 3, delayMs: 100 }); } catch {}', goi: 'Date.now() - t0', mongDoi: 200 },
        { moTa: 'Hidden: immediate success, no waiting|||Ẩn: thành công ngay, không chờ', an: true, chuanBi: 'const t0 = Date.now(); const v = await retry(async () => 7);', goi: '[v, Date.now() - t0]', mongDoi: [7, 0] },
      ],
    },
  ],
});
