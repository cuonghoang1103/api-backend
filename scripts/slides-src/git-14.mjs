/** Git & GitHub · Deck git-14 — Chương 14: Git hằng ngày trong công cụ (VS Code, GUI, cấu hình, Windows/CRLF).
 *  Mọi output terminal / mã băm là output THẬT của git 2.51.1, chạy trong kho thử scratchpad/ch14-lab với
 *  HOME tạm (không đụng ~/.gitconfig thật). Đường dẫn HOME thử được in tắt thành "~" (thay chuỗi, không sửa chữ khác).
 *  Giao diện VS Code / GitHub Desktop / GitLens / Git Graph / lazygit KHÔNG có ảnh chụp ⇒ vẽ lại bằng HTML
 *  theo tên gọi trên trang chính thức (code.visualstudio.com/docs/sourcecontrol, docs.github.com/desktop,
 *  marketplace, github.com/jesseduffield/lazygit) — tính đến 09/2026.
 */
import { S, cover, cards, box, steps, table, two, list, code, cap, mindmap, graph, term, diagram, G } from './_git-chung.mjs';

export const deck = { key: 'git-14', code: 'GIT · CHƯƠNG 14', title: 'Git hằng ngày trong công cụ', sub: 'Git & GitHub · Chương 14' };

/* ─────────────── mảnh ghép wireframe (HTML thuần, vẽ lại — không phải ảnh chụp) ─────────────── */
const mono = 'font-family:SF Mono,Menlo,monospace';
const badge = (n) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:${G.git};color:#fff;font-weight:800;font-size:14px;flex:none">${n}</span>`;
const fileRow = (name, st, c, extra = '') => `<div style="display:flex;align-items:center;gap:8px;padding:3px 10px 3px 22px;font-size:15px">` +
  `<span style="${mono};color:#e6edf3;flex:1">${name}</span>${extra}<b style="${mono};color:${c};width:16px;text-align:center">${st}</b></div>`;
const secHd = (t, n, b) => `<div style="display:flex;align-items:center;gap:6px;padding:5px 10px;font-size:13px;font-weight:800;color:${G.mu};text-transform:uppercase;letter-spacing:.04em">▾ ${t} <span style="background:#30363d;color:#e6edf3;border-radius:9px;padding:0 7px;font-size:12px">${n}</span><span style="flex:1"></span>${b || ''}</div>`;

const vscodePanel = () => `
<div style="display:grid;grid-template-columns:44px 320px 1fr;height:452px;border:1.5px solid ${G.bd};border-radius:12px;overflow:hidden;background:#0f141b;text-align:left">
 <div style="background:#0a0d12;border-right:1px solid ${G.bd};display:flex;flex-direction:column;align-items:center;gap:16px;padding-top:12px;font-size:20px;color:${G.dim}">
  <span>📄</span><span>🔍</span><span style="color:#fff;border-left:3px solid ${G.git};padding-left:6px;margin-left:-9px">⑂</span><span>▶</span><span>⊞</span>
 </div>
 <div style="border-right:1px solid ${G.bd};display:flex;flex-direction:column">
  <div style="padding:8px 10px;font-size:13px;font-weight:800;color:${G.mu};letter-spacing:.04em">SOURCE CONTROL <span style="float:right">✓ ⟳ …</span></div>
  <div style="padding:0 10px 8px;position:relative">
   <div style="border:1.5px solid ${G.blu};border-radius:6px;padding:6px 8px;font-size:15px;color:#e6edf3;background:#0d1117">feat(lich): mở cửa 07:00 <span style="float:right;color:${G.amb}">✦</span></div>
   <div style="display:flex;margin-top:6px"><span style="flex:1;background:#238636;color:#fff;font-weight:700;font-size:15px;text-align:center;border-radius:6px 0 0 6px;padding:5px">✓ Commit</span><span style="background:#1f6f2e;color:#fff;border-radius:0 6px 6px 0;padding:5px 9px;font-size:14px">▾</span></div>
   <span style="position:absolute;right:-12px;top:0">${badge(2)}</span>
  </div>
  ${secHd('Staged Changes', 1, '<span style="color:#e6edf3">−</span>')}
  ${fileRow('lich.js', 'M', G.amb)}
  <div style="position:relative">${secHd('Changes', 2, '<span style="color:#e6edf3">↶ +</span>')}<span style="position:absolute;right:6px;top:-2px">${badge(1)}</span></div>
  ${fileRow('README.md', 'M', G.amb, `<span style="color:${G.mu};font-size:14px">↶ +</span>`)}
  ${fileRow('nhap.txt', 'U', G.grn)}
  <div style="position:relative;margin-top:4px">${secHd('Graph', '', '<span style="color:' + G.mu + '">↓ ↑</span>')}<span style="position:absolute;right:6px;top:-2px">${badge(4)}</span></div>
  <div style="padding:2px 12px;font-size:14px;line-height:1.7;${mono};color:#c9d1d9">
   <div><b style="color:${G.blu}">●</b> 0f2bae3 fix: bác sĩ yêu cầu… <span style="color:${G.grn}">main</span></div>
   <div><b style="color:${G.vio}">●</b> 3f76892 feat: mở sớm 07:30</div>
   <div><b style="color:${G.blu}">●</b> 423371e feat: giờ làm việc</div>
  </div>
 </div>
 <div style="display:flex;flex-direction:column;position:relative">
  <div style="display:flex;gap:2px;background:#0a0d12;border-bottom:1px solid ${G.bd};font-size:14px"><span style="background:#0f141b;padding:7px 14px;color:#fff;border-top:2px solid ${G.git}">lich.js (Working Tree) ↔</span></div>
  <div style="flex:1;${mono};font-size:15px;line-height:1.9;padding:10px 0;position:relative">
   <div style="padding:0 12px;color:${G.dim}">1  const TEN = "SWP391";</div>
   <div style="padding:0 12px;background:rgba(248,81,73,.18);color:#ffa198">2 −const GIO_MO = "08:00";</div>
   <div style="padding:0 12px;background:rgba(63,185,80,.22);color:#7ee787;outline:1.5px solid ${G.blu}">2 +const GIO_MO = "07:00";</div>
   <div style="padding:0 12px;color:${G.dim}">3  const GIO_DONG = "17:00";</div>
   <div style="padding:0 12px;background:rgba(63,185,80,.22);color:#7ee787">4 +console.log("debug");</div>
   <div style="margin:14px 12px 0;display:flex;align-items:center;gap:8px;font-family:system-ui;font-size:14px"><span style="background:${G.blu};color:#0b0e14;font-weight:800;border-radius:5px;padding:2px 9px">Stage</span><span style="color:${G.mu}">chỉ dòng 2 đang chọn — dòng debug ở lại</span>${badge(3)}</div>
  </div>
  <div style="background:#1f2630;border-top:1px solid ${G.bd};padding:5px 12px;font-size:14px;color:#e6edf3;display:flex;gap:16px;align-items:center"><span style="white-space:nowrap">⑂ feature/dat-lich*</span><span style="white-space:nowrap">⟳ 0↓ 1↑</span>${badge(5)}</div>
 </div>
</div>`;

const mePane = (title, sub, c, lines, hlIdx, actions) => `<div style="border:1.5px solid ${c};border-radius:10px;overflow:hidden;background:#0d1117">
 <div style="background:#161b22;padding:6px 12px;font-size:15px;font-weight:800;color:${c}">${title} <span style="${mono};font-weight:400;color:${G.mu};font-size:13px">${sub}</span></div>
 <div style="${mono};font-size:15px;line-height:1.7;padding:6px 0">${lines.map((l, i) => (i === hlIdx && actions ? `<div style="padding:0 12px;font-family:system-ui;font-size:13px;color:${G.blu}">${actions}</div>` : '') +
    `<div style="padding:0 12px;${i === hlIdx ? `background:${c}33;color:#fff` : `color:${G.mu}`}">${l}</div>`).join('')}</div></div>`;

const mergeEditor = () => {
  const base = ['export const GIO_MO = "08:00";', 'export const GIO_DONG = "17:00";'];
  return `<div style="text-align:left">
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
  ${mePane('Incoming', 'feature/gio-sang · 3f76892', G.blu, ['export const GIO_MO = "07:30";', base[1]], 0, 'Accept Incoming | Accept Combination | Ignore')}
  ${mePane('Current', 'main (HEAD) · 0f2bae3', G.grn, ['export const GIO_MO = "07:00";', base[1]], 0, 'Accept Current | Accept Combination | Ignore')}
 </div>
 <div style="margin-top:14px;border:1.5px solid ${G.amb};border-radius:10px;overflow:hidden;background:#0d1117">
  <div style="background:#161b22;padding:6px 12px;font-size:15px;font-weight:800;color:${G.amb};display:flex;align-items:center;gap:12px">Result <span style="${mono};font-weight:400;color:${G.mu};font-size:13px">lich.js — file sẽ được ghi</span><span style="flex:1"></span><span style="color:${G.red};font-weight:700;font-size:14px">1 Conflict Remaining</span><span style="background:#238636;color:#fff;border-radius:6px;padding:3px 12px;font-size:14px">Complete Merge</span></div>
  <div style="${mono};font-size:15px;line-height:1.7;padding:6px 0"><div style="padding:0 12px;background:rgba(255,194,51,.16);color:#ffd666">export const GIO_MO = "08:00";   ← chưa giải</div><div style="padding:0 12px;color:${G.mu}">${base[1]}</div></div>
 </div></div>`;
};

const lazygit = () => {
  const pnl = (n, t, body, act) => `<div style="border:1.5px solid ${act ? G.grn : G.bd};border-radius:4px;padding:12px 8px 5px;position:relative;margin-top:10px">` +
    `<span style="position:absolute;top:-10px;left:8px;background:#0a0d12;padding:0 5px;font-size:13px;color:${act ? G.grn : G.mu};font-weight:700">[${n}] ${t}</span>${body}</div>`;
  const ln = (t, c = '#c9d1d9', bg = '') => `<div style="color:${c};${bg ? `background:${bg};` : ''}white-space:pre">${t}</div>`;
  return `<div style="background:#0a0d12;border:1.5px solid ${G.bd};border-radius:10px;padding:8px 12px;${mono};font-size:14px;line-height:1.5;text-align:left">
 <div style="display:grid;grid-template-columns:400px 1fr;gap:12px">
  <div>
   ${pnl(1, 'Status', ln('swp391 → main', G.grn))}
   ${pnl(2, 'Files', ln(' M lich.js', G.amb, 'rgba(88,166,255,.18)') + ln(' ?? nhap.txt', G.red), true)}
   ${pnl(3, 'Local branches', ln('* main', G.grn) + ln('  feature/gio-sang'))}
   ${pnl(4, 'Commits', ln('0f2bae3 fix: bác sĩ yêu cầu 07:00', '#c9d1d9', 'rgba(88,166,255,.18)') + ln('423371e feat: giờ làm việc'))}
   ${pnl(5, 'Stash', ln('(trống)', G.dim))}
  </div>
  ${pnl('0', 'Unstaged changes', ln('@@ -1,2 +1,2 @@', G.vio) + ln('-export const GIO_MO = "07:00";', '#ffa198') + ln('+export const GIO_MO = "06:30";', '#7ee787', 'rgba(88,166,255,.25)') + ln(' export const GIO_DONG = "17:00";') + ln(' ') + ln('space: stage dòng này · v: chọn khoảng', G.blu))}
 </div>
 <div style="margin-top:8px;color:${G.blu};font-size:13px">space stage · c commit · P push · p pull · i rebase -i · shift+c/shift+v cherry-pick · z undo · ? mọi phím</div>
</div>`;
};

/* ký tự cuối dòng vẽ thành ô */
const eolRow = (label, parts, c) => `<div style="display:flex;align-items:center;gap:14px;margin:8px 0"><b style="width:210px;font-size:17px;color:${c}">${label}</b><div style="display:flex;gap:3px;flex-wrap:wrap">` +
  parts.map((p) => {
    if (p === 'CR') return `<span style="${mono};font-size:15px;font-weight:800;background:${G.red};color:#0b0e14;border-radius:5px;padding:5px 7px">\\r</span>`;
    if (p === 'LF') return `<span style="${mono};font-size:15px;font-weight:800;background:${G.grn};color:#0b0e14;border-radius:5px;padding:5px 7px">\\n</span>`;
    return `<span style="${mono};font-size:17px;background:#1f2630;color:#e6edf3;border-radius:5px;padding:4px 10px">${p}</span>`;
  }).join('') + `</div></div>`;

export const slides = S([
  cover({ t: 'Chương 14 — Git hằng ngày trong công cụ', sub: 'VS Code · Git Graph, GitLens, GitHub Desktop, lazygit · .gitconfig nâng cao · làm nhóm với bạn dùng Windows', chap: 'CHƯƠNG 14' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Git trong công cụ', 'GUI để nhìn · terminal để hiểu', [
    { t: '14.1 VS Code', d: 'Source Control · stage từng dòng · merge editor 3 cột · Timeline', c: 'blu' },
    { t: '14.2 Công cụ đồ hoạ', d: 'Git Graph · GitLens · GitHub Desktop · lazygit', c: 'vio' },
    { t: '14.3 .gitconfig', d: 'alias · includeIf hai danh tính · --show-origin', c: 'grn' },
    { t: '14.4 Bạn dùng Windows', d: 'CRLF/LF · .gitattributes · hoa/thường · chmod +x', c: 'git' },
  ]) },

  /* 3 */
  { t: 'Panel Source Control của VS Code (vẽ lại)', body: `<div style="display:grid;grid-template-columns:830px 1fr;gap:22px;align-items:center">${vscodePanel()}<div>` + list([
    `${badge(1)} <b>Changes</b>: <code>+</code> = stage file, <code>↶</code> = Discard (xoá thay đổi!)`,
    `${badge(2)} Ô lời nhắn + <b>Commit</b>; <code>✦</code> là nút AI viết lời nhắn`,
    `${badge(3)} Chọn vài dòng trong diff → <b>Stage</b> ≈ <code>git add -p</code>`,
    `${badge(4)} <b>Graph</b>: ↓ incoming, ↑ outgoing`,
    `${badge(5)} Thanh trạng thái: nhánh + Sync`,
  ]) + '</div></div>' },

  /* 4 */
  { t: 'Mỗi nút bấm là một lệnh Git', body: `
    ${table(['Trong VS Code', 'Tương đương ở terminal', 'Cần để ý'], [
      ['<b>+</b> Stage Changes (một file)', '<code>git add lich.js</code>', ''],
      ['Stage Selected Ranges (chọn dòng)', '<code>git add -p</code> rồi chọn <code>y/n</code>', '+cách dễ nhất để commit sạch'],
      ['Commit khi CHƯA stage gì', '<code>git add -A</code> + <code>git commit</code>', '!VS Code có thể hỏi “stage hết?” — nhớ đọc'],
      ['Commit (Amend)', '<code>git commit --amend</code>', '-đổi mã băm — đừng làm với commit đã push'],
      ['More Actions → Commit → Undo Last Commit', '<code>git reset --soft HEAD~1</code>', '+giữ nguyên thay đổi ở Staged'],
      ['<b>↶</b> Discard Changes', '<code>git restore lich.js</code>', '-mất luôn, không có trong reflog'],
      ['Sync Changes (⟳)', '<code>git pull</code> rồi <code>git push</code>', '!pull trước — có thể merge/rebase'],
    ], { sm: true })}
    ${box('tip', 'Muốn biết CHÍNH XÁC nó chạy gì: <b>More Actions (…) → Show Git Output</b>, hoặc panel Output → kênh <b>Git</b> (docs VS Code, 09/2026).')}` },

  /* 5 */
  { t: 'Merge editor 3 cột: Incoming · Current · Result', body: two(mergeEditor(), `
    ${term([
      '$ git merge feature/gio-sang',
      'Auto-merging lich.js',
      '! CONFLICT (content): Merge conflict in lich.js',
      'Automatic merge failed; fix conflicts and then commit the result.',
      '$ git status -s',
      '! UU lich.js',
    ], { title: 'output thật — kho thử xd', dir: '~/xd' })}
    ${list(['<b>Incoming</b> = nhánh đang được nhập vào (“theirs”)', '<b>Current</b> = nhánh bạn đang đứng (HEAD, “ours”)', '<b>Complete Merge</b> chỉ stage FILE này — vẫn phải commit'])}`, 'l2') },

  /* 6 */
  { t: 'Năm cách nhìn lịch sử — cái nào hợp việc gì', body: `
    ${table(['', 'Source Control Graph (có sẵn)', 'Git Graph', 'GitLens (Community)', 'GitHub Desktop', 'lazygit'], [
      ['Dạng', 'trong VS Code', 'extension VS Code', 'extension VS Code', 'app riêng', 'TUI trong terminal'],
      ['Mạnh nhất ở', 'incoming / outgoing', 'đồ thị cả kho, mọi nhánh', '+blame từng dòng, lịch sử một dòng', '+người mới, commit từng dòng bằng chuột', '+nhanh bằng phím, rebase -i, stage dòng'],
      ['Đồ thị commit', '+có', '+có', '!miễn phí với repo public (cần tài khoản GitKraken)', 'History: danh sách, không vẽ nhánh', '+có'],
      ['Hệ điều hành', 'mọi nơi VS Code chạy', 'như VS Code', 'như VS Code', '!macOS 12+ · Windows 10+ · <b>chưa có Linux</b>', 'macOS · Windows · Linux'],
      ['Lưu ý', '—', '!bản 1.30.0 từ 04/2021', 'Pro: Graph repo private, Visual History, Launchpad', 'không có terminal bên trong', 'MIT · <code>brew install lazygit</code>'],
    ], { sm: true })}
    ${cap('Nguồn: marketplace.visualstudio.com, docs.github.com/desktop, github.com/jesseduffield/lazygit — tính đến 09/2026.')}` },

  /* 7 */
  { t: 'lazygit: Git bằng bàn phím, ngay trong terminal (vẽ lại)', body: lazygit() + box('tip', 'Cực hợp máy Linux / SSH vào VPS — nơi không có VS Code. Phím lấy từ README chính thức; bấm <code>?</code> trong app để xem hết.') },

  /* 8 */
  { t: 'GUI để NHÌN — terminal để HIỂU và cứu hộ', body: two(
    `${graph({ w: 620, h: 274, y0: 72, dy: 130, dx: 150, x0: 70, commits: [
      { id: 'A', x: 0, t: '423371e' }, { id: 'M1', x: 1, p: ['A'], t: '0f2bae3' },
      { id: 'F', x: 2, lane: 1, p: ['A'], c: 'vio' },
      { id: 'M', x: 3, p: ['M1', 'F'], star: true, hl: true, t: '640154e' },
    ], refs: [{ to: 'M', n: 'main' }, { to: 'F', n: 'feature/gio-sang · 3f76892', side: 'down' }] })}
    ${term(['$ git lg', '*   640154e (HEAD -> main) Merge branch \'feature/gio-sang\'', '|\\', '| * 3f76892 (feature/gio-sang) feat: mở sớm 07:30', '* | 0f2bae3 fix: bác sĩ yêu cầu 07:00', '|/', '* 423371e feat: giờ làm việc'], { title: 'output thật — alias lg (14.3)', dir: '~/xd' })}`,
    `${cards([
      { ic: '👀', t: 'GUI thắng khi…', d: 'đọc đồ thị nhiều nhánh, xem diff cạnh nhau, blame một dòng, chọn dòng để stage.', c: 'blu' },
      { ic: '⌨️', t: 'Terminal thắng khi…', d: 'mọi thứ hỏng: rebase dở, detached HEAD, reflog, SSH vào VPS, viết script, đọc lỗi nguyên văn.', c: 'grn' },
    ], 1)}
    ${box('warn', 'Nút bấm không in lỗi đầy đủ. Khi GUI báo “Git failed”, mở terminal chạy <code>git status</code> — câu trả lời nằm ở đó.')}`, 'l') },

  /* 9 */
  { t: 'Cấu hình có nhiều tầng — giá trị đọc SAU thắng', body: two(
    diagram({ w: 430, h: 440, nodes: [
      { id: 's', x: 0, y: 0, w: 420, h: 70, t: 'system', d: '/etc/gitconfig · git config --system', c: 'dim', mono: true },
      { id: 'g', x: 0, y: 92, w: 420, h: 70, t: 'global', d: '~/.gitconfig · git config --global', c: 'blu', mono: true },
      { id: 'i', x: 30, y: 184, w: 390, h: 70, t: 'includeIf …', d: '~/.gitconfig-fpt — đọc tại chỗ khai báo', c: 'vio', mono: true },
      { id: 'l', x: 0, y: 276, w: 420, h: 70, t: 'local', d: '.git/config · git config (mặc định)', c: 'grn', mono: true },
      { id: 'c', x: 0, y: 368, w: 420, h: 70, t: 'dòng lệnh', d: 'git -c khoá=giá-trị …', c: 'git', mono: true },
    ], edges: [] }),
    `${term([
      '$ git config --list --show-origin',
      'file:~/.gitconfig user.email=cuong@example.com',
      'file:~/.gitconfig pull.rebase=true',
      'file:~/.gitconfig includeif.gitdir:~/fpt/.path=~/.gitconfig-fpt',
      '+ file:~/.gitconfig-fpt user.email=cuonghse180000@fpt.edu.vn',
      'file:.git/config core.ignorecase=true',
      '$ git config --show-origin user.email',
      '= file:~/.gitconfig-fpt cuonghse180000@fpt.edu.vn',
    ], { title: 'output thật (cắt dòng) — ~/fpt/swp391', dir: '~/fpt/swp391' })}
    ${box('tip', 'Đọc từ trên xuống: cùng một khoá xuất hiện hai lần thì <b>dòng dưới</b> thắng. <code>--show-origin</code> trả lời “cái này ai đặt?”.')}`, 'r2') },

  /* 10 */
  { t: 'Alias và sáu thiết lập đáng bật', body: two(
    code(`[init]
  defaultBranch = main
[pull]
  rebase = true
[push]
  autoSetupRemote = true
[rerere]
  enabled = true
[diff]
  algorithm = histogram
[help]
  autocorrect = prompt
[alias]
  st = status -sb
  lg = log --oneline --graph --all --decorate -20
  undo = reset --soft HEAD~1
  last = log -1 HEAD --stat`, 'plaintext'),
    `${table(['Thiết lập', 'Làm gì'], [
      ['<code>init.defaultBranch</code>', 'kho mới tên nhánh <code>main</code>'],
      ['<code>pull.rebase</code>', 'pull = fetch + rebase, không đẻ merge commit'],
      ['<code>push.autoSetupRemote</code>', '<code>git push</code> nhánh mới không cần <code>-u</code>'],
      ['<code>rerere.enabled</code>', 'nhớ cách giải xung đột, tự áp lại'],
      ['<code>diff.algorithm</code>', 'histogram: diff dễ đọc hơn'],
      ['<code>help.autocorrect</code>', 'gõ nhầm <code>sttus</code> → hỏi chạy <code>status</code>'],
    ], { sm: true })}
    ${term(['$ git sttus', "WARNING: You called a Git command named 'sttus', which does not exist.", "Run 'status' instead [y/N]? y"], { title: 'output thật', dir: '~/fpt/swp391' })}`) },

  /* 11 */
  { t: 'includeIf: hai danh tính, không bao giờ nhầm email', body: `
    ${diagram({ w: 1160, h: 270, nodes: [
      { id: 'g', x: 0, y: 95, w: 300, h: 90, t: '~/.gitconfig', d: 'email = cuong@example.com\n[includeIf "gitdir:~/fpt/"]', c: 'blu', mono: true },
      { id: 'f', x: 420, y: 0, w: 330, h: 90, t: '~/fpt/swp391', d: 'kho đồ án trường', c: 'vio', mono: true },
      { id: 'p', x: 420, y: 180, w: 330, h: 90, t: '~/ca-nhan/blog', d: 'kho cá nhân', c: 'grn', mono: true },
      { id: 'fe', x: 850, y: 0, w: 310, h: 90, t: 'cuonghse180000', d: '@fpt.edu.vn', c: 'vio', mono: true },
      { id: 'pe', x: 850, y: 180, w: 310, h: 90, t: 'cuong', d: '@example.com', c: 'grn', mono: true },
    ], edges: [
      { from: 'g', to: 'f', c: 'vio', t: 'khớp ~/fpt/' }, { from: 'g', to: 'p', c: 'grn', t: 'không khớp' },
      { from: 'f', to: 'fe', c: 'vio' }, { from: 'p', to: 'pe', c: 'grn' },
    ] })}
    ${two(
      code(`# ~/.gitconfig — includeIf đặt SAU [user]
[user]
  name = Cuong Hoang
  email = cuong@example.com
[includeIf "gitdir:~/fpt/"]
  path = ~/.gitconfig-fpt`, 'ini'),
      term(['$ git log -1 --format="%h %an <%ae>"', 'f0ca57c Cuong Hoang <cuonghse180000@fpt.edu.vn>'], { title: 'output thật — commit trong ~/fpt/swp391', dir: '~/fpt/swp391' }))}` },

  /* 12 */
  { t: 'Hai cái bẫy includeIf — đều IM LẶNG', body: two(
    `<b style="font-size:19px;color:${G.red}">Bẫy 1 · quên dấu “/” cuối</b>
    ${code(`[includeIf "gitdir:~/fpt"]    # thiếu /
  path = ~/.gitconfig-fpt`, 'ini')}
    ${term(['$ git config --show-origin user.email', '# (không in gì — include không khớp)', '$ echo $?', '1'], { title: 'output thật — ~/fpt/a', dir: '~/fpt/a' })}
    ${box('info', 'Có <code>/</code> cuối = mọi kho <b>bên trong</b> <code>~/fpt/</code>. Không có = chỉ khớp đúng thư mục <code>.git</code> tên đó.')}`,
    `<b style="font-size:19px;color:${G.red}">Bẫy 2 · includeIf đặt TRƯỚC [user]</b>
    ${code(`[includeIf "gitdir:~/fpt/"]
  path = ~/.gitconfig-fpt
[user]                       # đọc sau ⇒ thắng
  email = cuong@example.com`, 'ini')}
    ${term(['$ git config --show-origin user.email', '! file:~/.gitconfig   cuong@example.com'], { title: 'output thật — ~/fpt/a', dir: '~/fpt/a' })}
    ${box('good', 'Kiểm một lần trong MỖI thư mục gốc: <code>git config --show-origin user.email</code>.')}`) },

  /* 13 */
  { t: 'CRLF và LF: một ký tự vô hình làm diff đỏ cả file', body: `
    ${eolRow('Windows (CRLF)', ['# Clinic', 'CR', 'LF', 'Dat lich', 'CR', 'LF'], G.red)}
    ${eolRow('macOS / Linux (LF)', ['# Clinic', 'LF', 'Dat lich', 'LF'], G.grn)}
    ${two(
      term(['$ git ls-files --eol', 'i/crlf  w/crlf  attr/     README.md', 'i/lf    w/lf    attr/     app.js', '! i/crlf  w/crlf  attr/     deploy.sh', 'i/-text w/-text attr/     logo.png'], { title: 'output thật — kho clinic', dir: '~/ca-nhan/clinic' }),
      term(['# mở README trên Mac, lưu (LF), không sửa chữ nào', '$ git diff --stat', ' README.md | 4 ++--', '$ git diff | cat -v', '-# Clinic^M', '-Dat lich^M', '+# Clinic', '+Dat lich'], { title: 'output thật', dir: '~/ca-nhan/clinic' }))}
    ${box('info', '<code>i/</code> = trong index (thứ sẽ commit) · <code>w/</code> = file trên đĩa · <code>^M</code> chính là <code>\\r</code>.')}` },

  /* 14 */
  { t: 'autocrlf là thói quen từng MÁY — .gitattributes là luật của KHO', body: two(
    `${table(['', 'core.autocrlf', '.gitattributes'], [
      ['Nằm ở', 'cấu hình máy mỗi người', '+commit trong repo'],
      ['Bạn mới clone', '-phải tự nhớ đặt', '+có hiệu lực ngay'],
      ['Chọn theo loại file', '-không', '+có (<code>*.sh</code>, <code>*.png</code>…)'],
      ['Khi hai cái mâu thuẫn', '—', '+.gitattributes thắng'],
    ], { sm: true })}
    ${term(['$ git config core.autocrlf true', '$ git add lf.txt', "+ warning: in the working copy of 'lf.txt', LF will be replaced by CRLF the next time Git touches it"], { title: 'output thật — kho win (giả lập Windows)', dir: '~/win' })}`,
    `${code(`# .gitattributes — đặt ở gốc repo
* text=auto eol=lf
*.png binary
*.sh text eol=lf`, 'bash')}
    ${term(['$ git check-attr -a README.md logo.png', 'README.md: text: auto', 'README.md: eol: lf', 'logo.png: binary: set', 'logo.png: diff: unset', 'logo.png: merge: unset', 'logo.png: text: unset'], { title: 'output thật (cắt dòng)', dir: '~/ca-nhan/clinic' })}`, 'l') },

  /* 15 */
  { t: 'Chuẩn hoá một kho đã lỡ trộn CRLF: renormalize', body: two(
    steps([
      ['Thêm <code>.gitattributes</code> (slide trước)', 'chưa đổi gì trong kho cũ'],
      ['<code>git add --renormalize .</code>', 'đưa lại mọi file vào index theo luật mới'],
      ['<code>git status</code> — chỉ file CRLF cũ hiện ra', 'một commit riêng, không sửa code gì khác'],
      ['<code>git commit -m "chore: chuẩn hoá xuống dòng về LF"</code>', 'báo cả nhóm pull lại'],
    ]),
    term([
      '$ git add --renormalize .',
      '$ git status -s',
      'M  README.md',
      'M  deploy.sh',
      '?? .gitattributes',
      '$ git add .gitattributes && git commit -qm "chore: chuẩn hoá xuống dòng về LF (.gitattributes)"',
      '$ git ls-files --eol',
      '= i/lf    w/crlf  attr/text=auto eol=lf  README.md',
      '# index đã LF; file trên đĩa vẫn CRLF tới khi checkout lại',
      '$ rm README.md deploy.sh && git checkout -- README.md deploy.sh',
      '= i/lf    w/lf    attr/text=auto eol=lf  README.md',
    ], { title: 'output thật — commit 8ed03fe', dir: '~/ca-nhan/clinic' }), 'r') },

  /* 16 */
  { t: 'Hai cái bẫy nữa: hoa/thường và quyền chạy file', body: two(
    `<b style="font-size:19px;color:${G.amb}">Button.tsx → button.tsx trên Mac</b>
    ${term([
      '$ mv src/Button.tsx src/button.tsx',
      '$ git status -s',
      '# (trống!) macOS không phân biệt hoa/thường',
      '$ git ls-files src',
      '! src/Button.tsx',
      '$ git mv src/Button.tsx src/button.tsx',
      '$ git status -s',
      '= R  src/Button.tsx -> src/button.tsx',
    ], { title: 'output thật — core.ignorecase=true', dir: 'clinic' })}
    ${box('bad', 'Không <code>git mv</code> ⇒ repo vẫn giữ <code>Button.tsx</code>, còn <code>import "./button"</code> chạy trên Mac nhưng <b>vỡ build trên Linux</b> (CI, Docker, VPS).')}`,
    `<b style="font-size:19px;color:${G.amb}">deploy.sh không chạy được</b>
    ${term([
      '$ git ls-files -s --abbrev deploy.sh',
      '! 100644 227c13b 0	deploy.sh',
      '$ git update-index --chmod=+x deploy.sh',
      '$ git diff --cached',
      'old mode 100644',
      '= new mode 100755',
    ], { title: 'output thật', dir: 'clinic' })}
    ${list(['Mac/Linux: <code>chmod +x</code> rồi commit là đủ', 'Windows không có bit chạy ⇒ phải <code>git update-index --chmod=+x</code>', 'Đường dẫn dài trên Windows: <code>git config --system core.longpaths true</code> (Git for Windows)'])}`) },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 14', body: table(['Muốn…', 'Gõ / bấm'], [
    ['Stage vài dòng trong VS Code', 'chọn dòng → <b>Stage Selected Ranges</b> (≈ <code>git add -p</code>)'],
    ['Xem VS Code chạy lệnh gì', '<b>… → Show Git Output</b> · kênh Output <b>Git</b>'],
    ['Giải xung đột bằng 3 cột', '<b>Resolve in Merge Editor</b> → chọn → <b>Complete Merge</b> → commit'],
    ['Cài đặt này ai đặt?', '<code>git config --list --show-origin</code> · <code>--show-origin &lt;khoá&gt;</code>'],
    ['Email trường cho kho trường', '<code>[includeIf "gitdir:~/fpt/"]</code> + <code>path = ~/.gitconfig-fpt</code> (đặt SAU [user])'],
    ['Xem file nào CRLF', '<code>git ls-files --eol</code>'],
    ['Cố định LF cho cả nhóm', '<code>.gitattributes</code>: <code>* text=auto eol=lf</code> → <code>git add --renormalize .</code>'],
    ['Đổi tên chỉ khác hoa/thường', '<code>git mv Button.tsx button.tsx</code>'],
    ['Cho file .sh quyền chạy (kể cả từ Windows)', '<code>git update-index --chmod=+x deploy.sh</code>'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 14 (45 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: sửa 3 chỗ trong một file, dùng <b>Stage Selected Ranges</b> để commit riêng từng chỗ', 'kiểm: <code>git log -p -3</code> — mỗi commit đúng một chỗ'],
      ['Tạo xung đột thật giữa hai nhánh, giải bằng <b>merge editor</b>, mở <b>Show Git Output</b> đọc lệnh', '<code>git status</code> trước và sau Complete Merge'],
      ['Mở cùng kho bằng Git Graph hoặc lazygit; đếm số commit merge', 'so với <code>git lg</code>'],
      ['Thêm alias <code>st</code>/<code>lg</code>/<code>undo</code> + <code>includeIf</code> cho thư mục <code>~/fpt/</code>', '<code>git config --show-origin user.email</code> ở hai nơi'],
      ['Thêm <code>.gitattributes</code>, tạo một file CRLF, <code>git add --renormalize .</code>', '<code>git ls-files --eol</code> toàn <code>i/lf</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> hai thư mục in ra hai email khác nhau, và <code>git ls-files --eol</code> không còn dòng <code>i/crlf</code> nào.')}` },
]);
