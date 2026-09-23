/** Git & GitHub · Deck git-06 — Chương 6: Pull request & code review.
 *  Mọi output terminal / mã băm dưới đây là output THẬT của git 2.51, chạy trong kho thử
 *  scratchpad/ch06-lab (dung.sh → ba-cach.sh → don-dep.sh, ngày commit cố định 2026-09-22 nên chạy lại
 *  ra đúng mã băm này). Dòng gh lấy từ `gh pr create --help` / `gh pr merge --help` (gh 2.93, không gọi GitHub).
 *  Việc GitHub làm trên máy chủ (trang PR, luật bảo vệ, CODEOWNERS) vẽ bằng sơ đồ, KHÔNG bịa output.
 *  Tính năng GitHub kiểm trên docs.github.com — tính đến 09/2026.
 */
import { S, cover, cards, box, steps, table, two, list, code, mindmap, graph, term, diagram, G } from './_git-chung.mjs';

export const deck = { key: 'git-06', code: 'GIT · CHƯƠNG 6', title: 'Pull request & code review', sub: 'Git & GitHub · Chương 6' };

/* ── Wireframe trang PR của GitHub (HTML thuần, vẽ lại cho dễ đọc — không phải ảnh chụp) ── */
const pill = (t, c = G.mu, bg = '#1f2630') => `<span style="font-family:SF Mono,Menlo,monospace;font-size:14px;color:${c};background:${bg};border-radius:6px;padding:1px 8px">${t}</span>`;
const pn = (lbl, body, n) => `<div style="position:relative;border:1.5px solid ${G.bd};border-radius:10px;background:#0f141b;padding:8px 12px;margin-bottom:8px">` +
  `${n ? `<span style="position:absolute;left:-14px;top:-12px;width:26px;height:26px;border-radius:50%;background:${G.git};color:#fff;font-weight:800;font-size:15px;display:flex;align-items:center;justify-content:center">${n}</span>` : ''}` +
  `<div style="font-size:13px;color:${G.mu};font-weight:700;text-transform:uppercase;letter-spacing:.04em">${lbl}</div>${body}</div>`;
const chk = (ok, t) => `<div style="font-size:15px;margin-top:3px"><b style="color:${ok ? G.grn : G.amb}">${ok ? '✓' : '●'}</b> ${t}</div>`;
const wireframe = () => `<div style="display:grid;grid-template-columns:1fr 290px;gap:18px;text-align:left;font-size:16px;color:${G.tx}">
 <div>
  ${pn('Tiêu đề + trạng thái', `<div style="font-size:21px;font-weight:800;margin:2px 0">feat(auth): xoay vòng refresh token <span style="color:${G.mu};font-weight:400">#12</span></div>
   <div style="margin-top:4px"><span style="background:${G.grn};color:#0b0e14;border-radius:14px;padding:2px 10px;font-weight:700;font-size:14px">Open</span>
   &nbsp;cuong muốn merge 3 commit vào ${pill('main', G.blu)} từ ${pill('feature/refresh-token', G.blu)}</div>`, 1)}
  <div style="display:flex;gap:18px;font-size:15px;color:${G.mu};border-bottom:1.5px solid ${G.bd};padding:0 4px 6px;margin:4px 0 10px">
   <b style="color:#fff;border-bottom:2px solid ${G.git};padding-bottom:4px">Conversation</b><span>Commits 3</span><span>Checks 2</span><span>Files changed 1</span></div>
  ${pn('Mô tả (Cái gì · Vì sao · Kiểm thử)', `<div style="font-size:15px;color:#c9d1d9;line-height:1.45">## Vì sao — token cũ đổi được token mới mãi mãi…<br>## Kiểm thử — test/refresh-expiry.test.ts<br><b style="color:${G.vio}">Closes #412</b></div>`, 2)}
  ${pn('Hộp merge ở cuối trang', `${chk(true, 'CI / Lint &amp; Type Check — thành công')}${chk(false, 'CI / Test — đang chạy…')}${chk(false, 'Cần 1 lượt duyệt từ code owner')}
   <div style="margin-top:6px"><span style="background:#238636;opacity:.45;color:#fff;border-radius:6px;padding:4px 12px;font-weight:700;font-size:15px">Squash and merge ▾</span> <span style="font-size:14px;color:${G.mu}">(khoá tới khi đủ điều kiện)</span></div>`, 3)}
 </div>
 <div>
  ${pn('Reviewers', `<div style="font-size:15px;margin-top:3px">@minh <span style="color:${G.amb}">● chờ review</span><br><span style="color:${G.mu}">(CODEOWNERS tự mời)</span></div>`, 4)}
  ${pn('Assignees · Labels', `<div style="font-size:15px;margin-top:3px">@cuong · ${pill('auth', G.pnk)} ${pill('bug', G.red)}</div>`)}
  ${pn('Development', `<div style="font-size:15px;margin-top:3px">🔗 #412 — sẽ tự đóng khi merge</div>`)}
  ${box('tip', '<b>Draft</b>: nút merge bị khoá, code owner chưa bị mời — dùng để xin ý kiến sớm.')}
 </div></div>`;

export const slides = S([
  cover({ t: 'Chương 6 — Pull request &amp; code review', sub: 'Giải phẫu một PR · cho và nhận review · merge / squash / rebase · nhánh bảo vệ &amp; CODEOWNERS', chap: 'CHƯƠNG 6' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Pull request', 'một đơn vị việc của cả nhóm', [
    { t: '6.1 Giải phẫu PR', d: 'nhỏ · tiêu đề · mô tả · Closes #n · mẫu · nháp', c: 'grn' },
    { t: '6.2 Review', d: 'Comment / Approve / Request changes · nit: · blocking:', c: 'blu' },
    { t: '6.3 Ba nút merge', d: 'merge commit · squash · rebase — ba lịch sử khác nhau', c: 'vio' },
    { t: '6.4 Bảo vệ nhánh', d: 'cấm push thẳng · CI bắt buộc · CODEOWNERS · ruleset', c: 'git' },
  ]) },

  /* 3 */
  { t: 'Vòng đời một pull request', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'b', x: 0, y: 20, w: 240, h: 86, t: '1 · Tạo nhánh', d: 'git switch -c feature/…', c: 'grn', mono: true },
      { id: 'p', x: 290, y: 20, w: 240, h: 86, t: '2 · Commit + push', d: 'git push -u origin …', c: 'grn', mono: true },
      { id: 'o', x: 580, y: 20, w: 240, h: 86, t: '3 · Mở PR', d: 'gh pr create (--draft)', c: 'blu', mono: true },
      { id: 'c', x: 870, y: 20, w: 240, h: 86, t: '4 · CI chạy', d: 'lint · type check · test', c: 'amb' },
      { id: 'r', x: 870, y: 220, w: 240, h: 86, t: '5 · Review', d: 'bình luận → sửa → duyệt', c: 'vio' },
      { id: 'm', x: 580, y: 220, w: 240, h: 86, t: '6 · Merge', d: 'một trong ba nút (6.3)', c: 'git' },
      { id: 'd', x: 290, y: 220, w: 240, h: 86, t: '7 · Xoá nhánh', d: 'GitHub + máy mình', c: 'dim' },
    ], edges: [
      { from: 'b', to: 'p', c: 'grn' }, { from: 'p', to: 'o', c: 'blu' }, { from: 'o', to: 'c', c: 'amb' },
      { from: 'c', to: 'r', c: 'vio', fs: 'r', ts: 'r', bend: 45 }, { from: 'r', to: 'm', c: 'git' }, { from: 'm', to: 'd', c: 'dim' },
      { from: 'r', to: 'p', c: 'red', dash: true, t: 'cần sửa ⇒ commit mới, push lại', fs: 't', ts: 'b', bend: -30, off: 30 },
    ] })}
    ${box('info', 'Vòng <b>5 → 2</b> lặp đến khi xanh và được duyệt. Mỗi lần push thêm vào cùng nhánh, PR tự cập nhật — <b>không</b> mở PR mới.')}` },

  /* 4 */
  { t: 'PR nhỏ được review thật, PR to được “LGTM”', body: `
    ${cards([
      { t: '&lt; 100 dòng', d: 'Người review giữ trọn thay đổi trong đầu, bình luận vào logic.', c: 'grn', big: '✓' },
      { t: '100 – 400 dòng', d: 'Vài file đầu được đọc kỹ, các file cuối chỉ được lướt.', c: 'amb', big: '≈' },
      { t: '&gt; 400 dòng', d: 'Nằm chờ ba ngày, rồi nhận một chữ “LGTM” — lỗi lọt qua.', c: 'red', big: '✗' },
    ])}
    ${diagram({ w: 1160, h: 200, nodes: [
      { id: 'x', x: 0, y: 50, w: 300, h: 96, t: '1 PR · 900 dòng', d: 'migration + refactor\n+ tính năng + dọn dẹp', c: 'red', dash: true },
      { id: 'a', x: 470, y: 0, w: 300, h: 56, t: 'PR 1 · migration Prisma', c: 'grn' },
      { id: 'b2', x: 470, y: 70, w: 300, h: 56, t: 'PR 2 · refactor helper', c: 'grn' },
      { id: 'c2', x: 470, y: 140, w: 300, h: 56, t: 'PR 3 · tính năng dùng nó', c: 'grn' },
      { id: 'k', x: 870, y: 64, w: 280, h: 70, t: 'mỗi cái < 300 dòng', d: 'review trong ngày', c: 'blu' },
    ], edges: [
      { from: 'x', to: 'a', c: 'dim' }, { from: 'x', to: 'b2', c: 'dim' }, { from: 'x', to: 'c2', c: 'dim' },
      { from: 'a', to: 'k', c: 'blu' }, { from: 'b2', to: 'k', c: 'blu' }, { from: 'c2', to: 'k', c: 'blu' },
    ] })}` },

  /* 5 */
  { t: 'Một trang PR có gì (vẽ lại từ giao diện GitHub)', body: wireframe() },

  /* 6 */
  { t: 'Mô tả nói điều diff không nói được', body: two(
    code(`## Cái gì
Từ chối refresh token đã quá exp.

## Vì sao
Token 6 tuần tuổi vẫn đổi được token mới.

## Kiểm thử
- test/refresh-expiry.test.ts (hết hạn → 401)

Closes #412   # merge xong issue tự đóng`, 'plaintext'),
    `${term([
      '$ gh pr create --help',
      '  -d, --draft          Mark pull request as a draft',
      '  -r, --reviewer handle  Request reviews from people or teams by their handle',
      '  -t, --title string   Title for the pull request',
      '  -F, --body-file file Read body text from file',
      '  -f, --fill           Use commit info for title and body',
    ], { title: 'gh 2.93 — trích help, khoảng trắng rút gọn', branch: 'feature/refresh-token' })}
    ${box('tip', 'Đặt khung vào <code>.github/pull_request_template.md</code> ⇒ mọi PR mới tự điền sẵn. <code>Closes #412</code> phải nằm trong <b>mô tả</b> hoặc commit, không phải bình luận.')}`, 'r') },

  /* 7 */
  { t: 'Ba loại verdict — và vòng review', body: `
    ${cards([
      { ic: '💬', t: 'Comment', d: 'Hỏi, góp ý, không phán quyết. Không chặn merge.', c: 'blu' },
      { ic: '✅', t: 'Approve', d: '“Tôi yên tâm cho lên.” Vẫn kèm được vài <code>nit:</code> tuỳ chọn.', c: 'grn' },
      { ic: '⛔', t: 'Request changes', d: 'Chặn merge (khi bật bảo vệ) tới khi CHÍNH người đó duyệt lại. Chỉ cho lỗi thật.', c: 'red' },
    ])}
    ${steps([
      ['Người review bấm <b>Start a review</b>, viết hết, gửi <b>một lần</b>', 'mười lăm bình luận lẻ = mười lăm thông báo cắt ngang'],
      ['Tác giả sửa bằng <b>commit mới</b>, trả lời “Đã sửa ở 1a2b3c4”, đóng luồng', 'đừng force-push viết lại lịch sử giữa lúc review'],
      ['Người review xem riêng phần đổi từ lượt trước, rồi Approve', 'gộp commit để lúc merge (6.3), không phải lúc review'],
    ])}` },

  /* 8 */
  { t: 'Gắn nhãn sức nặng cho từng bình luận', body: two(
    table(['Nhãn', 'Nghĩa là', 'Chặn merge?'], [
      ['<code>blocking:</code>', 'Lỗi đúng/sai, bảo mật, mất dữ liệu', '-Có'],
      ['<code>question:</code>', 'Hỏi thật, chờ trả lời', 'Tuỳ câu trả lời'],
      ['<code>nit:</code>', 'Chuyện vặt, tác giả tự quyết', '+Không'],
      ['<code>praise:</code>', 'Khen chỗ làm tốt', '+Không'],
    ], { sm: true }) +
    box('info', '<b>Thứ tự đọc một PR:</b> mô tả → test → thay đổi chính → cấu hình/migration → chạy thử bằng <code>gh pr checkout 12</code>.'),
    `${code(`\`\`\`suggestion
  if (payload.exp * 1000 < Date.now()) {
\`\`\``, 'plaintext')}
    ${list(['Khối <code>suggestion</code> ⇒ tác giả bấm một nút là thành commit', 'Chỉ dùng cho sửa một dòng; thứ cần suy nghĩ thì viết lời'])}`, 'l') },

  /* 9 */
  { t: 'Nút 1 — Create a merge commit', body: `
    ${graph({ w: 1160, h: 250, y0: 70, dy: 120, dx: 150, x0: 170, lanes: [{ lane: 0, n: 'feature', c: 'blu' }, { lane: 1, n: 'main', c: 'git' }], commits: [
      { id: 'B', x: 0, lane: 1, t: '4398486' }, { id: 'F', x: 2, lane: 1, p: ['B'], t: '1b6f2b6 fix(feed)' },
      { id: '1', x: 1, lane: 0, p: ['B'], c: 'blu', t: '720885d' }, { id: '2', x: 2, lane: 0, p: ['1'], c: 'blu', t: 'e4b1e45 wip' },
      { id: '3', x: 3, lane: 0, p: ['2'], c: 'blu', t: 'a3e4a62' },
      { id: 'M', x: 4, lane: 1, p: ['F', '3'], star: true, hl: true, t: '2c143dd' },
    ], refs: [{ to: '3', n: 'feature/refresh-token' }, { to: 'M', n: 'main' }] })}
    ${two(
      term([
        '$ git merge --no-ff feature/refresh-token -m "Merge pull request #12 from cuong/feature/refresh-token"',
        "Merge made by the 'ort' strategy.",
        '$ git log --oneline --first-parent -3',
        '+ 2c143dd Merge pull request #12 from cuong/feature/refresh-token',
        '1b6f2b6 fix(feed): hết lỗi 500 khi bài không có tác giả',
        '4398486 chore: thêm CODEOWNERS và mẫu PR',
      ], { title: 'output thật — kho thử ch06-lab' }),
      list(['Giữ <b>mọi</b> commit, cả “wip”', '<code>--first-parent</code>: mỗi PR một dòng', 'Gỡ cả PR: <code>git revert -m 1 2c143dd</code>']), 'l2')}` },

  /* 10 */
  { t: 'Nút 2 và 3 — Squash and merge · Rebase and merge', body: two(
    `<b style="font-size:20px;color:${G.grn}">Squash: cả PR thành MỘT commit</b>
    ${graph({ w: 560, h: 215, y0: 110, dx: 120, x0: 70, commits: [
      { id: 'B', x: 0, t: '4398486' }, { id: 'F', x: 1, p: ['B'], t: '1b6f2b6' },
      { id: 'S', x: 2, p: ['F'], c: 'grn', hl: true, t: '54bfcbf (#12)' },
    ], refs: [{ to: 'S', n: 'main' }] })}
    ${term(['$ git merge --squash feature/refresh-token', 'Squash commit -- not updating HEAD', '$ git commit -m "feat(auth): xoay vòng refresh token (#12)"', '$ git log --oneline -2', '+ 54bfcbf feat(auth): xoay vòng refresh token (#12)'], { title: 'output thật' })}`,
    `<b style="font-size:20px;color:${G.vio}">Rebase: phát lại từng commit, mã băm MỚI</b>
    ${graph({ w: 560, h: 215, y0: 75, dy: 80, dx: 110, x0: 50, commits: [
      { id: 'F', x: 0, t: '1b6f2b6' },
      { id: "1'", x: 1, p: ['F'], c: 'vio', t: '69a3cc8' }, { id: "2'", x: 2, p: ["1'"], c: 'vio', t: '5844411' }, { id: "3'", x: 3, p: ["2'"], c: 'vio', hl: true, t: '86b4690' },
      { id: '1', x: 1, lane: 1, ghost: true }, { id: '2', x: 2, lane: 1, p: ['1'], ghost: true }, { id: '3', x: 3, lane: 1, p: ['2'], ghost: true, t: 'a3e4a62 · bản cũ' },
    ], refs: [{ to: "3'", n: 'main' }] })}
    ${term(['$ git rebase main', 'Successfully rebased and updated refs/heads/feature/refresh-token.', '$ git switch main && git merge --ff-only feature/refresh-token', 'Updating 1b6f2b6..86b4690', '+ Fast-forward'], { title: 'output thật', branch: 'feature/refresh-token' })}`) },

  /* 11 */
  { t: 'Ba nút, ba lịch sử — chọn MỘT, tắt hai cái kia', body: `
    ${table(['', 'Merge commit', 'Squash', 'Rebase'], [
      ['Trên main có', 'mọi commit + 1 commit hai cha', '1 commit / PR', 'mọi commit, mã băm mới'],
      ['Lời nhắn trên main', '“Merge pull request #12…”', '!mặc định: tiêu đề PR (PR ≥ 2 commit)', 'lời nhắn từng commit'],
      ['Gỡ cả PR', '<code>revert -m 1 &lt;merge&gt;</code>', '<code>revert &lt;1 commit&gt;</code>', '-revert từng commit'],
      ['<code>git bisect</code>', 'tốt (có <code>--first-parent</code>)', '+mỗi bước đã qua CI', '-commit giữa chưa từng chạy CI'],
      ['<code>git branch -d</code> sau đó', '+xoá được', '-từ chối — phải <code>-D</code>', '-từ chối — phải <code>-D</code>'],
      ['Hợp với', 'nhóm lớn, nhánh phát hành', '+đồ án SWP391 — mặc định', 'nhóm tự dọn lịch sử kỹ'],
    ], { sm: true })}
    ${two(
      term(['$ gh pr merge --help', '  -m, --merge   Merge the commits with the base branch', '  -s, --squash  Squash the commits into one commit and merge it into the base branch', '  -r, --rebase  Rebase the commits onto the base branch', '      --auto    Automatically merge only after necessary requirements are met', '  -d, --delete-branch  Delete the local and remote branch after merge'], { title: 'gh 2.93 — trích help, khoảng trắng rút gọn' }),
      box('warn', 'Rebase trên GitHub <b>luôn</b> tạo mã băm mới và đổi người commit (docs GitHub, 09/2026) — khác <code>git rebase</code> ở máy.'), 'l2')}` },

  /* 12 */
  { t: 'Hệ quả thấy ngay trên máy: revert và dọn nhánh', body: two(
    term([
      '# merge commit: phải nói giữ phía cha nào',
      '$ git revert HEAD',
      '! error: commit 2c143dd800d70384985b0a81b0e5897836da9dd1 is a merge but no -m option was given.',
      '! fatal: revert failed',
      '$ git revert -m 1 --no-edit HEAD',
      '= [main 90f2d3b] Revert "Merge pull request #12 from cuong/feature/refresh-token"',
      ' 1 file changed, 1 deletion(-)',
    ], { title: 'output thật — kho merge', branch: 'main' }),
    term([
      '# squash xong, GitHub đã xoá nhánh trên server',
      '$ git pull && git fetch --prune',
      ' - [deleted]         (none)     -> origin/feature/refresh-token',
      '$ git branch -d feature/refresh-token',
      "! error: the branch 'feature/refresh-token' is not fully merged",
      '# đúng: commit 54bfcbf là bản MỚI, không phải a3e4a62',
      '$ git branch -D feature/refresh-token',
    ], { title: 'output thật — kho squash', branch: 'main' })) },

  /* 13 */
  { t: 'Nhánh bảo vệ: “đã thống nhất” thành “máy chủ từ chối”', body: two(
    diagram({ w: 600, h: 440, nodes: [
      { id: 'me', x: 0, y: 170, w: 170, h: 80, t: '💻 máy Cường', c: 'amb' },
      { id: 'pr', x: 220, y: 20, w: 170, h: 70, t: 'Pull request', c: 'blu' },
      { id: 'g', x: 220, y: 150, w: 170, h: 120, t: '🛡 cổng luật', d: 'CI xanh?\n1 lượt duyệt?\ncode owner?', c: 'grn' },
      { id: 'mn', x: 430, y: 170, w: 160, h: 80, t: 'main', c: 'git', mono: true },
      { id: 'x', x: 220, y: 350, w: 170, h: 70, t: 'từ chối', d: 'protected branch', c: 'red', dash: true },
    ], edges: [
      { from: 'me', to: 'pr', c: 'blu', fs: 't', ts: 'l' }, { from: 'pr', to: 'g', c: 'blu' }, { from: 'g', to: 'mn', c: 'grn' },
      { from: 'me', to: 'x', c: 'red', t: 'push thẳng', fs: 'b', ts: 'l', dash: true },
    ] }),
    `${table(['Luật nên bật cho main', ''], [
      ['Require a pull request before merging', '+nền móng'],
      ['Require approvals: 1 (nhóm 4–5 người)', '+đủ'],
      ['Dismiss stale approvals khi có commit mới', '+vá lỗ “duyệt rồi push bừa”'],
      ['Require status checks + up to date', '+giữ main xanh'],
      ['Require conversation resolution', '+không lờ bình luận'],
      ['Chặn force push (bật sẵn khi bảo vệ)', '+cứu main khỏi --force'],
    ], { sm: true })}
    ${box('warn', 'Repo <b>private</b> trên tài khoản Free: <b>không</b> có nhánh bảo vệ/ruleset. Cần Pro (gói sinh viên GitHub có Pro miễn phí) hoặc Team — tính đến 09/2026.')}`, 'r') },

  /* 14 */
  { t: 'CODEOWNERS — tự mời đúng người review', body: two(
    term([
      '$ cat .github/CODEOWNERS',
      '# luật khớp CUỐI CÙNG thắng',
      '*               @cuong',
      '/src/auth.ts    @minh',
      '/prisma/        @cuong @lan',
    ], { title: 'kho thử ch06-lab', branch: 'main' }),
    diagram({ w: 560, h: 330, nodes: [
      { id: 'a', x: 0, y: 0, w: 280, h: 60, t: 'src/auth.ts', c: 'amb', mono: true },
      { id: 'b', x: 0, y: 125, w: 280, h: 60, t: 'prisma/schema.prisma', c: 'amb', mono: true },
      { id: 'c', x: 0, y: 250, w: 280, h: 60, t: 'README.md', c: 'amb', mono: true },
      { id: 'm', x: 340, y: 0, w: 210, h: 60, t: '@minh', c: 'vio', mono: true },
      { id: 'l', x: 340, y: 125, w: 210, h: 60, t: '@cuong @lan', c: 'vio', mono: true },
      { id: 'k', x: 340, y: 250, w: 210, h: 60, t: '@cuong', c: 'vio', mono: true },
    ], edges: [{ from: 'a', to: 'm', c: 'vio' }, { from: 'b', to: 'l', c: 'vio' }, { from: 'c', to: 'k', c: 'vio' }] }), 'r') +
    box('tip', '<code>src/auth.ts</code> khớp cả <code>*</code> lẫn <code>/src/auth.ts</code> ⇒ dòng DƯỚI thắng ⇒ chỉ <b>@minh</b>. Bật “Require review from Code Owners” thì thiếu @minh là không merge được. Gán <b>đội</b>, đừng gán một người hay đi vắng.') },

  /* 15 */
  { t: 'Kiểm tra bắt buộc — và cái bẫy “Pending” mãi mãi', body: two(
    `${code(`name: CI
on:
  pull_request:
    paths: ['src/**']   # ⚠ PR chỉ sửa README ⇒ không chạy
jobs:
  test:
    name: Lint & Type Check   # tên này khai vào luật
    runs-on: ubuntu-latest`, 'yaml')}
    ${box('bad', 'Workflow bị bỏ qua vì <code>paths</code> ⇒ check đứng ở <b>Pending</b> và <b>chặn merge</b>. Job bị bỏ qua vì <code>if:</code> thì lại báo <b>Success</b> (docs GitHub, 09/2026).')}`,
    table(['', 'Branch protection', 'Ruleset'], [
      ['Số luật trên một nhánh', 'đúng 1', '+nhiều, xếp chồng — luật chặt nhất thắng'],
      ['Ai xem được', 'admin', '+ai có quyền đọc repo'],
      ['Tắt tạm', 'phải xoá', '+đổi Active ↔ Disabled'],
      ['Nhắm cả tag', '-không', '+có (mẫu fnmatch)'],
      ['Chế độ Evaluate', '—', '!chỉ GitHub Enterprise'],
      ['Repo private', 'cần Pro / Team', 'cần Pro / Team'],
    ], { sm: true }), 'l') },

  /* 16 */
  { t: 'Bảng tra nhanh Chương 6', body: table(['Muốn…', 'Gõ / bật'], [
    ['Mở PR nháp, mời người review', '<code>gh pr create --draft -r minh</code>'],
    ['Đóng issue khi PR merge', '<code>Closes #412</code> trong <b>mô tả</b> PR'],
    ['Kéo PR của bạn về máy để chạy thử', '<code>gh pr checkout 12</code> · <code>gh pr diff 12</code>'],
    ['Duyệt / yêu cầu sửa', '<code>gh pr review 12 --approve</code> · <code>--request-changes -b "…"</code>'],
    ['Merge kiểu squash, tự merge khi xanh, xoá nhánh', '<code>gh pr merge 12 --squash --auto --delete-branch</code>'],
    ['Gỡ một PR đã merge bằng merge commit', '<code>git revert -m 1 &lt;mã merge&gt;</code>'],
    ['Dọn máy sau merge', '<code>git switch main &amp;&amp; git pull &amp;&amp; git fetch --prune</code>'],
    ['Xoá nhánh đã squash (Git không nhận ra)', '<code>git branch -D feature/…</code>'],
    ['Bảo vệ main', 'Settings → Rules → Rulesets (hoặc Branches)'],
  ], { sm: true }) },

  /* 17 */
  { t: 'Thực hành chương 6 (45 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: tạo <code>.github/pull_request_template.md</code> + <code>CODEOWNERS</code>', 'commit lên main, push'],
      ['Tạo một issue; làm nhánh 3 commit (có một “wip”), push, <code>gh pr create --draft</code>', 'mô tả có <code>Closes #&lt;số issue&gt;</code> — hoặc nút Compare &amp; pull request trên web'],
      ['Tự review PR của mình: một <code>nit:</code>, một <code>suggestion</code>, áp gợi ý', 'đọc tab Files changed như người lạ'],
      ['Merge bằng <b>Squash</b>, xoá nhánh trên GitHub', 'rồi <code>git pull</code>, <code>git fetch --prune</code>, thử <code>git branch -d</code>'],
      ['Nếu repo public (hoặc có Pro): bật ruleset cho main', 'thử <code>git push origin main</code> thẳng — đọc lời từ chối'],
    ])}
    ${box('good', '<b>Đạt khi:</b> PR vào main thành đúng một commit (squash), issue tự đóng, và bạn giải thích được vì sao <code>git branch -d</code> từ chối.')}` },
]);
