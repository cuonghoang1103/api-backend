/** Git & GitHub · Deck git-16 — Chương 16: Dự án nhóm cuối khoá (đồ án "Đặt lịch phòng khám", 4 SV, 3 tuần).
 *  Mọi output terminal / mã băm là output THẬT của git 2.51.1 (npm 10.9.4, node 22) trong kho thử
 *  scratchpad/ch16-lab: sprint.sh (4 bản clone của một kho bare, ngày cố định ⇒ mã băm tái lập) và
 *  su-co.sh (8 sự cố). Bước "Squash and merge" của GitHub được GIẢ LẬP bằng git merge --squash trong một
 *  bản clone riêng (tác giả = người viết PR, committer = GitHub) — không gọi GitHub thật.
 *  Đường dẫn scratch dài được in tắt thành "~". Giao diện GitHub (ruleset, Projects) vẽ lại theo tên gọi
 *  trên docs.github.com, tính đến 09/2026.
 */
import { S, cover, cards, box, steps, table, two, list, code, cap, seg, mindmap, graph, term, diagram, conflict, G } from './_git-chung.mjs';

export const deck = { key: 'git-16', code: 'GIT · CHƯƠNG 16', title: 'Dự án nhóm cuối khoá', sub: 'Git & GitHub · Chương 16' };

const T = (lines, title = 'output thật — git 2.51', dir = '~/phong-kham', branch = 'main') => term(lines, { title, dir, branch });
const mono = 'font-family:SF Mono,Menlo,monospace';

/* ─────────── bảng Projects (vẽ lại, không phải ảnh chụp) ─────────── */
const the = (so, t, ai, c, extra = '') => `<div style="background:#0d1117;border:1.5px solid ${G.bd};border-left:4px solid ${c};border-radius:8px;padding:7px 10px;margin-top:8px">` +
  `<div style="font-size:15px;color:#e6edf3;font-weight:700">${so} ${t}</div><div style="font-size:13px;color:${G.mu};margin-top:2px">${ai}${extra}</div></div>`;
const cot = (ten, n, c, cards) => `<div style="background:#141a22;border:1.5px solid ${G.bd};border-radius:12px;padding:10px 10px 12px">` +
  `<div style="display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800;color:#fff"><span style="width:12px;height:12px;border-radius:50%;background:${c}"></span>${ten}<span style="background:#30363d;border-radius:9px;padding:0 8px;font-size:13px;color:${G.mu}">${n}</span></div>${cards}</div>`;
const board = () => `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:left">
  ${cot('Todo', 2, G.mu, the('#9', 'Trang xem lịch đã đặt', '👤 Linh', G.blu) + the('#11', 'Test giới hạn 3 lịch', '👤 Trang', G.vio))}
  ${cot('In Progress', 0, G.amb, `<div style="color:${G.dim};font-size:14px;margin-top:10px">(trống)</div>`)}
  ${cot('In Review', 2, G.blu, the('#2', 'Form đặt lịch', '👤 Linh · PR #6', G.blu, ` · <b style="color:${G.red}">changes requested</b>`) + the('#3', 'API đặt lịch', '👤 Cường · PR #7', G.git, ` · <b style="color:${G.red}">conflict</b>`))}
  ${cot('Done', 2, G.grn, the('#1', 'Khung giờ trống', '👤 Huy · PR #5 merged', G.grn) + the('#4', 'Hướng dẫn chạy', '👤 Trang · PR #8 merged', G.grn))}
</div>`;

/* ─────────── lộ trình sau khoá ─────────── */
const lo = (ic, t, d, c) => `<div style="background:#141a22;border:2px solid ${c};border-radius:14px;padding:12px 14px;text-align:left"><div style="font-size:19px;font-weight:800;color:#fff">${ic} ${t}</div><div style="font-size:15px;color:${G.mu};margin-top:4px;line-height:1.45">${d}</div></div>`;

export const slides = S([
  cover({ t: 'Chương 16 — Dự án nhóm cuối khoá', sub: 'Ngày 0 dựng repo · một sprint thật của 4 người · phát hành v1.0.0 và hotfix · 8 sự cố kinh điển · bài thi cuối khoá', chap: 'CHƯƠNG 16' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Dự án nhóm', '“Đặt lịch phòng khám” · 4 SV · 3 tuần', [
    { t: '16.1 Ngày 0', d: 'Organization · README/CONTRIBUTING · mẫu issue/PR · ruleset · CODEOWNERS · CI', c: 'blu' },
    { t: '16.2 Một sprint thật', d: '4 issue → 4 nhánh → PR → review → xung đột → squash merge', c: 'grn' },
    { t: '16.3 Nộp bài & hotfix', d: 'tag v1.0.0 · CHANGELOG · hotfix từ tag → v1.0.1 · cherry-pick', c: 'vio' },
    { t: '16.4 Tám sự cố', d: 'triệu chứng → chẩn đoán → cứu → phòng', c: 'red' },
    { t: '16.5 Thi cuối khoá', d: '20 câu tình huống, Ch1–16', c: 'amb' },
    { t: 'Sau khoá này', d: 'học gì tiếp theo', c: 'tea' },
  ]) },

  /* 3 */
  { t: 'Ba tuần của nhóm 5 — trục thời gian thật của kho thử', body: `
    ${seg([
      { t: 'Ngày 0', d: 'dựng repo', w: 2.2, c: G.blu },
      { t: 'Sprint 1', d: '#1–#4 → PR #5–#8', w: 4, c: G.grn },
      { t: 'Sprint 2', d: '#9, #11 → PR #10, #12', w: 9, c: G.vio },
      { t: 'Chốt', d: 'v1.0.0', w: 2, c: G.git },
      { t: 'Sau nộp', d: 'v1.0.1', w: 3, c: G.red },
    ], ['31/08', '01/09', '07/09', '17/09', '20/09', '22/09'])}
    ${table(['Ngày', 'Việc', 'Kết quả trong kho'], [
      ['31/08', 'Cường dựng repo: README, CONTRIBUTING, mẫu, CODEOWNERS, CI', '<code>0fd7fe1</code> · <code>a97c247</code> · <code>b10dacc</code>'],
      ['01–02/09', 'Mỗi người một issue, một nhánh, mở PR', '<code>feat/1-khung-gio</code> · <code>feat/2-form-dat-lich</code> · <code>feat/3-api-dat-lich</code> · <code>docs/4-huong-dan</code>'],
      ['03–04/09', 'Review, sửa theo review, <b>một xung đột thật</b>, squash merge', '+<code>0d838d5</code> #5 · <code>6aa8d69</code> #8 · <code>23ba455</code> #6 · <code>170a83c</code> #7'],
      ['18/09', 'Chốt bản nộp', '!<code>f76a7bb</code> 🏷 <code>v1.0.0</code>'],
      ['21/09', 'Lỗi “đặt được lịch Chủ nhật” → hotfix từ tag', '-<code>0cec9a9</code> → 🏷 <code>v1.0.1</code>, cherry-pick về main <code>364e32a</code>'],
    ], { sm: true })}` },

  /* 4 */
  { t: 'Ngày 0: repo có gì trước khi ai viết dòng code đầu tiên', body: two(
    table(['File', 'Để làm gì'], [
      ['<code>README.md</code>', 'dự án là gì, ai làm, chạy thế nào'],
      ['<code>CONTRIBUTING.md</code>', 'luồng issue → nhánh → PR, tên nhánh, luật cứng'],
      ['<code>.gitignore</code> · <code>.env.example</code>', 'chặn <code>.env</code>, <code>node_modules/</code> từ đầu'],
      ['<code>.gitattributes</code>', '<code>* text=auto eol=lf</code> — nhóm Mac + Windows'],
      ['<code>.github/ISSUE_TEMPLATE/*.yml</code>', 'form “Tính năng”, “Báo lỗi”'],
      ['<code>.github/pull_request_template.md</code>', 'khung mô tả PR + checklist'],
      ['<code>.github/CODEOWNERS</code>', 'ai tự động được mời review phần nào'],
      ['<code>.github/workflows/ci.yml</code>', 'lint + test cho mọi PR'],
    ], { sm: true }),
    T(['$ git log --oneline', 'b10dacc ci: chạy lint + test cho mọi pull request', 'a97c247 docs: quy ước làm việc nhóm — CONTRIBUTING, mẫu issue/PR, CODEOWNERS', '0fd7fe1 chore: khởi tạo dự án phong-kham',
      '$ echo "SECRET=abc" > .env; git status --short --ignored', '= !! .env', '= !! node_modules/',
      '$ git check-ignore -v .env', '.gitignore:8:.env	.env',
      '# !! = bị bỏ qua đúng ý — không bao giờ lọt vào commit'], 'output thật — máy Cường, 31/08'), 'l') },

  /* 5 */
  { t: 'Chủ repo là ai quyết định luật nào bật được', body: `
    ${table(['Repo nằm ở…', 'Ruleset / branch protection', 'CODEOWNERS', 'Hợp nhóm SV khi…'], [
      ['Organization Free · repo <b>public</b>', '+có', '+có', 'thầy cho phép code công khai'],
      ['Organization Free · repo <b>private</b>', '-KHÔNG', '-KHÔNG', '!chỉ dùng được PR + review “tự giác”'],
      ['Tài khoản cá nhân có <b>GitHub Pro</b> · private', '+có', '+có', 'trưởng nhóm đã có Student Pack (Pro miễn phí)'],
      ['Organization <b>Team</b> · private', '+có', '+có', 'tổ chức trả phí / được cấp'],
    ], { sm: true })}
    ${two(steps([
      ['Ảnh đại diện → <b>Settings</b> → <b>Organizations</b> → <b>New organization</b>', 'tên gợi ý: <code>swp391-g5-phongkham</code>'],
      ['Mời 3 bạn làm member, repo cho quyền <b>Write</b>', 'trưởng nhóm giữ Admin'],
      ['Repo → <b>Settings</b> → “Code and automation” → <b>Rulesets</b> → <b>New branch ruleset</b>', 'nhắm <code>main</code> (Default branch)'],
    ]), box('info', 'Nguồn: docs.github.com — “Rulesets are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team…” (tính đến 09/2026).'), 'r')}` },

  /* 6 */
  { t: 'Ruleset cho main: năm luật đủ cho nhóm 4 người', body: two(
    `${table(['Luật (tên trong GitHub)', 'Chặn được gì'], [
      ['<b>Restrict deletions</b>', 'ai đó lỡ xoá <code>main</code>'],
      ['<b>Block force pushes</b>', '<code>git push --force</code> đè lịch sử chung'],
      ['<b>Require a pull request before merging</b> · 1 approval', 'push thẳng; tự duyệt PR của mình'],
      ['<b>Require status checks to pass before merging</b> → <code>kiem-tra</code>', 'merge khi CI đỏ'],
      ['<b>Require linear history</b> (tuỳ)', 'merge commit trên main — chỉ squash/rebase'],
    ], { sm: true })}
    ${cap('Tên luật lấy đúng từ “Available rules for rulesets”, docs.github.com, 09/2026.')}`,
    `${box('warn', '<b>Bypass list</b> để trống. Trưởng nhóm cũng đi qua PR — luật chỉ có giá trị khi không ai được miễn.')}
    ${box('tip', 'Bật luật <b>SAU</b> khi đã push xong bộ khung Ngày 0 — bật trước thì từng file khung cũng phải đi qua PR.')}
    ${box('info', '“Require branches to be up to date before merging” được <b>tích sẵn</b> — nhóm nhỏ nên bỏ tích: không thì mỗi lần một PR merge, ba PR kia phải cập nhật lại. CI chạy lại trên main sau merge bù vào.')}`, 'l2') },

  /* 7 */
  { t: 'Ba file khuôn: issue form · PR template · CODEOWNERS', body: `<div style="display:grid;grid-template-columns:1.05fr 1fr;gap:18px">
    ${code(`# .github/ISSUE_TEMPLATE/tinh-nang.yml
name: Tính năng
description: Một việc cần làm — xong trong 1–3 ngày.
title: "[Tính năng]: "
labels: ["tinh-nang"]
body:
  - type: textarea
    id: user-story
    attributes:
      label: User story
      description: Là <ai>, tôi muốn <gì>, để <vì sao>.
    validations:
      required: true
  - type: dropdown
    id: phan
    attributes:
      label: Phần việc
      options: [Backend, Frontend, Tài liệu, CI / cấu hình]`, 'yaml')}
    <div>${code(`<!-- .github/pull_request_template.md -->
## Việc gì
Closes #

## Cách kiểm
- [ ] npm test xanh ở máy mình

## Tự kiểm trước khi xin duyệt
- [ ] Không có .env, khoá API, console.log`, 'markdown')}
    ${code(`# .github/CODEOWNERS — dòng khớp SAU CÙNG thắng
*            @cuong-g5
/src/        @huy-g5 @cuong-g5
/public/     @linh-g5
/docs/       @trang-g5`, 'plaintext')}</div></div>
    ${cap('Bản đầy đủ (kiểm bằng actionlint + trình đọc YAML) in trong bài 16.1. Tên tài khoản là ví dụ.')}` },

  /* 8 */
  { t: 'CI tối thiểu — và cái bẫy “0 test vẫn xanh”', body: two(
    code(`name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  kiem-tra:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test`, 'yaml'),
    `${T(['$ npm test 2>&1 | grep -E "^# (tests|pass|fail)"', '! # tests 0', '+ # pass 0', '+ # fail 0', '# ↑ lệnh thoát với mã 0 ⇒ CI báo XANH mà không kiểm gì'], 'output thật — trước khi có test', '~/phong-kham')}
    ${T(['$ npm run lint --silent && npm test …', 'lint: 1 file, cú pháp ổn', '= # tests 2', '= # pass 2', '= # fail 0'], 'output thật — sau khi thêm test/config.test.js', '~/phong-kham')}
    ${box('tip', 'Tên job <code>kiem-tra</code> là tên “status check” chọn trong ruleset. Slide bỏ khối <code>concurrency</code> cho gọn — bản đủ ở bài 16.1.')}`, 'r') },

  /* 9 */
  { t: 'Vòng đời một việc: issue → nhánh → PR → CI + review → squash', body: diagram({ w: 1160, h: 480, nodes: [
    { id: 'i', x: 0, y: 0, w: 190, h: 80, t: 'Issue #1', d: 'Khung giờ trống\nHuy tự gán', c: 'amb' },
    { id: 'b', x: 300, y: 0, w: 240, h: 80, t: 'Nhánh', d: 'feat/1-khung-gio\n2 commit', c: 'grn', mono: true },
    { id: 'p', x: 650, y: 0, w: 250, h: 80, t: 'PR #5', d: 'thân: Closes #1\nmở 02/09', c: 'blu' },
    { id: 'ci', x: 520, y: 140, w: 220, h: 80, t: 'CI: kiem-tra', d: 'lint + test ✓', c: 'tea' },
    { id: 'rv', x: 810, y: 140, w: 250, h: 80, t: 'Review', d: 'CODEOWNERS mời Cường\nApprove ✓', c: 'vio' },
    { id: 'm', x: 590, y: 272, w: 400, h: 80, t: 'Squash and merge', d: '0d838d5 trên main · tác giả Huy\ncommitter GitHub', c: 'git' },
    { id: 'x1', x: 0, y: 400, w: 360, h: 80, t: 'Issue #1 tự đóng', d: 'nhờ “Closes #1” — chỉ khi\nmerge vào nhánh mặc định', c: 'amb', dash: true },
    { id: 'x2', x: 400, y: 400, w: 360, h: 80, t: 'Projects: Done', d: 'workflow mặc định:\nPR merged → Status = Done', c: 'grn', dash: true },
    { id: 'x3', x: 800, y: 400, w: 360, h: 80, t: 'Xoá nhánh', d: 'nút Delete branch · máy mình:\nfetch --prune rồi branch -D', c: 'red', dash: true },
  ], edges: [
    { from: 'i', to: 'b', t: 'switch -c', c: 'amb' }, { from: 'b', to: 'p', t: 'push -u', c: 'grn' },
    { from: 'p', to: 'ci', fs: 'b', ts: 't', c: 'tea' }, { from: 'p', to: 'rv', fs: 'b', ts: 't', c: 'vio' },
    { from: 'ci', to: 'm', fs: 'b', ts: 't', c: 'tea' }, { from: 'rv', to: 'm', fs: 'b', ts: 't', c: 'vio' },
    { from: 'm', to: 'x1', fs: 'b', ts: 't', c: 'amb', dash: true }, { from: 'm', to: 'x2', fs: 'b', ts: 't', c: 'grn', dash: true }, { from: 'm', to: 'x3', fs: 'b', ts: 't', c: 'red', dash: true },
  ] }) },

  /* 10 */
  { t: 'Sprint 1 trên đồ thị: bốn người, bốn làn, một main', body: `
    ${graph({ w: 1160, h: 470, y0: 72, dy: 86, dx: 128, lanes: [
      { lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'Trang', c: 'vio' }, { lane: 2, n: 'Cường', c: 'amb' }, { lane: 3, n: 'Linh', c: 'blu' }, { lane: 4, n: 'Huy', c: 'grn' },
    ], commits: [
      { id: 'b10d', x: 0, t: 'Ngày 0' },
      { id: '119d', x: 0.9, lane: 4, p: ['b10d'] }, { id: '8180', x: 1.9, lane: 4, p: ['119d'] },
      { id: 'e6b5', x: 1.5, lane: 3, p: ['b10d'] }, { id: 'da49', x: 4.6, lane: 3, p: ['e6b5'], t: 'sửa theo review' },
      { id: 'ada4', x: 2.1, lane: 2, p: ['b10d'] },
      { id: 'def0', x: 2.7, lane: 1, p: ['b10d'] },
      { id: '0d83', x: 3.4, p: ['b10d'], t: '#5', hl: true }, { id: '6aa8', x: 4.2, p: ['0d83'], t: '#8', hl: true },
      { id: '23ba', x: 5.1, p: ['6aa8'], t: '#6', hl: true },
      { id: 'fbd3', x: 6, lane: 2, p: ['ada4', '23ba'], star: true, t: 'merge main vào' },
      { id: '170a', x: 6.9, p: ['23ba'], t: '#7', hl: true },
    ], refs: [{ to: '170a', n: 'main' }] })}
    ${cap('Commit có quầng sáng = commit GitHub tạo khi <b>Squash and merge</b>: chỉ MỘT cha (commit main trước đó). Commit trên nhánh của từng người không bao giờ trở thành tổ tiên của main — vì thế <code>git branch -d</code> sau này báo “not fully merged”.')}` },

  /* 11 */
  { t: 'Xung đột thật: hai người cùng thêm dòng cuối config.js', body: two(
    `${T(['$ git fetch origin', '   b10dacc..23ba455  main       -> origin/main', '$ git merge origin/main', 'Auto-merging src/config.js', '! CONFLICT (content): Merge conflict in src/config.js', 'Automatic merge failed; fix conflicts and then commit the result.', '$ git status --short', '! UU src/config.js'], 'output thật — máy Cường, 04/09', '~/phong-kham', 'feat/3-api-dat-lich')}
    ${conflict({ before: ["export const SLOT_PHUT = 30;"], ours: ['export const SO_LICH_TOI_DA = 3;'], theirs: ["export const NGHI_TRUA = ['12:00', '13:00'];"], oursName: 'HEAD', theirsName: 'origin/main', fs: 16 })}`,
    `${steps([
      ['Giữ <b>cả hai</b> dòng — hai ý khác nhau, không phải chọn một', 'xoá ba dòng đánh dấu'],
      ['<code>git add src/config.js</code> rồi <code>npm test</code>', '6/6 xanh — trước khi commit'],
      ['<code>git commit --no-edit</code> → <code>fbd3aaf</code>', 'merge commit trên nhánh của mình'],
      ['<code>git push</code> — PR #7 hết báo conflict'],
    ])}
    ${box('tip', 'Nhánh đã push + có PR ⇒ cập nhật bằng <b>merge</b> main vào (không cần force-push). Rebase cũng được, nhưng sau đó phải <code>--force-with-lease</code>.')}`, 'l') },

  /* 12 */
  { t: 'Projects: bảng Kanban chạy theo issue và PR (vẽ lại)', body: `${board()}
    ${two(list([
      'Mỗi issue là một thẻ; kéo thẻ = đổi trường <b>Status</b>',
      'Hai workflow bật sẵn khi tạo project: issue/PR <b>closed</b> → Done · PR <b>merged</b> → Done',
      'Thêm tuỳ chọn: “Item added to project” → Todo',
    ]), box('tip', 'Ảnh chụp đúng lúc 03/09 15:00: #5 và #8 vừa merge nên #1, #4 tự sang <b>Done</b>. Không ai phải kéo tay.'))}
    ${cap('Tên workflow theo “Using the built-in automations”, docs.github.com, 09/2026.')}` },

  /* 13 */
  { t: 'Nộp bài v1.0.0 → lỗi → hotfix v1.0.1 từ TAG → cherry-pick về main', body: `
    ${graph({ w: 1160, h: 262, y0: 66, dy: 100, dx: 175, x0: 190, lanes: [{ lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'hotfix/1.0.1', c: 'red' }], commits: [
      { id: 'c6be', x: 0, t: '#12' }, { id: 'f76a', x: 1, p: ['c6be'], t: '18/09 #13' },
      { id: 'a412', x: 2, p: ['f76a'], t: '#14 huỷ lịch' },
      { id: '0cec', x: 2, lane: 1, p: ['f76a'], t: 'fix Chủ nhật', hl: true }, { id: 'd131', x: 3.2, lane: 1, p: ['0cec'], t: 'chore 1.0.1' },
      { id: '364e', x: 4.4, p: ['a412'], t: '#16 = cherry-pick -x 0cec', hl: true },
    ], refs: [{ to: 'f76a', n: 'v1.0.0', k: 'tag' }, { to: '364e', n: 'main' }, { to: 'd131', n: 'v1.0.1', k: 'tag', side: 'down' }] })}
    ${two(
      T(['$ git switch -c hotfix/1.0.1 v1.0.0', '$ git tag -a v1.0.1 -m "Sửa lỗi: không nhận lịch Chủ nhật"', '$ git push origin v1.0.1', ' * [new tag]         v1.0.1 -> v1.0.1'], 'output thật — 21/09', '~', 'hotfix/1.0.1'),
      T(['$ git cherry-pick -x 0cec9a9', '[fix/15-chu-nhat f7e4a44] fix(dat-lich): chặn đặt lịch vào Chủ nhật', '$ git log -1 --format=%B | tail -2', '+ (cherry picked from commit 0cec9a9adc84b189d7d18217a18ceba66f943f0f)'], 'output thật (cắt dòng)', '~', 'fix/15-chu-nhat'))}` },

  /* 14 */
  { t: 'Tám sự cố kinh điển của nhóm sinh viên', body: table(['#', 'Sự cố', 'Chẩn đoán', 'Cứu', 'Xem lại'], [
    ['1', 'Bạn <b>force-push</b> đè commit của mình', '<code>git fetch</code> → “(forced update)”; <code>git reflog show origin/…</code>', 'commit còn ở máy mình ⇒ <code>git rebase origin/…</code> rồi push', '8.2 · 13.1'],
    ['2', 'Commit <b>.env</b> / khoá API', '<code>git log --all -- .env</code>', '!chưa push: <code>rm --cached</code> + amend · đã push: <b>đổi khoá trước</b>, rồi filter-repo', '8.3 · 11.3'],
    ['3', '<b>Merge sai hướng</b> vào main', '<code>git status -sb</code> → <code>[ahead 3]</code>', 'chưa push: <code>reset --hard origin/main</code> · đã push: <code>revert -m 1</code>', '4.2 · 4.3'],
    ['4', 'File <b>200 MB</b>, GitHub từ chối push', '<code>rev-list --objects | cat-file --batch-check</code>', '<code>reset --soft origin/main</code> → <code>rm --cached</code> → commit lại', '10.3'],
    ['5', 'Commit bằng <b>tài khoản/email</b> người khác', '<code>git log --format="%an &lt;%ae&gt;"</code> · <code>--show-origin</code>', '<code>rebase -r --exec "commit --amend --reset-author"</code>', '0.3 · 14.3'],
    ['6', '<b>Xoá nhầm nhánh</b>', '“Deleted branch … (was 93e108e)” · <code>reflog</code>', '<code>git branch X 93e108e</code> · trên GitHub: <b>Restore branch</b>', '4.4 · 13.1'],
    ['7', '“Tôi làm trên <b>main</b> suốt 2 tuần”', '<code>## main...origin/main [ahead 5, behind 3]</code>', '<code>switch -c</code> → <code>branch -f main origin/main</code> → rebase → PR', '3.4 · 7.1'],
    ['8', 'Xung đột <b>package-lock.json</b>', '<code>git diff --name-only --diff-filter=U</code>', 'package.json sửa tay · lock: <code>checkout --theirs</code> + <code>npm install</code>', '3.3'],
  ], { sm: true }) },

  /* 15 */
  { t: 'Hai sự cố xem tận mắt: --force-with-lease · lockfile', body: two(
    `${T(['$ git push --force', ' + 4e80a5a...ccb695a feat/lich-chung -> feat/lich-chung (forced update)', '# commit 4e80a5a của Linh biến khỏi remote', '# ... làm lại, lần này có lease:', '$ git push --force-with-lease', '!  ! [rejected]        feat/lich-chung -> feat/lich-chung (stale info)'], 'output thật — máy Huy', '~/phong-kham', 'feat/lich-chung')}
    ${box('good', '“stale info” = remote đã có commit mà bạn CHƯA thấy. Lease dừng đúng lúc.')}`,
    `${T(['# cách 1: cứ npm install trên file đang xung đột', '$ npm ls --package-lock-only', '! +-- dayjs@1.11.23', '`-- zod@3.25.76', '# cách 2: lấy lock của main rồi mới npm install', '$ git checkout --theirs package-lock.json && npm install --package-lock-only', '$ npm ls --package-lock-only', '= +-- dayjs@1.11.13', '`-- zod@3.25.76'], 'output thật — npm 10.9.4, máy Huy', '~/phong-kham', 'feat/kiem-du-lieu')}
    ${box('warn', 'Cách 1 gỡ được dấu xung đột nhưng <b>giải lại</b> cả thư viện main đã khoá. Cách 2 giữ bản của main, chỉ giải lại phần của mình.')}`) },

  /* 16 */
  { t: 'Bảng tra nhanh Chương 16', body: table(['Muốn…', 'Gõ / bấm'], [
    ['Bắt đầu một việc', '<code>git switch main &amp;&amp; git pull &amp;&amp; git switch -c feat/12-ten-ngan</code>'],
    ['Đẩy nhánh lần đầu + mở PR', '<code>git push -u origin feat/12-…</code> → PR có <code>Closes #12</code>'],
    ['Cập nhật nhánh đã có PR', '<code>git fetch</code> → <code>git merge origin/main</code> → giải → <code>npm test</code> → push'],
    ['Dọn nhánh sau squash merge', '<code>git fetch --prune</code> → <code>git branch -vv</code> (<code>: gone</code>) → <code>git branch -D …</code>'],
    ['Chốt bản nộp', '<code>git tag -a v1.0.0 -m "…"</code> → <code>git push origin v1.0.0</code>'],
    ['Hotfix bản đã nộp', '<code>git switch -c hotfix/1.0.1 v1.0.0</code> → sửa → tag <code>v1.0.1</code>'],
    ['Đưa bản sửa về main', '<code>git cherry-pick -x &lt;mã&gt;</code> trên nhánh mới từ main → PR'],
    ['Đè nhánh của chính mình', '<code>git push --force-with-lease</code> — không bao giờ <code>--force</code>'],
    ['Xung đột package-lock.json', 'sửa package.json · <code>git checkout --theirs package-lock.json</code> · <code>npm install</code>'],
  ], { sm: true }) },

  /* 17 */
  { t: 'Sau khoá này: học gì tiếp', body: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
    ${lo('🔁', 'Vận hành CI/CD', 'Actions nâng cao: ma trận, cache, deploy có môi trường + duyệt tay; Docker trong CI.', G.tea)}
    ${lo('🧪', 'Kiểm thử thật', 'Unit + integration test đủ để “CI xanh” có nghĩa; coverage làm status check.', G.grn)}
    ${lo('🛡', 'An toàn chuỗi cung ứng', 'Dependabot, secret scanning, ký commit và tag, SBOM.', G.red)}
    ${lo('🌍', 'Mã nguồn mở', 'Mỗi tháng một PR nhỏ vào dự án bạn đang dùng — CV sống nhất.', G.blu)}
    ${lo('🧠', 'Pro Git, bản đầy đủ', 'Chương 7 (Git Tools) và 10 (Internals) của git-scm.com/book.', G.vio)}
    ${lo('🤖', 'Làm cùng agent AI', 'Worktree riêng cho agent, đọc diff trước khi merge — như 13.2.', G.amb)}
  </div>
  ${box('good', 'Thước đo đã học xong: bạn dựng được repo nhóm Ngày 0, chạy trọn một sprint bằng PR, và cứu được 8 sự cố ở slide 14 mà không cần tra.')}` },

  /* 18 */
  { t: 'Thực hành chương 16 (60–90 phút)', body: `
    ${steps([
      ['Dựng lại mô phỏng 16.2: một kho bare + 4 bản clone, mỗi bản một <code>user.name</code>', 'merge đúng thứ tự #5 → #8 → #6 → #7 để gặp lại xung đột'],
      ['Dựng repo thật trên GitHub (public, Org Free): 3 file khuôn + <code>ci.yml</code> + ruleset 5 luật', 'thử push thẳng main — phải bị từ chối'],
      ['Mỗi người 1 issue → 1 nhánh → 1 PR; cố ý để 2 PR cùng sửa một dòng', 'giải xung đột bằng merge main vào nhánh'],
      ['Tag <code>v1.0.0</code>, sau đó hotfix <code>v1.0.1</code> từ tag + cherry-pick về main', '<code>git describe --tags main</code> in <code>v1.0.0-…</code>'],
      ['Tái hiện 3 sự cố bất kỳ trong 8 ở kho thử và cứu', 'không mở bài 16.4 trong lúc cứu'],
    ])}
    ${box('good', '<b>Đạt khi:</b> sau Ngày 0, main chỉ gồm commit squash có số PR, issue tự đóng, hai tag có release notes, và ruleset đã từng chặn ít nhất một lần push.')}` },
]);
