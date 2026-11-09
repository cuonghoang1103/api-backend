// Khoá TỰ SOẠN cho IMC201 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Giáo trình chuẩn: Belch & Belch "Advertising and Promotion: An IMC Perspective"; Shimp & Andrews; Kotler & Armstrong "Principles of Marketing".
const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const W = 'https://en.wikipedia.org/wiki/';
const wk = (p, en, vi) => [W + p, 'Wikipedia — ' + en, 'Wikipedia — ' + vi];
const LK = {
  imc: wk('Marketing_communications', 'Marketing communications (IMC)', 'Truyền thông marketing (IMC)'),
  pmix: wk('Promotional_mix', 'Promotional mix', 'Hỗn hợp xúc tiến (promotional mix)'),
  shannon: wk('Shannon%E2%80%93Weaver_model', 'Shannon–Weaver model', 'Mô hình Shannon–Weaver'),
  twostep: wk('Two-step_flow_of_communication', 'Two-step flow of communication', 'Dòng truyền thông hai bước'),
  aida: wk('AIDA_(marketing)', 'AIDA (marketing)', 'Mô hình AIDA'),
  dagmar: wk('DAGMAR', 'DAGMAR', 'DAGMAR (đặt mục tiêu truyền thông)'),
  elm: wk('Elaboration_likelihood_model', 'Elaboration likelihood model', 'Mô hình khả năng xử lý thông tin (ELM)'),
  adv: wk('Advertising', 'Advertising', 'Quảng cáo'),
  pr: wk('Public_relations', 'Public relations', 'Quan hệ công chúng (PR)'),
  salespromo: wk('Sales_promotion', 'Sales promotion', 'Khuyến mãi'),
  direct: wk('Direct_marketing', 'Direct marketing', 'Marketing trực tiếp'),
  digital: wk('Digital_marketing', 'Digital marketing', 'Marketing số'),
  selling: wk('Personal_selling', 'Personal selling', 'Bán hàng trực tiếp'),
  event: wk('Event_marketing', 'Event marketing', 'Marketing sự kiện'),
  spons: wk('Sponsor_(commercial)', 'Sponsor (commercial)', 'Tài trợ (thương mại)'),
  mplan: wk('Media_planning', 'Media planning', 'Hoạch định phương tiện'),
  reach: wk('Reach_(advertising)', 'Reach (advertising)', 'Độ phủ (reach)'),
  freq: wk('Frequency_(marketing)', 'Frequency (marketing)', 'Tần suất (frequency)'),
  grp: wk('Gross_rating_point', 'Gross rating point', 'Điểm xếp hạng gộp (GRP)'),
  cpm: wk('Cost_per_mille', 'Cost per mille (CPM)', 'Chi phí mỗi nghìn lượt hiển thị (CPM)'),
  roi: wk('Return_on_investment', 'Return on investment', 'Tỷ suất hoàn vốn (ROI)'),
  mmm: wk('Marketing_mix_modeling', 'Marketing mix modeling', 'Mô hình hoá hiệu quả marketing mix (MMM)'),
  attr: wk('Attribution_(marketing)', 'Attribution (marketing)', 'Phân bổ đóng góp (attribution)'),
  ab: wk('A/B_testing', 'A/B testing', 'Thử nghiệm A/B'),
  cbrief: wk('Creative_brief', 'Creative brief', 'Bản brief sáng tạo'),
  cta: wk('Call_to_action_(marketing)', 'Call to action (marketing)', 'Lời kêu gọi hành động (CTA)'),
  usp: wk('Unique_selling_proposition', 'Unique selling proposition', 'Lợi điểm bán hàng độc nhất (USP)'),
  swot: wk('SWOT_analysis', 'SWOT analysis', 'Phân tích SWOT'),
  smart: wk('SMART_criteria', 'SMART criteria', 'Tiêu chí SMART'),
  seg: wk('Market_segmentation', 'Market segmentation', 'Phân khúc thị trường'),
  taud: wk('Target_audience', 'Target audience', 'Đối tượng mục tiêu'),
  mplan2: wk('Marketing_plan', 'Marketing plan', 'Kế hoạch marketing'),
  mstrat: wk('Marketing_strategy', 'Marketing strategy', 'Chiến lược marketing'),
  adcamp: wk('Advertising_campaign', 'Advertising campaign', 'Chiến dịch quảng cáo'),
  touch: wk('Touchpoint', 'Touchpoint', 'Điểm chạm (touchpoint)'),
  cx: wk('Customer_experience', 'Customer experience', 'Trải nghiệm khách hàng'),
  funnel: wk('Purchase_funnel', 'Purchase funnel', 'Phễu mua hàng'),
  sem: wk('Search_engine_marketing', 'Search engine marketing', 'Marketing công cụ tìm kiếm (SEM)'),
  cpa: wk('Cost_per_action', 'Cost per action', 'Chi phí mỗi hành động (CPA)'),
  ppc: wk('Pay-per-click', 'Pay-per-click', 'Trả tiền theo lượt nhấp (PPC)'),
  ctr: wk('Click-through_rate', 'Click-through rate', 'Tỷ lệ nhấp (CTR)'),
  content: wk('Content_marketing', 'Content marketing', 'Content marketing'),
  influ: wk('Influencer_marketing', 'Influencer marketing', 'Marketing người ảnh hưởng'),
  smm: wk('Social_media_marketing', 'Social media marketing', 'Marketing trên mạng xã hội'),
  email: wk('Email_marketing', 'Email marketing', 'Email marketing'),
  placement: wk('Product_placement', 'Product placement', 'Đặt sản phẩm (product placement)'),
  guerrilla: wk('Guerrilla_marketing', 'Guerrilla marketing', 'Marketing du kích'),
  wom: wk('Word_of_mouth', 'Word of mouth', 'Truyền miệng'),
  viral: wk('Viral_marketing', 'Viral marketing', 'Marketing lan truyền'),
  aware: wk('Brand_awareness', 'Brand awareness', 'Độ nhận biết thương hiệu'),
  adstock: wk('Advertising_adstock', 'Advertising adstock', 'Adstock (hiệu ứng tồn dư của quảng cáo)'),
  kpi: wk('Key_performance_indicator', 'Performance indicator (KPI)', 'Chỉ số hiệu suất (KPI)'),
  research: wk('Marketing_research', 'Marketing research', 'Nghiên cứu marketing'),
  imp: wk('Impression_(online_media)', 'Impression (online media)', 'Lượt hiển thị (impression)'),
  tele: wk('Telemarketing', 'Telemarketing', 'Telemarketing'),
  loyal: wk('Loyalty_program', 'Loyalty program', 'Chương trình khách hàng thân thiết'),
  coupon: wk('Coupon', 'Coupon', 'Phiếu giảm giá (coupon)'),
  crisis: wk('Crisis_communication', 'Crisis communication', 'Truyền thông khủng hoảng'),
  press: wk('Press_release', 'Press release', 'Thông cáo báo chí'),
  media_rel: wk('Media_relations', 'Media relations', 'Quan hệ báo chí'),
  corp: wk('Corporate_communication', 'Corporate communication', 'Truyền thông doanh nghiệp'),
  earned: wk('Earned_media', 'Earned media', 'Phương tiện kiếm được (earned media)'),
  native: wk('Native_advertising', 'Native advertising', 'Quảng cáo native'),
  ooh: wk('Out-of-home_advertising', 'Out-of-home advertising', 'Quảng cáo ngoài trời (OOH)'),
  sov: wk('Share_of_voice', 'Share of voice', 'Thị phần tiếng nói (share of voice)'),
  cause: wk('Cause_marketing', 'Cause marketing', 'Marketing vì mục đích xã hội'),
  tradeshow: wk('Trade_show', 'Trade show', 'Hội chợ thương mại'),
  fear: wk('Fear_appeal', 'Fear appeal', 'Thông điệp gây sợ hãi (fear appeal)'),
  lifecycle: wk('Product_lifecycle', 'Product lifecycle', 'Vòng đời sản phẩm'),
  shareacoke: wk('Share_a_Coke', 'Share a Coke', 'Chiến dịch Share a Coke'),
  dove: wk('Dove_Campaign_for_Real_Beauty', 'Dove Campaign for Real Beauty', 'Chiến dịch Dove “Vẻ đẹp thật sự”'),
  oldspice: wk('Old_Spice', 'Old Spice', 'Old Spice'),
  dumb: wk('Dumb_Ways_to_Die', 'Dumb Ways to Die', 'Chiến dịch Dumb Ways to Die'),
  jdi: wk('Just_Do_It', 'Just Do It (Nike slogan)', 'Khẩu hiệu Just Do It của Nike'),
  fearless: wk('Fearless_Girl', 'Fearless Girl', 'Tượng Fearless Girl'),
  stratos: wk('Red_Bull_Stratos', 'Red Bull Stratos', 'Red Bull Stratos'),
  blendtec: wk('Blendtec', 'Blendtec', 'Blendtec (“Will It Blend?”)'),
  vinamilk: wk('Vinamilk', 'Vinamilk', 'Vinamilk'),
  heineken: wk('Heineken', 'Heineken', 'Heineken'),
  bitis: wk('Biti%27s', 'Biti&#39;s', 'Biti&#39;s'),
  ipa: ['https://ipa.co.uk/knowledge/effectiveness/', 'IPA — Effectiveness hub (research and case studies on measurable advertising results)', 'IPA — Trung tâm hiệu quả quảng cáo (nghiên cứu và case study về kết quả đo được)'],
  ama: ['https://www.ama.org/the-definition-of-marketing-what-is-marketing/', 'American Marketing Association — definition of marketing', 'Hiệp hội Marketing Hoa Kỳ (AMA) — định nghĩa marketing'],
  prsa: ['https://www.prsa.org/about/all-about-pr', 'PRSA — What public relations is and does', 'PRSA — PR là gì và làm gì'],
  wharton: ['https://www.coursera.org/learn/wharton-marketing', 'Coursera (Wharton) — Introduction to Marketing', 'Coursera (Wharton) — Nhập môn Marketing'],
  tgoogle: ['https://www.thinkwithgoogle.com/', 'Think with Google — marketing research and insights', 'Think with Google — nghiên cứu và insight marketing'],
  ana: ['https://www.ana.net', 'Association of National Advertisers (ANA)', 'Hiệp hội Nhà quảng cáo Quốc gia Hoa Kỳ (ANA)'],
  utm: ['https://support.google.com/google-analytics/answer/1033863', 'Google Analytics Help — campaign URLs and UTM parameters', 'Trợ giúp Google Analytics — URL chiến dịch và tham số UTM'],
  vnm: ['https://www.vinamilk.com.vn/en', 'Vinamilk — official site', 'Vinamilk — trang chính thức'],
};
const lk = (ks, i) => '<ul>' + ks.map((k) => { if (!LK[k]) throw new Error('thiếu link ' + k); return '<li><a href="' + LK[k][0] + '" target="_blank" rel="noopener">' + LK[k][i] + '</a></li>'; }).join('') + '</ul>';
const tbl = (head, rows) => '<table><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
// o: {n, g:[[en,vi]], b:[en,vi], pit:[en,vi], s:[[en,vi]], l:[keys], p:[[qen,qvi,aen,avi]]}
const XTRA = {};
const build = (o, L) => {
  const I = L === 'en' ? 0 : 1;
  const T = L === 'en'
    ? { goals: 'Lesson goals', lec: 'Lesson', pit: 'Common mistakes', sum: '📌 Summary', more: '🔗 Learn more', prac: '🧪 Practice', ans: 'Answer', les: 'Lesson ', ex: 'Worked example' }
    : { goals: 'Mục tiêu bài', lec: 'Bài giảng', pit: 'Lỗi hay gặp', sum: '📌 Tóm tắt', more: '🔗 Học thêm', prac: '🧪 Tự luyện', ans: 'Đáp án', les: 'Bài ', ex: 'Ví dụ làm thêm' };
  let h = '<span class="eyebrow">IMC201 · ' + T.les + o.n + '</span>\n';
  h += '<h3>' + T.goals + '</h3><ul>' + o.g.map((g) => '<li>' + g[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.lec + '</h3>' + o.b[I] + '\n';
  if (XTRA[o.n]) h += '<h4>' + T.ex + '</h4>' + XTRA[o.n][I] + '\n';
  if (o.pit) h += '<div class="pitfall"><strong>' + T.pit + '.</strong> ' + o.pit[I] + '</div>\n';
  h += '<h3>' + T.sum + '</h3><ul>' + o.s.map((s) => '<li>' + s[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.more + '</h3>' + lk(o.l, 1 + I) + '\n';
  h += '<h3>' + T.prac + '</h3><ol>' + o.p.map((p) => '<li>' + p[I] + '<div class="dap-an"><strong>' + T.ans + ':</strong> ' + p[2 + I] + '</div></li>').join('') + '</ol>';
  return h;
};
const D = (slug, en, vi, desc, o) => ({ title: en + '|||' + vi, slug, type: 'DOCUMENT', description: desc, content: bi(build(o, 'en'), build(o, 'vi')) });
// câu quiz: qq(qEN, qVI, ['en|vi' x4], đúng, giảiEN, giảiVI)
const qq = (qe, qv, ops, ci, ee, ev) => ({ q: qe + '|||' + qv, o: ops.map((s) => s.split('|').join('|||')), c: ci, e: ee + '|||' + ev });
const Q = (slug, en, vi, qs) => ({ title: en + '|||' + vi, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 600, questions: qs.map((q, i) => ({ id: 'q' + (i + 1), question: q.q, options: q.o, correctIndex: q.c, points: 1, explanation: q.e })) } });
const SEC = (en, vi, desc, lessons) => ({ title: en + '|||' + vi, description: desc, lessons });
const P = 'imc201-ts-';
const secs = [];
// ===== Mục 0 =====
secs.push(SEC('Section 0 — Course framework (self-authored, no FLM syllabus)', 'Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  'Giới thiệu IMC201, chuẩn đầu ra tự soạn, giáo trình và tài liệu học.', [
  D(P + '0-1', '0.1 About IMC201 — Introduction to Integrated Marketing Communication', '0.1 Giới thiệu môn IMC201 — Nhập môn Truyền thông marketing tích hợp',
    'IMC201 là môn gì, học để làm gì, học xong làm được gì; lưu ý khung môn tự soạn.', {
    n: '0.1',
    g: [['Understand what IMC201 covers and why integrated communication matters at work', 'Hiểu IMC201 học gì và vì sao truyền thông tích hợp quan trọng khi đi làm'],
        ['Know the 8 self-authored learning outcomes', 'Nắm 8 chuẩn đầu ra tự soạn'],
        ['See the map of the 9 chapters and the subjects that follow', 'Nắm bản đồ 9 chương và các môn học tiếp theo']],
    b: [`<div class="callout"><strong>⚠️ Notice.</strong> The university has not published an IMC201 syllabus on FLM (checked by code, variants and name on 09/11/2026). This outline is self-authored from standard textbooks (Belch &amp; Belch; Shimp &amp; Andrews; Kotler &amp; Armstrong). Grading scheme and exam schedule follow your lecturer.</div>
<p><strong>What it is.</strong> IMC201 (Introduction to Integrated Marketing Communication) is a second-semester subject and the entry point of the IMC track. It answers one question: how does an organisation make every message a customer meets (an ad, a post, a shop display, a sales call, a press story) say the same coherent thing, reach the right people at an affordable cost, and prove that it worked?</p>
<p><strong>Why it matters.</strong> In a marketing, PR, advertising, agency or startup job you rarely run one tool. A launch needs a brief, a message, several channels, a budget and a report. People who can plan across tools, instead of defending "their" channel, are the ones trusted with larger budgets. For a capstone or a small business idea, an integrated plan is the difference between "we posted a lot" and "we know what changed".</p>
<h4>Learning outcomes (self-authored)</h4>
<ol><li>Define IMC and explain why organisations integrate communication, with its main benefits and barriers.</li>
<li>Describe the IMC planning process from marketing plan to evaluation.</li>
<li>Apply communication models (source–message–channel–receiver–noise, AIDA, hierarchy of effects, involvement) to explain how audiences respond.</li>
<li>Define an audience and set communication objectives that are specific and measurable.</li>
<li>Write a short creative brief and choose a message strategy and appeal for a given objective.</li>
<li>Compare the tools of the promotional mix (advertising, PR, sales promotion, direct and digital, personal selling, events and sponsorship) and combine them.</li>
<li>Do basic media planning calculations (reach, frequency, GRP, CPM) and compare budgeting methods.</li>
<li>Choose metrics for each objective, read results critically, and write a one-page integrated plan.</li></ol>
<h4>Related subjects</h4>
<p>IMC201 builds on an introductory marketing subject and on BRA201 (Introduction to Brand Management): this course does not repeat brand equity or positioning, it uses them as inputs. It leads to the later subjects of the IMC track: EPL201 (Ethics, Privacy and Legal issues in IMC), OCM301 (Omnichannel Communications), IGI301 (Intercultural and Global IMC), CRM301 (Crisis Communication) and SCO301 (Sustainable Communication). Those subjects go deep into the topics this course only introduces. Exact prerequisites are not published; ask your academic office.</p>
<h4>Chapter map</h4>
<p>1 IMC concept and process · 2 Communication models · 3 Situation, audience, objectives · 4 Message and creative strategy · 5 Advertising and PR · 6 Sales promotion, direct marketing, personal selling · 7 Digital, social, events and sponsorship · 8 Media planning and budgeting · 9 Measuring effectiveness and the integrated plan.</p>
<h4>How to study</h4>
<p>Pick one Vietnamese brand and one international brand and write a one-page "IMC audit" for each: which tools do they use, is the message consistent, how would you know it works? By Chapter 9 you will have a plan template ready for your assignment.</p>`,
       `<div class="callout"><strong>⚠️ Lưu ý.</strong> Trường chưa công bố syllabus của IMC201 trên FLM (đã dò theo mã, biến thể mã và tên ngày 09/11/2026). Khung này soạn theo giáo trình chuẩn (Belch &amp; Belch; Shimp &amp; Andrews; Kotler &amp; Armstrong); cách tính điểm và lịch thi theo giảng viên của lớp bạn.</div>
<p><strong>Là môn gì.</strong> IMC201 (Nhập môn Truyền thông marketing tích hợp) là môn kỳ 2 và là môn mở đầu của lộ trình IMC. Môn trả lời một câu hỏi: làm sao để mọi thông điệp khách hàng gặp (quảng cáo, bài đăng, kệ trưng bày, cuộc gọi bán hàng, bài báo) cùng nói một điều nhất quán, đến đúng người với chi phí chấp nhận được, và chứng minh được là có hiệu quả?</p>
<p><strong>Để làm gì.</strong> Làm marketing, PR, quảng cáo, agency hay startup, hiếm khi bạn chỉ chạy một công cụ. Một lần ra mắt cần brief, thông điệp, nhiều kênh, ngân sách và báo cáo. Người biết lập kế hoạch xuyên công cụ, thay vì bảo vệ "kênh của mình", mới được giao ngân sách lớn hơn. Với đồ án hay ý tưởng kinh doanh nhỏ, kế hoạch tích hợp là khác biệt giữa "đăng nhiều" và "biết điều gì đã thay đổi".</p>
<h4>Chuẩn đầu ra (tự soạn)</h4>
<ol><li>Định nghĩa IMC và giải thích vì sao tổ chức tích hợp truyền thông, cùng lợi ích và rào cản chính.</li>
<li>Mô tả quy trình lập kế hoạch IMC từ kế hoạch marketing đến đánh giá.</li>
<li>Vận dụng các mô hình truyền thông (nguồn – thông điệp – kênh – người nhận – nhiễu, AIDA, hierarchy of effects, mức độ quan tâm) để giải thích phản ứng của khán giả.</li>
<li>Xác định đối tượng và đặt mục tiêu truyền thông cụ thể, đo được.</li>
<li>Viết bản brief sáng tạo ngắn và chọn chiến lược thông điệp, kiểu thu hút cho một mục tiêu cho trước.</li>
<li>So sánh các công cụ của promotional mix (quảng cáo, PR, khuyến mãi, marketing trực tiếp và số, bán hàng trực tiếp, sự kiện và tài trợ) và kết hợp chúng.</li>
<li>Làm các phép tính hoạch định phương tiện cơ bản (reach, frequency, GRP, CPM) và so sánh các phương pháp lập ngân sách.</li>
<li>Chọn chỉ số cho từng mục tiêu, đọc kết quả có phê phán và viết kế hoạch tích hợp một trang.</li></ol>
<h4>Môn liên quan</h4>
<p>IMC201 dựa trên một môn marketing nhập môn và trên BRA201 (Nhập môn Quản trị thương hiệu): khoá này không lặp lại giá trị thương hiệu hay định vị mà dùng chúng làm đầu vào. Môn dẫn tới các môn sau của lộ trình IMC: EPL201 (Đạo đức, quyền riêng tư và pháp lý trong IMC), OCM301 (Truyền thông đa kênh), IGI301 (IMC liên văn hoá và toàn cầu), CRM301 (Truyền thông khủng hoảng) và SCO301 (Truyền thông bền vững). Các môn đó đi sâu vào những chủ đề mà khoá này chỉ giới thiệu. Môn tiên quyết chính xác chưa được công bố; hỏi phòng đào tạo.</p>
<h4>Bản đồ chương</h4>
<p>1 Khái niệm và quy trình IMC · 2 Mô hình truyền thông · 3 Bối cảnh, đối tượng, mục tiêu · 4 Thông điệp và chiến lược sáng tạo · 5 Quảng cáo và PR · 6 Khuyến mãi, marketing trực tiếp, bán hàng trực tiếp · 7 Số, mạng xã hội, sự kiện và tài trợ · 8 Hoạch định phương tiện và ngân sách · 9 Đo lường hiệu quả và kế hoạch tích hợp.</p>
<h4>Cách học</h4>
<p>Chọn một thương hiệu Việt và một thương hiệu quốc tế, viết "kiểm toán IMC" một trang cho mỗi thương hiệu: họ dùng công cụ nào, thông điệp có nhất quán không, làm sao biết có hiệu quả? Đến Chương 9 bạn sẽ có mẫu kế hoạch sẵn cho bài tập.</p>`],
    pit: ['Thinking IMC means "do everything everywhere". Integration is about coherence and choice, not volume.', 'Nghĩ IMC là "làm mọi thứ ở mọi nơi". Tích hợp là nhất quán và biết chọn, không phải làm nhiều.'],
    s: [['IMC201 = planning coherent communication across tools, with a budget and proof of results.', 'IMC201 = lập kế hoạch truyền thông nhất quán xuyên công cụ, có ngân sách và bằng chứng kết quả.'],
        ['No FLM syllabus exists: this outline is self-authored from standard textbooks.', 'Chưa có syllabus trên FLM: khung này tự soạn theo giáo trình chuẩn.'],
        ['Brand equity and positioning belong to BRA201; deep legal, global, crisis and sustainability topics belong to later subjects.', 'Giá trị thương hiệu và định vị thuộc BRA201; pháp lý, toàn cầu, khủng hoảng và bền vững thuộc các môn sau.']],
    l: ['imc', 'pmix', 'ama'],
    p: [['In one sentence: what problem does IMC solve?', 'Một câu: IMC giải quyết vấn đề gì?', 'It stops separate tools from sending inconsistent messages, so the audience hears one coherent story and the budget works together.', 'Nó ngăn các công cụ rời rạ gửi thông điệp thiếu nhất quán, để khán giả nghe một câu chuyện thống nhất và ngân sách phối hợp với nhau.'],
        ['Name one topic this course only introduces and a later subject that covers it deeply.', 'Kể một chủ đề khoá này chỉ giới thiệu và môn sau đào sâu nó.', 'For example crisis communication, covered in CRM301; or legal and privacy issues, covered in EPL201.', 'Ví dụ truyền thông khủng hoảng (CRM301) hoặc pháp lý và quyền riêng tư (EPL201).']] }),

  D(P + '0-2', '0.2 Textbooks & resources', '0.2 Giáo trình & tài liệu',
    'Giáo trình chuẩn có ISBN, khoá học mở và nguồn tra cứu đã kiểm.', {
    n: '0.2',
    g: [['Choose a main textbook and two references', 'Chọn giáo trình chính và hai sách tham khảo'], ['Know free sources for definitions, cases and effectiveness research', 'Biết nguồn miễn phí để tra định nghĩa, tình huống và nghiên cứu hiệu quả']],
    b: [`<h4>Books (ISBNs seen on a bibliographic database listing)</h4>
<ul><li><strong>Advertising and Promotion: An Integrated Marketing Communications Perspective</strong>, George E. Belch and Michael A. Belch, 12th edition, McGraw-Hill Education, 2021. ISBN 978-1-260-57099-1. <em>Main textbook of this outline.</em></li>
<li><strong>Advertising, Promotion, and Other Aspects of Integrated Marketing Communications</strong>, Terence A. Shimp and J. Craig Andrews, Cengage Learning, 2017 edition (10th). ISBN 978-1-337-58457-9. A second full IMC textbook with a strong behavioural-science angle.</li>
<li><strong>Principles of Marketing</strong>, Philip Kotler and Gary Armstrong, 18th edition, Pearson, 2020. ISBN 978-0-13-670858-2. Use its promotion chapters as a short refresher on the whole marketing context.</li></ul>
<p>Edition note: newer editions may exist and the chapter numbering differs; this course does not depend on page numbers. Check the ISBN printed on your own copy.</p>
<h4>Free resources</h4>` + lk(['ama', 'ipa', 'tgoogle', 'prsa', 'wharton', 'ana'], 1) + `<p><strong>Study routine.</strong> Each week: read one chapter, collect two real campaigns (one Vietnamese, one international) from the brand's own site or trade press, and write a 5-line analysis: objective, audience, message, tools, how success was judged. Wikipedia pages linked in lessons are for quick definitions; for exams and assignments cite the textbooks and say which facts you could not verify.</p>`,
       `<h4>Sách (ISBN đã thấy trên một danh mục thư mục)</h4>
<ul><li><strong>Advertising and Promotion: An Integrated Marketing Communications Perspective</strong>, George E. Belch và Michael A. Belch, lần xuất bản 12, McGraw-Hill Education, 2021. ISBN 978-1-260-57099-1. <em>Giáo trình chính của khung này.</em></li>
<li><strong>Advertising, Promotion, and Other Aspects of Integrated Marketing Communications</strong>, Terence A. Shimp và J. Craig Andrews, Cengage Learning, bản 2017 (lần 10). ISBN 978-1-337-58457-9. Một giáo trình IMC đầy đủ khác, mạnh về góc nhìn khoa học hành vi.</li>
<li><strong>Principles of Marketing</strong>, Philip Kotler và Gary Armstrong, lần xuất bản 18, Pearson, 2020. ISBN 978-0-13-670858-2. Dùng các chương về xúc tiến để ôn nhanh toàn bộ bối cảnh marketing.</li></ul>
<p>Lưu ý: có thể đã có bản mới hơn và số chương khác; khoá này không phụ thuộc số trang. Hãy kiểm ISBN in trên cuốn của bạn.</p>
<h4>Tài nguyên miễn phí</h4>` + lk(['ama', 'ipa', 'tgoogle', 'prsa', 'wharton', 'ana'], 2) + `<p><strong>Thói quen học.</strong> Mỗi tuần: đọc một chương, sưu tầm hai chiến dịch thật (một Việt Nam, một quốc tế) từ trang chính thức của thương hiệu hoặc báo ngành, viết phân tích 5 dòng: mục tiêu, đối tượng, thông điệp, công cụ, cách đánh giá thành công. Các trang Wikipedia dẫn trong bài chỉ để tra nhanh định nghĩa; khi làm bài thi, bài tập hãy trích giáo trình và nói rõ điều nào bạn chưa kiểm chứng được.</p>`],
    s: [['Main book: Belch &amp; Belch, 12th ed.; references: Shimp &amp; Andrews and Kotler &amp; Armstrong.', 'Sách chính: Belch &amp; Belch, bản 12; tham khảo: Shimp &amp; Andrews và Kotler &amp; Armstrong.'], ['Use AMA, IPA, Think with Google and PRSA for official definitions and research.', 'Dùng AMA, IPA, Think with Google, PRSA cho định nghĩa và nghiên cứu chính thức.'], ['Weekly habit: two real campaigns and a 5-line analysis.', 'Thói quen hằng tuần: hai chiến dịch thật và phân tích 5 dòng.']],
    l: ['ama', 'ipa'],
    p: [['Which book is the main textbook in this outline?', 'Sách nào là giáo trình chính của khung này?', 'Belch and Belch, Advertising and Promotion: An Integrated Marketing Communications Perspective (12th ed.).', 'Belch và Belch, Advertising and Promotion: An Integrated Marketing Communications Perspective (bản 12).'],
        ['Why check the ISBN printed on your own copy?', 'Vì sao nên kiểm ISBN in trên cuốn của bạn?', 'Editions, printings and regional versions carry different ISBNs and chapter numbers.', 'Các lần xuất bản và bản khu vực có ISBN và số chương khác nhau.']] }),
]));
// ===== Ví dụ làm thêm (XTRA) =====
XTRA['1.2'] = [`<p>Take a fictional mid-size electronics retailer, "TechHub", which sells laptops online and in 12 shops. Marketing runs a "Back to school" video campaign promising free delivery. The e-commerce team, working to a monthly revenue target, sets delivery to be free only above 5,000,000 VND. The shops run their own flyers with a different discount. A student sees the video, visits the site, finds the condition, and reads shop reviews complaining about mixed messages.</p>
<p>How would an integrated approach change this? First, one owner writes the offer and its conditions in a single shared sheet. Second, every team checks its material against it before publishing. Third, the video's last frame states the condition in plain words. The cost is a weekly 30-minute meeting; the benefit is that nobody has to apologise to customers later. Notice that no new tool or agency was needed.</p>`,
`<p>Hãy lấy một nhà bán lẻ điện tử hư cấu cỡ vừa, "TechHub", bán laptop trực tuyến và tại 12 cửa hàng. Marketing chạy chiến dịch video "Tựu trường" hứa giao hàng miễn phí. Đội thương mại điện tử, chạy theo chỉ tiêu doanh thu tháng, đặt miễn phí giao hàng chỉ từ 5.000.000 đồng. Các cửa hàng phát tờ rơi riêng với mức giảm khác. Một sinh viên xem video, vào website, thấy điều kiện, rồi đọc đánh giá phàn nàn về thông tin lẫn lộn.</p>
<p>Cách tích hợp sẽ đổi điều này ra sao? Thứ nhất, một người chủ viết ưu đãi và điều kiện vào một bảng chung. Thứ hai, mọi đội đối chiếu sản phẩm của mình với bảng đó trước khi đăng. Thứ ba, khung hình cuối của video nêu điều kiện bằng lời giản dị. Chi phí là một cuộc họp 30 phút mỗi tuần; lợi ích là không ai phải xin lỗi khách sau này. Lưu ý không cần công cụ hay agency mới.</p>`];
XTRA['1.3'] = [`<p>Apply the eight steps to a fictional small business: "Lá Cafe", a café near a university campus that wants more weekday afternoon customers. Step 1: the business goal is 20 extra orders per weekday afternoon (an estimate to confirm against sales data). Step 2: the audience is students with free periods who currently go to a rival chain. Step 3: the objective is to get 300 students to redeem a first-visit voucher within six weeks. Step 4: the message is "your quiet corner between classes". Step 5: the mix is posters in the faculty, short videos by two student creators, a voucher through the club group chats, and a small sampling table. Step 6: a modest budget, mostly production time. Step 7: staff learn the offer rules. Step 8: count vouchers, ask redeemers how they heard of the café, and compare weekday afternoon orders with the previous six weeks.</p>`,
`<p>Hãy áp tám bước vào một doanh nghiệp nhỏ hư cấu: "Lá Cafe", quán cà phê gần khuôn viên đại học muốn có thêm khách chiều ngày thường. Bước 1: mục tiêu kinh doanh là thêm 20 đơn mỗi chiều ngày thường (ước lượng, cần đối chiếu dữ liệu bán hàng). Bước 2: đối tượng là sinh viên có tiết trống đang đến chuỗi đối thủ. Bước 3: mục tiêu là có 300 sinh viên dùng voucher lần đầu trong sáu tuần. Bước 4: thông điệp là "góc yên tĩnh giữa hai tiết học". Bước 5: mix gồm áp phích ở khoa, video ngắn của hai bạn sinh viên làm nội dung, voucher qua nhóm chat câu lạc bộ và một bàn phát thử nhỏ. Bước 6: ngân sách khiêm tốn, chủ yếu là công sản xuất. Bước 7: nhân viên nắm quy tắc ưu đãi. Bước 8: đếm voucher, hỏi người dùng voucher biết quán từ đâu, và so số đơn chiều ngày thường với sáu tuần trước.</p>`];
XTRA['2.1'] = [`<p>Practise by decoding a real-looking problem. A fictional insurer posts: "Zero-excess cover with a 90-day waiting period on pre-existing conditions". Source: the insurer. Encoding: legal terms. Channel: a social post with a small image. Receiver: a 25-year-old first-time buyer. Noise: unfamiliar terms ("excess", "waiting period"), a feed full of other content, a tiny font. Feedback visible in the comments: three people ask "so what is covered?". The diagnosis is that the receiver could not decode the message. A repaired version says: "If you get sick, we pay from day one for most things. For illnesses you already had, cover starts after 90 days." The channel did not change; only the encoding did.</p>`,
`<p>Hãy luyện bằng cách giải mã một vấn đề trông như thật. Một công ty bảo hiểm hư cấu đăng: "Bảo hiểm không khấu trừ, thời gian chờ 90 ngày với bệnh có sẵn". Nguồn: công ty bảo hiểm. Mã hoá: thuật ngữ pháp lý. Kênh: bài đăng mạng xã hội với ảnh nhỏ. Người nhận: người 25 tuổi mua lần đầu. Nhiễu: thuật ngữ lạ ("khấu trừ", "thời gian chờ"), bảng tin đầy nội dung khác, chữ quá nhỏ. Phản hồi thấy trong bình luận: ba người hỏi "vậy được chi trả những gì?". Chẩn đoán: người nhận không giải mã được. Bản sửa nói: "Nếu bạn ốm, chúng tôi chi trả ngay từ ngày đầu cho hầu hết trường hợp. Với bệnh đã có từ trước, bảo hiểm bắt đầu sau 90 ngày." Kênh không đổi; chỉ mã hoá đổi.</p>`];
XTRA['2.2'] = [`<p>Imagine a new fictional language-learning app, "Lingo Pocket", planning its first quarter. Using the ladder, the team writes one question per stage: (Awareness) do students know the app exists? (Knowledge) do they understand it works in ten-minute lessons? (Liking) do they prefer it to a rival? (Conviction) do they intend to try it? (Action) do they install and finish a first lesson? Next to each question they place a tool and a metric: short videos and campus PR for awareness (aided awareness survey); a demo page for knowledge (time on page); creator reviews for liking (survey preference); a free first month for conviction (sign-up intent); an onboarding email for action (first-lesson completion).</p>
<p>The value of the exercise is diagnostic: if awareness is high but installs are low, adding more awareness spending is the wrong fix; the problem sits at liking or conviction.</p>`,
`<p>Hãy tưởng tượng một ứng dụng học ngôn ngữ hư cấu mới, "Lingo Pocket", lập kế hoạch quý đầu. Dùng thang phản ứng, đội viết một câu hỏi cho mỗi giai đoạn: (Nhận biết) sinh viên có biết ứng dụng tồn tại không? (Hiểu biết) họ có hiểu bài học chỉ mười phút không? (Thích) họ có ưa nó hơn đối thủ không? (Tin chắc) họ có ý định thử không? (Hành động) họ có cài và hoàn thành bài đầu không? Cạnh mỗi câu hỏi họ đặt một công cụ và một chỉ số: video ngắn và PR trong trường cho nhận biết (khảo sát nhận biết có gợi ý); trang demo cho hiểu biết (thời gian trên trang); đánh giá của nhà sáng tạo cho mức thích (ưa chuộng trong khảo sát); tháng đầu miễn phí cho tin chắc (ý định đăng ký); email hướng dẫn cho hành động (hoàn thành bài đầu).</p>
<p>Giá trị của bài tập là chẩn đoán: nếu nhận biết cao nhưng lượt cài thấp, chi thêm cho nhận biết là sai cách; vấn đề nằm ở mức thích hoặc tin chắc.</p>`];
XTRA['2.3'] = [`<p>Compare two purchases by the same student, Linh. For a 20,000,000 VND laptop she reads reviews for two weeks, compares specifications, asks seniors and checks the warranty: high involvement, central route. Brand cues matter less than evidence; a weak argument in an ad would be noticed. For a pack of tissues at the corner shop she picks the pack she saw most often and that is on the nearest shelf: low involvement, peripheral cues and availability decide.</p>
<p>A marketer who knows this gives the laptop buyer a comparison table, honest reviews and a trial; for the tissues the job is a distinctive pack, easy availability and repetition. The same student, two completely different communication jobs. Before briefing any creative work, write one line: "For this product, our audience will most likely use the ___ route because ___."</p>`,
`<p>So sánh hai lần mua của cùng một sinh viên, Linh. Với laptop 20.000.000 đồng, cô đọc đánh giá hai tuần, so thông số, hỏi các anh chị khoá trên và kiểm tra bảo hành: quan tâm cao, đường trung tâm. Tín hiệu thương hiệu ít quan trọng hơn bằng chứng; lập luận yếu trong quảng cáo sẽ bị nhận ra. Với gói khăn giấy ở tạp hoá đầu ngõ, cô chọn gói thấy nhiều nhất và nằm ở kệ gần nhất: quan tâm thấp, tín hiệu ngoại vi và độ sẵn có quyết định.</p>
<p>Người làm marketing hiểu điều này sẽ đưa người mua laptop bảng so sánh, đánh giá trung thực và dùng thử; với khăn giấy, việc là bao bì đặc trưng, dễ mua và lặp lại. Cùng một sinh viên, hai nhiệm vụ truyền thông hoàn toàn khác. Trước khi brief bất kỳ công việc sáng tạo nào, viết một dòng: "Với sản phẩm này, khán giả của ta nhiều khả năng đi đường ___ vì ___."</p>`];
XTRA['2.4'] = [`<p>Trace how a fictional launch spreads. A new reusable-bottle brand pays for a short video on social platforms (paid). A campus environmental club leader, an opinion leader in her circle, tries the bottle and posts an honest review with its minor flaw (earned). Her followers share it in class group chats, where friends ask each other "is it leak-proof?" (word of mouth). The brand's own page answers the leak question with a test video (owned) and pins it. A local news site picks up the club's refill-station project (earned).</p>
<p>Lessons: the paid video opened the story, but the two-step flow carried it; the admitted flaw raised credibility; and the brand's fast owned answer closed the loop. What the brand must not do is script the review or offer a hidden payment: if it gives free bottles or money, the post must say so.</p>`,
`<p>Truy dấu cách một đợt ra mắt hư cấu lan toả. Một thương hiệu bình nước tái sử dụng mới trả tiền cho một video ngắn trên nền tảng xã hội (paid). Trưởng câu lạc bộ môi trường của trường, một người dẫn dắt trong vòng quen của cô, dùng thử bình và đăng đánh giá trung thực kèm một nhược điểm nhỏ (earned). Người theo dõi cô chia sẻ trong nhóm chat lớp, nơi bạn bè hỏi nhau "có chống rò không?" (truyền miệng). Trang riêng của thương hiệu trả lời câu hỏi rò rỉ bằng video thử nghiệm (owned) và ghim lên. Một trang tin địa phương đưa tin dự án trạm nạp nước của câu lạc bộ (earned).</p>
<p>Bài học: video trả tiền mở đầu câu chuyện, nhưng dòng hai bước mang nó đi; nhược điểm được thừa nhận làm tăng uy tín; và câu trả lời nhanh trên kênh riêng của thương hiệu khép vòng. Điều thương hiệu không được làm là viết kịch bản đánh giá hay trả tiền ngầm: nếu tặng bình hoặc trả tiền, bài đăng phải nói rõ.</p>`];
XTRA['2.5'] = [`<p>Map a journey for a fictional meal-kit startup, "Bếp Nhà", for the persona Hà, a 27-year-old office worker who rarely cooks. Stage 1, need: she is tired of takeaway; touchpoint: a friend's story. Stage 2, search: she looks up "meal kit" and reads two blogs; touchpoints: search results and reviews. Stage 3, compare: she checks price per meal and delivery times; touchpoints: the website and a comparison post. Stage 4, buy: she orders a trial box; touchpoint: checkout and a confirmation message. Stage 5, use: she opens the box; touchpoints: packaging, recipe card, a phone video. Stage 6, recommend: she posts a photo if the meal worked.</p>
<p>Gaps found: the website does not show delivery times for her district (stage 3); the recipe card uses terms she does not know (stage 5). Both are cheap fixes with more impact than another ad.</p>`,
`<p>Vẽ hành trình cho một startup hộp nguyên liệu nấu ăn hư cấu, "Bếp Nhà", với persona Hà, nhân viên văn phòng 27 tuổi hiếm khi nấu. Giai đoạn 1, nhu cầu: cô chán đồ ăn mang về; điểm chạm: câu chuyện của một người bạn. Giai đoạn 2, tìm kiếm: cô tìm "hộp nguyên liệu nấu ăn" và đọc hai blog; điểm chạm: kết quả tìm kiếm và đánh giá. Giai đoạn 3, so sánh: cô kiểm tra giá mỗi bữa và thời gian giao; điểm chạm: website và một bài so sánh. Giai đoạn 4, mua: cô đặt hộp dùng thử; điểm chạm: thanh toán và tin nhắn xác nhận. Giai đoạn 5, dùng: cô mở hộp; điểm chạm: bao bì, thẻ công thức, một video trên điện thoại. Giai đoạn 6, giới thiệu: cô đăng ảnh nếu bữa ăn thành công.</p>
<p>Khoảng trống tìm thấy: website không nêu thời gian giao cho quận của cô (giai đoạn 3); thẻ công thức dùng thuật ngữ cô không biết (giai đoạn 5). Cả hai đều sửa rẻ và có tác động hơn một quảng cáo nữa.</p>`];
XTRA['3.1'] = [`<p>Case: a fictional bakery chain notices sales falling in one district. The marketing manager first proposes a new social campaign. A five-fact check changes the plan. Business goal: recover the lost sales. Product: unchanged. Market: a new rival bakery opened two streets away with lower prices. Audience: office workers who buy at lunch; interviews show the queue at the bakery is 15 minutes long at noon. Constraint: a small budget.</p>
<p>Diagnosis: the main cause is the long queue (an operations problem) plus a price gap, not low awareness. Communication can still help, for example by announcing a pre-order service by app or message, but only once the pre-order actually works. The lesson is that situation analysis stops you from spending money on the wrong problem. Record the diagnosis in one sentence before any creative work starts.</p>`,
`<p>Tình huống: một chuỗi tiệm bánh hư cấu thấy doanh số giảm ở một quận. Quản lý marketing trước hết đề xuất một chiến dịch mạng xã hội mới. Kiểm tra năm dữ kiện làm thay đổi kế hoạch. Mục tiêu kinh doanh: lấy lại doanh số đã mất. Sản phẩm: không đổi. Thị trường: một tiệm bánh đối thủ mới mở cách hai con phố với giá thấp hơn. Đối tượng: nhân viên văn phòng mua buổi trưa; phỏng vấn cho thấy hàng chờ tại tiệm dài 15 phút lúc giữa trưa. Ràng buộc: ngân sách nhỏ.</p>
<p>Chẩn đoán: nguyên nhân chính là hàng chờ dài (vấn đề vận hành) cộng khoảng cách giá, không phải nhận biết thấp. Truyền thông vẫn giúp được, chẳng hạn thông báo dịch vụ đặt trước qua ứng dụng hay tin nhắn, nhưng chỉ khi dịch vụ đặt trước thực sự chạy. Bài học: phân tích bối cảnh ngăn bạn tiêu tiền vào sai vấn đề. Ghi chẩn đoán trong một câu trước khi bắt đầu bất kỳ việc sáng tạo nào.</p>`];
XTRA['3.2'] = [`<p>Exercise: define the audience for a fictional campaign that promotes a free weekend coding bootcamp for secondary-school pupils. Layer 1 (demographic): parents of pupils aged 13 to 16 in a mid-size city. Layer 2 (behaviour): they read school group chats, look up courses online before enrolling, and ask other parents. Layer 3 (psychographic): worried that their child spends too much time on games; hopeful about a future in technology but not sure what coding is. Layer 4 (roles): the child is the user, the parent is the buyer (even if free, they give permission and transport), teachers are influencers.</p>
<p>Insight: parents are not afraid of coding; they are afraid of wasting a weekend on something that looks like more screen time. Therefore the message is not "learn to code" but "your child builds a real thing, offline first, with a mentor". The persona's own words ("I just want him to make something, not only play") become the headline seed.</p>`,
`<p>Bài tập: xác định đối tượng cho chiến dịch hư cấu quảng bá lớp học lập trình cuối tuần miễn phí cho học sinh cấp hai. Lớp 1 (nhân khẩu): phụ huynh học sinh 13 đến 16 tuổi ở thành phố cỡ vừa. Lớp 2 (hành vi): họ đọc nhóm chat của trường, tìm khoá học trên mạng trước khi ghi danh và hỏi phụ huynh khác. Lớp 3 (tâm lý): lo con chơi game quá nhiều; hy vọng tương lai công nghệ nhưng chưa rõ lập trình là gì. Lớp 4 (vai trò): con là người dùng, phụ huynh là người mua (dù miễn phí vẫn là người cho phép và đưa đón), giáo viên là người ảnh hưởng.</p>
<p>Insight: phụ huynh không sợ lập trình; họ sợ phí một cuối tuần cho thứ trông như thêm thời gian trước màn hình. Vì vậy thông điệp không phải "học lập trình" mà là "con bạn làm ra một sản phẩm thật, bắt đầu không cần máy tính, có người hướng dẫn". Lời của chính persona ("tôi chỉ muốn con làm ra thứ gì đó, không chỉ chơi") trở thành hạt giống cho tiêu đề.</p>`];
XTRA['3.3'] = [`<p>Practice turning a vague wish into a proper objective. A fictional student club says: "We want to be better known." Step 1: audience, first-year students of the business faculty. Step 2: measure, aided awareness of the club name (a one-question poll at the faculty lobby). Step 3: baseline, run the poll with 100 students: 18 know the club, so 18%. Step 4: target, 35%. Step 5: date, before the start of the second semester.</p>
<p>Final objective: "Among first-year business students, raise aided awareness of the club from 18% to 35% by the start of the second semester, measured with the same 100-student lobby poll." Now the plan has a yardstick: a poster campaign that leaves the figure at 20% is a failure to learn from, not a success because "many people saw it". Note the poll is small, so report it as indicative and repeat the method exactly.</p>`,
`<p>Luyện biến một mong muốn mơ hồ thành mục tiêu đúng nghĩa. Một câu lạc bộ sinh viên hư cấu nói: "Chúng tôi muốn được biết đến nhiều hơn." Bước 1: đối tượng, sinh viên năm nhất khoa kinh doanh. Bước 2: chỉ số, nhận biết có gợi ý về tên câu lạc bộ (khảo sát một câu hỏi ở sảnh khoa). Bước 3: mức nền, khảo sát 100 sinh viên: 18 người biết câu lạc bộ, tức 18%. Bước 4: đích, 35%. Bước 5: ngày, trước khi học kỳ hai bắt đầu.</p>
<p>Mục tiêu cuối: "Trong sinh viên năm nhất khoa kinh doanh, nâng nhận biết có gợi ý về câu lạc bộ từ 18% lên 35% trước khi học kỳ hai bắt đầu, đo bằng cùng khảo sát 100 sinh viên tại sảnh." Giờ kế hoạch có thước đo: chiến dịch áp phích để con số ở 20% là thất bại cần học, không phải thành công vì "nhiều người đã thấy". Lưu ý khảo sát nhỏ, nên báo cáo như chỉ báo và lặp lại đúng phương pháp.</p>`];
XTRA['3.4'] = [`<p>Review a weak brief and fix it. The weak brief for a fictional online tutoring platform says: "Audience: all students. Message: we are affordable, high quality, flexible, trusted by thousands, and have the best teachers. Objective: be number one. Tone: fun but professional. Budget: as needed."</p>
<p>Faults: the audience is everyone; there are five messages; "number one" cannot be measured; "trusted by thousands" has no source; the budget is not a number; the tone is contradictory. The fixed version chooses one audience (Grade 12 students preparing for the national exam in two cities), one proposition (a mock exam with personal feedback every week), one reason to believe (named teachers and sample feedback), one objective (800 trial sign-ups in four weeks, baseline 150 per month), a budget range, and a tone ("calm, like a good older cousin"). The fix took 20 minutes and removed most later arguments.</p>`,
`<p>Xem lại một brief yếu và sửa. Brief yếu của một nền tảng gia sư trực tuyến hư cấu viết: "Đối tượng: mọi học sinh. Thông điệp: chúng tôi giá rẻ, chất lượng cao, linh hoạt, được hàng nghìn người tin dùng, có giáo viên tốt nhất. Mục tiêu: đứng số một. Giọng điệu: vui nhưng chuyên nghiệp. Ngân sách: tuỳ nhu cầu."</p>
<p>Lỗi: đối tượng là tất cả; có năm thông điệp; "số một" không đo được; "hàng nghìn người tin dùng" không có nguồn; ngân sách không phải con số; giọng điệu mâu thuẫn. Bản sửa chọn một đối tượng (học sinh lớp 12 ôn thi tốt nghiệp ở hai thành phố), một đề xuất (thi thử có góp ý cá nhân mỗi tuần), một lý do tin (giáo viên có tên và mẫu góp ý), một mục tiêu (800 lượt đăng ký học thử trong bốn tuần, mức nền 150 mỗi tháng), một khung ngân sách và một giọng điệu ("điềm tĩnh, như người anh họ tốt"). Việc sửa mất 20 phút và loại bỏ phần lớn tranh cãi về sau.</p>`];
XTRA['4.2'] = [`<p>Compare appeals on one brief: encourage students to wear a helmet when riding a motorbike (a fictional campaign by a student safety club). Rational version: a poster with a short, sourced fact about how helmets reduce head injury and the price of a certified helmet. Emotional version: a one-minute film of a student's family waiting for a call after a ride. Fear version: a realistic crash scene. Humour version: a helmet "complaining" it is bored on the hook.</p>
<p>Pre-test each with 10 students and note three things: did they remember the message, did they feel judged, would they share it? Often the emotional-plus-action version (the family film ending with "buy and wear your helmet today, ask us where to get a certified one") wins on memory, while the extreme fear version gets avoided. The test is cheap, and it moves the choice from taste to evidence. Never use a real accident or a real person's image without permission.</p>`,
`<p>So sánh các kiểu thu hút trên cùng một brief: khuyến khích sinh viên đội mũ bảo hiểm khi đi xe máy (chiến dịch hư cấu của một câu lạc bộ an toàn sinh viên). Bản lý trí: áp phích với một dữ kiện ngắn có nguồn về việc mũ bảo hiểm giảm chấn thương đầu và giá một chiếc mũ đạt chuẩn. Bản cảm xúc: phim một phút về gia đình sinh viên chờ cuộc gọi sau chuyến đi. Bản sợ hãi: cảnh va chạm thực tế. Bản hài hước: chiếc mũ "than phiền" vì chán trên móc treo.</p>
<p>Thử trước mỗi bản với 10 sinh viên và ghi ba điều: họ có nhớ thông điệp không, có cảm thấy bị phán xét không, có chia sẻ không? Thường bản cảm xúc kèm hành động (phim gia đình kết bằng "mua và đội mũ hôm nay, hỏi chúng tôi mua mũ đạt chuẩn ở đâu") thắng về trí nhớ, còn bản sợ hãi quá mức bị né. Phép thử rẻ và đưa lựa chọn từ cảm tính sang bằng chứng. Không bao giờ dùng tai nạn thật hay hình ảnh người thật khi chưa được phép.</p>`];
XTRA['4.3'] = [`<p>Evaluate a short piece with the checklist: a 15-second video for a fictional refill-shop. Script: a hand pours shampoo from a big container into an empty bottle; text: "Same shampoo, 30% cheaper because you do not pay for the bottle. Scan to find your nearest refill shop." Check: proposition within 3 seconds? Yes, the pouring shows it. Brand recognisable? The logo appears only in the last frame, risky if people leave early; move it to the first second. Reason to believe? The "30% cheaper" claim is in the script, but where does the number come from? It must be backed by a price comparison the shop can show; if it varies by product, say "up to" only if some product really reaches it. CTA specific? "Scan" is clear. Consistent with other tools? The poster should show the same pouring image.</p>
<p>Result: three edits, none expensive, each tied to a checklist line.</p>`,
`<p>Đánh giá một sản phẩm ngắn bằng danh sách kiểm: video 15 giây cho một cửa hàng nạp lại hư cấu. Kịch bản: một bàn tay rót dầu gội từ thùng lớn vào chai rỗng; chữ: "Cùng loại dầu gội, rẻ hơn 30% vì bạn không trả tiền vỏ chai. Quét mã để tìm cửa hàng nạp lại gần nhất." Kiểm: đề xuất xuất hiện trong 3 giây đầu? Có, cảnh rót cho thấy. Thương hiệu nhận ra được? Logo chỉ xuất hiện ở khung cuối, rủi ro nếu người xem bỏ sớm; chuyển lên giây đầu. Có lý do tin? Tuyên bố "rẻ hơn 30%" nằm trong kịch bản, nhưng con số lấy từ đâu? Phải có bảng so giá cửa hàng chứng minh được; nếu thay đổi theo sản phẩm, chỉ ghi "tới" khi có sản phẩm thật sự đạt mức đó. CTA cụ thể? "Quét mã" rõ ràng. Nhất quán với công cụ khác? Áp phích nên dùng cùng hình rót.</p>
<p>Kết quả: ba chỉnh sửa, không cái nào đắt, mỗi cái gắn với một dòng danh sách kiểm.</p>`];
XTRA['5.1'] = [`<p>Choose the advertising role for three fictional objectives. (1) A new snack brand with 5% aided awareness wants 30% in three months: brand advertising with wide reach (video, out-of-home), repeated. (2) A bookshop wants to fill a Saturday signing event: response advertising with a date, place and sign-up link, running only for ten days before the event. (3) A bank wants customers to feel safe after a data scare: corporate advertising is the wrong first tool; PR, direct messages to customers and visible service fixes come first, and ads only later, if at all.</p>
<p>The common thread: ask what the audience must know, feel or do, then pick the type of advertising whose job matches. Write the match in a sentence: "We use ___ advertising to ___ among ___, measured by ___." If you cannot fill all four blanks, the brief is not ready.</p>`,
`<p>Chọn vai trò quảng cáo cho ba mục tiêu hư cấu. (1) Thương hiệu snack mới có 5% nhận biết có gợi ý muốn đạt 30% trong ba tháng: quảng cáo thương hiệu phủ rộng (video, ngoài trời), lặp lại. (2) Một hiệu sách muốn lấp đầy buổi ký tặng thứ Bảy: quảng cáo phản hồi có ngày, địa điểm và đường dẫn đăng ký, chỉ chạy mười ngày trước sự kiện. (3) Một ngân hàng muốn khách cảm thấy an toàn sau sự cố dữ liệu: quảng cáo doanh nghiệp là công cụ đầu tiên sai; PR, tin nhắn trực tiếp tới khách và sửa dịch vụ thấy được đi trước, quảng cáo chỉ về sau, nếu có.</p>
<p>Sợi chỉ chung: hỏi khán giả cần biết, cảm nhận hay làm gì, rồi chọn loại quảng cáo có nhiệm vụ khớp. Viết phép ghép thành một câu: "Chúng tôi dùng quảng cáo ___ để ___ ở ___, đo bằng ___." Nếu không điền đủ bốn chỗ trống, brief chưa sẵn sàng.</p>`];
XTRA['5.2'] = [`<p>Turn a plain announcement into a story. A fictional university library opens a 24-hour study floor during exam weeks. Original headline: "Library extends opening hours." Few editors care. Look for an angle: the student union asked for it in a petition; the floor is staffed by volunteer senior students who run a "quiet hour" with free tea; last term's complaint count shows the need. A better pitch for the campus newsroom: "Students win 24-hour study floor after petition; volunteers staff it during exams."</p>
<p>Now run the news test. Timely: exam season. Impact: many students. Human interest: volunteers and petitioners. Proximity: on campus. Each answer is yes, so a story exists. Prepare a spokesperson (the librarian), a photo, and two student quotes, with permission. The same facts, framed around people, are far more likely to be published. Check every fact with the library before you send anything.</p>`,
`<p>Biến một thông báo trơn thành câu chuyện. Một thư viện đại học hư cấu mở tầng tự học 24 giờ trong tuần thi. Tiêu đề gốc: "Thư viện kéo dài giờ mở cửa." Ít biên tập viên quan tâm. Hãy tìm góc tiếp cận: hội sinh viên đã kiến nghị; tầng này do các sinh viên khoá trên tình nguyện trông, tổ chức "giờ yên lặng" với trà miễn phí; số khiếu nại học kỳ trước cho thấy nhu cầu. Pitch tốt hơn cho ban truyền thông của trường: "Sinh viên giành được tầng tự học 24 giờ sau kiến nghị; tình nguyện viên trông tầng trong mùa thi."</p>
<p>Giờ chạy phép thử tin. Thời sự: mùa thi. Tác động: nhiều sinh viên. Câu chuyện con người: tình nguyện viên và người kiến nghị. Gần gũi: ngay trong trường. Mỗi câu đều "có", vậy câu chuyện tồn tại. Chuẩn bị người phát ngôn (thủ thư), một bức ảnh và hai lời trích của sinh viên, có sự đồng ý. Cùng dữ kiện, đóng khung quanh con người, có khả năng được đăng cao hơn nhiều. Kiểm mọi dữ kiện với thư viện trước khi gửi.</p>`];
XTRA['5.3'] = [`<p>Write a model release for a fictional student startup, "ClassNote", which launches a free note-sharing app on campus (all details invented for practice). Headline: "Student team launches free note-sharing app at [University]". First paragraph: "A team of four second-year students launched ClassNote on [date], a free app where students share lecture notes by course. The app is available on [platforms] and was tested by [number to confirm] students last semester." Supporting fact: "Survey of [number to confirm] students found [result to confirm]." Quote: "We started because we missed a lecture and had no way to catch up", said [name], co-founder. Boilerplate: two lines about the team. Contact: name, phone, email.</p>
<p>Note the brackets: every fact that is not yet verified is marked. A release with unverified numbers must not be sent. After sending, track which outlets used it, whether the message "free" was kept, and traffic to the app page using a tagged link.</p>`,
`<p>Viết một thông cáo mẫu cho startup sinh viên hư cấu "ClassNote", ra mắt ứng dụng chia sẻ ghi chép miễn phí trong trường (mọi chi tiết bịa để luyện tập). Tiêu đề: "Nhóm sinh viên ra mắt ứng dụng chia sẻ ghi chép miễn phí tại [Trường]". Đoạn đầu: "Nhóm bốn sinh viên năm hai ra mắt ClassNote ngày [ngày], ứng dụng miễn phí để sinh viên chia sẻ ghi chép bài giảng theo môn. Ứng dụng có trên [nền tảng] và đã được [số cần xác nhận] sinh viên thử học kỳ trước." Dữ kiện hỗ trợ: "Khảo sát [số cần xác nhận] sinh viên cho thấy [kết quả cần xác nhận]." Trích dẫn: "Chúng tôi bắt đầu vì lỡ một buổi học và không có cách bắt kịp", [tên], đồng sáng lập, cho biết. Giới thiệu: hai dòng về nhóm. Liên hệ: tên, điện thoại, email.</p>
<p>Lưu ý các ngoặc vuông: mọi dữ kiện chưa xác minh đều được đánh dấu. Thông cáo còn số liệu chưa xác minh thì không được gửi. Sau khi gửi, theo dõi những tờ báo đã dùng, thông điệp "miễn phí" có được giữ không và lượng truy cập trang ứng dụng bằng đường dẫn có gắn thẻ.</p>`];
XTRA['6.1'] = [`<p>Design a promotion for a fictional campus bubble-tea shop, step by step. Objective: 500 first-time customers in four weeks from students who have not visited. Technique options: (a) 30% off for everyone, (b) a first-visit voucher shared in group chats, (c) buy-one-get-one on Mondays, (d) a loyalty stamp card. Evaluate: (a) subsidises existing customers and hurts margin; (b) targets new people, can be tracked with a code, and limits cost to redemptions; (c) shifts demand to a slow day, good for capacity but may cannibalise other days; (d) retention tool, not a trial tool.</p>
<p>Choose (b), with a code unique to each group chat so you can see which channel works. Set rules in writing: one use per person, expiry date, not combinable. Track: vouchers shared, redeemed, average spend, and how many returned within two weeks. After the four weeks, compute extra profit as in the formula and decide whether to repeat.</p>`,
`<p>Thiết kế một khuyến mãi cho quán trà sữa hư cấu trong trường, từng bước. Mục tiêu: 500 khách lần đầu trong bốn tuần từ những sinh viên chưa từng đến. Các kỹ thuật: (a) giảm 30% cho tất cả, (b) voucher lần đầu chia sẻ trong nhóm chat, (c) mua một tặng một vào thứ Hai, (d) thẻ tích tem thân thiết. Đánh giá: (a) trợ giá khách cũ và hại biên lợi nhuận; (b) nhắm người mới, theo dõi được bằng mã, chi phí giới hạn ở số người dùng; (c) chuyển cầu sang ngày vắng, tốt cho công suất nhưng có thể ăn lẫn các ngày khác; (d) công cụ giữ chân, không phải công cụ dùng thử.</p>
<p>Chọn (b), với mã riêng cho mỗi nhóm chat để thấy kênh nào hiệu quả. Đặt quy tắc bằng văn bản: mỗi người một lần, có hạn dùng, không cộng gộp. Theo dõi: voucher chia sẻ, dùng, chi tiêu trung bình và bao nhiêu người quay lại trong hai tuần. Sau bốn tuần, tính lợi nhuận tăng thêm theo công thức và quyết định có lặp lại không.</p>`];
XTRA['6.2'] = [`<p>Plan a small email programme for a fictional online bookshop with 3,000 consented subscribers. Segment by RFM: 400 bought in the last 30 days and more than twice this year (champions); 1,200 bought once, 2 to 6 months ago (warm); 1,400 have not bought in over 6 months (lapsed). Offers: champions get early access to a new release (no discount needed); warm customers get a recommendation based on their last purchase; lapsed customers get a "we miss you" email with a small voucher.</p>
<p>Test: split the lapsed group randomly in two, 700 each; send subject line A "A book for your weekend" and B "We saved you 10% off". Suppose A gets 21 purchases (3.0%) and B 35 (5.0%). Before declaring B the winner, remember that the difference may reflect the discount itself, which costs margin; compute profit per email rather than only the rate. Add an easy unsubscribe link, and remove anyone who asks within a day.</p>`,
`<p>Lập một chương trình email nhỏ cho một hiệu sách trực tuyến hư cấu có 3.000 người đăng ký đã đồng ý. Phân khúc theo RFM: 400 người mua trong 30 ngày qua và hơn hai lần trong năm nay (khách cốt lõi); 1.200 người mua một lần cách đây 2 đến 6 tháng (ấm); 1.400 người chưa mua hơn 6 tháng (đã ngừng). Ưu đãi: khách cốt lõi được tiếp cận sớm sách mới (không cần giảm giá); khách ấm nhận gợi ý theo lần mua cuối; khách đã ngừng nhận email "nhớ bạn" kèm voucher nhỏ.</p>
<p>Thử nghiệm: chia ngẫu nhiên nhóm đã ngừng làm hai, 700 mỗi bên; gửi tiêu đề A "Một cuốn sách cho cuối tuần của bạn" và B "Chúng tôi giữ cho bạn giảm 10%". Giả sử A có 21 đơn (3,0%) và B 35 đơn (5,0%). Trước khi tuyên bố B thắng, nhớ rằng chênh lệch có thể do chính ưu đãi, vốn tốn biên lợi nhuận; hãy tính lợi nhuận mỗi email thay vì chỉ tỷ lệ. Thêm liên kết huỷ đăng ký dễ thấy và gỡ ngay người yêu cầu trong ngày.</p>`];
XTRA['6.3'] = [`<p>Role-play a consultative sale to practise the process. You sell tutoring packages for a fictional centre. A parent, Mr Dũng, calls after seeing an ad. Prospecting is already done by the ad. Preparation: you note his enquiry says "Grade 9, weak in maths". Approach: "Thank you for calling. To suggest the right package, may I ask what worries you most?" Needs discovery: he says his son loses confidence after tests, not that he lacks hours. Presentation: connect a small-group class with weekly feedback to confidence, not to the hours. Objection: "It is expensive." Acknowledge, then show the trial class. Close: "Shall I reserve a free trial on Saturday at 9?" Follow-up: a message after the trial and a progress note after a month.</p>
<p>Observe how little of this was "pitching". Most of it was listening. A script that jumps from approach to closing loses the sale or, worse, creates a refund.</p>`,
`<p>Đóng vai một cuộc bán hàng tư vấn để luyện quy trình. Bạn bán các gói gia sư cho một trung tâm hư cấu. Một phụ huynh, ông Dũng, gọi sau khi thấy quảng cáo. Việc tìm khách tiềm năng đã do quảng cáo làm. Chuẩn bị: bạn ghi rằng yêu cầu của ông ghi "lớp 9, yếu toán". Tiếp cận: "Cảm ơn ông đã gọi. Để gợi ý đúng gói, tôi xin hỏi điều ông lo nhất là gì?" Khám phá nhu cầu: ông nói con mất tự tin sau các bài kiểm tra, không phải thiếu giờ học. Trình bày: nối lớp nhóm nhỏ có góp ý hằng tuần với sự tự tin, không phải với số giờ. Phản đối: "Đắt quá." Ghi nhận, rồi mời học thử. Chốt: "Tôi giữ chỗ học thử miễn phí sáng thứ Bảy 9 giờ nhé?" Theo dõi: tin nhắn sau buổi thử và ghi chú tiến bộ sau một tháng.</p>
<p>Hãy để ý phần "chào hàng" ít đến thế nào. Phần lớn là lắng nghe. Kịch bản nhảy từ tiếp cận sang chốt sẽ mất đơn hoặc tệ hơn là sinh ra yêu cầu hoàn tiền.</p>`];
XTRA['7.1'] = [`<p>Plan a small paid-search and social test for a fictional language centre with 4,000,000 VND to spend over two weeks. Split: 2,000,000 VND on search for people already looking for "IELTS course near me", 1,500,000 VND on short video ads to students aged 17 to 22 in the district, 500,000 VND kept as reserve. Tag every link: <code>utm_source=google&amp;utm_medium=cpc&amp;utm_campaign=ielts_nov</code> and <code>utm_source=tiktok&amp;utm_medium=paid_social&amp;utm_campaign=ielts_nov</code> (use the platform names you actually run).</p>
<p>After two weeks, suppose search gives 500 clicks and 20 trial sign-ups (CPA 100,000 VND), and video gives 40 sign-ups for 1,500,000 VND (CPA 37,500 VND) but with a lower trial-to-enrolment rate. Do not stop at CPA: compare cost per enrolled student, then move the reserve to the better source. The numbers here are hypothetical; the habit of tagging and comparing downstream results is the point.</p>`,
`<p>Lập một thử nghiệm tìm kiếm trả tiền và mạng xã hội nhỏ cho một trung tâm ngoại ngữ hư cấu với 4.000.000 đồng chi trong hai tuần. Chia: 2.000.000 đồng cho tìm kiếm, nhắm người đang tìm "khoá IELTS gần tôi", 1.500.000 đồng cho quảng cáo video ngắn tới sinh viên 17 đến 22 tuổi trong quận, 500.000 đồng giữ dự phòng. Gắn thẻ mọi đường dẫn: <code>utm_source=google&amp;utm_medium=cpc&amp;utm_campaign=ielts_nov</code> và <code>utm_source=tiktok&amp;utm_medium=paid_social&amp;utm_campaign=ielts_nov</code> (dùng tên nền tảng bạn thực sự chạy).</p>
<p>Sau hai tuần, giả sử tìm kiếm cho 500 nhấp và 20 đăng ký học thử (CPA 100.000 đồng), còn video cho 40 đăng ký với 1.500.000 đồng (CPA 37.500 đồng) nhưng tỷ lệ từ học thử sang ghi danh thấp hơn. Đừng dừng ở CPA: so chi phí mỗi học viên ghi danh, rồi chuyển khoản dự phòng sang nguồn tốt hơn. Các số ở đây là giả định; thói quen gắn thẻ và so kết quả phía sau mới là điều cốt lõi.</p>`];
XTRA['7.2'] = [`<p>Build a four-week content plan for a fictional campus bubble-tea shop using the pillars from the lesson. Week 1: "Behind the bar", a 20-second video of the drink being made, to build familiarity. Week 2: "Student reviews", reposting customer photos with permission. Week 3: "Exam-season deals", a post with a clear voucher and a deadline. Week 4: "New flavour poll", comments decide the next product, which also creates conversation. Publish three times a week at times when your followers are online (check your page statistics instead of guessing).</p>
<p>Choose one micro-creator with 8,000 followers in the university area rather than a national name. Verify that comments are real, ask for last month's reach for similar posts, brief them with the proposition, the voucher rules and the disclosure requirement, and leave the style to them. Measure: voucher redemptions per creator code, and whether comments mention the shop name unprompted.</p>`,
`<p>Xây kế hoạch nội dung bốn tuần cho quán trà sữa hư cấu trong trường, dùng các trụ cột của bài. Tuần 1: "Hậu trường quầy pha chế", video 20 giây pha đồ uống, để tạo sự quen thuộc. Tuần 2: "Đánh giá của sinh viên", đăng lại ảnh khách có sự đồng ý. Tuần 3: "Ưu đãi mùa thi", bài đăng với voucher rõ ràng và hạn chót. Tuần 4: "Bình chọn vị mới", bình luận quyết định sản phẩm tiếp theo, cũng tạo hội thoại. Đăng ba lần mỗi tuần vào giờ người theo dõi trực tuyến (xem thống kê trang thay vì đoán).</p>
<p>Chọn một nhà sáng tạo nhỏ có 8.000 người theo dõi quanh khu đại học thay vì tên tuổi quốc gia. Kiểm tra bình luận có thật, xin mức tiếp cận tháng trước của các bài tương tự, brief bằng đề xuất, quy tắc voucher và yêu cầu công khai, rồi để họ tự chọn phong cách. Đo: số voucher dùng theo mã của từng nhà sáng tạo, và liệu bình luận có tự nhắc tên quán không.</p>`];
XTRA['8.2'] = [`<p>Exercise with a plan that combines two media (all numbers hypothetical). Target: 800,000 people. Medium 1, short video: reach 40% at frequency 2.5, cost 36,000,000 VND. Medium 2, search plus social retargeting: reach 15% at frequency 4, cost 18,000,000 VND. Overlap is ignored for simplicity (in reality, audiences overlap, so total reach is lower than the sum).</p>
<ol><li>Medium 1: GRP = 40 × 2.5 = 100; impressions = 320,000 × 2.5 = 800,000; CPM = 36,000,000 ÷ 800,000 × 1,000 = 45,000 VND.</li>
<li>Medium 2: GRP = 15 × 4 = 60; impressions = 120,000 × 4 = 480,000; CPM = 18,000,000 ÷ 480,000 × 1,000 = 37,500 VND.</li>
<li>Combined: GRP about 160, impressions 1,280,000, total cost 54,000,000 VND, blended CPM = 54,000,000 ÷ 1,280,000 × 1,000 ≈ 42,188 VND.</li></ol>
<p>Interpretation: Medium 2 is cheaper per thousand but covers a smaller share; the video delivers the reach the objective needs. Choose the mix by the objective, not by the lowest CPM.</p>`,
`<p>Bài tập với kế hoạch kết hợp hai phương tiện (mọi số đều giả định). Mục tiêu: 800.000 người. Phương tiện 1, video ngắn: reach 40% với frequency 2,5, chi phí 36.000.000 đồng. Phương tiện 2, tìm kiếm cộng nhắm lại trên mạng xã hội: reach 15% với frequency 4, chi phí 18.000.000 đồng. Bỏ qua phần trùng lặp cho đơn giản (thực tế khán giả trùng nhau nên tổng reach thấp hơn tổng cộng).</p>
<ol><li>Phương tiện 1: GRP = 40 × 2,5 = 100; lượt hiển thị = 320.000 × 2,5 = 800.000; CPM = 36.000.000 ÷ 800.000 × 1.000 = 45.000 đồng.</li>
<li>Phương tiện 2: GRP = 15 × 4 = 60; lượt hiển thị = 120.000 × 4 = 480.000; CPM = 18.000.000 ÷ 480.000 × 1.000 = 37.500 đồng.</li>
<li>Gộp: GRP khoảng 160, lượt hiển thị 1.280.000, tổng chi 54.000.000 đồng, CPM gộp = 54.000.000 ÷ 1.280.000 × 1.000 ≈ 42.188 đồng.</li></ol>
<p>Diễn giải: phương tiện 2 rẻ hơn mỗi nghìn lượt nhưng phủ ít hơn; video mang lại độ phủ mà mục tiêu cần. Chọn mix theo mục tiêu, không theo CPM thấp nhất.</p>`];
XTRA['8.3'] = [`<p>Compare two methods on the same fictional brand: a bakery chain with last year's sales of 8,000,000,000 VND that wants to open a new district. Percentage of sales at 3% gives 240,000,000 VND. Objective-and-task: the objective is 40% aided awareness in the new district within three months (baseline 0 to 5%). Tasks: a launch event (60,000,000 VND), local video and out-of-home (110,000,000 VND), sampling at offices (30,000,000 VND), PR and content (20,000,000 VND), research (15,000,000 VND), reserve and testing (25,000,000 VND). Total 260,000,000 VND.</p>
<p>The two figures are close, which supports the plan. Had they differed greatly, you would ask which assumption is wrong: perhaps the awareness objective is too ambitious, or the 3% rule does not fit a launch. Present both in the plan: the task-based budget as the proposal, the percentage as the sanity check. Also state what you would cut first if only 200,000,000 VND were approved, and what result you would then accept.</p>`,
`<p>So hai phương pháp trên cùng một thương hiệu hư cấu: chuỗi tiệm bánh có doanh thu năm ngoái 8.000.000.000 đồng muốn mở quận mới. Phần trăm doanh thu 3% cho 240.000.000 đồng. Mục tiêu và nhiệm vụ: mục tiêu là 40% nhận biết có gợi ý ở quận mới trong ba tháng (mức nền 0 đến 5%). Nhiệm vụ: sự kiện khai trương (60.000.000 đồng), video địa phương và ngoài trời (110.000.000 đồng), phát mẫu tại văn phòng (30.000.000 đồng), PR và nội dung (20.000.000 đồng), nghiên cứu (15.000.000 đồng), dự phòng và thử nghiệm (25.000.000 đồng). Tổng 260.000.000 đồng.</p>
<p>Hai con số gần nhau, ủng hộ kế hoạch. Nếu lệch nhiều, bạn sẽ hỏi giả định nào sai: có thể mục tiêu nhận biết quá tham vọng, hoặc quy tắc 3% không hợp lúc ra mắt. Trình bày cả hai trong kế hoạch: ngân sách theo nhiệm vụ làm đề xuất, phần trăm làm kiểm tra hợp lý. Cũng nêu bạn sẽ cắt gì trước nếu chỉ được duyệt 200.000.000 đồng, và khi đó chấp nhận kết quả nào.</p>`];
XTRA['9.1'] = [`<p>Build a small measurement table for the fictional career-day event used in earlier chapters. Objective: 1,000 registrations 10 days before the event (baseline: last year 600). Output metrics: posts published (24), emails sent (6,000), poster sites (30). Outcome metrics: registrations by source link, share of registrants who say they heard of it first from a peer, cost per registration. Business-result metrics: attendance on the day and the number of recruiters renewing for next year.</p>
<p>Decision rule agreed in advance: if registrations are below 40% of target by day 5 before the deadline, move the paid boost to the group-chat channel that produced the most sign-ups and send a reminder to non-registrants who opened the first email. If attendance is under 60% of registrations, add a reminder message the day before next time. The rule matters more than the dashboard: it turns numbers into actions and shows you cared about results before they arrived.</p>`,
`<p>Dựng bảng đo lường nhỏ cho sự kiện ngày hội nghề nghiệp hư cấu dùng ở các chương trước. Mục tiêu: 1.000 lượt đăng ký trước sự kiện 10 ngày (mức nền: năm ngoái 600). Chỉ số đầu ra: bài đã đăng (24), email đã gửi (6.000), điểm dán áp phích (30). Chỉ số tác động: lượt đăng ký theo đường dẫn nguồn, tỷ lệ người đăng ký nói lần đầu nghe từ bạn bè, chi phí mỗi lượt đăng ký. Chỉ số kết quả kinh doanh: số người tham dự trong ngày và số nhà tuyển dụng gia hạn cho năm sau.</p>
<p>Quy tắc quyết định thống nhất trước: nếu đăng ký dưới 40% mục tiêu vào 5 ngày trước hạn, chuyển phần đẩy trả tiền sang nhóm chat đã tạo nhiều đăng ký nhất và nhắc những người đã mở email đầu mà chưa đăng ký. Nếu tham dự dưới 60% số đăng ký, lần sau thêm tin nhắn nhắc vào ngày trước. Quy tắc quan trọng hơn bảng điều khiển: nó biến con số thành hành động và cho thấy bạn quan tâm kết quả trước khi chúng xuất hiện.</p>`];
XTRA['9.3'] = [`<p>Model a completed one-page plan in miniature for the fictional café from Chapter 1. Situation: weekday afternoons are quiet; a chain rival sits opposite. Audience: students with free periods who value a quiet seat. Objective: 300 voucher redemptions in six weeks from students new to the café (baseline: about 40 new customers per month, to confirm). Message: "your quiet corner between classes", reason to believe: photos of the room, free charging, and the average noise level measured with a free app. Tools: faculty posters and two student creators (awareness), group-chat voucher (action), a small sampling table at lunchtime (trial), staff briefed on offer rules. Media: no paid reach beyond a small boost. Budget: objective-and-task, with 10% for a mid-campaign test of two voucher wordings. Measurement: voucher codes by channel, new-customer count, a three-question survey at the till.</p>
<p>Risks: the voucher must not be combined with other offers; creators must disclose the arrangement; no personal data is collected without consent. This is a plan you can defend line by line.</p>`,
`<p>Mô phỏng kế hoạch một trang đã hoàn tất thu nhỏ cho quán cà phê hư cấu ở Chương 1. Bối cảnh: chiều ngày thường vắng; một đối thủ chuỗi ở đối diện. Đối tượng: sinh viên có tiết trống, trọng chỗ ngồi yên tĩnh. Mục tiêu: 300 lượt dùng voucher trong sáu tuần từ sinh viên mới đến quán (mức nền: khoảng 40 khách mới mỗi tháng, cần xác nhận). Thông điệp: "góc yên tĩnh giữa hai tiết học", lý do tin: ảnh phòng, sạc miễn phí và mức ồn trung bình đo bằng ứng dụng miễn phí. Công cụ: áp phích ở khoa và hai bạn sinh viên làm nội dung (nhận biết), voucher qua nhóm chat (hành động), bàn phát thử nhỏ giờ trưa (dùng thử), nhân viên được brief quy tắc ưu đãi. Phương tiện: không phủ trả tiền ngoài một khoản đẩy nhỏ. Ngân sách: mục tiêu và nhiệm vụ, 10% cho thử nghiệm giữa chiến dịch hai cách ghi voucher. Đo lường: mã voucher theo kênh, số khách mới, khảo sát ba câu tại quầy.</p>
<p>Rủi ro: voucher không cộng gộp với ưu đãi khác; nhà sáng tạo phải công khai quan hệ; không thu dữ liệu cá nhân khi chưa có đồng ý. Đây là kế hoạch bạn có thể bảo vệ từng dòng.</p>`];
// ===== Chương 1 =====
secs.push(SEC('Chapter 1 — The IMC concept and planning process', 'Chương 1 — Khái niệm IMC và quy trình lập kế hoạch',
  'IMC là gì, vì sao tích hợp, và quy trình lập kế hoạch từ kế hoạch marketing đến đánh giá.', [
  D(P + '1-1', '1.1 What is IMC?', '1.1 IMC là gì?', 'Định nghĩa IMC, khác biệt giữa truyền thông rời rạ và tích hợp, bốn mức tích hợp.', {
    n: '1.1',
    g: [['Define integrated marketing communication and the promotional mix', 'Định nghĩa truyền thông marketing tích hợp và promotional mix'], ['Contrast "silo" communication with integrated communication', 'Đối chiếu truyền thông "ống khói" với truyền thông tích hợp'], ['Name what is, and is not, integrated in a real campaign', 'Chỉ ra điều gì đã và chưa được tích hợp trong một chiến dịch thật']],
    b: [`<p><strong>Marketing communication</strong> is every planned message and contact through which an organisation informs, persuades and reminds its audiences about its products and brand. <strong>Integrated marketing communication (IMC)</strong> is the strategic practice of planning, coordinating and evaluating all these contacts so that they send one consistent message and work as a system. Belch &amp; Belch describe it as a shift from thinking about separate tools (an "ad campaign", a "PR push") to managing the <em>total set of brand contacts</em> a customer has.</p>
<h4>Silo versus integrated</h4>
<p>In a silo setup the advertising team, the PR team, the social team and the sales team each have their own budget, agency and goals. The result is familiar: the TV ad promises "free delivery", the website says "from 500,000 VND", the shop assistant knows nothing about either. Each piece may be good; together they confuse. In an integrated setup there is one communication objective, one core idea, and each tool is given a clear job.</p>
<h4>The promotional mix</h4>
<p>The tools IMC coordinates are called the <strong>promotional mix</strong>: advertising, public relations and publicity, sales promotion, direct and digital marketing, personal selling, plus events and sponsorship. Part 2 of this course takes each in turn (Chapters 5 to 7).</p>
<h4>Levels of integration</h4>
<ul><li><strong>Visual and verbal consistency</strong>: same look, tone and tagline everywhere.</li>
<li><strong>Message coordination</strong>: tools carry the same core idea but add different proof.</li>
<li><strong>Timing and channel sequence</strong>: teaser, launch, reminder are planned as a flow.</li>
<li><strong>Data and customer view</strong>: teams share audience data so the customer is treated as one person, not five records.</li></ul>
<h4>A real example: Dumb Ways to Die</h4>
<p>Metro Trains in Melbourne launched <em>Dumb Ways to Die</em> in 2012 to cut risky behaviour near trains. The idea was a catchy song and animated film about silly ways to die, ending on train safety. The song and film were the core; social sharing, press coverage and later games and station presence extended it. It is often used to show a single idea that travels across tools. Whether behaviour changed measurably is a separate question that we return to in Chapter 9.</p>`,
       `<p><strong>Truyền thông marketing</strong> là mọi thông điệp và tiếp xúc có kế hoạch mà tổ chức dùng để thông tin, thuyết phục và nhắc nhớ khán giả về sản phẩm và thương hiệu. <strong>Truyền thông marketing tích hợp (IMC)</strong> là việc lập kế hoạch, phối hợp và đánh giá mọi tiếp xúc đó sao cho chúng gửi một thông điệp nhất quán và vận hành như một hệ thống. Belch &amp; Belch mô tả đó là bước chuyển từ nghĩ về các công cụ rời rạ (một "chiến dịch quảng cáo", một "đợt PR") sang quản lý <em>toàn bộ điểm tiếp xúc thương hiệu</em> của khách hàng.</p>
<h4>Ống khói và tích hợp</h4>
<p>Theo kiểu "ống khói", đội quảng cáo, PR, mạng xã hội và bán hàng mỗi bên một ngân sách, agency và mục tiêu. Kết quả quen thuộc: quảng cáo TV hứa "giao hàng miễn phí", website ghi "từ 500.000 đồng", nhân viên cửa hàng không biết gì cả hai. Từng mảnh có thể tốt; ghép lại gây rối. Theo kiểu tích hợp, có một mục tiêu truyền thông, một ý tưởng cốt lõi, và mỗi công cụ được giao một việc rõ ràng.</p>
<h4>Promotional mix</h4>
<p>Các công cụ mà IMC phối hợp gọi là <strong>promotional mix</strong>: quảng cáo, quan hệ công chúng và publicity, khuyến mãi, marketing trực tiếp và số, bán hàng trực tiếp, cùng sự kiện và tài trợ. Phần 2 của khoá lần lượt đi qua từng công cụ (Chương 5 đến 7).</p>
<h4>Các mức tích hợp</h4>
<ul><li><strong>Nhất quán hình ảnh và lời nói</strong>: cùng diện mạo, giọng điệu, khẩu hiệu ở mọi nơi.</li>
<li><strong>Phối hợp thông điệp</strong>: các công cụ mang cùng ý tưởng cốt lõi nhưng thêm bằng chứng khác nhau.</li>
<li><strong>Thời điểm và trình tự kênh</strong>: teaser, ra mắt, nhắc lại được lên kế hoạch như một dòng chảy.</li>
<li><strong>Dữ liệu và cái nhìn về khách hàng</strong>: các đội chia sẻ dữ liệu để khách hàng là một người, không phải năm bản ghi.</li></ul>
<h4>Ví dụ thật: Dumb Ways to Die</h4>
<p>Metro Trains ở Melbourne tung <em>Dumb Ways to Die</em> năm 2012 để giảm hành vi nguy hiểm gần đường ray. Ý tưởng là một bài hát bắt tai và phim hoạt hình về những cách chết ngớ ngẩn, kết ở an toàn đường sắt. Bài hát và phim là lõi; chia sẻ trên mạng, báo chí, sau đó là trò chơi và hiện diện tại ga mở rộng nó. Chiến dịch hay được dùng để minh hoạ một ý tưởng đi xuyên nhiều công cụ. Hành vi có thay đổi đo được hay không là câu hỏi khác, ta quay lại ở Chương 9.</p>`],
    pit: ['Calling a campaign "integrated" because it uses many channels. Many channels with different messages is the opposite of integration.', 'Gọi chiến dịch là "tích hợp" chỉ vì dùng nhiều kênh. Nhiều kênh với thông điệp khác nhau là điều ngược lại của tích hợp.'],
    s: [['IMC = planning and coordinating all brand contacts into one consistent system.', 'IMC = lập kế hoạch và phối hợp mọi điểm tiếp xúc thương hiệu thành một hệ thống nhất quán.'], ['Promotional mix: advertising, PR, sales promotion, direct and digital, personal selling, events and sponsorship.', 'Promotional mix: quảng cáo, PR, khuyến mãi, trực tiếp và số, bán hàng trực tiếp, sự kiện và tài trợ.'], ['Integration has levels: look and tone, message, timing, data.', 'Tích hợp có các mức: diện mạo và giọng điệu, thông điệp, thời điểm, dữ liệu.']],
    l: ['imc', 'pmix', 'dumb', 'ana'],
    p: [['A TV ad says "free delivery", the website says delivery costs extra. Which IMC failure is this?', 'Quảng cáo TV nói "giao hàng miễn phí", website ghi phí giao hàng riêng. Đây là lỗi IMC nào?', 'Message inconsistency across tools (a silo problem): no shared core message or checking step.', 'Thiếu nhất quán thông điệp giữa các công cụ (lỗi ống khói): không có thông điệp cốt lõi chung hay bước kiểm tra.'],
        ['List the six elements of the promotional mix from memory.', 'Kể lại sáu thành phần của promotional mix.', 'Advertising; PR and publicity; sales promotion; direct and digital marketing; personal selling; events and sponsorship.', 'Quảng cáo; PR và publicity; khuyến mãi; marketing trực tiếp và số; bán hàng trực tiếp; sự kiện và tài trợ.']] }),

  D(P + '1-2', '1.2 Why integrate? Forces and barriers', '1.2 Vì sao tích hợp? Động lực và rào cản', 'Lý do doanh nghiệp tích hợp truyền thông, lợi ích và rào cản trong tổ chức.', {
    n: '1.2',
    g: [['Explain the forces that pushed organisations toward IMC', 'Giải thích các lực đẩy doanh nghiệp tới IMC'], ['List benefits of integration', 'Kể các lợi ích của tích hợp'], ['Identify organisational barriers and one fix for each', 'Nhận ra rào cản trong tổ chức và một cách gỡ cho mỗi rào cản']],
    b: [`<h4>Forces behind IMC</h4>
<p>Textbooks usually describe the same shifts. <strong>Media fragmentation</strong>: audiences spread across many channels, so no single medium reaches everyone. <strong>Consumer control</strong>: people skip ads, search, compare and talk back on social media. <strong>Data availability</strong>: digital tracking lets firms see behaviour across channels. <strong>Cost pressure</strong>: managers want proof that each dong works, and duplicated work wastes money. <strong>Agency change</strong>: clients ask one partner or a coordinated group to cover several tools.</p>
<h4>Benefits</h4>
<ul><li>A clearer, stronger brand message because it is repeated consistently, so each exposure builds on the last.</li>
<li>Less waste: shared research, shared creative assets, no duplicate production.</li>
<li>Better use of strengths: advertising builds reach, PR builds credibility, promotion triggers action, sales closes.</li>
<li>Easier measurement, because one objective guides every tool.</li></ul>
<h4>Barriers inside the organisation</h4>
<table><thead><tr><th>Barrier</th><th>What it looks like</th><th>Typical fix</th></tr></thead><tbody>
<tr><td>Departmental silos</td><td>Separate budgets, each team protects its own</td><td>One communication plan owner; shared objectives</td></tr>
<tr><td>Agency turf</td><td>Agencies compete for budget, share nothing</td><td>Joint briefings; one brief for all</td></tr>
<tr><td>Short-term targets</td><td>Sales promos used to hit the month, damaging the message</td><td>Scorecards with both short and long-term goals</td></tr>
<tr><td>Data in separate tools</td><td>Social, CRM and sales data never meet</td><td>Common IDs and a simple shared report</td></tr></tbody></table>
<p>Integration is partly a people problem. A beautiful plan fails if the sales team learns about the campaign from the TV.</p>`,
       `<h4>Các lực dẫn tới IMC</h4>
<p>Giáo trình thường nêu cùng những chuyển dịch. <strong>Phân mảnh phương tiện</strong>: khán giả rải ra nhiều kênh, không phương tiện nào phủ hết. <strong>Người tiêu dùng nắm quyền</strong>: họ bỏ qua quảng cáo, tìm kiếm, so sánh và phản hồi trên mạng xã hội. <strong>Dữ liệu sẵn có</strong>: theo dõi số giúp thấy hành vi xuyên kênh. <strong>Áp lực chi phí</strong>: nhà quản lý muốn chứng minh từng đồng có tác dụng, việc trùng lặp gây lãng phí. <strong>Agency thay đổi</strong>: khách hàng nhờ một đối tác hoặc nhóm phối hợp phụ trách nhiều công cụ.</p>
<h4>Lợi ích</h4>
<ul><li>Thông điệp rõ và mạnh hơn vì lặp lại nhất quán, mỗi lần tiếp xúc cộng dồn lên lần trước.</li>
<li>Ít lãng phí: dùng chung nghiên cứu, chung tài sản sáng tạo, không sản xuất trùng.</li>
<li>Phát huy thế mạnh: quảng cáo tạo độ phủ, PR tạo uy tín, khuyến mãi kích hành động, bán hàng chốt đơn.</li>
<li>Đo lường dễ hơn vì một mục tiêu dẫn dắt mọi công cụ.</li></ul>
<h4>Rào cản trong tổ chức</h4>
<table><thead><tr><th>Rào cản</th><th>Biểu hiện</th><th>Cách gỡ thường gặp</th></tr></thead><tbody>
<tr><td>Ống khói phòng ban</td><td>Ngân sách riêng, mỗi đội bảo vệ phần mình</td><td>Một chủ kế hoạch truyền thông; mục tiêu chung</td></tr>
<tr><td>Giành địa phận giữa agency</td><td>Agency tranh ngân sách, không chia sẻ</td><td>Họp brief chung; một brief cho tất cả</td></tr>
<tr><td>Chỉ tiêu ngắn hạn</td><td>Khuyến mãi dồn cho đủ tháng, làm hỏng thông điệp</td><td>Bảng điểm có cả mục tiêu ngắn và dài hạn</td></tr>
<tr><td>Dữ liệu ở công cụ riêng</td><td>Dữ liệu mạng xã hội, CRM, bán hàng không gặp nhau</td><td>Mã định danh chung và báo cáo chung đơn giản</td></tr></tbody></table>
<p>Tích hợp một phần là vấn đề con người. Kế hoạch đẹp cũng thất bại nếu đội bán hàng biết chiến dịch qua màn hình TV.</p>`],
    pit: ['Believing integration needs a single giant agency. It needs one brief, shared goals and regular checking, whoever executes.', 'Tin rằng tích hợp cần một agency khổng lồ. Nó cần một brief, mục tiêu chung và kiểm tra đều đặn, bất kể ai thực hiện.'],
    s: [['Fragmentation, consumer control, data, cost and agency change drive IMC.', 'Phân mảnh, người tiêu dùng nắm quyền, dữ liệu, chi phí và agency thay đổi thúc đẩy IMC.'], ['Benefits: stronger message, less waste, better use of each tool, easier measurement.', 'Lợi ích: thông điệp mạnh hơn, ít lãng phí, dùng tốt từng công cụ, đo dễ hơn.'], ['Barriers are mostly organisational: silos, turf, short-termism, data.', 'Rào cản chủ yếu ở tổ chức: ống khói, địa phận, ngắn hạn, dữ liệu.']],
    l: ['imc', 'corp', 'tgoogle'],
    p: [['Give two reasons why media fragmentation makes integration more important.', 'Nêu hai lý do phân mảnh phương tiện khiến tích hợp quan trọng hơn.', 'No single medium reaches everyone, so several must be combined; and the same message must stay consistent across them.', 'Không phương tiện nào phủ hết nên phải kết hợp nhiều kênh; và thông điệp phải nhất quán xuyên các kênh đó.'],
        ['The sales team runs month-end discounts that contradict a premium brand message. Which barrier?', 'Đội bán hàng chạy giảm giá cuối tháng mâu thuẫn thông điệp cao cấp. Rào cản nào?', 'Short-term targets (and silos). Fix: shared scorecard with long-term brand goals.', 'Chỉ tiêu ngắn hạn (và ống khói). Cách gỡ: bảng điểm chung có mục tiêu thương hiệu dài hạn.']] }),

  D(P + '1-3', '1.3 The IMC planning process', '1.3 Quy trình lập kế hoạch IMC', 'Các bước từ kế hoạch marketing tới đánh giá, và bản đồ các chương của khoá.', {
    n: '1.3',
    g: [['List the steps of an IMC plan in order', 'Kể các bước của kế hoạch IMC theo thứ tự'], ['Link each step to a chapter of this course', 'Gắn mỗi bước với một chương của khoá'], ['Write a one-page plan skeleton', 'Viết khung kế hoạch một trang']],
    b: [`<p>Textbooks present the planning process slightly differently, but all follow the same logic: start from the business problem, end with measurement, and feed what you learn back into the next plan. The sequence below is a simplified version of the process in Belch &amp; Belch.</p>
<ol><li><strong>Review the marketing plan and brand situation</strong>: what are the business goals, the product, the competitors, the brand's position? (Chapter 3; positioning comes from BRA201.)</li>
<li><strong>Analyse the communication situation</strong>: who is the audience, what do they know and feel, which channels do they use, what do rivals say? (Chapters 2 and 3.)</li>
<li><strong>Set communication objectives</strong>: what should the audience know, feel or do, by when? (Chapter 3.)</li>
<li><strong>Develop message and creative strategy</strong>: the core idea, appeal and tone. (Chapter 4.)</li>
<li><strong>Choose the promotional mix</strong>: which tools do which job. (Chapters 5 to 7.)</li>
<li><strong>Plan media and set the budget</strong>: where, how often, at what cost. (Chapter 8.)</li>
<li><strong>Implement and integrate</strong>: schedule, approvals, briefing all agencies and the sales team.</li>
<li><strong>Monitor, evaluate and adjust</strong>: compare results to objectives. (Chapter 9.)</li></ol>
<div class="meo"><strong>Tip.</strong> The plan is a loop, not a line. Results in step 8 change the objectives and budget in the next cycle. Many students stop at step 5 and forget that the plan needs numbers.</div>
<h4>One-page skeleton</h4>
<p>Business goal · Audience (one sentence) · Communication objective (with number and date) · Core message · Tool roles (a short table) · Media and budget · Metrics and decision rule ("if X then we change Y"). Chapter 9 gives a filled-in template. Use it for one small Vietnamese business you know, for example a local coffee shop or a student club event.</p>`,
       `<p>Các giáo trình trình bày quy trình hơi khác nhau, nhưng đều cùng logic: bắt đầu từ vấn đề kinh doanh, kết thúc bằng đo lường, rồi đưa điều học được vào kế hoạch sau. Trình tự dưới đây là bản giản lược của quy trình trong Belch &amp; Belch.</p>
<ol><li><strong>Rà kế hoạch marketing và bối cảnh thương hiệu</strong>: mục tiêu kinh doanh, sản phẩm, đối thủ, vị thế thương hiệu? (Chương 3; định vị lấy từ BRA201.)</li>
<li><strong>Phân tích tình huống truyền thông</strong>: đối tượng là ai, họ biết và cảm nhận gì, dùng kênh nào, đối thủ nói gì? (Chương 2 và 3.)</li>
<li><strong>Đặt mục tiêu truyền thông</strong>: khán giả cần biết, cảm nhận hoặc làm gì, trước khi nào? (Chương 3.)</li>
<li><strong>Xây dựng thông điệp và chiến lược sáng tạo</strong>: ý tưởng cốt lõi, kiểu thu hút, giọng điệu. (Chương 4.)</li>
<li><strong>Chọn promotional mix</strong>: công cụ nào làm việc gì. (Chương 5 đến 7.)</li>
<li><strong>Hoạch định phương tiện và đặt ngân sách</strong>: ở đâu, bao nhiêu lần, chi phí bao nhiêu. (Chương 8.)</li>
<li><strong>Triển khai và tích hợp</strong>: lịch, duyệt, brief mọi agency và đội bán hàng.</li>
<li><strong>Theo dõi, đánh giá và điều chỉnh</strong>: so kết quả với mục tiêu. (Chương 9.)</li></ol>
<div class="meo"><strong>Mẹo.</strong> Kế hoạch là một vòng lặp, không phải đường thẳng. Kết quả ở bước 8 làm thay đổi mục tiêu và ngân sách chu kỳ sau. Nhiều sinh viên dừng ở bước 5 và quên rằng kế hoạch cần con số.</div>
<h4>Khung một trang</h4>
<p>Mục tiêu kinh doanh · Đối tượng (một câu) · Mục tiêu truyền thông (có số và ngày) · Thông điệp cốt lõi · Vai trò công cụ (bảng ngắn) · Phương tiện và ngân sách · Chỉ số và quy tắc quyết định ("nếu X thì đổi Y"). Chương 9 có mẫu điền sẵn. Hãy dùng cho một doanh nghiệp nhỏ ở Việt Nam mà bạn biết, ví dụ quán cà phê địa phương hoặc sự kiện của câu lạc bộ sinh viên.</p>`],
    pit: ['Starting with "let\'s make a TikTok" before the objective and audience are written. Tool-first planning produces activity, not results.', 'Bắt đầu bằng "làm TikTok đi" khi chưa viết mục tiêu và đối tượng. Lập kế hoạch theo công cụ cho ra hoạt động, không phải kết quả.'],
    s: [['Plan flow: situation → objectives → message → mix → media and budget → implement → evaluate.', 'Dòng kế hoạch: bối cảnh → mục tiêu → thông điệp → mix → phương tiện và ngân sách → triển khai → đánh giá.'], ['It is a loop: results feed the next plan.', 'Đó là vòng lặp: kết quả nuôi kế hoạch sau.'], ['Always end with metrics and a decision rule.', 'Luôn kết thúc bằng chỉ số và quy tắc quyết định.']],
    l: ['imc', 'mplan2', 'mstrat', 'swot'],
    p: [['Which step comes before choosing the promotional mix and which after?', 'Bước nào đứng trước và bước nào sau khi chọn promotional mix?', 'Before: message and creative strategy (and objectives). After: media planning and budget.', 'Trước: thông điệp và chiến lược sáng tạo (và mục tiêu). Sau: hoạch định phương tiện và ngân sách.'],
        ['Why is the plan a loop?', 'Vì sao kế hoạch là một vòng lặp?', 'Evaluation results change objectives, message and budget of the next cycle.', 'Kết quả đánh giá làm thay đổi mục tiêu, thông điệp và ngân sách của chu kỳ sau.']] }),

  Q(P + 'quiz-1', 'Chapter 1 quiz — IMC concept and process', 'Quiz Chương 1 — Khái niệm và quy trình IMC', [
    qq('IMC primarily aims to…', 'IMC chủ yếu nhằm…', ['Use as many channels as possible|Dùng càng nhiều kênh càng tốt', 'Coordinate all brand contacts into one consistent message|Phối hợp mọi điểm tiếp xúc thương hiệu thành một thông điệp nhất quán', 'Replace advertising with PR|Thay quảng cáo bằng PR', 'Cut every communication budget|Cắt mọi ngân sách truyền thông'], 1, 'Integration is about coherence, not volume.', 'Tích hợp là sự nhất quán, không phải số lượng.'),
    qq('Which is NOT part of the promotional mix?', 'Đâu KHÔNG thuộc promotional mix?', ['Sales promotion|Khuyến mãi', 'Personal selling|Bán hàng trực tiếp', 'Factory production schedule|Lịch sản xuất ở nhà máy', 'Public relations|Quan hệ công chúng'], 2, 'Production scheduling is operations, not communication.', 'Lịch sản xuất là vận hành, không phải truyền thông.'),
    qq('A "silo" problem means…', 'Vấn đề "ống khói" nghĩa là…', ['Teams work separately with different messages|Các đội làm riêng với thông điệp khác nhau', 'The ad is too long|Quảng cáo quá dài', 'Too few customers|Quá ít khách hàng', 'A loyal audience|Khán giả trung thành'], 0, 'Silos cause inconsistent messages and duplicated work.', 'Ống khói gây thông điệp thiếu nhất quán và việc trùng lặp.'),
    qq('Which force pushed firms towards IMC?', 'Lực nào đẩy doanh nghiệp tới IMC?', ['Media fragmentation|Phân mảnh phương tiện', 'Fewer channels|Ít kênh hơn', 'Less data|Ít dữ liệu hơn', 'Passive audiences only|Chỉ có khán giả thụ động'], 0, 'Audiences spread across many channels, so tools must be coordinated.', 'Khán giả rải ra nhiều kênh nên các công cụ phải phối hợp.'),
    qq('Dumb Ways to Die is often cited as…', 'Dumb Ways to Die thường được nhắc như…', ['A single idea carried across song, film, social and press|Một ý tưởng duy nhất đi qua bài hát, phim, mạng xã hội và báo chí', 'A price promotion|Một đợt khuyến mãi giá', 'A personal-selling script|Một kịch bản bán hàng trực tiếp', 'A trade show|Một hội chợ thương mại'], 0, 'It is a classic example of one core idea across tools.', 'Đây là ví dụ kinh điển về một ý tưởng cốt lõi xuyên nhiều công cụ.'),
    qq('The IMC planning process ends with…', 'Quy trình lập kế hoạch IMC kết thúc bằng…', ['Printing the plan|In kế hoạch', 'Monitoring and evaluating against objectives|Theo dõi và đánh giá theo mục tiêu', 'Hiring an agency|Thuê agency', 'Choosing a logo|Chọn logo'], 1, 'Evaluation closes the loop and feeds the next plan.', 'Đánh giá khép vòng và nuôi kế hoạch sau.'),
    qq('Where do positioning and brand equity belong in this course?', 'Định vị và giá trị thương hiệu thuộc vị trí nào trong khoá này?', ['Re-taught in depth in Chapter 4|Dạy lại sâu ở Chương 4', 'Inputs from BRA201|Đầu vào lấy từ BRA201', 'Ignored|Bỏ qua', 'Replaced by SWOT|Thay bằng SWOT'], 1, 'IMC201 uses them as inputs and does not repeat them.', 'IMC201 dùng chúng làm đầu vào và không lặp lại.'),
    qq('A realistic fix for departmental silos is…', 'Cách gỡ thực tế cho ống khói phòng ban là…', ['One plan owner and shared objectives|Một chủ kế hoạch và mục tiêu chung', 'Separate budgets for each team|Ngân sách riêng cho mỗi đội', 'No reporting|Không báo cáo', 'Using only one tool|Chỉ dùng một công cụ'], 0, 'Shared ownership and goals align the tools.', 'Chủ sở hữu và mục tiêu chung giúp các công cụ cùng hướng.'),
  ]),
]));
// ===== Chương 2 =====
secs.push(SEC('Chapter 2 — Communication models', 'Chương 2 — Các mô hình truyền thông',
  'Mô hình nguồn–người nhận, AIDA, hierarchy of effects, mức độ quan tâm, truyền thông hai bước và hành trình khách hàng.', [
  D(P + '2-1', '2.1 The basic communication model', '2.1 Mô hình truyền thông cơ bản', 'Nguồn, mã hoá, kênh, giải mã, người nhận, nhiễu, phản hồi; vì sao thông điệp bị hiểu sai.', {
    n: '2.1',
    g: [['Name the elements of the source–receiver model', 'Gọi tên các thành phần của mô hình nguồn – người nhận'], ['Identify noise in a real message', 'Nhận ra nhiễu trong một thông điệp thật'], ['Explain the role of the field of experience', 'Giải thích vai trò của trường kinh nghiệm chung']],
    b: [`<p>Most marketing textbooks start from the transmission model of Shannon and Weaver, adapted for marketing by Wilbur Schramm and others. It is simple, but it explains many failures.</p>
<ul><li><strong>Source</strong>: the sender (the brand or a spokesperson).</li>
<li><strong>Encoding</strong>: turning the idea into words, images, music.</li>
<li><strong>Message and channel</strong>: what is said and the medium that carries it (a TV spot, a Facebook post, a sales call).</li>
<li><strong>Decoding</strong>: the receiver interprets the message.</li>
<li><strong>Receiver</strong>: the target audience member.</li>
<li><strong>Noise</strong>: anything that distorts the message: clutter of other ads, a poor translation, a distracted viewer, a slang word with a different meaning for another age group.</li>
<li><strong>Feedback</strong>: the receiver's response, which lets the sender adjust. Digital media make feedback fast: comments, shares, clicks.</li></ul>
<h4>Field of experience</h4>
<p>Communication works best where the sender's and receiver's experiences overlap. A fashion brand targeting Gen Z can use a meme format they know; the same meme sent to their parents may be noise. Research of the audience (Chapter 3) is the way to find the overlap.</p>
<h4>Worked example</h4>
<p>A bank posts "Open a CASA account today, zero fee". The target, first-year students, may not know the abbreviation CASA (current account savings account). The idea is encoded in jargon, so decoding fails: the problem is not the channel but the encoding. Rewrite: "A free account for your student allowance. Open it on your phone in 5 minutes." Check that the 5 minutes claim is true before publishing.</p>
<h4>Limits of the model</h4>
<p>The model suggests a one-way flow. Today audiences also create and reshape messages; the next lessons add models that show how people respond and how messages spread.</p>`,
       `<p>Hầu hết giáo trình marketing xuất phát từ mô hình truyền tải của Shannon và Weaver, được Wilbur Schramm và những người khác điều chỉnh cho marketing. Mô hình đơn giản nhưng giải thích được nhiều thất bại.</p>
<ul><li><strong>Nguồn</strong>: người gửi (thương hiệu hoặc người phát ngôn).</li>
<li><strong>Mã hoá</strong>: biến ý tưởng thành lời, hình, nhạc.</li>
<li><strong>Thông điệp và kênh</strong>: điều được nói và phương tiện mang nó (spot TV, bài Facebook, cuộc gọi bán hàng).</li>
<li><strong>Giải mã</strong>: người nhận diễn giải thông điệp.</li>
<li><strong>Người nhận</strong>: thành viên của đối tượng mục tiêu.</li>
<li><strong>Nhiễu</strong>: mọi thứ làm méo thông điệp: quảng cáo khác tràn ngập, bản dịch kém, người xem mất tập trung, một từ lóng mang nghĩa khác với nhóm tuổi khác.</li>
<li><strong>Phản hồi</strong>: phản ứng của người nhận, giúp người gửi điều chỉnh. Truyền thông số cho phản hồi nhanh: bình luận, chia sẻ, nhấp.</li></ul>
<h4>Trường kinh nghiệm chung</h4>
<p>Truyền thông hiệu quả nhất ở nơi kinh nghiệm của người gửi và người nhận giao nhau. Thương hiệu thời trang nhắm Gen Z có thể dùng định dạng meme họ quen; cùng meme gửi cho cha mẹ họ có thể là nhiễu. Nghiên cứu đối tượng (Chương 3) là cách tìm vùng giao nhau.</p>
<h4>Ví dụ có lời giải</h4>
<p>Một ngân hàng đăng "Mở tài khoản CASA hôm nay, miễn phí". Đối tượng là sinh viên năm nhất, có thể không biết từ viết tắt CASA (tài khoản thanh toán kiêm tiết kiệm). Ý tưởng được mã hoá bằng thuật ngữ nên giải mã thất bại: vấn đề không nằm ở kênh mà ở mã hoá. Viết lại: "Một tài khoản miễn phí cho tiền sinh hoạt của bạn. Mở trên điện thoại trong 5 phút." Hãy kiểm tra "5 phút" có đúng không trước khi đăng.</p>
<h4>Giới hạn của mô hình</h4>
<p>Mô hình gợi ý dòng một chiều. Ngày nay khán giả cũng tạo và định hình lại thông điệp; các bài sau thêm mô hình cho thấy con người phản ứng và thông điệp lan toả thế nào.</p>`],
    pit: ['Blaming the channel when the message was encoded in language the audience does not share.', 'Đổ lỗi cho kênh trong khi thông điệp được mã hoá bằng ngôn ngữ đối tượng không chia sẻ.'],
    s: [['Source → encoding → message/channel → decoding → receiver, with noise and feedback.', 'Nguồn → mã hoá → thông điệp/kênh → giải mã → người nhận, kèm nhiễu và phản hồi.'], ['Overlap of experience makes decoding accurate.', 'Vùng kinh nghiệm giao nhau giúp giải mã chính xác.'], ['Digital media make feedback faster, but the model still starts from the audience.', 'Truyền thông số cho phản hồi nhanh hơn, nhưng mô hình vẫn bắt đầu từ khán giả.']],
    l: ['shannon', 'research', 'tgoogle'],
    p: [['Name two sources of noise for a bus-stop poster.', 'Kể hai nguồn nhiễu cho áp phích ở trạm xe buýt.', 'Other posters, passing traffic, small text, rain, people in a hurry.', 'Áp phích khác, xe cộ, chữ nhỏ, mưa, người vội.'],
        ['Rewrite "Leverage our omnichannel loyalty ecosystem" for teenagers.', 'Viết lại "Tận dụng hệ sinh thái khách hàng thân thiết đa kênh" cho học sinh.', 'For example: "Collect points on every purchase, in store or online, and swap them for rewards."', 'Ví dụ: "Tích điểm mỗi lần mua, ở cửa hàng hay online, rồi đổi quà."']] }),

  D(P + '2-2', '2.2 Response hierarchies: AIDA and hierarchy of effects', '2.2 Thang phản ứng: AIDA và hierarchy of effects', 'AIDA, Lavidge–Steiner, DAGMAR; dùng thang phản ứng để chọn công cụ và chỉ số.', {
    n: '2.2',
    g: [['Describe AIDA and the hierarchy of effects', 'Mô tả AIDA và hierarchy of effects'], ['Match each stage with tools and metrics', 'Ghép mỗi giai đoạn với công cụ và chỉ số'], ['See the limits of linear models', 'Thấy giới hạn của các mô hình tuyến tính']],
    b: [`<p>Response models describe the stages a consumer passes through before acting. They are useful as a checklist: at which stage is my audience stuck?</p>
<h4>AIDA</h4>
<p><strong>Attention → Interest → Desire → Action.</strong> The model has roots in early twentieth-century sales literature and is still used in ad briefs and landing pages.</p>
<h4>Hierarchy of effects (Lavidge and Steiner, 1961)</h4>
<p>It splits the path into three groups: <em>cognitive</em> (awareness, knowledge), <em>affective</em> (liking, preference, conviction) and <em>behavioural</em> (purchase). Russell Colley's <strong>DAGMAR</strong> framework (1961) uses a similar ladder, awareness → comprehension → conviction → action, to set measurable communication goals.</p>
<table><thead><tr><th>Stage</th><th>Typical job</th><th>Tools</th><th>Example metric</th></tr></thead><tbody>
<tr><td>Awareness</td><td>Be noticed</td><td>TV, OOH, video ads, PR</td><td>Aided awareness, reach</td></tr>
<tr><td>Knowledge / interest</td><td>Explain why it matters</td><td>Content, demos, PR features</td><td>Video completion, time on page</td></tr>
<tr><td>Liking / preference</td><td>Build a reason to choose us</td><td>Creative, events, influencers</td><td>Preference in survey</td></tr>
<tr><td>Conviction / action</td><td>Trigger the purchase</td><td>Promotions, sales, search ads</td><td>Conversion rate, sales</td></tr></tbody></table>
<h4>Limits</h4>
<p>People do not always move in order. An impulse buy can happen before real liking; a purchase can create the attitude afterwards. The ladders are best used to <em>plan objectives</em>, not to claim that every customer climbs every step. The next lesson shows how involvement changes the order.</p>`,
       `<p>Mô hình phản ứng mô tả các giai đoạn người tiêu dùng đi qua trước khi hành động. Chúng hữu ích như danh sách kiểm tra: khán giả của tôi đang kẹt ở giai đoạn nào?</p>
<h4>AIDA</h4>
<p><strong>Attention → Interest → Desire → Action</strong> (Chú ý → Quan tâm → Mong muốn → Hành động). Mô hình có gốc từ tài liệu bán hàng đầu thế kỷ hai mươi và vẫn được dùng trong brief quảng cáo và trang đích.</p>
<h4>Hierarchy of effects (Lavidge và Steiner, 1961)</h4>
<p>Nó chia con đường thành ba nhóm: <em>nhận thức</em> (biết đến, hiểu biết), <em>cảm xúc</em> (thích, ưa chuộng, tin chắc) và <em>hành vi</em> (mua). Khung <strong>DAGMAR</strong> của Russell Colley (1961) dùng thang tương tự, nhận biết → hiểu → tin → hành động, để đặt mục tiêu truyền thông đo được.</p>
<table><thead><tr><th>Giai đoạn</th><th>Việc điển hình</th><th>Công cụ</th><th>Chỉ số ví dụ</th></tr></thead><tbody>
<tr><td>Nhận biết</td><td>Được chú ý</td><td>TV, OOH, quảng cáo video, PR</td><td>Nhận biết có gợi ý, reach</td></tr>
<tr><td>Hiểu biết / quan tâm</td><td>Giải thích vì sao quan trọng</td><td>Nội dung, demo, bài PR chuyên sâu</td><td>Tỷ lệ xem hết video, thời gian trên trang</td></tr>
<tr><td>Thích / ưa chuộng</td><td>Tạo lý do chọn ta</td><td>Sáng tạo, sự kiện, influencer</td><td>Mức ưa chuộng trong khảo sát</td></tr>
<tr><td>Tin chắc / hành động</td><td>Kích hoạt mua</td><td>Khuyến mãi, bán hàng, quảng cáo tìm kiếm</td><td>Tỷ lệ chuyển đổi, doanh số</td></tr></tbody></table>
<h4>Giới hạn</h4>
<p>Con người không phải lúc nào cũng đi theo thứ tự. Mua bốc đồng có thể xảy ra trước khi thích thật sự; việc mua có thể tạo ra thái độ sau đó. Các thang này tốt nhất để <em>lập mục tiêu</em>, không phải để khẳng định mọi khách hàng leo hết mọi bậc. Bài sau cho thấy mức độ quan tâm làm thay đổi thứ tự thế nào.</p>`],
    pit: ['Using conversion rate as the only metric for a campaign whose job is awareness. The metric must match the stage.', 'Dùng tỷ lệ chuyển đổi làm chỉ số duy nhất cho chiến dịch có nhiệm vụ nhận biết. Chỉ số phải khớp giai đoạn.'],
    s: [['AIDA: attention, interest, desire, action.', 'AIDA: chú ý, quan tâm, mong muốn, hành động.'], ['Hierarchy of effects and DAGMAR: cognitive → affective → behavioural, with measurable goals.', 'Hierarchy of effects và DAGMAR: nhận thức → cảm xúc → hành vi, có mục tiêu đo được.'], ['Use the ladder to plan objectives and metrics, not as a law of behaviour.', 'Dùng thang để lập mục tiêu và chỉ số, không như quy luật hành vi.']],
    l: ['aida', 'dagmar', 'funnel'],
    p: [['A new energy drink is unknown in the market. Which stage first and which metric?', 'Một thức uống năng lượng mới chưa ai biết. Giai đoạn nào trước, chỉ số nào?', 'Awareness; aided and unaided awareness plus reach.', 'Nhận biết; mức nhận biết có và không gợi ý cùng reach.'],
        ['Why can a linear ladder mislead?', 'Vì sao thang tuyến tính có thể gây hiểu lầm?', 'People skip or reorder stages (impulse purchase, attitude formed after use).', 'Con người bỏ qua hoặc đảo thứ tự (mua bốc đồng, thái độ hình thành sau khi dùng).']] }),

  D(P + '2-3', '2.3 Involvement and processing: ELM and the FCB idea', '2.3 Mức độ quan tâm và xử lý thông tin: ELM và ý tưởng FCB', 'Quan tâm cao/thấp, đường trung tâm và đường ngoại vi, chọn kiểu thông điệp theo mức độ quan tâm.', {
    n: '2.3',
    g: [['Explain high and low involvement', 'Giải thích quan tâm cao và thấp'], ['Describe central and peripheral routes of the ELM', 'Mô tả đường trung tâm và ngoại vi của ELM'], ['Choose message style by involvement', 'Chọn kiểu thông điệp theo mức độ quan tâm']],
    b: [`<p><strong>Involvement</strong> is how much personal relevance and perceived risk a purchase has for a person. A laptop for university is high involvement; a bar of soap is low involvement. The same person acts very differently in the two cases.</p>
<h4>Elaboration likelihood model (Petty and Cacioppo, 1986)</h4>
<p>The ELM says persuasion works on two routes. On the <strong>central route</strong>, motivated and able people think carefully about arguments, so strong evidence and logic persuade, and the attitude lasts. On the <strong>peripheral route</strong>, people do not think hard and use cues such as music, a famous face, a pleasant mood, or simply "everyone buys it". Peripheral persuasion is faster but weaker and less durable.</p>
<h4>The FCB grid idea</h4>
<p>Richard Vaughn's grid (the Foote, Cone and Belding planning model) crosses involvement (high/low) with whether the decision is mainly thinking or feeling. It is a simple prompt for choosing the creative approach:</p>
<table><thead><tr><th></th><th>Thinking</th><th>Feeling</th></tr></thead><tbody>
<tr><td>High involvement</td><td>Informative: laptop, insurance. Long copy, facts, comparison, demos.</td><td>Affective: jewellery, a car. Emotional storytelling, strong imagery.</td></tr>
<tr><td>Low involvement</td><td>Habit: detergent, rice. Reminders, offers, easy availability.</td><td>Self-satisfaction: snacks, soft drinks. Mood, humour, sensory appeal.</td></tr></tbody></table>
<h4>Using it</h4>
<p>For a high-involvement product, give people the reasons: spec sheets, reviews, a trial. For a low-involvement product, make the brand easy to notice and recall: strong distinctive assets, repetition, availability. Put both in an IMC plan: PR and content can carry reasons, short video can carry cues and repetition.</p>`,
       `<p><strong>Mức độ quan tâm (involvement)</strong> là mức liên quan cá nhân và rủi ro cảm nhận của một quyết định mua với một người. Laptop để học đại học là quan tâm cao; một cục xà phòng là quan tâm thấp. Cùng một người hành xử rất khác trong hai trường hợp.</p>
<h4>Mô hình khả năng xử lý thông tin (ELM — Petty và Cacioppo, 1986)</h4>
<p>ELM nói thuyết phục đi theo hai đường. Ở <strong>đường trung tâm</strong>, người có động lực và năng lực suy nghĩ kỹ về lập luận, nên bằng chứng và logic mạnh thuyết phục được, và thái độ bền. Ở <strong>đường ngoại vi</strong>, con người không nghĩ nhiều mà dựa vào tín hiệu như nhạc, gương mặt nổi tiếng, tâm trạng dễ chịu, hay đơn giản "ai cũng mua". Thuyết phục ngoại vi nhanh hơn nhưng yếu và ít bền.</p>
<h4>Ý tưởng lưới FCB</h4>
<p>Lưới của Richard Vaughn (mô hình lập kế hoạch Foote, Cone và Belding) đan mức độ quan tâm (cao/thấp) với việc quyết định chủ yếu là lý trí hay cảm xúc. Đây là gợi ý đơn giản để chọn hướng sáng tạo:</p>
<table><thead><tr><th></th><th>Lý trí</th><th>Cảm xúc</th></tr></thead><tbody>
<tr><td>Quan tâm cao</td><td>Thông tin: laptop, bảo hiểm. Nội dung dài, dữ kiện, so sánh, demo.</td><td>Cảm xúc: trang sức, xe hơi. Kể chuyện cảm xúc, hình ảnh mạnh.</td></tr>
<tr><td>Quan tâm thấp</td><td>Thói quen: bột giặt, gạo. Nhắc nhớ, ưu đãi, dễ mua.</td><td>Tự thoả mãn: snack, nước ngọt. Tâm trạng, hài hước, giác quan.</td></tr></tbody></table>
<h4>Vận dụng</h4>
<p>Với sản phẩm quan tâm cao, hãy cho người ta lý do: bảng thông số, đánh giá, dùng thử. Với sản phẩm quan tâm thấp, làm thương hiệu dễ được chú ý và nhớ: tài sản nhận diện đặc trưng, lặp lại, dễ mua. Cả hai đều có trong kế hoạch IMC: PR và nội dung mang lý do, video ngắn mang tín hiệu và sự lặp lại.</p>`],
    pit: ['Writing a long rational ad for a product people buy without thinking, or a pure mood ad for a costly decision.', 'Viết quảng cáo lý trí dài cho sản phẩm người ta mua không cần nghĩ, hoặc quảng cáo chỉ có tâm trạng cho quyết định tốn kém.'],
    s: [['Involvement = personal relevance and risk of the decision.', 'Mức độ quan tâm = độ liên quan cá nhân và rủi ro của quyết định.'], ['ELM: central route (arguments, lasting) vs peripheral route (cues, fast, fragile).', 'ELM: đường trung tâm (lập luận, bền) và đường ngoại vi (tín hiệu, nhanh, mong manh).'], ['FCB grid helps choose informative, affective, habit or self-satisfaction approaches.', 'Lưới FCB giúp chọn hướng thông tin, cảm xúc, thói quen hay tự thoả mãn.']],
    l: ['elm', 'aida', 'research'],
    p: [['Classify: (a) a study-abroad consultancy, (b) a packet of chewing gum, by involvement.', 'Phân loại: (a) tư vấn du học, (b) một gói kẹo cao su, theo mức độ quan tâm.', '(a) high involvement, central route; (b) low involvement, peripheral cues and availability.', '(a) quan tâm cao, đường trung tâm; (b) quan tâm thấp, tín hiệu ngoại vi và độ sẵn có.'],
        ['Why are celebrity endorsements weaker for high-involvement choices?', 'Vì sao người nổi tiếng kém hiệu quả với lựa chọn quan tâm cao?', 'People look for evidence on the central route; a face is only a peripheral cue.', 'Người ta tìm bằng chứng ở đường trung tâm; gương mặt chỉ là tín hiệu ngoại vi.']] }),

  D(P + '2-4', '2.4 How messages spread: two-step flow and word of mouth', '2.4 Thông điệp lan toả thế nào: dòng hai bước và truyền miệng', 'Người dẫn dắt dư luận, truyền miệng, earned media; nối với kiểm soát thông điệp.', {
    n: '2.4',
    g: [['Describe the two-step flow of communication', 'Mô tả dòng truyền thông hai bước'], ['Distinguish owned, paid and earned media', 'Phân biệt phương tiện sở hữu, trả tiền và kiếm được'], ['Explain why word of mouth is hard to control', 'Giải thích vì sao truyền miệng khó kiểm soát']],
    b: [`<p>Paul Lazarsfeld and colleagues, studying voting in the 1940s, found that media messages often reached <strong>opinion leaders</strong> first, who then passed and interpreted them for other people. This is the <strong>two-step flow</strong>. Later work shows reality is more of a network, but the lesson stands: people trust people they know more than they trust advertising.</p>
<h4>Word of mouth (WOM)</h4>
<p>WOM is recommendation between people, now often through chat groups, reviews and comments. It is powerful because it is credible and comes with context. It is hard to control because you cannot script it: you can only earn it by being worth talking about and by making it easy to share.</p>
<h4>Paid, owned, earned</h4>
<table><thead><tr><th>Type</th><th>Meaning</th><th>Example</th><th>Control / credibility</th></tr></thead><tbody>
<tr><td>Paid</td><td>You pay for placement</td><td>TV spot, search ad</td><td>High control, lower credibility</td></tr>
<tr><td>Owned</td><td>You run the channel</td><td>Website, app, own page</td><td>High control, limited reach</td></tr>
<tr><td>Earned</td><td>Others talk or write about you</td><td>News story, review, share</td><td>Low control, high credibility</td></tr></tbody></table>
<h4>Case: Old Spice and real-time replies</h4>
<p>In 2010 Old Spice (Procter &amp; Gamble) ran "The Man Your Man Could Smell Like" with Wieden+Kennedy. After the TV spot spread, the team recorded many short personalised video replies to people on social media, in real time. The campaign is used in textbooks to show how paid creative can trigger earned conversation, and how responding to individuals extends it.</p>
<h4>Practical rule</h4>
<p>Use paid media to start the story, earned and owned media to sustain it. Give people something to pass on: a surprise, a useful tool, an identity they want to show. Never fake reviews or fake accounts: it is deceptive, risky and a topic of EPL201.</p>`,
       `<p>Paul Lazarsfeld và cộng sự, nghiên cứu việc bầu cử những năm 1940, thấy thông điệp truyền thông thường đến <strong>người dẫn dắt dư luận</strong> trước, rồi họ truyền và diễn giải cho người khác. Đó là <strong>dòng hai bước</strong>. Nghiên cứu sau cho thấy thực tế giống mạng lưới hơn, nhưng bài học vẫn đúng: người ta tin người quen hơn tin quảng cáo.</p>
<h4>Truyền miệng (WOM)</h4>
<p>WOM là lời giới thiệu giữa người với người, nay thường qua nhóm chat, đánh giá và bình luận. Nó mạnh vì đáng tin và có ngữ cảnh. Nó khó kiểm soát vì không viết kịch bản được: chỉ có thể kiếm được bằng cách đáng để nói đến và dễ chia sẻ.</p>
<h4>Trả tiền, sở hữu, kiếm được</h4>
<table><thead><tr><th>Loại</th><th>Ý nghĩa</th><th>Ví dụ</th><th>Kiểm soát / độ tin cậy</th></tr></thead><tbody>
<tr><td>Paid</td><td>Bạn trả tiền để được đặt</td><td>Spot TV, quảng cáo tìm kiếm</td><td>Kiểm soát cao, tin cậy thấp hơn</td></tr>
<tr><td>Owned</td><td>Bạn vận hành kênh</td><td>Website, app, trang riêng</td><td>Kiểm soát cao, phạm vi hạn chế</td></tr>
<tr><td>Earned</td><td>Người khác nói hoặc viết về bạn</td><td>Bài báo, đánh giá, chia sẻ</td><td>Kiểm soát thấp, tin cậy cao</td></tr></tbody></table>
<h4>Tình huống: Old Spice và phản hồi thời gian thực</h4>
<p>Năm 2010 Old Spice (Procter &amp; Gamble) chạy "The Man Your Man Could Smell Like" cùng Wieden+Kennedy. Sau khi spot TV lan rộng, đội ngũ quay nhiều video trả lời ngắn cá nhân hoá cho người dùng mạng xã hội, theo thời gian thực. Chiến dịch được giáo trình dùng để cho thấy sáng tạo trả tiền có thể kích hoạt hội thoại kiếm được, và việc trả lời từng cá nhân kéo dài nó.</p>
<h4>Quy tắc thực tế</h4>
<p>Dùng paid để mở đầu câu chuyện, earned và owned để duy trì. Cho người ta thứ để chuyền tay: một bất ngờ, một công cụ hữu ích, một bản sắc họ muốn thể hiện. Đừng bao giờ làm đánh giá giả hay tài khoản giả: lừa dối, rủi ro và là chủ đề của EPL201.</p>`],
    pit: ['Counting shares as success without asking whether people understood or remembered the brand.', 'Coi lượt chia sẻ là thành công mà không hỏi người ta có hiểu hay nhớ thương hiệu không.'],
    s: [['Two-step flow: opinion leaders interpret media for others.', 'Dòng hai bước: người dẫn dắt dư luận diễn giải truyền thông cho người khác.'], ['Paid = control, owned = your channel, earned = credibility.', 'Paid = kiểm soát, owned = kênh của bạn, earned = độ tin cậy.'], ['WOM must be earned; fake reviews are deception.', 'WOM phải kiếm được; đánh giá giả là lừa dối.']],
    l: ['twostep', 'wom', 'earned', 'oldspice'],
    p: [['Classify: a news article about your product; your own website; a paid TikTok ad.', 'Phân loại: bài báo về sản phẩm; website của bạn; quảng cáo TikTok trả tiền.', 'Earned; owned; paid.', 'Earned; owned; paid.'],
        ['Why is a friend\'s recommendation more persuasive than an ad?', 'Vì sao lời giới thiệu của bạn bè thuyết phục hơn quảng cáo?', 'It is more credible, personal and has no obvious sales motive.', 'Đáng tin hơn, mang tính cá nhân và không có động cơ bán hàng rõ ràng.']] }),

  D(P + '2-5', '2.5 Touchpoints and the customer journey', '2.5 Điểm chạm và hành trình khách hàng', 'Vẽ hành trình khách hàng, liệt kê điểm chạm, tìm khoảng trống thông điệp.', {
    n: '2.5',
    g: [['Define a touchpoint and a customer journey', 'Định nghĩa điểm chạm và hành trình khách hàng'], ['Map a simple journey with owned, paid and earned touchpoints', 'Vẽ hành trình đơn giản với điểm chạm owned, paid, earned'], ['Spot message gaps and contradictions', 'Phát hiện khoảng trống và mâu thuẫn thông điệp']],
    b: [`<p>A <strong>touchpoint</strong> is any contact between a person and a brand: an ad, a friend's comment, a search result, a package, a customer-service call, a reply to a complaint. The <strong>customer journey</strong> is the sequence of touchpoints from first hearing about a brand to buying, using, and recommending. The older <em>purchase funnel</em> is a simple picture of the same idea.</p>
<h4>How to map a journey (30 minutes, paper is enough)</h4>
<ol><li>Choose one persona (Chapter 3) and one goal, for example "buy a first laptop".</li>
<li>List the stages: need arises, search, compare, buy, receive, use, recommend.</li>
<li>For each stage write what the person does, thinks, feels, and which touchpoints they use.</li>
<li>Mark each touchpoint paid, owned, earned or sales channel.</li>
<li>Circle gaps (no answer to a question) and contradictions (two touchpoints say different things).</li></ol>
<table><thead><tr><th>Stage</th><th>Person asks</th><th>Touchpoints</th><th>Gap to fix</th></tr></thead><tbody>
<tr><td>Search</td><td>Which laptops suit a student?</td><td>Search results, reviews, friends</td><td>Few helpful pages from the brand</td></tr>
<tr><td>Compare</td><td>What is the real difference?</td><td>Comparison sites, shop staff</td><td>Staff give different answers</td></tr>
<tr><td>After sale</td><td>Is the warranty simple?</td><td>Email, hotline</td><td>Hotline wait too long</td></tr></tbody></table>
<h4>Why it matters for IMC</h4>
<p>Customers judge the brand by the weakest touchpoint, not the best ad. IMC therefore includes post-purchase contacts, which are often cheaper to improve than adding another ad. Omnichannel journeys across many devices are the subject of OCM301; here the goal is just to draw the first map.</p>`,
       `<p><strong>Điểm chạm</strong> là mọi tiếp xúc giữa một người và thương hiệu: quảng cáo, bình luận của bạn bè, kết quả tìm kiếm, bao bì, cuộc gọi chăm sóc khách hàng, câu trả lời cho một khiếu nại. <strong>Hành trình khách hàng</strong> là chuỗi điểm chạm từ lúc lần đầu nghe về thương hiệu đến khi mua, dùng và giới thiệu. <em>Phễu mua hàng</em> cũ là bức tranh đơn giản của cùng ý tưởng.</p>
<h4>Cách vẽ hành trình (30 phút, giấy là đủ)</h4>
<ol><li>Chọn một persona (Chương 3) và một mục tiêu, ví dụ "mua laptop đầu tiên".</li>
<li>Liệt kê các giai đoạn: nảy sinh nhu cầu, tìm kiếm, so sánh, mua, nhận hàng, dùng, giới thiệu.</li>
<li>Với mỗi giai đoạn ghi người đó làm gì, nghĩ gì, cảm thấy gì và dùng điểm chạm nào.</li>
<li>Đánh dấu mỗi điểm chạm là paid, owned, earned hay kênh bán hàng.</li>
<li>Khoanh khoảng trống (câu hỏi không có lời đáp) và mâu thuẫn (hai điểm chạm nói khác nhau).</li></ol>
<table><thead><tr><th>Giai đoạn</th><th>Người đó hỏi</th><th>Điểm chạm</th><th>Khoảng trống cần sửa</th></tr></thead><tbody>
<tr><td>Tìm kiếm</td><td>Laptop nào hợp sinh viên?</td><td>Kết quả tìm kiếm, đánh giá, bạn bè</td><td>Thương hiệu có ít trang hữu ích</td></tr>
<tr><td>So sánh</td><td>Khác biệt thật là gì?</td><td>Trang so sánh, nhân viên cửa hàng</td><td>Nhân viên trả lời khác nhau</td></tr>
<tr><td>Sau bán</td><td>Bảo hành có đơn giản không?</td><td>Email, hotline</td><td>Chờ hotline quá lâu</td></tr></tbody></table>
<h4>Vì sao quan trọng với IMC</h4>
<p>Khách hàng đánh giá thương hiệu theo điểm chạm yếu nhất, không phải quảng cáo hay nhất. Vì vậy IMC bao gồm tiếp xúc sau mua, thường rẻ hơn để cải thiện so với thêm một quảng cáo. Hành trình đa kênh trên nhiều thiết bị là chủ đề của OCM301; ở đây mục tiêu chỉ là vẽ bản đồ đầu tiên.</p>`],
    pit: ['Mapping only the touchpoints the company controls and ignoring reviews, forums and friends.', 'Chỉ vẽ điểm chạm doanh nghiệp kiểm soát mà bỏ đánh giá, diễn đàn và bạn bè.'],
    s: [['Touchpoint = any contact with the brand; journey = their sequence.', 'Điểm chạm = mọi tiếp xúc với thương hiệu; hành trình = chuỗi của chúng.'], ['Map stages, questions, touchpoints, gaps and contradictions.', 'Vẽ giai đoạn, câu hỏi, điểm chạm, khoảng trống và mâu thuẫn.'], ['The weakest touchpoint defines the experience; post-sale counts.', 'Điểm chạm yếu nhất định hình trải nghiệm; sau bán cũng tính.']],
    l: ['touch', 'cx', 'funnel'],
    p: [['Draw a five-stage journey for buying a bubble tea (one line per stage).', 'Vẽ hành trình năm giai đoạn khi mua trà sữa (một dòng mỗi giai đoạn).', 'For example: sees a friend\'s post → checks the app menu → orders with a voucher → waits and receives → rates and posts.', 'Ví dụ: thấy bài của bạn → xem thực đơn trên app → đặt bằng voucher → chờ và nhận → chấm điểm và đăng.'],
        ['Name one touchpoint that is earned.', 'Kể một điểm chạm kiếm được.', 'A customer review, a news story or a friend\'s comment.', 'Một đánh giá khách hàng, bài báo hoặc bình luận của bạn.']] }),

  Q(P + 'quiz-2', 'Chapter 2 quiz — Communication models', 'Quiz Chương 2 — Các mô hình truyền thông', [
    qq('"Noise" in the communication model is…', '"Nhiễu" trong mô hình truyền thông là…', ['Only loud sound|Chỉ âm thanh lớn', 'Anything that distorts the message|Mọi thứ làm méo thông điệp', 'The budget|Ngân sách', 'The brand name|Tên thương hiệu'], 1, 'Clutter, jargon, distraction and poor translation are all noise.', 'Nhiễu gồm lộn xộn, thuật ngữ, mất tập trung, dịch kém.'),
    qq('AIDA stands for…', 'AIDA là viết tắt của…', ['Attention, Interest, Desire, Action|Chú ý, Quan tâm, Mong muốn, Hành động', 'Audience, Image, Data, Advertising|Khán giả, Hình ảnh, Dữ liệu, Quảng cáo', 'Awareness, Income, Demand, Access|Nhận biết, Thu nhập, Cầu, Tiếp cận', 'None of these|Không cái nào'], 0, 'It is a classic four-stage response model.', 'Đây là mô hình phản ứng bốn giai đoạn kinh điển.'),
    qq('Hierarchy of effects groups stages as…', 'Hierarchy of effects nhóm các giai đoạn thành…', ['Cognitive, affective, behavioural|Nhận thức, cảm xúc, hành vi', 'Price, place, product|Giá, nơi bán, sản phẩm', 'Paid, owned, earned|Paid, owned, earned', 'Local, regional, global|Địa phương, khu vực, toàn cầu'], 0, 'Lavidge and Steiner (1961) used these three groups.', 'Lavidge và Steiner (1961) dùng ba nhóm này.'),
    qq('On the ELM central route, persuasion depends on…', 'Ở đường trung tâm của ELM, thuyết phục phụ thuộc vào…', ['Music and celebrities|Nhạc và người nổi tiếng', 'Quality of arguments|Chất lượng lập luận', 'Colour of the logo|Màu logo', 'Luck|May mắn'], 1, 'Motivated people think about the arguments.', 'Người có động lực suy nghĩ về lập luận.'),
    qq('A low-involvement, habit product should usually get…', 'Sản phẩm quan tâm thấp, theo thói quen thường nên có…', ['Long technical copy|Nội dung kỹ thuật dài', 'Reminders, offers and easy availability|Nhắc nhớ, ưu đãi và dễ mua', 'Only expert interviews|Chỉ phỏng vấn chuyên gia', 'No communication|Không truyền thông'], 1, 'Low involvement means little thinking, so reminders and availability matter.', 'Quan tâm thấp nghĩa là ít suy nghĩ nên nhắc nhớ và độ sẵn có quan trọng.'),
    qq('The two-step flow says…', 'Dòng hai bước nói rằng…', ['Messages go straight to everyone equally|Thông điệp đến mọi người như nhau', 'Opinion leaders interpret media for others|Người dẫn dắt dư luận diễn giải truyền thông cho người khác', 'Only two channels exist|Chỉ có hai kênh', 'Ads work in two seconds|Quảng cáo có tác dụng trong hai giây'], 1, 'Personal influence follows media exposure.', 'Ảnh hưởng cá nhân đi sau tiếp xúc truyền thông.'),
    qq('A customer review of your product on a third-party site is…', 'Đánh giá khách hàng về sản phẩm trên trang thứ ba là…', ['Paid media|Phương tiện trả tiền', 'Owned media|Phương tiện sở hữu', 'Earned media|Phương tiện kiếm được', 'Direct mail|Thư trực tiếp'], 2, 'You did not pay or own the channel.', 'Bạn không trả tiền hay sở hữu kênh.'),
    qq('The main point of mapping a customer journey is to…', 'Mục đích chính của vẽ hành trình khách hàng là…', ['Find gaps and contradictions across touchpoints|Tìm khoảng trống và mâu thuẫn giữa các điểm chạm', 'Choose a logo|Chọn logo', 'Reduce the number of staff|Giảm nhân sự', 'Avoid research|Tránh nghiên cứu'], 0, 'The map reveals where the experience breaks.', 'Bản đồ cho thấy trải nghiệm đứt gãy ở đâu.'),
    qq('Which metric best fits the awareness stage?', 'Chỉ số nào hợp nhất với giai đoạn nhận biết?', ['Repeat purchase rate|Tỷ lệ mua lại', 'Aided awareness|Nhận biết có gợi ý', 'Profit margin|Biên lợi nhuận', 'Staff turnover|Tỷ lệ nghỉ việc'], 1, 'Match the metric to the stage of the objective.', 'Khớp chỉ số với giai đoạn của mục tiêu.'),
  ]),
]));
// ===== Chương 3 =====
secs.push(SEC('Chapter 3 — Situation, audience and objectives', 'Chương 3 — Bối cảnh, đối tượng và mục tiêu',
  'Từ kế hoạch marketing sang kế hoạch truyền thông: phân tích bối cảnh, xác định đối tượng, đặt mục tiêu, viết brief.', [
  D(P + '3-1', '3.1 From marketing plan to communication situation', '3.1 Từ kế hoạch marketing tới bối cảnh truyền thông', 'Rà soát bối cảnh, SWOT truyền thông, vai trò truyền thông trong marketing mix.', {
    n: '3.1',
    g: [['Say what communication can and cannot fix', 'Nói được truyền thông giải quyết và không giải quyết được điều gì'], ['Do a communication-focused SWOT', 'Làm SWOT tập trung vào truyền thông'], ['Collect the five facts every plan needs', 'Thu thập năm dữ kiện mọi kế hoạch cần']],
    b: [`<p>Communication is one part of the marketing mix, next to product, price and place. It cannot rescue a product people do not want, a price that is too high, or a shop that is always out of stock. The first job in planning is therefore to ask: <em>is the problem really a communication problem?</em> If customers know the product, like it, but cannot find it, the fix is distribution, not another ad.</p>
<h4>Five facts to collect</h4>
<ol><li><strong>Business goal</strong>: sales, share, profit, a launch date.</li>
<li><strong>Product and brand</strong>: stage of life cycle, key benefits, brand position (from BRA201).</li>
<li><strong>Market and competitors</strong>: who else speaks to your audience, what do they promise, how much do they spend (estimates are fine, mark them as such).</li>
<li><strong>Audience</strong>: what they know, feel, do now (next lesson).</li>
<li><strong>Constraints</strong>: budget, time, legal rules, past commitments, brand safety limits.</li></ol>
<h4>Communication SWOT</h4>
<p>A normal SWOT lists strengths and weaknesses of the firm. For IMC, narrow it to communication questions.</p>
<table><thead><tr><th></th><th>Helpful</th><th>Harmful</th></tr></thead><tbody>
<tr><td>Internal</td><td>Strengths: well-known name, loyal community, good customer reviews, a strong spokesperson</td><td>Weaknesses: tiny budget, inconsistent tone across teams, weak website, no data</td></tr>
<tr><td>External</td><td>Opportunities: a trend or event, an underserved audience, new platform, partner</td><td>Threats: louder rivals, rising media costs, negative news, platform rule changes</td></tr></tbody></table>
<p>Turn each box into a decision: "we have a loyal community, so use referral content", "rivals outspend us on TV, so avoid head-on TV and use PR and search".</p>
<h4>Example: a student club event</h4>
<p>A university club wants 300 participants for a career day. Product: free event. Competitors: other club events in the same week. Audience: second-year students. Constraint: 2 million VND budget. Insight from SWOT: the club has a large group chat network and a faculty partner, so most tools will be owned and earned, with a small paid boost.</p>`,
       `<p>Truyền thông là một phần của marketing mix, cạnh sản phẩm, giá và phân phối. Nó không cứu được sản phẩm không ai cần, mức giá quá cao hay cửa hàng thường xuyên hết hàng. Vì vậy việc đầu tiên khi lập kế hoạch là hỏi: <em>đây có thật sự là vấn đề truyền thông không?</em> Nếu khách biết sản phẩm, thích nó, nhưng không tìm thấy chỗ mua, cách sửa là phân phối, không phải thêm một quảng cáo.</p>
<h4>Năm dữ kiện cần thu thập</h4>
<ol><li><strong>Mục tiêu kinh doanh</strong>: doanh số, thị phần, lợi nhuận, ngày ra mắt.</li>
<li><strong>Sản phẩm và thương hiệu</strong>: giai đoạn vòng đời, lợi ích chính, vị thế thương hiệu (từ BRA201).</li>
<li><strong>Thị trường và đối thủ</strong>: ai khác đang nói với đối tượng, họ hứa gì, chi bao nhiêu (ước lượng cũng được, hãy ghi rõ là ước lượng).</li>
<li><strong>Đối tượng</strong>: họ biết, cảm nhận, làm gì hiện nay (bài sau).</li>
<li><strong>Ràng buộc</strong>: ngân sách, thời gian, quy định pháp lý, cam kết cũ, giới hạn an toàn thương hiệu.</li></ol>
<h4>SWOT truyền thông</h4>
<p>SWOT thông thường liệt kê điểm mạnh yếu của công ty. Với IMC, thu hẹp về câu hỏi truyền thông.</p>
<table><thead><tr><th></th><th>Có lợi</th><th>Có hại</th></tr></thead><tbody>
<tr><td>Bên trong</td><td>Điểm mạnh: tên tuổi quen thuộc, cộng đồng trung thành, đánh giá tốt, người phát ngôn mạnh</td><td>Điểm yếu: ngân sách nhỏ, giọng điệu không đồng nhất giữa các đội, website yếu, thiếu dữ liệu</td></tr>
<tr><td>Bên ngoài</td><td>Cơ hội: xu hướng hay sự kiện, nhóm đối tượng bị bỏ quên, nền tảng mới, đối tác</td><td>Thách thức: đối thủ nói to hơn, giá phương tiện tăng, tin tiêu cực, thay đổi quy định nền tảng</td></tr></tbody></table>
<p>Biến mỗi ô thành quyết định: "ta có cộng đồng trung thành nên dùng nội dung giới thiệu", "đối thủ chi TV nhiều hơn nên tránh đối đầu TV và dùng PR cùng tìm kiếm".</p>
<h4>Ví dụ: sự kiện của câu lạc bộ sinh viên</h4>
<p>Một câu lạc bộ trường muốn 300 người tham gia ngày hội nghề nghiệp. Sản phẩm: sự kiện miễn phí. Đối thủ: các sự kiện khác của câu lạc bộ trong cùng tuần. Đối tượng: sinh viên năm hai. Ràng buộc: ngân sách 2 triệu đồng. Phát hiện từ SWOT: câu lạc bộ có mạng nhóm chat lớn và đối tác khoa, nên phần lớn công cụ là owned và earned, kèm một khoản nhỏ đẩy trả tiền.</p>`],
    pit: ['Asking communication to fix price, product or distribution problems. Diagnose first.', 'Đòi truyền thông sửa vấn đề giá, sản phẩm hay phân phối. Chẩn đoán trước đã.'],
    s: [['Check first whether the problem is communication at all.', 'Kiểm tra trước xem vấn đề có phải truyền thông không.'], ['Five facts: goal, product/brand, market, audience, constraints.', 'Năm dữ kiện: mục tiêu, sản phẩm/thương hiệu, thị trường, đối tượng, ràng buộc.'], ['Turn each SWOT box into a decision.', 'Biến mỗi ô SWOT thành quyết định.']],
    l: ['swot', 'mplan2', 'lifecycle', 'mstrat'],
    p: [['Sales fall because shelves are empty. Is more advertising the fix?', 'Doanh số giảm vì kệ hết hàng. Thêm quảng cáo có phải cách sửa?', 'No. It is a distribution problem; extra ads may even worsen the stock-out.', 'Không. Đó là vấn đề phân phối; thêm quảng cáo có thể làm hết hàng nặng hơn.'],
        ['Write one communication threat for a small café opposite a chain.', 'Viết một thách thức truyền thông cho quán cà phê nhỏ đối diện chuỗi.', 'For example: the chain can outspend the café on promotions and paid social.', 'Ví dụ: chuỗi có thể chi cho khuyến mãi và quảng cáo mạng xã hội nhiều hơn quán.']] }),

  D(P + '3-2', '3.2 Audience: segments, personas and insight', '3.2 Đối tượng: phân khúc, persona và insight', 'Chọn đối tượng mục tiêu truyền thông, viết persona, tìm insight; phân biệt đối tượng mua và đối tượng ảnh hưởng.', {
    n: '3.2',
    g: [['Define target audience for communication (not only for the product)', 'Định nghĩa đối tượng mục tiêu cho truyền thông (không chỉ cho sản phẩm)'], ['Write a short persona with a communication insight', 'Viết persona ngắn kèm insight truyền thông'], ['Separate buyers, users and influencers', 'Phân biệt người mua, người dùng và người ảnh hưởng']],
    b: [`<p>You will be tempted to write "women 18 to 35". That is a <em>demographic</em>, not an audience. For communication, define who you want to reach and what they currently think, using four layers:</p>
<ul><li><strong>Demographic</strong>: age, place, income, occupation.</li>
<li><strong>Behavioural</strong>: what they buy, how often, which channels they use, how they search.</li>
<li><strong>Psychographic</strong>: values, interests, worries.</li>
<li><strong>Role</strong>: who decides, who pays, who uses, who influences.</li></ul>
<p>In many categories these are different people. Baby milk: the child uses it, the mother buys it, grandparents and doctors influence. A message for only the buyer misses the influencers.</p>
<h4>Persona in six lines</h4>
<p>Name and snapshot · goal · how they find information · what blocks them · what they say about the category in their own words · channels they trust. Base it on interviews, survey data, search data or comments, not on imagination. Mark guesses as hypotheses.</p>
<h4>From data to insight</h4>
<p>An <strong>insight</strong> is a non-obvious truth about how or why people behave, that a brand can act on. Observation: "students skip breakfast". Insight: "students skip breakfast because they sleep as late as they can, so anything that takes more than two minutes will lose". The insight points to the offer (a grab-and-go product) and the message ("ready before your bus").</p>
<h4>Example persona (hypothetical, for practice)</h4>
<p><strong>Minh, 19, first-year student in Ho Chi Minh City.</strong> Goal: find part-time work without hurting grades. Finds information in group chats and short videos. Blocked by fear of scams. Says: "Is this job real?" Trusts: seniors in the faculty and a few creators. Communication implication: proof and peer voices beat polished brand claims.</p>`,
       `<p>Bạn sẽ bị cám dỗ viết "phụ nữ 18 đến 35 tuổi". Đó là <em>nhân khẩu học</em>, chưa phải đối tượng. Với truyền thông, hãy xác định ai bạn muốn tiếp cận và hiện họ nghĩ gì, qua bốn lớp:</p>
<ul><li><strong>Nhân khẩu học</strong>: tuổi, nơi ở, thu nhập, nghề nghiệp.</li>
<li><strong>Hành vi</strong>: mua gì, bao lâu một lần, dùng kênh nào, tìm kiếm ra sao.</li>
<li><strong>Tâm lý</strong>: giá trị, sở thích, nỗi lo.</li>
<li><strong>Vai trò</strong>: ai quyết định, ai trả tiền, ai dùng, ai ảnh hưởng.</li></ul>
<p>Ở nhiều ngành, đó là những người khác nhau. Sữa cho trẻ: trẻ dùng, mẹ mua, ông bà và bác sĩ ảnh hưởng. Thông điệp chỉ cho người mua sẽ bỏ lỡ người ảnh hưởng.</p>
<h4>Persona sáu dòng</h4>
<p>Tên và ảnh chụp nhanh · mục tiêu · cách tìm thông tin · điều cản trở · họ nói gì về ngành hàng bằng lời của chính mình · kênh họ tin. Dựa trên phỏng vấn, khảo sát, dữ liệu tìm kiếm hoặc bình luận, không dựa trí tưởng tượng. Ghi giả định là giả thuyết.</p>
<h4>Từ dữ liệu tới insight</h4>
<p><strong>Insight</strong> là sự thật không hiển nhiên về cách hoặc lý do con người hành xử, mà thương hiệu có thể hành động theo. Quan sát: "sinh viên bỏ bữa sáng". Insight: "sinh viên bỏ bữa sáng vì ngủ muộn hết mức có thể, nên thứ gì mất hơn hai phút là thua". Insight chỉ ra đề nghị (sản phẩm cầm đi) và thông điệp ("sẵn sàng trước khi xe buýt tới").</p>
<h4>Persona ví dụ (giả định, để luyện tập)</h4>
<p><strong>Minh, 19 tuổi, sinh viên năm nhất ở TP.HCM.</strong> Mục tiêu: tìm việc làm thêm mà không hại điểm số. Tìm thông tin trong nhóm chat và video ngắn. Cản trở: sợ bị lừa. Nói: "Việc này có thật không?" Tin: các anh chị khoá trên trong khoa và vài nhà sáng tạo nội dung. Hàm ý truyền thông: bằng chứng và tiếng nói đồng trang lứa thắng tuyên bố bóng bẩy của thương hiệu.</p>`],
    pit: ['A persona full of invented details (hobbies, pet names) and no evidence. Cut anything you cannot support.', 'Persona đầy chi tiết bịa (sở thích, tên thú cưng) mà không có bằng chứng. Cắt mọi thứ bạn không chứng minh được.'],
    s: [['Audience = demographic + behaviour + psychographic + role.', 'Đối tượng = nhân khẩu + hành vi + tâm lý + vai trò.'], ['Buyer, user and influencer may be three people.', 'Người mua, người dùng, người ảnh hưởng có thể là ba người.'], ['An insight is a non-obvious truth the brand can act on.', 'Insight là sự thật không hiển nhiên mà thương hiệu có thể hành động.']],
    l: ['seg', 'taud', 'research', 'tgoogle'],
    p: [['For a school-lunch delivery service, name the buyer, user and an influencer.', 'Với dịch vụ giao cơm trưa học đường, nêu người mua, người dùng và một người ảnh hưởng.', 'Buyer: parent; user: pupil; influencer: teacher or other parents.', 'Người mua: phụ huynh; người dùng: học sinh; ảnh hưởng: giáo viên hoặc phụ huynh khác.'],
        ['Is "students use phones a lot" an insight? Why or why not?', '"Sinh viên dùng điện thoại nhiều" có phải insight không? Vì sao?', 'No, it is obvious and gives no direction for the message.', 'Không, quá hiển nhiên và không chỉ hướng cho thông điệp.']] }),

  D(P + '3-3', '3.3 Communication objectives', '3.3 Mục tiêu truyền thông', 'Phân biệt mục tiêu marketing và truyền thông, đặt mục tiêu SMART/DAGMAR theo giai đoạn.', {
    n: '3.3',
    g: [['Distinguish marketing objectives from communication objectives', 'Phân biệt mục tiêu marketing và mục tiêu truyền thông'], ['Write one objective with a number, an audience and a date', 'Viết một mục tiêu có số, đối tượng và ngày'], ['Link objectives to the response stage', 'Gắn mục tiêu với giai đoạn phản ứng']],
    b: [`<p>A <strong>marketing objective</strong> is about business outcomes: sales, share, profit. A <strong>communication objective</strong> is about the mental or behavioural change that communication itself can cause: awareness, understanding, attitude, intention, trial. Sales are the result of many factors (price, distribution, product), so a plan that only says "raise sales by 10%" cannot be judged as a communication plan.</p>
<h4>DAGMAR and SMART</h4>
<p>The DAGMAR approach (Colley, 1961) asks for a communication task that is <em>concrete, measurable, with a defined audience, a baseline and a time frame</em>. It matches the SMART idea: specific, measurable, achievable, relevant, time-bound.</p>
<div class="formula"><span class="lbl">Objective formula</span>Among [audience], move [measure] from [baseline] to [target] by [date]</div>
<h4>Examples (hypothetical numbers, for practice)</h4>
<table><thead><tr><th>Weak</th><th>Better</th></tr></thead><tbody>
<tr><td>Increase awareness</td><td>Among 18 to 24 year-olds in Hanoi, raise aided awareness of the club from 20% to 35% by the end of March.</td></tr>
<tr><td>Get more likes</td><td>Get 1,000 students to register for the career day through the link by 10 days before the event.</td></tr>
<tr><td>Improve image</td><td>Raise the share who agree "the brand is trustworthy" from 40% to 50% in the next survey wave.</td></tr></tbody></table>
<h4>Matching objectives to stage</h4>
<p>Awareness objectives suit new brands; consideration and preference suit crowded categories; action objectives suit promotions and retargeting. Pick <em>one</em> primary objective. Too many objectives produce a vague plan.</p>
<h4>Baseline matters</h4>
<p>"Raise awareness to 35%" means nothing if you do not know it is 20% or 33% now. If no data exists, the first objective is to measure a baseline, for instance with a short survey or a brand-search count before launch.</p>`,
       `<p><strong>Mục tiêu marketing</strong> nói về kết quả kinh doanh: doanh số, thị phần, lợi nhuận. <strong>Mục tiêu truyền thông</strong> nói về thay đổi trong nhận thức hay hành vi mà chính truyền thông có thể gây ra: nhận biết, hiểu, thái độ, ý định, dùng thử. Doanh số là kết quả của nhiều yếu tố (giá, phân phối, sản phẩm), nên kế hoạch chỉ ghi "tăng doanh số 10%" không thể bị đánh giá như một kế hoạch truyền thông.</p>
<h4>DAGMAR và SMART</h4>
<p>Cách tiếp cận DAGMAR (Colley, 1961) đòi một nhiệm vụ truyền thông <em>cụ thể, đo được, có đối tượng xác định, mức nền và khung thời gian</em>. Nó khớp ý tưởng SMART: cụ thể, đo được, khả thi, liên quan, có thời hạn.</p>
<div class="formula"><span class="lbl">Công thức mục tiêu</span>Trong [đối tượng], đưa [chỉ số] từ [mức nền] lên [mục tiêu] trước [ngày]</div>
<h4>Ví dụ (số giả định, để luyện tập)</h4>
<table><thead><tr><th>Yếu</th><th>Tốt hơn</th></tr></thead><tbody>
<tr><td>Tăng nhận biết</td><td>Trong nhóm 18 đến 24 tuổi ở Hà Nội, tăng nhận biết có gợi ý về câu lạc bộ từ 20% lên 35% trước cuối tháng Ba.</td></tr>
<tr><td>Có thêm lượt thích</td><td>Có 1.000 sinh viên đăng ký ngày hội nghề nghiệp qua đường dẫn trước sự kiện 10 ngày.</td></tr>
<tr><td>Cải thiện hình ảnh</td><td>Tăng tỷ lệ đồng ý "thương hiệu đáng tin" từ 40% lên 50% ở đợt khảo sát tới.</td></tr></tbody></table>
<h4>Ghép mục tiêu với giai đoạn</h4>
<p>Mục tiêu nhận biết hợp thương hiệu mới; cân nhắc và ưa chuộng hợp ngành đông đúc; mục tiêu hành động hợp khuyến mãi và quảng cáo nhắm lại. Chọn <em>một</em> mục tiêu chính. Quá nhiều mục tiêu cho kế hoạch mơ hồ.</p>
<h4>Mức nền rất quan trọng</h4>
<p>"Tăng nhận biết lên 35%" vô nghĩa nếu bạn không biết hiện là 20% hay 33%. Nếu chưa có dữ liệu, mục tiêu đầu tiên là đo mức nền, ví dụ bằng khảo sát ngắn hoặc đếm lượng tìm kiếm thương hiệu trước khi ra mắt.</p>`],
    pit: ['Writing "increase sales 20%" as the only objective of a social campaign. Sales have many causes; the campaign needs its own measurable effect.', 'Chỉ viết "tăng doanh số 20%" làm mục tiêu cho chiến dịch mạng xã hội. Doanh số có nhiều nguyên nhân; chiến dịch cần hiệu ứng đo được của riêng nó.'],
    s: [['Marketing objectives are business outcomes; communication objectives are mental or behavioural effects.', 'Mục tiêu marketing là kết quả kinh doanh; mục tiêu truyền thông là hiệu ứng nhận thức hay hành vi.'], ['Use: audience + measure + baseline + target + date.', 'Dùng: đối tượng + chỉ số + mức nền + mục tiêu + ngày.'], ['One primary objective; measure the baseline first.', 'Một mục tiêu chính; đo mức nền trước.']],
    l: ['dagmar', 'smart', 'kpi', 'aware'],
    p: [['Rewrite "get more followers" as a better objective for a café with 800 followers (use hypothetical numbers).', 'Viết lại "có thêm người theo dõi" thành mục tiêu tốt hơn cho quán cà phê có 800 người theo dõi (dùng số giả định).', 'For example: among students within 3 km, get 300 to follow and 60 to redeem the first-visit voucher within 6 weeks.', 'Ví dụ: trong sinh viên trong bán kính 3 km, có 300 người theo dõi và 60 người dùng voucher lần đầu trong 6 tuần.'],
        ['What is missing in "raise awareness to 40%"?', 'Thiếu gì trong "tăng nhận biết lên 40%"?', 'Audience, baseline and deadline (and the measurement method).', 'Đối tượng, mức nền và thời hạn (cùng cách đo).']] }),

  D(P + '3-4', '3.4 The creative brief', '3.4 Bản brief sáng tạo', 'Viết brief một trang để dẫn dắt agency và đội nội bộ.', {
    n: '3.4',
    g: [['List the parts of a one-page brief', 'Liệt kê các phần của brief một trang'], ['Write a single-minded proposition', 'Viết một đề xuất đơn nhất'], ['Check a brief for common faults', 'Kiểm tra brief theo lỗi thường gặp']],
    b: [`<p>A <strong>creative brief</strong> turns research and objectives into instructions for the people who make the work. Agencies differ in format, but a good brief fits on one page and has these parts.</p>
<ol><li><strong>Background</strong>: situation in three lines.</li>
<li><strong>Objective</strong>: the measurable communication objective (previous lesson).</li>
<li><strong>Audience and insight</strong>: who, and the insight about them.</li>
<li><strong>Single-minded proposition</strong>: the one thing we want them to take away.</li>
<li><strong>Reason to believe</strong>: the proof.</li>
<li><strong>Tone and mandatories</strong>: voice, legal lines, logo, must-includes.</li>
<li><strong>Channels and budget range</strong>.</li>
<li><strong>Timing and approvals</strong>.</li>
<li><strong>How success is measured</strong>.</li></ol>
<h4>Single-minded proposition</h4>
<p>Writing two propositions means the audience will remember neither. Test: can you say it in one sentence, in the audience's words, without "and"? Example for the career day: "Meet real recruiters and leave with a CV review, in one afternoon on campus."</p>
<h4>Example brief (fictional club event, short)</h4>
<table><thead><tr><th>Part</th><th>Content</th></tr></thead><tbody>
<tr><td>Objective</td><td>1,000 registrations 10 days before the event</td></tr>
<tr><td>Audience</td><td>Second-year students afraid they have no experience</td></tr>
<tr><td>Insight</td><td>They avoid career events because they feel unprepared and fear being judged</td></tr>
<tr><td>Proposition</td><td>Come as you are: a friendly day to get real feedback</td></tr>
<tr><td>Reason to believe</td><td>Recruiters named on the page; free CV clinic; past attendees\' quotes</td></tr>
<tr><td>Tone</td><td>Warm, peer-to-peer, no corporate jargon</td></tr></tbody></table>
<h4>Common faults</h4>
<p>Several messages in one brief; "everyone" as the audience; no proof; no budget range; success defined as "go viral". The brief is also what the evaluation will check at the end, so write it so you can mark it later.</p>`,
       `<p><strong>Brief sáng tạo</strong> biến nghiên cứu và mục tiêu thành chỉ dẫn cho những người làm sản phẩm truyền thông. Mỗi agency một định dạng, nhưng brief tốt vừa một trang và có các phần sau.</p>
<ol><li><strong>Bối cảnh</strong>: tình huống trong ba dòng.</li>
<li><strong>Mục tiêu</strong>: mục tiêu truyền thông đo được (bài trước).</li>
<li><strong>Đối tượng và insight</strong>: ai, và insight về họ.</li>
<li><strong>Đề xuất đơn nhất</strong>: điều duy nhất ta muốn họ mang theo.</li>
<li><strong>Lý do tin</strong>: bằng chứng.</li>
<li><strong>Giọng điệu và bắt buộc</strong>: giọng nói, dòng pháp lý, logo, thứ phải có.</li>
<li><strong>Kênh và khung ngân sách</strong>.</li>
<li><strong>Thời gian và duyệt</strong>.</li>
<li><strong>Cách đo thành công</strong>.</li></ol>
<h4>Đề xuất đơn nhất</h4>
<p>Viết hai đề xuất nghĩa là khán giả sẽ không nhớ cái nào. Kiểm tra: có nói được trong một câu, bằng lời của đối tượng, không có chữ "và" không? Ví dụ cho ngày hội nghề nghiệp: "Gặp nhà tuyển dụng thật và ra về với bản CV đã được góp ý, trong một buổi chiều ngay trong trường."</p>
<h4>Brief ví dụ (sự kiện câu lạc bộ hư cấu, rút gọn)</h4>
<table><thead><tr><th>Phần</th><th>Nội dung</th></tr></thead><tbody>
<tr><td>Mục tiêu</td><td>1.000 lượt đăng ký trước sự kiện 10 ngày</td></tr>
<tr><td>Đối tượng</td><td>Sinh viên năm hai sợ mình chưa có kinh nghiệm</td></tr>
<tr><td>Insight</td><td>Họ né sự kiện nghề nghiệp vì thấy chưa sẵn sàng và sợ bị đánh giá</td></tr>
<tr><td>Đề xuất</td><td>Cứ đến như bạn đang là: một ngày thân thiện để nhận góp ý thật</td></tr>
<tr><td>Lý do tin</td><td>Nêu tên nhà tuyển dụng trên trang; phòng góp ý CV miễn phí; lời của người đã tham dự</td></tr>
<tr><td>Giọng điệu</td><td>Ấm áp, như bạn bè, không dùng thuật ngữ công sở</td></tr></tbody></table>
<h4>Lỗi thường gặp</h4>
<p>Nhiều thông điệp trong một brief; "mọi người" làm đối tượng; không có bằng chứng; không có khung ngân sách; thành công được định nghĩa là "lan truyền". Brief cũng là thứ đánh giá cuối cùng sẽ kiểm tra, nên hãy viết sao cho sau này bạn chấm điểm được.</p>`],
    pit: ['A brief that is a wish list: five propositions, three audiences, no priority.', 'Brief như danh sách ước muốn: năm đề xuất, ba đối tượng, không ưu tiên.'],
    s: [['A good brief fits one page.', 'Brief tốt vừa một trang.'], ['One single-minded proposition with a reason to believe.', 'Một đề xuất đơn nhất kèm lý do tin.'], ['Write success measures into the brief.', 'Ghi cách đo thành công vào brief.']],
    l: ['cbrief', 'usp', 'cta'],
    p: [['Turn this into a single-minded proposition: "Our hostel is cheap, clean, central, has a rooftop and a kitchen".', 'Biến thành đề xuất đơn nhất: "Hostel của chúng tôi rẻ, sạch, trung tâm, có sân thượng và bếp".', 'Pick the one that matters to the audience, e.g. "The cheapest clean bed in the city centre", then use the rest as proof.', 'Chọn điều quan trọng với đối tượng, ví dụ "Giường sạch rẻ nhất ở trung tâm", phần còn lại làm bằng chứng.'],
        ['Which two parts of a brief does the evaluation need most?', 'Hai phần nào của brief cần nhất cho đánh giá?', 'The objective (with baseline and target) and the success measures.', 'Mục tiêu (có mức nền và đích) và cách đo thành công.']] }),

  Q(P + 'quiz-3', 'Chapter 3 quiz — Situation, audience and objectives', 'Quiz Chương 3 — Bối cảnh, đối tượng và mục tiêu', [
    qq('The first planning question about a sales drop is…', 'Câu hỏi đầu tiên khi doanh số giảm là…', ['Which influencer to hire?|Thuê influencer nào?', 'Is it a communication problem at all?|Đây có thật là vấn đề truyền thông không?', 'What colour should the ad be?|Quảng cáo màu gì?', 'How long should the video be?|Video dài bao lâu?'], 1, 'Communication cannot fix product, price or distribution faults.', 'Truyền thông không sửa được lỗi sản phẩm, giá hay phân phối.'),
    qq('A "communication SWOT" is best used to…', 'SWOT truyền thông dùng tốt nhất để…', ['Fill a template|Điền mẫu', 'Turn each box into a decision about tools and messages|Biến mỗi ô thành quyết định về công cụ và thông điệp', 'Replace research|Thay nghiên cứu', 'Choose the logo|Chọn logo'], 1, 'A list with no decision is not useful.', 'Danh sách không dẫn tới quyết định thì vô ích.'),
    qq('Which is a behavioural audience layer?', 'Đâu là lớp hành vi của đối tượng?', ['Age|Tuổi', 'Channels they use and how they search|Kênh họ dùng và cách họ tìm kiếm', 'City|Thành phố', 'Education|Học vấn'], 1, 'Behaviour = what they do, buy and use.', 'Hành vi = họ làm, mua và dùng gì.'),
    qq('An insight is…', 'Insight là…', ['An obvious statistic|Một thống kê hiển nhiên', 'A non-obvious truth about behaviour a brand can act on|Sự thật không hiển nhiên về hành vi mà thương hiệu có thể hành động', 'A slogan|Một slogan', 'A media price|Giá phương tiện'], 1, 'It must point to an offer or message.', 'Nó phải chỉ ra một đề nghị hay thông điệp.'),
    qq('Which is a communication objective rather than a marketing objective?', 'Đâu là mục tiêu truyền thông chứ không phải marketing?', ['Reach 20% market share|Đạt 20% thị phần', 'Raise aided awareness from 20% to 35% in the target group|Tăng nhận biết có gợi ý từ 20% lên 35% ở nhóm mục tiêu', 'Increase profit by 5%|Tăng lợi nhuận 5%', 'Open ten stores|Mở mười cửa hàng'], 1, 'It is a mental effect communication can cause.', 'Đó là hiệu ứng nhận thức mà truyền thông gây ra được.'),
    qq('Why does an objective need a baseline?', 'Vì sao mục tiêu cần mức nền?', ['To look professional|Cho chuyên nghiệp', 'To know how much change the plan must create|Để biết kế hoạch phải tạo ra bao nhiêu thay đổi', 'Because the law requires it|Vì luật yêu cầu', 'It does not|Không cần'], 1, 'Without a baseline, progress cannot be measured.', 'Không có mức nền thì không đo được tiến bộ.'),
    qq('A single-minded proposition should be…', 'Đề xuất đơn nhất nên…', ['A list of all benefits|Là danh sách mọi lợi ích', 'One main takeaway with a reason to believe|Một điều chính cần nhớ kèm lý do tin', 'Longer than the brief|Dài hơn brief', 'Left to the agency|Để agency tự quyết'], 1, 'Two propositions are remembered as none.', 'Hai đề xuất sẽ bị nhớ thành không cái nào.'),
    qq('"Everyone aged 15 to 60" as an audience is…', '"Mọi người 15 đến 60 tuổi" làm đối tượng là…', ['Ideal|Lý tưởng', 'Too broad to guide message and media|Quá rộng, không dẫn dắt được thông điệp và phương tiện', 'Required|Bắt buộc', 'A persona|Một persona'], 1, 'Choose a specific audience, even if the product sells to others.', 'Hãy chọn đối tượng cụ thể, dù sản phẩm bán được cho người khác.'),
  ]),
]));
// ===== Chương 4 =====
secs.push(SEC('Chapter 4 — Message and creative strategy', 'Chương 4 — Thông điệp và chiến lược sáng tạo',
  'Ý tưởng lớn, kiểu thu hút lý trí và cảm xúc, cấu trúc thông điệp, đánh giá sáng tạo bằng tiêu chí.', [
  D(P + '4-1', '4.1 From proposition to big idea', '4.1 Từ đề xuất tới ý tưởng lớn', 'Big idea, USP, execution; kiểm tra ý tưởng có đi xuyên nhiều công cụ được không.', {
    n: '4.1',
    g: [['Distinguish proposition, big idea and execution', 'Phân biệt đề xuất, ý tưởng lớn và cách thể hiện'], ['Test a big idea for "stretch" across tools', 'Thử độ "co giãn" của ý tưởng lớn xuyên các công cụ'], ['Recognise the USP approach and its limits', 'Nhận ra cách tiếp cận USP và giới hạn của nó']],
    b: [`<p>Positioning (BRA201) tells you what place the brand wants in people's minds. The <strong>proposition</strong> from the brief says what this campaign must communicate. The <strong>big idea</strong> is the creative concept that makes the proposition memorable and interesting. The <strong>execution</strong> is how the idea appears in each piece: a film, a poster, a post, a stand.</p>
<table><thead><tr><th>Level</th><th>Example (Nike)</th></tr></thead><tbody>
<tr><td>Proposition</td><td>Sport is for anyone who decides to try</td></tr>
<tr><td>Big idea</td><td>"Just Do It" (introduced in 1988 with Wieden+Kennedy)</td></tr>
<tr><td>Execution</td><td>Many different films, posters, athlete stories over decades</td></tr></tbody></table>
<h4>USP</h4>
<p>Rosser Reeves described the <strong>unique selling proposition</strong> in the 1960s: a specific benefit, which competitors do not offer, strong enough to move people. It works when a real functional difference exists. In crowded categories where products are alike, brands often use an emotional or social idea as well.</p>
<h4>What makes an idea "big"?</h4>
<ul><li><strong>Relevant</strong> to the audience's insight.</li>
<li><strong>Distinct</strong> from rivals in the same space.</li>
<li><strong>Simple</strong>: you can describe it in one line.</li>
<li><strong>Stretchable</strong>: it works in a film, a post, a shop display, a press story and an event.</li>
<li><strong>Durable</strong>: it can run for more than one campaign.</li></ul>
<h4>Stretch test (try this)</h4>
<p>Write the idea at the top of a page, then list one piece for each of four tools: a 15-second video, a PR story, an in-store item, a social interaction. If you cannot fill all four, the idea is a slogan, not a platform. <em>Dumb Ways to Die</em> (Chapter 1) passes: song, animation, press, games and real station presence.</p>
<h4>Another case: Share a Coke</h4>
<p>Coca-Cola's <em>Share a Coke</em> started in Australia in 2011 by printing popular first names on bottles. The idea is simple (find your name, share a drink), stretchable (shop hunts, social posts, personalised cans) and was later adapted by Coca-Cola to many countries. Local versions need local names and customs, which is a first taste of the global issues taught in IGI301.</p>`,
       `<p>Định vị (BRA201) cho biết thương hiệu muốn chiếm chỗ nào trong tâm trí. <strong>Đề xuất</strong> trong brief nói chiến dịch này phải truyền đạt điều gì. <strong>Ý tưởng lớn</strong> là khái niệm sáng tạo khiến đề xuất đáng nhớ và hấp dẫn. <strong>Cách thể hiện</strong> là việc ý tưởng xuất hiện trong từng sản phẩm: một phim, áp phích, bài đăng, gian hàng.</p>
<table><thead><tr><th>Cấp</th><th>Ví dụ (Nike)</th></tr></thead><tbody>
<tr><td>Đề xuất</td><td>Thể thao dành cho bất kỳ ai quyết định thử</td></tr>
<tr><td>Ý tưởng lớn</td><td>"Just Do It" (ra mắt năm 1988 cùng Wieden+Kennedy)</td></tr>
<tr><td>Thể hiện</td><td>Nhiều phim, áp phích, câu chuyện vận động viên qua nhiều thập kỷ</td></tr></tbody></table>
<h4>USP</h4>
<p>Rosser Reeves mô tả <strong>lợi điểm bán hàng độc nhất</strong> vào những năm 1960: một lợi ích cụ thể, đối thủ không có, đủ mạnh để thúc đẩy người ta. Nó hiệu quả khi có khác biệt chức năng thật. Ở ngành đông đúc nơi sản phẩm giống nhau, thương hiệu thường dùng thêm ý tưởng cảm xúc hay xã hội.</p>
<h4>Điều gì làm ý tưởng "lớn"?</h4>
<ul><li><strong>Liên quan</strong> tới insight của đối tượng.</li>
<li><strong>Khác biệt</strong> với đối thủ cùng không gian.</li>
<li><strong>Đơn giản</strong>: mô tả được trong một dòng.</li>
<li><strong>Co giãn</strong>: dùng được cho phim, bài đăng, trưng bày tại cửa hàng, bài PR và sự kiện.</li>
<li><strong>Bền</strong>: chạy được hơn một chiến dịch.</li></ul>
<h4>Thử độ co giãn (hãy làm)</h4>
<p>Viết ý tưởng ở đầu trang, rồi liệt kê một sản phẩm cho mỗi trong bốn công cụ: video 15 giây, bài PR, vật phẩm tại cửa hàng, một tương tác mạng xã hội. Nếu không điền đủ bốn, ý tưởng đó là khẩu hiệu, không phải nền tảng. <em>Dumb Ways to Die</em> (Chương 1) đạt: bài hát, hoạt hình, báo chí, trò chơi và hiện diện thật tại ga.</p>
<h4>Tình huống khác: Share a Coke</h4>
<p><em>Share a Coke</em> của Coca-Cola bắt đầu ở Úc năm 2011 bằng việc in các tên riêng phổ biến lên chai. Ý tưởng đơn giản (tìm tên bạn, chia sẻ đồ uống), co giãn được (săn chai ở cửa hàng, bài đăng, lon cá nhân hoá) và sau được Coca-Cola điều chỉnh cho nhiều nước. Bản địa cần tên và phong tục địa phương, là lần đầu làm quen các vấn đề toàn cầu của IGI301.</p>`],
    pit: ['Confusing a slogan or a viral stunt with a big idea. If it cannot stretch beyond one piece, it is a tactic.', 'Nhầm khẩu hiệu hay trò gây sốt với ý tưởng lớn. Nếu không co giãn khỏi một sản phẩm thì đó là chiến thuật.'],
    s: [['Proposition → big idea → execution.', 'Đề xuất → ý tưởng lớn → cách thể hiện.'], ['A big idea is relevant, distinct, simple, stretchable, durable.', 'Ý tưởng lớn: liên quan, khác biệt, đơn giản, co giãn, bền.'], ['USP needs a real difference; otherwise add emotional or social ideas.', 'USP cần khác biệt thật; nếu không hãy thêm ý tưởng cảm xúc hay xã hội.']],
    l: ['usp', 'jdi', 'shareacoke', 'dumb'],
    p: [['Apply the stretch test to "Share a Coke": name one piece per tool.', 'Áp thử độ co giãn cho "Share a Coke": nêu một sản phẩm cho mỗi công cụ.', 'Names on bottles (product), social photo posts (digital), shop hunts and kiosks (in-store/event), news stories about the campaign (PR).', 'Tên trên chai (sản phẩm), bài ảnh mạng xã hội (số), săn chai và gian hàng (cửa hàng/sự kiện), bài báo về chiến dịch (PR).'],
        ['Why does a USP struggle in categories with near-identical products?', 'Vì sao USP khó trong ngành sản phẩm gần giống nhau?', 'There is no real functional difference to claim; brands must create meaning through ideas, experiences or associations.', 'Không có khác biệt chức năng thật để tuyên bố; thương hiệu phải tạo ý nghĩa qua ý tưởng, trải nghiệm hay liên tưởng.']] }),

  D(P + '4-2', '4.2 Appeals: rational, emotional, fear, humour', '4.2 Kiểu thu hút: lý trí, cảm xúc, sợ hãi, hài hước', 'Các kiểu thu hút thông điệp, khi nào dùng, rủi ro và chuẩn mực đạo đức cơ bản.', {
    n: '4.2',
    g: [['Name the main message appeals and when each fits', 'Gọi tên các kiểu thu hút chính và khi nào dùng'], ['Judge risks of fear and humour', 'Đánh giá rủi ro của sợ hãi và hài hước'], ['Choose an appeal for a given objective', 'Chọn kiểu thu hút cho một mục tiêu cho trước']],
    b: [`<p>An <strong>appeal</strong> is the reason the message gives the audience to care. Textbooks group them in two big families, often mixed.</p>
<h4>Rational appeals</h4>
<p>Facts, features, prices, comparisons, demonstrations, proof. Fit high-involvement purchases (Chapter 2). Risk: they can be dull and are easy for rivals to match.</p>
<h4>Emotional appeals</h4>
<p>Love, pride, belonging, nostalgia, joy, humour, fear, guilt. Emotion supports attention and memory, and fits low-involvement products and brand building. Risk: if the emotion has no link to the brand, people remember the story but not who it was for.</p>
<h4>Fear appeals</h4>
<p>They show a threat and a solution. Research on fear appeals suggests they work best at moderate intensity when the audience believes the threat is real <em>and</em> sees a doable action. Too strong a threat, or no clear action, makes people avoid or reject the message. Health and safety campaigns are the usual home.</p>
<h4>Humour</h4>
<p>It attracts attention and creates liking, particularly with younger audiences. Risks: the joke may overshadow the brand, may not travel across cultures, and humour that mocks a group can cause public backlash.</p>
<h4>Other devices</h4>
<ul><li><strong>Testimonial or endorsement</strong>: a customer, expert or celebrity. Choose someone whose credibility fits the claim.</li>
<li><strong>Slice of life</strong>: a short scene of the product in use.</li>
<li><strong>Sex appeal</strong>: common but often irrelevant and criticised; weigh the ethical and reputational cost.</li>
<li><strong>Social proof</strong>: "thousands of students already use it". Only claim numbers you can document.</li></ul>
<h4>Case: Dove Real Beauty</h4>
<p>Launched in 2004 by Dove (Unilever) with Ogilvy, the <em>Campaign for Real Beauty</em> used real women in place of professional models and a social message about beauty ideals. It combined advertising, films, public relations and a self-esteem programme. It also drew criticism, for example about the parent company's other brands, a reminder that an emotional appeal invites scrutiny of consistency.</p>`,
       `<p><strong>Kiểu thu hút (appeal)</strong> là lý do thông điệp đưa ra để khán giả quan tâm. Giáo trình gom thành hai họ lớn, thường trộn lẫn.</p>
<h4>Thu hút lý trí</h4>
<p>Dữ kiện, tính năng, giá, so sánh, trình diễn, bằng chứng. Hợp quyết định mua quan tâm cao (Chương 2). Rủi ro: dễ nhàm và đối thủ dễ sao chép.</p>
<h4>Thu hút cảm xúc</h4>
<p>Tình yêu, tự hào, thuộc về, hoài niệm, niềm vui, hài hước, sợ hãi, tội lỗi. Cảm xúc hỗ trợ chú ý và ghi nhớ, hợp sản phẩm quan tâm thấp và xây thương hiệu. Rủi ro: nếu cảm xúc không gắn với thương hiệu, người ta nhớ câu chuyện mà không nhớ nó dành cho ai.</p>
<h4>Thu hút bằng sợ hãi</h4>
<p>Cho thấy một mối đe doạ và một giải pháp. Nghiên cứu về thông điệp sợ hãi gợi ý chúng hiệu quả nhất ở cường độ vừa phải, khi khán giả tin mối đe doạ là thật <em>và</em> thấy một hành động làm được. Đe doạ quá mạnh hay không có hành động rõ ràng khiến người ta né hoặc bác bỏ thông điệp. Nơi quen thuộc là chiến dịch sức khoẻ và an toàn.</p>
<h4>Hài hước</h4>
<p>Thu hút chú ý và tạo thiện cảm, đặc biệt với khán giả trẻ. Rủi ro: trò đùa che mất thương hiệu, có thể không đi qua các nền văn hoá, và hài hước giễu cợt một nhóm có thể gây phản ứng dữ dội.</p>
<h4>Các thủ pháp khác</h4>
<ul><li><strong>Lời chứng thực hoặc người bảo chứng</strong>: khách hàng, chuyên gia hay người nổi tiếng. Chọn người có uy tín khớp với tuyên bố.</li>
<li><strong>Lát cắt cuộc sống</strong>: cảnh ngắn sản phẩm đang được dùng.</li>
<li><strong>Gợi dục</strong>: phổ biến nhưng thường không liên quan và bị chỉ trích; cân nhắc cái giá đạo đức và danh tiếng.</li>
<li><strong>Bằng chứng xã hội</strong>: "hàng nghìn sinh viên đã dùng". Chỉ tuyên bố con số bạn có tài liệu chứng minh.</li></ul>
<h4>Tình huống: Dove Real Beauty</h4>
<p>Ra mắt năm 2004 bởi Dove (Unilever) cùng Ogilvy, <em>Campaign for Real Beauty</em> dùng phụ nữ thật thay người mẫu chuyên nghiệp và một thông điệp xã hội về chuẩn mực sắc đẹp. Nó kết hợp quảng cáo, phim, quan hệ công chúng và chương trình nâng cao lòng tự trọng. Chiến dịch cũng bị chỉ trích, chẳng hạn về các thương hiệu khác của công ty mẹ, nhắc rằng thu hút cảm xúc kéo theo việc soi tính nhất quán.</p>`],
    pit: ['Using a strong fear appeal with no clear action. People switch off.', 'Dùng thông điệp sợ hãi mạnh mà không có hành động rõ ràng. Người ta tắt đi.'],
    s: [['Rational for high involvement; emotional for memory and low involvement.', 'Lý trí cho quan tâm cao; cảm xúc cho ghi nhớ và quan tâm thấp.'], ['Fear needs a believable threat and a doable action.', 'Sợ hãi cần mối đe doạ đáng tin và hành động làm được.'], ['Humour and social messages need brand fit and cultural care.', 'Hài hước và thông điệp xã hội cần hợp thương hiệu và lưu ý văn hoá.']],
    l: ['fear', 'dove', 'oldspice', 'placement'],
    p: [['Pick an appeal for a campaign to remind students to back up their files, and justify it.', 'Chọn kiểu thu hút cho chiến dịch nhắc sinh viên sao lưu dữ liệu và giải thích.', 'Light humour or a mild fear appeal ("the night before the deadline"), with a clear action (a 2-minute backup).', 'Hài hước nhẹ hoặc sợ hãi vừa phải ("đêm trước hạn nộp"), kèm hành động rõ (sao lưu 2 phút).'],
        ['Why did Dove Real Beauty invite scrutiny of consistency?', 'Vì sao Dove Real Beauty bị soi tính nhất quán?', 'A brand that makes a social claim is expected to behave consistently across its products and practices.', 'Thương hiệu đưa ra thông điệp xã hội bị kỳ vọng nhất quán trong sản phẩm và hành vi.']] }),

  D(P + '4-3', '4.3 Message structure and executional frameworks', '4.3 Cấu trúc thông điệp và khung thể hiện', 'Thứ tự lập luận, một mặt hay hai mặt, lặp lại, CTA, và đánh giá sản phẩm sáng tạo bằng tiêu chí.', {
    n: '4.3',
    g: [['Decide one-sided versus two-sided arguments', 'Quyết định lập luận một mặt hay hai mặt'], ['Write a clear call to action', 'Viết lời kêu gọi hành động rõ ràng'], ['Evaluate a creative piece with a checklist', 'Đánh giá một sản phẩm sáng tạo bằng danh sách kiểm']],
    b: [`<h4>Structure choices</h4>
<ul><li><strong>Conclusion drawn or left open</strong>: drawing the conclusion helps low-involvement audiences; leaving it open can persuade involved audiences who like to decide themselves.</li>
<li><strong>One-sided or two-sided</strong>: acknowledging a limit ("not the cheapest, but...") can raise credibility, especially with sceptical or well-informed audiences.</li>
<li><strong>Order</strong>: put the strongest point first if attention is low, or last if the audience is interested and will stay to the end.</li>
<li><strong>Repetition</strong>: familiarity builds through repeated exposure, but too much causes irritation. Vary the execution, keep the core idea (Chapter 8 returns to frequency).</li></ul>
<h4>Call to action</h4>
<p>A <strong>call to action</strong> tells people the next step. Make it single, specific and easy: "Scan, choose a time slot, done in 1 minute" beats "Learn more". Match the CTA to the stage: awareness content may ask for a follow or a share; purchase content asks for a click or a visit.</p>
<h4>Executional formats</h4>
<p>Demonstration, testimonial, slice of life, comparison, story, explainer, user-generated content. Choose the format that makes your proof visible.</p>
<h4>Evaluation checklist for a creative piece</h4>
<table><thead><tr><th>Question</th><th>Yes / no</th></tr></thead><tbody>
<tr><td>Does it deliver the single proposition within the first seconds?</td><td></td></tr>
<tr><td>Is the brand clearly recognisable (name, colours, voice)?</td><td></td></tr>
<tr><td>Is there a reason to believe?</td><td></td></tr>
<tr><td>Does it fit the objective and stage?</td><td></td></tr>
<tr><td>Is the CTA specific?</td><td></td></tr>
<tr><td>Is it consistent with other tools in the plan?</td><td></td></tr>
<tr><td>Is every claim true and documentable?</td><td></td></tr></tbody></table>
<p>The last line matters for law and trust. Rules about truthful claims, endorsements and use of personal data are covered in EPL201; at this level, simply never publish a claim you cannot support.</p>`,
       `<h4>Lựa chọn về cấu trúc</h4>
<ul><li><strong>Nêu kết luận hay để mở</strong>: nêu kết luận giúp khán giả quan tâm thấp; để mở có thể thuyết phục khán giả quan tâm cao thích tự quyết.</li>
<li><strong>Một mặt hay hai mặt</strong>: thừa nhận một hạn chế ("không rẻ nhất, nhưng...") có thể tăng uy tín, đặc biệt với khán giả hoài nghi hay am hiểu.</li>
<li><strong>Thứ tự</strong>: đặt ý mạnh nhất lên đầu nếu chú ý thấp, hoặc cuối nếu khán giả quan tâm và sẽ xem hết.</li>
<li><strong>Lặp lại</strong>: sự quen thuộc tăng nhờ lặp lại, nhưng quá nhiều gây khó chịu. Thay đổi cách thể hiện, giữ ý tưởng lõi (Chương 8 quay lại tần suất).</li></ul>
<h4>Lời kêu gọi hành động</h4>
<p><strong>Call to action</strong> cho người ta biết bước tiếp theo. Hãy làm nó duy nhất, cụ thể và dễ: "Quét mã, chọn khung giờ, xong trong 1 phút" tốt hơn "Tìm hiểu thêm". Khớp CTA với giai đoạn: nội dung nhận biết có thể xin theo dõi hay chia sẻ; nội dung mua hàng xin nhấp hay ghé cửa hàng.</p>
<h4>Định dạng thể hiện</h4>
<p>Trình diễn, lời chứng thực, lát cắt cuộc sống, so sánh, câu chuyện, giải thích, nội dung do người dùng tạo. Chọn định dạng làm bằng chứng của bạn thấy được.</p>
<h4>Danh sách kiểm cho một sản phẩm sáng tạo</h4>
<table><thead><tr><th>Câu hỏi</th><th>Có / không</th></tr></thead><tbody>
<tr><td>Có truyền đạt đề xuất đơn nhất trong vài giây đầu không?</td><td></td></tr>
<tr><td>Thương hiệu có nhận ra rõ (tên, màu, giọng) không?</td><td></td></tr>
<tr><td>Có lý do tin không?</td><td></td></tr>
<tr><td>Có khớp mục tiêu và giai đoạn không?</td><td></td></tr>
<tr><td>CTA có cụ thể không?</td><td></td></tr>
<tr><td>Có nhất quán với các công cụ khác trong kế hoạch không?</td><td></td></tr>
<tr><td>Mọi tuyên bố có đúng và chứng minh được không?</td><td></td></tr></tbody></table>
<p>Dòng cuối quan trọng cho pháp lý và lòng tin. Quy định về tuyên bố trung thực, bảo chứng và dùng dữ liệu cá nhân thuộc EPL201; ở mức này, chỉ cần không bao giờ đăng tuyên bố bạn không chứng minh được.</p>`],
    pit: ['A call to action such as "like, share, follow, comment, and buy" in one post. Offer one next step.', 'CTA kiểu "thích, chia sẻ, theo dõi, bình luận và mua" trong một bài. Chỉ nên có một bước tiếp theo.'],
    s: [['Choose conclusion, sidedness and order by audience involvement.', 'Chọn kết luận, số mặt, thứ tự theo mức quan tâm của khán giả.'], ['One specific, easy CTA matched to the stage.', 'Một CTA cụ thể, dễ, khớp giai đoạn.'], ['Use a checklist; every claim must be supportable.', 'Dùng danh sách kiểm; mọi tuyên bố phải chứng minh được.']],
    l: ['cta', 'cbrief', 'native'],
    p: [['Rewrite the CTA "Check us out!" for a free coding workshop on Saturday.', 'Viết lại CTA "Ghé xem nhé!" cho workshop lập trình miễn phí thứ Bảy.', 'For example: "Save a seat for Saturday 9:00: register in 1 minute at the link below."', 'Ví dụ: "Giữ chỗ cho thứ Bảy 9:00: đăng ký 1 phút tại đường dẫn bên dưới."'],
        ['When is a two-sided message useful?', 'Khi nào thông điệp hai mặt hữu ích?', 'With sceptical or well-informed audiences, where admitting a limit increases credibility.', 'Với khán giả hoài nghi hoặc am hiểu, khi thừa nhận hạn chế làm tăng uy tín.']] }),

  Q(P + 'quiz-4', 'Chapter 4 quiz — Message and creative strategy', 'Quiz Chương 4 — Thông điệp và chiến lược sáng tạo', [
    qq('The big idea differs from the proposition because it…', 'Ý tưởng lớn khác đề xuất ở chỗ nó…', ['Makes the proposition memorable and interesting|Làm đề xuất đáng nhớ và hấp dẫn', 'States the price|Nêu giá', 'Is the media plan|Là kế hoạch phương tiện', 'Is the budget|Là ngân sách'], 0, 'The proposition says what; the idea says how to make it stick.', 'Đề xuất nói điều gì; ý tưởng nói làm sao để nó đọng lại.'),
    qq('A "stretchable" idea means it…', 'Ý tưởng "co giãn" nghĩa là…', ['Costs more|Tốn kém hơn', 'Works across film, social, in-store, PR and events|Dùng được cho phim, mạng xã hội, cửa hàng, PR và sự kiện', 'Is very long|Rất dài', 'Changes every week|Đổi mỗi tuần'], 1, 'Stretch is the practical test for integration.', 'Co giãn là phép thử thực tế cho tích hợp.'),
    qq('Fear appeals work best when…', 'Thông điệp sợ hãi hiệu quả nhất khi…', ['The threat is extreme and no action is given|Mối đe doạ cực mạnh và không có hành động', 'The threat is believable and a doable action is shown|Mối đe doạ đáng tin và có hành động làm được', 'There is only humour|Chỉ có hài hước', 'The product is cheap|Sản phẩm rẻ'], 1, 'Threat plus efficacy.', 'Đe doạ cộng khả năng hành động.'),
    qq('Which product most needs rational appeals?', 'Sản phẩm nào cần thu hút lý trí nhất?', ['Chewing gum|Kẹo cao su', 'Health insurance|Bảo hiểm sức khoẻ', 'Mints|Kẹo bạc hà', 'Soft drink|Nước ngọt'], 1, 'High involvement and risk require facts.', 'Quan tâm cao và rủi ro cần dữ kiện.'),
    qq('A risk of humour is…', 'Một rủi ro của hài hước là…', ['The joke overshadows the brand|Trò đùa che mất thương hiệu', 'People remember too much|Người ta nhớ quá nhiều', 'It is always illegal|Luôn trái luật', 'It cannot be shared|Không chia sẻ được'], 0, 'Check the brand link and cultural fit.', 'Kiểm tra liên hệ với thương hiệu và sự phù hợp văn hoá.'),
    qq('The best call to action is…', 'Lời kêu gọi hành động tốt nhất là…', ['Several steps at once|Nhiều bước cùng lúc', 'One specific, easy step|Một bước cụ thể, dễ', 'No step|Không có bước nào', 'A long paragraph|Một đoạn dài'], 1, 'Simplicity increases action.', 'Đơn giản làm tăng hành động.'),
    qq('Which claim should you publish?', 'Bạn nên đăng tuyên bố nào?', ['"Used by thousands" without data|"Hàng nghìn người dùng" không có số liệu', 'A claim you can document|Tuyên bố bạn chứng minh được', 'Any claim a rival made|Tuyên bố bất kỳ đối thủ từng nêu', 'A made-up review|Một đánh giá bịa'], 1, 'Supportable claims protect trust and avoid legal issues.', 'Tuyên bố chứng minh được bảo vệ lòng tin và tránh rắc rối pháp lý.'),
    qq('Share a Coke illustrates…', 'Share a Coke minh hoạ…', ['A simple, stretchable idea adapted to local names|Một ý tưởng đơn giản, co giãn, thích nghi theo tên địa phương', 'A pure price cut|Giảm giá thuần tuý', 'Personal selling|Bán hàng trực tiếp', 'A trade show|Hội chợ thương mại'], 0, 'It started in Australia in 2011 and was adapted to many countries.', 'Bắt đầu ở Úc năm 2011 và được điều chỉnh cho nhiều nước.'),
  ]),
]));
// ===== Chương 5 =====
secs.push(SEC('Chapter 5 — Advertising and public relations', 'Chương 5 — Quảng cáo và quan hệ công chúng',
  'Vai trò, thế mạnh, hạn chế của quảng cáo, PR, quan hệ báo chí; khi nào dùng công cụ nào.', [
  D(P + '5-1', '5.1 Advertising: roles, strengths and limits', '5.1 Quảng cáo: vai trò, thế mạnh và hạn chế', 'Quảng cáo là gì, các loại, thế mạnh/hạn chế, vai trò theo giai đoạn.', {
    n: '5.1',
    g: [['Define advertising and list its main types', 'Định nghĩa quảng cáo và liệt kê các loại chính'], ['State strengths and limits compared with other tools', 'Nêu thế mạnh và hạn chế so với công cụ khác'], ['Match advertising roles to objectives', 'Ghép vai trò của quảng cáo với mục tiêu']],
    b: [`<p><strong>Advertising</strong> is paid, non-personal communication by an identified sponsor, carried by mass or targeted media. The three words matter: <em>paid</em> (you control placement and timing), <em>non-personal</em> (no live conversation) and <em>identified sponsor</em> (people know who is speaking).</p>
<h4>Main types</h4>
<ul><li><strong>Brand (image) advertising</strong>: builds long-term awareness and meaning.</li>
<li><strong>Response (direct-action) advertising</strong>: asks for a click, call or visit now.</li>
<li><strong>Retail and local advertising</strong>: promotes where to buy and offers nearby.</li>
<li><strong>Corporate and cause advertising</strong>: speaks for the organisation rather than a product.</li>
<li><strong>B2B and trade advertising</strong>: speaks to businesses and distributors.</li></ul>
<h4>Strengths and limits</h4>
<table><thead><tr><th>Strengths</th><th>Limits</th></tr></thead><tbody>
<tr><td>Wide reach at a low cost per person</td><td>High total cost for TV-scale reach</td></tr>
<tr><td>Full control of message, timing, repetition</td><td>Low credibility; audiences skip or doubt ads</td></tr>
<tr><td>Strong for building awareness and emotion</td><td>One-way; hard to answer individual questions</td></tr>
<tr><td>Can dramatise the product with sound, image, motion</td><td>Clutter: many ads compete for the same attention</td></tr></tbody></table>
<h4>Roles in the plan</h4>
<p>Advertising is usually the engine for <strong>awareness and mental availability</strong> and for reminding. For credibility use PR and reviews; for closing a sale use promotion, search and sales staff. Evidence that advertising pays off over time is collected in effectiveness databases such as the IPA's (links below); read their method notes before quoting numbers.</p>
<h4>Vietnam context</h4>
<p>Vietnamese brands use TV and out-of-home for mass reach, and short video, search and social platforms for targeted and response advertising. Heineken's seasonal Tet films are a well-known example of brand advertising built around a cultural moment; check the brand's own channels for current work and note the date when you cite it.</p>`,
       `<p><strong>Quảng cáo</strong> là truyền thông trả tiền, phi cá nhân, của một chủ thể xác định, qua phương tiện đại chúng hoặc nhắm chọn. Ba từ này quan trọng: <em>trả tiền</em> (bạn kiểm soát vị trí và thời điểm), <em>phi cá nhân</em> (không có hội thoại trực tiếp) và <em>chủ thể xác định</em> (người ta biết ai đang nói).</p>
<h4>Các loại chính</h4>
<ul><li><strong>Quảng cáo thương hiệu (hình ảnh)</strong>: xây nhận biết và ý nghĩa dài hạn.</li>
<li><strong>Quảng cáo phản hồi (hành động trực tiếp)</strong>: yêu cầu nhấp, gọi hay ghé ngay.</li>
<li><strong>Quảng cáo bán lẻ và địa phương</strong>: nói mua ở đâu và ưu đãi gần đó.</li>
<li><strong>Quảng cáo doanh nghiệp và vì mục đích</strong>: nói thay cho tổ chức thay vì sản phẩm.</li>
<li><strong>Quảng cáo B2B và thương mại</strong>: nói với doanh nghiệp và nhà phân phối.</li></ul>
<h4>Thế mạnh và hạn chế</h4>
<table><thead><tr><th>Thế mạnh</th><th>Hạn chế</th></tr></thead><tbody>
<tr><td>Phủ rộng với chi phí thấp trên mỗi người</td><td>Tổng chi phí cao nếu muốn phủ quy mô TV</td></tr>
<tr><td>Kiểm soát đầy đủ thông điệp, thời điểm, lặp lại</td><td>Độ tin cậy thấp; khán giả bỏ qua hoặc nghi ngờ</td></tr>
<tr><td>Mạnh để xây nhận biết và cảm xúc</td><td>Một chiều; khó trả lời câu hỏi cá nhân</td></tr>
<tr><td>Kịch tính hoá sản phẩm bằng âm thanh, hình ảnh, chuyển động</td><td>Lộn xộn: nhiều quảng cáo tranh cùng sự chú ý</td></tr></tbody></table>
<h4>Vai trò trong kế hoạch</h4>
<p>Quảng cáo thường là động cơ cho <strong>nhận biết, sự hiện diện trong tâm trí</strong> và nhắc nhớ. Muốn uy tín thì dùng PR và đánh giá; muốn chốt đơn thì dùng khuyến mãi, tìm kiếm và nhân viên bán hàng. Bằng chứng quảng cáo sinh lời theo thời gian được thu thập trong các cơ sở dữ liệu hiệu quả như của IPA (liên kết bên dưới); hãy đọc phần phương pháp trước khi trích con số.</p>
<h4>Bối cảnh Việt Nam</h4>
<p>Thương hiệu Việt dùng TV và quảng cáo ngoài trời để phủ đại chúng, còn video ngắn, tìm kiếm và nền tảng xã hội cho quảng cáo nhắm chọn và phản hồi. Các phim Tết theo mùa của Heineken là ví dụ quen thuộc về quảng cáo thương hiệu xây quanh một thời điểm văn hoá; hãy xem kênh chính thức của thương hiệu để biết tác phẩm hiện tại và ghi ngày khi trích dẫn.</p>`],
    pit: ['Judging brand advertising by same-week sales only. Its job is slower; match the metric to the job.', 'Đánh giá quảng cáo thương hiệu chỉ bằng doanh số cùng tuần. Việc của nó chậm hơn; hãy khớp chỉ số với nhiệm vụ.'],
    s: [['Advertising = paid, non-personal, identified sponsor.', 'Quảng cáo = trả tiền, phi cá nhân, chủ thể xác định.'], ['Strong reach and control; weak credibility and two-way contact.', 'Mạnh về phủ và kiểm soát; yếu về uy tín và tương tác hai chiều.'], ['Use advertising for awareness and reminding; add other tools for trust and closing.', 'Dùng quảng cáo cho nhận biết và nhắc nhớ; thêm công cụ khác cho niềm tin và chốt đơn.']],
    l: ['adv', 'adcamp', 'ooh', 'ipa'],
    p: [['Is a sponsored comment from an anonymous account "advertising" by the definition? Why?', 'Bình luận được tài trợ từ tài khoản ẩn danh có phải "quảng cáo" theo định nghĩa không? Vì sao?', 'It is paid and non-personal but the sponsor is not identified, which also raises ethical and legal issues.', 'Có trả tiền, phi cá nhân nhưng chủ thể không xác định, còn gây vấn đề đạo đức và pháp lý.'],
        ['Name one limit of advertising and a tool that complements it.', 'Nêu một hạn chế của quảng cáo và công cụ bổ sung.', 'Low credibility; PR or customer reviews add trust.', 'Uy tín thấp; PR hoặc đánh giá khách hàng bổ sung niềm tin.']] }),

  D(P + '5-2', '5.2 Public relations and publicity', '5.2 Quan hệ công chúng và publicity', 'PR khác quảng cáo thế nào, các hoạt động PR, thông cáo báo chí, tin giá trị.', {
    n: '5.2',
    g: [['Define PR and publicity and contrast them with advertising', 'Định nghĩa PR và publicity, đối chiếu với quảng cáo'], ['List the audiences and activities of PR', 'Liệt kê đối tượng và hoạt động của PR'], ['Judge whether a story is newsworthy', 'Đánh giá một câu chuyện có đáng làm tin không']],
    b: [`<p><strong>Public relations</strong> is the managed communication between an organisation and its publics (customers, employees, investors, media, communities) to build understanding and goodwill. The PRSA (link below) describes it as a strategic communication process for mutually beneficial relationships. <strong>Publicity</strong> is the part that gets coverage in media without the organisation buying the space.</p>
<h4>PR versus advertising</h4>
<table><thead><tr><th></th><th>Advertising</th><th>PR / publicity</th></tr></thead><tbody>
<tr><td>Space</td><td>Paid</td><td>Earned, not bought</td></tr>
<tr><td>Control</td><td>Full</td><td>Limited: journalists decide</td></tr>
<tr><td>Credibility</td><td>Lower</td><td>Higher when a third party reports</td></tr>
<tr><td>Cost per contact</td><td>Predictable</td><td>Often lower, less predictable</td></tr></tbody></table>
<h4>What PR does</h4>
<ul><li><strong>Media relations</strong>: building relationships with journalists, sending releases, pitching.</li>
<li><strong>Corporate communication</strong>: reports, statements, internal communication.</li>
<li><strong>Community and cause programmes</strong>: partnerships with schools, charities.</li>
<li><strong>Issue and crisis communication</strong>: staying ahead of problems (CRM301 covers this in depth).</li>
<li><strong>Thought leadership</strong>: expert articles, talks, research.</li></ul>
<h4>Is it news?</h4>
<p>Journalists look for: <em>timeliness</em>, <em>impact on many people</em>, <em>novelty</em>, <em>conflict or human interest</em>, <em>proximity</em>. A new store opening is rarely news; a new store that gives free coding classes for local pupils may be. Ask "who cares, other than us?".</p>
<h4>A Vietnamese example</h4>
<p>Vinamilk's "Quỹ sữa Vươn cao Việt Nam", a programme giving milk to children in difficult circumstances, has run since 2008 according to the company. It is a long-running community programme that doubles as PR; check the company's site for current scope and figures, and use the company's own wording when you cite numbers.</p>`,
       `<p><strong>Quan hệ công chúng</strong> là truyền thông có quản lý giữa tổ chức và các nhóm công chúng của nó (khách hàng, nhân viên, nhà đầu tư, báo chí, cộng đồng) để xây dựng sự thấu hiểu và thiện chí. PRSA (liên kết bên dưới) mô tả đó là quá trình truyền thông chiến lược nhằm các mối quan hệ cùng có lợi. <strong>Publicity</strong> là phần được đưa tin trên báo chí mà tổ chức không mua chỗ.</p>
<h4>PR so với quảng cáo</h4>
<table><thead><tr><th></th><th>Quảng cáo</th><th>PR / publicity</th></tr></thead><tbody>
<tr><td>Chỗ đăng</td><td>Trả tiền</td><td>Kiếm được, không mua</td></tr>
<tr><td>Kiểm soát</td><td>Đầy đủ</td><td>Hạn chế: nhà báo quyết định</td></tr>
<tr><td>Uy tín</td><td>Thấp hơn</td><td>Cao hơn khi bên thứ ba đưa tin</td></tr>
<tr><td>Chi phí mỗi tiếp xúc</td><td>Dự đoán được</td><td>Thường thấp hơn, khó dự đoán</td></tr></tbody></table>
<h4>PR làm gì</h4>
<ul><li><strong>Quan hệ báo chí</strong>: xây quan hệ với nhà báo, gửi thông cáo, pitching.</li>
<li><strong>Truyền thông doanh nghiệp</strong>: báo cáo, tuyên bố, truyền thông nội bộ.</li>
<li><strong>Chương trình cộng đồng và vì mục đích</strong>: hợp tác với trường học, tổ chức từ thiện.</li>
<li><strong>Truyền thông vấn đề và khủng hoảng</strong>: đi trước sự cố (CRM301 học sâu phần này).</li>
<li><strong>Dẫn dắt tư tưởng</strong>: bài viết chuyên gia, bài nói, nghiên cứu.</li></ul>
<h4>Có phải là tin?</h4>
<p>Nhà báo tìm: <em>tính thời sự</em>, <em>tác động tới nhiều người</em>, <em>mới lạ</em>, <em>xung đột hoặc câu chuyện con người</em>, <em>gần gũi</em>. Khai trương một cửa hàng hiếm khi là tin; cửa hàng dạy lập trình miễn phí cho học sinh địa phương thì có thể. Hãy hỏi "ngoài mình ra, ai quan tâm?".</p>
<h4>Một ví dụ Việt Nam</h4>
<p>"Quỹ sữa Vươn cao Việt Nam" của Vinamilk, chương trình tặng sữa cho trẻ em có hoàn cảnh khó khăn, theo công ty đã chạy từ năm 2008. Đây là chương trình cộng đồng dài hạn đồng thời đóng vai trò PR; hãy xem trang của công ty để biết phạm vi và số liệu hiện tại, và dùng cách diễn đạt của công ty khi trích con số.</p>`],
    pit: ['Sending a press release that is an advertisement in disguise. Editors delete them; offer facts, people and a reason to care.', 'Gửi thông cáo thực chất là quảng cáo trá hình. Biên tập viên xoá; hãy đưa dữ kiện, con người và lý do để quan tâm.'],
    s: [['PR earns attention and credibility; publicity is the media coverage part.', 'PR kiếm sự chú ý và uy tín; publicity là phần được đưa tin.'], ['You lose control over how the story is told.', 'Bạn mất kiểm soát cách câu chuyện được kể.'], ['Newsworthiness: timely, impactful, novel, human, close.', 'Giá trị tin: thời sự, tác động, mới lạ, con người, gần gũi.']],
    l: ['pr', 'prsa', 'press', 'vinamilk'],
    p: [['Is "We opened a new branch" newsworthy? How could you make it so?', '"Chúng tôi khai trương chi nhánh mới" có là tin không? Làm sao để thành tin?', 'Rarely. Add an angle: jobs for local students, a first-of-its-kind service, or a community partnership.', 'Hiếm khi. Thêm góc tiếp cận: việc làm cho sinh viên địa phương, dịch vụ lần đầu có, hoặc hợp tác cộng đồng.'],
        ['Give two differences between advertising and publicity.', 'Nêu hai khác biệt giữa quảng cáo và publicity.', 'Advertising is paid and controlled; publicity is earned, less controlled, more credible.', 'Quảng cáo trả tiền và kiểm soát; publicity kiếm được, ít kiểm soát, đáng tin hơn.']] }),

  D(P + '5-3', '5.3 Media relations in practice', '5.3 Quan hệ báo chí trong thực hành', 'Viết thông cáo báo chí, pitch, chuẩn bị phát ngôn, đo kết quả PR.', {
    n: '5.3',
    g: [['Write a press release in the inverted pyramid form', 'Viết thông cáo báo chí theo kim tự tháp ngược'], ['Pitch a journalist in five lines', 'Pitch nhà báo trong năm dòng'], ['Choose basic PR measures', 'Chọn thước đo PR cơ bản']],
    b: [`<h4>Press release (inverted pyramid)</h4>
<ol><li><strong>Headline</strong>: the news in one line, facts not slogans.</li>
<li><strong>First paragraph</strong>: who, what, when, where, why.</li>
<li><strong>Supporting facts</strong>: numbers with sources, context.</li>
<li><strong>Quote</strong>: one useful sentence from a named person.</li>
<li><strong>Boilerplate and contact</strong>: a short company description and a person to call.</li></ol>
<p>Put the most important facts first; editors cut from the bottom. Add dates and a spokesperson who can answer questions the same day.</p>
<h4>Pitch in five lines</h4>
<ol><li>Subject: what the story is, not who you are.</li><li>Why their readers care now.</li><li>Your evidence or access (data, people, images).</li><li>The ask and deadline.</li><li>Contact details.</li></ol>
<p>Read what the journalist recently wrote and mention a related piece. Mass-sending the same text to every outlet usually fails.</p>
<h4>Spokesperson basics</h4>
<p>Prepare three key messages and one proof for each; answer the question asked, then bridge to your message; never say "no comment" without a reason; never guess figures. In sensitive situations coordinate with legal and leadership first (EPL201, CRM301).</p>
<h4>Measuring PR</h4>
<p>Counting clippings alone is weak. Better set: placements in the right outlets, share of coverage carrying your key message, tone, referral traffic, and, where possible, survey change in knowledge or attitude. Do not use the old "advertising value equivalent" as proof of effect; it compares unlike things and the profession has criticised it for years.</p>
<div class="callout"><strong>Example exercise.</strong> Take the career-day event of Chapter 3 and write a 120-word release and a 5-line pitch to the university newsroom. Mark each fact "confirmed" or "to confirm".</div>`,
       `<h4>Thông cáo báo chí (kim tự tháp ngược)</h4>
<ol><li><strong>Tiêu đề</strong>: tin trong một dòng, dữ kiện chứ không khẩu hiệu.</li>
<li><strong>Đoạn đầu</strong>: ai, gì, khi nào, ở đâu, vì sao.</li>
<li><strong>Dữ kiện hỗ trợ</strong>: con số có nguồn, bối cảnh.</li>
<li><strong>Trích dẫn</strong>: một câu hữu ích của một người có tên.</li>
<li><strong>Giới thiệu ngắn và liên hệ</strong>: mô tả công ty ngắn và người để gọi.</li></ol>
<p>Đặt dữ kiện quan trọng nhất lên đầu; biên tập viên cắt từ cuối lên. Thêm ngày tháng và người phát ngôn có thể trả lời câu hỏi ngay trong ngày.</p>
<h4>Pitch trong năm dòng</h4>
<ol><li>Chủ đề thư: câu chuyện là gì, không phải bạn là ai.</li><li>Vì sao độc giả của họ quan tâm lúc này.</li><li>Bằng chứng hay khả năng tiếp cận của bạn (dữ liệu, nhân vật, hình ảnh).</li><li>Đề nghị và thời hạn.</li><li>Thông tin liên hệ.</li></ol>
<p>Đọc bài nhà báo viết gần đây và nhắc một bài liên quan. Gửi hàng loạt cùng một nội dung cho mọi tờ báo thường thất bại.</p>
<h4>Cơ bản về người phát ngôn</h4>
<p>Chuẩn bị ba thông điệp chính và một bằng chứng cho mỗi cái; trả lời câu hỏi được hỏi rồi chuyển sang thông điệp của mình; không nói "không bình luận" mà không có lý do; không đoán con số. Trong tình huống nhạy cảm, phối hợp với pháp lý và lãnh đạo trước (EPL201, CRM301).</p>
<h4>Đo PR</h4>
<p>Chỉ đếm bài cắt báo là yếu. Bộ tốt hơn: số bài ở đúng tờ báo, tỷ lệ bài mang thông điệp chính, sắc thái, lượng truy cập giới thiệu và, nếu được, thay đổi hiểu biết hay thái độ qua khảo sát. Đừng dùng "giá trị quảng cáo tương đương" làm bằng chứng hiệu quả; nó so sánh những thứ khác nhau và giới chuyên môn đã chỉ trích nhiều năm.</p>
<div class="callout"><strong>Bài tập ví dụ.</strong> Lấy sự kiện ngày hội nghề nghiệp ở Chương 3, viết thông cáo 120 từ và pitch 5 dòng gửi ban truyền thông của trường. Đánh dấu mỗi dữ kiện "đã xác nhận" hay "cần xác nhận".</div>`],
    pit: ['Inventing a quote or a number "to make it stronger". Everything in a release must be true and approved.', 'Bịa lời trích hay con số "cho mạnh hơn". Mọi thứ trong thông cáo phải đúng và được duyệt.'],
    s: [['Inverted pyramid: key facts first.', 'Kim tự tháp ngược: dữ kiện chính trước.'], ['Pitch with relevance, evidence and a clear ask.', 'Pitch có liên quan, bằng chứng và đề nghị rõ.'], ['Measure placements, message pull-through, tone and attitude change, not clippings alone.', 'Đo bài đăng, tỷ lệ mang thông điệp, sắc thái và thay đổi thái độ, không chỉ số bài.']],
    l: ['press', 'media_rel', 'corp', 'crisis'],
    p: [['Rewrite a headline "Amazing new app changes everything!" as a factual headline.', 'Viết lại tiêu đề "Ứng dụng mới tuyệt vời thay đổi mọi thứ!" thành tiêu đề dữ kiện.', 'For example: "Student team launches free app to find part-time jobs in Hanoi" (if true).', 'Ví dụ: "Nhóm sinh viên ra mắt ứng dụng miễn phí tìm việc làm thêm ở Hà Nội" (nếu đúng).'],
        ['Why is counting articles a weak PR metric?', 'Vì sao đếm số bài là thước đo PR yếu?', 'It ignores outlet relevance, message, tone and audience effect.', 'Nó bỏ qua độ phù hợp của tờ báo, thông điệp, sắc thái và hiệu ứng lên khán giả.']] }),

  Q(P + 'quiz-5', 'Chapter 5 quiz — Advertising and PR', 'Quiz Chương 5 — Quảng cáo và PR', [
    qq('Advertising is defined as communication that is…', 'Quảng cáo được định nghĩa là truyền thông…', ['Free, personal and anonymous|Miễn phí, cá nhân, ẩn danh', 'Paid, non-personal, by an identified sponsor|Trả tiền, phi cá nhân, của chủ thể xác định', 'Only on TV|Chỉ trên TV', 'Only online|Chỉ trực tuyến'], 1, 'These three features are the core definition.', 'Ba đặc điểm này là định nghĩa cốt lõi.'),
    qq('A key strength of advertising is…', 'Thế mạnh chính của quảng cáo là…', ['Full control over message and timing|Kiểm soát đầy đủ thông điệp và thời điểm', 'Highest credibility|Uy tín cao nhất', 'No cost|Không tốn tiền', 'Two-way conversation|Hội thoại hai chiều'], 0, 'You pay and therefore decide.', 'Bạn trả tiền nên bạn quyết định.'),
    qq('Which tool usually gives the highest third-party credibility?', 'Công cụ nào thường có uy tín bên thứ ba cao nhất?', ['Paid ad|Quảng cáo trả tiền', 'Publicity in credible media|Publicity trên phương tiện đáng tin', 'Coupon|Phiếu giảm giá', 'Email blast|Email hàng loạt'], 1, 'A journalist reporting it is independent.', 'Nhà báo đưa tin là độc lập.'),
    qq('Publicity is…', 'Publicity là…', ['Media coverage not bought by the organisation|Đưa tin trên phương tiện mà tổ chức không mua', 'A paid banner|Banner trả tiền', 'A discount|Giảm giá', 'A sales call|Cuộc gọi bán hàng'], 0, 'It is earned coverage.', 'Đó là độ phủ kiếm được.'),
    qq('Which is NOT a news value?', 'Đâu KHÔNG phải giá trị tin?', ['Timeliness|Tính thời sự', 'Impact|Tác động', 'Our logo is new|Logo của chúng tôi mới', 'Human interest|Câu chuyện con người'], 2, 'A logo change by itself rarely interests the public.', 'Chỉ đổi logo hiếm khi làm công chúng quan tâm.'),
    qq('In an inverted-pyramid release the most important facts go…', 'Trong thông cáo kim tự tháp ngược, dữ kiện quan trọng nhất đặt…', ['At the end|Ở cuối', 'At the start|Ở đầu', 'In the footnote|Ở chú thích', 'In the logo|Trong logo'], 1, 'Editors cut from the bottom.', 'Biên tập cắt từ dưới lên.'),
    qq('Which is a better PR measure than clipping count alone?', 'Đâu là thước đo PR tốt hơn chỉ đếm số bài?', ['Share of coverage carrying the key message|Tỷ lệ bài mang thông điệp chính', 'Number of staff|Số nhân viên', 'Office size|Diện tích văn phòng', 'Logo colour|Màu logo'], 0, 'Message pull-through links PR to objectives.', 'Tỷ lệ mang thông điệp nối PR với mục tiêu.'),
    qq('Deep crisis and legal topics from this chapter are taught in…', 'Các chủ đề khủng hoảng và pháp lý sâu của chương này được dạy ở…', ['CRM301 and EPL201|CRM301 và EPL201', 'BRA201 only|Chỉ BRA201', 'No subject|Không môn nào', 'IMC201 Chapter 9|IMC201 Chương 9'], 0, 'They are later subjects in the IMC track.', 'Đó là các môn sau trong lộ trình IMC.'),
  ]),
]));
// ===== Chương 6 =====
secs.push(SEC('Chapter 6 — Sales promotion, direct marketing and personal selling', 'Chương 6 — Khuyến mãi, marketing trực tiếp và bán hàng trực tiếp',
  'Các công cụ kích hành động: khuyến mãi người tiêu dùng và thương mại, marketing trực tiếp, bán hàng trực tiếp.', [
  D(P + '6-1', '6.1 Sales promotion', '6.1 Khuyến mãi (sales promotion)', 'Khuyến mãi người tiêu dùng và thương mại, ưu và nhược, tác hại của khuyến mãi quá nhiều.', {
    n: '6.1',
    g: [['Separate consumer and trade promotions', 'Phân biệt khuyến mãi người tiêu dùng và khuyến mãi thương mại'], ['Match techniques to objectives', 'Ghép kỹ thuật với mục tiêu'], ['Explain the long-term risk of over-promotion', 'Giải thích rủi ro dài hạn của khuyến mãi quá mức']],
    b: [`<p><strong>Sales promotion</strong> is a set of short-term incentives that add extra value to give people a reason to act now. Where advertising says "here is why", promotion says "here is why now".</p>
<h4>Consumer promotions</h4>
<table><thead><tr><th>Technique</th><th>Typical goal</th><th>Watch out for</th></tr></thead><tbody>
<tr><td>Coupons and vouchers</td><td>Trial, bring lapsed buyers back</td><td>Subsidising people who would buy anyway</td></tr>
<tr><td>Sampling</td><td>Trial of a new product</td><td>Cost per sample vs how many convert</td></tr>
<tr><td>Price-off, bundle, buy one get one</td><td>Volume, clear stock</td><td>Teaches people to wait for discounts</td></tr>
<tr><td>Contests and sweepstakes</td><td>Participation, data capture</td><td>Legal rules for prizes and data; low brand relevance</td></tr>
<tr><td>Premiums, gifts with purchase</td><td>Differentiate, add perceived value</td><td>Gift must fit the brand</td></tr>
<tr><td>Loyalty programmes</td><td>Repeat purchase, data</td><td>Complexity; points liabilities</td></tr></tbody></table>
<h4>Trade promotions</h4>
<p>Aimed at distributors and retailers: discounts, display allowances, training, contests for sales staff. They aim to get shelf space, prominent display, and push through the channel. In Vietnam, where traditional trade and modern retail coexist, display and sales-force incentives often matter as much as consumer offers.</p>
<h4>The promotion trap</h4>
<p>Promotions can lift sales quickly but, repeated often, they train customers to buy only on deal, erode price perception and weaken the brand message from the first chapter's integration point of view. A rule of thumb: <em>use promotion to give a reason to act now, not to be the only reason to buy</em>. Measure the lift against a baseline period or a control group, subtract cannibalised sales and costs.</p>
<div class="formula"><span class="lbl">Simple promotion check (hypothetical)</span>Extra units = units during promotion − baseline units. Extra profit = extra units × margin per unit − promotion cost.</div>
<p>Hypothetical numbers: baseline 1,000 units a week, promo week 1,600 units, margin 8,000 VND on promo price, promo cost 2,000,000 VND. Extra units 600; 600 × 8,000 = 4,800,000; minus 2,000,000 gives 2,800,000 VND extra, <em>before</em> counting the dip in the weeks afterwards.</p>`,
       `<p><strong>Khuyến mãi</strong> là tập hợp các ưu đãi ngắn hạn thêm giá trị để cho người ta lý do hành động ngay. Nếu quảng cáo nói "đây là lý do", thì khuyến mãi nói "đây là lý do lúc này".</p>
<h4>Khuyến mãi cho người tiêu dùng</h4>
<table><thead><tr><th>Kỹ thuật</th><th>Mục tiêu điển hình</th><th>Lưu ý</th></tr></thead><tbody>
<tr><td>Phiếu giảm giá, voucher</td><td>Dùng thử, kéo người bỏ đi quay lại</td><td>Trợ giá cho người vốn đã mua</td></tr>
<tr><td>Phát mẫu thử</td><td>Dùng thử sản phẩm mới</td><td>Chi phí mỗi mẫu so với số người chuyển đổi</td></tr>
<tr><td>Giảm giá, combo, mua một tặng một</td><td>Sản lượng, xả hàng</td><td>Dạy người ta chờ giảm giá</td></tr>
<tr><td>Cuộc thi, quay thưởng</td><td>Tham gia, thu dữ liệu</td><td>Quy định pháp lý về giải thưởng và dữ liệu; ít liên quan thương hiệu</td></tr>
<tr><td>Quà tặng kèm</td><td>Tạo khác biệt, tăng giá trị cảm nhận</td><td>Quà phải hợp thương hiệu</td></tr>
<tr><td>Chương trình thân thiết</td><td>Mua lại, dữ liệu</td><td>Phức tạp; nghĩa vụ điểm</td></tr></tbody></table>
<h4>Khuyến mãi thương mại</h4>
<p>Nhắm tới nhà phân phối và nhà bán lẻ: chiết khấu, hỗ trợ trưng bày, đào tạo, thi đua cho nhân viên bán hàng. Mục đích là có chỗ trên kệ, trưng bày nổi bật và đẩy hàng qua kênh. Ở Việt Nam, nơi kênh truyền thống và bán lẻ hiện đại cùng tồn tại, trưng bày và khuyến khích lực lượng bán hàng thường quan trọng không kém ưu đãi cho người tiêu dùng.</p>
<h4>Cái bẫy khuyến mãi</h4>
<p>Khuyến mãi có thể tăng doanh số nhanh nhưng lặp lại nhiều sẽ dạy khách chỉ mua khi có ưu đãi, làm xói mòn nhận thức về giá và làm yếu thông điệp thương hiệu. Quy tắc ngón tay cái: <em>dùng khuyến mãi để cho lý do hành động ngay, không để làm lý do duy nhất để mua</em>. Đo mức tăng so với giai đoạn nền hoặc nhóm đối chứng, trừ doanh số bị ăn lẫn nhau và chi phí.</p>
<div class="formula"><span class="lbl">Kiểm tra khuyến mãi đơn giản (giả định)</span>Đơn vị tăng thêm = đơn vị trong khuyến mãi − đơn vị nền. Lợi nhuận tăng thêm = đơn vị tăng thêm × biên lợi nhuận mỗi đơn vị − chi phí khuyến mãi.</div>
<p>Số giả định: nền 1.000 đơn vị mỗi tuần, tuần khuyến mãi 1.600, biên lợi nhuận 8.000 đồng ở giá khuyến mãi, chi phí 2.000.000 đồng. Đơn vị tăng thêm 600; 600 × 8.000 = 4.800.000; trừ 2.000.000 còn 2.800.000 đồng, <em>chưa tính</em> mức sụt trong những tuần sau đó.</p>`],
    pit: ['Judging a promotion by units sold only. Subtract the baseline, the cost and the post-promo dip.', 'Đánh giá khuyến mãi chỉ bằng số lượng bán. Hãy trừ mức nền, chi phí và mức sụt sau khuyến mãi.'],
    s: [['Promotion = short-term incentive; reason to act now.', 'Khuyến mãi = ưu đãi ngắn hạn; lý do hành động ngay.'], ['Consumer promotions pull; trade promotions push through the channel.', 'Khuyến mãi người tiêu dùng kéo; khuyến mãi thương mại đẩy qua kênh.'], ['Over-promotion trains deal-seeking and hurts the brand; measure incremental profit.', 'Khuyến mãi quá mức dạy khách săn ưu đãi và hại thương hiệu; đo lợi nhuận tăng thêm.']],
    l: ['salespromo', 'coupon', 'loyal'],
    p: [['Using the formula, baseline 500 units, promo 800 units, margin 5,000 VND, promo cost 1,000,000 VND. Extra profit?', 'Dùng công thức, nền 500 đơn vị, khuyến mãi 800, biên 5.000 đồng, chi phí 1.000.000 đồng. Lợi nhuận tăng thêm?', '300 × 5,000 = 1,500,000; minus 1,000,000 = 500,000 VND (before the post-promo dip).', '300 × 5.000 = 1.500.000; trừ 1.000.000 = 500.000 đồng (chưa tính mức sụt sau khuyến mãi).'],
        ['Why might a brand with a premium image avoid frequent discounts?', 'Vì sao thương hiệu cao cấp tránh giảm giá thường xuyên?', 'Frequent discounts lower perceived value and train customers to wait for deals.', 'Giảm giá thường xuyên hạ giá trị cảm nhận và dạy khách chờ ưu đãi.']] }),

  D(P + '6-2', '6.2 Direct marketing', '6.2 Marketing trực tiếp', 'Đặc điểm của marketing trực tiếp, cơ sở dữ liệu, kênh, đo lường theo phản hồi, quyền riêng tư ở mức nhập môn.', {
    n: '6.2',
    g: [['Define direct marketing and its features', 'Định nghĩa marketing trực tiếp và đặc điểm'], ['Explain how a customer list and testing work', 'Giải thích danh sách khách hàng và thử nghiệm'], ['Respect consent at a basic level', 'Tôn trọng sự đồng ý ở mức cơ bản']],
    b: [`<p><strong>Direct marketing</strong> communicates directly with chosen individuals to get a measurable response. Typical channels: mail, email, SMS and messaging apps, phone, catalogues, direct-response TV, and today targeted digital formats. Three features set it apart: <em>targeted</em> (specific people), <em>interactive</em> (a response is possible) and <em>measurable</em> (you know who responded).</p>
<h4>The customer database</h4>
<p>A simple database of customers and prospects, with source, consent, history and preferences, powers direct marketing. Quality beats size: 2,000 correct, consenting contacts beat 20,000 doubtful ones. Segment by recency, frequency and monetary value (RFM): who bought recently, often and for how much? Recent frequent buyers deserve a thank-you and early access, lapsed ones a "we miss you" offer.</p>
<h4>Offer, creative, list, timing</h4>
<p>Direct marketers say response depends first on the <strong>list</strong> (who), then the <strong>offer</strong> (what), then the <strong>creative</strong> (how), then <strong>timing</strong>. Test one variable at a time: two subject lines to two random halves of the list (A/B test, Chapter 9).</p>
<table><thead><tr><th>Metric</th><th>Meaning</th><th>Calculation</th></tr></thead><tbody>
<tr><td>Response rate</td><td>Share who responded</td><td>responses ÷ contacts</td></tr>
<tr><td>Cost per response</td><td>Cost to get one response</td><td>total cost ÷ responses</td></tr>
<tr><td>Conversion rate</td><td>Share who bought</td><td>buyers ÷ contacts (or ÷ responders)</td></tr></tbody></table>
<h4>Consent and respect</h4>
<p>People expect to choose whether you contact them. Always get permission, tell them how data will be used, make unsubscribing easy and do not buy random lists. Rules differ by country and change; this course only sets the habit. Details on privacy law and ethics belong to EPL201.</p>
<h4>Direct marketing in an IMC plan</h4>
<p>It turns interest created by advertising and PR into action, and keeps customers after the sale. Email, for example, can send the same core message as the campaign with a personal offer. Use the same tone and visual identity so the channel does not feel like a different company.</p>`,
       `<p><strong>Marketing trực tiếp</strong> truyền thông trực tiếp với những cá nhân được chọn để nhận phản hồi đo được. Kênh điển hình: thư, email, SMS và ứng dụng nhắn tin, điện thoại, catalogue, quảng cáo TV phản hồi trực tiếp và ngày nay là các định dạng số nhắm chọn. Ba đặc điểm khác biệt: <em>nhắm chọn</em> (người cụ thể), <em>tương tác</em> (có thể phản hồi) và <em>đo được</em> (biết ai phản hồi).</p>
<h4>Cơ sở dữ liệu khách hàng</h4>
<p>Một cơ sở dữ liệu đơn giản về khách hàng và khách tiềm năng, kèm nguồn, sự đồng ý, lịch sử và sở thích, vận hành marketing trực tiếp. Chất lượng hơn số lượng: 2.000 liên hệ đúng và đã đồng ý tốt hơn 20.000 liên hệ đáng ngờ. Phân khúc theo recency, frequency, monetary (RFM): ai mua gần đây, thường xuyên và với giá trị bao nhiêu? Người mua gần đây và thường xuyên xứng đáng được cảm ơn và ưu tiên sớm, người đã ngừng thì nhận ưu đãi "nhớ bạn".</p>
<h4>Ưu đãi, sáng tạo, danh sách, thời điểm</h4>
<p>Người làm marketing trực tiếp nói phản hồi phụ thuộc trước hết vào <strong>danh sách</strong> (ai), rồi <strong>ưu đãi</strong> (gì), rồi <strong>sáng tạo</strong> (thế nào), rồi <strong>thời điểm</strong>. Thử một biến mỗi lần: hai tiêu đề thư cho hai nửa ngẫu nhiên của danh sách (thử nghiệm A/B, Chương 9).</p>
<table><thead><tr><th>Chỉ số</th><th>Ý nghĩa</th><th>Cách tính</th></tr></thead><tbody>
<tr><td>Tỷ lệ phản hồi</td><td>Tỷ lệ người phản hồi</td><td>phản hồi ÷ liên hệ</td></tr>
<tr><td>Chi phí mỗi phản hồi</td><td>Chi phí để có một phản hồi</td><td>tổng chi phí ÷ phản hồi</td></tr>
<tr><td>Tỷ lệ chuyển đổi</td><td>Tỷ lệ người mua</td><td>người mua ÷ liên hệ (hoặc ÷ người phản hồi)</td></tr></tbody></table>
<h4>Đồng ý và tôn trọng</h4>
<p>Mọi người kỳ vọng được chọn có cho bạn liên hệ hay không. Luôn xin phép, nói rõ dữ liệu sẽ được dùng thế nào, cho phép huỷ đăng ký dễ dàng và không mua danh sách ngẫu nhiên. Quy định khác nhau theo nước và thay đổi; khoá này chỉ đặt thói quen. Chi tiết luật quyền riêng tư và đạo đức thuộc EPL201.</p>
<h4>Marketing trực tiếp trong kế hoạch IMC</h4>
<p>Nó biến sự quan tâm do quảng cáo và PR tạo ra thành hành động, và giữ khách sau bán. Email, chẳng hạn, có thể gửi cùng thông điệp lõi của chiến dịch kèm ưu đãi cá nhân. Dùng cùng giọng điệu và nhận diện hình ảnh để kênh không giống một công ty khác.</p>`],
    pit: ['Mass-emailing a purchased list. It damages sender reputation and trust, and may be unlawful.', 'Gửi email hàng loạt tới danh sách mua về. Hại uy tín người gửi, lòng tin và có thể trái luật.'],
    s: [['Direct marketing is targeted, interactive, measurable.', 'Marketing trực tiếp: nhắm chọn, tương tác, đo được.'], ['A clean, consented database and RFM segments drive results.', 'Cơ sở dữ liệu sạch, có đồng ý và phân khúc RFM tạo kết quả.'], ['Test one variable at a time; track response, cost per response, conversion.', 'Thử một biến mỗi lần; theo dõi phản hồi, chi phí mỗi phản hồi, chuyển đổi.']],
    l: ['direct', 'email', 'tele', 'ab'],
    p: [['A mailing costs 5,000,000 VND to 5,000 contacts, with 150 responses. Response rate and cost per response?', 'Một đợt gửi tốn 5.000.000 đồng cho 5.000 liên hệ, có 150 phản hồi. Tỷ lệ phản hồi và chi phí mỗi phản hồi?', '150 ÷ 5,000 = 3%; 5,000,000 ÷ 150 ≈ 33,333 VND.', '150 ÷ 5.000 = 3%; 5.000.000 ÷ 150 ≈ 33.333 đồng.'],
        ['Why test with a random split?', 'Vì sao thử bằng chia ngẫu nhiên?', 'So that the difference in results comes from the tested variable, not from different kinds of people.', 'Để khác biệt kết quả đến từ biến được thử, không phải từ loại người khác nhau.']] }),

  D(P + '6-3', '6.3 Personal selling', '6.3 Bán hàng trực tiếp (personal selling)', 'Vai trò của bán hàng trực tiếp, các bước bán hàng, kết nối với IMC, đo lường.', {
    n: '6.3',
    g: [['Describe when personal selling is the best tool', 'Mô tả khi nào bán hàng trực tiếp là công cụ tốt nhất'], ['List the steps of the selling process', 'Liệt kê các bước của quy trình bán hàng'], ['Connect sales staff to the IMC plan', 'Nối nhân viên bán hàng với kế hoạch IMC']],
    b: [`<p><strong>Personal selling</strong> is two-way, person-to-person communication to persuade a buyer. It is the most flexible tool: a salesperson hears objections, adapts, and closes. It is also the most expensive per contact, so it is used where purchases are complex, high-value, or need trust: business-to-business (B2B) deals, real estate, insurance, cars, education consulting.</p>
<h4>The selling process</h4>
<ol><li><strong>Prospecting</strong>: finding likely buyers.</li>
<li><strong>Preparation</strong>: research the person or company, set a call objective.</li>
<li><strong>Approach</strong>: first contact with a relevant opening.</li>
<li><strong>Needs discovery and presentation</strong>: ask first, then connect benefits to needs.</li>
<li><strong>Handling objections</strong>: listen, acknowledge, answer with proof.</li>
<li><strong>Closing</strong>: ask for the decision or the next step.</li>
<li><strong>Follow-up</strong>: delivery, satisfaction, repeat business.</li></ol>
<h4>Relationship and consultative selling</h4>
<p>Modern selling stresses long-term relationships and helping the buyer solve a problem rather than pushing a product. Pressure that leads to buyer's remorse harms the brand and increases returns and complaints.</p>
<h4>Link to IMC</h4>
<ul><li><strong>Inbound leads</strong>: ads, content, events and PR create enquiries that sales follow up quickly.</li>
<li><strong>Consistent message</strong>: staff must say what the campaign says. Brief them before the launch, give a one-page FAQ and the offer rules.</li>
<li><strong>Feedback</strong>: sales hears objections first. Collect them in a shared sheet and feed them to the next brief.</li>
<li><strong>Retail staff</strong> are salespeople too: the earlier example about hotline and shop staff giving different answers is an IMC failure.</li></ul>
<h4>Measures</h4>
<p>Calls or meetings, qualified leads, conversion from lead to sale, average deal size, sales cycle length, and customer satisfaction after the sale. A salesperson's targets should not reward misleading claims.</p>`,
       `<p><strong>Bán hàng trực tiếp</strong> là truyền thông hai chiều, người với người, để thuyết phục người mua. Đó là công cụ linh hoạt nhất: nhân viên nghe phản đối, điều chỉnh và chốt. Nó cũng đắt nhất cho mỗi tiếp xúc, nên dùng khi giao dịch phức tạp, giá trị cao hoặc cần lòng tin: B2B, bất động sản, bảo hiểm, ô tô, tư vấn giáo dục.</p>
<h4>Quy trình bán hàng</h4>
<ol><li><strong>Tìm kiếm khách tiềm năng</strong>: tìm người có khả năng mua.</li>
<li><strong>Chuẩn bị</strong>: tìm hiểu người hay công ty, đặt mục tiêu cuộc gặp.</li>
<li><strong>Tiếp cận</strong>: tiếp xúc đầu tiên với mở đầu phù hợp.</li>
<li><strong>Khám phá nhu cầu và trình bày</strong>: hỏi trước, rồi nối lợi ích với nhu cầu.</li>
<li><strong>Xử lý phản đối</strong>: lắng nghe, ghi nhận, trả lời bằng bằng chứng.</li>
<li><strong>Chốt</strong>: đề nghị quyết định hoặc bước tiếp theo.</li>
<li><strong>Theo dõi sau</strong>: giao hàng, hài lòng, mua lại.</li></ol>
<h4>Bán hàng quan hệ và tư vấn</h4>
<p>Bán hàng hiện đại nhấn mạnh quan hệ dài hạn và giúp người mua giải quyết vấn đề thay vì đẩy sản phẩm. Áp lực dẫn tới hối tiếc sau mua làm hại thương hiệu và tăng đổi trả, khiếu nại.</p>
<h4>Liên hệ với IMC</h4>
<ul><li><strong>Khách tiềm năng đến từ truyền thông</strong>: quảng cáo, nội dung, sự kiện và PR tạo yêu cầu mà đội bán hàng theo dõi nhanh.</li>
<li><strong>Thông điệp nhất quán</strong>: nhân viên phải nói điều chiến dịch nói. Brief họ trước ngày ra mắt, đưa một trang hỏi đáp và quy tắc ưu đãi.</li>
<li><strong>Phản hồi</strong>: đội bán hàng nghe phản đối đầu tiên. Thu vào bảng chung và đưa vào brief sau.</li>
<li><strong>Nhân viên bán lẻ</strong> cũng là người bán hàng: ví dụ trước về hotline và nhân viên cửa hàng trả lời khác nhau là một thất bại IMC.</li></ul>
<h4>Thước đo</h4>
<p>Số cuộc gọi hay buổi gặp, khách tiềm năng đủ điều kiện, tỷ lệ từ khách tiềm năng sang bán, giá trị đơn trung bình, độ dài chu kỳ bán, và mức hài lòng sau bán. Chỉ tiêu của nhân viên không nên thưởng cho tuyên bố gây hiểu lầm.</p>`],
    pit: ['Launching a campaign without briefing the sales team. The first customers who ask about it get blank looks.', 'Ra chiến dịch mà không brief đội bán hàng. Những khách đầu tiên hỏi sẽ nhận lại ánh nhìn trống rỗng.'],
    s: [['Most flexible and most costly per contact; best for complex, high-trust sales.', 'Linh hoạt nhất và tốn nhất mỗi tiếp xúc; hợp bán hàng phức tạp, cần tin cậy.'], ['Process: prospect → prepare → approach → present → objections → close → follow up.', 'Quy trình: tìm → chuẩn bị → tiếp cận → trình bày → phản đối → chốt → theo dõi.'], ['Brief sales on the campaign and collect objections back.', 'Brief đội bán hàng về chiến dịch và thu lại các phản đối.']],
    l: ['selling', 'tradeshow', 'cx'],
    p: [['Name two products where personal selling is more suitable than advertising alone.', 'Kể hai sản phẩm mà bán hàng trực tiếp phù hợp hơn chỉ quảng cáo.', 'For example B2B software and life insurance (complex, high value, high trust).', 'Ví dụ phần mềm B2B và bảo hiểm nhân thọ (phức tạp, giá trị cao, cần tin cậy).'],
        ['Why should sales staff be briefed before launch?', 'Vì sao phải brief nhân viên bán hàng trước ra mắt?', 'They are a touchpoint and must repeat the same message and offer rules.', 'Họ là một điểm chạm và phải nói cùng thông điệp và quy tắc ưu đãi.']] }),

  Q(P + 'quiz-6', 'Chapter 6 quiz — Promotion, direct marketing, selling', 'Quiz Chương 6 — Khuyến mãi, trực tiếp, bán hàng', [
    qq('Sales promotion mainly gives…', 'Khuyến mãi chủ yếu cho…', ['A short-term reason to act now|Một lý do hành động ngay trong ngắn hạn', 'Long-term meaning|Ý nghĩa dài hạn', 'A press story|Một bài báo', 'A new product|Một sản phẩm mới'], 0, 'Its job is urgency and trial.', 'Việc của nó là thúc đẩy và dùng thử.'),
    qq('A trade promotion targets…', 'Khuyến mãi thương mại nhắm tới…', ['Final consumers only|Chỉ người tiêu dùng cuối', 'Retailers and distributors|Nhà bán lẻ và nhà phân phối', 'Journalists|Nhà báo', 'Investors|Nhà đầu tư'], 1, 'It pushes product through the channel.', 'Nó đẩy sản phẩm qua kênh.'),
    qq('The main long-term risk of frequent discounts is…', 'Rủi ro dài hạn chính của giảm giá thường xuyên là…', ['Customers learn to buy only on deal|Khách quen mua khi có ưu đãi', 'More brand awareness|Tăng nhận biết', 'Lower costs|Giảm chi phí', 'Better loyalty|Trung thành hơn'], 0, 'It erodes price perception.', 'Nó làm xói mòn nhận thức về giá.'),
    qq('Baseline 1,000 units, promo 1,300 units, margin 4,000 VND, cost 800,000 VND. Extra profit?', 'Nền 1.000 đơn vị, khuyến mãi 1.300, biên 4.000 đồng, chi phí 800.000 đồng. Lợi nhuận thêm?', ['400,000 VND|400.000 đồng', '1,200,000 VND|1.200.000 đồng', '800,000 VND|800.000 đồng', '0|0'], 0, '300 × 4,000 = 1,200,000; minus 800,000 = 400,000.', '300 × 4.000 = 1.200.000; trừ 800.000 = 400.000.'),
    qq('Direct marketing is characterised by…', 'Marketing trực tiếp có đặc điểm…', ['Mass, anonymous and unmeasurable|Đại chúng, ẩn danh, không đo được', 'Targeted, interactive, measurable|Nhắm chọn, tương tác, đo được', 'Free of cost|Miễn phí', 'Only mail|Chỉ thư'], 1, 'Individuals are addressed and responses recorded.', 'Nhắm cá nhân và ghi nhận phản hồi.'),
    qq('RFM stands for…', 'RFM là viết tắt của…', ['Recency, Frequency, Monetary|Recency, Frequency, Monetary', 'Reach, Frequency, Media|Reach, Frequency, Media', 'Response, Feedback, Message|Response, Feedback, Message', 'Retail, Free, Mail|Retail, Free, Mail'], 0, 'Used to segment customers by buying behaviour.', 'Dùng để phân khúc khách theo hành vi mua.'),
    qq('Personal selling is best for…', 'Bán hàng trực tiếp tốt nhất cho…', ['Low-priced, simple items|Hàng giá thấp, đơn giản', 'Complex, high-value, trust-heavy sales|Giao dịch phức tạp, giá trị cao, cần tin cậy', 'Reminder messages|Thông điệp nhắc nhớ', 'Press releases|Thông cáo báo chí'], 1, 'Two-way adaptability matters.', 'Khả năng thích ứng hai chiều là quan trọng.'),
    qq('Why brief sales staff before a launch?', 'Vì sao brief nhân viên bán hàng trước ra mắt?', ['They are a touchpoint and must repeat the message|Họ là điểm chạm và phải nói đúng thông điệp', 'To reduce their pay|Để giảm lương', 'It is a legal rule|Quy định pháp luật', 'No reason|Không có lý do'], 0, 'Inconsistent staff answers break integration.', 'Nhân viên trả lời lệch làm hỏng tích hợp.'),
  ]),
]));
// ===== Chương 7 =====
secs.push(SEC('Chapter 7 — Digital, social, events and sponsorship', 'Chương 7 — Số, mạng xã hội, sự kiện và tài trợ',
  'Truyền thông số và mạng xã hội, nội dung và influencer, sự kiện trải nghiệm, tài trợ; phối hợp với các công cụ khác.', [
  D(P + '7-1', '7.1 Digital marketing and search', '7.1 Marketing số và tìm kiếm', 'Các kênh số, quảng cáo trả theo hiệu quả, tìm kiếm có trả tiền và tự nhiên, UTM và đo lường cơ bản.', {
    n: '7.1',
    g: [['Describe the main digital channels and their jobs', 'Mô tả các kênh số chính và nhiệm vụ'], ['Explain pay-per-click and related cost models', 'Giải thích trả theo lượt nhấp và các mô hình chi phí liên quan'], ['Tag campaign links with UTM parameters', 'Gắn tham số UTM cho đường dẫn chiến dịch']],
    b: [`<p><strong>Digital marketing</strong> uses internet-connected channels: websites, search, social platforms, video, email, messaging and apps. It is not a separate world: it is a set of channels that fit paid, owned and earned categories (Chapter 2).</p>
<h4>Channels and jobs</h4>
<table><thead><tr><th>Channel</th><th>Typical job</th><th>Cost model</th></tr></thead><tbody>
<tr><td>Search (paid and organic)</td><td>Capture people who already have a need</td><td>Pay per click (paid); time and content (organic)</td></tr>
<tr><td>Display and video ads</td><td>Awareness, retargeting</td><td>CPM or cost per view</td></tr>
<tr><td>Social ads</td><td>Targeted reach and response</td><td>CPM, CPC or cost per action</td></tr>
<tr><td>Email and messaging</td><td>Nurture and retain</td><td>Platform fees</td></tr>
<tr><td>Own website or app</td><td>Information, conversion hub</td><td>Build and maintenance</td></tr></tbody></table>
<h4>Cost models</h4>
<ul><li><strong>CPM</strong>: cost per 1,000 impressions. See Chapter 8.</li>
<li><strong>CPC / PPC</strong>: you pay per click. Click-through rate (CTR) = clicks ÷ impressions.</li>
<li><strong>CPA</strong>: cost per action (sign-up, purchase) = total spend ÷ actions.</li></ul>
<div class="formula"><span class="lbl">Example (hypothetical)</span>Spend 3,000,000 VND; 600,000 impressions; 6,000 clicks; 120 sign-ups. CTR = 6,000 ÷ 600,000 = 1%. CPC = 500 VND. CPA = 25,000 VND. CPM = 3,000,000 ÷ 600 = 5,000 VND.</div>
<h4>Search: why it is special</h4>
<p>Search captures demand that other tools create. Someone sees a poster, then searches the brand name. If the brand has no good result, the integration chain breaks. Track brand-search volume as a signal of campaign interest.</p>
<h4>Tag your links</h4>
<p>UTM parameters (<code>utm_source</code>, <code>utm_medium</code>, <code>utm_campaign</code>) tell analytics where visits come from. Agree naming rules in the team (lowercase, no spaces) or the report becomes unreadable. Google's help page below explains the parameters.</p>`,
       `<p><strong>Marketing số</strong> dùng các kênh kết nối internet: website, tìm kiếm, nền tảng xã hội, video, email, nhắn tin và ứng dụng. Nó không phải thế giới riêng: đó là tập các kênh nằm trong nhóm paid, owned, earned (Chương 2).</p>
<h4>Kênh và nhiệm vụ</h4>
<table><thead><tr><th>Kênh</th><th>Nhiệm vụ điển hình</th><th>Mô hình chi phí</th></tr></thead><tbody>
<tr><td>Tìm kiếm (trả tiền và tự nhiên)</td><td>Bắt lấy người đã có nhu cầu</td><td>Trả theo nhấp (trả tiền); thời gian và nội dung (tự nhiên)</td></tr>
<tr><td>Quảng cáo hiển thị và video</td><td>Nhận biết, nhắm lại</td><td>CPM hoặc chi phí mỗi lượt xem</td></tr>
<tr><td>Quảng cáo mạng xã hội</td><td>Phủ nhắm chọn và phản hồi</td><td>CPM, CPC hoặc chi phí mỗi hành động</td></tr>
<tr><td>Email và nhắn tin</td><td>Nuôi dưỡng và giữ chân</td><td>Phí nền tảng</td></tr>
<tr><td>Website hoặc app riêng</td><td>Thông tin, trung tâm chuyển đổi</td><td>Xây dựng và bảo trì</td></tr></tbody></table>
<h4>Mô hình chi phí</h4>
<ul><li><strong>CPM</strong>: chi phí mỗi 1.000 lượt hiển thị. Xem Chương 8.</li>
<li><strong>CPC / PPC</strong>: trả theo nhấp. Tỷ lệ nhấp (CTR) = nhấp ÷ hiển thị.</li>
<li><strong>CPA</strong>: chi phí mỗi hành động (đăng ký, mua) = tổng chi ÷ số hành động.</li></ul>
<div class="formula"><span class="lbl">Ví dụ (giả định)</span>Chi 3.000.000 đồng; 600.000 lượt hiển thị; 6.000 nhấp; 120 đăng ký. CTR = 6.000 ÷ 600.000 = 1%. CPC = 500 đồng. CPA = 25.000 đồng. CPM = 3.000.000 ÷ 600 = 5.000 đồng.</div>
<h4>Tìm kiếm: vì sao đặc biệt</h4>
<p>Tìm kiếm bắt lấy nhu cầu do các công cụ khác tạo ra. Ai đó thấy áp phích rồi tìm tên thương hiệu. Nếu thương hiệu không có kết quả tốt, chuỗi tích hợp đứt. Theo dõi lượng tìm kiếm thương hiệu như tín hiệu quan tâm tới chiến dịch.</p>
<h4>Gắn thẻ đường dẫn</h4>
<p>Tham số UTM (<code>utm_source</code>, <code>utm_medium</code>, <code>utm_campaign</code>) cho analytics biết lượt truy cập đến từ đâu. Thống nhất quy tắc đặt tên trong nhóm (chữ thường, không dấu cách) kẻo báo cáo không đọc được. Trang trợ giúp của Google bên dưới giải thích các tham số.</p>`],
    pit: ['Reporting clicks as success when the objective was awareness or sales. Clicks are a means.', 'Báo cáo lượt nhấp là thành công khi mục tiêu là nhận biết hay doanh số. Nhấp chỉ là phương tiện.'],
    s: [['Digital channels fit paid/owned/earned and each has a job.', 'Kênh số nằm trong paid/owned/earned và mỗi kênh có nhiệm vụ.'], ['CPM, CPC, CPA, CTR are the basic formulas.', 'CPM, CPC, CPA, CTR là công thức cơ bản.'], ['Search captures demand; UTM tags make results traceable.', 'Tìm kiếm bắt nhu cầu; thẻ UTM làm kết quả truy vết được.']],
    l: ['digital', 'sem', 'ppc', 'ctr', 'utm'],
    p: [['Spend 2,000,000 VND, 400,000 impressions. CPM? If 4,000 clicks, CTR and CPC?', 'Chi 2.000.000 đồng, 400.000 hiển thị. CPM? Nếu có 4.000 nhấp, CTR và CPC?', 'CPM = 2,000,000 ÷ 400 = 5,000 VND; CTR = 1%; CPC = 500 VND.', 'CPM = 2.000.000 ÷ 400 = 5.000 đồng; CTR = 1%; CPC = 500 đồng.'],
        ['Why track brand-search volume during a TV campaign?', 'Vì sao theo dõi lượng tìm kiếm thương hiệu khi chạy TV?', 'It shows whether TV prompts people to look the brand up.', 'Nó cho thấy TV có khiến người ta đi tìm thương hiệu không.']] }),

  D(P + '7-2', '7.2 Social media, content and influencers', '7.2 Mạng xã hội, nội dung và influencer', 'Vai trò của mạng xã hội, content marketing, chọn influencer, tiêu chí và minh bạch.', {
    n: '7.2',
    g: [['Plan content pillars from message and audience', 'Lập trụ cột nội dung từ thông điệp và đối tượng'], ['Choose influencers using clear criteria', 'Chọn influencer bằng tiêu chí rõ ràng'], ['Explain the role of disclosure', 'Giải thích vai trò của việc công khai quan hệ trả tiền']],
    b: [`<h4>Social media</h4>
<p>Social platforms combine paid ads, owned pages and earned sharing. Three jobs: <strong>reach</strong> (video and ads), <strong>conversation</strong> (comments, community) and <strong>service</strong> (answers to questions). Each platform has its own audience and style; do not copy one asset everywhere. Keep the idea, adapt the format.</p>
<h4>Content marketing</h4>
<p><strong>Content marketing</strong> creates useful or entertaining material to attract an audience, rather than only advertising. Choose 3 to 4 <em>content pillars</em> from your message and audience insight, e.g. for a career event: "CV tips", "recruiter stories", "student success", "event updates". Plan a calendar and a rule for how often to publish; consistency beats bursts.</p>
<h4>Influencers</h4>
<p><strong>Influencer marketing</strong> partners with creators who have an audience's trust. Criteria for choosing:</p>
<ul><li><strong>Fit</strong>: does the creator's audience match your target?</li>
<li><strong>Credibility</strong>: do they know the topic; do followers actually engage?</li>
<li><strong>Quality</strong>: past content, tone, controversies.</li>
<li><strong>Cost against outcome</strong>: price per expected result, not per follower.</li>
<li><strong>Authenticity</strong>: give creative freedom within a brief; a script that sounds scripted loses trust.</li></ul>
<p>Micro-creators with small, close communities can outperform big names in niche categories, but you must verify engagement and audience location. Never buy fake followers or fake comments; platforms and audiences notice, and it is deceptive.</p>
<h4>Disclosure</h4>
<p>When money or free products are given, the audience should be able to tell. Use the platform's paid-partnership label and clear wording; check the current rules of your country and platform. Ethical and legal detail is covered in EPL201.</p>
<h4>Case: Blendtec "Will It Blend?"</h4>
<p>Blendtec, a blender maker, started its <em>Will It Blend?</em> video series on YouTube in 2006: the founder blends unusual objects to show the machine's power. It is often used as an example of content that is on-brand (a demonstration), cheap to make and shareable. It shows the principle without the need for big media budgets.</p>`,
       `<h4>Mạng xã hội</h4>
<p>Nền tảng xã hội kết hợp quảng cáo trả tiền, trang sở hữu và chia sẻ kiếm được. Ba nhiệm vụ: <strong>độ phủ</strong> (video và quảng cáo), <strong>hội thoại</strong> (bình luận, cộng đồng) và <strong>dịch vụ</strong> (trả lời câu hỏi). Mỗi nền tảng có khán giả và phong cách riêng; đừng sao chép một tài sản ra khắp nơi. Giữ ý tưởng, chỉnh định dạng.</p>
<h4>Content marketing</h4>
<p><strong>Content marketing</strong> tạo nội dung hữu ích hoặc giải trí để thu hút khán giả, thay vì chỉ quảng cáo. Chọn 3 đến 4 <em>trụ cột nội dung</em> từ thông điệp và insight đối tượng, ví dụ cho sự kiện nghề nghiệp: "mẹo CV", "chuyện nhà tuyển dụng", "thành công của sinh viên", "cập nhật sự kiện". Lập lịch và quy tắc tần suất đăng; đều đặn hơn đăng dồn.</p>
<h4>Influencer</h4>
<p><strong>Marketing người ảnh hưởng</strong> hợp tác với nhà sáng tạo được khán giả tin. Tiêu chí chọn:</p>
<ul><li><strong>Phù hợp</strong>: khán giả của họ có khớp mục tiêu không?</li>
<li><strong>Uy tín</strong>: họ có hiểu chủ đề không; người theo dõi có tương tác thật không?</li>
<li><strong>Chất lượng</strong>: nội dung trước đây, giọng điệu, tranh cãi.</li>
<li><strong>Chi phí so với kết quả</strong>: giá trên kết quả kỳ vọng, không phải trên người theo dõi.</li>
<li><strong>Chân thực</strong>: cho tự do sáng tạo trong khuôn brief; kịch bản nghe như đọc thuộc làm mất lòng tin.</li></ul>
<p>Nhà sáng tạo nhỏ có cộng đồng gần gũi có thể hiệu quả hơn tên tuổi lớn trong ngành ngách, nhưng bạn phải kiểm tra tương tác và nơi ở của khán giả. Đừng bao giờ mua người theo dõi hay bình luận giả; nền tảng và khán giả đều nhận ra, và đó là lừa dối.</p>
<h4>Công khai</h4>
<p>Khi có tiền hoặc sản phẩm tặng, khán giả nên nhận ra được. Dùng nhãn hợp tác trả phí của nền tảng và cách diễn đạt rõ ràng; kiểm tra quy định hiện hành của nước bạn và nền tảng. Chi tiết đạo đức và pháp lý ở EPL201.</p>
<h4>Tình huống: Blendtec "Will It Blend?"</h4>
<p>Blendtec, nhà sản xuất máy xay, bắt đầu loạt video <em>Will It Blend?</em> trên YouTube năm 2006: người sáng lập xay những vật lạ để cho thấy sức mạnh máy. Nó thường được dùng làm ví dụ về nội dung đúng thương hiệu (một màn trình diễn), rẻ để làm và dễ chia sẻ. Nó cho thấy nguyên tắc mà không cần ngân sách phương tiện lớn.</p>`],
    pit: ['Choosing creators by follower count only. Check audience fit and engagement quality.', 'Chọn nhà sáng tạo chỉ theo số người theo dõi. Hãy kiểm tra độ phù hợp khán giả và chất lượng tương tác.'],
    s: [['Social: reach, conversation, service; adapt per platform.', 'Mạng xã hội: phủ, hội thoại, dịch vụ; chỉnh theo từng nền tảng.'], ['Content pillars come from the message and audience.', 'Trụ cột nội dung đến từ thông điệp và đối tượng.'], ['Pick influencers by fit, credibility, quality, cost per result; always disclose paid relationships.', 'Chọn influencer theo phù hợp, uy tín, chất lượng, chi phí mỗi kết quả; luôn công khai quan hệ trả phí.']],
    l: ['smm', 'content', 'influ', 'blendtec', 'viral'],
    p: [['Write four content pillars for a bubble-tea shop near a university.', 'Viết bốn trụ cột nội dung cho quán trà sữa gần trường đại học.', 'For example: exam-season deals, behind the bar, student reviews, new-flavour polls.', 'Ví dụ: ưu đãi mùa thi, hậu trường quầy pha chế, đánh giá của sinh viên, bình chọn vị mới.'],
        ['Why is "price per follower" a poor way to compare creators?', 'Vì sao "giá mỗi người theo dõi" là cách so sánh kém?', 'Followers may be inactive or off-target; compare expected results (engaged, relevant reach).', 'Người theo dõi có thể không hoạt động hoặc sai đối tượng; hãy so kết quả kỳ vọng (tiếp cận phù hợp, có tương tác).']] }),

  D(P + '7-3', '7.3 Events, experiences and sponsorship', '7.3 Sự kiện, trải nghiệm và tài trợ', 'Marketing sự kiện, tài trợ, đặt sản phẩm, du kích; chọn và đo cơ hội.', {
    n: '7.3',
    g: [['Describe event marketing and sponsorship and when they fit', 'Mô tả marketing sự kiện và tài trợ, khi nào phù hợp'], ['Evaluate a sponsorship opportunity with fit criteria', 'Đánh giá cơ hội tài trợ bằng tiêu chí phù hợp'], ['Extend an event into content and PR (activation)', 'Kéo dài sự kiện thành nội dung và PR (kích hoạt)']],
    b: [`<p><strong>Event marketing</strong> brings people to an experience that the brand runs or joins: a launch, a pop-up, a roadshow, a trade show, a festival stand, a webinar. <strong>Sponsorship</strong> is paying for association with an event, team, person or cause, in exchange for visibility and goodwill. Both create <em>face-to-face or live experience</em>, which advertising cannot.</p>
<h4>Strengths and limits</h4>
<table><thead><tr><th>Strengths</th><th>Limits</th></tr></thead><tbody>
<tr><td>Deep involvement, senses, memory</td><td>Small audience on site; high cost per person</td></tr>
<tr><td>Generates content and press stories</td><td>Weather, logistics, safety risks</td></tr>
<tr><td>Builds relationships with customers and trade</td><td>Hard to measure beyond attendance</td></tr></tbody></table>
<h4>Sponsorship fit criteria</h4>
<ul><li><strong>Audience match</strong>: do the event's people match your target?</li>
<li><strong>Brand fit</strong>: is there a believable link (a sports drink and a marathon)?</li>
<li><strong>Exclusivity and rights</strong>: what exactly do you get: naming, signage, content rights, tickets?</li>
<li><strong>Risk</strong>: what if the person or event is involved in a scandal? Add exit clauses.</li>
<li><strong>Activation budget</strong>: the sponsorship fee is only part; planners often budget a further amount to make it work (content, sampling, staff). Check the advice of your textbook for the ratio and treat it as a guide.</li></ul>
<h4>Activation: the integration step</h4>
<p>Before the event: announcement, registration, teaser content. During: moments designed to be filmed and shared, data capture with consent, product trial. After: highlights, thank-you email with an offer, press summary, survey. An event without this chain is a one-day expense.</p>
<h4>Related tools</h4>
<ul><li><strong>Product placement</strong>: showing the product in films, shows or games.</li>
<li><strong>Guerrilla marketing</strong>: unconventional, low-cost, surprising actions in public places. Check safety and permission.</li>
<li><strong>Cause marketing</strong>: partnering with a social cause; only credible with real commitment.</li></ul>
<h4>Case: Red Bull Stratos</h4>
<p>In October 2012 Red Bull supported Felix Baumgartner's jump from the stratosphere. The brand acted as organiser and media producer, not merely a logo on a jersey: the event itself was the content, extended by live streaming and press. It is a textbook example of an owned event that becomes earned media. Read the Wikipedia link for the facts, and note that such scale is far beyond student budgets: borrow the principle (be the organiser of something worth watching), not the scale.</p>`,
       `<p><strong>Marketing sự kiện</strong> đưa mọi người đến một trải nghiệm do thương hiệu tổ chức hoặc tham gia: ra mắt, pop-up, roadshow, hội chợ, gian hàng lễ hội, webinar. <strong>Tài trợ</strong> là trả tiền để gắn với một sự kiện, đội, cá nhân hay mục đích, đổi lấy hiện diện và thiện chí. Cả hai tạo <em>trải nghiệm trực tiếp hoặc trực tuyến</em> mà quảng cáo không làm được.</p>
<h4>Thế mạnh và hạn chế</h4>
<table><thead><tr><th>Thế mạnh</th><th>Hạn chế</th></tr></thead><tbody>
<tr><td>Gắn kết sâu, giác quan, ghi nhớ</td><td>Tại chỗ ít người; chi phí mỗi người cao</td></tr>
<tr><td>Tạo nội dung và câu chuyện báo chí</td><td>Thời tiết, hậu cần, rủi ro an toàn</td></tr>
<tr><td>Xây quan hệ với khách hàng và thương mại</td><td>Khó đo ngoài số người tham dự</td></tr></tbody></table>
<h4>Tiêu chí phù hợp khi tài trợ</h4>
<ul><li><strong>Khớp khán giả</strong>: người của sự kiện có khớp mục tiêu không?</li>
<li><strong>Hợp thương hiệu</strong>: có liên hệ đáng tin không (nước uống thể thao và giải marathon)?</li>
<li><strong>Độc quyền và quyền lợi</strong>: chính xác bạn nhận gì: đặt tên, bảng hiệu, quyền nội dung, vé?</li>
<li><strong>Rủi ro</strong>: nếu cá nhân hay sự kiện dính bê bối thì sao? Thêm điều khoản thoát.</li>
<li><strong>Ngân sách kích hoạt</strong>: phí tài trợ chỉ là một phần; người lập kế hoạch thường dự trù thêm một khoản để nó hiệu quả (nội dung, phát mẫu, nhân sự). Xem lời khuyên trong giáo trình về tỷ lệ và coi như hướng dẫn.</li></ul>
<h4>Kích hoạt: bước tích hợp</h4>
<p>Trước sự kiện: thông báo, đăng ký, nội dung teaser. Trong: những khoảnh khắc được thiết kế để quay và chia sẻ, thu dữ liệu có đồng ý, dùng thử sản phẩm. Sau: điểm nhấn, email cảm ơn kèm ưu đãi, tóm tắt báo chí, khảo sát. Sự kiện không có chuỗi này chỉ là chi phí một ngày.</p>
<h4>Công cụ liên quan</h4>
<ul><li><strong>Đặt sản phẩm</strong>: cho sản phẩm xuất hiện trong phim, chương trình hay trò chơi.</li>
<li><strong>Marketing du kích</strong>: hành động khác thường, chi phí thấp, gây bất ngờ ở nơi công cộng. Kiểm tra an toàn và xin phép.</li>
<li><strong>Marketing vì mục đích xã hội</strong>: hợp tác với một mục đích xã hội; chỉ đáng tin khi cam kết thật.</li></ul>
<h4>Tình huống: Red Bull Stratos</h4>
<p>Tháng 10/2012 Red Bull hỗ trợ cú nhảy của Felix Baumgartner từ tầng bình lưu. Thương hiệu đóng vai nhà tổ chức và nhà sản xuất truyền thông, không chỉ là logo trên áo: bản thân sự kiện là nội dung, được mở rộng bằng phát trực tiếp và báo chí. Đây là ví dụ giáo trình về sự kiện sở hữu trở thành earned media. Đọc liên kết Wikipedia để biết dữ kiện, và lưu ý quy mô như vậy vượt xa ngân sách sinh viên: hãy mượn nguyên tắc (làm nhà tổ chức một điều đáng xem), không mượn quy mô.</p>`],
    pit: ['Buying a sponsorship and doing nothing else. The logo on a banner rarely changes attitudes without activation.', 'Mua tài trợ rồi không làm gì thêm. Logo trên băng rôn hiếm khi đổi được thái độ nếu không kích hoạt.'],
    s: [['Events and sponsorship create live experience and content.', 'Sự kiện và tài trợ tạo trải nghiệm trực tiếp và nội dung.'], ['Judge sponsorship by audience, brand fit, rights, risk and activation budget.', 'Đánh giá tài trợ theo khán giả, hợp thương hiệu, quyền lợi, rủi ro và ngân sách kích hoạt.'], ['Plan before-during-after to turn a day into a campaign.', 'Lập kế hoạch trước – trong – sau để biến một ngày thành chiến dịch.']],
    l: ['event', 'spons', 'stratos', 'guerrilla', 'placement'],
    p: [['A bank sponsors a student esports tournament. Name one fit criterion that passes and one risk.', 'Một ngân hàng tài trợ giải esports sinh viên. Nêu một tiêu chí phù hợp đạt và một rủi ro.', 'Audience match (young adults, future customers); risk: unsportsmanlike or inappropriate behaviour on stream linked to the brand.', 'Khớp khán giả (người trẻ, khách hàng tương lai); rủi ro: hành vi thiếu chuẩn mực trên luồng phát gắn với thương hiệu.'],
        ['List two activation actions after an event.', 'Liệt kê hai hành động kích hoạt sau sự kiện.', 'Highlight video and thank-you email with an offer (or survey, press summary).', 'Video điểm nhấn và email cảm ơn kèm ưu đãi (hoặc khảo sát, tóm tắt báo chí).']] }),

  Q(P + 'quiz-7', 'Chapter 7 quiz — Digital, social, events and sponsorship', 'Quiz Chương 7 — Số, mạng xã hội, sự kiện và tài trợ', [
    qq('CTR is calculated as…', 'CTR được tính bằng…', ['Clicks ÷ impressions|Nhấp ÷ hiển thị', 'Spend ÷ clicks|Chi ÷ nhấp', 'Sales ÷ spend|Doanh số ÷ chi', 'Reach × frequency|Reach × frequency'], 0, 'Click-through rate compares clicks with impressions.', 'Tỷ lệ nhấp so nhấp với hiển thị.'),
    qq('Spend 1,000,000 VND for 200,000 impressions gives a CPM of…', 'Chi 1.000.000 đồng cho 200.000 hiển thị có CPM bằng…', ['5,000 VND|5.000 đồng', '200 VND|200 đồng', '500 VND|500 đồng', '50,000 VND|50.000 đồng'], 0, '1,000,000 ÷ 200 = 5,000.', '1.000.000 ÷ 200 = 5.000.'),
    qq('Search is important because it…', 'Tìm kiếm quan trọng vì nó…', ['Captures demand created by other tools|Bắt nhu cầu do các công cụ khác tạo ra', 'Replaces all advertising|Thay thế mọi quảng cáo', 'Is always free|Luôn miễn phí', 'Cannot be measured|Không đo được'], 0, 'People often search after seeing a campaign.', 'Người ta thường tìm kiếm sau khi thấy chiến dịch.'),
    qq('UTM parameters are used to…', 'Tham số UTM dùng để…', ['Show where traffic comes from|Cho biết lưu lượng đến từ đâu', 'Encrypt data|Mã hoá dữ liệu', 'Make ads louder|Làm quảng cáo to hơn', 'Replace consent|Thay thế sự đồng ý'], 0, 'They tag links for analytics.', 'Chúng gắn thẻ đường dẫn cho analytics.'),
    qq('A good basis for selecting an influencer is…', 'Cơ sở tốt để chọn influencer là…', ['Follower count only|Chỉ số người theo dõi', 'Audience fit, credibility and engagement quality|Độ phù hợp khán giả, uy tín và chất lượng tương tác', 'Lowest price|Giá thấp nhất', 'Random choice|Chọn ngẫu nhiên'], 1, 'Fit and genuine engagement matter.', 'Phù hợp và tương tác thật là quan trọng.'),
    qq('Paid partnerships with creators should be…', 'Quan hệ trả phí với nhà sáng tạo nên được…', ['Hidden|Giấu', 'Disclosed clearly|Công khai rõ ràng', 'Denied|Phủ nhận', 'Paid in secret|Trả bí mật'], 1, 'Audiences should be able to tell.', 'Khán giả cần nhận ra được.'),
    qq('Activation means…', 'Kích hoạt (activation) nghĩa là…', ['Paying the sponsorship fee|Trả phí tài trợ', 'Extending a sponsorship or event into content, trial and PR|Kéo dài tài trợ hay sự kiện thành nội dung, dùng thử và PR', 'Turning on a server|Bật máy chủ', 'Cancelling the event|Huỷ sự kiện'], 1, 'Without activation the logo is only visibility.', 'Không kích hoạt thì logo chỉ là hiện diện.'),
    qq('Red Bull Stratos is used as an example of…', 'Red Bull Stratos được dùng làm ví dụ cho…', ['An owned event that became earned media|Sự kiện sở hữu trở thành earned media', 'A coupon campaign|Chiến dịch phiếu giảm giá', 'A telemarketing script|Kịch bản telemarketing', 'A price cut|Giảm giá'], 0, 'The brand organised something worth watching and covering.', 'Thương hiệu tổ chức điều đáng xem và đáng đưa tin.'),
  ]),
]));
// ===== Chương 8 =====
secs.push(SEC('Chapter 8 — Media planning and budgeting', 'Chương 8 — Hoạch định phương tiện và ngân sách',
  'Chọn phương tiện, reach/frequency/GRP/CPM, lịch phát và các phương pháp lập ngân sách.', [
  D(P + '8-1', '8.1 Media planning basics', '8.1 Hoạch định phương tiện cơ bản', 'Mục tiêu phương tiện, tiêu chí chọn, lịch phát liên tục/đợt/xung, kết hợp media.', {
    n: '8.1',
    g: [['State media objectives (who, where, when, how much)', 'Nêu mục tiêu phương tiện (ai, ở đâu, khi nào, bao nhiêu)'], ['Choose media using audience, cost, and message fit', 'Chọn phương tiện theo khán giả, chi phí và độ phù hợp thông điệp'], ['Compare continuity, flighting and pulsing', 'So sánh phát liên tục, theo đợt và xung']],
    b: [`<p><strong>Media planning</strong> decides which media vehicles carry the message, to whom, when and how often, within the budget. The <em>creative</em> says what; the <em>media plan</em> says where and when. A great ad in the wrong place is wasted.</p>
<h4>Media objectives</h4>
<ul><li><strong>Target audience</strong>: from Chapter 3, expressed so that media data can match it (age, location, interests).</li>
<li><strong>Reach</strong>: percentage of the target exposed at least once in a period.</li>
<li><strong>Frequency</strong>: average number of exposures among those reached.</li>
<li><strong>Timing and geography</strong>: when and where.</li>
<li><strong>Continuity</strong>: pattern across time.</li></ul>
<h4>Choosing media</h4>
<table><thead><tr><th>Criterion</th><th>Questions</th></tr></thead><tbody>
<tr><td>Audience fit</td><td>Does the vehicle's audience match the target, and how much is waste outside it?</td></tr>
<tr><td>Cost efficiency</td><td>Cost per thousand impressions (CPM) or per target reached.</td></tr>
<tr><td>Message fit</td><td>Does it support the format (sound, motion, long copy, demonstration)?</td></tr>
<tr><td>Context</td><td>Brand-safe, relevant surroundings, attention level.</td></tr>
<tr><td>Flexibility and lead time</td><td>Can you change or stop quickly?</td></tr>
<tr><td>Measurability</td><td>Can you get data on delivery and response?</td></tr></tbody></table>
<h4>Scheduling patterns</h4>
<ul><li><strong>Continuity</strong>: steady presence all period. Suits everyday purchases.</li>
<li><strong>Flighting</strong>: bursts with gaps. Suits seasonal or limited budgets.</li>
<li><strong>Pulsing</strong>: low steady base plus bursts. Balances both.</li></ul>
<p>A frequently quoted idea is that a minimum number of exposures is needed before a message works, often "three". Treat that as a rule of thumb from older research, not a law: the right level depends on message complexity, competition and creative quality. The Wikipedia page on frequency summarises the debate.</p>
<h4>Media mix and integration</h4>
<p>No medium does everything. A typical mix has a <em>reach</em> medium (video, TV, OOH), a <em>targeting</em> medium (search, social), and a <em>persuasion</em> medium (PR, content, events). Share one idea and one visual identity across them.</p>
<h4>Vietnam context</h4>
<p>Mass reach in Vietnam still combines television and out-of-home with strong mobile use; video and social platforms play a major role among younger audiences. Do not assume figures: obtain current audience data from your agency or a research provider and cite the date.</p>`,
       `<p><strong>Hoạch định phương tiện</strong> quyết định phương tiện nào mang thông điệp, tới ai, khi nào và bao nhiêu lần, trong ngân sách. <em>Sáng tạo</em> nói điều gì; <em>kế hoạch phương tiện</em> nói ở đâu và khi nào. Quảng cáo xuất sắc ở sai chỗ là lãng phí.</p>
<h4>Mục tiêu phương tiện</h4>
<ul><li><strong>Đối tượng mục tiêu</strong>: từ Chương 3, diễn đạt sao cho dữ liệu phương tiện khớp được (tuổi, vị trí, sở thích).</li>
<li><strong>Reach</strong>: phần trăm đối tượng tiếp xúc ít nhất một lần trong một giai đoạn.</li>
<li><strong>Frequency</strong>: số lần tiếp xúc trung bình trong những người đã được tiếp cận.</li>
<li><strong>Thời điểm và địa lý</strong>: khi nào, ở đâu.</li>
<li><strong>Tính liên tục</strong>: mẫu hình theo thời gian.</li></ul>
<h4>Chọn phương tiện</h4>
<table><thead><tr><th>Tiêu chí</th><th>Câu hỏi</th></tr></thead><tbody>
<tr><td>Khớp khán giả</td><td>Khán giả của phương tiện có khớp mục tiêu không, bao nhiêu lãng phí ngoài mục tiêu?</td></tr>
<tr><td>Hiệu quả chi phí</td><td>Chi phí mỗi nghìn lượt (CPM) hoặc mỗi đối tượng được tiếp cận.</td></tr>
<tr><td>Hợp thông điệp</td><td>Có hỗ trợ định dạng (âm thanh, chuyển động, nội dung dài, trình diễn) không?</td></tr>
<tr><td>Ngữ cảnh</td><td>An toàn thương hiệu, môi trường liên quan, mức chú ý.</td></tr>
<tr><td>Linh hoạt và thời gian chuẩn bị</td><td>Có đổi hoặc dừng nhanh được không?</td></tr>
<tr><td>Đo lường</td><td>Có dữ liệu về phân phối và phản hồi không?</td></tr></tbody></table>
<h4>Mẫu lịch phát</h4>
<ul><li><strong>Liên tục</strong>: hiện diện đều đặn cả giai đoạn. Hợp hàng mua hằng ngày.</li>
<li><strong>Theo đợt</strong>: các đợt dồn xen khoảng nghỉ. Hợp theo mùa hoặc ngân sách hạn chế.</li>
<li><strong>Xung</strong>: nền thấp đều cộng các đợt dồn. Cân bằng cả hai.</li></ul>
<p>Ý tưởng hay được nhắc là cần một số lần tiếp xúc tối thiểu trước khi thông điệp có tác dụng, thường là "ba". Hãy coi đó là quy tắc ngón tay cái từ nghiên cứu cũ, không phải quy luật: mức đúng phụ thuộc độ phức tạp thông điệp, cạnh tranh và chất lượng sáng tạo. Trang Wikipedia về frequency tóm tắt cuộc tranh luận.</p>
<h4>Media mix và tích hợp</h4>
<p>Không phương tiện nào làm được tất cả. Mix điển hình có phương tiện <em>phủ</em> (video, TV, OOH), phương tiện <em>nhắm</em> (tìm kiếm, xã hội), và phương tiện <em>thuyết phục</em> (PR, nội dung, sự kiện). Dùng chung một ý tưởng và một nhận diện hình ảnh xuyên chúng.</p>
<h4>Bối cảnh Việt Nam</h4>
<p>Độ phủ đại chúng ở Việt Nam vẫn kết hợp truyền hình và ngoài trời cùng việc dùng di động mạnh; video và nền tảng xã hội giữ vai trò lớn ở khán giả trẻ. Đừng giả định số liệu: hãy lấy dữ liệu khán giả hiện hành từ agency hoặc đơn vị nghiên cứu và ghi ngày khi trích.</p>`],
    pit: ['Buying the cheapest CPM without checking whether the audience is the target. Cheap waste is still waste.', 'Mua CPM rẻ nhất mà không kiểm tra khán giả có phải mục tiêu. Lãng phí rẻ vẫn là lãng phí.'],
    s: [['Media objectives: audience, reach, frequency, timing, geography, continuity.', 'Mục tiêu phương tiện: đối tượng, reach, frequency, thời điểm, địa lý, liên tục.'], ['Choose by audience fit, cost efficiency, message fit, context, flexibility, measurability.', 'Chọn theo khớp khán giả, hiệu quả chi phí, hợp thông điệp, ngữ cảnh, linh hoạt, đo lường.'], ['Continuity, flighting, pulsing patterns; "three exposures" is only a rule of thumb.', 'Liên tục, theo đợt, xung; "ba lần tiếp xúc" chỉ là quy tắc ngón tay cái.']],
    l: ['mplan', 'reach', 'freq', 'ooh'],
    p: [['A seasonal drink sells mainly in summer. Which schedule pattern suits and why?', 'Thức uống theo mùa bán chủ yếu mùa hè. Mẫu lịch nào hợp, vì sao?', 'Flighting: concentrate spending in the season and rest outside it.', 'Theo đợt: dồn chi tiêu vào mùa và nghỉ ngoài mùa.'],
        ['Why compare media on cost per target reached, not only total cost?', 'Vì sao so sánh phương tiện theo chi phí mỗi đối tượng tiếp cận, không chỉ tổng chi?', 'Total cost ignores how much of the audience is outside the target.', 'Tổng chi phí bỏ qua phần khán giả nằm ngoài mục tiêu.']] }),

  D(P + '8-2', '8.2 Reach, frequency, GRP and CPM: the calculations', '8.2 Reach, frequency, GRP và CPM: các phép tính', 'Tính GRP, lượt hiển thị gộp, CPM; so sánh hai phương tiện bằng ví dụ có lời giải.', {
    n: '8.2',
    g: [['Compute gross impressions and GRP', 'Tính tổng lượt hiển thị và GRP'], ['Compute and interpret CPM', 'Tính và diễn giải CPM'], ['Compare two media options fairly', 'So sánh hai phương án phương tiện một cách công bằng']],
    b: [`<p>The numbers below are <strong>hypothetical</strong>; they are made up to practise the formulas, not data about any real medium.</p>
<div class="formula"><span class="lbl">Gross impressions</span>Gross impressions = reach (people) × average frequency</div>
<div class="formula"><span class="lbl">GRP</span>GRP = reach (%) × average frequency = gross impressions as % of the target population</div>
<div class="formula"><span class="lbl">CPM</span>CPM = cost ÷ gross impressions × 1,000</div>
<h4>Worked example 1</h4>
<p>Target population: 2,000,000 people. Plan A reaches 50% of them with average frequency 3.</p>
<ol><li>Reach in people = 50% × 2,000,000 = 1,000,000.</li>
<li>Gross impressions = 1,000,000 × 3 = 3,000,000.</li>
<li>GRP = 50 × 3 = 150 (check: 3,000,000 ÷ 2,000,000 = 1.5 = 150%).</li>
<li>Cost 120,000,000 VND, so CPM = 120,000,000 ÷ 3,000,000 × 1,000 = 40,000 VND.</li></ol>
<h4>Worked example 2: comparing options</h4>
<table><thead><tr><th></th><th>Option B (video)</th><th>Option C (out-of-home)</th></tr></thead><tbody>
<tr><td>Cost</td><td>45,000,000 VND</td><td>60,000,000 VND</td></tr>
<tr><td>Gross impressions</td><td>1,500,000</td><td>3,000,000</td></tr>
<tr><td>CPM</td><td>45,000,000 ÷ 1,500,000 × 1,000 = 30,000 VND</td><td>60,000,000 ÷ 3,000,000 × 1,000 = 20,000 VND</td></tr>
<tr><td>Share of impressions on target</td><td>80%</td><td>40%</td></tr>
<tr><td>Target impressions</td><td>1,200,000</td><td>1,200,000</td></tr>
<tr><td>Cost per thousand <em>target</em> impressions</td><td>45,000,000 ÷ 1,200,000 × 1,000 = 37,500 VND</td><td>60,000,000 ÷ 1,200,000 × 1,000 = 50,000 VND</td></tr></tbody></table>
<p>OOH has the lower raw CPM but, once waste outside the target is removed, video is cheaper per <em>target</em> impression. This is why audience fit comes before raw price.</p>
<h4>Cautions</h4>
<ul><li>Gross impressions count repeat exposures; 150 GRP can be 50% reach × 3 or 100% × 1.5. Different outcomes, same GRP.</li>
<li>An impression means a chance to see, not proof of attention.</li>
<li>Digital platforms define impressions, views and reach in different ways. Read each platform's definition before comparing.</li></ul>`,
       `<p>Các con số dưới đây là <strong>giả định</strong>; được bịa để luyện công thức, không phải dữ liệu của phương tiện thật nào.</p>
<div class="formula"><span class="lbl">Tổng lượt hiển thị</span>Tổng lượt hiển thị = reach (người) × frequency trung bình</div>
<div class="formula"><span class="lbl">GRP</span>GRP = reach (%) × frequency trung bình = tổng lượt hiển thị tính theo % dân số mục tiêu</div>
<div class="formula"><span class="lbl">CPM</span>CPM = chi phí ÷ tổng lượt hiển thị × 1.000</div>
<h4>Ví dụ có lời giải 1</h4>
<p>Dân số mục tiêu: 2.000.000 người. Phương án A phủ 50% với frequency trung bình 3.</p>
<ol><li>Reach theo người = 50% × 2.000.000 = 1.000.000.</li>
<li>Tổng lượt hiển thị = 1.000.000 × 3 = 3.000.000.</li>
<li>GRP = 50 × 3 = 150 (kiểm: 3.000.000 ÷ 2.000.000 = 1,5 = 150%).</li>
<li>Chi phí 120.000.000 đồng, nên CPM = 120.000.000 ÷ 3.000.000 × 1.000 = 40.000 đồng.</li></ol>
<h4>Ví dụ có lời giải 2: so sánh phương án</h4>
<table><thead><tr><th></th><th>Phương án B (video)</th><th>Phương án C (ngoài trời)</th></tr></thead><tbody>
<tr><td>Chi phí</td><td>45.000.000 đồng</td><td>60.000.000 đồng</td></tr>
<tr><td>Tổng lượt hiển thị</td><td>1.500.000</td><td>3.000.000</td></tr>
<tr><td>CPM</td><td>45.000.000 ÷ 1.500.000 × 1.000 = 30.000 đồng</td><td>60.000.000 ÷ 3.000.000 × 1.000 = 20.000 đồng</td></tr>
<tr><td>Tỷ lệ lượt hiển thị đúng mục tiêu</td><td>80%</td><td>40%</td></tr>
<tr><td>Lượt hiển thị mục tiêu</td><td>1.200.000</td><td>1.200.000</td></tr>
<tr><td>Chi phí mỗi nghìn lượt <em>mục tiêu</em></td><td>45.000.000 ÷ 1.200.000 × 1.000 = 37.500 đồng</td><td>60.000.000 ÷ 1.200.000 × 1.000 = 50.000 đồng</td></tr></tbody></table>
<p>Ngoài trời có CPM thô thấp hơn nhưng khi loại phần lãng phí ngoài mục tiêu, video rẻ hơn trên mỗi lượt hiển thị <em>mục tiêu</em>. Đó là lý do khớp khán giả đứng trước giá thô.</p>
<h4>Lưu ý</h4>
<ul><li>Tổng lượt hiển thị tính cả lần lặp; 150 GRP có thể là reach 50% × 3 hoặc 100% × 1,5. Kết quả khác nhau, GRP như nhau.</li>
<li>Một lượt hiển thị là cơ hội nhìn thấy, không phải bằng chứng đã chú ý.</li>
<li>Nền tảng số định nghĩa lượt hiển thị, lượt xem, reach khác nhau. Hãy đọc định nghĩa từng nền tảng trước khi so sánh.</li></ul>`],
    pit: ['Mixing definitions (impressions on one platform, "views" on another) and comparing them as if equal.', 'Trộn định nghĩa (lượt hiển thị ở nền tảng này, "lượt xem" ở nền tảng khác) rồi so như nhau.'],
    s: [['Gross impressions = reach × frequency; GRP = reach% × frequency.', 'Tổng lượt hiển thị = reach × frequency; GRP = reach% × frequency.'], ['CPM = cost ÷ impressions × 1,000.', 'CPM = chi phí ÷ lượt hiển thị × 1.000.'], ['Always adjust for waste outside the target before comparing media.', 'Luôn điều chỉnh phần lãng phí ngoài mục tiêu trước khi so phương tiện.']],
    l: ['grp', 'cpm', 'reach', 'imp'],
    p: [['Target 500,000; reach 60%, frequency 2.5. Reach in people, gross impressions and GRP?', 'Mục tiêu 500.000; reach 60%, frequency 2,5. Reach theo người, tổng lượt hiển thị và GRP?', '300,000 people; 750,000 impressions; GRP = 60 × 2.5 = 150.', '300.000 người; 750.000 lượt hiển thị; GRP = 60 × 2,5 = 150.'],
        ['Cost 30,000,000 VND for 1,000,000 impressions, of which 50% are on target. CPM and cost per thousand target impressions?', 'Chi phí 30.000.000 đồng cho 1.000.000 lượt hiển thị, 50% đúng mục tiêu. CPM và chi phí mỗi nghìn lượt mục tiêu?', 'CPM = 30,000 VND; target impressions 500,000, so 60,000 VND per thousand.', 'CPM = 30.000 đồng; lượt mục tiêu 500.000 nên 60.000 đồng mỗi nghìn.']] }),

  D(P + '8-3', '8.3 Setting the communication budget', '8.3 Lập ngân sách truyền thông', 'Các phương pháp lập ngân sách, ưu nhược, share of voice, phân bổ giữa công cụ.', {
    n: '8.3',
    g: [['Describe the main budgeting methods', 'Mô tả các phương pháp lập ngân sách chính'], ['Choose a method and justify it', 'Chọn phương pháp và biện minh'], ['Allocate a budget across tools with a rationale', 'Phân bổ ngân sách giữa các công cụ có lý do']],
    b: [`<h4>Common methods</h4>
<table><thead><tr><th>Method</th><th>How it works</th><th>Weakness</th></tr></thead><tbody>
<tr><td>Affordable</td><td>Spend what is left after other costs</td><td>Ignores objectives; first to be cut</td></tr>
<tr><td>Percentage of sales</td><td>A fixed % of past or forecast sales</td><td>Cause and effect reversed: sales drive spend</td></tr>
<tr><td>Competitive parity</td><td>Match rivals' spend or share of voice</td><td>Rivals' goals may differ from yours</td></tr>
<tr><td>Objective-and-task</td><td>Set objectives, define tasks, cost them</td><td>Needs good estimates; more work</td></tr>
<tr><td>Share of voice / share of market</td><td>Spend share relative to market share, to hold or grow</td><td>Depends on category and creative quality</td></tr></tbody></table>
<p>Textbooks favour <strong>objective-and-task</strong> because it ties money to results, and recommend that percentages and competitor spend be used as a sanity check rather than the starting point.</p>
<h4>Worked example (hypothetical)</h4>
<p>Objective: raise aided awareness from 20% to 35% among 2,000,000 people, i.e. 300,000 more people. Tasks: video campaign reaching 60% at frequency 3 (cost about 90,000,000 VND), PR and content (20,000,000 VND), search to catch demand (15,000,000 VND), measurement and research (10,000,000 VND). Total 135,000,000 VND. Sanity check: previous year sales 5,000,000,000 VND, so 135,000,000 VND is 2.7% of sales; if the category norm is much higher or lower, ask why.</p>
<h4>Allocation across tools</h4>
<ul><li>Start from the roles: which tool carries reach, which credibility, which action.</li>
<li>Reserve a testing share (5 to 10% is a typical rule of thumb) to learn.</li>
<li>Keep a small contingency, and a floor for production quality.</li>
<li>Shift money to what works when metrics come in (Chapter 9).</li></ul>
<h4>Short-term and long-term balance</h4>
<p>Effectiveness research from the IPA argues that brands should balance activity that builds the brand over time with activity that triggers sales now. Cutting brand-building spend to hit this quarter often shows its effect later. Read their material (link below) critically and check what market and period the evidence comes from.</p>`,
       `<h4>Các phương pháp phổ biến</h4>
<table><thead><tr><th>Phương pháp</th><th>Cách làm</th><th>Điểm yếu</th></tr></thead><tbody>
<tr><td>Theo khả năng chi trả</td><td>Chi phần còn lại sau các chi phí khác</td><td>Bỏ qua mục tiêu; bị cắt đầu tiên</td></tr>
<tr><td>Phần trăm doanh thu</td><td>Một % cố định của doanh thu quá khứ hoặc dự báo</td><td>Đảo ngược nhân quả: doanh thu quyết định chi tiêu</td></tr>
<tr><td>Ngang bằng đối thủ</td><td>Bắt kịp chi tiêu hoặc tỷ lệ tiếng nói của đối thủ</td><td>Mục tiêu đối thủ có thể khác bạn</td></tr>
<tr><td>Mục tiêu và nhiệm vụ</td><td>Đặt mục tiêu, xác định nhiệm vụ, tính chi phí</td><td>Cần ước lượng tốt; nhiều việc hơn</td></tr>
<tr><td>Share of voice / thị phần</td><td>Tỷ lệ chi tiêu so với thị phần, để giữ hoặc tăng</td><td>Phụ thuộc ngành và chất lượng sáng tạo</td></tr></tbody></table>
<p>Giáo trình ưa <strong>mục tiêu và nhiệm vụ</strong> vì nó gắn tiền với kết quả, và khuyên dùng phần trăm và chi tiêu đối thủ để kiểm tra tính hợp lý chứ không làm điểm xuất phát.</p>
<h4>Ví dụ có lời giải (giả định)</h4>
<p>Mục tiêu: nâng nhận biết có gợi ý từ 20% lên 35% trong 2.000.000 người, tức thêm 300.000 người. Nhiệm vụ: chiến dịch video phủ 60% với frequency 3 (khoảng 90.000.000 đồng), PR và nội dung (20.000.000 đồng), tìm kiếm bắt nhu cầu (15.000.000 đồng), đo lường và nghiên cứu (10.000.000 đồng). Tổng 135.000.000 đồng. Kiểm tra hợp lý: doanh thu năm trước 5.000.000.000 đồng, nên 135.000.000 đồng là 2,7% doanh thu; nếu chuẩn ngành cao hơn hay thấp hơn nhiều, hãy hỏi vì sao.</p>
<h4>Phân bổ giữa các công cụ</h4>
<ul><li>Bắt đầu từ vai trò: công cụ nào mang độ phủ, công cụ nào uy tín, công cụ nào hành động.</li>
<li>Dành một phần thử nghiệm (5 đến 10% là quy tắc ngón tay cái thường gặp) để học.</li>
<li>Giữ một khoản dự phòng nhỏ và mức sàn cho chất lượng sản xuất.</li>
<li>Dịch tiền sang thứ hiệu quả khi có chỉ số (Chương 9).</li></ul>
<h4>Cân bằng ngắn hạn và dài hạn</h4>
<p>Nghiên cứu hiệu quả của IPA cho rằng thương hiệu nên cân bằng hoạt động xây thương hiệu theo thời gian với hoạt động kích doanh số ngay. Cắt chi xây thương hiệu để đạt quý này thường lộ hậu quả về sau. Hãy đọc tài liệu của họ một cách phê phán và kiểm tra bằng chứng đến từ thị trường và giai đoạn nào.</p>`],
    pit: ['Setting the budget first, then inventing objectives to justify it. Reverse the order, or at least test the fit.', 'Đặt ngân sách trước rồi bịa mục tiêu để biện minh. Đảo lại thứ tự, hoặc ít nhất kiểm tra độ khớp.'],
    s: [['Five methods: affordable, % of sales, parity, objective-and-task, share of voice.', 'Năm phương pháp: khả năng chi trả, % doanh thu, ngang bằng đối thủ, mục tiêu và nhiệm vụ, share of voice.'], ['Objective-and-task links spend to results; others are sanity checks.', 'Mục tiêu và nhiệm vụ gắn chi tiêu với kết quả; các cách khác để kiểm tra hợp lý.'], ['Allocate by tool role, reserve a test share, rebalance with results.', 'Phân bổ theo vai trò công cụ, dành phần thử nghiệm, cân đối lại theo kết quả.']],
    l: ['sov', 'ipa', 'roi'],
    p: [['A firm spends 4% of last year\'s sales of 3,000,000,000 VND. What budget? What is the main weakness?', 'Công ty chi 4% doanh thu năm ngoái 3.000.000.000 đồng. Ngân sách? Điểm yếu chính?', '120,000,000 VND; it ignores objectives and reverses cause and effect.', '120.000.000 đồng; bỏ qua mục tiêu và đảo ngược nhân quả.'],
        ['Why keep a testing share in the budget?', 'Vì sao giữ phần thử nghiệm trong ngân sách?', 'To learn what works and improve the next allocation.', 'Để học điều gì hiệu quả và cải thiện phân bổ sau.']] }),

  Q(P + 'quiz-8', 'Chapter 8 quiz — Media planning and budgeting', 'Quiz Chương 8 — Hoạch định phương tiện và ngân sách', [
    qq('Reach means…', 'Reach nghĩa là…', ['Average exposures per person|Số lần tiếp xúc trung bình mỗi người', 'Share of the target exposed at least once|Tỷ lệ mục tiêu tiếp xúc ít nhất một lần', 'Cost per click|Chi phí mỗi nhấp', 'Number of ads made|Số quảng cáo đã làm'], 1, 'Frequency is the average among those reached.', 'Frequency là trung bình trong những người đã tiếp cận.'),
    qq('Reach 40%, average frequency 4. GRP?', 'Reach 40%, frequency trung bình 4. GRP?', ['44|44', '160|160', '10|10', '1600|1600'], 1, '40 × 4 = 160.', '40 × 4 = 160.'),
    qq('Cost 60,000,000 VND, 2,000,000 impressions. CPM?', 'Chi 60.000.000 đồng, 2.000.000 lượt hiển thị. CPM?', ['30,000 VND|30.000 đồng', '3,000 VND|3.000 đồng', '120 VND|120 đồng', '300,000 VND|300.000 đồng'], 0, '60,000,000 ÷ 2,000,000 × 1,000 = 30,000.', '60.000.000 ÷ 2.000.000 × 1.000 = 30.000.'),
    qq('Flighting means…', 'Phát theo đợt nghĩa là…', ['Constant presence all period|Hiện diện đều cả giai đoạn', 'Bursts of activity with gaps|Các đợt hoạt động xen khoảng nghỉ', 'Only one ad|Chỉ một quảng cáo', 'Stopping forever|Dừng hẳn'], 1, 'Useful for seasonal or limited budgets.', 'Hữu ích khi theo mùa hoặc ngân sách hạn chế.'),
    qq('Why can a higher-CPM medium be better?', 'Vì sao phương tiện CPM cao hơn có thể tốt hơn?', ['It always is|Luôn tốt hơn', 'Less waste outside the target audience|Ít lãng phí ngoài đối tượng mục tiêu', 'It is bigger|Nó lớn hơn', 'It has a nicer logo|Logo đẹp hơn'], 1, 'Cost per target impression matters.', 'Chi phí mỗi lượt đúng mục tiêu mới quan trọng.'),
    qq('Which method links spending to results best?', 'Phương pháp nào gắn chi tiêu với kết quả tốt nhất?', ['Affordable|Khả năng chi trả', 'Percentage of sales|Phần trăm doanh thu', 'Objective-and-task|Mục tiêu và nhiệm vụ', 'Guessing|Đoán'], 2, 'It starts from objectives and costs the tasks.', 'Nó bắt đầu từ mục tiêu và tính chi phí nhiệm vụ.'),
    qq('A weakness of the percentage-of-sales method is…', 'Điểm yếu của phương pháp phần trăm doanh thu là…', ['It reverses cause and effect|Nó đảo ngược nhân quả', 'It is illegal|Trái luật', 'It is too complex|Quá phức tạp', 'It needs no data|Không cần dữ liệu'], 0, 'Sales should be a result of communication, not only its source of funding.', 'Doanh số nên là kết quả của truyền thông, không chỉ là nguồn tiền.'),
    qq('An impression is…', 'Một lượt hiển thị là…', ['Proof the person paid attention|Bằng chứng người đó đã chú ý', 'An opportunity to see|Một cơ hội nhìn thấy', 'A sale|Một đơn hàng', 'A like|Một lượt thích'], 1, 'It measures delivery, not attention.', 'Nó đo việc phân phối, không đo sự chú ý.'),
  ]),
]));
// ===== Chương 9 =====
secs.push(SEC('Chapter 9 — Measuring effectiveness and the integrated plan', 'Chương 9 — Đo lường hiệu quả và kế hoạch tích hợp',
  'Chọn chỉ số theo mục tiêu, ROI, attribution, thử nghiệm, và ghép tất cả thành kế hoạch IMC một trang.', [
  D(P + '9-1', '9.1 Choosing metrics that match objectives', '9.1 Chọn chỉ số khớp với mục tiêu', 'Chỉ số theo giai đoạn, chỉ số hư danh, nghiên cứu trước/sau, brand lift, thiết lập mức nền.', {
    n: '9.1',
    g: [['Match metrics to communication objectives', 'Ghép chỉ số với mục tiêu truyền thông'], ['Separate output, outcome and business-result metrics', 'Phân biệt chỉ số đầu ra, tác động và kết quả kinh doanh'], ['Recognise vanity metrics', 'Nhận ra chỉ số hư danh']],
    b: [`<p>Measurement starts at the beginning of the plan, not at the end. If the objective is written in Chapter 3's format (audience, measure, baseline, target, date), the metric is already chosen.</p>
<h4>Three layers of metrics</h4>
<table><thead><tr><th>Layer</th><th>Question</th><th>Examples</th></tr></thead><tbody>
<tr><td>Output (delivery)</td><td>Did the activity happen and reach people?</td><td>Impressions, reach, frequency, posts published, events held</td></tr>
<tr><td>Outcome (effect on people)</td><td>Did people know, feel or do something different?</td><td>Aided awareness, message recall, preference, sign-ups, visits</td></tr>
<tr><td>Business result</td><td>Did the business improve?</td><td>Sales, share, leads, retention, profit</td></tr></tbody></table>
<p>Reports often stop at the first layer because it is easy. A useful report shows all three and states how strong the link is between them.</p>
<h4>Match metric to stage</h4>
<ul><li>Awareness: aided and unaided awareness, reach, brand-search volume.</li>
<li>Understanding and interest: message recall, video completion, time on page, saves.</li>
<li>Preference: survey items on liking and consideration; share of conversations that are positive.</li>
<li>Action: leads, registrations, conversion rate, cost per action, sales.</li>
<li>Loyalty: repeat purchase, referrals, Net Promoter style questions.</li></ul>
<h4>Vanity metrics</h4>
<p>Likes, followers and raw views are easy to produce and easy to inflate. They are not useless, but they become <em>vanity metrics</em> when they are the only proof of success. Ask: if this number doubled, would a business decision change?</p>
<h4>Brand lift and before/after surveys</h4>
<p>To measure awareness or attitude, ask a sample before and after the campaign (and, better, compare an exposed group with a similar unexposed group). Keep the questionnaire short and neutral, use the same sampling approach each time, and report the sample size. Many platforms offer built-in "brand lift" studies; read how they sample and what they compare.</p>
<h4>Baselines and benchmarks</h4>
<p>Record the number before launch. Compare with your own past campaigns first, then with industry benchmarks, which are rough and vary by market and definition.</p>`,
       `<p>Đo lường bắt đầu từ đầu kế hoạch, không phải cuối. Nếu mục tiêu viết theo công thức Chương 3 (đối tượng, chỉ số, mức nền, đích, ngày), thì chỉ số đã được chọn.</p>
<h4>Ba lớp chỉ số</h4>
<table><thead><tr><th>Lớp</th><th>Câu hỏi</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Đầu ra (phân phối)</td><td>Hoạt động có diễn ra và tới người không?</td><td>Lượt hiển thị, reach, frequency, số bài đã đăng, số sự kiện đã tổ chức</td></tr>
<tr><td>Tác động (lên con người)</td><td>Con người có biết, cảm nhận hay làm khác đi không?</td><td>Nhận biết có gợi ý, nhớ thông điệp, ưa chuộng, đăng ký, ghé thăm</td></tr>
<tr><td>Kết quả kinh doanh</td><td>Doanh nghiệp có tốt lên không?</td><td>Doanh số, thị phần, khách tiềm năng, giữ chân, lợi nhuận</td></tr></tbody></table>
<p>Báo cáo hay dừng ở lớp đầu vì dễ. Báo cáo hữu ích cho thấy cả ba lớp và nói liên hệ giữa chúng mạnh đến đâu.</p>
<h4>Khớp chỉ số với giai đoạn</h4>
<ul><li>Nhận biết: nhận biết có và không gợi ý, reach, lượng tìm kiếm thương hiệu.</li>
<li>Hiểu và quan tâm: nhớ thông điệp, xem hết video, thời gian trên trang, lượt lưu.</li>
<li>Ưa chuộng: câu khảo sát về thích và cân nhắc; tỷ lệ hội thoại tích cực.</li>
<li>Hành động: khách tiềm năng, đăng ký, tỷ lệ chuyển đổi, chi phí mỗi hành động, doanh số.</li>
<li>Trung thành: mua lại, giới thiệu, câu hỏi kiểu Net Promoter.</li></ul>
<h4>Chỉ số hư danh</h4>
<p>Lượt thích, người theo dõi và lượt xem thô dễ tạo và dễ thổi phồng. Chúng không vô dụng, nhưng thành <em>chỉ số hư danh</em> khi là bằng chứng thành công duy nhất. Hãy hỏi: nếu con số này tăng gấp đôi, quyết định kinh doanh nào đổi?</p>
<h4>Brand lift và khảo sát trước/sau</h4>
<p>Để đo nhận biết hay thái độ, hỏi một mẫu trước và sau chiến dịch (và tốt hơn là so nhóm đã tiếp xúc với nhóm tương tự chưa tiếp xúc). Giữ bảng hỏi ngắn và trung lập, dùng cùng cách lấy mẫu mỗi lần và báo cáo cỡ mẫu. Nhiều nền tảng có sẵn nghiên cứu "brand lift"; hãy đọc cách họ lấy mẫu và so sánh gì.</p>
<h4>Mức nền và chuẩn so sánh</h4>
<p>Ghi lại con số trước khi ra mắt. So với các chiến dịch cũ của chính bạn trước, rồi mới so với chuẩn ngành, vốn thô và khác nhau theo thị trường và định nghĩa.</p>`],
    pit: ['Reporting a big impression number as success when the objective was a change in preference.', 'Báo cáo con số lượt hiển thị lớn là thành công khi mục tiêu là thay đổi sự ưa chuộng.'],
    s: [['Metrics come from the objective; choose them at planning time.', 'Chỉ số đến từ mục tiêu; chọn lúc lập kế hoạch.'], ['Report output, outcome and business result together.', 'Báo cáo cùng lúc đầu ra, tác động và kết quả kinh doanh.'], ['Use before/after or exposed/unexposed surveys for awareness and attitude.', 'Dùng khảo sát trước/sau hoặc đã/chưa tiếp xúc cho nhận biết và thái độ.']],
    l: ['kpi', 'research', 'aware', 'ipa'],
    p: [['Classify: impressions, aided awareness, sales.', 'Phân loại: lượt hiển thị, nhận biết có gợi ý, doanh số.', 'Output; outcome; business result.', 'Đầu ra; tác động; kết quả kinh doanh.'],
        ['Why is "followers doubled" a weak proof for a sales campaign?', 'Vì sao "người theo dõi tăng gấp đôi" là bằng chứng yếu cho chiến dịch bán hàng?', 'It does not show purchase intent or sales; no business decision depends on it.', 'Nó không cho thấy ý định mua hay doanh số; không quyết định kinh doanh nào dựa vào nó.']] }),

  D(P + '9-2', '9.2 ROI, attribution and testing', '9.2 ROI, attribution và thử nghiệm', 'ROI marketing, các mô hình attribution, MMM ở mức khái niệm, A/B test với ví dụ tính.', {
    n: '9.2',
    g: [['Calculate a simple marketing ROI', 'Tính ROI marketing đơn giản'], ['Explain attribution models and their blind spots', 'Giải thích các mô hình attribution và điểm mù'], ['Interpret a simple A/B test', 'Diễn giải một thử nghiệm A/B đơn giản']],
    b: [`<h4>Return on investment</h4>
<div class="formula"><span class="lbl">ROI</span>ROI = (incremental gain − cost) ÷ cost</div>
<p>The word <em>incremental</em> matters: count only the extra profit caused by the activity, not sales that would have happened anyway. Hypothetical example: plan cost 135,000,000 VND; estimated extra gross profit 200,000,000 VND. ROI = (200 − 135) ÷ 135 ≈ 0.48, or 48%. Estimating the incremental gain is the hard part: use a baseline, a control group or a model and state the assumptions.</p>
<h4>Attribution</h4>
<p><strong>Attribution</strong> assigns credit for a conversion to the touchpoints before it. Common simple models:</p>
<table><thead><tr><th>Model</th><th>Credit goes to</th><th>Blind spot</th></tr></thead><tbody>
<tr><td>Last click</td><td>The final touchpoint</td><td>Ignores awareness builders such as TV or PR</td></tr>
<tr><td>First click</td><td>The first touchpoint</td><td>Ignores closers such as search or email</td></tr>
<tr><td>Linear</td><td>Equal credit to all</td><td>Treats minor and major touches alike</td></tr>
<tr><td>Position-based</td><td>More to first and last</td><td>Weights are a judgement</td></tr></tbody></table>
<p>None is "true". They are lenses. Many channels, especially offline, cannot be tracked at user level at all, and privacy limits on tracking make user-level paths less complete than before.</p>
<h4>Marketing mix modelling (concept)</h4>
<p>MMM uses statistics on aggregated data (weekly sales, spend by channel, price, season) to estimate each channel's contribution. It works without tracking individuals and fits long-term effects, but needs enough history and statistical skill. In this course it is only a concept; the Wikipedia page gives an overview.</p>
<h4>A/B testing</h4>
<p>Randomly split an audience, show version A to one half and version B to the other, and compare a pre-chosen metric. Change one thing at a time.</p>
<p>Hypothetical result: A sent to 4,000 people gets 120 sign-ups (3.0%); B sent to 4,000 gets 160 (4.0%). A two-proportion test gives a z-score of about 2.4, beyond the common 1.96 threshold, so the difference is unlikely to be chance. Had it been 126 versus 130, the gap would be noise. Decide the sample size and stopping rule before you start, so you do not stop the moment you like the result.</p>
<h4>Incrementality in plain words</h4>
<p>The cleanest question is "what would have happened without the campaign?" Holdout groups (a region or audience slice that sees nothing) answer it better than any dashboard.</p>`,
       `<h4>Tỷ suất hoàn vốn</h4>
<div class="formula"><span class="lbl">ROI</span>ROI = (lợi ích tăng thêm − chi phí) ÷ chi phí</div>
<p>Từ <em>tăng thêm</em> rất quan trọng: chỉ tính lợi nhuận phụ trội do hoạt động gây ra, không tính doanh số vốn vẫn xảy ra. Ví dụ giả định: chi phí kế hoạch 135.000.000 đồng; lợi nhuận gộp phụ trội ước tính 200.000.000 đồng. ROI = (200 − 135) ÷ 135 ≈ 0,48 hay 48%. Ước lượng lợi ích tăng thêm là phần khó: dùng mức nền, nhóm đối chứng hoặc mô hình và nêu rõ giả định.</p>
<h4>Attribution</h4>
<p><strong>Attribution</strong> gán công cho các điểm chạm trước một chuyển đổi. Các mô hình đơn giản phổ biến:</p>
<table><thead><tr><th>Mô hình</th><th>Công thuộc về</th><th>Điểm mù</th></tr></thead><tbody>
<tr><td>Nhấp cuối</td><td>Điểm chạm cuối cùng</td><td>Bỏ qua công cụ tạo nhận biết như TV hay PR</td></tr>
<tr><td>Nhấp đầu</td><td>Điểm chạm đầu tiên</td><td>Bỏ qua công cụ chốt như tìm kiếm hay email</td></tr>
<tr><td>Tuyến tính</td><td>Chia đều cho tất cả</td><td>Coi điểm chạm nhỏ và lớn như nhau</td></tr>
<tr><td>Theo vị trí</td><td>Nhiều hơn cho đầu và cuối</td><td>Trọng số là phán đoán</td></tr></tbody></table>
<p>Không mô hình nào "đúng". Chúng là các thấu kính. Nhiều kênh, nhất là ngoại tuyến, hoàn toàn không theo dõi được ở mức người dùng, và các giới hạn quyền riêng tư làm đường đi theo người dùng kém đầy đủ hơn trước.</p>
<h4>Mô hình hoá marketing mix (khái niệm)</h4>
<p>MMM dùng thống kê trên dữ liệu tổng hợp (doanh số tuần, chi theo kênh, giá, mùa vụ) để ước lượng đóng góp của từng kênh. Nó không cần theo dõi cá nhân và phù hợp hiệu ứng dài hạn, nhưng cần đủ lịch sử và kỹ năng thống kê. Trong khoá này nó chỉ là khái niệm; trang Wikipedia cho tổng quan.</p>
<h4>Thử nghiệm A/B</h4>
<p>Chia ngẫu nhiên khán giả, cho nửa này xem phiên bản A và nửa kia phiên bản B, rồi so một chỉ số chọn trước. Mỗi lần chỉ đổi một thứ.</p>
<p>Kết quả giả định: A gửi 4.000 người có 120 đăng ký (3,0%); B gửi 4.000 người có 160 (4,0%). Kiểm định hai tỷ lệ cho z khoảng 2,4, vượt ngưỡng thường dùng 1,96, nên chênh lệch khó là ngẫu nhiên. Nếu là 126 so với 130 thì khoảng cách chỉ là nhiễu. Hãy quyết định cỡ mẫu và quy tắc dừng trước khi bắt đầu, để không dừng đúng lúc thấy kết quả vừa ý.</p>
<h4>Tính phụ trội nói đơn giản</h4>
<p>Câu hỏi sạch nhất là "nếu không có chiến dịch thì chuyện gì xảy ra?". Nhóm giữ lại (một khu vực hay phần khán giả không thấy gì) trả lời tốt hơn bất kỳ bảng điều khiển nào.</p>`],
    pit: ['Crediting a channel for sales that would have happened anyway (searches by already-convinced buyers).', 'Ghi công một kênh cho doanh số vốn vẫn xảy ra (tìm kiếm của người đã bị thuyết phục).'],
    s: [['ROI uses incremental gain, not total sales.', 'ROI dùng lợi ích tăng thêm, không phải tổng doanh số.'], ['Attribution models are lenses with blind spots; MMM uses aggregate data.', 'Mô hình attribution là thấu kính có điểm mù; MMM dùng dữ liệu tổng hợp.'], ['A/B tests need random split, one change, pre-set sample size and a significance check.', 'A/B cần chia ngẫu nhiên, một thay đổi, cỡ mẫu đặt trước và kiểm tra ý nghĩa thống kê.']],
    l: ['roi', 'attr', 'mmm', 'ab'],
    p: [['Cost 50,000,000 VND, incremental profit 80,000,000 VND. ROI?', 'Chi 50.000.000 đồng, lợi nhuận phụ trội 80.000.000 đồng. ROI?', '(80 − 50) ÷ 50 = 0.6 = 60%.', '(80 − 50) ÷ 50 = 0,6 = 60%.'],
        ['Which attribution model undervalues TV and PR, and why?', 'Mô hình attribution nào đánh giá thấp TV và PR, vì sao?', 'Last click: it credits only the final touchpoint, usually search or direct.', 'Nhấp cuối: chỉ ghi công điểm chạm cuối, thường là tìm kiếm hoặc truy cập trực tiếp.']] }),

  D(P + '9-3', '9.3 Capstone: a one-page integrated plan', '9.3 Tổng kết: kế hoạch IMC một trang', 'Mẫu kế hoạch IMC một trang, thang điểm tự chấm, mẹo thuyết trình và nguồn tham khảo.', {
    n: '9.3',
    g: [['Assemble the earlier chapters into a one-page plan', 'Ghép các chương trước thành kế hoạch một trang'], ['Self-assess with a rubric', 'Tự đánh giá bằng thang điểm'], ['Present the plan in five minutes', 'Trình bày kế hoạch trong năm phút']],
    b: [`<p>Use this template for an assignment or a real small project (a student club event, a café, a handmade product). All numbers in your plan must either be sourced, clearly marked as estimates, or labelled "to confirm".</p>
<table><thead><tr><th>Part</th><th>Content</th><th>Chapter</th></tr></thead><tbody>
<tr><td>1 Situation</td><td>Business goal, product, competitors, five facts, SWOT decisions</td><td>3</td></tr>
<tr><td>2 Audience</td><td>Persona, insight, buyer and influencers</td><td>3</td></tr>
<tr><td>3 Objective</td><td>One measurable communication objective with baseline, target, date</td><td>3</td></tr>
<tr><td>4 Message</td><td>Single-minded proposition, big idea, appeal, reason to believe, CTA</td><td>4</td></tr>
<tr><td>5 Tool roles</td><td>Which of advertising, PR, promotion, direct/digital, selling, events does which job</td><td>5, 6, 7</td></tr>
<tr><td>6 Media and schedule</td><td>Vehicles, reach/frequency goals, flighting, GRP or CPM estimates</td><td>8</td></tr>
<tr><td>7 Budget</td><td>Objective-and-task budget with a test share and sanity check</td><td>8</td></tr>
<tr><td>8 Measurement</td><td>Metrics by layer, baseline, decision rule, evaluation date</td><td>9</td></tr>
<tr><td>9 Risks and ethics</td><td>Legal and reputation risks, disclosure, data consent; what you will check with EPL201-level rules</td><td>5 to 7</td></tr></tbody></table>
<h4>Self-rubric (20 points)</h4>
<table><thead><tr><th>Criterion</th><th>Points</th></tr></thead><tbody>
<tr><td>Objective specific and measurable, with baseline</td><td>4</td></tr>
<tr><td>Message coherent across tools (stretch test passed)</td><td>4</td></tr>
<tr><td>Tool roles clear and justified by audience and stage</td><td>4</td></tr>
<tr><td>Budget and media numbers consistent, with assumptions stated</td><td>4</td></tr>
<tr><td>Metrics and decision rule; honest limits</td><td>4</td></tr></tbody></table>
<h4>Five-minute presentation</h4>
<ol><li>One slide: audience, insight, objective (60 seconds).</li>
<li>One slide: the idea and one example piece (60 seconds).</li>
<li>One slide: tools, schedule and budget (90 seconds).</li>
<li>One slide: metrics and decision rule (60 seconds).</li>
<li>One slide: risks, next steps (30 seconds). Leave time for questions.</li></ol>
<div class="callout"><strong>Sources.</strong> For facts about real companies use official sites, annual reports and reliable news, and write the date. When unsure, write "unverified" instead of guessing. Do not invent campaign results.</div>`,
       `<p>Dùng mẫu này cho bài tập hoặc một dự án nhỏ thật (sự kiện câu lạc bộ sinh viên, quán cà phê, sản phẩm thủ công). Mọi con số trong kế hoạch phải có nguồn, ghi rõ là ước lượng, hoặc gắn nhãn "cần xác nhận".</p>
<table><thead><tr><th>Phần</th><th>Nội dung</th><th>Chương</th></tr></thead><tbody>
<tr><td>1 Bối cảnh</td><td>Mục tiêu kinh doanh, sản phẩm, đối thủ, năm dữ kiện, quyết định từ SWOT</td><td>3</td></tr>
<tr><td>2 Đối tượng</td><td>Persona, insight, người mua và người ảnh hưởng</td><td>3</td></tr>
<tr><td>3 Mục tiêu</td><td>Một mục tiêu truyền thông đo được có mức nền, đích, ngày</td><td>3</td></tr>
<tr><td>4 Thông điệp</td><td>Đề xuất đơn nhất, ý tưởng lớn, kiểu thu hút, lý do tin, CTA</td><td>4</td></tr>
<tr><td>5 Vai trò công cụ</td><td>Quảng cáo, PR, khuyến mãi, trực tiếp/số, bán hàng, sự kiện: công cụ nào làm việc gì</td><td>5, 6, 7</td></tr>
<tr><td>6 Phương tiện và lịch</td><td>Phương tiện, mục tiêu reach/frequency, phát theo đợt, ước tính GRP hoặc CPM</td><td>8</td></tr>
<tr><td>7 Ngân sách</td><td>Ngân sách mục tiêu và nhiệm vụ có phần thử nghiệm và kiểm tra hợp lý</td><td>8</td></tr>
<tr><td>8 Đo lường</td><td>Chỉ số theo lớp, mức nền, quy tắc quyết định, ngày đánh giá</td><td>9</td></tr>
<tr><td>9 Rủi ro và đạo đức</td><td>Rủi ro pháp lý và danh tiếng, công khai, đồng ý dữ liệu; điều bạn sẽ kiểm với quy tắc cấp EPL201</td><td>5 đến 7</td></tr></tbody></table>
<h4>Thang tự chấm (20 điểm)</h4>
<table><thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead><tbody>
<tr><td>Mục tiêu cụ thể, đo được, có mức nền</td><td>4</td></tr>
<tr><td>Thông điệp nhất quán xuyên công cụ (đạt thử co giãn)</td><td>4</td></tr>
<tr><td>Vai trò công cụ rõ và có lý do theo đối tượng và giai đoạn</td><td>4</td></tr>
<tr><td>Ngân sách và số liệu phương tiện nhất quán, nêu giả định</td><td>4</td></tr>
<tr><td>Chỉ số và quy tắc quyết định; giới hạn trung thực</td><td>4</td></tr></tbody></table>
<h4>Thuyết trình năm phút</h4>
<ol><li>Một slide: đối tượng, insight, mục tiêu (60 giây).</li>
<li>Một slide: ý tưởng và một sản phẩm mẫu (60 giây).</li>
<li>Một slide: công cụ, lịch và ngân sách (90 giây).</li>
<li>Một slide: chỉ số và quy tắc quyết định (60 giây).</li>
<li>Một slide: rủi ro, bước tiếp theo (30 giây). Chừa thời gian hỏi đáp.</li></ol>
<div class="callout"><strong>Nguồn.</strong> Với dữ kiện về công ty thật, dùng trang chính thức, báo cáo thường niên và tin đáng tin, và ghi ngày. Khi chưa chắc, hãy viết "chưa kiểm chứng" thay vì đoán. Không bịa kết quả chiến dịch.</div>`],
    pit: ['Ten slides of logos and no numbers. Evaluators look for decisions linked to an audience and a metric.', 'Mười slide toàn logo và không có số liệu. Người chấm tìm các quyết định gắn với đối tượng và chỉ số.'],
    s: [['The one-page plan links situation, audience, objective, message, tools, media, budget, measurement and risks.', 'Kế hoạch một trang nối bối cảnh, đối tượng, mục tiêu, thông điệp, công cụ, phương tiện, ngân sách, đo lường và rủi ro.'], ['Mark every number as sourced, estimated or to confirm.', 'Đánh dấu mọi con số là có nguồn, ước lượng hay cần xác nhận.'], ['Next in the IMC track: legal and ethics (EPL201), omnichannel (OCM301), global (IGI301), crisis (CRM301), sustainability (SCO301).', 'Tiếp theo trong lộ trình IMC: pháp lý và đạo đức (EPL201), đa kênh (OCM301), toàn cầu (IGI301), khủng hoảng (CRM301), bền vững (SCO301).']],
    l: ['imc', 'mplan2', 'wharton', 'tgoogle'],
    p: [['Which two parts of the template must agree on the same metric?', 'Hai phần nào của mẫu phải thống nhất cùng một chỉ số?', 'Objective (part 3) and Measurement (part 8).', 'Mục tiêu (phần 3) và Đo lường (phần 8).'],
        ['Draft the first line of your plan: audience, measure, baseline, target, date.', 'Soạn dòng đầu kế hoạch của bạn: đối tượng, chỉ số, mức nền, đích, ngày.', 'Any answer following: Among [audience], move [measure] from [baseline] to [target] by [date].', 'Mọi đáp án theo mẫu: Trong [đối tượng], đưa [chỉ số] từ [mức nền] lên [đích] trước [ngày].']] }),

  Q(P + 'quiz-9', 'Chapter 9 quiz — Measuring effectiveness', 'Quiz Chương 9 — Đo lường hiệu quả', [
    qq('Impressions belong to which metric layer?', 'Lượt hiển thị thuộc lớp chỉ số nào?', ['Output|Đầu ra', 'Outcome|Tác động', 'Business result|Kết quả kinh doanh', 'None|Không lớp nào'], 0, 'They measure delivery.', 'Chúng đo việc phân phối.'),
    qq('A vanity metric is one that…', 'Chỉ số hư danh là chỉ số…', ['Is easy to inflate and drives no decision|Dễ thổi phồng và không dẫn tới quyết định', 'Is always wrong|Luôn sai', 'Is expensive|Đắt đỏ', 'Is legal|Hợp pháp'], 0, 'Ask: would a decision change if it doubled?', 'Hãy hỏi: nếu tăng gấp đôi, quyết định nào đổi?'),
    qq('Cost 40, incremental profit 60 (million VND). ROI?', 'Chi 40, lợi nhuận phụ trội 60 (triệu đồng). ROI?', ['50%|50%', '150%|150%', '20%|20%', '67%|67%'], 0, '(60 − 40) ÷ 40 = 0.5.', '(60 − 40) ÷ 40 = 0,5.'),
    qq('Last-click attribution tends to…', 'Attribution nhấp cuối có xu hướng…', ['Overvalue closing channels and undervalue awareness builders|Đánh giá cao kênh chốt và thấp công cụ tạo nhận biết', 'Credit TV most|Ghi công TV nhiều nhất', 'Ignore all clicks|Bỏ qua mọi lượt nhấp', 'Measure PR perfectly|Đo PR hoàn hảo'], 0, 'It gives all credit to the last touchpoint.', 'Nó dành toàn bộ công cho điểm chạm cuối.'),
    qq('MMM uses…', 'MMM dùng…', ['Aggregated data such as weekly sales and spend|Dữ liệu tổng hợp như doanh số tuần và chi tiêu', 'Only individual tracking|Chỉ theo dõi cá nhân', 'Only surveys|Chỉ khảo sát', 'Guesswork|Phỏng đoán'], 0, 'It estimates channel contributions statistically.', 'Nó ước lượng đóng góp kênh bằng thống kê.'),
    qq('A valid A/B test requires…', 'Một thử nghiệm A/B hợp lệ cần…', ['Random split and one change at a time|Chia ngẫu nhiên và mỗi lần một thay đổi', 'Changing five things at once|Đổi năm thứ một lúc', 'Stopping when it looks good|Dừng khi thấy ổn', 'No sample size|Không cần cỡ mẫu'], 0, 'Otherwise the difference cannot be attributed to the change.', 'Nếu không, khác biệt không thể quy cho thay đổi.'),
    qq('Why do holdout groups matter?', 'Vì sao nhóm giữ lại (holdout) quan trọng?', ['They show what would have happened without the campaign|Cho thấy điều sẽ xảy ra nếu không có chiến dịch', 'They lower the budget|Giảm ngân sách', 'They replace creative|Thay sáng tạo', 'They are required by law|Luật yêu cầu'], 0, 'They estimate incremental effect.', 'Chúng ước lượng hiệu ứng phụ trội.'),
    qq('In the capstone plan, every number should be…', 'Trong kế hoạch tổng kết, mọi con số nên…', ['Invented to look strong|Bịa cho mạnh', 'Sourced, marked as an estimate, or labelled to confirm|Có nguồn, ghi là ước lượng, hoặc gắn nhãn cần xác nhận', 'Rounded to 100|Làm tròn thành 100', 'Hidden|Giấu đi'], 1, 'Honest numbers build credibility.', 'Con số trung thực tạo uy tín.'),
  ]),
]));

export default secs;
