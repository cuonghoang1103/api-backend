/** Git & GitHub · Deck git-07 — Chương 7: Quy trình nhóm, tag & phát hành.
 *  Mọi output terminal / mã băm dưới đây là output THẬT của git 2.51.1 (và npm 10) chạy trong kho thử
 *  scratchpad/ch07-lab (script build.sh, ngày commit cố định tháng 08/2026 nên chạy lại ra đúng mã băm này).
 *  Đồ thị ba chiến lược nhánh (slide 3–5) là sơ đồ khái niệm — không có mã băm.
 */
import { S, cover, cards, box, steps, table, kpis, two, list, code, mindmap, graph, term, G } from './_git-chung.mjs';

export const deck = { key: 'git-07', code: 'GIT · CHƯƠNG 7', title: 'Quy trình nhóm, tag & phát hành', sub: 'Git & GitHub · Chương 7' };

/** Mũi tên đứt nét tự vẽ thêm lên một graph() (vd cherry-pick: không phải quan hệ cha–con). */
const overlay = (svg, extra) => svg.replace(/<\/svg>$/, extra + '</svg>');
const arrow = (x1, y1, x2, y2, c, label, lx, ly) =>
  `<defs><marker id="cpk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker></defs>` +
  `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 40} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="${c}" stroke-width="3" stroke-dasharray="8 6" fill="none" marker-end="url(#cpk)"/>` +
  (label ? `<rect x="${lx - label.length * 4.6 - 10}" y="${ly - 19}" width="${label.length * 9.2 + 20}" height="27" rx="7" fill="#0d1117" stroke="${c}" stroke-width="1.5"/>` +
    `<text x="${lx}" y="${ly}" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="15" font-weight="700" fill="${c}">${label}</text>` : '');

const grid3 = (a, b, c) => `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;align-items:start">${a}${b}${c}</div>`;

export const slides = S([
  cover({ t: 'Chương 7 — Quy trình nhóm, tag &amp; phát hành', sub: 'GitHub flow · trunk-based · git-flow · tag &amp; semver · changelog · hotfix &amp; cherry-pick', chap: 'CHƯƠNG 7' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Quy trình nhóm', 'chọn theo cách PHÁT HÀNH', [
    { t: '7.1 Chiến lược nhánh', d: 'GitHub flow · trunk-based · git-flow · đặt tên nhánh', c: 'blu' },
    { t: '7.2 Tag &amp; semver', d: 'tag nhẹ vs annotated · MAJOR.MINOR.PATCH · describe', c: 'vio' },
    { t: '7.3 Phát hành', d: 'changelog từ lịch sử · cắt bản · GitHub Releases', c: 'grn' },
    { t: '7.3 Hotfix', d: 'rẽ từ TAG đang chạy · v1.5.1 · cherry-pick -x ngược về main', c: 'red' },
  ]) },

  /* 3 */
  { t: 'GitHub flow — một nhánh sống lâu: main', body: `
    ${graph({ w: 1160, h: 330, y0: 70, dy: 105, dx: 150, lanes: [{ lane: 0, n: 'feature/', c: 'blu' }, { lane: 1, n: 'main', c: 'git' }, { lane: 2, n: 'fix/', c: 'grn' }], commits: [
      { id: 'A', x: 0, lane: 1 },
      { id: 'a1', x: 1, lane: 0, p: ['A'], c: 'blu' }, { id: 'a2', x: 2, lane: 0, p: ['a1'], c: 'blu', t: 'PR + review + CI' },
      { id: 'M1', x: 3, lane: 1, p: ['A', 'a2'], star: true, t: '🚀 deploy' },
      { id: 'b1', x: 4, lane: 2, p: ['M1'], c: 'grn', t: 'fix/login-500' },
      { id: 'M2', x: 5, lane: 1, p: ['M1', 'b1'], star: true, t: '🚀 deploy', hl: true },
    ], refs: [{ to: 'M2', n: 'main' }] })}
    ${two(
      list(['Rẽ nhánh từ <b>main</b> → mở <b>PR</b> → review + CI → merge → deploy', '<b>main lúc nào cũng deploy được</b> — nhờ CI + bảo vệ nhánh, không nhờ khẩu hiệu']),
      box('info', '<b>Hợp:</b> web app chỉ có ĐÚNG một bản đang chạy — cuongthai.com, đồ án SWP391. <b>Không hợp:</b> phải vá bản 2.3 trong khi 3.0 đang làm.'), 'l')}` },

  /* 4 */
  { t: 'Trunk-based — nhánh sống vài GIỜ, việc dở nằm sau cờ', body: `
    ${graph({ w: 1160, h: 215, y0: 60, dy: 100, dx: 125, lanes: [{ lane: 0, n: 'nhánh ngắn', c: 'tea' }, { lane: 1, n: 'main', c: 'git' }], commits: [
      { id: '1', x: 0, lane: 1 },
      { id: 'a', x: 1, lane: 0, p: ['1'], c: 'tea', t: '3 giờ' }, { id: '2', x: 2, lane: 1, p: ['1', 'a'], star: true },
      { id: 'b', x: 3, lane: 0, p: ['2'], c: 'tea', t: '2 giờ' }, { id: '3', x: 4, lane: 1, p: ['2', 'b'], star: true },
      { id: '4', x: 5, lane: 1, p: ['3'] },
      { id: 'c', x: 6, lane: 0, p: ['4'], c: 'tea', t: '5 giờ' }, { id: '5', x: 7, lane: 1, p: ['4', 'c'], star: true, hl: true },
    ] })}
    ${two(
      code(`// Tính năng CHƯA XONG đã nằm trên main — đang TẮT
if (flags.newCheckout) {
  return renderNewCheckout();
}
return renderLegacyCheckout();`, 'javascript'),
      box('tip', 'Nỗi đau merge tăng <b>nhanh hơn</b> tuổi nhánh. Tích hợp mỗi ngày ⇒ gần như không xung đột. Cờ tính năng (feature flag) biến bài toán NHÁNH thành một công tắc lúc chạy — tắt được ngay trên production.'), 'l')}` },

  /* 5 */
  { t: 'git-flow — hai nhánh sống lâu + release/* + hotfix/*', body: overlay(graph({ w: 1160, h: 480, y0: 88, dy: 88, dx: 98, r: 19, lanes: [
    { lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'hotfix/*', c: 'red' }, { lane: 2, n: 'release/*', c: 'amb' }, { lane: 3, n: 'develop', c: 'blu' }, { lane: 4, n: 'feature/*', c: 'grn' }], commits: [
    { id: 'A', x: 0, lane: 0 },
    { id: 'B', x: 1, lane: 3, p: ['A'], c: 'blu' },
    { id: 'C', x: 2, lane: 4, p: ['B'], c: 'grn' }, { id: 'D', x: 3, lane: 4, p: ['C'], c: 'grn' },
    { id: 'E', x: 4, lane: 3, p: ['B', 'D'], star: true, c: 'blu' },
    { id: 'F', x: 5, lane: 2, p: ['E'], c: 'amb' }, { id: 'G', x: 6, lane: 2, p: ['F'], c: 'amb' },
    { id: 'H', x: 7, lane: 0, p: ['A', 'G'], star: true },
    { id: 'I', x: 7, lane: 3, p: ['E', 'G'], star: true, c: 'blu' },
    { id: 'J', x: 8, lane: 1, p: ['H'], c: 'red' },
    { id: 'K', x: 9, lane: 0, p: ['H', 'J'], star: true, hl: true },
    { id: 'L', x: 9, lane: 3, p: ['I', 'J'], star: true, c: 'blu', hl: true },
  ], refs: [{ to: 'A', n: 'v1.0.0', k: 'tag' }, { to: 'H', n: 'v1.1.0', k: 'tag' }, { to: 'K', n: 'v1.1.1', k: 'tag' }] }),
  `<text x="1090" y="${88 + 3 * 88 + 50}" text-anchor="end" font-size="15" font-weight="700" fill="${G.red}">⚠ J→L: merge hotfix về develop — quên là lỗi quay lại</text>`) },

  /* 6 */
  { t: 'Chọn chiến lược: hỏi cách bạn PHÁT HÀNH', body: two(
    steps([
      ['Có hơn một phiên bản đang chạy?', 'Có → cần nhánh phát hành (git-flow / biến thể). Không → đi tiếp'],
      ['Ngày nào cũng deploy được?', 'Được → GitHub flow. Bị chặn bởi duyệt App Store / cửa sổ phát hành → giữ release/*'],
      ['Có test chắc + cờ tính năng?', 'Có → trunk-based. Chưa → GitHub flow, và xây bộ test'],
    ]),
    table(['', 'Nhánh sống lâu', 'Tuổi nhánh việc'], [
      ['<b>GitHub flow</b>', 'main', 'vài ngày'],
      ['<b>Trunk-based</b>', 'main', '+vài giờ'],
      ['<b>git-flow</b>', '!main + develop', 'vài ngày → tuần'],
    ], { sm: true }) + box('good', 'Nhóm 5 bạn làm SWP391, deploy một bản web ⇒ <b>GitHub flow</b> + bảo vệ main là đủ.'), 'l') },

  /* 7 */
  { t: 'Đặt tên nhánh — tiền tố cho người và cho máy', body: two(
    code(`feature/user-profile     # chức năng mới
fix/login-500            # sửa lỗi, tên theo triệu chứng
hotfix/payment-timeout   # vá production khẩn
chore/bump-prisma        # bảo trì
release/1.5.0            # đang ổn định một bản
an/spike-webgl           # nháp cá nhân`, 'bash'),
    `${term([
      "$ git branch --list 'fix/*'",
      '  fix/feed-500',
      '  fix/login-500',
      "$ git branch --list 'hotfix/*' 'fix/*'",
      '  fix/feed-500',
      '  fix/login-500',
      '  hotfix/payment-timeout',
    ], { title: 'output thật', dir: '~/du-an', branch: '' })}
    ${box('info', 'Nhất quán quan trọng hơn chính quy ước: lọc được bằng <code>--list</code>, GitHub gom nhóm, CI áp luật theo tiền tố.')}`, 'l') },

  /* 8 */
  { t: 'Tag = con trỏ KHÔNG dịch chuyển — nhẹ vs annotated', body: `
    ${graph({ w: 1160, h: 150, y0: 92, dx: 170, x0: 170, lanes: [{ lane: 0, n: 'main', c: 'git' }], commits: [
      { id: '66699ab', x: 0 }, { id: 'dc4d3d4', x: 1.3, p: ['66699ab'], hl: true }, { id: '497fd8d', x: 2.6, p: ['dc4d3d4'] }, { id: '705090e', x: 3.9, p: ['497fd8d'] },
    ], r: 40, refs: [{ to: '66699ab', n: 'v1.4.0', k: 'tag' }, { to: 'dc4d3d4', n: 'v1.5.0', k: 'tag' }, { to: '705090e', n: 'main → đi tiếp mỗi commit' }] })}
    ${two(
      term(['# tag NHẸ: chỉ là file chứa mã băm', '$ git tag moc-thu', '$ git cat-file -t moc-thu', 'commit', '$ cat .git/refs/tags/moc-thu', 'dc4d3d4850c51c29c7b41a3351144762e3323442'], { title: 'output thật', dir: '~/du-an', branch: '' }),
      term(['# tag ANNOTATED: một đối tượng thật', '$ git tag -a v1.5.0 -m "Release 1.5.0 — …"', '$ git cat-file -t v1.5.0', '+ tag', '$ git cat-file -p v1.5.0', 'object dc4d3d4850c51c29c7b41a3351144762e3323442', 'type commit', 'tag v1.5.0', 'tagger Nguyen Van An <an@example.com> 1786429800 +0700'], { title: 'output thật', dir: '~/du-an', branch: '' }))}` },

  /* 9 */
  { t: 'Semver: MAJOR.MINOR.PATCH — con số là một lời hứa', body: `
    ${kpis([
      { v: '2', l: 'MAJOR — phá tương thích: người dùng phải sửa mã', c: 'red' },
      { v: '.4', l: 'MINOR — thêm chức năng, vẫn tương thích', c: 'amb' },
      { v: '.1', l: 'PATCH — sửa lỗi, vẫn tương thích', c: 'grn' },
    ])}
    <div style="height:14px"></div>
    ${table(['Thay đổi (commit)', 'Từ 2.4.1 thành', 'Vì sao'], [
      ['<code>fix(auth): …</code>', '+2.4.2', 'chỉ sửa lỗi ⇒ PATCH +1'],
      ['<code>feat(api): thêm endpoint mới</code>', '!2.5.0', 'chức năng mới ⇒ MINOR +1, PATCH về 0'],
      ['<code>feat!:</code> / <code>BREAKING CHANGE:</code> đổi dạng JSON trả về', '<b style="color:#ff5c6c">3.0.0</b>', 'phá tương thích ⇒ MAJOR +1, hai số sau về 0'],
      ['Bản thử trước khi chốt', '<code>3.0.0-rc.1</code>', 'tiền phát hành: xếp TRƯỚC 3.0.0'],
      ['Ghi thêm thông tin bản dựng', '<code>2.5.0+a7c2f91</code>', 'phần sau “+” bị bỏ qua khi so sánh'],
    ], { sm: true })}
    ${box('warn', '<b>0.x = không hứa gì</b> — dưới 1.0.0 có thể phá bất cứ lúc nào. Công bố 1.0.0 là bắt đầu giữ lời hứa.')}` },

  /* 10 */
  { t: 'Sắp tag như người đọc số — và bẫy bản -rc', body: `
    ${grid3(
      term(['$ git tag', '! v1.10.0', 'v1.8.4', 'v1.9.0', 'v1.9.1', 'v1.9.2', 'v2.0.0', 'v2.0.0-beta.1', 'v2.0.0-rc.1', '# bảng chữ cái: "1" < "8"'], { title: '1 · mặc định', dir: '~', branch: '' }),
      term(['$ git tag --sort=-version:refname', '! v2.0.0-rc.1', '! v2.0.0-beta.1', 'v2.0.0', '= v1.10.0', 'v1.9.2', 'v1.9.1', 'v1.9.0', 'v1.8.4', '# số đúng, nhưng rc “mới hơn” 2.0.0?!'], { title: '2 · theo số phiên bản', dir: '~', branch: '' }),
      term(['$ git -c versionsort.suffix=- tag --sort=-version:refname', '= v2.0.0', 'v2.0.0-rc.1', 'v2.0.0-beta.1', 'v1.10.0', 'v1.9.2', 'v1.9.1', 'v1.9.0', 'v1.8.4', '# đúng semver'], { title: '3 · + versionsort.suffix', dir: '~', branch: '' }))}
    ${box('tip', 'Bật một lần: <code>git config --global tag.sort -version:refname</code> và <code>git config --global versionsort.suffix -</code>. Script phát hành nào tìm “tag mới nhất” mà không sắp theo số là sẽ chọn nhầm.')}` },

  /* 11 */
  { t: 'git describe — một cái tên đọc được cho MỌI commit', body: `
    <div style="font-family:SF Mono,Menlo,monospace;font-size:46px;font-weight:800;text-align:center;margin:6px 0 14px">
      <span style="color:${G.vio}">v1.5.0</span><span style="color:${G.mu}">-</span><span style="color:${G.amb}">2</span><span style="color:${G.mu}">-</span><span style="color:${G.blu}">g705090e</span><span style="color:${G.red}">-dirty</span></div>
    ${two(
      list([
        `<b style="color:${G.vio}">v1.5.0</b> — tag <b>annotated</b> gần nhất phía sau`,
        `<b style="color:${G.amb}">2</b> — số commit kể từ tag đó`,
        `<b style="color:${G.blu}">g705090e</b> — commit hiện tại (“g” = git)`,
        `<b style="color:${G.red}">-dirty</b> — dựng từ cây còn thay đổi CHƯA commit`,
      ]),
      term(['# có thêm tag NHẸ "sang-thu-2" ngay tại HEAD:', '$ git describe', '+ v1.5.0-2-g705090e', '$ git describe --tags', 'sang-thu-2', '$ git describe --dirty', 'v1.5.0-2-g705090e-dirty', '# mặc định describe LỜ tag nhẹ'], { title: 'output thật', dir: '~/du-an' }), 'r')}
    ${box('good', 'Nướng chuỗi này vào bản dựng (vd trang <code>/health</code>) là trả lời được “production đang chạy commit nào?”')}` },

  /* 12 */
  { t: 'Tag KHÔNG tự đi theo git push', body: two(
    term([
      '$ git push -q origin main',
      '$ git ls-remote --tags origin',
      '# (trống — hai tag vẫn chỉ ở máy bạn)',
      '$ git push --follow-tags origin main',
      'To ../origin.git',
      '=  * [new tag]         v1.4.0 -> v1.4.0',
      '=  * [new tag]         v1.5.0 -> v1.5.0',
      '$ git ls-remote --tags origin',
      'fa72afe…	refs/tags/v1.4.0',
      'de3b4df…	refs/tags/v1.5.0',
      '# tag nhẹ "moc-thu" KHÔNG được đẩy theo',
    ], { title: 'output thật (mã băm cắt ngắn)', dir: '~/du-an', branch: '' }),
    `${table(['Lệnh', 'Đẩy gì'], [
      ['<code>git push origin v1.5.0</code>', 'đúng một tag'],
      ['<code>git push --follow-tags</code>', '+commit + tag ANNOTATED trỏ vào chúng'],
      ['<code>git push origin --tags</code>', '-MỌI tag cục bộ, kể cả tag nháp'],
    ], { sm: true })}
    ${box('warn', 'Triệu chứng kinh điển ngày phát hành: đã tag, đã push, mà workflow <code>on: push: tags</code> không chạy — vì tag chưa rời máy.')}`, 'r') },

  /* 13 */
  { t: 'Changelog: đọc thẳng từ lịch sử giữa hai tag', body: two(
    term([
      '$ git log --oneline v1.4.0..v1.5.0',
      'dc4d3d4 fix(auth): reject expired refresh tokens on /auth/refresh',
      '813748a feat(auth): add refresh token rotation',
      '2f6476e perf(feed): batch the author lookup into one query',
      '239029f chore(deps): bump prisma to 6.2.0',
      "$ git log --pretty=format:'- %s (%h)' v1.4.0..v1.5.0 --grep='^feat'",
      '+ - feat(auth): add refresh token rotation (813748a)',
      "$ git log --pretty=format:'- %s (%h)' v1.4.0..v1.5.0 --grep='^fix'",
      '+ - fix(auth): reject expired refresh tokens on /auth/refresh (dc4d3d4)',
    ], { title: 'output thật — dữ liệu thô', dir: '~', branch: '' }),
    '<b style="font-size:19px;color:#3fb950">CHANGELOG.md — viết lại cho NGƯỜI đọc</b>' + code(`## [1.5.0] — 2026-08-11
### Added
- Xoay vòng refresh token (#428)
### Fixed
- Phiên đăng nhập không bao giờ hết hạn:
  token 40 ngày vẫn dùng được (#431)
### Security
- Nâng prisma lên 6.2.0`, 'markdown'), 'l2') },

  /* 14 */
  { t: 'Cắt một bản phát hành — 5 bước', body: two(
    steps([
      ['Chọn số', 'có <code>feat</code> → minor · chỉ <code>fix</code> → patch · có breaking → major'],
      ['Tăng version + CHANGELOG', 'trong MỘT commit'],
      ['Tag annotated', '<code>git tag -a v1.6.0 -m "…"</code> — hoặc để <code>npm version</code> làm'],
      ['Đẩy commit LẪN tag', '<code>git push --follow-tags</code> ⇒ kích hoạt workflow phát hành'],
      ['Kiểm thứ đã lên', 'bản dựng báo đúng <code>git describe</code>; <code>gh release create v1.6.0 --generate-notes</code>'],
    ]),
    `${term([
      "$ npm version minor -m 'chore: release %s'",
      '+ v1.6.0',
      '$ git log --oneline --decorate -2',
      'ad7a9f0 (HEAD -> main, tag: v1.6.0) chore: release 1.6.0',
      'aabcfe6 init',
      '$ git cat-file -t v1.6.0',
      '= tag',
    ], { title: 'output thật — package.json 1.5.1', dir: '~/npm-thu' })}
    ${box('info', 'Một lệnh: sửa <code>package.json</code>, commit, tạo tag <b>annotated</b>. Không còn cảnh package.json ghi 1.6.0 mà tag ghi v1.5.1.')}`, 'r') },

  /* 15 */
  { t: 'Hotfix: rẽ từ TAG đang chạy, không từ main', body: (() => {
    const X = 150, dx = 165, y0 = 95, dy = 125;
    const px = (x) => X + x * dx;
    const g = graph({ w: 1160, h: 282, y0, dy, dx, lanes: [{ lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'hotfix/', c: 'red' }], commits: [
      { id: 'B', x: 0, t: '813748a' },
      { id: 'C', x: 1, p: ['B'], t: 'dc4d3d4', hl: true },
      { id: 'P1', x: 2, p: ['C'], c: 'amb', t: '497fd8d' },
      { id: 'P2', x: 3, p: ['P1'], c: 'amb', t: '705090e' },
      { id: 'H', x: 2.5, lane: 1, p: ['C'], c: 'red', t: 'a3cd15c', hl: true },
      { id: "H'", x: 4.6, p: ['P2'], c: 'grn', t: '13e7314', hl: true },
    ], refs: [{ to: 'C', n: 'v1.5.0 · đang chạy', k: 'tag' }, { to: 'H', n: 'v1.5.1', k: 'tag' }, { to: "H'", n: 'main' }] });
    return overlay(g, arrow(px(2.5) + 26, y0 + dy - 6, px(4.6) - 27, y0 + 8, G.grn, 'cherry-pick -x', px(4.6) + 40, y0 + dy - 8) +
      `<text x="500" y="${y0 - 42}" text-anchor="start" font-size="15" font-weight="700" fill="${G.amb}">vàng = đã merge nhưng CHƯA phát hành</text>`) +
      two(
        term(['$ git switch -c hotfix/payment-timeout v1.5.0', "Switched to a new branch 'hotfix/payment-timeout'", '# sửa src/payment.ts: 5000 → 30000, rồi commit:', '[hotfix/payment-timeout a3cd15c] fix(payment): raise …', '$ git tag -a v1.5.1 -m "Hotfix: gateway timeout"'], { title: 'output thật', dir: '~/du-an', branch: '' }),
        box('bad', 'Rẽ từ <b>main</b> lúc sự cố = đẩy luôn 2 commit <b>chưa phát hành</b> lên production. Và nếu KHÔNG mang bản vá về main, bản 1.6.0 sẽ mất nó.'), 'l');
  })() },

  /* 16 */
  { t: 'Mang bản vá ngược về main: cherry-pick -x', body: two(
    term([
      '$ git switch main',
      '$ git cherry-pick -x hotfix/payment-timeout',
      '[main 13e7314] fix(payment): raise the gateway timeout to 30s',
      ' Date: Wed Aug 12 11:00:00 2026 +0700',
      ' 1 file changed, 1 insertion(+), 1 deletion(-)',
      '$ git log -1 --format=%B',
      'fix(payment): raise the gateway timeout to 30s',
      '',
      '+ (cherry picked from commit a3cd15cbb14050b6dd408260f95c17bfdc5d5689)',
    ], { title: 'output thật', dir: '~/du-an', branch: '' }),
    `${term([
      '$ git log --oneline --graph --all',
      '* 13e7314 (HEAD -> main) fix(payment): raise …',
      '* 705090e feat(profile): cover photo',
      '* 497fd8d feat(profile): avatar upload',
      '| * a3cd15c (tag: v1.5.1, hotfix/payment-timeout) fix(payment): …',
      '|/',
      '* dc4d3d4 (tag: v1.5.0, origin/main) fix(auth): …',
    ], { title: 'output thật (cắt bớt dòng và chữ)', dir: '~/du-an', branch: '' })}
    ${box('tip', '<b>Cùng thay đổi, mã băm MỚI</b> (a3cd15c → 13e7314). Cờ <code>-x</code> để lại dấu vết “đến từ đâu”. Cách kia: <code>git merge hotfix/payment-timeout</code> — git-flow dùng merge.')}`) },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 7', body: table(['Muốn…', 'Gõ'], [
    ['Liệt kê nhánh theo tiền tố', "<code>git branch --list 'fix/*'</code>"],
    ['Tag phát hành (annotated) / tag cho commit cũ', '<code>git tag -a v1.5.0 -m "…"</code> · <code>git tag -a v1.4.1 -m "…" 66699ab</code>'],
    ['Xem tag là gì / trỏ đi đâu', '<code>git cat-file -t v1.5.0</code> · <code>git show v1.5.0</code>'],
    ['Sắp tag theo số, rc trước bản chính', '<code>git config --global tag.sort -version:refname</code> · <code>versionsort.suffix -</code>'],
    ['Đẩy commit + tag annotated', '<code>git push --follow-tags</code> · một tag: <code>git push origin v1.5.0</code>'],
    ['Tên đọc được cho bản dựng', '<code>git describe --tags --always --dirty</code>'],
    ['Changelog thô giữa hai bản', '<code>git log --oneline v1.4.0..v1.5.0</code>'],
    ['Tăng version + commit + tag một lần', '<code>npm version patch|minor|major</code>'],
    ['Hotfix từ bản đang chạy', '<code>git switch -c hotfix/x v1.5.0</code> → tag <code>v1.5.1</code>'],
    ['Mang một commit sang nhánh khác', '<code>git cherry-pick -x &lt;mã&gt;</code>'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 7 (40 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: tạo 2 commit <code>feat:</code>/<code>fix:</code>, gắn <code>v1.0.0</code> (annotated) và <code>nhap</code> (nhẹ)', 'so <code>git cat-file -t</code> của hai tag'],
      ['Thêm 2 commit rồi đoán trước <code>git describe</code> in gì', 'chạy thử, thêm <code>--tags</code> và <code>--dirty</code>'],
      ['Tạo kho trần làm remote, <code>push</code> rồi <code>push --follow-tags</code>', '<code>git ls-remote --tags origin</code> sau mỗi lần'],
      ['Có 2 commit “chưa phát hành” trên main: hotfix từ <code>v1.0.0</code>', 'commit sửa → tag <code>v1.0.1</code>'],
      ['<code>cherry-pick -x</code> bản vá về main', 'đọc lời nhắn, tìm dòng “cherry picked from”'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>git log --oneline --graph --all</code> có nhánh hotfix tách từ <code>v1.0.0</code>, tag <code>v1.0.1</code> nằm trên hotfix, và commit mới nhất của main có dòng <code>(cherry picked from commit …)</code>.')}` },
]);
