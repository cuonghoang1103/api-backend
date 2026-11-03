/** Web Foundations · deck bài 2.5 — Bảng, media, khả năng tiếp cận. Ảnh + output thật: _demo/2-5, _t2/out. */
import { deckWf, html, con, term, anh, box, two, tbl, cards, steps, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-2-5', code: 'WF 2.5', title: 'Tables, media and accessibility', sub: 'Web Foundations · Chapter 2' };

export const slides = deckWf({ chuong: 'Chapter 2 — HTML', bai: '2.5' }, [
  { cover: true, t: 'Tables, media and accessibility', sub: 'The last kinds of content — and a five-minute check that everyone can use your page' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Mark up a <b>data table</b> a screen reader can read</li>
    <li>Embed <b>video and audio</b> with captions</li>
    <li>Measure colour <b>contrast</b> instead of guessing</li>
    <li>Keep a sensible <b>keyboard order</b></li>
    <li>Run a <b>five-minute check</b> on any page</li></ul>
    ${box('a11y', 'accessibility: “a”, eleven letters, “y”. A property of well-made HTML, not a separate feature.', 'info')}` },

  { t: 'A real table', giua: true, body: two(html(null, `<table>
  <caption>Exam results, Semester 1</caption>
  <thead>
    <tr><th scope="col">Student</th> … </tr>
  </thead>
  <tbody>
    <tr><th scope="row">An</th><td>9</td><td>8</td></tr>
  </tbody>
  <tfoot>
    <tr><td>Average</td><td colspan="2">8.25</td></tr>
  </tfoot>
</table>`, { gon: false }), `${anh('2-5/bang.png', { w: 500 })}
    ${con('2-5/bang')}`) },

  { t: 'What a screen reader gets', giua: true, body: two(term(null, OUT['_t2/out/aria-bang'].split('\n').slice(0, 13).join('\n') + '\n  …', { title: 'Chromium accessibility tree' }), `${box('On the cell “9”', 'The user hears <b>“An, HTML, 9”</b>. With bold <code class="i">td</code> instead of <code class="i">th</code> they hear only <b>“9”</b>.', 'ok')}
    ${box('Never for layout', 'Tables are for data. Page layout belongs to Flexbox and Grid.', 'bad')}`) },

  { t: 'Video and audio', giua: true, body: `${html('2-5/video.html', null, { chi: [6, 10] })}
    ${two(anh('2-5/video.png', { w: 360 }), con('2-5/video'))}` },

  { t: 'The four kinds of barrier', to: true, giua: true, body: `${cards([
      ['👁 Seeing', '<code class="i">alt</code>, headings, labels, contrast, never colour alone'],
      ['👂 Hearing', 'captions, transcripts'],
      ['⌨️ Moving', 'real controls, visible focus, big targets'],
      ['🧠 Understanding', 'plain language, <code class="i">lang</code>, consistent pages'],
    ], 2)}${box('Many are temporary', 'One hand holding a baby. Sunlight on a phone. A noisy café.', 'info')}` },

  { t: 'Contrast is a number', giua: true, body: `${two(anh('2-5/tuong-phan.png', { w: 500 }), con('2-5/tuong-phan', null, { title: 'WCAG formula, real colours' }), 'r46')}
    ${box('AA', 'Normal text needs <b>4.5:1</b>, large text 3:1. DevTools shows the ratio on the colour swatch. Never carry meaning by colour alone.', 'ok')}` },

  { t: 'Keyboard order', giua: true, body: `${html('2-5/tab-thu-tu.html', null, { chi: [5, 10] })}
    ${two(term('_t2/out/tab-thu-tu', null, { title: 'real Tab key' }), tbl(['tabindex', 'Means'], [['0', 'join the normal order'], ['-1', 'script can focus; Tab skips'], ['1+', 'never: breaks the whole page']]))}` },

  { t: 'A five-minute checklist', to: true, giua: true, body: steps([
      '<b>Keyboard only</b>: reach and use everything, focus visible',
      '<b>Outline</b>: one <code class="i">h1</code>, no skipped levels',
      '<b>Images and labels</b>: <code class="i">alt</code>, labels, names on icon buttons',
      '<b>Lighthouse</b> → Accessibility: finds the easy third',
      '<b>Zoom to 200%</b>: nothing cut off',
    ]) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Tables = data; <code class="i">th scope</code></li>
    <li><code class="i">video controls</code> + captions</li>
    <li>Contrast ≥ 4.5:1</li>
    <li>Tab follows the document</li>
    <li>Never remove the focus ring</li></ul>`,
    box('Practice (30 min)', 'A semester report page: a real table, a video with captions, your own colours.<br><br><b>Done when</b>: Tab works, Lighthouse gives 100 (or you can explain each item), all text is ≥ 4.5:1, captions show.', 'ok')) },
]);
