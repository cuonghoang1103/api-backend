/**
 * 4.3 — Nhận góp ý cho tốt (agl-4-3-nhan-review). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch4/kb-commit.sh (nhánh PR #31: commit mở PR + commit sửa theo review, hash lặp lại được)
 * và tra-loi.mjs trên review/luong-v1.json / luong-v2.json — qua ./_ma.mjs.
 * Nguồn (đọc 24/11): Wikipedia "Linus Torvalds" — 16/09/2018 thư "Linux 4.19-rc4 released, an apology, and a maintainership note",
 * lời "unprofessional and uncalled for", cùng ngày Code of Conflict được thay bằng Code of Conduct dựa trên Contributor Covenant.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const [TL1, TL2] = RA.traLoi.split(/\n(?=\$ node tra-loi)/);
const H = RA.commit.split('\n')[1].slice(0, 7);

export const L43 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.3', 'Chương 4 · Bài 4.3', `
<h2>${t('4.3 — Receiving feedback well', '4.3 — Nhận góp ý cho tốt')}</h2>
<p class="lead">${t(
    'You opened a PR you were proud of and got seven comments, three of them blocking. What you do in the next hour decides whether reviewers keep telling you the truth. This lesson gives a reply protocol, a way to end disagreements without a war in the comments, and a script that tells the author (and the leader) which threads are still waiting on whom — run on the leader’s own PR from lesson 4.2.',
    'Bạn mở một PR mình tự hào và nhận bảy nhận xét, ba cái chặn. Việc bạn làm trong một giờ tiếp theo quyết định người review có còn nói thật với bạn nữa không. Bài này đưa ra quy trình trả lời, cách kết thúc bất đồng mà không thành chiến tranh trong phần bình luận, và một script cho tác giả (và trưởng nhóm) biết luồng nào còn đang chờ ai — chạy trên chính PR của trưởng nhóm ở bài 4.2.')}</p>

<h3>${t('Everyday picture: the essay with red ink', 'Liên tưởng đời thường: bài luận đầy mực đỏ')}</h3>
<p>${t(
    'A teacher returns your essay covered in red. The red ink is about the essay, not about you — and a teacher who writes nothing has either not read it or given up on you. Students who improve fastest read the comments twice, ask about the ones they do not understand, and hand in the next essay without repeating the same mistakes. Students who argue with every mark get fewer marks next time — and learn less.',
    'Thầy cô trả bài luận đỏ chi chít. Mực đỏ là về bài luận, không phải về bạn — và thầy cô không viết gì thì hoặc chưa đọc, hoặc đã bỏ cuộc với bạn. Học sinh tiến bộ nhanh nhất đọc nhận xét hai lần, hỏi lại chỗ chưa hiểu, và bài sau không lặp lại lỗi cũ. Học sinh cãi từng chỗ gạch thì lần sau được gạch ít hơn — và học được ít hơn.')}</p>

<h3>${t('The reply protocol', 'Quy trình trả lời')}</h3>
${bang([t('Step', 'Bước'), t('Do', 'Làm'), t('Do not', 'Đừng')], [
    [t('1. Wait 10 minutes', '1. Chờ 10 phút'), t('Read everything once without replying. Separate "my code" from "me".', 'Đọc hết một lượt mà chưa trả lời. Tách "mã của tôi" khỏi "tôi".'), t('Reply to the first comment in the first minute, defensively.', 'Trả lời nhận xét đầu tiên ngay phút đầu, với giọng phòng thủ.')],
    [t('2. Reply to every thread', '2. Trả lời mọi luồng'), t('One of three: <strong>"Fixed in &lt;hash&gt;: …"</strong>, <strong>"Not doing this because … (ticket LF-xx)"</strong>, or a clarifying question.', 'Một trong ba: <strong>"Đã sửa ở &lt;hash&gt;: …"</strong>, <strong>"Không sửa vì … (ticket LF-xx)"</strong>, hoặc một câu hỏi làm rõ.'), t('"ok", silence, or "later" without a ticket — that means never.', '"ok", im lặng, hoặc "để sau" không kèm ticket — nghĩa là không bao giờ.')],
    [t('3. Push new commits', '3. Đẩy commit mới'), t('Fix commits on top (<code>fix(LF-23): …</code>) so the reviewer sees "changes since my review". The PR is squashed at merge anyway (3.4).', 'Commit sửa chồng lên trên (<code>fix(LF-23): …</code>) để người review thấy "thay đổi kể từ lượt review của tôi". Lúc merge PR vẫn được squash (3.4).'), t('Force-push a rewritten history during review: the reviewer has to read everything again.', 'Force-push lịch sử viết lại trong lúc review: người review phải đọc lại từ đầu.')],
    [t('4. Let the reviewer close', '4. Để người review đóng'), t('Blocking threads are resolved by the reviewer after checking. The author may close non-blocking ones with a reply.', 'Luồng chặn do người review đóng sau khi kiểm lại. Tác giả được đóng luồng không chặn kèm câu trả lời.'), t('Resolve a blocking thread yourself — the reviewer may never see it again.', 'Tự đóng luồng chặn — người review có thể không bao giờ thấy lại nó.')],
    [t('5. Re-request review', '5. Nhờ duyệt lại'), t('Press re-request and write one line: "3 blocking fixed in ' + H + ', 401 added, please re-check."', 'Bấm re-request và viết một dòng: "3 issue chặn đã sửa ở ' + H + ', thêm 401, nhờ xem lại."'), t('Wait silently for the reviewer to notice.', 'Im lặng chờ người review tự để ý.')],
    [t('6. Say thanks', '6. Cảm ơn'), t('Especially for the comment that hurt — it probably saved you at the defence.', 'Nhất là nhận xét làm bạn đau — có lẽ nó cứu bạn ở buổi bảo vệ.'), t('Thank only the praise.', 'Chỉ cảm ơn lời khen.')],
  ])}

<h3>${t('Lab — the leader receives the review', 'Lab — trưởng nhóm nhận review')}</h3>
<p>${t('PR #31 again. C2’s rewritten review from 4.2 arrives on Wednesday 17/02 at 09:10. Version 1 is what C1 — tired, busy, proud of the code — actually did over the next two days. The team stores the threads as JSON (on GitHub you would read them with <code>gh api</code>; the format here is simplified) and the leader’s script reads them:', 'Lại PR #31. Lượt review viết lại của C2 ở bài 4.2 tới lúc 09:10 thứ Tư 17/02. Bản 1 là điều C1 — mệt, bận, tự hào về mã của mình — thực sự đã làm trong hai ngày sau đó. Nhóm lưu các luồng dưới dạng JSON (trên GitHub bạn đọc bằng <code>gh api</code>; định dạng ở đây đã giản lược) và script của trưởng nhóm đọc chúng:')}</p>
${js(MA.traLoi)}
${out(TL1)}
<p>${t('Read the output as a list of habits: "it runs, nobody types quotes in a demo" (defending instead of checking), "ok" and resolving a blocking thread yourself (the reviewer’s finding silently disappears), two threads ignored for 48 hours, a five-round argument about 401 in the comments, and "later" without a ticket. The PR cannot merge — and worse, C2 learns that blocking the leader is pointless.', 'Đọc output như một danh sách thói quen: "chạy được mà, demo có ai gõ dấu nháy đâu" (bào chữa thay vì kiểm), "ok" và tự đóng luồng chặn (phát hiện của người review lặng lẽ biến mất), hai luồng bị bỏ mặc 48 giờ, một cuộc cãi năm lượt về 401 ngay trong phần bình luận, và "để sau" không kèm ticket. PR không merge được — và tệ hơn, C2 rút ra bài học rằng chặn trưởng nhóm là vô ích.')}</p>
<p>${t('Version 2 — the same afternoon. C1 tries C2’s attack, sees the four bookings, fixes everything in one commit and replies thread by thread:', 'Bản 2 — ngay chiều hôm đó. C1 thử đòn của C2, thấy bốn lịch hiện ra, sửa tất cả trong một commit và trả lời từng luồng:')}</p>
${out(RA.commit)}
${out(TL2)}
${cl('ok', `<p><strong>${t('Details that matter in version 2', 'Những chi tiết đáng giá ở bản 2')}</strong></p><ul>
<li>${t('Every "fixed" carries the hash <code>' + H + '</code>: the reviewer checks exactly that commit, not the whole file again.', 'Mỗi chữ "đã sửa" đều kèm hash <code>' + H + '</code>: người review kiểm đúng commit đó, không phải đọc lại cả tệp.')}</li>
<li>${t('C1 opens with "Thanks, that is a real bug" on the most painful comment. One sentence, and the team sees it is safe to block the leader.', 'C1 mở đầu bằng "Cảm ơn, đúng là lỗi" ở nhận xét đau nhất. Một câu thôi, và cả nhóm thấy chặn trưởng nhóm là an toàn.')}</li>
<li>${t('The 401 question was settled by a 5-minute call and the conclusion written back into the thread — the next person who reads the code finds the reason.', 'Câu hỏi 401 được chốt bằng cuộc gọi 5 phút và kết luận ghi lại vào luồng — người sau đọc mã sẽ tìm thấy lý do.')}</li>
<li>${t('Declining is allowed: the logger nitpick becomes ticket LF-61 for the whole project, with a reason. "Not in this PR" is a fine answer when it has a ticket.', 'Từ chối là được phép: nitpick về logger thành ticket LF-61 cho cả dự án, kèm lý do. "Không làm trong PR này" là câu trả lời ổn khi có ticket đi kèm.')}</li>
<li>${t('Blocking threads were closed by C2 after re-running the attacks; non-blocking ones by C1. The script’s final line is the merge condition the team agreed on.', 'Luồng chặn do C2 đóng sau khi chạy lại các đòn tấn công; luồng không chặn do C1 đóng. Dòng cuối của script chính là điều kiện merge cả nhóm đã thoả thuận.')}</li>
</ul>`)}

<h3>${t('When you disagree: a ladder, not a war', 'Khi bất đồng: một cái thang, không phải một cuộc chiến')}</h3>
<ol>
<li>${t('<strong>Reply once with your reason and evidence.</strong> Maybe the reviewer missed context ("the gateway already checks this").', '<strong>Trả lời một lần kèm lý do và bằng chứng.</strong> Có thể người review thiếu ngữ cảnh ("gateway đã kiểm việc này rồi").')}</li>
<li>${t('<strong>After two rounds, stop typing.</strong> Call for 10 minutes or talk after class. Text strips tone; both of you start sounding angrier than you are.', '<strong>Sau hai lượt, dừng gõ.</strong> Gọi 10 phút hoặc nói chuyện sau giờ học. Chữ viết làm mất giọng điệu; cả hai sẽ nghe có vẻ giận hơn thực tế.')}</li>
<li>${t('<strong>Write the conclusion back into the thread</strong> — one line, who agreed, why.', '<strong>Ghi kết luận lại vào luồng</strong> — một dòng, ai đồng ý, vì sao.')}</li>
<li>${t('<strong>Still stuck? Use the tie-breakers the team agreed in advance</strong>, in this order: the ticket’s acceptance criteria and business rules → the team’s written agreement / Definition of Done (1.4) → a third person decides (the leader, or the second code owner if the leader is one of the two). Decisions that will come up again become an ADR (', '<strong>Vẫn kẹt? Dùng các luật phân xử nhóm đã thống nhất từ trước</strong>, theo thứ tự: tiêu chí chấp nhận của ticket và luật nghiệp vụ → thoả thuận làm việc / Definition of Done đã viết ra (1.4) → một người thứ ba quyết (trưởng nhóm, hoặc người chủ thứ hai của tệp nếu trưởng nhóm là một bên). Quyết định sẽ còn gặp lại thì ghi thành ADR (')}${ag('agl-5-2-adr', '5.2')}).</li>
</ol>
${note(t('Taste is never a tie-breaker. If the disagreement is "I would have written it differently" and both versions meet the criteria, the author’s version wins — Google’s guide says the same: approve once the change improves code health, even if it is not how you would write it.', 'Sở thích không bao giờ là luật phân xử. Nếu bất đồng là "tôi sẽ viết khác" và cả hai cách đều đạt tiêu chí, cách của tác giả thắng — hướng dẫn của Google cũng nói vậy: duyệt khi thay đổi làm mã tốt lên, dù đó không phải cách bạn sẽ viết.'))}

<h3>${t('The leader’s three difficult reviewers', 'Ba kiểu người review khó của trưởng nhóm')}</h3>
${bang([t('Situation', 'Tình huống'), t('What the leader does', 'Trưởng nhóm làm gì')], [
    [t('<strong>The harsh one.</strong> C3 writes "code như hạch" on C5’s PR. C5 stops committing for three days.', '<strong>Người gắt.</strong> C3 viết "code như hạch" trên PR của C5. C5 ba ngày không commit.'), t('Talk to C3 privately the same day, about the comment, not the person: run <code>loc-nhan-xet.mjs</code> on it together and rewrite it. Then message C5 separately: the content of the review was right, the tone was not, it has been addressed. Raise "how we write reviews" at the retro without names.', 'Nói riêng với C3 ngay trong ngày, về nhận xét chứ không về con người: cùng chạy <code>loc-nhan-xet.mjs</code> lên nhận xét đó và viết lại. Rồi nhắn riêng C5: nội dung góp ý đúng, giọng thì không, đã được xử lý. Đưa "nhóm mình viết review thế nào" ra buổi retro, không nêu tên.')],
    [t('<strong>The silent one.</strong> C4 has 5 review requests and answered none in a week.', '<strong>Người im lặng.</strong> C4 có 5 yêu cầu review và một tuần không trả lời cái nào.'), t('Check first: overloaded, ill, or does not know how? Ask at daily standup "C4, PR #33 waiting since Monday — today or should C5 take it?" Put waiting time per reviewer in the weekly report (chapter 6) — numbers, not blame.', 'Kiểm trước: quá tải, ốm, hay không biết review thế nào? Hỏi ở buổi daily "C4, PR #33 chờ từ thứ Hai — hôm nay xem được không hay để C5 nhận?" Đưa thời gian chờ theo từng người review vào báo cáo tuần (chương 6) — con số, không đổ lỗi.')],
    [t('<strong>The rubber stamp.</strong> C5 approves everything within two minutes.', '<strong>Người đóng dấu.</strong> C5 duyệt mọi thứ trong vòng hai phút.'), t('Spot-check one of C5’s approvals per week (4.1). Pair-review one PR with C5 using the checklist (4.4). Ask C5 to write what they checked in each approval.', 'Mỗi tuần kiểm tra mẫu một lượt duyệt của C5 (4.1). Ngồi review chung một PR với C5 theo checklist (4.4). Đề nghị C5 ghi rõ mình đã soát gì trong mỗi lượt duyệt.')],
  ])}

<h3>🧭 ${t('Real case: the most famous reviewer apologises (Linux, 2018)', 'Chuyện thật: người review nổi tiếng nhất xin lỗi (Linux, 2018)')}</h3>
<p>${t(
    'For decades Linus Torvalds’ review emails on the Linux kernel mailing list were known for personal attacks. On 16 September 2018, in the message "Linux 4.19-rc4 released, an apology, and a maintainership note", he called his past attacks "unprofessional and uncalled for" and took time off to learn to respond to people better; the same day the kernel replaced its "Code of Conflict" with a Code of Conduct based on the Contributor Covenant (',
    'Suốt nhiều chục năm, thư review của Linus Torvalds trên danh sách thư nhân Linux nổi tiếng vì công kích cá nhân. Ngày 16/09/2018, trong thư "Linux 4.19-rc4 released, an apology, and a maintainership note", ông gọi những lần công kích trước đây là "thiếu chuyên nghiệp và không đáng có" và nghỉ một thời gian để học cách phản hồi mọi người tốt hơn; cùng ngày, dự án nhân thay "Code of Conflict" bằng bộ quy tắc ứng xử dựa trên Contributor Covenant (')}${ng('https://en.wikipedia.org/wiki/Linus_Torvalds', 'Wikipedia: Linus Torvalds')}${t(
    '). Even the most technically respected reviewer in the world concluded that tone is part of the job, because contributors who are attacked leave — and their knowledge leaves with them. A five-person team has far fewer people to lose.',
    '). Ngay cả người review được kính nể nhất thế giới về kỹ thuật cũng kết luận rằng giọng điệu là một phần của công việc, vì người đóng góp bị công kích sẽ bỏ đi — mang theo cả kiến thức của họ. Nhóm năm người có ít người để mất hơn nhiều.')}</p>

<h3>${t('At work', 'Đi làm')}</h3>
<p>${t(
    'On your first PR at a company expect many comments — 20 or 40 is normal and says nothing bad about you. Reply to each, fix fast, and keep a personal list of the kinds of comment you received; when the same kind stops appearing, you have learned the codebase’s standards. On Japanese projects review findings are often counted and reported; a finding you dispute should be discussed with your leader or the bridge engineer (BrSE), not argued directly with the customer’s reviewer in the tool (',
    'Ở PR đầu tiên tại công ty, hãy chờ đón nhiều nhận xét — 20 hay 40 là chuyện bình thường và không nói gì xấu về bạn. Trả lời từng cái, sửa nhanh, và giữ một danh sách riêng các kiểu nhận xét mình nhận; khi một kiểu không còn xuất hiện nữa, bạn đã học được chuẩn của codebase. Ở dự án Nhật, các điểm góp ý review thường được đếm và báo cáo; điểm nào bạn không đồng ý thì bàn với trưởng nhóm hoặc kỹ sư cầu nối (BrSE), không cãi thẳng với người review phía khách ngay trong công cụ (')}${ag('agl-11-1-khach-nhat', '11.1')}).</p>

<h3>🧪 ${t('Exercise', 'Bài tập')}</h3>
<p>${t('Take <code>review/luong-v1.json</code>. Without touching the code, rewrite only C1’s replies and the <code>dongBoi</code> fields so <code>tra-loi.mjs</code> reports 0 errors. Which threads can you <em>not</em> fix by replying alone, and why?', 'Lấy <code>review/luong-v1.json</code>. Không đụng vào mã, chỉ viết lại các câu trả lời của C1 và trường <code>dongBoi</code> sao cho <code>tra-loi.mjs</code> báo 0 lỗi. Những luồng nào bạn <em>không</em> sửa được chỉ bằng cách trả lời, và vì sao?')}</p>
${giai(t('Answer', 'Đáp án'), `<p>${t('One version of the rewritten replies, run for real:', 'Một bản viết lại các câu trả lời, chạy thật:')}</p>
${out(RA.baiTap43)}
<ul>
<li>${t('Unresolving the two blocking threads C1 closed (set <code>dongBoi</code> back to <code>null</code>) removes both ✗ — but the script then counts 3 open blocking threads and still says "cannot merge". Correct: replies cannot close a blocking issue; only a fix commit plus the reviewer’s check can.', 'Mở lại hai luồng chặn C1 đã tự đóng (đặt <code>dongBoi</code> về <code>null</code>) làm mất cả hai ✗ — nhưng khi đó script đếm 3 luồng chặn đang mở và vẫn báo "chưa merge được". Đúng như vậy: trả lời không đóng được một issue chặn; chỉ commit sửa cộng việc người review kiểm lại mới đóng được.')}</li>
<li>${t('The 401 thread: you can stop the warning by replying once with a conclusion, but the conclusion must come from the call, not from C1 alone.', 'Luồng 401: có thể hết cảnh báo bằng một câu trả lời chốt, nhưng kết luận phải đến từ cuộc gọi, không phải từ một mình C1.')}</li>
<li>${t('The nitpick: "Không sửa trong PR này: đổi cả dự án sang logger ở LF-61." clears the "later without ticket" warning — and the ticket must really exist on CT Work.', 'Nitpick: "Không sửa trong PR này: đổi cả dự án sang logger ở LF-61." làm hết cảnh báo "để sau không kèm ticket" — và ticket đó phải có thật trên CT Work.')}</li>
</ul>`)}

${phongVan([
    [t('"Tell me about a time you received critical feedback on your code."', '"Kể về một lần bạn nhận góp ý gay gắt về code của mình."'), t('STAR: in our SWP391 project a teammate blocked my PR with three security issues the day before a demo. I reproduced their input, confirmed the bug, fixed all three in one commit the same afternoon, replied to each thread with the commit hash and thanked them in the group. We then added an owner check to our review checklist.', 'STAR: trong đồ án SWP391, một bạn chặn PR của mình với ba lỗi bảo mật ngay trước ngày demo. Mình chạy lại đúng đầu vào bạn ấy đưa, xác nhận lỗi, sửa cả ba trong một commit ngay chiều đó, trả lời từng luồng kèm hash commit và cảm ơn bạn ấy trong nhóm. Sau đó nhóm thêm mục kiểm chủ dữ liệu vào checklist review.')],
    [t('"What do you do when you disagree with a reviewer?"', '"Bạn làm gì khi không đồng ý với người review?"'), t('Reply once with my reason and evidence. If we still disagree after two rounds, I suggest a short call, then write the conclusion in the thread. If needed, the requirement or the team’s agreed rules decide, then a third person — never personal taste.', 'Trả lời một lần kèm lý do và bằng chứng. Nếu sau hai lượt vẫn chưa thống nhất, mình đề nghị gọi ngắn, rồi ghi kết luận vào luồng. Cần thì để yêu cầu hoặc luật nhóm đã thống nhất quyết, rồi tới một người thứ ba — không bao giờ là sở thích cá nhân.')],
    [t('"Should the author resolve review threads?"', '"Tác giả có nên tự đóng luồng review không?"'), t('Non-blocking ones, yes, with a reply. Blocking ones should be resolved by the reviewer after checking the fix; otherwise a finding can disappear without anyone verifying it.', 'Luồng không chặn thì được, kèm câu trả lời. Luồng chặn nên để người review đóng sau khi kiểm bản sửa; nếu không, một phát hiện có thể biến mất mà không ai xác minh.')],
    [t('"A teammate is rude in reviews. You are the lead. What do you do?"', '"Một thành viên viết review thô lỗ. Bạn là trưởng nhóm. Bạn làm gì?"'), t('Talk to them privately the same day about the specific comment and rewrite it together; check on the person who received it; then discuss review tone at the retrospective without naming anyone. The technical point is usually right — keep it, fix the delivery.', 'Nói riêng với bạn đó ngay trong ngày về đúng nhận xét đó và cùng viết lại; hỏi han người nhận nhận xét; rồi đưa chuyện giọng điệu review ra buổi retro mà không nêu tên ai. Ý kỹ thuật thường là đúng — giữ ý đó, sửa cách nói.')],
  ], en)}

${thuatNgu([
    [t('resolve (a thread)', 'resolve (một luồng)'), t('Mark a review conversation as finished.', 'Đánh dấu một cuộc trao đổi review đã xong.')],
    ['re-request review', t('Ask the same reviewer to look again after changes.', 'Nhờ đúng người review xem lại sau khi đã sửa.')],
    ['force-push', t('Overwrite the remote branch with rewritten history.', 'Ghi đè nhánh trên máy chủ bằng lịch sử đã viết lại.')],
    [t('tie-breaker', 'luật phân xử'), t('A rule agreed in advance to settle disagreements.', 'Luật thống nhất từ trước để phân xử bất đồng.')],
    ['Code of Conduct', t('Written rules of behaviour for a project or team.', 'Quy tắc ứng xử viết thành văn bản của một dự án hay một nhóm.')],
    [t('review finding', 'điểm góp ý review'), t('One issue raised in review; often counted on outsourcing projects.', 'Một vấn đề nêu ra khi review; thường được đếm ở dự án outsourcing.')],
  ], en)}

${tomTat([
    t('Wait 10 minutes, then reply to every thread: fixed in &lt;hash&gt; / not doing because + ticket / question.', 'Chờ 10 phút, rồi trả lời mọi luồng: đã sửa ở &lt;hash&gt; / không sửa vì + ticket / câu hỏi.'),
    t('Fix with new commits during review; the reviewer closes blocking threads; re-request with one line.', 'Sửa bằng commit mới trong lúc review; người review đóng luồng chặn; nhờ duyệt lại kèm một dòng.'),
    t('Disagreement: one reasoned reply, call after two rounds, write the conclusion, then agreed tie-breakers — never taste.', 'Bất đồng: một câu trả lời có lý lẽ, gọi sau hai lượt, ghi kết luận, rồi tới luật phân xử đã thống nhất — không bao giờ là sở thích.'),
    t('The leader handles harsh, silent and rubber-stamp reviewers with private talks, numbers and spot-checks.', 'Trưởng nhóm xử lý người gắt, người im lặng và người đóng dấu bằng nói riêng, con số và kiểm tra mẫu.'),
    t('How the leader takes the first block decides whether the team keeps telling the truth.', 'Cách trưởng nhóm đón lần bị chặn đầu tiên quyết định cả nhóm có tiếp tục nói thật hay không.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-4-4-checklist', t('4.4 — A review checklist', '4.4 — Checklist review'))}.</p>
`);
};

export default {
  title: '4.3 — Receiving feedback well|||4.3 — Nhận góp ý cho tốt',
  slug: 'agl-4-3-nhan-review',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Quy trình sáu bước khi nhận review (chờ 10 phút, trả lời mọi luồng kèm hash/ticket, commit chồng không force-push, người review đóng luồng chặn, nhờ duyệt lại, cảm ơn); lab chạy thật: trưởng nhóm nhận review PR #31 — bản phòng thủ (tự đóng luồng chặn, "ok", cãi 5 lượt, "để sau") vs bản tốt, soát bằng tra-loi.mjs; thang xử lý bất đồng; ba kiểu người review khó; chuyện thật Linus Torvalds 2018.',
  content: L43(true) + L43(false),
};
