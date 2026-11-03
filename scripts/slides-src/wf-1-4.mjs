/** Web Foundations · deck bài 1.4 — GitHub. Output thật: git 2.51 với một kho trần trên đĩa đóng vai github.com (_demo/_t1/github/sim.sh). */
import { deckWf, bash, term, box, two, steps, tbl, vsd, flow, OUT } from './_wf-bai.mjs';

// sim.out chia theo "### N." — phan(n) = khối của bước n, bỏ dòng tiêu đề và dòng trống thừa
const SIM = OUT['_t1/github/out/sim'].split(/^### /m);
const phan = (n, chi) => {
  const lines = SIM[n].split('\n').slice(1).filter((l, i, a) => l.trim() || (a[i + 1] || '').startsWith('$'));
  return (chi ? lines.slice(chi[0], chi[1]) : lines).join('\n').trim();
};

// ssh-keygen: bỏ khối randomart (11 dòng) và dòng trống cho vừa slide; bài đọc giữ nguyên
const SSH = OUT['_t1/github/out/ssh'].replace(/The key's randomart image is:\n[\s\S]*?\+----\[SHA256\]-----\+\n/, '').replace(/\n\n+/g, '\n');

export const deck = { key: 'wf-1-4', code: 'WF 1.4', title: 'GitHub: your code in the cloud', sub: 'Web Foundations · Chapter 1' };

export const slides = deckWf({ chuong: 'Chapter 1 — Your toolbox', bai: '1.4' }, [
  { cover: true, t: 'GitHub: your code in the cloud', sub: 'Remotes, push, clone, pull, a rejected push and a pull request — every output from a real git run' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain the difference between <b>Git</b> (local) and <b>GitHub</b> (a remote)</li>
    <li>Connect a project and <b>push</b> it the first time</li>
    <li><b>Clone</b> a project and stay in sync with <b>pull</b></li>
    <li>Fix the most common error: <b>push rejected (fetch first)</b></li>
    <li>Say what a <b>pull request</b> really is</li></ul>` },

  { t: 'Git is local, GitHub is a remote', giua: true, body: `${flow([{ t: 'your files', s: 'edit' }, { t: 'commit', s: '.git on YOUR disk', mau: '#2f7d4f' }, { t: 'push', s: 'upload commits', mau: '#b85a2b' }, { t: 'GitHub', s: 'the remote “origin”', mau: '#7c3aed' }])}
    ${box('Two different claims', '"I committed it" = safe on your laptop only. "I pushed it" = there is a copy on GitHub. A dead laptop loses everything that was committed but not pushed.', 'info')}` },

  { t: 'Create, connect, first push', giua: true, body: two(bash(null, `# on GitHub: New repository → ct-shop (empty)
git remote add origin <URL of the repo>
git remote -v
git push -u origin main`, { gon: false }) + box('-u', 'links local <code class="i">main</code> to <code class="i">origin/main</code> once; after that plain <code class="i">git push</code> / <code class="i">git pull</code> know where to go.', 'ok'),
      term(null, phan(2, [6]), { title: 'real output (a bare repo plays GitHub)' }), 'r46') },

  { t: 'Committed is not pushed', giua: true, body: two(term(null, phan(3), { title: 'git status -sb  before and after push' }),
      box('Read the status line', '<code class="i">## main...origin/main [ahead 1]</code> = one commit exists only on your machine. After <code class="i">git push</code> the bracket disappears: both sides agree.', 'info'), 'r55') },

  { t: 'Clone: a teammate gets the project', giua: true, body: two(term(null, phan(4), { title: 'Binh: git clone, then commits and pushes' }),
      tbl(['Command', 'When'], [['git clone URL', 'once — you do not have it yet'], ['git pull', 'every time you start work'], ['git push', 'when your commits should be shared']]), 'r55') },

  { t: 'Push rejected: fetch first', giua: true, body: `${term(null, phan(5, [0, 9]), { title: 'An pushes without pulling first' })}
    ${box('Not an error in your code', 'The remote has a commit you do not have (Binh’s). Git refuses to throw it away. Get it first, then push.', 'bad')}` },

  { t: 'pull --rebase, then push', giua: true, body: `${term(null, phan(5, [9]), { title: 'git pull --rebase ⇒ your commit is replayed on top' })}` },

  { t: 'A pull request = a branch + a merge', giua: true, body: two(term(null, phan(6, [0, 7]), { title: 'push a branch' }) ,
      term(null, phan(7, [-9]), { title: 'what "Merge pull request" does' }), 'r55') },

  { t: 'Logging in: HTTPS token or SSH key', giua: true, body: `${term(null, SSH, { title: 'ssh-keygen  (generated in a throw-away folder, then deleted)' })}
    ${box('Never your password', 'GitHub does not accept your account password for git. Use HTTPS + a personal access token (or Git Credential Manager), or paste the <b>.pub</b> line into Settings → SSH keys. The file without .pub never leaves your machine.', 'bad')}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>commit = local, push = shared</li>
    <li>clone once, pull before work</li>
    <li>rejected (fetch first) ⇒ pull --rebase ⇒ push</li>
    <li>PR = branch on the remote + review + merge</li></ul>`,
    box('Practice (30 min)', 'Create a public repo, push a project with a README and .gitignore, clone it into a second folder, make conflicting-in-time commits from both.<br><br><b>Done when</b>: you have seen “rejected (fetch first)”, fixed it with <code class="i">git pull --rebase</code>, and <code class="i">git status -sb</code> shows no [ahead]/[behind] in either folder.', 'ok')) },
]);
