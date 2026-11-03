/** Web Foundations · deck bài 10.3 — Quy trình Git. Output thật: _demo/_t10/10-3/chay.sh (Git 2.51, An + Bình + origin trần). */
import { deckWf, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const dong = (k, a, b) => OUT[k].split('\n').slice(a, b).join('\n');

export const deck = { key: 'wf-10-3', code: 'WF 10.3', title: 'Git workflow for real work', sub: 'Web Foundations · Chapter 10' };

export const slides = deckWf({ chuong: 'Chapter 10 — Thinking, debugging, Git', bai: '10.3' }, [
  { cover: true, t: 'Git workflow for real work', sub: 'Branches, pull requests, rejected pushes and real conflicts' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Use <b>one branch per change</b></li>
    <li>Make <b>small commits</b> with clear messages</li>
    <li>Read what a <b>pull request</b> contains</li>
    <li>Handle a <b>rejected push</b></li>
    <li><b>Resolve</b> a merge conflict</li></ul>` },

  { t: 'One branch per change', giua: true, body: term(null, dong('_t10/out/git-branch', 0, 12), { title: 'An: feature/search' }) + box('-u', 'links the local branch to origin — later push/pull need no arguments', 'info') },

  { t: 'What a pull request shows', giua: true, body: term(null, dong('_t10/out/git-branch', 13, 20), { title: 'the PR, in Git terms' }) + tbl(['Command', 'PR tab'], [['git log main..branch', 'Commits'], ['git diff main...branch', 'Files changed']]) },

  { t: 'Push rejected: fetch first', giua: true, body: term(null, dong('_t10/out/git-rejected', -10, undefined), { title: 'Binh pushes straight to main' }) + two(box('Never', 'git push --force on a shared branch', 'bad'), box('Do', 'pull, check, push — and use branches', 'ok')) },

  { t: 'Merging main into your branch', giua: true, body: term('_t10/out/git-graph-noconflict', null, { title: 'different lines → merged automatically' }) },

  { t: 'A real conflict', giua: true, body: term(null, dong('_t10/out/git-conflict-real', 8, 30), { title: 'same line changed twice' }) },

  { t: 'Resolving it', giua: true, body: term(null, dong('_t10/out/git-resolved', 0, 14), { title: 'keep both ideas, run, add, commit' }) + box('Before git add', 'search for <<<<<<< and run the program — git merge --abort undoes a messy merge', 'info') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Branch · small commits · push -u</li>
    <li>PR = main..branch + diff</li>
    <li>Rejected? pull, never --force</li>
    <li>Conflict: decide, remove markers, run</li></ul>`,
    box('Practice (45 min)', 'Bare origin + two clones; cause one conflict on purpose and resolve it.<br><br><b>Done when</b>: log --graph shows both branches merged.', 'ok')) },
]);
