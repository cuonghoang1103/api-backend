/** Web Foundations · deck bài 5.5 — ES module. Output thật: _demo/5-5 (Chromium), _t5/out/module-file (file:// bị chặn). */
import { deckWf, js, html, con, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-5-5', code: 'WF 5.5', title: 'ES modules', sub: 'Web Foundations · Chapter 5' };
const APP = OUT['5-5/app'].split('\n');

export const slides = deckWf({ chuong: 'Chapter 5 — Asynchronous JavaScript', bai: '5.5' }, [
  { cover: true, t: 'ES modules', sub: 'Splitting a program into files that share only what they choose' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li><b>Export</b> and <b>import</b> with the right syntax</li>
    <li>Load modules in the <b>browser</b></li>
    <li>Explain <b>private scope</b> and <b>run once</b></li>
    <li>Fix the three classic <b>module errors</b></li>
    <li>Recognise modules in <b>Node.js and npm</b></li></ul>` },

  { t: 'Named and default exports', giua: true, body: `${two(js('5-5/mod/math.js', null, { gon: true }), js('5-5/mod/user.js', null, { gon: true }))}
    ${tbl(['Import', 'Gets'], [['{ add, PI }', 'named, exact names'], ['{ PI as pi }', 'renamed'], ['User', 'the default, any name'], ['* as math', 'everything as one object']])}` },

  { t: 'Running modules in the browser', giua: true, body: `${html('5-5/app.html', null, { chi: [5, 17] })}
    ${con(null, APP.slice(1, 7).join('\n'))}` },

  { t: 'A module runs once', to: true, giua: true, body: `${js('5-5/mod/counter.js', null, { gon: true })}
    ${two(con(null, APP[0] + '\n…\n' + APP[4]), steps(['Find all imports, download the graph', 'Link names: mismatches stop here', 'Run each module <b>once</b>, cache it']))}` },

  { t: 'Errors you will meet', giua: true, body: `${html('5-5/app.html', null, { chi: [19, 28] })}
    ${con(null, APP.slice(7).join('\n'))}
    ${box('In the browser', 'Paths are URLs: start with <code class="i">./</code> or <code class="i">../</code>, include <code class="i">.js</code>. Bare names like <code class="i">\'react\'</code> need Node or a bundler.', 'bad')}` },

  { t: 'Double-click does not work', to: true, giua: true, body: `${term('_t5/out/module-file', null, { title: 'the same app.html, opened as file:// (one error per module)' })}
    ${box('Serve it', 'Live Server, <code class="i">npx serve</code> or <code class="i">npx vite</code>. A file:// page has no origin, and modules follow network rules.', 'ok')}` },

  { t: 'Modules in Node.js and with npm', to: true, giua: true, body: tbl(['', 'ES modules', 'CommonJS (older Node)'], [
      ['Export', 'export function f() {}', 'module.exports = { f }'],
      ['Import', "import { f } from './f.js'", "const { f } = require('./f')"],
      ['Files', '.mjs, or "type": "module"', '.cjs, or .js by default'],
    ]) + box('Packages', "<code class=\"i\">import { format } from 'date-fns'</code> — found in node_modules by Node, or by a bundler like Vite.", 'info') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>export / import</li>
    <li>Private scope, runs once</li>
    <li>./ and .js in the browser</li>
    <li>Serve over HTTP</li></ul>`,
    box('Practice (40 min)', 'Split the todo app into tasks.js, storage.js, view.js and main.js.<br><br><b>Done when</b>: it works as before, <code class="i">typeof render</code> is “undefined” in the Console, and the Network tab shows four JS files.', 'ok')) },
]);
