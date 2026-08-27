// Chọn khối văn xuôi trong sách /books để dịch song ngữ Anh–Việt.
//
// DÙNG CHUNG bởi HAI phía, và đây là điều quan trọng nhất của file này:
//   1. scripts/books-i18n-extract.ts (Node + jsdom) — trích khối EN offline
//      để đưa cho agent dịch, sinh public/books/i18n/<slug>.vi.json
//   2. BookReader.tsx (trình duyệt) — trích khối EN THẬT trong iframe lúc đọc,
//      rồi tra theo hash để chèn bản dịch đúng chỗ.
// Nếu hai phía trích khác nhau (thứ tự khác, thẻ khác), hash sẽ lệch và bản
// dịch không khớp được đoạn nào. Sửa Ở ĐÂY, đừng chép logic ra hai nơi.
//
// Chỉ dùng DOM API chuẩn (Element/Document) — chạy được cả trong browser thật
// lẫn trong jsdom, không đụng gì riêng của Node hay của browser.

const BLOCK_SELECTOR = 'p, h1, h2, h3, h4, li, blockquote, figcaption, th, td';

/** Phần tử nằm trong <pre>/<code>/.terminal (khối lệnh) thì bỏ qua, không dịch. */
function isInsideCodeBlock(el: Element, scopeRoot: Element): boolean {
  let cur: Element | null = el;
  while (cur) {
    const tag = cur.tagName;
    if (tag === 'PRE' || tag === 'CODE') return true;
    if (cur.classList.contains('terminal')) return true;
    if (cur === scopeRoot) break;
    cur = cur.parentElement;
  }
  return false;
}

/**
 * Trả về các phần tử văn xuôi đủ điều kiện dịch, ĐÚNG THỨ TỰ xuất hiện trong
 * tài liệu, không trùng lặp. Phạm vi: mọi hậu duệ của `.col` khớp
 * p/h1–h4/li/blockquote/figcaption/th/td, trừ phần nằm trong <pre>/<code>/.terminal.
 */
export function collectBookBlocks(doc: Document): HTMLElement[] {
  const cols = Array.from(doc.querySelectorAll<HTMLElement>('.col'));
  const seen = new Set<HTMLElement>();
  const raw: HTMLElement[] = [];
  for (const col of cols) {
    const candidates = Array.from(col.querySelectorAll<HTMLElement>(BLOCK_SELECTOR));
    for (const el of candidates) {
      if (seen.has(el)) continue;
      if (isInsideCodeBlock(el, col)) continue;
      seen.add(el);
      raw.push(el);
    }
  }
  // Chỉ giữ khối LÁ: nếu một khối chứa khối khác cũng khớp selector (ví dụ
  // <blockquote><p>...</p></blockquote>), chỉ dịch khối con — tránh dịch
  // trùng cùng một đoạn chữ hai lần.
  const rawSet = new Set(raw);
  return raw.filter(
    (el) => !Array.from(el.querySelectorAll<HTMLElement>(BLOCK_SELECTOR)).some((child) => rawSet.has(child)),
  );
}

/** Chuẩn hoá chữ để so hash: gộp khoảng trắng, cắt hai đầu. Không đổi ký tự. */
export function normalizeBlockText(el: Element): string {
  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

/**
 * FNV-1a 32-bit → hex 8 ký tự. Tất định, không phụ thuộc môi trường (không
 * dùng crypto của Node) nên browser và jsdom luôn ra cùng một hash cho cùng
 * một chuỗi. Chỉ để đối chiếu khối, KHÔNG dùng cho bảo mật.
 */
export function hashBlockText(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export interface BookBlockRef {
  el: HTMLElement;
  hash: string;
}

/** Tiện ích gộp: trích khối + hash trong một lần, dùng ở cả hai phía. */
export function collectBookBlockRefs(doc: Document): BookBlockRef[] {
  return collectBookBlocks(doc).map((el) => ({ el, hash: hashBlockText(normalizeBlockText(el)) }));
}
