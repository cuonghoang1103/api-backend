/**
 * Git & GitHub · Deck git-12 — Chương 12: Hook, ký commit & tự động hoá.
 * Mọi output terminal trên slide là output THẬT (git 2.51.1, OpenSSH 10.3, gitleaks 8.30.1, husky 9.1.7,
 * lint-staged 16.4.0, prettier 3.9.9, @commitlint/cli 21.2.3) trong kho thử scratchpad/ch12-lab:
 *   lab-a.sh — hook: kho thu-git + máy chủ giả thu-git-server.git (git init --bare) + bản clone của Bình.
 *              b7cfecd khởi tạo · 1b0d2b6 thư mục .githooks · bc4e5cf feat(phong) · a32d775 wip (--no-verify, bỏ đi)
 *              · 261dc96 Bình thêm package-lock
 *   lab-b.sh — ký bằng SSH (HOME TẠM ⇒ ~/.ssh và ~/.gitconfig là của kho thử, không phải máy thật):
 *              f7659bb (ký, G) · 2603516 (không ký, N) · 5eed59f (khoá của Bình, U) · tag v1.0.0
 *              rebase không ký: 6e0c5f4 d13ed49 fb6065b (N) · rebase có ký: f7659bb d6aecb7 58e7113 (G)
 *   lab-c.sh — hook pre-receive trên thu-git-server.git: da7f9a8 bị từ chối (chưa ký) → 008f549 (đã ký) vào được;
 *              1dd3224 bị từ chối (ký hiệu xung đột).
 *   web/     — dự án Node nhỏ: husky + lint-staged + commitlint (90acd3f).
 * Ngày commit cố định, khoá giữ lại giữa các lần chạy (ed25519 ký tất định) ⇒ chạy lại ra đúng mã băm.
 * Khoá AWS trong bài là chuỗi bịa theo đúng định dạng — không phải khoá thật.
 * Tính năng GitHub (Verified, vigilant mode, ruleset) kiểm trên docs.github.com — tính đến 09/2026.
 */
import { S, cover, cards, box, steps, table, flow, two, list, code, mindmap, graph, term, diagram, G } from './_git-chung.mjs';

export const deck = { key: 'git-12', code: 'GIT · CHƯƠNG 12', title: 'Hook, ký commit & tự động hoá', sub: 'Git & GitHub · Chương 12' };

const T = (lines, title = 'output thật — git 2.51', dir = '~/thu-git', branch = 'main') => term(lines, { title, dir, branch });

/* ── Dòng thời gian các hook (SVG vẽ tay) ── */
const timeline = () => {
  const W = 1168, H = 470;
  const mono = 'font-family="SF Mono,Menlo,monospace"';
  const hk = (x, y, w, t, kind, sub = '') => {
    // kind: 'chan' = thoát ≠ 0 là CHẶN · 'bao' = chỉ báo, không chặn được · 'moc' = mốc (không phải hook)
    const c = kind === 'chan' ? G.git : kind === 'bao' ? G.blu : G.mu;
    const fill = kind === 'moc' ? '#0d1117' : '#141a22';
    const dash = kind === 'moc' ? ' stroke-dasharray="6 5"' : '';
    return `<rect x="${x}" y="${y}" width="${w}" height="54" rx="10" fill="${fill}" stroke="${c}" stroke-width="2.2"${dash}/>` +
      `<text x="${x + w / 2}" y="${y + (sub ? 24 : 33)}" text-anchor="middle" ${mono} font-size="16" font-weight="700" fill="${kind === 'moc' ? G.mu : '#fff'}">${t}</text>` +
      (sub ? `<text x="${x + w / 2}" y="${y + 44}" text-anchor="middle" font-size="13" fill="${G.amb}">${sub}</text>` : '');
  };
  const ar = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2 - 6}" y2="${y}" stroke="${G.mu}" stroke-width="2" marker-end="url(#m12)"/>`;
  const row = (y, t) => `<text x="8" y="${y + 33}" ${mono} font-size="17" font-weight="700" fill="${G.amb}">${t}</text>`;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs><marker id="m12" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${G.mu}"/></marker></defs>`;
  // vùng máy chủ
  s += `<rect x="438" y="150" width="722" height="116" rx="14" fill="rgba(88,166,255,.07)" stroke="${G.blu}" stroke-dasharray="7 6"/>` +
    `<text x="1150" y="172" text-anchor="end" font-size="14" font-weight="700" fill="${G.blu}">MÁY CHỦ — --no-verify không với tới</text>`;
  // hàng 1: git commit
  s += row(30, 'git commit');
  s += hk(150, 30, 150, 'pre-commit', 'chan', '--no-verify bỏ qua') + ar(300, 322, 57);
  s += hk(322, 30, 212, 'prepare-commit-msg', 'chan', 'KHÔNG bị bỏ qua') + ar(534, 556, 57);
  s += hk(556, 30, 150, 'commit-msg', 'chan', '--no-verify bỏ qua') + ar(706, 728, 57);
  s += hk(728, 30, 190, 'commit được tạo', 'moc') + ar(918, 940, 57);
  s += hk(940, 30, 150, 'post-commit', 'bao');
  // hàng 2: git push
  s += row(186, 'git push');
  s += hk(150, 186, 150, 'pre-push', 'chan', '--no-verify bỏ qua');
  s += `<line x1="300" y1="213" x2="452" y2="213" stroke="${G.mu}" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#m12)"/>` +
    `<text x="376" y="204" text-anchor="middle" font-size="13" fill="${G.mu}">qua mạng</text>`;
  s += hk(458, 186, 150, 'pre-receive', 'chan', 'từ chối cả lần push') + ar(608, 630, 213);
  s += hk(630, 186, 110, 'update', 'chan', 'từng ref') + ar(740, 762, 213);
  s += hk(762, 186, 190, 'ref được cập nhật', 'moc') + ar(952, 974, 213);
  s += hk(974, 186, 170, 'post-receive', 'bao', 'thông báo, deploy');
  // hàng 3: pull / switch
  s += row(310, 'git pull');
  s += hk(150, 310, 150, 'post-merge', 'bao', 'vd npm install');
  s += `<text x="340" y="343" ${mono} font-size="17" font-weight="700" fill="${G.amb}">git switch</text>`;
  s += hk(468, 310, 170, 'post-checkout', 'bao', 'đổi nhánh xong');
  // chú giải
  const lg = (x, c, t, dash = '') => `<rect x="${x}" y="402" width="30" height="20" rx="5" fill="#141a22" stroke="${c}" stroke-width="2.2"${dash}/>` +
    `<text x="${x + 40}" y="417" font-size="16" fill="${G.tx}">${t}</text>`;
  s += lg(150, G.git, 'thoát ≠ 0 ⇒ CHẶN thao tác') + lg(470, G.blu, 'chạy SAU — chỉ báo, không chặn được') + lg(850, G.mu, 'mốc, không phải hook', ' stroke-dasharray="6 5"');
  return s + '</svg>';
};

export const slides = S([
  cover({ t: 'Chương 12 — Hook, ký commit &amp; tự động hoá', sub: 'pre-commit · husky + lint-staged + commitlint · pre-receive trên máy chủ · ký commit bằng khoá SSH · Verified', chap: 'CHƯƠNG 12' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Hook &amp; chữ ký', 'chặn lỗi sớm · chứng minh ai viết', [
    { t: '12.1 Hook máy mình', d: 'pre-commit · commit-msg · pre-push · post-merge', c: 'git' },
    { t: '12.1 Chia sẻ cho cả nhóm', d: 'core.hooksPath · husky + lint-staged + commitlint', c: 'amb' },
    { t: '12.3 Cưỡng chế thật', d: '--no-verify · CI kiểm lại · pre-receive · ruleset', c: 'red' },
    { t: '12.2 Tác giả là chữ tự khai', d: 'ai cũng commit được dưới tên bất kỳ ai', c: 'vio' },
    { t: '12.2 Ký bằng khoá SSH', d: 'gpg.format ssh · allowedSignersFile · %G?', c: 'grn' },
    { t: '12.2 GitHub', d: 'Signing key · Verified · vigilant mode', c: 'blu' },
  ]) },

  /* 3 */
  { t: 'Dòng thời gian: Git gọi hook nào, lúc nào', body: timeline() },

  /* 4 */
  { t: 'Hook là một FILE: đúng tên + quyền thực thi', body: two(
    T(['$ ls .git/hooks', 'applypatch-msg.sample     pre-commit.sample', 'commit-msg.sample         pre-merge-commit.sample', 'fsmonitor-watchman.sample pre-push.sample', 'post-update.sample        pre-rebase.sample', 'pre-applypatch.sample     pre-receive.sample', 'prepare-commit-msg.sample push-to-checkout.sample', 'sendemail-validate.sample update.sample', '# 14 file mẫu — đuôi .sample ⇒ Git bỏ qua hết']),
    `${T(['# hook đã có nhưng quên chmod +x:', '$ git commit -am "fix: thu hook"', "! hint: The '.githooks/pre-commit' hook was ignored because it's not set as executable.", '[main 32c4e5a] fix: thu hook', '# commit VẪN được tạo — hook không chạy'])}
    ${box('warn', 'Git chỉ in một dòng <b>hint</b> rồi cho commit đi qua. Sửa: <code>chmod +x .githooks/*</code>. Git lưu luôn bit này: <code>100755</code> trong <code>git ls-files -s</code>.')}`, 'l') },

  /* 5 */
  { t: 'pre-commit chặn ký hiệu xung đột và file lớn', body: two(
    code(`#!/bin/sh
# .githooks/pre-commit (rút gọn — bản đủ ở bài 12.1)
GIOI_HAN=5242880                  # 5 MB
loi=0
# 1. <<<<<<< ======= >>>>>>> + khoảng trắng thừa
if ! git diff --cached --check; then
  echo "✋ Còn ký hiệu xung đột..."; loi=1
fi
# 2. đo bản ĐÃ STAGING (":$f"), không đo đĩa
for f in $(git diff --cached --name-only \\
             --diff-filter=AM); do
  size=$(git cat-file -s ":$f")
  if [ "$size" -gt "$GIOI_HAN" ]; then
    echo "✋ $f nặng ... — dùng Git LFS"; loi=1
  fi
done
exit $loi`, 'bash'),
    `${T(['$ git add lich.js', '$ git commit -m "feat(lich): them gio mo cua"', '! lich.js:2: leftover conflict marker', '! lich.js:4: leftover conflict marker', '! lich.js:6: leftover conflict marker', '✋ Còn ký hiệu xung đột hoặc khoảng trắng thừa.', '# exit=1 → không có commit nào'])}
    ${T(['$ git add demo.mp4', '$ git commit -m "docs: them video demo"', '! ✋ demo.mp4 nặng 6 MB (giới hạn 5 MB) — dùng Git LFS (bài 10.3).'])}`, 'l') },

  /* 6 */
  { t: 'pre-commit bắt bí mật — gitleaks chỉ quét phần đã staging', body: two(
    T(['$ git add config.js', '$ git commit -m "feat(upload): ket noi S3"', 'Finding:     REDACTED', 'Secret:      REDACTED', '! RuleID:      aws-access-token', 'File:        config.js', 'Line:        1', '', 'Finding:     AWS_SECRET_ACCESS_KEY=REDACTED', '! RuleID:      generic-api-key', 'File:        config.js', 'Line:        2', '', '! 3:14PM WRN leaks found: 2', '# exit=1 → khoá chưa từng vào lịch sử'], 'output thật — gitleaks 8.30'),
    `${code('gitleaks git --pre-commit --staged \\\n  --redact --no-banner -v', 'bash')}
    ${list(['<code>--staged</code>: chỉ xét thứ sắp commit', '<code>--redact</code>: log không in lại chính cái khoá', 'Chặn ở đây là <b>rẻ nhất</b>: chưa có commit ⇒ không phải viết lại lịch sử (bài 8.3)'])}
    ${box('info', 'Ba lớp cho bí mật: hook máy mình → <b>push protection</b> của GitHub (bài 11.3) → quét lại trong CI (bài 12.3).')}`, 'l') },

  /* 7 */
  { t: '.git/hooks không đi theo bản clone → core.hooksPath', body: `
    ${diagram({ w: 1160, h: 196, nodes: [
      { id: 'a', x: 0, y: 20, w: 330, h: 150, ic: '💻', t: 'Máy An', d: '.githooks/ đã commit\ncore.hooksPath = .githooks\n⇒ hook CHẠY', c: 'grn' },
      { id: 's', x: 415, y: 40, w: 330, h: 110, ic: '☁️', t: 'thu-git-server.git', d: 'có file .githooks/*\nkhông có cấu hình của ai', c: 'blu' },
      { id: 'b', x: 830, y: 20, w: 330, h: 150, ic: '💻', t: 'Máy Bình (clone mới)', d: '.githooks/ có trên đĩa\ncore.hooksPath = (trống)\n⇒ hook KHÔNG chạy', c: 'red' },
    ], edges: [
      { from: 'a', to: 's', t: 'push', c: 'grn' },
      { from: 's', to: 'b', t: 'clone', c: 'blu' },
    ] })}
    ${two(
      T(['$ git config core.hooksPath .githooks', '$ git add .githooks', '$ git commit -m "chore: them git hook dung chung"', ' create mode 100755 .githooks/commit-msg', ' create mode 100755 .githooks/pre-commit', ' create mode 100755 .githooks/pre-push'], 'máy An', '~/thu-git'),
      T(['$ git config core.hooksPath', '# (trống) — cấu hình không bao giờ được clone', '# x.js có <<<<<<< — vẫn commit được:', '$ git commit -m "sua x"', '! [main e6b44e2] sua x', '# lọt qua: cần chạy git config một lần/clone'], 'máy Bình', '~/binh'), '')}` },

  /* 8 */
  { t: 'Dự án Node: husky + lint-staged + commitlint', body: two(
    `${T(['$ npm i -D husky lint-staged prettier \\', '       @commitlint/cli @commitlint/config-conventional', '$ npx husky init        # thêm "prepare": "husky"', '$ git config core.hooksPath', '+ .husky/_', '$ git add gio.js         # nhap.js thì KHÔNG add', '$ git commit -m "feat(lich): them gio mo cua"', '[COMPLETED] *.{js,ts,tsx} — 1 file', '= [main 90acd3f] feat(lich): them gio mo cua', '$ cat gio.js', '+ const gio = { mo: 8, dong: 17 };', '$ git status -s', '?? nhap.js', '# nhap.js: prettier không đụng tới'], 'output thật — husky 9 · lint-staged 16', '~/web')}`,
    `${T(['$ git commit -m "cap nhat linh tinh"', '⧗   --- input ---', 'cap nhat linh tinh', '! ✖   subject may not be empty [subject-empty]', '! ✖   type may not be empty [type-empty]', '! ✖   found 2 problems, 0 warnings', 'husky - commit-msg script failed (code 1)'], 'commitlint 21', '~/web')}
    ${list(['<code>.husky/pre-commit</code>: <code>npx lint-staged</code>', '<code>.husky/commit-msg</code>: <code>npx --no -- commitlint --edit $1</code>', '<code>prepare</code> chạy sau <code>npm install</code> ⇒ clone mới tự có hook'])}`, 'l') },

  /* 9 */
  { t: 'pre-push canh main · post-merge nhắc npm install', body: two(
    `${code(`#!/bin/sh
# .githooks/pre-push — stdin mỗi dòng:
# <ref local> <sha local> <ref remote> <sha remote>
while read lref lsha rref rsha; do
  if [ "$rref" = "refs/heads/main" ]; then
    echo "✋ Không push thẳng lên main"
    exit 1
  fi
done`, 'bash')}
    ${T(['$ git push origin main', '! ✋ Không push thẳng lên main — đẩy nhánh rồi mở pull request (bài 6.4).', "! error: failed to push some refs to '../thu-git-server.git'"])}`,
    `${code(`#!/bin/sh
# .githooks/post-merge — chạy SAU pull/merge
if git diff --name-only ORIG_HEAD HEAD \\
   | grep -qx 'package-lock.json'; then
  echo "📦 package-lock.json vừa đổi → chạy npm install"
fi`, 'bash')}
    ${T(['$ git pull', 'Updating bc4e5cf..261dc96', 'Fast-forward', ' package-lock.json | 1 +', '+ 📦 package-lock.json vừa đổi → chạy npm install'])}`, 'r') },

  /* 10 */
  { t: '--no-verify: vì sao CI vẫn phải kiểm lại', body: `
    ${flow([
      { e: '⚡', t: 'pre-commit', d: '&lt; 2 giây · file đã staging', c: 'git' },
      { e: '⏱', t: 'pre-push', d: '&lt; 60 giây · tsc, test đơn vị', c: 'amb' },
      { e: '🏭', t: 'CI + luật nhánh', d: 'vài phút · KHÔNG bỏ qua được', c: 'grn' },
    ])}
    ${two(
      T(['$ git commit --no-verify -m "wip: do dang"', '! [main a32d775] wip: do dang', ' 1 file changed, 6 insertions(+)', '# lich.js còn <<<<<<< — hook bị bỏ qua'], 'máy mình'),
      T(['# CI chạy CÙNG phép kiểm trên cả dải commit:', '$ git diff --check origin/main HEAD', '! lich.js:2: leftover conflict marker', '! lich.js:4: leftover conflict marker', '! lich.js:6: leftover conflict marker', '# exit=2 → job đỏ → luật nhánh chặn merge'], 'bước kiểm của CI'), '')}
    ${box('warn', 'Hook làm việc đúng thành <b>nhanh</b>; CI + bảo vệ nhánh làm nó thành <b>bắt buộc</b>. Thêm: clone mới chưa cấu hình thì chẳng có hook nào.')}` },

  /* 11 */
  { t: 'Trường tác giả chỉ là chữ tự khai', body: two(
    T(['$ git config user.name "Linus Torvalds"', '$ git config user.email "torvalds@linux-foundation.org"', '$ git commit --allow-empty -m "feat: chac chan do Linus viet"', '[main (root-commit) 6aad1b7] feat: chac chan do Linus viet', "$ git log -1 --format='%an <%ae>'", '! Linus Torvalds <torvalds@linux-foundation.org>'], 'output thật', '~/gia-mao'),
    `${cards([
      { ic: '✍️', t: 'Git không kiểm', d: 'author/committer lấy từ <code>user.name</code>, <code>user.email</code> — không có ai để hỏi', c: 'amb' },
      { ic: '🖼', t: 'GitHub khớp theo email', d: 'push lên là hiện luôn tên + ảnh đại diện của người có email đó', c: 'red' },
      { ic: '🔏', t: 'Chỉ CHỮ KÝ là bằng chứng', d: 'người giữ khoá riêng đã tạo ra đúng nội dung này', c: 'grn' },
    ], 1)}`, 'l') },

  /* 12 */
  { t: 'Ký bằng khoá SSH (Git 2.34+) — và xác minh ở máy mình', body: two(
    `${code(`git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true`, 'bash')}
    ${T(['$ git log --show-signature -1', '! error: gpg.ssh.allowedSignersFile needs to be configured and exist for ssh signature verification', 'commit f7659bbd06358c4bcfabb2705921e978197a6c59', 'No signature', '# ← Git KHÔNG kiểm được, chứ chưa chắc là không ký'], 'output thật — git 2.51', '~/thu-git', 'feature/refresh-token')}`,
    `${code(`echo "an@example.com $(cat ~/.ssh/id_ed25519.pub)" \\
  >> ~/.git-allowed-signers
git config --global gpg.ssh.allowedSignersFile \\
  ~/.git-allowed-signers`, 'bash')}
    ${T(['$ git log --show-signature -1', '= Good "git" signature for an@example.com with ED25519 key SHA256:aMgOvf/CwxVQbK/zhYYV8cRamMTEmXFXbM8OUyMbh6s', 'Author: Nguyen Van An <an@example.com>', '$ git verify-commit HEAD', '= Good "git" signature for an@example.com with ED25519 key SHA256:aMgOvf…', '# exit 0 — dùng được trong script'], 'sau khi có allowed signers', '~/thu-git', 'feature/refresh-token')}`, '') },

  /* 13 */
  { t: 'Đọc %G? — và ký tag phát hành', body: two(
    `${T(["$ git log --format='%h %G? %an %s' -4", '! 5eed59f U Tran Thi Binh refactor(auth): tach ham dem', '2603516 N Nguyen Van An test(auth): them ca het han', '= f7659bb G Nguyen Van An feat(auth): them xoay vong refresh token', '261dc96 N Tran Thi Binh chore(deps): them package-lock', '$ git verify-commit 5eed59f', 'Good "git" signature with ED25519 key SHA256:XqVQ1d…', '! No principal matched.'], 'output thật', '~/thu-git', 'feature/refresh-token')}
    ${T(['$ git tag -s v1.0.0 -m "Ban nop SWP391 tuan 3"', '$ git verify-tag v1.0.0', '= Good "git" signature for an@example.com with ED25519 key SHA256:aMgOvf…'], 'tag có chữ ký', '~/thu-git', 'feature/refresh-token')}`,
    table(['%G?', 'Nghĩa'], [
      ['+G', 'Chữ ký tốt, khoá có trong allowed signers — dòng “for &lt;email&gt;” cho biết khoá của AI; Git KHÔNG so với email committer'],
      ['!U', 'Chữ ký hợp lệ nhưng khoá không khớp ai trong danh sách (khoá của Bình)'],
      ['N', 'Không ký — bình thường, chỉ là không có bằng chứng'],
      ['-B', 'Chữ ký SAI — nội dung bị sửa sau khi ký (kho thử: <code>fbb6c7c B</code>, “incorrect signature”)'],
    ], { sm: true }), 'l') },

  /* 14 */
  { t: 'Trên GitHub: khoá Signing, nhãn Verified, vigilant mode', body: two(
    `${diagram({ w: 560, h: 250, nodes: [
      { id: 'k', x: 0, y: 80, w: 220, h: 90, t: '🔑 id_ed25519.pub', d: 'MỘT file khoá', c: 'amb' },
      { id: 'a', x: 300, y: 0, w: 260, h: 95, t: 'Authentication Key', d: 'push/pull qua SSH (bài 5.2)', c: 'blu' },
      { id: 's', x: 300, y: 150, w: 260, h: 95, t: 'Signing Key', d: 'để commit hiện Verified', c: 'grn' },
    ], edges: [{ from: 'k', to: 'a', c: 'blu', ts: 'l' }, { from: 'k', to: 's', c: 'grn', ts: 'l' }] })}
    ${table(['', 'SSH', 'GPG'], [['Cần cài thêm', '+không', '-gpg + agent'], ['Hạn dùng khoá', 'không bắt buộc', '!nên đặt, phải gia hạn'], ['Nhãn trên GitHub', 'Verified', 'Verified']], { sm: true })}`,
    `${table(['Commit', 'Vigilant TẮT', 'Vigilant BẬT'], [
      ['Ký + GitHub xác minh được', '+Verified', '+Verified'],
      ['Ký, không xác minh được', '-Unverified', '-Unverified'],
      ['Không ký', '(không nhãn)', '-Unverified'],
    ], { sm: true })}
    ${list(['<b>Partially verified</b>: chữ ký hợp lệ, nhưng một author khác committer đang bật vigilant', 'Chữ ký đã Verified thì <b>giữ nguyên</b> kể cả khi sau này bạn thay/thu hồi khoá'])}
    ${box('info', 'Settings → SSH and GPG keys → <b>Flag unsigned commits as unverified</b>. Docs (09/2026): chỉ bật khi bạn ký <b>mọi</b> commit và tag.')}`, 'l') },

  /* 15 */
  { t: 'Rebase tạo commit mới — chữ ký cũ không đi theo', body: `
    ${graph({ w: 1160, h: 300, x0: 330, y0: 40, dx: 300, dy: 100, lanes: [{ lane: 0, n: 'gốc', c: 'dim' }, { lane: 1, n: 'rebase (tắt ký)', c: 'red' }, { lane: 2, n: 'rebase (bật ký)', c: 'grn' }], commits: [
      { id: 'f765', x: 0, t: 'G · An' }, { id: '2603', x: 1, p: ['f765'], t: 'N · An' }, { id: '5eed', x: 2, p: ['2603'], t: 'U · khoá Bình' },
      { id: '6e0c', x: 0, lane: 1, c: 'red', t: 'N' }, { id: 'd13e', x: 1, lane: 1, p: ['6e0c'], c: 'red', t: 'N' }, { id: 'fb60', x: 2, lane: 1, p: ['d13e'], c: 'red', t: 'N' },
      { id: 'f765 ', x: 0, lane: 2, c: 'grn', t: 'G · trùng mã cũ!' }, { id: 'd6ae', x: 1, lane: 2, p: ['f765 '], c: 'grn', t: 'G' }, { id: '58e7', x: 2, lane: 2, p: ['d6ae'], c: 'grn', hl: true, t: 'G · khoá AN' },
    ] })}
    ${two(
      T(["$ git log --show-signature -1 --format='Author: %an <%ae>'", '= Good "git" signature for an@example.com with ED25519 key SHA256:aMgOvf…', '+ Author: Tran Thi Binh <binh@example.com>'], 'output thật — commit 58e7113', '~/thu-git', 'feature/refresh-token'),
      box('warn', 'Chữ ký chứng minh <b>ai tạo ra commit này</b> (người rebase), không chứng minh ai viết mã. Squash merge trên web: GitHub ký bằng khoá của GitHub.'), '')}` },

  /* 16 */
  { t: 'Máy chủ từ chối: hook pre-receive', body: two(
    `${T(['# commit KHÔNG ký, bỏ qua pre-push của máy mình:', '$ git push --no-verify origin main', '! remote: ✋ da7f9a8 feat(phong): khoa phong P101 — chưa ký, hoặc khoá không có trong allowed-signers.', "!  ! [remote rejected] main -> main (pre-receive hook declined)", '$ git commit --amend --no-edit -S', '$ git push --no-verify origin main', '=    261dc96..008f549  main -> main', '# commit đã ký nhưng còn <<<<<<<:', '$ git push --no-verify origin main', '! remote: ✋ 1dd3224 feat(lich): gio mo cua — còn ký hiệu xung đột.', "!  ! [remote rejected] main -> main (pre-receive hook declined)"], 'output thật — máy chủ giả thu-git-server.git')}
    ${box('good', '<code>--no-verify</code> chỉ tắt hook <b>máy mình</b>. Hook trên máy chủ chạy cho MỌI lần push, của MỌI người.')}`,
    `${table(['Trên máy chủ Git của bạn', 'Trên github.com'], [
      ['pre-receive kiểm chữ ký', 'Luật <b>Require signed commits</b>'],
      ['pre-receive chặn file lớn', '<b>Push ruleset</b> (kho private/internal)'],
      ['pre-receive quét bí mật', '<b>Push protection</b> (bài 11.3)'],
      ['lint, test, ký hiệu xung đột', '<b>Required status checks</b> = CI'],
    ], { sm: true })}
    ${box('info', 'github.com <b>không</b> cho cài pre-receive tự viết — chỉ GitHub Enterprise Server (máy chủ tự cài) có, và mọi hook cộng lại phải xong trong 5 giây.')}`, 'l') },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 12', body: table(['Muốn…', 'Gõ'], [
    ['Bật một hook', 'đặt đúng tên trong <code>.git/hooks/</code> + <code>chmod +x</code>'],
    ['Chia sẻ hook cho cả nhóm', 'commit <code>.githooks/</code> → <code>git config core.hooksPath .githooks</code>'],
    ['Dự án Node', '<code>npx husky init</code> · lint-staged (file đã staging) · commitlint (commit-msg)'],
    ['Kiểm ký hiệu xung đột', '<code>git diff --cached --check</code> · CI: <code>git diff --check origin/main HEAD</code>'],
    ['Quét bí mật trước commit', '<code>gitleaks git --pre-commit --staged --redact</code>'],
    ['Bỏ qua hook (có chủ ý)', '<code>git commit --no-verify</code> · <code>HUSKY=0 git commit …</code>'],
    ['Ký mọi commit bằng SSH', '<code>gpg.format ssh</code> · <code>user.signingkey ~/.ssh/id_ed25519.pub</code> · <code>commit.gpgsign true</code>'],
    ['Xác minh ở máy mình', '<code>gpg.ssh.allowedSignersFile</code> → <code>git log --show-signature</code> · <code>%G?</code>'],
    ['Ký / kiểm tag phát hành', '<code>git tag -s v1.0.0 -m "…"</code> · <code>git verify-tag v1.0.0</code>'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 12 (40 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: tạo <code>.githooks/pre-commit</code> với chốt xung đột + file &gt; 5 MB, <code>core.hooksPath</code>', 'thử commit một file có <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> — phải bị chặn'],
      ['Clone ra <code>ban-binh</code>: commit đúng file đó lần nữa', 'lọt qua ⇒ hiểu vì sao hook chỉ là tiện lợi'],
      ['Tạo khoá SSH ký riêng, bật <code>commit.gpgsign</code> + <code>allowedSignersFile</code>', '<code>%G?</code> ra <b>G</b> cho commit mới, <b>N</b> cho commit cũ'],
      ['Đặt <code>hooks/pre-receive</code> vào <code>thu-git-server.git</code>: main chỉ nhận commit đã ký', 'push commit không ký bằng <code>--no-verify</code> ⇒ <code>(pre-receive hook declined)</code>'],
      ['Trên GitHub: thêm khoá với loại <b>Signing Key</b>, push một commit ký', 'thấy nhãn <b>Verified</b>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> máy chủ giả từ chối commit không ký dù bạn đã <code>--no-verify</code>, và <code>git log --format="%h %G?"</code> in đúng G/N như bạn dự đoán.')}` },
]);
