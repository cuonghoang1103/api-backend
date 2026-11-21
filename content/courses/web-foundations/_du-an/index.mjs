/**
 * Dự án xuyên suốt khoá Web Foundations (21/11/2026) — theo hợp đồng docs/du-an-hop-dong.md v1.
 *   duAn            ⇒ khoá `duAn` ở cấp gốc của web-foundations.mjs
 *   baiMoc(so)      ⇒ bài { type: 'EXERCISE', mocDuAn: so } chèn cuối chương `so` (trước quiz chương)
 *   baiBaoVe()      ⇒ bài { type: 'EXERCISE', baoVeDuAn: true } cuối khoá
 *   moiDangKy(lang) ⇒ đoạn "học xong làm được gì" + lời mời đăng ký, nối cuối bài 0.1 (cờ dangKyDuAn)
 * Mọi trường chuỗi của duAn là CHỮ THUẦN "EN|||VI" (không thẻ HTML, không dấu < >) — trừ gioiThieu là HTML.
 * Bài mốc dựng HTML từ các trường đó (thoát ký tự) + mã/output chạy thật trong _ma.mjs.
 */
import { ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';
import { DE_TAI } from './de-tai.mjs';
import { MOC } from './moc.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** 'EN|||VI' ⇒ phần của ngôn ngữ, đã thoát HTML. */
const T = (s, lang) => { const [en, vi] = String(s).split('|||'); return esc(lang === 'en' ? en : (vi ?? en)); };
const ul = (xs, lang) => '<ul>' + xs.map((x) => '<li>' + T(x, lang) + '</li>').join('') + '</ul>';

const GIOI_THIEU_EN = '<p>By the end of this course you will have built and deployed <strong>one real web application of your own</strong> — plain HTML, CSS and JavaScript in the browser, a Node.js API, a SQL database, login with hashed passwords and permissions, TypeScript types, automated tests running in CI, and a live HTTPS address you can put on your CV. Not a copy of the teacher’s demo: a product on a topic you chose.</p>' +
  '<p><strong>Why one project through the whole course?</strong> Lessons teach one idea at a time; a project forces the ideas to work together — the form from Chapter 2 sends data to the API from Chapter 6, which checks the session from Chapter 7 and writes to the tables from Chapter 8. That is where real understanding (and real bugs) come from. After each chapter there is a <strong>project milestone</strong> that applies exactly that chapter to your topic, so the project grows a little every week instead of being a panic at the end.</p>' +
  '<p><strong>How it is graded.</strong> Each milestone has “Done when” criteria you can check yourself. At the end you finish the project and defend it in front of an AI committee that reads your work and asks questions like a real panel; it scores you on a 10-point rubric (working features, code quality, API and data, security, interface, tests, deployment, and how well you explain your choices).</p>';
const GIOI_THIEU_VI = '<p>Học xong khoá này bạn sẽ tự dựng và đưa lên mạng <strong>một ứng dụng web thật của riêng mình</strong> — HTML, CSS, JavaScript thuần ở trình duyệt, một API Node.js, cơ sở dữ liệu SQL, đăng nhập với mật khẩu được băm và phân quyền, kiểu TypeScript, test tự động chạy trong CI, và một địa chỉ HTTPS thật để ghi vào CV. Không phải bản chép demo của thầy: một sản phẩm theo đề tài bạn tự chọn.</p>' +
  '<p><strong>Vì sao làm MỘT dự án xuyên suốt khoá?</strong> Bài học dạy từng ý một; dự án buộc các ý chạy cùng nhau — form ở Chương 2 gửi dữ liệu tới API ở Chương 6, API kiểm phiên ở Chương 7 rồi ghi vào bảng ở Chương 8. Hiểu thật (và lỗi thật) đến từ đó. Sau mỗi chương có một <strong>mốc dự án</strong> áp đúng kiến thức chương ấy vào đề tài của bạn, nên dự án lớn dần mỗi tuần thay vì dồn hết vào cuối khoá.</p>' +
  '<p><strong>Chấm thế nào.</strong> Mỗi mốc có tiêu chí “Đạt khi” để bạn tự kiểm. Cuối khoá bạn hoàn thiện dự án và bảo vệ trước một hội đồng AI — nó đọc sản phẩm của bạn và hỏi như hội đồng thật; chấm theo thang 10 điểm (tính năng chạy đúng, chất lượng mã, API và dữ liệu, bảo mật, giao diện, kiểm thử, triển khai, và cách bạn giải thích lựa chọn của mình).</p>';

export const TU_CHON = {
  yeuCauToiThieu: [
    "At least 4 pages or screens with shared navigation, semantic HTML, usable from 375 px to 1280 px wide.|||Ít nhất 4 trang hoặc màn hình có điều hướng chung, HTML ngữ nghĩa, dùng tốt từ 375 px tới 1280 px.",
    "Frontend written in plain HTML, CSS and JavaScript (a framework only after the plain version works).|||Frontend viết bằng HTML, CSS, JavaScript thuần (chỉ dùng framework sau khi bản thuần đã chạy).",
    "At least one main resource with full CRUD through your own REST API and correct status codes.|||Ít nhất một tài nguyên chính có đủ CRUD qua API REST của riêng bạn, mã trạng thái đúng.",
    "At least one form validated both in the browser and on the server.|||Ít nhất một form được kiểm hợp lệ cả ở trình duyệt lẫn máy chủ.",
    "Register/login with hashed passwords and at least one ownership or role rule (401/403).|||Đăng ký/đăng nhập với mật khẩu được băm và ít nhất một luật sở hữu hoặc vai trò (401/403).",
    "Data in a SQL database with at least 3 related tables.|||Dữ liệu trong cơ sở dữ liệu SQL với ít nhất 3 bảng có quan hệ.",
    "Something that needs dates or money handled correctly (time zones, integer amounts).|||Có phần cần xử lý đúng ngày giờ hoặc tiền (múi giờ, số tiền nguyên).",
    "Testable logic (at least 10 automated tests) and a deploy target with HTTPS.|||Có logic kiểm thử được (ít nhất 10 test tự động) và chỗ deploy có HTTPS.",
  ],
  goiYQuyMo: "Aim for a one-sentence pitch, 6–12 features and roughly 40–80 hours of work spread over the course. Too small: a single list with no login and no relations. Too big: real payments, real-time chat, video, AI features, or more than one kind of user dashboard — cut it to a core you can finish and defend, and keep the rest as “future work” in the README.|||Nhắm tới một câu giới thiệu, 6–12 tính năng và khoảng 40–80 giờ làm rải theo khoá. Quá nhỏ: chỉ một danh sách, không đăng nhập, không quan hệ. Quá to: thanh toán thật, chat thời gian thực, video, tính năng AI, hoặc nhiều hơn một kiểu trang quản trị — hãy cắt về phần lõi bạn làm xong và bảo vệ được, phần còn lại ghi “hướng phát triển” trong README.",
};

export const BAO_VE = {
  rubric: [
    { tieuChi: "Working features|||Tính năng chạy đúng", diem: 2.5, moTa: "The core features of your topic work end to end on the live site, including empty, error and permission cases.|||Các tính năng lõi của đề tài chạy trọn từ đầu tới cuối trên trang thật, kể cả ca rỗng, lỗi và phân quyền." },
    { tieuChi: "Code structure and quality|||Cấu trúc và chất lượng mã", diem: 1.5, moTa: "Modules with one job each, clear names, no copy-paste blocks, strict TypeScript for the core, a README that explains how to run it.|||Module mỗi cái một việc, tên rõ ràng, không khối chép dán, TypeScript strict cho phần lõi, README nói rõ cách chạy." },
    { tieuChi: "HTTP API and data|||API HTTP và dữ liệu", diem: 1.5, moTa: "REST routes with correct methods and status codes, validation on the server, a normalised schema with constraints, parameterized queries, one transaction.|||Tuyến REST đúng method và mã trạng thái, kiểm hợp lệ ở máy chủ, schema chuẩn hoá có ràng buộc, truy vấn có tham số, một transaction." },
    { tieuChi: "Security and authentication|||Bảo mật và xác thực", diem: 1.5, moTa: "Hashed passwords, HttpOnly session cookie (or a justified alternative), 401/403 checked on the server, no secrets in the repository, user text never inserted as HTML.|||Mật khẩu được băm, cookie phiên HttpOnly (hoặc phương án khác có lý do), 401/403 kiểm ở máy chủ, không có khoá bí mật trong repo, chữ người dùng không bao giờ chèn như HTML." },
    { tieuChi: "Interface, responsive and accessibility|||Giao diện, responsive và khả năng tiếp cận", diem: 1, moTa: "Semantic HTML, works from 375 to 1280 px, keyboard usable with visible focus, tokens and dark mode, readable contrast.|||HTML ngữ nghĩa, dùng tốt từ 375 tới 1280 px, dùng được bằng bàn phím với focus nhìn thấy, token và chế độ tối, tương phản dễ đọc." },
    { tieuChi: "Tests and CI|||Kiểm thử và CI", diem: 1, moTa: "Meaningful unit tests with edge cases, at least two UI or API tests, faked network, a green CI run on the final commit.|||Unit test có ý nghĩa với ca biên, ít nhất hai test giao diện hoặc API, mạng được làm giả, CI xanh ở commit cuối." },
    { tieuChi: "Deployment and robustness|||Triển khai và độ vững", diem: 0.5, moTa: "Live HTTPS URL, configuration from environment variables with fail-fast, smoke test, friendly error messages, correct dates.|||URL HTTPS chạy thật, cấu hình từ biến môi trường và hỏng sớm, smoke test, thông báo lỗi thân thiện, ngày giờ đúng." },
    { tieuChi: "Presentation and answers|||Trình bày và trả lời", diem: 0.5, moTa: "A 5-minute demo that follows a user story; answers that explain why, point to the right file, and admit trade-offs honestly.|||Demo 5 phút đi theo một câu chuyện người dùng; câu trả lời giải thích được vì sao, chỉ đúng tệp, và thật thà về đánh đổi." },
  ],
  cauHoiMau: [
    "Walk us through what happens, from the click to the pixels, when a user submits your main form.|||Hãy kể chuyện gì xảy ra, từ cú bấm tới điểm ảnh, khi người dùng gửi form chính của bạn.",
    "Why is this route a PATCH and not a PUT? What status code does it return when the id does not exist, and why?|||Vì sao tuyến này là PATCH mà không phải PUT? Nó trả mã gì khi id không tồn tại, vì sao?",
    "Show me where you check that the record belongs to the logged-in user. What happens if I call the API with curl and someone else’s id?|||Chỉ chỗ bạn kiểm bản ghi thuộc về người đang đăng nhập. Nếu tôi gọi API bằng curl với id của người khác thì sao?",
    "How are passwords stored? What would an attacker get if your database leaked tomorrow?|||Mật khẩu được lưu thế nào? Nếu mai cơ sở dữ liệu bị lộ thì kẻ tấn công lấy được gì?",
    "Why did you choose a session cookie (or a JWT)? Where is it stored in the browser, and why can JavaScript not read it?|||Vì sao bạn chọn cookie phiên (hay JWT)? Nó nằm ở đâu trong trình duyệt, và vì sao JavaScript không đọc được?",
    "Draw your tables and their relationships. Which column has a UNIQUE constraint, and what bug does it prevent?|||Vẽ các bảng và quan hệ. Cột nào có ràng buộc UNIQUE, nó chặn lỗi gì?",
    "Which action in your app uses a transaction? What would go wrong without it?|||Thao tác nào trong app dùng transaction? Thiếu nó thì hỏng thế nào?",
    "If I type a single quote and OR 1=1 into your search box, what happens and why?|||Nếu tôi gõ một dấu nháy đơn và OR 1=1 vào ô tìm kiếm thì chuyện gì xảy ra, vì sao?",
    "If a user names an item with an HTML script tag, what do other users see? Show the line that makes it safe.|||Nếu người dùng đặt tên một mục là thẻ script HTML thì người khác thấy gì? Chỉ dòng mã làm cho nó an toàn.",
    "Your API is down. What exactly does the user see on each screen, and what do you see in the logs?|||API của bạn sập. Người dùng thấy chính xác gì ở từng màn hình, còn bạn thấy gì trong log?",
    "A user in Hanoi creates something at 00:30. Which date does the server store, and which date does the page show? Prove it.|||Người dùng ở Hà Nội tạo một mục lúc 00:30. Máy chủ lưu ngày nào, trang hiện ngày nào? Chứng minh.",
    "The requirement changes: each item now needs a second category. Which files, tables and tests do you change?|||Yêu cầu đổi: mỗi mục cần thêm danh mục thứ hai. Bạn sửa những tệp, bảng và test nào?",
    "Pick one test and explain what bug it would catch. Show it failing by breaking the code on purpose.|||Chọn một test và giải thích nó bắt được lỗi gì. Cố ý làm hỏng mã để cho thấy nó đỏ.",
    "Which values come from environment variables, and what happens if one is missing in production?|||Những giá trị nào lấy từ biến môi trường, và thiếu một cái ở production thì chuyện gì xảy ra?",
    "Show the TypeScript type of your main entity. Where does untrusted JSON become that type, and how do you check it?|||Cho xem kiểu TypeScript của thực thể chính. JSON không đáng tin trở thành kiểu đó ở đâu, bạn kiểm nó thế nào?",
    "How does your layout go from one column on a phone to several on a laptop? Which CSS lines do that?|||Bố cục của bạn đi từ một cột trên điện thoại tới nhiều cột trên máy tính thế nào? Những dòng CSS nào làm việc đó?",
    "How does dark mode work in your project? What changes — the components or the tokens?|||Chế độ tối trong dự án hoạt động ra sao? Cái gì thay đổi — component hay token?",
    "Tell us about the hardest bug you hit. How did you reproduce it, and how do you know it is really fixed?|||Kể về lỗi khó nhất bạn gặp. Bạn tái hiện nó thế nào, và sao biết nó đã thật sự được sửa?",
    "What does your Lighthouse report say, and what did you change to improve one number?|||Báo cáo Lighthouse của bạn nói gì, và bạn đã đổi gì để cải thiện một con số?",
    "Where could your app leak memory, and how did you make sure listeners and timers are removed?|||App của bạn có thể rò rỉ bộ nhớ ở đâu, và bạn làm sao để chắc listener và timer được gỡ?",
    "Which part of the code did an AI assistant help with, and how did you check that it was correct?|||Phần mã nào có trợ lý AI giúp, và bạn kiểm nó đúng bằng cách nào?",
    "If you had two more weeks, what would you build or fix first, and why that?|||Nếu có thêm hai tuần, bạn sẽ làm hoặc sửa gì trước, vì sao lại là nó?",
  ],
  chuanBi: [
    "The live URL opens on a phone over mobile data; the smoke test passes against it.|||URL thật mở được trên điện thoại bằng 4G; smoke test chạy qua với nó.",
    "README: pitch, features ticked, screenshots, how to run locally, environment variables, API table, schema diagram, live URL, known limitations.|||README: câu giới thiệu, tính năng đã đánh dấu, ảnh chụp, cách chạy ở máy, biến môi trường, bảng API, sơ đồ schema, URL thật, giới hạn đã biết.",
    "A fresh clone runs with npm ci, the .env.example values and one seed command.|||Một bản clone mới chạy được với npm ci, các giá trị .env.example và một lệnh seed.",
    "CI is green on the final commit; tag it v1.0.0.|||CI xanh ở commit cuối; gắn tag v1.0.0.",
    "Two demo accounts (normal user + admin/staff) with sample data, written in the README — not your real password.|||Hai tài khoản demo (người dùng thường + admin/nhân viên) có dữ liệu mẫu, ghi trong README — không phải mật khẩu thật của bạn.",
    "All 15 milestones marked done, each with the commit or tag that delivered it.|||Đủ 15 mốc đã đánh dấu xong, mỗi mốc kèm commit hoặc tag đã giao nó.",
    "A 5-minute demo script that follows one user story from sign-up to the main feature.|||Kịch bản demo 5 phút đi theo một câu chuyện người dùng từ đăng ký tới tính năng chính.",
    "You can open, without searching, the file for: the main route, the permission check, the schema, the store, one test.|||Bạn mở được ngay, không cần tìm, tệp chứa: tuyến chính, chỗ kiểm quyền, schema, store, một test.",
    "Search the repository history for secrets one last time (git log -p | grep your secret values).|||Dò lịch sử repo tìm khoá bí mật một lần cuối (git log -p | grep các giá trị bí mật của bạn).",
  ],
};

export const duAn = {
  version: 1,
  gioiThieu: GIOI_THIEU_EN + '|||' + GIOI_THIEU_VI,
  deTai: DE_TAI,
  tuChon: TU_CHON,
  moc: MOC.map(({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop }) => ({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop })),
  baoVe: BAO_VE,
};

/* ─────────────────────────── bài mốc ─────────────────────────── */

const NHAN = {
  en: {
    eyebrow: (c, n) => 'Chapter ' + c + ' · Project milestone ' + n + ' of 15',
    start: 'Topic registered', defence: 'Finish & defend', you: 'You are here',
    prev: (n) => 'Milestone ' + n, next: (n) => 'Milestone ' + n,
    req: '✅ Required', stretch: '⭐ Stretch goals (optional)', map: '🧭 What this milestone means for each suggested topic',
    topic: 'Topic', build: 'What you build now', own: 'Your own topic: apply the same requirements to your feature list. If one makes no sense for your topic, write in the README which feature practises that skill instead.',
    starter: '🧪 Minimal working example — sample topic “Recipe notebook”',
    starterNote: 'The sample topic is deliberately not one of the suggested topics, so this is a starting skeleton, not a solution to copy. Every snippet below was run for real; the output is pasted unchanged.',
    hints: '💡 Hints, one layer at a time', hintsNote: 'Open only the next layer you need.',
    done: '🎯 Done when', submit: '📤 Submit', submitNote: 'Use the submission box under this lesson. Send:',
    nop: { repo: 'the repository link and the commit (or tag) that completes this milestone', demo: 'a link to a running demo (GitHub Pages / a deployed URL; before milestone 14 a short screen recording is fine)', anh: 'screenshots of the result' },
    tick: 'Then tick the milestone as done. The progress bar of the course project counts it.',
    more: 'Lessons this milestone uses', open: 'Open lesson',
  },
  vi: {
    eyebrow: (c, n) => 'Chương ' + c + ' · Mốc dự án ' + n + '/15',
    start: 'Đã đăng ký đề tài', defence: 'Hoàn thiện & bảo vệ', you: 'Bạn đang ở đây',
    prev: (n) => 'Mốc ' + n, next: (n) => 'Mốc ' + n,
    req: '✅ Yêu cầu bắt buộc', stretch: '⭐ Nâng cao (tuỳ chọn)', map: '🧭 Mốc này nghĩa là gì với từng đề tài gợi ý',
    topic: 'Đề tài', build: 'Phần bạn làm ở mốc này', own: 'Đề tài tự chọn: áp cùng danh sách yêu cầu vào các tính năng của bạn. Yêu cầu nào không hợp với đề tài thì ghi trong README tính năng nào luyện kỹ năng đó thay thế.',
    starter: '🧪 Ví dụ tối thiểu chạy được — đề tài mẫu “Sổ công thức”',
    starterNote: 'Đề tài mẫu cố ý không nằm trong danh sách gợi ý, nên đây là bộ khung khởi đầu, không phải lời giải để chép. Mọi đoạn mã dưới đây đã chạy thật; output dán nguyên văn.',
    hints: '💡 Gợi ý theo tầng', hintsNote: 'Chỉ mở tầng tiếp theo khi cần.',
    done: '🎯 Đạt khi', submit: '📤 Nộp bài', submitNote: 'Dùng khung nộp bài bên dưới bài này. Gửi:',
    nop: { repo: 'link repo và commit (hoặc tag) hoàn thành mốc này', demo: 'link demo đang chạy (GitHub Pages / URL đã deploy; trước mốc 14 một đoạn quay màn hình ngắn cũng được)', anh: 'ảnh chụp kết quả' },
    tick: 'Rồi đánh dấu mốc đã xong. Thanh tiến độ dự án của khoá sẽ tính nó.',
    more: 'Bài học mốc này dùng tới', open: 'Mở bài',
  },
};

function khoiMoc(m, lang) {
  const N = NHAN[lang];
  const [bayTe, bayTv, bayBe, bayBv] = m.bay.split('|||');
  const [hdEn, hdVi] = [m.goiY.map((g) => T(g, 'en')), m.goiY.map((g) => T(g, 'vi'))];
  const hints = (lang === 'en' ? hdEn : hdVi).map((h) => {
    const i = h.indexOf(' — ');
    return '<details class="tu-kiem"><summary>' + h.slice(0, i) + '</summary><p>' + h.slice(i + 3) + '</p></details>';
  }).join('\n');
  const truoc = m.so === 1 ? N.start : N.prev(m.so - 1);
  const sau = m.so === 15 ? N.defence : N.next(m.so + 1);
  const demo = m.demo.map((d) =>
    '<h4>' + T(d.tieu, lang) + '</h4>\n' +
    (d.code ? ma(d.lang, CODE[d.code], d.dong) + '\n' : '') +
    (d.out ? ra(OUT[d.out]) + '\n' : '') +
    (d.giai ? '<p>' + T(d.giai, lang) + '</p>\n' : '')).join('');
  const [ico, ngTitle, ngSub, url] = m.ngoai;
  return '<div class="ml-' + lang + '">\n' +
    '<span class="eyebrow">' + N.eyebrow(m.chuong, m.so) + '</span>\n' +
    '<h2>' + T(m.ten, lang) + '</h2>\n' +
    '<p class="lead">' + T(m.moDau, lang) + '</p>\n' +
    '<div class="lz-flow">\n' +
    '<div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">' + truoc + '</span><span class="lz-d">' + (m.so === 1 ? T(m.sauChuong, lang) : T(MOC[m.so - 2].ten, lang)) + '</span></div>\n' +
    '<div class="lz-step"><span class="lz-k">' + m.so + '</span><span class="lz-t">' + N.you + '</span><span class="lz-d">' + T(m.sauChuong, lang) + '</span></div>\n' +
    '<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">' + sau + '</span><span class="lz-d">' + (m.so === 15 ? T('Rubric, committee questions, AI defence room|||Thang điểm, câu hỏi hội đồng, phòng bảo vệ AI', lang) : T(MOC[m.so].ten, lang)) + '</span></div>\n' +
    '</div>\n' +
    '<h3>' + N.req + '</h3>\n' + ul(m.yeuCau, lang) + '\n' +
    '<h3>' + N.stretch + '</h3>\n' + ul(m.nangCao, lang) + '\n' +
    '<h3>' + N.map + '</h3>\n' +
    '<table>\n<thead><tr><th>' + N.topic + '</th><th>' + N.build + '</th></tr></thead>\n<tbody>\n' +
    DE_TAI.map((d) => '<tr><td>' + T(d.ten, lang) + '</td><td>' + T(d.banDoChuong[m.so - 1].dung, lang) + '</td></tr>').join('\n') +
    '\n</tbody>\n</table>\n' +
    '<p>' + N.own + '</p>\n' +
    '<h3>' + N.starter + '</h3>\n<p>' + N.starterNote + '</p>\n' + demo +
    '<div class="pitfall co-tieu-de"><p><strong>' + esc(lang === 'en' ? bayTe : bayTv) + '</strong> ' + esc(lang === 'en' ? bayBe : bayBv) + '</p></div>\n' +
    '<h3>' + N.hints + '</h3>\n<p>' + N.hintsNote + '</p>\n' + hints + '\n' +
    '<div class="callout ok">\n<p><strong>' + N.done + '</strong></p>\n' + ul(m.datKhi, lang) + '\n</div>\n' +
    '<h3>' + N.submit + '</h3>\n<p>' + N.submitNote + '</p>\n<ul>' + m.nop.map((k) => '<li>' + N.nop[k] + '</li>').join('') + '</ul>\n<p>' + N.tick + '</p>\n' +
    '<h3>' + N.more + '</h3>\n' +
    m.bai.map(([slug, title]) => lienKet({ khoa: 'web-foundations', bai: slug, title: T(title, lang), sub: T(m.sauChuong, lang), cta: N.open })).join('\n') + '\n' +
    nguon(ico, T(ngTitle, lang), T(ngSub, lang), url) + '\n' +
    '</div>';
}

export function baiMoc(so) {
  const m = MOC.find((x) => x.so === so);
  if (!m) throw new Error('không có mốc ' + so);
  for (const d of m.demo) {
    if (d.code && CODE[d.code] == null) throw new Error('mốc ' + so + ': thiếu CODE[' + d.code + '] — chạy scripts/wf/sinh-ma.mjs');
    if (d.out && OUT[d.out] == null) throw new Error('mốc ' + so + ': thiếu OUT[' + d.out + ']');
  }
  const [tEn, tVi] = m.ten.split('|||');
  return {
    title: '🛠 ' + tEn + '|||🛠 ' + tVi,
    slug: m.slug,
    type: 'EXERCISE',
    mocDuAn: so,
    isFreePreview: false,
    description: 'Mốc dự án ' + so + '/15 — áp kiến thức Chương ' + m.chuong + ' vào đề tài đã đăng ký: yêu cầu, nâng cao, đạt khi, gợi ý theo tầng, ví dụ chạy thật, nộp bài.',
    content: '\n' + khoiMoc(m, 'en') + '\n' + khoiMoc(m, 'vi') + '\n',
  };
}

/* ─────────────────────────── bài bảo vệ ─────────────────────────── */

function khoiBaoVe(lang) {
  const en = lang === 'en';
  const tong = BAO_VE.rubric.reduce((s, r) => s + r.diem, 0);
  const so = (x) => (en ? String(x) : String(x).replace('.', ','));
  return '<div class="ml-' + lang + '">\n' +
    '<span class="eyebrow">' + (en ? 'Course project · Final step' : 'Dự án cuối khoá · Bước cuối') + '</span>\n' +
    '<h2>' + (en ? 'Finish and defend your project' : 'Hoàn thiện và bảo vệ dự án') + '</h2>\n' +
    '<p class="lead">' + (en
      ? 'Fifteen milestones turned your registered topic into a deployed web application. This last step is how a university assignment or a job interview ends: you hand in a product that runs, then you explain it — why each decision, where each rule lives, what you would change. The AI defence room below plays the committee; it reads what you submit and asks follow-up questions until it is sure you built and understand the project.'
      : 'Mười lăm mốc đã biến đề tài bạn đăng ký thành một ứng dụng web chạy trên mạng. Bước cuối này giống cách một assignment ở trường hay một buổi phỏng vấn kết thúc: bạn nộp một sản phẩm chạy được, rồi giải thích nó — vì sao chọn như vậy, luật nằm ở đâu, muốn đổi thì sửa chỗ nào. Phòng bảo vệ AI bên dưới đóng vai hội đồng; nó đọc thứ bạn nộp và hỏi vặn tới khi chắc rằng bạn đã tự làm và hiểu dự án.') + '</p>\n' +
    '<div class="lz-flow">\n' +
    (en
      ? '<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Finish</span><span class="lz-d">Close the open milestones, tag v1.0.0, CI green, live URL works.</span></div>\n<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Submit</span><span class="lz-d">Repository, live URL, README, demo accounts.</span></div>\n<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Present</span><span class="lz-d">5 minutes: one user story from sign-up to the main feature.</span></div>\n<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Questions</span><span class="lz-d">The committee asks about your code, data, security and choices.</span></div>\n<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Score</span><span class="lz-d">10-point rubric + written feedback; you may defend again after fixing.</span></div>\n'
      : '<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Hoàn thiện</span><span class="lz-d">Đóng các mốc còn mở, gắn tag v1.0.0, CI xanh, URL thật chạy.</span></div>\n<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nộp</span><span class="lz-d">Repo, URL thật, README, tài khoản demo.</span></div>\n<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Trình bày</span><span class="lz-d">5 phút: một câu chuyện người dùng từ đăng ký tới tính năng chính.</span></div>\n<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hỏi đáp</span><span class="lz-d">Hội đồng hỏi về mã, dữ liệu, bảo mật và các lựa chọn của bạn.</span></div>\n<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Chấm</span><span class="lz-d">Thang 10 điểm + nhận xét viết; sửa xong được bảo vệ lại.</span></div>\n') +
    '</div>\n' +
    '<h3>' + (en ? '✅ Checklist before you enter the room' : '✅ Danh sách kiểm trước khi vào phòng') + '</h3>\n' +
    '<ul>' + BAO_VE.chuanBi.map((x) => '<li>☐ ' + T(x, lang) + '</li>').join('') + '</ul>\n' +
    '<h3>' + (en ? '📊 Rubric (10 points)' : '📊 Thang điểm (10 điểm)') + '</h3>\n' +
    '<table>\n<thead><tr><th>' + (en ? 'Criterion' : 'Tiêu chí') + '</th><th>' + (en ? 'Points' : 'Điểm') + '</th><th>' + (en ? 'What earns the points' : 'Thế nào thì được điểm') + '</th></tr></thead>\n<tbody>\n' +
    BAO_VE.rubric.map((r) => '<tr><td>' + T(r.tieuChi, lang) + '</td><td>' + so(r.diem) + '</td><td>' + T(r.moTa, lang) + '</td></tr>').join('\n') +
    '\n<tr><td><strong>' + (en ? 'Total' : 'Tổng') + '</strong></td><td><strong>' + so(tong) + '</strong></td><td></td></tr>\n</tbody>\n</table>\n' +
    '<h3>' + (en ? '❓ Questions committees really ask' : '❓ Những câu hội đồng hay hỏi thật') + '</h3>\n' +
    '<p>' + (en ? 'Practise answering out loud, with the file open. A good answer has three parts: what the code does, why you chose it, and what you would change if the requirement changed.' : 'Tập trả lời thành tiếng, mở sẵn tệp liên quan. Một câu trả lời tốt có ba phần: mã làm gì, vì sao bạn chọn cách đó, và nếu yêu cầu đổi thì bạn sửa gì.') + '</p>\n' +
    '<ol>' + BAO_VE.cauHoiMau.map((q) => '<li>' + T(q, lang) + '</li>').join('') + '</ol>\n' +
    '<div class="pitfall co-tieu-de"><p><strong>' + (en ? 'Trap — defending code you cannot explain.' : 'Bẫy — bảo vệ đoạn mã mình không giải thích được.') + '</strong> ' +
    (en ? 'Using an AI assistant or a tutorial is allowed; not understanding the result is what fails a defence. Before you submit, read every file once and be ready to say why each part exists. “I copied it and it worked” scores zero on the presentation criterion and makes the committee doubt everything else.'
      : 'Dùng trợ lý AI hay hướng dẫn trên mạng là được phép; không hiểu kết quả mới là thứ làm trượt buổi bảo vệ. Trước khi nộp, đọc lại mọi tệp một lượt và sẵn sàng nói vì sao từng phần tồn tại. “Em chép và nó chạy” được 0 điểm ở tiêu chí trình bày và khiến hội đồng nghi ngờ mọi phần khác.') + '</p></div>\n' +
    '<div class="pitfall co-tieu-de"><p><strong>' + (en ? 'Trap — a demo that depends on luck.' : 'Bẫy — buổi demo trông vào may rủi.') + '</strong> ' +
    (en ? 'Free hosting sleeps; the first request can take 30 seconds. Open the live site a minute before, keep a short screen recording as backup, and never demo with your real password or real customer data.'
      : 'Hosting miễn phí hay “ngủ”; request đầu có thể mất 30 giây. Mở trang thật trước một phút, giữ sẵn một đoạn quay màn hình dự phòng, và không bao giờ demo bằng mật khẩu thật hay dữ liệu khách hàng thật.') + '</p></div>\n' +
    '<div class="callout ok">\n<p><strong>' + (en ? '🎯 Done when' : '🎯 Đạt khi') + '</strong></p>\n<ul>' +
    (en ? '<li>Every item of the checklist above is ticked.</li><li>You have submitted the repository, the live URL and the demo accounts in the box below.</li><li>You finished one session in the AI defence room and read its feedback.</li><li>You fixed what the feedback found (or wrote why not) and, if you want a better score, defended again.</li>'
      : '<li>Mọi mục trong danh sách kiểm ở trên đã đánh dấu.</li><li>Bạn đã nộp repo, URL thật và tài khoản demo ở khung bên dưới.</li><li>Bạn đã xong một phiên trong phòng bảo vệ AI và đọc nhận xét của nó.</li><li>Bạn đã sửa những gì nhận xét chỉ ra (hoặc ghi lý do không sửa) và, nếu muốn điểm cao hơn, bảo vệ lại.</li>') +
    '</ul>\n</div>\n' +
    '<h3>' + (en ? 'Where to go next' : 'Đi tiếp đâu') + '</h3>\n' +
    '<p>' + (en ? 'Your vanilla project is the best preparation for a framework: rebuild its frontend in React and you will recognise state, render and effects at once; move its API to Express or NestJS and the routes, status codes and middleware are already familiar.' : 'Dự án thuần của bạn là bước chuẩn bị tốt nhất cho framework: dựng lại frontend bằng React là nhận ra ngay state, render và effect; chuyển API sang Express hay NestJS thì tuyến, mã trạng thái và middleware đều đã quen.') + '</p>\n' +
    lienKet({ khoa: 'nodejs', bai: 'nodejs-0-1-gioi-thieu', title: en ? 'Node.js — the next course for your API' : 'Node.js — khoá tiếp theo cho API của bạn', sub: en ? 'Express, Prisma, auth and deployment in depth' : 'Express, Prisma, xác thực và triển khai chuyên sâu', cta: en ? 'Open course' : 'Mở khoá' }) + '\n' +
    nguon('🗺️', en ? 'roadmap.sh — Full Stack' : 'roadmap.sh — Full Stack', en ? 'What to learn after the foundation' : 'Học gì sau phần nền', 'https://roadmap.sh/full-stack') + '\n' +
    '</div>';
}

export function baiBaoVe() {
  return {
    title: '🎓 Finish and defend your course project|||🎓 Hoàn thiện và bảo vệ dự án cuối khoá',
    slug: 'wf-bao-ve-du-an',
    type: 'EXERCISE',
    baoVeDuAn: true,
    isFreePreview: false,
    description: 'Bước cuối của dự án xuyên suốt khoá: danh sách kiểm, thang điểm 10, 22 câu hội đồng hay hỏi, phòng bảo vệ AI.',
    content: '\n' + khoiBaoVe('en') + '\n' + khoiBaoVe('vi') + '\n',
  };
}

/* ─────────────────────── lời mời đăng ký (bài 0.1) ─────────────────────── */

export function moiDangKy(lang) {
  const en = lang === 'en';
  return '<h3>' + (en ? '🎯 What you will be able to build — your course project' : '🎯 Học xong làm được gì — dự án cuối khoá của bạn') + '</h3>\n' +
    (en ? GIOI_THIEU_EN : GIOI_THIEU_VI) + '\n' +
    '<p>' + (en ? 'Suggested topics (each comes with its features and a chapter-by-chapter plan in the registration box):' : 'Đề tài gợi ý (mỗi đề tài có danh sách tính năng và kế hoạch theo từng chương trong khung đăng ký):') + '</p>\n' +
    '<ul>' + DE_TAI.map((d) => '<li><strong>' + T(d.ten, lang) + '</strong> — ' + T(d.moTa, lang).split('. ')[0].replace(/\.$/, '') + '.</li>').join('') + '</ul>\n' +
    '<p>' + (en ? 'Or propose your own topic: describe it with a name, a short description and its features, and the AI reviewer checks that it covers the course (pages, an API, login, a database, tests, deployment) and is the right size.' : 'Hoặc đề xuất đề tài tự chọn: ghi tên, mô tả ngắn và các tính năng, AI sẽ xét xem nó đã phủ kiến thức khoá chưa (trang, API, đăng nhập, cơ sở dữ liệu, test, triển khai) và có vừa sức không.') + '</p>\n' +
    '<p><strong>' + (en ? 'Register the topic of your course project in the box below.' : 'Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới.') + '</strong></p>\n';
}
