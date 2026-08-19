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
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Check, CircleStop, Copy, Download, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSandbox, type KetQuaChay } from './useSandbox';

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

/**
 * ============================================================
 * TOÁN — `$…$` và `$$…$$`
 * ============================================================
 *
 * ⚠️ Bậc Pro/Max của chat gắn thêm luật toán vào prompt hệ thống, nên model
 * TRẢ VỀ LaTeX. Không dựng thì người dùng đọc được nguyên `$$T = m g r$$` và
 * `$g \approx 9.81\,\text{m/s}^2$` — trông y như lỗi font, và người dùng đã
 * báo đúng như vậy (17/08).
 *
 * ─── TÁCH TRƯỚC KHI THOÁT HTML ───
 * LaTeX đầy `<`, `>`, `&`, `\`. Cho nó đi qua `thoat()` thì `\lt` thành
 * `&amp;lt;` và KaTeX nhận một chuỗi đã hỏng. Nên: rút công thức ra, thay bằng
 * MỐC, chạy toàn bộ đường markdown như thường, rồi cắm HTML của KaTeX vào.
 *
 * KaTeX tự sinh HTML an toàn (nó không bao giờ nhả thẻ do người dùng gõ), nên
 * cắm lại bằng `dangerouslySetInnerHTML` là hợp lệ — cùng lý do với khối mã đã
 * qua highlight.js.
 */
function tachToan(tho: string): { chu: string; ct: string[] } {
  const ct: string[] = [];
  const dat = (ma: string, khoi: boolean): string => {
    let html: string;
    try {
      html = katex.renderToString(ma.trim(), {
        displayMode: khoi,
        // `throwOnError: false` để một công thức sai KHÔNG làm hỏng cả câu trả
        // lời — KaTeX vẽ nó màu đỏ và phần còn lại vẫn đọc được.
        throwOnError: false,
        strict: false,
        output: 'html',
      });
    } catch {
      // Vẫn hỏng ⇒ trả lại nguyên văn ĐÃ THOÁT. Thà thấy `$x$` còn hơn mất chữ.
      html = `<code>${thoat(ma)}</code>`;
    }
    ct.push(khoi ? `<div class="ct-toan-khoi">${html}</div>` : html);
    return `${MOC_TOAN}${ct.length - 1}${MOC_TOAN}`;
  };

  return {
    chu: tho
      // `$$…$$` TRƯỚC `$…$`, nếu không dấu mở của khối bị bắt thành công thức
      // trong dòng rỗng.
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, m: string) => dat(m, true))
      // Trong dòng: cấm khoảng trắng ngay sau `$` mở — "giá 5 $ và 10 $" là câu
      // tiếng Việt bình thường, không phải công thức, và bắt nhầm nó thì cả câu
      // biến thành ký hiệu toán.
      .replace(/\$(?!\s)([^$\n]+?)(?<!\s)\$/g, (_, m: string) => dat(m, false)),
    ct,
  };
}

/** Mốc riêng cho toán — KHÁC mốc của mã trong dòng, nếu không hai bộ giẫm nhau. */
const MOC_TOAN = '\u0001';

/**
 * ============================================================
 * BẢNG MARKDOWN
 * ============================================================
 *
 * ⚠️ TRƯỚC 18/08/2026 BỘ NÀY KHÔNG BIẾT BẢNG. Model trả về bảng rất
 * thường xuyên (so sánh hai thứ là ra bảng ngay), và người dùng nhận
 * được nguyên văn `| Đặc điểm | ESP32 |` cùng dòng `|-----|-----|` —
 * trông y như giao diện hỏng.
 *
 * Bảng cần NHÌN TRƯỚC một dòng: một dòng `|…|` chỉ là bảng khi dòng ngay
 * sau nó là dòng kẻ. Nên vòng lặp chính phải chạy theo chỉ số, không phải
 * `for…of`.
 */
function laDongBang(s: string): boolean {
  const t = s.trim();
  return t.startsWith('|') && t.slice(1).includes('|');
}

/** Dòng kẻ ngăn tiêu đề với thân: `| --- | :---: |`. */
function laDongKe(s: string): boolean {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(s.trim());
}

function oCuaDong(s: string): string[] {
  let t = s.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map((x) => x.trim());
}

function dungBang(dongDau: string, dongKe: string, than: string[]): string {
  const dau = oCuaDong(dongDau);
  const canh = oCuaDong(dongKe).map((c) => {
    const trai = c.startsWith(':');
    const phai = c.endsWith(':');
    if (trai && phai) return 'center';
    if (phai) return 'right';
    return '';
  });
  const kieu = (n: number): string => (canh[n] ? ` style="text-align:${canh[n]}"` : '');
  const th = dau.map((c, n) => `<th${kieu(n)}>${trongDong(thoat(c))}</th>`).join('');
  const tr = than
    .map((d) => {
      const o = oCuaDong(d);
      // Hàng thiếu ô thì BÙ cho đủ. Model thỉnh thoảng bỏ sót một `|`, và một
      // hàng ngắn hơn hàng khác làm cả bảng lệch cột — trông như hỏng nặng
      // hơn nhiều so với một ô trống.
      while (o.length < dau.length) o.push('');
      return `<tr>${o.slice(0, dau.length).map((x, n) => `<td${kieu(n)}>${trongDong(thoat(x))}</td>`).join('')}</tr>`;
    })
    .join('');
  // Bọc trong khung cuộn NGANG: bảng rộng hơn bong bóng chat là chuyện
  // thường, và để nó tự giãn thì nó đẩy vỡ cả cột chat.
  return `<div class="ct-md-bang"><table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}

/** Một đoạn chữ (không phải khối mã) → HTML. */
/**
 * Một đoạn chữ markdown → HTML. Được XUẤT RA để bảng tin dùng lại: bài viết
 * trên web cũng là markdown, và trước 19/08/2026 app hiện nguyên `**đậm**`
 * kèm dấu sao (ảnh người dùng gửi). Dùng lại chỗ này thay vì viết bộ dựng
 * thứ hai, vì thứ tự "thoát HTML TRƯỚC, định dạng SAU" ở đây mới là phần
 * đáng giá — nội dung bảng tin do NGƯỜI KHÁC viết, nên nó còn cần hơn.
 */
export function doanChu(thoGoc: string): string {
  const { chu: tho, ct } = tachToan(thoGoc);
  const ra: string[] = [];
  let dsMo: 'ul' | 'ol' | null = null;

  const dongDs = (): void => {
    if (dsMo) { ra.push(`</${dsMo}>`); dsMo = null; }
  };

  const dongs = tho.split('\n');
  for (let i = 0; i < dongs.length; i += 1) {
    const t = dongs[i]!.trimEnd();

    // Bảng phải xét TRƯỚC mọi thứ khác: một ô bảng có thể bắt đầu bằng `-`
    // hoặc `#`, và nếu để luật danh sách/tiêu đề chạy trước thì nó nuốt mất.
    if (laDongBang(t) && i + 1 < dongs.length && laDongKe(dongs[i + 1]!)) {
      dongDs();
      const than: string[] = [];
      let j = i + 2;
      while (j < dongs.length && laDongBang(dongs[j]!)) { than.push(dongs[j]!); j += 1; }
      ra.push(dungBang(t, dongs[i + 1]!, than));
      i = j - 1;
      continue;
    }

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
  // Cắm HTML của KaTeX vào SAU cùng — sau khi mọi bước markdown đã chạy xong.
  return ra.join('').replace(
    new RegExp(`${MOC_TOAN}(\\d+)${MOC_TOAN}`, 'g'),
    (_, i: string) => ct[Number(i)] ?? '',
  );
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

  // ```mermaid ⇒ VẼ, không tô màu cú pháp. Người ta viết mermaid để nhìn thấy
  // hình, không phải để đọc mã của hình.
  if (ngonNgu.toLowerCase() === 'mermaid') return <SoDo ma={noiDung} />;
  // Python ⇒ thêm nút CHẠY. Xem `ChayPython` để biết vì sao hộp cát nằm ở
  // trình duyệt chứ không phải trên máy chủ.
  if (chayDuoc(ngonNgu)) return <ChayPython ma={noiDung} ngonNgu={ngonNgu} />;

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

/** Ngôn ngữ chạy được trong hộp cát. Chỉ Python — đừng hứa thứ chưa có. */
function chayDuoc(ngonNgu: string): boolean {
  return ['python', 'py', 'python3'].includes(ngonNgu.toLowerCase());
}

/**
 * KHỐI MÃ PYTHON CHẠY ĐƯỢC.
 *
 * ─── HỘP CÁT NẰM Ở TRÌNH DUYỆT, KHÔNG PHẢI TRÊN MÁY CHỦ ───
 * Mã chạy trong WebAssembly, trong một Web Worker: không `fs`, không tiến trình
 * con, không với được `window.cuongthai`, không ra mạng (CSP chặn). Chạy trên
 * VPS thì mã do model sinh ra nằm cùng máy với Postgres chứa dữ liệu thật —
 * xem ghi chú đầu `pythonWorker.ts`.
 *
 * ─── XUẤT FILE ───
 * Script ghi vào `/xuat` thì app đọc ra và mời lưu. Nơi lưu do NGƯỜI DÙNG chọn
 * qua hộp thoại hệ điều hành; renderer không bao giờ truyền đường dẫn.
 */
function ChayPython({ ma, ngonNgu }: { ma: string; ngonNgu: string }) {
  const { chay, giet, dangChay, tienTrinh } = useSandbox();
  const [kq, datKq] = useState<KetQuaChay | null>(null);
  const [daLuu, datDaLuu] = useState<string | null>(null);

  let html: string;
  try {
    html = hljs.highlight(ma, { language: 'python' }).value;
  } catch {
    html = ma.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] ?? c));
  }

  const luu = async (f: { ten: string; dulieu: Uint8Array }): Promise<void> => {
    const r = await window.cuongthai?.app.luuFile(f.ten, f.dulieu);
    if (r?.ok) datDaLuu(f.ten);
    else if (r?.loi) datDaLuu(`lỗi: ${r.loi}`);
  };

  return (
    <div className="ct-ma">
      <div className="ct-ma-dau">
        <span className="ct-ma-ngonngu">{ngonNgu}</span>
        {dangChay ? (
          <button type="button" className="ct-ma-chep" onClick={giet} title="Dừng — giết hẳn tiến trình">
            <CircleStop size={12} aria-hidden />
            Dừng
          </button>
        ) : (
          <button
            type="button"
            className="ct-ma-chep"
            onClick={() => { datDaLuu(null); void chay(ma).then(datKq); }}
            title="Chạy trong hộp cát Python (WebAssembly) — không đụng tới máy bạn"
          >
            <Play size={12} aria-hidden />
            Chạy
          </button>
        )}
      </div>
      <pre><code dangerouslySetInnerHTML={{ __html: html }} /></pre>

      {tienTrinh && <div className="ct-ma-ra" data-cho>{tienTrinh}</div>}

      {kq && !dangChay && (
        <div className="ct-ma-ra" data-loi={kq.loi ? '' : undefined}>
          {/* Text thô: đây là đầu ra của mã người lạ viết, không bao giờ dựng
              thành HTML. */}
          <pre>{kq.loi ?? (kq.ra.trim() || '(chạy xong, không in ra gì)')}</pre>
          {kq.file.length > 0 && (
            <div className="ct-ma-file">
              {kq.file.map((f, i) => (
                <button key={i} type="button" className="ct-btn ct-mcp-nho" onClick={() => void luu(f)}>
                  <Download size={12} aria-hidden />
                  Lưu {f.ten} ({Math.max(1, Math.round(f.dulieu.byteLength / 1024))} KB)
                </button>
              ))}
            </div>
          )}
          {daLuu && <div className="ct-ma-daluu">Đã lưu {daLuu}</div>}
        </div>
      )}
    </div>
  );
}

/**
 * SƠ ĐỒ MERMAID.
 *
 * ─── NẠP LƯỜI, VÀ ĐÓ KHÔNG PHẢI TỐI ƯU VẶT ───
 * Gói mermaid nặng ~1MB. Nạp thẳng ở đầu file nghĩa là MỌI người mở app đều
 * trả cái giá đó, kể cả người không bao giờ hỏi tới sơ đồ. `import()` động
 * khiến nó chỉ được tải khi có một khối ```mermaid thật sự xuất hiện.
 *
 * ⚠️ Dựng SAU một nhịp chờ. Trong lúc chữ còn chảy, khối mermaid liên tục ở
 * trạng thái cú pháp dở dang và mermaid ném lỗi ở mỗi mẩu — màn hình sẽ nhấp
 * nháy chữ đỏ suốt vài giây. Cùng bài học với KaTeX dựng trên DOM.
 */
function SoDo({ ma }: { ma: string }) {
  const [html, datHtml] = useState<string | null>(null);
  const [loi, datLoi] = useState<string | null>(null);
  const oRef = useRef<HTMLDivElement>(null);

  /**
   * Theo dõi chủ đề, và VẼ LẠI khi nó đổi.
   *
   * ⚠️ Mermaid nướng màu thẳng vào SVG lúc dựng, không dùng biến CSS. Nên đổi
   * sang chủ đề sáng mà không vẽ lại thì sơ đồ giữ nguyên hộp ĐEN trên nền
   * trắng — đọc được, nhưng trông như hỏng. Bắt được bằng cách đổi chủ đề trên
   * trang xem thử, không phải bằng đọc mã.
   */
  const [toi, datToi] = useState(() => document.documentElement.classList.contains('theme-dark'));
  useEffect(() => {
    const gd = document.documentElement;
    const theoDoi = new MutationObserver(() => datToi(gd.classList.contains('theme-dark')));
    theoDoi.observe(gd, { attributes: true, attributeFilter: ['class'] });
    return () => theoDoi.disconnect();
  }, []);

  useEffect(() => {
    let huy = false;
    const hen = setTimeout(() => {
      void (async () => {
        try {
          const { default: mermaid } = await import('mermaid');
          mermaid.initialize({
            startOnLoad: false,
            // Theo chủ đề app. Lớp toàn cục là `theme-dark`, KHÔNG phải `dark`
            // — xem quy ước trong CLAUDE.md.
            theme: toi ? 'dark' : 'default',
            securityLevel: 'strict',
            fontFamily: 'inherit',
          });
          const id = `sd${Math.random().toString(36).slice(2, 9)}`;
          const { svg } = await mermaid.render(id, ma.trim());
          if (!huy) { datHtml(svg); datLoi(null); }
        } catch (err) {
          if (!huy) datLoi(((err as Error).message || 'sơ đồ không hợp lệ').split('\n')[0]!);
        }
      })();
    }, 350);
    return () => { huy = true; clearTimeout(hen); };
  }, [ma, toi]);

  if (loi) {
    // Hỏng thì hiện MÃ GỐC, không hiện ô trống: người dùng vẫn đọc được nội
    // dung, và biết vì sao nó không thành hình.
    return (
      <div className="ct-sodo" data-loi>
        <div className="ct-sodo-loi">Không vẽ được sơ đồ: {loi}</div>
        <pre><code>{ma}</code></pre>
      </div>
    );
  }
  if (!html) return <div className="ct-sodo" data-cho>Đang vẽ sơ đồ…</div>;
  // SVG do mermaid sinh ở `securityLevel: 'strict'` — đã lọc script và thuộc
  // tính sự kiện. Cùng hạng tin cậy với đầu ra của highlight.js.
  return <div className="ct-sodo" ref={oRef} dangerouslySetInnerHTML={{ __html: html }} />;
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
