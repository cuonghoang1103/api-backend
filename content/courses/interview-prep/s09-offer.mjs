/**
 * IT Interview Prep — Chương 9: Phỏng vấn thử và offer (soạn 15/11/2026).
 * Số liệu pháp lý Việt Nam ĐÃ KIỂM (11/2026): giảm trừ gia cảnh 15,5 triệu/6,2 triệu từ kỳ tính thuế 2026 (Nghị quyết 110/2025/UBTVQH15);
 * tỉ lệ người lao động đóng 8% BHXH + 1,5% BHYT + 1% BHTN = 10,5% (Luật BHXH 2024, không đổi năm 2026); thử việc tối đa 60 ngày cho việc cần
 * trình độ cao đẳng trở lên, lương thử việc ≥ 85% (Bộ luật Lao động 2019, Điều 25–26). Không ghi mức lương thị trường (không có nguồn).
 * Khoá chữ, khuôn Mục 0 + helper ./_pv.mjs. GIỮ slug bài của khung cũ.
 * LUẬT: không backtick trần; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 */
import { ra, lienKet, nguon, yt, flow, stack, kv, bang, bay, keXau, doiThuong, neu, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ═══════════════════════ 9.1 — Phỏng vấn thử backend/DevOps ═══════════════════════ */
const KICH_BAN_EN = `
MOCK INTERVIEW — Backend / DevOps intern · 45 minutes · interviewer script

[00:00-05:00] WARM-UP
"Thanks for joining. I'm [name], a backend engineer. We'll talk about you and your
 project for about ten minutes, then some technical questions, a small scenario,
 and you can ask me anything at the end. Ready?"
Q1. "Tell me about yourself."                       (watch: 60-90 s, 3 blocks)

[05:00-15:00] PROJECT DEEP-DIVE
Q2. "Pick one project from your CV. What does it do and who uses it?"
Q3. "Draw or describe how one request flows through it."
Q4. "What part did YOU build or decide? What did others or tools do?"
Q5. "Tell me about one thing that broke. How did you find the cause?"

[15:00-30:00] FUNDAMENTALS (2-3 minutes each)
Q6. "What's the difference between 401 and 403? Give an example from your API."
Q7. "A page lists 50 posts with their authors and it's slow. What might be wrong?"
Q8. "What is a database transaction? When did you need one?"
Q9. "Merge or rebase — which do you use, and when is rebase dangerous?"
Q10. "Image versus container. And what does exit code 137 usually mean?"
Q11. "How does your code get from your laptop to production?"

[30:00-40:00] SCENARIO
Q12. "Right after a deploy, users get 502 errors. You have SSH and the logs.
      Walk me through what you check, in order."

[40:00-45:00] YOUR QUESTIONS
"What would you like to ask me?"        (watch: 2-3 real questions)
"Thanks — we'll get back to you by [date]."
`;

const KICH_BAN_VI = `
PHỎNG VẤN THỬ — Thực tập Backend / DevOps · 45 phút · kịch bản người phỏng vấn

[00:00-05:00] KHỞI ĐỘNG
"Cảm ơn em đã tham gia. Anh là [tên], kỹ sư backend. Mình nói về em và dự án của em
 khoảng mười phút, rồi vài câu kỹ thuật, một tình huống nhỏ, và cuối buổi em hỏi anh
 bất cứ điều gì. Mình bắt đầu nhé?"
C1. "Em giới thiệu về bản thân đi."                     (để ý: 60-90 giây, 3 khối)

[05:00-15:00] ĐÀO SÂU DỰ ÁN
C2. "Chọn một dự án trong CV. Nó làm gì, ai dùng?"
C3. "Vẽ hoặc tả đường đi của một request qua hệ thống."
C4. "Phần nào CHÍNH EM làm hay quyết định? Phần nào người khác hoặc công cụ làm?"
C5. "Kể một lần có thứ bị hỏng. Em tìm ra nguyên nhân thế nào?"

[15:00-30:00] KIẾN THỨC NỀN (mỗi câu 2-3 phút)
C6. "401 khác 403 thế nào? Cho ví dụ trong API của em."
C7. "Một trang liệt kê 50 bài viết kèm tác giả và chạy chậm. Có thể sai ở đâu?"
C8. "Transaction (giao dịch) trong CSDL là gì? Lúc nào em cần dùng?"
C9. "Merge hay rebase — em dùng cái nào, và khi nào rebase nguy hiểm?"
C10. "Image khác container thế nào? Và exit code 137 thường có nghĩa gì?"
C11. "Code của em đi từ laptop lên production bằng cách nào?"

[30:00-40:00] TÌNH HUỐNG
C12. "Ngay sau một lần deploy, người dùng gặp lỗi 502. Em có SSH và log.
      Kể theo thứ tự em kiểm những gì."

[40:00-45:00] CÂU HỎI CỦA EM
"Em có muốn hỏi anh gì không?"          (để ý: 2-3 câu hỏi thật)
"Cảm ơn em — bên anh sẽ phản hồi trước [ngày]."
`;

const L91 = {
  title: '9.1 — Mock interview: a 45-minute backend/DevOps script, a scoring sheet, and how to record it|||9.1 — Phỏng vấn thử: kịch bản backend/DevOps 45 phút, phiếu chấm, và cách tự quay',
  slug: 'pv-9-1-phong-van-thu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Kịch bản phỏng vấn thử 45 phút có đủ lời người phỏng vấn (khởi động, đào sâu dự án, sáu câu nền tảng, tình huống 502 sau deploy, câu hỏi lại), ý chính một câu trả lời tốt cho từng câu, phiếu chấm 8 tiêu chí, và ba cách tổ chức: với bạn bè, với người hướng dẫn, hoặc một mình có ghi hình.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Mock interview — a full 45-minute script you can run this week</h2>
<p class="lead">Reading answers and giving answers under a clock are different skills. A mock interview is the only way to practise the second one before it counts. This lesson gives you a complete script for a backend/DevOps internship interview — every line the interviewer says, timed — plus what a good answer contains, a scoring sheet, and three ways to run it, including alone with a camera.</p>

<h3>An everyday picture: the dress rehearsal</h3>
${doiThuong('en', 'A school play has a dress rehearsal: full costumes, real stage, no stopping. Actors who only practised their lines alone discover on that night that they do not know where to stand, when to enter, or how long the pauses are. A mock interview is your dress rehearsal — the content is known; what you are rehearsing is timing, nerves, and recovering when something goes wrong.')}

<h3>The shape of the 45 minutes</h3>
${flow([
  ['00–05', 'warm-up and introduction', 'Tests the 60-second introduction from Chapter 2 and Lesson 8.1.'],
  ['05–15', 'project deep-dive', 'Four questions that drill into one project: what, how, your part, what broke. The most important ten minutes for an intern.'],
  ['15–30', 'fundamentals', 'Six short questions from Chapters 4 and 5: HTTP, N+1, transactions, Git, Docker, deployment.'],
  ['30–40', 'scenario', 'A realistic incident to reason through out loud.'],
  ['40–45', 'your questions', 'Lesson 2.4: two or three real questions about the team and the work.'],
])}

<h3>The script</h3>
<p>Give this to the person playing the interviewer. They should read the questions as written, keep time strictly, and not help you.</p>
${ra(KICH_BAN_EN)}

<h3>What a good answer contains (for the interviewer’s eyes)</h3>
<details><summary>Q2–Q5 · project deep-dive</summary>
<ul>
<li>Q2: one sentence of purpose before any technology; real users if there are any.</li>
<li>Q3: follows one request in order (browser → proxy → API → database/storage), names each part once.</li>
<li>Q4: precise ownership — "I designed the schema and wrote the booking API; my teammate did the UI; AI tools wrote much of X, which I reviewed." Vague "we did everything" scores low.</li>
<li>Q5: a STAR story with the real cause and what changed afterwards (a test, a check, a process).</li>
</ul>
</details>
<details><summary>Q6–Q11 · fundamentals</summary>
<ul>
<li>Q6: 401 = not authenticated (no or invalid token); 403 = authenticated but not allowed. Example: a student calling an admin-only route gets 403.</li>
<li>Q7: N+1 queries (one query for posts, one per author) — fix with a join or an include/batch; also a missing index or no pagination. Bonus: "I would measure first — query count or EXPLAIN."</li>
<li>Q8: a group of statements that succeed or fail together (atomicity); example: creating a booking and decrementing available devices.</li>
<li>Q9: merge keeps history, rebase rewrites it into a line; rebase is dangerous on branches others already pulled — never force-push a shared branch.</li>
<li>Q10: image = read-only template; container = running instance with a writable layer; 137 = killed by SIGKILL, very often out of memory.</li>
<li>Q11: an honest pipeline — commit, CI checks, build image, push to a registry, server pulls and restarts, smoke test, rollback plan.</li>
</ul>
</details>
<details><summary>Q12 · scenario: 502 right after a deploy</summary>
<p>A strong answer is ordered and explains why: (1) 502 means the proxy could not get a valid response from the upstream — so check whether the backend container is running or restarting (<code>docker ps</code>, restart count); (2) read its logs from the start of the new version; (3) compare with the previous image: what changed — code, base image, environment variables, migrations; (4) if users are affected and the cause is not obvious in a few minutes, roll back to the previous image first, then investigate; (5) afterwards, add a check so this class of failure is caught before deploy. Mentioning "rollback first, investigate second" is a strong signal of maturity.</p>
</details>

<h3>Scoring sheet (out of 16)</h3>
${rubric('en', [
  ['Introduction', 'Over 2 min or no structure', 'Structured but long', '60–90 s, three blocks'],
  ['Project clarity', 'Listener cannot picture it', 'Picture with gaps', 'One request followed end to end'],
  ['Ownership', 'Vague "we"', 'Partly specific', 'Exact: what I did, what others/tools did'],
  ['Incident story', 'No real cause', 'Cause but no result', 'Cause, action, and what changed afterwards'],
  ['Fundamentals', '0–2 of 6 correct', '3–4 of 6', '5–6 of 6 with an example'],
  ['Reasoning out loud', 'Silence or guessing', 'Some reasoning', 'Ordered steps, says why'],
  ['Handling gaps', 'Bluffed', 'Said "I don’t know"', 'Admit → connect → reason'],
  ['Questions asked', 'None', 'Generic (salary only)', '2–3 about team, work, growth'],
])}
${bay('en', 'running the mock with a friend who keeps helping you.', 'A friendly interviewer who nods, hints, and says "you mean X, right?" produces a happy mock and no information. Ask your partner to stay neutral, keep strict time, and write notes only. Kindness goes into the feedback afterwards, not into the interview.')}

<h3>Three ways to run it</h3>
${stack([
  ['With a friend', 'Swap roles: you interview them next time. Both of you learn — seeing the interviewer’s side shows how short a good answer is.'],
  ['With a mentor or a senior', 'The most valuable: they know what real interviewers accept. Send the script in advance and ask for honest scores.'],
  ['Alone, on camera', 'Record the questions as audio with pauses (or have a voice assistant read them), start a screen-and-camera recording, and answer as if live. Watch it the next day and score it.'],
])}
${neu('en', 'you freeze completely on Q7 in the mock? Good — that is why you are rehearsing. Say "Let me think about this step by step", reason out loud about what could make a list slow, and continue. After the mock, write the ideal answer and add the question to your bank. A freeze in a mock costs nothing; the same freeze next week costs an offer.')}
${keXau('en', 'when you record a mock that shows your screen, check that no secrets are visible: environment files, tokens in the terminal history, admin dashboards, private messages. People post mock-interview videos to get feedback in groups; one visible API key in a frame is enough to lose your cloud account.')}

${thucHanh('en', { phut: '60–75', steps: [
  'Book 45 minutes with a friend or senior (or prepare the audio questions for a solo run). Send them the script.',
  'Run the mock with the camera on, no pausing.',
  'Score yourself on the sheet immediately; ask your partner to score independently.',
  'Write the three weakest answers in full, the way you would like to say them, and add them to <code>~/interview-kit/mock/</code>.',
], dat: 'you have a 45-minute recording, two scoring sheets (yours and your partner’s or your next-day self), and three rewritten answers.' })}
${thuatNgu('en', [
  ['Mock interview', 'A practice interview run like a real one.'],
  ['Deep-dive', 'Questions that go deeper and deeper into one topic.'],
  ['Scenario question', 'A realistic problem you reason through out loud.'],
  ['Smoke test', 'A quick check that the main features respond after a deploy.'],
  ['Rollback', 'Returning to the previous version to restore service first.'],
  ['Upstream', 'The server a proxy forwards requests to.'],
])}
${tomTat('en', [
  'A mock rehearses timing, nerves and recovery — not knowledge.',
  'The 45 minutes: introduction, project deep-dive, six fundamentals, a scenario, your questions.',
  'The project deep-dive and ownership matter most for interns.',
  'For incidents, "restore service first, investigate second" signals maturity.',
  'Interviewers must stay neutral and time-strict; feedback comes afterwards.',
  'Score with a sheet and rewrite your three weakest answers.',
])}
${lienQuan('en', [
  yt('Tr_89ZIhH3w', 'The Legion', 'Junior Software Engineer Mock Technical Interview', 45, 'en'),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-10-4-ma-loi-gateway', L: 'en', title: 'Networking 10.4 — Reading 502, 503, 504 and 524 correctly', sub: 'The background for the scenario question.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-1-build-cu', L: 'en', title: 'GitHub Actions 10.1 — Stale build, and 404 versus 401 as diagnosis', sub: 'A real deploy incident told as a diagnosis — good material for Q5 and Q12.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Phỏng vấn thử — trọn một kịch bản 45 phút bạn chạy được ngay tuần này</h2>
<p class="lead">Đọc câu trả lời và trả lời dưới áp lực đồng hồ là hai kỹ năng khác nhau. Phỏng vấn thử là cách duy nhất để luyện kỹ năng thứ hai trước khi nó tính điểm thật. Bài này cho bạn trọn kịch bản một buổi phỏng vấn thực tập backend/DevOps — từng câu người phỏng vấn nói, có bấm giờ — kèm ý chính của một câu trả lời tốt, phiếu chấm, và ba cách tổ chức, kể cả một mình với camera.</p>

<h3>Liên tưởng đời thường: buổi tổng duyệt</h3>
${doiThuong('vi', 'Một vở kịch ở trường luôn có buổi tổng duyệt: mặc đủ trang phục, sân khấu thật, không dừng giữa chừng. Diễn viên chỉ tập thoại một mình sẽ phát hiện ngay tối đó rằng mình không biết đứng đâu, vào lúc nào, nghỉ bao lâu. Phỏng vấn thử là buổi tổng duyệt của bạn — nội dung đã biết; thứ bạn tập là nhịp thời gian, sự run, và cách gỡ lại khi có gì trục trặc.')}

<h3>Hình dạng của 45 phút</h3>
${flow([
  ['00–05', 'khởi động và tự giới thiệu', 'Kiểm lời giới thiệu 60 giây ở Chương 2 và bài 8.1.'],
  ['05–15', 'đào sâu dự án', 'Bốn câu khoan vào một dự án: là gì, chạy ra sao, phần của em, cái gì đã hỏng. Mười phút quan trọng nhất với thực tập sinh.'],
  ['15–30', 'kiến thức nền', 'Sáu câu ngắn từ Chương 4 và 5: HTTP, N+1, transaction, Git, Docker, deploy.'],
  ['30–40', 'tình huống', 'Một sự cố sát thực tế để suy luận thành tiếng.'],
  ['40–45', 'câu hỏi của bạn', 'Bài 2.4: hai ba câu hỏi thật về đội và công việc.'],
])}

<h3>Kịch bản</h3>
<p>Đưa kịch bản này cho người đóng vai phỏng vấn. Họ đọc đúng câu hỏi như đã viết, giữ giờ nghiêm, và không gợi ý cho bạn.</p>
${ra(KICH_BAN_VI)}

<h3>Một câu trả lời tốt cần có gì (để người phỏng vấn đối chiếu)</h3>
<details><summary>C2–C5 · đào sâu dự án</summary>
<ul>
<li>C2: một câu nói mục đích trước mọi công nghệ; có người dùng thật thì nói.</li>
<li>C3: đi theo một request đúng thứ tự (trình duyệt → proxy → API → CSDL/kho tệp), nêu mỗi phần một lần.</li>
<li>C4: nói rõ ai làm gì — "em thiết kế lược đồ và viết API đặt lịch; bạn cùng nhóm làm giao diện; công cụ AI viết nhiều phần X, em duyệt lại". Câu mơ hồ "nhóm em làm hết" bị điểm thấp.</li>
<li>C5: một câu chuyện STAR có nguyên nhân thật và điều đã thay đổi sau đó (một bài test, một bước kiểm, một quy trình).</li>
</ul>
</details>
<details><summary>C6–C11 · kiến thức nền</summary>
<ul>
<li>C6: 401 = chưa xác thực (không có hoặc token sai); 403 = đã xác thực nhưng không đủ quyền. Ví dụ: sinh viên gọi route chỉ dành cho admin thì nhận 403.</li>
<li>C7: truy vấn N+1 (một truy vấn lấy bài, mỗi tác giả thêm một truy vấn) — sửa bằng join hoặc include/gom lô; cũng có thể thiếu index hoặc không phân trang. Điểm cộng: "em sẽ đo trước — đếm số truy vấn hoặc dùng EXPLAIN".</li>
<li>C8: một nhóm câu lệnh cùng thành công hoặc cùng thất bại (tính nguyên tử); ví dụ: tạo lượt đặt và trừ số thiết bị còn trống.</li>
<li>C9: merge giữ nguyên lịch sử, rebase viết lại thành một đường thẳng; rebase nguy hiểm trên nhánh người khác đã kéo về — không bao giờ force-push nhánh dùng chung.</li>
<li>C10: image = khuôn chỉ đọc; container = bản đang chạy có thêm tầng ghi được; 137 = bị giết bằng SIGKILL, rất hay là do hết bộ nhớ.</li>
<li>C11: một quy trình kể trung thực — commit, CI kiểm, build image, đẩy lên registry, máy chủ kéo về và khởi động lại, smoke test, phương án quay lui.</li>
</ul>
</details>
<details><summary>C12 · tình huống: 502 ngay sau deploy</summary>
<p>Câu trả lời mạnh có thứ tự và nói được vì sao: (1) 502 nghĩa là proxy không nhận được phản hồi hợp lệ từ upstream (máy chủ phía sau) — nên kiểm container backend có đang chạy hay đang khởi động lại liên tục (<code>docker ps</code>, số lần restart); (2) đọc log của nó từ lúc phiên bản mới khởi động; (3) so với image trước: cái gì đã đổi — code, ảnh nền, biến môi trường, migration; (4) nếu người dùng đang bị ảnh hưởng và vài phút chưa thấy nguyên nhân, QUAY LUI về image trước đã, rồi mới điều tra; (5) sau đó thêm một bước kiểm để loại lỗi này bị chặn trước khi deploy. Đây đúng là chuyện thật của một dự án sinh viên: ảnh nền Alpine mang engine Prisma sai thư viện C, API chết 502 bảy phút, và bài học là thêm chốt kiểm trước khi đẩy. Nói được "khôi phục dịch vụ trước, điều tra sau" là tín hiệu trưởng thành rất mạnh.</p>
</details>

<h3>Phiếu chấm (thang 16)</h3>
${rubric('vi', [
  ['Tự giới thiệu', 'Quá 2 phút hoặc không có bố cục', 'Có bố cục nhưng dài', '60–90 giây, ba khối'],
  ['Độ rõ của dự án', 'Người nghe không hình dung được', 'Có hình nhưng còn hổng', 'Đi theo một request từ đầu tới cuối'],
  ['Làm chủ phần việc', '"Nhóm em" mơ hồ', 'Cụ thể một phần', 'Chính xác: em làm gì, người khác/công cụ làm gì'],
  ['Câu chuyện sự cố', 'Không có nguyên nhân thật', 'Có nguyên nhân, thiếu kết quả', 'Nguyên nhân, hành động, và điều đã đổi sau đó'],
  ['Kiến thức nền', 'Đúng 0–2/6', 'Đúng 3–4/6', 'Đúng 5–6/6 kèm ví dụ'],
  ['Suy luận thành tiếng', 'Im lặng hoặc đoán', 'Có suy luận một phần', 'Có thứ tự, nói được vì sao'],
  ['Xử lý chỗ không biết', 'Chém gió', 'Nói "em không biết"', 'Thừa nhận → nối → suy luận'],
  ['Câu hỏi lại', 'Không có', 'Chung chung (chỉ hỏi lương)', '2–3 câu về đội, công việc, phát triển'],
])}
${bay('vi', 'phỏng vấn thử với một người bạn cứ liên tục giúp bạn.', 'Người phỏng vấn dễ tính cứ gật đầu, gợi ý, nói "ý em là X đúng không?" tạo ra một buổi thử vui vẻ và không có thông tin gì. Hãy nhờ bạn mình giữ thái độ trung lập, giữ giờ nghiêm, chỉ ghi chép. Sự tử tế để dành cho phần góp ý sau buổi, không đưa vào buổi phỏng vấn.')}

<h3>Ba cách tổ chức</h3>
${stack([
  ['Với bạn bè', 'Đổi vai: lần sau bạn phỏng vấn họ. Cả hai cùng học — ngồi ghế người phỏng vấn mới thấy một câu trả lời tốt ngắn thế nào.'],
  ['Với người hướng dẫn hoặc anh chị khoá trên', 'Giá trị nhất: họ biết người phỏng vấn thật chấp nhận gì. Gửi kịch bản trước và xin chấm thật lòng.'],
  ['Một mình, có camera', 'Thu âm sẵn các câu hỏi có khoảng nghỉ (hoặc nhờ trợ lý giọng nói đọc), bật ghi màn hình kèm camera, và trả lời như thật. Hôm sau xem lại và chấm.'],
])}
${neu('vi', 'bạn đứng hình hoàn toàn ở câu C7 trong buổi thử? Tốt — chính vì thế mới phải tập. Nói "Let me think about this step by step" (để em nghĩ từng bước), suy luận thành tiếng về những gì có thể làm một danh sách chạy chậm, rồi đi tiếp. Sau buổi thử, viết câu trả lời lý tưởng và đưa câu đó vào ngân hàng câu hỏi. Đứng hình ở buổi thử không tốn gì; đứng hình y vậy tuần sau thì tốn một offer.')}
${keXau('vi', 'khi ghi hình buổi thử có chia sẻ màn hình, kiểm kỹ không có bí mật nào lộ ra: tệp biến môi trường, token trong lịch sử terminal, trang quản trị, tin nhắn riêng. Nhiều người đăng video phỏng vấn thử vào nhóm để xin góp ý; chỉ một khoá API lọt vào một khung hình là đủ mất tài khoản cloud.')}

${thucHanh('vi', { phut: '60–75', steps: [
  'Hẹn 45 phút với một người bạn hoặc anh chị khoá trên (hoặc thu âm sẵn câu hỏi nếu làm một mình). Gửi họ kịch bản.',
  'Chạy buổi thử có bật camera, không dừng giữa chừng.',
  'Tự chấm theo phiếu ngay sau buổi; nhờ người cùng tập chấm độc lập.',
  'Viết trọn ba câu trả lời yếu nhất theo cách bạn muốn nói, lưu vào <code>~/interview-kit/mock/</code>.',
], dat: 'bạn có bản ghi 45 phút, hai phiếu chấm (của bạn và của người cùng tập, hoặc của chính bạn hôm sau), và ba câu trả lời đã viết lại.' })}
${thuatNgu('vi', [
  ['Mock interview (phỏng vấn thử)', 'Buổi phỏng vấn tập, chạy y như thật.'],
  ['Deep-dive (đào sâu)', 'Chuỗi câu hỏi khoan ngày càng sâu vào một chủ đề.'],
  ['Scenario question (câu hỏi tình huống)', 'Một vấn đề sát thực tế bạn suy luận thành tiếng.'],
  ['Smoke test (kiểm khói)', 'Kiểm nhanh các chức năng chính còn phản hồi sau deploy.'],
  ['Rollback (quay lui)', 'Trở về phiên bản trước để khôi phục dịch vụ trước tiên.'],
  ['Upstream (máy phía sau)', 'Máy chủ mà proxy chuyển request tới.'],
])}
${tomTat('vi', [
  'Phỏng vấn thử tập nhịp thời gian, sự run và cách gỡ lại — không phải kiến thức.',
  '45 phút gồm: giới thiệu, đào sâu dự án, sáu câu nền tảng, một tình huống, câu hỏi của bạn.',
  'Với thực tập sinh, phần đào sâu dự án và làm chủ phần việc quan trọng nhất.',
  'Với sự cố, "khôi phục dịch vụ trước, điều tra sau" là tín hiệu trưởng thành.',
  'Người phỏng vấn phải trung lập và giữ giờ; góp ý để sau buổi.',
  'Chấm bằng phiếu và viết lại ba câu trả lời yếu nhất.',
])}
${lienQuan('vi', [
  yt('Tr_89ZIhH3w', 'The Legion', 'Junior Software Engineer Mock Technical Interview', 45),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-10-4-ma-loi-gateway', title: 'Networking 10.4 — Đọc đúng 502, 503, 504 và 524', sub: 'Nền kiến thức cho câu hỏi tình huống.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-1-build-cu', title: 'GitHub Actions 10.1 — Build cũ, và 404 với 401 để chẩn đoán', sub: 'Một sự cố deploy thật kể dưới dạng chẩn đoán — chất liệu tốt cho C5 và C12.' }),
])}
</div>
`,
};

/* ═══════════════════════ 9.2 — Sau phỏng vấn ═══════════════════════ */
const THU_EN = `
1) THANK-YOU — within 24 hours
Subject: Thank you — Backend Intern interview, [Your name]
Hi [Interviewer name],
Thank you for your time today. I enjoyed our conversation about [one real topic,
e.g. how your team reviews database migrations]. It made me even more interested
in the role. If it helps, here is the link to the project we discussed: [link].
Best regards,
[Your name] · [phone]

2) FOLLOW-UP — 2-3 working days after the date they promised
Subject: Following up — Backend Intern application, [Your name]
Hi [Name],
I hope you are well. I interviewed for the Backend Intern role on [date] and wanted
to ask whether there is any update on the next steps. I remain very interested.
Thank you,
[Your name]

3) ASKING FOR FEEDBACK — after a rejection
Subject: Re: Backend Intern application
Hi [Name],
Thank you for letting me know, and for your time during the process.
If you have a moment, I would be grateful for one or two points I could improve
for future interviews. Either way, I hope to apply again in the future.
Best regards,
[Your name]

4) WITHDRAWING — when you accept another offer
Subject: Withdrawing my application — [Your name]
Hi [Name],
Thank you for considering me for the Backend Intern role. I have accepted another
internship offer, so I would like to withdraw my application.
I appreciated our conversation and hope our paths cross again.
Best regards,
[Your name]
`;

const THU_VI = `
1) CẢM ƠN — trong vòng 24 giờ
Tiêu đề: Cảm ơn anh/chị — Phỏng vấn Thực tập Backend, [Tên bạn]
Chào anh/chị [tên người phỏng vấn],
Em cảm ơn anh/chị đã dành thời gian cho buổi phỏng vấn hôm nay. Em rất thích phần
trao đổi về [một chủ đề có thật, ví dụ: cách đội mình review migration CSDL]; nó làm
em càng muốn được làm việc ở vị trí này. Nếu cần, đây là đường dẫn dự án em đã kể: [link].
Trân trọng,
[Tên bạn] · [số điện thoại]

2) HỎI TIẾP — 2-3 ngày làm việc sau ngày họ hẹn
Tiêu đề: Hỏi thăm kết quả — Ứng tuyển Thực tập Backend, [Tên bạn]
Chào anh/chị [tên],
Em đã phỏng vấn vị trí Thực tập Backend ngày [ngày]. Em xin phép hỏi thăm bên mình
đã có thông tin về bước tiếp theo chưa ạ. Em vẫn rất mong được làm việc ở vị trí này.
Em cảm ơn anh/chị,
[Tên bạn]

3) XIN GÓP Ý — sau khi bị từ chối
Tiêu đề: Re: Ứng tuyển Thực tập Backend
Chào anh/chị [tên],
Em cảm ơn anh/chị đã báo kết quả và đã dành thời gian trong suốt quá trình.
Nếu anh/chị có chút thời gian, em rất biết ơn nếu được nghe một hai điểm em nên cải
thiện cho những lần phỏng vấn sau. Dù thế nào, em mong có dịp ứng tuyển lại.
Trân trọng,
[Tên bạn]

4) RÚT ĐƠN — khi bạn đã nhận nơi khác
Tiêu đề: Xin rút hồ sơ ứng tuyển — [Tên bạn]
Chào anh/chị [tên],
Em cảm ơn bên mình đã xem xét em cho vị trí Thực tập Backend. Em đã nhận một lời mời
thực tập khác nên xin phép rút hồ sơ. Em rất trân trọng buổi trao đổi với anh/chị
và mong có dịp gặp lại.
Trân trọng,
[Tên bạn]
`;

const L92 = {
  title: '9.2 — After the interview: thank-you, follow-up, asking for feedback, and handling rejection|||9.2 — Sau phỏng vấn: email cảm ơn, hỏi tiếp, xin góp ý, và đối diện lời từ chối',
  slug: 'pv-9-2-sau-phong-van',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Việc cần làm trong 24 giờ sau buổi phỏng vấn (ghi lại câu hỏi, email cảm ơn), khi nào và cách nào hỏi tiếp, xin góp ý sau khi bị từ chối, rút hồ sơ lịch sự khi đã nhận nơi khác — bốn mẫu email VI/EN — cùng cách nhận ra email HR giả và giữ tinh thần sau lời từ chối.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>After the interview — the part most candidates skip</h2>
<p class="lead">The interview ends; the process does not. What you do in the next 24 hours decides whether you learn from it, whether the interviewer remembers you kindly, and whether a "no reply" becomes an answer. This lesson gives you a 24-hour routine, four short emails in Vietnamese and English, and a way to take rejection that makes the next interview better.</p>

<h3>An everyday picture: after a football match</h3>
${doiThuong('en', 'A good team does not go home straight after a match. They shake hands with the other side, and the next morning they watch the recording and note what went wrong. Players who skip the review make the same mistakes every week. The thank-you email is the handshake; your notes are the replay.')}

<h3>The 24-hour routine</h3>
${flow([
  ['Within 1 hour', 'write down every question', 'Exact wording if you can, and how you answered. Memory fades fast; these notes are the most valuable output of the interview.'],
  ['Within 3 hours', 'mark your weak answers', 'For each weak one, write the answer you wish you had given. Add it to your bank.'],
  ['Within 24 hours', 'send a short thank-you', 'Three or four sentences, one specific detail from the conversation. Not a second cover letter.'],
  ['Update the tracker', 'status + next step + date', 'If they said "we will reply within a week", the next step is "follow up on day 8".'],
])}

<h3>Four emails, ready to adapt</h3>
${ra(THU_EN)}
${bay('en', 'following up too early, or too often.', 'One follow-up two or three working days after the date they gave you is professional. Three messages in a week reads as pressure. If no date was given, wait about a week. After one polite follow-up with no answer, mark the row "No reply" and put your energy into other applications.')}

<h3>Rejection, handled well</h3>
${stack([
  ['It is normal', 'Most applications end in rejection or silence for everyone; a no says little about your worth and often reflects things you cannot see (budget, an internal candidate, timing).'],
  ['Ask once for feedback', 'Many companies will not answer for legal or policy reasons. Ask once, politely, and accept silence.'],
  ['Mine your notes', 'The questions you struggled with are the most precise study plan you will ever get.'],
  ['Keep the door open', 'A gracious reply is remembered. Interns are often re-contacted for the next intake.'],
])}
${neu('en', 'you receive an offer from company B while waiting for company A, which you prefer? Tell company A honestly and politely: "I have received another offer with a deadline of [date]. You are my first choice — is there any chance of an update before then?" This is normal and often speeds things up. Never invent an offer to pressure them.')}
${keXau('en', 'phishing emails imitate HR at exactly this stage, when you are waiting and eager: "Your offer letter is attached (offer.zip)" or "Log in to our candidate portal to sign". Check the sender’s domain letter by letter (a lookalike like "fptsoftvvare" instead of the real company domain), never open executable or compressed attachments you did not expect, and never enter your email password on a page you reached from a link. If unsure, reply to the address you already used with the real recruiter, or call the company.')}

${thucHanh('en', { phut: '30', steps: [
  'After your next real or mock interview, write down every question within one hour.',
  'Adapt email 1 (thank-you) with one specific detail from that conversation and send it (or save it for the mock).',
  'Write your version of emails 2, 3 and 4 in both languages and save them in <code>~/interview-kit/emails/</code>.',
  'Update the tracker row with the next step and its date.',
], dat: 'you have a list of the questions you were asked, four saved email templates in both languages, and a dated next step in the tracker.' })}
${thuatNgu('en', [
  ['Follow-up', 'A short message asking about the status of your application.'],
  ['Thank-you note', 'A brief message after the interview, sent within a day.'],
  ['Feedback', 'Comments on your performance; not always given.'],
  ['Withdraw an application', 'Tell the company you are no longer a candidate.'],
  ['Phishing', 'A fake message that tries to steal your password, money or install malware.'],
  ['Lookalike domain', 'A domain spelled almost like the real one to trick you.'],
])}
${tomTat('en', [
  'Within an hour, write down every question; within a day, send a short, specific thank-you.',
  'Follow up once, two or three working days after the promised date.',
  'Ask once for feedback after a rejection; accept silence.',
  'Withdraw politely when you accept elsewhere; tell your preferred company honestly about a competing deadline.',
  'Treat "offer attached" emails and candidate-portal links with suspicion — check the domain.',
])}
${lienQuan('en', [
  yt('B8mQvdYodS8', 'Harvard Business Review', 'How to Follow Up After a Job Interview', 7, 'en'),
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-3-1-find-apply', academy: true, L: 'en', title: 'Academy · OJT202 3.1 — Finding and applying for an internship', sub: 'The school side: what to send the coordinator once a company accepts you.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Sau phỏng vấn — phần hầu hết ứng viên bỏ qua</h2>
<p class="lead">Buổi phỏng vấn kết thúc; quá trình thì chưa. Những gì bạn làm trong 24 giờ sau quyết định bạn có học được gì từ nó không, người phỏng vấn có nhớ về bạn một cách thiện cảm không, và một lần "không phản hồi" có biến thành một câu trả lời không. Bài này cho bạn quy trình 24 giờ, bốn email ngắn bằng tiếng Việt và tiếng Anh, và một cách đón nhận lời từ chối khiến buổi phỏng vấn sau tốt hơn.</p>

<h3>Liên tưởng đời thường: sau một trận bóng</h3>
${doiThuong('vi', 'Một đội bóng tốt không về nhà ngay sau trận. Họ bắt tay đội bạn, và sáng hôm sau xem lại băng ghi hình, ghi những chỗ hỏng. Cầu thủ bỏ qua buổi xem lại sẽ mắc cùng lỗi tuần nào cũng vậy. Email cảm ơn là cái bắt tay; ghi chú của bạn là cuốn băng xem lại.')}

<h3>Quy trình 24 giờ</h3>
${flow([
  ['Trong 1 giờ', 'ghi lại MỌI câu hỏi', 'Nguyên văn nếu được, kèm cách bạn đã trả lời. Trí nhớ phai rất nhanh; những ghi chú này là sản phẩm giá trị nhất của buổi phỏng vấn.'],
  ['Trong 3 giờ', 'đánh dấu câu trả lời yếu', 'Với mỗi câu yếu, viết câu trả lời bạn ước mình đã nói. Đưa vào ngân hàng câu hỏi.'],
  ['Trong 24 giờ', 'gửi lời cảm ơn ngắn', 'Ba bốn câu, có một chi tiết cụ thể từ cuộc trò chuyện. Không phải một lá thư xin việc thứ hai.'],
  ['Cập nhật bảng theo dõi', 'trạng thái + bước tiếp theo + ngày', 'Nếu họ nói "bên anh phản hồi trong một tuần", bước tiếp theo là "hỏi tiếp vào ngày thứ 8".'],
])}

<h3>Bốn email, sẵn để chỉnh</h3>
${ra(THU_VI)}
<p>Bản tiếng Anh ở khối EN dùng cho công ty nước ngoài hoặc khi buổi phỏng vấn diễn ra bằng tiếng Anh. Mẹo: chi tiết cụ thể trong email cảm ơn phải là điều THẬT đã được nói trong buổi — một câu chung chung kiểu "em học được rất nhiều" thì không ai nhớ.</p>
${bay('vi', 'hỏi tiếp quá sớm, hoặc quá dồn dập.', 'Một email hỏi tiếp sau ngày họ hẹn hai ba ngày làm việc là chuyên nghiệp. Ba tin nhắn trong một tuần đọc lên như gây áp lực. Nếu họ không hẹn ngày, đợi khoảng một tuần. Sau một lần hỏi lịch sự mà không có hồi âm, đánh dấu dòng đó "Không phản hồi" và dồn sức cho các đơn khác.')}

<h3>Đối diện lời từ chối cho tử tế</h3>
${stack([
  ['Đó là chuyện bình thường', 'Với tất cả mọi người, phần lớn đơn ứng tuyển kết thúc bằng lời từ chối hoặc im lặng; một chữ "không" nói rất ít về giá trị của bạn và nhiều khi phản ánh những thứ bạn không thấy được (ngân sách, ứng viên nội bộ, thời điểm).'],
  ['Xin góp ý một lần', 'Nhiều công ty không trả lời vì lý do pháp lý hay chính sách. Hỏi một lần, lịch sự, và chấp nhận sự im lặng.'],
  ['Khai thác ghi chú', 'Những câu bạn vấp chính là kế hoạch ôn chính xác nhất bạn từng có.'],
  ['Giữ cửa mở', 'Một lời hồi đáp lịch thiệp được nhớ lâu. Thực tập sinh hay được liên hệ lại cho đợt tuyển sau.'],
])}
${neu('vi', 'bạn nhận được offer của công ty B trong lúc đang chờ công ty A, nơi bạn thích hơn? Báo cho A một cách thật lòng và lịch sự: "Em vừa nhận một lời mời khác, hạn trả lời là [ngày]. Bên mình là lựa chọn số một của em — không biết bên mình có thể cho em biết kết quả trước ngày đó không ạ?" Đây là chuyện bình thường và nhiều khi làm mọi việc nhanh hơn. Đừng bao giờ bịa ra một offer để gây sức ép.')}
${keXau('vi', 'email lừa đảo (phishing) giả HR đúng vào giai đoạn này, khi bạn đang chờ và háo hức: "Thư mời nhận việc đính kèm (offer.zip)" hay "Đăng nhập cổng ứng viên để ký". Kiểm tên miền người gửi từng chữ một (một tên na ná như "fptsoftvvare" thay cho tên miền thật của công ty), không bao giờ mở tệp chạy được hoặc tệp nén bạn không chờ, và không bao giờ nhập mật khẩu email vào trang mở từ một đường link. Nếu không chắc, trả lời vào đúng địa chỉ bạn đã trao đổi với recruiter thật, hoặc gọi công ty.')}

${thucHanh('vi', { phut: '30', steps: [
  'Sau buổi phỏng vấn thật hoặc buổi thử kế tiếp, ghi lại mọi câu hỏi trong vòng một giờ.',
  'Chỉnh email 1 (cảm ơn) với một chi tiết cụ thể từ cuộc trò chuyện đó và gửi đi (hoặc lưu lại nếu là buổi thử).',
  'Viết phiên bản của bạn cho email 2, 3, 4 ở cả hai ngôn ngữ, lưu vào <code>~/interview-kit/emails/</code>.',
  'Cập nhật dòng tương ứng trong bảng theo dõi với bước tiếp theo và ngày.',
], dat: 'bạn có danh sách câu hỏi đã bị hỏi, bốn mẫu email đã lưu ở cả hai ngôn ngữ, và một bước tiếp theo có ngày trong bảng theo dõi.' })}
${thuatNgu('vi', [
  ['Follow-up (hỏi tiếp)', 'Tin nhắn ngắn hỏi về tình trạng hồ sơ.'],
  ['Thank-you note (lời cảm ơn)', 'Tin nhắn ngắn sau buổi phỏng vấn, gửi trong vòng một ngày.'],
  ['Feedback (góp ý)', 'Nhận xét về phần thể hiện; không phải lúc nào cũng có.'],
  ['Withdraw an application (rút hồ sơ)', 'Báo công ty bạn không còn là ứng viên nữa.'],
  ['Phishing (lừa đảo giả mạo)', 'Tin nhắn giả nhằm lấy mật khẩu, tiền, hoặc cài mã độc.'],
  ['Lookalike domain (tên miền na ná)', 'Tên miền viết gần giống tên thật để đánh lừa.'],
])}
${tomTat('vi', [
  'Trong một giờ, ghi lại mọi câu hỏi; trong một ngày, gửi lời cảm ơn ngắn, cụ thể.',
  'Hỏi tiếp một lần, hai ba ngày làm việc sau ngày họ hẹn.',
  'Bị từ chối thì xin góp ý một lần; chấp nhận sự im lặng.',
  'Rút hồ sơ lịch sự khi đã nhận nơi khác; nói thật với công ty bạn thích hơn về hạn của offer kia.',
  'Cảnh giác với email "đính kèm offer" và link cổng ứng viên — kiểm tên miền.',
])}
${lienQuan('vi', [
  yt('B8mQvdYodS8', 'Harvard Business Review', 'How to Follow Up After a Job Interview', 7),
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-3-1-find-apply', academy: true, title: 'Academy · OJT202 3.1 — Tìm và ứng tuyển thực tập', sub: 'Phía nhà trường: gửi gì cho điều phối viên khi công ty đã nhận bạn.' }),
])}
</div>
`,
};

/* ═══════════════════════ 9.3 — Đọc và thương lượng offer ═══════════════════════ */
const GROSS_NET = `
ILLUSTRATIVE fresher example (numbers chosen for the arithmetic, NOT a market figure)
Assume: gross 12,000,000 VND/month, insurance is paid on the full gross, no dependants.

Employee insurance  = 12,000,000 × (8% social + 1.5% health + 1% unemployment)
                    = 12,000,000 × 10.5% = 1,260,000
Taxable income      = 12,000,000 − 1,260,000 − 15,500,000 (personal deduction from 2026)
                    = below zero  →  personal income tax = 0
Net                 = 12,000,000 − 1,260,000 = 10,740,000 VND

Two things change the real result: the salary the contract uses as the insurance base
(often lower than gross), and dependants (6,200,000 each). Above the deduction, tax is
progressive — use a gross/net calculator and ask HR for the exact figure.
`;

const GROSS_NET_VI = `
Ví dụ MINH HOẠ cho fresher (số chọn để tính cho dễ, KHÔNG phải mức lương thị trường)
Giả sử: gross 12.000.000 đ/tháng, đóng bảo hiểm trên toàn bộ gross, không có người phụ thuộc.

Bảo hiểm người LĐ đóng = 12.000.000 × (8% BHXH + 1,5% BHYT + 1% BHTN)
                        = 12.000.000 × 10,5% = 1.260.000
Thu nhập tính thuế      = 12.000.000 − 1.260.000 − 15.500.000 (giảm trừ bản thân từ 2026)
                        = âm  →  thuế thu nhập cá nhân = 0
Net (thực nhận)         = 12.000.000 − 1.260.000 = 10.740.000 đ

Hai thứ làm số thật khác đi: mức lương hợp đồng dùng làm căn cứ đóng bảo hiểm (nhiều nơi
thấp hơn gross), và người phụ thuộc (mỗi người 6.200.000). Phần vượt mức giảm trừ chịu
thuế luỹ tiến — dùng công cụ tính gross/net và hỏi HR con số chính xác.
`;

const L93 = {
  title: '9.3 — Reading and negotiating an offer: allowance vs salary, gross vs net, probation, contract, NDA|||9.3 — Đọc và thương lượng offer: trợ cấp vs lương, gross vs net, thử việc, hợp đồng, NDA',
  slug: 'pv-9-3-offer',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc một offer thực tập hoặc fresher từng mục: trợ cấp thực tập khác lương thế nào, gross/net với bảo hiểm 10,5% và mức giảm trừ gia cảnh 2026 (đã kiểm nguồn), thử việc theo Bộ luật Lao động 2019, loại hợp đồng, NDA và quyền sở hữu code, giờ làm; bảng so sánh hai offer có trọng số; thương lượng lịch sự; và vì sao với OJT thì "qua môn + học được gì" đứng trên tiền.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Reading and negotiating an offer — what each line means for you</h2>
<p class="lead">An offer is good news and a document to read carefully. For an internship it is often short — an allowance, a period, a mentor — and for a fresher job it becomes a contract with salary, probation, insurance and confidentiality clauses. This lesson walks through each part, shows the gross-to-net arithmetic with figures checked against current Vietnamese rules, gives a table for comparing two offers, and the polite way to ask for more.</p>

<h3>An everyday picture: renting a room, again</h3>
${doiThuong('en', 'When you rent a room, the monthly price is only one line. Electricity per kWh, deposit, notice period, who repairs the water heater — these decide whether the room is really cheaper. An offer is the same: the headline number matters, but so do the hours, the mentor, the probation, the contract type, and what you may say about your work later.')}

<h3>The parts of an offer</h3>
${bang(['Part', 'What to check', 'Why it matters'], [
  ['Role and team', 'Exact title, team, mentor or lead', 'Decides what you will learn and what you can put on your CV.'],
  ['Period and hours', 'Start and end dates, hours per week, on-site / hybrid / remote', 'For OJT, the dates must cover the school’s internship period.'],
  ['Money', 'Internship allowance or salary; gross or net; payment date', 'An allowance is usually not a labour-contract salary; ask how it is paid and whether anything is deducted.'],
  ['Probation (fresher jobs)', 'Length and pay during probation', 'Vietnamese law limits both — see below.'],
  ['Contract type', 'Fixed-term (with its length) or indefinite; internship agreement', 'Determines insurance, notice and protections.'],
  ['Confidentiality / IP', 'NDA scope; who owns code you write; personal projects', 'Affects your CV, your OJT report and your side projects.'],
  ['Equipment and benefits', 'Laptop, insurance package, training, conversion to full-time', 'Hidden costs or real value.'],
])}

<h3>Gross, net and insurance — checked figures</h3>
<p>For employees on a labour contract in Vietnam (checked November 2026): the employee pays <strong>10.5%</strong> of the insurance-base salary — 8% social insurance, 1.5% health insurance, 1% unemployment insurance — unchanged in 2026 under the 2024 Social Insurance Law. Personal income tax is calculated after insurance and after the family deduction, which from tax year 2026 is <strong>15.5 million VND per month for yourself</strong> and <strong>6.2 million per dependant</strong> (Resolution 110/2025/UBTVQH15). The illustrative arithmetic:</p>
${ra(GROSS_NET)}
<p>Internship allowances are often paid under an internship agreement rather than a labour contract, and treatment (insurance, tax withheld) differs between companies — <strong>ask HR how it is paid</strong> rather than assuming either way.</p>

<h3>Probation and contract type (Labour Code 2019)</h3>
${kv([
  ['Probation length', 'Agreed by both sides, but at most 60 days for jobs requiring a college degree or higher (Article 25). Only one probation per job.'],
  ['Probation pay', 'At least 85% of the salary for that job (Article 26).'],
  ['Contract types', 'Indefinite-term, or fixed-term up to 36 months.'],
  ['In writing', 'Ask for the offer and the contract in writing before you resign from anything or stop applying elsewhere.'],
])}
${bay('en', 'accepting a verbal offer and stopping all other applications.', 'Until you have the terms in writing and have signed, nothing is final. Keep your tracker alive, and tell other companies only after you have signed.')}

<h3>Comparing two offers with weights</h3>
<p>Score each criterion from 1 to 5, multiply by its weight, and add. The weights below suit an OJT intern; change them to yours.</p>
${bang(['Criterion', 'Weight', 'Offer A', 'Offer B'], [
  ['Accepted by the school, dates cover the OJT period', '×5 (must-have)', '5 → 25', '5 → 25'],
  ['What I will learn (real tasks, code review, stack)', '×4', '4 → 16', '2 → 8'],
  ['Mentor and team quality (from the interview)', '×3', '4 → 12', '3 → 9'],
  ['Allowance', '×2', '2 → 4', '4 → 8'],
  ['Commute / hybrid', '×2', '3 → 6', '5 → 10'],
  ['Chance to become full-time', '×2', '4 → 8', '2 → 4'],
  ['Total', '', '<strong>71</strong>', '<strong>64</strong>'],
])}
<p>Here A wins despite the lower allowance. For an OJT semester the priorities are: <strong>pass the internship, learn real work, get a reference</strong>. Money matters, but it should rarely decide between two acceptable places.</p>

<h3>Negotiating politely</h3>
${stack([
  ['Thank and show interest first', '"Thank you, I’m excited about the role."'],
  ['Ask, do not demand', '"Is there any flexibility on the allowance / start date / hybrid days?"'],
  ['Give a reason', 'A competing offer (real), a longer commute, a skill you bring.'],
  ['Know what can move', 'For interns, money rarely moves much; schedule, remote days, start date and mentor often can.'],
  ['Accept gracefully', 'Whatever the answer, reply politely and confirm in writing.'],
])}
${neu('en', 'the company asks "What allowance do you expect?" in the first screen? It is fine to say: "I’m mostly looking for a place where I can learn real backend work. Could you share the range for this internship?" If they insist, give a range based on what you found from friends and public reports for that kind of company — and never invent a competing offer.')}
${keXau('en', 'fake offers often arrive with a "small" request: a fee for training, uniforms or a background check; buying a laptop through them; or your bank login "to set up the salary account". A real employer never charges you to start, and needs only your account number, never your password or OTP. Also check that the offer comes from the company domain and matches the person who interviewed you.')}

${thucHanh('en', { phut: '30', steps: [
  'Take a real or sample offer and fill the "parts of an offer" table for it, marking every line you do not know.',
  'Write the questions to HR for each unknown line (for example "Is the allowance paid under an internship agreement? Is anything deducted?").',
  'Calculate net from gross with an online gross/net calculator and compare with the arithmetic above.',
  'If you have two options, fill the weighted table with your own weights and write one sentence on the result.',
], dat: 'you have a completed offer checklist, a list of questions for HR, a net figure you computed, and (if applicable) a weighted comparison.' })}
${thuatNgu('en', [
  ['Gross / net', 'Before / after the employee’s insurance and income tax.'],
  ['Internship allowance', 'Money paid to an intern, often not under a labour contract.'],
  ['Probation', 'A trial period before the official contract; limited by law.'],
  ['NDA', 'Non-disclosure agreement — what you may not reveal about the company’s work.'],
  ['IP (intellectual property)', 'Ownership of the code and ideas you create at work.'],
  ['Family deduction', 'The amount subtracted before income tax: for yourself and per dependant.'],
])}
${tomTat('en', [
  'Read every part: role, period, money, probation, contract type, NDA/IP, benefits.',
  'Employees pay 10.5% insurance; income tax applies only above the 2026 deduction (15.5 million + 6.2 million per dependant).',
  'Ask HR how an internship allowance is paid; do not assume.',
  'Probation: at most 60 days for degree-level jobs, at least 85% pay; get everything in writing.',
  'Compare offers with weights; for OJT, passing and learning outrank money.',
  'Any fee, laptop purchase or password request is a scam sign.',
])}
${lienQuan('en', [
  yt('J30wmYgzVXM', 'Jeff Su', 'How to Negotiate Salary after Job Offer — 5 Practical Tips', 8, 'en'),
  yt('6mq7pTpxNbg', 'Indeed', '5 Things to Consider BEFORE Accepting a Job Offer', 10, 'en'),
  nguon('🏛️', 'Nghệ An provincial portal — Resolution 110/2025/UBTVQH15', 'Official summary of the 2026 family deduction (15.5 / 6.2 million VND).', 'https://hcc.nghean.gov.vn/tin-tong-hop/nghi-quyet-110-2025-ubtvqh15-dieu-chinh-muc-giam-tru-gia-canh-cua-thue-thu-nhap-ca-nhan-2448.html'),
  nguon('📰', 'VOH (2026) — Contribution rates for social, health and unemployment insurance from 2026', 'Employee 8% + 1.5% + 1% = 10.5%, unchanged in 2026 (Vietnamese).', 'https://voh.com.vn/phap-luat/tu-2026-muc-dong-bhxh-bhyt-bhtn-cua-nld-va-nsdld-duoc-tinh-nhu-the-nao-645283.html'),
  nguon('🧮', 'TopCV — gross/net salary calculator', 'Enter gross, region and dependants to see insurance, tax and net.', 'https://www.topcv.vn/tinh-luong-gross-net'),
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-8-1-ethics-transition', academy: true, L: 'en', title: 'Academy · OJT202 8.1 — Professional ethics, confidentiality and the transition', sub: 'What an NDA means for your OJT report and your CV.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Đọc và thương lượng offer — từng dòng có nghĩa gì với bạn</h2>
<p class="lead">Offer (thư mời nhận việc) là tin vui VÀ là một văn bản phải đọc kỹ. Với thực tập nó thường ngắn — một khoản trợ cấp, một khoảng thời gian, một mentor — còn với việc fresher nó thành hợp đồng có lương, thử việc, bảo hiểm và điều khoản bảo mật. Bài này đi qua từng phần, chỉ phép tính gross ra net với các con số đã đối chiếu quy định hiện hành ở Việt Nam, đưa một bảng so sánh hai offer, và cách lịch sự để xin thêm.</p>

<h3>Liên tưởng đời thường: lại chuyện thuê phòng</h3>
${doiThuong('vi', 'Khi thuê phòng, giá mỗi tháng chỉ là một dòng. Tiền điện mỗi số, tiền cọc, báo trước bao lâu, ai sửa bình nóng lạnh — những thứ đó quyết định phòng có thật sự rẻ hơn không. Offer cũng vậy: con số to nhất có quan trọng, nhưng giờ làm, mentor, thử việc, loại hợp đồng, và điều bạn được phép kể về công việc sau này cũng quan trọng không kém.')}

<h3>Các phần của một offer</h3>
${bang(['Phần', 'Cần kiểm gì', 'Vì sao quan trọng'], [
  ['Vị trí và đội', 'Chức danh chính xác, đội nào, mentor hay trưởng nhóm là ai', 'Quyết định bạn học được gì và ghi được gì vào CV.'],
  ['Thời gian và giờ làm', 'Ngày bắt đầu, kết thúc, số giờ/tuần, tại chỗ / hybrid / remote', 'Với OJT, khoảng thời gian phải phủ kỳ thực tập của trường.'],
  ['Tiền', 'Trợ cấp thực tập hay lương; gross hay net; ngày trả', 'Trợ cấp thường KHÔNG phải lương theo hợp đồng lao động; hỏi cách chi trả và có khấu trừ gì không.'],
  ['Thử việc (việc fresher)', 'Bao lâu, lương trong thời gian thử việc', 'Luật Việt Nam giới hạn cả hai — xem bên dưới.'],
  ['Loại hợp đồng', 'Xác định thời hạn (bao lâu) hay không xác định thời hạn; thoả thuận thực tập', 'Quyết định bảo hiểm, thời gian báo trước, quyền lợi được bảo vệ.'],
  ['Bảo mật / sở hữu trí tuệ', 'Phạm vi NDA; code bạn viết thuộc về ai; dự án cá nhân', 'Ảnh hưởng tới CV, báo cáo OJT, và dự án riêng của bạn.'],
  ['Thiết bị và phúc lợi', 'Laptop, gói bảo hiểm, đào tạo, cơ hội lên chính thức', 'Chi phí ẩn, hoặc giá trị thật.'],
])}

<h3>Gross, net và bảo hiểm — con số đã kiểm</h3>
<p>Với người làm theo hợp đồng lao động ở Việt Nam (đối chiếu tháng 11/2026): người lao động đóng <strong>10,5%</strong> tiền lương làm căn cứ đóng bảo hiểm — 8% bảo hiểm xã hội, 1,5% bảo hiểm y tế, 1% bảo hiểm thất nghiệp — năm 2026 không đổi theo Luật Bảo hiểm xã hội 2024. Thuế thu nhập cá nhân tính sau bảo hiểm và sau giảm trừ gia cảnh; từ kỳ tính thuế năm 2026 mức giảm trừ là <strong>15,5 triệu đồng/tháng cho bản thân</strong> và <strong>6,2 triệu cho mỗi người phụ thuộc</strong> (Nghị quyết 110/2025/UBTVQH15). Phép tính minh hoạ:</p>
${ra(GROSS_NET_VI)}
<p>Trợ cấp thực tập thường được trả theo thoả thuận thực tập chứ không theo hợp đồng lao động, và mỗi công ty xử lý khác nhau (có đóng bảo hiểm không, có khấu trừ thuế không) — <strong>hãy hỏi HR cách chi trả</strong>, đừng tự đoán theo chiều nào.</p>

<h3>Thử việc và loại hợp đồng (Bộ luật Lao động 2019)</h3>
${kv([
  ['Thời gian thử việc', 'Hai bên thoả thuận, nhưng tối đa 60 ngày với công việc cần trình độ cao đẳng trở lên (Điều 25). Mỗi công việc chỉ được thử việc một lần.'],
  ['Lương thử việc', 'Ít nhất bằng 85% mức lương của công việc đó (Điều 26).'],
  ['Loại hợp đồng', 'Không xác định thời hạn, hoặc xác định thời hạn tối đa 36 tháng.'],
  ['Bằng văn bản', 'Xin offer và hợp đồng bằng văn bản trước khi nghỉ việc ở đâu đó hay ngừng ứng tuyển nơi khác.'],
])}
${bay('vi', 'nhận một offer bằng lời rồi dừng mọi đơn ứng tuyển khác.', 'Chừng nào chưa có điều kiện bằng văn bản và chưa ký, chưa có gì là chắc. Giữ bảng theo dõi còn sống, và chỉ báo các công ty khác sau khi đã ký.')}

<h3>So sánh hai offer có trọng số</h3>
<p>Chấm mỗi tiêu chí từ 1 tới 5, nhân với trọng số, rồi cộng lại. Trọng số dưới đây hợp với một thực tập sinh OJT; hãy đổi theo bạn.</p>
${bang(['Tiêu chí', 'Trọng số', 'Offer A', 'Offer B'], [
  ['Được trường chấp nhận, thời gian phủ kỳ OJT', '×5 (bắt buộc)', '5 → 25', '5 → 25'],
  ['Học được gì (việc thật, review code, công nghệ)', '×4', '4 → 16', '2 → 8'],
  ['Chất lượng mentor và đội (cảm nhận qua phỏng vấn)', '×3', '4 → 12', '3 → 9'],
  ['Trợ cấp', '×2', '2 → 4', '4 → 8'],
  ['Đi lại / hybrid', '×2', '3 → 6', '5 → 10'],
  ['Cơ hội lên chính thức', '×2', '4 → 8', '2 → 4'],
  ['Tổng', '', '<strong>71</strong>', '<strong>64</strong>'],
])}
<p>Ở đây A thắng dù trợ cấp thấp hơn. Với một kỳ OJT, thứ tự ưu tiên là: <strong>qua được kỳ thực tập, học được việc thật, có một người xác nhận cho mình</strong>. Tiền có quan trọng, nhưng hiếm khi nên là thứ quyết định giữa hai nơi đều chấp nhận được.</p>

<h3>Thương lượng cho lịch sự</h3>
${stack([
  ['Cảm ơn và tỏ ra quan tâm trước', '"Em cảm ơn, em rất hào hứng với vị trí này."'],
  ['Hỏi, đừng đòi', '"Không biết bên mình có linh hoạt được về trợ cấp / ngày bắt đầu / số ngày làm hybrid không ạ?"'],
  ['Đưa lý do', 'Một offer khác (có thật), đường đi xa hơn, một kỹ năng bạn mang lại.'],
  ['Biết cái gì xê dịch được', 'Với thực tập sinh, tiền hiếm khi thay đổi nhiều; lịch làm, số ngày remote, ngày bắt đầu và mentor thì thường được.'],
  ['Nhận câu trả lời tử tế', 'Dù câu trả lời ra sao, đáp lại lịch sự và xác nhận bằng văn bản.'],
])}
${neu('vi', 'công ty hỏi "Em mong muốn trợ cấp bao nhiêu?" ngay vòng sàng lọc đầu? Nói thế này là ổn: "Em chủ yếu tìm một nơi được học việc backend thật. Anh/chị có thể chia sẻ khoảng trợ cấp của vị trí này không ạ?" Nếu họ vẫn hỏi, đưa một khoảng dựa trên những gì bạn tìm hiểu được từ bạn bè và báo cáo công khai cho loại công ty đó — và đừng bao giờ bịa ra một offer khác.')}
${keXau('vi', 'offer giả hay tới kèm một yêu cầu "nhỏ": phí đào tạo, đồng phục hay "kiểm tra lý lịch"; mua laptop qua họ; hay đăng nhập ngân hàng "để mở tài khoản nhận lương". Nhà tuyển dụng thật không bao giờ thu tiền để bạn bắt đầu làm, và chỉ cần số tài khoản, không bao giờ cần mật khẩu hay OTP. Kiểm thêm offer gửi từ tên miền công ty và khớp với người đã phỏng vấn bạn.')}

${thucHanh('vi', { phut: '30', steps: [
  'Lấy một offer thật hoặc mẫu và điền bảng "các phần của một offer", đánh dấu mọi dòng bạn chưa biết.',
  'Viết câu hỏi gửi HR cho từng dòng chưa biết (ví dụ: "Trợ cấp trả theo thoả thuận thực tập phải không ạ? Có khấu trừ khoản nào không ạ?").',
  'Tính net từ gross bằng một công cụ tính gross/net online và so với phép tính ở trên.',
  'Nếu có hai lựa chọn, điền bảng có trọng số theo trọng số của bạn và viết một câu về kết quả.',
], dat: 'bạn có bảng kiểm offer đã điền, danh sách câu hỏi cho HR, một con số net tự tính, và (nếu có) một bảng so sánh có trọng số.' })}
${thuatNgu('vi', [
  ['Gross / net (trước / sau khấu trừ)', 'Trước / sau bảo hiểm phần người lao động và thuế thu nhập cá nhân.'],
  ['Internship allowance (trợ cấp thực tập)', 'Khoản tiền trả cho thực tập sinh, thường không theo hợp đồng lao động.'],
  ['Probation (thử việc)', 'Giai đoạn làm thử trước hợp đồng chính thức; luật có giới hạn.'],
  ['NDA (thoả thuận bảo mật)', 'Những gì bạn không được tiết lộ về công việc của công ty.'],
  ['IP (sở hữu trí tuệ)', 'Quyền sở hữu code và ý tưởng bạn tạo ra trong công việc.'],
  ['Giảm trừ gia cảnh', 'Khoản được trừ trước khi tính thuế: cho bản thân và cho mỗi người phụ thuộc.'],
])}
${tomTat('vi', [
  'Đọc từng phần: vị trí, thời gian, tiền, thử việc, loại hợp đồng, NDA/sở hữu trí tuệ, phúc lợi.',
  'Người lao động đóng 10,5% bảo hiểm; thuế thu nhập chỉ tính trên phần vượt mức giảm trừ 2026 (15,5 triệu + 6,2 triệu/người phụ thuộc).',
  'Hỏi HR cách chi trả trợ cấp thực tập; đừng tự đoán.',
  'Thử việc: tối đa 60 ngày với việc cần bằng cao đẳng trở lên, lương ít nhất 85%; mọi thứ phải bằng văn bản.',
  'So sánh offer bằng trọng số; với OJT, qua môn và học được việc đứng trên tiền.',
  'Mọi yêu cầu nộp phí, mua laptop hay đưa mật khẩu đều là dấu hiệu lừa đảo.',
])}
${lienQuan('vi', [
  yt('J30wmYgzVXM', 'Jeff Su', 'How to Negotiate Salary after Job Offer — 5 Practical Tips', 8),
  yt('6mq7pTpxNbg', 'Indeed', '5 Things to Consider BEFORE Accepting a Job Offer', 10),
  nguon('🏛️', 'Cổng thông tin Nghệ An — Nghị quyết 110/2025/UBTVQH15', 'Tóm tắt chính thức mức giảm trừ gia cảnh 2026 (15,5 / 6,2 triệu đồng).', 'https://hcc.nghean.gov.vn/tin-tong-hop/nghi-quyet-110-2025-ubtvqh15-dieu-chinh-muc-giam-tru-gia-canh-cua-thue-thu-nhap-ca-nhan-2448.html'),
  nguon('📰', 'VOH (2026) — Từ 2026, mức đóng BHXH, BHYT, BHTN được tính thế nào', 'Người lao động 8% + 1,5% + 1% = 10,5%, năm 2026 không đổi.', 'https://voh.com.vn/phap-luat/tu-2026-muc-dong-bhxh-bhyt-bhtn-cua-nld-va-nsdld-duoc-tinh-nhu-the-nao-645283.html'),
  nguon('🧮', 'TopCV — công cụ tính lương gross/net', 'Nhập gross, vùng và số người phụ thuộc để xem bảo hiểm, thuế và thực nhận.', 'https://www.topcv.vn/tinh-luong-gross-net'),
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-8-1-ethics-transition', academy: true, title: 'Academy · OJT202 8.1 — Đạo đức nghề nghiệp, bảo mật và chuyển tiếp', sub: 'NDA có nghĩa gì với báo cáo OJT và CV của bạn.' }),
])}
</div>
`,
};

/* ═══════════════════════ 9.4 — Checklist sẵn sàng ═══════════════════════ */
const CHECK_EN = `
PROFILE         [ ] CV (PDF, one page) matches what I will say   [ ] GitHub repos pinned, READMEs readable
                [ ] LinkedIn complete                            [ ] Links in the CV all open on a phone
STORIES         [ ] 60-s introduction (VI + EN)                  [ ] 5 STAR stories, each under 2 minutes
                [ ] 1 incident story with what changed after     [ ] 3 questions to ask them
TECHNICAL       [ ] Re-read the posting's skills column          [ ] 10 likely questions answered out loud
                [ ] My main project: one request end to end      [ ] I can open and explain any file I list
ENGLISH         [ ] 10 hardest words practised                   [ ] Rescue sentences on one card
LOGISTICS       [ ] Time, time zone, address or link confirmed   [ ] Interviewer's name and role
                [ ] Online: camera, mic, lighting, backup 4G     [ ] In person: route, arrive 10-15 min early
`;

const CHECK_VI = `
HỒ SƠ           [ ] CV (PDF, 1 trang) khớp với điều mình sẽ nói  [ ] Repo GitHub đã ghim, README đọc được
                [ ] LinkedIn đầy đủ                              [ ] Mọi link trong CV mở được trên điện thoại
CÂU CHUYỆN      [ ] Giới thiệu 60 giây (VI + EN)                 [ ] 5 câu chuyện STAR, mỗi câu dưới 2 phút
                [ ] 1 câu chuyện sự cố có "sau đó đã đổi gì"     [ ] 3 câu hỏi để hỏi lại họ
KỸ THUẬT        [ ] Đọc lại cột kỹ năng của tin tuyển dụng       [ ] 10 câu dễ bị hỏi đã trả lời thành tiếng
                [ ] Dự án chính: đi một request từ đầu tới cuối  [ ] Mở và giải thích được mọi tệp mình liệt kê
TIẾNG ANH       [ ] 10 từ khó nhất đã luyện                      [ ] Câu cứu nguy chép vào một thẻ
HẬU CẦN         [ ] Giờ, múi giờ, địa chỉ hoặc link đã xác nhận  [ ] Tên và vai trò người phỏng vấn
                [ ] Online: camera, micro, ánh sáng, 4G dự phòng [ ] Trực tiếp: đường đi, tới sớm 10-15 phút
`;

const L94 = {
  title: '9.4 — Your interview-ready checklist: the day before, the morning of, and the online setup|||9.4 — Checklist sẵn sàng phỏng vấn: ngày hôm trước, buổi sáng hôm đó, và chuẩn bị phỏng vấn online',
  slug: 'pv-9-4-tong-ket',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một trang checklist năm nhóm (hồ sơ, câu chuyện, kỹ thuật, tiếng Anh, hậu cần), việc cần làm ngày hôm trước và buổi sáng, cách dựng góc phỏng vấn online (camera ngang mắt, ánh sáng, micro, mạng dự phòng, màn hình sạch), quy tắc khi bị trễ hay mất mạng, và bản đồ khoá học để ôn lại đúng chỗ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Your interview-ready checklist — so nothing avoidable goes wrong</h2>
<p class="lead">Most bad first impressions are not about knowledge. They are a frozen camera, a wrong meeting link, a CV link that opens a 404, or arriving flustered after getting lost. Pilots use checklists not because they forget how to fly but because stress makes everyone skip steps. This lesson is your one-page checklist, plus what to do the day before, the morning of, and when something goes wrong anyway.</p>

<h3>An everyday picture: packing for an exam</h3>
${doiThuong('en', 'Before a final exam you check: student card, pens, calculator, the room number, the start time. You do it the night before, not in the corridor. The interview checklist is the same habit — prepared calmly the day before, so the morning is only for warming up.')}

<h3>The one-page checklist</h3>
${ra(CHECK_EN)}

<h3>The day before and the morning of</h3>
${flow([
  ['Day before · evening', 'prepare, do not cram', 'Re-read the posting and your tracker notes for this company, say your introduction and two STAR stories out loud, test the meeting link and your setup, lay out clothes and documents. Then stop and sleep.'],
  ['Morning · 2 hours before', 'warm up your voice and brain', 'Say the introduction once in each language; explain your main project out loud while drawing it; do one easy coding problem if there is a coding round.'],
  ['30 minutes before', 'logistics only', 'Online: restart the computer, close everything except the meeting and one notes file, phone on silent. In person: arrive in the area, find the entrance.'],
  ['5 minutes before', 'join or arrive', 'Join the online room 2–3 minutes early, or arrive at reception 10–15 minutes early. Breathe slowly; smile when they appear.'],
])}

<h3>Setting up an online interview</h3>
${stack([
  ['Camera at eye level', 'Raise the laptop on books. Look at the camera when you speak, at the screen when you listen.'],
  ['Light in front of you', 'A window or lamp behind the screen, not behind you — otherwise you are a dark silhouette.'],
  ['Sound', 'Wired earphones with a microphone beat laptop speakers (no echo). Test with a friend or a test call.'],
  ['Network', 'Close downloads and sync tools. Keep a phone hotspot ready as a backup and know how to switch in 30 seconds.'],
  ['Clean screen', 'Close chats, email, .env files and admin pages; turn off notifications; use a neutral display name (your real name).'],
])}
${bay('en', 'testing the meeting tool five minutes before.', 'Meet, Teams and Zoom may need an update, a browser permission for the camera, or a sign-in. Test the exact link the evening before; on the day, only join.')}
${neu('en', 'your internet dies in the middle of the interview? Switch to the phone hotspot and rejoin. If that fails within two minutes, send a short message to the recruiter: "Sorry, my connection dropped. I am rejoining now / could we continue by phone?" Calm recovery is remembered more than the outage. Running late? Message before the start time with an honest new arrival time — never silently.')}
${keXau('en', 'the morning of the interview is when a fake "link change" message can land: "The interview has moved to this new link", sent from a personal account or a lookalike domain, leading to a fake sign-in page. Only accept changes from the same address that sent the original invitation, and never enter your email password to "open" a meeting.')}

<h3>In person: clothes, what to bring, the first minute</h3>
${kv([
  ['Clothes', 'Clean, simple and one step more formal than the team: a plain shirt or polo and trousers fit almost every IT office in Vietnam. Look at the company’s photos on its careers page to calibrate.'],
  ['Bring', 'Your ID card (reception often asks), two printed copies of your CV, a pen and a small notebook, a charged phone, and water.'],
  ['Laptop?', 'Only if they asked, or if you want to show a project — with it already open, offline-ready, and with private tabs and files closed.'],
  ['The first minute', 'Greet the receptionist politely (interviewers sometimes ask them), stand up when the interviewer arrives, give your name clearly.'],
])}
<h3>Where to revise, by symptom</h3>
${bang(['If you feel weak on…', 'Re-read'], [
  ['"Tell me about yourself"', 'Lessons 2.1 and 8.1'],
  ['Talking about a project', 'Lessons 1.2, 2.2 and 8.2'],
  ['Failures and incidents', 'Lesson 2.3'],
  ['Teamwork, conflict, pressure', 'Chapter 3'],
  ['Backend / SQL / API', 'Chapter 4'],
  ['Git / Docker / CI / Linux', 'Chapter 5'],
  ['React / Next.js / browser', 'Chapter 6'],
  ['Coding round, system design', 'Chapter 7'],
  ['Not understanding English questions', 'Lesson 8.4'],
])}

${thucHanh('en', { phut: '30', steps: [
  'Copy the checklist into <code>~/interview-kit/checklist.md</code> and tick what is already done.',
  'For every unticked line, write the date you will do it (before your next interview).',
  'Set up your online corner: camera height, light, earphones, hotspot. Take a screenshot of yourself in a test call and check light and framing.',
  'Practise the "connection dropped" message and the "running late" message; save both as phone notes.',
], dat: 'every checklist line is ticked or has a date, and a test-call screenshot shows your face clearly lit at eye level with a clean background.' })}
${thuatNgu('en', [
  ['Checklist', 'A list you tick, so stress cannot make you skip a step.'],
  ['Hotspot', 'Sharing your phone’s mobile data with your laptop.'],
  ['Display name', 'The name shown under your video in a meeting.'],
  ['Reception', 'The front desk of an office where visitors check in.'],
  ['Framing', 'What the camera shows: your head and shoulders, centred.'],
])}
${tomTat('en', [
  'Use a one-page checklist: profile, stories, technical, English, logistics.',
  'Prepare the evening before; use the morning only to warm up.',
  'Online: camera at eye level, light in front, wired earphones, backup hotspot, clean screen.',
  'If the connection fails or you are late, message calmly and honestly — never go silent.',
  'Accept meeting-link changes only from the original sender.',
])}
${lienQuan('en', [
  yt('PpbhaVjV2QI', 'CareerVidz', 'Top 10 Virtual Job Interview Tips', 8, 'en'),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-14-5-chia-se-mang-hotspot', L: 'en', title: 'Networking 14.5 — Sharing a connection and hotspots', sub: 'How a phone hotspot really works — your backup network for online interviews.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Checklist sẵn sàng phỏng vấn — để không có gì đáng tránh lại xảy ra</h2>
<p class="lead">Phần lớn ấn tượng đầu tệ không phải do kiến thức. Đó là camera đứng hình, nhầm link phòng họp, link trong CV mở ra trang 404, hay tới nơi trong tình trạng cuống cuồng vì lạc đường. Phi công dùng checklist không phải vì quên cách lái máy bay, mà vì căng thẳng làm ai cũng bỏ sót bước. Bài này là checklist một trang của bạn, kèm việc phải làm ngày hôm trước, buổi sáng hôm đó, và khi dù đã chuẩn bị vẫn có chuyện trục trặc.</p>

<h3>Liên tưởng đời thường: chuẩn bị đồ đi thi</h3>
${doiThuong('vi', 'Trước kỳ thi cuối kỳ bạn kiểm: thẻ sinh viên, bút, máy tính cầm tay, số phòng, giờ bắt đầu. Bạn làm từ tối hôm trước, không phải ở hành lang phòng thi. Checklist phỏng vấn là đúng thói quen đó — chuẩn bị thong thả từ hôm trước, để buổi sáng chỉ còn việc khởi động.')}

<h3>Checklist một trang</h3>
${ra(CHECK_VI)}

<h3>Ngày hôm trước và buổi sáng hôm đó</h3>
${flow([
  ['Tối hôm trước', 'chuẩn bị, đừng nhồi', 'Đọc lại tin tuyển dụng và ghi chú trong bảng theo dõi cho công ty này, nói to lời giới thiệu và hai câu chuyện STAR, thử link phòng họp và góc máy, để sẵn quần áo và giấy tờ. Rồi dừng lại, đi ngủ.'],
  ['Buổi sáng · trước 2 giờ', 'khởi động giọng và đầu óc', 'Nói lời giới thiệu một lần mỗi thứ tiếng; vừa vẽ vừa giải thích dự án chính thành tiếng; làm một bài code dễ nếu có vòng coding.'],
  ['Trước 30 phút', 'chỉ lo hậu cần', 'Online: khởi động lại máy, đóng mọi thứ trừ phòng họp và một tệp ghi chú, điện thoại im lặng. Trực tiếp: tới khu vực, tìm cửa vào.'],
  ['Trước 5 phút', 'vào phòng hoặc tới nơi', 'Vào phòng online sớm 2–3 phút, hoặc tới quầy lễ tân sớm 10–15 phút. Thở chậm; mỉm cười khi họ xuất hiện.'],
])}

<h3>Dựng góc phỏng vấn online</h3>
${stack([
  ['Camera ngang tầm mắt', 'Kê laptop lên vài cuốn sách. Nhìn vào camera khi nói, nhìn màn hình khi nghe.'],
  ['Ánh sáng chiếu phía trước mặt', 'Cửa sổ hay đèn đặt sau màn hình, không phải sau lưng bạn — không thì bạn thành một cái bóng đen.'],
  ['Âm thanh', 'Tai nghe có dây kèm micro tốt hơn loa laptop (không vang). Thử với bạn bè hoặc một cuộc gọi thử.'],
  ['Mạng', 'Tắt các trình tải và đồng bộ. Để sẵn hotspot điện thoại làm dự phòng và biết cách chuyển trong 30 giây.'],
  ['Màn hình sạch', 'Đóng chat, email, tệp .env, trang quản trị; tắt thông báo; dùng tên hiển thị trung tính (tên thật của bạn).'],
])}
${bay('vi', 'thử công cụ họp trước năm phút.', 'Meet, Teams hay Zoom có thể cần cập nhật, cần cấp quyền camera cho trình duyệt, hoặc cần đăng nhập. Hãy thử đúng cái link đó từ tối hôm trước; hôm phỏng vấn chỉ việc bấm vào.')}
${neu('vi', 'mạng chết ngay giữa buổi phỏng vấn? Chuyển sang hotspot điện thoại và vào lại. Nếu hai phút vẫn không được, nhắn ngắn cho người tuyển dụng: "Em xin lỗi, mạng nhà em vừa mất. Em đang vào lại / mình tiếp tục qua điện thoại được không ạ?" Cách gỡ lại bình tĩnh được nhớ lâu hơn sự cố. Sắp trễ? Nhắn TRƯỚC giờ bắt đầu kèm giờ tới mới thành thật — đừng bao giờ im lặng.')}
${keXau('vi', 'sáng hôm phỏng vấn chính là lúc một tin "đổi link" giả có thể xuất hiện: "Buổi phỏng vấn đã chuyển sang link mới này", gửi từ tài khoản cá nhân hoặc tên miền na ná, dẫn tới một trang đăng nhập giả. Chỉ chấp nhận thay đổi từ đúng địa chỉ đã gửi thư mời ban đầu, và không bao giờ nhập mật khẩu email để "mở" một phòng họp.')}

<h3>Phỏng vấn trực tiếp: trang phục, mang theo gì, phút đầu tiên</h3>
${kv([
  ['Trang phục', 'Sạch sẽ, đơn giản và trang trọng hơn đội một bậc: áo sơ mi trơn hoặc polo với quần dài hợp với gần như mọi văn phòng IT ở Việt Nam. Xem ảnh trên trang tuyển dụng của công ty để căn chỉnh.'],
  ['Mang theo', 'Căn cước (lễ tân hay hỏi), hai bản CV in, bút và sổ nhỏ, điện thoại đã sạc đầy, và nước uống.'],
  ['Có mang laptop không?', 'Chỉ khi họ yêu cầu, hoặc bạn muốn cho xem dự án — mở sẵn, chạy được khi không có mạng, và đã đóng các tab, tệp riêng tư.'],
  ['Phút đầu tiên', 'Chào lễ tân lịch sự (người phỏng vấn đôi khi hỏi họ), đứng dậy khi người phỏng vấn tới, nói rõ tên mình.'],
])}
<h3>Ôn lại ở đâu, theo triệu chứng</h3>
${bang(['Nếu bạn thấy yếu ở…', 'Đọc lại'], [
  ['"Giới thiệu về bản thân"', 'Bài 2.1 và 8.1'],
  ['Kể về một dự án', 'Bài 1.2, 2.2 và 8.2'],
  ['Thất bại và sự cố', 'Bài 2.3'],
  ['Làm nhóm, xung đột, áp lực', 'Chương 3'],
  ['Backend / SQL / API', 'Chương 4'],
  ['Git / Docker / CI / Linux', 'Chương 5'],
  ['React / Next.js / trình duyệt', 'Chương 6'],
  ['Vòng coding, system design', 'Chương 7'],
  ['Không hiểu câu hỏi tiếng Anh', 'Bài 8.4'],
])}

${thucHanh('vi', { phut: '30', steps: [
  'Chép checklist vào <code>~/interview-kit/checklist.md</code> và đánh dấu những gì đã xong.',
  'Với mỗi dòng chưa đánh dấu, ghi ngày bạn sẽ làm (trước buổi phỏng vấn kế tiếp).',
  'Dựng góc online: độ cao camera, ánh sáng, tai nghe, hotspot. Chụp màn hình mình trong một cuộc gọi thử, kiểm ánh sáng và khung hình.',
  'Tập soạn tin "mất mạng" và tin "sắp trễ"; lưu cả hai vào ghi chú điện thoại.',
], dat: 'mọi dòng của checklist đã đánh dấu hoặc có ngày, và ảnh chụp cuộc gọi thử cho thấy mặt bạn sáng rõ, camera ngang tầm mắt, phía sau gọn gàng.' })}
${thuatNgu('vi', [
  ['Checklist (danh sách kiểm)', 'Danh sách đánh dấu từng dòng, để căng thẳng không làm bạn bỏ sót bước.'],
  ['Hotspot (điểm phát sóng)', 'Chia dữ liệu di động của điện thoại cho laptop.'],
  ['Display name (tên hiển thị)', 'Tên hiện dưới khung video của bạn trong phòng họp.'],
  ['Reception (quầy lễ tân)', 'Quầy ở sảnh văn phòng, nơi khách đăng ký vào.'],
  ['Framing (khung hình)', 'Phần camera thấy: đầu và vai, ở giữa.'],
])}
${tomTat('vi', [
  'Dùng checklist một trang: hồ sơ, câu chuyện, kỹ thuật, tiếng Anh, hậu cần.',
  'Chuẩn bị từ tối hôm trước; buổi sáng chỉ để khởi động.',
  'Online: camera ngang mắt, ánh sáng trước mặt, tai nghe có dây, hotspot dự phòng, màn hình sạch.',
  'Mất mạng hay sắp trễ thì nhắn bình tĩnh, thành thật — đừng im lặng.',
  'Chỉ chấp nhận đổi link phòng họp từ đúng người gửi ban đầu.',
])}
${lienQuan('vi', [
  yt('PpbhaVjV2QI', 'CareerVidz', 'Top 10 Virtual Job Interview Tips', 8),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-14-5-chia-se-mang-hotspot', title: 'Networking 14.5 — Chia sẻ mạng và hotspot', sub: 'Hotspot điện thoại thật ra chạy thế nào — mạng dự phòng cho buổi phỏng vấn online.' }),
])}
</div>
`,
};

/* ═══════════════════════ 9.5 — Lab: email + offer ═══════════════════════ */
const HAI_OFFER = `
OFFER A — "Acme Software" (illustrative)                OFFER B — "Beta Studio" (illustrative)
- Backend intern, Node.js team, mentor named            - "Developer intern", team not specified
- 01/2027 - 04/2027, on-site 5 days                      - 01/2027 - 03/2027, hybrid 3 days home
- Allowance: amount stated, paid monthly                 - Allowance: higher, paid "after the internship"
- Signs the school's OJT forms                           - "We can sign if needed"
- Tasks: real tickets, code review every PR              - Tasks: "support projects as needed"
- Sent from hr@acme.example (domain matches site)        - Sent from a personal Gmail; asks for a 500,000 VND
                                                           "equipment deposit" before the start date
`;

const L95 = {
  title: '9.5 — Lab 9: write the four emails and decide between two offers|||9.5 — Lab 9: viết bốn email và chọn giữa hai offer',
  slug: 'pv-9-5-lab-email-offer',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab hai phần: (1) viết bốn email thật (cảm ơn, hỏi tiếp, xin góp ý, nhận hoặc từ chối offer) bằng tiếng Việt và tiếng Anh theo tình huống cho sẵn; (2) đọc hai offer minh hoạ, tìm dấu hiệu rủi ro và lừa đảo, chấm bảng trọng số, viết thư nhận một nơi và từ chối nơi kia — tự chấm bằng rubric.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab 9</span>
<h2>Lab 9 — Four emails and one decision</h2>
<p class="lead">This lab turns Lessons 9.2 and 9.3 into products you keep: four emails you can send with small edits, and a decision you can defend. The situation is invented, but every detail in it — a vague team, a late allowance, a deposit request from a personal address — is a pattern students meet.</p>

<h3>The situation</h3>
<p>You interviewed at two companies in late November. Acme interviewed you on Monday and promised an answer "by Friday"; it is now the next Wednesday and you have heard nothing. Beta sent an offer yesterday with a reply deadline in three days. You also had an interview at Gamma last week and were rejected today. Both offers are below:</p>
${ra(HAI_OFFER)}
${flow([
  ['Part 1 · emails', 'four messages', 'Follow up with Acme, ask Gamma for feedback, and prepare the thank-you you should have sent after the Acme interview (for next time).'],
  ['Part 2 · read', 'risks and red flags', 'List every risk in both offers, and mark which ones are scam signs.'],
  ['Part 3 · score', 'the weighted table', 'Use the table from Lesson 9.3 with your own weights.'],
  ['Part 4 · decide', 'accept one, decline or question the other', 'Write the acceptance (or a question to HR) and the decline.'],
])}

<h3>Steps</h3>
<ol>
<li>Write the Acme follow-up (Lesson 9.2, email 2) — it is two working days after their promised date. Mention Beta’s deadline honestly.</li>
<li>Write the Gamma feedback request (email 3).</li>
<li>Write the thank-you you would send after an interview (email 1) with one specific, invented detail from the conversation.</li>
<li>List the risks in Offer B. Which are merely weak (vague team), and which are scam signs?</li>
<li>Fill the weighted comparison table and write two sentences explaining your decision.</li>
<li>Write the final email(s): accept the one you choose (only after having the terms in writing), and decline or withdraw from the other politely.</li>
</ol>
<details><summary>Hint 1 — what is wrong with Offer B</summary>
<p>Weak signs: the team and the tasks are vague ("support projects as needed"); the period may not cover the whole OJT semester; "we can sign if needed" for school forms is not a commitment. Scam signs: the offer comes from a personal Gmail, and asks for a deposit before you start. A real employer does not charge you to work. Even if Beta is real, the deposit request alone is reason to refuse or to verify by calling the company’s official number.</p>
</details>
<details><summary>Hint 2 — the Acme follow-up</summary>
<p>Keep it to four sentences: who you are and when you interviewed, a polite question about the update, the honest note that you have another offer with a deadline, and that Acme is your preferred option. Do not invent a deadline or an offer.</p>
</details>
${bay('en', 'accepting the higher allowance without reading the rest.', 'Offer B pays more, "after the internship", from a personal address, with a deposit first. The headline number is exactly what fake offers use to make you stop reading. Read the whole offer before you feel anything about the number.')}
${keXau('en', 'if you already paid a "deposit" to a fake employer, stop all further payments, keep every message and transfer receipt, contact your bank immediately, and report it to the police (in Vietnam, the local police or the Ministry of Public Security’s online channels). Then warn the student group where you found the posting — scammers reuse the same posting.')}

<h3>Self-assessment rubric (out of 12)</h3>
${rubric('en', [
  ['Follow-up email', 'Pushy or vague', 'Polite but missing the deadline note', 'Four sentences, honest deadline, clear preference'],
  ['Feedback request', 'Argues with the decision', 'Polite, generic', 'Polite, asks for 1–2 concrete points, keeps the door open'],
  ['Risk list', 'Misses the deposit', 'Finds scam signs only', 'Separates weak signs from scam signs'],
  ['Weighted table', 'No weights', 'Weights without reasons', 'Weights justified for an OJT intern'],
  ['Decision', 'Based on money only', 'Reasonable, not explained', 'Explained in two sentences tied to the weights'],
  ['Final emails', 'Missing one', 'Both, but abrupt', 'Both polite, written-terms condition respected'],
])}
${neu('en', 'Acme replies the same afternoon with a written offer? Compare again with real terms. If you choose Acme, decline Beta (or simply do not engage, if Beta is a scam), and tell your school coordinator according to the OJT process.')}

${thucHanh('en', { phut: '45–60', steps: [
  'Do the six steps and save the emails in <code>~/interview-kit/emails/lab9.md</code>, Vietnamese and English versions.',
  'Score yourself with the rubric.',
  'Rewrite every part that scored 0 or 1.',
], dat: 'the rubric score is at least 10 out of 12, and your risk list separates "weak" from "scam" signs.' })}
${thuatNgu('en', [
  ['Deadline', 'The date by which you must answer an offer.'],
  ['Red flag', 'A sign that something is wrong or dangerous.'],
  ['Deposit', 'Money paid in advance — never required to start a job.'],
  ['Withdraw / decline', 'Leave a process you are in / say no to an offer.'],
  ['Weighted score', 'A total where each criterion counts according to its importance.'],
])}
${tomTat('en', [
  'Turn the email templates into your own, in both languages, and save them.',
  'Mention a competing deadline honestly; never invent one.',
  'Read the whole offer before reacting to the number.',
  'A deposit request or a personal-address offer is a scam sign; verify through official channels.',
  'Decide with weights you can explain, and accept only written terms.',
])}
${lienQuan('en', [
  yt('d-SUf-I8fXo', 'Self Made Millennial', 'Thank You Email After Interview — 3-Step Template', 6, 'en'),
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-1-1-what-is-ojt', academy: true, L: 'en', title: 'Academy · OJT202 1.1 — OJT, prerequisites and the FPTU process', sub: 'Step 3 of the school process: what to send once a company accepts you.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab 9</span>
<h2>Lab 9 — Bốn email và một quyết định</h2>
<p class="lead">Lab này biến bài 9.2 và 9.3 thành những thứ bạn giữ lại dùng: bốn email gửi được chỉ với vài chỗ sửa, và một quyết định bạn bảo vệ được. Tình huống là bịa, nhưng từng chi tiết trong đó — đội không rõ, trợ cấp trả muộn, đòi đặt cọc từ địa chỉ cá nhân — đều là khuôn mẫu sinh viên hay gặp.</p>

<h3>Tình huống</h3>
<p>Cuối tháng 11 bạn phỏng vấn ở hai công ty. Acme phỏng vấn bạn hôm thứ Hai và hẹn trả lời "trước thứ Sáu"; giờ đã là thứ Tư tuần sau mà chưa có tin gì. Beta gửi offer hôm qua, hạn trả lời trong ba ngày. Tuần trước bạn còn phỏng vấn ở Gamma và hôm nay nhận lời từ chối. Hai offer như sau (bản tiếng Anh trong khối mẫu — tóm tắt tiếng Việt ở dưới):</p>
${ra(HAI_OFFER)}
<ul>
<li><strong>Offer A (Acme):</strong> thực tập backend đội Node.js, có tên mentor; 01–04/2027, làm tại văn phòng 5 ngày; trợ cấp ghi rõ số tiền, trả hằng tháng; ký giấy tờ OJT của trường; việc thật, mọi PR đều được review; gửi từ email đúng tên miền công ty.</li>
<li><strong>Offer B (Beta):</strong> "thực tập lập trình", không rõ đội; 01–03/2027, hybrid 3 ngày ở nhà; trợ cấp cao hơn nhưng trả "sau khi kết thúc thực tập"; "nếu cần thì ký được" giấy tờ trường; việc "hỗ trợ dự án khi cần"; gửi từ Gmail cá nhân và đòi 500.000 đ "tiền cọc thiết bị" trước ngày bắt đầu.</li>
</ul>
${flow([
  ['Phần 1 · email', 'bốn tin nhắn', 'Hỏi tiếp Acme, xin Gamma góp ý, và soạn email cảm ơn lẽ ra phải gửi sau buổi phỏng vấn Acme (cho lần sau).'],
  ['Phần 2 · đọc', 'rủi ro và cờ đỏ', 'Liệt kê mọi rủi ro của cả hai offer, đánh dấu cái nào là dấu hiệu lừa đảo.'],
  ['Phần 3 · chấm', 'bảng có trọng số', 'Dùng bảng ở bài 9.3 với trọng số của bạn.'],
  ['Phần 4 · quyết định', 'nhận một nơi, từ chối hoặc hỏi lại nơi kia', 'Viết thư nhận (hoặc câu hỏi gửi HR) và thư từ chối.'],
])}

<h3>Các bước</h3>
<ol>
<li>Viết email hỏi tiếp Acme (bài 9.2, email 2) — đã hai ngày làm việc sau ngày họ hẹn. Nói thật về hạn trả lời của Beta.</li>
<li>Viết email xin Gamma góp ý (email 3).</li>
<li>Viết email cảm ơn sau một buổi phỏng vấn (email 1) có một chi tiết cụ thể (bịa) từ cuộc trò chuyện.</li>
<li>Liệt kê rủi ro của Offer B. Cái nào chỉ là điểm yếu (đội mơ hồ), cái nào là dấu hiệu lừa đảo?</li>
<li>Điền bảng so sánh có trọng số và viết hai câu giải thích quyết định.</li>
<li>Viết email cuối: nhận nơi bạn chọn (chỉ sau khi đã có điều kiện bằng văn bản), và từ chối hoặc rút hồ sơ ở nơi kia một cách lịch sự.</li>
</ol>
<details><summary>Gợi ý 1 — Offer B sai ở đâu</summary>
<p>Điểm yếu: đội và công việc mơ hồ ("hỗ trợ dự án khi cần"); khoảng thời gian có thể không phủ hết kỳ OJT; "nếu cần thì ký được" giấy tờ trường không phải một cam kết. Dấu hiệu lừa đảo: offer gửi từ Gmail cá nhân, và đòi tiền cọc trước khi bắt đầu. Nhà tuyển dụng thật không thu tiền của bạn để bạn được làm việc. Kể cả nếu Beta có thật, riêng yêu cầu đặt cọc đã là lý do để từ chối hoặc xác minh bằng cách gọi số chính thức của công ty.</p>
</details>
<details><summary>Gợi ý 2 — email hỏi tiếp Acme</summary>
<p>Giữ trong bốn câu: bạn là ai và phỏng vấn ngày nào, một câu lịch sự hỏi thông tin, một câu thành thật rằng bạn có offer khác kèm hạn trả lời, và Acme là lựa chọn bạn thích hơn. Đừng bịa ra hạn hay offer nào.</p>
</details>
${bay('vi', 'nhận offer có trợ cấp cao hơn mà không đọc phần còn lại.', 'Offer B trả nhiều hơn, "sau khi kết thúc thực tập", từ địa chỉ cá nhân, kèm tiền cọc trước. Con số to là đúng thứ offer giả dùng để bạn ngừng đọc. Đọc hết offer trước khi cảm thấy gì về con số.')}
${keXau('vi', 'nếu bạn đã lỡ chuyển "tiền cọc" cho một nhà tuyển dụng giả: dừng mọi khoản chuyển tiếp theo, giữ lại mọi tin nhắn và biên lai chuyển khoản, liên hệ ngân hàng ngay, và trình báo công an (công an địa phương hoặc kênh trực tuyến của Bộ Công an). Sau đó cảnh báo nhóm sinh viên nơi bạn thấy tin — kẻ lừa dùng lại cùng một tin đăng.')}

<h3>Bảng tự chấm (thang 12)</h3>
${rubric('vi', [
  ['Email hỏi tiếp', 'Thúc ép hoặc mơ hồ', 'Lịch sự nhưng thiếu câu về hạn trả lời', 'Bốn câu, nói thật về hạn, nói rõ mình thích nơi nào'],
  ['Email xin góp ý', 'Cãi lại quyết định', 'Lịch sự, chung chung', 'Lịch sự, xin 1–2 điểm cụ thể, giữ cửa mở'],
  ['Danh sách rủi ro', 'Bỏ sót tiền cọc', 'Chỉ thấy dấu hiệu lừa đảo', 'Tách được điểm yếu khỏi dấu hiệu lừa đảo'],
  ['Bảng trọng số', 'Không có trọng số', 'Có trọng số, không có lý do', 'Trọng số có lý do hợp với thực tập sinh OJT'],
  ['Quyết định', 'Chỉ dựa vào tiền', 'Hợp lý nhưng không giải thích', 'Giải thích bằng hai câu gắn với trọng số'],
  ['Email cuối', 'Thiếu một email', 'Đủ cả hai nhưng cộc lốc', 'Cả hai lịch sự, giữ điều kiện "có văn bản mới nhận"'],
])}
${neu('vi', 'Acme trả lời ngay chiều hôm đó kèm offer bằng văn bản? So sánh lại với điều kiện thật. Nếu chọn Acme, từ chối Beta (hoặc đơn giản là ngừng trao đổi, nếu Beta là lừa đảo), và báo cho điều phối viên của trường theo đúng quy trình OJT.')}

${thucHanh('vi', { phut: '45–60', steps: [
  'Làm sáu bước và lưu các email vào <code>~/interview-kit/emails/lab9.md</code>, bản tiếng Việt và tiếng Anh.',
  'Tự chấm bằng rubric.',
  'Viết lại mọi phần được 0 hoặc 1 điểm.',
], dat: 'điểm rubric ít nhất 10/12, và danh sách rủi ro của bạn tách được "điểm yếu" khỏi "dấu hiệu lừa đảo".' })}
${thuatNgu('vi', [
  ['Deadline (hạn chót)', 'Ngày bạn phải trả lời một offer.'],
  ['Red flag (cờ đỏ)', 'Dấu hiệu có gì đó sai hoặc nguy hiểm.'],
  ['Deposit (tiền cọc)', 'Tiền trả trước — không bao giờ là điều kiện để bắt đầu một công việc.'],
  ['Withdraw / decline (rút / từ chối)', 'Rời một quy trình đang tham gia / nói không với một offer.'],
  ['Weighted score (điểm có trọng số)', 'Tổng điểm mà mỗi tiêu chí được tính theo mức quan trọng của nó.'],
])}
${tomTat('vi', [
  'Biến mẫu email thành của riêng bạn, ở cả hai ngôn ngữ, và lưu lại.',
  'Nói thật về hạn của offer kia; không bao giờ bịa.',
  'Đọc hết offer trước khi phản ứng với con số.',
  'Đòi tiền cọc hay offer từ địa chỉ cá nhân là dấu hiệu lừa đảo; xác minh qua kênh chính thức.',
  'Quyết định bằng trọng số giải thích được, và chỉ nhận điều kiện bằng văn bản.',
])}
${lienQuan('vi', [
  yt('d-SUf-I8fXo', 'Self Made Millennial', 'Thank You Email After Interview — 3-Step Template', 6),
  lienKet({ khoa: 'ojt202-on-the-job-training', bai: 'ojt202-1-1-what-is-ojt', academy: true, title: 'Academy · OJT202 1.1 — OJT, điều kiện tiên quyết và quy trình FPTU', sub: 'Bước 3 của quy trình trường: gửi gì khi công ty đã nhận bạn.' }),
])}
</div>
`,
};

/* ═══════════════════════ 9.6 — Quiz ═══════════════════════ */
const Q96 = {
  title: '9.6 — Chapter 9 check|||9.6 — Kiểm tra Chương 9',
  slug: 'pv-9-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về phỏng vấn thử, việc làm sau phỏng vấn, đọc offer (gross/net, thử việc, NDA), so sánh offer, checklist ngày phỏng vấn và nhận diện offer giả.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Chapter 9 check — mocks, follow-ups and offers</h2>
<p class="lead">Ten situations from the last stretch of the process. The figures used are those checked in Lesson 9.3 (November 2026).</p>
<h3>Self-check before you start</h3>
<ul>
<li>I have run a timed 45-minute mock and scored it.</li>
<li>I have four email templates in two languages.</li>
<li>I can explain gross versus net and what 10.5% is.</li>
<li>I can compare two offers with weights and explain my choice.</li>
<li>I can list at least four signs of a fake offer.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Kiểm tra Chương 9 — phỏng vấn thử, theo tiếp và offer</h2>
<p class="lead">Mười tình huống ở chặng cuối của quá trình. Các con số dùng ở đây là những con số đã kiểm ở bài 9.3 (tháng 11/2026).</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đã chạy một buổi phỏng vấn thử 45 phút có bấm giờ và đã chấm.</li>
<li>Tôi có bốn mẫu email bằng hai ngôn ngữ.</li>
<li>Tôi giải thích được gross khác net thế nào và 10,5% là gì.</li>
<li>Tôi so sánh được hai offer bằng trọng số và giải thích lựa chọn.</li>
<li>Tôi kể được ít nhất bốn dấu hiệu của một offer giả.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('In the mock scenario, users get 502 errors right after a deploy and the cause is not obvious after a few minutes. What is the most mature next step?|||Trong tình huống thử, người dùng gặp 502 ngay sau deploy và vài phút vẫn chưa thấy nguyên nhân. Bước tiếp theo trưởng thành nhất là gì?', [
        'Keep reading logs until you find the root cause, however long it takes|||Đọc log tiếp tới khi tìm ra nguyên nhân gốc, mất bao lâu cũng được',
        'Roll back to the previous image to restore service, then investigate|||Quay lui về image trước để khôi phục dịch vụ, rồi mới điều tra',
        'Restart the whole server|||Khởi động lại cả máy chủ',
        'Post on social media that the site is under maintenance and wait|||Đăng mạng xã hội báo đang bảo trì rồi chờ',
      ], 1, 'EN: Restoring service first limits the damage; investigation continues on the bad image afterwards. Reading logs is right, but "however long it takes" leaves users broken. Restarting the server rarely fixes a bad image.|||VI: Khôi phục dịch vụ trước giới hạn thiệt hại; việc điều tra tiếp tục trên image hỏng sau đó. Đọc log là đúng, nhưng "bao lâu cũng được" để người dùng chịu lỗi. Khởi động lại máy hiếm khi chữa được một image hỏng.'),
      cau('Your mock partner keeps nodding and saying "you mean X, right?". What should you change?|||Người cùng tập cứ gật đầu và nói "ý em là X đúng không?". Bạn nên thay đổi gì?', [
        'Nothing — a supportive interviewer reduces stress|||Không gì cả — người phỏng vấn dễ chịu làm giảm căng thẳng',
        'Ask them to be stricter only on technical questions|||Nhờ họ khắt khe hơn chỉ ở câu kỹ thuật',
        'Switch to answering in writing|||Chuyển sang trả lời bằng chữ',
        'Ask them to stay neutral, keep strict time and only take notes; kindness goes into feedback afterwards|||Nhờ họ giữ trung lập, giữ giờ nghiêm và chỉ ghi chép; sự tử tế để vào phần góp ý sau',
      ], 3, 'EN: Hints and nods produce a pleasant mock with no information about how you perform alone. Real interviewers will not finish your sentences.|||VI: Gợi ý và gật đầu tạo ra một buổi thử dễ chịu mà không cho thông tin gì về việc bạn tự làm được ra sao. Người phỏng vấn thật sẽ không nói hộ bạn.'),
      cau('The company promised an answer "by Friday". It is now Wednesday of the following week. What do you do?|||Công ty hẹn trả lời "trước thứ Sáu". Giờ đã là thứ Tư tuần sau. Bạn làm gì?', [
        'Send one short, polite follow-up email|||Gửi một email hỏi tiếp ngắn, lịch sự',
        'Call them every day until they answer|||Gọi họ mỗi ngày tới khi họ trả lời',
        'Assume rejection and say nothing|||Coi như bị loại và không nói gì',
        'Post a public review saying they ignore candidates|||Đăng đánh giá công khai nói họ bỏ rơi ứng viên',
      ], 0, 'EN: Two or three working days after the promised date, one polite follow-up is professional. Daily calls read as pressure; silence wastes a possible yes.|||VI: Hai ba ngày làm việc sau ngày hẹn, một email hỏi tiếp lịch sự là chuyên nghiệp. Gọi mỗi ngày là gây áp lực; im lặng thì phí một cơ hội có thể là "có".'),
      cau('An email says "Your offer letter is attached" with offer.zip, from hr@fptsoftvvare-careers.com. What is the safest action?|||Một email báo "Thư mời nhận việc đính kèm" kèm offer.zip, gửi từ hr@fptsoftvvare-careers.com. Hành động an toàn nhất là gì?', [
        'Open it in a browser instead of downloading|||Mở bằng trình duyệt thay vì tải về',
        'Open it — antivirus will catch anything bad|||Mở ra — phần mềm diệt virus sẽ bắt hết',
        'Do not open it; check the domain against the official one and contact the recruiter through the address or number you already know|||Không mở; đối chiếu tên miền với tên miền chính thức và liên hệ người tuyển dụng qua địa chỉ hoặc số bạn đã biết',
        'Forward it to friends to ask if it is real|||Chuyển cho bạn bè hỏi xem có thật không',
      ], 2, 'EN: "vv" imitating "w" is a classic lookalike domain, and an unexpected compressed attachment is a common malware carrier. Antivirus is not a guarantee; forwarding spreads the risk.|||VI: "vv" giả chữ "w" là kiểu tên miền na ná kinh điển, và tệp nén bất ngờ là vật mang mã độc phổ biến. Diệt virus không phải bảo đảm; chuyển tiếp thì lan rủi ro sang người khác.'),
      cau('A fresher offer says gross 12 million VND, insurance paid on the full gross, no dependants. Using 2026 rules, which statement is right?|||Một offer fresher ghi gross 12 triệu, đóng bảo hiểm trên toàn bộ gross, không có người phụ thuộc. Theo quy định 2026, phát biểu nào đúng?', [
        'Net is 12 million because interns pay nothing|||Net là 12 triệu vì không phải đóng gì',
        'Net is 10.8 million because tax is 10%|||Net là 10,8 triệu vì thuế là 10%',
        'Income tax is about 1.2 million per month|||Thuế thu nhập khoảng 1,2 triệu mỗi tháng',
        'Employee insurance is 10.5% (1.26 million); income after insurance is below the 15.5 million deduction, so income tax is 0 and net is about 10.74 million|||Bảo hiểm người lao động 10,5% (1,26 triệu); thu nhập sau bảo hiểm thấp hơn mức giảm trừ 15,5 triệu nên thuế bằng 0 và net khoảng 10,74 triệu',
      ], 3, 'EN: 8% + 1.5% + 1% = 10.5% insurance; the 2026 personal deduction (15.5 million) exceeds the remaining 10.74 million, so no income tax. The "10% tax" option confuses tax with insurance.|||VI: 8% + 1,5% + 1% = 10,5% bảo hiểm; mức giảm trừ bản thân 2026 (15,5 triệu) lớn hơn 10,74 triệu còn lại, nên không có thuế thu nhập. Phương án "thuế 10%" nhầm thuế với bảo hiểm.'),
      cau('A fresher contract proposes a 90-day probation at 70% of the salary for a developer role. What does the Labour Code 2019 say?|||Một hợp đồng fresher đề xuất thử việc 90 ngày với 70% lương cho vị trí lập trình viên. Bộ luật Lao động 2019 nói gì?', [
        'Both are within the law|||Cả hai đều đúng luật',
        'For jobs requiring a college degree or higher, probation is at most 60 days, and pay must be at least 85%|||Với việc cần trình độ cao đẳng trở lên, thử việc tối đa 60 ngày, và lương ít nhất 85%',
        'Probation can be any length if both sides sign|||Thử việc dài bao nhiêu cũng được nếu hai bên ký',
        'Only the pay is wrong; 90 days is allowed|||Chỉ sai phần lương; 90 ngày là được phép',
      ], 1, 'EN: Article 25 caps probation at 60 days for degree-level work (180 days is only for enterprise managers); Article 26 sets the 85% floor. Agreement between the parties cannot go beyond the legal limits.|||VI: Điều 25 giới hạn thử việc 60 ngày với việc cần trình độ cao đẳng trở lên (180 ngày chỉ dành cho người quản lý doanh nghiệp); Điều 26 đặt sàn 85%. Thoả thuận hai bên không được vượt giới hạn luật.'),
      cau('For an OJT intern choosing between two acceptable offers, which criterion should weigh most?|||Với thực tập sinh OJT chọn giữa hai offer đều chấp nhận được, tiêu chí nào nên nặng ký nhất?', [
        'Accepted by the school and covering the OJT period, then what you will learn|||Được trường chấp nhận và phủ kỳ OJT, sau đó là học được gì',
        'The allowance|||Mức trợ cấp',
        'The office location in the city centre|||Văn phòng ở trung tâm thành phố',
        'The company’s number of followers on social media|||Số người theo dõi công ty trên mạng xã hội',
      ], 0, 'EN: If the school does not accept the placement or the dates do not cover the semester, the internship may not count — the most expensive outcome. After that, learning real work matters more than money for a first internship.|||VI: Nếu trường không chấp nhận nơi thực tập hoặc thời gian không phủ kỳ, kỳ thực tập có thể không được tính — kết quả đắt nhất. Sau đó, học được việc thật quan trọng hơn tiền với kỳ thực tập đầu tiên.'),
      cau('Your preferred company A has not answered, and company B gave you an offer with a three-day deadline. What do you tell A?|||Công ty A bạn thích hơn chưa trả lời, còn công ty B vừa gửi offer với hạn ba ngày. Bạn nói gì với A?', [
        'That you have three offers, to create urgency|||Rằng bạn có ba offer, để tạo sức ép',
        'Nothing; accept B immediately|||Không nói gì; nhận B ngay',
        'Honestly, that you have another offer with a deadline on a given date, that A is your first choice, and ask whether an update is possible before then|||Thật lòng rằng bạn có offer khác hạn vào một ngày cụ thể, A là lựa chọn số một, và hỏi có thể có kết quả trước ngày đó không',
        'Ask A to match B’s allowance before they have even made an offer|||Đòi A trả bằng B trước cả khi A đưa offer',
      ], 2, 'EN: An honest deadline note is normal and often speeds things up. Inventing offers is dishonest and easy to discover. Accepting B silently may lose the place you wanted most.|||VI: Nói thật về hạn là bình thường và nhiều khi làm mọi việc nhanh hơn. Bịa offer là thiếu trung thực và dễ bị lộ. Lặng lẽ nhận B có thể làm mất đúng nơi bạn thích nhất.'),
      cau('It is the evening before an online interview. Which action belongs to the evening, not the morning?|||Đây là tối trước buổi phỏng vấn online. Việc nào thuộc về tối hôm trước, không phải buổi sáng?', [
        'Learning a new framework the posting mentions|||Học một framework mới mà tin tuyển dụng nhắc tới',
        'Restarting the computer and closing everything except the meeting|||Khởi động lại máy và đóng mọi thứ trừ phòng họp',
        'Joining the room two minutes early|||Vào phòng sớm hai phút',
        'Testing the exact meeting link, camera, microphone and hotspot|||Thử đúng link phòng họp, camera, micro và hotspot',
      ], 3, 'EN: Testing the link the evening before leaves time to fix updates and permissions. Restarting and joining early belong to the last 30 minutes; learning a new framework the night before is cramming, not preparing.|||VI: Thử link từ tối hôm trước để còn thời gian sửa chuyện cập nhật, cấp quyền. Khởi động lại máy và vào sớm thuộc về 30 phút cuối; học framework mới vào đêm trước là nhồi, không phải chuẩn bị.'),
      cau('Offer B asks for a 500,000 VND equipment deposit before the start date and comes from a personal Gmail. What is the right reading?|||Offer B đòi 500.000 đ tiền cọc thiết bị trước ngày bắt đầu và gửi từ Gmail cá nhân. Cách hiểu đúng là gì?', [
        'Normal for small companies; pay it to secure the place|||Bình thường với công ty nhỏ; trả để giữ chỗ',
        'A scam sign — real employers do not charge you to start; refuse or verify through the company’s official number|||Dấu hiệu lừa đảo — nhà tuyển dụng thật không thu tiền để bạn bắt đầu; từ chối hoặc xác minh qua số chính thức của công ty',
        'Fine if they promise to return it later|||Được nếu họ hứa trả lại sau',
        'Pay half and ask for a receipt|||Trả một nửa và xin biên nhận',
      ], 1, 'EN: A deposit request plus a personal address are two classic scam signs together. "They promise to return it" is exactly what scammers say; a receipt from a fake company protects nothing.|||VI: Đòi tiền cọc cộng với địa chỉ cá nhân là hai dấu hiệu lừa đảo kinh điển cùng lúc. "Họ hứa trả lại" chính là câu kẻ lừa hay nói; biên nhận của một công ty giả chẳng bảo vệ được gì.'),
    ],
  },
};

export default {
  title: 'Chapter 9 — Mock interviews and the offer|||Chương 9 — Phỏng vấn thử và offer',
  description: 'Luyện, rút kinh nghiệm, và chọn offer: kịch bản phỏng vấn thử 45 phút có phiếu chấm, bốn email sau phỏng vấn (VI/EN), đọc offer với gross/net, bảo hiểm 10,5%, giảm trừ gia cảnh 2026 và luật thử việc, checklist ngày phỏng vấn, và lab chọn giữa hai offer có một offer giả.',
  lessons: [L91, L92, L93, L94, L95, Q96],
};
