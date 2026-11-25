/**
 * 4.2 — Viết nhận xét review có ích (agl-4-2-viet-review). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch4/loc-nhan-xet.mjs trên review/c2-v1.txt và c2-v2.txt (C2 review PR #31 của trưởng nhóm C1;
 * mã PR là v1/DatLichApi.java, bằng chứng trong nhận xét lấy từ out-bao-mat-v1.txt của bài 4.4) — qua ./_ma.mjs.
 * Nguồn (đọc 24/11): conventionalcomments.org (nhãn praise/nitpick/suggestion/issue/todo/question/thought/chore/note + decoration
 * blocking/non-blocking). Ranh giới: ba phán quyết, gom bình luận, suggested changes, cách diễn đạt chung ⇒ Git 6.2; câu tiếng Anh ⇒ TAK 3.3.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { java } from '../../spring-boot/_chung.mjs';
import { MA, RA } from './_ma.mjs';

const [LINT1, LINT2] = RA.locNhanXet.split(/\n(?=\$ node loc-nhan-xet)/);
const doan = (src, a, b) => src.split('\n').slice(a - 1, b).join('\n');

export const L42 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.2', 'Chương 4 · Bài 4.2', `
<h2>${t('4.2 — Writing useful review comments', '4.2 — Viết nhận xét review có ích')}</h2>
<p class="lead">${t(
    'A review comment is a small message with a job: make the author change something, understand something, or keep doing something. Most bad comments fail for one of three reasons — the author cannot tell whether it blocks the merge, cannot tell why, or hears an attack on themselves. This lesson fixes all three with a labelling convention, a four-part shape, and a script that checks a review before you press Submit — on a real PR written by the team leader.',
    'Một nhận xét review là một tin nhắn nhỏ có nhiệm vụ: khiến tác giả sửa điều gì đó, hiểu điều gì đó, hoặc tiếp tục làm điều gì đó. Phần lớn nhận xét tồi hỏng vì một trong ba lý do — tác giả không biết nó có chặn merge không, không biết vì sao, hoặc nghe thấy mình bị công kích. Bài này sửa cả ba bằng một quy ước gắn nhãn, một khuôn bốn phần, và một script soát lượt review trước khi bấm Submit — trên một PR thật do chính trưởng nhóm viết.')}</p>
${note(t('Generic mechanics (Approve / Comment / Request changes, batching, suggested changes, "what to look for" order) are in ', 'Phần thao tác chung (Approve / Comment / Request changes, gom bình luận, suggested changes, thứ tự "nhìn gì trước") có ở ') + cs('git', 'git-6-2-review', 'Git 6.2') + t('. Writing the same comments in English for a foreign team: ', '. Viết những nhận xét này bằng tiếng Anh cho đội nước ngoài: ') + cs('tieng-anh-ky-thuat-di-lam', 'tak-3-3-review', t('Technical English 3.3', 'Tiếng Anh kỹ thuật 3.3')) + '.')}

<h3>${t('Everyday picture: the driving instructor', 'Liên tưởng đời thường: thầy dạy lái xe')}</h3>
<p>${t(
    'Two instructors see you drift over the line. One shouts "Wrong! Why do you always do that?". The other says "Stop — you crossed the solid line; at the exam that is an automatic fail. Look further ahead, not at the bonnet." and later "Your parking was very clean." Same mistake spotted. Only the second one changes how you drive — because you know how serious it is, why, and what to do instead.',
    'Hai thầy dạy lái thấy bạn lấn vạch. Một người quát "Sai! Sao lúc nào cũng thế?". Người kia nói "Dừng — em lấn vạch liền; đi thi là trượt luôn. Nhìn xa phía trước, đừng nhìn nắp capo." và lát sau "Đỗ xe vừa rồi gọn lắm." Cùng một lỗi được phát hiện. Chỉ người thứ hai làm bạn lái khác đi — vì bạn biết lỗi nặng cỡ nào, vì sao, và phải làm gì thay vào.')}</p>

<h3>${t('Labels: say how serious it is (Conventional Comments)', 'Nhãn: nói rõ nặng cỡ nào (Conventional Comments)')}</h3>
<p>${t('The ', 'Quy ước ')}${ng('https://conventionalcomments.org/', 'Conventional Comments')}${t(' convention puts a label at the start of every comment, optionally with decorations in parentheses. LabFlow uses this subset:', ' đặt một nhãn ở đầu mỗi nhận xét, có thể kèm phần trang trí trong ngoặc. LabFlow dùng tập con sau:')}</p>
${bang([t('Label', 'Nhãn'), t('Means', 'Nghĩa là'), t('Blocks merge?', 'Chặn merge?'), t('LabFlow example', 'Ví dụ LabFlow')], [
    ['<code>issue</code>', t('Something is wrong (behaviour, security, data).', 'Có gì đó sai (hành vi, bảo mật, dữ liệu).'), t('Yes by default; <code>(non-blocking)</code> if it can be a follow-up ticket', 'Mặc định có; <code>(non-blocking)</code> nếu làm ticket sau được'), t('Lab detail returns another student’s booking.', 'Chi tiết lịch trả lịch của sinh viên khác.')],
    ['<code>suggestion</code>', t('A concrete improvement with a reason.', 'Một cải tiến cụ thể kèm lý do.'), t('Say it: <code>(blocking)</code> or <code>(non-blocking)</code>', 'Phải nói rõ: <code>(blocking)</code> hoặc <code>(non-blocking)</code>'), t('Escape strings or use Jackson.', 'Thoát chuỗi hoặc dùng Jackson.')],
    ['<code>question</code>', t('You do not understand or want a decision.', 'Bạn chưa hiểu hoặc cần một quyết định.'), t('No, unless the answer reveals an issue', 'Không, trừ khi câu trả lời lộ ra một issue'), t('Should a missing login return 401?', 'Thiếu đăng nhập có nên trả 401?')],
    ['<code>nitpick</code>', t('Trivial preference.', 'Chuyện sở thích nhỏ.'), t('Never', 'Không bao giờ'), t('println → logger.', 'println → logger.')],
    ['<code>todo</code>', t('Small necessary change (typo, missing ticket ID).', 'Thay đổi nhỏ nhưng cần (lỗi chính tả, thiếu mã ticket).'), t('Usually yes, trivial to fix', 'Thường có, sửa ngay được'), t('Commit message lacks (LF-23).', 'Lời nhắn commit thiếu (LF-23).')],
    ['<code>praise</code>', t('Something done well — specifically.', 'Điều làm tốt — nói cụ thể.'), t('Never', 'Không bao giờ'), t('Splitting tra()/json() made the handler readable.', 'Tách tra()/json() làm phần xử lý dễ đọc.')],
    ['<code>thought</code> / <code>note</code>', t('An idea or information, no action needed.', 'Một ý tưởng hoặc thông tin, không cần làm gì.'), t('Never', 'Không bao giờ'), t('S25 will need the same owner check.', 'S25 sẽ cần đúng phép kiểm chủ này.')],
  ])}

<h3>${t('The four-part shape of a blocking comment', 'Khuôn bốn phần của một nhận xét chặn')}</h3>
<ol>
<li>${t('<strong>Label</strong> — <code>issue (blocking, security):</code>', '<strong>Nhãn</strong> — <code>issue (blocking, bảo mật):</code>')}</li>
<li>${t('<strong>What</strong>, about the code: "the value of <code>lab</code> is concatenated into SQL".', '<strong>Cái gì</strong>, nói về mã: "giá trị <code>lab</code> được nối thẳng vào SQL".')}</li>
<li>${t('<strong>Why / evidence</strong>: an input you tried and its output, the acceptance criterion it breaks, or the rule (BR-07).', '<strong>Vì sao / bằng chứng</strong>: một đầu vào bạn đã thử và output của nó, tiêu chí chấp nhận bị vi phạm, hoặc luật nghiệp vụ (BR-07).')}</li>
<li>${t('<strong>Proposal</strong>: what you would do — not necessarily the only fix.', '<strong>Đề xuất</strong>: bạn sẽ làm gì — không nhất thiết là cách sửa duy nhất.')}</li>
</ol>
<p>${t('Questions beat orders when you are not sure: "What happens if the header is missing?" lets the author discover the 200-with-empty-list behaviour themselves — and if they had a reason, you learn it.', 'Câu hỏi tốt hơn mệnh lệnh khi bạn chưa chắc: "Nếu thiếu header thì sao?" để tác giả tự phát hiện ra chuyện trả 200 kèm danh sách rỗng — và nếu họ có lý do, bạn học được lý do đó.')}</p>

<h3>${t('Lab — C2 reviews the leader’s PR', 'Lab — C2 review PR của trưởng nhóm')}</h3>
<p>${t('Rotation week 1 (lesson 4.5): C2 reviews C1. C1, the leader, opened PR #31 "My bookings" (S23). The core of the handler (full file and the attacks that work against it in lesson 4.4):', 'Tuần 1 của bảng xoay vòng (bài 4.5): C2 review C1. C1, trưởng nhóm, mở PR #31 "Lịch của tôi" (S23). Phần lõi của hàm xử lý (cả tệp và các đòn tấn công chạy được với nó ở bài 4.4):')}</p>
${java(doan(MA.apiV1, 19, 36))}
<p>${t('C2 is a quiet member and the PR author is the leader. Their first draft — honest, partly right, and useless:', 'C2 là thành viên ít nói và tác giả PR là trưởng nhóm. Bản nháp đầu của C2 — thật lòng, đúng một phần, và vô dụng:')}</p>
${out(MA.c2v1)}
<p>${t('C2 saw the SQL problem (line 27) — and still approved "to make Friday’s demo". This is the most common failure in student teams: a member spots a real issue in the leader’s code and lets it through because blocking the leader feels rude. The team’s script reads the review before it is submitted:', 'C2 đã thấy vấn đề SQL (dòng 27) — mà vẫn duyệt "cho kịp demo thứ sáu". Đây là kiểu hỏng phổ biến nhất ở nhóm sinh viên: thành viên thấy lỗi thật trong mã của trưởng nhóm và cho qua vì chặn trưởng nhóm thấy ngại. Script của nhóm đọc lượt review trước khi gửi:')}</p>
${js(MA.locNhanXet)}
${out(LINT1)}
<p>${t('Every comment lacks a label, so C1 legally can merge without changing anything — the "APPROVE with unlabelled comments" warning says exactly that. Three comments aim at the person ("sai rồi", "sao lại", "lần trước cũng"). C2 rewrites, after trying the attacks on their own machine (4.4) so each blocking comment carries evidence:', 'Nhận xét nào cũng thiếu nhãn, nên C1 hoàn toàn có quyền merge mà không sửa gì — cảnh báo "APPROVE kèm nhận xét không nhãn" nói đúng điều đó. Ba nhận xét nhắm vào người ("sai rồi", "sao lại", "lần trước cũng"). C2 viết lại, sau khi tự thử các đòn tấn công trên máy mình (4.4) để mỗi nhận xét chặn đều có bằng chứng:')}</p>
${out(MA.c2v2)}
${out(LINT2)}
${cl('ok', `<p><strong>${t('What changed', 'Điều gì đã đổi')}</strong></p><ul>
<li>${t('Verdict matches content: three blocking issues ⇒ Request changes. A demo deadline is a reason to fix fast, not to approve a hole.', 'Phán quyết khớp nội dung: ba issue chặn ⇒ Request changes. Hạn demo là lý do để sửa nhanh, không phải để duyệt một lỗ hổng.')}</li>
<li>${t('Evidence instead of judgement: "I typed <code>LAB-1\' or \'1\'=\'1</code> and got all 4 bookings" cannot be argued with; "sai rồi" can.', 'Bằng chứng thay cho phán xét: "Mình gõ <code>LAB-1\' or \'1\'=\'1</code> và nhận cả 4 lịch" thì không cãi được; "sai rồi" thì cãi được.')}</li>
<li>${t('Tied to the ticket: comment 2 quotes AC2 of LF-23. The reviewer is enforcing what the team agreed, not personal taste — which makes it easier to block the leader.', 'Gắn với ticket: nhận xét 2 trích AC2 của LF-23. Người review đang giữ điều cả nhóm đã thoả thuận, không phải sở thích riêng — nên chặn trưởng nhóm cũng dễ nói hơn.')}</li>
<li>${t('Naming taste ("duong đặt tên dở") was dropped: not worth a comment. The logger point stayed as a <code>nitpick</code>.', 'Chuyện đặt tên theo sở thích ("duong đặt tên dở") bị bỏ: không đáng một nhận xét. Ý về logger giữ lại dưới dạng <code>nitpick</code>.')}</li>
<li>${t('One specific <code>praise</code>. Not politeness padding — it tells C1 what to keep doing and shows C2 actually read the file.', 'Một <code>praise</code> cụ thể. Không phải lời khen xã giao — nó cho C1 biết nên giữ điều gì và cho thấy C2 đọc thật cả tệp.')}</li>
</ul>`)}

<h3>${t('Words that turn a comment into an attack', 'Những từ biến nhận xét thành công kích')}</h3>
${bang([t('Instead of', 'Thay vì'), t('Write', 'Viết'), t('Why', 'Vì sao')], [
    [t('"You forgot the owner check again."', '"Ông lại quên kiểm chủ rồi, lần trước cũng thế."'), t('"issue (blocking): this query has no owner condition — 2201 can read 102. AC2 says owner or lab manager."', '"issue (blocking): câu truy vấn này không có điều kiện chủ — 2201 đọc được 102. AC2 ghi chủ lịch hoặc quản lý lab."'), t('About the code, with evidence; history belongs in the retro, not in a PR.', 'Nói về mã, có bằng chứng; chuyện cũ để ở buổi retro, không để trong PR.')],
    [t('"Why would you write it like this??"', '"Sao lại viết thế này??"'), t('"question: what does this return when the id belongs to someone else?"', '"question: khi id là của người khác thì dòng này trả về gì?"'), t('A real question has an answer; a rhetorical one only has a tone.', 'Câu hỏi thật có câu trả lời; câu hỏi tu từ chỉ có giọng điệu.')],
    [t('"Obviously / just / simply use X"', '"Rõ ràng là / chỉ cần / đơn giản là dùng X"'), t('"suggestion: X would avoid Y because Z"', '"suggestion: dùng X sẽ tránh được Y vì Z"'), t('"Obviously" tells the author they are slow for not seeing it.', '"Rõ ràng là" ngầm bảo tác giả chậm vì không tự thấy.')],
    [t('"LGTM" on 400 lines in 3 minutes', '"LGTM" cho 400 dòng sau 3 phút'), t('"Read the service and the SQL; did not run the UI. Approve."', '"Đã đọc service và SQL; chưa chạy giao diện. Approve."'), t('States what your approval covers.', 'Nói rõ lượt duyệt của bạn bao phủ tới đâu.')],
  ])}
${note(t('Timebox: about 60 minutes or 300–400 lines per sitting. Beyond that attention drops and comments become "LGTM". If a PR is larger, ask the author to split it (3.2) or review it in two sittings and say so.', 'Giới hạn thời gian: khoảng 60 phút hoặc 300–400 dòng mỗi lần ngồi. Quá mức đó sự chú ý giảm và nhận xét biến thành "LGTM". PR lớn hơn thì nhờ tác giả tách (3.2) hoặc review hai lần ngồi và nói rõ như vậy.'))}

<h3>${t('Leader’s job: make it safe to block the leader', 'Việc của trưởng nhóm: làm cho việc chặn trưởng nhóm trở nên an toàn')}</h3>
<ul>
<li>${t('Say it at sprint planning: "I want Request changes on my PRs when something is wrong. If my PR gets approved with a hole, that is on both of us."', 'Nói ra ở buổi planning: "Mình muốn bị Request changes khi PR của mình có gì sai. Nếu PR của mình được duyệt mà còn lỗ hổng, đó là lỗi của cả hai."')}</li>
<li>${t('React well the first time it happens (lesson 4.3): thank, fix, re-request. Everyone watches how the leader takes the first block.', 'Phản ứng tốt ngay lần đầu (bài 4.3): cảm ơn, sửa, nhờ duyệt lại. Cả nhóm nhìn cách trưởng nhóm đón lần bị chặn đầu tiên.')}</li>
<li>${t('Praise good reviews in the group chat: "C2’s review on #31 caught two security holes with evidence — that is the standard." Reviews then become something people are proud of.', 'Khen review tốt trong nhóm chat: "Lượt review của C2 trên #31 bắt hai lỗ hổng bảo mật kèm bằng chứng — đó là chuẩn của nhóm." Từ đó review thành thứ mọi người tự hào.')}</li>
</ul>

<h3>${t('At work', 'Đi làm')}</h3>
<p>${t(
    'In companies the label convention varies ("nit:", "blocking:", Japanese teams sometimes mark 指摘 levels), but the shape is the same everywhere: severity, what, why, proposal. As an intern reviewing a senior’s PR, questions are your best tool: "question: is the missing owner check intended because the gateway checks it?" is respectful and often reveals real bugs. And never approve something you did not read — write what you checked.',
    'Ở công ty, quy ước nhãn mỗi nơi một kiểu ("nit:", "blocking:", đội Nhật đôi khi đánh mức 指摘 — chỉ trích/góp ý), nhưng khuôn thì chỗ nào cũng giống: mức độ, cái gì, vì sao, đề xuất. Là thực tập sinh review PR của senior, câu hỏi là công cụ tốt nhất: "question: thiếu kiểm chủ ở đây là cố ý vì gateway đã kiểm rồi phải không ạ?" vừa lễ phép vừa hay lộ ra lỗi thật. Và đừng bao giờ duyệt thứ mình chưa đọc — ghi rõ mình đã soát những gì.')}</p>

<h3>🧪 ${t('Exercise', 'Bài tập')}</h3>
<p>${t('Rewrite these three comments from a review of C4’s lending-desk PR so they pass <code>loc-nhan-xet.mjs</code> with 0 errors and 0 warnings. Invent evidence that is plausible for S30 (lesson 3.2).', 'Viết lại ba nhận xét sau trong lượt review PR quầy cho mượn của C4 sao cho qua <code>loc-nhan-xet.mjs</code> với 0 lỗi, 0 nhắc. Tự nghĩ bằng chứng hợp lý cho S30 (bài 3.2).')}</p>
${out(MA.bt42de)}
${giai(t('One possible answer', 'Một đáp án'), `${out(MA.bt42giai)}
${out(RA.baiTap42.split(/\n(?=\$ node)/)[1])}
<p>${t('Note the verdict changed to REQUEST_CHANGES because comment 1 blocks. "chỉ cần" was removed (tone) and replaced by the reason (the race between read and write). "ok" became a specific praise — or delete it.', 'Để ý phán quyết đổi sang REQUEST_CHANGES vì nhận xét 1 chặn. "chỉ cần" bị bỏ (giọng) và thay bằng lý do (khe giữa đọc và ghi). "ok" thành một lời khen cụ thể — hoặc xoá đi.')}</p>`)}

${phongVan([
    [t('"How do you give critical feedback in a code review?"', '"Bạn góp ý gay gắt trong code review thế nào?"'), t('Label the severity so the author knows if it blocks, describe the code not the person, give evidence — an input and its output or the requirement it breaks — and propose a fix. When unsure I ask a question instead of giving an order.', 'Gắn nhãn mức độ để tác giả biết có chặn không, nói về mã chứ không về người, đưa bằng chứng — một đầu vào và output của nó hoặc yêu cầu bị vi phạm — và đề xuất cách sửa. Khi chưa chắc, mình hỏi thay vì ra lệnh.')],
    [t('"What is a nitpick and should it block a merge?"', '"Nitpick là gì và có nên chặn merge không?"'), t('A trivial preference such as naming or a logger call. It never blocks; label it so the author can skip it. Anything automatable belongs in a formatter or linter, not in comments.', 'Một chuyện sở thích nhỏ như đặt tên hay lời gọi logger. Không bao giờ chặn; gắn nhãn để tác giả có thể bỏ qua. Thứ gì tự động được thì để formatter hoặc linter lo, không để trong nhận xét.')],
    [t('"You found a serious bug in your team lead’s PR the day before a demo. What do you do?"', '"Bạn thấy lỗi nghiêm trọng trong PR của trưởng nhóm ngay trước ngày demo. Bạn làm gì?"'), t('Request changes with evidence and a proposed fix, and offer to pair on it so the demo is not at risk. Approving a known security hole to save a day costs more later — and a good lead wants to hear it.', 'Request changes kèm bằng chứng và cách sửa đề xuất, và đề nghị ngồi sửa cùng để demo không bị ảnh hưởng. Duyệt một lỗ hổng đã biết để đỡ một ngày sẽ tốn hơn nhiều về sau — và trưởng nhóm tốt muốn được nghe điều đó.')],
    [t('"Do you praise in code reviews?"', '"Bạn có khen trong code review không?"'), t('Yes, specifically and briefly — it tells the author what to keep and shows I read the code. Not as padding around criticism.', 'Có, cụ thể và ngắn — nó cho tác giả biết nên giữ gì và cho thấy mình đã đọc mã. Không phải lời đệm quanh lời chê.')],
  ], en)}

${thuatNgu([
    ['Conventional Comments', t('Convention: label + optional decorations + subject, e.g. <code>issue (blocking):</code>.', 'Quy ước: nhãn + trang trí tuỳ chọn + nội dung, vd <code>issue (blocking):</code>.')],
    ['blocking / non-blocking', t('Whether the comment must be resolved before merge.', 'Nhận xét có phải giải quyết trước khi merge không.')],
    ['nitpick (nit)', t('Trivial preference, never blocks.', 'Chuyện sở thích nhỏ, không bao giờ chặn.')],
    ['Request changes', t('Review verdict that blocks merge until resolved.', 'Phán quyết review chặn merge tới khi được giải quyết.')],
    ['rubber-stamp', t('Approving without really reading.', 'Duyệt mà không đọc thật.')],
    ['timebox', t('A fixed time limit for one review sitting.', 'Giới hạn thời gian cố định cho một lần ngồi review.')],
  ], en)}

${tomTat([
    t('Every comment starts with a label; the verdict must match the labels (any blocking ⇒ Request changes).', 'Mọi nhận xét mở đầu bằng nhãn; phán quyết phải khớp với nhãn (có cái chặn ⇒ Request changes).'),
    t('Blocking comments have four parts: label, what (about the code), why/evidence, proposal.', 'Nhận xét chặn có bốn phần: nhãn, cái gì (về mã), vì sao/bằng chứng, đề xuất.'),
    t('Evidence and the ticket’s criteria make it possible to block the leader without it being personal.', 'Bằng chứng và tiêu chí của ticket giúp chặn được trưởng nhóm mà không thành chuyện cá nhân.'),
    t('Drop taste-only comments; automate style; keep one specific praise.', 'Bỏ nhận xét chỉ vì sở thích; tự động hoá văn phong; giữ một lời khen cụ thể.'),
    t('The leader makes blocking safe: asks for it, reacts well, praises good reviews publicly.', 'Trưởng nhóm làm cho việc chặn trở nên an toàn: chủ động xin, phản ứng tốt, khen review tốt công khai.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-4-3-nhan-review', t('4.3 — Receiving feedback well', '4.3 — Nhận góp ý cho tốt'))}.</p>
`);
};

export default {
  title: '4.2 — Writing useful review comments|||4.2 — Viết nhận xét review có ích',
  slug: 'agl-4-2-viet-review',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nhãn Conventional Comments (issue/suggestion/question/nitpick/todo/praise, blocking/non-blocking) và khuôn bốn phần của nhận xét chặn; lab chạy thật: C2 review PR #31 của trưởng nhóm — bản nháp không nhãn, công kích người, vẫn APPROVE dù thấy lỗi SQL; script loc-nhan-xet.mjs bắt 6 lỗi; bản viết lại có bằng chứng, trích AC, REQUEST_CHANGES; bảng từ ngữ thành công kích; việc của trưởng nhóm: làm cho việc chặn trưởng nhóm an toàn.',
  content: L42(true) + L42(false),
};
