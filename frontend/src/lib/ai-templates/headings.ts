/**
 * Tách đề mục khỏi markdown và sinh id cho chúng.
 *
 * Tách riêng khỏi `content.server.ts` vì CẢ HAI PHÍA đều cần: server dựng mục
 * lục, còn `ContentViewer` (client) phải gắn đúng id ấy lên `h2`/`h3`. Nếu để
 * chung với hàm `fetch`, gói trình duyệt sẽ phải cõng cả phần tải tệp mà nó
 * không bao giờ gọi.
 *
 * ⚠️ Hai bên PHẢI dùng chung hàm này và chung cách đếm trùng lặp. Lệch một chỗ
 * là mục lục trỏ vào id không tồn tại và bấm không nhảy đi đâu cả.
 */

export interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'muc'
  );
}

/**
 * Quét theo DÒNG và bỏ qua vùng nằm giữa cặp ```.
 *
 * SKILL.md hay có khối mã chứa bình luận bắt đầu bằng `#`; đếm cả những dòng đó
 * thì mục lục đầy rác ("# TODO", "### FIXME") mà không dòng nào bấm tới được.
 */
export function extractHeadings(md: string): Heading[] {
  const out: Heading[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of md.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;

    const level: 2 | 3 = m[1].length === 2 ? 2 : 3;
    const text = m[2].replace(/[*_`]/g, '').trim();
    if (!text) continue;

    const base = slugify(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);

    out.push({ level, text, id: n ? `${base}-${n}` : base });
  }

  return out;
}
