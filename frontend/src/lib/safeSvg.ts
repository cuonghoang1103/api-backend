/**
 * Lọc SVG do AI sinh ra trước khi cho vào DOM.
 *
 * Vì sao phải có file này: câu trả lời của model là NỘI DUNG KHÔNG TIN ĐƯỢC —
 * nó có thể bị lái bởi chính file/ảnh người dùng vừa đính kèm. SVG không phải
 * ảnh: nó là XML chạy được, có `<script>`, có `on*` handler, có
 * `<foreignObject>` nhét thẳng HTML vào, có `<image href="https://…">` gọi ra
 * mạng ngoài (vừa lộ IP người xem, vừa là kênh rò dữ liệu). Nhét thẳng chuỗi
 * SVG vào `dangerouslySetInnerHTML` là mở cửa cho cả ba.
 *
 * Cách làm: phân tích bằng DOMParser rồi đi qua TỪNG nút — thẻ nào không có
 * trong danh sách trắng thì bỏ, thuộc tính nào không có trong danh sách trắng
 * thì gỡ. Danh sách trắng (không phải danh sách đen) vì thứ nguy hiểm là thứ
 * mình chưa nghĩ ra.
 */

/** Thẻ SVG đủ để vẽ hình học phẳng + hình không gian dạng chiếu. */
const ALLOWED_TAGS = new Set([
  'svg', 'g', 'defs', 'title', 'desc', 'symbol', 'use',
  'path', 'line', 'polyline', 'polygon', 'rect', 'circle', 'ellipse',
  'text', 'tspan', 'marker', 'clippath', 'lineargradient', 'radialgradient', 'stop',
]);

/** Thuộc tính hình học + trình bày. KHÔNG có `on*`, `href`, `style`, `xlink:*`. */
const ALLOWED_ATTRS = new Set([
  'viewbox', 'width', 'height', 'xmlns', 'preserveaspectratio',
  'd', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
  'points', 'transform', 'id', 'class',
  'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity',
  'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity',
  'font-size', 'font-family', 'font-weight', 'font-style', 'text-anchor',
  'dominant-baseline', 'alignment-baseline', 'dx', 'dy', 'letter-spacing',
  'marker-end', 'marker-start', 'marker-width', 'marker-height', 'refx', 'refy',
  'orient', 'markerunits', 'offset', 'stop-color', 'stop-opacity',
  'gradientunits', 'clip-path', 'vector-effect',
]);

/** Giá trị thuộc tính có mùi thực thi (url(javascript:…), data:text/html…). */
const DANGEROUS_VALUE = /(javascript:|data:text\/html|<script)/i;

export interface SafeSvgResult {
  /** Chuỗi SVG đã lọc, hoặc null nếu không dựng được. */
  svg: string | null;
  /** Lý do bỏ, để hiện cho người dùng thay vì im lặng nuốt mất hình. */
  reason?: string;
}

/**
 * Trả về chuỗi SVG an toàn để render, hoặc `null` kèm lý do.
 * Chạy được ở cả server (trả null vì không có DOMParser) lẫn trình duyệt.
 */
export function sanitizeSvg(source: string, maxBytes = 200_000): SafeSvgResult {
  const raw = (source || '').trim();
  if (!raw) return { svg: null, reason: 'rỗng' };
  if (raw.length > maxBytes) return { svg: null, reason: 'hình quá lớn' };
  if (!/^<svg[\s>]/i.test(raw)) return { svg: null, reason: 'không phải thẻ <svg>' };
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    // Server-side render: chưa lọc được thì KHÔNG trả chuỗi nào cả. Hình sẽ
    // hiện sau khi hydrate — thà chậm một nhịp còn hơn lọt SVG chưa lọc.
    return { svg: null, reason: 'ssr' };
  }

  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
  } catch {
    return { svg: null, reason: 'không đọc được' };
  }
  if (doc.querySelector('parsererror')) return { svg: null, reason: 'SVG sai cú pháp' };

  const root = doc.documentElement;
  if (!root || root.nodeName.toLowerCase() !== 'svg') return { svg: null, reason: 'không phải <svg>' };

  const walk = (node: Element): void => {
    // Duyệt ngược: xoá con giữa chừng không làm lệch chỉ số của những đứa chưa xét.
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      const tag = child.nodeName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) { child.remove(); continue; }
      walk(child);
    }
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value || '';
      if (!ALLOWED_ATTRS.has(name) || name.startsWith('on') || DANGEROUS_VALUE.test(value)) {
        node.removeAttribute(attr.name);
      }
    }
  };
  walk(root);

  // Khung nhìn: thiếu `viewBox` thì hình co giãn sai; ép width/height theo khung
  // chứa để không tràn ngang trên điện thoại.
  if (!root.getAttribute('viewBox')) return { svg: null, reason: 'thiếu viewBox' };
  root.setAttribute('width', '100%');
  root.removeAttribute('height');
  root.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  return { svg: new XMLSerializer().serializeToString(root) };
}
