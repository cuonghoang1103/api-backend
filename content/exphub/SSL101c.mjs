/**
 * Exp Hub guide for SSL101c — study tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content` → callouts, step maps, clickable open cards.
 * Academy SSL101c links "Công cụ" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'ssl101c-cong-cu-hoc-tap',
    title: 'SSL101c — Công cụ học tập: Coursera, Zotero, ghi chép & quản lý thời gian',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Cách đăng ký bộ Coursera của SSL101c và các công cụ miễn phí giúp học tốt: Zotero (quản lý trích dẫn), mẫu ghi chú Cornell, Pomodoro timer, và nguyên tắc dùng AI có đạo đức.',
    referenceUrl: 'https://www.coursera.org/specializations/academic-skills',
    codeBlocks: [
      {
        name: 'Trích dẫn kiểu APA — sách & bài báo',
        language: 'text',
        code: `# Sach (APA 7):
Tac gia, A. A. (Nam). Ten sach (in nghieng). Nha xuat ban.

# Bai bao (APA 7):
Tac gia, A. A. (Nam). Ten bai bao. Ten Tap Chi, Tap(So), trang-trang.

# Trong bai (in-text): (Tac gia, Nam) hoac (Tac gia, Nam, tr. X)
# => Dung Zotero de tu sinh dung dinh dang, khoi go tay.`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học tập · SSL101c</span>
<h2>Đăng ký &amp; công cụ cho SSL101c</h2>
<p class="lead">SSL101c học trên <strong>Coursera</strong> (bộ chuyên đề Đại học Sydney). Bên cạnh đó, vài công cụ miễn phí giúp bạn học các MOOC hiệu quả hơn, trích dẫn đúng để tránh đạo văn, và quản lý thời gian tự học. Tất cả đều miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Học</div><div class="lz-t">Coursera</div><div class="lz-d">5 MOOC + capstone</div></div>
  <div class="lz-step"><div class="lz-k">Trích dẫn</div><div class="lz-t">Zotero</div><div class="lz-d">tránh đạo văn (Ch1, Ch5)</div></div>
  <div class="lz-step"><div class="lz-k">Tập trung</div><div class="lz-t">Pomodoro</div><div class="lz-d">quản lý thời gian (Nâng cao 2)</div></div>
</div>

<h3>🎓 1 — Bộ Coursera (nội dung chính của môn)</h3>
<p>Bạn được admin lớp mời/ghi danh. Vào bộ chuyên đề rồi đăng ký <strong>cả 5 MOOC</strong>, học ≥5 giờ/tuần, và <strong>lấy chứng chỉ từng khoá</strong> — chứng chỉ là điều kiện để được thi cuối kỳ.</p>
<a class="link-card dl" href="https://www.coursera.org/specializations/academic-skills" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Academic Skills for University Success (Coursera)</span><span class="lc-sub">coursera.org/specializations/academic-skills · Đại học Sydney</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Đừng để MOOC tới tuần cuối: phải hoàn thành <strong>tất cả</strong> khoá kèm chứng chỉ mới được dự thi, và hoàn thành đúng hạn còn được điểm thưởng (Bonus) cộng vào kết quả. Học đều 5h/tuần là an toàn nhất.</div>

<h3>📚 2 — Zotero (quản lý trích dẫn, chống đạo văn)</h3>
<p>Lưu mọi nguồn khi bạn tìm thấy (một cú nhấp từ trình duyệt) và tự sinh trích dẫn APA/MLA/IEEE chuẩn. Biến hàng giờ định dạng thành một cú nhấp và không bao giờ mất nguồn.</p>
<a class="link-card dl" href="https://www.zotero.org/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Zotero (miễn phí, Windows/macOS/Linux)</span><span class="lc-sub">zotero.org/download · cài kèm Zotero Connector cho trình duyệt</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📝 3 — Ghi chú Cornell &amp; đọc chủ động</h3>
<p>Chia trang thành 3 vùng: <strong>ghi chú</strong> (phải), <strong>gợi ý/câu hỏi</strong> (trái), <strong>tóm tắt</strong> (dưới). Với PDF/đọc trên máy, dùng app ghi chú như Notion hoặc Obsidian và tự kẻ mẫu Cornell.</p>
<a class="link-card dl" href="https://obsidian.md/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Obsidian — ghi chú Markdown miễn phí</span><span class="lc-sub">obsidian.md · ghi chú liên kết, offline, riêng tư</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>⏱️ 4 — Pomodoro (tập trung sâu)</h3>
<p>Chu kỳ 25 phút tập trung + 5 phút nghỉ, sau 4 lượt nghỉ dài. Cất điện thoại, đóng tab thừa. Dùng bất kỳ Pomodoro timer trên web hoặc điện thoại.</p>
<a class="link-card dl" href="https://pomofocus.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Pomofocus — Pomodoro timer trên web</span><span class="lc-sub">pomofocus.io · không cần cài, đặt task &amp; bấm start</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🤖 5 — Dùng AI có đạo đức (Nâng cao 3)</h3>
<p>AI (ChatGPT, Claude…) là <strong>gia sư tốt</strong>: nhờ giải thích lại khái niệm, kiểm tra ngữ pháp, gợi dàn ý, brainstorm — <em>rồi bạn tự tư duy và viết</em>. KHÔNG nộp văn bản AI sinh như của mình (= đạo văn, phát hiện được). Luôn kiểm chứng dữ kiện AI đưa (nó bịa nguồn) và tuân chính sách AI của môn.</p>

<div class="note-ct">Nhắc lại điều kiện qua môn: <strong>TE ≥ 4</strong> (điểm thi) VÀ <strong>FR ≥ 5</strong> (kết quả cuối = min(10, TE + Bonus)). Hoàn thành MOOC đúng hạn để có Bonus, và ôn quiz các chương trong khóa Academy này cho bài thi trắc nghiệm.</div>
`,
  },
};
