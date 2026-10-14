/** Bộ luyện bài 5.4 — fetch. Lược đồ: ./_luoc-do.mjs (loại 'js' + fetchGia). ´ = dấu huyền, @{ = ${ */
import { c, doiDau } from './_luoc-do.mjs';

const FETCH_GIA = '<p><em>Máy chấm thay <code>fetch</code> bằng một máy chủ GIẢ trả dữ liệu cố định (không có mạng thật, đồng hồ giả: mỗi phản hồi mất 50 ms). Đường dẫn trong bài là đường dẫn tương đối như khi trang và API cùng một tên miền.</em></p>';

const NGUOI_DUNG_GIA = {
  '/api/users/1': { json: { id: 1, ten: 'Lan', email: 'lan@example.com' } },
  '/api/users/2': { json: { id: 2, ten: 'Minh', email: 'minh@example.com' } },
  '/api/users/404': { status: 404, json: { loi: 'Not Found' } },
  '/api/users/500': { status: 500, text: '<!DOCTYPE html><h1>500 Internal Server Error</h1>' },
};

export default doiDau({
  slug: 'wf-5-4-fetch-apis',
  ten: '5.4 fetch: nói chuyện với API',
  baiHoc: 'Nền tảng Web — Bài 5.4 fetch: nói chuyện với API',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'fetch trả về Promise, await res.json(), kiểm res.ok (fetch KHÔNG reject khi 404/500), gửi POST với headers + JSON.stringify, query string, phân biệt lỗi mạng với lỗi HTTP, thử lại có chờ lùi dần — 7 bài, máy chấm dùng fetch giả.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'GET một người dùng: hai lần await',
      doKho: 'EASY', phut: 8, fetchGia: NGUOI_DUNG_GIA,
      khaiNiem: ['fetch', 'await res.json()', 'Response'],
      tienQuyet: ['async/await'],
      the: ['javascript', 'fetch', 'http'],
      moTa: `<p>Bài 5.4: <em>"Hai lần await: một cho phản hồi tới, một để đọc và phân tích phần thân."</em> ${c('layNguoiDung(id)')} phải trả về <strong>object người dùng</strong> từ ${c('GET /api/users/<id>')}. Bản hiện tại trả về chính ${c('Response')} — một object có ${c('status')}, ${c('ok')}, ${c('headers')}… nhưng chưa có dữ liệu, vì phần thân chưa được đọc.</p>
${FETCH_GIA}`,
      yeuCau: [
        `Gọi ${c('fetch("/api/users/" + id)')} (đúng đường dẫn, phương thức GET mặc định).`,
        `Trả về kết quả của ${c('await res.json()')}.`,
        `${c('await layNguoiDung(1)')} → ${c('{ id: 1, ten: "Lan", email: "lan@example.com" }')}.`,
      ],
      dauVao: 'id: number.',
      dauRa: 'Promise<object người dùng>.',
      rangBuoc: ['Bài này chưa cần xử lý lỗi (bài 2).'],
      viDu: [
        { input: 'await layNguoiDung(2)', output: '{ id: 2, ten: "Minh", email: "minh@example.com" }', explanation: 'fetch → Response; res.json() → object.' },
      ],
      goiY: [
        'res.json() cũng trả về Promise — nên cũng phải await.',
        'const res = await fetch(´/api/users/@{id}´); return await res.json();',
      ],
      khoiDau: {
        'main.js': `// Bài 5.4 — GET
async function layNguoiDung(id) {
  const res = await fetch("/api/users/" + id);
  return res;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.4 — GET
async function layNguoiDung(id) {
  // await 1: chờ phản hồi tới (dòng trạng thái + headers) — phần thân CHƯA đọc
  const res = await fetch(´/api/users/@{id}´);
  // await 2: đọc hết phần thân và phân tích JSON thành object
  return await res.json();
}
`,
      },
      giaiThich: `<p>${c('fetch')} fulfilled ngay khi <em>headers</em> về; phần thân có thể còn đang tải (một tệp lớn mất nhiều giây). Vì thế đọc thân là bước riêng, cũng bất đồng bộ: ${c('res.json()')} đọc hết rồi ${c('JSON.parse')}. Đây là lý do mọi đoạn fetch đều có hai ${c('await')}.</p>
<p>Máy chấm kiểm giá trị trả về, đường dẫn và phương thức mà bạn đã gọi (đọc từ nhật ký fetch giả).</p>`,
      loiHayGap: [
        'return res.json() thiếu await — vẫn đúng ở đây (async tự chờ Promise được return), nhưng sẽ hỏng ngay khi bạn bọc nó trong try/catch.',
        'Đọc res.body — đó là một luồng byte, không phải object.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
      kiem: [
        { moTa: 'Người dùng 1', goi: 'await layNguoiDung(1)', mongDoi: { id: 1, ten: 'Lan', email: 'lan@example.com' } },
        { moTa: 'Người dùng 2', goi: 'await layNguoiDung(2)', mongDoi: { id: 2, ten: 'Minh', email: 'minh@example.com' } },
        { moTa: 'Gọi đúng GET /api/users/1', chuanBi: 'await layNguoiDung(1);', goi: '__fetchDaGoi.map((r) => r.method + " " + r.url)', mongDoi: ['GET /api/users/1'] },
        { moTa: 'Gọi res.json()', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.json\\s*\\(\\s*\\)' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'fetch không reject khi 404: tự kiểm res.ok',
      doKho: 'EASY', phut: 10, fetchGia: NGUOI_DUNG_GIA,
      khaiNiem: ['res.ok', 'res.status', 'throw new Error', 'HTTP 404 / 500'],
      tienQuyet: ['fetch', 'try/catch'],
      the: ['javascript', 'fetch', 'error-handling'],
      moTa: `<p>Bài 5.4: <em>"fetch KHÔNG reject khi 404 hay 500 — Promise chỉ reject khi lỗi mạng. Bạn phải tự kiểm response.ok."</em> Viết ${c('layJson(url)')} dùng chung cho cả ứng dụng: phản hồi 2xx thì trả về JSON; không thì <strong>ném</strong> ${c('Error("HTTP <status>")')} — TRƯỚC khi đọc thân.</p>
${FETCH_GIA}`,
      yeuCau: [
        `${c('res.ok')} (status 200–299) → trả về ${c('await res.json()')}.`,
        `Không ok → ném ${c('new Error(´HTTP @{res.status}´)')}: ${c('"HTTP 404"')}, ${c('"HTTP 500"')}.`,
        'Kiểm res.ok trước khi đọc thân — trang lỗi 500 là HTML, đọc json() sẽ ném lỗi cú pháp khó hiểu.',
      ],
      dauVao: 'url: string.',
      dauRa: 'Promise<JSON> hoặc reject Error("HTTP …").',
      rangBuoc: ['Không bắt lỗi trong layJson — để nó lan ra cho người gọi.'],
      viDu: [
        { input: 'await layJson("/api/users/1")', output: '{ id: 1, ten: "Lan", … }', explanation: '200 ⇒ ok.' },
        { input: 'await layJson("/api/users/500")', output: 'Error: HTTP 500', explanation: 'Thiếu kiểm ok: res.json() trên HTML ném SyntaxError "Unexpected token <" — chẳng nói gì về 500.' },
      ],
      goiY: [
        'if (!res.ok) { throw new Error(…); } đặt ngay sau dòng await fetch.',
        'const res = await fetch(url); if (!res.ok) throw new Error(´HTTP @{res.status}´); return res.json();',
      ],
      khoiDau: {
        'main.js': `// Bài 5.4 — res.ok
async function layJson(url) {
  const res = await fetch(url);
  return await res.json();
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.4 — res.ok
async function layJson(url) {
  const res = await fetch(url);
  // fetch chỉ reject khi LỖI MẠNG. 404/500 vẫn là một chuyến khứ hồi "thành công".
  if (!res.ok) {
    // Báo đúng mã trạng thái — trước khi đụng vào phần thân (có thể là trang HTML lỗi)
    throw new Error(´HTTP @{res.status}´);
  }
  return await res.json();
}
`,
      },
      giaiThich: `<p>Với fetch, "thành công" nghĩa là "có phản hồi", không phải "có dữ liệu bạn muốn". Không kiểm ${c('res.ok')} thì: phản hồi lỗi dạng JSON (${c('{ loi: "Not Found" }')}) được trả về như thể là dữ liệu; phản hồi lỗi dạng HTML làm ${c('res.json()')} ném ${c('SyntaxError: Unexpected token <')} — một thông báo dắt bạn đi tìm lỗi JSON thay vì lỗi máy chủ.</p>
<p>Máy chấm thử 200, 404 (thân JSON) và 500 (thân HTML), kiểm đúng loại và thông điệp lỗi.</p>`,
      loiHayGap: [
        `Kiểm ${c('res.status === 200')} — 201 Created hay 204 cũng là thành công; dùng res.ok.`,
        'Bọc try/catch rồi trả null bên trong layJson — người gọi mất thông tin lỗi.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Response/ok',
      kiem: [
        { moTa: '200 → JSON', goi: 'await layJson("/api/users/1")', mongDoi: { id: 1, ten: 'Lan', email: 'lan@example.com' } },
        { moTa: '404 → Error "HTTP 404"', goi: 'await layJson("/api/users/404")', mongDoi: { loi: 'Error', thongDiep: '^HTTP 404$' } },
        { moTa: '500 (thân HTML) → Error "HTTP 500", không phải SyntaxError', goi: 'await layJson("/api/users/500")', mongDoi: { loi: 'Error', thongDiep: '^HTTP 500$' } },
        { moTa: 'Đường dẫn không có trong máy chủ → HTTP 404', goi: 'await layJson("/api/khong-co")', mongDoi: { loi: 'Error', thongDiep: '^HTTP 404$' }, an: true },
        { moTa: 'Kiểm res.ok', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.ok\\b' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Gửi dữ liệu bằng POST: method, headers, body',
      doKho: 'EASY', phut: 12,
      fetchGia: { 'POST /api/notes': { status: 201, json: { id: 7, ok: true } } },
      khaiNiem: ['POST', 'Content-Type: application/json', 'JSON.stringify', '201 Created'],
      tienQuyet: ['fetch', 'res.ok'],
      the: ['javascript', 'fetch', 'http', 'post'],
      moTa: `<p>Bài 5.4, mục <em>"Gửi dữ liệu bằng POST"</em>. ${c('taoGhiChu(noiDung)')} tạo ghi chú mới qua ${c('POST /api/notes')} với thân JSON ${c('{ "noiDung": "…" }')} và trả về JSON máy chủ gửi lại (${c('{ id, ok }')}). Bản hiện tại quên ${c('method')} (nên thành GET ⇒ 404), quên header, và đưa thẳng object vào ${c('body')} (gửi đi chuỗi ${c('"[object Object]"')}).</p>
${FETCH_GIA}`,
      yeuCau: [
        `${c('method: "POST"')}, header ${c('"Content-Type": "application/json"')}.`,
        `${c('body: JSON.stringify({ noiDung })')}.`,
        `Kiểm ${c('res.ok')} (201 là ok) rồi trả về ${c('await res.json()')}.`,
      ],
      dauVao: 'noiDung: string.',
      dauRa: 'Promise<{ id, ok }>.',
      rangBuoc: ['Đúng đường dẫn /api/notes.'],
      viDu: [
        { input: 'await taoGhiChu("Học fetch")', output: '{ id: 7, ok: true }', explanation: 'Máy chủ giả trả 201 Created.' },
      ],
      goiY: [
        'fetch nhận đối số thứ hai là object tuỳ chọn: { method, headers, body }.',
        'await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ noiDung }) });',
      ],
      khoiDau: {
        'main.js': `// Bài 5.4 — POST
async function taoGhiChu(noiDung) {
  const res = await fetch("/api/notes", {
    body: { noiDung: noiDung },
  });
  return await res.json();
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.4 — POST
async function taoGhiChu(noiDung) {
  const res = await fetch("/api/notes", {
    method: "POST",                                   // mặc định là GET
    headers: { "Content-Type": "application/json" },  // báo máy chủ: thân là JSON
    body: JSON.stringify({ noiDung }),                // object → chuỗi JSON
  });
  if (!res.ok) throw new Error(´HTTP @{res.status}´);
  return await res.json();                            // { id, ok } máy chủ gửi lại
}
`,
      },
      giaiThich: `<p>Thân của một request HTTP là <em>chữ</em> (hoặc byte), không phải object JavaScript. ${c('JSON.stringify')} đổi object thành chuỗi JSON; header ${c('Content-Type')} cho máy chủ biết cách đọc chuỗi đó (Express ở Chương 6 dựa vào nó để điền ${c('req.body')}). Đưa object thẳng vào body ⇒ trình duyệt gọi ${c('String(obj)')} ⇒ ${c('"[object Object]"')}.</p>
<p>Máy chấm đọc nhật ký fetch giả để kiểm phương thức, header và thân bạn đã gửi.</p>`,
      loiHayGap: [
        `Viết ${c('header')} (thiếu s) hay ${c('"content-type": "json"')}.`,
        'JSON.stringify(noiDung) — gửi chuỗi trần, không phải object { noiDung }.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data',
      kiem: [
        { moTa: 'Trả về { id: 7, ok: true }', goi: 'await taoGhiChu("Học fetch")', mongDoi: { id: 7, ok: true } },
        { moTa: 'Phương thức POST tới /api/notes', chuanBi: 'await taoGhiChu("a").catch(() => {});', goi: '__fetchDaGoi[0].method + " " + __fetchDaGoi[0].url', mongDoi: 'POST /api/notes' },
        { moTa: 'Header Content-Type: application/json', chuanBi: 'await taoGhiChu("a").catch(() => {});', goi: '__fetchDaGoi[0].headers["Content-Type"]', mongDoi: 'application/json' },
        { moTa: 'Thân là JSON { noiDung }', chuanBi: 'await taoGhiChu("Học fetch").catch(() => {});', goi: 'JSON.parse(__fetchDaGoi[0].body)', mongDoi: { noiDung: 'Học fetch' } },
        { moTa: 'Dùng JSON.stringify', kiem: 'ma-nguon', tep: 'main.js', khop: 'JSON\\.stringify\\s*\\(' },
      ],
    },

    /* ───────────────────────────── 4 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Kết quả có cấu trúc thay vì ném lỗi: { ok, duLieu | maLoi }',
      doKho: 'MEDIUM', phut: 15,
      fetchGia: {
        '/api/products/1': { json: { id: 1, ten: 'Bút bi', gia: 5000 } },
        '/api/products/2': { status: 404, json: { loi: 'Không có sản phẩm' } },
        '/api/products/3': { status: 500, text: '<!DOCTYPE html><title>Lỗi máy chủ</title>' },
        '/api/products/4': { status: 503, text: 'Service Unavailable' },
        '/api/products/5': { loiMang: true },
      },
      khaiNiem: ['res.ok', 'res.status', 'lỗi mạng TypeError', 'không đọc thân khi lỗi'],
      tienQuyet: ['fetch', 'try/catch'],
      the: ['javascript', 'fetch', 'error-handling'],
      moTa: `<p>Giao diện cửa hàng không muốn bắt lỗi ở mỗi chỗ gọi. Viết ${c('taiSanPham(id)')} <strong>không bao giờ reject</strong>, trả về:</p>
<ul><li>2xx: ${c('{ ok: true, duLieu: <JSON> }')}</li>
<li>HTTP lỗi: ${c('{ ok: false, maLoi: <status> }')} — KHÔNG đọc thân (có thể là HTML)</li>
<li>lỗi mạng (fetch reject): ${c('{ ok: false, maLoi: 0 }')}</li></ul>
${FETCH_GIA}`,
      yeuCau: [
        'Ba hình dạng kết quả như trên; Promise luôn fulfilled.',
        'Lỗi HTTP không gọi res.json() (thân 500 là HTML).',
        `Lỗi mạng (${c('TypeError: Failed to fetch')}) → ${c('maLoi: 0')}.`,
      ],
      dauVao: 'id: number.',
      dauRa: 'Promise<{ ok: true, duLieu } | { ok: false, maLoi }>.',
      rangBuoc: ['Không dùng .catch — try/catch.'],
      viDu: [
        { input: 'await taiSanPham(1)', output: '{ ok: true, duLieu: { id: 1, ten: "Bút bi", gia: 5000 } }', explanation: 'Phản hồi 200.' },
        { input: 'await taiSanPham(3)', output: '{ ok: false, maLoi: 500 }', explanation: 'Không đọc thân HTML.' },
        { input: 'await taiSanPham(5)', output: '{ ok: false, maLoi: 0 }', explanation: 'Mất mạng: fetch reject TypeError.' },
      ],
      goiY: [
        'try { const res = await fetch(…); if (!res.ok) return { ok: false, maLoi: res.status }; return { ok: true, duLieu: await res.json() }; } catch { return { ok: false, maLoi: 0 }; }',
        'Có await TRƯỚC res.json() trong try thì lỗi phân tích JSON (nếu có) cũng được bắt.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.4 — Kết quả có cấu trúc
async function taiSanPham(id) {
  const res = await fetch(´/api/products/@{id}´);
  const duLieu = await res.json();
  return { ok: true, duLieu };
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.4 — Kết quả có cấu trúc
async function taiSanPham(id) {
  try {
    const res = await fetch(´/api/products/@{id}´);
    if (!res.ok) {
      // Lỗi HTTP: báo mã, KHÔNG đọc thân (500 thường là trang HTML)
      return { ok: false, maLoi: res.status };
    }
    return { ok: true, duLieu: await res.json() };
  } catch {
    // fetch chỉ reject khi KHÔNG có phản hồi nào: mất mạng, DNS, bị CORS chặn
    return { ok: false, maLoi: 0 };
  }
}
`,
      },
      giaiThich: `<p>Có hai loại thất bại khác hẳn nhau: <strong>có phản hồi nhưng là lỗi</strong> (404, 500 — fetch fulfilled, ${c('res.ok')} false) và <strong>không có phản hồi</strong> (mất mạng — fetch reject ${c('TypeError')}). Hàm này gom cả hai về một hình dạng mà giao diện chỉ cần kiểm ${c('kq.ok')}.</p>
<p>Máy chấm thử 200, 404 (thân JSON), 500 (thân HTML — đọc json() sẽ ném), 503 và mất mạng; mọi lời gọi phải fulfilled.</p>`,
      loiHayGap: [
        'Đọc res.json() trước khi kiểm ok — 500 HTML ném SyntaxError, rơi vào catch ⇒ maLoi 0 thay vì 500.',
        'Trả maLoi: "Failed to fetch" — đề yêu cầu số 0.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#exceptions',
      kiem: [
        { moTa: '200 → ok + dữ liệu', goi: 'await taiSanPham(1)', mongDoi: { ok: true, duLieu: { id: 1, ten: 'Bút bi', gia: 5000 } } },
        { moTa: '404 → maLoi 404', goi: 'await taiSanPham(2)', mongDoi: { ok: false, maLoi: 404 } },
        { moTa: '500 thân HTML → maLoi 500', goi: 'await taiSanPham(3)', mongDoi: { ok: false, maLoi: 500 } },
        { moTa: 'Mất mạng → maLoi 0', goi: 'await taiSanPham(5)', mongDoi: { ok: false, maLoi: 0 } },
        { moTa: '503 → maLoi 503', goi: 'await taiSanPham(4)', mongDoi: { ok: false, maLoi: 503 }, an: true },
        { moTa: 'Không dùng .catch', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.catch\\s*\\(', phuDinh: true, an: true },
      ],
    },

    /* ───────────────────────────── 5 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Tìm kiếm có tiếng Việt: dựng query string đúng cách',
      doKho: 'MEDIUM', phut: 15,
      fetchGia: {
        '/api/search?q=%C3%A1o+thun&page=1': { json: { ketQua: ['Áo thun trắng', 'Áo thun đen'], trang: 1 } },
        '/api/search?q=%C3%A1o%20thun&page=1': { json: { ketQua: ['Áo thun trắng', 'Áo thun đen'], trang: 1 } },
        '/api/search?q=%C3%A1o+thun&page=2': { json: { ketQua: ['Áo thun xanh'], trang: 2 } },
        '/api/search?q=%C3%A1o%20thun&page=2': { json: { ketQua: ['Áo thun xanh'], trang: 2 } },
        '/api/search?q=b%C3%BAt+%26+v%E1%BB%9F&page=1': { json: { ketQua: ['Bộ bút & vở'], trang: 1 } },
        '/api/search?q=b%C3%BAt%20%26%20v%E1%BB%9F&page=1': { json: { ketQua: ['Bộ bút & vở'], trang: 1 } },
      },
      khaiNiem: ['query string', 'URLSearchParams', 'encodeURIComponent', 'ký tự đặc biệt & ='],
      tienQuyet: ['fetch', 'res.ok'],
      the: ['javascript', 'fetch', 'url'],
      moTa: `<p>${c('timKiem(tuKhoa, trang = 1)')} gọi ${c('GET /api/search?q=<từ khoá>&page=<trang>')} và trả về mảng ${c('ketQua')}. Bản hiện tại ghép chuỗi thẳng: từ khoá có dấu cách, dấu tiếng Việt hay ký tự ${c('&')} làm URL vỡ — ${c('"bút & vở"')} biến thành hai tham số ${c('q=bút ')} và ${c(' vở')}. Phải <strong>mã hoá</strong> giá trị tham số.</p>
${FETCH_GIA}`,
      yeuCau: [
        `Dựng query bằng ${c('new URLSearchParams({ q: tuKhoa, page: trang })')} (hoặc ${c('encodeURIComponent')} cho từng giá trị).`,
        `Thứ tự tham số: ${c('q')} trước, ${c('page')} sau; ${c('trang')} mặc định 1.`,
        `Kiểm ${c('res.ok')}; trả về ${c('duLieu.ketQua')}.`,
      ],
      dauVao: 'tuKhoa: string; trang: number (mặc định 1).',
      dauRa: 'Promise<string[]>.',
      rangBuoc: ['Máy chủ giả chỉ trả lời URL đã mã hoá đúng (URLSearchParams dùng + cho dấu cách; encodeURIComponent dùng %20 — cả hai đều được nhận).'],
      viDu: [
        { input: 'await timKiem("áo thun")', output: '["Áo thun trắng", "Áo thun đen"]', explanation: 'URL: /api/search?q=%C3%A1o+thun&page=1' },
        { input: 'await timKiem("bút & vở")', output: '["Bộ bút & vở"]', explanation: '& trong giá trị thành %26 — không còn cắt đôi tham số.' },
      ],
      goiY: [
        'const qs = new URLSearchParams({ q: tuKhoa, page: trang }); — qs.toString() tự mã hoá mọi ký tự đặc biệt.',
        'const res = await fetch(´/api/search?@{qs}´); if (!res.ok) throw new Error(´HTTP @{res.status}´); return (await res.json()).ketQua;',
      ],
      khoiDau: {
        'main.js': `// Bài 5.4 — Query string
async function timKiem(tuKhoa, trang) {
  const res = await fetch("/api/search?q=" + tuKhoa + "&page=" + trang);
  const duLieu = await res.json();
  return duLieu.ketQua;
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.4 — Query string
async function timKiem(tuKhoa, trang = 1) {
  // URLSearchParams mã hoá giá trị: dấu cách, dấu tiếng Việt, & = ? đều an toàn
  const qs = new URLSearchParams({ q: tuKhoa, page: trang });
  const res = await fetch(´/api/search?@{qs}´);   // q trước, page sau
  if (!res.ok) throw new Error(´HTTP @{res.status}´);
  const duLieu = await res.json();
  return duLieu.ketQua;
}
`,
      },
      giaiThich: `<p>Trong URL, ${c('&')}, ${c('=')}, ${c('?')}, ${c('#')} và dấu cách có nghĩa cú pháp; chữ có dấu phải đổi sang byte UTF-8 dạng ${c('%XX')}. Ghép chuỗi trần để những ký tự đó lọt vào làm URL mang nghĩa khác — vừa là lỗi, vừa là lỗ hổng (người dùng chèn thêm tham số). ${c('URLSearchParams')} lo việc mã hoá; ${c('encodeURIComponent')} là phiên bản cho từng giá trị.</p>
<p>Máy chấm giả chỉ trả lời các URL đã mã hoá đúng; URL sai nhận 404. Nó kiểm từ khoá có dấu, có ${c('&')}, và trang 2.</p>`,
      loiHayGap: [
        'encodeURI(cả URL) — không mã hoá & và =, "bút & vở" vẫn vỡ.',
        'Quên giá trị mặc định ⇒ page=undefined.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
      kiem: [
        { moTa: 'Từ khoá có dấu và dấu cách', goi: 'await timKiem("áo thun")', mongDoi: ['Áo thun trắng', 'Áo thun đen'] },
        { moTa: 'Kết quả trang 2', goi: 'await timKiem("áo thun", 2)', mongDoi: ['Áo thun xanh'] },
        { moTa: 'Ký tự & trong từ khoá', goi: 'await timKiem("bút & vở")', mongDoi: ['Bộ bút & vở'] },
        { moTa: 'URL đã gửi được mã hoá', chuanBi: 'await timKiem("bút & vở").catch(() => {});', goi: '/%26/.test(__fetchDaGoi[0].url) && !/ /.test(__fetchDaGoi[0].url)', mongDoi: true },
        { moTa: 'Từ khoá không có kết quả → HTTP 404 được ném', goi: 'await timKiem("không có")', mongDoi: { loi: 'Error', thongDiep: 'HTTP 404' }, an: true },
      ],
    },

    /* ───────────────────────────── 6 · MEDIUM ───────────────────────────── */
    {
      tieuDe: 'Mất mạng hay máy chủ lỗi? Báo đúng cho người dùng',
      doKho: 'MEDIUM', phut: 15,
      fetchGia: {
        '/api/posts/1': { json: { id: 1, tieuDe: 'fetch và res.ok' } },
        '/api/posts/2': { status: 503, text: 'Service Unavailable' },
        '/api/posts/3': { loiMang: true },
        '/api/posts/4': { status: 200, text: 'đây không phải JSON' },
      },
      khaiNiem: ['TypeError khi mất mạng', 'Error tự ném cho HTTP', 'SyntaxError khi JSON hỏng', 'instanceof / err.name'],
      tienQuyet: ['res.ok', 'try/catch'],
      the: ['javascript', 'fetch', 'error-handling', 'ux'],
      moTa: `<p>Bài 5.4: <em>"Chỉ lỗi cấp mạng mới reject: mất kết nối, DNS, CORS. Chúng khác với một 500, và cả hai đều cần xử lý."</em> ${c('tieuDeBai(id)')} trả về <strong>chuỗi hiển thị</strong> (không bao giờ reject):</p>
<ul><li>thành công: tiêu đề bài</li>
<li>HTTP lỗi: ${c('"Máy chủ đang gặp sự cố (503). Thử lại sau."')}</li>
<li>mất mạng: ${c('"Mất kết nối mạng. Kiểm tra Wi-Fi."')}</li>
<li>thân không phải JSON: ${c('"Dữ liệu trả về không hợp lệ."')}</li></ul>
${FETCH_GIA}`,
      yeuCau: [
        'Phân biệt ba loại lỗi; mỗi loại một thông báo đúng như trên.',
        `Mất mạng nhận ra bằng ${c('err.name === "TypeError"')} (fetch reject TypeError).`,
        `JSON hỏng nhận ra bằng ${c('err.name === "SyntaxError"')} (res.json() ném).`,
      ],
      dauVao: 'id: number.',
      dauRa: 'Promise<string>.',
      rangBuoc: ['Không bao giờ reject.'],
      viDu: [
        { input: 'await tieuDeBai(2)', output: '"Máy chủ đang gặp sự cố (503). Thử lại sau."', explanation: 'Có phản hồi, res.ok false.' },
        { input: 'await tieuDeBai(3)', output: '"Mất kết nối mạng. Kiểm tra Wi-Fi."', explanation: 'Không có phản hồi nào.' },
      ],
      goiY: [
        'Kiểm res.ok trong try và RETURN thông báo lỗi HTTP ngay (không ném) — catch chỉ còn hai loại: TypeError (mạng) và SyntaxError (JSON).',
        'catch (err) { if (err.name === "TypeError") return "Mất kết nối…"; if (err.name === "SyntaxError") return "Dữ liệu…"; throw err; } — lỗi lạ thì ném tiếp, đừng nuốt.',
      ],
      khoiDau: {
        'main.js': `// Bài 5.4 — Phân loại lỗi
async function tieuDeBai(id) {
  try {
    const res = await fetch(´/api/posts/@{id}´);
    const bai = await res.json();
    return bai.tieuDe;
  } catch (err) {
    return "Có lỗi xảy ra.";
  }
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.4 — Phân loại lỗi
async function tieuDeBai(id) {
  try {
    const res = await fetch(´/api/posts/@{id}´);
    if (!res.ok) {
      // Có phản hồi, nhưng là lỗi: lỗi phía máy chủ, người dùng không làm gì được ngoài chờ
      return ´Máy chủ đang gặp sự cố (@{res.status}). Thử lại sau.´;
    }
    const bai = await res.json();           // ném SyntaxError nếu thân không phải JSON
    return bai.tieuDe;
  } catch (err) {
    if (err.name === "TypeError") return "Mất kết nối mạng. Kiểm tra Wi-Fi.";   // fetch reject
    if (err.name === "SyntaxError") return "Dữ liệu trả về không hợp lệ.";      // json() hỏng
    throw err;                              // lỗi khác (lỗi lập trình) — đừng nuốt
  }
}
`,
      },
      giaiThich: `<p>"Có lỗi xảy ra." là thông báo vô dụng: người dùng không biết nên kiểm Wi-Fi hay chờ máy chủ. Ba nguồn lỗi có ba dấu hiệu riêng: ${c('res.ok === false')} (có phản hồi), ${c('TypeError')} từ fetch (không có phản hồi), ${c('SyntaxError')} từ ${c('res.json()')} (phản hồi không phải JSON).</p>
<p>${c('throw err')} ở cuối catch là kỷ luật quan trọng: chỉ "chữa" những lỗi bạn hiểu, lỗi lạ phải lộ ra để sửa. Máy chấm thử bốn kịch bản.</p>`,
      loiHayGap: [
        'Ném Error cho HTTP rồi bắt lại trong catch nhưng không phân biệt — 503 rơi vào nhánh "mất mạng".',
        'Kiểm err.message === "Failed to fetch" — thông điệp khác nhau giữa các trình duyệt; kiểm err.name.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Response/json#exceptions',
      kiem: [
        { moTa: 'Thành công → tiêu đề', goi: 'await tieuDeBai(1)', mongDoi: 'fetch và res.ok' },
        { moTa: '503 → thông báo máy chủ', goi: 'await tieuDeBai(2)', mongDoi: 'Máy chủ đang gặp sự cố (503). Thử lại sau.' },
        { moTa: 'Mất mạng → thông báo mạng', goi: 'await tieuDeBai(3)', mongDoi: 'Mất kết nối mạng. Kiểm tra Wi-Fi.' },
        { moTa: 'JSON hỏng → dữ liệu không hợp lệ', goi: 'await tieuDeBai(4)', mongDoi: 'Dữ liệu trả về không hợp lệ.' },
        { moTa: 'Đường dẫn không có → 404', goi: 'await tieuDeBai(9)', mongDoi: 'Máy chủ đang gặp sự cố (404). Thử lại sau.', an: true },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Thử lại có chờ lùi dần (retry with backoff)',
      doKho: 'HARD', phut: 30,
      fetchGia: {
        '/api/thoi-tiet': [{ loiMang: true }, { status: 503, text: 'Bận' }, { json: { nhietDo: 31, troi: 'nắng' } }],
        '/api/luon-hong': { status: 500, text: 'Hỏng' },
        '/api/khong-ton-tai': { status: 404, json: { loi: 'Not Found' } },
      },
      khaiNiem: ['thử lại', 'chờ lùi dần (exponential backoff)', 'hàm bậc cao', 'lỗi nào đáng thử lại'],
      tienQuyet: ['async/await', 'res.ok', 'try/catch', 'Promise + setTimeout'],
      the: ['javascript', 'fetch', 'resilience', 'retry'],
      moTa: `<p>Mạng di động chập chờn: lần gọi đầu mất kết nối, lần hai máy chủ báo bận 503, lần ba mới được. Viết hai hàm:</p>
<ol><li>${c('thuLai(ham, soLan, choMs)')} — gọi ${c('ham()')} (trả Promise); reject thì chờ rồi gọi lại, tối đa ${c('soLan')} lần <em>tổng cộng</em>. Thời gian chờ <strong>lùi dần gấp đôi</strong>: ${c('choMs')}, ${c('2×choMs')}, ${c('4×choMs')}… Hết lượt thì reject với lỗi của lần CUỐI.</li>
<li>${c('layVoiThuLai(url)')} — GET JSON, thử lại tối đa 3 lần, chờ đầu 100 ms. Chỉ thử lại lỗi <strong>tạm thời</strong> (mất mạng, 5xx); lỗi 4xx (vd 404) thì dừng ngay — gọi lại cũng vô ích.</li></ol>
${FETCH_GIA}`,
      yeuCau: [
        `${c('thuLai')}: thành công ở lần k ⇒ fulfilled giá trị đó; giữa các lần chờ ${c('choMs × 2^(i-1)')}; hết ${c('soLan')} ⇒ reject lỗi cuối.`,
        `${c('layVoiThuLai("/api/thoi-tiet")')} → ${c('{ nhietDo: 31, troi: "nắng" }')} ở lần 3; tổng thời gian ${c('3×50 + 100 + 200 = 450 ms')}.`,
        `404 ⇒ reject ${c('"HTTP 404"')} sau ĐÚNG MỘT lần gọi.`,
        `5xx mãi ⇒ reject ${c('"HTTP 500"')} sau đúng 3 lần gọi.`,
      ],
      dauVao: 'ham: () => Promise; soLan: số nguyên >= 1; choMs: number; url: string.',
      dauRa: 'Promise.',
      rangBuoc: ['Không thư viện.', 'Chờ bằng setTimeout bọc trong Promise.'],
      viDu: [
        { input: 'await layVoiThuLai("/api/thoi-tiet")', output: '{ nhietDo: 31, troi: "nắng" }   (450 ms)', explanation: 'Lần 1 mất mạng → chờ 100 → lần 2 503 → chờ 200 → lần 3 OK. Mỗi fetch mất 50 ms.' },
        { input: 'await layVoiThuLai("/api/khong-ton-tai")', output: 'Error: HTTP 404   (1 lần gọi)', explanation: 'Lỗi phía người gọi — thử lại không giúp gì.' },
      ],
      goiY: [
        'thuLai: for (let lan = 1; lan <= soLan; lan++) { try { return await ham(); } catch (err) { loiCuoi = err; if (lan < soLan) await cho(choMs * 2 ** (lan - 1)); } } throw loiCuoi;',
        'Để dừng sớm với 4xx: thêm tham số tuỳ chọn nenThuLai(err) cho thuLai; trong layVoiThuLai ném lỗi có gắn err.status, và nenThuLai = (err) => !(err.status >= 400 && err.status < 500).',
      ],
      khoiDau: {
        'main.js': `// Bài 5.4 — Thử lại
function thuLai(ham, soLan, choMs) {
  return ham();
}

async function layVoiThuLai(url) {
  const res = await fetch(url);
  return res.json();
}
`,
      },
      loiGiai: {
        'main.js': `// Bài 5.4 — Thử lại
const cho = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// nenThuLai(err) quyết định lỗi nào đáng thử lại (mặc định: mọi lỗi)
async function thuLai(ham, soLan, choMs, nenThuLai = () => true) {
  let loiCuoi;
  for (let lan = 1; lan <= soLan; lan++) {
    try {
      return await ham();                       // await TRONG try ⇒ reject rơi vào catch
    } catch (err) {
      loiCuoi = err;
      if (!nenThuLai(err)) break;               // lỗi vĩnh viễn: dừng ngay
      if (lan < soLan) {
        await cho(choMs * 2 ** (lan - 1));      // lùi dần: choMs, 2×, 4×, ...
      }
    }
  }
  throw loiCuoi;                                // hết lượt: báo lỗi của lần cuối
}

async function layVoiThuLai(url) {
  const motLan = async () => {
    const res = await fetch(url);               // mất mạng ⇒ TypeError (đáng thử lại)
    if (!res.ok) {
      const err = new Error(´HTTP @{res.status}´);
      err.status = res.status;                  // gắn mã để nenThuLai phân loại
      throw err;
    }
    return res.json();
  };
  // 4xx là lỗi phía người gọi (sai URL, thiếu quyền) — gọi lại cũng vậy thôi
  const tamThoi = (err) => !(err.status >= 400 && err.status < 500);
  return thuLai(motLan, 3, 100, tamThoi);
}
`,
      },
      giaiThich: `<p>Thử lại là thứ mọi ứng dụng di động đều cần, và có ba chỗ dễ sai: (1) <strong>chờ lùi dần</strong> — thử lại ngay lập tức với máy chủ đang quá tải chỉ đổ thêm dầu vào lửa; nhân đôi thời gian chờ cho máy chủ thở. (2) <strong>Lỗi nào đáng thử lại</strong> — mất mạng và 5xx có thể tự hết; 404/401/400 thì không, thử lại chỉ phí thời gian người dùng. (3) <strong>Báo đúng lỗi</strong> — hết lượt thì ném lỗi của lần cuối, không phải một thông báo chung chung.</p>
<p>Máy chấm dùng máy chủ giả trả lần lượt: mất mạng → 503 → 200, và đo thời gian ảo 450 ms; đếm số lần gọi cho 404 (1) và 500 (3). Ngoài đời người ta còn thêm "jitter" (ngẫu nhiên hoá thời gian chờ) để hàng nghìn máy khách không thử lại cùng một khoảnh khắc.</p>`,
      loiHayGap: [
        `${c('return ham()')} trong try thiếu await — reject không vào catch, không bao giờ thử lại.`,
        'Chờ cả sau lần cuối — tốn thêm thời gian rồi vẫn thất bại.',
        'Thử lại cả 404.',
        'Đếm soLan là số lần THỬ LẠI (thành 4 lần gọi) thay vì tổng số lần gọi.',
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503',
      kiem: [
        { moTa: 'Mất mạng → 503 → OK: lấy được dữ liệu', goi: 'await layVoiThuLai("/api/thoi-tiet")', mongDoi: { nhietDo: 31, troi: 'nắng' } },
        { moTa: 'Tổng 450 ms (lùi 100 rồi 200)', chuanBi: 'const t = Date.now(); await layVoiThuLai("/api/thoi-tiet");', goi: 'Date.now() - t', mongDoi: 450 },
        { moTa: 'Gọi đúng 3 lần', chuanBi: 'await layVoiThuLai("/api/thoi-tiet");', goi: '__fetchDaGoi.length', mongDoi: 3 },
        { moTa: '404 → dừng ngay sau 1 lần', chuanBi: 'let loi = null; await layVoiThuLai("/api/khong-ton-tai").catch((e) => { loi = e.message; });', goi: '[loi, __fetchDaGoi.length]', mongDoi: ['HTTP 404', 1] },
        { moTa: '500 mãi → reject HTTP 500 sau 3 lần', chuanBi: 'let loi = null; await layVoiThuLai("/api/luon-hong").catch((e) => { loi = e.message; });', goi: '[loi, __fetchDaGoi.length]', mongDoi: ['HTTP 500', 3] },
        { moTa: 'thuLai: thành công ở lần 2, chờ đúng choMs', chuanBi: 'let n = 0; const t = Date.now(); const v = await thuLai(() => (++n < 2 ? Promise.reject(new Error("x")) : Promise.resolve("ok")), 5, 30);', goi: '[v, n, Date.now() - t]', mongDoi: ['ok', 2, 30] },
        { moTa: 'thuLai: hết lượt → lỗi của lần cuối', goi: 'await (() => { let n = 0; return thuLai(() => Promise.reject(new Error("lần " + (++n))), 3, 10); })()', mongDoi: { loi: 'Error', thongDiep: '^lần 3$' } },
        { moTa: 'thuLai: lùi dần 10, 20, 40', chuanBi: 'const t = Date.now(); await thuLai(() => Promise.reject(new Error("x")), 4, 10).catch(() => {});', goi: 'Date.now() - t', mongDoi: 70, an: true },
      ],
    },
  ],
});
