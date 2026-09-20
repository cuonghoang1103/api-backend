/**
 * _nwc-chung.mjs — phần dùng chung cho các deck slide của NWC204 (Mạng máy tính).
 *
 * ⚠️ CSS nhúng thẳng vào body của từng slide, KHÔNG sửa `_render-slides.mjs`:
 * file dựng đó dùng chung cho MAE101 / SWR302 / SWT301 / Web Foundations, đụng
 * vào là ảnh hưởng cả các môn đã render xong. (Đã thử sửa rồi hoàn tác 20/09/2026.)
 *
 * ⚠️ Mọi selector ở đây đều có tiền tố `.nw-` hoặc nằm trong `.nw`, để không thể
 * đè lên class của bộ dựng chung (`.dg`, `.lanes`, `.box`, `table.t`…) hay của
 * `_wf-chung.mjs` (`.vs`). Đặc biệt KHÔNG dùng selector `code` trơn — nó sẽ phá
 * khối mã tối màu của bộ Web Foundations.
 *
 * Slide của môn này viết HOÀN TOÀN BẰNG TIẾNG ANH (yêu cầu của người học), phần
 * giảng tiếng Việt nằm ở bài học bên dưới ảnh slide.
 */
import hljs from 'highlight.js';

export const CSS = `<style>
/* ── chồng tầng OSI / TCP-IP ── */
.nw-stack{display:flex;flex-direction:column;gap:6px}
.nw-stack .ly{display:grid;grid-template-columns:54px 1.1fr 1.5fr;align-items:center;gap:12px;
  border:2px solid #cfe2f5;border-radius:8px;background:#f7fbff;padding:9px 13px;font-size:20px}
.nw-stack .ly i{font-style:normal;font-weight:800;color:#fff;background:#8aa0b6;border-radius:6px;
  text-align:center;padding:4px 0;font-size:17px}
.nw-stack .ly b{font-weight:800;color:#0f2a4a}
.nw-stack .ly u{text-decoration:none;font-size:18px;color:#5d7288}
.nw-stack .ly.on{border-color:#1b5fa8;background:#eaf3fc;box-shadow:0 0 0 2px #d3e6f8}
.nw-stack .ly.on i{background:#1b5fa8}
/* ── cấu trúc gói tin / khung ── */
.nw-pkt{display:flex;border:2.5px solid #1b5fa8;border-radius:8px;overflow:hidden;font-size:17px}
.nw-pkt .fl{flex:1;border-right:1.5px solid #cfe2f5;padding:9px 6px;text-align:center;background:#fff;line-height:1.3}
.nw-pkt .fl:last-child{border-right:none}
.nw-pkt .fl b{display:block;font-weight:800;color:#0f2a4a;font-size:18px}
.nw-pkt .fl u{text-decoration:none;display:block;color:#6b8199;font-size:15px;margin-top:2px}
.nw-pkt .fl.hl{background:#fff5d6}
.nw-pkt .fl.pay{background:#eefaf4}
/* ── đóng gói lồng nhau ── */
.nw-encap .en{border:2.5px solid #1b5fa8;border-radius:9px;padding:9px;background:#f7fbff}
.nw-encap .en>.lb{font-size:16px;font-weight:800;color:#1b5fa8;text-transform:uppercase;
  letter-spacing:.6px;margin-bottom:6px}
.nw-encap .en .en{border-color:#2b86c5;background:#fff}
.nw-encap .en .en .en{border-color:#1f9d6b;background:#f4fbf7}
.nw-encap .en .en .en>.lb{color:#1f9d6b}
.nw-encap .en .en .en .en{border-color:#b4690e;background:#fffaf0}
.nw-encap .en .en .en .en>.lb{color:#b4690e}
/* ── luồng gói giữa hai đầu (bắt tay, hỏi đáp) ── */
.nw-flow{display:flex;flex-direction:column;gap:9px;font-size:19px}
.nw-flow .ends{display:flex;justify-content:space-between;font-size:20px;font-weight:800;color:#1b5fa8}
.nw-flow .hop{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px}
.nw-flow .hop .ln{height:0;border-top:2.5px solid #1b5fa8;position:relative}
.nw-flow .hop .ln.r::after{content:"";position:absolute;top:-7px;right:-1px;
  border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:11px solid #1b5fa8}
.nw-flow .hop .ln.l::before{content:"";position:absolute;top:-7px;left:-1px;
  border-top:6px solid transparent;border-bottom:6px solid transparent;border-right:11px solid #1b5fa8}
.nw-flow .hop .tag{font-size:17px;font-weight:700;color:#0f2a4a;background:#eef5fc;border:1.5px solid #cfe2f5;
  border-radius:20px;padding:5px 13px;white-space:nowrap}
.nw-flow .hop>.tag:first-child{justify-self:end}
.nw-flow .hop>.tag:last-child{justify-self:start}
.nw-flow .hop .no{font-size:16px;color:#6b8199;text-align:center}
/* ── topology ── */
.nw-topo{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;font-size:18px}
.nw-topo .nd{border:2.5px solid #1b5fa8;border-radius:10px;background:#fff;padding:10px 14px;
  text-align:center;min-width:112px}
.nw-topo .nd b{display:block;font-size:19px;color:#0f2a4a}
.nw-topo .nd u{text-decoration:none;display:block;font-size:15px;color:#6b8199}
.nw-topo .nd.rt{border-radius:50%;padding:15px 17px}
.nw-topo .nd.cl{border-color:#6b8199}
.nw-topo .lk{display:flex;flex-direction:column;align-items:center;min-width:92px}
.nw-topo .lk .w{height:0;border-top:2.5px solid #5d7288;width:100%}
.nw-topo .lk small{font-size:14px;color:#6b8199;margin-top:3px;text-align:center;line-height:1.25}
/* ── terminal / cấu hình thiết bị ── */
.nw-term{background:#11243d;color:#e6eef8;border-radius:9px;padding:13px 16px;font-size:18px;line-height:1.5;
  font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;text-align:left;overflow:hidden;
  white-space:pre-wrap}
.nw-term.sm{font-size:16px;line-height:1.45;padding:11px 14px}
.nw-term .p{color:#7ad0c7}
.nw-term .c{color:#8aa0b6;font-style:italic}
.nw-term .k{color:#ffd479}
.nw-term .g{color:#8fe3a8}
.nw-term .r{color:#ff9d9d}
/* ── mã tô màu VS Code Dark+ (khối riêng, không đè .vs của Web Foundations) ── */
.nw-code{background:#1e1e1e;border-radius:9px;padding:13px 16px;font-size:18px;line-height:1.5;
  color:#d4d4d4;font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;text-align:left;overflow:hidden}
.nw-code.sm{font-size:16px;line-height:1.45;padding:11px 14px}
.nw-code .hljs-keyword{color:#569cd6}.nw-code .hljs-string{color:#ce9178}
.nw-code .hljs-number{color:#b5cea8}.nw-code .hljs-comment{color:#6a9955;font-style:italic}
.nw-code .hljs-title{color:#dcdcaa}.nw-code .hljs-built_in{color:#4ec9b0}
.nw-code .hljs-literal{color:#569cd6}.nw-code .hljs-variable,.nw-code .hljs-attr{color:#9cdcfe}
.nw-code .hljs-meta{color:#9cdcfe}.nw-code .hljs-section{color:#dcdcaa}
/* ── mảnh nhỏ ── */
.nw-kv{display:grid;grid-template-columns:auto 1fr;gap:7px 16px;font-size:20px;align-items:baseline}
.nw-kv b{font-weight:800;color:#1b5fa8;white-space:nowrap}
.nw-kv span{color:#25405e}
.nw-m{font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;font-size:.93em;
  background:#eef5fc;border-radius:4px;padding:1px 5px;color:#123a63}
.nw-bits{width:100%;border-collapse:collapse;font-size:19px;
  font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace}
.nw-bits th,.nw-bits td{border:1.5px solid #cfe0f0;padding:7px 4px;text-align:center}
.nw-bits th{background:#eef5fc;color:#1b5fa8;font-weight:700;font-size:16px}
.nw-bits td.one{background:#fff5d6;font-weight:800;color:#0f2a4a}
.nw-bits td.zero{color:#9bb0c4}
.nw-svg{display:block;margin:0 auto;max-width:100%}
</style>`;

/* ── helper ─────────────────────────────────────────────────────────────── */

/** Chồng tầng. rows = [[ 'L4', 'Transport', 'TCP, UDP — ports', true? ], …] */
export const stack = (rows) =>
  `<div class="nw-stack">` +
  rows.map(([n, name, note, on]) =>
    `<div class="ly${on ? ' on' : ''}"><i>${n}</i><b>${name}</b><u>${note}</u></div>`).join('') +
  `</div>`;

/** Gói tin. fields = [[ 'Source Port', '16 bits', 'hl'|'pay'|'', weight? ], …] */
export const pkt = (fields) =>
  `<div class="nw-pkt">` +
  fields.map(([name, size, cls = '', w = 1]) =>
    `<div class="fl ${cls}" style="flex:${w}"><b>${name}</b><u>${size}</u></div>`).join('') +
  `</div>`;

/** Đóng gói lồng nhau, từ ngoài vào trong. layers = [[label, inner?], …] dạng phẳng. */
export const encap = (layers, payload) => {
  let html = `<div class="en"><div class="lb">${layers[layers.length - 1]}</div>${payload}</div>`;
  for (let i = layers.length - 2; i >= 0; i--) html = `<div class="en"><div class="lb">${layers[i]}</div>${html}</div>`;
  return `<div class="nw-encap">${html}</div>`;
};

/** Luồng. hops = [[ 'r'|'l', 'SYN seq=0', 'note' ], …] */
export const flow = (left, right, hops) =>
  `<div class="nw-flow"><div class="ends"><span>${left}</span><span>${right}</span></div>` +
  hops.map(([dir, tag, note]) => dir === 'r'
    ? `<div class="hop"><span class="tag">${tag}</span><span class="no">${note || ''}</span><span class="ln r"></span></div>`
    : `<div class="hop"><span class="ln l"></span><span class="no">${note || ''}</span><span class="tag">${tag}</span></div>`
  ).join('') + `</div>`;

/** Topology. items = ['nd:PC-A|192.168.1.10', 'lk:Fa0/1 — Fa0/1', 'nd.rt:R1|Gi0/0', …] */
export const topo = (items) =>
  `<div class="nw-topo">` +
  items.map((it) => {
    const [head, rest = ''] = it.split(':');
    const [a, b = ''] = rest.split('|');
    if (head.startsWith('lk')) return `<div class="lk"><span class="w"></span><small>${a}${b ? '<br>' + b : ''}</small></div>`;
    const cls = head.replace(/^nd\.?/, '');
    return `<div class="nd ${cls}"><b>${a}</b><u>${b}</u></div>`;
  }).join('') + `</div>`;

/** Terminal. Dùng span.p (prompt) .c (chú thích) .k (từ khoá) .g (đạt) .r (lỗi). */
export const term = (html, cls = '') => `${CSS}<div class="nw-term ${cls}">${html}</div>`;

/** Khối mã tô màu. lang: bash | ini | apache | json | plaintext */
export const code = (src, lang = 'bash', cls = '') =>
  `${CSS}<pre class="nw-code ${cls}"><code>${hljs.highlight(src, { language: lang }).value}</code></pre>`;

/** Bảng 8 bit với hàng giá trị vị trí. bits = '11000000' */
export const bits = (b, label = '') => {
  const w = [128, 64, 32, 16, 8, 4, 2, 1];
  const tong = [...b].reduce((a, c, i) => a + (c === '1' ? w[i] : 0), 0);
  return `${CSS}<table class="nw-bits"><tr><th>${w.join('</th><th>')}</th><th>=</th></tr>` +
    `<tr>${[...b].map((c) => `<td class="${c === '1' ? 'one' : 'zero'}">${c}</td>`).join('')}` +
    `<td class="one">${tong}</td></tr>` +
    (label ? `<tr><th colspan="9" style="background:#fff;color:#5d7288;font-weight:600">${label}</th></tr>` : '') +
    `</table>`;
};

/** Khoá : giá trị */
export const kv = (rows) =>
  `${CSS}<div class="nw-kv">` + rows.map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('') + `</div>`;

/** Mã inline */
export const m = (t) => `<span class="nw-m">${t}</span>`;
