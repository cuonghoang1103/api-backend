/**
 * Exp Hub guide for EXE101 — startup toolkit (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content` → callouts, step maps, clickable download cards.
 * Academy EXE101 bài 0.4 links its "Công cụ" card to /exp-hub/exe101-cong-cu-khoi-nghiep.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'exe101-cong-cu-khoi-nghiep',
    title: 'EXE101 — Bộ công cụ khởi nghiệp: YC Library, Google Forms, Canva, Notion',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Bộ công cụ miễn phí để làm đồ án khởi nghiệp EXE101: kho Y Combinator, Google Forms khảo sát không thiên lệch, Canva/Google Slides dựng pitch deck, Notion/Trello quản lý đội. Kèm mẫu câu khảo sát và cấu trúc pitch deck.',
    referenceUrl: 'https://www.ycombinator.com/library',
    codeBlocks: [
      {
        name: 'Mẫu khảo sát KHÔNG thiên lệch (dán vào Google Forms)',
        language: 'text',
        code: `# HOI HANH VI QUA KHU, KHONG HOI Y DINH TUONG LAI (Mom Test)

1) Ky truoc, ban lay [san pham/dich vu lien quan] bang cach nao?
   [ ] Cach A   [ ] Cach B   [ ] Cach C   [ ] Khac: ____

2) Viec do mat bao nhieu thoi gian?
   ( ) 0-1 gio   ( ) 2-4 gio   ( ) 5+ gio

3) Ban da chi bao nhieu tien de xu ly viec nay?
   ( ) 0d   ( ) duoi 100k   ( ) 100k-500k   ( ) tren 500k

4) Ban co tung gap su co (bi lua / sai / that bai) khong?
   ( ) Co   ( ) Khong    -> Neu co, ke ngan: ____

# TRANH: "Ban co thich mot app ... khong?" (ai cung tra loi Co -> vo dung)`,
      },
      {
        name: 'Khung 10 slide pitch deck (tạo trong Canva/Slides)',
        language: 'text',
        code: `1. Title + 1 cau tom tat (ban lam gi)
2. Problem  (noi dau that + trich loi khach hang)
3. Solution (giai phap + vi sao 10x tot hon)
4. Product / Demo (MVP chay that)
5. Market size (TAM / SAM / SOM co so lieu)
6. Traction (bang chung: phong van, dang ky, retention)  <-- slide an diem
7. Business model (kiem tien the nao)
8. Competition (ma tran + mui nem cua ban)
9. Team (vi sao la ban)
10. Ask / next steps (can gi + di ve dau)`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ khởi nghiệp · EXE101</span>
<h2>Bộ công cụ cho đồ án khởi nghiệp EXE101</h2>
<p class="lead">EXE101 <strong>không cần code</strong>. Bạn cần công cụ để <em>học từ founder giỏi, nói chuyện với khách hàng, đo lường, và kể chuyện</em> ở Demo Day. Tất cả dưới đây đều miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Học</div><div class="lz-t">YC Library</div><div class="lz-d">bài giảng founder theo chủ đề</div></div>
  <div class="lz-step"><div class="lz-k">Khảo sát</div><div class="lz-t">Google Forms</div><div class="lz-d">thu &amp; phân tích phản hồi</div></div>
  <div class="lz-step"><div class="lz-k">Pitch</div><div class="lz-t">Canva / Slides</div><div class="lz-d">dựng deck 10 slide</div></div>
  <div class="lz-step"><div class="lz-k">Quản lý</div><div class="lz-t">Notion / Trello</div><div class="lz-d">việc đội + nhật ký quyết định</div></div>
</div>

<h3>🚀 1 — Y Combinator Library &amp; Startup School (nguồn chính)</h3>
<p>Kho tài liệu của vườn ươm startup danh tiếng nhất thế giới: hàng trăm bài giảng, video của founder theo đúng các chủ đề trong môn (ý tưởng, đội, khách hàng, MVP, gọi vốn, pitch). Đây là nguồn học chính của EXE101.</p>
<a class="link-card dl" href="https://www.ycombinator.com/library" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Y Combinator Startup Library</span><span class="lc-sub">ycombinator.com/library · miễn phí, không cần tài khoản</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://www.startupschool.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Startup School (YC)</span><span class="lc-sub">startupschool.org · khoá học khởi nghiệp miễn phí có lộ trình</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>📋 2 — Google Forms + Google Sheets (khảo sát &amp; phân tích)</h3>
<p>Dùng để chạy khảo sát định lượng (checkpoint 2) và phân tích phản hồi bằng biểu đồ tự sinh. Xem tab "Mẫu khảo sát KHÔNG thiên lệch" ở trên — dán thẳng vào Forms và sửa cho ý tưởng của bạn.</p>
<a class="link-card dl" href="https://forms.google.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Google Forms</span><span class="lc-sub">forms.google.com · miễn phí với tài khoản Google/FPT</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Câu hỏi mớm ("Bạn có thích một app rẻ hơn không?") chỉ thu về lời khen vô dụng. Luôn hỏi <strong>hành vi quá khứ</strong> (bao nhiêu lần, tốn bao lâu, chi bao nhiêu) — đó mới là dữ liệu ăn điểm checkpoint 2.</div>

<h3>🎨 3 — Canva / Google Slides (pitch deck)</h3>
<p>Dựng pitch deck 10 slide cho Demo Day (40% điểm). Canva có sẵn hàng trăm template "pitch deck" đẹp; Google Slides thì tiện làm chung cả đội. Xem tab "Khung 10 slide" ở trên.</p>
<a class="link-card dl" href="https://www.canva.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">Canva</span><span class="lc-sub">canva.com · template pitch deck miễn phí, gõ "pitch deck"</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://slides.google.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Google Slides</span><span class="lc-sub">slides.google.com · làm chung cả đội theo thời gian thực</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🗂️ 4 — Notion / Trello (quản lý đội &amp; nhật ký quyết định)</h3>
<p>Giữ một "nguồn sự thật" duy nhất: phát biểu vấn đề, khách hàng mục tiêu, 3 giả định lớn nhất, thí nghiệm tuần này, và <strong>nhật ký quyết định</strong> (ngày · quyết định · vì sao). Nó ngăn thất bại số 1 của đội — năm người tin năm phiên bản khác nhau của ý tưởng — và khiến câu chuyện "bọn em xoay hướng ở đây vì…" ở Demo Day trở nên dễ dàng.</p>
<a class="link-card dl" href="https://www.notion.so/product" target="_blank" rel="noopener">
  <span class="lc-ico">🗒️</span>
  <span class="lc-body"><span class="lc-title">Notion</span><span class="lc-sub">notion.so · miễn phí cho cá nhân/đội nhỏ, có bản sinh viên</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://trello.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📌</span>
  <span class="lc-body"><span class="lc-title">Trello</span><span class="lc-sub">trello.com · bảng Kanban đơn giản chia việc theo người</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🖌️ 5 — Figma (tuỳ chọn: phác MVP không cần code)</h3>
<p>Nếu muốn cho khách xem "sản phẩm" mà chưa xây, dùng Figma để phác vài màn hình bấm được. Đây là một dạng MVP (prototype) rẻ và nhanh.</p>
<a class="link-card dl" href="https://www.figma.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Figma</span><span class="lc-sub">figma.com · miễn phí, có gói Education cho sinh viên</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="callout ok"><strong>Nhớ:</strong> công cụ chỉ là công cụ. Điểm cao đến từ <em>bằng chứng khách hàng thật</em> + <em>một con số biết di chuyển</em> + <em>một đội bảo vệ được</em>. Dùng Forms để lấy bằng chứng, Canva để trưng nó ra, Notion để không ai lạc hướng.</div>
`,
  },
};
