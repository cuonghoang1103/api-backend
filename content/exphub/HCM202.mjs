/**
 * Exp Hub guide for HCM202 — sources & study tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy HCM202 bài 0.4 links its "Công cụ" card to /exp-hub/hcm202-cong-cu-hoc.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'hcm202-cong-cu-hoc',
    title: 'HCM202 — Nguồn tài liệu & công cụ học Tư tưởng Hồ Chí Minh',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Nguồn chính chủ (Hồ Chí Minh Toàn tập, Tư liệu Văn kiện Đảng, Báo điện tử ĐCSVN) và công cụ học tập (sơ đồ tư duy, quản lý trích dẫn Zotero) để làm tiểu luận và ôn thi HCM202. Kèm khung tiểu luận và mẫu ghi chú theo chương.',
    referenceUrl: 'https://tulieuvankien.dangcongsan.vn/',
    codeBlocks: [
      {
        name: 'Khung tiểu luận HCM202 (dán vào Word, điền theo đề của bạn)',
        language: 'text',
        code: `1. MO DAU
   - Ly do chon de tai + tinh thoi su
   - Luan de (quan diem ban se bao ve)

2. NOI DUNG
   2.1. Co so ly luan (quan diem cua Ho Chi Minh)
        -> TRICH DAN goc tu HCM Toan tap (ghi ro tap, trang)
   2.2. Phan tich "vi sao" + boi canh lich su
   2.3. Van dung vao mot van de HIEN NAY (co so lieu/su kien)

3. KET LUAN
   - Khang dinh lai luan de + y nghia

4. TAI LIEU THAM KHAO (trich dan dung chuan)

# CONG THUC AN DIEM: luan de + nguon goc + van dung duong dai`,
      },
      {
        name: 'Mẫu ghi chú 6 chương (một câu luận đề mỗi chương)',
        language: 'text',
        code: `Ch1: Tu tuong HCM = he thong quan diem, van dung SANG TAO Mac-Lenin
Ch2: 3 co so (truyen thong + van hoa NL + Mac-Lenin); Mac-Lenin QUYET DINH
Ch3: DOC LAP chi thuc su khi GAN LIEN CNXH  <-- soi chi trung tam
Ch4: Dang lanh dao la nhan to hang dau; Nha nuoc CUA-DO-VI dan
Ch5: Doan ket la suc manh; toan dan (nong cot cong-nong-tri) + quoc te
Ch6: Duc la GOC, van hoa SOI DUONG, xay dung con nguoi moi

# Hoc 6 cau nay + khung tra loi 4 buoc (Neu-Vi sao-Dan chung-Van dung)`,
      },
    ],
    noteContent: `
<span class="eyebrow">Tài liệu & công cụ · HCM202</span>
<h2>Nguồn & công cụ học Tư tưởng Hồ Chí Minh</h2>
<p class="lead">HCM202 <strong>không code</strong>. "Công cụ" của bạn là <em>nguồn tài liệu chính chủ</em> và cách ghi chú, lập luận. Bài tập chiếm 40% điểm — đặt nó trên nguồn gốc (Hồ Chí Minh Toàn tập, văn kiện Đảng) mới ăn điểm cao.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nguồn gốc</div><div class="lz-t">HCM Toàn tập</div><div class="lz-d">chính lời của Người</div></div>
  <div class="lz-step"><div class="lz-k">Chính thống</div><div class="lz-t">Văn kiện Đảng</div><div class="lz-d">tra cứu nghị quyết</div></div>
  <div class="lz-step"><div class="lz-k">Sắp xếp</div><div class="lz-t">Sơ đồ tư duy</div><div class="lz-d">nối sáu chương</div></div>
  <div class="lz-step"><div class="lz-k">Trích nguồn</div><div class="lz-t">Zotero</div><div class="lz-d">quản lý trích dẫn</div></div>
</div>

<h3>📖 1 — Hồ Chí Minh Toàn tập (nguồn gốc)</h3>
<p>Bộ sách tập hợp trước tác của Hồ Chí Minh — nguồn <strong>gốc</strong> để trích dẫn. Khi dẫn một câu nói, luôn đối chiếu ở đây và ghi rõ tập, trang. Bản điện tử có trên các cổng tư liệu chính thống.</p>
<a class="link-card dl" href="https://www.hochiminh.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Hochiminh.vn — Trang tin về Chủ tịch Hồ Chí Minh</span><span class="lc-sub">hochiminh.vn · trước tác, tư liệu, bài viết chính thống</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Đừng bao giờ trích một "câu nói của Bác" lấy từ mạng xã hội mà chưa kiểm. Nhiều câu bị gán sai. Luôn đối chiếu với Hồ Chí Minh Toàn tập trước khi đưa vào tiểu luận.</div>

<h3>🏛️ 2 — Tư liệu Văn kiện Đảng (chính thống)</h3>
<p>Tra cứu văn kiện, nghị quyết Đại hội Đảng để nối tư tưởng Hồ Chí Minh với đường lối hiện nay (phòng chống tham nhũng, đại đoàn kết, phát triển văn hóa) — phần "vận dụng" ăn điểm.</p>
<a class="link-card dl" href="https://tulieuvankien.dangcongsan.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">🏛️</span>
  <span class="lc-body"><span class="lc-title">Tư liệu Văn kiện Đảng</span><span class="lc-sub">tulieuvankien.dangcongsan.vn · văn kiện, nghị quyết</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://dangcongsan.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">📰</span>
  <span class="lc-body"><span class="lc-title">Báo điện tử Đảng Cộng sản Việt Nam</span><span class="lc-sub">dangcongsan.vn · thời sự, chuyên đề học tập & làm theo</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧩 3 — Sơ đồ tư duy (nối sáu chương)</h3>
<p>Vẽ một sơ đồ tư duy đặt "độc lập dân tộc gắn liền CNXH" ở trung tâm, sáu chương là các nhánh — giúp bạn thấy hệ thống thay vì học rời rạc. Dùng công cụ miễn phí như XMind hoặc vẽ tay.</p>
<a class="link-card dl" href="https://xmind.app/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">XMind</span><span class="lc-sub">xmind.app · sơ đồ tư duy miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📚 4 — Zotero (quản lý trích dẫn)</h3>
<p>Lưu và trích dẫn tài liệu đúng chuẩn cho phần Tài liệu tham khảo của tiểu luận. Xem tab "Khung tiểu luận" và "Mẫu ghi chú 6 chương" ở trên để bắt đầu.</p>
<a class="link-card dl" href="https://www.zotero.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Zotero</span><span class="lc-sub">zotero.org · quản lý & trích dẫn tài liệu, miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout ok"><strong>Dùng AI có trách nhiệm.</strong> Syllabus cho phép công cụ AI như một bổ trợ — dùng để tóm tắt, kiểm tra hiểu biết, gợi ý dàn ý. Nhưng <em>đừng để AI viết tiểu luận thay bạn hay bịa trích dẫn</em>. Mọi câu nói dẫn ra phải kiểm chứng trong nguồn gốc. Điểm cao đến từ lập luận của chính bạn + nguồn thật + vận dụng đương đại.</div>
`,
  },
};
