/**
 * 7.4 — Nói chuyện với khách hàng và các bên liên quan (agl-7-4-khach-hang — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Ranh giới: văn hoá khách Nhật/Mỹ, múi giờ, biên bản, tình huống khó ở agl-11-1…11-4; báo cáo tuần cho GV ở agl-6-3; Q&A/CR ở agl-9-5 ⇒ liên kết.
 * Bài này: bản đồ các bên liên quan, nói không thuật ngữ, đặt kỳ vọng bằng khoảng + xác suất (không một ngày duy nhất), nói "không" kèm phương án, demo.
 * Lab chạy THẬT (scratchpad/agt/lab/ch7): soat-thuat-ngu.mjs (thư gửi GV bản dev viết 17 vấn đề ⇒ bản sửa đạt); du-bao.mjs Monte Carlo 10.000 lần
 * từ thông lượng thật sprint 2 (nhật ký ch6): 14 màn ⇒ 68 % kịp 16/04, cam kết 12 để 85 %.
 * Chuyện thật: TSB 2018 (FCA/PRA phạt 48,65 triệu bảng 20/12/2022).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L74 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 7 · Lesson 7.4', 'Chương 7 · Bài 7.4', `
<h2>${t('7.4 — Talking to clients and stakeholders', '7.4 — Nói chuyện với khách hàng và các bên liên quan')}</h2>
<p class="lead">${t(
    'Clients do not buy code; they buy confidence that something they need will work by a date. Most of the damage in client communication comes from three habits developers bring from their own team chat: speaking in jargon, promising a single date with false certainty, and saying "yes" to everything until the day it becomes "no". This lesson replaces each habit with something you can check: a plain-language linter, a forecast with probabilities computed from your team’s real history, and a way to say no with options.',
    'Khách hàng không mua mã; họ mua niềm tin rằng thứ họ cần sẽ chạy được vào một ngày. Phần lớn thiệt hại trong giao tiếp với khách đến từ ba thói quen lập trình viên mang từ nhóm chat nội bộ: nói bằng thuật ngữ, hứa một ngày duy nhất với sự chắc chắn giả, và nói "vâng" với mọi thứ cho tới hôm nó thành "không". Bài này thay mỗi thói quen bằng một thứ kiểm được: bộ soát ngôn ngữ dễ hiểu, dự báo có xác suất tính từ lịch sử thật của nhóm, và cách nói không kèm phương án.')}</p>

<h3>${t('Everyday picture: the motorbike repair shop', 'Liên tưởng đời thường: tiệm sửa xe máy')}</h3>
<p>${t(
    'The mechanic who says "the CDI is dead and the stator coil is weak, done by five" and calls at seven saying "parts didn’t arrive" loses you. The one who says "the bike won’t start because of an electrical part; I’m sure about one cause, not the second. If it’s only the first, ready today around five; if it’s both, tomorrow noon. I’ll call you at two once I know" keeps you — even when the bike is late. Same repair, same delay; different words.',
    'Thợ nói "IC chết, cuộn điện yếu, năm giờ xong" rồi bảy giờ gọi "chưa có hàng" sẽ mất khách. Thợ nói "xe không nổ vì một bộ phận điện; một nguyên nhân thì chắc, cái thứ hai chưa chắc. Nếu chỉ cái đầu thì khoảng năm giờ chiều nay xong; nếu cả hai thì trưa mai. Hai giờ biết rõ anh gọi em" sẽ giữ được khách — kể cả khi xe trả muộn. Cùng một việc sửa, cùng một độ trễ; khác ở lời nói.')}</p>

<h3>${t('Who are the stakeholders?', 'Các bên liên quan là ai?')}</h3>
<p>${t('A stakeholder is anyone affected by the project or able to affect it. Map them by power (can they change scope, grade, money?) and interest (do they care daily?), then decide how you talk to each.', 'Bên liên quan là bất kỳ ai bị dự án ảnh hưởng hoặc ảnh hưởng được tới dự án. Xếp họ theo quyền lực (có đổi được phạm vi, điểm, tiền không?) và mức quan tâm (họ có để ý hằng ngày không?), rồi quyết cách nói chuyện với từng bên.')}</p>
${bang([t('Stakeholder (LabFlow)', 'Bên liên quan (LabFlow)'), t('Power / interest', 'Quyền lực / quan tâm'), t('How and how often', 'Cách và tần suất')], [
    [t('Supervisor (giảng viên hướng dẫn)', 'Giảng viên hướng dẫn'), t('High / high', 'Cao / cao'), t('Weekly report (lesson 6.3), questions log, iteration review demo — manage closely', 'Báo cáo tuần (bài 6.3), sổ câu hỏi, demo review iteration — theo sát')],
    [t('Final defence panel (hội đồng)', 'Hội đồng chấm cuối kỳ'), t('High / low until the end', 'Cao / thấp cho tới cuối'), t('Nothing weekly; a clear final demo and documents in their language — keep satisfied', 'Không cần hằng tuần; demo cuối rõ ràng và tài liệu bằng ngôn ngữ của họ — giữ hài lòng')],
    [t('Lab staff (imagined real users)', 'Cán bộ phòng lab (người dùng thật giả định)'), t('Low / high', 'Thấp / cao'), t('Usability check of S30, S35 once per iteration — keep informed', 'Thử khả dụng S30, S35 mỗi iteration một lần — giữ thông tin')],
    [t('Another team sharing the lab-room API', 'Nhóm khác dùng chung API phòng lab'), t('Low / low', 'Thấp / thấp'), t('Notice before breaking changes — monitor', 'Báo trước khi đổi phá vỡ tương thích — theo dõi')],
  ])}
<p>${t('Stakeholder analysis in requirements engineering: ', 'Phân tích bên liên quan trong kỹ nghệ yêu cầu: ')}${ac('software-requirements', 'swr302-2-1-stakeholder-user-class', t('SWR302 — stakeholders and user classes', 'SWR302 — bên liên quan và lớp người dùng'))}.</p>

<h3>${t('Lab 1: a linter for messages to clients', 'Lab 1: bộ soát cho thư gửi khách')}</h3>
<p>${t('C1 drafts the Friday update to the supervisor — honest, detailed, and written for the team chat:', 'C1 soạn thư cập nhật chiều thứ Sáu gửi giảng viên — trung thực, chi tiết, và viết theo kiểu nhóm chat:')}</p>
${out(MA.thuTruoc)}
<p>${t('The team keeps a glossary of internal words with what to say instead, and a script that also flags absolute promises, sentences over 30 words, and a message that asks for nothing by no date:', 'Nhóm giữ một bảng thuật ngữ nội bộ kèm cách nói thay, và một script cũng bắt lời hứa tuyệt đối, câu quá 30 từ, và thư không đề nghị gì, không có hạn:')}</p>
${out(MA.thuatNgu)}
${js(MA.soatThuatNgu)}
${out('$ node soat-thuat-ngu.mjs du-lieu/thu-gv-truoc.txt\n' + RA.thuTruoc)}
<p>${t(
    'Seventeen problems in three sentences. The worst is not the jargon; it is the last line — "certainly 100 % on time" — written with no evidence, to the person who grades you. Lab 2 produces the evidence; here is the rewritten message:',
    'Mười bảy vấn đề trong ba câu. Tệ nhất không phải thuật ngữ; mà là câu cuối — "chắc chắn xong 100 % đúng hạn" — viết không có bằng chứng, gửi đúng người chấm điểm bạn. Lab 2 tạo ra bằng chứng; đây là thư đã viết lại:')}</p>
${out(MA.thuSau)}
${out('$ node soat-thuat-ngu.mjs du-lieu/thu-gv-sau.txt\n' + RA.thuSau)}
${note(t(
    'Choose the glossary for the audience. Your supervisor knows what a PR is; the defence panel and a real lab manager may not; a Japanese customer’s business owner certainly does not. The script is a reminder, not a rule — "merge" in a message to your mentor is fine.',
    'Chọn bảng thuật ngữ theo người đọc. Giảng viên hướng dẫn biết PR là gì; hội đồng và một trưởng phòng lab thật có thể không; chủ doanh nghiệp phía khách Nhật chắc chắn không. Script là lời nhắc, không phải luật — viết "merge" trong tin gửi mentor là bình thường.'))}

<h3>${t('Lab 2: expectations as a range with probabilities', 'Lab 2: kỳ vọng là một khoảng kèm xác suất')}</h3>
<p>${t(
    'The supervisor asks the question every client asks: "will iteration 3 be ready by 16/04?" Fourteen screens are left. Instead of adding up everyone’s guesses, the script reads how many cards the team <em>actually</em> merged each working day in sprint 2 (the event log from chapter 6), and replays the future 10,000 times by drawing random days from that history — a Monte Carlo forecast, the method popularised for Kanban teams (',
    'Giảng viên hỏi đúng câu khách hàng nào cũng hỏi: "iteration 3 có kịp 16/04 không?" Còn mười bốn màn. Thay vì cộng dự đoán của từng người, script đọc số thẻ nhóm <em>thật sự</em> merge mỗi ngày làm việc ở sprint 2 (nhật ký sự kiện của chương 6), rồi phát lại tương lai 10.000 lần bằng cách bốc ngẫu nhiên các ngày từ lịch sử đó — dự báo Monte Carlo, phương pháp được phổ biến cho đội Kanban (')}${ag('agl-1-3-kanban', t('lesson 1.3 — throughput', 'bài 1.3 — thông lượng'))}).</p>
${js(MA.duBao)}
${out('$ node du-bao.mjs ../ch6/du-lieu/su-kien.csv 14 2027-03-15 2027-04-16\n' + RA.duBao)}
<p>${t(
    'Now the honest answer has numbers: "about two chances in three for all 14; 85 % for 12". That is what the rewritten message says, and it ends with a decision for the supervisor — which two screens become "if time allows". Three caveats you say out loud, not hide: fifteen days of history is short; the first four days of sprint 2 had zero merges (start-up), which makes the forecast pessimistic; and it assumes the screens left are of similar size. Re-run it every Friday with the new data; the range narrows as the iteration goes on.',
    'Giờ câu trả lời trung thực đã có số: "khoảng hai phần ba khả năng cho đủ 14 màn; 85 % cho 12 màn". Đó là điều thư viết lại đã nói, và nó kết thúc bằng một quyết định dành cho giảng viên — hai màn nào thành "nếu kịp". Ba lưu ý phải nói thẳng, không giấu: mười lăm ngày lịch sử là ngắn; bốn ngày đầu sprint 2 không có merge nào (giai đoạn khởi động), làm dự báo bi quan hơn; và nó giả định các màn còn lại có cỡ tương tự. Chạy lại mỗi thứ Sáu với dữ liệu mới; khoảng dự báo sẽ hẹp dần khi iteration trôi qua.')}</p>
${cl('warn', `<p>${t(
    '<strong>Never give a single date as a promise.</strong> A single date is the 50 % line at best: the team misses it half the time. Give the date you are 85 % sure of, say what would move it, and update early. If someone insists on one date, give the 85 % one and say so.',
    '<strong>Đừng bao giờ hứa một ngày duy nhất.</strong> Một ngày duy nhất cùng lắm là mốc 50 %: nhóm sẽ trượt một nửa số lần. Đưa ngày bạn chắc 85 %, nói điều gì có thể làm nó dịch, và cập nhật sớm. Nếu ai đó nhất định đòi một ngày, đưa ngày 85 % và nói rõ như vậy.')}</p>`)}

<h3>${t('Saying no — with options', 'Nói "không" — kèm phương án')}</h3>
<p>${t(
    'Scope, time and quality are connected; a request that adds scope must take something from the other two. "No" without options sounds like refusal; "yes" without options is a lie you pay for later. The shape that works:',
    'Phạm vi, thời gian và chất lượng gắn với nhau; một yêu cầu thêm phạm vi phải lấy bớt từ hai thứ còn lại. "Không" mà không có phương án nghe như từ chối; "vâng" mà không có phương án là lời nói dối bạn trả giá về sau. Khuôn hiệu quả:')}</p>
${out(t(
    'Supervisor: "Can you also add exporting the schedule to Excel for the demo?"\n\nAnswer: "We can. It is about 3 points of work (one screen + one API). Options:\n  A) add it and move S37 (equipment statistics) to iteration 4;\n  B) keep the current plan and add export in iteration 4;\n  C) a simpler CSV download from S23 — 1 point, fits this iteration.\nWe suggest C now and the full Excel in iteration 4. Which do you prefer? We will update the plan tonight."',
    'Giảng viên: "Em thêm được chức năng xuất lịch ra Excel cho buổi demo không?"\n\nTrả lời: "Dạ được ạ. Việc này khoảng 3 điểm (một màn + một API). Có ba hướng:\n  A) thêm vào và dời S37 (thống kê thiết bị) sang iteration 4;\n  B) giữ kế hoạch hiện tại, làm xuất tệp ở iteration 4;\n  C) bản tải CSV đơn giản từ S23 — 1 điểm, vừa iteration này.\nNhóm đề xuất C ngay bây giờ và bản Excel đầy đủ ở iteration 4. Thầy chọn hướng nào ạ? Tối nay nhóm cập nhật kế hoạch."'))}
<p>${t('With a client under contract the same request is a change request with an estimate and a price (', 'Với khách có hợp đồng, cùng yêu cầu đó là một change request có ước lượng và giá (')}${ag('agl-9-5-qa-cr', t('9.5 — Q&amp;A list and CR', '9.5 — Q&amp;A list và CR'))}); ${t('how Japanese and American clients phrase and expect this differently is in ', 'khách Nhật và khách Mỹ diễn đạt và kỳ vọng khác nhau thế nào thì xem ở ')}${ag('agl-11-4-tinh-huong-kho', t('11.4 — hard situations', '11.4 — tình huống khó'))}.</p>

<h3>${t('Demos are the real progress report', 'Demo mới là báo cáo tiến độ thật')}</h3>
<ul>
  <li>${t('Demo on staging, on the build you will hand over, with realistic data — not on the leader’s laptop with three fake rooms.', 'Demo trên staging, đúng bản sẽ bàn giao, với dữ liệu giống thật — không phải trên laptop trưởng nhóm với ba phòng giả.')}</li>
  <li>${t('Tell a user story: "a student books LAB-301 for Monday 07:00" — not a tour of menus.', 'Kể một câu chuyện người dùng: "sinh viên đặt LAB-301 sáng thứ Hai 07:00" — không phải đi dạo qua các menu.')}</li>
  <li>${t('Say what is <em>not</em> done before they find it. Show one known limitation yourself.', 'Nói điều gì <em>chưa</em> xong trước khi họ tự phát hiện. Tự chỉ ra một giới hạn đã biết.')}</li>
  <li>${t('End with the decisions you need and write them down within the hour.', 'Kết thúc bằng những quyết định bạn cần và ghi lại trong vòng một giờ.')}</li>
</ul>

<h3>🏦 ${t('A real case: "running smoothly" (TSB, 2018)', 'Chuyện thật: "đang chạy ổn định" (TSB, 2018)')}</h3>
<p>${t(
    'In April 2018 the UK bank TSB migrated its customers to a new IT platform over the weekend of 20–22 April. From the go-live, branch, telephone, online and mobile banking had serious problems; many customers could not access their accounts properly for weeks, and the bank took until December to return to business as usual. Public statements in the first days underplayed the scale of the problem, and the chief executive stepped down that September. On 20 December 2022 the FCA and PRA fined TSB £48.65 million for operational risk management and governance failures around the migration (',
    'Tháng 4/2018 ngân hàng TSB (Anh) chuyển khách hàng sang nền tảng CNTT mới trong cuối tuần 20–22/04. Từ lúc chạy thật, giao dịch tại chi nhánh, qua điện thoại, internet và di động gặp sự cố nghiêm trọng; nhiều khách không dùng được tài khoản bình thường suốt nhiều tuần, và tới tháng 12 ngân hàng mới trở lại hoạt động bình thường. Những phát biểu công khai trong các ngày đầu đã nói nhẹ đi quy mô sự cố, và tổng giám đốc từ chức vào tháng 9 năm đó. Ngày 20/12/2022, FCA và PRA phạt TSB 48,65 triệu bảng vì thất bại trong quản trị và quản lý rủi ro vận hành quanh đợt chuyển đổi (')}${ng('https://www.fca.org.uk/news/press-releases/tsb-fined-48m-operational-resilience-failings', 'FCA, 20/12/2022')}). ${t(
    'The communication lesson scales down to a student team: the moment you know a date or a feature is at risk, say so with what you know, what you do not, and when you will know more. Reassurance without evidence turns a technical problem into a trust problem.',
    'Bài học giao tiếp này thu nhỏ được về nhóm sinh viên: ngay khi biết một mốc hay một chức năng có nguy cơ, nói ra kèm điều bạn biết, điều chưa biết, và khi nào sẽ biết thêm. Trấn an không bằng chứng biến một vấn đề kỹ thuật thành vấn đề niềm tin.')}</p>

<h3>${t('At work (OJT, outsourcing)', 'Khi đi làm (OJT, outsourcing)')}</h3>
<p>${t(
    'As a fresher you will rarely talk to the client alone at first; you will write parts of the daily report, answer a Q&amp;A item, or present your feature in a demo. Apply the same three tools: no internal jargon in anything the client reads, a range and its assumptions instead of "tomorrow", and options instead of a bare "no". Write it in the ticket or the report, not only in a call. Country-specific habits (indirect "no" in Japan, direct pushback in the US) are in ',
    'Là fresher, ban đầu bạn hiếm khi nói chuyện một mình với khách; bạn sẽ viết một phần báo cáo ngày, trả lời một mục Q&amp;A, hoặc trình bày tính năng của mình trong buổi demo. Dùng đúng ba công cụ: không thuật ngữ nội bộ trong bất cứ thứ gì khách đọc, đưa khoảng kèm giả định thay vì "mai xong", và đưa phương án thay vì một chữ "không" trơ trọi. Ghi vào ticket hoặc báo cáo, đừng chỉ nói trong cuộc gọi. Thói quen riêng từng nước (lời từ chối gián tiếp ở Nhật, phản biện thẳng ở Mỹ) có ở ')}${ag('agl-11-1-khach-nhat', '11.1')} ${t('and', 'và')} ${ag('agl-11-2-khach-my', '11.2')}.</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
  <li>${t('Run <code>du-bao.mjs</code> with 10 screens left and the same deadline. What is the probability, and how many screens can you commit to at 85 %?', 'Chạy <code>du-bao.mjs</code> với 10 màn còn lại và cùng hạn. Xác suất là bao nhiêu, và ở mức 85 % bạn cam kết được bao nhiêu màn?')}</li>
  <li>${t('Write the 3-sentence message to the supervisor on Wednesday 31/03 when the forecast for 12 screens drops to 60 %. It must pass <code>soat-thuat-ngu.mjs</code>.', 'Viết thư 3 câu gửi giảng viên thứ Tư 31/03 khi dự báo cho 12 màn tụt xuống 60 %. Thư phải qua <code>soat-thuat-ngu.mjs</code>.')}</li>
  <li>${t('Fill a stakeholder table for your own SWP391 topic: at least four rows, power/interest, channel and frequency.', 'Điền bảng bên liên quan cho đề tài SWP391 của chính bạn: ít nhất bốn dòng, quyền lực/quan tâm, kênh và tần suất.')}</li>
</ol>
${giai(t('Solutions for 1 and 2', 'Lời giải câu 1 và 2'), out('$ node du-bao.mjs ../ch6/du-lieu/su-kien.csv 10 2027-03-15 2027-04-16\n' + RA.baiTap74) + `<p>${t(
    'With 10 screens the chance is 97 % and all 10 fit inside the 85 % line — the difference between 10 and 14 screens is the difference between a comfortable and a risky iteration. For 2, a message that passes the linter (the first draft did not: its opening sentence had 38 words, so it was split). The Vietnamese version is what was checked; the percentages are for the exercise — recompute them from your own run:',
    'Với 10 màn, xác suất là 97 % và cả 10 màn nằm trong mốc 85 % — chênh giữa 10 và 14 màn là chênh giữa một iteration thoải mái và một iteration rủi ro. Câu 2, một thư qua được bộ soát (bản nháp đầu không qua: câu mở đầu dài 38 từ, nên đã tách đôi). Bản tiếng Việt là bản đã chạy soát; các con số phần trăm chỉ dùng cho bài tập — hãy tính lại từ lần chạy của chính bạn:')}</p>` + out(MA.thu3103) + out(RA.thu3103))}

${phongVan([
    [t('"How do you explain a technical problem to a non-technical client?"', '"Bạn giải thích một vấn đề kỹ thuật cho khách không rành kỹ thuật thế nào?"'), t('Start from the effect on them, not the cause in the code: "students could not book morning slots on the test version". Then what we did, what is left, and the decision I need. I keep a glossary of internal words and check messages against it.', 'Bắt đầu từ ảnh hưởng tới họ, không phải nguyên nhân trong mã: "sinh viên không đặt được ca sáng trên bản chạy thử". Sau đó là điều chúng tôi đã làm, điều còn lại, và quyết định tôi cần. Tôi giữ một bảng thuật ngữ nội bộ và soát thư theo nó.')],
    [t('"The client asks when it will be done. What do you say?"', '"Khách hỏi bao giờ xong. Bạn trả lời gì?"'), t('A range with a probability and its assumptions, from our real throughput: "about 68 % for all 14 screens by 16/04, 85 % for 12; I’ll update every Friday". Then I let them choose what is in the 85 % part.', 'Một khoảng kèm xác suất và giả định, từ thông lượng thật của nhóm: "khoảng 68 % cho đủ 14 màn trước 16/04, 85 % cho 12 màn; mỗi thứ Sáu tôi cập nhật". Rồi để họ chọn cái gì nằm trong phần 85 %.')],
    [t('"How do you handle scope creep?"', '"Bạn xử lý phình phạm vi thế nào?"'), t('Never a bare yes or no: estimate the request, show what it displaces, offer a cheaper version, propose one, get a decision in writing. Under contract it becomes a change request.', 'Không bao giờ chỉ vâng hay không: ước lượng yêu cầu, cho thấy nó đẩy cái gì ra, đưa một bản rẻ hơn, đề xuất một hướng, lấy quyết định bằng văn bản. Có hợp đồng thì đó là change request.')],
    [t('"Tell me about delivering bad news."', '"Kể về một lần bạn báo tin xấu."'), t('When our forecast dropped, I told the supervisor the same week with the cause, the new probability and a proposal to move one screen, and asked for a decision by Friday. Early bad news with a proposal is a planning input; late bad news is a failure.', 'Khi dự báo giảm, tôi báo giảng viên ngay trong tuần, kèm nguyên nhân, xác suất mới và đề xuất dời một màn, và xin quyết định trước thứ Sáu. Tin xấu báo sớm kèm đề xuất là dữ liệu để lập kế hoạch; tin xấu báo muộn là thất bại.')],
  ], en)}

${thuatNgu([
    [t('stakeholder', 'bên liên quan'), t('Anyone affected by the project or able to affect it.', 'Bất kỳ ai bị dự án ảnh hưởng hoặc ảnh hưởng được tới dự án.')],
    [t('power/interest grid', 'lưới quyền lực/quan tâm'), t('Placing stakeholders to decide how closely to manage each.', 'Cách xếp các bên liên quan để quyết mức độ theo sát từng bên.')],
    [t('Monte Carlo forecast', 'dự báo Monte Carlo'), t('Replaying the future many times from real throughput to get dates with probabilities.', 'Phát lại tương lai nhiều lần từ thông lượng thật để có các ngày kèm xác suất.')],
    [t('scope creep', 'phình phạm vi'), t('Requirements growing without matching time or trade-offs.', 'Yêu cầu tăng dần mà không đổi tương ứng thời gian hay đánh đổi.')],
    [t('plain language', 'ngôn ngữ dễ hiểu'), t('Words the reader already uses; effects before causes.', 'Từ người đọc vốn dùng; nói hệ quả trước nguyên nhân.')],
  ], en)}

${tomTat([
    t('Map stakeholders by power and interest; talk to each at the right depth and frequency.', 'Xếp các bên liên quan theo quyền lực và mức quan tâm; nói với mỗi bên đúng độ sâu và tần suất.'),
    t('Check messages for jargon, absolute promises, long sentences, a request and a deadline — 17 problems became 0.', 'Soát thư: thuật ngữ, lời hứa tuyệt đối, câu dài, có đề nghị và hạn — 17 vấn đề thành 0.'),
    t('Forecast from real throughput: 68 % for 14 screens, 85 % for 12; state the assumptions, update weekly.', 'Dự báo từ thông lượng thật: 68 % cho 14 màn, 85 % cho 12; nói rõ giả định, cập nhật hằng tuần.'),
    t('Say no with options: estimate, what it displaces, a cheaper version, a proposal.', 'Nói không kèm phương án: ước lượng, cái bị đẩy ra, bản rẻ hơn, một đề xuất.'),
    t('Bad news early, with evidence — TSB 2018 shows what reassurance without evidence costs.', 'Tin xấu báo sớm, có bằng chứng — TSB 2018 cho thấy cái giá của trấn an không bằng chứng.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-7-5-lab', t('7.5 — Lab: one week with four roles', '7.5 — Lab: một tuần với bốn vai'))}.</p>
`);
};

export default {
  title: '7.4 — Talking to clients and stakeholders|||7.4 — Nói chuyện với khách hàng và các bên liên quan',
  slug: 'agl-7-4-khach-hang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khách mua niềm tin, không mua mã: bản đồ bên liên quan của LabFlow (giảng viên, hội đồng, cán bộ phòng lab, nhóm dùng chung API); lab chạy thật soat-thuat-ngu.mjs: thư gửi giảng viên bản nhóm chat 17 vấn đề (thuật ngữ, "chắc chắn 100%", câu 40 từ, không đề nghị, không hạn) ⇒ bản sửa đạt; du-bao.mjs Monte Carlo 10.000 lần từ thông lượng thật sprint 2: 14 màn ⇒ 68 % kịp 16/04, cam kết 12 để chắc 85 %; nói "không" kèm phương án; demo là báo cáo tiến độ; TSB 2018 (phạt 48,65 triệu bảng); OJT.',
  content: L74(true) + L74(false),
};
