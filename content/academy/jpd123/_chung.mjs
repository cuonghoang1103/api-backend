/**
 * JPD123 — bộ dựng dùng chung cho các bài "dẫn đường" của Academy (22/11/2026).
 *
 * Nội dung dạy JPD123 (Dekiru Bài 4–7) ĐÃ CÓ rất dày ở khoá できる日本語 trên web
 * (`/language/ja/dekiru`, app `/jp`; mã: frontend/src/app/language/[code]/dekiru/bai/).
 * Academy KHÔNG chép lại — chỉ dẫn sang đúng mục bằng link-card. Mỗi bài viết MỘT lần
 * dưới dạng hàm `(L) => html`, chạy hai lượt EN rồi VI (`L.t('English', 'Tiếng Việt')`).
 */

export const REF = 'ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2';

/** URL tới một mục của khoá Dekiru trên web: id mục (vd. 'b4-ngu-phap') hoặc { buoi: n }. */
export const dk = (id) => (typeof id === 'object' ? `/language/ja/dekiru?buoi=${id.buoi}&${REF}` : `/language/ja/dekiru?bai=${id}&${REF}`);

function mkL(lang) {
  const t = (en, vi) => (lang === 'en' ? en : vi);
  const pick = (x) => (Array.isArray(x) ? t(x[0], x[1]) : x);
  const amp = (x) => pick(x).replace(/&(?![a-zA-Z]+;|#\d+;)/g, '&amp;');
  return {
    lang, t,
    /** Bảng: head [[en,vi]|str], rows [[cell|[en,vi]]]. */
    bang: (head, rows) => `<table>
  <thead><tr>${head.map((h) => `<th>${pick(h)}</th>`).join('')}</tr></thead>
  <tbody>
${rows.map((r) => `    <tr>${r.map((c) => `<td>${pick(c)}</td>`).join('')}</tr>`).join('\n')}
  </tbody>
</table>`,
    /** Thẻ link sang khoá Dekiru (id mục) hoặc URL nội bộ bất kỳ. */
    the: (target, ico, title, sub, cta = 'DEKIRU →') => {
      const href = target.startsWith('/') ? `${target}${target.includes('?') ? '&' : '?'}${REF}` : dk(target);
      return `<a class="link-card codelab" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${amp(title)}</span><span class="lc-sub">${amp(sub)}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
    },
    /** Link chữ ngắn tới một mục Dekiru (dùng trong ô bảng). */
    a: (id, text) => `<a href="${dk(id)}" target="_blank" rel="noopener">${pick(text)}</a>`,
  };
}

/** Bài đọc (DOCUMENT) song ngữ. body = (L) => html. */
export function bai(slug, title, description, body, extra = {}) {
  const content = `
<div class="ml-en">
${body(mkL('en'))}
</div>
<div class="ml-vi">
${body(mkL('vi'))}
</div>
`;
  if (content.includes('${')) throw new Error(`${slug}: còn chuỗi \${ trong nội dung`);
  if (title.length > 255) throw new Error(`${slug}: title ${title.length} ký tự`);
  return { title, slug, type: 'DOCUMENT', description, content, ...extra };
}

/**
 * Chèn link-card vào CUỐI hai khối ml-en / ml-vi của một bài đã có (không xoá chữ nào).
 * cards = (L) => html.
 */
export function chenCuoi(lesson, cards) {
  const c = lesson.content || '';
  const iVi = c.indexOf('<div class="ml-vi">');
  if (iVi < 0) return lesson;
  const enEnd = c.lastIndexOf('</div>', iVi);
  const viEnd = c.lastIndexOf('</div>');
  if (enEnd < 0 || viEnd <= iVi) return lesson;
  const en = cards(mkL('en')), vi = cards(mkL('vi'));
  const content = c.slice(0, enEnd) + en + '\n' + c.slice(enEnd, viEnd) + vi + '\n' + c.slice(viEnd);
  return { ...lesson, content };
}
