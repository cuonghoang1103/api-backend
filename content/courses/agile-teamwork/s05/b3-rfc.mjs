/**
 * 5.3 — Tài liệu thiết kế và RFC (agl-5-3-rfc). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch5/{ma-tran,an-danh,kiem-rfc}.mjs + rfc/RFC-001-v1/v2, RFC-002-de (Node 22.22.2) — qua ./_ma.mjs.
 * Nguồn (đọc 24/11): RFC 1 "Host Software", Steve Crocker, UCLA, 7 April 1969 (rfc-editor.org); Malte Ubl, "Design Docs at Google"
 * (industrialempathy.com — "relatively informal documents", "emphasis on the trade-offs", non-goals "aren’t negated goals");
 * The Verge 02/05/2023 (theo Bloomberg): Samsung cấm công cụ AI tạo sinh sau khi nhân viên "leaked internal source code by uploading it to ChatGPT".
 * Ranh giới: từ MUST/SHOULD (RFC 2119) ⇒ tak 1.3; không đưa dữ liệu khách vào AI công cộng ⇒ 10.3; BD/DD ⇒ 9.3.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const mt = (a, b) => { const s = RA.maTran; const i = s.indexOf(a); return s.slice(i, b ? s.indexOf(b, i) : undefined).trim(); };
const rfc = (n) => RA.kiemRfc.split(/\n(?=\$ node kiem-rfc)/)[n];

export const L53 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 5 · Lesson 5.3', 'Chương 5 · Bài 5.3', `
<h2>${t('5.3 — Design docs and RFCs', '5.3 — Tài liệu thiết kế và RFC')}</h2>
<p class="lead">${t(
    'An ADR records a decision after it is made. A design doc — many teams call it an RFC — is where the decision gets made: two or three pages written <em>before</em> the code, so the team and the supervisor can shoot holes in the idea while changing it costs an hour instead of a week. This lesson writes one for the feature that gives LabFlow AI its name, and does what most student proposals skip: compare real options, measure, and check what personal data leaves the system.',
    'ADR ghi một quyết định sau khi đã quyết. Tài liệu thiết kế — nhiều đội gọi là RFC — là nơi quyết định được đưa ra: hai ba trang viết <em>trước</em> khi code, để nhóm và giảng viên bắn thủng ý tưởng lúc sửa chỉ tốn một giờ thay vì một tuần. Bài này viết một RFC cho chính tính năng đặt tên cho LabFlow AI, và làm điều đa số đề xuất của sinh viên bỏ qua: so các phương án thật, đo, và soát dữ liệu cá nhân nào rời khỏi hệ thống.')}</p>
${note(t('Requirement words (MUST/SHOULD/MAY from RFC 2119) and ambiguous specs in English: ', 'Từ của yêu cầu (MUST/SHOULD/MAY theo RFC 2119) và spec mơ hồ bằng tiếng Anh: ') + cs('tieng-anh-ky-thuat-di-lam', 'tak-1-3-spec', t('Technical English 1.3', 'Tiếng Anh kỹ thuật 1.3')) + t('. Never putting client data into public AI tools: ', '. Không đưa dữ liệu khách vào công cụ AI công cộng: ') + ag('agl-10-3-du-lieu-khach', t('lesson 10.3', 'bài 10.3')) + t('. Design documents on Japanese projects (BD/DD in Excel): ', '. Tài liệu thiết kế ở dự án Nhật (BD/DD dạng Excel): ') + ag('agl-9-3-tai-lieu-bd-dd', t('lesson 9.3', 'bài 9.3')) + '.')}

<h3>${t('Where "RFC" comes from', '"RFC" từ đâu ra')}</h3>
<p>${t(
    'On 7 April 1969 Steve Crocker, a UCLA graduate student, wrote notes on how computers on the new ARPANET should talk and called them ', 'Ngày 7/4/1969, Steve Crocker — nghiên cứu sinh ở UCLA — viết ghi chú về cách các máy trên mạng ARPANET mới nói chuyện với nhau và đặt tên là ')}${ng('https://www.rfc-editor.org/rfc/rfc1.html', 'RFC 1 — "Host Software"')}${t(
    ': a "Request for Comments", a deliberately humble name that invited anyone to argue. The IETF still publishes internet standards as RFCs. Companies borrowed the name for internal proposals. Google calls them design docs — ', ': "Request for Comments", cái tên cố ý khiêm tốn để mời mọi người tranh luận. IETF tới nay vẫn công bố chuẩn Internet dưới dạng RFC. Các công ty mượn tên đó cho đề xuất nội bộ. Google gọi là design doc — ')}${ng('https://www.industrialempathy.com/posts/design-docs-at-google/', 'Malte Ubl, "Design Docs at Google"')}${t(
    ' describes them as "relatively informal documents" with "emphasis on the trade-offs that were considered", and a section on non-goals: things that "could reasonably be goals" but are explicitly chosen not to be — not negations like "the system shouldn’t crash".',
    ' mô tả chúng là "tài liệu khá không chính thức" với "trọng tâm là các đánh đổi đã cân nhắc", và có mục non-goals (không làm): những thứ "hoàn toàn có thể là mục tiêu" nhưng được chủ động chọn không làm — không phải câu phủ định kiểu "hệ thống không được sập".')}</p>

<h3>${t('Everyday picture: planning the class trip', 'Liên tưởng đời thường: lên kế hoạch đi chơi cả lớp')}</h3>
<p>${t(
    '"Let’s go to Đà Lạt, I booked the bus" starts a fight. "Three options — Đà Lạt, Vũng Tàu, a day trip near school; budget, travel time and who can come for each; we are NOT doing an overnight trip during exams; reply by Friday, the class monitor decides Saturday" ends the discussion in a week. The second message is an RFC.',
    '"Đi Đà Lạt nhé, tớ đặt xe rồi" là bắt đầu cãi nhau. "Ba phương án — Đà Lạt, Vũng Tàu, đi trong ngày gần trường; chi phí, thời gian đi và ai đi được với từng cái; KHÔNG đi qua đêm mùa thi; góp ý trước thứ Sáu, lớp trưởng chốt thứ Bảy" thì một tuần là xong. Tin nhắn thứ hai là một RFC.')}</p>

<h3>${t('Ticket, RFC, ADR — which one?', 'Ticket, RFC, ADR — dùng cái nào?')}</h3>
${bang(['', 'Ticket', 'RFC / design doc', 'ADR'], [
    [t('Answers', 'Trả lời'), t('What to build, done when?', 'Làm gì, đúng khi nào?'), t('How, and which option, before building?', 'Làm thế nào, chọn phương án nào, trước khi làm?'), t('What was decided and why?', 'Đã quyết gì, vì sao?')],
    [t('Length', 'Độ dài'), t('A few lines + criteria', 'Vài dòng + tiêu chí'), t('2–5 pages', '2–5 trang'), t('1 page', '1 trang')],
    [t('Lifetime', 'Sống bao lâu'), t('Until done', 'Tới khi xong'), t('Until decided; then archived', 'Tới khi chốt; rồi lưu trữ'), t('As long as the code', 'Bằng tuổi mã')],
    [t('LabFlow example', 'Ví dụ LabFlow'), 'LF-60 S40', t('RFC-001: AI assistant', 'RFC-001: trợ lý AI'), t('ADR "use option B for S40"', 'ADR "dùng phương án B cho S40"')],
    [t('Write one when', 'Viết khi'), t('Always', 'Luôn luôn'), t('Several people affected, &gt; ~3 days, or real risk (data, money, security)', 'Ảnh hưởng nhiều người, &gt; ~3 ngày, hoặc có rủi ro thật (dữ liệu, tiền, an ninh)'), t('See lesson 5.2', 'Xem bài 5.2')],
  ])}

<h3>${t('The first draft the team usually gets', 'Bản nháp đầu nhóm thường nhận được')}</h3>
${out(MA.rfcV1)}
<p>${t(
    'This is a plan, not a proposal: one option, already chosen, no goal to measure against, and not a word about the fact that "the whole week’s schedule" contains every student’s ID. A small checker makes the gaps visible before anyone spends time commenting:',
    'Đây là một kế hoạch, không phải đề xuất: một phương án, đã chọn sẵn, không có mục tiêu để đo, và không một chữ về việc "lịch cả tuần" chứa mã số của mọi sinh viên. Một script soát nhỏ làm lộ các lỗ hổng trước khi ai đó tốn thời gian góp ý:')}</p>
${js(MA.kiemRfc)}
${out(rfc(0))}

<h3>${t('Comparing options honestly', 'So phương án một cách trung thực')}</h3>
<p>${t(
    'C2 writes three options: <strong>A</strong> send the question plus the week’s schedule to an LLM and let it answer; <strong>B</strong> let the LLM only turn the question into a JSON query, and the backend answers from the database; <strong>C</strong> no LLM, a search box with fixed sentence patterns. A weighted matrix is the usual tool — and the usual trap. The script below does the matrix and then the three things that make it honest:',
    'C2 viết ba phương án: <strong>A</strong> gửi câu hỏi kèm lịch cả tuần cho LLM để nó trả lời; <strong>B</strong> LLM chỉ đổi câu hỏi thành truy vấn JSON, backend trả lời từ CSDL; <strong>C</strong> không LLM, ô tìm kiếm với mẫu câu cố định. Ma trận có trọng số là công cụ quen thuộc — và là cái bẫy quen thuộc. Script dưới đây làm ma trận rồi làm thêm ba việc khiến nó trung thực:')}</p>
${js(MA.maTran)}
${out(mt('1) Chấm', '3) Độ nhạy'))}
<p>${t(
    '<strong>1. Hard constraints come before scores.</strong> "No AI" wins the matrix — and is not allowed, because the project is literally "LabFlow AI". A constraint is a filter, not a weight; mixing the two lets a forbidden option look like the best one.',
    '<strong>1. Ràng buộc cứng đứng trước điểm số.</strong> "Không AI" thắng ma trận — và không được phép, vì đề tài chính là "LabFlow AI". Ràng buộc là bộ lọc, không phải trọng số; trộn hai thứ làm phương án bị cấm trông như phương án tốt nhất.')}</p>
${out(mt('3) Độ nhạy', '3b)'))}
<p>${t(
    '<strong>2. Test sensitivity.</strong> Change each weight alone from 0 to 10: B stays the winner every time. That is what you want to write in the RFC — "the choice does not depend on how we weigh any single criterion" — instead of "B scored 77".',
    '<strong>2. Thử độ nhạy.</strong> Đổi riêng từng trọng số từ 0 tới 10: B vẫn thắng mọi lần. Đó là câu nên viết vào RFC — "lựa chọn không phụ thuộc vào việc ta cân riêng tiêu chí nào" — thay vì "B được 77 điểm".')}</p>
${out(mt('3b)', '4) Đo'))}
<p>${t(
    '<strong>3. Scores need evidence.</strong> Same weights, but a fan of option A scores it by feeling ("LLMs are accurate: 5", "it is only a schedule: 3"). Now B wins by 2 points and the winner flips with small weight changes (one letter per weight value, 0 → 10). The matrix was never the problem; unmeasured scores were. So measure what you can:',
    '<strong>3. Điểm cần bằng chứng.</strong> Cùng trọng số, nhưng người thích A chấm A theo cảm tính ("LLM chính xác lắm: 5", "chỉ là lịch thôi: 3"). Giờ B chỉ thắng 2 điểm và người thắng lật với thay đổi nhỏ của trọng số (mỗi chữ cái ứng với một giá trị trọng số, 0 → 10). Ma trận chưa bao giờ là vấn đề; điểm không đo mới là vấn đề. Vậy hãy đo những gì đo được:')}</p>
${out(mt('4) Đo'))}
<p>${t(
    'One question in option A ships about 32 thousand characters containing 348 student IDs to an outside server; option B ships one sentence. That single measurement settles the "personal data" score and much of the cost score.',
    'Một câu hỏi ở phương án A gửi khoảng 32 nghìn ký tự chứa 348 MSSV ra máy chủ bên ngoài; phương án B gửi một câu. Riêng phép đo đó đã chốt điểm "dữ liệu cá nhân" và phần lớn điểm chi phí.')}</p>

<h3>${t('Even option B sends something out', 'Ngay cả phương án B cũng gửi một thứ ra ngoài')}</h3>
<p>${t(
    'B still sends the user’s question, and users type personal data into chat boxes. The RFC must say what is masked before sending — and test it:',
    'B vẫn gửi câu hỏi của người dùng, và người dùng gõ dữ liệu cá nhân vào ô chat. RFC phải nói rõ che những gì trước khi gửi — và thử nó:')}</p>
${js(MA.anDanh)}
${out(RA.anDanh)}
<p>${t(
    'Regex alone catches IDs, emails and phone numbers but lets both full names through. Adding the names from the <code>nguoi_dung</code> table catches them — and also masks "hoa" (flower) in an innocent question, because a common word is also someone’s given name. Neither layer is perfect, which is exactly the argument for B: the less data an option needs to send, the less the masking has to be right. Write both failure directions into the RFC’s risk section.',
    'Riêng regex bắt được MSSV, email, số điện thoại nhưng để lọt cả hai họ tên. Thêm danh bạ tên từ bảng <code>nguoi_dung</code> thì bắt được — và che nhầm cả "hoa" trong một câu vô hại, vì một từ thường cũng là tên của ai đó. Không lớp nào hoàn hảo, và đó chính là lý lẽ cho B: phương án càng cần gửi ít dữ liệu, việc che càng ít phải đúng tuyệt đối. Ghi cả hai chiều lỗi vào mục rủi ro của RFC.')}</p>
${cl('danger', `<p><strong>${t('Real incident: Samsung, 2023', 'Sự cố thật: Samsung, 2023')}</strong> — ${t(
    'In May 2023 Samsung banned generative AI tools such as ChatGPT on company devices and internal networks, after discovering that staff had "leaked internal source code by uploading it to ChatGPT" (', 'Tháng 5/2023 Samsung cấm các công cụ AI tạo sinh như ChatGPT trên thiết bị và mạng nội bộ công ty, sau khi phát hiện nhân viên đã "làm rò rỉ mã nguồn nội bộ khi tải lên ChatGPT" (')}${ng('https://www.theverge.com/2023/5/2/23707796/samsung-ban-chatgpt-generative-ai-bing-bard-employees-security-concerns', 'The Verge, 02/05/2023, citing Bloomberg')}${t(
    '). Nobody intended harm; each person just wanted help. A design that pipes the whole schedule into an external model is the same mistake made automatically, thousands of times a day. Student names and IDs are personal data under Vietnamese law (Decree 13/2023/ND-CP on personal data protection) — the RFC is where you prove you thought about it, and where you ask the school before building (see "Open questions" below).',
    '). Không ai có ý xấu; mỗi người chỉ muốn được giúp. Một thiết kế đổ cả lịch vào mô hình bên ngoài là đúng sai lầm đó nhưng tự động, hàng nghìn lần mỗi ngày. Họ tên và MSSV là dữ liệu cá nhân theo pháp luật Việt Nam (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân) — RFC là nơi bạn chứng minh đã nghĩ tới nó, và là nơi hỏi trường trước khi làm (xem "Câu hỏi mở" bên dưới).')}</p>`)}

<h3>${t('The version that goes out for comments', 'Bản được gửi đi xin góp ý')}</h3>
${out(MA.rfcV2)}
${out(rfc(1))}
${bang([t('Section', 'Mục'), t('Why it is there', 'Vì sao có')], [
    [t('Header: author, status, comment deadline, reviewers', 'Đầu: tác giả, trạng thái, hạn góp ý, người duyệt'), t('Without a deadline, comments never end and nothing is decided.', 'Không có hạn thì góp ý không bao giờ dừng và không gì được chốt.')],
    [t('Context and scope', 'Bối cảnh và phạm vi'), t('Facts: a survey of 23 classmates, the current 3-filter screen.', 'Sự thật: khảo sát 23 bạn, màn 3 bộ lọc hiện tại.')],
    [t('Goals / non-goals', 'Mục tiêu / không làm'), t('Measurable goals; non-goals stop scope creep ("the AI does not book for you").', 'Mục tiêu đo được; "không làm" chặn phình phạm vi ("AI không đặt lịch thay").')],
    [t('Options with trade-offs', 'Phương án kèm đánh đổi'), t('At least two real options; each has a price.', 'Ít nhất hai phương án thật; cái nào cũng có giá.')],
    [t('Personal data and security', 'Dữ liệu cá nhân và an ninh'), t('Mandatory when anything leaves the system.', 'Bắt buộc khi có thứ gì rời hệ thống.')],
    [t('Rollout and rollback', 'Triển khai và rút lui'), t('Feature flag, a pass mark on staging, automatic fallback before the demo.', 'Cờ tính năng, ngưỡng đạt ở staging, tự quay về khi hỏng trước demo.')],
    [t('Open questions with owner + date', 'Câu hỏi mở có người + hạn'), t('Unknowns turned into tasks.', 'Điều chưa biết biến thành việc cụ thể.')],
  ])}

<h3>${t('Running the comment round', 'Điều hành vòng góp ý')}</h3>
<ul>
<li>${t('Send it with the deadline in the first line; the supervisor gets it <em>before</em> the weekly meeting, not during.', 'Gửi kèm hạn ngay dòng đầu; giảng viên nhận <em>trước</em> buổi họp tuần, không phải trong buổi họp.')}</li>
<li>${t('Comments go on the document (PR on <code>docs/rfc/</code> or comments in the shared doc), labelled like review comments (lesson 4.2): <code>question:</code>, <code>issue (blocking):</code>.', 'Góp ý nằm trên tài liệu (PR vào <code>docs/rfc/</code> hoặc bình luận trên tài liệu chung), có nhãn như nhận xét review (bài 4.2): <code>question:</code>, <code>issue (blocking):</code>.')}</li>
<li>${t('At the deadline the author writes "Decision: B, because …" at the top, closes the round, and turns the decision into an ADR. Silence by the deadline counts as agreement — say so when you send it.', 'Tới hạn, tác giả ghi "Quyết định: B, vì …" lên đầu, đóng vòng góp ý, và biến quyết định thành một ADR. Im lặng tới hạn được coi là đồng ý — nói rõ điều đó khi gửi.')}</li>
<li>${t('If the team cannot agree, use the tie-breakers from lesson 4.3; the leader decides last, in writing, with the reason.', 'Nếu nhóm không thống nhất, dùng luật phân xử ở bài 4.3; trưởng nhóm quyết cuối cùng, bằng văn bản, kèm lý do.')}</li>
</ul>

${cl('warn', `<p><strong>${t('Exercise 5.3', 'Bài tập 5.3')}</strong> — ${t(
    'C4 sends RFC-002 (reminder one hour before a booking). Find what is wrong <em>before</em> running the checker — then run it and compare. The checker misses at least two problems a reviewer should raise.',
    'C4 gửi RFC-002 (nhắc trước giờ vào lab một tiếng). Tìm chỗ sai <em>trước khi</em> chạy script soát — rồi chạy và so. Script bỏ sót ít nhất hai vấn đề mà người review phải nêu.')}</p>
${out(MA.rfc002)}
${giai(t('Checker output and the human review', 'Output của script và phần review của người'), `${out(rfc(2))}
<p>${t('What a person must add:', 'Điều người đọc phải thêm:')}</p>
<ul>
<li>${t('<code>issue (blocking):</code> emails and booking times of students are personal data leaving through Gmail, yet there is no "Personal data" section — the checker only triggers on AI keywords. Who may receive what, and is the school address allowed (the open question is right, but it blocks the decision)?', '<code>issue (blocking):</code> email và giờ đặt lab của sinh viên là dữ liệu cá nhân đi qua Gmail, nhưng không có mục "Dữ liệu cá nhân" — script chỉ bật khi thấy từ khoá AI. Ai được nhận gì, và có được dùng địa chỉ của trường không (câu hỏi mở đúng, nhưng nó chặn việc chốt)?')}</li>
<li>${t('<code>issue:</code> "Choose A, B later" gives no reason. Why A over B against the goal "below 5 % no-shows"? There is no evidence either one moves that number — propose a two-week trial on half the labs.', '<code>issue:</code> "Chọn A, B làm sau" không có lý do. Vì sao A hơn B so với mục tiêu "dưới 5 % bỏ trống"? Chưa có bằng chứng cái nào làm số đó giảm — đề xuất thử hai tuần trên một nửa số lab.')}</li>
<li>${t('<code>suggestion:</code> no rollout/rollback: what happens when Gmail’s daily limit is hit on the demo day?', '<code>suggestion:</code> không có triển khai/rút lui: chuyện gì xảy ra khi chạm giới hạn thư mỗi ngày của Gmail đúng hôm demo?')}</li>
<li>${t('<code>praise:</code> the goal is measurable and the non-goal (no SMS) is a real one.', '<code>praise:</code> mục tiêu đo được và mục "không làm" (không SMS) là một non-goal thật.')}</li>
</ul>`)}`)}

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'On Japanese projects the design arrives from the client as BD/DD documents and your job is to read them and raise questions (', 'Ở dự án Nhật, thiết kế tới từ khách dưới dạng tài liệu BD/DD và việc của bạn là đọc và đặt câu hỏi (')}${ag('agl-9-3-tai-lieu-bd-dd', '9.3')}${t(
    '). On US-style projects engineers often write the design doc themselves and review it with the client’s tech lead, in English. Either way, the skills are the same as here: separate facts from opinions, show the options you rejected and why, put unknowns in a table with owners. A trainee who writes "I considered X and Y; I propose Y because …; open question for the client: …" in a short message is doing an RFC — and that is what gets noticed.',
    '). Ở dự án kiểu Mỹ, kỹ sư thường tự viết design doc và review với tech lead phía khách, bằng tiếng Anh. Cách nào thì kỹ năng cũng như ở đây: tách sự thật khỏi ý kiến, trình bày phương án đã loại và vì sao, đưa điều chưa biết vào bảng có người phụ trách. Một thực tập sinh viết trong một tin nhắn ngắn "em đã cân nhắc X và Y; em đề xuất Y vì …; câu hỏi cho khách: …" là đang làm RFC — và đó là điều được người khác để ý.')}</p>

${phongVan([
    [t('"Walk me through how you decided on a design."', '"Kể cách bạn đi tới một thiết kế."'), t('For our AI assistant I wrote a short RFC: goals and non-goals, three options with trade-offs, a weighted comparison after filtering out options that broke a hard constraint, a sensitivity check, and a measurement — option A would have sent 348 student IDs per question. The team commented for a week and we recorded the decision as an ADR.', 'Với trợ lý AI, mình viết một RFC ngắn: mục tiêu và không làm, ba phương án kèm đánh đổi, so có trọng số sau khi loại phương án phạm ràng buộc cứng, thử độ nhạy, và một phép đo — phương án A sẽ gửi 348 MSSV mỗi câu hỏi. Nhóm góp ý một tuần rồi ghi quyết định thành ADR.')],
    [t('"What is a non-goal?"', '"Non-goal là gì?"'), t('Something that could reasonably be a goal but we deliberately exclude, like "the assistant does not make bookings". It prevents scope creep and arguments later.', 'Thứ hoàn toàn có thể là mục tiêu nhưng nhóm chủ động loại, như "trợ lý không tự đặt lịch". Nó chặn phình phạm vi và tranh cãi về sau.')],
    [t('"How would you integrate an LLM with user data?"', '"Bạn tích hợp LLM với dữ liệu người dùng thế nào?"'), t('Send as little as possible: let the model translate the question into a validated structured query and answer from our own database; mask identifiers in what does go out, knowing masking leaks and over-masks; keep keys server-side; validate the model output against a schema.', 'Gửi càng ít càng tốt: để mô hình đổi câu hỏi thành truy vấn có cấu trúc đã kiểm, trả lời từ CSDL của mình; che định danh trong phần phải gửi đi, biết rằng che có thể lọt và che nhầm; giữ khoá ở máy chủ; kiểm output của mô hình bằng schema.')],
    [t('"Your team disagrees on a design. What do you do?"', '"Nhóm bất đồng về thiết kế. Bạn làm gì?"'), t('Put it in writing with options and trade-offs, set a comment deadline, measure what can be measured, and decide at the deadline with the reasons recorded — then everybody commits, including the people who preferred another option.', 'Viết ra thành phương án và đánh đổi, đặt hạn góp ý, đo những gì đo được, và chốt đúng hạn kèm lý do — rồi mọi người cùng làm theo, kể cả người từng thích phương án khác.')],
  ], en)}

${thuatNgu([
    [t('RFC / design doc', 'RFC / tài liệu thiết kế'), t('A short proposal written before building, inviting comments by a deadline.', 'Đề xuất ngắn viết trước khi làm, mời góp ý tới một hạn.')],
    ['non-goal', t('A plausible goal deliberately excluded.', 'Một mục tiêu hợp lý bị chủ động loại.')],
    [t('hard constraint', 'ràng buộc cứng'), t('A condition an option must meet to be considered at all.', 'Điều kiện phương án phải thoả mới được xét.')],
    [t('sensitivity analysis', 'phân tích độ nhạy'), t('Checking whether the decision changes when one input changes.', 'Kiểm xem quyết định có đổi khi một đầu vào đổi.')],
    [t('data minimisation', 'tối thiểu hoá dữ liệu'), t('Collect or send only the data the purpose needs.', 'Chỉ thu hoặc gửi đúng phần dữ liệu mục đích cần.')],
  ], en)}

${tomTat([
    t('Write an RFC before work that affects several people, lasts more than ~3 days, or carries data/money/security risk.', 'Viết RFC trước việc ảnh hưởng nhiều người, kéo dài hơn ~3 ngày, hoặc có rủi ro dữ liệu/tiền/an ninh.'),
    t('Header with a comment deadline; goals and non-goals; at least two options, each with its price; open questions with owner and date.', 'Đầu tài liệu có hạn góp ý; mục tiêu và không làm; ít nhất hai phương án, mỗi cái có giá; câu hỏi mở có người và hạn.'),
    t('Filter by hard constraints before scoring; test sensitivity; back scores with measurements — feelings flip the winner.', 'Lọc ràng buộc cứng trước khi chấm; thử độ nhạy; điểm phải có số đo — cảm tính làm lật người thắng.'),
    t('Anything leaving the system needs a data section: option A sent 348 student IDs per question; masking both leaks and over-masks.', 'Mọi thứ rời hệ thống cần mục dữ liệu: phương án A gửi 348 MSSV mỗi câu hỏi; việc che vừa lọt vừa che nhầm.'),
    t('End the round on the deadline, write the decision on top, record it as an ADR.', 'Đóng vòng góp ý đúng hạn, ghi quyết định lên đầu, lưu thành ADR.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-5-4-postmortem', t('5.4 — Incident postmortems', '5.4 — Báo cáo sau sự cố (postmortem)'))}.</p>
`);
};

export default {
  title: '5.3 — Design docs and RFCs|||5.3 — Tài liệu thiết kế và RFC',
  slug: 'agl-5-3-rfc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'RFC/tài liệu thiết kế từ RFC 1 (Crocker, 1969) tới design doc của Google; ticket vs RFC vs ADR; RFC-001 trợ lý AI của LabFlow từ bản nháp một dòng tới bản đủ mục, soát bằng script; ma trận phương án chạy thật: lọc ràng buộc cứng trước, thử độ nhạy, điểm cảm tính làm lật kết quả, đo phương án A gửi 348 MSSV mỗi câu hỏi; thử che dữ liệu cá nhân (lọt tên, che nhầm "hoa"); sự cố Samsung 2023; điều hành vòng góp ý; bài tập RFC-002.',
  content: L53(true) + L53(false),
};
