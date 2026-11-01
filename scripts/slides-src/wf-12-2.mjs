/** Web Foundations · deck bài 12.2 — transition & animation. */
import { deckWf, html, css, js, con, anh, box, two, steps, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-12-2', code: 'WF 12.2', title: 'Transitions & animations', sub: 'Web Foundations · Chapter 12' };

export const slides = deckWf({ chuong: 'Chapter 12 — Advanced CSS', bai: '12.2' }, [
  { cover: true, t: 'Transitions & animations', sub: 'Motion that explains what changed — measured frame by frame, cheap for the browser, and kind to people who turn it off' },

  { t: 'After this lesson you can…', to: true, body: `<ul>
    <li>Add a <b>transition</b> and pick duration and easing on purpose</li>
    <li>Write <b>@keyframes</b> for loops (spinner) and one-shots (toast)</li>
    <li>Animate an "open/close" panel even though <code class="i">height: auto</code> will not animate</li>
    <li>Prefer <b>transform</b> and <b>opacity</b> — and say why</li>
    <li>Respect <b>prefers-reduced-motion</b></li></ul>
    ${box('Why', 'Good motion tells the user what just happened. Bad motion is slow, janky or makes some people physically ill.', 'info')}` },

  { t: 'A transition, measured every 250 ms', giua: true, body: `${css(null, `.bar { width: 100px; transition: width 1000ms linear; }
.bar.ease { transition-timing-function: ease; }
.bar.wide { width: 300px; }      /* adding this class starts the transition */`)}
    ${con('12-2/transition-sample')}
    ${two(box('linear', 'Equal steps: +50 px every 250 ms.', 'info'), box('ease', 'Fast start, gentle stop: 182 px already at 250 ms.', 'ok'))}` },

  { t: 'The transition shorthand', to: true, giua: true, body: `${css(null, `transition: <property> <duration> <timing-function> <delay>;
transition: background-color 200ms ease-out;
transition: transform 300ms ease, opacity 300ms ease;   /* two at once */`)}
    ${tbl(['Duration', 'Feels like'], [['100–200 ms', 'hover, press, colour change'], ['200–400 ms', 'panels, menus, cards'], ['> 500 ms', 'only for big, rare moments']])}` },

  { t: 'height: auto will not animate', body: `${con('12-2/height-auto')}
    ${two(box('Why', '<code class="i">auto</code> is not a number, so there is nothing to interpolate: the height jumps to 104 px at once.', 'bad'), box('The grid trick', '<code class="i">grid-template-rows: 0fr → 1fr</code> is numeric ⇒ it animates (29, 55, 81, 104 px). Child needs <code class="i">min-height: 0</code>.', 'ok'))}
    ${css(null, `.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 400ms; }
.panel.open { grid-template-rows: 1fr; }
.panel > div { min-height: 0; overflow: hidden; }`)}` },

  { t: '@keyframes: loops and one-shots', body: `${two(anh('12-2/keyframes.png', { w: 500 }), `${con('12-2/keyframes')}
    ${box('fill: both', 'Keeps the <code class="i">from</code> state before start and the <code class="i">to</code> state after the end.', 'info')}`)}
    ${css(null, `.spinner { animation: spin 800ms linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.toast { animation: slide-in 600ms ease-out both; }
@keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }`)}` },

  { t: 'Transition or animation?', to: true, giua: true, body: vsd('<ul><li>Between <b>two states</b> (A ⇄ B)</li><li>Triggered by a change: hover, class, focus</li><li>Reverses on its own</li></ul>', '<ul><li><b>Many steps</b> or loops</li><li>Runs on its own (on page load, infinite)</li><li>Spinners, skeletons, attention pulses</li></ul>', 'transition', '@keyframes animation') },

  { t: 'Cheap vs expensive properties', giua: true, body: `${con('12-2/left-vs-transform')}
    ${steps(['Changing <code class="i">left</code>, <code class="i">width</code>, <code class="i">top</code> ⇒ <b>layout</b> ⇒ paint ⇒ composite, every frame.', 'Changing <code class="i">transform</code>, <code class="i">opacity</code> ⇒ only <b>composite</b> (often on the GPU).', 'Measured here: transform did the same movement in about half the time.'])}
    ${box('Rule', 'Animate <code class="i">transform</code> and <code class="i">opacity</code>. Move with <code class="i">translate</code>, grow with <code class="i">scale</code>.', 'ok')}` },

  { t: 'Waiting for the end: transitionend', giua: true, body: `${js(null, `alertBox.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'opacity') alertBox.remove();   // one of the two events
});
button.addEventListener('click', () => alertBox.classList.add('leaving'));`)}
    ${con('12-2/transitionend')}
    ${box('Two properties ⇒ two events', 'Opacity and transform both fired. Act on ONE (<code class="i">e.propertyName === &#39;opacity&#39;</code>), or you remove/run things twice.', 'bad')}
    ${box('Safer today', '<code class="i">el.getAnimations()</code> + <code class="i">Promise.all(a.map(x =&gt; x.finished))</code> waits for every running animation.', 'info')}` },

  { t: 'prefers-reduced-motion', body: `${css('12-2/reduced-motion.css')}
    ${two(con('12-2/reduced-motion-normal', null, { title: 'Chromium · normal' }), con('12-2/reduced-motion-reduce', null, { title: 'Chromium · reduce' }))}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Transition = A ⇄ B; animation = keyframes</li>
    <li>100–400 ms; ease-out for entering</li>
    <li><code class="i">auto</code> does not animate ⇒ grid 0fr/1fr</li>
    <li>Animate transform &amp; opacity only</li>
    <li>Always handle reduced motion</li></ul>`,
    box('Practice (20 min)', 'Build an FAQ: clicking a question opens its answer with the grid trick (300 ms), the arrow icon rotates 180°, and a "Copied!" toast slides in and is removed after it fades out.<br><br><b>Done when</b>: the answer height animates, only transform/opacity/grid-template-rows are animated, the toast is gone from the DOM afterwards, and with reduced motion everything is instant.', 'ok')) },
]);
