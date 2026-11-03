/** Web Foundations · deck bài 0.3 — Cài đặt máy. Output thật: _demo/_t0/out (Node 22.23.3, npm 10.9.9, git 2.51.1, VS Code 1.124.2). */
import { deckWf, js, con, term, box, two, steps, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-0-3', code: 'WF 0.3', title: 'Set up your machine', sub: 'Web Foundations · Section 0' };

export const slides = deckWf({ chuong: 'Section 0 — Getting started', bai: '0.3' }, [
  { cover: true, t: 'Set up your machine', sub: 'Four free tools, each proven with one command — and a script that checks them all' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Install the <b>browser, VS Code, Node.js, Git</b></li>
    <li><b>Prove</b> each one works with <code class="i">--version</code></li>
    <li>Fix <b>command not found</b> because you understand <b>PATH</b></li>
    <li>Run JavaScript <b>without a browser</b></li>
    <li>Check the whole machine with one script</li></ul>
    ${box('Why', 'A half-installed tool’s errors look exactly like your own mistakes. Twenty minutes here removes that confusion for good.', 'info')}` },

  { t: 'The four tools', to: true, giua: true, body: tbl(['Tool', 'Job', 'Get it from'], [
      ['Browser + DevTools', 'see the result; inspect, console, network', 'google.com/chrome'],
      ['VS Code', 'write the code', 'code.visualstudio.com'],
      ['Node.js 22 LTS + npm', 'run JS outside the browser; install libraries', 'nodejs.org · nvm on Linux'],
      ['Git', 'save your history', 'git-scm.com'],
    ]) + box('LTS', 'Long-Term Support: the version that gets fixes for years. It is what companies run.', 'ok') },

  { t: 'Install, then ask the tool', to: true, giua: true, body: two(term('_t0/out/versions', null, { title: 'a NEW terminal' }), `${box('A number means', 'installed <b>and</b> your terminal can find it.', 'ok')}
    ${box('Write them down', '“Which version were you on?” is the first question when something breaks.', 'info')}`) },

  { t: 'command not found', to: true, giua: true, body: two(`${term('_t0/out/not-found', null, { title: 'zsh' })}
    ${box('PATH', 'A list of folders the shell searches for programs. A terminal reads it <b>once, when it opens</b>.', 'info')}`, steps([
      'A <b>typo</b>? Read the command again.',
      'A <b>stale terminal</b>? Open a new one (or restart VS Code).',
      '<b>Really not installed</b>? Reinstall with default options.',
    ])) },

  { t: 'Run JavaScript with Node', to: true, giua: true, body: two(js('_t0/may/hello.js', null, { gon: false }), `${term('_t0/out/hello', null, { title: 'terminal' })}
    ${box('No browser', '<code class="i">console.log</code> printed to the terminal. Node looks for the file in the <b>current folder</b> — check with <code class="i">pwd</code> and <code class="i">ls</code>.', 'info')}`, 'r55') },

  { t: 'Your first npm project', giua: true, body: two(term('_t0/out/npm-init', null, { title: 'terminal' }), `${box('package.json', 'The identity card of a JavaScript project: name, version, scripts — and from Lesson 1.5, its libraries.', 'info')}
    ${box('Never sudo', 'EACCES on <code class="i">npm install -g</code>? Do not add <code class="i">sudo</code>. Install in the project, or use nvm.', 'bad')}`, 'r55') },

  { t: 'Tell Git who you are', giua: true, body: `${term('_t0/out/git-config', null, { title: 'once per machine' })}
    ${two(box('Why', 'Git stamps every snapshot with a name and email, and refuses to commit without them.', 'info'), box('Habit', 'A setting is confirmed by <b>reading it back</b>, not by the absence of an error.', 'ok'))}` },

  { t: 'Check the whole machine', giua: true, body: `${two(term('_t0/out/kiem-may', null, { title: 'a complete machine' }), term('_t0/out/kiem-may-thieu', null, { title: 'Git and VS Code missing' }))}
    ${vsd('<ul><li>A tutorial from 2019 with a different Node</li><li>Projects inside OneDrive / iCloud</li></ul>', '<ul><li>Check the date; prefer the official docs</li><li>Plain folder: ~/code or C:&#92;code</li></ul>', '✗ Trap', '✓ Instead')}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Browser, VS Code, Node + npm, Git</li>
    <li><code class="i">--version</code> proves an install</li>
    <li>Not found ⇒ typo, new terminal, reinstall</li>
    <li><code class="i">node file.js</code> needs the right folder</li></ul>`,
    box('Practice (30 min)', 'Install everything, run <code class="i">hello.js</code>, make a project, set your Git name, run <code class="i">kiem-may.mjs</code>.<br><br><b>Done when</b>: it prints <b>4/4 tools ready</b> on your machine and <code class="i">git config --global user.name</code> prints your name.', 'ok')) },
]);
