/**
 * Exp Hub guide for MLN122 — study tools for a theory-heavy subject (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy MLN122 bài 0.4 links its "Công cụ" card to /exp-hub/mln122-cong-cu-hoc.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'mln122-cong-cu-hoc',
    title: 'MLN122 — Công cụ học: giáo trình, sơ đồ tư duy, flashcard & AI có đạo đức',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Cách học hiệu quả môn Kinh tế chính trị Mác-Lênin: lấy giáo trình PDF, vẽ sơ đồ tư duy mỗi chương (XMind/draw.io), flashcard định nghĩa (Anki/Quizlet), và dùng AI có trách nhiệm để kiểm tra sự hiểu (không viết hộ assignment). Kèm mẫu công thức cần nhớ.',
    referenceUrl: 'https://www.xmind.net/',
    codeBlocks: [
      {
        name: 'Công thức cần nhớ (chép vào flashcard)',
        language: 'text',
        code: `# GIA TRI HANG HOA
W = c + v + m
  c = tu ban bat bien (may moc, nguyen lieu - gia tri duoc chuyen)
  v = tu ban kha bien (tien luong, mua suc lao dong)
  m = gia tri thang du (do lao dong tao ra vuot v)

# TY SUAT GIA TRI THANG DU (trinh do boc lot)
m' = (m / v) x 100%

# TY SUAT LOI NHUAN (muc sinh loi)
p' = m / (c + v) x 100%

# CAU TAO HUU CO CUA TU BAN
c / v  (xu huong tang -> p' co xu huong giam)

# VI DU: c=80, v=20, m=20
#   m' = 20/20 = 100%   (boc lot)
#   p' = 20/100 = 20%   (sinh loi) -> m nguy trang thanh loi nhuan`,
      },
      {
        name: 'Khung tiểu luận 5 phần (assignment 40%)',
        language: 'text',
        code: `1. LY THUYET   - neu khai niem chinh xac (dinh nghia, cong thuc)
2. CA THAT     - vi du thuc te co so lieu (GSO, World Bank, bao chi)
3. PHAN TICH   - VAN DUNG ly thuyet vao ca (diem nam o day)
4. LIEN HE VN  - noi voi thuc tien / chinh sach Viet Nam
5. CHINH KIEN  - ket luan co lap luan cua rieng ban (khong chep)`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học · MLN122</span>
<h2>Học hiệu quả một môn nặng lý luận</h2>
<p class="lead">MLN122 không có code — nó thưởng cho <strong>sự hiểu có cấu trúc</strong>. Bộ công cụ dưới đây giúp bạn hệ thống hóa các phạm trù, nhớ định nghĩa & công thức, và viết assignment điểm cao một cách trung thực. Tất cả miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Đọc</div><div class="lz-t">Giáo trình PDF</div><div class="lz-d">nguồn sự thật cho đáp án</div></div>
  <div class="lz-step"><div class="lz-k">Hệ thống</div><div class="lz-t">Sơ đồ tư duy</div><div class="lz-d">XMind / draw.io</div></div>
  <div class="lz-step"><div class="lz-k">Nhớ</div><div class="lz-t">Flashcard</div><div class="lz-d">Anki / Quizlet</div></div>
  <div class="lz-step"><div class="lz-k">Kiểm</div><div class="lz-t">AI có đạo đức</div><div class="lz-d">giải thích, KHÔNG viết hộ</div></div>
</div>

<h3>📖 1 — Giáo trình chính thức (nguồn sự thật cho thi)</h3>
<p>Dùng Giáo trình Kinh tế chính trị Mác–Lênin (Bộ GD&ĐT, hệ không chuyên) làm nguồn chuẩn cho đáp án thi. Đọc kèm liên hệ thực tiễn, đừng học vẹt định nghĩa.</p>
<a class="link-card dl" href="https://moet.gov.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Giáo trình các môn Lý luận chính trị (Bộ GD&ĐT)</span><span class="lc-sub">moet.gov.vn · lấy bản giáo trình hệ không chuyên do trường cấp</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧠 2 — Sơ đồ tư duy (hệ thống hóa mỗi chương)</h3>
<p>Biến các phạm trù mỗi chương thành một sơ đồ: Ch2 (hàng hóa → 2 thuộc tính → giá trị → tiền tệ → quy luật giá trị), Ch3 (W=c+v+m → m' → tích lũy → lợi nhuận/lợi tức/địa tô). Nhìn cả chương trong một hình giúp nhớ và hiểu quan hệ.</p>
<a class="link-card dl" href="https://www.xmind.net/download/" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">XMind (miễn phí)</span><span class="lc-sub">xmind.net/download · vẽ sơ đồ tư duy nhanh</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://app.diagrams.net/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">draw.io (diagrams.net)</span><span class="lc-sub">app.diagrams.net · miễn phí, không cần cài</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🃏 3 — Flashcard (nhớ định nghĩa & công thức)</h3>
<p>Tạo thẻ cho: định nghĩa (giá trị sử dụng/giá trị, m, m', p'), 5 đặc điểm độc quyền của Lenin, và các cặp dễ nhầm (giá trị vs giá cả, m' vs p'). Xem tab công thức ở trên. Lặp lại ngắt quãng (spaced repetition) giúp nhớ lâu.</p>
<a class="link-card dl" href="https://apps.ankiweb.net/" target="_blank" rel="noopener">
  <span class="lc-ico">📇</span>
  <span class="lc-body"><span class="lc-title">Anki</span><span class="lc-sub">apps.ankiweb.net · flashcard lặp lại ngắt quãng, miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://quizlet.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Quizlet</span><span class="lc-sub">quizlet.com · flashcard online, dễ dùng trên điện thoại</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🤖 4 — AI dùng có trách nhiệm (CLO9)</h3>
<p>CLO9 yêu cầu rõ dùng AI có đạo đức. Dùng AI để <strong>giải thích</strong> một khái niệm khó, <strong>tự kiểm tra</strong> (nhờ AI ra câu hỏi), hoặc <strong>kiểm tra lập luận</strong> của bạn — KHÔNG dùng AI để bịa/viết hộ assignment. Bịa nội dung vi phạm liêm chính và dễ bị phát hiện.</p>
<div class="pitfall">Số liệu trong assignment phải từ nguồn thật (Tổng cục Thống kê <b>gso.gov.vn</b>, World Bank) và văn kiện Đảng — đừng để AI "bịa số". Trích nguồn rõ ràng.</div>

<div class="callout ok"><strong>Nhớ:</strong> điểm cao MLN122 = (hiểu, không chỉ thuộc) × (vận dụng vào ca thật) × (viết có cấu trúc) × (qua cổng thi ≥4). Dùng sơ đồ để hiểu, flashcard để nhớ công thức, khung 5 phần để viết, và AI để kiểm tra — không phải để chép.</div>
`,
  },
};
