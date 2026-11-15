/**
 * IT Interview Prep — Chương 3: Phỏng vấn hành vi (soạn 15/11/2026).
 * Khoá chữ, khuôn Mục 0 + helper ./_pv.mjs. GIỮ slug bài khung: pv-3-1…pv-3-4; thêm pv-3-5 (lab), pv-3-6 (quiz).
 * Ví dụ từ sự cố THẬT của cuongthai.com (CLAUDE.md + docs/so-loi.md) và đồ án LabFlow AI; tình huống SWP391 ghi rõ là minh hoạ.
 * LUẬT: backtick → &#96;; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 */
import { ra, lienKet, nguon, yt, flow, stack, bang, bay, keXau, doiThuong, neu, qa, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ═══════════════════════ 3.1 — Làm nhóm và xung đột ═══════════════════════ */
const L31 = {
  title: '3.1 — Teamwork and conflict questions: disagree well, commit, and keep the relationship|||3.1 — Câu hỏi về làm nhóm và xung đột: bất đồng đúng cách, cam kết, và giữ quan hệ',
  slug: 'pv-3-1-nhom',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Người phỏng vấn đang tìm gì khi hỏi về làm nhóm, khung năm bước cho câu chuyện xung đột, ba câu chuyện mẫu (chọn kiến trúc đồ án LabFlow AI ngược lời khuyên, bạn cùng nhóm SWP391 dồn code đêm cuối, bất đồng khi review code), câu hỏi về người "ăn theo", và các câu trả lời mẫu có câu đào sâu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Teamwork and conflict: what they really want to know is whether you are safe to work with</h2>
<p class="lead">"Tell me about a disagreement with a teammate." "How do you handle someone who does not do their part?" Behind every teamwork question is one worry: if we hire this person, will meetings get harder or easier? The good news is that the answer they want is not "I have never had a conflict" — it is a calm story where you understood the other side, used facts, made or accepted a decision, and kept working together.</p>

<h3>An everyday picture: splitting the electricity bill</h3>
${doiThuong('en', 'Four students share a rented room, and the electricity bill doubles. One runs an air conditioner all night; another games on a desktop. You can shout in the group chat, or you can read the meter for a week, show the numbers, and agree on a fair rule. Most teamwork conflicts in software are the same shape: a shared resource (the codebase, the deadline, the demo), different habits, and a choice between blame and a fair rule based on facts.')}

<h3>The five-step conflict story</h3>
${flow([
  ['1 · Neutral context', 'describe the disagreement without villains', '"We disagreed about the architecture" — not "he insisted on a stupid idea".'],
  ['2 · Understand the other side', 'what they wanted and why it was reasonable', 'Shows maturity. Every serious disagreement has two reasonable sides.'],
  ['3 · Shared criteria and facts', 'what you both cared about, and evidence', 'Deadline, team size, risk, grading rules — move from opinions to criteria.'],
  ['4 · Decide and commit', 'who decided, and how you committed', 'If the decision went against you, you still committed fully ("disagree and commit").'],
  ['5 · Relationship after', 'how you work together now', 'The best endings: the process improved and you still talk.'],
])}

<h3>Story A (real) — choosing an architecture against well-meant advice</h3>
<p>For his capstone, LabFlow AI (a lab and equipment management system in Spring Boot, React and PostgreSQL), a student received advice from a graduate friend: "use microservices — teams that do micro get praised". The student was building it <strong>alone</strong> in roughly twenty weeks, while still learning React and databases. Instead of arguing, he listed the criteria that mattered: one developer, a fixed timeline, and the fact that the defence panel grades <em>what runs and can be defended</em>. He chose a <strong>modular monolith</strong>, and to respect the friend’s point — that splitting later should be possible — he wrote five rules to keep modules separable: modules talk through interfaces only, no cross-module table joins, no transaction spanning modules, events or interfaces between modules, and a separate migration folder per module. He thanked the friend, explained the reasoning, and noted that a real team with DevOps from week one could split the services later.</p>
<p>In an interview this story shows exactly what they look for: respect for the other view, decision by criteria, and a design that keeps the other option open. Be honest about status — the project is in progress — and do not claim results you do not have yet.</p>

<h3>Story B (illustrative, a typical SWP391 situation) — code arriving the night before</h3>
<p>A teammate does not push anything for two weeks, then pushes a huge change the night before a milestone, causing conflicts everywhere. A weak answer blames him. A strong answer: "I asked him privately what was blocking him — he was stuck on the setup on Windows and embarrassed to ask. I paired with him for an hour to fix the setup. Then I proposed to the team that everyone pushes small commits daily and opens a pull request reviewed by one other person. The next milestone had no last-night merge." Your part: noticing, asking privately, helping, and improving the process.</p>
${bay('en', '"I have never had a conflict."', 'Interviewers hear this as either "I avoid hard conversations" or "I do not notice problems". Disagreements about design, priorities or deadlines are normal in every team — a small, well-handled one is the best answer.')}
${keXau('en', 'a common team "shortcut" is dangerous: a teammate asks for your GitHub password or token "so I can push for you", or someone shares the database password in a public group chat. Never share credentials; use collaborator invitations and per-person access. In an interview, "I set up per-person access instead of sharing one account" is itself a good teamwork story.')}
${neu('en', 'the decision went against you and later turned out wrong? Say so calmly: "We chose X; I had argued for Y. When problems appeared, I helped fix them first, and later we revisited the decision with data." Never say "I told you so" — in the story or in real life.')}

<h3>Interview questions</h3>
${qa('en', { so: '3.1-1', q: '"Tell me about a disagreement with a teammate or a mentor."', chu: 'whether you argue with criteria and can commit to a decision.', a: '<p>Use Story A with the five steps: neutral context, the friend’s reasonable point, criteria (one developer, twenty weeks, what the panel grades), the decision plus five rules that keep the other option open, and the relationship ("I thanked him and explained").</p>', sau: ['"What would make you switch to microservices?"', '"How do you enforce those five rules in code?"'], loi: 'turning the other person into a villain, or never reaching a decision.' })}
${qa('en', { so: '3.1-2', q: '"A teammate is not doing their part. What do you do?"', chu: 'private first, help before escalation, and process improvement.', a: '<p>"First I talk to them privately — often there is a reason, like being stuck. I offer concrete help. If nothing changes, I bring it to the team with facts from the board, not accusations, and we agree on small daily commits and reviews. Only then would I involve the teacher or lead."</p>', sau: ['"And if they still do nothing?"', '"How do you split work so it is fair?"'], loi: 'going straight to the teacher, or silently doing their part and resenting it.' })}
${qa('en', { so: '3.1-3', q: '"How do you handle critical code review comments?"', chu: 'ego versus learning.', a: '<p>"I treat comments as being about the code, not me. If I agree, I fix and thank them. If I disagree, I explain my reason once, with evidence — a test, a benchmark, a link to the docs — and if we still disagree, the reviewer or lead decides and I follow."</p>', sau: ['"Give an example where you were the reviewer."'], loi: '"I accept all comments" (no judgement) or defending every line.' })}
${thucHanh('en', { phut: '30', steps: [
  'Write one conflict story from your own team projects with the five steps.',
  'In step 2, write at least two sentences describing why the other person’s view was reasonable.',
  'Write your answer to "a teammate is not doing their part" as an ordered list of actions.',
  'Say the conflict story aloud; check that no sentence blames a person.',
], dat: 'your story has all five steps, a fair description of the other side, and takes under 2.5 minutes.' })}
${thuatNgu('en', [
  ['Disagree and commit', 'Argue your view, then fully support the decision once it is made.'],
  ['Free rider', 'A team member who benefits without contributing.'],
  ['Pair programming', 'Two people working on the same code at one screen.'],
  ['Modular monolith', 'One deployable application split into well-separated modules.'],
  ['Microservices', 'An application split into separately deployed services.'],
  ['Escalate', 'Bring a problem to someone with more authority.'],
])}
${tomTat('en', [
  'Teamwork questions ask whether you make the team easier or harder to work in.',
  'Tell conflicts in five steps: neutral context, the other side, criteria, decide and commit, relationship after.',
  'Move disagreements from opinions to shared criteria and evidence.',
  'With a teammate who does not contribute: privately, help first, then process, then escalate.',
  'Never share credentials as a team shortcut.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'communication-and-in-group-working-skills', bai: 'ssg104-4-1-xung-dot', academy: true, L: 'en', title: 'Academy · SSG104 4.1 — Understanding and resolving conflict', sub: 'The theory behind this lesson’s five steps.' }),
  lienKet({ khoa: 'software-development-project', bai: 'swp391-7-1-teamwork-ethics', academy: true, L: 'en', title: 'Academy · SWP391 7.1 — Teamwork: coach and customer, contribution, integrity', sub: 'Where your best teamwork stories will come from.' }),
  yt('5h2flRFi8l8', 'Andrew LaCivita', 'Tell Me About a Time You Disagreed With Someone', 7, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Làm nhóm và xung đột: điều họ thật sự muốn biết là làm việc với bạn có yên tâm không</h2>
<p class="lead">"Kể về một lần em bất đồng với bạn cùng nhóm." "Em xử lý thế nào khi có người không làm phần của mình?" Đằng sau mọi câu hỏi về làm nhóm là một nỗi lo: tuyển người này rồi, các buổi họp sẽ dễ hơn hay khó hơn? Tin tốt là câu trả lời họ muốn không phải "em chưa từng mâu thuẫn với ai" — mà là một câu chuyện bình tĩnh, trong đó bạn hiểu góc nhìn bên kia, dùng dữ kiện, đưa ra hoặc chấp nhận một quyết định, và vẫn tiếp tục làm việc cùng nhau.</p>

<h3>Liên tưởng đời thường: chia tiền điện phòng trọ</h3>
${doiThuong('vi', 'Bốn sinh viên ở chung một phòng trọ, và hoá đơn tiền điện tăng gấp đôi. Một người bật điều hoà cả đêm; một người chơi game trên máy bàn. Bạn có thể cãi nhau trong nhóm chat, hoặc bạn ghi số công-tơ một tuần, đưa con số ra, và thống nhất một luật công bằng. Phần lớn xung đột trong nhóm phần mềm có đúng hình dạng đó: một tài nguyên chung (kho mã, hạn nộp, buổi demo), thói quen khác nhau, và lựa chọn giữa đổ lỗi với một luật công bằng dựa trên dữ kiện.')}

<h3>Câu chuyện xung đột năm bước</h3>
${flow([
  ['1 · Bối cảnh trung lập', 'tả sự bất đồng mà không có "kẻ xấu"', '"Bọn em bất đồng về kiến trúc" — không phải "bạn ấy cứ khăng khăng một ý ngớ ngẩn".'],
  ['2 · Hiểu bên kia', 'họ muốn gì và vì sao điều đó hợp lý', 'Cho thấy sự chín chắn. Mọi bất đồng nghiêm túc đều có hai phía hợp lý.'],
  ['3 · Tiêu chí chung và dữ kiện', 'cả hai cùng quan tâm điều gì, và bằng chứng', 'Hạn nộp, quy mô nhóm, rủi ro, luật chấm điểm — chuyển từ ý kiến sang tiêu chí.'],
  ['4 · Quyết định và cam kết', 'ai quyết, và bạn cam kết ra sao', 'Nếu quyết định ngược ý bạn, bạn vẫn làm hết sức ("disagree and commit" — bất đồng rồi cam kết).'],
  ['5 · Quan hệ sau đó', 'bây giờ hai bên làm việc với nhau thế nào', 'Cái kết đẹp nhất: quy trình tốt lên và hai người vẫn nói chuyện với nhau.'],
])}

<h3>Câu chuyện A (có thật) — chọn kiến trúc ngược với một lời khuyên tốt bụng</h3>
<p>Với đồ án LabFlow AI (hệ thống quản lý phòng lab và thiết bị bằng Spring Boot, React và PostgreSQL), một sinh viên nhận lời khuyên từ người bạn đã ra trường: "làm microservices đi — nhóm nào làm micro cũng được khen". Bạn sinh viên làm đồ án <strong>một mình</strong> trong khoảng hai mươi tuần, trong lúc vẫn đang học React và cơ sở dữ liệu. Thay vì tranh cãi, bạn ấy liệt kê các tiêu chí thật sự quan trọng: một người làm, thời hạn cố định, và việc hội đồng chấm <em>thứ chạy được và bảo vệ được</em>. Bạn ấy chọn <strong>modular monolith</strong> (một ứng dụng chia module tách bạch), và để tôn trọng ý của người bạn — rằng sau này phải tách ra được — bạn ấy viết năm nguyên tắc giữ module tách được: module gọi nhau chỉ qua interface, không join bảng chéo module, không giao dịch nào trùm nhiều module, giao tiếp bằng sự kiện hoặc interface, và mỗi module một thư mục migration riêng. Bạn ấy cảm ơn người bạn, giải thích lý do, và ghi chú rằng một đội thật có DevOps từ tuần đầu thì có thể tách dịch vụ về sau.</p>
<p>Trong buổi phỏng vấn, câu chuyện này cho thấy đúng điều họ tìm: tôn trọng góc nhìn khác, quyết định bằng tiêu chí, và một thiết kế vẫn để ngỏ lựa chọn kia. Hãy nói thật trạng thái — dự án đang làm — và đừng nhận những kết quả bạn chưa có.</p>

<h3>Câu chuyện B (minh hoạ, tình huống SWP391 điển hình) — code tới vào đêm cuối</h3>
<p>Một bạn cùng nhóm hai tuần không đẩy gì lên, rồi đêm trước mốc nộp đẩy một thay đổi khổng lồ, xung đột khắp nơi. Câu trả lời yếu đổ lỗi cho bạn ấy. Câu trả lời mạnh: "Em hỏi riêng bạn ấy đang vướng gì — bạn ấy kẹt cài đặt môi trường trên Windows và ngại hỏi. Em ngồi cùng bạn ấy một tiếng để sửa. Rồi em đề xuất với nhóm mỗi người đẩy commit nhỏ hằng ngày và mở pull request có một người khác review. Mốc sau không còn cảnh merge đêm cuối." Phần của bạn: nhận ra, hỏi riêng, giúp, và cải tiến quy trình.</p>
${bay('vi', '"Em chưa từng mâu thuẫn với ai."', 'Người phỏng vấn nghe câu này thành "em né mọi cuộc nói chuyện khó" hoặc "em không nhận ra vấn đề". Bất đồng về thiết kế, ưu tiên hay hạn chót là chuyện thường ở mọi đội — một bất đồng nhỏ được xử lý tốt là câu trả lời hay nhất.')}
${keXau('vi', 'một "đường tắt" phổ biến trong nhóm rất nguy hiểm: bạn cùng nhóm xin mật khẩu hay token GitHub của bạn "để tớ push hộ", hoặc ai đó dán mật khẩu cơ sở dữ liệu vào nhóm chat chung. Không bao giờ chia sẻ thông tin đăng nhập; dùng lời mời cộng tác viên và quyền truy cập riêng cho từng người. Trong buổi phỏng vấn, "em thiết lập quyền riêng cho từng người thay vì dùng chung một tài khoản" tự nó đã là một câu chuyện làm nhóm hay.')}
${neu('vi', 'quyết định đi ngược ý bạn và sau đó hoá ra sai? Nói bình tĩnh: "Nhóm chọn X; em từng đề xuất Y. Khi vấn đề xuất hiện, em giúp sửa trước đã, rồi sau đó nhóm xem lại quyết định bằng dữ liệu." Đừng bao giờ nói "em đã bảo mà" — trong câu chuyện hay ngoài đời.')}

<h3>Câu hỏi phỏng vấn</h3>
${qa('vi', { so: '3.1-1', q: '"Kể về một lần em bất đồng với bạn cùng nhóm hoặc người hướng dẫn."', chu: 'bạn có tranh luận bằng tiêu chí và cam kết được với quyết định không.', a: '<p>Dùng Câu chuyện A theo năm bước: bối cảnh trung lập, điểm hợp lý của người bạn, tiêu chí (một người, hai mươi tuần, hội đồng chấm gì), quyết định cùng năm nguyên tắc để ngỏ lựa chọn kia, và quan hệ ("em cảm ơn anh ấy và giải thích").</p>', sau: ['"Điều gì sẽ khiến em chuyển sang microservices?"', '"Em bảo đảm năm nguyên tắc đó trong code bằng cách nào?"'], loi: 'biến người kia thành kẻ xấu, hoặc câu chuyện không bao giờ đi tới quyết định.' })}
${qa('vi', { so: '3.1-2', q: '"Một bạn cùng nhóm không làm phần của mình. Em làm gì?"', chu: 'nói riêng trước, giúp trước khi báo lên, và cải tiến quy trình.', a: '<p>"Đầu tiên em nói chuyện riêng — thường có lý do, như đang bị kẹt. Em đề nghị giúp cụ thể. Nếu không thay đổi, em đưa ra nhóm bằng dữ kiện trên board, không buộc tội, và cả nhóm thống nhất commit nhỏ hằng ngày và review. Chỉ sau đó em mới nhờ tới thầy hoặc trưởng nhóm."</p>', sau: ['"Nếu bạn ấy vẫn không làm thì sao?"', '"Em chia việc thế nào cho công bằng?"'], loi: 'báo thẳng lên thầy, hoặc âm thầm làm hộ rồi ấm ức.' })}
${qa('vi', { so: '3.1-3', q: '"Em xử lý thế nào khi bị góp ý gay gắt lúc review code?"', chu: 'cái tôi so với việc học.', a: '<p>"Em coi góp ý là về đoạn code chứ không phải về em. Đồng ý thì em sửa và cảm ơn. Không đồng ý thì em giải thích lý do một lần, có bằng chứng — một test, một số đo, một đường dẫn tài liệu — và nếu vẫn chưa thống nhất thì người review hoặc trưởng nhóm quyết, em làm theo."</p>', sau: ['"Kể một lần em là người review."'], loi: '"Góp ý nào em cũng nhận" (không có óc phán đoán) hoặc bảo vệ từng dòng.' })}
${thucHanh('vi', { phut: '30', steps: [
  'Viết một câu chuyện xung đột từ dự án nhóm của bạn theo năm bước.',
  'Ở bước 2, viết ít nhất hai câu tả vì sao góc nhìn của người kia là hợp lý.',
  'Viết câu trả lời cho "bạn cùng nhóm không làm phần mình" thành một danh sách hành động có thứ tự.',
  'Kể to câu chuyện xung đột; kiểm tra không câu nào đổ lỗi cho một người.',
], dat: 'câu chuyện đủ năm bước, tả công bằng phía bên kia, và kể dưới 2,5 phút.' })}
${thuatNgu('vi', [
  ['Disagree and commit (bất đồng rồi cam kết)', 'Nói rõ quan điểm, rồi ủng hộ hết mình khi quyết định đã được đưa ra.'],
  ['Free rider (người ăn theo)', 'Thành viên hưởng lợi mà không đóng góp.'],
  ['Pair programming (lập trình cặp)', 'Hai người cùng làm một đoạn code trên một màn hình.'],
  ['Modular monolith', 'Một ứng dụng deploy một khối nhưng chia thành các module tách bạch.'],
  ['Microservices', 'Ứng dụng chia thành nhiều dịch vụ deploy riêng rẽ.'],
  ['Escalate (báo lên cấp trên)', 'Đưa vấn đề tới người có thẩm quyền hơn.'],
])}
${tomTat('vi', [
  'Câu hỏi làm nhóm hỏi xem bạn làm cho đội dễ làm việc hơn hay khó hơn.',
  'Kể xung đột năm bước: bối cảnh trung lập, phía bên kia, tiêu chí, quyết định và cam kết, quan hệ sau đó.',
  'Chuyển bất đồng từ ý kiến sang tiêu chí chung và bằng chứng.',
  'Với bạn không đóng góp: nói riêng, giúp trước, rồi quy trình, rồi mới báo lên.',
  'Không bao giờ chia sẻ thông tin đăng nhập như một đường tắt của nhóm.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'communication-and-in-group-working-skills', bai: 'ssg104-4-1-xung-dot', academy: true, title: 'Academy · SSG104 4.1 — Hiểu và giải quyết xung đột', sub: 'Lý thuyết đằng sau năm bước của bài này.' }),
  lienKet({ khoa: 'software-development-project', bai: 'swp391-7-1-teamwork-ethics', academy: true, title: 'Academy · SWP391 7.1 — Làm nhóm: coach và khách hàng, đóng góp, liêm chính', sub: 'Nơi những câu chuyện làm nhóm hay nhất của bạn sẽ ra đời.' }),
  yt('5h2flRFi8l8', 'Andrew LaCivita', 'Tell Me About a Time You Disagreed With Someone', 7),
])}
</div>
`,
};

/* ═══════════════════════ 3.2 — Áp lực, hạn chót, sai lầm ═══════════════════════ */
const L32 = {
  title: '3.2 — Pressure, deadlines and mistakes: prioritise, warn early, and do not make it worse|||3.2 — Áp lực, hạn chót và sai lầm: chọn ưu tiên, báo sớm, và đừng làm tình hình tệ thêm',
  slug: 'pv-3-2-ap-luc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Câu hỏi về hạn chót, nhiều việc cùng lúc và làm hỏng production: cách chọn ưu tiên (phải có / nên có / có thì tốt), luật "báo tin xấu sớm", cắt phạm vi chứ không cắt chất lượng, câu chuyện thật hai lần deploy đua nhau làm sập trang dẫn tới bỏ "push là deploy", và nguyên tắc dừng lại khi migration hỏng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Pressure, deadlines and mistakes: what you do when things go wrong</h2>
<p class="lead">"Tell me about a time you had a tight deadline." "What did you do when you had three things due at once?" "What happens if you break something in production?" These questions check three habits: you choose what matters, you warn people early, and — the one students forget — under pressure you do not make the situation worse with a rushed fix.</p>

<h3>An everyday picture: the kitchen at the dinner rush</h3>
${doiThuong('en', 'In a restaurant kitchen at 7 p.m., orders pile up. A good cook does not try to make everything perfect at once: drinks and starters go first, the slow dish goes in the oven early, and if a dish will be late, the waiter tells the table now — not after forty minutes. A cook who panics and rushes burns the food and slows everyone. Software under deadline is the same: order the work, tell people early, and keep calm hands.')}

<h3>Three tools for deadline questions</h3>
${stack([
  ['Prioritise — must / should / could', 'Sort the tasks: what must exist for the deadline to count, what should, what could wait. Do the musts first.'],
  ['Bad news early', 'The moment you see a deadline at risk, tell the person who depends on it — with what is done, what is not, and an option.'],
  ['Cut scope, not quality', 'Ship fewer features that work and are tested, rather than everything half-working. Agree the cut with the owner.'],
])}
<p>A good deadline story uses all three: "Two days before the milestone I saw we would not finish the report export. I told the team lead that day, proposed shipping the core booking flow fully tested and moving export to the next iteration, and he agreed. We demoed a working flow instead of a broken one."</p>

<h3>The real story — two outages that changed how a project deploys</h3>
<p>On a student-run platform, every push to the main branch used to start <strong>two</strong> automatic deployment workflows. In early July 2026 they raced each other twice. The first time the new application image went live before the database schema was updated, so the feed returned 500 errors. The second time both workflows recreated the backend container at the same moment, which left it in <code>Exited (137)</code> with orphan containers; it was recovered by starting the container by hand.</p>
${flow([
  ['Stabilise', 'bring the service back first', 'Start the stopped container; check the main routes answer again.'],
  ['Understand', 'find the class of problem, not just this instance', 'Two pipelines triggered by the same event, with no coordination — a concurrency problem.'],
  ['Decide', 'remove the cause, not the symptom', 'Deploying stopped being a side effect of pushing: deploy workflows were switched to manual-only, and deploys run from one script.'],
  ['Protect', 'add a check for the next time', 'The deploy script smoke-tests key routes and fails if any returns 404 (a sign of a stale build).'],
])}
<p>Told as STAR, the Result is not "it never broke again" (unprovable) but concrete: "a push can no longer start a deploy, so that race cannot happen again; and stale builds are caught by the smoke test before users see them".</p>

<h3>Under pressure, first do no harm</h3>
<p>The same project has a written rule for database migrations: <strong>if a migration fails on deploy, stop — do not "auto-resolve" it, do not rewrite it to force it through — report the exact error, check which statements already ran, propose a fix and wait for approval.</strong> The reason: a half-applied migration that someone "resolves" in a hurry can silently corrupt the schema in production. Interviewers love this kind of answer to "what would you do if you broke something": it shows you know that the panicked fix is often worse than the original problem.</p>
${bay('en', '"I work well under pressure — I just stay late until it is done."', 'This sounds committed but tells the interviewer you have no method: no prioritising, no warning, no help. Teams fear the person who silently works all night and ships something unreviewed at 3 a.m. Describe the method, not the hours.')}
${neu('en', 'you have three deadlines in the same week — two final exams and a CV deadline? Say exactly how you would order them: the exams first because failing a subject delays the internship itself, CV work in short daily sessions, and the full CV push right after the last exam. That is a real prioritisation answer, and it is the plan in Lesson 0.9.')}
${keXau('en', 'pressure is the attacker’s favourite tool. "Urgent — the CEO needs this file now", "your account will be locked in 10 minutes, confirm the code" — social engineering works by making you skip checks. Under any urgent request involving credentials, money or access, slow down and verify through a second channel. Saying this in an interview shows security maturity.')}

<h3>Interview questions</h3>
${qa('en', { so: '3.2-1', q: '"Tell me about a time you worked under a tight deadline."', chu: 'method: prioritise, warn early, cut scope rather than quality.', a: '<p>"Two days before a milestone I saw the export feature would not be ready. I told the lead the same day, proposed delivering the booking flow fully tested and moving export to the next iteration, and we agreed. The demo worked end to end."</p>', sau: ['"How did you decide what to cut?"', '"What would you do differently?"'], loi: 'heroics ("I stayed up three nights") with no method.' })}
${qa('en', { so: '3.2-2', q: '"What would you do if you broke production?"', chu: 'calm order: stabilise, tell, understand, prevent — and no panicked fix.', a: '<p>"First stabilise — roll back to the last working version if possible — and tell the team immediately. Then find the cause; if it involves the database, like a half-applied migration, I stop and report rather than forcing a fix. Then add a check so the same class of failure is caught before it ships."</p>', sau: ['"Who would you tell first?"', '"What if rollback is not possible?"'], loi: 'trying to fix it quietly before anyone notices.' })}
${qa('en', { so: '3.2-3', q: '"How do you handle several tasks due at once?"', chu: 'a real prioritisation rule.', a: '<p>"I list them, ask what depends on each, and sort into must, should and could. If two are both “must” with the same deadline, I ask the person who set them which comes first instead of guessing. Then I tell everyone affected what to expect."</p>', sau: ['"Example?"'], loi: '"I just work harder."' })}
${thucHanh('en', { phut: '30', steps: [
  'Write one deadline story where you used at least two of the three tools (prioritise, warn early, cut scope).',
  'Write your four-step answer to "what if you broke production?" (stabilise, tell, understand, prevent).',
  'List your real deadlines for the next three weeks and sort them into must / should / could.',
], dat: 'you have one deadline story with a concrete method, a four-step production answer, and a sorted list of your own deadlines.' })}
${thuatNgu('en', [
  ['Prioritise', 'Decide the order of work by importance and dependency.'],
  ['Scope', 'The set of features or tasks included in a delivery.'],
  ['Smoke test', 'A quick check that the most important parts respond after a deploy.'],
  ['Race condition', 'Two processes acting at the same time with an outcome that depends on their order.'],
  ['Migration', 'A versioned change to the database schema.'],
  ['Social engineering', 'Manipulating people, often with urgency, into skipping security checks.'],
])}
${tomTat('en', [
  'Deadline answers need a method: prioritise, warn early, cut scope not quality.',
  'Production incidents: stabilise, tell, understand the class of problem, prevent.',
  'Under pressure, the rushed fix is often worse than the problem — know when to stop and report.',
  'Describe methods, not hours worked.',
  'Urgency is how attackers make people skip checks; verify through a second channel.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'github-actions', bai: 'ga-9-1-push-de-deploy', L: 'en', title: 'GitHub Actions 9.1 — Push-to-deploy, and the two outages that ended it', sub: 'The technical details of this lesson’s real story.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-5-migration', L: 'en', title: 'GitHub Actions 10.5 — The migration that half-applied, and the resolve you must not run', sub: 'Why "stop and report" beats "force it through".' }),
  yt('55YF0Ff5owc', 'CareerVidz', 'Tell Me About A Time You Worked Under Pressure!', 8, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Áp lực, hạn chót và sai lầm: bạn làm gì khi mọi thứ trục trặc</h2>
<p class="lead">"Kể về một lần em làm việc với hạn chót gấp." "Em làm gì khi có ba việc cùng tới hạn?" "Nếu em làm hỏng production thì sao?" Những câu này kiểm ba thói quen: bạn chọn được điều quan trọng, bạn báo sớm cho người khác, và — thói quen sinh viên hay quên — khi bị áp lực bạn không làm tình hình tệ thêm bằng một bản sửa vội.</p>

<h3>Liên tưởng đời thường: căn bếp giờ cao điểm</h3>
${doiThuong('vi', 'Trong bếp nhà hàng lúc bảy giờ tối, đơn dồn lên. Đầu bếp giỏi không cố làm mọi món hoàn hảo cùng lúc: đồ uống và món khai vị ra trước, món nướng lâu cho vào lò sớm, và nếu một món sẽ trễ thì phục vụ báo bàn ngay bây giờ — không phải sau bốn mươi phút. Đầu bếp hoảng loạn vội vàng sẽ làm cháy đồ ăn và làm chậm cả bếp. Phần mềm dưới hạn chót cũng vậy: xếp thứ tự công việc, báo sớm, và giữ tay bình tĩnh.')}

<h3>Ba công cụ cho câu hỏi về hạn chót</h3>
${stack([
  ['Chọn ưu tiên — phải có / nên có / có thì tốt', 'Phân loại việc: thứ gì phải có thì mới tính là kịp hạn, thứ gì nên có, thứ gì để sau được. Làm phần phải có trước.'],
  ['Báo tin xấu sớm', 'Ngay khi thấy hạn có nguy cơ trễ, báo người phụ thuộc vào nó — kèm cái gì xong, cái gì chưa, và một phương án.'],
  ['Cắt phạm vi, không cắt chất lượng', 'Giao ít tính năng hơn nhưng chạy được và có test, thay vì mọi thứ chạy nửa vời. Thống nhất phần cắt với người chịu trách nhiệm.'],
])}
<p>Một câu chuyện hạn chót tốt dùng cả ba: "Hai ngày trước mốc nộp em thấy phần xuất báo cáo sẽ không kịp. Em báo trưởng nhóm ngay hôm đó, đề xuất giao trọn luồng đặt lịch đã test kỹ và dời phần xuất báo cáo sang vòng sau, và anh ấy đồng ý. Bọn em demo một luồng chạy trọn vẹn thay vì một luồng hỏng."</p>

<h3>Câu chuyện thật — hai lần sập thay đổi cách một dự án deploy</h3>
<p>Trên một nền tảng do sinh viên vận hành, mỗi lần push lên nhánh main từng khởi động <strong>hai</strong> workflow deploy tự động. Đầu tháng 7/2026 chúng đua nhau hai lần. Lần đầu ảnh ứng dụng mới lên trước khi lược đồ cơ sở dữ liệu kịp cập nhật, nên trang feed trả lỗi 500. Lần thứ hai cả hai workflow cùng lúc tạo lại container backend, để nó nằm ở trạng thái <code>Exited (137)</code> cùng các container mồ côi; phải khởi động container bằng tay mới cứu được.</p>
${flow([
  ['Ổn định', 'đưa dịch vụ sống lại trước', 'Khởi động container đã dừng; kiểm các tuyến chính trả lời trở lại.'],
  ['Hiểu', 'tìm LOẠI vấn đề, không chỉ lần này', 'Hai pipeline cùng bị kích hoạt bởi một sự kiện, không có phối hợp — một vấn đề tranh chấp đồng thời.'],
  ['Quyết', 'bỏ nguyên nhân, không vá triệu chứng', 'Deploy thôi là tác dụng phụ của push: các workflow deploy chuyển sang chỉ chạy tay, và deploy đi qua một script duy nhất.'],
  ['Bảo vệ', 'thêm một bước kiểm cho lần sau', 'Script deploy smoke-test các tuyến chính và báo hỏng nếu có tuyến trả 404 (dấu hiệu build cũ).'],
])}
<p>Kể theo STAR, phần Kết quả không phải "từ đó không bao giờ hỏng nữa" (không chứng minh được) mà cụ thể: "push không còn khởi động được deploy, nên kiểu đua đó không thể xảy ra nữa; và build cũ bị smoke-test bắt trước khi người dùng thấy".</p>

<h3>Dưới áp lực, trước hết đừng gây hại thêm</h3>
<p>Cũng dự án đó có một luật viết thành văn cho migration cơ sở dữ liệu: <strong>nếu migration hỏng lúc deploy thì dừng lại — không "tự resolve", không viết lại để ép nó chạy qua — báo đúng thông báo lỗi, kiểm xem câu lệnh nào đã chạy, đề xuất cách sửa và chờ duyệt.</strong> Lý do: một migration chạy dở mà ai đó vội "resolve" có thể âm thầm làm hỏng lược đồ trên production. Người phỏng vấn rất thích kiểu trả lời này cho câu "nếu em làm hỏng thứ gì thì sao": nó cho thấy bạn biết bản sửa trong hoảng loạn nhiều khi tệ hơn vấn đề ban đầu.</p>
${bay('vi', '"Em chịu áp lực tốt — em cứ thức tới khi xong thì thôi."', 'Nghe thì tận tuỵ nhưng cho người phỏng vấn biết bạn không có phương pháp: không chọn ưu tiên, không báo trước, không nhờ giúp. Các đội sợ người âm thầm làm cả đêm rồi đẩy lên lúc 3 giờ sáng một thứ chưa ai review. Hãy tả phương pháp, đừng tả số giờ.')}
${neu('vi', 'bạn có ba hạn trong cùng một tuần — hai môn thi cuối kỳ và hạn CV? Nói rõ bạn xếp thứ tự thế nào: thi trước vì trượt môn làm lùi chính kỳ thực tập, việc CV làm thành buổi ngắn mỗi ngày, và dồn sức hoàn thiện CV ngay sau môn thi cuối. Đó là một câu trả lời chọn ưu tiên thật, và cũng chính là kế hoạch ở bài 0.9.')}
${keXau('vi', 'áp lực là công cụ ưa thích của kẻ tấn công. "Gấp — giám đốc cần tệp này ngay", "tài khoản em sẽ bị khoá sau 10 phút, đọc mã xác nhận đi" — lừa đảo qua con người (social engineering) hoạt động bằng cách khiến bạn bỏ qua các bước kiểm. Với mọi yêu cầu gấp dính tới thông tin đăng nhập, tiền hay quyền truy cập, hãy chậm lại và xác minh qua một kênh thứ hai. Nói được điều này trong buổi phỏng vấn cho thấy bạn chín chắn về bảo mật.')}

<h3>Câu hỏi phỏng vấn</h3>
${qa('vi', { so: '3.2-1', q: '"Kể về một lần em làm việc với hạn chót gấp."', chu: 'phương pháp: chọn ưu tiên, báo sớm, cắt phạm vi chứ không cắt chất lượng.', a: '<p>"Hai ngày trước mốc nộp em thấy phần xuất báo cáo không kịp. Em báo trưởng nhóm ngay hôm đó, đề xuất giao luồng đặt lịch đã test kỹ và dời phần xuất sang vòng sau, cả nhóm đồng ý. Buổi demo chạy trọn từ đầu tới cuối."</p>', sau: ['"Em quyết định cắt cái gì bằng cách nào?"', '"Nếu làm lại em sẽ làm gì khác?"'], loi: 'kể chiến công ("em thức ba đêm") mà không có phương pháp.' })}
${qa('vi', { so: '3.2-2', q: '"Nếu em làm hỏng production thì em làm gì?"', chu: 'thứ tự bình tĩnh: ổn định, báo, hiểu, phòng — và không sửa trong hoảng loạn.', a: '<p>"Trước tiên ổn định — quay lui về bản chạy tốt gần nhất nếu được — và báo đội ngay. Rồi tìm nguyên nhân; nếu dính tới cơ sở dữ liệu, như một migration chạy dở, em dừng lại và báo thay vì ép sửa. Sau đó thêm một bước kiểm để cùng loại lỗi bị bắt trước khi lên."</p>', sau: ['"Em báo ai đầu tiên?"', '"Nếu không quay lui được thì sao?"'], loi: 'lặng lẽ sửa trước khi có ai phát hiện.' })}
${qa('vi', { so: '3.2-3', q: '"Em xử lý thế nào khi nhiều việc cùng tới hạn?"', chu: 'một quy tắc chọn ưu tiên thật.', a: '<p>"Em liệt kê ra, hỏi việc nào có người khác phụ thuộc, rồi chia thành phải có, nên có, có thì tốt. Nếu hai việc đều là phải có và cùng hạn, em hỏi người giao xem việc nào trước thay vì tự đoán. Rồi em báo mọi người liên quan biết nên chờ đợi gì."</p>', sau: ['"Cho ví dụ?"'], loi: '"Em cứ cố gắng hơn thôi."' })}
${thucHanh('vi', { phut: '30', steps: [
  'Viết một câu chuyện hạn chót trong đó bạn dùng ít nhất hai trong ba công cụ (chọn ưu tiên, báo sớm, cắt phạm vi).',
  'Viết câu trả lời bốn bước cho "nếu em làm hỏng production" (ổn định, báo, hiểu, phòng).',
  'Liệt kê các hạn thật của bạn trong ba tuần tới và chia thành phải có / nên có / có thì tốt.',
], dat: 'bạn có một câu chuyện hạn chót có phương pháp cụ thể, một câu trả lời production bốn bước, và danh sách hạn của chính mình đã phân loại.' })}
${thuatNgu('vi', [
  ['Prioritise (chọn ưu tiên)', 'Quyết thứ tự công việc theo mức quan trọng và sự phụ thuộc.'],
  ['Scope (phạm vi)', 'Tập tính năng hay đầu việc nằm trong một lần giao.'],
  ['Smoke test (kiểm khói)', 'Kiểm nhanh các phần quan trọng nhất còn trả lời sau khi deploy.'],
  ['Race condition (tranh chấp đồng thời)', 'Hai tiến trình cùng hành động một lúc và kết quả phụ thuộc thứ tự của chúng.'],
  ['Migration', 'Một thay đổi lược đồ cơ sở dữ liệu có đánh phiên bản.'],
  ['Social engineering (lừa đảo qua con người)', 'Thao túng con người, thường bằng sự gấp gáp, để họ bỏ qua bước kiểm bảo mật.'],
])}
${tomTat('vi', [
  'Câu trả lời về hạn chót cần phương pháp: chọn ưu tiên, báo sớm, cắt phạm vi chứ không cắt chất lượng.',
  'Sự cố production: ổn định, báo, hiểu loại vấn đề, phòng.',
  'Dưới áp lực, bản sửa vội nhiều khi tệ hơn vấn đề — biết lúc nào phải dừng và báo.',
  'Tả phương pháp, đừng tả số giờ làm.',
  'Sự gấp gáp là cách kẻ tấn công khiến người ta bỏ qua bước kiểm; xác minh qua kênh thứ hai.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'github-actions', bai: 'ga-9-1-push-de-deploy', title: 'GitHub Actions 9.1 — Push là deploy, và hai lần sập đã chấm dứt nó', sub: 'Chi tiết kỹ thuật của câu chuyện thật trong bài.' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-10-5-migration', title: 'GitHub Actions 10.5 — Migration chạy dở, và lệnh resolve bạn không được chạy', sub: 'Vì sao "dừng và báo" thắng "ép cho qua".' }),
  yt('55YF0Ff5owc', 'CareerVidz', 'Tell Me About A Time You Worked Under Pressure!', 8),
])}
</div>
`,
};

/* ═══════════════════════ 3.3 — Học hỏi và dùng AI ═══════════════════════ */
const SO_LOI = `
### 18/08/2026 - Deploy - backend restarts forever after swapping the image
- Symptom: API 502; backend container restarting in a loop.
- Cause: build step used the default Dockerfile (Alpine, musl) instead of the
  compose one; the Prisma engine inside expects glibc.
- Fix: put the previous image back; build with -f <the right file>; add a
  libc <-> engine check before pushing.
- Impact: about 7 minutes of 502.
- Lesson: a green build does not mean the image runs - test what you ship.
`;

const L33 = {
  title: '3.3 — Learning and growth: how you learn new technology, and how you use AI honestly|||3.3 — Học hỏi và phát triển: em học công nghệ mới thế nào, và dùng AI một cách trung thực',
  slug: 'pv-3-3-hoc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Câu hỏi "em học cái mới thế nào", "gần đây em học được gì", và câu hỏi ngày càng hay gặp "em dùng AI ra sao": một phương pháp học có bằng chứng (sổ lỗi năm dòng), cách kể trung thực một dự án làm cùng trợ lý AI và một dự án tự code tay, cách kiểm chứng câu trả lời của AI bằng dữ liệu, và luật không dán mã công ty vào công cụ AI.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Learning and growth — and the question every interview now asks: how do you use AI?</h2>
<p class="lead">For an intern, the ability to learn is the main thing a company buys. So you will hear: "How do you learn a new technology?", "What have you learnt recently?", and, more and more, "Do you use AI tools? How?" This lesson gives you a learning method you can prove, and a way to talk about AI that is honest, specific and actually reassuring to the interviewer.</p>

<h3>An everyday picture: learning to drive</h3>
${doiThuong('en', 'Nobody learns to drive from a book alone, and nobody should learn only by driving alone at night. You read the rules, drive with an instructor, make small mistakes in a safe place, and remember each mistake ("I stalled on the hill — clutch slower"). A GPS helps you find the way, but you still need to know how to drive when it is wrong. Learning technology works the same way, and AI is the GPS: very useful, sometimes confidently wrong.')}

<h3>A learning method you can show</h3>
${flow([
  ['1 · Goal from a real need', 'learn because something must work', '"My server’s disk filled up — I need to understand Docker storage", not "I want to learn Docker someday".'],
  ['2 · Official docs + one good course', 'build the model before copying commands', 'Read how it works, then the tutorial. Lessons on this site are written that way.'],
  ['3 · Build something small that runs', 'make the knowledge yours', 'A tiny project, a script, a fix on your own system.'],
  ['4 · Write down every mistake', 'a five-line incident log', 'Symptom · cause · fix · impact · lesson. Rereading it is how lessons stick.'],
  ['5 · Teach or explain it', 'the final check', 'If you can explain it to a classmate without notes, you know it.'],
])}
<p>Step 4 is the one that impresses interviewers, because it is <strong>evidence</strong>. A real project keeps such a log — every bug fixed gets five lines. Here is one entry, translated:</p>
${ra(SO_LOI)}
<p>"Can I show you my bug log?" is one of the strongest answers to "How do you learn?" — almost no student has one.</p>

<h3>Talking about AI honestly</h3>
<p>Interviewers are not worried that you use AI. They are worried about three things: that you <strong>cannot work without it</strong>, that you <strong>cannot tell when it is wrong</strong>, and that you will <strong>paste company code or secrets into a public tool</strong>. A good answer addresses all three with specifics.</p>
${bang(['Worry', 'What to say (if true)', 'Evidence'], [
  ['"Can you code without it?"', '"My capstone I code by hand — my mentors are not allowed to edit my code; they only explain."', 'The capstone repository; explain any function live.'],
  ['"Can you tell when it is wrong?"', '"On my platform the assistant writes much of the code; my job is reviewing, testing and running it. I verify with real data, not with its reasoning."', 'An example where you caught it (below).'],
  ['"Will you leak our code?"', '"I follow the company policy; I never paste secrets or private code into tools that are not approved."', 'Knowing why (below).'],
])}
<p><strong>An example of catching AI being wrong (real).</strong> On the platform, an AI assistant concluded from reading the code that two kinds of pages — blog posts and tech-trend articles — could never share the same address slug: two tables, two endpoints, no shared writes. The reasoning was correct for the code. But production answered both addresses: an earlier data migration had copied posts into the new table without deleting the old ones, so the <em>data</em> had duplicates. One request would have shown it. The lesson the project wrote down: <strong>code tells you what is possible; data tells you what is true.</strong> That is a perfect two-minute story for "How do you verify AI output?"</p>
${bay('en', 'pretending you do not use AI at all, or presenting AI-written code as hand-written.', 'Both collapse quickly. If you claim no AI, a single question about your project’s scale raises doubt; if you claim you wrote everything, "change this function now" exposes it. State clearly what the tool produced and what you did — reviewing, testing, deciding, debugging. That is the skill companies actually need now.')}
${keXau('en', 'pasting private code or keys into a public AI tool can leak them outside the company. In 2023, according to Bloomberg, Samsung restricted generative-AI tools for staff after employees uploaded sensitive internal code to a chatbot. Never paste secrets (API keys, passwords, .env files) into any AI tool, and follow your company’s approved-tools policy — say this in the interview, it is a strong signal.')}
${neu('en', 'the company forbids AI tools entirely during the internship? Then your hand-coded capstone is your proof that you can still deliver: "I can work fully without it — LabFlow is coded by hand — and I will follow your policy."')}

<h3>Interview questions</h3>
${qa('en', { so: '3.3-1', q: '"How do you learn a new technology?"', chu: 'a method with evidence, not "I watch YouTube".', a: '<p>"I start from a real need, read the official docs and one good course, build something small that runs, and write down every mistake in a five-line log. For example, I learnt Docker storage when my server’s disk filled — the log entry is here."</p>', sau: ['"What is in the log?"', '"What are you learning now?"'], loi: 'a list of websites with no result.' })}
${qa('en', { so: '3.3-2', q: '"Do you use AI tools? How?"', chu: 'honesty, verification, data safety.', a: '<p>"Yes. On my personal platform an AI assistant writes much of the code; I decide the architecture, review, test, deploy and debug. My capstone I code by hand to keep my fundamentals strong. I verify AI output against real behaviour — once it reasoned correctly from the code but the production data proved it wrong. And I never paste secrets or private code into tools that are not approved."</p>', sau: ['"Show me a bug you found in AI-generated code."', '"What would you do if AI were banned here?"'], loi: '"No, never" or "it writes everything for me".' })}
${qa('en', { so: '3.3-3', q: '"What have you learnt in the last month?"', chu: 'curiosity and depth — one thing, explained well.', a: '<p>Pick one concrete thing and explain it in three sentences — for example why a Docker bind mount of a single file follows the inode, so replacing the file with <code>mv</code> leaves the container reading the old one.</p>', sau: ['"How did you find that out?"'], loi: 'naming five topics with no depth.' })}
${thucHanh('en', { phut: '40', steps: [
  'Start your own bug log today: one file, one entry per bug, five lines each. Write two entries from past problems.',
  'Write your honest AI answer using the three worries table, with one example of catching an AI mistake (or a wrong tutorial).',
  'Prepare one thing you learnt this month that you can explain in three sentences.',
], dat: 'your bug log has two real entries, your AI answer covers all three worries with an example, and your "recently learnt" answer fits in three sentences.' })}
${thuatNgu('en', [
  ['Incident / bug log', 'A personal record of problems: symptom, cause, fix, impact, lesson.'],
  ['AI coding assistant', 'A tool that generates or edits code from instructions.'],
  ['Verification', 'Checking a claim against real behaviour or data.'],
  ['Approved tools policy', 'The company’s rules on which AI or cloud tools may receive its code.'],
  ['Hand-coded', 'Written by you without code generation.'],
  ['Hallucination', 'An AI answer that sounds confident but is wrong or invented.'],
])}
${tomTat('en', [
  'Show a learning method with evidence: real need, docs, something that runs, a bug log, explaining it.',
  'A five-line bug log is rare and very convincing.',
  'On AI, answer the three worries: can you code without it, can you tell when it is wrong, will you leak data.',
  'Say exactly what the AI produced and what you did; keep a hand-coded project as proof of fundamentals.',
  'Code shows what is possible; data shows what is true — verify AI with data.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'software-development-project', bai: 'swp391-8-2-ai-usage-log', academy: true, L: 'en', title: 'Academy · SWP391 8.2 — The AI Usage Report: a full worked log', sub: 'How your school expects AI use to be documented — the same honesty, in writing.' }),
  yt('q7i5z92G1Us', 'Anthony D. Mays', 'Here’s how I use Gen AI for interview prep (without cheating)', 10, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Học hỏi và phát triển — và câu hỏi giờ buổi phỏng vấn nào cũng có: em dùng AI thế nào?</h2>
<p class="lead">Với thực tập sinh, khả năng học là thứ chính công ty mua. Nên bạn sẽ nghe: "Em học một công nghệ mới thế nào?", "Gần đây em học được gì?", và ngày càng nhiều: "Em có dùng công cụ AI không? Dùng ra sao?" Bài này cho bạn một phương pháp học chứng minh được, và một cách nói về AI vừa trung thực, vừa cụ thể, vừa thật sự làm người phỏng vấn yên tâm.</p>

<h3>Liên tưởng đời thường: học lái xe</h3>
${doiThuong('vi', 'Không ai học lái xe chỉ bằng sách, và cũng không nên học bằng cách một mình chạy đêm. Bạn đọc luật, chạy với thầy, mắc lỗi nhỏ ở chỗ an toàn, và nhớ từng lỗi ("chết máy ở dốc — nhả côn chậm hơn"). Bản đồ định vị giúp bạn tìm đường, nhưng bạn vẫn phải biết lái khi nó chỉ sai. Học công nghệ cũng thế, và AI là cái bản đồ định vị: rất có ích, đôi khi sai một cách rất tự tin.')}

<h3>Một phương pháp học bạn chỉ ra được</h3>
${flow([
  ['1 · Mục tiêu từ nhu cầu thật', 'học vì có thứ phải chạy được', '"Đĩa máy chủ của em đầy — em cần hiểu Docker lưu dữ liệu thế nào", không phải "lúc nào đó em muốn học Docker".'],
  ['2 · Tài liệu chính thức + một khoá tốt', 'dựng mô hình trước khi chép lệnh', 'Đọc nó chạy thế nào, rồi mới làm theo hướng dẫn. Các bài trên trang này được viết theo cách đó.'],
  ['3 · Làm một thứ nhỏ chạy được', 'biến kiến thức thành của mình', 'Một dự án tí hon, một script, một bản sửa trên chính hệ thống của bạn.'],
  ['4 · Ghi lại mọi lỗi', 'một sổ lỗi năm dòng', 'Triệu chứng · nguyên nhân · cách sửa · ảnh hưởng · bài học. Đọc lại nó là cách bài học ngấm vào.'],
  ['5 · Dạy lại hoặc giải thích', 'bước kiểm cuối cùng', 'Bạn giải thích được cho một bạn cùng lớp mà không cần giấy, là bạn đã hiểu.'],
])}
<p>Bước 4 là bước gây ấn tượng với người phỏng vấn, vì nó là <strong>bằng chứng</strong>. Một dự án thật giữ đúng một cuốn sổ như thế — lỗi nào sửa xong cũng có năm dòng. Đây là một mục (bản dịch tiếng Anh, để bạn quen cách viết bằng tiếng Anh):</p>
${ra(SO_LOI)}
<p>"Em cho anh xem sổ lỗi của em được không ạ?" là một trong những câu trả lời mạnh nhất cho "Em học thế nào?" — gần như không sinh viên nào có.</p>

<h3>Nói về AI một cách trung thực</h3>
<p>Người phỏng vấn không lo việc bạn dùng AI. Họ lo ba điều: bạn <strong>không làm được gì khi thiếu nó</strong>, bạn <strong>không nhận ra khi nó sai</strong>, và bạn sẽ <strong>dán mã hay bí mật của công ty vào một công cụ công cộng</strong>. Một câu trả lời tốt giải toả cả ba bằng chi tiết cụ thể.</p>
${bang(['Nỗi lo', 'Nên nói gì (nếu đúng)', 'Bằng chứng'], [
  ['"Không có AI em có code được không?"', '"Đồ án tốt nghiệp em tự code tay — người hướng dẫn không được sửa code của em, chỉ giải thích."', 'Kho mã đồ án; giải thích bất kỳ hàm nào ngay tại chỗ.'],
  ['"Em có nhận ra khi nó sai không?"', '"Trên nền tảng của em, trợ lý viết phần lớn mã; việc của em là duyệt, test và vận hành. Em kiểm chứng bằng dữ liệu thật, không bằng lập luận của nó."', 'Một ví dụ bạn bắt được nó sai (bên dưới).'],
  ['"Em có làm lộ mã của bên anh không?"', '"Em làm theo chính sách công ty; em không bao giờ dán bí mật hay mã riêng vào công cụ chưa được duyệt."', 'Biết vì sao (bên dưới).'],
])}
<p><strong>Một ví dụ bắt được AI sai (có thật).</strong> Trên nền tảng đó, một trợ lý AI đọc mã rồi kết luận rằng hai loại trang — bài blog và bài xu hướng công nghệ — không thể nào trùng địa chỉ (slug): hai bảng riêng, hai endpoint riêng, không chỗ nào ghi chung. Lập luận đó đúng với mã. Nhưng production trả lời được CẢ HAI địa chỉ: một lần chuyển dữ liệu trước đó đã chép bài sang bảng mới mà không xoá bảng cũ, nên <em>dữ liệu</em> có bản trùng. Một lệnh gọi là thấy ngay. Bài học dự án ghi lại: <strong>mã nói về điều có thể xảy ra; dữ liệu nói về điều đang thật sự xảy ra.</strong> Đó là một câu chuyện hai phút hoàn hảo cho câu "Em kiểm chứng câu trả lời của AI thế nào?"</p>
${bay('vi', 'giả vờ hoàn toàn không dùng AI, hoặc nhận mã AI viết là mình tự viết tay.', 'Cả hai đều sụp nhanh. Nhận là không dùng AI thì chỉ một câu hỏi về quy mô dự án đã gây nghi ngờ; nhận là tự viết hết thì "sửa hàm này ngay nhé" sẽ làm lộ. Hãy nói rõ công cụ sinh ra gì và bạn làm gì — duyệt, test, quyết định, gỡ lỗi. Đó chính là kỹ năng các công ty đang cần.')}
${keXau('vi', 'dán mã riêng hay khoá bí mật vào một công cụ AI công cộng có thể làm chúng lọt ra ngoài công ty. Năm 2023, theo Bloomberg, Samsung đã hạn chế nhân viên dùng công cụ AI tạo sinh sau khi có người tải mã nội bộ nhạy cảm lên một chatbot. Không bao giờ dán bí mật (khoá API, mật khẩu, tệp .env) vào bất kỳ công cụ AI nào, và tuân theo chính sách công cụ được duyệt của công ty — nói điều này trong buổi phỏng vấn là một tín hiệu mạnh.')}
${neu('vi', 'công ty cấm hẳn công cụ AI trong kỳ thực tập? Lúc đó đồ án tự code tay là bằng chứng bạn vẫn làm được: "Em làm việc được hoàn toàn không cần nó — LabFlow em tự code tay — và em sẽ theo đúng chính sách của bên mình."')}

<h3>Câu hỏi phỏng vấn</h3>
${qa('vi', { so: '3.3-1', q: '"Em học một công nghệ mới thế nào?"', chu: 'một phương pháp có bằng chứng, không phải "em xem YouTube".', a: '<p>"Em bắt đầu từ một nhu cầu thật, đọc tài liệu chính thức và một khoá tốt, làm một thứ nhỏ chạy được, và ghi mọi lỗi vào sổ năm dòng. Ví dụ em học cách Docker lưu dữ liệu khi đĩa máy chủ đầy — mục ghi trong sổ đây ạ."</p>', sau: ['"Trong sổ ghi những gì?"', '"Hiện em đang học gì?"'], loi: 'kể một loạt trang web mà không có kết quả gì.' })}
${qa('vi', { so: '3.3-2', q: '"Em có dùng công cụ AI không? Dùng thế nào?"', chu: 'trung thực, kiểm chứng, an toàn dữ liệu.', a: '<p>"Có ạ. Trên nền tảng cá nhân, trợ lý AI viết phần lớn mã; em quyết kiến trúc, duyệt, test, deploy và gỡ lỗi. Đồ án tốt nghiệp em tự code tay để giữ nền tảng vững. Em kiểm chứng đầu ra của AI bằng hành vi thật — có lần nó lập luận đúng theo mã nhưng dữ liệu production chứng minh nó sai. Và em không bao giờ dán bí mật hay mã riêng vào công cụ chưa được duyệt."</p>', sau: ['"Cho anh xem một lỗi em tìm ra trong mã AI sinh."', '"Nếu ở đây cấm AI thì em làm sao?"'], loi: '"Em không bao giờ dùng" hoặc "nó viết hết cho em".' })}
${qa('vi', { so: '3.3-3', q: '"Tháng vừa rồi em học được gì?"', chu: 'sự tò mò và độ sâu — một điều, giải thích cho tốt.', a: '<p>Chọn một điều cụ thể và giải thích trong ba câu — ví dụ vì sao bind mount một tệp đơn của Docker đi theo inode, nên thay tệp bằng <code>mv</code> thì container vẫn đọc tệp cũ.</p>', sau: ['"Em phát hiện ra điều đó thế nào?"'], loi: 'kể tên năm chủ đề mà không sâu chủ đề nào.' })}
${thucHanh('vi', { phut: '40', steps: [
  'Bắt đầu sổ lỗi của bạn ngay hôm nay: một tệp, mỗi lỗi một mục, mỗi mục năm dòng. Viết hai mục từ những vấn đề bạn đã gặp.',
  'Viết câu trả lời trung thực về AI theo bảng ba nỗi lo, kèm một ví dụ bạn bắt được AI sai (hoặc một hướng dẫn sai).',
  'Chuẩn bị một điều bạn học được trong tháng này, giải thích được trong ba câu.',
], dat: 'sổ lỗi có hai mục thật, câu trả lời về AI giải toả đủ ba nỗi lo kèm ví dụ, và câu "gần đây em học được gì" gói trong ba câu.' })}
${thuatNgu('vi', [
  ['Incident / bug log (sổ lỗi)', 'Ghi chép cá nhân về các vấn đề: triệu chứng, nguyên nhân, cách sửa, ảnh hưởng, bài học.'],
  ['AI coding assistant (trợ lý AI viết code)', 'Công cụ sinh hoặc sửa mã theo chỉ dẫn.'],
  ['Verification (kiểm chứng)', 'Đối chiếu một khẳng định với hành vi hoặc dữ liệu thật.'],
  ['Approved tools policy (chính sách công cụ được duyệt)', 'Luật của công ty về công cụ AI hay đám mây nào được nhận mã của họ.'],
  ['Hand-coded (tự code tay)', 'Do chính bạn viết, không dùng công cụ sinh mã.'],
  ['Hallucination (ảo giác của AI)', 'Câu trả lời của AI nghe tự tin nhưng sai hoặc bịa.'],
])}
${tomTat('vi', [
  'Cho thấy một phương pháp học có bằng chứng: nhu cầu thật, tài liệu, thứ chạy được, sổ lỗi, giải thích lại.',
  'Một cuốn sổ lỗi năm dòng rất hiếm và rất thuyết phục.',
  'Về AI, giải toả ba nỗi lo: không có nó có làm được không, có nhận ra khi nó sai không, có làm lộ dữ liệu không.',
  'Nói đúng AI sinh ra gì và bạn làm gì; giữ một dự án tự code tay làm bằng chứng nền tảng.',
  'Mã cho biết điều có thể; dữ liệu cho biết điều có thật — kiểm chứng AI bằng dữ liệu.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'software-development-project', bai: 'swp391-8-2-ai-usage-log', academy: true, title: 'Academy · SWP391 8.2 — Báo cáo sử dụng AI: một nhật ký mẫu trọn vẹn', sub: 'Cách nhà trường muốn việc dùng AI được ghi lại — cùng sự trung thực ấy, bằng văn bản.' }),
  yt('q7i5z92G1Us', 'Anthony D. Mays', 'Here’s how I use Gen AI for interview prep (without cheating)', 10),
])}
</div>
`,
};

/* ═══════════════════════ 3.4 — Ngân hàng 30 câu ═══════════════════════ */
/* [nhóm, câu EN, câu VI, khung EN, khung VI, câu chuyện trong kho nên dùng (EN|||VI)] */
const NHOM = [
  ['A · You and your motivation|||A · Bản thân và động lực', [
    ['Why do you want to work here?', 'Vì sao em muốn làm ở đây?', 'One specific thing about their product or team from the posting or website, plus what you want to learn there.', 'Một điều cụ thể về sản phẩm hay đội của họ lấy từ tin tuyển dụng hoặc trang web, cộng điều bạn muốn học ở đó.', 'the Future part of your 2.1 introduction|||phần Tương lai trong lời giới thiệu 2.1'],
    ['Why software engineering / why backend?', 'Vì sao em chọn kỹ thuật phần mềm / vì sao backend?', 'A real moment that made you choose — the first time something you built was used, or the first incident you fixed — not "because IT pays well".', 'Một khoảnh khắc thật khiến bạn chọn — lần đầu thứ bạn làm có người dùng, hay sự cố đầu tiên bạn sửa — không phải "vì IT lương cao".', 'the 502 story or your first deployed project|||câu chuyện 502 hoặc dự án đầu tiên bạn deploy'],
    ['What project are you most proud of?', 'Dự án em tự hào nhất là gì?', 'One project, why it was hard, your part, one number, what it taught you. Two minutes, STAR shape.', 'Một dự án, vì sao khó, phần của bạn, một con số, nó dạy bạn điều gì. Hai phút, theo hình STAR.', 'your top story bank entry|||mục đầu kho câu chuyện'],
    ['Where do you see yourself in three years?', 'Ba năm nữa em thấy mình ở đâu?', 'A realistic direction (a solid backend engineer who owns a service), linked to what this internship gives you. No job titles you cannot explain.', 'Một hướng thực tế (kỹ sư backend vững, tự chịu trách nhiệm một dịch vụ), nối với điều kỳ thực tập này cho bạn. Không nêu chức danh bạn không giải thích được.', 'your skill matrix gaps (0.2)|||các lỗ hổng trong ma trận kỹ năng (0.2)'],
    ['What do you do outside class?', 'Ngoài giờ học em làm gì?', 'Something that shows initiative — running your own project, writing a bug log, mentoring classmates — then one personal hobby in a sentence.', 'Một điều cho thấy sự chủ động — tự vận hành dự án, ghi sổ lỗi, kèm bạn cùng lớp — rồi một sở thích cá nhân trong một câu.', 'learning story (3.3)|||câu chuyện học hỏi (3.3)'],
  ]],
  ['B · Teamwork and communication|||B · Làm nhóm và giao tiếp', [
    ['Tell me about a time you helped a teammate.', 'Kể về một lần em giúp bạn cùng nhóm.', 'What blocked them, how you noticed, what you did together, how they could work alone afterwards.', 'Bạn ấy vướng gì, bạn nhận ra thế nào, hai người làm gì cùng nhau, sau đó bạn ấy tự làm được ra sao.', 'Windows setup pairing (3.1 Story B)|||ngồi cùng sửa cài đặt Windows (3.1 câu chuyện B)'],
    ['Describe a disagreement and how it ended.', 'Kể một lần bất đồng và nó kết thúc thế nào.', 'Five steps: neutral context, the other side, criteria, decision and commitment, relationship after.', 'Năm bước: bối cảnh trung lập, phía bên kia, tiêu chí, quyết định và cam kết, quan hệ sau đó.', 'monolith vs microservices (3.1 Story A)|||monolith hay microservices (3.1 câu chuyện A)'],
    ['How do you explain a technical problem to a non-technical person?', 'Em giải thích một vấn đề kỹ thuật cho người không làm kỹ thuật thế nào?', 'Start with the effect on them, use an everyday comparison, skip the jargon, end with what they need to decide.', 'Bắt đầu từ tác động lên họ, dùng so sánh đời thường, bỏ thuật ngữ, kết bằng điều họ cần quyết.', 'explaining an outage to users|||giải thích một lần sập cho người dùng'],
    ['Tell me about feedback you received and what you did with it.', 'Kể về một góp ý em nhận được và em đã làm gì với nó.', 'The feedback, your first reaction (honest), what you changed, and the result.', 'Lời góp ý, phản ứng đầu tiên của bạn (thật lòng), bạn đã thay đổi gì, và kết quả.', 'a code review comment|||một góp ý khi review code'],
    ['How do you work with someone you do not get along with?', 'Em làm việc thế nào với người em không hợp?', 'Focus on the shared goal, agree working rules (written tasks, reviews), keep it professional; give one example.', 'Tập trung vào mục tiêu chung, thống nhất luật làm việc (việc ghi rõ, có review), giữ chuyên nghiệp; kèm một ví dụ.', 'a team-project situation|||một tình huống đồ án nhóm'],
  ]],
  ['C · Pressure, mistakes and failure|||C · Áp lực, sai lầm và thất bại', [
    ['Tell me about a time you failed.', 'Kể về một lần em thất bại.', 'Five steps: own it, impact, fix, prevent (a check, not "be careful"), what changed in you.', 'Năm bước: nhận, tác động, sửa, phòng (một bước kiểm, không phải "cẩn thận hơn"), bạn đã thay đổi gì.', 'the seed that passed every check (2.3)|||script seed qua mọi bước kiểm (2.3)'],
    ['Tell me about a mistake that affected users.', 'Kể về một sai lầm ảnh hưởng tới người dùng.', 'Honest impact size, how you restored service first, then the cause and the prevention.', 'Tác động nói đúng mức, bạn khôi phục dịch vụ trước ra sao, rồi nguyên nhân và cách phòng.', 'the 7-minute 502 (2.2)|||lần 502 bảy phút (2.2)'],
    ['Describe a time you missed a deadline.', 'Kể về một lần em trễ hạn.', 'When you saw it coming, who you told and when, what you delivered instead, what you plan differently now.', 'Bạn thấy trước lúc nào, báo ai và khi nào, bạn giao gì thay thế, giờ bạn lập kế hoạch khác ra sao.', 'a milestone with cut scope (3.2)|||một mốc nộp phải cắt phạm vi (3.2)'],
    ['How do you handle stress?', 'Em đối phó với căng thẳng thế nào?', 'A concrete method — split the work, prioritise, short breaks, ask early — and one example; not "I do not get stressed".', 'Một phương pháp cụ thể — chia nhỏ việc, chọn ưu tiên, nghỉ ngắn, hỏi sớm — kèm một ví dụ; không phải "em không bao giờ căng thẳng".', 'exam week + CV deadline (3.2)|||tuần thi + hạn CV (3.2)'],
    ['What would you do if you realised you could not finish a task?', 'Em làm gì khi nhận ra mình không làm kịp một việc?', 'Tell the owner early with what is done and options; ask for specific help; never hide it until the deadline.', 'Báo người phụ trách sớm kèm phần đã xong và các phương án; nhờ giúp cụ thể; không bao giờ giấu tới hạn chót.', 'bad news early (3.2)|||báo tin xấu sớm (3.2)'],
  ]],
  ['D · Learning and adapting|||D · Học hỏi và thích nghi', [
    ['How do you learn a new technology quickly?', 'Em học một công nghệ mới nhanh thế nào?', 'Real need → docs and one course → build something small → bug log → explain it.', 'Nhu cầu thật → tài liệu và một khoá → làm một thứ nhỏ → sổ lỗi → giải thích lại.', 'learning Docker by running a server (3.3)|||học Docker bằng cách tự vận hành máy chủ (3.3)'],
    ['Tell me about something you learnt from a mistake.', 'Kể một điều em học được từ một sai lầm.', 'The mistake in one sentence, the lesson in one sentence, and proof you apply it now.', 'Sai lầm trong một câu, bài học trong một câu, và bằng chứng bây giờ bạn đang áp dụng nó.', '"written is not in effect" (2.3)|||"đã ghi chưa chắc đã có hiệu lực" (2.3)'],
    ['Do you use AI tools? How do you verify their output?', 'Em có dùng công cụ AI không? Em kiểm chứng đầu ra thế nào?', 'What it writes, what you do, how you verify (tests, real data), and data-safety rules.', 'Nó viết gì, bạn làm gì, bạn kiểm chứng ra sao (test, dữ liệu thật), và luật an toàn dữ liệu.', 'code says possible, data says true (3.3)|||mã nói điều có thể, dữ liệu nói điều có thật (3.3)'],
    ['Tell me about a time requirements changed late.', 'Kể về một lần yêu cầu bị đổi muộn.', 'What changed, how you assessed the impact, what you negotiated (scope or date), and the result.', 'Đổi gì, bạn đánh giá tác động thế nào, bạn thương lượng gì (phạm vi hay ngày), và kết quả.', 'a teacher changing a requirement before a milestone|||thầy đổi yêu cầu trước một mốc nộp'],
    ['What is something you taught yourself?', 'Có điều gì em tự học không?', 'One skill, why you needed it, how you learnt it, what you built with it.', 'Một kỹ năng, vì sao cần, bạn tự học thế nào, bạn làm được gì với nó.', 'deploy pipeline or Docker|||quy trình deploy hoặc Docker'],
  ]],
  ['E · Ownership and initiative|||E · Trách nhiệm và chủ động', [
    ['Tell me about something you improved without being asked.', 'Kể về một thứ em tự cải tiến khi không ai yêu cầu.', 'The problem you noticed, why it mattered, the change, the measurable effect.', 'Vấn đề bạn nhận ra, vì sao nó quan trọng, thay đổi bạn làm, tác động đo được.', 'building images at home instead of on the server (3–6 min vs ~15 min)|||dựng ảnh ở máy nhà thay vì trên máy chủ (3–6 phút so với ~15 phút)'],
    ['Describe a process you made safer.', 'Kể về một quy trình em làm cho an toàn hơn.', 'The risk, the incident or near-miss that showed it, the gate you added, what it now catches.', 'Rủi ro, sự cố hay suýt-sự-cố đã lộ ra nó, chốt chặn bạn thêm, bây giờ nó bắt được gì.', 'the desktop release script: 11 version bumps in 4.5 hours, one never released|||script phát hành app desktop: 11 lần tăng phiên bản trong 4,5 giờ, một bản không bao giờ được phát hành'],
    ['Tell me about a time you went beyond your task.', 'Kể về một lần em làm vượt phần việc được giao.', 'What was assigned, what you saw was missing, why it mattered, how you checked it was welcome.', 'Việc được giao là gì, bạn thấy còn thiếu gì, vì sao nó quan trọng, bạn kiểm xem việc mình làm thêm có được hoan nghênh không ra sao.', 'adding a smoke test after a stale build|||thêm smoke test sau một lần build cũ'],
    ['How do you make sure your work is correct before you hand it in?', 'Em bảo đảm việc mình làm đúng trước khi nộp bằng cách nào?', 'Your checklist: run it, test the edge cases, read your own diff, check what each check really covers.', 'Checklist của bạn: chạy thật, test trường hợp biên, tự đọc diff của mình, kiểm xem mỗi bước kiểm thật ra bao tới đâu.', 'the seed lesson (2.3)|||bài học script seed (2.3)'],
    ['Tell me about a decision you made with incomplete information.', 'Kể về một quyết định em đưa ra khi chưa đủ thông tin.', 'What you knew, what you did not, how you limited the risk (reversible choice, a check), and how it turned out.', 'Bạn biết gì, chưa biết gì, bạn khoanh rủi ro thế nào (lựa chọn quay lại được, một bước kiểm), và kết cục.', 'restoring the previous image before knowing the cause (2.2)|||đưa ảnh cũ trở lại trước khi biết nguyên nhân (2.2)'],
  ]],
  ['F · Culture and the future|||F · Văn hoá và tương lai', [
    ['What kind of team do you work best in?', 'Em làm việc tốt nhất trong kiểu đội nào?', 'Concrete conditions — clear tasks, code review, someone to ask — and how you contribute to that culture yourself.', 'Điều kiện cụ thể — việc rõ ràng, có review code, có người để hỏi — và chính bạn góp phần tạo văn hoá đó ra sao.', 'your questions from 2.4|||các câu hỏi của bạn ở 2.4'],
    ['What would you do in your first week here?', 'Tuần đầu ở đây em sẽ làm gì?', 'Set up and run the project, read the docs and recent pull requests, ask your mentor what "done" means, ship one small fix.', 'Cài đặt và chạy dự án, đọc tài liệu và các pull request gần đây, hỏi mentor thế nào là "xong", hoàn thành một bản sửa nhỏ.', 'OJT202 4.1'],
    ['How do you handle a task you find boring?', 'Em xử lý thế nào với một việc em thấy chán?', 'Do it well, look for what you can automate or learn from it, and finish on time — one example.', 'Làm cho tốt, tìm chỗ có thể tự động hoá hoặc học được, và xong đúng hạn — kèm một ví dụ.', 'automating a manual deploy step|||tự động hoá một bước deploy làm tay'],
    ['What are your expectations for this internship?', 'Em kỳ vọng gì ở kỳ thực tập này?', 'Learning on a real product, code review, a mentor, and contributing real tasks — plus the practical ones (period, school paperwork).', 'Được học trên sản phẩm thật, được review code, có mentor, và đóng góp việc thật — cùng những điều thực tế (thời gian, giấy tờ với trường).', 'your tracker notes|||ghi chú trong bảng theo dõi'],
    ['Is there anything we have not asked that you want us to know?', 'Còn điều gì bên anh chị chưa hỏi mà em muốn bên mình biết không?', 'One strong point not yet covered, in 30 seconds — your bug log, a hand-coded project, a process you built.', 'Một điểm mạnh chưa được nhắc tới, trong 30 giây — sổ lỗi, dự án tự code tay, một quy trình bạn dựng.', 'your strongest unused story|||câu chuyện mạnh nhất chưa dùng tới'],
  ]],
];

function nganHang(L) {
  const en = L === 'en';
  let k = 0;
  return NHOM.map(([nhom, ds]) => {
    const [ten, tenVi] = nhom.split('|||');
    return `<h3>${en ? ten : tenVi}</h3>\n` + ds.map(([qEn, qVi, aEn, aVi, chuyen]) => {
      k++;
      const [cEn, cVi] = chuyen.includes('|||') ? chuyen.split('|||') : [chuyen, chuyen];
      return qa(L, {
        so: `B${k}`,
        q: `"${en ? qEn : qVi}"`,
        a: `<p><strong>${en ? 'Answer frame:' : 'Khung trả lời:'}</strong> ${en ? aEn : aVi}</p><p><strong>${en ? 'Story to use:' : 'Câu chuyện nên dùng:'}</strong> ${en ? cEn : cVi}</p>`,
      });
    }).join('\n');
  }).join('\n');
}

const L34 = {
  title: '3.4 — A bank of 30 behavioural questions, each with an answer frame and the story to use|||3.4 — Ngân hàng 30 câu hỏi hành vi, mỗi câu có khung trả lời và câu chuyện nên dùng',
  slug: 'pv-3-4-ngan-hang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba mươi câu hỏi hành vi hay gặp nhất chia sáu nhóm (động lực, làm nhóm, áp lực, học hỏi, trách nhiệm, văn hoá), mỗi câu có khung trả lời và câu chuyện trong kho nên dùng, cách luyện cả ngân hàng trong một tuần, và cách nhận ra câu hỏi "đội lốt".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>A bank of 30 behavioural questions — and why six to eight stories answer all of them</h2>
<p class="lead">Behavioural questions look endless, but they come from a small number of themes, and companies draw them from banks. This lesson is that bank: thirty of the most common questions in six groups. For each one you get an answer frame and the story from your story bank (Lesson 2.2) that fits it. The goal is not to memorise thirty answers — it is to see that your six to eight stories cover them all.</p>

<h3>An everyday picture: a wardrobe of eight pieces</h3>
${doiThuong('en', 'People who travel light pack eight pieces of clothing that combine into twenty outfits. You do not need thirty stories for thirty questions; you need six to eight strong stories that combine — the 502 incident answers "a failure", "pressure", "debugging" and "a decision without full information", depending on which part you emphasise.')}

<h3>How to use this bank</h3>
${flow([
  ['1 · Hear the theme', 'every question belongs to one of six groups', 'Motivation, teamwork, pressure and failure, learning, ownership, culture.'],
  ['2 · Pick the story', 'from your bank, the one that fits best', 'Use the "story to use" line as a starting point; replace it with your own.'],
  ['3 · Choose the angle', 'emphasise the part the question asks for', 'Failure → impact and prevention. Teamwork → the other person. Ownership → what you noticed first.'],
  ['4 · Answer in STAR, ~2 minutes', 'then stop', 'Let them ask the follow-up.'],
])}
${bay('en', 'disguised questions.', '"What would your previous teammates say about you?" is really "what are your strengths and weaknesses". "What would you do if your lead asked you to skip testing to meet a deadline?" is really "pressure and integrity". Name the real theme in your head first, then pick the story.')}
${keXau('en', 'some "interviews" are phishing for information: questions about your previous company’s internal systems, customers or security setup. Answer at the level of what you did and learnt; never share confidential details of a previous employer or school system. A real interviewer respects that — it is exactly what they would want from you with their data.')}
${neu('en', 'you get a question none of your stories fits? Say "Let me think for a moment", and use the closest story honestly ("I have not had exactly that, but the closest was…"). An honest near-match beats an invented perfect story.')}
${nganHang('en')}

${thucHanh('en', { phut: '60 (or 15 a day for a week)', steps: [
  'For each of the 30 questions, write the title of the story from your own bank you would use. Leave a blank where you have none.',
  'For every blank, either find a new story or accept the closest one and write the angle you would take.',
  'Each day, pick five questions at random (for example by rolling a number from 1 to 30) and answer aloud before opening the frame.',
], dat: 'every one of the 30 questions has a story title from your bank, and you have answered at least 15 aloud.' })}
${thuatNgu('en', [
  ['Question bank', 'The set of prepared questions a company draws from in structured interviews.'],
  ['Theme', 'The underlying quality a question tests (teamwork, ownership…).'],
  ['Angle', 'The part of a story you emphasise for a particular question.'],
  ['Disguised question', 'A question whose wording hides its real theme.'],
  ['Confidential', 'Information you are not allowed to share outside its owner.'],
])}
${tomTat('en', [
  'Thirty common questions fall into six themes.',
  'Six to eight stories, told from different angles, answer almost all of them.',
  'Find the real theme of disguised questions before you pick a story.',
  'Use an honest near-match rather than inventing a story.',
  'Never reveal confidential details of a previous company or school.',
])}
${lienQuan('en', [
  yt('T25I2FQ9Mok', 'Aced (formerly Exponent)', 'Top 10 Behavioral Software Engineering Interview Questions', 6, 'en'),
  nguon('📘', 'Tech Interview Handbook — Behavioral interview questions', 'A longer list of behavioural questions used by tech companies.', 'https://www.techinterviewhandbook.org/behavioral-interview/'),
  lienKet({ khoa: 'testing', bai: 'tst-10-4-phong-van', L: 'en', title: 'Testing 10.4 — Testing interview questions', sub: 'Many behavioural questions turn into "how do you make sure it works?" — the testing side of the answer.' }),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Ngân hàng 30 câu hỏi hành vi — và vì sao sáu tới tám câu chuyện trả lời được tất cả</h2>
<p class="lead">Câu hỏi hành vi trông như vô tận, nhưng chúng đến từ một số ít chủ đề, và công ty rút chúng từ ngân hàng câu hỏi. Bài này chính là một ngân hàng như thế: ba mươi câu hay gặp nhất chia sáu nhóm. Mỗi câu có một khung trả lời và câu chuyện trong kho (bài 2.2) hợp với nó. Mục tiêu không phải học thuộc ba mươi câu trả lời — mà là thấy sáu tới tám câu chuyện của bạn bao được hết.</p>

<h3>Liên tưởng đời thường: tủ đồ tám món</h3>
${doiThuong('vi', 'Người hay đi du lịch gọn nhẹ mang tám món đồ phối được hai mươi bộ. Bạn không cần ba mươi câu chuyện cho ba mươi câu hỏi; bạn cần sáu tới tám câu chuyện mạnh phối được với nhau — sự cố 502 trả lời được "một lần thất bại", "áp lực", "gỡ lỗi" và "quyết định khi chưa đủ thông tin", tuỳ bạn nhấn vào phần nào.')}

<h3>Dùng ngân hàng này thế nào</h3>
${flow([
  ['1 · Nghe ra chủ đề', 'câu hỏi nào cũng thuộc một trong sáu nhóm', 'Động lực, làm nhóm, áp lực và thất bại, học hỏi, trách nhiệm, văn hoá.'],
  ['2 · Chọn câu chuyện', 'trong kho của bạn, câu hợp nhất', 'Dùng dòng "câu chuyện nên dùng" làm điểm xuất phát; thay bằng chuyện của chính bạn.'],
  ['3 · Chọn góc kể', 'nhấn vào phần câu hỏi đang hỏi', 'Thất bại → tác động và cách phòng. Làm nhóm → người kia. Trách nhiệm → điều bạn nhận ra đầu tiên.'],
  ['4 · Trả lời theo STAR, ~2 phút', 'rồi dừng', 'Để họ hỏi câu đào sâu.'],
])}
${bay('vi', 'câu hỏi "đội lốt".', '"Bạn cùng nhóm cũ sẽ nói gì về em?" thật ra là "điểm mạnh và điểm yếu của em". "Nếu trưởng nhóm bảo em bỏ qua test cho kịp hạn thì em làm gì?" thật ra là "áp lực và sự chính trực". Hãy gọi tên chủ đề thật trong đầu trước, rồi mới chọn câu chuyện.')}
${keXau('vi', 'có những "buổi phỏng vấn" thật ra là moi thông tin: hỏi về hệ thống nội bộ, khách hàng hay cách bảo mật của công ty cũ của bạn. Trả lời ở mức điều bạn đã làm và đã học; không bao giờ tiết lộ chi tiết bí mật của chỗ làm hay hệ thống trường cũ. Người phỏng vấn thật tôn trọng điều đó — vì đó đúng là điều họ muốn bạn làm với dữ liệu của họ.')}
${neu('vi', 'bạn gặp một câu hỏi mà không câu chuyện nào hợp? Nói "Em xin nghĩ một chút ạ", rồi dùng câu chuyện gần nhất một cách trung thực ("Em chưa gặp đúng tình huống đó, nhưng gần nhất là…"). Một câu gần đúng mà thật thắng một câu chuyện hoàn hảo mà bịa.')}
${nganHang('vi')}

${thucHanh('vi', { phut: '60 (hoặc 15 mỗi ngày trong một tuần)', steps: [
  'Với từng câu trong 30 câu, ghi tên câu chuyện trong kho của bạn mà bạn sẽ dùng. Câu nào chưa có thì để trống.',
  'Với mỗi chỗ trống, hoặc tìm một câu chuyện mới, hoặc chấp nhận câu gần nhất và ghi góc kể bạn sẽ dùng.',
  'Mỗi ngày chọn ngẫu nhiên năm câu (ví dụ bốc một số từ 1 tới 30) và trả lời thành tiếng trước khi mở khung trả lời.',
], dat: 'cả 30 câu đều có tên một câu chuyện trong kho của bạn, và bạn đã trả lời thành tiếng ít nhất 15 câu.' })}
${thuatNgu('vi', [
  ['Question bank (ngân hàng câu hỏi)', 'Tập câu hỏi chuẩn bị sẵn công ty rút ra trong phỏng vấn có cấu trúc.'],
  ['Theme (chủ đề)', 'Phẩm chất nằm bên dưới mà một câu hỏi kiểm (làm nhóm, trách nhiệm…).'],
  ['Angle (góc kể)', 'Phần của câu chuyện bạn nhấn mạnh cho một câu hỏi cụ thể.'],
  ['Disguised question (câu hỏi đội lốt)', 'Câu hỏi có cách hỏi che mất chủ đề thật.'],
  ['Confidential (bí mật)', 'Thông tin bạn không được chia sẻ ra ngoài chủ sở hữu của nó.'],
])}
${tomTat('vi', [
  'Ba mươi câu hay gặp chia thành sáu chủ đề.',
  'Sáu tới tám câu chuyện, kể từ các góc khác nhau, trả lời được gần như tất cả.',
  'Tìm chủ đề thật của câu hỏi đội lốt trước khi chọn câu chuyện.',
  'Dùng một câu gần đúng mà thật, đừng bịa câu chuyện.',
  'Không bao giờ tiết lộ chi tiết bí mật của công ty hay trường cũ.',
])}
${lienQuan('vi', [
  yt('T25I2FQ9Mok', 'Aced (formerly Exponent)', 'Top 10 Behavioral Software Engineering Interview Questions', 6),
  nguon('📘', 'Tech Interview Handbook — Behavioral interview questions', 'Danh sách dài hơn các câu hỏi hành vi các công ty công nghệ hay dùng (tiếng Anh).', 'https://www.techinterviewhandbook.org/behavioral-interview/'),
  lienKet({ khoa: 'testing', bai: 'tst-10-4-phong-van', title: 'Testing 10.4 — Câu hỏi phỏng vấn về testing', sub: 'Nhiều câu hành vi rẽ sang "em bảo đảm nó chạy đúng thế nào?" — phần testing của câu trả lời.' }),
])}
</div>
`,
};

/* ═══════════════════════ 3.5 — Lab: mock hành vi ═══════════════════════ */
const KICH_BAN_EN = `
BEHAVIOURAL MOCK - 30 MINUTES                       roles: interviewer · candidate · (observer)

00:00-02:00  Interviewer: greeting, explains format ("about 25 minutes of questions, then yours").
02:00-05:00  Q0  "Tell me about yourself."                         (target 60-90 s)
05:00-25:00  Six questions, one from each group, ~3 min each incl. one follow-up:
             A  "Why do you want to work here?"
             B  "Tell me about a disagreement with a teammate."
             C  "Tell me about a time you failed."
             D  "Do you use AI tools? How do you verify the output?"
             E  "Tell me about something you improved without being asked."
             F  "What would you do in your first week here?"
             After each answer the interviewer asks ONE follow-up from the list:
               "What exactly did YOU do?" · "How did you measure that?"
               "What would you do differently?" · "What did the other person think?"
25:00-28:00  Candidate asks 2 questions (Lesson 2.4) and the next-step question.
28:00-30:00  Interviewer closes. Then 10 minutes of feedback using the scoring sheet.
`;

const KICH_BAN_VI = `
PHỎNG VẤN HÀNH VI THỬ - 30 PHÚT                     vai: người phỏng vấn · ứng viên · (người quan sát)

00:00-02:00  Người PV: chào, nói thể thức ("khoảng 25 phút câu hỏi, rồi tới phần em hỏi").
02:00-05:00  C0  "Em giới thiệu về bản thân nhé."                   (mục tiêu 60-90 giây)
05:00-25:00  Sáu câu, mỗi nhóm một câu, ~3 phút mỗi câu kể cả một câu đào sâu:
             A  "Vì sao em muốn làm ở đây?"
             B  "Kể về một lần em bất đồng với bạn cùng nhóm."
             C  "Kể về một lần em thất bại."
             D  "Em có dùng công cụ AI không? Em kiểm chứng đầu ra thế nào?"
             E  "Kể về một thứ em tự cải tiến khi không ai yêu cầu."
             F  "Tuần đầu ở đây em sẽ làm gì?"
             Sau mỗi câu trả lời, người PV hỏi MỘT câu đào sâu trong danh sách:
               "Cụ thể EM đã làm gì?" · "Em đo cái đó bằng cách nào?"
               "Làm lại em sẽ làm khác đi thế nào?" · "Người kia nghĩ sao?"
25:00-28:00  Ứng viên hỏi 2 câu (bài 2.4) và câu hỏi về bước tiếp theo.
28:00-30:00  Người PV khép lại. Sau đó 10 phút góp ý theo phiếu chấm.
`;

const L35 = {
  title: '3.5 — Lab 3: a 30-minute behavioural mock interview with a script and a scoring sheet|||3.5 — Lab 3: phỏng vấn hành vi thử 30 phút có kịch bản và phiếu chấm',
  slug: 'pv-3-5-lab-mock-hanh-vi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một buổi phỏng vấn hành vi thử trọn 30 phút làm được ngay: kịch bản theo phút cho người phỏng vấn, sáu câu từ sáu nhóm kèm câu đào sâu, phiếu chấm năm tiêu chí cho từng câu, cách làm khi chỉ có một mình (bốc câu ngẫu nhiên + quay camera), và buổi rút kinh nghiệm 10 phút.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab 3</span>
<h2>Lab 3 — Run a 30-minute behavioural mock interview, and score it</h2>
<p class="lead">Reading stories is not the same as telling them to a stranger who interrupts. In this lab you run a full behavioural round with a classmate (or alone, with a camera), following a minute-by-minute script, and score every answer on a five-criterion sheet. It is the closest thing to a real interview you can do this week.</p>

<h3>The situation</h3>
<p>You have an interview at a company from your tracker in a few days. You have a story bank (2.2), a failure story (2.3), a conflict story (3.1) and an AI answer (3.3). Now you need to find out which of them hold up under follow-up questions — before the real interviewer finds out.</p>
${flow([
  ['Before · 10 min', 'swap roles, print the sheet', 'Give your partner the script and the follow-up list. Agree to be strict: the point is to find weak spots.'],
  ['Mock · 30 min', 'run it like the real thing', 'Camera on, no notes in front of the candidate, the interviewer keeps time.'],
  ['Feedback · 10 min', 'scores first, then one strength and two fixes', 'The interviewer reads the scores; the candidate only listens and writes.'],
  ['Repeat · next day', 'swap roles, then redo the two weakest answers', 'Improvement shows on the second run.'],
])}
${ra(KICH_BAN_EN)}

<h3>Scoring sheet — per answer (0–2 each, 10 per answer)</h3>
${rubric('en', [
  ['STAR complete', 'No clear situation or result', 'One part missing or vague', 'Situation, task, action, result, all clear'],
  ['"I" not "we"', 'Only "we"', 'Mixed', 'Context "we", actions "I", AI role stated where relevant'],
  ['Evidence', 'No number or detail', 'A vague detail', 'A real number or checkable detail'],
  ['Honesty under follow-up', 'Changed the story or bluffed', 'Hesitated but stayed consistent', 'Answered or said "I don’t know" honestly'],
  ['Length', 'Under 1 min or over 3.5', '1–1.5 or 2.5–3.5 min', '1.5–2.5 min'],
])}
<p><strong>Targets:</strong> average 7/10 per answer, no answer below 5, and no zero on "Honesty under follow-up". Anything below 5 goes back into your story bank for rewriting.</p>
<details><summary>Doing it alone</summary>
<p>Write the six questions and the four follow-ups on separate cards. Shuffle, draw a question, start recording, answer, then draw a follow-up card and answer that too. Score the recording the next day — with fresh ears you will hear what you missed.</p>
</details>
<details><summary>Hint for the interviewer — how to be useful</summary>
<p>Do not help the candidate. Do not nod at every sentence. When an answer is vague, ask "What exactly did you do?" When a number appears, ask "How did you measure it?" Note the second where the Action starts — if it is after one minute, the Situation was too long.</p>
</details>
${bay('en', 'a mock that is too friendly.', 'Practising with a friend who laughs, helps and never asks a follow-up gives you false confidence. The real value of a mock is the uncomfortable follow-up. Agree at the start that the interviewer will be strict, and thank them for it.')}
${keXau('en', 'if you practise with an online "mock interview" service or AI tool, check what it does with your recordings and data. Do not upload a video with your full name and student details to an unknown service, and do not paste a company’s real interview questions you received under confidentiality.')}
${neu('en', 'your partner asks a question that is not on the script? Good — answer it. Real interviews go off-script all the time; add the question to your bank afterwards.')}
${thucHanh('en', { phut: '50', steps: [
  'Find a partner (classmate, friend, sibling) or prepare cards for the solo version.',
  'Run the 30-minute script with the camera on.',
  'Fill the scoring sheet for all seven answers (including the introduction).',
  'Rewrite the two lowest-scoring answers and record them again.',
], dat: 'you have a recording, a filled scoring sheet with an average of at least 7/10, and two rewritten answers.' })}
${thuatNgu('en', [
  ['Mock interview', 'A practice interview that follows the real format.'],
  ['Scoring sheet', 'The form used to score each answer against the same criteria.'],
  ['Follow-up', 'A question that digs into a previous answer.'],
  ['Debrief', 'A short discussion right after a session about what went well and what to fix.'],
  ['Timebox', 'A fixed amount of time for an activity.'],
])}
${tomTat('en', [
  'A mock interview is the closest practice to the real thing — run it with a script and a timer.',
  'Score every answer on STAR, "I", evidence, honesty under follow-up and length.',
  'Follow-up questions find the weak stories; a friendly mock without them is wasted.',
  'Rewrite and re-record anything below 5/10.',
  'Alone, use shuffled question cards and score the recording the next day.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'communication-and-in-group-working-skills', bai: 'ssg104-b4-l16-cuoc-hop', academy: true, L: 'en', title: 'Academy · SSG104 S4.3 — Groups and meetings', sub: 'Running a structured meeting — the same discipline as running a mock.' }),
  yt('CAda15Tawlg', 'Hello Interview', 'Behavioral Interview: Common Questions Broken Down by Ex-Meta and Amazon Senior Managers', 67, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab 3</span>
<h2>Lab 3 — Tổ chức một buổi phỏng vấn hành vi thử 30 phút, và chấm điểm</h2>
<p class="lead">Đọc câu chuyện khác hẳn kể nó cho một người lạ hay cắt ngang. Trong lab này bạn chạy trọn một vòng phỏng vấn hành vi với một bạn cùng lớp (hoặc một mình, với camera), theo kịch bản từng phút, và chấm mỗi câu trả lời bằng một phiếu năm tiêu chí. Đây là thứ gần với buổi phỏng vấn thật nhất mà bạn làm được trong tuần này.</p>

<h3>Tình huống</h3>
<p>Vài ngày nữa bạn có buổi phỏng vấn ở một công ty trong bảng theo dõi. Bạn đã có kho câu chuyện (2.2), câu chuyện thất bại (2.3), câu chuyện xung đột (3.1) và câu trả lời về AI (3.3). Giờ bạn cần biết câu nào đứng vững trước câu hỏi đào sâu — trước khi người phỏng vấn thật phát hiện ra.</p>
${flow([
  ['Trước · 10 phút', 'phân vai, in phiếu', 'Đưa bạn cặp kịch bản và danh sách câu đào sâu. Thống nhất chấm nghiêm: mục đích là tìm chỗ yếu.'],
  ['Phỏng vấn thử · 30 phút', 'chạy như thật', 'Bật camera, ứng viên không để ghi chú trước mặt, người phỏng vấn giữ giờ.'],
  ['Góp ý · 10 phút', 'điểm trước, rồi một điểm mạnh và hai chỗ cần sửa', 'Người phỏng vấn đọc điểm; ứng viên chỉ nghe và ghi.'],
  ['Lặp lại · hôm sau', 'đổi vai, rồi làm lại hai câu yếu nhất', 'Sự tiến bộ hiện ra ở lần chạy thứ hai.'],
])}
${ra(KICH_BAN_VI)}

<h3>Phiếu chấm — cho từng câu trả lời (mỗi tiêu chí 0–2, tối đa 10 mỗi câu)</h3>
${rubric('vi', [
  ['STAR đầy đủ', 'Không rõ tình huống hay kết quả', 'Thiếu hoặc mơ hồ một phần', 'Tình huống, nhiệm vụ, hành động, kết quả đều rõ'],
  ['"Em" chứ không phải "nhóm"', 'Chỉ toàn "nhóm"', 'Lẫn lộn', 'Bối cảnh "nhóm", hành động "em", nói rõ vai trò AI khi liên quan'],
  ['Bằng chứng', 'Không có số hay chi tiết', 'Chi tiết mơ hồ', 'Một con số thật hoặc chi tiết kiểm được'],
  ['Trung thực khi bị đào sâu', 'Đổi câu chuyện hoặc chém gió', 'Ngập ngừng nhưng vẫn nhất quán', 'Trả lời được, hoặc nói "em chưa biết" một cách thật lòng'],
  ['Độ dài', 'Dưới 1 phút hoặc trên 3,5 phút', '1–1,5 hoặc 2,5–3,5 phút', '1,5–2,5 phút'],
])}
<p><strong>Mục tiêu:</strong> trung bình 7/10 mỗi câu, không câu nào dưới 5, và không có điểm 0 ở tiêu chí "Trung thực khi bị đào sâu". Câu nào dưới 5 quay về kho câu chuyện để viết lại.</p>
<details><summary>Làm một mình</summary>
<p>Viết sáu câu hỏi và bốn câu đào sâu lên các tấm thẻ riêng. Xáo, bốc một câu hỏi, bật quay, trả lời, rồi bốc một thẻ đào sâu và trả lời tiếp. Chấm bản quay vào hôm sau — tai "mới" sẽ nghe ra những gì bạn bỏ sót.</p>
</details>
<details><summary>Gợi ý cho người phỏng vấn — làm sao cho có ích</summary>
<p>Đừng giúp ứng viên. Đừng gật đầu theo từng câu. Khi câu trả lời mơ hồ, hỏi "Cụ thể em đã làm gì?" Khi có một con số, hỏi "Em đo bằng cách nào?" Ghi lại giây mà phần Hành động bắt đầu — nếu sau một phút thì phần Tình huống quá dài.</p>
</details>
${bay('vi', 'buổi thử quá thân thiện.', 'Luyện với một người bạn cứ cười, cứ đỡ lời và không bao giờ hỏi đào sâu cho bạn sự tự tin giả. Giá trị thật của buổi thử nằm ở câu đào sâu làm bạn khó chịu. Thống nhất ngay từ đầu là người phỏng vấn sẽ nghiêm khắc, và cảm ơn họ vì điều đó.')}
${keXau('vi', 'nếu bạn luyện bằng một dịch vụ "phỏng vấn thử" online hay công cụ AI, kiểm xem nó làm gì với bản ghi và dữ liệu của bạn. Đừng tải video có họ tên đầy đủ và thông tin sinh viên lên một dịch vụ lạ, và đừng dán những câu hỏi phỏng vấn thật của một công ty mà bạn nhận được kèm cam kết giữ bí mật.')}
${neu('vi', 'bạn cặp hỏi một câu không có trong kịch bản? Tốt — trả lời luôn. Buổi phỏng vấn thật lệch kịch bản suốt; sau đó thêm câu đó vào ngân hàng của bạn.')}
${thucHanh('vi', { phut: '50', steps: [
  'Tìm một người cặp (bạn cùng lớp, bạn bè, anh chị em) hoặc chuẩn bị thẻ cho bản làm một mình.',
  'Chạy kịch bản 30 phút, bật camera.',
  'Điền phiếu chấm cho cả bảy câu trả lời (kể cả phần giới thiệu).',
  'Viết lại hai câu điểm thấp nhất và quay lại.',
], dat: 'bạn có bản ghi, một phiếu chấm đã điền với điểm trung bình ít nhất 7/10, và hai câu trả lời đã viết lại.' })}
${thuatNgu('vi', [
  ['Mock interview (phỏng vấn thử)', 'Buổi phỏng vấn tập theo đúng thể thức thật.'],
  ['Scoring sheet (phiếu chấm)', 'Mẫu dùng để chấm mọi câu trả lời theo cùng tiêu chí.'],
  ['Follow-up (câu đào sâu)', 'Câu hỏi khoan sâu vào câu trả lời trước.'],
  ['Debrief (rút kinh nghiệm)', 'Buổi trao đổi ngắn ngay sau một phiên về điều làm tốt và điều cần sửa.'],
  ['Timebox (khung giờ cố định)', 'Một lượng thời gian cố định cho một hoạt động.'],
])}
${tomTat('vi', [
  'Phỏng vấn thử là cách luyện gần thật nhất — chạy nó có kịch bản và bấm giờ.',
  'Chấm mỗi câu theo STAR, "em", bằng chứng, trung thực khi bị đào sâu và độ dài.',
  'Câu đào sâu tìm ra câu chuyện yếu; buổi thử thân thiện mà không có chúng là phí.',
  'Viết lại và quay lại mọi câu dưới 5/10.',
  'Làm một mình thì dùng thẻ câu hỏi xáo ngẫu nhiên và chấm bản ghi vào hôm sau.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'communication-and-in-group-working-skills', bai: 'ssg104-b4-l16-cuoc-hop', academy: true, title: 'Academy · SSG104 S4.3 — Nhóm và cuộc họp', sub: 'Điều hành một cuộc họp có cấu trúc — cùng kỷ luật với việc chạy một buổi phỏng vấn thử.' }),
  yt('CAda15Tawlg', 'Hello Interview', 'Behavioral Interview: Common Questions Broken Down by Ex-Meta and Amazon Senior Managers', 67),
])}
</div>
`,
};

/* ═══════════════════════ 3.6 — Quiz ═══════════════════════ */
const Q36 = {
  title: '3.6 — Chapter 3 check|||3.6 — Kiểm tra Chương 3',
  slug: 'pv-3-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về xung đột trong nhóm, người ăn theo, hạn chót, làm hỏng production, migration hỏng, học công nghệ mới, nói về AI trung thực, an toàn dữ liệu, câu hỏi đội lốt và phỏng vấn thử.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Chapter 3 check — behavioural interviews</h2>
<p class="lead">Ten situations. Each explanation shows why the right answer is right and why the tempting one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can tell a conflict story in five steps without a villain.</li>
<li>I can answer a deadline question with a method, not with hours worked.</li>
<li>I know the order stabilise → tell → understand → prevent for a production incident.</li>
<li>I can describe honestly how I use AI and how I verify it.</li>
<li>I have run at least one scored mock interview.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Kiểm tra Chương 3 — phỏng vấn hành vi</h2>
<p class="lead">Mười tình huống. Mỗi lời giải thích chỉ ra vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi kể được một câu chuyện xung đột năm bước mà không có "kẻ xấu".</li>
<li>Tôi trả lời câu hỏi về hạn chót bằng phương pháp, không bằng số giờ làm.</li>
<li>Tôi biết thứ tự ổn định → báo → hiểu → phòng khi có sự cố production.</li>
<li>Tôi tả được một cách trung thực mình dùng AI ra sao và kiểm chứng thế nào.</li>
<li>Tôi đã chạy ít nhất một buổi phỏng vấn thử có chấm điểm.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('A teammate has pushed nothing for two weeks before a milestone. What is the best first step?|||Một bạn cùng nhóm hai tuần chưa đẩy gì lên trước mốc nộp. Bước đầu tốt nhất là gì?', [
        'Report them to the teacher immediately|||Báo thầy ngay lập tức',
        'Quietly do their part yourself|||Âm thầm làm hộ phần của bạn ấy',
        'Talk to them privately, find out what blocks them and offer concrete help|||Nói chuyện riêng, tìm hiểu bạn ấy đang vướng gì và đề nghị giúp cụ thể',
        'Post in the group chat that they are lazy|||Đăng lên nhóm chat là bạn ấy lười',
      ], 2, 'EN: Private first and help before escalation — often there is a reason, such as being stuck on setup. Reporting at once skips the cheapest fix; doing it yourself hides the problem and breeds resentment.|||VI: Nói riêng trước và giúp trước khi báo lên — thường có lý do, như kẹt cài đặt. Báo thầy ngay là bỏ qua cách gỡ rẻ nhất; tự làm hộ thì che mất vấn đề và sinh ấm ức.'),
      cau('In a conflict story, which step shows maturity most clearly?|||Trong câu chuyện xung đột, bước nào thể hiện sự chín chắn rõ nhất?', [
        'Describing why the other person’s view was reasonable|||Tả vì sao góc nhìn của người kia là hợp lý',
        'Proving you were right in the end|||Chứng minh cuối cùng mình đúng',
        'Explaining that the other person lacked experience|||Giải thích người kia thiếu kinh nghiệm',
        'Saying the conflict was the teacher’s fault|||Nói xung đột là lỗi của thầy',
      ], 0, 'EN: Understanding the other side is what separates a mature story from a complaint. "Proving you were right" is tempting but turns the story into a contest.|||VI: Hiểu phía bên kia là thứ tách một câu chuyện chín chắn khỏi một lời phàn nàn. "Chứng minh mình đúng" nghe hấp dẫn nhưng biến câu chuyện thành một cuộc thi.'),
      cau('You chose a modular monolith for your solo capstone although a friend advised microservices. What makes this a strong interview story?|||Bạn chọn modular monolith cho đồ án làm một mình dù một người bạn khuyên microservices. Điều gì làm câu chuyện này mạnh trong phỏng vấn?', [
        'Microservices are always wrong for students|||Microservices luôn sai với sinh viên',
        'You ignored the advice and saved time|||Bạn bỏ qua lời khuyên và tiết kiệm thời gian',
        'Your friend admitted he was wrong|||Người bạn thừa nhận mình sai',
        'You decided by explicit criteria and kept the other option open with rules for separable modules|||Bạn quyết bằng tiêu chí rõ ràng và để ngỏ lựa chọn kia bằng các nguyên tắc giữ module tách được',
      ], 3, 'EN: Criteria plus a design that respects the other view is exactly what interviewers look for. "Microservices are always wrong" is a dogma that a follow-up will break.|||VI: Tiêu chí cộng một thiết kế tôn trọng góc nhìn kia đúng là điều người phỏng vấn tìm. "Microservices luôn sai" là một giáo điều sẽ vỡ ngay câu đào sâu.'),
      cau('Two days before a deadline you see one feature will not be ready. What do you do?|||Hai ngày trước hạn bạn thấy một tính năng sẽ không kịp. Bạn làm gì?', [
        'Work all night and hope|||Làm cả đêm và hy vọng',
        'Tell the owner now, propose delivering the core fully tested and moving the feature|||Báo người phụ trách ngay, đề xuất giao phần cốt lõi đã test kỹ và dời tính năng đó',
        'Ship it half-working so nothing is missing|||Đẩy lên bản chạy nửa vời để không thiếu gì',
        'Wait until the deadline to explain|||Chờ tới hạn rồi mới giải thích',
      ], 1, 'EN: Bad news early plus cutting scope, not quality. Working all night is the tempting heroic answer but has no method and risks an unreviewed release.|||VI: Báo tin xấu sớm và cắt phạm vi, không cắt chất lượng. Làm cả đêm là câu trả lời "anh hùng" hấp dẫn nhưng không có phương pháp và dễ đẩy lên thứ chưa ai review.'),
      cau('A database migration fails halfway during a deploy. What should you do first?|||Một migration cơ sở dữ liệu hỏng giữa chừng lúc deploy. Bạn nên làm gì trước tiên?', [
        'Mark it as resolved so the next deploys can continue|||Đánh dấu là đã resolve để các lần deploy sau chạy tiếp',
        'Rewrite it with IF NOT EXISTS and run it again|||Viết lại với IF NOT EXISTS rồi chạy lại',
        'Stop, record the exact error, check which statements ran, and report with a proposed fix|||Dừng lại, ghi đúng thông báo lỗi, kiểm câu lệnh nào đã chạy, và báo kèm đề xuất sửa',
        'Delete the migration folder|||Xoá thư mục migration',
      ], 2, 'EN: A half-applied migration that is "resolved" or forced through can silently corrupt the production schema. The quick resolve is the tempting answer and the dangerous one.|||VI: Một migration chạy dở bị "resolve" hoặc ép cho qua có thể âm thầm làm hỏng lược đồ trên production. Resolve nhanh là phương án hấp dẫn và cũng là phương án nguy hiểm.'),
      cau('Which order is right after you break production?|||Thứ tự nào đúng sau khi bạn làm hỏng production?', [
        'Find the root cause, then fix it, then tell the team|||Tìm nguyên nhân gốc, rồi sửa, rồi báo đội',
        'Fix it quietly before anyone notices|||Lặng lẽ sửa trước khi có ai phát hiện',
        'Write the postmortem first|||Viết postmortem trước',
        'Stabilise (for example roll back), tell the team, understand the cause, prevent the class of failure|||Ổn định (ví dụ quay lui), báo đội, hiểu nguyên nhân, phòng cả loại lỗi',
      ], 3, 'EN: Users first: restore service, and tell people immediately. Looking for the root cause first is tempting for engineers, but users stay broken while you investigate.|||VI: Người dùng trước: khôi phục dịch vụ, và báo mọi người ngay. Tìm nguyên nhân gốc trước nghe hợp với dân kỹ thuật, nhưng người dùng vẫn bị hỏng trong lúc bạn điều tra.'),
      cau('An AI assistant concludes from the code that two kinds of pages can never share a URL slug. What is the best way to verify?|||Một trợ lý AI đọc mã rồi kết luận hai loại trang không thể trùng slug URL. Cách kiểm chứng tốt nhất là gì?', [
        'Check the real data — request both URLs on production or query the tables|||Kiểm dữ liệu thật — gọi cả hai URL trên production hoặc truy vấn các bảng',
        'Ask the AI to explain its reasoning again|||Bảo AI giải thích lại lập luận',
        'Read the code a second time|||Đọc lại mã lần nữa',
        'Trust it — the reasoning is correct|||Tin nó — lập luận đúng mà',
      ], 0, 'EN: Code shows what is possible; data shows what is true. In the real case the reasoning was correct for the code, but a past migration had left duplicates in the data.|||VI: Mã cho biết điều có thể; dữ liệu cho biết điều có thật. Trong vụ thật, lập luận đúng với mã, nhưng một lần chuyển dữ liệu trước đó đã để lại bản trùng trong dữ liệu.'),
      cau('Which answer to "Do you use AI tools?" is strongest?|||Câu trả lời nào cho "Em có dùng công cụ AI không?" là mạnh nhất?', [
        '"No, I write everything myself."|||"Không, em tự viết hết."',
        '"Yes, it writes most of my code, I just run it."|||"Có, nó viết gần hết code, em chỉ chạy thôi."',
        '"Yes — on my platform it writes much of the code and I review, test and operate it; my capstone I code by hand; I never paste secrets into unapproved tools."|||"Có — trên nền tảng của em nó viết phần lớn mã, em duyệt, test và vận hành; đồ án em tự code tay; em không dán bí mật vào công cụ chưa được duyệt."',
        '"I would rather not say."|||"Em xin phép không nói ạ."',
      ], 2, 'EN: It answers the three worries: coding without AI, verifying it, and data safety. "No, never" is tempting but rarely believable and breaks at the first question about scale.|||VI: Nó giải toả cả ba nỗi lo: code không cần AI, kiểm chứng nó, và an toàn dữ liệu. "Không bao giờ" nghe an toàn nhưng hiếm khi đáng tin và vỡ ngay câu hỏi đầu tiên về quy mô.'),
      cau('"What would your previous teammates say about you?" Which theme is this question really testing?|||"Bạn cùng nhóm cũ sẽ nói gì về em?" Câu này thật ra đang kiểm chủ đề nào?', [
        'Your English|||Tiếng Anh của bạn',
        'Strengths and weaknesses, seen through teamwork|||Điểm mạnh và điểm yếu, nhìn qua lăng kính làm nhóm',
        'Whether you have friends|||Bạn có bạn bè không',
        'Technical depth|||Độ sâu kỹ thuật',
      ], 1, 'EN: It is a disguised strengths-and-weaknesses question. Answer with one real strength and one area you are improving, each with an example — not with "they would say I am great".|||VI: Đây là câu hỏi điểm mạnh – điểm yếu đội lốt. Trả lời bằng một điểm mạnh thật và một điểm đang cải thiện, mỗi cái kèm ví dụ — không phải "họ sẽ nói em rất tốt".'),
      cau('In your mock interview the interviewer was friendly, nodded at everything and asked no follow-ups. You scored 10/10. What does that tell you?|||Trong buổi phỏng vấn thử, người phỏng vấn rất thân thiện, gật đầu mọi câu và không hỏi đào sâu. Bạn được 10/10. Điều đó cho bạn biết gì?', [
        'Very little — without follow-ups the weak stories were never tested; run it again with a strict partner|||Rất ít — không có câu đào sâu thì các câu chuyện yếu chưa hề bị thử; chạy lại với người cặp nghiêm khắc',
        'You are ready for any interview|||Bạn đã sẵn sàng cho mọi buổi phỏng vấn',
        'Mock interviews are useless|||Phỏng vấn thử vô ích',
        'You should prepare fewer stories|||Bạn nên chuẩn bị ít câu chuyện hơn',
      ], 0, 'EN: The value of a mock is the uncomfortable follow-up. A perfect score from a friendly mock is false confidence, not proof of readiness.|||VI: Giá trị của buổi thử nằm ở câu đào sâu làm bạn khó chịu. Điểm tuyệt đối từ một buổi thử thân thiện là tự tin giả, không phải bằng chứng đã sẵn sàng.'),
    ],
  },
};

export default {
  title: 'Chapter 3 — Behavioural interviews|||Chương 3 — Phỏng vấn hành vi',
  description: 'Làm nhóm, xung đột, áp lực và học hỏi: câu hỏi về bất đồng và người ăn theo, hạn chót và làm hỏng production, cách học có bằng chứng và nói về AI trung thực, ngân hàng 30 câu hỏi hành vi, và lab phỏng vấn thử 30 phút có phiếu chấm.',
  lessons: [L31, L32, L33, L34, L35, Q36],
};
