/**
 * Exp Hub guide for MLN131 — sources & study tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy MLN131 bài 0.4 links its "Công cụ" card to /exp-hub/mln131-cong-cu-hoc.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'mln131-cong-cu-hoc',
    title: 'MLN131 — Nguồn tài liệu & công cụ học Chủ nghĩa xã hội khoa học',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Nguồn chính chủ (C. Mác - Ph. Ăngghen Toàn tập, V.I. Lênin Toàn tập, Tư liệu Văn kiện Đảng) và công cụ học tập (sơ đồ tư duy, Zotero) để làm tiểu luận và ôn thi MLN131. Kèm khung tiểu luận và mẫu ghi chú 7 chương.',
    referenceUrl: 'https://tulieuvankien.dangcongsan.vn/',
    codeBlocks: [
      {
        name: 'Khung tiểu luận MLN131 (dán vào Word)',
        language: 'text',
        code: `1. MO DAU
   - Ly do chon de tai + tinh thoi su
   - Luan de (quan diem ban se bao ve)

2. NOI DUNG
   2.1. Co so ly luan (quan diem Mac-Lenin ve van de)
        -> TRICH DAN goc tu Mac-Angghen / Lenin Toan tap
   2.2. Phan tich "vi sao" + boi canh
   2.3. Van dung vao thuc tien VIET NAM hien nay (doi moi, chinh sach)

3. KET LUAN
   - Khang dinh lai luan de + y nghia

4. TAI LIEU THAM KHAO

# CONG THUC AN DIEM: luan de + nguon goc + van dung duong dai`,
      },
      {
        name: 'Mẫu ghi chú 7 chương (một câu luận đề mỗi chương)',
        language: 'text',
        code: `Ch1: CNXH KHOA HOC = khong tuong + 2 phat kien (DVLS + gia tri thang du)
Ch2: SU MENH giai cap cong nhan = tu DIA VI trong san xuat (KQ+CQ) <-- soi chi
Ch3: CNXH = giai doan THAP cua CNCS; qua do LAU DAI (VN bo qua TBCN)
Ch4: Dan chu XHCN = cho DA SO; nha nuoc la CONG CU thuc hien
Ch5: Lien minh CONG-NONG-TRI = nen tang chinh quyen + dai doan ket
Ch6: Cuong linh dan toc Lenin (binh dang-tu quyet-doan ket); ton trong tu do tin nguong
Ch7: Gia dinh = TE BAO xa hoi; xay gia dinh moi (binh dang gioi)

# Hoc 7 cau nay + khung tra loi 4 buoc (Neu-Vi sao-Dan chung-Van dung)`,
      },
    ],
    noteContent: `
<span class="eyebrow">Tài liệu & công cụ · MLN131</span>
<h2>Nguồn & công cụ học Chủ nghĩa xã hội khoa học</h2>
<p class="lead">MLN131 <strong>không code</strong>. "Công cụ" của bạn là <em>nguồn tài liệu chính chủ</em> và cách ghi chú, lập luận. Bài tập chiếm 40% điểm — đặt nó trên văn bản gốc (Mác-Ăngghen, Lênin) mới ăn điểm cao.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nguồn gốc</div><div class="lz-t">Mác-Ăngghen / Lênin</div><div class="lz-d">văn bản gốc</div></div>
  <div class="lz-step"><div class="lz-k">Chính thống</div><div class="lz-t">Văn kiện Đảng</div><div class="lz-d">tra cứu nghị quyết</div></div>
  <div class="lz-step"><div class="lz-k">Sắp xếp</div><div class="lz-t">Sơ đồ tư duy</div><div class="lz-d">nối bảy chương</div></div>
  <div class="lz-step"><div class="lz-k">Trích nguồn</div><div class="lz-t">Zotero</div><div class="lz-d">quản lý trích dẫn</div></div>
</div>

<h3>📕 1 — C. Mác - Ph. Ăngghen & V.I. Lênin Toàn tập (nguồn gốc)</h3>
<p>Các bộ trước tác kinh điển — nguồn <strong>gốc</strong> để trích dẫn khi bàn về sứ mệnh giai cấp công nhân, CNXH, dân chủ, liên minh giai cấp, dân tộc. Bản điện tử có trên các cổng tư liệu chính thống của Đảng.</p>
<a class="link-card dl" href="https://tulieuvankien.dangcongsan.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">🏛️</span>
  <span class="lc-body"><span class="lc-title">Tư liệu Văn kiện Đảng (kho kinh điển & văn kiện)</span><span class="lc-sub">tulieuvankien.dangcongsan.vn · Mác-Lênin, Hồ Chí Minh, văn kiện</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Đừng trích một "câu của Mác/Lênin" lấy từ mạng xã hội mà chưa kiểm. Nhiều câu bị gán sai. Luôn đối chiếu với Toàn tập (ghi rõ tập, trang) trước khi đưa vào tiểu luận.</div>

<h3>📰 2 — Báo điện tử ĐCSVN (nối với đường lối hôm nay)</h3>
<p>Nối lý luận với thực tiễn Việt Nam (đổi mới, kinh tế thị trường định hướng XHCN, chính sách dân tộc – tôn giáo, xây dựng gia đình văn hóa) để phần "vận dụng" ăn điểm.</p>
<a class="link-card dl" href="https://dangcongsan.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">📰</span>
  <span class="lc-body"><span class="lc-title">Báo điện tử Đảng Cộng sản Việt Nam</span><span class="lc-sub">dangcongsan.vn · thời sự, chuyên đề lý luận</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧩 3 — Sơ đồ tư duy (nối bảy chương)</h3>
<p>Vẽ sơ đồ đặt "sứ mệnh lịch sử của giai cấp công nhân" ở trung tâm, bảy chương là các nhánh — giúp thấy hệ thống thay vì học rời rạc. Dùng XMind hoặc vẽ tay.</p>
<a class="link-card dl" href="https://xmind.app/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">XMind</span><span class="lc-sub">xmind.app · sơ đồ tư duy miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📚 4 — Zotero (quản lý trích dẫn)</h3>
<p>Lưu và trích dẫn tài liệu đúng chuẩn cho phần Tài liệu tham khảo. Xem tab "Khung tiểu luận" và "Mẫu ghi chú 7 chương" ở trên để bắt đầu.</p>
<a class="link-card dl" href="https://www.zotero.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Zotero</span><span class="lc-sub">zotero.org · quản lý & trích dẫn tài liệu, miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout ok"><strong>Dùng AI có trách nhiệm.</strong> Syllabus cho phép công cụ AI như một bổ trợ — dùng để tóm tắt, kiểm tra hiểu biết, gợi ý dàn ý. Nhưng <em>đừng để AI viết tiểu luận thay bạn hay bịa trích dẫn</em>. Mọi câu dẫn ra phải kiểm chứng trong nguồn gốc. Điểm cao đến từ lập luận của chính bạn + nguồn thật + vận dụng đương đại.</div>
`,
  },
};
