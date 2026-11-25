/**
 * Tiếng Anh kỹ thuật khi đi làm — Chương 3: Commit message, pull request và code review (soạn 24/11/2026).
 * Slug + title chương khớp khung trong ../tieng-anh-ky-thuat-di-lam.mjs (tak-3-1 … tak-3-5).
 * Mọi lệnh git/curl + output là output THẬT, chạy 24/11/2026 (git 2.55.0, Node 22.23.5 trong node:22-alpine) trên kho tạm dựng từ
 * labflow-mini.mjs của Chương 2 (dự án LabFlow hư cấu). Hook commit-msg in nguyên văn trong bài 3.1 là hook tự viết, đã chạy thật.
 * Nguồn: git-commit(1) DISCUSSION; Git — SubmittingPatches (imperative mood); C. Beams — "How to Write a Git Commit Message" (2014);
 * Conventional Commits 1.0.0; GitHub Docs — "Linking a pull request to an issue"; Google Engineering Practices — "Small CLs",
 * "How to write code review comments"; Conventional Comments (conventionalcomments.org); FTC v. Uber (2018, sự cố 2016);
 * CVE-2024-3094 (xz-utils, A. Freund, oss-security 29/3/2024).
 */
import { mau, saiDung, tuVung, Q } from './_chung.mjs';

const lienKet = (href, ico, tieuDe, phu) => `
<a class="link-card lien-ket-cheo" href="${href}">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${tieuDe}</span><span class="lc-sub">${phu}</span></span>
</a>`;

/* ═════════════ 3.1 — Commit message ═════════════ */
const MAU_LOG_XAU = mau(`
$ git log --oneline
5554084 final
8e19f44 fix
4a747ad update
ea46d0c sửa lỗi phân trang
cff2621 wip
5399fd3 Fixed bug and add export and refactor some code.
`, 'Output THẬT của một repo dựng lại đúng kiểu lịch sử đồ án sinh viên hay gặp — đọc xong không biết đã đổi gì.');

const MAU_HOOK = mau(String.raw`
#!/bin/sh
# commit-msg — checks the commit message format (lesson 3.1).
# Install: cp commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/commit-msg
msg_file="$1"
# Ignore comment lines that Git adds to the editor template.
msg=$(grep -v '^#' "$msg_file")
subject=$(printf '%s\n' "$msg" | sed -n '1p')
line2=$(printf '%s\n' "$msg" | sed -n '2p')
fail=0

# Let Git's own helper messages through (git commit --fixup, git merge, git revert).
case "$subject" in
  "fixup! "*|"squash! "*|"amend! "*|"Merge "*|"Revert \""*) exit 0 ;;
esac

if ! printf '%s' "$subject" | grep -Eq '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?!?: .+'; then
  echo "commit-msg: subject must look like 'type(scope): description'"
  echo "            types: feat fix docs style refactor perf test build ci chore revert"
  fail=1
fi
len=$(printf '%s' "$subject" | wc -m)
if [ "$len" -gt 72 ]; then
  echo "commit-msg: subject is $len characters; keep it under 72 (50 is ideal)"
  fail=1
fi
desc=$(printf '%s' "$subject" | sed -E 's/^[a-z]+(\([a-z0-9-]+\))?!?: //')
first=$(printf '%s' "$desc" | cut -d' ' -f1 | tr 'A-Z' 'a-z')
case "$first" in
  *ed|*ing) echo "commit-msg: use the imperative mood: '$first' -> e.g. 'add', 'fix' (If applied, this commit will ...)"; fail=1 ;;
esac
case "$subject" in
  *.) echo "commit-msg: do not end the subject with a period"; fail=1 ;;
esac
if [ -n "$line2" ]; then
  echo "commit-msg: leave line 2 empty (blank line between subject and body)"
  fail=1
fi
long=$(printf '%s\n' "$msg" | sed -n '3,$p' | awk 'length > 72 && !/^(https?:|    )/ {print NR+2}')
if [ -n "$long" ]; then
  echo "commit-msg: body lines over 72 characters: $(echo $long | tr ' ' ',')"
  fail=1
fi
[ "$fail" -eq 0 ] || { echo "commit-msg: commit rejected. Message was:"; printf '  | %s\n' "$subject"; exit 1; }
exit 0
`, 'commit-msg — hook tự viết cho bài này (sh, chạy trên Linux/macOS/Git Bash). Chép vào .git/hooks/commit-msg và chmod +x.');

const MAU_HOOK_CHAY = mau(`
$ git commit --amend -m 'fix bug'
commit-msg: subject must look like 'type(scope): description'
            types: feat fix docs style refactor perf test build ci chore revert
commit-msg: commit rejected. Message was:
  | fix bug

$ git commit --amend -m 'Fixed pagination bug.'
commit-msg: subject must look like 'type(scope): description'
            types: feat fix docs style refactor perf test build ci chore revert
commit-msg: use the imperative mood: 'fixed' -> e.g. 'add', 'fix' (If applied, this commit will ...)
commit-msg: do not end the subject with a period
commit-msg: commit rejected. Message was:
  | Fixed pagination bug.

$ git commit --amend -m 'fix(loans): fixed the pagination of the loan list so that page 2 no longer shows the same items'
commit-msg: subject is 95 characters; keep it under 72 (50 is ideal)
commit-msg: use the imperative mood: 'fixed' -> e.g. 'add', 'fix' (If applied, this commit will ...)
commit-msg: commit rejected. Message was:
  | fix(loans): fixed the pagination of the loan list so that page 2 no longer shows the same items
`, 'Output THẬT: ba lần hook chặn commit (git 2.55.0, 24/11/2026).');

const MAU_COMMIT_TOT = mau(`
$ git commit --amend -F - <<'MSG'
fix(loans): return the requested page in GET /api/loans

The list always started at index 0 and ignored the page parameter,
so page 2 returned the same five loans as page 1.

Use (page - 1) * size as the start index of the slice.

Refs: LAB-231
MSG
[fix/LAB-231-pagination 7e4216c] fix(loans): return the requested page in GET /api/loans
 Date: Mon Nov 23 09:00:00 2026 +0700
 1 file changed, 1 insertion(+), 1 deletion(-)

$ git log --oneline main..HEAD
81a2ea6 docs: add a README with the run command
74c5f1a fix(loans): allow a loan period of exactly 7 days
7e4216c fix(loans): return the requested page in GET /api/loans
`, 'Output THẬT — hook im lặng nghĩa là cho qua.');

const MAU_BREAKING = mau(`
$ git commit --allow-empty -F - <<'MSG'
feat(api)!: rename the days field to periodDays

BREAKING CHANGE: POST /api/loans now expects "periodDays" instead of
"days". Clients must update their request body.

Refs: LAB-250
MSG
[fix/LAB-231-pagination ed5f2c7] feat(api)!: rename the days field to periodDays
`, 'Output THẬT — commit rỗng chỉ để minh hoạ thông điệp (--allow-empty).');

const L31 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Writing' : 'Chương 3 · Viết'}</span>
<h2>${en ? '3.1 — Commit messages: imperative mood, the 50/72 rule, Conventional Commits' : '3.1 — Commit message: thể mệnh lệnh, quy tắc 50/72, Conventional Commits'}</h2>
<p class="lead">${en
    ? 'Your commit messages are the most-read English you will ever write at work. Reviewers read them today; teammates read them in <code>git log</code> and <code>git blame</code> next year; tools turn them into release notes. One line answers "what changed", a short body answers "why". That is the whole skill — plus a few fixed grammar rules.'
    : 'Commit message là thứ tiếng Anh bạn viết ra mà được đọc nhiều nhất khi đi làm. Người review đọc hôm nay; đồng đội đọc qua <code>git log</code> và <code>git blame</code> năm sau; công cụ biến chúng thành release notes. Một dòng trả lời "đổi gì", phần thân ngắn trả lời "vì sao". Kỹ năng chỉ có vậy — cộng thêm vài luật ngữ pháp cố định.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'A commit is a labelled box when you move house. "Stuff" on every box means opening all of them to find the rice cooker. "Kitchen — rice cooker, bowls" means you find it in ten seconds. <code>git log --oneline</code> is the pile of boxes; the subject line is the label.'
    : 'Commit như thùng đồ khi chuyển nhà. Thùng nào cũng ghi "Đồ" thì phải mở hết mới tìm ra nồi cơm điện. Ghi "Bếp — nồi cơm, bát" thì mười giây là thấy. <code>git log --oneline</code> là chồng thùng; dòng tiêu đề là nhãn.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'Week one of OJT. The project repo belongs to the client, and the client’s engineers read every commit. Your lead looks at your branch and says: "Please fix your commit messages before you open the PR." This is what a typical student history looks like:'
    : 'Tuần đầu OJT. Repo dự án là của khách, và kỹ sư phía khách đọc mọi commit. Trưởng nhóm xem nhánh của bạn và bảo: "Sửa lại commit message rồi hãy mở PR nhé." Lịch sử commit sinh viên điển hình trông thế này:'}</p>
${MAU_LOG_XAU}
<p>${en
    ? 'Problems: no "what" ("fix", "update", "final"), Vietnamese in a client repo, "wip" left in, and one commit doing three things ("fix … and add … and refactor"). Below we fix all of it on a real repository — the LabFlow API from Chapter 2.'
    : 'Vấn đề: không nói "đổi gì" ("fix", "update", "final"), tiếng Việt trong repo của khách, sót "wip", và một commit làm ba việc ("fix … and add … and refactor"). Dưới đây ta sửa hết trên một repo thật — chính API LabFlow của Chương 2.'}</p>

<h3>${en ? 'The seven rules (Chris Beams, 2014)' : 'Bảy luật (Chris Beams, 2014)'}</h3>
<ol>
<li>${en ? 'Separate the subject from the body with a <strong>blank line</strong>.' : 'Tách tiêu đề với thân bằng <strong>một dòng trống</strong>.'}</li>
<li>${en ? 'Limit the subject line to about <strong>50 characters</strong> (72 is the hard limit).' : 'Tiêu đề khoảng <strong>50 ký tự</strong> (72 là giới hạn cứng).'}</li>
<li>${en ? 'Capitalize the subject line (but see Conventional Commits below — the team convention wins).' : 'Viết hoa chữ đầu tiêu đề (nhưng xem Conventional Commits bên dưới — quy ước của nhóm thắng).'}</li>
<li>${en ? 'Do not end the subject line with a period.' : 'Không kết thúc tiêu đề bằng dấu chấm.'}</li>
<li>${en ? 'Use the <strong>imperative mood</strong> in the subject line.' : 'Dùng <strong>thể mệnh lệnh</strong> ở tiêu đề.'}</li>
<li>${en ? 'Wrap the body at <strong>72 characters</strong>.' : 'Xuống dòng phần thân ở <strong>72 ký tự</strong>.'}</li>
<li>${en ? 'Use the body to explain <strong>what and why</strong>, not how (the diff already shows how).' : 'Dùng phần thân để giải thích <strong>đổi gì và vì sao</strong>, không phải làm thế nào (diff đã cho thấy).'}</li>
</ol>
<p>${en
    ? 'These rules are not one person’s taste. The Git manual itself (<code>git help commit</code>, section DISCUSSION) recommends a short first line under 50 characters, a blank line, then a fuller description; Git’s own contributor guide asks for the imperative ("make xyzzy do frotz" instead of "[This patch] makes xyzzy do frotz"). Why 50/72: <code>git log --oneline</code>, email patches and terminal windows are narrow, and GitHub shortens long commit titles in its interface.'
    : 'Đây không phải sở thích của một người. Chính tài liệu Git (<code>git help commit</code>, mục DISCUSSION) khuyên dòng đầu ngắn dưới 50 ký tự, một dòng trống, rồi mô tả đầy đủ; hướng dẫn đóng góp của chính dự án Git yêu cầu thể mệnh lệnh ("make xyzzy do frotz" thay vì "[This patch] makes xyzzy do frotz"). Vì sao 50/72: <code>git log --oneline</code>, patch gửi qua email và cửa sổ terminal đều hẹp, và GitHub cắt ngắn tiêu đề commit dài trên giao diện.'}</p>

<h3>${en ? 'The imperative test' : 'Phép thử thể mệnh lệnh'}</h3>
<p>${en
    ? 'Put your subject after <strong>"If applied, this commit will …"</strong>. If the sentence is correct English, the subject is correct.'
    : 'Đặt tiêu đề của bạn sau <strong>"If applied, this commit will …"</strong>. Câu đúng tiếng Anh thì tiêu đề đúng.'}</p>
<table>
<thead><tr><th>${en ? 'Subject' : 'Tiêu đề'}</th><th>"If applied, this commit will …"</th><th></th></tr></thead>
<tbody>
<tr><td>Return the requested page in GET /api/loans</td><td>… will return the requested page ✓</td><td>✅</td></tr>
<tr><td>Fixed pagination</td><td>… will fixed pagination ✗</td><td>❌</td></tr>
<tr><td>Fixing pagination</td><td>… will fixing pagination ✗</td><td>❌</td></tr>
<tr><td>Pagination fix</td><td>… will pagination fix ✗</td><td>❌</td></tr>
<tr><td>Allow a loan period of exactly 7 days</td><td>… will allow a loan period of exactly 7 days ✓</td><td>✅</td></tr>
</tbody>
</table>
<p>${en
    ? 'Why it feels odd to Vietnamese speakers: Vietnamese verbs do not change form, so "đã sửa" feels natural as "fixed". In a commit you are not reporting what you did yesterday — you are labelling what the commit <em>does</em> whenever someone applies it.'
    : 'Vì sao người Việt thấy lạ: động từ tiếng Việt không đổi dạng, nên "đã sửa" dịch thành "fixed" nghe rất tự nhiên. Nhưng commit không phải báo cáo việc hôm qua bạn làm — nó là nhãn cho việc commit <em>làm</em> bất cứ khi nào ai đó áp nó vào.'}</p>

<h3>Conventional Commits 1.0.0</h3>
<p>${en
    ? 'Many teams add a machine-readable prefix, defined at conventionalcommits.org and based on the Angular project’s convention: <code>type(scope): description</code>. Tools then generate changelogs and choose the next version number automatically.'
    : 'Nhiều nhóm thêm tiền tố máy đọc được, định nghĩa ở conventionalcommits.org, dựa trên quy ước của dự án Angular: <code>type(scope): description</code>. Công cụ nhờ đó tự sinh changelog và tự chọn số phiên bản kế tiếp.'}</p>
<table>
<thead><tr><th>Type</th><th>${en ? 'Use for' : 'Dùng cho'}</th><th>SemVer</th></tr></thead>
<tbody>
<tr><td><code>feat</code></td><td>${en ? 'a new feature for the user' : 'tính năng mới cho người dùng'}</td><td>MINOR (1.4.0 → 1.5.0)</td></tr>
<tr><td><code>fix</code></td><td>${en ? 'a bug fix' : 'sửa lỗi'}</td><td>PATCH (1.4.0 → 1.4.1)</td></tr>
<tr><td><code>feat!</code> / <code>BREAKING CHANGE:</code></td><td>${en ? 'a change that breaks existing users' : 'thay đổi làm hỏng người dùng hiện có'}</td><td>MAJOR (1.4.0 → 2.0.0)</td></tr>
<tr><td><code>docs</code> · <code>test</code> · <code>refactor</code> · <code>perf</code> · <code>style</code> · <code>build</code> · <code>ci</code> · <code>chore</code></td><td>${en ? 'documentation · tests · restructure without behaviour change · performance · formatting · build system · CI config · maintenance' : 'tài liệu · test · tái cấu trúc không đổi hành vi · hiệu năng · định dạng · hệ thống build · cấu hình CI · việc lặt vặt'}</td><td>${en ? 'no release by default' : 'mặc định không phát hành'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'Only <code>feat</code> and <code>fix</code> are defined by the specification itself; the other types come from the Angular convention and tools like commitlint. Conventional Commits descriptions usually start in <strong>lowercase</strong> after the colon (<code>fix(loans): return …</code>) — that is the one place where rule 3 above gives way to the team convention. Whatever your team chose, be consistent.'
    : 'Đặc tả chỉ định nghĩa <code>feat</code> và <code>fix</code>; các type còn lại đến từ quy ước Angular và các công cụ như commitlint. Phần mô tả sau dấu hai chấm thường viết <strong>chữ thường</strong> (<code>fix(loans): return …</code>) — đó là chỗ duy nhất luật 3 ở trên nhường cho quy ước nhóm. Nhóm chọn kiểu nào thì nhất quán kiểu đó.'}</p>
${MAU_BREAKING}
<p>${en
    ? 'The last lines are <strong>trailers</strong>: <code>Refs: LAB-231</code> links the ticket; <code>Co-authored-by: Name &lt;email&gt;</code> credits a pair-programming partner on GitHub; <code>BREAKING CHANGE:</code> explains what users must change.'
    : 'Các dòng cuối là <strong>trailer</strong>: <code>Refs: LAB-231</code> nối tới ticket; <code>Co-authored-by: Name &lt;email&gt;</code> ghi công người code cặp trên GitHub; <code>BREAKING CHANGE:</code> giải thích người dùng phải đổi gì.'}</p>

<h3>${en ? 'See it run: a hook that rejects bad messages' : 'Xem chạy thật: hook chặn commit message xấu'}</h3>
<p>${en
    ? 'Git runs <code>.git/hooks/commit-msg</code> with the path of the message file; if the script exits with a non-zero code, the commit is cancelled. The hook below checks the format, the length, the imperative mood (a simple check: a first word ending in -ed or -ing), the final period and the blank line. Real teams use commitlint with Husky, which does the same thing with more rules.'
    : 'Git chạy <code>.git/hooks/commit-msg</code> với đường dẫn tệp chứa message; script thoát với mã khác 0 thì commit bị huỷ. Hook dưới đây kiểm định dạng, độ dài, thể mệnh lệnh (kiểm đơn giản: chữ đầu kết thúc bằng -ed hoặc -ing), dấu chấm cuối và dòng trống. Nhóm thật dùng commitlint cùng Husky, làm đúng việc này với nhiều luật hơn.'}</p>
${MAU_HOOK}
${MAU_HOOK_CHAY}
<p>${en ? 'Now a message that passes — subject, blank line, why, what, trailer:' : 'Giờ một message qua được — tiêu đề, dòng trống, vì sao, đổi gì, trailer:'}</p>
${MAU_COMMIT_TOT}
<p>${en
    ? 'Notice the body: line 1 says <strong>why</strong> (the symptom), line 2 says <strong>what</strong> changed in one sentence. It does not narrate ("First I debugged, then I found…"). The hook also lets Git’s own messages through — <code>fixup!</code>, <code>Merge …</code>, <code>Revert "…"</code> — exactly like commitlint does by default; you will need that in lab 3.4.'
    : 'Để ý phần thân: dòng 1 nói <strong>vì sao</strong> (triệu chứng), dòng 2 nói <strong>đổi gì</strong> trong một câu. Không kể lể ("First I debugged, then I found…"). Hook cũng cho qua message do Git tự sinh — <code>fixup!</code>, <code>Merge …</code>, <code>Revert "…"</code> — giống commitlint mặc định; lab 3.4 sẽ cần tới điều này.'}</p>

<h3>${en ? 'One commit, one change' : 'Một commit, một thay đổi'}</h3>
<p>${en
    ? 'If your subject needs "and", it is probably two commits: "Fix bug and add export and refactor some code" should be three. Small commits are easier to review, to revert and to find with <code>git bisect</code>. Use <code>git add -p</code> to stage only part of a file.'
    : 'Tiêu đề cần chữ "and" thì nhiều khả năng là hai commit: "Fix bug and add export and refactor some code" phải là ba. Commit nhỏ dễ review, dễ revert và dễ tìm bằng <code>git bisect</code>. Dùng <code>git add -p</code> để chỉ stage một phần tệp.'}</p>

<h3>🕵️ ${en ? 'Hacker corner — what a commit can leak (Uber, 2016)' : 'Góc hacker — commit có thể làm lộ gì (Uber, 2016)'}</h3>
<div class="callout warn"><p>${en
    ? 'In 2016 attackers got into a private GitHub repository used by Uber engineers and found an AWS access key written in the code. With it they downloaded data about 57 million riders and drivers from Amazon S3. Uber paid the attackers through its bug bounty programme and did not disclose the breach for a year; the US FTC expanded its settlement with Uber in 2018, and the former security chief was convicted in 2022 for concealing it. A commit message never contains secrets — but a commit does, if you add a <code>.env</code> or a key. Deleting the file in a later commit does <strong>not</strong> remove it from history: rotate the key first, then clean history (see Git course 8.3).'
    : 'Năm 2016 kẻ tấn công vào được một repo GitHub riêng tư mà kỹ sư Uber dùng và thấy một AWS access key viết thẳng trong mã. Với nó, chúng tải dữ liệu của 57 triệu hành khách và tài xế từ Amazon S3. Uber trả tiền cho kẻ tấn công qua chương trình bug bounty và giấu vụ việc một năm; FTC Mỹ mở rộng thoả thuận dàn xếp với Uber năm 2018, và cựu giám đốc bảo mật bị kết tội năm 2022 vì che giấu. Commit message không bao giờ chứa bí mật — nhưng commit thì có, nếu bạn lỡ add <code>.env</code> hay một khoá. Xoá tệp ở commit sau <strong>không</strong> xoá nó khỏi lịch sử: thu hồi/đổi khoá trước, rồi mới dọn lịch sử (xem khoá Git bài 8.3).'}</p></div>

<h3>${en ? 'Mistakes Vietnamese developers make' : 'Lỗi dev Việt hay mắc'}</h3>
${saiDung([
    ['fix bug', 'fix(loans): return the requested page in GET /api/loans', en ? 'Which bug? Where?' : 'Bug nào? Ở đâu?'],
    ['Fixed pagination.', 'fix(loans): return the requested page …', en ? 'Imperative, no period.' : 'Mệnh lệnh, không dấu chấm.'],
    ['sửa lỗi phân trang', en ? 'English in a client repo' : 'Tiếng Anh trong repo của khách', en ? 'The client’s engineers must be able to read the history.' : 'Kỹ sư phía khách phải đọc được lịch sử.'],
    ['update', 'docs: add the run command to the README', en ? '"update" is true of every commit.' : '"update" đúng với mọi commit.'],
    ['Fix bug and add export and refactor', en ? 'Three commits' : 'Ba commit', en ? 'One logical change per commit.' : 'Mỗi commit một thay đổi logic.'],
    ['fix(loans): I fixed the bug that page 2 show same data with page 1', 'fix(loans): return the requested page in GET /api/loans', en ? 'No "I"; describe the new behaviour; "the same … as", not "same … with".' : 'Không "I"; tả hành vi mới; "the same … as", không phải "same … with".'],
  ], en)}

${tuVung(en ? [
    ['subject line', 'the first line of a commit message', 'Keep the subject line under 50 characters.'],
    ['imperative mood', 'the command form of a verb', '"Add", not "Added" — use the imperative mood.'],
    ['to squash', 'to combine several commits into one', 'Please squash the fixup commits before merging.'],
    ['to amend', 'to change the last commit', 'I amended the commit message.'],
    ['to revert', 'to add a commit that undoes another', 'We reverted the release because of the bug.'],
    ['breaking change', 'a change that forces users to update their code', 'Renaming the field is a breaking change.'],
    ['trailer', 'a "Key: value" line at the end of the message', 'Add a Refs: trailer with the ticket number.'],
  ] : [
    ['subject line', 'dòng đầu của commit message', 'Keep the subject line under 50 characters.'],
    ['imperative mood', 'thể mệnh lệnh của động từ', '"Add", not "Added" — use the imperative mood.'],
    ['to squash', 'gộp nhiều commit thành một', 'Please squash the fixup commits before merging.'],
    ['to amend', 'sửa commit cuối', 'I amended the commit message.'],
    ['to revert', 'thêm một commit để hoàn tác commit khác', 'We reverted the release because of the bug.'],
    ['breaking change', 'thay đổi buộc người dùng phải sửa mã', 'Renaming the field is a breaking change.'],
    ['trailer', 'dòng "Khoá: giá trị" ở cuối message', 'Add a Refs: trailer with the ticket number.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — rewrite eight messages (15 minutes)' : 'Thực hành — viết lại tám message (15 phút)'}</h3>
<div class="callout ok">
<p>${en ? 'Use Conventional Commits. Invent a reasonable scope.' : 'Dùng Conventional Commits. Tự đặt scope hợp lý.'}</p>
<ol>
<li>"Fixed login bug"</li>
<li>"update readme"</li>
<li>"add function export csv for manager"</li>
<li>"Refactoring LoanService."</li>
<li>"change api response field name days to periodDays (FE need update)"</li>
<li>"fix typo"</li>
<li>"add unit test"</li>
<li>"bump spring boot version 3.3.4 → 3.3.5"</li>
</ol>
<details><summary>${en ? 'Model answers' : 'Đáp án gợi ý'}</summary>
${mau(`
1. fix(auth): keep the session after "Remember me" is checked
2. docs: add setup steps for Windows to the README
3. feat(loans): add CSV export of the loan history for lab managers
4. refactor(loans): extract the due-date calculation from LoanService
5. feat(api)!: rename the days field to periodDays
   (body) BREAKING CHANGE: clients must send "periodDays" instead of "days".
6. docs(loans): fix a typo in the overdue reminder email     (or style: … for code)
7. test(loans): cover page 2 and an empty page in the loan list
8. build(deps): upgrade Spring Boot from 3.3.4 to 3.3.5
`)}
</details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every subject passes the "If applied, this commit will…" test, none ends with a period, none is longer than 72 characters, and number 5 is marked as breaking.' : 'mọi tiêu đề qua phép thử "If applied, this commit will…", không cái nào có dấu chấm cuối, không cái nào dài quá 72 ký tự, và câu 5 được đánh dấu breaking.'}</p>
</div>

${lienKet('/courses/git/learn?lessonSlug=git-1-4-loi-nhan-commit', '🌿', en ? 'Git course 1.4 — Commit messages' : 'Khoá Git 1.4 — Lời nhắn commit', en ? 'The Git side: amend, interactive rebase, history.' : 'Phía Git: amend, rebase tương tác, lịch sử.')}
${lienKet('/courses/git/learn?lessonSlug=git-8-3-go-bi-mat', '🔑', en ? 'Git course 8.3 — Removing secrets from history' : 'Khoá Git 8.3 — Gỡ bí mật khỏi lịch sử', en ? 'Rotate first, then rewrite history.' : 'Đổi khoá trước, rồi mới viết lại lịch sử.')}
</div>
`;

/* ═════════════ 3.2 — Mô tả pull request ═════════════ */
const MAU_PR_XAU = mau(`
Title: fix

Description:
  fix bug as discussed, pls review
`, 'Mô tả PR kiểu hay gặp — người review phải tự đoán mọi thứ.');

const MAU_PR_TOT = mau(`
Title: fix(loans): return the requested page in GET /api/loans

## Summary
GET /api/loans ignored the page parameter, so page 2 returned the same
loans as page 1. This PR uses the page number to compute the start index.

Closes LAB-231

## Changes
- labflow-mini.mjs: slice(start, start + size) instead of slice(0, size)

## How to test
1. node labflow-mini.mjs
2. curl -s 'http://localhost:41812/api/loans?page=2&size=5' | jq -c '[.items[].id]'
   Expected: [6,7,8,9,10]

## Tested
| Request          | Before        | After          |
|------------------|---------------|----------------|
| page=1&size=5    | [1,2,3,4,5]   | [1,2,3,4,5]    |
| page=2&size=5    | [1,2,3,4,5]   | [6,7,8,9,10]   |
| page=3&size=5    | [1,2,3,4,5]   | [11,12]        |

## Risks / not included
- page < 1 is not validated: page=0 returns [] and page=-1 returns loans 3–7
  (slice() counts negative indexes from the end). Out of scope here;
  I created LAB-238 to return 400 for page < 1 or size < 1.
- No change to the response format, so the frontend needs no update.
`, 'Mô tả PR viết lại — mọi số trong bảng và trong "Risks" là output thật của API (24/11/2026).');

const MAU_STAT = mau(`
$ git show --stat --format='%h %s' HEAD
7e4216c fix(loans): return the requested page in GET /api/loans

 labflow-mini.mjs | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

$ curl -s 'http://localhost:41812/api/loans?page=0&size=5' | jq -c '{page, size, start, ids: [.items[].id]}'
{"page":0,"size":5,"start":-5,"ids":[]}
$ curl -s 'http://localhost:41812/api/loans?page=-1&size=5' | jq -c '{page, size, start, ids: [.items[].id]}'
{"page":-1,"size":5,"start":-10,"ids":[3,4,5,6,7]}
$ curl -s 'http://localhost:41812/api/loans?page=3&size=5' | jq -c '{page, size, start, ids: [.items[].id]}'
{"page":3,"size":5,"start":10,"ids":[11,12]}
`, 'Output THẬT dùng để viết mô tả PR: phạm vi thay đổi + thử biên trước khi gửi review.');

const L32 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Writing' : 'Chương 3 · Viết'}</span>
<h2>${en ? '3.2 — Pull request descriptions: summary, why, how it was tested, screenshots, risks' : '3.2 — Mô tả pull request: tóm tắt, vì sao, đã kiểm thế nào, ảnh chụp, rủi ro'}</h2>
<p class="lead">${en
    ? 'A pull request description is a short sales letter for your change. The reviewer has twenty other things to do; your description decides whether they understand the change in two minutes or postpone it until tomorrow. Its job: <strong>what changed, why, how you know it works, and what could go wrong</strong>.'
    : 'Mô tả pull request là lá thư ngắn "chào hàng" cho thay đổi của bạn. Người review còn hai mươi việc khác; mô tả của bạn quyết định họ hiểu thay đổi trong hai phút hay để mai tính. Việc của nó: <strong>đổi gì, vì sao, sao bạn biết nó chạy, và có thể hỏng chỗ nào</strong>.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Handing your motorbike back to its owner after a repair: "Done" makes them nervous. "Changed the front brake pads, tested on the hill road twice, the left mirror is still loose — I didn’t touch it" makes them trust you. The last sentence — what you did <em>not</em> do — is the part most people forget.'
    : 'Trả xe cho chủ sau khi sửa: "Xong rồi" làm họ lo. "Thay má phanh trước, chạy thử dốc hai lần, gương trái vẫn lỏng — anh chưa động vào" làm họ tin. Câu cuối — điều bạn <em>không</em> làm — là phần hầu hết mọi người quên.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'You fixed LAB-231 (pagination) on the branch from lesson 3.1. Before you open the PR, you collect two facts with real commands: the size of the change, and how the fix behaves at the edges.'
    : 'Bạn đã sửa LAB-231 (phân trang) trên nhánh ở bài 3.1. Trước khi mở PR, bạn gom hai sự thật bằng lệnh thật: thay đổi lớn tới đâu, và bản sửa xử lý biên thế nào.'}</p>
${MAU_STAT}
<p>${en
    ? 'The edge test found something real: <code>page=-1</code> returns loans 3–7, because JavaScript’s <code>slice()</code> counts negative indexes from the end of the array. It was already broken before your change, so you do not fix it here — but you <strong>say it</strong> in the PR. Now compare the two descriptions:'
    : 'Thử biên tìm ra một điều thật: <code>page=-1</code> trả về phiếu 3–7, vì <code>slice()</code> của JavaScript đếm chỉ số âm từ cuối mảng. Nó vốn đã hỏng trước thay đổi của bạn, nên bạn không sửa ở đây — nhưng bạn <strong>nói ra</strong> trong PR. Giờ so hai bản mô tả:'}</p>
${MAU_PR_XAU}
${MAU_PR_TOT}

<h3>${en ? 'The sections, and the English of each' : 'Các phần, và tiếng Anh của từng phần'}</h3>
<table>
<thead><tr><th>${en ? 'Section' : 'Phần'}</th><th>${en ? 'Write' : 'Viết'}</th><th>${en ? 'Sentence starters' : 'Mở câu'}</th></tr></thead>
<tbody>
<tr><td>Title</td><td>${en ? 'Same rules as a commit subject. Single-commit PR: reuse the subject.' : 'Luật như tiêu đề commit. PR một commit: dùng lại tiêu đề đó.'}</td><td>fix(loans): return …</td></tr>
<tr><td>Summary</td><td>${en ? 'Problem in one sentence, solution in one sentence.' : 'Vấn đề một câu, giải pháp một câu.'}</td><td>This PR adds / fixes / removes … · Previously, … Now, …</td></tr>
<tr><td>${en ? 'Links' : 'Liên kết'}</td><td>${en ? 'Ticket, spec section, design, related PRs.' : 'Ticket, mục spec, thiết kế, PR liên quan.'}</td><td>Closes #12 · Refs LAB-231 · Follow-up to #40 · Depends on #44</td></tr>
<tr><td>Changes</td><td>${en ? 'Bullets per file or area, only if more than one.' : 'Gạch đầu dòng theo tệp/khu vực, chỉ khi có nhiều hơn một.'}</td><td>- Add … - Rename … - Remove the unused …</td></tr>
<tr><td>How to test</td><td>${en ? 'Steps the reviewer can copy.' : 'Các bước người review chép chạy được.'}</td><td>1. Run … 2. Open … Expected: …</td></tr>
<tr><td>Tested</td><td>${en ? 'What you ran and the result. Before/after table or screenshots.' : 'Bạn đã chạy gì, kết quả ra sao. Bảng trước/sau hoặc ảnh chụp.'}</td><td>Tested locally with … · Unit tests: 42 passed · Before / After</td></tr>
<tr><td>Screenshots</td><td>${en ? 'For any UI change: before and after, same size, one line each.' : 'Với mọi thay đổi giao diện: trước và sau, cùng cỡ, mỗi ảnh một dòng chú thích.'}</td><td>Before: the button overlaps the table. After: …</td></tr>
<tr><td>Risks / not included</td><td>${en ? 'What could break, what you did not do, how to roll back.' : 'Có thể hỏng gì, chưa làm gì, cách quay lại.'}</td><td>Out of scope: … · Known issue: … · To roll back, revert this PR; no migration.</td></tr>
</tbody>
</table>
<p>${en
    ? 'GitHub closes an issue automatically when a PR that says <strong>close/closes/closed, fix/fixes/fixed or resolve/resolves/resolved #12</strong> is merged into the default branch (GitHub Docs, "Linking a pull request to an issue"). Jira uses the ticket key in the branch name or title instead (smart commits and the development panel). Use <strong>Refs</strong> when the PR is related but does not finish the ticket.'
    : 'GitHub tự đóng issue khi một PR có <strong>close/closes/closed, fix/fixes/fixed hoặc resolve/resolves/resolved #12</strong> được merge vào nhánh mặc định (GitHub Docs, "Linking a pull request to an issue"). Jira thì dựa vào mã ticket trong tên nhánh hoặc tiêu đề (smart commits và bảng development). Dùng <strong>Refs</strong> khi PR liên quan nhưng chưa hoàn thành ticket.'}</p>

<h3>${en ? 'Small PRs get better reviews' : 'PR nhỏ được review kỹ hơn'}</h3>
<p>${en
    ? 'Google’s engineering practices ("Small CLs") give the reasons: small changes are reviewed faster and more thoroughly, are less likely to introduce bugs, are easier to roll back and easier to merge. If you cannot avoid a big PR, say so and help: <em>"This PR is large because the migration and the entity must change together. Suggested review order: 1) V12 migration, 2) Loan entity, 3) tests."</em>'
    : 'Hướng dẫn kỹ thuật của Google ("Small CLs") nêu lý do: thay đổi nhỏ được review nhanh và kỹ hơn, ít gây lỗi hơn, dễ rollback và dễ merge hơn. Không tránh được PR lớn thì nói rõ và giúp người review: <em>"This PR is large because the migration and the entity must change together. Suggested review order: 1) V12 migration, 2) Loan entity, 3) tests."</em>'}</p>

<h3>${en ? 'Asking for a review, and draft PRs' : 'Nhờ review, và PR nháp'}</h3>
<ul>
<li>${en ? 'Open a <strong>draft PR</strong> when you want early feedback: "Draft — the API part is ready for an early look; tests are still missing."' : 'Mở <strong>PR nháp (draft)</strong> khi muốn góp ý sớm: "Draft — the API part is ready for an early look; tests are still missing."'}</li>
<li>${en ? 'Ask a person, say what and by when: "@Lan could you review this today? It blocks the demo on Thursday." Not "pls review asap".' : 'Nhờ đúng người, nói rõ cái gì và bao giờ: "@Lan could you review this today? It blocks the demo on Thursday." Không phải "pls review asap".'}</li>
<li>${en ? 'Point to the risky part: "The interesting part is the date calculation in DueDate.java; the rest is renaming."' : 'Chỉ ra chỗ rủi ro: "The interesting part is the date calculation in DueDate.java; the rest is renaming."'}</li>
<li>${en ? 'Review your own diff first. Remove <code>console.log</code>, commented-out code and unrelated formatting changes.' : 'Tự review diff của mình trước. Bỏ <code>console.log</code>, mã bị comment và các thay đổi định dạng không liên quan.'}</li>
</ul>

<h3>${en ? 'Mistakes Vietnamese developers make in PRs' : 'Lỗi dev Việt hay mắc khi viết PR'}</h3>
${saiDung([
    ['Title: fix', 'fix(loans): return the requested page in GET /api/loans', en ? 'The title appears in lists, notifications and the merge commit.' : 'Tiêu đề hiện ở danh sách, thông báo và commit merge.'],
    ['fix bug as discussed', 'Previously … Now … Closes LAB-231', en ? 'The reviewer was not in your discussion; the client never will be.' : 'Người review không có mặt lúc bàn; khách thì càng không.'],
    ['Tested OK', 'Tested locally: page 2 → [6,7,8,9,10] (table above)', en ? '"OK" is an opinion; a result is evidence.' : '"OK" là ý kiến; kết quả mới là bằng chứng.'],
    [en ? 'Hiding a known problem' : 'Giấu một vấn đề đã biết', 'Known issue: page=-1 returns loans 3–7 (LAB-238)', en ? 'If the reviewer finds it later, trust drops; if you say it, trust grows.' : 'Người review tự tìm ra thì mất lòng tin; bạn nói trước thì được tin hơn.'],
    [en ? 'A 2,000-line PR mixing a feature, a refactor and formatting' : 'PR 2.000 dòng trộn tính năng, refactor và định dạng', en ? 'Three PRs: formatting, refactor, feature' : 'Ba PR: định dạng, refactor, tính năng', en ? 'Small CLs.' : 'Small CLs.'],
  ], en)}

${tuVung(en ? [
    ['to open / raise a PR', 'to create a pull request', 'I raised a PR for LAB-231.'],
    ['draft PR', 'a PR not ready to merge, for early feedback', 'It is a draft — please do not merge yet.'],
    ['to address (a comment)', 'to respond to it by changing the code', 'I addressed all comments in 3f2a1c9.'],
    ['follow-up', 'a later ticket/PR for related work', 'Validation of page < 1 is a follow-up (LAB-238).'],
    ['to roll back', 'to return to the previous version', 'To roll back, revert this PR.'],
    ['known issue', 'a problem you know about and declare', 'Known issue: the export is slow for 10k rows.'],
    ['to be out of scope', 'not part of this change', 'The UI change is out of scope for this PR.'],
  ] : [
    ['to open / raise a PR', 'tạo pull request', 'I raised a PR for LAB-231.'],
    ['draft PR', 'PR chưa sẵn sàng merge, để xin góp ý sớm', 'It is a draft — please do not merge yet.'],
    ['to address (a comment)', 'xử lý góp ý bằng cách sửa mã', 'I addressed all comments in 3f2a1c9.'],
    ['follow-up', 'ticket/PR sau cho phần việc liên quan', 'Validation of page < 1 is a follow-up (LAB-238).'],
    ['to roll back', 'quay về bản trước', 'To roll back, revert this PR.'],
    ['known issue', 'vấn đề đã biết và nói ra', 'Known issue: the export is slow for 10k rows.'],
    ['to be out of scope', 'không thuộc thay đổi này', 'The UI change is out of scope for this PR.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — one PR description (20 minutes)' : 'Thực hành — một mô tả PR (20 phút)'}</h3>
<div class="callout ok">
<p>${en ? 'Write the PR description for commit <code>74c5f1a fix(loans): allow a loan period of exactly 7 days</code> (Chapter 2, bug #4). Include Summary, Closes, How to test, a Tested table with 6, 7 and 8 days, and one line of risk.' : 'Viết mô tả PR cho commit <code>74c5f1a fix(loans): allow a loan period of exactly 7 days</code> (Chương 2, lỗi #4). Có Summary, Closes, How to test, bảng Tested với 6, 7 và 8 ngày, và một dòng rủi ro.'}</p>
<details><summary>${en ? 'Model answer' : 'Đáp án gợi ý'}</summary>
${mau(`
Title: fix(loans): allow a loan period of exactly 7 days

## Summary
POST /api/loans rejected a period of 7 days, although spec 4.3.3 says the
period MUST NOT exceed 7 days (so 7 is allowed) and the error message itself
says "between 1 and 7 days". The check now uses <= 7.

Closes LAB-236

## How to test
curl -s -o /dev/null -w "%{http_code}\\n" -X POST http://localhost:41812/api/loans \\
  -H 'Content-Type: application/json' -d '{"equipmentId":4,"member":"Tran Van Binh","days":7}'
Expected: 201

## Tested
| days | Before | After |
|------|--------|-------|
| 6    | 201    | 201   |
| 7    | 400    | 201   |
| 8    | 400    | 400   |

## Risks
- The loan form in the UI has its own date-picker limit; it is not changed here
  (LAB-237).
`)}
</details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'a reviewer can run your "How to test" without asking anything, the table shows before and after, and you named one thing the PR does not do.' : 'người review chạy được phần "How to test" mà không phải hỏi gì, bảng có cả trước và sau, và bạn nêu được một điều PR không làm.'}</p>
</div>

${lienKet('/courses/git/learn?lessonSlug=git-6-1-giai-phau-pr', '🌿', en ? 'Git course 6.1 — Anatomy of a pull request' : 'Khoá Git 6.1 — Giải phẫu một pull request', en ? 'Branches, review states, merge strategies on GitHub.' : 'Nhánh, trạng thái review, chiến lược merge trên GitHub.')}
</div>
`;

/* ═════════════ 3.3 — Bình luận review ═════════════ */
const MAU_DIFF = mau(`
$ git diff main...HEAD~1 -- labflow-mini.mjs
@@ -39,7 +39,7 @@ const server = http.createServer(async (req, res) => {
       const page = Number(url.searchParams.get('page') || 1);
       const size = Number(url.searchParams.get('size') || 5);
       const start = (page - 1) * size;
-      const items = loans.slice(0, size);
+      const items = loans.slice(start, start + size);
       return send(res, 200, { page, size, total: loans.length, items, start });
     }
     // GET /api/loans/:id
@@ -54,7 +54,7 @@ const server = http.createServer(async (req, res) => {
       if (!b) return send(res, 400, { error: 'Invalid JSON' });
       if (Buffer.byteLength(b.member || '') > 20)
         return send(res, 400, { error: 'Member name must be at most 20 characters.' });
-      if (!(b.days >= 1 && b.days < 7))
+      if (!(b.days >= 1 && b.days <= 7))
         return send(res, 400, { error: 'Loan period must be between 1 and 7 days.' });
`, 'Diff THẬT (đã bỏ 4 dòng đầu diff --git/index) — hai bản sửa của nhánh ở bài 3.1.');

const MAU_REVIEW = mau(`
Review on "fix(loans): return the requested page …" — Lan · Approve with comments

line 42  praise: Nice and minimal. Thanks for the before/after table in the description.

line 41  issue (non-blocking): page=-1 returns loans 3–7 because slice() counts negative
         indexes from the end. You already listed it as LAB-238 — could we add a
         "// see LAB-238" comment here so nobody copies this pattern?

line 40  question: what should size=0 return? Today it returns an empty list
         with total 12. If 400 is better, let's include it in LAB-238.

line 43  nitpick: "start" in the response looks like debug output. Is it used by
         the frontend? If not, consider removing it in a follow-up.

line 57  suggestion: the message says "between 1 and 7 days", so a test with
         exactly 7 would protect this fix. Something like:
         assert.equal(res.status, 201)   // days = 7
`, 'Một lượt review kiểu thật trên diff phía trên (nhãn theo Conventional Comments). Hành vi size=0 là output thật: {"page":2,"size":0,"start":0,"ids":[]}.');

const MAU_TRA_LOI = mau(`
Reply to the issue:     Good catch — added the comment in 5b1e0d2. LAB-238 is in this sprint.
Reply to the question:  Today it returns [] with total 12. I agree 400 is clearer; added to LAB-238.
Reply to the nitpick:   It is not used by the frontend. I'd prefer to keep this PR minimal —
                        created LAB-239 to remove it. OK with you?
Reply to the suggestion: Done in 5b1e0d2: added tests for 6, 7 and 8 days.
Final:                  PTAL — all comments addressed. Thanks for the quick review!
`, 'Trả lời từng góp ý — ngắn, có mã commit, không tự ái.');

const L33 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Writing' : 'Chương 3 · Viết'}</span>
<h2>${en ? '3.3 — Polite and clear review comments: suggestions, questions, nits, approval' : '3.3 — Bình luận review lịch sự và rõ ràng: gợi ý, câu hỏi, nit, chấp thuận'}</h2>
<p class="lead">${en
    ? 'A review comment has two readers: the code and the person. It must be <strong>clear about the code</strong> (what, where, how important) and <strong>kind to the person</strong> (no blame, a reason, an option). In English the difference between "helpful" and "rude" is often three words — "Could we…?", "What do you think…?" — and Vietnamese developers, translating directly, often sound harsher than they mean.'
    : 'Bình luận review có hai người đọc: mã và con người. Nó phải <strong>rõ về mã</strong> (cái gì, ở đâu, quan trọng tới đâu) và <strong>tử tế với người</strong> (không đổ lỗi, có lý do, có phương án). Trong tiếng Anh, khác biệt giữa "có ích" và "thô lỗ" nhiều khi chỉ là ba chữ — "Could we…?", "What do you think…?" — mà dev Việt dịch thẳng thường nghe gắt hơn ý mình.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'A friend asks you to check their CV. "Bad" helps nobody. "The project section is strong. One thing: the dates on line 3 and line 5 overlap — is that right? Small thing: two fonts in the header." You praised, you flagged one real problem as a question, and you marked a small thing as small. That is a code review.'
    : 'Bạn nhờ xem CV. "Dở" chẳng giúp ai. "Phần dự án tốt. Một chỗ: ngày ở dòng 3 và dòng 5 chồng nhau — đúng không? Chuyện nhỏ: tiêu đề dùng hai phông." Bạn đã khen, nêu một vấn đề thật dưới dạng câu hỏi, và đánh dấu chuyện nhỏ là chuyện nhỏ. Đó chính là code review.'}</p>

<h3>${en ? 'Situation — review a real diff' : 'Tình huống — review một diff thật'}</h3>
<p>${en
    ? 'You are asked to review your teammate’s branch from lesson 3.1. Here is the diff, and a review written with the labels of <strong>Conventional Comments</strong> (conventionalcomments.org): each comment starts with a label that says what kind of comment it is, and optionally whether it blocks the merge.'
    : 'Bạn được nhờ review nhánh của đồng đội ở bài 3.1. Đây là diff, và một lượt review viết theo nhãn của <strong>Conventional Comments</strong> (conventionalcomments.org): mỗi bình luận bắt đầu bằng một nhãn cho biết đó là loại góp ý gì, và (tuỳ) có chặn merge hay không.'}</p>
${MAU_DIFF}
${MAU_REVIEW}

<h3>${en ? 'Labels: say how important the comment is' : 'Nhãn: nói rõ góp ý quan trọng tới đâu'}</h3>
<table>
<thead><tr><th>${en ? 'Label' : 'Nhãn'}</th><th>${en ? 'Meaning' : 'Nghĩa'}</th><th>${en ? 'Example' : 'Ví dụ'}</th></tr></thead>
<tbody>
<tr><td><strong>praise</strong></td><td>${en ? 'something good — be specific' : 'điểm tốt — khen cụ thể'}</td><td>praise: The test names read like the spec. 👍</td></tr>
<tr><td><strong>issue</strong></td><td>${en ? 'a real problem; pair it with a suggestion' : 'vấn đề thật; kèm gợi ý'}</td><td>issue: This query runs once per loan (N+1). Could we fetch them in one query?</td></tr>
<tr><td><strong>suggestion</strong></td><td>${en ? 'a proposed improvement' : 'đề xuất cải tiến'}</td><td>suggestion: Consider extracting this into dueDateOf(loan).</td></tr>
<tr><td><strong>question</strong></td><td>${en ? 'you are not sure — ask, do not assume' : 'không chắc — hỏi, đừng mặc định'}</td><td>question: Is this endpoint called by the mobile app too?</td></tr>
<tr><td><strong>nitpick / nit</strong></td><td>${en ? 'tiny, never blocks' : 'rất nhỏ, không bao giờ chặn'}</td><td>nit: "recieve" → "receive".</td></tr>
<tr><td><strong>thought / note</strong></td><td>${en ? 'an idea or information, no action required' : 'ý tưởng hoặc thông tin, không cần làm gì'}</td><td>thought: Long term we may want cursor pagination.</td></tr>
<tr><td>(blocking) / (non-blocking)</td><td>${en ? 'decoration: does it stop the merge?' : 'phụ chú: có chặn merge không?'}</td><td>issue (blocking): The password is logged in plain text.</td></tr>
</tbody>
</table>
<p>${en
    ? 'Google’s guide "How to write code review comments" recommends the same idea with simpler prefixes — <strong>Nit:</strong>, <strong>Optional:</strong> (or Consider:), <strong>FYI:</strong> — and three habits: be kind, explain your reasoning, and balance giving directions with letting the author find the solution. Comment on the code, never on the person: "This function is hard to follow", not "You wrote confusing code".'
    : 'Hướng dẫn "How to write code review comments" của Google khuyên cùng ý đó với tiền tố đơn giản hơn — <strong>Nit:</strong>, <strong>Optional:</strong> (hoặc Consider:), <strong>FYI:</strong> — và ba thói quen: tử tế, giải thích lý do, và cân bằng giữa chỉ thẳng cách sửa với để tác giả tự tìm. Nhận xét về mã, không bao giờ về người: "This function is hard to follow", không phải "You wrote confusing code".'}</p>

<h3>${en ? 'Softeners: from command to request' : 'Làm mềm câu: từ ra lệnh sang đề nghị'}</h3>
${saiDung([
    ['Wrong.', 'issue: page=-1 returns loans 3–7. Should we return 400 for page < 1?', en ? 'Say what, where, and propose.' : 'Nói cái gì, ở đâu, kèm đề xuất.'],
    ['Why you do this?', 'question: What is the reason for the retry here? I may be missing context.', en ? '"Why you do" is ungrammatical and sounds accusing.' : '"Why you do" sai ngữ pháp và nghe như buộc tội.'],
    ['Change to Map.', 'suggestion: Could we use a Map here? Lookup would be O(1) instead of O(n).', en ? 'Request + reason.' : 'Đề nghị + lý do.'],
    ['This code is bad.', 'This function does three things; splitting it would make the test easier.', en ? 'About the code, specific, with a benefit.' : 'Về mã, cụ thể, kèm lợi ích.'],
    ['You forgot the test.', 'Could we add a test for exactly 7 days? It would protect this fix.', en ? '"We" shares ownership; no blame.' : '"We" chia sẻ trách nhiệm; không đổ lỗi.'],
    ['Sorry for bother you, sorry, maybe this is stupid but…', 'question: Is this called from the mobile app too?', en ? 'Over-apologising hides the point. One "Sorry if I missed it" is enough.' : 'Xin lỗi quá nhiều làm chìm ý chính. Một câu "Sorry if I missed it" là đủ.'],
  ], en)}

<h3>${en ? 'Receiving a review' : 'Khi nhận review'}</h3>
${MAU_TRA_LOI}
<ul>
<li>${en ? '<strong>Agree</strong>: "Good catch, fixed in &lt;hash&gt;." · "Done." (only for trivial ones)' : '<strong>Đồng ý</strong>: "Good catch, fixed in &lt;hash&gt;." · "Done." (chỉ cho góp ý rất nhỏ)'}</li>
<li>${en ? '<strong>Disagree politely</strong>: "I’d prefer to keep X because Y. Happy to change it if you feel strongly." · "I see your point. In this case … — what do you think?"' : '<strong>Không đồng ý một cách lịch sự</strong>: "I’d prefer to keep X because Y. Happy to change it if you feel strongly." · "I see your point. In this case … — what do you think?"'}</li>
<li>${en ? '<strong>Move it out</strong>: "Good idea — out of scope for this PR, created LAB-239." · "Let’s discuss it in the standup / on a quick call."' : '<strong>Tách ra</strong>: "Good idea — out of scope for this PR, created LAB-239." · "Let’s discuss it in the standup / on a quick call."'}</li>
<li>${en ? '<strong>After pushing changes</strong>: "PTAL" (please take another look). Reviewers approve with "LGTM" (looks good to me).' : '<strong>Sau khi đẩy bản sửa</strong>: "PTAL" (please take another look — nhờ xem lại). Người review duyệt bằng "LGTM" (looks good to me).'}</li>
</ul>
<p>${en
    ? 'On GitHub a review ends in one of three states: <strong>Comment</strong> (feedback only), <strong>Approve</strong>, or <strong>Request changes</strong> (blocks the merge when branch protection requires approval). With Japanese clients, expect indirect wording: "It might be better to…" or "Could you consider…" usually means "please change it".'
    : 'Trên GitHub một lượt review kết thúc ở một trong ba trạng thái: <strong>Comment</strong> (chỉ góp ý), <strong>Approve</strong> (duyệt), hoặc <strong>Request changes</strong> (chặn merge khi nhánh được bảo vệ đòi duyệt). Với khách Nhật, hãy quen với cách nói gián tiếp: "It might be better to…" hay "Could you consider…" thường có nghĩa là "hãy sửa đi".'}</p>

<h3>🕵️ ${en ? 'Hacker corner — reviewing words instead of code (xz-utils, 2024)' : 'Góc hacker — review lời thay vì review mã (xz-utils, 2024)'}</h3>
<div class="callout warn"><p>${en
    ? 'On 29 March 2024 Andres Freund, a PostgreSQL developer at Microsoft, reported on the oss-security mailing list that xz-utils 5.6.0 and 5.6.1 — a compression library loaded by OpenSSH on several Linux distributions — contained a backdoor (CVE-2024-3094). He noticed because SSH logins were about half a second slower. The attacker, using the name "Jia Tan", had spent about two years sending helpful patches and polite messages; in 2022 other accounts (now believed to be sock puppets) complained on the mailing list that the maintainer was too slow and pushed him to add a co-maintainer. The malicious payload was hidden in binary "test files" added in commits described as test updates, and part of the trigger existed only in the release tarballs, not in the Git repository.'
    : 'Ngày 29/3/2024 Andres Freund, lập trình viên PostgreSQL làm ở Microsoft, báo trên danh sách thư oss-security rằng xz-utils 5.6.0 và 5.6.1 — thư viện nén được OpenSSH nạp trên một số bản phân phối Linux — có cửa hậu (CVE-2024-3094). Anh phát hiện vì đăng nhập SSH chậm đi khoảng nửa giây. Kẻ tấn công dùng tên "Jia Tan" đã mất khoảng hai năm gửi patch có ích và tin nhắn lịch sự; năm 2022 vài tài khoản khác (nay được cho là tài khoản giả) phàn nàn trên danh sách thư rằng người bảo trì quá chậm và ép ông thêm người đồng bảo trì. Phần độc hại giấu trong các "tệp test" nhị phân, được thêm bằng những commit mô tả là cập nhật test, và một phần cơ chế kích hoạt chỉ có trong tarball phát hành, không có trong repo Git.'}</p>
<p><strong>${en ? 'Lessons for reviewers:' : 'Bài học cho người review:'}</strong> ${en
    ? '(1) A commit message is a claim, not proof — read the diff, especially binary files and build scripts. (2) Polite, fluent English is not a credential; pressure ("this is taking too long, just merge") is a warning sign. (3) Review what is actually shipped (the artifact), not only the repository.'
    : '(1) Commit message là lời khẳng định, không phải bằng chứng — đọc diff, nhất là tệp nhị phân và script build. (2) Tiếng Anh lịch sự, trôi chảy không phải giấy chứng nhận; áp lực ("lâu quá, merge luôn đi") là dấu hiệu cảnh báo. (3) Review thứ thật sự được phát hành (artifact), không chỉ repo.'}</p></div>

${tuVung(en ? [
    ['LGTM', 'looks good to me — approval', 'LGTM, thanks for the tests!'],
    ['PTAL', 'please take another look', 'Addressed all comments, PTAL.'],
    ['nit / nitpick', 'a very small, non-blocking comment', 'nit: extra blank line.'],
    ['good catch', 'thanks for finding a real problem', 'Good catch — fixed in 5b1e0d2.'],
    ['to push back', 'to disagree politely with a request', 'I’d push back a little: the cache adds complexity.'],
    ['to feel strongly', 'to think something is very important', 'Happy to change it if you feel strongly.'],
    ['to request changes', 'to block the merge until fixed', 'I requested changes because of the SQL injection.'],
  ] : [
    ['LGTM', 'looks good to me — duyệt', 'LGTM, thanks for the tests!'],
    ['PTAL', 'nhờ xem lại lần nữa', 'Addressed all comments, PTAL.'],
    ['nit / nitpick', 'góp ý rất nhỏ, không chặn', 'nit: extra blank line.'],
    ['good catch', 'cảm ơn vì tìm ra lỗi thật', 'Good catch — fixed in 5b1e0d2.'],
    ['to push back', 'phản đối lịch sự một đề nghị', 'I’d push back a little: the cache adds complexity.'],
    ['to feel strongly', 'thấy điều gì rất quan trọng', 'Happy to change it if you feel strongly.'],
    ['to request changes', 'chặn merge tới khi sửa', 'I requested changes because of the SQL injection.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — rewrite six comments, reply to two (15 minutes)' : 'Thực hành — viết lại sáu bình luận, trả lời hai (15 phút)'}</h3>
<div class="callout ok">
<p>${en ? 'Part A — rewrite with a label, a reason and a softener:' : 'Phần A — viết lại có nhãn, lý do và câu làm mềm:'}</p>
<ol>
<li>"Bad name."</li>
<li>"Why not use enum???"</li>
<li>"Missing null check"</li>
<li>"Format code pls"</li>
<li>"This is SQL injection!!"</li>
<li>"ok"</li>
</ol>
<p>${en ? 'Part B — reply to: (7) "nit: rename <code>q</code> to <code>query</code>." (you agree) (8) "suggestion: let’s add Redis caching for this endpoint." (you think it is too early).' : 'Phần B — trả lời: (7) "nit: rename <code>q</code> to <code>query</code>." (bạn đồng ý) (8) "suggestion: let’s add Redis caching for this endpoint." (bạn thấy còn quá sớm).'}</p>
<details><summary>${en ? 'Model answers' : 'Đáp án gợi ý'}</summary>
${mau(`
1. nit: "data2" doesn't say what it holds — maybe "overdueLoans"?
2. question: Could we use an enum for the status instead of strings? It would
   prevent typos like "ACTVE". Or is there a reason to keep strings?
3. issue: findById() can return null when the loan was deleted, and line 31 would
   throw. Could we return 404 in that case?
4. nit (non-blocking): the formatting differs from the rest of the file. Running
   "npm run format" should fix it.
5. issue (blocking): the search term is concatenated into the SQL string, so a
   value like  ' OR '1'='1  changes the query (SQL injection). Could we use a
   parameterised query (PreparedStatement / ? placeholders)?
6. praise: LGTM — thanks for the clear description and the tests!
7. Good point — renamed in 3c4d5e6.
8. Thanks for the idea! I'd prefer to wait: the endpoint takes 40 ms today and we
   have no load numbers yet. Could we revisit it after the load test in LAB-260?
   Happy to discuss if you see a problem I'm missing.
`)}
</details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every comment has a label, a reason, and (for issues) a proposal; none uses "you" as the subject of a criticism; your disagreement in (8) contains a reason, a number and an open door.' : 'bình luận nào cũng có nhãn, lý do, và (với issue) một đề xuất; không câu chê nào lấy "you" làm chủ ngữ; lời không đồng ý ở (8) có lý do, một con số và một lối mở.'}</p>
</div>

${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-4-2-viet-review', '🤝', en ? 'Agile &amp; Teamwork 4.2 — Writing useful review comments' : 'Agile &amp; Làm việc nhóm 4.2 — Viết nhận xét review có ích', en ? 'What to review: correctness, readability, tests, security.' : 'Review cái gì: đúng, dễ đọc, test, bảo mật.')}
</div>
`;

/* ═════════════ 3.4 — Lab: một PR trọn vẹn ═════════════ */
const LAB_SETUP = mau(`
mkdir labflow-pr && cd labflow-pr
git init -b main
cp ../labflow-mini.mjs .                 # the file from lab 2.4 (buggy version)
git add . && git commit -m "feat(loans): add the labflow-mini loan API"
cp ../commit-msg .git/hooks/commit-msg   # the hook from lesson 3.1
chmod +x .git/hooks/commit-msg
PORT=41813 node labflow-mini.mjs         # second terminal; any free port works
`, 'Chuẩn bị (Git Bash trên Windows cũng chạy được). Lượt mẫu dùng cổng 41813 để không đụng máy chủ Chương 2.');

const LAB_REVIEW = mau(`
Review by Lan (QA lead) on your PR — Request changes

line 33  nit: "q" is a bit short — could we call it "query"?

line 34  issue: a search with spaces around the word still returns nothing:
         /api/equipment?search=%20oscilloscope%20 → {"count":0,"items":[]}
         Members often paste names with a trailing space. Could we trim it?

line 34  question: lab managers will add Vietnamese names such as "Máy hiện sóng".
         Should "may hien song" find it? Not sure if that is in scope.
`, 'Ba góp ý bạn nhận được (dựng cho lab; output trong góp ý thứ hai là output thật trước khi sửa).');

const LAB_MAU_1 = mau(`
$ git switch -c fix/LAB-232-search-case
Switched to a new branch 'fix/LAB-232-search-case'

$ curl -s 'http://localhost:41813/api/equipment?search=oscilloscope'
{"count":1,"items":[{"id":1,"name":"Oscilloscope Rigol DS1054Z","available":true}]}
$ curl -s 'http://localhost:41813/api/equipment?search=%20oscilloscope%20'
{"count":0,"items":[]}
$ git commit -aq -m 'fix(equipment): make the search case-insensitive' -m 'Members type names in lowercase ("oscilloscope") and got no results.' -m 'Refs: LAB-232'
`, 'Lượt mẫu — output THẬT. Hook im lặng = message đạt. Dòng thứ hai: thử biên trước khi mở PR đã lộ chuyện dấu cách.');

const LAB_MAU_PR = mau(`
Title: fix(equipment): make the search case-insensitive

## Summary
Equipment search compared names case-sensitively, so "oscilloscope" returned
no results. Both the name and the search term are now lowercased.

Closes LAB-232

## How to test
curl -s 'http://localhost:41813/api/equipment?search=oscilloscope'
Expected: count 1 (Oscilloscope Rigol DS1054Z)

## Tested
| search          | Before  | After   |
|-----------------|---------|---------|
| Oscilloscope    | 1 item  | 1 item  |
| oscilloscope    | 0 items | 1 item  |
| OSCILLOSCOPE    | 0 items | 1 item  |

## Not included
- Leading/trailing spaces are not trimmed yet ("%20oscilloscope%20" → 0 items).
- Accent-insensitive search for Vietnamese names is not included.
`);

const LAB_MAU_2 = mau(`
$ git diff
@@ -30,8 +30,8 @@ const server = http.createServer(async (req, res) => {
   try {
     // GET /api/equipment?search=...
     if (req.method === 'GET' && url.pathname === '/api/equipment') {
-      const q = url.searchParams.get('search') || '';
-      const items = equipment.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()));
+      const query = (url.searchParams.get('search') || '').trim().toLowerCase();
+      const items = equipment.filter((e) => e.name.toLowerCase().includes(query));
       return send(res, 200, { count: items.length, items });
     }
     // GET /api/loans?page=1&size=5

$ curl -s 'http://localhost:41813/api/equipment?search=%20oscilloscope%20'
{"count":1,"items":[{"id":1,"name":"Oscilloscope Rigol DS1054Z","available":true}]}
$ curl -s 'http://localhost:41813/api/equipment?search=OSCILLOSCOPE'
{"count":1,"items":[{"id":1,"name":"Oscilloscope Rigol DS1054Z","available":true}]}
$ git commit -aq --fixup=HEAD

$ git log --oneline
6e68bd9 fixup! fix(equipment): make the search case-insensitive
887bba7 fix(equipment): make the search case-insensitive
9c9afe7 feat(loans): add the labflow-mini loan API

$ GIT_SEQUENCE_EDITOR=true git rebase -q -i --autosquash main

$ git log --oneline
4bff8c4 fix(equipment): make the search case-insensitive
9c9afe7 feat(loans): add the labflow-mini loan API

$ git show --stat --format='%h %s%n%n%b' HEAD
4bff8c4 fix(equipment): make the search case-insensitive

Members type names in lowercase ("oscilloscope") and got no results.

Refs: LAB-232


 labflow-mini.mjs | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
`, 'Lượt mẫu — output THẬT (git 2.55.0; bỏ 4 dòng đầu của git diff). GIT_SEQUENCE_EDITOR=true để rebase tương tác chạy không cần mở trình soạn; ở máy bạn có thể bỏ và lưu luôn danh sách.');

const LAB_MAU_TRA_LOI = mau(`
nit (q → query):     Renamed, thanks.
issue (spaces):      Good catch — the search term is now trimmed.
                     " oscilloscope " → 1 item (tested). Squashed into 4bff8c4.
question (accents):  Good question. I think it is out of scope for LAB-232 because it
                     needs a decision on how to store names (e.g. a normalised column).
                     I created LAB-241 "Make equipment search accent-insensitive" with
                     your example. Does that work for you?
PR comment:          All comments addressed, PTAL. Force-pushed after squashing the fixup
                     (git push --force-with-lease).
`);

const L34 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Lab' : 'Chương 3 · Lab'}</span>
<h2>${en ? '3.4 — Lab: one complete PR in English' : '3.4 — Lab: một PR trọn vẹn bằng tiếng Anh'}</h2>
<p class="lead">${en
    ? 'One full loop, exactly as at work: a ticket, a branch, a commit that passes the hook, a PR description, three review comments, your replies, a fixup commit squashed before merge. You fix bug #1 from Chapter 2 (case-sensitive search) in a real Git repository. Time: about 90 minutes.'
    : 'Một vòng trọn vẹn, đúng như khi đi làm: ticket, nhánh, commit qua được hook, mô tả PR, ba góp ý review, lời trả lời của bạn, một commit fixup được gộp trước khi merge. Bạn sửa lỗi #1 của Chương 2 (tìm kiếm phân biệt hoa thường) trong một repo Git thật. Thời gian: khoảng 90 phút.'}</p>

<h3>${en ? 'Ticket' : 'Ticket'}</h3>
${mau(`
LAB-232  Equipment search: results are case-sensitive ("oscilloscope" returns 0 items)
Severity: Minor · Priority: P3 · Reporter: Hà (QA)
`)}

<h3>${en ? 'Step 0 — set up the repository (10 minutes)' : 'Bước 0 — dựng repo (10 phút)'}</h3>
<p>${en ? 'You need Git, Node 18+ (or Docker, as in lab 2.4), <code>labflow-mini.mjs</code> from lab 2.4 and the <code>commit-msg</code> hook from lesson 3.1 in the parent folder.' : 'Cần Git, Node 18+ (hoặc Docker như lab 2.4), tệp <code>labflow-mini.mjs</code> ở lab 2.4 và hook <code>commit-msg</code> ở bài 3.1 đặt ở thư mục cha.'}</p>
${LAB_SETUP}

<h3>${en ? 'Step 1 — branch, fix, commit (20 minutes)' : 'Bước 1 — tạo nhánh, sửa, commit (20 phút)'}</h3>
<ol>
<li>${en ? 'Create a branch named after the ticket.' : 'Tạo nhánh đặt tên theo ticket.'}</li>
<li>${en ? 'Make the search case-insensitive (one line). Restart the server.' : 'Cho tìm kiếm không phân biệt hoa thường (một dòng). Khởi động lại máy chủ.'}</li>
<li>${en ? 'Test with at least three inputs, including one edge case you choose yourself.' : 'Thử ít nhất ba đầu vào, trong đó có một trường hợp biên do bạn tự chọn.'}</li>
<li>${en ? 'Commit with a Conventional Commits message, a body with the reason, and a <code>Refs:</code> trailer. The hook must accept it on the first or second try.' : 'Commit theo Conventional Commits, có thân nói lý do và trailer <code>Refs:</code>. Hook phải nhận ở lần thứ nhất hoặc thứ hai.'}</li>
</ol>
<details><summary>${en ? 'Reference run (real output)' : 'Lượt mẫu (output thật)'}</summary>${LAB_MAU_1}</details>

<h3>${en ? 'Step 2 — write the PR description (20 minutes)' : 'Bước 2 — viết mô tả PR (20 phút)'}</h3>
<p>${en ? 'Use the sections of lesson 3.2. If you found an edge case that is not fixed, put it under "Not included" — do not hide it. (If you push to GitHub, use a private repository of your own.)' : 'Dùng các phần của bài 3.2. Nếu tìm ra trường hợp biên chưa sửa, ghi vào "Not included" — đừng giấu. (Nếu đẩy lên GitHub, dùng repo riêng tư của bạn.)'}</p>
<details><summary>${en ? 'Model PR description' : 'Mô tả PR mẫu'}</summary>${LAB_MAU_PR}</details>

<h3>${en ? 'Step 3 — receive the review (5 minutes)' : 'Bước 3 — nhận review (5 phút)'}</h3>
${LAB_REVIEW}

<h3>${en ? 'Step 4 — address it: fixup commit, squash, reply (25 minutes)' : 'Bước 4 — xử lý: commit fixup, gộp, trả lời (25 phút)'}</h3>
<ol>
<li>${en ? 'Change the code for the nit and the issue. Test again with spaces and with capitals.' : 'Sửa mã cho góp ý nit và issue. Thử lại với dấu cách và chữ hoa.'}</li>
<li>${en ? 'Commit with <code>git commit -a --fixup=HEAD</code> (the hook lets <code>fixup!</code> through), then squash it into the original commit with <code>git rebase -i --autosquash main</code>.' : 'Commit bằng <code>git commit -a --fixup=HEAD</code> (hook cho <code>fixup!</code> đi qua), rồi gộp vào commit gốc bằng <code>git rebase -i --autosquash main</code>.'}</li>
<li>${en ? 'Write one reply per comment. The question about accents is a scope decision: answer it with a follow-up ticket, not with more code.' : 'Viết một câu trả lời cho mỗi góp ý. Câu hỏi về dấu tiếng Việt là quyết định phạm vi: trả lời bằng một ticket follow-up, không phải viết thêm mã.'}</li>
</ol>
<details><summary>${en ? 'Reference run (real output) and model replies' : 'Lượt mẫu (output thật) và câu trả lời mẫu'}</summary>
${LAB_MAU_2}
${LAB_MAU_TRA_LOI}
<p>${en
    ? 'Why squash: the reviewer saw the fixup separately (easy to review), but <code>main</code> receives one clean commit. Because the rebase rewrote the branch, a push needs <code>--force-with-lease</code>, which refuses to overwrite commits someone else pushed in the meantime (Git course 8.2).'
    : 'Vì sao gộp: người review thấy riêng phần fixup (dễ review), nhưng <code>main</code> nhận một commit sạch. Vì rebase đã viết lại nhánh, lúc push cần <code>--force-with-lease</code> — lệnh này từ chối ghi đè nếu có người khác vừa đẩy commit lên (khoá Git bài 8.2).'}</p>
</details>

<h3>${en ? 'Step 5 — clean up' : 'Bước 5 — dọn dẹp'}</h3>
<p>${en ? 'Stop the server with Ctrl+C. Keep the repository: you will reuse it in the capstone (Chapter 8).' : 'Dừng máy chủ bằng Ctrl+C. Giữ lại repo: bạn sẽ dùng lại ở dự án cuối khoá (Chương 8).'}</p>

<h3>${en ? 'Self-grading rubric (10 points)' : 'Rubric tự chấm (10 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Commit passes the hook: type(scope), imperative, ≤ 72, body with the reason, Refs trailer' : 'Commit qua hook: type(scope), mệnh lệnh, ≤ 72, thân có lý do, trailer Refs'}</td><td>2</td></tr>
<tr><td>${en ? 'PR: summary (problem + solution), Closes, How to test that someone else can run' : 'PR: summary (vấn đề + giải pháp), Closes, How to test người khác chạy được'}</td><td>2</td></tr>
<tr><td>${en ? 'PR: before/after evidence and an honest "Not included"' : 'PR: bằng chứng trước/sau và mục "Not included" trung thực'}</td><td>2</td></tr>
<tr><td>${en ? 'Fixup committed and squashed; final history has one commit for LAB-232' : 'Đã commit fixup và gộp; lịch sử cuối còn một commit cho LAB-232'}</td><td>1</td></tr>
<tr><td>${en ? 'One reply per comment; agreement with evidence; scope question answered with a ticket' : 'Mỗi góp ý một câu trả lời; đồng ý kèm bằng chứng; câu hỏi phạm vi trả lời bằng ticket'}</td><td>2</td></tr>
<tr><td>${en ? 'No grammar errors in titles (imperative, articles, uncountable nouns)' : 'Không lỗi ngữ pháp ở tiêu đề (mệnh lệnh, mạo từ, danh từ không đếm được)'}</td><td>1</td></tr>
</tbody>
</table>
<div class="callout ok"><p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you score at least 8/10, <code>git log --oneline main..HEAD</code> shows exactly one commit, and a reader who sees only your PR page understands what changed, why, how it was tested and what is left. Challenge: add a <code>node --test</code> test for the search before the fix (it should fail) and after (it should pass), and mention it in "Tested".' : 'bạn đạt ít nhất 8/10, <code>git log --oneline main..HEAD</code> còn đúng một commit, và người chỉ xem trang PR của bạn hiểu được đổi gì, vì sao, đã kiểm thế nào và còn thiếu gì. Thử thách thêm: viết một test <code>node --test</code> cho tìm kiếm trước khi sửa (phải đỏ) và sau khi sửa (phải xanh), rồi ghi vào "Tested".'}</p></div>

<h3>🎤 ${en ? 'Interviewers will ask (answer in English, 30–60 seconds each)' : 'Phỏng vấn viên sẽ hỏi (trả lời bằng tiếng Anh, mỗi câu 30–60 giây)'}</h3>
<p>${en ? 'Git and code-review questions appear in almost every intern interview. Say your answer aloud first, then open the model.' : 'Câu hỏi về Git và code review có mặt ở gần như mọi buổi phỏng vấn thực tập. Nói to câu trả lời trước, rồi mới mở đáp án mẫu.'}</p>
<ol>
<li><strong>"How do you write a good commit message?"</strong>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
I keep one logical change per commit. The subject line is short, under about
50 characters, in the imperative mood, like "Fix the pagination of the loan list".
Our team uses Conventional Commits, so it starts with a type such as "fix" or
"feat". Then a blank line, and a body that explains why the change was needed,
plus the ticket number.
`)}</details></li>
<li><strong>"What do you put in a pull request description?"</strong>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
A short summary of the problem and the solution, a link to the ticket, steps so the
reviewer can test it, the evidence that I tested it — for example a before-and-after
table or screenshots — and any risks or things I did not include. I try to keep PRs
small so they are easy to review.
`)}</details></li>
<li><strong>"A reviewer asks for a change you disagree with. What do you do?"</strong>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
First I make sure I understand the reason, so I ask a question if needed. If I still
disagree, I explain my reason with facts, for example a measurement, and I say I am
happy to change it if they feel strongly. If it is a bigger design question, we
discuss it in a call or create a follow-up ticket instead of blocking the PR.
`)}</details></li>
<li><strong>"What do you look for when you review someone else’s code?"</strong>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
First, does it do what the ticket asks, including edge cases. Then readability and
naming, tests, and security issues such as SQL injection or secrets in the code.
I label small things as "nit" so the author knows they are optional, and I also
point out what is good.
`)}</details></li>
<li><strong>"Tell me about feedback you received in a code review."</strong> ${en ? '(STAR; the lab is a valid story)' : '(STAR; chính lab này là câu chuyện dùng được)'}
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
In a practice project I fixed a search that was case-sensitive. The reviewer found
that a search with a space at the end still returned nothing. I had not tested that
case. I added trimming, tested it, and squashed the fix into my commit. Since then I
always test a few edge cases, like spaces and empty input, before I ask for a review.
`)}</details></li>
</ol>
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-5-1-git', '🎤', en ? 'Interview prep 5.1 — Git questions' : 'Chuẩn bị phỏng vấn 5.1 — Câu hỏi về Git', en ? 'The technical side: merge vs rebase, reset vs revert, conflicts.' : 'Phần kỹ thuật: merge vs rebase, reset vs revert, xung đột.')}
</div>
`;

/* ═════════════ 3.5 — Quiz chương 3 ═════════════ */
const QUIZ3 = [
  Q('tak3-1', 'Which commit subject follows the imperative rule?|||Tiêu đề commit nào đúng thể mệnh lệnh?', [
    'Fixed the pagination of the loan list|||Fixed the pagination of the loan list',
    'Fixing pagination|||Fixing pagination',
    'Return the requested page in GET /api/loans|||Return the requested page in GET /api/loans',
    'Pagination fix.|||Pagination fix.',
  ], 2, '"If applied, this commit will return the requested page…" Lesson 3.1.|||"If applied, this commit will return the requested page…" Bài 3.1.'),
  Q('tak3-2', 'What separates the subject from the body of a commit message?|||Cái gì ngăn cách tiêu đề và thân commit message?', [
    'A period|||Một dấu chấm',
    'A blank line|||Một dòng trống',
    'A colon|||Dấu hai chấm',
    'Nothing — write one long line|||Không gì — viết một dòng dài',
  ], 1, 'git-commit(1) DISCUSSION and rule 1. Lesson 3.1.|||git-commit(1) mục DISCUSSION và luật 1. Bài 3.1.'),
  Q('tak3-3', 'Under Conventional Commits and SemVer, which commit leads to a MAJOR version?|||Theo Conventional Commits và SemVer, commit nào dẫn tới bản MAJOR?', [
    'fix(loans): allow 7 days|||fix(loans): allow 7 days',
    'feat(loans): add CSV export|||feat(loans): add CSV export',
    'feat(api)!: rename the days field to periodDays|||feat(api)!: rename the days field to periodDays',
    'docs: update the README|||docs: update the README',
  ], 2, '"!" or a BREAKING CHANGE footer ⇒ MAJOR; feat ⇒ MINOR; fix ⇒ PATCH. Lesson 3.1.|||"!" hoặc footer BREAKING CHANGE ⇒ MAJOR; feat ⇒ MINOR; fix ⇒ PATCH. Bài 3.1.'),
  Q('tak3-4', 'You committed a .env file with a database password, then deleted it in the next commit. Is the password safe?|||Bạn lỡ commit tệp .env chứa mật khẩu DB, rồi xoá ở commit sau. Mật khẩu đã an toàn chưa?', [
    'Yes, the file is deleted|||Rồi, tệp đã bị xoá',
    'No — it stays in history; rotate the password first, then clean the history|||Chưa — nó vẫn nằm trong lịch sử; đổi mật khẩu trước, rồi dọn lịch sử',
    'Yes, if the repository is private|||Rồi, nếu repo riêng tư',
    'Yes, if you amend the commit message|||Rồi, nếu sửa commit message',
  ], 1, 'Uber 2016: credentials found in a private GitHub repository. Lesson 3.1, Git course 8.3.|||Uber 2016: thông tin đăng nhập tìm thấy trong repo GitHub riêng tư. Bài 3.1, khoá Git 8.3.'),
  Q('tak3-5', 'Which PR section is the one most people forget, and builds the most trust?|||Phần nào của PR hay bị quên nhất mà lại tạo lòng tin nhất?', [
    'The title|||Tiêu đề',
    'Risks / not included — known problems you did not fix|||Rủi ro / chưa làm — vấn đề đã biết mà bạn chưa sửa',
    'The list of files|||Danh sách tệp',
    'A thank-you message|||Lời cảm ơn',
  ], 1, 'Example: page=-1 returns loans 3–7, declared as LAB-238. Lesson 3.2.|||Ví dụ: page=-1 trả phiếu 3–7, khai báo thành LAB-238. Bài 3.2.'),
  Q('tak3-6', 'On GitHub, which line in a PR description closes issue #12 automatically when the PR is merged into the default branch?|||Trên GitHub, dòng nào trong mô tả PR tự đóng issue #12 khi PR được merge vào nhánh mặc định?', [
    'Refs #12|||Refs #12',
    'See #12|||See #12',
    'Fixes #12|||Fixes #12',
    'About #12|||About #12',
  ], 2, 'close/closes/closed, fix/fixes/fixed, resolve/resolves/resolved. Lesson 3.2.|||close/closes/closed, fix/fixes/fixed, resolve/resolves/resolved. Bài 3.2.'),
  Q('tak3-7', 'Which review comment is the best?|||Bình luận review nào tốt nhất?', [
    'Wrong.|||Wrong.',
    'Why you do this?|||Why you do this?',
    'issue: page=-1 returns loans 3–7. Should we return 400 for page < 1?|||issue: page=-1 returns loans 3–7. Should we return 400 for page < 1?',
    'You forgot validation again.|||You forgot validation again.',
  ], 2, 'Label + what + evidence + proposal, about the code not the person. Lesson 3.3.|||Nhãn + cái gì + bằng chứng + đề xuất, nói về mã không nói về người. Bài 3.3.'),
  Q('tak3-8', 'A reviewer writes "nit: extra blank line". What does "nit" tell you?|||Người review viết "nit: extra blank line". "nit" cho bạn biết gì?', [
    'The PR is blocked until you fix it|||PR bị chặn tới khi sửa',
    'It is a very small, non-blocking comment|||Góp ý rất nhỏ, không chặn',
    'The code has a security bug|||Mã có lỗi bảo mật',
    'The reviewer approved|||Người review đã duyệt',
  ], 1, 'Google eng-practices: label severity (Nit, Optional, FYI). Lesson 3.3.|||Google eng-practices: gắn mức độ (Nit, Optional, FYI). Bài 3.3.'),
  Q('tak3-9', 'You disagree with a suggestion. Which reply is best?|||Bạn không đồng ý với một gợi ý. Câu trả lời nào tốt nhất?', [
    'No.|||No.',
    'OK I will change (but you don’t change it)|||OK I will change (nhưng không sửa)',
    'I’d prefer to keep it because the endpoint takes 40 ms today. Happy to revisit after the load test — what do you think?|||I’d prefer to keep it because the endpoint takes 40 ms today. Happy to revisit after the load test — what do you think?',
    'Sorry sorry, my code is bad|||Sorry sorry, my code is bad',
  ], 2, 'Reason + number + open door. Lesson 3.3.|||Lý do + con số + lối mở. Bài 3.3.'),
  Q('tak3-10', 'What is the main lesson of the xz-utils backdoor (2024) for reviewers?|||Bài học chính của cửa hậu xz-utils (2024) cho người review là gì?', [
    'Only review code written by strangers|||Chỉ review mã của người lạ',
    'A commit message and polite English are claims, not proof — read the actual diff and what is shipped|||Commit message và tiếng Anh lịch sự là lời khẳng định, không phải bằng chứng — đọc diff thật và thứ được phát hành',
    'Never use compression libraries|||Đừng bao giờ dùng thư viện nén',
    'Merge faster when maintainers are slow|||Merge nhanh hơn khi người bảo trì chậm',
  ], 1, 'The payload hid in "test files" and in release tarballs; social pressure pushed for a new maintainer. Lesson 3.3.|||Mã độc giấu trong "tệp test" và trong tarball phát hành; áp lực xã hội đẩy việc thêm người bảo trì. Bài 3.3.'),
];

export default {
  title: 'Chapter 3 — Commit messages, pull requests and code review|||Chương 3 — Commit message, pull request và code review',
  description: 'Tiếng Anh được đọc nhiều nhất khi đi làm: commit message (7 luật, thể mệnh lệnh, Conventional Commits, hook tự viết chạy thật), mô tả PR có bằng chứng và rủi ro, bình luận review có nhãn và lịch sự, lab một PR trọn vẹn trên repo Git thật.',
  lessons: [
    { title: '3.1 — Commit messages: imperative mood, the 50/72 rule, Conventional Commits|||3.1 — Commit message: thể mệnh lệnh, quy tắc 50/72, Conventional Commits', slug: 'tak-3-1-commit', type: 'LESSON', isFreePreview: true, description: 'Lịch sử commit xấu thật, bảy luật của Chris Beams + git-commit(1), phép thử "If applied, this commit will…", Conventional Commits 1.0.0 và SemVer, trailer, hook commit-msg tự viết chặn ba message xấu (output thật), góc hacker Uber 2016, bài viết lại tám message.', content: L31(true) + L31(false) },
    { title: '3.2 — Pull request descriptions: summary, why, how it was tested, screenshots, risks|||3.2 — Mô tả pull request: tóm tắt, vì sao, đã kiểm thế nào, ảnh chụp, rủi ro', slug: 'tak-3-2-pr', type: 'LESSON', isFreePreview: true, description: 'Gom bằng chứng bằng lệnh thật (git show --stat, thử biên tìm ra page=-1 trả phiếu 3–7), mô tả PR trước/sau, các phần và câu mở, từ khoá tự đóng issue của GitHub, PR nhỏ (Google Small CLs), PR nháp, nhờ review, bài viết PR cho lỗi 7 ngày.', content: L32(true) + L32(false) },
    { title: '3.3 — Polite and clear review comments: suggestions, questions, nits, approval|||3.3 — Bình luận review lịch sự và rõ ràng: gợi ý, câu hỏi, nit, chấp thuận', slug: 'tak-3-3-review', type: 'LESSON', isFreePreview: true, description: 'Review một diff thật bằng nhãn Conventional Comments, tiền tố Nit/Optional/FYI của Google, câu làm mềm, nhận review và không đồng ý lịch sự, LGTM/PTAL, trạng thái review GitHub, cách nói gián tiếp của khách Nhật, góc hacker xz-utils 2024.', content: L33(true) + L33(false) },
    { title: '3.4 — Lab: one complete PR in English|||3.4 — Lab: một PR trọn vẹn bằng tiếng Anh', slug: 'tak-3-4-lab', type: 'LESSON', isFreePreview: true, description: 'Repo Git thật + hook: nhánh theo ticket, sửa tìm kiếm, commit qua hook, mô tả PR, ba góp ý review, commit fixup + rebase --autosquash (output thật), trả lời góp ý, rubric 10 điểm, năm câu phỏng vấn tiếng Anh về Git và review.', content: L34(true) + L34(false) },
    {
      title: '3.5 — Chapter 3 quiz|||3.5 — Kiểm tra Chương 3',
      slug: 'tak-3-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: thể mệnh lệnh, dòng trống, SemVer từ Conventional Commits, bí mật trong lịch sử, phần rủi ro của PR, từ khoá đóng issue, bình luận review tốt, nit, không đồng ý lịch sự, bài học xz-utils.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions built from the commits, PRs and reviews of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu dựng từ chính các commit, PR và review trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ3 },
    },
  ],
};
