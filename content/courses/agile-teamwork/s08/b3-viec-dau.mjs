/**
 * 8.3 — Những ticket đầu tiên (agl-8-3-viec-dau — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Ranh giới: PR tốt/nhỏ ⇒ agl-3-2; nhận review ⇒ agl-4-3; sửa tối thiểu trong code cũ ⇒ lgc-8-2; báo trễ tiếng Anh ⇒ tak-4-3;
 * báo cáo ngày ⇒ agl-9-7. Bài này dạy vòng đời ticket ĐẦU TIÊN của người mới: nhận → làm rõ → test đỏ → sửa tối thiểu → tự soát → báo tiến độ.
 * Lab THẬT (scratchpad/agt/lab/ch8/cong-ty + phan-83.sh): repo lich-hen-api dựng bằng lam-ticket.sh (tên/ngày commit cố định), LH-212 làm hai cách:
 * bản vội (đổi tên hàm ⇒ CI đỏ ở bước nạp module, nhánh "fix" chặn "fix/…") vs bản chắc (test đỏ dcd/e5d… ⇒ sửa 4 dòng ⇒ xanh);
 * kiem-pr-dau.mjs: 7 mục trượt vs sẵn sàng.
 * Sự cố thật: Knight Capital 01/08/2012 (cờ cũ bị dùng lại + mã chết Power Peg, một trên tám máy chủ, ~45 phút, lỗ 440 triệu USD) — Wikipedia, dẫn lệnh SEC 34-70694.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L83 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 8 · Lesson 8.3', 'Chương 8 · Bài 8.3', `
<h2>${t('8.3 — Your first tickets', '8.3 — Những ticket đầu tiên')}</h2>
<p class="lead">${t(
    'Your first tickets are small on purpose. Nobody is testing whether you can write a sort function; the team is learning whether you deliver what was asked, the way the team works, when you said you would — and whether they can stop double-checking you. This lesson runs one real first ticket twice: the hurried way most freshers do it, and the small-and-sure way, with a script that checks your PR against the team’s rules before a human has to.',
    'Ticket đầu tiên nhỏ là có chủ ý. Không ai kiểm xem bạn có viết được hàm sắp xếp không; cả đội đang học xem bạn có giao đúng thứ được yêu cầu, đúng cách đội làm việc, đúng lúc bạn đã hứa không — và họ có thể thôi soát lại việc của bạn chưa. Bài này làm một ticket đầu tiên thật hai lần: cách vội mà nhiều fresher hay làm, và cách nhỏ mà chắc, kèm một script soát PR của bạn theo luật của đội trước khi người thật phải soát.')}</p>

<h3>${t('Everyday picture: the apprentice and the hinge', 'Liên tưởng đời thường: thợ học việc và cái bản lề')}</h3>
<p>${t(
    'In a carpentry workshop the apprentice is first asked to replace a squeaky hinge. One apprentice also "improves" the door — planes the edge, changes the handle — and the door no longer closes. Another replaces exactly the hinge, opens and closes the door ten times in front of the master, and says "done, it was a bent pin". The second one gets the next door.',
    'Ở xưởng mộc, thợ học việc đầu tiên được giao thay một cái bản lề kêu cót két. Một người tiện tay "cải tiến" luôn cánh cửa — bào mép, đổi tay nắm — và cửa không đóng được nữa. Người kia thay đúng cái bản lề, mở đóng mười lần trước mặt thợ cả, và nói "xong rồi, chốt bị cong". Người thứ hai được giao cánh cửa tiếp theo.')}</p>

<h3>${t('Before writing code: four questions', 'Trước khi viết code: bốn câu hỏi')}</h3>
${bang([t('Question', 'Câu hỏi'), t('Why', 'Vì sao'), t('Where the answer goes', 'Câu trả lời ghi ở đâu')], [
    [t('What exactly is "done"? (acceptance criteria)', '"Xong" chính xác là gì? (tiêu chí chấp nhận)'), t('A ticket without AC is a guess; ask before, not after (lesson 2.1)', 'Ticket không có tiêu chí là đoán mò; hỏi trước, đừng hỏi sau (bài 2.1)'), t('A comment in the ticket', 'Bình luận trong ticket')],
    [t('Can I reproduce it?', 'Mình tái hiện được không?'), t('A bug you cannot reproduce you cannot prove fixed', 'Bug không tái hiện được thì không chứng minh được đã sửa'), t('A failing test', 'Một test đỏ')],
    [t('What else calls this code?', 'Còn chỗ nào gọi đoạn mã này?'), t('Your change must not break callers you did not read', 'Thay đổi của bạn không được làm hỏng nơi gọi mà bạn chưa đọc'), t('Find usages / <code>git grep</code>', 'Find Usages / <code>git grep</code>')],
    [t('How long, and when will I report?', 'Mất bao lâu, khi nào mình báo?'), t('Your estimate is a promise; a checkpoint lets you warn early', 'Ước lượng là lời hứa; mốc kiểm cho phép bạn báo sớm'), t('Ticket estimate + daily report', 'Ước lượng trong ticket + báo cáo ngày')],
  ])}

<h3>${t('Lab: LH-212, done twice', 'Lab: LH-212, làm hai lần')}</h3>
<p>${t('The ticket and the team’s rules (repo <code>lich-hen-api</code>, built by <code>lam-ticket.sh</code> with fixed names and dates so the hashes are reproducible):', 'Ticket và luật của đội (repo <code>lich-hen-api</code>, dựng bằng <code>lam-ticket.sh</code> với tên và ngày cố định nên hash lặp lại được):')}</p>
${out(MA.ticket)}
${out(MA.contributing)}
${js(MA.goc)}
${bash(MA.ci)}
<p>${t('Note the first CI step: it imports every module, so a missing export fails the build even if no test covers it.', 'Để ý bước đầu của CI: nó nạp thử mọi module, nên thiếu một export là build hỏng dù không test nào chạm tới.')}</p>

<h4>${t('Attempt A — the hurried way', 'Cách A — cách vội')}</h4>
<p>${t('Late afternoon, the fresher fixes the comparison, and while there renames everything to English and reformats the file. One commit, "fix bug", on a branch called <code>fix</code>:', 'Chiều muộn, fresher sửa phép so sánh, và tiện tay đổi hết tên sang tiếng Anh, định dạng lại cả tệp. Một commit "fix bug", trên nhánh tên <code>fix</code>:')}</p>
${js(MA.v1)}
${out(RA.ciVoi)}
<p>${t(
    'The sort is now correct — and the build is red, because <code>routes.mjs</code> still imports <code>topChoLau</code>. The ticket said "do not change the shape of GET /bao-cao/cho-lau"; renaming a public function is exactly that kind of change. The tie bug from lesson 8.2 (<code>ds.find</code> repeats one visit) is also still there, because nothing tests it. And the branch name has one more trap, which appears the moment anyone follows the convention:',
    'Phép sắp xếp giờ đã đúng — và build đỏ, vì <code>routes.mjs</code> vẫn import <code>topChoLau</code>. Ticket ghi "không đổi dạng dữ liệu trả về của GET /bao-cao/cho-lau"; đổi tên hàm công khai chính là loại thay đổi đó. Lỗi trùng phút ở bài 8.2 (<code>ds.find</code> lặp một lượt) vẫn còn, vì không có test nào chạm tới. Và tên nhánh còn một cái bẫy nữa, lộ ra ngay khi có người làm đúng quy ước:')}</p>
${out(RA.gitDf)}
<p>${t('Git stores branches as paths under <code>refs/heads/</code>; a branch named <code>fix</code> is a file, so <code>fix/LH-212-…</code> cannot be a directory next to it. One lazy name blocks a whole naming scheme for everybody who fetches it.', 'Git lưu nhánh như đường dẫn dưới <code>refs/heads/</code>; nhánh tên <code>fix</code> là một tệp, nên <code>fix/LH-212-…</code> không thể là thư mục cạnh nó. Một cái tên lười chặn cả quy ước đặt tên của mọi người fetch về.')}</p>

<h4>${t('Attempt B — small and sure', 'Cách B — nhỏ mà chắc')}</h4>
<p>${t('Step 1: write the tests from the acceptance criteria and commit them first. They must fail on the current code — otherwise they do not prove anything:', 'Bước 1: viết test từ tiêu chí chấp nhận và commit chúng trước. Chúng phải ĐỎ trên mã hiện tại — nếu không chúng chẳng chứng minh được gì:')}</p>
${js(MA.testV2)}
${out(RA.ciDo)}
<p>${t('Both bugs show up with exact values: <code>A D</code> instead of <code>C B</code> (string sort), <code>C A</code> instead of <code>A B</code> (ties). Step 2: the smallest change that turns them green:', 'Cả hai lỗi hiện rõ bằng giá trị cụ thể: <code>A D</code> thay vì <code>C B</code> (xếp theo chuỗi), <code>C A</code> thay vì <code>A B</code> (trùng phút). Bước 2: thay đổi nhỏ nhất làm chúng xanh:')}</p>
${out(RA.diffChac)}
${out(RA.ciXanh)}
${out(RA.diffStat)}
${out(RA.lamTicket)}
<p>${t(
    'Four lines of production code instead of fifteen; the function keeps its name, so nothing else had to change; three tests that will stop anyone from reintroducing the bug. The comment says <em>why</em> (string comparison), which the next reader cannot see from the code. Minimal changes in unfamiliar code are a skill of their own — see ',
    'Bốn dòng mã sản phẩm thay vì mười lăm; hàm giữ tên nên không chỗ nào khác phải đổi; ba test sẽ chặn bất kỳ ai làm lỗi quay lại. Chú thích nói <em>vì sao</em> (so theo chuỗi), điều người đọc sau không thấy được từ mã. Sửa tối thiểu trong mã lạ là một kỹ năng riêng — xem ')}${cs('doc-code-cu-va-refactor', 'lgc-8-2-sua-toi-thieu', t('Legacy 8.2', 'Code cũ 8.2'))}${t('. Renaming and reformatting are fine — as their own ticket and their own PR.', '. Đổi tên và định dạng lại không sai — khi là ticket riêng và PR riêng.')}</p>

<h3>${t('Check your own PR before asking a human', 'Tự soát PR trước khi nhờ người')}</h3>
<p>${t('Each rule of CONTRIBUTING becomes a check. The script also checks out the first test commit in a temporary worktree and runs CI there — it must be red:', 'Mỗi luật của CONTRIBUTING thành một phép kiểm. Script còn lấy commit test đầu tiên ra một worktree tạm và chạy CI ở đó — phải ĐỎ:')}</p>
${js(MA.kiemPr)}
${out(RA.prVoi)}
${out(RA.prChac)}
${out('── pr.md (bản vội)\n' + MA.prV1 + '\n── pr.md (bản chắc)\n' + MA.prV2)}
<p>${t(
    'Seven failures versus none. Note the one check the hurried PR passed: "diff ≤ 40 lines" — 15 lines is small, and still wrong. Size is necessary, not sufficient. And the check "test red before the fix" is what separates a test that proves the fix from a test written to pass. Writing PRs that are easy to review: ', 'Bảy mục trượt so với không mục nào. Để ý mục duy nhất PR vội qua được: "diff ≤ 40 dòng" — 15 dòng là nhỏ, mà vẫn sai. Nhỏ là cần, chưa đủ. Còn mục "test đỏ trước khi sửa" là thứ phân biệt test chứng minh bản sửa với test viết ra để qua. Viết PR dễ review: ')}${ag('agl-3-2-pr-tot', '3.2')}; ${t('receiving the review that follows: ', 'nhận review sau đó: ')}${ag('agl-4-3-nhan-review', '4.3')}.</p>

<h3>${t('Delivering on time: the checkpoint at half the estimate', 'Giao đúng hạn: mốc kiểm ở nửa ước lượng')}</h3>
<p>${t('LH-212 is 2 points ≈ one working day for this team. A timeline that keeps promises:', 'LH-212 là 2 điểm ≈ một ngày làm việc với đội này. Một lịch giữ được lời hứa:')}</p>
${bang([t('When', 'Khi nào'), t('Do', 'Làm'), t('Say', 'Nói')], [
    ['09:00', t('Read ticket, find callers (<code>git grep topChoLau</code>), ask about ties', 'Đọc ticket, tìm nơi gọi (<code>git grep topChoLau</code>), hỏi về trường hợp trùng phút'), t('Standup: "LH-212 today, PR by 15:00"', 'Daily: "Hôm nay LH-212, PR trước 15:00"')],
    ['10:15', t('Tests committed, red', 'Commit test, đỏ'), '—'],
    [t('12:00 (half)', '12:00 (nửa)'), t('Checkpoint: fixed and green?', 'Mốc kiểm: đã sửa và xanh chưa?'), t('If not: "LH-212 needs until tomorrow 10:00 because …" — now, not at 17:00', 'Nếu chưa: "LH-212 cần tới 10:00 mai vì …" — ngay lúc đó, không đợi 17:00')],
    ['14:30', t('kiem-pr-dau.mjs passes; self-review the diff on the PR page', 'kiem-pr-dau.mjs đạt; tự đọc diff trên trang PR'), t('Ask a reviewer by name, link the ticket', 'Nhờ đích danh người review, gắn liên kết ticket')],
    [t('Next day', 'Hôm sau'), t('Answer review, merge, check on staging with the manager’s data', 'Trả lời review, merge, kiểm trên staging với dữ liệu của chị quản lý'), t('Close the ticket with what was verified', 'Đóng ticket kèm điều đã kiểm')],
  ])}
${cl('tip', `<p>${t(
    '<strong>"Done" means merged and verified, not "code finished".</strong> A newcomer who says "almost done" for three days loses more trust than one who says on day one at noon "this is bigger than I thought: two more hours, here is why". How to say it in English: ',
    '<strong>"Xong" nghĩa là đã merge và đã kiểm, không phải "code xong rồi".</strong> Người mới nói "sắp xong" ba ngày liền mất lòng tin nhiều hơn người nói lúc 12 giờ ngày đầu "việc này lớn hơn em nghĩ: thêm hai tiếng, lý do là…". Nói bằng tiếng Anh: ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-4-3-bao-tre', t('Technical English 4.3', 'Tiếng Anh kỹ thuật 4.3'))}; ${t('in the outsourcing daily report: ', 'trong báo cáo ngày kiểu outsourcing: ')}${ag('agl-9-7-bao-cao-hourensou', '9.7')}.</p>`)}

<h3>🕵️ ${t('A real case: what "while I’m here" can cost (Knight Capital, 2012)', 'Chuyện thật: "tiện tay" có thể tốn bao nhiêu (Knight Capital, 2012)')}</h3>
<p>${t(
    'On 1 August 2012 Knight Capital, then the largest trader in US equities, deployed new code for a retail liquidity programme. The new code <em>reused</em> a flag that years earlier had switched on an old function, "Power Peg", whose code had never been removed. A technician did not copy the new code to one of the eight servers. On that server the reused flag woke up the dead code, which sent orders without ever recording them as filled: about 4 million executions in roughly 45 minutes, a pre-tax loss of about 440 million dollars, and the company had to be rescued and was sold within months (',
    'Ngày 01/08/2012, Knight Capital, khi đó là bên giao dịch cổ phiếu Mỹ lớn nhất, triển khai mã mới cho một chương trình thanh khoản bán lẻ. Mã mới <em>dùng lại</em> một cờ mà nhiều năm trước từng bật một chức năng cũ, "Power Peg", có mã chưa bao giờ được xoá. Một kỹ thuật viên quên chép mã mới lên một trong tám máy chủ. Trên máy đó, cờ được dùng lại đánh thức mã chết, và mã này gửi lệnh mà không bao giờ ghi nhận đã khớp: khoảng 4 triệu lần khớp lệnh trong chừng 45 phút, lỗ trước thuế khoảng 440 triệu USD, công ty phải được cứu và bị bán trong vài tháng (')}${ng('https://en.wikipedia.org/wiki/Knight_Capital_Group', 'Wikipedia: Knight Capital Group')}${t(', citing the SEC order 34-70694 of 2013).', ', dẫn lệnh SEC 34-70694 năm 2013).')}</p>
<p>${t(
    'Scale it down to your first ticket and the same three habits apply: do not change the meaning of something existing as a side effect (a flag, a function name, a field); remove dead code in its own reviewed change rather than leaving it to be reactivated; and verify the result where it runs, not just on your branch.',
    'Thu nhỏ về ticket đầu tiên của bạn, ba thói quen vẫn y nguyên: không đổi ý nghĩa của thứ đang có như một tác dụng phụ (một cờ, một tên hàm, một trường); xoá mã chết bằng một thay đổi riêng có review thay vì để nó chờ bị đánh thức; và kiểm kết quả ở nơi nó chạy, không chỉ trên nhánh của mình.')}</p>

<h3>${t('At work (OJT, outsourcing)', 'Khi đi làm (OJT, outsourcing)')}</h3>
<p>${t(
    'First tickets at an outsourcing company are often a bug from the customer’s acceptance test or a small change request on one screen. The process adds artefacts the customer pays for: an estimate in hours before you start (', 'Ticket đầu tiên ở công ty outsourcing thường là một bug từ lần nghiệm thu của khách hoặc một thay đổi nhỏ trên một màn. Quy trình thêm những sản phẩm khách trả tiền: ước lượng theo giờ trước khi bắt đầu (')}${ag('agl-9-6-uoc-luong-man-day', '9.6')}${t('), unit test cases with evidence (', '), test case kiểm thử đơn vị kèm bằng chứng (')}${ag('agl-9-4-test-spec', '9.4')}${t(
    '), and a self-review checklist attached to the review request. The checklist is <code>kiem-pr-dau.mjs</code> in spreadsheet form. A fresher whose first three tickets come back from review with zero "forgot the checklist" comments is a fresher who gets real features in month two.',
    '), và một checklist tự review đính kèm khi nhờ review. Checklist đó chính là <code>kiem-pr-dau.mjs</code> dưới dạng bảng tính. Fresher có ba ticket đầu quay về từ review mà không có nhận xét "quên checklist" nào là fresher được giao tính năng thật ở tháng thứ hai.')}</p>

<h3>🧪 ${t('Practice (40 minutes)', 'Thực hành (40 phút)')}</h3>
<ol>
  <li>${t('Write a test that is <em>green</em> on the old code (for example, an empty list returns an empty list), commit it first on a new branch, then the fix. What does <code>kiem-pr-dau.mjs</code> say, and why is that the right verdict?', 'Viết một test <em>xanh</em> ngay trên mã cũ (ví dụ danh sách rỗng trả về danh sách rỗng), commit nó trước trên nhánh mới, rồi mới đến bản sửa. <code>kiem-pr-dau.mjs</code> nói gì, và vì sao đó là phán quyết đúng?')}</li>
  <li>${t('The fresher wants the English names after all. Write the plan: which ticket, which PR, how to rename without breaking <code>routes.mjs</code> and without mixing with LH-212.', 'Fresher vẫn muốn tên tiếng Anh. Viết kế hoạch: ticket nào, PR nào, đổi tên thế nào mà không làm hỏng <code>routes.mjs</code> và không trộn với LH-212.')}</li>
  <li>${t('At 12:00 your tests are still red because of a case you did not expect (two visits with <code>phutCho</code> missing). Write the two-line message you send now.', '12:00 test vẫn đỏ vì một trường hợp không ngờ (hai lượt thiếu <code>phutCho</code>). Viết tin nhắn hai dòng bạn gửi ngay lúc đó.')}</li>
</ol>
${giai(t('Solution hints', 'Gợi ý lời giải'), `<p>${t(
    '1: "test red before the fix … XANH — test không bắt được lỗi": the first test commit passes on unfixed code, so it does not reproduce LH-212. Put the reproducing tests in the first commit. 2: a separate ticket (refactor), after LH-212 is merged; add the new name and keep the old one as an alias (<code>export const topChoLau = getTopWaiting</code>), move callers, then remove the alias in a later PR — every step green. (Our checker only matches <code>export function</code>, so it would wrongly report the alias as "missing: topChoLau" — extend the regex or explain it in the PR; a checklist is a tool, not a judge.) 3: "LH-212: fix for string sort is done, but data from staging has visits without phutCho, which the AC does not cover. Question for the PO: exclude them or put them last? I will continue with the rest; new ETA 10:00 tomorrow."',
    '1: "test đỏ trước khi sửa … XANH — test không bắt được lỗi": commit test đầu tiên qua ngay trên mã chưa sửa, nên nó không tái hiện LH-212. Đặt test tái hiện vào commit đầu. 2: ticket riêng (refactor), sau khi LH-212 merge; thêm tên mới và giữ tên cũ làm bí danh (<code>export const topChoLau = getTopWaiting</code>), chuyển dần nơi gọi, rồi xoá bí danh ở PR sau — bước nào cũng xanh. (Script của ta chỉ khớp <code>export function</code>, nên nó sẽ báo nhầm bí danh là "mất: topChoLau" — mở rộng biểu thức hoặc giải thích trong PR; checklist là công cụ, không phải quan toà.) 3: "LH-212: phần lỗi so chuỗi đã sửa xong, nhưng dữ liệu staging có lượt thiếu phutCho, tiêu chí chưa nói tới. Hỏi PO: bỏ các lượt đó hay xếp cuối? Em làm tiếp phần còn lại; hạn mới 10:00 mai ạ."')}</p>`)}

${phongVan([
    [t('"Tell me about your first ticket at your last team."', '"Kể về ticket đầu tiên của bạn ở đội trước."'), t('A report bug: the "longest waits" list missed a 120-minute visit. I first wrote tests from the acceptance criteria and checked they failed — they showed two bugs, string sorting and duplicated ties. The fix was four lines; I kept the function name because a route depended on it, and ran our PR checklist before asking for review.', 'Một bug báo cáo: danh sách "chờ lâu nhất" sót lượt 120 phút. Tôi viết test từ tiêu chí chấp nhận trước và kiểm chúng đỏ — chúng lộ ra hai lỗi, xếp theo chuỗi và lặp lượt trùng phút. Bản sửa bốn dòng; tôi giữ tên hàm vì có route phụ thuộc, và chạy checklist PR của đội trước khi nhờ review.')],
    [t('"Why should a test fail before the fix?"', '"Vì sao test phải đỏ trước khi sửa?"'), t('Otherwise it does not prove it reproduces the bug — it might pass for unrelated reasons. Red then green is the evidence.', 'Nếu không, nó không chứng minh được là đã tái hiện lỗi — có thể nó qua vì lý do khác. Đỏ rồi xanh mới là bằng chứng.')],
    [t('"You realise a task will take longer than estimated. What do you do?"', '"Bạn nhận ra việc sẽ lâu hơn ước lượng. Bạn làm gì?"'), t('Say it at the checkpoint, not at the deadline: what is done, what is left, why, the new estimate and any decision I need. Early bad news is cheap.', 'Nói ở mốc kiểm, không đợi tới hạn: đã xong gì, còn gì, vì sao, ước lượng mới và quyết định tôi cần. Tin xấu báo sớm thì rẻ.')],
    [t('"Would you refactor code you touch in a bug fix?"', '"Bạn có refactor đoạn mã mình chạm vào khi sửa bug không?"'), t('Not in the same PR. I keep the fix minimal so it is easy to review and revert, and propose the refactor as a separate ticket — renaming a public function in a fix once broke a route import in CI.', 'Không trong cùng PR. Tôi giữ bản sửa tối thiểu cho dễ review và dễ hoàn tác, và đề xuất refactor thành ticket riêng — đổi tên hàm công khai trong một bản sửa từng làm hỏng import của route trên CI.')],
  ], en)}

${thuatNgu([
    [t('acceptance criteria (AC)', 'tiêu chí chấp nhận'), t('The checkable conditions for "done".', 'Các điều kiện kiểm được cho "xong".')],
    [t('red–green', 'đỏ–xanh'), t('A test fails on the old code, passes after the fix.', 'Test đỏ trên mã cũ, xanh sau bản sửa.')],
    [t('minimal change', 'thay đổi tối thiểu'), t('The smallest diff that meets the AC; refactors go separately.', 'Diff nhỏ nhất đạt tiêu chí; refactor tách riêng.')],
    [t('checkpoint', 'mốc kiểm'), t('A planned moment (≈ half the estimate) to decide whether to warn.', 'Thời điểm định trước (≈ nửa ước lượng) để quyết có báo trễ không.')],
    ['git worktree', t('A second working directory of the same repo, used here to run CI on an older commit.', 'Thư mục làm việc thứ hai của cùng repo, ở đây dùng để chạy CI trên commit cũ.')],
  ], en)}

${tomTat([
    t('Before code: AC, reproduce, find callers, estimate + checkpoint.', 'Trước khi code: tiêu chí, tái hiện, tìm nơi gọi, ước lượng + mốc kiểm.'),
    t('Commit the failing test first; make it green with the smallest change.', 'Commit test đỏ trước; làm nó xanh bằng thay đổi nhỏ nhất.'),
    t('"While I’m here" broke the build (rename) — refactors get their own ticket.', '"Tiện tay" làm hỏng build (đổi tên) — refactor có ticket riêng.'),
    t('Run the team’s checklist on your PR before asking a human: 7 failures vs ready.', 'Chạy checklist của đội trên PR trước khi nhờ người: 7 mục trượt so với sẵn sàng.'),
    t('Done = merged and verified; warn at half the estimate, not at the deadline.', 'Xong = đã merge và đã kiểm; báo ở nửa ước lượng, không đợi tới hạn.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-8-4-phat-trien', t('8.4 — Growing: feedback, 1:1s and career', '8.4 — Phát triển: phản hồi, 1:1 và sự nghiệp'))}.</p>
`);
};

export default {
  title: '8.3 — Your first tickets|||8.3 — Những ticket đầu tiên',
  slug: 'agl-8-3-viec-dau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ticket đầu tiên nhỏ mà chắc: bốn câu hỏi trước khi code; lab chạy thật LH-212 trên repo lich-hen-api làm hai lần — bản vội đổi tên hàm (CI đỏ khi nạp routes.mjs), còn sót lỗi trùng phút, nhánh "fix" chặn "fix/LH-212-…"; bản chắc commit test đỏ trước (A D thay vì C B), sửa 4 dòng, xanh; kiem-pr-dau.mjs (worktree chạy CI ở commit test): 7 mục trượt so với sẵn sàng; giao đúng hạn với mốc kiểm ở nửa ước lượng; chuyện thật Knight Capital 2012 (dùng lại cờ cũ, mã chết, 440 triệu USD).',
  content: L83(true) + L83(false),
};
