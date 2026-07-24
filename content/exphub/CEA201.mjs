/**
 * Exp Hub guide for CEA201 — hardware simulators & tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content` → callouts, step maps, clickable open cards.
 * Academy CEA201 links "Công cụ" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'cea201-cong-cu-hoc-tap',
    title: 'CEA201 — Công cụ học tập: MARIE simulator, Logisim, CPU-Z, ParaCacheSimulator',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Các simulator syllabus CEA201 yêu cầu (CLO10): MARIE (hợp ngữ & chu trình lệnh), Logisim (mạch logic số), ParaCacheSimulator (cache), CPU-Z (đọc thông số CPU thật) — kèm link cài đặt và cách dùng.',
    referenceUrl: 'https://marie.js.org/',
    codeBlocks: [
      {
        name: 'MARIE — cộng hai số (LOAD/ADD/STORE)',
        language: 'text',
        code: `/ Cong X va Y, luu tong vao Z
Load X      / AC = gia tri tai X
Add  Y      / AC = AC + gia tri tai Y
Store Z     / Z = AC
Halt
X, DEC 5    / o du lieu chua 5
Y, DEC 7
Z, DEC 0
/ Chay tung buoc (Step): xem AC va PC doi moi chu ky. Ket qua Z = 12.`,
      },
      {
        name: 'MARIE — nhập từ bàn phím rồi xuất',
        language: 'text',
        code: `/ Nhap 1 so, tang them 1, roi xuat ra
Input        / doc so vao AC
Add  One
Output       / in AC
Halt
One, DEC 1`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học tập · CEA201</span>
<h2>Simulator &amp; công cụ cho CEA201</h2>
<p class="lead">Syllabus CEA201 yêu cầu rõ (CLO10) dùng <strong>simulator</strong> để khám phá khái niệm bằng tay. Bốn công cụ dưới đây phủ đủ: chạy CPU (MARIE), dựng mạch logic (Logisim), xem cache (ParaCacheSimulator), và đọc CPU thật của bạn (CPU-Z). Tất cả miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ch 10–12</div><div class="lz-t">MARIE</div><div class="lz-d">viết hợp ngữ, xem chu trình lệnh</div></div>
  <div class="lz-step"><div class="lz-k">Ch 9</div><div class="lz-t">Logisim</div><div class="lz-d">dựng cổng &amp; mạch logic</div></div>
  <div class="lz-step"><div class="lz-k">Ch 4</div><div class="lz-t">Cache sim</div><div class="lz-d">xem hit/miss/eviction</div></div>
</div>

<h3>🖥️ 1 — MARIE simulator (Chương 10–12, CLO10)</h3>
<p>MARIE là một CPU dạy học tí hon với hợp ngữ vừa một trang. Viết chương trình, nhấn <strong>Step</strong> để chạy từng bước và xem thanh ghi <em>AC</em> (tích luỹ) và <em>PC</em> đổi mỗi chu kỳ — đúng chu trình nạp–giải mã–thực thi bạn học. Xem 2 khối code mẫu ở trên.</p>
<a class="link-card dl" href="https://marie.js.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">MARIE.js — chạy ngay trên web</span><span class="lc-sub">marie.js.org · không cần cài, dán code mẫu vào và bấm Step</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">MARIE dùng lệnh <strong>1 địa chỉ</strong> với thanh ghi tích luỹ ngầm: <code>Load X</code> đưa giá trị tại X vào AC, <code>Add Y</code> cộng thêm, <code>Store Z</code> ghi AC ra Z. Khai báo dữ liệu bằng <code>Nhãn, DEC số</code>. Đừng quên <code>Halt</code> ở cuối, nếu không CPU chạy tiếp vào vùng dữ liệu.</div>

<h3>🔌 2 — Logisim (Chương 9 — Logic số, CLO6)</h3>
<p>Kéo–thả các cổng AND/OR/NOT/XOR, đấu dây, và kiểm bảng chân trị. Dựng thử một <strong>half-adder</strong> (tổng = XOR, nhớ = AND) để thấy phần cứng cộng bit ra sao.</p>
<a class="link-card dl" href="https://github.com/logisim-evolution/logisim-evolution/releases" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Logisim-evolution (bản cộng đồng, còn cập nhật)</span><span class="lc-sub">github.com/logisim-evolution · Java, chạy Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://circuitverse.org/simulator" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">CircuitVerse — dựng mạch trên web (không cài)</span><span class="lc-sub">circuitverse.org · thay thế Logisim nếu ngại cài Java</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧠 3 — Cache simulator (Chương 4)</h3>
<p>Xem trực tiếp <strong>hit</strong>, <strong>miss</strong> và <strong>eviction</strong> khi đổi kiểu ánh xạ (direct / set-associative) và chính sách thay thế (LRU). Hiểu vì sao truy cập tuần tự (locality) cho tỷ lệ hit cao.</p>
<a class="link-card dl" href="https://cpulator.01xz.net/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">CPUlator — mô phỏng CPU &amp; bộ nhớ trên web</span><span class="lc-sub">cpulator.01xz.net · xem thanh ghi, bộ nhớ, cache khi chạy code</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>⚙️ 4 — CPU-Z (đọc CPU thật của bạn)</h3>
<p>Nối lý thuyết với máy của chính bạn: xem số nhân, kích thước cache L1/L2/L3, tốc độ clock, kiến trúc. So với những gì học ở Chương 4, 5, 15.</p>
<a class="link-card dl" href="https://www.cpuid.com/softwares/cpu-z.html" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">CPU-Z (CPUID — chính chủ, Windows)</span><span class="lc-sub">cpuid.com · macOS dùng "About This Mac" hoặc lệnh <code>sysctl -a | grep machdep.cpu</code></span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📚 Giáo trình</h3>
<p>Sách chính: <strong>Computer Organization and Architecture: Design for Performance</strong> (William Stallings, 9e). Trang chính chủ của tác giả có nhiều hoạt hình minh hoạ pipeline, cache, bus rất đáng xem.</p>
<a class="link-card dl" href="https://williamstallings.com/ComputerOrganization/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Trang giáo trình Stallings (animations &amp; tài liệu)</span><span class="lc-sub">williamstallings.com/ComputerOrganization</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Mẹo học CEA201: với mỗi chủ đề, hỏi "nó giải vấn đề gì, và cái giá là gì?" — cache giải RAM chậm (giá: độ phức tạp); pipeline giải CPU rảnh (giá: hazard). Dùng simulator để <em>thấy</em> đánh đổi thay vì chỉ đọc. Thi cuối là trắc nghiệm nên nắm chắc thuật ngữ và khái niệm là thắng.</div>
`,
  },
};
