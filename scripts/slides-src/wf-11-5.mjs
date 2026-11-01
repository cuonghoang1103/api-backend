/** Web Foundations · deck bài 11.5 — Regex vừa đủ dùng. */
import { deckWf, js, con, box, two, steps, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-11-5', code: 'WF 11.5', title: 'Regular expressions', sub: 'Web Foundations · Chapter 11' };

export const slides = deckWf({ chuong: 'Chapter 11 — Advanced JavaScript', bai: '11.5' }, [
  { cover: true, t: 'Regular expressions', sub: 'Just enough to validate input, extract parts and clean text — and to know when to stop' },

  { t: 'After this lesson you can…', to: true, body: `<ul>
    <li>Read and write the <b>dozen symbols</b> that cover 90% of real patterns</li>
    <li>Validate a phone number, a file extension, a date</li>
    <li><b>Extract</b> parts with groups and <b>rewrite</b> text with <code class="i">replace</code></li>
    <li>Avoid the <code class="i">g</code>-flag, greedy and Vietnamese-text traps</li>
    <li>Recognise a pattern that can <b>freeze</b> a page (ReDoS)</li></ul>
    ${box('Why', 'Form validation, search, slugs, log parsing, routing in frameworks — all use regex. You will read more of them than you write.', 'info')}` },

  { t: 'A regex is a tiny pattern language', body: `${js('11-5/basics.mjs')}
    ${two(con('11-5/basics'), steps(['<code class="i">/…/flags</code> literal, or <code class="i">new RegExp(str, flags)</code>', '<code class="i">test</code> ⇒ true / false', '<code class="i">match</code> ⇒ first match, or all with <code class="i">g</code>, or <code class="i">null</code>']))}` },

  { t: 'The symbols you actually need', giua: true, body: tbl(['Symbol', 'Means', 'Example'], [
      ['\\d  \\w  \\s', 'digit · word char (a-z, 0-9, _) · whitespace', '\\d{3} = three digits'],
      ['.', 'any character except newline', 'a.c ⇒ abc, a-c'],
      ['[abc]  [^abc]  [a-z]', 'one of · none of · a range', '[35789]'],
      ['^  $', 'start · end of the text', '^\\d+$ = only digits'],
      ['*  +  ?', '0+ · 1+ · 0 or 1 times', 'colou?r'],
      ['{n}  {n,m}', 'exactly n · n to m times', '\\d{8,11}'],
      ['a|b  ( )', 'or · group', '(jpg|png)'],
      ['flags i g u', 'ignore case · all matches · Unicode', '/abc/gi'],
    ]) + box('Escape special characters', 'To match a literal dot write <code class="i">\\.</code>; a literal <code class="i">$</code> is <code class="i">\\$</code>.', 'info') },

  { t: 'Test them one by one', giua: true, body: `${con('11-5/symbols')}
    ${box('Anchors matter', 'Without <code class="i">^</code> and <code class="i">$</code>, <code class="i">/\\d{10}/</code> also accepts "abc0912345678xyz". For validation, anchor both ends.', 'bad')}
    ${box('Read a pattern left to right', '<code class="i">^0[35789]\\d{8}$</code> = start · a 0 · one of 3,5,7,8,9 · exactly 8 digits · end.', 'info')}` },

  { t: 'Groups: extract and rewrite', body: `${js('11-5/groups.mjs')}
    ${two(con('11-5/groups'), box('', '<code class="i">( )</code> captures; <code class="i">(?&lt;name&gt; )</code> names it; <code class="i">$1</code> reuses it in <code class="i">replace</code>; <code class="i">matchAll</code> gives every match with its groups.', 'ok'))}` },

  { t: 'Trap: the g flag remembers', giua: true, body: two(js('11-5/global-trap.mjs'), `${con('11-5/global-trap')}
    ${box('Why', 'With <code class="i">g</code>, <code class="i">test</code> continues from <code class="i">lastIndex</code>. Same input, alternating answers.', 'bad')}
    ${box('Rule', 'For yes/no checks, do not use <code class="i">g</code>.', 'ok')}`, 'r64') },

  { t: 'Greedy vs lazy', giua: true, body: `${js('11-5/greedy.mjs')}
    ${con('11-5/greedy')}
    ${vsd('<code class="i">.+</code> grabs as much as possible, then backs off ⇒ the whole string.', '<code class="i">.+?</code> stops as early as possible — or say exactly what is allowed: <code class="i">[^&gt;]+</code>.', 'Greedy', 'Lazy / precise')}` },

  { t: 'Vietnamese text: \\w and \\b are ASCII', body: `${js('11-5/vietnamese.mjs')}
    ${con('11-5/vietnamese')}` },

  { t: 'Validation: good enough, then stop', giua: true, body: two(js('11-5/email.mjs'), `${con('11-5/email')}
    ${box('Do not chase the perfect e-mail regex', 'Use <code class="i">&lt;input type="email"&gt;</code> + a simple check, then send a confirmation e-mail. Only that proves the address works.', 'info')}`, 'r64') },

  { t: 'Cleaning text', body: two(js('11-5/split-clean.mjs'), `${con('11-5/split-clean')}
    ${box('', '<code class="i">split(/[,;]/)</code> splits on several separators; <code class="i">\\s+</code> collapses spaces; <code class="i">\\p{M}</code> + <code class="i">u</code> strips accents for a slug.', 'ok')}`, 'r64') },

  { t: 'ReDoS: a pattern that freezes the page', body: `${js('11-5/redos.mjs')}
    ${two(con('11-5/redos'), box('Measured in Chromium', 'Each +2 characters ≈ ×4 time. At n = 40 it would take hours — the tab freezes. Avoid nested quantifiers like <code class="i">(a+)+</code>.', 'bad'))}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Anchor validation with <code class="i">^…$</code></li>
    <li>Groups extract; <code class="i">$1</code> rewrites</li>
    <li>No <code class="i">g</code> for yes/no tests</li>
    <li>Vietnamese ⇒ <code class="i">\\p{L}</code> + <code class="i">u</code></li>
    <li>Keep patterns simple — no nested <code class="i">+</code></li></ul>`,
    box('Practice (20 min)', 'Write <code class="i">isVnMobile(s)</code>, <code class="i">toIsoDate("01/11/2026")</code> ⇒ <code class="i">"2026-11-01"</code>, and <code class="i">slugify("Học CSS Nâng Cao!")</code> ⇒ <code class="i">"hoc-css-nang-cao"</code>.<br><br><b>Done when</b>: <code class="i">isVnMobile</code> accepts 09…/03… with 10 digits and rejects spaces and 02…; an invalid date returns <code class="i">null</code>.', 'ok')) },
]);
