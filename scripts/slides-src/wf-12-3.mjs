/** Web Foundations · deck bài 12.3 — đặt tên và tổ chức CSS. */
import { deckWf, html, css, js, con, anh, box, two, steps, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-12-3', code: 'WF 12.3', title: 'Organising CSS', sub: 'Web Foundations · Chapter 12' };

export const slides = deckWf({ chuong: 'Chapter 12 — Advanced CSS', bai: '12.3' }, [
  { cover: true, t: 'Naming & organising CSS', sub: 'Why CSS turns into a mess on real projects — and four tools that keep it calm: BEM, layers, :where() and scoped styles' },

  { t: 'After this lesson you can…', giua: true, to: true, body: `<ul>
    <li>Explain the two root problems: <b>global names</b> and <b>specificity wars</b></li>
    <li>Name classes with <b>BEM</b>: block__element--modifier</li>
    <li>Order whole groups of styles with <b>@layer</b></li>
    <li>Write overridable defaults with <b>:where()</b></li>
    <li>Know what <b>CSS Modules</b> and utility classes (Tailwind) do</li></ul>
    ${box('Why', 'On a team, CSS fails slowly: every fix adds a stronger selector, until nobody dares to delete anything.', 'info')}` },

  { t: 'Problem 1: every class name is global', giua: true, body: `${anh('12-3/global-leak.png', { w: 640 })}
    ${two(con('12-3/global-leak'), box('What happened', 'Minh’s footer rule reused the name <code class="i">.title</code>. Same specificity, later in the file ⇒ it wins everywhere, including Lan’s card.', 'bad'))}` },

  { t: 'Problem 2: the specificity war', giua: true, body: two(css(null, `.btn { background: blue; }
#sidebar .btn { background: red; }      /* 1,1,0 */
.btn-danger { background: orange; }     /* 0,1,0 */
.btn-danger.btn-danger.btn-danger {     /* 0,3,0 */
  background: orange; }
.btn-final { background: green !important; }`), `${con('12-3/specificity-war')}
    ${box('', 'An id beats any number of classes. Each "fix" escalates — until <code class="i">!important</code>, and then <code class="i">!important</code> wars.', 'bad')}`) },

  { t: 'BEM: block__element--modifier', giua: true, body: two(`${anh('12-3/bem.png', { w: 540 })}${con('12-3/bem')}`, css(null, `.product-card { … }               /* Block */
.product-card__title { … }        /* Element */
.product-card__price { … }
.product-card__button { … }
.product-card--featured { … }     /* Modifier */
.product-card__button--disabled { … }`)) },

  { t: 'Why BEM works', to: true, giua: true, body: steps([
      '<b>One class per selector</b> ⇒ every rule has the same specificity (0,1,0). No wars.',
      '<b>The block name is a namespace</b> ⇒ <code class="i">.product-card__title</code> cannot collide with the footer.',
      '<b>Modifiers are explicit</b> ⇒ <code class="i">--featured</code> reads like documentation.',
      '<b>No nesting by tag</b> ⇒ you can change <code class="i">h3</code> to <code class="i">h2</code> without breaking styles.',
    ]) + box('Measured on the demo page', 'Every selector on the demo page (except body) is a single class — so source order alone decides ties, and nothing needs !important.', 'ok') },

  { t: 'Cascade layers: order beats specificity', giua: true, body: two(css(null, `@layer reset, base, components, utilities;

@layer components {
  #checkout .btn { background: blue; }
}
@layer utilities {
  .bg-green { background: green; }
}
/* outside any layer: beats every layer */
.btn.legacy { background: gray; }`), `${con('12-3/layers')}
    ${box('', 'A one-class utility beat an id selector because its <b>layer</b> comes later. Specificity only matters <i>inside</i> a layer.', 'ok')}`, 'r46') },

  { t: ':where() vs :is()', giua: true, body: `${css(null, `:where(.lib-card) h3 { color: red; }   /* specificity (0,0,1): easy to override */
:is(.lib-panel) h3   { color: red; }   /* specificity (0,1,1): keeps the class  */
h3 { color: blue; }                    /* your rule */`)}
    ${con('12-3/where-is')}
    ${box('Use', 'Write library or reset defaults inside <code class="i">:where()</code> so any user selector wins.', 'ok')}` },

  { t: 'Scoped styles: what CSS Modules do', giua: true, body: `${con('12-3/modules-sim')}
    ${js(null, `import styles from './Card.module.css';      // { title: 'title_2leku' }
export function Card({ name }) {
  return <h3 className={styles.title}>{name}</h3>;
}`)}
    ${two(box('Build step', '<code class="i">Card.module.css</code>: <code class="i">.title</code> ⇒ <code class="i">.title_2leku</code>. Each file gets unique class names, so collisions are impossible.', 'ok'), box('In React / Next.js', '<code class="i">import styles from "./Card.module.css"</code> then <code class="i">className={styles.title}</code>.', 'info'))}` },

  { t: 'Four approaches, side by side', giua: true, to: true, body: tbl(['Approach', 'Idea', 'Good for'], [
      ['BEM', 'naming convention, plain CSS', 'any project, no tooling'],
      ['CSS Modules', 'build step renames classes per file', 'React / Next.js components'],
      ['Utility-first (Tailwind)', 'tiny single-purpose classes in HTML', 'fast UI work, design systems'],
      ['@layer + :where()', 'browser-native ordering', 'combining resets, libraries, your code'],
    ]) + box('They combine', 'A real app often uses layers for order, Modules or BEM for components, and a few utilities.', 'info') },

  { t: 'A file structure that scales', giua: true, to: true, body: two(`<pre class="vs sm" style="white-space:pre">styles/
  reset.css        @layer reset
  tokens.css       :root variables (12.4)
  base.css         @layer base — body, a, h1…
  components/
    product-card.css   @layer components
    site-header.css
  utilities.css    @layer utilities
main.css           @import in that order</pre>`, steps(['One component ⇒ one file', 'Order is declared once, in <code class="i">@layer</code>', 'Tokens in one place', 'Delete a component ⇒ delete its file']), 'r64') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Global names collide ⇒ namespace them</li>
    <li>Keep selectors at one class</li>
    <li>No ids, no <code class="i">!important</code> in components</li>
    <li><code class="i">@layer</code> for order, <code class="i">:where()</code> for defaults</li></ul>`,
    box('Practice (20 min)', 'Refactor a messy navbar (ids, nested selectors, two <code class="i">!important</code>) into BEM inside <code class="i">@layer components</code>, plus one utility <code class="i">.hidden</code> in <code class="i">@layer utilities</code>.<br><br><b>Done when</b>: no id selectors and no <code class="i">!important</code> remain, every selector is a single class, and <code class="i">.hidden</code> still hides a nav link.', 'ok')) },
]);
