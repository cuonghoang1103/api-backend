/**
 * Exp Hub guide for OSG202 — Linux environment setup (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content`. Academy OSG202 links "Cài đặt" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'osg202-cong-cu-hoc-tap',
    title: 'OSG202 — Cài đặt môi trường Linux: WSL, VirtualBox & terminal',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Hướng dẫn có một môi trường Linux thật để làm lab OSG202: WSL (Ubuntu trên Windows), VirtualBox + Ubuntu, và bộ lệnh shell cốt lõi để xem tiến trình/bộ nhớ/tệp.',
    referenceUrl: 'https://learn.microsoft.com/windows/wsl/install',
    codeBlocks: [
      {
        name: 'Cài WSL (Ubuntu) trên Windows — 1 lệnh',
        language: 'bash',
        code: `# Mo PowerShell (Admin) roi chay:
wsl --install

# Khoi dong lai may. Sau do mo "Ubuntu" tu Start Menu,
# tao user/mat khau. Kiem tra:
lsb_release -a
uname -a`,
      },
      {
        name: 'Lệnh cốt lõi — nối lý thuyết OS với thực hành',
        language: 'bash',
        code: `pwd; ls -l          # Chuong 4: he thong tep
ps aux | head       # Chuong 2: tien trinh
top                 # Chuong 2 & 3: tien trinh + bo nho (nhan q de thoat)
free -h             # Chuong 3: bo nho / swap
df -h               # Chuong 4: dung luong dia
chmod 755 a.sh      # Chuong 7: quyen tep`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · OSG202</span>
<h2>Có một môi trường Linux thật</h2>
<p class="lead">OSG202 chấm 20% qua <strong>lab Linux/shell</strong> và các CLO7–10 đều cần bạn dùng Linux thật. Chọn <strong>một</strong> trong hai cách dưới đây để có Ubuntu, rồi luyện lệnh mỗi ngày.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Windows</div><div class="lz-t">WSL</div><div class="lz-d">nhẹ, nhanh, khuyên dùng</div></div>
  <div class="lz-step"><div class="lz-k">Mọi HĐH</div><div class="lz-t">VirtualBox + Ubuntu</div><div class="lz-d">máy ảo đầy đủ</div></div>
  <div class="lz-step"><div class="lz-k">macOS</div><div class="lz-t">Terminal sẵn</div><div class="lz-d">Unix có sẵn</div></div>
</div>

<h3>🅐 Cách 1 — WSL (Ubuntu trên Windows, khuyên dùng)</h3>
<p>WSL cho bạn một Ubuntu thật bên trong Windows, không cần máy ảo nặng. Mở PowerShell (Admin), chạy <code>wsl --install</code> (xem khối lệnh trên), khởi động lại, rồi mở "Ubuntu" từ Start Menu.</p>
<a class="link-card dl" href="https://learn.microsoft.com/windows/wsl/install" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">WSL — hướng dẫn cài chính chủ Microsoft</span><span class="lc-sub">learn.microsoft.com/windows/wsl · Ubuntu trong Windows</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Nếu <code>wsl --install</code> báo lỗi: cần Windows 10 (2004+) hoặc Windows 11, và bật "Virtual Machine Platform" trong Windows Features. Sau khi cài, bản phân phối mặc định là Ubuntu — mở nó và tạo user + mật khẩu Linux (khác mật khẩu Windows).</div>

<h3>🅑 Cách 2 — VirtualBox + Ubuntu (máy ảo đầy đủ)</h3>
<p>Một máy ảo Ubuntu chạy tách biệt hoàn toàn — an toàn để thử nghiệm (kể cả lệnh nguy hiểm). Cài VirtualBox rồi tạo VM từ file ISO Ubuntu.</p>
<a class="link-card dl" href="https://www.virtualbox.org/wiki/Downloads" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">VirtualBox (Oracle, miễn phí)</span><span class="lc-sub">virtualbox.org/wiki/Downloads</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://ubuntu.com/download/desktop" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Ubuntu Desktop ISO</span><span class="lc-sub">ubuntu.com/download/desktop · bản LTS</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🐧 Lệnh cốt lõi để luyện</h3>
<p>Dùng các lệnh này để <strong>thấy tận mắt</strong> lý thuyết trong môn: tiến trình (Ch2), bộ nhớ (Ch3), tệp (Ch4), quyền (Ch7). Xem khối lệnh mẫu ở trên.</p>
<a class="link-card dl" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Linux Journey — học Linux từ đầu (miễn phí)</span><span class="lc-sub">linuxjourney.com · tương tác, có bài tập</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Mẹo: cài môi trường Linux <strong>tuần đầu</strong> rồi gõ lệnh mỗi ngày — lab (20%) và CLO7–10 đều là kỹ năng thực hành. Luyện thêm trên CodeLab track <strong>Linux &amp; Bash</strong>. ⚠️ <code>rm</code> không có thùng rác — xoá là mất, cẩn thận.</div>
`,
  },
};
