/**
 * Exp Hub guide for CSI104 — free learning tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content` (see globals.css) → callouts, step maps,
 * clickable download/open cards. Academy CSI104 links "Công cụ" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'csi104-cong-cu-hoc-tap',
    title: 'CSI104 — Công cụ học tập: chuyển hệ cơ số, mô phỏng CPU/OS, vẽ lưu đồ',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Bộ công cụ trực tuyến miễn phí giúp học CSI104: bộ chuyển hệ cơ số (nhị phân/hex), mô phỏng CPU Little Man Computer, công cụ vẽ lưu đồ, và hướng dẫn dùng giáo trình Forouzan.',
    referenceUrl: 'https://www.rapidtables.com/convert/number/',
    codeBlocks: [
      {
        name: 'Kiểm tra chuyển đổi bằng tay — thập phân 13 → nhị phân',
        language: 'text',
        code: `13 ÷ 2 = 6 dư 1
 6 ÷ 2 = 3 dư 0
 3 ÷ 2 = 1 dư 1
 1 ÷ 2 = 0 dư 1
Đọc số dư TỪ DƯỚI LÊN → 1101`,
      },
      {
        name: 'Gom bit: nhị phân → hex (4 bit / 1 chữ số hex)',
        language: 'text',
        code: `1101 1110
1101 = D
1110 = E
=> DE

Nhớ: đệm 0 từ BÊN TRÁI cho đủ nhóm 4 bit
11010 -> 0001 1010 -> 1A`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học tập · CSI104</span>
<h2>Bộ công cụ miễn phí cho CSI104</h2>
<p class="lead">CSI104 gần như không lập trình, nhưng có vài <strong>công cụ trực tuyến</strong> giúp bạn <em>thấy</em> khái niệm thay vì chỉ đọc — kiểm tra chuyển hệ cơ số, xem CPU chạy từng bước, và vẽ lưu đồ thuật toán. Tất cả đều miễn phí và chạy ngay trên trình duyệt, không cần cài đặt.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Chương 2</div><div class="lz-t">Chuyển cơ số</div><div class="lz-d">kiểm kết quả nhị phân/hex</div></div>
  <div class="lz-step"><div class="lz-k">Chương 1</div><div class="lz-t">Mô phỏng CPU</div><div class="lz-d">xem nạp–giải mã–thực thi</div></div>
  <div class="lz-step"><div class="lz-k">Chương 6</div><div class="lz-t">Vẽ lưu đồ</div><div class="lz-d">thuật toán trực quan</div></div>
</div>

<h3>🔢 1 — Bộ chuyển hệ cơ số (Chương 2)</h3>
<p>Dùng để <strong>kiểm tra lại</strong> bài chuyển đổi bạn làm tay (đừng dùng thay cho việc làm tay — bài thi không có công cụ). Nhập một số ở một hệ, nó hiện ngay ở các hệ còn lại.</p>
<a class="link-card dl" href="https://www.rapidtables.com/convert/number/binary-to-decimal.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">RapidTables — Number Converter</span><span class="lc-sub">rapidtables.com · nhị phân ⇄ thập phân ⇄ bát phân ⇄ hex, miễn phí</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Bẫy hay gặp khi gom bit sang hex: quên đệm 0 từ <strong>bên trái</strong> cho đủ nhóm 4 bit. Ví dụ 11010 phải viết thành 0001 1010 → 1A, không phải 1 1010. Xem khối ví dụ "Gom bit" ở trên.</div>

<h3>🖥️ 2 — Little Man Computer (Chương 1)</h3>
<p>Một mô phỏng CPU cực đơn giản để <strong>tận mắt thấy</strong> chu trình <em>nạp – giải mã – thực thi</em>: Program Counter tiến lên, lệnh được nạp, ALU cộng số. Viết vài lệnh, nhấn Run/Step và quan sát.</p>
<a class="link-card dl" href="https://peterhigginson.co.uk/lmc/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Little Man Computer (Peter Higginson)</span><span class="lc-sub">peterhigginson.co.uk/lmc · mô phỏng CPU chạy ngay trên web</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://www.101computing.net/LMC/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn LMC &amp; bài tập mẫu</span><span class="lc-sub">101computing.net/LMC · giải thích tập lệnh, có ví dụ</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🔀 3 — Công cụ vẽ lưu đồ (Chương 6)</h3>
<p>Vẽ <strong>lưu đồ (flowchart)</strong> cho thuật toán: hình bầu dục = bắt đầu/kết thúc, hình chữ nhật = hành động, hình thoi = rẽ nhánh. draw.io miễn phí, không cần tài khoản, xuất được ảnh để nộp bài thuyết trình.</p>
<a class="link-card dl" href="https://app.diagrams.net/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">draw.io (diagrams.net)</span><span class="lc-sub">app.diagrams.net · vẽ lưu đồ &amp; sơ đồ UML, miễn phí</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>📚 4 — Giáo trình &amp; cách đọc</h3>
<p>Giáo trình chính của môn là <strong>Foundations of Computer Science</strong> của Behrouz Forouzan. Gần như mỗi chương trong khóa Academy khớp với một chương cùng tên trong sách. Cách đọc hiệu quả: đọc phần <em>tóm tắt cuối chương</em> trước, rồi quay lại đọc chi tiết phần nào còn mờ.</p>
<div class="note-ct">Mẹo: mỗi khái niệm hãy gắn với một <strong>hình ảnh</strong> (con trỏ = mũi tên, ngăn xếp = chồng đĩa, hàng đợi = hàng người). Môn này rộng nên rủi ro là quên chứ không phải khó — ôn lại quiz mỗi chương sau một tuần để nhớ lâu.</div>

<h3>Tổng hợp đường dẫn</h3>
<a class="link-card dl" href="https://www.rapidtables.com/convert/number/binary-to-decimal.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Number Converter</span><span class="lc-sub">rapidtables.com</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://peterhigginson.co.uk/lmc/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Little Man Computer</span><span class="lc-sub">peterhigginson.co.uk/lmc</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://app.diagrams.net/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">draw.io</span><span class="lc-sub">app.diagrams.net</span></span><span class="lc-cta">MỞ →</span>
</a>
`,
  },
};
