/**
 * Tiếng Anh kỹ thuật khi đi làm — Mục 0: Tiếng Anh như một công cụ làm việc (soạn 22/11/2026).
 * Slug + title chương khớp khung trong ../tieng-anh-ky-thuat-di-lam.mjs (tak-0-8, tak-0-9, tak-0-1).
 * Mẫu email/chat/ticket là mẫu DỰNG LẠI theo kiểu thường gặp ở công ty outsourcing (đã che tên, không phải thư thật của khách nào);
 * sự cố Mars Climate Orbiter lấy từ báo cáo chính thức của NASA (Mishap Investigation Board, Phase I, 10/11/1999).
 */
import { mau, saiDung, tuVung } from './_chung.mjs';

/* ═════════════ Bắt đầu tại đây (1/2) ═════════════ */
const TUAN = (en) => `
<table>
<thead><tr><th>${en ? 'Day' : 'Ngày'}</th><th>${en ? 'What you do in English' : 'Bạn làm gì bằng tiếng Anh'}</th><th>${en ? 'Skill' : 'Kỹ năng'}</th><th>${en ? 'Chapter' : 'Chương'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Monday 09:00' : 'Thứ Hai 09:00'}</td><td>${en ? 'Read the README and the setup guide of the project you just joined; the build fails with an English error message' : 'Đọc README và hướng dẫn cài đặt của dự án vừa vào; build lỗi với một thông báo tiếng Anh'}</td><td>${en ? 'Reading' : 'Đọc'}</td><td>1</td></tr>
<tr><td>${en ? 'Monday 14:00' : 'Thứ Hai 14:00'}</td><td>${en ? 'Your first ticket: the description and acceptance criteria are written by the client in English' : 'Ticket đầu tiên: mô tả và tiêu chí chấp nhận do khách viết bằng tiếng Anh'}</td><td>${en ? 'Reading' : 'Đọc'}</td><td>1, 2</td></tr>
<tr><td>${en ? 'Tuesday' : 'Thứ Ba'}</td><td>${en ? 'Something in the spec is unclear — you add two questions to the Q&amp;A list' : 'Có chỗ trong spec không rõ — bạn thêm hai câu vào Q&amp;A list'}</td><td>${en ? 'Writing' : 'Viết'}</td><td>5</td></tr>
<tr><td>${en ? 'Wednesday' : 'Thứ Tư'}</td><td>${en ? 'You push code: commit messages, a pull request description, and you answer review comments' : 'Bạn đẩy code: commit message, mô tả pull request, trả lời bình luận review'}</td><td>${en ? 'Writing' : 'Viết'}</td><td>3</td></tr>
<tr><td>${en ? 'Thursday' : 'Thứ Năm'}</td><td>${en ? 'You find a bug in another module and write a bug report; the task will be late, so you tell your lead' : 'Bạn thấy lỗi ở module khác và viết bug report; task sẽ trễ nên bạn báo trưởng nhóm'}</td><td>${en ? 'Writing' : 'Viết'}</td><td>2, 4</td></tr>
<tr><td>${en ? 'Every morning' : 'Sáng nào cũng vậy'}</td><td>${en ? 'Stand-up: 60 seconds on what you did, what you will do, what blocks you' : 'Standup: 60 giây nói hôm qua làm gì, hôm nay làm gì, vướng gì'}</td><td>${en ? 'Speaking' : 'Nói'}</td><td>6</td></tr>
<tr><td>${en ? 'Friday' : 'Thứ Sáu'}</td><td>${en ? 'Sprint demo with the client on Teams/Zoom — Japanese, Indian or American accent' : 'Demo cuối sprint với khách qua Teams/Zoom — giọng Nhật, Ấn hoặc Mỹ'}</td><td>${en ? 'Speaking + listening' : 'Nói + nghe'}</td><td>6</td></tr>
</tbody>
</table>`;

const MAU_TICKET = mau(`
[LF-214] Export loan history as CSV

As a lab manager, I want to export the loan history of a date range as a CSV file
so that I can attach it to the monthly report.

Acceptance criteria
- The export MUST include loans whose start date is inside the selected range.
- The file SHOULD be named loans_<from>_<to>.csv.
- Columns: Equipment code, Borrower, Start date, Due date, Returned date.
- Dates are displayed in the user's timezone.

Notes: max range is 1 year. Please confirm with us if the range is bigger.
`);

const MAU_CHAT = mau(`
#labflow-dev  (Teams, 08:42)
Kenji (client PM): Good morning. About LF-214, is the export available on staging today?
You: Good morning Kenji. Not yet — I'm finishing the date filter now.
     I expect to deploy it to staging by 3 PM (ICT). I'll post here when it's ready.
Kenji: Thank you. Please also check the timezone of the "Returned date" column.
You: Noted. Just to confirm: should it use the user's timezone, the same as the other date columns?
Kenji: Yes, same.
`);

const L08 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Section 0 · Start here' : 'Mục 0 · Bắt đầu tại đây'}</span>
<h2>${en ? 'Start here (1/2) — The English of your first month at work' : 'Bắt đầu tại đây (1/2) — Thứ tiếng Anh bạn dùng trong tháng đầu đi làm'}</h2>
<p class="lead">${en
    ? 'This course is not an English course in the school sense. There is no grammar chapter, no list of 3,000 words. It teaches the English you will actually type and say in the first month of an internship or a job at a company with foreign clients: reading a README, writing a ticket, a commit, a pull request, an email that asks a question, a 60-second stand-up. Each lesson gives you a real-looking template, explains why it is written that way, shows the mistakes Vietnamese developers make most often, and makes you practise.'
    : 'Khoá này không phải khoá tiếng Anh kiểu ở trường. Không có chương ngữ pháp, không có danh sách 3.000 từ. Nó dạy đúng thứ tiếng Anh bạn sẽ GÕ và NÓI trong tháng đầu thực tập hoặc đi làm ở công ty có khách nước ngoài: đọc README, viết ticket, commit, pull request, email hỏi lại, standup 60 giây. Mỗi bài đưa một mẫu giống thật, giải thích vì sao viết như vậy, chỉ ra lỗi người Việt hay mắc nhất, rồi bắt bạn luyện.'}</p>

<h3>${en ? 'What you are learning this for' : 'Học để làm gì'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? '🎯 The internship (OJT)' : '🎯 Kỳ OJT'}</span><span class="v">${en
    ? 'Companies such as FPT Software work mostly for clients in Japan, the US and Europe. Even when your team speaks Vietnamese all day, the tickets, the specs, the code review and the client meetings are in English. Interns who cannot read a ticket alone are given less interesting work.'
    : 'Các công ty như FPT Software làm chủ yếu cho khách Nhật, Mỹ, châu Âu. Kể cả khi cả nhóm nói tiếng Việt cả ngày, ticket, spec, code review và họp khách vẫn bằng tiếng Anh. Thực tập sinh không tự đọc được ticket thường được giao việc ít thú vị hơn.'}</span></div>
  <div class="kv"><span class="k">${en ? '🧪 The company English test' : '🧪 Bài test tiếng Anh của công ty'}</span><span class="v">${en
    ? 'Many companies test English at entry and again before you join a client-facing project. Chapter 8 covers the common formats (described in general terms — always check the current format with HR).'
    : 'Nhiều công ty kiểm tra tiếng Anh lúc vào và trước khi cho bạn vào dự án làm với khách. Chương 8 nói về các dạng bài phổ biến (mô tả chung — dạng bài hiện hành luôn hỏi lại HR).'}</span></div>
  <div class="kv"><span class="k">${en ? '📈 Your career' : '📈 Con đường nghề'}</span><span class="v">${en
    ? 'Promotion to a role that talks to clients (team lead, BrSE, solution architect) depends as much on clear English as on code. The good news: work English is a small, repetitive language. The same 100 sentence patterns cover most of a week.'
    : 'Lên vị trí phải nói chuyện với khách (trưởng nhóm, BrSE, kiến trúc sư giải pháp) phụ thuộc vào tiếng Anh rõ ràng không kém gì code. Tin tốt: tiếng Anh công việc là một thứ tiếng nhỏ và lặp lại. Khoảng 100 mẫu câu đã phủ gần hết một tuần làm việc.'}</span></div>
</div>

<h3>${en ? 'A week at an outsourcing company, in English' : 'Một tuần ở công ty outsourcing, tính bằng tiếng Anh'}</h3>
<p>${en
    ? 'Here is a realistic first week on a project. The project is LabFlow, the sample lab-equipment system used across the courses on this site; the client is a Japanese company that writes to you in English.'
    : 'Dưới đây là tuần đầu khá sát thật khi vào một dự án. Dự án là LabFlow — hệ thống quản lý thiết bị phòng lab dùng làm mẫu xuyên suốt các khoá trên trang này; khách là một công ty Nhật viết cho bạn bằng tiếng Anh.'}</p>
${TUAN(en)}
<p>${en
    ? 'Notice the proportion: most of your English is <strong>reading and writing short texts</strong>. Speaking matters, but it is a few minutes a day. That is why this course spends five chapters on reading and writing and one on speaking.'
    : 'Để ý tỉ lệ: phần lớn tiếng Anh của bạn là <strong>đọc và viết những đoạn ngắn</strong>. Nói quan trọng, nhưng chỉ vài phút mỗi ngày. Vì vậy khoá dành năm chương cho đọc–viết và một chương cho nói.'}</p>

<h3>${en ? 'What it looks like — a ticket and a chat' : 'Trông nó ra sao — một ticket và một đoạn chat'}</h3>
${MAU_TICKET}
<p>${en
    ? 'You will learn to read this in Chapter 1: <code>MUST</code> and <code>SHOULD</code> are not the same strength (lesson 1.3); "Please confirm with us" means "ask before you decide"; "max range is 1 year" leaves a question open — what happens at 1 year and 1 day? That becomes a Q&amp;A item.'
    : 'Chương 1 dạy bạn đọc đoạn này: <code>MUST</code> và <code>SHOULD</code> không mạnh như nhau (bài 1.3); "Please confirm with us" nghĩa là "hỏi trước khi tự quyết"; "max range is 1 year" còn bỏ ngỏ một câu hỏi — chọn 1 năm 1 ngày thì sao? Câu đó sẽ thành một dòng Q&amp;A.'}</p>
${MAU_CHAT}
<p>${en
    ? 'Look at what the developer does: answers the question directly ("Not yet"), gives a reason in a few words, gives a <strong>time with a timezone</strong>, promises the next update, and turns a vague request into a yes/no question ("Just to confirm: …?"). No perfect grammar is needed — only these habits. They are the backbone of Chapters 4–6.'
    : 'Để ý cách bạn dev trả lời: trả lời thẳng câu hỏi ("Not yet"), lý do vài chữ, đưa <strong>giờ kèm múi giờ</strong>, hứa lần cập nhật kế tiếp, và biến một yêu cầu mơ hồ thành câu hỏi có/không ("Just to confirm: …?"). Không cần ngữ pháp hoàn hảo — chỉ cần những thói quen này. Chúng là xương sống của Chương 4–6.'}</p>

<h3>${en ? 'Japanese, American and European clients write differently' : 'Khách Nhật, Mỹ, châu Âu viết tiếng Anh khác nhau'}</h3>
<table>
<thead><tr><th></th><th>${en ? 'Typical style' : 'Kiểu thường gặp'}</th><th>${en ? 'What to watch for' : 'Cần để ý'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Japanese clients' : 'Khách Nhật'}</td><td>${en ? 'Very polite, long sentences, many passives ("It is required that…"), words translated from Japanese ("confirm" for 確認 = check)' : 'Rất lịch sự, câu dài, nhiều bị động ("It is required that…"), từ dịch từ tiếng Nhật ("confirm" cho 確認 = kiểm tra lại)'}</td><td>${en ? '"We will consider it" is often a soft no. Detailed specs; they expect written confirmation and a Q&amp;A list.' : '"We will consider it" nhiều khi là lời từ chối nhẹ. Spec rất chi tiết; khách mong xác nhận bằng văn bản và có Q&amp;A list.'}</td></tr>
<tr><td>${en ? 'American clients' : 'Khách Mỹ'}</td><td>${en ? 'Short, informal, fast ("Hey, quick q — can we ship this Friday?"), idioms ("ballpark", "circle back")' : 'Ngắn, thân mật, nhanh ("Hey, quick q — can we ship this Friday?"), thành ngữ ("ballpark", "circle back")'}</td><td>${en ? 'Requirements are often in a chat message, not a spec. Silence is read as "everything is fine".' : 'Yêu cầu hay nằm trong tin nhắn chat chứ không trong spec. Im lặng bị hiểu là "mọi thứ ổn".'}</td></tr>
<tr><td>${en ? 'European clients' : 'Khách châu Âu'}</td><td>${en ? 'English is often their second language too: direct, plain, sometimes blunt (German, Dutch)' : 'Tiếng Anh thường cũng là ngoại ngữ của họ: thẳng, đơn giản, đôi khi cộc (Đức, Hà Lan)'}</td><td>${en ? 'Bluntness is not anger. Plain English is the best match — they are not impressed by fancy words either.' : 'Cộc không có nghĩa là giận. Tiếng Anh đơn giản là hợp nhất — họ cũng không ấn tượng với từ hoa mỹ.'}</td></tr>
</tbody>
</table>
<div class="callout warn"><p>${en
    ? 'These are tendencies, not rules — every person is different. The useful conclusion is the same for all three: <strong>write short, plain sentences and confirm in writing</strong>. Plain English is understood by a native speaker in Ohio and by a Japanese PM reading with a translator.'
    : 'Đây là xu hướng, không phải luật — mỗi người một khác. Kết luận có ích thì giống nhau cho cả ba: <strong>viết câu ngắn, đơn giản và xác nhận bằng văn bản</strong>. Tiếng Anh đơn giản thì người bản xứ ở Ohio hiểu, và anh PM Nhật đọc qua công cụ dịch cũng hiểu.'}</p></div>

<h3>${en ? 'How this course teaches: patterns by situation, not grammar from zero' : 'Cách khoá này dạy: mẫu câu theo tình huống, không học ngữ pháp từ đầu'}</h3>
<ol>
<li>${en ? '<strong>Situation first.</strong> Every lesson starts from a task you will really have ("the task will be two days late").' : '<strong>Tình huống trước.</strong> Bài nào cũng bắt đầu từ một việc bạn sẽ gặp thật ("task sẽ trễ hai ngày").'}</li>
<li>${en ? '<strong>A template you can copy.</strong> Developers copy templates all day — PR templates, bug report templates. Copying good English is not cheating; it is how native speakers learned it too.' : '<strong>Một mẫu chép được.</strong> Dev chép mẫu cả ngày — mẫu PR, mẫu bug report. Chép tiếng Anh tốt không phải gian lận; người bản xứ cũng học như thế.'}</li>
<li>${en ? '<strong>Why it is written that way.</strong> So you can adapt the template instead of forcing it.' : '<strong>Vì sao viết như vậy.</strong> Để bạn biến tấu được mẫu, không phải nhét ép.'}</li>
<li>${en ? '<strong>The Vietnamese-speaker mistakes.</strong> A short table of the errors that appear again and again in our English — most come from translating Vietnamese word by word.' : '<strong>Lỗi của người Việt.</strong> Một bảng ngắn các lỗi lặp đi lặp lại trong tiếng Anh của chúng ta — phần lớn do dịch từng chữ từ tiếng Việt.'}</li>
<li>${en ? '<strong>Practice with a model answer</strong> and a "Done when" line, so you know when you have finished.' : '<strong>Bài luyện có đáp án gợi ý</strong> và dòng "Đạt khi" để bạn biết lúc nào là xong.'}</li>
</ol>

<h3>${en ? 'The course map' : 'Bản đồ khoá'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Ch. 1 — Read' : 'Ch. 1 — Đọc'}</span><span class="v">${en ? 'Docs, error messages, issues, release notes, specs, MUST/SHOULD/MAY.' : 'Tài liệu, thông báo lỗi, issue, release notes, spec, MUST/SHOULD/MAY.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Ch. 2–3 — Write for the team' : 'Ch. 2–3 — Viết cho nhóm'}</span><span class="v">${en ? 'Tickets, bug reports, status updates; commits, PRs, review comments.' : 'Ticket, bug report, cập nhật trạng thái; commit, PR, bình luận review.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Ch. 4–5 — Write for the client' : 'Ch. 4–5 — Viết cho khách'}</span><span class="v">${en ? 'Emails (clarify, delay, incident), chat etiquette, Q&amp;A lists, written confirmation, scope creep.' : 'Email (hỏi lại, báo trễ, báo sự cố), phép lịch sự khi chat, Q&amp;A list, xác nhận bằng văn bản, phạm vi phình to.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Ch. 6–7 — Speak and listen' : 'Ch. 6–7 — Nói và nghe'}</span><span class="v">${en ? 'Stand-up, demo, meetings, accents; vocabulary by situation and tech terms we mispronounce.' : 'Standup, demo, họp, các giọng; từ vựng theo tình huống và thuật ngữ hay đọc sai.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Ch. 8 — Test and capstone' : 'Ch. 8 — Bài test và dự án cuối'}</span><span class="v">${en ? 'Company test formats, then a simulated work week in English with a rubric for every product.' : 'Các dạng bài test của công ty, rồi một tuần làm việc mô phỏng bằng tiếng Anh, sản phẩm nào cũng có rubric.'}</span></div>
</div>

<h3>${en ? 'Mistakes you will see fixed in this course' : 'Những lỗi bạn sẽ thấy được sửa trong khoá'}</h3>
${saiDung([
    ['Can you explain me this requirement?', 'Could you explain this requirement to me?', en ? '"explain" takes the thing first: explain something (to someone).' : '"explain" đi với vật trước: explain something (to someone).'],
    ['We will discuss about it tomorrow.', 'We will discuss it tomorrow.', en ? '"discuss" has no "about" (but "talk about").' : '"discuss" không có "about" (còn "talk about" thì có).'],
    ['I have finished task yesterday.', 'I finished the task yesterday.', en ? 'A past time ("yesterday") ⇒ past simple, and the article "the".' : 'Có mốc quá khứ ("yesterday") ⇒ quá khứ đơn, và cần mạo từ "the".'],
    ['Dear Mr. Kenji,', 'Hi Kenji, / Dear Mr. Tanaka,', en ? '"Mr." goes with the family name, never with the first name.' : '"Mr." đi với HỌ, không bao giờ đi với tên.'],
    ['Please kindly help me check.', 'Could you please check …?', en ? '"please kindly" is doubled politeness and sounds odd; say what to check.' : '"please kindly" là lịch sự hai lần, nghe lạ; và phải nói kiểm cái gì.'],
  ], en)}

${tuVung(en ? [
    ['Just to confirm, …?', 'turns your understanding into a yes/no question', 'Just to confirm, the export uses the user\'s timezone?'],
    ['I expect to … by &lt;time&gt; (&lt;timezone&gt;)', 'a time promise that cannot be misread', 'I expect to deploy it by 3 PM (ICT).'],
    ['I\'ll post here when …', 'promises the next update', 'I\'ll post here when it\'s ready.'],
    ['Noted.', 'short "I have read it and will act on it"', 'Noted, I\'ll check the timezone too.'],
    ['acceptance criteria', 'the conditions a ticket must meet to be accepted', 'Does it meet the acceptance criteria?'],
  ] : [
    ['Just to confirm, …?', 'biến điều bạn hiểu thành câu hỏi có/không', 'Just to confirm, the export uses the user\'s timezone?'],
    ['I expect to … by &lt;giờ&gt; (&lt;múi giờ&gt;)', 'hẹn giờ không thể hiểu nhầm', 'I expect to deploy it by 3 PM (ICT).'],
    ['I\'ll post here when …', 'hứa lần cập nhật kế tiếp', 'I\'ll post here when it\'s ready.'],
    ['Noted.', '"đã đọc và sẽ làm" — ngắn gọn', 'Noted, I\'ll check the timezone too.'],
    ['acceptance criteria', 'các điều kiện để ticket được chấp nhận', 'Does it meet the acceptance criteria?'],
  ], en)}

<h3>🧪 ${en ? 'Practice (10 minutes): your English touchpoints' : 'Thực hành (10 phút): những điểm chạm tiếng Anh của bạn'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Take one day of your current team project (SWP391, EXE or a part-time job). List every moment you read or wrote something technical — even in Vietnamese.' : 'Lấy một ngày của dự án nhóm hiện tại (SWP391, EXE hoặc việc làm thêm). Liệt kê mọi lúc bạn đọc hoặc viết một thứ kỹ thuật — kể cả bằng tiếng Việt.'}</li>
<li>${en ? 'Next to each item, write which lesson of this course covers it (use the table above).' : 'Cạnh mỗi mục, ghi bài nào của khoá này phủ nó (dùng bảng ở trên).'}</li>
<li>${en ? 'Rewrite the developer reply in the chat sample for a different situation: the export will be ready <em>tomorrow</em> morning, not today.' : 'Viết lại câu trả lời của bạn dev trong đoạn chat mẫu cho tình huống khác: bản export phải <em>sáng mai</em> mới xong, không phải hôm nay.'}</li>
</ol>
<p><strong>${en ? 'Model answer for step 3:' : 'Đáp án gợi ý bước 3:'}</strong> <em>Good morning Kenji. Not yet — the date filter needs more testing. I expect to deploy it to staging by 10 AM (ICT) tomorrow. I'll post here when it's ready.</em></p>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your list has at least 6 items, each mapped to a chapter, and your reply has a direct answer, a reason, a time with a timezone and a promise of the next update.' : 'danh sách có ít nhất 6 mục, mục nào cũng gắn với một chương, và câu trả lời có đủ: trả lời thẳng, lý do, giờ kèm múi giờ, hứa lần cập nhật kế tiếp.'}</p></div>

<a class="link-card lien-ket-cheo" href="/courses/interview-prep">
  <span class="lc-ico">🎤</span>
  <span class="lc-body"><span class="lc-title">${en ? 'Interview Prep — Chapter 8: English for interviews' : 'Chuẩn bị phỏng vấn — Chương 8: tiếng Anh phỏng vấn'}</span><span class="lc-sub">${en ? 'English BEFORE you get the job is taught there; this course is the English AFTER.' : 'Tiếng Anh TRƯỚC khi có việc học ở đó; khoá này là tiếng Anh SAU khi đã đi làm.'}</span></span>
</a>
</div>
`;

/* ═════════════ Bắt đầu tại đây (2/2) ═════════════ */
const MAU_IM_LANG = mau(`
Ticket LF-188: "The list SHOULD be sorted by due date."
Day 1  Intern reads "should" as "nice to have". Sorts by created date (already available). Says nothing.
Day 6  Sprint demo. Client: "Why is it not sorted by due date? Overdue items must be on top."
Day 7  Rework + re-test + a second demo. The client writes in the retro: "Team did not ask questions."
`);

const MAU_CUC = mau(`
Subject: export

Your requirement is wrong. Date range cannot be more than 1 year. Fix the spec.
`);
const MAU_LICH_SU = mau(`
Subject: [LF-214] Question about the maximum date range for CSV export

Hi Kenji,

While implementing LF-214, I noticed the spec says the maximum range is 1 year,
but the report example on page 3 uses a range of 14 months.

Could you confirm which one is correct?
  A) Keep the 1-year limit and show an error for longer ranges.
  B) Allow up to 14 months.
We will go with A unless we hear otherwise by Thursday, 5 PM (JST).

Best regards,
Minh
`);

const L09 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Section 0 · Start here' : 'Mục 0 · Bắt đầu tại đây'}</span>
<h2>${en ? 'Start here (2/2) — When English goes wrong at work: silence, ambiguity, the wrong tone' : 'Bắt đầu tại đây (2/2) — Khi tiếng Anh hỏng việc: im lặng, mơ hồ, sai giọng'}</h2>
<p class="lead">${en
    ? 'Bad grammar rarely breaks a project. People understand "I finish the task yesterday" perfectly. What breaks projects is three other things: <strong>not asking</strong> (silence), <strong>not being precise</strong> (ambiguity) and <strong>sounding rude without meaning to</strong> (tone). This lesson shows each one, with a real engineering disaster and three illustrative office scenarios, so you know what the rest of the course is protecting you from.'
    : 'Sai ngữ pháp hiếm khi làm hỏng dự án. Người ta hiểu hoàn toàn câu "I finish the task yesterday". Thứ làm hỏng dự án là ba chuyện khác: <strong>không hỏi</strong> (im lặng), <strong>không chính xác</strong> (mơ hồ) và <strong>nghe như vô lễ mà không cố ý</strong> (sai giọng). Bài này cho bạn thấy từng thứ, bằng một thảm hoạ kỹ thuật có thật và ba tình huống văn phòng minh hoạ, để bạn biết phần còn lại của khoá đang bảo vệ bạn khỏi cái gì.'}</p>

<h3>${en ? 'A real incident: Mars Climate Orbiter (1999)' : 'Sự cố có thật: Mars Climate Orbiter (1999)'}</h3>
<div class="pitfall"><p>${en
    ? '<strong>Source: NASA Mars Climate Orbiter Mishap Investigation Board, Phase I Report, 10 November 1999.</strong> On 23 September 1999 the spacecraft was lost while entering orbit around Mars: it passed far closer to the planet than planned and was destroyed or skipped off into space. The board found the root cause was the "failure to use metric units in the coding of a ground software file, \'Small Forces,\' used in trajectory models". One team\'s software produced thruster impulse in pound-force seconds; the other team\'s navigation software, following the interface specification, read the numbers as newton-seconds — a factor of about 4.45. The specification already said metric. Nobody\'s code crashed. Two teams simply read the same numbers with different assumptions, and the board also listed inadequate communication between the project teams among the contributing factors: small discrepancies in the trajectory were noticed during the flight but not resolved.'
    : '<strong>Nguồn: báo cáo Phase I của Hội đồng điều tra sự cố Mars Climate Orbiter, NASA, 10/11/1999.</strong> Ngày 23/9/1999 tàu thăm dò mất tích khi vào quỹ đạo Sao Hoả: nó đi gần hành tinh hơn dự kiến rất nhiều và bị phá huỷ hoặc văng ra không gian. Hội đồng kết luận nguyên nhân gốc là "không dùng đơn vị hệ mét khi viết mã một tệp phần mềm mặt đất tên \'Small Forces\', dùng trong mô hình quỹ đạo". Phần mềm của một đội xuất xung lực động cơ theo pound-lực·giây; phần mềm dẫn đường của đội kia, làm đúng đặc tả giao tiếp, đọc các số đó như newton·giây — lệch khoảng 4,45 lần. Đặc tả vốn đã ghi là hệ mét. Không đoạn code nào bị crash. Chỉ là hai đội đọc cùng những con số với hai giả định khác nhau, và hội đồng còn ghi việc trao đổi giữa các đội không đầy đủ là một yếu tố góp phần: những sai lệch nhỏ về quỹ đạo đã được nhận ra trong chuyến bay nhưng không được giải quyết tới nơi.'}</p></div>
<p>${en
    ? 'Two lessons for a developer. First, a number without a unit, a date without a timezone, a "should" without a decision is an <strong>ambiguity</strong>, and ambiguities are bugs that no compiler finds. Second, the people who noticed something strange did not push the question until it was answered — that is <strong>silence</strong>. Chapter 1 teaches you to spot the first; Chapters 4–5 teach you to break the second politely.'
    : 'Hai bài học cho dev. Một: con số không đơn vị, ngày giờ không múi giờ, chữ "should" không có quyết định — đều là <strong>chỗ mơ hồ</strong>, và chỗ mơ hồ là bug mà không trình biên dịch nào tìm ra. Hai: những người thấy điều bất thường đã không đẩy câu hỏi tới khi có câu trả lời — đó là <strong>im lặng</strong>. Chương 1 dạy bạn nhận ra cái thứ nhất; Chương 4–5 dạy bạn phá cái thứ hai một cách lịch sự.'}</p>

<h3>${en ? '1. Silence — "I did not want to bother them"' : '1. Im lặng — "Em ngại làm phiền khách"'}</h3>
<p class="note-ct">${en ? 'Illustrative scenario (not a real team).' : 'Tình huống minh hoạ (không phải nhóm có thật).'}</p>
${MAU_IM_LANG}
<p>${en
    ? 'The intern was not lazy; they were afraid their English would sound stupid, and "should" looked optional. One line in the team chat — <em>"LF-188 says SHOULD be sorted by due date. Is that required for this sprint, or optional?"</em> — would have saved two days. In outsourcing culture, especially with Japanese clients, <strong>asking early is seen as professional, and silence followed by rework is seen as the real mistake</strong>.'
    : 'Bạn thực tập sinh không lười; bạn ấy sợ tiếng Anh của mình nghe ngớ ngẩn, và "should" trông như không bắt buộc. Một dòng trong chat nhóm — <em>"LF-188 says SHOULD be sorted by due date. Is that required for this sprint, or optional?"</em> — đã cứu được hai ngày. Trong văn hoá outsourcing, nhất là với khách Nhật, <strong>hỏi sớm được xem là chuyên nghiệp; im lặng rồi làm lại mới là lỗi thật</strong>.'}</p>

<h3>${en ? '2. Ambiguity — words that mean two things' : '2. Mơ hồ — những chữ mang hai nghĩa'}</h3>
<table>
<thead><tr><th>${en ? 'Ambiguous' : 'Mơ hồ'}</th><th>${en ? 'Two readings' : 'Hai cách hiểu'}</th><th>${en ? 'Precise' : 'Chính xác'}</th></tr></thead>
<tbody>
<tr><td>by Friday</td><td>${en ? 'Friday morning? End of Friday in Hanoi, or in Tokyo (2 hours ahead)?' : 'Sáng thứ Sáu? Cuối ngày thứ Sáu giờ Hà Nội hay giờ Tokyo (sớm hơn 2 tiếng)?'}</td><td>by Friday 17:00 ICT (19:00 JST)</td></tr>
<tr><td>The list should be sorted</td><td>${en ? 'Required, or a recommendation (RFC 2119, lesson 1.3)?' : 'Bắt buộc hay chỉ khuyến nghị (RFC 2119, bài 1.3)?'}</td><td>The list MUST be sorted by due date, ascending.</td></tr>
<tr><td>I updated the API</td><td>${en ? 'Changed the code? Deployed it? To which environment?' : 'Sửa code? Đã deploy? Lên môi trường nào?'}</td><td>I deployed the new API to staging (v1.4.2).</td></tr>
<tr><td>It doesn't work</td><td>${en ? 'Error? Wrong data? Slow? For whom?' : 'Báo lỗi? Sai dữ liệu? Chậm? Với ai?'}</td><td>Export returns HTTP 500 for ranges over 6 months.</td></tr>
<tr><td>Done</td><td>${en ? 'Code written? Reviewed? Merged? Tested?' : 'Viết xong? Đã review? Đã merge? Đã test?'}</td><td>Merged to develop; QA can test from build #312.</td></tr>
</tbody>
</table>

<h3>${en ? '3. The wrong tone — correct English, wrong message' : '3. Sai giọng — tiếng Anh đúng, thông điệp sai'}</h3>
<p class="note-ct">${en ? 'Illustrative scenario: an email a developer actually wanted to send, and what it should be.' : 'Tình huống minh hoạ: email một bạn dev đã định gửi, và bản nên gửi.'}</p>
${MAU_CUC}
${MAU_LICH_SU}
<p>${en
    ? 'The first email is grammatically fine and points at a real problem. It still damages the relationship: "wrong", "Fix the spec" are orders to a client. The second email says the same thing but (1) has a subject with the ticket number, (2) states facts — page numbers, not opinions, (3) offers options, (4) sets a default and a deadline so the work does not stop. You will learn this pattern in lesson 4.2 and 5.2.'
    : 'Email đầu đúng ngữ pháp và chỉ ra một vấn đề có thật. Nó vẫn làm hỏng quan hệ: "wrong", "Fix the spec" là ra lệnh cho khách. Email sau nói đúng điều đó nhưng (1) có tiêu đề kèm số ticket, (2) nêu sự thật — số trang, không phải nhận xét, (3) đưa phương án, (4) đặt mặc định và hạn chót để việc không bị dừng. Bạn sẽ học mẫu này ở bài 4.2 và 5.2.'}</p>

<h3>${en ? 'The situation everyone fears: the client asks you something in a meeting and you did not catch it' : 'Tình huống ai cũng sợ: khách hỏi bạn trong cuộc họp mà bạn nghe không kịp'}</h3>
<p>${en
    ? 'It will happen in your first month. The worst answer is "Yes" (you just agreed to something you did not hear). The second worst is silence. Here are four sentences, in order of use — learn them by heart today.'
    : 'Chuyện này chắc chắn xảy ra trong tháng đầu. Câu trả lời tệ nhất là "Yes" (bạn vừa đồng ý một điều mình không nghe). Tệ thứ hai là im lặng. Dưới đây là bốn câu, theo thứ tự dùng — học thuộc ngay hôm nay.'}</p>
<ol>
<li><strong>Sorry, I didn't catch the last part. Could you say it again, a bit more slowly?</strong> — ${en ? 'first try; nobody minds once.' : 'lần đầu; không ai phiền khi bạn hỏi một lần.'}</li>
<li><strong>Just to make sure I understand: you'd like the export to include cancelled loans too?</strong> — ${en ? 'repeat back what you think you heard; they correct you if wrong.' : 'nhắc lại điều bạn nghĩ mình nghe được; sai thì họ sửa.'}</li>
<li><strong>Could you type that in the chat, please?</strong> — ${en ? 'perfectly normal in online meetings, especially for names, numbers and URLs.' : 'hoàn toàn bình thường khi họp online, nhất là với tên, con số và URL.'}</li>
<li><strong>Let me check with my team and get back to you by tomorrow noon.</strong> — ${en ? 'when you understood but do not know the answer. Then really get back.' : 'khi đã hiểu nhưng chưa biết câu trả lời. Và nhớ phải hồi âm thật.'}</li>
</ol>

<h3>${en ? 'Mistakes Vietnamese speakers make in these moments' : 'Lỗi người Việt hay mắc trong những lúc này'}</h3>
${saiDung([
    ['Yes, yes. (' + (en ? 'without understanding' : 'khi chưa hiểu') + ')', 'Sorry, could you repeat the last part?', en ? '"Yes" in English is a commitment, not a polite noise.' : '"Yes" trong tiếng Anh là cam kết, không phải tiếng "dạ" lịch sự.'],
    ['Can you repeat again?', 'Could you repeat that?', en ? '"repeat" already means "again".' : '"repeat" đã có nghĩa "lại".'],
    ['I will try my best to finish soon.', 'I will finish it by Wednesday 5 PM.', en ? '"try my best" + "soon" promises nothing measurable.' : '"try my best" + "soon" không hứa điều gì đo được.'],
    ['Your requirement is wrong.', 'The spec says X on page 2 and Y on page 3. Could you confirm which is correct?', en ? 'Facts and a question instead of a judgement.' : 'Nêu sự thật và đặt câu hỏi, thay cho phán xét.'],
    ['Sorry sorry, my English is bad…', '(' + (en ? 'just ask the question' : 'cứ hỏi thẳng') + ')', en ? 'Over-apologising wastes time and makes you look less sure.' : 'Xin lỗi quá nhiều tốn thời gian và làm bạn trông kém tự tin.'],
  ], en)}

${tuVung(en ? [
    ['I didn\'t catch …', 'I did not hear/understand …', 'Sorry, I didn\'t catch the last part.'],
    ['to get back to someone', 'to reply later with an answer', 'I\'ll get back to you by noon.'],
    ['Just to make sure I understand, …', 'repeating back to check', 'Just to make sure I understand, you need it by Monday?'],
    ['We will go with A unless …', 'a default decision with a deadline', 'We will go with A unless we hear otherwise by Thursday.'],
    ['discrepancy', 'a difference between two things that should match', 'There is a discrepancy between page 2 and page 3.'],
  ] : [
    ['I didn\'t catch …', 'tôi nghe không kịp / không rõ …', 'Sorry, I didn\'t catch the last part.'],
    ['to get back to someone', 'hồi âm sau, kèm câu trả lời', 'I\'ll get back to you by noon.'],
    ['Just to make sure I understand, …', 'nhắc lại để kiểm', 'Just to make sure I understand, you need it by Monday?'],
    ['We will go with A unless …', 'quyết định mặc định kèm hạn chót', 'We will go with A unless we hear otherwise by Thursday.'],
    ['discrepancy', 'chỗ lệch giữa hai thứ lẽ ra phải khớp', 'There is a discrepancy between page 2 and page 3.'],
  ], en)}

<h3>🧪 ${en ? 'Practice (15 minutes): fix four messages' : 'Thực hành (15 phút): sửa bốn tin nhắn'}</h3>
<div class="callout ok"><p>${en ? 'Rewrite each one so it is precise and polite. Then compare with the model answers.' : 'Viết lại từng câu cho chính xác và lịch sự. Rồi so với đáp án gợi ý.'}</p>
<ol>
<li><em>"Ok I will fix it soon."</em> ${en ? '(a bug the QA reported this morning; you think it takes half a day)' : '(lỗi QA báo sáng nay; bạn ước nửa ngày)'}</li>
<li><em>"The design is not good, the button is too small."</em> ${en ? '(to the client\'s designer)' : '(gửi designer bên khách)'}</li>
<li><em>"Yes."</em> ${en ? '(in a meeting, you did not hear the question about the deadline)' : '(trong họp, bạn không nghe rõ câu hỏi về hạn chót)'}</li>
<li><em>"I deployed."</em> ${en ? '(you deployed version 2.3.0 to staging, not production)' : '(bạn đã deploy bản 2.3.0 lên staging, chưa lên production)'}</li>
</ol>
<p><strong>${en ? 'Model answers:' : 'Đáp án gợi ý:'}</strong></p>
<ol>
<li><em>Thanks for reporting it. I'm looking into it now and expect to have a fix ready for testing by 3 PM today.</em></li>
<li><em>On the loan list screen, the "Return" button is 24 px high, which may be hard to tap on mobile. Would it be OK to make it 40 px, the same as the other buttons?</em></li>
<li><em>Sorry, I didn't catch the question about the deadline. Could you repeat it?</em></li>
<li><em>I've deployed v2.3.0 to staging. It's not on production yet.</em></li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every rewrite has a concrete fact (a time, a number, an environment, a screen) and none of them gives an order or a judgement.' : 'câu viết lại nào cũng có một sự thật cụ thể (giờ, con số, môi trường, màn hình) và không câu nào ra lệnh hay phán xét.'}</p></div>

<a class="link-card lien-ket-cheo" href="/courses/agile-teamwork">
  <span class="lc-ico">🤝</span>
  <span class="lc-body"><span class="lc-title">${en ? 'Agile &amp; Teamwork' : 'Agile &amp; Làm việc nhóm'}</span><span class="lc-sub">${en ? 'The same team situations, taught in Vietnamese: what to report and when. This course gives you the English words.' : 'Cùng những tình huống nhóm, dạy bằng tiếng Việt: báo gì và lúc nào. Khoá này đưa bạn câu chữ tiếng Anh.'}</span></span>
</a>
</div>
`;

/* ═════════════ 0.1 — Tự đánh giá + kế hoạch 15 phút ═════════════ */
const MAU_README = mau(`
## Getting started

Prerequisites: JDK 21 and Docker. Node.js is only required if you work on the web client.

1. Copy .env.example to .env. Do not commit .env.
2. Run "docker compose up -d db" to start PostgreSQL.
3. Run "./mvnw spring-boot:run". The API listens on port 8090 by default;
   override it with SERVER_PORT.

Note: the seed data is reset every time the container is recreated.
If you need to keep test data, use a named volume (see docs/volumes.md).
`);

const PROMPT_AI = mau(`
Correct the English of the message below. Rules:
1. Keep my meaning and my level of formality. Do not make it longer or fancier.
2. Fix grammar, articles and word choice only.
3. After the corrected version, list each change and explain it in one short line in Vietnamese.

Message:
<paste your message here — remove client names, URLs, credentials and any confidential data first>
`);

const L01 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Section 0 · Lesson 0.1' : 'Mục 0 · Bài 0.1'}</span>
<h2>${en ? '0.1 — Self-assessment and a 15-minutes-a-day plan' : '0.1 — Tự đánh giá và kế hoạch 15 phút mỗi ngày'}</h2>
<p class="lead">${en
    ? 'Before you start, take a 20-minute snapshot of your work English. It tells you which chapters to spend more time on, and in lesson 8.3 you will take the same test again and compare. Keep your answers in a file named <code>baseline.md</code> — do not throw it away.'
    : 'Trước khi học, chụp nhanh tiếng Anh công việc của bạn trong 20 phút. Nó cho biết bạn nên dồn thời gian cho chương nào, và ở bài 8.3 bạn làm lại đúng bài này để so. Lưu câu trả lời vào tệp <code>baseline.md</code> — đừng xoá.'}</p>

<h3>${en ? 'Part A — Reading (5 minutes)' : 'Phần A — Đọc (5 phút)'}</h3>
<p>${en ? 'Read this README section once, then answer without looking back.' : 'Đọc đoạn README này một lần, rồi trả lời mà không nhìn lại.'}</p>
${MAU_README}
<ol>
<li>${en ? 'You only work on the backend. Do you need Node.js?' : 'Bạn chỉ làm backend. Có cần cài Node.js không?'}</li>
<li>${en ? 'Which file must never go into Git?' : 'Tệp nào tuyệt đối không được đưa vào Git?'}</li>
<li>${en ? 'Port 8090 is busy on your machine. What do you do?' : 'Máy bạn đang có thứ chiếm cổng 8090. Bạn làm gì?'}</li>
<li>${en ? 'You recreated the database container and your test accounts disappeared. Is that a bug?' : 'Bạn tạo lại container CSDL và tài khoản test của bạn biến mất. Đó có phải lỗi không?'}</li>
</ol>
<details><summary>${en ? 'Answers' : 'Đáp án'}</summary>
<ol>
<li>${en ? 'No — "only required if you work on the web client".' : 'Không — "only required if you work on the web client".'}</li>
<li><code>.env</code> — "Do not commit .env".</li>
<li>${en ? 'Set the environment variable SERVER_PORT to another port ("override it with SERVER_PORT").' : 'Đặt biến môi trường SERVER_PORT sang cổng khác ("override it with SERVER_PORT").'}</li>
<li>${en ? 'No, it is documented behaviour ("reset every time the container is recreated"); use a named volume.' : 'Không, đó là hành vi đã ghi trong tài liệu ("reset every time the container is recreated"); dùng named volume.'}</li>
</ol></details>

<h3>${en ? 'Part B — Writing (5 minutes)' : 'Phần B — Viết (5 phút)'}</h3>
<p>${en ? 'Correct each sentence. There is one main mistake in each.' : 'Sửa từng câu. Mỗi câu có một lỗi chính.'}</p>
<ol>
<li>I have fixed this bug yesterday.</li>
<li>Can you explain me how the login works?</li>
<li>We need to discuss about the deadline.</li>
<li>Please send me the informations about the API.</li>
<li>I am agree with your proposal.</li>
<li>The test was fail because of timeout.</li>
</ol>
<details><summary>${en ? 'Answers' : 'Đáp án'}</summary>
<ol>
<li>I <strong>fixed</strong> this bug yesterday. ${en ? '(past time ⇒ past simple)' : '(mốc quá khứ ⇒ quá khứ đơn)'}</li>
<li>Can you explain <strong>to me</strong> how the login works? / Can you explain how the login works?</li>
<li>We need to discuss the deadline. ${en ? '(no "about")' : '(không có "about")'}</li>
<li>… the <strong>information</strong> … ${en ? '(uncountable, no -s)' : '(không đếm được, không thêm -s)'}</li>
<li>I <strong>agree</strong> with your proposal. ${en ? '("agree" is a verb)' : '("agree" là động từ, không cần "am")'}</li>
<li>The test <strong>failed</strong> because of a timeout.</li>
</ol></details>

<h3>${en ? 'Part C — Listening (5 minutes)' : 'Phần C — Nghe (5 phút)'}</h3>
<ol>
<li>${en ? 'Open <strong>YouGlish</strong> (youglish.com), choose English, and search for each word: <em>deprecated</em>, <em>cache</em>, <em>queue</em>, <em>Kubernetes</em>, <em>backward compatible</em>.' : 'Mở <strong>YouGlish</strong> (youglish.com), chọn English, tìm lần lượt: <em>deprecated</em>, <em>cache</em>, <em>queue</em>, <em>Kubernetes</em>, <em>backward compatible</em>.'}</li>
<li>${en ? 'For each word, hide the captions, listen to the first clip twice and write down the whole sentence the speaker says.' : 'Với mỗi từ, che phụ đề, nghe clip đầu hai lần và chép lại cả câu người nói.'}</li>
<li>${en ? 'Show the captions and count how many sentences you got at least 80% right.' : 'Mở phụ đề và đếm số câu bạn chép đúng ít nhất 80%.'}</li>
</ol>

<h3>${en ? 'Part D — Speaking (3 minutes)' : 'Phần D — Nói (3 phút)'}</h3>
<p>${en ? 'Record yourself on your phone for 60 seconds: <em>"What I am working on this week"</em> — your current project, what you did, what is next. No script. Then listen once and score yourself.' : 'Ghi âm bằng điện thoại trong 60 giây: <em>"What I am working on this week"</em> — dự án hiện tại, đã làm gì, tiếp theo làm gì. Không soạn trước. Nghe lại một lần rồi tự chấm.'}</p>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>0</th><th>1</th><th>2</th></tr></thead>
<tbody>
<tr><td>${en ? 'Clear structure (did / doing / next)' : 'Rõ cấu trúc (đã làm / đang làm / sắp làm)'}</td><td>${en ? 'none' : 'không có'}</td><td>${en ? 'partly' : 'một phần'}</td><td>${en ? 'yes' : 'có'}</td></tr>
<tr><td>${en ? 'Concrete facts (names, numbers, dates)' : 'Sự thật cụ thể (tên, số, ngày)'}</td><td>0</td><td>1–2</td><td>≥ 3</td></tr>
<tr><td>${en ? 'Long pauses (&gt; 3 seconds)' : 'Ngập ngừng dài (&gt; 3 giây)'}</td><td>≥ 4</td><td>1–3</td><td>0</td></tr>
<tr><td>${en ? 'Tech terms a foreigner would understand' : 'Thuật ngữ mà người nước ngoài nghe hiểu'}</td><td>${en ? 'many unclear' : 'nhiều từ khó hiểu'}</td><td>${en ? 'a few' : 'vài từ'}</td><td>${en ? 'all clear' : 'đều rõ'}</td></tr>
</tbody>
</table>

<h3>${en ? 'Reading your results' : 'Đọc kết quả'}</h3>
<table>
<thead><tr><th>${en ? 'If…' : 'Nếu…'}</th><th>${en ? 'Spend more time on' : 'Dồn thời gian cho'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'A: fewer than 3 correct' : 'A: đúng dưới 3 câu'}</td><td>${en ? 'Chapter 1 first, and read one real README a day' : 'Chương 1 trước, và mỗi ngày đọc một README thật'}</td></tr>
<tr><td>${en ? 'B: fewer than 4 correct' : 'B: đúng dưới 4 câu'}</td><td>${en ? 'The "mistakes" tables in Chapters 2–4; keep a personal list of your own repeated errors' : 'Các bảng "lỗi hay mắc" ở Chương 2–4; giữ một danh sách lỗi lặp lại của riêng bạn'}</td></tr>
<tr><td>${en ? 'C: fewer than 3 sentences' : 'C: dưới 3 câu'}</td><td>${en ? 'Lesson 6.4 (accents) and 10 minutes of listening a day' : 'Bài 6.4 (các giọng) và 10 phút nghe mỗi ngày'}</td></tr>
<tr><td>${en ? 'D: under 5 points' : 'D: dưới 5 điểm'}</td><td>${en ? 'Lesson 6.1 (stand-up) early — you can do it before Chapter 2' : 'Học sớm bài 6.1 (standup) — làm trước Chương 2 cũng được'}</td></tr>
</tbody>
</table>

<h3>${en ? 'Your toolbox' : 'Bộ công cụ'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cambridge Dictionary</span><span class="v">${en ? 'UK and US IPA with audio for each. Use it for pronunciation and for "is this word formal or informal?".' : 'Phiên âm IPA Anh và Mỹ, có tiếng đọc cho từng giọng. Dùng để tra phát âm và "từ này trang trọng hay thân mật?".'}</span></div>
  <div class="kv"><span class="k">Oxford Learner's Dictionaries</span><span class="v">${en ? 'Clear example sentences and which preposition goes with a word ("depend on", "responsible for").' : 'Câu ví dụ rõ, và từ đi với giới từ nào ("depend on", "responsible for").'}</span></div>
  <div class="kv"><span class="k">YouGlish</span><span class="v">${en ? 'Real people saying a word in YouTube talks, filtered by accent. The fastest way to learn how "nginx" or "SQL" is said in practice.' : 'Người thật nói một từ trong các bài nói trên YouTube, lọc theo giọng. Cách nhanh nhất để biết "nginx" hay "SQL" ngoài đời đọc thế nào.'}</span></div>
  <div class="kv"><span class="k">${en ? 'A grammar checker' : 'Công cụ soát ngữ pháp'}</span><span class="v">${en ? 'LanguageTool or Grammarly catch articles and verb forms. Read each suggestion; do not "accept all".' : 'LanguageTool hoặc Grammarly bắt lỗi mạo từ, dạng động từ. Đọc từng gợi ý; đừng bấm "accept all".'}</span></div>
  <div class="kv"><span class="k">${en ? 'AI, used correctly' : 'AI, dùng cho đúng'}</span><span class="v">${en ? 'Ask it to correct and <strong>explain</strong>, not to rewrite. Use the prompt below.' : 'Nhờ nó sửa và <strong>giải thích</strong>, không phải viết lại. Dùng câu lệnh bên dưới.'}</span></div>
</div>
${PROMPT_AI}
<div class="callout warn"><p>${en
    ? '<strong>Two rules at a company.</strong> (1) Never paste client code, specs, names or credentials into a public AI tool — most outsourcing contracts include an NDA, and the company usually has a policy listing which AI tools are allowed. Ask your lead on day one. (2) An AI that rewrites everything makes your messages longer and more formal than your real level; in a meeting the client then hears a different person. Correct, do not replace.'
    : '<strong>Hai luật khi ở công ty.</strong> (1) Không bao giờ dán code, spec, tên khách hay thông tin đăng nhập của khách vào công cụ AI công cộng — hầu hết hợp đồng outsourcing có NDA (thoả thuận bảo mật), và công ty thường có quy định công cụ AI nào được dùng. Hỏi trưởng nhóm ngay ngày đầu. (2) AI viết lại toàn bộ làm tin nhắn của bạn dài và trang trọng hơn trình độ thật; tới lúc họp, khách nghe thấy một người khác hẳn. Sửa, đừng thay.'}</p></div>

<h3>${en ? 'The 15-minutes-a-day plan' : 'Kế hoạch 15 phút mỗi ngày'}</h3>
<table>
<thead><tr><th>${en ? 'Day' : 'Ngày'}</th><th>${en ? '15 minutes' : '15 phút'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Mon' : 'T2'}</td><td>${en ? 'Read one real README or docs page from a library you use; write a 3-line summary in English' : 'Đọc một README hoặc một trang docs thật của thư viện bạn dùng; tóm tắt 3 dòng bằng tiếng Anh'}</td></tr>
<tr><td>${en ? 'Tue' : 'T3'}</td><td>${en ? 'Read one closed GitHub issue; find the line that contains the solution' : 'Đọc một issue GitHub đã đóng; tìm dòng chứa lời giải'}</td></tr>
<tr><td>${en ? 'Wed' : 'T4'}</td><td>${en ? 'Write your commits and one ticket comment in English today (team project)' : 'Hôm nay viết commit và một bình luận ticket bằng tiếng Anh (dự án nhóm)'}</td></tr>
<tr><td>${en ? 'Thu' : 'T5'}</td><td>${en ? 'YouGlish: 5 tech words, shadow each clip twice' : 'YouGlish: 5 thuật ngữ, nhại theo mỗi clip hai lần'}</td></tr>
<tr><td>${en ? 'Fri' : 'T6'}</td><td>${en ? 'Record a 60-second stand-up about your week; listen once' : 'Ghi âm standup 60 giây về tuần của bạn; nghe lại một lần'}</td></tr>
<tr><td>${en ? 'Sat' : 'T7'}</td><td>${en ? 'One lesson of this course (or half of one)' : 'Một bài của khoá này (hoặc nửa bài)'}</td></tr>
<tr><td>${en ? 'Sun' : 'CN'}</td><td>${en ? 'Review your personal mistake list and your saved phrases in CT Language' : 'Ôn danh sách lỗi của riêng bạn và các cụm từ đã lưu trong CT Language'}</td></tr>
</tbody>
</table>

${tuVung(en ? [
    ['prerequisites', 'what you need before starting', 'Prerequisites: JDK 21 and Docker.'],
    ['by default', 'when you do not change anything', 'The API listens on port 8090 by default.'],
    ['to override', 'to replace a default with your own value', 'Override it with SERVER_PORT.'],
    ['is only required if …', 'you can skip it unless …', 'Node.js is only required if you work on the web client.'],
    ['to shadow (a speaker)', 'to repeat right after a recording, copying rhythm and stress', 'Shadow each clip twice.'],
  ] : [
    ['prerequisites', 'những thứ cần có trước khi bắt đầu', 'Prerequisites: JDK 21 and Docker.'],
    ['by default', 'mặc định (khi bạn không đổi gì)', 'The API listens on port 8090 by default.'],
    ['to override', 'ghi đè giá trị mặc định bằng giá trị của bạn', 'Override it with SERVER_PORT.'],
    ['is only required if …', 'chỉ cần khi … (không thì bỏ qua)', 'Node.js is only required if you work on the web client.'],
    ['to shadow (a speaker)', 'nhại ngay sau bản ghi, bắt chước nhịp và trọng âm', 'Shadow each clip twice.'],
  ], en)}

<h3>🧪 ${en ? 'Practice' : 'Thực hành'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Do parts A–D and save the results, the recording file name and your score in <code>baseline.md</code>.' : 'Làm phần A–D, lưu kết quả, tên tệp ghi âm và điểm vào <code>baseline.md</code>.'}</li>
<li>${en ? 'From the "Reading your results" table, write the two lessons you will do first.' : 'Từ bảng "Đọc kết quả", ghi hai bài bạn sẽ học trước.'}</li>
<li>${en ? 'Put the 15-minute plan in your calendar for the next 7 days, at a fixed time.' : 'Đặt kế hoạch 15 phút vào lịch 7 ngày tới, vào một giờ cố định.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? '<code>baseline.md</code> has four scores and a recording, and 7 calendar slots exist.' : '<code>baseline.md</code> có đủ bốn điểm và một bản ghi âm, và lịch đã có 7 ô.'}</p></div>

<a class="link-card lien-ket-cheo" href="/language">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">CT Language — ${en ? 'specialised vocabulary sets and IELTS' : 'sổ từ chuyên ngành và IELTS'}</span><span class="lc-sub">${en ? 'Single words and spaced repetition live there; this course teaches sentences for situations.' : 'Từ đơn lẻ và ôn lặp lại ngắt quãng nằm ở đó; khoá này dạy câu theo tình huống.'}</span></span>
</a>
</div>
`;

export default {
  title: 'Section 0 — English as a work tool|||Mục 0 — Tiếng Anh như một công cụ làm việc',
  description: 'Học đúng thứ tiếng Anh bạn sẽ dùng ở tuần đầu đi làm.',
  lessons: [
    { title: 'Start here (1/2) — The English of your first month at work|||Bắt đầu tại đây (1/2) — Thứ tiếng Anh bạn dùng trong tháng đầu đi làm', slug: 'tak-0-8-bat-dau-tai-day', type: 'LESSON', isFreePreview: true, description: 'Một tuần ở công ty outsourcing tính bằng tiếng Anh, mẫu ticket + chat thật, khách Nhật/Mỹ/Âu khác nhau ra sao, cách khoá dạy và bản đồ 8 chương.', content: L08(true) + L08(false) },
    { title: 'Start here (2/2) — When English goes wrong at work: silence, ambiguity, the wrong tone|||Bắt đầu tại đây (2/2) — Khi tiếng Anh hỏng việc: im lặng, mơ hồ, sai giọng', slug: 'tak-0-9-bat-dau-khi-khong-co', type: 'LESSON', isFreePreview: true, description: 'Mars Climate Orbiter 1999 (báo cáo NASA) — hai đội hiểu khác đơn vị; im lặng, mơ hồ, sai giọng qua tình huống minh hoạ; bốn câu khi nghe không kịp trong họp.', content: L09(true) + L09(false) },
    { title: '0.1 — Self-assessment and a 15-minutes-a-day plan|||0.1 — Tự đánh giá và kế hoạch 15 phút mỗi ngày', slug: 'tak-0-1-tu-danh-gia', type: 'LESSON', isFreePreview: true, description: 'Bài kiểm tra đầu vào 20 phút (đọc README, sửa câu, nghe YouGlish, nói 60 giây có rubric), bộ công cụ, câu lệnh nhờ AI sửa câu đúng cách + luật NDA, lịch 15 phút/ngày.', content: L01(true) + L01(false) },
  ],
};
