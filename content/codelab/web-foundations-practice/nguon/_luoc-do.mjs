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
export function xuatDe(de, { baiHoc, ngonNgu }) {
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
    testsJson: {
      loai: 'dom',
      phienBan: 1,
      tepHtml: de.tepHtml || 'index.html',
      kiem: de.kiem,
    },
  };
}
