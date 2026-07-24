/**
 * Exp Hub guide for NWC203c — networking tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content`. Academy NWC203c links "Công cụ" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'nwc203c-cong-cu-hoc-tap',
    title: 'NWC203c — Công cụ học tập: Wireshark, Packet Tracer, ping & subnet calculator',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Công cụ cho NWC203c: Wireshark (bắt & xem gói tin thật), Cisco Packet Tracer (mô phỏng mạng cho Thi thực hành), lệnh ping/traceroute/ip, và subnet calculator.',
    referenceUrl: 'https://www.wireshark.org/download.html',
    codeBlocks: [
      {
        name: 'Lệnh mạng cốt lõi (Linux/macOS/Windows)',
        language: 'bash',
        code: `ping cuongthai.com          # kiem tra ket noi & do tre
traceroute cuongthai.com    # xem tung chang router (Windows: tracert)
nslookup cuongthai.com      # tra DNS ten -> IP
ip addr                     # xem dia chi IP cua may (Windows: ipconfig)
netstat -tuln               # xem cong dang mo (port)`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · NWC203c</span>
<h2>Công cụ cho Mạng máy tính</h2>
<p class="lead">NWC203c chấm 50% qua <strong>Thi thực hành</strong> (subnetting, mô phỏng mạng). Công cụ dưới đây giúp bạn <em>thấy gói tin thật</em>, <em>dựng mạng ảo</em> và luyện subnetting. Tất cả miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ch 1-6</div><div class="lz-t">Wireshark</div><div class="lz-d">bắt & xem gói tin thật</div></div>
  <div class="lz-step"><div class="lz-k">PE</div><div class="lz-t">Packet Tracer</div><div class="lz-d">mô phỏng mạng Cisco</div></div>
  <div class="lz-step"><div class="lz-k">Ch 5</div><div class="lz-t">Subnet calc + tay</div><div class="lz-d">chia mạng con</div></div>
</div>

<h3>📡 1 — Wireshark (thấy gói tin thật, mọi chương)</h3>
<p>Bắt lưu lượng mạng của chính bạn và xem từng gói: DNS query, TCP SYN/SYN-ACK/ACK (bắt tay ba bước), yêu cầu HTTP. Đây là cách biến lý thuyết phân tầng thành thứ nhìn thấy được.</p>
<a class="link-card dl" href="https://www.wireshark.org/download.html" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Wireshark (miễn phí, chính chủ)</span><span class="lc-sub">wireshark.org/download · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Mẹo: trong Wireshark, dùng bộ lọc để đỡ rối — gõ <code>dns</code> để chỉ xem DNS, <code>tcp.flags.syn==1</code> để bắt các gói SYN của bắt tay, hoặc <code>http</code> cho yêu cầu web. Chọn card mạng đang dùng (Wi-Fi/Ethernet) khi bắt đầu bắt.</div>

<h3>🖧 2 — Cisco Packet Tracer (mô phỏng mạng — cho Thi thực hành)</h3>
<p>Dựng mạng ảo (router, switch, PC), cấu hình IP/subnet, và xem gói đi. Là công cụ chuẩn cho phần thực hành và chứng chỉ mạng.</p>
<a class="link-card dl" href="https://www.netacad.com/courses/packet-tracer" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Cisco Packet Tracer (miễn phí qua NetAcad)</span><span class="lc-sub">netacad.com/courses/packet-tracer · tạo tài khoản miễn phí để tải</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🔢 3 — Subnet calculator (Chương 5)</h3>
<p>Luyện <strong>subnetting bằng tay</strong> trước (thi không có công cụ!), rồi dùng calculator để đối chiếu network address, broadcast, dải host và số host của một /24, /26…</p>
<a class="link-card dl" href="https://www.calculator.net/ip-subnet-calculator.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">IP Subnet Calculator</span><span class="lc-sub">calculator.net/ip-subnet-calculator · kiểm bài subnetting</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🐧 4 — Lệnh mạng có sẵn</h3>
<p>Máy nào cũng có sẵn <code>ping</code>, <code>traceroute/tracert</code>, <code>nslookup</code>, <code>ipconfig/ip addr</code> — xem khối lệnh mẫu ở trên để tự khám phá mạng của bạn ngay.</p>

<div class="note-ct">Nhắc điều kiện qua môn: <strong>TE ≥ 4</strong> VÀ <strong>PE ≥ 4</strong> VÀ <strong>FR ≥ 5</strong> (FR = min(10, (TE+PE)/2 + bonus)). Hoàn thành mọi MOOC đúng hạn = +1 bonus và là bắt buộc để dự thi. Luyện subnetting bằng tay mỗi ngày cho PE. CodeLab track linux-bash (networking) + rest-apis (HTTP).</div>
`,
  },
};
