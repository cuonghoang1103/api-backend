/**
 * Exp Hub guide for SSG104 — teamwork & communication tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content`. Academy SSG104 links "Công cụ" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'ssg104-cong-cu-hoc-tap',
    title: 'SSG104 — Công cụ học tập: quản lý việc nhóm, thuyết trình & viết',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Công cụ miễn phí cho SSG104: Trello (chia & theo dõi việc nhóm), Canva / Google Slides (thuyết trình cùng nhau), Grammarly (trau chuốt email/báo cáo) — cho các bài tập nhóm và dự án nhóm.',
    referenceUrl: 'https://trello.com/',
    codeBlocks: [
      {
        name: 'Khung email công việc (business email)',
        language: 'text',
        code: `Subject: [Ro rang, cu the] - vd: SSG104 Group 3 - Nop de xuat du an

Kinh gui Thay/Co [Ten],

[Cau dau: di thang vao trong tam - ban viet email de lam gi]

[Than: chi tiet / yeu cau cu the, ngan gon, gach dau dong neu can]

Em cam on Thay/Co. Em cho phan hoi cua Thay/Co.

Tran trong,
[Ho ten] - [MSSV] - Nhom [X]`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học tập · SSG104</span>
<h2>Công cụ cho làm nhóm &amp; giao tiếp</h2>
<p class="lead">SSG104 chấm 80% qua <strong>hoạt động nhóm, bài tập nhóm và dự án nhóm</strong>. Các công cụ miễn phí dưới đây giúp đội chia việc, làm thuyết trình cùng nhau và viết chuyên nghiệp.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ch 1</div><div class="lz-t">Trello</div><div class="lz-d">chia & theo dõi việc nhóm</div></div>
  <div class="lz-step"><div class="lz-k">Ch 5</div><div class="lz-t">Canva / Slides</div><div class="lz-d">thuyết trình cùng nhau</div></div>
  <div class="lz-step"><div class="lz-k">Ch 6</div><div class="lz-t">Grammarly</div><div class="lz-d">trau chuốt email/báo cáo</div></div>
</div>

<h3>📋 1 — Trello (chia việc nhóm — Chương 1)</h3>
<p>Một bảng công việc chung: tạo thẻ cho từng nhiệm vụ, gán người phụ trách, kéo qua các cột "Cần làm → Đang làm → Xong". Giúp mọi người thấy ai làm gì và không ai bị bỏ sót — chống xung đột "workload không đều" (Chương 4).</p>
<a class="link-card dl" href="https://trello.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Trello (miễn phí)</span><span class="lc-sub">trello.com · bảng Kanban chia việc nhóm</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🎨 2 — Canva / Google Slides (thuyết trình — Chương 5)</h3>
<p>Dựng slide thuyết trình <strong>cùng nhau, thời gian thực</strong>. Canva có mẫu đẹp sẵn; Google Slides tiện làm chung. Nhớ nguyên tắc Chương 5: ít chữ, hình rõ — slide là hỗ trợ, bạn mới là bài thuyết trình.</p>
<a class="link-card dl" href="https://www.canva.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Canva (miễn phí, nhiều mẫu)</span><span class="lc-sub">canva.com · thiết kế slide &amp; poster</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://slides.google.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Google Slides (làm chung online)</span><span class="lc-sub">slides.google.com · cả nhóm sửa cùng lúc</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>✍️ 3 — Grammarly (viết công việc — Chương 6)</h3>
<p>Kiểm ngữ pháp và giọng văn cho email, đề xuất, báo cáo — nhất là khi viết tiếng Anh. Giúp văn bản rõ ràng, chuyên nghiệp. Xem khung email mẫu ở trên.</p>
<a class="link-card dl" href="https://www.grammarly.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Grammarly (bản miễn phí)</span><span class="lc-sub">grammarly.com · sửa ngữ pháp &amp; giọng văn</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Nhắc: 80% điểm SSG104 là quá trình nhóm (Activity 15% + Group Assignment 20% + Group Project 30% + Participation 10%). Làm đủ phần của mình, giao tiếp rõ với đội, và dùng công cụ chung để không ai bị "chìm". Kỹ năng ở đây theo bạn suốt sự nghiệp — bổ trợ SSL101c.</div>
`,
  },
};
