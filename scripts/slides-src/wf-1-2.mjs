/** Web Foundations · deck bài 1.2 — VS Code: xưởng làm việc. Output thật: Prettier 3.9 / ESLint 10 / TypeScript 5.9 (Node 22). */
import { deckWf, js, bash, term, box, two, steps, tbl, vsd, OUT, CODE } from './_wf-bai.mjs';

const SHOP = CODE['_t1/vscode/rename.mjs'].split('`')[1].trim();   // chỉ nội dung shop.js mà dịch vụ ngôn ngữ phân tích

const PW = OUT['_t1/vscode/out/prettier-write'].split('\n').slice(3).filter((l) => l.trim()).join('\n');   // từ "$ cat" trở đi
const ESL = OUT['_t1/vscode/out/eslint'].replace(/\n\n+/g, '\n');   // bỏ dòng trống cho vừa slide

export const deck = { key: 'wf-1-2', code: 'WF 1.2', title: 'VS Code: your workshop', sub: 'Web Foundations · Chapter 1' };

export const slides = deckWf({ chuong: 'Chapter 1 — Your toolbox', bai: '1.2' }, [
  { cover: true, t: 'VS Code: your workshop', sub: 'Open a folder, let the tools fix formatting and catch bugs, rename safely, debug — measured on a real project' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Open a <b>project folder</b> and find your way around the four areas</li>
    <li>Let <b>Prettier</b> format your code on every save</li>
    <li>Read the bugs <b>ESLint</b> underlines before you run anything</li>
    <li>Rename with <b>F2</b> instead of find-and-replace</li>
    <li>Share editor settings with your team through <code class="i">.vscode/</code></li></ul>` },

  { t: 'Open a folder, not a file', to: true, giua: true, body: two(bash(null, `ct-shop/            ← File → Open Folder…
├─ .vscode/        ← settings for THIS project
│  ├─ settings.json
│  └─ extensions.json
├─ src/
│  ├─ cart.js
│  └─ messy.js
├─ eslint.config.js
├─ .prettierrc.json
└─ package.json`, { gon: false }),
    box('Why a folder', 'VS Code treats the folder as one project: the file tree, project-wide search, the integrated terminal (already <code class="i">cd</code>-ed in), and per-project settings all work. Open a single file and none of them do.', 'info'), 'r55') },

  { t: 'The four areas', to: true, giua: true, body: tbl(['Area', 'Open with', 'Use it to'], [
      ['Explorer', 'Ctrl/Cmd+Shift+E', 'see, create, rename files'],
      ['Editor', 'click a file', 'write; split side by side'],
      ['Terminal', 'Ctrl+&#96;', 'run npm, git, node — inside the project'],
      ['Command Palette', 'Ctrl/Cmd+Shift+P', 'find any command by name'],
    ]) + box('Lost?', 'Open the Command Palette and type what you want: "format", "settings", "git". Every menu item lives there.', 'ok') },

  { t: 'Prettier: formatting is not your job', giua: true, body: `${js('_t1/vscode/src/messy.js', null, { gon: false })}
    ${two(term('_t1/vscode/out/prettier-check', null, { title: 'npx prettier --check' }), term(null, PW, { title: 'after npx prettier --write  (= Format on Save)' }), 'r46')}` },

  { t: 'ESLint: five bugs in a file that runs', giua: true, body: `${js('_t1/vscode/src/cart.js', null, { chi: [2, 12] })}
    ${term(null, ESL, { title: 'npx eslint src/cart.js  — the same list the extension underlines' })}` },

  { t: 'F2 rename vs find-and-replace', giua: true, body: `${js(null, SHOP, { gon: false })}
    ${term('_t1/vscode/out/rename', null, { title: 'TypeScript language service — what F2 calls' })}
    ${box('', 'Text search finds 9 "total"s (a comment, a string, <code class="i">subtotal</code>, another variable). F2 changes exactly the 3 that are this variable.', 'ok')}` },

  { t: 'Project settings travel with the project', giua: true, body: `${js('_t1/vscode/.vscode/settings.json')}
    ${js('_t1/vscode/.vscode/extensions.json')}
    ${box('Commit .vscode/', '<code class="i">settings.json</code> turns on Format on Save + ESLint fixes for everyone who opens the folder; <code class="i">extensions.json</code> makes VS Code offer the right extensions. Personal taste (theme, font) stays in your User settings.', 'info')}` },

  { t: 'The debugger: watch the code run', giua: true, body: `${two(js('_t1/vscode/total.mjs'), steps([
      'Click left of <code class="i">sum += price</code> ⇒ a red dot (breakpoint)',
      'F5 ⇒ the program stops on that line',
      'Hover <code class="i">sum</code>, or read it in VARIABLES',
      'F10 ⇒ one step; F5 ⇒ to the next stop',
    ]), 'r55')}
    ${box('launch.json', 'F5 needs to know what to run: <code class="i">.vscode/launch.json</code> says <code class="i">"type": "node"</code>, <code class="i">"program": "\${workspaceFolder}/total.mjs"</code>. For a single file, "Run and Debug" can also create it for you.', 'info')}` },

  { t: 'Shortcuts and traps', to: true, giua: true, body: two(tbl(['Keys', 'Does'], [
      ['Ctrl/Cmd+P', 'go to file by name'],
      ['Ctrl/Cmd+Shift+F', 'search the whole project'],
      ['F2', 'rename symbol'],
      ['Ctrl/Cmd+D', 'select next match'],
      ['Alt+↑ / ↓', 'move line'],
      ['Ctrl/Cmd+/', 'toggle comment'],
    ]), vsd('<ul><li>Opening single files</li><li>20 extensions in week one</li><li>Fixing spaces by hand</li></ul>', '<ul><li>Open the project folder</li><li>A formatter + a linter, then only what you need</li><li>Format on Save</li></ul>', '✗ Trap', '✓ Instead'), 'r46') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Open a folder = a project</li>
    <li>Prettier formats, ESLint warns</li>
    <li>F2 renames the symbol, not the text</li>
    <li>Commit <code class="i">.vscode/</code> for the team</li></ul>`,
    box('Practice (20 min)', 'Create a folder with <code class="i">package.json</code>, install Prettier + ESLint, copy <code class="i">cart.js</code>, add <code class="i">.vscode/settings.json</code>.<br><br><b>Done when</b>: saving a messy file reformats it, the 5 ESLint problems are underlined and fixed until <code class="i">npx eslint .</code> prints nothing, and you stopped at a breakpoint once.', 'ok')) },
]);
