/**
 * ============================================================
 * MARKDOWN → TÀI LIỆU TIPTAP
 * ============================================================
 *
 * ⚠️ VÌ SAO KHÔNG PHẢI HTML.
 *
 * Ghi chú lưu HAI trường: `contentJson` (tài liệu ProseMirror) và
 * `contentHtml`. Nhìn tên thì tưởng ghi cái nào cũng được — nhưng trình soạn
 * nạp bằng `note.contentJson ?? ''` (NoteEditor.tsx). Ghi mỗi `contentHtml` thì
 * lưu thành công, API trả 200, và người dùng mở ghi chú ra thấy TRỐNG TRƠN.
 * Không lỗi nào, không log nào. Nên tool ghi chú phải sinh đúng JSON.
 *
 * `contentHtml` vẫn được ghi kèm, vì đó là thứ `notes_search`/`notes_read` và
 * bản xem chia sẻ đọc — thiếu nó thì agent ghi xong rồi tự tìm lại không thấy.
 *
 * ─── CHỈ NHỮNG NODE TRÌNH SOẠN THẬT SỰ CÓ ───
 * Bộ mở rộng đang bật: StarterKit (heading levels 1–3, paragraph, bulletList,
 * orderedList, listItem, blockquote, horizontalRule, hardBreak; mark bold,
 * italic, strike, code) + NoteCodeBlock (tên node `codeBlock`, attr
 * `language`) + Link. Sinh ra một `type` nằm ngoài danh sách đó thì ProseMirror
 * VỨT cả khối khi nạp — lại là mất chữ trong im lặng. Bảng, ảnh, toán, callout
 * cố ý không hỗ trợ: agent viết chữ, không dựng bố cục.
 */

export interface NutTiptap {
  type: string;
  attrs?: Record<string, unknown>;
  content?: NutTiptap[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

export interface TaiLieuTiptap {
  type: 'doc';
  content: NutTiptap[];
}

/** Trần một lần ghi. Ghi chú dài hơn thế gần như chắc chắn là model chạy loạn. */
export const MAX_CHU = 100_000;

// ── Chữ trong dòng: **đậm**, *nghiêng*, `mã`, ~~gạch~~, [chữ](địa chỉ) ──
//
// Một regex duy nhất quét TUẦN TỰ, không lồng nhau. Markdown lồng nhau đầy đủ
// cần cả một bộ phân tích; ở đây đổi lấy sự đơn giản có thể kiểm chứng được —
// và mất mát tệ nhất là dấu sao hiện nguyên văn, chứ không phải mất chữ.
const TRONG_DONG = /(\*\*|__)(.+?)\1|(\*|_)(.+?)\3|`([^`]+)`|~~(.+?)~~|\[([^\]]+)\]\(([^)\s]+)\)/g;

function chuVoiDinhDang(dong: string): NutTiptap[] {
  const ra: NutTiptap[] = [];
  let cuoi = 0;
  for (const m of dong.matchAll(TRONG_DONG)) {
    const i = m.index ?? 0;
    if (i > cuoi) ra.push({ type: 'text', text: dong.slice(cuoi, i) });

    if (m[2] !== undefined) ra.push({ type: 'text', text: m[2], marks: [{ type: 'bold' }] });
    else if (m[4] !== undefined) ra.push({ type: 'text', text: m[4], marks: [{ type: 'italic' }] });
    else if (m[5] !== undefined) ra.push({ type: 'text', text: m[5], marks: [{ type: 'code' }] });
    else if (m[6] !== undefined) ra.push({ type: 'text', text: m[6], marks: [{ type: 'strike' }] });
    else if (m[7] !== undefined) {
      // Chỉ nhận http/https. Một `[bấm đây](javascript:…)` do model sinh ra mà
      // lọt vào ghi chú là một cái bẫy nằm lại trong dữ liệu của người dùng.
      const url = m[8] ?? '';
      ra.push(/^https?:\/\//i.test(url)
        ? { type: 'text', text: m[7], marks: [{ type: 'link', attrs: { href: url } }] }
        : { type: 'text', text: `${m[7]} (${url})` });
    }
    cuoi = i + m[0].length;
  }
  if (cuoi < dong.length) ra.push({ type: 'text', text: dong.slice(cuoi) });
  // ProseMirror KHÔNG chấp nhận node text rỗng — nó ném lúc nạp. Đoạn rỗng phải
  // là một paragraph KHÔNG có `content`, không phải paragraph chứa text "".
  return ra.filter((n) => n.text === undefined || n.text.length > 0);
}

function doan(dong: string): NutTiptap {
  const con = chuVoiDinhDang(dong);
  return con.length ? { type: 'paragraph', content: con } : { type: 'paragraph' };
}

const DAU_DE = /^(#{1,6})\s+(.*)$/;
const DAU_CHAM = /^[-*+]\s+(.*)$/;
const DAU_SO = /^\d+[.)]\s+(.*)$/;
const DAU_TRICH = /^>\s?(.*)$/;
const DAU_MA = /^```(\w*)\s*$/;
const DUONG_KE = /^(-{3,}|\*{3,}|_{3,})$/;

/**
 * Đổi Markdown thành tài liệu TipTap.
 *
 * Luôn trả về tài liệu HỢP LỆ: rỗng thì vẫn có một paragraph, vì `{type:'doc',
 * content: []}` làm ProseMirror ném lúc nạp và ghi chú không mở được nữa.
 */
export function markdownSangTiptap(md: string): TaiLieuTiptap {
  const dong = md.replace(/\r\n?/g, '\n').slice(0, MAX_CHU).split('\n');
  const ra: NutTiptap[] = [];
  let i = 0;

  while (i < dong.length) {
    const d = dong[i] ?? '';

    // ── khối mã ──
    const ma = DAU_MA.exec(d.trim());
    if (ma) {
      const ngonNgu = ma[1] ?? '';
      const than: string[] = [];
      i++;
      while (i < dong.length && !DAU_MA.test((dong[i] ?? '').trim())) { than.push(dong[i] ?? ''); i++; }
      i++; // bỏ hàng rào đóng
      const chu = than.join('\n');
      ra.push({
        type: 'codeBlock',
        attrs: { language: ngonNgu },
        // Khối mã rỗng: KHÔNG có content, chứ không phải content chứa text rỗng.
        ...(chu ? { content: [{ type: 'text', text: chu }] } : {}),
      });
      continue;
    }

    if (!d.trim()) { i++; continue; }

    if (DUONG_KE.test(d.trim())) { ra.push({ type: 'horizontalRule' }); i++; continue; }

    const de = DAU_DE.exec(d);
    if (de) {
      // Trình soạn chỉ bật levels [1,2,3]. `#####` mà sinh ra `level: 5` thì
      // ProseMirror vứt cả tiêu đề — kẹp lại thay vì mất chữ.
      const muc = Math.min(3, (de[1] ?? '#').length);
      ra.push({ type: 'heading', attrs: { level: muc }, content: chuVoiDinhDang(de[2] ?? '') });
      i++;
      continue;
    }

    // ── danh sách (gom các dòng liền nhau thành MỘT list) ──
    const cham = DAU_CHAM.exec(d);
    const so = DAU_SO.exec(d);
    if (cham || so) {
      const kieu = cham ? 'bulletList' : 'orderedList';
      const mau = cham ? DAU_CHAM : DAU_SO;
      const muc: NutTiptap[] = [];
      while (i < dong.length) {
        const m = mau.exec(dong[i] ?? '');
        if (!m) break;
        muc.push({ type: 'listItem', content: [doan(m[1] ?? '')] });
        i++;
      }
      ra.push({ type: kieu, content: muc });
      continue;
    }

    const trich = DAU_TRICH.exec(d);
    if (trich) {
      const than: string[] = [];
      while (i < dong.length) {
        const m = DAU_TRICH.exec(dong[i] ?? '');
        if (!m) break;
        than.push(m[1] ?? '');
        i++;
      }
      ra.push({ type: 'blockquote', content: than.map(doan) });
      continue;
    }

    // ── đoạn văn: gom tới dòng trống ──
    const than: string[] = [];
    while (i < dong.length) {
      const t = dong[i] ?? '';
      if (!t.trim() || DAU_DE.test(t) || DAU_CHAM.test(t) || DAU_SO.test(t)
        || DAU_TRICH.test(t) || DAU_MA.test(t.trim()) || DUONG_KE.test(t.trim())) break;
      than.push(t);
      i++;
    }
    ra.push(doan(than.join(' ')));
  }

  return { type: 'doc', content: ra.length ? ra : [{ type: 'paragraph' }] };
}

const THOAT: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const thoat = (s: string): string => s.replace(/[&<>"]/g, (c) => THOAT[c] ?? c);

function chuSangHtml(nut: NutTiptap[] | undefined): string {
  return (nut ?? []).map((n) => {
    let s = thoat(n.text ?? '');
    for (const m of n.marks ?? []) {
      if (m.type === 'bold') s = `<strong>${s}</strong>`;
      else if (m.type === 'italic') s = `<em>${s}</em>`;
      else if (m.type === 'code') s = `<code>${s}</code>`;
      else if (m.type === 'strike') s = `<s>${s}</s>`;
      else if (m.type === 'link') s = `<a href="${thoat(String(m.attrs?.href ?? ''))}">${s}</a>`;
    }
    return s;
  }).join('');
}

/**
 * Cùng một tài liệu, xuất ra HTML.
 *
 * Đây KHÔNG phải thứ trình soạn nạp — nó nạp `contentJson`. Nhưng
 * `notes_search`, `notes_read` và bản xem chia sẻ đều đọc `contentHtml`, nên
 * thiếu nó thì agent vừa ghi xong đã không tìm lại được bài của chính mình.
 */
export function tiptapSangHtml(doc: TaiLieuTiptap): string {
  const khoi = (n: NutTiptap): string => {
    switch (n.type) {
      case 'heading': {
        const l = Number(n.attrs?.level ?? 1);
        return `<h${l}>${chuSangHtml(n.content)}</h${l}>`;
      }
      case 'paragraph': return `<p>${chuSangHtml(n.content)}</p>`;
      case 'bulletList': return `<ul>${(n.content ?? []).map(khoi).join('')}</ul>`;
      case 'orderedList': return `<ol>${(n.content ?? []).map(khoi).join('')}</ol>`;
      case 'listItem': return `<li>${(n.content ?? []).map(khoi).join('')}</li>`;
      case 'blockquote': return `<blockquote>${(n.content ?? []).map(khoi).join('')}</blockquote>`;
      case 'codeBlock': {
        const lg = String(n.attrs?.language ?? '');
        return `<pre${lg ? ` data-language="${thoat(lg)}"` : ''}><code>${thoat(n.content?.[0]?.text ?? '')}</code></pre>`;
      }
      case 'horizontalRule': return '<hr>';
      default: return '';
    }
  };
  return doc.content.map(khoi).join('');
}

/** Chữ thuần — dùng để hiện bản xem trước trên thẻ duyệt. */
export function tiptapSangChu(doc: TaiLieuTiptap): string {
  const chu = (n: NutTiptap): string => {
    if (n.text) return n.text;
    return (n.content ?? []).map(chu).join(n.type === 'paragraph' || n.type === 'heading' ? '' : '\n');
  };
  return doc.content.map(chu).join('\n').trim();
}
