/**
 * Đọc khối YAML frontmatter ở đầu tệp component.
 *
 * ─── VÌ SAO PHẢI TỰ VIẾT ────────────────────────────────────────────────────
 * Bản đầu tiên tách theo dòng bằng một regex `khoá: giá trị` và nó SAI ở hai
 * dạng phổ biến nhất của bộ agent — đây là lỗi người dùng báo:
 *
 *   1. Chuỗi nháy kép:  description: "…(EAA).\n\n<example>\nContext: …"
 *      Trong YAML nháy kép, `\n` là ESCAPE, phải giải mã thành xuống dòng thật.
 *      Không giải mã thì trang hiện nguyên chữ "\n\n<example>\nContext:" —
 *      đúng thứ đã lên production ngày 05/08/2026.
 *
 *   2. Khối literal:    description: |
 *                         Use this agent when…
 *      Khoá không có giá trị trên cùng dòng, nội dung nằm ở các dòng thụt vào
 *      phía dưới. Bản cũ thấy giá trị rỗng nên BỎ HẲN khoá — mất trắng phần mô
 *      tả (ví dụ agents/development-tools/flutter-go-reviewer.md).
 *
 * Vẫn KHÔNG kéo thư viện YAML về: frontmatter ở đây chỉ dùng vài kiểu vô hướng,
 * không có neo, không có thẻ, không có tài liệu nhiều phần. Một thư viện đầy đủ
 * là ~40 KB cho việc mà 80 dòng làm xong — và mọi dạng nó xử lý thêm đều không
 * xuất hiện trong bộ dữ liệu này (đã rà 48 tệp mẫu khắp 10 loại).
 *
 * Gặp dạng không hiểu (map lồng nhau, danh sách) thì GIỮ NGUYÊN VĂN thay vì
 * đoán — thà hiện thô còn hơn hiện sai.
 */

export interface FrontmatterEntry {
  key: string;
  value: string;
}

export interface ParsedFile {
  /** Các khoá khai báo, giữ đúng thứ tự trong tệp. */
  frontmatter: FrontmatterEntry[];
  /** Phần markdown sau khối frontmatter. */
  body: string;
}

/** Giải mã escape của chuỗi YAML nháy kép. */
function unescapeDouble(s: string): string {
  return s.replace(/\\(["\\/nrtb]|u[0-9a-fA-F]{4})/g, (_m, g: string) => {
    switch (g[0]) {
      case 'n': return '\n';
      case 't': return '\t';
      case 'r': return '\r';
      case 'b': return '\b';
      case '"': return '"';
      case '\\': return '\\';
      case '/': return '/';
      case 'u': return String.fromCharCode(parseInt(g.slice(1), 16));
      default: return g;
    }
  });
}

/** Số khoảng trắng đầu dòng. Dòng trắng trả về -1 để không phá mốc thụt lề. */
function indentOf(line: string): number {
  if (!line.trim()) return -1;
  return line.length - line.trimStart().length;
}

export function parseFile(raw: string): ParsedFile {
  if (!raw.startsWith('---')) return { frontmatter: [], body: raw };

  // Dấu đóng phải ở ĐẦU một dòng, nếu không một đường kẻ `---` giữa bài sẽ bị
  // hiểu là chỗ kết thúc frontmatter và nuốt mất nửa nội dung.
  const close = raw.indexOf('\n---', 3);
  if (close === -1) return { frontmatter: [], body: raw };

  const head = raw.slice(raw.indexOf('\n') + 1, close);
  const body = raw.slice(close + 4).replace(/^\r?\n/, '');
  const lines = head.split('\n');
  const out: FrontmatterEntry[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;

    const m = /^([A-Za-z_][\w.-]*)\s*:\s?(.*)$/.exec(line);
    // Dòng thụt vào không khớp khoá nào = phần đuôi của giá trị phía trên, đã
    // được vòng lặp của nhánh tương ứng nuốt rồi. Ở đây bỏ qua.
    if (!m) continue;

    const key = m[1];
    let rest = m[2];

    // ── Dạng 2: khối literal `|` hoặc gấp `>` ───────────────────────────
    if (/^[|>][-+]?\d*\s*$/.test(rest.trim())) {
      const fold = rest.trim()[0] === '>';
      const block: string[] = [];
      let base = -1;
      while (i + 1 < lines.length) {
        const next = lines[i + 1];
        const ind = indentOf(next);
        if (ind === -1) { block.push(''); i++; continue; }
        if (base === -1) base = ind;
        if (ind < base) break;
        block.push(next.slice(base));
        i++;
      }
      // `>` gộp dòng liền nhau thành một đoạn; dòng trắng vẫn ngắt đoạn.
      const text = fold
        ? block.join('\n').replace(/([^\n])\n(?=[^\n])/g, '$1 ')
        : block.join('\n');
      out.push({ key, value: text.replace(/\s+$/, '') });
      continue;
    }

    // ── Dạng 1: chuỗi có nháy, có thể trải nhiều dòng ───────────────────
    const q = rest[0];
    if (q === '"' || q === "'") {
      let buf = rest.slice(1);
      // Đóng nháy khi ký tự nháy đứng cuối và KHÔNG bị escape bằng `\`.
      const closed = (s: string) =>
        s.endsWith(q) && !/(^|[^\\])(\\\\)*\\$/.test(s.slice(0, -1));
      while (!closed(buf) && i + 1 < lines.length) {
        i++;
        buf += `\n${lines[i].trim()}`;
      }
      if (closed(buf)) buf = buf.slice(0, -1);
      out.push({
        key,
        value: q === '"' ? unescapeDouble(buf) : buf.replace(/''/g, "'"),
      });
      continue;
    }

    // ── Dạng 3: giá trị trần, hoặc khoá mở đầu một map lồng nhau ────────
    if (rest.trim() === '') {
      // Không có giá trị trên cùng dòng và cũng không phải `|`/`>`: gom nguyên
      // văn phần thụt vào bên dưới. Không cố dựng lại cấu trúc — hiện thô còn
      // hơn hiện sai.
      const nested: string[] = [];
      while (i + 1 < lines.length && indentOf(lines[i + 1]) !== 0) {
        if (lines[i + 1].trim()) nested.push(lines[i + 1]);
        i++;
      }
      if (nested.length) out.push({ key, value: nested.join('\n') });
      continue;
    }

    // Bỏ chú thích đuôi dòng, nhưng chỉ khi có khoảng trắng trước `#` —
    // `#fff` hay `C#` là giá trị thật, không phải chú thích.
    const value = rest.replace(/\s+#.*$/, '').trim();
    if (value) out.push({ key, value });
  }

  return { frontmatter: out, body };
}
