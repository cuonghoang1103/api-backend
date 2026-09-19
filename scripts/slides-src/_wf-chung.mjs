/**
 * _wf-chung.mjs — phần dùng chung cho các deck của khoá Web Foundations:
 * CSS tô màu mã theo VS Code Dark+, hàm code(), và nhãn ⭐ FER202.
 *
 * ⚠️ CSS nhúng thẳng vào body của từng slide chứ không sửa `_render-slides.mjs`
 * — file dựng đó là của chung mọi môn, đụng vào là ảnh hưởng cả MAE101/SWR302.
 *
 * (Hai deck wf-js1 / wf-js2 làm trước file này nên vẫn giữ bản CSS chép tay
 * bên trong; chúng đã render và đẩy lên R2 rồi, sửa lại chỉ tạo rủi ro.)
 */
import hljs from 'highlight.js';

export const CSS = `<style>
.vs{background:#1e1e1e;border-radius:10px;padding:14px 16px;font-family:"SF Mono",Menlo,Consolas,monospace;
  font-size:18px;line-height:1.5;color:#d4d4d4;text-align:left;overflow:hidden}
.vs.sm{font-size:16px;line-height:1.45;padding:12px 14px}
.vs .hljs-keyword{color:#569cd6}.vs .hljs-string{color:#ce9178}.vs .hljs-number{color:#b5cea8}
.vs .hljs-comment{color:#6a9955;font-style:italic}.vs .hljs-title{color:#dcdcaa}
.vs .hljs-built_in{color:#4ec9b0}.vs .hljs-literal{color:#569cd6}.vs .hljs-regexp{color:#d16969}
.vs .hljs-variable,.vs .hljs-property,.vs .hljs-attr,.vs .hljs-params{color:#9cdcfe}
.vs .hljs-subst{color:#d4d4d4}.vs .hljs-tag{color:#569cd6}.vs .hljs-name{color:#4ec9b0}
.vs .hljs-selector-tag{color:#d7ba7d}.vs .hljs-selector-class{color:#d7ba7d}
.vs .hljs-selector-id{color:#d7ba7d}.vs .hljs-type{color:#4ec9b0}.vs .hljs-meta{color:#9cdcfe}
.fer{display:inline-block;background:#1b5fa8;color:#fff;font-size:15px;font-weight:800;
  padding:3px 10px;border-radius:20px;letter-spacing:.4px;vertical-align:middle;margin-left:8px}
.fer.hot{background:#c2410c}
.ghi{font-size:19px;color:#5d7288;margin-top:6px}
</style>`;

/** Khối mã tô màu. lang: javascript | xml | css | sql | bash | typescript | json */
export const code = (src, lang = 'javascript', cls = '') =>
  `${CSS}<pre class="vs ${cls}"><code>${hljs.highlight(src, { language: lang }).value}</code></pre>`;

/** Nhãn "sẽ gặp lại ở FER202". */
export const F = (t = 'FER202') => `<span class="fer">⭐ ${t}</span>`;
export const FH = (t = 'FER202') => `<span class="fer hot">⭐⭐ ${t}</span>`;
