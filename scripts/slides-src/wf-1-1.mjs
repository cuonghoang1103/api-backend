/** Web Foundations · deck bài 1.1 — Terminal. Output thật: bash trong môi trường sạch (_demo/_t1/terminal/chay.sh). */
import { deckWf, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const half = (k, i) => { const l = OUT[k].split('\n'); const m = Math.ceil(l.length / 2); return (i ? l.slice(m) : l.slice(0, m)).join('\n'); };
export const deck = { key: 'wf-1-1', code: 'WF 1.1', title: 'The terminal', sub: 'Web Foundations · Chapter 1' };

export const slides = deckWf({ chuong: 'Chapter 1 — Your toolbox', bai: '1.1' }, [
  { cover: true, t: 'The terminal', sub: 'Talking to your computer with words' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Know <b>where you are</b> and move around</li>
    <li>Read <b>absolute vs relative</b> paths</li>
    <li>Create, copy, move, <b>delete</b></li>
    <li>Handle <b>spaces</b> and <b>hidden files</b></li>
    <li>Use <b>wildcards, pipes</b> and <b>exit codes</b></li></ul>` },

  { t: 'Where am I?', giua: true, body: term('_t1/terminal/out/navigate', null, { title: 'pwd · ls · cd' }) },

  { t: 'Absolute and relative paths', giua: true, body: two(term('_t1/terminal/out/paths', null, { title: 'from inside projects/shop/src' }), tbl(['', 'means'], [['/…', 'absolute: from the root'], ['.', 'this folder'], ['..', 'parent'], ['~', 'home'], ['cd -', 'back']])) },

  { t: 'Files: create, copy, move, delete', giua: true, body: two(term(null, half('_t1/terminal/out/files', 0), { title: 'echo > · cat · cp · mv' }), term(null, half('_t1/terminal/out/files', 1), { title: 'rmdir · rm -r — no recycle bin' })) },

  { t: 'Spaces and hidden files', giua: true, body: two(term('_t1/terminal/out/spaces', null, { title: 'mkdir my project' }), term('_t1/terminal/out/hidden', null, { title: 'ls -a / ls -A' })) },

  { t: 'Wildcards and pipes', giua: true, body: two(term('_t1/terminal/out/globs', null, { title: '*.js is expanded first' }), term('_t1/terminal/out/pipes', null, { title: 'sort | uniq -c | head' })) },

  { t: 'Errors and exit codes', giua: true, body: term('_t1/terminal/out/errors', null, { title: 'echo $?' }) + tbl(['code', 'means'], [['0', 'success'], ['1', 'general error'], ['127', 'command not found']]) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>pwd · ls · cd · ..</li>
    <li>Relative paths start at pwd</li>
    <li>rm / > are permanent</li>
    <li>Quote names with spaces</li>
    <li>0 = success</li></ul>`,
    box('Practice (30 min)', 'Build practice/portfolio with mkdir -p, touch, echo >, mv — terminal only.<br><br><b>Done when</b>: ls -A matches and find . -type f | wc -l prints 5.', 'ok')) },
]);
