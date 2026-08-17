/**
 * ============================================================
 * DỰNG MARKDOWN CHO CÂU TRẢ LỜI CỦA AGENT
 * ============================================================
 *
 * Trước file này, câu trả lời hiện ra bằng `{text}` thuần — nên mọi thứ agent
 * viết ra đều lộ nguyên ký tự: ```ts, **đậm**, `mã`, danh sách. Đó là lý do lớn
 * nhất khiến màn hình trông thô sơ, chứ không phải màu hay font.
 *
 * ─── VÌ SAO TỰ VIẾT, KHÔNG THÊM THƯ VIỆN ───
 * Hai lý do, và lý do thứ hai mới là lý do thật:
 *  1. Agent chỉ dùng một tập nhỏ của markdown — khối mã, mã trong dòng, đậm,
 *     nghiêng, tiêu đề, danh sách, trích dẫn, liên kết. Kéo cả một trình phân
 *     tích đầy đủ về cho chừng đó là đắt hơn phần được dùng.
 *  2. Tiến trình này có `fs` và `child_process`. Mỗi phụ thuộc mới ở đây là
 *     một thứ phải vá khi có CVE, trong một chỗ mà lỗ hổng đồng nghĩa với đọc
 *     được ổ đĩa người dùng.
 *
 * ─── AN TOÀN THEO CẤU TẠO: THOÁT TRƯỚC, ĐỊNH DẠNG SAU ───
 * Thứ tự này quan trọng hơn mọi thứ khác trong file. Ta THOÁT toàn bộ HTML
 * trước, rồi mới áp luật định dạng lên chuỗi ĐÃ thoát. Nghĩa là `<script>` do
 * agent (hoặc do một file trong repo mà agent chép lại) viết ra không bao giờ
 * còn là thẻ — nó đã thành `&lt;script&gt;` từ bước một.
 *
 * Cách ngược lại — phân tích thành HTML rồi khử trùng — vẫn dùng được, nhưng
 * nó dựa vào việc bộ khử trùng không có lỗ nào. Cách này thì không có gì để
 * lọt qua, vì không có thẻ nào được sinh ra từ đầu vào.
 */
import hljs from 'highlight.js/lib/common';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

// ─── Khối ──────────────────────────────────────────────────────────

type Khoi =
  | { loai: 'chu'; html: string }
  | { loai: 'ma'; ngonNgu: string; noiDung: string };

/**
 * Mốc giữ chỗ cho mã trong dòng: ký tự NUL, viết bằng escape chứ KHÔNG gõ thẳng.
 *
 * Ký tự điều khiển gõ thẳng vào mã nguồn thì vô hình — không ai đọc ra, không
 * ai gõ lại được, và một số công cụ sẽ nuốt hoặc đổi nó. Chuỗi đã thoát không
 * bao giờ chứa NUL, nên nó là mốc an toàn tuyệt đối.
 */
const MOC = '\u0000';

/** Thoát HTML. Gọi TRƯỚC mọi thứ khác — xem ghi chú đầu file. */
function thoat(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Định dạng TRONG DÒNG, áp lên chuỗi ĐÃ thoát.
 *
 * `mã trong dòng` xử lý TRƯỚC đậm/nghiêng: bên trong dấu huyền, dấu `*` là ký
 * tự thường chứ không phải cú pháp — `` `a*b*c` `` phải giữ nguyên hai dấu sao.
 */
function trongDong(s: string): string {
  const oMa: string[] = [];
  // ⚠️ Mốc giữ chỗ phải là thứ đầu vào KHÔNG THỂ chứa, không phải thứ hiếm gặp.
  // Bản đầu dùng ` 0 `, ` 1 `… và nó ăn nhầm MỌI con số có khoảng trắng hai
  // bên: câu "có 42 dòng" biến thành `<code>undefined</code>`.
  let t = s.replace(/`([^`]+)`/g, (_, m: string) => {
    oMa.push(m);
    return `${MOC}${oMa.length - 1}${MOC}`;
  });

  t = t
    // Liên kết: CHỈ http/https, và KHÔNG có `href` — chỉ `data-url`. Đặt href
    // thật thì bấm vào là renderer tự điều hướng, rời khỏi app; ở đây bấm sẽ
    // được bắt lại và mở bằng trình duyệt hệ thống. `javascript:` trong câu trả
    // lời là chuyện hoàn toàn có thể xảy ra khi agent chép nội dung một file.
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a data-url="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  return t.replace(new RegExp(`${MOC}(\\d+)${MOC}`, 'g'), (_, i: string) => `<code>${oMa[Number(i)]}</code>`);
}

/** Một đoạn chữ (không phải khối mã) → HTML. */
function doanChu(tho: string): string {
  const ra: string[] = [];
  let dsMo: 'ul' | 'ol' | null = null;

  const dongDs = (): void => {
    if (dsMo) { ra.push(`</${dsMo}>`); dsMo = null; }
  };

  for (const dong of tho.split('\n')) {
    const t = dong.trimEnd();

    const tieuDe = /^(#{1,4})\s+(.*)$/.exec(t);
    if (tieuDe) {
      dongDs();
      // Tiêu đề markdown trong một bong bóng chat không nên to như tiêu đề
      // trang. Đổ hết về `h4` và để CSS phân cấp bằng độ đậm.
      ra.push(`<h4>${trongDong(thoat(tieuDe[2]!))}</h4>`);
      continue;
    }

    const gach = /^\s*[-*]\s+(.*)$/.exec(t);
    const so = /^\s*\d+[.)]\s+(.*)$/.exec(t);
    if (gach || so) {
      const kieu = gach ? 'ul' : 'ol';
      if (dsMo !== kieu) { dongDs(); ra.push(`<${kieu}>`); dsMo = kieu; }
      ra.push(`<li>${trongDong(thoat((gach ?? so)![1]!))}</li>`);
      continue;
    }

    const trich = /^>\s?(.*)$/.exec(t);
    if (trich) {
      dongDs();
      ra.push(`<blockquote>${trongDong(thoat(trich[1]!))}</blockquote>`);
      continue;
    }

    if (!t.trim()) { dongDs(); continue; }

    dongDs();
    ra.push(`<p>${trongDong(thoat(t))}</p>`);
  }
  dongDs();
  return ra.join('');
}

/**
 * Tách khối mã ra khỏi chữ.
 *
 * Khối mã CHƯA ĐÓNG cũng được nhận (`dangMo`): chữ chảy theo stream, nên trong
 * lúc agent đang gõ dở một khối mã thì nó chưa có ``` đóng. Không nhận thì
 * người dùng thấy ba dấu huyền trần trong suốt vài giây rồi mới thành khối —
 * nhấp nháy khó chịu ở đúng thứ họ đang chờ đọc.
 */
export function tachKhoi(tho: string): Khoi[] {
  const ra: Khoi[] = [];
  const re = /```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)(?:```|$)/g;
  let cuoi = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(tho)) !== null) {
    if (m.index > cuoi) {
      const chu = tho.slice(cuoi, m.index);
      if (chu.trim()) ra.push({ loai: 'chu', html: doanChu(chu) });
    }
    ra.push({ loai: 'ma', ngonNgu: m[1] ?? '', noiDung: m[2] ?? '' });
    cuoi = re.lastIndex;
    if (cuoi >= tho.length) break;
  }
  if (cuoi < tho.length) {
    const chu = tho.slice(cuoi);
    if (chu.trim()) ra.push({ loai: 'chu', html: doanChu(chu) });
  }
  return ra;
}

// ─── Vẽ ────────────────────────────────────────────────────────────

function KhoiMa({ ngonNgu, noiDung }: { ngonNgu: string; noiDung: string }) {
  const [daChep, datDaChep] = useState(false);

  // `highlight.js` tự thoát đầu vào và chỉ sinh ra `<span class>` — không có
  // đường nào cho HTML của người dùng lọt qua. Hỏng ngôn ngữ thì tự dò.
  let html: string;
  try {
    html = ngonNgu && hljs.getLanguage(ngonNgu)
      ? hljs.highlight(noiDung, { language: ngonNgu }).value
      : hljs.highlightAuto(noiDung).value;
  } catch {
    html = thoat(noiDung);
  }

  const chep = (): void => {
    void navigator.clipboard.writeText(noiDung).then(() => {
      datDaChep(true);
      setTimeout(() => datDaChep(false), 1500);
    });
  };

  return (
    <div className="ct-md-ma">
      <div className="ct-md-ma-dau">
        <span className="ct-md-ma-ngon">{ngonNgu || 'mã'}</span>
        <button type="button" className="ct-md-ma-chep" onClick={chep} title="Chép">
          {daChep ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
          {daChep ? 'Đã chép' : 'Chép'}
        </button>
      </div>
      <pre><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
    </div>
  );
}

/**
 * Câu trả lời của agent.
 *
 * `dangerouslySetInnerHTML` ở đây an toàn vì chuỗi truyền vào được dựng bởi
 * chính file này từ đầu vào ĐÃ THOÁT — không có thẻ nào đến từ agent. Đừng
 * bao giờ đưa HTML từ nguồn khác vào component này.
 */
export function ChuAgent({ text }: { text: string }) {
  /**
   * Bắt cú bấm vào liên kết ở CẢ KHỐI, không gắn handler cho từng thẻ `<a>` —
   * chúng được sinh ra bằng `innerHTML` nên React không quản chúng.
   *
   * Mở bằng trình duyệt hệ thống. Để renderer tự điều hướng là rời khỏi app và
   * mang theo phiên đăng nhập tới một trang bất kỳ.
   */
  const bamLienKet = (e: React.MouseEvent<HTMLDivElement>): void => {
    const a = (e.target as HTMLElement).closest('a[data-url]');
    const url = a?.getAttribute('data-url');
    if (!url) return;
    e.preventDefault();
    void window.cuongthai?.app.openExternal(url);
  };

  return (
    <div className="ct-md" onClick={bamLienKet}>
      {tachKhoi(text).map((k, i) =>
        k.loai === 'ma'
          ? <KhoiMa key={i} ngonNgu={k.ngonNgu} noiDung={k.noiDung} />
          : <div key={i} dangerouslySetInnerHTML={{ __html: k.html }} />,
      )}
    </div>
  );
}
