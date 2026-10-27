/**
 * Bộ luyện Code Lab "Nền tảng Web" — track `web-foundations-practice`
 * ═══════════════════════════════════════════════════════════════════════════
 * NGUỒN SỰ THẬT của đề nằm ở thư mục này (`nguon/<slug-bài-học>.mjs`, mỗi tệp
 * MỘT module = MỘT bài học, module slug = slug bài học trong
 * content/courses/web-foundations/sNN-*.mjs — xem KE-HOACH-CODELAB.md §0b).
 *
 * Tệp JSON nạp được bằng seed nằm một cấp trên:
 *   ../_track.json                                   → scripts/codelab-create-track.mjs
 *   ../web-foundations-practice__<moduleSlug>.json   → scripts/codelab-seed-authored.mjs
 * JSON được SINH từ nguồn này bằng:
 *   node scripts/codelab-kiem-de-web.mjs --xuat      (kiểm + ghi JSON)
 *   node scripts/codelab-kiem-de-web.mjs             (chỉ kiểm; báo nếu JSON lệch nguồn)
 * Đừng sửa JSON bằng tay — sửa ở đây rồi --xuat.
 *
 * ─── NGÔN NGỮ ──────────────────────────────────────────────────────────────
 * Đề viết TIẾNG VIỆT. Bảng code_exercises song ngữ bằng CỘT RIÊNG
 * (problemHtml / problemHtmlVi, solutionExplanationHtml / …Vi), KHÔNG dùng
 * "EN|||VI" như tiêu đề bài học khoá. Khi chưa có bản EN (`en` vắng):
 *   problemHtml = bản Việt, problemHtmlVi = null
 * (để nút EN/VN không hiện hai bản giống hệt nhau). Khi thêm `en: { moTa,
 * yeuCau, giaiThich, loiHayGap }` vào một đề, bộ xuất tự chuyển thành
 * problemHtml = EN, problemHtmlVi = VI.
 *
 * ─── HÌNH DẠNG MỘT ĐỀ (tác giả viết) ───────────────────────────────────────
 *   {
 *     tieuDe:  'Bộ khung trang HTML5 hợp lệ',        // title (slug sinh từ đây)
 *     doKho:   'EASY' | 'MEDIUM' | 'HARD',
 *     phut:    10,                                    // estimatedMinutes
 *     diem:    10,                                    // points (mặc định theo độ khó)
 *     khaiNiem:[…], tienQuyet:[…], the:[…],           // concepts / prerequisites / tags
 *     moTa:    '<p>…</p>',                            // mô tả ngắn (HTML)
 *     yeuCau:  ['…', '…'],                            // gạch đầu dòng (HTML inline được)
 *     dauVao:  '…', dauRa: '…',                       // inputSpec / outputSpec
 *     rangBuoc:['…'],                                 // → constraints, mỗi dòng một ràng buộc
 *     viDu:    [{ input, output, explanation }],      // khung "HTML vào → trang hiển thị"
 *     goiY:    ['gợi ý 1 (hướng)', 'gợi ý 2 (gần lời giải)'],
 *     khoiDau: { 'index.html': '…', 'styles.css': '…' },   // starter (tệp đầu = tệp mở trước)
 *     loiGiai: { 'index.html': '…', 'styles.css': '…' },   // lời giải đầy đủ có chú thích
 *     giaiThich:'<p>…</p>',                           // VÌ SAO lời giải đúng
 *     loiHayGap:['…'],                                // lỗi hay gặp
 *     thamKhao:'https://developer.mozilla.org/…',     // referenceUrl
 *     kiem:    [ …KIỂM… ],                            // bộ kiểm máy chấm (dưới đây)
 *   }
 *
 * ─── BỘ KIỂM (testsJson) ───────────────────────────────────────────────────
 * CHƯA CÓ CỘT trong CSDL (đợt 2 thêm `code_exercises.tests_json JSONB`). Bộ
 * xuất vẫn ghi `testsJson` vào payload JSON; codelab-seed-authored.mjs BỎ QUA
 * trường này (nó chỉ chép các cột đã có) — đợt 2 nạp lại từ JSON.
 *
 *   testsJson = {
 *     loai: 'dom',              // máy chấm DOM: dựng trang trong iframe srcdoc sandbox
 *     phienBan: 1,
 *     tepHtml: 'index.html',    // tệp HTML gốc của bài
 *     kiem: [ Kiem, … ]
 *   }
 *
 * Cách dựng trang trước khi kiểm (máy chấm trình duyệt PHẢI làm y hệt):
 *   1. Lấy tệp `tepHtml` từ code người học.
 *   2. Mỗi <link rel="stylesheet" href="X"> mà X là một tệp trong bài ⇒ GIỮ thẻ link
 *      (kiểm cấu trúc head cần nó) và chèn NGAY SAU nó <style>nội dung X</style>
 *      (đúng vị trí cũ, giữ thứ tự cascade).
 *   3. KHÔNG chạy <script> (Ch2–Ch3 chỉ HTML/CSS).
 *   4. Iframe rộng `beRong` px (mặc định 1024) và CAO 768px (100vh = 768px) — kiểm
 *      responsive đặt beRong khác. Body giữ margin 8px mặc định của trình duyệt.
 *
 * Kiem = {
 *   moTa:   string,      // câu tiếng Việt hiện cho người học (✓/✗ từng dòng)
 *   kiem:   LOẠI,        // xem bảng
 *   selector?: string,   // CSS selector trên DOM đã dựng
 *   an?:    true,        // kiểm ẩn: chỉ chạy khi "Nộp", không hiện ở "Chạy thử"
 *   beRong?: number,     // bề rộng iframe (px) khi kiểm; mặc định 1024
 *   ...tham số riêng của LOẠI
 * }
 *
 *  LOẠI            tham số                         ĐẠT khi
 *  ─────────────── ─────────────────────────────── ─────────────────────────────────────────
 *  'doctype'       —                               document.doctype?.name === 'html'
 *  'ton-tai'       selector                        có ≥ 1 phần tử khớp
 *  'khong-ton-tai' selector                        không phần tử nào khớp
 *  'so-luong'      selector, giaTri | min/max      số phần tử khớp đúng giaTri / nằm trong [min,max]
 *  'thuoc-tinh'    selector, thuocTinh,            MỌI phần tử khớp (tatCa:false ⇒ ÍT NHẤT MỘT)
 *                  giaTri? | khop?, tatCa?         có thuộc tính; nếu có giaTri ⇒ bằng đúng
 *                                                  (so nguyên văn, sau trim); khop = regex (chuỗi, cờ 'i')
 *  'text'          selector, giaTri | khop, tatCa? textContent (gộp khoảng trắng, trim) bằng / khớp
 *  'css'           selector, thuocTinh,            getComputedStyle(el).getPropertyValue(thuocTinh)
 *                  giaTri | khop, tatCa?, beRong?  sau CHUẨN HOÁ (chữ thường, gộp khoảng trắng,
 *                                                  ", " sau dấu phẩy, rem→px ×16) bằng giaTri / khớp khop.
 *                                                  Màu viết dạng rgb(r, g, b) như trình duyệt trả về.
 *  'kich-thuoc'    selector, thuocTinh:'width'|    getBoundingClientRect()[thuocTinh] ≈ giaTri (±0,5px)
 *                  'height', giaTri, beRong?
 *  'so-cot'        selector, giaTri, beRong?       số rãnh cột của grid = giaTri (trình duyệt: đếm
 *                                                  token px > 0 của computed grid-template-columns —
 *                                                  auto-fit gập rãnh rỗng thành 0px, không tính)
 *  'ti-le-cot'     selector, giaTri, beRong?       bề rộng cột 1 / cột 2 ≈ giaTri (±0,05) — vd 2fr 1fr ⇒ 2
 *                                                  (trình duyệt: chia hai token px đầu; nếu có gap
 *                                                  thì vẫn đúng vì gap không nằm trong rãnh)
 *  'co-nhan'       selector                        MỌI phần tử khớp có nhãn: el.labels.length ≥ 1
 *                                                  hoặc aria-label / aria-labelledby không rỗng
 *  'neo-hop-le'    selector (vd 'nav a[href^="#"]') có ≥1 phần tử và MỌI href="#id" trỏ tới id có thật
 *  'tieu-de'       selector? (phạm vi, mặc định    đúng MỘT <h1>, và cấp tiêu đề theo thứ tự tài liệu
 *                  'body')                         không nhảy cấp (h2 → h4 là trượt)
 *  'thu-tu'        cacSelector: [a, b, c]          mỗi selector có phần tử và chúng xuất hiện ĐÚNG
 *                                                  thứ tự đó trong tài liệu (phần tử đầu của mỗi cái)
 *  'hop-le'        selector (form/input), dien?:    sau khi gán value theo `dien` {selector: giá trị}
 *                  {sel: val}, chon?: [sel],       và checked=true cho `chon`, el.checkValidity()
 *                  giaTri: true|false              === giaTri. ⚠ minlength/maxlength KHÔNG kích hoạt
 *                                                  khi gán value bằng mã (đặc tả: chỉ khi người dùng gõ)
 *                                                  ⇒ kiểm minlength bằng 'thuoc-tinh'.
 *  'ma-nguon'      tep? (mặc định mọi tệp), khop,  regex khớp mã nguồn ĐÃ BỎ chú thích (<!-- -->, /* * /);
 *                  phuDinh?: true,                 phuDinh ⇒ ĐẠT khi KHÔNG khớp (cấm !important, cấm style=…);
 *                  giuChuThich?: true              giuChuThich ⇒ khớp trên mã GỐC (kiểm "có chú thích giải thích")
 *
 * Nguyên tắc soạn kiểm:
 *   - Mỗi yêu cầu trong `yeuCau` có ít nhất một kiểm. Lời giải PHẢI qua hết;
 *     code khởi đầu PHẢI trượt ít nhất một (script kiểm cả hai chiều).
 *   - Kiểm giá trị computed thay vì kiểm chữ trong mã khi có thể (người học
 *     viết `gap:16px` hay `gap: 1rem` đều đúng).
 *   - Bố cục thật (kich-thuoc, so-cot với auto-fit) chỉ đo được trong trình
 *     duyệt; script Node ước lượng từ giá trị khai báo và ghi rõ là ước lượng.
 *
 * ═══ MỞ RỘNG CH4–CH5 (đợt đề 2, 14/10/2026) — JavaScript ═══════════════════
 * Một đề chọn loại máy chấm bằng `loaiKiem` (trên đề, hoặc mặc định của cả
 * module: `export default { loaiKiem: 'js', … }`). Vắng ⇒ 'dom' như Ch2–Ch3
 * (JSON Ch2–Ch3 sinh ra KHÔNG đổi một byte).
 *
 *   loaiKiem   đề viết…                       testsJson
 *   ────────── ────────────────────────────── ──────────────────────────────────────────
 *   'dom'      trang HTML/CSS (+ JS nếu       { loai:'dom', phienBan:1|2, tepHtml, chayScript?, kiem }
 *              chayScript: true — Bài 4.5)
 *   'js'       HÀM; máy chấm gọi hàm, so giá  { loai:'js', phienBan:1, tepChinh, tepNap?, fetchGia?, timeoutMs?, kiem }
 *              trị trả về (so SÂU)
 *   'console'  chương trình IN ra console;    { loai:'console', … như 'js' }  — mặc định kiểm so dãy dòng in
 *              so thứ tự các dòng (Bài 5.1)
 *   'module'   nhiều tệp ES module            { loai:'module', phienBan:1, tepChinh, kiem }
 *              (import/export — Bài 5.5)
 *
 * Trường mới của đề: `loaiKiem`, `tepChinh` (mặc định 'main.js'), `tepNap` (dãy tệp
 * nạp theo thứ tự, mặc định [tepChinh]), `fetchGia` (bảng fetch giả chung cho mọi
 * kiểm của đề), `timeoutMs` (giờ ẢO tối đa, mặc định 10000), `chayScript` (dom).
 *
 * ─── Cách máy chấm chạy JS (js / console / module) ──────────────────────────
 * Hiện thực tham chiếu: scripts/codelab-cham-js.mjs (HARNESS = nguồn sự thật cho
 * máy chấm trình duyệt đợt 2 — Worker mới cho mỗi kiểm).
 *   1. Mỗi KIỂM chạy trong một realm MỚI. Nạp HARNESS trước, rồi các tệp `tepNap`
 *      như script CỔ ĐIỂN dùng chung một realm ⇒ `function f`, `const f = …` ở cấp
 *      cao nhất đều gọi được từ `goi`. Lỗi khi nạp (cú pháp, ReferenceError…) ⇒ kiểm trượt
 *      và hiện nguyên lỗi.
 *   2. `goi` chạy trong: `async () => { <chuanBi> ; return { v: (<goi>) } }` ⇒
 *      viết `await` trong goi/chuanBi được; KHÔNG viết await thì Promise được giữ
 *      nguyên (so như {"$js":"Promise"}) — để kiểm "hàm có trả Promise không".
 *   3. Hẹn giờ GIẢ: setTimeout/setInterval/clearTimeout/clearInterval/queueMicrotask
 *      do máy chấm cấp. Không ngủ thật: xả hết microtask → nhảy đồng hồ tới hẹn sớm
 *      nhất, chạy nó → lặp. `Date.now()` và `performance.now()` đọc ĐỒNG HỒ ẢO
 *      (Date.now() = 1767225600000 + ms ảo) ⇒ đo được "tuần tự 300ms / song song 100ms".
 *      `new Date()` KHÔNG bị giả. Trần CPU thật mỗi lần chạy mã 1000ms (`cpuMs`): vòng lặp
 *      vô hạn ⇒ trượt, không treo.
 *   4. console giả: console.log/info/warn/error/debug ghi vào CÙNG một dãy dòng.
 *      Một lời gọi = một dòng = các đối số nối bằng một dấu cách; chuỗi giữ nguyên,
 *      số/boolean/null/undefined → String(), Error → "Tên: thông điệp",
 *      hàm → "[Function]", object/mảng → JSON.stringify.
 *   5. fetch GIẢ — giao ước tiêm (không bao giờ gọi mạng thật):
 *        fetchGia = { "<METHOD> <url>" | "<url>": Mau | Mau[] }   (khoá có METHOD thắng)
 *        Mau = { status?: 200, json?: <giá trị> | text?: '…', headers?: {…},
 *                treMs?: 50, loiMang?: true }
 *      - fetch(url, init) tra `init.method` (mặc định GET) + url ĐÚNG NGUYÊN VĂN chuỗi.
 *      - Không có trong bảng ⇒ 404, text "Not Found". loiMang ⇒ reject TypeError('Failed to fetch').
 *      - Mau[] ⇒ lần gọi thứ i dùng phần tử i (hết dãy thì lặp phần tử cuối) — cho bài thử lại.
 *      - Trả về sau `treMs` ms ẢO (mặc định 50). Response giả có: ok, status, statusText,
 *        url, headers.get(k), text(), json() (json() hỏng ⇒ SyntaxError; đọc body lần hai
 *        ⇒ TypeError như trình duyệt).
 *      - Mọi lời gọi được ghi vào `__fetchDaGoi` = [{ url, method, headers, body }] — kiểm
 *        dùng nó để soi request (vd body POST): goi: "JSON.parse(__fetchDaGoi[0].body)".
 *      - Kiểm có thể khai `fetchGia` riêng, TRỘN đè lên bảng của đề.
 *   6. Có sẵn trong realm: các built-in của JS, URL, URLSearchParams, structuredClone
 *      tối giản (object/mảng/Date/Map/Set). KHÔNG có DOM.
 *
 * Kiểm loại js / console (Kiem):
 *   { moTa, goi?: 'tong(1, 2)', chuanBi?: 'const c = taoBoDem(); c();',
 *     mongDoi: <JSON> | { loi: 'TypeError', thongDiep?: 'regex' },
 *     so?: 'giaTri' | 'console',   // mặc định theo loai (js ⇒ giaTri, console ⇒ console)
 *     saiSo?: 1e-9,                // so số gần đúng (mọi số trong giá trị)
 *     fetchGia?, timeoutMs?, an? }
 *   - so 'giaTri': chạy tới khi Promise của goi settle; SO SÂU giá trị trả về với mongDoi:
 *     mảng so theo thứ tự, object không kể thứ tự khoá, số so ===. Giá trị JSON không viết
 *     được dùng dấu `$js`: {"$js":"undefined"}, {"$js":"NaN"}, {"$js":"Infinity"},
 *     {"$js":"-Infinity"}, {"$js":"function"}, {"$js":"Promise"},
 *     {"$js":"Error","name":…,"message":…} (Error TRẢ VỀ, không phải ném),
 *     {"$js":"Map","muc":[[k,v]…]}, {"$js":"Set","muc":[…]}, {"$js":"Date","iso":…}.
 *     Thuộc tính undefined trong object vẫn tính: {a: undefined} ⇒ {"a":{"$js":"undefined"}}.
 *   - mongDoi = { loi: 'TênLỗi', thongDiep? } (object CHỈ có hai khoá đó) ⇒ ĐẠT khi goi NÉM
 *     (hoặc Promise REJECT) lỗi có `name === loi` và message khớp regex thongDiep (cờ i).
 *     ⚠ Vì vậy đừng cho hàm của đề TRẢ VỀ object chỉ có khoá `loi` — đặt tên khoá khác.
 *   - so 'console': chạy tới khi HẾT hẹn giờ (và goi xong, nếu có); so dãy dòng in (cả lúc nạp
 *     tệp lẫn lúc gọi) với mongDoi: ["1","4","3","2"]. Lỗi lúc nạp tệp không làm hỏng so —
 *     các dòng in trước lỗi vẫn tính, lỗi hiện kèm.
 *   - Trong goi/chuanBi đọc được `__log` (mảng dòng đã in tới lúc đó) và `__fetchDaGoi`.
 *   - { kiem: 'ma-nguon', tep?, khop, phuDinh?, giuChuThich? } dùng được như loại dom (vd cấm
 *     `var`, buộc dùng `reduce`). Bỏ chú thích là bỏ /* *\/ và // (cả dòng chú thích).
 *
 * Kiểm loại module (Kiem):
 *   - Mọi tệp .js/.mjs là ES module; đường dẫn import PHẢI là đường tương đối có đuôi
 *     (`./math.js`) — giống trình duyệt; `./math` hay `'express'` ⇒ lỗi "Failed to resolve".
 *   - Mỗi tệp nạp MỘT lần (module được cache). Liên kết sai (import tên không export) ⇒
 *     SyntaxError lúc liên kết, như trình duyệt.
 *   - { kiem: 'nap-duoc', tep? }       ĐẠT khi tệp (mặc định tepChinh) liên kết + chạy không lỗi.
 *   - { so: 'console', mongDoi: [...] } chỉ nạp tepChinh (và những gì nó import), so dòng in.
 *   - { goi, mongDoi }                  nạp mọi tệp; trong goi, `__module('./math.js')` trả
 *                                       namespace của tệp đó (vd `.add(2, 3)`, `.default`,
 *                                       `Object.keys(__module('./math.js')).sort()`).
 *   - 'ma-nguon' như trên.
 *   Máy chấm trình duyệt: mỗi tệp → blob URL, viết lại specifier tương đối sang blob URL
 *   (hoặc import map), `__module(p)` = `await import(blob)`. Node: vm.SourceTextModule
 *   (cần --experimental-vm-modules — script kiểm tự bật).
 *
 * Kiểm loại dom có chạy script (`chayScript: true`, phienBan 2 — Bài 4.5):
 *   - <script> cổ điển KHÔNG defer/async (nội tuyến hoặc src trỏ tệp trong bài) chạy ĐÚNG
 *     chỗ parser gặp nó (src được chèn nội tuyến — trình duyệt cũng chặn parser như thế)
 *     ⇒ script trong <head> không thấy phần tử của <body>, đúng bẫy bài học.
 *     `defer` ⇒ chạy sau khi parse xong. type="module" KHÔNG chạy (jsdom không hỗ trợ).
 *   - Trang được dựng MỚI cho mỗi kiểm có `truoc`, chờ sự kiện load rồi mới làm `truoc`.
 *   - truoc: [Buoc, …] làm lần lượt trước khi kiểm:
 *       { hanhDong: 'click', selector, lan?: 1 }          el.click() (sự kiện nổi bọt như thật)
 *       { hanhDong: 'nhap', selector, giaTri }            gán value + phát 'input' (bubbles)
 *       { hanhDong: 'doi', selector, giaTri? }            (gán value) + phát 'change'
 *       { hanhDong: 'gui', selector }                     form.requestSubmit() — chạy kiểm hợp lệ + 'submit'
 *       { hanhDong: 'phim', selector, phim: 'Enter' }     phát keydown (bubbles) với key = phim
 *     selector không khớp ⇒ kiểm trượt ("không có <selector> để click").
 *   - Mọi loại kiểm DOM cũ dùng được sau `truoc` (text, thuoc-tinh, so-luong, css…), thêm:
 *       'console'      mongDoi: [...]   dãy dòng console.log của trang (lúc nạp + trong `truoc`)
 *       'khong-loi-js' —                không có lỗi JS nào không được bắt (lúc nạp + trong `truoc`)
 *       'thuoc-tinh-js' selector, thuocTinh, giaTri  đọc THUỘC TÍNH DOM (el.value, el.checked,
 *                       el.disabled, el.className…) — khác 'thuoc-tinh' đọc attribute HTML
 *       'khong-tai-lai' —               form không thật sự gửi đi trong `truoc`. Máy chấm mô phỏng
 *                       trình duyệt: submit KHÔNG bị preventDefault ⇒ trang TẢI LẠI (dựng mới từ
 *                       HTML gốc, mọi thay đổi DOM mất, các bước `truoc` còn lại chạy trên trang mới).
 */

const DIEM = { EASY: 10, MEDIUM: 20, HARD: 30 };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Mã nội dòng trong đề: c('<p>') ⇒ <code>&lt;p&gt;</code>. */
export const c = (s) => `<code>${esc(s)}</code>`;

/** Khối code trong đề (HTML escape). */
export const code = (s) => `<pre><code>${esc(s.replace(/^\n/, '').replace(/\s+$/, ''))}</code></pre>`;

function ngonNguTep(ten) {
  if (ten.endsWith('.css')) return 'css';
  if (ten.endsWith('.js')) return 'javascript';
  return 'html';
}

function khoiCode(map) {
  return Object.entries(map).map(([name, c]) => ({
    name,
    language: ngonNguTep(name),
    code: c.replace(/^\n/, '').replace(/[ \t]+$/gm, '').replace(/\s*$/, '\n'),
  }));
}

function dungDe({ moTa, yeuCau }) {
  return `${moTa.trim()}\n<h4>Yêu cầu</h4>\n<ul>\n${yeuCau.map((y) => `  <li>${y}</li>`).join('\n')}\n</ul>`;
}

function dungGiaiThich({ giaiThich, loiHayGap, bai }) {
  return `${giaiThich.trim()}\n<h4>Lỗi hay gặp</h4>\n<ul>\n${loiHayGap.map((y) => `  <li>${y}</li>`).join('\n')}\n</ul>`
    + (bai ? `\n<p><em>Ôn lại: ${bai}.</em></p>` : '');
}

/**
 * Đổi một đề (dạng tác giả viết) sang đúng hình dạng payload của
 * scripts/codelab-seed-authored.mjs (+ testsJson, seed bỏ qua).
 */
function dungTests(de, loaiMacDinh) {
  const loai = de.loaiKiem || loaiMacDinh || 'dom';
  if (loai === 'dom') {
    return {
      loai: 'dom',
      phienBan: de.chayScript ? 2 : 1,
      tepHtml: de.tepHtml || 'index.html',
      ...(de.chayScript ? { chayScript: true } : {}),
      kiem: de.kiem,
    };
  }
  return {
    loai,
    phienBan: 1,
    tepChinh: de.tepChinh || 'main.js',
    ...(de.tepNap ? { tepNap: de.tepNap } : {}),
    ...(de.fetchGia ? { fetchGia: de.fetchGia } : {}),
    ...(de.timeoutMs ? { timeoutMs: de.timeoutMs } : {}),
    kiem: de.kiem,
  };
}

export function xuatDe(de, { baiHoc, ngonNgu, loaiKiem }) {
  const vi = dungDe(de);
  const viGiai = dungGiaiThich({ ...de, bai: baiHoc });
  const en = de.en ? dungDe(de.en) : null;
  const enGiai = de.en ? dungGiaiThich({ ...de.en, bai: null }) : null;
  return {
    title: de.tieuDe,
    language: de.ngonNgu || ngonNgu,
    difficulty: de.doKho,
    estimatedMinutes: de.phut,
    points: de.diem ?? DIEM[de.doKho],
    concepts: de.khaiNiem || [],
    prerequisites: de.tienQuyet || [],
    tags: de.the || [],
    problemHtml: en || vi,
    problemHtmlVi: en ? vi : null,
    inputSpec: de.dauVao,
    outputSpec: de.dauRa,
    constraints: (de.rangBuoc || []).join('\n'),
    examplesJson: de.viDu,
    hintsJson: de.goiY,
    starterCodeJson: khoiCode(de.khoiDau),
    solutionCodeJson: khoiCode(de.loiGiai),
    solutionExplanationHtml: enGiai || viGiai,
    solutionExplanationHtmlVi: enGiai ? viGiai : null,
    diagramMermaid: de.soDo ?? null,
    referenceUrl: de.thamKhao ?? null,
    testsJson: dungTests(de, loaiKiem),
    // đợt Academy 28/10/2026 — cột mới của code_exercises (content/codelab/README.md)
    gradeKind: de.loaiKiem || loaiKiem || 'dom',
    kind: de.dangBai || 'practice',
    mistakesJson: (de.loiHayGap || []).map((loi) => ({ loi })),
    ...(de.thuatNgu ? { glossaryJson: de.thuatNgu } : {}),
  };
}

/**
 * Dấu thay cho tệp nguồn JS (Ch4–Ch5): code JS đầy dấu huyền và `${…}` — viết thẳng trong
 * template literal của tệp nguồn thì phải thoát từng chỗ, dễ sót. Tệp nguồn viết:
 *   ´  (U+00B4, dấu sắc đứng riêng — tiếng Việt không dùng)  ⇒  dấu huyền `
 *   @{                                                      ⇒  ${
 * rồi bọc cả module bằng doiDau({...}) — mọi chuỗi (đề, code, kiểm) được đổi lại trước khi xuất.
 */
export function doiDau(v) {
  if (typeof v === 'string') return v.replace(/´/g, '`').replace(/@\{/g, '${');
  if (Array.isArray(v)) return v.map(doiDau);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, doiDau(x)]));
  return v;
}
