/**
 * Exp Hub guide for MLN111 — study tools for a concept-dense philosophy subject (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy MLN111 bài 0.4 links its "Công cụ" card to /exp-hub/mln111-cong-cu-hoc.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'mln111-cong-cu-hoc',
    title: 'MLN111 — Công cụ học: giáo trình, sơ đồ tư duy (quy luật & phạm trù), flashcard & AI có đạo đức',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Cách học hiệu quả môn Triết học Mác-Lênin: lấy giáo trình PDF, vẽ sơ đồ tư duy cho 2 nguyên lý / 3 quy luật / 6 cặp phạm trù (dễ nhầm), flashcard định nghĩa, và dùng AI có trách nhiệm để kiểm tra sự hiểu. Kèm sơ đồ hệ thống phép biện chứng.',
    referenceUrl: 'https://www.xmind.net/',
    codeBlocks: [
      {
        name: 'Sơ đồ hệ thống phép biện chứng (vẽ lại vào XMind)',
        language: 'text',
        code: `PHEP BIEN CHUNG DUY VAT
├── 2 NGUYEN LY
│   ├── Moi lien he pho bien  -> nhin trong quan he
│   └── Su phat trien          -> nhin theo xoay oc di len
├── 3 QUY LUAT
│   ├── Luong <-> Chat         : THE NAO (doi dan -> buoc nhay)
│   ├── Mau thuan              : VI SAO   (nguon goc phat trien)
│   └── Phu dinh cua phu dinh  : HUONG    (xoay oc, muc cao hon)
└── 6 CAP PHAM TRU
    ├── Rieng - Chung
    ├── Nhan - Qua
    ├── Tat nhien - Ngau nhien
    ├── Noi dung - Hinh thuc
    ├── Ban chat - Hien tuong
    └── Kha nang - Hien thuc`,
      },
      {
        name: 'Khung tiểu luận 5 phần (assignment 40%)',
        language: 'text',
        code: `1. NGUYEN LY   - neu quy luat/pham tru chinh xac
2. CA THAT     - mot vi du thuc te cu the
3. PHAN TICH   - VAN DUNG nguyen ly VAO ca (diem nam o day)
4. BAI HOC     - bai hoc phuong phap / thuc tien rut ra
5. CHINH KIEN  - ket luan co lap luan cua rieng ban`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học · MLN111</span>
<h2>Học hiệu quả một môn dày khái niệm</h2>
<p class="lead">MLN111 có nhiều quy luật và phạm trù dễ nhầm — thứ quyết định là <strong>hệ thống hóa</strong> chúng thành sơ đồ, nhớ định nghĩa bằng flashcard, và <strong>vận dụng</strong> vào ca thật khi viết. Tất cả công cụ dưới đây miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Đọc</div><div class="lz-t">Giáo trình PDF</div><div class="lz-d">nguồn sự thật cho thi</div></div>
  <div class="lz-step"><div class="lz-k">Hệ thống</div><div class="lz-t">Sơ đồ tư duy</div><div class="lz-d">2 nguyên lý/3 quy luật/6 phạm trù</div></div>
  <div class="lz-step"><div class="lz-k">Nhớ</div><div class="lz-t">Flashcard</div><div class="lz-d">Anki / Quizlet</div></div>
  <div class="lz-step"><div class="lz-k">Kiểm</div><div class="lz-t">AI có đạo đức</div><div class="lz-d">giải thích, KHÔNG viết hộ</div></div>
</div>

<h3>📖 1 — Giáo trình chính thức (nguồn sự thật cho thi)</h3>
<p>Dùng Giáo trình Triết học Mác–Lênin (Bộ GD&ĐT, hệ không chuyên) làm nguồn chuẩn cho đáp án thi. Đọc kèm liên hệ thực tiễn, đừng học vẹt định nghĩa.</p>
<a class="link-card dl" href="https://moet.gov.vn/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Giáo trình các môn Lý luận chính trị (Bộ GD&ĐT)</span><span class="lc-sub">moet.gov.vn · lấy bản giáo trình hệ không chuyên do trường cấp</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧠 2 — Sơ đồ tư duy (thiết yếu ở môn này)</h3>
<p>Phần dễ mất điểm nhất là nhầm 3 quy luật với nhau và 6 cặp phạm trù với nhau. Vẽ cả hệ thống phép biện chứng thành MỘT cây (xem tab ở trên): 2 nguyên lý → 3 quy luật (mỗi cái trả lời gì) → 6 cặp phạm trù. Nhìn cả hệ trong một hình giúp không lẫn.</p>
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

<h3>🃏 3 — Flashcard (nhớ định nghĩa & phân biệt)</h3>
<p>Tạo thẻ cho: định nghĩa vật chất của Lênin, mỗi quy luật trả lời gì (thế nào/vì sao/hướng), và các cặp phạm trù dễ nhầm (nhân-quả vs tất nhiên-ngẫu nhiên; bản chất vs hiện tượng). Lặp lại ngắt quãng giúp nhớ lâu.</p>
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

<h3>🤖 4 — AI dùng có trách nhiệm (CLO7)</h3>
<p>Dùng AI để <strong>giải thích</strong> một quy luật khó bằng lời đơn giản, <strong>tự kiểm tra</strong> (nhờ AI ra câu hỏi), hoặc <strong>kiểm tra ví dụ</strong> của bạn có đúng phạm trù không — KHÔNG dùng AI để bịa/viết hộ assignment (vi phạm CLO7, dễ bị phát hiện).</p>
<div class="pitfall">Cách học chắc nhất: sau khi đọc một quy luật, tự nghĩ MỘT ví dụ của riêng mình (từ học tập, công nghệ, đời sống) rồi giải thích lại. Nếu ví dụ khớp — bạn hiểu; nếu không nghĩ ra — bạn chưa hiểu, đọc lại.</div>

<div class="callout ok"><strong>Nhớ:</strong> điểm cao MLN111 = (hiểu, không chỉ thuộc) × (không nhầm quy luật/phạm trù) × (vận dụng vào ca thật) × (qua cổng thi ≥4). Dùng sơ đồ để không lẫn, flashcard để nhớ, khung 5 phần để viết, và tự nghĩ ví dụ để thật sự hiểu.</div>
`,
  },
};
