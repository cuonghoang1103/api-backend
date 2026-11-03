/** Web Foundations · deck bài 1.3 — Git cục bộ. Output thật: Git 2.51 trong thư mục tạm (_demo/_t1/git/chay.sh). */
import { deckWf, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const dong = (k, a, b) => OUT[k].split('\n').slice(a, b).join('\n');

const half = (k, i) => { const l = OUT[k].split('\n'); const m = Math.ceil(l.length / 2); return (i ? l.slice(m) : l.slice(0, m)).join('\n'); };
export const deck = { key: 'wf-1-3', code: 'WF 1.3', title: 'Git: a time machine for your code', sub: 'Web Foundations · Chapter 1' };

export const slides = deckWf({ chuong: 'Chapter 1 — Your toolbox', bai: '1.3' }, [
  { cover: true, t: 'Git: a time machine', sub: 'Snapshots of your code you can always go back to' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Start a repo and <b>commit</b></li>
    <li>Explain the <b>three areas</b></li>
    <li><b>Undo</b> edits, staging and commits safely</li>
    <li>Keep junk and secrets out with <b>.gitignore</b></li>
    <li>Use a <b>branch</b></li></ul>` },

  { t: 'The first commit', giua: true, body: term('_t1/git/out/first-commit', null, { title: 'init · status · add · commit · log' }) },

  { t: 'Three areas', giua: true, body: term(null, dong('_t1/git/out/three-areas', 0, 16), { title: 'diff vs diff --staged' }) + steps(['<b>working folder</b> — git diff', '<b>staging</b> — git diff --staged', '<b>history</b> — git log']) },

  { t: 'Undo, safely', giua: true, body: tbl(['Situation', 'Command'], [['discard an edit', 'git restore file'], ['unstage', 'git restore --staged file'], ['undo a commit', 'git revert &lt;id&gt;'], ['see an old version', 'git show &lt;id&gt;:file']]) + term(null, dong('_t1/git/out/undo', 16, 28), { title: 'git revert' }) },

  { t: '.gitignore', giua: true, body: term('_t1/git/out/gitignore', null, { title: 'node_modules/ · .env · *.log' }) },

  { t: 'Ignoring is too late once committed', giua: true, body: two(term(null, half('_t1/git/out/env-mistake', 0), { title: '.env committed first' }), term(null, half('_t1/git/out/env-mistake', 1), { title: 'still in history — revoke the key' })) },

  { t: 'Branches', giua: true, body: two(term(null, half('_t1/git/out/branch', 0), { title: 'switch -c · commit · graph' }), term(null, half('_t1/git/out/branch', 1), { title: 'merge (fast-forward) · branch -d' })) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>status → add → commit</li>
    <li>diff / diff --staged</li>
    <li>restore · revert</li>
    <li>.gitignore first</li>
    <li>branch + merge</li></ul>`,
    box('Practice (35 min)', 'Put practice/portfolio under Git: .gitignore first, 3 commits, a restore, a revert, a merged branch.<br><br><b>Done when</b>: 6+ commits and a clean status.', 'ok')) },
]);
