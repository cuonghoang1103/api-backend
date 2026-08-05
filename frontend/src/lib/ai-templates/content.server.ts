/**
 * Lấy nội dung THẬT của một component từ repo gốc trên GitHub.
 *
 * ─── VÌ SAO KHÔNG ĐÓNG GÓI SẴN ──────────────────────────────────────────────
 * 1.877 tệp SKILL.md/JSON là hơn 40 MB — gấp ba mươi lần phần siêu dữ liệu đang
 * dùng cho danh sách. Nhét vào repo là làm chậm mọi lượt `git clone` và mọi bản
 * dựng Docker, để đổi lấy nội dung mà đa số người xem không bao giờ mở tới.
 * Lấy lúc cần, cache lại, là đúng cân bằng.
 *
 * ─── VÌ SAO GỌI Ở SERVER ────────────────────────────────────────────────────
 * CSP của site đặt `connect-src 'self' …` và KHÔNG có raw.githubusercontent.com.
 * Gọi từ trình duyệt sẽ bị chặn thẳng, lỗi báo ra chỉ là "Failed to fetch"
 * không nhắc gì tới CSP (đã dẫm đúng bẫy này với texture của sân chơi 3D).
 * Gọi từ server thì không dính CSP, và bonus là được Next cache chung cho mọi
 * người xem thay vì mỗi người tải một lần.
 *
 * ─── HỎNG THÌ SAO ───────────────────────────────────────────────────────────
 * GitHub sập, đổi tên tệp, hoặc mạng VPS chập — trang VẪN phải mở được, chỉ mất
 * phần nội dung. Nên hàm này trả `null` chứ không ném lỗi, và trang chi tiết có
 * sẵn khối "không tải được, xem trên GitHub".
 */

import { SOURCE_RAW, sourceFilePath, type TypeMeta } from './catalog';

/** Trần kích thước. Vài SKILL.md kèm tài liệu tham chiếu rất dài. */
const MAX_BYTES = 400_000;
const TIMEOUT_MS = 6_000;

export interface FetchedContent {
  /** Nguyên văn tệp, kể cả frontmatter — dùng cho chế độ "Mã thô" và nút chép. */
  text: string;
  /** Phần markdown SAU khi bỏ frontmatter — dùng để vẽ và để rút mục lục. */
  body: string;
  /** Các khoá khai báo trong frontmatter, đã tách sẵn. Rỗng nếu tệp không có. */
  frontmatter: [string, string][];
  /** `md` hoặc `json` — quyết định vẽ bằng markdown hay khối mã. */
  format: 'md' | 'json';
  /** Đường dẫn xem trên GitHub. */
  url: string;
  truncated: boolean;
}

/**
 * Tách khối YAML frontmatter ở đầu SKILL.md.
 *
 * BẮT BUỘC phải tách trước khi vẽ. Markdown coi một dòng chữ theo sau bởi
 * `---` là tiêu đề kiểu setext, nên để nguyên thì cả khối khai báo
 * (`name: … description: …`) biến thành MỘT TIÊU ĐỀ CỠ LỚN chình ình đầu
 * trang — đúng thứ đã thấy ở lần dựng đầu tiên.
 *
 * Bộ tách này cố ý thô sơ: frontmatter của bộ component chỉ dùng `khoá: giá
 * trị` một dòng. Không kéo cả thư viện YAML về cho ba dòng chữ; gặp cấu trúc
 * lồng nhau thì bỏ qua dòng đó chứ không cố đoán.
 */
function splitFrontmatter(md: string): { frontmatter: [string, string][]; body: string } {
  if (!md.startsWith('---')) return { frontmatter: [], body: md };

  // Dấu đóng phải nằm ở đầu một dòng, nếu không một dấu `---` giữa bài (đường
  // kẻ ngang) sẽ bị hiểu nhầm là chỗ kết thúc frontmatter và nuốt mất nửa bài.
  const end = md.indexOf('\n---', 3);
  if (end === -1) return { frontmatter: [], body: md };

  const raw = md.slice(md.indexOf('\n') + 1, end);
  const body = md.slice(end + 4).replace(/^\r?\n/, '');

  const frontmatter: [string, string][] = [];
  for (const line of raw.split('\n')) {
    const m = /^([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line.trim());
    if (!m) continue;
    const value = m[2].trim().replace(/^["']|["']$/g, '');
    if (value) frontmatter.push([m[1], value]);
  }

  return { frontmatter, body };
}

export async function fetchComponentContent(
  meta: TypeMeta,
  path: string,
): Promise<FetchedContent | null> {
  const filePath = sourceFilePath(meta, path);
  if (!filePath) return null;

  const url = `${SOURCE_RAW}/${filePath}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'cuongthai-ai-templates/1.0' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Cache 24 giờ. Nội dung repo gốc đổi vài lần một tuần là cùng, mà mỗi
      // lượt tải lại là một chuyến đi ra Internet từ VPS.
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;

    let text = await res.text();
    const truncated = text.length > MAX_BYTES;
    if (truncated) text = text.slice(0, MAX_BYTES);

    const format = filePath.endsWith('.json') ? 'json' : 'md';
    const { frontmatter, body } = format === 'md'
      ? splitFrontmatter(text)
      : { frontmatter: [] as [string, string][], body: text };

    return { text, body, frontmatter, format, url, truncated };
  } catch {
    return null;
  }
}

/**
 * Mục lục dùng chung với `ContentViewer` — xem chú thích ở `headings.ts` về lý
 * do hai phía phải gọi cùng một hàm.
 */
export { extractHeadings, slugify, type Heading } from './headings';
