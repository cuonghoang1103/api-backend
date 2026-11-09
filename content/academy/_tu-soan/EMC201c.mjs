// Khoá TỰ SOẠN cho EMC201c — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Giáo trình tham khảo: Cotton, Falvey & Kent "Market Leader Intermediate"; Murphy "English Grammar in Use" 5th; Meyer "The Culture Map"; Guffey & Loewy "Business Communication: Process and Product".
const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const x = (s) => (Array.isArray(s) ? s[0] + '|||' + s[1] : (String(s).includes('|||') ? s : s + '|||' + s));
const W = 'https://en.wikipedia.org/wiki/';
const wk = (p, en, vi) => [W + p, 'Wikipedia — ' + en, 'Wikipedia — ' + vi];
const LK = {
  bizeng: wk('Business_English', 'Business English', 'Tiếng Anh thương mại'),
  comm: wk('Business_communication', 'Business communication', 'Giao tiếp kinh doanh'),
  cefr: wk('Common_European_Framework_of_Reference_for_Languages', 'CEFR levels (A1–C2)', 'Khung tham chiếu CEFR (A1–C2)'),
  toeic: wk('TOEIC', 'TOEIC test', 'Bài thi TOEIC'),
  elf: wk('English_as_a_lingua_franca', 'English as a lingua franca', 'Tiếng Anh như ngôn ngữ chung'),
  register: wk('Register_(sociolinguistics)', 'Register (sociolinguistics)', 'Văn phong/mức độ trang trọng (register)'),
  polite: wk('Politeness_theory', 'Politeness theory', 'Lý thuyết lịch sự'),
  hedge: wk('Hedge_(linguistics)', 'Hedge (linguistics)', 'Từ rào đón (hedge)'),
  plain: wk('Plain_language', 'Plain language', 'Ngôn ngữ giản dị, dễ hiểu'),
  modal: wk('Modal_verb', 'Modal verb', 'Động từ khuyết thiếu'),
  phrasal: wk('Phrasal_verb', 'Phrasal verb', 'Cụm động từ'),
  colloc: wk('Collocation', 'Collocation', 'Kết hợp từ (collocation)'),
  falsef: wk('False_friend', 'False friend', 'Từ dễ nhầm (false friend)'),
  cond: wk('Conditional_sentence', 'Conditional sentence', 'Câu điều kiện'),
  passive: wk('Passive_voice', 'Passive voice', 'Câu bị động'),
  reported: wk('Reported_speech', 'Reported speech', 'Lời nói gián tiếp'),
  qtag: wk('Question_tag', 'Question tag', 'Câu hỏi đuôi'),
  stress: wk('Stress_(linguistics)', 'Stress (linguistics)', 'Trọng âm'),
  intonation: wk('Intonation_(linguistics)', 'Intonation', 'Ngữ điệu'),
  email: wk('Email', 'Email', 'Email'),
  netiq: wk('Netiquette', 'Netiquette', 'Phép lịch sự trên mạng'),
  esig: wk('Email_signature', 'Email signature', 'Chữ ký email'),
  cold: wk('Cold_email', 'Cold email', 'Email gửi lạnh'),
  memo: wk('Memorandum', 'Memorandum', 'Bản ghi nhớ nội bộ (memo)'),
  complaint: wk('Complaint', 'Complaint', 'Khiếu nại'),
  cs: wk('Customer_service', 'Customer service', 'Dịch vụ khách hàng'),
  voicemail: wk('Voicemail', 'Voicemail', 'Hộp thư thoại'),
  conf: wk('Conference_call', 'Conference call', 'Cuộc gọi hội nghị'),
  video: wk('Videoconferencing', 'Videoconferencing', 'Hội nghị truyền hình'),
  zoom: wk('Zoom_(software)', 'Zoom (software)', 'Phần mềm Zoom'),
  teams: wk('Microsoft_Teams', 'Microsoft Teams', 'Microsoft Teams'),
  meeting: wk('Meeting', 'Meeting', 'Cuộc họp'),
  agenda: wk('Agenda_(meeting)', 'Agenda (meeting)', 'Chương trình họp (agenda)'),
  minutes: wk('Minutes', 'Minutes (meeting records)', 'Biên bản họp'),
  rules: wk('Robert%27s_Rules_of_Order', "Robert's Rules of Order", 'Quy tắc điều hành họp Robert'),
  listen: wk('Active_listening', 'Active listening', 'Lắng nghe chủ động'),
  feedback: wk('Feedback', 'Feedback', 'Phản hồi'),
  brain: wk('Brainstorming', 'Brainstorming', 'Động não (brainstorming)'),
  conflict: wk('Conflict_resolution', 'Conflict resolution', 'Giải quyết xung đột'),
  assert: wk('Assertiveness', 'Assertiveness', 'Tính quyết đoán (assertiveness)'),
  pres: wk('Presentation', 'Presentation', 'Thuyết trình'),
  speak: wk('Public_speaking', 'Public speaking', 'Nói trước công chúng'),
  slide: wk('Slide_show', 'Slide show', 'Trình chiếu slide'),
  story: wk('Storytelling', 'Storytelling', 'Kể chuyện (storytelling)'),
  pitch: wk('Elevator_pitch', 'Elevator pitch', 'Bài chào nhanh (elevator pitch)'),
  nonv: wk('Nonverbal_communication', 'Nonverbal communication', 'Giao tiếp phi ngôn ngữ'),
  nego: wk('Negotiation', 'Negotiation', 'Đàm phán'),
  batna: wk('BATNA', 'BATNA (best alternative to a negotiated agreement)', 'BATNA (phương án thay thế tốt nhất)'),
  getting: wk('Getting_to_Yes', 'Getting to Yes (Fisher & Ury)', 'Getting to Yes (Fisher & Ury)'),
  salary: wk('Salary_negotiation', 'Salary negotiation', 'Thương lượng lương'),
  mediation: wk('Mediation', 'Mediation', 'Hoà giải'),
  small: wk('Small_talk', 'Small talk', 'Chuyện xã giao (small talk)'),
  greeting: wk('Greeting', 'Greeting', 'Lời chào'),
  bizcard: wk('Business_card', 'Business card', 'Danh thiếp'),
  bizetiq: wk('Business_etiquette', 'Business etiquette', 'Phép lịch sự trong kinh doanh'),
  icc: wk('Intercultural_communication', 'Intercultural communication', 'Giao tiếp liên văn hoá'),
  icomp: wk('Intercultural_competence', 'Intercultural competence', 'Năng lực liên văn hoá'),
  hof: wk('Hofstede%27s_cultural_dimensions_theory', "Hofstede's cultural dimensions", 'Các chiều văn hoá của Hofstede'),
  hlc: wk('High-context_and_low-context_cultures', 'High- and low-context cultures', 'Văn hoá ngữ cảnh cao và thấp'),
  pdist: wk('Power_distance', 'Power distance', 'Khoảng cách quyền lực'),
  face: wk('Face_(sociological_concept)', 'Face (sociological concept)', 'Thể diện (face)'),
  stereo: wk('Stereotype', 'Stereotype', 'Định kiến (stereotype)'),
  codesw: wk('Code-switching', 'Code-switching', 'Chuyển mã ngôn ngữ'),
  corpc: wk('Corporate_culture', 'Corporate culture', 'Văn hoá doanh nghiệp'),
  meyer: wk('Erin_Meyer', 'Erin Meyer', 'Erin Meyer'),
  diversity: wk('Cultural_diversity', 'Cultural diversity', 'Đa dạng văn hoá'),
  summ: wk('Executive_summary', 'Executive summary', 'Tóm tắt điều hành'),
  prop: wk('Business_proposal', 'Business proposal', 'Đề xuất kinh doanh'),
  rfp: wk('Request_for_proposal', 'Request for proposal (RFP)', 'Yêu cầu đề xuất (RFP)'),
  techw: wk('Technical_writing', 'Technical writing', 'Viết kỹ thuật'),
  press: wk('Press_release', 'Press release', 'Thông cáo báo chí'),
  kpi: wk('Key_performance_indicator', 'Key performance indicator', 'Chỉ số hiệu suất (KPI)'),
  swot: wk('SWOT_analysis', 'SWOT analysis', 'Phân tích SWOT'),
  pm: wk('Project_management', 'Project management', 'Quản lý dự án'),
  annual: wk('Annual_report', 'Annual report', 'Báo cáo thường niên'),
  cv: wk('R%C3%A9sum%C3%A9', 'Résumé', 'Sơ yếu lý lịch/CV'),
  cvlat: wk('Curriculum_vitae', 'Curriculum vitae', 'Curriculum vitae'),
  cover: wk('Cover_letter', 'Cover letter', 'Thư xin việc (cover letter)'),
  interview: wk('Job_interview', 'Job interview', 'Phỏng vấn tuyển dụng'),
  recruit: wk('Recruitment', 'Recruitment', 'Tuyển dụng'),
  linkedin: wk('LinkedIn', 'LinkedIn', 'LinkedIn'),
  letter: wk('Letter_of_recommendation', 'Letter of recommendation', 'Thư giới thiệu'),
  teamwork: wk('Teamwork', 'Teamwork', 'Làm việc nhóm'),
  mission: wk('Mission_statement', 'Mission statement', 'Tuyên bố sứ mệnh'),
  bcBiz: ['https://learnenglish.britishcouncil.org/business-english', 'British Council LearnEnglish — Business English hub', 'British Council LearnEnglish — Tiếng Anh thương mại'],
  bcWrite: ['https://learnenglish.britishcouncil.org/skills/writing', 'British Council LearnEnglish — Writing lessons A1–C1', 'British Council LearnEnglish — Bài luyện viết A1–C1'],
  bcSpeak: ['https://learnenglish.britishcouncil.org/skills/speaking', 'British Council LearnEnglish — Speaking lessons', 'British Council LearnEnglish — Bài luyện nói'],
  bcListen: ['https://learnenglish.britishcouncil.org/skills/listening', 'British Council LearnEnglish — Listening lessons', 'British Council LearnEnglish — Bài luyện nghe'],
  plainGov: ['https://digital.gov/guides/plain-language', 'Digital.gov — Plain language guides', 'Digital.gov — Hướng dẫn viết ngôn ngữ giản dị'],
  meyerSite: ['https://erinmeyer.com/books/the-culture-map/', 'Erin Meyer — The Culture Map (author site)', 'Erin Meyer — The Culture Map (trang của tác giả)'],
};
const lk = (ks, i) => '<ul>' + ks.map((k) => { if (!LK[k]) throw new Error('thiếu link ' + k); return '<li><a href="' + LK[k][0] + '" target="_blank" rel="noopener">' + LK[k][i] + '</a></li>'; }).join('') + '</ul>';
const tbl = (head, rows) => '<table><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
// o: n, g:[[en,vi]], b:[en,vi] (bài giảng), voc:[[term,glossEn,glossVi]], ph:[[phrase,useEn,useVi]],
//    dlg:{t:[en,vi], l:[[spk,enLine,viLine]]}, pit:[[wrong,right,noteEn,noteVi]], s:[[en,vi]], l:[keys], p:[[qen,qvi,aen,avi]]
const build = (o, L) => {
  const I = L === 'en' ? 0 : 1;
  const T = L === 'en'
    ? { goals: 'Lesson goals', lec: 'Lesson', voc: 'Key vocabulary', term: 'Term', mean: 'Meaning', ph: 'Model phrases', phr: 'Phrase', use: 'When to use it', dlg: 'Sample dialogue / text', pit: 'Typical mistakes of Vietnamese learners', wr: 'Instead of', ri: 'Say', sum: '📌 Summary', more: '🔗 Learn more', prac: '🧪 Practice', ans: 'Answer', les: 'Lesson ' }
    : { goals: 'Mục tiêu bài', lec: 'Bài giảng', voc: 'Từ vựng chính', term: 'Từ/cụm', mean: 'Nghĩa', ph: 'Mẫu câu', phr: 'Mẫu câu', use: 'Dùng khi', dlg: 'Hội thoại / văn bản mẫu', pit: 'Lỗi người Việt hay gặp', wr: 'Thay vì', ri: 'Nên nói', sum: '📌 Tóm tắt', more: '🔗 Học thêm', prac: '🧪 Tự luyện', ans: 'Đáp án', les: 'Bài ' };
  let h = '<span class="eyebrow">EMC201c · ' + T.les + o.n + '</span>\n';
  h += '<h3>' + T.goals + '</h3><ul>' + o.g.map((g) => '<li>' + g[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.lec + '</h3>' + o.b[I] + '\n';
  if (o.voc) h += '<h3>' + T.voc + '</h3>' + tbl([T.term, T.mean], o.voc.map((v) => ['<strong>' + v[0] + '</strong>', v[1 + I]])) + '\n';
  if (o.ph) h += '<h3>' + T.ph + '</h3>' + tbl([T.phr, T.use], o.ph.map((v) => ['<em>' + v[0] + '</em>', v[1 + I]])) + '\n';
  if (o.dlg) {
    h += '<h3>' + T.dlg + '</h3><div class="note-ct"><strong>' + o.dlg.t[I] + '</strong>';
    h += o.dlg.l.map((l) => '<p><strong>' + l[0] + ':</strong> ' + l[1] + (I === 1 && l[2] ? '<br><em>' + l[2] + '</em>' : '') + '</p>').join('') + '</div>\n';
  }
  if (o.pit) h += '<div class="pitfall"><strong>' + T.pit + '.</strong>' + tbl([T.wr, T.ri, ''], o.pit.map((p) => ['✗ ' + p[0], '✓ ' + p[1], p[2 + I]])) + '</div>\n';
  h += '<h3>' + T.sum + '</h3><ul>' + o.s.map((s) => '<li>' + s[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.more + '</h3>' + lk(o.l, 1 + I) + '\n';
  h += '<h3>' + T.prac + '</h3><ol>' + o.p.map((p) => '<li>' + p[I] + '<div class="dap-an"><strong>' + T.ans + ':</strong> ' + p[2 + I] + '</div></li>').join('') + '</ol>';
  return h;
};
const D = (slug, en, vi, desc, o) => ({ title: en + '|||' + vi, slug, type: 'DOCUMENT', description: desc, content: bi(build(o, 'en'), build(o, 'vi')) });
const Q = (slug, en, vi, qs) => ({ title: en + '|||' + vi, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 600, questions: qs.map((q, i) => ({ id: 'q' + (i + 1), question: x(q[0]), options: q[1].map(x), correctIndex: q[2], points: 1, explanation: x(q[3]) })) } });
const SEC = (en, vi, desc, lessons) => ({ title: en + '|||' + vi, description: desc, lessons });
const P = 'emc201c-ts-';
const secs = [];
// ===== Mục 0 =====
secs.push(SEC('Section 0 — Course framework (self-authored, no FLM syllabus)', 'Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  'Giới thiệu EMC201c, chuẩn đầu ra tự soạn, giáo trình và tài liệu học.', [
  D(P + '0-1', '0.1 About EMC201c — Business English Communication', '0.1 Giới thiệu môn EMC201c — Giao tiếp tiếng Anh doanh nghiệp',
    'EMC201c là môn gì, học để làm gì, học xong làm được gì; lưu ý khung môn tự soạn.', {
    n: '0.1',
    g: [['Understand what EMC201c is and why workplace English matters', 'Hiểu EMC201c là môn gì và vì sao tiếng Anh công sở quan trọng'],
        ['Know the 8 self-authored learning outcomes', 'Nắm 8 chuẩn đầu ra tự soạn'],
        ['See the map of the 9 chapters and how each lesson is built', 'Nắm bản đồ 9 chương và cấu trúc từng bài']],
    b: [`<div class="callout"><strong>⚠️ Notice.</strong> The university has not published an EMC201c syllabus on FLM (checked by code, variants and name on 09/11/2026). This outline is self-authored from standard Business English coursebooks and communication textbooks. Grading scheme and exam schedule follow your lecturer.</div>
<p><strong>What it is.</strong> EMC201c (Business English Communication) is a second-semester subject in the English Language programme. It trains you to <em>do things</em> in English at work: write clear emails, take part in phone and video calls, speak up in meetings, give short presentations, negotiate simple deals, make small talk with foreign colleagues, write short reports and proposals, and get through a job interview. The target level is about CEFR B1–B2.</p>
<p><strong>Why it matters.</strong> Most Vietnamese graduates who work for foreign-invested companies, outsourcing firms or international teams use English every day, not to talk about literature but to get work done: confirm a deadline, explain a delay, disagree politely, ask for a discount. Mistakes at work are rarely "grammar" mistakes; they are tone and clarity mistakes. A message that is correct but too blunt, too vague or too long costs trust and time.</p>
<h4>Learning outcomes (self-authored)</h4>
<ol><li>Choose the right register (formal, neutral, informal) and a polite, professional tone for a given reader.</li>
<li>Write clear business emails: subject line, opening, request, reply, follow-up, complaint and apology.</li>
<li>Handle phone and video calls: open, clarify, take a message, solve audio problems, close.</li>
<li>Take part in meetings: chair, give opinions, agree and disagree, interrupt politely, write minutes and action items.</li>
<li>Plan and deliver a 5-minute presentation with signposting, data description and Q&amp;A.</li>
<li>Prepare and run a simple negotiation using offers, conditions and concessions.</li>
<li>Make small talk and avoid common intercultural misunderstandings.</li>
<li>Write a one-page report or proposal, a CV and cover letter, and answer common interview questions.</li></ol>
<h4>Related subjects</h4>
<p>EMC201c follows the English-skills subjects of semester 1 and prepares for later business, translation and communication subjects. Exact prerequisites and follow-up subjects are not published; ask your academic office. Chapter map: 1 Tone and register · 2 Business emails · 3 Phone and video calls · 4 Meetings · 5 Presentations · 6 Negotiation basics · 7 Small talk and intercultural communication · 8 Reports and proposals · 9 Job applications and interviews.</p>
<h4>How every lesson is built</h4>
<p>Each lesson has: goals, a short explanation, key vocabulary, model phrases, a sample dialogue or text, typical mistakes of Vietnamese learners, a summary, outside links and practice with answers. Read aloud, copy the phrases into your own notebook, and reuse them in the next real email or class activity.</p>`,
       `<div class="callout"><strong>⚠️ Lưu ý.</strong> Trường chưa công bố syllabus của EMC201c trên FLM (đã dò theo mã, biến thể mã và tên ngày 09/11/2026). Khung này soạn theo các giáo trình tiếng Anh thương mại và giao tiếp kinh doanh chuẩn; cách tính điểm và lịch thi theo giảng viên của lớp bạn.</div>
<p><strong>Là môn gì.</strong> EMC201c (Giao tiếp tiếng Anh doanh nghiệp) là môn kỳ 2 của ngành Ngôn ngữ Anh. Môn rèn bạn <em>làm việc bằng tiếng Anh</em>: viết email rõ ràng, nghe gọi điện và họp video, phát biểu trong cuộc họp, thuyết trình ngắn, đàm phán một thoả thuận đơn giản, nói chuyện xã giao với đồng nghiệp nước ngoài, viết báo cáo và đề xuất ngắn, và vượt qua buổi phỏng vấn. Trình độ mục tiêu khoảng CEFR B1–B2.</p>
<p><strong>Để làm gì.</strong> Phần lớn sinh viên ra trường làm cho công ty nước ngoài, công ty gia công phần mềm hay đội nhóm quốc tế dùng tiếng Anh mỗi ngày, không phải để bàn văn học mà để hoàn thành việc: xác nhận hạn chót, giải thích chậm trễ, phản đối lịch sự, xin giảm giá. Lỗi ở nơi làm việc hiếm khi là lỗi "ngữ pháp"; đó là lỗi giọng điệu và độ rõ ràng. Một tin nhắn đúng ngữ pháp nhưng quá cộc, quá mơ hồ hay quá dài vẫn làm mất lòng tin và mất thời gian.</p>
<h4>Chuẩn đầu ra (tự soạn)</h4>
<ol><li>Chọn đúng mức độ trang trọng (formal, neutral, informal) và giọng điệu lịch sự, chuyên nghiệp cho từng người đọc.</li>
<li>Viết email công việc rõ ràng: tiêu đề, mở đầu, yêu cầu, trả lời, nhắc việc, khiếu nại và xin lỗi.</li>
<li>Xử lý cuộc gọi và họp video: mở đầu, hỏi lại, ghi lời nhắn, xử lý sự cố âm thanh, kết thúc.</li>
<li>Tham gia họp: điều hành, nêu ý kiến, đồng ý và phản đối, ngắt lời lịch sự, viết biên bản và việc cần làm.</li>
<li>Chuẩn bị và trình bày bài thuyết trình 5 phút có từ dẫn dắt, mô tả số liệu và hỏi đáp.</li>
<li>Chuẩn bị và điều hành một cuộc đàm phán đơn giản bằng đề nghị, điều kiện và nhượng bộ.</li>
<li>Nói chuyện xã giao và tránh các hiểu lầm liên văn hoá thường gặp.</li>
<li>Viết báo cáo hoặc đề xuất một trang, CV và thư xin việc, và trả lời các câu hỏi phỏng vấn phổ biến.</li></ol>
<h4>Môn liên quan</h4>
<p>EMC201c nối tiếp các môn kỹ năng tiếng Anh kỳ 1 và chuẩn bị cho các môn kinh doanh, biên phiên dịch, truyền thông về sau. Môn tiên quyết và môn học tiếp chưa được công bố; hỏi phòng đào tạo. Bản đồ chương: 1 Giọng điệu và mức trang trọng · 2 Email công việc · 3 Điện thoại và họp video · 4 Cuộc họp · 5 Thuyết trình · 6 Đàm phán cơ bản · 7 Xã giao và giao tiếp liên văn hoá · 8 Báo cáo và đề xuất · 9 Xin việc và phỏng vấn.</p>
<h4>Mỗi bài được xây thế nào</h4>
<p>Mỗi bài gồm: mục tiêu, giải thích ngắn, từ vựng chính, mẫu câu, hội thoại hoặc văn bản mẫu, lỗi người Việt hay gặp, tóm tắt, link ngoài và bài tập có đáp án. Hãy đọc to, chép mẫu câu vào sổ riêng và dùng lại ngay trong email hay hoạt động trên lớp tiếp theo.</p>`],
    s: [['The syllabus is self-authored: follow your lecturer for grading and exams.', 'Khung môn tự soạn: điểm và thi theo giảng viên.'],
        ['Target level B1–B2; the goal is getting work done, not perfect grammar.', 'Trình độ B1–B2; mục tiêu là làm xong việc, không phải ngữ pháp hoàn hảo.'],
        ['Tone and clarity matter as much as correctness.', 'Giọng điệu và độ rõ ràng quan trọng ngang độ đúng.']],
    l: ['bizeng', 'comm', 'cefr', 'bcBiz'],
    p: [['Name three differences between "correct English" and "good business English".', 'Nêu ba điểm khác nhau giữa "tiếng Anh đúng" và "tiếng Anh công sở tốt".',
         'Possible: good business English is clear and short; polite for the reader; it states the action and deadline.', 'Ví dụ: tiếng Anh công sở tốt thì rõ và ngắn; lịch sự với người đọc; nêu rõ việc cần làm và hạn chót.'],
        ['Which chapter will help you most in your first internship, and why?', 'Chương nào giúp bạn nhiều nhất ở kỳ thực tập đầu tiên, vì sao?',
         'Open answer; emails (Ch.2) and meetings (Ch.4) are the most frequent in real jobs.', 'Câu trả lời mở; email (Ch.2) và họp (Ch.4) là hai việc gặp nhiều nhất khi đi làm.']] }),
  D(P + '0-2', '0.2 Textbooks and study resources', '0.2 Giáo trình và tài liệu học',
    'Sách chuẩn có ISBN đã kiểm và các nguồn học mở uy tín cho EMC201c.', {
    n: '0.2',
    g: [['Know 4 standard books and which part each one helps with', 'Biết 4 cuốn sách chuẩn và mỗi cuốn hỗ trợ phần nào'],
        ['Know free resources to practise every day', 'Biết các nguồn miễn phí để luyện hằng ngày']],
    b: [`<div class="callout"><strong>⚠️ Notice.</strong> No official EMC201c textbook is published on FLM. The books below are standard references; you do not have to buy them all. ISBNs were checked against a book catalogue on 09/11/2026.</div>
<ul><li><strong>Cotton, D., Falvey, D., Kent, S. — <em>Market Leader: Intermediate Business English, Course Book</em></strong> (Longman/Pearson). ISBN 9780582328389 (the catalogue entry I verified; newer editions have different ISBNs, so check the edition your library has). Unit-based: meetings, negotiations, presentations, telephoning. Best match for the course spine.</li>
<li><strong>Murphy, R. — <em>English Grammar in Use</em>, 5th edition, Book with answers</strong> (Cambridge University Press, 2019). ISBN 9781108457651. Fix grammar problems one page at a time.</li>
<li><strong>Meyer, E. — <em>The Culture Map: Breaking Through the Invisible Boundaries of Global Business</em></strong> (PublicAffairs). ISBN 9781610392761. Read the chapters on communicating, persuading and disagreeing across cultures (relevant to Chapter 7 here).</li>
<li><strong>Guffey, M. E., Loewy, D. — <em>Business Communication: Process and Product</em></strong> (Cengage). ISBN 9780357129234 (2021 catalogue entry; edition number not verified). For emails, reports and job-search documents.</li></ul>
<h4>Free resources</h4>
<p>British Council LearnEnglish has free reading, listening, speaking and writing lessons with a Business English hub. Digital.gov explains plain language, the habit of short, clear sentences. Wikipedia pages in each lesson are for background only; do not copy them into assignments.</p>
<h4>Daily routine (20 minutes)</h4>
<p>5 min: read one real business email or news item; 10 min: write 5 sentences using this week's phrases; 5 min: read them aloud and record yourself. Keep a "phrase bank" file: only phrases you could use tomorrow.</p>`,
       `<div class="callout"><strong>⚠️ Lưu ý.</strong> FLM không công bố giáo trình chính thức của EMC201c. Các sách dưới đây là tài liệu chuẩn, không bắt buộc mua hết. ISBN đã đối chiếu với danh mục sách ngày 09/11/2026.</div>
<ul><li><strong>Cotton, D., Falvey, D., Kent, S. — <em>Market Leader: Intermediate Business English, Course Book</em></strong> (Longman/Pearson). ISBN 9780582328389 (mục danh mục mình đã kiểm; các bản mới hơn có ISBN khác, hãy xem thư viện bạn có bản nào). Chia theo unit: họp, đàm phán, thuyết trình, gọi điện. Khớp nhất với trục của môn.</li>
<li><strong>Murphy, R. — <em>English Grammar in Use</em>, ấn bản 5, bản có đáp án</strong> (Cambridge University Press, 2019). ISBN 9781108457651. Sửa lỗi ngữ pháp từng trang một.</li>
<li><strong>Meyer, E. — <em>The Culture Map: Breaking Through the Invisible Boundaries of Global Business</em></strong> (PublicAffairs). ISBN 9781610392761. Đọc phần về giao tiếp, thuyết phục và bất đồng giữa các nền văn hoá (liên quan Chương 7 ở đây).</li>
<li><strong>Guffey, M. E., Loewy, D. — <em>Business Communication: Process and Product</em></strong> (Cengage). ISBN 9780357129234 (mục năm 2021; chưa kiểm số ấn bản). Dùng cho email, báo cáo và hồ sơ xin việc.</li></ul>
<h4>Nguồn miễn phí</h4>
<p>British Council LearnEnglish có bài đọc, nghe, nói, viết miễn phí cùng một trang Business English. Digital.gov giải thích plain language, thói quen viết câu ngắn và rõ. Các trang Wikipedia trong mỗi bài chỉ để tham khảo nền, đừng chép vào bài nộp.</p>
<h4>Thói quen mỗi ngày (20 phút)</h4>
<p>5 phút: đọc một email công việc thật hoặc một tin kinh tế; 10 phút: viết 5 câu dùng mẫu câu của tuần; 5 phút: đọc to và tự ghi âm. Giữ một file "ngân hàng mẫu câu": chỉ ghi những câu ngày mai bạn dùng được.</p>`],
    s: [['Four standard books with verified ISBNs; buy only what you need.', 'Bốn sách chuẩn có ISBN đã kiểm; chỉ mua cái cần.'],
        ['Use free British Council lessons daily.', 'Dùng bài British Council miễn phí hằng ngày.'],
        ['Keep a phrase bank of usable sentences.', 'Giữ ngân hàng mẫu câu dùng được ngay.']],
    l: ['bcBiz', 'bcWrite', 'bcSpeak', 'plainGov'],
    p: [['Create a phrase-bank file and add 5 phrases from this lesson plan.', 'Tạo file ngân hàng mẫu câu và thêm 5 mẫu câu bạn muốn dùng.',
         'Any five usable phrases, e.g. "Could you send me the file by Friday?"', 'Năm mẫu câu dùng được, ví dụ "Could you send me the file by Friday?"'],
        ['Which book would you use to fix a recurring grammar mistake?', 'Cuốn nào dùng để sửa lỗi ngữ pháp lặp lại?', 'English Grammar in Use (Murphy).', 'English Grammar in Use (Murphy).']] }),
]));

// ===== Chương 1 =====
secs.push(SEC('Chapter 1 — Professional tone and register', 'Chương 1 — Giọng điệu chuyên nghiệp và mức độ trang trọng',
  'Chọn register, viết rõ ràng, lịch sự và tránh lỗi người Việt hay gặp.', [
  D(P + '1-1', '1.1 Formal, neutral and informal English at work', '1.1 Tiếng Anh trang trọng, trung tính và thân mật nơi làm việc',
    'Phân biệt ba mức register và chọn đúng theo người đọc.', {
    n: '1.1',
    g: [['Tell formal, neutral and informal wording apart', 'Phân biệt cách nói trang trọng, trung tính và thân mật'],
        ['Choose the register for your boss, a client and a close colleague', 'Chọn mức phù hợp cho sếp, khách hàng và đồng nghiệp thân'],
        ['Rewrite a blunt sentence into a professional one', 'Viết lại câu cộc thành câu chuyên nghiệp']],
    b: [`<p><strong>Register</strong> is how formal your language is. Three levels cover 95% of work: <strong>formal</strong> (first contact with a client, official letters, complaints to management), <strong>neutral</strong> (daily emails with colleagues you do not know well, most meetings), <strong>informal</strong> (chat with a team you know well, quick messages). Mixing them is the mistake: "Hey, send me the report ASAP" to a client's director, or "I am writing to inform you that lunch is ready" to a friend.</p>
<p>Signals: contractions (<em>I'm</em>) lean informal; passive and nominal style (<em>Your request is under consideration</em>) leans formal; phrasal verbs (<em>find out, look into</em>) feel neutral to informal while Latin-based verbs (<em>ascertain, investigate</em>) feel formal. In international teams, neutral is the safe default: clear, polite, no slang, few idioms.</p>
<p>Know your reader: ask three questions. Who is it (rank, relationship)? What do I want (information, action, decision)? What is the risk (money, deadline, reputation)? The higher the risk and distance, the more formal and complete you should be.</p>`,
       `<p><strong>Register</strong> là mức độ trang trọng của ngôn ngữ. Ba mức đủ phủ 95% công việc: <strong>formal</strong> (lần liên hệ đầu với khách, thư chính thức, khiếu nại lên quản lý), <strong>neutral</strong> (email hằng ngày với đồng nghiệp chưa thân, phần lớn cuộc họp), <strong>informal</strong> (nhắn với nhóm đã thân, tin nhanh). Lỗi là trộn lẫn: "Hey, send me the report ASAP" gửi giám đốc của khách, hay "I am writing to inform you that lunch is ready" gửi bạn thân.</p>
<p>Dấu hiệu: dạng rút gọn (<em>I'm</em>) nghiêng về thân mật; văn bị động và danh từ hoá (<em>Your request is under consideration</em>) nghiêng về trang trọng; cụm động từ (<em>find out, look into</em>) trung tính đến thân mật, còn động từ gốc Latin (<em>ascertain, investigate</em>) trang trọng. Trong đội quốc tế, neutral là mặc định an toàn: rõ, lịch sự, không tiếng lóng, ít thành ngữ.</p>
<p>Biết người đọc: hỏi ba câu. Họ là ai (cấp bậc, quan hệ)? Tôi muốn gì (thông tin, hành động, quyết định)? Rủi ro là gì (tiền, hạn chót, uy tín)? Rủi ro và khoảng cách càng cao thì càng nên trang trọng và đầy đủ.</p>`],
    voc: [['register', 'level of formality of language', 'mức độ trang trọng của ngôn ngữ'], ['tone', 'the attitude your words show (friendly, firm, cold)', 'thái độ lời viết thể hiện (thân thiện, cứng rắn, lạnh)'],
          ['blunt', 'too direct, sounding rude', 'quá thẳng, nghe thô'], ['courteous', 'polite and respectful', 'lịch sự, tôn trọng'], ['slang', 'very informal words used in a group', 'tiếng lóng']],
    ph: [['I am writing to enquire about…', 'formal first contact', 'liên hệ lần đầu, trang trọng'], ['Could you let me know…?', 'neutral request', 'yêu cầu trung tính'],
         ['Just checking if you have a minute.', 'informal, close colleague', 'thân mật, đồng nghiệp gần'], ['I would appreciate your reply by Friday.', 'formal deadline', 'đặt hạn chót trang trọng']],
    dlg: { t: ['Same message, three registers', 'Cùng một nội dung, ba mức'], l: [
      ['Formal', 'I would be grateful if you could confirm the delivery date at your earliest convenience.', 'Tôi rất biết ơn nếu anh/chị xác nhận ngày giao hàng sớm nhất có thể.'],
      ['Neutral', 'Could you confirm the delivery date, please?', 'Anh/chị xác nhận giúp ngày giao hàng nhé.'],
      ['Informal', 'Hey, when is the delivery? Thanks!', 'Này, bao giờ giao vậy? Cảm ơn!']] },
    pit: [['Send me the file now.', 'Could you send me the file by 3 pm, please?', 'A bare imperative sounds like an order.', 'Câu mệnh lệnh trần nghe như ra lệnh.'],
          ['Dear friend, I want ask you.', 'Dear Ms Lan, I would like to ask you…', 'Wrong greeting for a business contact.', 'Chào sai cho đối tác công việc.'],
          ['I very like your idea.', 'I really like your idea.', 'Adverb order and word choice.', 'Sai vị trí và từ loại trạng từ.']],
    s: [['Three registers: formal, neutral, informal.', 'Ba mức: formal, neutral, informal.'], ['Neutral is the safe default in international teams.', 'Neutral là mặc định an toàn trong đội quốc tế.'], ['Match register to reader, relationship and risk.', 'Chọn mức theo người đọc, quan hệ và rủi ro.']],
    l: ['register', 'bizeng', 'bcBiz'],
    p: [['Rewrite for a client: "Tell me the price."', 'Viết lại cho khách: "Tell me the price."', 'Could you tell me the price, please? / I would appreciate it if you could send me your price.', 'Could you tell me the price, please? / I would appreciate it if you could send me your price.'],
        ['Is "Hi guys, ASAP pls" suitable for a client director?', '"Hi guys, ASAP pls" có hợp với giám đốc bên khách không?', 'No: too informal and abbreviated.', 'Không: quá thân mật và viết tắt.']] }),
  D(P + '1-2', '1.2 Clear and short: plain English for work', '1.2 Rõ và ngắn: plain English cho công việc',
    'Viết câu ngắn, chủ động, bỏ từ thừa, đặt thông tin quan trọng lên đầu.', {
    n: '1.2',
    g: [['Shorten long sentences without losing meaning', 'Rút gọn câu dài mà không mất nghĩa'], ['Use active voice and concrete verbs', 'Dùng câu chủ động và động từ cụ thể'], ['Put the main point first', 'Đặt ý chính lên đầu']],
    b: [`<p>Readers at work skim. They want the point in the first line. <strong>Plain English</strong> means: one idea per sentence (15–20 words), active voice, concrete verbs, no empty words. Vietnamese writers often start with background and reach the request in the last paragraph. In English business writing use the <strong>BLUF</strong> habit: Bottom Line Up Front.</p>
<p>Replace nominalisations with verbs: <em>make a decision</em> → <em>decide</em>; <em>give consideration to</em> → <em>consider</em>; <em>in the event that</em> → <em>if</em>. Prefer the active voice: <em>We will ship the order on Monday</em> not <em>The order will be shipped by us on Monday</em>. Passive is fine when the doer is unknown or unimportant (<em>The server was restarted</em>).</p>
<p>Use numbers and dates, not vague words: <em>soon</em> → <em>by Friday 14 November</em>; <em>a lot</em> → <em>about 200 units</em>. Use lists for three or more items. Read your message once as the receiver: can they act without asking a question?</p>`,
       `<p>Người đọc ở công sở lướt nhanh. Họ muốn thấy ý chính ngay dòng đầu. <strong>Plain English</strong> nghĩa là: một ý mỗi câu (15–20 từ), câu chủ động, động từ cụ thể, không từ thừa. Người viết Việt thường mở bằng bối cảnh rồi mới đến yêu cầu ở đoạn cuối. Trong văn bản kinh doanh tiếng Anh hãy dùng thói quen <strong>BLUF</strong>: Bottom Line Up Front, kết luận lên đầu.</p>
<p>Thay danh từ hoá bằng động từ: <em>make a decision</em> → <em>decide</em>; <em>give consideration to</em> → <em>consider</em>; <em>in the event that</em> → <em>if</em>. Ưu tiên câu chủ động: <em>We will ship the order on Monday</em> chứ không phải <em>The order will be shipped by us on Monday</em>. Bị động vẫn dùng được khi không biết hoặc không cần nói ai làm (<em>The server was restarted</em>).</p>
<p>Dùng số và ngày cụ thể, không dùng từ mơ hồ: <em>soon</em> → <em>by Friday 14 November</em>; <em>a lot</em> → <em>about 200 units</em>. Dùng danh sách khi có từ ba mục. Đọc lại tin của mình như người nhận: họ có hành động được mà không phải hỏi lại không?</p>`],
    voc: [['concise', 'short but complete', 'ngắn nhưng đủ'], ['jargon', 'special words only experts know', 'thuật ngữ chỉ chuyên gia hiểu'], ['actionable', 'clear enough to act on', 'đủ rõ để hành động'], ['bottom line', 'the main point', 'ý chính/kết luận']],
    ph: [['The short answer is yes.', 'answer first', 'trả lời trước'], ['In short, we need two more days.', 'conclusion', 'kết luận'], ['To summarise,…', 'closing a long message', 'chốt tin dài'], ['Please do X by Y.', 'clear request', 'yêu cầu rõ']],
    dlg: { t: ['Before and after', 'Trước và sau'], l: [
      ['Before', 'We would like to take this opportunity to inform you that, due to the fact that the supplier has experienced delays, the shipment will probably be late.', 'Bản dài, nhiều từ thừa.'],
      ['After', 'The shipment will arrive on 20 November, five days late, because our supplier is delayed.', 'Bản gọn: có ngày, có lý do.']] },
    pit: [['I want to ask about the thing we talked.', 'I want to ask about the pricing we discussed on Monday.', 'Vague nouns and a missing preposition.', 'Danh từ mơ hồ và thiếu giới từ.'],
          ['Please kindly help me urgently.', 'Could you help me by 3 pm today?', 'Double politeness plus no deadline.', 'Lịch sự thừa mà không có hạn chót.'],
          ['Look forward your reply.', 'I look forward to your reply.', 'Missing "to" and subject.', 'Thiếu "to" và chủ ngữ.']],
    s: [['Main point first (BLUF).', 'Ý chính trước (BLUF).'], ['Active voice, concrete verbs, numbers and dates.', 'Câu chủ động, động từ cụ thể, có số và ngày.'], ['Test: can the reader act without asking?', 'Kiểm tra: người đọc hành động được mà không phải hỏi?']],
    l: ['plain', 'plainGov', 'bcWrite'],
    p: [['Shorten: "We are in the process of making a decision regarding the matter."', 'Rút gọn: "We are in the process of making a decision regarding the matter."', 'We are deciding.', 'We are deciding.'],
        ['Make vague: "Send it soon" specific.', 'Làm cụ thể: "Send it soon".', 'Please send it by Friday 14 November, 5 pm.', 'Please send it by Friday 14 November, 5 pm.']] }),
  D(P + '1-3', '1.3 Politeness, softening and diplomatic language', '1.3 Lịch sự, nói giảm và ngôn ngữ ngoại giao',
    'Dùng modal, hedge và câu hỏi gián tiếp để yêu cầu và phản đối lịch sự.', {
    n: '1.3',
    g: [['Soften requests with modals and indirect questions', 'Làm mềm yêu cầu bằng modal và câu hỏi gián tiếp'], ['Disagree without damaging the relationship', 'Phản đối mà không làm hỏng quan hệ'], ['Avoid the common Vietnamese-English bluntness', 'Tránh sự cộc lốc thường gặp của người Việt nói tiếng Anh']],
    b: [`<p>English has many tools to protect the other person's <strong>face</strong> (their dignity). The main ones: modal verbs (<em>could, would, might</em>), indirect questions (<em>Could you tell me whether…</em>), hedges (<em>perhaps, a bit, I think, it seems</em>), and positive framing (<em>It would be even better if…</em>). Vietnamese uses pronouns and particles (<em>anh, chị, ạ, nhé</em>) to show respect; English has no such words, so politeness is carried by grammar and phrases. Without them a correct sentence sounds cold.</p>
<p>Past forms soften: <em>I wanted to ask…</em> is gentler than <em>I want to ask…</em>. Negative questions sound hesitant: <em>I wonder if you could…</em>. To disagree, use the pattern <strong>agree + but + reason</strong>: <em>That's a good point, but I'm worried about the timeline.</em> Avoid <em>No, you are wrong</em>. Use "we" to share responsibility: <em>How can we make this work?</em></p>
<p>But too many hedges hide your message. One soft word is enough: <em>I think we should move the deadline</em>, not <em>Maybe I think perhaps we could possibly consider moving it</em>.</p>`,
       `<p>Tiếng Anh có nhiều công cụ để giữ <strong>thể diện</strong> (face) cho người kia. Chính là: động từ khuyết thiếu (<em>could, would, might</em>), câu hỏi gián tiếp (<em>Could you tell me whether…</em>), từ rào đón (<em>perhaps, a bit, I think, it seems</em>) và cách nói tích cực (<em>It would be even better if…</em>). Tiếng Việt dùng đại từ và tiểu từ (<em>anh, chị, ạ, nhé</em>) để thể hiện kính trọng; tiếng Anh không có, nên sự lịch sự nằm ở ngữ pháp và cụm từ. Thiếu chúng, câu đúng vẫn nghe lạnh.</p>
<p>Thì quá khứ làm mềm câu: <em>I wanted to ask…</em> nhẹ hơn <em>I want to ask…</em>. Câu ngập ngừng: <em>I wonder if you could…</em>. Khi phản đối dùng mẫu <strong>đồng ý + but + lý do</strong>: <em>That's a good point, but I'm worried about the timeline.</em> Tránh <em>No, you are wrong</em>. Dùng "we" để chia sẻ trách nhiệm: <em>How can we make this work?</em></p>
<p>Nhưng rào đón quá nhiều sẽ giấu mất thông điệp. Một từ mềm là đủ: <em>I think we should move the deadline</em>, đừng viết <em>Maybe I think perhaps we could possibly consider moving it</em>.</p>`],
    voc: [['diplomatic', 'careful not to offend', 'khéo léo, không làm mất lòng'], ['hedge', 'a soft word like "perhaps"', 'từ rào đón như "perhaps"'], ['concern', 'a worry', 'điều lo ngại'], ['push back', 'disagree politely', 'phản biện lịch sự']],
    ph: [['Would you mind sending…?', 'polite request', 'yêu cầu lịch sự'], ['I see your point, however…', 'polite disagreement', 'phản đối lịch sự'], ['I am afraid we cannot…', 'polite refusal', 'từ chối lịch sự'], ['Would it be possible to…?', 'asking for a favour', 'nhờ vả'], ['I may have misunderstood, but…', 'correcting gently', 'sửa nhẹ nhàng']],
    dlg: { t: ['Pushing back on a deadline', 'Phản biện hạn chót'], l: [
      ['Manager', 'We need the prototype by Friday.', 'Chúng ta cần bản mẫu trước thứ Sáu.'],
      ['Mai', 'I understand it is urgent, but I am afraid Friday may be difficult because testing takes two days.', 'Em hiểu là gấp, nhưng e rằng thứ Sáu khó vì kiểm thử mất hai ngày.'],
      ['Manager', 'What would be realistic?', 'Vậy thực tế là khi nào?'],
      ['Mai', 'Would Tuesday work? If we start today, I can promise a first version on Friday.', 'Thứ Ba được không ạ? Nếu bắt đầu hôm nay, em hứa có bản đầu vào thứ Sáu.']] },
    pit: [['You are wrong.', 'I see it a little differently.', 'Direct contradiction attacks the person.', 'Phản bác thẳng công kích người nói.'],
          ['I want a discount.', 'Would it be possible to get a discount?', 'Want-sentences sound demanding.', 'Câu "want" nghe như đòi hỏi.'],
          ['Please kindly to send me.', 'Could you please send me…?', 'Do not combine please/kindly with "to".', 'Đừng ghép please/kindly với "to".']],
    s: [['Use modals and indirect questions to request.', 'Dùng modal và câu hỏi gián tiếp khi yêu cầu.'], ['Disagree with agree + but + reason.', 'Phản đối bằng đồng ý + but + lý do.'], ['One hedge is enough.', 'Một từ rào đón là đủ.']],
    l: ['polite', 'hedge', 'modal', 'face'],
    p: [['Make polite: "Give me your phone number."', 'Làm lịch sự: "Give me your phone number."', 'Could I have your phone number, please?', 'Could I have your phone number, please?'],
        ['Soften: "That idea will not work."', 'Làm mềm: "That idea will not work."', 'I am not sure that idea will work because…', 'I am not sure that idea will work because…']] }),
  Q(P + 'quiz-1', 'Quiz — Chapter 1: Tone and register', 'Quiz — Chương 1: Giọng điệu và mức trang trọng', [
    ['Which sentence is the most formal?|||Câu nào trang trọng nhất?', ['Send me the file.', 'Can you send the file?', 'I would be grateful if you could forward the file.', 'Gimme the file.'], 2, 'Conditional + polite verb = formal.|||Câu điều kiện + động từ lịch sự = trang trọng.'],
    ['The safest default register for international teams is…|||Mức an toàn mặc định cho đội quốc tế là…', ['formal', 'neutral', 'slang', 'very informal'], 1, 'Neutral: clear and polite, no slang.|||Neutral: rõ, lịch sự, không lóng.'],
    ['BLUF means…|||BLUF nghĩa là…', ['Background first|||Bối cảnh trước', 'Bottom line up front|||Kết luận lên đầu', 'Be late until Friday|||Trễ đến thứ Sáu', 'Brief long unusual facts|||Tóm tắt sự kiện dài'], 1, 'State the main point first.|||Nêu ý chính trước.'],
    ['Best rewrite of "make a decision":|||Cách viết lại tốt nhất của "make a decision":', ['decide', 'do decision', 'decision it', 'to be deciding'], 0, 'Verb instead of nominalisation.|||Dùng động từ thay vì danh từ hoá.'],
    ['Which is vague?|||Câu nào mơ hồ?', ['by Friday 14 November', 'soon', 'about 200 units', 'at 3 pm'], 1, '"Soon" has no date.|||"Soon" không có ngày.'],
    ['A polite way to disagree:|||Cách phản đối lịch sự:', ['No, you are wrong.', 'That is stupid.', 'That is a good point, but I am worried about the timeline.', 'Impossible.'], 2, 'Agree + but + reason.|||Đồng ý + but + lý do.'],
    ['Which is correct?|||Câu nào đúng?', ['I look forward your reply.', 'I look forward to your reply.', 'I look forward for your reply.', 'I looking forward your reply.'], 1, 'Look forward TO + noun.|||Look forward TO + danh từ.'],
    ['Too many hedges…|||Quá nhiều từ rào đón…', ['make the message clearer|||làm tin rõ hơn', 'hide the message|||che mất thông điệp', 'are required|||là bắt buộc', 'are formal grammar|||là ngữ pháp trang trọng'], 1, 'One soft word is enough.|||Một từ mềm là đủ.'],
  ]),
]));
// ===== Chương 2 =====
secs.push(SEC('Chapter 2 — Business emails', 'Chương 2 — Email công việc',
  'Cấu trúc email, yêu cầu, trả lời, nhắc việc, khiếu nại và xin lỗi.', [
  D(P + '2-1', '2.1 Structure of a professional email', '2.1 Cấu trúc một email chuyên nghiệp',
    'Tiêu đề, lời chào, mở đầu, nội dung, kết thúc và chữ ký.', {
    n: '2.1',
    g: [['Write a clear subject line', 'Viết tiêu đề rõ ràng'], ['Use the 5-part email structure', 'Dùng cấu trúc email 5 phần'], ['Choose greetings and sign-offs by register', 'Chọn lời chào và lời kết theo mức trang trọng']],
    b: [`<p>A good email has five parts: <strong>1 subject line</strong>, <strong>2 greeting</strong>, <strong>3 opening line</strong> (why you write), <strong>4 body</strong> (details, one paragraph per idea), <strong>5 closing</strong> (next step + sign-off + signature). The subject line is the most important: it decides whether the email is opened and found later. Use a topic plus an action or date: <em>Invoice 1042 – payment confirmation needed by 20 Nov</em>, not <em>Hello</em> or <em>Urgent!!!</em>.</p>
<p>Greeting: <em>Dear Mr Smith</em> (formal, surname), <em>Dear Ms Lan</em> (use Ms if you do not know marital status; Mrs/Miss only if told), <em>Hello Anna</em> or <em>Hi Anna</em> (neutral to informal). Vietnamese names: family name is usually first (Nguyễn Văn An) but people are addressed by the given name (<em>Mr An</em>). If you are unsure, copy how the person signs.</p>
<p>Closing: <em>Best regards</em> / <em>Kind regards</em> (neutral), <em>Yours sincerely</em> (formal, with a name), <em>Thanks</em> (informal). End with a clear next step: <em>Could you reply by Thursday?</em> Add a signature with your name, role, company and phone. Keep the email short enough to read on a phone.</p>`,
       `<p>Một email tốt có năm phần: <strong>1 tiêu đề</strong>, <strong>2 lời chào</strong>, <strong>3 câu mở</strong> (vì sao bạn viết), <strong>4 nội dung</strong> (chi tiết, mỗi đoạn một ý), <strong>5 kết</strong> (bước tiếp theo + lời kết + chữ ký). Tiêu đề quan trọng nhất: nó quyết định email có được mở và tìm lại được không. Dùng chủ đề cộng hành động hoặc ngày: <em>Invoice 1042 – payment confirmation needed by 20 Nov</em>, đừng viết <em>Hello</em> hay <em>Urgent!!!</em>.</p>
<p>Lời chào: <em>Dear Mr Smith</em> (trang trọng, họ), <em>Dear Ms Lan</em> (dùng Ms nếu không biết tình trạng hôn nhân; Mrs/Miss chỉ khi được cho biết), <em>Hello Anna</em> hay <em>Hi Anna</em> (trung tính đến thân mật). Tên Việt: họ đứng trước (Nguyễn Văn An) nhưng gọi bằng tên (<em>Mr An</em>). Nếu không chắc, hãy theo cách người đó tự ký tên.</p>
<p>Lời kết: <em>Best regards</em> / <em>Kind regards</em> (trung tính), <em>Yours sincerely</em> (trang trọng, có tên người nhận), <em>Thanks</em> (thân mật). Kết bằng bước tiếp theo rõ ràng: <em>Could you reply by Thursday?</em> Thêm chữ ký có tên, chức vụ, công ty, số điện thoại. Giữ email đủ ngắn để đọc trên điện thoại.</p>`],
    voc: [['subject line', 'the title of an email', 'tiêu đề email'], ['sign-off', 'the closing words before your name', 'lời kết trước tên'], ['signature', 'your name and contact details at the end', 'chữ ký (tên, liên hệ) cuối email'], ['attachment', 'a file sent with the email', 'tệp đính kèm'], ['recipient', 'the person who receives it', 'người nhận']],
    ph: [['I am writing to…', 'opening, formal-neutral', 'mở đầu trang trọng-trung tính'], ['Thank you for your email of 5 November.', 'reply opening', 'mở đầu khi trả lời'], ['Please find attached…', 'sending a file', 'gửi tệp'], ['I look forward to hearing from you.', 'closing', 'kết thư'], ['Best regards, Lan Pham', 'sign-off', 'lời kết và tên']],
    dlg: { t: ['Model email', 'Email mẫu'], l: [
      ['Subject', 'Meeting request – project timeline, 18 Nov', 'Tiêu đề: đề nghị họp – tiến độ dự án, 18/11'],
      ['Body', 'Dear Mr Hall, I am writing to arrange a short meeting about the project timeline. Would Tuesday 18 November at 10 am (Vietnam time) suit you? The call should take 30 minutes. Please find attached the draft schedule. Could you confirm by Friday? Kind regards, Lan Pham, Project Coordinator, ABC Software, +84 90 000 0000', 'Kính gửi anh Hall, tôi viết để sắp xếp một cuộc họp ngắn về tiến độ dự án. Thứ Ba 18/11 lúc 10 giờ sáng (giờ Việt Nam) có phù hợp không? Cuộc họp khoảng 30 phút. Đính kèm là lịch dự thảo. Anh xác nhận giúp trước thứ Sáu được không?']] },
    pit: [['Dear Sir/Madam, (to a named person)', 'Dear Mr Hall,', 'Use the name when you have it.', 'Có tên thì dùng tên.'],
          ['Sent you the file in attachment.', 'I have attached the file. / Please find the file attached.', 'Use "attached", not "in attachment".', 'Dùng "attached", không phải "in attachment".'],
          ['Best regard', 'Best regards', 'Plural "regards".', '"regards" số nhiều.']],
    s: [['Five parts: subject, greeting, opening, body, closing.', 'Năm phần: tiêu đề, chào, mở, nội dung, kết.'], ['Subject = topic + action/date.', 'Tiêu đề = chủ đề + hành động/ngày.'], ['Always end with the next step.', 'Luôn kết bằng bước tiếp theo.']],
    l: ['email', 'esig', 'netiq', 'bcWrite'],
    p: [['Write a subject line for asking a colleague for last month\'s sales report by Friday.', 'Viết tiêu đề xin đồng nghiệp báo cáo doanh số tháng trước trước thứ Sáu.', 'Sales report for October – needed by Friday', 'Sales report for October – needed by Friday'],
        ['Correct: "Best regard, Lan".', 'Sửa: "Best regard, Lan".', 'Best regards, Lan', 'Best regards, Lan']] }),
  D(P + '2-2', '2.2 Requests, replies and follow-ups', '2.2 Yêu cầu, trả lời và nhắc việc',
    'Viết yêu cầu rõ ràng, trả lời đủ ý và nhắc việc không gây khó chịu.', {
    n: '2.2',
    g: [['Make a clear request with a deadline', 'Đưa yêu cầu rõ ràng có hạn chót'], ['Reply with answer, reason and next step', 'Trả lời có câu trả lời, lý do và bước tiếp'], ['Send a polite reminder', 'Gửi nhắc việc lịch sự']],
    b: [`<p><strong>Request.</strong> Formula: context (one line) + request + deadline + reason. <em>We are preparing the Q4 report. Could you send the sales figures by Wednesday? I need them to finish the draft on Thursday.</em> Giving a reason makes people cooperate. Ask for one thing per email, or number the items.</p>
<p><strong>Reply.</strong> Answer the question in the first line (<em>Yes, we can deliver on the 20th</em>), then add detail. Thank the sender only once. If you need more time, say when you will answer: <em>I will get back to you by Friday.</em> Never leave an email unanswered for more than one working day; a short "received, will reply Friday" is enough.</p>
<p><strong>Follow-up.</strong> Wait the agreed time, then write: <em>I am following up on my email of 10 November.</em> Keep the original thread so the reader sees the history; restate the request in one line and offer help. Escalate gently: <em>In case it is useful, I have attached the file again.</em> Avoid <em>As I said before</em> (sounds angry).</p>`,
       `<p><strong>Yêu cầu.</strong> Công thức: bối cảnh (một dòng) + yêu cầu + hạn chót + lý do. <em>We are preparing the Q4 report. Could you send the sales figures by Wednesday? I need them to finish the draft on Thursday.</em> Có lý do thì người ta hợp tác hơn. Mỗi email chỉ xin một việc, hoặc đánh số các mục.</p>
<p><strong>Trả lời.</strong> Trả lời câu hỏi ngay dòng đầu (<em>Yes, we can deliver on the 20th</em>), rồi thêm chi tiết. Chỉ cảm ơn một lần. Nếu cần thêm thời gian, nói khi nào bạn trả lời: <em>I will get back to you by Friday.</em> Đừng để email không hồi âm quá một ngày làm việc; một dòng "đã nhận, sẽ trả lời thứ Sáu" là đủ.</p>
<p><strong>Nhắc việc.</strong> Chờ đủ thời gian đã hẹn rồi viết: <em>I am following up on my email of 10 November.</em> Giữ nguyên chuỗi thư để người đọc thấy lịch sử; nhắc lại yêu cầu trong một dòng và đề nghị giúp đỡ. Tăng mức nhẹ nhàng: <em>In case it is useful, I have attached the file again.</em> Tránh <em>As I said before</em> (nghe như bực).</p>`],
    voc: [['deadline', 'last time to finish', 'hạn chót'], ['follow up', 'contact again about something', 'liên hệ lại về việc'], ['reminder', 'a message to remember something', 'lời nhắc'], ['get back to', 'reply later', 'phản hồi sau'], ['in the loop', 'kept informed', 'được cập nhật thông tin']],
    ph: [['Could you send me… by…?', 'request', 'yêu cầu'], ['I would be grateful if you could…', 'formal request', 'yêu cầu trang trọng'], ['Just a quick reminder that…', 'gentle reminder', 'nhắc nhẹ'], ['Thanks for your patience.', 'after a delay', 'sau khi để chờ'], ['Please keep me in the loop.', 'asking for updates', 'xin được cập nhật']],
    dlg: { t: ['Request, reply and reminder', 'Yêu cầu, trả lời, nhắc việc'], l: [
      ['Mon', 'Hi Tom, we are updating the price list. Could you send me the new costs by Wednesday? Thanks, Lan', 'Chào Tom, bên mình đang cập nhật bảng giá. Anh gửi giúp chi phí mới trước thứ Tư nhé.'],
      ['Mon', 'Hi Lan, received. I will send them on Wednesday morning. Tom', 'Đã nhận, mình sẽ gửi sáng thứ Tư.'],
      ['Thu', 'Hi Tom, just a quick reminder about the new costs. I need them to finish the list today. Could you send them by 3 pm? Thanks, Lan', 'Nhắc nhanh về chi phí mới; tôi cần chúng để xong bảng giá hôm nay, anh gửi trước 3 giờ chiều được không?']] },
    pit: [['Please reply me soon.', 'Please reply by Friday.', '"Reply me" is wrong; "reply to me" or just "reply".', '"Reply me" sai; dùng "reply to me" hoặc "reply".'],
          ['I remind you again.', 'This is a friendly reminder.', 'Sounds like blame.', 'Nghe như trách móc.'],
          ['Waiting for your feedback.', 'I look forward to your feedback.', 'Sounds impatient and incomplete.', 'Nghe sốt ruột và thiếu câu.']],
    s: [['Request = context + ask + deadline + reason.', 'Yêu cầu = bối cảnh + việc + hạn chót + lý do.'], ['Answer first, then details.', 'Trả lời trước, chi tiết sau.'], ['Follow up politely and keep the thread.', 'Nhắc lịch sự và giữ chuỗi thư.']],
    l: ['email', 'netiq', 'polite', 'bcWrite'],
    p: [['Write a request: you need the contract draft by Thursday for a Friday meeting.', 'Viết yêu cầu: cần bản thảo hợp đồng trước thứ Năm cho cuộc họp thứ Sáu.', 'Could you send the contract draft by Thursday? I need it for Friday\'s meeting.', 'Could you send the contract draft by Thursday? I need it for Friday\'s meeting.'],
        ['Write a polite reminder for an unanswered request.', 'Viết lời nhắc lịch sự cho yêu cầu chưa được trả lời.', 'Just a quick reminder about my request of 10 November. Could you let me know by Friday?', 'Just a quick reminder about my request of 10 November. Could you let me know by Friday?']] }),
  D(P + '2-3', '2.3 Complaints, apologies and difficult messages', '2.3 Khiếu nại, xin lỗi và tin khó viết',
    'Viết khiếu nại giữ lịch sự, xin lỗi đúng cách và từ chối khéo.', {
    n: '2.3',
    g: [['Write a firm but polite complaint', 'Viết khiếu nại cứng rắn nhưng lịch sự'], ['Apologise and offer a solution', 'Xin lỗi và đưa giải pháp'], ['Say no politely', 'Từ chối khéo']],
    b: [`<p><strong>Complaint.</strong> Structure: problem (facts) → impact → what you want. Use facts, dates and order numbers; avoid emotion words. <em>The goods we received on 5 November (order 2217) were 20 units short. This delays our production. Please send the missing units by 15 November or issue a credit note.</em> Say what you expect and by when. End calmly: <em>I would appreciate your prompt attention.</em></p>
<p><strong>Apology.</strong> Four parts: say sorry once, explain briefly (no excuses), say what you will do, prevent next time. <em>I apologise for the delay. The supplier shipped late. We have sent the order by express, and we now check suppliers weekly.</em> <em>Sorry</em> is common; <em>I apologise</em> and <em>please accept our apologies</em> are more formal. Do not apologise five times.</p>
<p><strong>Saying no.</strong> Use thanks + reason + alternative: <em>Thank you for the offer. Unfortunately we cannot accept this price because costs have risen. We could offer 5% off for an order of 500 units.</em> A clear no with an option keeps the relationship. In Vietnamese a direct "no" can feel rude, but in international email a vague reply wastes time.</p>`,
       `<p><strong>Khiếu nại.</strong> Cấu trúc: vấn đề (sự kiện) → ảnh hưởng → điều bạn muốn. Dùng sự kiện, ngày, mã đơn hàng; tránh từ cảm xúc. <em>The goods we received on 5 November (order 2217) were 20 units short. This delays our production. Please send the missing units by 15 November or issue a credit note.</em> Nói rõ bạn mong gì và khi nào. Kết bình tĩnh: <em>I would appreciate your prompt attention.</em></p>
<p><strong>Xin lỗi.</strong> Bốn phần: xin lỗi một lần, giải thích ngắn (không viện cớ), nói bạn sẽ làm gì, phòng ngừa lần sau. <em>I apologise for the delay. The supplier shipped late. We have sent the order by express, and we now check suppliers weekly.</em> <em>Sorry</em> thông dụng; <em>I apologise</em> và <em>please accept our apologies</em> trang trọng hơn. Đừng xin lỗi năm lần.</p>
<p><strong>Từ chối.</strong> Dùng cảm ơn + lý do + phương án khác: <em>Thank you for the offer. Unfortunately we cannot accept this price because costs have risen. We could offer 5% off for an order of 500 units.</em> Từ chối rõ ràng kèm lựa chọn giữ được quan hệ. Trong tiếng Việt "không" thẳng có thể thô, nhưng trong email quốc tế, trả lời lập lờ chỉ tốn thời gian.</p>`],
    voc: [['complaint', 'a statement that something is wrong', 'khiếu nại'], ['refund', 'money returned', 'hoàn tiền'], ['credit note', 'document reducing what a customer owes', 'giấy ghi có/giảm trừ'], ['inconvenience', 'trouble caused', 'sự bất tiện'], ['unfortunately', 'sadly; introduces bad news', 'rất tiếc (mở đầu tin xấu)']],
    ph: [['I am writing to complain about…', 'complaint', 'khiếu nại'], ['I apologise for any inconvenience.', 'apology', 'xin lỗi'], ['We will look into this immediately.', 'promise action', 'cam kết xử lý'], ['Unfortunately, we are unable to…', 'refusal', 'từ chối'], ['I hope this resolves the issue.', 'closing', 'kết thúc']],
    dlg: { t: ['Complaint and reply', 'Khiếu nại và trả lời'], l: [
      ['Customer', 'Dear Ms Green, the printer we ordered (order 2217) arrived with a broken screen. Please arrange a replacement by 15 November, or we will have to cancel the order. Regards, Nam Tran', 'Máy in bị vỡ màn hình; xin đổi trước 15/11, nếu không sẽ huỷ đơn.'],
      ['Supplier', 'Dear Mr Tran, I am sorry about the damage. We will send a replacement by express tomorrow and will arrange collection of the broken unit. Please accept our apologies for the inconvenience. Kind regards, Anna Green', 'Xin lỗi vì hư hỏng; sẽ gửi máy thay thế bằng chuyển phát nhanh vào ngày mai và nhận lại máy hỏng.']] },
    pit: [['I am very angry with your service.', 'I am disappointed that the delivery was late.', 'Emotion attacks; facts persuade.', 'Cảm xúc công kích; sự kiện thuyết phục.'],
          ['We cannot, sorry.', 'Unfortunately we are unable to… However, we could…', 'Too short, no option.', 'Quá cộc, không có phương án.'],
          ['Sorry sorry for the mistake very much.', 'I apologise for the mistake.', 'One clear apology is enough.', 'Một lời xin lỗi rõ là đủ.']],
    s: [['Complaint = facts + impact + request.', 'Khiếu nại = sự kiện + ảnh hưởng + yêu cầu.'], ['Apology = sorry + brief reason + action + prevention.', 'Xin lỗi = xin lỗi + lý do + hành động + phòng ngừa.'], ['Say no with a reason and an option.', 'Từ chối kèm lý do và phương án.']],
    l: ['complaint', 'cs', 'polite', 'bcWrite'],
    p: [['Write the key sentence of a complaint: 5 laptops arrived without chargers on 6 November.', 'Viết câu chính của khiếu nại: ngày 6/11 5 laptop đến không có sạc.', 'Five of the laptops delivered on 6 November came without chargers. Please send them by 14 November.', 'Five of the laptops delivered on 6 November came without chargers. Please send them by 14 November.'],
        ['Refuse a request to extend the deadline, offering an alternative.', 'Từ chối gia hạn hạn chót, đưa phương án.', 'Unfortunately we cannot extend the deadline, but we can accept a partial delivery by Friday.', 'Unfortunately we cannot extend the deadline, but we can accept a partial delivery by Friday.']] }),
  D(P + '2-4', '2.4 Email etiquette: CC, reply-all, attachments, tone online', '2.4 Phép lịch sự email: CC, reply-all, đính kèm, giọng điệu',
    'Dùng To/CC/BCC đúng, đặt tên tệp, tránh hiểu lầm và quản lý hộp thư.', {
    n: '2.4',
    g: [['Use To, CC and BCC correctly', 'Dùng To, CC, BCC đúng'], ['Avoid common reply-all and attachment mistakes', 'Tránh lỗi reply-all và đính kèm'], ['Read tone in written messages', 'Đọc giọng điệu trong tin viết']],
    b: [`<p><strong>To / CC / BCC.</strong> <em>To</em> = people who must act. <em>CC</em> (carbon copy) = people who should know. <em>BCC</em> = hidden recipients, used for large lists so addresses are not shown, never to secretly show gossip. Add a manager in CC with care: it can feel like a threat. Say why: <em>I am copying Mr Hall so he is informed.</em></p>
<p><strong>Reply-all.</strong> Use it only when everyone needs your answer. A "Thanks!" to 40 people is noise. Before sending, check three things: the recipient list, the attachment (did you attach it?), and the tone. Name files clearly: <em>2025-11_Sales_Report_v2.pdf</em>, not <em>final_final2.docx</em>. Mention the attachment in the text and check its size; use a link for large files.</p>
<p><strong>Tone online.</strong> Writing has no face or voice, so short replies sound cold. CAPITAL LETTERS read as shouting; too many exclamation marks look unprofessional; sarcasm and jokes often fail across cultures. Out-of-office replies should give dates and a contact: <em>I am away from 20 to 24 November. For urgent matters contact Ms Lan.</em> Never write something in email you would not say to the person's face; emails are stored and forwarded.</p>`,
       `<p><strong>To / CC / BCC.</strong> <em>To</em> = người phải hành động. <em>CC</em> (bản sao) = người nên biết. <em>BCC</em> = người nhận ẩn, dùng cho danh sách dài để không lộ địa chỉ, không dùng để lén đưa người khác đọc chuyện. Thêm quản lý vào CC cần thận trọng: có thể bị hiểu là đe doạ. Hãy nói lý do: <em>I am copying Mr Hall so he is informed.</em></p>
<p><strong>Reply-all.</strong> Chỉ dùng khi mọi người cần đọc câu trả lời. Một "Thanks!" gửi 40 người là rác. Trước khi gửi kiểm ba thứ: danh sách người nhận, tệp đính kèm (đã đính chưa?), giọng điệu. Đặt tên tệp rõ: <em>2025-11_Sales_Report_v2.pdf</em>, không phải <em>final_final2.docx</em>. Nhắc tệp trong nội dung và kiểm dung lượng; tệp lớn thì gửi link.</p>
<p><strong>Giọng điệu online.</strong> Chữ viết không có mặt và giọng nên trả lời cộc nghe lạnh. CHỮ IN HOA bị đọc như quát; nhiều dấu chấm than trông thiếu chuyên nghiệp; mỉa mai và đùa hay thất bại giữa các nền văn hoá. Thư tự động vắng mặt nên có ngày và người liên hệ: <em>I am away from 20 to 24 November. For urgent matters contact Ms Lan.</em> Đừng viết trong email điều bạn không dám nói trước mặt; email được lưu và chuyển tiếp.</p>`],
    voc: [['CC', 'copy to someone who should be informed', 'gửi bản sao cho người cần biết'], ['BCC', 'blind copy; hidden recipient', 'bản sao ẩn'], ['reply-all', 'reply to everyone on the email', 'trả lời tất cả'], ['out-of-office', 'automatic reply when absent', 'thư tự động khi vắng'], ['forward', 'send a received email to someone else', 'chuyển tiếp']],
    ph: [['I am copying… for information.', 'explaining CC', 'giải thích CC'], ['Please find the file attached (2 MB).', 'attachment', 'đính kèm'], ['Removing X from this thread.', 'tidy thread', 'bỏ người khỏi chuỗi'], ['Apologies for the earlier email sent in error.', 'wrong send', 'gửi nhầm'], ['I am out of the office until…', 'auto reply', 'thư vắng mặt']],
    dlg: { t: ['Out-of-office reply', 'Thư vắng mặt'], l: [
      ['Auto-reply', 'Thank you for your email. I am out of the office from 20 to 24 November with limited access to email. For urgent matters, please contact Ms Lan Pham (lan@example.com). I will reply when I return on 25 November. Best regards, Minh', 'Cảm ơn email. Tôi vắng từ 20–24/11, ít truy cập email. Việc gấp xin liên hệ chị Lan Pham. Tôi sẽ trả lời khi trở lại ngày 25/11.']] },
    pit: [['See attached file (no file attached).', 'Always check the attachment before sending.', 'The most common email mistake.', 'Lỗi email phổ biến nhất.'],
          ['URGENT!!! PLEASE REPLY!!!', 'Could you reply by 3 pm? It is urgent because…', 'Caps and many marks sound rude.', 'Chữ hoa và dấu chấm than nhiều nghe thô.'],
          ['Reply-all with "OK".', 'Reply only to the sender.', 'Do not spam the whole list.', 'Đừng làm phiền cả danh sách.']],
    s: [['To = act, CC = know, BCC = hidden.', 'To = hành động, CC = biết, BCC = ẩn.'], ['Check recipients, attachment, tone before sending.', 'Kiểm người nhận, đính kèm, giọng điệu trước khi gửi.'], ['Write nothing you would not say face to face.', 'Không viết điều không dám nói trực tiếp.']],
    l: ['netiq', 'email', 'cold', 'bcBiz'],
    p: [['Write an out-of-office reply for 3 days with a contact.', 'Viết thư vắng mặt 3 ngày kèm người liên hệ.', 'Thank you for your email. I am out of the office from 3 to 5 December. For urgent matters, please contact [name]. I will reply on 8 December.', 'Thank you for your email. I am out of the office from 3 to 5 December. For urgent matters, please contact [name]. I will reply on 8 December.'],
        ['When is reply-all correct?', 'Khi nào dùng reply-all là đúng?', 'Only when everyone needs the answer.', 'Chỉ khi mọi người cần đọc câu trả lời.']] }),
  Q(P + 'quiz-2', 'Quiz — Chapter 2: Business emails', 'Quiz — Chương 2: Email công việc', [
    ['Best subject line:|||Tiêu đề tốt nhất:', ['Hello', 'URGENT!!!', 'Invoice 1042 – payment confirmation needed by 20 Nov', 'Question'], 2, 'Topic + action/date.|||Chủ đề + hành động/ngày.'],
    ['Which sign-off is formal with a name?|||Lời kết nào trang trọng khi có tên người nhận?', ['Cheers', 'Yours sincerely', 'See ya', 'Thx'], 1, 'Dear Mr X ... Yours sincerely.|||Dear Mr X ... Yours sincerely.'],
    ['Correct sentence:|||Câu đúng:', ['Please find the file in attachment.', 'Please find the file attached.', 'I attach in this email file.', 'See the attached in file.'], 1, '"attached" after the noun.|||"attached" sau danh từ.'],
    ['A reply should…|||Một email trả lời nên…', ['start with the answer|||bắt đầu bằng câu trả lời', 'start with a long history|||bắt đầu bằng lịch sử dài', 'avoid the question|||né câu hỏi', 'be left for a week|||để cả tuần'], 0, 'Answer first.|||Trả lời trước.'],
    ['A polite reminder:|||Lời nhắc lịch sự:', ['As I said before, answer me.', 'Just a quick reminder about my request of 10 November.', 'Why no reply?', 'You forgot again.'], 1, 'Friendly and specific.|||Thân thiện và cụ thể.'],
    ['A good complaint contains…|||Một khiếu nại tốt gồm…', ['facts, impact, request|||sự kiện, ảnh hưởng, yêu cầu', 'insults|||lời lăng mạ', 'only feelings|||chỉ cảm xúc', 'no deadline|||không hạn chót'], 0, 'Facts persuade.|||Sự kiện thuyết phục.'],
    ['BCC means…|||BCC nghĩa là…', ['bold copy|||bản sao in đậm', 'blind copy|||bản sao ẩn', 'business copy|||bản sao kinh doanh', 'back copy|||bản sao lùi'], 1, 'Recipients are hidden.|||Người nhận bị ẩn.'],
    ['Reply-all should be used…|||Reply-all nên dùng…', ['always|||luôn luôn', 'only when all need the answer|||chỉ khi mọi người cần đọc', 'for "thanks"|||để nói "thanks"', 'to hide mistakes|||để giấu lỗi'], 1, 'Avoid noise.|||Tránh làm ồn.'],
  ]),
]));

// ===== Chương 3 =====
secs.push(SEC('Chapter 3 — Phone and video calls', 'Chương 3 — Điện thoại và họp video',
  'Mở đầu và kết thúc cuộc gọi, hỏi lại, ghi lời nhắn, họp video chuyên nghiệp.', [
  D(P + '3-1', '3.1 Telephoning: opening, asking and closing', '3.1 Gọi điện: mở đầu, hỏi và kết thúc',
    'Chào, xưng tên, nói lý do, hỏi lại và đóng cuộc gọi.', {
    n: '3.1',
    g: [['Open a call and state your purpose', 'Mở cuộc gọi và nêu mục đích'], ['Ask for repetition and spell names', 'Xin nhắc lại và đánh vần tên'], ['Close a call politely', 'Kết thúc cuộc gọi lịch sự']],
    b: [`<p>On the phone you have only your voice, so structure helps. <strong>Answering:</strong> company + name + offer help: <em>ABC Software, Lan speaking. How can I help you?</em> <strong>Calling:</strong> <em>Good morning, this is Lan Pham from ABC Software. Could I speak to Mr Hall, please?</em> Say who you are and why you call in one breath. If the person is not available: <em>Could you ask him to call me back?</em></p>
<p><strong>Asking for clarity.</strong> Do not guess. Use: <em>Sorry, could you say that again?</em>, <em>Could you speak a bit more slowly?</em>, <em>Let me check I have understood: the meeting is on 18 November at 10, correct?</em> Spell names with the international code: A as in Alpha, B as in Bravo (or simple words) and numbers one by one: <em>0-9-0-1-2</em>. Confirm key numbers and dates by repeating them, then by email.</p>
<p><strong>Closing.</strong> Summarise next steps, thank, and say goodbye: <em>So I will send the quote today and you will confirm by Friday. Thank you for your time. Goodbye.</em> Stress and intonation matter: falling tone sounds certain, rising tone sounds like a question. Smile as you speak; it changes your voice.</p>`,
       `<p>Qua điện thoại bạn chỉ có giọng nói, nên cấu trúc rất giúp ích. <strong>Nghe máy:</strong> công ty + tên + đề nghị giúp: <em>ABC Software, Lan speaking. How can I help you?</em> <strong>Gọi đi:</strong> <em>Good morning, this is Lan Pham from ABC Software. Could I speak to Mr Hall, please?</em> Nói mình là ai và gọi vì sao trong một hơi. Nếu người đó vắng: <em>Could you ask him to call me back?</em></p>
<p><strong>Hỏi cho rõ.</strong> Đừng đoán. Dùng: <em>Sorry, could you say that again?</em>, <em>Could you speak a bit more slowly?</em>, <em>Let me check I have understood: the meeting is on 18 November at 10, correct?</em> Đánh vần tên bằng bảng chữ quốc tế: A as in Alpha, B as in Bravo (hoặc từ đơn giản) và đọc số từng chữ: <em>0-9-0-1-2</em>. Xác nhận số và ngày quan trọng bằng cách nhắc lại, sau đó gửi email.</p>
<p><strong>Kết thúc.</strong> Tóm tắt bước tiếp theo, cảm ơn, chào tạm biệt: <em>So I will send the quote today and you will confirm by Friday. Thank you for your time. Goodbye.</em> Trọng âm và ngữ điệu rất quan trọng: giọng xuống nghe chắc chắn, giọng lên nghe như câu hỏi. Hãy mỉm cười khi nói; giọng sẽ khác đi.</p>`],
    voc: [['put through', 'connect a call', 'nối máy'], ['hold on', 'wait a moment', 'chờ một chút'], ['call back', 'phone again later', 'gọi lại'], ['extension', 'internal phone number', 'số máy lẻ'], ['reception', 'front desk', 'lễ tân']],
    ph: [['Could I speak to…?', 'asking for someone', 'xin gặp ai'], ['I am calling about…', 'purpose', 'nêu mục đích'], ['Could you hold on a moment?', 'make wait', 'nhờ chờ'], ['Could you spell that, please?', 'spelling', 'xin đánh vần'], ['Thanks for calling.', 'closing', 'kết thúc']],
    dlg: { t: ['Booking a meeting by phone', 'Hẹn họp qua điện thoại'], l: [
      ['Receptionist', 'ABC Software, good morning. How can I help?', 'ABC Software xin chào, tôi giúp được gì?'],
      ['Caller', 'Good morning, this is Nam from Delta Trading. Could I speak to Ms Lan Pham, please?', 'Xin chào, tôi là Nam từ Delta Trading, cho tôi gặp chị Lan Pham.'],
      ['Receptionist', 'One moment, I will put you through.', 'Xin chờ, tôi nối máy.'],
      ['Lan', 'Lan Pham speaking.', 'Lan Pham nghe đây.'],
      ['Nam', 'Hello Lan, I am calling about the delivery date. Could we meet on Tuesday?', 'Chào Lan, tôi gọi về ngày giao hàng. Mình gặp thứ Ba được không?']] },
    pit: [['I am Nam. (on the phone)', 'This is Nam. / Nam speaking.', 'Use "This is" when calling.', 'Gọi điện dùng "This is".'],
          ['Wait me a moment.', 'Please hold on a moment.', '"Wait me" is wrong.', '"Wait me" sai.'],
          ['What is your name? (rude)', 'May I have your name, please?', 'Direct question sounds abrupt.', 'Câu hỏi thẳng nghe cộc.']],
    s: [['Say who you are and why you call.', 'Nói mình là ai và gọi vì sao.'], ['Ask to repeat, spell, confirm.', 'Xin nhắc lại, đánh vần, xác nhận.'], ['Close with a summary of next steps.', 'Kết bằng tóm tắt bước tiếp.']],
    l: ['bcSpeak', 'bcListen', 'intonation', 'conf'],
    p: [['Role-play: ask for Mr Hall and say why you call (invoice question).', 'Đóng vai: xin gặp ông Hall và nói lý do gọi (hỏi về hoá đơn).', 'Good morning, this is… from… Could I speak to Mr Hall, please? I am calling about an invoice.', 'Good morning, this is… from… Could I speak to Mr Hall, please? I am calling about an invoice.'],
        ['Politely ask the caller to repeat.', 'Xin người gọi nhắc lại lịch sự.', 'Sorry, could you say that again, please?', 'Sorry, could you say that again, please?']] }),
  D(P + '3-2', '3.2 Messages, voicemail and calling back', '3.2 Lời nhắn, hộp thư thoại và gọi lại',
    'Ghi lời nhắn chính xác, để lại voicemail súc tích.', {
    n: '3.2',
    g: [['Take a message with the 5 key facts', 'Ghi lời nhắn với 5 thông tin chính'], ['Leave a short voicemail', 'Để lại voicemail ngắn gọn'], ['Report a message in reported speech', 'Thuật lại lời nhắn bằng lời gián tiếp']],
    b: [`<p><strong>Taking a message.</strong> Always write five facts: <em>who called, from which company, phone number, message, what action</em>. Repeat the number: <em>Let me read that back: 0-9-0…</em> Say: <em>I will pass on your message.</em> Do not promise what you cannot do: not <em>He will call you in 5 minutes</em> but <em>I will ask him to call you back today</em>.</p>
<p><strong>Voicemail.</strong> Speak slowly and keep to 20–30 seconds: name, company, time of call, reason, your number (twice), when you are available. <em>Hello, this is Lan Pham from ABC Software, calling on Thursday at 10. I am calling about the project timeline. Please call me back on 0-9-0, 1-2-3, 4-5-6-7. Again, 0-9-0… Thank you.</em></p>
<p><strong>Reported speech.</strong> When you pass the message on, shift tenses back: <em>"I will send the file."</em> → <em>He said he would send the file.</em> <em>"I can't come."</em> → <em>She said she couldn't come.</em> Use <em>asked me to</em> for requests: <em>He asked me to call him back.</em> Remember: no object after <em>said</em> (<em>said to me</em> if needed), and <em>told</em> needs an object (<em>told me</em>).</p>`,
       `<p><strong>Ghi lời nhắn.</strong> Luôn ghi năm thông tin: <em>ai gọi, công ty nào, số điện thoại, nội dung, việc cần làm</em>. Đọc lại số: <em>Let me read that back: 0-9-0…</em> Nói: <em>I will pass on your message.</em> Đừng hứa điều mình không làm được: đừng nói <em>He will call you in 5 minutes</em> mà nói <em>I will ask him to call you back today</em>.</p>
<p><strong>Voicemail.</strong> Nói chậm và giữ 20–30 giây: tên, công ty, giờ gọi, lý do, số của bạn (hai lần), khi nào bạn rảnh. <em>Hello, this is Lan Pham from ABC Software, calling on Thursday at 10. I am calling about the project timeline. Please call me back on 0-9-0, 1-2-3, 4-5-6-7. Again, 0-9-0… Thank you.</em></p>
<p><strong>Lời gián tiếp.</strong> Khi chuyển lời nhắn, lùi thì: <em>"I will send the file."</em> → <em>He said he would send the file.</em> <em>"I can't come."</em> → <em>She said she couldn't come.</em> Dùng <em>asked me to</em> cho yêu cầu: <em>He asked me to call him back.</em> Nhớ: sau <em>said</em> không có tân ngữ trực tiếp (cần thì <em>said to me</em>), còn <em>told</em> cần tân ngữ (<em>told me</em>).</p>`],
    voc: [['voicemail', 'recorded phone message', 'tin nhắn thoại'], ['pass on', 'give a message to someone', 'chuyển lời'], ['read back', 'repeat to check', 'đọc lại để kiểm'], ['available', 'free to talk', 'có thể liên lạc'], ['return a call', 'call someone who called you', 'gọi lại người đã gọi']],
    ph: [['Can I take a message?', 'receptionist', 'lễ tân hỏi'], ['I will ask him to call you back.', 'promise', 'hứa chuyển lời'], ['I am returning your call.', 'calling back', 'gọi lại'], ['Please leave your name and number.', 'voicemail greeting', 'lời chào hộp thư'], ['He said he would…', 'reporting', 'thuật lại']],
    dlg: { t: ['Taking a message', 'Ghi lời nhắn'], l: [
      ['Anna', 'I am afraid Mr Hall is in a meeting. Can I take a message?', 'Ông Hall đang họp. Tôi ghi lời nhắn được không?'],
      ['Nam', 'Yes. Please tell him Nam Tran from Delta Trading called about the delivery date.', 'Vâng, nhờ chuyển ông ấy rằng Nam Trần gọi về ngày giao hàng.'],
      ['Anna', 'And your number, please?', 'Cho tôi xin số.'],
      ['Nam', '0-9-0, 1-2-3, 4-5-6-7.', 'Số điện thoại đọc từng nhóm.'],
      ['Anna', 'Let me read that back… Thank you. I will ask him to call you back this afternoon.', 'Tôi đọc lại… Tôi sẽ nhờ ông ấy gọi lại chiều nay.']] },
    pit: [['He said me he will come.', 'He told me he would come.', 'said vs told; tense shift.', 'said/told và lùi thì.'],
          ['She said that I call her.', 'She asked me to call her.', 'Use asked + object + to.', 'Dùng asked + tân ngữ + to.'],
          ['090123456 (said very fast)', 'Say groups slowly: 090, 123, 4567.', 'Numbers are the first thing lost.', 'Số điện thoại hay nghe sai nhất.']],
    s: [['Message = who, company, number, content, action.', 'Lời nhắn = ai, công ty, số, nội dung, việc.'], ['Voicemail: slow, short, number twice.', 'Voicemail: chậm, ngắn, số hai lần.'], ['Shift tenses back in reported speech.', 'Lùi thì khi thuật lại.']],
    l: ['voicemail', 'reported', 'bcListen', 'bcSpeak'],
    p: [['Report: "I will call you tomorrow," said Tom.', 'Thuật lại: "I will call you tomorrow," Tom said.', 'Tom said he would call me the next day.', 'Tom said he would call me the next day.'],
        ['Write a 3-sentence voicemail asking to reschedule a meeting.', 'Viết voicemail 3 câu xin dời cuộc họp.', 'Hello, this is… from… I am calling to ask if we can move tomorrow\'s meeting to Thursday. Please call me on… Thank you.', 'Hello, this is… from… I am calling to ask if we can move tomorrow\'s meeting to Thursday. Please call me on… Thank you.']] }),
  D(P + '3-3', '3.3 Video calls: setup, etiquette and fixing problems', '3.3 Họp video: chuẩn bị, phép lịch sự, xử lý sự cố',
    'Chuẩn bị họp Zoom/Teams, mẫu câu về âm thanh, chia sẻ màn hình và luân phiên nói.', {
    n: '3.3',
    g: [['Prepare for a video call', 'Chuẩn bị cho họp video'], ['Use phrases for technical problems', 'Dùng mẫu câu khi gặp sự cố kỹ thuật'], ['Take turns and manage the chat', 'Luân phiên nói và dùng khung chat']],
    b: [`<p>Video meetings (Zoom, Teams, Google Meet) add problems: delays, noise, people talking at the same time. <strong>Before:</strong> test camera, microphone and internet 10 minutes early; choose a quiet room with light in front of you; close other apps; have the agenda and files ready. <strong>During:</strong> mute when not speaking, turn on video if the culture of the team expects it, look at the camera when you talk, and say your name before speaking if the group is large.</p>
<p><strong>Turn-taking.</strong> Because of delay, pause one second before you answer and avoid interrupting. Use the "raise hand" button or write in chat. To speak: <em>Sorry to jump in, may I add something?</em> To pass: <em>Anna, would you like to add anything?</em> Summarise often: <em>So far we have agreed on three points…</em></p>
<p><strong>Problems.</strong> Name the problem and the fix: <em>I think you are on mute.</em> <em>Your sound is breaking up; could you switch off your video?</em> <em>I will share my screen. Can you see it?</em> <em>I am going to drop out and rejoin.</em> After the call send a short email with decisions and the recording link if allowed. Dress and background should be professional, and if you share a screen, close private tabs first.</p>`,
       `<p>Họp video (Zoom, Teams, Google Meet) có thêm vấn đề: trễ tiếng, ồn, nhiều người nói cùng lúc. <strong>Trước họp:</strong> thử camera, micro, mạng sớm 10 phút; chọn phòng yên tĩnh, ánh sáng phía trước mặt; tắt ứng dụng khác; chuẩn bị agenda và tệp. <strong>Trong họp:</strong> tắt mic khi không nói, bật camera nếu văn hoá nhóm mong đợi, nhìn vào camera khi nói, và xưng tên trước khi nói nếu nhóm đông.</p>
<p><strong>Luân phiên nói.</strong> Vì có độ trễ, dừng một giây trước khi trả lời và đừng ngắt lời. Dùng nút "giơ tay" hoặc viết trong chat. Muốn nói: <em>Sorry to jump in, may I add something?</em> Nhường lời: <em>Anna, would you like to add anything?</em> Hãy tóm tắt thường xuyên: <em>So far we have agreed on three points…</em></p>
<p><strong>Sự cố.</strong> Nêu vấn đề và cách xử lý: <em>I think you are on mute.</em> <em>Your sound is breaking up; could you switch off your video?</em> <em>I will share my screen. Can you see it?</em> <em>I am going to drop out and rejoin.</em> Sau họp gửi email ngắn với quyết định và link ghi hình nếu được phép. Trang phục và nền phải chuyên nghiệp, và khi chia sẻ màn hình hãy đóng các tab riêng tư trước.</p>`],
    voc: [['mute / unmute', 'turn sound off / on', 'tắt/bật tiếng'], ['share screen', 'show your display to others', 'chia sẻ màn hình'], ['breaking up', 'sound or picture cutting out', 'bị rớt, chập chờn'], ['lag', 'delay', 'độ trễ'], ['drop out', 'leave by accident', 'bị rớt khỏi cuộc gọi']],
    ph: [['You are on mute.', 'telling someone', 'báo ai đó đang tắt mic'], ['Can everyone see my screen?', 'sharing', 'khi chia sẻ'], ['The connection is poor on my side.', 'problem', 'báo sự cố'], ['Could you type it in the chat?', 'unclear sound', 'âm thanh không rõ'], ['Let us do a quick recap.', 'summary', 'tóm tắt']],
    dlg: { t: ['A video call with a problem', 'Họp video có sự cố'], l: [
      ['Host', 'Can everyone hear me? Lan, I think you are on mute.', 'Mọi người nghe rõ không? Lan, hình như bạn đang tắt mic.'],
      ['Lan', 'Sorry! Can you hear me now? I will share my screen… Can you see the slide?', 'Xin lỗi! Giờ nghe rõ chưa? Tôi chia sẻ màn hình… thấy slide chưa?'],
      ['Tom', 'Your sound is breaking up. Could you switch off your video?', 'Âm thanh bị chập chờn, bạn tắt camera được không?'],
      ['Lan', 'Sure. I will type the key points in the chat as well.', 'Được, tôi cũng sẽ gõ ý chính vào chat.']] },
    pit: [['I cannot hear you, you are not talking.', 'I cannot hear you; I think you are on mute.', 'Be specific and kind.', 'Nói cụ thể và nhẹ nhàng.'],
          ['Everybody talks at the same time.', 'Let us take turns; please use the raise-hand button.', 'Manage the group.', 'Điều phối nhóm.'],
          ['I do not hear. (no help)', 'Sorry, the connection is bad. Could you repeat?', 'Ask for what you need.', 'Nói rõ điều bạn cần.']],
    s: [['Test equipment and prepare before the call.', 'Thử thiết bị và chuẩn bị trước.'], ['Mute, pause, raise hand, summarise.', 'Tắt mic, dừng, giơ tay, tóm tắt.'], ['Name the problem and propose a fix.', 'Nêu vấn đề và đề xuất cách sửa.']],
    l: ['video', 'zoom', 'teams', 'bcSpeak'],
    p: [['Say: someone is talking but you cannot hear.', 'Nói: ai đó đang nói nhưng bạn không nghe.', 'I think you are on mute.', 'I think you are on mute.'],
        ['Politely take the turn in a video call.', 'Xin lượt nói lịch sự trong họp video.', 'Sorry to jump in, may I add something?', 'Sorry to jump in, may I add something?']] }),
  Q(P + 'quiz-3', 'Quiz — Chapter 3: Phone and video calls', 'Quiz — Chương 3: Điện thoại và họp video', [
    ['When you call, you say:|||Khi bạn gọi, bạn nói:', ['I am Nam.', 'This is Nam from Delta.', 'My name Nam.', 'Here Nam.'], 1, '"This is" on the phone.|||Dùng "This is" qua điện thoại.'],
    ['"Put through" means…|||"Put through" nghĩa là…', ['hang up|||cúp máy', 'connect the call|||nối máy', 'cancel|||huỷ', 'record|||ghi âm'], 1, 'Connect someone to a person.|||Nối máy cho ai.'],
    ['To check a phone number you…|||Để kiểm số điện thoại bạn…', ['guess|||đoán', 'read it back|||đọc lại', 'ignore|||bỏ qua', 'change it|||đổi'], 1, 'Read back to confirm.|||Đọc lại để xác nhận.'],
    ['"Could you hold on a moment?" is…|||"Could you hold on a moment?" là…', ['asking someone to wait|||nhờ ai chờ', 'ending a call|||kết thúc', 'a complaint|||khiếu nại', 'spelling|||đánh vần'], 0, 'Hold on = wait.|||Hold on = chờ.'],
    ['Reported speech of "I will call":|||Lời gián tiếp của "I will call":', ['He said he will call.', 'He said he would call.', 'He said he calls.', 'He says he called.'], 1, 'Shift will → would.|||Lùi will → would.'],
    ['A voicemail should be…|||Voicemail nên…', ['long and detailed|||dài và chi tiết', 'short, with the number twice|||ngắn, số hai lần', 'silent|||im lặng', 'angry|||gay gắt'], 1, '20–30 seconds.|||20–30 giây.'],
    ['If someone cannot be heard on video:|||Nếu ai đó không nghe được trong họp video:', ['I think you are on mute.', 'You are stupid.', 'Go away.', 'Be quiet.'], 0, 'Polite and specific.|||Lịch sự và cụ thể.'],
    ['Before a video meeting you should…|||Trước họp video bạn nên…', ['test camera and microphone|||thử camera và micro', 'skip preparation|||bỏ qua chuẩn bị', 'join late|||vào muộn', 'open many apps|||mở nhiều ứng dụng'], 0, 'Test 10 minutes early.|||Thử sớm 10 phút.'],
  ]),
]));
// ===== Chương 4 =====
secs.push(SEC('Chapter 4 — Meetings', 'Chương 4 — Cuộc họp',
  'Điều hành họp, nêu ý kiến, đồng ý/phản đối, ngắt lời lịch sự, biên bản và việc cần làm.', [
  D(P + '4-1', '4.1 Running a meeting: agenda, opening and keeping time', '4.1 Điều hành họp: agenda, mở đầu và giữ giờ',
    'Chuẩn bị agenda, mở họp, chuyển mục và đóng họp.', {
    n: '4.1',
    g: [['Write a simple agenda', 'Viết agenda đơn giản'], ['Open, move on and close a meeting', 'Mở họp, chuyển mục và đóng họp'], ['Keep the meeting on time', 'Giữ cuộc họp đúng giờ']],
    b: [`<p>A good meeting has a <strong>purpose</strong> (decide, inform, brainstorm), an <strong>agenda</strong> sent in advance, a <strong>time limit</strong> and a <strong>chair</strong>. The agenda lists topics, owner and minutes: <em>1. Project status (Lan, 10 min) 2. Budget (Tom, 15 min) 3. Next steps (all, 5 min)</em>. If a meeting has no decision or information to share, an email is better.</p>
<p><strong>Chair's language.</strong> Open: <em>Good morning everyone. Let's get started. The purpose of today's meeting is to decide the launch date.</em> Move on: <em>Shall we move on to the next item?</em> Control time: <em>We have only five minutes left on this point.</em> Park a side topic: <em>That is important, but let's come back to it at the end.</em> Close: <em>To sum up, we agreed three things… Lan will send the minutes by Friday. Thank you all.</em></p>
<p><strong>Participants.</strong> Arrive on time, bring your update ready in 60 seconds, and do not read your phone. Say <em>apologies</em> in advance if you cannot attend: <em>Apologies, I cannot attend on Thursday; Tom will represent me.</em> In many companies a meeting that starts late and ends late is a sign of poor management, so the chair should protect the end time.</p>`,
       `<p>Một cuộc họp tốt có <strong>mục đích</strong> (quyết định, thông báo, động não), <strong>agenda</strong> gửi trước, <strong>giới hạn thời gian</strong> và một <strong>chair</strong> (người điều hành). Agenda liệt kê chủ đề, người phụ trách và số phút: <em>1. Project status (Lan, 10 min) 2. Budget (Tom, 15 min) 3. Next steps (all, 5 min)</em>. Nếu không có quyết định hay thông tin cần chia sẻ, email tốt hơn họp.</p>
<p><strong>Ngôn ngữ của chair.</strong> Mở: <em>Good morning everyone. Let's get started. The purpose of today's meeting is to decide the launch date.</em> Chuyển mục: <em>Shall we move on to the next item?</em> Giữ giờ: <em>We have only five minutes left on this point.</em> Gác chủ đề phụ: <em>That is important, but let's come back to it at the end.</em> Đóng: <em>To sum up, we agreed three things… Lan will send the minutes by Friday. Thank you all.</em></p>
<p><strong>Người tham dự.</strong> Đến đúng giờ, chuẩn bị cập nhật trong 60 giây, không xem điện thoại. Báo trước <em>apologies</em> nếu vắng: <em>Apologies, I cannot attend on Thursday; Tom will represent me.</em> Ở nhiều công ty, họp muộn và kết thúc muộn là dấu hiệu quản lý kém, nên chair cần bảo vệ giờ kết thúc.</p>`],
    voc: [['agenda', 'list of topics', 'chương trình họp'], ['chair', 'person who leads the meeting', 'người điều hành họp'], ['item', 'one topic on the agenda', 'một mục trong agenda'], ['apologies', 'notice that someone cannot attend', 'thông báo vắng mặt'], ['AOB', 'any other business', 'các vấn đề khác']],
    ph: [['Let us get started.', 'opening', 'mở họp'], ['Shall we move on to…?', 'next item', 'chuyển mục'], ['Let us park that for now.', 'postpone a topic', 'gác lại'], ['To sum up,…', 'closing', 'kết thúc'], ['Any other business?', 'before closing', 'trước khi đóng']],
    dlg: { t: ['Opening a short meeting', 'Mở một cuộc họp ngắn'], l: [
      ['Chair', 'Good morning. Let\'s get started. We have 30 minutes and three items: status, budget, next steps.', 'Chào mọi người. Bắt đầu nhé. Ta có 30 phút và ba mục: tiến độ, ngân sách, bước tiếp theo.'],
      ['Chair', 'Lan, could you give us a quick update?', 'Lan, bạn cập nhật nhanh giúp nhé?'],
      ['Lan', 'Sure. We are on schedule, but testing needs two more days.', 'Vâng. Ta đúng tiến độ, nhưng kiểm thử cần thêm hai ngày.'],
      ['Chair', 'Thanks. Let\'s park the testing issue and come back to it under AOB. Shall we move on to the budget?', 'Cảm ơn. Gác vụ kiểm thử đến phần AOB. Ta sang ngân sách nhé?']] },
    pit: [['We begin the meeting now.', 'Let us get started.', 'Natural phrase.', 'Mẫu câu tự nhiên.'],
          ['Next, please.', 'Shall we move on to the next item?', 'Too abrupt.', 'Quá cộc.'],
          ['The meeting is finished, bye.', 'To sum up… Thank you all for your time.', 'Close with a summary.', 'Đóng bằng tóm tắt.']],
    s: [['Purpose + agenda + time + chair.', 'Mục đích + agenda + giờ + chair.'], ['Use signposting to open, move on, close.', 'Dùng từ dẫn để mở, chuyển, đóng.'], ['Park side topics.', 'Gác chủ đề phụ.']],
    l: ['meeting', 'agenda', 'bcSpeak', 'rules'],
    p: [['Write a 3-item agenda with minutes for a 30-minute team meeting.', 'Viết agenda 3 mục có số phút cho họp nhóm 30 phút.', '1 Status (10) 2 Risks (10) 3 Next steps (10)', '1 Status (10) 2 Risks (10) 3 Next steps (10)'],
        ['How can the chair politely stop a long digression?', 'Chair ngăn lạc đề dài lịch sự thế nào?', 'That is important, but let\'s come back to it at the end.', 'That is important, but let\'s come back to it at the end.']] }),
  D(P + '4-2', '4.2 Giving opinions, agreeing, disagreeing and interrupting', '4.2 Nêu ý kiến, đồng ý, phản đối và ngắt lời',
    'Dùng mẫu câu ý kiến, mức độ đồng ý và ngắt lời lịch sự.', {
    n: '4.2',
    g: [['Give an opinion with support', 'Nêu ý kiến có dẫn chứng'], ['Show degrees of agreement and disagreement', 'Thể hiện các mức đồng ý và phản đối'], ['Interrupt and clarify politely', 'Ngắt lời và hỏi lại lịch sự']],
    b: [`<p><strong>Opinion.</strong> Use opinion + reason + example: <em>In my opinion we should launch in January, because the team will be ready and December is busy for customers.</em> Starters: <em>I think / In my view / From my experience / It seems to me that</em>. Avoid starting every sentence with <em>I think</em>.</p>
<p><strong>Agreement scale.</strong> Strong yes: <em>Absolutely. / I completely agree.</em> Medium: <em>I agree with you up to a point.</em> Partial: <em>You have a point, but…</em> Polite no: <em>I am not sure I agree, because…</em> Strong no (only with equals, rarely): <em>I do not think that is realistic.</em> Always give a reason. In Vietnamese meetings people often stay silent to avoid conflict, but in international meetings silence is read as agreement or lack of interest, so speak up at least once.</p>
<p><strong>Interrupting.</strong> Use <em>Sorry to interrupt, but…</em>, <em>Can I just come in here?</em>, <em>Could I add something?</em> To get back: <em>Sorry, may I finish my point?</em> Clarify: <em>What do you mean by "soon"?</em>, <em>Could you give an example?</em>, <em>Are you saying that…?</em> Paraphrase to check: <em>So, if I understand, you want to delay the launch by two weeks.</em></p>`,
       `<p><strong>Ý kiến.</strong> Dùng ý kiến + lý do + ví dụ: <em>In my opinion we should launch in January, because the team will be ready and December is busy for customers.</em> Mở đầu: <em>I think / In my view / From my experience / It seems to me that</em>. Đừng mở mọi câu bằng <em>I think</em>.</p>
<p><strong>Thang đồng ý.</strong> Đồng ý mạnh: <em>Absolutely. / I completely agree.</em> Vừa: <em>I agree with you up to a point.</em> Một phần: <em>You have a point, but…</em> Không lịch sự: <em>I am not sure I agree, because…</em> Phản đối mạnh (chỉ với người ngang cấp, hiếm): <em>I do not think that is realistic.</em> Luôn nêu lý do. Ở họp Việt Nam nhiều người im lặng để tránh xung đột, nhưng trong họp quốc tế im lặng bị hiểu là đồng ý hoặc không quan tâm, nên hãy phát biểu ít nhất một lần.</p>
<p><strong>Ngắt lời.</strong> Dùng <em>Sorry to interrupt, but…</em>, <em>Can I just come in here?</em>, <em>Could I add something?</em> Để lấy lại lượt: <em>Sorry, may I finish my point?</em> Hỏi rõ: <em>What do you mean by "soon"?</em>, <em>Could you give an example?</em>, <em>Are you saying that…?</em> Diễn đạt lại để kiểm: <em>So, if I understand, you want to delay the launch by two weeks.</em></p>`],
    voc: [['opinion', 'what you think', 'ý kiến'], ['up to a point', 'partly', 'một phần'], ['digression', 'moving away from the topic', 'lạc đề'], ['paraphrase', 'say again in other words', 'diễn đạt lại'], ['objection', 'a reason against', 'sự phản đối']],
    ph: [['In my view…', 'opinion', 'ý kiến'], ['I see what you mean, but…', 'soft disagreement', 'phản đối mềm'], ['That is exactly my point.', 'strong agreement', 'đồng ý mạnh'], ['Sorry to interrupt, but…', 'interrupting', 'ngắt lời'], ['Could you clarify what you mean by…?', 'asking', 'hỏi rõ']],
    dlg: { t: ['Disagreeing in a meeting', 'Phản đối trong cuộc họp'], l: [
      ['Tom', 'I think we should launch in December.', 'Tôi nghĩ nên ra mắt tháng 12.'],
      ['Lan', 'I see your point, but I am not sure that is realistic. Testing will not be finished until January.', 'Tôi hiểu ý anh, nhưng không chắc khả thi. Kiểm thử đến tháng 1 mới xong.'],
      ['Tom', 'Sorry to interrupt, what do you mean by "not finished"?', 'Xin lỗi ngắt lời, "chưa xong" nghĩa là sao?'],
      ['Lan', 'We still have 30 open bugs. So if I understand correctly, we need three more weeks.', 'Còn 30 lỗi chưa sửa. Nếu tôi hiểu đúng thì cần thêm ba tuần.']] },
    pit: [['I am agree with you.', 'I agree with you.', '"Agree" is a verb.', '"Agree" là động từ.'],
          ['I am not agree.', 'I do not agree. / I am not sure I agree.', 'Use auxiliary do.', 'Dùng trợ động từ do.'],
          ['No! It is wrong!', 'I am afraid I see it differently.', 'Too direct.', 'Quá thẳng.']],
    s: [['Opinion + reason + example.', 'Ý kiến + lý do + ví dụ.'], ['Use a scale of agreement, always give reasons.', 'Dùng thang đồng ý, luôn có lý do.'], ['Clarify by paraphrasing.', 'Hỏi rõ bằng cách diễn đạt lại.']],
    l: ['meeting', 'assert', 'listen', 'bcSpeak'],
    p: [['Disagree politely with "We should cut the budget by half".', 'Phản đối lịch sự với "We should cut the budget by half".', 'I see your point, but I am not sure that is realistic because…', 'I see your point, but I am not sure that is realistic because…'],
        ['Fix: "I am agree with your plan."', 'Sửa: "I am agree with your plan."', 'I agree with your plan.', 'I agree with your plan.']] }),
  D(P + '4-3', '4.3 Minutes, action items and follow-up', '4.3 Biên bản, việc cần làm và theo dõi',
    'Viết biên bản ngắn với quyết định và action items có người phụ trách, hạn chót.', {
    n: '4.3',
    g: [['Write short minutes', 'Viết biên bản ngắn'], ['Write action items with owner and deadline', 'Viết việc cần làm có người và hạn'], ['Send a follow-up email', 'Gửi email theo dõi']],
    b: [`<p><strong>Minutes</strong> are a short record of what was decided, not a transcript. Include: date, attendees, apologies, topics, <strong>decisions</strong>, and <strong>action items</strong>. Write in the past for what happened and with <em>will</em> for what people agreed to do. Use the passive for decisions: <em>It was agreed that the launch will be moved to 15 January.</em></p>
<p><strong>Action item formula:</strong> Who + will + verb + what + by when. <em>Lan will send the revised budget to Tom by Friday 21 November.</em> Never write "the team will fix it" because no one owns it. Number the items so people can refer to them. Send the minutes within 24 hours and ask people to reply only if something is wrong.</p>
<p><strong>Follow-up.</strong> Before the next meeting, check each action item: <em>Could you update me on action 2?</em> Close the loop in the next minutes: <em>Done / In progress / Blocked</em>. Good minutes make you look organised and protect you when people forget what they promised.</p>`,
       `<p><strong>Biên bản (minutes)</strong> là bản ghi ngắn những gì đã quyết, không phải bản chép lời. Gồm: ngày, người tham dự, người vắng, chủ đề, <strong>quyết định</strong> và <strong>việc cần làm</strong>. Viết quá khứ cho điều đã xảy ra và dùng <em>will</em> cho việc mọi người nhận làm. Dùng bị động cho quyết định: <em>It was agreed that the launch will be moved to 15 January.</em></p>
<p><strong>Công thức việc cần làm:</strong> Ai + will + động từ + việc gì + khi nào. <em>Lan will send the revised budget to Tom by Friday 21 November.</em> Đừng viết "the team will fix it" vì không ai chịu trách nhiệm. Đánh số để dễ nhắc. Gửi biên bản trong vòng 24 giờ và nhờ mọi người chỉ phản hồi nếu có sai sót.</p>
<p><strong>Theo dõi.</strong> Trước cuộc họp sau, kiểm từng việc: <em>Could you update me on action 2?</em> Khép vòng trong biên bản kế tiếp: <em>Done / In progress / Blocked</em>. Biên bản tốt khiến bạn trông có tổ chức và bảo vệ bạn khi người ta quên lời đã hứa.</p>`],
    voc: [['minutes', 'written record of a meeting', 'biên bản họp'], ['action item', 'task agreed in a meeting', 'việc cần làm'], ['owner', 'person responsible', 'người phụ trách'], ['decision', 'something agreed', 'quyết định'], ['blocked', 'cannot continue', 'bị vướng']],
    ph: [['It was agreed that…', 'decision', 'quyết định'], ['X will… by…', 'action', 'việc cần làm'], ['The next meeting is on…', 'closing', 'họp tiếp theo'], ['Please let me know if I missed anything.', 'check', 'xin kiểm lại'], ['Action 2 is blocked because…', 'status', 'báo vướng']],
    dlg: { t: ['Sample minutes', 'Biên bản mẫu'], l: [
      ['Minutes', 'Project meeting, 14 November. Present: Lan, Tom, Anna. Apologies: Minh.', 'Họp dự án 14/11. Có mặt: Lan, Tom, Anna. Vắng: Minh.'],
      ['Decision', 'It was agreed that the launch will move to 15 January because testing is not complete.', 'Thống nhất dời ra mắt đến 15/1 vì kiểm thử chưa xong.'],
      ['Actions', '1. Lan will send the revised plan to Tom by Friday 21 November. 2. Anna will contact the supplier about the delay by Monday.', '1. Lan gửi kế hoạch sửa cho Tom trước 21/11. 2. Anna liên hệ nhà cung cấp trước thứ Hai.']] },
    pit: [['The team will fix it soon.', 'Anna will fix the login bug by Tuesday.', 'Needs owner and date.', 'Cần người và ngày.'],
          ['We discussed about the budget.', 'We discussed the budget.', '"discuss" has no "about".', '"discuss" không có "about".'],
          ['Minutes with every word spoken.', 'Decisions and actions only.', 'Be short.', 'Hãy ngắn.']],
    s: [['Minutes record decisions and actions.', 'Biên bản ghi quyết định và việc.'], ['Who + will + what + by when.', 'Ai + will + việc + hạn.'], ['Send within 24 hours and follow up.', 'Gửi trong 24 giờ và theo dõi.']],
    l: ['minutes', 'agenda', 'meeting', 'bcWrite'],
    p: [['Write an action item: Minh prepares the demo; deadline next Wednesday.', 'Viết việc cần làm: Minh chuẩn bị bản demo; hạn thứ Tư tuần sau.', 'Minh will prepare the demo by next Wednesday.', 'Minh will prepare the demo by next Wednesday.'],
        ['Rewrite: "We discussed about the price."', 'Viết lại: "We discussed about the price."', 'We discussed the price.', 'We discussed the price.']] }),
  Q(P + 'quiz-4', 'Quiz — Chapter 4: Meetings', 'Quiz — Chương 4: Cuộc họp', [
    ['The chair…|||Chair là…', ['leads the meeting|||người điều hành họp', 'takes the minutes only|||chỉ ghi biên bản', 'is a table|||cái bàn', 'always speaks last|||luôn nói cuối'], 0, 'The chair leads.|||Chair điều hành.'],
    ['An agenda lists…|||Agenda liệt kê…', ['topics, owners, times|||chủ đề, người, giờ', 'jokes|||chuyện đùa', 'only names|||chỉ tên', 'prices|||giá'], 0, 'Topics with owners and time.|||Chủ đề kèm người và giờ.'],
    ['Park a side topic:|||Gác chủ đề phụ:', ['Let us come back to it at the end.', 'Stop talking.', 'That is stupid.', 'Next!'], 0, 'Polite postponement.|||Hoãn lịch sự.'],
    ['Correct:|||Đúng:', ['I am agree.', 'I agree.', 'I agrees.', 'I am agreeing with.'], 1, 'Agree is a verb.|||Agree là động từ.'],
    ['A polite interruption:|||Ngắt lời lịch sự:', ['Shut up.', 'Sorry to interrupt, but could I add something?', 'Wrong!', 'Be quiet.'], 1, 'Apologise, then ask.|||Xin lỗi rồi hỏi.'],
    ['Best action item:|||Việc cần làm tốt nhất:', ['Fix soon.', 'Anna will fix the login bug by Tuesday.', 'Someone should look.', 'We must try.'], 1, 'Owner + date.|||Có người và ngày.'],
    ['Minutes should include…|||Biên bản nên có…', ['decisions and actions|||quyết định và việc', 'every word|||từng lời', 'private opinions|||ý kiến riêng', 'nothing|||không gì'], 0, 'Decisions and actions.|||Quyết định và việc.'],
    ['Correct:|||Đúng:', ['We discussed about the price.', 'We discussed the price.', 'We discussed on the price.', 'We discussed for the price.'], 1, 'Discuss + noun.|||Discuss + danh từ.'],
  ]),
]));

// ===== Chương 5 =====
secs.push(SEC('Chapter 5 — Presentations', 'Chương 5 — Thuyết trình',
  'Cấu trúc, mô tả số liệu, giọng nói và trả lời câu hỏi.', [
  D(P + '5-1', '5.1 Structuring a presentation: opening, signposting, closing', '5.1 Cấu trúc bài thuyết trình: mở đầu, dẫn dắt, kết',
    'Mở đầu thu hút, từ dẫn dắt và kết luận có lời kêu gọi hành động.', {
    n: '5.1',
    g: [['Plan a 5-minute talk with three parts', 'Lập bài nói 5 phút gồm ba phần'], ['Use signposting language', 'Dùng từ dẫn dắt'], ['End with a clear message', 'Kết bằng thông điệp rõ']],
    b: [`<p>Classic structure: <strong>tell them what you will say, say it, tell them what you said</strong>. Opening (about 15%): greet, hook, purpose, outline. Body (70%): two or three main points, each with a reason or example. Closing (15%): summary, call to action, thanks. For 5 minutes use at most three points and 5–6 slides.</p>
<p><strong>Hook.</strong> Start with a question, a surprising number or a short story: <em>Did you know that 60% of customers leave after one bad reply?</em> Then purpose: <em>Today I'd like to show you how we can cut reply time by half.</em> Outline: <em>I will cover three points: first…, second…, finally…</em></p>
<p><strong>Signposting.</strong> It tells listeners where they are: <em>Let's start with…, That brings me to…, Let me move on to…, To sum up…, In conclusion…</em> Without signposts the audience gets lost. End by repeating the key message and asking for a decision: <em>So my recommendation is to start the pilot in January. Thank you. I'd be happy to take questions.</em></p>`,
       `<p>Cấu trúc kinh điển: <strong>nói cho họ biết bạn sẽ nói gì, nói, rồi nhắc lại bạn đã nói gì</strong>. Mở đầu (khoảng 15%): chào, mồi, mục đích, dàn ý. Thân bài (70%): hai hoặc ba ý chính, mỗi ý có lý do hoặc ví dụ. Kết (15%): tóm tắt, kêu gọi hành động, cảm ơn. Bài 5 phút dùng tối đa ba ý và 5–6 slide.</p>
<p><strong>Mồi.</strong> Bắt đầu bằng câu hỏi, con số bất ngờ hoặc chuyện ngắn: <em>Did you know that 60% of customers leave after one bad reply?</em> Rồi mục đích: <em>Today I'd like to show you how we can cut reply time by half.</em> Dàn ý: <em>I will cover three points: first…, second…, finally…</em></p>
<p><strong>Từ dẫn dắt (signposting).</strong> Cho người nghe biết đang ở đâu: <em>Let's start with…, That brings me to…, Let me move on to…, To sum up…, In conclusion…</em> Thiếu chúng, khán giả lạc đường. Kết bằng nhắc lại thông điệp chính và xin quyết định: <em>So my recommendation is to start the pilot in January. Thank you. I'd be happy to take questions.</em></p>`],
    voc: [['hook', 'attention-getting opening', 'phần mồi thu hút'], ['outline', 'plan of the talk', 'dàn ý'], ['signpost', 'words that guide the listener', 'từ dẫn dắt'], ['call to action', 'what you want the audience to do', 'lời kêu gọi hành động'], ['recommendation', 'what you suggest', 'đề xuất']],
    ph: [['Good morning everyone, thank you for coming.', 'greeting', 'chào'], ['I would like to talk about…', 'topic', 'nêu chủ đề'], ['Let me start by…', 'start', 'bắt đầu'], ['That brings me to my next point.', 'moving on', 'chuyển ý'], ['In conclusion,…', 'closing', 'kết luận']],
    dlg: { t: ['Opening of a 5-minute talk', 'Phần mở đầu bài nói 5 phút'], l: [
      ['Speaker', 'Good morning everyone. How long do you wait for a reply from customer service? For many of our customers it is three days. Today I will show how we can cut it to one day. I will cover three points: the problem, the solution and the cost. Let me start with the problem.', 'Chào mọi người. Các bạn chờ phản hồi từ chăm sóc khách hàng bao lâu? Với nhiều khách của ta là ba ngày. Hôm nay tôi trình bày cách giảm còn một ngày, qua ba ý: vấn đề, giải pháp và chi phí. Bắt đầu với vấn đề.']] },
    pit: [['I will talk about is...', 'I will talk about…', 'Do not add "is".', 'Đừng thêm "is".'],
          ['My presentation has the content...', 'My presentation has three parts.', 'Unnatural word.', 'Từ không tự nhiên.'],
          ['That is all. Thanks. (no summary)', 'To sum up… Thank you.', 'Always summarise.', 'Luôn tóm tắt.']],
    s: [['Open, body (2–3 points), close.', 'Mở, thân (2–3 ý), kết.'], ['Signposting keeps the audience oriented.', 'Từ dẫn giúp khán giả theo kịp.'], ['End with the key message and a request.', 'Kết bằng thông điệp và đề nghị.']],
    l: ['pres', 'speak', 'story', 'bcSpeak'],
    p: [['Write an opening sentence with a hook and the purpose for a talk on remote work.', 'Viết câu mở đầu có mồi và mục đích cho bài nói về làm việc từ xa.', 'How many hours do you lose commuting each week? Today I will show how remote work can give us those hours back.', 'How many hours do you lose commuting each week? Today I will show how remote work can give us those hours back.'],
        ['Name three signposting phrases.', 'Nêu ba cụm dẫn dắt.', 'Let\'s start with…; That brings me to…; To sum up…', 'Let\'s start with…; That brings me to…; To sum up…']] }),
  D(P + '5-2', '5.2 Describing charts, numbers and trends', '5.2 Mô tả biểu đồ, số liệu và xu hướng',
    'Từ vựng tăng giảm, so sánh và cách trình bày số liệu.', {
    n: '5.2',
    g: [['Describe an increase, decrease and stable trend', 'Mô tả xu hướng tăng, giảm, ổn định'], ['Compare numbers and give a source', 'So sánh số liệu và nêu nguồn'], ['Say numbers and percentages clearly', 'Đọc số và phần trăm rõ ràng']],
    b: [`<p>Charts need a pattern: <strong>what chart is it, the main message, the key figures, the reason</strong>. <em>This line chart shows monthly sales in 2025. As you can see, sales rose steadily from January to June, peaked at 120 million dong in June, then fell by 15% in July because of the holiday.</em> Say the message first, then support it with numbers.</p>
<p>Verbs: <em>rise / increase / go up / grow</em>; <em>fall / decrease / drop / decline</em>; <em>remain stable / level off</em>; <em>peak at</em>; <em>reach a low of</em>. Adverbs: <em>sharply, steadily, slightly, gradually</em>. Prepositions: <em>rose <strong>by</strong> 10% (the amount of change), <strong>to</strong> 120 (the end point), <strong>from</strong> 100 <strong>to</strong> 120, <strong>at</strong> 120 (the level)</em>. Compare: <em>twice as high as, slightly lower than, the highest of all</em>.</p>
<p>Numbers: 2.5 = two point five; 1,250 = one thousand two hundred and fifty; 15% = fifteen percent; 3/4 = three quarters. Round for clarity: <em>about 1.2 million</em>. Name the source and period: <em>Source: company data, 2025.</em> Vietnamese uses a comma for decimals (2,5) and a dot for thousands (1.250); English is the opposite. Check this before sending any table.</p>`,
       `<p>Biểu đồ cần một khuôn: <strong>biểu đồ gì, thông điệp chính, số liệu then chốt, lý do</strong>. <em>This line chart shows monthly sales in 2025. As you can see, sales rose steadily from January to June, peaked at 120 million dong in June, then fell by 15% in July because of the holiday.</em> Nói thông điệp trước, rồi dẫn số liệu.</p>
<p>Động từ: <em>rise / increase / go up / grow</em>; <em>fall / decrease / drop / decline</em>; <em>remain stable / level off</em>; <em>peak at</em>; <em>reach a low of</em>. Trạng từ: <em>sharply, steadily, slightly, gradually</em>. Giới từ: <em>rose <strong>by</strong> 10% (mức thay đổi), <strong>to</strong> 120 (điểm cuối), <strong>from</strong> 100 <strong>to</strong> 120, <strong>at</strong> 120 (mức đang ở)</em>. So sánh: <em>twice as high as, slightly lower than, the highest of all</em>.</p>
<p>Số: 2.5 = two point five; 1,250 = one thousand two hundred and fifty; 15% = fifteen percent; 3/4 = three quarters. Làm tròn cho rõ: <em>about 1.2 million</em>. Nêu nguồn và thời kỳ: <em>Source: company data, 2025.</em> Tiếng Việt dùng dấu phẩy cho thập phân (2,5) và dấu chấm cho hàng nghìn (1.250); tiếng Anh ngược lại. Hãy kiểm trước khi gửi bất kỳ bảng nào.</p>`],
    voc: [['increase / rise', 'go up', 'tăng'], ['decrease / drop', 'go down', 'giảm'], ['peak', 'highest point', 'đỉnh'], ['stable', 'not changing', 'ổn định'], ['figure', 'a number', 'con số']],
    ph: [['As you can see from the chart,…', 'introducing', 'dẫn vào biểu đồ'], ['Sales rose by 10%.', 'amount', 'nêu mức tăng'], ['It peaked at…', 'highest point', 'đạt đỉnh'], ['This is mainly due to…', 'reason', 'nêu nguyên nhân'], ['Source:…', 'citing', 'nêu nguồn']],
    dlg: { t: ['Describing a chart', 'Mô tả biểu đồ'], l: [
      ['Speaker', 'This bar chart compares the number of orders in 2024 and 2025. Orders grew from 800 to 1,200, an increase of 50%. The biggest rise was in Q4, mostly due to the Tet campaign. Sales then remained stable in Q1.', 'Biểu đồ cột so sánh số đơn năm 2024 và 2025. Đơn tăng từ 800 lên 1.200, tăng 50%. Mức tăng lớn nhất ở Q4, chủ yếu nhờ chiến dịch Tết. Sau đó doanh số ổn định ở Q1.']] },
    pit: [['Sales increased to 10%.', 'Sales increased by 10%.', '"by" shows the amount.', '"by" chỉ lượng thay đổi.'],
          ['The sales is rising.', 'Sales are rising.', 'Plural verb with sales.', 'Sales đi với động từ số nhiều.'],
          ['2,5 million (Vietnamese comma)', '2.5 million', 'English decimal point.', 'Tiếng Anh dùng dấu chấm thập phân.']],
    s: [['Message first, then figures, then reason.', 'Thông điệp trước, rồi số liệu, rồi nguyên nhân.'], ['by = amount, to = end point, at = level.', 'by = mức, to = điểm cuối, at = mức hiện tại.'], ['Watch decimal commas and dots.', 'Chú ý dấu phẩy và dấu chấm.']],
    l: ['slide', 'pres', 'techw', 'bcWrite'],
    p: [['Describe: sales 100 in Jan, 150 in Jun.', 'Mô tả: doanh số 100 tháng 1, 150 tháng 6.', 'Sales rose from 100 in January to 150 in June, an increase of 50%.', 'Sales rose from 100 in January to 150 in June, an increase of 50%.'],
        ['Say aloud 1,250,000 and 3.5%.', 'Đọc to 1,250,000 và 3.5%.', 'one million two hundred and fifty thousand; three point five percent.', 'one million two hundred and fifty thousand; three point five percent.']] }),
  D(P + '5-3', '5.3 Delivery, pronunciation and answering questions', '5.3 Cách trình bày, phát âm và trả lời câu hỏi',
    'Giọng, trọng âm, ngôn ngữ cơ thể và xử lý Q&A.', {
    n: '5.3',
    g: [['Improve stress, pauses and pace', 'Cải thiện trọng âm, quãng nghỉ và tốc độ'], ['Use body language and eye contact', 'Dùng ngôn ngữ cơ thể và giao tiếp mắt'], ['Handle questions, including difficult ones', 'Xử lý câu hỏi, kể cả câu khó']],
    b: [`<p>Vietnamese is tonal and syllable-timed; English is <strong>stress-timed</strong>. Listeners need the stressed word of each phrase. Stress content words (nouns, main verbs, numbers) and reduce small words. Pause after each idea. Common Vietnamese-speaker problems: dropping final consonants (<em>sale</em> for <em>sales</em>, <em>asses</em>), flat intonation, and speaking too fast when nervous. Slow down by 20% and pause on numbers.</p>
<p>Look at the audience, not the slide; stand still, use open hands; do not read the slides aloud. Use notes with keywords only. Practise out loud three times with a timer.</p>
<p><strong>Q&amp;A.</strong> Listen to the whole question, thank the person, repeat or paraphrase: <em>So you are asking whether the cost includes training. Good question.</em> Answer briefly. If you do not know: <em>I do not have that figure with me, but I will find out and email you.</em> For a hostile question stay calm: <em>I understand your concern. Let me explain.</em> Close the Q&amp;A: <em>If there are no more questions, thank you again.</em></p>`,
       `<p>Tiếng Việt có thanh điệu và nhịp theo âm tiết; tiếng Anh nhịp theo <strong>trọng âm</strong> (stress-timed). Người nghe cần từ mang trọng âm của mỗi cụm. Nhấn từ nội dung (danh từ, động từ chính, số) và đọc nhẹ từ nhỏ. Dừng sau mỗi ý. Lỗi thường gặp của người Việt: rụng âm cuối (<em>sale</em> thay vì <em>sales</em>), ngữ điệu phẳng, và nói quá nhanh khi hồi hộp. Hãy chậm lại 20% và dừng ở các con số.</p>
<p>Nhìn khán giả, không nhìn slide; đứng yên, dùng bàn tay mở; đừng đọc nguyên slide. Ghi chú chỉ gồm từ khoá. Luyện nói to ba lần có bấm giờ.</p>
<p><strong>Hỏi đáp (Q&amp;A).</strong> Nghe hết câu hỏi, cảm ơn, nhắc lại hoặc diễn đạt lại: <em>So you are asking whether the cost includes training. Good question.</em> Trả lời ngắn. Nếu không biết: <em>I do not have that figure with me, but I will find out and email you.</em> Với câu hỏi gay gắt hãy bình tĩnh: <em>I understand your concern. Let me explain.</em> Kết thúc hỏi đáp: <em>If there are no more questions, thank you again.</em></p>`],
    voc: [['stress', 'emphasis on a syllable or word', 'trọng âm/nhấn'], ['pace', 'speed of speaking', 'tốc độ nói'], ['eye contact', 'looking at the listener', 'giao tiếp mắt'], ['paraphrase', 'repeat in other words', 'diễn đạt lại'], ['hostile', 'unfriendly, aggressive', 'gay gắt']],
    ph: [['That is a good question.', 'buying time', 'khen câu hỏi'], ['If I understand correctly, you are asking…', 'checking', 'kiểm lại'], ['I do not have the exact figure, but…', 'not knowing', 'không biết số'], ['Does that answer your question?', 'checking', 'hỏi đã rõ chưa'], ['Let us take one more question.', 'managing', 'giới hạn câu hỏi']],
    dlg: { t: ['Question and answer', 'Hỏi và đáp'], l: [
      ['Audience', 'Does this plan include training for staff?', 'Kế hoạch có gồm đào tạo nhân viên không?'],
      ['Speaker', 'Good question. If I understand correctly, you are asking about extra costs. Training is included in the first year, about two days per person. Does that answer your question?', 'Câu hỏi hay. Nếu tôi hiểu đúng, bạn hỏi chi phí phát sinh. Đào tạo nằm trong năm đầu, khoảng hai ngày mỗi người. Vậy đã rõ chưa?']] },
    pit: [['I read my slides.', 'I look at the audience and use keywords.', 'Reading kills attention.', 'Đọc slide làm mất sự chú ý.'],
          ['Sale (for sales)', 'sales /seɪlz/', 'Pronounce the final s.', 'Phát âm âm cuối s.'],
          ['I do not know. (end)', 'I will find out and email you.', 'Offer a follow-up.', 'Hứa theo dõi.']],
    s: [['Stress content words and pause.', 'Nhấn từ nội dung và dừng.'], ['Look at the audience; use keywords only.', 'Nhìn khán giả; chỉ dùng từ khoá.'], ['Q&A: listen, paraphrase, answer briefly.', 'Hỏi đáp: nghe, diễn đạt lại, trả lời ngắn.']],
    l: ['stress', 'intonation', 'nonv', 'bcSpeak'],
    p: [['Which words are stressed: "Sales rose by ten percent"?', 'Từ nào được nhấn: "Sales rose by ten percent"?', 'SALES ROSE ten PERcent (content words).', 'SALES ROSE ten PERcent (từ nội dung).'],
        ['Answer "What is the cost?" when you do not know.', 'Trả lời "What is the cost?" khi bạn không biết.', 'I do not have the exact figure with me, but I will email it to you tomorrow.', 'I do not have the exact figure with me, but I will email it to you tomorrow.']] }),
  Q(P + 'quiz-5', 'Quiz — Chapter 5: Presentations', 'Quiz — Chương 5: Thuyết trình', [
    ['A good opening has…|||Phần mở đầu tốt có…', ['hook, purpose, outline|||mồi, mục đích, dàn ý', 'only an apology|||chỉ lời xin lỗi', 'the whole data|||toàn bộ dữ liệu', 'a long story|||chuyện dài'], 0, 'Hook, purpose, outline.|||Mồi, mục đích, dàn ý.'],
    ['Signposting phrase:|||Cụm dẫn dắt:', ['That brings me to my next point.', 'Anyway whatever.', 'Blah blah.', 'Okay done.'], 0, 'Signposts guide listeners.|||Dẫn dắt người nghe.'],
    ['Correct:|||Đúng:', ['Sales increased to 10%.', 'Sales increased by 10%.', 'Sales increase with 10%.', 'Sales increased of 10%.'], 1, '"by" = amount.|||"by" = mức.'],
    ['"Sales" takes…|||"Sales" đi với…', ['plural verb|||động từ số nhiều', 'singular only|||chỉ số ít', 'no verb|||không động từ', 'adjective|||tính từ'], 0, 'Sales are rising.|||Sales are rising.'],
    ['Decimal in English:|||Thập phân trong tiếng Anh:', ['2,5', '2.5', '2/5', '2;5'], 1, 'English uses a dot.|||Tiếng Anh dùng dấu chấm.'],
    ['Stressed words are mostly…|||Từ được nhấn thường là…', ['content words|||từ nội dung', 'articles|||mạo từ', 'prepositions|||giới từ', 'none|||không từ nào'], 0, 'Nouns, verbs, numbers.|||Danh từ, động từ, số.'],
    ['If you do not know an answer:|||Nếu không biết câu trả lời:', ['Say nothing|||Im lặng', 'I will find out and email you.', 'That is a stupid question.', 'Skip'], 1, 'Promise follow-up.|||Hứa theo dõi.'],
    ['Number of main points in 5 minutes:|||Số ý chính trong 5 phút:', ['up to 3|||tối đa 3', '10|||10', '15|||15', '0|||0'], 0, 'Keep it short.|||Giữ ngắn.'],
  ]),
]));

// ===== Chương 6 =====
secs.push(SEC('Chapter 6 — Negotiation basics', 'Chương 6 — Đàm phán cơ bản',
  'Chuẩn bị, đề nghị và điều kiện, nhượng bộ và chốt thoả thuận.', [
  D(P + '6-1', '6.1 Preparing to negotiate: interests, limits and BATNA', '6.1 Chuẩn bị đàm phán: lợi ích, giới hạn và BATNA',
    'Xác định mục tiêu, giới hạn và phương án thay thế trước khi vào bàn đàm phán.', {
    n: '6.1',
    g: [['Separate positions from interests', 'Phân biệt lập trường với lợi ích'], ['Set target, limit and BATNA', 'Đặt mục tiêu, giới hạn và BATNA'], ['Use opening phrases', 'Dùng câu mở đầu đàm phán']],
    b: [`<p>Negotiation is a discussion to reach an agreement when two sides have different wants. Preparation decides most of the result. Write down: <strong>your target</strong> (ideal), <strong>your limit</strong> (the worst you accept, also called walk-away point), and your <strong>BATNA</strong> (Best Alternative To a Negotiated Agreement: what you do if no deal). The stronger your BATNA, the stronger your position.</p>
<p>Fisher and Ury (<em>Getting to Yes</em>) advise separating <strong>positions</strong> (what people say they want: "a 10% discount") from <strong>interests</strong> (why they want it: "to stay within budget"). Ask <em>why</em>: <em>Could you tell me what is most important for you?</em> Many deals add value by trading things that cost you little but matter to them (delivery time, payment terms, training).</p>
<p><strong>Opening.</strong> Build rapport, then set the frame: <em>Thank you for meeting us. I hope we can find a solution that works for both sides. Perhaps we could start with your main priorities.</em> Be friendly but firm. Take notes and confirm: <em>Let me check I have understood your position.</em></p>`,
       `<p>Đàm phán là thảo luận để đi đến thoả thuận khi hai bên muốn khác nhau. Chuẩn bị quyết định phần lớn kết quả. Hãy ghi ra: <strong>mục tiêu</strong> (lý tưởng), <strong>giới hạn</strong> (mức xấu nhất bạn chấp nhận, còn gọi là walk-away point) và <strong>BATNA</strong> (Best Alternative To a Negotiated Agreement: bạn làm gì nếu không đạt thoả thuận). BATNA càng mạnh, vị thế càng mạnh.</p>
<p>Fisher và Ury (<em>Getting to Yes</em>) khuyên tách <strong>lập trường</strong> (điều người ta nói họ muốn: "giảm 10%") khỏi <strong>lợi ích</strong> (vì sao họ muốn: "để nằm trong ngân sách"). Hãy hỏi <em>why</em>: <em>Could you tell me what is most important for you?</em> Nhiều thoả thuận tạo thêm giá trị bằng cách đổi những thứ bạn ít tốn nhưng bên kia coi trọng (thời gian giao, điều kiện thanh toán, đào tạo).</p>
<p><strong>Mở đầu.</strong> Tạo thiện cảm rồi đặt khung: <em>Thank you for meeting us. I hope we can find a solution that works for both sides. Perhaps we could start with your main priorities.</em> Thân thiện nhưng vững. Ghi chép và xác nhận: <em>Let me check I have understood your position.</em></p>`],
    voc: [['target', 'ideal result', 'mục tiêu lý tưởng'], ['limit / walk-away point', 'worst acceptable result', 'giới hạn chấp nhận'], ['BATNA', 'best alternative if no deal', 'phương án thay thế tốt nhất'], ['interest', 'underlying need', 'lợi ích thực'], ['leverage', 'power to influence', 'lợi thế thương lượng']],
    ph: [['What is most important for you?', 'finding interests', 'tìm lợi ích'], ['Let us see where we agree.', 'common ground', 'điểm chung'], ['Let me check I have understood.', 'confirming', 'xác nhận'], ['We are looking for a win-win solution.', 'frame', 'khung đôi bên cùng lợi'], ['What would it take to…?', 'exploring', 'thăm dò']],
    dlg: { t: ['Opening a negotiation', 'Mở đầu đàm phán'], l: [
      ['Buyer', 'Thank you for coming. We are interested in 500 units. Could you tell me what is most important for you in this deal?', 'Cảm ơn đã đến. Chúng tôi quan tâm 500 chiếc. Anh cho biết điều quan trọng nhất với anh trong thương vụ này?'],
      ['Seller', 'A long-term contract is our priority. And the price, of course.', 'Hợp đồng dài hạn là ưu tiên của chúng tôi. Và giá, tất nhiên.'],
      ['Buyer', 'That is helpful. We also prefer a long-term relationship. Perhaps we can look at price and payment terms together.', 'Hữu ích. Chúng tôi cũng thích quan hệ lâu dài. Có thể cùng xem giá và điều kiện thanh toán.']] },
    pit: [['I want the lowest price.', 'We are looking for a competitive price.', 'Demanding tone.', 'Giọng đòi hỏi.'],
          ['No discount, finish.', 'I am afraid a discount is difficult, but let me see what we can do.', 'Too closed.', 'Quá khép.'],
          ['Say yes to everything to be polite.', 'Say "let me consider" and check your limit.', 'Politeness is not agreement.', 'Lịch sự không có nghĩa là đồng ý.']],
    s: [['Prepare target, limit, BATNA.', 'Chuẩn bị mục tiêu, giới hạn, BATNA.'], ['Explore interests by asking why.', 'Hỏi why để tìm lợi ích.'], ['Open friendly and confirm understanding.', 'Mở thân thiện và xác nhận.']],
    l: ['nego', 'batna', 'getting', 'bizetiq'],
    p: [['Define target, limit and BATNA for buying 500 units.', 'Xác định mục tiêu, giới hạn và BATNA khi mua 500 chiếc.', 'Example: target 8% off; limit 3% off; BATNA another supplier at 2% off.', 'Ví dụ: mục tiêu giảm 8%; giới hạn 3%; BATNA nhà cung cấp khác giảm 2%.'],
        ['Turn into an interest question: "I want a discount."', 'Chuyển thành câu hỏi lợi ích: "I want a discount."', 'Could you tell me what is behind the discount you are asking for?', 'Could you tell me what is behind the discount you are asking for?']] }),
  D(P + '6-2', '6.2 Making offers, conditions and counter-offers', '6.2 Đưa đề nghị, điều kiện và đề nghị đối ứng',
    'Câu điều kiện loại 1 và mẫu câu đề nghị, từ chối, đối ứng.', {
    n: '6.2',
    g: [['Make an offer with conditions', 'Đưa đề nghị có điều kiện'], ['Use first conditional correctly', 'Dùng câu điều kiện loại 1 đúng'], ['Counter-offer and refuse politely', 'Đưa đề nghị đối ứng và từ chối lịch sự']],
    b: [`<p>The key grammar of negotiation is the <strong>first conditional</strong>: <em>If you order 500 units, we will give you 5% off.</em> Structure: <em>If + present simple, will + verb</em>. Never use <em>will</em> in the if-clause (<em>If you will order</em> is wrong). Also useful: <em>unless</em> (= if not), <em>as long as</em>, <em>provided that</em>: <em>We can deliver in two weeks, provided that you confirm by Friday.</em></p>
<p>For softer, less certain offers use the second conditional: <em>If you could pay in advance, we would be able to offer a better price.</em> Linking trades: <em>I could do X if you could do Y.</em> This protects you because every concession has a price.</p>
<p>Phrases: Offer: <em>We can offer you…</em>; Counter: <em>I am afraid that is a bit high for us. How about…?</em>; Refuse: <em>I am afraid we cannot go that far.</em>; Ask for movement: <em>Is there any flexibility on the price?</em> Check: <em>So, if I understand, you could deliver in three weeks if we order 600?</em></p>`,
       `<p>Ngữ pháp then chốt của đàm phán là <strong>câu điều kiện loại 1</strong>: <em>If you order 500 units, we will give you 5% off.</em> Cấu trúc: <em>If + hiện tại đơn, will + động từ</em>. Đừng dùng <em>will</em> trong mệnh đề if (<em>If you will order</em> là sai). Hữu ích nữa: <em>unless</em> (= nếu không), <em>as long as</em>, <em>provided that</em>: <em>We can deliver in two weeks, provided that you confirm by Friday.</em></p>
<p>Với đề nghị mềm, ít chắc chắn hơn, dùng điều kiện loại 2: <em>If you could pay in advance, we would be able to offer a better price.</em> Gắn các trao đổi: <em>I could do X if you could do Y.</em> Cách này bảo vệ bạn vì mỗi nhượng bộ đều có giá.</p>
<p>Mẫu câu: Đề nghị: <em>We can offer you…</em>; Đối ứng: <em>I am afraid that is a bit high for us. How about…?</em>; Từ chối: <em>I am afraid we cannot go that far.</em>; Xin linh hoạt: <em>Is there any flexibility on the price?</em> Kiểm tra: <em>So, if I understand, you could deliver in three weeks if we order 600?</em></p>`],
    voc: [['offer', 'what you propose', 'đề nghị'], ['counter-offer', 'a different offer in reply', 'đề nghị đối ứng'], ['condition', 'requirement for a deal', 'điều kiện'], ['flexibility', 'willingness to change', 'sự linh hoạt'], ['terms', 'conditions of a deal', 'điều khoản']],
    ph: [['If you…, we will…', 'conditional offer', 'đề nghị có điều kiện'], ['How about…?', 'counter-offer', 'đề nghị khác'], ['We could consider… provided that…', 'condition', 'điều kiện'], ['I am afraid that is not possible.', 'refusal', 'từ chối'], ['Is there any flexibility on…?', 'asking', 'xin linh hoạt']],
    dlg: { t: ['Offer and counter-offer', 'Đề nghị và đối ứng'], l: [
      ['Buyer', 'If we order 500 units, would you be able to offer a discount?', 'Nếu chúng tôi đặt 500 chiếc, anh có thể giảm giá không?'],
      ['Seller', 'If you order 500, we will give you 4% off.', 'Nếu đặt 500, chúng tôi giảm 4%.'],
      ['Buyer', 'I am afraid that is a bit low. How about 7%? We could confirm the order today.', 'Hơi thấp. 7% thì sao? Chúng tôi có thể chốt đơn hôm nay.'],
      ['Seller', 'I could do 6%, provided that you pay within 30 days.', 'Tôi có thể 6%, miễn là thanh toán trong 30 ngày.']] },
    pit: [['If you will order, we give.', 'If you order, we will give…', 'No will in the if-clause.', 'Không dùng will trong mệnh đề if.'],
          ['Give me a discount.', 'Would it be possible to get a discount?', 'Too direct.', 'Quá thẳng.'],
          ['Unless you do not pay…', 'Unless you pay…', 'Unless already means "if not".', 'Unless đã có nghĩa "nếu không".']],
    s: [['First conditional: If + present, will.', 'Điều kiện loại 1: If + hiện tại, will.'], ['Link concessions: if you X, we Y.', 'Gắn nhượng bộ: nếu bạn X, chúng tôi Y.'], ['Counter with "How about…?"', 'Đối ứng với "How about…?"']],
    l: ['nego', 'cond', 'salary', 'bcSpeak'],
    p: [['Make an offer: delivery in 2 weeks if payment is made upfront.', 'Đưa đề nghị: giao hàng trong 2 tuần nếu thanh toán trước.', 'If you pay upfront, we will deliver in two weeks.', 'If you pay upfront, we will deliver in two weeks.'],
        ['Fix: "If you will confirm, we will start."', 'Sửa: "If you will confirm, we will start."', 'If you confirm, we will start.', 'If you confirm, we will start.']] }),
  D(P + '6-3', '6.3 Making concessions, closing and confirming the deal', '6.3 Nhượng bộ, chốt và xác nhận thoả thuận',
    'Nhượng bộ có chủ đích, tóm tắt thoả thuận và gửi email xác nhận.', {
    n: '6.3',
    g: [['Make concessions without giving away value', 'Nhượng bộ mà không mất giá trị'], ['Close and summarise an agreement', 'Chốt và tóm tắt thoả thuận'], ['Write a confirmation email', 'Viết email xác nhận']],
    b: [`<p><strong>Concessions.</strong> Make them slowly, in small steps, and always ask for something in return: <em>If I lower the price, can you extend the contract?</em> Do not give a free concession because it teaches the other side to ask for more. Signal that it is hard: <em>That would be difficult for us, but I could try.</em> Use the principle of reciprocity.</p>
<p><strong>Closing.</strong> Watch for signs the other side is ready: they stop objecting and ask about details. Summarise every point: <em>So, to confirm: 500 units, 6% discount, payment within 30 days, delivery on 20 December. Is that right?</em> Then agree who does what: <em>I will send the draft contract by Monday.</em> Shake hands or close with a friendly phrase: <em>I am glad we reached an agreement.</em></p>
<p><strong>Confirmation email.</strong> Within a day send: <em>Dear Mr Hall, thank you for today's meeting. I am writing to confirm what we agreed: 1… 2… 3… Please let me know if I have missed anything. I will send the contract by Monday.</em> A written confirmation prevents later disagreements, especially across languages. If the talks fail, leave the door open: <em>I am sorry we could not agree this time. Please keep us in mind for the future.</em></p>`,
       `<p><strong>Nhượng bộ.</strong> Nhượng chậm, từng bước nhỏ, và luôn đòi lại thứ gì đó: <em>If I lower the price, can you extend the contract?</em> Đừng nhượng bộ miễn phí vì sẽ dạy bên kia đòi thêm. Cho thấy việc đó khó: <em>That would be difficult for us, but I could try.</em> Dùng nguyên tắc có đi có lại.</p>
<p><strong>Chốt.</strong> Để ý dấu hiệu bên kia sẵn sàng: họ ngừng phản đối và hỏi chi tiết. Tóm tắt từng điểm: <em>So, to confirm: 500 units, 6% discount, payment within 30 days, delivery on 20 December. Is that right?</em> Rồi thống nhất ai làm gì: <em>I will send the draft contract by Monday.</em> Bắt tay hoặc kết bằng câu thân thiện: <em>I am glad we reached an agreement.</em></p>
<p><strong>Email xác nhận.</strong> Trong vòng một ngày gửi: <em>Dear Mr Hall, thank you for today's meeting. I am writing to confirm what we agreed: 1… 2… 3… Please let me know if I have missed anything. I will send the contract by Monday.</em> Xác nhận bằng văn bản ngăn tranh cãi sau này, nhất là giữa các ngôn ngữ. Nếu thất bại, để ngỏ cửa: <em>I am sorry we could not agree this time. Please keep us in mind for the future.</em></p>`],
    voc: [['concession', 'something you give up', 'sự nhượng bộ'], ['deal', 'agreement', 'thương vụ/thoả thuận'], ['close the deal', 'finalise an agreement', 'chốt thương vụ'], ['reciprocity', 'giving in return', 'có đi có lại'], ['confirm', 'make sure in writing', 'xác nhận']],
    ph: [['I could meet you halfway.', 'compromise', 'thoả hiệp'], ['Let me summarise what we have agreed.', 'closing', 'tóm tắt'], ['Shall we say 6%?', 'closing', 'chốt'], ['I will send the contract by…', 'next step', 'bước tiếp'], ['We have a deal.', 'agreement', 'thống nhất']],
    dlg: { t: ['Closing and confirming', 'Chốt và xác nhận'], l: [
      ['Seller', 'Let me summarise: 500 units, 6% discount, payment within 30 days, delivery on 20 December.', 'Tóm tắt: 500 chiếc, giảm 6%, thanh toán 30 ngày, giao 20/12.'],
      ['Buyer', 'That is right. We have a deal.', 'Đúng. Ta chốt.'],
      ['Seller', 'Great. I will send the contract by Monday and confirm by email today.', 'Tốt. Tôi gửi hợp đồng trước thứ Hai và xác nhận bằng email hôm nay.']] },
    pit: [['OK OK OK.', 'Let me think about it and come back to you.', 'Do not rush to agree.', 'Đừng vội đồng ý.'],
          ['We agreed verbally, no email.', 'Send a confirmation email.', 'Written proof matters.', 'Bằng chứng viết rất quan trọng.'],
          ['I accept your offer, but... (long)', 'We accept, provided that…', 'State conditions clearly.', 'Nêu điều kiện rõ.']],
    s: [['Concede slowly and ask for something back.', 'Nhượng chậm và đòi lại.'], ['Summarise all points before closing.', 'Tóm tắt mọi điểm trước khi chốt.'], ['Confirm in writing within a day.', 'Xác nhận bằng văn bản trong một ngày.']],
    l: ['nego', 'mediation', 'getting', 'bcWrite'],
    p: [['Summarise a deal: 200 units, 3% off, 15 days payment.', 'Tóm tắt thoả thuận: 200 chiếc, giảm 3%, thanh toán 15 ngày.', 'To confirm: 200 units, a 3% discount and payment within 15 days.', 'To confirm: 200 units, a 3% discount and payment within 15 days.'],
        ['Why ask for something in return for a concession?', 'Vì sao đòi lại thứ gì khi nhượng bộ?', 'Free concessions teach the other side to ask for more.', 'Nhượng bộ miễn phí dạy bên kia đòi thêm.']] }),
  Q(P + 'quiz-6', 'Quiz — Chapter 6: Negotiation basics', 'Quiz — Chương 6: Đàm phán cơ bản', [
    ['BATNA means…|||BATNA nghĩa là…', ['best alternative to a negotiated agreement|||phương án thay thế tốt nhất', 'big all-time net average|||một chỉ số', 'basic account|||tài khoản cơ bản', 'a bank term|||một thuật ngữ ngân hàng'], 0, 'Your fallback.|||Phương án dự phòng.'],
    ['Interests are…|||Lợi ích là…', ['why people want something|||vì sao người ta muốn', 'what they say|||điều họ nói', 'prices only|||chỉ giá', 'tricks|||mánh'], 0, 'Positions vs interests.|||Lập trường và lợi ích.'],
    ['First conditional:|||Điều kiện loại 1:', ['If you will order, we give.', 'If you order, we will give.', 'If you ordered, we give.', 'If you order, we would give.'], 1, 'If + present, will.|||If + hiện tại, will.'],
    ['"Unless" means…|||"Unless" nghĩa là…', ['if not|||nếu không', 'because|||bởi vì', 'when|||khi', 'although|||mặc dù'], 0, 'No "not" after it.|||Không cần "not" sau nó.'],
    ['Polite counter-offer:|||Đề nghị đối ứng lịch sự:', ['No.', 'That is too high; how about 7%?', 'Give me 7%.', 'Never.'], 1, 'Explain and propose.|||Giải thích và đề xuất.'],
    ['A concession should…|||Nhượng bộ nên…', ['get something in return|||đổi lại được thứ gì', 'be free|||miễn phí', 'be big and early|||lớn và sớm', 'never happen|||không bao giờ'], 0, 'Reciprocity.|||Có đi có lại.'],
    ['Before closing you…|||Trước khi chốt bạn…', ['summarise the points|||tóm tắt các điểm', 'leave quietly|||lặng lẽ rời đi', 'change the topic|||đổi chủ đề', 'ask a joke|||kể đùa'], 0, 'Summarise.|||Tóm tắt.'],
    ['After the deal you…|||Sau thoả thuận bạn…', ['send a written confirmation|||gửi xác nhận bằng văn bản', 'do nothing|||không làm gì', 'delete notes|||xoá ghi chú', 'change terms|||đổi điều khoản'], 0, 'Written proof.|||Bằng chứng viết.'],
  ]),
]));
// ===== Chương 7 =====
secs.push(SEC('Chapter 7 — Small talk and intercultural communication', 'Chương 7 — Xã giao và giao tiếp liên văn hoá',
  'Chuyện xã giao, khác biệt văn hoá, giới thiệu và tiếp khách.', [
  D(P + '7-1', '7.1 Small talk: starting, keeping and ending conversations', '7.1 Small talk: bắt đầu, duy trì và kết thúc trò chuyện',
    'Chủ đề an toàn, câu hỏi mở, đáp lại và rút lui khéo.', {
    n: '7.1',
    g: [['Start a conversation with a safe topic', 'Bắt chuyện bằng chủ đề an toàn'], ['Keep it going with open questions and follow-ups', 'Duy trì bằng câu hỏi mở và câu hỏi nối tiếp'], ['End politely', 'Kết thúc lịch sự']],
    b: [`<p><strong>Small talk</strong> is light conversation before and after business. In many cultures it builds trust before work starts. Safe topics: the journey, the weather, the city, food, hobbies, work in general, events. Avoid: salary, age, weight, religion, politics, family problems.</p>
<p>Use the <strong>FORD</strong> memory: Family (lightly), Occupation, Recreation, Dreams or travel. Ask <strong>open questions</strong> (How, What, Tell me about…) rather than yes/no questions. Then follow up: <em>Really? What did you like most?</em> Share something about yourself, not only answer. Show interest with short reactions: <em>That sounds great. Oh, I see. Me too.</em></p>
<p><strong>Ending.</strong> <em>It was nice talking to you. I should say hello to a colleague. Let's keep in touch.</em> Vietnamese speakers are often asked "Are you married? How old are you?" at home; in English-speaking business settings these are private. Likewise do not say <em>You gained weight</em>. Compliment safely: <em>I like your presentation. Your English is excellent.</em> Respond to a compliment with thanks, not denial: <em>Thank you, that's kind of you.</em></p>`,
       `<p><strong>Small talk</strong> là chuyện nhẹ trước và sau công việc. Ở nhiều nền văn hoá nó tạo lòng tin trước khi vào việc. Chủ đề an toàn: chuyến đi, thời tiết, thành phố, ăn uống, sở thích, công việc nói chung, sự kiện. Tránh: lương, tuổi, cân nặng, tôn giáo, chính trị, chuyện gia đình.</p>
<p>Dùng mẹo <strong>FORD</strong>: Family (nhẹ nhàng), Occupation (nghề), Recreation (giải trí), Dreams hoặc du lịch. Hỏi <strong>câu hỏi mở</strong> (How, What, Tell me about…) thay vì câu có/không. Rồi hỏi nối tiếp: <em>Really? What did you like most?</em> Chia sẻ về mình, đừng chỉ trả lời. Thể hiện quan tâm bằng phản ứng ngắn: <em>That sounds great. Oh, I see. Me too.</em></p>
<p><strong>Kết thúc.</strong> <em>It was nice talking to you. I should say hello to a colleague. Let's keep in touch.</em> Ở Việt Nam người ta hay hỏi "Anh/chị lập gia đình chưa? Bao nhiêu tuổi?"; trong bối cảnh kinh doanh nói tiếng Anh những điều này là riêng tư. Cũng đừng nói <em>You gained weight</em>. Khen an toàn: <em>I like your presentation. Your English is excellent.</em> Đáp lời khen bằng cảm ơn, đừng phủ nhận: <em>Thank you, that's kind of you.</em></p>`],
    voc: [['small talk', 'light, polite conversation', 'chuyện xã giao'], ['icebreaker', 'something that starts a conversation', 'câu phá băng'], ['open question', 'question needing more than yes/no', 'câu hỏi mở'], ['compliment', 'praise', 'lời khen'], ['keep in touch', 'stay in contact', 'giữ liên lạc']],
    ph: [['How was your journey?', 'opening', 'mở đầu'], ['Have you been to Vietnam before?', 'topic', 'chủ đề'], ['What do you do in your free time?', 'hobbies', 'sở thích'], ['That sounds interesting.', 'reacting', 'phản ứng'], ['It was great meeting you.', 'closing', 'kết thúc']],
    dlg: { t: ['Small talk at a conference', 'Xã giao ở hội nghị'], l: [
      ['Anna', 'Hi, I am Anna. Is this your first time in Ho Chi Minh City?', 'Chào, mình là Anna. Đây là lần đầu bạn đến TP.HCM?'],
      ['Lan', 'Actually I live here! How was your flight?', 'Thật ra mình sống ở đây! Chuyến bay của bạn thế nào?'],
      ['Anna', 'Long, but fine. What would you recommend I eat tonight?', 'Dài, nhưng ổn. Tối nay bạn gợi ý ăn gì?'],
      ['Lan', 'You must try bun cha. I can give you the address. It was great talking to you, Anna. Let\'s keep in touch.', 'Bạn phải thử bún chả. Mình cho bạn địa chỉ. Rất vui được trò chuyện, Anna. Giữ liên lạc nhé.']] },
    pit: [['How old are you? Are you married?', 'What do you do? How long have you worked here?', 'Private questions.', 'Câu hỏi riêng tư.'],
          ['No, I am not beautiful. (to a compliment)', 'Thank you, that\'s kind of you.', 'Accept compliments.', 'Nhận lời khen.'],
          ['Yes. / No. (one word)', 'Yes, I did. I really enjoyed…', 'Add a sentence.', 'Thêm một câu.']],
    s: [['Safe topics: journey, city, food, hobbies, work.', 'Chủ đề an toàn: chuyến đi, thành phố, ăn uống, sở thích, việc.'], ['Open questions + follow-ups.', 'Câu hỏi mở + hỏi nối tiếp.'], ['Accept compliments; end politely.', 'Nhận lời khen; kết lịch sự.']],
    l: ['small', 'greeting', 'bizetiq', 'bcSpeak'],
    p: [['Write three open questions for a visitor from Germany.', 'Viết ba câu hỏi mở cho khách từ Đức.', 'How was your trip? What do you think of the city so far? What would you like to see while you are here?', 'How was your trip? What do you think of the city so far? What would you like to see while you are here?'],
        ['Reply to "Your English is very good!"', 'Đáp "Your English is very good!"', 'Thank you, that\'s kind of you.', 'Thank you, that\'s kind of you.']] }),
  D(P + '7-2', '7.2 Cultural differences at work: direct vs indirect, hierarchy and time', '7.2 Khác biệt văn hoá nơi làm việc: thẳng/gián tiếp, cấp bậc, thời gian',
    'Khái niệm văn hoá ngữ cảnh cao/thấp, khoảng cách quyền lực và cách áp dụng.', {
    n: '7.2',
    g: [['Explain high-context and low-context communication', 'Giải thích giao tiếp ngữ cảnh cao và thấp'], ['Describe hierarchy and time attitudes', 'Mô tả thái độ với cấp bậc và thời gian'], ['Adapt without stereotyping', 'Thích nghi mà không rập khuôn']],
    b: [`<p>Cultures differ in how they communicate at work. Researchers describe <strong>low-context</strong> cultures (e.g. USA, Germany, Netherlands) where messages are explicit and direct, and <strong>high-context</strong> cultures (e.g. Japan, China, Vietnam) where much meaning is in the situation and what is not said. A Vietnamese "We will consider it" may mean "no"; an American may hear "maybe yes".</p>
<p>Other dimensions (Hofstede, Meyer): <strong>power distance</strong> (how much people accept unequal power: in high-power-distance cultures juniors rarely challenge bosses), <strong>feedback style</strong> (direct negative feedback in the Netherlands vs softened feedback in Asia), and <strong>time</strong> (strict schedules vs flexible time). In international teams these differences create misunderstanding: silence may mean respect or disagreement; "yes" may mean "I hear you".</p>
<p><strong>Strategy.</strong> Observe, ask, check meaning, and adapt your style a little: <em>Just to be sure, does that mean you agree with the plan?</em> Use "may I check" questions; summarise decisions in writing. Treat the models as tendencies, not rules: individuals vary, and company culture and age matter. Do not say <em>Americans are rude</em> or <em>Asians never disagree</em>: that is stereotyping.</p>`,
       `<p>Các nền văn hoá khác nhau về cách giao tiếp công việc. Nhà nghiên cứu mô tả văn hoá <strong>ngữ cảnh thấp</strong> (low-context; ví dụ Mỹ, Đức, Hà Lan) nơi thông điệp rõ và thẳng, và văn hoá <strong>ngữ cảnh cao</strong> (high-context; ví dụ Nhật, Trung Quốc, Việt Nam) nơi nhiều ý nằm trong hoàn cảnh và điều không nói ra. Câu "We will consider it" của người Việt có thể nghĩa "không"; người Mỹ có thể nghe là "có lẽ đồng ý".</p>
<p>Các chiều khác (Hofstede, Meyer): <strong>khoảng cách quyền lực</strong> (mức chấp nhận bất bình đẳng quyền lực: ở nơi khoảng cách cao, cấp dưới ít phản biện sếp), <strong>kiểu phản hồi</strong> (phê bình thẳng ở Hà Lan so với phản hồi làm mềm ở châu Á) và <strong>thời gian</strong> (lịch chặt so với linh hoạt). Trong đội quốc tế những khác biệt này gây hiểu lầm: im lặng có thể là tôn trọng hoặc phản đối; "yes" có thể là "tôi nghe bạn nói".</p>
<p><strong>Chiến lược.</strong> Quan sát, hỏi, kiểm lại nghĩa và điều chỉnh phong cách một chút: <em>Just to be sure, does that mean you agree with the plan?</em> Dùng câu "may I check"; tóm tắt quyết định bằng văn bản. Coi các mô hình là xu hướng, không phải luật: mỗi người khác nhau, văn hoá công ty và tuổi cũng quan trọng. Đừng nói <em>Americans are rude</em> hay <em>Asians never disagree</em>: đó là định kiến.</p>`],
    voc: [['high-context', 'meaning is implicit in the situation', 'ngữ cảnh cao, ngầm hiểu'], ['low-context', 'meaning is explicit in words', 'ngữ cảnh thấp, nói rõ'], ['power distance', 'acceptance of unequal power', 'khoảng cách quyền lực'], ['stereotype', 'fixed idea about a group', 'định kiến'], ['adapt', 'change to fit', 'thích nghi']],
    ph: [['Just to make sure we understand each other,…', 'checking', 'kiểm tra hiểu nhau'], ['In my culture, people usually…', 'explaining', 'giải thích văn hoá mình'], ['How do you usually handle…?', 'asking', 'hỏi cách làm'], ['Could you be a little more specific?', 'clarifying', 'xin cụ thể hơn'], ['I may have misunderstood. Let me check.', 'repair', 'sửa hiểu lầm']],
    dlg: { t: ['A misunderstanding', 'Một hiểu lầm'], l: [
      ['Manager (Dutch)', 'Is the deadline realistic?', 'Hạn chót có thực tế không?'],
      ['Nam (Vietnamese)', 'We will try our best.', 'Chúng tôi sẽ cố gắng hết sức.'],
      ['Manager', 'Just to make sure: does that mean yes or no?', 'Để chắc chắn: nghĩa là có hay không?'],
      ['Nam', 'Honestly, it is difficult. We need two more weeks. I should have said that earlier.', 'Thật ra khó. Chúng tôi cần thêm hai tuần. Lẽ ra tôi nên nói sớm hơn.']] },
    pit: [['We will try our best. (meaning "no")', 'It is difficult; we need X to make it possible.', 'Indirect "yes" confuses.', 'Câu "yes" gián tiếp gây rối.'],
          ['Silence when disagreeing.', 'I have a concern about…', 'Speak up in international teams.', 'Hãy nói trong đội quốc tế.'],
          ['All foreigners are direct.', 'Many people in that culture tend to be direct.', 'Avoid stereotypes.', 'Tránh định kiến.']],
    s: [['High vs low context.', 'Ngữ cảnh cao so với thấp.'], ['Power distance, feedback, time.', 'Khoảng cách quyền lực, phản hồi, thời gian.'], ['Adapt, check and avoid stereotypes.', 'Thích nghi, kiểm tra, tránh định kiến.']],
    l: ['hlc', 'hof', 'pdist', 'meyerSite'],
    p: [['Rewrite a vague answer "We will try" into a clear one for a Dutch boss.', 'Viết lại câu mơ hồ "We will try" thành câu rõ cho sếp Hà Lan.', 'We can deliver by Friday only if we get the data today; otherwise we need until next Wednesday.', 'We can deliver by Friday only if we get the data today; otherwise we need until next Wednesday.'],
        ['Why is "Asians never disagree" a stereotype?', 'Vì sao "Asians never disagree" là định kiến?', 'It generalises all individuals; people and companies vary.', 'Nó khái quát hoá mọi cá nhân; con người và công ty khác nhau.']] }),
  D(P + '7-3', '7.3 Introductions, hosting visitors and networking', '7.3 Giới thiệu, tiếp khách và kết nối',
    'Giới thiệu bản thân/đồng nghiệp, trao danh thiếp, đón khách và theo dõi sau sự kiện.', {
    n: '7.3',
    g: [['Introduce yourself and others', 'Giới thiệu bản thân và người khác'], ['Host a foreign visitor', 'Tiếp khách nước ngoài'], ['Follow up after networking', 'Theo dõi sau khi kết nối']],
    b: [`<p><strong>Introducing yourself.</strong> Use a 20-second pitch: name, role, company, one interesting fact. <em>Hi, I am Lan Pham. I work as a project coordinator at ABC Software, where we build apps for logistics companies.</em> Add a question: <em>And what about you?</em> Shake hands briefly; in some cultures a nod or a bow is more normal. Business cards are given with two hands in many Asian countries; read the card for a moment before putting it away.</p>
<p><strong>Introducing others.</strong> The lower rank is introduced to the higher rank: <em>Mr Hall, this is Lan, our project coordinator. Lan, this is Mr Hall from Delta Trading.</em> Add a link so they can talk: <em>You both work in logistics.</em></p>
<p><strong>Hosting.</strong> Meet the visitor, offer water or coffee, show the toilets and the plan: <em>We will start with a short meeting, then lunch, then a factory tour.</em> Ask about dietary needs. <strong>Follow up</strong> within 48 hours: <em>It was great meeting you at the conference on Tuesday. As promised, I am sending the link to… I would love to stay in touch.</em> Connect on LinkedIn with a personal note, not the default message.</p>`,
       `<p><strong>Tự giới thiệu.</strong> Dùng bài chào 20 giây: tên, vai trò, công ty, một điều thú vị. <em>Hi, I am Lan Pham. I work as a project coordinator at ABC Software, where we build apps for logistics companies.</em> Thêm câu hỏi: <em>And what about you?</em> Bắt tay ngắn; ở một số nền văn hoá gật đầu hoặc cúi chào thông dụng hơn. Danh thiếp ở nhiều nước châu Á được trao bằng hai tay; hãy đọc danh thiếp một lúc trước khi cất.</p>
<p><strong>Giới thiệu người khác.</strong> Người cấp thấp được giới thiệu cho người cấp cao: <em>Mr Hall, this is Lan, our project coordinator. Lan, this is Mr Hall from Delta Trading.</em> Thêm điểm chung để họ nói chuyện: <em>You both work in logistics.</em></p>
<p><strong>Tiếp khách.</strong> Đón khách, mời nước hoặc cà phê, chỉ nhà vệ sinh và nói lịch: <em>We will start with a short meeting, then lunch, then a factory tour.</em> Hỏi nhu cầu ăn uống. <strong>Theo dõi</strong> trong 48 giờ: <em>It was great meeting you at the conference on Tuesday. As promised, I am sending the link to… I would love to stay in touch.</em> Kết nối LinkedIn kèm lời nhắn riêng, không dùng tin mặc định.</p>`],
    voc: [['business card', 'card with contact details', 'danh thiếp'], ['introduce', 'present someone to another', 'giới thiệu'], ['host', 'receive visitors', 'tiếp khách'], ['network', 'build professional contacts', 'xây dựng quan hệ'], ['as promised', 'as I said I would', 'như đã hứa']],
    ph: [['Let me introduce myself.', 'self-introduction', 'tự giới thiệu'], ['May I introduce you to…?', 'introducing', 'giới thiệu'], ['Pleased to meet you.', 'greeting', 'chào'], ['Here is my card.', 'card', 'đưa danh thiếp'], ['It was great meeting you at…', 'follow-up', 'theo dõi']],
    dlg: { t: ['Introducing a colleague', 'Giới thiệu đồng nghiệp'], l: [
      ['Lan', 'Mr Hall, may I introduce Minh, our lead developer? Minh, this is Mr Hall from Delta Trading.', 'Ông Hall, tôi xin giới thiệu Minh, trưởng nhóm lập trình. Minh, đây là ông Hall bên Delta Trading.'],
      ['Mr Hall', 'Pleased to meet you, Minh.', 'Hân hạnh gặp anh Minh.'],
      ['Minh', 'Pleased to meet you too. Here is my card. How was your flight?', 'Rất hân hạnh. Danh thiếp của tôi. Chuyến bay của ông thế nào?']] },
    pit: [['I am very happy to know you.', 'Pleased to meet you.', '"Know" vs "meet".', '"Know" khác "meet".'],
          ['My name is Nguyen, call me Mr Nguyen.', 'I am Nguyen An; please call me An.', 'Family name comes first; clarify the given name.', 'Họ đứng trước; nói rõ tên gọi.'],
          ['Put the card in the pocket at once.', 'Read the card, then put it away carefully.', 'Cards show respect.', 'Danh thiếp thể hiện sự tôn trọng.']],
    s: [['20-second self-introduction.', 'Chào bản thân 20 giây.'], ['Lower rank introduced to higher rank.', 'Cấp thấp giới thiệu cho cấp cao.'], ['Follow up within 48 hours.', 'Theo dõi trong 48 giờ.']],
    l: ['bizcard', 'greeting', 'linkedin', 'pitch'],
    p: [['Write your 20-second self-introduction.', 'Viết bài giới thiệu bản thân 20 giây.', 'Hi, I am… I study/work as… at… I am interested in…', 'Hi, I am… I study/work as… at… I am interested in…'],
        ['Write a follow-up sentence after meeting at a fair.', 'Viết câu theo dõi sau khi gặp ở hội chợ.', 'It was great meeting you at the fair on Tuesday. I would love to stay in touch.', 'It was great meeting you at the fair on Tuesday. I would love to stay in touch.']] }),
  Q(P + 'quiz-7', 'Quiz — Chapter 7: Small talk and intercultural communication', 'Quiz — Chương 7: Xã giao và giao tiếp liên văn hoá', [
    ['A safe small-talk topic:|||Chủ đề xã giao an toàn:', ['salary|||lương', 'the weather|||thời tiết', 'age|||tuổi', 'politics|||chính trị'], 1, 'Avoid private topics.|||Tránh chuyện riêng tư.'],
    ['An open question:|||Câu hỏi mở:', ['Do you like it?', 'What do you think of the city?', 'Is it good?', 'Yes?'], 1, 'Needs more than yes/no.|||Cần nhiều hơn có/không.'],
    ['Reply to a compliment:|||Đáp lời khen:', ['No, no, I am bad.', 'Thank you, that is kind of you.', 'You are lying.', 'Silence'], 1, 'Accept it.|||Nhận lời khen.'],
    ['High-context cultures…|||Văn hoá ngữ cảnh cao…', ['rely on implied meaning|||dựa vào ý ngầm', 'say everything directly|||nói mọi thứ thẳng', 'have no meaning|||không có nghĩa', 'use only email|||chỉ dùng email'], 0, 'Meaning is in context.|||Nghĩa nằm trong ngữ cảnh.'],
    ['A stereotype is…|||Định kiến là…', ['a fixed generalisation|||sự khái quát cố định', 'a fact|||một sự thật', 'a greeting|||lời chào', 'a rule|||một luật'], 0, 'Avoid it.|||Tránh nó.'],
    ['To check meaning across cultures:|||Để kiểm nghĩa giữa các văn hoá:', ['Just to make sure, does that mean yes?', 'You are unclear.', 'Obviously.', 'Never mind.'], 0, 'Check politely.|||Kiểm lịch sự.'],
    ['Who is introduced first?|||Ai được giới thiệu trước?', ['the higher-ranking person is addressed first, lower rank is introduced to them|||người cấp cao được nói trước, cấp thấp được giới thiệu cho họ', 'anyone|||ai cũng được', 'the youngest|||người trẻ nhất', 'nobody|||không ai'], 0, 'Lower to higher.|||Thấp cho cao.'],
    ['Follow up after a conference:|||Theo dõi sau hội nghị:', ['within 48 hours|||trong 48 giờ', 'after a year|||sau một năm', 'never|||không bao giờ', 'by phone only at midnight|||chỉ gọi lúc nửa đêm'], 0, 'Be timely.|||Đúng lúc.'],
  ]),
]));

// ===== Chương 8 =====
secs.push(SEC('Chapter 8 — Short reports and proposals', 'Chương 8 — Báo cáo và đề xuất ngắn',
  'Viết báo cáo một trang, tóm tắt điều hành và đề xuất ngắn.', [
  D(P + '8-1', '8.1 Writing a short report', '8.1 Viết một báo cáo ngắn',
    'Cấu trúc báo cáo ngắn: mục đích, phát hiện, kết luận, khuyến nghị.', {
    n: '8.1',
    g: [['Plan a one-page report', 'Lập báo cáo một trang'], ['Use headings and lists', 'Dùng tiêu đề và danh sách'], ['Write findings and recommendations', 'Viết phát hiện và khuyến nghị']],
    b: [`<p>A short business report answers a question for a busy reader. Standard structure: <strong>Title · Introduction/Purpose · Findings · Conclusion · Recommendations</strong>. Add a date, author and, if needed, an appendix. Use headings, numbered lists and short paragraphs. Use neutral, impersonal style: <em>The survey shows that…</em>, <em>It is recommended that…</em>, <em>The main finding is…</em>.</p>
<p><strong>Introduction:</strong> <em>The purpose of this report is to evaluate the current customer support process and recommend improvements.</em> <strong>Findings:</strong> facts and data only, grouped by topic. <strong>Conclusion:</strong> what the findings mean, in one or two sentences. <strong>Recommendations:</strong> concrete steps with owner and cost if possible: <em>The company should introduce a chatbot for common questions.</em></p>
<p>Language: use the past simple for what you did (<em>We surveyed 120 customers</em>), present simple for facts that are still true (<em>Most customers prefer chat</em>), and modals for advice (<em>should, could</em>). Avoid slang and contractions. Check numbers twice, and say if data is limited: <em>The sample was small, so the results are only indicative.</em></p>`,
       `<p>Một báo cáo kinh doanh ngắn trả lời một câu hỏi cho người đọc bận rộn. Cấu trúc chuẩn: <strong>Tiêu đề · Giới thiệu/Mục đích · Phát hiện · Kết luận · Khuyến nghị</strong>. Thêm ngày, tác giả và, nếu cần, phụ lục. Dùng tiêu đề, danh sách đánh số và đoạn ngắn. Dùng văn phong trung lập, khách quan: <em>The survey shows that…</em>, <em>It is recommended that…</em>, <em>The main finding is…</em>.</p>
<p><strong>Giới thiệu:</strong> <em>The purpose of this report is to evaluate the current customer support process and recommend improvements.</em> <strong>Phát hiện:</strong> chỉ sự kiện và số liệu, chia theo chủ đề. <strong>Kết luận:</strong> các phát hiện có nghĩa gì, trong một hai câu. <strong>Khuyến nghị:</strong> bước cụ thể, nếu được có người phụ trách và chi phí: <em>The company should introduce a chatbot for common questions.</em></p>
<p>Ngôn ngữ: quá khứ đơn cho việc đã làm (<em>We surveyed 120 customers</em>), hiện tại đơn cho điều còn đúng (<em>Most customers prefer chat</em>), động từ khuyết thiếu cho lời khuyên (<em>should, could</em>). Tránh tiếng lóng và dạng rút gọn. Kiểm số hai lần và nói rõ nếu dữ liệu hạn chế: <em>The sample was small, so the results are only indicative.</em></p>`],
    voc: [['findings', 'results of research', 'phát hiện'], ['recommendation', 'suggested action', 'khuyến nghị'], ['appendix', 'extra material at the end', 'phụ lục'], ['sample', 'small group studied', 'mẫu khảo sát'], ['indicative', 'suggesting but not proving', 'mang tính chỉ báo']],
    ph: [['The purpose of this report is to…', 'intro', 'mục đích'], ['The survey shows that…', 'findings', 'phát hiện'], ['It can be concluded that…', 'conclusion', 'kết luận'], ['It is recommended that…', 'recommendation', 'khuyến nghị'], ['According to…', 'source', 'theo nguồn']],
    dlg: { t: ['Mini report extract', 'Trích báo cáo mẫu'], l: [
      ['Title', 'Report on customer support response times, November 2025', 'Báo cáo về thời gian phản hồi hỗ trợ khách hàng, 11/2025'],
      ['Purpose', 'The purpose of this report is to identify why replies take three days and recommend solutions.', 'Mục đích: tìm lý do phản hồi mất ba ngày và đề xuất giải pháp.'],
      ['Findings', '1. The team receives about 200 emails per day. 2. Only 3 staff answer emails. 3. 60% of questions are repeated.', '1. Nhận khoảng 200 email mỗi ngày. 2. Chỉ 3 nhân viên trả lời. 3. 60% câu hỏi lặp lại.'],
      ['Recommendation', 'It is recommended that the company introduce an FAQ page and hire one more staff member.', 'Khuyến nghị: lập trang FAQ và tuyển thêm một nhân viên.']] },
    pit: [['In this report I will tell about...', 'This report examines…', 'Use formal verbs.', 'Dùng động từ trang trọng.'],
          ['The data are shown in the below table.', 'The data are shown in the table below.', 'Word order.', 'Thứ tự từ.'],
          ['I think the staff are lazy.', 'The findings suggest that workload is too high.', 'Report facts, not opinions.', 'Báo cáo sự kiện, không phải ý riêng.']],
    s: [['Title, purpose, findings, conclusion, recommendations.', 'Tiêu đề, mục đích, phát hiện, kết luận, khuyến nghị.'], ['Neutral style; facts and data.', 'Văn phong trung lập; sự kiện và số liệu.'], ['Recommendations are concrete.', 'Khuyến nghị cụ thể.']],
    l: ['techw', 'annual', 'summ', 'bcWrite'],
    p: [['Write a one-sentence purpose for a report on office energy use.', 'Viết câu mục đích cho báo cáo về mức dùng điện văn phòng.', 'The purpose of this report is to examine energy use in the office and suggest ways to reduce it.', 'The purpose of this report is to examine energy use in the office and suggest ways to reduce it.'],
        ['Turn into a recommendation: "Buy LED lamps."', 'Chuyển thành khuyến nghị: "Buy LED lamps."', 'It is recommended that the company replace the current lamps with LED lamps.', 'It is recommended that the company replace the current lamps with LED lamps.']] }),
  D(P + '8-2', '8.2 Executive summary and writing for busy readers', '8.2 Tóm tắt điều hành và viết cho người đọc bận rộn',
    'Viết executive summary một đoạn và memo ngắn.', {
    n: '8.2',
    g: [['Write a 5-sentence executive summary', 'Viết tóm tắt điều hành 5 câu'], ['Write a short memo', 'Viết memo ngắn'], ['Use bullet points effectively', 'Dùng gạch đầu dòng hiệu quả']],
    b: [`<p>An <strong>executive summary</strong> lets a manager decide without reading the whole report. Keep it to one paragraph (150–200 words). Five sentences: <strong>1 the problem, 2 what you did, 3 the main finding, 4 the recommendation, 5 the cost/benefit or next step</strong>. Write it last, but put it first.</p>
<p><em>Customer replies take three days on average. We analysed 600 emails over one month. The main cause is repeated questions handled by only three staff. We recommend an FAQ page and one extra staff member. This would cut reply time to one day for a cost of about 25 million dong per year.</em></p>
<p><strong>Memo</strong> (internal note): <em>To / From / Date / Subject</em>, then purpose in the first line, details, and action: <em>Please confirm by Friday.</em> Use bullets for parallel items, with the same grammar in each (all verbs or all nouns). Do not use more than 5–7 bullets. Bold the key figure. Avoid long sentences with many commas; split them.</p>`,
       `<p><strong>Executive summary</strong> giúp quản lý quyết định mà không phải đọc toàn bộ báo cáo. Giữ trong một đoạn (150–200 từ). Năm câu: <strong>1 vấn đề, 2 việc bạn đã làm, 3 phát hiện chính, 4 khuyến nghị, 5 chi phí/lợi ích hoặc bước tiếp</strong>. Viết sau cùng nhưng đặt đầu tiên.</p>
<p><em>Customer replies take three days on average. We analysed 600 emails over one month. The main cause is repeated questions handled by only three staff. We recommend an FAQ page and one extra staff member. This would cut reply time to one day for a cost of about 25 million dong per year.</em></p>
<p><strong>Memo</strong> (ghi chú nội bộ): <em>To / From / Date / Subject</em>, rồi mục đích ngay dòng đầu, chi tiết và hành động: <em>Please confirm by Friday.</em> Dùng gạch đầu dòng cho các mục song song, cùng cấu trúc ngữ pháp (toàn động từ hoặc toàn danh từ). Không quá 5–7 gạch. In đậm con số then chốt. Tránh câu dài nhiều dấu phẩy; hãy tách ra.</p>`],
    voc: [['executive summary', 'short overview for decision makers', 'tóm tắt điều hành'], ['memo', 'short internal note', 'bản ghi nhớ nội bộ'], ['bullet point', 'list item', 'gạch đầu dòng'], ['overview', 'general view', 'cái nhìn tổng quát'], ['key figure', 'most important number', 'con số then chốt']],
    ph: [['This report analyses…', 'start summary', 'mở tóm tắt'], ['The main finding is that…', 'finding', 'phát hiện chính'], ['We recommend that…', 'recommendation', 'khuyến nghị'], ['This would reduce… by…', 'benefit', 'lợi ích'], ['Please confirm by…', 'memo action', 'hành động trong memo']],
    dlg: { t: ['Sample memo', 'Memo mẫu'], l: [
      ['Memo', 'To: All staff. From: HR. Date: 14 Nov. Subject: Office closure on 2 January.', 'Gửi: toàn thể nhân viên. Từ: Nhân sự. Ngày 14/11. Chủ đề: nghỉ ngày 2/1.'],
      ['Body', 'The office will be closed on Friday 2 January. Please finish urgent work before 31 December and update your out-of-office message. Questions to HR by 20 December.', 'Văn phòng nghỉ thứ Sáu 2/1. Hoàn thành việc gấp trước 31/12 và cập nhật thư vắng mặt. Hỏi nhân sự trước 20/12.']] },
    pit: [['A summary of 2 pages.', 'A summary of one paragraph.', 'Too long defeats the purpose.', 'Quá dài làm mất mục đích.'],
          ['Bullets: Reduce cost / Costs / To save money', 'Reduce cost / Improve speed / Add staff', 'Parallel grammar.', 'Cấu trúc song song.'],
          ['Summary starts with history.', 'Summary starts with the problem and finding.', 'Lead with the point.', 'Vào ngay ý chính.']],
    s: [['Executive summary: 5 sentences, written last.', 'Tóm tắt điều hành: 5 câu, viết sau cùng.'], ['Memo: purpose first.', 'Memo: mục đích trước.'], ['Parallel bullets, max 5–7.', 'Gạch song song, tối đa 5–7.']],
    l: ['summ', 'memo', 'plain', 'plainGov'],
    p: [['Write a 2-sentence summary: sales fell 10% because of a late product launch.', 'Viết tóm tắt 2 câu: doanh số giảm 10% vì ra mắt sản phẩm muộn.', 'Sales fell by 10% in Q3 because the new product launched two months late. We recommend fixed launch dates for next year.', 'Sales fell by 10% in Q3 because the new product launched two months late. We recommend fixed launch dates for next year.'],
        ['Make parallel: "Saving time / to reduce costs / improvement of quality".', 'Làm song song: "Saving time / to reduce costs / improvement of quality".', 'Save time / Reduce costs / Improve quality', 'Save time / Reduce costs / Improve quality']] }),
  D(P + '8-3', '8.3 Writing a short proposal', '8.3 Viết một đề xuất ngắn',
    'Cấu trúc proposal một đến hai trang: vấn đề, giải pháp, kế hoạch, ngân sách, lời kêu gọi.', {
    n: '8.3',
    g: [['Structure a short proposal', 'Cấu trúc một đề xuất ngắn'], ['Persuade with benefits, not features', 'Thuyết phục bằng lợi ích, không chỉ tính năng'], ['Give a timeline and budget', 'Nêu lịch trình và ngân sách']],
    b: [`<p>A <strong>proposal</strong> asks someone to approve an idea or buy a service. Short structure: <strong>1 Summary · 2 Problem/Need · 3 Proposed solution · 4 Benefits · 5 Plan and timeline · 6 Budget · 7 Next step</strong>. Customers care about <em>their</em> problem, so start with it: <em>Your support team currently needs three days to reply, which costs you customers.</em></p>
<p><strong>Benefits not features.</strong> A feature: <em>a chatbot</em>. A benefit: <em>answers 60% of questions instantly, so staff can focus on difficult cases.</em> Support claims with evidence: a number, a case study, a testimonial. Use <em>will</em> for promises (<em>We will deliver within 8 weeks</em>), and be realistic.</p>
<p><strong>Plan and budget.</strong> A small table: phase, task, date, cost. End with a clear call to action: <em>If you agree, we can start on 1 December. Please confirm by 20 November.</em> Proofread; mistakes reduce trust. Keep the tone confident and polite, not pushy: <em>We would be delighted to discuss this further.</em></p>`,
       `<p><strong>Proposal</strong> (đề xuất) xin ai đó duyệt một ý tưởng hoặc mua một dịch vụ. Cấu trúc ngắn: <strong>1 Tóm tắt · 2 Vấn đề/Nhu cầu · 3 Giải pháp · 4 Lợi ích · 5 Kế hoạch và lịch · 6 Ngân sách · 7 Bước tiếp</strong>. Khách quan tâm vấn đề <em>của họ</em>, nên bắt đầu bằng đó: <em>Your support team currently needs three days to reply, which costs you customers.</em></p>
<p><strong>Lợi ích chứ không chỉ tính năng.</strong> Tính năng: <em>a chatbot</em>. Lợi ích: <em>answers 60% of questions instantly, so staff can focus on difficult cases.</em> Hỗ trợ khẳng định bằng bằng chứng: con số, nghiên cứu điển hình, lời chứng thực. Dùng <em>will</em> cho lời hứa (<em>We will deliver within 8 weeks</em>), và thực tế.</p>
<p><strong>Kế hoạch và ngân sách.</strong> Một bảng nhỏ: giai đoạn, việc, ngày, chi phí. Kết bằng lời kêu gọi hành động rõ: <em>If you agree, we can start on 1 December. Please confirm by 20 November.</em> Soát lỗi; lỗi làm giảm lòng tin. Giữ giọng tự tin và lịch sự, không ép: <em>We would be delighted to discuss this further.</em></p>`],
    voc: [['proposal', 'formal suggestion', 'đề xuất'], ['benefit', 'advantage for the customer', 'lợi ích'], ['timeline', 'schedule of dates', 'lịch trình'], ['budget', 'planned costs', 'ngân sách'], ['deliverable', 'thing you will deliver', 'sản phẩm bàn giao']],
    ph: [['We are pleased to submit this proposal.', 'opening', 'mở đầu'], ['The main benefits are…', 'benefits', 'lợi ích'], ['The project will take…', 'timeline', 'thời gian dự án'], ['The total cost is…', 'budget', 'chi phí'], ['We look forward to working with you.', 'closing', 'kết thúc']],
    dlg: { t: ['Proposal outline', 'Dàn ý đề xuất'], l: [
      ['1', 'Summary: We propose an FAQ page and chatbot to cut reply time from three days to one day.', 'Tóm tắt: đề xuất trang FAQ và chatbot để giảm thời gian phản hồi từ ba ngày xuống một ngày.'],
      ['2', 'Plan: Weeks 1–2 collect questions; weeks 3–6 build; weeks 7–8 test.', 'Kế hoạch: tuần 1–2 thu thập câu hỏi; tuần 3–6 xây dựng; tuần 7–8 kiểm thử.'],
      ['3', 'Budget: 60 million dong. Next step: please confirm by 20 November.', 'Ngân sách: 60 triệu đồng. Bước tiếp: xác nhận trước 20/11.']] },
    pit: [['We are the best company in Vietnam.', 'We have delivered 15 similar projects.', 'Evidence over claims.', 'Bằng chứng hơn lời khoe.'],
          ['The project will be finish in 8 weeks.', 'The project will be finished in 8 weeks.', 'Passive needs past participle.', 'Bị động cần quá khứ phân từ.'],
          ['Please accept our proposal soon.', 'If you agree, we can start on 1 December.', 'Do not pressure.', 'Đừng gây áp lực.']],
    s: [['Start with the client\'s problem.', 'Bắt đầu bằng vấn đề của khách.'], ['Benefits with evidence.', 'Lợi ích có bằng chứng.'], ['Clear plan, budget and next step.', 'Kế hoạch, ngân sách, bước tiếp rõ.']],
    l: ['prop', 'rfp', 'pitch', 'bcWrite'],
    p: [['Turn a feature into a benefit: "The app has push notifications."', 'Biến tính năng thành lợi ích: "The app has push notifications."', 'Push notifications remind customers about orders, so fewer deliveries fail.', 'Push notifications remind customers about orders, so fewer deliveries fail.'],
        ['Write the call to action for a proposal.', 'Viết lời kêu gọi hành động cho đề xuất.', 'If you agree, we can start on 1 December. Please let us know by 20 November.', 'If you agree, we can start on 1 December. Please let us know by 20 November.']] }),
  Q(P + 'quiz-8', 'Quiz — Chapter 8: Short reports and proposals', 'Quiz — Chương 8: Báo cáo và đề xuất ngắn', [
    ['A report ends with…|||Một báo cáo kết thúc bằng…', ['recommendations|||khuyến nghị', 'a joke|||chuyện đùa', 'nothing|||không gì', 'an apology|||lời xin lỗi'], 0, 'Actionable steps.|||Bước hành động.'],
    ['Report style is…|||Văn phong báo cáo là…', ['neutral and factual|||trung lập và dựa sự kiện', 'slang|||tiếng lóng', 'emotional|||cảm xúc', 'rude|||thô'], 0, 'Facts, not opinions.|||Sự kiện, không ý riêng.'],
    ['Executive summary length:|||Độ dài executive summary:', ['one paragraph|||một đoạn', 'ten pages|||mười trang', 'one word|||một từ', 'three tables|||ba bảng'], 0, '150–200 words.|||150–200 từ.'],
    ['Written…|||Viết…', ['last, placed first|||sau cùng, đặt đầu', 'first, placed last|||đầu tiên, đặt cuối', 'never|||không bao giờ', 'by hand|||bằng tay'], 0, 'After the rest is done.|||Sau khi xong phần còn lại.'],
    ['Parallel bullets:|||Gạch song song:', ['Save time / Reduce costs / Improve quality', 'Saving time / to reduce / improvement', 'Time / Reduce / Quality', 'Save / costs / improving'], 0, 'Same grammar.|||Cùng cấu trúc.'],
    ['A benefit is…|||Lợi ích là…', ['what it does for the customer|||điều nó làm cho khách', 'a technical spec|||thông số kỹ thuật', 'a price|||một giá', 'a colour|||màu sắc'], 0, 'Customer value.|||Giá trị khách hàng.'],
    ['Passive:|||Bị động:', ['will be finish', 'will be finished', 'will finished', 'will being finish'], 1, 'be + past participle.|||be + quá khứ phân từ.'],
    ['A proposal ends with…|||Đề xuất kết thúc bằng…', ['a clear next step|||bước tiếp rõ', 'a threat|||lời đe doạ', 'silence|||im lặng', 'a new topic|||chủ đề mới'], 0, 'Call to action.|||Kêu gọi hành động.'],
  ]),
]));
// ===== Chương 9 =====
secs.push(SEC('Chapter 9 — Job applications and interviews', 'Chương 9 — Xin việc và phỏng vấn',
  'CV, thư xin việc, trả lời phỏng vấn, đàm phán lời mời và email sau phỏng vấn.', [
  D(P + '9-1', '9.1 Writing an English CV', '9.1 Viết CV bằng tiếng Anh',
    'Cấu trúc CV, động từ hành động và số liệu thành tích.', {
    n: '9.1',
    g: [['Structure a one-page CV', 'Cấu trúc CV một trang'], ['Use action verbs and numbers', 'Dùng động từ hành động và số liệu'], ['Avoid common CV mistakes', 'Tránh lỗi CV thường gặp']],
    b: [`<p>A CV (résumé) is a marketing document, not a biography. Aim for one page for students and juniors. Sections: <strong>Contact details · Profile (2–3 lines) · Education · Experience/Projects · Skills · Languages</strong>. Use reverse chronological order (newest first). In many countries do not include a photo, age, marital status or ID number.</p>
<p>Write bullets with <strong>action verb + task + result</strong>: <em>Developed a booking website for 200 users using React; reduced loading time by 40%.</em> Strong verbs: <em>led, built, designed, improved, organised, reduced, coordinated</em>. Use the past simple for past jobs and present for current. Avoid <em>responsible for</em> (describes duty, not achievement). Include numbers when true; never invent them.</p>
<p><strong>Profile example:</strong> <em>Final-year IT student with experience in web development and teamwork. Looking for an internship in software testing.</em> Tailor the CV to the job advertisement by using its keywords, because automatic systems also scan CVs. Check spelling; save as PDF with a clear name: <em>Lan_Pham_CV.pdf</em>. Use a professional email address.</p>`,
       `<p>CV (résumé) là tài liệu quảng bá bản thân, không phải tiểu sử. Sinh viên và người mới đi làm nên giữ một trang. Các mục: <strong>Thông tin liên hệ · Giới thiệu (2–3 dòng) · Học vấn · Kinh nghiệm/Dự án · Kỹ năng · Ngôn ngữ</strong>. Sắp xếp ngược thời gian (mới nhất trước). Ở nhiều nước không ghi ảnh, tuổi, tình trạng hôn nhân hay số CCCD.</p>
<p>Viết gạch đầu dòng theo <strong>động từ hành động + việc + kết quả</strong>: <em>Developed a booking website for 200 users using React; reduced loading time by 40%.</em> Động từ mạnh: <em>led, built, designed, improved, organised, reduced, coordinated</em>. Dùng quá khứ đơn cho việc cũ và hiện tại cho việc đang làm. Tránh <em>responsible for</em> (mô tả nhiệm vụ, không phải thành tích). Thêm số khi đúng sự thật; không bao giờ bịa.</p>
<p><strong>Ví dụ phần giới thiệu:</strong> <em>Final-year IT student with experience in web development and teamwork. Looking for an internship in software testing.</em> Điều chỉnh CV theo tin tuyển dụng bằng từ khoá của tin, vì hệ thống tự động cũng quét CV. Kiểm chính tả; lưu PDF tên rõ: <em>Lan_Pham_CV.pdf</em>. Dùng địa chỉ email chuyên nghiệp.</p>`],
    voc: [['CV / résumé', 'document listing your background', 'sơ yếu lý lịch'], ['profile', 'short summary of you', 'phần giới thiệu bản thân'], ['achievement', 'something you accomplished', 'thành tích'], ['reference', 'person who can recommend you', 'người giới thiệu'], ['internship', 'short work placement', 'thực tập']],
    ph: [['Developed… resulting in…', 'achievement', 'thành tích'], ['Led a team of…', 'leadership', 'lãnh đạo'], ['Proficient in…', 'skills', 'thành thạo'], ['References available on request.', 'closing', 'kết CV'], ['Seeking a position as…', 'profile', 'mục tiêu']],
    dlg: { t: ['CV bullets', 'Gạch đầu dòng CV'], l: [
      ['Weak', 'Responsible for the website of the club.', 'Phụ trách website của câu lạc bộ.'],
      ['Strong', 'Redesigned the club website; increased monthly visitors from 300 to 900 in 3 months.', 'Thiết kế lại website CLB; tăng lượt truy cập hằng tháng từ 300 lên 900 trong 3 tháng.']] },
    pit: [['I am hard-working and honest.', 'Led a 4-person team to finish the project two weeks early.', 'Show, do not claim.', 'Hãy chứng minh, đừng tuyên bố.'],
          ['Address: ... Age: 21, Single', 'City + phone + email only', 'Personal data is unnecessary.', 'Thông tin cá nhân không cần thiết.'],
          ['I am good at English (no level)', 'English: IELTS 6.5 / TOEIC 800 (if true)', 'Give evidence.', 'Nêu bằng chứng.']],
    s: [['One page, reverse chronological.', 'Một trang, mới nhất trước.'], ['Action verb + task + result.', 'Động từ + việc + kết quả.'], ['Tailor to the job and never invent numbers.', 'Điều chỉnh theo việc, không bịa số.']],
    l: ['cv', 'cvlat', 'linkedin', 'bcWrite'],
    p: [['Improve: "I did the report for the team."', 'Cải thiện: "I did the report for the team."', 'Wrote weekly progress reports for a 5-person team, helping the manager spot delays early.', 'Wrote weekly progress reports for a 5-person team, helping the manager spot delays early.'],
        ['Write a 2-line profile for your next internship.', 'Viết phần giới thiệu 2 dòng cho kỳ thực tập tới.', 'Second-year IT student with experience in Java and teamwork. Seeking a testing internship.', 'Second-year IT student with experience in Java and teamwork. Seeking a testing internship.']] }),
  D(P + '9-2', '9.2 Cover letters and application emails', '9.2 Thư xin việc và email ứng tuyển',
    'Cấu trúc cover letter ba đoạn và email ứng tuyển ngắn.', {
    n: '9.2',
    g: [['Write a 3-paragraph cover letter', 'Viết cover letter ba đoạn'], ['Write a short application email', 'Viết email ứng tuyển ngắn'], ['Match the company and role', 'Gắn với công ty và vị trí']],
    b: [`<p>A cover letter explains <strong>why this job, why you, why this company</strong> in 3 short paragraphs (250–300 words). Paragraph 1: the position and how you found it, plus one strong sentence about you. Paragraph 2: two relevant achievements linked to the job requirements. Paragraph 3: motivation, availability, thanks and call to action: <em>I would welcome the opportunity to discuss my application in an interview.</em></p>
<p>Greeting: <em>Dear Ms Hall</em>; if no name, <em>Dear Hiring Manager</em>. End with <em>Yours sincerely</em> (named person) or <em>Yours faithfully</em> (UK, no name), or simply <em>Kind regards</em>. Do not copy a template; mention the company by name and something specific you like about it. Avoid <em>I am writing to apply for the position of</em> in every sentence; vary.</p>
<p><strong>Application email.</strong> Subject: <em>Application – Junior Tester – Lan Pham</em>. Body in 4 lines: who you are, which job, what is attached, thanks. <em>Dear Hiring Team, I am writing to apply for the Junior Tester position advertised on [site]. Please find attached my CV and cover letter. I would be glad to provide further information. Kind regards, Lan Pham, 090… </em></p>`,
       `<p>Cover letter giải thích <strong>vì sao vị trí này, vì sao bạn, vì sao công ty này</strong> trong 3 đoạn ngắn (250–300 từ). Đoạn 1: vị trí và cách bạn biết tin, cộng một câu mạnh về bạn. Đoạn 2: hai thành tích liên quan đến yêu cầu công việc. Đoạn 3: động lực, thời gian có thể bắt đầu, cảm ơn và kêu gọi hành động: <em>I would welcome the opportunity to discuss my application in an interview.</em></p>
<p>Lời chào: <em>Dear Ms Hall</em>; không có tên thì <em>Dear Hiring Manager</em>. Kết bằng <em>Yours sincerely</em> (có tên) hoặc <em>Yours faithfully</em> (Anh, không tên), hoặc đơn giản <em>Kind regards</em>. Đừng sao chép mẫu; nêu tên công ty và điều cụ thể bạn thích ở họ. Đừng lặp <em>I am writing to apply for the position of</em> ở mọi câu; hãy biến hoá.</p>
<p><strong>Email ứng tuyển.</strong> Tiêu đề: <em>Application – Junior Tester – Lan Pham</em>. Nội dung 4 dòng: bạn là ai, vị trí nào, đính kèm gì, cảm ơn. <em>Dear Hiring Team, I am writing to apply for the Junior Tester position advertised on [site]. Please find attached my CV and cover letter. I would be glad to provide further information. Kind regards, Lan Pham, 090… </em></p>`],
    voc: [['cover letter', 'letter introducing your application', 'thư xin việc'], ['vacancy', 'open job', 'vị trí tuyển'], ['hiring manager', 'person who recruits', 'người tuyển dụng'], ['motivation', 'reason you want it', 'động lực'], ['enclosed / attached', 'included with the letter / email', 'đính kèm']],
    ph: [['I am writing to apply for…', 'opening', 'mở đầu'], ['I am particularly interested in… because…', 'motivation', 'động lực'], ['My experience in… has taught me…', 'link', 'liên hệ kinh nghiệm'], ['I would welcome the opportunity to…', 'closing', 'kết'], ['Thank you for considering my application.', 'thanks', 'cảm ơn']],
    dlg: { t: ['Short cover letter paragraph', 'Một đoạn cover letter'], l: [
      ['Paragraph 2', 'During my internship at Delta Software, I tested a mobile app and found 25 bugs before release. I also wrote test cases that the team still uses. These skills match your requirement for attention to detail.', 'Trong kỳ thực tập tại Delta Software, tôi kiểm thử một ứng dụng và phát hiện 25 lỗi trước khi phát hành, đồng thời viết các test case mà nhóm vẫn dùng. Những kỹ năng này khớp với yêu cầu tỉ mỉ của vị trí.']] },
    pit: [['Dear Sir, (to a woman)', 'Dear Hiring Manager,', 'Avoid gender assumptions.', 'Tránh giả định giới tính.'],
          ['I want very much this job.', 'I am very interested in this role.', 'Word order.', 'Thứ tự từ.'],
          ['Copy-pasted company name wrong.', 'Check names before sending.', 'A common fatal error.', 'Lỗi chết người phổ biến.']],
    s: [['Cover letter: why job, why me, why you.', 'Cover letter: vì sao việc, vì sao tôi, vì sao công ty.'], ['Link achievements to requirements.', 'Gắn thành tích với yêu cầu.'], ['Application email is 4 lines.', 'Email ứng tuyển 4 dòng.']],
    l: ['cover', 'recruit', 'linkedin', 'bcWrite'],
    p: [['Write the subject line for applying to a Marketing Intern vacancy.', 'Viết tiêu đề ứng tuyển vị trí Marketing Intern.', 'Application – Marketing Intern – [Your name]', 'Application – Marketing Intern – [Your name]'],
        ['Write one sentence linking your experience to "good teamwork".', 'Viết một câu gắn kinh nghiệm với "làm việc nhóm tốt".', 'As captain of a university project team of five, I coordinated tasks and met every deadline.', 'As captain of a university project team of five, I coordinated tasks and met every deadline.']] }),
  D(P + '9-3', '9.3 Job interview: common questions and the STAR method', '9.3 Phỏng vấn: câu hỏi phổ biến và phương pháp STAR',
    'Giới thiệu bản thân, điểm mạnh/yếu, câu hỏi hành vi theo STAR.', {
    n: '9.3',
    g: [['Answer "Tell me about yourself"', 'Trả lời "Tell me about yourself"'], ['Use the STAR method for behavioural questions', 'Dùng STAR cho câu hỏi hành vi'], ['Ask good questions at the end', 'Hỏi câu hay ở cuối']],
    b: [`<p><strong>Tell me about yourself.</strong> Use the Present-Past-Future formula in 60 seconds: <em>I am a final-year student in… (present). Last summer I did an internship where I… (past). I am now looking for a role where I can… (future).</em> Do not retell your whole life or start with your family.</p>
<p><strong>Strengths and weaknesses.</strong> Choose a real strength with proof; for a weakness choose a real but minor one and say what you are doing: <em>I used to spend too long on details, so now I set time limits for tasks.</em> Do not say "I have no weaknesses" or "I work too hard".</p>
<p><strong>Behavioural questions</strong> (Tell me about a time when…) use STAR: <strong>Situation</strong> (context), <strong>Task</strong> (your responsibility), <strong>Action</strong> (what you did, use "I"), <strong>Result</strong> (outcome with numbers). <em>In my group project the deadline was one week away and two members left (S). I had to finish the report (T). I divided the remaining tasks, worked in the evenings and checked each part (A). We submitted on time and got 9/10 (R).</em></p>
<p>At the end ask questions: <em>What does a typical day look like? How will success be measured in the first three months?</em> Do not ask about salary first. Vietnamese candidates often answer in very short sentences or say "we" for everything; interviewers want to hear what <em>you</em> did.</p>`,
       `<p><strong>Tell me about yourself.</strong> Dùng công thức Hiện tại–Quá khứ–Tương lai trong 60 giây: <em>I am a final-year student in… (hiện tại). Last summer I did an internship where I… (quá khứ). I am now looking for a role where I can… (tương lai).</em> Đừng kể cả đời hay bắt đầu bằng gia đình.</p>
<p><strong>Điểm mạnh và điểm yếu.</strong> Chọn điểm mạnh thật có bằng chứng; với điểm yếu chọn một điểm có thật nhưng nhỏ và nói bạn đang làm gì: <em>I used to spend too long on details, so now I set time limits for tasks.</em> Đừng nói "I have no weaknesses" hay "I work too hard".</p>
<p><strong>Câu hỏi hành vi</strong> (Tell me about a time when…) dùng STAR: <strong>Situation</strong> (bối cảnh), <strong>Task</strong> (trách nhiệm của bạn), <strong>Action</strong> (bạn làm gì, dùng "I"), <strong>Result</strong> (kết quả có số liệu). <em>In my group project the deadline was one week away and two members left (S). I had to finish the report (T). I divided the remaining tasks, worked in the evenings and checked each part (A). We submitted on time and got 9/10 (R).</em></p>
<p>Cuối buổi hãy hỏi: <em>What does a typical day look like? How will success be measured in the first three months?</em> Đừng hỏi lương đầu tiên. Ứng viên Việt hay trả lời rất ngắn hoặc nói "we" cho mọi việc; nhà tuyển dụng muốn nghe bạn <em>đã làm gì</em>.</p>`],
    voc: [['strength', 'something you do well', 'điểm mạnh'], ['weakness', 'area to improve', 'điểm yếu'], ['STAR', 'Situation, Task, Action, Result', 'Tình huống, Nhiệm vụ, Hành động, Kết quả'], ['teamwork', 'working with others', 'làm việc nhóm'], ['deadline', 'time limit', 'hạn chót']],
    ph: [['Let me tell you a bit about myself.', 'opening', 'mở đầu'], ['One example is when…', 'story', 'ví dụ'], ['As a result,…', 'result', 'kết quả'], ['I learned that…', 'reflection', 'bài học'], ['Could you tell me more about the team?', 'asking', 'hỏi lại']],
    dlg: { t: ['Interview extract', 'Trích phỏng vấn'], l: [
      ['Interviewer', 'Tell me about a time when you worked under pressure.', 'Kể về lần bạn làm việc dưới áp lực.'],
      ['Candidate', 'In my last semester, our group had one week left and two members left the team. I had to finish the report. I divided the remaining tasks and worked every evening. As a result, we submitted on time and scored 9 out of 10.', 'Học kỳ trước, nhóm còn một tuần thì hai bạn rời nhóm. Tôi phải hoàn thành báo cáo. Tôi chia lại việc và làm mỗi tối. Kết quả nhóm nộp đúng hạn và được 9/10.']] },
    pit: [['I am hard worker.', 'I am a hard worker.', 'Missing article.', 'Thiếu mạo từ.'],
          ['We did everything. (no "I")', 'I organised the schedule and wrote the report.', 'Say what you did.', 'Nói bạn làm gì.'],
          ['I do not have weakness.', 'One thing I am improving is…', 'Be honest.', 'Hãy trung thực.']],
    s: [['Present-Past-Future for "about yourself".', 'Hiện tại–Quá khứ–Tương lai.'], ['STAR for stories; use "I".', 'STAR; dùng "I".'], ['Prepare questions to ask.', 'Chuẩn bị câu hỏi để hỏi.']],
    l: ['interview', 'recruit', 'story', 'bcSpeak'],
    p: [['Prepare a 3-sentence answer to "Tell me about yourself".', 'Chuẩn bị câu trả lời 3 câu cho "Tell me about yourself".', 'I am a second-year student in… Last summer I… I am now looking for…', 'I am a second-year student in… Last summer I… I am now looking for…'],
        ['Fix: "I am hard worker."', 'Sửa: "I am hard worker."', 'I am a hard worker.', 'I am a hard worker.']] }),
  D(P + '9-4', '9.4 After the interview: thank-you email, offers and salary', '9.4 Sau phỏng vấn: email cảm ơn, lời mời và lương',
    'Email cảm ơn, nhận hay từ chối lời mời, thương lượng lương lịch sự.', {
    n: '9.4',
    g: [['Write a thank-you email', 'Viết email cảm ơn'], ['Accept or decline an offer', 'Nhận hoặc từ chối lời mời'], ['Ask about salary politely', 'Hỏi về lương lịch sự']],
    b: [`<p><strong>Thank-you email</strong> within 24 hours: thank, mention one detail from the interview, repeat interest, offer more information. <em>Dear Ms Hall, thank you for meeting me today. I enjoyed learning about your testing process. The role is a great match for my skills in… I look forward to hearing from you.</em></p>
<p><strong>Accepting an offer:</strong> <em>Thank you for the offer. I am delighted to accept the position of Junior Tester. I can start on 1 February. Please let me know the next steps.</em> <strong>Declining:</strong> <em>Thank you for the offer. After careful consideration, I have decided to accept another position. I appreciated the time you spent with me.</em> Stay kind: the industry is small.</p>
<p><strong>Salary.</strong> Research the market range first. Ask politely, preferably after an offer or when the employer raises it: <em>Could you tell me the salary range for this position?</em> If the offer is low: <em>Thank you for the offer. Based on my research and my skills in…, I was hoping for a salary closer to X. Is there any flexibility?</em> Link to value, not to personal needs. Consider the whole package: probation, benefits, training, working hours. Ask for the offer in writing and take time: <em>May I have until Friday to reply?</em></p>`,
       `<p><strong>Email cảm ơn</strong> trong 24 giờ: cảm ơn, nhắc một chi tiết trong buổi phỏng vấn, nhắc lại sự quan tâm, đề nghị cung cấp thêm thông tin. <em>Dear Ms Hall, thank you for meeting me today. I enjoyed learning about your testing process. The role is a great match for my skills in… I look forward to hearing from you.</em></p>
<p><strong>Nhận lời mời:</strong> <em>Thank you for the offer. I am delighted to accept the position of Junior Tester. I can start on 1 February. Please let me know the next steps.</em> <strong>Từ chối:</strong> <em>Thank you for the offer. After careful consideration, I have decided to accept another position. I appreciated the time you spent with me.</em> Giữ thái độ tử tế: ngành này nhỏ.</p>
<p><strong>Lương.</strong> Tìm hiểu mức thị trường trước. Hỏi lịch sự, tốt nhất sau khi có lời mời hoặc khi nhà tuyển dụng đề cập: <em>Could you tell me the salary range for this position?</em> Nếu lời mời thấp: <em>Thank you for the offer. Based on my research and my skills in…, I was hoping for a salary closer to X. Is there any flexibility?</em> Gắn với giá trị, không gắn với nhu cầu cá nhân. Xem cả gói: thử việc, phúc lợi, đào tạo, giờ làm. Xin lời mời bằng văn bản và dành thời gian: <em>May I have until Friday to reply?</em></p>`],
    voc: [['offer', 'formal job proposal', 'lời mời nhận việc'], ['probation', 'trial period', 'thời gian thử việc'], ['benefits', 'extra rewards besides pay', 'phúc lợi'], ['negotiate', 'discuss to agree', 'thương lượng'], ['decline', 'say no politely', 'từ chối lịch sự']],
    ph: [['Thank you for the opportunity.', 'thanks', 'cảm ơn'], ['I am delighted to accept…', 'accepting', 'nhận lời'], ['After careful consideration,…', 'declining', 'từ chối'], ['Is there any flexibility on the salary?', 'negotiating', 'thương lượng'], ['May I have until… to decide?', 'time', 'xin thời gian']],
    dlg: { t: ['Thank-you email', 'Email cảm ơn'], l: [
      ['Subject', 'Thank you – Junior Tester interview', 'Cảm ơn – phỏng vấn Junior Tester'],
      ['Body', 'Dear Ms Hall, thank you for taking the time to meet me today. I particularly enjoyed hearing about your test automation plans. I am very interested in the role and confident I can contribute. Please let me know if you need any further information. Kind regards, Lan Pham', 'Cảm ơn chị đã dành thời gian gặp tôi hôm nay. Tôi đặc biệt thích nghe về kế hoạch kiểm thử tự động. Tôi rất quan tâm vị trí và tin mình đóng góp được. Nếu cần thêm thông tin xin cho tôi biết.']] },
    pit: [['How much salary?', 'Could you tell me the salary range?', 'Too blunt.', 'Quá thẳng.'],
          ['I need more money for my family.', 'Based on my skills and market data, I was hoping for…', 'Argue with value.', 'Lập luận bằng giá trị.'],
          ['No reply for a week after the offer.', 'Reply within the agreed time.', 'Silence looks unprofessional.', 'Im lặng thiếu chuyên nghiệp.']],
    s: [['Thank-you email within 24 hours.', 'Email cảm ơn trong 24 giờ.'], ['Accept/decline politely and promptly.', 'Nhận/từ chối lịch sự và kịp thời.'], ['Negotiate with value and market data.', 'Thương lượng bằng giá trị và dữ liệu thị trường.']],
    l: ['salary', 'interview', 'letter', 'bcWrite'],
    p: [['Write a polite sentence to ask for time to decide on an offer.', 'Viết câu lịch sự xin thời gian quyết định.', 'Thank you for the offer. May I have until Friday to reply?', 'Thank you for the offer. May I have until Friday to reply?'],
        ['Write a polite way to decline another job offer.', 'Viết cách từ chối lời mời việc khác.', 'After careful consideration, I have decided to accept another position. Thank you for your time.', 'After careful consideration, I have decided to accept another position. Thank you for your time.']] }),
  Q(P + 'quiz-9', 'Quiz — Chapter 9: Job applications and interviews', 'Quiz — Chương 9: Xin việc và phỏng vấn', [
    ['A student CV should be…|||CV của sinh viên nên…', ['one page|||một trang', 'ten pages|||mười trang', 'a poem|||bài thơ', 'handwritten|||viết tay'], 0, 'Short and targeted.|||Ngắn và đúng mục tiêu.'],
    ['Best CV bullet:|||Gạch CV tốt nhất:', ['Responsible for sales.', 'Increased online sales by 20% in 3 months.', 'Good worker.', 'Did tasks.'], 1, 'Action + result.|||Hành động + kết quả.'],
    ['Cover letter has…|||Cover letter có…', ['three short paragraphs|||ba đoạn ngắn', 'one word|||một từ', 'ten pages|||mười trang', 'no greeting|||không lời chào'], 0, 'Why job, you, company.|||Vì sao việc, bạn, công ty.'],
    ['STAR stands for…|||STAR là…', ['Situation, Task, Action, Result|||Tình huống, Nhiệm vụ, Hành động, Kết quả', 'Start, Talk, Ask, Reply|||Bắt đầu, Nói, Hỏi, Trả lời', 'Skill, Time, Aim, Risk|||Kỹ năng, Giờ, Mục tiêu, Rủi ro', 'Say, Think, Act, Rest|||Nói, Nghĩ, Làm, Nghỉ'], 0, 'Behavioural answer structure.|||Cấu trúc trả lời hành vi.'],
    ['Correct:|||Đúng:', ['I am hard worker.', 'I am a hard worker.', 'I hard worker.', 'I am hard-working a worker.'], 1, 'Article needed.|||Cần mạo từ.'],
    ['"Tell me about yourself": use…|||"Tell me about yourself": dùng…', ['Present-Past-Future|||Hiện tại–Quá khứ–Tương lai', 'your family story|||chuyện gia đình', 'silence|||im lặng', 'salary demand|||đòi lương'], 0, '60 seconds.|||60 giây.'],
    ['Thank-you email timing:|||Thời điểm gửi email cảm ơn:', ['within 24 hours|||trong 24 giờ', 'after a month|||sau một tháng', 'never|||không bao giờ', 'during the interview|||trong lúc phỏng vấn'], 0, 'Be prompt.|||Kịp thời.'],
    ['To ask for time:|||Để xin thêm thời gian:', ['May I have until Friday to reply?', 'I do not care.', 'Decide for me.', 'Send money.'], 0, 'Polite and specific.|||Lịch sự, cụ thể.'],
  ]),
]));

export default secs;
