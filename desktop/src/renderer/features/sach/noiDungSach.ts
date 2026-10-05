/**
 * Nạp + chuẩn bị nội dung một cuốn sách cho trình đọc của app (05/10/2026).
 *
 * Web đọc sách bằng iframe cùng nguồn. App KHÔNG có iframe hợp lệ nào (CSP
 * `frame-src 'none'`, cố ý), nên ở đây: tải tệp HTML tĩnh của sách, bỏ <script>
 * (CSP app không chạy script nhúng — và nó chỉ để tô màu mã) và <link> font ngoài,
 * đổi CSS của sách sang dạng dùng được trong SHADOW DOM, rồi tô màu mã bằng
 * highlight.js với đúng bảng màu của cuốn đó (biến --k-*). Shadow DOM giữ CSS của
 * sách không tràn ra app và CSS của app không lọt vào sách.
 *
 * Offline: bản HTML lưu vào IndexedDB (offline/cache) lần đầu mở — sau đó đọc được
 * khi mất mạng. Bản dịch tiếng Việt cũng vậy.
 */
import hljs from 'highlight.js/lib/common';
import { readCache, writeCache } from '../../offline/cache';
import { webOrigin } from './sachApi';

/** Tải tệp tĩnh của web, có đệm IndexedDB. Có mạng mà tệp đổi thì lấy bản mới. */
async function taiCoDem(userId: number, khoa: string, url: string, kieu: 'text' | 'json'): Promise<string | unknown | null> {
  const cu = await readCache<string | unknown>(userId, khoa).catch(() => null);
  if (cu && !cu.isStale) return cu.value;
  try {
    const r = await fetch(url, { cache: 'no-cache', credentials: 'omit' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const v = kieu === 'text' ? await r.text() : await r.json();
    void writeCache(userId, khoa, v, 24 * 3600_000).catch(() => undefined);
    return v;
  } catch (e) {
    if (cu) return cu.value; // mất mạng — dùng bản đã lưu dù cũ
    throw e;
  }
}

/* ── CSS của sách → Shadow DOM ───────────────────────────────────────
 * Sách viết cho một trang riêng: `:root` mang biến màu, `html`/`body` mang nền.
 * Trong shadow root thì `:root`/`html`/`body` không khớp gì ⇒ đổi sang `:host`
 * và lớp `.cts-body`. Đã quét CSS cả 41 tập (05/10): chỉ có 7 dạng bộ chọn này. */
export function doiCssSangShadow(css: string): string {
  return css
    .replace(/:root:not\(\[data-theme="light"\]\)/g, ':host(:not([data-theme="light"]))')
    .replace(/:root\[data-theme="dark"\]/g, ':host([data-theme="dark"])')
    .replace(/:root\[data-theme="light"\]/g, ':host([data-theme="light"])')
    .replace(/:root\b/g, ':host')
    // `html`/`body` ĐỨNG làm bộ chọn (đầu khối hoặc sau dấu phẩy) — không đụng chữ "html" trong giá trị.
    .replace(/(^|[{},]\s*)html(?=\s*[{,\[:.\s])/gm, '$1:host')
    .replace(/(^|[{},]\s*)body(?=\s*[{,\[:.\s])/gm, '$1.cts-body');
}

export type MucLuc = { n: string; ten: string };
export type SachDaChuan = { tieuDe: string; ngonNgu: 'en' | 'vi'; css: string; than: string; mucLuc: MucLuc[] };

/** Tách tệp HTML của sách thành CSS (đã đổi) + phần thân + mục lục. */
export function chuanBi(html: string): SachDaChuan {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const tieuDe = doc.querySelector('title')?.textContent?.trim() ?? '';
  const ngonNgu = doc.documentElement.getAttribute('lang') === 'vi' ? 'vi' : 'en';
  const css = Array.from(doc.querySelectorAll('style')).map((s) => doiCssSangShadow(s.textContent ?? '')).join('\n');
  doc.querySelectorAll('script, link, meta, style, noscript').forEach((n) => n.remove());
  // Mục lục: lấy từ khối mục lục CỦA SÁCH (.toc-row → .toc-n, .toc-t; bỏ <small> phụ đề).
  const mucLuc: MucLuc[] = Array.from(doc.querySelectorAll('.toc-row')).map((r) => {
    const t = r.querySelector('.toc-t')?.cloneNode(true) as HTMLElement | undefined;
    t?.querySelectorAll('small').forEach((s) => s.remove());
    return { n: r.querySelector('.toc-n')?.textContent?.trim() ?? '', ten: (t?.textContent ?? '').replace(/\s+/g, ' ').trim() };
  }).filter((m) => m.ten);
  return { tieuDe, ngonNgu, css, than: doc.body.innerHTML, mucLuc };
}

export async function taiSach(userId: number, slug: string): Promise<SachDaChuan> {
  const html = await taiCoDem(userId, `sach:html:${slug}`, `${webOrigin()}/books/${slug}.html`, 'text');
  if (typeof html !== 'string' || html.length < 200) throw new Error('Tệp sách rỗng');
  return chuanBi(html);
}

/** Bản dịch tiếng Việt theo khối (cùng tệp với web: public/books/i18n/<slug>.vi.json). */
export async function taiBanDich(userId: number, slug: string): Promise<Map<string, string>> {
  const v = (await taiCoDem(userId, `sach:vi:${slug}`, `${webOrigin()}/books/i18n/${slug}.vi.json`, 'json')) as { blocks?: { h: string; vi: string }[] } | null;
  return new Map((v?.blocks ?? []).map((b) => [b.h, b.vi]));
}

/** Tô màu mã: mọi <pre><code>/<pre> trong sách, theo ngôn ngữ khai ở class hoặc tự đoán. */
export function toMauMa(goc: ParentNode) {
  goc.querySelectorAll<HTMLElement>('pre').forEach((pre) => {
    const code = (pre.querySelector('code') as HTMLElement | null) ?? pre;
    if (code.dataset.ctsHl) return;
    code.dataset.ctsHl = '1';
    if (code.querySelector('span')) return; // sách đã tô sẵn bằng span — giữ nguyên
    const lop = `${code.className} ${pre.className}`;
    const ngon = /(?:language|lang)-([\w+-]+)/.exec(lop)?.[1];
    try {
      const kq = ngon && hljs.getLanguage(ngon) ? hljs.highlight(code.textContent ?? '', { language: ngon }) : hljs.highlightAuto(code.textContent ?? '', ['bash', 'javascript', 'typescript', 'java', 'sql', 'json', 'yaml', 'dockerfile', 'nginx', 'xml', 'css', 'python']);
      if (kq.relevance >= 2 || ngon) { code.innerHTML = kq.value; code.classList.add('hljs'); }
    } catch { /* để nguyên chữ trần */ }
  });
}

/** CSS app chèn vào trong sách: cột đọc, nền giấy, cỡ chữ, song ngữ, màu mã hljs theo biến của sách. */
export const CSS_TRINH_DOC = `
:host { display: block; }
.cts-body { margin: 0; min-height: 100%; background: var(--paper); color: var(--ink); zoom: var(--cts-co, 1); }
.cv-back { display: none !important; }
.chap-open { scroll-margin-top: 20px; }
.page, .fm, .chap { max-width: none !important; }
.col { max-width: min(var(--cts-cot, 76ch), calc(100% - 64px)) !important; margin-left: auto !important; margin-right: auto !important; width: auto !important; }
.chap-eyebrow, .chap-open .eyebrow { font-size: 12.5px !important; padding: 6px 14px !important; background: var(--accent-wash) !important; border-radius: 6px !important; display: inline-block !important; }
:host([data-giay]) { --paper:#F3EBDB; --leaf:#FBF5E8; --leaf-2:#F1E8D6; --leaf-3:#E8DCC5; --rule:#DCCDB2; --ink:#2B2419; --ink-soft:#5E5240; --ink-faint:#8A7C66; --code-bg:#FBF5E8; }
:host { --cts-gold: oklch(52% 0.13 82); }
:host([data-theme="dark"]) { --cts-gold: oklch(80% 0.12 82); }
.ctsVi { display: none; margin-top: .45em; padding: 1px 0 1px 14px; border-left: 2px solid var(--cts-gold); color: var(--ink-soft, inherit); }
:host([data-lang="vi"]) .ctsEn { display: none; }
:host([data-lang="vi"]) .ctsVi, :host([data-lang="bi"]) .ctsVi { display: block; }
.cts-dau-trang { outline: 2px solid var(--cts-gold); outline-offset: 6px; border-radius: 4px; transition: outline-color 1.6s; }
.hljs-comment, .hljs-quote { color: var(--k-cmt); font-style: italic; }
.hljs-string, .hljs-regexp, .hljs-template-string { color: var(--k-str); }
.hljs-number, .hljs-literal { color: var(--k-num); }
.hljs-keyword, .hljs-selector-tag, .hljs-built_in.hljs-keyword { color: var(--k-kw); }
.hljs-meta, .hljs-meta .hljs-keyword { color: var(--k-ctl); }
.hljs-title, .hljs-title.function_, .hljs-section { color: var(--k-fn); }
.hljs-title.class_, .hljs-type, .hljs-built_in { color: var(--k-cls); }
.hljs-variable, .hljs-params, .hljs-template-variable { color: var(--k-var); }
.hljs-attr, .hljs-property, .hljs-attribute { color: var(--k-prp); }
.hljs-tag, .hljs-name, .hljs-selector-class, .hljs-selector-id { color: var(--k-tag); }
`;
