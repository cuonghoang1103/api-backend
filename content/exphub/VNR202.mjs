/**
 * Exp Hub guide for VNR202 — sources & study tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy VNR202 bài 0.4 links its "Công cụ" card to /exp-hub/vnr202-cong-cu-hoc.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'vnr202-cong-cu-hoc',
    title: 'VNR202 — Nguồn tài liệu & công cụ học Lịch sử Đảng CSVN',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Nguồn chính chủ (Văn kiện Đảng toàn tập, Hồ Chí Minh Toàn tập, Báo điện tử ĐCSVN) và công cụ học tập (dòng thời gian, sơ đồ tư duy, Zotero) để làm tiểu luận và ôn thi VNR202. Kèm mẫu dòng thời gian và khung tiểu luận.',
    referenceUrl: 'https://tulieuvankien.dangcongsan.vn/',
    codeBlocks: [
      {
        name: 'Dòng thời gian cốt yếu (in ra dán bàn học)',
        language: 'text',
        code: `1930  Dang ra doi + Cuong linh dau tien  -> giai quyet khung hoang lanh dao
1945  Cach mang Thang Tam + Doc lap 2/9   -> gianh chinh quyen, khai sinh VNDCCH
1946  Toan quoc khang chien                -> duong loi toan dan, truong ky
1954  Dien Bien Phu + Geneve               -> cham dut ach Phap, giai phong mien Bac
1954-75 Dong thoi 2 chien luoc (Bac-Nam)   -> hau phuong + tien tuyen
1975  Tong tien cong mua Xuan + 30/4       -> thong nhat dat nuoc
1986  Dai hoi VI + Doi moi                 -> doi moi thoat khung hoang

# Voi moi su kien: BOI CANH -> DUONG LOI -> KET QUA -> BAI HOC`,
      },
      {
        name: 'Khung tiểu luận VNR202 (dán vào Word)',
        language: 'text',
        code: `1. MO DAU
   - Ly do chon giai doan/van de + luan de (khang dinh se bao ve)
2. NOI DUNG (dung khung 4 phan)
   2.1. Boi canh lich su
   2.2. Duong loi/quyet dinh cua Dang (TRICH van kien Dang)
   2.3. Ket qua + y nghia
   2.4. Bai hoc + van dung HOM NAY
3. KET LUAN
4. TAI LIEU THAM KHAO

# CONG THUC AN DIEM: luan de + su kien/van kien + bai hoc van dung`,
      },
    ],
    noteContent: `
<span class="eyebrow">Tài liệu & công cụ · VNR202</span>
<h2>Nguồn & công cụ học Lịch sử Đảng CSVN</h2>
<p class="lead">VNR202 <strong>không code</strong>. "Công cụ" của bạn là <em>nguồn tài liệu chính chủ</em> và cách sắp xếp ngày tháng. Một <strong>dòng thời gian</strong> là công cụ hữu ích nhất — biến một mớ sự kiện thành chuỗi nguyên nhân – kết quả rõ ràng.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nguồn gốc</div><div class="lz-t">Văn kiện Đảng</div><div class="lz-d">Văn kiện Đảng toàn tập</div></div>
  <div class="lz-step"><div class="lz-k">Chính thống</div><div class="lz-t">Cổng lịch sử</div><div class="lz-d">tra cứu sự kiện, nghị quyết</div></div>
  <div class="lz-step"><div class="lz-k">Sắp xếp</div><div class="lz-t">Dòng thời gian</div><div class="lz-d">xếp trình tự ba thời kỳ</div></div>
  <div class="lz-step"><div class="lz-k">Trích nguồn</div><div class="lz-t">Zotero</div><div class="lz-d">quản lý tài liệu</div></div>
</div>

<h3>🏛️ 1 — Văn kiện Đảng toàn tập (nguồn gốc)</h3>
<p>Kho văn kiện, nghị quyết các kỳ Đại hội — nguồn <strong>gốc</strong> có thẩm quyền để trích khi phân tích đường lối của Đảng qua các thời kỳ. Đây là nguồn phân biệt một tiểu luận học thuật với một bài chép.</p>
<a class="link-card dl" href="https://tulieuvankien.dangcongsan.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">🏛️</span>
  <span class="lc-body"><span class="lc-title">Tư liệu Văn kiện Đảng</span><span class="lc-sub">tulieuvankien.dangcongsan.vn · văn kiện, nghị quyết, kinh điển</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Đừng lấy "sự kiện/ngày tháng" từ nguồn không rõ trên mạng. Đối chiếu mọi mốc thời gian với văn kiện Đảng hoặc giáo trình chính thống — sai một năm (vd 1954 vs 1975) là mất điểm ngay.</div>

<h3>📰 2 — Báo điện tử ĐCSVN & Hồ Chí Minh (nối hôm nay)</h3>
<p>Nối lịch sử với hiện tại (xây dựng Đảng, phòng chống tham nhũng, thành tựu đổi mới) cho phần "bài học vận dụng" — phần ăn điểm cao của tiểu luận.</p>
<a class="link-card dl" href="https://dangcongsan.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">📰</span>
  <span class="lc-body"><span class="lc-title">Báo điện tử Đảng Cộng sản Việt Nam</span><span class="lc-sub">dangcongsan.vn · thời sự, tư liệu lịch sử</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🕘 3 — Dòng thời gian & sơ đồ tư duy</h3>
<p>In "Dòng thời gian cốt yếu" ở tab trên và dán bàn học. Với mỗi mốc, ghi bối cảnh → đường lối → kết quả → bài học. Dùng XMind nếu muốn nối các thời kỳ thành một sơ đồ.</p>
<a class="link-card dl" href="https://xmind.app/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">XMind</span><span class="lc-sub">xmind.app · sơ đồ tư duy / dòng thời gian miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📚 4 — Zotero (quản lý trích dẫn)</h3>
<p>Lưu và trích dẫn văn kiện đúng chuẩn cho phần Tài liệu tham khảo. Xem tab "Khung tiểu luận" ở trên để bắt đầu.</p>
<a class="link-card dl" href="https://www.zotero.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Zotero</span><span class="lc-sub">zotero.org · quản lý & trích dẫn tài liệu, miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout ok"><strong>Dùng AI có trách nhiệm.</strong> Syllabus cho phép AI như một bổ trợ — dùng để tóm tắt một giai đoạn hoặc kiểm tra một ngày. Nhưng <em>đừng để AI viết tiểu luận thay bạn hay bịa "sự kiện"</em>. Kiểm chứng mọi ngày tháng và trích dẫn. Điểm cao đến từ luận đề của chính bạn + sự kiện/văn kiện thật + bài học vận dụng.</div>
`,
  },
};
