/**
 * Exp Hub guide for WDU203c — UI/UX design toolkit (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content` → callouts, step maps, clickable download cards.
 * Academy WDU203c bài 0.4 links its "Công cụ" card to /exp-hub/wdu203c-cong-cu-thiet-ke.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'wdu203c-cong-cu-thiet-ke',
    title: 'WDU203c — Bộ công cụ UI/UX: Figma, Miro, Maze, Google Forms, Coursera',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Bộ công cụ miễn phí để học và làm đồ án UX WDU203c: Coursera (6 MOOC Michigan), Figma (wireframe→prototype), Miro/FigJam (affinity wall & journey map), Google Forms (khảo sát), Maze (usability test không điều phối). Kèm mẫu kịch bản phỏng vấn và checklist buổi test.',
    referenceUrl: 'https://www.figma.com/education/',
    codeBlocks: [
      {
        name: 'Kịch bản phỏng vấn người dùng (dán vào tài liệu, sửa cho đề của bạn)',
        language: 'text',
        code: `# MO DAU (tao thien cam + xin dong y ghi am)
- Cam on ban da danh thoi gian. Khong co dung/sai, minh chi muon hieu.
- Minh ghi am de khong bo sot y nhe? (cho ho dong y)

# LAM NONG
- Ke minh nghe mot ngay hoc/lam viec binh thuong cua ban?

# CAU COT LOI (hoi HANH VI QUA KHU, khong hoi Y DINH tuong lai)
- Ke minh nghe LAN GAN NHAT ban [lam nhiem vu]. Ban lam gi dau tien?
- Luc do co cho nao ban thay kho / bi ket khong? Ke cu the.
- Ban da xu ly bang cach nao? (app khac? hoi nguoi? bo cuoc?)
- Neu co mot dieu uoc doi duoc, ban muon doi gi?

# KET
- Con gi minh chua hoi ma ban muon noi them khong?
- Cam on ban!

# TRANH: cau mom ("app nhanh hon thi tot nhi?"), cau gia dinh ("ban co dung...?")`,
      },
      {
        name: 'Checklist điều phối 1 buổi usability test (5 người)',
        language: 'text',
        code: `TRUOC BUOI TEST
[ ] Viet 1-3 NHIEM VU thuc te (vd: "dat phong hoc cho 15h mai")
[ ] Chuan bi prototype bam duoc (Figma Present mode) + link
[ ] Xin phep ghi man hinh + giong noi

TRONG BUOI TEST
[ ] Doc nhiem vu, KHONG dan tour, KHONG chi cho ho lam
[ ] "Ban noi ra dang nghi gi giup minh nhe" (think-aloud)
[ ] IM LANG khi ho ket — su vat lon chinh la phat hien
[ ] Ghi: lam duoc/khong, thoi gian, so lan sai, cau noi dat gia

SAU BUOI TEST (5 nguoi)
[ ] Gom cac quan sat -> nhom thanh FINDING
[ ] Cham muc 0-4 (tan suat x tac dong x dai dang)
[ ] Sua 2-3 finding muc 4 truoc -> test lai 5 nguoi khac`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ thiết kế · WDU203c</span>
<h2>Bộ công cụ cho môn UI/UX Design</h2>
<p class="lead">WDU203c <strong>không cần code</strong>. Bạn cần công cụ để <em>học từ chuyên gia, nói chuyện với người dùng, thiết kế, prototype và kiểm thử</em>. Tất cả dưới đây đều miễn phí hoặc có gói sinh viên.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Học</div><div class="lz-t">Coursera</div><div class="lz-d">6 MOOC Michigan UX</div></div>
  <div class="lz-step"><div class="lz-k">Thiết kế</div><div class="lz-t">Figma</div><div class="lz-d">wireframe → prototype</div></div>
  <div class="lz-step"><div class="lz-k">Tổng hợp</div><div class="lz-t">Miro / FigJam</div><div class="lz-d">affinity wall, journey map</div></div>
  <div class="lz-step"><div class="lz-k">Kiểm thử</div><div class="lz-t">Maze / Forms</div><div class="lz-d">test & khảo sát</div></div>
</div>

<h3>🎓 1 — Coursera: 6 MOOC Michigan UX (nguồn chính + cổng dự thi)</h3>
<p>Toàn bộ nội dung môn nằm trong bộ chuyên đề <strong>"User Experience Research and Design"</strong> của Đại học Michigan. Bạn <strong>bắt buộc</strong> hoàn thành cả 6 khoá + lấy chứng chỉ Specialization mới được dự thi TE. Đăng ký qua email FPT để học miễn phí.</p>
<a class="link-card dl" href="https://www.coursera.org/specializations/michiganux" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Michigan UX Research &amp; Design Specialization</span><span class="lc-sub">coursera.org · 6 khoá · đăng ký qua FPT</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Cổng dự thi là rủi ro lớn nhất của môn. Học <strong>~1 khoá/tuần từ tuần 1</strong> và nộp bài chấm chéo sớm — xong cả 6 khoá trước hạn còn được <strong>+1 điểm thưởng</strong> (kéo ngưỡng thi từ 5.0 xuống 4.0).</div>

<h3>🎨 2 — Figma (wireframe → prototype bấm được)</h3>
<p>Công cụ thiết kế UX/UI chuẩn ngành. Dùng để vẽ wireframe, dựng UI hi-fi, và nối các màn thành prototype bấm được (Present mode) để test — <strong>không viết dòng code nào</strong>. Có gói Education miễn phí cho sinh viên.</p>
<a class="link-card dl" href="https://www.figma.com/education/" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">Figma (Education plan)</span><span class="lc-sub">figma.com/education · miễn phí với email sinh viên</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧩 3 — Miro / FigJam (affinity wall & journey map)</h3>
<p>Bảng trắng vô hạn để dán sticky note từ phỏng vấn, gom cụm thành affinity wall, và vẽ journey map. FigJam đi kèm Figma; Miro có bản miễn phí. Đây là nơi bạn biến trích dẫn thô thành hiểu biết.</p>
<a class="link-card dl" href="https://www.figma.com/figjam/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">FigJam</span><span class="lc-sub">figma.com/figjam · bảng trắng, đi kèm tài khoản Figma</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://miro.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">Miro</span><span class="lc-sub">miro.com · bản miễn phí 3 bảng, template affinity/journey</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>📝 4 — Google Forms (khảo sát định lượng)</h3>
<p>Dùng cho nghiên cứu ở quy mô: thu phản hồi số đông với biểu đồ tự sinh. Xem tab "Kịch bản phỏng vấn" ở trên cho câu hỏi định tính, và nhớ tránh 3 lỗi khảo sát (coverage / nonresponse / measurement).</p>
<a class="link-card dl" href="https://forms.google.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Google Forms</span><span class="lc-sub">forms.google.com · miễn phí với tài khoản Google/FPT</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 5 — Maze (usability test không điều phối)</h3>
<p>Gắn prototype Figma vào Maze, giao nhiệm vụ, và Maze tự ghi lại đường đi, số lần chạm, thời gian và điểm rơi của nhiều người test từ xa — lý tưởng để lấy dữ liệu định lượng cho báo cáo capstone. Xem tab "Checklist điều phối" cho buổi test có điều phối.</p>
<a class="link-card dl" href="https://maze.co/" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Maze</span><span class="lc-sub">maze.co · bản miễn phí, gắn thẳng prototype Figma</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>♿ 6 — Công cụ kiểm tra accessibility (nâng cao ★)</h3>
<p>Để đạt WCAG AA (tương phản chữ ≥ 4.5:1), kiểm màu bằng công cụ tương phản trước khi chốt thiết kế. Đây là điểm cộng lớn cho capstone và portfolio.</p>
<a class="link-card dl" href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener">
  <span class="lc-ico">♿</span>
  <span class="lc-body"><span class="lc-title">WebAIM Contrast Checker</span><span class="lc-sub">webaim.org · kiểm tỷ lệ tương phản WCAG AA/AAA</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="callout ok"><strong>Nhớ:</strong> công cụ chỉ là công cụ. Điểm cao đến từ <em>bằng chứng người dùng thật</em> (phỏng vấn + test) + <em>một thiết kế truy được về nhu cầu</em> + <em>một báo cáo kể được bước xoay hướng có bằng chứng</em>. Figma để dựng, Miro để hiểu, Maze/Forms để chứng minh.</div>
`,
  },
};
