/**
 * Deploy lên VPS · Deck dv-09 — Chương 9: Giám sát (những con số nói dối và những con số thì không).
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026:
 *   • "VPS thí nghiệm" (hợp đồng mục 7b) = container ubuntu:24.04 `dv09-vps` (arm64, nhân 7.0.12-linuxkit của Docker
 *     Desktop trên Mac M1, 10 nhân ảo), systemd 255 thật (--privileged ngắn hạn), --memory 512m, SSH từ Mac qua
 *     127.0.0.1:19092 bằng khoá tạo trong thư mục nháp. Phần mềm: nginx 1.24.0, Python 3.12.3, curl 8.5.0, jq 1.7,
 *     mawk 1.3.4, OpenSSL 3.0.13. Ứng dụng thử app.py (127.0.0.1:8080): 95% request 10–20 ms, 5% chậm 850–980 ms
 *     (30% trong số đó trả 500), log MỘT dòng JSON mỗi request ra stdout ⇒ journald. Webhook GIẢ hook.py ở
 *     127.0.0.1:9099 (thay cho Telegram/ntfy — không gọi dịch vụ thật nào).
 *   • `docker logs` / container job bị quên: chạy trên Mac (Docker Desktop), container alpine nhãn dvhoc=09.
 *   • Chuyện thật canh-vps: đọc CHỈ ĐỌC journal + unit trên máy nhà (Fedora 44, systemd 259) — số lần kiểm, số tin
 *     Telegram theo ngày, các dòng HONG. Không đụng VPS production.
 * Output CŨ của chương (load average 7 mẫu, 200 request 60,8 ms, 200.000 dòng log, bảng 48 giờ, 502 ở cổng 3360)
 * chép NGUYÊN VĂN từ bài học.
 *
 * Hình tự vẽ (SVG nội tuyến): lichSu() dòng thời gian giám sát · taiTre() load average bò vs tải thật ·
 * histo() hai đám đông độ trễ · trangSvg() đuôi 5% ở mức trang · diaSvg() ngưỡng vs xu hướng ·
 * canhSvg() 43 ngày của bộ canh máy nhà (trạng thái + số tin Telegram mỗi ngày).
 * Tô màu: sh() cho bash; conf() (chép từ dv-03) cho unit systemd và nginx.conf.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, table, vs, kpis, two, bars, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-09', code: 'DEPLOY · CHƯƠNG 9', title: 'Giám sát', sub: 'Deploy lên VPS · Chương 9' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.c-kpis .k b{font-size:40px}</style>';

/* ─────────── tô màu cấu hình: unit systemd (ini) và nginx.conf — chép từ dv-03 ─────────── */
const conf = (lines, { fs = 15, lang = 'ini' } = {}) => {
  const hl = (raw) => {
    const ci = raw.search(/(^|\s)#/);
    let body = raw, tail = '';
    if (ci >= 0) { const at = raw[ci] === '#' ? ci : ci + 1; tail = `<span class="cm">${esc(raw.slice(at))}</span>`; body = raw.slice(0, at); }
    let m;
    if (lang === 'ini') {
      if ((m = body.match(/^(\s*)(\[[^\]]+\])(.*)$/))) return `${m[1]}<span class="sec">${esc(m[2])}</span>${esc(m[3])}${tail}`;
      if ((m = body.match(/^(\s*)([A-Za-z]+)(=)(.*)$/))) {
        const v = esc(m[4]).replace(/(%[a-zA-Z])/g, '<span class="sx">$1</span>')
          .replace(/(&#39;[^&]*?&#39;|'[^']*')/g, '<span class="s">$1</span>')
          .replace(/\b(\d+(?:s|ms|min)?)\b/g, '<span class="nu">$1</span>');
        return `${m[1]}<span class="k">${esc(m[2])}</span>${m[3]}${v}${tail}`;
      }
      return esc(body) + tail;
    }
    if ((m = body.match(/^(\s*)([a-z_]+)(\s.*)?$/))) {
      const rest = esc(m[3] || '').replace(/('[^']*'|"[^"]*")/g, '<span class="s">$1</span>')
        .replace(/(\d+\.\d+\.\d+\.\d+)(:\d+)?/g, '<span class="nu">$1$2</span>')
        .replace(/\b(off|on|ssl|default_server)\b/g, '<span class="sx">$1</span>');
      return `${m[1]}<span class="k">${esc(m[2])}</span>${rest}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── Slide 3: dòng thời gian giám sát (mốc đã kiểm nguồn) ─────────── */
const lichSu = () => {
  let s = '';
  const y = 150, x0 = 40, x1 = 1030;
  s += A(x0, y, x1, y, { c: 'dim', sw: 2 });
  const moc = [
    [110, '1999', 'NetSaint 0.0.1', 'đổi tên Nagios 2002', 'kiểm + gửi thư/pager', 'amb', -1],
    [276, '2003', 'SRE ở Google', 'Ben Treynor Sloss', 'vận hành như kỹ sư', 'blu', 1],
    [442, '2012', 'Prometheus', 'SoundCloud · CNCF 2016', 'kéo số đo + hỏi', 'ora', -1],
    [608, '2014', 'Grafana', 'Torkel Ödegaard', 'bảng đồ thị', 'grn', 1],
    [774, '2016', 'Sách SRE', 'O’Reilly', '4 tín hiệu vàng', 'vio', -1],
    [940, '2021', 'Uptime Kuma', 'tự host, kiểm từ ngoài', 'HTTP/từ khoá/TLS', 'tea', 1],
  ];
  moc.forEach(([x, nam, t, d1, d2, c, up]) => {
    s += `<circle cx="${x}" cy="${y}" r="9" fill="${D[c]}"/>`;
    s += T(x, y + (up < 0 ? -18 : 34), nam, { fs: 17, b: true, c, a: 'middle', mono: true });
    const by = up < 0 ? y - 132 : y + 50;
    s += R(x - 82, by, 164, 92, { c, fill: '#0b1220', r: 10, sw: 2 });
    s += T(x, by + 28, t, { fs: 16, b: true, a: 'middle' });
    s += T(x, by + 52, d1, { fs: 13, c: 'mu', a: 'middle' });
    s += T(x, by + 74, d2, { fs: 13, c, a: 'middle' });
  });
  s += R(1036, y - 58, 112, 116, { c: 'dv', fill: 'rgba(56,189,248,.10)', r: 10, dash: true });
  s += T(1092, y - 30, '18/08/2026', { fs: 14, b: true, c: 'dv', a: 'middle', mono: true });
  s += T(1092, y - 6, 'canh-vps.sh', { fs: 14, a: 'middle', mono: true });
  s += T(1092, y + 18, 'máy nhà canh', { fs: 13, c: 'mu', a: 'middle' });
  s += T(1092, y + 38, 'VPS từ ngoài', { fs: 13, c: 'mu', a: 'middle' });
  return sv(1150, 300, s);
};

/* ─────────── Slide 4: load average bò chậm (dữ liệu cũ, đo thật) ─────────── */
const taiTre = () => {
  const L = [0.10, 0.70, 1.21, 1.71, 2.07, 2.36, 2.62];
  const x0 = 60, y0 = 300, W = 520, H = 250, X = (t) => x0 + (t / 60) * W, Y = (v) => y0 - (v / 4.4) * H;
  let s = '';
  for (let v = 0; v <= 4; v++) { s += `<path d="M${x0} ${Y(v)} L${x0 + W} ${Y(v)}" stroke="#223" stroke-width="1"/>` + T(x0 - 10, Y(v) + 5, `${v}`, { fs: 13, c: 'mu', a: 'end' }); }
  for (let t = 0; t <= 60; t += 10) s += T(X(t), y0 + 22, `${t}s`, { fs: 13, c: 'mu', a: 'middle' });
  s += `<path d="M${X(0)} ${Y(4)} L${X(60)} ${Y(4)}" stroke="${D.grn}" stroke-width="3.5"/>`;
  s += T(X(60), Y(4) - 10, 'tải THẬT = 4,00 (CPU 100% từ t=0)', { fs: 14, c: 'grn', a: 'end', b: true });
  s += `<path d="${L.map((v, i) => `${i ? 'L' : 'M'}${X(i * 10)} ${Y(v)}`).join(' ')}" stroke="${D.red}" stroke-width="3.5" fill="none"/>`;
  L.forEach((v, i) => { s += `<circle cx="${X(i * 10)}" cy="${Y(v)}" r="4.5" fill="${D.red}"/>`; });
  s += T(X(13), y0 - 12, '← 0,10 ở t=0', { fs: 14, c: 'red', b: true });
  s += T(X(60) - 4, Y(2.62) + 26, '2,62 sau 60 s', { fs: 14, c: 'red', a: 'end', b: true });
  s += T(x0, 22, 'load average 1 phút', { fs: 14, c: 'mu' });
  return sv(600, 330, s);
};

/* ─────────── Slide 9: histogram 1.000 request (đo thật, VPS thí nghiệm) ─────────── */
const histo = () => {
  const B = [['10–19', 645], ['20–29', 293], ['30–39', 8], ['40–49', 1], ['50–99', 0], ['100–799', 1], ['800–899', 19], ['900–999', 33]];
  const x0 = 70, y0 = 300, bw = 118, H = 250, Y = (n) => (Math.sqrt(n) / Math.sqrt(645)) * H;
  let s = '';
  B.forEach(([l, n], i) => {
    const x = x0 + i * bw, h = Y(n), c = i >= 6 ? D.red : i >= 2 ? D.amb : D.blu;
    if (n) s += `<rect x="${x + 10}" y="${y0 - h}" width="${bw - 20}" height="${h}" rx="4" fill="${c}" opacity=".85"/>`;
    if (n) s += T(x + bw / 2, y0 - h - 8, String(n), { fs: 15, b: true, a: 'middle', mono: true });
    s += T(x + bw / 2, y0 + 22, l, { fs: 13.5, c: 'mu', a: 'middle', mono: true });
  });
  s += T(x0 + 4 * bw, y0 + 46, 'mili giây (trục đứng: căn bậc hai số request)', { fs: 13, c: 'dim', a: 'middle' });
  // vạch trung bình 65,2 ms — nằm trong khe trống
  const xm = x0 + 4 * bw + bw / 2;
  s += `<path d="M${xm} 40 L${xm} ${y0}" stroke="${D.vio}" stroke-width="3" stroke-dasharray="7 6"/>`;
  s += T(xm, 30, 'trung bình 65,2 ms', { fs: 15, b: true, c: 'vio', a: 'middle' });
  s += T(xm + 12, 200, 'KHÔNG AI', { fs: 15, b: true, c: 'vio' });
  s += T(xm + 12, 220, 'ở đây', { fs: 15, c: 'vio' });
  s += T(x0 + 2 * bw + 14, 120, '938 request nhanh (≤ 29 ms)', { fs: 16, b: true, c: 'blu' });
  s += T(x0 + 6.9 * bw, 170, '52 request chậm (5,2%)', { fs: 16, b: true, c: 'red', a: 'middle' });
  return sv(1040, 360, s);
};

/* ─────────── Slide 12: đuôi 5% ở mức trang ─────────── */
const trangSvg = () => bars([
  { l: '1 lời gọi', v: 95, txt: '95,0% nhanh hết', c: 'grn' },
  { l: '5 lời gọi', v: 77.4, txt: '77,4%', c: 'grn' },
  { l: '10 lời gọi', v: 59.9, txt: '59,9%', c: 'amb' },
  { l: '20 lời gọi', v: 35.8, txt: '35,8%', c: 'ora' },
  { l: '40 lời gọi', v: 12.9, txt: '12,9%', c: 'red' },
], { lw: 150, max: 100 });

/* ─────────── Slide 19: ngưỡng vs xu hướng (dữ liệu 48 giờ của bài 9.4) ─────────── */
const diaSvg = () => {
  const x0 = 60, y0 = 320, W = 1020, H = 280, X = (h) => x0 + (h / 42) * W, Y = (p) => y0 - ((p - 20) / 85) * H;
  let s = '';
  [30, 50, 70, 90, 100].forEach((p) => { s += `<path d="M${x0} ${Y(p)} L${x0 + W} ${Y(p)}" stroke="#1d2533" stroke-width="1"/>` + T(x0 - 10, Y(p) + 5, `${p}%`, { fs: 13, c: 'mu', a: 'end' }); });
  for (let h = 0; h <= 42; h += 6) s += T(X(h), y0 + 22, `${h}h`, { fs: 13, c: 'mu', a: 'middle' });
  s += `<path d="M${x0} ${Y(90)} L${x0 + W} ${Y(90)}" stroke="${D.red}" stroke-width="2" stroke-dasharray="8 6"/>`;
  s += T(x0 + 8, Y(90) - 8, 'ngưỡng 90%', { fs: 14, c: 'red', b: true });
  s += `<path d="M${X(0)} ${Y(30)} L${X(41)} ${Y(100.1)}" stroke="${D.dv}" stroke-width="4"/>`;
  s += `<rect x="${X(17)}" y="${Y(105)}" width="${X(41) - X(17)}" height="${Y(20) - Y(105)}" fill="rgba(210,153,34,.08)"/>`;
  s += `<path d="M${X(17)} ${Y(105)} L${X(17)} ${y0}" stroke="${D.amb}" stroke-width="3"/>`;
  s += T(X(17) + 8, Y(103), 'giờ 17 — XU HƯỚNG báo: "đầy sau 24h"', { fs: 15, c: 'amb', b: true });
  s += `<path d="M${X(36)} ${Y(96)} L${X(36)} ${y0}" stroke="${D.red}" stroke-width="3"/>`;
  s += T(X(36) - 10, Y(58), 'giờ 36 — NGƯỠNG báo', { fs: 15, c: 'red', b: true, a: 'end' });
  s += T(X(36) - 10, Y(58) + 22, 'còn 5 giờ, rơi vào giờ nào cũng được', { fs: 13.5, c: 'mu', a: 'end' });
  s += T(X(41), Y(100.1) - 10, 'đầy: giờ 41', { fs: 14, c: 'dv', b: true, a: 'end' });
  s += `<path d="M${X(17)} ${y0 - 14} L${X(36)} ${y0 - 14}" stroke="${D.grn}" stroke-width="2.5" marker-end="url(#m-grn)" marker-start="url(#m-grn)"/>`;
  s += T((X(17) + X(36)) / 2, y0 - 22, 'sớm hơn 19 giờ', { fs: 15, c: 'grn', b: true, a: 'middle' });
  s += T(x0 + 8, 18, 'đĩa 20 GB, bắt đầu 30%, +350 MB/giờ, lấy mẫu mỗi giờ', { fs: 14, c: 'mu' });
  return sv(1120, 350, s);
};

/* ─────────── Slide 28: 43 ngày của bộ canh máy nhà (journal thật, chỉ đọc) ─────────── */
const TELE = { 1: 4, 3: 3, 4: 2, 6: 2, 7: 8, 8: 7, 9: 9, 10: 6, 16: 13, 17: 38, 18: 33, 19: 23, 20: 70, 21: 58, 22: 26, 23: 32, 24: 28, 25: 24, 26: 36, 27: 10, 28: 20, 29: 20, 30: 25, 31: 19, 32: 20, 33: 15, 34: 32, 35: 25, 36: 4, 37: 7, 38: 4, 39: 6, 40: 7, 41: 6, 42: 1 };
const canhSvg = () => {
  const x0 = 214, dw = 21, X = (d) => x0 + d * dw; // ngày 0 = 18/08, 14 = 01/09, 42 = 29/09
  let s = '';
  const lan = (y, ten, c, doan) => {
    s += T(0, y + 20, ten, { fs: 14.5, b: true, c });
    doan.forEach(([a, b, op = 0.85]) => { s += `<rect x="${X(a)}" y="${y + 4}" width="${Math.max(3, X(b) - X(a))}" height="22" rx="3" fill="${D[c]}" opacity="${op}"/>`; });
  };
  s += `<rect x="${X(11)}" y="6" width="${X(16) - X(11)}" height="172" fill="url(#gach)" opacity=".7"/>`;
  s += T((X(11) + X(16)) / 2, 194, 'máy nhà tắt', { fs: 12.5, c: 'dim', a: 'middle' });
  lan(10, 'Tổng: còn XANH', 'grn', [[0, 7.3], [42.1, 43]]);
  lan(44, 'Chứng chỉ TLS ≤ 14 ngày', 'amb', [[7.33, 11], [16, 21.35]]);
  const ngay = (y, ten, c, m, max) => {
    s += T(0, y + 20, ten, { fs: 14.5, b: true, c });
    Object.entries(m).forEach(([d, n]) => { s += `<rect x="${X(+d) + 1}" y="${y + 4}" width="${dw - 2}" height="22" rx="3" fill="${D[c]}" opacity="${(0.3 + 0.7 * Math.min(1, n / max)).toFixed(2)}"/>`; });
  };
  ngay(78, 'Đĩa VPS ≥ 90%', 'ora', { 3: 20, 7: 2, 17: 70, 18: 99, 19: 20, 20: 39, 23: 37, 24: 3, 25: 64, 26: 33 }, 60);
  lan(112, 'Container job CHẾT', 'red', [[16.55, 42.08]]);
  ngay(146, 'Trang chủ không lên', 'vio', { 4: 1, 6: 1, 10: 25, 16: 1, 17: 8, 18: 13, 19: 10, 20: 40, 21: 42, 22: 13, 23: 14, 24: 34, 25: 10, 26: 14, 27: 10, 28: 8, 29: 9, 30: 10, 31: 11, 32: 12, 33: 9, 34: 16, 35: 12, 39: 1 }, 30);
  s += T(X(20.5), 40, '0 ngày: 07–08/09', { fs: 12.5, c: 'amb', a: 'middle', b: true });
  s += T(X(27.2), 100, '100%: 04, 10, 13/09', { fs: 12.5, c: 'ora', a: 'start', b: true });
  // số tin Telegram mỗi ngày
  const yb = 268, hb = 58;
  s += T(0, yb - 22, 'Tin Telegram / ngày', { fs: 14.5, b: true, c: 'dv' });
  s += T(0, yb - 2, 'tổng 643 · từ 03/09: 602', { fs: 13, c: 'mu' });
  Object.entries(TELE).forEach(([d, n]) => {
    const h = (n / 70) * hb;
    s += `<rect x="${X(+d) + 2}" y="${yb - h}" width="${dw - 4}" height="${h}" rx="2" fill="${D.dv}" opacity=".85"/>`;
  });
  s += T(X(20) + dw / 2, yb - hb - 6, '70', { fs: 13, b: true, c: 'dv', a: 'middle' });
  [[0, '18/08'], [7, '25/08'], [14, '01/09'], [16, '03/09'], [21, '08/09'], [28, '15/09'], [35, '22/09'], [42, '29/09']].forEach(([d, t]) => {
    s += T(X(d) + dw / 2, yb + 22, t, { fs: 12.5, c: 'mu', a: 'middle', mono: true });
  });
  const pat = '<pattern id="gach" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="8" fill="#39424f"/></pattern>';
  return sv(1150, 294, s).replace('<defs>', `<defs>${pat}`);
};

export const slides = S([
  cover({ t: 'Chương 9 — Giám sát', sub: 'con số trễ · trung bình nói dối · log trả lời được · báo động không thành tiếng ồn · canh từ bên ngoài', chap: 'CHƯƠNG 9' }),

  { t: 'Bản đồ chương: đo đúng, báo đúng, đứng đúng chỗ', body: mindmap('Giám sát', 'biết trước người dùng', [
    { t: '9.1 Đo cái gì', d: 'load average trễ · /proc/stat · PSI · 4 tín hiệu', c: 'blu' },
    { t: '9.2 Phân vị', d: 'trung bình 65 ms · p95 857 ms · sort + awk', c: 'vio' },
    { t: '9.3 Log', d: 'journalctl · docker logs · JSON + jq · request id', c: 'grn' },
    { t: '9.4 Báo động', d: 'xu hướng · vân tay · nhắc lại · tạm im có hạn', c: 'amb' },
    { t: '9.5 Cửa trước', d: '200 ≠ chạy · kiểm nội dung · canh từ máy khác', c: 'dv' },
    { t: 'Chuyện thật', d: 'canh-vps: 26 ngày đỏ vì một container job', c: 'red' },
  ]) },

  /* ───────────── 9.1 ───────────── */
  { t: 'Giám sát: từ "gửi pager" tới canh từ ngoài', body: lichSu() + two(
    box('info', '<strong>Ý không đổi suốt 27 năm:</strong> một chương trình KIỂM định kỳ, và khi hỏng thì <strong>BÁO một con người</strong>. NetSaint 1999 đã làm đúng hai việc đó qua email và pager.'),
    box('warn', '<strong>Không giám sát = người dùng là bộ báo động.</strong> Họ không báo — họ bỏ đi. Bạn biết lúc thầy hỏi "sao link chết?" trước buổi bảo vệ.')) },

  { t: 'Load average trễ cả phút, PSI thấy ngay', body: two(
    taiTre(),
    `${term([
      '# 14 vòng lặp bận trên 10 nhân, sau 12 giây',
      '$ bash cpu.sh',
      '= ban 99%  steal 0%  (delta tong=687)',
      '$ cat /proc/pressure/cpu',
      '! some avg10=28.72 avg60=7.56 avg300=3.24 …',
      '$ cat /proc/loadavg',
      '2.81 1.49 1.23 15/841 5551',
    ], { title: 'VPS thí nghiệm — Ubuntu 24.04, 10 nhân ảo', fs: 13.5 })}
    ${box('tip', '<strong>PSI</strong> (nhân ≥ 4.20): % thời gian tác vụ <em>phải chờ</em> CPU/IO/RAM. 28,7% trong 10 s vừa qua — trong khi load 1 phút mới 2,81 với 15 tác vụ đang chạy.')}`, 'r') },

  { t: 'CPU đúng = hai lần đọc /proc/stat, một phép trừ', body: two(
    sh([
      ['#!/bin/bash   cpu.sh', ''],
      ['doc() { awk \'/^cpu /{ t=0', 'dòng "cpu" = tổng mọi nhân'],
      ['  for (i=2; i<=NF; i++) t+=$i', 'cộng mọi cột (jiffy)'],
      ['  print t, $5+$6, $9 }\' /proc/stat; }', 'idle+iowait, steal'],
      ['read T1 I1 S1 < <(doc); sleep 1', 'lần đọc 1'],
      ['read T2 I2 S2 < <(doc)', 'lần đọc 2'],
      ['dt=$((T2 - T1))', 'đo khoảng, đừng giả định'],
      ['echo "ban $(( 100*(dt-(I2-I1))/dt ))%"', 'bận = phần không rảnh'],
      ['echo "steal $(( 100*(S2-S1)/dt ))%"', 'bị hàng xóm lấy'],
    ], { fs: 14 }),
    `${term([
      '$ head -1 /proc/stat',
      'cpu  2247801 101 859774 456755472 124406 0 426200 0 0 0',
      '#    user        system idle      iowait          steal',
      '$ bash cpu.sh          # máy rảnh',
      'ban 0%  steal 0%  (delta tong=1013)',
    ], { title: 'VPS thí nghiệm', fs: 12.5 })}
    ${table(['Cột', 'Nghĩa'], [
      ['<code>$5</code> idle · <code>$6</code> iowait', 'không làm gì / chờ đĩa'],
      ['<code>$9</code> steal', 'VPS rẻ: bộ ảo hoá đưa nhân cho người khác'],
      ['đơn vị', 'jiffy = 1/100 s (<code>getconf CLK_TCK</code>)'],
    ], { sm: true })}`, 'l') },

  { t: 'Bốn tín hiệu vàng, bản cho một VPS', body: cards([
    { ic: '🧱', t: 'Bão hoà', d: 'CPU bận, <code>MemAvailable</code>, đĩa % <strong>và inode</strong>, PSI. "Còn cách bức tường bao xa?"', c: 'blu' },
    { ic: '💥', t: 'Lỗi', d: 'tỷ lệ 5xx, số lần restart, <code>oom_kill</code>, container <code>Exited</code>. "Đang hỏng bao nhiêu?"', c: 'red' },
    { ic: '⏱', t: 'Độ trễ', d: '<strong>p50 · p95 · p99</strong>, không phải trung bình (9.2). "Dùng có sướng không?"', c: 'vio' },
    { ic: '📈', t: 'Lưu lượng', d: 'request/giây — MẪU SỐ cho ba cái kia. 5% lỗi ở 10 rps ≠ 5% ở 1.000 rps', c: 'grn' },
  ], 4) + two(
    bars([
      { l: 'cat /proc/stat', sub: 'fork + exec', v: 1.647, txt: '1,647 ms/lần', c: 'red' },
      { l: 'đọc trong tiến trình', sub: 'không fork', v: 0.0135, txt: '0,0135 ms/lần', c: 'grn' },
    ], { lw: 200 }),
    box('warn', '<strong>Đo cũng tốn:</strong> gấp 120 lần chỉ vì <code>fork</code>. Prometheus + Grafana trên chính VPS 1 GB = hệ giám sát chết đúng lúc nó có ích. Máy nhỏ: <code>node_exporter</code> hoặc 20 dòng đọc <code>/proc</code>.'), 'l') },

  /* ───────────── 9.2 ───────────── */
  { t: 'Trung bình 65 ms — không ai chờ 65 ms', body: two(
    term([
      '$ for i in $(seq 1000); do',
      '    curl -s -o /dev/null -w "%{time_total}\\n" \\',
      '         localhost/api/don',
      '  done > tre.txt',
      '$ bash pv.sh < tre.txt',
      '  n = 1000',
      '!   trung binh :     65.2 ms',
      '=   p50        :     18.4 ms',
      '  p90        :     24.2 ms',
      '!   p95        :    856.7 ms',
      '  p99        :    956.6 ms',
      '  max        :    984.6 ms',
      "$ awk '$1>0.5' tre.txt | wc -l",
      '52',
    ], { title: 'VPS thí nghiệm — app 5% chậm, qua nginx', fs: 13.5 }),
    `${kpis([
      { v: '18,4', l: 'ms — một NỬA người dùng (p50)', c: 'grn' },
      { v: '65,2', l: 'ms — trung bình trên bảng', c: 'vio' },
      { v: '856,7', l: 'ms — 1 trên 20 người (p95)', c: 'red' },
    ])}
    ${box('bad', 'Trung bình nằm trong <strong>khe trống</strong> giữa hai đám đông. Nó tốt hơn gấp 13 lần trải nghiệm tệ và tệ hơn gấp 3,5 lần trải nghiệm thường — và nó <strong>trấn an</strong>: 65 ms trông như API khoẻ.')}`, 'l') },

  { t: 'Hai đám đông, một khe trống ở giữa', body: histo() + box('info', 'Bước từ p90 = 24,2 ms lên p95 = 856,7 ms (gấp 35 lần trong 5 điểm phần trăm) là <strong>chữ ký của hai đường mã</strong>: đường nhanh và đường "phải làm việc đắt" (hụt cache, truy vấn nặng) — không phải một đường có độ tản.') },

  { t: 'Phân vị bằng sort + awk, không cần Prometheus', body: two(
    sh([
      ['#!/bin/bash   pv.sh  (đọc giây từ stdin)', ''],
      ["sort -n | awk '{ a[NR]=$1; t+=$1 }", 'xếp tăng, nhớ từng giá trị'],
      ['END { n=NR', ''],
      ['  printf "trung binh: %.1f ms\\n", t/n*1000', ''],
      ['  split("50 90 95 99", P, " ")', ''],
      ['  for (i=1; i<=4; i++) {', ''],
      ['    k=int(n*P[i]/100+0.999)', 'hạng làm tròn LÊN'],
      ['    printf "p%s: %.1f ms\\n", P[i], a[k]*1000', ''],
      ['  }', ''],
      ["  printf \"max: %.1f ms\\n\", a[n]*1000 }'", ''],
    ], { fs: 13.5 }),
    `${term([
      "$ grep -o ' rt=[0-9.]*' /var/log/nginx/dodo.log \\",
      '    | cut -d= -f2 | bash pv.sh',
      '  n = 1000',
      '  trung binh :     64.3 ms',
      '  p50        :     18.0 ms',
      '!   p95        :    856.0 ms',
      '# lượt trước chỉ 400 request (15 chậm = 3,75%):',
      '!   p95        :     31.4 ms',
    ], { title: 'VPS thí nghiệm — log nginx có rt=', fs: 12.5 })}
    ${box('warn', '<strong>Ít mẫu thì p95 nhảy:</strong> vách nằm sát 95% nên 400 mẫu cho 31 ms, 1.000 mẫu cho 857 ms. Báo cáo phân vị luôn kèm <strong>n</strong>.')}`, 'l') },

  { t: 'Không lấy trung bình các p95', body: two(
    term([
      '$ p95 tre.txt       # máy A: có đuôi chậm',
      '856.7',
      '$ p95 b.txt         # máy B: 948 request nhanh',
      '24.4',
      '# "p95 cả cụm" theo kiểu bảng tính:',
      '! trung binh hai p95: 440.6 ms',
      '# p95 THẬT, tính từ dữ liệu gộp:',
      '= p95 THAT cua ca hai: 25.9 ms',
    ], { title: 'VPS thí nghiệm — cùng dữ liệu, hai phép tính', fs: 14 }),
    `${box('bad', '<strong>440,6 ms là một con số không tồn tại</strong> — sai 17 lần so với 25,9 ms. Phân vị là tính chất của CẢ phân bố; cộng/chia hai phân vị không cho phân vị nào.')}
    ${box('tip', 'Hệ số đo nghiêm túc gửi <strong>thùng histogram</strong> (đếm số request mỗi khoảng ms) — thùng thì CỘNG được, rồi mới tính phân vị (Prometheus <code>histogram_quantile</code>).')}`, 'l') },

  { t: 'Đuôi 5% thành trải nghiệm của đa số', body: two(
    `${trangSvg()}${box('info', 'Xác suất <strong>mọi</strong> lời gọi đều nhanh = 0,95<sup>k</sup>. Một trang gọi 20 API ⇒ chỉ 35,8% lượt tải trang không dính lời gọi chậm nào.')}`,
    `${cards([
      { ic: '🔒', t: 'Đuôi giữ tài nguyên', d: '10 request × 900 ms chiếm kết nối/luồng lâu bằng 600 request × 15 ms — đuôi làm đầy bể kết nối trước.', c: 'red' },
      { ic: '📏', t: 'Báo theo p95 so tuần trước', d: '"p95 gấp đôi cùng giờ tuần trước" — không cần sửa ngưỡng mỗi lần ra tính năng.', c: 'grn' },
    ], 1)}`, 'l') },

  /* ───────────── 9.3 ───────────── */
  { t: 'Log thiếu trường: trả lời nhanh mà SAI', body: two(
    term([
      '# "URI nào trả 5xx VÀ chậm hơn 2 giây?" — 200.000 dòng',
      '--- tren log THUAN (combined) ---',
      '!     830 /api/v1/don',
      '!     817 /api/v1/nguoi-dung/42',
      '  → 82 ms  — VA khong tra loi duoc phan',
      "    'cham hon 2 giay': combined KHONG co thoi gian",
      '--- tren log JSON ---',
      '=      281 /api/v1/don',
      '=      280 /api/v1/nguoi-dung/42',
      '  → 538 ms',
    ], { title: 'Đo trong bài 9.3 (bài học gốc)', fs: 13 }),
    `${conf([
      ["log_format dodo '$remote_addr [$time_local] \"$request\" '", ''],
      ["    '$status $body_bytes_sent '", ''],
      ["    'rt=$request_time urt=$upstream_response_time '", 'tổng · phần của app'],
      ["    'rid=$request_id';", 'mã nối log'],
      ['access_log /var/log/nginx/dodo.log dodo;', ''],
      ['location /health { access_log off; … }', 'thăm dò: không ghi'],
      ['location / { proxy_pass http://127.0.0.1:8080;', ''],
      ['  proxy_set_header X-Request-Id $request_id; }', 'đưa mã cho app'],
    ], { fs: 13, lang: 'nginx' })}
    ${box('warn', 'Định dạng là quyết định nhỏ; <strong>trường</strong> mới là quyết định lớn: thời lượng, upstream, request id, phiên bản, người dùng. Thiếu từ trước sự cố = không có trong sự cố.')}`, 'l') },

  { t: 'Log JSON: hỏi như hỏi cơ sở dữ liệu', body: two(
    term([
      '$ journalctl -u app -o cat | jq -r \'select(.level=="error") | .path\'',
      '! jq: parse error: Invalid numeric literal at line 1, column 8',
      '$ journalctl -u app -o cat | grep -v "^{" | head -1',
      'Started app.service - Ung dung thu (Chuong 9).',
      "$ … | jq -R -r 'fromjson? | select(.level==\"error\") | .path' \\",
      '    | sort | uniq -c',
      '=      25 /api/don',
      "$ … | jq -R -r 'fromjson? | select(.status>=500 and .ms>500)",
      "    | [.ts,.status,.ms,.req_id[0:8]] | @tsv' | head -2",
      '2026-09-29T06:31:38\t500\t967.4\t61b63b4a',
      '2026-09-29T06:31:40\t500\t953.1\t52469d98',
    ], { title: 'VPS thí nghiệm — app ghi một dòng JSON mỗi request', fs: 12.5 }),
    `${table(['jq', 'Làm gì'], [
      ['<code>-R</code> + <code>fromjson?</code>', 'đọc dòng thô, BỎ QUA dòng không phải JSON'],
      ['<code>select(điều kiện)</code>', 'lọc như WHERE'],
      ['<code>.path</code> · <code>{status,ms}</code>', 'lấy trường / dựng đối tượng'],
      ['<code>@tsv</code> · <code>-r</code>', 'ra cột, không nháy — để sort/awk'],
      ['<code>-s</code> + <code>group_by(.status)</code>', 'gom cả luồng, đếm theo nhóm'],
    ], { sm: true })}
    ${box('bad', 'journal xen dòng của <strong>systemd</strong> ("Started …") vào log của app ⇒ <code>jq</code> thường chết ở dòng 1. Luôn <code>-R</code> + <code>fromjson?</code>.')}`, 'l') },

  { t: '-p err không thấy lỗi nào: journald không đọc JSON', body: two(
    term([
      '$ journalctl -u app -p err',
      '! -- No entries --',
      '$ journalctl -u app -o cat | grep -c \'"level": "error"\'',
      '= 25',
      "$ … | jq -R -s -c '[split(\"\\n\")[] | fromjson?]",
      "    | group_by(.status) | map({status: .[0].status, n: length})'",
      '[{"status":200,"n":1677},{"status":404,"n":3},{"status":500,"n":25}]',
    ], { title: 'VPS thí nghiệm — cùng 25 lỗi, hai cách hỏi', fs: 12.5 }),
    `${box('warn', 'Mọi dòng app in ra <strong>stdout</strong> đều vào journal ở mức <code>info</code> (6). Chữ "error" nằm TRONG JSON, journald không đọc. ⇒ <code>-p err</code> chỉ bắt lỗi của systemd, không bắt lỗi của bạn.')}
    ${table(['journalctl', 'Làm gì'], [
      ['<code>-u app</code>', 'một unit (hệ thống)'],
      ['<code>-t canh-vps.sh</code>', 'theo tên gắn trên dòng (SYSLOG_IDENTIFIER)'],
      ['<code>--since "10 min ago"</code>', 'khoảng thời gian'],
      ['<code>-p err</code>', 'mức ưu tiên ≤ err'],
      ['<code>-o cat</code> · <code>-o verbose</code>', 'chỉ thông điệp / mọi trường'],
      ['<code>-g REGEX</code> · <code>-f</code>', 'lọc chữ / theo dõi'],
    ], { sm: true })}`, 'l') },

  { t: 'Một request id nối nginx với ứng dụng', body: diagram({
    w: 1150, h: 200,
    nodes: [
      { id: 'u', x: 0, y: 60, w: 160, h: 80, t: 'client', d: 'GET /api/don', c: 'dim', mono: true },
      { id: 'n', x: 290, y: 50, w: 300, h: 100, t: 'nginx', d: '$request_id = a75910b2…\nghi rid= vào access log', c: 'dv', mono: true },
      { id: 'a', x: 780, y: 50, w: 360, h: 100, t: 'app.py :8080', d: 'đọc X-Request-Id\nghi "req_id" vào log JSON', c: 'grn', mono: true },
    ],
    edges: [
      { from: 'u', to: 'n', t: ':80', c: 'dim', off: 8 },
      { from: 'n', to: 'a', t: 'X-Request-Id', c: 'grn', off: 8 },
    ],
  }) + term([
    "$ grep rid=$R /var/log/nginx/dodo.log | awk '{print $5, $7, $9, $10}'",
    '/api/don 500 rt=0.983 urt=0.983',
    "$ journalctl -u app -o cat | grep $R | jq -c '{ts,level,status,ms,ban}'",
    '{"ts":"2026-09-29T06:38:13","level":"error","status":500,"ms":967.8,"ban":"v42"}',
  ], { title: 'VPS thí nghiệm — R=a75910b2170a38a1ef461963b0a69268 (một request 500)', fs: 14 }) +
    box('tip', 'Một mã, hai nơi: nginx nói <strong>983 ms</strong>, app nói <strong>967,8 ms</strong> ⇒ ~15 ms ở proxy/kết nối, còn lại là của app. Kèm <code>"ban"</code> thì "có phải từ lần deploy?" thành một câu truy vấn.') },

  { t: 'Log có đó mà lệnh tìm không thấy', body: two(
    `${term([
      '$ docker logs dv09-api | grep -c -i error',
      'Error: loading shared library libssl.so.3',
      '! 0',
      '$ docker logs dv09-api 2>&1 | grep -c -i error',
      '= 1',
    ], { title: 'Mac — docker logs tách stderr ra riêng', fs: 13 })}
    ${box('warn', '<code>docker logs</code> trả stdout của container ra stdout, <strong>stderr ra stderr</strong> ⇒ lỗi hiện trên màn hình nhưng đi VÒNG qua ống <code>|</code>. Luôn <code>2&gt;&amp;1</code>.')}`,
    `${term([
      '# unit --user, script in lỗi qua | tr (tiến trình con)',
      '$ journalctl --user -u canh-vps -g HONG | wc -l',
      '! 0',
      '$ journalctl --user -t canh-vps.sh -g HONG | wc -l',
      '= 6',
      '$ … -o verbose | grep -E "_LINE_BREAK|MESSAGE"',
      '    _LINE_BREAK=pid-change',
      '    MESSAGE=HONG: 1 container da CHET (exited) Dia 91%',
      '# sửa bằng printf dựng sẵn: -u thấy 5/6',
    ], { title: 'VPS thí nghiệm — 6 lần chạy canh-vps.service', fs: 12.5 })}
    ${box('bad', 'Tiến trình con thoát trước khi journald tra ra nó thuộc unit nào ⇒ dòng <strong>mất nhãn unit</strong>, <code>-u</code> bỏ qua. Máy nhà thật: <code>-u</code> 0 dòng, <code>-t</code> 264 dòng trong một ngày.')}`) },

  /* ───────────── 9.4 ───────────── */
  { t: 'Ngưỡng 90% cho 5 giờ, xu hướng cho 24 giờ', body: diaSvg() + two(
    sh([
      ['echo "$(date +%s) $(df --output=used /srv | tail -1)" >> dia.dat', ''],
      ["awk -v tong=\"$TONG\" '{t[NR]=$1; u[NR]=$2} END {", ''],
      ['  dt=t[NR]-t[1]; du=u[NR]-u[1]; if (du<=0) exit', 'không tăng: im'],
      ['  printf "day sau %.1f gio\\n", (tong-u[NR])/(du/dt)/3600 }\' dia.dat', ''],
    ], { fs: 12.5, so: false }),
    box('warn', 'Đĩa thật lên xuống (build ghi 2 GB rồi xoá). Khớp trên <strong>vài giờ</strong>, đòi dự đoán giữ qua <strong>hai</strong> lần, không báo trên chuỗi giảm. Prometheus: <code>predict_linear</code>.'), 'l2') },

  { t: 'Báo khi TẬP LỖI đổi, không phải mỗi 5 phút', body: two(
    sh([
      ['LOI=$(awk -v now="$NOW" \'', 'bỏ lỗi "đã biết" còn hạn'],
      ['  BEGIN { while ((getline l < "da-biet.txt") > 0) {', ''],
      ['    split(l, a, "|"); if (now < a[2]) im[a[1]]=1 } }', ''],
      ["  { for (k in im) if (index($0, k)) next; print }' loi.txt)", ''],
      ['van_tay() { sed -E \'s/[0-9]+/N/g\' | md5sum | cut -c1-8; }', 'bỏ CON SỐ'],
      ['CU=; LUC=0', ''],
      ['[ -f tt/dang-hong ] && read -r CU LUC < tt/dang-hong', 'lần báo trước'],
      ['if [ -n "$LOI" ]; then', ''],
      ['  V=$(printf \'%s\' "$LOI" | van_tay)', ''],
      ['  if [ "$V" != "$CU" ] || [ $((NOW-LUC)) -ge "$NHAC" ]; then', 'đổi, HOẶC đủ 6h'],
      ['    gui "HONG: $(echo $LOI)"; echo "$V $NOW" > tt/dang-hong', ''],
      ['  else echo "  (im lang: …)"; fi', ''],
      ['elif [ -f tt/dang-hong ]; then', 'hết lỗi'],
      ['  gui "DA BINH THUONG LAI"; rm -f tt/dang-hong', 'báo cả lúc KHỎI'],
      ['fi', ''],
    ], { fs: 12.5 }),
    `${table(['Luật', 'Vì sao'], [
      ['Chỉ gửi khi tập lỗi <strong>đổi</strong>', '5,5 phút/lần × 1 ngày = 262 tin nếu gửi mỗi lần'],
      ['<strong>Nhắc lại</strong> sau N giờ', 'lỡ tắt điện thoại vẫn biết còn hỏng'],
      ['Báo cả lúc <strong>khỏi</strong>', 'không ai phải đoán "xong chưa?"'],
      ['<strong>Tạm im có hạn</strong>', 'lỗi đã biết không che lỗi mới'],
      ['Tin nhắn nói <strong>làm gì</strong>', 'tên lệnh / trang sổ tay'],
    ], { sm: true })}`, 'l2') },

  { t: 'Vân tay chứa con số = báo lại mỗi khi số đổi', body: two(
    term([
      '# 12 lần kiểm, 5,5 phút/lần: job chết + đĩa 90→95%',
      '$ VT=day_du bash mophong.sh',
      '! lan  1  t=  0p   -> GUI: HONG: 1 container da CHET (exited) Dia VPS 90%',
      'lan  2  t=  5p   (im lang: da bao 5 phut truoc)',
      '! lan  3  t= 11p   -> GUI: HONG: 1 container da CHET (exited) Dia VPS 91%',
      '  …',
      '! lan 11  t= 55p   -> GUI: HONG: 1 container da CHET (exited) Dia VPS 95%',
      '!   == webhook nhan: 6 tin',
      '$ VT=khoa bash mophong.sh',
      'lan  1  t=  0p   -> GUI: HONG: 1 container da CHET (exited) Dia VPS 90%',
      'lan  2  t=  5p   (im lang: da bao 5 phut truoc)',
      '  …',
      'lan 12  t= 60p   (im lang: da bao 60 phut truoc)',
      '=   == webhook nhan: 1 tin',
    ], { title: 'VPS thí nghiệm — webhook GIẢ 127.0.0.1:9099', fs: 12.5 }),
    `${kpis([
      { v: '6', l: 'tin/giờ — vân tay cả con số', c: 'red' },
      { v: '1', l: 'tin/giờ — vân tay bỏ con số', c: 'grn' },
    ])}
    ${box('info', '<strong>Webhook giả</strong> = 12 dòng Python nhận POST, ghi <code>hook.log</code>, trả 200. Thử đường báo mà không làm phiền ai, không lộ token thật.')}
    ${box('warn', 'Bỏ con số cũng có giá: đĩa 90% → 95% không báo thêm. Mức NẶNG hơn (≥ 95%) nên là <strong>một lỗi khác tên</strong>.')}`, 'l') },

  { t: 'Một ngày của bộ báo: nhắc, lỗi mới, tạm im', body: term([
    '$ bash mophong2.sh',
    '! 00:00    container job chet                  -> GUI: HONG: 1 container da CHET (exited)',
    '00:05    van chet                            (im lang: da bao 5 phut truoc)',
    '! 06:00    van chet - du 6 tieng               -> GUI: HONG: 1 container da CHET (exited)',
    '! 06:05    them: dia 91%                       -> GUI: HONG: 1 container da CHET (exited) Dia VPS 91%',
    '06:11    dia 92% (chi so doi)                (im lang: da bao 6 phut truoc)',
    '! 06:16    ghi da-biet (im 3 ngay)             -> GUI: HONG: Dia VPS 92%',
    '= 06:22    don dia xong                        -> GUI: DA BINH THUONG LAI',
    '  == webhook nhan: 5 tin',
  ], { title: 'VPS thí nghiệm — thời gian giả lập bằng biến NOW', fs: 14 }) + two(
    box('good', '<strong>5 tin cho một ngày có 3 sự kiện thật</strong>: hỏng, vẫn hỏng sau 6 giờ, thêm lỗi mới, và lúc khỏi. Mỗi tin đều đáng đọc.'),
    box('warn', '"Bình thường lại" ở 06:22 vẫn còn một lỗi đang <strong>tạm im</strong> — hết 3 ngày nó tự kêu lại. Im lặng <strong>không hạn</strong> là tắt hẳn một phép kiểm.')) },

  { t: 'Bộ kiểm hỏng thì im lặng trông như xanh', body: two(
    `${term([
      '# bản đầu: awk đọc da-biet.txt như TỆP THỨ NHẤT',
      "#   awk 'NR==FNR{…; next} …' da-biet.txt loi.txt 2>/dev/null",
      '$ VT=day_du bash mophong.sh     # chưa có da-biet.txt',
      'lan  1  t=  0p   ok',
      'lan  2  t=  5p   ok',
      '  …',
      'lan 12  t= 60p   ok',
      '! mophong.sh: line 8: hook.log: No such file or directory',
      '  == webhook nhan:  tin',
    ], { title: 'VPS thí nghiệm — thiếu tệp ⇒ LOI rỗng ⇒ "ok"', fs: 12.5 })}
    ${box('bad', 'awk lỗi vì thiếu tệp, <code>2&gt;/dev/null</code> nuốt lỗi, <code>LOI</code> rỗng ⇒ 12 lần "ok" trong khi container chết. Tệp rỗng cũng hỏng: <code>NR==FNR</code> đúng suốt tệp thứ hai.')}`,
    `${term([
      '$ MA=$(curl -s -o /dev/null -w "%{http_code}" \\',
      '      --max-time 3 $U || echo 000); echo "[$MA]"',
      '! [000000]',
      '$ curl -s -o /dev/null -w "%{http_code}" $U; echo " exit=$?"',
      '000 exit=7',
      '$ MA=$(curl -s -o /dev/null -w "%{http_code}" $U)',
      '$ echo "[${MA:-000}]"',
      '= [000]',
    ], { title: 'VPS thí nghiệm — cổng 9 không ai nghe', fs: 12.5 })}
    ${box('warn', 'curl đã in <code>000</code> rồi thoát 7 ⇒ <code>|| echo 000</code> nối thêm ⇒ <strong>"000000"</strong>. Đúng dòng này nằm trong bộ canh thật: 314 lần kiểm ghi "HTTP 000000".')}`) },

  /* ───────────── 9.5 ───────────── */
  { t: '/health 200 trong khi trang chủ 502', body: two(
    `${conf([
      ['server {', ''],
      ['    listen 8081;', ''],
      ['    location /health { proxy_pass http://127.0.0.1:8080; }', 'đúng'],
      ['    location /       { proxy_pass http://127.0.0.1:8099; }', 'CỔNG SAI'],
      ['}', ''],
    ], { fs: 14, lang: 'nginx' })}
    ${term([
      '$ for u in 8080/health 8080/ 8081/health 8081/; do …',
      '  127.0.0.1:8080/health    → 200',
      '  127.0.0.1:8080/          → 200',
      '  127.0.0.1:8081/health    → 200',
      '!   127.0.0.1:8081/          → 502',
    ], { title: 'VPS thí nghiệm — nginx 1.24', fs: 13.5 })}`,
    `${box('bad', 'App khoẻ, proxy chạy, <code>/health</code> <strong>200 qua đúng proxy</strong> — và trang chủ 502. Phép kiểm và cú hỏng ở <strong>hai khối location</strong> khác nhau ⇒ kiểm <code>/health</code> gắt tới đâu cũng không thấy.')}
    ${table(['Hỏng ở đây', '/health 127.0.0.1 thấy?'], [
      ['location trỏ sai upstream', '-không'],
      ['chứng chỉ TLS hết hạn', '-không (không đi qua TLS)'],
      ['DNS trỏ IP cũ · tường lửa đóng 443', '-không'],
      ['cả máy mất mạng', '-không — và không báo được ai'],
    ], { sm: true })}`, 'l') },

  { t: 'Mã 200 chưa chứng minh trang chạy', body: two(
    term([
      '$ sudo touch /srv/app/CSDL_HONG      # giả lập mất CSDL',
      '$ curl -s -o /dev/null -w "%{http_code}" localhost/',
      '! 200',
      '$ curl -sf localhost/ >/dev/null; echo exit=$?',
      '! exit=0',
      "$ curl -s localhost/ | grep -q 'id=\"trang-chu\"' \\",
      '    || echo "TRANG CHU HONG"',
      '= TRANG CHU HONG',
      '$ echo | openssl s_client -connect vidu.test:443 \\',
      '    -servername vidu.test 2>/dev/null \\',
      '  | openssl x509 -noout -checkend $((14*86400))',
      '! Certificate will expire',
    ], { title: 'VPS thí nghiệm — trang lỗi vẫn trả 200', fs: 13 }),
    `${cards([
      { ic: '🔎', t: 'Kiểm NỘI DUNG', d: '<code>grep</code> một thứ chỉ trang chạy được mới có. Cờ <code>-f</code> của curl chỉ bắt mã 4xx/5xx.', c: 'grn' },
      { ic: '🌐', t: 'Tên miền THẬT', d: 'đi qua DNS, TLS, tường lửa, proxy — bốn thứ <code>127.0.0.1</code> không thấy.', c: 'blu' },
      { ic: '📄', t: 'Trang THẬT', d: 'trang chủ + một route dữ liệu (401/200 = có, 404 = ảnh cũ).', c: 'vio' },
      { ic: '🔐', t: 'Hạn chứng chỉ', d: '<code>-checkend N</code> thoát 1 khi còn ít hơn N giây. Nhớ gửi tên máy (SNI).', c: 'amb' },
    ], 2)}`, 'l') },

  { t: 'Canh từ BÊN NGOÀI: máy nhà canh VPS', body: diagram({
    w: 1150, h: 300,
    nodes: [
      { id: 'm', x: 0, y: 90, w: 300, h: 120, t: 'máy nhà (Fedora)', d: 'canh-vps.timer (--user)\nmỗi 5 phút + AccuracySec 30s\nđo thật: cách nhau 5 phút 30 giây', c: 'dv' },
      { id: 'w', x: 470, y: 0, w: 320, h: 100, t: 'Internet → cuongthai.com', d: '/ · /api/v1/system/health\n/api/v1/feed/posts · TLS', c: 'grn', mono: true },
      { id: 's', x: 470, y: 190, w: 320, h: 100, t: 'SSH khoá CHỈ ĐỌC', d: 'lệnh ép: tinh-trang\nđĩa · container · tuổi backup', c: 'amb', mono: true },
      { id: 't', x: 900, y: 95, w: 250, h: 110, t: 'Telegram bot', d: 'chỉ khi tập lỗi ĐỔI\nnhắc lại sau 6 giờ\nbáo khi bình thường', c: 'vio' },
    ],
    edges: [
      { from: 'm', to: 'w', t: 'curl', c: 'grn', off: 8 },
      { from: 'm', to: 's', t: 'ssh', c: 'amb', off: 8 },
      { from: 'm', to: 't', t: 'khi hỏng', c: 'vio', off: 8 },
    ],
  }) + two(
    box('info', '<strong>Vì sao không dùng <code>monitor.sh</code> trên VPS:</strong> nó chạy TRÊN máy cần canh (VPS chết thì nó chết theo), và 18/08 nó <strong>không có kênh báo nào sống</strong> — token trống, không cài <code>mail</code>: phát hiện được, không nói được với ai.'),
    conf([
      ['[Timer]', ''],
      ['OnBootSec=3min', ''],
      ['OnUnitActiveSec=5min', 'tính từ lần chạy trước'],
      ['AccuracySec=30s', 'cho phép trễ tới 30 s'],
    ], { fs: 14 }), 'l') },

  { t: 'canh-vps.sh: sáu phép kiểm, một kênh báo', body: two(
    table(['Kiểm', 'Báo khi', 'Vì sao có'], [
      ['<code>GET /</code> qua Internet', 'mã ≠ 200', 'cửa trước thật'],
      ['<code>/api/v1/system/health</code>', 'không phải 200/401', 'backend sống'],
      ['<code>/api/v1/feed/posts</code>', 'không phải 200/401', '02/07: route mới 404 = ảnh cũ'],
      ['hạn chứng chỉ TLS', '&lt; 14 ngày', 'gia hạn tự động hỏng câm'],
      ['đĩa VPS (qua SSH)', '≥ 90%', '18/08: đĩa đầy giữa build'],
      ['container', 'không khoẻ · <strong>Exited</strong> · &lt; 6 chạy', 'restart vô tận, chết im'],
      ['tuổi bản backup', '&gt; 26 giờ', 'backup chết câm 62 ngày'],
    ], { sm: true }),
    `${sh([
      ['TT=$(ssh -i ~/.ssh/keo_backup -o BatchMode=yes \\', 'khoá bị ÉP lệnh'],
      ['        -o ConnectTimeout=15 "$VPS_SSH" tinh-trang)', ''],
      ['get() { echo "$TT" | grep "^$1=" | cut -d= -f2-; }', 'đọc khoa=giá trị'],
      ['CHET=$(get container_chet)', ''],
      ['[ "$CHET" -gt 0 ] && them "$CHET container da CHET (exited)"', ''],
    ], { fs: 12.5, so: false })}
    ${box('tip', 'Khoá SSH của máy canh chỉ chạy được <strong>một lệnh chỉ đọc</strong> trên VPS (<code>command=</code> trong <code>authorized_keys</code> của VPS) ⇒ máy nhà bị chiếm cũng không phá được VPS.')}`, 'r') },

  { t: '26 ngày đỏ vì một container job bị quên', body: canhSvg() + two(
    kpis([
      { v: '6.517', l: 'lần kiểm có "container da CHET"', c: 'red' },
      { v: '602', l: 'tin Telegram 03/09 → 29/09', c: 'dv' },
      { v: '201', l: 'cú chập đúng MỘT lần kiểm', c: 'vio' },
    ]),
    box('bad', 'Container của một job phân loại đề thi dừng rồi <strong>nằm lại</strong> (không <code>--rm</code>) ⇒ <code>container_chet</code> = 1 suốt 26 ngày. Kênh "luôn đỏ" ấy chở cả tin THẬT: TLS 0 ngày, đĩa 100%. Xoá container 29/09 ⇒ 02:00 xanh lại.'), 'l') },

  { t: 'Chọn công cụ: tự viết, Uptime Kuma, Prometheus', body: table(['Công cụ', 'Là gì', 'Hợp khi', 'Giá trên VPS nhỏ'], [
    ['<strong>cron/timer + curl + webhook</strong>', '30–150 dòng bash (chương này)', '1–2 máy, muốn hiểu từng dòng', '+gần 0 — chạy ở máy KHÁC'],
    ['<strong>Uptime Kuma</strong> (2021, bản 2.5.5 · 16/09/2026)', 'giao diện web tự host: HTTP, từ khoá, TCP, DNS, Docker, TLS; 90+ kênh báo (có Telegram)', 'muốn bảng trạng thái + báo, không viết code', 'một container Node; đặt ở máy khác'],
    ['<strong>Prometheus + Grafana</strong> (2012 · 2014)', 'kéo số đo, lưu chuỗi thời gian, PromQL, <code>predict_linear</code>, histogram', 'nhiều máy/dịch vụ, cần đồ thị và SLO', '!nặng — đừng đặt cạnh app trên 1 GB'],
    ['<strong>Netdata</strong>', 'agent số đo mỗi GIÂY + bảng tại <code>:19999</code>', 'soi sự cố ĐANG xảy ra trên một máy', '!~5% CPU, ~150 MB RAM (hãng công bố)'],
    ['<strong>node_exporter</strong>', 'chỉ xuất số đo máy cho Prometheus', 'có Prometheus ở NƠI KHÁC', 'nhẹ'],
  ], { sm: true }) + box('tip', 'Học tiếp: khoá <strong>Observability &amp; Monitoring</strong> trên site (log có cấu trúc, chỉ số, trace, cảnh báo, SLO). Chương này chỉ lo phần bạn cần ngay khi vừa deploy.') },

  { t: 'Sai lầm hay gặp khi giám sát', body: table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['Báo động theo load average', 'trễ cả phút: 0,10 khi CPU đã 100%', 'CPU từ <code>/proc/stat</code>, PSI'],
    ['Nhìn độ trễ TRUNG BÌNH', '65 ms trong khi 1/20 chờ 857 ms', 'p50/p95/p99 + số mẫu n'],
    ['Lấy trung bình p95 của nhiều máy', '440,6 ms thay cho 25,9 ms thật', 'gộp dữ liệu / thùng histogram'],
    ['Log không có thời lượng, request id', 'câu hỏi sự cố không trả lời được', '<code>rt=</code> <code>urt=</code> <code>rid=</code> trong log_format'],
    ['<code>journalctl -p err</code> cho log JSON', '"-- No entries --" dù có 25 lỗi', '<code>jq -R \'fromjson? | select(…)\'</code>'],
    ['<code>docker logs X | grep</code>', 'stderr đi vòng qua ống: 0 dòng', '<code>docker logs X 2&gt;&amp;1 | grep</code>'],
    ['Báo mỗi lần kiểm / vân tay có con số', '262 tin/ngày; 602 tin trong 26 ngày', 'báo khi tập lỗi đổi + nhắc 6 giờ'],
    ['<code>2&gt;/dev/null</code>, <code>|| echo 000</code> trong bộ kiểm', 'xanh giả, "000000"', 'thử cả đường HỎNG của bộ kiểm'],
    ['Chỉ kiểm <code>/health</code> từ trong máy', '200 trong khi trang chủ 502', 'trang thật + nội dung, từ máy khác'],
    ['Job container không <code>--rm</code>', 'Exited nằm đó, kêu 26 ngày', '<code>docker run --rm</code>, đếm chỉ Exited ≠ 0'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): đo và đọc log', body: two(
    sh([
      ['cat /proc/loadavg /proc/pressure/cpu', 'tải + PSI'],
      ['bash cpu.sh', 'CPU bận/steal (2 lần đọc)'],
      ["grep MemAvailable /proc/meminfo", 'RAM còn dùng được'],
      ['df -h / ; df -i /', 'đĩa VÀ inode'],
      ["curl -s -o /dev/null -w '%{time_total}\\n' URL", 'thời gian 1 request'],
      ['bash pv.sh < tre.txt', 'trung bình + p50…p99'],
      ['journalctl -u app --since "1 hour ago"', 'log một unit'],
      ['journalctl --user -t canh-vps.sh -g HONG', 'theo tên, không theo unit'],
      ["journalctl -u app -o cat | jq -R 'fromjson? | …'", 'hỏi log JSON'],
      ['docker logs --since 10m -t X 2>&1 | grep -i err', 'log container, cả stderr'],
      ['docker ps -a --filter status=exited', 'container đã chết/xong'],
      ['grep rid=MA /var/log/nginx/*.log', 'lần theo một request'],
    ], { fs: 13.5 }),
    table(['Thấy', 'Nghĩa là'], [
      ['load thấp mà app chậm', 'nhìn PSI, <code>steal</code>, I/O'],
      ['<code>steal</code> vài % trở lên', 'hàng xóm trên máy ảo — hỏi nhà cung cấp'],
      ['p90 → p95 nhảy vọt', 'hai đường mã; tìm đường chậm'],
      ['<code>rt</code> lớn, <code>urt</code> nhỏ', 'chậm ở proxy/mạng, không phải app'],
      ['jq "Invalid numeric literal"', 'có dòng không phải JSON'],
      ['<code>Exited (0)</code>', 'job xong — xoá, đừng đếm là chết'],
      ['<code>Exited (1)</code>/<code>(137)</code>', 'chết thật / bị giết (OOM, SIGKILL)'],
    ], { sm: true }), 'l') },

  { t: 'Bảng tra nhanh (2/2): báo động và canh ngoài', body: two(
    sh([
      ["curl -s URL | grep -q 'id=\"trang-chu\"' || bao", 'kiểm NỘI DUNG'],
      ["MA=$(curl -s -o /dev/null -w '%{http_code}' URL)", 'mã HTTP (000 = không nối)'],
      ['echo | openssl s_client -connect H:443 -servername H \\', ''],
      ['  2>/dev/null | openssl x509 -noout -enddate', 'hạn chứng chỉ'],
      ['… | openssl x509 -noout -checkend $((14*86400))', 'thoát 1 nếu < 14 ngày'],
      ["df --output=pcent,used,size / | tail -1", 'số cho script'],
      ["curl -s -d '{\"text\":\"x\"}' http://127.0.0.1:9099/hook", 'thử webhook GIẢ'],
      ['systemctl --user list-timers', 'bộ canh có chạy không'],
      ['journalctl --user -u canh-vps -n 20', 'lần kiểm gần nhất'],
    ], { fs: 13.5 }),
    table(['Báo khi', 'Kiểu'], [
      ['trang thật hỏng, từ máy khác', 'nội dung, 2 lần liên tiếp'],
      ['đĩa đầy trong &lt; 24 giờ', 'xu hướng (+ inode)'],
      ['có thứ bị OOM giết', 'bộ đếm tăng'],
      ['TLS còn &lt; 14–21 ngày', 'đếm ngược'],
      ['5xx &gt; 1% trong 5 phút', 'tỷ lệ trên cửa sổ'],
      ['backup cũ hơn 26 giờ', 'tuổi tệp'],
      ['<strong>mỗi tháng: một báo động THỬ</strong>', 'kênh còn sống?'],
    ], { sm: true }), 'l') },

  { t: 'Thực hành chương 9 (45 phút, VPS thí nghiệm)', body: table(['Bước', 'Làm gì', 'Đạt khi'], [
    ['<strong>1. Đo CPU</strong> · 7′', 'chạy <code>cpu.sh</code> rảnh và khi 14 vòng bận; đọc <code>/proc/pressure/cpu</code> + <code>/proc/loadavg</code>', 'nói được vì sao load thấp hơn tải thật'],
    ['<strong>2. Phân vị</strong> · 10′', 'app 5% chậm sau nginx; 1.000 curl; <code>pv.sh</code>; làm lại với 400', 'có trung bình, p50, p95 và giải thích p95 nhảy'],
    ['<strong>3. Log</strong> · 10′', '<code>-p err</code> vs <code>jq fromjson?</code>; lần theo một <code>rid</code> 500 qua nginx và app', '+hai con số lỗi khớp nhau; thấy rt và ms'],
    ['<strong>4. Báo động</strong> · 10′', 'webhook giả + <code>bao.sh</code>; <code>mophong.sh</code> hai kiểu vân tay; <code>mophong2.sh</code>', '+1 tin thay vì 6; có tin "bình thường lại"'],
    ['<strong>5. Cửa trước</strong> · 8′', 'location sai cổng; <code>CSDL_HONG</code>; chứng chỉ 10 ngày + <code>-checkend</code>', '/health 200 mà / 502; grep bắt trang lỗi 200'],
  ], { sm: true }) + two(
    box('info', '<strong>VPS thí nghiệm:</strong> container <code>dv09-vps</code> (Ubuntu 24.04 + systemd + sshd + nginx), SSH qua <code>127.0.0.1:19092</code> — lệnh dựng ở 🧪 bài 9.1. Xong: <code>docker rm -f dv09-vps</code>.'),
    box('warn', 'Webhook luôn là bản <strong>giả</strong> trong container. Đừng dán token bot thật vào script mẫu, và đừng bắn tải thử vào máy chủ THẬT.')) },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
