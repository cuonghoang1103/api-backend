/**
 * SWR302 · Luyện thi PE — hai đề SP26 (Paper 1 Car Rental = Phòng thi PE1, Paper 2 Restaurant Vincom = PE2), mỗi đề MỘT video
 * ghép / MỘT bài (luật chủ kênh 25/10/2026, ~/Documents/video-bai-giang/LUAT-VIDEO-CHUA-DE.md). Đề, lời giải mẫu song ngữ,
 * rubric lấy THẲNG từ content/exams/SWR302-PE{1,2}.mjs (một nguồn sự thật). Phần video: swr-pe{1,2}-{0..3} cùng slugWeb
 * `swr302-pe{1,2}-sp26-chua-tron-de`, ghép bằng xuat/ghep-phan.mts. Bài nằm trong mục PE của pe25.mjs (đề mới nhất trước).
 */
import PE1 from '../../exams/SWR302-PE1.mjs';
import PE2 from '../../exams/SWR302-PE2.mjs';

const tach = (s, en) => String(s).split('|||')[en ? 0 : 1] ?? String(s);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const giaiMa = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
/** Trang bài giảng chỉ vẽ `code.language-mermaid` (LearnPageClient), Phòng thi dùng `<pre class="mermaid">` ⇒ đổi khuôn. */
const mermaid = (html) => String(html).replace(/<pre class="mermaid">([\s\S]*?)<\/pre>/g, (_, m) => `<pre><code class="language-mermaid">${esc(giaiMa(m))}</code></pre>`);
/** Khối ml-en / ml-vi thứ n (0-based) của một đoạn HTML song ngữ (không có khối ⇒ trả nguyên). Câu 1 có 2 cặp: bối cảnh, rồi đề câu 1. */
const khoi = (html, en, n = 0) => {
  const re = new RegExp(`<div class="ml-${en ? 'en' : 'vi'}">([\\s\\S]*?)</div>(?=\\s*<div class="ml-|\\s*$)`, 'g');
  const ms = [...String(html).matchAll(re)];
  return ms[n] ? ms[n][1] : String(html);
};
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;

/**
 * Một đề = một bài. `moc` = [[giờ, tênEn, tênVi]] từ mo-ta-chuong.txt của bản -tron; `phutCau` = giờ bắt đầu câu 2/3/4
 * (câu 1 nằm chung phần đọc đề). `ghiChu` = { k: [[en, vi], …] } — chỗ video làm khác lời giải mẫu của Phòng thi.
 */
const bai = ({ goc, so, paper, tenEn, tenVi, slug, dai, moc, phutCau, ngoai, trong, bay, ghiChu }) => {
  const Q = goc.exams[0].questions;
  const anh = (k, en) => `<div class="anh-slide"><img src="${Q[k].imageUrl}" alt="SWR302 PE${so} (SP26 Paper ${paper}) — original paper, question ${k + 1}" loading="lazy" />` +
    `<p class="chu-thich">📄 <strong>PE${so} · SP26 Paper ${paper}</strong> — ${en ? `original paper, question ${k + 1}` : `ảnh đề gốc, câu ${k + 1}`}</p></div>`;
  const rubric = (k, en) => `<div class="table-wrap"><table><thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead><tbody>` +
    Q[k].rubric.map((r) => `<tr><td>${tach(r.criterion, en)}</td><td>${r.maxScore}</td></tr>`).join('') + '</tbody></table></div>';
  const cau = (k, en) => {
    const g = (ghiChu[k] || []).map((x) => x[en ? 0 : 1]);
    const tieu = en ? ['', 'Q1: the SRS cover page', 'Q2: the context diagram', 'Q3: the use case diagram & the two tables', 'Q4: the conceptual ERD & the entity table'][k]
      : ['', 'Câu 1: trang bìa SRS', 'Câu 2: sơ đồ ngữ cảnh', 'Câu 3: sơ đồ use case & hai bảng', 'Câu 4: ERD khái niệm & bảng thực thể'][k];
    const phut = phutCau[k];
    return `<h3>${tieu}${phut ? ` <small>🎬 ${phut}</small>` : ''}</h3>
${anh(k - 1, en)}
<h4>${en ? 'The question' : 'Đề bài'}</h4>${k === 1 ? khoi(Q[0].prompt, en, 1) : khoi(Q[k - 1].prompt, en)}
<h4>${en ? 'Model answer (Exam room)' : 'Lời giải mẫu (Phòng thi)'}</h4>${mermaid(khoi(Q[k - 1].sampleSolution, en))}
<h4>${en ? `Rubric (${Q[k - 1].points} points)` : `Thang chấm (${Q[k - 1].points} điểm)`}</h4>${rubric(k - 1, en)}
${g.length ? `<div class="callout warn"><strong>${en ? 'Where the video differs from the model answer — and why' : 'Chỗ video làm khác lời giải mẫu — và vì sao'}</strong>${ul(g)}</div>` : ''}`;
  };
  const phan = (en) => `
<h3>${en ? 'Reading the paper' : 'Đọc đề'} <small>🎬 0:00</small></h3>
<h4>${en ? 'The context' : 'Bối cảnh'}</h4>${khoi(Q[0].prompt, en)}
<h4>${en ? 'Outside vs inside the system' : 'Bên ngoài và bên trong hệ thống'}</h4>
<ul><li><b>${en ? `External actors (${ngoai.length})` : `Tác nhân bên ngoài (${ngoai.length})`}:</b> ${ngoai.map((x) => x[en ? 0 : 1]).join(' · ')}.</li>
<li><b>${en ? 'Inside the system — never actors' : 'Bên trong hệ thống — không bao giờ là tác nhân'}:</b> ${trong[en ? 0 : 1]}</li></ul>
<h4>${en ? 'The four questions & timing (90 min)' : 'Bốn câu & chia giờ (90 phút)'}</h4>
<div class="table-wrap"><table><thead><tr><th>#</th><th>${en ? 'Task' : 'Việc phải làm'}</th><th>${en ? 'Points' : 'Điểm'}</th><th>${en ? 'Suggested time' : 'Thời gian gợi ý'}</th></tr></thead><tbody>
<tr><td>—</td><td>${en ? 'Read the paper, underline actors and data' : 'Đọc đề, gạch chân tác nhân và dữ liệu'}</td><td>—</td><td>5′</td></tr>
<tr><td>${en ? 'Q1' : 'Câu 1'}</td><td>${en ? 'SRS cover page of the template' : 'Trang bìa SRS của template'}</td><td>${Q[0].points}</td><td>3′</td></tr>
<tr><td>${en ? 'Q2' : 'Câu 2'}</td><td>${en ? 'Context diagram — one central process, every external entity, labelled flows both ways' : 'Sơ đồ ngữ cảnh — một tiến trình ở giữa, đủ thực thể ngoài, luồng có nhãn hai chiều'}</td><td>${Q[1].points}</td><td>15′</td></tr>
<tr><td>${en ? 'Q3' : 'Câu 3'}</td><td>${en ? 'Use case diagram + Actor table + Use case table' : 'Sơ đồ use case + bảng Actor + bảng Use case'}</td><td>${Q[2].points}</td><td>30′</td></tr>
<tr><td>${en ? 'Q4' : 'Câu 4'}</td><td>${en ? 'Conceptual ERD + entity table' : 'ERD khái niệm + bảng thực thể'}</td><td>${Q[3].points}</td><td>27′</td></tr>
<tr><td>—</td><td>${en ? 'Check: names match across Q2–Q3–Q4, tables complete, template hints removed' : 'Soát: tên khớp giữa câu 2–3–4, bảng đủ dòng, đã xoá chữ hướng dẫn của template'}</td><td>—</td><td>10′</td></tr>
</tbody></table></div>
<h4>${en ? 'Traps' : 'Bẫy'}</h4>${ul(bay.map((x) => x[en ? 0 : 1]))}
${[1, 2, 3, 4].map((k) => cau(k, en)).join('\n')}`;
  const phong = (en) => en
    ? `<div class="callout">🧪 <strong>Practise it timed:</strong> <a href="/exam?course=SWR302">Exam room</a> → SWR302 → <strong>"Practical Exam Đề ${so} (SP26 Paper ${paper})"</strong>. Download the paper and the Word template, set a 90-minute timer, and only compare with this lesson afterwards.</div>`
    : `<div class="callout">🧪 <strong>Luyện có bấm giờ:</strong> <a href="/exam?course=SWR302">Phòng thi</a> → SWR302 → <strong>"Đề thi thực hành số ${so} (SP26 Paper ${paper})"</strong>. Tải đề + template Word, bấm giờ 90 phút, làm xong mới so với bài này.</div>`;
  const mocHtml = (en) => moc.length ? ul(moc.map(([t, e, v], i) => `<b>${t}</b> — ${en ? `Part ${i + 1}` : `Phần ${i + 1}`}: ${en ? e : v}`)) : '';
  return {
    title: `PE review · Paper ${so} (SP26, ${tenEn}) — full walkthrough in one video|||Chữa trọn đề PE${so} (SP26 · ${tenVi}) — một video`,
    slug,
    type: 'VIDEO',
    description: `Chữa trọn đề PE SWR302 số ${so} (SP26 Paper ${paper}, ${tenVi}) trong một video ${dai} có mốc: đọc đề trên ảnh gốc, trang bìa SRS, sơ đồ ngữ cảnh, use case + hai bảng, ERD khái niệm. Lời giải và rubric khớp Phòng thi.`,
    content: `
<div class="ml-en">
<span class="eyebrow">PE practice · real paper, added by this site</span>
<h2>PE Paper ${so} (SP26 Paper ${paper}) — ${tenEn}</h2>
<p class="lead">SWR302 practical paper from Spring 2026: 90 minutes, 10 points, four questions answered in the official Word template — SRS cover page (0.5), context diagram (2.5), use case diagram with Actor and Use case tables (4.0) and a <b>conceptual ERD</b> with an entity table (3.0). One video (${dai}) solves the whole paper: each question is read on the original image, then every answer is drawn and filled step by step.</p>
${moc.length ? `<h3>Chapters in the video</h3>${mocHtml(true)}` : ''}
${phan(true)}
${phong(true)}
</div>
<div class="ml-vi">
<span class="eyebrow">Luyện thi PE · đề thật, phần web tự thêm</span>
<h2>Đề PE ${so} (SP26 Paper ${paper}) — ${tenVi}</h2>
<p class="lead">Đề thực hành SWR302 kỳ Spring 2026: 90 phút, 10 điểm, bốn câu làm trong template Word của đề — trang bìa SRS (0.5), sơ đồ ngữ cảnh (2.5), sơ đồ use case kèm bảng Actor và bảng Use case (4.0) và <b>ERD mức khái niệm</b> kèm bảng thực thể (3.0). Một video (${dai}) chữa trọn đề: đọc từng câu trên ảnh gốc, rồi vẽ và điền từng câu theo từng bước.</p>
${moc.length ? `<h3>Các mốc trong video</h3>${mocHtml(false)}` : ''}
${phan(false)}
${phong(false)}
</div>`,
  };
};

const Q1_TEMPLATE = [
  'The Exam room’s model answer also grades purpose / scope / definitions in IEEE style; in the real exam the template’s cover page has only four fields — filling those four correctly is enough.',
  'Lời giải mẫu trên Phòng thi chấm thêm mục đích / phạm vi / định nghĩa theo chuẩn IEEE; bài thi thật thì trang bìa template chỉ có bốn chỗ — điền đúng bốn chỗ đó là đủ.',
];

/* Mốc + độ dài = mo-ta-chuong.txt của bản ghép 27-01-0-pe1-mo-dau-tron (19:38) / 27-02-0-pe2-mo-dau-tron (17:06). */
const MOC_PE1 = {
  dai: '19 phút 38 giây',
  moc: [
    ['0:00', 'Reading the Car Rental paper, rubric, timing & Q1', 'Đọc đề Car Rental, rubric, chia giờ & Câu 1'],
    ['5:56', 'Q2 — the context diagram', 'Câu 2 — sơ đồ ngữ cảnh'],
    ['9:48', 'Q3 — the use case diagram & the two tables', 'Câu 3 — sơ đồ use case & hai bảng'],
    ['14:03', 'Q4 — the conceptual ERD', 'Câu 4 — ERD khái niệm'],
  ],
  phutCau: { 2: '5:56', 3: '9:48', 4: '14:03' },
};
const MOC_PE2 = {
  dai: '17 phút 6 giây',
  moc: [
    ['0:00', 'Reading the Restaurant Vincom paper, rubric, timing & Q1', 'Đọc đề Restaurant Vincom, rubric, chia giờ & Câu 1'],
    ['5:47', 'Q2 — the context diagram', 'Câu 2 — sơ đồ ngữ cảnh'],
    ['8:57', 'Q3 — the use case diagram & the two tables', 'Câu 3 — sơ đồ use case & hai bảng'],
    ['12:33', 'Q4 — the conceptual ERD (splitting many-to-many)', 'Câu 4 — ERD khái niệm (tách nhiều–nhiều)'],
  ],
  phutCau: { 2: '5:47', 3: '8:57', 4: '12:33' },
};

export const lessonPE1 = bai({
  goc: PE1, so: 1, paper: 1, tenEn: 'Online Car Rental', tenVi: 'Thuê xe ô tô trực tuyến',
  slug: 'swr302-pe1-sp26-chua-tron-de', ...MOC_PE1,
  ngoai: [['Customer', 'Customer (khách thuê)'], ['Staff', 'Staff (nhân viên)'], ['Administrator', 'Administrator (quản trị viên)'],
    ['Payment Gateway (external system)', 'Payment Gateway (cổng thanh toán, hệ thống ngoài)'], ['Notification Service (external system)', 'Notification Service (dịch vụ thông báo, hệ thống ngoài)']],
  trong: ['the availability check, real-time booking status, fee calculation, reports — what the system <i>does</i>; the cars and the database are data, not actors.',
    'kiểm tra xe trống, cập nhật trạng thái đơn theo thời gian thực, tính phí, báo cáo — đó là việc hệ thống <i>làm</i>; xe và cơ sở dữ liệu là dữ liệu, không phải tác nhân.'],
  bay: [
    ['Drawing <i>Car</i> or <i>Database</i> as an external entity.', 'Vẽ <i>Car</i> hay <i>Database</i> thành thực thể ngoài.'],
    ['Reversing the notation: in a context diagram the system is the single circle in the middle and external entities are rectangles.', 'Vẽ ngược ký hiệu: ở sơ đồ ngữ cảnh hệ thống là MỘT hình tròn ở giữa, thực thể ngoài là hình chữ nhật.'],
    ['Linking Customer and Car directly in the ERD — each rental has its own dates and status, so it is the entity <i>Booking</i> in between.', 'Nối thẳng Customer với Car trong ERD — mỗi lần thuê có ngày và trạng thái riêng, nên nó là thực thể <i>Booking</i> đứng giữa.'],
    ['Making <i>additional fee</i> or <i>rental duration</i> an entity: they are attributes (of Inspection and of Booking).', 'Biến <i>additional fee</i> hay <i>rental duration</i> thành thực thể: chúng là thuộc tính (của Inspection và của Booking).'],
  ],
  ghiChu: {
    1: [Q1_TEMPLATE],
    2: [['The model answer draws the notation the other way round (entities as circles, the system as a rectangle). The video uses the course notation: one circle for the system, rectangles for external entities.',
      'Sơ đồ mẫu vẽ ngược ký hiệu (thực thể là hình tròn, hệ thống là hình chữ nhật). Video vẽ theo ký hiệu của môn: hệ thống là một hình tròn, thực thể ngoài là hình chữ nhật.']],
    3: [['The model answer uses «include» for the additional-fee calculation. It only happens when the returned car has damage or is late, so by theory it is an «extend».',
      'Lời giải mẫu dùng «include» cho tính phí phát sinh. Việc đó chỉ xảy ra khi xe trả về bị hỏng hoặc trễ hạn, nên theo lý thuyết phải là «extend».']],
    4: [['The model answer writes foreign keys inside a conceptual ERD. At the conceptual level the relationship line replaces the foreign key, so the video shows only identifiers and key attributes — no data types, no FKs.',
      'Lời giải mẫu ghi khoá ngoại trong ERD khái niệm. Ở mức khái niệm, đường quan hệ đã thay cho khoá ngoại, nên video chỉ ghi định danh và vài thuộc tính chính — không kiểu dữ liệu, không khoá ngoại.'],
    ['Customer–Car is many-to-many. Keeping it as M:N is not wrong at the conceptual level, but each rental has its own data, and the rubric grades the chain Customer–Booking–Car — so the video splits it with Booking.',
      'Customer–Car là nhiều–nhiều. Giữ M:N ở mức khái niệm không sai, nhưng mỗi lần thuê có dữ liệu riêng và rubric chấm chuỗi Customer–Booking–Car — nên video tách bằng Booking.']],
  },
});

export const lessonPE2 = bai({
  goc: PE2, so: 2, paper: 2, tenEn: 'Restaurant Management at Vincom', tenVi: 'Quản lý nhà hàng Vincom',
  slug: 'swr302-pe2-sp26-chua-tron-de', ...MOC_PE2,
  ngoai: [['Customer', 'Customer (khách)'], ['Service Staff', 'Service Staff (nhân viên phục vụ)'], ['Chef', 'Chef (đầu bếp)'],
    ['Administrator', 'Administrator (quản trị viên)'], ['Payment Gateway (external system)', 'Payment Gateway (cổng thanh toán, hệ thống ngoài)']],
  trong: ['order routing to the kitchen, order status, bill calculation, reports; the kitchen itself is a place, not an actor — the <i>Chef</i> is.',
    'chuyển đơn xuống bếp, trạng thái đơn, tính hoá đơn, báo cáo; bản thân "bếp" là nơi chốn, không phải tác nhân — <i>Chef</i> mới là tác nhân.'],
  bay: [
    ['Merging Chef into Service Staff: they do different things (prepare food vs take and serve orders), so they are two actors.', 'Gộp Chef vào Service Staff: hai vai làm việc khác nhau (nấu món vs nhận và phục vụ đơn), nên là hai tác nhân.'],
    ['Drawing «include» between a use case and the Payment Gateway — «include» links use case to use case only; an actor is linked with a plain association line.', 'Vẽ «include» từ use case tới Payment Gateway — «include» chỉ nối use case với use case; tác nhân nối bằng đường thẳng thường.'],
    ['Leaving Order–MenuItem as many-to-many: the rubric names the chain Order–OrderItem–MenuItem, so the split is required for full marks here.', 'Để Order–MenuItem nhiều–nhiều: rubric gọi tên chuỗi Order–OrderItem–MenuItem, nên ở đề này phải tách mới đủ điểm.'],
    ['Forcing an «extend» that makes no sense just to show the symbol.', 'Ép một «extend» vô lý chỉ để có đủ ký hiệu.'],
  ],
  ghiChu: {
    1: [['The Exam room’s model answer also grades functional and non-functional requirements; in the real exam the template’s cover page has only four fields — fill those four correctly.',
      'Lời giải mẫu trên Phòng thi chấm thêm yêu cầu chức năng và phi chức năng; bài thi thật thì trang bìa template chỉ có bốn chỗ — điền đúng bốn chỗ đó.']],
    3: [['The model answer writes "Make Payment «include» Payment Gateway". That is wrong notation — «include» only connects two use cases. The video links the Payment Gateway to Make Payment with a plain association.',
      'Lời giải mẫu ghi "Make Payment «include» Payment Gateway". Sai ký pháp — «include» chỉ nối hai use case. Video nối Payment Gateway với Make Payment bằng đường liên kết thường.']],
    4: [['The model answer gives Order–Payment as exactly one. An order is created first and paid later, so at the start it has no payment yet: the video draws Order 1 — 0..1 Payment.',
      'Lời giải mẫu vẽ Order–Payment đúng một. Đơn được tạo trước, trả tiền sau, nên lúc đầu chưa có thanh toán: video vẽ Order 1 — 0..1 Payment.']],
  },
});
