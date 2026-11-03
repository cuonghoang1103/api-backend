/** Web Foundations · deck bài 12.4 — design token & chế độ sáng/tối. */
import { deckWf, html, css, js, con, anh, box, two, steps, tbl, vsd, OUT } from './_wf-bai.mjs';

const OUT_THEMES = 'light: ' + OUT['12-4/theme-light'] + '\ndark:  ' + OUT['12-4/theme-dark'];

export const deck = { key: 'wf-12-4', code: 'WF 12.4', title: 'Design tokens & theming', sub: 'Web Foundations · Chapter 12' };

export const slides = deckWf({ chuong: 'Chapter 12 — Advanced CSS', bai: '12.4' }, [
  { cover: true, t: 'Design tokens & theming', sub: 'One place for every colour, size and radius — and a dark mode that is a few lines, not a second stylesheet' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Store design decisions as <b>CSS custom properties</b> (tokens)</li>
    <li>Separate <b>primitive</b> tokens from <b>semantic</b> ones</li>
    <li>Follow the OS with <b>prefers-color-scheme</b></li>
    <li>Add a <b>theme switch</b> that remembers — without a flash</li>
    <li>Check colour pairs against <b>WCAG contrast</b></li></ul>
    ${box('Why', 'Changing the brand colour should be one line. Dark mode is expected by users and required by many teams.', 'info')}` },

  { t: 'Three layers of tokens', giua: true, body: two(css('12-4/theme.css', null, { chi: [1, 20] }), steps(['<b>Primitive</b>: the raw palette — <code class="i">--blue-600</code>. Never used by components.', '<b>Semantic</b>: what a colour is <i>for</i> — <code class="i">--color-primary</code>, <code class="i">--color-bg</code>.', '<b>Component</b> CSS uses semantic tokens only.'])) },

  { t: 'Dark mode = swap the semantic layer', giua: true, body: `${css('12-4/theme.css', null, { chi: [22, 38] })}
    ${box('Components do not change', '<code class="i">.btn</code> still says <code class="i">var(--color-primary)</code>. Only the meaning of the token changes.', 'ok')}` },

  { t: 'Same HTML, two OS settings', giua: true, body: `${two(anh('12-4/theme-light.png', { w: 520 }), anh('12-4/theme-dark.png', { w: 520 }))}
    ${con(null, OUT_THEMES)}` },

  { t: 'A theme switch that remembers', giua: true, body: two(js('12-4/toggle.html', null, { chi: [8, 12] }), `${con('12-4/toggle')}
    ${box('No flash', 'The saved theme is applied by a tiny script in <code class="i">&lt;head&gt;</code>, <b>before</b> the body is painted.', 'ok')}
    ${box('Priority', 'saved choice (<code class="i">data-theme</code>) ⇒ OS setting ⇒ light.', 'info')}`, 'r64') },

  { t: 'Custom property traps', giua: true, body: `${css('12-4/var-traps.html', null, { chi: [7, 12] })}
    ${con('12-4/var-traps')}` },

  { t: 'Why var(--size) gave 984px', to: true, giua: true, body: steps([
      'Custom properties are <b>untyped text</b>: <code class="i">--size: 20</code> stores the characters "20".',
      '<code class="i">width: var(--size)</code> becomes <code class="i">width: 20</code> — no unit ⇒ <b>invalid at computed-value time</b>.',
      'The browser does not report an error; it uses the <b>initial</b> value (<code class="i">auto</code> ⇒ full width).',
      'Fix: store <code class="i">20px</code>, or <code class="i">calc(var(--size) * 1px)</code>.',
    ]) + box('Typos too', '<code class="i">var(--brnad, red)</code> silently uses the fallback. Lint your tokens or keep a list.', 'bad') },

  { t: 'Contrast: measure, do not guess', giua: true, body: `${con('12-4/contrast')}
    ${box('WCAG AA', 'Normal text needs at least <b>4.5 : 1</b>; large text 3 : 1. Check every semantic pair in <b>both</b> themes.', 'info')}` },

  { t: 'Tokens beyond colour', giua: true, body: `${css(null, `:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
  --radius-sm: 6px;  --radius-md: 10px;
  --font-size-sm: 0.875rem;  --font-size-lg: 1.25rem;
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.12);
  --z-modal: 400;                     /* the z-index scale from 12.1 */
  --duration-fast: 150ms;             /* motion tokens (12.2) */
}`)}
    ${box('Rule of thumb', 'If a value appears in more than one component, it is a token.', 'ok')}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Primitive ⇒ semantic ⇒ component</li>
    <li>Dark mode swaps semantic tokens</li>
    <li>Saved choice in <code class="i">&lt;head&gt;</code> ⇒ no flash</li>
    <li>Units belong in the token</li>
    <li>Check contrast in both themes</li></ul>`,
    box('Practice (20 min)', 'Take your 12.3 navbar page: add primitive + semantic tokens, a dark theme via <code class="i">prefers-color-scheme</code> and <code class="i">[data-theme]</code>, and a toggle button that saves to localStorage.<br><br><b>Done when</b>: no hex colour appears outside <code class="i">:root</code>, reloading keeps the chosen theme with no flash, and every text/background pair is ≥ 4.5 : 1.', 'ok')) },
]);
