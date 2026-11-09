// Khoá TỰ SOẠN cho MMG301 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Giáo trình chuẩn: Kotler, Keller & Chernev "Marketing Management" 16th (Pearson). Ví dụ số là GIẢ ĐỊNH, đã tính lại bằng script.
const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const x = (s) => (Array.isArray(s) ? s[0] + '|||' + s[1] : (String(s).includes('|||') ? s : s + '|||' + s));
const W = 'https://en.wikipedia.org/wiki/';
const wk = (p, en, vi) => [W + p, 'Wikipedia — ' + en, 'Wikipedia — ' + vi];
const LK = {
  mkt: wk('Marketing', 'Marketing', 'Marketing'),
  mgmt: wk('Marketing_management', 'Marketing management', 'Quản trị marketing'),
  plan: wk('Marketing_plan', 'Marketing plan', 'Kế hoạch marketing'),
  mix: wk('Marketing_mix', 'Marketing mix (4P)', 'Marketing hỗn hợp (4P)'),
  strat: wk('Marketing_strategy', 'Marketing strategy', 'Chiến lược marketing'),
  myopia: wk('Marketing_myopia', 'Marketing myopia', 'Cận thị marketing'),
  swot: wk('SWOT_analysis', 'SWOT analysis', 'Phân tích SWOT'),
  gs: wk('Growth%E2%80%93share_matrix', 'Growth–share matrix (BCG)', 'Ma trận tăng trưởng – thị phần (BCG)'),
  ansoff: wk('Ansoff_matrix', 'Ansoff matrix', 'Ma trận Ansoff'),
  pestle: wk('PESTLE_analysis', 'PESTLE analysis', 'Phân tích PESTLE'),
  five: wk('Porter%27s_five_forces_analysis', 'Porter’s five forces', 'Năm lực lượng của Porter'),
  research: wk('Marketing_research', 'Marketing research', 'Nghiên cứu marketing'),
  forecast: wk('Demand_forecasting', 'Demand forecasting', 'Dự báo nhu cầu'),
  share: wk('Market_share', 'Market share', 'Thị phần'),
  comp: wk('Competitor_analysis', 'Competitor analysis', 'Phân tích đối thủ cạnh tranh'),
  cb: wk('Consumer_behaviour', 'Consumer behaviour', 'Hành vi người tiêu dùng'),
  bdp: wk('Buyer_decision_process', 'Buyer decision process', 'Quá trình ra quyết định mua'),
  maslow: wk('Maslow%27s_hierarchy_of_needs', 'Maslow’s hierarchy of needs', 'Tháp nhu cầu Maslow'),
  b2b: wk('Business_marketing', 'Business marketing (B2B)', 'Marketing tổ chức (B2B)'),
  bc: wk('Buying_center', 'Buying center', 'Trung tâm mua'),
  journey: wk('Customer_journey', 'Customer journey', 'Hành trình khách hàng'),
  cx: wk('Customer_experience', 'Customer experience', 'Trải nghiệm khách hàng'),
  clv: wk('Customer_lifetime_value', 'Customer lifetime value', 'Giá trị vòng đời khách hàng'),
  cac: wk('Customer_acquisition_cost', 'Customer acquisition cost', 'Chi phí thu hút khách hàng (CAC)'),
  crm: wk('Customer_relationship_management', 'Customer relationship management', 'Quản trị quan hệ khách hàng (CRM)'),
  nps: wk('Net_promoter_score', 'Net promoter score', 'Chỉ số NPS'),
  seg: wk('Market_segmentation', 'Market segmentation', 'Phân khúc thị trường'),
  tgt: wk('Target_market', 'Target market', 'Thị trường mục tiêu'),
  pos: wk('Positioning_(marketing)', 'Positioning (marketing)', 'Định vị (marketing)'),
  pmap: wk('Perceptual_mapping', 'Perceptual mapping', 'Bản đồ nhận thức'),
  equity: wk('Brand_equity', 'Brand equity', 'Giá trị thương hiệu'),
  prod: wk('Product_(business)', 'Product (business)', 'Sản phẩm (kinh doanh)'),
  plc: wk('Product_lifecycle', 'Product lifecycle', 'Vòng đời sản phẩm'),
  npd: wk('New_product_development', 'New product development', 'Phát triển sản phẩm mới'),
  doi: wk('Diffusion_of_innovations', 'Diffusion of innovations', 'Lan toả đổi mới'),
  serv: wk('Service_(economics)', 'Service (economics)', 'Dịch vụ (kinh tế học)'),
  servq: wk('SERVQUAL', 'SERVQUAL', 'SERVQUAL (đo chất lượng dịch vụ)'),
  pricing: wk('Pricing', 'Pricing', 'Định giá'),
  bep: wk('Break-even_(economics)', 'Break-even', 'Điểm hoà vốn'),
  elast: wk('Price_elasticity_of_demand', 'Price elasticity of demand', 'Độ co giãn của cầu theo giá'),
  skim: wk('Price_skimming', 'Price skimming', 'Hớt váng giá'),
  pen: wk('Penetration_pricing', 'Penetration pricing', 'Định giá thâm nhập'),
  vbp: wk('Value-based_pricing', 'Value-based pricing', 'Định giá theo giá trị'),
  cplus: wk('Cost-plus_pricing', 'Cost-plus pricing', 'Định giá cộng chi phí'),
  disc: wk('Price_discrimination', 'Price discrimination', 'Phân biệt giá'),
  dist: wk('Distribution_(marketing)', 'Distribution (marketing)', 'Phân phối (marketing)'),
  retail: wk('Retail', 'Retail', 'Bán lẻ'),
  omni: wk('Omnichannel', 'Omnichannel', 'Đa kênh hợp nhất (omnichannel)'),
  conflict: wk('Channel_conflict', 'Channel conflict', 'Xung đột kênh'),
  scm: wk('Supply_chain_management', 'Supply chain management', 'Quản trị chuỗi cung ứng'),
  imc: wk('Integrated_marketing_communications', 'Integrated marketing communications', 'Truyền thông marketing tích hợp'),
  adv: wk('Advertising', 'Advertising', 'Quảng cáo'),
  promo: wk('Promotion_(marketing)', 'Promotion (marketing)', 'Xúc tiến (marketing)'),
  pr: wk('Public_relations', 'Public relations', 'Quan hệ công chúng'),
  dig: wk('Digital_marketing', 'Digital marketing', 'Marketing số'),
  smm: wk('Social_media_marketing', 'Social media marketing', 'Marketing mạng xã hội'),
  seo: wk('Search_engine_optimization', 'Search engine optimization', 'Tối ưu công cụ tìm kiếm (SEO)'),
  content: wk('Content_marketing', 'Content marketing', 'Content marketing'),
  influ: wk('Influencer_marketing', 'Influencer marketing', 'Marketing người ảnh hưởng'),
  roi: wk('Return_on_investment', 'Return on investment', 'Tỷ suất hoàn vốn (ROI)'),
  meff: wk('Marketing_effectiveness', 'Marketing effectiveness', 'Hiệu quả marketing'),
  ethics: wk('Marketing_ethics', 'Marketing ethics', 'Đạo đức marketing'),
  csr: wk('Corporate_social_responsibility', 'Corporate social responsibility', 'Trách nhiệm xã hội doanh nghiệp'),
  green: wk('Greenwashing', 'Greenwashing', 'Tẩy xanh (greenwashing)'),
  gmk: wk('Green_marketing', 'Green marketing', 'Marketing xanh'),
  smk: wk('Sustainable_marketing', 'Sustainable marketing', 'Marketing bền vững'),
  vinamilk: wk('Vinamilk', 'Vinamilk', 'Vinamilk'),
  masan: wk('Masan_Group', 'Masan Group', 'Tập đoàn Masan'),
  shopee: wk('Shopee', 'Shopee', 'Shopee'),
  mwg: wk('Mobile_World_Investment_Corporation', 'Mobile World Investment Corporation', 'Mobile World (Thế Giới Di Động)'),
  keller: wk('Kevin_Lane_Keller', 'Kevin Lane Keller', 'Kevin Lane Keller'),
  kotler: wk('Philip_Kotler', 'Philip Kotler', 'Philip Kotler'),
  sharp: wk('Byron_Sharp', 'Byron Sharp', 'Byron Sharp'),
  ama: ['https://www.ama.org/the-definition-of-marketing-what-is-marketing/', 'American Marketing Association — the definition of marketing', 'Hiệp hội Marketing Hoa Kỳ (AMA) — định nghĩa marketing'],
  tgoogle: ['https://www.thinkwithgoogle.com/consumer-insights/', 'Think with Google — consumer insights and trends', 'Think with Google — insight và xu hướng người tiêu dùng'],
  ocw: ['https://ocw.mit.edu/search/?q=marketing', 'MIT OpenCourseWare — marketing courses', 'MIT OpenCourseWare — các khoá marketing'],
  unGC: ['https://www.unglobalcompact.org/', 'UN Global Compact — corporate sustainability', 'Liên Hợp Quốc Global Compact — phát triển bền vững doanh nghiệp'],
  vnm: ['https://www.vinamilk.com.vn/en', 'Vinamilk — official site (product lines)', 'Vinamilk — trang chính thức (các dòng sản phẩm)'],
};
const lk = (ks, i) => '<ul>' + ks.map((k) => { if (!LK[k]) throw new Error('thiếu link ' + k); return '<li><a href="' + LK[k][0] + '" target="_blank" rel="noopener">' + LK[k][i] + '</a></li>'; }).join('') + '</ul>';
const tbl = (head, rows) => '<table><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
const fm = (lbl, body) => '<div class="formula"><span class="lbl">' + lbl + '</span>' + body + '</div>';
// o: {n, g:[[en,vi]], en:html, vi:html, pit:[en,vi], s:[[en,vi]], l:[keys], p:[[qen,qvi,aen,avi]]}
const build = (o, L) => {
  const I = L === 'en' ? 0 : 1;
  const T = L === 'en'
    ? { goals: 'Lesson goals', lec: 'Lesson', pit: 'Common mistakes', sum: '📌 Summary', more: '🔗 Learn more', prac: '🧪 Practice', ans: 'Answer', les: 'Lesson ' }
    : { goals: 'Mục tiêu bài', lec: 'Bài giảng', pit: 'Lỗi hay gặp', sum: '📌 Tóm tắt', more: '🔗 Học thêm', prac: '🧪 Tự luyện', ans: 'Đáp án', les: 'Bài ' };
  let h = '<span class="eyebrow">MMG301 · ' + T.les + o.n + '</span>\n';
  h += '<h3>' + T.goals + '</h3><ul>' + o.g.map((g) => '<li>' + g[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.lec + '</h3>' + (I === 0 ? o.en : o.vi) + '\n';
  if (o.pit) h += '<div class="pitfall"><strong>' + T.pit + '.</strong> ' + o.pit[I] + '</div>\n';
  h += '<h3>' + T.sum + '</h3><ul>' + o.s.map((s) => '<li>' + s[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.more + '</h3>' + lk(o.l, 1 + I) + '\n';
  h += '<h3>' + T.prac + '</h3><ol>' + o.p.map((p) => '<li>' + p[I] + '<div class="dap-an"><strong>' + T.ans + ':</strong> ' + p[2 + I] + '</div></li>').join('') + '</ol>';
  return h;
};
const D = (slug, en, vi, desc, o) => ({ title: en + '|||' + vi, slug, type: 'DOCUMENT', description: desc, content: bi(build(o, 'en'), build(o, 'vi')) });
const Q = (slug, en, vi, qs) => ({ title: en + '|||' + vi, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 600, questions: qs.map((q, i) => ({ id: 'q' + (i + 1), question: x([q[0], q[1]]), options: q[2].map(x), correctIndex: q[3], points: 1, explanation: x([q[4], q[5]]) })) } });
const SEC = (en, vi, desc, lessons) => ({ title: en + '|||' + vi, description: desc, lessons });
const P = 'mmg301-ts-';
const secs = [];
const NOTE_EN = 'Figures in worked examples are hypothetical teaching numbers, not real company data.';
const NOTE_VI = 'Số liệu trong ví dụ là số giả định để dạy, không phải số liệu thật của doanh nghiệp.';
// ===== Mục 0 =====
secs.push(SEC('Section 0 — Course framework (self-authored, no FLM syllabus)', 'Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  'Giới thiệu MMG301, chuẩn đầu ra tự soạn, giáo trình và tài liệu học.', [
  D(P + '0-1', '0.1 About MMG301 — Marketing Management', '0.1 Giới thiệu môn MMG301 — Quản trị marketing',
    'MMG301 là môn gì, học để làm gì, học xong làm được gì; lưu ý khung môn tự soạn.', {
    n: '0.1',
    g: [['Understand what MMG301 is and how it differs from introductory marketing', 'Hiểu MMG301 là môn gì và khác marketing căn bản ở đâu'],
        ['Know the 8 self-authored learning outcomes', 'Nắm 8 chuẩn đầu ra tự soạn'],
        ['See the map of the 8 chapters', 'Nắm bản đồ 8 chương của khoá']],
    en: `<div class="callout"><strong>⚠️ Notice.</strong> The university has not published an MMG301 syllabus on FLM (checked by code, variants and name on 09/11/2026). This outline is self-authored from the standard textbook (Kotler, Keller &amp; Chernev, <em>Marketing Management</em>). Grading scheme and exam schedule follow your lecturer.</div>
<p><strong>What it is.</strong> Introductory marketing teaches the vocabulary: needs, 4Ps, segmentation. <em>Marketing management</em> asks how a manager decides: which market to enter, which customers to serve, what to offer at what price, through which channels, with which messages, and how to know it worked. It is a decision-making subject, with numbers (break-even, market share, customer lifetime value, return on marketing) as well as concepts.</p>
<p><strong>Why it matters.</strong> Whether you join a brand team at a consumer-goods company, a marketplace such as Shopee, a retail chain, an agency, or you start your own business, you will write or defend a marketing plan and justify its budget. This subject gives you the structure and the arithmetic to do so.</p>
<h4>Learning outcomes (self-authored)</h4>
<ol><li>Explain the marketing management process and write a simple marketing plan with objectives, strategy, budget and controls.</li>
<li>Analyse the environment (PESTLE, five forces) and plan a basic market research study.</li>
<li>Estimate market demand, market share and customer lifetime value with correct arithmetic.</li>
<li>Describe consumer and business buying behaviour and map a customer journey.</li>
<li>Segment a market, choose targets and write a positioning statement.</li>
<li>Make product, service, life-cycle and pricing decisions, including break-even and elasticity calculations.</li>
<li>Design channels and an integrated communication mix, including digital and social media.</li>
<li>Track marketing metrics, judge a marketing programme, and spot ethical and sustainability problems.</li></ol>
<h4>Related subjects</h4>
<p>MMG301 normally follows an introductory marketing subject (MKT101 in the FPTU framework). Follow-up subjects (digital marketing, advertising, brand management) are not published for this code; ask your academic office. Chapter map: 1 Concepts and the plan · 2 Environment and research · 3 Buying behaviour · 4 STP · 5 Product and service · 6 Pricing · 7 Channels and communication · 8 Metrics, ethics and capstone. Brand-equity theory is only summarised here; the BRA201 course on this site covers it in depth.</p>
<h4>How to study</h4>
<p>Pick one Vietnamese company and one international company. After each chapter write five lines applying it to both, and redo every calculation by hand once. ` + NOTE_EN + `</p>`,
    vi: `<div class="callout"><strong>⚠️ Lưu ý.</strong> Trường chưa công bố syllabus của MMG301 trên FLM (đã dò theo mã, biến thể mã và tên ngày 09/11/2026). Khung này soạn theo giáo trình chuẩn (Kotler, Keller &amp; Chernev, <em>Marketing Management</em>); cách tính điểm và lịch thi theo giảng viên của lớp bạn.</div>
<p><strong>Là môn gì.</strong> Marketing căn bản dạy từ vựng: nhu cầu, 4P, phân khúc. <em>Quản trị marketing</em> hỏi: nhà quản lý quyết định thế nào — vào thị trường nào, phục vụ khách hàng nào, chào bán gì ở mức giá nào, qua kênh nào, bằng thông điệp nào, và biết bằng cách nào là đã hiệu quả. Đây là môn ra quyết định, có cả con số (hoà vốn, thị phần, giá trị vòng đời khách hàng, hiệu quả marketing) lẫn khái niệm.</p>
<p><strong>Để làm gì.</strong> Dù bạn vào nhóm thương hiệu của công ty hàng tiêu dùng, sàn như Shopee, chuỗi bán lẻ, agency, hay tự khởi nghiệp, bạn đều phải viết hoặc bảo vệ một kế hoạch marketing và giải trình ngân sách. Môn này cho bạn khung cấu trúc và phép tính để làm việc đó.</p>
<h4>Chuẩn đầu ra (tự soạn)</h4>
<ol><li>Giải thích quy trình quản trị marketing và viết kế hoạch marketing đơn giản gồm mục tiêu, chiến lược, ngân sách và kiểm soát.</li>
<li>Phân tích môi trường (PESTLE, năm lực lượng) và lập kế hoạch một nghiên cứu thị trường cơ bản.</li>
<li>Ước lượng cầu thị trường, thị phần và giá trị vòng đời khách hàng với phép tính đúng.</li>
<li>Mô tả hành vi mua của người tiêu dùng và tổ chức, vẽ hành trình khách hàng.</li>
<li>Phân khúc thị trường, chọn thị trường mục tiêu và viết tuyên bố định vị.</li>
<li>Ra quyết định sản phẩm, dịch vụ, vòng đời và giá, gồm tính hoà vốn và độ co giãn.</li>
<li>Thiết kế kênh phân phối và bộ truyền thông tích hợp, gồm marketing số và mạng xã hội.</li>
<li>Theo dõi chỉ số marketing, đánh giá một chương trình marketing và nhận ra vấn đề đạo đức, bền vững.</li></ol>
<h4>Môn liên quan</h4>
<p>MMG301 thường học sau môn marketing căn bản (MKT101 trong khung FPTU). Môn học tiếp (marketing số, quảng cáo, quản trị thương hiệu) chưa được công bố cho mã này; hỏi phòng đào tạo. Bản đồ chương: 1 Khái niệm và kế hoạch · 2 Môi trường và nghiên cứu · 3 Hành vi mua · 4 STP · 5 Sản phẩm và dịch vụ · 6 Giá · 7 Kênh và truyền thông · 8 Chỉ số, đạo đức và tổng kết. Lý thuyết giá trị thương hiệu chỉ tóm tắt ở đây; khoá BRA201 trên trang này học sâu hơn.</p>
<h4>Cách học</h4>
<p>Chọn một công ty Việt và một công ty quốc tế. Sau mỗi chương viết năm dòng áp vào cả hai, và tự tính lại mọi phép tính bằng tay một lần. ` + NOTE_VI + `</p>`,
    pit: ['Memorising 4P lists without ever doing the arithmetic; exams and jobs both ask for numbers.', 'Học thuộc danh sách 4P mà không bao giờ tự tính; cả đề thi lẫn công việc đều cần con số.'],
    s: [['MMG301 = marketing decisions plus the numbers behind them.', 'MMG301 = quyết định marketing cùng các con số đứng sau.'],
        ['No FLM syllabus exists: this outline follows Kotler, Keller & Chernev.', 'Chưa có syllabus trên FLM: khung này bám Kotler, Keller & Chernev.'],
        ['Apply every chapter to one Vietnamese and one international company.', 'Áp từng chương vào một công ty Việt và một công ty quốc tế.']],
    l: ['mgmt', 'ama', 'kotler'],
    p: [['Name one difference between introductory marketing and marketing management.', 'Nêu một điểm khác giữa marketing căn bản và quản trị marketing.', 'Introductory marketing teaches concepts; management focuses on choosing among options and justifying them with numbers.', 'Marketing căn bản dạy khái niệm; quản trị tập trung chọn giữa các phương án và biện minh bằng con số.'],
        ['Which company will you follow through the course, and why?', 'Bạn sẽ theo dõi công ty nào xuyên suốt khoá, vì sao?', 'Any answer is fine if public information about its products, prices, channels and promotion is easy to find.', 'Công ty nào cũng được nếu dễ tìm thông tin công khai về sản phẩm, giá, kênh và xúc tiến.']] }),

  D(P + '0-2', '0.2 Textbooks & resources', '0.2 Giáo trình & tài liệu',
    'Giáo trình chuẩn có ISBN, khoá học mở và nguồn tra cứu đã kiểm.', {
    n: '0.2',
    g: [['Choose a main textbook and a reference', 'Chọn giáo trình chính và một sách tham khảo'], ['Know free sources for definitions, cases and insights', 'Biết nguồn miễn phí để tra định nghĩa, tình huống và insight']],
    en: `<h4>Books (ISBNs seen on Pearson's catalogue and bookseller listings)</h4>
<ul><li><strong>Marketing Management, Global Edition</strong>, Philip Kotler, Kevin Lane Keller and Alexander Chernev, 16th edition, Pearson. Paperback ISBN 978-1-292-40481-3. <em>Main textbook of this outline.</em> The US edition has a different ISBN; check the number on your copy.</li>
<li><strong>Principles of Marketing, Global Edition</strong>, Philip Kotler and Gary Armstrong, 19th edition, Pearson. Paperback ISBN 978-1-292-44936-4. Gentler, good for revising MKT101 basics.</li>
<li><strong>How Brands Grow</strong>, Byron Sharp, Oxford University Press. A research-based counterpoint on how brands win share (ISBN not verified, so not listed).</li></ul>
<p>Newer editions may exist; this course does not depend on page numbers.</p>
<h4>Free resources</h4>` + lk(['ama', 'tgoogle', 'ocw', 'vnm'], 1) + `<p><strong>Study routine.</strong> Each week read one chapter, collect two real examples from the company websites or news, and redo the worked numbers. Wikipedia pages linked in lessons are for quick definitions; for assignments cite the textbooks.</p>`,
    vi: `<h4>Sách (ISBN đã thấy trên danh mục Pearson và các nhà sách)</h4>
<ul><li><strong>Marketing Management, Global Edition</strong>, Philip Kotler, Kevin Lane Keller và Alexander Chernev, lần xuất bản 16, Pearson. Bản bìa mềm ISBN 978-1-292-40481-3. <em>Giáo trình chính của khung này.</em> Bản Mỹ có ISBN khác; hãy xem số in trên cuốn của bạn.</li>
<li><strong>Principles of Marketing, Global Edition</strong>, Philip Kotler và Gary Armstrong, lần xuất bản 19, Pearson. Bản bìa mềm ISBN 978-1-292-44936-4. Dễ đọc hơn, hợp để ôn nền MKT101.</li>
<li><strong>How Brands Grow</strong>, Byron Sharp, Oxford University Press. Góc nhìn dựa trên nghiên cứu về cách thương hiệu giành thị phần (chưa kiểm ISBN nên không ghi).</li></ul>
<p>Có thể đã có lần xuất bản mới hơn; khoá này không phụ thuộc số trang.</p>
<h4>Nguồn miễn phí</h4>` + lk(['ama', 'tgoogle', 'ocw', 'vnm'], 2) + `<p><strong>Thói quen học.</strong> Mỗi tuần đọc một chương, thu hai ví dụ thật từ website công ty hoặc báo chí, và tính lại các con số trong bài. Các trang Wikipedia trong bài dùng để tra định nghĩa nhanh; bài tập hãy trích giáo trình.</p>`,
    s: [['Main book: Kotler, Keller & Chernev, 16th ed.', 'Sách chính: Kotler, Keller & Chernev, lần 16.'], ['Principles of Marketing is the gentler companion.', 'Principles of Marketing là cuốn đồng hành nhẹ nhàng hơn.']],
    l: ['mkt', 'strat'],
    p: [['Which edition of the main book will you use, and what ISBN is printed on it?', 'Bạn dùng lần xuất bản nào của sách chính, ISBN in trên sách là gì?', 'Check your own copy; the global paperback of the 16th edition is 978-1-292-40481-3.', 'Xem cuốn của bạn; bản global bìa mềm lần 16 là 978-1-292-40481-3.']] }),
]));
// ===== Chương 1 =====
secs.push(SEC('Chapter 1 — Marketing concepts and the marketing plan', 'Chương 1 — Khái niệm marketing và kế hoạch marketing',
  'Quản trị marketing, các định hướng, kế hoạch marketing và giá trị vòng đời khách hàng.', [
  D(P + '1-1', '1.1 What marketing management is', '1.1 Quản trị marketing là gì',
    'Định nghĩa, các định hướng kinh doanh, marketing toàn diện.', {
    n: '1.1',
    g: [['Define marketing and marketing management', 'Định nghĩa marketing và quản trị marketing'], ['Compare the five company orientations', 'So sánh năm định hướng của doanh nghiệp'], ['Explain holistic marketing in one paragraph', 'Giải thích marketing toàn diện trong một đoạn']],
    en: `<p><strong>Definition.</strong> The American Marketing Association describes marketing as the activity, set of institutions and processes for creating, communicating, delivering and exchanging offerings that have value for customers, clients, partners and society at large. Kotler and Keller add a managerial view: <em>marketing management</em> is the art and science of choosing target markets and getting, keeping and growing customers by creating, delivering and communicating superior customer value.</p>
<h4>Five orientations</h4>` + tbl(['Orientation', 'Belief', 'Risk'], [
      ['Production', 'Customers want cheap, available goods', 'Ignores what customers actually value'],
      ['Product', 'Customers want the best quality', 'Falls in love with the product, not the need'],
      ['Selling', 'Customers must be pushed to buy', 'Short-term sales, weak loyalty'],
      ['Marketing', 'Start from target customers\' needs and integrate all activities', 'Needs real research and cross-department work'],
      ['Holistic', 'Everything matters: customers, partners, employees, society', 'Complex; needs clear priorities']]) + `
<p><strong>Marketing myopia.</strong> Theodore Levitt argued that firms fail when they define their business by the product (“we make railways”) rather than the customer need (“we move people”). A Vietnamese example of the opposite thinking: a coffee chain that defines itself as providing a place to meet and work, not only cups of coffee, will decide on seating, wifi and app ordering differently.</p>
<p><strong>Holistic marketing</strong> has four parts: relationship marketing (customers, partners), integrated marketing (the 4Ps plus all activities pulling the same way), internal marketing (employees deliver the promise) and performance marketing (results, including social impact).</p>
<h4>The manager's tasks</h4>
<p>Develop strategies and plans; capture insights (data, research); connect with customers; build strong brands; shape offerings; deliver and communicate value; create long-term growth. The rest of this course follows that list.</p>`,
    vi: `<p><strong>Định nghĩa.</strong> Hiệp hội Marketing Hoa Kỳ mô tả marketing là hoạt động, tập hợp các tổ chức và quy trình nhằm tạo ra, truyền thông, phân phối và trao đổi những chào bán có giá trị với khách hàng, đối tác và xã hội nói chung. Kotler và Keller thêm góc nhìn quản trị: <em>quản trị marketing</em> là nghệ thuật và khoa học chọn thị trường mục tiêu, thu hút, giữ và phát triển khách hàng bằng cách tạo ra, phân phối và truyền thông giá trị vượt trội cho khách hàng.</p>
<h4>Năm định hướng</h4>` + tbl(['Định hướng', 'Niềm tin', 'Rủi ro'], [
      ['Sản xuất', 'Khách hàng muốn hàng rẻ, sẵn có', 'Bỏ qua điều khách hàng thật sự coi trọng'],
      ['Sản phẩm', 'Khách hàng muốn chất lượng tốt nhất', 'Yêu sản phẩm hơn yêu nhu cầu'],
      ['Bán hàng', 'Phải thúc khách mới mua', 'Doanh số ngắn hạn, trung thành yếu'],
      ['Marketing', 'Xuất phát từ nhu cầu khách hàng mục tiêu và phối hợp mọi hoạt động', 'Cần nghiên cứu thật và phối hợp liên phòng ban'],
      ['Toàn diện', 'Mọi thứ đều quan trọng: khách hàng, đối tác, nhân viên, xã hội', 'Phức tạp; cần ưu tiên rõ']]) + `
<p><strong>Cận thị marketing.</strong> Theodore Levitt lập luận doanh nghiệp thất bại khi định nghĩa việc kinh doanh theo sản phẩm (“chúng tôi làm đường sắt”) thay vì nhu cầu khách hàng (“chúng tôi chở con người”). Ví dụ tư duy ngược lại: chuỗi cà phê coi mình cung cấp nơi gặp gỡ và làm việc, không chỉ bán ly cà phê, sẽ quyết định khác về chỗ ngồi, wifi và đặt hàng qua app.</p>
<p><strong>Marketing toàn diện</strong> có bốn phần: marketing quan hệ (khách hàng, đối tác), marketing tích hợp (4P và mọi hoạt động cùng hướng), marketing nội bộ (nhân viên thực hiện lời hứa) và marketing hiệu suất (kết quả, gồm tác động xã hội).</p>
<h4>Nhiệm vụ của nhà quản trị</h4>
<p>Xây chiến lược và kế hoạch; thu thập insight (dữ liệu, nghiên cứu); kết nối khách hàng; xây thương hiệu mạnh; định hình chào bán; phân phối và truyền thông giá trị; tạo tăng trưởng dài hạn. Phần còn lại của khoá đi theo danh sách này.</p>`,
    pit: ['Calling any sales push “marketing”. Selling starts from the product; marketing starts from the customer need.', 'Gọi mọi nỗ lực bán hàng là “marketing”. Bán hàng xuất phát từ sản phẩm; marketing xuất phát từ nhu cầu khách hàng.'],
    s: [['Marketing management = choosing targets and creating, delivering, communicating value.', 'Quản trị marketing = chọn mục tiêu và tạo ra, phân phối, truyền thông giá trị.'], ['Five orientations: production, product, selling, marketing, holistic.', 'Năm định hướng: sản xuất, sản phẩm, bán hàng, marketing, toàn diện.'], ['Holistic marketing = relationship + integrated + internal + performance.', 'Marketing toàn diện = quan hệ + tích hợp + nội bộ + hiệu suất.']],
    l: ['ama', 'myopia', 'mgmt'],
    p: [['A firm that sells film cameras defines its business as “cameras”. Which mistake is this?', 'Hãng bán máy ảnh phim tự định nghĩa là “máy ảnh”. Đây là lỗi gì?', 'Marketing myopia: defining the business by product, not by the need (capturing and sharing memories).', 'Cận thị marketing: định nghĩa theo sản phẩm thay vì nhu cầu (lưu giữ và chia sẻ kỷ niệm).'],
        ['Which orientation is a startup using if it builds a feature because the founders like it?', 'Startup làm tính năng vì nhà sáng lập thích đang theo định hướng nào?', 'Product orientation.', 'Định hướng sản phẩm.']] }),

  D(P + '1-2', '1.2 The marketing plan and strategic tools', '1.2 Kế hoạch marketing và các công cụ chiến lược',
    'Cấu trúc kế hoạch marketing, SWOT, Ansoff, BCG.', {
    n: '1.2',
    g: [['List the sections of a marketing plan', 'Liệt kê các phần của kế hoạch marketing'], ['Use SWOT, Ansoff and the growth-share matrix', 'Dùng SWOT, Ansoff và ma trận tăng trưởng – thị phần'], ['Turn objectives into SMART targets', 'Biến mục tiêu thành mục tiêu SMART']],
    en: `<p>A marketing plan turns analysis into action. A typical structure:</p>
<ol><li><strong>Executive summary</strong> — one page for busy readers.</li><li><strong>Situation analysis</strong> — market, customers, competitors, company (SWOT).</li><li><strong>Objectives</strong> — financial (profit, revenue) and marketing (share, awareness, retention), written as SMART: specific, measurable, achievable, relevant, time-bound.</li><li><strong>Strategy</strong> — target segments, positioning, value proposition.</li><li><strong>Marketing mix programmes</strong> — product, price, place, promotion and who does what by when.</li><li><strong>Budget</strong> — expected revenue minus costs; break-even.</li><li><strong>Controls</strong> — metrics, review dates, contingency plans.</li></ol>
<h4>SWOT in practice</h4>
<p>Strengths and weaknesses are <em>internal</em> (brand, cost, people); opportunities and threats are <em>external</em> (trends, rivals, regulation). The mistake is stopping at a list. Good SWOT pairs items: use a strength to capture an opportunity (SO), fix a weakness that blocks an opportunity (WO), use a strength to defend a threat (ST).</p>
<h4>Ansoff growth matrix</h4>` + tbl(['', 'Existing products', 'New products'], [['Existing markets', 'Market penetration', 'Product development'], ['New markets', 'Market development', 'Diversification']]) + `<p>Risk rises as you move away from the current corner. A dairy company selling more of its current milk to current shoppers is penetrating; launching a plant-based drink to the same shoppers is product development; taking the current range abroad is market development.</p>
<h4>Growth-share (BCG) matrix</h4>
<p>Business units are placed by market growth and relative market share: <em>stars</em> (high/high) need investment, <em>cash cows</em> (low growth/high share) fund the rest, <em>question marks</em> (high growth/low share) need a decision, <em>dogs</em> (low/low) are candidates to fix or exit. Relative share = your share ÷ the largest competitor's share. Critics note that market definition drives the result, so use it as a conversation starter, not a verdict.</p>
<div class="note-ct">Link to branding: the positioning choices in the plan are explained in Chapter 4 and, for brand equity, in the BRA201 course.</div>`,
    vi: `<p>Kế hoạch marketing biến phân tích thành hành động. Cấu trúc điển hình:</p>
<ol><li><strong>Tóm tắt điều hành</strong> — một trang cho người bận.</li><li><strong>Phân tích tình huống</strong> — thị trường, khách hàng, đối thủ, doanh nghiệp (SWOT).</li><li><strong>Mục tiêu</strong> — tài chính (lợi nhuận, doanh thu) và marketing (thị phần, nhận biết, giữ chân), viết theo SMART: cụ thể, đo được, khả thi, liên quan, có thời hạn.</li><li><strong>Chiến lược</strong> — phân khúc mục tiêu, định vị, đề xuất giá trị.</li><li><strong>Chương trình marketing hỗn hợp</strong> — sản phẩm, giá, phân phối, xúc tiến và ai làm gì khi nào.</li><li><strong>Ngân sách</strong> — doanh thu kỳ vọng trừ chi phí; hoà vốn.</li><li><strong>Kiểm soát</strong> — chỉ số, ngày rà soát, kế hoạch dự phòng.</li></ol>
<h4>SWOT trong thực tế</h4>
<p>Điểm mạnh và điểm yếu là <em>bên trong</em> (thương hiệu, chi phí, nhân sự); cơ hội và thách thức là <em>bên ngoài</em> (xu hướng, đối thủ, quy định). Lỗi phổ biến là dừng ở danh sách. SWOT tốt ghép cặp: dùng điểm mạnh nắm cơ hội (SO), sửa điểm yếu đang cản cơ hội (WO), dùng điểm mạnh đỡ thách thức (ST).</p>
<h4>Ma trận tăng trưởng Ansoff</h4>` + tbl(['', 'Sản phẩm hiện có', 'Sản phẩm mới'], [['Thị trường hiện có', 'Thâm nhập thị trường', 'Phát triển sản phẩm'], ['Thị trường mới', 'Phát triển thị trường', 'Đa dạng hoá']]) + `<p>Rủi ro tăng khi rời xa góc hiện tại. Công ty sữa bán thêm sữa hiện có cho người mua hiện có là thâm nhập; ra đồ uống thực vật cho cùng nhóm người mua là phát triển sản phẩm; mang dòng sản phẩm hiện có ra nước ngoài là phát triển thị trường.</p>
<h4>Ma trận tăng trưởng – thị phần (BCG)</h4>
<p>Các đơn vị kinh doanh được đặt theo tăng trưởng thị trường và thị phần tương đối: <em>ngôi sao</em> (cao/cao) cần đầu tư, <em>bò sữa</em> (tăng trưởng thấp/thị phần cao) nuôi phần còn lại, <em>dấu hỏi</em> (tăng trưởng cao/thị phần thấp) cần quyết định, <em>chó</em> (thấp/thấp) là ứng viên để sửa hoặc rút. Thị phần tương đối = thị phần của bạn ÷ thị phần của đối thủ lớn nhất. Giới phê bình chỉ ra cách định nghĩa thị trường quyết định kết quả, nên dùng như mở đầu thảo luận chứ không phải phán quyết.</p>
<div class="note-ct">Liên kết thương hiệu: các lựa chọn định vị trong kế hoạch được giải thích ở Chương 4 và, với giá trị thương hiệu, ở khoá BRA201.</div>`,
    pit: ['Objectives such as “increase awareness” with no number or date cannot be controlled later.', 'Mục tiêu kiểu “tăng nhận biết” không có số và ngày thì sau này không kiểm soát được.'],
    s: [['A plan runs from analysis to objectives, strategy, programmes, budget, controls.', 'Kế hoạch đi từ phân tích đến mục tiêu, chiến lược, chương trình, ngân sách, kiểm soát.'], ['SWOT is useful only when items are paired into actions.', 'SWOT chỉ hữu ích khi ghép thành hành động.'], ['Ansoff: penetration, product development, market development, diversification.', 'Ansoff: thâm nhập, phát triển sản phẩm, phát triển thị trường, đa dạng hoá.'], ['BCG: relative share = your share ÷ largest rival share.', 'BCG: thị phần tương đối = thị phần của bạn ÷ thị phần đối thủ lớn nhất.']],
    l: ['plan', 'swot', 'ansoff', 'gs'],
    p: [['Rewrite “grow the Hanoi store” as a SMART objective.', 'Viết lại “phát triển cửa hàng Hà Nội” thành mục tiêu SMART.', 'Example: raise the Hanoi store monthly revenue by 15% within 6 months, measured on POS data.', 'Ví dụ: tăng doanh thu tháng của cửa hàng Hà Nội 15% trong 6 tháng, đo bằng dữ liệu POS.'],
        ['Your share is 12%, the leader has 30%. What is relative share, and what does it mean?', 'Thị phần bạn 12%, đầu ngành 30%. Thị phần tương đối là bao nhiêu, ý nghĩa?', '12 ÷ 30 = 0.4: you sell 40% of what the leader sells.', '12 ÷ 30 = 0,4: bạn bán bằng 40% đầu ngành.']] }),

  D(P + '1-3', '1.3 Customer value, satisfaction and lifetime value', '1.3 Giá trị khách hàng, sự hài lòng và giá trị vòng đời',
    'Giá trị cảm nhận, hài lòng, CLV và CAC có ví dụ số.', {
    n: '1.3',
    g: [['Explain customer-perceived value and satisfaction', 'Giải thích giá trị cảm nhận và sự hài lòng'], ['Compute customer lifetime value (CLV) with retention and discount', 'Tính giá trị vòng đời khách hàng (CLV) với tỷ lệ giữ chân và chiết khấu'], ['Compare CLV with acquisition cost', 'So CLV với chi phí thu hút khách hàng']],
    en: `<p><strong>Customer-perceived value</strong> = total customer benefit minus total customer cost (price, time, effort, risk). A customer buys from the offer with the highest perceived value, not necessarily the lowest price. <strong>Satisfaction</strong> compares perceived performance with expectation: below expectation disappoints, matching satisfies, above delights. Delighted customers are more likely to stay and recommend.</p>
<h4>Why lifetime value</h4>
<p>One sale is small; a relationship is large. Customer lifetime value (CLV) is the present value of the profit expected from a customer. A simple, widely taught formula for annual margin <em>m</em>, retention rate <em>r</em> and discount rate <em>d</em> (first margin received at the end of year 1, retention applied each year):</p>` + fm('CLV (simple)', 'CLV = m × r ÷ (1 + d − r)') + `
<div class="callout"><strong>Worked example (hypothetical).</strong> A coffee-app customer spends 2,400,000 VND per year at a 25% gross margin, so m = 600,000 VND. Retention r = 0.80, discount d = 0.10.<br>Expected lifetime without discount = 1 ÷ (1 − 0.80) = 5 years, so undiscounted profit = 5 × 600,000 = 3,000,000 VND.<br>Discounted CLV = 600,000 × 0.80 ÷ (1 + 0.10 − 0.80) = 480,000 ÷ 0.30 = <strong>1,600,000 VND</strong>.<br>If acquiring this customer costs CAC = 500,000 VND, CLV ÷ CAC = 3.2 and net value = 1,100,000 VND. A common rule of thumb is that a ratio near 3 or more is healthy, but it depends on payback time and cash.</div>
<h4>Using it</h4>
<p>CLV tells you how much you may spend to win a customer, which segments deserve loyalty programmes, and why raising retention from 80% to 90% is powerful: with the same m and d, CLV becomes 600,000 × 0.9 ÷ 0.2 = 2,700,000 VND, a rise of 69%. Customer relationship management (CRM) systems store the history needed to estimate m and r per segment.</p>
<p>Caution: r and m are estimates; they change by cohort and by channel. Always show a low and a high case.</p>`,
    vi: `<p><strong>Giá trị khách hàng cảm nhận</strong> = tổng lợi ích khách hàng nhận được trừ tổng chi phí khách hàng bỏ ra (tiền, thời gian, công sức, rủi ro). Khách hàng mua ở chào bán có giá trị cảm nhận cao nhất, không nhất thiết giá thấp nhất. <strong>Sự hài lòng</strong> so hiệu quả cảm nhận với kỳ vọng: thấp hơn thì thất vọng, bằng thì hài lòng, vượt thì thích thú. Khách hàng thích thú dễ ở lại và giới thiệu hơn.</p>
<h4>Vì sao cần giá trị vòng đời</h4>
<p>Một giao dịch nhỏ; một mối quan hệ lớn. Giá trị vòng đời khách hàng (CLV) là giá trị hiện tại của lợi nhuận kỳ vọng từ một khách hàng. Công thức đơn giản thường dạy, với biên lợi nhuận hằng năm <em>m</em>, tỷ lệ giữ chân <em>r</em> và tỷ lệ chiết khấu <em>d</em> (khoản đầu nhận cuối năm 1, giữ chân áp mỗi năm):</p>` + fm('CLV (đơn giản)', 'CLV = m × r ÷ (1 + d − r)') + `
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Một khách dùng app cà phê chi 2.400.000 đồng mỗi năm, biên lợi nhuận gộp 25%, nên m = 600.000 đồng. Giữ chân r = 0,80, chiết khấu d = 0,10.<br>Tuổi đời kỳ vọng chưa chiết khấu = 1 ÷ (1 − 0,80) = 5 năm, nên lợi nhuận chưa chiết khấu = 5 × 600.000 = 3.000.000 đồng.<br>CLV chiết khấu = 600.000 × 0,80 ÷ (1 + 0,10 − 0,80) = 480.000 ÷ 0,30 = <strong>1.600.000 đồng</strong>.<br>Nếu thu hút khách này tốn CAC = 500.000 đồng thì CLV ÷ CAC = 3,2 và giá trị ròng = 1.100.000 đồng. Quy tắc kinh nghiệm hay gặp là tỷ lệ gần 3 trở lên là khoẻ, nhưng còn tuỳ thời gian hoàn vốn và dòng tiền.</div>
<h4>Dùng để làm gì</h4>
<p>CLV cho biết được chi bao nhiêu để có một khách hàng, phân khúc nào đáng làm chương trình tri ân, và vì sao nâng giữ chân từ 80% lên 90% rất mạnh: cùng m và d, CLV thành 600.000 × 0,9 ÷ 0,2 = 2.700.000 đồng, tăng 69%. Hệ thống quản trị quan hệ khách hàng (CRM) lưu lịch sử cần để ước lượng m và r theo từng phân khúc.</p>
<p>Thận trọng: r và m là ước lượng; khác nhau theo nhóm khách và kênh. Luôn đưa ra kịch bản thấp và cao.</p>`,
    pit: ['Using revenue instead of margin in CLV; revenue is not profit.', 'Dùng doanh thu thay biên lợi nhuận khi tính CLV; doanh thu không phải lợi nhuận.'],
    s: [['Perceived value = benefits − costs, as the customer sees it.', 'Giá trị cảm nhận = lợi ích − chi phí, theo mắt khách hàng.'], ['CLV = m × r ÷ (1 + d − r) in the simple model.', 'CLV = m × r ÷ (1 + d − r) trong mô hình đơn giản.'], ['Compare CLV with CAC before scaling acquisition spend.', 'So CLV với CAC trước khi tăng chi thu hút khách.']],
    l: ['clv', 'cac', 'crm', 'nps'],
    p: [['m = 400,000 VND, r = 0.75, d = 0.10. Compute CLV.', 'm = 400.000 đồng, r = 0,75, d = 0,10. Tính CLV.', '400,000 × 0.75 ÷ (1 + 0.10 − 0.75) = 300,000 ÷ 0.35 ≈ 857,143 VND.', '400.000 × 0,75 ÷ (1 + 0,10 − 0,75) = 300.000 ÷ 0,35 ≈ 857.143 đồng.'],
        ['With CLV = 857,143 VND, what is the maximum CAC for a CLV:CAC ratio of 3?', 'Với CLV = 857.143 đồng, CAC tối đa để tỷ lệ CLV:CAC là 3?', '857,143 ÷ 3 ≈ 285,714 VND.', '857.143 ÷ 3 ≈ 285.714 đồng.']] }),

  Q(P + 'quiz-1', 'Quiz — Chapter 1', 'Quiz — Chương 1', [
    ['Which orientation starts from target customers\' needs and integrates all activities?', 'Định hướng nào xuất phát từ nhu cầu khách hàng mục tiêu và phối hợp mọi hoạt động?', [['Production', 'Sản xuất'], ['Product', 'Sản phẩm'], ['Selling', 'Bán hàng'], ['Marketing', 'Marketing']], 3, 'The marketing orientation starts from customer needs.', 'Định hướng marketing xuất phát từ nhu cầu khách hàng.'],
    ['Marketing myopia means', 'Cận thị marketing nghĩa là', [['Ignoring competitors\' prices', 'Bỏ qua giá của đối thủ'], ['Defining the business by product instead of customer need', 'Định nghĩa việc kinh doanh theo sản phẩm thay vì nhu cầu khách hàng'], ['Over-spending on advertising', 'Chi quá tay cho quảng cáo'], ['Selling only online', 'Chỉ bán trực tuyến']], 1, 'Levitt: define the business by the need served.', 'Levitt: định nghĩa việc kinh doanh theo nhu cầu được phục vụ.'],
    ['Which is NOT a part of holistic marketing?', 'Phần nào KHÔNG thuộc marketing toàn diện?', [['Relationship marketing', 'Marketing quan hệ'], ['Internal marketing', 'Marketing nội bộ'], ['Performance marketing', 'Marketing hiệu suất'], ['Production marketing', 'Marketing sản xuất']], 3, 'The four parts are relationship, integrated, internal, performance.', 'Bốn phần: quan hệ, tích hợp, nội bộ, hiệu suất.'],
    ['In SWOT, a new regulation is a', 'Trong SWOT, một quy định mới là', [['Strength', 'Điểm mạnh'], ['Weakness', 'Điểm yếu'], ['Opportunity or threat', 'Cơ hội hoặc thách thức'], ['Objective', 'Mục tiêu']], 2, 'Regulation is external, so it is an opportunity or a threat.', 'Quy định là yếu tố bên ngoài nên là cơ hội hoặc thách thức.'],
    ['Entering a new country with the existing product range is (Ansoff)', 'Mang dòng sản phẩm hiện có sang nước mới là (Ansoff)', [['Market penetration', 'Thâm nhập thị trường'], ['Product development', 'Phát triển sản phẩm'], ['Market development', 'Phát triển thị trường'], ['Diversification', 'Đa dạng hoá']], 2, 'Existing product, new market = market development.', 'Sản phẩm cũ, thị trường mới = phát triển thị trường.'],
    ['Relative market share when you hold 10% and the leader 25% is', 'Thị phần tương đối khi bạn 10% và đầu ngành 25% là', ['0.4', '2.5', '0.1', '15'], 0, '10 ÷ 25 = 0.4.', '10 ÷ 25 = 0,4.'],
    ['m = 600,000, r = 0.8, d = 0.1. Simple CLV =', 'm = 600.000, r = 0,8, d = 0,1. CLV đơn giản =', ['480,000', '1,600,000', '3,000,000', '600,000'], 1, '600,000 × 0.8 ÷ 0.3 = 1,600,000.', '600.000 × 0,8 ÷ 0,3 = 1.600.000.'],
    ['Customer-perceived value is', 'Giá trị khách hàng cảm nhận là', [['Price minus cost', 'Giá trừ chi phí'], ['Total benefit minus total customer cost', 'Tổng lợi ích trừ tổng chi phí khách hàng bỏ ra'], ['Revenue per customer', 'Doanh thu trên mỗi khách'], ['Satisfaction score', 'Điểm hài lòng']], 1, 'It is benefits minus the customer\'s total costs.', 'Là lợi ích trừ tổng chi phí khách hàng bỏ ra.'],
  ]),
]));
// ===== Chương 2 =====
secs.push(SEC('Chapter 2 — Environment analysis and market research', 'Chương 2 — Phân tích môi trường và nghiên cứu thị trường',
  'Môi trường vĩ mô và ngành, quy trình nghiên cứu marketing, đo cầu và thị phần.', [
  D(P + '2-1', '2.1 Analysing the environment', '2.1 Phân tích môi trường',
    'PESTLE, năm lực lượng, đối thủ cạnh tranh.', {
    n: '2.1',
    g: [['Scan the macro-environment with PESTLE', 'Quét môi trường vĩ mô bằng PESTLE'], ['Assess industry attractiveness with five forces', 'Đánh giá sức hấp dẫn ngành bằng năm lực lượng'], ['Profile competitors in a simple table', 'Lập hồ sơ đối thủ bằng bảng đơn giản']],
    en: `<p>Marketing managers do not control the environment; they read it early and adapt. Two layers matter.</p>
<h4>Macro-environment: PESTLE</h4>` + tbl(['Factor', 'Question to ask', 'Vietnam-flavoured example'], [
      ['Political', 'Which policies change demand or cost?', 'Trade agreements, import rules'],
      ['Economic', 'Income, inflation, credit, exchange rates?', 'Rising middle-class spending, price sensitivity when inflation bites'],
      ['Social', 'Demographics, lifestyles, values?', 'Young urban population, health awareness, Tet gifting'],
      ['Technological', 'New platforms or production methods?', 'Mobile payments, live-stream selling'],
      ['Legal', 'Advertising, data, labelling law?', 'Rules on advertising claims and personal data'],
      ['Environmental', 'Climate, packaging, resource limits?', 'Plastic-reduction pressure, sustainable sourcing']]) + `
<h4>Industry: Porter's five forces</h4>
<p>Profit potential depends on (1) rivalry among existing competitors, (2) threat of new entrants, (3) threat of substitutes, (4) bargaining power of buyers, (5) bargaining power of suppliers. Example reading: in online marketplaces entry looks easy, buyers switch with one tap and sellers can list on several platforms, so platforms compete with vouchers and fast delivery. That is an inference to test with data, not a fact to assume.</p>
<h4>Competitor profile</h4>
<p>For each main rival record: target customers, positioning, product range, price level, channels, promotion, strengths, weaknesses and likely next move. Include <em>indirect</em> competitors that meet the same need differently (a ready-to-drink tea competes with a coffee chain for the afternoon break).</p>
<div class="callout"><strong>From scan to action.</strong> Do not list forty trends. Pick the three that change your customers' behaviour or your costs in the next 12–24 months, and write the marketing response for each.</div>`,
    vi: `<p>Nhà quản trị marketing không điều khiển được môi trường; họ đọc sớm và thích ứng. Có hai lớp cần quan tâm.</p>
<h4>Môi trường vĩ mô: PESTLE</h4>` + tbl(['Yếu tố', 'Câu hỏi cần đặt', 'Ví dụ gần với Việt Nam'], [
      ['Chính trị', 'Chính sách nào thay đổi cầu hoặc chi phí?', 'Hiệp định thương mại, quy định nhập khẩu'],
      ['Kinh tế', 'Thu nhập, lạm phát, tín dụng, tỷ giá?', 'Chi tiêu tầng lớp trung lưu tăng, nhạy cảm giá khi lạm phát'],
      ['Xã hội', 'Nhân khẩu, lối sống, giá trị?', 'Dân số đô thị trẻ, ý thức sức khoẻ, quà Tết'],
      ['Công nghệ', 'Nền tảng hay phương pháp sản xuất mới?', 'Thanh toán di động, bán hàng livestream'],
      ['Pháp lý', 'Luật quảng cáo, dữ liệu, nhãn mác?', 'Quy định về nội dung quảng cáo và dữ liệu cá nhân'],
      ['Môi trường', 'Khí hậu, bao bì, giới hạn tài nguyên?', 'Áp lực giảm nhựa, tìm nguồn bền vững']]) + `
<h4>Ngành: năm lực lượng của Porter</h4>
<p>Tiềm năng lợi nhuận phụ thuộc vào (1) cạnh tranh giữa các đối thủ hiện có, (2) nguy cơ đối thủ mới, (3) nguy cơ sản phẩm thay thế, (4) sức mạnh thương lượng của người mua, (5) sức mạnh thương lượng của nhà cung cấp. Ví dụ cách đọc: ở sàn thương mại điện tử, gia nhập có vẻ dễ, người mua chuyển chỉ bằng một chạm và người bán có thể đăng trên nhiều sàn, nên các sàn cạnh tranh bằng voucher và giao nhanh. Đó là suy luận cần kiểm bằng dữ liệu, không phải sự thật mặc định.</p>
<h4>Hồ sơ đối thủ</h4>
<p>Với mỗi đối thủ chính ghi: khách hàng mục tiêu, định vị, danh mục sản phẩm, mức giá, kênh, xúc tiến, điểm mạnh, điểm yếu và bước đi tiếp theo có thể có. Gồm cả đối thủ <em>gián tiếp</em> đáp ứng cùng nhu cầu theo cách khác (trà đóng chai cạnh tranh với chuỗi cà phê trong giờ nghỉ chiều).</p>
<div class="callout"><strong>Từ quét môi trường đến hành động.</strong> Đừng liệt kê bốn mươi xu hướng. Chọn ba xu hướng thay đổi hành vi khách hàng hoặc chi phí của bạn trong 12–24 tháng tới và viết phản ứng marketing cho từng cái.</div>`,
    pit: ['Treating PESTLE as a list to copy from the internet; every item must link to a decision.', 'Coi PESTLE là danh sách chép từ mạng; mỗi mục phải gắn với một quyết định.'],
    s: [['PESTLE reads the macro-environment; five forces read the industry.', 'PESTLE đọc môi trường vĩ mô; năm lực lượng đọc ngành.'], ['Competitor profiles must include indirect rivals.', 'Hồ sơ đối thủ phải gồm đối thủ gián tiếp.'], ['Keep the three trends that change behaviour or cost.', 'Giữ ba xu hướng làm đổi hành vi hoặc chi phí.']],
    l: ['pestle', 'five', 'comp', 'tgoogle'],
    p: [['Classify: “a new law limits advertising to children”.', 'Phân loại: “luật mới hạn chế quảng cáo cho trẻ em”.', 'Legal (PESTLE); it is a threat to some snack campaigns and an opportunity for compliant brands.', 'Pháp lý (PESTLE); là thách thức với vài chiến dịch bánh kẹo và là cơ hội cho thương hiệu tuân thủ.'],
        ['Which of the five forces rises when switching between sellers costs the buyer nothing?', 'Lực lượng nào tăng khi người mua chuyển người bán không tốn gì?', 'Bargaining power of buyers (and rivalry).', 'Sức mạnh thương lượng của người mua (và cạnh tranh).']] }),

  D(P + '2-2', '2.2 The marketing research process', '2.2 Quy trình nghiên cứu marketing',
    'Các bước nghiên cứu, dữ liệu sơ cấp/thứ cấp, mẫu và sai số.', {
    n: '2.2',
    g: [['Follow the six steps of a research project', 'Đi theo sáu bước của một dự án nghiên cứu'], ['Choose between primary and secondary, qualitative and quantitative methods', 'Chọn giữa dữ liệu sơ cấp/thứ cấp, định tính/định lượng'], ['Estimate a survey\'s margin of error', 'Ước lượng sai số của khảo sát']],
    en: `<p>Research reduces the risk of a decision; it does not replace judgement. The process:</p>
<ol><li><strong>Define the problem and objectives</strong> — a decision to support, e.g. “Should we launch a sugar-free line for office workers?”.</li><li><strong>Develop the research plan</strong> — data sources, methods, sample, budget.</li><li><strong>Collect the data</strong>.</li><li><strong>Analyse</strong>.</li><li><strong>Present findings</strong> with a recommendation.</li><li><strong>Make the decision</strong> and record what happened to improve the next study.</li></ol>
<h4>Sources and methods</h4>` + tbl(['', 'Qualitative', 'Quantitative'], [['Question', 'Why? How?', 'How many? How much?'], ['Methods', 'Interviews, focus groups, observation', 'Surveys, experiments, sales and web data'], ['Output', 'Insight, language, hypotheses', 'Numbers you can generalise']]) + `
<p><strong>Secondary data</strong> already exists (industry reports, statistics offices, company reports, platform dashboards) — cheap and fast, but may not fit your question. <strong>Primary data</strong> is collected for your question. Good practice: begin with secondary, then qualitative to find hypotheses, then quantitative to size them.</p>
<h4>Sample and error</h4>
<p>For a simple random sample and a proportion near 50%, the 95% margin of error is about:</p>` + fm('Margin of error', 'e ≈ 1.96 × √(0.5 × 0.5 ÷ n)') + `
<p>n = 400 gives 1.96 × √(0.25 ÷ 400) ≈ 0.049, i.e. about ±4.9 percentage points. n = 1,000 gives about ±3.1 points. Quadrupling the sample only halves the error, so pay for more respondents only if the decision needs the precision. Bias matters more than size: a survey on one social platform reaches the people on that platform, not “Vietnamese consumers”.</p>
<div class="pitfall"><strong>Leading questions.</strong> “Do you agree our delicious new flavour is great?” will return agreement. Ask neutral questions and test the questionnaire on five people first.</div>`,
    vi: `<p>Nghiên cứu giảm rủi ro của quyết định; nó không thay thế phán đoán. Quy trình:</p>
<ol><li><strong>Xác định vấn đề và mục tiêu</strong> — một quyết định cần hỗ trợ, ví dụ “Có nên ra dòng không đường cho dân văn phòng?”.</li><li><strong>Lập kế hoạch nghiên cứu</strong> — nguồn dữ liệu, phương pháp, mẫu, ngân sách.</li><li><strong>Thu thập dữ liệu</strong>.</li><li><strong>Phân tích</strong>.</li><li><strong>Trình bày phát hiện</strong> kèm khuyến nghị.</li><li><strong>Ra quyết định</strong> và ghi lại kết quả để cải thiện lần sau.</li></ol>
<h4>Nguồn và phương pháp</h4>` + tbl(['', 'Định tính', 'Định lượng'], [['Câu hỏi', 'Vì sao? Như thế nào?', 'Bao nhiêu người? Bao nhiêu?'], ['Phương pháp', 'Phỏng vấn, thảo luận nhóm, quan sát', 'Khảo sát, thí nghiệm, dữ liệu bán hàng và web'], ['Kết quả', 'Insight, ngôn ngữ, giả thuyết', 'Con số có thể khái quát']]) + `
<p><strong>Dữ liệu thứ cấp</strong> đã có sẵn (báo cáo ngành, cơ quan thống kê, báo cáo công ty, bảng điều khiển của nền tảng) — rẻ và nhanh nhưng có thể không khớp câu hỏi. <strong>Dữ liệu sơ cấp</strong> thu thập riêng cho câu hỏi của bạn. Thực hành tốt: bắt đầu thứ cấp, rồi định tính để ra giả thuyết, rồi định lượng để đo quy mô.</p>
<h4>Mẫu và sai số</h4>
<p>Với mẫu ngẫu nhiên đơn giản và tỷ lệ gần 50%, sai số 95% xấp xỉ:</p>` + fm('Sai số', 'e ≈ 1,96 × √(0,5 × 0,5 ÷ n)') + `
<p>n = 400 cho 1,96 × √(0,25 ÷ 400) ≈ 0,049, tức khoảng ±4,9 điểm phần trăm. n = 1.000 cho khoảng ±3,1 điểm. Gấp bốn mẫu chỉ giảm một nửa sai số, nên chỉ trả thêm người trả lời khi quyết định cần độ chính xác đó. Thiên lệch quan trọng hơn cỡ mẫu: khảo sát trên một mạng xã hội chỉ chạm người dùng mạng đó, không phải “người tiêu dùng Việt Nam”.</p>
<div class="pitfall"><strong>Câu hỏi dẫn dắt.</strong> “Bạn có đồng ý vị mới của chúng tôi rất ngon không?” sẽ nhận được sự đồng ý. Hãy hỏi trung lập và thử bảng hỏi trên năm người trước.</div>`,
    s: [['Start from the decision, not from the survey.', 'Bắt đầu từ quyết định, không phải từ bảng khảo sát.'], ['Secondary → qualitative → quantitative is a sensible order.', 'Thứ cấp → định tính → định lượng là thứ tự hợp lý.'], ['e ≈ 1.96 × √(0.25 ÷ n): n=400 → ±4.9, n=1,000 → ±3.1 points.', 'e ≈ 1,96 × √(0,25 ÷ n): n=400 → ±4,9; n=1.000 → ±3,1 điểm.'], ['Sample bias beats sample size.', 'Thiên lệch mẫu nặng hơn cỡ mẫu.']],
    l: ['research', 'forecast', 'tgoogle'],
    p: [['Margin of error for n = 100?', 'Sai số với n = 100?', '1.96 × √(0.25 ÷ 100) = 0.098, about ±9.8 points.', '1,96 × √(0,25 ÷ 100) = 0,098, khoảng ±9,8 điểm.'],
        ['A café wants to know why students leave after one visit. Qualitative or quantitative first?', 'Quán cà phê muốn biết vì sao sinh viên chỉ đến một lần. Định tính hay định lượng trước?', 'Qualitative (interviews) to find reasons; then a survey to measure how common each reason is.', 'Định tính (phỏng vấn) để tìm lý do; sau đó khảo sát đo mức phổ biến của từng lý do.']] }),

  D(P + '2-3', '2.3 Market demand, market share and forecasting', '2.3 Cầu thị trường, thị phần và dự báo',
    'Chain-ratio, thị phần, thị phần tương đối, dự báo đơn giản.', {
    n: '2.3',
    g: [['Estimate market potential with a chain-ratio method', 'Ước lượng tiềm năng thị trường bằng phương pháp chuỗi tỷ lệ'], ['Compute market share and its change', 'Tính thị phần và sự thay đổi'], ['Apply a simple moving average forecast', 'Áp dụng dự báo trung bình trượt đơn giản']],
    en: `<p><strong>Market potential</strong> is the upper limit of demand under ideal conditions; <strong>market demand</strong> is what is expected under a given marketing effort and environment; <strong>company demand</strong> is your share of it.</p>
<h4>Chain-ratio method</h4>
<div class="callout"><strong>Worked example (hypothetical).</strong> A fresh-meal subscription: 20,000,000 households × 40% in large cities = 8,000,000; × 30% who buy ready meals regularly = 2,400,000; × 50% reachable by our delivery zones = <strong>1,200,000 target households</strong>. If the average household would pay 900,000 VND a year, potential ≈ 1,080 billion VND. Each ratio is an assumption you can check with research (Chapter 2.2).</div>
<h4>Market share</h4>` + fm('Market share', 'share = company sales ÷ total market sales × 100%') + `
<div class="callout"><strong>Worked example (hypothetical).</strong> Sales 180 billion VND, market 1,200 billion: share = 15.0%. Next year sales grow 10% to 198 billion, the market grows 6% to 1,272 billion: share = 198 ÷ 1,272 ≈ <strong>15.6%</strong>. Growing 10% in a 6% market gains share; growing 5% would lose share even though sales rose.</div>
<p>Relative share against the leader (Chapter 1.2) says how far you are from the top. Also separate <em>penetration</em> (what share of households bought), <em>loyalty</em> (how much of their category spend you get) <em>selectivity</em> and price selectivity — the four drivers of share in Kotler's decomposition.</p>
<h4>Forecasting</h4>
<p>Methods: surveys of buyers' intentions, sales-force opinion, expert panels (Delphi), time-series (trend, seasonality), and tests of marketing. A simple moving average of the last three months 100, 110, 120 gives (100 + 110 + 120) ÷ 3 = 110, which lags a rising trend; add a trend adjustment or seasonality before using it for Tet peaks. Always publish a low, base and high forecast and review it monthly.</p>`,
    vi: `<p><strong>Tiềm năng thị trường</strong> là giới hạn trên của cầu trong điều kiện lý tưởng; <strong>cầu thị trường</strong> là mức kỳ vọng ở một nỗ lực marketing và môi trường nhất định; <strong>cầu của công ty</strong> là phần của bạn trong đó.</p>
<h4>Phương pháp chuỗi tỷ lệ</h4>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Dịch vụ thuê bao suất ăn tươi: 20.000.000 hộ × 40% ở thành phố lớn = 8.000.000; × 30% thường mua đồ ăn sẵn = 2.400.000; × 50% nằm trong vùng giao hàng = <strong>1.200.000 hộ mục tiêu</strong>. Nếu mỗi hộ trả trung bình 900.000 đồng một năm, tiềm năng ≈ 1.080 tỷ đồng. Mỗi tỷ lệ là giả định có thể kiểm bằng nghiên cứu (bài 2.2).</div>
<h4>Thị phần</h4>` + fm('Thị phần', 'thị phần = doanh số công ty ÷ doanh số toàn thị trường × 100%') + `
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Doanh số 180 tỷ, thị trường 1.200 tỷ: thị phần = 15,0%. Năm sau doanh số tăng 10% lên 198 tỷ, thị trường tăng 6% lên 1.272 tỷ: thị phần = 198 ÷ 1.272 ≈ <strong>15,6%</strong>. Tăng 10% trong thị trường tăng 6% là giành thị phần; tăng 5% thì mất thị phần dù doanh số vẫn tăng.</div>
<p>Thị phần tương đối so với đầu ngành (bài 1.2) cho biết còn cách đỉnh bao xa. Cũng nên tách <em>độ thâm nhập</em> (bao nhiêu hộ đã mua), <em>mức trung thành</em> (bạn chiếm bao nhiêu chi tiêu của họ trong ngành hàng) <em>tính chọn lọc</em> và chọn lọc về giá — bốn động lực của thị phần trong cách phân rã của Kotler.</p>
<h4>Dự báo</h4>
<p>Phương pháp: khảo sát ý định mua, ý kiến lực lượng bán, hội đồng chuyên gia (Delphi), chuỗi thời gian (xu hướng, mùa vụ) và thử nghiệm marketing. Trung bình trượt ba tháng 100, 110, 120 cho (100 + 110 + 120) ÷ 3 = 110, thấp hơn xu hướng đang tăng; cần điều chỉnh xu hướng hoặc mùa vụ trước khi dùng cho đỉnh Tết. Luôn công bố dự báo thấp, cơ sở, cao và rà soát hằng tháng.</p>`,
    pit: ['Quoting “1% of a huge market” as a plan; ask which customers, through which channel.', 'Nói “chỉ cần 1% của thị trường khổng lồ” như một kế hoạch; hãy hỏi khách hàng nào, qua kênh nào.'],
    s: [['Potential ≥ market demand ≥ company demand.', 'Tiềm năng ≥ cầu thị trường ≥ cầu công ty.'], ['Share = company sales ÷ market sales.', 'Thị phần = doanh số công ty ÷ doanh số thị trường.'], ['Growing slower than the market loses share.', 'Tăng chậm hơn thị trường là mất thị phần.'], ['Publish low, base and high forecasts.', 'Công bố dự báo thấp, cơ sở và cao.']],
    l: ['share', 'forecast', 'research'],
    p: [['Sales 90, market 600 (billion VND). Share? Next year sales 99, market 690. New share?', 'Doanh số 90, thị trường 600 (tỷ đồng). Thị phần? Năm sau 99 và 690. Thị phần mới?', '90 ÷ 600 = 15%. 99 ÷ 690 ≈ 14.3%: sales rose 10% but share fell, because the market grew 15%.', '90 ÷ 600 = 15%. 99 ÷ 690 ≈ 14,3%: doanh số tăng 10% nhưng thị phần giảm vì thị trường tăng 15%.'],
        ['Why does a moving average underestimate in a rising trend?', 'Vì sao trung bình trượt dự báo thấp khi xu hướng tăng?', 'It averages old low values with new high ones, so it lags the trend.', 'Nó lấy trung bình giá trị cũ thấp với giá trị mới cao nên chậm hơn xu hướng.']] }),

  Q(P + 'quiz-2', 'Quiz — Chapter 2', 'Quiz — Chương 2', [
    ['Which PESTLE factor covers mobile payments and live-stream selling?', 'Yếu tố PESTLE nào bao gồm thanh toán di động và bán hàng livestream?', [['Political', 'Chính trị'], ['Social', 'Xã hội'], ['Technological', 'Công nghệ'], ['Legal', 'Pháp lý']], 2, 'New platforms are technological factors.', 'Nền tảng mới thuộc yếu tố công nghệ.'],
    ['Which is NOT one of Porter\'s five forces?', 'Cái nào KHÔNG thuộc năm lực lượng của Porter?', [['Threat of substitutes', 'Nguy cơ sản phẩm thay thế'], ['Bargaining power of suppliers', 'Sức mạnh nhà cung cấp'], ['Government subsidies', 'Trợ cấp chính phủ'], ['Threat of new entrants', 'Nguy cơ đối thủ mới']], 2, 'Subsidies are macro (political/economic), not a force.', 'Trợ cấp là yếu tố vĩ mô, không phải một lực lượng.'],
    ['The first step of a research project is to', 'Bước đầu tiên của dự án nghiên cứu là', [['Choose the sample', 'Chọn mẫu'], ['Define the problem and objectives', 'Xác định vấn đề và mục tiêu'], ['Design the questionnaire', 'Thiết kế bảng hỏi'], ['Collect data', 'Thu thập dữ liệu']], 1, 'Start from the decision to support.', 'Bắt đầu từ quyết định cần hỗ trợ.'],
    ['Focus groups are mainly', 'Thảo luận nhóm chủ yếu là', [['Quantitative', 'Định lượng'], ['Qualitative', 'Định tính'], ['Secondary', 'Thứ cấp'], ['Experimental', 'Thực nghiệm']], 1, 'They explore reasons and language.', 'Chúng khám phá lý do và ngôn ngữ.'],
    ['Margin of error (95%, p=0.5) for n=400 is about', 'Sai số (95%, p=0,5) với n=400 xấp xỉ', ['±1 point', '±4.9 points', '±9.8 points', '±20 points'], 1, '1.96 × √(0.25 ÷ 400) ≈ 0.049.', '1,96 × √(0,25 ÷ 400) ≈ 0,049.'],
    ['Sales 180 of a 1,200 market. Share =', 'Doanh số 180 trên thị trường 1.200. Thị phần =', ['12%', '15%', '18%', '6.7%'], 1, '180 ÷ 1,200 = 15%.', '180 ÷ 1.200 = 15%.'],
    ['Sales +5% in a market +8% means share', 'Doanh số +5% trong thị trường +8% nghĩa là thị phần', [['Rises', 'Tăng'], ['Falls', 'Giảm'], ['Stays the same', 'Giữ nguyên'], ['Cannot be known', 'Không thể biết']], 1, 'You grew slower than the market.', 'Bạn tăng chậm hơn thị trường.'],
    ['A moving average of 100, 110, 120 equals', 'Trung bình trượt của 100, 110, 120 bằng', ['100', '110', '115', '330'], 1, '330 ÷ 3 = 110.', '330 ÷ 3 = 110.'],
  ]),
]));
// ===== Chương 3 =====
secs.push(SEC('Chapter 3 — Consumer and business buying behaviour', 'Chương 3 — Hành vi mua của người tiêu dùng và tổ chức',
  'Yếu tố ảnh hưởng, quá trình quyết định mua, mua hàng tổ chức và hành trình khách hàng.', [
  D(P + '3-1', '3.1 How consumers decide', '3.1 Người tiêu dùng quyết định mua như thế nào',
    'Bốn nhóm yếu tố ảnh hưởng, tháp Maslow, quy trình năm bước.', {
    n: '3.1',
    g: [['Name the four groups of influences on buying', 'Gọi tên bốn nhóm yếu tố ảnh hưởng đến mua'], ['Walk through the five-stage buying process', 'Đi qua quy trình mua năm bước'], ['Distinguish high and low involvement purchases', 'Phân biệt mua có mức dính líu cao và thấp']],
    en: `<h4>Four groups of influences</h4>
<ul><li><strong>Cultural</strong> — culture, subculture, social class. Tet gifting and family meals shape whole categories in Vietnam.</li><li><strong>Social</strong> — reference groups, family, roles. Friends' reviews and group chats often matter more than adverts.</li><li><strong>Personal</strong> — age, life stage, occupation, income, lifestyle.</li><li><strong>Psychological</strong> — motivation, perception, learning, beliefs and attitudes. Maslow's hierarchy (physiological, safety, social, esteem, self-actualisation) is a simple way to ask which need a product serves.</li></ul>
<h4>The five-stage process</h4>
<ol><li><strong>Problem recognition</strong> — a trigger, internal (hunger) or external (an ad, a friend's post).</li><li><strong>Information search</strong> — personal, commercial, public (reviews, news), experiential.</li><li><strong>Evaluation of alternatives</strong> — consumers compare attributes they care about; weights differ by person.</li><li><strong>Purchase decision</strong> — can be derailed by others' attitudes or unexpected situations (stock-out, delivery fee shown at checkout).</li><li><strong>Post-purchase behaviour</strong> — satisfaction, return, word of mouth.</li></ol>
<h4>Involvement</h4>
<p>High involvement (a laptop, an insurance plan) → long search, comparison, need for detailed information. Low involvement (instant noodles, soap) → habit, shelf visibility, price promotion and trial matter most. Some low-involvement choices are variety-seeking: people switch for fun, not because they dislike the old one.</p>
<div class="callout"><strong>Example: weighted attribute model.</strong> Three phones are scored 1–10 on price (weight 0.5), camera (0.3) and battery (0.2). Phone A: 8, 6, 7 → 0.5×8 + 0.3×6 + 0.2×7 = 4.0 + 1.8 + 1.4 = <strong>7.2</strong>. Phone B: 6, 9, 8 → 3.0 + 2.7 + 1.6 = <strong>7.3</strong>. B wins narrowly; if the buyer cares more about price (weight 0.7, camera 0.2, battery 0.1) A scores 5.6 + 1.2 + 0.7 = 7.5 and B scores 4.2 + 1.8 + 0.8 = 6.8, so A wins. Segments differ in weights, which is why segmentation exists.</div>`,
    vi: `<h4>Bốn nhóm yếu tố ảnh hưởng</h4>
<ul><li><strong>Văn hoá</strong> — văn hoá, nhánh văn hoá, tầng lớp xã hội. Tặng quà Tết và bữa cơm gia đình định hình cả ngành hàng ở Việt Nam.</li><li><strong>Xã hội</strong> — nhóm tham khảo, gia đình, vai trò. Đánh giá của bạn bè và nhóm chat thường quan trọng hơn quảng cáo.</li><li><strong>Cá nhân</strong> — tuổi, giai đoạn cuộc sống, nghề nghiệp, thu nhập, lối sống.</li><li><strong>Tâm lý</strong> — động cơ, nhận thức, học hỏi, niềm tin và thái độ. Tháp Maslow (sinh lý, an toàn, xã hội, được tôn trọng, tự thể hiện) là cách đơn giản để hỏi sản phẩm phục vụ nhu cầu nào.</li></ul>
<h4>Quy trình năm bước</h4>
<ol><li><strong>Nhận biết vấn đề</strong> — do kích thích bên trong (đói) hoặc bên ngoài (quảng cáo, bài đăng của bạn).</li><li><strong>Tìm kiếm thông tin</strong> — cá nhân, thương mại, công cộng (đánh giá, tin tức), kinh nghiệm.</li><li><strong>Đánh giá phương án</strong> — người mua so sánh thuộc tính họ quan tâm; trọng số khác nhau theo người.</li><li><strong>Quyết định mua</strong> — có thể bị chệch bởi thái độ người khác hoặc tình huống bất ngờ (hết hàng, phí giao hàng hiện ra lúc thanh toán).</li><li><strong>Hành vi sau mua</strong> — hài lòng, đổi trả, truyền miệng.</li></ol>
<h4>Mức dính líu</h4>
<p>Dính líu cao (laptop, bảo hiểm) → tìm kiếm lâu, so sánh, cần thông tin chi tiết. Dính líu thấp (mì ăn liền, xà phòng) → thói quen, độ hiện diện trên kệ, khuyến mãi giá và dùng thử quan trọng nhất. Một số lựa chọn dính líu thấp là tìm sự đa dạng: người ta đổi cho vui, không phải vì chán sản phẩm cũ.</p>
<div class="callout"><strong>Ví dụ: mô hình thuộc tính có trọng số.</strong> Ba điện thoại chấm 1–10 về giá (trọng số 0,5), camera (0,3), pin (0,2). Máy A: 8, 6, 7 → 0,5×8 + 0,3×6 + 0,2×7 = 4,0 + 1,8 + 1,4 = <strong>7,2</strong>. Máy B: 6, 9, 8 → 3,0 + 2,7 + 1,6 = <strong>7,3</strong>. B thắng sát nút; nếu người mua coi trọng giá hơn (giá 0,7, camera 0,2, pin 0,1) thì A được 5,6 + 1,2 + 0,7 = 7,5 còn B được 4,2 + 1,8 + 0,8 = 6,8, A thắng. Các phân khúc có trọng số khác nhau, đó là lý do tồn tại của phân khúc.</div>`,
    pit: ['Assuming consumers compare everything; for low-involvement goods most decide in seconds at the shelf or in the app.', 'Giả định người tiêu dùng so sánh mọi thứ; với hàng dính líu thấp đa số quyết định trong vài giây ở kệ hoặc trong app.'],
    s: [['Cultural, social, personal and psychological factors shape buying.', 'Yếu tố văn hoá, xã hội, cá nhân và tâm lý định hình việc mua.'], ['Five stages: recognition, search, evaluation, purchase, post-purchase.', 'Năm bước: nhận biết, tìm kiếm, đánh giá, mua, sau mua.'], ['Involvement decides how much effort buyers spend.', 'Mức dính líu quyết định công sức người mua bỏ ra.']],
    l: ['cb', 'bdp', 'maslow'],
    p: [['Phone A scores 7, 8, 6 and the weights are 0.4, 0.4, 0.2. Compute the score.', 'Máy A được 7, 8, 6 với trọng số 0,4, 0,4, 0,2. Tính điểm.', '0.4×7 + 0.4×8 + 0.2×6 = 2.8 + 3.2 + 1.2 = 7.2.', '0,4×7 + 0,4×8 + 0,2×6 = 2,8 + 3,2 + 1,2 = 7,2.'],
        ['At which stage does a surprise delivery fee hurt most?', 'Phí giao hàng bất ngờ gây hại nhất ở bước nào?', 'The purchase decision stage (cart abandonment).', 'Bước quyết định mua (bỏ giỏ hàng).']] }),

  D(P + '3-2', '3.2 Business buying behaviour', '3.2 Hành vi mua của tổ chức',
    'Đặc điểm B2B, trung tâm mua, các bước mua của tổ chức.', {
    n: '3.2',
    g: [['List what makes business markets different', 'Liệt kê điều khiến thị trường tổ chức khác biệt'], ['Name the roles in a buying centre', 'Gọi tên các vai trò trong trung tâm mua'], ['Describe the stages of an organisational purchase', 'Mô tả các giai đoạn của một lần mua tổ chức']],
    en: `<p>Business markets (B2B) sell to companies, institutions and government for use in production or resale. Typical differences:</p>
<ul><li><strong>Fewer, larger buyers</strong> and closer relationships.</li><li><strong>Derived demand</strong> — demand for steel depends on demand for the cars and buildings made from it.</li><li><strong>Professional purchasing</strong> — written specifications, tenders, total-cost-of-ownership thinking.</li><li><strong>Many people involved</strong> and longer decisions.</li><li><strong>Inelastic demand in the short run</strong> — a price cut on a small component rarely triggers much extra buying.</li></ul>
<h4>The buying centre</h4>` + tbl(['Role', 'Who', 'Marketing implication'], [
      ['Initiator', 'Person who sees a need', 'Reach with problem-focused content'],
      ['User', 'Operates the product', 'Demos, trials, training'],
      ['Influencer', 'Engineer, consultant', 'Technical evidence, case studies'],
      ['Decider', 'Authority to choose', 'Business case, ROI'],
      ['Approver', 'Authorises the order', 'Risk and budget fit'],
      ['Buyer', 'Procurement officer', 'Clear terms, delivery, price'],
      ['Gatekeeper', 'Controls information flow', 'Be helpful, be accurate']]) + `
<h4>Stages</h4>
<p>Problem recognition → general need description → product specification → supplier search → proposal solicitation → supplier selection → order routine → performance review. A new task is the most involved; a straight rebuy is routine and favours the incumbent; a modified rebuy opens the door to challengers.</p>
<div class="callout"><strong>Worked example: total cost of ownership (hypothetical).</strong> Machine A costs 200 million VND, uses 30 million VND of power and 10 million of maintenance per year. Machine B costs 260 million, power 18 million, maintenance 6 million. Over 5 years: A = 200 + 5×(30 + 10) = <strong>400 million</strong>; B = 260 + 5×(18 + 6) = <strong>380 million</strong>. B is dearer on the invoice but cheaper to own. A seller of B should show exactly this calculation.</div>
<p>Selling to government and large firms often runs through tenders; relationship quality and compliance (documents, deadlines) matter as much as price.</p>`,
    vi: `<p>Thị trường tổ chức (B2B) bán cho doanh nghiệp, cơ quan, chính phủ để dùng trong sản xuất hoặc bán lại. Khác biệt điển hình:</p>
<ul><li><strong>Ít người mua hơn nhưng lớn hơn</strong> và quan hệ gần gũi hơn.</li><li><strong>Cầu phái sinh</strong> — cầu thép phụ thuộc cầu xe và nhà làm từ thép.</li><li><strong>Mua hàng chuyên nghiệp</strong> — đặc tả bằng văn bản, đấu thầu, tư duy tổng chi phí sở hữu.</li><li><strong>Nhiều người tham gia</strong> và quyết định lâu hơn.</li><li><strong>Cầu kém co giãn ngắn hạn</strong> — giảm giá một linh kiện nhỏ hiếm khi kéo thêm nhiều đơn.</li></ul>
<h4>Trung tâm mua</h4>` + tbl(['Vai trò', 'Là ai', 'Hàm ý marketing'], [
      ['Người khởi xướng', 'Người thấy nhu cầu', 'Tiếp cận bằng nội dung về vấn đề'],
      ['Người dùng', 'Vận hành sản phẩm', 'Demo, dùng thử, đào tạo'],
      ['Người ảnh hưởng', 'Kỹ sư, tư vấn', 'Bằng chứng kỹ thuật, case study'],
      ['Người quyết định', 'Có quyền chọn', 'Business case, ROI'],
      ['Người phê duyệt', 'Cho phép đặt hàng', 'Rủi ro và ngân sách'],
      ['Người mua', 'Nhân viên mua hàng', 'Điều khoản rõ, giao hàng, giá'],
      ['Người gác cổng', 'Kiểm soát dòng thông tin', 'Hữu ích và chính xác']]) + `
<h4>Các giai đoạn</h4>
<p>Nhận biết vấn đề → mô tả nhu cầu chung → đặc tả sản phẩm → tìm nhà cung cấp → mời chào giá → chọn nhà cung cấp → quy trình đặt hàng → đánh giá kết quả. Việc mới đòi hỏi nhiều nhất; mua lại nguyên trạng là thủ tục và có lợi cho nhà cung cấp hiện tại; mua lại có điều chỉnh mở cửa cho đối thủ.</p>
<div class="callout"><strong>Ví dụ có lời giải: tổng chi phí sở hữu (giả định).</strong> Máy A giá 200 triệu đồng, điện 30 triệu và bảo trì 10 triệu mỗi năm. Máy B giá 260 triệu, điện 18 triệu, bảo trì 6 triệu. Trong 5 năm: A = 200 + 5×(30 + 10) = <strong>400 triệu</strong>; B = 260 + 5×(18 + 6) = <strong>380 triệu</strong>. B đắt hơn trên hoá đơn nhưng rẻ hơn khi sở hữu. Người bán B nên trình bày đúng phép tính này.</div>
<p>Bán cho cơ quan nhà nước và doanh nghiệp lớn thường qua đấu thầu; chất lượng quan hệ và tuân thủ (hồ sơ, hạn nộp) quan trọng ngang giá.</p>`,
    pit: ['Pitching only to the buyer (procurement) while the user and influencer have already decided.', 'Chỉ chào người mua (phòng mua hàng) trong khi người dùng và người ảnh hưởng đã quyết.'],
    s: [['B2B: fewer buyers, derived demand, professional purchasing.', 'B2B: ít người mua, cầu phái sinh, mua chuyên nghiệp.'], ['Map every role in the buying centre.', 'Vẽ ra mọi vai trò trong trung tâm mua.'], ['Compare total cost of ownership, not invoice price.', 'So tổng chi phí sở hữu, không so giá hoá đơn.']],
    l: ['b2b', 'bc', 'five'],
    p: [['Machine C costs 150 million, running cost 45 million per year. Total cost over 4 years?', 'Máy C giá 150 triệu, chi phí vận hành 45 triệu/năm. Tổng chi phí 4 năm?', '150 + 4×45 = 330 million VND.', '150 + 4×45 = 330 triệu đồng.'],
        ['Who is the gatekeeper in a school buying e-learning software?', 'Ai là người gác cổng khi trường mua phần mềm học trực tuyến?', 'Often an IT administrator or assistant who decides which vendors the committee sees.', 'Thường là quản trị CNTT hoặc trợ lý quyết định hội đồng được xem nhà cung cấp nào.']] }),

  D(P + '3-3', '3.3 Customer journey, touchpoints and loyalty', '3.3 Hành trình khách hàng, điểm chạm và lòng trung thành',
    'Hành trình khách hàng, phễu chuyển đổi, NPS có ví dụ số.', {
    n: '3.3',
    g: [['Draw a customer journey with touchpoints', 'Vẽ hành trình khách hàng với các điểm chạm'], ['Read a conversion funnel', 'Đọc phễu chuyển đổi'], ['Compute a Net Promoter Score', 'Tính chỉ số NPS']],
    en: `<p>The five-stage buying process is a model; real customers move through <strong>touchpoints</strong> across channels: a video, a friend's message, a marketplace listing, a store visit, an unboxing, a support chat. A <strong>customer journey map</strong> lists the stages, what the customer thinks and feels, each touchpoint, and the pain points to fix.</p>
<h4>How to build a map</h4>
<ol><li>Pick one customer segment and one goal (e.g. “order a birthday cake for tomorrow”).</li><li>Interview or observe five to eight real customers.</li><li>List stages: aware, consider, buy, receive, use, recommend.</li><li>For each: action, touchpoint, emotion, problem.</li><li>Mark “moments of truth” where a bad experience loses the customer, and assign an owner.</li></ol>
<h4>Funnel arithmetic</h4>
<div class="callout"><strong>Worked example (hypothetical).</strong> 100,000 people see an ad; 3,000 visit the shop page (3.0%); 600 add to cart (20% of visitors); 300 pay (50% of carts). Overall conversion = 300 ÷ 100,000 = 0.3%. If a free-shipping threshold lifts cart-to-pay from 50% to 60%, payments become 360, a 20% improvement without buying a single extra visit. Fix the weakest step first.</div>
<h4>Loyalty and NPS</h4>
<p>Net Promoter Score asks “How likely are you to recommend us (0–10)?”. Promoters score 9–10, passives 7–8, detractors 0–6.</p>` + fm('NPS', 'NPS = % promoters − % detractors') + `
<p>Example: of 200 respondents 120 are promoters (60%), 50 passives (25%), 30 detractors (15%): NPS = 60 − 15 = <strong>+45</strong>. Passives are ignored in the formula but they are the easiest group to convert. NPS is one signal; pair it with repeat-purchase rate, because people can say they would recommend and still not return.</p>
<p>Loyalty is built by consistent delivery of the promise, easy problem solving and relevant rewards, not just points. See Chapter 8 for retention metrics.</p>`,
    vi: `<p>Quy trình mua năm bước là một mô hình; khách hàng thật đi qua các <strong>điểm chạm</strong> trên nhiều kênh: một video, tin nhắn của bạn bè, trang sản phẩm trên sàn, chuyến ghé cửa hàng, khoảnh khắc mở hộp, cuộc trò chuyện hỗ trợ. <strong>Bản đồ hành trình khách hàng</strong> liệt kê các giai đoạn, điều khách nghĩ và cảm thấy, từng điểm chạm và các điểm nghẽn cần sửa.</p>
<h4>Cách dựng bản đồ</h4>
<ol><li>Chọn một phân khúc và một mục tiêu (ví dụ “đặt bánh sinh nhật cho ngày mai”).</li><li>Phỏng vấn hoặc quan sát năm đến tám khách thật.</li><li>Liệt kê giai đoạn: biết, cân nhắc, mua, nhận, dùng, giới thiệu.</li><li>Với mỗi giai đoạn: hành động, điểm chạm, cảm xúc, vấn đề.</li><li>Đánh dấu “khoảnh khắc quyết định” nơi trải nghiệm tệ làm mất khách và giao người phụ trách.</li></ol>
<h4>Số học của phễu</h4>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> 100.000 người thấy quảng cáo; 3.000 vào trang cửa hàng (3,0%); 600 thêm vào giỏ (20% số người vào); 300 thanh toán (50% số giỏ). Chuyển đổi tổng = 300 ÷ 100.000 = 0,3%. Nếu ngưỡng miễn phí vận chuyển nâng tỷ lệ giỏ → thanh toán từ 50% lên 60%, số thanh toán thành 360, tăng 20% mà không mua thêm lượt truy cập nào. Sửa bước yếu nhất trước.</div>
<h4>Lòng trung thành và NPS</h4>
<p>Chỉ số NPS hỏi “Bạn có khả năng giới thiệu chúng tôi đến mức nào (0–10)?”. Người ủng hộ chấm 9–10, trung lập 7–8, người chê 0–6.</p>` + fm('NPS', 'NPS = % người ủng hộ − % người chê') + `
<p>Ví dụ: trong 200 người trả lời có 120 ủng hộ (60%), 50 trung lập (25%), 30 chê (15%): NPS = 60 − 15 = <strong>+45</strong>. Nhóm trung lập không vào công thức nhưng là nhóm dễ chuyển nhất. NPS chỉ là một tín hiệu; hãy đi kèm tỷ lệ mua lại, vì người ta có thể nói sẽ giới thiệu mà không quay lại.</p>
<p>Lòng trung thành được xây bằng việc giữ lời hứa nhất quán, giải quyết vấn đề dễ dàng và phần thưởng phù hợp, không chỉ điểm tích luỹ. Chương 8 có các chỉ số giữ chân.</p>`,
    pit: ['Mapping the journey from the company\'s org chart instead of from what customers actually do.', 'Vẽ hành trình theo sơ đồ tổ chức công ty thay vì theo điều khách hàng thực sự làm.'],
    s: [['Journey maps list stages, touchpoints, emotions and pain points.', 'Bản đồ hành trình liệt kê giai đoạn, điểm chạm, cảm xúc và điểm nghẽn.'], ['Funnel rates multiply; improve the weakest step.', 'Tỷ lệ phễu nhân với nhau; cải thiện bước yếu nhất.'], ['NPS = % promoters − % detractors.', 'NPS = % người ủng hộ − % người chê.']],
    l: ['journey', 'cx', 'nps', 'crm'],
    p: [['Of 80 respondents, 40 promoters, 24 passives, 16 detractors. NPS?', 'Trong 80 người, 40 ủng hộ, 24 trung lập, 16 chê. NPS?', '40/80 = 50%; 16/80 = 20%; NPS = +30.', '40/80 = 50%; 16/80 = 20%; NPS = +30.'],
        ['A funnel has 20,000 visits, 4% add to cart, 25% of carts pay. Orders?', 'Phễu 20.000 lượt vào, 4% thêm giỏ, 25% giỏ thanh toán. Số đơn?', '20,000 × 0.04 = 800 carts; × 0.25 = 200 orders.', '20.000 × 0,04 = 800 giỏ; × 0,25 = 200 đơn.']] }),

  Q(P + 'quiz-3', 'Quiz — Chapter 3', 'Quiz — Chương 3', [
    ['Which is a psychological influence on buying?', 'Đâu là yếu tố tâm lý ảnh hưởng đến mua?', [['Social class', 'Tầng lớp xã hội'], ['Family', 'Gia đình'], ['Perception and beliefs', 'Nhận thức và niềm tin'], ['Occupation', 'Nghề nghiệp']], 2, 'Motivation, perception, learning and beliefs are psychological.', 'Động cơ, nhận thức, học hỏi, niềm tin là tâm lý.'],
    ['The correct order of the buying process starts with', 'Quy trình mua đúng thứ tự bắt đầu bằng', [['Evaluation', 'Đánh giá'], ['Problem recognition', 'Nhận biết vấn đề'], ['Purchase', 'Mua'], ['Information search', 'Tìm kiếm thông tin']], 1, 'Recognition comes first.', 'Nhận biết vấn đề đến trước.'],
    ['Low-involvement goods are most affected by', 'Hàng dính líu thấp bị ảnh hưởng nhiều nhất bởi', [['Long comparison', 'So sánh lâu'], ['Shelf visibility and habit', 'Độ hiện diện trên kệ và thói quen'], ['Technical specifications', 'Thông số kỹ thuật'], ['Tenders', 'Đấu thầu']], 1, 'Habit and visibility dominate.', 'Thói quen và độ hiện diện chi phối.'],
    ['Weights 0.5/0.3/0.2 and scores 8/6/7 give', 'Trọng số 0,5/0,3/0,2 và điểm 8/6/7 cho', ['6.0', '7.2', '7.5', '21'], 1, '4.0 + 1.8 + 1.4 = 7.2.', '4,0 + 1,8 + 1,4 = 7,2.'],
    ['Demand for steel that depends on demand for cars is', 'Cầu thép phụ thuộc cầu xe là', [['Elastic demand', 'Cầu co giãn'], ['Derived demand', 'Cầu phái sinh'], ['Latent demand', 'Cầu tiềm ẩn'], ['Impulse demand', 'Cầu bốc đồng']], 1, 'Derived demand.', 'Cầu phái sinh.'],
    ['The person who controls the information that reaches the buying centre is the', 'Người kiểm soát thông tin đến trung tâm mua là', [['Initiator', 'Người khởi xướng'], ['User', 'Người dùng'], ['Gatekeeper', 'Người gác cổng'], ['Decider', 'Người quyết định']], 2, 'Gatekeeper.', 'Người gác cổng.'],
    ['Machine A: 200 + 5×40; Machine B: 260 + 5×24. Cheaper to own over 5 years?', 'Máy A: 200 + 5×40; Máy B: 260 + 5×24. Rẻ hơn khi sở hữu 5 năm?', [['A (400)', 'A (400)'], ['B (380)', 'B (380)'], ['Equal', 'Bằng nhau'], ['Cannot tell', 'Không thể biết']], 1, 'A = 400, B = 380.', 'A = 400, B = 380.'],
    ['60% promoters, 25% passives, 15% detractors give NPS', '60% ủng hộ, 25% trung lập, 15% chê cho NPS', ['+85', '+45', '+60', '−15'], 1, '60 − 15 = 45.', '60 − 15 = 45.'],
  ]),
]));
// ===== Chương 4 =====
secs.push(SEC('Chapter 4 — Segmentation, targeting and positioning (STP)', 'Chương 4 — Phân khúc, chọn mục tiêu và định vị (STP)',
  'Phân khúc thị trường, đánh giá và chọn phân khúc, định vị và khác biệt hoá.', [
  D(P + '4-1', '4.1 Segmenting the market', '4.1 Phân khúc thị trường',
    'Các cơ sở phân khúc và tiêu chí phân khúc hiệu quả.', {
    n: '4.1',
    g: [['Name the main segmentation bases', 'Gọi tên các cơ sở phân khúc chính'], ['Test a segment with the five criteria', 'Kiểm tra một phân khúc bằng năm tiêu chí'], ['Segment a business market', 'Phân khúc một thị trường tổ chức']],
    en: `<p>Customers differ, and one offer cannot serve all of them equally well. <strong>Segmentation</strong> divides the market into groups with similar needs or responses.</p>
<h4>Bases for consumer markets</h4>` + tbl(['Base', 'Variables', 'Example'], [
      ['Geographic', 'Region, city size, climate', 'Different sauce tastes by region'],
      ['Demographic', 'Age, gender, income, family size, life stage', 'Milk lines for children, adults, seniors'],
      ['Psychographic', 'Lifestyle, values, personality', 'Health-conscious urban professionals'],
      ['Behavioural', 'Occasion, benefits sought, usage rate, loyalty, readiness', 'Daily commuter coffee vs weekend meet-up coffee']]) + `
<p>Strong segmentation usually starts from <em>benefits sought</em> or <em>occasion</em> rather than from age alone. Two 25-year-olds can want opposite things from a café: a quiet desk or a lively place to meet.</p>
<h4>Five criteria for a useful segment</h4>
<ul><li><strong>Measurable</strong> — you can size it.</li><li><strong>Substantial</strong> — large and profitable enough to serve.</li><li><strong>Accessible</strong> — you can reach it with channels and media.</li><li><strong>Differentiable</strong> — it responds differently from other segments.</li><li><strong>Actionable</strong> — you can design a programme for it.</li></ul>
<h4>Business markets</h4>
<p>Segment by industry, company size, location, usage rate, purchasing approach (centralised or not), and situational factors (urgency, order size). A software firm might split restaurants, retail chains and schools because their needs and buying centres differ.</p>
<div class="callout"><strong>Procedure.</strong> (1) Survey needs; (2) cluster respondents by similar answers; (3) profile each cluster (who are they, where, which media); (4) name it in a human way (“Budget-driven students”); (5) test whether the segments respond differently to price or message.</div>
<p>Segments are a tool, not a law. Revisit them as behaviour shifts, for instance when delivery apps change when and where people eat.</p>`,
    vi: `<p>Khách hàng khác nhau, và một chào bán không thể phục vụ mọi người tốt như nhau. <strong>Phân khúc</strong> chia thị trường thành các nhóm có nhu cầu hoặc phản ứng tương tự.</p>
<h4>Cơ sở phân khúc thị trường tiêu dùng</h4>` + tbl(['Cơ sở', 'Biến số', 'Ví dụ'], [
      ['Địa lý', 'Vùng, quy mô thành phố, khí hậu', 'Khẩu vị nước chấm khác nhau theo vùng'],
      ['Nhân khẩu', 'Tuổi, giới, thu nhập, quy mô gia đình, giai đoạn đời', 'Dòng sữa cho trẻ em, người lớn, người cao tuổi'],
      ['Tâm lý', 'Lối sống, giá trị, tính cách', 'Dân văn phòng đô thị quan tâm sức khoẻ'],
      ['Hành vi', 'Dịp dùng, lợi ích tìm kiếm, mức dùng, trung thành, mức sẵn sàng', 'Cà phê đi làm mỗi ngày so với cà phê gặp gỡ cuối tuần']]) + `
<p>Phân khúc mạnh thường xuất phát từ <em>lợi ích tìm kiếm</em> hoặc <em>dịp dùng</em> hơn là chỉ tuổi. Hai người 25 tuổi có thể muốn điều trái ngược ở quán cà phê: bàn yên tĩnh hay chỗ sôi động để gặp bạn.</p>
<h4>Năm tiêu chí của phân khúc hữu ích</h4>
<ul><li><strong>Đo được</strong> — bạn ước lượng được quy mô.</li><li><strong>Đủ lớn</strong> — đủ lớn và sinh lời để phục vụ.</li><li><strong>Tiếp cận được</strong> — chạm tới bằng kênh và phương tiện.</li><li><strong>Khác biệt</strong> — phản ứng khác các phân khúc khác.</li><li><strong>Hành động được</strong> — thiết kế được chương trình cho họ.</li></ul>
<h4>Thị trường tổ chức</h4>
<p>Phân khúc theo ngành, quy mô công ty, địa điểm, mức dùng, cách mua (tập trung hay không) và yếu tố tình huống (độ gấp, cỡ đơn). Hãng phần mềm có thể tách nhà hàng, chuỗi bán lẻ và trường học vì nhu cầu và trung tâm mua khác nhau.</p>
<div class="callout"><strong>Quy trình.</strong> (1) Khảo sát nhu cầu; (2) gom người trả lời theo câu trả lời giống nhau; (3) mô tả từng nhóm (là ai, ở đâu, dùng phương tiện nào); (4) đặt tên dễ hiểu (“Sinh viên nhạy cảm giá”); (5) kiểm xem các phân khúc có phản ứng khác nhau với giá hoặc thông điệp không.</div>
<p>Phân khúc là công cụ, không phải định luật. Hãy xem lại khi hành vi đổi, ví dụ khi ứng dụng giao đồ ăn thay đổi thời điểm và nơi người ta ăn.</p>`,
    pit: ['Segmenting by demographics only and then wondering why one message fails for everyone.', 'Chỉ phân khúc theo nhân khẩu rồi thắc mắc vì sao một thông điệp thất bại với mọi người.'],
    s: [['Four bases: geographic, demographic, psychographic, behavioural.', 'Bốn cơ sở: địa lý, nhân khẩu, tâm lý, hành vi.'], ['A good segment is measurable, substantial, accessible, differentiable, actionable.', 'Phân khúc tốt: đo được, đủ lớn, tiếp cận được, khác biệt, hành động được.'], ['Benefits and occasions often beat age.', 'Lợi ích và dịp dùng thường quan trọng hơn tuổi.']],
    l: ['seg', 'tgt', 'cb'],
    p: [['Give two segments of a bubble-tea shop using behavioural bases.', 'Nêu hai phân khúc của quán trà sữa theo cơ sở hành vi.', 'For example: after-school group treats (occasion: socialising) and solo office afternoon pick-me-up (benefit: quick energy and convenience).', 'Ví dụ: nhóm bạn tan học (dịp: giao lưu) và dân văn phòng uống một mình buổi chiều (lợi ích: nhanh, tiện, tỉnh táo).'],
        ['Why is “people who like beauty” a weak segment?', 'Vì sao “người thích làm đẹp” là phân khúc yếu?', 'It is not measurable or actionable: no clear size, no way to reach and design for them.', 'Không đo được và khó hành động: không có quy mô rõ, không biết cách tiếp cận và thiết kế.']] }),

  D(P + '4-2', '4.2 Evaluating and choosing targets', '4.2 Đánh giá và chọn thị trường mục tiêu',
    'Chấm điểm phân khúc, các chiến lược mục tiêu.', {
    n: '4.2',
    g: [['Evaluate segments by size, growth, attractiveness and fit', 'Đánh giá phân khúc theo quy mô, tăng trưởng, hấp dẫn và phù hợp'], ['Score segments with weights', 'Chấm điểm phân khúc có trọng số'], ['Choose among targeting strategies', 'Chọn giữa các chiến lược mục tiêu']],
    en: `<p>After segmenting, decide <em>which</em> to serve. Evaluate each on two groups of questions:</p>
<ul><li><strong>Segment attractiveness</strong> — size, growth, profit margin, intensity of competition, buyers' bargaining power.</li><li><strong>Fit with the company</strong> — objectives, skills, brand, channels, cost position.</li></ul>
<h4>Weighted scoring</h4>
<div class="callout"><strong>Worked example (hypothetical).</strong> Three segments are scored 1–10 on size (weight 0.4), growth (0.3), margin (0.3):<br>A = 8, 5, 6 → 3.2 + 1.5 + 1.8 = <strong>6.5</strong><br>B = 6, 9, 7 → 2.4 + 2.7 + 2.1 = <strong>7.2</strong><br>C = 4, 7, 9 → 1.6 + 2.1 + 2.7 = <strong>6.4</strong><br>B ranks first. Before deciding check the score against fit and against how sensitive the ranking is to the weights (try 0.2/0.4/0.4 and see if the order changes).</div>
<h4>Targeting strategies</h4>` + tbl(['Strategy', 'Idea', 'Good when', 'Risk'], [
      ['Undifferentiated (mass)', 'One offer for everyone', 'Needs are similar, scale economies', 'Nobody feels it is made for them'],
      ['Differentiated', 'Different offers for several segments', 'Segments are distinct and profitable', 'Higher cost, complexity'],
      ['Concentrated (niche)', 'One segment, deep fit', 'Limited resources', 'Dependence on one segment'],
      ['Micromarketing', 'Local or individual tailoring', 'Data and flexible operations', 'Cost, privacy']]) + `
<p>Large Vietnamese dairy and consumer-goods groups typically run differentiated strategies, with separate product lines for different ages and income levels; a small café can win with a niche, such as study-friendly space near universities. Those are illustrations of the strategy types, not statements about any company's results.</p>
<p>Also consider <strong>cannibalisation</strong>: a new line may take sales from your existing line instead of from rivals. If a new cheaper line takes 40% of its sales from your own product, count only the other 60% as incremental.</p>
<div class="note-ct">Ethics check: avoid targeting vulnerable groups (children, people in debt) with persuasive tactics they cannot evaluate. See Chapter 8.</div>`,
    vi: `<p>Sau khi phân khúc, hãy quyết định phục vụ phân khúc <em>nào</em>. Đánh giá mỗi phân khúc theo hai nhóm câu hỏi:</p>
<ul><li><strong>Độ hấp dẫn của phân khúc</strong> — quy mô, tăng trưởng, biên lợi nhuận, mức cạnh tranh, sức mạnh thương lượng của người mua.</li><li><strong>Độ phù hợp với công ty</strong> — mục tiêu, kỹ năng, thương hiệu, kênh, vị thế chi phí.</li></ul>
<h4>Chấm điểm có trọng số</h4>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Ba phân khúc chấm 1–10 về quy mô (trọng số 0,4), tăng trưởng (0,3), biên lợi nhuận (0,3):<br>A = 8, 5, 6 → 3,2 + 1,5 + 1,8 = <strong>6,5</strong><br>B = 6, 9, 7 → 2,4 + 2,7 + 2,1 = <strong>7,2</strong><br>C = 4, 7, 9 → 1,6 + 2,1 + 2,7 = <strong>6,4</strong><br>B đứng đầu. Trước khi quyết, kiểm điểm số với độ phù hợp và xem thứ hạng nhạy với trọng số ra sao (thử 0,2/0,4/0,4 xem thứ tự có đổi không).</div>
<h4>Chiến lược mục tiêu</h4>` + tbl(['Chiến lược', 'Ý tưởng', 'Phù hợp khi', 'Rủi ro'], [
      ['Không phân biệt (đại trà)', 'Một chào bán cho mọi người', 'Nhu cầu giống nhau, kinh tế quy mô', 'Không ai thấy nó dành cho mình'],
      ['Phân biệt', 'Chào bán khác nhau cho nhiều phân khúc', 'Phân khúc khác biệt và sinh lời', 'Chi phí, độ phức tạp cao'],
      ['Tập trung (ngách)', 'Một phân khúc, khớp sâu', 'Nguồn lực hạn chế', 'Phụ thuộc một phân khúc'],
      ['Micromarketing', 'Tuỳ biến theo địa phương hay cá nhân', 'Có dữ liệu và vận hành linh hoạt', 'Chi phí, quyền riêng tư']]) + `
<p>Các tập đoàn sữa và hàng tiêu dùng lớn ở Việt Nam thường chạy chiến lược phân biệt, với dòng sản phẩm riêng cho từng độ tuổi và mức thu nhập; quán cà phê nhỏ có thể thắng bằng ngách, như không gian học tập gần trường đại học. Đó là minh hoạ cho các kiểu chiến lược, không phải khẳng định về kết quả của công ty nào.</p>
<p>Cũng cần xét <strong>tự ăn thị phần</strong>: dòng mới có thể lấy doanh số từ dòng cũ của bạn thay vì từ đối thủ. Nếu dòng rẻ mới lấy 40% doanh số từ chính sản phẩm của bạn, chỉ tính 60% còn lại là phần tăng thêm.</p>
<div class="note-ct">Kiểm tra đạo đức: tránh nhắm các nhóm dễ tổn thương (trẻ em, người đang nợ) bằng chiêu thuyết phục họ không đánh giá được. Xem Chương 8.</div>`,
    pit: ['Choosing the biggest segment by default; the biggest is often the most contested and least profitable for a newcomer.', 'Mặc định chọn phân khúc lớn nhất; phân khúc lớn nhất thường cạnh tranh gay gắt nhất và ít sinh lời với người mới.'],
    s: [['Evaluate attractiveness and fit.', 'Đánh giá độ hấp dẫn và độ phù hợp.'], ['Weighted scores rank segments; test the sensitivity.', 'Điểm có trọng số xếp hạng phân khúc; kiểm độ nhạy.'], ['Four strategies: mass, differentiated, concentrated, micromarketing.', 'Bốn chiến lược: đại trà, phân biệt, tập trung, micromarketing.'], ['Count cannibalisation.', 'Tính cả tự ăn thị phần.']],
    l: ['tgt', 'seg', 'tgoogle'],
    p: [['Re-score A, B, C with weights 0.2/0.4/0.4. Which ranks first?', 'Chấm lại A, B, C với trọng số 0,2/0,4/0,4. Cái nào đứng đầu?', 'A = 1.6 + 2.0 + 2.4 = 6.0; B = 1.2 + 3.6 + 2.8 = 7.6; C = 0.8 + 2.8 + 3.6 = 7.2. B still first.', 'A = 1,6 + 2,0 + 2,4 = 6,0; B = 1,2 + 3,6 + 2,8 = 7,6; C = 0,8 + 2,8 + 3,6 = 7,2. B vẫn đứng đầu.'],
        ['A new line sells 10,000 units, 30% taken from your existing line (margin 20,000 VND) and the new line margin is 30,000 VND. Incremental profit?', 'Dòng mới bán 10.000 đơn vị, 30% lấy từ dòng cũ (lãi 20.000 đồng) và lãi dòng mới 30.000 đồng. Lợi nhuận tăng thêm?', 'New profit 10,000 × 30,000 = 300 million; lost 3,000 × 20,000 = 60 million; incremental = 240 million VND.', 'Lãi mới 10.000 × 30.000 = 300 triệu; mất 3.000 × 20.000 = 60 triệu; tăng thêm = 240 triệu đồng.']] }),

  D(P + '4-3', '4.3 Positioning and differentiation', '4.3 Định vị và khác biệt hoá',
    'Tuyên bố định vị, điểm tương đồng/khác biệt, bản đồ nhận thức.', {
    n: '4.3',
    g: [['Write a positioning statement', 'Viết tuyên bố định vị'], ['Choose points of parity and difference', 'Chọn điểm tương đồng và điểm khác biệt'], ['Read a perceptual map', 'Đọc một bản đồ nhận thức']],
    en: `<p><strong>Positioning</strong> is designing the offer and image so that it occupies a distinctive place in the target customers' minds. The result is a clear <em>value proposition</em>: why should this target buy this brand instead of others?</p>
<h4>Positioning statement</h4>
<div class="formula"><span class="lbl">Template</span>For [target], [brand] is the [frame of reference] that [point of difference], because [reason to believe].</div>
<p>Example (illustrative): “For busy office workers, this cafe chain is the coffee place that gives a quiet workspace within a ten-minute walk, because every outlet has desks, sockets and fast wifi.” Check each part: is the target specific, is the frame (what you compete with) clear, is the difference meaningful and the reason credible?</p>
<h4>Points of parity and difference</h4>
<p><strong>Points of parity</strong> are what the category requires (a coffee shop must serve decent coffee). <strong>Points of difference</strong> are strong, favourable and unique associations that customers value and believe. A difference must be <em>desirable</em> (relevant, distinctive, superior to the buyer) and <em>deliverable</em> (feasible, communicable, sustainable). Bases of difference: product, service, channel, people, image.</p>
<h4>Perceptual maps</h4>
<p>Plot brands on two axes that customers use (e.g. price low–high; modern–traditional). Gaps may be opportunities, but only if customers want that spot. A crowded corner is evidence of demand and also of competition. Build the map from customer ratings, not managers' opinions.</p>
<h4>Repositioning</h4>
<p>If perceptions no longer fit the market, reposition by changing the offer and the story together. Changing only the advertising rarely works, because customers trust experience over claims.</p>
<div class="note-ct">Brand-equity depth (resonance pyramid, brand audit) is covered in the BRA201 course; here we only need a clear target, frame, difference and proof.</div>`,
    vi: `<p><strong>Định vị</strong> là thiết kế chào bán và hình ảnh để chiếm một vị trí đặc trưng trong tâm trí khách hàng mục tiêu. Kết quả là một <em>đề xuất giá trị</em> rõ: vì sao nhóm này nên mua thương hiệu này thay vì thương hiệu khác?</p>
<h4>Tuyên bố định vị</h4>
<div class="formula"><span class="lbl">Khuôn mẫu</span>Với [đối tượng], [thương hiệu] là [khung tham chiếu] mà [điểm khác biệt], vì [lý do tin].</div>
<p>Ví dụ (minh hoạ): “Với dân văn phòng bận rộn, chuỗi quán này là nơi uống cà phê có chỗ làm việc yên tĩnh trong vòng mười phút đi bộ, vì quán nào cũng có bàn, ổ điện và wifi nhanh.” Kiểm từng phần: đối tượng đã cụ thể chưa, khung (bạn cạnh tranh với ai) rõ chưa, khác biệt có ý nghĩa không, lý do có đáng tin không?</p>
<h4>Điểm tương đồng và điểm khác biệt</h4>
<p><strong>Điểm tương đồng</strong> là điều ngành hàng đòi hỏi (quán cà phê phải có cà phê tử tế). <strong>Điểm khác biệt</strong> là liên tưởng mạnh, thuận lợi và độc đáo mà khách hàng coi trọng và tin. Khác biệt phải <em>đáng mong muốn</em> (liên quan, đặc trưng, vượt trội với người mua) và <em>thực hiện được</em> (khả thi, truyền thông được, bền vững). Cơ sở khác biệt: sản phẩm, dịch vụ, kênh, con người, hình ảnh.</p>
<h4>Bản đồ nhận thức</h4>
<p>Đặt các thương hiệu lên hai trục khách hàng dùng (ví dụ giá thấp–cao; hiện đại–truyền thống). Khoảng trống có thể là cơ hội, nhưng chỉ khi khách hàng muốn vị trí đó. Góc đông đúc là bằng chứng của nhu cầu và cũng của cạnh tranh. Dựng bản đồ từ điểm đánh giá của khách hàng, không từ ý kiến của quản lý.</p>
<h4>Tái định vị</h4>
<p>Nếu nhận thức không còn hợp thị trường, tái định vị bằng cách đổi cả chào bán và câu chuyện. Chỉ đổi quảng cáo hiếm khi hiệu quả vì khách hàng tin trải nghiệm hơn lời hứa.</p>
<div class="note-ct">Chiều sâu về giá trị thương hiệu (kim tự tháp cộng hưởng, kiểm toán thương hiệu) có trong khoá BRA201; ở đây chỉ cần đối tượng, khung, khác biệt và bằng chứng rõ ràng.</div>`,
    pit: ['A difference nobody cares about, or one you cannot prove (“the best quality”).', 'Một khác biệt không ai quan tâm, hoặc không chứng minh được (“chất lượng tốt nhất”).'],
    s: [['Positioning = target + frame + difference + reason to believe.', 'Định vị = đối tượng + khung + khác biệt + lý do tin.'], ['Parity is the entry ticket; difference is the reason to choose.', 'Tương đồng là vé vào cửa; khác biệt là lý do chọn.'], ['Perceptual maps need customer data.', 'Bản đồ nhận thức cần dữ liệu khách hàng.']],
    l: ['pos', 'pmap', 'equity', 'ansoff'],
    p: [['Write a one-sentence positioning for a campus laundry service.', 'Viết một câu định vị cho dịch vụ giặt ủi ký túc xá.', 'Example: For dorm students, X is the laundry service that returns clean clothes in 24 hours with pick-up at the door, because we run a collection point on every floor.', 'Ví dụ: Với sinh viên ký túc xá, X là dịch vụ giặt ủi trả đồ sạch trong 24 giờ, nhận tận cửa, vì có điểm thu gom mỗi tầng.'],
        ['Is “fast delivery” a point of parity or difference for online marketplaces?', '“Giao nhanh” là điểm tương đồng hay khác biệt với sàn thương mại điện tử?', 'Increasingly parity: customers expect it, so it is hard to differentiate on speed alone.', 'Ngày càng là tương đồng: khách đã kỳ vọng nên khó khác biệt chỉ bằng tốc độ.']] }),

  Q(P + 'quiz-4', 'Quiz — Chapter 4', 'Quiz — Chương 4', [
    ['Occasion and benefits sought are what kind of base?', 'Dịp dùng và lợi ích tìm kiếm là cơ sở nào?', [['Geographic', 'Địa lý'], ['Demographic', 'Nhân khẩu'], ['Behavioural', 'Hành vi'], ['Firmographic', 'Đặc điểm doanh nghiệp']], 2, 'Behavioural segmentation.', 'Phân khúc theo hành vi.'],
    ['A segment you cannot reach with any channel fails which criterion?', 'Phân khúc không tiếp cận được bằng kênh nào vi phạm tiêu chí nào?', [['Measurable', 'Đo được'], ['Accessible', 'Tiếp cận được'], ['Substantial', 'Đủ lớn'], ['Differentiable', 'Khác biệt']], 1, 'Accessible.', 'Tiếp cận được.'],
    ['Weights 0.4/0.3/0.3 and scores 6/9/7 give', 'Trọng số 0,4/0,3/0,3 và điểm 6/9/7 cho', ['6.5', '7.2', '7.5', '22'], 1, '2.4 + 2.7 + 2.1 = 7.2.', '2,4 + 2,7 + 2,1 = 7,2.'],
    ['One tailored offer for a single segment is', 'Một chào bán riêng cho một phân khúc duy nhất là', [['Undifferentiated', 'Không phân biệt'], ['Differentiated', 'Phân biệt'], ['Concentrated', 'Tập trung'], ['Mass', 'Đại trà']], 2, 'Concentrated (niche).', 'Tập trung (ngách).'],
    ['Cannibalisation means', 'Tự ăn thị phần nghĩa là', [['Rivals copy you', 'Đối thủ sao chép bạn'], ['A new product takes sales from your existing one', 'Sản phẩm mới lấy doanh số của sản phẩm cũ'], ['Prices fall', 'Giá giảm'], ['Costs rise', 'Chi phí tăng']], 1, 'Sales move from your own product.', 'Doanh số chuyển từ chính sản phẩm của bạn.'],
    ['Which is NOT in the positioning statement template?', 'Cái nào KHÔNG có trong khuôn tuyên bố định vị?', [['Target', 'Đối tượng'], ['Point of difference', 'Điểm khác biệt'], ['Reason to believe', 'Lý do tin'], ['Advertising budget', 'Ngân sách quảng cáo']], 3, 'Budget belongs to the plan.', 'Ngân sách thuộc kế hoạch.'],
    ['A point of parity is', 'Điểm tương đồng là', [['A unique strength', 'Thế mạnh độc nhất'], ['What the category requires', 'Điều ngành hàng đòi hỏi'], ['A price cut', 'Giảm giá'], ['A slogan', 'Khẩu hiệu']], 1, 'Parity = category requirement.', 'Tương đồng = yêu cầu của ngành hàng.'],
    ['Perceptual maps should be built from', 'Bản đồ nhận thức nên dựng từ', [['Managers\' opinion', 'Ý kiến quản lý'], ['Customer ratings', 'Điểm đánh giá của khách hàng'], ['Competitor ads', 'Quảng cáo đối thủ'], ['Press releases', 'Thông cáo báo chí']], 1, 'Use customer data.', 'Dùng dữ liệu khách hàng.'],
  ]),
]));
// ===== Chương 5 =====
secs.push(SEC('Chapter 5 — Product and service strategy, and the product life cycle', 'Chương 5 — Chiến lược sản phẩm, dịch vụ và vòng đời sản phẩm',
  'Cấp độ sản phẩm, danh mục sản phẩm, dịch vụ, vòng đời và phát triển sản phẩm mới.', [
  D(P + '5-1', '5.1 Product levels and the product mix', '5.1 Cấp độ sản phẩm và danh mục sản phẩm',
    'Năm cấp độ sản phẩm, phân loại, chiều rộng/chiều dài/chiều sâu danh mục.', {
    n: '5.1',
    g: [['Describe the five product levels', 'Mô tả năm cấp độ sản phẩm'], ['Measure a product mix: width, length, depth', 'Đo danh mục sản phẩm: chiều rộng, chiều dài, chiều sâu'], ['Decide to add, extend or prune lines', 'Quyết định thêm, mở rộng hoặc cắt dòng sản phẩm']],
    en: `<p>A product is anything offered to satisfy a need. Kotler's five levels:</p>
<ol><li><strong>Core benefit</strong> — the need (rest, nutrition, status).</li><li><strong>Basic product</strong> — the physical or service form.</li><li><strong>Expected product</strong> — attributes buyers normally expect (clean room, working app).</li><li><strong>Augmented product</strong> — extras that differentiate (warranty, delivery, loyalty app).</li><li><strong>Potential product</strong> — future augmentations and transformations.</li></ol>
<p>Competition today is usually at the augmented level. A phone maker competes on service, ecosystem and trade-in as much as on the handset.</p>
<h4>Classifying products</h4>
<p>By durability (non-durable, durable, services); consumer goods by shopping habit (convenience, shopping, specialty, unsought); industrial goods by role (materials and parts, capital items, supplies and services). The class suggests the marketing: convenience goods need wide distribution; specialty goods need strong brand and selective distribution.</p>
<h4>Product mix</h4>
<p><strong>Width</strong> = number of product lines; <strong>length</strong> = total number of items; <strong>depth</strong> = variants per product; <strong>consistency</strong> = how related the lines are.</p>
<div class="callout"><strong>Worked example (hypothetical).</strong> A food company sells three lines: noodles (4 items), sauces (6 items), coffee (2 items). Width = 3; length = 4 + 6 + 2 = <strong>12</strong>; average line length = 12 ÷ 3 = <strong>4</strong>. If sauces have 2 sizes each of 3 flavours, depth within sauces is 2 variants per flavour.</div>
<h4>Line decisions</h4>
<ul><li><strong>Line stretching</strong> — downward (mass market), upward (premium), or both.</li><li><strong>Line filling</strong> — add items within the current range; watch cannibalisation.</li><li><strong>Line pruning</strong> — remove items whose sales and contribution are low; measure first, because a "weak" item may draw buyers to the line.</li></ul>
<p>Packaging, labelling and warranties are part of the product: they protect, inform and sell, and they are regulated.</p>`,
    vi: `<p>Sản phẩm là mọi thứ được chào bán để thoả mãn một nhu cầu. Năm cấp độ của Kotler:</p>
<ol><li><strong>Lợi ích cốt lõi</strong> — nhu cầu (nghỉ ngơi, dinh dưỡng, địa vị).</li><li><strong>Sản phẩm cơ bản</strong> — dạng vật lý hoặc dịch vụ.</li><li><strong>Sản phẩm kỳ vọng</strong> — thuộc tính người mua thường mong đợi (phòng sạch, app chạy được).</li><li><strong>Sản phẩm bổ sung</strong> — phần thêm tạo khác biệt (bảo hành, giao hàng, app tích điểm).</li><li><strong>Sản phẩm tiềm năng</strong> — các bổ sung và biến đổi trong tương lai.</li></ol>
<p>Cạnh tranh ngày nay thường ở cấp bổ sung. Hãng điện thoại cạnh tranh bằng dịch vụ, hệ sinh thái, thu cũ đổi mới không kém bản thân chiếc máy.</p>
<h4>Phân loại sản phẩm</h4>
<p>Theo độ bền (không bền, bền, dịch vụ); hàng tiêu dùng theo thói quen mua (tiện lợi, mua sắm, đặc biệt, không tìm kiếm); hàng công nghiệp theo vai trò (nguyên vật liệu và chi tiết, tài sản vốn, vật tư và dịch vụ). Loại sản phẩm gợi ý marketing: hàng tiện lợi cần phân phối rộng; hàng đặc biệt cần thương hiệu mạnh và phân phối chọn lọc.</p>
<h4>Danh mục sản phẩm</h4>
<p><strong>Chiều rộng</strong> = số dòng sản phẩm; <strong>chiều dài</strong> = tổng số mặt hàng; <strong>chiều sâu</strong> = số biến thể của mỗi sản phẩm; <strong>tính nhất quán</strong> = mức liên quan giữa các dòng.</p>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Một công ty thực phẩm bán ba dòng: mì (4 mặt hàng), nước chấm (6), cà phê (2). Chiều rộng = 3; chiều dài = 4 + 6 + 2 = <strong>12</strong>; độ dài trung bình mỗi dòng = 12 ÷ 3 = <strong>4</strong>. Nếu nước chấm có 3 vị, mỗi vị 2 cỡ thì chiều sâu trong nước chấm là 2 biến thể cho mỗi vị.</div>
<h4>Quyết định về dòng</h4>
<ul><li><strong>Kéo giãn dòng</strong> — xuống (đại chúng), lên (cao cấp), hoặc cả hai.</li><li><strong>Lấp đầy dòng</strong> — thêm mặt hàng trong phạm vi hiện có; coi chừng tự ăn thị phần.</li><li><strong>Cắt tỉa dòng</strong> — bỏ mặt hàng doanh số và đóng góp thấp; hãy đo trước, vì mặt hàng “yếu” có thể kéo người mua đến dòng.</li></ul>
<p>Bao bì, nhãn mác và bảo hành là một phần của sản phẩm: bảo vệ, thông tin và bán hàng, đồng thời chịu quy định.</p>`,
    pit: ['Adding variants because they are easy to make, not because a segment wants them; complexity raises cost.', 'Thêm biến thể vì dễ làm chứ không vì phân khúc cần; độ phức tạp làm tăng chi phí.'],
    s: [['Five levels: core, basic, expected, augmented, potential.', 'Năm cấp: cốt lõi, cơ bản, kỳ vọng, bổ sung, tiềm năng.'], ['Mix: width = lines, length = items, depth = variants.', 'Danh mục: rộng = số dòng, dài = số mặt hàng, sâu = số biến thể.'], ['Stretch, fill, prune with data.', 'Kéo giãn, lấp đầy, cắt tỉa dựa trên dữ liệu.']],
    l: ['prod', 'mix', 'strat'],
    p: [['A firm has lines with 5, 3 and 8 items. Width, length, average line length?', 'Hãng có các dòng 5, 3, 8 mặt hàng. Rộng, dài, độ dài trung bình?', 'Width 3, length 16, average 16 ÷ 3 ≈ 5.3.', 'Rộng 3, dài 16, trung bình 16 ÷ 3 ≈ 5,3.'],
        ['Which level is “free delivery and 24/7 chat support” for a laptop?', '“Giao miễn phí và chat hỗ trợ 24/7” với laptop thuộc cấp nào?', 'Augmented product.', 'Sản phẩm bổ sung.']] }),

  D(P + '5-2', '5.2 Services marketing', '5.2 Marketing dịch vụ',
    'Bốn đặc tính dịch vụ, khoảng cách chất lượng, 7P.', {
    n: '5.2',
    g: [['Explain the four characteristics of services', 'Giải thích bốn đặc tính của dịch vụ'], ['Describe the service quality gaps', 'Mô tả các khoảng cách chất lượng dịch vụ'], ['Use the extended 7P mix', 'Dùng bộ 7P mở rộng']],
    en: `<p>Many offerings are mainly service: banking, education, transport, hotels, delivery apps, cafés. Services have four characteristics and each needs a response.</p>` + tbl(['Characteristic', 'Meaning', 'Response'], [
      ['Intangibility', 'Cannot be seen or touched before purchase', 'Make it tangible: reviews, photos, trial, clear process'],
      ['Inseparability', 'Produced and consumed together', 'Train staff; manage the customer’s part'],
      ['Variability', 'Quality depends on who, when, where', 'Standardise, hire and train well, monitor satisfaction'],
      ['Perishability', 'Cannot be stored (empty seat today is lost revenue)', 'Manage demand: off-peak prices, booking, capacity planning']]) + `
<h4>Service quality gaps</h4>
<p>Customers judge quality by comparing expected with perceived service. The gap model finds where it breaks: management misunderstands expectations; service standards are wrong; delivery falls short of standards; promises exceed delivery; and finally perceived service falls short of expected. SERVQUAL groups judgements into five dimensions: reliability, responsiveness, assurance, empathy and tangibles. Reliability is usually the most important.</p>
<h4>Extended mix: 7Ps</h4>
<p>Beyond product, price, place and promotion, services add <strong>people</strong> (frontline staff), <strong>process</strong> (the flow customers go through) and <strong>physical evidence</strong> (store design, uniform, app interface).</p>
<div class="callout"><strong>Worked example: capacity and perishability (hypothetical).</strong> A 40-seat café opens 12 hours a day and each seat can turn over 2 customers per hour at full use, so capacity = 40 × 12 × 2 = 960 customer-visits. Actual visits are 480, so utilisation = 480 ÷ 960 = <strong>50%</strong>. If the average ticket is 55,000 VND, moving utilisation to 60% adds 96 visits ≈ 5.28 million VND per day. Off-peak offers aim to fill the gaps without discounting the busy hours.</div>
<p><strong>Internal marketing</strong> matters: staff deliver the promise, so hiring, training and empowering them is part of the marketing plan. Recovery also matters: a complaint solved well can raise loyalty above that of customers who never had a problem.</p>`,
    vi: `<p>Nhiều chào bán chủ yếu là dịch vụ: ngân hàng, giáo dục, vận tải, khách sạn, ứng dụng giao hàng, quán cà phê. Dịch vụ có bốn đặc tính và mỗi đặc tính cần một cách ứng phó.</p>` + tbl(['Đặc tính', 'Ý nghĩa', 'Ứng phó'], [
      ['Vô hình', 'Không thấy hay chạm được trước khi mua', 'Hữu hình hoá: đánh giá, ảnh, dùng thử, quy trình rõ'],
      ['Không tách rời', 'Sản xuất và tiêu dùng cùng lúc', 'Đào tạo nhân viên; quản lý phần việc của khách'],
      ['Biến thiên', 'Chất lượng phụ thuộc ai, khi nào, ở đâu', 'Chuẩn hoá, tuyển và đào tạo tốt, theo dõi hài lòng'],
      ['Không lưu kho được', 'Ghế trống hôm nay là doanh thu mất', 'Quản lý cầu: giá giờ thấp điểm, đặt chỗ, hoạch định công suất']]) + `
<h4>Khoảng cách chất lượng dịch vụ</h4>
<p>Khách hàng đánh giá chất lượng bằng cách so dịch vụ kỳ vọng với dịch vụ cảm nhận. Mô hình khoảng cách tìm chỗ đứt gãy: quản lý hiểu sai kỳ vọng; tiêu chuẩn dịch vụ sai; thực hiện không đạt tiêu chuẩn; lời hứa vượt quá thực tế; cuối cùng dịch vụ cảm nhận thấp hơn kỳ vọng. SERVQUAL gom đánh giá thành năm chiều: tin cậy, đáp ứng, đảm bảo, đồng cảm và hữu hình. Tin cậy thường quan trọng nhất.</p>
<h4>Bộ 7P mở rộng</h4>
<p>Ngoài sản phẩm, giá, phân phối, xúc tiến, dịch vụ thêm <strong>con người</strong> (nhân viên tuyến đầu), <strong>quy trình</strong> (luồng khách đi qua) và <strong>bằng chứng vật lý</strong> (thiết kế cửa hàng, đồng phục, giao diện app).</p>
<div class="callout"><strong>Ví dụ có lời giải: công suất và tính không lưu kho (giả định).</strong> Quán 40 chỗ mở 12 giờ/ngày, mỗi chỗ tối đa phục vụ 2 khách mỗi giờ, nên công suất = 40 × 12 × 2 = 960 lượt khách. Thực tế 480 lượt, nên hiệu suất = 480 ÷ 960 = <strong>50%</strong>. Nếu hoá đơn trung bình 55.000 đồng, nâng hiệu suất lên 60% thêm 96 lượt ≈ 5,28 triệu đồng mỗi ngày. Ưu đãi giờ thấp điểm nhằm lấp khoảng trống mà không giảm giá giờ đông.</div>
<p><strong>Marketing nội bộ</strong> rất quan trọng: nhân viên thực hiện lời hứa, nên tuyển, đào tạo và trao quyền cho họ là một phần của kế hoạch marketing. Khắc phục sự cố cũng quan trọng: khiếu nại được giải quyết tốt có thể làm tăng trung thành hơn cả khách chưa từng gặp vấn đề.</p>`,
    pit: ['Promising what frontline staff cannot deliver; the biggest service gap is often promise versus delivery.', 'Hứa điều nhân viên tuyến đầu không làm được; khoảng cách lớn nhất thường là lời hứa so với thực tế.'],
    s: [['Services are intangible, inseparable, variable and perishable.', 'Dịch vụ vô hình, không tách rời, biến thiên và không lưu kho được.'], ['SERVQUAL: reliability, responsiveness, assurance, empathy, tangibles.', 'SERVQUAL: tin cậy, đáp ứng, đảm bảo, đồng cảm, hữu hình.'], ['7Ps add people, process, physical evidence.', '7P thêm con người, quy trình, bằng chứng vật lý.']],
    l: ['serv', 'servq', 'cx'],
    p: [['A clinic has 30 slots per day and fills 21. Utilisation?', 'Phòng khám có 30 suất/ngày và lấp 21. Hiệu suất?', '21 ÷ 30 = 70%.', '21 ÷ 30 = 70%.'],
        ['Which P is “the sequence of steps a diner follows from ordering to paying”?', 'P nào là “chuỗi bước thực khách đi từ gọi món đến trả tiền”?', 'Process.', 'Quy trình (process).']] }),

  D(P + '5-3', '5.3 Product life cycle and new product development', '5.3 Vòng đời sản phẩm và phát triển sản phẩm mới',
    'Bốn giai đoạn vòng đời, chiến lược theo giai đoạn, quy trình sản phẩm mới.', {
    n: '5.3',
    g: [['Describe the four life-cycle stages and typical strategies', 'Mô tả bốn giai đoạn vòng đời và chiến lược điển hình'], ['Outline the new product development stages', 'Phác các giai đoạn phát triển sản phẩm mới'], ['Interpret a development funnel', 'Đọc phễu phát triển']],
    en: `<p>Products, like markets, have a life: introduction, growth, maturity, decline. The curve is a planning tool, not a law; fashions have short cycles, staples very long ones, and good management can renew a mature product.</p>` + tbl(['Stage', 'Sales and profit', 'Typical strategy'], [
      ['Introduction', 'Low sales, losses', 'Build awareness and trial; limited versions; skim or penetrate on price'],
      ['Growth', 'Rapid sales, rising profit', 'Improve quality, add features, enter new segments and channels, shift from awareness to preference'],
      ['Maturity', 'Sales peak, profit stable then falling', 'Modify market, product or mix; defend share; cut cost'],
      ['Decline', 'Sales and profit fall', 'Harvest, divest, or reposition; decide on timing of exit']]) + `
<p>Adopters spread through time: innovators, early adopters, early majority, late majority, laggards. Early adopters are opinion leaders; winning them makes the early majority follow. Many tech products fail by treating early adopters and the mainstream as the same market.</p>
<h4>New product development</h4>
<ol><li><strong>Idea generation</strong> — customers, staff, rivals, data.</li><li><strong>Screening</strong> — drop ideas that clearly do not fit.</li><li><strong>Concept development and testing</strong> — describe the idea to target customers and measure intent.</li><li><strong>Business analysis</strong> — forecast sales, costs, break-even.</li><li><strong>Prototype and product test</strong>.</li><li><strong>Market test</strong> — limited area or online pilot.</li><li><strong>Commercialisation</strong> — launch plan, timing, channels, budget.</li></ol>
<div class="callout"><strong>Worked example: the funnel (hypothetical).</strong> A company screens 60 ideas, keeps 15 concepts after testing, builds 6 prototypes, launches 3 products and 1 becomes a lasting success. Concept-to-launch yield = 3 ÷ 15 = 20%; idea-to-success yield = 1 ÷ 60 ≈ <strong>1.7%</strong>. If each stage costs more than the previous one, the cheapest moment to kill a bad idea is early, so stage-gate reviews with clear criteria save money.</div>
<p>Agile and lean methods shorten the loop: launch a minimum viable product to a small group, learn from data, iterate. Failure causes: poor customer insight, over-estimated market size, weak differentiation, bad timing, and costs higher than planned.</p>`,
    vi: `<p>Sản phẩm, như thị trường, có vòng đời: giới thiệu, tăng trưởng, bão hoà, suy thoái. Đường cong là công cụ hoạch định, không phải định luật; thời trang có vòng đời ngắn, hàng thiết yếu rất dài, và quản lý tốt có thể làm mới sản phẩm đã bão hoà.</p>` + tbl(['Giai đoạn', 'Doanh số và lợi nhuận', 'Chiến lược điển hình'], [
      ['Giới thiệu', 'Doanh số thấp, lỗ', 'Tạo nhận biết và dùng thử; ít phiên bản; hớt váng hoặc thâm nhập về giá'],
      ['Tăng trưởng', 'Doanh số tăng nhanh, lợi nhuận tăng', 'Cải thiện chất lượng, thêm tính năng, vào phân khúc và kênh mới, chuyển từ nhận biết sang ưa thích'],
      ['Bão hoà', 'Doanh số đạt đỉnh, lợi nhuận ổn định rồi giảm', 'Điều chỉnh thị trường, sản phẩm hoặc marketing hỗn hợp; bảo vệ thị phần; cắt chi phí'],
      ['Suy thoái', 'Doanh số và lợi nhuận giảm', 'Thu hoạch, thoái vốn hoặc tái định vị; quyết định thời điểm rút']]) + `
<p>Người chấp nhận lan truyền theo thời gian: người đổi mới, người chấp nhận sớm, đa số sớm, đa số muộn, người chậm. Người chấp nhận sớm là người dẫn dắt ý kiến; thắng họ thì đa số sớm sẽ theo. Nhiều sản phẩm công nghệ thất bại vì coi người chấp nhận sớm và số đông là một thị trường.</p>
<h4>Phát triển sản phẩm mới</h4>
<ol><li><strong>Tạo ý tưởng</strong> — khách hàng, nhân viên, đối thủ, dữ liệu.</li><li><strong>Sàng lọc</strong> — loại ý tưởng rõ ràng không phù hợp.</li><li><strong>Phát triển và thử nghiệm khái niệm</strong> — mô tả ý tưởng cho khách mục tiêu và đo ý định mua.</li><li><strong>Phân tích kinh doanh</strong> — dự báo doanh số, chi phí, hoà vốn.</li><li><strong>Mẫu thử và thử sản phẩm</strong>.</li><li><strong>Thử thị trường</strong> — khu vực giới hạn hoặc thí điểm trực tuyến.</li><li><strong>Thương mại hoá</strong> — kế hoạch ra mắt, thời điểm, kênh, ngân sách.</li></ol>
<div class="callout"><strong>Ví dụ có lời giải: phễu (giả định).</strong> Công ty sàng 60 ý tưởng, giữ 15 khái niệm sau thử nghiệm, làm 6 mẫu, ra mắt 3 sản phẩm và 1 thành công lâu dài. Tỷ lệ khái niệm → ra mắt = 3 ÷ 15 = 20%; tỷ lệ ý tưởng → thành công = 1 ÷ 60 ≈ <strong>1,7%</strong>. Nếu mỗi giai đoạn tốn kém hơn giai đoạn trước, thời điểm rẻ nhất để loại ý tưởng tệ là sớm, nên các cổng duyệt có tiêu chí rõ tiết kiệm tiền.</div>
<p>Phương pháp agile và lean rút ngắn vòng lặp: ra sản phẩm khả thi tối thiểu cho nhóm nhỏ, học từ dữ liệu, lặp lại. Nguyên nhân thất bại: thiếu hiểu biết khách hàng, đánh giá quá cao quy mô thị trường, khác biệt yếu, sai thời điểm, và chi phí cao hơn kế hoạch.</p>`,
    pit: ['Treating the life-cycle curve as destiny: a mature product can be renewed by new uses, segments or formats.', 'Coi đường cong vòng đời là số phận: sản phẩm bão hoà có thể được làm mới bằng công dụng, phân khúc hay định dạng mới.'],
    s: [['Four stages with different goals: awareness, share, defence, harvest.', 'Bốn giai đoạn với mục tiêu khác nhau: nhận biết, thị phần, bảo vệ, thu hoạch.'], ['Seven development stages; kill weak ideas early.', 'Bảy giai đoạn phát triển; loại ý tưởng yếu sớm.'], ['Early adopters are not the mainstream.', 'Người chấp nhận sớm không phải số đông.']],
    l: ['plc', 'npd', 'doi'],
    p: [['100 ideas, 20 concepts, 5 launches, 2 successes. Idea-to-success yield?', '100 ý tưởng, 20 khái niệm, 5 ra mắt, 2 thành công. Tỷ lệ ý tưởng → thành công?', '2 ÷ 100 = 2%.', '2 ÷ 100 = 2%.'],
        ['Which life-cycle stage typically needs the most promotion spending per sale?', 'Giai đoạn vòng đời nào thường cần chi xúc tiến trên mỗi đơn nhiều nhất?', 'Introduction.', 'Giới thiệu.']] }),

  Q(P + 'quiz-5', 'Quiz — Chapter 5', 'Quiz — Chương 5', [
    ['A warranty and a loyalty app are part of the', 'Bảo hành và app tích điểm thuộc', [['Core benefit', 'Lợi ích cốt lõi'], ['Basic product', 'Sản phẩm cơ bản'], ['Augmented product', 'Sản phẩm bổ sung'], ['Potential product', 'Sản phẩm tiềm năng']], 2, 'Extras that differentiate are augmented.', 'Phần thêm tạo khác biệt là sản phẩm bổ sung.'],
    ['Lines with 4, 6 and 2 items give length', 'Các dòng 4, 6, 2 mặt hàng cho chiều dài', ['3', '4', '12', '24'], 2, '4 + 6 + 2 = 12.', '4 + 6 + 2 = 12.'],
    ['Product-mix width is the number of', 'Chiều rộng danh mục là số', [['Items', 'Mặt hàng'], ['Lines', 'Dòng sản phẩm'], ['Variants', 'Biến thể'], ['Stores', 'Cửa hàng']], 1, 'Width counts lines.', 'Chiều rộng đếm số dòng.'],
    ['Empty seats that cannot be stored refer to', 'Ghế trống không lưu được nói về', [['Intangibility', 'Vô hình'], ['Variability', 'Biến thiên'], ['Perishability', 'Không lưu kho'], ['Inseparability', 'Không tách rời']], 2, 'Perishability.', 'Tính không lưu kho.'],
    ['Which is NOT an extra P of services?', 'Cái nào KHÔNG là P thêm của dịch vụ?', [['People', 'Con người'], ['Process', 'Quy trình'], ['Physical evidence', 'Bằng chứng vật lý'], ['Profit', 'Lợi nhuận']], 3, 'Profit is an outcome, not a P.', 'Lợi nhuận là kết quả, không phải một P.'],
    ['480 visits against a capacity of 960 means utilisation', '480 lượt trên công suất 960 nghĩa là hiệu suất', ['25%', '50%', '75%', '200%'], 1, '480 ÷ 960 = 50%.', '480 ÷ 960 = 50%.'],
    ['Sales peak and profit stabilise in the', 'Doanh số đạt đỉnh và lợi nhuận ổn định ở giai đoạn', [['Introduction', 'Giới thiệu'], ['Growth', 'Tăng trưởng'], ['Maturity', 'Bão hoà'], ['Decline', 'Suy thoái']], 2, 'Maturity.', 'Bão hoà.'],
    ['Cheapest time to drop a bad product idea is', 'Thời điểm rẻ nhất để bỏ một ý tưởng sản phẩm tệ là', [['After launch', 'Sau ra mắt'], ['At the market test', 'Ở thử thị trường'], ['At screening', 'Ở sàng lọc'], ['At commercialisation', 'Ở thương mại hoá']], 2, 'Early stages cost least.', 'Giai đoạn đầu tốn ít nhất.'],
  ]),
]));
// ===== Chương 6 =====
secs.push(SEC('Chapter 6 — Pricing', 'Chương 6 — Định giá',
  'Cách tiếp cận định giá, hoà vốn và độ co giãn, chiến lược và điều chỉnh giá.', [
  D(P + '6-1', '6.1 Pricing approaches', '6.1 Các cách tiếp cận định giá',
    'Cộng chi phí, lợi nhuận mục tiêu, theo giá trị, theo đối thủ.', {
    n: '6.1',
    g: [['Distinguish cost-based, value-based and competition-based pricing', 'Phân biệt định giá theo chi phí, theo giá trị và theo đối thủ'], ['Compute cost-plus and target-return prices', 'Tính giá cộng chi phí và giá lợi nhuận mục tiêu'], ['Convert between markup on cost and margin on price', 'Chuyển đổi giữa markup trên chi phí và biên lợi nhuận trên giá']],
    en: `<p>Price is the only P that brings in revenue; the others are costs. Three forces frame the decision: <strong>costs</strong> set the floor, <strong>competitors' prices</strong> and substitutes set a reference, and <strong>customer-perceived value</strong> sets the ceiling.</p>
<h4>Cost-plus (markup) pricing</h4>
<p>Price = unit cost × (1 + markup on cost).</p>
<div class="callout"><strong>Worked example (hypothetical).</strong> Unit cost 60,000 VND, markup 25% on cost: price = 60,000 × 1.25 = <strong>75,000 VND</strong>. The profit is 15,000, which is 15,000 ÷ 75,000 = <strong>20% of the price</strong>. Markup on cost (25%) and margin on price (20%) describe the same profit; always say which one you mean.</div>
<h4>Target-return pricing</h4>
<div class="callout"><strong>Worked example (hypothetical).</strong> Variable cost 24,000 VND per unit, fixed cost 120 million per period, expected volume 10,000 units, invested capital 600 million with a 20% target return.<br>Unit cost = 24,000 + 120,000,000 ÷ 10,000 = 36,000. Target profit = 0.20 × 600,000,000 = 120,000,000, i.e. 12,000 per unit. Price = 36,000 + 12,000 = <strong>48,000 VND</strong>. This works only if 10,000 units really sell at that price.</div>
<h4>Value-based pricing</h4>
<p>Start from what the target customer is willing to pay for the benefits, then work back to cost. Estimate the <em>economic value</em>: the price of the best alternative plus the value of differences. If the reference product costs 100,000 VND and your product saves the customer 40,000 VND in time or waste, a price of 120,000 VND shares the gain: the customer keeps 20,000, you capture 20,000 above the reference. “Good-value” pricing offers the right quality at a fair price; “every-day low pricing” in retail avoids deep promotions.</p>
<h4>Competition-based pricing</h4>
<p>Going-rate or sealed-bid pricing uses rivals' prices as the anchor. It is safe but can start price wars; check that your cost and value position justify matching.</p>
<div class="pitfall"><strong>Common mistake.</strong> Letting accounting cost decide alone. A cost-plus price may be far below what customers would pay (leaving money on the table) or above what they accept (no sales).</div>
<p>Steps in practice: select the pricing objective (survival, profit, share, quality leadership), estimate demand, estimate costs, analyse competitors, choose a method, set the final price and test it.</p>`,
    vi: `<p>Giá là P duy nhất mang lại doanh thu; các P khác là chi phí. Ba lực định khung quyết định: <strong>chi phí</strong> đặt sàn, <strong>giá đối thủ</strong> và sản phẩm thay thế đặt mốc tham chiếu, <strong>giá trị khách hàng cảm nhận</strong> đặt trần.</p>
<h4>Định giá cộng chi phí (markup)</h4>
<p>Giá = chi phí đơn vị × (1 + markup trên chi phí).</p>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Chi phí đơn vị 60.000 đồng, markup 25% trên chi phí: giá = 60.000 × 1,25 = <strong>75.000 đồng</strong>. Lãi là 15.000, bằng 15.000 ÷ 75.000 = <strong>20% trên giá</strong>. Markup trên chi phí (25%) và biên lợi nhuận trên giá (20%) mô tả cùng một khoản lãi; luôn nói rõ bạn dùng cái nào.</div>
<h4>Định giá lợi nhuận mục tiêu</h4>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Biến phí 24.000 đồng/đơn vị, định phí 120 triệu mỗi kỳ, sản lượng kỳ vọng 10.000 đơn vị, vốn đầu tư 600 triệu với lợi suất mục tiêu 20%.<br>Chi phí đơn vị = 24.000 + 120.000.000 ÷ 10.000 = 36.000. Lợi nhuận mục tiêu = 0,20 × 600.000.000 = 120.000.000, tức 12.000 mỗi đơn vị. Giá = 36.000 + 12.000 = <strong>48.000 đồng</strong>. Chỉ đúng nếu 10.000 đơn vị thật sự bán được ở giá đó.</div>
<h4>Định giá theo giá trị</h4>
<p>Bắt đầu từ mức khách mục tiêu sẵn lòng trả cho lợi ích, rồi suy ngược chi phí. Ước lượng <em>giá trị kinh tế</em>: giá của phương án thay thế tốt nhất cộng giá trị của phần khác biệt. Nếu sản phẩm tham chiếu giá 100.000 đồng và sản phẩm của bạn giúp khách tiết kiệm 40.000 đồng thời gian hoặc hao phí, giá 120.000 đồng chia sẻ phần lợi: khách giữ 20.000, bạn thu 20.000 trên mức tham chiếu. “Giá trị tốt” là chất lượng phù hợp ở giá hợp lý; “giá thấp mỗi ngày” trong bán lẻ tránh khuyến mãi sâu.</p>
<h4>Định giá theo đối thủ</h4>
<p>Định giá theo mặt bằng hoặc đấu thầu kín dùng giá đối thủ làm mốc. An toàn nhưng có thể khởi động cuộc chiến giá; hãy kiểm tra chi phí và vị thế giá trị có biện minh cho việc bám giá không.</p>
<div class="pitfall"><strong>Lỗi hay gặp.</strong> Để chi phí kế toán tự quyết định giá. Giá cộng chi phí có thể thấp hơn nhiều so với mức khách chịu trả (bỏ tiền trên bàn) hoặc cao hơn mức khách chấp nhận (không bán được).</div>
<p>Các bước thực tế: chọn mục tiêu giá (tồn tại, lợi nhuận, thị phần, dẫn đầu chất lượng), ước lượng cầu, ước lượng chi phí, phân tích đối thủ, chọn phương pháp, đặt giá cuối và thử nghiệm.</p>`,
    s: [['Costs set the floor, competition the reference, value the ceiling.', 'Chi phí đặt sàn, đối thủ đặt mốc, giá trị đặt trần.'], ['Markup on cost ≠ margin on price (25% vs 20% here).', 'Markup trên chi phí ≠ biên lợi nhuận trên giá (25% so với 20%).'], ['Value-based pricing starts from the customer\'s benefit.', 'Định giá theo giá trị bắt đầu từ lợi ích của khách.']],
    l: ['pricing', 'cplus', 'vbp'],
    p: [['Cost 80,000 VND, markup 30% on cost. Price and margin on price?', 'Chi phí 80.000 đồng, markup 30% trên chi phí. Giá và biên lợi nhuận trên giá?', 'Price 104,000; profit 24,000; margin 24,000 ÷ 104,000 ≈ 23.1%.', 'Giá 104.000; lãi 24.000; biên 24.000 ÷ 104.000 ≈ 23,1%.'],
        ['Variable cost 30,000, fixed 90 million, 5,000 units, target profit 20 million. Price?', 'Biến phí 30.000, định phí 90 triệu, 5.000 đơn vị, lợi nhuận mục tiêu 20 triệu. Giá?', 'Unit cost 30,000 + 18,000 = 48,000; profit per unit 4,000; price 52,000 VND.', 'Chi phí đơn vị 30.000 + 18.000 = 48.000; lãi mỗi đơn vị 4.000; giá 52.000 đồng.']] }),

  D(P + '6-2', '6.2 Break-even analysis and price elasticity', '6.2 Phân tích hoà vốn và độ co giãn theo giá',
    'Điểm hoà vốn, biên đóng góp, độ co giãn và tác động lên doanh thu/lợi nhuận.', {
    n: '6.2',
    g: [['Compute break-even volume and revenue', 'Tính sản lượng và doanh thu hoà vốn'], ['Compute the volume needed for a target profit', 'Tính sản lượng cần cho lợi nhuận mục tiêu'], ['Compute elasticity and see its effect on revenue and profit', 'Tính độ co giãn và tác động lên doanh thu, lợi nhuận']],
    en: `<h4>Break-even</h4>
<p>Contribution margin per unit = price − variable cost per unit. Break-even volume is where total contribution covers fixed costs.</p>` + fm('Break-even', 'BEP (units) = fixed cost ÷ (price − variable cost)') + `
<div class="callout"><strong>Worked example (hypothetical).</strong> Price 45,000 VND, variable cost 27,000, fixed cost 120,000,000 per month.<br>Contribution = 45,000 − 27,000 = 18,000 (a ratio of 18,000 ÷ 45,000 = 40%).<br>BEP = 120,000,000 ÷ 18,000 = 6,666.7, so round up to <strong>6,667 units</strong>, or revenue 6,667 × 45,000 = 300,015,000 VND (≈ 120,000,000 ÷ 0.40 = 300,000,000 before rounding).<br>For a target profit of 30,000,000: units = (120,000,000 + 30,000,000) ÷ 18,000 = 8,333.3 → <strong>8,334 units</strong>.<br>If the forecast is 10,000 units, the margin of safety = (10,000 − 6,667) ÷ 10,000 = <strong>33.3%</strong>, and profit = 10,000 × 18,000 − 120,000,000 = <strong>60,000,000 VND</strong>.<br>If the price falls to 40,000, contribution is 13,000 and BEP = 120,000,000 ÷ 13,000 = 9,230.8 → 9,231 units. A 11% price cut raises the break-even volume by 38%.</div>
<h4>Price elasticity</h4>` + fm('Elasticity', 'E = % change in quantity ÷ % change in price') + `
<p>|E| &gt; 1 means elastic (volume reacts strongly); |E| &lt; 1 inelastic. Necessities, unique products and low-share-of-budget items tend to be inelastic; substitutable items with easy comparison are elastic.</p>
<div class="callout"><strong>Worked example (hypothetical).</strong> Price 40,000 → 36,000 (−10%), volume 1,000 → 1,250 (+25%): E = +25 ÷ −10 = <strong>−2.5</strong> (elastic). Revenue: 40,000 × 1,000 = 40,000,000 → 36,000 × 1,250 = 45,000,000 (up). But with variable cost 24,000: profit before = 16,000 × 1,000 = 16,000,000; after = 12,000 × 1,250 = <strong>15,000,000</strong> (down). Revenue rose while profit fell, because each unit earns less. Always test price moves on <em>contribution</em>, not on revenue.</div>
<p>Elasticity is estimated from price experiments, historical data and surveys; it changes with competitors' reactions and with time.</p>`,
    vi: `<h4>Hoà vốn</h4>
<p>Biên đóng góp mỗi đơn vị = giá − biến phí mỗi đơn vị. Sản lượng hoà vốn là mức mà tổng đóng góp bù được định phí.</p>` + fm('Hoà vốn', 'BEP (đơn vị) = định phí ÷ (giá − biến phí)') + `
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Giá 45.000 đồng, biến phí 27.000, định phí 120.000.000 mỗi tháng.<br>Đóng góp = 45.000 − 27.000 = 18.000 (tỷ lệ 18.000 ÷ 45.000 = 40%).<br>BEP = 120.000.000 ÷ 18.000 = 6.666,7, làm tròn lên <strong>6.667 đơn vị</strong>, doanh thu 6.667 × 45.000 = 300.015.000 đồng (≈ 120.000.000 ÷ 0,40 = 300.000.000 trước khi làm tròn).<br>Với lợi nhuận mục tiêu 30.000.000: số đơn vị = (120.000.000 + 30.000.000) ÷ 18.000 = 8.333,3 → <strong>8.334 đơn vị</strong>.<br>Nếu dự báo 10.000 đơn vị, biên an toàn = (10.000 − 6.667) ÷ 10.000 = <strong>33,3%</strong>, và lợi nhuận = 10.000 × 18.000 − 120.000.000 = <strong>60.000.000 đồng</strong>.<br>Nếu giá giảm còn 40.000, đóng góp là 13.000 và BEP = 120.000.000 ÷ 13.000 = 9.230,8 → 9.231 đơn vị. Giảm giá 11% làm sản lượng hoà vốn tăng 38%.</div>
<h4>Độ co giãn theo giá</h4>` + fm('Độ co giãn', 'E = % thay đổi lượng ÷ % thay đổi giá') + `
<p>|E| &gt; 1 là co giãn (lượng phản ứng mạnh); |E| &lt; 1 là kém co giãn. Hàng thiết yếu, sản phẩm độc đáo và mặt hàng chiếm tỷ trọng nhỏ trong ngân sách thường kém co giãn; hàng thay thế được và dễ so sánh thì co giãn.</p>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Giá 40.000 → 36.000 (−10%), lượng 1.000 → 1.250 (+25%): E = +25 ÷ −10 = <strong>−2,5</strong> (co giãn). Doanh thu: 40.000 × 1.000 = 40.000.000 → 36.000 × 1.250 = 45.000.000 (tăng). Nhưng với biến phí 24.000: lợi nhuận trước = 16.000 × 1.000 = 16.000.000; sau = 12.000 × 1.250 = <strong>15.000.000</strong> (giảm). Doanh thu tăng mà lợi nhuận giảm vì mỗi đơn vị lãi ít hơn. Luôn thử thay đổi giá trên <em>đóng góp</em>, không phải doanh thu.</div>
<p>Độ co giãn được ước lượng từ thí nghiệm giá, dữ liệu lịch sử và khảo sát; nó đổi theo phản ứng của đối thủ và theo thời gian.</p>`,
    pit: ['Rounding the break-even down: 6,666 units does not cover fixed costs; round up.', 'Làm tròn hoà vốn xuống: 6.666 đơn vị chưa bù đủ định phí; phải làm tròn lên.'],
    s: [['BEP = fixed ÷ contribution per unit.', 'BEP = định phí ÷ đóng góp mỗi đơn vị.'], ['Margin of safety = (forecast − BEP) ÷ forecast.', 'Biên an toàn = (dự báo − BEP) ÷ dự báo.'], ['Revenue up does not mean profit up when elastic demand meets thin margins.', 'Doanh thu tăng không có nghĩa lợi nhuận tăng khi cầu co giãn gặp biên mỏng.']],
    l: ['bep', 'elast', 'pricing', 'roi'],
    p: [['Price 60,000, variable cost 36,000, fixed 96 million. BEP in units?', 'Giá 60.000, biến phí 36.000, định phí 96 triệu. BEP bao nhiêu đơn vị?', '96,000,000 ÷ 24,000 = 4,000 units.', '96.000.000 ÷ 24.000 = 4.000 đơn vị.'],
        ['Price rises 5% and volume falls 8%. Elasticity? Elastic or inelastic?', 'Giá tăng 5%, lượng giảm 8%. Độ co giãn? Co giãn hay không?', 'E = −8 ÷ 5 = −1.6: elastic (|E| > 1).', 'E = −8 ÷ 5 = −1,6: co giãn (|E| > 1).']] }),

  D(P + '6-3', '6.3 Pricing strategies and adjustments', '6.3 Chiến lược giá và điều chỉnh giá',
    'Hớt váng, thâm nhập, tâm lý, chiết khấu, phân biệt giá, chuỗi biên lợi nhuận kênh.', {
    n: '6.3',
    g: [['Choose between skimming and penetration', 'Chọn giữa hớt váng và thâm nhập'], ['Evaluate a discount with the volume-needed rule', 'Đánh giá chiết khấu bằng quy tắc sản lượng cần thiết'], ['Build a channel price chain', 'Dựng chuỗi giá qua kênh']],
    en: `<h4>New-product strategies</h4>
<ul><li><strong>Price skimming</strong> — high initial price, lowered over time. Works when a segment values novelty, quality image is needed, and rivals cannot copy fast.</li><li><strong>Penetration pricing</strong> — low initial price to win share quickly. Works when demand is elastic, costs fall with volume and rivals will follow fast. Marketplaces often combine low prices with vouchers to build habit; the risk is that customers learn to wait for discounts.</li></ul>
<h4>Adjustments</h4>
<ul><li><strong>Psychological</strong> — 99,000 instead of 100,000; reference prices; “good-better-best” tiers.</li><li><strong>Promotional</strong> — loss leaders, limited-time offers, cash rebates.</li><li><strong>Discounts and allowances</strong> — cash, quantity, functional (to channel members), seasonal.</li><li><strong>Price discrimination</strong> — different prices for customers, products or times (student tickets, peak and off-peak, dynamic prices). Needs separable segments and must feel fair.</li><li><strong>Geographic</strong> — shipping, free-delivery thresholds.</li></ul>
<h4>Is a discount worth it?</h4>
<div class="callout"><strong>Worked example (hypothetical).</strong> Price 100,000 VND, variable cost 70,000, so contribution = 30,000 (30%). A 20% discount cuts the price to 80,000 and the contribution to 10,000. To keep the same total contribution, volume must rise by 30,000 ÷ 10,000 = 3 times, i.e. <strong>+200%</strong>. A "small" discount is very expensive when margins are thin. General rule: required volume multiple = old contribution ÷ new contribution.</div>
<h4>Channel price chain</h4>
<div class="callout"><strong>Worked example (hypothetical).</strong> The producer sells at 80,000 VND. The wholesaler wants a 15% margin on its selling price: 80,000 ÷ 0.85 = 94,118. The retailer wants 25% on its selling price: 94,118 ÷ 0.75 = <strong>125,490 VND</strong> shelf price. Each added level raises the shelf price, which is why direct-to-consumer channels can offer lower prices or higher margin.</div>
<p>Initiating and responding to price changes: cut only if you can sustain it; consider adding a fighter brand or extra value instead. Legal and ethical limits apply: deceptive "was/now" prices, collusion and predatory pricing are regulated or prohibited in most markets, including Vietnam. Check current rules before using them in a campaign.</p>`,
    vi: `<h4>Chiến lược cho sản phẩm mới</h4>
<ul><li><strong>Hớt váng giá</strong> — giá khởi đầu cao, giảm dần theo thời gian. Hiệu quả khi có phân khúc quý sự mới mẻ, cần hình ảnh chất lượng và đối thủ khó sao chép nhanh.</li><li><strong>Định giá thâm nhập</strong> — giá khởi đầu thấp để chiếm thị phần nhanh. Hiệu quả khi cầu co giãn, chi phí giảm theo sản lượng và đối thủ sẽ theo nhanh. Các sàn thương mại điện tử hay kết hợp giá thấp với voucher để tạo thói quen; rủi ro là khách quen chờ khuyến mãi.</li></ul>
<h4>Điều chỉnh giá</h4>
<ul><li><strong>Tâm lý</strong> — 99.000 thay vì 100.000; giá tham chiếu; bậc “tốt – tốt hơn – tốt nhất”.</li><li><strong>Khuyến mãi</strong> — hàng kéo khách bán lỗ, ưu đãi có thời hạn, hoàn tiền.</li><li><strong>Chiết khấu và bớt giá</strong> — thanh toán tiền mặt, số lượng, chức năng (cho thành viên kênh), mùa vụ.</li><li><strong>Phân biệt giá</strong> — giá khác nhau theo khách hàng, sản phẩm hoặc thời điểm (vé sinh viên, cao điểm và thấp điểm, giá động). Cần các phân khúc tách biệt được và phải tạo cảm giác công bằng.</li><li><strong>Địa lý</strong> — phí vận chuyển, ngưỡng miễn phí giao hàng.</li></ul>
<h4>Giảm giá có đáng không?</h4>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Giá 100.000 đồng, biến phí 70.000, đóng góp = 30.000 (30%). Giảm 20% đưa giá còn 80.000 và đóng góp còn 10.000. Để giữ nguyên tổng đóng góp, sản lượng phải tăng 30.000 ÷ 10.000 = 3 lần, tức <strong>+200%</strong>. Giảm giá “nhỏ” rất đắt khi biên mỏng. Quy tắc chung: bội số sản lượng cần thiết = đóng góp cũ ÷ đóng góp mới.</div>
<h4>Chuỗi giá qua kênh</h4>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Nhà sản xuất bán 80.000 đồng. Nhà bán sỉ muốn biên 15% trên giá bán của mình: 80.000 ÷ 0,85 = 94.118. Nhà bán lẻ muốn 25% trên giá bán của mình: 94.118 ÷ 0,75 = <strong>125.490 đồng</strong> giá trên kệ. Mỗi tầng thêm đẩy giá kệ lên, đó là lý do kênh bán trực tiếp đến người tiêu dùng có thể giá thấp hơn hoặc biên cao hơn.</div>
<p>Khởi xướng và đáp lại thay đổi giá: chỉ giảm nếu duy trì được; cân nhắc thêm thương hiệu chiến đấu hoặc thêm giá trị. Có giới hạn pháp lý và đạo đức: giá “gốc/nay” gây hiểu lầm, thông đồng và bán phá giá bị quy định hoặc cấm ở hầu hết thị trường, kể cả Việt Nam. Hãy kiểm tra quy định hiện hành trước khi dùng trong chiến dịch.</p>`,
    pit: ['Believing a promotion is “free marketing”; it is paid for out of contribution, and it trains customers to wait.', 'Nghĩ khuyến mãi là “marketing miễn phí”; nó được trả bằng đóng góp và tập cho khách chờ giảm giá.'],
    s: [['Skimming vs penetration depends on elasticity, cost curve and rivals.', 'Hớt váng hay thâm nhập tuỳ độ co giãn, đường chi phí và đối thủ.'], ['Required volume multiple = old contribution ÷ new contribution.', 'Bội số sản lượng cần = đóng góp cũ ÷ đóng góp mới.'], ['Channel margins stack up in the shelf price.', 'Biên của các tầng kênh cộng dồn vào giá kệ.']],
    l: ['skim', 'pen', 'disc', 'dist'],
    p: [['Price 50,000, variable cost 35,000, discount 10%. Volume multiple needed?', 'Giá 50.000, biến phí 35.000, giảm 10%. Cần sản lượng gấp mấy lần?', 'Old contribution 15,000; new price 45,000, contribution 10,000; multiple = 1.5 (+50%).', 'Đóng góp cũ 15.000; giá mới 45.000, đóng góp 10.000; bội số 1,5 (+50%).'],
        ['Producer price 60,000; wholesaler margin 20% on selling price; retailer 30% on selling price. Shelf price?', 'Giá nhà sản xuất 60.000; biên sỉ 20% trên giá bán; lẻ 30% trên giá bán. Giá kệ?', '60,000 ÷ 0.8 = 75,000; 75,000 ÷ 0.7 ≈ 107,143 VND.', '60.000 ÷ 0,8 = 75.000; 75.000 ÷ 0,7 ≈ 107.143 đồng.']] }),

  Q(P + 'quiz-6', 'Quiz — Chapter 6', 'Quiz — Chương 6', [
    ['In pricing, which sets the floor?', 'Trong định giá, yếu tố nào đặt mức sàn?', [['Competitors\' prices', 'Giá đối thủ'], ['Costs', 'Chi phí'], ['Customer value', 'Giá trị khách hàng'], ['Advertising', 'Quảng cáo']], 1, 'Costs set the floor, value the ceiling.', 'Chi phí đặt sàn, giá trị đặt trần.'],
    ['Cost 60,000 with 25% markup on cost gives price', 'Chi phí 60.000 với markup 25% trên chi phí cho giá', ['65,000', '75,000', '80,000', '85,000'], 1, '60,000 × 1.25 = 75,000.', '60.000 × 1,25 = 75.000.'],
    ['In that case the margin on price is', 'Khi đó biên lợi nhuận trên giá là', ['25%', '20%', '15%', '30%'], 1, '15,000 ÷ 75,000 = 20%.', '15.000 ÷ 75.000 = 20%.'],
    ['Price 45,000, variable 27,000, fixed 120 million. Break-even units (rounded up)?', 'Giá 45.000, biến phí 27.000, định phí 120 triệu. BEP (làm tròn lên)?', ['4,000', '6,667', '8,334', '10,000'], 1, '120,000,000 ÷ 18,000 = 6,666.7.', '120.000.000 ÷ 18.000 = 6.666,7.'],
    ['Price down 10%, volume up 25% gives elasticity', 'Giá giảm 10%, lượng tăng 25% cho độ co giãn', ['−0.4', '−2.5', '+2.5', '−1'], 1, '25 ÷ −10 = −2.5.', '25 ÷ −10 = −2,5.'],
    ['With elastic demand and thin margins, a price cut can', 'Với cầu co giãn và biên mỏng, giảm giá có thể', [['Raise revenue and lower profit', 'Tăng doanh thu và giảm lợi nhuận'], ['Lower revenue and raise profit', 'Giảm doanh thu và tăng lợi nhuận'], ['Never change profit', 'Không bao giờ đổi lợi nhuận'], ['Raise both always', 'Luôn tăng cả hai']], 0, 'As in the worked example.', 'Như ví dụ trong bài.'],
    ['Price 100,000, variable 70,000, 20% discount. Required volume increase?', 'Giá 100.000, biến phí 70.000, giảm 20%. Sản lượng phải tăng bao nhiêu?', ['+20%', '+100%', '+200%', '+300%'], 2, '30,000 ÷ 10,000 = 3 times.', '30.000 ÷ 10.000 = 3 lần.'],
    ['High initial price then lowered over time is', 'Giá khởi đầu cao rồi giảm dần là', [['Penetration', 'Thâm nhập'], ['Skimming', 'Hớt váng'], ['Bundling', 'Gói sản phẩm'], ['Cost-plus', 'Cộng chi phí']], 1, 'Skimming.', 'Hớt váng.'],
  ]),
]));
// ===== Chương 7 =====
secs.push(SEC('Chapter 7 — Channels, retailing and integrated communications', 'Chương 7 — Kênh phân phối, bán lẻ và truyền thông tích hợp',
  'Thiết kế kênh, bán lẻ và omnichannel, truyền thông tích hợp, marketing số và mạng xã hội.', [
  D(P + '7-1', '7.1 Marketing channels and retailing', '7.1 Kênh marketing và bán lẻ',
    'Cấp kênh, chức năng, xung đột kênh, bán lẻ, omnichannel, vòng quay hàng tồn.', {
    n: '7.1',
    g: [['Describe channel levels and functions', 'Mô tả cấp kênh và chức năng của kênh'], ['Choose between intensive, selective and exclusive distribution', 'Chọn giữa phân phối rộng rãi, chọn lọc và độc quyền'], ['Compute retail gross margin and stock turnover', 'Tính biên lợi nhuận gộp và vòng quay tồn kho của bán lẻ']],
    en: `<p>A marketing channel is a set of organisations that make a product available for use or consumption. Channel members take on functions: information, promotion, contact, matching, negotiation, physical distribution, financing and risk. You can eliminate intermediaries but you cannot eliminate the functions.</p>
<h4>Channel levels</h4>
<ul><li><strong>Zero-level (direct)</strong> — own stores, website, app, direct sales.</li><li><strong>One-level</strong> — manufacturer → retailer → consumer.</li><li><strong>Two-level</strong> — manufacturer → wholesaler → retailer → consumer (typical for fast-moving goods reaching small shops).</li></ul>
<h4>Distribution intensity</h4>` + tbl(['Type', 'Outlets', 'Best for'], [['Intensive', 'As many as possible', 'Convenience goods'], ['Selective', 'Some chosen outlets', 'Shopping goods, brands needing service'], ['Exclusive', 'One per area', 'Luxury, specialty, cars']]) + `
<h4>Conflict and coordination</h4>
<p><strong>Channel conflict</strong> arises when members' goals clash: a brand selling online at a lower price than its dealers; a marketplace seller undercutting an authorised shop. Tools: clear roles, consistent pricing rules, shared targets, and in some cases splitting products by channel.</p>
<h4>Retailing and omnichannel</h4>
<p>Retail formats include convenience stores, supermarkets, specialist chains, department stores, markets, online marketplaces and social commerce. Customers now switch between store, app and chat in one purchase; <strong>omnichannel</strong> means one view of the customer and inventory across channels (order online, collect in store, return anywhere). Consumer-electronics and mobile-phone chains in Vietnam, for example, combine store networks with websites and apps; for current facts use the company's own reports.</p>
<div class="callout"><strong>Worked example (hypothetical).</strong> A retailer has sales of 1,200 million VND and cost of goods sold of 900 million. Gross margin = 300 ÷ 1,200 = <strong>25%</strong>. Average inventory at cost is 150 million, so stock turnover = 900 ÷ 150 = <strong>6 times a year</strong> (about 61 days of stock). Raising turnover to 8 with the same sales needs only 112.5 million of stock, releasing 37.5 million of cash. Fast turnover can compensate for a modest margin.</div>
<p>Logistics, the “place” side: order processing, warehousing, inventory, transport. Service level (delivery time, accuracy) costs money; set it by what customers value, not by the maximum possible.</p>`,
    vi: `<p>Kênh marketing là tập hợp các tổ chức làm cho sản phẩm sẵn sàng để sử dụng hoặc tiêu dùng. Thành viên kênh đảm nhận các chức năng: thông tin, xúc tiến, tiếp xúc, ghép nhu cầu, thương lượng, phân phối vật lý, tài chính và chia sẻ rủi ro. Có thể loại trung gian nhưng không loại được các chức năng.</p>
<h4>Cấp kênh</h4>
<ul><li><strong>Cấp 0 (trực tiếp)</strong> — cửa hàng riêng, website, app, bán hàng trực tiếp.</li><li><strong>Một cấp</strong> — nhà sản xuất → nhà bán lẻ → người tiêu dùng.</li><li><strong>Hai cấp</strong> — nhà sản xuất → nhà bán sỉ → nhà bán lẻ → người tiêu dùng (điển hình cho hàng nhanh đến các cửa hàng nhỏ).</li></ul>
<h4>Cường độ phân phối</h4>` + tbl(['Kiểu', 'Điểm bán', 'Hợp với'], [['Rộng rãi', 'Càng nhiều càng tốt', 'Hàng tiện lợi'], ['Chọn lọc', 'Một số điểm được chọn', 'Hàng mua sắm, thương hiệu cần dịch vụ'], ['Độc quyền', 'Một điểm mỗi khu vực', 'Xa xỉ, hàng đặc biệt, ô tô']]) + `
<h4>Xung đột và phối hợp</h4>
<p><strong>Xung đột kênh</strong> nảy sinh khi mục tiêu của các thành viên va nhau: thương hiệu bán trực tuyến giá thấp hơn đại lý; người bán trên sàn phá giá cửa hàng chính hãng. Công cụ: vai trò rõ ràng, quy tắc giá nhất quán, mục tiêu chung, và đôi khi tách sản phẩm theo kênh.</p>
<h4>Bán lẻ và omnichannel</h4>
<p>Các loại hình bán lẻ gồm cửa hàng tiện lợi, siêu thị, chuỗi chuyên doanh, trung tâm thương mại, chợ, sàn thương mại điện tử và bán hàng qua mạng xã hội. Khách hàng nay chuyển giữa cửa hàng, app và chat trong một lần mua; <strong>omnichannel</strong> nghĩa là một cái nhìn thống nhất về khách hàng và tồn kho trên mọi kênh (đặt online, nhận tại cửa hàng, trả hàng ở bất kỳ đâu). Chẳng hạn các chuỗi điện máy và điện thoại ở Việt Nam kết hợp mạng lưới cửa hàng với website và app; số liệu hiện hành hãy xem báo cáo của chính công ty.</p>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Một nhà bán lẻ có doanh thu 1.200 triệu đồng và giá vốn 900 triệu. Biên lợi nhuận gộp = 300 ÷ 1.200 = <strong>25%</strong>. Tồn kho trung bình theo giá vốn 150 triệu, nên vòng quay = 900 ÷ 150 = <strong>6 lần/năm</strong> (khoảng 61 ngày tồn). Nâng vòng quay lên 8 với cùng doanh thu chỉ cần 112,5 triệu hàng tồn, giải phóng 37,5 triệu tiền mặt. Vòng quay nhanh có thể bù cho biên khiêm tốn.</div>
<p>Hậu cần, phía “phân phối”: xử lý đơn, kho, tồn kho, vận tải. Mức dịch vụ (thời gian giao, độ chính xác) tốn tiền; đặt theo điều khách hàng coi trọng chứ không theo mức tối đa có thể.</p>`,
    pit: ['Cutting out intermediaries and forgetting that someone still has to store, deliver and handle returns.', 'Cắt trung gian mà quên rằng vẫn phải có người lưu kho, giao hàng và xử lý đổi trả.'],
    s: [['Channels perform functions; you can shift them but not remove them.', 'Kênh thực hiện chức năng; có thể chuyển chứ không loại bỏ.'], ['Intensive, selective, exclusive distribution fit different goods.', 'Rộng rãi, chọn lọc, độc quyền hợp với các loại hàng khác nhau.'], ['Stock turnover = COGS ÷ average inventory.', 'Vòng quay tồn kho = giá vốn ÷ tồn kho trung bình.']],
    l: ['dist', 'retail', 'omni', 'conflict', 'scm'],
    p: [['COGS 600, average inventory 100 (million). Turnover and days of stock?', 'Giá vốn 600, tồn kho trung bình 100 (triệu). Vòng quay và số ngày tồn?', '6 times; 365 ÷ 6 ≈ 61 days.', '6 lần; 365 ÷ 6 ≈ 61 ngày.'],
        ['Which distribution intensity suits bottled water?', 'Cường độ phân phối nào hợp với nước đóng chai?', 'Intensive: a convenience good that must be everywhere.', 'Rộng rãi: hàng tiện lợi phải có ở mọi nơi.']] }),

  D(P + '7-2', '7.2 Integrated marketing communications', '7.2 Truyền thông marketing tích hợp',
    'Công cụ truyền thông, mô hình AIDA, thiết lập ngân sách, share of voice.', {
    n: '7.2',
    g: [['List the communication tools', 'Liệt kê các công cụ truyền thông'], ['Develop a campaign: audience, objective, message, media', 'Xây chiến dịch: khán giả, mục tiêu, thông điệp, phương tiện'], ['Set a budget and compute share of voice', 'Đặt ngân sách và tính share of voice']],
    en: `<p>IMC coordinates all communication so that the customer hears one consistent story. The main tools: <strong>advertising</strong>, <strong>sales promotion</strong>, <strong>events and experiences</strong>, <strong>public relations</strong>, <strong>direct and database marketing</strong>, <strong>online and social media</strong>, <strong>word of mouth</strong> and <strong>personal selling</strong>.</p>
<h4>Developing a campaign</h4>
<ol><li><strong>Identify the target audience</strong> — from your STP work.</li><li><strong>Set objectives</strong> — a communication goal along the hierarchy: awareness → knowledge → liking → preference → conviction → purchase (AIDA: attention, interest, desire, action).</li><li><strong>Design the message</strong> — what to say (appeal: rational, emotional, moral), how (structure, format, tone), and who says it (source credibility).</li><li><strong>Select channels</strong> — personal (sales, friends, experts) and non-personal (media, events).</li><li><strong>Set the budget</strong>.</li><li><strong>Decide the mix</strong>.</li><li><strong>Measure results</strong> — recall, attitude, clicks, sales.</li></ol>
<h4>Budget methods</h4>
<ul><li><strong>Affordable</strong> — what is left (weak: ignores objectives).</li><li><strong>Percentage of sales</strong> — simple but lets sales drive spending, not the other way round.</li><li><strong>Competitive parity</strong> — match rivals.</li><li><strong>Objective-and-task</strong> — define objectives, estimate the tasks and their cost (best in principle).</li></ul>
<div class="callout"><strong>Worked example (hypothetical).</strong> Percentage of sales: sales of 2,000 million VND × 3% = <strong>60 million</strong>. Share of voice: the category spends 100 million in total on media and you spend 20 million, so your share of voice = 20%. If your market share is 15%, your share of voice exceeds it by 5 points; this is often linked with growth, but it is a rule of thumb to test, not a guarantee.</div>
<h4>Push and pull</h4>
<p><strong>Push</strong>: incentives to the channel so it stocks and sells. <strong>Pull</strong>: communication to consumers so they ask for the product. Most plans use both.</p>
<div class="pitfall"><strong>Common mistake.</strong> Different messages from the ad agency, PR team and store staff. Create one message house (core idea, 3 supporting proofs) and have every team adapt it.</div>
<p>Regulation: advertising claims must be truthful and substantiated, and some categories (health claims, children's products, financial products) have extra rules. Check current Vietnamese regulations with the legal team before launch.</p>`,
    vi: `<p>IMC phối hợp mọi truyền thông để khách hàng nghe một câu chuyện nhất quán. Các công cụ chính: <strong>quảng cáo</strong>, <strong>khuyến mãi</strong>, <strong>sự kiện và trải nghiệm</strong>, <strong>quan hệ công chúng</strong>, <strong>marketing trực tiếp và cơ sở dữ liệu</strong>, <strong>truyền thông trực tuyến và mạng xã hội</strong>, <strong>truyền miệng</strong> và <strong>bán hàng cá nhân</strong>.</p>
<h4>Xây dựng chiến dịch</h4>
<ol><li><strong>Xác định khán giả mục tiêu</strong> — từ công việc STP.</li><li><strong>Đặt mục tiêu</strong> — mục tiêu truyền thông theo thang: nhận biết → hiểu biết → thích → ưa chuộng → tin tưởng → mua (AIDA: chú ý, quan tâm, mong muốn, hành động).</li><li><strong>Thiết kế thông điệp</strong> — nói gì (hấp dẫn lý trí, cảm xúc, đạo đức), nói thế nào (cấu trúc, định dạng, giọng điệu) và ai nói (độ tin cậy của nguồn).</li><li><strong>Chọn kênh</strong> — cá nhân (bán hàng, bạn bè, chuyên gia) và phi cá nhân (truyền thông, sự kiện).</li><li><strong>Đặt ngân sách</strong>.</li><li><strong>Quyết định bộ công cụ</strong>.</li><li><strong>Đo kết quả</strong> — mức nhớ, thái độ, lượt nhấp, doanh số.</li></ol>
<h4>Phương pháp ngân sách</h4>
<ul><li><strong>Khả năng chi trả</strong> — phần còn lại (yếu: bỏ qua mục tiêu).</li><li><strong>Phần trăm doanh số</strong> — đơn giản nhưng để doanh số quyết định chi tiêu, thay vì ngược lại.</li><li><strong>Ngang bằng đối thủ</strong> — theo đối thủ.</li><li><strong>Mục tiêu và nhiệm vụ</strong> — xác định mục tiêu, ước lượng nhiệm vụ và chi phí (tốt nhất về nguyên tắc).</li></ul>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Phần trăm doanh số: doanh số 2.000 triệu đồng × 3% = <strong>60 triệu</strong>. Share of voice: cả ngành chi 100 triệu cho truyền thông và bạn chi 20 triệu, nên share of voice = 20%. Nếu thị phần của bạn là 15%, share of voice vượt thị phần 5 điểm; điều này thường được liên hệ với tăng trưởng nhưng chỉ là quy tắc kinh nghiệm cần kiểm chứng, không phải bảo đảm.</div>
<h4>Đẩy và kéo</h4>
<p><strong>Đẩy</strong>: khuyến khích kênh để họ nhập và bán. <strong>Kéo</strong>: truyền thông đến người tiêu dùng để họ hỏi mua sản phẩm. Hầu hết kế hoạch dùng cả hai.</p>
<div class="pitfall"><strong>Lỗi hay gặp.</strong> Agency quảng cáo, đội PR và nhân viên cửa hàng nói ba thông điệp khác nhau. Hãy dựng một “ngôi nhà thông điệp” (ý tưởng cốt lõi, 3 bằng chứng) và để mọi đội điều chỉnh từ đó.</div>
<p>Quy định: tuyên bố quảng cáo phải trung thực và có căn cứ, và một số ngành (tuyên bố sức khoẻ, sản phẩm trẻ em, sản phẩm tài chính) có quy tắc thêm. Hãy kiểm tra quy định hiện hành của Việt Nam cùng bộ phận pháp chế trước khi triển khai.</p>`,
    s: [['IMC = one consistent story across all tools.', 'IMC = một câu chuyện nhất quán trên mọi công cụ.'], ['Campaign order: audience, objective, message, channel, budget, measure.', 'Thứ tự chiến dịch: khán giả, mục tiêu, thông điệp, kênh, ngân sách, đo lường.'], ['Objective-and-task budgeting beats percentage of sales.', 'Ngân sách theo mục tiêu và nhiệm vụ tốt hơn phần trăm doanh số.']],
    l: ['imc', 'adv', 'promo', 'pr'],
    p: [['Sales 3,000 million VND, 2.5% of sales for communications. Budget?', 'Doanh số 3.000 triệu đồng, 2,5% doanh số cho truyền thông. Ngân sách?', '3,000 × 0.025 = 75 million VND.', '3.000 × 0,025 = 75 triệu đồng.'],
        ['You spend 12 of a 80 category total. Share of voice? Market share 10%: higher or lower?', 'Bạn chi 12 trên tổng ngành 80. Share of voice? Thị phần 10%: cao hay thấp hơn?', '12 ÷ 80 = 15%, 5 points above market share.', '12 ÷ 80 = 15%, cao hơn thị phần 5 điểm.']] }),

  D(P + '7-3', '7.3 Digital and social media marketing', '7.3 Marketing số và mạng xã hội',
    'Kênh số, nội dung, người ảnh hưởng, CTR/CPC/CPA/ROAS có ví dụ số.', {
    n: '7.3',
    g: [['Name the main digital channels', 'Gọi tên các kênh số chính'], ['Compute CTR, CPC, CPA and ROAS', 'Tính CTR, CPC, CPA và ROAS'], ['Plan content and influencer use responsibly', 'Lập kế hoạch nội dung và người ảnh hưởng có trách nhiệm']],
    en: `<p>Digital channels: <strong>search</strong> (organic SEO and paid search ads), <strong>display and video ads</strong>, <strong>social media</strong> (organic content and paid), <strong>email and messaging</strong>, <strong>marketplaces</strong> (listing quality, ratings, platform ads and vouchers), <strong>content and community</strong>, and <strong>influencers/creators</strong>. Their advantage is targeting and measurement; the risk is measuring what is easy (clicks) instead of what matters (profit).</p>
<h4>Core metrics</h4>` + fm('Funnel metrics', 'CTR = clicks ÷ impressions · CPC = spend ÷ clicks · conversion rate = orders ÷ clicks · CPA = spend ÷ orders · ROAS = revenue ÷ spend') + `
<div class="callout"><strong>Worked example (hypothetical).</strong> 500,000 impressions, CTR 2% → 10,000 clicks. Spend 30,000,000 VND → CPC = 3,000 VND. Conversion 3% → 300 orders → CPA = <strong>100,000 VND</strong>. Average order value 450,000 → revenue = 135,000,000 → ROAS = 135 ÷ 30 = <strong>4.5</strong>. With a 30% contribution margin, contribution = 40,500,000, minus ad spend 30,000,000 = <strong>+10,500,000 VND</strong>. A ROAS of 4.5 looks great, but a product with only 20% margin would need ROAS above 5 to break even on the ad spend alone (1 ÷ 0.20).</div>
<h4>Content and social</h4>
<p>Plan content around the journey: attract (useful, entertaining), convince (proof, reviews, demos), convert (offers, easy checkout), retain (community, service). A content calendar assigns formats, owners and a metric to each post. Social media is also a service channel: response time is part of the brand.</p>
<h4>Influencers</h4>
<p>Choose creators whose audience matches your target, not just those with big follower counts; check engagement quality, past content and fit. Sponsored content should be clearly disclosed, claims must be true, and you should have a contract on approvals and usage rights. Track with unique codes or links.</p>
<h4>Data and privacy</h4>
<p>Collect only the data you need, get consent, secure it, and respect rules on personal data. Trust once lost costs more than any campaign gained. Algorithms and platform rules change often; avoid dependence on a single platform by building your own audience (email, community, app).</p>`,
    vi: `<p>Kênh số: <strong>tìm kiếm</strong> (SEO tự nhiên và quảng cáo tìm kiếm trả phí), <strong>quảng cáo hiển thị và video</strong>, <strong>mạng xã hội</strong> (nội dung tự nhiên và trả phí), <strong>email và tin nhắn</strong>, <strong>sàn thương mại điện tử</strong> (chất lượng gian hàng, đánh giá, quảng cáo và voucher của sàn), <strong>nội dung và cộng đồng</strong>, và <strong>người ảnh hưởng/nhà sáng tạo</strong>. Ưu điểm là nhắm mục tiêu và đo lường; rủi ro là đo điều dễ đo (lượt nhấp) thay vì điều quan trọng (lợi nhuận).</p>
<h4>Chỉ số cốt lõi</h4>` + fm('Chỉ số phễu', 'CTR = lượt nhấp ÷ lượt hiển thị · CPC = chi phí ÷ lượt nhấp · tỷ lệ chuyển đổi = đơn ÷ lượt nhấp · CPA = chi phí ÷ đơn · ROAS = doanh thu ÷ chi phí') + `
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> 500.000 lượt hiển thị, CTR 2% → 10.000 lượt nhấp. Chi 30.000.000 đồng → CPC = 3.000 đồng. Chuyển đổi 3% → 300 đơn → CPA = <strong>100.000 đồng</strong>. Giá trị đơn trung bình 450.000 → doanh thu = 135.000.000 → ROAS = 135 ÷ 30 = <strong>4,5</strong>. Với biên đóng góp 30%, đóng góp = 40.500.000, trừ chi phí quảng cáo 30.000.000 = <strong>+10.500.000 đồng</strong>. ROAS 4,5 trông tốt, nhưng sản phẩm chỉ có biên 20% cần ROAS trên 5 mới hoà vốn chi phí quảng cáo (1 ÷ 0,20).</div>
<h4>Nội dung và mạng xã hội</h4>
<p>Lập nội dung theo hành trình: thu hút (hữu ích, giải trí), thuyết phục (bằng chứng, đánh giá, demo), chuyển đổi (ưu đãi, thanh toán dễ), giữ chân (cộng đồng, dịch vụ). Lịch nội dung gán định dạng, người phụ trách và chỉ số cho từng bài. Mạng xã hội cũng là kênh dịch vụ: thời gian phản hồi là một phần của thương hiệu.</p>
<h4>Người ảnh hưởng</h4>
<p>Chọn người sáng tạo có khán giả khớp mục tiêu của bạn, không chỉ những người đông người theo dõi; kiểm tra chất lượng tương tác, nội dung trước đây và độ phù hợp. Nội dung tài trợ phải công khai rõ, tuyên bố phải đúng, và cần hợp đồng về duyệt bài và quyền sử dụng. Theo dõi bằng mã hoặc liên kết riêng.</p>
<h4>Dữ liệu và quyền riêng tư</h4>
<p>Chỉ thu dữ liệu cần thiết, xin đồng ý, bảo mật và tôn trọng quy định về dữ liệu cá nhân. Niềm tin đã mất tốn hơn mọi chiến dịch thu được. Thuật toán và quy tắc nền tảng đổi thường xuyên; tránh phụ thuộc một nền tảng bằng cách xây tệp khán giả riêng (email, cộng đồng, app).</p>`,
    pit: ['Celebrating clicks and likes while ignoring CPA and contribution margin.', 'Ăn mừng lượt nhấp và lượt thích mà bỏ qua CPA và biên đóng góp.'],
    s: [['CTR, CPC, CPA, ROAS chain from impressions to revenue.', 'Chuỗi CTR, CPC, CPA, ROAS đi từ hiển thị đến doanh thu.'], ['Break-even ROAS = 1 ÷ contribution margin.', 'ROAS hoà vốn = 1 ÷ biên đóng góp.'], ['Disclose sponsorship; protect data.', 'Công khai tài trợ; bảo vệ dữ liệu.']],
    l: ['dig', 'smm', 'seo', 'content', 'influ'],
    p: [['Spend 20 million, 8,000 clicks, 160 orders, AOV 400,000. CPC, CPA, ROAS?', 'Chi 20 triệu, 8.000 lượt nhấp, 160 đơn, AOV 400.000. CPC, CPA, ROAS?', 'CPC 2,500; CPA 125,000; revenue 64 million; ROAS 3.2.', 'CPC 2.500; CPA 125.000; doanh thu 64 triệu; ROAS 3,2.'],
        ['Margin 25%. Break-even ROAS?', 'Biên 25%. ROAS hoà vốn?', '1 ÷ 0.25 = 4.', '1 ÷ 0,25 = 4.']] }),

  Q(P + 'quiz-7', 'Quiz — Chapter 7', 'Quiz — Chương 7', [
    ['Manufacturer → wholesaler → retailer → consumer is a', 'Nhà sản xuất → bán sỉ → bán lẻ → người tiêu dùng là kênh', [['Zero-level channel', 'Cấp 0'], ['One-level channel', 'Một cấp'], ['Two-level channel', 'Hai cấp'], ['Direct channel', 'Trực tiếp']], 2, 'Two intermediaries = two-level.', 'Hai trung gian = hai cấp.'],
    ['Bottled water usually uses which distribution?', 'Nước đóng chai thường dùng cách phân phối nào?', [['Exclusive', 'Độc quyền'], ['Selective', 'Chọn lọc'], ['Intensive', 'Rộng rãi'], ['Direct only', 'Chỉ trực tiếp']], 2, 'Convenience goods need ubiquity.', 'Hàng tiện lợi cần có mặt khắp nơi.'],
    ['COGS 900, average inventory 150 gives turnover', 'Giá vốn 900, tồn kho trung bình 150 cho vòng quay', ['3', '6', '9', '12'], 1, '900 ÷ 150 = 6.', '900 ÷ 150 = 6.'],
    ['A brand selling online cheaper than its dealers creates', 'Thương hiệu bán online rẻ hơn đại lý tạo ra', [['Channel conflict', 'Xung đột kênh'], ['Cannibalisation', 'Tự ăn thị phần'], ['Skimming', 'Hớt váng'], ['Positioning', 'Định vị']], 0, 'Channel conflict.', 'Xung đột kênh.'],
    ['Which budget method is best in principle?', 'Phương pháp ngân sách nào tốt nhất về nguyên tắc?', [['Affordable', 'Khả năng chi trả'], ['Percentage of sales', 'Phần trăm doanh số'], ['Competitive parity', 'Ngang bằng đối thủ'], ['Objective-and-task', 'Mục tiêu và nhiệm vụ']], 3, 'It starts from objectives.', 'Nó bắt đầu từ mục tiêu.'],
    ['Spending 20 of a 100 category total gives share of voice', 'Chi 20 trong tổng ngành 100 cho share of voice', ['10%', '20%', '25%', '80%'], 1, '20 ÷ 100.', '20 ÷ 100.'],
    ['Spend 30M, revenue 135M. ROAS =', 'Chi 30 triệu, doanh thu 135 triệu. ROAS =', ['3.5', '4.0', '4.5', '5.0'], 2, '135 ÷ 30 = 4.5.', '135 ÷ 30 = 4,5.'],
    ['Break-even ROAS for a 20% contribution margin is', 'ROAS hoà vốn với biên đóng góp 20% là', ['2', '4', '5', '20'], 2, '1 ÷ 0.20 = 5.', '1 ÷ 0,20 = 5.'],
  ]),
]));
// ===== Chương 8 =====
secs.push(SEC('Chapter 8 — Marketing metrics, control, ethics and sustainability', 'Chương 8 — Chỉ số marketing, kiểm soát, đạo đức và bền vững',
  'Đo hiệu quả marketing, kiểm soát kế hoạch, đạo đức, bền vững và tổng kết xây kế hoạch.', [
  D(P + '8-1', '8.1 Marketing metrics and return on marketing investment', '8.1 Chỉ số marketing và hiệu quả đầu tư marketing',
    'ROMI, CAC, churn, thời gian hoàn vốn, bảng chỉ số.', {
    n: '8.1',
    g: [['Choose metrics linked to objectives', 'Chọn chỉ số gắn với mục tiêu'], ['Compute marketing ROI (ROMI) and CAC payback', 'Tính ROMI và thời gian hoàn vốn CAC'], ['Compute churn and expected lifetime', 'Tính tỷ lệ rời bỏ và tuổi đời kỳ vọng']],
    en: `<p>Management by numbers needs the right numbers. Group metrics by what they tell you:</p>` + tbl(['Group', 'Examples', 'Question answered'], [
      ['Market', 'Market share, relative share, penetration', 'Are we winning in the market?'],
      ['Customer', 'Acquisition cost, retention, churn, NPS, CLV', 'Are customers coming, staying, valuable?'],
      ['Brand', 'Awareness, consideration, preference (tracking studies)', 'Are we in people’s minds?'],
      ['Channel & communication', 'CTR, CPA, ROAS, sell-through, distribution coverage', 'Are programmes efficient?'],
      ['Financial', 'Revenue, contribution, ROMI, payback', 'Does it pay?']]) + `
<h4>Return on marketing investment</h4>` + fm('ROMI', 'ROMI = (incremental profit from marketing − marketing cost) ÷ marketing cost') + `
<div class="callout"><strong>Worked example (hypothetical).</strong> A campaign costs 200 million VND and is credited with 900 million of incremental revenue at a 30% gross margin. Incremental profit = 0.30 × 900 = 270 million. ROMI = (270 − 200) ÷ 200 = <strong>35%</strong>. The word <em>incremental</em> matters: count only sales that would not have happened without the campaign, which usually means comparing with a control group or a prior period adjusted for trend.</div>
<h4>Retention, churn and payback</h4>
<div class="callout"><strong>Worked example (hypothetical).</strong> A subscription loses 5% of customers each month. Expected lifetime = 1 ÷ 0.05 = <strong>20 months</strong>. Over a year the share who stay is 0.95<sup>12</sup> ≈ 54%, so about 46% leave, which is far higher than the "only 5%" feels. If CAC = 500,000 VND and monthly margin per customer = 50,000, payback = 500,000 ÷ 50,000 = <strong>10 months</strong>; because average lifetime is 20 months, the customer pays back twice over on average (before discounting).</div>
<h4>Good practice</h4>
<ul><li>Lead with 5–8 metrics on a dashboard, each with an owner and a target.</li><li>Prefer outcome metrics (profit, retention) to activity metrics (posts, impressions), but track both.</li><li>Beware attribution: customers see many touchpoints; last-click credit overrates the last channel. Use holdout tests where possible.</li><li>State the period and the definition of every metric so people compare like with like.</li></ul>`,
    vi: `<p>Quản trị bằng con số cần đúng con số. Nhóm chỉ số theo điều chúng cho biết:</p>` + tbl(['Nhóm', 'Ví dụ', 'Câu hỏi trả lời'], [
      ['Thị trường', 'Thị phần, thị phần tương đối, độ thâm nhập', 'Ta có đang thắng trên thị trường?'],
      ['Khách hàng', 'Chi phí thu hút, giữ chân, rời bỏ, NPS, CLV', 'Khách có đến, ở lại, có giá trị?'],
      ['Thương hiệu', 'Nhận biết, cân nhắc, ưa chuộng (nghiên cứu theo dõi)', 'Ta có trong tâm trí mọi người?'],
      ['Kênh & truyền thông', 'CTR, CPA, ROAS, tỷ lệ bán ra, độ phủ phân phối', 'Chương trình có hiệu quả?'],
      ['Tài chính', 'Doanh thu, đóng góp, ROMI, hoàn vốn', 'Có sinh lời không?']]) + `
<h4>Tỷ suất hoàn vốn đầu tư marketing</h4>` + fm('ROMI', 'ROMI = (lợi nhuận tăng thêm nhờ marketing − chi phí marketing) ÷ chi phí marketing') + `
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Chiến dịch tốn 200 triệu đồng và được ghi nhận 900 triệu doanh thu tăng thêm với biên lợi nhuận gộp 30%. Lợi nhuận tăng thêm = 0,30 × 900 = 270 triệu. ROMI = (270 − 200) ÷ 200 = <strong>35%</strong>. Chữ <em>tăng thêm</em> rất quan trọng: chỉ tính doanh số sẽ không xảy ra nếu thiếu chiến dịch, thường nghĩa là so với nhóm đối chứng hoặc kỳ trước đã điều chỉnh xu hướng.</div>
<h4>Giữ chân, rời bỏ và hoàn vốn</h4>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Dịch vụ thuê bao mất 5% khách mỗi tháng. Tuổi đời kỳ vọng = 1 ÷ 0,05 = <strong>20 tháng</strong>. Trong một năm tỷ lệ còn ở lại là 0,95<sup>12</sup> ≈ 54%, tức khoảng 46% rời đi, cao hơn nhiều so với cảm giác “chỉ 5%”. Nếu CAC = 500.000 đồng và biên mỗi khách mỗi tháng = 50.000, thời gian hoàn vốn = 500.000 ÷ 50.000 = <strong>10 tháng</strong>; vì tuổi đời trung bình là 20 tháng nên trung bình khách hoàn vốn gấp đôi (chưa chiết khấu).</div>
<h4>Thực hành tốt</h4>
<ul><li>Dẫn đầu bảng điều khiển bằng 5–8 chỉ số, mỗi chỉ số có người phụ trách và mục tiêu.</li><li>Ưu tiên chỉ số kết quả (lợi nhuận, giữ chân) hơn chỉ số hoạt động (số bài, lượt hiển thị), nhưng theo dõi cả hai.</li><li>Coi chừng quy gán: khách chạm nhiều điểm; ghi công cho lần nhấp cuối đánh giá quá cao kênh cuối. Dùng thử nghiệm nhóm đối chứng nếu có thể.</li><li>Nêu kỳ và định nghĩa của từng chỉ số để mọi người so sánh cùng cơ sở.</li></ul>`,
    pit: ['Counting all sales during a campaign as caused by it (sales that would have happened anyway are not incremental).', 'Tính mọi doanh số trong chiến dịch là do nó (doanh số vẫn xảy ra dù không có chiến dịch không phải phần tăng thêm).'],
    s: [['Group metrics: market, customer, brand, programme, financial.', 'Nhóm chỉ số: thị trường, khách hàng, thương hiệu, chương trình, tài chính.'], ['ROMI uses incremental profit, not revenue.', 'ROMI dùng lợi nhuận tăng thêm, không dùng doanh thu.'], ['Lifetime = 1 ÷ churn; payback = CAC ÷ monthly margin.', 'Tuổi đời = 1 ÷ tỷ lệ rời bỏ; hoàn vốn = CAC ÷ biên hằng tháng.']],
    l: ['meff', 'roi', 'cac', 'clv'],
    p: [['Cost 50 million, incremental revenue 300 million, margin 25%. ROMI?', 'Chi phí 50 triệu, doanh thu tăng thêm 300 triệu, biên 25%. ROMI?', 'Profit 75; ROMI = (75 − 50) ÷ 50 = 50%.', 'Lợi nhuận 75; ROMI = (75 − 50) ÷ 50 = 50%.'],
        ['Monthly churn 4%. Expected lifetime in months?', 'Tỷ lệ rời bỏ hằng tháng 4%. Tuổi đời kỳ vọng (tháng)?', '1 ÷ 0.04 = 25 months.', '1 ÷ 0,04 = 25 tháng.']] }),

  D(P + '8-2', '8.2 Marketing control and the marketing audit', '8.2 Kiểm soát marketing và kiểm toán marketing',
    'Bốn loại kiểm soát, phân tích chênh lệch giá/lượng, kiểm toán.', {
    n: '8.2',
    g: [['Name the four types of marketing control', 'Gọi tên bốn loại kiểm soát marketing'], ['Split a sales variance into price and volume', 'Tách chênh lệch doanh thu thành giá và lượng'], ['Outline a marketing audit', 'Phác một cuộc kiểm toán marketing']],
    en: `<p>Plans fail quietly unless someone checks them. Four kinds of control:</p>` + tbl(['Type', 'Purpose', 'Tools'], [
      ['Annual-plan control', 'Are we hitting this year’s targets?', 'Sales and share analysis, variance analysis, expense-to-sales ratio'],
      ['Profitability control', 'Where do we make or lose money?', 'Profit by product, segment, channel, customer'],
      ['Efficiency control', 'Can we spend better?', 'Sales-force, advertising, promotion, distribution efficiency'],
      ['Strategic control', 'Are we doing the right things?', 'Marketing audit, effectiveness review']]) + `
<h4>Variance analysis</h4>
<div class="callout"><strong>Worked example (hypothetical).</strong> Budget: 10,000 units at 50,000 VND = 500 million. Actual: 9,000 units at 52,000 = 468 million. Total variance = 468 − 500 = <strong>−32 million</strong>.<br>Price variance = (52,000 − 50,000) × 9,000 actual units = <strong>+18 million</strong>.<br>Volume variance = (9,000 − 10,000) × 50,000 budget price = <strong>−50 million</strong>.<br>Check: +18 − 50 = −32. The price rise helped, but volume fell more; the next question is why (competitor promotion, stock-outs, weaker demand). Variance analysis finds <em>where</em> to look, not <em>why</em>.</div>
<h4>Profitability by customer or channel</h4>
<p>Allocate revenue, cost of goods, and the costs to serve (delivery, returns, discounts, support). Many firms discover that the largest accounts or the most discounted channel produce the least profit once cost-to-serve is included. Activity-based costing helps; start with a rough version rather than none.</p>
<h4>Marketing audit</h4>
<p>A comprehensive, systematic, independent and periodic examination of the marketing environment, objectives, strategies and activities. Typical sections: macro- and task-environment; marketing strategy; organisation; systems; productivity; and each marketing-mix function. Use a checklist, interview people outside the marketing team, and finish with a ranked list of problems and actions with owners and dates.</p>
<p><strong>Contingency planning</strong>: write in advance what you will do if sales run 10% under plan or a rival launches a price attack, so the response is not improvised under pressure.</p>`,
    vi: `<p>Kế hoạch thất bại âm thầm nếu không ai kiểm tra. Bốn loại kiểm soát:</p>` + tbl(['Loại', 'Mục đích', 'Công cụ'], [
      ['Kiểm soát kế hoạch năm', 'Có đạt mục tiêu năm nay?', 'Phân tích doanh số và thị phần, phân tích chênh lệch, tỷ lệ chi phí trên doanh số'],
      ['Kiểm soát lợi nhuận', 'Ta lãi hay lỗ ở đâu?', 'Lợi nhuận theo sản phẩm, phân khúc, kênh, khách hàng'],
      ['Kiểm soát hiệu quả', 'Có chi tốt hơn được không?', 'Hiệu quả lực lượng bán, quảng cáo, khuyến mãi, phân phối'],
      ['Kiểm soát chiến lược', 'Ta có đang làm đúng việc?', 'Kiểm toán marketing, rà soát hiệu quả']]) + `
<h4>Phân tích chênh lệch</h4>
<div class="callout"><strong>Ví dụ có lời giải (giả định).</strong> Ngân sách: 10.000 đơn vị giá 50.000 đồng = 500 triệu. Thực tế: 9.000 đơn vị giá 52.000 = 468 triệu. Chênh lệch tổng = 468 − 500 = <strong>−32 triệu</strong>.<br>Chênh lệch giá = (52.000 − 50.000) × 9.000 đơn vị thực tế = <strong>+18 triệu</strong>.<br>Chênh lệch lượng = (9.000 − 10.000) × 50.000 giá kế hoạch = <strong>−50 triệu</strong>.<br>Kiểm: +18 − 50 = −32. Tăng giá có ích, nhưng lượng giảm nhiều hơn; câu hỏi tiếp theo là vì sao (đối thủ khuyến mãi, hết hàng, cầu yếu). Phân tích chênh lệch chỉ ra <em>nhìn ở đâu</em>, không phải <em>vì sao</em>.</div>
<h4>Lợi nhuận theo khách hàng hoặc kênh</h4>
<p>Phân bổ doanh thu, giá vốn và chi phí phục vụ (giao hàng, đổi trả, chiết khấu, hỗ trợ). Nhiều công ty phát hiện khách hàng lớn nhất hoặc kênh giảm giá nhiều nhất cho ít lợi nhuận nhất khi tính chi phí phục vụ. Chi phí theo hoạt động giúp ích; hãy bắt đầu bản thô còn hơn không làm.</p>
<h4>Kiểm toán marketing</h4>
<p>Một cuộc xem xét toàn diện, có hệ thống, độc lập và định kỳ về môi trường, mục tiêu, chiến lược và hoạt động marketing. Các phần điển hình: môi trường vĩ mô và môi trường tác nghiệp; chiến lược marketing; tổ chức; hệ thống; năng suất; và từng chức năng trong marketing hỗn hợp. Dùng danh mục kiểm tra, phỏng vấn người ngoài đội marketing, và kết thúc bằng danh sách vấn đề xếp hạng cùng hành động có người phụ trách và ngày.</p>
<p><strong>Kế hoạch dự phòng</strong>: viết trước điều sẽ làm nếu doanh số thấp hơn kế hoạch 10% hoặc đối thủ tấn công giá, để phản ứng không phải ứng biến dưới áp lực.</p>`,
    pit: ['Reading a total variance only; offsetting price and volume effects can hide a real problem.', 'Chỉ đọc chênh lệch tổng; hiệu ứng giá và lượng bù trừ nhau có thể che một vấn đề thật.'],
    s: [['Four controls: annual plan, profitability, efficiency, strategic.', 'Bốn kiểm soát: kế hoạch năm, lợi nhuận, hiệu quả, chiến lược.'], ['Price variance + volume variance = total variance.', 'Chênh lệch giá + chênh lệch lượng = chênh lệch tổng.'], ['Include cost-to-serve in profitability.', 'Đưa chi phí phục vụ vào lợi nhuận.']],
    l: ['meff', 'plan', 'roi'],
    p: [['Budget 8,000 units at 40,000; actual 8,500 at 38,000. Price and volume variance?', 'Kế hoạch 8.000 đơn vị giá 40.000; thực tế 8.500 giá 38.000. Chênh lệch giá và lượng?', 'Price: (38,000 − 40,000) × 8,500 = −17,000,000. Volume: (8,500 − 8,000) × 40,000 = +20,000,000. Total +3,000,000 (323,000,000 − 320,000,000).', 'Giá: (38.000 − 40.000) × 8.500 = −17.000.000. Lượng: (8.500 − 8.000) × 40.000 = +20.000.000. Tổng +3.000.000 (323.000.000 − 320.000.000).'],
        ['Why interview people outside the marketing team in an audit?', 'Vì sao kiểm toán cần phỏng vấn người ngoài đội marketing?', 'They see how marketing affects sales, operations and customers, and they are independent of the team being audited.', 'Họ thấy marketing tác động bán hàng, vận hành, khách hàng ra sao và độc lập với đội được kiểm toán.']] }),

  D(P + '8-3', '8.3 Ethics, social responsibility and sustainability', '8.3 Đạo đức, trách nhiệm xã hội và bền vững',
    'Đạo đức marketing, tẩy xanh, quyền riêng tư, nhóm dễ tổn thương, marketing bền vững.', {
    n: '8.3',
    g: [['Spot common ethical problems in the 4Ps', 'Nhận ra các vấn đề đạo đức thường gặp trong 4P'], ['Explain greenwashing and how to avoid it', 'Giải thích tẩy xanh và cách tránh'], ['Apply a simple ethical test to a decision', 'Áp dụng một phép thử đạo đức đơn giản cho quyết định']],
    en: `<p>Marketing shapes what people buy and believe, so it carries responsibility. The societal marketing view says a firm should meet customers' wants <em>and</em> long-term interests of customers and society. Ethical problems show up in every P:</p>
<ul><li><strong>Product</strong> — unsafe or misleading products, planned obsolescence that cannot be justified, hidden ingredients.</li><li><strong>Price</strong> — deceptive reference prices, drip pricing (fees revealed late), exploiting emergencies.</li><li><strong>Place</strong> — pushing unsuitable products through channels, unfair terms to small suppliers.</li><li><strong>Promotion</strong> — false or unprovable claims, undisclosed sponsorship, targeting children or other vulnerable groups, manipulative “dark patterns” in apps.</li></ul>
<h4>Data and privacy</h4>
<p>Personalisation depends on personal data. Be clear about what you collect and why, ask for consent, secure it, let people opt out, and follow the personal-data rules that apply to you.</p>
<h4>Greenwashing and sustainability</h4>
<p>Greenwashing is giving a false or exaggerated impression of environmental benefit: vague words (“eco”, “natural”) with no proof, a green image on a product whose main impact is unchanged, or highlighting one small improvement to hide a larger harm. To avoid it: make specific claims (“packaging contains X% recycled material, certified by Y”), have third-party evidence, report both progress and gaps, and match the claim to the product's real life-cycle impact. Sustainable marketing also includes reducing packaging, designing for repair or reuse, fair sourcing and honest communication about trade-offs.</p>
<h4>CSR and cause marketing</h4>
<p>Corporate social responsibility works when it connects to the business and is sustained, not a one-off campaign. Cause-related offers (“10% of price goes to a fund”) should state the amount, the beneficiary and the period.</p>
<div class="callout"><strong>A quick ethical test.</strong> (1) Is it legal? (2) Is it honest — would the claim survive if every detail were printed beside it? (3) Would the affected people agree if they understood it fully? (4) Would you be comfortable seeing it on the news or explaining it to your family? (5) What is the long-term effect on trust? If any answer is "no", change the plan.</div>`,
    vi: `<p>Marketing định hình điều người ta mua và tin, nên mang trách nhiệm. Quan điểm marketing xã hội nói doanh nghiệp nên đáp ứng mong muốn của khách hàng <em>và</em> lợi ích dài hạn của khách hàng và xã hội. Vấn đề đạo đức xuất hiện ở mọi P:</p>
<ul><li><strong>Sản phẩm</strong> — sản phẩm không an toàn hoặc gây hiểu lầm, lỗi thời có kế hoạch không biện minh được, thành phần che giấu.</li><li><strong>Giá</strong> — giá tham chiếu gây hiểu lầm, giá nhỏ giọt (phí lộ muộn), lợi dụng tình huống khẩn cấp.</li><li><strong>Phân phối</strong> — đẩy sản phẩm không phù hợp qua kênh, điều khoản bất công với nhà cung cấp nhỏ.</li><li><strong>Xúc tiến</strong> — tuyên bố sai hoặc không chứng minh được, tài trợ không công khai, nhắm trẻ em hoặc nhóm dễ tổn thương, “dark pattern” thao túng trong app.</li></ul>
<h4>Dữ liệu và quyền riêng tư</h4>
<p>Cá nhân hoá dựa vào dữ liệu cá nhân. Hãy nói rõ thu gì và để làm gì, xin đồng ý, bảo mật, cho phép từ chối và tuân thủ quy định dữ liệu cá nhân áp dụng với bạn.</p>
<h4>Tẩy xanh và bền vững</h4>
<p>Tẩy xanh là tạo ấn tượng sai hoặc phóng đại về lợi ích môi trường: từ mơ hồ (“eco”, “tự nhiên”) không có bằng chứng, hình ảnh xanh trên sản phẩm có tác động chính không đổi, hoặc nêu một cải thiện nhỏ để che tác hại lớn hơn. Để tránh: nêu tuyên bố cụ thể (“bao bì chứa X% vật liệu tái chế, được Y chứng nhận”), có bằng chứng bên thứ ba, báo cáo cả tiến bộ lẫn khoảng trống, và khớp tuyên bố với tác động thật trong vòng đời sản phẩm. Marketing bền vững còn gồm giảm bao bì, thiết kế để sửa hoặc tái sử dụng, tìm nguồn công bằng và truyền thông trung thực về đánh đổi.</p>
<h4>CSR và marketing vì mục đích xã hội</h4>
<p>Trách nhiệm xã hội doanh nghiệp hiệu quả khi gắn với hoạt động kinh doanh và duy trì lâu dài, không phải chiến dịch một lần. Ưu đãi gắn mục đích (“10% giá bán chuyển vào quỹ”) nên nêu số tiền, đơn vị thụ hưởng và thời gian.</p>
<div class="callout"><strong>Phép thử đạo đức nhanh.</strong> (1) Có hợp pháp không? (2) Có trung thực không — tuyên bố có đứng vững nếu in mọi chi tiết bên cạnh? (3) Những người bị ảnh hưởng có đồng ý nếu hiểu đầy đủ? (4) Bạn có thoải mái khi thấy nó lên bản tin hay giải thích với gia đình? (5) Tác động dài hạn lên niềm tin là gì? Nếu có câu trả lời “không”, hãy đổi kế hoạch.</div>`,
    pit: ['Treating “everyone does it” as a justification. Competitors\' behaviour does not make a claim true or a practice fair.', 'Coi “ai cũng làm vậy” là lý do biện minh. Hành vi của đối thủ không làm tuyên bố thành đúng hay thực hành thành công bằng.'],
    s: [['Societal marketing balances wants, customer interest and society.', 'Marketing xã hội cân bằng mong muốn, lợi ích khách hàng và xã hội.'], ['Greenwashing = vague or unproven environmental claims.', 'Tẩy xanh = tuyên bố môi trường mơ hồ hoặc không chứng minh được.'], ['Use the five-question ethical test before launch.', 'Dùng phép thử đạo đức năm câu hỏi trước khi triển khai.']],
    l: ['ethics', 'green', 'csr', 'smk', 'unGC'],
    p: [['A bottle says “100% natural, eco friendly” with no explanation. Which problem?', 'Chai ghi “100% tự nhiên, thân thiện môi trường” không giải thích. Vấn đề gì?', 'Possible greenwashing: vague claims without evidence. Ask for specifics and certification.', 'Có thể là tẩy xanh: tuyên bố mơ hồ không bằng chứng. Hỏi chi tiết và chứng nhận.'],
        ['An app shows a shipping fee only on the last screen. Which ethical issue?', 'App chỉ hiện phí giao hàng ở màn hình cuối. Vấn đề đạo đức nào?', 'Drip pricing (hidden fees).', 'Giá nhỏ giọt (phí che giấu).']] }),

  D(P + '8-4', '8.4 Capstone: putting together a marketing plan', '8.4 Tổng kết: ghép thành một kế hoạch marketing',
    'Quy trình lập kế hoạch một trang, danh mục kiểm tra, ví dụ tính toán liên kết.', {
    n: '8.4',
    g: [['Combine the course tools into a one-page plan', 'Kết hợp các công cụ của khoá thành kế hoạch một trang'], ['Check consistency between target, positioning, price and channel', 'Kiểm tra tính nhất quán giữa mục tiêu, định vị, giá và kênh'], ['Run a final numeric sanity check', 'Chạy phép kiểm tra số học cuối cùng']],
    en: `<p>Pick a real or imagined product, for example a student-focused meal-prep subscription. Work through the course in order and write one line per step.</p>
<ol><li><strong>Situation (Ch. 1–2)</strong>: three PESTLE trends, three main competitors, one research question.</li><li><strong>Customer (Ch. 3)</strong>: top three buying criteria, journey pain point.</li><li><strong>STP (Ch. 4)</strong>: segment, target, positioning statement.</li><li><strong>Offer (Ch. 5)</strong>: core benefit, augmented features, service elements, life-cycle stage.</li><li><strong>Price (Ch. 6)</strong>: approach, price, break-even.</li><li><strong>Channel and communication (Ch. 7)</strong>: channels, message, tools, budget.</li><li><strong>Control and ethics (Ch. 8)</strong>: metrics, targets, review dates, ethical check.</li></ol>
<div class="callout"><strong>Worked sanity check (hypothetical).</strong> Price 60,000 VND per meal box, variable cost 36,000, fixed cost 48,000,000 per month. Contribution = 24,000; BEP = 48,000,000 ÷ 24,000 = <strong>2,000 boxes</strong> a month. Target market: 50,000 students reachable; if 4% subscribe once per week for 4 weeks, boxes = 50,000 × 0.04 × 4 = 8,000, well above BEP. But is 4% realistic? Test with a pilot: if only 0.8% subscribe, boxes = 1,600 &lt; 2,000, and the plan loses money, so you need either a higher price, lower fixed cost or more reach. Marketing spend: CAC budget of 50,000 per subscriber; a subscriber ordering 4 boxes a month with contribution 24,000 each gives 96,000 a month, so payback is under one month at that CAC (50,000 ÷ 96,000 ≈ 0.5 months), but only while churn is low; check retention.</div>
<h4>Consistency checklist</h4>
<ul><li>Does the price match the positioning (premium story, discount price = mixed signal)?</li><li>Do channels reach the target where they actually shop?</li><li>Is the promise in communication deliverable by operations?</li><li>Is every objective measurable, with an owner and a date?</li><li>Have we stated assumptions and a low/base/high scenario?</li></ul>
<p>Present the plan in five minutes: the problem, the target, the offer, the numbers, the risks. Review it with someone outside the team. Then run a small pilot before committing the full budget.</p>
<div class="note-ct">Next steps: brand equity depth in the BRA201 course; Code Lab and Exam Room practice on this site for numeric questions.</div>`,
    vi: `<p>Chọn một sản phẩm thật hoặc tưởng tượng, ví dụ dịch vụ thuê bao hộp bữa ăn chuẩn bị sẵn cho sinh viên. Đi qua khoá theo thứ tự và viết một dòng cho mỗi bước.</p>
<ol><li><strong>Tình huống (Ch. 1–2)</strong>: ba xu hướng PESTLE, ba đối thủ chính, một câu hỏi nghiên cứu.</li><li><strong>Khách hàng (Ch. 3)</strong>: ba tiêu chí mua hàng đầu, một điểm nghẽn trong hành trình.</li><li><strong>STP (Ch. 4)</strong>: phân khúc, mục tiêu, tuyên bố định vị.</li><li><strong>Chào bán (Ch. 5)</strong>: lợi ích cốt lõi, tính năng bổ sung, yếu tố dịch vụ, giai đoạn vòng đời.</li><li><strong>Giá (Ch. 6)</strong>: cách tiếp cận, giá, hoà vốn.</li><li><strong>Kênh và truyền thông (Ch. 7)</strong>: kênh, thông điệp, công cụ, ngân sách.</li><li><strong>Kiểm soát và đạo đức (Ch. 8)</strong>: chỉ số, mục tiêu, ngày rà soát, kiểm tra đạo đức.</li></ol>
<div class="callout"><strong>Kiểm tra số học có lời giải (giả định).</strong> Giá 60.000 đồng mỗi hộp, biến phí 36.000, định phí 48.000.000 mỗi tháng. Đóng góp = 24.000; BEP = 48.000.000 ÷ 24.000 = <strong>2.000 hộp</strong> mỗi tháng. Thị trường mục tiêu: 50.000 sinh viên tiếp cận được; nếu 4% đăng ký, mỗi tuần một hộp trong 4 tuần, số hộp = 50.000 × 0,04 × 4 = 8.000, vượt xa BEP. Nhưng 4% có thực tế không? Hãy thử bằng thí điểm: nếu chỉ 0,8% đăng ký, số hộp = 1.600 &lt; 2.000, kế hoạch lỗ, nên cần giá cao hơn, định phí thấp hơn hoặc tiếp cận rộng hơn. Chi phí marketing: ngân sách CAC 50.000 mỗi người đăng ký; người đặt 4 hộp mỗi tháng với đóng góp 24.000 mỗi hộp cho 96.000 mỗi tháng, nên hoàn vốn dưới một tháng ở mức CAC đó (50.000 ÷ 96.000 ≈ 0,5 tháng), nhưng chỉ khi tỷ lệ rời bỏ thấp; hãy kiểm tra giữ chân.</div>
<h4>Danh mục kiểm tra tính nhất quán</h4>
<ul><li>Giá có khớp định vị không (câu chuyện cao cấp, giá rẻ = tín hiệu lẫn lộn)?</li><li>Kênh có chạm mục tiêu ở nơi họ thực sự mua sắm không?</li><li>Lời hứa trong truyền thông có được vận hành thực hiện được không?</li><li>Mọi mục tiêu có đo được, có người phụ trách và ngày không?</li><li>Đã nêu giả định và kịch bản thấp/cơ sở/cao chưa?</li></ul>
<p>Trình bày kế hoạch trong năm phút: vấn đề, mục tiêu, chào bán, con số, rủi ro. Nhờ người ngoài đội xem. Sau đó chạy thí điểm nhỏ trước khi cam kết toàn bộ ngân sách.</p>
<div class="note-ct">Bước tiếp: chiều sâu về giá trị thương hiệu ở khoá BRA201; luyện thêm câu hỏi số trong Code Lab và Exam Room trên trang này.</div>`,
    pit: ['Writing a plan where each section is fine alone but the sections contradict each other.', 'Viết kế hoạch mà từng phần ổn nhưng các phần mâu thuẫn nhau.'],
    s: [['One line per step is enough to expose gaps.', 'Một dòng cho mỗi bước đủ để lộ khoảng trống.'], ['Check break-even against realistic adoption, not hopeful adoption.', 'Kiểm hoà vốn với mức chấp nhận thực tế, không phải mức hy vọng.'], ['Pilot before spending the whole budget.', 'Thí điểm trước khi chi toàn bộ ngân sách.']],
    l: ['plan', 'strat', 'mgmt'],
    p: [['Using the sanity check, how many subscribers (4 boxes a month each) does the plan need to reach BEP?', 'Với phép kiểm tra trên, cần bao nhiêu người đăng ký (mỗi người 4 hộp/tháng) để hoà vốn?', '2,000 ÷ 4 = 500 subscribers.', '2.000 ÷ 4 = 500 người đăng ký.'],
        ['What share of the 50,000 reachable students is that?', 'Đó là bao nhiêu phần trăm trong 50.000 sinh viên tiếp cận được?', '500 ÷ 50,000 = 1%.', '500 ÷ 50.000 = 1%.']] }),

  Q(P + 'quiz-8', 'Quiz — Chapter 8', 'Quiz — Chương 8', [
    ['ROMI uses', 'ROMI dùng', [['Revenue', 'Doanh thu'], ['Incremental profit', 'Lợi nhuận tăng thêm'], ['Impressions', 'Lượt hiển thị'], ['Followers', 'Lượt theo dõi']], 1, 'Incremental profit net of cost.', 'Lợi nhuận tăng thêm trừ chi phí.'],
    ['Profit 270, cost 200. ROMI =', 'Lợi nhuận 270, chi phí 200. ROMI =', ['27%', '35%', '70%', '135%'], 1, '(270 − 200) ÷ 200 = 35%.', '(270 − 200) ÷ 200 = 35%.'],
    ['Monthly churn 5% gives expected lifetime', 'Rời bỏ 5%/tháng cho tuổi đời kỳ vọng', ['5 months', '10 months', '20 months', '50 months'], 2, '1 ÷ 0.05 = 20.', '1 ÷ 0,05 = 20.'],
    ['CAC 500,000, monthly margin 50,000. Payback =', 'CAC 500.000, biên hằng tháng 50.000. Hoàn vốn =', ['5 months', '10 months', '20 months', '25 months'], 1, '500,000 ÷ 50,000 = 10.', '500.000 ÷ 50.000 = 10.'],
    ['Price variance when actual price is 52,000, budget 50,000 and actual units 9,000:', 'Chênh lệch giá khi giá thực tế 52.000, kế hoạch 50.000, thực tế 9.000 đơn vị:', ['+18 million', '−50 million', '−32 million', '+2 million'], 0, '2,000 × 9,000 = 18 million.', '2.000 × 9.000 = 18 triệu.'],
    ['A marketing audit should be', 'Kiểm toán marketing nên', [['Occasional and internal only', 'Thỉnh thoảng và chỉ nội bộ'], ['Comprehensive, systematic, independent, periodic', 'Toàn diện, có hệ thống, độc lập, định kỳ'], ['A one-off sales report', 'Báo cáo bán hàng một lần'], ['A social media count', 'Thống kê mạng xã hội']], 1, 'That is its standard description.', 'Đó là mô tả chuẩn của nó.'],
    ['Vague claims such as “eco” with no evidence are called', 'Tuyên bố mơ hồ như “eco” không bằng chứng gọi là', [['Cause marketing', 'Marketing vì mục đích xã hội'], ['Greenwashing', 'Tẩy xanh'], ['Penetration', 'Thâm nhập'], ['Segmentation', 'Phân khúc']], 1, 'Greenwashing.', 'Tẩy xanh.'],
    ['A fee revealed only on the last checkout screen is', 'Phí chỉ hiện ở màn hình thanh toán cuối là', [['Value pricing', 'Định giá theo giá trị'], ['Drip pricing', 'Giá nhỏ giọt'], ['Skimming', 'Hớt váng'], ['Bundling', 'Gói sản phẩm']], 1, 'Drip pricing misleads buyers.', 'Giá nhỏ giọt gây hiểu lầm người mua.'],
  ]),
]));
export default secs;
