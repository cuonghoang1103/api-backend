/**
 * cloud-aws/_chung.mjs — tiện ích chung cho các chương khoá Cloud AWS (19/11/2026; chép từ spring-boot/_chung.mjs, thêm json/hcl/js).
 *
 * Khoá Node.js tô màu mã bằng tay (<span class="tok-keyword">…). Java dài hơn nhiều nên ở đây tô bằng một bộ tách token nhỏ:
 *   ${java(`…mã Java…`)}  ${bash(`…`)}  ${yml(`…`)}  ${xml(`…`)}  ${props(`…`)}  ${sql(`…`)}  ${out(`…output thật…`)}
 * Lớp CSS dùng đúng các lớp frontend đã có: tok-keyword / tok-string / tok-comment / tok-number / tok-function / tok-type.
 * Lưu ý khi viết mã mẫu trong template literal: `${` phải viết \${ ; dấu \ trong chuỗi Java phải viết \\.
 */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;');

const JAVA_KW = new Set(('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record sealed permits non yield true false null').split(' '));

/** Tô một đoạn mã kiểu C (Java/SQL…) theo bộ từ khoá cho trước. */
function toMau(src, kw, { caseInsensitive = false, annot = true } = {}) {
  const re = /(\/\/[^\n]*|--[^\n]*|\/\*[\s\S]*?\*\/)|("""[\s\S]*?"""|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(@[A-Za-z_][\w.]*)|(\b\d[\d_]*(?:\.\d+)?[LlFfDd]?\b)|([A-Za-z_$][\w$]*)(\s*\()?|([\s\S])/g;
  let html = '';
  let m;
  while ((m = re.exec(src))) {
    const [, cmt, str, at, num, word, paren, other] = m;
    if (cmt !== undefined) {
      // "--" chỉ là chú thích trong SQL; trong Java "--" là toán tử giảm
      if (cmt.startsWith('--') && kw === JAVA_KW) { html += esc('--'); re.lastIndex = m.index + 2; continue; }
      html += `<span class="tok-comment">${esc(cmt)}</span>`;
    } else if (str !== undefined) html += `<span class="tok-string">${esc(str)}</span>`;
    else if (at !== undefined) html += annot ? `<span class="tok-type">${esc(at)}</span>` : esc(at);
    else if (num !== undefined) html += `<span class="tok-number">${num}</span>`;
    else if (word !== undefined) {
      const w = caseInsensitive ? word.toLowerCase() : word;
      if (kw.has(w)) html += `<span class="tok-keyword">${word}</span>`;
      else if (paren) html += `<span class="tok-function">${word}</span>`;
      else if (/^[A-Z][a-z0-9]\w*$/.test(word) && kw === JAVA_KW) html += `<span class="tok-type">${word}</span>`;
      else html += word;
      if (paren) html += paren;
    } else html += esc(other);
  }
  return html;
}

const SQL_KW = new Set(('select from where and or not insert into values update set delete create table index primary key references on join left right inner outer group by order having limit offset as in is null default unique constraint alter add drop if exists begin commit rollback union all distinct text integer int bigint serial bigserial varchar timestamptz boolean check returning for share nowait skip locked').split(' '));

const pre = (lang, body) => `<pre><code class="language-${lang}">${body}</code></pre>`;

export const java = (src) => pre('java', toMau(src.replace(/^\n/, ''), JAVA_KW));
export const sql = (src) => pre('sql', toMau(src.replace(/^\n/, ''), SQL_KW, { caseInsensitive: true, annot: false }));

/** bash: chỉ tô chú thích # ở đầu dòng; còn lại để nguyên (giống khoá Node.js). */
export const bash = (src) => pre('bash', src.replace(/^\n/, '').split('\n')
  .map((l) => (/^\s*#/.test(l) ? `<span class="tok-comment">${esc(l)}</span>` : esc(l))).join('\n'));

/** YAML / properties: khoá tô tok-function, chú thích tok-comment, giá trị để nguyên. */
export const yml = (src) => pre('yaml', src.replace(/^\n/, '').split('\n').map((l) => {
  if (/^\s*#/.test(l)) return `<span class="tok-comment">${esc(l)}</span>`;
  const m = l.match(/^(\s*-?\s*)([\w.\-]+)(:)(.*)$/);
  return m ? `${esc(m[1])}<span class="tok-function">${esc(m[2])}</span>${m[3]}${esc(m[4])}` : esc(l);
}).join('\n'));
export const props = (src) => pre('properties', src.replace(/^\n/, '').split('\n').map((l) => {
  if (/^\s*#/.test(l)) return `<span class="tok-comment">${esc(l)}</span>`;
  const m = l.match(/^([\w.\-\[\]]+)(=)(.*)$/);
  return m ? `<span class="tok-function">${esc(m[1])}</span>=${esc(m[3])}` : esc(l);
}).join('\n'));

/** XML (pom.xml): tên thẻ tok-keyword, chú thích tok-comment. */
export const xml = (src) => pre('xml', esc(src.replace(/^\n/, ''))
  .replace(/&lt;!--[\s\S]*?--&gt;/g, (c) => `<span class="tok-comment">${c}</span>`)
  .replace(/(&lt;\/?)([\w.\-]+)/g, '$1<span class="tok-keyword">$2</span>'));

/** Output thật (đã chạy trên máy) — để nguyên chữ, chỉ escape. */
export const out = (txt) => `<div class="out">${esc(txt.replace(/^\n/, ''))}</div>`;

/** Thẻ liên kết tài liệu ngoài. */
export const tl = (href, ico, title, sub) => `<a class="link-card dl" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
</a>`;

/** Khối lời giải ẩn (lab/bài tập): người học bấm mới mở. */
export const giai = (tomTat, noiDung) => `<details><summary>${tomTat}</summary>\n${noiDung}\n</details>`;

const JS_KW = new Set(('const let var function return if else for while of in new await async import from export default class extends try catch finally throw typeof true false null undefined this').split(' '));
export const js = (src) => pre('javascript', toMau(src.replace(/^\n/, ''), JS_KW, { annot: false }));

/** JSON (policy IAM, output CLI): khoá tok-function, chuỗi giá trị tok-string, số tok-number. */
export const json = (src) => pre('json', esc(src.replace(/^\n/, ''))
  .replace(/("(?:[^"\\\n]|\\.)*")(\s*:)?/g, (m, str, colon) => colon ? `<span class="tok-function">${str}</span>${colon}` : `<span class="tok-string">${str}</span>`)
  .replace(/\b(true|false|null)\b/g, '<span class="tok-keyword">$1</span>'));

/** HCL (Terraform): từ khoá khối tok-keyword, chuỗi tok-string, chú thích tok-comment. */
const HCL_KW = new Set(('resource data variable output locals module provider terraform required_providers backend true false null for in if').split(' '));
export const hcl = (src) => pre('hcl', toMau(src.replace(/^\n/, '').replace(/#/g, '//#'), HCL_KW, { annot: false }).replace(/\/\/#/g, '#'));

/** Ghi chú phiên bản đo thật dùng chung cả khoá. */
export const PHIEN_BAN = 'AWS CLI 2.41.0 · LocalStack 4.12.0 (community) · Terraform 1.17.2 · Node.js 22 · @aws-sdk/client-s3 v3';
