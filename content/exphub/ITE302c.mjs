/**
 * Exp Hub guide for ITE302c — study & reference tools for IT/data ethics (Vietnamese).
 * Academy ITE302c links its "Cài đặt" card to /exp-hub/ite302c-cong-cu-hoc.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'ite302c-cong-cu-hoc',
    title: 'ITE302c — Công cụ học & tra cứu đạo đức CNTT',
    kind: 'NOTE',
    language: 'markdown',
    status: 'PUBLISHED',
    description: 'Bộ công cụ cho ITE302c: Zotero để trích dẫn nguồn, Notion/Obsidian để ghi chú case study, và các khung/quy tắc đạo đức chính thống (ACM, GDPR) để tra cứu khi phân tích tình huống.',
    referenceUrl: 'https://www.acm.org/code-of-ethics',
    codeBlocks: [
      {
        name: 'Khung phân tích tình huống đạo đức — case.md',
        language: 'markdown',
        code: `# Phan tich tinh huong dao duc — <Ten case>

## 1. Su that (Facts)
- Chuyen gi da xay ra? Ai lien quan? Du lieu nao bi anh huong?

## 2. Cac ben lien quan (Stakeholders)
- Nguoi dung, cong ty, xa hoi, co quan quan ly...

## 3. Van de dao duc (Issues)
- Quyen rieng tu? Thien vi thuat toan? An toan? Ban quyen?

## 4. Soi qua cac lang kinh
- Vi loi (Utilitarian): loi/hai tong the cho ai?
- Bon phan (Deontology): co vi pham quyen/quy tac nao?
- Dao duc nghe (ACM/IEEE): dieu khoan nao ap dung?

## 5. Phuong an & khuyen nghi
- Cac lua chon, danh gia, va lua chon co bao ve duoc`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn công cụ · ITE302c</span>
<h2>Học & tra cứu đạo đức CNTT/dữ liệu</h2>
<p class="lead">ITE302c là môn <strong>lý luận và tình huống</strong> — không cài phần mềm nặng. Thứ bạn cần là công cụ để <strong>ghi chú case study</strong>, <strong>trích dẫn nguồn</strong> cho bài luận (tránh đạo văn), và <strong>bộ quy tắc chính thống</strong> để soi mỗi tình huống.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Notion / Obsidian</div><div class="lz-d">ghi chú case</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Zotero</div><div class="lz-d">trích dẫn nguồn</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Khung đạo đức</div><div class="lz-d">ACM · IEEE · GDPR</div></div>
</div>

<h3>🅐 Ghi chú & xây tủ tình huống</h3>
<p>Mỗi bài học là một <strong>case study</strong>. Dùng Notion (online, dễ) hoặc Obsidian (offline, liên kết ghi chú) để lưu tình huống theo khung phân tích. Copy khung trong khối "Khung phân tích tình huống đạo đức" bên trên.</p>
<a class="link-card dl" href="https://www.notion.so/product" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Notion (miễn phí cho cá nhân)</span><span class="lc-sub">notion.so · web + app · có gói Education</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://obsidian.md/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Obsidian (miễn phí, offline)</span><span class="lc-sub">obsidian.md · Windows/macOS/Linux · liên kết ghi chú</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 Zotero — trích dẫn để tránh đạo văn</h3>
<p>Bài luận đạo đức phải dẫn nguồn (báo, luật, nghiên cứu). Zotero lưu nguồn bằng một cú nhấp và tự sinh danh mục tài liệu theo APA/IEEE — cực quan trọng vì môn này chấm cả tính liêm chính học thuật.</p>
<a class="link-card dl" href="https://www.zotero.org/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Zotero (miễn phí, chính chủ)</span><span class="lc-sub">zotero.org · + tiện ích Connector cho trình duyệt</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Bộ quy tắc & luật chính thống (tra cứu)</h3>
<p>Khi phân tích tình huống, luôn soi qua các văn bản gốc — đừng chỉ nói cảm tính. Đây là 3 nguồn nền tảng của môn:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>ACM Code of Ethics</b> — quy tắc đạo đức nghề của người làm máy tính.</div>
  <div class="lz-layer"><b>IEEE Code of Ethics</b> — chuẩn nghề kỹ sư, gần với ACM.</div>
  <div class="lz-layer"><b>GDPR</b> — luật bảo vệ dữ liệu cá nhân của EU, khung tham chiếu về quyền riêng tư.</div>
</div>
<a class="link-card dl" href="https://www.acm.org/code-of-ethics" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">ACM Code of Ethics (bản gốc)</span><span class="lc-sub">acm.org · quy tắc đạo đức nghề nghiệp CNTT</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://gdpr-info.eu/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">GDPR — toàn văn (tra theo Điều)</span><span class="lc-sub">gdpr-info.eu · luật bảo vệ dữ liệu cá nhân EU</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="note-ct">Mẹo làm bài: với mỗi tình huống, luôn viết đủ 5 bước trong khung — <b>Sự thật → Các bên → Vấn đề → Soi qua lăng kính → Khuyến nghị</b>. Dẫn được điều khoản ACM/GDPR cụ thể sẽ ghi điểm cao hơn nói chung chung.</div>
`,
  },
};
